console.log("I'm working")

// console.log("Api key: ", browser.storage.sync.get("apiKey").then(onGot, onError))

// const getting = browser.storage.sync.get("apiKey");
// getting.then(item => console.log("API Key: ", item.apiKey));

// Create the popup element
const popup = document.createElement('div');
popup.className = 'selection-logger-popup';
popup.innerHTML = `
  <button class="selection-logger-button" title="Log selected text">
<svg width="800px" height="800px" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    
    <title>spe-translate-2</title>
    <desc>Created with Sketch.</desc>
    <defs>

</defs>
    <g id="64px-Line" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="spe-translate-2">

</g>
        <path d="M15.895,34.553 C15.556,33.875 14.445,33.875 14.106,34.553 L4.106,54.553 C3.859,55.047 4.059,55.648 4.553,55.895 C5.049,56.141 5.648,55.941 5.895,55.448 L9.619,48.001 L20.383,48.001 L24.107,55.448 C24.282,55.799 24.635,56.001 25.003,56.001 C25.153,56.001 25.306,55.967 25.449,55.896 C25.943,55.649 26.143,55.048 25.896,54.554 L15.895,34.553 L15.895,34.553 Z M10.618,46 L15,37.236 L19.382,46 L10.618,46 L10.618,46 Z" id="Shape" fill="#000000">

</path>
        <path d="M47,10 C47.552,10 48,9.553 48,9 C48,8.447 47.552,8 47,8 L43,8 C42.448,8 42,8.447 42,9 C42,9.553 42.448,10 43,10 L47,10 L47,10 Z" id="Shape" fill="#000000">

</path>
        <path d="M57,12 L33,12 C32.448,12 32,12.447 32,13 C32,13.553 32.448,14 33,14 L49.938,14 C49.598,16.894 47.857,20.687 44.977,23.595 C42.961,21.57 41.484,19.089 40.675,16.688 C40.498,16.164 39.93,15.881 39.408,16.06 C38.885,16.236 38.603,16.803 38.78,17.327 C39.668,19.962 41.285,22.681 43.493,24.923 C41.185,26.757 38.324,28 35,28 C34.448,28 34,28.447 34,29 C34,29.553 34.448,30 35,30 C38.898,30 42.293,28.509 45.005,26.292 C47.712,28.506 51.097,30 55,30 C55.552,30 56,29.553 56,29 C56,28.447 55.552,28 55,28 C51.709,28 48.831,26.776 46.492,24.935 C49.674,21.716 51.628,17.514 51.948,14 L57,14 C57.552,14 58,13.553 58,13 C58,12.447 57.552,12 57,12 L57,12 Z" id="Shape" fill="#000000">

</path>
        <path d="M27,12 C19.832,12 14,17.832 14,25 L14,26.586 L11.707,24.293 C11.316,23.902 10.684,23.902 10.293,24.293 C9.902,24.684 9.902,25.316 10.293,25.707 L14.292,29.706 C14.384,29.799 14.495,29.872 14.618,29.923 C14.74,29.973 14.87,30 15,30 C15.13,30 15.26,29.973 15.382,29.923 C15.505,29.872 15.615,29.799 15.708,29.706 L19.707,25.707 C20.098,25.316 20.098,24.684 19.707,24.293 C19.316,23.902 18.684,23.902 18.293,24.293 L16,26.586 L16,25 C16,18.935 20.935,14 27,14 C27.552,14 28,13.553 28,13 C28,12.447 27.552,12 27,12 L27,12 Z" id="Shape" fill="#000000">

</path>
        <path d="M45.708,34.294 C45.616,34.201 45.505,34.128 45.382,34.077 C45.138,33.976 44.862,33.976 44.618,34.077 C44.495,34.128 44.384,34.201 44.292,34.294 L40.293,38.293 C39.902,38.684 39.902,39.316 40.293,39.707 C40.684,40.098 41.316,40.098 41.707,39.707 L44,37.414 L44,39 C44,45.065 39.065,50 33,50 C32.448,50 32,50.447 32,51 C32,51.553 32.448,52 33,52 C40.168,52 46,46.168 46,39 L46,37.414 L48.293,39.707 C48.488,39.902 48.744,40 49,40 C49.256,40 49.512,39.902 49.707,39.707 C50.098,39.316 50.098,38.684 49.707,38.293 L45.708,34.294 L45.708,34.294 Z" id="Shape" fill="#000000">

</path>
    </g>
</svg>
  </button>`;
document.body.appendChild(popup);

let selectedText = '';

// Track mouseup events to detect text selection
document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  selectedText = selection.toString().trim();

  if (selectedText.length > 0) {
    // Position the popup near the selection
    popup.style.display = 'block';
    popup.style.left = `${event.pageX + 10}px`;
    popup.style.top = `${event.pageY - 40}px`;
  } else {
    popup.style.display = 'none';
  }
});

// Hide popup when clicking elsewhere
document.addEventListener('mousedown', (event) => {
  if (!popup.contains(event.target)) {
    popup.style.display = 'none';
  }
});

// Handle button click
popup.querySelector('button').addEventListener('click', () => {
  console.log('Selected text:', selectedText);
  popup.style.display = 'none';
  translateText(selectedText)
    .then(translation => console.log("Translated text: ", translation))
    .catch(error => console.error(error));
});

async function translateText(text) {
  url = "https://translate.api.cloud.yandex.net/translate/v2/translate"

  let apiKeyPromise = await browser.storage.sync.get("apiKey");
  const apiKey = await apiKeyPromise.apiKey
  console.log("API Key: ", apiKey)

  let folderIdPromise = await browser.storage.sync.get("folderId");
  const folderId = await folderIdPromise.folderId
  console.log("folder ID: ", folderId)

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Api-Key ${apiKey}`
      },
      body: JSON.stringify({
        folderId: folderId,
        targetLanguageCode: "ru",
        texts: [text]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Return the first translation's text if input was a single string
    // Or return array of translations if input was an array
    if (Array.isArray(text)) {
      return data.translations.map(t => t.text);
    }
    return data.translations[0].text;

  } catch (error) {
    console.error('Translation error:', error);
    throw error; // Re-throw to allow caller to handle
  }
}