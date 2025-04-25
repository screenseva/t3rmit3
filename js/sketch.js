// sketch.js - Main entry point (using modules)

import { PARAMS } from './constants.js';
import { initializeRenderer, applyCanvasSize } from './renderer.js';
import { initializeUI, setLastUploadedImage } from './ui.js';
import { handleImageFile } from './image_handler.js';

// --- Initialization ---
console.log("Initializing application...");

// Initialize Renderer
const pixiApp = initializeRenderer(PARAMS);

// Initialize UI, passing Pixi App instance
const uiElements = initializeUI(pixiApp);

// Add listener to the file input IF UI initialization was successful
if (uiElements && uiElements.fileInputElement && typeof handleImageFile === 'function') {
    const { pane, fileInputElement } = uiElements; // Destructure return object

    fileInputElement.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Get the raw File object
        if (file) {
            // Store reference to the file for refresh capability
            if (typeof setLastUploadedImage === 'function') {
                setLastUploadedImage(file);
                console.log("Image file stored for refresh capability");
            }
            
            // Directly call handleImageFile with the raw File object and pane
            handleImageFile(file, pane);
            // Reset the input value to allow uploading the same file again
            event.target.value = null;
        }
    });
} else if (!uiElements || !uiElements.fileInputElement) {
    console.warn("File input element not returned from initializeUI or UI init failed.");
} else {
    console.error("handleImageFile function not imported correctly.");
}

console.log("Application initialized.");

// --- Add Resize Listener --- //
window.addEventListener('resize', () => {
    console.log("Window resized...");
    // Update PARAMS with new dimensions
    PARAMS.canvasWidth = window.innerWidth;
    PARAMS.canvasHeight = window.innerHeight;

    // Tell the renderer to apply the new size
    if (typeof applyCanvasSize === 'function') {
        applyCanvasSize();
    } else {
        // This case indicates an issue with imports/exports if renderer.js is loaded
        console.error("applyCanvasSize function is not available!");
    }
    
    // Optional: Refresh Tweakpane if UI elements depend on canvas size
    if (uiElements && uiElements.pane) {
        // Debounce this if it causes performance issues on rapid resize
        // uiElements.pane.refresh(); 
    }
});

// Make the handleImageFile function accessible globally for the refresh button
window.handleImageFile = handleImageFile;

// Note: This uses ES Module imports. You'll need to serve these files
// from a local server and load sketch.js in your HTML using <script type="module">.
