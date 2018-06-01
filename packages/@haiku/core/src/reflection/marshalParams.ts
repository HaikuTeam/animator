/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {
  toIdentifier,
} from './JavaScriptIdentifier';

const data = {
  baddies: 0,
};

function arrayParamToString (param) {
  const pieces = [];

  for (let i = 0; i < param.length; i++) {
    pieces.push(stringifyParam(param[i], null));
  }

  return '[ ' + pieces.join(', ') + ' ]';
}

function objectParamToString (param) {
  const pieces = [];

  // Special case, an object that describes a rest parameter
  if (param.__rest) {
    return '...' + param.__rest;
  }

  for (const key in param) {
    pieces.push(stringifyParam(param[key], key));
  }

  return '{ ' + pieces.join(', ') + ' }';
}

function stringifyParam (param, key) {
  if (param && typeof param === 'string') {
    return toIdentifier(param);
  }

  if (param && Array.isArray(param)) {
    // Let `a: []` be a signal that we only want to access 'a'
    if (param.length < 1) {
      return key;
    }

    if (key) {
      // e.g.: a, a: [...] <~ To allow reference to the destructure root
      return key + ', ' + key + ': ' + arrayParamToString(param);
    }

    return arrayParamToString(param);
  }

  if (param && typeof param === 'object') {
    // Let `a: {}` be a signal that we only want to access 'a'
    if (Object.keys(param).length < 1) {
      return key;
    }

    if (key) {
      // e.g. a, a: { ... } <~ To allow reference to the destructure root
      return key + ', ' + key + ': ' + objectParamToString(param);
    }

    return objectParamToString(param);
  }

  // In case we get something we just can't handle, create something unique and noticeably ugly.
  return '__' + data.baddies++ + '__';
}

export default function marshalParams (params) {
  return params
    .map((param) => {
      // Need wrap function to avoid passing the index (key) to stringifyParam, which uses that to detect something
      return stringifyParam(param, null);
    })
    .join(', ');
}
