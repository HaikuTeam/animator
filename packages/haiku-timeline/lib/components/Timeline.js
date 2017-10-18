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

      if (this.state.currentFrame >= this.getFrameInfo().friMax) {
        this.playbackSkipBack();
      }

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
            lineNumber: 1438
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
            lineNumber: 1443
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
            lineNumber: 1504
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
            lineNumber: 1527
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
            lineNumber: 1555
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
            lineNumber: 1603
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
              lineNumber: 1615
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1623
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
            lineNumber: 1649
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
              lineNumber: 1677
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
              lineNumber: 1728
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
              lineNumber: 1744
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
                lineNumber: 1761
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
                  lineNumber: 1771
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1779
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
                lineNumber: 1789
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1798
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
                lineNumber: 1816
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
                  lineNumber: 1827
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1837
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
            lineNumber: 1857
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
            lineNumber: 1896
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
              lineNumber: 1939
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
                  lineNumber: 1955
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1956
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
                  lineNumber: 1965
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1966
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
                  lineNumber: 1971
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1972
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
            lineNumber: 1983
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1985
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
            lineNumber: 1998
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2017
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
                lineNumber: 2018
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
                lineNumber: 2031
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
                lineNumber: 2041
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
              lineNumber: 2053
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
              lineNumber: 2076
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2095
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
                lineNumber: 2096
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
                lineNumber: 2109
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2123
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
            lineNumber: 2130
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
              lineNumber: 2143
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
                lineNumber: 2152
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2164
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2166
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
                    lineNumber: 2167
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
                lineNumber: 2171
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2186
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2188
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
                    lineNumber: 2189
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
                  lineNumber: 2192
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
                lineNumber: 2194
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2211
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2212
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2213
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2215
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
                  lineNumber: 2217
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2218
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2219
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2220
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
              lineNumber: 2227
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
            lineNumber: 2264
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
              lineNumber: 2274
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
                lineNumber: 2298
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
                  lineNumber: 2308
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2313
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
                  lineNumber: 2315
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2320
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
              lineNumber: 2324
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
              lineNumber: 2325
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
            lineNumber: 2340
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
            lineNumber: 2367
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2370
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
              lineNumber: 2371
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2382
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2383
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
              lineNumber: 2385
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
            lineNumber: 2400
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
            lineNumber: 2427
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
              lineNumber: 2435
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2443
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
                  lineNumber: 2444
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2449
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2449
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2450
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2450
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
              lineNumber: 2456
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
            lineNumber: 2471
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
              lineNumber: 2481
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
                lineNumber: 2493
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2503
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2503
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
              lineNumber: 2508
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
                lineNumber: 2517
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
                  lineNumber: 2530
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
              lineNumber: 2544
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
              lineNumber: 2553
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
              lineNumber: 2568
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
            lineNumber: 2619
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2650
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
              lineNumber: 2652
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
                lineNumber: 2661
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2668
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2668
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
                lineNumber: 2670
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
                  lineNumber: 2683
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
              lineNumber: 2692
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
              lineNumber: 2701
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
              lineNumber: 2715
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
          lineNumber: 2746
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
            lineNumber: 2749
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
            lineNumber: 2771
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
            lineNumber: 2787
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
              lineNumber: 2798
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
            lineNumber: 2815
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpZE1vdW50IiwiT2JqZWN0Iiwia2V5cyIsInVwZGF0ZXMiLCJrZXkiLCJjaGFuZ2VzIiwiY2JzIiwiY2FsbGJhY2tzIiwic3BsaWNlIiwic2V0U3RhdGUiLCJjbGVhckNoYW5nZXMiLCJmb3JFYWNoIiwiY2IiLCJwdXNoIiwiZmx1c2hVcGRhdGVzIiwiazEiLCJrMiIsImNvbXBvbmVudElkIiwicHJvcGVydHlOYW1lIiwiX3Jvd0NhY2hlQWN0aXZhdGlvbiIsInR1cGxlIiwicmVtb3ZlTGlzdGVuZXIiLCJ0b3VyQ2xpZW50Iiwib2ZmIiwiX2Vudm95Q2xpZW50IiwiY2xvc2VDb25uZWN0aW9uIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xpZW50V2lkdGgiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBsYXliYWNrU2tpcEJhY2siLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiX2VsZW1lbnRzIiwidXBzZXJ0RnJvbU5vZGVXaXRoQ29tcG9uZW50Q2FjaGVkIiwiaXNDb21wb25lbnQiLCJnZXROYW1lU3RyaW5nIiwiZ2V0Q29tcG9uZW50SWQiLCJBTExPV0VEX1RBR05BTUVTIiwiYXNjaWlCcmFuY2giLCJoZWFkaW5nUm93IiwicHJvcGVydHlSb3dzIiwiZG9Hb0RlZXAiLCJ2YWx1ZXMiLCJnZXRBZGRyZXNzYWJsZVByb3BlcnRpZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImsiLCJqIiwibmV4dEluZGV4IiwibmV4dERlc2NyaXB0b3IiLCJjbHVzdGVyTmFtZSIsImlzQ2x1c3RlciIsIml0ZW1zIiwiX2luZGV4IiwiX2l0ZW1zIiwic2VnbWVudE91dHB1dHMiLCJ2YWx1ZUdyb3VwIiwiZ2V0VmFsdWVHcm91cCIsImtleWZyYW1lc0xpc3QiLCJrZXlmcmFtZUtleSIsInBhcnNlSW50Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsIm1zIiwiZnJhbWUiLCJ2YWx1ZSIsImN1cnZlIiwicHhPZmZzZXRMZWZ0IiwicHhPZmZzZXRSaWdodCIsInNlZ21lbnRPdXRwdXQiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wZXJ0eU91dHB1dHMiLCJtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwiY29uY2F0IiwicG9zaXRpb24iLCJyZW1vdmVUaW1lbGluZVNoYWRvdyIsInRpbWVsaW5lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lIiwic2V0VGltZWxpbmVOYW1lIiwicGxheWJhY2tTa2lwRm9yd2FyZCIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImN0eE1lbnVFdmVudCIsInN0b3BQcm9wYWdhdGlvbiIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJEQVJLRVJfR1JBWSIsImFsbEl0ZW1zIiwiaXNBY3RpdmF0ZWQiLCJpc1Jvd0FjdGl2YXRlZCIsInJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciIsIm1hcFZpc2libGVGcmFtZXMiLCJwaXhlbHNQZXJGcmFtZSIsInBvaW50ZXJFdmVudHMiLCJmb250V2VpZ2h0IiwibWFwVmlzaWJsZVRpbWVzIiwibWlsbGlzZWNvbmRzTnVtYmVyIiwidG90YWxNaWxsaXNlY29uZHMiLCJndWlkZUhlaWdodCIsImNsaWVudEhlaWdodCIsImJvcmRlckxlZnQiLCJDT0FMIiwiZnJhQiIsInNoYWZ0SGVpZ2h0IiwiY2hhbmdlU2NydWJiZXJQb3NpdGlvbiIsImJveFNoYWRvdyIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIiwiYm9yZGVyVG9wUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21SaWdodFJhZGl1cyIsIm1vdXNlRXZlbnRzIiwiRkFUSEVSX0NPQUwiLCJ2ZXJ0aWNhbEFsaWduIiwiZm9udFNpemUiLCJib3JkZXJCb3R0b20iLCJmbG9hdCIsIm1pbldpZHRoIiwidGV4dEFsaWduIiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZyIsIlJPQ0tfTVVURUQiLCJmb250U3R5bGUiLCJtYXJnaW5Ub3AiLCJ0b2dnbGVUaW1lRGlzcGxheU1vZGUiLCJtYXJnaW5SaWdodCIsImNsaWNrRXZlbnQiLCJsZWZ0WCIsImZyYW1lWCIsIm5ld0ZyYW1lIiwicmVuZGVyRnJhbWVHcmlkIiwicmVuZGVyR2F1Z2UiLCJyZW5kZXJTY3J1YmJlciIsInJlbmRlckR1cmF0aW9uTW9kaWZpZXIiLCJrbm9iUmFkaXVzIiwiY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UiLCJMSUdIVEVTVF9HUkFZIiwiYm90dG9tIiwicmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciIsInJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyIsIkdSQVlfRklUMSIsIm1hcmdpbkxlZnQiLCJ0YWJsZUxheW91dCIsIkxJR0hUX0dSQVkiLCJvcGFjaXR5IiwicmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyIsInJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsInByb3BlcnR5T25MYXN0Q29tcG9uZW50IiwiaHVtYW5OYW1lIiwidGV4dFRyYW5zZm9ybSIsImxpbmVIZWlnaHQiLCJyZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJyZW5kZXJDbHVzdGVyUm93IiwicmVuZGVyUHJvcGVydHlSb3ciLCJyZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IiwiZ2V0Q29tcG9uZW50Um93c0RhdGEiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJyZW5kZXJUb3BDb250cm9scyIsInJlbmRlckNvbXBvbmVudFJvd3MiLCJyZW5kZXJCb3R0b21Db250cm9scyIsImNvbW1pdHRlZFZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hdkRpciIsImRvRm9jdXMiLCJDb21wb25lbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFLQTs7QUFNQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7QUFrQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7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UixDQVNXO0FBVFg7QUFXRCxXQW5CSDtBQW9CRSw0QkFBa0IsNEJBQU07QUFDdEIsb0JBQUtyZSxRQUFMLENBQWM7QUFDWjVFLDRCQUFjLFFBQUsrQyxLQUFMLENBQVdoRDtBQURiLGFBQWQ7QUFHRCxXQXhCSDtBQXlCRSwrQkFBcUIsNkJBQUNxakIsTUFBRCxFQUFTQyxPQUFULEVBQXFCO0FBQ3hDLGdCQUFJblcsT0FBTyxRQUFLbkssS0FBTCxDQUFXaEQsYUFBdEI7QUFDQSxnQkFBSTBILE9BQU8sK0JBQWF5RixJQUFiLEVBQW1Ca1csTUFBbkIsQ0FBWDtBQUNBLGdCQUFJM2IsSUFBSixFQUFVO0FBQ1Isc0JBQUs3QyxRQUFMLENBQWM7QUFDWjVFLDhCQUFlcWpCLE9BQUQsR0FBWTViLElBQVosR0FBbUIsSUFEckI7QUFFWjFILCtCQUFlMEg7QUFGSCxlQUFkO0FBSUQ7QUFDRixXQWxDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE1Q0YsT0FERjtBQWtGRDs7OztFQWpuRm9CLGdCQUFNNmIsUzs7a0JBb25GZHpnQixRIiwiZmlsZSI6IlRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgYXJjaHkgZnJvbSAnYXJjaHknXG5pbXBvcnQgeyBEcmFnZ2FibGVDb3JlIH0gZnJvbSAncmVhY3QtZHJhZ2dhYmxlJ1xuXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIGxpbmtFeHRlcm5hbEFzc2V0c09uRHJvcCxcbiAgcHJldmVudERlZmF1bHREcmFnXG59IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL2RuZEhlbHBlcnMnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IFtdLFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuY29uc3QgVEhST1RUTEVfVElNRSA9IDE3IC8vIG1zXG5cbmZ1bmN0aW9uIHZpc2l0IChub2RlLCB2aXNpdG9yKSB7XG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2aXNpdG9yKGNoaWxkKVxuICAgICAgICB2aXNpdChjaGlsZCwgdmlzaXRvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSBsb2Rhc2guYXNzaWduKHt9LCBERUZBVUxUUylcbiAgICB0aGlzLmN0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdIC8vIEFycmF5PHtldmVudEVtaXR0ZXI6RXZlbnRFbWl0dGVyLCBldmVudE5hbWU6c3RyaW5nLCBldmVudEhhbmRsZXI6RnVuY3Rpb259PlxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ3RpbWVsaW5lJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHdlIHN0b3JlIGFjY3VtdWxhdGVkIGtleWZyYW1lIG1vdmVtZW50cywgd2UgY2FuIHNlbmQgdGhlIHdlYnNvY2tldCB1cGRhdGUgaW4gYmF0Y2hlcztcbiAgICAvLyBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBhdm9pZHMgdW5uZWNlc3NhcnkgdXBkYXRlcyB0byB0aGUgb3ZlciB2aWV3c1xuICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uID0gbG9kYXNoLnRocm90dGxlKHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uLmJpbmQodGhpcyksIDI1MClcbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB3aW5kb3cudGltZWxpbmUgPSB0aGlzXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBwcmV2ZW50RGVmYXVsdERyYWcsIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgbGlua0V4dGVybmFsQXNzZXRzT25Ecm9wLmJpbmQodGhpcyksIGZhbHNlKVxuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAobmF0aXZlRXZlbnQpIHtcbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgLy8gY2FzZSAzNzogLy9sZWZ0XG4gICAgICAvLyBjYXNlIDM5OiAvL3JpZ2h0XG4gICAgICAvLyBjYXNlIDM4OiAvL3VwXG4gICAgICAvLyBjYXNlIDQwOiAvL2Rvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUtleWJvYXJkU3RhdGUgKHVwZGF0ZXMpIHtcbiAgICAvLyBJZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZG9uJ3QgYWxsb3cga2V5Ym9hcmQgc3RhdGUgY2hhbmdlcyB0byBjYXVzZSBhIHJlLXJlbmRlciwgb3RoZXJ3aXNlXG4gICAgLy8gdGhlIGlucHV0IGZpZWxkIHdpbGwgc3dpdGNoIGJhY2sgdG8gaXRzIHByZXZpb3VzIGNvbnRlbnRzIChlLmcuIHdoZW4gaG9sZGluZyBkb3duICdzaGlmdCcpXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUodXBkYXRlcylcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtrZXldID0gdXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkRW1pdHRlckxpc3RlbmVyIChldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKFtldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyXSlcbiAgICBldmVudEVtaXR0ZXIub24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpXG4gIH1cblxuICAvKlxuICAgKiBzZXR0ZXJzL3VwZGF0ZXJzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGRlc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gdHJ1ZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IDBcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb05vZGUgKG5vZGUpIHtcbiAgICB2YXIgcm93c0RhdGEgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgdmFyIGZvdW5kSW5kZXggPSBudWxsXG4gICAgdmFyIGluZGV4Q291bnRlciA9IDBcbiAgICByb3dzRGF0YS5mb3JFYWNoKChyb3dJbmZvLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNIZWFkaW5nKSB7XG4gICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICB9IGVsc2UgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gbnVsbCkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGZvdW5kSW5kZXggPSBpbmRleENvdW50ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGZvdW5kSW5kZXggIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAoZm91bmRJbmRleCAqIHRoaXMuc3RhdGUucm93SGVpZ2h0KSAtIHRoaXMuc3RhdGUucm93SGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERvbU5vZGVPZmZzZXRZIChkb21Ob2RlKSB7XG4gICAgdmFyIGN1cnRvcCA9IDBcbiAgICBpZiAoZG9tTm9kZS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3VydG9wICs9IGRvbU5vZGUub2Zmc2V0VG9wXG4gICAgICB9IHdoaWxlIChkb21Ob2RlID0gZG9tTm9kZS5vZmZzZXRQYXJlbnQpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG4gICAgcmV0dXJuIGN1cnRvcFxuICB9XG5cbiAgY29sbGFwc2VOb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgIHZpc2l0KG5vZGUsIChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICAgIGNoaWxkLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgfSlcbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGxldCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgZXhwYW5kTm9kZSAobm9kZSwgY29tcG9uZW50SWQpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICBpZiAobm9kZS5wYXJlbnQpIHRoaXMuZXhwYW5kTm9kZShub2RlLnBhcmVudCkgLy8gSWYgd2UgYXJlIGV4cGFuZGVkLCBvdXIgcGFyZW50IGhhcyB0byBiZSB0b29cbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlzUm93QWN0aXZhdGVkIChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGlzQ2x1c3RlckFjdGl2YXRlZCAoaXRlbSkge1xuICAgIHJldHVybiBmYWxzZSAvLyBUT0RPXG4gIH1cblxuICB0b2dnbGVUaW1lRGlzcGxheU1vZGUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ3NlY29uZHMnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVNjcnViYmVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydFxuICAgIHZhciBmcmFtZUJhc2VsaW5lID0gdGhpcy5zdGF0ZS5mcmFtZUJhc2VsaW5lXG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIHZhciBjdXJyZW50RnJhbWUgPSBmcmFtZUJhc2VsaW5lICsgZnJhbWVEZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaUIpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuZHVyYXRpb25EcmFnU3RhcnRcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgaWYgKGRyYWdEZWx0YSA+IDAgJiYgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLmFkZEludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIDIwfSlcbiAgICAgICAgfSwgMzAwKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthZGRJbnRlcnZhbDogYWRkSW50ZXJ2YWx9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ0lzQWRkaW5nOiB0cnVlfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgIC8vIERvbid0IGxldCB1c2VyIGRyYWcgYmFjayBwYXN0IGxhc3QgZnJhbWU7IGFuZCBkb24ndCBsZXQgdGhlbSBkcmFnIG1vcmUgdGhhbiBhbiBlbnRpcmUgd2lkdGggb2YgZnJhbWVzXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCICsgZnJhbWVEZWx0YSA8PSBmcmFtZUluZm8uZnJpTWF4IHx8IC1mcmFtZURlbHRhID49IGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgIGZyYW1lRGVsdGEgPSB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAvLyBUb2RvOiBtYWtlIG1vcmUgcHJlY2lzZSBzbyBpdCByZW1vdmVzIGFzIG1hbnkgZnJhbWVzIGFzXG4gICAgICByZXR1cm4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgY2FuIGluc3RlYWQgb2YgY29tcGxldGVseSBpZ25vcmluZyB0aGUgZHJhZ1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25UcmltOiBmcmFtZURlbHRhLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbCB9KVxuICB9XG5cbiAgY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UgKHhsLCB4ciwgZnJhbWVJbmZvKSB7XG4gICAgbGV0IGFic0wgPSBudWxsXG4gICAgbGV0IGFic1IgPSBudWxsXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgIGFic0wgPSB4bFxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNSID0geHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0KSB7XG4gICAgICBjb25zdCBvZmZzZXRMID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyU3RhcnQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3Qgb2Zmc2V0UiA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhckVuZCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBkaWZmWCA9IHhsIC0gdGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnRcbiAgICAgIGFic0wgPSBvZmZzZXRMICsgZGlmZlhcbiAgICAgIGFic1IgPSBvZmZzZXRSICsgZGlmZlhcbiAgICB9XG5cbiAgICBsZXQgZkwgPSAoYWJzTCAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNMICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIGxldCBmUiA9IChhYnNSICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic1IgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgbGVmdCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZMIDw9IGZyYW1lSW5mby5mcmkwKSB7XG4gICAgICBmTCA9IGZyYW1lSW5mby5mcmkwXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLSBmTClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgcmlnaHQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmUiA+PSBmcmFtZUluZm8uZnJpTWF4Mikge1xuICAgICAgZkwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2ZMLCBmUl0gfSlcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIChkZWx0YSkge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSArIGRlbHRhXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdICsgZGVsdGFcbiAgICBpZiAobCA+PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtsLCByXSB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIHdpbGwgbGVmdC1hbGlnbiB0aGUgY3VycmVudCB0aW1lbGluZSB3aW5kb3cgKG1haW50YWluaW5nIHpvb20pXG4gIHRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG4gICAgdmFyIHNwYW4gPSByIC0gbFxuICAgIHZhciBuZXdMID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWVcbiAgICB2YXIgbmV3UiA9IG5ld0wgKyBzcGFuXG5cbiAgICBpZiAobmV3UiA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgIG5ld0wgLT0gKG5ld1IgLSBmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgbmV3UiA9IGZyYW1lSW5mby5mcmlNYXhcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtuZXdMLCBuZXdSXSB9KVxuICB9XG5cbiAgdXBkYXRlU2NydWJiZXJQb3NpdGlvbiAoZGVsdGEpIHtcbiAgICB2YXIgY3VycmVudEZyYW1lID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKyBkZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPD0gMCkgY3VycmVudEZyYW1lID0gMFxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUpIHtcbiAgICAvLyBOb3RlIHRoYXQgaWYgc3RhcnRWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSBwcmV2aW91cyB2YWx1ZSB3aWxsIGJlIGV4YW1pbmVkIHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIHByZXNlbnQgb25lXG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUsIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnaG9zdEluc3RhbmNlJyksIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnc3RhdGVzJykpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBObyBuZWVkIHRvICdleHByZXNzaW9uVG9STycgaGVyZSBiZWNhdXNlIGlmIHdlIGdvdCBhbiBleHByZXNzaW9uLCB0aGF0IHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHByb3ZpZGVkIGluIGl0cyBzZXJpYWxpemVkIF9fZnVuY3Rpb24gZm9ybVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlXSwgKCkgPT4ge30pXG5cbiAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzdmcnICYmIHByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknKSB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50IChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnNwbGl0U2VnbWVudCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc3BsaXRTZWdtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuam9pbktleWZyYW1lcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEN1cnZlKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRFbmRwb2ludHMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIChvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5yZW5hbWVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3JlbmFtZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm90ZTogV2UgbWF5IG5lZWQgdG8gcmVtZW1iZXIgdG8gc2VyaWFsaXplIGEgdGltZWxpbmUgZGVzY3JpcHRvciBoZXJlXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmR1cGxpY2F0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2R1cGxpY2F0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykge1xuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgbGV0IGtleWZyYW1lTW92ZXMgPSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcywgZnJhbWVJbmZvKVxuICAgIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICB9KVxuXG4gICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgIC8vIHNvIHRoZSB2YWx1ZXMgYXJlIGFjY3VtdWxhdGVkIGFuZCBzZW50IHZpYSBhIHNpbmdsZSBiYXRjaGVkIHVwZGF0ZS5cbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgdGhpcy5fa2V5ZnJhbWVNb3ZlcyA9IHt9XG4gICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldID0geyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9XG4gICAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbigpXG4gICAgfVxuICB9XG5cbiAgZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHJldHVybiB2b2lkICgwKVxuICAgIGZvciAobGV0IG1vdmVtZW50S2V5IGluIHRoaXMuX2tleWZyYW1lTW92ZXMpIHtcbiAgICAgIGlmICghbW92ZW1lbnRLZXkpIGNvbnRpbnVlXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldKSBjb250aW51ZVxuICAgICAgbGV0IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfSA9IHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgZnVuY3Rpb25zIGdldCBjb252ZXJ0ZWQgaW50byB0aGVpciBzZXJpYWwgZm9ybSBiZWZvcmUgcGFzc2luZyBvdmVyIHRoZSB3aXJlXG4gICAgICBsZXQga2V5ZnJhbWVNb3Zlc0ZvcldpcmUgPSBleHByZXNzaW9uVG9STyhrZXlmcmFtZU1vdmVzKVxuXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ21vdmVLZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzRm9yV2lyZSwgZnJhbWVJbmZvXSwgKCkgPT4ge30pXG4gICAgICBkZWxldGUgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cbiAgICB9XG4gIH1cblxuICBwbGF5YmFja1NraXBCYWNrICgpIHtcbiAgICAvKiB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKSAqL1xuICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gIH1cblxuICBwbGF5YmFja1NraXBGb3J3YXJkICgpIHtcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmlNYXggfSlcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gIH1cblxuICB0b2dnbGVQbGF5YmFjayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID49IHRoaXMuZ2V0RnJhbWVJbmZvKCkuZnJpTWF4KSB7XG4gICAgICB0aGlzLnBsYXliYWNrU2tpcEJhY2soKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiB0cnVlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wbGF5KClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVoeWRyYXRlQnl0ZWNvZGUgKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKSB7XG4gICAgaWYgKHJlaWZpZWRCeXRlY29kZSkge1xuICAgICAgaWYgKHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgICBpZiAoIWlkKSByZXR1cm4gdm9pZCAoMClcbiAgICAgICAgICBub2RlLl9faXNTZWxlY3RlZCA9ICEhdGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0V4cGFuZGVkID0gISF0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzSGlkZGVuID0gISF0aGlzLnN0YXRlLmhpZGRlbk5vZGVzW2lkXVxuICAgICAgICB9KVxuICAgICAgICByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgbGV0IGZvdW5kID0gW11cbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCkgPT4ge1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShub2RlKVxuICAgICAgICB0aGlzLmV4cGFuZE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5zY3JvbGxUb05vZGUobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uVW5zZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBsZXQgZm91bmQgPSB0aGlzLmZpbmROb2Rlc0J5Q29tcG9uZW50SWQoY29tcG9uZW50SWQpXG4gICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgdGhpcy5kZXNlbGVjdE5vZGUobm9kZSlcbiAgICAgIHRoaXMuY29sbGFwc2VOb2RlKG5vZGUpXG4gICAgICB0aGlzLnNjcm9sbFRvVG9wKG5vZGUpXG4gICAgfSlcbiAgfVxuXG4gIGZpbmROb2Rlc0J5Q29tcG9uZW50SWQgKGNvbXBvbmVudElkKSB7XG4gICAgdmFyIGZvdW5kID0gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIG1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHN0YXJ0TXMsIHByb3BlcnR5TmFtZXMpIHtcbiAgICBsZXQgcmVsYXRlZEVsZW1lbnQgPSB0aGlzLmZpbmRFbGVtZW50SW5UZW1wbGF0ZShjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgbGV0IGVsZW1lbnROYW1lID0gcmVsYXRlZEVsZW1lbnQgJiYgcmVsYXRlZEVsZW1lbnQuZWxlbWVudE5hbWVcbiAgICBpZiAoIWVsZW1lbnROYW1lKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDb21wb25lbnQgJyArIGNvbXBvbmVudElkICsgJyBtaXNzaW5nIGVsZW1lbnQsIGFuZCB3aXRob3V0IGFuIGVsZW1lbnQgbmFtZSBJIGNhbm5vdCB1cGRhdGUgYSBwcm9wZXJ0eSB2YWx1ZScpXG4gICAgfVxuXG4gICAgdmFyIGFsbFJvd3MgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgYWxsUm93cy5mb3JFYWNoKChyb3dJbmZvKSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc1Byb3BlcnR5ICYmIHJvd0luZm8uY29tcG9uZW50SWQgPT09IGNvbXBvbmVudElkICYmIHByb3BlcnR5TmFtZXMuaW5kZXhPZihyb3dJbmZvLnByb3BlcnR5Lm5hbWUpICE9PSAtMSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgYWN0aXZhdGVkUm93czogbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93cyksXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICAqIGl0ZXJhdG9ycy92aXNpdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBmaW5kRWxlbWVudEluVGVtcGxhdGUgKGNvbXBvbmVudElkLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiB2b2lkICgwKVxuICAgIGxldCBmb3VuZFxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZCA9IG5vZGVcbiAgICB9KVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSAobG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZSwgcGFyZW50LCBpdGVyYXRlZSkge1xuICAgIGl0ZXJhdGVlKHRlbXBsYXRlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgaWYgKHRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRlbXBsYXRlLmNoaWxkcmVuW2ldXG4gICAgICAgIGlmICghY2hpbGQgfHwgdHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykgY29udGludWVcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKGxvY2F0b3IgKyAnLicgKyBpLCBpLCB0ZW1wbGF0ZS5jaGlsZHJlbiwgY2hpbGQsIHRlbXBsYXRlLCBpdGVyYXRlZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtYXBWaXNpYmxlRnJhbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgcmlnaHRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgY29uc3QgZnJhbWVNb2R1bHVzID0gZ2V0RnJhbWVNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGxldCBpdGVyYXRpb25JbmRleCA9IC0xXG4gICAgZm9yIChsZXQgaSA9IGxlZnRGcmFtZTsgaSA8IHJpZ2h0RnJhbWU7IGkrKykge1xuICAgICAgaXRlcmF0aW9uSW5kZXgrK1xuICAgICAgbGV0IGZyYW1lTnVtYmVyID0gaVxuICAgICAgbGV0IHBpeGVsT2Zmc2V0TGVmdCA9IGl0ZXJhdGlvbkluZGV4ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGlmIChwaXhlbE9mZnNldExlZnQgPD0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkge1xuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgZnJhbWVJbmZvLnB4cGYsIGZyYW1lTW9kdWx1cylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkge1xuICAgICAgICAgIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICBtYXBWaXNpYmxlVGltZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbXNNb2R1bHVzID0gZ2V0TWlsbGlzZWNvbmRNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgbGVmdE1zID0gZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHJpZ2h0TXMgPSBmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgdG90YWxNcyA9IHJpZ2h0TXMgLSBsZWZ0TXNcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IHJvdW5kVXAobGVmdE1zLCBtc01vZHVsdXMpXG4gICAgbGV0IG1zTWFya2VyVG1wID0gZmlyc3RNYXJrZXJcbiAgICBjb25zdCBtc01hcmtlcnMgPSBbXVxuICAgIHdoaWxlIChtc01hcmtlclRtcCA8PSByaWdodE1zKSB7XG4gICAgICBtc01hcmtlcnMucHVzaChtc01hcmtlclRtcClcbiAgICAgIG1zTWFya2VyVG1wICs9IG1zTW9kdWx1c1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zTWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zTWFya2VyID0gbXNNYXJrZXJzW2ldXG4gICAgICBsZXQgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc01hcmtlciwgZnJhbWVJbmZvLm1zcGYpXG4gICAgICBsZXQgbXNSZW1haW5kZXIgPSBNYXRoLmZsb29yKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmIC0gbXNNYXJrZXIpXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgdGhlIG1zUmVtYWluZGVyIGNhc2UgcmF0aGVyIHRoYW4gaWdub3JpbmcgaXRcbiAgICAgIGlmICghbXNSZW1haW5kZXIpIHtcbiAgICAgICAgbGV0IGZyYW1lT2Zmc2V0ID0gbmVhcmVzdEZyYW1lIC0gbGVmdEZyYW1lXG4gICAgICAgIGxldCBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKG1zTWFya2VyLCBweE9mZnNldCwgdG90YWxNcylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICAvKlxuICAgKiBnZXR0ZXJzL2NhbGN1bGF0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8qKlxuICAgIC8vIFNvcnJ5OiBUaGVzZSBzaG91bGQgaGF2ZSBiZWVuIGdpdmVuIGh1bWFuLXJlYWRhYmxlIG5hbWVzXG4gICAgPEdBVUdFPlxuICAgICAgICAgICAgPC0tLS1mcmlXLS0tPlxuICAgIGZyaTAgICAgZnJpQSAgICAgICAgZnJpQiAgICAgICAgZnJpTWF4ICAgICAgICAgICAgICAgICAgICAgICAgICBmcmlNYXgyXG4gICAgfCAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfFxuICAgICAgICAgICAgPC0tLS0tLS0tLS0tPiA8PCB0aW1lbGluZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgICB8XG4gICAgPC0tLS0tLS0+ICAgICAgICAgICB8IDw8IHByb3BlcnRpZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgIHB4QSAgICAgICAgIHB4QiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4ICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXgyXG4gICAgPFNDUk9MTEJBUj5cbiAgICB8LS0tLS0tLS0tLS0tLS0tLS0tLXwgPDwgc2Nyb2xsZXIgdmlld3BvcnRcbiAgICAgICAgKj09PT0qICAgICAgICAgICAgPDwgc2Nyb2xsYmFyXG4gICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gICAgfHNjMCAgICAgICAgICAgICAgICB8c2NMICYmIHNjUmF0aW9cbiAgICAgICAgfHNjQVxuICAgICAgICAgICAgIHxzY0JcbiAgKi9cbiAgZ2V0RnJhbWVJbmZvICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB7fVxuICAgIGZyYW1lSW5mby5mcHMgPSB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvLyBOdW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICBmcmFtZUluZm8ubXNwZiA9IDEwMDAgLyBmcmFtZUluZm8uZnBzIC8vIE1pbGxpc2Vjb25kcyBwZXIgZnJhbWVcbiAgICBmcmFtZUluZm8ubWF4bXMgPSBnZXRNYXhpbXVtTXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSlcbiAgICBmcmFtZUluZm8ubWF4ZiA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoZnJhbWVJbmZvLm1heG1zLCBmcmFtZUluZm8ubXNwZikgLy8gTWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmkwID0gMCAvLyBUaGUgbG93ZXN0IHBvc3NpYmxlIGZyYW1lIChhbHdheXMgMClcbiAgICBmcmFtZUluZm8uZnJpQSA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIDwgZnJhbWVJbmZvLmZyaTApID8gZnJhbWVJbmZvLmZyaTAgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC8vIFRoZSBsZWZ0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlNYXggPSAoZnJhbWVJbmZvLm1heGYgPCA2MCkgPyA2MCA6IGZyYW1lSW5mby5tYXhmIC8vIFRoZSBtYXhpbXVtIGZyYW1lIGFzIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaU1heDIgPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXggKiAxLjg4ICAvLyBFeHRlbmQgdGhlIG1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmUgKGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUga2V5ZnJhbWVzIGJleW9uZCB0aGUgcHJldmlvdXNseSBkZWZpbmVkIG1heClcbiAgICBmcmFtZUluZm8uZnJpQiA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdID4gZnJhbWVJbmZvLmZyaU1heDIpID8gZnJhbWVJbmZvLmZyaU1heDIgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC8vIFRoZSByaWdodG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpVyA9IE1hdGguYWJzKGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIC8vIFRoZSB3aWR0aCBvZiB0aGUgdmlzaWJsZSByYW5nZSBpbiBmcmFtZXNcbiAgICBmcmFtZUluZm8ucHhwZiA9IE1hdGguZmxvb3IodGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvIGZyYW1lSW5mby5mcmlXKSAvLyBOdW1iZXIgb2YgcGl4ZWxzIHBlciBmcmFtZSAocm91bmRlZClcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPCAxKSBmcmFtZUluZm8ucFNjcnhwZiA9IDFcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSBmcmFtZUluZm8ucHhwZiA9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGhcbiAgICBmcmFtZUluZm8ucHhBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weEIgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4TWF4MiA9IGZyYW1lSW5mby5mcmlNYXgyICogZnJhbWVJbmZvLnB4cGYgLy8gVGhlIHdpZHRoIGluIHBpeGVscyB0aGF0IHRoZSBlbnRpcmUgdGltZWxpbmUgKFwiZnJpTWF4MlwiKSBwYWRkaW5nIHdvdWxkIGVxdWFsXG4gICAgZnJhbWVJbmZvLm1zQSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIGxlZnRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLm1zQiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIHJpZ2h0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5zY0wgPSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLy8gVGhlIGxlbmd0aCBpbiBwaXhlbHMgb2YgdGhlIHNjcm9sbGVyIHZpZXdcbiAgICBmcmFtZUluZm8uc2NSYXRpbyA9IGZyYW1lSW5mby5weE1heDIgLyBmcmFtZUluZm8uc2NMIC8vIFRoZSByYXRpbyBvZiB0aGUgc2Nyb2xsZXIgdmlldyB0byB0aGUgdGltZWxpbmUgdmlldyAoc28gdGhlIHNjcm9sbGVyIHJlbmRlcnMgcHJvcG9ydGlvbmFsbHkgdG8gdGhlIHRpbWVsaW5lIGJlaW5nIGVkaXRlZClcbiAgICBmcmFtZUluZm8uc2NBID0gKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSBsZWZ0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIGZyYW1lSW5mby5zY0IgPSAoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIHJpZ2h0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIHJldHVybiBmcmFtZUluZm9cbiAgfVxuXG4gIC8vIFRPRE86IEZpeCB0aGlzL3RoZXNlIG1pc25vbWVyKHMpLiBJdCdzIG5vdCAnQVNDSUknXG4gIGdldEFzY2lpVHJlZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBsZXQgYXJjaHlGb3JtYXQgPSB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKVxuICAgICAgbGV0IGFyY2h5U3RyID0gYXJjaHkoYXJjaHlGb3JtYXQpXG4gICAgICByZXR1cm4gYXJjaHlTdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgZ2V0QXJjaHlGb3JtYXROb2RlcyAobGFiZWwsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsLFxuICAgICAgbm9kZXM6IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgY2hpbGQuY2hpbGRyZW4pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudFJvd3NEYXRhICgpIHtcbiAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzICoqbXVzdCoqIGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBjb21wb25lbnQgaGVhZGluZ3MvcHJvcGVydHkgcm93c1xuICAgIGxldCBhc2NpaVN5bWJvbHMgPSB0aGlzLmdldEFzY2lpVHJlZSgpLnNwbGl0KCdcXG4nKVxuICAgIGxldCBjb21wb25lbnRSb3dzID0gW11cbiAgICBsZXQgYWRkcmVzc2FibGVBcnJheXNDYWNoZSA9IHt9XG4gICAgbGV0IHZpc2l0b3JJdGVyYXRpb25zID0gMFxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSB8fCAhdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiBjb21wb25lbnRSb3dzXG5cbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncykgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudXBzZXJ0RnJvbU5vZGVXaXRoQ29tcG9uZW50Q2FjaGVkKG5vZGUsIHBhcmVudCwgdGhpcy5fY29tcG9uZW50LCB7fSlcblxuICAgICAgY29uc3QgaXNDb21wb25lbnQgPSBlbGVtZW50LmlzQ29tcG9uZW50KClcbiAgICAgIGNvbnN0IGVsZW1lbnROYW1lID0gZWxlbWVudC5nZXROYW1lU3RyaW5nKClcbiAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gZWxlbWVudC5nZXRDb21wb25lbnRJZCgpXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmICh0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLkFMTE9XRURfVEFHTkFNRVNbZWxlbWVudE5hbWVdIHx8IGlzQ29tcG9uZW50KSkpIHsgLy8gT25seSB0aGUgdG9wLWxldmVsIGFuZCBhbnkgZXhwYW5kZWQgc3ViY29tcG9uZW50c1xuICAgICAgICBjb25zdCBhc2NpaUJyYW5jaCA9IGFzY2lpU3ltYm9sc1t2aXNpdG9ySXRlcmF0aW9uc10gLy8gV2FybmluZzogVGhlIGNvbXBvbmVudCBzdHJ1Y3R1cmUgbXVzdCBtYXRjaCB0aGF0IGdpdmVuIHRvIGNyZWF0ZSB0aGUgYXNjaWkgdHJlZVxuICAgICAgICBjb25zdCBoZWFkaW5nUm93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2gsIHByb3BlcnR5Um93czogW10sIGlzSGVhZGluZzogdHJ1ZSwgY29tcG9uZW50SWQ6IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXSB9XG4gICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChoZWFkaW5nUm93KVxuXG4gICAgICAgIGlmICghYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICBjb25zdCBkb0dvRGVlcCA9IGxvY2F0b3IubGVuZ3RoID09PSAzIC8vIDAuMCwgMC4xLCBldGNcbiAgICAgICAgICBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSA9IE9iamVjdC52YWx1ZXMoZWxlbWVudC5nZXRBZGRyZXNzYWJsZVByb3BlcnRpZXMoZG9Hb0RlZXApKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY2x1c3RlckhlYWRpbmdzRm91bmQgPSB7fVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlHcm91cERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtpXVxuXG4gICAgICAgICAgbGV0IHByb3BlcnR5Um93XG5cbiAgICAgICAgICAgIC8vIFNvbWUgcHJvcGVydGllcyBnZXQgZ3JvdXBlZCBpbnNpZGUgdGhlaXIgb3duIGFjY29yZGlvbiBzaW5jZSB0aGV5IGhhdmUgbXVsdGlwbGUgc3ViY29tcG9uZW50cywgZS5nLiB0cmFuc2xhdGlvbi54LHkselxuICAgICAgICAgIGlmIChwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyKSB7XG4gICAgICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4XG4gICAgICAgICAgICBsZXQgY2x1c3RlcktleSA9IGAke2NvbXBvbmVudElkfV8ke2NsdXN0ZXJQcmVmaXh9YFxuICAgICAgICAgICAgbGV0IGlzQ2x1c3RlckhlYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjbHVzdGVyIHdpdGggdGhlIGN1cnJlbnQga2V5IGlzIGV4cGFuZGVkIHJlbmRlciBlYWNoIG9mIHRoZSByb3dzIGluZGl2aWR1YWxseVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2NsdXN0ZXJLZXldKSB7XG4gICAgICAgICAgICAgIGlmICghY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0pIHtcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICAgIHNpYmxpbmdzLFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICAgICAgY2x1c3RlcktleSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJNZW1iZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyxcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsXG4gICAgICAgICAgICAgICAgaXNQcm9wZXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgY2x1c3RlcjogY2x1c3RlclNldCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyTmFtZTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5uYW1lLFxuICAgICAgICAgICAgICAgIGlzQ2x1c3RlcjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLFxuICAgICAgICAgICAgICBpc1Byb3BlcnR5OiB0cnVlLFxuICAgICAgICAgICAgICBjb21wb25lbnRJZFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wbGF5YmFja1NraXBCYWNrKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMucGxheWJhY2tTa2lwRm9yd2FyZCgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgYWN0aXZlS2V5ZnJhbWVzOiBbXSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgaXNBY3RpdmUgPSB0cnVlXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWB9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgdG9wOiAtMyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICA6IChpc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgIH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYW5zaXRpb25Cb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG4gICAgY29uc3QgY3VydmUgPSBjdXJyLmN1cnZlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3Vyci5jdXJ2ZS5zbGljZSgxKVxuICAgIGNvbnN0IGJyZWFraW5nQm91bmRzID0gY3VydmUuaW5jbHVkZXMoJ0JhY2snKSB8fCBjdXJ2ZS5pbmNsdWRlcygnQm91bmNlJykgfHwgY3VydmUuaW5jbHVkZXMoJ0VsYXN0aWMnKVxuICAgIGNvbnN0IEN1cnZlU1ZHID0gQ1VSVkVTVkdTW2N1cnZlICsgJ1NWRyddXG4gICAgbGV0IGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGxldCBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSkpIHNlY29uZEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LCBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiB0cnVlLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbnRhaW5lcidcbiAgICAgICAgICBrZXk9e3VuaXF1ZUtleX1cbiAgICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtdHJhbnNpdGlvbicsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIGN1cnZlOiBjdXJyLmN1cnZlLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSBQYWxldHRlLkdSQVlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7b3B0aW9ucy5jb2xsYXBzZWQgJiZcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb2xsYXBzZWQtYmFja2Ryb3AnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkdSQVlcbiAgICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDEsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MylcbiAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45NjUpXG4gICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDIsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgb3ZlcmZsb3c6IGJyZWFraW5nQm91bmRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJ2ZVNWR1xuICAgICAgICAgICAgICBpZD17dW5pcXVlS2V5fVxuICAgICAgICAgICAgICBsZWZ0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgICByaWdodEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbnN0YW50Qm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgLy8gY29uc3QgYWN0aXZlSW5mbyA9IHNldEFjdGl2ZUNvbnRlbnRzKHByb3BlcnR5TmFtZSwgY3VyciwgbmV4dCwgZmFsc2UsIHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgfX1cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb25zdGFudC1ib2R5J1xuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS1zZWdtZW50JyxcbiAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAxNDUsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtMiwgbGVmdDogLTMgfX0+PFJpZ2h0Q2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMyxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=