// constants.js

// --- Grid Size --- (Base size, actual grid dimensions depend on canvas)
export const BASE_CELL_SIZE = 10; // Base size for drawing at 1x zoom

// --- State Representation (8 bits) ---
export const MASK_TURMITE_PRESENCE = 0xC0; // 11000000
export const MITE_PRESENT_VAL = 0x80;     // 10000000
export const MASK_DIRECTION = 0x1C;       // 00011100
export const SHIFT_DIRECTION = 2;
export const MASK_TILE_STATE = 0x03;      // 00000011

// --- Directions Map (0-7 clockwise) ---
export const DIRECTIONS = [
  { dx: -1, dy: -1 }, { dx:  0, dy: -1 }, { dx:  1, dy: -1 }, { dx:  1, dy:  0 },
  { dx:  1, dy:  1 }, { dx:  0, dy:  1 }, { dx: -1, dy:  1 }, { dx: -1, dy:  0 }
];
export const NUM_DIRECTIONS = 8;

// --- Tile States (0-3) ---
export const STATE_WHITE = 0;
export const STATE_BLACK = 1;
export const STATE_GRAY = 2;
export const STATE_DARK_GRAY = 3;
export const NUM_TILE_STATES = 4;

// --- Parameter Object (Defaults) ---
export const PARAMS = {
    // Simulation Params
    rule: 'langton',
    pattern: 'empty',
    speed: 30, // Target rendering FPS for ticker
    simStepsPerFrame: 1, // Steps per render frame
    running: true,
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
    turmiteStepSize: 1,
    palette: 'default',
}; 