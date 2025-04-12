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
    iframe.style.zIndex = visible ? '999999' : '-1';
  } else {
    function scrapXPost(post) {
      try {
        function parsePrefix(_value) {
          if (_value === undefined) return 0;

          const lowercasedValue = _value.toLowerCase();
          const withoutLastChar = lowercasedValue.slice(
            0,
            lowercasedValue.length - 1
          );

          if (lowercasedValue.endsWith('k')) return withoutLastChar * 1e3;
          else if (lowercasedValue.endsWith('m')) return withoutLastChar * 1e6;
          else if (lowercasedValue.endsWith('b')) return withoutLastChar * 1e9;

          return withoutLastChar * 1;
        }

        function getStat(n) {
          return parsePrefix(
            root.childNodes[3]?.childNodes[0]?.childNodes[0]?.childNodes[n]
              ?.textContent
          );
        }

        const root =
          post.childNodes[0]?.childNodes[0]?.childNodes[1]?.childNodes[1];

        const content = root.childNodes[1].textContent;

        const link =
          root.childNodes[0]?.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0]?.childNodes[1].childNodes[0].childNodes[2]
            .childNodes[0]?.href;

        const author =
          root.childNodes[0]?.childNodes[0].childNodes[0].childNodes[0]
            .childNodes[0]?.childNodes[0]?.textContent;

        const date =
          root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[2].childNodes[0].childNodes[0].getAttribute(
            'datetime'
          );

        const avatarURL =
          post.childNodes[0]?.childNodes[0]?.childNodes[1].childNodes[0]
            .childNodes[0].childNodes[0].childNodes[0].childNodes[0]
            .childNodes[1].childNodes[0].childNodes[1].childNodes[0]
            .childNodes[0].childNodes[2].childNodes[0].childNodes[1]
            .childNodes[0].childNodes[1].src;

        const stats = {
          commentsCount: getStat(0),
          likesCount: getStat(2),
          viewsCount: getStat(3),
        };

        return {
          app: 'X.com',
          author,
          content,
          date,
          link,
          avatarURL,
          stats,
        };
      } catch (e) {
        return 'ADD_DETECTED';
      }
    }

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
        newIframe.contentWindow.postMessage(
          {
            action: 'load-posts',
            payload: [...this.document.querySelectorAll('article')]
              .map(scrapXPost)
              .filter((post) => post !== 'ADD_DETECTED'),
          },
          '*'
        );
      });

      window.addEventListener('message', (event) => {
        switch (event.data?.payload?.type) {
          case 'close': {
            toggleIframeVisibility(false);
            break;
          }

          case 'test': {
            console.log(
              'Received test message from iframe!, data:',
              event.data
            );
            break;
          }
        }
      });
    };

    document.body.appendChild(newIframe);
  }
}
