// simulation.js

import {
    PARAMS,
    BASE_CELL_SIZE, // Needed for pattern generation?
    MASK_TURMITE_PRESENCE, MITE_PRESENT_VAL, MASK_DIRECTION, SHIFT_DIRECTION, MASK_TILE_STATE,
    DIRECTIONS, NUM_DIRECTIONS,
    STATE_WHITE, STATE_BLACK, STATE_GRAY, STATE_DARK_GRAY, NUM_TILE_STATES,
    MASK_AXONS_STATE, MASK_AXONS_PAST, MASK_AXONS_TIME, MASK_AXONS_MASK, AXONS_WOLF_CODE, AXONS_MAX_TIME
} from './constants.js';

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

// --- Custom Rules Parameters ---
export const customRuleParams = {
    state0Turn: 1,
    state0Next: STATE_BLACK,
    state1Turn: -1,
    state1Next: STATE_WHITE,
    state2Turn: 1,
    state2Next: STATE_DARK_GRAY,
    state3Turn: -1,
    state3Next: STATE_GRAY
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
        state3Next: STATE_GRAY
    },
    'spiral': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_WHITE,
        state3Turn: 1,
        state3Next: STATE_WHITE
    },
    'chaos': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -2,
        state1Next: STATE_GRAY,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_WHITE
    },
    'symmetrical': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_BLACK,
        state3Turn: -1,
        state3Next: STATE_WHITE
    },
    'filling': {
        state0Turn: 0,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_WHITE,
        state3Turn: 0,
        state3Next: STATE_DARK_GRAY
    },
    'crystal': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: 0,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: 2,
        state3Next: STATE_WHITE
    },
    'highway': {
        state0Turn: 0,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_WHITE,
        state3Turn: 0,
        state3Next: STATE_DARK_GRAY
    },
    'maze': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_GRAY,
        state2Turn: 0,
        state2Next: STATE_WHITE,
        state3Turn: 1,
        state3Next: STATE_DARK_GRAY
    },
    'mandala': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -1,
        state1Next: STATE_GRAY,
        state2Turn: 1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -2,
        state3Next: STATE_WHITE
    },
    'snowflake': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: -2,
        state1Next: STATE_WHITE,
        state2Turn: 1,
        state2Next: STATE_GRAY,
        state3Turn: -1,
        state3Next: STATE_DARK_GRAY
    },
    'celtic_knot': {
        state0Turn: 1,
        state0Next: STATE_BLACK,
        state1Turn: 2,
        state1Next: STATE_GRAY,
        state2Turn: -2,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -1,
        state3Next: STATE_WHITE
    },
    'arabesque': {
        state0Turn: 2,
        state0Next: STATE_BLACK,
        state1Turn: 1,
        state1Next: STATE_GRAY,
        state2Turn: -1,
        state2Next: STATE_DARK_GRAY,
        state3Turn: -2,
        state3Next: STATE_WHITE
    },
    'fractal': {
        state0Turn: 2,
        state0Next: STATE_DARK_GRAY,
        state1Turn: -2,
        state1Next: STATE_BLACK,
        state2Turn: 1,
        state2Next: STATE_WHITE,
        state3Turn: -1,
        state3Next: STATE_GRAY
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
        3: { turn: -1, nextTileState: STATE_GRAY }
    },
    'complex_pattern': { // Placeholder
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: 0, nextTileState: STATE_GRAY },
        2: { turn: -1, nextTileState: STATE_DARK_GRAY },
        3: { turn: 1, nextTileState: STATE_WHITE }
    },
    'spiral': { // Simple 2-state
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: -1, nextTileState: STATE_WHITE },
        2: { turn: 1, nextTileState: STATE_WHITE },
        3: { turn: 1, nextTileState: STATE_WHITE }
    },
    'random_walk': {
        0: { turn: 0, nextTileState: STATE_BLACK }, // Turn handled in applyRule
        1: { turn: 0, nextTileState: STATE_GRAY },
        2: { turn: 0, nextTileState: STATE_DARK_GRAY },
        3: { turn: 0, nextTileState: STATE_WHITE }
    },
    'highway': {
        0: { turn: 0, nextTileState: STATE_BLACK },
        1: { turn: 1, nextTileState: STATE_GRAY },
        2: { turn: -1, nextTileState: STATE_WHITE },
        3: { turn: 0, nextTileState: STATE_DARK_GRAY }
    },
    'zigzag': {
        0: { turn: 1, nextTileState: STATE_BLACK },
        1: { turn: -1, nextTileState: STATE_WHITE },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_GRAY }
    },
    'art_drawer': {
        0: { turn: 2, nextTileState: STATE_BLACK },
        1: { turn: -2, nextTileState: STATE_GRAY },
        2: { turn: 1, nextTileState: STATE_DARK_GRAY },
        3: { turn: -1, nextTileState: STATE_WHITE }
    },
    'custom': {
        0: { turn: customRuleParams.state0Turn, nextTileState: customRuleParams.state0Next },
        1: { turn: customRuleParams.state1Turn, nextTileState: customRuleParams.state1Next },
        2: { turn: customRuleParams.state2Turn, nextTileState: customRuleParams.state2Next },
        3: { turn: customRuleParams.state3Turn, nextTileState: customRuleParams.state3Next }
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
        3: { turn: customRuleParams.state3Turn, nextTileState: customRuleParams.state3Next }
    };
    
    // If custom rule is active, update the active rule reference
    if (PARAMS.rule === 'custom') {
        activeRule = rules.custom;
    }
}

