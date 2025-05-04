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
    // High contrast palette (Black and White only)
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
    // Pastel
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
    // Neon
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
    // Fire
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
    // Winter
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
    // VGA text palette
    'vga': {
        [STATE_WHITE]: '#FFFFFF',
        [STATE_BLACK]: '#000000',
        [STATE_GRAY]: '#AAAAAA',
        [STATE_DARK_GRAY]: '#00AA00',
        [STATE_LIGHT_GRAY]: '#DDDDDD',
        [STATE_RED]: '#AA0000',
        [STATE_GREEN]: '#00AA00',
        [STATE_BLUE]: '#0000AA',
        default: '#FFFFFF'
    },
    // Text mode green screen
    'text': {
        [STATE_WHITE]: '#00FF00',
        [STATE_BLACK]: '#001100',
        [STATE_GRAY]: '#008800',
        [STATE_DARK_GRAY]: '#004400',
        [STATE_LIGHT_GRAY]: '#00CC00',
        [STATE_RED]: '#00FF00',
        [STATE_GREEN]: '#00FF00',
        [STATE_BLUE]: '#00FF00',
        default: '#001100'
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

    // 8-color palettes
    'vga8': ['#000000','#AA0000','#00AA00','#AAAA00','#0000AA','#AA00AA','#00AAAA','#AAAAAA'],
    'win8': ['#000000','#800000','#008000','#808000','#000080','#800080','#008080','#C0C0C0'],
    'mac8': ['#000000','#DD0000','#00DD00','#DDDD00','#0000DD','#DD00DD','#00DDDD','#DDDDDD'],
    'solarized8': ['#002B36','#073642','#586E75','#657B83','#839496','#93A1A1','#EEE8D5','#FDF6E3'],
    'nord8': ['#2E3440','#3B4252','#434C5E','#4C566A','#D8DEE9','#E5E9F0','#ECEFF4','#8FBCBB'],
    'dracula8': ['#282A36','#44475A','#6272A4','#BD93F9','#FF79C6','#FF5555','#FFB86C','#F1FA8C'],
    'gruvbox8': ['#282828','#3C3836','#504945','#665C54','#BDAE93','#D5C4A1','#EBDBB2','#FBF1C7'],
    'monokai8': ['#272822','#383830','#49483E','#75715E','#A59F85','#F8F8F2','#F9F8F5','#F92672'],
    'ocean8': ['#1E3F66','#2A4D7E','#3B6EA5','#4F95E0','#6BA3E3','#8BB7E8','#A8C9ED','#C5DBF2'],
    'sunset8': ['#332B2B','#4A3A3A','#614949','#785858','#8F6767','#A67676','#BD8585','#D49494'],
    'forest8': ['#1A2F1A','#2A3F2A','#3A4F3A','#4A5F4A','#5A6F5A','#6A7F6A','#7A8F7A','#8A9F8A'],
    'fire8': ['#330000','#4A0000','#610000','#780000','#8F0000','#A60000','#BD0000','#D40000'],
    'winter8': ['#1A1A2A','#2A2A3A','#3A3A4A','#4A4A5A','#5A5A6A','#6A6A7A','#7A7A8A','#8A8A9A'],
    'pastel8': ['#FFB5B5','#FFD5B5','#FFF5B5','#D5FFB5','#B5FFB5','#B5FFD5','#B5FFF5','#B5D5FF'],
    'neon8': ['#FF00FF','#00FFFF','#FFFF00','#00FF00','#FF0000','#0000FF','#FF00FF','#00FFFF'],
    'earth8': ['#2C1810','#3C2810','#4C3810','#5C4810','#6C5810','#7C6810','#8C7810','#9C8810'],
    'retro8': ['#000000','#1D2B53','#7E2553','#008751','#AB5236','#5F574F','#C2C3C7','#FFF1E8']
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