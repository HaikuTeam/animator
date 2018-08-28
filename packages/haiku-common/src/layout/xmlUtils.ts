import {BytecodeNode, BytecodeNodeAttributes, BytecodeNodeStyle} from '@haiku/core/lib/api';
import toStyle from 'haiku-vendor-legacy/lib/to-style';
import xmlParser from 'haiku-vendor-legacy/lib/xml-parser';

const styleStringToObject = toStyle.object;

const COLON = ':';
const SEMI = ';';
const CLASS = 'class';
const CLASS_NAME = 'className';
const CLOSE_TAG = '>';
const DQUOTE = '"';
const EMPTY = '';
const EQ = '=';
const OPEN_TAG = '<';
const SLASH = '/';
const SPACE = ' ';
const STYLE = 'style';

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

const isNumeric = (n: any) => !isNaN(parseFloat(n)) && isFinite(n);

const isEmptyObject = (object: any): boolean => object === null || object === undefined;

const styleToString = (style: BytecodeNodeStyle): string => {
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

interface ParsedXmlNode {
  name: string;
  content?: string;
  attributes?: BytecodeNodeAttributes;
  children: ParsedXmlNode[]|ParsedXmlNode;
}

const fixChildren = (kids: ParsedXmlNode[]|ParsedXmlNode): BytecodeNode[] => {
  if (Array.isArray(kids)) {
    return kids.map(fixNode);
  }

  return [fixNode(kids)];
};

const fixAttributes = (attributes: BytecodeNodeAttributes) => {
  if (attributes.style) {
    if (typeof attributes.style === 'string') {
      attributes.style = styleStringToObject(attributes.style, null, null, null);
    }
  }
  return attributes;
};

const fixNode = (obj?: ParsedXmlNode): BytecodeNode|undefined => {
  if (!obj) {
    return undefined;
  }

  if (typeof obj === 'string') {
    return obj;
  }

  let children = obj.children;

  // @ts-ignore
  if (obj.content) {
    // @ts-ignore
    children = [obj.content];
  }

  return {
    elementName: obj.name,
    attributes: fixAttributes(obj.attributes || {}),
    children: fixChildren(children),
  };
};

const cannotUse = (object: any) => {
  return object === false || object === null || object === undefined || typeof object === 'function';
};

const alreadySerial = (object: any): object is string => {
  return typeof object === 'string' || typeof object === 'number';
};

const manaChildToHtml = (child: BytecodeNode|string) => {
  if (cannotUse(child)) {
    return EMPTY;
  }

  if (alreadySerial(child)) {
    return child;
  }

  return manaToXml(EMPTY, child);
};

export const xmlToMana = (xml: string) => {
  const obj = xmlParser(xml).root;
  return fixNode(obj);
};

export const manaToXml = (accumulator: string, object: BytecodeNode): string => {
  let out = accumulator;

  if (alreadySerial(object)) {
    // @ts-ignore
    return object;
  }

  if (cannotUse(object)) {
    return EMPTY;
  }

  const name = object.elementName;

  const attributes = object.attributes;

  const children = object.children;

  if (name) {
    out += OPEN_TAG + name;

    if (attributes && !isEmptyObject(attributes)) {
      for (let attributeName in attributes) {
        let attrVal = attributes[attributeName];

        if (attributeName === STYLE) {
          if (attrVal === EMPTY || isEmptyObject(attrVal)) {
            continue;
          }

          attrVal = styleToString(attrVal);
        }

        if (attributeName === CLASS_NAME) {
          attributeName = CLASS;
        }

        out += SPACE + attributeName + EQ + DQUOTE + attrVal + DQUOTE;
      }
    }

    out += CLOSE_TAG;

    if (Array.isArray(children)) {
      if (children && children.length > 0) {
        for (const child of children) {
          out += manaChildToHtml(child);
        }
      }
    } else {
      out += manaChildToHtml(children);
    }

    if (SELF_CLOSING_TAG_NAMES.indexOf(name as string) === -1) {
      out += OPEN_TAG + SLASH + name + CLOSE_TAG;
    }
  }

  return out;
};
