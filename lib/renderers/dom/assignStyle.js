"use strict";
exports.__esModule = true;
function assignStyle(domElement, virtualElement, style, component, isPatchOperation) {
    if (!domElement.__haikuExplicitStyles)
        domElement.__haikuExplicitStyles = {};
    if (!isPatchOperation) {
        if (domElement.haiku &&
            domElement.haiku.element &&
            domElement.haiku.element.attributes &&
            domElement.haiku.element.attributes.style) {
            for (var oldStyleKey in domElement.haiku.element.attributes.style) {
                var newStyleValue = style[oldStyleKey];
                if (newStyleValue === null || newStyleValue === undefined) {
                    domElement.style[oldStyleKey] = null;
                }
            }
        }
    }
    for (var key in style) {
        var newProp = style[key];
        var previousProp = domElement.style[key];
        if (previousProp !== newProp) {
            domElement.__haikuExplicitStyles[key] = true;
            domElement.style[key] = style[key];
        }
    }
    return domElement;
}
exports["default"] = assignStyle;
//# sourceMappingURL=assignStyle.js.map