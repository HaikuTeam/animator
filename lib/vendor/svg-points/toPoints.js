"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
exports.__esModule = true;
var toPoints = function (spec) {
    switch (spec.type) {
        case 'circle':
            return getPointsFromCircle(spec);
        case 'ellipse':
            return getPointsFromEllipse(spec);
        case 'line':
            return getPointsFromLine(spec);
        case 'path':
            return getPointsFromPath(spec);
        case 'polygon':
            return getPointsFromPolygon(spec);
        case 'polyline':
            return getPointsFromPolyline(spec);
        case 'rect':
            return getPointsFromRect(spec);
        case 'g':
            return getPointsFromG(spec);
        default:
            throw new Error('Not a valid shape type');
    }
};
var getPointsFromCircle = function (_a) {
    var cx = _a.cx, cy = _a.cy, r = _a.r;
    return [
        { x: cx, y: cy - r, moveTo: true },
        { x: cx, y: cy + r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } },
        { x: cx, y: cy - r, curve: { type: 'arc', rx: r, ry: r, sweepFlag: 1 } }
    ];
};
var getPointsFromEllipse = function (_a) {
    var cx = _a.cx, cy = _a.cy, rx = _a.rx, ry = _a.ry;
    return [
        { x: cx, y: cy - ry, moveTo: true },
        { x: cx, y: cy + ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } },
        { x: cx, y: cy - ry, curve: { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 } }
    ];
};
var getPointsFromLine = function (_a) {
    var x1 = _a.x1, x2 = _a.x2, y1 = _a.y1, y2 = _a.y2;
    return [
        { x: x1, y: y1, moveTo: true },
        { x: x2, y: y2 }
    ];
};
var validCommands = /[MmLlHhVvCcSsQqTtAaZz]/g;
var commandLengths = {
    A: 7,
    C: 6,
    H: 1,
    L: 2,
    M: 2,
    Q: 4,
    S: 4,
    T: 2,
    V: 1,
    Z: 0
};
var relativeCommands = [
    'a',
    'c',
    'h',
    'l',
    'm',
    'q',
    's',
    't',
    'v'
];
var PARSING_REGEXPS = {
    command: /^[MmLlHhVvCcSsQqTtAaZz]/g,
    whitespace: /^[\s]+/,
    comma: /^,/,
    number: /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^-?\d*\.?\d+(?:e[+-]?\d+)?/i
};
var isRelative = function (command) { return relativeCommands.indexOf(command) !== -1; };
var optionalArcKeys = ['xAxisRotation', 'largeArcFlag', 'sweepFlag'];
var getCommands = function (d) { return d.match(validCommands); };
function tokenize(d) {
    var tokens = [];
    var chunk = d;
    var total = chunk.length;
    var iterations = 0;
    while (chunk.length > 0) {
        for (var regexpName in PARSING_REGEXPS) {
            var match = PARSING_REGEXPS[regexpName].exec(chunk);
            if (match) {
                tokens.push({ type: regexpName, raw: match[0] });
                chunk = chunk.slice(match[0].length, chunk.length);
                break;
            }
        }
    }
    return tokens;
}
var getParams = function (d) {
    var tokens = tokenize(d);
    var fixed = tokens.filter(function (t) {
        return t.type === 'number' || t.type === 'command' || t.type === 'comma';
    }).map(function (t) {
        return t.raw;
    }).join(' ');
    var segs = fixed.split(validCommands)
        .map(function (p) {
        return p.trim();
    })
        .filter(function (p) {
        return p.length > 0;
    });
    var groups = segs.map(function (s) {
        return s.split(/[ ,]+/)
            .map(function (n) {
            return parseFloat(n);
        })
            .filter(function (n) {
            return !isNaN(n);
        });
    });
    return groups;
};
var getPointsFromPath = function (_a) {
    var d = _a.d;
    var commands = getCommands(d);
    var params = getParams(d);
    var points = [];
    var moveTo;
    for (var i = 0, l = commands.length; i < l; i++) {
        var command = commands[i];
        var upperCaseCommand = command.toUpperCase();
        var commandLength = commandLengths[upperCaseCommand];
        var relative = isRelative(command);
        var prevPoint = i === 0 ? null : points[points.length - 1];
        if (commandLength > 0) {
            var commandParams = params.shift();
            var iterations = commandParams.length / commandLength;
            for (var j = 0; j < iterations; j++) {
                switch (upperCaseCommand) {
                    case 'M':
                        var x = (relative && prevPoint ? prevPoint.x : 0) + commandParams.shift();
                        var y = (relative && prevPoint ? prevPoint.y : 0) + commandParams.shift();
                        moveTo = { x: x, y: y };
                        points.push({ x: x, y: y, moveTo: true });
                        break;
                    case 'L':
                        points.push({
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'H':
                        points.push({
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: prevPoint.y
                        });
                        break;
                    case 'V':
                        points.push({
                            x: prevPoint.x,
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'A':
                        points.push({
                            curve: {
                                type: 'arc',
                                rx: commandParams.shift(),
                                ry: commandParams.shift(),
                                xAxisRotation: commandParams.shift(),
                                largeArcFlag: commandParams.shift(),
                                sweepFlag: commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        for (var _i = 0, optionalArcKeys_1 = optionalArcKeys; _i < optionalArcKeys_1.length; _i++) {
                            var k = optionalArcKeys_1[_i];
                            if (points[points.length - 1]['curve'][k] === 0) {
                                delete points[points.length - 1]['curve'][k];
                            }
                        }
                        break;
                    case 'C':
                        points.push({
                            curve: {
                                type: 'cubic',
                                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y1: (relative ? prevPoint.y : 0) + commandParams.shift(),
                                x2: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y2: (relative ? prevPoint.y : 0) + commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'S':
                        var sx2 = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var sy2 = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var sx = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var sy = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var diff = { x: null, y: null };
                        var sx1 = void 0;
                        var sy1 = void 0;
                        if (prevPoint.curve && prevPoint.curve.type === 'cubic') {
                            diff.x = Math.abs(prevPoint.x - prevPoint.curve.x2);
                            diff.y = Math.abs(prevPoint.y - prevPoint.curve.y2);
                            sx1 = prevPoint.x < prevPoint.curve.x2 ? prevPoint.x - diff.x : prevPoint.x + diff.x;
                            sy1 = prevPoint.y < prevPoint.curve.y2 ? prevPoint.y - diff.y : prevPoint.y + diff.y;
                        }
                        else {
                            diff.x = Math.abs(sx - sx2);
                            diff.y = Math.abs(sy - sy2);
                            sx1 = prevPoint.x;
                            sy1 = prevPoint.y;
                        }
                        points.push({ curve: { type: 'cubic', x1: sx1, y1: sy1, x2: sx2, y2: sy2 }, x: sx, y: sy });
                        break;
                    case 'Q':
                        points.push({
                            curve: {
                                type: 'quadratic',
                                x1: (relative ? prevPoint.x : 0) + commandParams.shift(),
                                y1: (relative ? prevPoint.y : 0) + commandParams.shift()
                            },
                            x: (relative ? prevPoint.x : 0) + commandParams.shift(),
                            y: (relative ? prevPoint.y : 0) + commandParams.shift()
                        });
                        break;
                    case 'T':
                        var tx = (relative ? prevPoint.x : 0) + commandParams.shift();
                        var ty = (relative ? prevPoint.y : 0) + commandParams.shift();
                        var tx1 = void 0;
                        var ty1 = void 0;
                        if (prevPoint.curve && prevPoint.curve.type === 'quadratic') {
                            var diff_1 = {
                                x: Math.abs(prevPoint.x - prevPoint.curve.x1),
                                y: Math.abs(prevPoint.y - prevPoint.curve.y1)
                            };
                            tx1 = prevPoint.x < prevPoint.curve.x1 ? prevPoint.x - diff_1.x : prevPoint.x + diff_1.x;
                            ty1 = prevPoint.y < prevPoint.curve.y1 ? prevPoint.y - diff_1.y : prevPoint.y + diff_1.y;
                        }
                        else {
                            tx1 = prevPoint.x;
                            ty1 = prevPoint.y;
                        }
                        points.push({ curve: { type: 'quadratic', x1: tx1, y1: ty1 }, x: tx, y: ty });
                        break;
                }
            }
        }
        else {
            if (prevPoint.x !== moveTo.x || prevPoint.y !== moveTo.y) {
                points.push({ x: moveTo.x, y: moveTo.y });
            }
        }
    }
    return points;
};
var getPointsFromPolygon = function (_a) {
    var points = _a.points;
    return getPointsFromPoints({ closed: true, points: points });
};
var getPointsFromPolyline = function (_a) {
    var points = _a.points;
    return getPointsFromPoints({ closed: false, points: points });
};
var getPointsFromPoints = function (_a) {
    var closed = _a.closed, points = _a.points;
    var numbers = points.split(/[\s,]+/).map(function (n) { return parseFloat(n); });
    var p = numbers.reduce(function (arr, point, i) {
        if (i % 2 === 0) {
            arr.push({ x: point });
        }
        else {
            arr[(i - 1) / 2].y = point;
        }
        return arr;
    }, []);
    if (closed) {
        p.push(__assign({}, p[0]));
    }
    p[0].moveTo = true;
    return p;
};
var getPointsFromRect = function (_a) {
    var height = _a.height, rx = _a.rx, ry = _a.ry, width = _a.width, x = _a.x, y = _a.y;
    if (rx || ry) {
        return getPointsFromRectWithCornerRadius({
            height: height,
            rx: rx || ry,
            ry: ry || rx,
            width: width,
            x: x,
            y: y
        });
    }
    return getPointsFromBasicRect({ height: height, width: width, x: x, y: y });
};
var getPointsFromBasicRect = function (_a) {
    var height = _a.height, width = _a.width, x = _a.x, y = _a.y;
    return [
        { x: x, y: y, moveTo: true },
        { x: x + width, y: y },
        { x: x + width, y: y + height },
        { x: x, y: y + height },
        { x: x, y: y }
    ];
};
var getPointsFromRectWithCornerRadius = function (_a) {
    var height = _a.height, rx = _a.rx, ry = _a.ry, width = _a.width, x = _a.x, y = _a.y;
    var curve = { type: 'arc', rx: rx, ry: ry, sweepFlag: 1 };
    return [
        { x: x + rx, y: y, moveTo: true },
        { x: x + width - rx, y: y },
        { x: x + width, y: y + ry, curve: curve },
        { x: x + width, y: y + height - ry },
        { x: x + width - rx, y: y + height, curve: curve },
        { x: x + rx, y: y + height },
        { x: x, y: y + height - ry, curve: curve },
        { x: x, y: y + ry },
        { x: x + rx, y: y, curve: curve }
    ];
};
var getPointsFromG = function (_a) {
    var shapes = _a.shapes;
    return shapes.map(function (s) { return toPoints(s); });
};
exports["default"] = toPoints;
//# sourceMappingURL=toPoints.js.map