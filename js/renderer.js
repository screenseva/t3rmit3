// renderer.js

// REMOVED: import * as PIXI from 'pixi.js'; // Use global PIXI from script tag
import {
    PARAMS,
    BASE_CELL_SIZE,
    DIRECTIONS,
    // Add state constants needed for drawing
    STATE_WHITE, STATE_BLACK, STATE_GRAY, STATE_DARK_GRAY
} from './constants.js';
import {
    updateSimulation,           // Called by gameLoop
    getSimulationState,         // Needed for drawing
    getDirtyCellsInfo,          // Needed for optimized drawing
    initializeGrid,             // No longer called directly by renderer on resize
    resetSimulationForResize,   // NEW: Called by applyCanvasSize
    getCellTileState, isMitePresent, getMiteDirection, getTileStateFromCell, // Needed for drawing helpers
    dynamicCellSize, // Import dynamic size
    isImageLoaded, // Import image flag
    setDynamicCellSize // Import setter
    // encodeCellState - Removed, renderer shouldn't encode state
    // setCellState - Removed, renderer shouldn't modify state directly
    // isTurmitePresent - Removed, use getSimulationState().turmiteX !== undefined
    // getIndex - Removed, renderer shouldn't need grid index logic
    // getCellState - Removed, renderer gets full grid from getSimulationState
    // getMiteDirection - Imported above
} from './simulation.js';
import { getColor } from './palettes.js'; 

// --- PixiJS App and Stage Variables ---
let app;
let worldContainer;
let turmiteGraphics;

// --- Chunking Variables ---
const CHUNK_SIZE = 32; // Number of cells per chunk dimension (e.g., 32x32 cells)
let chunks = []; // Array to hold { sprite: PIXI.Sprite, texture: PIXI.RenderTexture, dirty: boolean, graphics: PIXI.Graphics }
let numChunksX = 0;
let numChunksY = 0;
let chunkRenderGraphics = null; // Reusable graphics object for rendering chunks

// --- Renderer State Variables ---
let currentGridWidth = 0;
let currentGridHeight = 0;

// --- Helper Functions ---
function hexStringToNumber(hexString) {
    if (!hexString) return 0x000000;
    return parseInt(hexString.replace('#', ''), 16);
}

/** Recalculates internal renderer grid dimensions and returns them. */
function updateGridDimensions() {
  currentGridWidth = Math.floor(PARAMS.canvasWidth / BASE_CELL_SIZE);
  currentGridHeight = Math.floor(PARAMS.canvasHeight / BASE_CELL_SIZE);
  currentGridWidth = Math.max(currentGridWidth, 1);
  currentGridHeight = Math.max(currentGridHeight, 1);
  console.log(`Renderer updated internal grid dimensions: ${currentGridWidth}x${currentGridHeight}`);
  return { width: currentGridWidth, height: currentGridHeight };
}

// --- Initialization --- //

/** Initializes the PixiJS Application and sets up the stage and chunks. */
export function initializeRenderer(initialParams) {
  // Use window dimensions for initial size, ignoring initialParams for size
  const initialWidth = window.innerWidth;
  const initialHeight = window.innerHeight;

  // Update PARAMS to reflect the actual initial size used
  PARAMS.canvasWidth = initialWidth;
  PARAMS.canvasHeight = initialHeight;

  // Create PixiJS Application
  app = new PIXI.Application({
      width: initialWidth,  // Use window width
      height: initialHeight, // Use window height
      backgroundColor: hexStringToNumber(initialParams.backgroundColor),
      antialias: false, // Often better for pixel art / grid patterns
      autoDensity: true, // Adjust for screen resolution
      resolution: window.devicePixelRatio || 1, // Use device pixel ratio
  });
  document.body.appendChild(app.view);
  app.view.style.display = 'block';

  // Create main containers
  worldContainer = new PIXI.Container();
  app.stage.addChild(worldContainer);

  // Create graphics objects
  turmiteGraphics = new PIXI.Graphics();
  worldContainer.addChild(turmiteGraphics);

  // Reusable graphics for chunk rendering
  chunkRenderGraphics = new PIXI.Graphics();

  // Set initial grid dimensions used by the renderer
  const { width, height } = updateGridDimensions();

  // Initialize simulation state for the first time
  initializeGrid(initialParams.pattern, width, height, true);

  // --- Create Chunks ---
  setupChunks(width, height);

  // --- Setup PixiJS Ticker --- //
  app.ticker.minFPS = 1;
  app.ticker.maxFPS = initialParams.speed;
  app.ticker.add(gameLoop);

  console.log("PixiJS Renderer Initialized with Chunking");

  // Return the app instance if needed elsewhere
  return app;
}

