/**
 * Grid class managing the simulation grid and cell states
 */
export class Grid {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.cells = new Uint16Array(width * height);
        this.turmites = [];
    }

    /**
     * Initialize the grid with a specific state
     * @param {number} initialState - Initial state for all cells
     */
    initialize(initialState = 0) {
        this.cells.fill(initialState);
    }

    /**
     * Get the state of a cell at the specified position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} Cell state
     */
    getCell(x, y) {
        return this.cells[y * this.width + x];
    }

    /**
     * Set the state of a cell at the specified position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} state - New cell state
     */
    setCell(x, y, value) {
        this.cells[y * this.width + x] = value;
    }

    /**
     * Add a turmite to the grid
     * @param {Turmite} turmite - Turmite instance to add
     */
    addTurmite(turmite) {
        this.turmites.push(turmite);
    }

    /**
     * Remove all turmites from the grid
     */
    clearTurmites() {
        this.turmites = [];
    }

    /**
     * Get all turmites on the grid
     * @returns {Array<Turmite>} Array of turmites
     */
    getTurmites() {
        return this.turmites;
    }

    /**
     * Update the grid state based on turmite movements
     * @param {Object} rules - Rules object defining state transitions
     */
    update(rules) {
        for (const turmite of this.turmites) {
            const { x, y } = turmite.getPosition();
            const currentState = this.getCell(x, y);
            
            // Apply rules
            const { nextState, turn } = rules.getTransition(currentState, turmite.getState());
            
            // Update cell state
            this.setCell(x, y, nextState);
            
            // Move turmite
            turmite.turn(turn);
            turmite.move(this.width, this.height);
        }
    }

    /**
     * Get the grid dimensions
     * @returns {Object} Object containing width and height
     */
    getDimensions() {
        return {
            width: this.width,
            height: this.height
        };
    }

    /**
     * Resize the grid
     * @param {number} newWidth - New grid width
     * @param {number} newHeight - New grid height
     */
    resize(newWidth, newHeight) {
        const newCells = new Uint16Array(newWidth * newHeight);
        
        // Copy existing cells
        const minWidth = Math.min(this.width, newWidth);
        const minHeight = Math.min(this.height, newHeight);
        
        for (let y = 0; y < minHeight; y++) {
            for (let x = 0; x < minWidth; x++) {
                newCells[y * newWidth + x] = this.getCell(x, y);
            }
        }
        
        this.width = newWidth;
        this.height = newHeight;
        this.cells = newCells;
    }

    clear() {
        this.cells.fill(0);
    }
}

export default Grid; 