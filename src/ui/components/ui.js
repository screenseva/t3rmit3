// ui.js
// Handles the Tweakpane UI elements and interactions

// Import Tweakpane as an ES module
import { Pane } from 'tweakpane';
import { 
    PARAMS,
    STATE_WHITE,
    STATE_BLACK,
    STATE_GRAY,
    STATE_DARK_GRAY,
    STATE_LIGHT_GRAY,
    STATE_RED,
    STATE_GREEN,
    STATE_BLUE,
    BASE_CELL_SIZE
} from '../../core/constants.js';
import { palettes } from '../../core/rendering/palettes.js';
import { 
    rules, 
    setActiveRule, 
    initializeGrid, 
    forceFullRedraw, 
    internalGridWidth, 
    internalGridHeight, 
    isImageLoaded,
    customRuleParams,
    updateCustomRule,
    rulePresets,
    updateTurmiteCount,
    setCellState,
    getCellState,
    getTurmitePositions,
    dynamicCellSize,
    setImageLoadedState
} from '../../core/simulation/simulation.js';
import { 
    applyCanvasSize, 
    copyCanvasToClipboard, 
    rebuildChunksForSimulationState
} from '../../core/rendering/renderer.js';
// Removed: handleImageFile import (listener added in main.js)

// Dither.js configuration
const DITHER_ALGORITHMS = {
    'FloydSteinberg': [
        [7/16, 1, 0],
        [3/16, -1, 1],
        [5/16, 0, 1],
        [1/16, 1, 1]
    ],
    'Atkinson': [
        [1/8, 1, 0],
        [1/8, 2, 0],
        [1/8, -1, 1],
        [1/8, 0, 1],
        [1/8, 1, 1],
        [1/8, 0, 2]
    ]
};

// Add dithering options to PARAMS
PARAMS.ditherAlgorithm = 'FloydSteinberg';
PARAMS.ditherThreshold = 128;

// SVG Icons for UI buttons
const icons = {
    dice: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <circle cx="15.5" cy="8.5" r="1.5"/>
        <circle cx="15.5" cy="15.5" r="1.5"/>
        <circle cx="8.5" cy="15.5" r="1.5"/>
    </svg>`,
    save: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
        <polyline points="17 21 17 13 7 13 7 21"/>
        <polyline points="7 3 7 8 15 8"/>
    </svg>`,
    load: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="17 8 12 3 7 8"/>
        <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>`,
    delete: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
        <line x1="10" y1="11" x2="10" y2="17"/>
        <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>`
};

// Common styles for UI elements
const commonStyles = {
    font: '11px Inter, sans-serif',
    color: 'rgba(255, 255, 255, 0.8)'
};

// Common button styles
const buttonStyle = {
    padding: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '2px',
    border: 'none',
    backgroundColor: '#2a2a2a',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
};

// UI State Management
const UIState = {
    pane: null,
    playButton: null,
    pauseButton: null,
    lastUploadedImage: null,
    customRuleFolder: null,
    savedRules: {},
    initialized: false
};

// Bindable Parameters
const UIParams = {
    canvasSize: {
        width: PARAMS.canvasWidth || 800,
        height: PARAMS.canvasHeight || 600
    },
    customRule: {
        selectedPreset: 'langton',
        ruleName: '',
        metricsValue: 'Select a preset or create your own rule'
    }
};

// UI configuration - controls which folders are initially expanded
const UI_CONFIG = {
    initialExpanded: {
        simulation: true,       // Always expanded
        customRule: false,      // Expanded when selected
        appearance: false,      // Initially collapsed
        view: false,            // Initially collapsed
        image: false,           // Initially collapsed
        tools: false            // Initially collapsed
    },
    compactMode: {
        position: 'right',      // 'right' or 'left'
        width: 280,             // Width in pixels
        compactWidth: 280,      // Width when in compact mode
        normalWidth: 320,       // Width when in normal mode
        transparency: 0.95      // 0.0 - 1.0
    }
};

// Color mapping for states to use in the UI
export const stateColors = {
    [STATE_WHITE]: '#ffffff',
    [STATE_BLACK]: '#000000',
    [STATE_GRAY]: '#aaaaaa',
    [STATE_DARK_GRAY]: '#555555',
    [STATE_LIGHT_GRAY]: '#dddddd',
    [STATE_RED]: '#ff0000',
    [STATE_GREEN]: '#00ff00',
    [STATE_BLUE]: '#0000ff'
};

// Helpful metrics and recommendations for rule parameters
const ruleMetrics = {
    turn: {
        '-2': 'Sharp right (90°)',
        '-1': 'Right (45°)',
        '0': 'Continue straight',
        '1': 'Left (45°)',
        '2': 'Sharp left (90°)'
    },
    patterns: {
        'spiral': 'Creates spiral patterns, good for decoration',
        'filling': 'Fills space efficiently, good for texture generation',
        'highway': 'Creates straight paths with periodic patterns',
        'crystal': 'Creates structured, crystalline patterns',
        'chaos': 'Unpredictable, chaotic movements'
    }
};

// Description and tooltips for different parts of the UI
const UI_HELP = {
    rule: "Controls how the turmite moves and changes colors",
    speed: "Frames per second - higher is faster simulation",
    simStepsPerFrame: "Steps per frame - higher values make the turmite move faster",
    customRule: "Create your own rules for turmite behavior",
    palette: "Color scheme for the simulation",
    turmiteSize: "Size of the turmite and its steps",
    canvasSize: "Size of the simulation area in pixels",
    zoom: "Zoom level for viewing the simulation",
    followTurmite: "Camera follows the turmite as it moves"
};

// Cross-port persistence keys
const RULES_KEY = 'turmite_custom_rules';
const COOKIE_RULES_KEY = 'turmite_custom_rules_global';

// ---------- Custom Rule Helpers / Validation ---------- //

// Collect built-in rule names plus protected identifiers
const RESERVED_RULE_NAMES = new Set([
    'custom',
    'langton',
    "langton's ant",
    // Merge in any built-in rules dynamically
    ...Object.keys(rules || {})
].map(n => n.toLowerCase()));

// Normalize a rule name (trim whitespace)
function normalizeRuleName(name) {
    return (name || '').trim();
}

// Case-insensitive lookup helper
function ruleNameExists(name, savedRulesObj) {
    const search = name.toLowerCase();
    return Object.keys(savedRulesObj).some(k => k.toLowerCase() === search);
}

