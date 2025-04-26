/**
 * Turmite class representing a single turmite in the simulation
 */
export class Turmite {
    constructor(x, y, direction, state = 0) {
        this.x = x;
        this.y = y;
        this.direction = direction; // 0: right, 1: down, 2: left, 3: up
        this.state = state;
    }

    /**
     * Move the turmite based on its current direction
     * @param {number} gridWidth - Width of the simulation grid
     * @param {number} gridHeight - Height of the simulation grid
     */
    move(grid) {
        // Get current cell color
        const currentColor = grid.getCell(this.x, this.y);
        
        // Get rule for current state and color
        const rule = this.getRule(currentColor);
        
        // Update cell color
        grid.setCell(this.x, this.y, rule.newColor);
        
        // Turn and move
        this.direction = (this.direction + rule.turn) % 4;
        this.state = rule.newState;
        
        // Move forward
        switch(this.direction) {
            case 0: this.y--; break; // Up
            case 1: this.x++; break; // Right
            case 2: this.y++; break; // Down
            case 3: this.x--; break; // Left
        }
        
        // Wrap around grid
        this.x = (this.x + grid.width) % grid.width;
        this.y = (this.y + grid.height) % grid.height;
    }

    getRule(color) {
        // This should be implemented based on the specific rules
        // For now, return a default rule
        return {
            turn: 1,
            newColor: (color + 1) % 2,
            newState: this.state
        };
    }

    /**
     * Turn the turmite based on the given turn value
     * @param {number} turn - Turn value (-2: sharp right, -1: right, 0: straight, 1: left, 2: sharp left)
     */
    turn(turn) {
        this.direction = (this.direction + turn + 4) % 4;
    }

    /**
     * Update the turmite's state
     * @param {number} newState - New state value
     */
    setState(newState) {
        this.state = newState;
    }

    /**
     * Get the turmite's current position
     * @returns {Object} Position object with x and y coordinates
     */
    getPosition() {
        return { x: this.x, y: this.y };
    }

    /**
     * Get the turmite's current state
     * @returns {number} Current state value
     */
    getState() {
        return this.state;
    }
}

export default Turmite; 