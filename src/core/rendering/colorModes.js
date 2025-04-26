// colorModes.js
// Defines classic color modes and their palettes

export const colorModes = {
    // Default mode (2 colors)
    'default': {
        name: 'Default',
        colors: 2,
        resolution: { width: 800, height: 600 },
        palette: [
            [0, 0, 0],       // Black
            [255, 255, 255]  // White
        ],
        dithering: 'none'
    },

    // VGA Mode 13h (256 colors)
    'vga': {
        name: 'VGA Mode 13h',
        colors: 256,
        resolution: { width: 320, height: 200 },
        palette: [
            // First 16 colors (EGA/VGA standard)
            [0, 0, 0],       // Black
            [0, 0, 170],     // Blue
            [0, 170, 0],     // Green
            [0, 170, 170],   // Cyan
            [170, 0, 0],     // Red
            [170, 0, 170],   // Magenta
            [170, 85, 0],    // Brown
            [170, 170, 170], // Light Gray
            [85, 85, 85],    // Dark Gray
            [85, 85, 255],   // Light Blue
            [85, 255, 85],   // Light Green
            [85, 255, 255],  // Light Cyan
            [255, 85, 85],   // Light Red
            [255, 85, 255],  // Light Magenta
            [255, 255, 85],  // Yellow
            [255, 255, 255], // White
            // Additional colors follow...
        ],
        dithering: 'ordered'
    },

    // CGA Mode 4 (4 colors)
    'cga': {
        name: 'CGA Mode 4',
        colors: 4,
        resolution: { width: 320, height: 200 },
        palette: [
            [0, 0, 0],       // Black
            [0, 255, 0],     // Green
            [255, 0, 0],     // Red
            [255, 255, 255]  // White
        ],
        dithering: 'pattern'
    },

    // EGA (16 colors)
    'ega': {
        name: 'EGA',
        colors: 16,
        resolution: { width: 640, height: 350 },
        palette: [
            [0, 0, 0],       // Black
            [0, 0, 170],     // Blue
            [0, 170, 0],     // Green
            [0, 170, 170],   // Cyan
            [170, 0, 0],     // Red
            [170, 0, 170],   // Magenta
            [170, 85, 0],    // Brown
            [170, 170, 170], // Light Gray
            [85, 85, 85],    // Dark Gray
            [85, 85, 255],   // Light Blue
            [85, 255, 85],   // Light Green
            [85, 255, 255],  // Light Cyan
            [255, 85, 85],   // Light Red
            [255, 85, 255],  // Light Magenta
            [255, 255, 85],  // Yellow
            [255, 255, 255]  // White
        ],
        dithering: 'ordered'
    },

    // Commodore 64
    'c64': {
        name: 'Commodore 64',
        colors: 16,
        resolution: { width: 320, height: 200 },
        palette: [
            [0, 0, 0],       // Black
            [255, 255, 255], // White
            [136, 0, 0],     // Red
            [170, 255, 238], // Cyan
            [204, 68, 204],  // Purple
            [0, 204, 85],    // Green
            [0, 0, 170],     // Blue
            [238, 238, 119], // Yellow
            [221, 136, 85],  // Orange
            [102, 68, 0],    // Brown
            [255, 119, 119], // Light Red
            [51, 51, 51],    // Dark Gray
            [119, 119, 119], // Medium Gray
            [170, 255, 102], // Light Green
            [0, 136, 255],   // Light Blue
            [187, 187, 187]  // Light Gray
        ],
        dithering: 'pattern'
    },

    // MacOS Classic (1-bit)
    'macos': {
        name: 'MacOS Classic',
        colors: 2,
        resolution: { width: 512, height: 342 },
        palette: [
            [0, 0, 0],       // Black
            [255, 255, 255]  // White
        ],
        dithering: 'atkinson'
    },

    // Text Mode (16 colors)
    'text': {
        name: 'Text Mode',
        colors: 16,
        resolution: { width: 80, height: 25 },
        palette: [
            [0, 0, 0],       // Black
            [0, 0, 128],     // Dark Blue
            [0, 128, 0],     // Dark Green
            [0, 128, 128],   // Dark Cyan
            [128, 0, 0],     // Dark Red
            [128, 0, 128],   // Dark Magenta
            [128, 128, 0],   // Dark Yellow
            [192, 192, 192], // Light Gray
            [128, 128, 128], // Dark Gray
            [0, 0, 255],     // Light Blue
            [0, 255, 0],     // Light Green
            [0, 255, 255],   // Light Cyan
            [255, 0, 0],     // Light Red
            [255, 0, 255],   // Light Magenta
            [255, 255, 0],   // Light Yellow
            [255, 255, 255]  // White
        ],
        dithering: 'none'
    }
};

// Dithering patterns
export const ditherPatterns = {
    'ordered': [
        [1, 9, 3, 11],
        [13, 5, 15, 7],
        [4, 12, 2, 10],
        [16, 8, 14, 6]
    ],
    'pattern': [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5]
    ],
    'atkinson': [
        [1/8, 1, 0],
        [1/8, 2, 0],
        [1/8, -1, 1],
        [1/8, 0, 1],
        [1/8, 1, 1],
        [1/8, 0, 2]
    ]
}; 