// Execute a single operation
function executeOperation(op) {
    switch (op) {
        case 'sa':
            if (stackA.length >= 2) {
                [stackA[0], stackA[1]] = [stackA[1], stackA[0]];
            }
            break;
            
        case 'sb':
            if (stackB.length >= 2) {
                [stackB[0], stackB[1]] = [stackB[1], stackB[0]];
            }
            break;
            
        case 'ss':
            if (stackA.length >= 2) {
                [stackA[0], stackA[1]] = [stackA[1], stackA[0]];
            }
            if (stackB.length >= 2) {
                [stackB[0], stackB[1]] = [stackB[1], stackB[0]];
            }
            break;
            
        case 'pa':
            if (stackB.length > 0) {
                stackA.unshift(stackB.shift());
            }
            break;
            
        case 'pb':
            if (stackA.length > 0) {
                stackB.unshift(stackA.shift());
            }
            break;
            
        case 'ra':
            if (stackA.length > 0) {
                stackA.push(stackA.shift());
            }
            break;
            
        case 'rb':
            if (stackB.length > 0) {
                stackB.push(stackB.shift());
            }
            break;
            
        case 'rr':
            if (stackA.length > 0) {
                stackA.push(stackA.shift());
            }
            if (stackB.length > 0) {
                stackB.push(stackB.shift());
            }
            break;
            
        case 'rra':
            if (stackA.length > 0) {
                stackA.unshift(stackA.pop());
            }
            break;
            
        case 'rrb':
            if (stackB.length > 0) {
                stackB.unshift(stackB.pop());
            }
            break;
            
        case 'rrr':
            if (stackA.length > 0) {
                stackA.unshift(stackA.pop());
            }
            if (stackB.length > 0) {
                stackB.unshift(stackB.pop());
            }
            break;
            
        default:
            console.warn(`Unknown operation: ${op}`);
    }
}

// Check if an array is sorted
function isSorted(arr) {
    if (arr.length <= 1) return true;
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i-1]) return false;
    }
    
    return true;
}

// Animate the next step
function animateNextStep() {
    if (!config.isPlaying || currentStep >= operations.length - 1) {
        config.isPlaying = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        playPauseBtn.textContent = '▶';
        return;
    }
    
    // Execute the next operation
    currentStep++;
    executeOperation(operations[currentStep]);
    
    // Update UI
    updateOperationsDisplay();
    updateStats();
    draw();
    
    // Schedule the next step
    const delay = 1000 / config.animationSpeed;
    animationTimer = setTimeout(animateNextStep, delay);
}

// Reset visualization
function resetVisualization() {
    // Stop animation if running
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
    
    // Reset stacks to initial state
    const initialNumbers = numbersInput.value.trim().split(/\s+/).map(n => parseInt(n, 10));
    if (initialNumbers.some(isNaN)) {
        alert('Invalid numbers in the input field.');
        return;
    }
    
    stackA = [...initialNumbers];
    stackB = [];
    currentStep = -1;
    
    // Update UI
    updateOperationsDisplay();
    updateStats();
    
    // Reset animation controls
    config.isPlaying = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    playPauseBtn.textContent = '▶';
    
    // Redraw
    draw();
}

// Go to a specific step
function goToStep(step) {
    // Stop animation if running
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
        config.isPlaying = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        playPauseBtn.textContent = '▶';
    }
    
    // Validate step
    if (step < 0) step = 0;
    if (step > operations.length) step = operations.length;
    
    // Reset to initial state
    const initialNumbers = numbersInput.value.trim().split(/\s+/).map(n => parseInt(n, 10));
    if (initialNumbers.some(isNaN)) {
        alert('Invalid numbers in the input field.');
        return;
    }
    
    stackA = [...initialNumbers];
    stackB = [];
    
    // Execute operations up to the desired step
    for (let i = 0; i < step; i++) {
        executeOperation(operations[i]);
    }
    
    currentStep = step - 1;
    
    // Update UI
    updateOperationsDisplay();
    updateStats();
    
    // Redraw
    draw();
}