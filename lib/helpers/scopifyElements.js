"use strict";
exports.__esModule = true;
var DEFAULT_SCOPE = "div";
var SCOPE_STRATA = {
    div: "div",
    svg: "svg"
};
var STRING = "string";
function scopifyElements(mana, parent, scope) {
    if (!mana)
        return mana;
    if (typeof mana === STRING)
        return mana;
    if (parent && !mana.__parent) {
        mana.__parent = parent;
    }
    mana.__scope = scope || DEFAULT_SCOPE;
    if (SCOPE_STRATA[mana.elementName]) {
        scope = SCOPE_STRATA[mana.elementName];
    }
    if (mana.children) {
        for (var i = 0; i < mana.children.length; i++) {
            var child = mana.children[i];
            scopifyElements(child, mana, scope);
        }
    }
}
exports["default"] = scopifyElements;
//# sourceMappingURL=scopifyElements.js.map