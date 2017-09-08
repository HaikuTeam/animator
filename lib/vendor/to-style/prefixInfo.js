var toUpperFirst = require("./stringUtils/toUpperFirst");
var re = /^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/;
var docStyle = typeof document === "undefined"
    ? {}
    : document.documentElement.style;
var prefixInfo = (function () {
    var prefix = (function () {
        for (var prop in docStyle) {
            if (re.test(prop)) {
                return prop.match(re)[0];
            }
        }
        if ("WebkitOpacity" in docStyle) {
            return "Webkit";
        }
        if ("KhtmlOpacity" in docStyle) {
            return "Khtml";
        }
        return "";
    })();
    var lower = prefix.toLowerCase();
    return {
        style: prefix,
        css: "-" + lower + "-",
        dom: {
            Webkit: "WebKit",
            ms: "MS",
            o: "WebKit"
        }[prefix] || toUpperFirst(prefix)
    };
})();
module.exports = prefixInfo;
