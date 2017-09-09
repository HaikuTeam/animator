import { c1, c3 } from '../internal';

export const easeInBack = (x: number): number => c3 * x * x * x - c1 * x * x;
