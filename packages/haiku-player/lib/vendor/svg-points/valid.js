"use strict";
exports.__esModule = true;
var getErrors = function (shape) {
    var rules = getRules(shape);
    var errors = [];
    rules.map(function (_ref) {
        var match = _ref.match, prop = _ref.prop, required = _ref.required, type = _ref.type;
        if (typeof shape[prop] === "undefined") {
            if (required) {
                errors.push(prop +
                    " prop is required" +
                    (prop === "type" ? "" : " on a " + shape.type));
            }
        }
        else {
            if (typeof type !== "undefined") {
                if (type === "array") {
                    if (!Array.isArray(shape[prop])) {
                        errors.push(prop + " prop must be of type array");
                    }
                }
                else if (typeof shape[prop] !== type) {
                    errors.push(prop + " prop must be of type " + type);
                }
            }
            if (Array.isArray(match)) {
                if (match.indexOf(shape[prop]) === -1) {
                    errors.push(prop + " prop must be one of " + match.join(", "));
                }
            }
        }
    });
    if (shape.type === "g" && Array.isArray(shape.shapes)) {
        var childErrors = shape.shapes.map(function (s) {
            return getErrors(s);
        });
        return [].concat.apply(errors, childErrors);
    }
    return errors;
};
var getRules = function (shape) {
    var rules = [
        {
            match: [
                "circle",
                "ellipse",
                "line",
                "path",
                "polygon",
                "polyline",
                "rect",
                "g",
            ],
            prop: "type",
            required: true,
            type: "string"
        },
    ];
    switch (shape.type) {
        case "circle":
            rules.push({ prop: "cx", required: true, type: "number" });
            rules.push({ prop: "cy", required: true, type: "number" });
            rules.push({ prop: "r", required: true, type: "number" });
            break;
        case "ellipse":
            rules.push({ prop: "cx", required: true, type: "number" });
            rules.push({ prop: "cy", required: true, type: "number" });
            rules.push({ prop: "rx", required: true, type: "number" });
            rules.push({ prop: "ry", required: true, type: "number" });
            break;
        case "line":
            rules.push({ prop: "x1", required: true, type: "number" });
            rules.push({ prop: "x2", required: true, type: "number" });
            rules.push({ prop: "y1", required: true, type: "number" });
            rules.push({ prop: "y2", required: true, type: "number" });
            break;
        case "path":
            rules.push({ prop: "d", required: true, type: "string" });
            break;
        case "polygon":
        case "polyline":
            rules.push({ prop: "points", required: true, type: "string" });
            break;
        case "rect":
            rules.push({ prop: "height", required: true, type: "number" });
            rules.push({ prop: "rx", type: "number" });
            rules.push({ prop: "ry", type: "number" });
            rules.push({ prop: "width", required: true, type: "number" });
            rules.push({ prop: "x", required: true, type: "number" });
            rules.push({ prop: "y", required: true, type: "number" });
            break;
        case "g":
            rules.push({ prop: "shapes", required: true, type: "array" });
            break;
    }
    return rules;
};
var valid = function (shape) {
    var errors = getErrors(shape);
    return {
        errors: errors,
        valid: errors.length === 0
    };
};
exports["default"] = valid;
