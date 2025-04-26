import { PARAMS, BASE_CELL_SIZE, STATE_WHITE, STATE_GRAY, STATE_DARK_GRAY, STATE_BLACK } from '../constants.js';
import {
    initializeGrid,
    setCellState,       // To populate grid
    encodeCellState,    // To encode state
    setTurmitePosition, // To place turmite after population
    forceFullRedraw,    // To signal renderer update needed
    setDynamicCellSize,  // Import the new setter
    findBestStartPosition, // Import edge detection function
    isImageLoaded       // Import image loaded flag
} from '../simulation/simulation.js';
import { resizeRenderer, rebuildChunksForSimulationState } from '../rendering/renderer.js';
import { updatePlayPauseButtons } from '../../ui/components/ui.js';

/**
 * Callback function for the image file input.
 * Uses standard browser APIs (Image, Canvas) to load image data.
 * @param {object} file - The actual File object from the input event.
 * @param {object} pane - The Tweakpane instance (for refresh).
 */
export function handleImageFile(file, pane) {
    console.log("File selected:", file.name, file.type);
    PARAMS.running = false; // Pause simulation while loading
    if (typeof updatePlayPauseButtons === 'function') { updatePlayPauseButtons(); }
    if (pane) pane.refresh();

    if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = () => {
                console.log(`Image object loaded: ${img.width}x${img.height}`);

                // Grid dimensions match image dimensions
                let newGridWidth = Math.max(img.width, 1);
                let newGridHeight = Math.max(img.height, 1);

                // Calculate dynamic cell size to fit image grid into current canvas
                let newDynamicCellSize = Math.max(1, Math.floor(
                    Math.min(PARAMS.canvasWidth / newGridWidth, PARAMS.canvasHeight / newGridHeight)
                ));
                console.log(`Target grid: ${newGridWidth}x${newGridHeight}, Target dynamic cell size: ${newDynamicCellSize}`);

                // Set the dynamic cell size for rendering
                if (typeof setDynamicCellSize === 'function') {
                    setDynamicCellSize(newDynamicCellSize);
                } else { console.error("setDynamicCellSize not available."); return; }

                // Initialize grid (blank, no turmite yet)
                if (typeof initializeGrid === 'function') {
                    initializeGrid(null, newGridWidth, newGridHeight, false);
                } else { console.error("initializeGrid not available."); return; }

                // Use temporary canvas to get pixel data
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                const ctx = tempCanvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                let imageData;
                try {
                    imageData = ctx.getImageData(0, 0, img.width, img.height);
                } catch (e) {
                    console.error("Could not get image data (cross-origin issue?):", e);
                    alert("Error processing image data. Ensure the image is accessible.");
                    return;
                }
                const pixels = imageData.data;

                // Populate grid from image pixels
                console.log("Populating grid from image pixels...");
                for (let y = 0; y < newGridHeight; y++) {
                    for (let x = 0; x < newGridWidth; x++) {
                        const i = (y * newGridWidth + x) * 4;
                        const r = pixels[i];
                        const g = pixels[i + 1];
                        const b = pixels[i + 2];
                        
                        // Convert RGB to grayscale using weighted values for better perception
                        const grayscale = (0.299 * r + 0.587 * g + 0.114 * b);
                        let tileState;
                        
                        if (grayscale < 64) {
                            tileState = STATE_BLACK;
                        } else if (grayscale < 128) {
                            tileState = STATE_DARK_GRAY;
                        } else if (grayscale < 192) {
                            tileState = STATE_GRAY;
                        } else {
                            tileState = STATE_WHITE;
                        }
                        
                        setCellState(x, y, encodeCellState(false, 0, tileState));
                    }
                }
                console.log("Grid populated from image.");

                // Find best starting position using edge detection
                const midX = Math.floor(newGridWidth / 2);
                const midY = Math.floor(newGridHeight / 2);
                const bestPos = findBestStartPosition(midX, midY);
                
                console.log(`Using edge detection to place turmite at (${bestPos.x}, ${bestPos.y})`);
                setTurmitePosition(bestPos.x, bestPos.y, 1);

                // Tell the renderer to rebuild its chunks
                if (typeof rebuildChunksForSimulationState === 'function') {
                    rebuildChunksForSimulationState();
                } else {
                    console.error("rebuildChunksForSimulationState function not available.");
                }

                // Update UI
                if (pane) pane.refresh();
            };
            
            img.onerror = (e) => {
                console.error("Error loading image data URL into Image object:", e);
                alert("Could not load image data.");
            };
            img.src = e.target.result;
        };

        reader.onerror = function(e) {
            console.error("File reading error:", e);
            alert("Could not read the selected file.");
        };
        reader.readAsDataURL(file);

    } else {
        console.warn("Selected file is not an image:", file.type);
        alert("Please select an image file (e.g., PNG, JPG, GIF).");
        PARAMS.running = true;
        if (pane) pane.refresh();
        if (typeof updatePlayPauseButtons === 'function') { updatePlayPauseButtons(); }
    }
}

/** Populate grid from image data */
export function populateGridFromImage(imageData, width, height) {
    console.log("Populating grid from image pixels (1 pixel = 1 cell)...");
    
    // First initialize the grid without placing turmite
    initializeGrid(null, width, height, false);
    
    // Populate grid with image data
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            
            // Convert RGB to grayscale and map to tile states
            const grayscale = (r + g + b) / 3;
            let tileState;
            
            if (grayscale < 64) {
                tileState = STATE_BLACK;
            } else if (grayscale < 128) {
                tileState = STATE_DARK_GRAY;
            } else if (grayscale < 192) {
                tileState = STATE_GRAY;
            } else {
                tileState = STATE_WHITE;
            }
            
            setCellState(x, y, encodeCellState(false, 0, tileState));
        }
    }
    
    console.log("Grid populated from image.");
    
    // Now place the turmite using the simulation's edge detection
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);
    
    // Use the simulation's edge detection to find a good starting point
    const bestPos = findBestStartPosition(midX, midY);
    setTurmitePosition(bestPos.x, bestPos.y, 1);
    
    // Set the image loaded flag
    isImageLoaded = true;
}

// Note: The temporary globals (window.simGrid, window.forceRedraw, window.simTurmite*)
// highlight the need for better state management between modules. 