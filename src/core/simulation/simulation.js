// simulation.js

import {
    PARAMS,
    BASE_CELL_SIZE, // Needed for pattern generation?
    MASK_TURMITE_PRESENCE, MITE_PRESENT_VAL, MASK_DIRECTION, SHIFT_DIRECTION, MASK_TILE_STATE,
    DIRECTIONS, NUM_DIRECTIONS,
    STATE_WHITE, STATE_BLACK, STATE_GRAY, STATE_DARK_GRAY, STATE_LIGHT_GRAY, STATE_RED, STATE_GREEN, STATE_BLUE, NUM_TILE_STATES,
    MASK_AXONS_STATE, MASK_AXONS_PAST, MASK_AXONS_TIME, MASK_AXONS_MASK, AXONS_WOLF_CODE, AXONS_MAX_TIME
} from '../constants.js';

import Grid from './grid.js';
import Turmite from './turmite.js';

// --- Simulation State Variables ---
export let grid;
export let turmites = []; // Array to track multiple turmites
export let steps = 0;
export let tilesModified = 0;

// Shared rendering flags (can renderer import these? or pass via function?)
// Let's keep them internal to simulation for now, and initGrid returns a flag?
let dirtyCells = new Set();
let needsFullRedraw = true;

// Internal module variables holding current dimensions
export let internalGridWidth = 0;
export let internalGridHeight = 0;

export let dynamicCellSize = BASE_CELL_SIZE; // Size used for rendering, can change
export let isImageLoaded = false; // Flag to track if grid is image-based

// Initialize spatial hash map for fast collision detection
let spatialMap = new Map();

/**
 * Generates a spatial key for a given coordinate
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {string} Spatial key
 */
function getSpatialKey(x, y) {
    return `${Math.floor(x)},${Math.floor(y)}`;
}

/**
 * Updates the spatial map with current turmite positions
 * More efficient than checking all pairs of turmites for collisions
 */
function updateSpatialMap() {
    spatialMap.clear();
    for (let i = 0; i < turmites.length; i++) {
        const turmite = turmites[i];
        spatialMap.set(getSpatialKey(turmite.x, turmite.y), i);
    }
}

// Helper to check if a position is already occupied by a turmite
function isPositionOccupied(x, y) {
    return spatialMap.has(getSpatialKey(x, y));
}

// --- Custom Rules Parameters ---
export const customRuleParams = {
    state0Turn: 1,
    state0Next: STATE_BLACK,
    state1Turn: -1,
    state1Next: STATE_WHITE,
    state2Turn: 1,
    state2Next: STATE_DARK_GRAY,
    state3Turn: -1,
    state3Next: STATE_GRAY,
    state4Turn: 1,
    state4Next: STATE_LIGHT_GRAY,
    state5Turn: -1,
    state5Next: STATE_RED,
    state6Turn: 1,
    state6Next: STATE_GREEN,
    state7Turn: -1,
    state7Next: STATE_BLUE
};

// --- Rule Presets ---
export const rulePresets = {
    'langton': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_GRAY,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'spiral': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_GRAY,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'chaos': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -2,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_GRAY,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -2,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'symmetrical': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_GRAY,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'filling': {
        state0Turn: 0,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_WHITE,
        state3Turn: 0,
        state3Next: STATE_DARK_GRAY,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'crystal': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: 0,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: 2,
        state3Next: STATE_WHITE,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'highway': {
        state0Turn: 0,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_WHITE,
        state3Turn: 0,
        state3Next: STATE_DARK_GRAY,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'maze': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_GRAY,
        state2Turn: 0,
        state2Next: STATE_WHITE,
        state3Turn: 1,
        state3Next: STATE_DARK_GRAY,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 0,
        state6Next: STATE_GREEN,
        state7Turn: 1,
        state7Next: STATE_BLUE
    },
    'mandala': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_GRAY,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -2,
        state3Next: STATE_WHITE,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -1,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -2,
        state7Next: STATE_BLUE
    },
    'snowflake': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -2,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_GRAY,
        state3Turn: -1,
        state3Next: STATE_DARK_GRAY,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -2,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'celtic_knot': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: 2,
        state1Next: STATE_GRAY,
        state2Turn: -2,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_WHITE,
        state4Turn: 1,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: 2,
        state5Next: STATE_RED,
        state6Turn: -2,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'arabesque': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -2,
        state3Next: STATE_WHITE,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: 1,
        state5Next: STATE_RED,
        state6Turn: -1,
        state6Next: STATE_GREEN,
        state7Turn: -2,
        state7Next: STATE_BLUE
    },
    'fractal': {
        state0Turn: 2,
        state0Next: STATE_DARK_GRAY,
        state1Turn: -2,
        state1Next: STATE_BLACK,
        state2Turn: 1,
        state2Next: STATE_WHITE,
        state3Turn: -1,
        state3Next: STATE_GRAY,
        state4Turn: 2,
        state4Next: STATE_LIGHT_GRAY,
        state5Turn: -2,
        state5Next: STATE_RED,
        state6Turn: 1,
        state6Next: STATE_GREEN,
        state7Turn: -1,
        state7Next: STATE_BLUE
    },
    'axons': {
        name: 'Axons',
        description: 'One-dimensional reversible rule with timing and masking',
        pattern: 'axons',
        speed: 60,
        showGrid: true
    }
};

