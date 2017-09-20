import leftTrim from './leftTrim'
import * as EXPR_SIGNS from './ExprSigns'

export default function doesValueImplyExpression (val) {
  val = leftTrim(val)
  return (
    val.substring(0, 1) === EXPR_SIGNS.EQ ||
    val.substring(0, 7) === (EXPR_SIGNS.RET + ' ')
  )
}
