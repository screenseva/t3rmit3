// simulation.js

import {
    PARAMS,
    BASE_CELL_SIZE, // Needed for pattern generation?
    MASK_TURMITE_PRESENCE, MITE_PRESENT_VAL, MASK_DIRECTION, SHIFT_DIRECTION, MASK_TILE_STATE,
    DIRECTIONS, NUM_DIRECTIONS,
    STATE_WHITE, STATE_BLACK, STATE_GRAY, STATE_DARK_GRAY, NUM_TILE_STATES
} from './constants.js';

// --- Simulation State Variables ---
export let grid;
export let turmiteX, turmiteY;
export let turmiteDir;
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
    }
};
export let activeRule = rules[PARAMS.rule];

// --- State Getters (allow other modules to read state safely) ---
export function getSimulationState() {
    return {
        grid,
        turmiteX,
        turmiteY,
        turmiteDir,
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

/** Find the best starting position for the turmite */
export function findBestStartPosition(midX, midY) {
    const maxRadius = Math.min(internalGridWidth, internalGridHeight) / 2.5;
    let bestX = midX;
    let bestY = midY;
    let bestScore = -1;
    let found = false;
    
    // First, try to find a good starting point near the center
    const centerRadius = maxRadius / 3;
    for (let r = 1; r < centerRadius && !found; r++) {
        const angleStep = Math.PI / (16 * Math.sqrt(r));
        for (let angle = 0; angle < Math.PI * 2; angle += angleStep) {
            const x = Math.floor(midX + r * Math.cos(angle));
            const y = Math.floor(midY + r * Math.sin(angle));
            
            if (x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) continue;
            
            if (isEdgeCell(x, y)) {
                const score = evaluatePosition(x, y, r, maxRadius);
                if (score > bestScore) {
                    bestScore = score;
                    bestX = x;
                    bestY = y;
                    if (score > 0.8) {
                        found = true;
                        break;
                    }
                }
            }
        }
    }
    
    // If we haven't found a good position near the center, search wider
    if (!found && bestScore < 0.6) {
        for (let r = centerRadius; r < maxRadius && !found; r++) {
            const angleStep = Math.PI / (8 * Math.sqrt(r));
            for (let angle = 0; angle < Math.PI * 2; angle += angleStep) {
                const x = Math.floor(midX + r * Math.cos(angle));
                const y = Math.floor(midY + r * Math.sin(angle));
                
                if (x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) continue;
                
                if (isEdgeCell(x, y)) {
                    const score = evaluatePosition(x, y, r, maxRadius);
                    if (score > bestScore) {
                        bestScore = score;
                        bestX = x;
                        bestY = y;
                        if (score > 0.7) {
                            found = true;
                            break;
                        }
                    }
                }
            }
        }
    }
    
    // If we still haven't found a good position, try to find any non-white cell near the center
    if (bestScore < 0) {
        for (let r = 1; r < maxRadius / 4; r++) {
            for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
                const x = Math.floor(midX + r * Math.cos(angle));
                const y = Math.floor(midY + r * Math.sin(angle));
                
                if (x < 0 || x >= internalGridWidth || y < 0 || y >= internalGridHeight) continue;
                
                const state = getCellTileState(x, y);
                if (state !== STATE_WHITE) {
                    bestX = x;
                    bestY = y;
                    bestScore = 0;
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
    }
    
    console.log(`Found starting position with score: ${bestScore.toFixed(3)} at (${bestX}, ${bestY})`);
    return { x: bestX, y: bestY };
}

/** Evaluate a potential starting position */
function evaluatePosition(x, y, r, maxRadius) {
    const currentState = getCellTileState(x, y);
    
    // Reject white cells immediately
    if (currentState === STATE_WHITE) return -1;
    
    // Calculate base scores
    const distanceScore = Math.pow(1 - (r / maxRadius), 2);
    let edgeScore = 0;
    let contrastScore = 0;
    let neighborDiversity = new Set();
    
    // Check surrounding cells in a larger area
    for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue;
            
            const nx = (x + dx + internalGridWidth) % internalGridWidth;
            const ny = (y + dy + internalGridHeight) % internalGridHeight;
            const neighborState = getCellTileState(nx, ny);
            
            // Add to diversity count
            neighborDiversity.add(neighborState);
            
            // Calculate contrast
            const contrast = Math.abs(currentState - neighborState);
            
            // Weight closer neighbors more heavily
            const distance = Math.sqrt(dx * dx + dy * dy);
            const weight = 1 / distance;
            
            contrastScore += contrast * weight;
            
            // Check if this creates an edge
            if (contrast > 0) {
                edgeScore += weight;
            }
        }
    }
    
    // Normalize scores
    contrastScore = contrastScore / 12; // Normalize based on max possible contrast
    edgeScore = Math.min(edgeScore / 4, 1); // Cap edge score at 1
    const diversityScore = (neighborDiversity.size - 1) / 3; // Normalize by maximum possible states - 1
    
    // Combine scores with weights
    const score = distanceScore * 0.3 +     // Distance from center
                 contrastScore * 0.3 +      // Contrast with neighbors
                 edgeScore * 0.25 +         // Edge strength
                 diversityScore * 0.15;     // State diversity
    
    return score;
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

    // Calculate midpoints
    const midX = Math.floor(internalGridWidth / 2);
    const midY = Math.floor(internalGridHeight / 2);

    // Apply pattern
    console.log("Applying pattern:", patternName);
    if (grid) {
        // For non-image patterns, initialize the grid
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
                    }
                    grid[y * internalGridWidth + x] = encodeCellState(false, 0, tileState);
                }
            }
        }
    }

    if (placeTurmite) {
        // Start at the midpoint initially
        turmiteX = Math.max(0, Math.min(midX, internalGridWidth - 1));
        turmiteY = Math.max(0, Math.min(midY, internalGridHeight - 1));
        turmiteDir = 1;

        if (internalGridWidth > 0 && internalGridHeight > 0) {
            // For both images and patterns, use edge detection to find a good starting point
            const bestPos = findBestStartPosition(midX, midY);
            turmiteX = bestPos.x;
            turmiteY = bestPos.y;

            if (turmiteX >= 0 && turmiteX < internalGridWidth && turmiteY >= 0 && turmiteY < internalGridHeight) {
                let finalState = getCellTileState(turmiteX, turmiteY);
                setCellState(turmiteX, turmiteY, encodeCellState(true, turmiteDir, finalState));
                console.log(`Placed turmite at: (${turmiteX}, ${turmiteY}), Dir: ${turmiteDir}, Initial State: ${finalState}`);
            } else {
                console.error("Invalid turmite position after placement attempt");
            }
        } else {
            console.error("Grid dimensions zero, cannot place turmite.");
        }
    } else {
        turmiteX = undefined;
        turmiteY = undefined;
        turmiteDir = undefined;
        console.log(`Turmite placement skipped.`);
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
        if (turmiteX !== undefined && turmiteY !== undefined) {
            let oldIndex = getIndex(turmiteX, turmiteY);
            if (isMitePresent(grid[oldIndex])) {
                let oldTileState = getTileStateFromCell(grid[oldIndex]);
                grid[oldIndex] = encodeCellState(false, 0, oldTileState);
                dirtyCells.add(oldIndex);
            }
        }

        // Set new position
        turmiteX = x;
        turmiteY = y;
        turmiteDir = dir;

        // Update grid cell at new position
        let index = getIndex(x, y);
        let currentTileState = getTileStateFromCell(grid[index]); // Get state before overwriting
        grid[index] = encodeCellState(true, dir, currentTileState);
        dirtyCells.add(index);
        console.log(`Turmite explicitly set to: (${turmiteX}, ${turmiteY}), Dir: ${turmiteDir}`);
    } else {
        console.error(`Invalid position for setTurmitePosition: (${x}, ${y}) on ${internalGridWidth}x${internalGridHeight} grid.`);
    }
}

