function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        folderId: document.querySelector("#folder-id").value,
        apiKey: document.querySelector("#api-ke").value,
    });
}

// function restoreOptions() {


//     function onError(error) {
//         console.log(`Error: ${error}`);
//     }

//     let getting = browser.storage.sync.get("apiKey");
// }

// document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
