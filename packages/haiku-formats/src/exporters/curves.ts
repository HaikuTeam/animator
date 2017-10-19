import {Curve} from 'haiku-common/lib/types/enums';

/**
 * Provide the interpolation points (the four arguments passed to `cubic-bezier(...)`) for a named curve.
 * TODO: Support non-bezier curves (*Bounce and *Elastic for now) by partitioning into a continuous set of beziers.
 * @param {Curve} curve
 * @returns {[number, number, number, number]}
 */
export const getCurveInterpolationPoints = (curve: Curve) => {
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
