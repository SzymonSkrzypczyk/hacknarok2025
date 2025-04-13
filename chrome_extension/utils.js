export function parsePrefix(_value) {
  const lowercasedValue = _value.toLowerCase();
  const withoutLastChar = lowercasedValue.slice(0, lowercasedValue.length - 1);

  if (lowercasedValue.endsWith('k')) return withoutLastChar * 1e3;
  else if (lowercasedValue.endsWith('m')) return withoutLastChar * 1e6;
  else if (lowercasedValue.endsWith('b')) return withoutLastChar * 1e9;

  return withoutLastChar * 1;
}

/**
 * A function to perform data scrapping on XPost.
 */
export function scrapXPost(post) {
  const root = post.childNodes[0].childNodes[0].childNodes[1].childNodes[1];

  const link =
    root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[2].childNodes[0].href;

  const author =
    root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[0].textContent;

  const date =
    root.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
      .childNodes[1].childNodes[0].childNodes[2].childNodes[0].childNodes[0]
      .dateTime;

  const getStat = (n) =>
    parsePrefix(
      root.childNodes[3].childNodes[0].childNodes[0].childNodes[n].textContent
    );

  const stats = {
    commentsCount: getStat(0),
    likesCount: getStat(2),
    viewsCount: getStat(3),
  };

  return {
    app: 'X.com',
    author,
    date,
    link,
    stats,
  };
}
