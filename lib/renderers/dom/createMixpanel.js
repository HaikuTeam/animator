var assign = require("./../../vendor/assign");
var Mixpanel = require("./../../vendor/mixpanel-browser/tiny");
module.exports = function createMixpanel(domElement, mixpanelToken, component) {
    var mixpanel = Mixpanel();
    if (!mixpanel) {
        console.warn("[haiku player] mixpanel could not be initialized");
    }
    mixpanel.init(mixpanelToken, domElement);
    component.mixpanel = {
        track: function track(eventName, eventProperties) {
            var metadata = (component._bytecode && component._bytecode.metadata) || {};
            mixpanel.track(eventName, assign({
                platform: "dom"
            }, metadata, eventProperties));
        }
    };
    component.on("haikuComponentDidInitialize", function () {
        component.mixpanel.track("component:initialize");
    });
};