/** Helper function to detect if a cell is on an edge */
function isEdgeCell(x, y) {
    if (x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) return false;
    
    const currentState = getCellTileState(x, y);
    let edgeStrength = 0;
    let neighborCount = 0;
    let maxContrast = 0;
    
    // First, check if we're on a non-empty cell
    if (currentState === STATE_WHITE) return false;
    
    // Check horizontal and vertical neighbors first (more weight)
    const directions = [
        {dx: -1, dy: 0},  // left
        {dx: 1, dy: 0},   // right
        {dx: 0, dy: -1},  // up
        {dx: 0, dy: 1},   // down
        {dx: -1, dy: -1}, // diagonal
        {dx: 1, dy: -1},  // diagonal
        {dx: -1, dy: 1},  // diagonal
        {dx: 1, dy: 1}    // diagonal
    ];
    
    for (const dir of directions) {
        const nx = (x + dir.dx + internalGridWidth) % internalGridWidth;
        const ny = (y + dir.dy + internalGridHeight) % internalGridHeight;
        const neighborState = getCellTileState(nx, ny);
        
        // Calculate contrast
        const contrast = Math.abs(currentState - neighborState);
        maxContrast = Math.max(maxContrast, contrast);
        
        // Weight orthogonal neighbors more heavily
        const weight = (dir.dx === 0 || dir.dy === 0) ? 2 : 1;
        
        if (contrast > 0) {
            edgeStrength += contrast * weight;
            neighborCount++;
        }
    }
    
    // Calculate average edge strength, weighted by neighbor count
    const avgEdgeStrength = edgeStrength / (neighborCount || 1);
    
    // Return true if we have strong edges or multiple moderate edges
    return maxContrast > 1 || (neighborCount >= 3 && avgEdgeStrength > 0.75);
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
    
    // Create a grid of potential starting positions
    const gridSize = Math.ceil(Math.sqrt(numTurmites * 2)); // Multiply by 2 to have more options
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
    
    // Update each turmite
    for (let i = 0; i < turmites.length; i++) {
        const turmite = turmites[i];
        
        // 1. Get current turmite info
        const miteInfo = getTurmiteInfo(turmite.x, turmite.y);
        if (!miteInfo) {
            // If turmite info is invalid, remove the turmite
            turmites.splice(i, 1);
            i--; // Adjust index since we removed an element
            continue;
        }
        
        const { x: currentX, y: currentY, dir: currentDir, tileState: currentTileState } = miteInfo;

        // 2. Apply rule
        const { turnDirection, nextTileState } = applyRule(currentTileState, currentX, currentY);
        let newDirection = (currentDir + turnDirection + NUM_DIRECTIONS) % NUM_DIRECTIONS;

        // 3. Check for tile modification
        if (currentTileState !== nextTileState) {
            tilesModified++;
        }

        // 4. Calculate next potential position using step size
        let move = DIRECTIONS[newDirection];
        let step = PARAMS.turmiteStepSize;
        let nextX = (currentX + move.dx * step + internalGridWidth) % internalGridWidth;
        let nextY = (currentY + move.dy * step + internalGridHeight) % internalGridHeight;

        // 5. Handle Collision
        const collisionResultDir = handleCollision(nextX, nextY, currentX, currentY, newDirection, nextTileState);
        if (collisionResultDir !== null) {
            turmite.dir = collisionResultDir;
            continue;
        }

        // 6. Update grid cells (no collision)
        updateGridCellsForMove(currentX, currentY, nextX, nextY, newDirection, nextTileState);

        // 7. Update turmite position
        turmite.x = nextX;
        turmite.y = nextY;
        turmite.dir = newDirection;
    }
    
    steps++;
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
                ? ruleAction.nextTileState(currentTileState, neighbors)
                : ruleAction.nextTileState;
        }
    } else {
        console.warn(`Rule "${PARAMS.rule}" has no action for state ${currentTileState}. Defaulting.`);
        turnDirection = 1;
        nextTileState = (currentTileState + 1) % NUM_TILE_STATES;
    }
    return { turnDirection, nextTileState };
}

function handleCollision(nextX, nextY, currentX, currentY, currentDir, nextTileState) {
    let nextIndex = getIndex(nextX, nextY);
    if (isMitePresent(grid[nextIndex])) {
        console.warn("Collision detected at:", nextX, nextY, "- Reversing.");
        let newDir = (currentDir + Math.floor(NUM_DIRECTIONS / 2)) % NUM_DIRECTIONS;
        let currentIndex = getIndex(currentX, currentY);
        let newStateForCurrent = encodeCellState(true, newDir, nextTileState);
        if (grid[currentIndex] !== newStateForCurrent) {
             grid[currentIndex] = newStateForCurrent;
             dirtyCells.add(currentIndex);
        }
        return newDir;
    }
    return null;
}

function updateGridCellsForMove(currentX, currentY, nextX, nextY, newDirection, nextTileStateForCurrentCell) {
    const step = PARAMS.turmiteStepSize;

    // Update the block of cells the turmite is LEAVING
    for (let j = 0; j < step; j++) {
        for (let i = 0; i < step; i++) {
            let leaveX = (currentX + i + internalGridWidth) % internalGridWidth;
            let leaveY = (currentY + j + internalGridHeight) % internalGridHeight;
            let leaveIndex = getIndex(leaveX, leaveY);

            // Don't erase the turmite if it's landing on a cell it just vacated (step=1 case)
            if (leaveX === nextX && leaveY === nextY) continue;

            // Encode the new tile state, ensuring no turmite presence bit
            let newStateForLeaveCell = encodeCellState(false, 0, nextTileStateForCurrentCell);

            // Update only if state actually changes
            if (grid[leaveIndex] !== newStateForLeaveCell) {
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