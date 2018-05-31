/**
 * @file Interpolate functions. Used by StateTransitions and Transitions
 */
import {BytecodeStateType} from './api/HaikuBytecode';
import justCurves from './vendor/just-curves';
import {CurveFunction, CurveDefinition} from './api/Curve';


const CENT = 1.0;
const OBJECT = 'object';
const NUMBER = 'number';
const STRING = 'string';

function percentOfTime(t0: number, t1: number, tnow: number) {
  const span = t1 - t0;
  if (span === 0) {
    return CENT;
  } // No divide-by-zero
  const remaining = t1 - tnow;
  return CENT - remaining / span;
}

function valueAtPercent(v0: number, v1: number, pc: number) {
  const span = v1 - v0;
  const gain = span * pc;
  return v0 + gain;
}

function valueAtTime(v0: number, v1: number, t0: number, t1: number, tnow: number) {
  const pc = percentOfTime(t0, t1, tnow);
  return valueAtPercent(v0, v1, pc);
}

function interpolateValue(v0: number, v1: number, t0: number, t1: number, tnow: number, curve: CurveFunction) {
  let pc = percentOfTime(t0, t1, tnow);
  if (pc > CENT) {
    pc = CENT;
  }
  if (curve) {
    pc = curve(pc);
  }
  return valueAtPercent(v0, v1, pc);
}

function interpolate(now: number, curve: CurveDefinition, started: number, ends: number, 
                     origin: BytecodeStateType, destination: BytecodeStateType): BytecodeStateType {

  // If curve is a string, transform into a function using justCurves
  const curveFunc = typeof curve === 'string' ? justCurves[curve] : curve;

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

  return origin;
}



export default {
  interpolate,
};
