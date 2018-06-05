import eqToRet from './eqToRet';
import {RET} from './ExprSigns';

export default function ensureRet (str: string) {
  let fixed = eqToRet(str);
  if (fixed.slice(0, 6) !== RET) {
    fixed = (RET + ' ') + fixed;
  }
  return fixed;
}
