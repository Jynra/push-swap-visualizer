// Configuration
const config = {
    animationSpeed: 20, // operations per second
    viewMode: 'horizontal',
    isPlaying: false,
    colorPalette: {
        stackA: ['#4ade80', '#22c55e'],
        stackB: ['#60a5fa', '#3b82f6']
    }
};

// State
let stackA = [];
let stackB = [];
let operations = [];
let currentStep = -1;
let animationTimer = null;

// DOM Elements
const canvas = document.getElementById('visualization-canvas');
const ctx = canvas.getContext('2d');

const numbersInput = document.getElementById('numbers');
const operationsInput = document.getElementById('operations');
const autoOperationsInput = document.getElementById('auto-operations');
const countInput = document.getElementById('count');

const loadBtn = document.getElementById('load-btn');
const clearBtn = document.getElementById('clear-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const autoLoadBtn = document.getElementById('auto-load-btn');

const manualTab = document.getElementById('manual-tab');
const autoTab = document.getElementById('auto-tab');
const manualContent = document.getElementById('manual-content');
const autoContent = document.getElementById('auto-content');

const resetBtn = document.getElementById('reset-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const playPauseBtn = document.getElementById('play-pause');

const stepStartBtn = document.getElementById('step-start');
const stepPrevBtn = document.getElementById('step-prev');
const stepNextBtn = document.getElementById('step-next');
const stepEndBtn = document.getElementById('step-end');

const speedSlider = document.getElementById('speed-slider');
const speedValue = document.getElementById('speed-value');

const operationsDisplay = document.getElementById('operations-display');
const opCount = document.getElementById('op-count');
const statusDisplay = document.getElementById('status');

const stackACount = document.getElementById('stack-a-count');
const stackBCount = document.getElementById('stack-b-count');

const totalOps = document.getElementById('total-ops');
const currentStepDisplay = document.getElementById('current-step');
const maxStepsDisplay = document.getElementById('max-steps');
const commandDisplay = document.getElementById('command-display');
const copyBtn = document.getElementById('copy-btn');

const importTxtBtn = document.getElementById('import-txt-btn');
const operationFile = document.getElementById('operation-file');

const autoImportTxtBtn = document.getElementById('auto-import-txt-btn');

// Operation count elements
const opBreakdown = {
    sa: document.getElementById('sa-count'),
    sb: document.getElementById('sb-count'),
    ss: document.getElementById('ss-count'),
    pa: document.getElementById('pa-count'),
    pb: document.getElementById('pb-count'),
    ra: document.getElementById('ra-count'),
    rb: document.getElementById('rb-count'),
    rr: document.getElementById('rr-count'),
    rra: document.getElementById('rra-count'),
    rrb: document.getElementById('rrb-count'),
    rrr: document.getElementById('rrr-count')
};

// Initialize
function init() {
    // Resize canvas for high DPI displays
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Set up event listeners
    loadBtn.addEventListener('click', loadData);
    clearBtn.addEventListener('click', clearData);
    shuffleBtn.addEventListener('click', shuffleNumbers);
    autoLoadBtn.addEventListener('click', loadAutoData);
    copyBtn.addEventListener('click', copyCommand);
    
    manualTab.addEventListener('click', () => switchTab('manual'));
    autoTab.addEventListener('click', () => switchTab('auto'));
    
    resetBtn.addEventListener('click', resetVisualization);
    startBtn.addEventListener('click', startAnimation);
    pauseBtn.addEventListener('click', pauseAnimation);
    playPauseBtn.addEventListener('click', togglePlayPause);
    
    stepStartBtn.addEventListener('click', () => goToStep(0));
    stepPrevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    stepNextBtn.addEventListener('click', () => goToStep(currentStep + 1));
    stepEndBtn.addEventListener('click', () => goToStep(operations.length));
    
    speedSlider.addEventListener('input', updateSpeed);
    
    // Add event listener for the numbers input to update the command
    numbersInput.addEventListener('input', updateCommandDisplay);

    // Add event import button
    // Configuration du bouton Import TXT
    importTxtBtn.addEventListener('click', () => operationFile.click());
    operationFile.addEventListener('change', e => {
        if (manualTab.classList.contains('active')) {
            handleFileImport(e);
        } else if (autoTab.classList.contains('active')) {
            handleAutoFileImport(e);
        }
    });

    // Configuration drag-and-drop
    importTxtBtn.addEventListener('dragover', e => {
        e.preventDefault();
        e.stopPropagation();
        importTxtBtn.style.backgroundColor = '#7a75ef';
    });

    importTxtBtn.addEventListener('dragleave', e => {
        e.preventDefault();
        e.stopPropagation();
        importTxtBtn.style.backgroundColor = '';
    });

    importTxtBtn.addEventListener('drop', handleDrop);

    // Configuration du bouton Import TXT dans l'onglet Auto-detect
    autoImportTxtBtn.addEventListener('click', () => operationFile.click());

    // Configuration drag-and-drop pour l'onglet Auto-detect
    autoImportTxtBtn.addEventListener('dragover', e => {
        e.preventDefault();
        e.stopPropagation();
        autoImportTxtBtn.style.backgroundColor = '#7a75ef';
    });

    autoImportTxtBtn.addEventListener('dragleave', e => {
        e.preventDefault();
        e.stopPropagation();
        autoImportTxtBtn.style.backgroundColor = '';
    });

    autoImportTxtBtn.addEventListener('drop', handleAutoImportDrop);
    
    // Load example data
    loadData();
}

// Initialize the application
window.addEventListener('load', init);