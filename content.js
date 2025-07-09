console.log("I'm working")

translationApiEndpoint = "https://translate.api.cloud.yandex.net/translate/v2/translate"

// Create the popup element
const translateButton = document.createElement('div');
translateButton.id = 'translate-button';
translateButton.innerHTML = `
  <button title="translate selected text">
    <img src=${browser.runtime.getURL('icons/logo/icon-32.png')} width="32" height="32"> 
  </button>`;
// document.body.appendChild(translateButton);

let selectedText = '';
// bottom left cordinates of selected text
let selectedTextPosition = { x: 0, y: 0 }

// Track mouseup events to detect text selection
document.addEventListener('mouseup', (event) => {
  selectedText = window.getSelection().toString().trim();
  // selectedTextPosition = getSelectedTextPosition(selectedText)
  const scrollTop = document.documentElement.scrollTop;
  const posX = event.clientX - 50;
  const posY = event.clientY + 20 + scrollTop;

  if (selectedText.length > 0) {
    // Position the translateButton near the selection
    document.body.appendChild(translateButton);
    translateButton.style.display = 'block';
    // translateButton.style.left = `${event.pageX}px`;
    // translateButton.style.top = `${event.pageY + 20}px`;
    translateButton.style.left = `${posX}px`;
    translateButton.style.top = `${posY}px`;
  } else {
    translateButton.style.display = 'none';
  }
});

// remove translateButton from DOM when clicking elsewhere
document.addEventListener('mousedown', (event) => {
  if (!translateButton.contains(event.target)) {
    translateButton.remove()
  }
});

// Handle button click
translateButton.querySelector('button').addEventListener('click', () => {
  console.log('Selected text:', selectedText);
  // remove translateButton
  translateButton.remove()
  translateText(selectedText)
    .then(translation => showPopupWindow(
      selectedText,
      translation,
      translateButton.style.left,
      translateButton.style.top
    ))
    .catch(error => console.error(error));
});

function getSelectedTextPosition(selection) {
  if (selection.rangeCount > 0) {
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    return { x: rect.x, y: rect.y - rect.width }
  }
}

async function translateText(text) {

  let apiKeyPromise = await browser.storage.sync.get("apiKey");
  const apiKey = await apiKeyPromise.apiKey
  // console.log("API Key: ", apiKey)

  let folderIdPromise = await browser.storage.sync.get("folderId");
  const folderId = await folderIdPromise.folderId
  console.log("folder ID: ", folderId)

  try {
    const response = await fetch(translationApiEndpoint, {
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

// show translation popup
function showPopupWindow(selectedText, translatedText, left, top) {
  console.log("Translated text: ", translatedText)

  const translationPopupContainer = document.createElement('div');
  translationPopupContainer.id = 'translation-popup-container';
  translationPopupContainer.style.display = 'block';

  // popupContainer.querySelector('#original-text').textContent = selectedText
  // popupContainer.querySelector('#translated-text').textContent = translatedText

  fetch(browser.runtime.getURL('popup/popup.html'))
    .then(response => response.text())
    .then(html => {


      // Get references to popup elements
      // const popup = popupContainer.querySelector('#popup-container');
      translationPopupContainer.innerHTML = html;
      translationPopupContainer.style.left = left
      translationPopupContainer.style.top = top
      translationPopupContainer.style.position = "absolute"
      translationPopupContainer.style.display = 'block';
      translationPopupContainer.querySelector('#original-text').textContent = selectedText;
      translationPopupContainer.querySelector('#translated-text').textContent = translatedText;
      document.body.appendChild(translationPopupContainer);

      // Close popup when clicking outside
      document.addEventListener('mousedown', (event) => {
        if (!translationPopupContainer.contains(event.target)) {
          // popupContainer.style.display = 'none';
          translationPopupContainer.remove()
        }
      });

    })
    .catch(error => {
      console.error('Error loading popup HTML:', error);
    });



}

