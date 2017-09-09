import { sin, pi } from '../internal';

export const easeOutSine = (x: number): number => sin(x * pi / 2);
