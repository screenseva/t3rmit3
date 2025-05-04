/**
 * Rules class managing the simulation rules and state transitions
 */
export class Rules {
    constructor() {
        this.transitions = new Map();
        this.numStates = 0;
    }

    /**
     * Add a transition rule
     * @param {number} currentState - Current cell state
     * @param {number} turmiteState - Current turmite state
     * @param {number} nextState - Next cell state
     * @param {number} turn - Turn value
     * @param {number} nextTurmiteState - Next turmite state
     */
    addTransition(currentState, turmiteState, nextState, turn, nextTurmiteState) {
        const key = `${currentState},${turmiteState}`;
        this.transitions.set(key, {
            nextState,
            turn,
            nextTurmiteState
        });
        this.numStates = Math.max(this.numStates, currentState + 1, nextState + 1);
    }

    /**
     * Get the transition for a given state
     * @param {number} currentState - Current cell state
     * @param {number} turmiteState - Current turmite state
     * @returns {Object} Transition object containing nextState, turn, and nextTurmiteState
     */
    getTransition(currentState, turmiteState) {
        const key = `${currentState},${turmiteState}`;
        return this.transitions.get(key) || {
            nextState: currentState,
            turn: 0,
            nextTurmiteState: turmiteState
        };
    }

    /**
     * Create a Langton's Ant rule
     * @returns {Rules} New Rules instance with Langton's Ant rules
     */
    static createLangtonsAnt() {
        const rules = new Rules();
        rules.addTransition(0, 0, 1, 1, 0); // White to black, turn right
        rules.addTransition(1, 0, 0, -1, 0); // Black to white, turn left
        return rules;
    }

    /**
     * Create a custom rule from parameters
     * @param {Object} params - Rule parameters
     * @returns {Rules} New Rules instance with custom rules
     */
    static createCustomRule(params) {
        const rules = new Rules();
        
        // Add transitions for each state
        for (let state = 0; state < 8; state++) {
            rules.addTransition(
                state,
                0,
                params[`state${state}Next`],
                params[`state${state}Turn`],
                0
            );
        }
        
        return rules;
    }

    /**
     * Get the number of states in the rule set
     * @returns {number} Number of states
     */
    getNumStates() {
        return this.numStates;
    }

    /**
     * Clear all rules
     */
    clear() {
        this.transitions.clear();
        this.numStates = 0;
    }
} 