
let selectedText = '';
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


  fetch(browser.runtime.getURL('icons/translate-btn.svg'), {
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
      translateButton.style.left = `${posX - 16}px`;
      translateButton.style.top = `${posY + 10}px`;

      // remove translateButton from DOM after 2 seconds
      setTimeout(function () {
        translateButton.remove()
      }, 2000);

      // remove translateButton from DOM when clicking elsewhere
      document.addEventListener('mousedown', (event) => {
        if (!translateButton.contains(event.target)) {
          translateButton.remove()
        }
      });

      translateButton.addEventListener('click', (event) => {
        translateButtonClick(event)
      });

    })
    .catch(error => {
      console.error('Error loading translation buttom svg:', error);
    });
}

// Handle translateButton button click
function translateButtonClick(clickEvent) {

  clickEvent.currentTarget.remove()
  translateText(selectedText)
    .then(translation => {

      showPopupWindow(
        translation,
        clickEvent.clientX,
        clickEvent.clientY
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
function showPopupWindow(translatedText, eventX, eventY) {

  const translationPopupContainer = document.createElement('div');
  translationPopupContainer.id = 'plg-tooltip-wrapper';

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
      const scrollX = document.documentElement.scrollLeft;
      translationPopupContainer.querySelector('#plg-translation-text').textContent = translatedText;

      // get translationPopupContainer width
      const translationContainerWidth = translationPopupContainer.getBoundingClientRect().width;

      // set position
      translationPopupContainer.style.left = `${eventX - translationContainerWidth / 2 + scrollX}px`
      translationPopupContainer.style.top = `${eventY + scrollTop}px`

      // Close popup when clicking outside
      document.addEventListener('mousedown', (event) => {
        if (!translationPopupContainer.contains(event.target)) {
          translationPopupContainer.remove()
        }
      });

    })
    .catch(error => {
      console.error('Error loading popup HTML:', error);
    });
}
