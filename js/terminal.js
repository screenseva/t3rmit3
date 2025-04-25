// Terminal management and features
const Terminal = window.Terminal;
const FitAddon = window.FitAddon.FitAddon;
const WebLinksAddon = window.WebLinksAddon.WebLinksAddon;
const WebglAddon = window.WebglAddon.WebglAddon;

class TerminalManager {
    constructor() {
        this.terminals = {
            system: this.createTerminal('terminal'),
            controls: this.createTerminal('controls-terminal'),
            stats: this.createTerminal('stats-terminal')
        };
        
        this.commands = new Map();
        this.setupCommands();
        this.currentInput = '';
        this.commandHistory = [];
        this.historyIndex = -1;
    }

    createTerminal(elementId) {
        const terminal = new Terminal({
            theme: {
                background: '#0a0a0a',
                foreground: '#00ff00',
                cursor: '#00ff00',
                cursorAccent: '#0a0a0a',
                selection: 'rgba(0, 255, 0, 0.3)',
                black: '#000000',
                green: '#00ff00',
                brightGreen: '#00ff00'
            },
            fontFamily: 'Courier New',
            fontSize: 12,
            cursorBlink: true,
            cursorStyle: 'block',
            convertEol: true,
            allowTransparency: true
        });

        // Add addons
        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);
        terminal.loadAddon(new WebLinksAddon());
        terminal.loadAddon(new WebglAddon());

        // Open terminal in container
        terminal.open(document.getElementById(elementId));
        fitAddon.fit();

