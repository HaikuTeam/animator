import { pow } from '../internal';

export const easeInExpo = (x: number): number => x === 0 ? 0 : pow(2, 10 * x - 10);
