const CryptoJs = require('crypto-js');
const realSha256 = require('crypto-js/sha256');

function aesDecrypt (str, passcode) {
  return CryptoJs.AES.decrypt(str, passcode).toString(CryptoJs.enc.Utf8);
}

function aesEncrypt (str, passcode) {
  return CryptoJs.AES.encrypt(str, passcode).toString();
}

function safeJsonStringify (objToStringify, maybeReplacer, maybeSpacing) {
  try {
    return JSON.stringify(objToStringify, maybeReplacer, maybeSpacing);
  } catch (exception) {
    return null;
  }
}

function sha256 (input) {
  const jsonStr = safeJsonStringify(input);
  if (!jsonStr) {
    return null;
  }
  return realSha256(jsonStr).toString();
}

module.exports = {
  aesEncrypt,
  aesDecrypt,
  sha256,
};
