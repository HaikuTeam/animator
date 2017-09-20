import leftTrim from './leftTrim'
import * as EXPR_SIGNS from './ExprSigns'

export default function eqToRet (str) {
  if (leftTrim(str).substring(0, 1) === EXPR_SIGNS.EQ) {
    str = leftTrim(str) // Avoid creating "=    foobar"
    str = str.slice(1)
    str = leftTrim(str) // Avoid creating "=    foobar"
    str = (EXPR_SIGNS.RET + ' ') + str
  }
  return str
}
