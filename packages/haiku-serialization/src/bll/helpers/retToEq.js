const EXPR_SIGNS = {
  RET: 'return',
  EQ: '='
}

module.exports = function retToEq (str) {
  if (str.substring(0, 7) === (EXPR_SIGNS.RET + ' ')) {
    str = str.slice(7)
    str = (EXPR_SIGNS.EQ + ' ') + str
  }
  return str
}
