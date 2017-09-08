var getFlexId = require("./getFlexId");
module.exports = function shouldElementBeReplaced(domElement, virtualElement) {
    var oldFlexId = getFlexId(domElement);
    var newFlexId = getFlexId(virtualElement);
    if (oldFlexId && newFlexId) {
        if (oldFlexId !== newFlexId) {
            return true;
        }
    }
    return false;
};
