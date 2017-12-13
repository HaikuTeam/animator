import retToEq from './retToEq';
import * as EXPR_SIGNS from './ExprSigns';

export default function ensureEq(str) {
  let fixed = retToEq(str);
  if (fixed.slice(0, 1) !== EXPR_SIGNS.EQ) {
    fixed = EXPR_SIGNS.EQ + fixed;
  }
  return fixed;
}
