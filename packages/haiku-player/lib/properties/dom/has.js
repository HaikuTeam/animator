function has() {
    var obj = {};
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        for (var name_1 in arg) {
            var fn = arg[name_1];
            obj[name_1] = fn;
        }
    }
    return obj;
}
module.exports = has;
