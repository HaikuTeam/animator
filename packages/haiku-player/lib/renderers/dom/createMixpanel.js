"use strict";
exports.__esModule = true;
var assign_1 = require("./../../vendor/assign");
var tiny_1 = require("./../../vendor/mixpanel-browser/tiny");
function createMixpanel(domElement, mixpanelToken, component) {
    var mixpanel = tiny_1["default"]();
    if (!mixpanel) {
        console.warn("[haiku player] mixpanel could not be initialized");
    }
    mixpanel.init(mixpanelToken, domElement);
    component.mixpanel = {
        track: function track(eventName, eventProperties) {
            var metadata = (component._bytecode && component._bytecode.metadata) || {};
            mixpanel.track(eventName, assign_1["default"]({
                platform: "dom"
            }, metadata, eventProperties));
        }
    };
    component.on("haikuComponentDidInitialize", function () {
        component.mixpanel.track("component:initialize");
    });
}
exports["default"] = createMixpanel;
//# sourceMappingURL=createMixpanel.js.map