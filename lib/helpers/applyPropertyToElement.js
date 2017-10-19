"use strict";
exports.__esModule = true;
var vanities_1 = require("./../properties/dom/vanities");
function applyPropertyToElement(element, name, value, context, component) {
    var type = element.elementName;
    if (element.__instance) {
        var addressables = element.__instance.getAddressableProperties();
        if (addressables[name] !== undefined) {
            element.__instance.state[name] = value;
            return;
        }
        type = 'div';
    }
    if (vanities_1["default"][type] &&
        vanities_1["default"][type][name]) {
        vanities_1["default"][type][name](name, element, value, context, component);
    }
    else {
        element.attributes[name] = value;
    }
}
exports["default"] = applyPropertyToElement;
//# sourceMappingURL=applyPropertyToElement.js.map