/** Executes one step of the Turmite simulation. */
export function updateSimulation() {
    if (!grid || turmiteX === undefined) return; // Ensure grid and turmite exist
    // 1. Get current turmite info
    const miteInfo = getTurmiteInfo();
    if (!miteInfo) return;
    const { x: currentX, y: currentY, dir: currentDir, tileState: currentTileState } = miteInfo;

    // 2. Apply rule
    const { turnDirection, nextTileState } = applyRule(currentTileState);
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

    // 5. Handle Collision (checks single next cell, not block for now)
    const collisionResultDir = handleCollision(nextX, nextY, currentX, currentY, newDirection, nextTileState);
    if (collisionResultDir !== null) return;

    // 6. Update grid cells (no collision)
    updateGridCellsForMove(currentX, currentY, nextX, nextY, newDirection, nextTileState);

    // 7. Update global trackers
    updateTurmiteTrackers(nextX, nextY, newDirection);
}

// --- Internal Simulation Helpers --- //

function getTurmiteInfo() {
    let state = getCellState(turmiteX, turmiteY);
    if (!isMitePresent(state)) {
        console.error("Turmite state inconsistency! Expected turmite at:", turmiteX, turmiteY);
        PARAMS.running = false;
        return null;
    }
    let dir = getMiteDirection(state);
    let tileState = getTileStateFromCell(state);
    return { x: turmiteX, y: turmiteY, state, dir, tileState };
}

function applyRule(currentTileState) {
    let ruleAction = activeRule[currentTileState];
    let nextTileState, turnDirection;
    if (ruleAction) {
        if (PARAMS.rule === 'random_walk') {
            turnDirection = Math.floor(Math.random() * 3) - 1;
            nextTileState = ruleAction.nextTileState;
        } else {
            turnDirection = ruleAction.turn;
            nextTileState = ruleAction.nextTileState;
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
        turmiteDir = newDir;
        steps++;
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

function updateTurmiteTrackers(nextX, nextY, newDirection) {
    turmiteX = nextX;
    turmiteY = nextY;
    turmiteDir = newDirection;
    steps++;
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