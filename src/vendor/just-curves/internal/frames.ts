import { Curve } from '../types';
import { floor } from '../internal';

export const frames = (n: number): Curve => {
    const q = 1 / (n - 1);
    return (x: number) => {
        const o = floor(x * n) * q;
        return x >= 0 && o < 0 ? 0 : x <= 1 && o > 1 ? 1 : o;
    };
};
