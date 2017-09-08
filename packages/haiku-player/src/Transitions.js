/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Curves = require('./vendor/just-curves')

var CENT = 1.0
var OBJECT = 'object'
var NUMBER = 'number'
var KEYFRAME_ZERO = 0
var KEYFRAME_MARGIN = 16.666
var STRING = 'string'

function percentOfTime (t0, t1, tnow) {
  var span = t1 - t0
  if (span === 0) return CENT // No divide-by-zero
  var remaining = t1 - tnow
  var percent = CENT - remaining / span
  return percent
}

function valueAtPercent (v0, v1, pc) {
  var span = v1 - v0
  var gain = span * pc
  var value = v0 + gain
  return value
}

function valueAtTime (v0, v1, t0, t1, tnow) {
  var pc = percentOfTime(t0, t1, tnow)
  var value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolateValue (v0, v1, t0, t1, tnow, curve) {
  var pc = percentOfTime(t0, t1, tnow)
  if (pc > CENT) pc = CENT
  if (curve) pc = curve(pc)
  var value = valueAtPercent(v0, v1, pc)
  return value
}

function interpolate (now, curve, started, ends, origin, destination) {
  if (Array.isArray(origin)) {
    var arrayOutput = []
    for (var i = 0; i < origin.length; i++) {
      arrayOutput[i] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[i],
        destination[i]
      )
    }
    return arrayOutput
  } else if (typeof origin === OBJECT) {
    var objectOutput = {}
    for (var key in origin) {
      objectOutput[key] = interpolate(
        now,
        curve,
        started,
        ends,
        origin[key],
        destination[key]
      )
    }
    return objectOutput
  } else if (typeof origin === NUMBER) {
    return interpolateValue(origin, destination, started, ends, now, curve)
  } else {
    return origin
  }
}

function ascendingSort (a, b) {
  return a - b
}

function numberize (n) {
  return parseInt(n, 10)
}

function sortedKeyframes (keyframeGroup) {
  // Cache the output of this on the object since this is very hot
  if (keyframeGroup.__sorted) {
    return keyframeGroup.__sorted
  }

  var keys = Object.keys(keyframeGroup)
  var sorted = keys.sort(ascendingSort).map(numberize)

  // Cache the sorted keys
  keyframeGroup.__sorted = sorted
  return keyframeGroup.__sorted
}

// 0:    { value: { ... } }
// 2500: { value: { ... } }
// 5000: { value: { ... } }
function getKeyframesList (keyframeGroup, nowValue) {
  var sorted = sortedKeyframes(keyframeGroup)
  for (var i = 0; i < sorted.length; i++) {
    var j = i + 1
    var current = sorted[i]
    var next = sorted[j]
    if (current <= nowValue) {
      if (next > nowValue) return [current, next]
      if (j >= sorted.length) return [current]
    }
  }
}

function calculateValue (keyframeGroup, nowValue) {
  // HACK: Add a 0th keyframe automatically and set its value to the next one.
  // This is a convenience so the data model/UI doesn't have to remember to set this.
  // But this is probably going to bite somebody later. :/
  // See the 'getKeyframesList' function for an additional part of this hack.
  if (!keyframeGroup[KEYFRAME_ZERO]) {
    keyframeGroup[KEYFRAME_ZERO] = {}
  }
  var keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return
  var currentKeyframe = keyframesList[0]
  var currentTransition = keyframeGroup[currentKeyframe]
  var nextKeyframe = keyframesList[1]
  var nextTransition = keyframeGroup[nextKeyframe]
  var finalValue = getTransitionValue(
    currentKeyframe,
    currentTransition,
    nextKeyframe,
    nextTransition,
    nowValue
  )
  return finalValue
}

function calculateValueAndReturnUndefinedIfNotWorthwhile (
  keyframeGroup,
  nowValue
) {
  if (!keyframeGroup[KEYFRAME_ZERO]) keyframeGroup[KEYFRAME_ZERO] = {} // HACK: See above
  var keyframesList = getKeyframesList(keyframeGroup, nowValue)
  if (!keyframesList || keyframesList.length < 1) return void 0

  var currentKeyframe = keyframesList[0]
  var nextKeyframe = keyframesList[1]
  var currentTransition = keyframeGroup[currentKeyframe]
  var nextTransition = keyframeGroup[nextKeyframe]

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
      nowValue
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
        nowValue
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
      nowValue
    )
  }

  return void 0
}

function getTransitionValue (
  currentKeyframe,
  currentTransition,
  nextKeyframe,
  nextTransition,
  nowValue
) {
  var currentValue = currentTransition.value

  if (!currentTransition.curve) return currentValue // No curve indicates immediate transition
  if (!nextTransition) return currentValue // We have gone past the final transition

  var currentCurve = currentTransition.curve
  if (typeof currentCurve === STRING) currentCurve = Curves[currentCurve]
  var nextValue = nextTransition.value

  var finalValue = interpolate(
    nowValue,
    currentCurve,
    currentKeyframe,
    nextKeyframe,
    currentValue,
    nextValue
  )
  return finalValue
}

module.exports = {
  percentOfTime: percentOfTime,
  valueAtPercent: valueAtPercent,
  valueAtTime: valueAtTime,
  interpolateValue: interpolateValue,
  interpolate: interpolate,
  calculateValue: calculateValue,
  sortedKeyframes: sortedKeyframes,
  calculateValueAndReturnUndefinedIfNotWorthwhile: calculateValueAndReturnUndefinedIfNotWorthwhile
}