/** Creates or recreates the chunk structure based on grid dimensions. */
function setupChunks(gridW, gridH) {
    // Clear existing chunks if any
    chunks.forEach(chunk => {
        if (chunk.sprite) chunk.sprite.destroy(true); // Destroy sprite and texture
        if (chunk.graphics) chunk.graphics.destroy(); // Destroy associated graphics if we store them per chunk (alternative)
    });
    worldContainer.removeChildren(); // Remove old chunk sprites
    worldContainer.addChild(turmiteGraphics); // Re-add turmite graphics on top
    chunks = [];

    numChunksX = Math.ceil(gridW / CHUNK_SIZE);
    numChunksY = Math.ceil(gridH / CHUNK_SIZE);

    const cellRenderSize = dynamicCellSize; // Use current dynamic size
    const chunkPixelWidth = CHUNK_SIZE * cellRenderSize;
    const chunkPixelHeight = CHUNK_SIZE * cellRenderSize;

    console.log(`Setting up ${numChunksX}x${numChunksY} chunks. Cell size: ${cellRenderSize}, Chunk pixel size: ${chunkPixelWidth}x${chunkPixelHeight}`);

    if (chunkPixelWidth <= 0 || chunkPixelHeight <= 0) {
        console.error("Cannot create chunks with zero or negative pixel dimensions. Aborting setupChunks.");
        numChunksX = 0;
        numChunksY = 0;
        return; // Prevent errors
    }

    for (let cy = 0; cy < numChunksY; cy++) {
        for (let cx = 0; cx < numChunksX; cx++) {
            const texture = PIXI.RenderTexture.create({ width: chunkPixelWidth, height: chunkPixelHeight });
            const sprite = new PIXI.Sprite(texture);
            sprite.x = cx * chunkPixelWidth;
            sprite.y = cy * chunkPixelHeight;

            chunks.push({
                sprite: sprite,
                texture: texture,
                dirty: true, // Initially mark all chunks as dirty
                cx: cx, // Store chunk coordinates
                cy: cy
            });
            worldContainer.addChild(sprite); // Add chunk sprite to the world
        }
    }
    console.log(`Created ${chunks.length} chunks.`);
}

// --- Main Loop --- //

/** The main game loop, called by the PixiJS ticker. */
function gameLoop(delta) {
    if (PARAMS.running) {
        // Run multiple simulation steps per frame
        const steps = PARAMS.simStepsPerFrame;
        for (let i = 0; i < steps; i++) {
             updateSimulation();
        }
    }
    // Draw the result once after all steps for this frame
    drawGrid();
}

// --- Canvas Size Handling --- //

/** Resizes the PixiJS renderer view. */
export function resizeRenderer(width, height) {
    if (app && app.renderer) {
        app.renderer.resize(width, height);
        console.log(`PixiJS renderer resized to ${width}x${height}`);
    } else {
        console.error("Cannot resize renderer: PixiJS App not initialized.");
    }
}

/** Applies the user-defined canvas size from PARAMS. */
export function applyCanvasSize() {
    console.log(`Applying new canvas size: ${PARAMS.canvasWidth}x${PARAMS.canvasHeight}`);
    // Clamp values within PARAMS
    PARAMS.canvasWidth = Math.max(PARAMS.canvasWidth, BASE_CELL_SIZE * 5);
    PARAMS.canvasHeight = Math.max(PARAMS.canvasHeight, BASE_CELL_SIZE * 5);
    PARAMS.canvasWidth = Math.min(PARAMS.canvasWidth, screen.width);
    PARAMS.canvasHeight = Math.min(PARAMS.canvasHeight, screen.height);

    // Resize the actual PixiJS view
    resizeRenderer(PARAMS.canvasWidth, PARAMS.canvasHeight);

    // Check if an image grid is loaded using the imported flag
    if (isImageLoaded) { 
        const simState = getSimulationState();
        const currentGridWidth = simState.gridWidth;
        const currentGridHeight = simState.gridHeight;
        // Recalculate dynamic cell size based on new canvas size and *existing* grid size
        let newDynamicCellSize = Math.max(1, Math.floor(
            Math.min(PARAMS.canvasWidth / currentGridWidth, PARAMS.canvasHeight / currentGridHeight)
        ));
        setDynamicCellSize(newDynamicCellSize);
        console.log(`Canvas resized while image loaded. New dynamicCellSize: ${newDynamicCellSize}`);
        // No need to re-initialize grid, just force redraw
        forceFullRedraw();
    } else {
        // Get the *resulting* grid dimensions after potential clamping/base_size division
        const { width: newGridWidth, height: newGridHeight } = updateGridDimensions(); // Assumes updateGridDimensions exists and works for non-image case
        // Reset the simulation state using the new dimensions
        resetSimulationForResize(PARAMS.pattern, newGridWidth, newGridHeight);
    }
}

