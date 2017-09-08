var VERSION = require("./../package.json").version;
var MAIN;
if (typeof window !== "undefined") {
    MAIN = window;
}
else if (typeof global !== "undefined") {
    MAIN = global;
}
else {
    MAIN = {};
}
if (!MAIN.HaikuHelpers) {
    MAIN.HaikuHelpers = {};
}
if (!MAIN.HaikuHelpers[VERSION]) {
    MAIN.HaikuHelpers[VERSION] = {
        helpers: {},
        schema: {}
    };
}
var exp = MAIN.HaikuHelpers[VERSION];
exp.register = function register(name, method) {
    exp.helpers[name] = method;
    exp.schema[name] = "function";
    return exp;
};
module.exports = exp;
