// console.log("I'm working")

translationApiEndpoint = "https://translate.api.cloud.yandex.net/translate/v2/translate"



let selectedText = '';
// cordinates of selected text
let selectedTextRect

// Track mouseup events to detect text selection
document.addEventListener('mouseup', (event) => {
  let selection = window.getSelection()
  selectedText = selection.toString().trim();

  if (selectedText.length > 0 && !document.getElementById('plg-translate-btn')) {
    showTranslateButton(
      event.clientX,
      event.clientY + 10 + document.documentElement.scrollTop
    )

    selectedTextRect = getSelectedTextPosition(selection)
  }
});


// show tranlation button
function showTranslateButton(posX, posY) {
  const translateButton = document.createElement('button');
  // translateButton.id = 'translate-button';
  translateButton.id = 'plg-translate-btn';
  translateButton.title = 'Click to translate selected text'


  fetch(browser.runtime.getURL('translate-language-svgrepo-com.svg'), {
    method: 'GET',
    headers: {
      'Content-Type': 'image/svg+xml'
    },
  })
    .then(response => response.text())
    .then(svg => {

      translateButton.innerHTML = svg;

      // show translateButton and set it position
      document.body.appendChild(translateButton);
      translateButton.style.display = 'block';
      translateButton.style.left = `${posX}px`;
      translateButton.style.top = `${posY + 10}px`;

      // remove translateButton from DOM when clicking elsewhere
      document.addEventListener('mousedown', (event) => {
        if (!translateButton.contains(event.target)) {
          translateButton.remove()
        }
      });

      translateButton.addEventListener('click', (event) => {
        translateButtonClick(event.currentTarget)
      });

    })
    .catch(error => {
      console.error('Error loading translation buttom svg:', error);
    });
}

// Handle translateButton button click
function translateButtonClick(eventTarget) {
  console.log('Selected text:', selectedText);
  let translateButtonRect = eventTarget.getBoundingClientRect();
  eventTarget.remove()
  translateText(selectedText)
    .then(translation => {

      console.log('Translated text:', translation);
      showPopupWindow(
        selectedText,
        translation,
        eventTarget.style.left,
        eventTarget.style.top,
        translateButtonRect
      )
    })
    .catch(error => console.error(error));
};

function getSelectedTextPosition(selection) {
  if (selection.rangeCount > 0) {
    return selection.getRangeAt(0).getBoundingClientRect();
  }
}

// show translation popup
function showPopupWindow(selectedText, translatedText, left, top, translateButtonRect) {
  // console.log("Translated text: ", translatedText)

  const translationPopupContainer = document.createElement('div');
  translationPopupContainer.id = 'translation-popup-container';

  fetch(browser.runtime.getURL('tooltip/tooltip.html'), {
    method: 'GET',
    headers: {
      'Content-Type': 'text/html; text/css'
    },
  })
    .then(response => response.text())
    .then(html => {

      translationPopupContainer.innerHTML = html;
      document.body.appendChild(translationPopupContainer);
      translationPopupContainer.style.display = 'block';
      translationPopupContainer.querySelector('#plg-arrow-top').style.display = 'block'
      translationPopupContainer.style.position = "absolute"
      const scrollTop = document.documentElement.scrollTop;
      translationPopupContainer.querySelector('#plg-translation-text').textContent = translatedText;
      translationPopupContainer.style.left = `${selectedTextRect.x + selectedTextRect.width / 2 - 140}px`
      translationPopupContainer.style.top = `${selectedTextRect.y + selectedTextRect.height + 5 + scrollTop}px`

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