// --- Rule Engine ---
export const rules = {
    'langton': {
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: -1, nextTileState: STATE_WHITE },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_GRAY },
        4: { turn: 1, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: -1, nextTileState: STATE_RED },
        6: { turn: 1, nextTileState: STATE_GREEN },
        7: { turn: -1, nextTileState: STATE_BLUE }
    },
    'complex_pattern': {
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: 0, nextTileState: STATE_WHITE },
        2: { turn: -1, nextTileState: STATE_DARK_GRAY },
        3: { turn: 1, nextTileState: STATE_GRAY },
        4: { turn: -1, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: 1, nextTileState: STATE_RED },
        6: { turn: -1, nextTileState: STATE_GREEN },
        7: { turn: 1, nextTileState: STATE_BLUE }
    },
    'spiral': {
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: -1, nextTileState: STATE_WHITE },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_GRAY },
        4: { turn: 1, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: -1, nextTileState: STATE_RED },
        6: { turn: 1, nextTileState: STATE_GREEN },
        7: { turn: -1, nextTileState: STATE_BLUE }
    },
    'random_walk': {
        0: { turn: 0, nextTileState: STATE_BLACK },
        1: { turn: 0, nextTileState: STATE_WHITE },
        2: { turn: 0, nextTileState: STATE_DARK_GRAY },
        3: { turn: 0, nextTileState: STATE_GRAY },
        4: { turn: 0, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: 0, nextTileState: STATE_RED },
        6: { turn: 0, nextTileState: STATE_GREEN },
        7: { turn: 0, nextTileState: STATE_BLUE }
    },
    'highway': {
        0: { turn: 0, nextTileState: STATE_BLACK },
        1: { turn: 1, nextTileState: STATE_GRAY },
        2: { turn: -1, nextTileState: STATE_WHITE },
        3: { turn: 0, nextTileState: STATE_DARK_GRAY },
        4: { turn: 1, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: -1, nextTileState: STATE_RED },
        6: { turn: 1, nextTileState: STATE_GREEN },
        7: { turn: -1, nextTileState: STATE_BLUE }
    },
    'zigzag': {
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: -1, nextTileState: STATE_WHITE },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_GRAY },
        4: { turn: 1, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: -1, nextTileState: STATE_RED },
        6: { turn: 1, nextTileState: STATE_GREEN },
        7: { turn: -1, nextTileState: STATE_BLUE }
    },
    'art_drawer': {
        0: { turn: 2, nextTileState: STATE_BLACK },
        1: { turn: -2, nextTileState: STATE_GRAY },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_WHITE },
        4: { turn: 2, nextTileState: STATE_LIGHT_GRAY },
        5: { turn: -2, nextTileState: STATE_RED },
        6: { turn: 1, nextTileState: STATE_GREEN },
        7: { turn: -1, nextTileState: STATE_BLUE }
    },
    'rainbow8': {},
    'cycle16': {},
    'custom': {
        0: { turn: customRuleParams.state0Turn, nextTileState: customRuleParams.state0Next },
        1: { turn: customRuleParams.state1Turn, nextTileState: customRuleParams.state1Next },
        2: { turn: customRuleParams.state2Turn, nextTileState: customRuleParams.state2Next },
        3: { turn: customRuleParams.state3Turn, nextTileState: customRuleParams.state3Next },
        4: { turn: customRuleParams.state4Turn, nextTileState: customRuleParams.state4Next },
        5: { turn: customRuleParams.state5Turn, nextTileState: customRuleParams.state5Next },
        6: { turn: customRuleParams.state6Turn, nextTileState: customRuleParams.state6Next },
        7: { turn: customRuleParams.state7Turn, nextTileState: customRuleParams.state7Next }
    },
    'axons': {
        0: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Extract components from current state
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                // Calculate sum of all 8 neighbors + self
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                // Calculate new state using WolfCode
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                // Handle time and mask
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        1: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        2: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        3: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        4: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        5: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        6: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        },
        7: { 
            turn: 0, 
            nextTileState: (currentState, neighbors) => {
                // Same logic as state 0
                const currentBit = currentState & MASK_AXONS_STATE;
                const pastBit = (currentState & MASK_AXONS_PAST) >> 1;
                const time = (currentState & MASK_AXONS_TIME) >> 2;
                const mask = (currentState & MASK_AXONS_MASK) >> 7;
                
                const sum = (
                    (neighbors.left & MASK_AXONS_STATE) +
                    (neighbors.right & MASK_AXONS_STATE) +
                    (neighbors.up & MASK_AXONS_STATE) +
                    (neighbors.down & MASK_AXONS_STATE) +
                    (neighbors.upLeft & MASK_AXONS_STATE) +
                    (neighbors.upRight & MASK_AXONS_STATE) +
                    (neighbors.downLeft & MASK_AXONS_STATE) +
                    (neighbors.downRight & MASK_AXONS_STATE) +
                    currentBit
                );
                
                const newBit = (AXONS_WOLF_CODE >> sum) & 1;
                const newState = (currentBit << 1) | (newBit ^ pastBit);
                
                if (time === AXONS_MAX_TIME) {
                    return (mask << 7) | newState | mask;
                } else {
                    return (mask << 7) | ((time + 1) << 2) | newState;
                }
            }
        }
    }
};
export let activeRule = rules[PARAMS.rule];

// --- State Getters (allow other modules to read state safely) ---
export function getSimulationState() {
    return {
        grid,
        turmites,
        steps,
        tilesModified,
        gridWidth: grid ? internalGridWidth : 0, // Use internalGridWidth
        gridHeight: grid ? internalGridHeight : 0, // Use internalGridHeight
        dynamicCellSize,
        isImageLoaded
    };
}

export function getDirtyCellsInfo() {
    const info = { cells: new Set(dirtyCells), needsFullRedraw };
    dirtyCells.clear();
    needsFullRedraw = false; // Reset after fetching
    return info;
}

/** Explicitly force a full redraw on the next frame */
export function forceFullRedraw() {
    needsFullRedraw = true;
}

// --- State Modifiers & Logic --- //

/** Sets the active rule and resets simulation. */
export function setActiveRule(ruleName) {
    if (rules[ruleName]) {
        PARAMS.rule = ruleName;
        // If switching to custom rule, update it first
        if (ruleName === 'custom') {
            updateCustomRule();
        }
        activeRule = rules[PARAMS.rule];
        console.log("Switched to rule:", PARAMS.rule);
        PARAMS.running = false;
        initializeGrid(PARAMS.pattern, internalGridWidth, internalGridHeight, true); // Reset places turmite
    } else {
        console.error("Rule not found:", ruleName);
    }
}

/**
 * Updates the custom rule with current parameter values
 */
