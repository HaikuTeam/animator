/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const STRING = 'string';
const FUNCTION = 'function';
const OBJECT = 'object';

function getType (virtualElement) {
  const typeValue = virtualElement.elementName;
  if (typeValue && typeValue.default) {
    return typeValue.default;
  }
  return typeValue;
}

function thingToTagName (thing) {
  if (typeof thing === STRING && thing.length > 0) {
    return thing;
  }
  if (typeof thing === FUNCTION) {
    return fnToTagName(thing);
  }
  if (thing && typeof thing === OBJECT) {
    return objToTagName(thing);
  }
  warnOnce('Got blank/malformed virtual element object; falling back to <div>');
  return 'div';
}

function objToTagName (obj) {
  // if (obj.name) return obj.name
  // if (obj.metadata && obj.metadata.name) return obj.metadata.name
  // _warnOnce('Got blank/malformed virtual element object; falling back to <div>')
  return 'div';
}

function fnToTagName (fn) {
  if (fn.name) {
    return fn.name;
  }
  if (fn.displayName) {
    return fn.displayName;
  }
  if (fn.constructor) {
    if (fn.constructor.name !== 'Function') {
      return fn.constructor.name;
    }
  }
}

export default function getTypeAsString (virtualElement) {
  let typeValue = getType(virtualElement);
  typeValue = thingToTagName(typeValue);
  if (!typeValue) {
    throw new Error('Node has no discernable name');
  }
  return typeValue;
}

const warnings = {};

function warnOnce (warning) {
  if (warnings[warning]) {
    return void 0;
  }
  warnings[warning] = true;
  console.warn('[haiku core] warning:', warning);
}