// Deep-clone utility (structuredClone polyfill fallback)
function deepClone(obj) {
    if (typeof structuredClone === 'function') return structuredClone(obj);
    return JSON.parse(JSON.stringify(obj));
}

// ------------------------------------------------------ //

// Declare toggle-UI globals safely
let isCompactMode = false;
let compactModeBtn = null;

// Utility: set a cookie (shared across ports)
function setCookie(name, value, days = 365) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

// Utility: get a cookie value
function getCookie(name) {
    return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1];
}

// Sync rules from cookie to localStorage if local copy is missing/empty
(function syncRulesFromCookie() {
    try {
        const local = localStorage.getItem(RULES_KEY);
        if (!local || local === '{}' || local === 'null') {
            const cookieVal = getCookie(COOKIE_RULES_KEY);
            if (cookieVal) {
                localStorage.setItem(RULES_KEY, decodeURIComponent(cookieVal));
                console.log('[Turmite] Restored rules from cookie (cross-port)');
            }
        }
    } catch (err) {
        console.warn('[Turmite] Failed to sync rules from cookie:', err);
    }
})();

// Helper to persist current rules JSON into the cookie
function persistRulesToCookie() {
    try {
        const data = localStorage.getItem(RULES_KEY) || '{}';
        setCookie(COOKIE_RULES_KEY, data);
    } catch (err) {
        console.warn('[Turmite] Failed to persist rules cookie:', err);
    }
}

/**
 * Applies dithering to image data
 * @param {ImageData} imageData - The image data to process
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} threshold - Dithering threshold
 * @param {Array} algorithm - Dithering algorithm matrix
 * @returns {ImageData} Processed image data
 */
function applyDithering(imageData, width, height, threshold, algorithm) {
    const data = new Uint8ClampedArray(imageData.data);
    const newData = new Uint8ClampedArray(data);
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            
            // Get grayscale value
            const gray = Math.floor(
                (data[i] * 0.299 + 
                 data[i + 1] * 0.587 + 
                 data[i + 2] * 0.114)
            );
            
            // Determine new pixel value
            const newPixel = gray < threshold ? 0 : 255;
            const error = gray - newPixel;
            
            // Set new pixel value
            newData[i] = newData[i + 1] = newData[i + 2] = newPixel;
            
            // Distribute error to neighboring pixels
            for (const [factor, dx, dy] of algorithm) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const ni = (ny * width + nx) * 4;
                    data[ni] = Math.max(0, Math.min(255, data[ni] + error * factor));
                    data[ni + 1] = Math.max(0, Math.min(255, data[ni + 1] + error * factor));
                    data[ni + 2] = Math.max(0, Math.min(255, data[ni + 2] + error * factor));
                }
            }
        }
    }
    
    return new ImageData(newData, width, height);
}

/**
 * Creates and configures the UI container
 * @returns {HTMLElement} The configured container
 */
function createUIContainer() {
    const container = document.createElement('div');
    container.id = 'tweakpane-container';
    Object.assign(container.style, {
        position: 'absolute',
        top: '0',
        right: '0',
        width: '320px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: '1000',
        display: 'flex',
        flexDirection: 'column'
    });
    
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'image-upload-input';
    container.appendChild(fileInput);
    
    document.body.appendChild(container);
    return container;
}

/**
 * Initializes image controls
 * @param {object} folder - The folder to add controls to
 */
function initializeImageControls(folder) {
    // Create hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.id = 'image-upload-input';
    document.body.appendChild(fileInput);

    // Only include the Upload Image button (all other image options removed)
    folder.addButton({
        title: 'Upload Image'
    }).on('click', () => {
        fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            handleImageUpload(file);
            fileInput.value = ''; // Clear for reuse
        }
    });
}

/**
 * Handles the uploaded image
 * @param {File} file - The uploaded image file
 */
