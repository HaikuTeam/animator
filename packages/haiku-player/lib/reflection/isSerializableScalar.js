"use strict";
exports.__esModule = true;
var STRING = 'string';
var NUMBER = 'number';
var BOOLEAN = 'boolean';
function isSerializableScalar(value) {
    return (value === null ||
        typeof value === NUMBER ||
        typeof value === STRING ||
        typeof value === BOOLEAN);
}
exports["default"] = isSerializableScalar;
//# sourceMappingURL=isSerializableScalar.js.map