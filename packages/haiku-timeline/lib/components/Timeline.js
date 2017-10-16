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

var _dndHelpers = require('haiku-serialization/src/utils/dndHelpers');

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

    window.addEventListener('dragover', _dndHelpers.preventDefaultDrag, false);
    window.addEventListener('drop', _dndHelpers.linkExternalAssetsOnDrop.bind(_this), false);
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
    key: 'playbackSkipBack',
    value: function playbackSkipBack() {
      /* this._component.getCurrentTimeline().pause() */
      /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
      /* this.updateTime(frameInfo.fri0) */
      var frameInfo = this.getFrameInfo();
      this._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
      this.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
    }
  }, {
    key: 'playbackSkipForward',
    value: function playbackSkipForward() {
      var frameInfo = this.getFrameInfo();
      this.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
      this._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
    }
  }, {
    key: 'togglePlayback',
    value: function togglePlayback() {
      var _this5 = this;

      if (this.state.currentFrame >= this.state.maxFrame) this.playbackSkipBack();

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
            lineNumber: 1436
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
            _this13.playbackSkipBack();
          },
          playbackSkipForward: function playbackSkipForward() {
            _this13.playbackSkipForward();
          },
          playbackPlayPause: function playbackPlayPause() {
            _this13.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this13.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1441
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
            lineNumber: 1502
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
            lineNumber: 1525
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
            lineNumber: 1553
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
            lineNumber: 1601
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
              lineNumber: 1613
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1621
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
            lineNumber: 1647
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
              lineNumber: 1675
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
              lineNumber: 1726
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
              lineNumber: 1742
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
                lineNumber: 1759
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
                  lineNumber: 1769
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1777
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
                lineNumber: 1787
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1796
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
                lineNumber: 1814
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
                  lineNumber: 1825
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1835
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
            lineNumber: 1855
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
            lineNumber: 1894
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
              lineNumber: 1937
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
                  lineNumber: 1953
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1954
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
                  lineNumber: 1963
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1964
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
                  lineNumber: 1969
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1970
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
            lineNumber: 1981
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1983
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
            lineNumber: 1996
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2015
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
                lineNumber: 2016
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
                lineNumber: 2029
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
                lineNumber: 2039
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
              lineNumber: 2051
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
              lineNumber: 2074
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2093
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
                lineNumber: 2094
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
                lineNumber: 2107
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2121
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
            lineNumber: 2128
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
              lineNumber: 2141
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
                lineNumber: 2150
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2162
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2164
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
                    lineNumber: 2165
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
                lineNumber: 2169
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2184
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2186
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
                    lineNumber: 2187
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
                  lineNumber: 2190
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
                lineNumber: 2192
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2209
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2210
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2211
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2213
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
                  lineNumber: 2215
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2216
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2217
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2218
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
              lineNumber: 2225
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
            lineNumber: 2262
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
              lineNumber: 2272
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
                lineNumber: 2296
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
                  lineNumber: 2306
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2311
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
                  lineNumber: 2313
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2318
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
              lineNumber: 2322
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
              lineNumber: 2323
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
            lineNumber: 2338
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
            lineNumber: 2365
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2368
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
              lineNumber: 2369
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2380
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2381
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
              lineNumber: 2383
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
            lineNumber: 2398
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
            lineNumber: 2425
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
              lineNumber: 2433
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2441
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
                  lineNumber: 2442
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2447
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2447
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2448
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2448
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
              lineNumber: 2454
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
            lineNumber: 2469
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
              lineNumber: 2479
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
                lineNumber: 2491
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2501
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2501
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
              lineNumber: 2506
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
                lineNumber: 2515
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
                  lineNumber: 2528
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
              lineNumber: 2542
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
              lineNumber: 2551
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
              lineNumber: 2566
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
            lineNumber: 2617
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2648
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
              lineNumber: 2650
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
                lineNumber: 2659
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2666
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2666
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
                lineNumber: 2668
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
                  lineNumber: 2681
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
              lineNumber: 2690
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
              lineNumber: 2699
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
              lineNumber: 2713
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
          lineNumber: 2744
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
            lineNumber: 2747
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
            lineNumber: 2769
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
            lineNumber: 2785
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
              lineNumber: 2796
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
            lineNumber: 2813
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpZE1vdW50IiwiT2JqZWN0Iiwia2V5cyIsInVwZGF0ZXMiLCJrZXkiLCJjaGFuZ2VzIiwiY2JzIiwiY2FsbGJhY2tzIiwic3BsaWNlIiwic2V0U3RhdGUiLCJjbGVhckNoYW5nZXMiLCJmb3JFYWNoIiwiY2IiLCJwdXNoIiwiZmx1c2hVcGRhdGVzIiwiazEiLCJrMiIsImNvbXBvbmVudElkIiwicHJvcGVydHlOYW1lIiwiX3Jvd0NhY2hlQWN0aXZhdGlvbiIsInR1cGxlIiwicmVtb3ZlTGlzdGVuZXIiLCJ0b3VyQ2xpZW50Iiwib2ZmIiwiX2Vudm95Q2xpZW50IiwiY2xvc2VDb25uZWN0aW9uIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xpZW50V2lkdGgiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBsYXliYWNrU2tpcEJhY2siLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiX2VsZW1lbnRzIiwidXBzZXJ0RnJvbU5vZGVXaXRoQ29tcG9uZW50Q2FjaGVkIiwiaXNDb21wb25lbnQiLCJnZXROYW1lU3RyaW5nIiwiZ2V0Q29tcG9uZW50SWQiLCJBTExPV0VEX1RBR05BTUVTIiwiYXNjaWlCcmFuY2giLCJoZWFkaW5nUm93IiwicHJvcGVydHlSb3dzIiwiZG9Hb0RlZXAiLCJ2YWx1ZXMiLCJnZXRBZGRyZXNzYWJsZVByb3BlcnRpZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImsiLCJqIiwibmV4dEluZGV4IiwibmV4dERlc2NyaXB0b3IiLCJjbHVzdGVyTmFtZSIsImlzQ2x1c3RlciIsIml0ZW1zIiwiX2luZGV4IiwiX2l0ZW1zIiwic2VnbWVudE91dHB1dHMiLCJ2YWx1ZUdyb3VwIiwiZ2V0VmFsdWVHcm91cCIsImtleWZyYW1lc0xpc3QiLCJrZXlmcmFtZUtleSIsInBhcnNlSW50Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsIm1zIiwiZnJhbWUiLCJ2YWx1ZSIsImN1cnZlIiwicHhPZmZzZXRMZWZ0IiwicHhPZmZzZXRSaWdodCIsInNlZ21lbnRPdXRwdXQiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wZXJ0eU91dHB1dHMiLCJtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwiY29uY2F0IiwicG9zaXRpb24iLCJyZW1vdmVUaW1lbGluZVNoYWRvdyIsInRpbWVsaW5lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lIiwic2V0VGltZWxpbmVOYW1lIiwicGxheWJhY2tTa2lwRm9yd2FyZCIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImN0eE1lbnVFdmVudCIsInN0b3BQcm9wYWdhdGlvbiIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJEQVJLRVJfR1JBWSIsImFsbEl0ZW1zIiwiaXNBY3RpdmF0ZWQiLCJpc1Jvd0FjdGl2YXRlZCIsInJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciIsIm1hcFZpc2libGVGcmFtZXMiLCJwaXhlbHNQZXJGcmFtZSIsInBvaW50ZXJFdmVudHMiLCJmb250V2VpZ2h0IiwibWFwVmlzaWJsZVRpbWVzIiwibWlsbGlzZWNvbmRzTnVtYmVyIiwidG90YWxNaWxsaXNlY29uZHMiLCJndWlkZUhlaWdodCIsImNsaWVudEhlaWdodCIsImJvcmRlckxlZnQiLCJDT0FMIiwiZnJhQiIsInNoYWZ0SGVpZ2h0IiwiY2hhbmdlU2NydWJiZXJQb3NpdGlvbiIsImJveFNoYWRvdyIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIiwiYm9yZGVyVG9wUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21SaWdodFJhZGl1cyIsIm1vdXNlRXZlbnRzIiwiRkFUSEVSX0NPQUwiLCJ2ZXJ0aWNhbEFsaWduIiwiZm9udFNpemUiLCJib3JkZXJCb3R0b20iLCJmbG9hdCIsIm1pbldpZHRoIiwidGV4dEFsaWduIiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZyIsIlJPQ0tfTVVURUQiLCJmb250U3R5bGUiLCJtYXJnaW5Ub3AiLCJ0b2dnbGVUaW1lRGlzcGxheU1vZGUiLCJtYXJnaW5SaWdodCIsImNsaWNrRXZlbnQiLCJsZWZ0WCIsImZyYW1lWCIsIm5ld0ZyYW1lIiwicmVuZGVyRnJhbWVHcmlkIiwicmVuZGVyR2F1Z2UiLCJyZW5kZXJTY3J1YmJlciIsInJlbmRlckR1cmF0aW9uTW9kaWZpZXIiLCJrbm9iUmFkaXVzIiwiY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UiLCJMSUdIVEVTVF9HUkFZIiwiYm90dG9tIiwicmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciIsInJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyIsIkdSQVlfRklUMSIsIm1hcmdpbkxlZnQiLCJ0YWJsZUxheW91dCIsIkxJR0hUX0dSQVkiLCJvcGFjaXR5IiwicmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyIsInJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsInByb3BlcnR5T25MYXN0Q29tcG9uZW50IiwiaHVtYW5OYW1lIiwidGV4dFRyYW5zZm9ybSIsImxpbmVIZWlnaHQiLCJyZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJyZW5kZXJDbHVzdGVyUm93IiwicmVuZGVyUHJvcGVydHlSb3ciLCJyZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IiwiZ2V0Q29tcG9uZW50Um93c0RhdGEiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJyZW5kZXJUb3BDb250cm9scyIsInJlbmRlckNvbXBvbmVudFJvd3MiLCJyZW5kZXJCb3R0b21Db250cm9scyIsImNvbW1pdHRlZFZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hdkRpciIsImRvRm9jdXMiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFLQTs7QUFNQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFrQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7Ozs7O0FBVUEsSUFBSUEsV0FBV0MsUUFBUSxVQUFSLENBQWY7QUFDQSxJQUFJQyxXQUFXRixTQUFTRSxRQUF4QjtBQUNBLElBQUlBLFFBQUosRUFBYztBQUNaLE1BQUlBLFNBQVNDLGtCQUFiLEVBQWlDRCxTQUFTQyxrQkFBVCxDQUE0QixDQUE1QixFQUErQixDQUEvQjtBQUNqQyxNQUFJRCxTQUFTRSx3QkFBYixFQUF1Q0YsU0FBU0Usd0JBQVQsQ0FBa0MsQ0FBbEMsRUFBcUMsQ0FBckM7QUFDeEM7O0FBRUQsSUFBTUMsV0FBVztBQUNmQyxtQkFBaUIsR0FERjtBQUVmQyxrQkFBZ0IsR0FGRDtBQUdmQyxhQUFXLEVBSEk7QUFJZkMsa0JBQWdCLEVBSkQ7QUFLZkMsZUFBYSxFQUxFO0FBTWZDLGtCQUFnQixFQU5EO0FBT2ZDLHFCQUFtQixDQUFDLENBQUQsRUFBSSxFQUFKLENBUEo7QUFRZkMsZ0JBQWMsQ0FSQztBQVNmQyxZQUFVLElBVEs7QUFVZkMsZ0JBQWMsQ0FWQztBQVdmQyxtQkFBaUIsRUFYRjtBQVlmQyxtQkFBaUIsUUFaRixFQVlZO0FBQzNCQyx1QkFBcUIsU0FiTjtBQWNmQyxtQkFBaUIsS0FkRjtBQWVmQyx1QkFBcUIsR0FmTjtBQWdCZkMsa0JBQWdCLEtBaEJEO0FBaUJmQyxvQkFBa0IsS0FqQkg7QUFrQmZDLG9CQUFrQixLQWxCSDtBQW1CZkMsZ0JBQWMsS0FuQkM7QUFvQmZDLDhCQUE0QixLQXBCYjtBQXFCZkMsd0JBQXNCLEtBckJQO0FBc0JmQyxpQkFBZSxFQXRCQTtBQXVCZkMsaUJBQWUsRUF2QkE7QUF3QmZDLGlCQUFlLEVBeEJBO0FBeUJmQyxlQUFhLEVBekJFO0FBMEJmQyxpQkFBZSxJQTFCQTtBQTJCZkMsZ0JBQWMsSUEzQkM7QUE0QmZDLDRCQUEwQixFQTVCWDtBQTZCZkMsbUJBQWlCLEVBN0JGO0FBOEJmQyxtQkFBaUIsSUE5QkY7QUErQmZDLHNCQUFvQjtBQS9CTCxDQUFqQjs7QUFrQ0EsSUFBTUMsWUFBWTtBQUNoQkMseUNBRGdCO0FBRWhCQyw2Q0FGZ0I7QUFHaEJDLHlDQUhnQjtBQUloQkMsMkNBSmdCO0FBS2hCQywrQ0FMZ0I7QUFNaEJDLHlDQU5nQjtBQU9oQkMseUNBUGdCO0FBUWhCQywyQ0FSZ0I7QUFTaEJDLDJDQVRnQjtBQVVoQkMseUNBVmdCO0FBV2hCQywrQ0FYZ0I7QUFZaEJDLG1EQVpnQjtBQWFoQkMsK0NBYmdCO0FBY2hCQyxpREFkZ0I7QUFlaEJDLHFEQWZnQjtBQWdCaEJDLCtDQWhCZ0I7QUFpQmhCQywrQ0FqQmdCO0FBa0JoQkMsaURBbEJnQjtBQW1CaEJDLGlEQW5CZ0I7QUFvQmhCQywrQ0FwQmdCO0FBcUJoQkMsMkNBckJnQjtBQXNCaEJDLCtDQXRCZ0I7QUF1QmhCQywyQ0F2QmdCO0FBd0JoQkMsNkNBeEJnQjtBQXlCaEJDLGlEQXpCZ0I7QUEwQmhCQywyQ0ExQmdCO0FBMkJoQkMsMkNBM0JnQjtBQTRCaEJDLDZDQTVCZ0I7QUE2QmhCQyw2Q0E3QmdCO0FBOEJoQkMsMkNBOUJnQjtBQStCaEJDO0FBL0JnQixDQUFsQjs7QUFrQ0EsSUFBTUMsZ0JBQWdCLEVBQXRCLEMsQ0FBeUI7O0FBRXpCLFNBQVNDLEtBQVQsQ0FBZ0JDLElBQWhCLEVBQXNCQyxPQUF0QixFQUErQjtBQUM3QixNQUFJRCxLQUFLRSxRQUFULEVBQW1CO0FBQ2pCLFNBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSCxLQUFLRSxRQUFMLENBQWNFLE1BQWxDLEVBQTBDRCxHQUExQyxFQUErQztBQUM3QyxVQUFJRSxRQUFRTCxLQUFLRSxRQUFMLENBQWNDLENBQWQsQ0FBWjtBQUNBLFVBQUlFLFNBQVMsT0FBT0EsS0FBUCxLQUFpQixRQUE5QixFQUF3QztBQUN0Q0osZ0JBQVFJLEtBQVI7QUFDQU4sY0FBTU0sS0FBTixFQUFhSixPQUFiO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7O0lBRUtLLFE7OztBQUNKLG9CQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsb0hBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLEtBQUwsR0FBYSxpQkFBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IzRSxRQUFsQixDQUFiO0FBQ0EsVUFBSzRFLE9BQUwsR0FBZSwwQkFBZ0JDLE1BQWhCLFFBQWY7O0FBRUEsVUFBS0MsUUFBTCxHQUFnQixFQUFoQixDQU5rQixDQU1DOztBQUVuQixVQUFLQyxVQUFMLEdBQWtCLDhCQUFvQjtBQUNwQ0MsYUFBTyxVQUQ2QjtBQUVwQ0MsY0FBUSxNQUFLUixLQUFMLENBQVdRLE1BRmlCO0FBR3BDQyxrQkFBWSxNQUFLVCxLQUFMLENBQVdTLFVBSGE7QUFJcENDLGlCQUFXLE1BQUtWLEtBQUwsQ0FBV1UsU0FKYztBQUtwQ0MsZ0JBQVVQLE1BTDBCO0FBTXBDUSxhQUFPLE1BQUtaLEtBQUwsQ0FBV1ksS0FOa0I7QUFPcENDLGlCQUFXVCxPQUFPUztBQVBrQixLQUFwQixDQUFsQjs7QUFVQTtBQUNBO0FBQ0EsVUFBS0MsMkJBQUwsR0FBbUMsaUJBQU9DLFFBQVAsQ0FBZ0IsTUFBS0QsMkJBQUwsQ0FBaUNFLElBQWpDLE9BQWhCLEVBQTZELEdBQTdELENBQW5DO0FBQ0EsVUFBS0MsV0FBTCxHQUFtQixNQUFLQSxXQUFMLENBQWlCRCxJQUFqQixPQUFuQjtBQUNBLFVBQUtFLCtCQUFMLEdBQXVDLE1BQUtBLCtCQUFMLENBQXFDRixJQUFyQyxPQUF2QztBQUNBWixXQUFPZSxRQUFQOztBQUVBZixXQUFPZ0IsZ0JBQVAsQ0FBd0IsVUFBeEIsa0NBQXdELEtBQXhEO0FBQ0FoQixXQUFPZ0IsZ0JBQVAsQ0FBd0IsTUFBeEIsRUFBZ0MscUNBQXlCSixJQUF6QixPQUFoQyxFQUFxRSxLQUFyRTtBQTFCa0I7QUEyQm5COzs7O21DQUVlO0FBQUE7O0FBQ2QsVUFBSSxDQUFDLEtBQUtmLEtBQUwsQ0FBV29CLFFBQWhCLEVBQTBCO0FBQ3hCLGVBQU8sS0FBTSxDQUFiO0FBQ0Q7QUFDRCxVQUFJQyxPQUFPQyxJQUFQLENBQVksS0FBS0MsT0FBakIsRUFBMEIzQixNQUExQixHQUFtQyxDQUF2QyxFQUEwQztBQUN4QyxlQUFPLEtBQU0sQ0FBYjtBQUNEO0FBQ0QsV0FBSyxJQUFNNEIsR0FBWCxJQUFrQixLQUFLRCxPQUF2QixFQUFnQztBQUM5QixZQUFJLEtBQUt2QixLQUFMLENBQVd3QixHQUFYLE1BQW9CLEtBQUtELE9BQUwsQ0FBYUMsR0FBYixDQUF4QixFQUEyQztBQUN6QyxlQUFLQyxPQUFMLENBQWFELEdBQWIsSUFBb0IsS0FBS0QsT0FBTCxDQUFhQyxHQUFiLENBQXBCO0FBQ0Q7QUFDRjtBQUNELFVBQUlFLE1BQU0sS0FBS0MsU0FBTCxDQUFlQyxNQUFmLENBQXNCLENBQXRCLENBQVY7QUFDQSxXQUFLQyxRQUFMLENBQWMsS0FBS04sT0FBbkIsRUFBNEIsWUFBTTtBQUNoQyxlQUFLTyxZQUFMO0FBQ0FKLFlBQUlLLE9BQUosQ0FBWSxVQUFDQyxFQUFEO0FBQUEsaUJBQVFBLElBQVI7QUFBQSxTQUFaO0FBQ0QsT0FIRDtBQUlEOzs7Z0NBRVlULE8sRUFBU1MsRSxFQUFJO0FBQ3hCLFdBQUssSUFBTVIsR0FBWCxJQUFrQkQsT0FBbEIsRUFBMkI7QUFDekIsYUFBS0EsT0FBTCxDQUFhQyxHQUFiLElBQW9CRCxRQUFRQyxHQUFSLENBQXBCO0FBQ0Q7QUFDRCxVQUFJUSxFQUFKLEVBQVE7QUFDTixhQUFLTCxTQUFMLENBQWVNLElBQWYsQ0FBb0JELEVBQXBCO0FBQ0Q7QUFDRCxXQUFLRSxZQUFMO0FBQ0Q7OzttQ0FFZTtBQUNkLFdBQUssSUFBTUMsRUFBWCxJQUFpQixLQUFLWixPQUF0QjtBQUErQixlQUFPLEtBQUtBLE9BQUwsQ0FBYVksRUFBYixDQUFQO0FBQS9CLE9BQ0EsS0FBSyxJQUFNQyxFQUFYLElBQWlCLEtBQUtYLE9BQXRCO0FBQStCLGVBQU8sS0FBS0EsT0FBTCxDQUFhVyxFQUFiLENBQVA7QUFBL0I7QUFDRDs7OytCQUVXdEcsWSxFQUFjO0FBQ3hCLFdBQUsrRixRQUFMLENBQWMsRUFBRS9GLDBCQUFGLEVBQWQ7QUFDRDs7O2dEQUVxRDtBQUFBLFVBQTdCdUcsV0FBNkIsUUFBN0JBLFdBQTZCO0FBQUEsVUFBaEJDLFlBQWdCLFFBQWhCQSxZQUFnQjs7QUFDcEQsV0FBS0MsbUJBQUwsR0FBMkIsRUFBRUYsd0JBQUYsRUFBZUMsMEJBQWYsRUFBM0I7QUFDQSxhQUFPLEtBQUtDLG1CQUFaO0FBQ0Q7OzttREFFdUQ7QUFBQSxVQUE3QkYsV0FBNkIsU0FBN0JBLFdBQTZCO0FBQUEsVUFBaEJDLFlBQWdCLFNBQWhCQSxZQUFnQjs7QUFDdEQsV0FBS0MsbUJBQUwsR0FBMkIsSUFBM0I7QUFDQSxhQUFPLEtBQUtBLG1CQUFaO0FBQ0Q7O0FBRUQ7Ozs7OzsyQ0FJd0I7QUFDdEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjMkIsT0FBZCxDQUFzQixVQUFDUyxLQUFELEVBQVc7QUFDL0JBLGNBQU0sQ0FBTixFQUFTQyxjQUFULENBQXdCRCxNQUFNLENBQU4sQ0FBeEIsRUFBa0NBLE1BQU0sQ0FBTixDQUFsQztBQUNELE9BRkQ7QUFHQSxXQUFLeEMsS0FBTCxDQUFXb0IsUUFBWCxHQUFzQixLQUF0Qjs7QUFFQSxXQUFLc0IsVUFBTCxDQUFnQkMsR0FBaEIsQ0FBb0IsZ0NBQXBCLEVBQXNELEtBQUsxQiwrQkFBM0Q7QUFDQSxXQUFLMkIsWUFBTCxDQUFrQkMsZUFBbEI7O0FBRUE7QUFDQTtBQUNEOzs7d0NBRW9CO0FBQUE7O0FBQ25CLFdBQUtoQixRQUFMLENBQWM7QUFDWlQsa0JBQVU7QUFERSxPQUFkOztBQUlBLFdBQUtTLFFBQUwsQ0FBYztBQUNackcsd0JBQWdCc0gsU0FBU0MsSUFBVCxDQUFjQyxXQUFkLEdBQTRCLEtBQUtoRCxLQUFMLENBQVd6RTtBQUQzQyxPQUFkOztBQUlBNEUsYUFBT2dCLGdCQUFQLENBQXdCLFFBQXhCLEVBQWtDLGlCQUFPTCxRQUFQLENBQWdCLFlBQU07QUFDdEQsWUFBSSxPQUFLZCxLQUFMLENBQVdvQixRQUFmLEVBQXlCO0FBQ3ZCLGlCQUFLUyxRQUFMLENBQWMsRUFBRXJHLGdCQUFnQnNILFNBQVNDLElBQVQsQ0FBY0MsV0FBZCxHQUE0QixPQUFLaEQsS0FBTCxDQUFXekUsZUFBekQsRUFBZDtBQUNEO0FBQ0YsT0FKaUMsRUFJL0IrRCxhQUorQixDQUFsQzs7QUFNQSxXQUFLMkQsa0JBQUwsQ0FBd0IsS0FBS2xELEtBQUwsQ0FBV1UsU0FBbkMsRUFBOEMsV0FBOUMsRUFBMkQsVUFBQ3lDLE9BQUQsRUFBYTtBQUN0RSxZQUFJQSxRQUFRM0MsTUFBUixLQUFtQixPQUFLUixLQUFMLENBQVdRLE1BQWxDLEVBQTBDLE9BQU8sS0FBTSxDQUFiO0FBQzFDLGdCQUFRMkMsUUFBUUMsSUFBaEI7QUFDRSxlQUFLLGtCQUFMO0FBQXlCLG1CQUFPLE9BQUs5QyxVQUFMLENBQWdCK0MsZ0JBQWhCLEVBQVA7QUFDekI7QUFBUyxtQkFBTyxLQUFNLENBQWI7QUFGWDtBQUlELE9BTkQ7O0FBUUEsV0FBS3JELEtBQUwsQ0FBV1UsU0FBWCxDQUFxQjRDLEVBQXJCLENBQXdCLFFBQXhCLEVBQWtDLFVBQUNDLE1BQUQsRUFBU0MsTUFBVCxFQUFpQnZCLEVBQWpCLEVBQXdCO0FBQ3hEd0IsZ0JBQVFDLElBQVIsQ0FBYSw0QkFBYixFQUEyQ0gsTUFBM0MsRUFBbURDLE1BQW5EO0FBQ0EsZUFBTyxPQUFLbEQsVUFBTCxDQUFnQnFELFVBQWhCLENBQTJCSixNQUEzQixFQUFtQ0MsTUFBbkMsRUFBMkN2QixFQUEzQyxDQUFQO0FBQ0QsT0FIRDs7QUFLQSxXQUFLM0IsVUFBTCxDQUFnQmdELEVBQWhCLENBQW1CLG1CQUFuQixFQUF3QyxVQUFDTSxpQkFBRCxFQUFvQkMsaUJBQXBCLEVBQXVDQyxpQkFBdkMsRUFBMERDLGtCQUExRCxFQUE4RUMsYUFBOUUsRUFBZ0c7QUFDdElQLGdCQUFRQyxJQUFSLENBQWEsOEJBQWIsRUFBNkNFLGlCQUE3QyxFQUFnRUMsaUJBQWhFLEVBQW1GQyxpQkFBbkYsRUFBc0dDLGtCQUF0RyxFQUEwSEMsYUFBMUg7O0FBRUE7QUFDQSxlQUFLMUQsVUFBTCxDQUFnQjJELFlBQWhCOztBQUVBLFlBQUk1RyxrQkFBa0IsT0FBS2lELFVBQUwsQ0FBZ0I0RCxrQkFBaEIsRUFBdEI7QUFDQSxZQUFJNUcscUJBQXFCLE9BQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCLEVBQXpCO0FBQ0EsbURBQTRCOUcsZUFBNUI7O0FBRUEsZUFBS3lFLFFBQUwsQ0FBYyxFQUFFekUsZ0NBQUYsRUFBbUJDLHNDQUFuQixFQUFkOztBQUVBLFlBQUkwRyxpQkFBaUJBLGNBQWNJLElBQWQsS0FBdUIsVUFBNUMsRUFBd0Q7QUFDdEQsY0FBSVIscUJBQXFCQyxpQkFBckIsSUFBMENFLGtCQUE5QyxFQUFrRTtBQUNoRUgsOEJBQWtCNUIsT0FBbEIsQ0FBMEIsVUFBQ00sV0FBRCxFQUFpQjtBQUN6QyxxQkFBSytCLHlCQUFMLENBQStCL0IsV0FBL0IsRUFBNEN1QixpQkFBNUMsRUFBK0RDLHFCQUFxQixDQUFwRixFQUF1RkMsa0JBQXZGO0FBQ0QsYUFGRDtBQUdEO0FBQ0Y7QUFDRixPQW5CRDs7QUFxQkEsV0FBS3pELFVBQUwsQ0FBZ0JnRCxFQUFoQixDQUFtQixrQkFBbkIsRUFBdUMsVUFBQ2hCLFdBQUQsRUFBaUI7QUFDdERtQixnQkFBUUMsSUFBUixDQUFhLDZCQUFiLEVBQTRDcEIsV0FBNUM7QUFDQSxlQUFLZ0MsbUJBQUwsQ0FBeUIsRUFBRWhDLHdCQUFGLEVBQXpCO0FBQ0QsT0FIRDs7QUFLQSxXQUFLaEMsVUFBTCxDQUFnQmdELEVBQWhCLENBQW1CLG9CQUFuQixFQUF5QyxVQUFDaEIsV0FBRCxFQUFpQjtBQUN4RG1CLGdCQUFRQyxJQUFSLENBQWEsK0JBQWIsRUFBOENwQixXQUE5QztBQUNBLGVBQUtpQyxxQkFBTCxDQUEyQixFQUFFakMsd0JBQUYsRUFBM0I7QUFDRCxPQUhEOztBQUtBLFdBQUtoQyxVQUFMLENBQWdCZ0QsRUFBaEIsQ0FBbUIsbUJBQW5CLEVBQXdDLFlBQU07QUFDNUMsWUFBSWpHLGtCQUFrQixPQUFLaUQsVUFBTCxDQUFnQjRELGtCQUFoQixFQUF0QjtBQUNBLFlBQUk1RyxxQkFBcUIsT0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFBekI7QUFDQVYsZ0JBQVFDLElBQVIsQ0FBYSw4QkFBYixFQUE2Q3JHLGVBQTdDO0FBQ0EsZUFBS21ILGlCQUFMLENBQXVCbkgsZUFBdkIsRUFBd0NDLGtCQUF4QztBQUNBO0FBQ0QsT0FORDs7QUFRQTtBQUNBLFdBQUtnRCxVQUFMLENBQWdCK0MsZ0JBQWhCOztBQUVBLFdBQUsvQyxVQUFMLENBQWdCZ0QsRUFBaEIsQ0FBbUIsdUJBQW5CLEVBQTRDLFVBQUNtQixNQUFELEVBQVk7QUFDdERBLGVBQU9uQixFQUFQLENBQVUsZ0NBQVYsRUFBNEMsT0FBS3BDLCtCQUFqRDs7QUFFQXdELG1CQUFXLFlBQU07QUFDZkQsaUJBQU9FLElBQVA7QUFDRCxTQUZEOztBQUlBLGVBQUtoQyxVQUFMLEdBQWtCOEIsTUFBbEI7QUFDRCxPQVJEOztBQVVBMUIsZUFBUzNCLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQUN3RCxVQUFELEVBQWdCO0FBQ2pEbkIsZ0JBQVFDLElBQVIsQ0FBYSx3QkFBYjtBQUNBLFlBQUltQixVQUFVRCxXQUFXRSxNQUFYLENBQWtCQyxPQUFsQixDQUEwQkMsV0FBMUIsRUFBZDtBQUNBLFlBQUlDLFdBQVdMLFdBQVdFLE1BQVgsQ0FBa0JJLFlBQWxCLENBQStCLGlCQUEvQixDQUFmLENBSGlELENBR2dCO0FBQ2pFLFlBQUlMLFlBQVksT0FBWixJQUF1QkEsWUFBWSxVQUFuQyxJQUFpREksUUFBckQsRUFBK0Q7QUFDN0R4QixrQkFBUUMsSUFBUixDQUFhLDhCQUFiO0FBQ0E7QUFDQTtBQUNELFNBSkQsTUFJTztBQUNMO0FBQ0E7QUFDQUQsa0JBQVFDLElBQVIsQ0FBYSx3Q0FBYjtBQUNBa0IscUJBQVdPLGNBQVg7QUFDQSxpQkFBS25GLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQjBFLElBQXJCLENBQTBCO0FBQ3hCQyxrQkFBTSxXQURrQjtBQUV4QmpDLGtCQUFNLGlDQUZrQjtBQUd4QmdCLGtCQUFNLE9BSGtCO0FBSXhCa0Isa0JBQU0sSUFKa0IsQ0FJYjtBQUphLFdBQTFCO0FBTUQ7QUFDRixPQXBCRDs7QUFzQkF2QyxlQUFTQyxJQUFULENBQWM1QixnQkFBZCxDQUErQixTQUEvQixFQUEwQyxLQUFLbUUsYUFBTCxDQUFtQnZFLElBQW5CLENBQXdCLElBQXhCLENBQTFDLEVBQXlFLEtBQXpFOztBQUVBK0IsZUFBU0MsSUFBVCxDQUFjNUIsZ0JBQWQsQ0FBK0IsT0FBL0IsRUFBd0MsS0FBS29FLFdBQUwsQ0FBaUJ4RSxJQUFqQixDQUFzQixJQUF0QixDQUF4Qzs7QUFFQSxXQUFLa0Msa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLGdCQUF0QyxFQUF3RCxVQUFDbUMsV0FBRCxFQUFjbUQsWUFBZCxFQUE0QkMsV0FBNUIsRUFBeUNuRCxZQUF6QyxFQUF1RG9ELE9BQXZELEVBQW1FO0FBQ3pILFlBQUlDLFlBQVksT0FBS0MsWUFBTCxFQUFoQjtBQUNBLFlBQUlDLGVBQWUseUNBQTBCSCxPQUExQixFQUFtQ0MsVUFBVUcsSUFBN0MsQ0FBbkI7QUFDQSxZQUFJQyxVQUFVQyxLQUFLQyxLQUFMLENBQVdKLGVBQWVGLFVBQVVHLElBQXBDLENBQWQ7QUFDQSxlQUFLSSxtQ0FBTCxDQUF5QzdELFdBQXpDLEVBQXNEbUQsWUFBdEQsRUFBb0VDLFdBQXBFLEVBQWlGbkQsWUFBakYsRUFBK0Z5RCxPQUEvRixDQUFzRyxtQ0FBdEc7QUFDRCxPQUxEO0FBTUEsV0FBSzlDLGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxjQUF0QyxFQUFzRCxVQUFDbUMsV0FBRCxFQUFjbUQsWUFBZCxFQUE0QkMsV0FBNUIsRUFBeUNuRCxZQUF6QyxFQUF1RG9ELE9BQXZELEVBQW1FO0FBQ3ZILFlBQUlDLFlBQVksT0FBS0MsWUFBTCxFQUFoQjtBQUNBLFlBQUlDLGVBQWUseUNBQTBCSCxPQUExQixFQUFtQ0MsVUFBVUcsSUFBN0MsQ0FBbkI7QUFDQSxZQUFJQyxVQUFVQyxLQUFLQyxLQUFMLENBQVdKLGVBQWVGLFVBQVVHLElBQXBDLENBQWQ7QUFDQSxlQUFLSyxpQ0FBTCxDQUF1QzlELFdBQXZDLEVBQW9EbUQsWUFBcEQsRUFBa0VDLFdBQWxFLEVBQStFbkQsWUFBL0UsRUFBNkZ5RCxPQUE3RjtBQUNELE9BTEQ7QUFNQSxXQUFLOUMsa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLGVBQXRDLEVBQXVELFVBQUNtQyxXQUFELEVBQWNtRCxZQUFkLEVBQTRCQyxXQUE1QixFQUF5Q25ELFlBQXpDLEVBQXVEb0QsT0FBdkQsRUFBZ0VVLEtBQWhFLEVBQXVFQyxTQUF2RSxFQUFxRjtBQUMxSSxlQUFLM0QsVUFBTCxDQUFnQmdDLElBQWhCO0FBQ0EsZUFBSzRCLGtDQUFMLENBQXdDakUsV0FBeEMsRUFBcURtRCxZQUFyRCxFQUFtRUMsV0FBbkUsRUFBZ0ZuRCxZQUFoRixFQUE4Rm9ELE9BQTlGLEVBQXVHVSxLQUF2RyxFQUE4R0MsU0FBOUc7QUFDRCxPQUhEO0FBSUEsV0FBS3BELGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxnQkFBdEMsRUFBd0QsVUFBQ21DLFdBQUQsRUFBY21ELFlBQWQsRUFBNEJsRCxZQUE1QixFQUEwQ29ELE9BQTFDLEVBQXNEO0FBQzVHLGVBQUthLG1DQUFMLENBQXlDbEUsV0FBekMsRUFBc0RtRCxZQUF0RCxFQUFvRWxELFlBQXBFLEVBQWtGb0QsT0FBbEY7QUFDRCxPQUZEO0FBR0EsV0FBS3pDLGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxvQkFBdEMsRUFBNEQsVUFBQ21DLFdBQUQsRUFBY21ELFlBQWQsRUFBNEJsRCxZQUE1QixFQUEwQ29ELE9BQTFDLEVBQW1EVyxTQUFuRCxFQUFpRTtBQUMzSCxlQUFLRyx1Q0FBTCxDQUE2Q25FLFdBQTdDLEVBQTBEbUQsWUFBMUQsRUFBd0VsRCxZQUF4RSxFQUFzRm9ELE9BQXRGLEVBQStGVyxTQUEvRjtBQUNELE9BRkQ7QUFHQSxXQUFLcEQsa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLHNCQUF0QyxFQUE4RCxVQUFDbUMsV0FBRCxFQUFjbUQsWUFBZCxFQUE0QmxELFlBQTVCLEVBQTBDbUUsTUFBMUMsRUFBa0RDLGFBQWxELEVBQWlFaEIsT0FBakUsRUFBMEVVLEtBQTFFLEVBQW9GO0FBQ2hKLGVBQUtPLHlDQUFMLENBQStDdEUsV0FBL0MsRUFBNERtRCxZQUE1RCxFQUEwRWxELFlBQTFFLEVBQXdGbUUsTUFBeEYsRUFBZ0dDLGFBQWhHLEVBQStHaEIsT0FBL0csRUFBd0hVLEtBQXhIO0FBQ0QsT0FGRDs7QUFJQSxXQUFLbkQsa0JBQUwsQ0FBd0IsS0FBSzVDLFVBQUwsQ0FBZ0J1RyxVQUF4QyxFQUFvRCxxQkFBcEQsRUFBMkUsVUFBQzlLLFlBQUQsRUFBa0I7QUFDM0YsWUFBSTZKLFlBQVksT0FBS0MsWUFBTCxFQUFoQjtBQUNBLGVBQUtpQixVQUFMLENBQWdCL0ssWUFBaEI7QUFDQTtBQUNBO0FBQ0EsWUFBSUEsZUFBZTZKLFVBQVVtQixNQUE3QixFQUFxQztBQUNuQyxpQkFBS3pHLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUNDLFlBQXJDLENBQWtEckIsVUFBVW1CLE1BQTVEO0FBQ0EsaUJBQUtqRixRQUFMLENBQWMsRUFBQ3pGLGlCQUFpQixLQUFsQixFQUFkO0FBQ0Q7QUFDRDtBQUNBO0FBQ0EsWUFBSU4sZ0JBQWdCNkosVUFBVXNCLElBQTFCLElBQWtDbkwsZUFBZTZKLFVBQVV1QixJQUEvRCxFQUFxRTtBQUNuRSxpQkFBS0MsdUNBQUwsQ0FBNkN4QixTQUE3QztBQUNEO0FBQ0YsT0FkRDs7QUFnQkEsV0FBSzFDLGtCQUFMLENBQXdCLEtBQUs1QyxVQUFMLENBQWdCdUcsVUFBeEMsRUFBb0Qsd0NBQXBELEVBQThGLFVBQUM5SyxZQUFELEVBQWtCO0FBQzlHLFlBQUk2SixZQUFZLE9BQUtDLFlBQUwsRUFBaEI7QUFDQSxlQUFLaUIsVUFBTCxDQUFnQi9LLFlBQWhCO0FBQ0E7QUFDQTtBQUNBLFlBQUlBLGdCQUFnQjZKLFVBQVVzQixJQUExQixJQUFrQ25MLGVBQWU2SixVQUFVdUIsSUFBL0QsRUFBcUU7QUFDbkUsaUJBQUtDLHVDQUFMLENBQTZDeEIsU0FBN0M7QUFDRDtBQUNGLE9BUkQ7QUFTRDs7OzJEQUV1RDtBQUFBLFVBQXJCeUIsUUFBcUIsU0FBckJBLFFBQXFCO0FBQUEsVUFBWEMsT0FBVyxTQUFYQSxPQUFXOztBQUN0RCxVQUFJQSxZQUFZLFVBQWhCLEVBQTRCO0FBQUU7QUFBUTs7QUFFdEMsVUFBSTtBQUNGO0FBQ0EsWUFBSUMsVUFBVXhFLFNBQVN5RSxhQUFULENBQXVCSCxRQUF2QixDQUFkOztBQUZFLG9DQUdrQkUsUUFBUUUscUJBQVIsRUFIbEI7QUFBQSxZQUdJQyxHQUhKLHlCQUdJQSxHQUhKO0FBQUEsWUFHU0MsSUFIVCx5QkFHU0EsSUFIVDs7QUFLRixhQUFLaEYsVUFBTCxDQUFnQmlGLHlCQUFoQixDQUEwQyxVQUExQyxFQUFzRCxFQUFFRixRQUFGLEVBQU9DLFVBQVAsRUFBdEQ7QUFDRCxPQU5ELENBTUUsT0FBT0UsS0FBUCxFQUFjO0FBQ2RwRSxnQkFBUW9FLEtBQVIscUJBQWdDUixRQUFoQyxvQkFBdURDLE9BQXZEO0FBQ0Q7QUFDRjs7O2tDQUVjUSxXLEVBQWE7QUFDMUI7QUFDQSxVQUFJLEtBQUtDLElBQUwsQ0FBVUMsZUFBVixDQUEwQkMsOEJBQTFCLENBQXlESCxXQUF6RCxDQUFKLEVBQTJFO0FBQ3pFLGVBQU8sS0FBTSxDQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJQSxZQUFZSSxPQUFaLEtBQXdCLEVBQXhCLElBQThCLENBQUNuRixTQUFTeUUsYUFBVCxDQUF1QixhQUF2QixDQUFuQyxFQUEwRTtBQUN4RSxhQUFLVyxjQUFMO0FBQ0FMLG9CQUFZM0MsY0FBWjtBQUNBLGVBQU8sS0FBTSxDQUFiO0FBQ0Q7O0FBRUQsY0FBUTJDLFlBQVlNLEtBQXBCO0FBQ0U7QUFDQTtBQUNBLGFBQUssRUFBTDtBQUFTO0FBQ1AsY0FBSSxLQUFLbkksS0FBTCxDQUFXekQsZ0JBQWYsRUFBaUM7QUFDL0IsZ0JBQUksS0FBS3lELEtBQUwsQ0FBVzFELGNBQWYsRUFBK0I7QUFDN0IsbUJBQUt1RixRQUFMLENBQWMsRUFBRWhHLG1CQUFtQixDQUFDLENBQUQsRUFBSSxLQUFLbUUsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBSixDQUFyQixFQUEyRGMsc0JBQXNCLEtBQWpGLEVBQWQ7QUFDQSxxQkFBTyxLQUFLa0ssVUFBTCxDQUFnQixDQUFoQixDQUFQO0FBQ0QsYUFIRCxNQUdPO0FBQ0wscUJBQU8sS0FBS3VCLHNCQUFMLENBQTRCLENBQUMsQ0FBN0IsQ0FBUDtBQUNEO0FBQ0YsV0FQRCxNQU9PO0FBQ0wsZ0JBQUksS0FBS3BJLEtBQUwsQ0FBV3JELG9CQUFYLElBQW1DLEtBQUtxRCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixNQUFvQyxDQUEzRSxFQUE4RTtBQUM1RSxtQkFBS2dHLFFBQUwsQ0FBYyxFQUFFbEYsc0JBQXNCLEtBQXhCLEVBQWQ7QUFDRDtBQUNELG1CQUFPLEtBQUswTCx1QkFBTCxDQUE2QixDQUFDLENBQTlCLENBQVA7QUFDRDs7QUFFSCxhQUFLLEVBQUw7QUFBUztBQUNQLGNBQUksS0FBS3JJLEtBQUwsQ0FBV3pELGdCQUFmLEVBQWlDO0FBQy9CLG1CQUFPLEtBQUs2TCxzQkFBTCxDQUE0QixDQUE1QixDQUFQO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUksQ0FBQyxLQUFLcEksS0FBTCxDQUFXckQsb0JBQWhCLEVBQXNDLEtBQUtrRixRQUFMLENBQWMsRUFBRWxGLHNCQUFzQixJQUF4QixFQUFkO0FBQ3RDLG1CQUFPLEtBQUswTCx1QkFBTCxDQUE2QixDQUE3QixDQUFQO0FBQ0Q7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUtDLG1CQUFMLENBQXlCLEVBQUVoTSxnQkFBZ0IsSUFBbEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUtnTSxtQkFBTCxDQUF5QixFQUFFOUwsa0JBQWtCLElBQXBCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLOEwsbUJBQUwsQ0FBeUIsRUFBRTdMLGNBQWMsSUFBaEIsRUFBekIsQ0FBUDtBQUNULGFBQUssR0FBTDtBQUFVLGlCQUFPLEtBQUs2TCxtQkFBTCxDQUF5QixFQUFFL0wsa0JBQWtCLElBQXBCLEVBQXpCLENBQVA7QUFDVixhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLK0wsbUJBQUwsQ0FBeUIsRUFBRS9MLGtCQUFrQixJQUFwQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSytMLG1CQUFMLENBQXlCLEVBQUUvTCxrQkFBa0IsSUFBcEIsRUFBekIsQ0FBUDtBQXBDWDtBQXNDRDs7O2dDQUVZc0wsVyxFQUFhO0FBQ3hCLGNBQVFBLFlBQVlNLEtBQXBCO0FBQ0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBS0csbUJBQUwsQ0FBeUIsRUFBRWhNLGdCQUFnQixLQUFsQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBS2dNLG1CQUFMLENBQXlCLEVBQUU5TCxrQkFBa0IsS0FBcEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUs4TCxtQkFBTCxDQUF5QixFQUFFN0wsY0FBYyxLQUFoQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxHQUFMO0FBQVUsaUJBQU8sS0FBSzZMLG1CQUFMLENBQXlCLEVBQUUvTCxrQkFBa0IsS0FBcEIsRUFBekIsQ0FBUDtBQUNWLGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUsrTCxtQkFBTCxDQUF5QixFQUFFL0wsa0JBQWtCLEtBQXBCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLK0wsbUJBQUwsQ0FBeUIsRUFBRS9MLGtCQUFrQixLQUFwQixFQUF6QixDQUFQO0FBZlg7QUFpQkQ7Ozt3Q0FFb0JnRixPLEVBQVM7QUFDNUI7QUFDQTtBQUNBLFVBQUksQ0FBQyxLQUFLdkIsS0FBTCxDQUFXL0MsWUFBaEIsRUFBOEI7QUFDNUIsZUFBTyxLQUFLNEUsUUFBTCxDQUFjTixPQUFkLENBQVA7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLLElBQUlDLEdBQVQsSUFBZ0JELE9BQWhCLEVBQXlCO0FBQ3ZCLGVBQUt2QixLQUFMLENBQVd3QixHQUFYLElBQWtCRCxRQUFRQyxHQUFSLENBQWxCO0FBQ0Q7QUFDRjtBQUNGOzs7dUNBRW1CK0csWSxFQUFjQyxTLEVBQVdDLFksRUFBYztBQUN6RCxXQUFLckksUUFBTCxDQUFjNkIsSUFBZCxDQUFtQixDQUFDc0csWUFBRCxFQUFlQyxTQUFmLEVBQTBCQyxZQUExQixDQUFuQjtBQUNBRixtQkFBYWxGLEVBQWIsQ0FBZ0JtRixTQUFoQixFQUEyQkMsWUFBM0I7QUFDRDs7QUFFRDs7Ozs7O2lDQUljakosSSxFQUFNO0FBQ2xCQSxXQUFLa0osWUFBTCxHQUFvQixLQUFwQjtBQUNBLFVBQUk5TCxnQkFBZ0IsaUJBQU8rTCxLQUFQLENBQWEsS0FBSzNJLEtBQUwsQ0FBV3BELGFBQXhCLENBQXBCO0FBQ0FBLG9CQUFjNEMsS0FBS29KLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBZCxJQUE2QyxLQUE3QztBQUNBLFdBQUsvRyxRQUFMLENBQWM7QUFDWjdFLHVCQUFlLElBREgsRUFDUztBQUNyQkMsc0JBQWMsSUFGRixFQUVRO0FBQ3BCTCx1QkFBZUEsYUFISDtBQUlaaU0sb0JBQVlDLEtBQUtDLEdBQUw7QUFKQSxPQUFkO0FBTUQ7OzsrQkFFV3ZKLEksRUFBTTtBQUNoQkEsV0FBS2tKLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxVQUFJOUwsZ0JBQWdCLGlCQUFPK0wsS0FBUCxDQUFhLEtBQUszSSxLQUFMLENBQVdwRCxhQUF4QixDQUFwQjtBQUNBQSxvQkFBYzRDLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQWQsSUFBNkMsSUFBN0M7QUFDQSxXQUFLL0csUUFBTCxDQUFjO0FBQ1o3RSx1QkFBZSxJQURILEVBQ1M7QUFDckJDLHNCQUFjLElBRkYsRUFFUTtBQUNwQkwsdUJBQWVBLGFBSEg7QUFJWmlNLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOzs7a0NBRWM7QUFDYixVQUFJLEtBQUtqQixJQUFMLENBQVVrQixVQUFkLEVBQTBCO0FBQ3hCLGFBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCQyxTQUFyQixHQUFpQyxDQUFqQztBQUNEO0FBQ0Y7OztpQ0FFYXpKLEksRUFBTTtBQUNsQixVQUFJMEosV0FBVyxLQUFLbEosS0FBTCxDQUFXbUosaUJBQVgsSUFBZ0MsRUFBL0M7QUFDQSxVQUFJQyxhQUFhLElBQWpCO0FBQ0EsVUFBSUMsZUFBZSxDQUFuQjtBQUNBSCxlQUFTbkgsT0FBVCxDQUFpQixVQUFDdUgsT0FBRCxFQUFVQyxLQUFWLEVBQW9CO0FBQ25DLFlBQUlELFFBQVFFLFNBQVosRUFBdUI7QUFDckJIO0FBQ0QsU0FGRCxNQUVPLElBQUlDLFFBQVFHLFVBQVosRUFBd0I7QUFDN0IsY0FBSUgsUUFBUTlKLElBQVIsSUFBZ0I4SixRQUFROUosSUFBUixDQUFha0ssWUFBakMsRUFBK0M7QUFDN0NMO0FBQ0Q7QUFDRjtBQUNELFlBQUlELGVBQWUsSUFBbkIsRUFBeUI7QUFDdkIsY0FBSUUsUUFBUTlKLElBQVIsSUFBZ0I4SixRQUFROUosSUFBUixLQUFpQkEsSUFBckMsRUFBMkM7QUFDekM0Six5QkFBYUMsWUFBYjtBQUNEO0FBQ0Y7QUFDRixPQWJEO0FBY0EsVUFBSUQsZUFBZSxJQUFuQixFQUF5QjtBQUN2QixZQUFJLEtBQUt0QixJQUFMLENBQVVrQixVQUFkLEVBQTBCO0FBQ3hCLGVBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCQyxTQUFyQixHQUFrQ0csYUFBYSxLQUFLcEosS0FBTCxDQUFXdkUsU0FBekIsR0FBc0MsS0FBS3VFLEtBQUwsQ0FBV3ZFLFNBQWxGO0FBQ0Q7QUFDRjtBQUNGOzs7dUNBRW1Ca08sTyxFQUFTO0FBQzNCLFVBQUlDLFNBQVMsQ0FBYjtBQUNBLFVBQUlELFFBQVFFLFlBQVosRUFBMEI7QUFDeEIsV0FBRztBQUNERCxvQkFBVUQsUUFBUUcsU0FBbEI7QUFDRCxTQUZELFFBRVNILFVBQVVBLFFBQVFFLFlBRjNCLEVBRHdCLENBR2lCO0FBQzFDO0FBQ0QsYUFBT0QsTUFBUDtBQUNEOzs7aUNBRWFwSyxJLEVBQU07QUFDbEJBLFdBQUtrSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0FuSyxZQUFNQyxJQUFOLEVBQVksVUFBQ0ssS0FBRCxFQUFXO0FBQ3JCQSxjQUFNNkosWUFBTixHQUFxQixLQUFyQjtBQUNBN0osY0FBTTZJLFlBQU4sR0FBcUIsS0FBckI7QUFDRCxPQUhEO0FBSUEsVUFBSTdMLGdCQUFnQixLQUFLbUQsS0FBTCxDQUFXbkQsYUFBL0I7QUFDQSxVQUFJd0YsY0FBYzdDLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQWxCO0FBQ0EvTCxvQkFBY3dGLFdBQWQsSUFBNkIsS0FBN0I7QUFDQSxXQUFLUixRQUFMLENBQWM7QUFDWjdFLHVCQUFlLElBREgsRUFDUztBQUNyQkMsc0JBQWMsSUFGRixFQUVRO0FBQ3BCSix1QkFBZUEsYUFISDtBQUlaZ00sb0JBQVlDLEtBQUtDLEdBQUw7QUFKQSxPQUFkO0FBTUQ7OzsrQkFFV3ZKLEksRUFBTTZDLFcsRUFBYTtBQUM3QjdDLFdBQUtrSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0EsVUFBSWxLLEtBQUt1SyxNQUFULEVBQWlCLEtBQUtDLFVBQUwsQ0FBZ0J4SyxLQUFLdUssTUFBckIsRUFGWSxDQUVpQjtBQUM5QyxVQUFJbE4sZ0JBQWdCLEtBQUttRCxLQUFMLENBQVduRCxhQUEvQjtBQUNBd0Ysb0JBQWM3QyxLQUFLb0osVUFBTCxDQUFnQixVQUFoQixDQUFkO0FBQ0EvTCxvQkFBY3dGLFdBQWQsSUFBNkIsSUFBN0I7QUFDQSxXQUFLUixRQUFMLENBQWM7QUFDWjdFLHVCQUFlLElBREgsRUFDUztBQUNyQkMsc0JBQWMsSUFGRixFQUVRO0FBQ3BCSix1QkFBZUEsYUFISDtBQUlaZ00sb0JBQVlDLEtBQUtDLEdBQUw7QUFKQSxPQUFkO0FBTUQ7OztnQ0FFWWtCLEcsRUFBSztBQUNoQixVQUFJQSxJQUFJQyxRQUFSLEVBQWtCO0FBQ2hCLGFBQUtsSyxLQUFMLENBQVdsRCxhQUFYLENBQXlCbU4sSUFBSTVILFdBQUosR0FBa0IsR0FBbEIsR0FBd0I0SCxJQUFJQyxRQUFKLENBQWEvRyxJQUE5RCxJQUFzRSxJQUF0RTtBQUNEO0FBQ0Y7OztrQ0FFYzhHLEcsRUFBSztBQUNsQixVQUFJQSxJQUFJQyxRQUFSLEVBQWtCO0FBQ2hCLGFBQUtsSyxLQUFMLENBQVdsRCxhQUFYLENBQXlCbU4sSUFBSTVILFdBQUosR0FBa0IsR0FBbEIsR0FBd0I0SCxJQUFJQyxRQUFKLENBQWEvRyxJQUE5RCxJQUFzRSxLQUF0RTtBQUNEO0FBQ0Y7OzttQ0FFZThHLEcsRUFBSztBQUNuQixVQUFJQSxJQUFJQyxRQUFSLEVBQWtCO0FBQ2hCLGVBQU8sS0FBS2xLLEtBQUwsQ0FBV2xELGFBQVgsQ0FBeUJtTixJQUFJNUgsV0FBSixHQUFrQixHQUFsQixHQUF3QjRILElBQUlDLFFBQUosQ0FBYS9HLElBQTlELENBQVA7QUFDRDtBQUNGOzs7dUNBRW1CZ0gsSSxFQUFNO0FBQ3hCLGFBQU8sS0FBUCxDQUR3QixDQUNYO0FBQ2Q7Ozs0Q0FFd0I7QUFDdkIsVUFBSSxLQUFLbkssS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUFuQyxFQUE2QztBQUMzQyxhQUFLMkYsUUFBTCxDQUFjO0FBQ1o3RSx5QkFBZSxJQURIO0FBRVpDLHdCQUFjLElBRkY7QUFHWmYsMkJBQWlCO0FBSEwsU0FBZDtBQUtELE9BTkQsTUFNTztBQUNMLGFBQUsyRixRQUFMLENBQWM7QUFDWjdFLHlCQUFlLElBREg7QUFFWkMsd0JBQWMsSUFGRjtBQUdaZiwyQkFBaUI7QUFITCxTQUFkO0FBS0Q7QUFDRjs7OzJDQUV1QmtPLEssRUFBT3pFLFMsRUFBVztBQUN4QyxVQUFJMEUsWUFBWSxLQUFLckssS0FBTCxDQUFXc0ssaUJBQTNCO0FBQ0EsVUFBSUMsZ0JBQWdCLEtBQUt2SyxLQUFMLENBQVd1SyxhQUEvQjtBQUNBLFVBQUlDLFlBQVlKLFFBQVFDLFNBQXhCO0FBQ0EsVUFBSUksYUFBYXpFLEtBQUtDLEtBQUwsQ0FBV3VFLFlBQVk3RSxVQUFVK0UsSUFBakMsQ0FBakI7QUFDQSxVQUFJNU8sZUFBZXlPLGdCQUFnQkUsVUFBbkM7QUFDQSxVQUFJM08sZUFBZTZKLFVBQVV1QixJQUE3QixFQUFtQ3BMLGVBQWU2SixVQUFVdUIsSUFBekI7QUFDbkMsVUFBSXBMLGVBQWU2SixVQUFVc0IsSUFBN0IsRUFBbUNuTCxlQUFlNkosVUFBVXNCLElBQXpCO0FBQ25DLFdBQUs1RyxVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDNEQsSUFBckMsQ0FBMEM3TyxZQUExQztBQUNEOzs7bURBRStCc08sSyxFQUFPekUsUyxFQUFXO0FBQUE7O0FBQ2hELFVBQUkwRSxZQUFZLEtBQUtySyxLQUFMLENBQVc0SyxpQkFBM0I7QUFDQSxVQUFJSixZQUFZSixRQUFRQyxTQUF4QjtBQUNBLFVBQUlJLGFBQWF6RSxLQUFLQyxLQUFMLENBQVd1RSxZQUFZN0UsVUFBVStFLElBQWpDLENBQWpCO0FBQ0EsVUFBSUYsWUFBWSxDQUFaLElBQWlCLEtBQUt4SyxLQUFMLENBQVdoRSxZQUFYLElBQTJCLENBQWhELEVBQW1EO0FBQ2pELFlBQUksQ0FBQyxLQUFLZ0UsS0FBTCxDQUFXNkssV0FBaEIsRUFBNkI7QUFDM0IsY0FBSUEsY0FBY0MsWUFBWSxZQUFNO0FBQ2xDLGdCQUFJQyxhQUFhLE9BQUsvSyxLQUFMLENBQVdqRSxRQUFYLEdBQXNCLE9BQUtpRSxLQUFMLENBQVdqRSxRQUFqQyxHQUE0QzRKLFVBQVVxRixPQUF2RTtBQUNBLG1CQUFLbkosUUFBTCxDQUFjLEVBQUM5RixVQUFVZ1AsYUFBYSxFQUF4QixFQUFkO0FBQ0QsV0FIaUIsRUFHZixHQUhlLENBQWxCO0FBSUEsZUFBS2xKLFFBQUwsQ0FBYyxFQUFDZ0osYUFBYUEsV0FBZCxFQUFkO0FBQ0Q7QUFDRCxhQUFLaEosUUFBTCxDQUFjLEVBQUNvSixjQUFjLElBQWYsRUFBZDtBQUNBO0FBQ0Q7QUFDRCxVQUFJLEtBQUtqTCxLQUFMLENBQVc2SyxXQUFmLEVBQTRCSyxjQUFjLEtBQUtsTCxLQUFMLENBQVc2SyxXQUF6QjtBQUM1QjtBQUNBLFVBQUlsRixVQUFVc0IsSUFBVixHQUFpQndELFVBQWpCLElBQStCOUUsVUFBVW1CLE1BQXpDLElBQW1ELENBQUMyRCxVQUFELElBQWU5RSxVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVV1QixJQUFqRyxFQUF1RztBQUNyR3VELHFCQUFhLEtBQUt6SyxLQUFMLENBQVdoRSxZQUF4QixDQURxRyxDQUNoRTtBQUNyQyxlQUZxRyxDQUVoRTtBQUN0QztBQUNELFdBQUs2RixRQUFMLENBQWMsRUFBRTdGLGNBQWN5TyxVQUFoQixFQUE0QlEsY0FBYyxLQUExQyxFQUFpREosYUFBYSxJQUE5RCxFQUFkO0FBQ0Q7Ozs0Q0FFd0JNLEUsRUFBSUMsRSxFQUFJekYsUyxFQUFXO0FBQzFDLFVBQUkwRixPQUFPLElBQVg7QUFDQSxVQUFJQyxPQUFPLElBQVg7O0FBRUEsVUFBSSxLQUFLdEwsS0FBTCxDQUFXdUwscUJBQWYsRUFBc0M7QUFDcENGLGVBQU9GLEVBQVA7QUFDRCxPQUZELE1BRU8sSUFBSSxLQUFLbkwsS0FBTCxDQUFXd0wsc0JBQWYsRUFBdUM7QUFDNUNGLGVBQU9GLEVBQVA7QUFDRCxPQUZNLE1BRUEsSUFBSSxLQUFLcEwsS0FBTCxDQUFXeUwscUJBQWYsRUFBc0M7QUFDM0MsWUFBTUMsVUFBVyxLQUFLMUwsS0FBTCxDQUFXMkwsY0FBWCxHQUE0QmhHLFVBQVUrRSxJQUF2QyxHQUErQy9FLFVBQVVpRyxPQUF6RTtBQUNBLFlBQU1DLFVBQVcsS0FBSzdMLEtBQUwsQ0FBVzhMLFlBQVgsR0FBMEJuRyxVQUFVK0UsSUFBckMsR0FBNkMvRSxVQUFVaUcsT0FBdkU7QUFDQSxZQUFNRyxRQUFRWixLQUFLLEtBQUtuTCxLQUFMLENBQVd5TCxxQkFBOUI7QUFDQUosZUFBT0ssVUFBVUssS0FBakI7QUFDQVQsZUFBT08sVUFBVUUsS0FBakI7QUFDRDs7QUFFRCxVQUFJQyxLQUFNWCxTQUFTLElBQVYsR0FBa0JyRixLQUFLQyxLQUFMLENBQVlvRixPQUFPMUYsVUFBVWlHLE9BQWxCLEdBQTZCakcsVUFBVStFLElBQWxELENBQWxCLEdBQTRFLEtBQUsxSyxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUFyRjtBQUNBLFVBQUlvUSxLQUFNWCxTQUFTLElBQVYsR0FBa0J0RixLQUFLQyxLQUFMLENBQVlxRixPQUFPM0YsVUFBVWlHLE9BQWxCLEdBQTZCakcsVUFBVStFLElBQWxELENBQWxCLEdBQTRFLEtBQUsxSyxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUFyRjs7QUFFQTtBQUNBLFVBQUltUSxNQUFNckcsVUFBVXVHLElBQXBCLEVBQTBCO0FBQ3hCRixhQUFLckcsVUFBVXVHLElBQWY7QUFDQSxZQUFJLENBQUMsS0FBS2xNLEtBQUwsQ0FBV3dMLHNCQUFaLElBQXNDLENBQUMsS0FBS3hMLEtBQUwsQ0FBV3VMLHFCQUF0RCxFQUE2RTtBQUMzRVUsZUFBSyxLQUFLak0sS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsS0FBbUMsS0FBS21FLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLElBQWtDbVEsRUFBckUsQ0FBTDtBQUNEO0FBQ0Y7O0FBRUQ7QUFDQSxVQUFJQyxNQUFNdEcsVUFBVXFGLE9BQXBCLEVBQTZCO0FBQzNCZ0IsYUFBSyxLQUFLaE0sS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBTDtBQUNBLFlBQUksQ0FBQyxLQUFLbUUsS0FBTCxDQUFXd0wsc0JBQVosSUFBc0MsQ0FBQyxLQUFLeEwsS0FBTCxDQUFXdUwscUJBQXRELEVBQTZFO0FBQzNFVSxlQUFLdEcsVUFBVXFGLE9BQWY7QUFDRDtBQUNGOztBQUVELFdBQUtuSixRQUFMLENBQWMsRUFBRWhHLG1CQUFtQixDQUFDbVEsRUFBRCxFQUFLQyxFQUFMLENBQXJCLEVBQWQ7QUFDRDs7OzRDQUV3QkUsSyxFQUFPO0FBQzlCLFVBQUlDLElBQUksS0FBS3BNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLElBQWtDc1EsS0FBMUM7QUFDQSxVQUFJRSxJQUFJLEtBQUtyTSxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixJQUFrQ3NRLEtBQTFDO0FBQ0EsVUFBSUMsS0FBSyxDQUFULEVBQVk7QUFDVixhQUFLdkssUUFBTCxDQUFjLEVBQUVoRyxtQkFBbUIsQ0FBQ3VRLENBQUQsRUFBSUMsQ0FBSixDQUFyQixFQUFkO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs0REFDeUMxRyxTLEVBQVc7QUFDbEQsVUFBSXlHLElBQUksS0FBS3BNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQVI7QUFDQSxVQUFJd1EsSUFBSSxLQUFLck0sS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBUjtBQUNBLFVBQUl5USxPQUFPRCxJQUFJRCxDQUFmO0FBQ0EsVUFBSUcsT0FBTyxLQUFLdk0sS0FBTCxDQUFXbEUsWUFBdEI7QUFDQSxVQUFJMFEsT0FBT0QsT0FBT0QsSUFBbEI7O0FBRUEsVUFBSUUsT0FBTzdHLFVBQVVtQixNQUFyQixFQUE2QjtBQUMzQnlGLGdCQUFTQyxPQUFPN0csVUFBVW1CLE1BQTFCO0FBQ0EwRixlQUFPN0csVUFBVW1CLE1BQWpCO0FBQ0Q7O0FBRUQsV0FBS2pGLFFBQUwsQ0FBYyxFQUFFaEcsbUJBQW1CLENBQUMwUSxJQUFELEVBQU9DLElBQVAsQ0FBckIsRUFBZDtBQUNEOzs7MkNBRXVCTCxLLEVBQU87QUFDN0IsVUFBSXJRLGVBQWUsS0FBS2tFLEtBQUwsQ0FBV2xFLFlBQVgsR0FBMEJxUSxLQUE3QztBQUNBLFVBQUlyUSxnQkFBZ0IsQ0FBcEIsRUFBdUJBLGVBQWUsQ0FBZjtBQUN2QixXQUFLdUUsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzRELElBQXJDLENBQTBDN08sWUFBMUM7QUFDRDs7O3dEQUVvQ3VHLFcsRUFBYW1ELFksRUFBY0MsVyxFQUFhbkQsWSxFQUFjb0QsTyxFQUFTK0csVSxFQUFZQyxVLEVBQVl0RyxLLEVBQU91RyxRLEVBQVU7QUFDM0k7QUFDQSx3QkFBZ0JDLGNBQWhCLENBQStCLEtBQUs1TSxLQUFMLENBQVc1QyxlQUExQyxFQUEyRGlGLFdBQTNELEVBQXdFbUQsWUFBeEUsRUFBc0ZDLFdBQXRGLEVBQW1HbkQsWUFBbkcsRUFBaUhvRCxPQUFqSCxFQUEwSCtHLFVBQTFILEVBQXNJQyxVQUF0SSxFQUFrSnRHLEtBQWxKLEVBQXlKdUcsUUFBekosRUFBbUssS0FBS3RNLFVBQUwsQ0FBZ0J3TSx1QkFBaEIsR0FBMENDLEdBQTFDLENBQThDLGNBQTlDLENBQW5LLEVBQWtPLEtBQUt6TSxVQUFMLENBQWdCd00sdUJBQWhCLEdBQTBDQyxHQUExQyxDQUE4QyxRQUE5QyxDQUFsTztBQUNBLGlEQUE0QixLQUFLOU0sS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUE7QUFDQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDOEIsV0FBRCxDQUFwQixFQUFtQ21ELFlBQW5DLEVBQWlEQyxXQUFqRCxFQUE4RG5ELFlBQTlELEVBQTRFb0QsT0FBNUUsRUFBcUYrRyxVQUFyRixFQUFpR0MsVUFBakcsRUFBNkd0RyxLQUE3RyxFQUFvSHVHLFFBQXBILENBQTlDLEVBQTZLLFlBQU0sQ0FBRSxDQUFyTDs7QUFFQSxVQUFJbEgsZ0JBQWdCLEtBQWhCLElBQXlCbkQsaUJBQWlCLFNBQTlDLEVBQXlEO0FBQ3ZELGFBQUtJLFVBQUwsQ0FBZ0JnQyxJQUFoQjtBQUNEO0FBQ0Y7OztzREFFa0NyQyxXLEVBQWFtRCxZLEVBQWNDLFcsRUFBYW5ELFksRUFBY29ELE8sRUFBUztBQUNoRyx3QkFBZ0JzSCxZQUFoQixDQUE2QixLQUFLaE4sS0FBTCxDQUFXNUMsZUFBeEMsRUFBeURpRixXQUF6RCxFQUFzRW1ELFlBQXRFLEVBQW9GQyxXQUFwRixFQUFpR25ELFlBQWpHLEVBQStHb0QsT0FBL0c7QUFDQSxpREFBNEIsS0FBSzFGLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtuQyxRQUFMLENBQWM7QUFDWnpFLHlCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBLFdBQUtuRSxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixjQUE1QixFQUE0QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQzhCLFdBQUQsQ0FBcEIsRUFBbUNtRCxZQUFuQyxFQUFpREMsV0FBakQsRUFBOERuRCxZQUE5RCxFQUE0RW9ELE9BQTVFLENBQTVDLEVBQWtJLFlBQU0sQ0FBRSxDQUExSTtBQUNEOzs7dURBRW1DckQsVyxFQUFhbUQsWSxFQUFjQyxXLEVBQWFuRCxZLEVBQWNvRCxPLEVBQVNVLEssRUFBT0MsUyxFQUFXO0FBQ25ILHdCQUFnQjRHLGFBQWhCLENBQThCLEtBQUtqTixLQUFMLENBQVc1QyxlQUF6QyxFQUEwRGlGLFdBQTFELEVBQXVFbUQsWUFBdkUsRUFBcUZDLFdBQXJGLEVBQWtHbkQsWUFBbEcsRUFBZ0hvRCxPQUFoSCxFQUF5SFUsS0FBekgsRUFBZ0lDLFNBQWhJO0FBQ0EsaURBQTRCLEtBQUtyRyxLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1pnSiw2QkFBcUIsS0FIVDtBQUlaQyw2QkFBcUIsS0FKVDtBQUtaQyxnQ0FBd0I7QUFMWixPQUFkO0FBT0E7QUFDQSxVQUFJQyxlQUFlLDhCQUFlaEgsU0FBZixDQUFuQjtBQUNBLFdBQUt0RyxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixlQUE1QixFQUE2QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQzhCLFdBQUQsQ0FBcEIsRUFBbUNtRCxZQUFuQyxFQUFpREMsV0FBakQsRUFBOERuRCxZQUE5RCxFQUE0RW9ELE9BQTVFLEVBQXFGVSxLQUFyRixFQUE0RmlILFlBQTVGLENBQTdDLEVBQXdKLFlBQU0sQ0FBRSxDQUFoSztBQUNEOzs7d0RBRW9DaEwsVyxFQUFhbUQsWSxFQUFjbEQsWSxFQUFjb0QsTyxFQUFTO0FBQ3JGLHdCQUFnQjRILGNBQWhCLENBQStCLEtBQUt0TixLQUFMLENBQVc1QyxlQUExQyxFQUEyRGlGLFdBQTNELEVBQXdFbUQsWUFBeEUsRUFBc0ZsRCxZQUF0RixFQUFvR29ELE9BQXBHO0FBQ0EsaURBQTRCLEtBQUsxRixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1pnSiw2QkFBcUIsS0FIVDtBQUlaQyw2QkFBcUIsS0FKVDtBQUtaQyxnQ0FBd0I7QUFMWixPQUFkO0FBT0EsV0FBS3JOLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQzhCLFdBQUQsQ0FBcEIsRUFBbUNtRCxZQUFuQyxFQUFpRGxELFlBQWpELEVBQStEb0QsT0FBL0QsQ0FBOUMsRUFBdUgsWUFBTSxDQUFFLENBQS9IO0FBQ0Q7Ozs0REFFd0NyRCxXLEVBQWFtRCxZLEVBQWNsRCxZLEVBQWNvRCxPLEVBQVNXLFMsRUFBVztBQUNwRyx3QkFBZ0JrSCxrQkFBaEIsQ0FBbUMsS0FBS3ZOLEtBQUwsQ0FBVzVDLGVBQTlDLEVBQStEaUYsV0FBL0QsRUFBNEVtRCxZQUE1RSxFQUEwRmxELFlBQTFGLEVBQXdHb0QsT0FBeEcsRUFBaUhXLFNBQWpIO0FBQ0EsaURBQTRCLEtBQUtyRyxLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQTtBQUNBLFVBQUltSixlQUFlLDhCQUFlaEgsU0FBZixDQUFuQjtBQUNBLFdBQUt0RyxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixvQkFBNUIsRUFBa0QsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURsRCxZQUFqRCxFQUErRG9ELE9BQS9ELEVBQXdFMkgsWUFBeEUsQ0FBbEQsRUFBeUksWUFBTSxDQUFFLENBQWpKO0FBQ0Q7OztnRUFFNENoTCxXLEVBQWFtRCxZLEVBQWNsRCxZLEVBQWNrTCxVLEVBQVlDLFEsRUFBVUMsVSxFQUFZQyxRLEVBQVU7QUFDaEksd0JBQWdCQyxzQkFBaEIsQ0FBdUMsS0FBSzVOLEtBQUwsQ0FBVzVDLGVBQWxELEVBQW1FaUYsV0FBbkUsRUFBZ0ZtRCxZQUFoRixFQUE4RmxELFlBQTlGLEVBQTRHa0wsVUFBNUcsRUFBd0hDLFFBQXhILEVBQWtJQyxVQUFsSSxFQUE4SUMsUUFBOUk7QUFDQSxpREFBNEIsS0FBSzNOLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtuQyxRQUFMLENBQWM7QUFDWnpFLHlCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBLFdBQUtuRSxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0Qix3QkFBNUIsRUFBc0QsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURsRCxZQUFqRCxFQUErRGtMLFVBQS9ELEVBQTJFQyxRQUEzRSxFQUFxRkMsVUFBckYsRUFBaUdDLFFBQWpHLENBQXRELEVBQWtLLFlBQU0sQ0FBRSxDQUExSztBQUNEOzs7d0RBRW9DRSxlLEVBQWlCQyxlLEVBQWlCO0FBQ3JFLHdCQUFnQkMsY0FBaEIsQ0FBK0IsS0FBSy9OLEtBQUwsQ0FBVzVDLGVBQTFDLEVBQTJEeVEsZUFBM0QsRUFBNEVDLGVBQTVFO0FBQ0EsaURBQTRCLEtBQUs5TixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQnNOLGVBQXBCLEVBQXFDQyxlQUFyQyxDQUE5QyxFQUFxRyxZQUFNLENBQUUsQ0FBN0c7QUFDRDs7O3dEQUVvQ3RJLFksRUFBYztBQUNqRCx3QkFBZ0J3SSxjQUFoQixDQUErQixLQUFLaE8sS0FBTCxDQUFXNUMsZUFBMUMsRUFBMkRvSSxZQUEzRDtBQUNBLGlEQUE0QixLQUFLeEYsS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUE7QUFDQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQmlGLFlBQXBCLENBQTlDLEVBQWlGLFlBQU0sQ0FBRSxDQUF6RjtBQUNEOzs7MkRBRXVDQSxZLEVBQWM7QUFDcEQsd0JBQWdCeUksaUJBQWhCLENBQWtDLEtBQUtqTyxLQUFMLENBQVc1QyxlQUE3QyxFQUE4RG9JLFlBQTlEO0FBQ0EsaURBQTRCLEtBQUt4RixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsbUJBQTVCLEVBQWlELENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQmlGLFlBQXBCLENBQWpELEVBQW9GLFlBQU0sQ0FBRSxDQUE1RjtBQUNEOzs7d0RBRW9DQSxZLEVBQWM7QUFDakQsd0JBQWdCMEksY0FBaEIsQ0FBK0IsS0FBS2xPLEtBQUwsQ0FBVzVDLGVBQTFDLEVBQTJEb0ksWUFBM0Q7QUFDQSxpREFBNEIsS0FBS3hGLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtuQyxRQUFMLENBQWM7QUFDWnpFLHlCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBLFdBQUtuRSxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixnQkFBNUIsRUFBOEMsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CaUYsWUFBcEIsQ0FBOUMsRUFBaUYsWUFBTSxDQUFFLENBQXpGO0FBQ0Q7Ozs4REFFMENuRCxXLEVBQWFtRCxZLEVBQWNsRCxZLEVBQWNtRSxNLEVBQVFDLGEsRUFBZWhCLE8sRUFBU1UsSyxFQUFPO0FBQ3pILFVBQUlULFlBQVksS0FBS0MsWUFBTCxFQUFoQjtBQUNBLFVBQUl1SSxnQkFBZ0Isa0JBQWdCQyxvQkFBaEIsQ0FBcUMsS0FBS3BPLEtBQUwsQ0FBVzVDLGVBQWhELEVBQWlFaUYsV0FBakUsRUFBOEVtRCxZQUE5RSxFQUE0RmxELFlBQTVGLEVBQTBHbUUsTUFBMUcsRUFBa0hDLGFBQWxILEVBQWlJaEIsT0FBakksRUFBMElVLEtBQTFJLEVBQWlKVCxTQUFqSixDQUFwQjtBQUNBO0FBQ0EsVUFBSXRFLE9BQU9DLElBQVAsQ0FBWTZNLGFBQVosRUFBMkJ2TyxNQUEzQixHQUFvQyxDQUF4QyxFQUEyQztBQUN6QyxtREFBNEIsS0FBS0ksS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxhQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsYUFBS25DLFFBQUwsQ0FBYztBQUNaekUsMkJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw4QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixTQUFkOztBQUtBO0FBQ0E7QUFDQSxZQUFJLENBQUMsS0FBS21LLGNBQVYsRUFBMEIsS0FBS0EsY0FBTCxHQUFzQixFQUF0QjtBQUMxQixZQUFJQyxjQUFjLENBQUNqTSxXQUFELEVBQWNtRCxZQUFkLEVBQTRCbEQsWUFBNUIsRUFBMENpTSxJQUExQyxDQUErQyxHQUEvQyxDQUFsQjtBQUNBLGFBQUtGLGNBQUwsQ0FBb0JDLFdBQXBCLElBQW1DLEVBQUVqTSx3QkFBRixFQUFlbUQsMEJBQWYsRUFBNkJsRCwwQkFBN0IsRUFBMkM2TCw0QkFBM0MsRUFBMER4SSxvQkFBMUQsRUFBbkM7QUFDQSxhQUFLOUUsMkJBQUw7QUFDRDtBQUNGOzs7a0RBRThCO0FBQzdCLFVBQUksQ0FBQyxLQUFLd04sY0FBVixFQUEwQixPQUFPLEtBQU0sQ0FBYjtBQUMxQixXQUFLLElBQUlDLFdBQVQsSUFBd0IsS0FBS0QsY0FBN0IsRUFBNkM7QUFDM0MsWUFBSSxDQUFDQyxXQUFMLEVBQWtCO0FBQ2xCLFlBQUksQ0FBQyxLQUFLRCxjQUFMLENBQW9CQyxXQUFwQixDQUFMLEVBQXVDO0FBRkksb0NBR2lDLEtBQUtELGNBQUwsQ0FBb0JDLFdBQXBCLENBSGpDO0FBQUEsWUFHckNqTSxXQUhxQyx5QkFHckNBLFdBSHFDO0FBQUEsWUFHeEJtRCxZQUh3Qix5QkFHeEJBLFlBSHdCO0FBQUEsWUFHVmxELFlBSFUseUJBR1ZBLFlBSFU7QUFBQSxZQUdJNkwsYUFISix5QkFHSUEsYUFISjtBQUFBLFlBR21CeEksU0FIbkIseUJBR21CQSxTQUhuQjs7QUFLM0M7O0FBQ0EsWUFBSTZJLHVCQUF1Qiw4QkFBZUwsYUFBZixDQUEzQjs7QUFFQSxhQUFLcE8sS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZUFBNUIsRUFBNkMsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURsRCxZQUFqRCxFQUErRGtNLG9CQUEvRCxFQUFxRjdJLFNBQXJGLENBQTdDLEVBQThJLFlBQU0sQ0FBRSxDQUF0SjtBQUNBLGVBQU8sS0FBSzBJLGNBQUwsQ0FBb0JDLFdBQXBCLENBQVA7QUFDRDtBQUNGOzs7dUNBRW1CO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLFVBQUkzSSxZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxXQUFLdkYsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQ0MsWUFBckMsQ0FBa0RyQixVQUFVdUcsSUFBNUQ7QUFDQSxXQUFLckssUUFBTCxDQUFjLEVBQUV6RixpQkFBaUIsS0FBbkIsRUFBMEJOLGNBQWM2SixVQUFVdUcsSUFBbEQsRUFBZDtBQUNEOzs7MENBRXNCO0FBQ3JCLFVBQUl2RyxZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxXQUFLL0QsUUFBTCxDQUFjLEVBQUV6RixpQkFBaUIsS0FBbkIsRUFBMEJOLGNBQWM2SixVQUFVbUIsTUFBbEQsRUFBZDtBQUNBLFdBQUt6RyxVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDQyxZQUFyQyxDQUFrRHJCLFVBQVVtQixNQUE1RDtBQUNEOzs7cUNBRWlCO0FBQUE7O0FBQ2hCLFVBQUksS0FBSzlHLEtBQUwsQ0FBV2xFLFlBQVgsSUFBMkIsS0FBS2tFLEtBQUwsQ0FBV2pFLFFBQTFDLEVBQW9ELEtBQUswUyxnQkFBTDs7QUFFcEQsVUFBSSxLQUFLek8sS0FBTCxDQUFXNUQsZUFBZixFQUFnQztBQUM5QixhQUFLeUYsUUFBTCxDQUFjO0FBQ1o1RSx3QkFBYyxJQURGO0FBRVpELHlCQUFlLElBRkg7QUFHWlosMkJBQWlCO0FBSEwsU0FBZCxFQUlHLFlBQU07QUFDUCxpQkFBS2lFLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUMySCxLQUFyQztBQUNELFNBTkQ7QUFPRCxPQVJELE1BUU87QUFDTCxhQUFLN00sUUFBTCxDQUFjO0FBQ1o1RSx3QkFBYyxJQURGO0FBRVpELHlCQUFlLElBRkg7QUFHWlosMkJBQWlCO0FBSEwsU0FBZCxFQUlHLFlBQU07QUFDUCxpQkFBS2lFLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUM0SCxJQUFyQztBQUNELFNBTkQ7QUFPRDtBQUNGOzs7c0NBRWtCdlIsZSxFQUFpQkMsa0IsRUFBb0I7QUFBQTs7QUFDdEQsVUFBSUQsZUFBSixFQUFxQjtBQUNuQixZQUFJQSxnQkFBZ0J3UixRQUFwQixFQUE4QjtBQUM1QixlQUFLQyxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCelIsZ0JBQWdCd1IsUUFBL0MsRUFBeUQsSUFBekQsRUFBK0QsVUFBQ3BQLElBQUQsRUFBVTtBQUN2RSxnQkFBSXNQLEtBQUt0UCxLQUFLb0osVUFBTCxJQUFtQnBKLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsZ0JBQUksQ0FBQ2tHLEVBQUwsRUFBUyxPQUFPLEtBQU0sQ0FBYjtBQUNUdFAsaUJBQUtrSixZQUFMLEdBQW9CLENBQUMsQ0FBQyxPQUFLMUksS0FBTCxDQUFXcEQsYUFBWCxDQUF5QmtTLEVBQXpCLENBQXRCO0FBQ0F0UCxpQkFBS2tLLFlBQUwsR0FBb0IsQ0FBQyxDQUFDLE9BQUsxSixLQUFMLENBQVduRCxhQUFYLENBQXlCaVMsRUFBekIsQ0FBdEI7QUFDQXRQLGlCQUFLdVAsVUFBTCxHQUFrQixDQUFDLENBQUMsT0FBSy9PLEtBQUwsQ0FBV2pELFdBQVgsQ0FBdUIrUixFQUF2QixDQUFwQjtBQUNELFdBTkQ7QUFPQTFSLDBCQUFnQndSLFFBQWhCLENBQXlCbEYsWUFBekIsR0FBd0MsSUFBeEM7QUFDRDtBQUNELG1EQUE0QnRNLGVBQTVCO0FBQ0EsYUFBS3lFLFFBQUwsQ0FBYyxFQUFFekUsZ0NBQUYsRUFBbUJDLHNDQUFuQixFQUFkO0FBQ0Q7QUFDRjs7OytDQUVxQztBQUFBOztBQUFBLFVBQWZnRixXQUFlLFNBQWZBLFdBQWU7O0FBQ3BDLFVBQUksS0FBS3JDLEtBQUwsQ0FBVzVDLGVBQVgsSUFBOEIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ3UixRQUE3RCxFQUF1RTtBQUNyRSxZQUFJSSxRQUFRLEVBQVo7QUFDQSxhQUFLSCxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCLEtBQUs3TyxLQUFMLENBQVc1QyxlQUFYLENBQTJCd1IsUUFBMUQsRUFBb0UsSUFBcEUsRUFBMEUsVUFBQ3BQLElBQUQsRUFBT3VLLE1BQVAsRUFBa0I7QUFDMUZ2SyxlQUFLdUssTUFBTCxHQUFjQSxNQUFkO0FBQ0EsY0FBSStFLEtBQUt0UCxLQUFLb0osVUFBTCxJQUFtQnBKLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsY0FBSWtHLE1BQU1BLE9BQU96TSxXQUFqQixFQUE4QjJNLE1BQU0vTSxJQUFOLENBQVd6QyxJQUFYO0FBQy9CLFNBSkQ7QUFLQXdQLGNBQU1qTixPQUFOLENBQWMsVUFBQ3ZDLElBQUQsRUFBVTtBQUN0QixpQkFBS3lQLFVBQUwsQ0FBZ0J6UCxJQUFoQjtBQUNBLGlCQUFLd0ssVUFBTCxDQUFnQnhLLElBQWhCO0FBQ0EsaUJBQUswUCxZQUFMLENBQWtCMVAsSUFBbEI7QUFDRCxTQUpEO0FBS0Q7QUFDRjs7O2lEQUV1QztBQUFBOztBQUFBLFVBQWY2QyxXQUFlLFNBQWZBLFdBQWU7O0FBQ3RDLFVBQUkyTSxRQUFRLEtBQUtHLHNCQUFMLENBQTRCOU0sV0FBNUIsQ0FBWjtBQUNBMk0sWUFBTWpOLE9BQU4sQ0FBYyxVQUFDdkMsSUFBRCxFQUFVO0FBQ3RCLGVBQUs0UCxZQUFMLENBQWtCNVAsSUFBbEI7QUFDQSxlQUFLNlAsWUFBTCxDQUFrQjdQLElBQWxCO0FBQ0EsZUFBSzhQLFdBQUwsQ0FBaUI5UCxJQUFqQjtBQUNELE9BSkQ7QUFLRDs7OzJDQUV1QjZDLFcsRUFBYTtBQUNuQyxVQUFJMk0sUUFBUSxFQUFaO0FBQ0EsVUFBSSxLQUFLaFAsS0FBTCxDQUFXNUMsZUFBWCxJQUE4QixLQUFLNEMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQndSLFFBQTdELEVBQXVFO0FBQ3JFLGFBQUtDLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBSzdPLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ3UixRQUExRCxFQUFvRSxJQUFwRSxFQUEwRSxVQUFDcFAsSUFBRCxFQUFVO0FBQ2xGLGNBQUlzUCxLQUFLdFAsS0FBS29KLFVBQUwsSUFBbUJwSixLQUFLb0osVUFBTCxDQUFnQixVQUFoQixDQUE1QjtBQUNBLGNBQUlrRyxNQUFNQSxPQUFPek0sV0FBakIsRUFBOEIyTSxNQUFNL00sSUFBTixDQUFXekMsSUFBWDtBQUMvQixTQUhEO0FBSUQ7QUFDRCxhQUFPd1AsS0FBUDtBQUNEOzs7OENBRTBCM00sVyxFQUFhbUQsWSxFQUFjRSxPLEVBQVM2SixhLEVBQWU7QUFBQTs7QUFDNUUsVUFBSUMsaUJBQWlCLEtBQUtDLHFCQUFMLENBQTJCcE4sV0FBM0IsRUFBd0MsS0FBS3JDLEtBQUwsQ0FBVzVDLGVBQW5ELENBQXJCO0FBQ0EsVUFBSXFJLGNBQWMrSixrQkFBa0JBLGVBQWUvSixXQUFuRDtBQUNBLFVBQUksQ0FBQ0EsV0FBTCxFQUFrQjtBQUNoQixlQUFPakMsUUFBUWtNLElBQVIsQ0FBYSxlQUFlck4sV0FBZixHQUE2QixnRkFBMUMsQ0FBUDtBQUNEOztBQUVELFVBQUlzTixVQUFVLEtBQUszUCxLQUFMLENBQVdtSixpQkFBWCxJQUFnQyxFQUE5QztBQUNBd0csY0FBUTVOLE9BQVIsQ0FBZ0IsVUFBQ3VILE9BQUQsRUFBYTtBQUMzQixZQUFJQSxRQUFRRyxVQUFSLElBQXNCSCxRQUFRakgsV0FBUixLQUF3QkEsV0FBOUMsSUFBNkRrTixjQUFjSyxPQUFkLENBQXNCdEcsUUFBUVksUUFBUixDQUFpQi9HLElBQXZDLE1BQWlELENBQUMsQ0FBbkgsRUFBc0g7QUFDcEgsaUJBQUswTSxXQUFMLENBQWlCdkcsT0FBakI7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBS3dHLGFBQUwsQ0FBbUJ4RyxPQUFuQjtBQUNEO0FBQ0YsT0FORDs7QUFRQSxpREFBNEIsS0FBS3RKLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS3lFLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFGUjtBQUdacEgsdUJBQWUsaUJBQU82TCxLQUFQLENBQWEsS0FBSzNJLEtBQUwsQ0FBV2xELGFBQXhCLENBSEg7QUFJWitMLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOztBQUVEOzs7Ozs7MENBSXVCMUcsVyxFQUFhakYsZSxFQUFpQjtBQUNuRCxVQUFJLENBQUNBLGVBQUwsRUFBc0IsT0FBTyxLQUFNLENBQWI7QUFDdEIsVUFBSSxDQUFDQSxnQkFBZ0J3UixRQUFyQixFQUErQixPQUFPLEtBQU0sQ0FBYjtBQUMvQixVQUFJSSxjQUFKO0FBQ0EsV0FBS0gsYUFBTCxDQUFtQixHQUFuQixFQUF3QixDQUF4QixFQUEyQixFQUEzQixFQUErQnpSLGdCQUFnQndSLFFBQS9DLEVBQXlELElBQXpELEVBQStELFVBQUNwUCxJQUFELEVBQVU7QUFDdkUsWUFBSXNQLEtBQUt0UCxLQUFLb0osVUFBTCxJQUFtQnBKLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsWUFBSWtHLE1BQU1BLE9BQU96TSxXQUFqQixFQUE4QjJNLFFBQVF4UCxJQUFSO0FBQy9CLE9BSEQ7QUFJQSxhQUFPd1AsS0FBUDtBQUNEOzs7a0NBRWNlLE8sRUFBU3hHLEssRUFBT3lHLFEsRUFBVXBCLFEsRUFBVTdFLE0sRUFBUWtHLFEsRUFBVTtBQUNuRUEsZUFBU3JCLFFBQVQsRUFBbUI3RSxNQUFuQixFQUEyQmdHLE9BQTNCLEVBQW9DeEcsS0FBcEMsRUFBMkN5RyxRQUEzQyxFQUFxRHBCLFNBQVNsUCxRQUE5RDtBQUNBLFVBQUlrUCxTQUFTbFAsUUFBYixFQUF1QjtBQUNyQixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSWlQLFNBQVNsUCxRQUFULENBQWtCRSxNQUF0QyxFQUE4Q0QsR0FBOUMsRUFBbUQ7QUFDakQsY0FBSUUsUUFBUStPLFNBQVNsUCxRQUFULENBQWtCQyxDQUFsQixDQUFaO0FBQ0EsY0FBSSxDQUFDRSxLQUFELElBQVUsT0FBT0EsS0FBUCxLQUFpQixRQUEvQixFQUF5QztBQUN6QyxlQUFLZ1AsYUFBTCxDQUFtQmtCLFVBQVUsR0FBVixHQUFnQnBRLENBQW5DLEVBQXNDQSxDQUF0QyxFQUF5Q2lQLFNBQVNsUCxRQUFsRCxFQUE0REcsS0FBNUQsRUFBbUUrTyxRQUFuRSxFQUE2RXFCLFFBQTdFO0FBQ0Q7QUFDRjtBQUNGOzs7cUNBRWlCQSxRLEVBQVU7QUFDMUIsVUFBTUMsZUFBZSxFQUFyQjtBQUNBLFVBQU12SyxZQUFZLEtBQUtDLFlBQUwsRUFBbEI7QUFDQSxVQUFNdUssWUFBWXhLLFVBQVV1QixJQUE1QjtBQUNBLFVBQU1rSixhQUFhekssVUFBVXNCLElBQTdCO0FBQ0EsVUFBTW9KLGVBQWUsK0JBQWdCMUssVUFBVStFLElBQTFCLENBQXJCO0FBQ0EsVUFBSTRGLGlCQUFpQixDQUFDLENBQXRCO0FBQ0EsV0FBSyxJQUFJM1EsSUFBSXdRLFNBQWIsRUFBd0J4USxJQUFJeVEsVUFBNUIsRUFBd0N6USxHQUF4QyxFQUE2QztBQUMzQzJRO0FBQ0EsWUFBSUMsY0FBYzVRLENBQWxCO0FBQ0EsWUFBSTZRLGtCQUFrQkYsaUJBQWlCM0ssVUFBVStFLElBQWpEO0FBQ0EsWUFBSThGLG1CQUFtQixLQUFLeFEsS0FBTCxDQUFXeEUsY0FBbEMsRUFBa0Q7QUFDaEQsY0FBSWlWLFlBQVlSLFNBQVNNLFdBQVQsRUFBc0JDLGVBQXRCLEVBQXVDN0ssVUFBVStFLElBQWpELEVBQXVEMkYsWUFBdkQsQ0FBaEI7QUFDQSxjQUFJSSxTQUFKLEVBQWU7QUFDYlAseUJBQWFqTyxJQUFiLENBQWtCd08sU0FBbEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxhQUFPUCxZQUFQO0FBQ0Q7OztvQ0FFZ0JELFEsRUFBVTtBQUN6QixVQUFNQyxlQUFlLEVBQXJCO0FBQ0EsVUFBTXZLLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLFVBQU04SyxZQUFZLHFDQUFzQi9LLFVBQVUrRSxJQUFoQyxDQUFsQjtBQUNBLFVBQU15RixZQUFZeEssVUFBVXVCLElBQTVCO0FBQ0EsVUFBTXlKLFNBQVNoTCxVQUFVdUIsSUFBVixHQUFpQnZCLFVBQVVHLElBQTFDO0FBQ0EsVUFBTThLLFVBQVVqTCxVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVVHLElBQTNDO0FBQ0EsVUFBTStLLFVBQVVELFVBQVVELE1BQTFCO0FBQ0EsVUFBTUcsY0FBYyx1QkFBUUgsTUFBUixFQUFnQkQsU0FBaEIsQ0FBcEI7QUFDQSxVQUFJSyxjQUFjRCxXQUFsQjtBQUNBLFVBQU1FLFlBQVksRUFBbEI7QUFDQSxhQUFPRCxlQUFlSCxPQUF0QixFQUErQjtBQUM3Qkksa0JBQVUvTyxJQUFWLENBQWU4TyxXQUFmO0FBQ0FBLHVCQUFlTCxTQUFmO0FBQ0Q7QUFDRCxXQUFLLElBQUkvUSxJQUFJLENBQWIsRUFBZ0JBLElBQUlxUixVQUFVcFIsTUFBOUIsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3pDLFlBQUlzUixXQUFXRCxVQUFVclIsQ0FBVixDQUFmO0FBQ0EsWUFBSWtHLGVBQWUseUNBQTBCb0wsUUFBMUIsRUFBb0N0TCxVQUFVRyxJQUE5QyxDQUFuQjtBQUNBLFlBQUlvTCxjQUFjbEwsS0FBS21MLEtBQUwsQ0FBV3RMLGVBQWVGLFVBQVVHLElBQXpCLEdBQWdDbUwsUUFBM0MsQ0FBbEI7QUFDQTtBQUNBLFlBQUksQ0FBQ0MsV0FBTCxFQUFrQjtBQUNoQixjQUFJRSxjQUFjdkwsZUFBZXNLLFNBQWpDO0FBQ0EsY0FBSWtCLFdBQVdELGNBQWN6TCxVQUFVK0UsSUFBdkM7QUFDQSxjQUFJK0YsWUFBWVIsU0FBU2dCLFFBQVQsRUFBbUJJLFFBQW5CLEVBQTZCUixPQUE3QixDQUFoQjtBQUNBLGNBQUlKLFNBQUosRUFBZVAsYUFBYWpPLElBQWIsQ0FBa0J3TyxTQUFsQjtBQUNoQjtBQUNGO0FBQ0QsYUFBT1AsWUFBUDtBQUNEOztBQUVEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBbUJnQjtBQUNkLFVBQU12SyxZQUFZLEVBQWxCO0FBQ0FBLGdCQUFVMkwsR0FBVixHQUFnQixLQUFLdFIsS0FBTCxDQUFXL0QsZUFBM0IsQ0FGYyxDQUU2QjtBQUMzQzBKLGdCQUFVRyxJQUFWLEdBQWlCLE9BQU9ILFVBQVUyTCxHQUFsQyxDQUhjLENBR3dCO0FBQ3RDM0wsZ0JBQVU0TCxLQUFWLEdBQWtCLDRCQUFhLEtBQUt2UixLQUFMLENBQVc1QyxlQUF4QixFQUF5QyxLQUFLNEMsS0FBTCxDQUFXN0QsbUJBQXBELENBQWxCO0FBQ0F3SixnQkFBVTZMLElBQVYsR0FBaUIseUNBQTBCN0wsVUFBVTRMLEtBQXBDLEVBQTJDNUwsVUFBVUcsSUFBckQsQ0FBakIsQ0FMYyxDQUs4RDtBQUM1RUgsZ0JBQVV1RyxJQUFWLEdBQWlCLENBQWpCLENBTmMsQ0FNSztBQUNuQnZHLGdCQUFVdUIsSUFBVixHQUFrQixLQUFLbEgsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0M4SixVQUFVdUcsSUFBN0MsR0FBcUR2RyxVQUFVdUcsSUFBL0QsR0FBc0UsS0FBS2xNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQXZGLENBUGMsQ0FPeUc7QUFDdkg4SixnQkFBVW1CLE1BQVYsR0FBb0JuQixVQUFVNkwsSUFBVixHQUFpQixFQUFsQixHQUF3QixFQUF4QixHQUE2QjdMLFVBQVU2TCxJQUExRCxDQVJjLENBUWlEO0FBQy9EN0wsZ0JBQVVxRixPQUFWLEdBQW9CLEtBQUtoTCxLQUFMLENBQVdqRSxRQUFYLEdBQXNCLEtBQUtpRSxLQUFMLENBQVdqRSxRQUFqQyxHQUE0QzRKLFVBQVVtQixNQUFWLEdBQW1CLElBQW5GLENBVGMsQ0FTMkU7QUFDekZuQixnQkFBVXNCLElBQVYsR0FBa0IsS0FBS2pILEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLElBQWtDOEosVUFBVXFGLE9BQTdDLEdBQXdEckYsVUFBVXFGLE9BQWxFLEdBQTRFLEtBQUtoTCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUE3RixDQVZjLENBVStHO0FBQzdIOEosZ0JBQVU4TCxJQUFWLEdBQWlCekwsS0FBSzBMLEdBQUwsQ0FBUy9MLFVBQVVzQixJQUFWLEdBQWlCdEIsVUFBVXVCLElBQXBDLENBQWpCLENBWGMsQ0FXNkM7QUFDM0R2QixnQkFBVStFLElBQVYsR0FBaUIxRSxLQUFLbUwsS0FBTCxDQUFXLEtBQUtuUixLQUFMLENBQVd4RSxjQUFYLEdBQTRCbUssVUFBVThMLElBQWpELENBQWpCLENBWmMsQ0FZMEQ7QUFDeEUsVUFBSTlMLFVBQVUrRSxJQUFWLEdBQWlCLENBQXJCLEVBQXdCL0UsVUFBVWdNLE9BQVYsR0FBb0IsQ0FBcEI7QUFDeEIsVUFBSWhNLFVBQVUrRSxJQUFWLEdBQWlCLEtBQUsxSyxLQUFMLENBQVd4RSxjQUFoQyxFQUFnRG1LLFVBQVUrRSxJQUFWLEdBQWlCLEtBQUsxSyxLQUFMLENBQVd4RSxjQUE1QjtBQUNoRG1LLGdCQUFVaU0sR0FBVixHQUFnQjVMLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVK0UsSUFBdEMsQ0FBaEI7QUFDQS9FLGdCQUFVa00sR0FBVixHQUFnQjdMLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVK0UsSUFBdEMsQ0FBaEI7QUFDQS9FLGdCQUFVbU0sTUFBVixHQUFtQm5NLFVBQVVxRixPQUFWLEdBQW9CckYsVUFBVStFLElBQWpELENBakJjLENBaUJ3QztBQUN0RC9FLGdCQUFVb00sR0FBVixHQUFnQi9MLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVRyxJQUF0QyxDQUFoQixDQWxCYyxDQWtCOEM7QUFDNURILGdCQUFVcU0sR0FBVixHQUFnQmhNLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVRyxJQUF0QyxDQUFoQixDQW5CYyxDQW1COEM7QUFDNURILGdCQUFVc00sR0FBVixHQUFnQixLQUFLalMsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixLQUFLeUUsS0FBTCxDQUFXeEUsY0FBeEQsQ0FwQmMsQ0FvQnlEO0FBQ3ZFbUssZ0JBQVVpRyxPQUFWLEdBQW9CakcsVUFBVW1NLE1BQVYsR0FBbUJuTSxVQUFVc00sR0FBakQsQ0FyQmMsQ0FxQnVDO0FBQ3JEdE0sZ0JBQVV1TSxHQUFWLEdBQWlCdk0sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVK0UsSUFBNUIsR0FBb0MvRSxVQUFVaUcsT0FBOUQsQ0F0QmMsQ0FzQndEO0FBQ3RFakcsZ0JBQVV3TSxHQUFWLEdBQWlCeE0sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVK0UsSUFBNUIsR0FBb0MvRSxVQUFVaUcsT0FBOUQsQ0F2QmMsQ0F1QndEO0FBQ3RFLGFBQU9qRyxTQUFQO0FBQ0Q7O0FBRUQ7Ozs7bUNBQ2dCO0FBQ2QsVUFBSSxLQUFLM0YsS0FBTCxDQUFXNUMsZUFBWCxJQUE4QixLQUFLNEMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQndSLFFBQXpELElBQXFFLEtBQUs1TyxLQUFMLENBQVc1QyxlQUFYLENBQTJCd1IsUUFBM0IsQ0FBb0NsUCxRQUE3RyxFQUF1SDtBQUNySCxZQUFJMFMsY0FBYyxLQUFLQyxtQkFBTCxDQUF5QixFQUF6QixFQUE2QixLQUFLclMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQndSLFFBQTNCLENBQW9DbFAsUUFBakUsQ0FBbEI7QUFDQSxZQUFJNFMsV0FBVyxxQkFBTUYsV0FBTixDQUFmO0FBQ0EsZUFBT0UsUUFBUDtBQUNELE9BSkQsTUFJTztBQUNMLGVBQU8sRUFBUDtBQUNEO0FBQ0Y7Ozt3Q0FFb0JDLEssRUFBTzdTLFEsRUFBVTtBQUFBOztBQUNwQyxhQUFPO0FBQ0w2UyxvQkFESztBQUVMQyxlQUFPOVMsU0FBUytTLE1BQVQsQ0FBZ0IsVUFBQzVTLEtBQUQ7QUFBQSxpQkFBVyxPQUFPQSxLQUFQLEtBQWlCLFFBQTVCO0FBQUEsU0FBaEIsRUFBc0Q2UyxHQUF0RCxDQUEwRCxVQUFDN1MsS0FBRCxFQUFXO0FBQzFFLGlCQUFPLFFBQUt3UyxtQkFBTCxDQUF5QixFQUF6QixFQUE2QnhTLE1BQU1ILFFBQW5DLENBQVA7QUFDRCxTQUZNO0FBRkYsT0FBUDtBQU1EOzs7MkNBRXVCO0FBQUE7O0FBQ3RCO0FBQ0EsVUFBSWlULGVBQWUsS0FBS0MsWUFBTCxHQUFvQkMsS0FBcEIsQ0FBMEIsSUFBMUIsQ0FBbkI7QUFDQSxVQUFJQyxnQkFBZ0IsRUFBcEI7QUFDQSxVQUFJQyx5QkFBeUIsRUFBN0I7QUFDQSxVQUFJQyxvQkFBb0IsQ0FBeEI7O0FBRUEsVUFBSSxDQUFDLEtBQUtoVCxLQUFMLENBQVc1QyxlQUFaLElBQStCLENBQUMsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ3UixRQUEvRCxFQUF5RSxPQUFPa0UsYUFBUDs7QUFFekUsV0FBS2pFLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBSzdPLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ3UixRQUExRCxFQUFvRSxJQUFwRSxFQUEwRSxVQUFDcFAsSUFBRCxFQUFPdUssTUFBUCxFQUFlZ0csT0FBZixFQUF3QnhHLEtBQXhCLEVBQStCeUcsUUFBL0IsRUFBNEM7QUFDcEgsWUFBTTFJLFVBQVUsUUFBS2pILFVBQUwsQ0FBZ0I0UyxTQUFoQixDQUEwQkMsaUNBQTFCLENBQTREMVQsSUFBNUQsRUFBa0V1SyxNQUFsRSxFQUEwRSxRQUFLMUosVUFBL0UsRUFBMkYsRUFBM0YsQ0FBaEI7O0FBRUEsWUFBTThTLGNBQWM3TCxRQUFRNkwsV0FBUixFQUFwQjtBQUNBLFlBQU0xTixjQUFjNkIsUUFBUThMLGFBQVIsRUFBcEI7QUFDQSxZQUFNL1EsY0FBY2lGLFFBQVErTCxjQUFSLEVBQXBCOztBQUVBLFlBQUksQ0FBQ3RKLE1BQUQsSUFBWUEsT0FBT0wsWUFBUCxLQUF3QixRQUFLckosVUFBTCxDQUFnQjRTLFNBQWhCLENBQTBCSyxnQkFBMUIsQ0FBMkM3TixXQUEzQyxLQUEyRDBOLFdBQW5GLENBQWhCLEVBQWtIO0FBQUU7QUFDbEgsY0FBTUksY0FBY1osYUFBYUssaUJBQWIsQ0FBcEIsQ0FEZ0gsQ0FDNUQ7QUFDcEQsY0FBTVEsYUFBYSxFQUFFaFUsVUFBRixFQUFRdUssY0FBUixFQUFnQmdHLGdCQUFoQixFQUF5QnhHLFlBQXpCLEVBQWdDeUcsa0JBQWhDLEVBQTBDdUQsd0JBQTFDLEVBQXVERSxjQUFjLEVBQXJFLEVBQXlFakssV0FBVyxJQUFwRixFQUEwRm5ILGFBQWE3QyxLQUFLb0osVUFBTCxDQUFnQixVQUFoQixDQUF2RyxFQUFuQjtBQUNBa0ssd0JBQWM3USxJQUFkLENBQW1CdVIsVUFBbkI7O0FBRUEsY0FBSSxDQUFDVCx1QkFBdUJ0TixXQUF2QixDQUFMLEVBQTBDO0FBQ3hDLGdCQUFNaU8sV0FBVzNELFFBQVFuUSxNQUFSLEtBQW1CLENBQXBDLENBRHdDLENBQ0Y7QUFDdENtVCxtQ0FBdUJ0TixXQUF2QixJQUFzQ3BFLE9BQU9zUyxNQUFQLENBQWNyTSxRQUFRc00sd0JBQVIsQ0FBaUNGLFFBQWpDLENBQWQsQ0FBdEM7QUFDRDs7QUFFRCxjQUFNRyx1QkFBdUIsRUFBN0I7O0FBRUEsZUFBSyxJQUFJbFUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJb1QsdUJBQXVCdE4sV0FBdkIsRUFBb0M3RixNQUF4RCxFQUFnRUQsR0FBaEUsRUFBcUU7QUFDbkUsZ0JBQUltVSwwQkFBMEJmLHVCQUF1QnROLFdBQXZCLEVBQW9DOUYsQ0FBcEMsQ0FBOUI7O0FBRUEsZ0JBQUlvVSxvQkFBSjs7QUFFRTtBQUNGLGdCQUFJRCx3QkFBd0JFLE9BQTVCLEVBQXFDO0FBQ25DLGtCQUFJQyxnQkFBZ0JILHdCQUF3QkUsT0FBeEIsQ0FBZ0NFLE1BQXBEO0FBQ0Esa0JBQUlDLGFBQWdCOVIsV0FBaEIsU0FBK0I0UixhQUFuQztBQUNBLGtCQUFJRyxtQkFBbUIsS0FBdkI7O0FBRUU7QUFDRixrQkFBSSxRQUFLcFUsS0FBTCxDQUFXOUMsd0JBQVgsQ0FBb0NpWCxVQUFwQyxDQUFKLEVBQXFEO0FBQ25ELG9CQUFJLENBQUNOLHFCQUFxQkksYUFBckIsQ0FBTCxFQUEwQztBQUN4Q0cscUNBQW1CLElBQW5CO0FBQ0FQLHVDQUFxQkksYUFBckIsSUFBc0MsSUFBdEM7QUFDRDs7QUFFREYsOEJBQWM7QUFDWnpNLGtDQURZO0FBRVo5SCw0QkFGWTtBQUdadUssZ0NBSFk7QUFJWmdHLGtDQUpZO0FBS1p4Ryw4QkFMWTtBQU1aeUcsb0NBTlk7QUFPWmlFLDhDQVBZO0FBUVpFLHdDQVJZO0FBU1pFLG1DQUFpQixJQVRMO0FBVVpELG9EQVZZO0FBV1psSyw0QkFBVTRKLHVCQVhFO0FBWVpySyw4QkFBWSxJQVpBO0FBYVpwSDtBQWJZLGlCQUFkO0FBZUQsZUFyQkQsTUFxQk87QUFDSDtBQUNGLG9CQUFJaVMsYUFBYSxDQUFDUix1QkFBRCxDQUFqQjtBQUNFO0FBQ0Ysb0JBQUlTLElBQUk1VSxDQUFSLENBSkssQ0FJSztBQUNWLHFCQUFLLElBQUk2VSxJQUFJLENBQWIsRUFBZ0JBLElBQUksQ0FBcEIsRUFBdUJBLEdBQXZCLEVBQTRCO0FBQzFCLHNCQUFJQyxZQUFZRCxJQUFJRCxDQUFwQjtBQUNBLHNCQUFJRyxpQkFBaUIzQix1QkFBdUJ0TixXQUF2QixFQUFvQ2dQLFNBQXBDLENBQXJCO0FBQ0U7QUFDRixzQkFBSUMsa0JBQWtCQSxlQUFlVixPQUFqQyxJQUE0Q1UsZUFBZVYsT0FBZixDQUF1QkUsTUFBdkIsS0FBa0NELGFBQWxGLEVBQWlHO0FBQy9GSywrQkFBV3JTLElBQVgsQ0FBZ0J5UyxjQUFoQjtBQUNFO0FBQ0YvVSx5QkFBSyxDQUFMO0FBQ0Q7QUFDRjs7QUFFRG9VLDhCQUFjO0FBQ1p6TSxrQ0FEWTtBQUVaOUgsNEJBRlk7QUFHWnVLLGdDQUhZO0FBSVpnRyxrQ0FKWTtBQUtaeEcsOEJBTFk7QUFNWnlHLG9DQU5ZO0FBT1ppRSw4Q0FQWTtBQVFaRSx3Q0FSWTtBQVNaSCwyQkFBU00sVUFURztBQVVaSywrQkFBYWIsd0JBQXdCRSxPQUF4QixDQUFnQzdRLElBVmpDO0FBV1p5Uiw2QkFBVyxJQVhDO0FBWVp2UztBQVpZLGlCQUFkO0FBY0Q7QUFDRixhQTFERCxNQTBETztBQUNMMFIsNEJBQWM7QUFDWnpNLGdDQURZO0FBRVo5SCwwQkFGWTtBQUdadUssOEJBSFk7QUFJWmdHLGdDQUpZO0FBS1p4Ryw0QkFMWTtBQU1aeUcsa0NBTlk7QUFPWjlGLDBCQUFVNEosdUJBUEU7QUFRWnJLLDRCQUFZLElBUkE7QUFTWnBIO0FBVFksZUFBZDtBQVdEOztBQUVEbVIsdUJBQVdDLFlBQVgsQ0FBd0J4UixJQUF4QixDQUE2QjhSLFdBQTdCOztBQUVFO0FBQ0E7QUFDRixnQkFBSXZVLEtBQUtrSyxZQUFULEVBQXVCO0FBQ3JCb0osNEJBQWM3USxJQUFkLENBQW1COFIsV0FBbkI7QUFDRDtBQUNGO0FBQ0Y7QUFDRGY7QUFDRCxPQTNHRDs7QUE2R0FGLG9CQUFjL1EsT0FBZCxDQUFzQixVQUFDb0ksSUFBRCxFQUFPWixLQUFQLEVBQWNzTCxLQUFkLEVBQXdCO0FBQzVDMUssYUFBSzJLLE1BQUwsR0FBY3ZMLEtBQWQ7QUFDQVksYUFBSzRLLE1BQUwsR0FBY0YsS0FBZDtBQUNELE9BSEQ7O0FBS0EvQixzQkFBZ0JBLGNBQWNMLE1BQWQsQ0FBcUIsaUJBQStCO0FBQUEsWUFBNUJqVCxJQUE0QixTQUE1QkEsSUFBNEI7QUFBQSxZQUF0QnVLLE1BQXNCLFNBQXRCQSxNQUFzQjtBQUFBLFlBQWRnRyxPQUFjLFNBQWRBLE9BQWM7O0FBQ2hFO0FBQ0YsWUFBSUEsUUFBUThDLEtBQVIsQ0FBYyxHQUFkLEVBQW1CalQsTUFBbkIsR0FBNEIsQ0FBaEMsRUFBbUMsT0FBTyxLQUFQO0FBQ25DLGVBQU8sQ0FBQ21LLE1BQUQsSUFBV0EsT0FBT0wsWUFBekI7QUFDRCxPQUplLENBQWhCOztBQU1BLGFBQU9vSixhQUFQO0FBQ0Q7Ozt1REFFbUNuTixTLEVBQVd0RCxXLEVBQWFvRCxXLEVBQWFuRCxZLEVBQWNsRixlLEVBQWlCNlMsUSxFQUFVO0FBQ2hILFVBQUkrRSxpQkFBaUIsRUFBckI7O0FBRUEsVUFBSUMsYUFBYSwyQkFBaUJDLGFBQWpCLENBQStCN1MsV0FBL0IsRUFBNEMsS0FBS3JDLEtBQUwsQ0FBVzdELG1CQUF2RCxFQUE0RW1HLFlBQTVFLEVBQTBGbEYsZUFBMUYsQ0FBakI7QUFDQSxVQUFJLENBQUM2WCxVQUFMLEVBQWlCLE9BQU9ELGNBQVA7O0FBRWpCLFVBQUlHLGdCQUFnQjlULE9BQU9DLElBQVAsQ0FBWTJULFVBQVosRUFBd0J2QyxHQUF4QixDQUE0QixVQUFDMEMsV0FBRDtBQUFBLGVBQWlCQyxTQUFTRCxXQUFULEVBQXNCLEVBQXRCLENBQWpCO0FBQUEsT0FBNUIsRUFBd0VFLElBQXhFLENBQTZFLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGVBQVVELElBQUlDLENBQWQ7QUFBQSxPQUE3RSxDQUFwQjtBQUNBLFVBQUlMLGNBQWN2VixNQUFkLEdBQXVCLENBQTNCLEVBQThCLE9BQU9vVixjQUFQOztBQUU5QixXQUFLLElBQUlyVixJQUFJLENBQWIsRUFBZ0JBLElBQUl3VixjQUFjdlYsTUFBbEMsRUFBMENELEdBQTFDLEVBQStDO0FBQzdDLFlBQUk4VixTQUFTTixjQUFjeFYsQ0FBZCxDQUFiO0FBQ0EsWUFBSStWLE1BQU1ELE1BQU4sQ0FBSixFQUFtQjtBQUNuQixZQUFJRSxTQUFTUixjQUFjeFYsSUFBSSxDQUFsQixDQUFiO0FBQ0EsWUFBSWlXLFNBQVNULGNBQWN4VixJQUFJLENBQWxCLENBQWI7O0FBRUEsWUFBSThWLFNBQVM5UCxVQUFVcU0sR0FBdkIsRUFBNEIsU0FOaUIsQ0FNUjtBQUNyQyxZQUFJeUQsU0FBUzlQLFVBQVVvTSxHQUFuQixJQUEwQjZELFdBQVdDLFNBQXJDLElBQWtERCxTQUFTalEsVUFBVW9NLEdBQXpFLEVBQThFLFNBUGpDLENBTzBDOztBQUV2RixZQUFJK0QsYUFBSjtBQUNBLFlBQUlDLGFBQUo7QUFDQSxZQUFJclIsYUFBSjs7QUFFQSxZQUFJaVIsV0FBV0UsU0FBWCxJQUF3QixDQUFDSCxNQUFNQyxNQUFOLENBQTdCLEVBQTRDO0FBQzFDRyxpQkFBTztBQUNMRSxnQkFBSUwsTUFEQztBQUVMeFMsa0JBQU1iLFlBRkQ7QUFHTGlILG1CQUFPNUosSUFBSSxDQUhOO0FBSUxzVyxtQkFBTyx5Q0FBMEJOLE1BQTFCLEVBQWtDaFEsVUFBVUcsSUFBNUMsQ0FKRjtBQUtMb1EsbUJBQU9qQixXQUFXVSxNQUFYLEVBQW1CTyxLQUxyQjtBQU1MQyxtQkFBT2xCLFdBQVdVLE1BQVgsRUFBbUJRO0FBTnJCLFdBQVA7QUFRRDs7QUFFREosZUFBTztBQUNMQyxjQUFJUCxNQURDO0FBRUx0UyxnQkFBTWIsWUFGRDtBQUdMaUgsaUJBQU81SixDQUhGO0FBSUxzVyxpQkFBTyx5Q0FBMEJSLE1BQTFCLEVBQWtDOVAsVUFBVUcsSUFBNUMsQ0FKRjtBQUtMb1EsaUJBQU9qQixXQUFXUSxNQUFYLEVBQW1CUyxLQUxyQjtBQU1MQyxpQkFBT2xCLFdBQVdRLE1BQVgsRUFBbUJVO0FBTnJCLFNBQVA7O0FBU0EsWUFBSVAsV0FBV0MsU0FBWCxJQUF3QixDQUFDSCxNQUFNRSxNQUFOLENBQTdCLEVBQTRDO0FBQzFDbFIsaUJBQU87QUFDTHNSLGdCQUFJSixNQURDO0FBRUx6UyxrQkFBTWIsWUFGRDtBQUdMaUgsbUJBQU81SixJQUFJLENBSE47QUFJTHNXLG1CQUFPLHlDQUEwQkwsTUFBMUIsRUFBa0NqUSxVQUFVRyxJQUE1QyxDQUpGO0FBS0xvUSxtQkFBT2pCLFdBQVdXLE1BQVgsRUFBbUJNLEtBTHJCO0FBTUxDLG1CQUFPbEIsV0FBV1csTUFBWCxFQUFtQk87QUFOckIsV0FBUDtBQVFEOztBQUVELFlBQUlDLGVBQWUsQ0FBQ0wsS0FBS0UsS0FBTCxHQUFhdFEsVUFBVXVCLElBQXhCLElBQWdDdkIsVUFBVStFLElBQTdEO0FBQ0EsWUFBSTJMLHNCQUFKO0FBQ0EsWUFBSTNSLElBQUosRUFBVTJSLGdCQUFnQixDQUFDM1IsS0FBS3VSLEtBQUwsR0FBYXRRLFVBQVV1QixJQUF4QixJQUFnQ3ZCLFVBQVUrRSxJQUExRDs7QUFFVixZQUFJNEwsZ0JBQWdCckcsU0FBUzZGLElBQVQsRUFBZUMsSUFBZixFQUFxQnJSLElBQXJCLEVBQTJCMFIsWUFBM0IsRUFBeUNDLGFBQXpDLEVBQXdEMVcsQ0FBeEQsQ0FBcEI7QUFDQSxZQUFJMlcsYUFBSixFQUFtQnRCLGVBQWUvUyxJQUFmLENBQW9CcVUsYUFBcEI7QUFDcEI7O0FBRUQsYUFBT3RCLGNBQVA7QUFDRDs7O3dEQUVvQ3JQLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYWdPLFksRUFBY3JXLGUsRUFBaUI2UyxRLEVBQVU7QUFBQTs7QUFDakgsVUFBSStFLGlCQUFpQixFQUFyQjs7QUFFQXZCLG1CQUFhMVIsT0FBYixDQUFxQixVQUFDZ1MsV0FBRCxFQUFpQjtBQUNwQyxZQUFJQSxZQUFZYSxTQUFoQixFQUEyQjtBQUN6QmIsc0JBQVlDLE9BQVosQ0FBb0JqUyxPQUFwQixDQUE0QixVQUFDd1Usa0JBQUQsRUFBd0I7QUFDbEQsZ0JBQUlqVSxlQUFlaVUsbUJBQW1CcFQsSUFBdEM7QUFDQSxnQkFBSXFULGtCQUFrQixRQUFLQyxrQ0FBTCxDQUF3QzlRLFNBQXhDLEVBQW1EdEQsV0FBbkQsRUFBZ0VvRCxXQUFoRSxFQUE2RW5ELFlBQTdFLEVBQTJGbEYsZUFBM0YsRUFBNEc2UyxRQUE1RyxDQUF0QjtBQUNBLGdCQUFJdUcsZUFBSixFQUFxQjtBQUNuQnhCLCtCQUFpQkEsZUFBZTBCLE1BQWYsQ0FBc0JGLGVBQXRCLENBQWpCO0FBQ0Q7QUFDRixXQU5EO0FBT0QsU0FSRCxNQVFPO0FBQ0wsY0FBSWxVLGVBQWV5UixZQUFZN0osUUFBWixDQUFxQi9HLElBQXhDO0FBQ0EsY0FBSXFULGtCQUFrQixRQUFLQyxrQ0FBTCxDQUF3QzlRLFNBQXhDLEVBQW1EdEQsV0FBbkQsRUFBZ0VvRCxXQUFoRSxFQUE2RW5ELFlBQTdFLEVBQTJGbEYsZUFBM0YsRUFBNEc2UyxRQUE1RyxDQUF0QjtBQUNBLGNBQUl1RyxlQUFKLEVBQXFCO0FBQ25CeEIsNkJBQWlCQSxlQUFlMEIsTUFBZixDQUFzQkYsZUFBdEIsQ0FBakI7QUFDRDtBQUNGO0FBQ0YsT0FoQkQ7O0FBa0JBLGFBQU94QixjQUFQO0FBQ0Q7OzsyQ0FFdUI7QUFDdEIsV0FBS25ULFFBQUwsQ0FBYyxFQUFFbEYsc0JBQXNCLEtBQXhCLEVBQWQ7QUFDRDs7QUFFRDs7OztBQUlBOzs7O3FEQUVrQztBQUFBOztBQUNoQyxhQUNFO0FBQUE7QUFBQTtBQUNFLGlCQUFPO0FBQ0xnYSxzQkFBVSxVQURMO0FBRUxsUCxpQkFBSztBQUZBLFdBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0U7QUFDRSxnQ0FBc0IsS0FBS21QLG9CQUFMLENBQTBCN1YsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FEeEI7QUFFRSxzQ0FBNEIsS0FBS2hCLEtBQUwsQ0FBV1MsVUFBWCxDQUFzQjJDLElBRnBEO0FBR0UseUJBQWU5QixPQUFPQyxJQUFQLENBQWEsS0FBS3RCLEtBQUwsQ0FBVzVDLGVBQVosR0FBK0IsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ5WixTQUExRCxHQUFzRSxFQUFsRixDQUhqQjtBQUlFLGdDQUFzQixLQUFLN1csS0FBTCxDQUFXN0QsbUJBSm5DO0FBS0Usd0JBQWMsS0FBSzZELEtBQUwsQ0FBV2xFLFlBTDNCO0FBTUUscUJBQVcsS0FBS2tFLEtBQUwsQ0FBVzVELGVBTnhCO0FBT0UseUJBQWUsS0FBSzRELEtBQUwsQ0FBVzNELG1CQVA1QjtBQVFFLHFCQUFXLEtBQUt1SixZQUFMLEdBQW9Ca0IsTUFSakM7QUFTRSw4QkFBb0IsNEJBQUMrRyxlQUFELEVBQWtCQyxlQUFsQixFQUFzQztBQUN4RCxvQkFBS2dKLG1DQUFMLENBQXlDakosZUFBekMsRUFBMERDLGVBQTFEO0FBQ0QsV0FYSDtBQVlFLDBCQUFnQix3QkFBQ3RJLFlBQUQsRUFBa0I7QUFDaEMsb0JBQUt1UixtQ0FBTCxDQUF5Q3ZSLFlBQXpDO0FBQ0QsV0FkSDtBQWVFLDZCQUFtQiwyQkFBQ0EsWUFBRCxFQUFrQjtBQUNuQyxvQkFBS3dSLHNDQUFMLENBQTRDeFIsWUFBNUM7QUFDRCxXQWpCSDtBQWtCRSwwQkFBZ0Isd0JBQUNBLFlBQUQsRUFBa0I7QUFDaEMsb0JBQUt5UixtQ0FBTCxDQUF5Q3pSLFlBQXpDO0FBQ0QsV0FwQkg7QUFxQkUsMEJBQWdCLHdCQUFDckosbUJBQUQsRUFBeUI7QUFDdkM7QUFDQSxvQkFBS2tFLFVBQUwsQ0FBZ0I2VyxlQUFoQixDQUFnQy9hLG1CQUFoQyxFQUFxRCxFQUFFZ0ksTUFBTSxVQUFSLEVBQXJELEVBQTJFLFlBQU0sQ0FBRSxDQUFuRjtBQUNBLG9CQUFLcEUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsaUJBQTVCLEVBQStDLENBQUMsUUFBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQnBFLG1CQUFwQixDQUEvQyxFQUF5RixZQUFNLENBQUUsQ0FBakc7QUFDQSxvQkFBSzBGLFFBQUwsQ0FBYyxFQUFFMUYsd0NBQUYsRUFBZDtBQUNELFdBMUJIO0FBMkJFLDRCQUFrQiw0QkFBTTtBQUN0QixvQkFBS3NTLGdCQUFMO0FBQ0QsV0E3Qkg7QUE4QkUsK0JBQXFCLCtCQUFNO0FBQ3pCLG9CQUFLMEksbUJBQUw7QUFDRCxXQWhDSDtBQWlDRSw2QkFBbUIsNkJBQU07QUFDdkIsb0JBQUtqUCxjQUFMO0FBQ0QsV0FuQ0g7QUFvQ0UsK0JBQXFCLDZCQUFDa1AsVUFBRCxFQUFnQjtBQUNuQyxnQkFBSS9hLHNCQUFzQmdiLE9BQU9ELFdBQVd2UyxNQUFYLENBQWtCcVIsS0FBbEIsSUFBMkIsQ0FBbEMsQ0FBMUI7QUFDQSxvQkFBS3JVLFFBQUwsQ0FBYyxFQUFFeEYsd0NBQUYsRUFBZDtBQUNELFdBdkNIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGLE9BREY7QUFnREQ7OzsyQ0FFdUJpYixTLEVBQVc7QUFDakMsVUFBTTNSLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLGFBQU8sMENBQTJCMFIsVUFBVTlYLElBQXJDLEVBQTJDbUcsU0FBM0MsRUFBc0QsS0FBSzNGLEtBQUwsQ0FBVzVDLGVBQWpFLEVBQWtGLEtBQUs0QyxLQUFMLENBQVczQyxrQkFBN0YsRUFBaUgsS0FBS2dELFVBQXRILEVBQWtJLEtBQUtrWCxzQkFBTCxDQUE0QjVSLFNBQTVCLENBQWxJLEVBQTBLLEtBQUszRixLQUFMLENBQVc3RCxtQkFBckwsRUFBME1tYixVQUFVcE4sUUFBcE4sQ0FBUDtBQUNEOzs7MkNBRXVCdkUsUyxFQUFXO0FBQ2pDLGFBQU9LLEtBQUtDLEtBQUwsQ0FBVyxLQUFLakcsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVVHLElBQS9DLENBQVA7QUFDRDs7OzREQUV3Q3FFLEksRUFBTTtBQUFBOztBQUM3QyxVQUFJOUgsY0FBYzhILEtBQUszSyxJQUFMLENBQVVvSixVQUFWLENBQXFCLFVBQXJCLENBQWxCO0FBQ0EsVUFBSW5ELGNBQWUsUUFBTzBFLEtBQUszSyxJQUFMLENBQVVpRyxXQUFqQixNQUFpQyxRQUFsQyxHQUE4QyxLQUE5QyxHQUFzRDBFLEtBQUszSyxJQUFMLENBQVVpRyxXQUFsRjtBQUNBLFVBQUlFLFlBQVksS0FBS0MsWUFBTCxFQUFoQjs7QUFFQTtBQUNBO0FBQ0EsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLHdCQUFmLEVBQXdDLE9BQU8sRUFBRStRLFVBQVUsVUFBWixFQUF3QmpQLE1BQU0sS0FBSzFILEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsQ0FBM0QsRUFBOERpYyxRQUFRLEVBQXRFLEVBQTBFQyxPQUFPLE1BQWpGLEVBQXlGQyxVQUFVLFFBQW5HLEVBQS9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGFBQUtDLG1DQUFMLENBQXlDaFMsU0FBekMsRUFBb0R0RCxXQUFwRCxFQUFpRW9ELFdBQWpFLEVBQThFMEUsS0FBS3NKLFlBQW5GLEVBQWlHLEtBQUt6VCxLQUFMLENBQVc1QyxlQUE1RyxFQUE2SCxVQUFDMFksSUFBRCxFQUFPQyxJQUFQLEVBQWFyUixJQUFiLEVBQW1CMFIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEOU0sS0FBaEQsRUFBMEQ7QUFDdEwsY0FBSXFPLGdCQUFnQixFQUFwQjs7QUFFQSxjQUFJN0IsS0FBS0ksS0FBVCxFQUFnQjtBQUNkeUIsMEJBQWMzVixJQUFkLENBQW1CLFFBQUs0VixvQkFBTCxDQUEwQmxTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRHNRLEtBQUs1UyxJQUFwRSxFQUEwRSxRQUFLbkQsS0FBTCxDQUFXNUMsZUFBckYsRUFBc0cwWSxJQUF0RyxFQUE0R0MsSUFBNUcsRUFBa0hyUixJQUFsSCxFQUF3SDBSLFlBQXhILEVBQXNJQyxhQUF0SSxFQUFxSixDQUFySixFQUF3SixFQUFFeUIsV0FBVyxJQUFiLEVBQW1CQyxrQkFBa0IsSUFBckMsRUFBeEosQ0FBbkI7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSXJULElBQUosRUFBVTtBQUNSa1QsNEJBQWMzVixJQUFkLENBQW1CLFFBQUsrVixrQkFBTCxDQUF3QnJTLFNBQXhCLEVBQW1DdEQsV0FBbkMsRUFBZ0RvRCxXQUFoRCxFQUE2RHNRLEtBQUs1UyxJQUFsRSxFQUF3RSxRQUFLbkQsS0FBTCxDQUFXNUMsZUFBbkYsRUFBb0cwWSxJQUFwRyxFQUEwR0MsSUFBMUcsRUFBZ0hyUixJQUFoSCxFQUFzSDBSLFlBQXRILEVBQW9JQyxhQUFwSSxFQUFtSixDQUFuSixFQUFzSixFQUFFeUIsV0FBVyxJQUFiLEVBQW1CQyxrQkFBa0IsSUFBckMsRUFBdEosQ0FBbkI7QUFDRDtBQUNELGdCQUFJLENBQUNqQyxJQUFELElBQVMsQ0FBQ0EsS0FBS0ssS0FBbkIsRUFBMEI7QUFDeEJ5Qiw0QkFBYzNWLElBQWQsQ0FBbUIsUUFBS2dXLGtCQUFMLENBQXdCdFMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEc1EsS0FBSzVTLElBQWxFLEVBQXdFLFFBQUtuRCxLQUFMLENBQVc1QyxlQUFuRixFQUFvRzBZLElBQXBHLEVBQTBHQyxJQUExRyxFQUFnSHJSLElBQWhILEVBQXNIMFIsWUFBdEgsRUFBb0lDLGFBQXBJLEVBQW1KLENBQW5KLEVBQXNKLEVBQUV5QixXQUFXLElBQWIsRUFBbUJDLGtCQUFrQixJQUFyQyxFQUF0SixDQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsaUJBQU9ILGFBQVA7QUFDRCxTQWZBO0FBREgsT0FERjtBQW9CRDs7O21EQUUrQmpTLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYW5ELFksRUFBY2xGLGUsRUFBaUIwWSxJLEVBQU1DLEksRUFBTXJSLEksRUFBTTBSLFksRUFBYzdNLEssRUFBTzlDLE0sRUFBUXlSLE8sRUFBUztBQUFBOztBQUMxSixhQUNFO0FBQUE7QUFDRTs7QUEwSEE7QUEzSEY7QUFBQSxVQUVFLEtBQVE1VixZQUFSLFNBQXdCaUgsS0FGMUI7QUFHRSxnQkFBSyxHQUhQO0FBSUUsbUJBQVMsaUJBQUM0TyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsb0JBQUtDLHFCQUFMLENBQTJCLEVBQUVoVyx3QkFBRixFQUFlQywwQkFBZixFQUEzQjtBQUNBLGdCQUFJbkYsa0JBQWtCLFFBQUs2QyxLQUFMLENBQVc3QyxlQUFqQztBQUNBQSw4QkFBa0IsQ0FBQ2tGLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUN5VCxLQUFLeE0sS0FBL0MsQ0FBbEI7QUFDQSxvQkFBSzFILFFBQUwsQ0FBYztBQUNaN0UsNkJBQWUsSUFESDtBQUVaQyw0QkFBYyxJQUZGO0FBR1ppUSxtQ0FBcUJrTCxTQUFTRSxDQUhsQjtBQUlabkwsbUNBQXFCNEksS0FBS0MsRUFKZDtBQUtaN1k7QUFMWSxhQUFkO0FBT0QsV0FmSDtBQWdCRSxrQkFBUSxnQkFBQ2diLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixvQkFBS0csdUJBQUwsQ0FBNkIsRUFBRWxXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTdCO0FBQ0Esb0JBQUtULFFBQUwsQ0FBYyxFQUFFcUwscUJBQXFCLEtBQXZCLEVBQThCQyxxQkFBcUIsS0FBbkQsRUFBMERoUSxpQkFBaUIsRUFBM0UsRUFBZDtBQUNELFdBbkJIO0FBb0JFLGtCQUFRLGlCQUFPMkQsUUFBUCxDQUFnQixVQUFDcVgsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9DLGdCQUFJLENBQUMsUUFBS3BZLEtBQUwsQ0FBV29OLHNCQUFoQixFQUF3QztBQUN0QyxrQkFBSW9MLFdBQVdKLFNBQVNLLEtBQVQsR0FBaUIsUUFBS3pZLEtBQUwsQ0FBV2tOLG1CQUEzQztBQUNBLGtCQUFJd0wsV0FBWUYsV0FBVzdTLFVBQVUrRSxJQUF0QixHQUE4Qi9FLFVBQVVHLElBQXZEO0FBQ0Esa0JBQUk2UyxTQUFTM1MsS0FBS0MsS0FBTCxDQUFXLFFBQUtqRyxLQUFMLENBQVdtTixtQkFBWCxHQUFpQ3VMLFFBQTVDLENBQWI7QUFDQSxzQkFBSy9SLHlDQUFMLENBQStDdEUsV0FBL0MsRUFBNEQsUUFBS3JDLEtBQUwsQ0FBVzdELG1CQUF2RSxFQUE0Rm1HLFlBQTVGLEVBQTBHbUUsTUFBMUcsRUFBa0hzUCxLQUFLeE0sS0FBdkgsRUFBOEh3TSxLQUFLQyxFQUFuSSxFQUF1STJDLE1BQXZJO0FBQ0Q7QUFDRixXQVBPLEVBT0xyWixhQVBLLENBcEJWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTRCRTtBQUNFLHlCQUFlLHVCQUFDc1osWUFBRCxFQUFrQjtBQUMvQkEseUJBQWFDLGVBQWI7QUFDQSxnQkFBSUMsZUFBZUYsYUFBYS9RLFdBQWIsQ0FBeUJrUixPQUE1QztBQUNBLGdCQUFJQyxlQUFlRixlQUFlMUMsWUFBZixHQUE4QnBRLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWlNLEdBQVYsR0FBZ0JqTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxnQkFBSXVPLFlBQVlsRCxLQUFLQyxFQUFyQjtBQUNBLGdCQUFJa0QsZUFBZW5ELEtBQUtFLEtBQXhCO0FBQ0Esb0JBQUsvVixPQUFMLENBQWFpWixJQUFiLENBQWtCO0FBQ2hCL1Qsb0JBQU0sVUFEVTtBQUVoQk8sa0NBRmdCO0FBR2hCeVQscUJBQU9SLGFBQWEvUSxXQUhKO0FBSWhCeEYsc0NBSmdCO0FBS2hCbUQsNEJBQWMsUUFBS3hGLEtBQUwsQ0FBVzdELG1CQUxUO0FBTWhCbUcsd0NBTmdCO0FBT2hCb0UsNkJBQWVxUCxLQUFLeE0sS0FQSjtBQVFoQjdELHVCQUFTcVEsS0FBS0MsRUFSRTtBQVNoQnFELDBCQUFZdEQsS0FBS0UsS0FURDtBQVVoQjdQLHFCQUFPLElBVlM7QUFXaEJrVCx3QkFBVSxJQVhNO0FBWWhCbkQscUJBQU8sSUFaUztBQWFoQjJDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQnhUO0FBakJnQixhQUFsQjtBQW1CRCxXQTFCSDtBQTJCRSxpQkFBTztBQUNMOFQscUJBQVMsY0FESjtBQUVMNUMsc0JBQVUsVUFGTDtBQUdMbFAsaUJBQUssQ0FIQTtBQUlMQyxrQkFBTTBPLFlBSkQ7QUFLTHFCLG1CQUFPLEVBTEY7QUFNTEQsb0JBQVEsRUFOSDtBQU9MZ0Msb0JBQVEsSUFQSDtBQVFMQyxvQkFBUTtBQVJILFdBM0JUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTVCRixPQURGO0FBb0VEOzs7dUNBRW1COVQsUyxFQUFXdEQsVyxFQUFhb0QsVyxFQUFhbkQsWSxFQUFjbEYsZSxFQUFpQjBZLEksRUFBTUMsSSxFQUFNclIsSSxFQUFNMFIsWSxFQUFjQyxhLEVBQWU5TSxLLEVBQU8yTyxPLEVBQVM7QUFDckosVUFBSXdCLFdBQVcsS0FBZjtBQUNBLFdBQUsxWixLQUFMLENBQVc3QyxlQUFYLENBQTJCNEUsT0FBM0IsQ0FBbUMsVUFBQ3dTLENBQUQsRUFBTztBQUN4QyxZQUFJQSxNQUFNbFMsY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5Q3lULEtBQUt4TSxLQUF4RCxFQUErRG1RLFdBQVcsSUFBWDtBQUNoRSxPQUZEOztBQUlBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZUFBUXBYLFlBQVIsU0FBd0JpSCxLQUF4QixTQUFpQ3dNLEtBQUtDLEVBRHhDO0FBRUUsaUJBQU87QUFDTFcsc0JBQVUsVUFETDtBQUVMalAsa0JBQU0wTyxZQUZEO0FBR0xxQixtQkFBTyxDQUhGO0FBSUxELG9CQUFRLEVBSkg7QUFLTC9QLGlCQUFLLENBQUMsQ0FMRDtBQU1Ma1MsdUJBQVcsWUFOTjtBQU9MQyx3QkFBWSxzQkFQUDtBQVFMSixvQkFBUTtBQVJILFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsa0JBRFo7QUFFRSxtQkFBTztBQUNMN0Msd0JBQVUsVUFETDtBQUVMbFAsbUJBQUssQ0FGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUwrUixzQkFBU3ZCLFFBQVFKLFNBQVQsR0FBc0IsU0FBdEIsR0FBa0M7QUFKckMsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRSxpRUFBYSxPQUFRSSxRQUFRSCxnQkFBVCxHQUNoQix5QkFBUThCLElBRFEsR0FFZjNCLFFBQVE0QixpQkFBVCxHQUNJLHlCQUFRQyxTQURaLEdBRUtMLFFBQUQsR0FDRSx5QkFBUU0sYUFEVixHQUVFLHlCQUFRQyxJQU5sQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFSRjtBQVpGLE9BREY7QUFnQ0Q7Ozt5Q0FFcUJ0VSxTLEVBQVd0RCxXLEVBQWFvRCxXLEVBQWFuRCxZLEVBQWNsRixlLEVBQWlCMFksSSxFQUFNQyxJLEVBQU1yUixJLEVBQU0wUixZLEVBQWNDLGEsRUFBZTlNLEssRUFBTzJPLE8sRUFBUztBQUFBOztBQUN2SixVQUFNZ0MsWUFBZTdYLFdBQWYsU0FBOEJDLFlBQTlCLFNBQThDaUgsS0FBOUMsU0FBdUR3TSxLQUFLQyxFQUFsRTtBQUNBLFVBQU1HLFFBQVFKLEtBQUtJLEtBQUwsQ0FBV2dFLE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUJDLFdBQXJCLEtBQXFDckUsS0FBS0ksS0FBTCxDQUFXa0UsS0FBWCxDQUFpQixDQUFqQixDQUFuRDtBQUNBLFVBQU1DLGlCQUFpQm5FLE1BQU1vRSxRQUFOLENBQWUsTUFBZixLQUEwQnBFLE1BQU1vRSxRQUFOLENBQWUsUUFBZixDQUExQixJQUFzRHBFLE1BQU1vRSxRQUFOLENBQWUsU0FBZixDQUE3RTtBQUNBLFVBQU1DLFdBQVdsZCxVQUFVNlksUUFBUSxLQUFsQixDQUFqQjtBQUNBLFVBQUlzRSxzQkFBc0IsS0FBMUI7QUFDQSxVQUFJQyx1QkFBdUIsS0FBM0I7QUFDQSxXQUFLMWEsS0FBTCxDQUFXN0MsZUFBWCxDQUEyQjRFLE9BQTNCLENBQW1DLFVBQUN3UyxDQUFELEVBQU87QUFDeEMsWUFBSUEsTUFBTWxTLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUN5VCxLQUFLeE0sS0FBeEQsRUFBK0RrUixzQkFBc0IsSUFBdEI7QUFDL0QsWUFBSWxHLE1BQU1sUyxjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLElBQTBDeVQsS0FBS3hNLEtBQUwsR0FBYSxDQUF2RCxDQUFWLEVBQXFFbVIsdUJBQXVCLElBQXZCO0FBQ3RFLE9BSEQ7O0FBS0EsYUFDRTtBQUFBO0FBQUEsVUFFRSxLQUFRcFksWUFBUixTQUF3QmlILEtBRjFCO0FBR0UsZ0JBQUssR0FIUDtBQUlFLG1CQUFTLGlCQUFDNE8sU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLGdCQUFJRixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixvQkFBS08scUJBQUwsQ0FBMkIsRUFBRWhXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTNCO0FBQ0EsZ0JBQUluRixrQkFBa0IsUUFBSzZDLEtBQUwsQ0FBVzdDLGVBQWpDO0FBQ0FBLDhCQUFrQixDQUFDa0YsY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5Q3lULEtBQUt4TSxLQUEvQyxFQUFzRGxILGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsSUFBMEN5VCxLQUFLeE0sS0FBTCxHQUFhLENBQXZELENBQXRELENBQWxCO0FBQ0Esb0JBQUsxSCxRQUFMLENBQWM7QUFDWjdFLDZCQUFlLElBREg7QUFFWkMsNEJBQWMsSUFGRjtBQUdaaVEsbUNBQXFCa0wsU0FBU0UsQ0FIbEI7QUFJWm5MLG1DQUFxQjRJLEtBQUtDLEVBSmQ7QUFLWjVJLHNDQUF3QixJQUxaO0FBTVpqUTtBQU5ZLGFBQWQ7QUFRRCxXQWpCSDtBQWtCRSxrQkFBUSxnQkFBQ2diLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixvQkFBS0csdUJBQUwsQ0FBNkIsRUFBRWxXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTdCO0FBQ0Esb0JBQUtULFFBQUwsQ0FBYyxFQUFFcUwscUJBQXFCLEtBQXZCLEVBQThCQyxxQkFBcUIsS0FBbkQsRUFBMERDLHdCQUF3QixLQUFsRixFQUF5RmpRLGlCQUFpQixFQUExRyxFQUFkO0FBQ0QsV0FyQkg7QUFzQkUsa0JBQVEsaUJBQU8yRCxRQUFQLENBQWdCLFVBQUNxWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0MsZ0JBQUlJLFdBQVdKLFNBQVNLLEtBQVQsR0FBaUIsUUFBS3pZLEtBQUwsQ0FBV2tOLG1CQUEzQztBQUNBLGdCQUFJd0wsV0FBWUYsV0FBVzdTLFVBQVUrRSxJQUF0QixHQUE4Qi9FLFVBQVVHLElBQXZEO0FBQ0EsZ0JBQUk2UyxTQUFTM1MsS0FBS0MsS0FBTCxDQUFXLFFBQUtqRyxLQUFMLENBQVdtTixtQkFBWCxHQUFpQ3VMLFFBQTVDLENBQWI7QUFDQSxvQkFBSy9SLHlDQUFMLENBQStDdEUsV0FBL0MsRUFBNEQsUUFBS3JDLEtBQUwsQ0FBVzdELG1CQUF2RSxFQUE0Rm1HLFlBQTVGLEVBQTBHLE1BQTFHLEVBQWtIeVQsS0FBS3hNLEtBQXZILEVBQThId00sS0FBS0MsRUFBbkksRUFBdUkyQyxNQUF2STtBQUNELFdBTE8sRUFLTHJaLGFBTEssQ0F0QlY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNEJFO0FBQUE7QUFBQTtBQUNFLHVCQUFVLGdCQURaO0FBRUUsaUJBQUs0YSxTQUZQO0FBR0UsaUJBQUssYUFBQ1MsVUFBRCxFQUFnQjtBQUNuQixzQkFBS1QsU0FBTCxJQUFrQlMsVUFBbEI7QUFDRCxhQUxIO0FBTUUsMkJBQWUsdUJBQUMvQixZQUFELEVBQWtCO0FBQy9CLGtCQUFJVixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QmMsMkJBQWFDLGVBQWI7QUFDQSxrQkFBSUMsZUFBZUYsYUFBYS9RLFdBQWIsQ0FBeUJrUixPQUE1QztBQUNBLGtCQUFJQyxlQUFlRixlQUFlMUMsWUFBZixHQUE4QnBRLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWlNLEdBQVYsR0FBZ0JqTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxrQkFBSXdPLGVBQWVsVCxLQUFLQyxLQUFMLENBQVcrUyxlQUFlclQsVUFBVStFLElBQXBDLENBQW5CO0FBQ0Esa0JBQUl1TyxZQUFZalQsS0FBS0MsS0FBTCxDQUFZK1MsZUFBZXJULFVBQVUrRSxJQUExQixHQUFrQy9FLFVBQVVHLElBQXZELENBQWhCO0FBQ0Esc0JBQUs1RixPQUFMLENBQWFpWixJQUFiLENBQWtCO0FBQ2hCL1Qsc0JBQU0scUJBRFU7QUFFaEJPLG9DQUZnQjtBQUdoQnlULHVCQUFPUixhQUFhL1EsV0FISjtBQUloQnhGLHdDQUpnQjtBQUtoQm1ELDhCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFMVDtBQU1oQm1HLDBDQU5nQjtBQU9oQitXLDRCQUFZdEQsS0FBS0UsS0FQRDtBQVFoQnZQLCtCQUFlcVAsS0FBS3hNLEtBUko7QUFTaEI3RCx5QkFBU3FRLEtBQUtDLEVBVEU7QUFVaEJHLHVCQUFPSixLQUFLSSxLQVZJO0FBV2hCbUQsMEJBQVU1VSxLQUFLdVIsS0FYQztBQVloQjdQLHVCQUFPMUIsS0FBS3NSLEVBWkk7QUFhaEI4QywwQ0FiZ0I7QUFjaEJFLDBDQWRnQjtBQWVoQkUsMENBZmdCO0FBZ0JoQkQsb0NBaEJnQjtBQWlCaEJ4VDtBQWpCZ0IsZUFBbEI7QUFtQkQsYUFoQ0g7QUFpQ0UsMEJBQWMsc0JBQUNtVixVQUFELEVBQWdCO0FBQzVCLGtCQUFJLFFBQUtWLFNBQUwsQ0FBSixFQUFxQixRQUFLQSxTQUFMLEVBQWdCVyxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEIseUJBQVFDLElBQXRDO0FBQ3RCLGFBbkNIO0FBb0NFLDBCQUFjLHNCQUFDSCxVQUFELEVBQWdCO0FBQzVCLGtCQUFJLFFBQUtWLFNBQUwsQ0FBSixFQUFxQixRQUFLQSxTQUFMLEVBQWdCVyxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEIsYUFBOUI7QUFDdEIsYUF0Q0g7QUF1Q0UsbUJBQU87QUFDTG5FLHdCQUFVLFVBREw7QUFFTGpQLG9CQUFNME8sZUFBZSxDQUZoQjtBQUdMcUIscUJBQU9wQixnQkFBZ0JELFlBSGxCO0FBSUwzTyxtQkFBSyxDQUpBO0FBS0wrUCxzQkFBUSxFQUxIO0FBTUx3RCxnQ0FBa0IsTUFOYjtBQU9MdkIsc0JBQVN2QixRQUFRSixTQUFULEdBQ0osU0FESSxHQUVKO0FBVEMsYUF2Q1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0RHSSxrQkFBUUosU0FBUixJQUNDO0FBQ0UsdUJBQVUseUJBRFo7QUFFRSxtQkFBTztBQUNMbkIsd0JBQVUsVUFETDtBQUVMYyxxQkFBTyxNQUZGO0FBR0xELHNCQUFRLE1BSEg7QUFJTC9QLG1CQUFLLENBSkE7QUFLTHdULDRCQUFjLENBTFQ7QUFNTHpCLHNCQUFRLENBTkg7QUFPTDlSLG9CQUFNLENBUEQ7QUFRTHdULCtCQUFrQmhELFFBQVFKLFNBQVQsR0FDYix5QkFBUWlELElBREssR0FFYixxQkFBTSx5QkFBUUksUUFBZCxFQUF3QkMsSUFBeEIsQ0FBNkIsSUFBN0I7QUFWQyxhQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBbkRKO0FBbUVFO0FBQ0UsdUJBQVUsTUFEWjtBQUVFLG1CQUFPO0FBQ0x6RSx3QkFBVSxVQURMO0FBRUw2QyxzQkFBUSxJQUZIO0FBR0wvQixxQkFBTyxNQUhGO0FBSUxELHNCQUFRLE1BSkg7QUFLTC9QLG1CQUFLLENBTEE7QUFNTHdULDRCQUFjLENBTlQ7QUFPTHZULG9CQUFNLENBUEQ7QUFRTHdULCtCQUFrQmhELFFBQVFKLFNBQVQsR0FDZEksUUFBUUgsZ0JBQVQsR0FDRSxxQkFBTSx5QkFBUW9ELFFBQWQsRUFBd0JDLElBQXhCLENBQTZCLElBQTdCLENBREYsR0FFRSxxQkFBTSx5QkFBUUQsUUFBZCxFQUF3QkMsSUFBeEIsQ0FBNkIsS0FBN0IsQ0FIYSxHQUlmLHFCQUFNLHlCQUFRRCxRQUFkLEVBQXdCQyxJQUF4QixDQUE2QixJQUE3QjtBQVpHLGFBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFuRUY7QUFvRkU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTHpFLDBCQUFVLFVBREw7QUFFTGpQLHNCQUFNLENBQUMsQ0FGRjtBQUdMK1AsdUJBQU8sQ0FIRjtBQUlMRCx3QkFBUSxFQUpIO0FBS0wvUCxxQkFBSyxDQUFDLENBTEQ7QUFNTGtTLDJCQUFXLFlBTk47QUFPTEgsd0JBQVE7QUFQSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLDJCQUFVLGtCQURaO0FBRUUsdUJBQU87QUFDTDdDLDRCQUFVLFVBREw7QUFFTGxQLHVCQUFLLENBRkE7QUFHTEMsd0JBQU0sQ0FIRDtBQUlMK1IsMEJBQVN2QixRQUFRSixTQUFULEdBQXNCLFNBQXRCLEdBQWtDO0FBSnJDLGlCQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFFLHFFQUFhLE9BQVFJLFFBQVFILGdCQUFULEdBQ2QseUJBQVE4QixJQURNLEdBRWIzQixRQUFRNEIsaUJBQVQsR0FDSSx5QkFBUUMsU0FEWixHQUVLVSxtQkFBRCxHQUNFLHlCQUFRVCxhQURWLEdBRUUseUJBQVFDLElBTnBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVJGO0FBVkYsV0FwRkY7QUFnSEU7QUFBQTtBQUFBLGNBQU0sT0FBTztBQUNYdEQsMEJBQVUsVUFEQztBQUVYNkMsd0JBQVEsSUFGRztBQUdYL0IsdUJBQU8sTUFISTtBQUlYRCx3QkFBUSxNQUpHO0FBS1h5RCw4QkFBYyxDQUxIO0FBTVhJLDRCQUFZLENBTkQ7QUFPWDNELDBCQUFVNEMsaUJBQWlCLFNBQWpCLEdBQTZCO0FBUDVCLGVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0UsMENBQUMsUUFBRDtBQUNFLGtCQUFJSixTQUROO0FBRUUsNEJBQWVoQyxRQUFRSCxnQkFBVCxHQUNWLHlCQUFROEIsSUFERSxHQUVSM0IsUUFBUTRCLGlCQUFULEdBQ0cseUJBQVFDLFNBRFgsR0FFSVUsbUJBQUQsR0FDRSx5QkFBUVQsYUFEVixHQUVFLHlCQUFRQyxJQVJwQjtBQVNFLDZCQUFnQi9CLFFBQVFILGdCQUFULEdBQ1gseUJBQVE4QixJQURHLEdBRVQzQixRQUFRNEIsaUJBQVQsR0FDRyx5QkFBUUMsU0FEWCxHQUVJVyxvQkFBRCxHQUNFLHlCQUFRVixhQURWLEdBRUUseUJBQVFDLElBZnBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVEYsV0FoSEY7QUEySUU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTHRELDBCQUFVLFVBREw7QUFFTDJFLHVCQUFPLENBQUMsQ0FGSDtBQUdMN0QsdUJBQU8sQ0FIRjtBQUlMRCx3QkFBUSxFQUpIO0FBS0wvUCxxQkFBSyxDQUFDLENBTEQ7QUFNTGtTLDJCQUFXLFlBTk47QUFPTEMsNEJBQVksc0JBUFA7QUFRTEosd0JBQVE7QUFSSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdFO0FBQUE7QUFBQTtBQUNFLDJCQUFVLGtCQURaO0FBRUUsdUJBQU87QUFDTDdDLDRCQUFVLFVBREw7QUFFTGxQLHVCQUFLLENBRkE7QUFHTEMsd0JBQU0sQ0FIRDtBQUlMK1IsMEJBQVN2QixRQUFRSixTQUFULEdBQ0osU0FESSxHQUVKO0FBTkMsaUJBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUUscUVBQWEsT0FBUUksUUFBUUgsZ0JBQVQsR0FDaEIseUJBQVE4QixJQURRLEdBRWYzQixRQUFRNEIsaUJBQVQsR0FDSSx5QkFBUUMsU0FEWixHQUVLVyxvQkFBRCxHQUNFLHlCQUFRVixhQURWLEdBRUUseUJBQVFDLElBTmxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVZGO0FBWEY7QUEzSUY7QUE1QkYsT0FERjtBQTBNRDs7O3VDQUVtQnRVLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYW5ELFksRUFBY2xGLGUsRUFBaUIwWSxJLEVBQU1DLEksRUFBTXJSLEksRUFBTTBSLFksRUFBY0MsYSxFQUFlOU0sSyxFQUFPMk8sTyxFQUFTO0FBQUE7O0FBQ3JKO0FBQ0EsVUFBTWdDLFlBQWU1WCxZQUFmLFNBQStCaUgsS0FBL0IsU0FBd0N3TSxLQUFLQyxFQUFuRDs7QUFFQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUssYUFBQzJFLFVBQUQsRUFBZ0I7QUFDbkIsb0JBQUtULFNBQUwsSUFBa0JTLFVBQWxCO0FBQ0QsV0FISDtBQUlFLGVBQVFyWSxZQUFSLFNBQXdCaUgsS0FKMUI7QUFLRSxxQkFBVSxlQUxaO0FBTUUseUJBQWUsdUJBQUNxUCxZQUFELEVBQWtCO0FBQy9CLGdCQUFJVixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QmMseUJBQWFDLGVBQWI7QUFDQSxnQkFBSUMsZUFBZUYsYUFBYS9RLFdBQWIsQ0FBeUJrUixPQUE1QztBQUNBLGdCQUFJQyxlQUFlRixlQUFlMUMsWUFBZixHQUE4QnBRLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWlNLEdBQVYsR0FBZ0JqTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxnQkFBSXdPLGVBQWVsVCxLQUFLQyxLQUFMLENBQVcrUyxlQUFlclQsVUFBVStFLElBQXBDLENBQW5CO0FBQ0EsZ0JBQUl1TyxZQUFZalQsS0FBS0MsS0FBTCxDQUFZK1MsZUFBZXJULFVBQVUrRSxJQUExQixHQUFrQy9FLFVBQVVHLElBQXZELENBQWhCO0FBQ0Esb0JBQUs1RixPQUFMLENBQWFpWixJQUFiLENBQWtCO0FBQ2hCL1Qsb0JBQU0sa0JBRFU7QUFFaEJPLGtDQUZnQjtBQUdoQnlULHFCQUFPUixhQUFhL1EsV0FISjtBQUloQnhGLHNDQUpnQjtBQUtoQm1ELDRCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFMVDtBQU1oQm1HLHdDQU5nQjtBQU9oQitXLDBCQUFZdEQsS0FBS0UsS0FQRDtBQVFoQnZQLDZCQUFlcVAsS0FBS3hNLEtBUko7QUFTaEI3RCx1QkFBU3FRLEtBQUtDLEVBVEU7QUFVaEJzRCx3QkFBVTVVLEtBQUt1UixLQVZDO0FBV2hCN1AscUJBQU8xQixLQUFLc1IsRUFYSTtBQVloQkcscUJBQU8sSUFaUztBQWFoQjJDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQnhUO0FBakJnQixhQUFsQjtBQW1CRCxXQWhDSDtBQWlDRSxpQkFBTztBQUNMa1Isc0JBQVUsVUFETDtBQUVMalAsa0JBQU0wTyxlQUFlLENBRmhCO0FBR0xxQixtQkFBT3BCLGdCQUFnQkQsWUFIbEI7QUFJTG9CLG9CQUFRLEtBQUt4WCxLQUFMLENBQVd2RTtBQUpkLFdBakNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXVDRSxnREFBTSxPQUFPO0FBQ1grYixvQkFBUSxDQURHO0FBRVgvUCxpQkFBSyxFQUZNO0FBR1hrUCxzQkFBVSxVQUhDO0FBSVg2QyxvQkFBUSxDQUpHO0FBS1gvQixtQkFBTyxNQUxJO0FBTVh5RCw2QkFBa0JoRCxRQUFRSCxnQkFBVCxHQUNiLHFCQUFNLHlCQUFRZ0QsSUFBZCxFQUFvQkssSUFBcEIsQ0FBeUIsSUFBekIsQ0FEYSxHQUViLHlCQUFRRztBQVJELFdBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkNGLE9BREY7QUFvREQ7OzttREFFK0I1VixTLEVBQVd3RSxJLEVBQU1aLEssRUFBT2lPLE0sRUFBUWdFLFEsRUFBVXBlLGUsRUFBaUI7QUFBQTs7QUFDekYsVUFBTWlGLGNBQWM4SCxLQUFLM0ssSUFBTCxDQUFVb0osVUFBVixDQUFxQixVQUFyQixDQUFwQjtBQUNBLFVBQU1uRCxjQUFlLFFBQU8wRSxLQUFLM0ssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QwRSxLQUFLM0ssSUFBTCxDQUFVaUcsV0FBcEY7QUFDQSxVQUFNbkQsZUFBZTZILEtBQUtELFFBQUwsQ0FBYy9HLElBQW5DO0FBQ0EsVUFBTXNZLGNBQWMsS0FBS0MsY0FBTCxDQUFvQnZSLElBQXBCLENBQXBCOztBQUVBLGFBQU8sS0FBS3NNLGtDQUFMLENBQXdDOVEsU0FBeEMsRUFBbUR0RCxXQUFuRCxFQUFnRW9ELFdBQWhFLEVBQTZFbkQsWUFBN0UsRUFBMkZsRixlQUEzRixFQUE0RyxVQUFDMFksSUFBRCxFQUFPQyxJQUFQLEVBQWFyUixJQUFiLEVBQW1CMFIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEOU0sS0FBaEQsRUFBMEQ7QUFDM0ssWUFBSXFPLGdCQUFnQixFQUFwQjs7QUFFQSxZQUFJN0IsS0FBS0ksS0FBVCxFQUFnQjtBQUNkeUIsd0JBQWMzVixJQUFkLENBQW1CLFFBQUs0VixvQkFBTCxDQUEwQmxTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRG5ELFlBQS9ELEVBQTZFbEYsZUFBN0UsRUFBOEYwWSxJQUE5RixFQUFvR0MsSUFBcEcsRUFBMEdyUixJQUExRyxFQUFnSDBSLFlBQWhILEVBQThIQyxhQUE5SCxFQUE2SSxDQUE3SSxFQUFnSixFQUFFb0Ysd0JBQUYsRUFBaEosQ0FBbkI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJL1csSUFBSixFQUFVO0FBQ1JrVCwwQkFBYzNWLElBQWQsQ0FBbUIsUUFBSytWLGtCQUFMLENBQXdCclMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEbkQsWUFBN0QsRUFBMkVsRixlQUEzRSxFQUE0RjBZLElBQTVGLEVBQWtHQyxJQUFsRyxFQUF3R3JSLElBQXhHLEVBQThHMFIsWUFBOUcsRUFBNEhDLGFBQTVILEVBQTJJLENBQTNJLEVBQThJLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRCxjQUFJLENBQUNQLElBQUQsSUFBUyxDQUFDQSxLQUFLSyxLQUFuQixFQUEwQjtBQUN4QnlCLDBCQUFjM1YsSUFBZCxDQUFtQixRQUFLZ1csa0JBQUwsQ0FBd0J0UyxTQUF4QixFQUFtQ3RELFdBQW5DLEVBQWdEb0QsV0FBaEQsRUFBNkRuRCxZQUE3RCxFQUEyRWxGLGVBQTNFLEVBQTRGMFksSUFBNUYsRUFBa0dDLElBQWxHLEVBQXdHclIsSUFBeEcsRUFBOEcwUixZQUE5RyxFQUE0SEMsYUFBNUgsRUFBMkksQ0FBM0ksRUFBOEksRUFBRW9GLHdCQUFGLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJM0YsSUFBSixFQUFVO0FBQ1I4Qix3QkFBYzNWLElBQWQsQ0FBbUIsUUFBSzBaLDhCQUFMLENBQW9DaFcsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3RzBZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHJSLElBQXBILEVBQTBIMFIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixNQUFoSixFQUF3SixFQUF4SixDQUFuQjtBQUNEO0FBQ0R3QixzQkFBYzNWLElBQWQsQ0FBbUIsUUFBSzBaLDhCQUFMLENBQW9DaFcsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3RzBZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHJSLElBQXBILEVBQTBIMFIsWUFBMUgsRUFBd0ksQ0FBeEksRUFBMkksUUFBM0ksRUFBcUosRUFBckosQ0FBbkI7QUFDQSxZQUFJMVIsSUFBSixFQUFVO0FBQ1JrVCx3QkFBYzNWLElBQWQsQ0FBbUIsUUFBSzBaLDhCQUFMLENBQW9DaFcsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3RzBZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHJSLElBQXBILEVBQTBIMFIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixPQUFoSixFQUF5SixFQUF6SixDQUFuQjtBQUNEOztBQUVELGVBQ0U7QUFBQTtBQUFBO0FBQ0UseUNBQTJCL1QsV0FBM0IsU0FBMENDLFlBQTFDLFNBQTBEaUgsS0FENUQ7QUFFRSwyQ0FGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHR3FPO0FBSEgsU0FERjtBQU9ELE9BN0JNLENBQVA7QUE4QkQ7O0FBRUQ7Ozs7Z0NBRWFqUyxTLEVBQVc7QUFBQTs7QUFDdEIsVUFBSSxLQUFLM0YsS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUFuQyxFQUE2QztBQUMzQyxlQUFPLEtBQUswZixnQkFBTCxDQUFzQixVQUFDckwsV0FBRCxFQUFjQyxlQUFkLEVBQStCcUwsY0FBL0IsRUFBK0N4TCxZQUEvQyxFQUFnRTtBQUMzRixjQUFJRSxnQkFBZ0IsQ0FBaEIsSUFBcUJBLGNBQWNGLFlBQWQsS0FBK0IsQ0FBeEQsRUFBMkQ7QUFDekQsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGdCQUFjRSxXQUFwQixFQUFtQyxPQUFPLEVBQUV1TCxlQUFlLE1BQWpCLEVBQXlCdkMsU0FBUyxjQUFsQyxFQUFrRDVDLFVBQVUsVUFBNUQsRUFBd0VqUCxNQUFNOEksZUFBOUUsRUFBK0ZtSixXQUFXLGtCQUExRyxFQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsa0JBQU0sT0FBTyxFQUFFb0MsWUFBWSxNQUFkLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXNDeEw7QUFBdEM7QUFERixhQURGO0FBS0Q7QUFDRixTQVJNLENBQVA7QUFTRCxPQVZELE1BVU8sSUFBSSxLQUFLdlEsS0FBTCxDQUFXOUQsZUFBWCxLQUErQixTQUFuQyxFQUE4QztBQUFFO0FBQ3JELGVBQU8sS0FBSzhmLGVBQUwsQ0FBcUIsVUFBQ0Msa0JBQUQsRUFBcUJ6TCxlQUFyQixFQUFzQzBMLGlCQUF0QyxFQUE0RDtBQUN0RixjQUFJQSxxQkFBcUIsSUFBekIsRUFBK0I7QUFDN0IsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGVBQWFELGtCQUFuQixFQUF5QyxPQUFPLEVBQUVILGVBQWUsTUFBakIsRUFBeUJ2QyxTQUFTLGNBQWxDLEVBQWtENUMsVUFBVSxVQUE1RCxFQUF3RWpQLE1BQU04SSxlQUE5RSxFQUErRm1KLFdBQVcsa0JBQTFHLEVBQWhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxrQkFBTSxPQUFPLEVBQUVvQyxZQUFZLE1BQWQsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0NFLGtDQUF0QztBQUFBO0FBQUE7QUFERixhQURGO0FBS0QsV0FORCxNQU1PO0FBQ0wsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGVBQWFBLGtCQUFuQixFQUF5QyxPQUFPLEVBQUVILGVBQWUsTUFBakIsRUFBeUJ2QyxTQUFTLGNBQWxDLEVBQWtENUMsVUFBVSxVQUE1RCxFQUF3RWpQLE1BQU04SSxlQUE5RSxFQUErRm1KLFdBQVcsa0JBQTFHLEVBQWhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxrQkFBTSxPQUFPLEVBQUVvQyxZQUFZLE1BQWQsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0MsNkNBQWNFLHFCQUFxQixJQUFuQyxDQUF0QztBQUFBO0FBQUE7QUFERixhQURGO0FBS0Q7QUFDRixTQWRNLENBQVA7QUFlRDtBQUNGOzs7b0NBRWdCdFcsUyxFQUFXO0FBQUE7O0FBQzFCLFVBQUl3VyxjQUFlLEtBQUtyVSxJQUFMLENBQVVrQixVQUFWLElBQXdCLEtBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCb1QsWUFBckIsR0FBb0MsRUFBN0QsSUFBb0UsQ0FBdEY7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLElBQUcsWUFBUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxhQUFLUixnQkFBTCxDQUFzQixVQUFDckwsV0FBRCxFQUFjQyxlQUFkLEVBQStCcUwsY0FBL0IsRUFBK0N4TCxZQUEvQyxFQUFnRTtBQUNyRixpQkFBTyx3Q0FBTSxnQkFBY0UsV0FBcEIsRUFBbUMsT0FBTyxFQUFDaUgsUUFBUTJFLGNBQWMsRUFBdkIsRUFBMkJFLFlBQVksZUFBZSxxQkFBTSx5QkFBUUMsSUFBZCxFQUFvQmxCLElBQXBCLENBQXlCLElBQXpCLENBQXRELEVBQXNGekUsVUFBVSxVQUFoRyxFQUE0R2pQLE1BQU04SSxlQUFsSCxFQUFtSS9JLEtBQUssRUFBeEksRUFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBQVA7QUFDRCxTQUZBO0FBREgsT0FERjtBQU9EOzs7cUNBRWlCO0FBQUE7O0FBQ2hCLFVBQUk5QixZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxVQUFJLEtBQUs1RixLQUFMLENBQVdsRSxZQUFYLEdBQTBCNkosVUFBVXVCLElBQXBDLElBQTRDLEtBQUtsSCxLQUFMLENBQVdsRSxZQUFYLEdBQTBCNkosVUFBVTRXLElBQXBGLEVBQTBGLE9BQU8sRUFBUDtBQUMxRixVQUFJbkwsY0FBYyxLQUFLcFIsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVV1QixJQUF0RDtBQUNBLFVBQUltSyxXQUFXRCxjQUFjekwsVUFBVStFLElBQXZDO0FBQ0EsVUFBSThSLGNBQWUsS0FBSzFVLElBQUwsQ0FBVWtCLFVBQVYsSUFBd0IsS0FBS2xCLElBQUwsQ0FBVWtCLFVBQVYsQ0FBcUJvVCxZQUFyQixHQUFvQyxFQUE3RCxJQUFvRSxDQUF0RjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZ0JBQUssR0FEUDtBQUVFLG1CQUFTLGlCQUFDakUsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLG9CQUFLdlcsUUFBTCxDQUFjO0FBQ1o1RSw0QkFBYyxJQURGO0FBRVpELDZCQUFlLElBRkg7QUFHWnNOLGlDQUFtQjhOLFNBQVNFLENBSGhCO0FBSVovTiw2QkFBZSxRQUFLdkssS0FBTCxDQUFXbEUsWUFKZDtBQUtaWSwwQ0FBNEI7QUFMaEIsYUFBZDtBQU9ELFdBVkg7QUFXRSxrQkFBUSxnQkFBQ3liLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQjNULHVCQUFXLFlBQU07QUFDZixzQkFBSzVDLFFBQUwsQ0FBYyxFQUFFeUksbUJBQW1CLElBQXJCLEVBQTJCQyxlQUFlLFFBQUt2SyxLQUFMLENBQVdsRSxZQUFyRCxFQUFtRVksNEJBQTRCLEtBQS9GLEVBQWQ7QUFDRCxhQUZELEVBRUcsR0FGSDtBQUdELFdBZkg7QUFnQkUsa0JBQVEsaUJBQU9vRSxRQUFQLENBQWdCLFVBQUNxWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0Msb0JBQUtxRSxzQkFBTCxDQUE0QnJFLFNBQVNFLENBQXJDLEVBQXdDM1MsU0FBeEM7QUFDRCxXQUZPLEVBRUxyRyxhQUZLLENBaEJWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBTztBQUNMcVgsMEJBQVUsVUFETDtBQUVMdUUsaUNBQWlCLHlCQUFRQyxRQUZwQjtBQUdMM0Qsd0JBQVEsRUFISDtBQUlMQyx1QkFBTyxFQUpGO0FBS0xoUSxxQkFBSyxFQUxBO0FBTUxDLHNCQUFNMkosV0FBVyxDQU5aO0FBT0w0Siw4QkFBYyxLQVBUO0FBUUx4Qix3QkFBUSxNQVJIO0FBU0xpRCwyQkFBVyw2QkFUTjtBQVVMbEQsd0JBQVE7QUFWSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFFLG9EQUFNLE9BQU87QUFDWDdDLDBCQUFVLFVBREM7QUFFWDZDLHdCQUFRLElBRkc7QUFHWC9CLHVCQUFPLENBSEk7QUFJWEQsd0JBQVEsQ0FKRztBQUtYL1AscUJBQUssQ0FMTTtBQU1YNFUsNEJBQVksdUJBTkQ7QUFPWE0sNkJBQWEsdUJBUEY7QUFRWEMsMkJBQVcsZUFBZSx5QkFBUXpCO0FBUnZCLGVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBYkY7QUF1QkUsb0RBQU0sT0FBTztBQUNYeEUsMEJBQVUsVUFEQztBQUVYNkMsd0JBQVEsSUFGRztBQUdYL0IsdUJBQU8sQ0FISTtBQUlYRCx3QkFBUSxDQUpHO0FBS1g5UCxzQkFBTSxDQUxLO0FBTVhELHFCQUFLLENBTk07QUFPWDRVLDRCQUFZLHVCQVBEO0FBUVhNLDZCQUFhLHVCQVJGO0FBU1hDLDJCQUFXLGVBQWUseUJBQVF6QjtBQVR2QixlQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXZCRixXQURGO0FBb0NFO0FBQ0UsbUJBQU87QUFDTHhFLHdCQUFVLFVBREw7QUFFTDZDLHNCQUFRLElBRkg7QUFHTDBCLCtCQUFpQix5QkFBUUMsUUFIcEI7QUFJTDNELHNCQUFRZ0YsV0FKSDtBQUtML0UscUJBQU8sQ0FMRjtBQU1MaFEsbUJBQUssRUFOQTtBQU9MQyxvQkFBTTJKLFFBUEQ7QUFRTHlLLDZCQUFlO0FBUlYsYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFwQ0Y7QUFuQkYsT0FERjtBQXNFRDs7OzZDQUV5QjtBQUFBOztBQUN4QixVQUFJblcsWUFBWSxLQUFLQyxZQUFMLEVBQWhCO0FBQ0E7QUFDQSxVQUFJeUwsV0FBVyxLQUFLclIsS0FBTCxDQUFXaUwsWUFBWCxHQUEwQixDQUExQixHQUE4QixDQUFDLEtBQUtqTCxLQUFMLENBQVdoRSxZQUFaLEdBQTJCMkosVUFBVStFLElBQWxGOztBQUVBLFVBQUkvRSxVQUFVc0IsSUFBVixJQUFrQnRCLFVBQVVxRixPQUE1QixJQUF1QyxLQUFLaEwsS0FBTCxDQUFXaUwsWUFBdEQsRUFBb0U7QUFDbEUsZUFDRTtBQUFBO0FBQUE7QUFDRSxrQkFBSyxHQURQO0FBRUUscUJBQVMsaUJBQUNrTixTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsc0JBQUt2VyxRQUFMLENBQWM7QUFDWjdFLCtCQUFlLElBREg7QUFFWkMsOEJBQWMsSUFGRjtBQUdaMk4sbUNBQW1Cd04sU0FBU0UsQ0FIaEI7QUFJWnRjLDhCQUFjO0FBSkYsZUFBZDtBQU1ELGFBVEg7QUFVRSxvQkFBUSxnQkFBQ21jLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixrQkFBSXJOLGFBQWEsUUFBSy9LLEtBQUwsQ0FBV2pFLFFBQVgsR0FBc0IsUUFBS2lFLEtBQUwsQ0FBV2pFLFFBQWpDLEdBQTRDNEosVUFBVXFGLE9BQXZFO0FBQ0FFLDRCQUFjLFFBQUtsTCxLQUFMLENBQVc2SyxXQUF6QjtBQUNBLHNCQUFLaEosUUFBTCxDQUFjLEVBQUM5RixVQUFVZ1AsYUFBYSxRQUFLL0ssS0FBTCxDQUFXaEUsWUFBbkMsRUFBaURpUCxjQUFjLEtBQS9ELEVBQXNFSixhQUFhLElBQW5GLEVBQWQ7QUFDQXBHLHlCQUFXLFlBQU07QUFBRSx3QkFBSzVDLFFBQUwsQ0FBYyxFQUFFK0ksbUJBQW1CLElBQXJCLEVBQTJCNU8sY0FBYyxDQUF6QyxFQUFkO0FBQTZELGVBQWhGLEVBQWtGLEdBQWxGO0FBQ0QsYUFmSDtBQWdCRSxvQkFBUSxnQkFBQ21jLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixzQkFBS3lFLDhCQUFMLENBQW9DekUsU0FBU0UsQ0FBN0MsRUFBZ0QzUyxTQUFoRDtBQUNELGFBbEJIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUNnUixVQUFVLFVBQVgsRUFBdUIyRSxPQUFPakssUUFBOUIsRUFBd0M1SixLQUFLLENBQTdDLEVBQWdEK1IsUUFBUSxJQUF4RCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0UscUJBQU87QUFDTDdDLDBCQUFVLFVBREw7QUFFTHVFLGlDQUFpQix5QkFBUWpCLElBRnBCO0FBR0x4Qyx1QkFBTyxDQUhGO0FBSUxELHdCQUFRLEVBSkg7QUFLTGdDLHdCQUFRLENBTEg7QUFNTC9SLHFCQUFLLENBTkE7QUFPTDZULHVCQUFPLENBUEY7QUFRTHdCLHNDQUFzQixDQVJqQjtBQVNMQyx5Q0FBeUIsQ0FUcEI7QUFVTHRELHdCQUFRO0FBVkgsZUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FERjtBQWNFLG1EQUFLLFdBQVUsV0FBZixFQUEyQixPQUFPO0FBQ2hDOUMsMEJBQVUsVUFEc0I7QUFFaENsUCxxQkFBSyxDQUYyQjtBQUdoQ3VWLDZCQUFhLE1BSG1CO0FBSWhDdFYsc0JBQU0sQ0FBQyxDQUp5QjtBQUtoQytQLHVCQUFPLEtBQUtwRyxRQUxvQjtBQU1oQ21HLHdCQUFTLEtBQUsxUCxJQUFMLENBQVVrQixVQUFWLElBQXdCLEtBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCb1QsWUFBckIsR0FBb0MsRUFBN0QsSUFBb0UsQ0FONUM7QUFPaENDLDRCQUFZLGVBQWUseUJBQVFZLFdBUEg7QUFRaEMvQixpQ0FBaUIscUJBQU0seUJBQVErQixXQUFkLEVBQTJCN0IsSUFBM0IsQ0FBZ0MsR0FBaEM7QUFSZSxlQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFkRjtBQW5CRixTQURGO0FBK0NELE9BaERELE1BZ0RPO0FBQ0wsZUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFQO0FBQ0Q7QUFDRjs7O3dDQUVvQjtBQUFBOztBQUNuQixVQUFNelYsWUFBWSxLQUFLQyxZQUFMLEVBQWxCO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBVSx3QkFEWjtBQUVFLGlCQUFPO0FBQ0wrUSxzQkFBVSxVQURMO0FBRUxsUCxpQkFBSyxDQUZBO0FBR0xDLGtCQUFNLENBSEQ7QUFJTDhQLG9CQUFRLEtBQUt4WCxLQUFMLENBQVd2RSxTQUFYLEdBQXVCLEVBSjFCO0FBS0xnYyxtQkFBTyxLQUFLelgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixLQUFLeUUsS0FBTCxDQUFXeEUsY0FMMUM7QUFNTDBoQiwyQkFBZSxLQU5WO0FBT0xDLHNCQUFVLEVBUEw7QUFRTEMsMEJBQWMsZUFBZSx5QkFBUUgsV0FSaEM7QUFTTC9CLDZCQUFpQix5QkFBUW9CO0FBVHBCLFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsMkJBRFo7QUFFRSxtQkFBTztBQUNMM0Ysd0JBQVUsVUFETDtBQUVMbFAsbUJBQUssQ0FGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUw4UCxzQkFBUSxTQUpIO0FBS0xDLHFCQUFPLEtBQUt6WCxLQUFMLENBQVd6RTtBQUxiLGFBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0U7QUFBQTtBQUFBO0FBQ0UseUJBQVUsb0JBRFo7QUFFRSxxQkFBTztBQUNMOGhCLHVCQUFPLE9BREY7QUFFTDVWLHFCQUFLLENBRkE7QUFHTDZWLDBCQUFVLEVBSEw7QUFJTDlGLHdCQUFRLFNBSkg7QUFLTDBGLCtCQUFlLEtBTFY7QUFNTEssMkJBQVcsT0FOTjtBQU9MbEMsNEJBQVksQ0FQUDtBQVFMbUMsOEJBQWM7QUFSVCxlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlFO0FBQUE7QUFBQSxnQkFBTSxPQUFPLEVBQUVqRSxTQUFTLGNBQVgsRUFBMkIvQixRQUFRLEVBQW5DLEVBQXVDaUcsU0FBUyxDQUFoRCxFQUFtRDFCLFlBQVksU0FBL0QsRUFBMEVvQixVQUFVLEVBQXBGLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ksbUJBQUtuZCxLQUFMLENBQVc5RCxlQUFYLEtBQStCLFFBQWhDLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8saUJBQUMsQ0FBQyxLQUFLOEQsS0FBTCxDQUFXbEUsWUFBcEI7QUFBQTtBQUFBLGVBREgsR0FFRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyw2Q0FBYyxLQUFLa0UsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQixJQUExQixHQUFpQyxLQUFLa0UsS0FBTCxDQUFXL0QsZUFBNUMsR0FBOEQsSUFBNUUsQ0FBUDtBQUFBO0FBQUE7QUFITjtBQVpGLFdBVEY7QUE0QkU7QUFBQTtBQUFBO0FBQ0UseUJBQVUsbUJBRFo7QUFFRSxxQkFBTztBQUNMd2IsdUJBQU8sRUFERjtBQUVMNEYsdUJBQU8sT0FGRjtBQUdMM1Ysc0JBQU0sR0FIRDtBQUlMOFAsd0JBQVEsU0FKSDtBQUtMMEYsK0JBQWUsS0FMVjtBQU1McEMsdUJBQU8seUJBQVE0QyxVQU5WO0FBT0xDLDJCQUFXLFFBUE47QUFRTEosMkJBQVcsT0FSTjtBQVNMbEMsNEJBQVksQ0FUUDtBQVVMbUMsOEJBQWMsQ0FWVDtBQVdML0Qsd0JBQVE7QUFYSCxlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWVFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLG1CQUFLelosS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUFoQyxHQUNHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPLDZDQUFjLEtBQUs4RCxLQUFMLENBQVdsRSxZQUFYLEdBQTBCLElBQTFCLEdBQWlDLEtBQUtrRSxLQUFMLENBQVcvRCxlQUE1QyxHQUE4RCxJQUE1RSxDQUFQO0FBQUE7QUFBQSxlQURILEdBRUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8saUJBQUMsQ0FBQyxLQUFLK0QsS0FBTCxDQUFXbEUsWUFBcEI7QUFBQTtBQUFBO0FBSE4sYUFmRjtBQXFCRTtBQUFBO0FBQUEsZ0JBQUssT0FBTyxFQUFDOGhCLFdBQVcsTUFBWixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFrQyxtQkFBSzVkLEtBQUwsQ0FBVy9ELGVBQTdDO0FBQUE7QUFBQTtBQXJCRixXQTVCRjtBQW1ERTtBQUFBO0FBQUE7QUFDRSx5QkFBVSxjQURaO0FBRUUsdUJBQVMsS0FBSzRoQixxQkFBTCxDQUEyQjljLElBQTNCLENBQWdDLElBQWhDLENBRlg7QUFHRSxxQkFBTztBQUNMMFcsdUJBQU8sRUFERjtBQUVMNEYsdUJBQU8sT0FGRjtBQUdMUyw2QkFBYSxFQUhSO0FBSUxYLDBCQUFVLENBSkw7QUFLTDNGLHdCQUFRLFNBTEg7QUFNTDBGLCtCQUFlLEtBTlY7QUFPTHBDLHVCQUFPLHlCQUFRNEMsVUFQVjtBQVFMSCwyQkFBVyxPQVJOO0FBU0xsQyw0QkFBWSxDQVRQO0FBVUxtQyw4QkFBYyxDQVZUO0FBV0wvRCx3QkFBUTtBQVhILGVBSFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0JHLGlCQUFLelosS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUEvQixHQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQSxrQkFBSyxPQUFPLEVBQUM0ZSxPQUFPLHlCQUFRYixJQUFoQixFQUFzQnRELFVBQVUsVUFBaEMsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLHdEQUFNLE9BQU8sRUFBQ2MsT0FBTyxDQUFSLEVBQVdELFFBQVEsQ0FBbkIsRUFBc0IwRCxpQkFBaUIseUJBQVFqQixJQUEvQyxFQUFxRGdCLGNBQWMsS0FBbkUsRUFBMEV0RSxVQUFVLFVBQXBGLEVBQWdHMkUsT0FBTyxDQUFDLEVBQXhHLEVBQTRHN1QsS0FBSyxDQUFqSCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURKLGVBREM7QUFJRDtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDbVcsV0FBVyxNQUFaLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpDLGFBREosR0FPSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREM7QUFFRDtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDQSxXQUFXLE1BQVosRUFBb0I5QyxPQUFPLHlCQUFRYixJQUFuQyxFQUF5Q3RELFVBQVUsVUFBbkQsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLHdEQUFNLE9BQU8sRUFBQ2MsT0FBTyxDQUFSLEVBQVdELFFBQVEsQ0FBbkIsRUFBc0IwRCxpQkFBaUIseUJBQVFqQixJQUEvQyxFQUFxRGdCLGNBQWMsS0FBbkUsRUFBMEV0RSxVQUFVLFVBQXBGLEVBQWdHMkUsT0FBTyxDQUFDLEVBQXhHLEVBQTRHN1QsS0FBSyxDQUFqSCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURKO0FBRkM7QUF2QlA7QUFuREYsU0FiRjtBQWlHRTtBQUFBO0FBQUE7QUFDRSx1QkFBVSxXQURaO0FBRUUscUJBQVMsaUJBQUNzVyxVQUFELEVBQWdCO0FBQ3ZCLGtCQUFJLFFBQUsvZCxLQUFMLENBQVdzSyxpQkFBWCxLQUFpQyxJQUFqQyxJQUF5QyxRQUFLdEssS0FBTCxDQUFXc0ssaUJBQVgsS0FBaUN1TCxTQUE5RSxFQUF5RjtBQUN2RixvQkFBSW1JLFFBQVFELFdBQVdsVyxXQUFYLENBQXVCa1IsT0FBbkM7QUFDQSxvQkFBSWtGLFNBQVNqWSxLQUFLQyxLQUFMLENBQVcrWCxRQUFRclksVUFBVStFLElBQTdCLENBQWI7QUFDQSxvQkFBSXdULFdBQVd2WSxVQUFVdUIsSUFBVixHQUFpQitXLE1BQWhDO0FBQ0Esd0JBQUtwYyxRQUFMLENBQWM7QUFDWjdFLGlDQUFlLElBREg7QUFFWkMsZ0NBQWM7QUFGRixpQkFBZDtBQUlBLHdCQUFLb0QsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzRELElBQXJDLENBQTBDdVQsUUFBMUM7QUFDRDtBQUNGLGFBYkg7QUFjRSxtQkFBTztBQUNMO0FBQ0F2SCx3QkFBVSxVQUZMO0FBR0xsUCxtQkFBSyxDQUhBO0FBSUxDLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUpaO0FBS0xrYyxxQkFBTyxLQUFLelgsS0FBTCxDQUFXeEUsY0FMYjtBQU1MZ2Msc0JBQVEsU0FOSDtBQU9MMEYsNkJBQWUsS0FQVjtBQVFMN0IsMEJBQVksRUFSUDtBQVNMUCxxQkFBTyx5QkFBUTRDLFVBVFYsRUFkVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF3QkcsZUFBS1MsZUFBTCxDQUFxQnhZLFNBQXJCLENBeEJIO0FBeUJHLGVBQUt5WSxXQUFMLENBQWlCelksU0FBakIsQ0F6Qkg7QUEwQkcsZUFBSzBZLGNBQUw7QUExQkgsU0FqR0Y7QUE2SEcsYUFBS0Msc0JBQUw7QUE3SEgsT0FERjtBQWlJRDs7O21EQUUrQjtBQUFBOztBQUM5QixVQUFNM1ksWUFBWSxLQUFLQyxZQUFMLEVBQWxCO0FBQ0EsVUFBTTJZLGFBQWEsQ0FBbkI7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLDBCQURaO0FBRUUsaUJBQU87QUFDTDlHLG1CQUFPOVIsVUFBVXNNLEdBRFo7QUFFTHVGLG9CQUFRK0csYUFBYSxDQUZoQjtBQUdMNUgsc0JBQVUsVUFITDtBQUlMdUUsNkJBQWlCLHlCQUFRSyxXQUpwQjtBQUtMcUIsdUJBQVcsZUFBZSx5QkFBUUssV0FMN0I7QUFNTEcsMEJBQWMsZUFBZSx5QkFBUUg7QUFOaEMsV0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUE7QUFDRSxrQkFBSyxHQURQO0FBRUUscUJBQVMsaUJBQUM5RSxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsc0JBQUt2VyxRQUFMLENBQWM7QUFDWjRKLHVDQUF1QjJNLFNBQVNFLENBRHBCO0FBRVozTSxnQ0FBZ0IsUUFBSzNMLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBRko7QUFHWmlRLDhCQUFjLFFBQUs5TCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUhGO0FBSVphLDRDQUE0QjtBQUpoQixlQUFkO0FBTUQsYUFUSDtBQVVFLG9CQUFRLGdCQUFDeWIsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CLHNCQUFLdlcsUUFBTCxDQUFjO0FBQ1o0Six1Q0FBdUIsS0FEWDtBQUVaRSxnQ0FBZ0IsSUFGSjtBQUdaRyw4QkFBYyxJQUhGO0FBSVpwUCw0Q0FBNEI7QUFKaEIsZUFBZDtBQU1ELGFBakJIO0FBa0JFLG9CQUFRLGlCQUFPb0UsUUFBUCxDQUFnQixVQUFDcVgsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9DLHNCQUFLdlcsUUFBTCxDQUFjLEVBQUVsRixzQkFBc0JnSixVQUFVdU0sR0FBVixHQUFnQixDQUF4QyxFQUFkLEVBRCtDLENBQ1k7QUFDM0Qsa0JBQUksQ0FBQyxRQUFLbFMsS0FBTCxDQUFXdUwscUJBQVosSUFBcUMsQ0FBQyxRQUFLdkwsS0FBTCxDQUFXd0wsc0JBQXJELEVBQTZFO0FBQzNFLHdCQUFLZ1QsdUJBQUwsQ0FBNkJwRyxTQUFTRSxDQUF0QyxFQUF5Q0YsU0FBU0UsQ0FBbEQsRUFBcUQzUyxTQUFyRDtBQUNEO0FBQ0YsYUFMTyxFQUtMckcsYUFMSyxDQWxCVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF3QkU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTHFYLDBCQUFVLFVBREw7QUFFTHVFLGlDQUFpQix5QkFBUXVELGFBRnBCO0FBR0xqSCx3QkFBUStHLGFBQWEsQ0FIaEI7QUFJTDdXLHNCQUFNL0IsVUFBVXVNLEdBSlg7QUFLTHVGLHVCQUFPOVIsVUFBVXdNLEdBQVYsR0FBZ0J4TSxVQUFVdU0sR0FBMUIsR0FBZ0MsRUFMbEM7QUFNTCtJLDhCQUFjc0QsVUFOVDtBQU9MOUUsd0JBQVE7QUFQSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLHNCQUFLLEdBRFA7QUFFRSx5QkFBUyxpQkFBQ3RCLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLdlcsUUFBTCxDQUFjLEVBQUUwSix1QkFBdUI2TSxTQUFTRSxDQUFsQyxFQUFxQzNNLGdCQUFnQixRQUFLM0wsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBckQsRUFBc0ZpUSxjQUFjLFFBQUs5TCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUFwRyxFQUFkO0FBQXNKLGlCQUY1TDtBQUdFLHdCQUFRLGdCQUFDc2MsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUt2VyxRQUFMLENBQWMsRUFBRTBKLHVCQUF1QixLQUF6QixFQUFnQ0ksZ0JBQWdCLElBQWhELEVBQXNERyxjQUFjLElBQXBFLEVBQWQ7QUFBMkYsaUJBSGhJO0FBSUUsd0JBQVEsaUJBQU9oTCxRQUFQLENBQWdCLFVBQUNxWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS29HLHVCQUFMLENBQTZCcEcsU0FBU0UsQ0FBVCxHQUFhM1MsVUFBVXVNLEdBQXBELEVBQXlELENBQXpELEVBQTREdk0sU0FBNUQ7QUFBd0UsaUJBQW5ILEVBQXFIckcsYUFBckgsQ0FKVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLRSxxREFBSyxPQUFPLEVBQUVtWSxPQUFPLEVBQVQsRUFBYUQsUUFBUSxFQUFyQixFQUF5QmIsVUFBVSxVQUFuQyxFQUErQzhDLFFBQVEsV0FBdkQsRUFBb0UvUixNQUFNLENBQTFFLEVBQTZFdVQsY0FBYyxLQUEzRixFQUFrR0MsaUJBQWlCLHlCQUFRQyxRQUEzSCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGLGFBVkY7QUFpQkU7QUFBQTtBQUFBO0FBQ0Usc0JBQUssR0FEUDtBQUVFLHlCQUFTLGlCQUFDaEQsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUt2VyxRQUFMLENBQWMsRUFBRTJKLHdCQUF3QjRNLFNBQVNFLENBQW5DLEVBQXNDM00sZ0JBQWdCLFFBQUszTCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUF0RCxFQUF1RmlRLGNBQWMsUUFBSzlMLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQXJHLEVBQWQ7QUFBdUosaUJBRjdMO0FBR0Usd0JBQVEsZ0JBQUNzYyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS3ZXLFFBQUwsQ0FBYyxFQUFFMkosd0JBQXdCLEtBQTFCLEVBQWlDRyxnQkFBZ0IsSUFBakQsRUFBdURHLGNBQWMsSUFBckUsRUFBZDtBQUE0RixpQkFIakk7QUFJRSx3QkFBUSxpQkFBT2hMLFFBQVAsQ0FBZ0IsVUFBQ3FYLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLb0csdUJBQUwsQ0FBNkIsQ0FBN0IsRUFBZ0NwRyxTQUFTRSxDQUFULEdBQWEzUyxVQUFVdU0sR0FBdkQsRUFBNER2TSxTQUE1RDtBQUF3RSxpQkFBbkgsRUFBcUhyRyxhQUFySCxDQUpWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtFLHFEQUFLLE9BQU8sRUFBRW1ZLE9BQU8sRUFBVCxFQUFhRCxRQUFRLEVBQXJCLEVBQXlCYixVQUFVLFVBQW5DLEVBQStDOEMsUUFBUSxXQUF2RCxFQUFvRTZCLE9BQU8sQ0FBM0UsRUFBOEVMLGNBQWMsS0FBNUYsRUFBbUdDLGlCQUFpQix5QkFBUUMsUUFBNUgsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMRjtBQWpCRjtBQXhCRixTQVZGO0FBNERFO0FBQUE7QUFBQSxZQUFLLE9BQU8sRUFBRTFELE9BQU8sS0FBS3pYLEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsS0FBS3lFLEtBQUwsQ0FBV3hFLGNBQXhDLEdBQXlELEVBQWxFLEVBQXNFa00sTUFBTSxFQUE1RSxFQUFnRmlQLFVBQVUsVUFBMUYsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRSxpREFBSyxPQUFPO0FBQ1ZBLHdCQUFVLFVBREE7QUFFVm1GLDZCQUFlLE1BRkw7QUFHVnRFLHNCQUFRK0csYUFBYSxDQUhYO0FBSVY5RyxxQkFBTyxDQUpHO0FBS1Z5RCwrQkFBaUIseUJBQVFqQixJQUxmO0FBTVZ2UyxvQkFBUSxLQUFLMUgsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVVxRixPQUFyQyxHQUFnRCxHQUFqRCxHQUF3RDtBQU5wRCxhQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBNURGLE9BREY7QUF5RUQ7OzsyQ0FFdUI7QUFDdEIsYUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBVSxXQURaO0FBRUUsaUJBQU87QUFDTHlNLG1CQUFPLE1BREY7QUFFTEQsb0JBQVEsRUFGSDtBQUdMMEQsNkJBQWlCLHlCQUFRb0IsSUFIcEI7QUFJTDVFLHNCQUFVLFNBSkw7QUFLTGYsc0JBQVUsT0FMTDtBQU1MK0gsb0JBQVEsQ0FOSDtBQU9MaFgsa0JBQU0sQ0FQRDtBQVFMOFIsb0JBQVE7QUFSSCxXQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlHLGFBQUttRiw0QkFBTCxFQVpIO0FBYUcsYUFBS0MsOEJBQUw7QUFiSCxPQURGO0FBaUJEOzs7cURBRTJFO0FBQUEsVUFBL0NwZixJQUErQyxTQUEvQ0EsSUFBK0M7QUFBQSxVQUF6Q3VRLE9BQXlDLFNBQXpDQSxPQUF5QztBQUFBLFVBQWhDeEcsS0FBZ0MsU0FBaENBLEtBQWdDO0FBQUEsVUFBekJ5RyxRQUF5QixTQUF6QkEsUUFBeUI7QUFBQSxVQUFmdUQsV0FBZSxTQUFmQSxXQUFlOztBQUMxRTtBQUNBO0FBQ0EsVUFBTWlFLFNBQVNqRSxnQkFBZ0IsTUFBaEIsR0FBeUIsRUFBekIsR0FBOEIsRUFBN0M7QUFDQSxVQUFNdUgsUUFBUXRiLEtBQUtrSyxZQUFMLEdBQW9CLHlCQUFRdVEsSUFBNUIsR0FBbUMseUJBQVF5RCxVQUF6RDtBQUNBLFVBQU1qWSxjQUFlLFFBQU9qRyxLQUFLaUcsV0FBWixNQUE0QixRQUE3QixHQUF5QyxLQUF6QyxHQUFpRGpHLEtBQUtpRyxXQUExRTs7QUFFQSxhQUNHc0ssWUFBWSxHQUFiLEdBQ0s7QUFBQTtBQUFBLFVBQUssT0FBTyxFQUFDeUgsUUFBUSxFQUFULEVBQWErQixTQUFTLGNBQXRCLEVBQXNDSSxXQUFXLGlCQUFqRCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLGdDQUFTbmEsS0FBS29KLFVBQUwsQ0FBZ0IsYUFBaEIsS0FBa0NuRCxXQUEzQyxFQUF3RCxFQUF4RDtBQURBLE9BREwsR0FJSztBQUFBO0FBQUEsVUFBTSxXQUFVLFdBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQTtBQUNFLG1CQUFPO0FBQ0w4VCx1QkFBUyxjQURKO0FBRUw0RCx3QkFBVSxFQUZMO0FBR0x4Ryx3QkFBVSxVQUhMO0FBSUw2QyxzQkFBUSxJQUpIO0FBS0wwRCw2QkFBZSxRQUxWO0FBTUxwQyxxQkFBTyx5QkFBUStELFNBTlY7QUFPTGYsMkJBQWEsQ0FQUjtBQVFMRix5QkFBVztBQVJOLGFBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV0Usa0RBQU0sT0FBTyxFQUFDa0IsWUFBWSxDQUFiLEVBQWdCNUQsaUJBQWlCLHlCQUFRMkQsU0FBekMsRUFBb0RsSSxVQUFVLFVBQTlELEVBQTBFYyxPQUFPLENBQWpGLEVBQW9GRCxRQUFRQSxNQUE1RixFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQVhGO0FBWUU7QUFBQTtBQUFBLGNBQU0sT0FBTyxFQUFDc0gsWUFBWSxDQUFiLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVpGLFNBREM7QUFlRDtBQUFBO0FBQUE7QUFDRSxtQkFBTztBQUNMaEUsMEJBREs7QUFFTG5FLHdCQUFVLFVBRkw7QUFHTDZDLHNCQUFRO0FBSEgsYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNRyxrQ0FBU2hhLEtBQUtvSixVQUFMLENBQWdCLGFBQWhCLFdBQXNDbkQsV0FBdEMsTUFBVCxFQUErRCxDQUEvRDtBQU5IO0FBZkMsT0FMUDtBQThCRDs7OzhDQUUwQjBFLEksRUFBTVosSyxFQUFPaU8sTSxFQUFRM0MsSyxFQUFPO0FBQUE7O0FBQ3JELFVBQUl4UyxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLDBDQUE4QnZHLFdBQTlCLFNBQTZDa0gsS0FEL0M7QUFFRSxxQkFBVSxpQ0FGWjtBQUdFLCtCQUFtQmxILFdBSHJCO0FBSUUsbUJBQVMsbUJBQU07QUFDYjtBQUNBLGdCQUFJOEgsS0FBSzNLLElBQUwsQ0FBVWtLLFlBQWQsRUFBNEI7QUFDMUIsc0JBQUsyRixZQUFMLENBQWtCbEYsS0FBSzNLLElBQXZCLEVBQTZCNkMsV0FBN0I7QUFDQSxzQkFBS3RDLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGlCQUE1QixFQUErQyxDQUFDLFFBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0I4QixXQUFwQixDQUEvQyxFQUFpRixZQUFNLENBQUUsQ0FBekY7QUFDRCxhQUhELE1BR087QUFDTCxzQkFBSzJILFVBQUwsQ0FBZ0JHLEtBQUszSyxJQUFyQixFQUEyQjZDLFdBQTNCO0FBQ0Esc0JBQUt0QyxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixlQUE1QixFQUE2QyxDQUFDLFFBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0I4QixXQUFwQixDQUE3QyxFQUErRSxZQUFNLENBQUUsQ0FBdkY7QUFDRDtBQUNGLFdBYkg7QUFjRSxpQkFBTztBQUNMa1gscUJBQVMsT0FESjtBQUVMd0YseUJBQWEsT0FGUjtBQUdMdkgsb0JBQVFyTixLQUFLM0ssSUFBTCxDQUFVa0ssWUFBVixHQUF5QixDQUF6QixHQUE2QjhOLE1BSGhDO0FBSUxDLG1CQUFPLE1BSkY7QUFLTGdDLG9CQUFRLFNBTEg7QUFNTDlDLHNCQUFVLFVBTkw7QUFPTDZDLG9CQUFRLElBUEg7QUFRTDBCLDZCQUFpQi9RLEtBQUszSyxJQUFMLENBQVVrSyxZQUFWLEdBQXlCLGFBQXpCLEdBQXlDLHlCQUFRc1YsVUFSN0Q7QUFTTDlCLDJCQUFlLEtBVFY7QUFVTCtCLHFCQUFVOVUsS0FBSzNLLElBQUwsQ0FBVXVQLFVBQVgsR0FBeUIsSUFBekIsR0FBZ0M7QUFWcEMsV0FkVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkcsU0FBQzVFLEtBQUszSyxJQUFMLENBQVVrSyxZQUFYLElBQTJCO0FBQzFCLCtDQUFLLE9BQU87QUFDVmlOLHNCQUFVLFVBREE7QUFFVjZDLG9CQUFRLElBRkU7QUFHVjlSLGtCQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBSHpCO0FBSVZrTSxpQkFBSyxDQUpLO0FBS1Z5VCw2QkFBaUIseUJBQVE4RCxVQUxmO0FBTVZ2SCxtQkFBTyxFQU5HO0FBT1ZELG9CQUFRLEtBQUt4WCxLQUFMLENBQVd2RSxTQVBULEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBM0JKO0FBbUNFO0FBQUE7QUFBQSxZQUFLLE9BQU87QUFDVjhkLHVCQUFTLFlBREM7QUFFVjlCLHFCQUFPLEtBQUt6WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEdBRjFCO0FBR1ZpYyxzQkFBUSxTQUhFO0FBSVZiLHdCQUFVLFVBSkE7QUFLVjZDLHNCQUFRLENBTEU7QUFNVjBCLCtCQUFrQi9RLEtBQUszSyxJQUFMLENBQVVrSyxZQUFYLEdBQTJCLGFBQTNCLEdBQTJDLHlCQUFRc1Y7QUFOMUQsYUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUV4SCxjQUFGLEVBQVVvRyxXQUFXLENBQUMsQ0FBdEIsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSx1QkFBTztBQUNMa0IsOEJBQVk7QUFEUCxpQkFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJSTNVLG1CQUFLM0ssSUFBTCxDQUFVa0ssWUFBWCxHQUNLO0FBQUE7QUFBQSxrQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRWpDLEtBQUssQ0FBUCxFQUFVQyxNQUFNLENBQUMsQ0FBakIsRUFBbEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdELHlFQUFlLE9BQU8seUJBQVF1UyxJQUE5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeEQsZUFETCxHQUVLO0FBQUE7QUFBQSxrQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRXhTLEtBQUssQ0FBUCxFQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOUM7QUFOUixhQURGO0FBVUcsaUJBQUt5WCx5QkFBTCxDQUErQi9VLElBQS9CO0FBVkg7QUFSRixTQW5DRjtBQXdERTtBQUFBO0FBQUEsWUFBSyxXQUFVLGtDQUFmLEVBQWtELE9BQU8sRUFBRW9QLFNBQVMsWUFBWCxFQUF5QjlCLE9BQU8sS0FBS3pYLEtBQUwsQ0FBV3hFLGNBQTNDLEVBQTJEZ2MsUUFBUSxTQUFuRSxFQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSSxXQUFDck4sS0FBSzNLLElBQUwsQ0FBVWtLLFlBQVosR0FBNEIsS0FBS3lWLHVDQUFMLENBQTZDaFYsSUFBN0MsQ0FBNUIsR0FBaUY7QUFEcEY7QUF4REYsT0FERjtBQThERDs7O3NDQUVrQkEsSSxFQUFNWixLLEVBQU9pTyxNLEVBQVEzQyxLLEVBQU91Syx1QixFQUF5QjtBQUFBOztBQUN0RSxVQUFJelosWUFBWSxLQUFLQyxZQUFMLEVBQWhCO0FBQ0EsVUFBSXlaLFlBQVksb0NBQXFCbFYsS0FBS0QsUUFBTCxDQUFjL0csSUFBbkMsQ0FBaEI7QUFDQSxVQUFJZCxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxVQUFJbkQsY0FBZSxRQUFPMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWpCLE1BQWlDLFFBQWxDLEdBQThDLEtBQTlDLEdBQXNEMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWxGO0FBQ0EsVUFBSW5ELGVBQWU2SCxLQUFLRCxRQUFMLElBQWlCQyxLQUFLRCxRQUFMLENBQWMvRyxJQUFsRDs7QUFFQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGlDQUFxQm9HLEtBQXJCLFNBQThCbEgsV0FBOUIsU0FBNkNDLFlBRC9DO0FBRUUscUJBQVUsY0FGWjtBQUdFLGlCQUFPO0FBQ0xrViwwQkFESztBQUVMQyxtQkFBTyxLQUFLelgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixLQUFLeUUsS0FBTCxDQUFXeEUsY0FGMUM7QUFHTGtNLGtCQUFNLENBSEQ7QUFJTHVYLHFCQUFVOVUsS0FBSzNLLElBQUwsQ0FBVXVQLFVBQVgsR0FBeUIsR0FBekIsR0FBK0IsR0FKbkM7QUFLTDRILHNCQUFVO0FBTEwsV0FIVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUE7QUFDRSxxQkFBUyxtQkFBTTtBQUNiO0FBQ0Esa0JBQUl6WiwyQkFBMkIsaUJBQU95TCxLQUFQLENBQWEsUUFBSzNJLEtBQUwsQ0FBVzlDLHdCQUF4QixDQUEvQjtBQUNBQSx1Q0FBeUJpTixLQUFLZ0ssVUFBOUIsSUFBNEMsQ0FBQ2pYLHlCQUF5QmlOLEtBQUtnSyxVQUE5QixDQUE3QztBQUNBLHNCQUFLdFMsUUFBTCxDQUFjO0FBQ1o3RSwrQkFBZSxJQURILEVBQ1M7QUFDckJDLDhCQUFjLElBRkYsRUFFUTtBQUNwQkM7QUFIWSxlQUFkO0FBS0QsYUFWSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXSWlOLGVBQUtpSyxnQkFBTixHQUNHO0FBQUE7QUFBQTtBQUNBLHFCQUFPO0FBQ0x1QywwQkFBVSxVQURMO0FBRUxjLHVCQUFPLEVBRkY7QUFHTC9QLHNCQUFNLEdBSEQ7QUFJTEQscUJBQUssQ0FBQyxDQUpEO0FBS0wrUix3QkFBUSxJQUxIO0FBTUwrRCwyQkFBVyxPQU5OO0FBT0wvRix3QkFBUTtBQVBILGVBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUE7QUFBQTtBQUFBLGdCQUFNLFdBQVUsVUFBaEIsRUFBMkIsT0FBTyxFQUFFL1AsS0FBSyxDQUFDLENBQVIsRUFBV0MsTUFBTSxDQUFDLENBQWxCLEVBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF5RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF6RDtBQVZBLFdBREgsR0FhRyxFQXhCTjtBQTBCSSxXQUFDMFgsdUJBQUQsSUFBNEJDLGNBQWMsa0JBQTNDLElBQ0MsdUNBQUssT0FBTztBQUNWMUksd0JBQVUsVUFEQTtBQUVWalAsb0JBQU0sRUFGSTtBQUdWK1AscUJBQU8sQ0FIRztBQUlWK0Isc0JBQVEsSUFKRTtBQUtWNkMsMEJBQVksZUFBZSx5QkFBUXdDLFNBTHpCO0FBTVZySDtBQU5VLGFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBM0JKO0FBb0NFO0FBQUE7QUFBQTtBQUNFLHlCQUFVLDhCQURaO0FBRUUscUJBQU87QUFDTDhELHVCQUFPLENBREY7QUFFTDdELHVCQUFPLEtBQUt6WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRi9CO0FBR0xpYyx3QkFBUSxLQUFLeFgsS0FBTCxDQUFXdkUsU0FIZDtBQUlMOGhCLDJCQUFXLE9BSk47QUFLTHJDLGlDQUFpQix5QkFBUUgsSUFMcEI7QUFNTHZCLHdCQUFRLElBTkg7QUFPTDdDLDBCQUFVLFVBUEw7QUFRTDBFLDRCQUFZLENBUlA7QUFTTG1DLDhCQUFjO0FBVFQsZUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhRTtBQUFBO0FBQUEsZ0JBQUssT0FBTztBQUNWOEIsaUNBQWUsV0FETDtBQUVWbkMsNEJBQVUsRUFGQTtBQUdWMUYseUJBQU8sRUFIRztBQUlWOEgsOEJBQVksQ0FKRjtBQUtWbEMseUJBQU8sT0FMRztBQU1WdkMseUJBQU8seUJBQVFiLElBTkw7QUFPVk4sNkJBQVcwRixjQUFjLGtCQUFkLEdBQW1DLGtCQUFuQyxHQUF3RCxpQkFQekQ7QUFRVjFJLDRCQUFVO0FBUkEsaUJBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUcwSTtBQVZIO0FBYkY7QUFwQ0YsU0FWRjtBQXlFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLHNCQUFmO0FBQ0UsbUJBQU87QUFDTDFJLHdCQUFVLFVBREw7QUFFTGpQLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRjlCO0FBR0xrYyxxQkFBTyxFQUhGO0FBSUxoUSxtQkFBSyxDQUpBO0FBS0wrUCxzQkFBUSxLQUFLeFgsS0FBTCxDQUFXdkUsU0FBWCxHQUF1QixDQUwxQjtBQU1MOGhCLHlCQUFXO0FBTk4sYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTRTtBQUNFLG9CQUFRLElBRFY7QUFFRSxrQkFBTXBULElBRlI7QUFHRSxtQkFBT1osS0FIVDtBQUlFLG9CQUFRaU8sTUFKVjtBQUtFLHVCQUFXN1IsU0FMYjtBQU1FLHVCQUFXLEtBQUt0RixVQU5sQjtBQU9FLDZCQUFpQixLQUFLTCxLQUFMLENBQVc1RCxlQVA5QjtBQVFFLDBCQUFjLEtBQUttYixzQkFBTCxDQUE0QjVSLFNBQTVCLENBUmhCO0FBU0UsMEJBQWMsS0FBSzNGLEtBQUwsQ0FBVzdELG1CQVQzQjtBQVVFLHVCQUFXLEtBQUs2RCxLQUFMLENBQVd2RSxTQVZ4QjtBQVdFLDJCQUFlLEtBQUt1RSxLQUFMLENBQVdoRCxhQVg1QjtBQVlFLGdDQUFvQixLQUFLZ0QsS0FBTCxDQUFXM0Msa0JBWmpDO0FBYUUsNkJBQWlCLEtBQUsyQyxLQUFMLENBQVc1QyxlQWI5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFURixTQXpFRjtBQWlHRTtBQUFBO0FBQUE7QUFDRSwyQkFBZSx1QkFBQ3diLFlBQUQsRUFBa0I7QUFDL0JBLDJCQUFhQyxlQUFiO0FBQ0Esa0JBQUlDLGVBQWVGLGFBQWEvUSxXQUFiLENBQXlCa1IsT0FBNUM7QUFDQSxrQkFBSUMsZUFBZUYsZUFBZW5ULFVBQVVpTSxHQUE1QztBQUNBLGtCQUFJc0gsZUFBZWxULEtBQUtDLEtBQUwsQ0FBVytTLGVBQWVyVCxVQUFVK0UsSUFBcEMsQ0FBbkI7QUFDQSxrQkFBSXVPLFlBQVlqVCxLQUFLQyxLQUFMLENBQVkrUyxlQUFlclQsVUFBVStFLElBQTFCLEdBQWtDL0UsVUFBVUcsSUFBdkQsQ0FBaEI7QUFDQSxzQkFBSzVGLE9BQUwsQ0FBYWlaLElBQWIsQ0FBa0I7QUFDaEIvVCxzQkFBTSxjQURVO0FBRWhCTyxvQ0FGZ0I7QUFHaEJ5VCx1QkFBT1IsYUFBYS9RLFdBSEo7QUFJaEJ4Rix3Q0FKZ0I7QUFLaEJDLDBDQUxnQjtBQU1oQmtELDhCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFOVDtBQU9oQjJjLDBDQVBnQjtBQVFoQkUsMENBUmdCO0FBU2hCRSwwQ0FUZ0I7QUFVaEJELG9DQVZnQjtBQVdoQnhUO0FBWGdCLGVBQWxCO0FBYUQsYUFwQkg7QUFxQkUsdUJBQVUsZ0NBckJaO0FBc0JFLHlCQUFhLHVCQUFNO0FBQ2pCLGtCQUFJakUsTUFBTTJJLEtBQUs5SCxXQUFMLEdBQW1CLEdBQW5CLEdBQXlCOEgsS0FBS0QsUUFBTCxDQUFjL0csSUFBakQ7QUFDQTtBQUNBLGtCQUFJLENBQUMsUUFBS25ELEtBQUwsQ0FBV2xELGFBQVgsQ0FBeUIwRSxHQUF6QixDQUFMLEVBQW9DO0FBQ2xDLG9CQUFJMUUsZ0JBQWdCLEVBQXBCO0FBQ0FBLDhCQUFjMEUsR0FBZCxJQUFxQixJQUFyQjtBQUNBLHdCQUFLSyxRQUFMLENBQWMsRUFBRS9FLDRCQUFGLEVBQWQ7QUFDRDtBQUNGLGFBOUJIO0FBK0JFLG1CQUFPO0FBQ0w2Wix3QkFBVSxVQURMO0FBRUxjLHFCQUFPLEtBQUt6WCxLQUFMLENBQVd4RSxjQUZiO0FBR0xrTSxvQkFBTSxLQUFLMUgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixDQUg5QixFQUdpQztBQUN0Q2tNLG1CQUFLLENBSkE7QUFLTCtQLHNCQUFRO0FBTEgsYUEvQlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0NHLGVBQUtnSSw4QkFBTCxDQUFvQzdaLFNBQXBDLEVBQStDd0UsSUFBL0MsRUFBcURaLEtBQXJELEVBQTREaU8sTUFBNUQsRUFBb0UzQyxLQUFwRSxFQUEyRSxLQUFLN1UsS0FBTCxDQUFXNUMsZUFBdEY7QUF0Q0g7QUFqR0YsT0FERjtBQTRJRDs7O3FDQUVpQitNLEksRUFBTVosSyxFQUFPaU8sTSxFQUFRM0MsSyxFQUFPdUssdUIsRUFBeUI7QUFBQTs7QUFDckUsVUFBSXpaLFlBQVksS0FBS0MsWUFBTCxFQUFoQjtBQUNBLFVBQUl2RCxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxVQUFJbkQsY0FBZSxRQUFPMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWpCLE1BQWlDLFFBQWxDLEdBQThDLEtBQTlDLEdBQXNEMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWxGO0FBQ0EsVUFBSWtQLGNBQWN4SyxLQUFLd0ssV0FBdkI7QUFDQSxVQUFJdlgsa0JBQWtCLEtBQUs0QyxLQUFMLENBQVc1QyxlQUFqQztBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UseUNBQTZCbU0sS0FBN0IsU0FBc0NsSCxXQUF0QyxTQUFxRHNTLFdBRHZEO0FBRUUscUJBQVUsc0JBRlo7QUFHRSxtQkFBUyxtQkFBTTtBQUNiO0FBQ0EsZ0JBQUl6WCwyQkFBMkIsaUJBQU95TCxLQUFQLENBQWEsUUFBSzNJLEtBQUwsQ0FBVzlDLHdCQUF4QixDQUEvQjtBQUNBQSxxQ0FBeUJpTixLQUFLZ0ssVUFBOUIsSUFBNEMsQ0FBQ2pYLHlCQUF5QmlOLEtBQUtnSyxVQUE5QixDQUE3QztBQUNBLG9CQUFLdFMsUUFBTCxDQUFjO0FBQ1o3RSw2QkFBZSxJQURIO0FBRVpDLDRCQUFjLElBRkY7QUFHWkM7QUFIWSxhQUFkO0FBS0QsV0FaSDtBQWFFLHlCQUFlLHVCQUFDMGIsWUFBRCxFQUFrQjtBQUMvQkEseUJBQWFDLGVBQWI7QUFDQSxnQkFBSTNiLDJCQUEyQixpQkFBT3lMLEtBQVAsQ0FBYSxRQUFLM0ksS0FBTCxDQUFXOUMsd0JBQXhCLENBQS9CO0FBQ0FBLHFDQUF5QmlOLEtBQUtnSyxVQUE5QixJQUE0QyxDQUFDalgseUJBQXlCaU4sS0FBS2dLLFVBQTlCLENBQTdDO0FBQ0Esb0JBQUt0UyxRQUFMLENBQWM7QUFDWjdFLDZCQUFlLElBREg7QUFFWkMsNEJBQWMsSUFGRjtBQUdaQztBQUhZLGFBQWQ7QUFLRCxXQXRCSDtBQXVCRSxpQkFBTztBQUNMc2EsMEJBREs7QUFFTEMsbUJBQU8sS0FBS3pYLEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsS0FBS3lFLEtBQUwsQ0FBV3hFLGNBRjFDO0FBR0xrTSxrQkFBTSxDQUhEO0FBSUx1WCxxQkFBVTlVLEtBQUszSyxJQUFMLENBQVV1UCxVQUFYLEdBQXlCLEdBQXpCLEdBQStCLEdBSm5DO0FBS0w0SCxzQkFBVSxVQUxMO0FBTUw4QyxvQkFBUTtBQU5ILFdBdkJUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQStCRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxXQUFDMkYsdUJBQUQsSUFDQyx1Q0FBSyxPQUFPO0FBQ1Z6SSx3QkFBVSxVQURBO0FBRVZqUCxvQkFBTSxFQUZJO0FBR1YrUCxxQkFBTyxDQUhHO0FBSVYrQixzQkFBUSxJQUpFO0FBS1Y2QywwQkFBWSxlQUFlLHlCQUFRd0MsU0FMekI7QUFNVnJIO0FBTlUsYUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFGSjtBQVdFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0xiLDBCQUFVLFVBREw7QUFFTGpQLHNCQUFNLEdBRkQ7QUFHTCtQLHVCQUFPLEVBSEY7QUFJTEQsd0JBQVE7QUFKSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9FO0FBQUE7QUFBQSxnQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRS9QLEtBQUssQ0FBQyxDQUFSLEVBQVdDLE1BQU0sQ0FBQyxDQUFsQixFQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBekQ7QUFQRixXQVhGO0FBb0JFO0FBQUE7QUFBQTtBQUNFLHlCQUFVLHNDQURaO0FBRUUscUJBQU87QUFDTGlQLDBCQUFVLFVBREw7QUFFTDJFLHVCQUFPLENBRkY7QUFHTDdELHVCQUFPLEtBQUt6WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBSC9CO0FBSUxpYyx3QkFBUSxLQUFLeFgsS0FBTCxDQUFXdkUsU0FKZDtBQUtMNGYsNEJBQVksQ0FMUDtBQU1MbUMsOEJBQWMsRUFOVDtBQU9MdEMsaUNBQWlCLHlCQUFRSCxJQVBwQjtBQVFMdkIsd0JBQVEsSUFSSDtBQVNMK0QsMkJBQVc7QUFUTixlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFFO0FBQUE7QUFBQSxnQkFBTSxPQUFPO0FBQ1grQixpQ0FBZSxXQURKO0FBRVhuQyw0QkFBVSxFQUZDO0FBR1hyQyx5QkFBTyx5QkFBUWY7QUFISixpQkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLR3BGO0FBTEg7QUFiRjtBQXBCRixTQS9CRjtBQXlFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLDhCQUFmO0FBQ0UsbUJBQU87QUFDTGdDLHdCQUFVLFVBREw7QUFFTGpQLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRjlCO0FBR0xrYyxxQkFBTyxFQUhGO0FBSUxoUSxtQkFBSyxDQUpBO0FBS0wrUCxzQkFBUSxFQUxIO0FBTUwrRix5QkFBVztBQU5OLGFBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0U7QUFDRSxvQkFBUSxJQURWO0FBRUUsa0JBQU1wVCxJQUZSO0FBR0UsbUJBQU9aLEtBSFQ7QUFJRSxvQkFBUWlPLE1BSlY7QUFLRSx1QkFBVzdSLFNBTGI7QUFNRSx1QkFBVyxLQUFLdEYsVUFObEI7QUFPRSw2QkFBaUIsS0FBS0wsS0FBTCxDQUFXNUQsZUFQOUI7QUFRRSwwQkFBYyxLQUFLbWIsc0JBQUwsQ0FBNEI1UixTQUE1QixDQVJoQjtBQVNFLDBCQUFjLEtBQUszRixLQUFMLENBQVc3RCxtQkFUM0I7QUFVRSx1QkFBVyxLQUFLNkQsS0FBTCxDQUFXdkUsU0FWeEI7QUFXRSxnQ0FBb0IsS0FBS3VFLEtBQUwsQ0FBVzNDLGtCQVhqQztBQVlFLDZCQUFpQkQsZUFabkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVEYsU0F6RUY7QUFnR0U7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsd0NBRFo7QUFFRSxtQkFBTztBQUNMc2Esd0JBQVUsUUFETDtBQUVMZix3QkFBVSxVQUZMO0FBR0xjLHFCQUFPLEtBQUt6WCxLQUFMLENBQVd4RSxjQUhiO0FBSUxrTSxvQkFBTSxLQUFLMUgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixDQUo5QixFQUlpQztBQUN0Q2tNLG1CQUFLLENBTEE7QUFNTCtQLHNCQUFRO0FBTkgsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRyxlQUFLRyxtQ0FBTCxDQUF5Q2hTLFNBQXpDLEVBQW9EdEQsV0FBcEQsRUFBaUVvRCxXQUFqRSxFQUE4RSxDQUFDMEUsSUFBRCxDQUE5RSxFQUFzRi9NLGVBQXRGLEVBQXVHLFVBQUMwWSxJQUFELEVBQU9DLElBQVAsRUFBYXJSLElBQWIsRUFBbUIwUixZQUFuQixFQUFpQ0MsYUFBakMsRUFBZ0Q5TSxLQUFoRCxFQUEwRDtBQUNoSyxnQkFBSXFPLGdCQUFnQixFQUFwQjtBQUNBLGdCQUFJN0IsS0FBS0ksS0FBVCxFQUFnQjtBQUNkeUIsNEJBQWMzVixJQUFkLENBQW1CLFFBQUs0VixvQkFBTCxDQUEwQmxTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRHNRLEtBQUs1UyxJQUFwRSxFQUEwRS9GLGVBQTFFLEVBQTJGMFksSUFBM0YsRUFBaUdDLElBQWpHLEVBQXVHclIsSUFBdkcsRUFBNkcwUixZQUE3RyxFQUEySEMsYUFBM0gsRUFBMEksQ0FBMUksRUFBNkksRUFBRXlCLFdBQVcsSUFBYixFQUFtQmdDLG1CQUFtQixJQUF0QyxFQUE3SSxDQUFuQjtBQUNELGFBRkQsTUFFTztBQUNMLGtCQUFJcFYsSUFBSixFQUFVO0FBQ1JrVCw4QkFBYzNWLElBQWQsQ0FBbUIsUUFBSytWLGtCQUFMLENBQXdCclMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEc1EsS0FBSzVTLElBQWxFLEVBQXdFL0YsZUFBeEUsRUFBeUYwWSxJQUF6RixFQUErRkMsSUFBL0YsRUFBcUdyUixJQUFyRyxFQUEyRzBSLFlBQTNHLEVBQXlIQyxhQUF6SCxFQUF3SSxDQUF4SSxFQUEySSxFQUFFeUIsV0FBVyxJQUFiLEVBQW1CZ0MsbUJBQW1CLElBQXRDLEVBQTNJLENBQW5CO0FBQ0Q7QUFDRCxrQkFBSSxDQUFDaEUsSUFBRCxJQUFTLENBQUNBLEtBQUtLLEtBQW5CLEVBQTBCO0FBQ3hCeUIsOEJBQWMzVixJQUFkLENBQW1CLFFBQUtnVyxrQkFBTCxDQUF3QnRTLFNBQXhCLEVBQW1DdEQsV0FBbkMsRUFBZ0RvRCxXQUFoRCxFQUE2RHNRLEtBQUs1UyxJQUFsRSxFQUF3RS9GLGVBQXhFLEVBQXlGMFksSUFBekYsRUFBK0ZDLElBQS9GLEVBQXFHclIsSUFBckcsRUFBMkcwUixZQUEzRyxFQUF5SEMsYUFBekgsRUFBd0ksQ0FBeEksRUFBMkksRUFBRXlCLFdBQVcsSUFBYixFQUFtQmdDLG1CQUFtQixJQUF0QyxFQUEzSSxDQUFuQjtBQUNEO0FBQ0Y7QUFDRCxtQkFBT2xDLGFBQVA7QUFDRCxXQWJBO0FBVkg7QUFoR0YsT0FERjtBQTRIRDs7QUFFRDs7Ozt3Q0FDcUIvQyxLLEVBQU87QUFBQTs7QUFDMUIsVUFBSSxDQUFDLEtBQUs3VSxLQUFMLENBQVdvQixRQUFoQixFQUEwQixPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBQVA7O0FBRTFCLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVUsbUJBRFo7QUFFRSxpQkFBTyxpQkFBT25CLE1BQVAsQ0FBYyxFQUFkLEVBQWtCO0FBQ3ZCMFcsc0JBQVU7QUFEYSxXQUFsQixDQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtHOUIsY0FBTW5DLEdBQU4sQ0FBVSxVQUFDdkksSUFBRCxFQUFPWixLQUFQLEVBQWlCO0FBQzFCLGNBQU02ViwwQkFBMEJqVixLQUFLNkYsUUFBTCxDQUFjcFEsTUFBZCxHQUF1QixDQUF2QixJQUE0QnVLLEtBQUtaLEtBQUwsS0FBZVksS0FBSzZGLFFBQUwsQ0FBY3BRLE1BQWQsR0FBdUIsQ0FBbEc7QUFDQSxjQUFJdUssS0FBS3lLLFNBQVQsRUFBb0I7QUFDbEIsbUJBQU8sUUFBSzZLLGdCQUFMLENBQXNCdFYsSUFBdEIsRUFBNEJaLEtBQTVCLEVBQW1DLFFBQUt2SixLQUFMLENBQVd2RSxTQUE5QyxFQUF5RG9aLEtBQXpELEVBQWdFdUssdUJBQWhFLENBQVA7QUFDRCxXQUZELE1BRU8sSUFBSWpWLEtBQUtWLFVBQVQsRUFBcUI7QUFDMUIsbUJBQU8sUUFBS2lXLGlCQUFMLENBQXVCdlYsSUFBdkIsRUFBNkJaLEtBQTdCLEVBQW9DLFFBQUt2SixLQUFMLENBQVd2RSxTQUEvQyxFQUEwRG9aLEtBQTFELEVBQWlFdUssdUJBQWpFLENBQVA7QUFDRCxXQUZNLE1BRUE7QUFDTCxtQkFBTyxRQUFLTyx5QkFBTCxDQUErQnhWLElBQS9CLEVBQXFDWixLQUFyQyxFQUE0QyxRQUFLdkosS0FBTCxDQUFXdkUsU0FBdkQsRUFBa0VvWixLQUFsRSxDQUFQO0FBQ0Q7QUFDRixTQVRBO0FBTEgsT0FERjtBQWtCRDs7OzZCQUVTO0FBQUE7O0FBQ1IsV0FBSzdVLEtBQUwsQ0FBV21KLGlCQUFYLEdBQStCLEtBQUt5VyxvQkFBTCxFQUEvQjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZUFBSSxXQUROO0FBRUUsY0FBRyxVQUZMO0FBR0UscUJBQVUsV0FIWjtBQUlFLGlCQUFPO0FBQ0xqSixzQkFBVSxVQURMO0FBRUx1RSw2QkFBaUIseUJBQVFILElBRnBCO0FBR0xELG1CQUFPLHlCQUFRYixJQUhWO0FBSUx4UyxpQkFBSyxDQUpBO0FBS0xDLGtCQUFNLENBTEQ7QUFNTDhQLG9CQUFRLG1CQU5IO0FBT0xDLG1CQUFPLE1BUEY7QUFRTG9JLHVCQUFXLFFBUk47QUFTTEMsdUJBQVc7QUFUTixXQUpUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWVHLGFBQUs5ZixLQUFMLENBQVdyRCxvQkFBWCxJQUNDLHdDQUFNLFdBQVUsV0FBaEIsRUFBNEIsT0FBTztBQUNqQ2dhLHNCQUFVLFVBRHVCO0FBRWpDYSxvQkFBUSxNQUZ5QjtBQUdqQ0MsbUJBQU8sQ0FIMEI7QUFJakMvUCxrQkFBTSxHQUoyQjtBQUtqQzhSLG9CQUFRLElBTHlCO0FBTWpDL1IsaUJBQUssQ0FONEI7QUFPakNpVix1QkFBVztBQVBzQixXQUFuQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFoQko7QUEwQkcsYUFBS3FELGlCQUFMLEVBMUJIO0FBMkJFO0FBQUE7QUFBQTtBQUNFLGlCQUFJLFlBRE47QUFFRSxnQkFBRyxlQUZMO0FBR0UsbUJBQU87QUFDTHBKLHdCQUFVLFVBREw7QUFFTGxQLG1CQUFLLEVBRkE7QUFHTEMsb0JBQU0sQ0FIRDtBQUlMK1AscUJBQU8sTUFKRjtBQUtMcUUsNkJBQWUsS0FBSzliLEtBQUwsQ0FBV3RELDBCQUFYLEdBQXdDLE1BQXhDLEdBQWlELE1BTDNEO0FBTUxzZSxnQ0FBa0IsS0FBS2hiLEtBQUwsQ0FBV3RELDBCQUFYLEdBQXdDLE1BQXhDLEdBQWlELE1BTjlEO0FBT0xnaUIsc0JBQVEsQ0FQSDtBQVFMbUIseUJBQVcsTUFSTjtBQVNMQyx5QkFBVztBQVROLGFBSFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBY0csZUFBS0UsbUJBQUwsQ0FBeUIsS0FBS2hnQixLQUFMLENBQVdtSixpQkFBcEM7QUFkSCxTQTNCRjtBQTJDRyxhQUFLOFcsb0JBQUwsRUEzQ0g7QUE0Q0U7QUFDRSxlQUFJLGlCQUROO0FBRUUsdUJBQWEsSUFGZjtBQUdFLHlCQUFlLEtBQUtqZ0IsS0FBTCxDQUFXaEQsYUFINUI7QUFJRSx3QkFBYyxLQUFLZ0QsS0FBTCxDQUFXL0MsWUFKM0I7QUFLRSx5QkFBZSx1QkFBQ2lqQixjQUFELEVBQW9CO0FBQ2pDMWMsb0JBQVFDLElBQVIsQ0FBYSwwQkFBYixFQUF5QzBjLEtBQUtDLFNBQUwsQ0FBZUYsY0FBZixDQUF6Qzs7QUFFQSxvQkFBS2hhLG1DQUFMLENBQ0UscUNBQW1CLFFBQUtsRyxLQUFMLENBQVcvQyxZQUE5QixDQURGLEVBRUUsUUFBSytDLEtBQUwsQ0FBVzdELG1CQUZiLEVBR0UsUUFBSzZELEtBQUwsQ0FBVy9DLFlBQVgsQ0FBd0J1QyxJQUF4QixDQUE2QmlHLFdBSC9CLEVBSUUsc0NBQW9CLFFBQUt6RixLQUFMLENBQVcvQyxZQUEvQixDQUpGLEVBS0UsUUFBS3NhLHNCQUFMLENBQTRCLFFBQUszUixZQUFMLEVBQTVCLENBTEYsRUFNRXNhLGNBTkYsRUFPRSxLQUFNLENBUFIsRUFPWTtBQUNWLGlCQUFNLENBUlIsRUFRWTtBQUNWLGlCQUFNLENBVFIsQ0FTVztBQVRYO0FBV0QsV0FuQkg7QUFvQkUsNEJBQWtCLDRCQUFNO0FBQ3RCLG9CQUFLcmUsUUFBTCxDQUFjO0FBQ1o1RSw0QkFBYyxRQUFLK0MsS0FBTCxDQUFXaEQ7QUFEYixhQUFkO0FBR0QsV0F4Qkg7QUF5QkUsK0JBQXFCLDZCQUFDcWpCLE1BQUQsRUFBU0MsT0FBVCxFQUFxQjtBQUN4QyxnQkFBSW5XLE9BQU8sUUFBS25LLEtBQUwsQ0FBV2hELGFBQXRCO0FBQ0EsZ0JBQUkwSCxPQUFPLCtCQUFheUYsSUFBYixFQUFtQmtXLE1BQW5CLENBQVg7QUFDQSxnQkFBSTNiLElBQUosRUFBVTtBQUNSLHNCQUFLN0MsUUFBTCxDQUFjO0FBQ1o1RSw4QkFBZXFqQixPQUFELEdBQVk1YixJQUFaLEdBQW1CLElBRHJCO0FBRVoxSCwrQkFBZTBIO0FBRkgsZUFBZDtBQUlEO0FBQ0YsV0FsQ0g7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNUNGLE9BREY7QUFrRkQ7Ozs7RUEvbUZvQixnQkFBTTZiLFM7O2tCQWtuRmR6Z0IsUSIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFyY2h5IGZyb20gJ2FyY2h5J1xuaW1wb3J0IHsgRHJhZ2dhYmxlQ29yZSB9IGZyb20gJ3JlYWN0LWRyYWdnYWJsZSdcblxuaW1wb3J0IGV4cHJlc3Npb25Ub1JPIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlZmxlY3Rpb24vZXhwcmVzc2lvblRvUk8nXG5cbmltcG9ydCBUaW1lbGluZVByb3BlcnR5IGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9UaW1lbGluZVByb3BlcnR5J1xuaW1wb3J0IEJ5dGVjb2RlQWN0aW9ucyBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvYWN0aW9ucydcbmltcG9ydCBBY3RpdmVDb21wb25lbnQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvbW9kZWwvQWN0aXZlQ29tcG9uZW50J1xuXG5pbXBvcnQge1xuICBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AsXG4gIHByZXZlbnREZWZhdWx0RHJhZ1xufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9kbmRIZWxwZXJzJ1xuXG5pbXBvcnQge1xuICBuZXh0UHJvcEl0ZW0sXG4gIGdldEl0ZW1Db21wb25lbnRJZCxcbiAgZ2V0SXRlbVByb3BlcnR5TmFtZVxufSBmcm9tICcuL2hlbHBlcnMvSXRlbUhlbHBlcnMnXG5cbmltcG9ydCBnZXRNYXhpbXVtTXMgZnJvbSAnLi9oZWxwZXJzL2dldE1heGltdW1NcydcbmltcG9ydCBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lIGZyb20gJy4vaGVscGVycy9taWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lJ1xuaW1wb3J0IGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyBmcm9tICcuL2hlbHBlcnMvY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzJ1xuaW1wb3J0IGh1bWFuaXplUHJvcGVydHlOYW1lIGZyb20gJy4vaGVscGVycy9odW1hbml6ZVByb3BlcnR5TmFtZSdcbmltcG9ydCBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvciBmcm9tICcuL2hlbHBlcnMvZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3InXG5pbXBvcnQgZ2V0TWlsbGlzZWNvbmRNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRNaWxsaXNlY29uZE1vZHVsdXMnXG5pbXBvcnQgZ2V0RnJhbWVNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRGcmFtZU1vZHVsdXMnXG5pbXBvcnQgZm9ybWF0U2Vjb25kcyBmcm9tICcuL2hlbHBlcnMvZm9ybWF0U2Vjb25kcydcbmltcG9ydCByb3VuZFVwIGZyb20gJy4vaGVscGVycy9yb3VuZFVwJ1xuXG5pbXBvcnQgdHJ1bmNhdGUgZnJvbSAnLi9oZWxwZXJzL3RydW5jYXRlJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9EZWZhdWx0UGFsZXR0ZSdcbmltcG9ydCBLZXlmcmFtZVNWRyBmcm9tICcuL2ljb25zL0tleWZyYW1lU1ZHJ1xuXG5pbXBvcnQge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59IGZyb20gJy4vaWNvbnMvQ3VydmVTVkdTJ1xuXG5pbXBvcnQgRG93bkNhcnJvdFNWRyBmcm9tICcuL2ljb25zL0Rvd25DYXJyb3RTVkcnXG5pbXBvcnQgUmlnaHRDYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9SaWdodENhcnJvdFNWRydcbmltcG9ydCBDb250cm9sc0FyZWEgZnJvbSAnLi9Db250cm9sc0FyZWEnXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi9Db250ZXh0TWVudSdcbmltcG9ydCBFeHByZXNzaW9uSW5wdXQgZnJvbSAnLi9FeHByZXNzaW9uSW5wdXQnXG5pbXBvcnQgQ2x1c3RlcklucHV0RmllbGQgZnJvbSAnLi9DbHVzdGVySW5wdXRGaWVsZCdcbmltcG9ydCBQcm9wZXJ0eUlucHV0RmllbGQgZnJvbSAnLi9Qcm9wZXJ0eUlucHV0RmllbGQnXG5cbi8qIHotaW5kZXggZ3VpZGVcbiAga2V5ZnJhbWU6IDEwMDJcbiAgdHJhbnNpdGlvbiBib2R5OiAxMDAyXG4gIGtleWZyYW1lIGRyYWdnZXJzOiAxMDAzXG4gIGlucHV0czogMTAwNCwgKDEwMDUgYWN0aXZlKVxuICB0cmltLWFyZWEgMTAwNlxuICBzY3J1YmJlcjogMTAwNlxuICBib3R0b20gY29udHJvbHM6IDEwMDAwIDwtIGthLWJvb20hXG4qL1xuXG52YXIgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG52YXIgd2ViRnJhbWUgPSBlbGVjdHJvbi53ZWJGcmFtZVxuaWYgKHdlYkZyYW1lKSB7XG4gIGlmICh3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cygxLCAxKVxuICBpZiAod2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMoMCwgMClcbn1cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIHByb3BlcnRpZXNXaWR0aDogMzAwLFxuICB0aW1lbGluZXNXaWR0aDogODcwLFxuICByb3dIZWlnaHQ6IDI1LFxuICBpbnB1dENlbGxXaWR0aDogNzUsXG4gIG1ldGVySGVpZ2h0OiAyNSxcbiAgY29udHJvbHNIZWlnaHQ6IDQyLFxuICB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIDYwXSxcbiAgY3VycmVudEZyYW1lOiAwLFxuICBtYXhGcmFtZTogbnVsbCxcbiAgZHVyYXRpb25UcmltOiAwLFxuICBmcmFtZXNQZXJTZWNvbmQ6IDYwLFxuICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnLCAvLyBvciAnZnJhbWVzJ1xuICBjdXJyZW50VGltZWxpbmVOYW1lOiAnRGVmYXVsdCcsXG4gIGlzUGxheWVyUGxheWluZzogZmFsc2UsXG4gIHBsYXllclBsYXliYWNrU3BlZWQ6IDEuMCxcbiAgaXNTaGlmdEtleURvd246IGZhbHNlLFxuICBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb250cm9sS2V5RG93bjogZmFsc2UsXG4gIGlzQWx0S2V5RG93bjogZmFsc2UsXG4gIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZSxcbiAgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlLFxuICBzZWxlY3RlZE5vZGVzOiB7fSxcbiAgZXhwYW5kZWROb2Rlczoge30sXG4gIGFjdGl2YXRlZFJvd3M6IHt9LFxuICBoaWRkZW5Ob2Rlczoge30sXG4gIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzOiB7fSxcbiAgYWN0aXZlS2V5ZnJhbWVzOiBbXSxcbiAgcmVpZmllZEJ5dGVjb2RlOiBudWxsLFxuICBzZXJpYWxpemVkQnl0ZWNvZGU6IG51bGxcbn1cblxuY29uc3QgQ1VSVkVTVkdTID0ge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgcHJldmVudERlZmF1bHREcmFnLCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcC5iaW5kKHRoaXMpLCBmYWxzZSlcbiAgfVxuXG4gIGZsdXNoVXBkYXRlcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMudXBkYXRlcykubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMudXBkYXRlcykge1xuICAgICAgaWYgKHRoaXMuc3RhdGVba2V5XSAhPT0gdGhpcy51cGRhdGVzW2tleV0pIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VzW2tleV0gPSB0aGlzLnVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2JzID0gdGhpcy5jYWxsYmFja3Muc3BsaWNlKDApXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnVwZGF0ZXMsICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJDaGFuZ2VzKClcbiAgICAgIGNicy5mb3JFYWNoKChjYikgPT4gY2IoKSlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKHVwZGF0ZXMsIGNiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgdGhpcy51cGRhdGVzW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICB9XG4gICAgaWYgKGNiKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNiKVxuICAgIH1cbiAgICB0aGlzLmZsdXNoVXBkYXRlcygpXG4gIH1cblxuICBjbGVhckNoYW5nZXMgKCkge1xuICAgIGZvciAoY29uc3QgazEgaW4gdGhpcy51cGRhdGVzKSBkZWxldGUgdGhpcy51cGRhdGVzW2sxXVxuICAgIGZvciAoY29uc3QgazIgaW4gdGhpcy5jaGFuZ2VzKSBkZWxldGUgdGhpcy5jaGFuZ2VzW2syXVxuICB9XG5cbiAgdXBkYXRlVGltZSAoY3VycmVudEZyYW1lKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGcmFtZSB9KVxuICB9XG5cbiAgc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9XG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgdW5zZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0gbnVsbFxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIC8qXG4gICAqIGxpZmVjeWNsZS9ldmVudHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIC8vIENsZWFuIHVwIHN1YnNjcmlwdGlvbnMgdG8gcHJldmVudCBtZW1vcnkgbGVha3MgYW5kIHJlYWN0IHdhcm5pbmdzXG4gICAgdGhpcy5lbWl0dGVycy5mb3JFYWNoKCh0dXBsZSkgPT4ge1xuICAgICAgdHVwbGVbMF0ucmVtb3ZlTGlzdGVuZXIodHVwbGVbMV0sIHR1cGxlWzJdKVxuICAgIH0pXG4gICAgdGhpcy5zdGF0ZS5kaWRNb3VudCA9IGZhbHNlXG5cbiAgICB0aGlzLnRvdXJDbGllbnQub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5fZW52b3lDbGllbnQuY2xvc2VDb25uZWN0aW9uKClcblxuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdiZWdpbicpO1xuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdlbmQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRpZE1vdW50OiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIH0pXG4gICAgICB9XG4gICAgfSwgVEhST1RUTEVfVElNRSkpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLnByb3BzLndlYnNvY2tldCwgJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5mb2xkZXIgIT09IHRoaXMucHJvcHMuZm9sZGVyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOiByZXR1cm4gdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBhY3Rpb24gcmVjZWl2ZWQnLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuY2FsbE1ldGhvZChtZXRob2QsIHBhcmFtcywgY2IpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50OnVwZGF0ZWQnLCAobWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IHVwZGF0ZWQnLCBtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpXG5cbiAgICAgIC8vIElmIHdlIGRvbid0IGNsZWFyIGNhY2hlcyB0aGVuIHRoZSB0aW1lbGluZSBmaWVsZHMgbWlnaHQgbm90IHVwZGF0ZSByaWdodCBhZnRlciBrZXlmcmFtZSBkZWxldGlvbnNcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuXG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcblxuICAgICAgaWYgKG1heWJlTWV0YWRhdGEgJiYgbWF5YmVNZXRhZGF0YS5mcm9tICE9PSAndGltZWxpbmUnKSB7XG4gICAgICAgIGlmIChtYXliZUNvbXBvbmVudElkcyAmJiBtYXliZVRpbWVsaW5lTmFtZSAmJiBtYXliZVByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICBtYXliZUNvbXBvbmVudElkcy5mb3JFYWNoKChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5taW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlKGNvbXBvbmVudElkLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUgfHwgMCwgbWF5YmVQcm9wZXJ0eU5hbWVzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCBzZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25TZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnVuc2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHVuc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uVW5zZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6bW91bnRlZCcsICgpID0+IHtcbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgbW91bnRlZCcsIHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMucmVoeWRyYXRlQnl0ZWNvZGUocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpXG4gICAgICAvLyB0aGlzLnVwZGF0ZVRpbWUodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUpXG4gICAgfSlcblxuICAgIC8vIGNvbXBvbmVudDptb3VudGVkIGZpcmVzIHdoZW4gdGhpcyBmaW5pc2hlcyB3aXRob3V0IGVycm9yXG4gICAgdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0b3VyQ2xpZW50UmVhZHknLCAoY2xpZW50KSA9PiB7XG4gICAgICBjbGllbnQub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNsaWVudC5uZXh0KClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGxldCBlZGl0YWJsZSA9IHBhc3RlRXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykgLy8gT3VyIGlucHV0IGZpZWxkcyBhcmUgPHNwYW4+c1xuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJyB8fCBlZGl0YWJsZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgdmlhIGRlZmF1bHQnKVxuICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGEgcHJvcGVydHkgaW5wdXQsIHNvIGxldCB0aGUgZGVmYXVsdCBhY3Rpb24gaGFwcGVuXG4gICAgICAgIC8vIFRPRE86IE1ha2UgdGhpcyBjaGVjayBsZXNzIGJyaXR0bGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vdGlmeSBjcmVhdG9yIHRoYXQgd2UgaGF2ZSBzb21lIGNvbnRlbnQgdGhhdCB0aGUgcGVyc29uIHdpc2hlcyB0byBwYXN0ZSBvbiB0aGUgc3RhZ2U7XG4gICAgICAgIC8vIHRoZSB0b3AgbGV2ZWwgbmVlZHMgdG8gaGFuZGxlIHRoaXMgYmVjYXVzZSBpdCBkb2VzIGNvbnRlbnQgdHlwZSBkZXRlY3Rpb24uXG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBkZWxlZ2F0ZWQgdG8gcGx1bWJpbmcnKVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgICAgZGF0YTogbnVsbCAvLyBUaGlzIGNhbiBob2xkIGNvb3JkaW5hdGVzIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIHBhc3RlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpLCBmYWxzZSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcykpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjcmVhdGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMvKiB2YWx1ZSwgY3VydmUsIGVuZG1zLCBlbmR2YWx1ZSAqLylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ3NwbGl0U2VnbWVudCcsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnam9pbktleWZyYW1lcycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2RlbGV0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjaGFuZ2VTZWdtZW50Q3VydmUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnbW92ZVNlZ21lbnRFbmRwb2ludHMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcylcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDp0aWNrJywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiB3ZSBnb3QgYSB0aWNrLCB3aGljaCBvY2N1cnMgZHVyaW5nIFRpbWVsaW5lIG1vZGVsIHVwZGF0aW5nLCB0aGVuIHdlIHdhbnQgdG8gcGF1c2UgaXQgaWYgdGhlIHNjcnViYmVyXG4gICAgICAvLyBoYXMgYXJyaXZlZCBhdCB0aGUgbWF4aW11bSBhY2NlcHRpYmxlIGZyYW1lIGluIHRoZSB0aW1lbGluZS5cbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNQbGF5ZXJQbGF5aW5nOiBmYWxzZX0pXG4gICAgICB9XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6YXV0aG9yaXRhdGl2ZS1mcmFtZS1zZXQnLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICd0aW1lbGluZScpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygndGltZWxpbmUnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleURvd24gKG5hdGl2ZUV2ZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY3VycmVudGx5IGFjdGl2ZSBleHByZXNzaW9uIGlucHV0IGEgY2hhbmNlIHRvIGNhcHR1cmUgdGhpcyBldmVudCBhbmQgc2hvcnQgY2lyY3VpdCB1cyBpZiBzb1xuICAgIGlmICh0aGlzLnJlZnMuZXhwcmVzc2lvbklucHV0LndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudChuYXRpdmVFdmVudCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGhpdCB0aGUgc3BhY2ViYXIgX2FuZF8gd2UgYXJlbid0IGluc2lkZSBhbiBpbnB1dCBmaWVsZCwgdHJlYXQgdGhhdCBsaWtlIGEgcGxheWJhY2sgdHJpZ2dlclxuICAgIGlmIChuYXRpdmVFdmVudC5rZXlDb2RlID09PSAzMiAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQ6Zm9jdXMnKSkge1xuICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNTaGlmdEtleURvd24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1dLCBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoMClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigtMSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiYgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgtMSlcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdykgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiB0cnVlIH0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoMSlcbiAgICAgICAgfVxuXG4gICAgICAvLyBjYXNlIDM4OiAvLyB1cFxuICAgICAgLy8gY2FzZSA0MDogLy8gZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKG5hdGl2ZUV2ZW50KSB7XG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIC8vIGNhc2UgMzc6IC8vbGVmdFxuICAgICAgLy8gY2FzZSAzOTogLy9yaWdodFxuICAgICAgLy8gY2FzZSAzODogLy91cFxuICAgICAgLy8gY2FzZSA0MDogLy9kb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVLZXlib2FyZFN0YXRlICh1cGRhdGVzKSB7XG4gICAgLy8gSWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGRvbid0IGFsbG93IGtleWJvYXJkIHN0YXRlIGNoYW5nZXMgdG8gY2F1c2UgYSByZS1yZW5kZXIsIG90aGVyd2lzZVxuICAgIC8vIHRoZSBpbnB1dCBmaWVsZCB3aWxsIHN3aXRjaCBiYWNrIHRvIGl0cyBwcmV2aW91cyBjb250ZW50cyAoZS5nLiB3aGVuIGhvbGRpbmcgZG93biAnc2hpZnQnKVxuICAgIGlmICghdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHVwZGF0ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICAgIHRoaXMuc3RhdGVba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVtaXR0ZXJMaXN0ZW5lciAoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChbZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcl0pXG4gICAgZXZlbnRFbWl0dGVyLm9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxuICB9XG5cbiAgLypcbiAgICogc2V0dGVycy91cGRhdGVyc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBkZXNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IHRydWVcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAwXG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9Ob2RlIChub2RlKSB7XG4gICAgdmFyIHJvd3NEYXRhID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIHZhciBmb3VuZEluZGV4ID0gbnVsbFxuICAgIHZhciBpbmRleENvdW50ZXIgPSAwXG4gICAgcm93c0RhdGEuZm9yRWFjaCgocm93SW5mbywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzSGVhZGluZykge1xuICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgfSBlbHNlIGlmIChyb3dJbmZvLmlzUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXhDb3VudGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmb3VuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gKGZvdW5kSW5kZXggKiB0aGlzLnN0YXRlLnJvd0hlaWdodCkgLSB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREb21Ob2RlT2Zmc2V0WSAoZG9tTm9kZSkge1xuICAgIHZhciBjdXJ0b3AgPSAwXG4gICAgaWYgKGRvbU5vZGUub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIGN1cnRvcCArPSBkb21Ob2RlLm9mZnNldFRvcFxuICAgICAgfSB3aGlsZSAoZG9tTm9kZSA9IGRvbU5vZGUub2Zmc2V0UGFyZW50KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuICAgIHJldHVybiBjdXJ0b3BcbiAgfVxuXG4gIGNvbGxhcHNlTm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICB2aXNpdChub2RlLCAoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgICBjaGlsZC5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBsZXQgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGV4cGFuZE5vZGUgKG5vZGUsIGNvbXBvbmVudElkKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKG5vZGUucGFyZW50KSB0aGlzLmV4cGFuZE5vZGUobm9kZS5wYXJlbnQpIC8vIElmIHdlIGFyZSBleHBhbmRlZCwgb3VyIHBhcmVudCBoYXMgdG8gYmUgdG9vXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpc1Jvd0FjdGl2YXRlZCAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV1cbiAgICB9XG4gIH1cblxuICBpc0NsdXN0ZXJBY3RpdmF0ZWQgKGl0ZW0pIHtcbiAgICByZXR1cm4gZmFsc2UgLy8gVE9ET1xuICB9XG5cbiAgdG9nZ2xlVGltZURpc3BsYXlNb2RlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdzZWNvbmRzJ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVCYXNlbGluZSA9IHRoaXMuc3RhdGUuZnJhbWVCYXNlbGluZVxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICB2YXIgY3VycmVudEZyYW1lID0gZnJhbWVCYXNlbGluZSArIGZyYW1lRGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlCKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLmR1cmF0aW9uRHJhZ1N0YXJ0XG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIGlmIChkcmFnRGVsdGEgPiAwICYmIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltID49IDApIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkge1xuICAgICAgICB2YXIgYWRkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyAyMH0pXG4gICAgICAgIH0sIDMwMClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkSW50ZXJ2YWw6IGFkZEludGVydmFsfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdJc0FkZGluZzogdHJ1ZX0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAvLyBEb24ndCBsZXQgdXNlciBkcmFnIGJhY2sgcGFzdCBsYXN0IGZyYW1lOyBhbmQgZG9uJ3QgbGV0IHRoZW0gZHJhZyBtb3JlIHRoYW4gYW4gZW50aXJlIHdpZHRoIG9mIGZyYW1lc1xuICAgIGlmIChmcmFtZUluZm8uZnJpQiArIGZyYW1lRGVsdGEgPD0gZnJhbWVJbmZvLmZyaU1heCB8fCAtZnJhbWVEZWx0YSA+PSBmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICBmcmFtZURlbHRhID0gdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gLy8gVG9kbzogbWFrZSBtb3JlIHByZWNpc2Ugc28gaXQgcmVtb3ZlcyBhcyBtYW55IGZyYW1lcyBhc1xuICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGNhbiBpbnN0ZWFkIG9mIGNvbXBsZXRlbHkgaWdub3JpbmcgdGhlIGRyYWdcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uVHJpbTogZnJhbWVEZWx0YSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGwgfSlcbiAgfVxuXG4gIGNoYW5nZVZpc2libGVGcmFtZVJhbmdlICh4bCwgeHIsIGZyYW1lSW5mbykge1xuICAgIGxldCBhYnNMID0gbnVsbFxuICAgIGxldCBhYnNSID0gbnVsbFxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNMID0geGxcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgYWJzUiA9IHhyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydCkge1xuICAgICAgY29uc3Qgb2Zmc2V0TCA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhclN0YXJ0ICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IG9mZnNldFIgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJFbmQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3QgZGlmZlggPSB4bCAtIHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0XG4gICAgICBhYnNMID0gb2Zmc2V0TCArIGRpZmZYXG4gICAgICBhYnNSID0gb2Zmc2V0UiArIGRpZmZYXG4gICAgfVxuXG4gICAgbGV0IGZMID0gKGFic0wgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzTCAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICBsZXQgZlIgPSAoYWJzUiAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNSICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIGxlZnQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmTCA8PSBmcmFtZUluZm8uZnJpMCkge1xuICAgICAgZkwgPSBmcmFtZUluZm8uZnJpMFxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAtICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC0gZkwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIHJpZ2h0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZlIgPj0gZnJhbWVJbmZvLmZyaU1heDIpIHtcbiAgICAgIGZMID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtmTCwgZlJdIH0pXG4gIH1cblxuICB1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSAoZGVsdGEpIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gKyBkZWx0YVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSArIGRlbHRhXG4gICAgaWYgKGwgPj0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbCwgcl0gfSlcbiAgICB9XG4gIH1cblxuICAvLyB3aWxsIGxlZnQtYWxpZ24gdGhlIGN1cnJlbnQgdGltZWxpbmUgd2luZG93IChtYWludGFpbmluZyB6b29tKVxuICB0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UgKGZyYW1lSW5mbykge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuICAgIHZhciBzcGFuID0gciAtIGxcbiAgICB2YXIgbmV3TCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lXG4gICAgdmFyIG5ld1IgPSBuZXdMICsgc3BhblxuXG4gICAgaWYgKG5ld1IgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICBuZXdMIC09IChuZXdSIC0gZnJhbWVJbmZvLmZyaU1heClcbiAgICAgIG5ld1IgPSBmcmFtZUluZm8uZnJpTWF4XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbmV3TCwgbmV3Ul0gfSlcbiAgfVxuXG4gIHVwZGF0ZVNjcnViYmVyUG9zaXRpb24gKGRlbHRhKSB7XG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICsgZGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDw9IDApIGN1cnJlbnRGcmFtZSA9IDBcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlKSB7XG4gICAgLy8gTm90ZSB0aGF0IGlmIHN0YXJ0VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBleGFtaW5lZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBwcmVzZW50IG9uZVxuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ2hvc3RJbnN0YW5jZScpLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm8gbmVlZCB0byAnZXhwcmVzc2lvblRvUk8nIGhlcmUgYmVjYXVzZSBpZiB3ZSBnb3QgYW4gZXhwcmVzc2lvbiwgdGhhdCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwcm92aWRlZCBpbiBpdHMgc2VyaWFsaXplZCBfX2Z1bmN0aW9uIGZvcm1cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZV0sICgpID0+IHt9KVxuXG4gICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5zcGxpdFNlZ21lbnQodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NwbGl0U2VnbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdqb2luS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRDdXJ2ZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50Q3VydmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50RW5kcG9pbnRzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSAob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMucmVuYW1lVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdyZW5hbWVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vdGU6IFdlIG1heSBuZWVkIHRvIHJlbWVtYmVyIHRvIHNlcmlhbGl6ZSBhIHRpbWVsaW5lIGRlc2NyaXB0b3IgaGVyZVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kdXBsaWNhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkdXBsaWNhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpIHtcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMsIGZyYW1lSW5mbylcbiAgICAvLyBUaGUgJ2tleWZyYW1lTW92ZXMnIGluZGljYXRlIGEgbGlzdCBvZiBjaGFuZ2VzIHdlIGtub3cgb2NjdXJyZWQuIE9ubHkgaWYgc29tZSBvY2N1cnJlZCBkbyB3ZSBib3RoZXIgdG8gdXBkYXRlIHRoZSBvdGhlciB2aWV3c1xuICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgfSlcblxuICAgICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSByZXR1cm4gdm9pZCAoMClcbiAgICBmb3IgKGxldCBtb3ZlbWVudEtleSBpbiB0aGlzLl9rZXlmcmFtZU1vdmVzKSB7XG4gICAgICBpZiAoIW1vdmVtZW50S2V5KSBjb250aW51ZVxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSkgY29udGludWVcbiAgICAgIGxldCB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH0gPSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuXG4gICAgICAvLyBNYWtlIHN1cmUgYW55IGZ1bmN0aW9ucyBnZXQgY29udmVydGVkIGludG8gdGhlaXIgc2VyaWFsIGZvcm0gYmVmb3JlIHBhc3Npbmcgb3ZlciB0aGUgd2lyZVxuICAgICAgbGV0IGtleWZyYW1lTW92ZXNGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oa2V5ZnJhbWVNb3ZlcylcblxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdtb3ZlS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3Zlc0ZvcldpcmUsIGZyYW1lSW5mb10sICgpID0+IHt9KVxuICAgICAgZGVsZXRlIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG4gICAgfVxuICB9XG5cbiAgcGxheWJhY2tTa2lwQmFjayAoKSB7XG4gICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgLyogdGhpcy51cGRhdGVUaW1lKGZyYW1lSW5mby5mcmkwKSAqL1xuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpMCB9KVxuICB9XG5cbiAgcGxheWJhY2tTa2lwRm9yd2FyZCAoKSB7XG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICB9XG5cbiAgdG9nZ2xlUGxheWJhY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA+PSB0aGlzLnN0YXRlLm1heEZyYW1lKSB0aGlzLnBsYXliYWNrU2tpcEJhY2soKVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IGZhbHNlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBsYXkoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZWh5ZHJhdGVCeXRlY29kZSAocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpIHtcbiAgICBpZiAocmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgICBpZiAocmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICAgIGlmICghaWQpIHJldHVybiB2b2lkICgwKVxuICAgICAgICAgIG5vZGUuX19pc1NlbGVjdGVkID0gISF0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzRXhwYW5kZWQgPSAhIXRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNIaWRkZW4gPSAhIXRoaXMuc3RhdGUuaGlkZGVuTm9kZXNbaWRdXG4gICAgICAgIH0pXG4gICAgICAgIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uU2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50KSA9PiB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuZXhwYW5kTm9kZShub2RlKVxuICAgICAgICB0aGlzLnNjcm9sbFRvTm9kZShub2RlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25VbnNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZE5vZGVzQnlDb21wb25lbnRJZChjb21wb25lbnRJZClcbiAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICB0aGlzLmRlc2VsZWN0Tm9kZShub2RlKVxuICAgICAgdGhpcy5jb2xsYXBzZU5vZGUobm9kZSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aobm9kZSlcbiAgICB9KVxuICB9XG5cbiAgZmluZE5vZGVzQnlDb21wb25lbnRJZCAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgZm91bmQgPSBbXVxuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgbWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgc3RhcnRNcywgcHJvcGVydHlOYW1lcykge1xuICAgIGxldCByZWxhdGVkRWxlbWVudCA9IHRoaXMuZmluZEVsZW1lbnRJblRlbXBsYXRlKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICBsZXQgZWxlbWVudE5hbWUgPSByZWxhdGVkRWxlbWVudCAmJiByZWxhdGVkRWxlbWVudC5lbGVtZW50TmFtZVxuICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIG1pc3NpbmcgZWxlbWVudCwgYW5kIHdpdGhvdXQgYW4gZWxlbWVudCBuYW1lIEkgY2Fubm90IHVwZGF0ZSBhIHByb3BlcnR5IHZhbHVlJylcbiAgICB9XG5cbiAgICB2YXIgYWxsUm93cyA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICBhbGxSb3dzLmZvckVhY2goKHJvd0luZm8pID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzUHJvcGVydHkgJiYgcm93SW5mby5jb21wb25lbnRJZCA9PT0gY29tcG9uZW50SWQgJiYgcHJvcGVydHlOYW1lcy5pbmRleE9mKHJvd0luZm8ucHJvcGVydHkubmFtZSkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBhY3RpdmF0ZWRSb3dzOiBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzKSxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgICogaXRlcmF0b3JzL3Zpc2l0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGZpbmRFbGVtZW50SW5UZW1wbGF0ZSAoY29tcG9uZW50SWQsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgbGV0IGZvdW5kXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kID0gbm9kZVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICB2aXNpdFRlbXBsYXRlIChsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLCBwYXJlbnQsIGl0ZXJhdGVlKSB7XG4gICAgaXRlcmF0ZWUodGVtcGxhdGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGVtcGxhdGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKCFjaGlsZCB8fCB0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBjb250aW51ZVxuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUobG9jYXRvciArICcuJyArIGksIGksIHRlbXBsYXRlLmNoaWxkcmVuLCBjaGlsZCwgdGVtcGxhdGUsIGl0ZXJhdGVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcFZpc2libGVGcmFtZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCByaWdodEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICBjb25zdCBmcmFtZU1vZHVsdXMgPSBnZXRGcmFtZU1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgbGV0IGl0ZXJhdGlvbkluZGV4ID0gLTFcbiAgICBmb3IgKGxldCBpID0gbGVmdEZyYW1lOyBpIDwgcmlnaHRGcmFtZTsgaSsrKSB7XG4gICAgICBpdGVyYXRpb25JbmRleCsrXG4gICAgICBsZXQgZnJhbWVOdW1iZXIgPSBpXG4gICAgICBsZXQgcGl4ZWxPZmZzZXRMZWZ0ID0gaXRlcmF0aW9uSW5kZXggKiBmcmFtZUluZm8ucHhwZlxuICAgICAgaWYgKHBpeGVsT2Zmc2V0TGVmdCA8PSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSB7XG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBmcmFtZUluZm8ucHhwZiwgZnJhbWVNb2R1bHVzKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSB7XG4gICAgICAgICAgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIG1hcFZpc2libGVUaW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBtc01vZHVsdXMgPSBnZXRNaWxsaXNlY29uZE1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCBsZWZ0TXMgPSBmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgcmlnaHRNcyA9IGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCB0b3RhbE1zID0gcmlnaHRNcyAtIGxlZnRNc1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gcm91bmRVcChsZWZ0TXMsIG1zTW9kdWx1cylcbiAgICBsZXQgbXNNYXJrZXJUbXAgPSBmaXJzdE1hcmtlclxuICAgIGNvbnN0IG1zTWFya2VycyA9IFtdXG4gICAgd2hpbGUgKG1zTWFya2VyVG1wIDw9IHJpZ2h0TXMpIHtcbiAgICAgIG1zTWFya2Vycy5wdXNoKG1zTWFya2VyVG1wKVxuICAgICAgbXNNYXJrZXJUbXAgKz0gbXNNb2R1bHVzXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNNYXJrZXIgPSBtc01hcmtlcnNbaV1cbiAgICAgIGxldCBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zTWFya2VyLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIGxldCBtc1JlbWFpbmRlciA9IE1hdGguZmxvb3IobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYgLSBtc01hcmtlcilcbiAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgbXNSZW1haW5kZXIgY2FzZSByYXRoZXIgdGhhbiBpZ25vcmluZyBpdFxuICAgICAgaWYgKCFtc1JlbWFpbmRlcikge1xuICAgICAgICBsZXQgZnJhbWVPZmZzZXQgPSBuZWFyZXN0RnJhbWUgLSBsZWZ0RnJhbWVcbiAgICAgICAgbGV0IHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUobXNNYXJrZXIsIHB4T2Zmc2V0LCB0b3RhbE1zKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIC8qXG4gICAqIGdldHRlcnMvY2FsY3VsYXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLyoqXG4gICAgLy8gU29ycnk6IFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gZ2l2ZW4gaHVtYW4tcmVhZGFibGUgbmFtZXNcbiAgICA8R0FVR0U+XG4gICAgICAgICAgICA8LS0tLWZyaVctLS0+XG4gICAgZnJpMCAgICBmcmlBICAgICAgICBmcmlCICAgICAgICBmcmlNYXggICAgICAgICAgICAgICAgICAgICAgICAgIGZyaU1heDJcbiAgICB8ICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8XG4gICAgICAgICAgICA8LS0tLS0tLS0tLS0+IDw8IHRpbWVsaW5lcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgIHxcbiAgICA8LS0tLS0tLT4gICAgICAgICAgIHwgPDwgcHJvcGVydGllcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgcHhBICAgICAgICAgcHhCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXggICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heDJcbiAgICA8U0NST0xMQkFSPlxuICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tfCA8PCBzY3JvbGxlciB2aWV3cG9ydFxuICAgICAgICAqPT09PSogICAgICAgICAgICA8PCBzY3JvbGxiYXJcbiAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAgICB8c2MwICAgICAgICAgICAgICAgIHxzY0wgJiYgc2NSYXRpb1xuICAgICAgICB8c2NBXG4gICAgICAgICAgICAgfHNjQlxuICAqL1xuICBnZXRGcmFtZUluZm8gKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHt9XG4gICAgZnJhbWVJbmZvLmZwcyA9IHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8vIE51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgIGZyYW1lSW5mby5tc3BmID0gMTAwMCAvIGZyYW1lSW5mby5mcHMgLy8gTWlsbGlzZWNvbmRzIHBlciBmcmFtZVxuICAgIGZyYW1lSW5mby5tYXhtcyA9IGdldE1heGltdW1Ncyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgIGZyYW1lSW5mby5tYXhmID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShmcmFtZUluZm8ubWF4bXMsIGZyYW1lSW5mby5tc3BmKSAvLyBNYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaTAgPSAwIC8vIFRoZSBsb3dlc3QgcG9zc2libGUgZnJhbWUgKGFsd2F5cyAwKVxuICAgIGZyYW1lSW5mby5mcmlBID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPCBmcmFtZUluZm8uZnJpMCkgPyBmcmFtZUluZm8uZnJpMCA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLy8gVGhlIGxlZnRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaU1heCA9IChmcmFtZUluZm8ubWF4ZiA8IDYwKSA/IDYwIDogZnJhbWVJbmZvLm1heGYgLy8gVGhlIG1heGltdW0gZnJhbWUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpTWF4MiA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heCAqIDEuODggIC8vIEV4dGVuZCB0aGUgbWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSAoYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBrZXlmcmFtZXMgYmV5b25kIHRoZSBwcmV2aW91c2x5IGRlZmluZWQgbWF4KVxuICAgIGZyYW1lSW5mby5mcmlCID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gPiBmcmFtZUluZm8uZnJpTWF4MikgPyBmcmFtZUluZm8uZnJpTWF4MiA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLy8gVGhlIHJpZ2h0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlXID0gTWF0aC5hYnMoZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkgLy8gVGhlIHdpZHRoIG9mIHRoZSB2aXNpYmxlIHJhbmdlIGluIGZyYW1lc1xuICAgIGZyYW1lSW5mby5weHBmID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8gZnJhbWVJbmZvLmZyaVcpIC8vIE51bWJlciBvZiBwaXhlbHMgcGVyIGZyYW1lIChyb3VuZGVkKVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA8IDEpIGZyYW1lSW5mby5wU2NyeHBmID0gMVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA+IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIGZyYW1lSW5mby5weHBmID0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aFxuICAgIGZyYW1lSW5mby5weEEgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4QiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhNYXgyID0gZnJhbWVJbmZvLmZyaU1heDIgKiBmcmFtZUluZm8ucHhwZiAvLyBUaGUgd2lkdGggaW4gcGl4ZWxzIHRoYXQgdGhlIGVudGlyZSB0aW1lbGluZSAoXCJmcmlNYXgyXCIpIHBhZGRpbmcgd291bGQgZXF1YWxcbiAgICBmcmFtZUluZm8ubXNBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgbGVmdG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8ubXNCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgcmlnaHRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLnNjTCA9IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvLyBUaGUgbGVuZ3RoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsZXIgdmlld1xuICAgIGZyYW1lSW5mby5zY1JhdGlvID0gZnJhbWVJbmZvLnB4TWF4MiAvIGZyYW1lSW5mby5zY0wgLy8gVGhlIHJhdGlvIG9mIHRoZSBzY3JvbGxlciB2aWV3IHRvIHRoZSB0aW1lbGluZSB2aWV3IChzbyB0aGUgc2Nyb2xsZXIgcmVuZGVycyBwcm9wb3J0aW9uYWxseSB0byB0aGUgdGltZWxpbmUgYmVpbmcgZWRpdGVkKVxuICAgIGZyYW1lSW5mby5zY0EgPSAoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIGxlZnQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgZnJhbWVJbmZvLnNjQiA9IChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgcmlnaHQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgcmV0dXJuIGZyYW1lSW5mb1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMvdGhlc2UgbWlzbm9tZXIocykuIEl0J3Mgbm90ICdBU0NJSSdcbiAgZ2V0QXNjaWlUcmVlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGxldCBhcmNoeUZvcm1hdCA9IHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgICBsZXQgYXJjaHlTdHIgPSBhcmNoeShhcmNoeUZvcm1hdClcbiAgICAgIHJldHVybiBhcmNoeVN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXRBcmNoeUZvcm1hdE5vZGVzIChsYWJlbCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWwsXG4gICAgICBub2RlczogY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykubWFwKChjaGlsZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCBjaGlsZC5jaGlsZHJlbilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50Um93c0RhdGEgKCkge1xuICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgKiptdXN0KiogY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIGNvbXBvbmVudCBoZWFkaW5ncy9wcm9wZXJ0eSByb3dzXG4gICAgbGV0IGFzY2lpU3ltYm9scyA9IHRoaXMuZ2V0QXNjaWlUcmVlKCkuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGNvbXBvbmVudFJvd3MgPSBbXVxuICAgIGxldCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlID0ge31cbiAgICBsZXQgdmlzaXRvckl0ZXJhdGlvbnMgPSAwXG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlIHx8ICF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIGNvbXBvbmVudFJvd3NcblxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzKSA9PiB7XG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51cHNlcnRGcm9tTm9kZVdpdGhDb21wb25lbnRDYWNoZWQobm9kZSwgcGFyZW50LCB0aGlzLl9jb21wb25lbnQsIHt9KVxuXG4gICAgICBjb25zdCBpc0NvbXBvbmVudCA9IGVsZW1lbnQuaXNDb21wb25lbnQoKVxuICAgICAgY29uc3QgZWxlbWVudE5hbWUgPSBlbGVtZW50LmdldE5hbWVTdHJpbmcoKVxuICAgICAgY29uc3QgY29tcG9uZW50SWQgPSBlbGVtZW50LmdldENvbXBvbmVudElkKClcblxuICAgICAgaWYgKCFwYXJlbnQgfHwgKHBhcmVudC5fX2lzRXhwYW5kZWQgJiYgKHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuQUxMT1dFRF9UQUdOQU1FU1tlbGVtZW50TmFtZV0gfHwgaXNDb21wb25lbnQpKSkgeyAvLyBPbmx5IHRoZSB0b3AtbGV2ZWwgYW5kIGFueSBleHBhbmRlZCBzdWJjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IGFzY2lpQnJhbmNoID0gYXNjaWlTeW1ib2xzW3Zpc2l0b3JJdGVyYXRpb25zXSAvLyBXYXJuaW5nOiBUaGUgY29tcG9uZW50IHN0cnVjdHVyZSBtdXN0IG1hdGNoIHRoYXQgZ2l2ZW4gdG8gY3JlYXRlIHRoZSBhc2NpaSB0cmVlXG4gICAgICAgIGNvbnN0IGhlYWRpbmdSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCwgcHJvcGVydHlSb3dzOiBbXSwgaXNIZWFkaW5nOiB0cnVlLCBjb21wb25lbnRJZDogbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddIH1cbiAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKGhlYWRpbmdSb3cpXG5cbiAgICAgICAgaWYgKCFhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSkge1xuICAgICAgICAgIGNvbnN0IGRvR29EZWVwID0gbG9jYXRvci5sZW5ndGggPT09IDMgLy8gMC4wLCAwLjEsIGV0Y1xuICAgICAgICAgIGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdID0gT2JqZWN0LnZhbHVlcyhlbGVtZW50LmdldEFkZHJlc3NhYmxlUHJvcGVydGllcyhkb0dvRGVlcCkpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbHVzdGVySGVhZGluZ3NGb3VuZCA9IHt9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW2ldXG5cbiAgICAgICAgICBsZXQgcHJvcGVydHlSb3dcblxuICAgICAgICAgICAgLy8gU29tZSBwcm9wZXJ0aWVzIGdldCBncm91cGVkIGluc2lkZSB0aGVpciBvd24gYWNjb3JkaW9uIHNpbmNlIHRoZXkgaGF2ZSBtdWx0aXBsZSBzdWJjb21wb25lbnRzLCBlLmcuIHRyYW5zbGF0aW9uLngseSx6XG4gICAgICAgICAgaWYgKHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIpIHtcbiAgICAgICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXhcbiAgICAgICAgICAgIGxldCBjbHVzdGVyS2V5ID0gYCR7Y29tcG9uZW50SWR9XyR7Y2x1c3RlclByZWZpeH1gXG4gICAgICAgICAgICBsZXQgaXNDbHVzdGVySGVhZGluZyA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGNsdXN0ZXIgd2l0aCB0aGUgY3VycmVudCBrZXkgaXMgZXhwYW5kZWQgcmVuZGVyIGVhY2ggb2YgdGhlIHJvd3MgaW5kaXZpZHVhbGx5XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbY2x1c3RlcktleV0pIHtcbiAgICAgICAgICAgICAgaWYgKCFjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSkge1xuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0gPSB0cnVlXG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgICAgY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyS2V5LFxuICAgICAgICAgICAgICAgIGlzQ2x1c3Rlck1lbWJlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nLFxuICAgICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcixcbiAgICAgICAgICAgICAgICBpc1Byb3BlcnR5OiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudElkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBjbHVzdGVyLCBzaGlmdGluZyB0aGUgaW5kZXggZm9yd2FyZCBzbyB3ZSBkb24ndCByZS1yZW5kZXIgdGhlIGluZGl2aWR1YWxzIG9uIHRoZSBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgbG9vcFxuICAgICAgICAgICAgICBsZXQgY2x1c3RlclNldCA9IFtwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcl1cbiAgICAgICAgICAgICAgICAvLyBMb29rIGFoZWFkIGJ5IGEgZmV3IHN0ZXBzIGluIHRoZSBhcnJheSBhbmQgc2VlIGlmIHRoZSBuZXh0IGVsZW1lbnQgaXMgYSBtZW1iZXIgb2YgdGhlIGN1cnJlbnQgY2x1c3RlclxuICAgICAgICAgICAgICBsZXQgayA9IGkgLy8gVGVtcG9yYXJ5IHNvIHdlIGNhbiBpbmNyZW1lbnQgYGlgIGluIHBsYWNlXG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IGogKyBrXG4gICAgICAgICAgICAgICAgbGV0IG5leHREZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1bbmV4dEluZGV4XVxuICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIG5leHQgdGhpbmcgaW4gdGhlIGxpc3Qgc2hhcmVzIHRoZSBzYW1lIGNsdXN0ZXIgbmFtZSwgbWFrZSBpdCBwYXJ0IG9mIHRoaXMgY2x1c3Rlc3JcbiAgICAgICAgICAgICAgICBpZiAobmV4dERlc2NyaXB0b3IgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3RlciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeCA9PT0gY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgY2x1c3RlclNldC5wdXNoKG5leHREZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBhbHJlYWR5IGdvIHRvIHRoZSBuZXh0IG9uZSwgYnVtcCB0aGUgaXRlcmF0aW9uIGluZGV4IHNvIHdlIHNraXAgaXQgb24gdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHNpYmxpbmdzLFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICAgICAgY2x1c3RlcktleSxcbiAgICAgICAgICAgICAgICBjbHVzdGVyOiBjbHVzdGVyU2V0LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJOYW1lOiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLm5hbWUsXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGNvbXBvbmVudElkXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7XG4gICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgIHNpYmxpbmdzLFxuICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsXG4gICAgICAgICAgICAgIGlzUHJvcGVydHk6IHRydWUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVhZGluZ1Jvdy5wcm9wZXJ0eVJvd3MucHVzaChwcm9wZXJ0eVJvdylcblxuICAgICAgICAgICAgLy8gUHVzaGluZyBhbiBlbGVtZW50IGludG8gYSBjb21wb25lbnQgcm93IHdpbGwgcmVzdWx0IGluIGl0IHJlbmRlcmluZywgc28gb25seSBwdXNoXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVydHkgcm93cyBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRleFxuICAgICAgICAgIGlmIChub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKHByb3BlcnR5Um93KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXRvckl0ZXJhdGlvbnMrK1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzLmZvckVhY2goKGl0ZW0sIGluZGV4LCBpdGVtcykgPT4ge1xuICAgICAgaXRlbS5faW5kZXggPSBpbmRleFxuICAgICAgaXRlbS5faXRlbXMgPSBpdGVtc1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzID0gY29tcG9uZW50Um93cy5maWx0ZXIoKHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yIH0pID0+IHtcbiAgICAgICAgLy8gTG9jYXRvcnMgPiAwLjAgYXJlIGJlbG93IHRoZSBsZXZlbCB3ZSB3YW50IHRvIGRpc3BsYXkgKHdlIG9ubHkgd2FudCB0aGUgdG9wIGFuZCBpdHMgY2hpbGRyZW4pXG4gICAgICBpZiAobG9jYXRvci5zcGxpdCgnLicpLmxlbmd0aCA+IDIpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuICFwYXJlbnQgfHwgcGFyZW50Ll9faXNFeHBhbmRlZFxuICAgIH0pXG5cbiAgICByZXR1cm4gY29tcG9uZW50Um93c1xuICB9XG5cbiAgbWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBsZXQgdmFsdWVHcm91cCA9IFRpbWVsaW5lUHJvcGVydHkuZ2V0VmFsdWVHcm91cChjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSlcbiAgICBpZiAoIXZhbHVlR3JvdXApIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgbGV0IGtleWZyYW1lc0xpc3QgPSBPYmplY3Qua2V5cyh2YWx1ZUdyb3VwKS5tYXAoKGtleWZyYW1lS2V5KSA9PiBwYXJzZUludChrZXlmcmFtZUtleSwgMTApKS5zb3J0KChhLCBiKSA9PiBhIC0gYilcbiAgICBpZiAoa2V5ZnJhbWVzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5ZnJhbWVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zY3VyciA9IGtleWZyYW1lc0xpc3RbaV1cbiAgICAgIGlmIChpc05hTihtc2N1cnIpKSBjb250aW51ZVxuICAgICAgbGV0IG1zcHJldiA9IGtleWZyYW1lc0xpc3RbaSAtIDFdXG4gICAgICBsZXQgbXNuZXh0ID0ga2V5ZnJhbWVzTGlzdFtpICsgMV1cblxuICAgICAgaWYgKG1zY3VyciA+IGZyYW1lSW5mby5tc0IpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGFmdGVyIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0XG4gICAgICBpZiAobXNjdXJyIDwgZnJhbWVJbmZvLm1zQSAmJiBtc25leHQgIT09IHVuZGVmaW5lZCAmJiBtc25leHQgPCBmcmFtZUluZm8ubXNBKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBlbnRpcmVseSBiZWZvcmUgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXQgKHBhcnRpYWwgc2VnbWVudHMgYXJlIG9rKVxuXG4gICAgICBsZXQgcHJldlxuICAgICAgbGV0IGN1cnJcbiAgICAgIGxldCBuZXh0XG5cbiAgICAgIGlmIChtc3ByZXYgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNwcmV2KSkge1xuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIG1zOiBtc3ByZXYsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpIC0gMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc3ByZXYsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc3ByZXZdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zcHJldl0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdXJyID0ge1xuICAgICAgICBtczogbXNjdXJyLFxuICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc2N1cnIsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNjdXJyXS52YWx1ZSxcbiAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNjdXJyXS5jdXJ2ZVxuICAgICAgfVxuXG4gICAgICBpZiAobXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zbmV4dCkpIHtcbiAgICAgICAgbmV4dCA9IHtcbiAgICAgICAgICBtczogbXNuZXh0LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSArIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNuZXh0LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNuZXh0XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc25leHRdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHB4T2Zmc2V0TGVmdCA9IChjdXJyLmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGxldCBweE9mZnNldFJpZ2h0XG4gICAgICBpZiAobmV4dCkgcHhPZmZzZXRSaWdodCA9IChuZXh0LmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcblxuICAgICAgbGV0IHNlZ21lbnRPdXRwdXQgPSBpdGVyYXRlZShwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGkpXG4gICAgICBpZiAoc2VnbWVudE91dHB1dCkgc2VnbWVudE91dHB1dHMucHVzaChzZWdtZW50T3V0cHV0KVxuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgbWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eVJvd3MsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgcHJvcGVydHlSb3dzLmZvckVhY2goKHByb3BlcnR5Um93KSA9PiB7XG4gICAgICBpZiAocHJvcGVydHlSb3cuaXNDbHVzdGVyKSB7XG4gICAgICAgIHByb3BlcnR5Um93LmNsdXN0ZXIuZm9yRWFjaCgocHJvcGVydHlEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5RGVzY3JpcHRvci5uYW1lXG4gICAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlSb3cucHJvcGVydHkubmFtZVxuICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICByZW1vdmVUaW1lbGluZVNoYWRvdyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICB9XG5cbiAgLypcbiAgICogcmVuZGVyIG1ldGhvZHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHRvcDogMTdcbiAgICAgICAgfX0+XG4gICAgICAgIDxDb250cm9sc0FyZWFcbiAgICAgICAgICByZW1vdmVUaW1lbGluZVNoYWRvdz17dGhpcy5yZW1vdmVUaW1lbGluZVNoYWRvdy5iaW5kKHRoaXMpfVxuICAgICAgICAgIGFjdGl2ZUNvbXBvbmVudERpc3BsYXlOYW1lPXt0aGlzLnByb3BzLnVzZXJjb25maWcubmFtZX1cbiAgICAgICAgICB0aW1lbGluZU5hbWVzPXtPYmplY3Qua2V5cygodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpID8gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGltZWxpbmVzIDoge30pfVxuICAgICAgICAgIHNlbGVjdGVkVGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgY3VycmVudEZyYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1cbiAgICAgICAgICBpc1BsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgIHBsYXliYWNrU3BlZWQ9e3RoaXMuc3RhdGUucGxheWVyUGxheWJhY2tTcGVlZH1cbiAgICAgICAgICBsYXN0RnJhbWU9e3RoaXMuZ2V0RnJhbWVJbmZvKCkuZnJpTWF4fVxuICAgICAgICAgIGNoYW5nZVRpbWVsaW5lTmFtZT17KG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY3JlYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZHVwbGljYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZGVsZXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgc2VsZWN0VGltZWxpbmU9eyhjdXJyZW50VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIG1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIGluLW1lbW9yeSBjb21wb25lbnQgb3IgcHJvcGVydHkgYXNzaWdubWVudCBtaWdodCBub3Qgd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRUaW1lbGluZU5hbWUoY3VycmVudFRpbWVsaW5lTmFtZSwgeyBmcm9tOiAndGltZWxpbmUnIH0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZXRUaW1lbGluZU5hbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGN1cnJlbnRUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50VGltZWxpbmVOYW1lIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBCYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnBsYXliYWNrU2tpcEJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwRm9yd2FyZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbGF5YmFja1NraXBGb3J3YXJkKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrUGxheVBhdXNlPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNoYW5nZVBsYXliYWNrU3BlZWQ9eyhpbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUGxheWJhY2tTcGVlZCA9IE51bWJlcihpbnB1dEV2ZW50LnRhcmdldC52YWx1ZSB8fCAxKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBsYXllclBsYXliYWNrU3BlZWQgfSlcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0SXRlbVZhbHVlRGVzY3JpcHRvciAoaW5wdXRJdGVtKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihpbnB1dEl0ZW0ubm9kZSwgZnJhbWVJbmZvLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGUsIHRoaXMuX2NvbXBvbmVudCwgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyksIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgaW5wdXRJdGVtLnByb3BlcnR5KVxuICB9XG5cbiAgZ2V0Q3VycmVudFRpbWVsaW5lVGltZSAoZnJhbWVJbmZvKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgfVxuXG4gIHJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoaXRlbSkge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgbGV0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcblxuICAgIC8vIFRPRE86IE9wdGltaXplIHRoaXM/IFdlIGRvbid0IG5lZWQgdG8gcmVuZGVyIGV2ZXJ5IHNlZ21lbnQgc2luY2Ugc29tZSBvZiB0aGVtIG92ZXJsYXAuXG4gICAgLy8gTWF5YmUga2VlcCBhIGxpc3Qgb2Yga2V5ZnJhbWUgJ3BvbGVzJyByZW5kZXJlZCwgYW5kIG9ubHkgcmVuZGVyIG9uY2UgaW4gdGhhdCBzcG90P1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgaGVpZ2h0OiAyNSwgd2lkdGg6ICcxMDAlJywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgaXRlbS5wcm9wZXJ0eVJvd3MsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIGluZGV4LCBoYW5kbGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2FudCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIGxldCBhY3RpdmVLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIGFjdGl2ZUtleWZyYW1lcyA9IFtjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLCBhY3RpdmVLZXlmcmFtZXM6IFtdIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnRyYW5zaXRpb25Cb2R5RHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgICAgfVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBjdXJyLm1zXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gY3Vyci5mcmFtZVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbnVsbCxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG51bGwsXG4gICAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgekluZGV4OiAxMDAzLFxuICAgICAgICAgICAgY3Vyc29yOiAnY29sLXJlc2l6ZSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNvbG9LZXlmcmFtZSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgbGV0IGlzQWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lcy5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBpZiAoayA9PT0gY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4KSBpc0FjdGl2ZSA9IHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lcy5mb3JFYWNoKChrKSA9PiB7XG4gICAgICBpZiAoayA9PT0gY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4KSBmaXJzdEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKSkgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIGxldCBhY3RpdmVLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIGFjdGl2ZUtleWZyYW1lcyA9IFtjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsIGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IHRydWUsXG4gICAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLCB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZSwgYWN0aXZlS2V5ZnJhbWVzOiBbXSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgJ2JvZHknLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29udGFpbmVyJ1xuICAgICAgICAgIGtleT17dW5pcXVlS2V5fVxuICAgICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS10cmFuc2l0aW9uJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgY3VydmU6IGN1cnIuY3VydmUsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9IFBhbGV0dGUuR1JBWVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gJ3RyYW5zcGFyZW50J1xuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0ICsgNCxcbiAgICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHtvcHRpb25zLmNvbGxhcHNlZCAmJlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbGxhcHNlZC1iYWNrZHJvcCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgekluZGV4OiA0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuR1JBWVxuICAgICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsJ1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMSxcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkzKVxuICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjk2NSlcbiAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMixcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICBvdmVyZmxvdzogYnJlYWtpbmdCb3VuZHMgPyAndmlzaWJsZScgOiAnaGlkZGVuJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPEN1cnZlU1ZHXG4gICAgICAgICAgICAgIGlkPXt1bmlxdWVLZXl9XG4gICAgICAgICAgICAgIGxlZnRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAgIHJpZ2h0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29uc3RhbnRCb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICAvLyBjb25zdCBhY3RpdmVJbmZvID0gc2V0QWN0aXZlQ29udGVudHMocHJvcGVydHlOYW1lLCBjdXJyLCBuZXh0LCBmYWxzZSwgdGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICB9fVxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBjbGFzc05hbWU9J2NvbnN0YW50LWJvZHknXG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXNlZ21lbnQnLFxuICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0ICsgNCxcbiAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0XG4gICAgICAgIH19PlxuICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodDogMyxcbiAgICAgICAgICB0b3A6IDEyLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMixcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gQ29sb3IoUGFsZXR0ZS5HUkFZKS5mYWRlKDAuMjMpXG4gICAgICAgICAgICA6IFBhbGV0dGUuREFSS0VSX0dSQVlcbiAgICAgICAgfX0gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgaXRlbSwgaW5kZXgsIGhlaWdodCwgYWxsSXRlbXMsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGNvbnN0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGl0ZW0ucHJvcGVydHkubmFtZVxuICAgIGNvbnN0IGlzQWN0aXZhdGVkID0gdGhpcy5pc1Jvd0FjdGl2YXRlZChpdGVtKVxuXG4gICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHt9KSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0IC0gMTAsIDQsICdsZWZ0Jywge30pKVxuICAgICAgfVxuICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCA1LCAnbWlkZGxlJywge30pKVxuICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0ICsgMTAsIDYsICdyaWdodCcsIHt9KSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGtleT17YGtleWZyYW1lLWNvbnRhaW5lci0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICAgIGNsYXNzTmFtZT17YGtleWZyYW1lLWNvbnRhaW5lcmB9PlxuICAgICAgICAgIHtzZWdtZW50UGllY2VzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIClcbiAgICB9KVxuICB9XG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyR2F1Z2UgKGZyYW1lSW5mbykge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVGcmFtZXMoKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHBpeGVsc1BlckZyYW1lLCBmcmFtZU1vZHVsdXMpID0+IHtcbiAgICAgICAgaWYgKGZyYW1lTnVtYmVyID09PSAwIHx8IGZyYW1lTnVtYmVyICUgZnJhbWVNb2R1bHVzID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57ZnJhbWVOdW1iZXJ9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnc2Vjb25kcycpIHsgLy8gYWthIHRpbWUgZWxhcHNlZCwgbm90IGZyYW1lc1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZVRpbWVzKChtaWxsaXNlY29uZHNOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgdG90YWxNaWxsaXNlY29uZHMpID0+IHtcbiAgICAgICAgaWYgKHRvdGFsTWlsbGlzZWNvbmRzIDw9IDEwMDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PnttaWxsaXNlY29uZHNOdW1iZXJ9bXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2Zvcm1hdFNlY29uZHMobWlsbGlzZWNvbmRzTnVtYmVyIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRnJhbWVHcmlkIChmcmFtZUluZm8pIHtcbiAgICB2YXIgZ3VpZGVIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBpZD0nZnJhbWUtZ3JpZCc+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVGcmFtZXMoKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHBpeGVsc1BlckZyYW1lLCBmcmFtZU1vZHVsdXMpID0+IHtcbiAgICAgICAgICByZXR1cm4gPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17e2hlaWdodDogZ3VpZGVIZWlnaHQgKyAzNSwgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgQ29sb3IoUGFsZXR0ZS5DT0FMKS5mYWRlKDAuNjUpLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0b3A6IDM0fX0gLz5cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJTY3J1YmJlciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBpZiAodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSB8fCB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmFCKSByZXR1cm4gJydcbiAgICB2YXIgZnJhbWVPZmZzZXQgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAtIGZyYW1lSW5mby5mcmlBXG4gICAgdmFyIHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgIHZhciBzaGFmdEhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAxMCkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIHNjcnViYmVyRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgZnJhbWVCYXNlbGluZTogdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUsXG4gICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzY3J1YmJlckRyYWdTdGFydDogbnVsbCwgZnJhbWVCYXNlbGluZTogdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUsIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZSB9KVxuICAgICAgICAgIH0sIDEwMClcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLmNoYW5nZVNjcnViYmVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAxMyxcbiAgICAgICAgICAgICAgd2lkdGg6IDEzLFxuICAgICAgICAgICAgICB0b3A6IDIwLFxuICAgICAgICAgICAgICBsZWZ0OiBweE9mZnNldCAtIDYsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnLFxuICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDAgMnB4IDAgcmdiYSgwLCAwLCAwLCAuOSknLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDZcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogc2hhZnRIZWlnaHQsXG4gICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICB0b3A6IDI1LFxuICAgICAgICAgICAgICBsZWZ0OiBweE9mZnNldCxcbiAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJEdXJhdGlvbk1vZGlmaWVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIC8vIHZhciB0cmltQXJlYUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHZhciBweE9mZnNldCA9IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nID8gMCA6IC10aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgPj0gZnJhbWVJbmZvLmZyaU1heDIgfHwgdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgICAgZHVyYXRpb25EcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIGR1cmF0aW9uVHJpbTogMFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGx9KVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvbkRyYWdTdGFydDogbnVsbCwgZHVyYXRpb25UcmltOiAwIH0pIH0sIDEwMClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiBweE9mZnNldCwgdG9wOiAwLCB6SW5kZXg6IDEwMDZ9fT5cbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgICB3aWR0aDogNixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDMyLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0cmltLWFyZWEnIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1vdXNlRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC02LFxuICAgICAgICAgICAgICB3aWR0aDogMjYgKyBweE9mZnNldCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMzUpIHx8IDAsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoUGFsZXR0ZS5GQVRIRVJfQ09BTCkuZmFkZSgwLjYpXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8c3BhbiAvPlxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRvcENvbnRyb2xzICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0b3AtY29udHJvbHMgbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgKyAxMCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUxcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWVrZWVwaW5nLXdyYXBwZXInXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1lLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtaW5XaWR0aDogODYsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiAyLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBoZWlnaHQ6IDI0LCBwYWRkaW5nOiA0LCBmb250V2VpZ2h0OiAnbGlnaHRlcicsIGZvbnRTaXplOiAxOSB9fT5cbiAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgICAgICAgICAgICAgPyA8c3Bhbj57fn50aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1mPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1mcHMtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiAzOCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGxlZnQ6IDIxMSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICBmb250U3R5bGU6ICdpdGFsaWMnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDUsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgeyh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgICAgICAgICAgICAgPyA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57fn50aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1mPC9zcGFuPlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctNHB4J319Pnt0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZH1mcHM8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRvZ2dsZSdcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMudG9nZ2xlVGltZURpc3BsYXlNb2RlLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodDogMTAsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNyxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7dGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnXG4gICAgICAgICAgICAgID8gKDxzcGFuPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tjb2xvcjogUGFsZXR0ZS5ST0NLLCBwb3NpdGlvbjogJ3JlbGF0aXZlJ319PkZSQU1FU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCd9fT5TRUNPTkRTPC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj4pXG4gICAgICAgICAgICAgIDogKDxzcGFuPlxuICAgICAgICAgICAgICAgIDxkaXY+RlJBTUVTPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnLCBjb2xvcjogUGFsZXR0ZS5ST0NLLCBwb3NpdGlvbjogJ3JlbGF0aXZlJ319PlNFQ09ORFNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDwvc3Bhbj4pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWJveCdcbiAgICAgICAgICBvbkNsaWNrPXsoY2xpY2tFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IG51bGwgfHwgdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldCBsZWZ0WCA9IGNsaWNrRXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgICBsZXQgZnJhbWVYID0gTWF0aC5yb3VuZChsZWZ0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgICBsZXQgbmV3RnJhbWUgPSBmcmFtZUluZm8uZnJpQSArIGZyYW1lWFxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhuZXdGcmFtZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAvLyBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogMTAsXG4gICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVEIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckZyYW1lR3JpZChmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlckdhdWdlKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyU2NydWJiZXIoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckR1cmF0aW9uTW9kaWZpZXIoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBrbm9iUmFkaXVzID0gNVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndGltZWxpbmUtcmFuZ2Utc2Nyb2xsYmFyJ1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NMLFxuICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkRBUktFUl9HUkFZLFxuICAgICAgICAgIGJvcmRlclRvcDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUxcbiAgICAgICAgfX0+XG4gICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sXG4gICAgICAgICAgICAgIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSxcbiAgICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBmYWxzZSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsXG4gICAgICAgICAgICAgIHNjcm9sbGJhckVuZDogbnVsbCxcbiAgICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZnJhbWVJbmZvLnNjQSA+IDAgfSkgLy8gaWYgdGhlIHNjcm9sbGJhciBub3QgYXQgcG9zaXRpb24gemVybywgc2hvdyBpbm5lciBzaGFkb3cgZm9yIHRpbWVsaW5lIGFyZWFcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgICAgICAgICB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLngsIGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVEVTVF9HUkFZLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgICBsZWZ0OiBmcmFtZUluZm8uc2NBLFxuICAgICAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjQiAtIGZyYW1lSW5mby5zY0EgKyAxNyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiBrbm9iUmFkaXVzLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgMCwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgbGVmdDogMCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FIH19IC8+XG4gICAgICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKDAsIGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCByaWdodDogMCwgYm9yZGVyUmFkaXVzOiAnNTAlJywgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FIH19IC8+XG4gICAgICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC0gMTAsIGxlZnQ6IDEwLCBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgbGVmdDogKCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAvIGZyYW1lSW5mby5mcmlNYXgyKSAqIDEwMCkgKyAnJSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckJvdHRvbUNvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogNDUsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB6SW5kZXg6IDEwMDAwXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scygpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyAoeyBub2RlLCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoIH0pIHtcbiAgICAvLyBIQUNLOiBVbnRpbCB3ZSBlbmFibGUgZnVsbCBzdXBwb3J0IGZvciBuZXN0ZWQgZGlzcGxheSBpbiB0aGlzIGxpc3QsIHN3YXAgdGhlIFwidGVjaG5pY2FsbHkgY29ycmVjdFwiXG4gICAgLy8gdHJlZSBtYXJrZXIgd2l0aCBhIFwidmlzdWFsbHkgY29ycmVjdFwiIG1hcmtlciByZXByZXNlbnRpbmcgdGhlIHRyZWUgd2UgYWN0dWFsbHkgc2hvd1xuICAgIGNvbnN0IGhlaWdodCA9IGFzY2lpQnJhbmNoID09PSAn4pSU4pSA4pSsICcgPyAxNSA6IDI1XG4gICAgY29uc3QgY29sb3IgPSBub2RlLl9faXNFeHBhbmRlZCA/IFBhbGV0dGUuUk9DSyA6IFBhbGV0dGUuUk9DS19NVVRFRFxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IG5vZGUuZWxlbWVudE5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICAobG9jYXRvciA9PT0gJzAnKVxuICAgICAgICA/ICg8ZGl2IHN0eWxlPXt7aGVpZ2h0OiAyNywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMXB4KSd9fT5cbiAgICAgICAgICB7dHJ1bmNhdGUobm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddIHx8IGVsZW1lbnROYW1lLCAxMil9XG4gICAgICAgIDwvZGl2PilcbiAgICAgICAgOiAoPHNwYW4gY2xhc3NOYW1lPSduby1zZWxlY3QnPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDIxLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAnbWlkZGxlJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBtYXJnaW5SaWdodDogNyxcbiAgICAgICAgICAgICAgbWFyZ2luVG9wOiAxXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNSwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVlfRklUMSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIHdpZHRoOiAxLCBoZWlnaHQ6IGhlaWdodH19IC8+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDR9fT7igJQ8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBjb2xvcixcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7dHJ1bmNhdGUobm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddIHx8IGA8JHtlbGVtZW50TmFtZX0+YCwgOCl9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+KVxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudEhlYWRpbmdSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bjb21wb25lbnQtaGVhZGluZy1yb3ctJHtjb21wb25lbnRJZH0tJHtpbmRleH1gfVxuICAgICAgICBjbGFzc05hbWU9J2NvbXBvbmVudC1oZWFkaW5nLXJvdyBuby1zZWxlY3QnXG4gICAgICAgIGRhdGEtY29tcG9uZW50LWlkPXtjb21wb25lbnRJZH1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIC8vIENvbGxhcHNlL2V4cGFuZCB0aGUgZW50aXJlIGNvbXBvbmVudCBhcmVhIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGlmIChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbGxhcHNlTm9kZShpdGVtLm5vZGUsIGNvbXBvbmVudElkKVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCd1bnNlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kTm9kZShpdGVtLm5vZGUsIGNvbXBvbmVudElkKVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUnLFxuICAgICAgICAgIHRhYmxlTGF5b3V0OiAnZml4ZWQnLFxuICAgICAgICAgIGhlaWdodDogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/IDAgOiBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC43NSA6IDEuMFxuICAgICAgICB9fT5cbiAgICAgICAgeyFpdGVtLm5vZGUuX19pc0V4cGFuZGVkICYmIC8vIGNvdmVycyBrZXlmcmFtZSBoYW5nb3ZlciBhdCBmcmFtZSAwIHRoYXQgZm9yIHVuY29sbGFwc2VkIHJvd3MgaXMgaGlkZGVuIGJ5IHRoZSBpbnB1dCBmaWVsZFxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxMCxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodH19IC8+fVxuICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDE1MCxcbiAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZXG4gICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0LCBtYXJnaW5Ub3A6IC02IH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBtYXJnaW5MZWZ0OiAxMFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgeyhpdGVtLm5vZGUuX19pc0V4cGFuZGVkKVxuICAgICAgICAgICAgICAgICAgPyA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IDEsIGxlZnQ6IC0xIH19PjxEb3duQ2Fycm90U1ZHIGNvbG9yPXtQYWxldHRlLlJPQ0t9IC8+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgOiA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IDMgfX0+PFJpZ2h0Q2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcoaXRlbSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0nY29tcG9uZW50LWNvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IGRpc3BsYXk6ICd0YWJsZS1jZWxsJywgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsIGhlaWdodDogJ2luaGVyaXQnIH19PlxuICAgICAgICAgIHsoIWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gdGhpcy5yZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoaXRlbSkgOiAnJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJQcm9wZXJ0eVJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgaHVtYW5OYW1lID0gaHVtYW5pemVQcm9wZXJ0eU5hbWUoaXRlbS5wcm9wZXJ0eS5uYW1lKVxuICAgIHZhciBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgdmFyIGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgdmFyIHByb3BlcnR5TmFtZSA9IGl0ZW0ucHJvcGVydHkgJiYgaXRlbS5wcm9wZXJ0eS5uYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3cnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgLy8gQ29sbGFwc2UgdGhpcyBjbHVzdGVyIGlmIHRoZSBhcnJvdyBvciBuYW1lIGlzIGNsaWNrZWRcbiAgICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7KGl0ZW0uaXNDbHVzdGVySGVhZGluZylcbiAgICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxMzYsXG4gICAgICAgICAgICAgICAgdG9wOiAtMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC00LCBsZWZ0OiAtMyB9fT48RG93bkNhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgOiAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICB7KCFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJiBodW1hbk5hbWUgIT09ICdiYWNrZ3JvdW5kIGNvbG9yJykgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODAsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNCxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICB3aWR0aDogOTEsXG4gICAgICAgICAgICAgIGxpbmVIZWlnaHQ6IDEsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGh1bWFuTmFtZSA9PT0gJ2JhY2tncm91bmQgY29sb3InID8gJ3RyYW5zbGF0ZVkoLTJweCknIDogJ3RyYW5zbGF0ZVkoM3B4KScsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2h1bWFuTmFtZX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0IC0gMSxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPFByb3BlcnR5SW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGV9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBmcmFtZUluZm8ucHhBXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ3Byb3BlcnR5LXJvdycsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXRpbWVsaW5lLXNlZ21lbnRzLWJveCdcbiAgICAgICAgICBvbk1vdXNlRG93bj17KCkgPT4ge1xuICAgICAgICAgICAgbGV0IGtleSA9IGl0ZW0uY29tcG9uZW50SWQgKyAnICcgKyBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICAgICAgICAgIC8vIEF2b2lkIHVubmVjZXNzYXJ5IHNldFN0YXRlcyB3aGljaCBjYW4gaW1wYWN0IHJlbmRlcmluZyBwZXJmb3JtYW5jZVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nba2V5XSkge1xuICAgICAgICAgICAgICBsZXQgYWN0aXZhdGVkUm93cyA9IHt9XG4gICAgICAgICAgICAgIGFjdGl2YXRlZFJvd3Nba2V5XSA9IHRydWVcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGFjdGl2YXRlZFJvd3MgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDbHVzdGVyUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgdmFyIGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgdmFyIGNsdXN0ZXJOYW1lID0gaXRlbS5jbHVzdGVyTmFtZVxuICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LWNsdXN0ZXItcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7Y2x1c3Rlck5hbWV9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdydcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIC8vIEV4cGFuZCB0aGUgcHJvcGVydHkgY2x1c3RlciB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7IXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiAzLFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==