import {randomString} from '@haiku/core/lib/helpers/StringUtils';

export type Obfuscation = [string, string];

/**
 * General purpose obfuscator for any JSON-serializable object.
 *
 * The algorithm works as follows:
 *   - base64 the JSON stringification of the object
 *   - generate a deterministic hash by plucking even characters from the result:
 *      [b[0], b[2], b[4], b[6], b[8], ...]
 *      …where b[0], b[3], etc. are characters in the base64 encoded string
 *   - replace the characters at these indices with random noise.
 *   - replace all characters in b with the result of shifting the character code indices down by one.
 *   - return the hash as the result of shifting the character code indices up by one.
 *
 * The goal of this algorithm is make it virtually impossible to steal Haiku offline functionality by hacking the
 * registry.
 *
 * It is expected that stealing Haiku is always going to be relatively easy by decompilation, inspection, and general
 * hackery.
 */
export const obfuscate = (target: any): Obfuscation => {
  const buffer = Buffer.from(JSON.stringify(target));
  const encoded = buffer.toString('base64');
  let value = '';
  let key = '';
  const randomness = randomString(encoded.length / 2);
  for (let cursor = 0; cursor < encoded.length; cursor++) {
    const charCode = encoded.charCodeAt(cursor);
    if (cursor % 2 === 0) {
      key += String.fromCharCode(charCode + 1);
      value += randomness[cursor / 2];
    } else {
      value += String.fromCharCode(charCode - 1);
    }
  }

  return [key, value];
};

/**
 * Undoes the work of obfuscate() above.
 */
export const unobfuscate = (obfuscation: Obfuscation): any => {
  try {
    let encoded = '';
    const [key, value] = obfuscation;
    for (let cursor = 0; cursor < value.length; cursor++) {
      if (cursor % 2 === 0) {
        encoded += String.fromCharCode(key.charCodeAt(cursor / 2) - 1);
      } else {
        encoded += String.fromCharCode(value.charCodeAt(cursor) + 1);
      }
    }
    return JSON.parse((new Buffer(encoded, 'base64')).toString());
  } catch (error) {
    // Deliberately repress the error here so it doesn't bubble up on any logs or consoles.
    return {};
  }
};
