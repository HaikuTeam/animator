/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */
import Interpolate from './Interpolate';

const KEYFRAME_MARGIN = 16.666;

function ascendingSort (a, b) {
  return a - b;
}

function numberize (n) {
  return parseInt(n, 10);
}

function sortedKeyframes (keyframeGroup) {
  const keys = Object.keys(keyframeGroup);
  const sorted = keys.sort(ascendingSort).map(numberize);
  return sorted;
}

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
function getKeyframesList (keyframeGroup, nowValue) {
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

function calculateValue (keyframeGroup, nowValue) {
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

function calculateValueAndReturnUndefinedIfNotWorthwhile (keyframeGroup, nowValue) {
  const keyframesList = getKeyframesList(keyframeGroup, nowValue);
  if (!keyframesList || keyframesList.length < 1) {
    return void 0;
  }

  const currentKeyframe = keyframesList[0];
  const nextKeyframe = keyframesList[1];
  const currentTransition = keyframeGroup[currentKeyframe];
  const nextTransition = keyframeGroup[nextKeyframe];

  // If either this or the next transition came from an expression,
  // we must recalc, since they may be time-dependant
  if (
    (currentTransition && currentTransition.expression) ||
    (nextTransition && nextTransition.expression)
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

function getTransitionValue (currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue) {
  const currentValue = currentTransition.value;

  if (!currentTransition.curve) {
    return currentValue;
  } // No curve indicates immediate transition
  if (!nextTransition) {
    return currentValue;
  } // We have gone past the final transition

  const finalValue = Interpolate.interpolate(
    nowValue,
    currentTransition.curve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextTransition.value,
  );
  return finalValue;
}

export default {
  calculateValue,
  calculateValueAndReturnUndefinedIfNotWorthwhile,
  sortedKeyframes,
};