function handleImageUpload(file) {
    if (!file || !file.type.startsWith('image/')) {
        console.error('Invalid file type. Please upload an image.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        // Store image data in localStorage for later restoration
        localStorage.setItem('lastUploadedImage', e.target.result);

        const img = new Image();
        img.onload = function() {
            try {
                // Store the image for potential reuse
                setLastUploadedImage(file);
                
                // Pause simulation while processing
                const wasRunning = PARAMS.running;
                PARAMS.running = false;

                // Calculate dimensions that maintain aspect ratio but fit in window
                const padding = 40;
                const maxWidth = window.innerWidth - padding;
                const maxHeight = window.innerHeight - padding;
                
                // --- Down-scale the image *if necessary* so that the entire grid can
                // be displayed inside the viewport with at least 1-pixel cells. --- //

                // Desired maximum grid size (in cells) so that cellSize>=1 fits window
                const downscaleFactor = Math.min(1, maxWidth / img.width, maxHeight / img.height);

                const gridWidth = Math.floor(img.width * downscaleFactor);
                const gridHeight = Math.floor(img.height * downscaleFactor);

                console.log(`Processing image with original dimensions: ${img.width}x${img.height}`);
                console.log(`Scaled grid dimensions: ${gridWidth}x${gridHeight} (downscale factor ~ ${downscaleFactor.toFixed(3)})`);

                // Compute an *integer* canvas scaling factor so that the grid fills as much
                // of the window as possible without exceeding it.
                const scaleX = maxWidth / gridWidth;
                const scaleY = maxHeight / gridHeight;
                let canvasScale = Math.floor(Math.min(scaleX, scaleY));
                if (canvasScale < 1) canvasScale = 1; // Safety

                PARAMS.canvasWidth = gridWidth * canvasScale;
                PARAMS.canvasHeight = gridHeight * canvasScale;

                const scale = canvasScale; // For logging / debug
                
                // Create a temporary canvas for image processing
                const tempCanvas = document.createElement('canvas');
                const tempCtx = tempCanvas.getContext('2d');
                tempCanvas.width = gridWidth;
                tempCanvas.height = gridHeight;

                // Enable image smoothing for better quality
                tempCtx.imageSmoothingEnabled = true;
                tempCtx.imageSmoothingQuality = 'high';
                
                // If the image was down-scaled, draw it scaled into the temp canvas
                // so that subsequent pixel sampling matches the reduced grid size.
                tempCtx.drawImage(img, 0, 0, img.width, img.height, 0, 0, gridWidth, gridHeight);

                // Get image data (already down-scaled if applicable)
                const imageData = tempCtx.getImageData(0, 0, gridWidth, gridHeight);
                
                console.log(`Initializing grid with dimensions: ${gridWidth}x${gridHeight}`);
                
                // Initialize grid with new dimensions (without placing turmites)
                initializeGrid(null, gridWidth, gridHeight, false);
                
                // Process the image data
                const { data } = imageData;
                for (let y = 0; y < gridHeight; y++) {
                    for (let x = 0; x < gridWidth; x++) {
                        const i = (y * gridWidth + x) * 4;
                        // Convert to grayscale using luminance formula
                        const gray = Math.round(
                            data[i] * 0.299 + 
                            data[i + 1] * 0.587 + 
                            data[i + 2] * 0.114
                        );
                        
                        // Map to states (inverted if needed)
                        const finalValue = PARAMS.invertImage ? 255 - gray : gray;
                        const state = finalValue < 128 ? STATE_BLACK : STATE_WHITE;
                        setCellState(x, y, state);
                    }
                }

                // Set image loaded flag BEFORE applying canvas size
                setImageLoadedState(true);

                console.log('Applying canvas size...');
                // Apply the canvas size which will trigger grid initialization
                applyCanvasSize(PARAMS.canvasWidth, PARAMS.canvasHeight);
                
                // Now place turmites at good positions
                const numTurmites = PARAMS.numTurmites;
                console.log(`Placing ${numTurmites} turmites on the image...`);
                updateTurmiteCount(numTurmites);
                
                console.log('Rebuilding chunks...');
                // Force a complete redraw
                rebuildChunksForSimulationState();
                forceFullRedraw();

                // Set zoom to 1 since we're using scale for sizing
                PARAMS.zoom = 1.0;
                
                // Resume simulation if it was running
                PARAMS.running = wasRunning;
                
                console.log(`Image processed successfully: ${gridWidth}x${gridHeight} with scale ${scale}`);
            } catch (error) {
                console.error('Error processing image:', error);
                setImageLoadedState(false);
                PARAMS.running = false;
            }
        };
        
        // Set image source after setting up onload handler
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

/**
 * Initializes the main UI components
 * @param {object} pixiApp - The PIXI.Application instance
 * @returns {object} UI elements including pane and file input
 * @throws {Error} If initialization fails
 */
export function initializeUI(pixiApp) {
    if (UIState.initialized) {
        console.warn('UI already initialized. Skipping initialization.');
        return { pane: UIState.pane, fileInputElement: null };
    }

    try {
        // Create and setup container
        const container = createUIContainer();
        
        // Create Tweakpane instance with title
        UIState.pane = new Pane({ 
            container,
            title: 'Turmite Simulation'
        });

        // Add playback controls at the top
        addPlaybackControls(container);

        // Create main folders
        const folders = {
            simulation: UIState.pane.addFolder({
                title: 'Simulation',
                expanded: true
            }),
            rules: UIState.pane.addFolder({
                title: 'Rules',
                expanded: true
            }),
            appearance: UIState.pane.addFolder({
                title: 'Appearance',
                expanded: false
            }),
            image: UIState.pane.addFolder({
                title: 'Image',
                expanded: false
            })
        };

        // Initialize each section
        initializeSimulationControls(folders.simulation, pixiApp);
        initializeRuleControls(folders.rules);
        initializeAppearanceControls(folders.appearance);
        initializeImageControls(folders.image);

        // Restore last uploaded image if exists
        restoreLastUploadedImage();

        UIState.initialized = true;
        console.log('UI initialized successfully');
        
        return {
            pane: UIState.pane,
            fileInputElement: document.getElementById('image-upload-input')
        };
    } catch (error) {
        console.error('Failed to initialize UI:', error);
        cleanup();
        throw new Error(`UI initialization failed: ${error.message}`);
    }
}

/**
 * Adds playback control buttons in a horizontal layout
 * @param {HTMLElement} container - The container to add controls to
 */
function addPlaybackControls(container) {
    // Create a container for the playback controls
    const playbackContainer = document.createElement('div');
    Object.assign(playbackContainer.style, {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px',
        backgroundColor: '#1a1a1a',
        borderBottom: '1px solid #333'
    });

    // Style configuration for buttons
    const btnStyle = {
        backgroundColor: '#2a2a2a',
        color: '#ffffff',
        borderRadius: '4px',
        width: '32px',
        height: '32px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'all 0.2s ease',
        fontSize: '18px'
    };

    // Play Button
    const playBtn = document.createElement('button');
    Object.assign(playBtn.style, btnStyle);
    playBtn.innerHTML = '▶';
    playBtn.onclick = () => {
        PARAMS.running = true;
        updatePlaybackButtonStates();
    };

    // Pause Button
    const pauseBtn = document.createElement('button');
    Object.assign(pauseBtn.style, btnStyle);
    pauseBtn.innerHTML = '⏸';
    pauseBtn.onclick = () => {
        PARAMS.running = false;
        updatePlaybackButtonStates();
    };

    // Refresh Button
    const refreshBtn = document.createElement('button');
    Object.assign(refreshBtn.style, btnStyle);
    refreshBtn.innerHTML = '⟳';
    refreshBtn.onclick = () => {
        const wasRunning = PARAMS.running;
        PARAMS.running = false;
        
        // Check if we have an image loaded
        if (isImageLoaded) {
            // Restore the last uploaded image
            const imageData = localStorage.getItem('lastUploadedImage');
            if (imageData) {
                console.log('Restoring image after refresh...');
                fetch(imageData)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'restored_image.png', { type: 'image/png' });
                        handleImageUpload(file);
                        // Resume simulation if it was running
                        PARAMS.running = wasRunning;
                        updatePlaybackButtonStates();
                    })
                    .catch(error => {
                        console.error('Failed to restore image after refresh:', error);
                        // If image restore fails, initialize empty grid
                        setActiveRule(PARAMS.rule);
                        PARAMS.running = wasRunning;
                        updatePlaybackButtonStates();
                    });
            }
        } else {
            // If no image was loaded, just reset the grid
            setActiveRule(PARAMS.rule);
            PARAMS.running = wasRunning;
            updatePlaybackButtonStates();
        }
    };

    // Add hover effects
    [playBtn, pauseBtn, refreshBtn].forEach(btn => {
        btn.onmouseover = () => {
            btn.style.backgroundColor = '#3a3a3a';
            btn.style.transform = 'scale(1.1)';
        };
        btn.onmouseout = () => {
            btn.style.backgroundColor = '#2a2a2a';
            btn.style.transform = 'scale(1)';
        };
        btn.onmousedown = () => {
            btn.style.transform = 'scale(0.95)';
        };
        btn.onmouseup = () => {
            btn.style.transform = 'scale(1.1)';
        };
    });

    // Add buttons to container
    playbackContainer.appendChild(playBtn);
    playbackContainer.appendChild(pauseBtn);
    playbackContainer.appendChild(refreshBtn);

    // Add container before the Tweakpane UI
    container.insertBefore(playbackContainer, container.firstChild);

    // Store button references
    UIState.playButton = playBtn;
    UIState.pauseButton = pauseBtn;
}

