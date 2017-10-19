"use strict";
exports.__esModule = true;
function getTimelineMaxTime(descriptor) {
    var max = 0;
    for (var selector in descriptor) {
        var group = descriptor[selector];
        for (var output in group) {
            var keyframes = group[output];
            var keys = Object.keys(keyframes);
            for (var i = 0; i < keys.length; i++) {
                var key = parseInt(keys[i], 10);
                if (key > max) {
                    max = key;
                }
            }
        }
    }
    return max;
}
exports["default"] = getTimelineMaxTime;
//# sourceMappingURL=getTimelineMaxTime.js.map