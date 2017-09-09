"use strict";
exports.__esModule = true;
var array_unique_1 = require("./../vendor/array-unique");
var uniq = array_unique_1["default"].immutable;
var OBJECT = "object";
var FUNCTION = "function";
function isObject(value) {
    return value !== null && typeof value === OBJECT && !Array.isArray(value);
}
function isFunction(value) {
    return typeof value === FUNCTION;
}
function isEmpty(value) {
    return value === undefined;
}
function mergeIncoming(previous, incoming) {
    for (var key in incoming) {
        if (isEmpty(incoming[key]))
            continue;
        if (isObject(previous[key]) && isObject(incoming[key])) {
            previous[key] = mergeIncoming(previous[key], incoming[key]);
            continue;
        }
        previous[key] = incoming[key];
    }
    return previous;
}
function mergeValue(previous, incoming) {
    if (isFunction(previous) || isFunction(incoming)) {
        return incoming;
    }
    if (isObject(previous) && isObject(incoming)) {
        return mergeIncoming(previous, incoming);
    }
    return incoming;
}
exports["default"] = {
    isObject: isObject,
    isFunction: isFunction,
    isEmpty: isEmpty,
    mergeIncoming: mergeIncoming,
    mergeValue: mergeValue,
    uniq: uniq
};
//# sourceMappingURL=BasicUtils.js.map