/**
 * Updates the play/pause button states
 */
function updatePlaybackButtonStates() {
    if (!UIState.initialized) return;
    
    if (UIState.playButton && UIState.pauseButton) {
        // Update button styles based on state
        UIState.playButton.style.opacity = PARAMS.running ? '0.5' : '1';
        UIState.playButton.style.cursor = PARAMS.running ? 'default' : 'pointer';
        UIState.playButton.disabled = PARAMS.running;

        UIState.pauseButton.style.opacity = PARAMS.running ? '1' : '0.5';
        UIState.pauseButton.style.cursor = PARAMS.running ? 'pointer' : 'default';
        UIState.pauseButton.disabled = !PARAMS.running;
    }
}

// Export both the new and old function names for compatibility
export const updatePlayPauseButtons = updatePlaybackButtonStates;
export { updatePlaybackButtonStates };

/**
 * Cleans up UI resources
 */
function cleanup() {
    if (UIState.pane) {
        UIState.pane.dispose();
    }
    const container = document.getElementById('tweakpane-container');
    if (container) {
        container.remove();
    }
    UIState.initialized = false;
}

// Export UI state for external access
export const getUIState = () => ({ ...UIState });

/**
 * Toggle compact mode for the UI
 */
function toggleCompactMode() {
    isCompactMode = !isCompactMode;
    
    const container = document.getElementById('tweakpane-container');
    if (container) {
        container.style.width = isCompactMode ? 
            `${UI_CONFIG.compactMode.compactWidth}px` : 
            `${UI_CONFIG.compactMode.normalWidth}px`;
        
        container.style.opacity = isCompactMode ? 
            UI_CONFIG.compactMode.transparency : 
            '1.0';
    }
    
    // Update the button title properly
    if (compactModeBtn) {
        // First remove the old button
        const oldTitle = isCompactMode ? 'Compact Mode' : 'Normal Mode';
        const newTitle = isCompactMode ? 'Normal Mode' : 'Compact Mode';
        
        // In Tweakpane 4.0, we need to update the button's title property
        compactModeBtn.dispose();
        compactModeBtn = UIState.pane.addButton({ title: newTitle });
        compactModeBtn.on('click', toggleCompactMode);
    } else {
        // First-time creation
        compactModeBtn = UIState.pane.addButton({ title: 'Compact Mode' });
        compactModeBtn.on('click', toggleCompactMode);
    }
}

/**
 * Generate a random rule configuration
 * @param {function} seededRandom - Function to generate seeded random numbers
 * @returns {Object} Random rule configuration
 */
function generateRandomRule(seededRandom) {
    const rule = { ...customRuleParams };
    
    // Define possible turn values and their weights
    const turnValues = [
        { value: -2, weight: 0.1 },  // Sharp left (rare)
        { value: -1, weight: 0.3 },  // Left
        { value: 0, weight: 0.2 },   // Straight
        { value: 1, weight: 0.3 },   // Right
        { value: 2, weight: 0.1 }    // Sharp right (rare)
    ];

    // Define possible state transitions
    const numStates = 8; // Total number of states
    const stateTransitions = [];
    
    // Generate all possible state combinations
    for (let currentState = 0; currentState < numStates; currentState++) {
        for (let nextState = 0; nextState < numStates; nextState++) {
            for (let turn = -2; turn <= 2; turn++) {
                stateTransitions.push({
                    currentState,
                    nextState,
                    turn
                });
            }
        }
    }

    // Shuffle state transitions using seeded random
    for (let i = stateTransitions.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [stateTransitions[i], stateTransitions[j]] = [stateTransitions[j], stateTransitions[i]];
    }

    // Select a random subset of transitions to create an interesting rule
    const selectedTransitions = stateTransitions.slice(0, numStates);

    // Apply selected transitions to rule
    selectedTransitions.forEach((transition, index) => {
        const currentState = index;
        rule[`state${currentState}Next`] = transition.nextState;
        rule[`state${currentState}Turn`] = transition.turn;
    });
    
    return rule;
}

/**
 * Apply a rule preset to the custom rule parameters
 * @param {string} presetName - Name of the preset to apply
 */
function applyRulePreset(presetName) {
    if (rulePresets[presetName]) {
        const preset = rulePresets[presetName];
        Object.keys(preset).forEach(key => {
            customRuleParams[key] = preset[key];
        });
        updateCustomRule();
        if (UIState.pane) UIState.pane.refresh();
        if (PARAMS.rule === 'custom' && !PARAMS.running) {
            forceFullRedraw();
        }
        console.log(`Applied preset: ${presetName}`);
    } else {
        console.error(`Preset not found: ${presetName}`);
    }
}

/**
 * Save a custom rule with its seed and name
 * @param {string} name - Name of the rule
 * @param {number} seed - Seed used to generate the rule
 * @param {Object} ruleParams - The rule parameters
 * @returns {boolean} Success status
 */
function saveCustomRule(name, seed, ruleParams) {
    const trimmed = normalizeRuleName(name);
    if (!trimmed) return false;
    if (RESERVED_RULE_NAMES.has(trimmed.toLowerCase())) {
        alert('Cannot overwrite a built-in or reserved rule name.');
        return false;
    }
    try {
        const savedRules = JSON.parse(localStorage.getItem('turmite_custom_rules') || '{}');

        // Check duplicate (case-insensitive)
        if (ruleNameExists(trimmed, savedRules)) {
            if (!confirm(`Rule "${trimmed}" exists. Overwrite?`)) {
                return false;
            }
        }

        savedRules[trimmed] = {
            seed: seed,
            params: deepClone(ruleParams), // deep copy
            timestamp: Date.now()
        };
        localStorage.setItem('turmite_custom_rules', JSON.stringify(savedRules));
        console.log(`Rule saved: ${trimmed} (seed: ${seed})`);
        persistRulesToCookie();
        return true;
    } catch (error) {
        console.error('Failed to save rule:', error);
        return false;
    }
}

