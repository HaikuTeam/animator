var objectPath = require("./objectPath");
function matchById(node, id, options) {
    var attributes = objectPath(node, options.attributes);
    if (attributes) {
        if (attributes.id === id) {
            return true;
        }
    }
}
module.exports = matchById;
