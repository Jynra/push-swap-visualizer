// Gestion du drop
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    importTxtBtn.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0 && (files[0].type === 'text/plain' || files[0].name.endsWith('.txt'))) {
        handleFileImport({ files: files });
    } else {
        alert('Please drop a text (.txt) file.');
    }
}

// Fonction pour gérer l'importation de fichier
function handleFileImport(event) {
    const file = event.files ? event.files[0] : event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;

        // Parse operations from file
        const fileOperations = content.split(/\s+|\n+/).filter(op => op.trim());

        // Check if any valid operations were found
        if (fileOperations.length === 0) {
            alert('No valid operations found in the file.');
            return;
        }

        // Set the operations in the operations textarea
        operationsInput.value = fileOperations.join('\n');

        // Auto-load the operations
        loadData();
    };

    reader.onerror = function() {
        alert('Error reading file.');
    };

    reader.readAsText(file);
}

// Gestion du drop pour l'onglet Auto-detect
function handleAutoImportDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    autoImportTxtBtn.style.backgroundColor = '';

    const files = e.dataTransfer.files;
    if (files.length > 0 && (files[0].type === 'text/plain' || files[0].name.endsWith('.txt'))) {
        handleAutoFileImport({ files: files });
    } else {
        alert('Please drop a text (.txt) file.');
    }
}

// Fonction pour gérer l'importation de fichier dans l'onglet Auto-detect
function handleAutoFileImport(event) {
    const file = event.files ? event.files[0] : event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;

        // Parse operations from file
        const fileOperations = content.split(/\s+|\n+/).filter(op => op.trim());

        // Check if any valid operations were found
        if (fileOperations.length === 0) {
            alert('No valid operations found in the file.');
            return;
        }

        // Set the operations in the auto-operations textarea
        autoOperationsInput.value = fileOperations.join('\n');

        // Optional: Auto-load the operations
        loadAutoData();
    };

    reader.onerror = function() {
        alert('Error reading file.');
    };

    reader.readAsText(file);
}