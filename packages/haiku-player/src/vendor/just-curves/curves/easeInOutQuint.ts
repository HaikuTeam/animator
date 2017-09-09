import { pow } from '../internal';

export const easeInOutQuint = (x: number): number => x < 0.5
  ? 16 * x * x * x * x * x
  : 1 - pow(-2 * x + 2, 5) / 2;
