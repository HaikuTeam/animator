/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var matchOne = require('./cssMatchOne');

var PIECE_SEPARATOR = ',';

function queryList(matches, list, query, options) {
  var maxdepth = options.maxdepth !== undefined
    ? parseInt(options.maxdepth, 10)
    : Infinity;
  var pieces = query.split(PIECE_SEPARATOR);
  for (var i = 0; i < pieces.length; i++) {
    var piece = pieces[i].trim();
    for (var j = 0; j < list.length; j++) {
      var node = list[j];
      if (node.__depth <= maxdepth) {
        if (matchOne(node, piece, options)) {
          matches.push(node);
        }
      }
    }
  }
}

module.exports = queryList;
