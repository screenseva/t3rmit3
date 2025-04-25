import { PARAMS, BASE_CELL_SIZE } from '../js/constants.js';
// Import pure simulation functions and rules definition
import {
    initializeGrid,
    updateSimulation, 
    rules, // Import rules definition
    getCellTileState, isMitePresent, getMiteDirection, getTileStateFromCell, encodeCellState, setCellState, isTurmitePresent, getIndex, getCellState, getMiteDirection as getMiteDirectionUtil
    // Removed all old alias imports (sim_...)
} from '../js/simulation.js';
import DitherJS from 'ditherjs'; // Import ditherjs

export class SimulationWorker {
    constructor(options = {}) {
        console.log("SimulationWorker constructing...");
        // --- Worker's Internal State ---
        this.params = { ...PARAMS, ...options };
        this.params.baseCellSize = this.params.baseCellSize || BASE_CELL_SIZE;

        // Simulation state properties
        this.grid = null;
        this.gridWidth = 0;
        this.gridHeight = 0;
        this.turmiteX = undefined;
        this.turmiteY = undefined;
        this.turmiteDir = undefined;
        this.steps = 0;
        this.tilesModified = 0;
        this.isImageGrid = false;
        this.activeRuleDef = rules[this.params.rule] || rules['langton'];

        // Control state properties
        this.isRunning = false;
        this.timerId = null;
        this.lastFrameTime = 0;
        this.frameInterval = 1000 / (this.params.speed || 30);

        // Dirty State Tracking
        this.dirtyCells = new Set();
        this.needsFullRedraw = true;

        this.reset();
        console.log("SimulationWorker constructed.");
    }

    // --- Getters --- //
    getDirtyInfo() {
        const info = { cells: new Set(this.dirtyCells), needsFullRedraw: this.needsFullRedraw };
        this.dirtyCells.clear();
        return info;
    }

    // NEW: Method for renderer to call after completing full redraw
    clearNeedsFullRedrawFlag() {
        this.needsFullRedraw = false;
    }

    getState() {
        return {
            grid: this.grid ? [...this.grid] : null,
            gridWidth: this.gridWidth,
            gridHeight: this.gridHeight,
            turmiteX: this.turmiteX,
            turmiteY: this.turmiteY,
            turmiteDir: this.turmiteDir,
            steps: this.steps,
            tilesModified: this.tilesModified,
            isImageGrid: this.isImageGrid,
            rule: this.params.rule,
            pattern: this.params.pattern,
            turmiteStepSize: this.params.turmiteStepSize,
            zoom: this.params.zoom,
            turmiteColor: this.params.turmiteColor,
            backgroundColor: this.params.backgroundColor,
            followTurmite: this.params.followTurmite,
            showGrid: this.params.showGrid,
            showDirection: this.params.showDirection
        };
    }

    // --- Simulation Loop --- //
    _simulationStep() {
        if (!this.isRunning) return;
        const now = performance.now();
        const elapsed = now - this.lastFrameTime;
        if (elapsed >= this.frameInterval) {
            this.lastFrameTime = now - (elapsed % this.frameInterval);
            try {
                let currentState = {
                    grid: this.grid,
                    gridWidth: this.gridWidth,
                    gridHeight: this.gridHeight,
                    turmiteX: this.turmiteX,
                    turmiteY: this.turmiteY,
                    turmiteDir: this.turmiteDir,
                    steps: this.steps,
                    tilesModified: this.tilesModified,
                    isImageGrid: this.isImageGrid
                };
                let cumulativeDirtyCells = new Set();
                for (let i = 0; i < this.params.simStepsPerFrame; i++) {
                    const { newState, dirtyCells: stepDirtyCells } =
                        updateSimulation(currentState, this.activeRuleDef, this.params);
                    this.grid = newState.grid;
                    this.turmiteX = newState.turmiteX;
                    this.turmiteY = newState.turmiteY;
                    this.turmiteDir = newState.turmiteDir;
                    this.steps = newState.steps;
                    this.tilesModified = newState.tilesModified;
                    this.isImageGrid = newState.isImageGrid;
                    currentState = newState;
                    stepDirtyCells.forEach(cell => cumulativeDirtyCells.add(cell));
                    if (this.turmiteX === undefined) {
                        console.error("Turmite position became undefined during simulation step. Stopping.");
                        this.stop();
                        break;
                    }
                }
                // DEBUG: Log cumulative dirty cells for the frame
                if(cumulativeDirtyCells.size > 0) console.log(`[Worker Frame End] Cumulative dirty:`, cumulativeDirtyCells);
                cumulativeDirtyCells.forEach(cell => this.dirtyCells.add(cell));
            } catch (error) {
                console.error("Error during simulation step:", error);
                this.stop();
            }
        }
        this.timerId = requestAnimationFrame(this._simulationStep.bind(this));
    }

