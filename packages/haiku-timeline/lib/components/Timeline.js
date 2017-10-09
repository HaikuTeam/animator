'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jsxFileName = 'src/components/Timeline.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _archy = require('archy');

var _archy2 = _interopRequireDefault(_archy);

var _reactDraggable = require('react-draggable');

var _expressionToRO = require('@haiku/player/lib/reflection/expressionToRO');

var _expressionToRO2 = _interopRequireDefault(_expressionToRO);

var _TimelineProperty = require('haiku-bytecode/src/TimelineProperty');

var _TimelineProperty2 = _interopRequireDefault(_TimelineProperty);

var _actions = require('haiku-bytecode/src/actions');

var _actions2 = _interopRequireDefault(_actions);

var _ActiveComponent = require('haiku-serialization/src/model/ActiveComponent');

var _ActiveComponent2 = _interopRequireDefault(_ActiveComponent);

var _ItemHelpers = require('./helpers/ItemHelpers');

var _getMaximumMs = require('./helpers/getMaximumMs');

var _getMaximumMs2 = _interopRequireDefault(_getMaximumMs);

var _millisecondToNearestFrame = require('./helpers/millisecondToNearestFrame');

var _millisecondToNearestFrame2 = _interopRequireDefault(_millisecondToNearestFrame);

var _clearInMemoryBytecodeCaches = require('./helpers/clearInMemoryBytecodeCaches');

var _clearInMemoryBytecodeCaches2 = _interopRequireDefault(_clearInMemoryBytecodeCaches);

var _humanizePropertyName = require('./helpers/humanizePropertyName');

var _humanizePropertyName2 = _interopRequireDefault(_humanizePropertyName);

var _getPropertyValueDescriptor = require('./helpers/getPropertyValueDescriptor');

var _getPropertyValueDescriptor2 = _interopRequireDefault(_getPropertyValueDescriptor);

var _getMillisecondModulus = require('./helpers/getMillisecondModulus');

var _getMillisecondModulus2 = _interopRequireDefault(_getMillisecondModulus);

var _getFrameModulus = require('./helpers/getFrameModulus');

var _getFrameModulus2 = _interopRequireDefault(_getFrameModulus);

var _formatSeconds = require('./helpers/formatSeconds');

var _formatSeconds2 = _interopRequireDefault(_formatSeconds);

var _roundUp = require('./helpers/roundUp');

var _roundUp2 = _interopRequireDefault(_roundUp);

var _truncate = require('./helpers/truncate');

var _truncate2 = _interopRequireDefault(_truncate);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _KeyframeSVG = require('./icons/KeyframeSVG');

var _KeyframeSVG2 = _interopRequireDefault(_KeyframeSVG);

var _CurveSVGS = require('./icons/CurveSVGS');

var _DownCarrotSVG = require('./icons/DownCarrotSVG');

var _DownCarrotSVG2 = _interopRequireDefault(_DownCarrotSVG);

var _RightCarrotSVG = require('./icons/RightCarrotSVG');

var _RightCarrotSVG2 = _interopRequireDefault(_RightCarrotSVG);

var _ControlsArea = require('./ControlsArea');

var _ControlsArea2 = _interopRequireDefault(_ControlsArea);

