document.addEventListener('DOMContentLoaded', function () {
    // Load settings when page loads
    loadSettings();

    // Handle form submission
    // document.getElementById("#plg-settings").addEventListener("submit", function (e) {
    document.getElementById("#saveButton").addEventListener("click", function (e) {
        e.preventDefault();
        saveSettings();
        
    });
});


function saveSettings() {
    const folderId = document.getElementById('folder-id').value;
    const apiKey = document.getElementById('api-key').value;
    browser.storage.sync.set({
        folderId: folderId,
        apiKey: apiKey
    }).then(function () {
        showStatusMessage('Settings saved successfully!', 'success');
        loadSettings();
    }, function (error) {
        console.error("Error saving settings: ", error);
        showStatusMessage('Error saving settings!', 'error');
        document.getElementById('api-key').remove()
    });
}

function loadSettings() {
    browser.storage.sync.get(['folderId', 'apiKey']).then(function (result) {
        document.getElementById('folder-id').value = result.folderId || 'none';
        document.getElementById('api-key').value = result.apiKey || 'none';
    }, function (error) {
        console.error("Error loading settings: ", error);
        // Set defaults if error occurs
        document.getElementById('folder-id').value = 'none';
        document.getElementById('api-key').value = 'none';
    });
}

function showStatusMessage(message, type) {
    const statusElement = document.getElementById('statusMessage');
    statusElement.textContent = message;
    statusElement.className = type;

    // Hide message after 3 seconds
    setTimeout(function () {
        statusElement.style.display = 'none';
    }, 3000);
}



