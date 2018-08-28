/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import Layout3D from './Layout3D';
import arrayUnique from './vendor/array-unique';

import {
  BytecodeNode,
  BytecodeNodeAttributes,
  HaikuBytecode,
  MaybeBytecodeNode,
} from './api';

const uniq = arrayUnique.uniq;

const ALT_CLASS_NAME_ATTR = 'className'; // Ease of React integration
const ATTR_EXEC_RE = /\[([a-zA-Z0-9]+)([$|^~])?(=)?"?(.+?)?"?( i)?]/;
const ATTR_PREFIX = '[';
const CLASS_NAME_ATTR = 'class';
const CLASS_PREFIX = '.';
const FUNCTION = 'function';
const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const HAIKU_PREFIX = 'haiku:';
const ID_PREFIX = '#';
const PIECE_SEPARATOR = ',';
const SPACE = ' ';

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

export type ManaTreeVisitor = (
  elementName: string|HaikuBytecode,
  attributes: BytecodeNodeAttributes,
  children: (string|BytecodeNode)[],
  mana: BytecodeNode,
  locator: string,
  parent: MaybeBytecodeNode,
  index: number,
) => void;

export type BytecodeNodeVisitor = (
  mana: BytecodeNode,
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

export const visit = (
  mana: BytecodeNode,
  visitor: (node: BytecodeNode, parent?: BytecodeNode) => void,
  parent?: BytecodeNode,
): void => {
  if (!mana || typeof mana !== 'object') {
    return;
  }

  visitor(mana, parent);

  const children = ((mana.__memory && mana.__memory.children) || mana.children) as BytecodeNode[];
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child && child.__memory && child.__memory.instance) {
        continue;
      }

      visit(child, visitor, mana);
    }
  }
};

export const ascend = (mana, ascender): void => {
  if (!mana || typeof mana !== 'object') {
    return;
  }

  ascender(mana);

  if (mana.__memory) {
    // Don't ascend beyond the scope of the host component instance
    if (!mana.__memory.instance && mana.__memory.parent) {
      ascend(mana.__memory.parent, ascender);
    }
  }
};

export const cloneNodeShallow = (node) => {
  if (!node) {
    return node;
  }

  return {
    // We want to keep attributes such as __memory, etc.,
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
