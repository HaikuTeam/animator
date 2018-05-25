export enum Curve {
    EaseInBack = 'easeInBack',
    EaseInCirc = 'easeInCirc',
    EaseInCubic = 'easeInCubic',
    EaseInExpo = 'easeInExpo',
    EaseInQuad = 'easeInQuad',
    EaseInQuart = 'easeInQuart',
    EaseInBounce = 'easeInBounce',
    EaseInElastic = 'easeInElastic',
    EaseInQuint = 'easeInQuint',
    EaseInSine = 'easeInSine',
    EaseOutBack = 'easeOutBack',
    EaseOutCirc = 'easeOutCirc',
    EaseOutCubic = 'easeOutCubic',
    EaseOutExpo = 'easeOutExpo',
    EaseOutQuad = 'easeOutQuad',
    EaseOutQuart = 'easeOutQuart',
    EaseOutBounce = 'easeOutBounce',
    EaseOutElastic = 'easeOutElastic',
    EaseOutQuint = 'easeOutQuint',
    EaseOutSine = 'easeOutSine',
    EaseInOutBack = 'easeInOutBack',
    EaseInOutCirc = 'easeInOutCirc',
    EaseInOutCubic = 'easeInOutCubic',
    EaseInOutExpo = 'easeInOutExpo',
    EaseInOutQuad = 'easeInOutQuad',
    EaseInOutQuart = 'easeInOutQuart',
    EaseInOutBounce = 'easeInOutBounce',
    EaseInOutElastic = 'easeInOutElastic',
    EaseInOutQuint = 'easeInOutQuint',
    EaseInOutSine = 'easeInOutSine',
    Linear = 'linear',
  }

/** 
 * Defines a normalized curve, to be used in BytecodeTimelineValue and also in 
 * state transition
 */ 
export type CurveFunction = ((offset :number) => number);


/** 
 * Can be a function or a string from just-curves. The string is
 * converted into CuverFunction inside Interpolate
 */ 
export type CurveDefinition = Curve|CurveFunction|number[];
