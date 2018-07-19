/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function tokenize (source: string, regexps: any): any {
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
      console.log(source);
      throw new Error('Unable to tokenize expression');
    }
  }
  return tokens;
}