export function updateCustomRule() {
    rules.custom = {
        0: { turn: customRuleParams.state0Turn, nextTileState: customRuleParams.state0Next },
        1: { turn: customRuleParams.state1Turn, nextTileState: customRuleParams.state1Next },
        2: { turn: customRuleParams.state2Turn, nextTileState: customRuleParams.state2Next },
        3: { turn: customRuleParams.state3Turn, nextTileState: customRuleParams.state3Next },
        4: { turn: customRuleParams.state4Turn, nextTileState: customRuleParams.state4Next },
        5: { turn: customRuleParams.state5Turn, nextTileState: customRuleParams.state5Next },
        6: { turn: customRuleParams.state6Turn, nextTileState: customRuleParams.state6Next },
        7: { turn: customRuleParams.state7Turn, nextTileState: customRuleParams.state7Next }
    };
    
    // If custom rule is active, update the active rule reference
    if (PARAMS.rule === 'custom') {
        activeRule = rules.custom;
    }
}

/** Find the best starting position for a single turmite (for backward compatibility) */
export function findBestStartPosition(midX, midY) {
    // Use the new function to find the best position
    const positions = findBestStartPositions(1);
    if (positions.length > 0) {
        return positions[0];
    }
    
    // Fallback to center if no position found
    return { 
        x: Math.max(0, Math.min(midX, internalGridWidth - 1)),
        y: Math.max(0, Math.min(midY, internalGridHeight - 1))
    };
}

/** Find multiple best starting positions for turmites */
export function findBestStartPositions(numTurmites = 5) {
    const positions = [];
    const maxRadius = Math.min(internalGridWidth, internalGridHeight) / 2.5;
    const midX = Math.floor(internalGridWidth / 2);
    const midY = Math.floor(internalGridHeight / 2);
    
    // Keep track of used positions to maintain distance between turmites
    const usedPositions = new Set();
    const minDistance = Math.max(10, Math.min(internalGridWidth, internalGridHeight) / 6);
    
    // First check if we're dealing with an image (for edge detection)
    if (isImageLoaded) {
        console.log("Using edge detection for turmite placement...");
        const edgePoints = detectEdges();
        
        if (edgePoints.length > 0) {
            // We found some edges, use them for placement
            console.log(`Found ${edgePoints.length} edge points for turmite placement`);
            
            // Helper function to check if position is far enough from used positions
            const isFarEnough = (x, y) => {
                for (const pos of usedPositions) {
                    const [px, py] = pos.split(',').map(Number);
                    const dx = Math.min(Math.abs(x - px), internalGridWidth - Math.abs(x - px));
                    const dy = Math.min(Math.abs(y - py), internalGridHeight - Math.abs(y - py));
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < minDistance) return false;
                }
                return true;
            };
            
            // Take top edge points, maintaining minimum distance
            for (const point of edgePoints) {
                if (positions.length >= numTurmites) break;
                
                if (isFarEnough(point.x, point.y) && !isTurmitePresent(point.x, point.y)) {
                    positions.push({ x: point.x, y: point.y });
                    usedPositions.add(`${point.x},${point.y}`);
                }
            }
            
            // If we found enough positions using edge detection, return them
            if (positions.length >= numTurmites) {
                console.log(`Successfully placed ${positions.length} turmites on edge points`);
                return positions;
            }
            
            // Otherwise, continue with the fallback placement strategy
            console.log(`Could only place ${positions.length} turmites on edges, need ${numTurmites - positions.length} more`);
        }
    }
    
    // Create a grid of potential starting positions (fallback method)
    const gridSize = Math.ceil(Math.sqrt((numTurmites - positions.length) * 2)); // Multiply by 2 to have more options
    const cellWidth = Math.floor(internalGridWidth / gridSize);
    const cellHeight = Math.floor(internalGridHeight / gridSize);
    
    // Generate candidate positions in a grid pattern with some randomness
    const candidates = [];
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const baseX = Math.floor(i * cellWidth + cellWidth / 2);
            const baseY = Math.floor(j * cellHeight + cellHeight / 2);
            
            // Add some randomness to the position within the cell
            const randomOffsetX = Math.floor((Math.random() - 0.5) * cellWidth * 0.5);
            const randomOffsetY = Math.floor((Math.random() - 0.5) * cellHeight * 0.5);
            
            const x = Math.max(0, Math.min(internalGridWidth - 1, baseX + randomOffsetX));
            const y = Math.max(0, Math.min(internalGridHeight - 1, baseY + randomOffsetY));
            
            // Calculate score based on distance from center and edges
            const distFromCenter = Math.sqrt(
                Math.pow(x - midX, 2) + Math.pow(y - midY, 2)
            );
            const distFromEdge = Math.min(
                x, y, internalGridWidth - x, internalGridHeight - y
            );
            
            // Score favors positions away from edges but not too far from center
            const score = (1 - distFromCenter / maxRadius) * 0.6 + 
                         (distFromEdge / minDistance) * 0.4;
            
            candidates.push({ x, y, score });
        }
    }
    
    // Sort candidates by score
    candidates.sort((a, b) => b.score - a.score);
    
    // Helper function to check if position is far enough from used positions
    const isFarEnough = (x, y) => {
        for (const pos of usedPositions) {
            const [px, py] = pos.split(',').map(Number);
            const dx = Math.min(Math.abs(x - px), internalGridWidth - Math.abs(x - px));
            const dy = Math.min(Math.abs(y - py), internalGridHeight - Math.abs(y - py));
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < minDistance) return false;
        }
        return true;
    };
    
    // Select best positions maintaining minimum distance
    for (const candidate of candidates) {
        if (positions.length >= numTurmites) break;
        
        if (isFarEnough(candidate.x, candidate.y) && !isTurmitePresent(candidate.x, candidate.y)) {
            positions.push({ x: candidate.x, y: candidate.y });
            usedPositions.add(`${candidate.x},${candidate.y}`);
        }
    }
    
    // If we still need more positions, relax the distance constraint
    if (positions.length < numTurmites) {
        const relaxedMinDistance = minDistance / 2;
        for (const candidate of candidates) {
            if (positions.length >= numTurmites) break;
            
            let tooClose = false;
            for (const pos of usedPositions) {
                const [px, py] = pos.split(',').map(Number);
                const dx = Math.min(Math.abs(candidate.x - px), internalGridWidth - Math.abs(candidate.x - px));
                const dy = Math.min(Math.abs(candidate.y - py), internalGridHeight - Math.abs(candidate.y - py));
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < relaxedMinDistance) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose && !isTurmitePresent(candidate.x, candidate.y)) {
                positions.push({ x: candidate.x, y: candidate.y });
                usedPositions.add(`${candidate.x},${candidate.y}`);
            }
        }
    }
    
    console.log(`Found ${positions.length} starting positions for turmites`);
    return positions;
}

