/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

/**
 * Just a dictionary of all JavaScript reserved words (current and future).
 * This is used during code generation to ensure that neither element attributes
 * nor user-defined states collide with known keywords which will cause problems
 * with codegen and runtime exceptions.
 */
/* tslint:disable */
const WORDS = {
  'enum': true,
  'function': true,
  'implements': true,
  'with': true,
  'abstract': true,
  'arguments': true,
  'await': true,
  'boolean': true,
  'break': true,
  'byte': true,
  'case': true,
  'catch': true,
  'char': true,
  'class': true,
  'const': true,
  'continue': true,
  'debugger': true,
  'default': true,
  'delete': true,
  'do': true,
  'double': true,
  'else': true,
  'eval': true,
  'export': true,
  'extends': true,
  'false': true,
  'final': true,
  'finally': true,
  'float': true,
  'for': true,
  'goto': true,
  'if': true,
  'import': true,
  'in': true,
  'instanceof': true,
  'int': true,
  'interface': true,
  'let': true,
  'long': true,
  'native': true,
  'new': true,
  'null': true,
  'package': true,
  'private': true,
  'protected': true,
  'public': true,
  'return': true,
  'short': true,
  'static': true,
  'super': true,
  'switch': true,
  'synchronized': true,
  'this': true,
  'throw': true,
  'throws': true,
  'transient': true,
  'true': true,
  'try': true,
  'typeof': true,
  'undefined': true, // This should be reserved.
  'var': true,
  'void': true,
  'volatile': true,
  'while': true,
  'yield': true,
};
/* tslint:enable */

const isReserved = (word) => {
  return WORDS[word];
};

export default {
  isReserved,
  WORDS,
};
