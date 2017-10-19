"use strict";
exports.__esModule = true;
var pkg = require('./../package.json');
var VERSION = pkg.version;
var MAIN = (typeof window !== 'undefined')
    ? window
    : (typeof global !== 'undefined')
        ? global
        : {};
if (!MAIN['HaikuHelpers']) {
    MAIN['HaikuHelpers'] = {};
}
if (!MAIN['HaikuHelpers'][VERSION]) {
    MAIN['HaikuHelpers'][VERSION] = {
        helpers: {},
        schema: {}
    };
}
var exp = MAIN['HaikuHelpers'][VERSION];
exp['register'] = function register(name, method) {
    exp.helpers[name] = method;
    exp.schema[name] = 'function';
    return exp;
};
exports["default"] = exp;
//# sourceMappingURL=HaikuHelpers.js.map