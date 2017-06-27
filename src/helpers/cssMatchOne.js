/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var matchById = require('./cssMatchById');
var matchByClass = require('./cssMatchByClass');
var matchByTagName = require('./cssMatchByTagName');
var matchByAttribute = require('./cssMatchByAttribute');
var matchByHaiku = require('./cssMatchByHaiku');
var attrSelectorParser = require('./attrSelectorParser');

var ID_PREFIX = '#';
var CLASS_PREFIX = '.';
var ATTR_PREFIX = '[';
var HAIKU_PREFIX = 'haiku:';

function matchOne(node, piece, options) {
  if (piece.slice(0, 6) === HAIKU_PREFIX) {
    return matchByHaiku(node, piece.slice(6), options);
  }

  if (piece[0] === ID_PREFIX) {
    return matchById(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === CLASS_PREFIX) {
    return matchByClass(node, piece.slice(1, piece.length), options);
  }

  if (piece[0] === ATTR_PREFIX) {
    var parsedAttr = attrSelectorParser(piece);
    if (!parsedAttr) return false;
    return matchByAttribute(
      node,
      parsedAttr.key,
      parsedAttr.operator,
      parsedAttr.value,
      options
    );
  }

  return matchByTagName(node, piece, options);
}

module.exports = matchOne;
