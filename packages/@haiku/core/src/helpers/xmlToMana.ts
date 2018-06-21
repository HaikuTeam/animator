/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import toStyle from './../vendor/to-style';
import xmlParser from './../vendor/xml-parser';

const styleStringToObject = toStyle.object;

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

export default function xmlToMana (xml: string) {
  const obj = xmlParser(xml).root;
  return fixNode(obj);
}