/**
 * Reads the current simulation state (grid dimensions, cell size) 
 * and rebuilds the renderer's chunk structure accordingly.
 */
export function rebuildChunksForSimulationState() {
    console.log("Renderer rebuilding chunks based on simulation state...");
    const simState = getSimulationState();
    if (!simState) {
        console.error("Cannot rebuild chunks: Simulation state not available.");
        return;
    }
    const gridW = simState.gridWidth;
    const gridH = simState.gridHeight;
    // Note: dynamicCellSize is directly accessed within setupChunks,
    // assuming simulation.js has updated it via setDynamicCellSize.
    
    if (gridW > 0 && gridH > 0) {
        setupChunks(gridW, gridH);
    } else {
        console.warn(`Attempted to rebuild chunks with invalid dimensions: ${gridW}x${gridH}`);
    }
    // No need to call forceFullRedraw here, setupChunks marks all chunks dirty.
}

/**
 * Extracts the current PIXI canvas content and copies it to the clipboard as a PNG image.
 */
export async function copyCanvasToClipboard() {
    if (!app || !app.renderer) {
        throw new Error("PixiJS App or renderer not available.");
    }

    // Extract the current view as a canvas element
    // Note: extract.canvas() returns the *view* canvas. If we only wanted the worldContainer,
    // we might need app.renderer.render(worldContainer, { renderTexture: tempTexture }) first.
    // For a direct screenshot, using the view is usually correct.
    const canvas = app.renderer.extract.canvas(app.stage); // Extract the entire stage

    return new Promise((resolve, reject) => {
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            if (!blob) {
                return reject(new Error("Canvas toBlob() failed to create a blob."));
            }
            try {
                // Create a ClipboardItem
                const item = new ClipboardItem({ 'image/png': blob });
                // Write to clipboard
                await navigator.clipboard.write([item]);
                console.log("Frame copied to clipboard.");
                resolve();
            } catch (err) {
                console.error("Clipboard API error:", err);
                reject(err); // Forward the clipboard error
            }
        }, 'image/png'); // Specify PNG format
    });
}

// --- Drawing Functions --- //