/**
 * Load a custom rule by name
 * @param {string} name - Name of the rule to load
 * @returns {Object|null} The rule data or null if not found
 */
function loadCustomRule(name) {
    try {
        const savedRules = JSON.parse(localStorage.getItem('turmite_custom_rules') || '{}');
        return savedRules[name] || null;
    } catch (error) {
        console.error('Failed to load rule:', error);
        return null;
    }
}

/**
 * Delete a custom rule by name
 * @param {string} name - Name of the rule to delete
 * @returns {boolean} Success status
 */
function deleteCustomRule(name) {
    try {
        const savedRules = JSON.parse(localStorage.getItem('turmite_custom_rules') || '{}');
        if (!(name in savedRules)) return false;
        delete savedRules[name];
        localStorage.setItem('turmite_custom_rules', JSON.stringify(savedRules));
        console.log(`Rule deleted: ${name}`);
        persistRulesToCookie();
        return true;
    } catch (error) {
        console.error('Failed to delete rule:', error);
        return false;
    }
}

/**
 * Rename a custom rule
 * @param {string} oldName - Current name of the rule
 * @param {string} newName - New name for the rule
 * @returns {boolean} Success status
 */
function renameCustomRule(oldName, newName) {
    const trimmedNew = normalizeRuleName(newName);
    if (!trimmedNew) return false;
    if (RESERVED_RULE_NAMES.has(trimmedNew.toLowerCase())) {
        alert('Cannot use reserved/built-in rule names.');
        return false;
    }
    try {
        const savedRules = JSON.parse(localStorage.getItem('turmite_custom_rules') || '{}');
        if (!ruleNameExists(oldName, savedRules)) return false;
        if (ruleNameExists(trimmedNew, savedRules)) {
            alert('Target name already exists.');
            return false;
        }

        // Find actual key names for case-insensitive match
        let realOldKey = Object.keys(savedRules).find(k => k.toLowerCase() === oldName.toLowerCase());
        savedRules[trimmedNew] = savedRules[realOldKey];
        delete savedRules[realOldKey];

        localStorage.setItem('turmite_custom_rules', JSON.stringify(savedRules));
        console.log(`Rule renamed: ${realOldKey} → ${trimmedNew}`);
        persistRulesToCookie();
        return true;
    } catch (error) {
        console.error('Failed to rename rule:', error);
        return false;
    }
}

/**
 * Get list of saved custom rules
 * @returns {Array} Array of rule names and their timestamps
 */
function getSavedRules() {
    try {
        const savedRules = JSON.parse(localStorage.getItem('turmite_custom_rules') || '{}');
        return Object.entries(savedRules).map(([name, data]) => ({
            name,
            timestamp: data.timestamp
        })).sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
        console.error('Failed to get saved rules:', error);
        return [];
    }
}

/**
 * Initializes simulation speed and count controls
 * @param {object} folder - The simulation folder
 * @param {object} pixiApp - The PIXI.Application instance
 */
function initializeSimulationControls(folder, pixiApp) {
    // Turmite Count Control
    folder.addBinding(PARAMS, 'numTurmites', {
        label: 'Turmites',
        min: 1,
        max: 20,
        step: 1
        }).on('change', (ev) => {
        updateTurmiteCount(ev.value);
    });

    // Simulation Speed
    folder.addBinding(PARAMS, 'speed', { 
            label: 'Speed', 
            min: 1, 
            max: 60, 
        step: 1
        }).on('change', (ev) => {
        if (pixiApp?.ticker) {
                pixiApp.ticker.maxFPS = ev.value;
            }
        });

    // Steps per Frame
    folder.addBinding(PARAMS, 'simStepsPerFrame', { 
            label: 'Steps/Frame', 
            min: 1, 
            max: 12, 
        step: 1
    });

    // Turmite size
    folder.addBinding(PARAMS, 'turmiteStepSize', {
        label: 'Size',
        options: {
            '1x': 1,
            '2x': 2,
            '4x': 4,
            '8x': 8,
            '16x': 16
        }
    }).on('change', () => {
        forceFullRedraw();
    });
}

/**
 * Initializes rule selection and custom rule controls
 * @param {object} folder - The rules folder
 */
