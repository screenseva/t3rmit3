// palettes.js
// Defines different color palettes for rendering cell states.

import { 
    STATE_BLACK, 
    STATE_WHITE, 
    STATE_GRAY, 
    STATE_DARK_GRAY,
    STATE_LIGHT_GRAY,
    STATE_RED,
    STATE_GREEN,
    STATE_BLUE
} from '../constants.js';

export const palettes = {
    // Default palette matching the UI colors
    'default': {
        [STATE_WHITE]: '#ffffff',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#aaaaaa',
        [STATE_DARK_GRAY]: '#555555',
        [STATE_LIGHT_GRAY]: '#dddddd',
        [STATE_RED]: '#ff0000',
        [STATE_GREEN]: '#00ff00',
        [STATE_BLUE]: '#0000ff',
        default: '#FF00FF'            // Magenta default for undefined states
    },
    // Simple black and white palette
    'bw': {
        [STATE_WHITE]: '#FFFFFF',     // White
        [STATE_BLACK]: '#000000',     // Black
        [STATE_GRAY]: '#000000',      // Map grays to black
        [STATE_DARK_GRAY]: '#000000', // Map grays to black
        [STATE_LIGHT_GRAY]: '#000000', // Map grays to black
        [STATE_RED]: '#000000',       // Map colors to black
        [STATE_GREEN]: '#000000',     // Map colors to black
        [STATE_BLUE]: '#000000',      // Map colors to black
        default: '#FFFFFF'            // White default
    },
    // Forest palette inspired by Cellab
    'forest': {
        [STATE_WHITE]: '#F5F5DC',     // Beige (background)
        [STATE_BLACK]: '#228B22',     // ForestGreen
        [STATE_GRAY]: '#8B4513',      // SaddleBrown
        [STATE_DARK_GRAY]: '#556B2F', // DarkOliveGreen
        [STATE_LIGHT_GRAY]: '#D2B48C', // Tan
        [STATE_RED]: '#8B0000',       // DarkRed
        [STATE_GREEN]: '#228B22',     // ForestGreen
        [STATE_BLUE]: '#1E90FF',      // DodgerBlue
        default: '#F5F5DC'
    },
    // Ocean palette
    'ocean': {
        [STATE_WHITE]: '#D6E8F7',     // Light blue-white
        [STATE_BLACK]: '#1E3F66',     // Deep blue
        [STATE_GRAY]: '#4F95E0',      // Medium blue
        [STATE_DARK_GRAY]: '#2A628F', // Dark blue
        [STATE_LIGHT_GRAY]: '#87CEEB', // SkyBlue
        [STATE_RED]: '#FF6B6B',       // Coral
        [STATE_GREEN]: '#2E8B57',     // SeaGreen
        [STATE_BLUE]: '#1E3F66',      // Deep blue
        default: '#D6E8F7'
    },
    // Sunset palette
    'sunset': {
        [STATE_WHITE]: '#FFFFEA',     // Warm white
        [STATE_BLACK]: '#FF5E5B',     // Red-orange
        [STATE_GRAY]: '#FFB35C',      // Orange
        [STATE_DARK_GRAY]: '#BD4089', // Purple
        [STATE_LIGHT_GRAY]: '#FFD700', // Gold
        [STATE_RED]: '#FF5E5B',       // Red-orange
        [STATE_GREEN]: '#FFD700',     // Gold
        [STATE_BLUE]: '#BD4089',      // Purple
        default: '#FFFFEA'
    },
    // Neon palette
    'neon': {
        [STATE_WHITE]: '#000000',     // Black (background)
        [STATE_BLACK]: '#FF00FF',     // Magenta
        [STATE_GRAY]: '#00FFFF',      // Cyan
        [STATE_DARK_GRAY]: '#FFFF00', // Yellow
        [STATE_LIGHT_GRAY]: '#FF00FF', // Magenta
        [STATE_RED]: '#FF0000',       // Red
        [STATE_GREEN]: '#00FF00',     // Green
        [STATE_BLUE]: '#0000FF',      // Blue
        default: '#000000'
    },
    // Earth Tones
    'earth': {
        [STATE_WHITE]: '#F2E9DC',     // Cream
        [STATE_BLACK]: '#5E3023',     // Brown
        [STATE_GRAY]: '#CCA43B',      // Gold
        [STATE_DARK_GRAY]: '#976F5C', // Tan
        [STATE_LIGHT_GRAY]: '#D4B996', // Light tan
        [STATE_RED]: '#8B4513',       // SaddleBrown
        [STATE_GREEN]: '#556B2F',     // DarkOliveGreen
        [STATE_BLUE]: '#483D8B',      // DarkSlateBlue
        default: '#F2E9DC'
    },
    // Fire palette
    'fire': {
        [STATE_WHITE]: '#FFF3BF',     // Pale yellow
        [STATE_BLACK]: '#FF4000',     // Bright orange-red
        [STATE_GRAY]: '#FFBF00',      // Golden yellow
        [STATE_DARK_GRAY]: '#CC0000', // Deep red
        [STATE_LIGHT_GRAY]: '#FFD700', // Gold
        [STATE_RED]: '#FF0000',       // Red
        [STATE_GREEN]: '#FFA500',     // Orange
        [STATE_BLUE]: '#FF4500',      // OrangeRed
        default: '#FFF3BF'
    },
    // Winter palette
    'winter': {
        [STATE_WHITE]: '#FFFFFF',     // White (snow)
        [STATE_BLACK]: '#1B3A6B',     // Navy blue
        [STATE_GRAY]: '#B6DBE4',      // Ice blue
        [STATE_DARK_GRAY]: '#5E7C99', // Steel blue
        [STATE_LIGHT_GRAY]: '#E6F3FF', // Light ice blue
        [STATE_RED]: '#1B3A6B',       // Navy blue
        [STATE_GREEN]: '#1B3A6B',     // Navy blue
        [STATE_BLUE]: '#1B3A6B',      // Navy blue
        default: '#FFFFFF'
    },
    // Pastel palette
    'pastel': {
        [STATE_WHITE]: '#FEF9FF',     // White
        [STATE_BLACK]: '#A0D2EB',     // Light blue
        [STATE_GRAY]: '#FFC8DD',      // Pink
        [STATE_DARK_GRAY]: '#D8E2DC', // Light gray-green
        [STATE_LIGHT_GRAY]: '#F0E6EF', // Light purple
        [STATE_RED]: '#FFB6C1',       // Light pink
        [STATE_GREEN]: '#98FB98',     // Pale green
        [STATE_BLUE]: '#ADD8E6',      // Light blue
        default: '#FEF9FF'
    },
    // Retro Computing
    'retro': {
        [STATE_WHITE]: '#001100',     // Very dark green (background)
        [STATE_BLACK]: '#00FF00',     // Bright green (terminal)
        [STATE_GRAY]: '#00AA00',      // Medium green
        [STATE_DARK_GRAY]: '#005500', // Dark green
        [STATE_LIGHT_GRAY]: '#00CC00', // Light green
        [STATE_RED]: '#00FF00',       // Bright green
        [STATE_GREEN]: '#00FF00',     // Bright green
        [STATE_BLUE]: '#00FF00',      // Bright green
        default: '#001100'
    },
    // Simple heatmap-like palette
    'heatmap': {
        [STATE_WHITE]: '#FFFFFF',     // White
        [STATE_BLACK]: '#0000FF',     // Blue
        [STATE_GRAY]: '#00FF00',      // Green
        [STATE_DARK_GRAY]: '#FFFF00', // Yellow
        [STATE_LIGHT_GRAY]: '#FFA500', // Orange
        [STATE_RED]: '#FF0000',       // Red
        [STATE_GREEN]: '#00FF00',     // Green
        [STATE_BLUE]: '#0000FF',      // Blue
        default: '#CCCCCC'            // Light gray default
    },
    // Monochrome Blue
    'monoblue': {
        [STATE_WHITE]: '#E2E8F6',     // Very light blue
        [STATE_BLACK]: '#0A2463',     // Dark blue
        [STATE_GRAY]: '#8DA9DB',      // Medium blue
        [STATE_DARK_GRAY]: '#3E5FA9', // Medium-dark blue
        [STATE_LIGHT_GRAY]: '#B4C7E7', // Light blue
        [STATE_RED]: '#0A2463',       // Dark blue
        [STATE_GREEN]: '#0A2463',     // Dark blue
        [STATE_BLUE]: '#0A2463',      // Dark blue
        default: '#E2E8F6'
    },
    // Monochrome Green
    'monogreen': {
        [STATE_WHITE]: '#E0F5ED',     // Very light green
        [STATE_BLACK]: '#0B6E4F',     // Dark green
        [STATE_GRAY]: '#98D9B9',      // Medium green
        [STATE_DARK_GRAY]: '#3BAF75', // Medium-dark green
        [STATE_LIGHT_GRAY]: '#C8E6C9', // Light green
        [STATE_RED]: '#0B6E4F',       // Dark green
        [STATE_GREEN]: '#0B6E4F',     // Dark green
        [STATE_BLUE]: '#0B6E4F',      // Dark green
        default: '#E0F5ED'
    },
    // CGA palette 0 (cyan/magenta/white)
    'cga0': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#55FFFF',
        [STATE_DARK_GRAY]: '#FF55FF',
        [STATE_LIGHT_GRAY]: '#FFFFFF',
        [STATE_RED]: '#FF55FF',
        [STATE_GREEN]: '#55FFFF',
        [STATE_BLUE]: '#000000',
        default: '#FFFFFF'
    },
    // CGA palette 1 (red/green/yellow)
    'cga1': {
        [STATE_WHITE]: '#AAAA00',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#00AA00',
        [STATE_DARK_GRAY]: '#AA0000',
        [STATE_LIGHT_GRAY]: '#AAAA00',
        [STATE_RED]: '#AA0000',
        [STATE_GREEN]: '#00AA00',
        [STATE_BLUE]: '#000000',
        default: '#AAAA00'
    },
    // Commodore 64 palette subset
    'c64': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#7F7F7F',
        [STATE_DARK_GRAY]: '#55FF55',
        [STATE_LIGHT_GRAY]: '#AAAAAA',
        [STATE_RED]: '#FF5555',
        [STATE_GREEN]: '#55FF55',
        [STATE_BLUE]: '#5555FF',
        default: '#FFFFFF'
    },
    // Game Boy 4-tone green
    'gameboy': {
        [STATE_WHITE]: '#9BBC0F',
        [STATE_BLACK]: '#0F380F',
        [STATE_GRAY]: '#8BAC0F',
        [STATE_DARK_GRAY]: '#306230',
        [STATE_LIGHT_GRAY]: '#9BBC0F',
        [STATE_RED]: '#0F380F',
        [STATE_GREEN]: '#0F380F',
        [STATE_BLUE]: '#0F380F',
        default: '#9BBC0F'
    },
    // ZX Spectrum palette subset
    'spectrum': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#D70000',
        [STATE_DARK_GRAY]: '#0000D7',
        [STATE_LIGHT_GRAY]: '#FFFFFF',
        [STATE_RED]: '#D70000',
        [STATE_GREEN]: '#00D700',
        [STATE_BLUE]: '#0000D7',
        default: '#FFFFFF'
    },
    // Apple II hi-res 4-tone
    'apple2': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#00FF00',
        [STATE_DARK_GRAY]: '#FF00FF',
        [STATE_LIGHT_GRAY]: '#FFFFFF',
        [STATE_RED]: '#FF00FF',
        [STATE_GREEN]: '#00FF00',
        [STATE_BLUE]: '#000000',
        default: '#FFFFFF'
    },
    // ANSI terminal
    'ansi': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#00FF00',
        [STATE_DARK_GRAY]: '#FF0000',
        [STATE_LIGHT_GRAY]: '#FFFFFF',
        [STATE_RED]: '#FF0000',
        [STATE_GREEN]: '#00FF00',
        [STATE_BLUE]: '#0000FF',
        default: '#FFFFFF'
    },
    // 4-tone grayscale
    'grayscale': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#AAAAAA',
        [STATE_DARK_GRAY]: '#555555',
        [STATE_LIGHT_GRAY]: '#DDDDDD',
        [STATE_RED]: '#777777',
        [STATE_GREEN]: '#777777',
        [STATE_BLUE]: '#777777',
        default: '#FFFFFF'
    },
    // Sepia quad
    'sepia': {
        [STATE_WHITE]: '#EEDDCC',
        [STATE_BLACK]: '#332200',
        [STATE_GRAY]: '#AA8855',
        [STATE_DARK_GRAY]: '#664400',
        [STATE_LIGHT_GRAY]: '#CCBB99',
        [STATE_RED]: '#AA8855',
        [STATE_GREEN]: '#AA8855',
        [STATE_BLUE]: '#AA8855',
        default: '#EEDDCC'
    },
    // Amber CRT
    'amber': {
        [STATE_WHITE]: '#FFDF40',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#FF9F00',
        [STATE_DARK_GRAY]: '#FFBF00',
        [STATE_LIGHT_GRAY]: '#FFDF40',
        [STATE_RED]: '#FF9F00',
        [STATE_GREEN]: '#FF9F00',
        [STATE_BLUE]: '#FF9F00',
        default: '#FFDF40'
    },
    // Solarized palette (popular in coding)
    'solarized': {
        [STATE_WHITE]: '#FDF6E3',     // Base3 (light background)
        [STATE_BLACK]: '#002B36',     // Base03 (dark background)
        [STATE_GRAY]: '#586E75',      // Base01 (dark gray)
        [STATE_DARK_GRAY]: '#073642', // Base02 (darker gray)
        [STATE_LIGHT_GRAY]: '#93A1A1', // Base1 (light gray)
        [STATE_RED]: '#DC322F',       // Red
        [STATE_GREEN]: '#859900',     // Green
        [STATE_BLUE]: '#268BD2',      // Blue
        default: '#FDF6E3'
    },
    // Nord palette (popular in UI design)
    'nord': {
        [STATE_WHITE]: '#ECEFF4',     // Snow Storm 1
        [STATE_BLACK]: '#2E3440',     // Polar Night 1
        [STATE_GRAY]: '#4C566A',      // Polar Night 4
        [STATE_DARK_GRAY]: '#3B4252', // Polar Night 2
        [STATE_LIGHT_GRAY]: '#D8DEE9', // Snow Storm 2
        [STATE_RED]: '#BF616A',       // Aurora Red
        [STATE_GREEN]: '#A3BE8C',     // Aurora Green
        [STATE_BLUE]: '#5E81AC',      // Frost Blue
        default: '#ECEFF4'
    },
    // Dracula theme (popular in coding)
    'dracula': {
        [STATE_WHITE]: '#F8F8F2',     // Foreground
        [STATE_BLACK]: '#282A36',     // Background
        [STATE_GRAY]: '#6272A4',      // Comment
        [STATE_DARK_GRAY]: '#44475A', // Current Line
        [STATE_LIGHT_GRAY]: '#BD93F9', // Purple
        [STATE_RED]: '#FF5555',       // Red
        [STATE_GREEN]: '#50FA7B',     // Green
        [STATE_BLUE]: '#8BE9FD',      // Cyan
        default: '#F8F8F2'
    },
    // Gruvbox theme (popular in coding)
    'gruvbox': {
        [STATE_WHITE]: '#FBF1C7',     // Light0
        [STATE_BLACK]: '#282828',     // Dark0
        [STATE_GRAY]: '#928374',      // Gray
        [STATE_DARK_GRAY]: '#3C3836', // Dark2
        [STATE_LIGHT_GRAY]: '#EBDBB2', // Light2
        [STATE_RED]: '#FB4934',       // Bright Red
        [STATE_GREEN]: '#B8BB26',     // Bright Green
        [STATE_BLUE]: '#83A598',      // Bright Blue
        default: '#FBF1C7'
    },
    // Monokai theme (popular in coding)
    'monokai': {
        [STATE_WHITE]: '#F8F8F2',     // Foreground
        [STATE_BLACK]: '#272822',     // Background
        [STATE_GRAY]: '#75715E',      // Comment
        [STATE_DARK_GRAY]: '#383830', // Selection
        [STATE_LIGHT_GRAY]: '#A59F85', // Light Gray
        [STATE_RED]: '#F92672',       // Red
        [STATE_GREEN]: '#A6E22E',     // Green
        [STATE_BLUE]: '#66D9EF',      // Blue
        default: '#F8F8F2'
    },
    // Material Design palette
    'material': {
        [STATE_WHITE]: '#FFFFFF',     // White
        [STATE_BLACK]: '#212121',     // Black
        [STATE_GRAY]: '#9E9E9E',      // Gray
        [STATE_DARK_GRAY]: '#424242', // Dark Gray
        [STATE_LIGHT_GRAY]: '#E0E0E0', // Light Gray
        [STATE_RED]: '#F44336',       // Red
        [STATE_GREEN]: '#4CAF50',     // Green
        [STATE_BLUE]: '#2196F3',      // Blue
        default: '#FFFFFF'
    },
    // Tokyo Night palette
    'tokyo': {
        [STATE_WHITE]: '#A9B1D6',     // Foreground
        [STATE_BLACK]: '#1A1B26',     // Background
        [STATE_GRAY]: '#565F89',      // Comment
        [STATE_DARK_GRAY]: '#24283B', // Dark Gray
        [STATE_LIGHT_GRAY]: '#C0CAF5', // Light Gray
        [STATE_RED]: '#F7768E',       // Red
        [STATE_GREEN]: '#9ECE6A',     // Green
        [STATE_BLUE]: '#7AA2F7',      // Blue
        default: '#A9B1D6'
    },
    // Catppuccin Mocha palette
    'mocha': {
        [STATE_WHITE]: '#CDD6F4',     // Text
        [STATE_BLACK]: '#1E1E2E',     // Base
        [STATE_GRAY]: '#6C7086',      // Overlay0
        [STATE_DARK_GRAY]: '#313244', // Surface0
        [STATE_LIGHT_GRAY]: '#A6E3A1', // Green
        [STATE_RED]: '#F38BA8',       // Red
        [STATE_GREEN]: '#A6E3A1',     // Green
        [STATE_BLUE]: '#89B4FA',      // Blue
        default: '#CDD6F4'
    },
    // One Dark Pro palette
    'onedark': {
        [STATE_WHITE]: '#ABB2BF',     // Foreground
        [STATE_BLACK]: '#282C34',     // Background
        [STATE_GRAY]: '#5C6370',      // Comment
        [STATE_DARK_GRAY]: '#3E4451', // Dark Gray
        [STATE_LIGHT_GRAY]: '#E5C07B', // Yellow
        [STATE_RED]: '#E06C75',       // Red
        [STATE_GREEN]: '#98C379',     // Green
        [STATE_BLUE]: '#61AFEF',      // Blue
        default: '#ABB2BF'
    },
    // Ayu Mirage palette
    'ayu': {
        [STATE_WHITE]: '#E6E1CF',     // Foreground
        [STATE_BLACK]: '#1F2430',     // Background
        [STATE_GRAY]: '#707A8C',      // Comment
        [STATE_DARK_GRAY]: '#242936', // Dark Gray
        [STATE_LIGHT_GRAY]: '#FFCC66', // Yellow
        [STATE_RED]: '#F28779',       // Red
        [STATE_GREEN]: '#BAE67E',     // Green
        [STATE_BLUE]: '#73D0FF',      // Blue
        default: '#E6E1CF'
    }
};

// You might also want a function to get the color for a state from a palette name
export function getColor(paletteName, state) {
    const pal = palettes[paletteName];
    if (Array.isArray(pal)) {
        return pal[state % pal.length];
    }
    const palette = pal || palettes['default'];
    return palette[state] || palette['default'] || '#FF00FF';
} 