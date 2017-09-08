export const truncate = (fullStr, strLen) => {
  if (fullStr.length <= strLen) return fullStr

  let frontChars = Math.ceil(strLen / 2)
  let backChars = 7

  return fullStr.substr(0, frontChars) + ' ... ' + fullStr.substr(fullStr.length - backChars)
}