function initializeRuleControls(folder) {
    // Container for rule controls
    const ruleControls = document.createElement('div');
    Object.assign(ruleControls.style, {
        display: 'grid',
        gridTemplateColumns: '1fr auto auto',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 12px',
        marginBottom: '-14px'  // Half of the desired spacing
    });

    // Saved rules select - Now the primary rule selector
    const savedRuleSelect = document.createElement('select');
    Object.assign(savedRuleSelect.style, {
        ...commonStyles,
        width: '100%',
        padding: '6px 8px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1a1a1a',
        height: '28px'
    });

    // Seed display and controls container
    const seedContainer = document.createElement('div');
    Object.assign(seedContainer.style, {
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        padding: '0 4px'
    });

    // Seed display
    const seedSpan = document.createElement('span');
    Object.assign(seedSpan.style, {
        ...commonStyles,
        padding: '4px 8px',
        backgroundColor: '#1a1a1a',
        borderRadius: '4px',
        width: '60px',
        textAlign: 'center',
        border: '1px solid #444',
        height: '20px',
        lineHeight: '20px',
        cursor: 'pointer'
    });
    seedSpan.textContent = Math.floor(Math.random() * 1000000);
    seedSpan.title = 'Click to copy seed';

    // Add click-to-copy functionality for seed
    seedSpan.onclick = () => {
        navigator.clipboard.writeText(seedSpan.textContent)
            .then(() => {
                const originalTitle = seedSpan.title;
                seedSpan.title = 'Copied!';
                setTimeout(() => {
                    seedSpan.title = originalTitle;
                }, 1000);
            })
            .catch(err => console.error('Failed to copy seed:', err));
    };

    // Random button
    const randomBtn = document.createElement('button');
    Object.assign(randomBtn.style, {
        ...buttonStyle,
        width: '28px',
        height: '28px',
        borderRadius: '4px'
    });
    randomBtn.innerHTML = icons.dice;
    randomBtn.title = 'Generate Random Rule';
    randomBtn.onmouseover = () => {
        randomBtn.style.backgroundColor = '#3a3a3a';
    };
    randomBtn.onmouseout = () => {
        randomBtn.style.backgroundColor = '#2a2a2a';
    };
    randomBtn.onclick = () => {
        handleRuleChange('custom', true);
        
        const seededRandom = function() {
            const seed = parseInt(seedSpan.textContent);
            seedSpan.textContent = (seed * 16807 % 2147483647).toString();
            return (seed * 16807 % 2147483647) / 2147483647;
        };
        
        // Generate random rule using the new function
        const rule = generateRandomRule(seededRandom);
        Object.assign(customRuleParams, rule);
        
        console.log('Generated new custom rule:', {
            turns: {
                state0: rule.state0Turn,
                state1: rule.state1Turn,
                state2: rule.state2Turn,
                state3: rule.state3Turn,
                state4: rule.state4Turn,
                state5: rule.state5Turn,
                state6: rule.state6Turn,
                state7: rule.state7Turn
            },
            transitions: {
                state0: rule.state0Next,
                state1: rule.state1Next,
                state2: rule.state2Next,
                state3: rule.state3Next,
                state4: rule.state4Next,
                state5: rule.state5Next,
                state6: rule.state6Next,
                state7: rule.state7Next
            }
        });
        
        updateCustomRule();
        
        // Update seed for next generation
        seedSpan.textContent = Math.floor(Math.random() * 1000000);
        savedRuleSelect.value = 'custom';
        
        // Refresh the image
        refreshImageWithCurrentRule();
    };

    // Function to handle rule changes
    const handleRuleChange = (selectedRule, skipImageRestore = false) => {
        const wasRunning = PARAMS.running;
        PARAMS.running = false;

        if (selectedRule === 'custom') {
            PARAMS.rule = 'custom';
            setActiveRule('custom');
        } else if (selectedRule === 'langton') {
            PARAMS.rule = 'langton';
            setActiveRule('langton');
        } else if (rules[selectedRule]) { // Built-in rule table present
            PARAMS.rule = selectedRule;
            setActiveRule(selectedRule);
        } else if (rulePresets[selectedRule]) { // Apply preset into custom rule
            applyRulePreset(selectedRule);
            PARAMS.rule = 'custom';
            setActiveRule('custom');
        } else {
            // Assume it is a saved custom rule
            const ruleData = loadCustomRule(selectedRule);
            if (ruleData) {
                PARAMS.rule = 'custom';
                setActiveRule('custom');
                seedSpan.textContent = ruleData.seed;
                Object.assign(customRuleParams, ruleData.params);
                updateCustomRule();
            } else {
                console.warn('Rule not found:', selectedRule);
            }
        }

        if (!skipImageRestore && isImageLoaded) {
            restoreImageAfterRuleChange();
        }

        PARAMS.running = wasRunning;
        updatePlaybackButtonStates();
    };

    function updateSavedRulesList() {
        const savedRules = getSavedRules();
        persistRulesToCookie();

        savedRuleSelect.innerHTML = '<option value="custom">Custom Rule</option>';

        // Built-in rules section
        Object.keys(rules).forEach(rn => {
            const opt = document.createElement('option');
            opt.value = rn;
            opt.text = rn;
            savedRuleSelect.appendChild(opt);
        });

        // Saved custom rules section (optional)
        if (PARAMS.showSavedRules && savedRules.length) {
            const divider = document.createElement('option');
            divider.disabled = true;
            divider.text = '── Saved Rules ──';
            savedRuleSelect.appendChild(divider);

            savedRules.forEach(({ name, timestamp }) => {
                const option = document.createElement('option');
                option.value = name;
                option.text = name;
                option.title = new Date(timestamp).toLocaleString();
                savedRuleSelect.appendChild(option);
            });
        }

        // Ensure current selection is valid
        if (![...savedRuleSelect.options].some(opt => opt.value === savedRuleSelect.value)) {
            savedRuleSelect.value = 'custom';
        }
    }

    savedRuleSelect.onchange = () => {
        handleRuleChange(savedRuleSelect.value);
    };

    // Checkbox to toggle saved rules visibility
    const toggleContainer=document.createElement('label');
    Object.assign(toggleContainer.style,{display:'flex',alignItems:'center',gap:'4px',color:'#ccc',fontSize:'11px'});
    const toggleChk=document.createElement('input');
    toggleChk.type='checkbox';
    toggleChk.checked=PARAMS.showSavedRules;
    toggleChk.onchange=()=>{
        PARAMS.showSavedRules=toggleChk.checked;
        updateSavedRulesList();
    };
    const toggleTxt=document.createElement('span'); toggleTxt.textContent='Saved';
    toggleContainer.appendChild(toggleChk); toggleContainer.appendChild(toggleTxt);
    seedContainer.appendChild(toggleContainer);

    // Add elements to containers
    seedContainer.appendChild(seedSpan);
    ruleControls.appendChild(savedRuleSelect);
    ruleControls.appendChild(seedContainer);
    ruleControls.appendChild(randomBtn);

    // Add container to folder
    folder.element.appendChild(ruleControls);

    // Save/Load Container
    const saveLoadContainer = document.createElement('div');
    Object.assign(saveLoadContainer.style, {
        display: 'grid',
        gridTemplateColumns: '180px auto auto auto',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 12px',
        marginTop: '6px'    // Half of the desired spacing
    });

    // Rule name input
    const nameInput = document.createElement('input');
    Object.assign(nameInput.style, {
        ...commonStyles,
        padding: '2px 6px',
        borderRadius: '4px',
        border: '1px solid #444',
        backgroundColor: '#1a1a1a',
        height: '24px',
        fontSize: '12px',
        width: '180px',
        boxSizing: 'border-box'
    });
    nameInput.placeholder = 'Rule name';

    // Save button
    const saveBtn = document.createElement('button');
    const enhancedButtonStyle = {
        ...buttonStyle,
        width: '28px',
        height: '28px',
        borderRadius: '4px',
        margin: '0 2px'
    };
    Object.assign(saveBtn.style, enhancedButtonStyle);
    saveBtn.innerHTML = icons.save;
    saveBtn.title = 'Save Rule';
    saveBtn.onclick = () => {
        const name = nameInput.value.trim();
        if (!name) {
            alert('Please enter a name for the rule');
            return;
        }
        
        const seed = parseInt(seedSpan.textContent);
        if (saveCustomRule(name, seed, customRuleParams)) {
            nameInput.value = '';
            updateSavedRulesList();
            savedRuleSelect.value = name;
        } else {
            alert('Failed to save rule');
        }
    };

    // Edit name button
    const editBtn = document.createElement('button');
    Object.assign(editBtn.style, enhancedButtonStyle);
    editBtn.innerHTML = '✎';
    editBtn.title = 'Edit Rule Name';
    editBtn.onclick = () => {
        const selectedRule = savedRuleSelect.value;
        
        // Handle built-in rules
        if (selectedRule === 'custom') {
            alert('Cannot rename the default Custom Rule');
            return;
        }
        if (selectedRule === 'langton') {
            alert('Cannot rename Langton\'s Ant rule');
            return;
        }
        
        // Get the current rule name from the dropdown
        const currentName = savedRuleSelect.options[savedRuleSelect.selectedIndex].text;
        const newName = prompt('Enter new name:', currentName);
        
        if (newName && newName.trim()) {
            const trimmedNewName = newName.trim();
            
            // Check if the new name is a reserved name
            if (trimmedNewName.toLowerCase() === 'custom' || 
                trimmedNewName.toLowerCase() === 'langton' || 
                trimmedNewName.toLowerCase() === 'langton\'s ant') {
                alert('Cannot use reserved rule names (Custom, Langton)');
                return;
            }
            
            // Check if the name is actually different
            if (trimmedNewName !== currentName) {
                if (renameCustomRule(currentName, trimmedNewName)) {
                    updateSavedRulesList();
                    savedRuleSelect.value = trimmedNewName;
                } else {
                    alert('Failed to rename rule. The name might already be in use.');
                }
            }
        }
    };

    // Delete button
    const deleteBtn = document.createElement('button');
    Object.assign(deleteBtn.style, enhancedButtonStyle);
    deleteBtn.innerHTML = icons.delete;
    deleteBtn.title = 'Delete Rule';
    deleteBtn.onclick = () => {
        const selectedRule = savedRuleSelect.value;
        if (!selectedRule || selectedRule === 'custom' || selectedRule === 'langton') {
            alert('Please select a saved rule to delete');
            return;
        }
        
        if (confirm(`Delete rule "${selectedRule}"?`)) {
            if (deleteCustomRule(selectedRule)) {
                updateSavedRulesList();
                savedRuleSelect.value = 'custom';
                handleRuleChange('custom');
            } else {
                alert('Failed to delete rule');
            }
        }
    };

    // Add elements to save/load container
    saveLoadContainer.appendChild(nameInput);
    saveLoadContainer.appendChild(saveBtn);
    saveLoadContainer.appendChild(editBtn);
    saveLoadContainer.appendChild(deleteBtn);

    // Add container to folder
    folder.element.appendChild(saveLoadContainer);

    // Initialize saved rules list and set default to custom
    updateSavedRulesList();
    handleRuleChange('custom', true);
}

