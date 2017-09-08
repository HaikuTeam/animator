var objectHasOwn = Object.prototype.hasOwnProperty;
module.exports = function (object, propertyName) {
    return objectHasOwn.call(object, propertyName);
};
