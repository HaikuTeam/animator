import toUpperFirst from './stringUtils/toUpperFirst';

const re = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;

const docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style;

function prefixInfoFn() {
  const prefix = (function () {
    for (const prop in docStyle) {
      if (re.test(prop)) {
        // test is faster than match, so it's better to perform
        // that on the lot and match only when necessary
        return prop.match(re)[0];
      }
    }

    // Nothing found so far? Webkit does not enumerate over the CSS properties of the style object.
    // However (prop in style) returns the correct value, so we'll have to test for
    // the precence of a specific property
    if ('WebkitOpacity' in docStyle) {
      return 'Webkit';
    }

    if ('KhtmlOpacity' in docStyle) {
      return 'Khtml';
    }

    return '';
  })();

  const lower = prefix.toLowerCase();

  return {
    style: prefix,
    css: '-' + lower + '-',
    dom:
        {
          Webkit: 'WebKit',
          ms: 'MS',
          o: 'WebKit',
        }[prefix] || toUpperFirst(prefix),
  };
}

const prefixInfo = prefixInfoFn();

export default prefixInfo;