    // --- Control Methods --- //
    start() {
        if (this.isRunning) return;
        console.log("SimulationWorker starting...");
        this.isRunning = true;
        this.lastFrameTime = performance.now();
        this.timerId = requestAnimationFrame(this._simulationStep.bind(this));
        console.log("SimulationWorker started.");
    }

    stop() {
        if (!this.isRunning) return;
        console.log("SimulationWorker stopping...");
        this.isRunning = false;
        if (this.timerId) {
            cancelAnimationFrame(this.timerId);
            this.timerId = null;
        }
        console.log("SimulationWorker stopped.");
    }

    step() {
        if (this.isRunning) this.stop();
        try {
            let currentState = {
                grid: this.grid,
                gridWidth: this.gridWidth,
                gridHeight: this.gridHeight,
                turmiteX: this.turmiteX,
                turmiteY: this.turmiteY,
                turmiteDir: this.turmiteDir,
                steps: this.steps,
                tilesModified: this.tilesModified,
                isImageGrid: this.isImageGrid
            };
            const { newState, dirtyCells: stepDirtyCells } =
                updateSimulation(currentState, this.activeRuleDef, this.params);
            this.grid = newState.grid;
            this.turmiteX = newState.turmiteX;
            this.turmiteY = newState.turmiteY;
            this.turmiteDir = newState.turmiteDir;
            this.steps = newState.steps;
            this.tilesModified = newState.tilesModified;
            this.isImageGrid = newState.isImageGrid;
            stepDirtyCells.forEach(cell => this.dirtyCells.add(cell));
        } catch (error) {
            console.error("Error during single step:", error);
        }
    }

    reset() {
        console.log("SimulationWorker resetting...");
        this.stop();
        const newGridWidth = Math.floor(this.params.canvasWidth / this.params.baseCellSize);
        const newGridHeight = Math.floor(this.params.canvasHeight / this.params.baseCellSize);
        const initialState = initializeGrid(
            this.params.pattern,
            newGridWidth,
            newGridHeight,
            true
        );
        this.grid = initialState.grid;
        this.gridWidth = initialState.gridWidth;
        this.gridHeight = initialState.gridHeight;
        this.turmiteX = initialState.turmiteX;
        this.turmiteY = initialState.turmiteY;
        this.turmiteDir = initialState.turmiteDir;
        this.steps = initialState.steps;
        this.tilesModified = initialState.tilesModified;
        this.isImageGrid = initialState.isImageGrid;
        this.dirtyCells.clear();
        this.needsFullRedraw = true;
        this.activeRuleDef = rules[this.params.rule] || rules['langton'];
        console.log("SimulationWorker reset complete.");
    }

    // --- Setters --- //
    setSpeed(fps) {
        console.log(`SimulationWorker setting speed to ${fps} FPS`);
        fps = Math.max(1, fps || 1);
        this.params.speed = fps;
        this.frameInterval = 1000 / this.params.speed;
    }

    setStepsPerFrame(steps) {
        console.log(`SimulationWorker setting steps per frame to ${steps}`);
        steps = Math.max(1, steps || 1);
        this.params.simStepsPerFrame = steps;
    }

