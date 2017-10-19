"use strict";
exports.__esModule = true;
var reactChildrenToMana_1 = require("./reactChildrenToMana");
var STRING_TYPE = 'string';
function reactToMana(react) {
    var props = {};
    for (var key in react.props) {
        if (key !== 'children') {
            props[key] = react.props[key];
        }
    }
    var givenChildren = react.props.children || react.children;
    var processedChildren;
    if (Array.isArray(givenChildren)) {
        processedChildren = reactChildrenToMana_1["default"](givenChildren);
    }
    else if (givenChildren && givenChildren.type) {
        processedChildren = [reactToMana(givenChildren)];
    }
    else if (typeof givenChildren === STRING_TYPE) {
        processedChildren = [givenChildren];
    }
    return {
        elementName: react.type,
        attributes: props,
        children: processedChildren
    };
}
exports["default"] = reactToMana;
//# sourceMappingURL=reactToMana.js.map