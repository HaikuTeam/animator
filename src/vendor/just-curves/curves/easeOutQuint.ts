import { pow } from '../internal';

export const easeOutQuint = (x: number): number => 1 - pow(1 - x, 5);
