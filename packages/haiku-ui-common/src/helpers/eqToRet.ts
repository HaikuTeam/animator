import leftTrim from './leftTrim';
import * as EXPR_SIGNS from './ExprSigns';

export default function eqToRet(str) {
  let fixed = str;
  if (leftTrim(fixed).substring(0, 1) === EXPR_SIGNS.EQ) {
    fixed = leftTrim(fixed); // Avoid creating "=    foobar"
    fixed = fixed.slice(1);
    fixed = leftTrim(fixed); // Avoid creating "=    foobar"
    fixed = (EXPR_SIGNS.RET + ' ') + fixed;
  }
  return fixed;
}
