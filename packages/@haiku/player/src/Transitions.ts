/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import justCurves from './vendor/just-curves';

const CENT = 1.0;
const OBJECT = 'object';
const NUMBER = 'number';
const KEYFRAME_ZERO = 0;
const KEYFRAME_MARGIN = 16.666;
const STRING = 'string';

function percentOfTime(t0, t1, tnow) {
  const span = t1 - t0;
  if (span === 0) {
    return CENT;
  } // No divide-by-zero
  const remaining = t1 - tnow;
  return CENT - remaining / span;
}

function valueAtPercent(v0, v1, pc) {
  const span = v1 - v0;
  const gain = span * pc;
  return v0 + gain;
}

function valueAtTime(v0, v1, t0, t1, tnow) {
  const pc = percentOfTime(t0, t1, tnow);
  return valueAtPercent(v0, v1, pc);
}

function interpolateValue(v0, v1, t0, t1, tnow, curve) {
  let pc = percentOfTime(t0, t1, tnow);
  if (pc > CENT) {
    pc = CENT;
  }
  if (curve) {
    pc = curve(pc);
  }
  return valueAtPercent(v0, v1, pc);
}

function interpolate(now, curve, started, ends, origin, destination) {
  if (Array.isArray(origin)) {
    const arrayOutput = [];
    for (let i = 0; i < origin.length; i++) {
      arrayOutput[i] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[i],
        destination[i],
      );
    }
    return arrayOutput;
  }

  if (typeof origin === OBJECT) {
    const objectOutput = {};
    for (const key in origin) {
      objectOutput[key] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[key],
        destination[key],
      );
    }
    return objectOutput;
  }

  if (typeof origin === NUMBER) {
    return interpolateValue(origin, destination, started, ends, now, curve);
  }

  return origin;
}

function ascendingSort(a, b) {
  return a - b;
}

function numberize(n) {
  return parseInt(n, 10);
}

function sortedKeyframes(keyframeGroup) {
  // Cache the output of this on the object since this is very hot
  if (keyframeGroup.__sorted) {
    return keyframeGroup.__sorted;
  }

  const keys = Object.keys(keyframeGroup);
  const sorted = keys.sort(ascendingSort).map(numberize);

  // Cache the sorted keys
  keyframeGroup.__sorted = sorted;
  return keyframeGroup.__sorted;
}

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
function getKeyframesList(keyframeGroup, nowValue) {
  const sorted = sortedKeyframes(keyframeGroup);
  for (let i = 0; i < sorted.length; i++) {
    const j = i + 1;
    const current = sorted[i];
    const next = sorted[j];
    if (current <= nowValue) {
      if (next > nowValue) {
        return [current, next];
      }
      if (j >= sorted.length) {
        return [current];
      }
    }
  }
}

function calculateValue(keyframeGroup, nowValue) {
  // HACK: Add a 0th keyframe automatically and set its value to the next one.
  // This is a convenience so the data model/UI doesn't have to remember to set this.
  // But this is probably going to bite somebody later. :/
  // See the 'getKeyframesList' function for an additional part of this hack.
  if (!keyframeGroup[KEYFRAME_ZERO]) {
    keyframeGroup[KEYFRAME_ZERO] = {};
  }
  const keyframesList = getKeyframesList(keyframeGroup, nowValue);
  if (!keyframesList || keyframesList.length < 1) {
    return;
  }
  const currentKeyframe = keyframesList[0];
  const currentTransition = keyframeGroup[currentKeyframe];
  const nextKeyframe = keyframesList[1];
  const nextTransition = keyframeGroup[nextKeyframe];
  const finalValue = getTransitionValue(
    currentKeyframe,
    currentTransition,
    nextKeyframe,
    nextTransition,
    nowValue,
  );
  return finalValue;
}

function calculateValueAndReturnUndefinedIfNotWorthwhile(keyframeGroup, nowValue) {
  if (!keyframeGroup[KEYFRAME_ZERO]) {
    keyframeGroup[KEYFRAME_ZERO] = {};
  } // HACK: See above
  const keyframesList = getKeyframesList(keyframeGroup, nowValue);
  if (!keyframesList || keyframesList.length < 1) {
    return void 0;
  }

  const currentKeyframe = keyframesList[0];
  const nextKeyframe = keyframesList[1];
  const currentTransition = keyframeGroup[currentKeyframe];
  const nextTransition = keyframeGroup[nextKeyframe];

  // If either this or the next transition came from a "machine" (function), we must recalc, since they may be
  // time-dependant
  if (
    (currentTransition && currentTransition.machine) ||
    (nextTransition && nextTransition.machine)
  ) {
    return getTransitionValue(
      currentKeyframe,
      currentTransition,
      nextKeyframe,
      nextTransition,
      nowValue,
    );
  }

  // If no preceding keyframe, check if we need to calculate any values past the initial one
  if (nextKeyframe === undefined) {
    if (nowValue <= currentKeyframe + KEYFRAME_MARGIN) {
      return getTransitionValue(
        currentKeyframe,
        currentTransition,
        nextKeyframe,
        nextTransition,
        nowValue,
      );
    }
    return void 0;
  }

  // If there is a next one, check to see if our current time has already exceeded it, and skip if so
  if (nowValue <= nextKeyframe + KEYFRAME_MARGIN) {
    return getTransitionValue(
      currentKeyframe,
      currentTransition,
      nextKeyframe,
      nextTransition,
      nowValue,
    );
  }

  return void 0;
}

function getTransitionValue(currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue) {
  const currentValue = currentTransition.value;

  if (!currentTransition.curve) {
    return currentValue;
  } // No curve indicates immediate transition
  if (!nextTransition) {
    return currentValue;
  } // We have gone past the final transition

  let currentCurve = currentTransition.curve;
  if (typeof currentCurve === STRING) {
    currentCurve = justCurves[currentCurve];
  }
  const nextValue = nextTransition.value;

  const finalValue = interpolate(
    nowValue,
    currentCurve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextValue,
  );
  return finalValue;
}

export default {
  calculateValue,
  calculateValueAndReturnUndefinedIfNotWorthwhile,
};
