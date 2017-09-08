var baddies = 0;
function arrayParamToString(param) {
    var pieces = [];
    for (var i = 0; i < param.length; i++) {
        pieces.push(stringifyParam(param[i]));
    }
    return "[ " + pieces.join(", ") + " ]";
}
function objectParamToString(param) {
    var pieces = [];
    if (param.__rest) {
        return "..." + param.__rest;
    }
    for (var key in param) {
        pieces.push(stringifyParam(param[key], key));
    }
    return "{ " + pieces.join(", ") + " }";
}
function stringifyParam(param, key) {
    if (param && typeof param === "string") {
        return param;
    }
    if (param && Array.isArray(param)) {
        if (param.length < 1) {
            return key;
        }
        if (key) {
            return key + ", " + key + ": " + arrayParamToString(param);
        }
        return arrayParamToString(param);
    }
    if (param && typeof param === "object") {
        if (Object.keys(param).length < 1) {
            return key;
        }
        if (key) {
            return key + ", " + key + ": " + objectParamToString(param);
        }
        return objectParamToString(param);
    }
    return "__" + baddies++ + "__";
}
function marshalParams(params) {
    return params
        .map(function _mapper(param) {
        return stringifyParam(param);
    })
        .join(", ");
}
module.exports = marshalParams;
