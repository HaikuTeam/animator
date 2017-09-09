import { pow, sin, tau } from '../internal';

export const easeInOutElastic = (n: number) => {
  if (!n || n === 1) return n;
  n *= 2;
  if (n < 1) {
      return -0.5 * (pow(2, 10 * (n - 1)) * sin((n - 1.1) * tau / .4));
  }
  return pow(2, -10 * (n - 1)) * sin((n - 1.1) * tau / .4) * .5 + 1;
};
