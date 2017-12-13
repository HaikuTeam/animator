import * as EXPR_SIGNS from './ExprSigns';

export default function retToEq(str) {
  let fixed = str;
  if (fixed.substring(0, 7) === (EXPR_SIGNS.RET + ' ')) {
    fixed = fixed.slice(7);
    fixed = (EXPR_SIGNS.EQ + ' ') + fixed;
  }
  return fixed;
}
