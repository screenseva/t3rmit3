# T3rmit3 - Turmite Cellular Automaton Simulator

A web-based simulator for exploring Turmite cellular automata, featuring multiple rule presets, interactive controls, pattern generation, and image processing capabilities.

## Features

- **Rich Rule Library**
  - Multiple built-in rule presets including Langton's Ant, Spiral, Highway, and more
  - Custom rule creation with 8-state support
  - Save, load, and share rule configurations
  - Seed-based random rule generation

- **Advanced Simulation Control**
  - Multiple turmites with individual behaviors
  - Variable simulation speed and steps per frame
  - Adjustable turmite size and appearance
  - Play/pause/reset controls

- **Rich Visual Customization**
  - 30+ color palettes including classic computer themes (C64, Game Boy, Apple II)
  - Live palette preview
  - Support for 8-bit color depth

- **Image Processing**
  - Convert images to turmite grids
  - Multiple dithering algorithms (Floyd-Steinberg, Atkinson)
  - Image processing options (inversion, resizing)
  - Automatic image restoration between sessions

- **Intuitive UI**
  - Compact mode for smaller displays
  - Tweakpane-powered control panel
  - Cross-session preference persistence
  - Responsive layout

## Code Structure

See [CODE_INDEX.md](CODE_INDEX.md) for a detailed breakdown of the code structure and architecture.

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher recommended)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/screenseva/t3rmit3.git
cd t3rmit3
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:8080` (or the port shown in your terminal)

### Building for Production

```bash
npm run build
```

## Rule Customization

The simulator supports creating custom rules with the following parameters:

- **State Transitions**: Define the next state for each current state
- **Direction Changes**: Define how the turmite rotates for each state
- **Rule Seeds**: Save and share rules using numeric seeds

### Built-in Rules

- **Langton**: Classic Langton's ant behavior (if white, turn right; if black, turn left)
- **Spiral**: Creates beautiful spiral patterns
- **Highway**: Generates highway-like structures with repetitive patterns
- **Crystal**: Forms crystalline, symmetric patterns
- **Maze**: Creates complex maze-like structures
- **Chaos**: Produces chaotic, unpredictable patterns
- And many more...

## Image Processing

The simulator can convert images to turmite grids:

1. Upload an image using the Image controls
2. The image will be processed and converted to a grid
3. Turmites will be positioned automatically
4. Start the simulation to see turmites interact with the image

## Examples and Use Cases

- **Art Generation**: Create unique patterns and artistic outputs
- **Educational Tool**: Demonstrate emergent behavior and complexity
- **Pattern Analysis**: Study how simple rules lead to complex behaviors
- **Computer Science Education**: Visualize cellular automata concepts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by Chris Langton's original ant cellular automaton
- Built using modern web technologies including Tweakpane
- Special thanks to the cellular automata community

## Contact

Prajjwal Chandra
- [GitHub](https://github.com/screenseva)
