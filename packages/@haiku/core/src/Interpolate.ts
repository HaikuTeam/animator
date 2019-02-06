/**
 * @file Interpolate functions. Used by StateTransitions and Transitions
 */
import {BytecodeStateType, CurveDefinition, CurveFunction} from './api';
import justCurves from './vendor/just-curves';
import {cubicBezier} from './vendor/just-curves/internal/cubicBezier';

const CENT = 1.0;
const OBJECT = 'object';
const NUMBER = 'number';
const STRING = 'string';
const PERCENT_REGEX = /^\d+(\.\d+)?%$/;
const PERCENT_SYMBOL = '%';

const isString = (value: BytecodeStateType): value is string => typeof value === STRING;

function percentOfTime (t0: number, t1: number, tnow: number) {
  const span = t1 - t0;
  if (span === 0) {
    return CENT;
  } // No divide-by-zero
  const remaining = t1 - tnow;
  return CENT - remaining / span;
}

function valueAtPercent (v0: number, v1: number, pc: number) {
  const span = v1 - v0;
  const gain = span * pc;
  return v0 + gain;
}

function interpolateValue (v0: number, v1: number, t0: number, t1: number, tnow: number, curve: CurveFunction) {
  let pc = percentOfTime(t0, t1, tnow);
  if (pc > CENT) {
    pc = CENT;
  }
  if (curve) {
    pc = curve(pc);
  }
  return valueAtPercent(v0, v1, pc);
}

export const interpolate = (
  now: number, curve: CurveDefinition, started: number, ends: number, origin: BytecodeStateType,
  destination: BytecodeStateType,
): BytecodeStateType => {
  // Return early if we aren't tweening anything.
  if (origin === destination) {
    return origin;
  }

  let curveFunc: CurveFunction;

  if (typeof curve === 'string') {
    // If curve is a string, transform into a function using justCurves
    curveFunc = justCurves[curve];
  } else if (Array.isArray(curve)) {
    // If curve is an array defining a Bezier curve, create a proper function
    curveFunc = cubicBezier(curve[0], curve[1], curve[2], curve[3]);
  } else {
    // TODO: handle the case of custom functions, concerns for not enabling this
    // as of right now:
    // - serialization issues in all their various forms
    // (copy/paste, subcomponent, undo/redo, flush to disk)
    // - need to make sure not to crash if the function doesn’t return a number
    // (without a `typeof` check on every tick)
    curveFunc = curve;
  }

  if (typeof curveFunc !== 'function') {
    return origin;
  }

  if (Array.isArray(origin) && Array.isArray(destination)) {
    const arrayOutput = [];
    for (let i = 0; i < origin.length; i++) {
      arrayOutput[i] = interpolate(
        now,
        curveFunc,
        started,
        ends,
        origin[i],
        destination[i],
      );
    }
    return arrayOutput;
  }

  if (origin && typeof origin === OBJECT && destination && typeof destination === OBJECT) {
    const objectOutput = {};
    for (const key in origin as object) {
      objectOutput[key] = interpolate(
        now,
        curveFunc,
        started,
        ends,
        origin[key],
        destination[key],
      );
    }
    return objectOutput;
  }

  if (typeof origin === NUMBER && typeof destination === NUMBER) {
    return interpolateValue(origin as number, destination as number, started, ends, now, curveFunc as CurveFunction);
  }

  if (
    isString(origin) &&
    isString(destination) &&
    PERCENT_REGEX.test(origin) &&
    PERCENT_REGEX.test(destination)
  ) {
    return interpolateValue(
      parseFloat(origin),
      parseFloat(destination),
      started,
      ends,
      now,
      curveFunc as CurveFunction,
    ) + PERCENT_SYMBOL;
  }

  return origin;
};