/** Redraws dirty chunks and the turmite. */
function drawGrid() {
    if (!app || !worldContainer || !turmiteGraphics || !chunkRenderGraphics) return;

    // --- Apply Zoom/Pan to World Container ---
    worldContainer.scale.set(PARAMS.zoom);
    let translateX = 0;
    let translateY = 0;
    const simState = getSimulationState(); // Get current simulation state
    if (!simState || !simState.grid) {
        console.warn("drawGrid called with no simulation state or grid.");
        return; // Can't draw without state
    }
    const currentSimGridWidth = simState.gridWidth;
    const currentSimGridHeight = simState.gridHeight;
    const cellRenderSize = dynamicCellSize; // Use dynamic size for rendering

    if (cellRenderSize <= 0) {
        console.warn("drawGrid: cellRenderSize is zero or negative. Skipping draw.");
        return;
    }

    // Calculate world dimensions based on simulation grid and cell size
    const worldPixelWidth = currentSimGridWidth * cellRenderSize;
    const worldPixelHeight = currentSimGridHeight * cellRenderSize;

    if (PARAMS.followTurmite && simState.turmiteX !== undefined) {
        let targetX = app.screen.width / 2;
        let targetY = app.screen.height / 2;
        let miteWorldX = simState.turmiteX * cellRenderSize + cellRenderSize / 2;
        let miteWorldY = simState.turmiteY * cellRenderSize + cellRenderSize / 2;
        translateX = targetX - miteWorldX * PARAMS.zoom;
        translateY = targetY - miteWorldY * PARAMS.zoom;
    } else {
        // Center based on the calculated world size
        translateX = app.screen.width / 2 - (worldPixelWidth / 2) * PARAMS.zoom;
        translateY = app.screen.height / 2 - (worldPixelHeight / 2) * PARAMS.zoom;
    }
    worldContainer.position.set(translateX, translateY);

    // --- Update Background Color ---
    app.renderer.background.color = hexStringToNumber(PARAMS.backgroundColor);

    // --- Get Rendering Info from Simulation ---
    const dirtyInfo = getDirtyCellsInfo(); // Gets dirty cells AND if full redraw needed
    const grid = simState.grid;

    // --- Mark Chunks as Dirty ---
    if (dirtyInfo.needsFullRedraw) {
        // Mark all chunks dirty (already handled by setupChunks during resize/reset)
        // Ensure all are marked dirty if flag is set for other reasons
        chunks.forEach(chunk => chunk.dirty = true);
    } else if (dirtyInfo.cells.size > 0) {
        for (let index of dirtyInfo.cells) {
            let simX = index % currentSimGridWidth;
            let simY = Math.floor(index / currentSimGridWidth);
            let chunkX = Math.floor(simX / CHUNK_SIZE);
            let chunkY = Math.floor(simY / CHUNK_SIZE);
            let chunkIndex = chunkY * numChunksX + chunkX;
            if (chunkIndex >= 0 && chunkIndex < chunks.length) {
                chunks[chunkIndex].dirty = true;
            }
        }
    }

    // --- Re-render Dirty Chunks ---
    // Calculate visible bounds in world coordinates
    const view = app.screen; // Get screen dimensions
    const worldTransform = worldContainer.transform.worldTransform;
    
    // Calculate view corners in world space
    const topLeft = worldContainer.toLocal(new PIXI.Point(0, 0));
    const topRight = worldContainer.toLocal(new PIXI.Point(view.width, 0));
    const bottomLeft = worldContainer.toLocal(new PIXI.Point(0, view.height));
    const bottomRight = worldContainer.toLocal(new PIXI.Point(view.width, view.height));

    const minVisibleX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const maxVisibleX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    const minVisibleY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    const maxVisibleY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    // Calculate chunk index range to check based on visibility
    const chunkPixelWidth = CHUNK_SIZE * cellRenderSize;
    const chunkPixelHeight = CHUNK_SIZE * cellRenderSize;

    // Add a small buffer to avoid culling chunks that are just slightly off-screen
    const buffer = 1;
    const minChunkX = Math.max(0, Math.floor(minVisibleX / chunkPixelWidth) - buffer);
    const maxChunkX = Math.min(numChunksX - 1, Math.floor(maxVisibleX / chunkPixelWidth) + buffer);
    const minChunkY = Math.max(0, Math.floor(minVisibleY / chunkPixelHeight) - buffer);
    const maxChunkY = Math.min(numChunksY - 1, Math.floor(maxVisibleY / chunkPixelHeight) + buffer);

    // Use the reusable graphics object
    const graphics = chunkRenderGraphics;
    let chunksRendered = 0;
    let visibleChunksChecked = 0;
    // Iterate only over potentially visible chunks
    for (let cy = minChunkY; cy <= maxChunkY; cy++) {
        for (let cx = minChunkX; cx <= maxChunkX; cx++) {
            const chunkIndex = cy * numChunksX + cx;
            if (chunkIndex < 0 || chunkIndex >= chunks.length) continue; // Should not happen with clamping, but safety check
            
            const chunk = chunks[chunkIndex];
            visibleChunksChecked++;

            if (chunk.dirty) {
                graphics.clear();
                const startSimX = chunk.cx * CHUNK_SIZE;
                const startSimY = chunk.cy * CHUNK_SIZE;

                // Draw cells belonging to this chunk onto the graphics object
                for (let y = 0; y < CHUNK_SIZE; y++) {
                    const simY = startSimY + y;
                    if (simY >= currentSimGridHeight) continue; // Stay within grid bounds

                    for (let x = 0; x < CHUNK_SIZE; x++) {
                        const simX = startSimX + x;
                        if (simX >= currentSimGridWidth) continue; // Stay within grid bounds

                        const gridIndex = simY * currentSimGridWidth + simX;
                        if (gridIndex < grid.length) {
                            // Draw cell relative to chunk origin (0,0)
                            drawSingleCellPixi(graphics, x, y, grid[gridIndex], cellRenderSize);
                        } else {
                            // Handle potential out-of-bounds access gracefully (though should ideally not happen)
                             // Optionally draw background or empty cell
                             graphics.beginFill(hexStringToNumber(PARAMS.backgroundColor)); // Or default color
                             graphics.drawRect(x * cellRenderSize, y * cellRenderSize, cellRenderSize, cellRenderSize);
                             graphics.endFill();
                        }
                    }
                }

                // Render the graphics object to the chunk's texture
                app.renderer.render(graphics, { renderTexture: chunk.texture, clear: true });
                chunk.dirty = false; // Mark as clean
                chunksRendered++;
            }
        }
    }
    // if (chunksRendered > 0 || visibleChunksChecked > 0) console.log(`Rendered ${chunksRendered} / Checked ${visibleChunksChecked} visible chunks this frame.`);

    // --- Draw Turmite --- //
    turmiteGraphics.clear();
    let turmiteColorNum = hexStringToNumber(PARAMS.turmiteColor);

    if (grid && currentSimGridWidth > 0 && currentSimGridHeight > 0 && simState.turmiteX !== undefined) {
         // Calculate turmite position relative to the world container's origin
         let turmiteWorldX = simState.turmiteX * cellRenderSize;
         let turmiteWorldY = simState.turmiteY * cellRenderSize;

         // Turmite size uses step size modifier
         let turmiteDrawSize = cellRenderSize * 0.8 * PARAMS.turmiteStepSize;

         turmiteGraphics.beginFill(turmiteColorNum);
         // Draw relative to cell corner (0,0) of the turmite's cell, then add offset
         turmiteGraphics.drawCircle(turmiteWorldX + cellRenderSize / 2, turmiteWorldY + cellRenderSize / 2, turmiteDrawSize / 2);
         turmiteGraphics.endFill();

         if (PARAMS.showDirection && simState.turmiteDir !== undefined) {
             let dirVector = DIRECTIONS[simState.turmiteDir];
             if (dirVector) {
                 let turmiteCenterX = turmiteWorldX + cellRenderSize / 2;
                 let turmiteCenterY = turmiteWorldY + cellRenderSize / 2;
                 let lineEndX = turmiteCenterX + dirVector.dx * (turmiteDrawSize / 2);
                 let lineEndY = turmiteCenterY + dirVector.dy * (turmiteDrawSize / 2);
                 turmiteGraphics.lineStyle(Math.max(1, cellRenderSize * 0.1 * PARAMS.turmiteStepSize), 0xFFFFFF, 1);
                 turmiteGraphics.moveTo(turmiteCenterX, turmiteCenterY);
                 turmiteGraphics.lineTo(lineEndX, lineEndY);
             }
         }
    }

     // --- Debug: Optionally draw chunk boundaries ---
    /*
    if (PARAMS.debugShowChunkBoundaries) {
        const chunkPixelWidth = CHUNK_SIZE * cellRenderSize;
        const chunkPixelHeight = CHUNK_SIZE * cellRenderSize;
        turmiteGraphics.lineStyle(1, 0xFF00FF, 0.5); // Pink, semi-transparent
        for (let cy = 0; cy < numChunksY; cy++) {
            for (let cx = 0; cx < numChunksX; cx++) {
                turmiteGraphics.drawRect(cx * chunkPixelWidth, cy * chunkPixelHeight, chunkPixelWidth, chunkPixelHeight);
            }
        }
    }
    */
}

