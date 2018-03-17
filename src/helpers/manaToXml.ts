import toStyle from './../vendor/to-style';

const styleStringToObject = toStyle.object;

const SELF_CLOSING_TAG_NAMES = [
  'area',
  'base',
  'br',
  'col',
  'command',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];

const COLON = ':';
const SEMI = ';';
const OPEN_TAG = '<';
const CLOSE_TAG = '>';
const SPACE = ' ';
const EMPTY = '';
const EQ = '=';
const DQUOTE = '"';
const SLASH = '/';
const STYLE = 'style';
const CLASS_NAME = 'className';
const CLASS = 'class';

const manaChildToHtml = (child, mapping, options) => {
  if (cannotUse(child)) {
    return EMPTY;
  }

  if (alreadySerial(child)) {
    return child;
  }

  return manaToXml(EMPTY, child, mapping, options);
};

const isEmptyObject = (object) => {
  return object === null || object === undefined;
};

const styleToJSXString = (style) => {
  let obj;

  if (typeof style === 'string') {
    obj = styleStringToObject(
      style,
      {camelize: true},
      null,
      null,
    );
  } else {
    obj = style;
  }

  const out = '{' + JSON.stringify(obj) + '}';

  return out;
};

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const styleToString = (style) => {
  let out = '';

  if (!style) {
    return out;
  }

  if (typeof style === 'string') {
    return style;
  }

  if (typeof style !== 'object') {
    return out;
  }

  for (const styleKey in style) {
    const styleValue = style[styleKey];

    if (
      typeof styleValue === 'string' ||
      typeof styleValue === 'boolean' ||
      isNumeric(styleValue)
    ) {
      // TODO: Add correct spacing instead of this compact format?
      out += styleKey + COLON + styleValue + SEMI;
    }
  }

  return out;
};

const cannotUse = (object) => {
  return object === false || object === null || object === undefined || typeof object === 'function';
};

const alreadySerial = (object) => {
  return typeof object === 'string' || typeof object === 'number';
};

export default function manaToXml(accumulator: string, object, mapping, options): string {
  let out = accumulator;

  if (alreadySerial(object)) {
    return object;
  }

  if (cannotUse(object)) {
    return EMPTY;
  }

  let name = object[(mapping && mapping.name) || 'elementName'];

  if (name && typeof name === 'object') {
    name = name.name;
  }

  const attributes = object[(mapping && mapping.attributes) || 'attributes'];

  const children = object[(mapping && mapping.children) || 'children'];

  if (name) {
    out += OPEN_TAG + name;

    let style = attributes && attributes[STYLE];

    if (style) {
      if (options && options.jsx) {
        style = styleToJSXString(style);
      } else {
        style = styleToString(style);
      }

      if (attributes) {
        attributes[STYLE] = style;
      }
    }

    if (attributes && !isEmptyObject(attributes)) {
      for (let attributeName in attributes) {
        const attrVal = attributes[attributeName];

        if (attributeName === STYLE) {
          if (attrVal === EMPTY || isEmptyObject(attrVal)) {
            continue;
          }
        }

        if (attributeName === CLASS_NAME) {
          attributeName = CLASS;
        }

        if (options && options.jsx && attributeName === STYLE) {
          out += SPACE + attributeName + EQ + attrVal;
        } else {
          out += SPACE + attributeName + EQ + DQUOTE + attrVal + DQUOTE;
        }
      }
    }

    out += CLOSE_TAG;

    if (Array.isArray(children)) {
      if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
          out += manaChildToHtml(children[i], mapping, options);
        }
      }
    } else {
      out += manaChildToHtml(children, mapping, options);
    }

    if (SELF_CLOSING_TAG_NAMES.indexOf(name) === -1) {
      out += OPEN_TAG + SLASH + name + CLOSE_TAG;
    }
  }

  return out;
}
