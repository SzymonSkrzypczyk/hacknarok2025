chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const IFRAME_ID = 'hacknarock-2025-widget';
      const iframe = document.getElementById(IFRAME_ID);

      if (iframe) {
        window.toggleIframeVisibility();
      }
    },
  });
});
