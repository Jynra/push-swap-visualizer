// Resize canvas for high DPI displays
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    draw();
}

// Draw the visualization
function draw() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value for scaling
    const allValues = [...stackA, ...stackB];
    const maxValue = allValues.length > 0 ? Math.max(...allValues) : 1;
    
    drawVertical(width, height, maxValue);
}

// Draw horizontal view
function drawHorizontal(width, height, maxValue) {
    // Calculate dimensions
    const padding = 40;
    const maxBarHeight = 20;
    const spacing = 5;
    
    // Find the max value for scaling
    const allNumbers = [...stackA, ...stackB];
    const max = allNumbers.length > 0 ? Math.max(...allNumbers) : 1;
    
    // Set up display areas
    const stackAWidth = width / 2 - padding * 2;
    const stackBWidth = width / 2 - padding * 2;
    
    // Draw stack info
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'var(--text-color)';
    ctx.textAlign = 'left';
    ctx.fillText(`Stack A = [${stackA.length}]`, padding, 30);
    ctx.fillText(`Stack B = [${stackB.length}]`, width / 2 + padding, 30);
    
    // Calculate dynamic spacing based on stack sizes
    const heightA = stackA.length > 0 ? (maxBarHeight + spacing) * stackA.length - spacing : 0;
    const heightB = stackB.length > 0 ? (maxBarHeight + spacing) * stackB.length - spacing : 0;
    const maxHeight = Math.max(heightA, heightB);
    
    const startYA = (height - maxHeight) / 2;
    const startYB = (height - maxHeight) / 2;
    
    // Create gradient colors for the stacks
    const gradientLength = 100; // Number of colors in the gradient
    const colorsA = createColorGradient('#8a85ff', '#60a5fa', gradientLength);
    const colorsB = createColorGradient('#22c55e', '#eab308', gradientLength);
    
    // Draw Stack A (horizontal bars)
    for (let i = 0; i < stackA.length; i++) {
        const value = stackA[i];
        const barWidth = (value / max) * stackAWidth;
        const y = startYA + i * (maxBarHeight + spacing);
        
        // Calculate color index based on value
        const colorIndex = Math.floor((value / max) * (gradientLength - 1));
        const color = colorsA[colorIndex];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(padding, y, barWidth, maxBarHeight);
        ctx.fill();
    }
    
    // Draw Stack B (horizontal bars)
    for (let i = 0; i < stackB.length; i++) {
        const value = stackB[i];
        const barWidth = (value / max) * stackBWidth;
        const y = startYB + i * (maxBarHeight + spacing);
        
        // Calculate color index based on value
        const colorIndex = Math.floor((value / max) * (gradientLength - 1));
        const color = colorsB[colorIndex];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(width / 2 + padding, y, barWidth, maxBarHeight);
        ctx.fill();
    }
}

// Draw vertical view
function drawVertical(width, height, maxValue) {
    // Calculate dimensions
    const padding = 50;
    const maxBarWidth = 20;
    const spacing = 5;
    const bottomY = height - padding;
    
    // Find the max value for scaling
    const allNumbers = [...stackA, ...stackB];
    const max = allNumbers.length > 0 ? Math.max(...allNumbers) : 1;
    
    // Create gradient colors for the stacks
    const gradientLength = 100; // Number of colors in the gradient
    const colors = createColorGradient('#22c55e', '#8a85ff', gradientLength);
    
    // Calculate total width needed
    const totalWidth = (stackA.length + stackB.length) * (maxBarWidth + spacing) - spacing;
    const availableWidth = width - (padding * 2);
    const scale = totalWidth > availableWidth ? availableWidth / totalWidth : 1;
    
    // Adjust bar width and spacing if needed
    const barWidth = maxBarWidth * scale;
    const adjustedSpacing = spacing * scale;
    
    // Center the display
    const startX = (width - (totalWidth * scale)) / 2;
    
    // Draw stack info
    ctx.font = '16px sans-serif';
    ctx.fillStyle = 'var(--text-color)';
    ctx.textAlign = 'left';
    ctx.fillText(`Stack A = [${stackA.length}]`, 20, 30);
    ctx.fillText(`Stack B = [${stackB.length}]`, 20, 60);
    
    // Draw Stack A bars (left side of visualization)
    for (let i = 0; i < stackA.length; i++) {
        const value = stackA[i];
        const barHeight = (value / max) * (height - padding * 2);
        const x = startX + i * (barWidth + adjustedSpacing);
        
        // Calculate color index based on value
        const colorIndex = Math.floor((value / max) * (gradientLength - 1));
        const color = colors[colorIndex];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x, bottomY - barHeight, barWidth, barHeight);
        ctx.fill();
    }
    
    // Draw a blue dot separator
    const separatorX = startX + stackA.length * (barWidth + adjustedSpacing) - adjustedSpacing / 2;
    ctx.fillStyle = '#60a5fa';
    ctx.beginPath();
    ctx.arc(separatorX, bottomY + 10, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw Stack B bars (right side of visualization)
    for (let i = 0; i < stackB.length; i++) {
        const value = stackB[i];
        const barHeight = (value / max) * (height - padding * 2);
        const x = startX + stackA.length * (barWidth + adjustedSpacing) + i * (barWidth + adjustedSpacing);
        
        // Calculate color index based on value
        const colorIndex = Math.floor((value / max) * (gradientLength - 1));
        const color = colors[colorIndex];
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.rect(x, bottomY - barHeight, barWidth, barHeight);
        ctx.fill();
    }
}

// Helper function to generate color gradient
function createColorGradient(startColor, endColor, steps) {
    const result = [];
    
    // Parse the hex colors to RGB
    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);
    
    // Create gradient
    for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = Math.round(startRGB.r + ratio * (endRGB.r - startRGB.r));
        const g = Math.round(startRGB.g + ratio * (endRGB.g - startRGB.g));
        const b = Math.round(startRGB.b + ratio * (endRGB.b - startRGB.b));
        
        result.push(`rgb(${r}, ${g}, ${b})`);
    }
    
    return result;
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
}