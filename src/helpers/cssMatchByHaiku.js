/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var objectPath = require('./objectPath');

var HAIKU_ID_ATTRIBUTE = 'haiku-id';

function matchByHaiku(node, haikuString, options) {
  var attributes = objectPath(node, options.attributes);
  if (!attributes) return false;
  if (!attributes[HAIKU_ID_ATTRIBUTE]) return false;
  return attributes[HAIKU_ID_ATTRIBUTE] === haikuString;
}

module.exports = matchByHaiku;
