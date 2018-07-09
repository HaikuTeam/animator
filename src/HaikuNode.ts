/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Layout3D from './Layout3D';
import arrayUnique from './vendor/array-unique';
import toStyle from './vendor/to-style';
import xmlParser from './vendor/xml-parser';

import {
  BytecodeNode,
  BytecodeNodeAttributes,
  HaikuBytecode,
  MaybeBytecodeNode,
} from './api/HaikuBytecode';

const styleStringToObject = toStyle.object;
const uniq = arrayUnique.uniq;

const ALT_CLASS_NAME_ATTR = 'className'; // Ease of React integration
const ATTR_EXEC_RE = /\[([a-zA-Z0-9]+)([$|^~])?(=)?"?(.+?)?"?( i)?]/;
const ATTR_PREFIX = '[';
const CLASS = 'class';
const CLASS_NAME = 'className';
const CLASS_NAME_ATTR = 'class';
const CLASS_PREFIX = '.';
const CLOSE_TAG = '>';
const COLON = ':';
const DQUOTE = '"';
const EMPTY = '';
const EQ = '=';
const FUNCTION = 'function';
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const HAIKU_PREFIX = 'haiku:';
const ID_PREFIX = '#';
const OPEN_TAG = '<';
const PIECE_SEPARATOR = ',';
const SEMI = ';';
const SLASH = '/';
const SPACE = ' ';
const STYLE = 'style';

const DEFAULT_SCOPE = 'div';

const SCOPE_STRATA = {
  div: 'div',
  svg: 'svg',
  // canvas: 'canvas'
};

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

