import { sqrt } from '../internal';

export const easeOutCirc = (x: number): number => sqrt(1 - ((x - 1) * (x - 1)));
