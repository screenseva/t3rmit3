/**
 * PerformanceMonitor class for tracking and optimizing performance metrics
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            updateTime: 0,
            renderTime: 0,
            memoryUsage: 0
        };
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.updateTimes = [];
        this.renderTimes = [];
        this.maxSamples = 60; // Keep last 60 frames of data
    }

    /**
     * Start measuring update time
     */
    startUpdate() {
        this.updateStart = performance.now();
    }

    /**
     * End measuring update time
     */
    endUpdate() {
        const updateTime = performance.now() - this.updateStart;
        this.updateTimes.push(updateTime);
        if (this.updateTimes.length > this.maxSamples) {
            this.updateTimes.shift();
        }
        this.metrics.updateTime = this.calculateAverage(this.updateTimes);
    }

    /**
     * Start measuring render time
     */
    startRender() {
        this.renderStart = performance.now();
    }

    /**
     * End measuring render time
     */
    endRender() {
        const renderTime = performance.now() - this.renderStart;
        this.renderTimes.push(renderTime);
        if (this.renderTimes.length > this.maxSamples) {
            this.renderTimes.shift();
        }
        this.metrics.renderTime = this.calculateAverage(this.renderTimes);
    }

    /**
     * Update FPS calculation
     */
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        const elapsed = currentTime - this.lastTime;

        if (elapsed >= 1000) {
            this.metrics.fps = Math.round((this.frameCount * 1000) / elapsed);
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
    }

    /**
     * Calculate average of an array of numbers
     * @param {Array<number>} values - Array of values to average
     * @returns {number} Average value
     */
    calculateAverage(values) {
        if (values.length === 0) return 0;
        return values.reduce((sum, val) => sum + val, 0) / values.length;
    }

    /**
     * Get current performance metrics
     * @returns {Object} Current performance metrics
     */
    getMetrics() {
        return {
            ...this.metrics,
            updateTime: Math.round(this.metrics.updateTime * 100) / 100,
            renderTime: Math.round(this.metrics.renderTime * 100) / 100
        };
    }

    /**
     * Check if performance is below acceptable thresholds
     * @returns {boolean} True if performance is below thresholds
     */
    isPerformanceLow() {
        return this.metrics.fps < 30 || 
               this.metrics.updateTime > 16 || 
               this.metrics.renderTime > 16;
    }

    /**
     * Get performance recommendations based on current metrics
     * @returns {Array<string>} Array of performance recommendations
     */
    getRecommendations() {
        const recommendations = [];

        if (this.metrics.fps < 30) {
            recommendations.push('Consider reducing simulation steps per frame');
        }

        if (this.metrics.updateTime > 16) {
            recommendations.push('Consider optimizing simulation update logic');
        }

        if (this.metrics.renderTime > 16) {
            recommendations.push('Consider optimizing rendering logic');
        }

        return recommendations;
    }
} 