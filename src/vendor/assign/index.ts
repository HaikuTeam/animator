export default function assign(...args) {
  const t = args[0]
  for (let s, i = 1, n = args.length; i < n; i++) {
    s = args[i]
    for (let p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p]
      }
    }
  }
  return t
}
