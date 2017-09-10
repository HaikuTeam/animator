import { Curve } from '../types';
import { cubicBezier, frames, ease, easeIn, easeOut, easeInOut, stepStart, stepEnd, linear, steps } from './index';

const camelCaseRegex = /([a-z])[- ]([a-z])/ig;
const cssFunctionRegex = /^([a-z-]+)\(([^\)]+)\)$/i;
const cssEasings = { ease, easeIn, easeOut, easeInOut, stepStart, stepEnd, linear };

const camelCaseMatcher = (match: string, p1: string, p2: string) => p1 + p2.toUpperCase();

const toCamelCase = (value: string | undefined): string => typeof value === 'string'
  ? (value as string).replace(camelCaseRegex, camelCaseMatcher) : '';

const find = (nameOrCssFunction: string) => {
  // search for a compatible known easing
  const easingName = toCamelCase(nameOrCssFunction);
  const easing = cssEasings[easingName] || nameOrCssFunction;
  const matches = cssFunctionRegex.exec(easing);
  if (!matches) {
    throw new Error('could not parse css function');
  }
  return [matches[1]].concat(matches[2].split(','));
};

export const cssFunction = (easingString: string): Curve => {
  const p = find(easingString);
  const fnName = p[0];
  if (fnName === 'steps') {
    return steps(+p[1], p[2] as (number | 'start' | 'end'));
  }
  if (fnName === 'cubic-bezier') {
    return cubicBezier(+p[1], +p[2], +p[3], +p[4]);
  }
  if (fnName === 'frames') {
    return frames(+p[1]);
  }
  throw new Error('unknown css function');
};
