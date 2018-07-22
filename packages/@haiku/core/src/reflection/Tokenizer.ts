/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export const tokenize = (source: string, regexps: any): any => {
  const tokens = [];
  let chunk = source;
  const total = chunk.length;
  let iterations = 0;
  while (chunk.length > 0) {
    for (let i = 0; i < regexps.length; i++) {
      const regexp = regexps[i];
      const match = regexp.re.exec(chunk);
      if (match) {
        const value = match[0];
        tokens.push({value, type: regexp.type});
        // Need to slice the chunk at the value match length
        chunk = chunk.slice(match[0].length, chunk.length);
        break;
      }
    }
    // We've probably failed to parse correctly if we get here
    if (iterations++ > total) {
      throw new Error(`Unable to tokenize expression ${source}`);
    }
  }
  return tokens;
};

// Order matters
const PARAMETERS_REGEXPS = [
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

export const tokenizeParameters = (source: string) => {
  return tokenize(source, PARAMETERS_REGEXPS);
};

const SYMBOLS = '~!@#$%^&*-_=+/|:\'<,>.?'.split('').join('\\');

const DIRECTIVE_REGEXPS = [
  {type: 'whitespace', re: /^[\s]+/},
  {type: 'paren_open', re: /^\(/},
  {type: 'paren_close', re: /^\)/},
  // If you want to count -123 as a negative number, use ^-?\d at column 56
  {type: 'number', re: /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i},
  {type: 'symbol', re: new RegExp('^([$' + SYMBOLS + '][$' + SYMBOLS + ']*)([^\\n\\S]*:(?!:))?')},
  {type: 'identifier', re: new RegExp('^([$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*)([^\\n\\S]*:(?!:))?')},
];

export const tokenizeDirective = (source: string) => {
  const tokens = tokenize(source, DIRECTIVE_REGEXPS).filter((token) => {
    return token.type !== 'whitespace';
  });

  tokens.forEach((token) => {
    if (token.type === 'number') {
      token.value = Number(token.value);
    }
  });

  return tokens;
};

export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
