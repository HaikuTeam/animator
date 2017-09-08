var toStyleObject = require("./toStyleObject");
var hasOwn = require("./hasOwn");
module.exports = function (styles, config) {
    styles = toStyleObject(styles, config);
    var result = [];
    var prop;
    for (prop in styles) {
        if (hasOwn(styles, prop)) {
            result.push(prop + ": " + styles[prop]);
        }
    }
    return result.join("; ");
};
