"use strict";
exports.__esModule = true;
var index_1 = require("./index");
var camelCaseRegex = /([a-z])[- ]([a-z])/ig;
var cssFunctionRegex = /^([a-z-]+)\(([^\)]+)\)$/i;
var cssEasings = { ease: index_1.ease, easeIn: index_1.easeIn, easeOut: index_1.easeOut, easeInOut: index_1.easeInOut, stepStart: index_1.stepStart, stepEnd: index_1.stepEnd, linear: index_1.linear };
var camelCaseMatcher = function (match, p1, p2) { return p1 + p2.toUpperCase(); };
var toCamelCase = function (value) { return typeof value === 'string'
    ? value.replace(camelCaseRegex, camelCaseMatcher) : ''; };
var find = function (nameOrCssFunction) {
    var easingName = toCamelCase(nameOrCssFunction);
    var easing = cssEasings[easingName] || nameOrCssFunction;
    var matches = cssFunctionRegex.exec(easing);
    if (!matches) {
        throw new Error('could not parse css function');
    }
    return [matches[1]].concat(matches[2].split(','));
};
exports.cssFunction = function (easingString) {
    var p = find(easingString);
    var fnName = p[0];
    if (fnName === 'steps') {
        return index_1.steps(+p[1], p[2]);
    }
    if (fnName === 'cubic-bezier') {
        return index_1.cubicBezier(+p[1], +p[2], +p[3], +p[4]);
    }
    if (fnName === 'frames') {
        return index_1.frames(+p[1]);
    }
    throw new Error('unknown css function');
};
//# sourceMappingURL=cssFunction.js.map