/**
 * Detects edges in the grid based on color differences between adjacent cells
 * @returns {Array<{x: number, y: number, score: number}>} Array of edge points with scores
 */
function detectEdges() {
    const edgePoints = [];
    const threshold = 1; // Minimum difference to consider an edge
    
    // Skip edge detection if grid is not initialized
    if (!grid || internalGridWidth <= 2 || internalGridHeight <= 2) {
        return edgePoints;
    }
    
    for (let y = 1; y < internalGridHeight - 1; y++) {
        for (let x = 1; x < internalGridWidth - 1; x++) {
            const centerState = getTileStateFromCell(getCellState(x, y));
            
            // Check neighboring cells (4-directional)
            const neighbors = [
                getTileStateFromCell(getCellState(x+1, y)),
                getTileStateFromCell(getCellState(x-1, y)),
                getTileStateFromCell(getCellState(x, y+1)),
                getTileStateFromCell(getCellState(x, y-1))
            ];
            
            // Calculate edge score based on differences with neighbors
            let edgeScore = 0;
            for (const neighborState of neighbors) {
                if (neighborState !== centerState) {
                    edgeScore += 1;
                }
            }
            
            // Only consider points with enough edge strength
            if (edgeScore >= threshold) {
                // Calculate density to avoid clustering too many turmites in one area
                // Look at a slightly larger neighborhood
                let neighborhoodDensity = 0;
                const checkRadius = 5;
                const maxDensity = checkRadius * 8; // Max theoretical number of different neighbors
                
                // Check a larger neighborhood for variety
                for (let ny = Math.max(0, y - checkRadius); ny <= Math.min(internalGridHeight - 1, y + checkRadius); ny++) {
                    for (let nx = Math.max(0, x - checkRadius); nx <= Math.min(internalGridWidth - 1, x + checkRadius); nx++) {
                        if (nx === x && ny === y) continue;
                        
                        if (getTileStateFromCell(getCellState(nx, ny)) !== centerState) {
                            neighborhoodDensity++;
                        }
                    }
                }
                
                // Higher score for points with higher edge strength and neighborhood diversity
                const finalScore = (edgeScore / 4) * 0.6 + (neighborhoodDensity / maxDensity) * 0.4;
                
                edgePoints.push({
                    x, 
                    y,
                    score: finalScore
                });
            }
        }
    }
    
    // Sort by score, highest first
    edgePoints.sort((a, b) => b.score - a.score);
    
    return edgePoints;
}

/** Initializes or resets the grid and turmite state. */
export function initializeGrid(patternName, width, height, placeTurmite = true) {
    console.log(`Initializing grid (${width}x${height}) with pattern: ${patternName}, Place Turmite: ${placeTurmite}`);
    if (width === undefined || height === undefined || width <= 0 || height <= 0) {
         console.error(`Invalid dimensions for initializeGrid: ${width}x${height}`);
         width = 1; height = 1;
         console.warn("Falling back to 1x1 grid due to invalid dimensions.");
    }

    internalGridWidth = width;
    internalGridHeight = height;
    grid = new Array(internalGridWidth * internalGridHeight);
    dirtyCells.clear();
    turmites = []; // Reset turmites array

    // Apply pattern
    console.log("Applying pattern:", patternName);
    if (grid) {
        // Initialize grid with pattern
        if (patternName !== null) {
            for (let y = 0; y < internalGridHeight; y++) {
                for (let x = 0; x < internalGridWidth; x++) {
                    let tileState = STATE_WHITE; // Default empty

                    switch (patternName) {
                        case 'square':
                            const size = 5;
                            const startX = Math.max(0, Math.floor(midX - size / 2));
                            const startY = Math.max(0, Math.floor(midY - size / 2));
                            if (x >= startX && x < Math.min(internalGridWidth, startX + size) &&
                                y >= startY && y < Math.min(internalGridHeight, startY + size)) {
                                tileState = STATE_BLACK;
                            }
                            break;
                        case 'random':
                            if (Math.random() < 0.1) { tileState = STATE_BLACK; }
                            else if (Math.random() < 0.05) { tileState = STATE_GRAY; }
                            break;
                        case 'cross':
                            const armLength = 7;
                            if (x >= Math.max(0, midX - armLength) && x <= Math.min(internalGridWidth - 1, midX + armLength) &&
                                (y >= 0 && y < internalGridHeight)) {
                                tileState = STATE_BLACK;
                            }
                            if (y >= Math.max(0, midY - armLength) && y <= Math.min(internalGridHeight - 1, midY + armLength) &&
                                (x >= 0 && x < internalGridWidth)) {
                                tileState = STATE_BLACK;
                            }
                            break;
                        case 'circle':
                            const radius = 10;
                            const radiusSq = radius * radius;
                            const distSq = (x - midX) * (x - midX) + (y - midY) * (y - midY);
                            if (distSq <= radiusSq) {
                                tileState = STATE_BLACK;
                            }
                            break;
                        case 'horizontal_line':
                            if (y >= 0 && y < internalGridHeight) {
                                tileState = STATE_BLACK;
                            }
                            break;
                        case 'axons':
                            // Initialize two dots with bit 0 on and mask set
                            if ((x === Math.floor(width/2) - 1 && y === Math.floor(height/2)) ||
                                (x === Math.floor(width/2) + 1 && y === Math.floor(height/2))) {
                                tileState = MASK_AXONS_MASK | MASK_AXONS_STATE; // Set mask and state bit
                            }
                            break;
                    }
                    grid[y * internalGridWidth + x] = encodeCellState(false, 0, tileState);
                }
            }
        }
    }

    if (placeTurmite) {
        const numTurmites = PARAMS.numTurmites;
        let startPositions;
        
        if (patternName === null) {
            // For images, use edge detection to find multiple starting positions
            startPositions = findBestStartPositions(numTurmites);
        } else {
            // For patterns, use grid-based positioning
            startPositions = [];
            const gridSize = Math.ceil(Math.sqrt(numTurmites));
            const cellWidth = Math.floor(internalGridWidth / (gridSize + 1));
            const cellHeight = Math.floor(internalGridHeight / (gridSize + 1));
            const randomOffset = Math.min(cellWidth, cellHeight) / 4;
            
            for (let i = 0; i < numTurmites; i++) {
                const gridX = (i % gridSize) + 1;
                const gridY = Math.floor(i / gridSize) + 1;
                const offsetX = Math.floor((Math.random() - 0.5) * randomOffset);
                const offsetY = Math.floor((Math.random() - 0.5) * randomOffset);
                const x = Math.floor(gridX * cellWidth + offsetX);
                const y = Math.floor(gridY * cellHeight + offsetY);
                startPositions.push({
                    x: (x + internalGridWidth) % internalGridWidth,
                    y: (y + internalGridHeight) % internalGridHeight
                });
            }
        }
        
        // Place turmites at their starting positions
        for (let i = 0; i < startPositions.length; i++) {
            const pos = startPositions[i];
            const dir = Math.floor(Math.random() * NUM_DIRECTIONS);
            
            turmites.push({
                x: pos.x,
                y: pos.y,
                dir: dir
            });
            
            let index = getIndex(pos.x, pos.y);
            let currentTileState = getTileStateFromCell(grid[index]);
            grid[index] = encodeCellState(true, dir, currentTileState);
            dirtyCells.add(index);
            
            console.log(`Placed turmite ${i} at: (${pos.x}, ${pos.y}), Dir: ${dir}`);
        }
    }

    steps = 0;
    tilesModified = 0;
    needsFullRedraw = true;
    dirtyCells.clear();
}

