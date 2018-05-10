import {easeOutBounce} from './easeOutBounce';

export const easeInOutBounce = (x: number): number => x < 0.5
  ? (1 - easeOutBounce(1 - 2 * x)) / 2
  : (1 + easeOutBounce(2 * x - 1)) / 2;
