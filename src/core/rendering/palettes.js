// palettes.js
// Defines different color palettes for rendering cell states.

import { STATE_BLACK, STATE_WHITE, STATE_GRAY, STATE_DARK_GRAY } from '../constants.js';

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
    },

    // VGA text palette
    'vga': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#AAAAAA',
        [STATE_DARK_GRAY]: '#00AA00',
        default: '#FFFFFF'
    },

    // Text mode green screen
    'text': {
        [STATE_BLACK]: '#001100',
        [STATE_WHITE]: '#00FF00',
        [STATE_GRAY]: '#008800',
        [STATE_DARK_GRAY]: '#004400',
        default: '#001100'
    },

    // CGA palette 0 (cyan/magenta/white)
    'cga0': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#55FFFF',
        [STATE_DARK_GRAY]: '#FF55FF',
        default: '#FFFFFF'
    },

    // CGA palette 1 (red/green/yellow)
    'cga1': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#AAAA00',
        [STATE_GRAY]: '#00AA00',
        [STATE_DARK_GRAY]: '#AA0000',
        default: '#AAAA00'
    },

    // Commodore 64 palette subset
    'c64': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#7F7F7F',
        [STATE_DARK_GRAY]: '#55FF55',
        default: '#FFFFFF'
    },

    // Game Boy 4-tone green
    'gameboy': {
        [STATE_BLACK]: '#0F380F',
        [STATE_WHITE]: '#9BBC0F',
        [STATE_GRAY]: '#8BAC0F',
        [STATE_DARK_GRAY]: '#306230',
        default: '#9BBC0F'
    },

    // ZX Spectrum palette subset
    'spectrum': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#D70000',
        [STATE_DARK_GRAY]: '#0000D7',
        default: '#FFFFFF'
    },

    // Apple II hi-res 4-tone
    'apple2': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#00FF00',
        [STATE_DARK_GRAY]: '#FF00FF',
        default: '#FFFFFF'
    },

    // ANSI terminal
    'ansi': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#00FF00',
        [STATE_DARK_GRAY]: '#FF0000',
        default: '#FFFFFF'
    },

    // 4-tone grayscale
    'grayscale': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFFFFF',
        [STATE_GRAY]: '#AAAAAA',
        [STATE_DARK_GRAY]: '#555555',
        default: '#FFFFFF'
    },

    // Sepia quad
    'sepia': {
        [STATE_BLACK]: '#332200',
        [STATE_WHITE]: '#EEDDCC',
        [STATE_GRAY]: '#AA8855',
        [STATE_DARK_GRAY]: '#664400',
        default: '#EEDDCC'
    },

    // Amber CRT
    'amber': {
        [STATE_BLACK]: '#000000',
        [STATE_WHITE]: '#FFDF40',
        [STATE_GRAY]: '#FF9F00',
        [STATE_DARK_GRAY]: '#FFBF00',
        default: '#FFDF40'
    },
};

// 8-colour VGA palette as array (index 0-7)
export const vga8 = ['#000000','#AA0000','#00AA00','#AAAA00','#0000AA','#AA00AA','#00AAAA','#AAAAAA'];

// 16-colour VGA palette as array (index 0-15)
export const vga16 = ['#000000','#0000AA','#00AA00','#00AAAA','#AA0000','#AA00AA','#AA5500','#AAAAAA','#555555','#5555FF','#55FF55','#55FFFF','#FF5555','#FF55FF','#FFFF55','#FFFFFF'];

// You might also want a function to get the color for a state from a palette name
export function getColor(paletteName, state) {
    const pal = palettes[paletteName];
    if (Array.isArray(pal)) {
        return pal[state % pal.length];
    }
    const palette = pal || palettes['default'];
    return palette[state] || palette['default'] || '#FF00FF';
} 