"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_dom_1 = require("react-dom");
var EventsDict_1 = require("./EventsDict");
var lodash_merge_1 = require("lodash.merge");
var DEFAULT_HOST_ELEMENT_TAG_NAME = "div";
var HAIKU_FORWARDED_PROPS = {
    haikuOptions: "options",
    haikuStates: "states",
    haikuInitialStates: "states",
    haikuEventHandlers: "eventHandlers",
    haikuTimelines: "timelines",
    haikuVanities: "vanities"
};
var VALID_PROPS = {
    tagName: "string",
    id: "string",
    className: "string",
    style: "object",
    width: "string",
    height: "string",
    onComponentWillMount: "func",
    onComponentWillUnmount: "func",
    onComponentDidMount: "func",
    onHaikuComponentWillInitialize: "func",
    onHaikuComponentDidMount: "func",
    onHaikuComponentDidInitialize: "func",
    onHaikuComponentWillUnmount: "func",
    haikuAdapter: "func",
    haikuCode: "object"
};
var REACT_ELEMENT_PROPS_TO_OMIT = {
    onComponentWillMount: true,
    onComponentWillUnmount: true,
    onComponentDidMount: true,
    onHaikuComponentWillInitialize: true,
    onHaikuComponentDidMount: true,
    onHaikuComponentDidInitialize: true,
    onHaikuComponentWillUnmount: true,
    haikuAdapter: true,
    haikuCode: true
};
for (var eventKey in EventsDict_1["default"]) {
    VALID_PROPS[eventKey] = EventsDict_1["default"][eventKey];
}
for (var fwdPropKey in HAIKU_FORWARDED_PROPS) {
    VALID_PROPS[fwdPropKey] = "object";
}
function HaikuReactDOMAdapter(HaikuComponentFactory, optionalRawBytecode) {
    var reactClass = react_1["default"].createClass({
        displayName: "HaikuComponent",
        getInitialState: function () {
            return {
                randomId: "haiku-reactroot-" + randomString(24)
            };
        },
        componentWillReceiveProps: function (nextPropsRaw) {
            if (this.haiku) {
                var haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(nextPropsRaw);
                this.haiku.assignConfig(haikuConfig);
            }
        },
        componentWillMount: function () {
            if (this.props.onComponentWillMount) {
                this.props.onComponentWillMount(this);
            }
        },
        componentWillUnmount: function () {
            if (this.props.onComponentWillUnmount) {
                this.props.onComponentWillUnmount(this);
            }
            if (this.haiku) {
                this.haiku.callUnmount();
            }
        },
        componentDidMount: function () {
            this.attemptMount();
        },
        attemptMount: function () {
            if (this.mount) {
                this.createContext(this.props);
                if (this.props.onComponentDidMount) {
                    this.props.onComponentDidMount(this, this.mount);
                }
            }
        },
        buildHaikuCompatibleConfigFromRawProps: function (rawProps) {
            var haikuConfig = {
                ref: this.mount,
                vanities: {
                    "controlFlow.placeholder": function _controlFlowPlaceholderReactVanity(element, surrogate, value, context, component) {
                        visit(this.mount, function visitor(node) {
                            var flexId = flexIdIfSame(element, node);
                            if (flexId) {
                                if (!component._didElementRenderSurrogate(element, surrogate)) {
                                    if (typeof surrogate.type === "string" || (typeof surrogate.type === "function" && surrogate.type.isHaikuAdapter)) {
                                        var div = document.createElement("div");
                                        node.parentNode.replaceChild(div, node);
                                        node = div;
                                        element.elementName = "div";
                                    }
                                    node.style.visibility = "hidden";
                                    react_dom_1["default"].render(surrogate, node);
                                    window.requestAnimationFrame(function frame() {
                                        component._markElementSurrogateAsRendered(element, surrogate);
                                        node.style.visibility = "visible";
                                    });
                                    component._markHorizonElement(element);
                                    component._markForFullFlush();
                                }
                            }
                        });
                    }.bind(this)
                }
            };
            if (rawProps) {
                for (var verboseKeyName in rawProps) {
                    var haikuConfigFinalKey = HAIKU_FORWARDED_PROPS[verboseKeyName];
                    if (haikuConfigFinalKey) {
                        haikuConfig[haikuConfigFinalKey] = rawProps[verboseKeyName];
                    }
                    else {
                        haikuConfig[verboseKeyName] = rawProps[verboseKeyName];
                    }
                }
            }
            return haikuConfig;
        },
        createContext: function (rawProps) {
            var haikuConfig = this.buildHaikuCompatibleConfigFromRawProps(rawProps);
            var haikuAdapter;
            if (rawProps.haikuAdapter) {
                if (rawProps.haikuCode) {
                    haikuAdapter = rawProps.haikuAdapter(rawProps.haikuCode);
                }
                else if (optionalRawBytecode) {
                    haikuAdapter = rawProps.haikuAdapter(optionalRawBytecode);
                }
                else {
                    throw new Error("A Haiku code object is required if you supply a Haiku adapter");
                }
            }
            else {
                haikuAdapter = HaikuComponentFactory;
            }
            if (!haikuAdapter) {
                throw new Error("A Haiku adapter is required");
            }
            if (!this.haiku) {
                this.haiku = haikuAdapter(this.mount, haikuConfig);
            }
            else {
                this.haiku.callRemount(haikuConfig);
            }
        },
        createEventPropWrapper: function (eventListener) {
            return function _eventPropWrapper(proxy, event) {
                return eventListener.call(this, proxy, event, this.haiku);
            }.bind(this);
        },
        buildHostElementPropsFromRawProps: function (rawProps) {
            var propsForHostElement = {};
            for (var key in rawProps) {
                if (VALID_PROPS[key]) {
                    if (EventsDict_1["default"][key]) {
                        propsForHostElement[key] = this.createEventPropWrapper(rawProps[key]);
                    }
                    else if (!HAIKU_FORWARDED_PROPS[key]) {
                        if (!REACT_ELEMENT_PROPS_TO_OMIT[key]) {
                            propsForHostElement[key] = rawProps[key];
                        }
                    }
                }
            }
            return lodash_merge_1["default"]({
                id: this.state.randomId,
                style: {
                    position: "relative",
                    margin: 0,
                    padding: 0,
                    border: 0,
                    width: "100%",
                    height: "100%",
                    transform: "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)"
                }
            }, propsForHostElement);
        },
        assignMountFromRef: function (element) {
            this.mount = element;
        },
        render: function () {
            var hostElementProps = this.buildHostElementPropsFromRawProps(this.props);
            hostElementProps.ref = this.assignMountFromRef;
            return react_1["default"].createElement(hostElementProps.tagName || DEFAULT_HOST_ELEMENT_TAG_NAME, hostElementProps);
        }
    });
    reactClass.propTypes = {};
    for (var propName in VALID_PROPS) {
        var propType = VALID_PROPS[propName];
        reactClass.propTypes[propName] = react_1["default"].PropTypes[propType];
    }
    reactClass.isHaikuAdapter = true;
    reactClass.React = react_1["default"];
    reactClass.ReactDOM = react_dom_1["default"];
    return reactClass;
}
exports["default"] = HaikuReactDOMAdapter;
var ALPHABET = "abcdefghijklmnopqrstuvwxyz";
function randomString(len) {
    var str = "";
    while (str.length < len) {
        str += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return str;
}
function visit(el, visitor) {
    if (el) {
        visitor(el);
        if (el.children) {
            for (var i = 0; i < el.children.length; i++) {
                visit(el.children[i], visitor);
            }
        }
    }
}
function flexIdIfSame(virtual, dom) {
    if (virtual.attributes) {
        if (virtual.attributes["haiku-id"]) {
            if (dom.getAttribute("haiku-id") === virtual.attributes["haiku-id"]) {
                return virtual.attributes["haiku-id"];
            }
        }
        if (virtual.attributes.id) {
            if (dom.getAttribute("id") === virtual.attributes.id) {
                return virtual.attributes.id;
            }
        }
    }
    return null;
}
//# sourceMappingURL=HaikuReactDOMAdapter.js.map