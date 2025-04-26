/**
 * CacheManager class for variable caching and persistence
 */
export class CacheManager {
    constructor() {
        this.cache = new Map();
        this.persistentKeys = new Set();
    }

    /**
     * Set a value in cache
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {Object} options - Cache options
     */
    set(key, value, options = {}) {
        const cacheEntry = {
            value,
            timestamp: Date.now(),
            ttl: options.ttl || 0,
            persistent: options.persistent || false
        };

        this.cache.set(key, cacheEntry);

        if (options.persistent) {
            this.persistentKeys.add(key);
            try {
                localStorage.setItem(key, JSON.stringify(cacheEntry));
            } catch (error) {
                console.error(`Failed to persist ${key}:`, error);
            }
        }
    }

    /**
     * Get a value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) {
            // Try to load from persistent storage
            if (this.persistentKeys.has(key)) {
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        this.cache.set(key, parsed);
                        return parsed.value;
                    }
                } catch (error) {
                    console.error(`Failed to load ${key}:`, error);
                }
            }
            return undefined;
        }

        // Check if entry has expired
        if (entry.ttl > 0 && Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return undefined;
        }

        return entry.value;
    }

    /**
     * Remove a value from cache
     * @param {string} key - Cache key
     */
    remove(key) {
        this.cache.delete(key);
        this.persistentKeys.delete(key);
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Failed to remove ${key}:`, error);
        }
    }

    /**
     * Clear all cache entries
     * @param {boolean} includePersistent - Whether to clear persistent entries
     */
    clear(includePersistent = false) {
        this.cache.clear();
        if (includePersistent) {
            this.persistentKeys.forEach(key => {
                try {
                    localStorage.removeItem(key);
                } catch (error) {
                    console.error(`Failed to remove ${key}:`, error);
                }
            });
            this.persistentKeys.clear();
        }
    }

    /**
     * Check if a key exists in cache
     * @param {string} key - Cache key
     * @returns {boolean} True if key exists
     */
    has(key) {
        return this.cache.has(key) || this.persistentKeys.has(key);
    }

    /**
     * Get all cache keys
     * @returns {Array<string>} Array of cache keys
     */
    keys() {
        return Array.from(new Set([...this.cache.keys(), ...this.persistentKeys]));
    }

    /**
     * Get cache statistics
     * @returns {Object} Cache statistics
     */
    getStats() {
        return {
            totalEntries: this.cache.size + this.persistentKeys.size,
            memoryEntries: this.cache.size,
            persistentEntries: this.persistentKeys.size,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estimate memory usage of cache
     * @returns {number} Estimated memory usage in bytes
     */
    estimateMemoryUsage() {
        let size = 0;
        for (const [key, value] of this.cache) {
            size += key.length * 2; // UTF-16
            size += JSON.stringify(value).length * 2;
        }
        return size;
    }

    /**
     * Load all persistent entries
     */
    loadPersistentEntries() {
        for (const key of this.persistentKeys) {
            try {
                const stored = localStorage.getItem(key);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.cache.set(key, parsed);
                }
            } catch (error) {
                console.error(`Failed to load ${key}:`, error);
            }
        }
    }
}

// Create singleton instance
export const cacheManager = new CacheManager(); 