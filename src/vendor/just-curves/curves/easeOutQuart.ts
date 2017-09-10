import { pow } from '../internal';

export const easeOutQuart = (x: number): number => 1 - pow(1 - x, 4);
