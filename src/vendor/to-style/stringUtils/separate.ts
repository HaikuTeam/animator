let doubleColonRe = /::/g
let upperToLowerRe = /([A-Z]+)([A-Z][a-z])/g
let lowerToUpperRe = /([a-z\d])([A-Z])/g
let underscoreToDashRe = /_/g

export default function separate(name: string, separator: string) {
  return name
    ? name
        .replace(doubleColonRe, "/")
        .replace(upperToLowerRe, "$1_$2")
        .replace(lowerToUpperRe, "$1_$2")
        .replace(underscoreToDashRe, separator || "-")
    : ""
}
