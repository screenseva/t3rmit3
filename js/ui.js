// ui.js
// Handles the Tweakpane UI elements and interactions

// Import Tweakpane as an ES module
import { Pane } from 'tweakpane';
import { 
    PARAMS,
    STATE_WHITE,
    STATE_BLACK,
    STATE_GRAY,
    STATE_DARK_GRAY 
} from './constants.js';
import { palettes } from './palettes.js';
import { 
    rules, 
    setActiveRule, 
    initializeGrid, 
    forceFullRedraw, 
    internalGridWidth, 
    internalGridHeight, 
    isImageLoaded,
    customRuleParams,
    updateCustomRule,
    rulePresets
} from './simulation.js';
import { applyCanvasSize, copyCanvasToClipboard, rebuildChunksForSimulationState } from './renderer.js';
// Removed: handleImageFile import (listener added in main.js)

let pane;
let playButton, pauseButton; // Button references
let lastUploadedImage = null; // Store the last uploaded image file
let customRuleFolder; // Reference for custom rule folder
let savedRules = {}; // Store for user-saved rules
let metricsObj = { value: 'Select a preset or create your own rule' }; // For monitor binding
let isCompactMode = false; // Track UI mode
let compactModeBtn; // Reference to compact mode button

// UI configuration - controls which folders are initially expanded
const UI_CONFIG = {
    initialExpanded: {
        simulation: true,       // Always expanded
        customRule: false,      // Expanded when selected
        appearance: false,      // Initially collapsed
        view: false,            // Initially collapsed
        image: false,           // Initially collapsed
        tools: false            // Initially collapsed
    },
    compactMode: {
        position: 'right',      // 'right' or 'left'
        width: 280,             // Width in pixels
        compactWidth: 280,      // Width when in compact mode
        normalWidth: 320,       // Width when in normal mode
        transparency: 0.95      // 0.0 - 1.0
    }
};

// Color mapping for states to use in the UI
const stateColors = {
    [STATE_WHITE]: '#ffffff',
    [STATE_BLACK]: '#000000',
    [STATE_GRAY]: '#aaaaaa',
    [STATE_DARK_GRAY]: '#555555'
};

// Helpful metrics and recommendations for rule parameters
const ruleMetrics = {
    turn: {
        '-2': 'Sharp right (90°)',
        '-1': 'Right (45°)',
        '0': 'Continue straight',
        '1': 'Left (45°)',
        '2': 'Sharp left (90°)'
    },
    patterns: {
        'spiral': 'Creates spiral patterns, good for decoration',
        'filling': 'Fills space efficiently, good for texture generation',
        'highway': 'Creates straight paths with periodic patterns',
        'crystal': 'Creates structured, crystalline patterns',
        'chaos': 'Unpredictable, chaotic movements'
    }
};

// Description and tooltips for different parts of the UI
const UI_HELP = {
    rule: "Controls how the turmite moves and changes colors",
    speed: "Frames per second - higher is faster simulation",
    simStepsPerFrame: "Steps per frame - higher values make the turmite move faster",
    customRule: "Create your own rules for turmite behavior",
    palette: "Color scheme for the simulation",
    turmiteSize: "Size of the turmite and its steps",
    canvasSize: "Size of the simulation area in pixels",
    zoom: "Zoom level for viewing the simulation",
    followTurmite: "Camera follows the turmite as it moves"
};

/** Function to update the enabled/disabled state of Play/Pause buttons */
export function updatePlayPauseButtons() {
    if (playButton && pauseButton) {
        playButton.disabled = PARAMS.running;
        pauseButton.disabled = !PARAMS.running;
    }
}

/**
 * Updates the visibility of the custom rule folder based on selected rule
 */
function updateCustomRuleFolderVisibility() {
    if (customRuleFolder) {
        customRuleFolder.hidden = PARAMS.rule !== 'custom';
    }
}

/**
 * Toggle compact mode for the UI
 */
function toggleCompactMode() {
    isCompactMode = !isCompactMode;
    
    const container = document.getElementById('tweakpane-container');
    if (container) {
        container.style.width = isCompactMode ? 
            `${UI_CONFIG.compactMode.compactWidth}px` : 
            `${UI_CONFIG.compactMode.normalWidth}px`;
        
        container.style.opacity = isCompactMode ? 
            UI_CONFIG.compactMode.transparency : 
            '1.0';
    }
    
    // Update the button title properly
    if (compactModeBtn) {
        // First remove the old button
        const oldTitle = isCompactMode ? 'Compact Mode' : 'Normal Mode';
        const newTitle = isCompactMode ? 'Normal Mode' : 'Compact Mode';
        
        // In Tweakpane 4.0, we need to update the button's title property
        compactModeBtn.dispose();
        compactModeBtn = pane.addButton({ title: newTitle });
        compactModeBtn.on('click', toggleCompactMode);
    }
}

/**
 * Generate a random rule configuration
 * @param {boolean} balanced - Whether to generate a balanced rule
 * @returns {Object} Random rule configuration
 */
