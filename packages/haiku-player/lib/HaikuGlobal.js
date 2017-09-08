var ROOT;
if (typeof window !== "undefined") {
    ROOT = window;
}
else if (typeof global !== "undefined") {
    ROOT = global;
}
else {
    ROOT = {};
}
if (!ROOT.haiku) {
    ROOT.haiku = {};
}
if (!ROOT.haiku.enhance) {
    ROOT.haiku.enhance = require("./reflection/enhance");
}
if (!ROOT.haiku.inject) {
    ROOT.haiku.inject = require("./reflection/inject");
}
if (!ROOT.haiku.context) {
    ROOT.haiku.context = function context(mount, renderer, platform, bytecode, config) {
        return new HaikuContext(mount, renderer, platform, bytecode, config);
    };
}
if (!ROOT.haiku.component) {
    ROOT.haiku.component = function component(bytecode, context, config) {
        return new HaikuComponent(bytecode, context, config);
    };
}
module.exports = ROOT.haiku;
var HaikuContext = require("./HaikuContext");
var HaikuComponent = require("./HaikuComponent");
