import eqToRet from './eqToRet';
import * as EXPR_SIGNS from './ExprSigns';

export default function ensureRet(str) {
  let fixed = eqToRet(str);
  if (fixed.slice(0, 6) !== EXPR_SIGNS.RET) {
    fixed = (EXPR_SIGNS.RET + ' ') + fixed;
  }
  return fixed;
}