    setRule(ruleName) {
        if (!rules[ruleName]) {
            console.warn(`Rule "${ruleName}" not found. Keeping existing rule.`);
            return;
        }
        console.log(`SimulationWorker setting rule to ${ruleName}`);
        this.stop();
        this.params.rule = ruleName;
        this.activeRuleDef = rules[this.params.rule];
        this.reset();
    }

    setPattern(patternName) {
        console.log(`SimulationWorker setting pattern to ${patternName}`);
        this.stop();
        this.params.pattern = patternName;
        this.reset();
    }

    // NEW: Setter for turmite step size
    setTurmiteStepSize(size) {
        const newSize = parseInt(size, 10);
        if (isNaN(newSize) || newSize < 1) {
            console.warn(`Invalid turmiteStepSize received: ${size}. Keeping ${this.params.turmiteStepSize}.`);
            return;
        }
        console.log(`SimulationWorker setting turmiteStepSize to ${newSize}`);
        this.params.turmiteStepSize = newSize;
        // No simulation reset needed, just affects rendering/potential future step logic
        // Signal redraw? Maybe not necessary if renderer reads state each frame.
        this.needsFullRedraw = true; // Force redraw to ensure visual update
    }

    // NEW: Setter for zoom level
    setZoom(level) {
        const newZoom = parseFloat(level);
        if (isNaN(newZoom) || newZoom <= 0) {
            console.warn(`Invalid zoom level received: ${level}. Keeping ${this.params.zoom}.`);
            return;
        }
        // console.log(`SimulationWorker setting zoom to ${newZoom}`);
        this.params.zoom = newZoom;
        // No simulation reset needed, renderer reads this value each frame.
        // No need to set needsFullRedraw, renderer updates transform anyway.
    }

    // --- Resize Handling --- //
    handleResize(newCanvasWidth, newCanvasHeight) {
        console.log(`SimulationWorker handling resize: ${newCanvasWidth}x${newCanvasHeight}`);
        this.stop();
        this.params.canvasWidth = newCanvasWidth;
        this.params.canvasHeight = newCanvasHeight;
        if (this.isImageGrid) {
            console.log("Resizing image grid. Forcing redraw, not resetting simulation state.");
            this.needsFullRedraw = true;
        } else {
            console.log("Resizing non-image grid. Resetting simulation state.");
            this.reset();
        }
    }

