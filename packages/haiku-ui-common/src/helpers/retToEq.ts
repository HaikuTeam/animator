import {EQ, RET} from './ExprSigns';

export default function retToEq (str: string) {
  let fixed = str;
  if (fixed.substring(0, 7) === (RET + ' ')) {
    fixed = fixed.slice(7);
    fixed = (EQ + ' ') + fixed;
  }
  return fixed;
}
