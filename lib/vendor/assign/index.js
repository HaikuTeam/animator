module.exports = function assign(t) {
    for (var s_1, i = 1, n = arguments.length; i < n; i++) {
        s_1 = arguments[i];
        for (var p in s_1) {
            if (Object.prototype.hasOwnProperty.call(s_1, p)) {
                t[p] = s_1[p];
            }
        }
    }
    return t;
};
