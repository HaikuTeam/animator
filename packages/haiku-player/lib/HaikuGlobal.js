"use strict";
exports.__esModule = true;
var enhance_1 = require("./reflection/enhance");
var inject_1 = require("./reflection/inject");
function buildRoot() {
    var ROOT = {};
    if (typeof window !== "undefined") {
        ROOT = window;
    }
    else if (typeof global !== "undefined") {
        ROOT = global;
    }
    else {
    }
    if (!ROOT["haiku"]) {
        ROOT["haiku"] = {};
    }
    if (!ROOT["haiku"]["enhance"]) {
        ROOT["haiku"]["enhance"] = enhance_1["default"];
    }
    if (!ROOT["haiku"]["inject"]) {
        ROOT["haiku"]["inject"] = inject_1["default"];
    }
    return ROOT["haiku"];
}
var haiku = buildRoot();
exports["default"] = haiku;
//# sourceMappingURL=HaikuGlobal.js.map