/** Resets the simulation with the current pattern after a resize */
export function resetSimulationForResize(patternName, newWidth, newHeight) {
    console.log(`Resetting simulation for resize: ${newWidth}x${newHeight}`);
    initializeGrid(patternName, newWidth, newHeight, true); // Always place turmite on simple resize
}

/** Explicitly sets the turmite's position and state */
export function setTurmitePosition(x, y, dir) {
    if (grid && x >= 0 && x < internalGridWidth && y >= 0 && y < internalGridHeight) {
        // Ensure previous turmite location is cleared if moving
        if (turmites.length > 0) {
            for (let i = 0; i < turmites.length; i++) {
                if (turmites[i].x === x && turmites[i].y === y) {
                    let oldIndex = getIndex(x, y);
                    if (isMitePresent(grid[oldIndex])) {
                        let oldTileState = getTileStateFromCell(grid[oldIndex]);
                        grid[oldIndex] = encodeCellState(false, 0, oldTileState);
                        dirtyCells.add(oldIndex);
                    }
                    turmites.splice(i, 1);
                    break;
                }
            }
        }

        // Set new position
        turmites.push({ x, y, dir });

        // Update grid cell at new position
        let index = getIndex(x, y);
        let currentTileState = getTileStateFromCell(grid[index]); // Get state before overwriting
        grid[index] = encodeCellState(true, dir, currentTileState);
        dirtyCells.add(index);
        console.log(`Turmite explicitly set to: (${x}, ${y}), Dir: ${dir}`);
    } else {
        console.error(`Invalid position for setTurmitePosition: (${x}, ${y}) on ${internalGridWidth}x${internalGridHeight} grid.`);
    }
}

/** Executes one step of the Turmite simulation. */
export function updateSimulation() {
    if (!grid || turmites.length === 0) return; // Ensure grid and turmites exist
    
    // Update spatial map once per frame for optimized collision detection
    updateSpatialMap();
    
    // Track collisions in this step to avoid logging duplicates
    const collisionsThisStep = new Set();
    let collisionCount = 0;
    const maxCollisionLogs = 5; // Limit collision logs per frame
    
    // Each turmite takes a single step per simulation update
    for (let i = 0; i < turmites.length; i++) {
        const turmite = turmites[i];
        
        // 1. Get current turmite info
        const miteInfo = getTurmiteInfo(turmite.x, turmite.y);
        if (!miteInfo) {
            // If turmite info is invalid, remove the turmite
            turmites.splice(i, 1);
            i--; // Adjust index since we removed an element
            continue; // Skip to next turmite
        }

        const { x: currentX, y: currentY, dir: currentDir, tileState: currentTileState } = miteInfo;

        // 2. Apply rule
        const { turnDirection, nextTileState } = applyRule(currentTileState, currentX, currentY);
        
        // Update turmite direction
        let newDirection = (currentDir + turnDirection + NUM_DIRECTIONS) % NUM_DIRECTIONS;

        // 3. Check for tile modification
        if (currentTileState !== nextTileState) {
            tilesModified++;
        }

        // 4. Calculate next potential position using wider step size (1-10 cells per step)
        let move = DIRECTIONS[newDirection];
        let moveDistance = Math.max(1, Math.min(10, PARAMS.stepsPerTurmite));
        
        // Calculate final position after the longer move
        let nextX = (currentX + move.dx * moveDistance + internalGridWidth) % internalGridWidth;
        let nextY = (currentY + move.dy * moveDistance + internalGridHeight) % internalGridHeight;
        
        // 5. Use spatial mapping for faster collision detection
        const nextKey = getSpatialKey(nextX, nextY);
        if (spatialMap.has(nextKey)) {
            // Collision detected - handle it
            if (collisionCount < maxCollisionLogs) {
                console.debug(`Collision detected at: ${nextX} ${nextY} - Reversing.`);
            }
            handleCollision(currentX, currentY, i, collisionsThisStep);
            collisionCount++;
            continue; // Skip to next turmite
        }

        // 6. Update grid cells (no collision)
        // First, update the starting position
        let leaveIndex = getIndex(currentX, currentY);
        let newStateForLeaveCell = encodeCellState(false, 0, nextTileState);
        grid[leaveIndex] = newStateForLeaveCell;
        dirtyCells.add(leaveIndex);
        
        // Then, draw a continuous line of tiles from the starting position to ending position (Bresenham's algorithm)
        // This ensures we leave a continuous trail even when taking large steps
        const cells = getLineOfCells(currentX, currentY, nextX, nextY);
        for (const cell of cells) {
            // Skip the first and last cells as they're handled separately
            if ((cell.x === currentX && cell.y === currentY) || (cell.x === nextX && cell.y === nextY)) {
                continue;
            }
            
            // Set the tile state for each intermediate cell
            const cellIndex = getIndex(cell.x, cell.y);
            let cellTileState = getTileStateFromCell(grid[cellIndex]);
            // Only update if cell doesn't have a turmite on it
            if (!isMitePresent(grid[cellIndex])) {
                grid[cellIndex] = encodeCellState(false, 0, nextTileState);
                dirtyCells.add(cellIndex);
            }
        }
        
        // Set the turmite at the new position
        let nextIndex = getIndex(nextX, nextY);
        let nextCellExistingTileState = getTileStateFromCell(grid[nextIndex]);
        let newStateForNext = encodeCellState(true, newDirection, nextCellExistingTileState);
        grid[nextIndex] = newStateForNext;
        dirtyCells.add(nextIndex);
        
        // 7. Update turmite position and spatial map
        spatialMap.delete(getSpatialKey(currentX, currentY)); // Remove from old position
        turmite.x = nextX;
        turmite.y = nextY;
        turmite.dir = newDirection;
        spatialMap.set(getSpatialKey(nextX, nextY), i); // Add to new position
    }
    
    steps++;
}

