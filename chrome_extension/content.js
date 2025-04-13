(function () {
  const IFRAME_ID = 'hacknarock-2025-widget';
  const URL = 'http://localhost:5173/';

  const alreadySentPosts = [];

  const WIDTH = '400px';
  const HEIGHT = '640px';
  const BATCH_LIMIT = 4;

  // 1. Validate if iframe already exists
  if (document.getElementById(IFRAME_ID)) return;
  // ---

  function prepareDataBatch(data) {
    if (!data || data.length < BATCH_LIMIT) return false;

    const batch = data.filter((el) => !alreadySentPosts.includes(el.link));

    if (batch.length < BATCH_LIMIT) return false;

    alreadySentPosts.push(...batch.map((el) => el.link));
    return batch;
  }

  // 2. Prepare utilities
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
          .childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1]
          .childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[2]
          .childNodes[0].childNodes[1].childNodes[0].childNodes[1].src;

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
  //

  const iframe = document.createElement('iframe');
  iframe.id = IFRAME_ID;
  iframe.src = URL;
  iframe.style.position = 'fixed';
  iframe.style.bottom = '10px';
  iframe.style.right = '10px';
  iframe.style.width = WIDTH;
  iframe.style.height = HEIGHT;
  iframe.style.zIndex = '9999';
  iframe.style.border = 'none';
  iframe.style.boxShadow = '0 0 12px rgba(0,0,0,0.3)';
  iframe.dataset.opened = '1';

  window.toggleIframeVisibility = function () {
    const iframe = document.getElementById(IFRAME_ID);
    const isCurrentlyVisible = iframe.dataset.opened === '1';

    iframe.dataset.opened = isCurrentlyVisible ? '0' : '1';
    iframe.style.zIndex = isCurrentlyVisible ? '-1' : '9999';
    iframe.style.width = isCurrentlyVisible ? '0' : WIDTH;
    iframe.style.height = isCurrentlyVisible ? '0' : HEIGHT;
  };

  iframe.onload = function () {
    window.addEventListener('scroll', function () {
      const batch = prepareDataBatch(
        [...this.document.querySelectorAll('article')]
          .map(scrapXPost)
          .filter((post) => post !== 'ADD_DETECTED')
      );

      if (!batch) return;

      iframe.contentWindow.postMessage(
        {
          action: 'load-posts',
          payload: batch,
        },
        '*'
      );
    });

    window.addEventListener('message', (event) => {
      switch (event.data?.payload?.type) {
        case 'close': {
          window.toggleIframeVisibility();
          break;
        }

        case 'block': {
          console.log('Received test message from iframe!, data:', event.data);
          event.data.payload.dataToBlock.forEach((item) => {
            const trimmedUrl = item.link.slice(13);

            const root = document.querySelector(`a[href="${trimmedUrl}"]`);

            const wrapper =
              root.parentNode.parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.parentNode.parentNode.parentNode;

            console.log(wrapper);

            wrapper.style.position = 'relative';

            const blocker = document.createElement('div');

            blocker.style.position = 'absolute';
            blocker.style.top = '0';
            blocker.style.left = '0';
            blocker.style.right = '0';
            blocker.style.bottom = '0';
            blocker.style.backgroundColor = 'rgba(0, 0, 0, 1)';
            blocker.style.zIndex = '9999';
            blocker.style.pointerEvents = 'none';
            blocker.color = 'white';
            blocker.style.display = 'flex';
            blocker.style.justifyContent = 'center';
            blocker.style.alignItems = 'center';
            blocker.style.flexDirection = 'column';
            blocker.style.fontSize = '20px';

            blocker.innerHTML = `
              <p style="font-size: 24px">
                Irrelevant content detected!
              </p>

              <span style="display: flex">
                <span> Blocked by: Summa</span>
                <strong>Rizz</strong>
                <span>e</span>
              </span>
              `;

            wrapper.appendChild(blocker);
          });
          break;
        }
      }
    });
  };

  document.body.appendChild(iframe);
})();
