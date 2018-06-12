export default (fullStr: string, strLen: number) => {
  const apparentLen = fullStr.length - 1;

  if (apparentLen <= strLen) {
    return fullStr;
  }

  const frontChars = Math.ceil(strLen / 2);
  const backChars = 7;

  return fullStr.substr(0, frontChars) + '…' + fullStr.substr(fullStr.length - backChars);
};
