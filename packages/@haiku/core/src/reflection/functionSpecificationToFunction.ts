/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import marshalParams from './marshalParams';

export default function functionSpecificationToFunction (name, params, body, type = 'FunctionExpression') {
  let fn;

  if (type === 'ArrowFunctionExpression') {
    // tslint:disable-next-line:no-function-constructor-with-string-args
    fn = new Function(
      '\n' +
      'return ' +
      (name || '') +
      '(' +
      marshalParams(params) +
      ') => {\n' +
      '  ' +
      (body || '') +
      '\n' +
      '}\n',
    )();
  } else {
    // tslint:disable-next-line:no-function-constructor-with-string-args
    fn = new Function(
      '\n' +
      'return function ' +
      (name || '') +
      '(' +
      marshalParams(params) +
      ') {\n' +
      '  ' +
      (body || '') +
      '\n' +
      '}\n',
    )();
  }

  return fn;
}
