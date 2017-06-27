/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var __baddies__ = 0;

function arrayParamToString(param) {
  var pieces = [];

  for (var i = 0; i < param.length; i++) {
    pieces.push(stringifyParam(param[i]));
  }

  return '[ ' + pieces.join(', ') + ' ]';
}

function objectParamToString(param) {
  var pieces = [];

  // Special case, an object that describes a rest parameter
  if (param.__rest) {
    return '...' + param.__rest;
  }

  for (var key in param) {
    pieces.push(stringifyParam(param[key], key));
  }

  return '{ ' + pieces.join(', ') + ' }';
}

function stringifyParam(param, key) {
  if (param && typeof param === 'string') return param;
  if (param && Array.isArray(param)) {
    if (key) return key + ': ' + arrayParamToString(param);
    return arrayParamToString(param);
  }
  if (param && typeof param === 'object') {
    if (key) return key + ': ' + objectParamToString(param);
    return objectParamToString(param);
  }
  return '__' + __baddies__++ + '__'; // In case we get something we just can't handle, create something unique and noticeably ugly
}

function assembleParams(params) {
  return params
    .map(param => {
      // Need wrap function to avoid passing the index (key) to stringifyParam, which uses that to detect something
      return stringifyParam(param);
    })
    .join(', ');
}

function functionSpecificationToFunction(name, params, body, type) {
  if (!type) type = 'FunctionExpression';

  if (type === 'ArrowFunctionExpression') {
    return new Function(
      '\n' + // eslint-disable-line
        'return ' +
        (name || '') +
        '(' +
        assembleParams(params) +
        ') => {\n' +
        '  ' +
        (body || '') +
        '\n' +
        '}\n'
    )();
  }

  return new Function(
    '\n' + // eslint-disable-line
      'return function ' +
      (name || '') +
      '(' +
      assembleParams(params) +
      ') {\n' +
      '  ' +
      (body || '') +
      '\n' +
      '}\n'
  )();
}

module.exports = functionSpecificationToFunction;
