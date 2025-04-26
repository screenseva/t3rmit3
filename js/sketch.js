// sketch.js - Main entry point (using modules)

import { PARAMS } from './constants.js';
import { initializeRenderer, applyCanvasSize } from './renderer.js';
import { initializeUI, setLastUploadedImage } from './ui.js';
import { handleImageFile } from './image_handler.js';

// --- Initialization ---
console.log("Initializing application...");

// Initialize Renderer
const pixiApp = initializeRenderer(PARAMS);

// Initialize UI with proper error handling
let uiElements = null;
try {
    // Ensure PARAMS is properly initialized before creating UI
    if (!PARAMS) {
        throw new Error('PARAMS object not properly initialized');
    }
    
    // Initialize UI with the PixiJS app instance
    uiElements = initializeUI(pixiApp);
    
    if (!uiElements || !uiElements.pane) {
        throw new Error('UI initialization failed to return proper elements');
    }
    
    // Add file input listener if available
    if (uiElements.fileInputElement && typeof handleImageFile === 'function') {
        const { fileInputElement } = uiElements;
        
        fileInputElement.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                if (typeof setLastUploadedImage === 'function') {
                    setLastUploadedImage(file);
                }
                handleImageFile(file, uiElements.pane);
                event.target.value = null;
            }
        });
    }
} catch (error) {
    console.error('Error during UI initialization:', error);
    // Create a simple error message for the user
    const errorDiv = document.createElement('div');
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '10px';
    errorDiv.style.right = '10px';
    errorDiv.style.padding = '10px';
    errorDiv.style.backgroundColor = '#ff4444';
    errorDiv.style.color = 'white';
    errorDiv.style.borderRadius = '5px';
    errorDiv.textContent = 'Error initializing UI controls. Please refresh the page.';
    document.body.appendChild(errorDiv);
}

// --- Add Resize Listener --- //
window.addEventListener('resize', () => {
    // Update PARAMS with new dimensions
    PARAMS.canvasWidth = window.innerWidth;
    PARAMS.canvasHeight = window.innerHeight;

    // Apply new canvas size
    if (typeof applyCanvasSize === 'function') {
        applyCanvasSize();
        
        // Refresh UI if available
        if (uiElements?.pane) {
            uiElements.pane.refresh();
        }
    }
});

// Make handleImageFile accessible globally for the refresh button
window.handleImageFile = handleImageFile;

// Export for potential use in other modules
export { pixiApp, uiElements };

// Note: This uses ES Module imports. You'll need to serve these files
// from a local server and load sketch.js in your HTML using <script type="module">.
