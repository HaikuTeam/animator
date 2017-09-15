"use strict";
exports.__esModule = true;
var formatTransform_1 = require("./formatTransform");
var isEqualTransformString_1 = require("./isEqualTransformString");
var scopeOfElement_1 = require("./scopeOfElement");
var setStyleMatrix_1 = require("./setStyleMatrix");
var SVG = "svg";
function hasExplicitStyle(domElement, key) {
    if (!domElement.__haikuExplicitStyles)
        return false;
    return !!domElement.__haikuExplicitStyles[key];
}
function applyCssLayout(domElement, virtualElement, nodeLayout, computedLayout, pixelRatio, context) {
    if (computedLayout.opacity === undefined &&
        !computedLayout.size &&
        !computedLayout.matrix) {
        return;
    }
    var elementScope = scopeOfElement_1["default"](virtualElement);
    if (nodeLayout.shown === false) {
        if (domElement.style.visibility !== "hidden") {
            domElement.style.visibility = "hidden";
        }
    }
    else if (nodeLayout.shown === true) {
        if (domElement.style.visibility !== "visible") {
            domElement.style.visibility = "visible";
        }
    }
    if (!hasExplicitStyle(domElement, "opacity")) {
        if (computedLayout.opacity === undefined) {
        }
        else {
            var finalOpacity = void 0;
            if (computedLayout.opacity >= 0.999) {
                finalOpacity = 1;
            }
            else if (computedLayout.opacity <= 0.0001) {
                finalOpacity = 0;
            }
            else {
                finalOpacity = computedLayout.opacity;
            }
            var opacityString = "" + finalOpacity;
            if (domElement.style.opacity !== opacityString) {
                domElement.style.opacity = opacityString;
            }
        }
    }
    if (!hasExplicitStyle(domElement, "width")) {
        if (computedLayout.size.x !== undefined) {
            var sizeXString = parseFloat(computedLayout.size.x.toFixed(2)) + "px";
            if (domElement.style.width !== sizeXString) {
                domElement.style.width = sizeXString;
            }
            if (elementScope === SVG) {
                if (domElement.getAttribute("width") !== sizeXString) {
                    domElement.setAttribute("width", sizeXString);
                }
            }
        }
    }
    if (!hasExplicitStyle(domElement, "height")) {
        if (computedLayout.size.y !== undefined) {
            var sizeYString = parseFloat(computedLayout.size.y.toFixed(2)) + "px";
            if (domElement.style.height !== sizeYString) {
                domElement.style.height = sizeYString;
            }
            if (elementScope === SVG) {
                if (domElement.getAttribute("height") !== sizeYString) {
                    domElement.setAttribute("height", sizeYString);
                }
            }
        }
    }
    if (computedLayout.matrix) {
        var attributeTransform = domElement.getAttribute("transform");
        if (context.config.options.platform.isIE || context.config.options.platform.isEdge) {
            if (elementScope === SVG) {
                var matrixString = formatTransform_1["default"](computedLayout.matrix, nodeLayout.format, pixelRatio);
                if (!isEqualTransformString_1["default"](attributeTransform, matrixString)) {
                    domElement.setAttribute("transform", matrixString);
                }
            }
            else {
                setStyleMatrix_1["default"](domElement.style, nodeLayout.format, computedLayout.matrix, context.config.options.useWebkitPrefix, pixelRatio);
            }
        }
        else {
            if (!hasExplicitStyle(domElement, "transform")) {
                if (!attributeTransform ||
                    attributeTransform === "" ||
                    virtualElement.__transformed) {
                    setStyleMatrix_1["default"](domElement.style, nodeLayout.format, computedLayout.matrix, context.config.options.useWebkitPrefix, pixelRatio);
                }
            }
        }
    }
    return domElement.style;
}
exports["default"] = applyCssLayout;
//# sourceMappingURL=applyCssLayout.js.map