const getFnName = (fn): string => {
  if (fn.name) {
    return fn.name;
  }

  const str = fn.toString();

  //                  | | <-- this space is always here via toString()
  const reg = /function ([^(]*)/;
  const ex = reg.exec(str);
  return ex && ex[1];
};

export const parseAttrSelector = (selector) => {
  const matches = ATTR_EXEC_RE.exec(selector);

  if (!matches) {
    return null;
  }

  return {
    key: matches[1],
    operator: matches[3] && (matches[2] || '') + matches[3],
    value: matches[4],
    insensitive: !!matches[5],
  };
};

export const cssMatchByAttribute = (
  node,
  attrKeyToMatch,
  attrOperator,
  attrValueToMatch,
  options,
) => {
  const attributes = node[options.attributes];

  if (attributes) {
    const attrValue = attributes[attrKeyToMatch];

    // If no operator, do a simple presence check ([foo])
    if (!attrOperator) {
      return !!attrValue;
    }

    switch (attrOperator) {
      case '=':
        return attrValueToMatch === attrValue;
      // case '~=':
      // case '|=':
      // case '^=':
      // case '$=':
      // case '*=':
      default:
        console.warn('Operator `' + attrOperator + '` not supported yet');
        return false;
    }
  }
};

export const cssMatchByClass = (node, className, options) => {
  const attributes = node[options.attributes];

  if (attributes) {
    let foundClassName = attributes[CLASS_NAME_ATTR];

    if (!foundClassName) {
      foundClassName = attributes[ALT_CLASS_NAME_ATTR];
    }

    if (foundClassName) {
      const classPieces = foundClassName.split(SPACE);

      if (classPieces.indexOf(className) !== -1) {
        return true;
      }
    }
  }
};

export const cssMatchByHaiku = (node, haikuString, options) => {
  const attributes = node[options.attributes];

  if (!attributes) {
    return false;
  }

  if (!attributes[HAIKU_ID_ATTRIBUTE]) {
    return false;
  }

  return attributes[HAIKU_ID_ATTRIBUTE] === haikuString;
};

export const cssMatchById = (node, id, options) => {
  const attributes = node[options.attributes];

  if (attributes) {
    if (attributes.id === id) {
      return true;
    }
  }
};

export const cssMatchByTagName = (node, tagName, options) => {
  const val = node[options.name];

  if (val) {
    if (typeof val === 'string' && val === tagName) {
      return true;
    }

    if (typeof val === FUNCTION) {
      // Allow function constructors to act as the tag name
      if (getFnName(val) === tagName) {
        return true;
      }
    }

    if (typeof val === 'object') {
      // Allow for things like instances to act as the tag name
      if (val.name === tagName || val.tagName === tagName) {
        return true;
      }
    }
  }
};

export const cssMatchOne = (node, piece, options) => {
  if (piece.slice(0, 6) === HAIKU_PREFIX) {
    return cssMatchByHaiku(node, piece.slice(6), options);
  }

  if (piece[0] === ID_PREFIX) {
    return cssMatchById(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === CLASS_PREFIX) {
    return cssMatchByClass(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === ATTR_PREFIX) {
    const parsedAttr = parseAttrSelector(piece);
    if (!parsedAttr) {
      return false;
    }
    return cssMatchByAttribute(
      node,
      parsedAttr.key,
      parsedAttr.operator,
      parsedAttr.value,
      options,
    );
  }

  return cssMatchByTagName(node, piece, options);
};

export const cssQueryList = (list, query, options) => {
  const matches = [];

  const pieces = query.split(PIECE_SEPARATOR);

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i].trim();

    for (let j = 0; j < list.length; j++) {
      const node = list[j];

      if (cssMatchOne(node, piece, options)) {
        matches.push(node);
      }
    }
  }

  return matches;
};

export const cssQueryTree = (node, query, options) => {
  if (!node || typeof node !== 'object') {
    return [];
  }

  return cssQueryList(manaFlattenTree(node, options), query, options);
};

export const manaFlattenTree = (node, options, unique = true, list = [], depth = 0, index = 0) => {
  list.push(node);

  // Don't recurse down into the children of nested components, which should be 'invisible' to us.
  // Nested components are indicated when their name is not a string, e.g. a component descriptor.
  if (depth < 1 || typeof node[options.name] === 'string') {
    const children = node[options.children];

    if (!children || typeof children === 'string') {
      return list;
    }

    if (Array.isArray(children)) {
      const copies = children.slice(0);

      // Ensure snapshotted children are included such that transcluded nodes are still subject
      // to property application, e.g. going from repeat=0 to repeat=1
      if (node.__children) {
        copies.push.apply(copies, node.__children);
      }

      // Without this, we'll have an infinite loop since the source child appears in both the
      // original children and the snapshotted children arrays.
      uniq(copies);

      for (let i = 0; i < copies.length; i++) {
        manaFlattenTree(copies[i], options, false, list, depth + 1, i);
      }
    } else if (typeof children === 'object') {
      list.push(children);
      return list;
    }
  }

  return unique ? uniq(list) : list;
};

function fixChildren (kids) {
  if (Array.isArray(kids)) {
    return kids.map(fixNode);
  }
  return fixNode(kids);
}

function fixAttributes (attributes) {
  if (attributes.style) {
    if (typeof attributes.style === 'string') {
      attributes.style = styleStringToObject(attributes.style, null, null, null);
    }
  }
  return attributes;
}

function fixNode (obj) {
  if (!obj) {
    return obj;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  let children = obj.children;

  if (obj.content) {
    children = [obj.content];
  }

  return {
    elementName: obj.name,
    attributes: fixAttributes(obj.attributes || {}),
    children: fixChildren(children),
  };
}

export const xmlToMana = (xml: string) => {
  const obj = xmlParser(xml).root;
  return fixNode(obj);
};

export type ManaTreeVisitor = (
  elementName: string|HaikuBytecode,
  attributes: BytecodeNodeAttributes,
  children: (string|BytecodeNode)[],
  mana: BytecodeNode,
  locator: string,
  parent: MaybeBytecodeNode,
  index: number,
) => void;

export const visitManaTree = (
  locator: string,
  mana: string|BytecodeNode,
  visitor: ManaTreeVisitor,
  parent: MaybeBytecodeNode,
  index: number,
): void => {
  if (!mana || typeof mana === 'string') {
    return null;
  }

  visitor(
    mana.elementName,
    mana.attributes,
    mana.children,
    mana,
    locator,
    parent,
    index,
  );

  if (!mana.children) {
    return null;
  }

  for (let i = 0; i < mana.children.length; i++) {
    const child = mana.children[i];
    visitManaTree(locator + '.' + i, child, visitor, mana, i);
  }
};

export const scopifyElements = (mana, parent, scope) => {
  if (!mana) {
    return mana;
  }
  if (typeof mana === 'string') {
    return mana;
  }

  mana.__scope = scope || DEFAULT_SCOPE;

  if (mana.children) {
    for (let i = 0; i < mana.children.length; i++) {
      const child = mana.children[i];
      scopifyElements(
        child,
        mana,
        // If the current element defines a new strata, make that a new scope
        // and pass it down to the children.
        SCOPE_STRATA[mana.elementName] || scope,
      );
    }
  }
};

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

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

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

export const manaToXml = (accumulator: string, object, mapping, options): string => {
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
};

export const cloneNodeShallow = (node) => {
  if (!node) {
    return node;
  }

  return {
    // We want to keep __parent, __repeat, etc.,
    // as well as elementName, which could be byteocde,
    // unchanged.
    ...node,
    attributes: cloneAttributes(node.attributes),
    layout: Layout3D.clone(node.layout),
  };
};

export const cloneAttributes = (attributes) => {
  if (!attributes) {
    return attributes;
  }

  const out = {
    ...attributes,
  };

  if (attributes.style) {
    out.style = Object.assign({}, attributes.style);
  }

  return out;
};
