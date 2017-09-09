declare const _default: {
    percentOfTime: (t0: any, t1: any, tnow: any) => number;
    valueAtPercent: (v0: any, v1: any, pc: any) => any;
    valueAtTime: (v0: any, v1: any, t0: any, t1: any, tnow: any) => any;
    interpolateValue: (v0: any, v1: any, t0: any, t1: any, tnow: any, curve: any) => any;
    interpolate: (now: any, curve: any, started: any, ends: any, origin: any, destination: any) => any;
    calculateValue: (keyframeGroup: any, nowValue: any) => any;
    sortedKeyframes: (keyframeGroup: any) => any;
    calculateValueAndReturnUndefinedIfNotWorthwhile: (keyframeGroup: any, nowValue: any) => any;
};
export default _default;
