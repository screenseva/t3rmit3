// constants.js

// --- Grid Size --- (Base size, actual grid dimensions depend on canvas)
export const BASE_CELL_SIZE = 10; // Base size for drawing at 1x zoom

// --- State Representation (16 bits) ---
export const MASK_TURMITE_PRESENCE = 0x8000; // 1000 0000 0000 0000
export const MITE_PRESENT_VAL = 0x8000;
export const MASK_DIRECTION = 0x7000;       // 0111 0000 0000 0000
export const SHIFT_DIRECTION = 12;
export const MASK_TILE_STATE = 0x00FF;      // 0000 0000 1111 1111

// --- Directions Map (0-7 clockwise) ---
export const DIRECTIONS = [
  { dx: -1, dy: -1 }, { dx:  0, dy: -1 }, { dx:  1, dy: -1 }, { dx:  1, dy:  0 },
  { dx:  1, dy:  1 }, { dx:  0, dy:  1 }, { dx: -1, dy:  1 }, { dx: -1, dy:  0 }
];
export const NUM_DIRECTIONS = 8;

// --- Tile States (0-7) ---
export const STATE_WHITE = 0;
export const STATE_BLACK = 1;
export const STATE_GRAY = 2;
export const STATE_DARK_GRAY = 3;
export const STATE_LIGHT_GRAY = 4;
export const STATE_RED = 5;
export const STATE_GREEN = 6;
export const STATE_BLUE = 7;
export const NUM_TILE_STATES = 256;

// --- Parameter Object (Defaults) ---
export const PARAMS = {
    // Simulation Params
    rule: 'langton',
    pattern: 'empty',
    speed: 30, // Target rendering FPS for ticker
    simStepsPerFrame: 1, // Steps per render frame
    stepsPerTurmite: 1, // How many steps each turmite takes (1-10)
    running: false,
    isCustomRule: false, // Toggle for custom rule mode

    // Visualization Params
    zoom: 1.0,
    followTurmite: false, // Default off
    showGrid: false,
    showDirection: false,
    turmiteColor: '#00ffff',
    backgroundColor: '#222222',
    invertImage: false, // Whether to invert image colors when loading

    // Canvas Size Params
    canvasWidth: 800,
    canvasHeight: 600,
    turmiteStepSize: 4,
    palette: 'default',
    paletteBitDepth: 4,
    numTurmites: 10,
    showSavedRules: true
};

// --- Axons Rule Constants ---
export const MASK_AXONS_STATE = 0x01;      // 00000001
export const MASK_AXONS_PAST = 0x02;       // 00000010
export const MASK_AXONS_TIME = 0x7C;       // 01111100
export const MASK_AXONS_MASK = 0x80;       // 10000000
export const AXONS_WOLF_CODE = 178;        // Rule constant
export const AXONS_MAX_TIME = 31;          // Maximum time value (5 bits)