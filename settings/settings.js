function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        folderId: document.querySelector("#folder-id").value,
        apiKey: document.querySelector("#api-ke").value,
    });
}

document.querySelector("form").addEventListener("submit", saveOptions);
