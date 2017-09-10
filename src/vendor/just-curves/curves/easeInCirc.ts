import { sqrt } from '../internal';

export const easeInCirc = (x: number): number => 1 - sqrt(1 - (x * x));
