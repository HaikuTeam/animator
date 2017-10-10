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
  selectedKeyframes: {},
  selectedSegments: {},
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
        if (_this3.tourClient) _this3.tourClient.next();
        _this3.changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName);
      });
      this.addEmitterListener(this.ctxmenu, 'deleteKeyframe', function (componentId, timelineName, propertyName, startMs) {
        _this3.executeBytecodeActionDeleteKeyframe({ componentId: { componentId: componentId, propertyName: propertyName, ms: startMs } }, timelineName);
      });
      this.addEmitterListener(this.ctxmenu, 'changeSegmentCurve', function (componentId, timelineName, propertyName, startMs, curveName) {
        _this3.changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName);
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
        // case 13: //enter
        case 8:
          // delete
          if (!_lodash2.default.isEmpty(this.state.selectedKeyframes)) {
            this.executeBytecodeActionDeleteKeyframe(this.state.selectedKeyframes, this.state.currentTimelineName);
          }
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
      var _this5 = this;

      _lodash2.default.each(this.state.selectedSegments, function (s) {
        if (s.hasCurve) {
          _actions2.default.splitSegment(_this5.state.reifiedBytecode, componentId, timelineName, s.elementName, s.propertyName, s.ms);
          (0, _clearInMemoryBytecodeCaches2.default)(_this5.state.reifiedBytecode);
          _this5._component._clearCaches();
          _this5.setState({
            reifiedBytecode: _this5.state.reifiedBytecode,
            serializedBytecode: _this5._component.getSerializedBytecode(),
            selectedKeyframes: {},
            selectedSegments: {}
          });
          _this5.props.websocket.action('splitSegment', [_this5.props.folder, [componentId], timelineName, s.elementName, s.propertyName, s.ms], function () {});
        }
      });
    }
  }, {
    key: 'executeBytecodeActionDeleteKeyframe',
    value: function executeBytecodeActionDeleteKeyframe(keyframes, timelineName) {
      var _this6 = this;

      _lodash2.default.each(keyframes, function (k) {
        _actions2.default.deleteKeyframe(_this6.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.ms);
        (0, _clearInMemoryBytecodeCaches2.default)(_this6.state.reifiedBytecode);
        _this6._component._clearCaches();
        _this6.setState({
          reifiedBytecode: _this6.state.reifiedBytecode,
          serializedBytecode: _this6._component.getSerializedBytecode(),
          keyframeDragStartPx: false,
          keyframeDragStartMs: false,
          transitionBodyDragging: false
        });
        _this6.props.websocket.action('deleteKeyframe', [_this6.props.folder, [k.componentId], timelineName, k.propertyName, k.ms], function () {});
      });
      this.setState({ selectedKeyframes: {} });
    }
  }, {
    key: 'changeMultipleSegmentCurves',
    value: function changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName) {
      var _this7 = this;

      _lodash2.default.each(this.state.selectedSegments, function (s) {
        if (!s.hasCurve) {
          _this7.executeBytecodeActionJoinKeyframes(componentId, timelineName, s.elementName, s.propertyName, s.ms, s.endMs, curveName);
        } else {
          _this7.executeBytecodeActionChangeSegmentCurve(componentId, timelineName, s.propertyName, s.ms, curveName);
        }
      });
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
        transitionBodyDragging: false,
        selectedKeyframes: {},
        selectedSegments: {}
      });
      // In the future, curve may be a function
      var curveForWire = (0, _expressionToRO2.default)(curveName);
      this.props.websocket.action('joinKeyframes', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, endMs, curveForWire], function () {});
    }
  }, {
    key: 'executeBytecodeActionChangeSegmentCurve',
    value: function executeBytecodeActionChangeSegmentCurve(componentId, timelineName, propertyName, startMs, curveName) {
      _actions2.default.changeSegmentCurve(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs, curveName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode(),
        selectedKeyframes: {},
        selectedSegments: {}
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
      var _this8 = this;

      /*
      We're going to use the call from what's being dragged, because that's sometimes a transition body
      rather than a simple keyframe.
       From there we're going to learn how far to move all other keyframes in selectedKeyframes: {}
       Concerns:
        When we need to stop one keyframe because it can't go any further, we need to stop the entire group drag.
       Notes:
        When a user drags a segment body it has the "body" handle. It
      */
      var selectedKeyframes = this.state.selectedKeyframes;
      var frameInfo = this.getFrameInfo();
      var changeMs = endMs - startMs;

      _lodash2.default.each(selectedKeyframes, function (k) {
        var adjustedMs = parseInt(k.ms) + changeMs;
        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this8.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.handle, // todo: take a second look at this one
        k.index, k.ms, adjustedMs, frameInfo);
        // Update our selected keyframes start time now that we've moved them
        // Note: This seems like there's probably a more clever way to make sure this gets
        // updated via the BytecodeActions.moveSegmentEndpoints perhaps.
        selectedKeyframes[k.componentId + '-' + k.propertyName + '-' + k.index].ms = Object.keys(keyframeMoves)[k.index];
        _this8.setState({ selectedKeyframes: selectedKeyframes });

        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
          (0, _clearInMemoryBytecodeCaches2.default)(_this8.state.reifiedBytecode);
          _this8._component._clearCaches();
          _this8.setState({
            reifiedBytecode: _this8.state.reifiedBytecode,
            serializedBytecode: _this8._component.getSerializedBytecode()
          });

          // It's very heavy to transmit a websocket message for every single movement while updating the ui,
          // so the values are accumulated and sent via a single batched update.
          if (!_this8._keyframeMoves) _this8._keyframeMoves = {};
          var movementKey = [componentId, timelineName, propertyName].join('-');
          _this8._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
          _this8.debouncedKeyframeMoveAction();
        }
      });
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
      var _this9 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this9._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this9._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this10 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this10.state.selectedNodes[id];
            node.__isExpanded = !!_this10.state.expandedNodes[id];
            node.__isHidden = !!_this10.state.hiddenNodes[id];
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
      var _this11 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this11.selectNode(node);
          _this11.expandNode(node);
          _this11.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this12 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this12.deselectNode(node);
        _this12.collapseNode(node);
        _this12.scrollToTop(node);
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
      var _this13 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this13.activateRow(rowInfo);
        } else {
          _this13.deactivateRow(rowInfo);
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
      var _this14 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this14.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this15 = this;

      // The number of lines **must** correspond to the number of component headings/property rows
      var asciiSymbols = this.getAsciiTree().split('\n');
      var componentRows = [];
      var addressableArraysCache = {};
      var visitorIterations = 0;

      if (!this.state.reifiedBytecode || !this.state.reifiedBytecode.template) return componentRows;

      this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent, locator, index, siblings) {
        var element = _this15._component._elements.upsertFromNodeWithComponentCached(node, parent, _this15._component, {});

        var isComponent = element.isComponent();
        var elementName = element.getNameString();
        var componentId = element.getComponentId();

        if (!parent || parent.__isExpanded && (_this15._component._elements.ALLOWED_TAGNAMES[elementName] || isComponent)) {
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
              if (_this15.state.expandedPropertyClusters[clusterKey]) {
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
      var _this16 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this16.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this16.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
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
      var _this17 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1488
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
            _this17.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this17.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this17.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this17.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this17._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this17.props.websocket.action('setTimelineName', [_this17.props.folder, currentTimelineName], function () {});
            _this17.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this17.getFrameInfo();
            _this17._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this17.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this17.getFrameInfo();
            _this17.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this17._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this17.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this17.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1493
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
      var _this18 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1561
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this18.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this18.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this18.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this19 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this19.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this19.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this19.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this19.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this19.state.keyframeDragStartMs + msChange);
              _this19.executeBytecodeActionMoveSegmentEndpoints(componentId, _this19.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this19.state.selectedKeyframes;
            var selectedSegments = _this19.state.selectedSegments;
            if (!e.shiftKey) {
              selectedKeyframes = {};
              selectedSegments = {};
            }

            selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              index: curr.index,
              ms: curr.ms,
              handle: handle,
              componentId: componentId,
              propertyName: propertyName
            };
            _this19.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1584
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
            _this19.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this19.state.currentTimelineName,
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
            lineNumber: 1628
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderSoloKeyframe',
    value: function renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var isActive = false;
      if (this.state.selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] != undefined) isActive = true;

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
            lineNumber: 1674
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
              lineNumber: 1686
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1694
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this20 = this;

      var uniqueKey = componentId + '-' + propertyName + '-' + index + '-' + curr.ms;
      var curve = curr.curve.charAt(0).toUpperCase() + curr.curve.slice(1);
      var breakingBounds = curve.includes('Back') || curve.includes('Bounce') || curve.includes('Elastic');
      var CurveSVG = CURVESVGS[curve + 'SVG'];
      var firstKeyframeActive = false;
      var secondKeyframeActive = false;
      if (this.state.selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] != undefined) firstKeyframeActive = true;
      if (this.state.selectedKeyframes[componentId + '-' + propertyName + '-' + (curr.index + 1)] != undefined) secondKeyframeActive = true;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            if (options.collapsed) return false;
            _this20.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this20.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this20.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this20.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this20.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this20.state.keyframeDragStartMs + msChange);
            _this20.executeBytecodeActionMoveSegmentEndpoints(componentId, _this20.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this20.state.selectedKeyframes;
            var selectedSegments = _this20.state.selectedSegments;
            if (!e.shiftKey) {
              selectedKeyframes = {};
              selectedSegments = {};
            }
            selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              index: curr.index,
              ms: curr.ms,
              handle: 'middle'
            };
            selectedKeyframes[componentId + '-' + propertyName + '-' + (curr.index + 1)] = {
              id: componentId + '-' + propertyName + '-' + (curr.index + 1),
              componentId: componentId,
              propertyName: propertyName,
              elementName: elementName,
              index: next.index,
              ms: next.ms,
              handle: 'middle'
            };
            selectedSegments[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              ms: curr.ms,
              hasCurve: true
            };
            _this20.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1718
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this20[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this20.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this20.state.currentTimelineName,
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
              if (_this20[uniqueKey]) _this20[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this20[uniqueKey]) _this20[uniqueKey].style.color = 'transparent';
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
              lineNumber: 1777
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
              lineNumber: 1828
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
              lineNumber: 1844
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
                lineNumber: 1861
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
                  lineNumber: 1871
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1879
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
                lineNumber: 1889
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1898
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
                lineNumber: 1916
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
                  lineNumber: 1927
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1937
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
      var _this21 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;
      var isSelected = false;
      if (this.state.selectedSegments[componentId + '-' + propertyName + '-' + curr.index] != undefined) isSelected = true;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this21[uniqueKey] = domElement;
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
            _this21.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this21.state.currentTimelineName,
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
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedSegments = _this21.state.selectedSegments;
            var selectedKeyframes = _this21.state.selectedKeyframes;
            if (!e.shiftKey) {
              selectedSegments = {};
              selectedKeyframes = {};
            } else {
              selectedSegments[componentId + '-' + propertyName + '-' + curr.index] = {
                id: componentId + '-' + propertyName + '-' + curr.index,
                componentId: componentId,
                elementName: elementName,
                propertyName: propertyName,
                ms: curr.ms,
                endMs: next.ms,
                hasCurve: false
              };
            }
            _this21.setState({ selectedSegments: selectedSegments, selectedKeyframes: selectedKeyframes });
          },
          style: {
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            height: this.state.rowHeight
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1959
          },
          __self: this
        },
        _react2.default.createElement('span', { style: {
            height: 3,
            top: 12,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: options.collapsedElement ? (0, _color2.default)(_DefaultPalette2.default.GRAY).fade(0.23) : isSelected ? (0, _color2.default)(_DefaultPalette2.default.LIGHTEST_PINK).fade(.5) : _DefaultPalette2.default.DARKER_GRAY
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2018
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this22 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this22.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this22.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this22.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 2063
            },
            __self: _this22
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this23 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2079
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2080
                  },
                  __self: _this23
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
                  lineNumber: 2089
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2090
                  },
                  __self: _this23
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
                  lineNumber: 2095
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2096
                  },
                  __self: _this23
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
      var _this24 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 2107
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2109
            },
            __self: _this24
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this25 = this;

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
            _this25.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this25.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this25.setState({ scrubberDragStart: null, frameBaseline: _this25.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this25.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 2122
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2141
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
                lineNumber: 2142
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
                lineNumber: 2155
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
                lineNumber: 2165
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
              lineNumber: 2177
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this26 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this26.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this26.state.maxFrame ? _this26.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this26.state.addInterval);
              _this26.setState({ maxFrame: currentMax + _this26.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this26.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this26.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2200
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2219
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
                lineNumber: 2220
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
                lineNumber: 2233
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2247
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this27 = this;

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
            lineNumber: 2254
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
              lineNumber: 2267
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
                lineNumber: 2276
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2288
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2290
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
                    lineNumber: 2291
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
                lineNumber: 2295
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2310
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2312
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
                    lineNumber: 2313
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
                  lineNumber: 2316
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
                lineNumber: 2318
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2335
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2336
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2337
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2339
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
                  lineNumber: 2341
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2342
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2343
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2344
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
              if (_this27.state.scrubberDragStart === null || _this27.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this27.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this27._component.getCurrentTimeline().seek(newFrame);
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
              lineNumber: 2351
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
      var _this28 = this;

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
            lineNumber: 2388
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this28.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this28.state.visibleFrameRange[0],
                scrollbarEnd: _this28.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this28.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this28.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this28.state.scrollerLeftDragStart && !_this28.state.scrollerRightDragStart) {
                _this28.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2398
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
                lineNumber: 2422
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this28.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this28.state.visibleFrameRange[0], scrollbarEnd: _this28.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this28.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this28.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2432
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2437
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this28.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this28.state.visibleFrameRange[0], scrollbarEnd: _this28.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this28.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this28.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2439
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2444
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
              lineNumber: 2448
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
              lineNumber: 2449
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
            lineNumber: 2464
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
            lineNumber: 2491
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2494
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
              lineNumber: 2495
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2506
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2507
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
              lineNumber: 2509
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
      var _this29 = this;

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
              _this29.collapseNode(item.node, componentId);
              _this29.props.websocket.action('unselectElement', [_this29.props.folder, componentId], function () {});
            } else {
              _this29.expandNode(item.node, componentId);
              _this29.props.websocket.action('selectElement', [_this29.props.folder, componentId], function () {});
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
            lineNumber: 2524
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
            lineNumber: 2551
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
              lineNumber: 2559
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2567
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
                  lineNumber: 2568
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2573
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2573
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2574
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2574
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
              lineNumber: 2580
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
      var _this30 = this;

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
            lineNumber: 2595
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this30.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this30.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2605
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
                lineNumber: 2617
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2627
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2627
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
              lineNumber: 2632
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
                lineNumber: 2641
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
                  lineNumber: 2654
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
              lineNumber: 2668
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
              lineNumber: 2677
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
              _this30.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this30.state.currentTimelineName,
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
              if (!_this30.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this30.setState({ activatedRows: activatedRows });
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
              lineNumber: 2692
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
      var _this31 = this;

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
            var expandedPropertyClusters = _lodash2.default.clone(_this31.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this31.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this31.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this31.setState({
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
            lineNumber: 2743
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2774
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
              lineNumber: 2776
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
                lineNumber: 2785
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2792
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2792
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
                lineNumber: 2794
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
                  lineNumber: 2807
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
              lineNumber: 2816
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
              lineNumber: 2825
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
              lineNumber: 2839
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this31.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this31.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this31.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
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
      var _this32 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2870
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
            lineNumber: 2873
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this32.renderClusterRow(item, index, _this32.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this32.renderPropertyRow(item, index, _this32.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this32.renderComponentHeadingRow(item, index, _this32.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this33 = this;

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
            lineNumber: 2895
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
            lineNumber: 2911
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
            },
            onMouseDown: function onMouseDown() {
              _this33.setState({ selectedKeyframes: {}, selectedSegments: {} });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2922
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

            _this33.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this33.state.inputFocused), _this33.state.currentTimelineName, _this33.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this33.state.inputFocused), _this33.getCurrentTimelineTime(_this33.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this33.setState({
              inputFocused: _this33.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this33.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this33.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2942
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwic2VsZWN0ZWRLZXlmcmFtZXMiLCJzZWxlY3RlZFNlZ21lbnRzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiY2hhbmdlTXVsdGlwbGVTZWdtZW50Q3VydmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUiLCJtcyIsImhhbmRsZSIsImtleWZyYW1lSW5kZXgiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyIsIl90aW1lbGluZXMiLCJ1cGRhdGVUaW1lIiwiZnJpTWF4IiwiZ2V0Q3VycmVudFRpbWVsaW5lIiwic2Vla0FuZFBhdXNlIiwiZnJpQiIsImZyaUEiLCJ0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UiLCJzZWxlY3RvciIsIndlYnZpZXciLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiZXJyb3IiLCJuYXRpdmVFdmVudCIsInJlZnMiLCJleHByZXNzaW9uSW5wdXQiLCJ3aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQiLCJrZXlDb2RlIiwidG9nZ2xlUGxheWJhY2siLCJ3aGljaCIsInVwZGF0ZVNjcnViYmVyUG9zaXRpb24iLCJ1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSIsImlzRW1wdHkiLCJ1cGRhdGVLZXlib2FyZFN0YXRlIiwiZXZlbnRFbWl0dGVyIiwiZXZlbnROYW1lIiwiZXZlbnRIYW5kbGVyIiwiX19pc1NlbGVjdGVkIiwiY2xvbmUiLCJhdHRyaWJ1dGVzIiwidHJlZVVwZGF0ZSIsIkRhdGUiLCJub3ciLCJzY3JvbGx2aWV3Iiwic2Nyb2xsVG9wIiwicm93c0RhdGEiLCJjb21wb25lbnRSb3dzRGF0YSIsImZvdW5kSW5kZXgiLCJpbmRleENvdW50ZXIiLCJyb3dJbmZvIiwiaW5kZXgiLCJpc0hlYWRpbmciLCJpc1Byb3BlcnR5IiwiX19pc0V4cGFuZGVkIiwiZG9tTm9kZSIsImN1cnRvcCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFRvcCIsInBhcmVudCIsImV4cGFuZE5vZGUiLCJyb3ciLCJwcm9wZXJ0eSIsIml0ZW0iLCJkcmFnWCIsImRyYWdTdGFydCIsInNjcnViYmVyRHJhZ1N0YXJ0IiwiZnJhbWVCYXNlbGluZSIsImRyYWdEZWx0YSIsImZyYW1lRGVsdGEiLCJweHBmIiwic2VlayIsImR1cmF0aW9uRHJhZ1N0YXJ0IiwiYWRkSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImN1cnJlbnRNYXgiLCJmcmlNYXgyIiwiZHJhZ0lzQWRkaW5nIiwiY2xlYXJJbnRlcnZhbCIsInhsIiwieHIiLCJhYnNMIiwiYWJzUiIsInNjcm9sbGVyTGVmdERyYWdTdGFydCIsInNjcm9sbGVyUmlnaHREcmFnU3RhcnQiLCJzY3JvbGxlckJvZHlEcmFnU3RhcnQiLCJvZmZzZXRMIiwic2Nyb2xsYmFyU3RhcnQiLCJzY1JhdGlvIiwib2Zmc2V0UiIsInNjcm9sbGJhckVuZCIsImRpZmZYIiwiZkwiLCJmUiIsImZyaTAiLCJkZWx0YSIsImwiLCJyIiwic3BhbiIsIm5ld0wiLCJuZXdSIiwic3RhcnRWYWx1ZSIsIm1heWJlQ3VydmUiLCJlbmRWYWx1ZSIsImNyZWF0ZUtleWZyYW1lIiwiZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUiLCJnZXQiLCJhY3Rpb24iLCJlYWNoIiwicyIsImhhc0N1cnZlIiwic3BsaXRTZWdtZW50Iiwia2V5ZnJhbWVzIiwiayIsImRlbGV0ZUtleWZyYW1lIiwia2V5ZnJhbWVEcmFnU3RhcnRQeCIsImtleWZyYW1lRHJhZ1N0YXJ0TXMiLCJ0cmFuc2l0aW9uQm9keURyYWdnaW5nIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSIsImpvaW5LZXlmcmFtZXMiLCJjdXJ2ZUZvcldpcmUiLCJjaGFuZ2VTZWdtZW50Q3VydmUiLCJvbGRTdGFydE1zIiwib2xkRW5kTXMiLCJuZXdTdGFydE1zIiwibmV3RW5kTXMiLCJjaGFuZ2VTZWdtZW50RW5kcG9pbnRzIiwib2xkVGltZWxpbmVOYW1lIiwibmV3VGltZWxpbmVOYW1lIiwicmVuYW1lVGltZWxpbmUiLCJjcmVhdGVUaW1lbGluZSIsImR1cGxpY2F0ZVRpbWVsaW5lIiwiZGVsZXRlVGltZWxpbmUiLCJjaGFuZ2VNcyIsImFkanVzdGVkTXMiLCJwYXJzZUludCIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIl9rZXlmcmFtZU1vdmVzIiwibW92ZW1lbnRLZXkiLCJqb2luIiwia2V5ZnJhbWVNb3Zlc0ZvcldpcmUiLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiX2VsZW1lbnRzIiwidXBzZXJ0RnJvbU5vZGVXaXRoQ29tcG9uZW50Q2FjaGVkIiwiaXNDb21wb25lbnQiLCJnZXROYW1lU3RyaW5nIiwiZ2V0Q29tcG9uZW50SWQiLCJBTExPV0VEX1RBR05BTUVTIiwiYXNjaWlCcmFuY2giLCJoZWFkaW5nUm93IiwicHJvcGVydHlSb3dzIiwiZG9Hb0RlZXAiLCJ2YWx1ZXMiLCJnZXRBZGRyZXNzYWJsZVByb3BlcnRpZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsImZyYW1lIiwidmFsdWUiLCJjdXJ2ZSIsInB4T2Zmc2V0TGVmdCIsInB4T2Zmc2V0UmlnaHQiLCJzZWdtZW50T3V0cHV0IiwicHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlPdXRwdXRzIiwibWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsImNvbmNhdCIsInBvc2l0aW9uIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJ0aW1lbGluZXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSIsInNldFRpbWVsaW5lTmFtZSIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsImN0eE1lbnVFdmVudCIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJpc1NlbGVjdGVkIiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7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K0JBQXFCLDZCQUFDK2pCLE1BQUQsRUFBU0MsT0FBVCxFQUFxQjtBQUN4QyxnQkFBSTNXLE9BQU8sUUFBS3BLLEtBQUwsQ0FBV2pELGFBQXRCO0FBQ0EsZ0JBQUkySCxPQUFPLCtCQUFhMEYsSUFBYixFQUFtQjBXLE1BQW5CLENBQVg7QUFDQSxnQkFBSXBjLElBQUosRUFBVTtBQUNSLHNCQUFLOUMsUUFBTCxDQUFjO0FBQ1o1RSw4QkFBZStqQixPQUFELEdBQVlyYyxJQUFaLEdBQW1CLElBRHJCO0FBRVozSCwrQkFBZTJIO0FBRkgsZUFBZDtBQUlEO0FBQ0YsV0FsQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBL0NGLE9BREY7QUFxRkQ7Ozs7RUFwdkZvQixnQkFBTXNjLFM7O2tCQXV2RmRsaEIsUSIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFyY2h5IGZyb20gJ2FyY2h5J1xuaW1wb3J0IHsgRHJhZ2dhYmxlQ29yZSB9IGZyb20gJ3JlYWN0LWRyYWdnYWJsZSdcblxuaW1wb3J0IGV4cHJlc3Npb25Ub1JPIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlZmxlY3Rpb24vZXhwcmVzc2lvblRvUk8nXG5cbmltcG9ydCBUaW1lbGluZVByb3BlcnR5IGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9UaW1lbGluZVByb3BlcnR5J1xuaW1wb3J0IEJ5dGVjb2RlQWN0aW9ucyBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvYWN0aW9ucydcbmltcG9ydCBBY3RpdmVDb21wb25lbnQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvbW9kZWwvQWN0aXZlQ29tcG9uZW50J1xuXG5pbXBvcnQge1xuICBuZXh0UHJvcEl0ZW0sXG4gIGdldEl0ZW1Db21wb25lbnRJZCxcbiAgZ2V0SXRlbVByb3BlcnR5TmFtZVxufSBmcm9tICcuL2hlbHBlcnMvSXRlbUhlbHBlcnMnXG5cbmltcG9ydCBnZXRNYXhpbXVtTXMgZnJvbSAnLi9oZWxwZXJzL2dldE1heGltdW1NcydcbmltcG9ydCBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lIGZyb20gJy4vaGVscGVycy9taWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lJ1xuaW1wb3J0IGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyBmcm9tICcuL2hlbHBlcnMvY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzJ1xuaW1wb3J0IGh1bWFuaXplUHJvcGVydHlOYW1lIGZyb20gJy4vaGVscGVycy9odW1hbml6ZVByb3BlcnR5TmFtZSdcbmltcG9ydCBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvciBmcm9tICcuL2hlbHBlcnMvZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3InXG5pbXBvcnQgZ2V0TWlsbGlzZWNvbmRNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRNaWxsaXNlY29uZE1vZHVsdXMnXG5pbXBvcnQgZ2V0RnJhbWVNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRGcmFtZU1vZHVsdXMnXG5pbXBvcnQgZm9ybWF0U2Vjb25kcyBmcm9tICcuL2hlbHBlcnMvZm9ybWF0U2Vjb25kcydcbmltcG9ydCByb3VuZFVwIGZyb20gJy4vaGVscGVycy9yb3VuZFVwJ1xuXG5pbXBvcnQgdHJ1bmNhdGUgZnJvbSAnLi9oZWxwZXJzL3RydW5jYXRlJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9EZWZhdWx0UGFsZXR0ZSdcbmltcG9ydCBLZXlmcmFtZVNWRyBmcm9tICcuL2ljb25zL0tleWZyYW1lU1ZHJ1xuXG5pbXBvcnQge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59IGZyb20gJy4vaWNvbnMvQ3VydmVTVkdTJ1xuXG5pbXBvcnQgRG93bkNhcnJvdFNWRyBmcm9tICcuL2ljb25zL0Rvd25DYXJyb3RTVkcnXG5pbXBvcnQgUmlnaHRDYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9SaWdodENhcnJvdFNWRydcbmltcG9ydCBDb250cm9sc0FyZWEgZnJvbSAnLi9Db250cm9sc0FyZWEnXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi9Db250ZXh0TWVudSdcbmltcG9ydCBFeHByZXNzaW9uSW5wdXQgZnJvbSAnLi9FeHByZXNzaW9uSW5wdXQnXG5pbXBvcnQgQ2x1c3RlcklucHV0RmllbGQgZnJvbSAnLi9DbHVzdGVySW5wdXRGaWVsZCdcbmltcG9ydCBQcm9wZXJ0eUlucHV0RmllbGQgZnJvbSAnLi9Qcm9wZXJ0eUlucHV0RmllbGQnXG5cbi8qIHotaW5kZXggZ3VpZGVcbiAga2V5ZnJhbWU6IDEwMDJcbiAgdHJhbnNpdGlvbiBib2R5OiAxMDAyXG4gIGtleWZyYW1lIGRyYWdnZXJzOiAxMDAzXG4gIGlucHV0czogMTAwNCwgKDEwMDUgYWN0aXZlKVxuICB0cmltLWFyZWEgMTAwNlxuICBzY3J1YmJlcjogMTAwNlxuICBib3R0b20gY29udHJvbHM6IDEwMDAwIDwtIGthLWJvb20hXG4qL1xuXG52YXIgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG52YXIgd2ViRnJhbWUgPSBlbGVjdHJvbi53ZWJGcmFtZVxuaWYgKHdlYkZyYW1lKSB7XG4gIGlmICh3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cygxLCAxKVxuICBpZiAod2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMoMCwgMClcbn1cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIHByb3BlcnRpZXNXaWR0aDogMzAwLFxuICB0aW1lbGluZXNXaWR0aDogODcwLFxuICByb3dIZWlnaHQ6IDI1LFxuICBpbnB1dENlbGxXaWR0aDogNzUsXG4gIG1ldGVySGVpZ2h0OiAyNSxcbiAgY29udHJvbHNIZWlnaHQ6IDQyLFxuICB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIDYwXSxcbiAgY3VycmVudEZyYW1lOiAwLFxuICBtYXhGcmFtZTogbnVsbCxcbiAgZHVyYXRpb25UcmltOiAwLFxuICBmcmFtZXNQZXJTZWNvbmQ6IDYwLFxuICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnLCAvLyBvciAnZnJhbWVzJ1xuICBjdXJyZW50VGltZWxpbmVOYW1lOiAnRGVmYXVsdCcsXG4gIGlzUGxheWVyUGxheWluZzogZmFsc2UsXG4gIHBsYXllclBsYXliYWNrU3BlZWQ6IDEuMCxcbiAgaXNTaGlmdEtleURvd246IGZhbHNlLFxuICBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb250cm9sS2V5RG93bjogZmFsc2UsXG4gIGlzQWx0S2V5RG93bjogZmFsc2UsXG4gIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZSxcbiAgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlLFxuICBzZWxlY3RlZE5vZGVzOiB7fSxcbiAgZXhwYW5kZWROb2Rlczoge30sXG4gIGFjdGl2YXRlZFJvd3M6IHt9LFxuICBoaWRkZW5Ob2Rlczoge30sXG4gIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzOiB7fSxcbiAgc2VsZWN0ZWRLZXlmcmFtZXM6IHt9LFxuICBzZWxlY3RlZFNlZ21lbnRzOiB7fSxcbiAgcmVpZmllZEJ5dGVjb2RlOiBudWxsLFxuICBzZXJpYWxpemVkQnl0ZWNvZGU6IG51bGxcbn1cblxuY29uc3QgQ1VSVkVTVkdTID0ge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIGlmICh0aGlzLnRvdXJDbGllbnQpIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuY2hhbmdlTXVsdGlwbGVTZWdtZW50Q3VydmVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKHtjb21wb25lbnRJZDoge2NvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUsIG1zOiBzdGFydE1zfX0sIHRpbWVsaW5lTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VNdWx0aXBsZVNlZ21lbnRDdXJ2ZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSA4OiAvLyBkZWxldGVcbiAgICAgICAgaWYgKCFsb2Rhc2guaXNFbXB0eSh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzKSkge1xuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lcywgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgICAgICB9XG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBsb2Rhc2guZWFjaCh0aGlzLnN0YXRlLnNlbGVjdGVkU2VnbWVudHMsIChzKSA9PiB7XG4gICAgICBpZiAocy5oYXNDdXJ2ZSkge1xuICAgICAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzLmVsZW1lbnROYW1lLCBzLnByb3BlcnR5TmFtZSwgcy5tcylcbiAgICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gICAgICAgICAgc2VsZWN0ZWRTZWdtZW50czoge31cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcy5lbGVtZW50TmFtZSwgcy5wcm9wZXJ0eU5hbWUsIHMubXNdLCAoKSA9PiB7fSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGtleWZyYW1lcywgdGltZWxpbmVOYW1lKSB7XG4gICAgbG9kYXNoLmVhY2goa2V5ZnJhbWVzLCAoaykgPT4ge1xuICAgICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBrLmNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGsucHJvcGVydHlOYW1lLCBrLm1zKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICAgIH0pXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbay5jb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgay5wcm9wZXJ0eU5hbWUsIGsubXNdLCAoKSA9PiB7fSlcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fX0pXG4gIH1cblxuICBjaGFuZ2VNdWx0aXBsZVNlZ21lbnRDdXJ2ZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgbG9kYXNoLmVhY2godGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzLCAocykgPT4ge1xuICAgICAgaWYgKCFzLmhhc0N1cnZlKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzLmVsZW1lbnROYW1lLCBzLnByb3BlcnR5TmFtZSwgcy5tcywgcy5lbmRNcywgY3VydmVOYW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcy5wcm9wZXJ0eU5hbWUsIHMubXMsIGN1cnZlTmFtZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXMoXG4gICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIGNvbXBvbmVudElkLFxuICAgICAgdGltZWxpbmVOYW1lLFxuICAgICAgZWxlbWVudE5hbWUsXG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICBzdGFydE1zLFxuICAgICAgZW5kTXMsXG4gICAgICBjdXJ2ZU5hbWVcbiAgICApXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc2VsZWN0ZWRLZXlmcmFtZXM6IHt9LFxuICAgICAgc2VsZWN0ZWRTZWdtZW50czoge31cbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUoXG4gICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIGNvbXBvbmVudElkLFxuICAgICAgdGltZWxpbmVOYW1lLFxuICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgc3RhcnRNcyxcbiAgICAgIGN1cnZlTmFtZVxuICAgIClcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gICAgICBzZWxlY3RlZFNlZ21lbnRzOiB7fVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgLypcbiAgICBXZSdyZSBnb2luZyB0byB1c2UgdGhlIGNhbGwgZnJvbSB3aGF0J3MgYmVpbmcgZHJhZ2dlZCwgYmVjYXVzZSB0aGF0J3Mgc29tZXRpbWVzIGEgdHJhbnNpdGlvbiBib2R5XG4gICAgcmF0aGVyIHRoYW4gYSBzaW1wbGUga2V5ZnJhbWUuXG5cbiAgICBGcm9tIHRoZXJlIHdlJ3JlIGdvaW5nIHRvIGxlYXJuIGhvdyBmYXIgdG8gbW92ZSBhbGwgb3RoZXIga2V5ZnJhbWVzIGluIHNlbGVjdGVkS2V5ZnJhbWVzOiB7fVxuXG4gICAgQ29uY2VybnM6XG4gICAgICBXaGVuIHdlIG5lZWQgdG8gc3RvcCBvbmUga2V5ZnJhbWUgYmVjYXVzZSBpdCBjYW4ndCBnbyBhbnkgZnVydGhlciwgd2UgbmVlZCB0byBzdG9wIHRoZSBlbnRpcmUgZ3JvdXAgZHJhZy5cblxuICAgIE5vdGVzOlxuICAgICAgV2hlbiBhIHVzZXIgZHJhZ3MgYSBzZWdtZW50IGJvZHkgaXQgaGFzIHRoZSBcImJvZHlcIiBoYW5kbGUuIEl0XG4gICAgKi9cbiAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGNoYW5nZU1zID0gZW5kTXMgLSBzdGFydE1zXG5cbiAgICBsb2Rhc2guZWFjaChzZWxlY3RlZEtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIGNvbnN0IGFkanVzdGVkTXMgPSBwYXJzZUludChrLm1zKSArIGNoYW5nZU1zXG4gICAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyhcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIGsuY29tcG9uZW50SWQsXG4gICAgICAgIHRpbWVsaW5lTmFtZSxcbiAgICAgICAgay5wcm9wZXJ0eU5hbWUsXG4gICAgICAgIGsuaGFuZGxlLCAvLyB0b2RvOiB0YWtlIGEgc2Vjb25kIGxvb2sgYXQgdGhpcyBvbmVcbiAgICAgICAgay5pbmRleCxcbiAgICAgICAgay5tcyxcbiAgICAgICAgYWRqdXN0ZWRNcyxcbiAgICAgICAgZnJhbWVJbmZvXG4gICAgICApXG4gICAgICAvLyBVcGRhdGUgb3VyIHNlbGVjdGVkIGtleWZyYW1lcyBzdGFydCB0aW1lIG5vdyB0aGF0IHdlJ3ZlIG1vdmVkIHRoZW1cbiAgICAgIC8vIE5vdGU6IFRoaXMgc2VlbXMgbGlrZSB0aGVyZSdzIHByb2JhYmx5IGEgbW9yZSBjbGV2ZXIgd2F5IHRvIG1ha2Ugc3VyZSB0aGlzIGdldHNcbiAgICAgIC8vIHVwZGF0ZWQgdmlhIHRoZSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHMgcGVyaGFwcy5cbiAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2suY29tcG9uZW50SWQgKyAnLScgKyBrLnByb3BlcnR5TmFtZSArICctJyArIGsuaW5kZXhdLm1zID0gT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3Zlcylbay5pbmRleF1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzfSlcblxuICAgICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVwc2VydEZyb21Ob2RlV2l0aENvbXBvbmVudENhY2hlZChub2RlLCBwYXJlbnQsIHRoaXMuX2NvbXBvbmVudCwge30pXG5cbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gZWxlbWVudC5pc0NvbXBvbmVudCgpXG4gICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQuZ2V0TmFtZVN0cmluZygpXG4gICAgICBjb25zdCBjb21wb25lbnRJZCA9IGVsZW1lbnQuZ2V0Q29tcG9uZW50SWQoKVxuXG4gICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9faXNFeHBhbmRlZCAmJiAodGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5BTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgZG9Hb0RlZXAgPSBsb2NhdG9yLmxlbmd0aCA9PT0gMyAvLyAwLjAsIDAuMSwgZXRjXG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBPYmplY3QudmFsdWVzKGVsZW1lbnQuZ2V0QWRkcmVzc2FibGVQcm9wZXJ0aWVzKGRvR29EZWVwKSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcsXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLFxuICAgICAgICAgICAgICAgIGlzUHJvcGVydHk6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIGNsdXN0ZXIsIHNoaWZ0aW5nIHRoZSBpbmRleCBmb3J3YXJkIHNvIHdlIGRvbid0IHJlLXJlbmRlciB0aGUgaW5kaXZpZHVhbHMgb24gdGhlIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgIGxldCBjbHVzdGVyU2V0ID0gW3Byb3BlcnR5R3JvdXBEZXNjcmlwdG9yXVxuICAgICAgICAgICAgICAgIC8vIExvb2sgYWhlYWQgYnkgYSBmZXcgc3RlcHMgaW4gdGhlIGFycmF5IGFuZCBzZWUgaWYgdGhlIG5leHQgZWxlbWVudCBpcyBhIG1lbWJlciBvZiB0aGUgY3VycmVudCBjbHVzdGVyXG4gICAgICAgICAgICAgIGxldCBrID0gaSAvLyBUZW1wb3Jhcnkgc28gd2UgY2FuIGluY3JlbWVudCBgaWAgaW4gcGxhY2VcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gaiArIGtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtuZXh0SW5kZXhdXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV4dCB0aGluZyBpbiB0aGUgbGlzdCBzaGFyZXMgdGhlIHNhbWUgY2x1c3RlciBuYW1lLCBtYWtlIGl0IHBhcnQgb2YgdGhpcyBjbHVzdGVzclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RGVzY3JpcHRvciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4ID09PSBjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBjbHVzdGVyU2V0LnB1c2gobmV4dERlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgZ28gdG8gdGhlIG5leHQgb25lLCBidW1wIHRoZSBpdGVyYXRpb24gaW5kZXggc28gd2Ugc2tpcCBpdCBvbiB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgICAgY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyS2V5LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsXG4gICAgICAgICAgICAgICAgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcixcbiAgICAgICAgICAgICAgaXNQcm9wZXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWFkaW5nUm93LnByb3BlcnR5Um93cy5wdXNoKHByb3BlcnR5Um93KVxuXG4gICAgICAgICAgICAvLyBQdXNoaW5nIGFuIGVsZW1lbnQgaW50byBhIGNvbXBvbmVudCByb3cgd2lsbCByZXN1bHQgaW4gaXQgcmVuZGVyaW5nLCBzbyBvbmx5IHB1c2hcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSByb3dzIG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGV4XG4gICAgICAgICAgaWYgKG5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICBjb21wb25lbnRSb3dzLnB1c2gocHJvcGVydHlSb3cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdG9ySXRlcmF0aW9ucysrXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtLl9pbmRleCA9IGluZGV4XG4gICAgICBpdGVtLl9pdGVtcyA9IGl0ZW1zXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MgPSBjb21wb25lbnRSb3dzLmZpbHRlcigoeyBub2RlLCBwYXJlbnQsIGxvY2F0b3IgfSkgPT4ge1xuICAgICAgICAvLyBMb2NhdG9ycyA+IDAuMCBhcmUgYmVsb3cgdGhlIGxldmVsIHdlIHdhbnQgdG8gZGlzcGxheSAod2Ugb25seSB3YW50IHRoZSB0b3AgYW5kIGl0cyBjaGlsZHJlbilcbiAgICAgIGlmIChsb2NhdG9yLnNwbGl0KCcuJykubGVuZ3RoID4gMikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gIXBhcmVudCB8fCBwYXJlbnQuX19pc0V4cGFuZGVkXG4gICAgfSlcblxuICAgIHJldHVybiBjb21wb25lbnRSb3dzXG4gIH1cblxuICBtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIGxldCB2YWx1ZUdyb3VwID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRWYWx1ZUdyb3VwKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlKVxuICAgIGlmICghdmFsdWVHcm91cCkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBsZXQga2V5ZnJhbWVzTGlzdCA9IE9iamVjdC5rZXlzKHZhbHVlR3JvdXApLm1hcCgoa2V5ZnJhbWVLZXkpID0+IHBhcnNlSW50KGtleWZyYW1lS2V5LCAxMCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxuICAgIGlmIChrZXlmcmFtZXNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNjdXJyID0ga2V5ZnJhbWVzTGlzdFtpXVxuICAgICAgaWYgKGlzTmFOKG1zY3VycikpIGNvbnRpbnVlXG4gICAgICBsZXQgbXNwcmV2ID0ga2V5ZnJhbWVzTGlzdFtpIC0gMV1cbiAgICAgIGxldCBtc25leHQgPSBrZXlmcmFtZXNMaXN0W2kgKyAxXVxuXG4gICAgICBpZiAobXNjdXJyID4gZnJhbWVJbmZvLm1zQikgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgYWZ0ZXIgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXRcbiAgICAgIGlmIChtc2N1cnIgPCBmcmFtZUluZm8ubXNBICYmIG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmIG1zbmV4dCA8IGZyYW1lSW5mby5tc0EpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGVudGlyZWx5IGJlZm9yZSB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdCAocGFydGlhbCBzZWdtZW50cyBhcmUgb2spXG5cbiAgICAgIGxldCBwcmV2XG4gICAgICBsZXQgY3VyclxuICAgICAgbGV0IG5leHRcblxuICAgICAgaWYgKG1zcHJldiAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc3ByZXYpKSB7XG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgbXM6IG1zcHJldixcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgLSAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zcHJldiwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zcHJldl0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNwcmV2XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSB7XG4gICAgICAgIG1zOiBtc2N1cnIsXG4gICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zY3VyciwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc2N1cnJdLnZhbHVlLFxuICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc2N1cnJdLmN1cnZlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc25leHQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNuZXh0KSkge1xuICAgICAgICBuZXh0ID0ge1xuICAgICAgICAgIG1zOiBtc25leHQsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc25leHQsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc25leHRdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zbmV4dF0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcHhPZmZzZXRMZWZ0ID0gKGN1cnIuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgbGV0IHB4T2Zmc2V0UmlnaHRcbiAgICAgIGlmIChuZXh0KSBweE9mZnNldFJpZ2h0ID0gKG5leHQuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgICBsZXQgc2VnbWVudE91dHB1dCA9IGl0ZXJhdGVlKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaSlcbiAgICAgIGlmIChzZWdtZW50T3V0cHV0KSBzZWdtZW50T3V0cHV0cy5wdXNoKHNlZ21lbnRPdXRwdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICBtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5Um93cywgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBwcm9wZXJ0eVJvd3MuZm9yRWFjaCgocHJvcGVydHlSb3cpID0+IHtcbiAgICAgIGlmIChwcm9wZXJ0eVJvdy5pc0NsdXN0ZXIpIHtcbiAgICAgICAgcHJvcGVydHlSb3cuY2x1c3Rlci5mb3JFYWNoKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlEZXNjcmlwdG9yLm5hbWVcbiAgICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eVJvdy5wcm9wZXJ0eS5uYW1lXG4gICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIHJlbW92ZVRpbWVsaW5lU2hhZG93ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gIH1cblxuICAvKlxuICAgKiByZW5kZXIgbWV0aG9kc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgdG9wOiAxN1xuICAgICAgICB9fT5cbiAgICAgICAgPENvbnRyb2xzQXJlYVxuICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnJlbW92ZVRpbWVsaW5lU2hhZG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWU9e3RoaXMucHJvcHMudXNlcmNvbmZpZy5uYW1lfVxuICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e09iamVjdC5rZXlzKCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSkgPyB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50aW1lbGluZXMgOiB7fSl9XG4gICAgICAgICAgc2VsZWN0ZWRUaW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICBjdXJyZW50RnJhbWU9e3RoaXMuc3RhdGUuY3VycmVudEZyYW1lfVxuICAgICAgICAgIGlzUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgcGxheWJhY2tTcGVlZD17dGhpcy5zdGF0ZS5wbGF5ZXJQbGF5YmFja1NwZWVkfVxuICAgICAgICAgIGxhc3RGcmFtZT17dGhpcy5nZXRGcmFtZUluZm8oKS5mcmlNYXh9XG4gICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXsob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjcmVhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkdXBsaWNhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkZWxldGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzZWxlY3RUaW1lbGluZT17KGN1cnJlbnRUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgaW4tbWVtb3J5IGNvbXBvbmVudCBvciBwcm9wZXJ0eSBhc3NpZ25tZW50IG1pZ2h0IG5vdCB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFRpbWVsaW5lTmFtZShjdXJyZW50VGltZWxpbmVOYW1lLCB7IGZyb206ICd0aW1lbGluZScgfSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NldFRpbWVsaW5lTmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgY3VycmVudFRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lbGluZU5hbWUgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8qIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBGb3J3YXJkPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaU1heCB9KVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17KGlucHV0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQbGF5YmFja1NwZWVkID0gTnVtYmVyKGlucHV0RXZlbnQudGFyZ2V0LnZhbHVlIHx8IDEpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGxheWVyUGxheWJhY2tTcGVlZCB9KVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIChpbnB1dEl0ZW0pIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKGlucHV0SXRlbS5ub2RlLCBmcmFtZUluZm8sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZSwgdGhpcy5fY29tcG9uZW50LCB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBpbnB1dEl0ZW0ucHJvcGVydHkpXG4gIH1cblxuICBnZXRDdXJyZW50VGltZWxpbmVUaW1lIChmcmFtZUluZm8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChpdGVtKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBsZXQgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgdGhpcz8gV2UgZG9uJ3QgbmVlZCB0byByZW5kZXIgZXZlcnkgc2VnbWVudCBzaW5jZSBzb21lIG9mIHRoZW0gb3ZlcmxhcC5cbiAgICAvLyBNYXliZSBrZWVwIGEgbGlzdCBvZiBrZXlmcmFtZSAncG9sZXMnIHJlbmRlcmVkLCBhbmQgb25seSByZW5kZXIgb25jZSBpbiB0aGF0IHNwb3Q/XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCBoZWlnaHQ6IDI1LCB3aWR0aDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBpdGVtLnByb3BlcnR5Um93cywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgaW5kZXgsIGhhbmRsZSwgb3B0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW50IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnRyYW5zaXRpb25Cb2R5RHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgICAgfVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX1cbiAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRTZWdtZW50cyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXMgPSB7fVxuICAgICAgICAgICAgc2VsZWN0ZWRTZWdtZW50cyA9IHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBpbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWVcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkS2V5ZnJhbWVzLCBzZWxlY3RlZFNlZ21lbnRzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdICE9IHVuZGVmaW5lZCkgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldICE9IHVuZGVmaW5lZCkgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLCB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgJ2JvZHknLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IHNlbGVjdGVkS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1xuICAgICAgICAgIGxldCBzZWxlY3RlZFNlZ21lbnRzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzID0ge31cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdtaWRkbGUnXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpLFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBlbGVtZW50TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBuZXh0LmluZGV4LFxuICAgICAgICAgICAgbXM6IG5leHQubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdtaWRkbGUnXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGVjdGVkU2VnbWVudHNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgaGFzQ3VydmU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkS2V5ZnJhbWVzLCBzZWxlY3RlZFNlZ21lbnRzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuICAgIGxldCBpc1NlbGVjdGVkID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gIT0gdW5kZWZpbmVkKSBpc1NlbGVjdGVkID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBzZWxlY3RlZFNlZ21lbnRzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzXG4gICAgICAgICAgbGV0IHNlbGVjdGVkS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRTZWdtZW50cyA9IHt9XG4gICAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGVjdGVkU2VnbWVudHNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgICAgaGFzQ3VydmU6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZFNlZ21lbnRzLCBzZWxlY3RlZEtleWZyYW1lcyB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiAoaXNTZWxlY3RlZClcbiAgICAgICAgICAgICAgPyAgQ29sb3IoUGFsZXR0ZS5MSUdIVEVTVF9QSU5LKS5mYWRlKC41KVxuICAgICAgICAgICAgICA6IFBhbGV0dGUuREFSS0VSX0dSQVlcbiAgICAgICAgfX0gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgaXRlbSwgaW5kZXgsIGhlaWdodCwgYWxsSXRlbXMsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGNvbnN0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGl0ZW0ucHJvcGVydHkubmFtZVxuICAgIGNvbnN0IGlzQWN0aXZhdGVkID0gdGhpcy5pc1Jvd0FjdGl2YXRlZChpdGVtKVxuXG4gICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHt9KSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0IC0gMTAsIDQsICdsZWZ0Jywge30pKVxuICAgICAgfVxuICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCA1LCAnbWlkZGxlJywge30pKVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0ICsgMTAsIDYsICdyaWdodCcsIHt9KSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGtleT17YGtleWZyYW1lLWNvbnRhaW5lci0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICAgIGNsYXNzTmFtZT17YGtleWZyYW1lLWNvbnRhaW5lcmB9PlxuICAgICAgICAgIHtzZWdtZW50UGllY2VzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9KVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyR2F1Z2UgKGZyYW1lSW5mbykge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVGcmFtZXMoKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHBpeGVsc1BlckZyYW1lLCBmcmFtZU1vZHVsdXMpID0+IHtcbiAgICAgICAgaWYgKGZyYW1lTnVtYmVyID09PSAwIHx8IGZyYW1lTnVtYmVyICUgZnJhbWVNb2R1bHVzID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57ZnJhbWVOdW1iZXJ9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnc2Vjb25kcycpIHsgLy8gYWthIHRpbWUgZWxhcHNlZCwgbm90IGZyYW1lc1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZVRpbWVzKChtaWxsaXNlY29uZHNOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgdG90YWxNaWxsaXNlY29uZHMpID0+IHtcbiAgICAgICAgaWYgKHRvdGFsTWlsbGlzZWNvbmRzIDw9IDEwMDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PnttaWxsaXNlY29uZHNOdW1iZXJ9bXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2Zvcm1hdFNlY29uZHMobWlsbGlzZWNvbmRzTnVtYmVyIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRnJhbWVHcmlkIChmcmFtZUluZm8pIHtcbiAgICB2YXIgZ3VpZGVIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nZnJhbWUtZ3JpZCc+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVGcmFtZXMoKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHBpeGVsc1BlckZyYW1lLCBmcmFtZU1vZHVsdXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17e2hlaWdodDogZ3VpZGVIZWlnaHQgKyAzNSwgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgQ29sb3IoUGFsZXR0ZS5DT0FMKS5mYWRlKDAuNjUpLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0b3A6IDM0fX0gLz5cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTY3J1YmJlciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSB8fCB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmFCKSByZXR1cm4gJydcbiAgICB2YXIgZnJhbWVPZmZzZXQgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAtIGZyYW1lSW5mby5mcmlBXG4gICAgdmFyIHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgIHZhciBzaGFmdEhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAxMCkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIHNjcnViYmVyRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgZnJhbWVCYXNlbGluZTogdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUsXG4gICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzY3J1YmJlckRyYWdTdGFydDogbnVsbCwgZnJhbWVCYXNlbGluZTogdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUsIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZSB9KVxuICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmNoYW5nZVNjcnViYmVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxMyxcbiAgICAgICAgICAgICAgd2lkdGg6IDEzLFxuICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICBsZWZ0OiBweE9mZnNldCAtIDYsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDAgMnB4IDAgcmdiYSgwLCAwLCAwLCAuOSknLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDZcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogc2hhZnRIZWlnaHQsXG4gICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICB0b3A6IDI1LFxuICAgICAgICAgICAgICBsZWZ0OiBweE9mZnNldCxcbiAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJEdXJhdGlvbk1vZGlmaWVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIC8vIHZhciB0cmltQXJlYUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHZhciBweE9mZnNldCA9IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nID8gMCA6IC10aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgPj0gZnJhbWVJbmZvLmZyaU1heDIgfHwgdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgICAgZHVyYXRpb25EcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIGR1cmF0aW9uVHJpbTogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGx9KVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvbkRyYWdTdGFydDogbnVsbCwgZHVyYXRpb25UcmltOiAwIH0pIH0sIDEwMClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiBweE9mZnNldCwgdG9wOiAwLCB6SW5kZXg6IDEwMDZ9fT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0cmltLWFyZWEnIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1vdXNlRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC02LFxuICAgICAgICAgICAgICB3aWR0aDogMjYgKyBweE9mZnNldCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMzUpIHx8IDAsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5GQVRIRVJfQ09BTCkuZmFkZSgwLjYpXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8c3BhbiAvPlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRvcENvbnRyb2xzICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0b3AtY29udHJvbHMgbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgKyAxMCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUxcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWVrZWVwaW5nLXdyYXBwZXInXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1lLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogODYsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiAyLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBoZWlnaHQ6IDI0LCBwYWRkaW5nOiA0LCBmb250V2VpZ2h0OiAnbGlnaHRlcicsIGZvbnRTaXplOiAxOSB9fT5cbiAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgICAgICAgICAgICAgPyA8c3Bhbj57fn50aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1mPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1mcHMtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAzOCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGxlZnQ6IDIxMSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDUsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgICAgICAgICAgICAgPyA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57fn50aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1mPC9zcGFuPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctNHB4J319Pnt0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZH1mcHM8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRvZ2dsZSdcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlVGltZURpc3BsYXlNb2RlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNyxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnXG4gICAgICAgICAgICAgID8gKDxzcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tjb2xvcjogUGFsZXR0ZS5ST0NLLCBwb3NpdGlvbjogJ3JlbGF0aXZlJ319PkZSQU1FU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCd9fT5TRUNPTkRTPC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj4pXG4gICAgICAgICAgICAgIDogKDxzcGFuPlxuICAgICAgICAgICAgICAgIDxkaXY+RlJBTUVTPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnLCBjb2xvcjogUGFsZXR0ZS5ST0NLLCBwb3NpdGlvbjogJ3JlbGF0aXZlJ319PlNFQ09ORFNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj4pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWJveCdcbiAgICAgICAgICBvbkNsaWNrPXsoY2xpY2tFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IG51bGwgfHwgdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldCBsZWZ0WCA9IGNsaWNrRXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgICBsZXQgZnJhbWVYID0gTWF0aC5yb3VuZChsZWZ0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgICBsZXQgbmV3RnJhbWUgPSBmcmFtZUluZm8uZnJpQSArIGZyYW1lWFxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhuZXdGcmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAvLyBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogMTAsXG4gICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVEIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckZyYW1lR3JpZChmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckdhdWdlKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyU2NydWJiZXIoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckR1cmF0aW9uTW9kaWZpZXIoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBrbm9iUmFkaXVzID0gNVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndGltZWxpbmUtcmFuZ2Utc2Nyb2xsYmFyJ1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NMLFxuICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktFUl9HUkFZLFxuICAgICAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgICAgICAgfX0+XG4gICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sXG4gICAgICAgICAgICAgIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSxcbiAgICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsXG4gICAgICAgICAgICAgIHNjcm9sbGJhckVuZDogbnVsbCxcbiAgICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZnJhbWVJbmZvLnNjQSA+IDAgfSkgLy8gaWYgdGhlIHNjcm9sbGJhciBub3QgYXQgcG9zaXRpb24gemVybywgc2hvdyBpbm5lciBzaGFkb3cgZm9yIHRpbWVsaW5lIGFyZWFcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLngsIGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVEVTVF9HUkFZLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgICBsZWZ0OiBmcmFtZUluZm8uc2NBLFxuICAgICAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjQiAtIGZyYW1lSW5mby5zY0EgKyAxNyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBrbm9iUmFkaXVzLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgMCwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgbGVmdDogMCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FIH19IC8+XG4gICAgICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKDAsIGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCByaWdodDogMCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FIH19IC8+XG4gICAgICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC0gMTAsIGxlZnQ6IDEwLCBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgbGVmdDogKCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAvIGZyYW1lSW5mby5mcmlNYXgyKSAqIDEwMCkgKyAnJSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckJvdHRvbUNvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogNDUsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB6SW5kZXg6IDEwMDAwXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyAoeyBub2RlLCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoIH0pIHtcbiAgICAvLyBIQUNLOiBVbnRpbCB3ZSBlbmFibGUgZnVsbCBzdXBwb3J0IGZvciBuZXN0ZWQgZGlzcGxheSBpbiB0aGlzIGxpc3QsIHN3YXAgdGhlIFwidGVjaG5pY2FsbHkgY29ycmVjdFwiXG4gICAgLy8gdHJlZSBtYXJrZXIgd2l0aCBhIFwidmlzdWFsbHkgY29ycmVjdFwiIG1hcmtlciByZXByZXNlbnRpbmcgdGhlIHRyZWUgd2UgYWN0dWFsbHkgc2hvd1xuICAgIGNvbnN0IGhlaWdodCA9IGFzY2lpQnJhbmNoID09PSAn4pSU4pSA4pSsICcgPyAxNSA6IDI1XG4gICAgY29uc3QgY29sb3IgPSBub2RlLl9faXNFeHBhbmRlZCA/IFBhbGV0dGUuUk9DSyA6IFBhbGV0dGUuUk9DS19NVVRFRFxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IG5vZGUuZWxlbWVudE5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICAobG9jYXRvciA9PT0gJzAnKVxuICAgICAgICA/ICg8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAyNywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMXB4KSd9fT5cbiAgICAgICAgICB7dHJ1bmNhdGUobm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddIHx8IGVsZW1lbnROYW1lLCAxMil9XG4gICAgICAgIDwvZGl2PilcbiAgICAgICAgOiAoPHNwYW4gY2xhc3NOYW1lPSduby1zZWxlY3QnPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDIxLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodDogNyxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNSwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVlfRklUMSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAxLCBoZWlnaHQ6IGhlaWdodH19IC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDR9fT7igJQ8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7dHJ1bmNhdGUobm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddIHx8IGA8JHtlbGVtZW50TmFtZX0+YCwgOCl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+KVxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudEhlYWRpbmdSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bjb21wb25lbnQtaGVhZGluZy1yb3ctJHtjb21wb25lbnRJZH0tJHtpbmRleH1gfVxuICAgICAgICBjbGFzc05hbWU9J2NvbXBvbmVudC1oZWFkaW5nLXJvdyBuby1zZWxlY3QnXG4gICAgICAgIGRhdGEtY29tcG9uZW50LWlkPXtjb21wb25lbnRJZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIC8vIENvbGxhcHNlL2V4cGFuZCB0aGUgZW50aXJlIGNvbXBvbmVudCBhcmVhIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGlmIChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlTm9kZShpdGVtLm5vZGUsIGNvbXBvbmVudElkKVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCd1bnNlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kTm9kZShpdGVtLm5vZGUsIGNvbXBvbmVudElkKVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUnLFxuICAgICAgICAgIHRhYmxlTGF5b3V0OiAnZml4ZWQnLFxuICAgICAgICAgIGhlaWdodDogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/IDAgOiBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC43NSA6IDEuMFxuICAgICAgICB9fT5cbiAgICAgICAgeyFpdGVtLm5vZGUuX19pc0V4cGFuZGVkICYmIC8vIGNvdmVycyBrZXlmcmFtZSBoYW5nb3ZlciBhdCBmcmFtZSAwIHRoYXQgZm9yIHVuY29sbGFwc2VkIHJvd3MgaXMgaGlkZGVuIGJ5IHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxMCxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodH19IC8+fVxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDE1MCxcbiAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0LCBtYXJnaW5Ub3A6IC02IH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgeyhpdGVtLm5vZGUuX19pc0V4cGFuZGVkKVxuICAgICAgICAgICAgICAgICAgPyA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IDEsIGxlZnQ6IC0xIH19PjxEb3duQ2Fycm90U1ZHIGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgOiA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IDMgfX0+PFJpZ2h0Q2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcoaXRlbSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29tcG9uZW50LWNvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZS1jZWxsJywgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsIGhlaWdodDogJ2luaGVyaXQnIH19PlxuICAgICAgICAgIHsoIWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gdGhpcy5yZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoaXRlbSkgOiAnJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJQcm9wZXJ0eVJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgaHVtYW5OYW1lID0gaHVtYW5pemVQcm9wZXJ0eU5hbWUoaXRlbS5wcm9wZXJ0eS5uYW1lKVxuICAgIHZhciBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgdmFyIGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgdmFyIHByb3BlcnR5TmFtZSA9IGl0ZW0ucHJvcGVydHkgJiYgaXRlbS5wcm9wZXJ0eS5uYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3cnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gQ29sbGFwc2UgdGhpcyBjbHVzdGVyIGlmIHRoZSBhcnJvdyBvciBuYW1lIGlzIGNsaWNrZWRcbiAgICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7KGl0ZW0uaXNDbHVzdGVySGVhZGluZylcbiAgICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxMzYsXG4gICAgICAgICAgICAgICAgdG9wOiAtMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC00LCBsZWZ0OiAtMyB9fT48RG93bkNhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICB7KCFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJiBodW1hbk5hbWUgIT09ICdiYWNrZ3JvdW5kIGNvbG9yJykgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODAsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNCxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICB3aWR0aDogOTEsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGh1bWFuTmFtZSA9PT0gJ2JhY2tncm91bmQgY29sb3InID8gJ3RyYW5zbGF0ZVkoLTJweCknIDogJ3RyYW5zbGF0ZVkoM3B4KScsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2h1bWFuTmFtZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0IC0gMSxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPFByb3BlcnR5SW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGV9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBmcmFtZUluZm8ucHhBXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ3Byb3BlcnR5LXJvdycsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXRpbWVsaW5lLXNlZ21lbnRzLWJveCdcbiAgICAgICAgICBvbk1vdXNlRG93bj17KCkgPT4ge1xuICAgICAgICAgICAgbGV0IGtleSA9IGl0ZW0uY29tcG9uZW50SWQgKyAnICcgKyBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICAgICAgICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IHNldFN0YXRlcyB3aGljaCBjYW4gaW1wYWN0IHJlbmRlcmluZyBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nba2V5XSkge1xuICAgICAgICAgICAgICBsZXQgYWN0aXZhdGVkUm93cyA9IHt9XG4gICAgICAgICAgICAgIGFjdGl2YXRlZFJvd3Nba2V5XSA9IHRydWVcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2YXRlZFJvd3MgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbHVzdGVyUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgdmFyIGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgdmFyIGNsdXN0ZXJOYW1lID0gaXRlbS5jbHVzdGVyTmFtZVxuICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LWNsdXN0ZXItcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7Y2x1c3Rlck5hbWV9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdydcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIC8vIEV4cGFuZCB0aGUgcHJvcGVydHkgY2x1c3RlciB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7IXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiAzLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fSwgc2VsZWN0ZWRTZWdtZW50czoge319KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==