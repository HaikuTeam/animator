import ReservedWords from './ReservedWords';

const RESERVED_WORDS_ARRAY = Object.keys(ReservedWords.WORDS);
const WRAP_PREFIX = '_$';
const WRAP_SUFFIX = '$_';
const VALIDITY_REGEX = /(^[^a-zA-Z_])|([^a-zA-Z_0-9])/g;

function charReplacer(c: string): string {
  return WRAP_PREFIX + c.charCodeAt(0) + WRAP_SUFFIX;
}

function isInt(value) {
  return (
    !isNaN(value) &&
    /* tslint:disable-next-line */
    parseInt(Number(value) + '', 10) == value && // `==` is intentional
    !isNaN(parseInt(value, 10))
  );
}

/**
 * @function toIdentifier
 * @description Converts arbitrary text into a valid JavaScript identifier.
 * This operation should be reversible.
 */
export function toIdentifier(str: string): string {
  let out = str;

  out = out.replace(VALIDITY_REGEX, charReplacer);

  if (ReservedWords.WORDS[out]) {
    return `${WRAP_PREFIX}${out}${WRAP_SUFFIX}`;
  }

  if (RESERVED_WORDS_ARRAY.indexOf(out) >= 0) {
    return `${WRAP_PREFIX}${out}${WRAP_SUFFIX}`;
  }

  return out;
}

/**
 * @function toText
 * @description Inverse of toIdentifier
 */
export function toText(str: string): string {
  return str.replace(/_\$([a-zA-Z_0-9]+)\$_/g, (full) => {
    const part = full.slice(2, full.length - 2);
    // Ignore JavaScript keywords that we may have wrapped
    if (isInt(part)) {
      return String.fromCharCode(parseInt(part, 10));
    }
    return part;
  });
}
