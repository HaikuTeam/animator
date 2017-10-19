"use strict";
exports.__esModule = true;
function domInjectStylesheet(doc, css) {
    if (doc.createStyleSheet) {
        var sheet = doc.createStyleSheet();
        sheet.cssText = css;
    }
    else {
        var head = doc.getElementsByTagName('head')[0];
        var style = doc.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        }
        else {
            style.appendChild(doc.createTextNode(css));
        }
        (head || doc.documentElement).appendChild(style);
    }
}
exports["default"] = domInjectStylesheet;
//# sourceMappingURL=domInjectStylesheet.js.map