import * as BezierEasing from 'bezier-easing';
import * as flatten from 'lodash/flatten';

import {Curve} from 'haiku-common/lib/types/enums';

export type InterpolationPoints = [number, number, number, number];

/**
 * Provide the interpolation points (the four arguments passed to `cubic-bezier(...)`) for a named curve.
 * TODO: Support non-bezier curves (*Bounce and *Elastic for now) by partitioning into a continuous set of beziers.
 * @param {Curve|InterpolationPoints} curve
 * @returns {InterpolationPoints}
 */
export const getCurveInterpolationPoints = (curve: Curve|InterpolationPoints) => {
  if (Array.isArray(curve)) {
    // We may receive a pre-interpolated curve. Just return it as is.
    return curve;
  }

  switch (curve) {
    case Curve.EaseInBack:
      return [.6, -.28, .735, .045];
    case Curve.EaseInCirc:
      return [.6, .04, .98, .335];
    case Curve.EaseInCubic:
      return [.55, .055, .675, .19];
    case Curve.EaseInExpo:
      return [.95, .05, .795, .035];
    case Curve.EaseInQuad:
      return [.55, .085, .68, .53];
    case Curve.EaseInQuart:
      return [.895, .03, .685, .22];
    case Curve.EaseInBounce:
    case Curve.EaseInElastic:
    case Curve.EaseInQuint:
      return [.755, .05, .855, .06];
    case Curve.EaseInSine:
      return [.47, 0, .745, .715];

    case Curve.EaseOutBack:
      return [.175, .885, .32, 1.75];
    case Curve.EaseOutCirc:
      return [.075, .82, .165, 1];
    case Curve.EaseOutCubic:
      return [.215, .61, .355, 1];
    case Curve.EaseOutExpo:
      return [.19, 1, .22, 1];
    case Curve.EaseOutQuad:
      return [.25, .46, .45, .94];
    case Curve.EaseOutQuart:
      return [.165, .84, .44, 1];
    case Curve.EaseOutBounce:
    case Curve.EaseOutElastic:
    case Curve.EaseOutQuint:
      return [.23, 1, .32, 1];
    case Curve.EaseOutSine:
      return [.39, .575, .565, 1];

    case Curve.EaseInOutBack:
      return [.68, -.55, .265, 1.5];
    case Curve.EaseInOutCirc:
      return [.785, .135, .15, .86];
    case Curve.EaseInOutCubic:
      return [.645, .045, .355, 1];
    case Curve.EaseInOutExpo:
      return [1, 0, 0, 1];
    case Curve.EaseInOutQuad:
      return [.455, .03, .515, .955];
    case Curve.EaseInOutQuart:
      return [.77, 0, .175, 1];
    case Curve.EaseInOutBounce:
    case Curve.EaseInOutElastic:
    case Curve.EaseInOutQuint:
      return [.86, 0, .07, 1];
    case Curve.EaseInOutSine:
      return [.445, .05, .55, .95];

    default:
      // Fail over to linear when we don't know of a better choice.
      return [0, 0, 1, 1];
  }
};

/**
 * A "straightforward" application of De Casteljau's algorithm to the problem of splitting a bezier curve.
 *
 * This method returns the new waypoints of the split bezier curve prior to renormalization.
 *
 * @see {@link https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm}
 * @param {number[][]} points
 * @param {number} dimension
 * @param {number} time
 * @returns {[number[] , number[]]}
 * @private
 */
const reinterpolateBezier = (points: number[][], dimension: number, time: number) => {
  const waypoints = points.map((point) => [point]);
  for (let i = 1; i <= dimension; ++i) {
    for (let j = 0; j <= (dimension - i); ++j) {
      waypoints[j].push(
        waypoints[j][i - 1].map((point, index) => point * (1 - time) + waypoints[j + 1][i - 1][index] * time));
    }
  }

  return [waypoints[0], waypoints.map((point, index) => point[dimension - index])];
};

/**
 * Injects a keyframe into a timeline property using De Casteljau's algorithm.
 *
 * Due to the recursive nature of how this method may be called, we always need to find the immediately preceding
 * and subsequent keyframes to work around.
 * @param timelineProperty
 * @param {number} keyframe
 */
export const injectKeyframeInTimelineProperty = (timelineProperty, keyframe: number) => {
  const allKeyframes = Object.keys(timelineProperty).map(Number);
  const previousKeyframe = Math.max(...allKeyframes.filter((k) => k < keyframe));
  const nextKeyframe = Math.min(...allKeyframes.filter((k) => k > keyframe));
  const [x1, y1, x2, y2] = getCurveInterpolationPoints(timelineProperty[previousKeyframe].curve);

  // Normalize keyframe (time) in [0, 1] to make the curve calculations work with existing tools.
  const time = keyframe / (nextKeyframe - previousKeyframe);

  // Note: We are using the bezier-easing library for fast heuristic calculation of the value at time instead of
  // the cubic-bezier() function from the just-curves vendor package in haiku-player. This is intentional; the math
  // is the same in both libraries, but the bezier-easing library is significantly speedier. Note also that since
  // the canonical timing function moves from [0, 0] to [1, 1], we have to denormalize between the start and end
  // points to get the actual value.
  const value = timelineProperty[previousKeyframe].value + BezierEasing(x1, y1, x2, y2)(time) *
    (timelineProperty[nextKeyframe].value - timelineProperty[previousKeyframe].value);
  const [[_, s1, s2, s3], [e0, e1, e2, __]] = reinterpolateBezier([[0, 0], [x1, y1], [x2, y2], [1, 1]], 3, time);

  // We now have handles on a reinterpolated bezier, pre-normalization. start is [0, 0], end is [1, 1], and s3 is
  // identical to e0. We now have to normalize each curve to fit the standard bezier curve timing function's
  // representation as a continuous curve from [0, 0] to [1, 1]. This is very straightforward for the starting
  // curve, which just needs to be scaled up by s3[0] in the x direction and s3[1] in the y direction.
  const startingCurve = flatten([s1, s2].map((vertex) => [vertex[0] / s3[0], vertex[1] / s3[1]]));

  // For the ending curve, it's a little more challenging because the new "box" is translated up by the vector e0.
  // Recalling that our end cap is [1, 1] from the original curve, it suffices to translate down by e0 and scale up
  // by the new upper right vertex (which is [1 - e0[0], 1 - e0[1]]).
  const endingCurve = flatten(
    [e1, e2].map((vertex) => [(vertex[0] - e0[0]) / (1 - e0[0]), (vertex[1] - e0[1]) / (1 - e0[1])]));

  // Now our work is done! We simply need to replace the original curve with the starting curve, and add a new
  // keyframe with the correct value using the easing from the second curve.
  timelineProperty[previousKeyframe].curve = startingCurve;
  timelineProperty[keyframe] = {
    value,
    curve: endingCurve,
  };
};
