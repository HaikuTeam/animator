"use strict";
exports.__esModule = true;
var MathUtils_1 = require("./MathUtils");
var parseCssValueString_1 = require("./parseCssValueString");
var Layout3D_1 = require("./../Layout3D");
var math3d_1 = require("./../vendor/math3d");
var mat4_decompose_1 = require("./../vendor/mat4-decompose");
var css_mat4_1 = require("./../vendor/css-mat4");
function separate(str) {
    var bits = str.split("(");
    var type = bits[0];
    var vals = bits[1].replace(")", "").split(/,\s*?/gi).map(function (str2) {
        return parseCssValueString_1["default"](str2, type);
    });
    return {
        type: type,
        values: vals
    };
}
function parseCssTransformString(str) {
    var out = {};
    if (!str)
        return out;
    if (str === "")
        return out;
    str = str.toLowerCase().replace(";", "").trim();
    if (str === "none")
        return out;
    var parts = str.match(/([a-zA-Z0-9]+\(.+?\))/gi);
    if (!parts)
        return out;
    var specs = parts.map(separate);
    var matrices = specs.map(function _map(spec) {
        var layout = {
            translate: [0, 0, 0],
            rotate: [0, 0, 0],
            scale: [1, 1, 1]
        };
        switch (spec.type) {
            case "rotatex":
                layout.rotate[0] = spec.values[0].value;
                break;
            case "rotatey":
                layout.rotate[1] = spec.values[0].value;
                break;
            case "rotatez":
                layout.rotate[2] = spec.values[0].value;
                break;
            case "translatex":
                layout.translate[0] = spec.values[0].value;
                break;
            case "translatey":
                layout.translate[1] = spec.values[0].value;
                break;
            case "translatez":
                layout.translate[2] = spec.values[0].value;
                break;
            case "scalex":
                layout.scale[0] = spec.values[0].value;
                break;
            case "scaley":
                layout.scale[1] = spec.values[0].value;
                break;
            case "scalez":
                layout.scale[2] = spec.values[0].value;
                break;
            case "rotate":
                if (spec.values[0].unit === "deg") {
                    var converted = MathUtils_1["default"].degreesToRadians(spec.values[0].value);
                    layout.rotate[2] = converted;
                }
                else {
                    layout.rotate[2] = spec.values[0].value;
                }
                break;
            case "scale":
                layout.scale[0] = spec.values[0].value;
                layout.scale[1] = spec.values[1].value;
                break;
            case "translate":
                layout.translate[0] = spec.values[0].value;
                layout.translate[1] = spec.values[1].value;
                break;
            case "matrix":
                layout.scale[0] = spec.values[0].value;
                layout.scale[1] = spec.values[3].value;
                layout.translate[0] = spec.values[4].value;
                layout.translate[1] = spec.values[5].value;
                break;
            case "rotate3d":
                layout.rotate[0] = spec.values[0].value;
                layout.rotate[1] = spec.values[1].value;
                layout.rotate[2] = spec.values[2].value;
                break;
            case "scale3d":
                layout.scale[0] = spec.values[0].value;
                layout.scale[1] = spec.values[1].value;
                layout.scale[2] = spec.values[2].value;
                break;
            case "translate3d":
                layout.translate[0] = spec.values[0].value;
                layout.translate[1] = spec.values[1].value;
                layout.translate[2] = spec.values[2].value;
                break;
            case "matrix3d":
                return Layout3D_1["default"].copyMatrix([], spec.values.map(function _mapper(val) {
                    return val.value;
                }));
            default:
                console.warn("No CSS transform parser available for " + spec.type);
                break;
        }
        var matrix = css_mat4_1["default"]([], layout);
        return matrix;
    });
    var product = Layout3D_1["default"].multiplyArrayOfMatrices(matrices.reverse());
    var components = {
        translation: [0, 0, 0],
        scale: [0, 0, 0],
        skew: [0, 0, 0],
        perspective: [0, 0, 0, 1],
        quaternion: [0, 0, 0, 1],
        rotation: [0, 0, 0]
    };
    mat4_decompose_1["default"](product, components.translation, components.scale, components.skew, components.perspective, components.quaternion);
    components.rotation = math3d_1["default"].getEulerAngles(components.quaternion[0], components.quaternion[1], components.quaternion[2], components.quaternion[3]);
    components.rotation[0] = MathUtils_1["default"].degreesToRadians(components.rotation[0]);
    components.rotation[1] = MathUtils_1["default"].degreesToRadians(components.rotation[1]);
    components.rotation[2] = MathUtils_1["default"].degreesToRadians(components.rotation[2]);
    for (var subkey in components) {
        for (var idx in components[subkey]) {
            components[subkey][idx] = parseFloat(components[subkey][idx].toFixed(2));
        }
    }
    if (components.translation[0] !== 0) {
        out["translation.x"] = components.translation[0];
    }
    if (components.translation[1] !== 0) {
        out["translation.y"] = components.translation[1];
    }
    if (components.translation[2] !== 0) {
        out["translation.z"] = components.translation[2];
    }
    if (components.rotation[0] !== 0)
        out["rotation.x"] = components.rotation[0];
    if (components.rotation[1] !== 0)
        out["rotation.y"] = components.rotation[1];
    if (components.rotation[2] !== 0)
        out["rotation.z"] = components.rotation[2];
    if (components.scale[0] !== 1)
        out["scale.x"] = components.scale[0];
    if (components.scale[1] !== 1)
        out["scale.y"] = components.scale[1];
    if (components.scale[2] !== 1)
        out["scale.z"] = components.scale[2];
    return out;
}
exports["default"] = parseCssTransformString;
//# sourceMappingURL=parseCssTransformString.js.map