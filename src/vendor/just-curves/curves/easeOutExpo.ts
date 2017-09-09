import { pow } from '../internal';

export const easeOutExpo = (x: number): number => x === 1 ? 1 : 1 - pow(2, -10 * x);
