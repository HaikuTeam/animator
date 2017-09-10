import { pow } from '../internal';

export const easeInOutQuad = (x: number): number => x < 0.5 ?
  2 * x * x :
  1 - pow(-2 * x + 2, 2) / 2;
