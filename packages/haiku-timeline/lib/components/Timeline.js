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
            addressableArraysCache[elementName] = element.getAddressablePropertiesArray(locator === '0');
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
            lineNumber: 1410
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
            lineNumber: 1415
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
            lineNumber: 1483
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
            lineNumber: 1506
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
            lineNumber: 1534
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
            lineNumber: 1582
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
              lineNumber: 1594
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1602
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
            lineNumber: 1628
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
              lineNumber: 1656
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
              lineNumber: 1707
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
              lineNumber: 1723
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
                lineNumber: 1740
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
                  lineNumber: 1750
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1758
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
                lineNumber: 1768
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1777
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
                lineNumber: 1795
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
                  lineNumber: 1806
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1816
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
            lineNumber: 1836
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
            lineNumber: 1875
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
              lineNumber: 1918
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
                  lineNumber: 1934
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1935
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
                  lineNumber: 1944
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1945
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
                  lineNumber: 1950
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1951
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
            lineNumber: 1962
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1964
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
            lineNumber: 1977
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1996
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
                lineNumber: 1997
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
                lineNumber: 2010
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
                lineNumber: 2020
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
              lineNumber: 2032
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
              lineNumber: 2055
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2074
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
                lineNumber: 2075
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
                lineNumber: 2088
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2102
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
            lineNumber: 2109
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
              lineNumber: 2122
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
                lineNumber: 2131
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2143
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2145
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
                    lineNumber: 2146
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
                lineNumber: 2150
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2165
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2167
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
                    lineNumber: 2168
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
                  lineNumber: 2171
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
                lineNumber: 2173
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2190
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2191
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2192
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2194
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
                  lineNumber: 2196
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2197
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2198
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2199
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
              lineNumber: 2206
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
            lineNumber: 2243
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
              lineNumber: 2253
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
                lineNumber: 2277
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
                  lineNumber: 2287
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2292
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
                  lineNumber: 2294
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2299
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
              lineNumber: 2303
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
              lineNumber: 2304
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
            lineNumber: 2319
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
            lineNumber: 2346
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2349
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
              lineNumber: 2350
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2361
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2362
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
              lineNumber: 2364
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
            lineNumber: 2379
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
            lineNumber: 2406
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
              lineNumber: 2414
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2422
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
                  lineNumber: 2423
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2428
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2428
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2429
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2429
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
              lineNumber: 2435
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
            lineNumber: 2450
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
              lineNumber: 2460
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
                lineNumber: 2472
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2482
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2482
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
              lineNumber: 2487
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
                lineNumber: 2496
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
                  lineNumber: 2509
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
              lineNumber: 2523
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
              lineNumber: 2532
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
              lineNumber: 2547
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
            lineNumber: 2598
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2629
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
              lineNumber: 2631
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
                lineNumber: 2640
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2647
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2647
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
                lineNumber: 2649
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
                  lineNumber: 2662
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
              lineNumber: 2671
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
              lineNumber: 2680
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
              lineNumber: 2694
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
          lineNumber: 2725
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
            lineNumber: 2728
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
            lineNumber: 2750
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
            lineNumber: 2766
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
              lineNumber: 2777
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
            lineNumber: 2794
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJfZWxlbWVudHMiLCJ1cHNlcnRGcm9tTm9kZVdpdGhDb21wb25lbnRDYWNoZWQiLCJpc0NvbXBvbmVudCIsImdldE5hbWVTdHJpbmciLCJnZXRDb21wb25lbnRJZCIsIkFMTE9XRURfVEFHTkFNRVMiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJnZXRBZGRyZXNzYWJsZVByb3BlcnRpZXNBcnJheSIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiayIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5IiwicGFyc2VJbnQiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwibXMiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBa0NBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztBQVVBLElBQUlBLFdBQVdDLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBSUMsV0FBV0YsU0FBU0UsUUFB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QTtBQTVDRixPQURGO0FBa0ZEOzs7O0VBam1Gb0IsZ0JBQU15YixTOztrQkFvbUZkcmdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBleHByZXNzaW9uVG9STyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL2V4cHJlc3Npb25Ub1JPJ1xuXG5pbXBvcnQgVGltZWxpbmVQcm9wZXJ0eSBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvVGltZWxpbmVQcm9wZXJ0eSdcbmltcG9ydCBCeXRlY29kZUFjdGlvbnMgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL2FjdGlvbnMnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcblxuaW1wb3J0IHtcbiAgbmV4dFByb3BJdGVtLFxuICBnZXRJdGVtQ29tcG9uZW50SWQsXG4gIGdldEl0ZW1Qcm9wZXJ0eU5hbWVcbn0gZnJvbSAnLi9oZWxwZXJzL0l0ZW1IZWxwZXJzJ1xuXG5pbXBvcnQgZ2V0TWF4aW11bU1zIGZyb20gJy4vaGVscGVycy9nZXRNYXhpbXVtTXMnXG5pbXBvcnQgbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSBmcm9tICcuL2hlbHBlcnMvbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSdcbmltcG9ydCBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMgZnJvbSAnLi9oZWxwZXJzL2NsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcydcbmltcG9ydCBodW1hbml6ZVByb3BlcnR5TmFtZSBmcm9tICcuL2hlbHBlcnMvaHVtYW5pemVQcm9wZXJ0eU5hbWUnXG5pbXBvcnQgZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IgZnJvbSAnLi9oZWxwZXJzL2dldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yJ1xuaW1wb3J0IGdldE1pbGxpc2Vjb25kTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0TWlsbGlzZWNvbmRNb2R1bHVzJ1xuaW1wb3J0IGdldEZyYW1lTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0RnJhbWVNb2R1bHVzJ1xuaW1wb3J0IGZvcm1hdFNlY29uZHMgZnJvbSAnLi9oZWxwZXJzL2Zvcm1hdFNlY29uZHMnXG5pbXBvcnQgcm91bmRVcCBmcm9tICcuL2hlbHBlcnMvcm91bmRVcCdcblxuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vaGVscGVycy90cnVuY2F0ZSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgS2V5ZnJhbWVTVkcgZnJvbSAnLi9pY29ucy9LZXlmcmFtZVNWRydcblxuaW1wb3J0IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufSBmcm9tICcuL2ljb25zL0N1cnZlU1ZHUydcblxuaW1wb3J0IERvd25DYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9Eb3duQ2Fycm90U1ZHJ1xuaW1wb3J0IFJpZ2h0Q2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvUmlnaHRDYXJyb3RTVkcnXG5pbXBvcnQgQ29udHJvbHNBcmVhIGZyb20gJy4vQ29udHJvbHNBcmVhJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vQ29udGV4dE1lbnUnXG5pbXBvcnQgRXhwcmVzc2lvbklucHV0IGZyb20gJy4vRXhwcmVzc2lvbklucHV0J1xuaW1wb3J0IENsdXN0ZXJJbnB1dEZpZWxkIGZyb20gJy4vQ2x1c3RlcklucHV0RmllbGQnXG5pbXBvcnQgUHJvcGVydHlJbnB1dEZpZWxkIGZyb20gJy4vUHJvcGVydHlJbnB1dEZpZWxkJ1xuXG4vKiB6LWluZGV4IGd1aWRlXG4gIGtleWZyYW1lOiAxMDAyXG4gIHRyYW5zaXRpb24gYm9keTogMTAwMlxuICBrZXlmcmFtZSBkcmFnZ2VyczogMTAwM1xuICBpbnB1dHM6IDEwMDQsICgxMDA1IGFjdGl2ZSlcbiAgdHJpbS1hcmVhIDEwMDZcbiAgc2NydWJiZXI6IDEwMDZcbiAgYm90dG9tIGNvbnRyb2xzOiAxMDAwMCA8LSBrYS1ib29tIVxuKi9cblxudmFyIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBwcm9wZXJ0aWVzV2lkdGg6IDMwMCxcbiAgdGltZWxpbmVzV2lkdGg6IDg3MCxcbiAgcm93SGVpZ2h0OiAyNSxcbiAgaW5wdXRDZWxsV2lkdGg6IDc1LFxuICBtZXRlckhlaWdodDogMjUsXG4gIGNvbnRyb2xzSGVpZ2h0OiA0MixcbiAgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCA2MF0sXG4gIGN1cnJlbnRGcmFtZTogMCxcbiAgbWF4RnJhbWU6IG51bGwsXG4gIGR1cmF0aW9uVHJpbTogMCxcbiAgZnJhbWVzUGVyU2Vjb25kOiA2MCxcbiAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJywgLy8gb3IgJ2ZyYW1lcydcbiAgY3VycmVudFRpbWVsaW5lTmFtZTogJ0RlZmF1bHQnLFxuICBpc1BsYXllclBsYXlpbmc6IGZhbHNlLFxuICBwbGF5ZXJQbGF5YmFja1NwZWVkOiAxLjAsXG4gIGlzU2hpZnRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb21tYW5kS2V5RG93bjogZmFsc2UsXG4gIGlzQ29udHJvbEtleURvd246IGZhbHNlLFxuICBpc0FsdEtleURvd246IGZhbHNlLFxuICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UsXG4gIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSxcbiAgc2VsZWN0ZWROb2Rlczoge30sXG4gIGV4cGFuZGVkTm9kZXM6IHt9LFxuICBhY3RpdmF0ZWRSb3dzOiB7fSxcbiAgaGlkZGVuTm9kZXM6IHt9LFxuICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyczoge30sXG4gIGFjdGl2ZUtleWZyYW1lczogW10sXG4gIHJlaWZpZWRCeXRlY29kZTogbnVsbCxcbiAgc2VyaWFsaXplZEJ5dGVjb2RlOiBudWxsXG59XG5cbmNvbnN0IENVUlZFU1ZHUyA9IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufVxuXG5jb25zdCBUSFJPVFRMRV9USU1FID0gMTcgLy8gbXNcblxuZnVuY3Rpb24gdmlzaXQgKG5vZGUsIHZpc2l0b3IpIHtcbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV1cbiAgICAgIGlmIChjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZpc2l0b3IoY2hpbGQpXG4gICAgICAgIHZpc2l0KGNoaWxkLCB2aXNpdG9yKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBUaW1lbGluZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IGxvZGFzaC5hc3NpZ24oe30sIERFRkFVTFRTKVxuICAgIHRoaXMuY3R4bWVudSA9IG5ldyBDb250ZXh0TWVudSh3aW5kb3csIHRoaXMpXG5cbiAgICB0aGlzLmVtaXR0ZXJzID0gW10gLy8gQXJyYXk8e2V2ZW50RW1pdHRlcjpFdmVudEVtaXR0ZXIsIGV2ZW50TmFtZTpzdHJpbmcsIGV2ZW50SGFuZGxlcjpGdW5jdGlvbn0+XG5cbiAgICB0aGlzLl9jb21wb25lbnQgPSBuZXcgQWN0aXZlQ29tcG9uZW50KHtcbiAgICAgIGFsaWFzOiAndGltZWxpbmUnLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHVzZXJjb25maWc6IHRoaXMucHJvcHMudXNlcmNvbmZpZyxcbiAgICAgIHdlYnNvY2tldDogdGhpcy5wcm9wcy53ZWJzb2NrZXQsXG4gICAgICBwbGF0Zm9ybTogd2luZG93LFxuICAgICAgZW52b3k6IHRoaXMucHJvcHMuZW52b3ksXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgLy8gU2luY2Ugd2Ugc3RvcmUgYWNjdW11bGF0ZWQga2V5ZnJhbWUgbW92ZW1lbnRzLCB3ZSBjYW4gc2VuZCB0aGUgd2Vic29ja2V0IHVwZGF0ZSBpbiBiYXRjaGVzO1xuICAgIC8vIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIGF2b2lkcyB1bm5lY2Vzc2FyeSB1cGRhdGVzIHRvIHRoZSBvdmVyIHZpZXdzXG4gICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gPSBsb2Rhc2gudGhyb3R0bGUodGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24uYmluZCh0aGlzKSwgMjUwKVxuICAgIHRoaXMudXBkYXRlU3RhdGUgPSB0aGlzLnVwZGF0ZVN0YXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHdpbmRvdy50aW1lbGluZSA9IHRoaXNcbiAgfVxuXG4gIGZsdXNoVXBkYXRlcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMudXBkYXRlcykubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMudXBkYXRlcykge1xuICAgICAgaWYgKHRoaXMuc3RhdGVba2V5XSAhPT0gdGhpcy51cGRhdGVzW2tleV0pIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VzW2tleV0gPSB0aGlzLnVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2JzID0gdGhpcy5jYWxsYmFja3Muc3BsaWNlKDApXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnVwZGF0ZXMsICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJDaGFuZ2VzKClcbiAgICAgIGNicy5mb3JFYWNoKChjYikgPT4gY2IoKSlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKHVwZGF0ZXMsIGNiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgdGhpcy51cGRhdGVzW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICB9XG4gICAgaWYgKGNiKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNiKVxuICAgIH1cbiAgICB0aGlzLmZsdXNoVXBkYXRlcygpXG4gIH1cblxuICBjbGVhckNoYW5nZXMgKCkge1xuICAgIGZvciAoY29uc3QgazEgaW4gdGhpcy51cGRhdGVzKSBkZWxldGUgdGhpcy51cGRhdGVzW2sxXVxuICAgIGZvciAoY29uc3QgazIgaW4gdGhpcy5jaGFuZ2VzKSBkZWxldGUgdGhpcy5jaGFuZ2VzW2syXVxuICB9XG5cbiAgdXBkYXRlVGltZSAoY3VycmVudEZyYW1lKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGcmFtZSB9KVxuICB9XG5cbiAgc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9XG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgdW5zZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0gbnVsbFxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIC8qXG4gICAqIGxpZmVjeWNsZS9ldmVudHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIC8vIENsZWFuIHVwIHN1YnNjcmlwdGlvbnMgdG8gcHJldmVudCBtZW1vcnkgbGVha3MgYW5kIHJlYWN0IHdhcm5pbmdzXG4gICAgdGhpcy5lbWl0dGVycy5mb3JFYWNoKCh0dXBsZSkgPT4ge1xuICAgICAgdHVwbGVbMF0ucmVtb3ZlTGlzdGVuZXIodHVwbGVbMV0sIHR1cGxlWzJdKVxuICAgIH0pXG4gICAgdGhpcy5zdGF0ZS5kaWRNb3VudCA9IGZhbHNlXG5cbiAgICB0aGlzLnRvdXJDbGllbnQub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5fZW52b3lDbGllbnQuY2xvc2VDb25uZWN0aW9uKClcblxuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdiZWdpbicpO1xuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdlbmQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRpZE1vdW50OiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIH0pXG4gICAgICB9XG4gICAgfSwgVEhST1RUTEVfVElNRSkpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLnByb3BzLndlYnNvY2tldCwgJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5mb2xkZXIgIT09IHRoaXMucHJvcHMuZm9sZGVyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOiByZXR1cm4gdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBhY3Rpb24gcmVjZWl2ZWQnLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuY2FsbE1ldGhvZChtZXRob2QsIHBhcmFtcywgY2IpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50OnVwZGF0ZWQnLCAobWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IHVwZGF0ZWQnLCBtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpXG5cbiAgICAgIC8vIElmIHdlIGRvbid0IGNsZWFyIGNhY2hlcyB0aGVuIHRoZSB0aW1lbGluZSBmaWVsZHMgbWlnaHQgbm90IHVwZGF0ZSByaWdodCBhZnRlciBrZXlmcmFtZSBkZWxldGlvbnNcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuXG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcblxuICAgICAgaWYgKG1heWJlTWV0YWRhdGEgJiYgbWF5YmVNZXRhZGF0YS5mcm9tICE9PSAndGltZWxpbmUnKSB7XG4gICAgICAgIGlmIChtYXliZUNvbXBvbmVudElkcyAmJiBtYXliZVRpbWVsaW5lTmFtZSAmJiBtYXliZVByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICBtYXliZUNvbXBvbmVudElkcy5mb3JFYWNoKChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5taW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlKGNvbXBvbmVudElkLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUgfHwgMCwgbWF5YmVQcm9wZXJ0eU5hbWVzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCBzZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25TZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnVuc2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHVuc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uVW5zZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6bW91bnRlZCcsICgpID0+IHtcbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgbW91bnRlZCcsIHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMucmVoeWRyYXRlQnl0ZWNvZGUocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpXG4gICAgICAvLyB0aGlzLnVwZGF0ZVRpbWUodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUpXG4gICAgfSlcblxuICAgIC8vIGNvbXBvbmVudDptb3VudGVkIGZpcmVzIHdoZW4gdGhpcyBmaW5pc2hlcyB3aXRob3V0IGVycm9yXG4gICAgdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0b3VyQ2xpZW50UmVhZHknLCAoY2xpZW50KSA9PiB7XG4gICAgICBjbGllbnQub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNsaWVudC5uZXh0KClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGxldCBlZGl0YWJsZSA9IHBhc3RlRXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykgLy8gT3VyIGlucHV0IGZpZWxkcyBhcmUgPHNwYW4+c1xuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJyB8fCBlZGl0YWJsZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgdmlhIGRlZmF1bHQnKVxuICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGEgcHJvcGVydHkgaW5wdXQsIHNvIGxldCB0aGUgZGVmYXVsdCBhY3Rpb24gaGFwcGVuXG4gICAgICAgIC8vIFRPRE86IE1ha2UgdGhpcyBjaGVjayBsZXNzIGJyaXR0bGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vdGlmeSBjcmVhdG9yIHRoYXQgd2UgaGF2ZSBzb21lIGNvbnRlbnQgdGhhdCB0aGUgcGVyc29uIHdpc2hlcyB0byBwYXN0ZSBvbiB0aGUgc3RhZ2U7XG4gICAgICAgIC8vIHRoZSB0b3AgbGV2ZWwgbmVlZHMgdG8gaGFuZGxlIHRoaXMgYmVjYXVzZSBpdCBkb2VzIGNvbnRlbnQgdHlwZSBkZXRlY3Rpb24uXG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBkZWxlZ2F0ZWQgdG8gcGx1bWJpbmcnKVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgICAgZGF0YTogbnVsbCAvLyBUaGlzIGNhbiBob2xkIGNvb3JkaW5hdGVzIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIHBhc3RlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpLCBmYWxzZSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcykpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjcmVhdGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMvKiB2YWx1ZSwgY3VydmUsIGVuZG1zLCBlbmR2YWx1ZSAqLylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ3NwbGl0U2VnbWVudCcsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnam9pbktleWZyYW1lcycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2RlbGV0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjaGFuZ2VTZWdtZW50Q3VydmUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnbW92ZVNlZ21lbnRFbmRwb2ludHMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcylcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDp0aWNrJywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiB3ZSBnb3QgYSB0aWNrLCB3aGljaCBvY2N1cnMgZHVyaW5nIFRpbWVsaW5lIG1vZGVsIHVwZGF0aW5nLCB0aGVuIHdlIHdhbnQgdG8gcGF1c2UgaXQgaWYgdGhlIHNjcnViYmVyXG4gICAgICAvLyBoYXMgYXJyaXZlZCBhdCB0aGUgbWF4aW11bSBhY2NlcHRpYmxlIGZyYW1lIGluIHRoZSB0aW1lbGluZS5cbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNQbGF5ZXJQbGF5aW5nOiBmYWxzZX0pXG4gICAgICB9XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6YXV0aG9yaXRhdGl2ZS1mcmFtZS1zZXQnLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICd0aW1lbGluZScpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygndGltZWxpbmUnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleURvd24gKG5hdGl2ZUV2ZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY3VycmVudGx5IGFjdGl2ZSBleHByZXNzaW9uIGlucHV0IGEgY2hhbmNlIHRvIGNhcHR1cmUgdGhpcyBldmVudCBhbmQgc2hvcnQgY2lyY3VpdCB1cyBpZiBzb1xuICAgIGlmICh0aGlzLnJlZnMuZXhwcmVzc2lvbklucHV0LndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudChuYXRpdmVFdmVudCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGhpdCB0aGUgc3BhY2ViYXIgX2FuZF8gd2UgYXJlbid0IGluc2lkZSBhbiBpbnB1dCBmaWVsZCwgdHJlYXQgdGhhdCBsaWtlIGEgcGxheWJhY2sgdHJpZ2dlclxuICAgIGlmIChuYXRpdmVFdmVudC5rZXlDb2RlID09PSAzMiAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQ6Zm9jdXMnKSkge1xuICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNTaGlmdEtleURvd24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1dLCBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoMClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigtMSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiYgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgtMSlcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdykgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiB0cnVlIH0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoMSlcbiAgICAgICAgfVxuXG4gICAgICAvLyBjYXNlIDM4OiAvLyB1cFxuICAgICAgLy8gY2FzZSA0MDogLy8gZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKG5hdGl2ZUV2ZW50KSB7XG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIC8vIGNhc2UgMzc6IC8vbGVmdFxuICAgICAgLy8gY2FzZSAzOTogLy9yaWdodFxuICAgICAgLy8gY2FzZSAzODogLy91cFxuICAgICAgLy8gY2FzZSA0MDogLy9kb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVLZXlib2FyZFN0YXRlICh1cGRhdGVzKSB7XG4gICAgLy8gSWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGRvbid0IGFsbG93IGtleWJvYXJkIHN0YXRlIGNoYW5nZXMgdG8gY2F1c2UgYSByZS1yZW5kZXIsIG90aGVyd2lzZVxuICAgIC8vIHRoZSBpbnB1dCBmaWVsZCB3aWxsIHN3aXRjaCBiYWNrIHRvIGl0cyBwcmV2aW91cyBjb250ZW50cyAoZS5nLiB3aGVuIGhvbGRpbmcgZG93biAnc2hpZnQnKVxuICAgIGlmICghdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHVwZGF0ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICAgIHRoaXMuc3RhdGVba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVtaXR0ZXJMaXN0ZW5lciAoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChbZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcl0pXG4gICAgZXZlbnRFbWl0dGVyLm9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxuICB9XG5cbiAgLypcbiAgICogc2V0dGVycy91cGRhdGVyc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBkZXNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IHRydWVcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAwXG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9Ob2RlIChub2RlKSB7XG4gICAgdmFyIHJvd3NEYXRhID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIHZhciBmb3VuZEluZGV4ID0gbnVsbFxuICAgIHZhciBpbmRleENvdW50ZXIgPSAwXG4gICAgcm93c0RhdGEuZm9yRWFjaCgocm93SW5mbywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzSGVhZGluZykge1xuICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgfSBlbHNlIGlmIChyb3dJbmZvLmlzUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXhDb3VudGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmb3VuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gKGZvdW5kSW5kZXggKiB0aGlzLnN0YXRlLnJvd0hlaWdodCkgLSB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREb21Ob2RlT2Zmc2V0WSAoZG9tTm9kZSkge1xuICAgIHZhciBjdXJ0b3AgPSAwXG4gICAgaWYgKGRvbU5vZGUub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIGN1cnRvcCArPSBkb21Ob2RlLm9mZnNldFRvcFxuICAgICAgfSB3aGlsZSAoZG9tTm9kZSA9IGRvbU5vZGUub2Zmc2V0UGFyZW50KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuICAgIHJldHVybiBjdXJ0b3BcbiAgfVxuXG4gIGNvbGxhcHNlTm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICB2aXNpdChub2RlLCAoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgICBjaGlsZC5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBsZXQgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGV4cGFuZE5vZGUgKG5vZGUsIGNvbXBvbmVudElkKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKG5vZGUucGFyZW50KSB0aGlzLmV4cGFuZE5vZGUobm9kZS5wYXJlbnQpIC8vIElmIHdlIGFyZSBleHBhbmRlZCwgb3VyIHBhcmVudCBoYXMgdG8gYmUgdG9vXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpc1Jvd0FjdGl2YXRlZCAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV1cbiAgICB9XG4gIH1cblxuICBpc0NsdXN0ZXJBY3RpdmF0ZWQgKGl0ZW0pIHtcbiAgICByZXR1cm4gZmFsc2UgLy8gVE9ET1xuICB9XG5cbiAgdG9nZ2xlVGltZURpc3BsYXlNb2RlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdzZWNvbmRzJ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVCYXNlbGluZSA9IHRoaXMuc3RhdGUuZnJhbWVCYXNlbGluZVxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICB2YXIgY3VycmVudEZyYW1lID0gZnJhbWVCYXNlbGluZSArIGZyYW1lRGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlCKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLmR1cmF0aW9uRHJhZ1N0YXJ0XG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIGlmIChkcmFnRGVsdGEgPiAwICYmIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltID49IDApIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkge1xuICAgICAgICB2YXIgYWRkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyAyMH0pXG4gICAgICAgIH0sIDMwMClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkSW50ZXJ2YWw6IGFkZEludGVydmFsfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdJc0FkZGluZzogdHJ1ZX0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAvLyBEb24ndCBsZXQgdXNlciBkcmFnIGJhY2sgcGFzdCBsYXN0IGZyYW1lOyBhbmQgZG9uJ3QgbGV0IHRoZW0gZHJhZyBtb3JlIHRoYW4gYW4gZW50aXJlIHdpZHRoIG9mIGZyYW1lc1xuICAgIGlmIChmcmFtZUluZm8uZnJpQiArIGZyYW1lRGVsdGEgPD0gZnJhbWVJbmZvLmZyaU1heCB8fCAtZnJhbWVEZWx0YSA+PSBmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICBmcmFtZURlbHRhID0gdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gLy8gVG9kbzogbWFrZSBtb3JlIHByZWNpc2Ugc28gaXQgcmVtb3ZlcyBhcyBtYW55IGZyYW1lcyBhc1xuICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGNhbiBpbnN0ZWFkIG9mIGNvbXBsZXRlbHkgaWdub3JpbmcgdGhlIGRyYWdcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uVHJpbTogZnJhbWVEZWx0YSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGwgfSlcbiAgfVxuXG4gIGNoYW5nZVZpc2libGVGcmFtZVJhbmdlICh4bCwgeHIsIGZyYW1lSW5mbykge1xuICAgIGxldCBhYnNMID0gbnVsbFxuICAgIGxldCBhYnNSID0gbnVsbFxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNMID0geGxcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgYWJzUiA9IHhyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydCkge1xuICAgICAgY29uc3Qgb2Zmc2V0TCA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhclN0YXJ0ICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IG9mZnNldFIgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJFbmQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3QgZGlmZlggPSB4bCAtIHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0XG4gICAgICBhYnNMID0gb2Zmc2V0TCArIGRpZmZYXG4gICAgICBhYnNSID0gb2Zmc2V0UiArIGRpZmZYXG4gICAgfVxuXG4gICAgbGV0IGZMID0gKGFic0wgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzTCAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICBsZXQgZlIgPSAoYWJzUiAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNSICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIGxlZnQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmTCA8PSBmcmFtZUluZm8uZnJpMCkge1xuICAgICAgZkwgPSBmcmFtZUluZm8uZnJpMFxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAtICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC0gZkwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIHJpZ2h0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZlIgPj0gZnJhbWVJbmZvLmZyaU1heDIpIHtcbiAgICAgIGZMID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtmTCwgZlJdIH0pXG4gIH1cblxuICB1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSAoZGVsdGEpIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gKyBkZWx0YVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSArIGRlbHRhXG4gICAgaWYgKGwgPj0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbCwgcl0gfSlcbiAgICB9XG4gIH1cblxuICAvLyB3aWxsIGxlZnQtYWxpZ24gdGhlIGN1cnJlbnQgdGltZWxpbmUgd2luZG93IChtYWludGFpbmluZyB6b29tKVxuICB0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UgKGZyYW1lSW5mbykge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuICAgIHZhciBzcGFuID0gciAtIGxcbiAgICB2YXIgbmV3TCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lXG4gICAgdmFyIG5ld1IgPSBuZXdMICsgc3BhblxuXG4gICAgaWYgKG5ld1IgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICBuZXdMIC09IChuZXdSIC0gZnJhbWVJbmZvLmZyaU1heClcbiAgICAgIG5ld1IgPSBmcmFtZUluZm8uZnJpTWF4XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbmV3TCwgbmV3Ul0gfSlcbiAgfVxuXG4gIHVwZGF0ZVNjcnViYmVyUG9zaXRpb24gKGRlbHRhKSB7XG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICsgZGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDw9IDApIGN1cnJlbnRGcmFtZSA9IDBcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlKSB7XG4gICAgLy8gTm90ZSB0aGF0IGlmIHN0YXJ0VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBleGFtaW5lZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBwcmVzZW50IG9uZVxuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ2hvc3RJbnN0YW5jZScpLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm8gbmVlZCB0byAnZXhwcmVzc2lvblRvUk8nIGhlcmUgYmVjYXVzZSBpZiB3ZSBnb3QgYW4gZXhwcmVzc2lvbiwgdGhhdCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwcm92aWRlZCBpbiBpdHMgc2VyaWFsaXplZCBfX2Z1bmN0aW9uIGZvcm1cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZV0sICgpID0+IHt9KVxuXG4gICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5zcGxpdFNlZ21lbnQodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NwbGl0U2VnbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdqb2luS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRDdXJ2ZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50Q3VydmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50RW5kcG9pbnRzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSAob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMucmVuYW1lVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdyZW5hbWVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vdGU6IFdlIG1heSBuZWVkIHRvIHJlbWVtYmVyIHRvIHNlcmlhbGl6ZSBhIHRpbWVsaW5lIGRlc2NyaXB0b3IgaGVyZVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kdXBsaWNhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkdXBsaWNhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpIHtcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMsIGZyYW1lSW5mbylcbiAgICAvLyBUaGUgJ2tleWZyYW1lTW92ZXMnIGluZGljYXRlIGEgbGlzdCBvZiBjaGFuZ2VzIHdlIGtub3cgb2NjdXJyZWQuIE9ubHkgaWYgc29tZSBvY2N1cnJlZCBkbyB3ZSBib3RoZXIgdG8gdXBkYXRlIHRoZSBvdGhlciB2aWV3c1xuICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgfSlcblxuICAgICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSByZXR1cm4gdm9pZCAoMClcbiAgICBmb3IgKGxldCBtb3ZlbWVudEtleSBpbiB0aGlzLl9rZXlmcmFtZU1vdmVzKSB7XG4gICAgICBpZiAoIW1vdmVtZW50S2V5KSBjb250aW51ZVxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSkgY29udGludWVcbiAgICAgIGxldCB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH0gPSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuXG4gICAgICAvLyBNYWtlIHN1cmUgYW55IGZ1bmN0aW9ucyBnZXQgY29udmVydGVkIGludG8gdGhlaXIgc2VyaWFsIGZvcm0gYmVmb3JlIHBhc3Npbmcgb3ZlciB0aGUgd2lyZVxuICAgICAgbGV0IGtleWZyYW1lTW92ZXNGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oa2V5ZnJhbWVNb3ZlcylcblxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdtb3ZlS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3Zlc0ZvcldpcmUsIGZyYW1lSW5mb10sICgpID0+IHt9KVxuICAgICAgZGVsZXRlIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlUGxheWJhY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiB0cnVlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wbGF5KClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVoeWRyYXRlQnl0ZWNvZGUgKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKSB7XG4gICAgaWYgKHJlaWZpZWRCeXRlY29kZSkge1xuICAgICAgaWYgKHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgICBpZiAoIWlkKSByZXR1cm4gdm9pZCAoMClcbiAgICAgICAgICBub2RlLl9faXNTZWxlY3RlZCA9ICEhdGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0V4cGFuZGVkID0gISF0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzSGlkZGVuID0gISF0aGlzLnN0YXRlLmhpZGRlbk5vZGVzW2lkXVxuICAgICAgICB9KVxuICAgICAgICByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgbGV0IGZvdW5kID0gW11cbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCkgPT4ge1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShub2RlKVxuICAgICAgICB0aGlzLmV4cGFuZE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5zY3JvbGxUb05vZGUobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uVW5zZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBsZXQgZm91bmQgPSB0aGlzLmZpbmROb2Rlc0J5Q29tcG9uZW50SWQoY29tcG9uZW50SWQpXG4gICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgdGhpcy5kZXNlbGVjdE5vZGUobm9kZSlcbiAgICAgIHRoaXMuY29sbGFwc2VOb2RlKG5vZGUpXG4gICAgICB0aGlzLnNjcm9sbFRvVG9wKG5vZGUpXG4gICAgfSlcbiAgfVxuXG4gIGZpbmROb2Rlc0J5Q29tcG9uZW50SWQgKGNvbXBvbmVudElkKSB7XG4gICAgdmFyIGZvdW5kID0gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIG1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHN0YXJ0TXMsIHByb3BlcnR5TmFtZXMpIHtcbiAgICBsZXQgcmVsYXRlZEVsZW1lbnQgPSB0aGlzLmZpbmRFbGVtZW50SW5UZW1wbGF0ZShjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgbGV0IGVsZW1lbnROYW1lID0gcmVsYXRlZEVsZW1lbnQgJiYgcmVsYXRlZEVsZW1lbnQuZWxlbWVudE5hbWVcbiAgICBpZiAoIWVsZW1lbnROYW1lKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDb21wb25lbnQgJyArIGNvbXBvbmVudElkICsgJyBtaXNzaW5nIGVsZW1lbnQsIGFuZCB3aXRob3V0IGFuIGVsZW1lbnQgbmFtZSBJIGNhbm5vdCB1cGRhdGUgYSBwcm9wZXJ0eSB2YWx1ZScpXG4gICAgfVxuXG4gICAgdmFyIGFsbFJvd3MgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgYWxsUm93cy5mb3JFYWNoKChyb3dJbmZvKSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc1Byb3BlcnR5ICYmIHJvd0luZm8uY29tcG9uZW50SWQgPT09IGNvbXBvbmVudElkICYmIHByb3BlcnR5TmFtZXMuaW5kZXhPZihyb3dJbmZvLnByb3BlcnR5Lm5hbWUpICE9PSAtMSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgYWN0aXZhdGVkUm93czogbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93cyksXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICAqIGl0ZXJhdG9ycy92aXNpdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBmaW5kRWxlbWVudEluVGVtcGxhdGUgKGNvbXBvbmVudElkLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiB2b2lkICgwKVxuICAgIGxldCBmb3VuZFxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZCA9IG5vZGVcbiAgICB9KVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSAobG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZSwgcGFyZW50LCBpdGVyYXRlZSkge1xuICAgIGl0ZXJhdGVlKHRlbXBsYXRlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgaWYgKHRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRlbXBsYXRlLmNoaWxkcmVuW2ldXG4gICAgICAgIGlmICghY2hpbGQgfHwgdHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykgY29udGludWVcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKGxvY2F0b3IgKyAnLicgKyBpLCBpLCB0ZW1wbGF0ZS5jaGlsZHJlbiwgY2hpbGQsIHRlbXBsYXRlLCBpdGVyYXRlZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtYXBWaXNpYmxlRnJhbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgcmlnaHRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgY29uc3QgZnJhbWVNb2R1bHVzID0gZ2V0RnJhbWVNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGxldCBpdGVyYXRpb25JbmRleCA9IC0xXG4gICAgZm9yIChsZXQgaSA9IGxlZnRGcmFtZTsgaSA8IHJpZ2h0RnJhbWU7IGkrKykge1xuICAgICAgaXRlcmF0aW9uSW5kZXgrK1xuICAgICAgbGV0IGZyYW1lTnVtYmVyID0gaVxuICAgICAgbGV0IHBpeGVsT2Zmc2V0TGVmdCA9IGl0ZXJhdGlvbkluZGV4ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGlmIChwaXhlbE9mZnNldExlZnQgPD0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkge1xuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgZnJhbWVJbmZvLnB4cGYsIGZyYW1lTW9kdWx1cylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkge1xuICAgICAgICAgIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICBtYXBWaXNpYmxlVGltZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbXNNb2R1bHVzID0gZ2V0TWlsbGlzZWNvbmRNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgbGVmdE1zID0gZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHJpZ2h0TXMgPSBmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgdG90YWxNcyA9IHJpZ2h0TXMgLSBsZWZ0TXNcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IHJvdW5kVXAobGVmdE1zLCBtc01vZHVsdXMpXG4gICAgbGV0IG1zTWFya2VyVG1wID0gZmlyc3RNYXJrZXJcbiAgICBjb25zdCBtc01hcmtlcnMgPSBbXVxuICAgIHdoaWxlIChtc01hcmtlclRtcCA8PSByaWdodE1zKSB7XG4gICAgICBtc01hcmtlcnMucHVzaChtc01hcmtlclRtcClcbiAgICAgIG1zTWFya2VyVG1wICs9IG1zTW9kdWx1c1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zTWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zTWFya2VyID0gbXNNYXJrZXJzW2ldXG4gICAgICBsZXQgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc01hcmtlciwgZnJhbWVJbmZvLm1zcGYpXG4gICAgICBsZXQgbXNSZW1haW5kZXIgPSBNYXRoLmZsb29yKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmIC0gbXNNYXJrZXIpXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgdGhlIG1zUmVtYWluZGVyIGNhc2UgcmF0aGVyIHRoYW4gaWdub3JpbmcgaXRcbiAgICAgIGlmICghbXNSZW1haW5kZXIpIHtcbiAgICAgICAgbGV0IGZyYW1lT2Zmc2V0ID0gbmVhcmVzdEZyYW1lIC0gbGVmdEZyYW1lXG4gICAgICAgIGxldCBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKG1zTWFya2VyLCBweE9mZnNldCwgdG90YWxNcylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICAvKlxuICAgKiBnZXR0ZXJzL2NhbGN1bGF0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8qKlxuICAgIC8vIFNvcnJ5OiBUaGVzZSBzaG91bGQgaGF2ZSBiZWVuIGdpdmVuIGh1bWFuLXJlYWRhYmxlIG5hbWVzXG4gICAgPEdBVUdFPlxuICAgICAgICAgICAgPC0tLS1mcmlXLS0tPlxuICAgIGZyaTAgICAgZnJpQSAgICAgICAgZnJpQiAgICAgICAgZnJpTWF4ICAgICAgICAgICAgICAgICAgICAgICAgICBmcmlNYXgyXG4gICAgfCAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfFxuICAgICAgICAgICAgPC0tLS0tLS0tLS0tPiA8PCB0aW1lbGluZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgICB8XG4gICAgPC0tLS0tLS0+ICAgICAgICAgICB8IDw8IHByb3BlcnRpZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgIHB4QSAgICAgICAgIHB4QiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4ICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXgyXG4gICAgPFNDUk9MTEJBUj5cbiAgICB8LS0tLS0tLS0tLS0tLS0tLS0tLXwgPDwgc2Nyb2xsZXIgdmlld3BvcnRcbiAgICAgICAgKj09PT0qICAgICAgICAgICAgPDwgc2Nyb2xsYmFyXG4gICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gICAgfHNjMCAgICAgICAgICAgICAgICB8c2NMICYmIHNjUmF0aW9cbiAgICAgICAgfHNjQVxuICAgICAgICAgICAgIHxzY0JcbiAgKi9cbiAgZ2V0RnJhbWVJbmZvICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB7fVxuICAgIGZyYW1lSW5mby5mcHMgPSB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvLyBOdW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICBmcmFtZUluZm8ubXNwZiA9IDEwMDAgLyBmcmFtZUluZm8uZnBzIC8vIE1pbGxpc2Vjb25kcyBwZXIgZnJhbWVcbiAgICBmcmFtZUluZm8ubWF4bXMgPSBnZXRNYXhpbXVtTXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSlcbiAgICBmcmFtZUluZm8ubWF4ZiA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoZnJhbWVJbmZvLm1heG1zLCBmcmFtZUluZm8ubXNwZikgLy8gTWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmkwID0gMCAvLyBUaGUgbG93ZXN0IHBvc3NpYmxlIGZyYW1lIChhbHdheXMgMClcbiAgICBmcmFtZUluZm8uZnJpQSA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIDwgZnJhbWVJbmZvLmZyaTApID8gZnJhbWVJbmZvLmZyaTAgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC8vIFRoZSBsZWZ0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlNYXggPSAoZnJhbWVJbmZvLm1heGYgPCA2MCkgPyA2MCA6IGZyYW1lSW5mby5tYXhmIC8vIFRoZSBtYXhpbXVtIGZyYW1lIGFzIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaU1heDIgPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXggKiAxLjg4ICAvLyBFeHRlbmQgdGhlIG1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmUgKGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUga2V5ZnJhbWVzIGJleW9uZCB0aGUgcHJldmlvdXNseSBkZWZpbmVkIG1heClcbiAgICBmcmFtZUluZm8uZnJpQiA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdID4gZnJhbWVJbmZvLmZyaU1heDIpID8gZnJhbWVJbmZvLmZyaU1heDIgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC8vIFRoZSByaWdodG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpVyA9IE1hdGguYWJzKGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIC8vIFRoZSB3aWR0aCBvZiB0aGUgdmlzaWJsZSByYW5nZSBpbiBmcmFtZXNcbiAgICBmcmFtZUluZm8ucHhwZiA9IE1hdGguZmxvb3IodGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvIGZyYW1lSW5mby5mcmlXKSAvLyBOdW1iZXIgb2YgcGl4ZWxzIHBlciBmcmFtZSAocm91bmRlZClcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPCAxKSBmcmFtZUluZm8ucFNjcnhwZiA9IDFcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSBmcmFtZUluZm8ucHhwZiA9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGhcbiAgICBmcmFtZUluZm8ucHhBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weEIgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4TWF4MiA9IGZyYW1lSW5mby5mcmlNYXgyICogZnJhbWVJbmZvLnB4cGYgLy8gVGhlIHdpZHRoIGluIHBpeGVscyB0aGF0IHRoZSBlbnRpcmUgdGltZWxpbmUgKFwiZnJpTWF4MlwiKSBwYWRkaW5nIHdvdWxkIGVxdWFsXG4gICAgZnJhbWVJbmZvLm1zQSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIGxlZnRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLm1zQiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIHJpZ2h0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5zY0wgPSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLy8gVGhlIGxlbmd0aCBpbiBwaXhlbHMgb2YgdGhlIHNjcm9sbGVyIHZpZXdcbiAgICBmcmFtZUluZm8uc2NSYXRpbyA9IGZyYW1lSW5mby5weE1heDIgLyBmcmFtZUluZm8uc2NMIC8vIFRoZSByYXRpbyBvZiB0aGUgc2Nyb2xsZXIgdmlldyB0byB0aGUgdGltZWxpbmUgdmlldyAoc28gdGhlIHNjcm9sbGVyIHJlbmRlcnMgcHJvcG9ydGlvbmFsbHkgdG8gdGhlIHRpbWVsaW5lIGJlaW5nIGVkaXRlZClcbiAgICBmcmFtZUluZm8uc2NBID0gKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSBsZWZ0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIGZyYW1lSW5mby5zY0IgPSAoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIHJpZ2h0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIHJldHVybiBmcmFtZUluZm9cbiAgfVxuXG4gIC8vIFRPRE86IEZpeCB0aGlzL3RoZXNlIG1pc25vbWVyKHMpLiBJdCdzIG5vdCAnQVNDSUknXG4gIGdldEFzY2lpVHJlZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBsZXQgYXJjaHlGb3JtYXQgPSB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKVxuICAgICAgbGV0IGFyY2h5U3RyID0gYXJjaHkoYXJjaHlGb3JtYXQpXG4gICAgICByZXR1cm4gYXJjaHlTdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgZ2V0QXJjaHlGb3JtYXROb2RlcyAobGFiZWwsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsLFxuICAgICAgbm9kZXM6IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgY2hpbGQuY2hpbGRyZW4pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudFJvd3NEYXRhICgpIHtcbiAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzICoqbXVzdCoqIGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBjb21wb25lbnQgaGVhZGluZ3MvcHJvcGVydHkgcm93c1xuICAgIGxldCBhc2NpaVN5bWJvbHMgPSB0aGlzLmdldEFzY2lpVHJlZSgpLnNwbGl0KCdcXG4nKVxuICAgIGxldCBjb21wb25lbnRSb3dzID0gW11cbiAgICBsZXQgYWRkcmVzc2FibGVBcnJheXNDYWNoZSA9IHt9XG4gICAgbGV0IHZpc2l0b3JJdGVyYXRpb25zID0gMFxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSB8fCAhdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiBjb21wb25lbnRSb3dzXG5cbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncykgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudXBzZXJ0RnJvbU5vZGVXaXRoQ29tcG9uZW50Q2FjaGVkKG5vZGUsIHBhcmVudCwgdGhpcy5fY29tcG9uZW50LCB7fSlcblxuICAgICAgY29uc3QgaXNDb21wb25lbnQgPSBlbGVtZW50LmlzQ29tcG9uZW50KClcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5nZXROYW1lU3RyaW5nKClcbiAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gZWxlbWVudC5nZXRDb21wb25lbnRJZCgpXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmICh0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLkFMTE9XRURfVEFHTkFNRVNbZWxlbWVudE5hbWVdIHx8IGlzQ29tcG9uZW50KSkpIHsgLy8gT25seSB0aGUgdG9wLWxldmVsIGFuZCBhbnkgZXhwYW5kZWQgc3ViY29tcG9uZW50c1xuICAgICAgICBjb25zdCBhc2NpaUJyYW5jaCA9IGFzY2lpU3ltYm9sc1t2aXNpdG9ySXRlcmF0aW9uc10gLy8gV2FybmluZzogVGhlIGNvbXBvbmVudCBzdHJ1Y3R1cmUgbXVzdCBtYXRjaCB0aGF0IGdpdmVuIHRvIGNyZWF0ZSB0aGUgYXNjaWkgdHJlZVxuICAgICAgICBjb25zdCBoZWFkaW5nUm93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2gsIHByb3BlcnR5Um93czogW10sIGlzSGVhZGluZzogdHJ1ZSwgY29tcG9uZW50SWQ6IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXSB9XG4gICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChoZWFkaW5nUm93KVxuXG4gICAgICAgIGlmICghYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSA9IGVsZW1lbnQuZ2V0QWRkcmVzc2FibGVQcm9wZXJ0aWVzQXJyYXkobG9jYXRvciA9PT0gJzAnKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2x1c3RlckhlYWRpbmdzRm91bmQgPSB7fVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlHcm91cERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtpXVxuXG4gICAgICAgICAgbGV0IHByb3BlcnR5Um93XG5cbiAgICAgICAgICAgIC8vIFNvbWUgcHJvcGVydGllcyBnZXQgZ3JvdXBlZCBpbnNpZGUgdGhlaXIgb3duIGFjY29yZGlvbiBzaW5jZSB0aGV5IGhhdmUgbXVsdGlwbGUgc3ViY29tcG9uZW50cywgZS5nLiB0cmFuc2xhdGlvbi54LHkselxuICAgICAgICAgIGlmIChwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyKSB7XG4gICAgICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4XG4gICAgICAgICAgICBsZXQgY2x1c3RlcktleSA9IGAke2NvbXBvbmVudElkfV8ke2NsdXN0ZXJQcmVmaXh9YFxuICAgICAgICAgICAgbGV0IGlzQ2x1c3RlckhlYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjbHVzdGVyIHdpdGggdGhlIGN1cnJlbnQga2V5IGlzIGV4cGFuZGVkIHJlbmRlciBlYWNoIG9mIHRoZSByb3dzIGluZGl2aWR1YWxseVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2NsdXN0ZXJLZXldKSB7XG4gICAgICAgICAgICAgIGlmICghY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0pIHtcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHNpYmxpbmdzLFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICAgICAgY2x1c3RlcktleSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJNZW1iZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsXG4gICAgICAgICAgICAgICAgaXNQcm9wZXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgY2x1c3RlcjogY2x1c3RlclNldCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyTmFtZTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5uYW1lLFxuICAgICAgICAgICAgICAgIGlzQ2x1c3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLFxuICAgICAgICAgICAgICBpc1Byb3BlcnR5OiB0cnVlLFxuICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVGltZShmcmFtZUluZm8uZnJpMCkgKi9cbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaTAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgYWN0aXZlS2V5ZnJhbWVzOiBbXSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgaXNBY3RpdmUgPSB0cnVlXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWB9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgdG9wOiAtMyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICA6IChpc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgIH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYW5zaXRpb25Cb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG4gICAgY29uc3QgY3VydmUgPSBjdXJyLmN1cnZlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3Vyci5jdXJ2ZS5zbGljZSgxKVxuICAgIGNvbnN0IGJyZWFraW5nQm91bmRzID0gY3VydmUuaW5jbHVkZXMoJ0JhY2snKSB8fCBjdXJ2ZS5pbmNsdWRlcygnQm91bmNlJykgfHwgY3VydmUuaW5jbHVkZXMoJ0VsYXN0aWMnKVxuICAgIGNvbnN0IEN1cnZlU1ZHID0gQ1VSVkVTVkdTW2N1cnZlICsgJ1NWRyddXG4gICAgbGV0IGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGxldCBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSkpIHNlY29uZEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LCBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiB0cnVlLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbnRhaW5lcidcbiAgICAgICAgICBrZXk9e3VuaXF1ZUtleX1cbiAgICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtdHJhbnNpdGlvbicsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIGN1cnZlOiBjdXJyLmN1cnZlLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSBQYWxldHRlLkdSQVlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7b3B0aW9ucy5jb2xsYXBzZWQgJiZcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb2xsYXBzZWQtYmFja2Ryb3AnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkdSQVlcbiAgICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDEsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MylcbiAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45NjUpXG4gICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDIsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgb3ZlcmZsb3c6IGJyZWFraW5nQm91bmRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJ2ZVNWR1xuICAgICAgICAgICAgICBpZD17dW5pcXVlS2V5fVxuICAgICAgICAgICAgICBsZWZ0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgICByaWdodEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbnN0YW50Qm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgLy8gY29uc3QgYWN0aXZlSW5mbyA9IHNldEFjdGl2ZUNvbnRlbnRzKHByb3BlcnR5TmFtZSwgY3VyciwgbmV4dCwgZmFsc2UsIHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgfX1cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb25zdGFudC1ib2R5J1xuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS1zZWdtZW50JyxcbiAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAxNDUsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtMiwgbGVmdDogLTMgfX0+PFJpZ2h0Q2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMyxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=