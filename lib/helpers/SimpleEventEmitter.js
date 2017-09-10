"use strict";
exports.__esModule = true;
function create(instance) {
    var registry = {};
    var eavesdroppers = [];
    instance.on = function on(key, fn) {
        if (!registry[key])
            registry[key] = [];
        for (var i = 0; i < registry[key].length; i++) {
            if (registry[key][i] === fn)
                return this;
        }
        registry[key].push(fn);
        return this;
    };
    instance.off = function off(key, fn) {
        var listeners = registry[key];
        if (!listeners || listeners.length < 1)
            return this;
        for (var i = 0; i < listeners.length; i++) {
            if (fn && listeners[i] === fn)
                listeners.splice(i, 1);
            else
                listeners.splice(i, 1);
        }
        return this;
    };
    instance.emit = function emit(key, msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z) {
        var listeners = registry[key];
        if (listeners && listeners.length > 0) {
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z);
            }
        }
        if (eavesdroppers.length > 0) {
            for (var j = 0; j < eavesdroppers.length; j++) {
                eavesdroppers[j](key, msg, a, b, c, d, e, f, g, h, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z);
            }
        }
        return this;
    };
    instance.hear = function hear(fn) {
        eavesdroppers.push(fn);
    };
    instance._registry = registry;
    instance._eavesdroppers = eavesdroppers;
    return instance;
}
exports["default"] = {
    create: create
};
//# sourceMappingURL=SimpleEventEmitter.js.map