import { pow } from '../internal';

export const easeOutCubic = (x: number): number => 1 - pow(1 - x, 3);