/** Draws a single cell onto a PIXI.Graphics object at the specified *local* coordinates within the chunk. */
function drawSingleCellPixi(graphics, localX, localY, cellState, cellSize) { // Accept cellSize
    if (!graphics || cellSize <= 0) return;

    const state = getTileStateFromCell(cellState); // Decode state
    const xPos = localX * cellSize;
    const yPos = localY * cellSize;

    // Get color from the currently selected palette in PARAMS
    const colorString = getColor(PARAMS.palette, state);
    const fillColor = hexStringToNumber(colorString); // Convert CSS string to Pixi color number

    // Optimization: If background color is default, don't draw cells matching that color
    // This requires converting PARAMS.backgroundColor to the same format as palette colors
    // or comparing the string values directly if palettes use hex consistently.
    // Let's assume default white matches the default palette's white for now.
    const bgHex = hexStringToNumber(PARAMS.backgroundColor);
    if (fillColor === bgHex && state === STATE_WHITE) { // Simple check for default white case
       // Potentially refine this check if palettes/backgrounds use different formats
       return; 
    }

    graphics.beginFill(fillColor);
    // No stroke for cells unless grid lines are enabled
    if (PARAMS.showGrid && cellSize > 2) { // Only draw grid if cells are large enough
         graphics.lineStyle(1, 0xCCCCCC, 0.3); // Light gray, subtle grid lines
    } else {
         graphics.lineStyle(0); // No border
    }
    graphics.drawRect(xPos, yPos, cellSize, cellSize);
    graphics.endFill(); // Important: end fill after drawing
}

// Expose function to force a full redraw by marking all chunks dirty
export function forceFullRedraw() {
    console.log("Renderer forcing full redraw.");
    chunks.forEach(chunk => chunk.dirty = true);
    // Also ensure the simulation side knows a full redraw happened if needed
    // (Currently, getDirtyCellsInfo provides the flag, which we use)
} 