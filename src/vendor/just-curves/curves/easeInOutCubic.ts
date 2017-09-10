import { pow } from '../internal';

export const easeInOutCubic = (x: number): number => x < 0.5
  ? 4 * x * x * x
  : 1 - pow(-2 * x + 2, 3) / 2;
