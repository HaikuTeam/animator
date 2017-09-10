"use strict";
exports.__esModule = true;
var createMixpanel_1 = require("./createMixpanel");
var createRightClickMenu_1 = require("./createRightClickMenu");
var getElementSize_1 = require("./getElementSize");
var getLocalDomEventPosition_1 = require("./getLocalDomEventPosition");
var patch_1 = require("./patch");
var render_1 = require("./render");
function HaikuDOMRenderer() {
    this._user = {
        mouse: {
            x: 0,
            y: 0,
            down: 0,
            buttons: [0, 0, 0]
        },
        keys: {},
        touches: [],
        mouches: []
    };
}
exports["default"] = HaikuDOMRenderer;
HaikuDOMRenderer.prototype.render = function renderWrap(domElement, virtualContainer, virtualTree, component) {
    return render_1["default"](domElement, virtualContainer, virtualTree, component);
};
HaikuDOMRenderer.prototype.patch = function patchWrap(domElement, virtualContainer, patchesDict, component) {
    return patch_1["default"](domElement, virtualContainer, patchesDict, component);
};
HaikuDOMRenderer.prototype.menuize = function menuize(domElement, component) {
    return createRightClickMenu_1["default"](domElement, component);
};
HaikuDOMRenderer.prototype.mixpanel = function mixpanel(domElement, mixpanelToken, component) {
    return createMixpanel_1["default"](domElement, mixpanelToken, component);
};
HaikuDOMRenderer.prototype.createContainer = function createContainer(domElement) {
    return {
        isContainer: true,
        layout: {
            computed: {
                size: getElementSize_1["default"](domElement)
            }
        }
    };
};
HaikuDOMRenderer.prototype.initialize = function initialize(domElement) {
    var user = this._user;
    function setMouse(mouseEvent) {
        var pos = getLocalDomEventPosition_1["default"](mouseEvent, domElement);
        user.mouse.x = pos.x;
        user.mouse.y = pos.y;
    }
    function setTouches(touchEvent) {
        user.touches.splice(0);
        for (var i = 0; i < touchEvent.touches.length; i++) {
            var touch = touchEvent.touches[i];
            var pos = getLocalDomEventPosition_1["default"](touch, domElement);
            user.touches.push(pos);
        }
    }
    function setMouches() {
        user.mouches.splice(0);
        if (user.mouse.down) {
            user.mouches.push(user.mouse);
        }
        user.mouches.push.apply(user.mouches, user.touches);
    }
    function clearKey() {
        for (var which in user.keys)
            user.keys[which] = 0;
    }
    function clearMouse() {
        user.mouse.down = 0;
        user.touches.splice(0);
        for (var i = 0; i < user.mouse.buttons.length; i++) {
            user.mouse.buttons[i] = 0;
        }
    }
    function clearMouch() {
        user.mouches.splice(0);
    }
    function clearTouch() {
        user.touches.splice(0);
    }
    domElement.addEventListener("mousedown", function _mousedownandler(mouseEvent) {
        ++user.mouse.down;
        ++user.mouse.buttons[mouseEvent.button];
        setMouse(mouseEvent);
        setMouches();
    });
    domElement.addEventListener("mouseup", function _mouseupHandler(mouseEvent) {
        clearMouse();
        clearMouch();
        setMouches();
    });
    domElement.addEventListener("mousemove", function _mousemoveHandler(mouseEvent) {
        setMouse(mouseEvent);
        setMouches();
    });
    domElement.addEventListener("mouseenter", function _mouseenterHandler(mouseEvent) {
        clearMouse();
        clearMouch();
    });
    domElement.addEventListener("mouseleave", function _mouseenterHandler(mouseEvent) {
        clearMouse();
        clearMouch();
    });
    domElement.addEventListener("wheel", function _wheelHandler(mouseEvent) {
        setMouse(mouseEvent);
        setMouches();
    });
    var doc = domElement.ownerDocument;
    var win = doc.defaultView || doc.parentWindow;
    doc.addEventListener("keydown", function _keydownHandler(keyEvent) {
        if (user.keys[keyEvent.which] === undefined)
            user.keys[keyEvent.which] = 0;
        ++user.keys[keyEvent.which];
    });
    doc.addEventListener("keyup", function _keyupHandler(keyEvent) {
        if (user.keys[keyEvent.which] === undefined)
            user.keys[keyEvent.which] = 0;
        if (keyEvent.which === 91 || keyEvent.which === 17) {
            clearKey();
        }
        user.keys[keyEvent.which] = 0;
    });
    win.addEventListener("blur", function _blurHandlers(blurEvent) {
        clearKey();
        clearMouse();
        clearTouch();
        clearMouch();
    });
    win.addEventListener("focus", function _blurHandlers(blurEvent) {
        clearKey();
        clearMouse();
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchstart", function _touchstartHandler(touchEvent) {
        setTouches(touchEvent);
        setMouches();
    });
    domElement.addEventListener("touchend", function _touchsendHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchmove", function _touchmoveHandler(touchEvent) {
        setTouches(touchEvent);
        setMouches();
    });
    domElement.addEventListener("touchenter", function _touchenterHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
    domElement.addEventListener("touchleave", function _touchleaveHandler(touchEvent) {
        clearTouch();
        clearMouch();
    });
};
function _copy(a) {
    var b = [];
    for (var i = 0; i < a.length; i++)
        b[i] = a[i];
    return b;
}
function _clone(a) {
    var b = {};
    for (var key in a)
        b[key] = a[key];
    return b;
}
HaikuDOMRenderer.prototype.getUser = function getUser() {
    return {
        mouse: {
            x: this._user.mouse.x,
            y: this._user.mouse.y,
            down: this._user.mouse.down,
            buttons: _copy(this._user.mouse.buttons)
        },
        keys: _clone(this._user.keys),
        touches: _copy(this._user.touches),
        mouches: _copy(this._user.mouches)
    };
};
//# sourceMappingURL=HaikuDOMRenderer.js.map