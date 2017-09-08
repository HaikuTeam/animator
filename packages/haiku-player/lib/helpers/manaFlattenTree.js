var objectPath = require("./objectPath");
function flattenTree(list, node, options, depth, index) {
    if (!depth)
        depth = 0;
    if (!index)
        index = 0;
    list.push(node);
    if (typeof node !== "string") {
        node.__depth = depth;
        node.__index = index;
    }
    var children = objectPath(node, options.children);
    if (!children || children.length < 1)
        return list;
    if (typeof children === "string")
        return list;
    if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            flattenTree(list, children[i], options, depth + 1, i);
        }
    }
    else if (typeof children === "object") {
        children.__depth = depth + 1;
        children.__index = 0;
        list.push(children);
        return list;
    }
    return list;
}
module.exports = flattenTree;
