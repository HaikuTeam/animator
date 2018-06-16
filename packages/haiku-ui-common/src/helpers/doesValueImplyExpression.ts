import * as EXPR_SIGNS from './ExprSigns';
import leftTrim from './leftTrim';

export default function doesValueImplyExpression (val: string) {
  const trimmed = leftTrim(val);
  return (
    trimmed.substring(0, 1) === EXPR_SIGNS.EQ ||
    trimmed.substring(0, 7) === (EXPR_SIGNS.RET + ' ')
  );
}
