/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */
import {BytecodeTimelineProperty} from './api';
import {getSortedKeyframes} from './helpers/KeyframeUtils';
import {interpolate} from './Interpolate';

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
const getKeyframesList = (sorted: number[], nowValue: number) => {
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
};

export const calculateValue = (
  keyframeGroup: BytecodeTimelineProperty,
  nowValue: number,
  sortedKeyframes?: number[],
) => {
  if (!sortedKeyframes) {
    // tslint:disable-next-line:no-parameter-reassignment
    sortedKeyframes = getSortedKeyframes(keyframeGroup);
  }
  const keyframesList = getKeyframesList(sortedKeyframes, nowValue);
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
};

const getTransitionValue = (currentKeyframe, currentTransition, nextKeyframe, nextTransition, nowValue) => {
  const currentValue = currentTransition.value;

  if (!currentTransition.curve) {
    return currentValue;
  } // No curve indicates immediate transition
  if (!nextTransition) {
    return currentValue;
  } // We have gone past the final transition

  const finalValue = interpolate(
    nowValue,
    currentTransition.curve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextTransition.value,
  );
  return finalValue;
};