function generateRandomRule(balanced = false) {
    const rule = { ...customRuleParams };
    
    if (balanced) {
        // Balanced rules tend to have complementary turns
        rule.state0Turn = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        rule.state1Turn = -rule.state0Turn;
        rule.state2Turn = Math.floor(Math.random() * 3) - 1;
        rule.state3Turn = -rule.state2Turn;
    } else {
        // Completely random rules
        rule.state0Turn = Math.floor(Math.random() * 5) - 2; // -2 to 2
        rule.state1Turn = Math.floor(Math.random() * 5) - 2;
        rule.state2Turn = Math.floor(Math.random() * 5) - 2;
        rule.state3Turn = Math.floor(Math.random() * 5) - 2;
    }
    
    // Random next states
    rule.state0Next = Math.floor(Math.random() * 4);
    rule.state1Next = Math.floor(Math.random() * 4);
    rule.state2Next = Math.floor(Math.random() * 4);
    rule.state3Next = Math.floor(Math.random() * 4);
    
    return rule;
}

/**
 * Apply a rule preset to the custom rule parameters
 * @param {string} presetName - Name of the preset to apply
 */
function applyRulePreset(presetName) {
    if (rulePresets[presetName]) {
        const preset = rulePresets[presetName];
        Object.keys(preset).forEach(key => {
            customRuleParams[key] = preset[key];
        });
        updateCustomRule();
        if (pane) pane.refresh();
        if (PARAMS.rule === 'custom' && !PARAMS.running) {
            forceFullRedraw();
        }
        console.log(`Applied preset: ${presetName}`);
    } else {
        console.error(`Preset not found: ${presetName}`);
    }
}

/**
 * Save current custom rule configuration with a name
 * @param {string} name - Name to save the rule under
 */
function saveCustomRule(name) {
    if (!name || name.trim() === '') {
        alert('Please enter a name for the rule');
        return;
    }
    
    // Save the current rule configuration
    savedRules[name] = { ...customRuleParams };
    
    // Save to localStorage if available
    try {
        localStorage.setItem('turmite_savedRules', JSON.stringify(savedRules));
    } catch (e) {
        console.warn('Could not save rules to localStorage:', e);
    }
    
    console.log(`Rule saved: ${name}`);
    return name;
}

/**
 * Load a previously saved custom rule configuration
 * @param {string} name - Name of the rule to load
 */
function loadCustomRule(name) {
    if (savedRules[name]) {
        const rule = savedRules[name];
        Object.keys(rule).forEach(key => {
            customRuleParams[key] = rule[key];
        });
        updateCustomRule();
        if (pane) pane.refresh();
        if (PARAMS.rule === 'custom' && !PARAMS.running) {
            forceFullRedraw();
        }
        console.log(`Loaded rule: ${name}`);
    } else {
        console.error(`Rule not found: ${name}`);
    }
}

/**
 * Load saved rules from localStorage
 */
function loadSavedRules() {
    try {
        const storedRules = localStorage.getItem('turmite_savedRules');
        if (storedRules) {
            savedRules = JSON.parse(storedRules);
            console.log(`Loaded ${Object.keys(savedRules).length} saved rules`);
        }
    } catch (e) {
        console.warn('Could not load saved rules from localStorage:', e);
    }
}

/**
 * Calculate metrics for the current rule configuration
 * @returns {Object} Metrics object with characteristics of the rule
 */
function calculateRuleMetrics() {
    const metrics = {
        turnSum: customRuleParams.state0Turn + customRuleParams.state1Turn + 
                customRuleParams.state2Turn + customRuleParams.state3Turn,
        stateVariety: new Set([
            customRuleParams.state0Next, 
            customRuleParams.state1Next, 
            customRuleParams.state2Next, 
            customRuleParams.state3Next
        ]).size,
        patternType: 'Unknown'
    };
    
    // Determine pattern type based on rule characteristics
    if (metrics.turnSum === 0 && metrics.stateVariety >= 3) {
        metrics.patternType = 'Balanced (likely creates bounded patterns)';
    } else if (Math.abs(metrics.turnSum) >= 3) {
        metrics.patternType = 'Spiral-dominant (likely creates expanding spirals)';
    } else if (metrics.stateVariety <= 2) {
        metrics.patternType = 'Limited state (likely creates simple patterns)';
    } else if (customRuleParams.state0Turn === 0 || customRuleParams.state1Turn === 0) {
        metrics.patternType = 'Highway-prone (likely creates long straight paths)';
    } else {
        metrics.patternType = 'Complex (unpredictable behavior)';
    }
    
    return metrics;
}

/**
 * Initializes the Tweakpane UI.
 * @param {object} pixiApp - The PIXI.Application instance (for ticker control).
 * @returns {{pane: object, fileInputElement: HTMLElement} | null} Pane instance and file input, or null.
 */
