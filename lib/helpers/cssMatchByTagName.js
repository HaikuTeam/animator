var objectPath = require("./objectPath");
var STRING = "string";
var OBJECT = "object";
var FUNCTION = "function";
function _getFnName(fn) {
    if (fn.name) {
        return fn.name;
    }
    var str = fn.toString();
    var reg = /function ([^(]*)/;
    var ex = reg.exec(str);
    return ex && ex[1];
}
function matchByTagName(node, tagName, options) {
    var val = objectPath(node, options.name);
    if (val) {
        if (typeof val === STRING && val === tagName) {
            return true;
        }
        else if (typeof val === FUNCTION) {
            if (_getFnName(val) === tagName) {
                return true;
            }
        }
        else if (typeof val === OBJECT) {
            if (val.name === tagName || val.tagName === tagName) {
                return true;
            }
        }
    }
}
module.exports = matchByTagName;
