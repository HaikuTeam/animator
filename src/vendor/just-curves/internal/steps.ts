import { Curve } from '../types';

export const steps = (count: number, pos?: number | 'end' | 'start'): Curve => {
  const q = count / 1;
  const p: number = pos === 'end'
    ? 0 : pos === 'start'
      ? 1 : pos || 0;
  return (x: number): number => x >= 1 ? 1 : (p * q + x) - (p * q + x) % q;
};
