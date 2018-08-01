/**
 * Quick-and-dirty way to generate unique DOM-friendly ids on the fly...
 */

export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

export const randomString = (len) => {
  let str = '';
  while (str.length < len) {
    str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return str;
};
