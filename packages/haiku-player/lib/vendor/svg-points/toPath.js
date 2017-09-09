"use strict";
exports.__esModule = true;
var toPoints_1 = require("./toPoints");
function pointsToD(p) {
    var d = '';
    var i = 0;
    var firstPoint;
    for (var _i = 0, p_1 = p; _i < p_1.length; _i++) {
        var point = p_1[_i];
        var curve = point.curve, moveTo_1 = point.moveTo, x = point.x, y = point.y;
        var isFirstPoint = i === 0 || moveTo_1;
        var isLastPoint = i === p.length - 1 || p[i + 1].moveTo;
        var prevPoint = i === 0 ? null : p[i - 1];
        if (isFirstPoint) {
            firstPoint = point;
            if (!isLastPoint) {
                d += "M" + x + "," + y;
            }
        }
        else if (curve) {
            switch (curve.type) {
                case 'arc':
                    var _a = point.curve, _b = _a.largeArcFlag, largeArcFlag = _b === void 0 ? 0 : _b, rx = _a.rx, ry = _a.ry, _c = _a.sweepFlag, sweepFlag = _c === void 0 ? 0 : _c, _d = _a.xAxisRotation, xAxisRotation = _d === void 0 ? 0 : _d;
                    d += "A" + rx + "," + ry + "," + xAxisRotation + "," + largeArcFlag + "," + sweepFlag + "," + x + "," + y;
                    break;
                case 'cubic':
                    var _e = point.curve, cx1 = _e.x1, cy1 = _e.y1, cx2 = _e.x2, cy2 = _e.y2;
                    d += "C" + cx1 + "," + cy1 + "," + cx2 + "," + cy2 + "," + x + "," + y;
                    break;
                case 'quadratic':
                    var _f = point.curve, qx1 = _f.x1, qy1 = _f.y1;
                    d += "Q" + qx1 + "," + qy1 + "," + x + "," + y;
                    break;
            }
            if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
                d += 'Z';
            }
        }
        else if (isLastPoint && x === firstPoint.x && y === firstPoint.y) {
            d += 'Z';
        }
        else if (x !== prevPoint.x && y !== prevPoint.y) {
            d += "L" + x + "," + y;
        }
        else if (x !== prevPoint.x) {
            d += "H" + x;
        }
        else if (y !== prevPoint.y) {
            d += "V" + y;
        }
        i++;
    }
    return d;
}
function toPath(s) {
    var isPoints = Array.isArray(s);
    var isGroup = isPoints ? (Array.isArray(s[0])) : (s.type === 'g');
    var points = isPoints ? s : (isGroup ? s.shapes.map(function (shp) { return toPoints_1["default"](shp); }) : toPoints_1["default"](s));
    if (isGroup) {
        return points.map(function (p) { return pointsToD(p); });
    }
    return pointsToD(points);
}
exports["default"] = toPath;
//# sourceMappingURL=toPath.js.map