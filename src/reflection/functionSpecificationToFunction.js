/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var marshalParams = require('./marshalParams')

function functionSpecificationToFunction (name, params, body, type) {
  if (!type) type = 'FunctionExpression'

  if (type === 'ArrowFunctionExpression') {
    return new Function( // eslint-disable-line
      '\n' +
        'return ' +
        (name || '') +
        '(' +
        marshalParams(params) +
        ') => {\n' +
        '  ' +
        (body || '') +
        '\n' +
        '}\n'
    )()
  }

  return new Function( // eslint-disable-line
    '\n' +
      'return function ' +
      (name || '') +
      '(' +
      marshalParams(params) +
      ') {\n' +
      '  ' +
      (body || '') +
      '\n' +
      '}\n'
  )()
}

module.exports = functionSpecificationToFunction
