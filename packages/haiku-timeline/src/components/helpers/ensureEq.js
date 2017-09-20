import retToEq from './retToEq'
import * as EXPR_SIGNS from './ExprSigns'

export default function ensureEq (str) {
  str = retToEq(str)
  if (str.slice(0, 1) !== EXPR_SIGNS.EQ) {
    str = EXPR_SIGNS.EQ + str
  }
  return str
}
