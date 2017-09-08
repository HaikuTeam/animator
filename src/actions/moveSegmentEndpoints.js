var clone = require('lodash.clone')
var ensureTimelineProperty = require('./ensureTimelineProperty')

var VALID_HANDLES = {
  left: true,
  middle: true,
  right: true,
  body: true
}

function normalizeMs (givenMs, frameInfo) {
  if (givenMs === null || givenMs === undefined || givenMs === false) return -1
  return Math.round(Math.round(givenMs / frameInfo.mspf) * frameInfo.mspf)
}

module.exports = function moveSegmentEndpoints (bytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo) {
  if (!VALID_HANDLES[handle]) throw new Error('Invalid handle ' + handle)

  // This will be our return value, a description of the changes we made (if any)
  // The signature of this has to be compatible with the input to the 'moveKeyframes' function
  let keyframeMoves = {}

  let property = ensureTimelineProperty(bytecode, timelineName, componentId, propertyName)
  let mss = Object.keys(property).map((key) => parseInt(key, 10)).sort((a, b) => a - b)

  let list = mss.map((ms, i) => {
    let prev = mss[i - 1]
    let next = mss[i + 1]
    return {
      edited: property[ms].edited,
      curve: property[ms].curve,
      value: property[ms].value,
      index: i,
      start: ms,
      end: (next !== undefined) ? next : ms,
      first: prev === undefined,
      last: next === undefined
    }
  })

  var curr = list[keyframeIndex]
  if (!curr) {
    console.warn('Keyframe missing for ' + startMs + '/' + keyframeIndex + ' (' + componentId + '/' + timelineName + '/' + propertyName + '/' + JSON.stringify(mss) + ')')
    return keyframeMoves
  }
  var prev = list[keyframeIndex - 1]
  var next = list[keyframeIndex + 1]
  var late = list[keyframeIndex + 2]

  if (endMs <= 0) endMs = 0
  if (startMs <= 0) return keyframeMoves
  var deltaMs = normalizeMs(endMs - startMs, frameInfo)

  var originalCurrStartMs = curr && curr.start
  var originalPrevStartMs = prev && prev.start
  var originalNextStartMs = next && next.start
  // var originalLateStartMs = late && late.start

  // var currStartMs = normalizeMs(curr && curr.start, frameInfo)
  // var currEndMs = normalizeMs(curr && curr.end, frameInfo)
  var currStartDestMs = normalizeMs(curr && (curr.start + deltaMs), frameInfo)
  var currEndDestMs = normalizeMs(curr && (curr.end + deltaMs), frameInfo)
  var prevStartMs = normalizeMs(prev && prev.start, frameInfo)
  // var prevEndMs = normalizeMs(prev && prev.end, frameInfo)
  var nextStartMs = normalizeMs(next && next.start, frameInfo)
  var nextEndMs = normalizeMs(next && next.end, frameInfo)
  var lateStartMs = normalizeMs(late && late.start, frameInfo)
  // var lateEndMs = normalizeMs(late && late.end, frameInfo)

  // NOTE: Handles have an unintuitive naming, corresponding to:
  //     L M R B     <~ Left, Middle, Right, Body
  // [   ] | [ I ]   <~ I == our "current" segment
  //       ^         <~ Split-point between two segments
  // I.e. "left" means the handle *to the left of the split-point between this segment and the previous*
  // So the "left" handle corresponds (visually) to the _right_ handle of the *previous* segment (if any)

  // The end of a segment cannot be moved prior to the beginning
  if (currEndDestMs < currStartDestMs) {
    return keyframeMoves
  }

  // In the case that the current segment has a curve:
  // currStart       currEnd & nextStart & nextEnd
  // |                   |
  // [===================]

  if (late) {
    if (curr.curve) {
      if (currEndDestMs >= lateStartMs) {
        return keyframeMoves
      }
    }
  }

  if (next) {
    if (curr.curve) {
      if (!next.curve) {
        if (currStartDestMs >= nextStartMs) {
          return keyframeMoves
        }
      }
    } else {
      if (currStartDestMs >= nextStartMs) {
        return keyframeMoves
      }
    }
  }

  if (prev) {
    if (currStartDestMs <= prevStartMs) {
      return keyframeMoves
    }
    // if (prev.curve && curr.curve) {
    //   if (currStartDestMs >= currEndDestMs) {
    //     return keyframeMoves
    //   }
    // }
  }

  var newCurrStart = normalizeMs(currStartDestMs, frameInfo)
  // var oldCurrStart = curr.start
  curr.start = newCurrStart

  // Dragging the body equates to moving both endpoints
  if (next && handle === 'body') {
    if (curr.curve) {
      var newNextStart = normalizeMs(currEndDestMs, frameInfo)
      // var oldNextStart = next.start
      next.start = newNextStart
    } else {
      if (currEndDestMs >= nextEndMs) {
        return keyframeMoves
      }

      var newNextStart2 = normalizeMs(currEndDestMs, frameInfo)
      // var oldNextStart2 = next.start
      next.start = newNextStart2
    }
  }

  // We go ahead and mutate the bytecode here despite also returning the descriptor -
  // we want to make the change right away, but use the keyframeMoves descriptor downstream
  // as a signal to a simpler method about what to do

  if (originalCurrStartMs !== undefined) {
    delete property[originalCurrStartMs]
    var specCurr = { value: curr.value }
    if (curr.edited) specCurr.edited = true
    if (curr.curve) specCurr.curve = curr.curve
    property[curr.start] = specCurr
  }

  if (originalPrevStartMs !== undefined) {
    delete property[originalPrevStartMs]
    var specPrev = { value: prev.value }
    if (prev.edited) specPrev.edited = true
    if (prev.curve) specPrev.curve = prev.curve
    property[prev.start] = specPrev
  }

  if (originalNextStartMs !== undefined) {
    delete property[originalNextStartMs]
    var specNext = { value: next.value }
    if (next.edited) specNext.edited = true
    if (next.curve) specNext.curve = next.curve
    property[next.start] = specNext
  }

  // Note that the UI makes use of this extensively. If you return anything except the _full_ property object,
  // you can expect the UI to break. The UI makes batched/throttled updates (not deltas) so if it gets anything
  // but the current state, things will get jank.
  var cloned = clone(property)

  return cloned
}
