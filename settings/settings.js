
function showStatusMessage(message, type) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = type;

  // Hide message after 3 seconds
  setTimeout(function () {
    statusElement.className = 'plg-hidden';
  }, 3000);
}

async function saveSettings() {
  const folderId = document.getElementById('folder-id').value;
  const apiKey = document.getElementById('api-key').value;
  await browser.storage.sync.set({
    folderId: folderId,
    apiKey: apiKey
  })
    .then(
      () => {
        showStatusMessage('Settings saved successfully!', 'success');
      },
      () => {
        showStatusMessage('Settings saved successfully!', 'success');
      })
}

async function loadSettings() {
  const folderId = await browser.storage.sync.get('folder-id').folderId;
  const apiKey = await browser.storage.sync.get('api-key').apiKey;

  document.getElementById('folder-id').value = folderId || 'none';
  document.getElementById('api-key').value = apiKey || 'none';

}


document.addEventListener('DOMContentLoaded', loadSettings);

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  saveSettings();
});

