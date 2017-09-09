/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import Curves from "./vendor/just-curves"

const CENT = 1.0
const OBJECT = "object"
const NUMBER = "number"
const KEYFRAME_ZERO = 0
const KEYFRAME_MARGIN = 16.666
const STRING = "string"

function percentOfTime(t0, t1, tnow) {
  let span = t1 - t0
  if (span === 0) return CENT // No divide-by-zero
  let remaining = t1 - tnow
  let percent = CENT - remaining / span
  return percent
}

function valueAtPercent(v0, v1, pc) {
  let span = v1 - v0
  let gain = span * pc
  let value = v0 + gain
  return value
}

function valueAtTime(v0, v1, t0, t1, tnow) {
  let pc = percentOfTime(t0, t1, tnow)
  let value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolateValue(v0, v1, t0, t1, tnow, curve) {
  let pc = percentOfTime(t0, t1, tnow)
  if (pc > CENT) pc = CENT
  if (curve) pc = curve(pc)
  let value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolate(now, curve, started, ends, origin, destination) {
  if (Array.isArray(origin)) {
    let arrayOutput = []
    for (let i = 0; i < origin.length; i++) {
      arrayOutput[i] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[i],
        destination[i],
      )
    }
    return arrayOutput
  } else if (typeof origin === OBJECT) {
    let objectOutput = {}
    for (let key in origin) {
      objectOutput[key] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[key],
        destination[key],
      )
    }
    return objectOutput
  } else if (typeof origin === NUMBER) {
    return interpolateValue(origin, destination, started, ends, now, curve)
  } else {
    return origin
  }
}

function ascendingSort(a, b) {
  return a - b
}

function numberize(n) {
  return parseInt(n, 10)
}

function sortedKeyframes(keyframeGroup) {
  // Cache the output of this on the object since this is very hot
  if (keyframeGroup.__sorted) {
    return keyframeGroup.__sorted
  }

  let keys = Object.keys(keyframeGroup)
  let sorted = keys.sort(ascendingSort).map(numberize)

  // Cache the sorted keys
  keyframeGroup.__sorted = sorted
  return keyframeGroup.__sorted
}

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
function getKeyframesList(keyframeGroup, nowValue) {
  let sorted = sortedKeyframes(keyframeGroup)
  for (let i = 0; i < sorted.length; i++) {
    let j = i + 1
    let current = sorted[i]
    let next = sorted[j]
    if (current <= nowValue) {
      if (next > nowValue) return [current, next]
      if (j >= sorted.length) return [current]
    }
  }
}

function calculateValue(keyframeGroup, nowValue) {
  // HACK: Add a 0th keyframe automatically and set its value to the next one.
  // This is a convenience so the data model/UI doesn't have to remember to set this.
  // But this is probably going to bite somebody later. :/
  // See the 'getKeyframesList' function for an additional part of this hack.
  if (!keyframeGroup[KEYFRAME_ZERO]) {
    keyframeGroup[KEYFRAME_ZERO] = {}
  }
  let keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return
  let currentKeyframe = keyframesList[0]
  let currentTransition = keyframeGroup[currentKeyframe]
  let nextKeyframe = keyframesList[1]
  let nextTransition = keyframeGroup[nextKeyframe]
  let finalValue = getTransitionValue(
    currentKeyframe,
    currentTransition,
    nextKeyframe,
    nextTransition,
    nowValue,
  )
  return finalValue
}

function calculateValueAndReturnUndefinedIfNotWorthwhile(
  keyframeGroup,
  nowValue,
) {
  if (!keyframeGroup[KEYFRAME_ZERO]) keyframeGroup[KEYFRAME_ZERO] = {} // HACK: See above
  let keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return void 0

  let currentKeyframe = keyframesList[0]
  let nextKeyframe = keyframesList[1]
  let currentTransition = keyframeGroup[currentKeyframe]
  let nextTransition = keyframeGroup[nextKeyframe]

  // If either this or the next transition came from a "machine" (function), we must recalc, since they may be time-dependant
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
    )
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
      )
    }
    return void 0
  }

  // If there is a next one, check to see if our current time has already exceeded it, and skip if so
  if (nowValue <= nextKeyframe + KEYFRAME_MARGIN) {
    return getTransitionValue(
      currentKeyframe,
      currentTransition,
      nextKeyframe,
      nextTransition,
      nowValue,
    )
  }

  return void 0
}

function getTransitionValue(
  currentKeyframe,
  currentTransition,
  nextKeyframe,
  nextTransition,
  nowValue,
) {
  let currentValue = currentTransition.value

  if (!currentTransition.curve) return currentValue // No curve indicates immediate transition
  if (!nextTransition) return currentValue // We have gone past the final transition

  let currentCurve = currentTransition.curve
  if (typeof currentCurve === STRING) currentCurve = Curves[currentCurve]
  let nextValue = nextTransition.value

  let finalValue = interpolate(
    nowValue,
    currentCurve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextValue,
  )
  return finalValue
}

export default {
  percentOfTime,
  valueAtPercent,
  valueAtTime,
  interpolateValue,
  interpolate,
  calculateValue,
  sortedKeyframes,
  calculateValueAndReturnUndefinedIfNotWorthwhile,
}
