"use strict";
exports.__esModule = true;
var svg_points_1 = require("./../vendor/svg-points");
var parseCssValueString_1 = require("./parseCssValueString");
var SVG_TYPES = {
    g: true,
    rect: true,
    polyline: true,
    polygon: true,
    path: true,
    line: true,
    ellipse: true,
    circle: true
};
var SVG_POINT_NUMERIC_FIELDS = {
    cx: true,
    cy: true,
    r: true,
    rx: true,
    ry: true,
    x1: true,
    x2: true,
    x: true,
    y: true
};
var SVG_POINT_COMMAND_FIELDS = {
    d: true,
    points: true
};
var SVG_COMMAND_TYPES = {
    path: true,
    polyline: true,
    polygon: true
};
function polyPointsStringToPoints(pointsString) {
    if (!pointsString) {
        return [];
    }
    if (Array.isArray(pointsString)) {
        return pointsString;
    }
    var points = [];
    var couples = pointsString.split(/\s+/);
    for (var i = 0; i < couples.length; i++) {
        var pair = couples[i];
        var segs = pair.split(/,\s*/);
        var coord = [];
        if (segs[0]) {
            coord[0] = Number(segs[0]);
        }
        if (segs[1]) {
            coord[1] = Number(segs[1]);
        }
        points.push(coord);
    }
    return points;
}
function pointsToPolyString(points) {
    if (!points) {
        return '';
    }
    if (typeof points === 'string') {
        return points;
    }
    var arr = [];
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var seg = point.join(',');
        arr.push(seg);
    }
    return arr.join(' ');
}
function pathToPoints(pathString) {
    var shape = { type: 'path', d: pathString };
    return svg_points_1["default"].toPoints(shape);
}
function pointsToPath(pointsArray) {
    return svg_points_1["default"].toPath(pointsArray);
}
function manaToPoints(mana) {
    if (SVG_TYPES[mana.elementName] &&
        mana.elementName !== 'rect' &&
        mana.elementName !== 'g') {
        var shape = { type: mana.elementName };
        if (SVG_COMMAND_TYPES[shape.type]) {
            for (var f2 in SVG_POINT_COMMAND_FIELDS) {
                if (mana.attributes[f2]) {
                    shape[f2] = mana.attributes[f2];
                }
            }
        }
        else {
            for (var f1 in SVG_POINT_NUMERIC_FIELDS) {
                if (mana.attributes[f1]) {
                    shape[f1] = Number(mana.attributes[f1]);
                }
            }
        }
        return svg_points_1["default"].toPoints(shape);
    }
    else {
        var width = parseCssValueString_1["default"]((mana.layout &&
            mana.layout.computed &&
            mana.layout.computed.size &&
            mana.layout.computed.size.x) ||
            (mana.rect && mana.rect.width) ||
            (mana.attributes &&
                mana.attributes.style &&
                mana.attributes.style.width) ||
            (mana.attributes && mana.attributes.width) ||
            (mana.attributes && mana.attributes.x) ||
            0, null).value;
        var height = parseCssValueString_1["default"]((mana.layout &&
            mana.layout.computed &&
            mana.layout.computed.size &&
            mana.layout.computed.size.y) ||
            (mana.rect && mana.rect.height) ||
            (mana.attributes &&
                mana.attributes.style &&
                mana.attributes.style.height) ||
            (mana.attributes && mana.attributes.height) ||
            (mana.attributes && mana.attributes.y) ||
            0, null).value;
        var left = parseCssValueString_1["default"]((mana.rect && mana.rect.left) ||
            (mana.attributes.style && mana.attributes.style.left) ||
            mana.attributes.x ||
            0, null).value;
        var top_1 = parseCssValueString_1["default"]((mana.rect && mana.rect.top) ||
            (mana.attributes.style && mana.attributes.style.top) ||
            mana.attributes.y ||
            0, null).value;
        return svg_points_1["default"].toPoints({
            width: width,
            height: height,
            type: 'rect',
            x: left,
            y: top_1
        });
    }
}
exports["default"] = {
    pathToPoints: pathToPoints,
    pointsToPath: pointsToPath,
    polyPointsStringToPoints: polyPointsStringToPoints,
    pointsToPolyString: pointsToPolyString,
    manaToPoints: manaToPoints
};
//# sourceMappingURL=SVGPoints.js.map