var _ContextMenu = require('./ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _ExpressionInput = require('./ExpressionInput');

var _ExpressionInput2 = _interopRequireDefault(_ExpressionInput);

var _ClusterInputField = require('./ClusterInputField');

var _ClusterInputField2 = _interopRequireDefault(_ClusterInputField);

var _PropertyInputField = require('./PropertyInputField');

var _PropertyInputField2 = _interopRequireDefault(_PropertyInputField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* z-index guide
  keyframe: 1002
  transition body: 1002
  keyframe draggers: 1003
  inputs: 1004, (1005 active)
  trim-area 1006
  scrubber: 1006
  bottom controls: 10000 <- ka-boom!
*/

var electron = require('electron');
var webFrame = electron.webFrame;
if (webFrame) {
  if (webFrame.setZoomLevelLimits) webFrame.setZoomLevelLimits(1, 1);
  if (webFrame.setLayoutZoomLevelLimits) webFrame.setLayoutZoomLevelLimits(0, 0);
}

var DEFAULTS = {
  propertiesWidth: 300,
  timelinesWidth: 870,
  rowHeight: 25,
  inputCellWidth: 75,
  meterHeight: 25,
  controlsHeight: 42,
  visibleFrameRange: [0, 60],
  currentFrame: 0,
  maxFrame: null,
  durationTrim: 0,
  framesPerSecond: 60,
  timeDisplayMode: 'frames', // or 'frames'
  currentTimelineName: 'Default',
  isPlayerPlaying: false,
  playerPlaybackSpeed: 1.0,
  isShiftKeyDown: false,
  isCommandKeyDown: false,
  isControlKeyDown: false,
  isAltKeyDown: false,
  avoidTimelinePointerEvents: false,
  showHorzScrollShadow: false,
  selectedNodes: {},
  expandedNodes: {},
  activatedRows: {},
  hiddenNodes: {},
  inputSelected: null,
  inputFocused: null,
  expandedPropertyClusters: {},
  activeKeyframes: [],
  reifiedBytecode: null,
  serializedBytecode: null
};

var CURVESVGS = {
  EaseInBackSVG: _CurveSVGS.EaseInBackSVG,
  EaseInBounceSVG: _CurveSVGS.EaseInBounceSVG,
  EaseInCircSVG: _CurveSVGS.EaseInCircSVG,
  EaseInCubicSVG: _CurveSVGS.EaseInCubicSVG,
  EaseInElasticSVG: _CurveSVGS.EaseInElasticSVG,
  EaseInExpoSVG: _CurveSVGS.EaseInExpoSVG,
  EaseInQuadSVG: _CurveSVGS.EaseInQuadSVG,
  EaseInQuartSVG: _CurveSVGS.EaseInQuartSVG,
  EaseInQuintSVG: _CurveSVGS.EaseInQuintSVG,
  EaseInSineSVG: _CurveSVGS.EaseInSineSVG,
  EaseInOutBackSVG: _CurveSVGS.EaseInOutBackSVG,
  EaseInOutBounceSVG: _CurveSVGS.EaseInOutBounceSVG,
  EaseInOutCircSVG: _CurveSVGS.EaseInOutCircSVG,
  EaseInOutCubicSVG: _CurveSVGS.EaseInOutCubicSVG,
  EaseInOutElasticSVG: _CurveSVGS.EaseInOutElasticSVG,
  EaseInOutExpoSVG: _CurveSVGS.EaseInOutExpoSVG,
  EaseInOutQuadSVG: _CurveSVGS.EaseInOutQuadSVG,
  EaseInOutQuartSVG: _CurveSVGS.EaseInOutQuartSVG,
  EaseInOutQuintSVG: _CurveSVGS.EaseInOutQuintSVG,
  EaseInOutSineSVG: _CurveSVGS.EaseInOutSineSVG,
  EaseOutBackSVG: _CurveSVGS.EaseOutBackSVG,
  EaseOutBounceSVG: _CurveSVGS.EaseOutBounceSVG,
  EaseOutCircSVG: _CurveSVGS.EaseOutCircSVG,
  EaseOutCubicSVG: _CurveSVGS.EaseOutCubicSVG,
  EaseOutElasticSVG: _CurveSVGS.EaseOutElasticSVG,
  EaseOutExpoSVG: _CurveSVGS.EaseOutExpoSVG,
  EaseOutQuadSVG: _CurveSVGS.EaseOutQuadSVG,
  EaseOutQuartSVG: _CurveSVGS.EaseOutQuartSVG,
  EaseOutQuintSVG: _CurveSVGS.EaseOutQuintSVG,
  EaseOutSineSVG: _CurveSVGS.EaseOutSineSVG,
  LinearSVG: _CurveSVGS.LinearSVG
};

var THROTTLE_TIME = 17; // ms

function visit(node, visitor) {
  if (node.children) {
    for (var i = 0; i < node.children.length; i++) {
      var child = node.children[i];
      if (child && typeof child !== 'string') {
        visitor(child);
        visit(child, visitor);
      }
    }
  }
}

var Timeline = function (_React$Component) {
  _inherits(Timeline, _React$Component);

  function Timeline(props) {
    _classCallCheck(this, Timeline);

    var _this = _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).call(this, props));

    _this.state = _lodash2.default.assign({}, DEFAULTS);
    _this.ctxmenu = new _ContextMenu2.default(window, _this);

    _this.emitters = []; // Array<{eventEmitter:EventEmitter, eventName:string, eventHandler:Function}>

    _this._component = new _ActiveComponent2.default({
      alias: 'timeline',
      folder: _this.props.folder,
      userconfig: _this.props.userconfig,
      websocket: _this.props.websocket,
      platform: window,
      envoy: _this.props.envoy,
      WebSocket: window.WebSocket
    });

    // Since we store accumulated keyframe movements, we can send the websocket update in batches;
    // This improves performance and avoids unnecessary updates to the over views
    _this.debouncedKeyframeMoveAction = _lodash2.default.throttle(_this.debouncedKeyframeMoveAction.bind(_this), 250);
    _this.updateState = _this.updateState.bind(_this);
    _this.handleRequestElementCoordinates = _this.handleRequestElementCoordinates.bind(_this);
    window.timeline = _this;
    return _this;
  }

  _createClass(Timeline, [{
    key: 'flushUpdates',
    value: function flushUpdates() {
      var _this2 = this;

      if (!this.state.didMount) {
        return void 0;
      }
      if (Object.keys(this.updates).length < 1) {
        return void 0;
      }
      for (var key in this.updates) {
        if (this.state[key] !== this.updates[key]) {
          this.changes[key] = this.updates[key];
        }
      }
      var cbs = this.callbacks.splice(0);
      this.setState(this.updates, function () {
        _this2.clearChanges();
        cbs.forEach(function (cb) {
          return cb();
        });
      });
    }
  }, {
    key: 'updateState',
    value: function updateState(updates, cb) {
      for (var key in updates) {
        this.updates[key] = updates[key];
      }
      if (cb) {
        this.callbacks.push(cb);
      }
      this.flushUpdates();
    }
  }, {
    key: 'clearChanges',
    value: function clearChanges() {
      for (var k1 in this.updates) {
        delete this.updates[k1];
      }for (var k2 in this.changes) {
        delete this.changes[k2];
      }
    }
  }, {
    key: 'updateTime',
    value: function updateTime(currentFrame) {
      this.setState({ currentFrame: currentFrame });
    }
  }, {
    key: 'setRowCacheActivation',
    value: function setRowCacheActivation(_ref) {
      var componentId = _ref.componentId,
          propertyName = _ref.propertyName;

      this._rowCacheActivation = { componentId: componentId, propertyName: propertyName };
      return this._rowCacheActivation;
    }
  }, {
    key: 'unsetRowCacheActivation',
    value: function unsetRowCacheActivation(_ref2) {
      var componentId = _ref2.componentId,
          propertyName = _ref2.propertyName;

      this._rowCacheActivation = null;
      return this._rowCacheActivation;
    }

    /*
     * lifecycle/events
     * --------- */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      // Clean up subscriptions to prevent memory leaks and react warnings
      this.emitters.forEach(function (tuple) {
        tuple[0].removeListener(tuple[1], tuple[2]);
      });
      this.state.didMount = false;

      this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
      this._envoyClient.closeConnection();

      // Scroll.Events.scrollEvent.remove('begin');
      // Scroll.Events.scrollEvent.remove('end');
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this3 = this;

      this.setState({
        didMount: true
      });

      this.setState({
        timelinesWidth: document.body.clientWidth - this.state.propertiesWidth
      });

      window.addEventListener('resize', _lodash2.default.throttle(function () {
        if (_this3.state.didMount) {
          _this3.setState({ timelinesWidth: document.body.clientWidth - _this3.state.propertiesWidth });
        }
      }, THROTTLE_TIME));

      this.addEmitterListener(this.props.websocket, 'broadcast', function (message) {
        if (message.folder !== _this3.props.folder) return void 0;
        switch (message.name) {
          case 'component:reload':
            return _this3._component.mountApplication();
          default:
            return void 0;
        }
      });

      this.props.websocket.on('method', function (method, params, cb) {
        console.info('[timeline] action received', method, params);
        return _this3._component.callMethod(method, params, cb);
      });

      this._component.on('component:updated', function (maybeComponentIds, maybeTimelineName, maybeTimelineTime, maybePropertyNames, maybeMetadata) {
        console.info('[timeline] component updated', maybeComponentIds, maybeTimelineName, maybeTimelineTime, maybePropertyNames, maybeMetadata);

        // If we don't clear caches then the timeline fields might not update right after keyframe deletions
        _this3._component._clearCaches();

        var reifiedBytecode = _this3._component.getReifiedBytecode();
        var serializedBytecode = _this3._component.getSerializedBytecode();
        (0, _clearInMemoryBytecodeCaches2.default)(reifiedBytecode);

        _this3.setState({ reifiedBytecode: reifiedBytecode, serializedBytecode: serializedBytecode });

        if (maybeMetadata && maybeMetadata.from !== 'timeline') {
          if (maybeComponentIds && maybeTimelineName && maybePropertyNames) {
            maybeComponentIds.forEach(function (componentId) {
              _this3.minionUpdatePropertyValue(componentId, maybeTimelineName, maybeTimelineTime || 0, maybePropertyNames);
            });
          }
        }
      });

      this._component.on('element:selected', function (componentId) {
        console.info('[timeline] element selected', componentId);
        _this3.minionSelectElement({ componentId: componentId });
      });

      this._component.on('element:unselected', function (componentId) {
        console.info('[timeline] element unselected', componentId);
        _this3.minionUnselectElement({ componentId: componentId });
      });

      this._component.on('component:mounted', function () {
        var reifiedBytecode = _this3._component.getReifiedBytecode();
        var serializedBytecode = _this3._component.getSerializedBytecode();
        console.info('[timeline] component mounted', reifiedBytecode);
        _this3.rehydrateBytecode(reifiedBytecode, serializedBytecode);
        // this.updateTime(this.state.currentFrame)
      });

      // component:mounted fires when this finishes without error
      this._component.mountApplication();

      this._component.on('envoy:tourClientReady', function (client) {
        client.on('tour:requestElementCoordinates', _this3.handleRequestElementCoordinates);

        setTimeout(function () {
          client.next();
        });

        _this3.tourClient = client;
      });

      document.addEventListener('paste', function (pasteEvent) {
        console.info('[timeline] paste heard');
        var tagname = pasteEvent.target.tagName.toLowerCase();
        var editable = pasteEvent.target.getAttribute('contenteditable'); // Our input fields are <span>s
        if (tagname === 'input' || tagname === 'textarea' || editable) {
          console.info('[timeline] paste via default');
          // This is probably a property input, so let the default action happen
          // TODO: Make this check less brittle
        } else {
          // Notify creator that we have some content that the person wishes to paste on the stage;
          // the top level needs to handle this because it does content type detection.
          console.info('[timeline] paste delegated to plumbing');
          pasteEvent.preventDefault();
          _this3.props.websocket.send({
            type: 'broadcast',
            name: 'current-pasteable:request-paste',
            from: 'glass',
            data: null // This can hold coordinates for the location of the paste
          });
        }
      });

      document.body.addEventListener('keydown', this.handleKeyDown.bind(this), false);

      document.body.addEventListener('keyup', this.handleKeyUp.bind(this));

      this.addEmitterListener(this.ctxmenu, 'createKeyframe', function (componentId, timelineName, elementName, propertyName, startMs) {
        var frameInfo = _this3.getFrameInfo();
        var nearestFrame = (0, _millisecondToNearestFrame2.default)(startMs, frameInfo.mspf);
        var finalMs = Math.round(nearestFrame * frameInfo.mspf);
        _this3.executeBytecodeActionCreateKeyframe(componentId, timelineName, elementName, propertyName, finalMs /* value, curve, endms, endvalue */);
      });
      this.addEmitterListener(this.ctxmenu, 'splitSegment', function (componentId, timelineName, elementName, propertyName, startMs) {
        var frameInfo = _this3.getFrameInfo();
        var nearestFrame = (0, _millisecondToNearestFrame2.default)(startMs, frameInfo.mspf);
        var finalMs = Math.round(nearestFrame * frameInfo.mspf);
        _this3.executeBytecodeActionSplitSegment(componentId, timelineName, elementName, propertyName, finalMs);
      });
      this.addEmitterListener(this.ctxmenu, 'joinKeyframes', function (componentId, timelineName, elementName, propertyName, startMs, endMs, curveName) {
        _this3.tourClient.next();
        _this3.executeBytecodeActionJoinKeyframes(componentId, timelineName, elementName, propertyName, startMs, endMs, curveName);
      });
      this.addEmitterListener(this.ctxmenu, 'deleteKeyframe', function (componentId, timelineName, propertyName, startMs) {
        _this3.executeBytecodeActionDeleteKeyframe(componentId, timelineName, propertyName, startMs);
      });
      this.addEmitterListener(this.ctxmenu, 'changeSegmentCurve', function (componentId, timelineName, propertyName, startMs, curveName) {
        _this3.executeBytecodeActionChangeSegmentCurve(componentId, timelineName, propertyName, startMs, curveName);
      });
      this.addEmitterListener(this.ctxmenu, 'moveSegmentEndpoints', function (componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs) {
        _this3.executeBytecodeActionMoveSegmentEndpoints(componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs);
      });

      this.addEmitterListener(this._component._timelines, 'timeline-model:tick', function (currentFrame) {
        var frameInfo = _this3.getFrameInfo();
        _this3.updateTime(currentFrame);
        // If we got a tick, which occurs during Timeline model updating, then we want to pause it if the scrubber
        // has arrived at the maximum acceptible frame in the timeline.
        if (currentFrame > frameInfo.friMax) {
          _this3._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          _this3.setState({ isPlayerPlaying: false });
        }
        // If our current frame has gone outside of the interval that defines the timeline viewport, then
        // try to re-align the ticker inside of that range
        if (currentFrame >= frameInfo.friB || currentFrame < frameInfo.friA) {
          _this3.tryToLeftAlignTickerInVisibleFrameRange(frameInfo);
        }
      });

      this.addEmitterListener(this._component._timelines, 'timeline-model:authoritative-frame-set', function (currentFrame) {
        var frameInfo = _this3.getFrameInfo();
        _this3.updateTime(currentFrame);
        // If our current frame has gone outside of the interval that defines the timeline viewport, then
        // try to re-align the ticker inside of that range
        if (currentFrame >= frameInfo.friB || currentFrame < frameInfo.friA) {
          _this3.tryToLeftAlignTickerInVisibleFrameRange(frameInfo);
        }
      });
    }
  }, {
    key: 'handleRequestElementCoordinates',
    value: function handleRequestElementCoordinates(_ref3) {
      var selector = _ref3.selector,
          webview = _ref3.webview;

      if (webview !== 'timeline') {
        return;
      }

      try {
        // TODO: find if there is a better solution to this scape hatch
        var element = document.querySelector(selector);

        var _element$getBoundingC = element.getBoundingClientRect(),
            top = _element$getBoundingC.top,
            left = _element$getBoundingC.left;

        this.tourClient.receiveElementCoordinates('timeline', { top: top, left: left });
      } catch (error) {
        console.error('Error fetching ' + selector + ' in webview ' + webview);
      }
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(nativeEvent) {
      // Give the currently active expression input a chance to capture this event and short circuit us if so
      if (this.refs.expressionInput.willHandleExternalKeydownEvent(nativeEvent)) {
        return void 0;
      }

      // If the user hit the spacebar _and_ we aren't inside an input field, treat that like a playback trigger
      if (nativeEvent.keyCode === 32 && !document.querySelector('input:focus')) {
        this.togglePlayback();
        nativeEvent.preventDefault();
        return void 0;
      }

      switch (nativeEvent.which) {
        // case 27: //escape
        // case 32: //space
        case 37:
          // left
          if (this.state.isCommandKeyDown) {
            if (this.state.isShiftKeyDown) {
              this.setState({ visibleFrameRange: [0, this.state.visibleFrameRange[1]], showHorzScrollShadow: false });
              return this.updateTime(0);
            } else {
              return this.updateScrubberPosition(-1);
            }
          } else {
            if (this.state.showHorzScrollShadow && this.state.visibleFrameRange[0] === 0) {
              this.setState({ showHorzScrollShadow: false });
            }
            return this.updateVisibleFrameRange(-1);
          }

        case 39:
          // right
          if (this.state.isCommandKeyDown) {
            return this.updateScrubberPosition(1);
          } else {
            if (!this.state.showHorzScrollShadow) this.setState({ showHorzScrollShadow: true });
            return this.updateVisibleFrameRange(1);
          }

        // case 38: // up
        // case 40: // down
        // case 46: //delete
        // case 8: //delete
        // case 13: //enter
        case 16:
          return this.updateKeyboardState({ isShiftKeyDown: true });
        case 17:
          return this.updateKeyboardState({ isControlKeyDown: true });
        case 18:
          return this.updateKeyboardState({ isAltKeyDown: true });
        case 224:
          return this.updateKeyboardState({ isCommandKeyDown: true });
        case 91:
          return this.updateKeyboardState({ isCommandKeyDown: true });
        case 93:
          return this.updateKeyboardState({ isCommandKeyDown: true });
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(nativeEvent) {
      switch (nativeEvent.which) {
        // case 27: //escape
        // case 32: //space
        // case 37: //left
        // case 39: //right
        // case 38: //up
        // case 40: //down
        // case 46: //delete
        // case 8: //delete
        // case 13: //enter
        case 16:
          return this.updateKeyboardState({ isShiftKeyDown: false });
        case 17:
          return this.updateKeyboardState({ isControlKeyDown: false });
        case 18:
          return this.updateKeyboardState({ isAltKeyDown: false });
        case 224:
          return this.updateKeyboardState({ isCommandKeyDown: false });
        case 91:
          return this.updateKeyboardState({ isCommandKeyDown: false });
        case 93:
          return this.updateKeyboardState({ isCommandKeyDown: false });
      }
    }
  }, {
    key: 'updateKeyboardState',
    value: function updateKeyboardState(updates) {
      // If the input is focused, don't allow keyboard state changes to cause a re-render, otherwise
      // the input field will switch back to its previous contents (e.g. when holding down 'shift')
      if (!this.state.inputFocused) {
        return this.setState(updates);
      } else {
        for (var key in updates) {
          this.state[key] = updates[key];
        }
      }
    }
  }, {
    key: 'addEmitterListener',
    value: function addEmitterListener(eventEmitter, eventName, eventHandler) {
      this.emitters.push([eventEmitter, eventName, eventHandler]);
      eventEmitter.on(eventName, eventHandler);
    }

    /*
     * setters/updaters
     * --------- */

  }, {
    key: 'deselectNode',
    value: function deselectNode(node) {
      node.__isSelected = false;
      var selectedNodes = _lodash2.default.clone(this.state.selectedNodes);
      selectedNodes[node.attributes['haiku-id']] = false;
      this.setState({
        inputSelected: null, // Deselct any selected input
        inputFocused: null, // Cancel any pending change inside a focused input
        selectedNodes: selectedNodes,
        treeUpdate: Date.now()
      });
    }
  }, {
    key: 'selectNode',
    value: function selectNode(node) {
      node.__isSelected = true;
      var selectedNodes = _lodash2.default.clone(this.state.selectedNodes);
      selectedNodes[node.attributes['haiku-id']] = true;
      this.setState({
        inputSelected: null, // Deselct any selected input
        inputFocused: null, // Cancel any pending change inside a focused input
        selectedNodes: selectedNodes,
        treeUpdate: Date.now()
      });
    }
  }, {
    key: 'scrollToTop',
    value: function scrollToTop() {
      if (this.refs.scrollview) {
        this.refs.scrollview.scrollTop = 0;
      }
    }
  }, {
    key: 'scrollToNode',
    value: function scrollToNode(node) {
      var rowsData = this.state.componentRowsData || [];
      var foundIndex = null;
      var indexCounter = 0;
      rowsData.forEach(function (rowInfo, index) {
        if (rowInfo.isHeading) {
          indexCounter++;
        } else if (rowInfo.isProperty) {
          if (rowInfo.node && rowInfo.node.__isExpanded) {
            indexCounter++;
          }
        }
        if (foundIndex === null) {
          if (rowInfo.node && rowInfo.node === node) {
            foundIndex = indexCounter;
          }
        }
      });
      if (foundIndex !== null) {
        if (this.refs.scrollview) {
          this.refs.scrollview.scrollTop = foundIndex * this.state.rowHeight - this.state.rowHeight;
        }
      }
    }
  }, {
    key: 'findDomNodeOffsetY',
    value: function findDomNodeOffsetY(domNode) {
      var curtop = 0;
      if (domNode.offsetParent) {
        do {
          curtop += domNode.offsetTop;
        } while (domNode = domNode.offsetParent); // eslint-disable-line
      }
      return curtop;
    }
  }, {
    key: 'collapseNode',
    value: function collapseNode(node) {
      node.__isExpanded = false;
      visit(node, function (child) {
        child.__isExpanded = false;
        child.__isSelected = false;
      });
      var expandedNodes = this.state.expandedNodes;
      var componentId = node.attributes['haiku-id'];
      expandedNodes[componentId] = false;
      this.setState({
        inputSelected: null, // Deselct any selected input
        inputFocused: null, // Cancel any pending change inside a focused input
        expandedNodes: expandedNodes,
        treeUpdate: Date.now()
      });
    }
  }, {
    key: 'expandNode',
    value: function expandNode(node, componentId) {
      node.__isExpanded = true;
      if (node.parent) this.expandNode(node.parent); // If we are expanded, our parent has to be too
      var expandedNodes = this.state.expandedNodes;
      componentId = node.attributes['haiku-id'];
      expandedNodes[componentId] = true;
      this.setState({
        inputSelected: null, // Deselct any selected input
        inputFocused: null, // Cancel any pending change inside a focused input
        expandedNodes: expandedNodes,
        treeUpdate: Date.now()
      });
    }
  }, {
    key: 'activateRow',
    value: function activateRow(row) {
      if (row.property) {
        this.state.activatedRows[row.componentId + ' ' + row.property.name] = true;
      }
    }
  }, {
    key: 'deactivateRow',
    value: function deactivateRow(row) {
      if (row.property) {
        this.state.activatedRows[row.componentId + ' ' + row.property.name] = false;
      }
    }
  }, {
    key: 'isRowActivated',
    value: function isRowActivated(row) {
      if (row.property) {
        return this.state.activatedRows[row.componentId + ' ' + row.property.name];
      }
    }
  }, {
    key: 'isClusterActivated',
    value: function isClusterActivated(item) {
      return false; // TODO
    }
  }, {
    key: 'toggleTimeDisplayMode',
    value: function toggleTimeDisplayMode() {
      if (this.state.timeDisplayMode === 'frames') {
        this.setState({
          inputSelected: null,
          inputFocused: null,
          timeDisplayMode: 'seconds'
        });
      } else {
        this.setState({
          inputSelected: null,
          inputFocused: null,
          timeDisplayMode: 'frames'
        });
      }
    }
  }, {
    key: 'changeScrubberPosition',
    value: function changeScrubberPosition(dragX, frameInfo) {
      var dragStart = this.state.scrubberDragStart;
      var frameBaseline = this.state.frameBaseline;
      var dragDelta = dragX - dragStart;
      var frameDelta = Math.round(dragDelta / frameInfo.pxpf);
      var currentFrame = frameBaseline + frameDelta;
      if (currentFrame < frameInfo.friA) currentFrame = frameInfo.friA;
      if (currentFrame > frameInfo.friB) currentFrame = frameInfo.friB;
      this._component.getCurrentTimeline().seek(currentFrame);
    }
  }, {
    key: 'changeDurationModifierPosition',
    value: function changeDurationModifierPosition(dragX, frameInfo) {
      var _this4 = this;

      var dragStart = this.state.durationDragStart;
      var dragDelta = dragX - dragStart;
      var frameDelta = Math.round(dragDelta / frameInfo.pxpf);
      if (dragDelta > 0 && this.state.durationTrim >= 0) {
        if (!this.state.addInterval) {
          var addInterval = setInterval(function () {
            var currentMax = _this4.state.maxFrame ? _this4.state.maxFrame : frameInfo.friMax2;
            _this4.setState({ maxFrame: currentMax + 20 });
          }, 300);
          this.setState({ addInterval: addInterval });
        }
        this.setState({ dragIsAdding: true });
        return;
      }
      if (this.state.addInterval) clearInterval(this.state.addInterval);
      // Don't let user drag back past last frame; and don't let them drag more than an entire width of frames
      if (frameInfo.friB + frameDelta <= frameInfo.friMax || -frameDelta >= frameInfo.friB - frameInfo.friA) {
        frameDelta = this.state.durationTrim; // Todo: make more precise so it removes as many frames as
        return; // it can instead of completely ignoring the drag
      }
      this.setState({ durationTrim: frameDelta, dragIsAdding: false, addInterval: null });
    }
  }, {
    key: 'changeVisibleFrameRange',
    value: function changeVisibleFrameRange(xl, xr, frameInfo) {
      var absL = null;
      var absR = null;

      if (this.state.scrollerLeftDragStart) {
        absL = xl;
      } else if (this.state.scrollerRightDragStart) {
        absR = xr;
      } else if (this.state.scrollerBodyDragStart) {
        var offsetL = this.state.scrollbarStart * frameInfo.pxpf / frameInfo.scRatio;
        var offsetR = this.state.scrollbarEnd * frameInfo.pxpf / frameInfo.scRatio;
        var diffX = xl - this.state.scrollerBodyDragStart;
        absL = offsetL + diffX;
        absR = offsetR + diffX;
      }

      var fL = absL !== null ? Math.round(absL * frameInfo.scRatio / frameInfo.pxpf) : this.state.visibleFrameRange[0];
      var fR = absR !== null ? Math.round(absR * frameInfo.scRatio / frameInfo.pxpf) : this.state.visibleFrameRange[1];

      // Stop the scroller at the left side and lock the size
      if (fL <= frameInfo.fri0) {
        fL = frameInfo.fri0;
        if (!this.state.scrollerRightDragStart && !this.state.scrollerLeftDragStart) {
          fR = this.state.visibleFrameRange[1] - (this.state.visibleFrameRange[0] - fL);
        }
      }

      // Stop the scroller at the right side and lock the size
      if (fR >= frameInfo.friMax2) {
        fL = this.state.visibleFrameRange[0];
        if (!this.state.scrollerRightDragStart && !this.state.scrollerLeftDragStart) {
          fR = frameInfo.friMax2;
        }
      }

      this.setState({ visibleFrameRange: [fL, fR] });
    }
  }, {
    key: 'updateVisibleFrameRange',
    value: function updateVisibleFrameRange(delta) {
      var l = this.state.visibleFrameRange[0] + delta;
      var r = this.state.visibleFrameRange[1] + delta;
      if (l >= 0) {
        this.setState({ visibleFrameRange: [l, r] });
      }
    }

    // will left-align the current timeline window (maintaining zoom)

  }, {
    key: 'tryToLeftAlignTickerInVisibleFrameRange',
    value: function tryToLeftAlignTickerInVisibleFrameRange(frameInfo) {
      var l = this.state.visibleFrameRange[0];
      var r = this.state.visibleFrameRange[1];
      var span = r - l;
      var newL = this.state.currentFrame;
      var newR = newL + span;

      if (newR > frameInfo.friMax) {
        newL -= newR - frameInfo.friMax;
        newR = frameInfo.friMax;
      }

      this.setState({ visibleFrameRange: [newL, newR] });
    }
  }, {
    key: 'updateScrubberPosition',
    value: function updateScrubberPosition(delta) {
      var currentFrame = this.state.currentFrame + delta;
      if (currentFrame <= 0) currentFrame = 0;
      this._component.getCurrentTimeline().seek(currentFrame);
    }
  }, {
    key: 'executeBytecodeActionCreateKeyframe',
    value: function executeBytecodeActionCreateKeyframe(componentId, timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue) {
      // Note that if startValue is undefined, the previous value will be examined to determine the value of the present one
      _actions2.default.createKeyframe(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue, this._component.fetchActiveBytecodeFile().get('hostInstance'), this._component.fetchActiveBytecodeFile().get('states'));
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      // No need to 'expressionToRO' here because if we got an expression, that would have already been provided in its serialized __function form
      this.props.websocket.action('createKeyframe', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, startValue, maybeCurve, endMs, endValue], function () {});

      if (elementName === 'svg' && propertyName === 'opacity') {
        this.tourClient.next();
      }
    }
  }, {
    key: 'executeBytecodeActionSplitSegment',
    value: function executeBytecodeActionSplitSegment(componentId, timelineName, elementName, propertyName, startMs) {
      _actions2.default.splitSegment(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      this.props.websocket.action('splitSegment', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs], function () {});
    }
  }, {
    key: 'executeBytecodeActionJoinKeyframes',
    value: function executeBytecodeActionJoinKeyframes(componentId, timelineName, elementName, propertyName, startMs, endMs, curveName) {
      _actions2.default.joinKeyframes(this.state.reifiedBytecode, componentId, timelineName, elementName, propertyName, startMs, endMs, curveName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode(),
        keyframeDragStartPx: false,
        keyframeDragStartMs: false,
        transitionBodyDragging: false
      });
      // In the future, curve may be a function
      var curveForWire = (0, _expressionToRO2.default)(curveName);
      this.props.websocket.action('joinKeyframes', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, endMs, curveForWire], function () {});
    }
  }, {
    key: 'executeBytecodeActionDeleteKeyframe',
    value: function executeBytecodeActionDeleteKeyframe(componentId, timelineName, propertyName, startMs) {
      _actions2.default.deleteKeyframe(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode(),
        keyframeDragStartPx: false,
        keyframeDragStartMs: false,
        transitionBodyDragging: false
      });
      this.props.websocket.action('deleteKeyframe', [this.props.folder, [componentId], timelineName, propertyName, startMs], function () {});
    }
  }, {
    key: 'executeBytecodeActionChangeSegmentCurve',
    value: function executeBytecodeActionChangeSegmentCurve(componentId, timelineName, propertyName, startMs, curveName) {
      _actions2.default.changeSegmentCurve(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs, curveName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      // In the future, curve may be a function
      var curveForWire = (0, _expressionToRO2.default)(curveName);
      this.props.websocket.action('changeSegmentCurve', [this.props.folder, [componentId], timelineName, propertyName, startMs, curveForWire], function () {});
    }
  }, {
    key: 'executeBytecodeActionChangeSegmentEndpoints',
    value: function executeBytecodeActionChangeSegmentEndpoints(componentId, timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs) {
      _actions2.default.changeSegmentEndpoints(this.state.reifiedBytecode, componentId, timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      this.props.websocket.action('changeSegmentEndpoints', [this.props.folder, [componentId], timelineName, propertyName, oldStartMs, oldEndMs, newStartMs, newEndMs], function () {});
    }
  }, {
    key: 'executeBytecodeActionRenameTimeline',
    value: function executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName) {
      _actions2.default.renameTimeline(this.state.reifiedBytecode, oldTimelineName, newTimelineName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      this.props.websocket.action('renameTimeline', [this.props.folder, oldTimelineName, newTimelineName], function () {});
    }
  }, {
    key: 'executeBytecodeActionCreateTimeline',
    value: function executeBytecodeActionCreateTimeline(timelineName) {
      _actions2.default.createTimeline(this.state.reifiedBytecode, timelineName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      // Note: We may need to remember to serialize a timeline descriptor here
      this.props.websocket.action('createTimeline', [this.props.folder, timelineName], function () {});
    }
  }, {
    key: 'executeBytecodeActionDuplicateTimeline',
    value: function executeBytecodeActionDuplicateTimeline(timelineName) {
      _actions2.default.duplicateTimeline(this.state.reifiedBytecode, timelineName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      this.props.websocket.action('duplicateTimeline', [this.props.folder, timelineName], function () {});
    }
  }, {
    key: 'executeBytecodeActionDeleteTimeline',
    value: function executeBytecodeActionDeleteTimeline(timelineName) {
      _actions2.default.deleteTimeline(this.state.reifiedBytecode, timelineName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode()
      });
      this.props.websocket.action('deleteTimeline', [this.props.folder, timelineName], function () {});
    }
  }, {
    key: 'executeBytecodeActionMoveSegmentEndpoints',
    value: function executeBytecodeActionMoveSegmentEndpoints(componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs) {
      var frameInfo = this.getFrameInfo();
      var keyframeMoves = _actions2.default.moveSegmentEndpoints(this.state.reifiedBytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo);
      // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
      if (Object.keys(keyframeMoves).length > 0) {
        (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
        this._component._clearCaches();
        this.setState({
          reifiedBytecode: this.state.reifiedBytecode,
          serializedBytecode: this._component.getSerializedBytecode()
        });

        // It's very heavy to transmit a websocket message for every single movement while updating the ui,
        // so the values are accumulated and sent via a single batched update.
        if (!this._keyframeMoves) this._keyframeMoves = {};
        var movementKey = [componentId, timelineName, propertyName].join('-');
        this._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
        this.debouncedKeyframeMoveAction();
      }
    }
  }, {
    key: 'debouncedKeyframeMoveAction',
    value: function debouncedKeyframeMoveAction() {
      if (!this._keyframeMoves) return void 0;
      for (var movementKey in this._keyframeMoves) {
        if (!movementKey) continue;
        if (!this._keyframeMoves[movementKey]) continue;
        var _keyframeMoves$moveme = this._keyframeMoves[movementKey],
            componentId = _keyframeMoves$moveme.componentId,
            timelineName = _keyframeMoves$moveme.timelineName,
            propertyName = _keyframeMoves$moveme.propertyName,
            keyframeMoves = _keyframeMoves$moveme.keyframeMoves,
            frameInfo = _keyframeMoves$moveme.frameInfo;

        // Make sure any functions get converted into their serial form before passing over the wire

        var keyframeMovesForWire = (0, _expressionToRO2.default)(keyframeMoves);

        this.props.websocket.action('moveKeyframes', [this.props.folder, [componentId], timelineName, propertyName, keyframeMovesForWire, frameInfo], function () {});
        delete this._keyframeMoves[movementKey];
      }
    }
  }, {
    key: 'togglePlayback',
    value: function togglePlayback() {
      var _this5 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this5._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this5._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this6 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this6.state.selectedNodes[id];
            node.__isExpanded = !!_this6.state.expandedNodes[id];
            node.__isHidden = !!_this6.state.hiddenNodes[id];
          });
          reifiedBytecode.template.__isExpanded = true;
        }
        (0, _clearInMemoryBytecodeCaches2.default)(reifiedBytecode);
        this.setState({ reifiedBytecode: reifiedBytecode, serializedBytecode: serializedBytecode });
      }
    }
  }, {
    key: 'minionSelectElement',
    value: function minionSelectElement(_ref4) {
      var _this7 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this7.selectNode(node);
          _this7.expandNode(node);
          _this7.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this8 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this8.deselectNode(node);
        _this8.collapseNode(node);
        _this8.scrollToTop(node);
      });
    }
  }, {
    key: 'findNodesByComponentId',
    value: function findNodesByComponentId(componentId) {
      var found = [];
      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node) {
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
      }
      return found;
    }
  }, {
    key: 'minionUpdatePropertyValue',
    value: function minionUpdatePropertyValue(componentId, timelineName, startMs, propertyNames) {
      var _this9 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this9.activateRow(rowInfo);
        } else {
          _this9.deactivateRow(rowInfo);
        }
      });

      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode(),
        activatedRows: _lodash2.default.clone(this.state.activatedRows),
        treeUpdate: Date.now()
      });
    }

    /*
     * iterators/visitors
     * --------- */

  }, {
    key: 'findElementInTemplate',
    value: function findElementInTemplate(componentId, reifiedBytecode) {
      if (!reifiedBytecode) return void 0;
      if (!reifiedBytecode.template) return void 0;
      var found = void 0;
      this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
        var id = node.attributes && node.attributes['haiku-id'];
        if (id && id === componentId) found = node;
      });
      return found;
    }
  }, {
    key: 'visitTemplate',
    value: function visitTemplate(locator, index, siblings, template, parent, iteratee) {
      iteratee(template, parent, locator, index, siblings, template.children);
      if (template.children) {
        for (var i = 0; i < template.children.length; i++) {
          var child = template.children[i];
          if (!child || typeof child === 'string') continue;
          this.visitTemplate(locator + '.' + i, i, template.children, child, template, iteratee);
        }
      }
    }
  }, {
    key: 'mapVisibleFrames',
    value: function mapVisibleFrames(iteratee) {
      var mappedOutput = [];
      var frameInfo = this.getFrameInfo();
      var leftFrame = frameInfo.friA;
      var rightFrame = frameInfo.friB;
      var frameModulus = (0, _getFrameModulus2.default)(frameInfo.pxpf);
      var iterationIndex = -1;
      for (var i = leftFrame; i < rightFrame; i++) {
        iterationIndex++;
        var frameNumber = i;
        var pixelOffsetLeft = iterationIndex * frameInfo.pxpf;
        if (pixelOffsetLeft <= this.state.timelinesWidth) {
          var mapOutput = iteratee(frameNumber, pixelOffsetLeft, frameInfo.pxpf, frameModulus);
          if (mapOutput) {
            mappedOutput.push(mapOutput);
          }
        }
      }
      return mappedOutput;
    }
  }, {
    key: 'mapVisibleTimes',
    value: function mapVisibleTimes(iteratee) {
      var mappedOutput = [];
      var frameInfo = this.getFrameInfo();
      var msModulus = (0, _getMillisecondModulus2.default)(frameInfo.pxpf);
      var leftFrame = frameInfo.friA;
      var leftMs = frameInfo.friA * frameInfo.mspf;
      var rightMs = frameInfo.friB * frameInfo.mspf;
      var totalMs = rightMs - leftMs;
      var firstMarker = (0, _roundUp2.default)(leftMs, msModulus);
      var msMarkerTmp = firstMarker;
      var msMarkers = [];
      while (msMarkerTmp <= rightMs) {
        msMarkers.push(msMarkerTmp);
        msMarkerTmp += msModulus;
      }
      for (var i = 0; i < msMarkers.length; i++) {
        var msMarker = msMarkers[i];
        var nearestFrame = (0, _millisecondToNearestFrame2.default)(msMarker, frameInfo.mspf);
        var msRemainder = Math.floor(nearestFrame * frameInfo.mspf - msMarker);
        // TODO: handle the msRemainder case rather than ignoring it
        if (!msRemainder) {
          var frameOffset = nearestFrame - leftFrame;
          var pxOffset = frameOffset * frameInfo.pxpf;
          var mapOutput = iteratee(msMarker, pxOffset, totalMs);
          if (mapOutput) mappedOutput.push(mapOutput);
        }
      }
      return mappedOutput;
    }

    /*
     * getters/calculators
     * --------- */

    /**
      // Sorry: These should have been given human-readable names
      <GAUGE>
              <----friW--->
      fri0    friA        friB        friMax                          friMax2
      |       |           |           |                               |
      | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | | |
              <-----------> << timelines viewport                     |
      <------->           | << properties viewport                    |
              pxA         pxB                                         |
                                      |pxMax                          |pxMax2
      <SCROLLBAR>
      |-------------------| << scroller viewport
          *====*            << scrollbar
      <------------------->
      |sc0                |scL && scRatio
          |scA
               |scB
    */

  }, {
    key: 'getFrameInfo',
    value: function getFrameInfo() {
      var frameInfo = {};
      frameInfo.fps = this.state.framesPerSecond; // Number of frames per second
      frameInfo.mspf = 1000 / frameInfo.fps; // Milliseconds per frame
      frameInfo.maxms = (0, _getMaximumMs2.default)(this.state.reifiedBytecode, this.state.currentTimelineName);
      frameInfo.maxf = (0, _millisecondToNearestFrame2.default)(frameInfo.maxms, frameInfo.mspf); // Maximum frame defined in the timeline
      frameInfo.fri0 = 0; // The lowest possible frame (always 0)
      frameInfo.friA = this.state.visibleFrameRange[0] < frameInfo.fri0 ? frameInfo.fri0 : this.state.visibleFrameRange[0]; // The leftmost frame on the visible range
      frameInfo.friMax = frameInfo.maxf < 60 ? 60 : frameInfo.maxf; // The maximum frame as defined in the timeline
      frameInfo.friMax2 = this.state.maxFrame ? this.state.maxFrame : frameInfo.friMax * 1.88; // Extend the maximum frame defined in the timeline (allows the user to define keyframes beyond the previously defined max)
      frameInfo.friB = this.state.visibleFrameRange[1] > frameInfo.friMax2 ? frameInfo.friMax2 : this.state.visibleFrameRange[1]; // The rightmost frame on the visible range
      frameInfo.friW = Math.abs(frameInfo.friB - frameInfo.friA); // The width of the visible range in frames
      frameInfo.pxpf = Math.floor(this.state.timelinesWidth / frameInfo.friW); // Number of pixels per frame (rounded)
      if (frameInfo.pxpf < 1) frameInfo.pScrxpf = 1;
      if (frameInfo.pxpf > this.state.timelinesWidth) frameInfo.pxpf = this.state.timelinesWidth;
      frameInfo.pxA = Math.round(frameInfo.friA * frameInfo.pxpf);
      frameInfo.pxB = Math.round(frameInfo.friB * frameInfo.pxpf);
      frameInfo.pxMax2 = frameInfo.friMax2 * frameInfo.pxpf; // The width in pixels that the entire timeline ("friMax2") padding would equal
      frameInfo.msA = Math.round(frameInfo.friA * frameInfo.mspf); // The leftmost millisecond in the visible range
      frameInfo.msB = Math.round(frameInfo.friB * frameInfo.mspf); // The rightmost millisecond in the visible range
      frameInfo.scL = this.state.propertiesWidth + this.state.timelinesWidth; // The length in pixels of the scroller view
      frameInfo.scRatio = frameInfo.pxMax2 / frameInfo.scL; // The ratio of the scroller view to the timeline view (so the scroller renders proportionally to the timeline being edited)
      frameInfo.scA = frameInfo.friA * frameInfo.pxpf / frameInfo.scRatio; // The pixel of the left endpoint of the scroller
      frameInfo.scB = frameInfo.friB * frameInfo.pxpf / frameInfo.scRatio; // The pixel of the right endpoint of the scroller
      return frameInfo;
    }

    // TODO: Fix this/these misnomer(s). It's not 'ASCII'

  }, {
    key: 'getAsciiTree',
    value: function getAsciiTree() {
      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template && this.state.reifiedBytecode.template.children) {
        var archyFormat = this.getArchyFormatNodes('', this.state.reifiedBytecode.template.children);
        var archyStr = (0, _archy2.default)(archyFormat);
        return archyStr;
      } else {
        return '';
      }
    }
  }, {
    key: 'getArchyFormatNodes',
    value: function getArchyFormatNodes(label, children) {
      var _this10 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this10.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this11 = this;

      // The number of lines **must** correspond to the number of component headings/property rows
      var asciiSymbols = this.getAsciiTree().split('\n');
      var componentRows = [];
      var addressableArraysCache = {};
      var visitorIterations = 0;

      if (!this.state.reifiedBytecode || !this.state.reifiedBytecode.template) return componentRows;

      this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent, locator, index, siblings) {
        var element = _this11._component._elements.upsertFromNodeWithComponentCached(node, parent, _this11._component, {});

        var isComponent = element.isComponent();
        var elementName = element.getNameString();
        var componentId = element.getComponentId();

        if (!parent || parent.__isExpanded && (_this11._component._elements.ALLOWED_TAGNAMES[elementName] || isComponent)) {
          // Only the top-level and any expanded subcomponents
          var asciiBranch = asciiSymbols[visitorIterations]; // Warning: The component structure must match that given to create the ascii tree
          var headingRow = { node: node, parent: parent, locator: locator, index: index, siblings: siblings, asciiBranch: asciiBranch, propertyRows: [], isHeading: true, componentId: node.attributes['haiku-id'] };
          componentRows.push(headingRow);

          if (!addressableArraysCache[elementName]) {
            var doGoDeep = locator.length === 3; // 0.0, 0.1, etc
            addressableArraysCache[elementName] = Object.values(element.getAddressableProperties(doGoDeep));
          }

          var clusterHeadingsFound = {};

          for (var i = 0; i < addressableArraysCache[elementName].length; i++) {
            var propertyGroupDescriptor = addressableArraysCache[elementName][i];

            var propertyRow = void 0;

            // Some properties get grouped inside their own accordion since they have multiple subcomponents, e.g. translation.x,y,z
            if (propertyGroupDescriptor.cluster) {
              var clusterPrefix = propertyGroupDescriptor.cluster.prefix;
              var clusterKey = componentId + '_' + clusterPrefix;
              var isClusterHeading = false;

              // If the cluster with the current key is expanded render each of the rows individually
              if (_this11.state.expandedPropertyClusters[clusterKey]) {
                if (!clusterHeadingsFound[clusterPrefix]) {
                  isClusterHeading = true;
                  clusterHeadingsFound[clusterPrefix] = true;
                }

                propertyRow = {
                  element: element,
                  node: node,
                  parent: parent,
                  locator: locator,
                  index: index,
                  siblings: siblings,
                  clusterPrefix: clusterPrefix,
                  clusterKey: clusterKey,
                  isClusterMember: true,
                  isClusterHeading: isClusterHeading,
                  property: propertyGroupDescriptor,
                  isProperty: true,
                  componentId: componentId
                };
              } else {
                // Otherwise, create a cluster, shifting the index forward so we don't re-render the individuals on the next iteration of the loop
                var clusterSet = [propertyGroupDescriptor];
                // Look ahead by a few steps in the array and see if the next element is a member of the current cluster
                var k = i; // Temporary so we can increment `i` in place
                for (var j = 1; j < 4; j++) {
                  var nextIndex = j + k;
                  var nextDescriptor = addressableArraysCache[elementName][nextIndex];
                  // If the next thing in the list shares the same cluster name, make it part of this clustesr
                  if (nextDescriptor && nextDescriptor.cluster && nextDescriptor.cluster.prefix === clusterPrefix) {
                    clusterSet.push(nextDescriptor);
                    // Since we already go to the next one, bump the iteration index so we skip it on the next loop
                    i += 1;
                  }
                }

                propertyRow = {
                  element: element,
                  node: node,
                  parent: parent,
                  locator: locator,
                  index: index,
                  siblings: siblings,
                  clusterPrefix: clusterPrefix,
                  clusterKey: clusterKey,
                  cluster: clusterSet,
                  clusterName: propertyGroupDescriptor.cluster.name,
                  isCluster: true,
                  componentId: componentId
                };
              }
            } else {
              propertyRow = {
                element: element,
                node: node,
                parent: parent,
                locator: locator,
                index: index,
                siblings: siblings,
                property: propertyGroupDescriptor,
                isProperty: true,
                componentId: componentId
              };
            }

            headingRow.propertyRows.push(propertyRow);

            // Pushing an element into a component row will result in it rendering, so only push
            // the property rows of nodes that have been expandex
            if (node.__isExpanded) {
              componentRows.push(propertyRow);
            }
          }
        }
        visitorIterations++;
      });

      componentRows.forEach(function (item, index, items) {
        item._index = index;
        item._items = items;
      });

      componentRows = componentRows.filter(function (_ref6) {
        var node = _ref6.node,
            parent = _ref6.parent,
            locator = _ref6.locator;

        // Locators > 0.0 are below the level we want to display (we only want the top and its children)
        if (locator.split('.').length > 2) return false;
        return !parent || parent.__isExpanded;
      });

      return componentRows;
    }
  }, {
    key: 'mapVisiblePropertyTimelineSegments',
    value: function mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee) {
      var segmentOutputs = [];

      var valueGroup = _TimelineProperty2.default.getValueGroup(componentId, this.state.currentTimelineName, propertyName, reifiedBytecode);
      if (!valueGroup) return segmentOutputs;

      var keyframesList = Object.keys(valueGroup).map(function (keyframeKey) {
        return parseInt(keyframeKey, 10);
      }).sort(function (a, b) {
        return a - b;
      });
      if (keyframesList.length < 1) return segmentOutputs;

      for (var i = 0; i < keyframesList.length; i++) {
        var mscurr = keyframesList[i];
        if (isNaN(mscurr)) continue;
        var msprev = keyframesList[i - 1];
        var msnext = keyframesList[i + 1];

        if (mscurr > frameInfo.msB) continue; // If this segment happens after the visible range, skip it
        if (mscurr < frameInfo.msA && msnext !== undefined && msnext < frameInfo.msA) continue; // If this segment happens entirely before the visible range, skip it (partial segments are ok)

        var prev = void 0;
        var curr = void 0;
        var next = void 0;

        if (msprev !== undefined && !isNaN(msprev)) {
          prev = {
            ms: msprev,
            name: propertyName,
            index: i - 1,
            frame: (0, _millisecondToNearestFrame2.default)(msprev, frameInfo.mspf),
            value: valueGroup[msprev].value,
            curve: valueGroup[msprev].curve
          };
        }

        curr = {
          ms: mscurr,
          name: propertyName,
          index: i,
          frame: (0, _millisecondToNearestFrame2.default)(mscurr, frameInfo.mspf),
          value: valueGroup[mscurr].value,
          curve: valueGroup[mscurr].curve
        };

        if (msnext !== undefined && !isNaN(msnext)) {
          next = {
            ms: msnext,
            name: propertyName,
            index: i + 1,
            frame: (0, _millisecondToNearestFrame2.default)(msnext, frameInfo.mspf),
            value: valueGroup[msnext].value,
            curve: valueGroup[msnext].curve
          };
        }

        var pxOffsetLeft = (curr.frame - frameInfo.friA) * frameInfo.pxpf;
        var pxOffsetRight = void 0;
        if (next) pxOffsetRight = (next.frame - frameInfo.friA) * frameInfo.pxpf;

        var segmentOutput = iteratee(prev, curr, next, pxOffsetLeft, pxOffsetRight, i);
        if (segmentOutput) segmentOutputs.push(segmentOutput);
      }

      return segmentOutputs;
    }
  }, {
    key: 'mapVisibleComponentTimelineSegments',
    value: function mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, propertyRows, reifiedBytecode, iteratee) {
      var _this12 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this12.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this12.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
          if (propertyOutputs) {
            segmentOutputs = segmentOutputs.concat(propertyOutputs);
          }
        }
      });

      return segmentOutputs;
    }
  }, {
    key: 'removeTimelineShadow',
    value: function removeTimelineShadow() {
      this.setState({ showHorzScrollShadow: false });
    }

    /*
     * render methods
     * --------- */

    // ---------

  }, {
    key: 'renderTimelinePlaybackControls',
    value: function renderTimelinePlaybackControls() {
      var _this13 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1411
          },
          __self: this
        },
        _react2.default.createElement(_ControlsArea2.default, {
          removeTimelineShadow: this.removeTimelineShadow.bind(this),
          activeComponentDisplayName: this.props.userconfig.name,
          timelineNames: Object.keys(this.state.reifiedBytecode ? this.state.reifiedBytecode.timelines : {}),
          selectedTimelineName: this.state.currentTimelineName,
          currentFrame: this.state.currentFrame,
          isPlaying: this.state.isPlayerPlaying,
          playbackSpeed: this.state.playerPlaybackSpeed,
          lastFrame: this.getFrameInfo().friMax,
          changeTimelineName: function changeTimelineName(oldTimelineName, newTimelineName) {
            _this13.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this13.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this13.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this13.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this13._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this13.props.websocket.action('setTimelineName', [_this13.props.folder, currentTimelineName], function () {});
            _this13.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this13.getFrameInfo();
            _this13._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this13.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this13.getFrameInfo();
            _this13.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this13._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this13.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this13.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1416
          },
          __self: this
        })
      );
    }
  }, {
    key: 'getItemValueDescriptor',
    value: function getItemValueDescriptor(inputItem) {
      var frameInfo = this.getFrameInfo();
      return (0, _getPropertyValueDescriptor2.default)(inputItem.node, frameInfo, this.state.reifiedBytecode, this.state.serializedBytecode, this._component, this.getCurrentTimelineTime(frameInfo), this.state.currentTimelineName, inputItem.property);
    }
  }, {
    key: 'getCurrentTimelineTime',
    value: function getCurrentTimelineTime(frameInfo) {
      return Math.round(this.state.currentFrame * frameInfo.mspf);
    }
  }, {
    key: 'renderCollapsedPropertyTimelineSegments',
    value: function renderCollapsedPropertyTimelineSegments(item) {
      var _this14 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1484
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this14.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this14.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this14.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this14.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this14.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this14.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this15 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this15.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            var activeKeyframes = _this15.state.activeKeyframes;
            activeKeyframes = [componentId + '-' + propertyName + '-' + curr.index];
            _this15.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              activeKeyframes: activeKeyframes
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this15.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this15.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, activeKeyframes: [] });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this15.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this15.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this15.state.keyframeDragStartMs + msChange);
              _this15.executeBytecodeActionMoveSegmentEndpoints(componentId, _this15.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 1507
          },
          __self: this
        },
        _react2.default.createElement('span', {
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
            var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
            var clickedMs = curr.ms;
            var clickedFrame = curr.frame;
            _this15.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this15.state.currentTimelineName,
              propertyName: propertyName,
              keyframeIndex: curr.index,
              startMs: curr.ms,
              startFrame: curr.frame,
              endMs: null,
              endFrame: null,
              curve: null,
              localOffsetX: localOffsetX,
              totalOffsetX: totalOffsetX,
              clickedFrame: clickedFrame,
              clickedMs: clickedMs,
              elementName: elementName
            });
          },
          style: {
            display: 'inline-block',
            position: 'absolute',
            top: 1,
            left: pxOffsetLeft,
            width: 10,
            height: 24,
            zIndex: 1003,
            cursor: 'col-resize'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1535
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderSoloKeyframe',
    value: function renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var isActive = false;
      this.state.activeKeyframes.forEach(function (k) {
        if (k === componentId + '-' + propertyName + '-' + curr.index) isActive = true;
      });

      return _react2.default.createElement(
        'span',
        {
          key: propertyName + '-' + index + '-' + curr.ms,
          style: {
            position: 'absolute',
            left: pxOffsetLeft,
            width: 9,
            height: 24,
            top: -3,
            transform: 'scale(1.7)',
            transition: 'opacity 130ms linear',
            zIndex: 1002
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1583
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'keyframe-diamond',
            style: {
              position: 'absolute',
              top: 5,
              left: 1,
              cursor: options.collapsed ? 'pointer' : 'move'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1595
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1603
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this16 = this;

      var uniqueKey = componentId + '-' + propertyName + '-' + index + '-' + curr.ms;
      var curve = curr.curve.charAt(0).toUpperCase() + curr.curve.slice(1);
      var breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic');
      var CurveSVG = CURVESVGS[curve + 'SVG'];
      var firstKeyframeActive = false;
      var secondKeyframeActive = false;
      this.state.activeKeyframes.forEach(function (k) {
        if (k === componentId + '-' + propertyName + '-' + curr.index) firstKeyframeActive = true;
        if (k === componentId + '-' + propertyName + '-' + (curr.index + 1)) secondKeyframeActive = true;
      });

      return _react2.default.createElement(
        _reactDraggable.DraggableCore,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            if (options.collapsed) return false;
            _this16.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            var activeKeyframes = _this16.state.activeKeyframes;
            activeKeyframes = [componentId + '-' + propertyName + '-' + curr.index, componentId + '-' + propertyName + '-' + (curr.index + 1)];
            _this16.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true,
              activeKeyframes: activeKeyframes
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this16.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this16.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false, activeKeyframes: [] });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this16.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this16.state.keyframeDragStartMs + msChange);
            _this16.executeBytecodeActionMoveSegmentEndpoints(componentId, _this16.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 1629
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this16[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this16.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this16.state.currentTimelineName,
                propertyName: propertyName,
                startFrame: curr.frame,
                keyframeIndex: curr.index,
                startMs: curr.ms,
                curve: curr.curve,
                endFrame: next.frame,
                endMs: next.ms,
                localOffsetX: localOffsetX,
                totalOffsetX: totalOffsetX,
                clickedFrame: clickedFrame,
                clickedMs: clickedMs,
                elementName: elementName
              });
            },
            onMouseEnter: function onMouseEnter(reactEvent) {
              if (_this16[uniqueKey]) _this16[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this16[uniqueKey]) _this16[uniqueKey].style.color = 'transparent';
            },
            style: {
              position: 'absolute',
              left: pxOffsetLeft + 4,
              width: pxOffsetRight - pxOffsetLeft,
              top: 1,
              height: 24,
              WebkitUserSelect: 'none',
              cursor: options.collapsed ? 'pointer' : 'move'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1657
            },
            __self: this
          },
          options.collapsed && _react2.default.createElement('span', {
            className: 'pill-collapsed-backdrop',
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              borderRadius: 5,
              zIndex: 4,
              left: 0,
              backgroundColor: options.collapsed ? _DefaultPalette2.default.GRAY : (0, _color2.default)(_DefaultPalette2.default.SUNSTONE).fade(0.91)
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1708
            },
            __self: this
          }),
          _react2.default.createElement('span', {
            className: 'pill',
            style: {
              position: 'absolute',
              zIndex: 1001,
              width: '100%',
              height: '100%',
              top: 0,
              borderRadius: 5,
              left: 0,
              backgroundColor: options.collapsed ? options.collapsedElement ? (0, _color2.default)(_DefaultPalette2.default.SUNSTONE).fade(0.93) : (0, _color2.default)(_DefaultPalette2.default.SUNSTONE).fade(0.965) : (0, _color2.default)(_DefaultPalette2.default.SUNSTONE).fade(0.91)
            },
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1724
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            {
              style: {
                position: 'absolute',
                left: -5,
                width: 9,
                height: 24,
                top: -4,
                transform: 'scale(1.7)',
                zIndex: 1002
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1741
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              {
                className: 'keyframe-diamond',
                style: {
                  position: 'absolute',
                  top: 5,
                  left: 1,
                  cursor: options.collapsed ? 'pointer' : 'move'
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1751
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1759
                },
                __self: this
              })
            )
          ),
          _react2.default.createElement(
            'span',
            { style: {
                position: 'absolute',
                zIndex: 1002,
                width: '100%',
                height: '100%',
                borderRadius: 5,
                paddingTop: 6,
                overflow: breakingBounds ? 'visible' : 'hidden'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1769
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1778
              },
              __self: this
            })
          ),
          _react2.default.createElement(
            'span',
            {
              style: {
                position: 'absolute',
                right: -5,
                width: 9,
                height: 24,
                top: -4,
                transform: 'scale(1.7)',
                transition: 'opacity 130ms linear',
                zIndex: 1002
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1796
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              {
                className: 'keyframe-diamond',
                style: {
                  position: 'absolute',
                  top: 5,
                  left: 1,
                  cursor: options.collapsed ? 'pointer' : 'move'
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1807
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1817
                },
                __self: this
              })
            )
          )
        )
      );
    }
  }, {
    key: 'renderConstantBody',
    value: function renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this17 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this17[uniqueKey] = domElement;
          },
          key: propertyName + '-' + index,
          className: 'constant-body',
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            if (options.collapsed) return false;
            ctxMenuEvent.stopPropagation();
            var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
            var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
            var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
            var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
            _this17.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this17.state.currentTimelineName,
              propertyName: propertyName,
              startFrame: curr.frame,
              keyframeIndex: curr.index,
              startMs: curr.ms,
              endFrame: next.frame,
              endMs: next.ms,
              curve: null,
              localOffsetX: localOffsetX,
              totalOffsetX: totalOffsetX,
              clickedFrame: clickedFrame,
              clickedMs: clickedMs,
              elementName: elementName
            });
          },
          style: {
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            height: this.state.rowHeight
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1837
          },
          __self: this
        },
        _react2.default.createElement('span', { style: {
            height: 3,
            top: 12,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: options.collapsedElement ? (0, _color2.default)(_DefaultPalette2.default.GRAY).fade(0.23) : _DefaultPalette2.default.DARKER_GRAY
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1876
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this18 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this18.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this18.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this18.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this18.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this18.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this18.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 1919
            },
            __self: _this18
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this19 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1935
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1936
                  },
                  __self: _this19
                },
                frameNumber
              )
            );
          }
        });
      } else if (this.state.timeDisplayMode === 'seconds') {
        // aka time elapsed, not frames
        return this.mapVisibleTimes(function (millisecondsNumber, pixelOffsetLeft, totalMilliseconds) {
          if (totalMilliseconds <= 1000) {
            return _react2.default.createElement(
              'span',
              { key: 'time-' + millisecondsNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1945
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1946
                  },
                  __self: _this19
                },
                millisecondsNumber,
                'ms'
              )
            );
          } else {
            return _react2.default.createElement(
              'span',
              { key: 'time-' + millisecondsNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1951
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1952
                  },
                  __self: _this19
                },
                (0, _formatSeconds2.default)(millisecondsNumber / 1000),
                's'
              )
            );
          }
        });
      }
    }
  }, {
    key: 'renderFrameGrid',
    value: function renderFrameGrid(frameInfo) {
      var _this20 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 1963
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1965
            },
            __self: _this20
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this21 = this;

      var frameInfo = this.getFrameInfo();
      if (this.state.currentFrame < frameInfo.friA || this.state.currentFrame > frameInfo.fraB) return '';
      var frameOffset = this.state.currentFrame - frameInfo.friA;
      var pxOffset = frameOffset * frameInfo.pxpf;
      var shaftHeight = this.refs.scrollview && this.refs.scrollview.clientHeight + 10 || 0;
      return _react2.default.createElement(
        _reactDraggable.DraggableCore,
        {
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this21.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this21.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this21.setState({ scrubberDragStart: null, frameBaseline: _this21.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this21.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 1978
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1997
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                backgroundColor: _DefaultPalette2.default.SUNSTONE,
                height: 13,
                width: 13,
                top: 20,
                left: pxOffset - 6,
                borderRadius: '50%',
                cursor: 'move',
                boxShadow: '0 0 2px 0 rgba(0, 0, 0, .9)',
                zIndex: 1006
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1998
              },
              __self: this
            },
            _react2.default.createElement('span', { style: {
                position: 'absolute',
                zIndex: 1006,
                width: 0,
                height: 0,
                top: 8,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid ' + _DefaultPalette2.default.SUNSTONE
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2011
              },
              __self: this
            }),
            _react2.default.createElement('span', { style: {
                position: 'absolute',
                zIndex: 1006,
                width: 0,
                height: 0,
                left: 1,
                top: 8,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid ' + _DefaultPalette2.default.SUNSTONE
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2021
              },
              __self: this
            })
          ),
          _react2.default.createElement('div', {
            style: {
              position: 'absolute',
              zIndex: 1006,
              backgroundColor: _DefaultPalette2.default.SUNSTONE,
              height: shaftHeight,
              width: 1,
              top: 25,
              left: pxOffset,
              pointerEvents: 'none'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2033
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this22 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this22.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this22.state.maxFrame ? _this22.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this22.state.addInterval);
              _this22.setState({ maxFrame: currentMax + _this22.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this22.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this22.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2056
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2075
              },
              __self: this
            },
            _react2.default.createElement('div', {
              style: {
                position: 'absolute',
                backgroundColor: _DefaultPalette2.default.ROCK,
                width: 6,
                height: 32,
                zIndex: 3,
                top: 1,
                right: 0,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
                cursor: 'move'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2076
              },
              __self: this
            }),
            _react2.default.createElement('div', { className: 'trim-area', style: {
                position: 'absolute',
                top: 0,
                mouseEvents: 'none',
                left: -6,
                width: 26 + pxOffset,
                height: this.refs.scrollview && this.refs.scrollview.clientHeight + 35 || 0,
                borderLeft: '1px solid ' + _DefaultPalette2.default.FATHER_COAL,
                backgroundColor: (0, _color2.default)(_DefaultPalette2.default.FATHER_COAL).fade(0.6)
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2089
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2103
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this23 = this;

      var frameInfo = this.getFrameInfo();
      return _react2.default.createElement(
        'div',
        {
          className: 'top-controls no-select',
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: this.state.rowHeight + 10,
            width: this.state.propertiesWidth + this.state.timelinesWidth,
            verticalAlign: 'top',
            fontSize: 10,
            borderBottom: '1px solid ' + _DefaultPalette2.default.FATHER_COAL,
            backgroundColor: _DefaultPalette2.default.COAL
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2110
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            className: 'gauge-timekeeping-wrapper',
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              height: 'inherit',
              width: this.state.propertiesWidth
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2123
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              className: 'gauge-time-readout',
              style: {
                float: 'right',
                top: 0,
                minWidth: 86,
                height: 'inherit',
                verticalAlign: 'top',
                textAlign: 'right',
                paddingTop: 2,
                paddingRight: 10
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2132
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2144
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2146
                  },
                  __self: this
                },
                ~~this.state.currentFrame,
                'f'
              ) : _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2147
                  },
                  __self: this
                },
                (0, _formatSeconds2.default)(this.state.currentFrame * 1000 / this.state.framesPerSecond / 1000),
                's'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'gauge-fps-readout',
              style: {
                width: 38,
                float: 'right',
                left: 211,
                height: 'inherit',
                verticalAlign: 'top',
                color: _DefaultPalette2.default.ROCK_MUTED,
                fontStyle: 'italic',
                textAlign: 'right',
                paddingTop: 5,
                paddingRight: 5,
                cursor: 'default'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2151
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2166
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2168
                  },
                  __self: this
                },
                (0, _formatSeconds2.default)(this.state.currentFrame * 1000 / this.state.framesPerSecond / 1000),
                's'
              ) : _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2169
                  },
                  __self: this
                },
                ~~this.state.currentFrame,
                'f'
              )
            ),
            _react2.default.createElement(
              'div',
              { style: { marginTop: '-4px' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2172
                },
                __self: this
              },
              this.state.framesPerSecond,
              'fps'
            )
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'gauge-toggle',
              onClick: this.toggleTimeDisplayMode.bind(this),
              style: {
                width: 50,
                float: 'right',
                marginRight: 10,
                fontSize: 9,
                height: 'inherit',
                verticalAlign: 'top',
                color: _DefaultPalette2.default.ROCK_MUTED,
                textAlign: 'right',
                paddingTop: 7,
                paddingRight: 5,
                cursor: 'pointer'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2174
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2191
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2192
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2193
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2195
                  },
                  __self: this
                },
                'SECONDS'
              )
            ) : _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2197
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2198
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2199
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2200
                  },
                  __self: this
                })
              )
            )
          )
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'gauge-box',
            onClick: function onClick(clickEvent) {
              if (_this23.state.scrubberDragStart === null || _this23.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this23.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this23._component.getCurrentTimeline().seek(newFrame);
              }
            },
            style: {
              // display: 'table-cell',
              position: 'absolute',
              top: 0,
              left: this.state.propertiesWidth,
              width: this.state.timelinesWidth,
              height: 'inherit',
              verticalAlign: 'top',
              paddingTop: 10,
              color: _DefaultPalette2.default.ROCK_MUTED }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2207
            },
            __self: this
          },
          this.renderFrameGrid(frameInfo),
          this.renderGauge(frameInfo),
          this.renderScrubber()
        ),
        this.renderDurationModifier()
      );
    }
  }, {
    key: 'renderTimelineRangeScrollbar',
    value: function renderTimelineRangeScrollbar() {
      var _this24 = this;

      var frameInfo = this.getFrameInfo();
      var knobRadius = 5;
      return _react2.default.createElement(
        'div',
        {
          className: 'timeline-range-scrollbar',
          style: {
            width: frameInfo.scL,
            height: knobRadius * 2,
            position: 'relative',
            backgroundColor: _DefaultPalette2.default.DARKER_GRAY,
            borderTop: '1px solid ' + _DefaultPalette2.default.FATHER_COAL,
            borderBottom: '1px solid ' + _DefaultPalette2.default.FATHER_COAL
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2244
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this24.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this24.state.visibleFrameRange[0],
                scrollbarEnd: _this24.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this24.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this24.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this24.state.scrollerLeftDragStart && !_this24.state.scrollerRightDragStart) {
                _this24.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2254
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                backgroundColor: _DefaultPalette2.default.LIGHTEST_GRAY,
                height: knobRadius * 2,
                left: frameInfo.scA,
                width: frameInfo.scB - frameInfo.scA + 17,
                borderRadius: knobRadius,
                cursor: 'move'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2278
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this24.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this24.state.visibleFrameRange[0], scrollbarEnd: _this24.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this24.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this24.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2288
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2293
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this24.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this24.state.visibleFrameRange[0], scrollbarEnd: _this24.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this24.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this24.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2295
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2300
                },
                __self: this
              })
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { style: { width: this.state.propertiesWidth + this.state.timelinesWidth - 10, left: 10, position: 'relative' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2304
            },
            __self: this
          },
          _react2.default.createElement('div', { style: {
              position: 'absolute',
              pointerEvents: 'none',
              height: knobRadius * 2,
              width: 1,
              backgroundColor: _DefaultPalette2.default.ROCK,
              left: this.state.currentFrame / frameInfo.friMax2 * 100 + '%'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2305
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderBottomControls',
    value: function renderBottomControls() {
      return _react2.default.createElement(
        'div',
        {
          className: 'no-select',
          style: {
            width: '100%',
            height: 45,
            backgroundColor: _DefaultPalette2.default.COAL,
            overflow: 'visible',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: 10000
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2320
          },
          __self: this
        },
        this.renderTimelineRangeScrollbar(),
        this.renderTimelinePlaybackControls()
      );
    }
  }, {
    key: 'renderComponentRowHeading',
    value: function renderComponentRowHeading(_ref7) {
      var node = _ref7.node,
          locator = _ref7.locator,
          index = _ref7.index,
          siblings = _ref7.siblings,
          asciiBranch = _ref7.asciiBranch;

      // HACK: Until we enable full support for nested display in this list, swap the "technically correct"
      // tree marker with a "visually correct" marker representing the tree we actually show
      var height = asciiBranch === '└─┬ ' ? 15 : 25;
      var color = node.__isExpanded ? _DefaultPalette2.default.ROCK : _DefaultPalette2.default.ROCK_MUTED;
      var elementName = _typeof(node.elementName) === 'object' ? 'div' : node.elementName;

      return locator === '0' ? _react2.default.createElement(
        'div',
        { style: { height: 27, display: 'inline-block', transform: 'translateY(1px)' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2347
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2350
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            style: {
              display: 'inline-block',
              fontSize: 21,
              position: 'relative',
              zIndex: 1005,
              verticalAlign: 'middle',
              color: _DefaultPalette2.default.GRAY_FIT1,
              marginRight: 7,
              marginTop: 1
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2351
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2362
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2363
              },
              __self: this
            },
            '\u2014'
          )
        ),
        _react2.default.createElement(
          'span',
          {
            style: {
              color: color,
              position: 'relative',
              zIndex: 1005
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2365
            },
            __self: this
          },
          (0, _truncate2.default)(node.attributes['haiku-title'] || '<' + elementName + '>', 8)
        )
      );
    }
  }, {
    key: 'renderComponentHeadingRow',
    value: function renderComponentHeadingRow(item, index, height, items) {
      var _this25 = this;

      var componentId = item.node.attributes['haiku-id'];
      return _react2.default.createElement(
        'div',
        {
          key: 'component-heading-row-' + componentId + '-' + index,
          className: 'component-heading-row no-select',
          'data-component-id': componentId,
          onClick: function onClick() {
            // Collapse/expand the entire component area when it is clicked
            if (item.node.__isExpanded) {
              _this25.collapseNode(item.node, componentId);
              _this25.props.websocket.action('unselectElement', [_this25.props.folder, componentId], function () {});
            } else {
              _this25.expandNode(item.node, componentId);
              _this25.props.websocket.action('selectElement', [_this25.props.folder, componentId], function () {});
            }
          },
          style: {
            display: 'table',
            tableLayout: 'fixed',
            height: item.node.__isExpanded ? 0 : height,
            width: '100%',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1005,
            backgroundColor: item.node.__isExpanded ? 'transparent' : _DefaultPalette2.default.LIGHT_GRAY,
            verticalAlign: 'top',
            opacity: item.node.__isHidden ? 0.75 : 1.0
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2380
          },
          __self: this
        },
        !item.node.__isExpanded && // covers keyframe hangover at frame 0 that for uncollapsed rows is hidden by the input field
        _react2.default.createElement('div', { style: {
            position: 'absolute',
            zIndex: 1006,
            left: this.state.propertiesWidth - 10,
            top: 0,
            backgroundColor: _DefaultPalette2.default.LIGHT_GRAY,
            width: 10,
            height: this.state.rowHeight }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2407
          },
          __self: this
        }),
        _react2.default.createElement(
          'div',
          { style: {
              display: 'table-cell',
              width: this.state.propertiesWidth - 150,
              height: 'inherit',
              position: 'absolute',
              zIndex: 3,
              backgroundColor: item.node.__isExpanded ? 'transparent' : _DefaultPalette2.default.LIGHT_GRAY
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2415
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2423
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              {
                style: {
                  marginLeft: 10
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2424
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2429
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2429
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2430
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2430
                  },
                  __self: this
                })
              )
            ),
            this.renderComponentRowHeading(item)
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'component-collapsed-segments-box', style: { display: 'table-cell', width: this.state.timelinesWidth, height: 'inherit' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2436
            },
            __self: this
          },
          !item.node.__isExpanded ? this.renderCollapsedPropertyTimelineSegments(item) : ''
        )
      );
    }
  }, {
    key: 'renderPropertyRow',
    value: function renderPropertyRow(item, index, height, items, propertyOnLastComponent) {
      var _this26 = this;

      var frameInfo = this.getFrameInfo();
      var humanName = (0, _humanizePropertyName2.default)(item.property.name);
      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property && item.property.name;

      return _react2.default.createElement(
        'div',
        {
          key: 'property-row-' + index + '-' + componentId + '-' + propertyName,
          className: 'property-row',
          style: {
            height: height,
            width: this.state.propertiesWidth + this.state.timelinesWidth,
            left: 0,
            opacity: item.node.__isHidden ? 0.5 : 1.0,
            position: 'relative'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2451
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this26.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this26.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2461
            },
            __self: this
          },
          item.isClusterHeading ? _react2.default.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                width: 14,
                left: 136,
                top: -2,
                zIndex: 1006,
                textAlign: 'right',
                height: 'inherit'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2473
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2483
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2483
                },
                __self: this
              })
            )
          ) : '',
          !propertyOnLastComponent && humanName !== 'background color' && _react2.default.createElement('div', { style: {
              position: 'absolute',
              left: 36,
              width: 5,
              zIndex: 1005,
              borderLeft: '1px solid ' + _DefaultPalette2.default.GRAY_FIT1,
              height: height
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2488
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            {
              className: 'property-row-label no-select',
              style: {
                right: 0,
                width: this.state.propertiesWidth - 80,
                height: this.state.rowHeight,
                textAlign: 'right',
                backgroundColor: _DefaultPalette2.default.GRAY,
                zIndex: 1004,
                position: 'relative',
                paddingTop: 6,
                paddingRight: 10
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2497
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              { style: {
                  textTransform: 'uppercase',
                  fontSize: 10,
                  width: 91,
                  lineHeight: 1,
                  float: 'right',
                  color: _DefaultPalette2.default.ROCK,
                  transform: humanName === 'background color' ? 'translateY(-2px)' : 'translateY(3px)',
                  position: 'relative'
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2510
                },
                __self: this
              },
              humanName
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'property-input-field',
            style: {
              position: 'absolute',
              left: this.state.propertiesWidth - 82,
              width: 82,
              top: 0,
              height: this.state.rowHeight - 1,
              textAlign: 'left'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2524
            },
            __self: this
          },
          _react2.default.createElement(_PropertyInputField2.default, {
            parent: this,
            item: item,
            index: index,
            height: height,
            frameInfo: frameInfo,
            component: this._component,
            isPlayerPlaying: this.state.isPlayerPlaying,
            timelineTime: this.getCurrentTimelineTime(frameInfo),
            timelineName: this.state.currentTimelineName,
            rowHeight: this.state.rowHeight,
            inputSelected: this.state.inputSelected,
            serializedBytecode: this.state.serializedBytecode,
            reifiedBytecode: this.state.reifiedBytecode, __source: {
              fileName: _jsxFileName,
              lineNumber: 2533
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          {
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + frameInfo.pxA;
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this26.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this26.state.currentTimelineName,
                localOffsetX: localOffsetX,
                totalOffsetX: totalOffsetX,
                clickedFrame: clickedFrame,
                clickedMs: clickedMs,
                elementName: elementName
              });
            },
            className: 'property-timeline-segments-box',
            onMouseDown: function onMouseDown() {
              var key = item.componentId + ' ' + item.property.name;
              // Avoid unnecessary setStates which can impact rendering performance
              if (!_this26.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this26.setState({ activatedRows: activatedRows });
              }
            },
            style: {
              position: 'absolute',
              width: this.state.timelinesWidth,
              left: this.state.propertiesWidth - 4, // offset half of lone keyframe width so it lines up with the pole
              top: 0,
              height: 'inherit'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2548
            },
            __self: this
          },
          this.renderPropertyTimelineSegments(frameInfo, item, index, height, items, this.state.reifiedBytecode)
        )
      );
    }
  }, {
    key: 'renderClusterRow',
    value: function renderClusterRow(item, index, height, items, propertyOnLastComponent) {
      var _this27 = this;

      var frameInfo = this.getFrameInfo();
      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var clusterName = item.clusterName;
      var reifiedBytecode = this.state.reifiedBytecode;
      return _react2.default.createElement(
        'div',
        {
          key: 'property-cluster-row-' + index + '-' + componentId + '-' + clusterName,
          className: 'property-cluster-row',
          onClick: function onClick() {
            // Expand the property cluster when it is clicked
            var expandedPropertyClusters = _lodash2.default.clone(_this27.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this27.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this27.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this27.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          style: {
            height: height,
            width: this.state.propertiesWidth + this.state.timelinesWidth,
            left: 0,
            opacity: item.node.__isHidden ? 0.5 : 1.0,
            position: 'relative',
            cursor: 'pointer'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2599
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2630
            },
            __self: this
          },
          !propertyOnLastComponent && _react2.default.createElement('div', { style: {
              position: 'absolute',
              left: 36,
              width: 5,
              zIndex: 1005,
              borderLeft: '1px solid ' + _DefaultPalette2.default.GRAY_FIT1,
              height: height
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2632
            },
            __self: this
          }),
          _react2.default.createElement(
            'div',
            {
              style: {
                position: 'absolute',
                left: 145,
                width: 10,
                height: 'inherit'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2641
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2648
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2648
                },
                __self: this
              })
            )
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'property-cluster-row-label no-select',
              style: {
                position: 'relative',
                right: 0,
                width: this.state.propertiesWidth - 80,
                height: this.state.rowHeight,
                paddingTop: 3,
                paddingRight: 10,
                backgroundColor: _DefaultPalette2.default.GRAY,
                zIndex: 1004,
                textAlign: 'right'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2650
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: {
                  textTransform: 'uppercase',
                  fontSize: 10,
                  color: _DefaultPalette2.default.DARK_ROCK
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2663
                },
                __self: this
              },
              clusterName
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'property-cluster-input-field',
            style: {
              position: 'absolute',
              left: this.state.propertiesWidth - 82,
              width: 82,
              top: 0,
              height: 24,
              textAlign: 'left'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2672
            },
            __self: this
          },
          _react2.default.createElement(_ClusterInputField2.default, {
            parent: this,
            item: item,
            index: index,
            height: height,
            frameInfo: frameInfo,
            component: this._component,
            isPlayerPlaying: this.state.isPlayerPlaying,
            timelineTime: this.getCurrentTimelineTime(frameInfo),
            timelineName: this.state.currentTimelineName,
            rowHeight: this.state.rowHeight,
            serializedBytecode: this.state.serializedBytecode,
            reifiedBytecode: reifiedBytecode, __source: {
              fileName: _jsxFileName,
              lineNumber: 2681
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          {
            className: 'property-cluster-timeline-segments-box',
            style: {
              overflow: 'hidden',
              position: 'absolute',
              width: this.state.timelinesWidth,
              left: this.state.propertiesWidth - 4, // offset half of lone keyframe width so it lines up with the pole
              top: 0,
              height: 'inherit'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2695
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this27.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this27.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this27.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
              }
            }
            return segmentPieces;
          })
        )
      );
    }

    // Creates a virtual list of all the component rows (includes headings and property rows)

  }, {
    key: 'renderComponentRows',
    value: function renderComponentRows(items) {
      var _this28 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2726
        },
        __self: this
      });

      return _react2.default.createElement(
        'div',
        {
          className: 'property-row-list',
          style: _lodash2.default.assign({}, {
            position: 'absolute'
          }), __source: {
            fileName: _jsxFileName,
            lineNumber: 2729
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this28.renderClusterRow(item, index, _this28.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this28.renderPropertyRow(item, index, _this28.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this28.renderComponentHeadingRow(item, index, _this28.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this29 = this;

      this.state.componentRowsData = this.getComponentRowsData();
      return _react2.default.createElement(
        'div',
        {
          ref: 'container',
          id: 'timeline',
          className: 'no-select',
          style: {
            position: 'absolute',
            backgroundColor: _DefaultPalette2.default.GRAY,
            color: _DefaultPalette2.default.ROCK,
            top: 0,
            left: 0,
            height: 'calc(100% - 45px)',
            width: '100%',
            overflowY: 'hidden',
            overflowX: 'hidden'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2751
          },
          __self: this
        },
        this.state.showHorzScrollShadow && _react2.default.createElement('span', { className: 'no-select', style: {
            position: 'absolute',
            height: '100%',
            width: 3,
            left: 297,
            zIndex: 2003,
            top: 0,
            boxShadow: '3px 0 6px 0 rgba(0,0,0,.22)'
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2767
          },
          __self: this
        }),
        this.renderTopControls(),
        _react2.default.createElement(
          'div',
          {
            ref: 'scrollview',
            id: 'property-rows',
            style: {
              position: 'absolute',
              top: 35,
              left: 0,
              width: '100%',
              pointerEvents: this.state.avoidTimelinePointerEvents ? 'none' : 'auto',
              WebkitUserSelect: this.state.avoidTimelinePointerEvents ? 'none' : 'auto',
              bottom: 0,
              overflowY: 'auto',
              overflowX: 'hidden'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2778
            },
            __self: this
          },
          this.renderComponentRows(this.state.componentRowsData)
        ),
        this.renderBottomControls(),
        _react2.default.createElement(_ExpressionInput2.default, {
          ref: 'expressionInput',
          reactParent: this,
          inputSelected: this.state.inputSelected,
          inputFocused: this.state.inputFocused,
          onCommitValue: function onCommitValue(committedValue) {
            console.info('[timeline] input commit:', JSON.stringify(committedValue));

            _this29.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this29.state.inputFocused), _this29.state.currentTimelineName, _this29.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this29.state.inputFocused), _this29.getCurrentTimelineTime(_this29.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this29.setState({
              inputFocused: _this29.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this29.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this29.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2795
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJfZWxlbWVudHMiLCJ1cHNlcnRGcm9tTm9kZVdpdGhDb21wb25lbnRDYWNoZWQiLCJpc0NvbXBvbmVudCIsImdldE5hbWVTdHJpbmciLCJnZXRDb21wb25lbnRJZCIsIkFMTE9XRURfVEFHTkFNRVMiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJkb0dvRGVlcCIsInZhbHVlcyIsImdldEFkZHJlc3NhYmxlUHJvcGVydGllcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiayIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5IiwicGFyc2VJbnQiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwibXMiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBa0NBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztBQVVBLElBQUlBLFdBQVdDLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBSUMs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R0FBWTFiLElBQVosR0FBbUIsSUFEckI7QUFFWjFILCtCQUFlMEg7QUFGSCxlQUFkO0FBSUQ7QUFDRixXQWxDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE1Q0YsT0FERjtBQWtGRDs7OztFQWxtRm9CLGdCQUFNMmIsUzs7a0JBcW1GZHZnQixRIiwiZmlsZSI6IlRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgYXJjaHkgZnJvbSAnYXJjaHknXG5pbXBvcnQgeyBEcmFnZ2FibGVDb3JlIH0gZnJvbSAncmVhY3QtZHJhZ2dhYmxlJ1xuXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IFtdLFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuY29uc3QgVEhST1RUTEVfVElNRSA9IDE3IC8vIG1zXG5cbmZ1bmN0aW9uIHZpc2l0IChub2RlLCB2aXNpdG9yKSB7XG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2aXNpdG9yKGNoaWxkKVxuICAgICAgICB2aXNpdChjaGlsZCwgdmlzaXRvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSBsb2Rhc2guYXNzaWduKHt9LCBERUZBVUxUUylcbiAgICB0aGlzLmN0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdIC8vIEFycmF5PHtldmVudEVtaXR0ZXI6RXZlbnRFbWl0dGVyLCBldmVudE5hbWU6c3RyaW5nLCBldmVudEhhbmRsZXI6RnVuY3Rpb259PlxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ3RpbWVsaW5lJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHdlIHN0b3JlIGFjY3VtdWxhdGVkIGtleWZyYW1lIG1vdmVtZW50cywgd2UgY2FuIHNlbmQgdGhlIHdlYnNvY2tldCB1cGRhdGUgaW4gYmF0Y2hlcztcbiAgICAvLyBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBhdm9pZHMgdW5uZWNlc3NhcnkgdXBkYXRlcyB0byB0aGUgb3ZlciB2aWV3c1xuICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uID0gbG9kYXNoLnRocm90dGxlKHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uLmJpbmQodGhpcyksIDI1MClcbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB3aW5kb3cudGltZWxpbmUgPSB0aGlzXG4gIH1cblxuICBmbHVzaFVwZGF0ZXMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVwZGF0ZXMpLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnVwZGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW2tleV0gIT09IHRoaXMudXBkYXRlc1trZXldKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlc1trZXldID0gdGhpcy51cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHRoaXMuY2FsbGJhY2tzLnNwbGljZSgwKVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy51cGRhdGVzLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2hhbmdlcygpXG4gICAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKCkpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICh1cGRhdGVzLCBjYikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlc1trZXldID0gdXBkYXRlc1trZXldXG4gICAgfVxuICAgIGlmIChjYikge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYilcbiAgICB9XG4gICAgdGhpcy5mbHVzaFVwZGF0ZXMoKVxuICB9XG5cbiAgY2xlYXJDaGFuZ2VzICgpIHtcbiAgICBmb3IgKGNvbnN0IGsxIGluIHRoaXMudXBkYXRlcykgZGVsZXRlIHRoaXMudXBkYXRlc1trMV1cbiAgICBmb3IgKGNvbnN0IGsyIGluIHRoaXMuY2hhbmdlcykgZGVsZXRlIHRoaXMuY2hhbmdlc1trMl1cbiAgfVxuXG4gIHVwZGF0ZVRpbWUgKGN1cnJlbnRGcmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RnJhbWUgfSlcbiAgfVxuXG4gIHNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSB7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfVxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIHVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IG51bGxcbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICAvKlxuICAgKiBsaWZlY3ljbGUvZXZlbnRzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAvLyBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzIGFuZCByZWFjdCB3YXJuaW5nc1xuICAgIHRoaXMuZW1pdHRlcnMuZm9yRWFjaCgodHVwbGUpID0+IHtcbiAgICAgIHR1cGxlWzBdLnJlbW92ZUxpc3RlbmVyKHR1cGxlWzFdLCB0dXBsZVsyXSlcbiAgICB9KVxuICAgIHRoaXMuc3RhdGUuZGlkTW91bnQgPSBmYWxzZVxuXG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnYmVnaW4nKTtcbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnZW5kJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWRNb3VudDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCB9KVxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1RJTUUpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5wcm9wcy53ZWJzb2NrZXQsICdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZm9sZGVyICE9PSB0aGlzLnByb3BzLmZvbGRlcikgcmV0dXJuIHZvaWQgKDApXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzogcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gYWN0aW9uIHJlY2VpdmVkJywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCB1cGRhdGVkJywgbWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKVxuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBjbGVhciBjYWNoZXMgdGhlbiB0aGUgdGltZWxpbmUgZmllbGRzIG1pZ2h0IG5vdCB1cGRhdGUgcmlnaHQgYWZ0ZXIga2V5ZnJhbWUgZGVsZXRpb25zXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcblxuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG5cbiAgICAgIGlmIChtYXliZU1ldGFkYXRhICYmIG1heWJlTWV0YWRhdGEuZnJvbSAhPT0gJ3RpbWVsaW5lJykge1xuICAgICAgICBpZiAobWF5YmVDb21wb25lbnRJZHMgJiYgbWF5YmVUaW1lbGluZU5hbWUgJiYgbWF5YmVQcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgbWF5YmVDb21wb25lbnRJZHMuZm9yRWFjaCgoY29tcG9uZW50SWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZShjb21wb25lbnRJZCwgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lIHx8IDAsIG1heWJlUHJvcGVydHlOYW1lcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uU2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCB1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblVuc2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IG1vdW50ZWQnLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnJlaHlkcmF0ZUJ5dGVjb2RlKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKVxuICAgICAgLy8gdGhpcy51cGRhdGVUaW1lKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lKVxuICAgIH0pXG5cbiAgICAvLyBjb21wb25lbnQ6bW91bnRlZCBmaXJlcyB3aGVuIHRoaXMgZmluaXNoZXMgd2l0aG91dCBlcnJvclxuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGllbnQubmV4dCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBsZXQgZWRpdGFibGUgPSBwYXN0ZUV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIC8vIE91ciBpbnB1dCBmaWVsZHMgYXJlIDxzcGFuPnNcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScgfHwgZWRpdGFibGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIHZpYSBkZWZhdWx0JylcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBhIHByb3BlcnR5IGlucHV0LCBzbyBsZXQgdGhlIGRlZmF1bHQgYWN0aW9uIGhhcHBlblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY2hlY2sgbGVzcyBicml0dGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgZGVsZWdhdGVkIHRvIHBsdW1iaW5nJylcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY3JlYXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zLyogdmFsdWUsIGN1cnZlLCBlbmRtcywgZW5kdmFsdWUgKi8pXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdzcGxpdFNlZ21lbnQnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2pvaW5LZXlmcmFtZXMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdkZWxldGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY2hhbmdlU2VnbWVudEN1cnZlJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6dGljaycsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgd2UgZ290IGEgdGljaywgd2hpY2ggb2NjdXJzIGR1cmluZyBUaW1lbGluZSBtb2RlbCB1cGRhdGluZywgdGhlbiB3ZSB3YW50IHRvIHBhdXNlIGl0IGlmIHRoZSBzY3J1YmJlclxuICAgICAgLy8gaGFzIGFycml2ZWQgYXQgdGhlIG1heGltdW0gYWNjZXB0aWJsZSBmcmFtZSBpbiB0aGUgdGltZWxpbmUuXG4gICAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUGxheWVyUGxheWluZzogZmFsc2V9KVxuICAgICAgfVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOmF1dGhvcml0YXRpdmUtZnJhbWUtc2V0JywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAndGltZWxpbmUnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChuYXRpdmVFdmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGN1cnJlbnRseSBhY3RpdmUgZXhwcmVzc2lvbiBpbnB1dCBhIGNoYW5jZSB0byBjYXB0dXJlIHRoaXMgZXZlbnQgYW5kIHNob3J0IGNpcmN1aXQgdXMgaWYgc29cbiAgICBpZiAodGhpcy5yZWZzLmV4cHJlc3Npb25JbnB1dC53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQobmF0aXZlRXZlbnQpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoaXQgdGhlIHNwYWNlYmFyIF9hbmRfIHdlIGFyZW4ndCBpbnNpZGUgYW4gaW5wdXQgZmllbGQsIHRyZWF0IHRoYXQgbGlrZSBhIHBsYXliYWNrIHRyaWdnZXJcbiAgICBpZiAobmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gMzIgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0OmZvY3VzJykpIHtcbiAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzU2hpZnRLZXlEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXSwgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKDApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oLTEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoLTEpXG4gICAgICAgIH1cblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cpIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogdHJ1ZSB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKDEpXG4gICAgICAgIH1cblxuICAgICAgLy8gY2FzZSAzODogLy8gdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5qb2luS2V5ZnJhbWVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignam9pbktleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zLCBmcmFtZUluZm8pXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICBpZiAoT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3ZlcykubGVuZ3RoID4gMCkge1xuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEl0J3MgdmVyeSBoZWF2eSB0byB0cmFuc21pdCBhIHdlYnNvY2tldCBtZXNzYWdlIGZvciBldmVyeSBzaW5nbGUgbW92ZW1lbnQgd2hpbGUgdXBkYXRpbmcgdGhlIHVpLFxuICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSB0aGlzLl9rZXlmcmFtZU1vdmVzID0ge31cbiAgICAgIGxldCBtb3ZlbWVudEtleSA9IFtjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWVdLmpvaW4oJy0nKVxuICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uKClcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVwc2VydEZyb21Ob2RlV2l0aENvbXBvbmVudENhY2hlZChub2RlLCBwYXJlbnQsIHRoaXMuX2NvbXBvbmVudCwge30pXG5cbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gZWxlbWVudC5pc0NvbXBvbmVudCgpXG4gICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQuZ2V0TmFtZVN0cmluZygpXG4gICAgICBjb25zdCBjb21wb25lbnRJZCA9IGVsZW1lbnQuZ2V0Q29tcG9uZW50SWQoKVxuXG4gICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9faXNFeHBhbmRlZCAmJiAodGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5BTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgZG9Hb0RlZXAgPSBsb2NhdG9yLmxlbmd0aCA9PT0gMyAvLyAwLjAsIDAuMSwgZXRjXG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBPYmplY3QudmFsdWVzKGVsZW1lbnQuZ2V0QWRkcmVzc2FibGVQcm9wZXJ0aWVzKGRvR29EZWVwKSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcsXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLFxuICAgICAgICAgICAgICAgIGlzUHJvcGVydHk6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIGNsdXN0ZXIsIHNoaWZ0aW5nIHRoZSBpbmRleCBmb3J3YXJkIHNvIHdlIGRvbid0IHJlLXJlbmRlciB0aGUgaW5kaXZpZHVhbHMgb24gdGhlIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgIGxldCBjbHVzdGVyU2V0ID0gW3Byb3BlcnR5R3JvdXBEZXNjcmlwdG9yXVxuICAgICAgICAgICAgICAgIC8vIExvb2sgYWhlYWQgYnkgYSBmZXcgc3RlcHMgaW4gdGhlIGFycmF5IGFuZCBzZWUgaWYgdGhlIG5leHQgZWxlbWVudCBpcyBhIG1lbWJlciBvZiB0aGUgY3VycmVudCBjbHVzdGVyXG4gICAgICAgICAgICAgIGxldCBrID0gaSAvLyBUZW1wb3Jhcnkgc28gd2UgY2FuIGluY3JlbWVudCBgaWAgaW4gcGxhY2VcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gaiArIGtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtuZXh0SW5kZXhdXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV4dCB0aGluZyBpbiB0aGUgbGlzdCBzaGFyZXMgdGhlIHNhbWUgY2x1c3RlciBuYW1lLCBtYWtlIGl0IHBhcnQgb2YgdGhpcyBjbHVzdGVzclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RGVzY3JpcHRvciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4ID09PSBjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBjbHVzdGVyU2V0LnB1c2gobmV4dERlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgZ28gdG8gdGhlIG5leHQgb25lLCBidW1wIHRoZSBpdGVyYXRpb24gaW5kZXggc28gd2Ugc2tpcCBpdCBvbiB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgICAgY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyS2V5LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsXG4gICAgICAgICAgICAgICAgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcixcbiAgICAgICAgICAgICAgaXNQcm9wZXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWFkaW5nUm93LnByb3BlcnR5Um93cy5wdXNoKHByb3BlcnR5Um93KVxuXG4gICAgICAgICAgICAvLyBQdXNoaW5nIGFuIGVsZW1lbnQgaW50byBhIGNvbXBvbmVudCByb3cgd2lsbCByZXN1bHQgaW4gaXQgcmVuZGVyaW5nLCBzbyBvbmx5IHB1c2hcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSByb3dzIG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGV4XG4gICAgICAgICAgaWYgKG5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICBjb21wb25lbnRSb3dzLnB1c2gocHJvcGVydHlSb3cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdG9ySXRlcmF0aW9ucysrXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtLl9pbmRleCA9IGluZGV4XG4gICAgICBpdGVtLl9pdGVtcyA9IGl0ZW1zXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MgPSBjb21wb25lbnRSb3dzLmZpbHRlcigoeyBub2RlLCBwYXJlbnQsIGxvY2F0b3IgfSkgPT4ge1xuICAgICAgICAvLyBMb2NhdG9ycyA+IDAuMCBhcmUgYmVsb3cgdGhlIGxldmVsIHdlIHdhbnQgdG8gZGlzcGxheSAod2Ugb25seSB3YW50IHRoZSB0b3AgYW5kIGl0cyBjaGlsZHJlbilcbiAgICAgIGlmIChsb2NhdG9yLnNwbGl0KCcuJykubGVuZ3RoID4gMikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gIXBhcmVudCB8fCBwYXJlbnQuX19pc0V4cGFuZGVkXG4gICAgfSlcblxuICAgIHJldHVybiBjb21wb25lbnRSb3dzXG4gIH1cblxuICBtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIGxldCB2YWx1ZUdyb3VwID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRWYWx1ZUdyb3VwKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlKVxuICAgIGlmICghdmFsdWVHcm91cCkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBsZXQga2V5ZnJhbWVzTGlzdCA9IE9iamVjdC5rZXlzKHZhbHVlR3JvdXApLm1hcCgoa2V5ZnJhbWVLZXkpID0+IHBhcnNlSW50KGtleWZyYW1lS2V5LCAxMCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxuICAgIGlmIChrZXlmcmFtZXNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNjdXJyID0ga2V5ZnJhbWVzTGlzdFtpXVxuICAgICAgaWYgKGlzTmFOKG1zY3VycikpIGNvbnRpbnVlXG4gICAgICBsZXQgbXNwcmV2ID0ga2V5ZnJhbWVzTGlzdFtpIC0gMV1cbiAgICAgIGxldCBtc25leHQgPSBrZXlmcmFtZXNMaXN0W2kgKyAxXVxuXG4gICAgICBpZiAobXNjdXJyID4gZnJhbWVJbmZvLm1zQikgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgYWZ0ZXIgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXRcbiAgICAgIGlmIChtc2N1cnIgPCBmcmFtZUluZm8ubXNBICYmIG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmIG1zbmV4dCA8IGZyYW1lSW5mby5tc0EpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGVudGlyZWx5IGJlZm9yZSB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdCAocGFydGlhbCBzZWdtZW50cyBhcmUgb2spXG5cbiAgICAgIGxldCBwcmV2XG4gICAgICBsZXQgY3VyclxuICAgICAgbGV0IG5leHRcblxuICAgICAgaWYgKG1zcHJldiAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc3ByZXYpKSB7XG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgbXM6IG1zcHJldixcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgLSAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zcHJldiwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zcHJldl0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNwcmV2XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSB7XG4gICAgICAgIG1zOiBtc2N1cnIsXG4gICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zY3VyciwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc2N1cnJdLnZhbHVlLFxuICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc2N1cnJdLmN1cnZlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc25leHQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNuZXh0KSkge1xuICAgICAgICBuZXh0ID0ge1xuICAgICAgICAgIG1zOiBtc25leHQsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc25leHQsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc25leHRdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zbmV4dF0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcHhPZmZzZXRMZWZ0ID0gKGN1cnIuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgbGV0IHB4T2Zmc2V0UmlnaHRcbiAgICAgIGlmIChuZXh0KSBweE9mZnNldFJpZ2h0ID0gKG5leHQuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgICBsZXQgc2VnbWVudE91dHB1dCA9IGl0ZXJhdGVlKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaSlcbiAgICAgIGlmIChzZWdtZW50T3V0cHV0KSBzZWdtZW50T3V0cHV0cy5wdXNoKHNlZ21lbnRPdXRwdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICBtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5Um93cywgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBwcm9wZXJ0eVJvd3MuZm9yRWFjaCgocHJvcGVydHlSb3cpID0+IHtcbiAgICAgIGlmIChwcm9wZXJ0eVJvdy5pc0NsdXN0ZXIpIHtcbiAgICAgICAgcHJvcGVydHlSb3cuY2x1c3Rlci5mb3JFYWNoKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlEZXNjcmlwdG9yLm5hbWVcbiAgICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eVJvdy5wcm9wZXJ0eS5uYW1lXG4gICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIHJlbW92ZVRpbWVsaW5lU2hhZG93ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gIH1cblxuICAvKlxuICAgKiByZW5kZXIgbWV0aG9kc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgdG9wOiAxN1xuICAgICAgICB9fT5cbiAgICAgICAgPENvbnRyb2xzQXJlYVxuICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnJlbW92ZVRpbWVsaW5lU2hhZG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWU9e3RoaXMucHJvcHMudXNlcmNvbmZpZy5uYW1lfVxuICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e09iamVjdC5rZXlzKCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSkgPyB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50aW1lbGluZXMgOiB7fSl9XG4gICAgICAgICAgc2VsZWN0ZWRUaW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICBjdXJyZW50RnJhbWU9e3RoaXMuc3RhdGUuY3VycmVudEZyYW1lfVxuICAgICAgICAgIGlzUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgcGxheWJhY2tTcGVlZD17dGhpcy5zdGF0ZS5wbGF5ZXJQbGF5YmFja1NwZWVkfVxuICAgICAgICAgIGxhc3RGcmFtZT17dGhpcy5nZXRGcmFtZUluZm8oKS5mcmlNYXh9XG4gICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXsob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjcmVhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkdXBsaWNhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkZWxldGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzZWxlY3RUaW1lbGluZT17KGN1cnJlbnRUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgaW4tbWVtb3J5IGNvbXBvbmVudCBvciBwcm9wZXJ0eSBhc3NpZ25tZW50IG1pZ2h0IG5vdCB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFRpbWVsaW5lTmFtZShjdXJyZW50VGltZWxpbmVOYW1lLCB7IGZyb206ICd0aW1lbGluZScgfSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NldFRpbWVsaW5lTmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgY3VycmVudFRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lbGluZU5hbWUgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8qIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBGb3J3YXJkPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaU1heCB9KVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17KGlucHV0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQbGF5YmFja1NwZWVkID0gTnVtYmVyKGlucHV0RXZlbnQudGFyZ2V0LnZhbHVlIHx8IDEpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGxheWVyUGxheWJhY2tTcGVlZCB9KVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIChpbnB1dEl0ZW0pIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKGlucHV0SXRlbS5ub2RlLCBmcmFtZUluZm8sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZSwgdGhpcy5fY29tcG9uZW50LCB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBpbnB1dEl0ZW0ucHJvcGVydHkpXG4gIH1cblxuICBnZXRDdXJyZW50VGltZWxpbmVUaW1lIChmcmFtZUluZm8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChpdGVtKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBsZXQgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgdGhpcz8gV2UgZG9uJ3QgbmVlZCB0byByZW5kZXIgZXZlcnkgc2VnbWVudCBzaW5jZSBzb21lIG9mIHRoZW0gb3ZlcmxhcC5cbiAgICAvLyBNYXliZSBrZWVwIGEgbGlzdCBvZiBrZXlmcmFtZSAncG9sZXMnIHJlbmRlcmVkLCBhbmQgb25seSByZW5kZXIgb25jZSBpbiB0aGF0IHNwb3Q/XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCBoZWlnaHQ6IDI1LCB3aWR0aDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBpdGVtLnByb3BlcnR5Um93cywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgaW5kZXgsIGhhbmRsZSwgb3B0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW50IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IGN1cnIubXNcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBjdXJyLmZyYW1lXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZScsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBudWxsLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDMsXG4gICAgICAgICAgICBjdXJzb3I6ICdjb2wtcmVzaXplJ1xuICAgICAgICAgIH19IC8+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU29sb0tleWZyYW1lIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBsZXQgaXNBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGlzQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgIHRvcDogLTMsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgOiAoaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICB9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFuc2l0aW9uQm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuICAgIGNvbnN0IGN1cnZlID0gY3Vyci5jdXJ2ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnIuY3VydmUuc2xpY2UoMSlcbiAgICBjb25zdCBicmVha2luZ0JvdW5kcyA9IGN1cnZlLmluY2x1ZGVzKCdCYWNrJykgfHwgY3VydmUuaW5jbHVkZXMoJ0JvdW5jZScpIHx8IGN1cnZlLmluY2x1ZGVzKCdFbGFzdGljJylcbiAgICBjb25zdCBDdXJ2ZVNWRyA9IENVUlZFU1ZHU1tjdXJ2ZSArICdTVkcnXVxuICAgIGxldCBmaXJzdEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBsZXQgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgICBpZiAoayA9PT0gY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbm5vdCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlLCBhY3RpdmVLZXlmcmFtZXM6IFtdIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODAsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDMsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Y2x1c3Rlck5hbWV9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPENsdXN0ZXJJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXtyZWlmaWVkQnl0ZWNvZGV9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXRpbWVsaW5lLXNlZ21lbnRzLWJveCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBbaXRlbV0sIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cbiAgICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSB2aXJ0dWFsIGxpc3Qgb2YgYWxsIHRoZSBjb21wb25lbnQgcm93cyAoaW5jbHVkZXMgaGVhZGluZ3MgYW5kIHByb3BlcnR5IHJvd3MpXG4gIHJlbmRlckNvbXBvbmVudFJvd3MgKGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZE1vdW50KSByZXR1cm4gPHNwYW4gLz5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxpc3QnXG4gICAgICAgIHN0eWxlPXtsb2Rhc2guYXNzaWduKHt9LCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgfSl9PlxuICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5T25MYXN0Q29tcG9uZW50ID0gaXRlbS5zaWJsaW5ncy5sZW5ndGggPiAwICYmIGl0ZW0uaW5kZXggPT09IGl0ZW0uc2libGluZ3MubGVuZ3RoIC0gMVxuICAgICAgICAgIGlmIChpdGVtLmlzQ2x1c3Rlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ2x1c3RlclJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uaXNQcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUHJvcGVydHlSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNvbXBvbmVudEhlYWRpbmdSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhID0gdGhpcy5nZXRDb21wb25lbnRSb3dzRGF0YSgpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPSdjb250YWluZXInXG4gICAgICAgIGlkPSd0aW1lbGluZSdcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6ICdjYWxjKDEwMCUgLSA0NXB4KScsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBvdmVyZmxvd1k6ICdoaWRkZW4nLFxuICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSduby1zZWxlY3QnIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBsZWZ0OiAyOTcsXG4gICAgICAgICAgICB6SW5kZXg6IDIwMDMsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBib3hTaGFkb3c6ICczcHggMCA2cHggMCByZ2JhKDAsMCwwLC4yMiknXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgfVxuICAgICAgICB7dGhpcy5yZW5kZXJUb3BDb250cm9scygpfVxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPSdzY3JvbGx2aWV3J1xuICAgICAgICAgIGlkPSdwcm9wZXJ0eS1yb3dzJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMzUsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93cyh0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvdHRvbUNvbnRyb2xzKCl9XG4gICAgICAgIDxFeHByZXNzaW9uSW5wdXRcbiAgICAgICAgICByZWY9J2V4cHJlc3Npb25JbnB1dCdcbiAgICAgICAgICByZWFjdFBhcmVudD17dGhpc31cbiAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgaW5wdXRGb2N1c2VkPXt0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZH1cbiAgICAgICAgICBvbkNvbW1pdFZhbHVlPXsoY29tbWl0dGVkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBpbnB1dCBjb21taXQ6JywgSlNPTi5zdHJpbmdpZnkoY29tbWl0dGVkVmFsdWUpKVxuXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKFxuICAgICAgICAgICAgICBnZXRJdGVtQ29tcG9uZW50SWQodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkLm5vZGUuZWxlbWVudE5hbWUsXG4gICAgICAgICAgICAgIGdldEl0ZW1Qcm9wZXJ0eU5hbWUodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUodGhpcy5nZXRGcmFtZUluZm8oKSksXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFZhbHVlLFxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gY3VydmVcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGVuZE1zXG4gICAgICAgICAgICAgIHZvaWQgKDApIC8vIGVuZFZhbHVlXG4gICAgICAgICAgICApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkZvY3VzUmVxdWVzdGVkPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk5hdmlnYXRlUmVxdWVzdGVkPXsobmF2RGlyLCBkb0ZvY3VzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgbGV0IG5leHQgPSBuZXh0UHJvcEl0ZW0oaXRlbSwgbmF2RGlyKVxuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiAoZG9Gb2N1cykgPyBuZXh0IDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBuZXh0XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lbGluZVxuIl19