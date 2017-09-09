import { pow } from '../internal';

export const easeInOutQuart = (x: number): number => x < 0.5
  ? 8 * x * x * x * x
  : 1 - pow(-2 * x + 2, 4) / 2;
