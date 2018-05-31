import retToEq from './retToEq';
import {EQ} from './ExprSigns';

export default function ensureEq(str: string) {
  let fixed = retToEq(str);
  if (fixed.slice(0, 1) !== EQ) {
    fixed = EQ + fixed;
  }
  return fixed;
}
