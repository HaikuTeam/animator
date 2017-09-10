"use strict";
exports.__esModule = true;
var getNanoSeconds, hrtime, loadTime;
var invoke;
if (typeof performance !== "undefined" &&
    performance !== null &&
    performance.now) {
    invoke = function () {
        return performance.now();
    };
}
else if (typeof process !== "undefined" &&
    process !== null &&
    process.hrtime) {
    invoke = function () {
        return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function () {
        var hr;
        hr = hrtime();
        return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
}
else if (Date.now) {
    invoke = function () {
        return Date.now() - loadTime;
    };
    loadTime = Date.now();
}
else {
    invoke = function () {
        return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
}
function now() {
    return invoke();
}
exports["default"] = now;
//# sourceMappingURL=index.js.map