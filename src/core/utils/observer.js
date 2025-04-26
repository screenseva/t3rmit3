/**
 * Observer class for reactive variable changes
 */
export class Observer {
    constructor() {
        this.observers = new Map();
        this.values = new Map();
    }

    /**
     * Define a reactive variable
     * @param {string} key - Variable key
     * @param {*} initialValue - Initial value
     * @param {Object} options - Observer options
     */
    define(key, initialValue, options = {}) {
        if (this.values.has(key)) {
            console.warn(`Variable ${key} is already defined`);
            return;
        }

        this.values.set(key, initialValue);
        this.observers.set(key, new Set());

        // Create getter and setter
        Object.defineProperty(this, key, {
            get: () => this.values.get(key),
            set: (newValue) => {
                const oldValue = this.values.get(key);
                
                // Validate new value if validator is provided
                if (options.validator) {
                    const result = options.validator(newValue);
                    if (!result.valid) {
                        console.error(`Invalid value for ${key}:`, result.errors);
                        return;
                    }
                }

                // Transform value if transformer is provided
                if (options.transform) {
                    newValue = options.transform(newValue);
                }

                this.values.set(key, newValue);
                this.notify(key, newValue, oldValue);
            }
        });
    }

    /**
     * Subscribe to variable changes
     * @param {string} key - Variable key
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.observers.has(key)) {
            console.error(`Variable ${key} is not defined`);
            return () => {};
        }

        this.observers.get(key).add(callback);
        return () => this.observers.get(key).delete(callback);
    }

    /**
     * Notify observers of a variable change
     * @param {string} key - Variable key
     * @param {*} newValue - New value
     * @param {*} oldValue - Old value
     */
    notify(key, newValue, oldValue) {
        const observers = this.observers.get(key);
        if (!observers) return;

        observers.forEach(callback => {
            try {
                callback(newValue, oldValue);
            } catch (error) {
                console.error(`Error in observer for ${key}:`, error);
            }
        });
    }

    /**
     * Get current value of a variable
     * @param {string} key - Variable key
     * @returns {*} Current value
     */
    getValue(key) {
        return this.values.get(key);
    }

    /**
     * Set value of a variable
     * @param {string} key - Variable key
     * @param {*} value - New value
     */
    setValue(key, value) {
        if (!this.values.has(key)) {
            console.error(`Variable ${key} is not defined`);
            return;
        }

        this[key] = value;
    }

    /**
     * Batch update multiple variables
     * @param {Object} updates - Object of key-value pairs to update
     */
    batchUpdate(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.setValue(key, value);
        });
    }

    /**
     * Create a computed property
     * @param {string} key - Computed property key
     * @param {Function} compute - Computation function
     * @param {Array<string>} dependencies - Array of dependency keys
     */
    defineComputed(key, compute, dependencies) {
        // Define the computed property
        Object.defineProperty(this, key, {
            get: () => {
                const values = dependencies.map(dep => this.getValue(dep));
                return compute(...values);
            }
        });

        // Subscribe to all dependencies
        dependencies.forEach(dep => {
            this.subscribe(dep, () => {
                this.notify(key, this[key], undefined);
            });
        });
    }
}

// Create singleton instance
export const observer = new Observer(); 