/**
 * Get a line of cells between two points using Bresenham's line algorithm
 * @param {number} x0 - Starting X coordinate
 * @param {number} y0 - Starting Y coordinate
 * @param {number} x1 - Ending X coordinate
 * @param {number} y1 - Ending Y coordinate
 * @returns {Array<{x: number, y: number}>} Array of cell coordinates along the line
 */
function getLineOfCells(x0, y0, x1, y1) {
    // Handle wrapping for toroidal grid
    // Calculate the shortest path, considering grid wrapping
    let dx = x1 - x0;
    let dy = y1 - y0;
    
    // Check if wrapping would create a shorter path in X direction
    if (Math.abs(dx) > internalGridWidth / 2) {
        if (dx > 0) {
            dx = dx - internalGridWidth;
        } else {
            dx = dx + internalGridWidth;
        }
    }
    
    // Check if wrapping would create a shorter path in Y direction
    if (Math.abs(dy) > internalGridHeight / 2) {
        if (dy > 0) {
            dy = dy - internalGridHeight;
        } else {
            dy = dy + internalGridHeight;
        }
    }
    
    // Target point after considering wrapping
    const targetX = (x0 + dx + internalGridWidth) % internalGridWidth;
    const targetY = (y0 + dy + internalGridHeight) % internalGridHeight;
    
    // Apply classic Bresenham's algorithm
    const cells = [];
    
    // Add start point
    cells.push({ x: x0, y: y0 });
    
    let x = x0;
    let y = y0;
    
    // Calculate absolute values for indices
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    // Determine step direction for x and y
    const sx = dx < 0 ? -1 : 1;
    const sy = dy < 0 ? -1 : 1;
    
    // Determine the decision parameter
    let err = absDx - absDy;
    
    // Continue until we reach the target point
    while (x !== targetX || y !== targetY) {
        // Calculate the error for the next step
        const e2 = 2 * err;
        
        // Update x if needed
        if (e2 > -absDy) {
            err -= absDy;
            x = (x + sx + internalGridWidth) % internalGridWidth;
        }
        
        // Update y if needed
        if (e2 < absDx) {
            err += absDx;
            y = (y + sy + internalGridHeight) % internalGridHeight;
        }
        
        // Add the point to our line
        cells.push({ x, y });
        
        // Safety check to prevent infinite loops
        if (cells.length > internalGridWidth + internalGridHeight) {
            console.error("Path finding error in Bresenham's algorithm, breaking to prevent infinite loop");
            break;
        }
    }
    
    return cells;
}

// Update getTurmiteInfo to work with specific coordinates
function getTurmiteInfo(x, y) {
    let state = getCellState(x, y);
    if (!isMitePresent(state)) {
        console.error("Turmite state inconsistency! Expected turmite at:", x, y);
        return null;
    }
    let dir = getMiteDirection(state);
    let tileState = getTileStateFromCell(state);
    return { x, y, state, dir, tileState };
}

// --- Internal Simulation Helpers --- //

