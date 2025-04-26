/**
 * ConfigManager class for managing configuration variables
 */
export class ConfigManager {
    constructor() {
        this.config = {
            // Simulation defaults
            simulation: {
                defaultSpeed: 30,
                minSpeed: 1,
                maxSpeed: 60,
                defaultStepsPerFrame: 1,
                minStepsPerFrame: 1,
                maxStepsPerFrame: 12,
                defaultNumTurmites: 1,
                minTurmites: 1,
                maxTurmites: 20
            },
            
            // Grid defaults
            grid: {
                defaultWidth: 800,
                defaultHeight: 600,
                minWidth: 100,
                maxWidth: 3840,
                minHeight: 100,
                maxHeight: 2160,
                defaultCellSize: 1,
                minCellSize: 1,
                maxCellSize: 16
            },
            
            // Rendering defaults
            rendering: {
                defaultZoom: 1.0,
                minZoom: 0.1,
                maxZoom: 5.0,
                defaultPalette: 'default',
                availablePalettes: ['default', 'heatmap', 'bw', 'forest', 'ocean', 'vga', 'text', 'cga0', 'cga1', 'c64', 'gameboy', 'spectrum', 'apple2', 'ansi', 'grayscale', 'sepia', 'amber', 'vga8', 'vga16']
            },
            
            // Performance thresholds
            performance: {
                targetFPS: 60,
                warningFPS: 30,
                maxUpdateTime: 16, // ms
                maxRenderTime: 16  // ms
            }
        };
    }

    /**
     * Get configuration for a specific section
     * @param {string} section - Configuration section
     * @returns {Object} Configuration object
     */
    getConfig(section) {
        return this.config[section] || {};
    }

    /**
     * Validate a value against configuration constraints
     * @param {string} section - Configuration section
     * @param {string} key - Configuration key
     * @param {*} value - Value to validate
     * @returns {boolean} True if value is valid
     */
    validateValue(section, key, value) {
        const config = this.getConfig(section);
        if (!config[key]) return false;

        const { min, max } = config[key];
        return value >= min && value <= max;
    }

    /**
     * Get default value for a configuration
     * @param {string} section - Configuration section
     * @param {string} key - Configuration key
     * @returns {*} Default value
     */
    getDefaultValue(section, key) {
        const config = this.getConfig(section);
        return config[`default${key.charAt(0).toUpperCase() + key.slice(1)}`] || null;
    }

    /**
     * Get available options for a configuration
     * @param {string} section - Configuration section
     * @param {string} key - Configuration key
     * @returns {Array} Available options
     */
    getAvailableOptions(section, key) {
        const config = this.getConfig(section);
        return config[`available${key.charAt(0).toUpperCase() + key.slice(1)}`] || [];
    }
}

// Create singleton instance
export const configManager = new ConfigManager(); 