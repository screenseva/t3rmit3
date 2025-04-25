# t3rmit3

A creative coding project that implements Turmites (Turing machine + termite) with an interactive web interface. Turmites are universal Turing machines that move on a 2D grid, creating fascinating patterns and behaviors.

## Features

- Multiple rule presets including Langton's Ant and custom variations
- Image-based initialization with intelligent edge detection
- Real-time visualization with chunked rendering for performance
- Interactive controls for:
  - Speed and step size
  - Grid visualization
  - Pattern selection
  - Custom rule creation
  - Canvas size adjustment
  - Zoom and follow controls
- Support for loading and manipulating images
- Modern, dark-themed UI using Tweakpane

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/t3rmit3.git
cd t3rmit3
```

2. Serve the project using a local web server. For example:
```bash
python -m http.server 5500
```

3. Open your browser and navigate to `http://localhost:5500`

## Usage

- **Rule Selection**: Choose from preset rules or create your own custom rules
- **Image Loading**: Load any image to use as an initial state
- **Controls**:
  - Play/Pause: Start or stop the simulation
  - Step: Advance one step at a time
  - Speed: Adjust simulation speed
  - Zoom: Control view magnification
  - Follow: Keep the turmite centered
  - Canvas Size: Adjust the drawing area

## Technical Details

The project uses:
- Vanilla JavaScript (ES6+)
- PixiJS for efficient rendering
- Tweakpane for the UI controls
- HTML5 Canvas for image processing

## License

MIT License - Feel free to use, modify, and distribute this code.

## Acknowledgments

Inspired by:
- Langton's Ant
- Turmites and other 2D Turing machines
- Creative coding community