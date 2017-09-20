import eqToRet from './eqToRet'
import * as EXPR_SIGNS from './ExprSigns'

export default function ensureRet (str) {
  str = eqToRet(str)
  if (str.slice(0, 6) !== EXPR_SIGNS.RET) {
    str = (EXPR_SIGNS.RET + ' ') + str
  }
  return str
}
