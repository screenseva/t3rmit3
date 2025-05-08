# Turmite Simulator Code Index

## Core Files

- `sketch.js` - Main entry point for the application that sets up the canvas and initializes the simulator
- `src/core/simulation/simulation.js` - Core simulation logic that handles the turmite movement rules and grid state
- `src/ui/components/ui.js` - UI components powered by Tweakpane for controlling simulation parameters
- `src/core/rendering/renderer.js` - Rendering engine that handles drawing the simulation to the canvas
- `src/core/constants.js` - Global constants used throughout the application

## Core Modules

### Simulation
- `simulation.js` - Manages the turmite simulation logic, rule evaluation, and grid state
- `rules/` - Predefined rule sets for various turmite behaviors

### Rendering
- `renderer.js` - Handles drawing the simulation state to the canvas
- `palettes.js` - Color palette definitions for different visual themes
- `chunking.js` - (Implied) Optimization for rendering via spatial chunking

### UI Components
- `ui.js` - Manages the Tweakpane-based UI for parameter control
- Controls for:
  - Simulation speed and steps per frame
  - Rule selection and customization
  - Appearance customization
  - Image processing features

### Workers
- `SimulationWorker.js` - Worker thread for offloading simulation computation
- `ImageProcessorWorker.js` - Worker thread for image processing tasks

## Features

### Turmite Rules
- Built-in rules (Langton's Ant, etc.)
- Custom rule creation and saving
- Rule parameterization with 8 states

### Image Processing
- Image loading and conversion to turmite grid
- Dithering algorithms (Floyd-Steinberg, Atkinson)

### UI
- Play/pause/reset controls
- Rule selection dropdown
- Custom rule editor
- Palette preview
- Compact mode toggle
- Seed-based random rule generation

### State Management
- Internal grid representation
- Cell state tracking (multiple states)
- Multiple turmite support

### Persistence
- Local storage for custom rules
- Cross-session image restoration
- Cookie-based settings persistence

## Dependencies

- Tweakpane - UI component library
- DitherJS - Image dithering algorithms