function applyRule(currentTileState, currentX, currentY) {
    let ruleAction = activeRule[currentTileState];
    // If rule lacks explicit entry for this tile state, try cyclic mapping
    if (!ruleAction) {
        const definedStates = Object.keys(activeRule).map(Number);
        if (definedStates.length > 0) {
            const fallbackKey = currentTileState % definedStates.length;
            ruleAction = activeRule[fallbackKey];
        }
    }
    let nextTileState, turnDirection;
    if (ruleAction) {
        if (PARAMS.rule === 'random_walk') {
            turnDirection = Math.floor(Math.random() * 3) - 1;
            nextTileState = ruleAction.nextTileState;
        } else {
            turnDirection = ruleAction.turn;
            // Get neighbor states
            const neighbors = {
                left: getCellTileState((currentX - 1 + internalGridWidth) % internalGridWidth, currentY),
                right: getCellTileState((currentX + 1) % internalGridWidth, currentY),
                up: getCellTileState(currentX, (currentY - 1 + internalGridHeight) % internalGridHeight),
                down: getCellTileState(currentX, (currentY + 1) % internalGridHeight),
                upLeft: getCellTileState((currentX - 1 + internalGridWidth) % internalGridWidth, (currentY - 1 + internalGridHeight) % internalGridHeight),
                upRight: getCellTileState((currentX + 1) % internalGridWidth, (currentY - 1 + internalGridHeight) % internalGridHeight),
                downLeft: getCellTileState((currentX - 1 + internalGridWidth) % internalGridWidth, (currentY + 1) % internalGridHeight),
                downRight: getCellTileState((currentX + 1) % internalGridWidth, (currentY + 1) % internalGridHeight)
            };
            nextTileState = typeof ruleAction.nextTileState === 'function'
                ? ruleAction.nextTileState(currentTileState, currentX, currentY, neighbors)
                : ruleAction.nextTileState;
        }
    } else {
        console.warn(`Rule "${PARAMS.rule}" has no action for state ${currentTileState}. Defaulting.`);
        turnDirection = 1;
        nextTileState = (currentTileState + 1) % NUM_TILE_STATES;
    }
    return { turnDirection, nextTileState };
}

function updateGridCellsForMove(currentX, currentY, nextX, nextY, newDirection, nextTileState, previousDirection) {
    const step = PARAMS.turmiteStepSize;

    // Update the block of cells the turmite is LEAVING
    for (let j = 0; j < step; j++) {
        for (let i = 0; i < step; i++) {
            let leaveX = (currentX + i + internalGridWidth) % internalGridWidth;
            let leaveY = (currentY + j + internalGridHeight) % internalGridHeight;
            let leaveIndex = getIndex(leaveX, leaveY);

            // Don't erase the turmite if it's landing on a cell it just vacated (step=1 case)
            if (leaveX === nextX && leaveY === nextY) continue;

            // Only clear the turmite if *we* are still the one on that cell. If another turmite already stepped onto
            // this location earlier in the same tick, its direction will differ from our previousDirection.
            const existingState = grid[leaveIndex];
            if (isMitePresent(existingState)) {
                const dirInCell = getMiteDirection(existingState);
                if (dirInCell !== previousDirection) {
                    // Another turmite occupies the cell now; skip clearing
                    continue;
                }
            }

            // Encode the new tile state, ensuring no turmite presence bit
            let newStateForLeaveCell = encodeCellState(false, 0, nextTileState);

            // Update only if state actually changes
            if (existingState !== newStateForLeaveCell) {
                grid[leaveIndex] = newStateForLeaveCell;
                dirtyCells.add(leaveIndex);
            }
        }
    }

    // Update the single cell the turmite is ARRIVING at (top-left of the block)
    let nextIndex = getIndex(nextX, nextY);
    let nextCellExistingTileState = getTileStateFromCell(grid[nextIndex]); // Get state before overwriting
    let newStateForNext = encodeCellState(true, newDirection, nextCellExistingTileState);
    if (grid[nextIndex] !== newStateForNext) {
        grid[nextIndex] = newStateForNext;
        dirtyCells.add(nextIndex);
    }
}

/**
 * Handles collision between turmites efficiently
 * @param {number} x - X coordinate of collision
 * @param {number} y - Y coordinate of collision
 * @param {number} turmiteIndex - Index of current turmite
 * @param {Set} collisionsThisStep - Set to track collisions this step
 * @returns {boolean} Whether collision was handled
 */
function handleCollision(x, y, turmiteIndex, collisionsThisStep) {
    const collisionKey = `${x},${y}`;
    
    // Track this collision
    collisionsThisStep.add(collisionKey);
    
    // Reverse the direction of the current turmite
    const turmite = turmites[turmiteIndex];
    const newDir = (turmite.dir + Math.floor(NUM_DIRECTIONS / 2)) % NUM_DIRECTIONS;
    turmite.dir = newDir;
    
    // Update the grid cell to show new direction
    const currentIndex = getIndex(turmite.x, turmite.y);
    const currentTileState = getTileStateFromCell(grid[currentIndex]);
    const newStateForCell = encodeCellState(true, newDir, currentTileState);
    
    if (grid[currentIndex] !== newStateForCell) {
        grid[currentIndex] = newStateForCell;
        dirtyCells.add(currentIndex);
    }
    
    return true;
}

// --- Grid/State Utility Helpers --- //

export function getIndex(x, y) {
  x = (x + internalGridWidth) % internalGridWidth;
  y = (y + internalGridHeight) % internalGridHeight;
  return y * internalGridWidth + x;
}

export function getCellState(x, y) {
  return grid[getIndex(x, y)];
}

export function setCellState(x, y, state) {
  let index = getIndex(x, y);
  grid[index] = state;
}

export function getCellTileState(x, y) {
  return getTileStateFromCell(getCellState(x, y));
}

export function isTurmitePresent(x, y) {
    return isMitePresent(getCellState(x, y));
}

export function isMitePresent(state) {
  return (state & MASK_TURMITE_PRESENCE) === MITE_PRESENT_VAL;
}

export function getMiteDirection(state) {
  return (state & MASK_DIRECTION) >> SHIFT_DIRECTION;
}

export function getTileStateFromCell(state) {
  return state & MASK_TILE_STATE;
}

export function encodeCellState(isPresent, direction, tileState) {
  let state = 0;
  if (isPresent) {
    state |= MITE_PRESENT_VAL;
    state |= (direction << SHIFT_DIRECTION) & MASK_DIRECTION;
  }
  state |= tileState & MASK_TILE_STATE;
  return state;
}

export function setDynamicCellSize(newSize) {
    dynamicCellSize = Math.max(1, newSize); // Ensure at least 1
    needsFullRedraw = true; // Changing cell size requires full redraw
}

export function decodeCellState(encodedState) {
    // Implementation needed
}

export function updateGridDimensions() {
    // Implementation needed
}

