module.exports = (str) => {
  return (str[str.length - 1] === '/')
    ? str
    : `${str}/`
}
