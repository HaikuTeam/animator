var functionToRFO = require("./functionToRFO");
module.exports = function enhance(fn, params) {
    if (!fn.specification) {
        var rfo = functionToRFO(fn);
        if (rfo && rfo.__function) {
            fn.specification = rfo.__function;
            if (params) {
                fn.specification.params = params;
            }
        }
        else {
            fn.specification = true;
        }
    }
};
