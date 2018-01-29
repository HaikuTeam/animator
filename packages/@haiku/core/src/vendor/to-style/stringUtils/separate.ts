const doubleColonRe = /::/g;
const upperToLowerRe = /([A-Z]+)([A-Z][a-z])/g;
const lowerToUpperRe = /([a-z\d])([A-Z])/g;
const underscoreToDashRe = /_/g;

export default function separate(name: string, separator: string) {
  return name
    ? name
           .replace(doubleColonRe, '/')
           .replace(upperToLowerRe, '$1_$2')
           .replace(lowerToUpperRe, '$1_$2')
           .replace(underscoreToDashRe, separator || '-')
    : '';
}