    // --- Image Loading --- //
    async loadImageGrid(imageData, width, height) {
        console.log(`SimulationWorker loading image grid: ${width}x${height}`);
        this.stop();
        
        // Dynamically import helpers from the correct path
        const sim = await import('../js/simulation.js'); // UPDATED
        const cnst = await import('../js/constants.js'); // UPDATED

        const encodeFn = sim.encodeCellState;
        const getIndexFn = sim.getIndex;
        const getTileStateFn = sim.getTileStateFromCell;
        const STATE_WHITE = cnst.STATE_WHITE;
        const STATE_BLACK = cnst.STATE_BLACK;
        const STATE_GRAY = cnst.STATE_GRAY;
        const STATE_DARK_GRAY = cnst.STATE_DARK_GRAY;

        const ditherPalette = [
            [0xE0, 0xE0, 0xE0], // Light Gray
            [0x00, 0x00, 0x00], // Black
            [0xb4, 0xb4, 0xb4], // Gray
            [0x64, 0x64, 0x64]  // Dark Gray
        ];
        const colorToStateMap = new Map([
            ["224,224,224", STATE_WHITE],
            ["0,0,0",       STATE_BLACK],
            ["180,180,180", STATE_GRAY],    // Note: Mapping based on ditherjs palette values
            ["100,100,100", STATE_DARK_GRAY] // Note: Mapping based on ditherjs palette values
        ]);

        const newGrid = new Array(width * height);
        
        try {
            // Removed check for global DitherJS
            // if (typeof DitherJS === 'undefined') {
            //     throw new Error("DitherJS library not found. Please ensure it's included in the HTML.");
            // }

            console.log("Creating temporary canvas for dithering...");
            const ditherCanvas = document.createElement('canvas');
            ditherCanvas.width = width;
            ditherCanvas.height = height;
            const ditherCtx = ditherCanvas.getContext('2d');
            if (!ditherCtx) throw new Error("Could not create 2D context for dithering canvas.");
            ditherCtx.putImageData(imageData, 0, 0);
            console.log("Original image data placed on temporary canvas.");

            console.log("Initializing DitherJS...");
            const dither = new DitherJS({
                palette: ditherPalette,
                algorithm: 'diffusion' // Floyd-Steinberg
                // step: 1 // Default seems fine
            });

            console.log("Applying dithering via ditherjs to temporary canvas...");
            console.time("DitherJS Processing");
            dither.dither(ditherCanvas); // Apply dithering directly to the canvas element
            console.timeEnd("DitherJS Processing");
            console.log("Dithering applied to canvas.");

            console.log("Getting dithered image data back from canvas...");
            const ditheredImageData = ditherCtx.getImageData(0, 0, width, height);
            const d = ditheredImageData.data;
            console.log("Got dithered image data.");

            console.log("Mapping dithered colors back to states...");
            console.time("DitherAndMap");
            for (let i = 0; i < d.length; i += 4) {
                const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
                const index = i / 4;
                let tileState = STATE_WHITE;

                if (a < 128) {
                    tileState = STATE_WHITE;
                } else {
                    const colorKey = `${r},${g},${b}`;
                    if (colorToStateMap.has(colorKey)) {
                        tileState = colorToStateMap.get(colorKey);
                    } else {
                        console.warn(`Dithered color ${colorKey} not found in map, defaulting to white.`);
                        tileState = STATE_WHITE;
                    }
                }
                newGrid[index] = encodeFn(false, 0, tileState);
            }
            console.timeEnd("DitherAndMap");
            console.log("Mapping complete.");

        } catch (error) {
            console.error("Error during dithering:", error);
            console.warn("Falling back to simple thresholding due to dithering error.");
            // Fallback to simple thresholding
            const originalData = imageData.data;
            for (let i = 0; i < originalData.length; i += 4) {
                 const r = originalData[i], g = originalData[i+1], b = originalData[i+2], a = originalData[i+3];
                 const index = i / 4;
                 const grayscale = (r + g + b) / 3;
                 let tileState = STATE_WHITE;
                 if (a < 128) { tileState = STATE_WHITE; }
                 else { if (grayscale < 64) tileState = STATE_BLACK; else if (grayscale < 128) tileState = STATE_DARK_GRAY; else if (grayscale < 192) tileState = STATE_GRAY; }
                 newGrid[index] = encodeFn(false, 0, tileState);
            }
        }

        this.grid = newGrid;
        this.gridWidth = width;
        this.gridHeight = height;
        this.isImageGrid = true;
        this.params.pattern = 'image';

        // --- Turmite Placement (remains the same) ---
        let startX = Math.floor(width / 2), startY = Math.floor(height / 2);
        let foundStart = false;
        scanLoop: for (let r = 0; r < Math.max(width, height) / 2; ++r) {
            for (let y = Math.max(0, startY - r); y <= Math.min(height - 1, startY + r); ++y) {
                for (let x = Math.max(0, startX - r); x <= Math.min(width - 1, startX + r); ++x) {
                    const idx = getIndexFn(x, y, width);
                    if (getTileStateFn(this.grid[idx]) !== STATE_WHITE) {
                        startX = x; startY = y; foundStart = true; break scanLoop;
                    }
                }
            }
        }
        this.turmiteX = startX;
        this.turmiteY = startY;
        this.turmiteDir = 1;

        const turmiteIndex = getIndexFn(this.turmiteX, this.turmiteY, this.gridWidth);
        if (turmiteIndex !== -1) {
            const startTileState = getTileStateFn(this.grid[turmiteIndex]);
            this.grid[turmiteIndex] = encodeFn(true, this.turmiteDir, startTileState);
        }
        // --- End Turmite Placement ---

        this.steps = 0;
        this.tilesModified = 0;
        this.dirtyCells.clear();
        this.needsFullRedraw = true;
        console.log(`Image grid loaded (ditherjs). Turmite placed at (${this.turmiteX}, ${this.turmiteY})`);
    }
} 