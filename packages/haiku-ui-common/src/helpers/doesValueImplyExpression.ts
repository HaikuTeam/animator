import leftTrim from './leftTrim';
import * as EXPR_SIGNS from './ExprSigns';

export default function doesValueImplyExpression(val) {
  const trimmed = leftTrim(val);
  return (
    trimmed.substring(0, 1) === EXPR_SIGNS.EQ ||
    trimmed.substring(0, 7) === (EXPR_SIGNS.RET + ' ')
  );
}
