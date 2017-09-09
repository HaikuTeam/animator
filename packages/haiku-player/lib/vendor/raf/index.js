"use strict";
exports.__esModule = true;
var performance_now_1 = require("./../performance-now");
var root = typeof window === "undefined" ? global : window;
var vendors = ["moz", "webkit"];
var suffix = "AnimationFrame";
var raf = root["request" + suffix];
var caf = root["cancel" + suffix] || root["cancelRequest" + suffix];
for (var i = 0; !raf && i < vendors.length; i++) {
    raf = root[vendors[i] + "Request" + suffix];
    caf =
        root[vendors[i] + "Cancel" + suffix] ||
            root[vendors[i] + "CancelRequest" + suffix];
}
if (!raf || !caf) {
    var last_1 = 0, id_1 = 0, queue_1 = [], frameDuration_1 = 1000 / 60;
    raf = function (callback) {
        if (queue_1.length === 0) {
            var _now = performance_now_1["default"](), next = Math.max(0, frameDuration_1 - (_now - last_1));
            last_1 = next + _now;
            setTimeout(function () {
                var cp = queue_1.slice(0);
                queue_1.length = 0;
                for (var i = 0; i < cp.length; i++) {
                    if (!cp[i].cancelled) {
                        try {
                            cp[i].callback(last_1);
                        }
                        catch (e) {
                            setTimeout(function () {
                                throw e;
                            }, 0);
                        }
                    }
                }
            }, Math.round(next));
        }
        queue_1.push({
            handle: ++id_1,
            callback: callback,
            cancelled: false
        });
        return id_1;
    };
    caf = function (handle) {
        for (var i = 0; i < queue_1.length; i++) {
            if (queue_1[i].handle === handle) {
                queue_1[i].cancelled = true;
            }
        }
    };
}
function rafCall(fn) {
    return raf.call(root, fn);
}
function cafCall() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return caf.apply(root, args);
}
exports["default"] = {
    request: rafCall,
    cancel: cafCall
};
//# sourceMappingURL=index.js.map