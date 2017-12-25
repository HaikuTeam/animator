import camelize from './stringUtils/camelize';
import hyphenate from './stringUtils/hyphenate';
import toLowerFirst from './stringUtils/toLowerFirst';
import toUpperFirst from './stringUtils/toUpperFirst';
import prefixInfo from './prefixInfo';
import prefixProperties from './prefixProperties';

const docStyle = typeof document === 'undefined'
  ? {}
  : document.documentElement.style;

export default function prefixer(asStylePrefix) {
  return function (name, config) {
    config = config || {};

    const styleName = toLowerFirst(camelize(name));

    const cssName = hyphenate(name);

    const theName = asStylePrefix ? styleName : cssName;

    const thePrefix = prefixInfo.style
      ? asStylePrefix ? prefixInfo.style : prefixInfo.css
      : '';

    if (styleName in docStyle) {
      return config.asString ? theName : [theName];
    }

    // not a valid style name, so we'll return the value with a prefix

    let upperCased = theName;
    const prefixProperty = prefixProperties[cssName];
    let result = [];

    if (asStylePrefix) {
      upperCased = toUpperFirst(theName);
    }

    if (typeof prefixProperty === 'function') {
      let prefixedCss = prefixProperty(theName, thePrefix) || [];
      if (prefixedCss && !Array.isArray(prefixedCss)) {
        prefixedCss = [prefixedCss];
      }

      if (prefixedCss.length) {
        prefixedCss = prefixedCss.map(function (property) {
          return asStylePrefix
            ? toLowerFirst(camelize(property))
            : hyphenate(property);
        });
      }

      result = result.concat(prefixedCss);
    }

    if (thePrefix) {
      result.push(thePrefix + upperCased);
    }

    result.push(theName);

    if (config.asString || result.length === 1) {
      return result[0];
    }

    return result;
  };
}
