# Turmite Simulation

An interactive cellular automaton simulation of Turmites (including Langton's Ant) built with JavaScript and p5.js.

## Features

- Multiple Turmite Rules:
  - Langton's Ant (classic rule - turn right on white, left on black)
  - Complex Pattern Generator
  - Spiral Generator
  - Random Walk
  - Highway Builder
  - ZigZag Pattern
  - Art Drawer

- Customizable Initial Patterns:
  - Square Block
  - Cross
  - Circle
  - Random
  - Empty

- Visualization Options:
  - Adjustable cell size
  - Grid lines toggle
  - Direction indicators
  - Customizable Turmite color
  - Multiple tile states (Black, White, Gray, Dark Gray)

- Controls:
  - Adjustable simulation speed
  - Start/Pause
  - Reset
  - Image export

## Technical Implementation

### State Representation

Each cell in the simulation grid uses 8 bits to store its state:
- Bits 7-6: Turmite presence (0xC0)
- Bit 5: Reserved for speed
- Bits 4-2: Direction (8 possible directions)
- Bits 1-0: Tile state (4 possible states)

### Direction System

8-way directional movement:
```
0: Top-left     1: Top      2: Top-right
7: Left         *: Center   3: Right
6: Bottom-left  5: Bottom   4: Bottom-right
```

### Statistics Tracking

The simulation tracks:
- Total steps executed
- Tiles visited/modified
- Steps per second
- Current grid size

## Installation & Setup

### Method 1: Direct Download
1. Download or clone this repository
2. Open `turmite.html` in any modern web browser (Chrome, Firefox, Edge, etc.)
3. No server or compilation required!

### Method 2: Using a Local Server
For more advanced development or to avoid potential CORS issues:
1. Install a local web server like [Live Server for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or use Python's built-in server:
   ```bash
   python -m http.server
   ```
2. Open `http://localhost:8000/turmite.html` (or whichever port your server uses)

## Usage Guide

1. **Getting Started:**
   - Open `turmite.html` in your browser
   - Select a rule from the dropdown menu
   - Choose an initial pattern
   - Click "Start" to begin the simulation

2. **Controls:**
   - Use the "Start/Pause" button to control simulation execution
   - Adjust speed with the slider
   - Change cell size to zoom in/out
   - Toggle grid lines for better visibility
   - Click "Export Image" to save the current state as PNG
   - Use the color picker to customize the Turmite's appearance

3. **Test Cases:**
   For quick demonstrations of different configurations, open any file in the `visual_tests` directory.

## Dependencies

- [p5.js](https://p5js.org/) (1.7.0+) - Loaded via CDN, no installation required

## Project Structure

- `sketch.js` - Main simulation logic and visualization
- `ui.js` - User interface logic
- `turmite.html` - Main HTML interface
- `visual_tests/` - Test cases for different configurations

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.