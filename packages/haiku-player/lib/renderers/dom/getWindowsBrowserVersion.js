module.exports = function getWindowsBrowser(window) {
    var rv = -1;
    if (!window)
        return rv;
    if (!window.navigator)
        return rv;
    if (!window.navigator.userAgent)
        return rv;
    if (!window.navigator.appName)
        return rv;
    if (window.navigator.appName === "Microsoft Internet Explorer") {
        var ua = window.navigator.userAgent;
        var re_1 = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re_1.exec(ua) !== null) {
            rv = parseFloat(RegExp.$1);
        }
    }
    else if (window.navigator.appName === "Netscape") {
        rv = (window.navigator.appVersion.indexOf("Trident") === -1) ? 12 : 11;
    }
    return rv;
};