/**
 * Initializes appearance controls for colors and sizes
 * @param {object} folder - The appearance folder
 */
function initializeAppearanceControls(folder) {
    // Hardcode 8-bit mode
    PARAMS.paletteBitDepth = 8;

    // Palette selector with all available palettes
    const paletteOptions = {
        '  Default': 'default',
        '  Black & White': 'bw',
        '  Forest': 'forest',
        '  Ocean': 'ocean',
        '  Sunset': 'sunset',
        '  Neon': 'neon',
        '  Earth': 'earth',
        '  Fire': 'fire',
        '  Winter': 'winter',
        '  Pastel': 'pastel',
        '  Retro': 'retro',
        '  Heatmap': 'heatmap',
        '  CGA 0': 'cga0',
        '  CGA 1': 'cga1',
        '  C64': 'c64',
        '  Game Boy': 'gameboy',
        '  ZX Spectrum': 'spectrum',
        '  Apple II': 'apple2',
        '  ANSI': 'ansi',
        '  Grayscale': 'grayscale',
        '  Sepia': 'sepia',
        '  Amber': 'amber',
        '  VGA 8': 'vga8',
        '  Windows 8': 'win8',
        '  Mac 8': 'mac8',
        '  Solarized': 'solarized',
        '  Nord': 'nord',
        '  Dracula': 'dracula',
        '  Gruvbox': 'gruvbox',
        '  Monokai': 'monokai',
        '  Material': 'material',
        '  Tokyo': 'tokyo',
        '  Mocha': 'mocha',
        '  One Dark': 'onedark',
        '  Ayu': 'ayu'
    };

    // Create container for palette preview
    const previewContainer = document.createElement('div');
    Object.assign(previewContainer.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '2px',
        marginTop: '8px',
        marginBottom: '8px',
        padding: '4px',
        backgroundColor: '#1a1a1a',
        borderRadius: '4px'
    });

    // Function to update the palette preview
    function updatePalettePreview() {
        previewContainer.innerHTML = '';
        const paletteName = PARAMS.palette;
        const palette = palettes[paletteName];
        
        if (!palette) {
            console.warn(`Palette "${paletteName}" not found, using default`);
            const errorBox = document.createElement('div');
            errorBox.textContent = 'Palette not found';
            errorBox.style.padding = '8px';
            errorBox.style.color = '#ff5555';
            previewContainer.appendChild(errorBox);
            return;
        }
        
        try {
            if (Array.isArray(palette)) {
                // For array-based palettes (8-bit)
                palette.forEach((colorArray, index) => {
                    // Skip undefined entries with a safe check
                    if (!colorArray || !Array.isArray(colorArray) || colorArray.length < 3) {
                        const placeholderBox = document.createElement('div');
                        placeholderBox.style.width = '100%';
                        placeholderBox.style.height = '20px';
                        placeholderBox.style.backgroundColor = '#888888';
                        placeholderBox.style.borderRadius = '2px';
                        placeholderBox.title = 'Invalid color';
                        previewContainer.appendChild(placeholderBox);
                        return;
                    }
                    
                    // Convert color array to hex string with safety checks
                    const colorHex = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`;
                    
                    const colorBox = document.createElement('div');
                    Object.assign(colorBox.style, {
                        width: '100%',
                        height: '20px',
                        backgroundColor: colorHex,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        position: 'relative'
                    });
                    
                    // Add tooltip with hex color
                    colorBox.title = colorHex;
                    
                    // Add click to copy functionality
                    colorBox.onclick = () => {
                        navigator.clipboard.writeText(colorHex)
                            .then(() => {
                                const originalTitle = colorBox.title;
                                colorBox.title = 'Copied!';
                                setTimeout(() => {
                                    colorBox.title = originalTitle;
                                }, 1000);
                            })
                            .catch(err => console.error('Failed to copy color:', err));
                    };
                    
                    previewContainer.appendChild(colorBox);
                });
            } else {
                // For object-based palettes
                const states = [
                    STATE_WHITE,
                    STATE_BLACK,
                    STATE_GRAY,
                    STATE_DARK_GRAY,
                    STATE_LIGHT_GRAY,
                    STATE_RED,
                    STATE_GREEN,
                    STATE_BLUE
                ];
                
                states.forEach(state => {
                    // Check if palette has this state, or use default/fallback
                    const color = palette && (palette[state] || palette.default) || '#888888';
                    const colorBox = document.createElement('div');
                    Object.assign(colorBox.style, {
                        width: '100%',
                        height: '20px',
                        backgroundColor: color,
                        borderRadius: '2px',
                        cursor: 'pointer',
                        position: 'relative'
                    });
                    
                    // Add tooltip with hex color
                    colorBox.title = color;
                    
                    // Add click to copy functionality
                    colorBox.onclick = () => {
                        navigator.clipboard.writeText(color)
                            .then(() => {
                                const originalTitle = colorBox.title;
                                colorBox.title = 'Copied!';
                                setTimeout(() => {
                                    colorBox.title = originalTitle;
                                }, 1000);
                            })
                            .catch(err => console.error('Failed to copy color:', err));
                    };
                    
                    previewContainer.appendChild(colorBox);
                });
            }
        } catch (error) {
            console.warn(`Error generating palette preview: ${error.message}`);
            // Create a fallback preview element
            const errorBox = document.createElement('div');
            errorBox.textContent = 'Preview unavailable';
            errorBox.style.padding = '8px';
            errorBox.style.color = '#ff5555';
            previewContainer.appendChild(errorBox);
        }
    }

    // Add palette selector
    folder.addBinding(PARAMS, 'palette', {
        label: 'Colors',
        options: paletteOptions
    }).on('change', () => {
        forceFullRedraw();
        updatePalettePreview();
    });

    // Add the preview container to the folder
    folder.element.appendChild(previewContainer);

    // Initialize the preview
    updatePalettePreview();

    // Ensure any binding that changes customRuleParams triggers a live update
    if (UIState.customRuleFolder) {
        UIState.customRuleFolder.on('change', () => {
            updateCustomRule();
            if (!PARAMS.running) forceFullRedraw();
        });
    }
}

/**
 * Store the last uploaded image for refresh functionality
 * @param {File} file - The uploaded image file
 */
export function setLastUploadedImage(file) {
    UIState.lastUploadedImage = file;
    // Store image data in localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            localStorage.setItem('lastUploadedImage', e.target.result);
            console.log('Image saved to localStorage');
        } catch (error) {
            console.warn('Failed to save image to localStorage:', error);
        }
    };
    reader.readAsDataURL(file);
}

// Restore the last uploaded image after refresh
function restoreLastUploadedImage() {
    const imageData = localStorage.getItem('lastUploadedImage');
    if (imageData) {
        console.log('Found saved image, restoring...');
        // Convert base64 string back to a file
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'restored_image.png', { type: 'image/png' });
                handleImageUpload(file);
            })
            .catch(error => console.error('Failed to restore image:', error));
    }
}

/**
 * Refreshes the image with current rule settings
 * @returns {Promise} Promise that resolves when image is refreshed
 */
function refreshImageWithCurrentRule() {
    if (!isImageLoaded) {
        forceFullRedraw();
        return Promise.resolve();
    }

    const imageData = localStorage.getItem('lastUploadedImage');
    if (!imageData) {
        forceFullRedraw();
        return Promise.resolve();
    }

    console.log('Refreshing image with current rule...');
    return fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
            const file = new File([blob], 'restored_image.png', { type: 'image/png' });
            return handleImageUpload(file);
        })
        .catch(error => {
            console.error('Failed to refresh image:', error);
            forceFullRedraw();
        });
}

/**
 * Restores the last uploaded image after a rule change
 */
async function restoreImageAfterRuleChange() {
    try {
        const imageData = localStorage.getItem('lastUploadedImage');
        if (!imageData) {
            console.log('No previous image found to restore');
            forceFullRedraw();
            return;
        }

        // Convert base64 to blob
        const response = await fetch(imageData);
        const blob = await response.blob();
        
        // Create a File object from the blob
        const file = new File([blob], 'restored-image.png', { type: 'image/png' });
        
        // Process the image using existing handleImageUpload
        handleImageUpload(file);
        
    } catch (error) {
        console.error('Failed to restore image:', error);
        forceFullRedraw();
    }
}

function initializeCustomRuleControls(folder) {
    // State 0 controls
    folder.addBinding(customRuleParams, 'state0Turn', {
        label: 'State 0 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state0Next', {
        label: 'State 0 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 1 controls
    folder.addBinding(customRuleParams, 'state1Turn', {
        label: 'State 1 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state1Next', {
        label: 'State 1 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 2 controls
    folder.addBinding(customRuleParams, 'state2Turn', {
        label: 'State 2 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state2Next', {
        label: 'State 2 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 3 controls
    folder.addBinding(customRuleParams, 'state3Turn', {
        label: 'State 3 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state3Next', {
        label: 'State 3 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 4 controls
    folder.addBinding(customRuleParams, 'state4Turn', {
        label: 'State 4 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state4Next', {
        label: 'State 4 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 5 controls
    folder.addBinding(customRuleParams, 'state5Turn', {
        label: 'State 5 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state5Next', {
        label: 'State 5 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 6 controls
    folder.addBinding(customRuleParams, 'state6Turn', {
        label: 'State 6 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state6Next', {
        label: 'State 6 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });

    // State 7 controls
    folder.addBinding(customRuleParams, 'state7Turn', {
        label: 'State 7 Turn',
        options: { 'Left': -1, 'None': 0, 'Right': 1, 'U-Turn': 2 }
    });
    folder.addBinding(customRuleParams, 'state7Next', {
        label: 'State 7 Next',
        options: {
            'White': STATE_WHITE,
            'Black': STATE_BLACK,
            'Gray': STATE_GRAY,
            'Dark Gray': STATE_DARK_GRAY,
            'Light Gray': STATE_LIGHT_GRAY,
            'Red': STATE_RED,
            'Green': STATE_GREEN,
            'Blue': STATE_BLUE
        }
    });
}
