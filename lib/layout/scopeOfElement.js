"use strict";
exports.__esModule = true;
function scopeOfElement(mana) {
    if (mana.__scope) {
        return mana.__scope;
    }
    if (mana.__parent) {
        return scopeOfElement(mana.__parent);
    }
    return null;
}
exports["default"] = scopeOfElement;
//# sourceMappingURL=scopeOfElement.js.map