var width = 256;
var chunks = 6;
var digits = 52;
var startdenom = Math.pow(width, chunks);
var significance = Math.pow(2, digits);
var overflow = significance * 2;
var mask = width - 1;
var pool = [];
function seedrandom(seed, options, callback) {
    var key = [];
    var arc4 = new ARC4(key);
    function prng() {
        var n = arc4.g(chunks);
        var d = startdenom;
        var x = 0;
        while (n < significance) {
            n = (n + x) * width;
            d *= width;
            x = arc4.g(1);
        }
        while (n >= overflow) {
            n /= 2;
            d /= 2;
            x >>>= 1;
        }
        return (n + x) / d;
    }
    prng.double = prng;
    mixkey(tostring(arc4.S), pool);
    return prng;
}
function ARC4(key) {
    var t;
    var keylen = key.length;
    var me = this;
    var i = 0;
    var j = me.i = me.j = 0;
    var s = me.S = [];
    if (!keylen) {
        key = [keylen++];
    }
    while (i < width) {
        s[i] = i++;
    }
    for (i = 0; i < width; i++) {
        s[i] = s[j = mask & (j + key[i % keylen] + (t = s[i]))];
        s[j] = t;
    }
    (me.g = function g(count) {
        var t;
        var r = 0;
        var i = me.i;
        var j = me.j;
        var s = me.S;
        while (count--) {
            t = s[i = mask & (i + 1)];
            r = r * width + s[mask & ((s[i] = s[j = mask & (j + t)]) + (s[j] = t))];
        }
        me.i = i;
        me.j = j;
        return r;
    })(width);
}
function mixkey(seed, key) {
    var stringseed = seed + "";
    var smear;
    var j = 0;
    while (j < stringseed.length) {
        key[mask & j] =
            mask & ((smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++));
    }
    return tostring(key);
}
function tostring(a) {
    return String.fromCharCode.apply(0, a);
}
module.exports = seedrandom;
//# sourceMappingURL=seedrandom.js.map