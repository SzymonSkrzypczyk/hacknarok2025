// import { scrapXPost } from './utils';

let iframeVisible = false;

chrome.action.onClicked.addListener((tab) => {
  iframeVisible = !iframeVisible; // Toggle the iframe visibility
  // Execute the script in the current active tab to toggle iframe visibility
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggleIframeVisibility,
    args: [iframeVisible],
  });
});

function toggleIframeVisibility(visible) {
  const IFRAME_ID = 'hacknarock-2025-widget';
  const URL = 'http://localhost:5173/';

  const iframe = document.getElementById(IFRAME_ID);

  if (iframe) {
    // Toggle visibility of existing iframe
    iframe.style.display = visible ? 'block' : 'none';
  } else {
    // If iframe doesn't exist, create and inject it
    const newIframe = document.createElement('iframe');
    newIframe.src = URL;
    newIframe.id = IFRAME_ID;
    newIframe.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 400px;
      height: 600px;
      z-index: 999999;
      border: none;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      border-radius: 10px;
      display: ${visible ? 'block' : 'none'};
    `;

    newIframe.onload = function () {
      window.addEventListener('scroll', function () {
        console.log(this.document.querySelectorAll('article'));

        newIframe.contentWindow.postMessage(
          {
            action: 'load-posts',
            // payload: [
            //   ...this.document.querySelectorAll('article').map(scrapXPost),
            // ],
          },
          '*'
        );
      });

      newIframe.contentWindow.addEventListener('message', (event) => {
        switch (event.data.action) {
          case 'close': {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: toggleIframeVisibility,
              args: [iframeVisible],
            });
          }
        }
      });
    };

    document.body.appendChild(newIframe);
  }
}
