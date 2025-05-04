import {
    PARAMS,
    BASE_CELL_SIZE,
    MASK_TURMITE_PRESENCE, MITE_PRESENT_VAL, MASK_DIRECTION, SHIFT_DIRECTION, MASK_TILE_STATE,
    DIRECTIONS, NUM_DIRECTIONS,
    STATE_WHITE, STATE_BLACK, STATE_GRAY, STATE_DARK_GRAY, NUM_TILE_STATES,
    MASK_AXONS_STATE, MASK_AXONS_PAST, MASK_AXONS_TIME, MASK_AXONS_MASK, AXONS_WOLF_CODE, AXONS_MAX_TIME
} from './src/core/constants.js';

import { initializeRenderer, resizeRenderer, applyCanvasSize, rebuildChunksForSimulationState, forceFullRedraw } from './src/core/rendering/renderer.js';
import { initializeUI, getUIState, setLastUploadedImage } from './src/ui/components/ui.js';
import { handleImageFile, populateGridFromImage } from './src/core/utils/image_handler.js';

// Initialize the simulation
function setup() {
    // Set initial parameters
    PARAMS.pattern = 'random';
    PARAMS.rule = 'langton';
    PARAMS.speed = 30;
    PARAMS.simStepsPerFrame = 1;
    PARAMS.running = true;
    PARAMS.palette = 'default';
    PARAMS.turmiteStepSize = 4;
    PARAMS.zoom = 1.0;
    PARAMS.followTurmite = false;
    PARAMS.numTurmites = 10;

    // Initialize the renderer
    const app = initializeRenderer({
        backgroundColor: '#f0f0f0',
        pattern: PARAMS.pattern,
        speed: PARAMS.speed
    });

    // Initialize the UI
    initializeUI(app);

    // Handle window resize
    window.addEventListener('resize', () => {
        applyCanvasSize();
    });

    // Handle image drops
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageFile(file, getUIState().pane);
        }
    });
}

// Start the simulation when the page loads
window.addEventListener('load', setup);

// ... existing code ... 