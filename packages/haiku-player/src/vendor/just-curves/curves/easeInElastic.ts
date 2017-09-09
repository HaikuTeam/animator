import { pow, sin, tau } from '../internal';

export const easeInElastic = (n: number): number =>
  !n || n === 1 ? n : -1 * sin((n - 1.1) * tau * 2.5) * pow(2, 10 * (n - 1));