export function initializeUI(pixiApp) {
    let imageUploadInput = null;
    const container = document.createElement('div');
    container.id = 'tweakpane-container';
    container.style.position = 'absolute';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.width = '320px'; // Fixed width for normal mode
    container.style.zIndex = '1000';
    container.style.transition = 'width 0.3s, opacity 0.3s';
    document.body.appendChild(container);

    // Load saved rules from localStorage
    loadSavedRules();

    try {
        // Create Tweakpane instance using the imported module
        pane = new Pane({ 
            container: container, 
            title: 'Turmite Controls'
        });

    const screenW = screen.width;
    const screenH = screen.height;
        
        // No compact mode - UI will stay in normal mode permanently

    // --- Simulation Control Folder --- //
        const simFolder = pane.addFolder({ 
            title: 'Simulation', 
            expanded: UI_CONFIG.initialExpanded.simulation 
        });

        // Add Custom Rule toggle
        simFolder.addBinding(PARAMS, 'isCustomRule', {
            label: 'Custom Rule',
            tooltip: 'Enable to use custom rule editor'
        }).on('change', (ev) => {
            if (ev.value) {
                // Switch to custom rule mode
                PARAMS.rule = 'custom';
                if (customRuleFolder) {
                    customRuleFolder.hidden = false;
                    customRuleFolder.expanded = true;
                }
            } else {
                // Switch to first available preset rule
                const firstRule = Object.keys(rules).find(rule => rule !== 'custom');
                if (firstRule) {
                    PARAMS.rule = firstRule;
                }
                if (customRuleFolder) {
                    customRuleFolder.hidden = true;
                }
            }
            setActiveRule(PARAMS.rule);
            initializeGrid(PARAMS.pattern, internalGridWidth, internalGridHeight, true);
            if (pane) pane.refresh();
            updatePlayPauseButtons();
        });

        const ruleOptions = Object.keys(rules)
            .filter(name => name !== 'custom')
            .map(name => ({ text: name, value: name }));

        simFolder.addBinding(PARAMS, 'rule', { 
            label: 'Rule', 
            options: ruleOptions,
            tooltip: UI_HELP.rule
        }).on('change', (ev) => {
            // Check if an image is loaded before changing rule
            if (isImageLoaded && lastUploadedImage) {
                // If image is loaded, refresh it with the new rule
                console.log("Rule changed with image loaded - refreshing image with new rule");
                setActiveRule(ev.value);
                // Reprocess the image with the new rule
                if (typeof window.handleImageFile === 'function') {
                    window.handleImageFile(lastUploadedImage, pane);
                }
            } else {
                // Regular rule change for pattern-based simulation
                setActiveRule(ev.value);
                // Reset grid to the pattern associated with the NEW rule
                initializeGrid(PARAMS.pattern, internalGridWidth, internalGridHeight, true);
            }
            
            if (pane) pane.refresh();
            updatePlayPauseButtons();
        });

        // Create playback container for better layout
        const playbackContainer = document.createElement('div');
        playbackContainer.style.display = 'flex';
        playbackContainer.style.justifyContent = 'space-between';
        playbackContainer.style.margin = '4px 0';
        playbackContainer.style.gap = '4px';
        
        // Create buttons with icons/symbols for more compact display
        const playBtnEl = document.createElement('button');
        playBtnEl.innerHTML = '<i class="fa-solid fa-play"></i>';
        playBtnEl.title = 'Play (Space)';
        playBtnEl.style.flex = '1';
        playBtnEl.style.padding = '6px';
        playBtnEl.style.borderRadius = '4px';
        playBtnEl.style.border = '1px solid #555';
        playBtnEl.style.backgroundColor = '#333';
        playBtnEl.style.color = '#0f0';
        playBtnEl.style.cursor = 'pointer';
        playBtnEl.style.transition = 'all 0.2s ease';
        playBtnEl.style.minWidth = '40px';
        playBtnEl.addEventListener('click', () => { 
            PARAMS.running = true; 
            updatePlayPauseButtons(); 
        });
        
        const pauseBtnEl = document.createElement('button');
        pauseBtnEl.innerHTML = '<i class="fa-solid fa-pause"></i>';
        pauseBtnEl.title = 'Pause (Space)';
        pauseBtnEl.style.flex = '1';
        pauseBtnEl.style.padding = '6px';
        pauseBtnEl.style.borderRadius = '4px';
        pauseBtnEl.style.border = '1px solid #555';
        pauseBtnEl.style.backgroundColor = '#333';
        pauseBtnEl.style.color = '#f00';
        pauseBtnEl.style.cursor = 'pointer';
        pauseBtnEl.style.transition = 'all 0.2s ease';
        pauseBtnEl.style.minWidth = '40px';
        pauseBtnEl.addEventListener('click', () => { 
            PARAMS.running = false; 
            updatePlayPauseButtons(); 
        });
        
        const resetBtnEl = document.createElement('button');
        resetBtnEl.innerHTML = '<i class="fa-solid fa-rotate"></i>';
        resetBtnEl.title = 'Reset (R)';
        resetBtnEl.style.flex = '1';
        resetBtnEl.style.padding = '6px';
        resetBtnEl.style.borderRadius = '4px';
        resetBtnEl.style.border = '1px solid #555';
        resetBtnEl.style.backgroundColor = '#333';
        resetBtnEl.style.color = '#0af';
        resetBtnEl.style.cursor = 'pointer';
        resetBtnEl.style.transition = 'all 0.2s ease';
        resetBtnEl.style.minWidth = '40px';
        resetBtnEl.addEventListener('click', () => {
            PARAMS.running = false;
            
            // Check if an image is loaded - if so, refresh the image
            if (lastUploadedImage && typeof window.handleImageFile === 'function') {
                console.log("Image detected - refreshing image...");
                window.handleImageFile(lastUploadedImage, pane);
            } else {
                // Otherwise, just reset the simulation with the current pattern
                console.log("No image detected - resetting simulation...");
                initializeGrid(PARAMS.pattern, internalGridWidth, internalGridHeight, true);
            }
            
            if (pane) pane.refresh();
            updatePlayPauseButtons();
        });

        // Add hover effects
        [playBtnEl, pauseBtnEl, resetBtnEl].forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.backgroundColor = '#444';
                btn.style.transform = 'scale(1.05)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.backgroundColor = '#333';
                btn.style.transform = 'scale(1)';
            });
        });

        playbackContainer.appendChild(playBtnEl);
        playbackContainer.appendChild(pauseBtnEl);
        playbackContainer.appendChild(resetBtnEl);
        
        // Add playback controls to a blade
        const playbackBlade = simFolder.addButton({
            title: 'Playback',
            hidden: true
        });
        
        // Use the parent element
        const playbackBladeParent = playbackBlade.element.parentElement;
        playbackBladeParent.appendChild(playbackContainer);
        
        // Use these elements as our buttons for state tracking
        playButton = playBtnEl;
        pauseButton = pauseBtnEl;

        simFolder.addBinding(PARAMS, 'speed', { 
            label: 'Speed', 
            min: 1, 
            max: 60, 
            step: 1,
            tooltip: 'Controls how many frames are rendered per second (FPS). Higher values make the simulation run faster, but may impact performance.'
        }).on('change', (ev) => {
            if (pixiApp && pixiApp.ticker) {
                pixiApp.ticker.maxFPS = ev.value;
            } else {
                 console.warn("PixiJS App ticker not available to UI speed control.");
            }
        });

    // Add Simulation Steps per Frame slider
        simFolder.addBinding(PARAMS, 'simStepsPerFrame', { 
            label: 'Steps/Frame', 
            min: 1, 
            max: 12, 
            step: 1,
            tooltip: 'Number of turmite steps calculated per frame. Higher values make the turmite move faster, but may cause it to appear to jump between positions.'
        });
            
        // --- Custom Rule Controls Folder --- //
        const tileStateOptions = [
            { text: 'White ⬜', value: STATE_WHITE },
            { text: 'Black ⬛', value: STATE_BLACK },
            { text: 'Gray 🔲', value: STATE_GRAY },
            { text: 'Dark Gray ◼️', value: STATE_DARK_GRAY }
        ];

        customRuleFolder = pane.addFolder({ 
            title: 'Custom Rule Editor', 
            expanded: UI_CONFIG.initialExpanded.customRule && PARAMS.rule === 'custom',
            hidden: PARAMS.rule !== 'custom' // Initially hidden if not using custom rule
        });
        
        // Reorganize custom rule editor for better usability
        // Add tabbed interface: Presets | States | Save/Load
        const customRuleTabs = customRuleFolder.addTab({
            pages: [
                {title: 'Presets', value: 'presets'},
                {title: 'States', value: 'states'},
                {title: 'Save/Load', value: 'saveload'}
            ]
        });
        
        // --- Presets Tab ---
        const presetsPage = customRuleTabs.pages[0];
        
        // Add rule presets dropdown
        const presetOptions = Object.keys(rulePresets).map(name => ({ text: name, value: name }));
        presetsPage.addBinding({ selectedPreset: 'langton' }, 'selectedPreset', {
            label: 'Select Preset',
            options: presetOptions
        }).on('change', (ev) => {
            applyRulePreset(ev.value);
        });
        
        // Add metrics display
        const metricsText = presetsPage.addBinding(metricsObj, 'value', {
            label: 'Rule Analysis',
            readonly: true,
        });
        
        // Add randomize buttons in a more compact layout
        const randomButtonsContainer = document.createElement('div');
        randomButtonsContainer.style.display = 'flex';
        randomButtonsContainer.style.gap = '4px';
        randomButtonsContainer.style.margin = '8px 0';
        
        const randomizeBtn = document.createElement('button');
        randomizeBtn.textContent = 'Random Rule';
        randomizeBtn.style.flex = '1';
        randomizeBtn.addEventListener('click', () => {
            const rule = generateRandomRule(false);
            Object.keys(rule).forEach(key => {
                customRuleParams[key] = rule[key];
            });
            updateCustomRule();
            if (pane) pane.refresh();
            updateMetricsDisplay();
            if (PARAMS.rule === 'custom' && !PARAMS.running) {
                forceFullRedraw();
            }
        });
        
        const balancedRandomBtn = document.createElement('button');
        balancedRandomBtn.textContent = 'Balanced Random';
        balancedRandomBtn.style.flex = '1';
        balancedRandomBtn.addEventListener('click', () => {
            const rule = generateRandomRule(true);
            Object.keys(rule).forEach(key => {
                customRuleParams[key] = rule[key];
            });
            updateCustomRule();
            if (pane) pane.refresh();
            updateMetricsDisplay();
            if (PARAMS.rule === 'custom' && !PARAMS.running) {
                forceFullRedraw();
            }
        });
        
        randomButtonsContainer.appendChild(randomizeBtn);
        randomButtonsContainer.appendChild(balancedRandomBtn);
        
        const randomBlade = presetsPage.addButton({
            title: 'Generate',
            hidden: true
        });
        
        const randomBladeParent = randomBlade.element.parentElement;
        randomBladeParent.appendChild(randomButtonsContainer);
        
        // --- States Tab ---
        const statesPage = customRuleTabs.pages[1];
        
        // Create a tab for all states
        const stateTab = statesPage.addTab({
            pages: [
                {title: '⬜ State 0', value: 0},
                {title: '⬛ State 1', value: 1},
                {title: '🔲 State 2', value: 2},
                {title: '◼️ State 3', value: 3},
            ]
        });
        
        // Simplified state pages with better layout
        const setupStatePage = (page, stateNum) => {
            // Create container for state info with color indicator
            const stateInfoContainer = document.createElement('div');
            stateInfoContainer.style.display = 'flex';
            stateInfoContainer.style.alignItems = 'center';
            stateInfoContainer.style.marginBottom = '12px';
            stateInfoContainer.style.padding = '8px';
            stateInfoContainer.style.backgroundColor = '#2a2a2a';
            stateInfoContainer.style.borderRadius = '4px';
            
            // Color indicator 
            const colorIndicator = document.createElement('div');
            colorIndicator.style.width = '24px';
            colorIndicator.style.height = '24px';
            colorIndicator.style.backgroundColor = stateColors[stateNum];
            colorIndicator.style.border = '1px solid #555';
            colorIndicator.style.borderRadius = '4px';
            colorIndicator.style.marginRight = '12px';
            
            // State description
            const stateDesc = document.createElement('div');
            const stateNames = ['White', 'Black', 'Gray', 'Dark Gray'];
            stateDesc.textContent = `${stateNames[stateNum]} State`;
            stateDesc.style.fontSize = '0.9em';
            stateDesc.style.color = '#ddd';
            
            stateInfoContainer.appendChild(colorIndicator);
            stateInfoContainer.appendChild(stateDesc);
            
            const infoBlade = page.addButton({
                title: ' ',
                hidden: true
            });
            
            const infoBladeParent = infoBlade.element.parentElement;
            infoBladeParent.appendChild(stateInfoContainer);
            
            // Turn control with visual indicator
            const turnContainer = document.createElement('div');
            turnContainer.style.marginBottom = '16px';
            
            const turnLabel = document.createElement('div');
            turnLabel.textContent = 'Turn Direction';
            turnLabel.style.marginBottom = '8px';
            turnLabel.style.color = '#bbb';
            turnLabel.style.fontSize = '0.9em';
            
            const turnVisual = document.createElement('div');
            turnVisual.style.display = 'flex';
            turnVisual.style.alignItems = 'center';
            turnVisual.style.justifyContent = 'space-between';
            turnVisual.style.padding = '4px';
            turnVisual.style.backgroundColor = '#222';
            turnVisual.style.borderRadius = '4px';
            turnVisual.style.marginBottom = '8px';
            
            const directions = [
                { value: -2, label: '⟲⟲', tooltip: 'Sharp Right (90°)' },
                { value: -1, label: '⟲', tooltip: 'Right (45°)' },
                { value: 0, label: '⟶', tooltip: 'Straight' },
                { value: 1, label: '⟳', tooltip: 'Left (45°)' },
                { value: 2, label: '⟳⟳', tooltip: 'Sharp Left (90°)' }
            ];
            
            directions.forEach(dir => {
                const dirBtn = document.createElement('button');
                dirBtn.textContent = dir.label;
                dirBtn.title = dir.tooltip;
                dirBtn.style.padding = '4px 8px';
                dirBtn.style.border = '1px solid #444';
                dirBtn.style.borderRadius = '3px';
                dirBtn.style.backgroundColor = '#333';
                dirBtn.style.color = '#bbb';
                dirBtn.style.cursor = 'pointer';
                dirBtn.style.transition = 'all 0.2s ease';
                
                // Update visual state based on current value
                const updateButtonState = () => {
                    if (customRuleParams[`state${stateNum}Turn`] === dir.value) {
                        dirBtn.style.backgroundColor = '#555';
                        dirBtn.style.color = '#fff';
                        dirBtn.style.borderColor = '#666';
                    } else {
                        dirBtn.style.backgroundColor = '#333';
                        dirBtn.style.color = '#bbb';
                        dirBtn.style.borderColor = '#444';
                    }
                };
                
                dirBtn.addEventListener('click', () => {
                    customRuleParams[`state${stateNum}Turn`] = dir.value;
                    updateCustomRule();
                    updateMetricsDisplay();
                    if (PARAMS.rule === 'custom' && !PARAMS.running) {
                        forceFullRedraw();
                    }
                    // Update all buttons
                    turnVisual.querySelectorAll('button').forEach(btn => {
                        const value = parseInt(btn.dataset.value);
                        if (value === dir.value) {
                            btn.style.backgroundColor = '#555';
                            btn.style.color = '#fff';
                            btn.style.borderColor = '#666';
                        } else {
                            btn.style.backgroundColor = '#333';
                            btn.style.color = '#bbb';
                            btn.style.borderColor = '#444';
                        }
                    });
                });
                
                dirBtn.addEventListener('mouseenter', () => {
                    if (customRuleParams[`state${stateNum}Turn`] !== dir.value) {
                        dirBtn.style.backgroundColor = '#444';
                    }
                });
                
                dirBtn.addEventListener('mouseleave', () => {
                    if (customRuleParams[`state${stateNum}Turn`] !== dir.value) {
                        dirBtn.style.backgroundColor = '#333';
                    }
                });
                
                dirBtn.dataset.value = dir.value;
                updateButtonState();
                turnVisual.appendChild(dirBtn);
            });
            
            turnContainer.appendChild(turnLabel);
            turnContainer.appendChild(turnVisual);
            
            const turnBlade = page.addButton({
                title: ' ',
                hidden: true
            });
            
            const turnBladeParent = turnBlade.element.parentElement;
            turnBladeParent.appendChild(turnContainer);
            
            // Next state dropdown with color preview
            const nextStateContainer = document.createElement('div');
            nextStateContainer.style.marginBottom = '16px';
            
            const nextStateLabel = document.createElement('div');
            nextStateLabel.textContent = 'Next State';
            nextStateLabel.style.marginBottom = '8px';
            nextStateLabel.style.color = '#bbb';
            nextStateLabel.style.fontSize = '0.9em';
            
            nextStateContainer.appendChild(nextStateLabel);
            
            // Add the binding after the custom label
            page.addBinding(customRuleParams, `state${stateNum}Next`, {
                options: tileStateOptions
            }).on('change', () => {
                updateCustomRule();
                updateMetricsDisplay();
                if (PARAMS.rule === 'custom' && !PARAMS.running) {
                    forceFullRedraw();
                }
            });
        };
        
        // Setup each state tab
        setupStatePage(stateTab.pages[0], 0);
        setupStatePage(stateTab.pages[1], 1);
        setupStatePage(stateTab.pages[2], 2);
        setupStatePage(stateTab.pages[3], 3);
        
        // --- Save/Load Tab ---
        const saveLoadPage = customRuleTabs.pages[2];
        
        // Create a variable to track the rule name
        let ruleNameObj = { name: '' };
        
        saveLoadPage.addBinding(ruleNameObj, 'name', {
            label: 'Rule Name'
        });
        
        const saveRuleBtn = saveLoadPage.addButton({ title: 'Save Rule' });
        saveRuleBtn.on('click', () => {
            // Get the name directly from our tracked object
            const name = ruleNameObj.name.trim();
            console.log("Attempting to save rule with name:", name);
            
            if (name) {
                saveCustomRule(name);
                // Reset input
                ruleNameObj.name = '';
                if (pane) pane.refresh();
                
                // Refresh saved rule dropdown if it exists
                if (savedRuleDropdown) {
                    const options = Object.keys(savedRules).map(name => ({ text: name, value: name }));
                    savedRuleDropdown.options = options;
                    console.log("Updated saved rules dropdown with options:", options);
                } else {
                    // If we didn't have a dropdown before but now we have saved rules, add one
                    if (Object.keys(savedRules).length > 0) {
                        console.log("Creating new saved rules dropdown");
                        const options = Object.keys(savedRules).map(name => ({ text: name, value: name }));
                        savedRuleDropdown = saveLoadPage.addBinding({
                            savedRule: options[0].value
                        }, 'savedRule', {
                            label: 'Saved Rules',
                            options: options
                        });
                        
                        const loadRuleBtn = saveLoadPage.addButton({ title: 'Load Selected Rule' });
                        loadRuleBtn.on('click', () => {
                            loadCustomRule(savedRuleDropdown.savedRule);
                            updateMetricsDisplay();
                        });
                    }
                }
            } else {
                alert('Please enter a name for your rule');
            }
        });
        
        // Add saved rules dropdown if there are any
        let savedRuleDropdown;
        if (Object.keys(savedRules).length > 0) {
            const options = Object.keys(savedRules).map(name => ({ text: name, value: name }));
            savedRuleDropdown = saveLoadPage.addBinding({
                savedRule: options[0].value
            }, 'savedRule', {
                label: 'Saved Rules',
                options: options
            });
            
            const loadRuleBtn = saveLoadPage.addButton({ title: 'Load Selected Rule' });
            loadRuleBtn.on('click', () => {
                loadCustomRule(savedRuleDropdown.savedRule);
                updateMetricsDisplay();
            });
        }
        
        // Function to update metrics display
        function updateMetricsDisplay() {
            const metrics = calculateRuleMetrics();
            metricsObj.value = `Pattern: ${metrics.patternType}\nTurn Balance: ${metrics.turnSum}\nState Variety: ${metrics.stateVariety}/4`;
        }
        
        // Initialize metrics display
        updateMetricsDisplay();

        // --- Image Controls Folder --- //
        const imageFolder = pane.addFolder({ 
            title: 'Image', 
            expanded: UI_CONFIG.initialExpanded.image 
        });

    // Add Image Upload Button (Standard HTML Input)
    if (true) {
            const buttonContainer = document.createElement('div');
            buttonContainer.style.padding = '4px 8px';
            const buttonLabel = document.createElement('div');
            buttonLabel.innerHTML = '<i class="fa-solid fa-upload"></i> Upload Image:'; 
            buttonLabel.style.marginBottom = '8px';
            buttonLabel.style.color = '#b0b0b0'; 
            buttonLabel.style.fontSize = '0.9em';
            buttonLabel.style.display = 'flex';
            buttonLabel.style.alignItems = 'center';
            buttonLabel.style.gap = '8px';

            // Create a custom-styled file input
            const fileInputContainer = document.createElement('div');
            fileInputContainer.style.position = 'relative';
            fileInputContainer.style.overflow = 'hidden';
            fileInputContainer.style.display = 'inline-block';
            fileInputContainer.style.width = '100%';
            
            // The actual file input (hidden but functional)
            imageUploadInput = document.createElement('input');
            imageUploadInput.setAttribute('type', 'file');
            imageUploadInput.setAttribute('accept', 'image/*');
            imageUploadInput.style.position = 'absolute';
            imageUploadInput.style.fontSize = '100px';
            imageUploadInput.style.opacity = '0';
            imageUploadInput.style.right = '0';
            imageUploadInput.style.top = '0';
            imageUploadInput.style.cursor = 'pointer';
            
            // The visible custom button
            const customButton = document.createElement('button');
            customButton.innerHTML = '<i class="fa-solid fa-file-image"></i> Choose Image';
            customButton.style.backgroundColor = '#555';
            customButton.style.color = 'white';
            customButton.style.padding = '8px 12px';
            customButton.style.borderRadius = '4px';
            customButton.style.border = 'none';
            customButton.style.width = '100%';
            customButton.style.cursor = 'pointer';
            customButton.style.display = 'flex';
            customButton.style.alignItems = 'center';
            customButton.style.justifyContent = 'center';
            customButton.style.gap = '8px';
            
            fileInputContainer.appendChild(customButton);
            fileInputContainer.appendChild(imageUploadInput);

            buttonContainer.appendChild(buttonLabel);
            buttonContainer.appendChild(fileInputContainer);
            
            // Add to the Image folder
            const folderElement = imageFolder.element.querySelector('.tp-fldv_c');
            if (folderElement) {
                folderElement.appendChild(buttonContainer);
            } else {
                console.warn("Could not find folder content element");
                imageFolder.element.appendChild(buttonContainer);
            }
        }

        // --- Appearance Folder --- //
        const appearanceFolder = pane.addFolder({ 
            title: 'Appearance', 
            expanded: UI_CONFIG.initialExpanded.appearance 
        });

        // Add Palette Selector
        const paletteOptions = Object.keys(palettes).map(name => ({ text: name, value: name }));
        appearanceFolder.addBinding(PARAMS, 'palette', { 
            label: 'Color Palette', 
            options: paletteOptions,
            tooltip: UI_HELP.palette
        }).on('change', (ev) => {
            console.log(`Palette changed to: ${ev.value}`);
            if (typeof forceFullRedraw === 'function') {
                forceFullRedraw();
            }
        });

    // Add Turmite Size/Step Dropdown
    const turmiteSizeOptions = [
        { text: '1x', value: 1 },
        { text: '2x', value: 2 },
        { text: '4x', value: 4 },
        { text: '8x', value: 8 },
        { text: '16x', value: 16 },
        { text: '32x', value: 32 },
    ];
        appearanceFolder.addBinding(PARAMS, 'turmiteStepSize', { 
            label: 'Turmite Size', 
            options: turmiteSizeOptions,
            tooltip: UI_HELP.turmiteSize
        }).on('change', (ev) => {
            if (!PARAMS.running) {
                if (typeof forceFullRedraw === 'function') forceFullRedraw();
                else console.error("forceFullRedraw not available to UI.");
            }
        });

        // --- View Controls --- //
        const viewFolder = pane.addFolder({
            title: 'View',
            expanded: true,
        });

        viewFolder.addBinding(PARAMS, 'zoom', {
            min: 0.1,
            max: 5,
            step: 0.1,
            title: 'Adjust the zoom level of the canvas'
        });

        viewFolder.addBinding(PARAMS, 'followTurmite', {
            label: 'Follow Turmite',
            title: 'Camera follows the turmite as it moves'
        });

        viewFolder.addBinding(PARAMS, 'invertImage', {
            label: 'Invert Image',
            title: 'Invert colors when loading images'
        });

        // Add separator before canvas size controls
        viewFolder.addBlade({
            view: 'separator',
        }).element.parentElement.style.marginTop = '10px';

        // Add a hidden button to create a container for canvas size
        const canvasSizeBlade = viewFolder.addButton({
            title: 'Canvas Size',
            hidden: true
        });

        // Canvas Size Controls
        const canvasSizeContainer = document.createElement('div');
        canvasSizeContainer.style.display = 'grid';
        canvasSizeContainer.style.gridTemplateColumns = 'auto 1fr auto';
        canvasSizeContainer.style.gridTemplateRows = 'auto auto';
        canvasSizeContainer.style.rowGap = '10px';
        canvasSizeContainer.style.columnGap = '8px';
        canvasSizeContainer.style.width = '100%';
        canvasSizeContainer.style.marginTop = '8px';
        canvasSizeContainer.style.marginBottom = '8px';

        const widthLabel = document.createElement('div');
        widthLabel.textContent = 'W:';
        widthLabel.style.padding = '10px';

        const widthInput = document.createElement('input');
        widthInput.type = 'number';
        widthInput.value = PARAMS.canvasWidth;
        widthInput.min = '100';
        widthInput.max = '2000';
        widthInput.style.width = '100%';
        widthInput.style.boxSizing = 'border-box';
        widthInput.style.backgroundColor = '#2a2a2a';
        widthInput.style.color = '#fff';
        widthInput.style.border = '1px solid #555';
        widthInput.style.borderRadius = '2px';
        widthInput.style.padding = '8px';

        widthInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (value < 100) value = 100;
            if (value > 2000) value = 2000;
            PARAMS.canvasWidth = value;
        });

        const heightLabel = document.createElement('div');
        heightLabel.textContent = 'H:';
        heightLabel.style.padding = '10px';

        const heightInput = document.createElement('input');
        heightInput.type = 'number';
        heightInput.value = PARAMS.canvasHeight;
        heightInput.min = '100';
        heightInput.max = '2000';
        heightInput.style.width = '100%';
        heightInput.style.boxSizing = 'border-box';
        heightInput.style.backgroundColor = '#2a2a2a';
        heightInput.style.color = '#fff';
        heightInput.style.border = '1px solid #555';
        heightInput.style.borderRadius = '2px';
        heightInput.style.padding = '8px';

        heightInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (value < 100) value = 100;
            if (value > 2000) value = 2000;
            PARAMS.canvasHeight = value;
        });

        const applyButton = document.createElement('button');
        applyButton.textContent = 'Apply';
        applyButton.style.height = '90%';
        applyButton.style.width = '80px';
        applyButton.style.backgroundColor = '#444';
        applyButton.style.color = '#fff';
        applyButton.style.border = '1px solid #555';
        applyButton.style.borderRadius = '2px';
        applyButton.style.fontSize = '12px';
        applyButton.style.cursor = 'pointer';
        applyButton.style.transition = 'background-color 0.2s';

        applyButton.addEventListener('mouseenter', () => {
            applyButton.style.backgroundColor = '#555';
        });

        applyButton.addEventListener('mouseleave', () => {
            applyButton.style.backgroundColor = '#444';
        });

        applyButton.addEventListener('click', () => {
            if (typeof applyCanvasSize === 'function') {
                applyCanvasSize();
                pane.refresh();
                updatePlayPauseButtons();
            }
        });

        applyButton.style.gridRow = '1 / span 2';

        canvasSizeContainer.appendChild(widthLabel);
        canvasSizeContainer.appendChild(widthInput);
        canvasSizeContainer.appendChild(applyButton);
        canvasSizeContainer.appendChild(heightLabel);
        canvasSizeContainer.appendChild(heightInput);

        // Add the container to the parent of the hidden button
        canvasSizeBlade.element.parentElement.appendChild(canvasSizeContainer);

        // Add another separator after canvas size controls
        viewFolder.addBlade({
            view: 'separator',
        });

        // --- Add Utility Folder --- //
        const utilityFolder = pane.addFolder({ 
            title: 'Tools', 
            expanded: true // Always show tools section
        });
        
        // Add Copy Frame button with shortest possible text
        const copyBtn = utilityFolder.addButton({ title: 'Copy' });
    copyBtn.on('click', async () => {
            // Get the button element (different in Tweakpane 4.x)
            let btnEl = copyBtn.element.querySelector('button') || copyBtn.element;
            if (btnEl) btnEl.textContent = 'Copying...';
            
        try {
            if (typeof copyCanvasToClipboard === 'function') {
                await copyCanvasToClipboard();
                    if (btnEl) btnEl.textContent = 'Copied!';
            } else {
                console.error("copyCanvasToClipboard function not available.");
                    if (btnEl) btnEl.textContent = 'Error!';
            }
        } catch (err) {
            console.error('Failed to copy frame:', err);
                if (btnEl) btnEl.textContent = 'Error!';
            alert(`Failed to copy image: ${err.message}. Browser might not support clipboard access or requires HTTPS.`);
        }
        // Reset button text after a delay
        setTimeout(() => {
                if (btnEl) btnEl.textContent = 'Copy';
        }, 1500);
    });
        
        // Using minimal styling to avoid conflicts with Tweakpane's built-in styles
        setTimeout(() => {
            if (copyBtn.element && copyBtn.element.querySelector('button')) {
                const btnEl = copyBtn.element.querySelector('button');
                // Reset any styles that might be causing issues
                btnEl.style = '';
                // Apply only essential styles
                btnEl.style.cursor = 'pointer';
            }
        }, 100);

    console.log("Tweakpane UI Initialized");
    updatePlayPauseButtons();
        updateCustomRuleFolderVisibility();
    return { pane, fileInputElement: imageUploadInput };
    } catch (error) {
        console.error("Error initializing Tweakpane UI:", error);
        // Return container element to DOM in case of error
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        alert("There was a problem loading the UI controls: " + error.message);
        return null;
    }
}

// Store the last uploaded image for refresh functionality
export function setLastUploadedImage(imageFile) {
    lastUploadedImage = imageFile;
}