// --- Turmite Management Functions ---
export function addTurmite(x, y, dir = Math.floor(Math.random() * NUM_DIRECTIONS)) {
    if (!grid || x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) {
        console.error(`Invalid position for addTurmite: (${x}, ${y})`);
        return false;
    }

    // Check if position is already occupied
    if (isTurmitePresent(x, y)) {
        console.warn(`Position (${x}, ${y}) already has a turmite`);
        return false;
    }

    // Add new turmite
    turmites.push({ x, y, dir });
    
    // Update grid cell
    let index = getIndex(x, y);
    let currentTileState = getTileStateFromCell(grid[index]);
    grid[index] = encodeCellState(true, dir, currentTileState);
    dirtyCells.add(index);
    
    return true;
}

export function removeTurmite(x, y) {
    if (!grid || x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) {
        console.error(`Invalid position for removeTurmite: (${x}, ${y})`);
        return false;
    }

    // Find and remove turmite at position
    for (let i = 0; i < turmites.length; i++) {
        if (turmites[i].x === x && turmites[i].y === y) {
            // Clear grid cell
            let index = getIndex(x, y);
            let oldTileState = getTileStateFromCell(grid[index]);
            grid[index] = encodeCellState(false, 0, oldTileState);
            dirtyCells.add(index);
            
            // Remove from array
            turmites.splice(i, 1);
            return true;
        }
    }
    
    return false;
}

export function getTurmiteCount() {
    return turmites.length;
}

export function getTurmitePositions() {
    return turmites.map(t => ({ x: t.x, y: t.y, dir: t.dir }));
}

// Add function to update number of turmites
export function updateTurmiteCount(newCount) {
    if (newCount === turmites.length) return;
    
    // If increasing turmites
    if (newCount > turmites.length) {
        const numToAdd = newCount - turmites.length;
        // Get all new positions at once
        const positions = findBestStartPositions(numToAdd);
        
        // Add each new turmite at a unique position
        for (let i = 0; i < positions.length && turmites.length < newCount; i++) {
            const pos = positions[i];
            // Skip if position already has a turmite
            if (isTurmitePresent(pos.x, pos.y)) continue;
            
            const dir = Math.floor(Math.random() * NUM_DIRECTIONS);
            
            // Add new turmite
            turmites.push({
                x: pos.x,
                y: pos.y,
                dir: dir
            });
            
            // Update grid
            let index = getIndex(pos.x, pos.y);
            let currentTileState = getTileStateFromCell(grid[index]);
            grid[index] = encodeCellState(true, dir, currentTileState);
            dirtyCells.add(index);
        }

        // If we couldn't add all requested turmites, log a warning
        if (turmites.length < newCount) {
            console.warn(`Could only add ${turmites.length - (newCount - numToAdd)} turmites out of ${numToAdd} requested`);
        }
    }
    
    // If decreasing turmites
    while (turmites.length > newCount) {
        const turmite = turmites.pop();
        // Clear the cell where the turmite was
        let index = getIndex(turmite.x, turmite.y);
        let currentTileState = getTileStateFromCell(grid[index]);
        grid[index] = encodeCellState(false, 0, currentTileState);
        dirtyCells.add(index);
    }
    
    // Always update PARAMS to reflect actual count
    PARAMS.numTurmites = turmites.length;
    
    // Force UI refresh if we have a pane object
    if (window.pane) {
        window.pane.refresh();
    }
    
    needsFullRedraw = true;
}

/** Set the image loaded state */
export function setImageLoadedState(state) {
    isImageLoaded = state;
}

class Simulation {
    constructor(width, height) {
        this.grid = new Grid(width, height);
        this.turmites = [];
        this.rules = {
            states: 1,
            colors: 2,
            transitions: [
                { state: 0, color: 0, nextState: 0, nextColor: 1, turn: 1 },
                { state: 0, color: 1, nextState: 0, nextColor: 0, turn: 3 }
            ]
        };
    }

    addTurmite(x, y, direction = 0) {
        const turmite = new Turmite(x, y, direction);
        this.turmites.push(turmite);
        return turmite;
    }

    step() {
        for (const turmite of this.turmites) {
            turmite.move(this.grid, this.rules);
        }
    }

    clear() {
        this.grid.clear();
        this.turmites = [];
    }

    resize(width, height) {
        this.grid.resize(width, height);
        // Remove turmites that are now outside the grid
        this.turmites = this.turmites.filter(turmite => {
            const { x, y } = turmite.getPosition();
            return x >= 0 && x < width && y >= 0 && y < height;
        });
    }
}

export default Simulation;

// Remove getNeighborhood and related functions
function completeRuleTable(ruleObj) {
    const completed = {};
    const explicitKeys = Object.keys(ruleObj).map(Number);
    if (explicitKeys.length === 0) return {};
    explicitKeys.forEach(k => {
        const act = { ...ruleObj[k] };
        if (typeof act.nextTileState === 'number') {
            act.nextTileState = (act.nextTileState + NUM_TILE_STATES) % NUM_TILE_STATES;
        }
        completed[k] = act;
    });
    const baseKeys = explicitKeys.sort((a,b)=>a-b);
    const baseCount = baseKeys.length;
    for (let s = 0; s < NUM_TILE_STATES; s++) {
        if (!(s in completed)) {
            const srcKey = baseKeys[s % baseCount];
            completed[s] = { ...completed[srcKey] }; // shallow copy ok
        }
    }
    return completed;
}

// -----------------------------------------------------------
// Dynamic color-cycle rule generator to reduce boilerplate
function createColorCycleRule(numStates, alternating = true) {
    const rule = {};
    for (let s = 0; s < numStates; s++) {
        const turnVal = alternating ? (s % 2 === 0 ? 1 : -1) : 1;
        rule[s] = {
            turn: turnVal,
            nextTileState: (s + 1) % numStates
        };
    }
    return rule;
}

// Replace rainbow8 and cycle16 with dynamically generated versions
rules.rainbow8 = createColorCycleRule(8, true);
rules.cycle16  = createColorCycleRule(16, true);

// If currently active rule is one of these, update the reference
if (PARAMS.rule === 'rainbow8' || PARAMS.rule === 'cycle16') {
    activeRule = rules[PARAMS.rule];
}
// ... existing code ...