        // Store fit addon reference for later use
        terminal.fitAddon = fitAddon;
        return terminal;
    }

    setupCommands() {
        // System commands
        this.commands.set('help', () => this.showHelp());
        this.commands.set('clear', () => this.clearTerminal());
        this.commands.set('status', () => this.showStatus());
        
        // Turmite control commands
        this.commands.set('start', () => this.startSimulation());
        this.commands.set('stop', () => this.stopSimulation());
        this.commands.set('reset', () => this.resetSimulation());
        this.commands.set('speed', (args) => this.setSpeed(args));
        this.commands.set('color', (args) => this.setColor(args));
        
        // View commands
        this.commands.set('zoom', (args) => this.setZoom(args));
        this.commands.set('follow', (args) => this.toggleFollow(args));
        this.commands.set('invert', () => this.toggleInvert());
    }

    initSystemTerminal() {
        const term = this.terminals.system;
        term.writeln('\x1b[32m╔════════════════════════════════════╗');
        term.writeln('║     T3RMIT3 CONTROL SYSTEM v1.0     ║');
        term.writeln('╚════════════════════════════════════╝\x1b[0m');
        term.writeln('');
        term.writeln('Type \x1b[32mhelp\x1b[0m for available commands');
        term.writeln('');
        this.prompt();

        term.onKey(({ key, domEvent }) => {
            const ev = domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) { // Enter
                this.handleCommand();
            } else if (ev.keyCode === 8) { // Backspace
                if (this.currentInput.length > 0) {
                    this.currentInput = this.currentInput.slice(0, -1);
                    term.write('\b \b');
                }
            } else if (ev.keyCode === 38) { // Up arrow
                this.navigateHistory('up');
            } else if (ev.keyCode === 40) { // Down arrow
                this.navigateHistory('down');
            } else if (printable) {
                this.currentInput += key;
                term.write(key);
            }
        });
    }

    prompt() {
        this.terminals.system.write('\r\n\x1b[32m>\x1b[0m ');
    }

    handleCommand() {
        const term = this.terminals.system;
        term.writeln('');
        
        const input = this.currentInput.trim();
        if (input) {
            this.commandHistory.push(input);
            this.historyIndex = this.commandHistory.length;
            
            const [cmd, ...args] = input.split(' ');
            const command = this.commands.get(cmd.toLowerCase());
            
            if (command) {
                command(args);
            } else {
                term.writeln(`\x1b[31mCommand not found: ${cmd}\x1b[0m`);
            }
        }
        
        this.currentInput = '';
        this.prompt();
    }

    navigateHistory(direction) {
        const term = this.terminals.system;
        
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length) {
            this.historyIndex++;
        }

        const newCommand = this.commandHistory[this.historyIndex] || '';
        term.write('\r\x1b[2K\x1b[32m>\x1b[0m ' + newCommand);
        this.currentInput = newCommand;
    }

    showHelp() {
        const term = this.terminals.system;
        term.writeln('\x1b[32mAvailable Commands:\x1b[0m');
        term.writeln('');
        term.writeln('\x1b[32mSystem Commands:\x1b[0m');
        term.writeln('  help     - Show this help message');
        term.writeln('  clear    - Clear terminal');
        term.writeln('  status   - Show system status');
        term.writeln('');
        term.writeln('\x1b[32mTurmite Controls:\x1b[0m');
        term.writeln('  start    - Start simulation');
        term.writeln('  stop     - Stop simulation');
        term.writeln('  reset    - Reset simulation');
        term.writeln('  speed N  - Set simulation speed (1-10)');
        term.writeln('  color N  - Set turmite color (hex)');
        term.writeln('');
        term.writeln('\x1b[32mView Controls:\x1b[0m');
        term.writeln('  zoom N   - Set zoom level (1-10)');
        term.writeln('  follow   - Toggle follow mode');
        term.writeln('  invert   - Toggle color inversion');
    }

    clearTerminal() {
        const term = this.terminals.system;
        term.clear();
        this.initSystemTerminal();
    }

    updateStats(stats) {
        const term = this.terminals.stats;
        term.clear();
        term.writeln(`Steps: ${stats.steps}`);
        term.writeln(`Position: (${stats.x}, ${stats.y})`);
        term.writeln(`Direction: ${stats.direction}°`);
        term.writeln(`State: ${stats.state}`);
        term.writeln(`FPS: ${stats.fps}`);
    }

    // Implement simulation control methods
    startSimulation() {
        // TODO: Implement start simulation
        this.terminals.system.writeln('\x1b[32mSimulation started\x1b[0m');
    }

    stopSimulation() {
        // TODO: Implement stop simulation
        this.terminals.system.writeln('\x1b[32mSimulation stopped\x1b[0m');
    }

    resetSimulation() {
        // TODO: Implement reset simulation
        this.terminals.system.writeln('\x1b[32mSimulation reset\x1b[0m');
    }

    setSpeed(args) {
        const speed = parseInt(args[0]);
        if (isNaN(speed) || speed < 1 || speed > 10) {
            this.terminals.system.writeln('\x1b[31mInvalid speed. Use a number between 1-10\x1b[0m');
            return;
        }
        // TODO: Implement speed change
        this.terminals.system.writeln(`\x1b[32mSpeed set to ${speed}\x1b[0m`);
    }

    setColor(args) {
        const color = args[0];
        if (!/^#[0-9A-Fa-f]{6}$/.test(color)) {
            this.terminals.system.writeln('\x1b[31mInvalid color. Use hex format (e.g., #00ff00)\x1b[0m');
            return;
        }
        // TODO: Implement color change
        this.terminals.system.writeln(`\x1b[32mColor set to ${color}\x1b[0m`);
    }

    setZoom(args) {
        const zoom = parseInt(args[0]);
        if (isNaN(zoom) || zoom < 1 || zoom > 10) {
            this.terminals.system.writeln('\x1b[31mInvalid zoom level. Use a number between 1-10\x1b[0m');
            return;
        }
        // TODO: Implement zoom change
        this.terminals.system.writeln(`\x1b[32mZoom set to ${zoom}\x1b[0m`);
    }

    toggleFollow() {
        // TODO: Implement follow toggle
        this.terminals.system.writeln('\x1b[32mFollow mode toggled\x1b[0m');
    }

    toggleInvert() {
        // TODO: Implement invert toggle
        this.terminals.system.writeln('\x1b[32mInvert mode toggled\x1b[0m');
    }

    showStatus() {
        const term = this.terminals.system;
        term.writeln('\x1b[32mSystem Status:\x1b[0m');
        term.writeln('');
        term.writeln('WebGL: ' + (this.hasWebGL ? 'Enabled' : 'Disabled'));
        term.writeln('Terminal Mode: Active');
        term.writeln('Buffer Size: ' + term.cols + 'x' + term.rows);
        term.writeln('Theme: Cyberpunk');
        term.writeln('Version: 1.0.0');
    }

    // Window resize handler
    handleResize() {
        Object.values(this.terminals).forEach(terminal => {
            terminal.fitAddon.fit();
        });
    }
}

// Export singleton instance
export const terminalManager = new TerminalManager();

// Handle window resizing
window.addEventListener('resize', () => terminalManager.handleResize()); 