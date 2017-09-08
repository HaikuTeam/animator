var enhance = require("./enhance");
module.exports = function inject() {
    var args = [];
    for (var i = 0; i < arguments.length; i++)
        args[i] = arguments[i];
    var fn = args.shift();
    if (typeof fn !== "function") {
        console.warn("[haiku player] Inject expects a function as the first argument");
        return fn;
    }
    if (args.length > 0) {
        enhance(fn, args);
    }
    else {
        enhance(fn);
    }
    fn.injectee = true;
    return fn;
};
