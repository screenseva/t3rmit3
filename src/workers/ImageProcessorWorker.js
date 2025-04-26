// Color mode palettes
const COLOR_MODES = {
    'classic': {
        palette: ['#000000', '#FFFFFF']
    },
    'amber': {
        palette: ['#000000', '#FFB000']
    },
    'greenscreen': {
        palette: ['#001100', '#00FF00']
    },
    'bluemonitor': {
        palette: ['#000000', '#4040FF']
    },
    'apple2': {
        palette: ['#000000', '#40FF40', '#FF4040', '#FFFF40']
    },
    'c64': {
        palette: ['#000000', '#55FF55', '#FF5555', '#FFFF55']
    },
    'cga1': {
        palette: ['#000000', '#55FF55', '#FF5555', '#FFFF55']
    },
    'cga2': {
        palette: ['#000000', '#55FFFF', '#FF55FF', '#FFFFFF']
    }
};

// Convert hex color to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Calculate relative luminance
function getBrightness(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b);
}

// Detect edges using Sobel operator
function detectEdges(data, width, height) {
    const edges = new Uint8Array(width * height);
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
    
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let pixelX = 0;
            let pixelY = 0;
            
            // Apply Sobel operators
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const idx = ((y + i) * width + (x + j)) * 4;
                    const gray = getBrightness(
                        data[idx],
                        data[idx + 1],
                        data[idx + 2]
                    );
                    
                    const sobelIndex = (i + 1) * 3 + (j + 1);
                    pixelX += gray * sobelX[sobelIndex];
                    pixelY += gray * sobelY[sobelIndex];
                }
            }
            
            // Calculate edge magnitude
            const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
            edges[y * width + x] = magnitude > 30 ? 255 : 0;
        }
    }
    
    return edges;
}

// Process image with improved dithering and edge detection
function processImage(imageData, threshold) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new Uint8ClampedArray(data);
    const stateMap = new Uint8Array(width * height);
    
    // Detect edges
    const edges = detectEdges(data, width, height);
    
    // Apply processing with edge preservation
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;
            const isEdge = edges[y * width + x] > 0;
            
            // Get grayscale value
            const gray = getBrightness(
                data[i],
                data[i + 1],
                data[i + 2]
            );
            
            // Determine state and color
            let state;
            if (isEdge) {
                // Preserve edges by making them black
                state = 0;
                output[i] = output[i + 1] = output[i + 2] = 0;
            } else {
                // Apply threshold with slight dithering for non-edge pixels
                const dither = (Math.random() - 0.5) * 20;
                state = (gray + dither) < threshold ? 0 : 1;
                const color = state === 0 ? 0 : 255;
                output[i] = output[i + 1] = output[i + 2] = color;
            }
            
            // Keep alpha channel
            output[i + 3] = data[i + 3];
            
            // Store state
            stateMap[y * width + x] = state;
        }
    }
    
    return {
        processedData: output,
        stateMap: stateMap,
        width: width,
        height: height
    };
}

// Handle messages from main thread
self.onmessage = function(e) {
    if (e.data.type === 'processImage') {
        try {
            const { imageData, stateMap, width, height, threshold } = e.data;
            
            // Create preview data
            const previewData = {
                data: imageData.data.buffer,
                width: width,
                height: height
            };
            
            // Send processed data back
            self.postMessage({
                processedData: imageData,
                stateMap: stateMap,
                previewData: previewData,
                width: width,
                height: height
            }, [imageData.data.buffer, stateMap]);
            
        } catch (error) {
            self.postMessage({ error: error.message });
        }
    }
}; 