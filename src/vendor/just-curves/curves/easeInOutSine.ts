import { cos, pi } from '../internal';

export const easeInOutSine = (x: number): number => -(cos(pi * x) - 1) / 2;
