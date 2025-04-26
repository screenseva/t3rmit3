/**
 * Validator class for variable validation and type checking
 */
export class Validator {
    constructor() {
        this.types = {
            number: {
                validate: (value) => typeof value === 'number' && !isNaN(value),
                coerce: (value) => Number(value)
            },
            integer: {
                validate: (value) => Number.isInteger(value),
                coerce: (value) => Math.floor(Number(value))
            },
            string: {
                validate: (value) => typeof value === 'string',
                coerce: (value) => String(value)
            },
            boolean: {
                validate: (value) => typeof value === 'boolean',
                coerce: (value) => Boolean(value)
            },
            array: {
                validate: (value) => Array.isArray(value),
                coerce: (value) => Array.from(value)
            },
            object: {
                validate: (value) => typeof value === 'object' && value !== null,
                coerce: (value) => Object(value)
            }
        };
    }

    /**
     * Validate a value against a type
     * @param {*} value - Value to validate
     * @param {string} type - Type to validate against
     * @returns {boolean} True if value is valid
     */
    validateType(value, type) {
        const validator = this.types[type];
        if (!validator) return false;
        return validator.validate(value);
    }

    /**
     * Coerce a value to a specific type
     * @param {*} value - Value to coerce
     * @param {string} type - Type to coerce to
     * @returns {*} Coerced value
     */
    coerceType(value, type) {
        const validator = this.types[type];
        if (!validator) return value;
        return validator.coerce(value);
    }

    /**
     * Validate a value against a range
     * @param {number} value - Value to validate
     * @param {Object} range - Range object with min and max
     * @returns {boolean} True if value is within range
     */
    validateRange(value, { min, max }) {
        return value >= min && value <= max;
    }

    /**
     * Clamp a value to a range
     * @param {number} value - Value to clamp
     * @param {Object} range - Range object with min and max
     * @returns {number} Clamped value
     */
    clampToRange(value, { min, max }) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Validate a value against a list of allowed values
     * @param {*} value - Value to validate
     * @param {Array} allowedValues - Array of allowed values
     * @returns {boolean} True if value is allowed
     */
    validateEnum(value, allowedValues) {
        return allowedValues.includes(value);
    }

    /**
     * Validate an object against a schema
     * @param {Object} obj - Object to validate
     * @param {Object} schema - Schema object
     * @returns {Object} Validation result
     */
    validateSchema(obj, schema) {
        const result = {
            valid: true,
            errors: []
        };

        for (const [key, rules] of Object.entries(schema)) {
            const value = obj[key];
            
            // Check required
            if (rules.required && value === undefined) {
                result.valid = false;
                result.errors.push(`${key} is required`);
                continue;
            }

            // Skip validation if value is undefined and not required
            if (value === undefined) continue;

            // Validate type
            if (rules.type && !this.validateType(value, rules.type)) {
                result.valid = false;
                result.errors.push(`${key} must be of type ${rules.type}`);
            }

            // Validate range
            if (rules.range && !this.validateRange(value, rules.range)) {
                result.valid = false;
                result.errors.push(`${key} must be between ${rules.range.min} and ${rules.range.max}`);
            }

            // Validate enum
            if (rules.enum && !this.validateEnum(value, rules.enum)) {
                result.valid = false;
                result.errors.push(`${key} must be one of: ${rules.enum.join(', ')}`);
            }
        }

        return result;
    }
}

// Create singleton instance
export const validator = new Validator(); 