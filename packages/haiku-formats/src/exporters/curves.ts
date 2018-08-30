import {BytecodeTimelineProperty, Curve} from '@haiku/core/lib/api';
import * as BezierEasing from 'bezier-easing';
import {flatten} from 'lodash';

export type InterpolationPoints = [number, number, number, number];

/**
 * Provide the interpolation points (the four arguments passed to `cubic-bezier(...)`) for a named curve.
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
    case Curve.EaseInQuint:
      return [.755, .05, .855, .06];
    case Curve.EaseInSine:
      return [.47, 0, .745, .715];

    case Curve.EaseOutBack:
      return [.175, .885, .32, 1.275];
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
    case Curve.EaseInOutQuint:
      return [.86, 0, .07, 1];
    case Curve.EaseInOutSine:
      return [.445, .05, .55, .95];
    case Curve.Linear:
      return [0, 0, 1, 1];

    default:
      // This should never happen!
      throw new Error(`Encountered unidentifiable curve: ${curve}`);
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
 * Convenience method; denormalizes a value normalized in [0, 1].
 * @param {number} normalizedValue
 * @param {number} from
 * @param {number} to
 * @returns {number}
 * @private
 */
const denormalizeValue = (normalizedValue: number, from: number, to: number): number =>
  from + normalizedValue * (to - from);

/**
 * Convenience method; normalizes a value in [0, 1].
 * @param {number} value
 * @param {number} from
 * @param {number} to
 * @returns {number}
 * @private
 */
const normalizeValue = (value: number, from: number, to: number): number =>
  (value - from) / (to - from);

/**
 * Injects a keyframe into a timeline property using De Casteljau's algorithm.
 *
 * Due to the recursive nature of how this method may be called, we always need to find the immediately preceding
 * and subsequent keyframes to work around.
 * @param timelineProperty
 * @param {number} keyframe
 */
