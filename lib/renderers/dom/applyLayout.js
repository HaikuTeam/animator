"use strict";
exports.__esModule = true;
var applyCssLayout_1 = require("./../../layout/applyCssLayout");
var scopeOfElement_1 = require("./../../layout/scopeOfElement");
var modernizr_1 = require("./../../vendor/modernizr");
var getWindowsBrowserVersion_1 = require("./getWindowsBrowserVersion");
var isEdge_1 = require("./isEdge");
var isIE_1 = require("./isIE");
var isMobile_1 = require("./isMobile");
var isTextNode_1 = require("./isTextNode");
var DEFAULT_PIXEL_RATIO = 1.0;
var SVG = "svg";
var safeWindow = typeof window !== "undefined" && window;
var PLATFORM_INFO = {
    hasWindow: !!safeWindow,
    isMobile: isMobile_1["default"](safeWindow),
    isIE: isIE_1["default"](safeWindow),
    isEdge: isEdge_1["default"](safeWindow),
    windowsBrowserVersion: getWindowsBrowserVersion_1["default"](safeWindow),
    hasPreserve3d: modernizr_1["default"].hasPreserve3d(safeWindow),
    devicePixelRatio: DEFAULT_PIXEL_RATIO
};
var SVG_RENDERABLES = {
    a: true,
    audio: true,
    canvas: true,
    circle: true,
    ellipse: true,
    filter: true,
    foreignObject: true,
    g: true,
    iframe: true,
    image: true,
    line: true,
    mesh: true,
    path: true,
    polygon: true,
    polyline: true,
    rect: true,
    svg: true,
    "switch": true,
    symbol: true,
    text: true,
    textPath: true,
    tspan: true,
    unknown: true,
    use: true,
    video: true
};
function applyLayout(domElement, virtualElement, parentDomNode, parentVirtualElement, component, isPatchOperation, isKeyDifferent) {
    if (isTextNode_1["default"](virtualElement))
        return domElement;
    if (virtualElement.layout) {
        if (scopeOfElement_1["default"](virtualElement) === SVG &&
            !SVG_RENDERABLES[virtualElement.elementName]) {
            return domElement;
        }
        if (!parentVirtualElement.layout || !parentVirtualElement.layout.computed) {
            _warnOnce("Cannot compute layout without parent computed size (child: <" +
                virtualElement.elementName +
                ">; parent: <" +
                parentVirtualElement.elementName +
                ">)");
            return domElement;
        }
        var devicePixelRatio_1 = (component.config.options && component.config.options.devicePixelRatio) || DEFAULT_PIXEL_RATIO;
        var computedLayout = virtualElement.layout.computed;
        if (!computedLayout || computedLayout.invisible) {
            if (domElement.style.display !== "none") {
                domElement.style.display = "none";
            }
        }
        else {
            if (domElement.style.display !== "block") {
                domElement.style.display = "block";
            }
            component.config.options.platform = PLATFORM_INFO;
            applyCssLayout_1["default"](domElement, virtualElement, virtualElement.layout, computedLayout, devicePixelRatio_1, component);
        }
    }
    return domElement;
}
exports["default"] = applyLayout;
var warnings = {};
function _warnOnce(warning) {
    if (warnings[warning])
        return void 0;
    warnings[warning] = true;
    console.warn("[haiku player] warning:", warning);
}
//# sourceMappingURL=applyLayout.js.map