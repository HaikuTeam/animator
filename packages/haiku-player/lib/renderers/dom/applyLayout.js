var isTextNode = require("./isTextNode");
var isIE = require("./isIE");
var isEdge = require("./isEdge");
var getWindowsBrowserVersion = require("./getWindowsBrowserVersion");
var isMobile = require("./isMobile");
var applyCssLayout = require("./../../layout/applyCssLayout");
var scopeOfElement = require("./../../layout/scopeOfElement");
var hasPreserve3d = require("./../../vendor/modernizr").hasPreserve3d;
var DEFAULT_PIXEL_RATIO = 1.0;
var SVG = "svg";
var safeWindow = typeof window !== "undefined" && window;
var PLATFORM_INFO = {
    hasWindow: !!safeWindow,
    isMobile: isMobile(safeWindow),
    isIE: isIE(safeWindow),
    isEdge: isEdge(safeWindow),
    windowsBrowserVersion: getWindowsBrowserVersion(safeWindow),
    hasPreserve3d: hasPreserve3d(safeWindow),
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
    if (isTextNode(virtualElement))
        return domElement;
    if (virtualElement.layout) {
        if (scopeOfElement(virtualElement) === SVG &&
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
            applyCssLayout(domElement, virtualElement, virtualElement.layout, computedLayout, devicePixelRatio_1, component);
        }
    }
    return domElement;
}
var warnings = {};
function _warnOnce(warning) {
    if (warnings[warning])
        return void 0;
    warnings[warning] = true;
    console.warn("[haiku player] warning:", warning);
}
module.exports = applyLayout;
