import { c1, c3, pow } from '../internal';

export const easeOutBack = (x: number): number => 1 + c3 * pow(x - 1, 3) + c1 * pow(x - 1, 2);
