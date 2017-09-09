import { pow, tau, sin } from '../internal';


export const easeOutElastic = (n: number): number => {
  if (!n || n === 1) return n;
  var s, a = 0.1, p = 0.4;

  if (!a || a < 1) { a = 1; s = p / 4; }
  else s = p * Math.asin(1 / a) / tau;
  return (a * pow(2, - 10 * n) * sin((n - s) * (tau) / p) + 1);
};
