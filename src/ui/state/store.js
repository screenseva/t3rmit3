/**
 * Store class for managing application state
 */
export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = new Set();
        this.actions = new Map();
    }

    /**
     * Get current state
     * @returns {Object} Current state
     */
    getState() {
        return this.state;
    }

    /**
     * Update state and notify listeners
     * @param {Object} newState - New state values
     */
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        };
        this.notifyListeners();
    }

    /**
     * Register a state change listener
     * @param {Function} listener - Listener function
     * @returns {Function} Unsubscribe function
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    /**
     * Notify all listeners of state changes
     */
    notifyListeners() {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }

    /**
     * Register an action
     * @param {string} name - Action name
     * @param {Function} action - Action function
     */
    registerAction(name, action) {
        this.actions.set(name, action);
    }

    /**
     * Dispatch an action
     * @param {string} name - Action name
     * @param {*} payload - Action payload
     */
    dispatch(name, payload) {
        const action = this.actions.get(name);
        if (action) {
            action(this, payload);
        }
    }
}

// Create default store instance
export const store = new Store({
    // Simulation state
    simulation: {
        running: false,
        speed: 30,
        stepsPerFrame: 1,
        numTurmites: 1
    },
    
    // Grid state
    grid: {
        width: 800,
        height: 600,
        cellSize: 1
    },
    
    // Rule state
    rules: {
        currentRule: 'langton',
        customRuleParams: {}
    },
    
    // UI state
    ui: {
        showPerformance: false,
        showGrid: true,
        showTurmites: true
    },
    
    // Performance state
    performance: {
        fps: 0,
        updateTime: 0,
        renderTime: 0
    }
});

// Register default actions
store.registerAction('START_SIMULATION', (store) => {
    store.setState({
        simulation: {
            ...store.getState().simulation,
            running: true
        }
    });
});

store.registerAction('STOP_SIMULATION', (store) => {
    store.setState({
        simulation: {
            ...store.getState().simulation,
            running: false
        }
    });
});

store.registerAction('UPDATE_SPEED', (store, speed) => {
    store.setState({
        simulation: {
            ...store.getState().simulation,
            speed
        }
    });
});

store.registerAction('UPDATE_STEPS_PER_FRAME', (store, steps) => {
    store.setState({
        simulation: {
            ...store.getState().simulation,
            stepsPerFrame: steps
        }
    });
});

store.registerAction('UPDATE_NUM_TURMITES', (store, count) => {
    store.setState({
        simulation: {
            ...store.getState().simulation,
            numTurmites: count
        }
    });
});

store.registerAction('UPDATE_GRID_SIZE', (store, { width, height }) => {
    store.setState({
        grid: {
            ...store.getState().grid,
            width,
            height
        }
    });
});

store.registerAction('UPDATE_CELL_SIZE', (store, cellSize) => {
    store.setState({
        grid: {
            ...store.getState().grid,
            cellSize
        }
    });
});

store.registerAction('UPDATE_RULE', (store, { rule, params }) => {
    store.setState({
        rules: {
            currentRule: rule,
            customRuleParams: params || {}
        }
    });
});

store.registerAction('UPDATE_PERFORMANCE', (store, metrics) => {
    store.setState({
        performance: metrics
    });
}); 