export const splitBezierForTimelinePropertyAtKeyframe = (
  timelineProperty: BytecodeTimelineProperty, keyframe: number,
) => {
  const allKeyframes = Object.keys(timelineProperty).map(Number);
  const previousKeyframe = Math.max(...allKeyframes.filter((k) => k < keyframe));
  const nextKeyframe = Math.min(...allKeyframes.filter((k) => k > keyframe));

  // Return early if we don't have a next keyframe to animate to.
  if (nextKeyframe === Infinity || previousKeyframe === -Infinity) {
    // There is no basis keyframe! Just animate to/from the current value.
    timelineProperty[keyframe] = {
      // #FIXME: 1 isn't always the correct fallback for properties that might not have a keyframe at 0.
      value: (timelineProperty[previousKeyframe] && timelineProperty[previousKeyframe].value) || 1,
      curve: Curve.Linear,
    };
    return;
  }

  const [x1, y1, x2, y2] = getCurveInterpolationPoints(timelineProperty[previousKeyframe].curve as Curve);

  // Normalize keyframe (time) in [0, 1] to make the curve calculations work with existing tools.
  const time = normalizeValue(keyframe, previousKeyframe, nextKeyframe);

  // Note: We are using the bezier-easing library for fast heuristic calculation of the value at time instead of
  // the cubic-bezier() function from the just-curves vendor package in @haiku/core. This is intentional; the math
  // is the same in both libraries, but the bezier-easing library is significantly speedier. Note also that since
  // the canonical timing function moves from [0, 0] to [1, 1], we have to denormalize between the start and end
  // points to get the actual value.
  const value = denormalizeValue(
    BezierEasing(x1, y1, x2, y2)(time),
    timelineProperty[previousKeyframe].value as number,
    timelineProperty[nextKeyframe].value as number,
  );
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

/**
 * A formal notation for bezier breakpoints for curve decomposition. The structure represents:
 *  - At index 0: the [0, 1]-normalized time for the bezier to begin.
 *  - At index 1: the [0, 1]-normalized curve value for the bezier to transition from.
 *  - At index 2: the curve that simulates this segment of the broader curve.
 * @private
 */
type BezierBreakpoint = [number, number, Curve|InterpolationPoints];

/**
 * Composes two sets of bezier breakpoints into a single set of breakpoints normalized in [0, 1].
 * @param {BezierBreakpoint[]} first
 * @param {BezierBreakpoint[]} second
 * @returns {BezierBreakpoint[]}
 * @private
 */
const composeBezierBreakpoints = (
  first: BezierBreakpoint[],
  second: BezierBreakpoint[],
): BezierBreakpoint[] => first.map(([time, value, curve]) => [time / 2, value / 2, curve])
  .concat(second.map(([time, value, curve]) => [(time + 1) / 2, (value + 1) / 2, curve])) as BezierBreakpoint[];

/**
 * Gets bezier breakpoints for a decomposable curve.
 *
 * This method uses pre-calculated BezierBreakpoint[]s derived from the curve definitions in
 * @haiku/core/lib/vendor/just-curves using #math.
 *
 * Note: we could write some ugly code to express easeOutBounce and easeOutElastic in terms of easeInBounce and
 * easeInElastic respectively, but the overhead isn't quite worth it. Note that the "Out" variant of a set of "In"
 * breakpoints will always reverse it, translate the start times and start values across the unit counter-diagonal
 * (e.g. <0.637, 0> becomes <0.363, 1>), and shift the indices of the start times and start values forward (but not the
 * corresponding curves).
 *
 * @param {Curve} curve
 * @returns {BezierBreakpoint[]}
 * @private
 */
const getBezierBreakpointsForDecomposableCurve = (curve: Curve): BezierBreakpoint[] => {
  switch (curve) {
    case Curve.EaseInBounce:
      return [
        [0, 0, Curve.EaseInQuad],
        [0.0455, 0.0156, Curve.EaseOutQuad],
        [0.091, 0, Curve.EaseInQuad],
        [0.182, 0.0625, Curve.EaseOutQuad],
        [0.273, 0, Curve.EaseInQuad],
        [0.455, 0.25, Curve.EaseOutQuad],
        [0.637, 0, Curve.EaseInQuad],
      ];
    case Curve.EaseOutBounce:
      return [
        [0, 0, Curve.EaseInQuad],
        [0.363, 1, Curve.EaseOutQuad],
        [0.545, 0.75, Curve.EaseInQuad],
        [0.727, 1, Curve.EaseOutQuad],
        [0.818, 0.9375, Curve.EaseInQuad],
        [0.909, 1, Curve.EaseOutQuad],
        [0.9545, 0.9844, Curve.EaseInQuad],
      ];
    case Curve.EaseInOutBounce:
      return composeBezierBreakpoints(
        getBezierBreakpointsForDecomposableCurve(Curve.EaseInBounce),
        getBezierBreakpointsForDecomposableCurve(Curve.EaseOutBounce),
      );
    case Curve.EaseInElastic:
      return [
        [0, 0, Curve.EaseOutSine],
        [0.2265, 0.0043, Curve.EaseInSine],
        [0.3, 0, Curve.EaseOutSine],
        [0.4265, -0.0172, Curve.EaseInSine],
        [0.5, 0, [0.633, 0.444, 0.6, -1.5]],
      ];
    case Curve.EaseOutElastic:
      return [
        [0, 0, [0.4, 2.5, 0.367, 0.556]],
        [0.5, 1, Curve.EaseOutSine],
        [0.5735, 1.0172, Curve.EaseInSine],
        [0.7, 1, Curve.EaseOutSine],
        [0.7735, 0.9957, Curve.EaseInSine],
      ];
    case Curve.EaseInOutElastic:
      return composeBezierBreakpoints(
        getBezierBreakpointsForDecomposableCurve(Curve.EaseInElastic),
        getBezierBreakpointsForDecomposableCurve(Curve.EaseOutElastic),
      );
    default:
      // We shouldn't actually ever encounter this situation during export, since the exporter only tries to
      // decompose compound curves.
      throw new Error('Illegal attempt to retrieve bezier breakpoints for a non-decomposable curve.');
  }
};

/**
 * Determines if a curve is an ...Elastic curve.
 * @param {Curve} curve
 * @returns {boolean}
 * @private
 */
const isElasticCurve = (curve: Curve) => /Elastic$/.test(curve);

/**
 * Determines if a curve is a ...Bounce curve.
 * @param {Curve} curve
 * @returns {boolean}
 * @private
 */
const isBounceCurve = (curve: Curve) => /Bounce/.test(curve);

/**
 * Determines if a curve is a decomposable (...Bounce or ...Elastic) curve.
 * @param {Curve} curve
 * @returns {boolean}
 */
export const isDecomposableCurve = (curve: Curve) => isBounceCurve(curve) || isElasticCurve(curve);

/**
 * Decomposes a compound curve between keyframes.
 *
 * @param timelineProperty
 * @param inKeyframe
 * @param outKeyframe
 */
export const decomposeCurveBetweenKeyframes = (
  timelineProperty: BytecodeTimelineProperty,
  inKeyframe: number,
  outKeyframe: number,
) => {
  // #FIXME: this will only work correctly for numbers right now.
  // To do this correctly for e.g. paths, we would need more data.
  if (
    typeof timelineProperty[inKeyframe].value !== typeof timelineProperty[outKeyframe].value ||
    typeof timelineProperty[inKeyframe].value !== 'number'
  ) {
    timelineProperty[inKeyframe].curve = Curve.Linear;
    return;
  }

  const [curveIn, from, to] = [
    timelineProperty[inKeyframe].curve,
    timelineProperty[inKeyframe].value,
    timelineProperty[outKeyframe].value,
  ];

  const getKeyframe = (normalizedTime: number) => Math.floor(denormalizeValue(normalizedTime, inKeyframe, outKeyframe));
  const getValue = (normalizedPosition: number) => denormalizeValue(normalizedPosition, from as number, to as number);

  // TODO: remove need for typecasting here.
  getBezierBreakpointsForDecomposableCurve(curveIn as Curve)
    .forEach(([startTime, startValue, curve]) => {
      timelineProperty[getKeyframe(startTime)] = {
        curve,
        value: getValue(startValue),
      };
    });
};
