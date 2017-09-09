import { cos, pi } from '../internal';

export const easeInSine = (x: number): number => 1 - cos(x * pi / 2);
