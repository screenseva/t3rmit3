// sketch.js - Main entry point (using modules)

import { Simulation } from './simulation.js';
import { TerminalManager } from './terminal.js';
import { ImageHandler } from './image_handler.js';

let simulation;
let terminalManager;
let imageHandler;

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create terminal manager first
    terminalManager = new TerminalManager();
    
    // Initialize simulation
    simulation = new Simulation();
    
    // Initialize image handler
    imageHandler = new ImageHandler(simulation, terminalManager);
    
    // Start the animation loop
    animate();
});

function animate() {
    requestAnimationFrame(animate);
    if (simulation) {
        simulation.update();
        simulation.render();
    }
}

// Export for use in other modules
export { simulation, terminalManager, imageHandler };

// Note: This uses ES Module imports. You'll need to serve these files
// from a local server and load sketch.js in your HTML using <script type="module">.
