/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {tokenizeParameters} from './Tokenizer';

export interface RFO {
  type: string;
  name: string;
  params: string[];
  body: string;
  injectee?: boolean;
}

function nth (n, type, arr) {
  const none = {value: null, type: 'void'};
  if (arr.length < 1 || n > arr.length) {
    return none;
  }
  let f = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].type === type) {
      f += 1;
    }
    if (f === n) {
      return arr[i];
    }
  }
  return none;
}

function tokensToParams (tokens) {
  if (tokens.length < 1) {
    return [];
  }

  // HACK: Rather than property ast-ize this, we're just going to go through it linearly and make JSON.
  let json = '';
  let frag = '';
  let next;
  let token = tokens.shift();
  const scopes = [];

  while (token) {
    switch (token.type) {
      case 'whitespace':
        frag = ' ';
        break;
      case 'comma':
        frag = ',';
        break;
      case 'colon':
        frag = ':';
        break;

      // Treat parens as an 'array' scope, e.g. at top level of function signature arguments
      case 'paren_open':
        frag = '[';
        scopes.push('square');
        break;
      case 'paren_close':
        frag = ']';
        scopes.pop();
        break;

      case 'square_open':
        frag = '[';
        scopes.push('square');
        break;
      case 'square_close':
        frag = ']';
        scopes.pop();
        break;

      case 'curly_open':
        frag = '{';
        scopes.push('curly');
        break;
      case 'curly_close':
        frag = '}';
        scopes.pop();
        break;

      case 'rest':
        next = tokens.shift();
        frag = JSON.stringify({__rest: next.value});
        break;

      case 'identifier':
        frag = '"' + token.value + '"';
        // If the next token is a comma, we are a self-referential property
        if (
          tokens[0] &&
          (tokens[0].type === 'comma' ||
            tokens[0].type === 'square_close' ||
            tokens[0].type === 'curly_close')
        ) {
          // Handle differently inside array vs object, e.g.:
          // { a: a, b: b } vs [ a, b, c ]
          const scope = scopes[scopes.length - 1];
          if (scope === 'square') {
            frag += '';
          } else {
            frag += ':"' + token.value + '"';
          }
        }
        break;

      default:
        frag = '';
    }

    json += frag;

    token = tokens.shift();
  }

  return JSON.parse(json);
}

function signatureToParams (signature) {
  const tokens = tokenizeParameters(signature);
  const clean = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'whitespace') {
      clean.push(tokens[i]);
    }
  }
  try {
    return tokensToParams(clean);
  } catch (exception) {
    console.warn(`Unable to parse signature ${signature}`, exception);
    return [];
  }
}

export default function functionToRFO (fn) {
  let str = fn.toString();

  // HACK: Remove paren wrapping if any was provided
  if (str[str.length - 1] === ')') {
    if (str[0] === '(') {
      str = str.slice(1);
    }
  }

  const pidx1 = str.indexOf('(');
  const pidx2 = str.indexOf(')');
  const prefix = str.slice(0, pidx1);
  const signature = str.slice(pidx1, pidx2 + 1);
  const suffix = str.slice(pidx2 + 1, str.length);
  const body = suffix.slice(suffix.indexOf('{') + 1, suffix.length - 1).trim(); // Don't include braces or padding
  const type = suffix.match(/^\s*=>\s*{/)
    ? 'ArrowFunctionExpression'
    : 'FunctionExpression';
  const name = nth(2, 'identifier', tokenizeParameters(prefix)).value;
  const params = signatureToParams(signature);

  const spec: RFO = {
    type,
    name,
    params,
    body,
  };

  // If the runtime function is labeled as an injectee, we *must* indicate as much
  // in the specification so that serialization back to code wraps it properly
  if (fn.injectee) {
    spec.injectee = true;
  }

  return {
    __function: spec,
  };
}
