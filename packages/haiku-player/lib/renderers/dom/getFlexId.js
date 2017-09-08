var HAIKU_ID_ATTRIBUTE = "haiku-id";
var ID_ATTRIBUTE = "id";
module.exports = function getFlexId(element) {
    if (element) {
        if (element.getAttribute) {
            return element.getAttribute(HAIKU_ID_ATTRIBUTE) || element.getAttribute(ID_ATTRIBUTE);
        }
        else if (element.attributes) {
            return element.attributes[HAIKU_ID_ATTRIBUTE] || element.attributes[ID_ATTRIBUTE];
        }
    }
};
