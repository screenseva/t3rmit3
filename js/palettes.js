// palettes.js
// Defines different color palettes for rendering cell states.

import { STATE_BLACK, STATE_WHITE, STATE_GRAY, STATE_DARK_GRAY } from './constants.js';

export const palettes = {
    // Default palette matching the original hardcoded colors
    'default': {
        [STATE_BLACK]: '#000000',     // Black
        [STATE_WHITE]: '#E0E0E0',     // Light Gray/White from dither palette
        [STATE_GRAY]: '#b4b4b4',      // Gray from dither palette
        [STATE_DARK_GRAY]: '#646464', // Dark Gray from dither palette
        default: '#FF00FF'            // Magenta default for undefined states
    },
    // Simple heatmap-like palette
    'heatmap': {
        [STATE_BLACK]: '#0000FF',     // Blue
        [STATE_WHITE]: '#00FF00',     // Green
        [STATE_GRAY]: '#FFFF00',      // Yellow
        [STATE_DARK_GRAY]: '#FF0000', // Red
        default: '#CCCCCC'            // Light gray default
    },
    // High contrast palette (Black and White only)
    'bw': {
        [STATE_BLACK]: '#000000',     // Black
        [STATE_WHITE]: '#FFFFFF',     // White
        [STATE_GRAY]: '#000000',      // Map grays to black
        [STATE_DARK_GRAY]: '#000000', // Map grays to black
        default: '#FFFFFF'            // White default
    },
    // Forest palette inspired by Cellab
    'forest': {
        [STATE_BLACK]: '#228B22',     // ForestGreen
        [STATE_WHITE]: '#F5F5DC',     // Beige (background)
        [STATE_GRAY]: '#8B4513',      // SaddleBrown
        [STATE_DARK_GRAY]: '#556B2F', // DarkOliveGreen
        default: '#F5F5DC'
    },
    // Add more palettes here as needed...
    
    // Ocean palette
    'ocean': {
        [STATE_BLACK]: '#1E3F66',     // Deep blue
        [STATE_WHITE]: '#D6E8F7',     // Light blue-white
        [STATE_GRAY]: '#4F95E0',      // Medium blue
        [STATE_DARK_GRAY]: '#2A628F', // Dark blue
        default: '#D6E8F7'
    },
    
    // Sunset palette
    'sunset': {
        [STATE_BLACK]: '#FF5E5B',     // Red-orange
        [STATE_WHITE]: '#FFFFEA',     // Warm white
        [STATE_GRAY]: '#FFB35C',      // Orange
        [STATE_DARK_GRAY]: '#BD4089', // Purple
        default: '#FFFFEA'
    },
    
    // Monochrome Blue
    'monoblue': {
        [STATE_BLACK]: '#0A2463',     // Dark blue
        [STATE_WHITE]: '#E2E8F6',     // Very light blue
        [STATE_GRAY]: '#8DA9DB',      // Medium blue
        [STATE_DARK_GRAY]: '#3E5FA9', // Medium-dark blue
        default: '#E2E8F6'
    },
    
    // Monochrome Green
    'monogreen': {
        [STATE_BLACK]: '#0B6E4F',     // Dark green
        [STATE_WHITE]: '#E0F5ED',     // Very light green
        [STATE_GRAY]: '#98D9B9',      // Medium green
        [STATE_DARK_GRAY]: '#3BAF75', // Medium-dark green
        default: '#E0F5ED'
    },
    
    // Retro Computing
    'retro': {
        [STATE_BLACK]: '#00FF00',     // Bright green (terminal)
        [STATE_WHITE]: '#001100',     // Very dark green (background)
        [STATE_GRAY]: '#00AA00',      // Medium green
        [STATE_DARK_GRAY]: '#005500', // Dark green
        default: '#001100'
    },
    
    // Pastel
    'pastel': {
        [STATE_BLACK]: '#A0D2EB',     // Light blue
        [STATE_WHITE]: '#FEF9FF',     // White
        [STATE_GRAY]: '#FFC8DD',      // Pink
        [STATE_DARK_GRAY]: '#D8E2DC', // Light gray-green
        default: '#FEF9FF'
    },
    
    // Neon
    'neon': {
        [STATE_BLACK]: '#FF00FF',     // Magenta
        [STATE_WHITE]: '#000000',     // Black (background)
        [STATE_GRAY]: '#00FFFF',      // Cyan
        [STATE_DARK_GRAY]: '#FFFF00', // Yellow
        default: '#000000'
    },
    
    // Earth Tones
    'earth': {
        [STATE_BLACK]: '#5E3023',     // Brown
        [STATE_WHITE]: '#F2E9DC',     // Cream
        [STATE_GRAY]: '#CCA43B',      // Gold
        [STATE_DARK_GRAY]: '#976F5C', // Tan
        default: '#F2E9DC'
    },
    
    // Fire
    'fire': {
        [STATE_BLACK]: '#FF4000',     // Bright orange-red
        [STATE_WHITE]: '#FFF3BF',     // Pale yellow
        [STATE_GRAY]: '#FFBF00',      // Golden yellow
        [STATE_DARK_GRAY]: '#CC0000', // Deep red
        default: '#FFF3BF'
    },
    
    // Winter
    'winter': {
        [STATE_BLACK]: '#1B3A6B',     // Navy blue
        [STATE_WHITE]: '#FFFFFF',     // White (snow)
        [STATE_GRAY]: '#B6DBE4',      // Ice blue
        [STATE_DARK_GRAY]: '#5E7C99', // Steel blue
        default: '#FFFFFF'
    }
};

// You might also want a function to get the color for a state from a palette name
export function getColor(paletteName, state) {
    const palette = palettes[paletteName] || palettes['default']; // Fallback to default
    return palette[state] || palette['default'] || '#FF00FF'; // Return state color or palette default or global default
} 