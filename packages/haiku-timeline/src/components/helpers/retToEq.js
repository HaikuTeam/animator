import * as EXPR_SIGNS from './ExprSigns'

export default function retToEq (str) {
  if (str.substring(0, 7) === (EXPR_SIGNS.RET + ' ')) {
    str = str.slice(7)
    str = (EXPR_SIGNS.EQ + ' ') + str
  }
  return str
}
