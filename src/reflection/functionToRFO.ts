/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// Order matters
const REGEXPS = [
  {type: 'whitespace', re: /^[\s]+/},
  {type: 'paren_open', re: /^\(/},
  {type: 'paren_close', re: /^\)/},
  {type: 'square_open', re: /^\[/},
  {type: 'square_close', re: /^]/},
  {type: 'curly_open', re: /^\{/},
  {type: 'curly_close', re: /^\}/},
  {type: 'rest', re: /^\.\.\./},
  {type: 'colon', re: /^:/},
  {type: 'comma', re: /^,/},
  {type: 'identifier', re: /^[a-zA-Z0-9_$]+/}, // TODO: Include unicode chars
];

function nth(n, type, arr) {
  const none = {value: null, type: 'void'};
  if (arr.length < 1) return none;
  if (n > arr.length) return none;
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

function tokenize(source) {
  const tokens = [];
  let chunk = source;
  const total = chunk.length;
  let iterations = 0;
  while (chunk.length > 0) {
    for (let i = 0; i < REGEXPS.length; i++) {
      const regexp = REGEXPS[i];
      const match = regexp.re.exec(chunk);
      if (match) {
        const value = match[0];
        tokens.push({type: regexp.type, value});
        // Need to slice the chunk at the value match length
        chunk = chunk.slice(match[0].length, chunk.length);
        break;
      }
    }
    // We've probably failed to parse correctly if we get here
    if (iterations++ > total) {
      throw new Error('Unable to tokenize expression');
    }
  }
  return tokens;
}

function tokensToParams(tokens) {
  if (tokens.length < 1) return [];

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

function signatureToParams(signature) {
  const tokens = tokenize(signature);
  const clean = [];
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'whitespace') {
      clean.push(tokens[i]);
    }
  }
  return tokensToParams(clean);
}

export default function functionToRFO(fn) {
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
  const name = nth(2, 'identifier', tokenize(prefix)).value;
  const params = signatureToParams(signature);

  const spec = {
    type,
    name,
    params,
    body,
  };

  return {
    __function: spec,
  };
}
