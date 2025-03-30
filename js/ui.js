// Switch between manual and auto-detect tabs
function switchTab(tab) {
    if (tab === 'manual') {
        manualTab.classList.add('active');
        autoTab.classList.remove('active');
        manualContent.style.display = 'block';
        autoContent.style.display = 'none';
    } else {
        manualTab.classList.remove('active');
        autoTab.classList.add('active');
        manualContent.style.display = 'none';
        autoContent.style.display = 'block';
    }
}

// Update command display
function updateCommandDisplay() {
    const numbersStr = numbersInput.value.trim();
    if (numbersStr) {
        commandDisplay.textContent = `./push_swap ${numbersStr} > log.txt`;
    } else {
        commandDisplay.textContent = "# Command will appear here";
    }
}

// Copy command to clipboard
function copyCommand() {
    const command = commandDisplay.textContent;
    if (command && command !== "# Command will appear here") {
        // Créer un élément temporaire
        const tempElement = document.createElement('textarea');
        tempElement.value = command;
        document.body.appendChild(tempElement);
        tempElement.select();
        
        try {
            const success = document.execCommand('copy');
            if (success) {
                // Visual feedback for copy
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            } else {
                alert('Failed to copy to clipboard. Please copy manually.');
            }
        } catch (err) {
            console.error('Could not copy text: ', err);
            alert('Failed to copy to clipboard. Please copy manually.');
        }
        
        // Nettoyer
        document.body.removeChild(tempElement);
    }
}

// Load data from inputs
function loadData() {
    const numbersStr = numbersInput.value.trim();
    const operationsStr = operationsInput.value.trim();
    
    if (!numbersStr) {
        alert('Please enter some numbers.');
        return;
    }
    
    // Parse numbers
    const numbers = numbersStr.split(/\s+/).map(n => parseInt(n, 10));
    
    // Check for invalid numbers
    if (numbers.some(isNaN)) {
        alert('Invalid numbers found. Please enter valid integers.');
        return;
    }
    
    // Initialize stacks
    stackA = [...numbers];
    stackB = [];
    
    // Parse operations
    operations = operationsStr ? operationsStr.split(/\s+|\n+/).filter(op => op.trim()) : [];
    
    // Reset current step
    currentStep = -1;
    
    // Update UI
    updateOperationsDisplay();
    updateStats();
    updateCommandDisplay();
    statusDisplay.textContent = '';
    
    // Redraw
    draw();
}

// Load data from auto-detect tab
function loadAutoData() {
    const operationsStr = autoOperationsInput.value.trim();
    
    if (!operationsStr) {
        alert('Please paste the output from your push_swap program.');
        return;
    }
    
    // Parse operations
    operations = operationsStr.split(/\s+|\n+/).filter(op => op.trim());
    
    // Check if any valid operations were found
    if (operations.length === 0) {
        alert('No valid operations found.');
        return;
    }
    
    // Use the current numbers or generate random ones if none
    if (stackA.length === 0) {
        const count = parseInt(countInput.value, 10) || 10;
        generateRandomNumbers(count);
    }
    
    // Reset current step
    currentStep = -1;
    
    // Update UI
    updateOperationsDisplay();
    updateStats();
    statusDisplay.textContent = '';
    
    // Redraw
    draw();
}

// Clear input data
function clearData() {
    numbersInput.value = '';
    operationsInput.value = '';
    autoOperationsInput.value = '';
    stackA = [];
    stackB = [];
    operations = [];
    currentStep = -1;
    
    updateOperationsDisplay();
    updateStats();
    updateCommandDisplay(); // Update the command display
    statusDisplay.textContent = '';
    
    draw();
}

// Generate random numbers and shuffle them
function shuffleNumbers() {
    const count = parseInt(countInput.value, 10) || 10;
    generateRandomNumbers(count);
    
    // Update numbers input
    numbersInput.value = stackA.join(' ');
    
    // Reset operations
    operations = [];
    operationsInput.value = '';
    autoOperationsInput.value = '';
    currentStep = -1;
    
    updateOperationsDisplay();
    updateStats();
    updateCommandDisplay(); // Update the command display
    statusDisplay.textContent = '';
    
    draw();
}

// Generate random numbers
function generateRandomNumbers(count) {
    // Generate sequential numbers
    const numbers = Array.from({ length: count }, (_, i) => i + 1);
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
	stackA = numbers;
    stackB = [];
    
    // Update the command display
    updateCommandDisplay();
}

// Update operations display
function updateOperationsDisplay() {
    operationsDisplay.innerHTML = '';
    
    operations.forEach((op, index) => {
        const opElement = document.createElement('div');
        opElement.textContent = op;
        opElement.classList.add('operation');
        
        if (index <= currentStep) {
            opElement.classList.add('highlighted');
        }
        
        operationsDisplay.appendChild(opElement);
    });
    
    // Scroll to the current operation
    if (currentStep >= 0 && currentStep < operations.length) {
        const highlightedOps = operationsDisplay.querySelectorAll('.highlighted');
        if (highlightedOps.length > 0) {
            const lastHighlighted = highlightedOps[highlightedOps.length - 1];
            lastHighlighted.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    opCount.textContent = operations.length;
}

// Update statistics
function updateStats() {
    // Count operations by type
    const counts = {
        sa: 0, sb: 0, ss: 0,
        pa: 0, pb: 0,
        ra: 0, rb: 0, rr: 0,
        rra: 0, rrb: 0, rrr: 0
    };
    
    operations.forEach(op => {
        if (counts[op] !== undefined) {
            counts[op]++;
        }
    });
    
    // Update counts in UI
    for (const [op, count] of Object.entries(counts)) {
        if (opBreakdown[op]) {
            const percentage = operations.length > 0 ? ((count / operations.length) * 100).toFixed(1) : '0';
            opBreakdown[op].textContent = `${count} (${percentage}%)`;
        }
    }
    
    // Update total operations
    totalOps.textContent = operations.length;
    maxStepsDisplay.textContent = operations.length;
    currentStepDisplay.textContent = currentStep + 1;
    
    // Update stack counts
    stackACount.textContent = stackA.length;
    stackBCount.textContent = stackB.length;
    
    // Check if the stack is sorted
    if (isSorted(stackA) && stackB.length === 0) {
        statusDisplay.textContent = '[OK]';
        statusDisplay.style.color = 'var(--success-color)';
    } else if (currentStep >= operations.length - 1 && operations.length > 0) {
        statusDisplay.textContent = '[KO]';
        statusDisplay.style.color = '#ef4444';
    } else {
        statusDisplay.textContent = '';
    }
}

// Start animation
function startAnimation() {
    if (operations.length === 0) {
        alert('No operations to animate.');
        return;
    }
    
    config.isPlaying = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    playPauseBtn.textContent = '⏸';
    
    animateNextStep();
}

// Pause animation
function pauseAnimation() {
    config.isPlaying = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    playPauseBtn.textContent = '▶';
    
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
}

// Toggle play/pause
function togglePlayPause() {
    if (config.isPlaying) {
        pauseAnimation();
    } else {
        startAnimation();
    }
}

// Update speed
function updateSpeed() {
    config.animationSpeed = parseInt(speedSlider.value, 10);
    speedValue.textContent = config.animationSpeed;
}