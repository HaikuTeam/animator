function truncate (fullStr, strLen) {
  let apparentLen = fullStr.length - 1

  if (apparentLen <= strLen) {
    return fullStr
  }

  let frontChars = Math.ceil(strLen / 2)
  let backChars = 7

  return fullStr.substr(0, frontChars) + '…' + fullStr.substr(fullStr.length - backChars)
}

module.exports = truncate
