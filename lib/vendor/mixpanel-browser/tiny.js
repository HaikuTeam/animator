"use strict";
exports.__esModule = true;
function tiny() {
    if (typeof window === 'undefined') {
        return null;
    }
    if (typeof document === 'undefined') {
        return null;
    }
    function setup(doc, a) {
        if (!a.__SV) {
            var b = window;
            try {
                var c;
                var l;
                var i;
                var j = b.location;
                var g = j.hash;
                var cFunc = function cFunc(cFuncA, cFuncB) {
                    return (l = cFuncA.match(RegExp(cFuncB + '=([^&]*)'))) ? l[1] : null;
                };
                g &&
                    cFunc(g, 'state') &&
                    ((i = JSON.parse(decodeURIComponent(cFunc(g, 'state')))),
                        'mpeditor' === i.action &&
                            (b.sessionStorage.setItem('_mpcehash', g),
                                history.replaceState(i.desiredHash || '', doc.title, j.pathname + j.search)));
            }
            catch (exception) {
            }
            var arrayOfWords = [];
            window['mixpanel'] = a;
            a._i = [];
            a.init = function init(initB, initC, initF) {
                function splitterPusher(spArray, spString) {
                    var strParts = spString.split('.');
                    2 == strParts.length && ((spArray = spArray[strParts[0]]), (spString = strParts[1]));
                    spArray[spString] = function () {
                        spArray.push([spString].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                }
                var d = a;
                if ('undefined' !== typeof initF) {
                    d = a[initF] = [];
                }
                else {
                    initF = 'mixpanel';
                }
                d.people = d.people || [];
                d.toString = function toString1(toStringArg) {
                    var mpString = 'mixpanel';
                    'mixpanel' !== initF && (mpString += '.' + initF);
                    toStringArg || (mpString += ' (stub)');
                    return mpString;
                };
                d.people.toString = function toString2() {
                    return d.toString(1) + '.people (stub)';
                };
                arrayOfWords = 'disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user'.split(' ');
                for (var h = 0; h < arrayOfWords.length; h++) {
                    splitterPusher(d, arrayOfWords[h]);
                }
                a._i.push([initB, initC, initF]);
            };
            a.__SV = 1.2;
            var script = doc.createElement('script');
            script.type = 'text/javascript';
            script.async = !0;
            script.src = ('file:' === doc.location.protocol && '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'.match(/^\/\//))
                ? 'https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js'
                : '//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js';
            if (c && c.parentNode) {
                c.parentNode.insertBefore(b, c);
            }
        }
        return a;
    }
    return setup(document, window['mixpanel'] || []);
}
exports["default"] = tiny;
//# sourceMappingURL=tiny.js.map