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
            lineNumber: 1419
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
            lineNumber: 1424
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
            lineNumber: 1492
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
            lineNumber: 1515
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
            lineNumber: 1543
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
            lineNumber: 1591
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
              lineNumber: 1603
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1611
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
            lineNumber: 1637
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
              lineNumber: 1665
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
              lineNumber: 1716
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
              lineNumber: 1732
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
                lineNumber: 1749
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
                  lineNumber: 1759
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1767
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
                lineNumber: 1777
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1786
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
                lineNumber: 1804
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
                  lineNumber: 1815
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1825
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
            lineNumber: 1845
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
            lineNumber: 1884
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
              lineNumber: 1927
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
                  lineNumber: 1943
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1944
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
                millisecondsNumber,
                'ms'
              )
            );
          } else {
            return _react2.default.createElement(
              'span',
              { key: 'time-' + millisecondsNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1959
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1960
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
            lineNumber: 1971
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1973
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
            lineNumber: 1986
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2005
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
                lineNumber: 2006
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
                lineNumber: 2019
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
                lineNumber: 2029
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
              lineNumber: 2041
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
              lineNumber: 2064
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2083
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
                lineNumber: 2084
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
                lineNumber: 2097
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2111
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
            lineNumber: 2118
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
              lineNumber: 2131
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
                lineNumber: 2140
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2152
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2154
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
                    lineNumber: 2155
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
                lineNumber: 2159
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
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
                    lineNumber: 2176
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
                    lineNumber: 2177
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
                  lineNumber: 2180
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
                lineNumber: 2182
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2199
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2200
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2201
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2203
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
                  lineNumber: 2205
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2206
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2207
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2208
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
              lineNumber: 2215
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
            lineNumber: 2252
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
              lineNumber: 2262
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
                lineNumber: 2286
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
                  lineNumber: 2296
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2301
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
                  lineNumber: 2303
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2308
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
              lineNumber: 2312
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
              lineNumber: 2313
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
            lineNumber: 2328
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
            lineNumber: 2355
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2358
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
              lineNumber: 2359
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2370
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2371
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
              lineNumber: 2373
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
            lineNumber: 2388
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
            lineNumber: 2415
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
              lineNumber: 2423
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2431
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
                  lineNumber: 2432
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2437
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2437
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2438
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2438
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
              lineNumber: 2444
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
            lineNumber: 2459
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
              lineNumber: 2469
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
                lineNumber: 2481
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2491
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2491
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
              lineNumber: 2496
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
                lineNumber: 2505
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
                  lineNumber: 2518
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
              lineNumber: 2532
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
              lineNumber: 2541
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
              lineNumber: 2556
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
            lineNumber: 2607
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2638
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
              lineNumber: 2640
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
                lineNumber: 2649
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2656
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2656
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
                lineNumber: 2658
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
                  lineNumber: 2671
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
              lineNumber: 2680
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
              lineNumber: 2689
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
              lineNumber: 2703
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
          lineNumber: 2734
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
            lineNumber: 2737
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
            lineNumber: 2759
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
            lineNumber: 2775
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
              lineNumber: 2786
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
            lineNumber: 2803
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiYWRkRXZlbnRMaXN0ZW5lciIsImRpZE1vdW50IiwiT2JqZWN0Iiwia2V5cyIsInVwZGF0ZXMiLCJrZXkiLCJjaGFuZ2VzIiwiY2JzIiwiY2FsbGJhY2tzIiwic3BsaWNlIiwic2V0U3RhdGUiLCJjbGVhckNoYW5nZXMiLCJmb3JFYWNoIiwiY2IiLCJwdXNoIiwiZmx1c2hVcGRhdGVzIiwiazEiLCJrMiIsImNvbXBvbmVudElkIiwicHJvcGVydHlOYW1lIiwiX3Jvd0NhY2hlQWN0aXZhdGlvbiIsInR1cGxlIiwicmVtb3ZlTGlzdGVuZXIiLCJ0b3VyQ2xpZW50Iiwib2ZmIiwiX2Vudm95Q2xpZW50IiwiY2xvc2VDb25uZWN0aW9uIiwiZG9jdW1lbnQiLCJib2R5IiwiY2xpZW50V2lkdGgiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJfZWxlbWVudHMiLCJ1cHNlcnRGcm9tTm9kZVdpdGhDb21wb25lbnRDYWNoZWQiLCJpc0NvbXBvbmVudCIsImdldE5hbWVTdHJpbmciLCJnZXRDb21wb25lbnRJZCIsIkFMTE9XRURfVEFHTkFNRVMiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJkb0dvRGVlcCIsInZhbHVlcyIsImdldEFkZHJlc3NhYmxlUHJvcGVydGllcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiayIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5IiwicGFyc2VJbnQiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwibXMiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBS0E7O0FBTUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7O0FBa0NBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7OztBQVVBLElBQUlBLFdBQVdDLFFBQVEsVUFBUixDQUFmO0FBQ0EsSUFBSUMsV0FBV0YsU0FBU0UsUUFBeEI7QUFDQSxJQUFJQSxRQUFKLEVBQWM7QUFDWixNQUFJQSxTQUFTQyxrQkFBYixFQUFpQ0QsU0FBU0Msa0JBQVQsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0I7QUFDakMsTUFBSUQsU0FBU0Usd0JBQWIsRUFBdUNGLFNBQVNFLHdCQUFULENBQWtDLENBQWxDLEVBQXFDLENBQXJDO0FBQ3hDOztBQUVELElBQU1DLFdBQVc7QUFDZkMsbUJBQWlCLEdBREY7QUFFZkMsa0JBQWdCLEdBRkQ7QUFHZkMsYUFBVyxFQUhJO0FBSWZDLGtCQUFnQixFQUpEO0FBS2ZDLGVBQWEsRUFMRTtBQU1mQyxrQkFBZ0IsRUFORDtBQU9mQyxxQkFBbUIsQ0FBQyxDQUFELEVBQUksRUFBSixDQVBKO0FBUWZDLGdCQUFjLENBUkM7QUFTZkMsWUFBVSxJQVRLO0FBVWZDLGdCQUFjLENBVkM7QUFXZkMsbUJBQWlCLEVBWEY7QUFZZkMsbUJBQWlCLFFBWkYsRUFZWTtBQUMzQkMsdUJBQXFCLFNBYk47QUFjZkMsbUJBQWlCLEtBZEY7QUFlZkMsdUJBQXFCLEdBZk47QUFnQmZDLGtCQUFnQixLQWhCRDtBQWlCZkMsb0JBQWtCLEtBakJIO0FBa0JmQyxvQkFBa0IsS0FsQkg7QUFtQmZDLGdCQUFjLEtBbkJDO0FBb0JmQyw4QkFBNEIsS0FwQmI7QUFxQmZDLHdCQUFzQixLQXJCUDtBQXNCZkMsaUJBQWUsRUF0QkE7QUF1QmZDLGlCQUFlLEVBdkJBO0FBd0JmQyxpQkFBZSxFQXhCQTtBQXlCZkMsZUFBYSxFQXpCRTtBQTBCZkMsaUJBQWUsSUExQkE7QUEyQmZDLGdCQUFjLElBM0JDO0FBNEJmQyw0QkFBMEIsRUE1Qlg7QUE2QmZDLG1CQUFpQixFQTdCRjtBQThCZkMsbUJBQWlCLElBOUJGO0FBK0JmQyxzQkFBb0I7QUEvQkwsQ0FBakI7O0FBa0NBLElBQU1DLFlBQVk7QUFDaEJDLHlDQURnQjtBQUVoQkMsNkNBRmdCO0FBR2hCQyx5Q0FIZ0I7QUFJaEJDLDJDQUpnQjtBQUtoQkMsK0NBTGdCO0FBTWhCQyx5Q0FOZ0I7QUFPaEJDLHlDQVBnQjtBQVFoQkMsMkNBUmdCO0FBU2hCQywyQ0FUZ0I7QUFVaEJDLHlDQVZnQjtBQVdoQkMsK0NBWGdCO0FBWWhCQyxtREFaZ0I7QUFhaEJDLCtDQWJnQjtBQWNoQkMsaURBZGdCO0FBZWhCQyxxREFmZ0I7QUFnQmhCQywrQ0FoQmdCO0FBaUJoQkMsK0NBakJnQjtBQWtCaEJDLGlEQWxCZ0I7QUFtQmhCQyxpREFuQmdCO0FBb0JoQkMsK0NBcEJnQjtBQXFCaEJDLDJDQXJCZ0I7QUFzQmhCQywrQ0F0QmdCO0FBdUJoQkMsMkNBdkJnQjtBQXdCaEJDLDZDQXhCZ0I7QUF5QmhCQyxpREF6QmdCO0FBMEJoQkMsMkNBMUJnQjtBQTJCaEJDLDJDQTNCZ0I7QUE0QmhCQyw2Q0E1QmdCO0FBNkJoQkMsNkNBN0JnQjtBQThCaEJDLDJDQTlCZ0I7QUErQmhCQztBQS9CZ0IsQ0FBbEI7O0FBa0NBLElBQU1DLGdCQUFnQixFQUF0QixDLENBQXlCOztBQUV6QixTQUFTQyxLQUFULENBQWdCQyxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7QUFDN0IsTUFBSUQsS0FBS0UsUUFBVCxFQUFtQjtBQUNqQixTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsS0FBS0UsUUFBTCxDQUFjRSxNQUFsQyxFQUEwQ0QsR0FBMUMsRUFBK0M7QUFDN0MsVUFBSUUsUUFBUUwsS0FBS0UsUUFBTCxDQUFjQyxDQUFkLENBQVo7QUFDQSxVQUFJRSxTQUFTLE9BQU9BLEtBQVAsS0FBaUIsUUFBOUIsRUFBd0M7QUFDdENKLGdCQUFRSSxLQUFSO0FBQ0FOLGNBQU1NLEtBQU4sRUFBYUosT0FBYjtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztJQUVLSyxROzs7QUFDSixvQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLG9IQUNaQSxLQURZOztBQUdsQixVQUFLQyxLQUFMLEdBQWEsaUJBQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCM0UsUUFBbEIsQ0FBYjtBQUNBLFVBQUs0RSxPQUFMLEdBQWUsMEJBQWdCQyxNQUFoQixRQUFmOztBQUVBLFVBQUtDLFFBQUwsR0FBZ0IsRUFBaEIsQ0FOa0IsQ0FNQzs7QUFFbkIsVUFBS0MsVUFBTCxHQUFrQiw4QkFBb0I7QUFDcENDLGFBQU8sVUFENkI7QUFFcENDLGNBQVEsTUFBS1IsS0FBTCxDQUFXUSxNQUZpQjtBQUdwQ0Msa0JBQVksTUFBS1QsS0FBTCxDQUFXUyxVQUhhO0FBSXBDQyxpQkFBVyxNQUFLVixLQUFMLENBQVdVLFNBSmM7QUFLcENDLGdCQUFVUCxNQUwwQjtBQU1wQ1EsYUFBTyxNQUFLWixLQUFMLENBQVdZLEtBTmtCO0FBT3BDQyxpQkFBV1QsT0FBT1M7QUFQa0IsS0FBcEIsQ0FBbEI7O0FBVUE7QUFDQTtBQUNBLFVBQUtDLDJCQUFMLEdBQW1DLGlCQUFPQyxRQUFQLENBQWdCLE1BQUtELDJCQUFMLENBQWlDRSxJQUFqQyxPQUFoQixFQUE2RCxHQUE3RCxDQUFuQztBQUNBLFVBQUtDLFdBQUwsR0FBbUIsTUFBS0EsV0FBTCxDQUFpQkQsSUFBakIsT0FBbkI7QUFDQSxVQUFLRSwrQkFBTCxHQUF1QyxNQUFLQSwrQkFBTCxDQUFxQ0YsSUFBckMsT0FBdkM7QUFDQVosV0FBT2UsUUFBUDs7QUFFQWYsV0FBT2dCLGdCQUFQLENBQXdCLFVBQXhCLGtDQUF3RCxLQUF4RDtBQUNBaEIsV0FBT2dCLGdCQUFQLENBQXdCLE1BQXhCLEVBQWdDLHFDQUF5QkosSUFBekIsT0FBaEMsRUFBcUUsS0FBckU7QUExQmtCO0FBMkJuQjs7OzttQ0FFZTtBQUFBOztBQUNkLFVBQUksQ0FBQyxLQUFLZixLQUFMLENBQVdvQixRQUFoQixFQUEwQjtBQUN4QixlQUFPLEtBQU0sQ0FBYjtBQUNEO0FBQ0QsVUFBSUMsT0FBT0MsSUFBUCxDQUFZLEtBQUtDLE9BQWpCLEVBQTBCM0IsTUFBMUIsR0FBbUMsQ0FBdkMsRUFBMEM7QUFDeEMsZUFBTyxLQUFNLENBQWI7QUFDRDtBQUNELFdBQUssSUFBTTRCLEdBQVgsSUFBa0IsS0FBS0QsT0FBdkIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLdkIsS0FBTCxDQUFXd0IsR0FBWCxNQUFvQixLQUFLRCxPQUFMLENBQWFDLEdBQWIsQ0FBeEIsRUFBMkM7QUFDekMsZUFBS0MsT0FBTCxDQUFhRCxHQUFiLElBQW9CLEtBQUtELE9BQUwsQ0FBYUMsR0FBYixDQUFwQjtBQUNEO0FBQ0Y7QUFDRCxVQUFJRSxNQUFNLEtBQUtDLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixDQUF0QixDQUFWO0FBQ0EsV0FBS0MsUUFBTCxDQUFjLEtBQUtOLE9BQW5CLEVBQTRCLFlBQU07QUFDaEMsZUFBS08sWUFBTDtBQUNBSixZQUFJSyxPQUFKLENBQVksVUFBQ0MsRUFBRDtBQUFBLGlCQUFRQSxJQUFSO0FBQUEsU0FBWjtBQUNELE9BSEQ7QUFJRDs7O2dDQUVZVCxPLEVBQVNTLEUsRUFBSTtBQUN4QixXQUFLLElBQU1SLEdBQVgsSUFBa0JELE9BQWxCLEVBQTJCO0FBQ3pCLGFBQUtBLE9BQUwsQ0FBYUMsR0FBYixJQUFvQkQsUUFBUUMsR0FBUixDQUFwQjtBQUNEO0FBQ0QsVUFBSVEsRUFBSixFQUFRO0FBQ04sYUFBS0wsU0FBTCxDQUFlTSxJQUFmLENBQW9CRCxFQUFwQjtBQUNEO0FBQ0QsV0FBS0UsWUFBTDtBQUNEOzs7bUNBRWU7QUFDZCxXQUFLLElBQU1DLEVBQVgsSUFBaUIsS0FBS1osT0FBdEI7QUFBK0IsZUFBTyxLQUFLQSxPQUFMLENBQWFZLEVBQWIsQ0FBUDtBQUEvQixPQUNBLEtBQUssSUFBTUMsRUFBWCxJQUFpQixLQUFLWCxPQUF0QjtBQUErQixlQUFPLEtBQUtBLE9BQUwsQ0FBYVcsRUFBYixDQUFQO0FBQS9CO0FBQ0Q7OzsrQkFFV3RHLFksRUFBYztBQUN4QixXQUFLK0YsUUFBTCxDQUFjLEVBQUUvRiwwQkFBRixFQUFkO0FBQ0Q7OztnREFFcUQ7QUFBQSxVQUE3QnVHLFdBQTZCLFFBQTdCQSxXQUE2QjtBQUFBLFVBQWhCQyxZQUFnQixRQUFoQkEsWUFBZ0I7O0FBQ3BELFdBQUtDLG1CQUFMLEdBQTJCLEVBQUVGLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTNCO0FBQ0EsYUFBTyxLQUFLQyxtQkFBWjtBQUNEOzs7bURBRXVEO0FBQUEsVUFBN0JGLFdBQTZCLFNBQTdCQSxXQUE2QjtBQUFBLFVBQWhCQyxZQUFnQixTQUFoQkEsWUFBZ0I7O0FBQ3RELFdBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsYUFBTyxLQUFLQSxtQkFBWjtBQUNEOztBQUVEOzs7Ozs7MkNBSXdCO0FBQ3RCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYzJCLE9BQWQsQ0FBc0IsVUFBQ1MsS0FBRCxFQUFXO0FBQy9CQSxjQUFNLENBQU4sRUFBU0MsY0FBVCxDQUF3QkQsTUFBTSxDQUFOLENBQXhCLEVBQWtDQSxNQUFNLENBQU4sQ0FBbEM7QUFDRCxPQUZEO0FBR0EsV0FBS3hDLEtBQUwsQ0FBV29CLFFBQVgsR0FBc0IsS0FBdEI7O0FBRUEsV0FBS3NCLFVBQUwsQ0FBZ0JDLEdBQWhCLENBQW9CLGdDQUFwQixFQUFzRCxLQUFLMUIsK0JBQTNEO0FBQ0EsV0FBSzJCLFlBQUwsQ0FBa0JDLGVBQWxCOztBQUVBO0FBQ0E7QUFDRDs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLaEIsUUFBTCxDQUFjO0FBQ1pULGtCQUFVO0FBREUsT0FBZDs7QUFJQSxXQUFLUyxRQUFMLENBQWM7QUFDWnJHLHdCQUFnQnNILFNBQVNDLElBQVQsQ0FBY0MsV0FBZCxHQUE0QixLQUFLaEQsS0FBTCxDQUFXekU7QUFEM0MsT0FBZDs7QUFJQTRFLGFBQU9nQixnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxpQkFBT0wsUUFBUCxDQUFnQixZQUFNO0FBQ3RELFlBQUksT0FBS2QsS0FBTCxDQUFXb0IsUUFBZixFQUF5QjtBQUN2QixpQkFBS1MsUUFBTCxDQUFjLEVBQUVyRyxnQkFBZ0JzSCxTQUFTQyxJQUFULENBQWNDLFdBQWQsR0FBNEIsT0FBS2hELEtBQUwsQ0FBV3pFLGVBQXpELEVBQWQ7QUFDRDtBQUNGLE9BSmlDLEVBSS9CK0QsYUFKK0IsQ0FBbEM7O0FBTUEsV0FBSzJELGtCQUFMLENBQXdCLEtBQUtsRCxLQUFMLENBQVdVLFNBQW5DLEVBQThDLFdBQTlDLEVBQTJELFVBQUN5QyxPQUFELEVBQWE7QUFDdEUsWUFBSUEsUUFBUTNDLE1BQVIsS0FBbUIsT0FBS1IsS0FBTCxDQUFXUSxNQUFsQyxFQUEwQyxPQUFPLEtBQU0sQ0FBYjtBQUMxQyxnQkFBUTJDLFFBQVFDLElBQWhCO0FBQ0UsZUFBSyxrQkFBTDtBQUF5QixtQkFBTyxPQUFLOUMsVUFBTCxDQUFnQitDLGdCQUFoQixFQUFQO0FBQ3pCO0FBQVMsbUJBQU8sS0FBTSxDQUFiO0FBRlg7QUFJRCxPQU5EOztBQVFBLFdBQUtyRCxLQUFMLENBQVdVLFNBQVgsQ0FBcUI0QyxFQUFyQixDQUF3QixRQUF4QixFQUFrQyxVQUFDQyxNQUFELEVBQVNDLE1BQVQsRUFBaUJ2QixFQUFqQixFQUF3QjtBQUN4RHdCLGdCQUFRQyxJQUFSLENBQWEsNEJBQWIsRUFBMkNILE1BQTNDLEVBQW1EQyxNQUFuRDtBQUNBLGVBQU8sT0FBS2xELFVBQUwsQ0FBZ0JxRCxVQUFoQixDQUEyQkosTUFBM0IsRUFBbUNDLE1BQW5DLEVBQTJDdkIsRUFBM0MsQ0FBUDtBQUNELE9BSEQ7O0FBS0EsV0FBSzNCLFVBQUwsQ0FBZ0JnRCxFQUFoQixDQUFtQixtQkFBbkIsRUFBd0MsVUFBQ00saUJBQUQsRUFBb0JDLGlCQUFwQixFQUF1Q0MsaUJBQXZDLEVBQTBEQyxrQkFBMUQsRUFBOEVDLGFBQTlFLEVBQWdHO0FBQ3RJUCxnQkFBUUMsSUFBUixDQUFhLDhCQUFiLEVBQTZDRSxpQkFBN0MsRUFBZ0VDLGlCQUFoRSxFQUFtRkMsaUJBQW5GLEVBQXNHQyxrQkFBdEcsRUFBMEhDLGFBQTFIOztBQUVBO0FBQ0EsZUFBSzFELFVBQUwsQ0FBZ0IyRCxZQUFoQjs7QUFFQSxZQUFJNUcsa0JBQWtCLE9BQUtpRCxVQUFMLENBQWdCNEQsa0JBQWhCLEVBQXRCO0FBQ0EsWUFBSTVHLHFCQUFxQixPQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQixFQUF6QjtBQUNBLG1EQUE0QjlHLGVBQTVCOztBQUVBLGVBQUt5RSxRQUFMLENBQWMsRUFBRXpFLGdDQUFGLEVBQW1CQyxzQ0FBbkIsRUFBZDs7QUFFQSxZQUFJMEcsaUJBQWlCQSxjQUFjSSxJQUFkLEtBQXVCLFVBQTVDLEVBQXdEO0FBQ3RELGNBQUlSLHFCQUFxQkMsaUJBQXJCLElBQTBDRSxrQkFBOUMsRUFBa0U7QUFDaEVILDhCQUFrQjVCLE9BQWxCLENBQTBCLFVBQUNNLFdBQUQsRUFBaUI7QUFDekMscUJBQUsrQix5QkFBTCxDQUErQi9CLFdBQS9CLEVBQTRDdUIsaUJBQTVDLEVBQStEQyxxQkFBcUIsQ0FBcEYsRUFBdUZDLGtCQUF2RjtBQUNELGFBRkQ7QUFHRDtBQUNGO0FBQ0YsT0FuQkQ7O0FBcUJBLFdBQUt6RCxVQUFMLENBQWdCZ0QsRUFBaEIsQ0FBbUIsa0JBQW5CLEVBQXVDLFVBQUNoQixXQUFELEVBQWlCO0FBQ3REbUIsZ0JBQVFDLElBQVIsQ0FBYSw2QkFBYixFQUE0Q3BCLFdBQTVDO0FBQ0EsZUFBS2dDLG1CQUFMLENBQXlCLEVBQUVoQyx3QkFBRixFQUF6QjtBQUNELE9BSEQ7O0FBS0EsV0FBS2hDLFVBQUwsQ0FBZ0JnRCxFQUFoQixDQUFtQixvQkFBbkIsRUFBeUMsVUFBQ2hCLFdBQUQsRUFBaUI7QUFDeERtQixnQkFBUUMsSUFBUixDQUFhLCtCQUFiLEVBQThDcEIsV0FBOUM7QUFDQSxlQUFLaUMscUJBQUwsQ0FBMkIsRUFBRWpDLHdCQUFGLEVBQTNCO0FBQ0QsT0FIRDs7QUFLQSxXQUFLaEMsVUFBTCxDQUFnQmdELEVBQWhCLENBQW1CLG1CQUFuQixFQUF3QyxZQUFNO0FBQzVDLFlBQUlqRyxrQkFBa0IsT0FBS2lELFVBQUwsQ0FBZ0I0RCxrQkFBaEIsRUFBdEI7QUFDQSxZQUFJNUcscUJBQXFCLE9BQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCLEVBQXpCO0FBQ0FWLGdCQUFRQyxJQUFSLENBQWEsOEJBQWIsRUFBNkNyRyxlQUE3QztBQUNBLGVBQUttSCxpQkFBTCxDQUF1Qm5ILGVBQXZCLEVBQXdDQyxrQkFBeEM7QUFDQTtBQUNELE9BTkQ7O0FBUUE7QUFDQSxXQUFLZ0QsVUFBTCxDQUFnQitDLGdCQUFoQjs7QUFFQSxXQUFLL0MsVUFBTCxDQUFnQmdELEVBQWhCLENBQW1CLHVCQUFuQixFQUE0QyxVQUFDbUIsTUFBRCxFQUFZO0FBQ3REQSxlQUFPbkIsRUFBUCxDQUFVLGdDQUFWLEVBQTRDLE9BQUtwQywrQkFBakQ7O0FBRUF3RCxtQkFBVyxZQUFNO0FBQ2ZELGlCQUFPRSxJQUFQO0FBQ0QsU0FGRDs7QUFJQSxlQUFLaEMsVUFBTCxHQUFrQjhCLE1BQWxCO0FBQ0QsT0FSRDs7QUFVQTFCLGVBQVMzQixnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFDd0QsVUFBRCxFQUFnQjtBQUNqRG5CLGdCQUFRQyxJQUFSLENBQWEsd0JBQWI7QUFDQSxZQUFJbUIsVUFBVUQsV0FBV0UsTUFBWCxDQUFrQkMsT0FBbEIsQ0FBMEJDLFdBQTFCLEVBQWQ7QUFDQSxZQUFJQyxXQUFXTCxXQUFXRSxNQUFYLENBQWtCSSxZQUFsQixDQUErQixpQkFBL0IsQ0FBZixDQUhpRCxDQUdnQjtBQUNqRSxZQUFJTCxZQUFZLE9BQVosSUFBdUJBLFlBQVksVUFBbkMsSUFBaURJLFFBQXJELEVBQStEO0FBQzdEeEIsa0JBQVFDLElBQVIsQ0FBYSw4QkFBYjtBQUNBO0FBQ0E7QUFDRCxTQUpELE1BSU87QUFDTDtBQUNBO0FBQ0FELGtCQUFRQyxJQUFSLENBQWEsd0NBQWI7QUFDQWtCLHFCQUFXTyxjQUFYO0FBQ0EsaUJBQUtuRixLQUFMLENBQVdVLFNBQVgsQ0FBcUIwRSxJQUFyQixDQUEwQjtBQUN4QkMsa0JBQU0sV0FEa0I7QUFFeEJqQyxrQkFBTSxpQ0FGa0I7QUFHeEJnQixrQkFBTSxPQUhrQjtBQUl4QmtCLGtCQUFNLElBSmtCLENBSWI7QUFKYSxXQUExQjtBQU1EO0FBQ0YsT0FwQkQ7O0FBc0JBdkMsZUFBU0MsSUFBVCxDQUFjNUIsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsS0FBS21FLGFBQUwsQ0FBbUJ2RSxJQUFuQixDQUF3QixJQUF4QixDQUExQyxFQUF5RSxLQUF6RTs7QUFFQStCLGVBQVNDLElBQVQsQ0FBYzVCLGdCQUFkLENBQStCLE9BQS9CLEVBQXdDLEtBQUtvRSxXQUFMLENBQWlCeEUsSUFBakIsQ0FBc0IsSUFBdEIsQ0FBeEM7O0FBRUEsV0FBS2tDLGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxnQkFBdEMsRUFBd0QsVUFBQ21DLFdBQUQsRUFBY21ELFlBQWQsRUFBNEJDLFdBQTVCLEVBQXlDbkQsWUFBekMsRUFBdURvRCxPQUF2RCxFQUFtRTtBQUN6SCxZQUFJQyxZQUFZLE9BQUtDLFlBQUwsRUFBaEI7QUFDQSxZQUFJQyxlQUFlLHlDQUEwQkgsT0FBMUIsRUFBbUNDLFVBQVVHLElBQTdDLENBQW5CO0FBQ0EsWUFBSUMsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixlQUFlRixVQUFVRyxJQUFwQyxDQUFkO0FBQ0EsZUFBS0ksbUNBQUwsQ0FBeUM3RCxXQUF6QyxFQUFzRG1ELFlBQXRELEVBQW9FQyxXQUFwRSxFQUFpRm5ELFlBQWpGLEVBQStGeUQsT0FBL0YsQ0FBc0csbUNBQXRHO0FBQ0QsT0FMRDtBQU1BLFdBQUs5QyxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0MsY0FBdEMsRUFBc0QsVUFBQ21DLFdBQUQsRUFBY21ELFlBQWQsRUFBNEJDLFdBQTVCLEVBQXlDbkQsWUFBekMsRUFBdURvRCxPQUF2RCxFQUFtRTtBQUN2SCxZQUFJQyxZQUFZLE9BQUtDLFlBQUwsRUFBaEI7QUFDQSxZQUFJQyxlQUFlLHlDQUEwQkgsT0FBMUIsRUFBbUNDLFVBQVVHLElBQTdDLENBQW5CO0FBQ0EsWUFBSUMsVUFBVUMsS0FBS0MsS0FBTCxDQUFXSixlQUFlRixVQUFVRyxJQUFwQyxDQUFkO0FBQ0EsZUFBS0ssaUNBQUwsQ0FBdUM5RCxXQUF2QyxFQUFvRG1ELFlBQXBELEVBQWtFQyxXQUFsRSxFQUErRW5ELFlBQS9FLEVBQTZGeUQsT0FBN0Y7QUFDRCxPQUxEO0FBTUEsV0FBSzlDLGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxlQUF0QyxFQUF1RCxVQUFDbUMsV0FBRCxFQUFjbUQsWUFBZCxFQUE0QkMsV0FBNUIsRUFBeUNuRCxZQUF6QyxFQUF1RG9ELE9BQXZELEVBQWdFVSxLQUFoRSxFQUF1RUMsU0FBdkUsRUFBcUY7QUFDMUksZUFBSzNELFVBQUwsQ0FBZ0JnQyxJQUFoQjtBQUNBLGVBQUs0QixrQ0FBTCxDQUF3Q2pFLFdBQXhDLEVBQXFEbUQsWUFBckQsRUFBbUVDLFdBQW5FLEVBQWdGbkQsWUFBaEYsRUFBOEZvRCxPQUE5RixFQUF1R1UsS0FBdkcsRUFBOEdDLFNBQTlHO0FBQ0QsT0FIRDtBQUlBLFdBQUtwRCxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0MsZ0JBQXRDLEVBQXdELFVBQUNtQyxXQUFELEVBQWNtRCxZQUFkLEVBQTRCbEQsWUFBNUIsRUFBMENvRCxPQUExQyxFQUFzRDtBQUM1RyxlQUFLYSxtQ0FBTCxDQUF5Q2xFLFdBQXpDLEVBQXNEbUQsWUFBdEQsRUFBb0VsRCxZQUFwRSxFQUFrRm9ELE9BQWxGO0FBQ0QsT0FGRDtBQUdBLFdBQUt6QyxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0Msb0JBQXRDLEVBQTRELFVBQUNtQyxXQUFELEVBQWNtRCxZQUFkLEVBQTRCbEQsWUFBNUIsRUFBMENvRCxPQUExQyxFQUFtRFcsU0FBbkQsRUFBaUU7QUFDM0gsZUFBS0csdUNBQUwsQ0FBNkNuRSxXQUE3QyxFQUEwRG1ELFlBQTFELEVBQXdFbEQsWUFBeEUsRUFBc0ZvRCxPQUF0RixFQUErRlcsU0FBL0Y7QUFDRCxPQUZEO0FBR0EsV0FBS3BELGtCQUFMLENBQXdCLEtBQUsvQyxPQUE3QixFQUFzQyxzQkFBdEMsRUFBOEQsVUFBQ21DLFdBQUQsRUFBY21ELFlBQWQsRUFBNEJsRCxZQUE1QixFQUEwQ21FLE1BQTFDLEVBQWtEQyxhQUFsRCxFQUFpRWhCLE9BQWpFLEVBQTBFVSxLQUExRSxFQUFvRjtBQUNoSixlQUFLTyx5Q0FBTCxDQUErQ3RFLFdBQS9DLEVBQTREbUQsWUFBNUQsRUFBMEVsRCxZQUExRSxFQUF3Rm1FLE1BQXhGLEVBQWdHQyxhQUFoRyxFQUErR2hCLE9BQS9HLEVBQXdIVSxLQUF4SDtBQUNELE9BRkQ7O0FBSUEsV0FBS25ELGtCQUFMLENBQXdCLEtBQUs1QyxVQUFMLENBQWdCdUcsVUFBeEMsRUFBb0QscUJBQXBELEVBQTJFLFVBQUM5SyxZQUFELEVBQWtCO0FBQzNGLFlBQUk2SixZQUFZLE9BQUtDLFlBQUwsRUFBaEI7QUFDQSxlQUFLaUIsVUFBTCxDQUFnQi9LLFlBQWhCO0FBQ0E7QUFDQTtBQUNBLFlBQUlBLGVBQWU2SixVQUFVbUIsTUFBN0IsRUFBcUM7QUFDbkMsaUJBQUt6RyxVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDQyxZQUFyQyxDQUFrRHJCLFVBQVVtQixNQUE1RDtBQUNBLGlCQUFLakYsUUFBTCxDQUFjLEVBQUN6RixpQkFBaUIsS0FBbEIsRUFBZDtBQUNEO0FBQ0Q7QUFDQTtBQUNBLFlBQUlOLGdCQUFnQjZKLFVBQVVzQixJQUExQixJQUFrQ25MLGVBQWU2SixVQUFVdUIsSUFBL0QsRUFBcUU7QUFDbkUsaUJBQUtDLHVDQUFMLENBQTZDeEIsU0FBN0M7QUFDRDtBQUNGLE9BZEQ7O0FBZ0JBLFdBQUsxQyxrQkFBTCxDQUF3QixLQUFLNUMsVUFBTCxDQUFnQnVHLFVBQXhDLEVBQW9ELHdDQUFwRCxFQUE4RixVQUFDOUssWUFBRCxFQUFrQjtBQUM5RyxZQUFJNkosWUFBWSxPQUFLQyxZQUFMLEVBQWhCO0FBQ0EsZUFBS2lCLFVBQUwsQ0FBZ0IvSyxZQUFoQjtBQUNBO0FBQ0E7QUFDQSxZQUFJQSxnQkFBZ0I2SixVQUFVc0IsSUFBMUIsSUFBa0NuTCxlQUFlNkosVUFBVXVCLElBQS9ELEVBQXFFO0FBQ25FLGlCQUFLQyx1Q0FBTCxDQUE2Q3hCLFNBQTdDO0FBQ0Q7QUFDRixPQVJEO0FBU0Q7OzsyREFFdUQ7QUFBQSxVQUFyQnlCLFFBQXFCLFNBQXJCQSxRQUFxQjtBQUFBLFVBQVhDLE9BQVcsU0FBWEEsT0FBVzs7QUFDdEQsVUFBSUEsWUFBWSxVQUFoQixFQUE0QjtBQUFFO0FBQVE7O0FBRXRDLFVBQUk7QUFDRjtBQUNBLFlBQUlDLFVBQVV4RSxTQUFTeUUsYUFBVCxDQUF1QkgsUUFBdkIsQ0FBZDs7QUFGRSxvQ0FHa0JFLFFBQVFFLHFCQUFSLEVBSGxCO0FBQUEsWUFHSUMsR0FISix5QkFHSUEsR0FISjtBQUFBLFlBR1NDLElBSFQseUJBR1NBLElBSFQ7O0FBS0YsYUFBS2hGLFVBQUwsQ0FBZ0JpRix5QkFBaEIsQ0FBMEMsVUFBMUMsRUFBc0QsRUFBRUYsUUFBRixFQUFPQyxVQUFQLEVBQXREO0FBQ0QsT0FORCxDQU1FLE9BQU9FLEtBQVAsRUFBYztBQUNkcEUsZ0JBQVFvRSxLQUFSLHFCQUFnQ1IsUUFBaEMsb0JBQXVEQyxPQUF2RDtBQUNEO0FBQ0Y7OztrQ0FFY1EsVyxFQUFhO0FBQzFCO0FBQ0EsVUFBSSxLQUFLQyxJQUFMLENBQVVDLGVBQVYsQ0FBMEJDLDhCQUExQixDQUF5REgsV0FBekQsQ0FBSixFQUEyRTtBQUN6RSxlQUFPLEtBQU0sQ0FBYjtBQUNEOztBQUVEO0FBQ0EsVUFBSUEsWUFBWUksT0FBWixLQUF3QixFQUF4QixJQUE4QixDQUFDbkYsU0FBU3lFLGFBQVQsQ0FBdUIsYUFBdkIsQ0FBbkMsRUFBMEU7QUFDeEUsYUFBS1csY0FBTDtBQUNBTCxvQkFBWTNDLGNBQVo7QUFDQSxlQUFPLEtBQU0sQ0FBYjtBQUNEOztBQUVELGNBQVEyQyxZQUFZTSxLQUFwQjtBQUNFO0FBQ0E7QUFDQSxhQUFLLEVBQUw7QUFBUztBQUNQLGNBQUksS0FBS25JLEtBQUwsQ0FBV3pELGdCQUFmLEVBQWlDO0FBQy9CLGdCQUFJLEtBQUt5RCxLQUFMLENBQVcxRCxjQUFmLEVBQStCO0FBQzdCLG1CQUFLdUYsUUFBTCxDQUFjLEVBQUVoRyxtQkFBbUIsQ0FBQyxDQUFELEVBQUksS0FBS21FLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQUosQ0FBckIsRUFBMkRjLHNCQUFzQixLQUFqRixFQUFkO0FBQ0EscUJBQU8sS0FBS2tLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBUDtBQUNELGFBSEQsTUFHTztBQUNMLHFCQUFPLEtBQUt1QixzQkFBTCxDQUE0QixDQUFDLENBQTdCLENBQVA7QUFDRDtBQUNGLFdBUEQsTUFPTztBQUNMLGdCQUFJLEtBQUtwSSxLQUFMLENBQVdyRCxvQkFBWCxJQUFtQyxLQUFLcUQsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsTUFBb0MsQ0FBM0UsRUFBOEU7QUFDNUUsbUJBQUtnRyxRQUFMLENBQWMsRUFBRWxGLHNCQUFzQixLQUF4QixFQUFkO0FBQ0Q7QUFDRCxtQkFBTyxLQUFLMEwsdUJBQUwsQ0FBNkIsQ0FBQyxDQUE5QixDQUFQO0FBQ0Q7O0FBRUgsYUFBSyxFQUFMO0FBQVM7QUFDUCxjQUFJLEtBQUtySSxLQUFMLENBQVd6RCxnQkFBZixFQUFpQztBQUMvQixtQkFBTyxLQUFLNkwsc0JBQUwsQ0FBNEIsQ0FBNUIsQ0FBUDtBQUNELFdBRkQsTUFFTztBQUNMLGdCQUFJLENBQUMsS0FBS3BJLEtBQUwsQ0FBV3JELG9CQUFoQixFQUFzQyxLQUFLa0YsUUFBTCxDQUFjLEVBQUVsRixzQkFBc0IsSUFBeEIsRUFBZDtBQUN0QyxtQkFBTyxLQUFLMEwsdUJBQUwsQ0FBNkIsQ0FBN0IsQ0FBUDtBQUNEOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLQyxtQkFBTCxDQUF5QixFQUFFaE0sZ0JBQWdCLElBQWxCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLZ00sbUJBQUwsQ0FBeUIsRUFBRTlMLGtCQUFrQixJQUFwQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSzhMLG1CQUFMLENBQXlCLEVBQUU3TCxjQUFjLElBQWhCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEdBQUw7QUFBVSxpQkFBTyxLQUFLNkwsbUJBQUwsQ0FBeUIsRUFBRS9MLGtCQUFrQixJQUFwQixFQUF6QixDQUFQO0FBQ1YsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSytMLG1CQUFMLENBQXlCLEVBQUUvTCxrQkFBa0IsSUFBcEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUsrTCxtQkFBTCxDQUF5QixFQUFFL0wsa0JBQWtCLElBQXBCLEVBQXpCLENBQVA7QUFwQ1g7QUFzQ0Q7OztnQ0FFWXNMLFcsRUFBYTtBQUN4QixjQUFRQSxZQUFZTSxLQUFwQjtBQUNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUtHLG1CQUFMLENBQXlCLEVBQUVoTSxnQkFBZ0IsS0FBbEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUtnTSxtQkFBTCxDQUF5QixFQUFFOUwsa0JBQWtCLEtBQXBCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLOEwsbUJBQUwsQ0FBeUIsRUFBRTdMLGNBQWMsS0FBaEIsRUFBekIsQ0FBUDtBQUNULGFBQUssR0FBTDtBQUFVLGlCQUFPLEtBQUs2TCxtQkFBTCxDQUF5QixFQUFFL0wsa0JBQWtCLEtBQXBCLEVBQXpCLENBQVA7QUFDVixhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLK0wsbUJBQUwsQ0FBeUIsRUFBRS9MLGtCQUFrQixLQUFwQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSytMLG1CQUFMLENBQXlCLEVBQUUvTCxrQkFBa0IsS0FBcEIsRUFBekIsQ0FBUDtBQWZYO0FBaUJEOzs7d0NBRW9CZ0YsTyxFQUFTO0FBQzVCO0FBQ0E7QUFDQSxVQUFJLENBQUMsS0FBS3ZCLEtBQUwsQ0FBVy9DLFlBQWhCLEVBQThCO0FBQzVCLGVBQU8sS0FBSzRFLFFBQUwsQ0FBY04sT0FBZCxDQUFQO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBSyxJQUFJQyxHQUFULElBQWdCRCxPQUFoQixFQUF5QjtBQUN2QixlQUFLdkIsS0FBTCxDQUFXd0IsR0FBWCxJQUFrQkQsUUFBUUMsR0FBUixDQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7O3VDQUVtQitHLFksRUFBY0MsUyxFQUFXQyxZLEVBQWM7QUFDekQsV0FBS3JJLFFBQUwsQ0FBYzZCLElBQWQsQ0FBbUIsQ0FBQ3NHLFlBQUQsRUFBZUMsU0FBZixFQUEwQkMsWUFBMUIsQ0FBbkI7QUFDQUYsbUJBQWFsRixFQUFiLENBQWdCbUYsU0FBaEIsRUFBMkJDLFlBQTNCO0FBQ0Q7O0FBRUQ7Ozs7OztpQ0FJY2pKLEksRUFBTTtBQUNsQkEsV0FBS2tKLFlBQUwsR0FBb0IsS0FBcEI7QUFDQSxVQUFJOUwsZ0JBQWdCLGlCQUFPK0wsS0FBUCxDQUFhLEtBQUszSSxLQUFMLENBQVdwRCxhQUF4QixDQUFwQjtBQUNBQSxvQkFBYzRDLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQWQsSUFBNkMsS0FBN0M7QUFDQSxXQUFLL0csUUFBTCxDQUFjO0FBQ1o3RSx1QkFBZSxJQURILEVBQ1M7QUFDckJDLHNCQUFjLElBRkYsRUFFUTtBQUNwQkwsdUJBQWVBLGFBSEg7QUFJWmlNLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOzs7K0JBRVd2SixJLEVBQU07QUFDaEJBLFdBQUtrSixZQUFMLEdBQW9CLElBQXBCO0FBQ0EsVUFBSTlMLGdCQUFnQixpQkFBTytMLEtBQVAsQ0FBYSxLQUFLM0ksS0FBTCxDQUFXcEQsYUFBeEIsQ0FBcEI7QUFDQUEsb0JBQWM0QyxLQUFLb0osVUFBTCxDQUFnQixVQUFoQixDQUFkLElBQTZDLElBQTdDO0FBQ0EsV0FBSy9HLFFBQUwsQ0FBYztBQUNaN0UsdUJBQWUsSUFESCxFQUNTO0FBQ3JCQyxzQkFBYyxJQUZGLEVBRVE7QUFDcEJMLHVCQUFlQSxhQUhIO0FBSVppTSxvQkFBWUMsS0FBS0MsR0FBTDtBQUpBLE9BQWQ7QUFNRDs7O2tDQUVjO0FBQ2IsVUFBSSxLQUFLakIsSUFBTCxDQUFVa0IsVUFBZCxFQUEwQjtBQUN4QixhQUFLbEIsSUFBTCxDQUFVa0IsVUFBVixDQUFxQkMsU0FBckIsR0FBaUMsQ0FBakM7QUFDRDtBQUNGOzs7aUNBRWF6SixJLEVBQU07QUFDbEIsVUFBSTBKLFdBQVcsS0FBS2xKLEtBQUwsQ0FBV21KLGlCQUFYLElBQWdDLEVBQS9DO0FBQ0EsVUFBSUMsYUFBYSxJQUFqQjtBQUNBLFVBQUlDLGVBQWUsQ0FBbkI7QUFDQUgsZUFBU25ILE9BQVQsQ0FBaUIsVUFBQ3VILE9BQUQsRUFBVUMsS0FBVixFQUFvQjtBQUNuQyxZQUFJRCxRQUFRRSxTQUFaLEVBQXVCO0FBQ3JCSDtBQUNELFNBRkQsTUFFTyxJQUFJQyxRQUFRRyxVQUFaLEVBQXdCO0FBQzdCLGNBQUlILFFBQVE5SixJQUFSLElBQWdCOEosUUFBUTlKLElBQVIsQ0FBYWtLLFlBQWpDLEVBQStDO0FBQzdDTDtBQUNEO0FBQ0Y7QUFDRCxZQUFJRCxlQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLGNBQUlFLFFBQVE5SixJQUFSLElBQWdCOEosUUFBUTlKLElBQVIsS0FBaUJBLElBQXJDLEVBQTJDO0FBQ3pDNEoseUJBQWFDLFlBQWI7QUFDRDtBQUNGO0FBQ0YsT0FiRDtBQWNBLFVBQUlELGVBQWUsSUFBbkIsRUFBeUI7QUFDdkIsWUFBSSxLQUFLdEIsSUFBTCxDQUFVa0IsVUFBZCxFQUEwQjtBQUN4QixlQUFLbEIsSUFBTCxDQUFVa0IsVUFBVixDQUFxQkMsU0FBckIsR0FBa0NHLGFBQWEsS0FBS3BKLEtBQUwsQ0FBV3ZFLFNBQXpCLEdBQXNDLEtBQUt1RSxLQUFMLENBQVd2RSxTQUFsRjtBQUNEO0FBQ0Y7QUFDRjs7O3VDQUVtQmtPLE8sRUFBUztBQUMzQixVQUFJQyxTQUFTLENBQWI7QUFDQSxVQUFJRCxRQUFRRSxZQUFaLEVBQTBCO0FBQ3hCLFdBQUc7QUFDREQsb0JBQVVELFFBQVFHLFNBQWxCO0FBQ0QsU0FGRCxRQUVTSCxVQUFVQSxRQUFRRSxZQUYzQixFQUR3QixDQUdpQjtBQUMxQztBQUNELGFBQU9ELE1BQVA7QUFDRDs7O2lDQUVhcEssSSxFQUFNO0FBQ2xCQSxXQUFLa0ssWUFBTCxHQUFvQixLQUFwQjtBQUNBbkssWUFBTUMsSUFBTixFQUFZLFVBQUNLLEtBQUQsRUFBVztBQUNyQkEsY0FBTTZKLFlBQU4sR0FBcUIsS0FBckI7QUFDQTdKLGNBQU02SSxZQUFOLEdBQXFCLEtBQXJCO0FBQ0QsT0FIRDtBQUlBLFVBQUk3TCxnQkFBZ0IsS0FBS21ELEtBQUwsQ0FBV25ELGFBQS9CO0FBQ0EsVUFBSXdGLGNBQWM3QyxLQUFLb0osVUFBTCxDQUFnQixVQUFoQixDQUFsQjtBQUNBL0wsb0JBQWN3RixXQUFkLElBQTZCLEtBQTdCO0FBQ0EsV0FBS1IsUUFBTCxDQUFjO0FBQ1o3RSx1QkFBZSxJQURILEVBQ1M7QUFDckJDLHNCQUFjLElBRkYsRUFFUTtBQUNwQkosdUJBQWVBLGFBSEg7QUFJWmdNLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOzs7K0JBRVd2SixJLEVBQU02QyxXLEVBQWE7QUFDN0I3QyxXQUFLa0ssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFVBQUlsSyxLQUFLdUssTUFBVCxFQUFpQixLQUFLQyxVQUFMLENBQWdCeEssS0FBS3VLLE1BQXJCLEVBRlksQ0FFaUI7QUFDOUMsVUFBSWxOLGdCQUFnQixLQUFLbUQsS0FBTCxDQUFXbkQsYUFBL0I7QUFDQXdGLG9CQUFjN0MsS0FBS29KLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBZDtBQUNBL0wsb0JBQWN3RixXQUFkLElBQTZCLElBQTdCO0FBQ0EsV0FBS1IsUUFBTCxDQUFjO0FBQ1o3RSx1QkFBZSxJQURILEVBQ1M7QUFDckJDLHNCQUFjLElBRkYsRUFFUTtBQUNwQkosdUJBQWVBLGFBSEg7QUFJWmdNLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOzs7Z0NBRVlrQixHLEVBQUs7QUFDaEIsVUFBSUEsSUFBSUMsUUFBUixFQUFrQjtBQUNoQixhQUFLbEssS0FBTCxDQUFXbEQsYUFBWCxDQUF5Qm1OLElBQUk1SCxXQUFKLEdBQWtCLEdBQWxCLEdBQXdCNEgsSUFBSUMsUUFBSixDQUFhL0csSUFBOUQsSUFBc0UsSUFBdEU7QUFDRDtBQUNGOzs7a0NBRWM4RyxHLEVBQUs7QUFDbEIsVUFBSUEsSUFBSUMsUUFBUixFQUFrQjtBQUNoQixhQUFLbEssS0FBTCxDQUFXbEQsYUFBWCxDQUF5Qm1OLElBQUk1SCxXQUFKLEdBQWtCLEdBQWxCLEdBQXdCNEgsSUFBSUMsUUFBSixDQUFhL0csSUFBOUQsSUFBc0UsS0FBdEU7QUFDRDtBQUNGOzs7bUNBRWU4RyxHLEVBQUs7QUFDbkIsVUFBSUEsSUFBSUMsUUFBUixFQUFrQjtBQUNoQixlQUFPLEtBQUtsSyxLQUFMLENBQVdsRCxhQUFYLENBQXlCbU4sSUFBSTVILFdBQUosR0FBa0IsR0FBbEIsR0FBd0I0SCxJQUFJQyxRQUFKLENBQWEvRyxJQUE5RCxDQUFQO0FBQ0Q7QUFDRjs7O3VDQUVtQmdILEksRUFBTTtBQUN4QixhQUFPLEtBQVAsQ0FEd0IsQ0FDWDtBQUNkOzs7NENBRXdCO0FBQ3ZCLFVBQUksS0FBS25LLEtBQUwsQ0FBVzlELGVBQVgsS0FBK0IsUUFBbkMsRUFBNkM7QUFDM0MsYUFBSzJGLFFBQUwsQ0FBYztBQUNaN0UseUJBQWUsSUFESDtBQUVaQyx3QkFBYyxJQUZGO0FBR1pmLDJCQUFpQjtBQUhMLFNBQWQ7QUFLRCxPQU5ELE1BTU87QUFDTCxhQUFLMkYsUUFBTCxDQUFjO0FBQ1o3RSx5QkFBZSxJQURIO0FBRVpDLHdCQUFjLElBRkY7QUFHWmYsMkJBQWlCO0FBSEwsU0FBZDtBQUtEO0FBQ0Y7OzsyQ0FFdUJrTyxLLEVBQU96RSxTLEVBQVc7QUFDeEMsVUFBSTBFLFlBQVksS0FBS3JLLEtBQUwsQ0FBV3NLLGlCQUEzQjtBQUNBLFVBQUlDLGdCQUFnQixLQUFLdkssS0FBTCxDQUFXdUssYUFBL0I7QUFDQSxVQUFJQyxZQUFZSixRQUFRQyxTQUF4QjtBQUNBLFVBQUlJLGFBQWF6RSxLQUFLQyxLQUFMLENBQVd1RSxZQUFZN0UsVUFBVStFLElBQWpDLENBQWpCO0FBQ0EsVUFBSTVPLGVBQWV5TyxnQkFBZ0JFLFVBQW5DO0FBQ0EsVUFBSTNPLGVBQWU2SixVQUFVdUIsSUFBN0IsRUFBbUNwTCxlQUFlNkosVUFBVXVCLElBQXpCO0FBQ25DLFVBQUlwTCxlQUFlNkosVUFBVXNCLElBQTdCLEVBQW1DbkwsZUFBZTZKLFVBQVVzQixJQUF6QjtBQUNuQyxXQUFLNUcsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzRELElBQXJDLENBQTBDN08sWUFBMUM7QUFDRDs7O21EQUUrQnNPLEssRUFBT3pFLFMsRUFBVztBQUFBOztBQUNoRCxVQUFJMEUsWUFBWSxLQUFLckssS0FBTCxDQUFXNEssaUJBQTNCO0FBQ0EsVUFBSUosWUFBWUosUUFBUUMsU0FBeEI7QUFDQSxVQUFJSSxhQUFhekUsS0FBS0MsS0FBTCxDQUFXdUUsWUFBWTdFLFVBQVUrRSxJQUFqQyxDQUFqQjtBQUNBLFVBQUlGLFlBQVksQ0FBWixJQUFpQixLQUFLeEssS0FBTCxDQUFXaEUsWUFBWCxJQUEyQixDQUFoRCxFQUFtRDtBQUNqRCxZQUFJLENBQUMsS0FBS2dFLEtBQUwsQ0FBVzZLLFdBQWhCLEVBQTZCO0FBQzNCLGNBQUlBLGNBQWNDLFlBQVksWUFBTTtBQUNsQyxnQkFBSUMsYUFBYSxPQUFLL0ssS0FBTCxDQUFXakUsUUFBWCxHQUFzQixPQUFLaUUsS0FBTCxDQUFXakUsUUFBakMsR0FBNEM0SixVQUFVcUYsT0FBdkU7QUFDQSxtQkFBS25KLFFBQUwsQ0FBYyxFQUFDOUYsVUFBVWdQLGFBQWEsRUFBeEIsRUFBZDtBQUNELFdBSGlCLEVBR2YsR0FIZSxDQUFsQjtBQUlBLGVBQUtsSixRQUFMLENBQWMsRUFBQ2dKLGFBQWFBLFdBQWQsRUFBZDtBQUNEO0FBQ0QsYUFBS2hKLFFBQUwsQ0FBYyxFQUFDb0osY0FBYyxJQUFmLEVBQWQ7QUFDQTtBQUNEO0FBQ0QsVUFBSSxLQUFLakwsS0FBTCxDQUFXNkssV0FBZixFQUE0QkssY0FBYyxLQUFLbEwsS0FBTCxDQUFXNkssV0FBekI7QUFDNUI7QUFDQSxVQUFJbEYsVUFBVXNCLElBQVYsR0FBaUJ3RCxVQUFqQixJQUErQjlFLFVBQVVtQixNQUF6QyxJQUFtRCxDQUFDMkQsVUFBRCxJQUFlOUUsVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVdUIsSUFBakcsRUFBdUc7QUFDckd1RCxxQkFBYSxLQUFLekssS0FBTCxDQUFXaEUsWUFBeEIsQ0FEcUcsQ0FDaEU7QUFDckMsZUFGcUcsQ0FFaEU7QUFDdEM7QUFDRCxXQUFLNkYsUUFBTCxDQUFjLEVBQUU3RixjQUFjeU8sVUFBaEIsRUFBNEJRLGNBQWMsS0FBMUMsRUFBaURKLGFBQWEsSUFBOUQsRUFBZDtBQUNEOzs7NENBRXdCTSxFLEVBQUlDLEUsRUFBSXpGLFMsRUFBVztBQUMxQyxVQUFJMEYsT0FBTyxJQUFYO0FBQ0EsVUFBSUMsT0FBTyxJQUFYOztBQUVBLFVBQUksS0FBS3RMLEtBQUwsQ0FBV3VMLHFCQUFmLEVBQXNDO0FBQ3BDRixlQUFPRixFQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUksS0FBS25MLEtBQUwsQ0FBV3dMLHNCQUFmLEVBQXVDO0FBQzVDRixlQUFPRixFQUFQO0FBQ0QsT0FGTSxNQUVBLElBQUksS0FBS3BMLEtBQUwsQ0FBV3lMLHFCQUFmLEVBQXNDO0FBQzNDLFlBQU1DLFVBQVcsS0FBSzFMLEtBQUwsQ0FBVzJMLGNBQVgsR0FBNEJoRyxVQUFVK0UsSUFBdkMsR0FBK0MvRSxVQUFVaUcsT0FBekU7QUFDQSxZQUFNQyxVQUFXLEtBQUs3TCxLQUFMLENBQVc4TCxZQUFYLEdBQTBCbkcsVUFBVStFLElBQXJDLEdBQTZDL0UsVUFBVWlHLE9BQXZFO0FBQ0EsWUFBTUcsUUFBUVosS0FBSyxLQUFLbkwsS0FBTCxDQUFXeUwscUJBQTlCO0FBQ0FKLGVBQU9LLFVBQVVLLEtBQWpCO0FBQ0FULGVBQU9PLFVBQVVFLEtBQWpCO0FBQ0Q7O0FBRUQsVUFBSUMsS0FBTVgsU0FBUyxJQUFWLEdBQWtCckYsS0FBS0MsS0FBTCxDQUFZb0YsT0FBTzFGLFVBQVVpRyxPQUFsQixHQUE2QmpHLFVBQVUrRSxJQUFsRCxDQUFsQixHQUE0RSxLQUFLMUssS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBckY7QUFDQSxVQUFJb1EsS0FBTVgsU0FBUyxJQUFWLEdBQWtCdEYsS0FBS0MsS0FBTCxDQUFZcUYsT0FBTzNGLFVBQVVpRyxPQUFsQixHQUE2QmpHLFVBQVUrRSxJQUFsRCxDQUFsQixHQUE0RSxLQUFLMUssS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBckY7O0FBRUE7QUFDQSxVQUFJbVEsTUFBTXJHLFVBQVV1RyxJQUFwQixFQUEwQjtBQUN4QkYsYUFBS3JHLFVBQVV1RyxJQUFmO0FBQ0EsWUFBSSxDQUFDLEtBQUtsTSxLQUFMLENBQVd3TCxzQkFBWixJQUFzQyxDQUFDLEtBQUt4TCxLQUFMLENBQVd1TCxxQkFBdEQsRUFBNkU7QUFDM0VVLGVBQUssS0FBS2pNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLEtBQW1DLEtBQUttRSxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixJQUFrQ21RLEVBQXJFLENBQUw7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSUMsTUFBTXRHLFVBQVVxRixPQUFwQixFQUE2QjtBQUMzQmdCLGFBQUssS0FBS2hNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQUw7QUFDQSxZQUFJLENBQUMsS0FBS21FLEtBQUwsQ0FBV3dMLHNCQUFaLElBQXNDLENBQUMsS0FBS3hMLEtBQUwsQ0FBV3VMLHFCQUF0RCxFQUE2RTtBQUMzRVUsZUFBS3RHLFVBQVVxRixPQUFmO0FBQ0Q7QUFDRjs7QUFFRCxXQUFLbkosUUFBTCxDQUFjLEVBQUVoRyxtQkFBbUIsQ0FBQ21RLEVBQUQsRUFBS0MsRUFBTCxDQUFyQixFQUFkO0FBQ0Q7Ozs0Q0FFd0JFLEssRUFBTztBQUM5QixVQUFJQyxJQUFJLEtBQUtwTSxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixJQUFrQ3NRLEtBQTFDO0FBQ0EsVUFBSUUsSUFBSSxLQUFLck0sS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0NzUSxLQUExQztBQUNBLFVBQUlDLEtBQUssQ0FBVCxFQUFZO0FBQ1YsYUFBS3ZLLFFBQUwsQ0FBYyxFQUFFaEcsbUJBQW1CLENBQUN1USxDQUFELEVBQUlDLENBQUosQ0FBckIsRUFBZDtBQUNEO0FBQ0Y7O0FBRUQ7Ozs7NERBQ3lDMUcsUyxFQUFXO0FBQ2xELFVBQUl5RyxJQUFJLEtBQUtwTSxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUFSO0FBQ0EsVUFBSXdRLElBQUksS0FBS3JNLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQVI7QUFDQSxVQUFJeVEsT0FBT0QsSUFBSUQsQ0FBZjtBQUNBLFVBQUlHLE9BQU8sS0FBS3ZNLEtBQUwsQ0FBV2xFLFlBQXRCO0FBQ0EsVUFBSTBRLE9BQU9ELE9BQU9ELElBQWxCOztBQUVBLFVBQUlFLE9BQU83RyxVQUFVbUIsTUFBckIsRUFBNkI7QUFDM0J5RixnQkFBU0MsT0FBTzdHLFVBQVVtQixNQUExQjtBQUNBMEYsZUFBTzdHLFVBQVVtQixNQUFqQjtBQUNEOztBQUVELFdBQUtqRixRQUFMLENBQWMsRUFBRWhHLG1CQUFtQixDQUFDMFEsSUFBRCxFQUFPQyxJQUFQLENBQXJCLEVBQWQ7QUFDRDs7OzJDQUV1QkwsSyxFQUFPO0FBQzdCLFVBQUlyUSxlQUFlLEtBQUtrRSxLQUFMLENBQVdsRSxZQUFYLEdBQTBCcVEsS0FBN0M7QUFDQSxVQUFJclEsZ0JBQWdCLENBQXBCLEVBQXVCQSxlQUFlLENBQWY7QUFDdkIsV0FBS3VFLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUM0RCxJQUFyQyxDQUEwQzdPLFlBQTFDO0FBQ0Q7Ozt3REFFb0N1RyxXLEVBQWFtRCxZLEVBQWNDLFcsRUFBYW5ELFksRUFBY29ELE8sRUFBUytHLFUsRUFBWUMsVSxFQUFZdEcsSyxFQUFPdUcsUSxFQUFVO0FBQzNJO0FBQ0Esd0JBQWdCQyxjQUFoQixDQUErQixLQUFLNU0sS0FBTCxDQUFXNUMsZUFBMUMsRUFBMkRpRixXQUEzRCxFQUF3RW1ELFlBQXhFLEVBQXNGQyxXQUF0RixFQUFtR25ELFlBQW5HLEVBQWlIb0QsT0FBakgsRUFBMEgrRyxVQUExSCxFQUFzSUMsVUFBdEksRUFBa0p0RyxLQUFsSixFQUF5SnVHLFFBQXpKLEVBQW1LLEtBQUt0TSxVQUFMLENBQWdCd00sdUJBQWhCLEdBQTBDQyxHQUExQyxDQUE4QyxjQUE5QyxDQUFuSyxFQUFrTyxLQUFLek0sVUFBTCxDQUFnQndNLHVCQUFoQixHQUEwQ0MsR0FBMUMsQ0FBOEMsUUFBOUMsQ0FBbE87QUFDQSxpREFBNEIsS0FBSzlNLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtuQyxRQUFMLENBQWM7QUFDWnpFLHlCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBO0FBQ0EsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQzhCLFdBQUQsQ0FBcEIsRUFBbUNtRCxZQUFuQyxFQUFpREMsV0FBakQsRUFBOERuRCxZQUE5RCxFQUE0RW9ELE9BQTVFLEVBQXFGK0csVUFBckYsRUFBaUdDLFVBQWpHLEVBQTZHdEcsS0FBN0csRUFBb0h1RyxRQUFwSCxDQUE5QyxFQUE2SyxZQUFNLENBQUUsQ0FBckw7O0FBRUEsVUFBSWxILGdCQUFnQixLQUFoQixJQUF5Qm5ELGlCQUFpQixTQUE5QyxFQUF5RDtBQUN2RCxhQUFLSSxVQUFMLENBQWdCZ0MsSUFBaEI7QUFDRDtBQUNGOzs7c0RBRWtDckMsVyxFQUFhbUQsWSxFQUFjQyxXLEVBQWFuRCxZLEVBQWNvRCxPLEVBQVM7QUFDaEcsd0JBQWdCc0gsWUFBaEIsQ0FBNkIsS0FBS2hOLEtBQUwsQ0FBVzVDLGVBQXhDLEVBQXlEaUYsV0FBekQsRUFBc0VtRCxZQUF0RSxFQUFvRkMsV0FBcEYsRUFBaUduRCxZQUFqRyxFQUErR29ELE9BQS9HO0FBQ0EsaURBQTRCLEtBQUsxRixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsY0FBNUIsRUFBNEMsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURDLFdBQWpELEVBQThEbkQsWUFBOUQsRUFBNEVvRCxPQUE1RSxDQUE1QyxFQUFrSSxZQUFNLENBQUUsQ0FBMUk7QUFDRDs7O3VEQUVtQ3JELFcsRUFBYW1ELFksRUFBY0MsVyxFQUFhbkQsWSxFQUFjb0QsTyxFQUFTVSxLLEVBQU9DLFMsRUFBVztBQUNuSCx3QkFBZ0I0RyxhQUFoQixDQUE4QixLQUFLak4sS0FBTCxDQUFXNUMsZUFBekMsRUFBMERpRixXQUExRCxFQUF1RW1ELFlBQXZFLEVBQXFGQyxXQUFyRixFQUFrR25ELFlBQWxHLEVBQWdIb0QsT0FBaEgsRUFBeUhVLEtBQXpILEVBQWdJQyxTQUFoSTtBQUNBLGlEQUE0QixLQUFLckcsS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFGUjtBQUdaZ0osNkJBQXFCLEtBSFQ7QUFJWkMsNkJBQXFCLEtBSlQ7QUFLWkMsZ0NBQXdCO0FBTFosT0FBZDtBQU9BO0FBQ0EsVUFBSUMsZUFBZSw4QkFBZWhILFNBQWYsQ0FBbkI7QUFDQSxXQUFLdEcsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZUFBNUIsRUFBNkMsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURDLFdBQWpELEVBQThEbkQsWUFBOUQsRUFBNEVvRCxPQUE1RSxFQUFxRlUsS0FBckYsRUFBNEZpSCxZQUE1RixDQUE3QyxFQUF3SixZQUFNLENBQUUsQ0FBaEs7QUFDRDs7O3dEQUVvQ2hMLFcsRUFBYW1ELFksRUFBY2xELFksRUFBY29ELE8sRUFBUztBQUNyRix3QkFBZ0I0SCxjQUFoQixDQUErQixLQUFLdE4sS0FBTCxDQUFXNUMsZUFBMUMsRUFBMkRpRixXQUEzRCxFQUF3RW1ELFlBQXhFLEVBQXNGbEQsWUFBdEYsRUFBb0dvRCxPQUFwRztBQUNBLGlEQUE0QixLQUFLMUYsS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFGUjtBQUdaZ0osNkJBQXFCLEtBSFQ7QUFJWkMsNkJBQXFCLEtBSlQ7QUFLWkMsZ0NBQXdCO0FBTFosT0FBZDtBQU9BLFdBQUtyTixLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixnQkFBNUIsRUFBOEMsQ0FBQyxLQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM4QixXQUFELENBQXBCLEVBQW1DbUQsWUFBbkMsRUFBaURsRCxZQUFqRCxFQUErRG9ELE9BQS9ELENBQTlDLEVBQXVILFlBQU0sQ0FBRSxDQUEvSDtBQUNEOzs7NERBRXdDckQsVyxFQUFhbUQsWSxFQUFjbEQsWSxFQUFjb0QsTyxFQUFTVyxTLEVBQVc7QUFDcEcsd0JBQWdCa0gsa0JBQWhCLENBQW1DLEtBQUt2TixLQUFMLENBQVc1QyxlQUE5QyxFQUErRGlGLFdBQS9ELEVBQTRFbUQsWUFBNUUsRUFBMEZsRCxZQUExRixFQUF3R29ELE9BQXhHLEVBQWlIVyxTQUFqSDtBQUNBLGlEQUE0QixLQUFLckcsS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUE7QUFDQSxVQUFJbUosZUFBZSw4QkFBZWhILFNBQWYsQ0FBbkI7QUFDQSxXQUFLdEcsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsb0JBQTVCLEVBQWtELENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDOEIsV0FBRCxDQUFwQixFQUFtQ21ELFlBQW5DLEVBQWlEbEQsWUFBakQsRUFBK0RvRCxPQUEvRCxFQUF3RTJILFlBQXhFLENBQWxELEVBQXlJLFlBQU0sQ0FBRSxDQUFqSjtBQUNEOzs7Z0VBRTRDaEwsVyxFQUFhbUQsWSxFQUFjbEQsWSxFQUFja0wsVSxFQUFZQyxRLEVBQVVDLFUsRUFBWUMsUSxFQUFVO0FBQ2hJLHdCQUFnQkMsc0JBQWhCLENBQXVDLEtBQUs1TixLQUFMLENBQVc1QyxlQUFsRCxFQUFtRWlGLFdBQW5FLEVBQWdGbUQsWUFBaEYsRUFBOEZsRCxZQUE5RixFQUE0R2tMLFVBQTVHLEVBQXdIQyxRQUF4SCxFQUFrSUMsVUFBbEksRUFBOElDLFFBQTlJO0FBQ0EsaURBQTRCLEtBQUszTixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsd0JBQTVCLEVBQXNELENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDOEIsV0FBRCxDQUFwQixFQUFtQ21ELFlBQW5DLEVBQWlEbEQsWUFBakQsRUFBK0RrTCxVQUEvRCxFQUEyRUMsUUFBM0UsRUFBcUZDLFVBQXJGLEVBQWlHQyxRQUFqRyxDQUF0RCxFQUFrSyxZQUFNLENBQUUsQ0FBMUs7QUFDRDs7O3dEQUVvQ0UsZSxFQUFpQkMsZSxFQUFpQjtBQUNyRSx3QkFBZ0JDLGNBQWhCLENBQStCLEtBQUsvTixLQUFMLENBQVc1QyxlQUExQyxFQUEyRHlRLGVBQTNELEVBQTRFQyxlQUE1RTtBQUNBLGlEQUE0QixLQUFLOU4sS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUEsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0JzTixlQUFwQixFQUFxQ0MsZUFBckMsQ0FBOUMsRUFBcUcsWUFBTSxDQUFFLENBQTdHO0FBQ0Q7Ozt3REFFb0N0SSxZLEVBQWM7QUFDakQsd0JBQWdCd0ksY0FBaEIsQ0FBK0IsS0FBS2hPLEtBQUwsQ0FBVzVDLGVBQTFDLEVBQTJEb0ksWUFBM0Q7QUFDQSxpREFBNEIsS0FBS3hGLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsV0FBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtuQyxRQUFMLENBQWM7QUFDWnpFLHlCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBO0FBQ0EsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0JpRixZQUFwQixDQUE5QyxFQUFpRixZQUFNLENBQUUsQ0FBekY7QUFDRDs7OzJEQUV1Q0EsWSxFQUFjO0FBQ3BELHdCQUFnQnlJLGlCQUFoQixDQUFrQyxLQUFLak8sS0FBTCxDQUFXNUMsZUFBN0MsRUFBOERvSSxZQUE5RDtBQUNBLGlEQUE0QixLQUFLeEYsS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLaUQsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS25DLFFBQUwsQ0FBYztBQUNaekUseUJBQWlCLEtBQUs0QyxLQUFMLENBQVc1QyxlQURoQjtBQUVaQyw0QkFBb0IsS0FBS2dELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUEsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLG1CQUE1QixFQUFpRCxDQUFDLEtBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0JpRixZQUFwQixDQUFqRCxFQUFvRixZQUFNLENBQUUsQ0FBNUY7QUFDRDs7O3dEQUVvQ0EsWSxFQUFjO0FBQ2pELHdCQUFnQjBJLGNBQWhCLENBQStCLEtBQUtsTyxLQUFMLENBQVc1QyxlQUExQyxFQUEyRG9JLFlBQTNEO0FBQ0EsaURBQTRCLEtBQUt4RixLQUFMLENBQVc1QyxlQUF2QztBQUNBLFdBQUtpRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLbkMsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCc00sTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQmlGLFlBQXBCLENBQTlDLEVBQWlGLFlBQU0sQ0FBRSxDQUF6RjtBQUNEOzs7OERBRTBDbkQsVyxFQUFhbUQsWSxFQUFjbEQsWSxFQUFjbUUsTSxFQUFRQyxhLEVBQWVoQixPLEVBQVNVLEssRUFBTztBQUN6SCxVQUFJVCxZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxVQUFJdUksZ0JBQWdCLGtCQUFnQkMsb0JBQWhCLENBQXFDLEtBQUtwTyxLQUFMLENBQVc1QyxlQUFoRCxFQUFpRWlGLFdBQWpFLEVBQThFbUQsWUFBOUUsRUFBNEZsRCxZQUE1RixFQUEwR21FLE1BQTFHLEVBQWtIQyxhQUFsSCxFQUFpSWhCLE9BQWpJLEVBQTBJVSxLQUExSSxFQUFpSlQsU0FBakosQ0FBcEI7QUFDQTtBQUNBLFVBQUl0RSxPQUFPQyxJQUFQLENBQVk2TSxhQUFaLEVBQTJCdk8sTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkM7QUFDekMsbURBQTRCLEtBQUtJLEtBQUwsQ0FBVzVDLGVBQXZDO0FBQ0EsYUFBS2lELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLGFBQUtuQyxRQUFMLENBQWM7QUFDWnpFLDJCQUFpQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFEaEI7QUFFWkMsOEJBQW9CLEtBQUtnRCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsU0FBZDs7QUFLQTtBQUNBO0FBQ0EsWUFBSSxDQUFDLEtBQUttSyxjQUFWLEVBQTBCLEtBQUtBLGNBQUwsR0FBc0IsRUFBdEI7QUFDMUIsWUFBSUMsY0FBYyxDQUFDak0sV0FBRCxFQUFjbUQsWUFBZCxFQUE0QmxELFlBQTVCLEVBQTBDaU0sSUFBMUMsQ0FBK0MsR0FBL0MsQ0FBbEI7QUFDQSxhQUFLRixjQUFMLENBQW9CQyxXQUFwQixJQUFtQyxFQUFFak0sd0JBQUYsRUFBZW1ELDBCQUFmLEVBQTZCbEQsMEJBQTdCLEVBQTJDNkwsNEJBQTNDLEVBQTBEeEksb0JBQTFELEVBQW5DO0FBQ0EsYUFBSzlFLDJCQUFMO0FBQ0Q7QUFDRjs7O2tEQUU4QjtBQUM3QixVQUFJLENBQUMsS0FBS3dOLGNBQVYsRUFBMEIsT0FBTyxLQUFNLENBQWI7QUFDMUIsV0FBSyxJQUFJQyxXQUFULElBQXdCLEtBQUtELGNBQTdCLEVBQTZDO0FBQzNDLFlBQUksQ0FBQ0MsV0FBTCxFQUFrQjtBQUNsQixZQUFJLENBQUMsS0FBS0QsY0FBTCxDQUFvQkMsV0FBcEIsQ0FBTCxFQUF1QztBQUZJLG9DQUdpQyxLQUFLRCxjQUFMLENBQW9CQyxXQUFwQixDQUhqQztBQUFBLFlBR3JDak0sV0FIcUMseUJBR3JDQSxXQUhxQztBQUFBLFlBR3hCbUQsWUFId0IseUJBR3hCQSxZQUh3QjtBQUFBLFlBR1ZsRCxZQUhVLHlCQUdWQSxZQUhVO0FBQUEsWUFHSTZMLGFBSEoseUJBR0lBLGFBSEo7QUFBQSxZQUdtQnhJLFNBSG5CLHlCQUdtQkEsU0FIbkI7O0FBSzNDOztBQUNBLFlBQUk2SSx1QkFBdUIsOEJBQWVMLGFBQWYsQ0FBM0I7O0FBRUEsYUFBS3BPLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGVBQTVCLEVBQTZDLENBQUMsS0FBS2hOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDOEIsV0FBRCxDQUFwQixFQUFtQ21ELFlBQW5DLEVBQWlEbEQsWUFBakQsRUFBK0RrTSxvQkFBL0QsRUFBcUY3SSxTQUFyRixDQUE3QyxFQUE4SSxZQUFNLENBQUUsQ0FBdEo7QUFDQSxlQUFPLEtBQUswSSxjQUFMLENBQW9CQyxXQUFwQixDQUFQO0FBQ0Q7QUFDRjs7O3FDQUVpQjtBQUFBOztBQUNoQixVQUFJLEtBQUt0TyxLQUFMLENBQVc1RCxlQUFmLEVBQWdDO0FBQzlCLGFBQUt5RixRQUFMLENBQWM7QUFDWjVFLHdCQUFjLElBREY7QUFFWkQseUJBQWUsSUFGSDtBQUdaWiwyQkFBaUI7QUFITCxTQUFkLEVBSUcsWUFBTTtBQUNQLGlCQUFLaUUsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzBILEtBQXJDO0FBQ0QsU0FORDtBQU9ELE9BUkQsTUFRTztBQUNMLGFBQUs1TSxRQUFMLENBQWM7QUFDWjVFLHdCQUFjLElBREY7QUFFWkQseUJBQWUsSUFGSDtBQUdaWiwyQkFBaUI7QUFITCxTQUFkLEVBSUcsWUFBTTtBQUNQLGlCQUFLaUUsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzJILElBQXJDO0FBQ0QsU0FORDtBQU9EO0FBQ0Y7OztzQ0FFa0J0UixlLEVBQWlCQyxrQixFQUFvQjtBQUFBOztBQUN0RCxVQUFJRCxlQUFKLEVBQXFCO0FBQ25CLFlBQUlBLGdCQUFnQnVSLFFBQXBCLEVBQThCO0FBQzVCLGVBQUtDLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0J4UixnQkFBZ0J1UixRQUEvQyxFQUF5RCxJQUF6RCxFQUErRCxVQUFDblAsSUFBRCxFQUFVO0FBQ3ZFLGdCQUFJcVAsS0FBS3JQLEtBQUtvSixVQUFMLElBQW1CcEosS0FBS29KLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBNUI7QUFDQSxnQkFBSSxDQUFDaUcsRUFBTCxFQUFTLE9BQU8sS0FBTSxDQUFiO0FBQ1RyUCxpQkFBS2tKLFlBQUwsR0FBb0IsQ0FBQyxDQUFDLE9BQUsxSSxLQUFMLENBQVdwRCxhQUFYLENBQXlCaVMsRUFBekIsQ0FBdEI7QUFDQXJQLGlCQUFLa0ssWUFBTCxHQUFvQixDQUFDLENBQUMsT0FBSzFKLEtBQUwsQ0FBV25ELGFBQVgsQ0FBeUJnUyxFQUF6QixDQUF0QjtBQUNBclAsaUJBQUtzUCxVQUFMLEdBQWtCLENBQUMsQ0FBQyxPQUFLOU8sS0FBTCxDQUFXakQsV0FBWCxDQUF1QjhSLEVBQXZCLENBQXBCO0FBQ0QsV0FORDtBQU9BelIsMEJBQWdCdVIsUUFBaEIsQ0FBeUJqRixZQUF6QixHQUF3QyxJQUF4QztBQUNEO0FBQ0QsbURBQTRCdE0sZUFBNUI7QUFDQSxhQUFLeUUsUUFBTCxDQUFjLEVBQUV6RSxnQ0FBRixFQUFtQkMsc0NBQW5CLEVBQWQ7QUFDRDtBQUNGOzs7K0NBRXFDO0FBQUE7O0FBQUEsVUFBZmdGLFdBQWUsU0FBZkEsV0FBZTs7QUFDcEMsVUFBSSxLQUFLckMsS0FBTCxDQUFXNUMsZUFBWCxJQUE4QixLQUFLNEMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQnVSLFFBQTdELEVBQXVFO0FBQ3JFLFlBQUlJLFFBQVEsRUFBWjtBQUNBLGFBQUtILGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBSzVPLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ1UixRQUExRCxFQUFvRSxJQUFwRSxFQUEwRSxVQUFDblAsSUFBRCxFQUFPdUssTUFBUCxFQUFrQjtBQUMxRnZLLGVBQUt1SyxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxjQUFJOEUsS0FBS3JQLEtBQUtvSixVQUFMLElBQW1CcEosS0FBS29KLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBNUI7QUFDQSxjQUFJaUcsTUFBTUEsT0FBT3hNLFdBQWpCLEVBQThCME0sTUFBTTlNLElBQU4sQ0FBV3pDLElBQVg7QUFDL0IsU0FKRDtBQUtBdVAsY0FBTWhOLE9BQU4sQ0FBYyxVQUFDdkMsSUFBRCxFQUFVO0FBQ3RCLGlCQUFLd1AsVUFBTCxDQUFnQnhQLElBQWhCO0FBQ0EsaUJBQUt3SyxVQUFMLENBQWdCeEssSUFBaEI7QUFDQSxpQkFBS3lQLFlBQUwsQ0FBa0J6UCxJQUFsQjtBQUNELFNBSkQ7QUFLRDtBQUNGOzs7aURBRXVDO0FBQUE7O0FBQUEsVUFBZjZDLFdBQWUsU0FBZkEsV0FBZTs7QUFDdEMsVUFBSTBNLFFBQVEsS0FBS0csc0JBQUwsQ0FBNEI3TSxXQUE1QixDQUFaO0FBQ0EwTSxZQUFNaE4sT0FBTixDQUFjLFVBQUN2QyxJQUFELEVBQVU7QUFDdEIsZUFBSzJQLFlBQUwsQ0FBa0IzUCxJQUFsQjtBQUNBLGVBQUs0UCxZQUFMLENBQWtCNVAsSUFBbEI7QUFDQSxlQUFLNlAsV0FBTCxDQUFpQjdQLElBQWpCO0FBQ0QsT0FKRDtBQUtEOzs7MkNBRXVCNkMsVyxFQUFhO0FBQ25DLFVBQUkwTSxRQUFRLEVBQVo7QUFDQSxVQUFJLEtBQUsvTyxLQUFMLENBQVc1QyxlQUFYLElBQThCLEtBQUs0QyxLQUFMLENBQVc1QyxlQUFYLENBQTJCdVIsUUFBN0QsRUFBdUU7QUFDckUsYUFBS0MsYUFBTCxDQUFtQixHQUFuQixFQUF3QixDQUF4QixFQUEyQixFQUEzQixFQUErQixLQUFLNU8sS0FBTCxDQUFXNUMsZUFBWCxDQUEyQnVSLFFBQTFELEVBQW9FLElBQXBFLEVBQTBFLFVBQUNuUCxJQUFELEVBQVU7QUFDbEYsY0FBSXFQLEtBQUtyUCxLQUFLb0osVUFBTCxJQUFtQnBKLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsY0FBSWlHLE1BQU1BLE9BQU94TSxXQUFqQixFQUE4QjBNLE1BQU05TSxJQUFOLENBQVd6QyxJQUFYO0FBQy9CLFNBSEQ7QUFJRDtBQUNELGFBQU91UCxLQUFQO0FBQ0Q7Ozs4Q0FFMEIxTSxXLEVBQWFtRCxZLEVBQWNFLE8sRUFBUzRKLGEsRUFBZTtBQUFBOztBQUM1RSxVQUFJQyxpQkFBaUIsS0FBS0MscUJBQUwsQ0FBMkJuTixXQUEzQixFQUF3QyxLQUFLckMsS0FBTCxDQUFXNUMsZUFBbkQsQ0FBckI7QUFDQSxVQUFJcUksY0FBYzhKLGtCQUFrQkEsZUFBZTlKLFdBQW5EO0FBQ0EsVUFBSSxDQUFDQSxXQUFMLEVBQWtCO0FBQ2hCLGVBQU9qQyxRQUFRaU0sSUFBUixDQUFhLGVBQWVwTixXQUFmLEdBQTZCLGdGQUExQyxDQUFQO0FBQ0Q7O0FBRUQsVUFBSXFOLFVBQVUsS0FBSzFQLEtBQUwsQ0FBV21KLGlCQUFYLElBQWdDLEVBQTlDO0FBQ0F1RyxjQUFRM04sT0FBUixDQUFnQixVQUFDdUgsT0FBRCxFQUFhO0FBQzNCLFlBQUlBLFFBQVFHLFVBQVIsSUFBc0JILFFBQVFqSCxXQUFSLEtBQXdCQSxXQUE5QyxJQUE2RGlOLGNBQWNLLE9BQWQsQ0FBc0JyRyxRQUFRWSxRQUFSLENBQWlCL0csSUFBdkMsTUFBaUQsQ0FBQyxDQUFuSCxFQUFzSDtBQUNwSCxpQkFBS3lNLFdBQUwsQ0FBaUJ0RyxPQUFqQjtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFLdUcsYUFBTCxDQUFtQnZHLE9BQW5CO0FBQ0Q7QUFDRixPQU5EOztBQVFBLGlEQUE0QixLQUFLdEosS0FBTCxDQUFXNUMsZUFBdkM7QUFDQSxXQUFLeUUsUUFBTCxDQUFjO0FBQ1p6RSx5QkFBaUIsS0FBSzRDLEtBQUwsQ0FBVzVDLGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLZ0QsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1pwSCx1QkFBZSxpQkFBTzZMLEtBQVAsQ0FBYSxLQUFLM0ksS0FBTCxDQUFXbEQsYUFBeEIsQ0FISDtBQUlaK0wsb0JBQVlDLEtBQUtDLEdBQUw7QUFKQSxPQUFkO0FBTUQ7O0FBRUQ7Ozs7OzswQ0FJdUIxRyxXLEVBQWFqRixlLEVBQWlCO0FBQ25ELFVBQUksQ0FBQ0EsZUFBTCxFQUFzQixPQUFPLEtBQU0sQ0FBYjtBQUN0QixVQUFJLENBQUNBLGdCQUFnQnVSLFFBQXJCLEVBQStCLE9BQU8sS0FBTSxDQUFiO0FBQy9CLFVBQUlJLGNBQUo7QUFDQSxXQUFLSCxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCeFIsZ0JBQWdCdVIsUUFBL0MsRUFBeUQsSUFBekQsRUFBK0QsVUFBQ25QLElBQUQsRUFBVTtBQUN2RSxZQUFJcVAsS0FBS3JQLEtBQUtvSixVQUFMLElBQW1CcEosS0FBS29KLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBNUI7QUFDQSxZQUFJaUcsTUFBTUEsT0FBT3hNLFdBQWpCLEVBQThCME0sUUFBUXZQLElBQVI7QUFDL0IsT0FIRDtBQUlBLGFBQU91UCxLQUFQO0FBQ0Q7OztrQ0FFY2UsTyxFQUFTdkcsSyxFQUFPd0csUSxFQUFVcEIsUSxFQUFVNUUsTSxFQUFRaUcsUSxFQUFVO0FBQ25FQSxlQUFTckIsUUFBVCxFQUFtQjVFLE1BQW5CLEVBQTJCK0YsT0FBM0IsRUFBb0N2RyxLQUFwQyxFQUEyQ3dHLFFBQTNDLEVBQXFEcEIsU0FBU2pQLFFBQTlEO0FBQ0EsVUFBSWlQLFNBQVNqUCxRQUFiLEVBQXVCO0FBQ3JCLGFBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJZ1AsU0FBU2pQLFFBQVQsQ0FBa0JFLE1BQXRDLEVBQThDRCxHQUE5QyxFQUFtRDtBQUNqRCxjQUFJRSxRQUFROE8sU0FBU2pQLFFBQVQsQ0FBa0JDLENBQWxCLENBQVo7QUFDQSxjQUFJLENBQUNFLEtBQUQsSUFBVSxPQUFPQSxLQUFQLEtBQWlCLFFBQS9CLEVBQXlDO0FBQ3pDLGVBQUsrTyxhQUFMLENBQW1Ca0IsVUFBVSxHQUFWLEdBQWdCblEsQ0FBbkMsRUFBc0NBLENBQXRDLEVBQXlDZ1AsU0FBU2pQLFFBQWxELEVBQTRERyxLQUE1RCxFQUFtRThPLFFBQW5FLEVBQTZFcUIsUUFBN0U7QUFDRDtBQUNGO0FBQ0Y7OztxQ0FFaUJBLFEsRUFBVTtBQUMxQixVQUFNQyxlQUFlLEVBQXJCO0FBQ0EsVUFBTXRLLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLFVBQU1zSyxZQUFZdkssVUFBVXVCLElBQTVCO0FBQ0EsVUFBTWlKLGFBQWF4SyxVQUFVc0IsSUFBN0I7QUFDQSxVQUFNbUosZUFBZSwrQkFBZ0J6SyxVQUFVK0UsSUFBMUIsQ0FBckI7QUFDQSxVQUFJMkYsaUJBQWlCLENBQUMsQ0FBdEI7QUFDQSxXQUFLLElBQUkxUSxJQUFJdVEsU0FBYixFQUF3QnZRLElBQUl3USxVQUE1QixFQUF3Q3hRLEdBQXhDLEVBQTZDO0FBQzNDMFE7QUFDQSxZQUFJQyxjQUFjM1EsQ0FBbEI7QUFDQSxZQUFJNFEsa0JBQWtCRixpQkFBaUIxSyxVQUFVK0UsSUFBakQ7QUFDQSxZQUFJNkYsbUJBQW1CLEtBQUt2USxLQUFMLENBQVd4RSxjQUFsQyxFQUFrRDtBQUNoRCxjQUFJZ1YsWUFBWVIsU0FBU00sV0FBVCxFQUFzQkMsZUFBdEIsRUFBdUM1SyxVQUFVK0UsSUFBakQsRUFBdUQwRixZQUF2RCxDQUFoQjtBQUNBLGNBQUlJLFNBQUosRUFBZTtBQUNiUCx5QkFBYWhPLElBQWIsQ0FBa0J1TyxTQUFsQjtBQUNEO0FBQ0Y7QUFDRjtBQUNELGFBQU9QLFlBQVA7QUFDRDs7O29DQUVnQkQsUSxFQUFVO0FBQ3pCLFVBQU1DLGVBQWUsRUFBckI7QUFDQSxVQUFNdEssWUFBWSxLQUFLQyxZQUFMLEVBQWxCO0FBQ0EsVUFBTTZLLFlBQVkscUNBQXNCOUssVUFBVStFLElBQWhDLENBQWxCO0FBQ0EsVUFBTXdGLFlBQVl2SyxVQUFVdUIsSUFBNUI7QUFDQSxVQUFNd0osU0FBUy9LLFVBQVV1QixJQUFWLEdBQWlCdkIsVUFBVUcsSUFBMUM7QUFDQSxVQUFNNkssVUFBVWhMLFVBQVVzQixJQUFWLEdBQWlCdEIsVUFBVUcsSUFBM0M7QUFDQSxVQUFNOEssVUFBVUQsVUFBVUQsTUFBMUI7QUFDQSxVQUFNRyxjQUFjLHVCQUFRSCxNQUFSLEVBQWdCRCxTQUFoQixDQUFwQjtBQUNBLFVBQUlLLGNBQWNELFdBQWxCO0FBQ0EsVUFBTUUsWUFBWSxFQUFsQjtBQUNBLGFBQU9ELGVBQWVILE9BQXRCLEVBQStCO0FBQzdCSSxrQkFBVTlPLElBQVYsQ0FBZTZPLFdBQWY7QUFDQUEsdUJBQWVMLFNBQWY7QUFDRDtBQUNELFdBQUssSUFBSTlRLElBQUksQ0FBYixFQUFnQkEsSUFBSW9SLFVBQVVuUixNQUE5QixFQUFzQ0QsR0FBdEMsRUFBMkM7QUFDekMsWUFBSXFSLFdBQVdELFVBQVVwUixDQUFWLENBQWY7QUFDQSxZQUFJa0csZUFBZSx5Q0FBMEJtTCxRQUExQixFQUFvQ3JMLFVBQVVHLElBQTlDLENBQW5CO0FBQ0EsWUFBSW1MLGNBQWNqTCxLQUFLa0wsS0FBTCxDQUFXckwsZUFBZUYsVUFBVUcsSUFBekIsR0FBZ0NrTCxRQUEzQyxDQUFsQjtBQUNBO0FBQ0EsWUFBSSxDQUFDQyxXQUFMLEVBQWtCO0FBQ2hCLGNBQUlFLGNBQWN0TCxlQUFlcUssU0FBakM7QUFDQSxjQUFJa0IsV0FBV0QsY0FBY3hMLFVBQVUrRSxJQUF2QztBQUNBLGNBQUk4RixZQUFZUixTQUFTZ0IsUUFBVCxFQUFtQkksUUFBbkIsRUFBNkJSLE9BQTdCLENBQWhCO0FBQ0EsY0FBSUosU0FBSixFQUFlUCxhQUFhaE8sSUFBYixDQUFrQnVPLFNBQWxCO0FBQ2hCO0FBQ0Y7QUFDRCxhQUFPUCxZQUFQO0FBQ0Q7O0FBRUQ7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzttQ0FtQmdCO0FBQ2QsVUFBTXRLLFlBQVksRUFBbEI7QUFDQUEsZ0JBQVUwTCxHQUFWLEdBQWdCLEtBQUtyUixLQUFMLENBQVcvRCxlQUEzQixDQUZjLENBRTZCO0FBQzNDMEosZ0JBQVVHLElBQVYsR0FBaUIsT0FBT0gsVUFBVTBMLEdBQWxDLENBSGMsQ0FHd0I7QUFDdEMxTCxnQkFBVTJMLEtBQVYsR0FBa0IsNEJBQWEsS0FBS3RSLEtBQUwsQ0FBVzVDLGVBQXhCLEVBQXlDLEtBQUs0QyxLQUFMLENBQVc3RCxtQkFBcEQsQ0FBbEI7QUFDQXdKLGdCQUFVNEwsSUFBVixHQUFpQix5Q0FBMEI1TCxVQUFVMkwsS0FBcEMsRUFBMkMzTCxVQUFVRyxJQUFyRCxDQUFqQixDQUxjLENBSzhEO0FBQzVFSCxnQkFBVXVHLElBQVYsR0FBaUIsQ0FBakIsQ0FOYyxDQU1LO0FBQ25CdkcsZ0JBQVV1QixJQUFWLEdBQWtCLEtBQUtsSCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixJQUFrQzhKLFVBQVV1RyxJQUE3QyxHQUFxRHZHLFVBQVV1RyxJQUEvRCxHQUFzRSxLQUFLbE0sS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBdkYsQ0FQYyxDQU95RztBQUN2SDhKLGdCQUFVbUIsTUFBVixHQUFvQm5CLFVBQVU0TCxJQUFWLEdBQWlCLEVBQWxCLEdBQXdCLEVBQXhCLEdBQTZCNUwsVUFBVTRMLElBQTFELENBUmMsQ0FRaUQ7QUFDL0Q1TCxnQkFBVXFGLE9BQVYsR0FBb0IsS0FBS2hMLEtBQUwsQ0FBV2pFLFFBQVgsR0FBc0IsS0FBS2lFLEtBQUwsQ0FBV2pFLFFBQWpDLEdBQTRDNEosVUFBVW1CLE1BQVYsR0FBbUIsSUFBbkYsQ0FUYyxDQVMyRTtBQUN6Rm5CLGdCQUFVc0IsSUFBVixHQUFrQixLQUFLakgsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0M4SixVQUFVcUYsT0FBN0MsR0FBd0RyRixVQUFVcUYsT0FBbEUsR0FBNEUsS0FBS2hMLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQTdGLENBVmMsQ0FVK0c7QUFDN0g4SixnQkFBVTZMLElBQVYsR0FBaUJ4TCxLQUFLeUwsR0FBTCxDQUFTOUwsVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVdUIsSUFBcEMsQ0FBakIsQ0FYYyxDQVc2QztBQUMzRHZCLGdCQUFVK0UsSUFBVixHQUFpQjFFLEtBQUtrTCxLQUFMLENBQVcsS0FBS2xSLEtBQUwsQ0FBV3hFLGNBQVgsR0FBNEJtSyxVQUFVNkwsSUFBakQsQ0FBakIsQ0FaYyxDQVkwRDtBQUN4RSxVQUFJN0wsVUFBVStFLElBQVYsR0FBaUIsQ0FBckIsRUFBd0IvRSxVQUFVK0wsT0FBVixHQUFvQixDQUFwQjtBQUN4QixVQUFJL0wsVUFBVStFLElBQVYsR0FBaUIsS0FBSzFLLEtBQUwsQ0FBV3hFLGNBQWhDLEVBQWdEbUssVUFBVStFLElBQVYsR0FBaUIsS0FBSzFLLEtBQUwsQ0FBV3hFLGNBQTVCO0FBQ2hEbUssZ0JBQVVnTSxHQUFWLEdBQWdCM0wsS0FBS0MsS0FBTCxDQUFXTixVQUFVdUIsSUFBVixHQUFpQnZCLFVBQVUrRSxJQUF0QyxDQUFoQjtBQUNBL0UsZ0JBQVVpTSxHQUFWLEdBQWdCNUwsS0FBS0MsS0FBTCxDQUFXTixVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVUrRSxJQUF0QyxDQUFoQjtBQUNBL0UsZ0JBQVVrTSxNQUFWLEdBQW1CbE0sVUFBVXFGLE9BQVYsR0FBb0JyRixVQUFVK0UsSUFBakQsQ0FqQmMsQ0FpQndDO0FBQ3REL0UsZ0JBQVVtTSxHQUFWLEdBQWdCOUwsS0FBS0MsS0FBTCxDQUFXTixVQUFVdUIsSUFBVixHQUFpQnZCLFVBQVVHLElBQXRDLENBQWhCLENBbEJjLENBa0I4QztBQUM1REgsZ0JBQVVvTSxHQUFWLEdBQWdCL0wsS0FBS0MsS0FBTCxDQUFXTixVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVVHLElBQXRDLENBQWhCLENBbkJjLENBbUI4QztBQUM1REgsZ0JBQVVxTSxHQUFWLEdBQWdCLEtBQUtoUyxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEtBQUt5RSxLQUFMLENBQVd4RSxjQUF4RCxDQXBCYyxDQW9CeUQ7QUFDdkVtSyxnQkFBVWlHLE9BQVYsR0FBb0JqRyxVQUFVa00sTUFBVixHQUFtQmxNLFVBQVVxTSxHQUFqRCxDQXJCYyxDQXFCdUM7QUFDckRyTSxnQkFBVXNNLEdBQVYsR0FBaUJ0TSxVQUFVdUIsSUFBVixHQUFpQnZCLFVBQVUrRSxJQUE1QixHQUFvQy9FLFVBQVVpRyxPQUE5RCxDQXRCYyxDQXNCd0Q7QUFDdEVqRyxnQkFBVXVNLEdBQVYsR0FBaUJ2TSxVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVUrRSxJQUE1QixHQUFvQy9FLFVBQVVpRyxPQUE5RCxDQXZCYyxDQXVCd0Q7QUFDdEUsYUFBT2pHLFNBQVA7QUFDRDs7QUFFRDs7OzttQ0FDZ0I7QUFDZCxVQUFJLEtBQUszRixLQUFMLENBQVc1QyxlQUFYLElBQThCLEtBQUs0QyxLQUFMLENBQVc1QyxlQUFYLENBQTJCdVIsUUFBekQsSUFBcUUsS0FBSzNPLEtBQUwsQ0FBVzVDLGVBQVgsQ0FBMkJ1UixRQUEzQixDQUFvQ2pQLFFBQTdHLEVBQXVIO0FBQ3JILFlBQUl5UyxjQUFjLEtBQUtDLG1CQUFMLENBQXlCLEVBQXpCLEVBQTZCLEtBQUtwUyxLQUFMLENBQVc1QyxlQUFYLENBQTJCdVIsUUFBM0IsQ0FBb0NqUCxRQUFqRSxDQUFsQjtBQUNBLFlBQUkyUyxXQUFXLHFCQUFNRixXQUFOLENBQWY7QUFDQSxlQUFPRSxRQUFQO0FBQ0QsT0FKRCxNQUlPO0FBQ0wsZUFBTyxFQUFQO0FBQ0Q7QUFDRjs7O3dDQUVvQkMsSyxFQUFPNVMsUSxFQUFVO0FBQUE7O0FBQ3BDLGFBQU87QUFDTDRTLG9CQURLO0FBRUxDLGVBQU83UyxTQUFTOFMsTUFBVCxDQUFnQixVQUFDM1MsS0FBRDtBQUFBLGlCQUFXLE9BQU9BLEtBQVAsS0FBaUIsUUFBNUI7QUFBQSxTQUFoQixFQUFzRDRTLEdBQXRELENBQTBELFVBQUM1UyxLQUFELEVBQVc7QUFDMUUsaUJBQU8sUUFBS3VTLG1CQUFMLENBQXlCLEVBQXpCLEVBQTZCdlMsTUFBTUgsUUFBbkMsQ0FBUDtBQUNELFNBRk07QUFGRixPQUFQO0FBTUQ7OzsyQ0FFdUI7QUFBQTs7QUFDdEI7QUFDQSxVQUFJZ1QsZUFBZSxLQUFLQyxZQUFMLEdBQW9CQyxLQUFwQixDQUEwQixJQUExQixDQUFuQjtBQUNBLFVBQUlDLGdCQUFnQixFQUFwQjtBQUNBLFVBQUlDLHlCQUF5QixFQUE3QjtBQUNBLFVBQUlDLG9CQUFvQixDQUF4Qjs7QUFFQSxVQUFJLENBQUMsS0FBSy9TLEtBQUwsQ0FBVzVDLGVBQVosSUFBK0IsQ0FBQyxLQUFLNEMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQnVSLFFBQS9ELEVBQXlFLE9BQU9rRSxhQUFQOztBQUV6RSxXQUFLakUsYUFBTCxDQUFtQixHQUFuQixFQUF3QixDQUF4QixFQUEyQixFQUEzQixFQUErQixLQUFLNU8sS0FBTCxDQUFXNUMsZUFBWCxDQUEyQnVSLFFBQTFELEVBQW9FLElBQXBFLEVBQTBFLFVBQUNuUCxJQUFELEVBQU91SyxNQUFQLEVBQWUrRixPQUFmLEVBQXdCdkcsS0FBeEIsRUFBK0J3RyxRQUEvQixFQUE0QztBQUNwSCxZQUFNekksVUFBVSxRQUFLakgsVUFBTCxDQUFnQjJTLFNBQWhCLENBQTBCQyxpQ0FBMUIsQ0FBNER6VCxJQUE1RCxFQUFrRXVLLE1BQWxFLEVBQTBFLFFBQUsxSixVQUEvRSxFQUEyRixFQUEzRixDQUFoQjs7QUFFQSxZQUFNNlMsY0FBYzVMLFFBQVE0TCxXQUFSLEVBQXBCO0FBQ0EsWUFBTXpOLGNBQWM2QixRQUFRNkwsYUFBUixFQUFwQjtBQUNBLFlBQU05USxjQUFjaUYsUUFBUThMLGNBQVIsRUFBcEI7O0FBRUEsWUFBSSxDQUFDckosTUFBRCxJQUFZQSxPQUFPTCxZQUFQLEtBQXdCLFFBQUtySixVQUFMLENBQWdCMlMsU0FBaEIsQ0FBMEJLLGdCQUExQixDQUEyQzVOLFdBQTNDLEtBQTJEeU4sV0FBbkYsQ0FBaEIsRUFBa0g7QUFBRTtBQUNsSCxjQUFNSSxjQUFjWixhQUFhSyxpQkFBYixDQUFwQixDQURnSCxDQUM1RDtBQUNwRCxjQUFNUSxhQUFhLEVBQUUvVCxVQUFGLEVBQVF1SyxjQUFSLEVBQWdCK0YsZ0JBQWhCLEVBQXlCdkcsWUFBekIsRUFBZ0N3RyxrQkFBaEMsRUFBMEN1RCx3QkFBMUMsRUFBdURFLGNBQWMsRUFBckUsRUFBeUVoSyxXQUFXLElBQXBGLEVBQTBGbkgsYUFBYTdDLEtBQUtvSixVQUFMLENBQWdCLFVBQWhCLENBQXZHLEVBQW5CO0FBQ0FpSyx3QkFBYzVRLElBQWQsQ0FBbUJzUixVQUFuQjs7QUFFQSxjQUFJLENBQUNULHVCQUF1QnJOLFdBQXZCLENBQUwsRUFBMEM7QUFDeEMsZ0JBQU1nTyxXQUFXM0QsUUFBUWxRLE1BQVIsS0FBbUIsQ0FBcEMsQ0FEd0MsQ0FDRjtBQUN0Q2tULG1DQUF1QnJOLFdBQXZCLElBQXNDcEUsT0FBT3FTLE1BQVAsQ0FBY3BNLFFBQVFxTSx3QkFBUixDQUFpQ0YsUUFBakMsQ0FBZCxDQUF0QztBQUNEOztBQUVELGNBQU1HLHVCQUF1QixFQUE3Qjs7QUFFQSxlQUFLLElBQUlqVSxJQUFJLENBQWIsRUFBZ0JBLElBQUltVCx1QkFBdUJyTixXQUF2QixFQUFvQzdGLE1BQXhELEVBQWdFRCxHQUFoRSxFQUFxRTtBQUNuRSxnQkFBSWtVLDBCQUEwQmYsdUJBQXVCck4sV0FBdkIsRUFBb0M5RixDQUFwQyxDQUE5Qjs7QUFFQSxnQkFBSW1VLG9CQUFKOztBQUVFO0FBQ0YsZ0JBQUlELHdCQUF3QkUsT0FBNUIsRUFBcUM7QUFDbkMsa0JBQUlDLGdCQUFnQkgsd0JBQXdCRSxPQUF4QixDQUFnQ0UsTUFBcEQ7QUFDQSxrQkFBSUMsYUFBZ0I3UixXQUFoQixTQUErQjJSLGFBQW5DO0FBQ0Esa0JBQUlHLG1CQUFtQixLQUF2Qjs7QUFFRTtBQUNGLGtCQUFJLFFBQUtuVSxLQUFMLENBQVc5Qyx3QkFBWCxDQUFvQ2dYLFVBQXBDLENBQUosRUFBcUQ7QUFDbkQsb0JBQUksQ0FBQ04scUJBQXFCSSxhQUFyQixDQUFMLEVBQTBDO0FBQ3hDRyxxQ0FBbUIsSUFBbkI7QUFDQVAsdUNBQXFCSSxhQUFyQixJQUFzQyxJQUF0QztBQUNEOztBQUVERiw4QkFBYztBQUNaeE0sa0NBRFk7QUFFWjlILDRCQUZZO0FBR1p1SyxnQ0FIWTtBQUlaK0Ysa0NBSlk7QUFLWnZHLDhCQUxZO0FBTVp3RyxvQ0FOWTtBQU9aaUUsOENBUFk7QUFRWkUsd0NBUlk7QUFTWkUsbUNBQWlCLElBVEw7QUFVWkQsb0RBVlk7QUFXWmpLLDRCQUFVMkosdUJBWEU7QUFZWnBLLDhCQUFZLElBWkE7QUFhWnBIO0FBYlksaUJBQWQ7QUFlRCxlQXJCRCxNQXFCTztBQUNIO0FBQ0Ysb0JBQUlnUyxhQUFhLENBQUNSLHVCQUFELENBQWpCO0FBQ0U7QUFDRixvQkFBSVMsSUFBSTNVLENBQVIsQ0FKSyxDQUlLO0FBQ1YscUJBQUssSUFBSTRVLElBQUksQ0FBYixFQUFnQkEsSUFBSSxDQUFwQixFQUF1QkEsR0FBdkIsRUFBNEI7QUFDMUIsc0JBQUlDLFlBQVlELElBQUlELENBQXBCO0FBQ0Esc0JBQUlHLGlCQUFpQjNCLHVCQUF1QnJOLFdBQXZCLEVBQW9DK08sU0FBcEMsQ0FBckI7QUFDRTtBQUNGLHNCQUFJQyxrQkFBa0JBLGVBQWVWLE9BQWpDLElBQTRDVSxlQUFlVixPQUFmLENBQXVCRSxNQUF2QixLQUFrQ0QsYUFBbEYsRUFBaUc7QUFDL0ZLLCtCQUFXcFMsSUFBWCxDQUFnQndTLGNBQWhCO0FBQ0U7QUFDRjlVLHlCQUFLLENBQUw7QUFDRDtBQUNGOztBQUVEbVUsOEJBQWM7QUFDWnhNLGtDQURZO0FBRVo5SCw0QkFGWTtBQUdadUssZ0NBSFk7QUFJWitGLGtDQUpZO0FBS1p2Ryw4QkFMWTtBQU1ad0csb0NBTlk7QUFPWmlFLDhDQVBZO0FBUVpFLHdDQVJZO0FBU1pILDJCQUFTTSxVQVRHO0FBVVpLLCtCQUFhYix3QkFBd0JFLE9BQXhCLENBQWdDNVEsSUFWakM7QUFXWndSLDZCQUFXLElBWEM7QUFZWnRTO0FBWlksaUJBQWQ7QUFjRDtBQUNGLGFBMURELE1BMERPO0FBQ0x5Uiw0QkFBYztBQUNaeE0sZ0NBRFk7QUFFWjlILDBCQUZZO0FBR1p1Syw4QkFIWTtBQUlaK0YsZ0NBSlk7QUFLWnZHLDRCQUxZO0FBTVp3RyxrQ0FOWTtBQU9aN0YsMEJBQVUySix1QkFQRTtBQVFacEssNEJBQVksSUFSQTtBQVNacEg7QUFUWSxlQUFkO0FBV0Q7O0FBRURrUix1QkFBV0MsWUFBWCxDQUF3QnZSLElBQXhCLENBQTZCNlIsV0FBN0I7O0FBRUU7QUFDQTtBQUNGLGdCQUFJdFUsS0FBS2tLLFlBQVQsRUFBdUI7QUFDckJtSiw0QkFBYzVRLElBQWQsQ0FBbUI2UixXQUFuQjtBQUNEO0FBQ0Y7QUFDRjtBQUNEZjtBQUNELE9BM0dEOztBQTZHQUYsb0JBQWM5USxPQUFkLENBQXNCLFVBQUNvSSxJQUFELEVBQU9aLEtBQVAsRUFBY3FMLEtBQWQsRUFBd0I7QUFDNUN6SyxhQUFLMEssTUFBTCxHQUFjdEwsS0FBZDtBQUNBWSxhQUFLMkssTUFBTCxHQUFjRixLQUFkO0FBQ0QsT0FIRDs7QUFLQS9CLHNCQUFnQkEsY0FBY0wsTUFBZCxDQUFxQixpQkFBK0I7QUFBQSxZQUE1QmhULElBQTRCLFNBQTVCQSxJQUE0QjtBQUFBLFlBQXRCdUssTUFBc0IsU0FBdEJBLE1BQXNCO0FBQUEsWUFBZCtGLE9BQWMsU0FBZEEsT0FBYzs7QUFDaEU7QUFDRixZQUFJQSxRQUFROEMsS0FBUixDQUFjLEdBQWQsRUFBbUJoVCxNQUFuQixHQUE0QixDQUFoQyxFQUFtQyxPQUFPLEtBQVA7QUFDbkMsZUFBTyxDQUFDbUssTUFBRCxJQUFXQSxPQUFPTCxZQUF6QjtBQUNELE9BSmUsQ0FBaEI7O0FBTUEsYUFBT21KLGFBQVA7QUFDRDs7O3VEQUVtQ2xOLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYW5ELFksRUFBY2xGLGUsRUFBaUI0UyxRLEVBQVU7QUFDaEgsVUFBSStFLGlCQUFpQixFQUFyQjs7QUFFQSxVQUFJQyxhQUFhLDJCQUFpQkMsYUFBakIsQ0FBK0I1UyxXQUEvQixFQUE0QyxLQUFLckMsS0FBTCxDQUFXN0QsbUJBQXZELEVBQTRFbUcsWUFBNUUsRUFBMEZsRixlQUExRixDQUFqQjtBQUNBLFVBQUksQ0FBQzRYLFVBQUwsRUFBaUIsT0FBT0QsY0FBUDs7QUFFakIsVUFBSUcsZ0JBQWdCN1QsT0FBT0MsSUFBUCxDQUFZMFQsVUFBWixFQUF3QnZDLEdBQXhCLENBQTRCLFVBQUMwQyxXQUFEO0FBQUEsZUFBaUJDLFNBQVNELFdBQVQsRUFBc0IsRUFBdEIsQ0FBakI7QUFBQSxPQUE1QixFQUF3RUUsSUFBeEUsQ0FBNkUsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsZUFBVUQsSUFBSUMsQ0FBZDtBQUFBLE9BQTdFLENBQXBCO0FBQ0EsVUFBSUwsY0FBY3RWLE1BQWQsR0FBdUIsQ0FBM0IsRUFBOEIsT0FBT21WLGNBQVA7O0FBRTlCLFdBQUssSUFBSXBWLElBQUksQ0FBYixFQUFnQkEsSUFBSXVWLGNBQWN0VixNQUFsQyxFQUEwQ0QsR0FBMUMsRUFBK0M7QUFDN0MsWUFBSTZWLFNBQVNOLGNBQWN2VixDQUFkLENBQWI7QUFDQSxZQUFJOFYsTUFBTUQsTUFBTixDQUFKLEVBQW1CO0FBQ25CLFlBQUlFLFNBQVNSLGNBQWN2VixJQUFJLENBQWxCLENBQWI7QUFDQSxZQUFJZ1csU0FBU1QsY0FBY3ZWLElBQUksQ0FBbEIsQ0FBYjs7QUFFQSxZQUFJNlYsU0FBUzdQLFVBQVVvTSxHQUF2QixFQUE0QixTQU5pQixDQU1SO0FBQ3JDLFlBQUl5RCxTQUFTN1AsVUFBVW1NLEdBQW5CLElBQTBCNkQsV0FBV0MsU0FBckMsSUFBa0RELFNBQVNoUSxVQUFVbU0sR0FBekUsRUFBOEUsU0FQakMsQ0FPMEM7O0FBRXZGLFlBQUkrRCxhQUFKO0FBQ0EsWUFBSUMsYUFBSjtBQUNBLFlBQUlwUixhQUFKOztBQUVBLFlBQUlnUixXQUFXRSxTQUFYLElBQXdCLENBQUNILE1BQU1DLE1BQU4sQ0FBN0IsRUFBNEM7QUFDMUNHLGlCQUFPO0FBQ0xFLGdCQUFJTCxNQURDO0FBRUx2UyxrQkFBTWIsWUFGRDtBQUdMaUgsbUJBQU81SixJQUFJLENBSE47QUFJTHFXLG1CQUFPLHlDQUEwQk4sTUFBMUIsRUFBa0MvUCxVQUFVRyxJQUE1QyxDQUpGO0FBS0xtUSxtQkFBT2pCLFdBQVdVLE1BQVgsRUFBbUJPLEtBTHJCO0FBTUxDLG1CQUFPbEIsV0FBV1UsTUFBWCxFQUFtQlE7QUFOckIsV0FBUDtBQVFEOztBQUVESixlQUFPO0FBQ0xDLGNBQUlQLE1BREM7QUFFTHJTLGdCQUFNYixZQUZEO0FBR0xpSCxpQkFBTzVKLENBSEY7QUFJTHFXLGlCQUFPLHlDQUEwQlIsTUFBMUIsRUFBa0M3UCxVQUFVRyxJQUE1QyxDQUpGO0FBS0xtUSxpQkFBT2pCLFdBQVdRLE1BQVgsRUFBbUJTLEtBTHJCO0FBTUxDLGlCQUFPbEIsV0FBV1EsTUFBWCxFQUFtQlU7QUFOckIsU0FBUDs7QUFTQSxZQUFJUCxXQUFXQyxTQUFYLElBQXdCLENBQUNILE1BQU1FLE1BQU4sQ0FBN0IsRUFBNEM7QUFDMUNqUixpQkFBTztBQUNMcVIsZ0JBQUlKLE1BREM7QUFFTHhTLGtCQUFNYixZQUZEO0FBR0xpSCxtQkFBTzVKLElBQUksQ0FITjtBQUlMcVcsbUJBQU8seUNBQTBCTCxNQUExQixFQUFrQ2hRLFVBQVVHLElBQTVDLENBSkY7QUFLTG1RLG1CQUFPakIsV0FBV1csTUFBWCxFQUFtQk0sS0FMckI7QUFNTEMsbUJBQU9sQixXQUFXVyxNQUFYLEVBQW1CTztBQU5yQixXQUFQO0FBUUQ7O0FBRUQsWUFBSUMsZUFBZSxDQUFDTCxLQUFLRSxLQUFMLEdBQWFyUSxVQUFVdUIsSUFBeEIsSUFBZ0N2QixVQUFVK0UsSUFBN0Q7QUFDQSxZQUFJMEwsc0JBQUo7QUFDQSxZQUFJMVIsSUFBSixFQUFVMFIsZ0JBQWdCLENBQUMxUixLQUFLc1IsS0FBTCxHQUFhclEsVUFBVXVCLElBQXhCLElBQWdDdkIsVUFBVStFLElBQTFEOztBQUVWLFlBQUkyTCxnQkFBZ0JyRyxTQUFTNkYsSUFBVCxFQUFlQyxJQUFmLEVBQXFCcFIsSUFBckIsRUFBMkJ5UixZQUEzQixFQUF5Q0MsYUFBekMsRUFBd0R6VyxDQUF4RCxDQUFwQjtBQUNBLFlBQUkwVyxhQUFKLEVBQW1CdEIsZUFBZTlTLElBQWYsQ0FBb0JvVSxhQUFwQjtBQUNwQjs7QUFFRCxhQUFPdEIsY0FBUDtBQUNEOzs7d0RBRW9DcFAsUyxFQUFXdEQsVyxFQUFhb0QsVyxFQUFhK04sWSxFQUFjcFcsZSxFQUFpQjRTLFEsRUFBVTtBQUFBOztBQUNqSCxVQUFJK0UsaUJBQWlCLEVBQXJCOztBQUVBdkIsbUJBQWF6UixPQUFiLENBQXFCLFVBQUMrUixXQUFELEVBQWlCO0FBQ3BDLFlBQUlBLFlBQVlhLFNBQWhCLEVBQTJCO0FBQ3pCYixzQkFBWUMsT0FBWixDQUFvQmhTLE9BQXBCLENBQTRCLFVBQUN1VSxrQkFBRCxFQUF3QjtBQUNsRCxnQkFBSWhVLGVBQWVnVSxtQkFBbUJuVCxJQUF0QztBQUNBLGdCQUFJb1Qsa0JBQWtCLFFBQUtDLGtDQUFMLENBQXdDN1EsU0FBeEMsRUFBbUR0RCxXQUFuRCxFQUFnRW9ELFdBQWhFLEVBQTZFbkQsWUFBN0UsRUFBMkZsRixlQUEzRixFQUE0RzRTLFFBQTVHLENBQXRCO0FBQ0EsZ0JBQUl1RyxlQUFKLEVBQXFCO0FBQ25CeEIsK0JBQWlCQSxlQUFlMEIsTUFBZixDQUFzQkYsZUFBdEIsQ0FBakI7QUFDRDtBQUNGLFdBTkQ7QUFPRCxTQVJELE1BUU87QUFDTCxjQUFJalUsZUFBZXdSLFlBQVk1SixRQUFaLENBQXFCL0csSUFBeEM7QUFDQSxjQUFJb1Qsa0JBQWtCLFFBQUtDLGtDQUFMLENBQXdDN1EsU0FBeEMsRUFBbUR0RCxXQUFuRCxFQUFnRW9ELFdBQWhFLEVBQTZFbkQsWUFBN0UsRUFBMkZsRixlQUEzRixFQUE0RzRTLFFBQTVHLENBQXRCO0FBQ0EsY0FBSXVHLGVBQUosRUFBcUI7QUFDbkJ4Qiw2QkFBaUJBLGVBQWUwQixNQUFmLENBQXNCRixlQUF0QixDQUFqQjtBQUNEO0FBQ0Y7QUFDRixPQWhCRDs7QUFrQkEsYUFBT3hCLGNBQVA7QUFDRDs7OzJDQUV1QjtBQUN0QixXQUFLbFQsUUFBTCxDQUFjLEVBQUVsRixzQkFBc0IsS0FBeEIsRUFBZDtBQUNEOztBQUVEOzs7O0FBSUE7Ozs7cURBRWtDO0FBQUE7O0FBQ2hDLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsaUJBQU87QUFDTCtaLHNCQUFVLFVBREw7QUFFTGpQLGlCQUFLO0FBRkEsV0FEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLRTtBQUNFLGdDQUFzQixLQUFLa1Asb0JBQUwsQ0FBMEI1VixJQUExQixDQUErQixJQUEvQixDQUR4QjtBQUVFLHNDQUE0QixLQUFLaEIsS0FBTCxDQUFXUyxVQUFYLENBQXNCMkMsSUFGcEQ7QUFHRSx5QkFBZTlCLE9BQU9DLElBQVAsQ0FBYSxLQUFLdEIsS0FBTCxDQUFXNUMsZUFBWixHQUErQixLQUFLNEMsS0FBTCxDQUFXNUMsZUFBWCxDQUEyQndaLFNBQTFELEdBQXNFLEVBQWxGLENBSGpCO0FBSUUsZ0NBQXNCLEtBQUs1VyxLQUFMLENBQVc3RCxtQkFKbkM7QUFLRSx3QkFBYyxLQUFLNkQsS0FBTCxDQUFXbEUsWUFMM0I7QUFNRSxxQkFBVyxLQUFLa0UsS0FBTCxDQUFXNUQsZUFOeEI7QUFPRSx5QkFBZSxLQUFLNEQsS0FBTCxDQUFXM0QsbUJBUDVCO0FBUUUscUJBQVcsS0FBS3VKLFlBQUwsR0FBb0JrQixNQVJqQztBQVNFLDhCQUFvQiw0QkFBQytHLGVBQUQsRUFBa0JDLGVBQWxCLEVBQXNDO0FBQ3hELG9CQUFLK0ksbUNBQUwsQ0FBeUNoSixlQUF6QyxFQUEwREMsZUFBMUQ7QUFDRCxXQVhIO0FBWUUsMEJBQWdCLHdCQUFDdEksWUFBRCxFQUFrQjtBQUNoQyxvQkFBS3NSLG1DQUFMLENBQXlDdFIsWUFBekM7QUFDRCxXQWRIO0FBZUUsNkJBQW1CLDJCQUFDQSxZQUFELEVBQWtCO0FBQ25DLG9CQUFLdVIsc0NBQUwsQ0FBNEN2UixZQUE1QztBQUNELFdBakJIO0FBa0JFLDBCQUFnQix3QkFBQ0EsWUFBRCxFQUFrQjtBQUNoQyxvQkFBS3dSLG1DQUFMLENBQXlDeFIsWUFBekM7QUFDRCxXQXBCSDtBQXFCRSwwQkFBZ0Isd0JBQUNySixtQkFBRCxFQUF5QjtBQUN2QztBQUNBLG9CQUFLa0UsVUFBTCxDQUFnQjRXLGVBQWhCLENBQWdDOWEsbUJBQWhDLEVBQXFELEVBQUVnSSxNQUFNLFVBQVIsRUFBckQsRUFBMkUsWUFBTSxDQUFFLENBQW5GO0FBQ0Esb0JBQUtwRSxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixpQkFBNUIsRUFBK0MsQ0FBQyxRQUFLaE4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CcEUsbUJBQXBCLENBQS9DLEVBQXlGLFlBQU0sQ0FBRSxDQUFqRztBQUNBLG9CQUFLMEYsUUFBTCxDQUFjLEVBQUUxRix3Q0FBRixFQUFkO0FBQ0QsV0ExQkg7QUEyQkUsNEJBQWtCLDRCQUFNO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGdCQUFJd0osWUFBWSxRQUFLQyxZQUFMLEVBQWhCO0FBQ0Esb0JBQUt2RixVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDQyxZQUFyQyxDQUFrRHJCLFVBQVV1RyxJQUE1RDtBQUNBLG9CQUFLckssUUFBTCxDQUFjLEVBQUV6RixpQkFBaUIsS0FBbkIsRUFBMEJOLGNBQWM2SixVQUFVdUcsSUFBbEQsRUFBZDtBQUNELFdBbENIO0FBbUNFLCtCQUFxQiwrQkFBTTtBQUN6QixnQkFBSXZHLFlBQVksUUFBS0MsWUFBTCxFQUFoQjtBQUNBLG9CQUFLL0QsUUFBTCxDQUFjLEVBQUV6RixpQkFBaUIsS0FBbkIsRUFBMEJOLGNBQWM2SixVQUFVbUIsTUFBbEQsRUFBZDtBQUNBLG9CQUFLekcsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQ0MsWUFBckMsQ0FBa0RyQixVQUFVbUIsTUFBNUQ7QUFDRCxXQXZDSDtBQXdDRSw2QkFBbUIsNkJBQU07QUFDdkIsb0JBQUtvQixjQUFMO0FBQ0QsV0ExQ0g7QUEyQ0UsK0JBQXFCLDZCQUFDZ1AsVUFBRCxFQUFnQjtBQUNuQyxnQkFBSTdhLHNCQUFzQjhhLE9BQU9ELFdBQVdyUyxNQUFYLENBQWtCb1IsS0FBbEIsSUFBMkIsQ0FBbEMsQ0FBMUI7QUFDQSxvQkFBS3BVLFFBQUwsQ0FBYyxFQUFFeEYsd0NBQUYsRUFBZDtBQUNELFdBOUNIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGLE9BREY7QUF1REQ7OzsyQ0FFdUIrYSxTLEVBQVc7QUFDakMsVUFBTXpSLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLGFBQU8sMENBQTJCd1IsVUFBVTVYLElBQXJDLEVBQTJDbUcsU0FBM0MsRUFBc0QsS0FBSzNGLEtBQUwsQ0FBVzVDLGVBQWpFLEVBQWtGLEtBQUs0QyxLQUFMLENBQVczQyxrQkFBN0YsRUFBaUgsS0FBS2dELFVBQXRILEVBQWtJLEtBQUtnWCxzQkFBTCxDQUE0QjFSLFNBQTVCLENBQWxJLEVBQTBLLEtBQUszRixLQUFMLENBQVc3RCxtQkFBckwsRUFBME1pYixVQUFVbE4sUUFBcE4sQ0FBUDtBQUNEOzs7MkNBRXVCdkUsUyxFQUFXO0FBQ2pDLGFBQU9LLEtBQUtDLEtBQUwsQ0FBVyxLQUFLakcsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVVHLElBQS9DLENBQVA7QUFDRDs7OzREQUV3Q3FFLEksRUFBTTtBQUFBOztBQUM3QyxVQUFJOUgsY0FBYzhILEtBQUszSyxJQUFMLENBQVVvSixVQUFWLENBQXFCLFVBQXJCLENBQWxCO0FBQ0EsVUFBSW5ELGNBQWUsUUFBTzBFLEtBQUszSyxJQUFMLENBQVVpRyxXQUFqQixNQUFpQyxRQUFsQyxHQUE4QyxLQUE5QyxHQUFzRDBFLEtBQUszSyxJQUFMLENBQVVpRyxXQUFsRjtBQUNBLFVBQUlFLFlBQVksS0FBS0MsWUFBTCxFQUFoQjs7QUFFQTtBQUNBO0FBQ0EsYUFDRTtBQUFBO0FBQUEsVUFBSyxXQUFVLHdCQUFmLEVBQXdDLE9BQU8sRUFBRThRLFVBQVUsVUFBWixFQUF3QmhQLE1BQU0sS0FBSzFILEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsQ0FBM0QsRUFBOEQrYixRQUFRLEVBQXRFLEVBQTBFQyxPQUFPLE1BQWpGLEVBQXlGQyxVQUFVLFFBQW5HLEVBQS9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGFBQUtDLG1DQUFMLENBQXlDOVIsU0FBekMsRUFBb0R0RCxXQUFwRCxFQUFpRW9ELFdBQWpFLEVBQThFMEUsS0FBS3FKLFlBQW5GLEVBQWlHLEtBQUt4VCxLQUFMLENBQVc1QyxlQUE1RyxFQUE2SCxVQUFDeVksSUFBRCxFQUFPQyxJQUFQLEVBQWFwUixJQUFiLEVBQW1CeVIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEN00sS0FBaEQsRUFBMEQ7QUFDdEwsY0FBSW1PLGdCQUFnQixFQUFwQjs7QUFFQSxjQUFJNUIsS0FBS0ksS0FBVCxFQUFnQjtBQUNkd0IsMEJBQWN6VixJQUFkLENBQW1CLFFBQUswVixvQkFBTCxDQUEwQmhTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRHFRLEtBQUszUyxJQUFwRSxFQUEwRSxRQUFLbkQsS0FBTCxDQUFXNUMsZUFBckYsRUFBc0d5WSxJQUF0RyxFQUE0R0MsSUFBNUcsRUFBa0hwUixJQUFsSCxFQUF3SHlSLFlBQXhILEVBQXNJQyxhQUF0SSxFQUFxSixDQUFySixFQUF3SixFQUFFd0IsV0FBVyxJQUFiLEVBQW1CQyxrQkFBa0IsSUFBckMsRUFBeEosQ0FBbkI7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSW5ULElBQUosRUFBVTtBQUNSZ1QsNEJBQWN6VixJQUFkLENBQW1CLFFBQUs2VixrQkFBTCxDQUF3Qm5TLFNBQXhCLEVBQW1DdEQsV0FBbkMsRUFBZ0RvRCxXQUFoRCxFQUE2RHFRLEtBQUszUyxJQUFsRSxFQUF3RSxRQUFLbkQsS0FBTCxDQUFXNUMsZUFBbkYsRUFBb0d5WSxJQUFwRyxFQUEwR0MsSUFBMUcsRUFBZ0hwUixJQUFoSCxFQUFzSHlSLFlBQXRILEVBQW9JQyxhQUFwSSxFQUFtSixDQUFuSixFQUFzSixFQUFFd0IsV0FBVyxJQUFiLEVBQW1CQyxrQkFBa0IsSUFBckMsRUFBdEosQ0FBbkI7QUFDRDtBQUNELGdCQUFJLENBQUNoQyxJQUFELElBQVMsQ0FBQ0EsS0FBS0ssS0FBbkIsRUFBMEI7QUFDeEJ3Qiw0QkFBY3pWLElBQWQsQ0FBbUIsUUFBSzhWLGtCQUFMLENBQXdCcFMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEcVEsS0FBSzNTLElBQWxFLEVBQXdFLFFBQUtuRCxLQUFMLENBQVc1QyxlQUFuRixFQUFvR3lZLElBQXBHLEVBQTBHQyxJQUExRyxFQUFnSHBSLElBQWhILEVBQXNIeVIsWUFBdEgsRUFBb0lDLGFBQXBJLEVBQW1KLENBQW5KLEVBQXNKLEVBQUV3QixXQUFXLElBQWIsRUFBbUJDLGtCQUFrQixJQUFyQyxFQUF0SixDQUFuQjtBQUNEO0FBQ0Y7O0FBRUQsaUJBQU9ILGFBQVA7QUFDRCxTQWZBO0FBREgsT0FERjtBQW9CRDs7O21EQUUrQi9SLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYW5ELFksRUFBY2xGLGUsRUFBaUJ5WSxJLEVBQU1DLEksRUFBTXBSLEksRUFBTXlSLFksRUFBYzVNLEssRUFBTzlDLE0sRUFBUXVSLE8sRUFBUztBQUFBOztBQUMxSixhQUNFO0FBQUE7QUFDRTs7QUEwSEE7QUEzSEY7QUFBQSxVQUVFLEtBQVExVixZQUFSLFNBQXdCaUgsS0FGMUI7QUFHRSxnQkFBSyxHQUhQO0FBSUUsbUJBQVMsaUJBQUMwTyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsb0JBQUtDLHFCQUFMLENBQTJCLEVBQUU5Vix3QkFBRixFQUFlQywwQkFBZixFQUEzQjtBQUNBLGdCQUFJbkYsa0JBQWtCLFFBQUs2QyxLQUFMLENBQVc3QyxlQUFqQztBQUNBQSw4QkFBa0IsQ0FBQ2tGLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUN3VCxLQUFLdk0sS0FBL0MsQ0FBbEI7QUFDQSxvQkFBSzFILFFBQUwsQ0FBYztBQUNaN0UsNkJBQWUsSUFESDtBQUVaQyw0QkFBYyxJQUZGO0FBR1ppUSxtQ0FBcUJnTCxTQUFTRSxDQUhsQjtBQUlaakwsbUNBQXFCMkksS0FBS0MsRUFKZDtBQUtaNVk7QUFMWSxhQUFkO0FBT0QsV0FmSDtBQWdCRSxrQkFBUSxnQkFBQzhhLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixvQkFBS0csdUJBQUwsQ0FBNkIsRUFBRWhXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTdCO0FBQ0Esb0JBQUtULFFBQUwsQ0FBYyxFQUFFcUwscUJBQXFCLEtBQXZCLEVBQThCQyxxQkFBcUIsS0FBbkQsRUFBMERoUSxpQkFBaUIsRUFBM0UsRUFBZDtBQUNELFdBbkJIO0FBb0JFLGtCQUFRLGlCQUFPMkQsUUFBUCxDQUFnQixVQUFDbVgsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9DLGdCQUFJLENBQUMsUUFBS2xZLEtBQUwsQ0FBV29OLHNCQUFoQixFQUF3QztBQUN0QyxrQkFBSWtMLFdBQVdKLFNBQVNLLEtBQVQsR0FBaUIsUUFBS3ZZLEtBQUwsQ0FBV2tOLG1CQUEzQztBQUNBLGtCQUFJc0wsV0FBWUYsV0FBVzNTLFVBQVUrRSxJQUF0QixHQUE4Qi9FLFVBQVVHLElBQXZEO0FBQ0Esa0JBQUkyUyxTQUFTelMsS0FBS0MsS0FBTCxDQUFXLFFBQUtqRyxLQUFMLENBQVdtTixtQkFBWCxHQUFpQ3FMLFFBQTVDLENBQWI7QUFDQSxzQkFBSzdSLHlDQUFMLENBQStDdEUsV0FBL0MsRUFBNEQsUUFBS3JDLEtBQUwsQ0FBVzdELG1CQUF2RSxFQUE0Rm1HLFlBQTVGLEVBQTBHbUUsTUFBMUcsRUFBa0hxUCxLQUFLdk0sS0FBdkgsRUFBOEh1TSxLQUFLQyxFQUFuSSxFQUF1STBDLE1BQXZJO0FBQ0Q7QUFDRixXQVBPLEVBT0xuWixhQVBLLENBcEJWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTRCRTtBQUNFLHlCQUFlLHVCQUFDb1osWUFBRCxFQUFrQjtBQUMvQkEseUJBQWFDLGVBQWI7QUFDQSxnQkFBSUMsZUFBZUYsYUFBYTdRLFdBQWIsQ0FBeUJnUixPQUE1QztBQUNBLGdCQUFJQyxlQUFlRixlQUFlekMsWUFBZixHQUE4Qm5RLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWdNLEdBQVYsR0FBZ0JoTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxnQkFBSXFPLFlBQVlqRCxLQUFLQyxFQUFyQjtBQUNBLGdCQUFJaUQsZUFBZWxELEtBQUtFLEtBQXhCO0FBQ0Esb0JBQUs5VixPQUFMLENBQWErWSxJQUFiLENBQWtCO0FBQ2hCN1Qsb0JBQU0sVUFEVTtBQUVoQk8sa0NBRmdCO0FBR2hCdVQscUJBQU9SLGFBQWE3USxXQUhKO0FBSWhCeEYsc0NBSmdCO0FBS2hCbUQsNEJBQWMsUUFBS3hGLEtBQUwsQ0FBVzdELG1CQUxUO0FBTWhCbUcsd0NBTmdCO0FBT2hCb0UsNkJBQWVvUCxLQUFLdk0sS0FQSjtBQVFoQjdELHVCQUFTb1EsS0FBS0MsRUFSRTtBQVNoQm9ELDBCQUFZckQsS0FBS0UsS0FURDtBQVVoQjVQLHFCQUFPLElBVlM7QUFXaEJnVCx3QkFBVSxJQVhNO0FBWWhCbEQscUJBQU8sSUFaUztBQWFoQjBDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQnRUO0FBakJnQixhQUFsQjtBQW1CRCxXQTFCSDtBQTJCRSxpQkFBTztBQUNMNFQscUJBQVMsY0FESjtBQUVMM0Msc0JBQVUsVUFGTDtBQUdMalAsaUJBQUssQ0FIQTtBQUlMQyxrQkFBTXlPLFlBSkQ7QUFLTG9CLG1CQUFPLEVBTEY7QUFNTEQsb0JBQVEsRUFOSDtBQU9MZ0Msb0JBQVEsSUFQSDtBQVFMQyxvQkFBUTtBQVJILFdBM0JUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTVCRixPQURGO0FBb0VEOzs7dUNBRW1CNVQsUyxFQUFXdEQsVyxFQUFhb0QsVyxFQUFhbkQsWSxFQUFjbEYsZSxFQUFpQnlZLEksRUFBTUMsSSxFQUFNcFIsSSxFQUFNeVIsWSxFQUFjQyxhLEVBQWU3TSxLLEVBQU95TyxPLEVBQVM7QUFDckosVUFBSXdCLFdBQVcsS0FBZjtBQUNBLFdBQUt4WixLQUFMLENBQVc3QyxlQUFYLENBQTJCNEUsT0FBM0IsQ0FBbUMsVUFBQ3VTLENBQUQsRUFBTztBQUN4QyxZQUFJQSxNQUFNalMsY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5Q3dULEtBQUt2TSxLQUF4RCxFQUErRGlRLFdBQVcsSUFBWDtBQUNoRSxPQUZEOztBQUlBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZUFBUWxYLFlBQVIsU0FBd0JpSCxLQUF4QixTQUFpQ3VNLEtBQUtDLEVBRHhDO0FBRUUsaUJBQU87QUFDTFcsc0JBQVUsVUFETDtBQUVMaFAsa0JBQU15TyxZQUZEO0FBR0xvQixtQkFBTyxDQUhGO0FBSUxELG9CQUFRLEVBSkg7QUFLTDdQLGlCQUFLLENBQUMsQ0FMRDtBQU1MZ1MsdUJBQVcsWUFOTjtBQU9MQyx3QkFBWSxzQkFQUDtBQVFMSixvQkFBUTtBQVJILFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsa0JBRFo7QUFFRSxtQkFBTztBQUNMNUMsd0JBQVUsVUFETDtBQUVMalAsbUJBQUssQ0FGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUw2UixzQkFBU3ZCLFFBQVFKLFNBQVQsR0FBc0IsU0FBdEIsR0FBa0M7QUFKckMsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRSxpRUFBYSxPQUFRSSxRQUFRSCxnQkFBVCxHQUNoQix5QkFBUThCLElBRFEsR0FFZjNCLFFBQVE0QixpQkFBVCxHQUNJLHlCQUFRQyxTQURaLEdBRUtMLFFBQUQsR0FDRSx5QkFBUU0sYUFEVixHQUVFLHlCQUFRQyxJQU5sQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFSRjtBQVpGLE9BREY7QUFnQ0Q7Ozt5Q0FFcUJwVSxTLEVBQVd0RCxXLEVBQWFvRCxXLEVBQWFuRCxZLEVBQWNsRixlLEVBQWlCeVksSSxFQUFNQyxJLEVBQU1wUixJLEVBQU15UixZLEVBQWNDLGEsRUFBZTdNLEssRUFBT3lPLE8sRUFBUztBQUFBOztBQUN2SixVQUFNZ0MsWUFBZTNYLFdBQWYsU0FBOEJDLFlBQTlCLFNBQThDaUgsS0FBOUMsU0FBdUR1TSxLQUFLQyxFQUFsRTtBQUNBLFVBQU1HLFFBQVFKLEtBQUtJLEtBQUwsQ0FBVytELE1BQVgsQ0FBa0IsQ0FBbEIsRUFBcUJDLFdBQXJCLEtBQXFDcEUsS0FBS0ksS0FBTCxDQUFXaUUsS0FBWCxDQUFpQixDQUFqQixDQUFuRDtBQUNBLFVBQU1DLGlCQUFpQmxFLE1BQU1tRSxRQUFOLENBQWUsTUFBZixLQUEwQm5FLE1BQU1tRSxRQUFOLENBQWUsUUFBZixDQUExQixJQUFzRG5FLE1BQU1tRSxRQUFOLENBQWUsU0FBZixDQUE3RTtBQUNBLFVBQU1DLFdBQVdoZCxVQUFVNFksUUFBUSxLQUFsQixDQUFqQjtBQUNBLFVBQUlxRSxzQkFBc0IsS0FBMUI7QUFDQSxVQUFJQyx1QkFBdUIsS0FBM0I7QUFDQSxXQUFLeGEsS0FBTCxDQUFXN0MsZUFBWCxDQUEyQjRFLE9BQTNCLENBQW1DLFVBQUN1UyxDQUFELEVBQU87QUFDeEMsWUFBSUEsTUFBTWpTLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUN3VCxLQUFLdk0sS0FBeEQsRUFBK0RnUixzQkFBc0IsSUFBdEI7QUFDL0QsWUFBSWpHLE1BQU1qUyxjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLElBQTBDd1QsS0FBS3ZNLEtBQUwsR0FBYSxDQUF2RCxDQUFWLEVBQXFFaVIsdUJBQXVCLElBQXZCO0FBQ3RFLE9BSEQ7O0FBS0EsYUFDRTtBQUFBO0FBQUEsVUFFRSxLQUFRbFksWUFBUixTQUF3QmlILEtBRjFCO0FBR0UsZ0JBQUssR0FIUDtBQUlFLG1CQUFTLGlCQUFDME8sU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLGdCQUFJRixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixvQkFBS08scUJBQUwsQ0FBMkIsRUFBRTlWLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTNCO0FBQ0EsZ0JBQUluRixrQkFBa0IsUUFBSzZDLEtBQUwsQ0FBVzdDLGVBQWpDO0FBQ0FBLDhCQUFrQixDQUFDa0YsY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5Q3dULEtBQUt2TSxLQUEvQyxFQUFzRGxILGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsSUFBMEN3VCxLQUFLdk0sS0FBTCxHQUFhLENBQXZELENBQXRELENBQWxCO0FBQ0Esb0JBQUsxSCxRQUFMLENBQWM7QUFDWjdFLDZCQUFlLElBREg7QUFFWkMsNEJBQWMsSUFGRjtBQUdaaVEsbUNBQXFCZ0wsU0FBU0UsQ0FIbEI7QUFJWmpMLG1DQUFxQjJJLEtBQUtDLEVBSmQ7QUFLWjNJLHNDQUF3QixJQUxaO0FBTVpqUTtBQU5ZLGFBQWQ7QUFRRCxXQWpCSDtBQWtCRSxrQkFBUSxnQkFBQzhhLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixvQkFBS0csdUJBQUwsQ0FBNkIsRUFBRWhXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTdCO0FBQ0Esb0JBQUtULFFBQUwsQ0FBYyxFQUFFcUwscUJBQXFCLEtBQXZCLEVBQThCQyxxQkFBcUIsS0FBbkQsRUFBMERDLHdCQUF3QixLQUFsRixFQUF5RmpRLGlCQUFpQixFQUExRyxFQUFkO0FBQ0QsV0FyQkg7QUFzQkUsa0JBQVEsaUJBQU8yRCxRQUFQLENBQWdCLFVBQUNtWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0MsZ0JBQUlJLFdBQVdKLFNBQVNLLEtBQVQsR0FBaUIsUUFBS3ZZLEtBQUwsQ0FBV2tOLG1CQUEzQztBQUNBLGdCQUFJc0wsV0FBWUYsV0FBVzNTLFVBQVUrRSxJQUF0QixHQUE4Qi9FLFVBQVVHLElBQXZEO0FBQ0EsZ0JBQUkyUyxTQUFTelMsS0FBS0MsS0FBTCxDQUFXLFFBQUtqRyxLQUFMLENBQVdtTixtQkFBWCxHQUFpQ3FMLFFBQTVDLENBQWI7QUFDQSxvQkFBSzdSLHlDQUFMLENBQStDdEUsV0FBL0MsRUFBNEQsUUFBS3JDLEtBQUwsQ0FBVzdELG1CQUF2RSxFQUE0Rm1HLFlBQTVGLEVBQTBHLE1BQTFHLEVBQWtId1QsS0FBS3ZNLEtBQXZILEVBQThIdU0sS0FBS0MsRUFBbkksRUFBdUkwQyxNQUF2STtBQUNELFdBTE8sRUFLTG5aLGFBTEssQ0F0QlY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNEJFO0FBQUE7QUFBQTtBQUNFLHVCQUFVLGdCQURaO0FBRUUsaUJBQUswYSxTQUZQO0FBR0UsaUJBQUssYUFBQ1MsVUFBRCxFQUFnQjtBQUNuQixzQkFBS1QsU0FBTCxJQUFrQlMsVUFBbEI7QUFDRCxhQUxIO0FBTUUsMkJBQWUsdUJBQUMvQixZQUFELEVBQWtCO0FBQy9CLGtCQUFJVixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QmMsMkJBQWFDLGVBQWI7QUFDQSxrQkFBSUMsZUFBZUYsYUFBYTdRLFdBQWIsQ0FBeUJnUixPQUE1QztBQUNBLGtCQUFJQyxlQUFlRixlQUFlekMsWUFBZixHQUE4Qm5RLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWdNLEdBQVYsR0FBZ0JoTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxrQkFBSXNPLGVBQWVoVCxLQUFLQyxLQUFMLENBQVc2UyxlQUFlblQsVUFBVStFLElBQXBDLENBQW5CO0FBQ0Esa0JBQUlxTyxZQUFZL1MsS0FBS0MsS0FBTCxDQUFZNlMsZUFBZW5ULFVBQVUrRSxJQUExQixHQUFrQy9FLFVBQVVHLElBQXZELENBQWhCO0FBQ0Esc0JBQUs1RixPQUFMLENBQWErWSxJQUFiLENBQWtCO0FBQ2hCN1Qsc0JBQU0scUJBRFU7QUFFaEJPLG9DQUZnQjtBQUdoQnVULHVCQUFPUixhQUFhN1EsV0FISjtBQUloQnhGLHdDQUpnQjtBQUtoQm1ELDhCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFMVDtBQU1oQm1HLDBDQU5nQjtBQU9oQjZXLDRCQUFZckQsS0FBS0UsS0FQRDtBQVFoQnRQLCtCQUFlb1AsS0FBS3ZNLEtBUko7QUFTaEI3RCx5QkFBU29RLEtBQUtDLEVBVEU7QUFVaEJHLHVCQUFPSixLQUFLSSxLQVZJO0FBV2hCa0QsMEJBQVUxVSxLQUFLc1IsS0FYQztBQVloQjVQLHVCQUFPMUIsS0FBS3FSLEVBWkk7QUFhaEI2QywwQ0FiZ0I7QUFjaEJFLDBDQWRnQjtBQWVoQkUsMENBZmdCO0FBZ0JoQkQsb0NBaEJnQjtBQWlCaEJ0VDtBQWpCZ0IsZUFBbEI7QUFtQkQsYUFoQ0g7QUFpQ0UsMEJBQWMsc0JBQUNpVixVQUFELEVBQWdCO0FBQzVCLGtCQUFJLFFBQUtWLFNBQUwsQ0FBSixFQUFxQixRQUFLQSxTQUFMLEVBQWdCVyxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEIseUJBQVFDLElBQXRDO0FBQ3RCLGFBbkNIO0FBb0NFLDBCQUFjLHNCQUFDSCxVQUFELEVBQWdCO0FBQzVCLGtCQUFJLFFBQUtWLFNBQUwsQ0FBSixFQUFxQixRQUFLQSxTQUFMLEVBQWdCVyxLQUFoQixDQUFzQkMsS0FBdEIsR0FBOEIsYUFBOUI7QUFDdEIsYUF0Q0g7QUF1Q0UsbUJBQU87QUFDTGxFLHdCQUFVLFVBREw7QUFFTGhQLG9CQUFNeU8sZUFBZSxDQUZoQjtBQUdMb0IscUJBQU9uQixnQkFBZ0JELFlBSGxCO0FBSUwxTyxtQkFBSyxDQUpBO0FBS0w2UCxzQkFBUSxFQUxIO0FBTUx3RCxnQ0FBa0IsTUFOYjtBQU9MdkIsc0JBQVN2QixRQUFRSixTQUFULEdBQ0osU0FESSxHQUVKO0FBVEMsYUF2Q1Q7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBa0RHSSxrQkFBUUosU0FBUixJQUNDO0FBQ0UsdUJBQVUseUJBRFo7QUFFRSxtQkFBTztBQUNMbEIsd0JBQVUsVUFETDtBQUVMYSxxQkFBTyxNQUZGO0FBR0xELHNCQUFRLE1BSEg7QUFJTDdQLG1CQUFLLENBSkE7QUFLTHNULDRCQUFjLENBTFQ7QUFNTHpCLHNCQUFRLENBTkg7QUFPTDVSLG9CQUFNLENBUEQ7QUFRTHNULCtCQUFrQmhELFFBQVFKLFNBQVQsR0FDYix5QkFBUWlELElBREssR0FFYixxQkFBTSx5QkFBUUksUUFBZCxFQUF3QkMsSUFBeEIsQ0FBNkIsSUFBN0I7QUFWQyxhQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBbkRKO0FBbUVFO0FBQ0UsdUJBQVUsTUFEWjtBQUVFLG1CQUFPO0FBQ0x4RSx3QkFBVSxVQURMO0FBRUw0QyxzQkFBUSxJQUZIO0FBR0wvQixxQkFBTyxNQUhGO0FBSUxELHNCQUFRLE1BSkg7QUFLTDdQLG1CQUFLLENBTEE7QUFNTHNULDRCQUFjLENBTlQ7QUFPTHJULG9CQUFNLENBUEQ7QUFRTHNULCtCQUFrQmhELFFBQVFKLFNBQVQsR0FDZEksUUFBUUgsZ0JBQVQsR0FDRSxxQkFBTSx5QkFBUW9ELFFBQWQsRUFBd0JDLElBQXhCLENBQTZCLElBQTdCLENBREYsR0FFRSxxQkFBTSx5QkFBUUQsUUFBZCxFQUF3QkMsSUFBeEIsQ0FBNkIsS0FBN0IsQ0FIYSxHQUlmLHFCQUFNLHlCQUFRRCxRQUFkLEVBQXdCQyxJQUF4QixDQUE2QixJQUE3QjtBQVpHLGFBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFuRUY7QUFvRkU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTHhFLDBCQUFVLFVBREw7QUFFTGhQLHNCQUFNLENBQUMsQ0FGRjtBQUdMNlAsdUJBQU8sQ0FIRjtBQUlMRCx3QkFBUSxFQUpIO0FBS0w3UCxxQkFBSyxDQUFDLENBTEQ7QUFNTGdTLDJCQUFXLFlBTk47QUFPTEgsd0JBQVE7QUFQSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLDJCQUFVLGtCQURaO0FBRUUsdUJBQU87QUFDTDVDLDRCQUFVLFVBREw7QUFFTGpQLHVCQUFLLENBRkE7QUFHTEMsd0JBQU0sQ0FIRDtBQUlMNlIsMEJBQVN2QixRQUFRSixTQUFULEdBQXNCLFNBQXRCLEdBQWtDO0FBSnJDLGlCQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFFLHFFQUFhLE9BQVFJLFFBQVFILGdCQUFULEdBQ2QseUJBQVE4QixJQURNLEdBRWIzQixRQUFRNEIsaUJBQVQsR0FDSSx5QkFBUUMsU0FEWixHQUVLVSxtQkFBRCxHQUNFLHlCQUFRVCxhQURWLEdBRUUseUJBQVFDLElBTnBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVJGO0FBVkYsV0FwRkY7QUFnSEU7QUFBQTtBQUFBLGNBQU0sT0FBTztBQUNYckQsMEJBQVUsVUFEQztBQUVYNEMsd0JBQVEsSUFGRztBQUdYL0IsdUJBQU8sTUFISTtBQUlYRCx3QkFBUSxNQUpHO0FBS1h5RCw4QkFBYyxDQUxIO0FBTVhJLDRCQUFZLENBTkQ7QUFPWDNELDBCQUFVNEMsaUJBQWlCLFNBQWpCLEdBQTZCO0FBUDVCLGVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0UsMENBQUMsUUFBRDtBQUNFLGtCQUFJSixTQUROO0FBRUUsNEJBQWVoQyxRQUFRSCxnQkFBVCxHQUNWLHlCQUFROEIsSUFERSxHQUVSM0IsUUFBUTRCLGlCQUFULEdBQ0cseUJBQVFDLFNBRFgsR0FFSVUsbUJBQUQsR0FDRSx5QkFBUVQsYUFEVixHQUVFLHlCQUFRQyxJQVJwQjtBQVNFLDZCQUFnQi9CLFFBQVFILGdCQUFULEdBQ1gseUJBQVE4QixJQURHLEdBRVQzQixRQUFRNEIsaUJBQVQsR0FDRyx5QkFBUUMsU0FEWCxHQUVJVyxvQkFBRCxHQUNFLHlCQUFRVixhQURWLEdBRUUseUJBQVFDLElBZnBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVEYsV0FoSEY7QUEySUU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTHJELDBCQUFVLFVBREw7QUFFTDBFLHVCQUFPLENBQUMsQ0FGSDtBQUdMN0QsdUJBQU8sQ0FIRjtBQUlMRCx3QkFBUSxFQUpIO0FBS0w3UCxxQkFBSyxDQUFDLENBTEQ7QUFNTGdTLDJCQUFXLFlBTk47QUFPTEMsNEJBQVksc0JBUFA7QUFRTEosd0JBQVE7QUFSSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdFO0FBQUE7QUFBQTtBQUNFLDJCQUFVLGtCQURaO0FBRUUsdUJBQU87QUFDTDVDLDRCQUFVLFVBREw7QUFFTGpQLHVCQUFLLENBRkE7QUFHTEMsd0JBQU0sQ0FIRDtBQUlMNlIsMEJBQVN2QixRQUFRSixTQUFULEdBQ0osU0FESSxHQUVKO0FBTkMsaUJBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUUscUVBQWEsT0FBUUksUUFBUUgsZ0JBQVQsR0FDaEIseUJBQVE4QixJQURRLEdBRWYzQixRQUFRNEIsaUJBQVQsR0FDSSx5QkFBUUMsU0FEWixHQUVLVyxvQkFBRCxHQUNFLHlCQUFRVixhQURWLEdBRUUseUJBQVFDLElBTmxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVZGO0FBWEY7QUEzSUY7QUE1QkYsT0FERjtBQTBNRDs7O3VDQUVtQnBVLFMsRUFBV3RELFcsRUFBYW9ELFcsRUFBYW5ELFksRUFBY2xGLGUsRUFBaUJ5WSxJLEVBQU1DLEksRUFBTXBSLEksRUFBTXlSLFksRUFBY0MsYSxFQUFlN00sSyxFQUFPeU8sTyxFQUFTO0FBQUE7O0FBQ3JKO0FBQ0EsVUFBTWdDLFlBQWUxWCxZQUFmLFNBQStCaUgsS0FBL0IsU0FBd0N1TSxLQUFLQyxFQUFuRDs7QUFFQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUssYUFBQzBFLFVBQUQsRUFBZ0I7QUFDbkIsb0JBQUtULFNBQUwsSUFBa0JTLFVBQWxCO0FBQ0QsV0FISDtBQUlFLGVBQVFuWSxZQUFSLFNBQXdCaUgsS0FKMUI7QUFLRSxxQkFBVSxlQUxaO0FBTUUseUJBQWUsdUJBQUNtUCxZQUFELEVBQWtCO0FBQy9CLGdCQUFJVixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QmMseUJBQWFDLGVBQWI7QUFDQSxnQkFBSUMsZUFBZUYsYUFBYTdRLFdBQWIsQ0FBeUJnUixPQUE1QztBQUNBLGdCQUFJQyxlQUFlRixlQUFlekMsWUFBZixHQUE4Qm5RLEtBQUtDLEtBQUwsQ0FBV04sVUFBVWdNLEdBQVYsR0FBZ0JoTSxVQUFVK0UsSUFBckMsQ0FBakQ7QUFDQSxnQkFBSXNPLGVBQWVoVCxLQUFLQyxLQUFMLENBQVc2UyxlQUFlblQsVUFBVStFLElBQXBDLENBQW5CO0FBQ0EsZ0JBQUlxTyxZQUFZL1MsS0FBS0MsS0FBTCxDQUFZNlMsZUFBZW5ULFVBQVUrRSxJQUExQixHQUFrQy9FLFVBQVVHLElBQXZELENBQWhCO0FBQ0Esb0JBQUs1RixPQUFMLENBQWErWSxJQUFiLENBQWtCO0FBQ2hCN1Qsb0JBQU0sa0JBRFU7QUFFaEJPLGtDQUZnQjtBQUdoQnVULHFCQUFPUixhQUFhN1EsV0FISjtBQUloQnhGLHNDQUpnQjtBQUtoQm1ELDRCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFMVDtBQU1oQm1HLHdDQU5nQjtBQU9oQjZXLDBCQUFZckQsS0FBS0UsS0FQRDtBQVFoQnRQLDZCQUFlb1AsS0FBS3ZNLEtBUko7QUFTaEI3RCx1QkFBU29RLEtBQUtDLEVBVEU7QUFVaEJxRCx3QkFBVTFVLEtBQUtzUixLQVZDO0FBV2hCNVAscUJBQU8xQixLQUFLcVIsRUFYSTtBQVloQkcscUJBQU8sSUFaUztBQWFoQjBDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQnRUO0FBakJnQixhQUFsQjtBQW1CRCxXQWhDSDtBQWlDRSxpQkFBTztBQUNMaVIsc0JBQVUsVUFETDtBQUVMaFAsa0JBQU15TyxlQUFlLENBRmhCO0FBR0xvQixtQkFBT25CLGdCQUFnQkQsWUFIbEI7QUFJTG1CLG9CQUFRLEtBQUt0WCxLQUFMLENBQVd2RTtBQUpkLFdBakNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXVDRSxnREFBTSxPQUFPO0FBQ1g2YixvQkFBUSxDQURHO0FBRVg3UCxpQkFBSyxFQUZNO0FBR1hpUCxzQkFBVSxVQUhDO0FBSVg0QyxvQkFBUSxDQUpHO0FBS1gvQixtQkFBTyxNQUxJO0FBTVh5RCw2QkFBa0JoRCxRQUFRSCxnQkFBVCxHQUNiLHFCQUFNLHlCQUFRZ0QsSUFBZCxFQUFvQkssSUFBcEIsQ0FBeUIsSUFBekIsQ0FEYSxHQUViLHlCQUFRRztBQVJELFdBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkNGLE9BREY7QUFvREQ7OzttREFFK0IxVixTLEVBQVd3RSxJLEVBQU1aLEssRUFBTytOLE0sRUFBUWdFLFEsRUFBVWxlLGUsRUFBaUI7QUFBQTs7QUFDekYsVUFBTWlGLGNBQWM4SCxLQUFLM0ssSUFBTCxDQUFVb0osVUFBVixDQUFxQixVQUFyQixDQUFwQjtBQUNBLFVBQU1uRCxjQUFlLFFBQU8wRSxLQUFLM0ssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QwRSxLQUFLM0ssSUFBTCxDQUFVaUcsV0FBcEY7QUFDQSxVQUFNbkQsZUFBZTZILEtBQUtELFFBQUwsQ0FBYy9HLElBQW5DO0FBQ0EsVUFBTW9ZLGNBQWMsS0FBS0MsY0FBTCxDQUFvQnJSLElBQXBCLENBQXBCOztBQUVBLGFBQU8sS0FBS3FNLGtDQUFMLENBQXdDN1EsU0FBeEMsRUFBbUR0RCxXQUFuRCxFQUFnRW9ELFdBQWhFLEVBQTZFbkQsWUFBN0UsRUFBMkZsRixlQUEzRixFQUE0RyxVQUFDeVksSUFBRCxFQUFPQyxJQUFQLEVBQWFwUixJQUFiLEVBQW1CeVIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEN00sS0FBaEQsRUFBMEQ7QUFDM0ssWUFBSW1PLGdCQUFnQixFQUFwQjs7QUFFQSxZQUFJNUIsS0FBS0ksS0FBVCxFQUFnQjtBQUNkd0Isd0JBQWN6VixJQUFkLENBQW1CLFFBQUswVixvQkFBTCxDQUEwQmhTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRG5ELFlBQS9ELEVBQTZFbEYsZUFBN0UsRUFBOEZ5WSxJQUE5RixFQUFvR0MsSUFBcEcsRUFBMEdwUixJQUExRyxFQUFnSHlSLFlBQWhILEVBQThIQyxhQUE5SCxFQUE2SSxDQUE3SSxFQUFnSixFQUFFbUYsd0JBQUYsRUFBaEosQ0FBbkI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJN1csSUFBSixFQUFVO0FBQ1JnVCwwQkFBY3pWLElBQWQsQ0FBbUIsUUFBSzZWLGtCQUFMLENBQXdCblMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEbkQsWUFBN0QsRUFBMkVsRixlQUEzRSxFQUE0RnlZLElBQTVGLEVBQWtHQyxJQUFsRyxFQUF3R3BSLElBQXhHLEVBQThHeVIsWUFBOUcsRUFBNEhDLGFBQTVILEVBQTJJLENBQTNJLEVBQThJLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRCxjQUFJLENBQUNQLElBQUQsSUFBUyxDQUFDQSxLQUFLSyxLQUFuQixFQUEwQjtBQUN4QndCLDBCQUFjelYsSUFBZCxDQUFtQixRQUFLOFYsa0JBQUwsQ0FBd0JwUyxTQUF4QixFQUFtQ3RELFdBQW5DLEVBQWdEb0QsV0FBaEQsRUFBNkRuRCxZQUE3RCxFQUEyRWxGLGVBQTNFLEVBQTRGeVksSUFBNUYsRUFBa0dDLElBQWxHLEVBQXdHcFIsSUFBeEcsRUFBOEd5UixZQUE5RyxFQUE0SEMsYUFBNUgsRUFBMkksQ0FBM0ksRUFBOEksRUFBRW1GLHdCQUFGLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJMUYsSUFBSixFQUFVO0FBQ1I2Qix3QkFBY3pWLElBQWQsQ0FBbUIsUUFBS3daLDhCQUFMLENBQW9DOVYsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3R3lZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHBSLElBQXBILEVBQTBIeVIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixNQUFoSixFQUF3SixFQUF4SixDQUFuQjtBQUNEO0FBQ0R1QixzQkFBY3pWLElBQWQsQ0FBbUIsUUFBS3daLDhCQUFMLENBQW9DOVYsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3R3lZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHBSLElBQXBILEVBQTBIeVIsWUFBMUgsRUFBd0ksQ0FBeEksRUFBMkksUUFBM0ksRUFBcUosRUFBckosQ0FBbkI7QUFDQSxZQUFJelIsSUFBSixFQUFVO0FBQ1JnVCx3QkFBY3pWLElBQWQsQ0FBbUIsUUFBS3daLDhCQUFMLENBQW9DOVYsU0FBcEMsRUFBK0N0RCxXQUEvQyxFQUE0RG9ELFdBQTVELEVBQXlFbkQsWUFBekUsRUFBdUZsRixlQUF2RixFQUF3R3lZLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHBSLElBQXBILEVBQTBIeVIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixPQUFoSixFQUF5SixFQUF6SixDQUFuQjtBQUNEOztBQUVELGVBQ0U7QUFBQTtBQUFBO0FBQ0UseUNBQTJCOVQsV0FBM0IsU0FBMENDLFlBQTFDLFNBQTBEaUgsS0FENUQ7QUFFRSwyQ0FGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHR21PO0FBSEgsU0FERjtBQU9ELE9BN0JNLENBQVA7QUE4QkQ7O0FBRUQ7Ozs7Z0NBRWEvUixTLEVBQVc7QUFBQTs7QUFDdEIsVUFBSSxLQUFLM0YsS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUFuQyxFQUE2QztBQUMzQyxlQUFPLEtBQUt3ZixnQkFBTCxDQUFzQixVQUFDcEwsV0FBRCxFQUFjQyxlQUFkLEVBQStCb0wsY0FBL0IsRUFBK0N2TCxZQUEvQyxFQUFnRTtBQUMzRixjQUFJRSxnQkFBZ0IsQ0FBaEIsSUFBcUJBLGNBQWNGLFlBQWQsS0FBK0IsQ0FBeEQsRUFBMkQ7QUFDekQsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGdCQUFjRSxXQUFwQixFQUFtQyxPQUFPLEVBQUVzTCxlQUFlLE1BQWpCLEVBQXlCdkMsU0FBUyxjQUFsQyxFQUFrRDNDLFVBQVUsVUFBNUQsRUFBd0VoUCxNQUFNNkksZUFBOUUsRUFBK0ZrSixXQUFXLGtCQUExRyxFQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUEsa0JBQU0sT0FBTyxFQUFFb0MsWUFBWSxNQUFkLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXNDdkw7QUFBdEM7QUFERixhQURGO0FBS0Q7QUFDRixTQVJNLENBQVA7QUFTRCxPQVZELE1BVU8sSUFBSSxLQUFLdFEsS0FBTCxDQUFXOUQsZUFBWCxLQUErQixTQUFuQyxFQUE4QztBQUFFO0FBQ3JELGVBQU8sS0FBSzRmLGVBQUwsQ0FBcUIsVUFBQ0Msa0JBQUQsRUFBcUJ4TCxlQUFyQixFQUFzQ3lMLGlCQUF0QyxFQUE0RDtBQUN0RixjQUFJQSxxQkFBcUIsSUFBekIsRUFBK0I7QUFDN0IsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGVBQWFELGtCQUFuQixFQUF5QyxPQUFPLEVBQUVILGVBQWUsTUFBakIsRUFBeUJ2QyxTQUFTLGNBQWxDLEVBQWtEM0MsVUFBVSxVQUE1RCxFQUF3RWhQLE1BQU02SSxlQUE5RSxFQUErRmtKLFdBQVcsa0JBQTFHLEVBQWhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxrQkFBTSxPQUFPLEVBQUVvQyxZQUFZLE1BQWQsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0NFLGtDQUF0QztBQUFBO0FBQUE7QUFERixhQURGO0FBS0QsV0FORCxNQU1PO0FBQ0wsbUJBQ0U7QUFBQTtBQUFBLGdCQUFNLGVBQWFBLGtCQUFuQixFQUF5QyxPQUFPLEVBQUVILGVBQWUsTUFBakIsRUFBeUJ2QyxTQUFTLGNBQWxDLEVBQWtEM0MsVUFBVSxVQUE1RCxFQUF3RWhQLE1BQU02SSxlQUE5RSxFQUErRmtKLFdBQVcsa0JBQTFHLEVBQWhEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxrQkFBTSxPQUFPLEVBQUVvQyxZQUFZLE1BQWQsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBc0MsNkNBQWNFLHFCQUFxQixJQUFuQyxDQUF0QztBQUFBO0FBQUE7QUFERixhQURGO0FBS0Q7QUFDRixTQWRNLENBQVA7QUFlRDtBQUNGOzs7b0NBRWdCcFcsUyxFQUFXO0FBQUE7O0FBQzFCLFVBQUlzVyxjQUFlLEtBQUtuVSxJQUFMLENBQVVrQixVQUFWLElBQXdCLEtBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCa1QsWUFBckIsR0FBb0MsRUFBN0QsSUFBb0UsQ0FBdEY7QUFDQSxhQUNFO0FBQUE7QUFBQSxVQUFLLElBQUcsWUFBUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxhQUFLUixnQkFBTCxDQUFzQixVQUFDcEwsV0FBRCxFQUFjQyxlQUFkLEVBQStCb0wsY0FBL0IsRUFBK0N2TCxZQUEvQyxFQUFnRTtBQUNyRixpQkFBTyx3Q0FBTSxnQkFBY0UsV0FBcEIsRUFBbUMsT0FBTyxFQUFDZ0gsUUFBUTJFLGNBQWMsRUFBdkIsRUFBMkJFLFlBQVksZUFBZSxxQkFBTSx5QkFBUUMsSUFBZCxFQUFvQmxCLElBQXBCLENBQXlCLElBQXpCLENBQXRELEVBQXNGeEUsVUFBVSxVQUFoRyxFQUE0R2hQLE1BQU02SSxlQUFsSCxFQUFtSTlJLEtBQUssRUFBeEksRUFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBQVA7QUFDRCxTQUZBO0FBREgsT0FERjtBQU9EOzs7cUNBRWlCO0FBQUE7O0FBQ2hCLFVBQUk5QixZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxVQUFJLEtBQUs1RixLQUFMLENBQVdsRSxZQUFYLEdBQTBCNkosVUFBVXVCLElBQXBDLElBQTRDLEtBQUtsSCxLQUFMLENBQVdsRSxZQUFYLEdBQTBCNkosVUFBVTBXLElBQXBGLEVBQTBGLE9BQU8sRUFBUDtBQUMxRixVQUFJbEwsY0FBYyxLQUFLblIsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVV1QixJQUF0RDtBQUNBLFVBQUlrSyxXQUFXRCxjQUFjeEwsVUFBVStFLElBQXZDO0FBQ0EsVUFBSTRSLGNBQWUsS0FBS3hVLElBQUwsQ0FBVWtCLFVBQVYsSUFBd0IsS0FBS2xCLElBQUwsQ0FBVWtCLFVBQVYsQ0FBcUJrVCxZQUFyQixHQUFvQyxFQUE3RCxJQUFvRSxDQUF0RjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZ0JBQUssR0FEUDtBQUVFLG1CQUFTLGlCQUFDakUsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLG9CQUFLclcsUUFBTCxDQUFjO0FBQ1o1RSw0QkFBYyxJQURGO0FBRVpELDZCQUFlLElBRkg7QUFHWnNOLGlDQUFtQjROLFNBQVNFLENBSGhCO0FBSVo3Tiw2QkFBZSxRQUFLdkssS0FBTCxDQUFXbEUsWUFKZDtBQUtaWSwwQ0FBNEI7QUFMaEIsYUFBZDtBQU9ELFdBVkg7QUFXRSxrQkFBUSxnQkFBQ3ViLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQnpULHVCQUFXLFlBQU07QUFDZixzQkFBSzVDLFFBQUwsQ0FBYyxFQUFFeUksbUJBQW1CLElBQXJCLEVBQTJCQyxlQUFlLFFBQUt2SyxLQUFMLENBQVdsRSxZQUFyRCxFQUFtRVksNEJBQTRCLEtBQS9GLEVBQWQ7QUFDRCxhQUZELEVBRUcsR0FGSDtBQUdELFdBZkg7QUFnQkUsa0JBQVEsaUJBQU9vRSxRQUFQLENBQWdCLFVBQUNtWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0Msb0JBQUtxRSxzQkFBTCxDQUE0QnJFLFNBQVNFLENBQXJDLEVBQXdDelMsU0FBeEM7QUFDRCxXQUZPLEVBRUxyRyxhQUZLLENBaEJWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBTztBQUNMb1gsMEJBQVUsVUFETDtBQUVMc0UsaUNBQWlCLHlCQUFRQyxRQUZwQjtBQUdMM0Qsd0JBQVEsRUFISDtBQUlMQyx1QkFBTyxFQUpGO0FBS0w5UCxxQkFBSyxFQUxBO0FBTUxDLHNCQUFNMEosV0FBVyxDQU5aO0FBT0wySiw4QkFBYyxLQVBUO0FBUUx4Qix3QkFBUSxNQVJIO0FBU0xpRCwyQkFBVyw2QkFUTjtBQVVMbEQsd0JBQVE7QUFWSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFFLG9EQUFNLE9BQU87QUFDWDVDLDBCQUFVLFVBREM7QUFFWDRDLHdCQUFRLElBRkc7QUFHWC9CLHVCQUFPLENBSEk7QUFJWEQsd0JBQVEsQ0FKRztBQUtYN1AscUJBQUssQ0FMTTtBQU1YMFUsNEJBQVksdUJBTkQ7QUFPWE0sNkJBQWEsdUJBUEY7QUFRWEMsMkJBQVcsZUFBZSx5QkFBUXpCO0FBUnZCLGVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBYkY7QUF1QkUsb0RBQU0sT0FBTztBQUNYdkUsMEJBQVUsVUFEQztBQUVYNEMsd0JBQVEsSUFGRztBQUdYL0IsdUJBQU8sQ0FISTtBQUlYRCx3QkFBUSxDQUpHO0FBS1g1UCxzQkFBTSxDQUxLO0FBTVhELHFCQUFLLENBTk07QUFPWDBVLDRCQUFZLHVCQVBEO0FBUVhNLDZCQUFhLHVCQVJGO0FBU1hDLDJCQUFXLGVBQWUseUJBQVF6QjtBQVR2QixlQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXZCRixXQURGO0FBb0NFO0FBQ0UsbUJBQU87QUFDTHZFLHdCQUFVLFVBREw7QUFFTDRDLHNCQUFRLElBRkg7QUFHTDBCLCtCQUFpQix5QkFBUUMsUUFIcEI7QUFJTDNELHNCQUFRZ0YsV0FKSDtBQUtML0UscUJBQU8sQ0FMRjtBQU1MOVAsbUJBQUssRUFOQTtBQU9MQyxvQkFBTTBKLFFBUEQ7QUFRTHdLLDZCQUFlO0FBUlYsYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFwQ0Y7QUFuQkYsT0FERjtBQXNFRDs7OzZDQUV5QjtBQUFBOztBQUN4QixVQUFJalcsWUFBWSxLQUFLQyxZQUFMLEVBQWhCO0FBQ0E7QUFDQSxVQUFJd0wsV0FBVyxLQUFLcFIsS0FBTCxDQUFXaUwsWUFBWCxHQUEwQixDQUExQixHQUE4QixDQUFDLEtBQUtqTCxLQUFMLENBQVdoRSxZQUFaLEdBQTJCMkosVUFBVStFLElBQWxGOztBQUVBLFVBQUkvRSxVQUFVc0IsSUFBVixJQUFrQnRCLFVBQVVxRixPQUE1QixJQUF1QyxLQUFLaEwsS0FBTCxDQUFXaUwsWUFBdEQsRUFBb0U7QUFDbEUsZUFDRTtBQUFBO0FBQUE7QUFDRSxrQkFBSyxHQURQO0FBRUUscUJBQVMsaUJBQUNnTixTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsc0JBQUtyVyxRQUFMLENBQWM7QUFDWjdFLCtCQUFlLElBREg7QUFFWkMsOEJBQWMsSUFGRjtBQUdaMk4sbUNBQW1Cc04sU0FBU0UsQ0FIaEI7QUFJWnBjLDhCQUFjO0FBSkYsZUFBZDtBQU1ELGFBVEg7QUFVRSxvQkFBUSxnQkFBQ2ljLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixrQkFBSW5OLGFBQWEsUUFBSy9LLEtBQUwsQ0FBV2pFLFFBQVgsR0FBc0IsUUFBS2lFLEtBQUwsQ0FBV2pFLFFBQWpDLEdBQTRDNEosVUFBVXFGLE9BQXZFO0FBQ0FFLDRCQUFjLFFBQUtsTCxLQUFMLENBQVc2SyxXQUF6QjtBQUNBLHNCQUFLaEosUUFBTCxDQUFjLEVBQUM5RixVQUFVZ1AsYUFBYSxRQUFLL0ssS0FBTCxDQUFXaEUsWUFBbkMsRUFBaURpUCxjQUFjLEtBQS9ELEVBQXNFSixhQUFhLElBQW5GLEVBQWQ7QUFDQXBHLHlCQUFXLFlBQU07QUFBRSx3QkFBSzVDLFFBQUwsQ0FBYyxFQUFFK0ksbUJBQW1CLElBQXJCLEVBQTJCNU8sY0FBYyxDQUF6QyxFQUFkO0FBQTZELGVBQWhGLEVBQWtGLEdBQWxGO0FBQ0QsYUFmSDtBQWdCRSxvQkFBUSxnQkFBQ2ljLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQixzQkFBS3lFLDhCQUFMLENBQW9DekUsU0FBU0UsQ0FBN0MsRUFBZ0R6UyxTQUFoRDtBQUNELGFBbEJIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW1CRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUMrUSxVQUFVLFVBQVgsRUFBdUIwRSxPQUFPaEssUUFBOUIsRUFBd0MzSixLQUFLLENBQTdDLEVBQWdENlIsUUFBUSxJQUF4RCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQ0UscUJBQU87QUFDTDVDLDBCQUFVLFVBREw7QUFFTHNFLGlDQUFpQix5QkFBUWpCLElBRnBCO0FBR0x4Qyx1QkFBTyxDQUhGO0FBSUxELHdCQUFRLEVBSkg7QUFLTGdDLHdCQUFRLENBTEg7QUFNTDdSLHFCQUFLLENBTkE7QUFPTDJULHVCQUFPLENBUEY7QUFRTHdCLHNDQUFzQixDQVJqQjtBQVNMQyx5Q0FBeUIsQ0FUcEI7QUFVTHRELHdCQUFRO0FBVkgsZUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FERjtBQWNFLG1EQUFLLFdBQVUsV0FBZixFQUEyQixPQUFPO0FBQ2hDN0MsMEJBQVUsVUFEc0I7QUFFaENqUCxxQkFBSyxDQUYyQjtBQUdoQ3FWLDZCQUFhLE1BSG1CO0FBSWhDcFYsc0JBQU0sQ0FBQyxDQUp5QjtBQUtoQzZQLHVCQUFPLEtBQUtuRyxRQUxvQjtBQU1oQ2tHLHdCQUFTLEtBQUt4UCxJQUFMLENBQVVrQixVQUFWLElBQXdCLEtBQUtsQixJQUFMLENBQVVrQixVQUFWLENBQXFCa1QsWUFBckIsR0FBb0MsRUFBN0QsSUFBb0UsQ0FONUM7QUFPaENDLDRCQUFZLGVBQWUseUJBQVFZLFdBUEg7QUFRaEMvQixpQ0FBaUIscUJBQU0seUJBQVErQixXQUFkLEVBQTJCN0IsSUFBM0IsQ0FBZ0MsR0FBaEM7QUFSZSxlQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFkRjtBQW5CRixTQURGO0FBK0NELE9BaERELE1BZ0RPO0FBQ0wsZUFBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUFQO0FBQ0Q7QUFDRjs7O3dDQUVvQjtBQUFBOztBQUNuQixVQUFNdlYsWUFBWSxLQUFLQyxZQUFMLEVBQWxCO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBVSx3QkFEWjtBQUVFLGlCQUFPO0FBQ0w4USxzQkFBVSxVQURMO0FBRUxqUCxpQkFBSyxDQUZBO0FBR0xDLGtCQUFNLENBSEQ7QUFJTDRQLG9CQUFRLEtBQUt0WCxLQUFMLENBQVd2RSxTQUFYLEdBQXVCLEVBSjFCO0FBS0w4YixtQkFBTyxLQUFLdlgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixLQUFLeUUsS0FBTCxDQUFXeEUsY0FMMUM7QUFNTHdoQiwyQkFBZSxLQU5WO0FBT0xDLHNCQUFVLEVBUEw7QUFRTEMsMEJBQWMsZUFBZSx5QkFBUUgsV0FSaEM7QUFTTC9CLDZCQUFpQix5QkFBUW9CO0FBVHBCLFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsMkJBRFo7QUFFRSxtQkFBTztBQUNMMUYsd0JBQVUsVUFETDtBQUVMalAsbUJBQUssQ0FGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUw0UCxzQkFBUSxTQUpIO0FBS0xDLHFCQUFPLEtBQUt2WCxLQUFMLENBQVd6RTtBQUxiLGFBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0U7QUFBQTtBQUFBO0FBQ0UseUJBQVUsb0JBRFo7QUFFRSxxQkFBTztBQUNMNGhCLHVCQUFPLE9BREY7QUFFTDFWLHFCQUFLLENBRkE7QUFHTDJWLDBCQUFVLEVBSEw7QUFJTDlGLHdCQUFRLFNBSkg7QUFLTDBGLCtCQUFlLEtBTFY7QUFNTEssMkJBQVcsT0FOTjtBQU9MbEMsNEJBQVksQ0FQUDtBQVFMbUMsOEJBQWM7QUFSVCxlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlFO0FBQUE7QUFBQSxnQkFBTSxPQUFPLEVBQUVqRSxTQUFTLGNBQVgsRUFBMkIvQixRQUFRLEVBQW5DLEVBQXVDaUcsU0FBUyxDQUFoRCxFQUFtRDFCLFlBQVksU0FBL0QsRUFBMEVvQixVQUFVLEVBQXBGLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ksbUJBQUtqZCxLQUFMLENBQVc5RCxlQUFYLEtBQStCLFFBQWhDLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8saUJBQUMsQ0FBQyxLQUFLOEQsS0FBTCxDQUFXbEUsWUFBcEI7QUFBQTtBQUFBLGVBREgsR0FFRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyw2Q0FBYyxLQUFLa0UsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQixJQUExQixHQUFpQyxLQUFLa0UsS0FBTCxDQUFXL0QsZUFBNUMsR0FBOEQsSUFBNUUsQ0FBUDtBQUFBO0FBQUE7QUFITjtBQVpGLFdBVEY7QUE0QkU7QUFBQTtBQUFBO0FBQ0UseUJBQVUsbUJBRFo7QUFFRSxxQkFBTztBQUNMc2IsdUJBQU8sRUFERjtBQUVMNEYsdUJBQU8sT0FGRjtBQUdMelYsc0JBQU0sR0FIRDtBQUlMNFAsd0JBQVEsU0FKSDtBQUtMMEYsK0JBQWUsS0FMVjtBQU1McEMsdUJBQU8seUJBQVE0QyxVQU5WO0FBT0xDLDJCQUFXLFFBUE47QUFRTEosMkJBQVcsT0FSTjtBQVNMbEMsNEJBQVksQ0FUUDtBQVVMbUMsOEJBQWMsQ0FWVDtBQVdML0Qsd0JBQVE7QUFYSCxlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWVFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLG1CQUFLdlosS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUFoQyxHQUNHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPLDZDQUFjLEtBQUs4RCxLQUFMLENBQVdsRSxZQUFYLEdBQTBCLElBQTFCLEdBQWlDLEtBQUtrRSxLQUFMLENBQVcvRCxlQUE1QyxHQUE4RCxJQUE1RSxDQUFQO0FBQUE7QUFBQSxlQURILEdBRUc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8saUJBQUMsQ0FBQyxLQUFLK0QsS0FBTCxDQUFXbEUsWUFBcEI7QUFBQTtBQUFBO0FBSE4sYUFmRjtBQXFCRTtBQUFBO0FBQUEsZ0JBQUssT0FBTyxFQUFDNGhCLFdBQVcsTUFBWixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFrQyxtQkFBSzFkLEtBQUwsQ0FBVy9ELGVBQTdDO0FBQUE7QUFBQTtBQXJCRixXQTVCRjtBQW1ERTtBQUFBO0FBQUE7QUFDRSx5QkFBVSxjQURaO0FBRUUsdUJBQVMsS0FBSzBoQixxQkFBTCxDQUEyQjVjLElBQTNCLENBQWdDLElBQWhDLENBRlg7QUFHRSxxQkFBTztBQUNMd1csdUJBQU8sRUFERjtBQUVMNEYsdUJBQU8sT0FGRjtBQUdMUyw2QkFBYSxFQUhSO0FBSUxYLDBCQUFVLENBSkw7QUFLTDNGLHdCQUFRLFNBTEg7QUFNTDBGLCtCQUFlLEtBTlY7QUFPTHBDLHVCQUFPLHlCQUFRNEMsVUFQVjtBQVFMSCwyQkFBVyxPQVJOO0FBU0xsQyw0QkFBWSxDQVRQO0FBVUxtQyw4QkFBYyxDQVZUO0FBV0wvRCx3QkFBUTtBQVhILGVBSFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZ0JHLGlCQUFLdlosS0FBTCxDQUFXOUQsZUFBWCxLQUErQixRQUEvQixHQUNJO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQSxrQkFBSyxPQUFPLEVBQUMwZSxPQUFPLHlCQUFRYixJQUFoQixFQUFzQnJELFVBQVUsVUFBaEMsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLHdEQUFNLE9BQU8sRUFBQ2EsT0FBTyxDQUFSLEVBQVdELFFBQVEsQ0FBbkIsRUFBc0IwRCxpQkFBaUIseUJBQVFqQixJQUEvQyxFQUFxRGdCLGNBQWMsS0FBbkUsRUFBMEVyRSxVQUFVLFVBQXBGLEVBQWdHMEUsT0FBTyxDQUFDLEVBQXhHLEVBQTRHM1QsS0FBSyxDQUFqSCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURKLGVBREM7QUFJRDtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDaVcsV0FBVyxNQUFaLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpDLGFBREosR0FPSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGVBREM7QUFFRDtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDQSxXQUFXLE1BQVosRUFBb0I5QyxPQUFPLHlCQUFRYixJQUFuQyxFQUF5Q3JELFVBQVUsVUFBbkQsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLHdEQUFNLE9BQU8sRUFBQ2EsT0FBTyxDQUFSLEVBQVdELFFBQVEsQ0FBbkIsRUFBc0IwRCxpQkFBaUIseUJBQVFqQixJQUEvQyxFQUFxRGdCLGNBQWMsS0FBbkUsRUFBMEVyRSxVQUFVLFVBQXBGLEVBQWdHMEUsT0FBTyxDQUFDLEVBQXhHLEVBQTRHM1QsS0FBSyxDQUFqSCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURKO0FBRkM7QUF2QlA7QUFuREYsU0FiRjtBQWlHRTtBQUFBO0FBQUE7QUFDRSx1QkFBVSxXQURaO0FBRUUscUJBQVMsaUJBQUNvVyxVQUFELEVBQWdCO0FBQ3ZCLGtCQUFJLFFBQUs3ZCxLQUFMLENBQVdzSyxpQkFBWCxLQUFpQyxJQUFqQyxJQUF5QyxRQUFLdEssS0FBTCxDQUFXc0ssaUJBQVgsS0FBaUNzTCxTQUE5RSxFQUF5RjtBQUN2RixvQkFBSWtJLFFBQVFELFdBQVdoVyxXQUFYLENBQXVCZ1IsT0FBbkM7QUFDQSxvQkFBSWtGLFNBQVMvWCxLQUFLQyxLQUFMLENBQVc2WCxRQUFRblksVUFBVStFLElBQTdCLENBQWI7QUFDQSxvQkFBSXNULFdBQVdyWSxVQUFVdUIsSUFBVixHQUFpQjZXLE1BQWhDO0FBQ0Esd0JBQUtsYyxRQUFMLENBQWM7QUFDWjdFLGlDQUFlLElBREg7QUFFWkMsZ0NBQWM7QUFGRixpQkFBZDtBQUlBLHdCQUFLb0QsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQzRELElBQXJDLENBQTBDcVQsUUFBMUM7QUFDRDtBQUNGLGFBYkg7QUFjRSxtQkFBTztBQUNMO0FBQ0F0SCx3QkFBVSxVQUZMO0FBR0xqUCxtQkFBSyxDQUhBO0FBSUxDLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUpaO0FBS0xnYyxxQkFBTyxLQUFLdlgsS0FBTCxDQUFXeEUsY0FMYjtBQU1MOGIsc0JBQVEsU0FOSDtBQU9MMEYsNkJBQWUsS0FQVjtBQVFMN0IsMEJBQVksRUFSUDtBQVNMUCxxQkFBTyx5QkFBUTRDLFVBVFYsRUFkVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF3QkcsZUFBS1MsZUFBTCxDQUFxQnRZLFNBQXJCLENBeEJIO0FBeUJHLGVBQUt1WSxXQUFMLENBQWlCdlksU0FBakIsQ0F6Qkg7QUEwQkcsZUFBS3dZLGNBQUw7QUExQkgsU0FqR0Y7QUE2SEcsYUFBS0Msc0JBQUw7QUE3SEgsT0FERjtBQWlJRDs7O21EQUUrQjtBQUFBOztBQUM5QixVQUFNelksWUFBWSxLQUFLQyxZQUFMLEVBQWxCO0FBQ0EsVUFBTXlZLGFBQWEsQ0FBbkI7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLDBCQURaO0FBRUUsaUJBQU87QUFDTDlHLG1CQUFPNVIsVUFBVXFNLEdBRFo7QUFFTHNGLG9CQUFRK0csYUFBYSxDQUZoQjtBQUdMM0gsc0JBQVUsVUFITDtBQUlMc0UsNkJBQWlCLHlCQUFRSyxXQUpwQjtBQUtMcUIsdUJBQVcsZUFBZSx5QkFBUUssV0FMN0I7QUFNTEcsMEJBQWMsZUFBZSx5QkFBUUg7QUFOaEMsV0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUE7QUFDRSxrQkFBSyxHQURQO0FBRUUscUJBQVMsaUJBQUM5RSxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsc0JBQUtyVyxRQUFMLENBQWM7QUFDWjRKLHVDQUF1QnlNLFNBQVNFLENBRHBCO0FBRVp6TSxnQ0FBZ0IsUUFBSzNMLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBRko7QUFHWmlRLDhCQUFjLFFBQUs5TCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUhGO0FBSVphLDRDQUE0QjtBQUpoQixlQUFkO0FBTUQsYUFUSDtBQVVFLG9CQUFRLGdCQUFDdWIsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CLHNCQUFLclcsUUFBTCxDQUFjO0FBQ1o0Six1Q0FBdUIsS0FEWDtBQUVaRSxnQ0FBZ0IsSUFGSjtBQUdaRyw4QkFBYyxJQUhGO0FBSVpwUCw0Q0FBNEI7QUFKaEIsZUFBZDtBQU1ELGFBakJIO0FBa0JFLG9CQUFRLGlCQUFPb0UsUUFBUCxDQUFnQixVQUFDbVgsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9DLHNCQUFLclcsUUFBTCxDQUFjLEVBQUVsRixzQkFBc0JnSixVQUFVc00sR0FBVixHQUFnQixDQUF4QyxFQUFkLEVBRCtDLENBQ1k7QUFDM0Qsa0JBQUksQ0FBQyxRQUFLalMsS0FBTCxDQUFXdUwscUJBQVosSUFBcUMsQ0FBQyxRQUFLdkwsS0FBTCxDQUFXd0wsc0JBQXJELEVBQTZFO0FBQzNFLHdCQUFLOFMsdUJBQUwsQ0FBNkJwRyxTQUFTRSxDQUF0QyxFQUF5Q0YsU0FBU0UsQ0FBbEQsRUFBcUR6UyxTQUFyRDtBQUNEO0FBQ0YsYUFMTyxFQUtMckcsYUFMSyxDQWxCVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF3QkU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTG9YLDBCQUFVLFVBREw7QUFFTHNFLGlDQUFpQix5QkFBUXVELGFBRnBCO0FBR0xqSCx3QkFBUStHLGFBQWEsQ0FIaEI7QUFJTDNXLHNCQUFNL0IsVUFBVXNNLEdBSlg7QUFLTHNGLHVCQUFPNVIsVUFBVXVNLEdBQVYsR0FBZ0J2TSxVQUFVc00sR0FBMUIsR0FBZ0MsRUFMbEM7QUFNTDhJLDhCQUFjc0QsVUFOVDtBQU9MOUUsd0JBQVE7QUFQSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLHNCQUFLLEdBRFA7QUFFRSx5QkFBUyxpQkFBQ3RCLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLclcsUUFBTCxDQUFjLEVBQUUwSix1QkFBdUIyTSxTQUFTRSxDQUFsQyxFQUFxQ3pNLGdCQUFnQixRQUFLM0wsS0FBTCxDQUFXbkUsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBckQsRUFBc0ZpUSxjQUFjLFFBQUs5TCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUFwRyxFQUFkO0FBQXNKLGlCQUY1TDtBQUdFLHdCQUFRLGdCQUFDb2MsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUtyVyxRQUFMLENBQWMsRUFBRTBKLHVCQUF1QixLQUF6QixFQUFnQ0ksZ0JBQWdCLElBQWhELEVBQXNERyxjQUFjLElBQXBFLEVBQWQ7QUFBMkYsaUJBSGhJO0FBSUUsd0JBQVEsaUJBQU9oTCxRQUFQLENBQWdCLFVBQUNtWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS29HLHVCQUFMLENBQTZCcEcsU0FBU0UsQ0FBVCxHQUFhelMsVUFBVXNNLEdBQXBELEVBQXlELENBQXpELEVBQTREdE0sU0FBNUQ7QUFBd0UsaUJBQW5ILEVBQXFIckcsYUFBckgsQ0FKVjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLRSxxREFBSyxPQUFPLEVBQUVpWSxPQUFPLEVBQVQsRUFBYUQsUUFBUSxFQUFyQixFQUF5QlosVUFBVSxVQUFuQyxFQUErQzZDLFFBQVEsV0FBdkQsRUFBb0U3UixNQUFNLENBQTFFLEVBQTZFcVQsY0FBYyxLQUEzRixFQUFrR0MsaUJBQWlCLHlCQUFRQyxRQUEzSCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGLGFBVkY7QUFpQkU7QUFBQTtBQUFBO0FBQ0Usc0JBQUssR0FEUDtBQUVFLHlCQUFTLGlCQUFDaEQsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUtyVyxRQUFMLENBQWMsRUFBRTJKLHdCQUF3QjBNLFNBQVNFLENBQW5DLEVBQXNDek0sZ0JBQWdCLFFBQUszTCxLQUFMLENBQVduRSxpQkFBWCxDQUE2QixDQUE3QixDQUF0RCxFQUF1RmlRLGNBQWMsUUFBSzlMLEtBQUwsQ0FBV25FLGlCQUFYLENBQTZCLENBQTdCLENBQXJHLEVBQWQ7QUFBdUosaUJBRjdMO0FBR0Usd0JBQVEsZ0JBQUNvYyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS3JXLFFBQUwsQ0FBYyxFQUFFMkosd0JBQXdCLEtBQTFCLEVBQWlDRyxnQkFBZ0IsSUFBakQsRUFBdURHLGNBQWMsSUFBckUsRUFBZDtBQUE0RixpQkFIakk7QUFJRSx3QkFBUSxpQkFBT2hMLFFBQVAsQ0FBZ0IsVUFBQ21YLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLb0csdUJBQUwsQ0FBNkIsQ0FBN0IsRUFBZ0NwRyxTQUFTRSxDQUFULEdBQWF6UyxVQUFVc00sR0FBdkQsRUFBNER0TSxTQUE1RDtBQUF3RSxpQkFBbkgsRUFBcUhyRyxhQUFySCxDQUpWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtFLHFEQUFLLE9BQU8sRUFBRWlZLE9BQU8sRUFBVCxFQUFhRCxRQUFRLEVBQXJCLEVBQXlCWixVQUFVLFVBQW5DLEVBQStDNkMsUUFBUSxXQUF2RCxFQUFvRTZCLE9BQU8sQ0FBM0UsRUFBOEVMLGNBQWMsS0FBNUYsRUFBbUdDLGlCQUFpQix5QkFBUUMsUUFBNUgsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMRjtBQWpCRjtBQXhCRixTQVZGO0FBNERFO0FBQUE7QUFBQSxZQUFLLE9BQU8sRUFBRTFELE9BQU8sS0FBS3ZYLEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsS0FBS3lFLEtBQUwsQ0FBV3hFLGNBQXhDLEdBQXlELEVBQWxFLEVBQXNFa00sTUFBTSxFQUE1RSxFQUFnRmdQLFVBQVUsVUFBMUYsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRSxpREFBSyxPQUFPO0FBQ1ZBLHdCQUFVLFVBREE7QUFFVmtGLDZCQUFlLE1BRkw7QUFHVnRFLHNCQUFRK0csYUFBYSxDQUhYO0FBSVY5RyxxQkFBTyxDQUpHO0FBS1Z5RCwrQkFBaUIseUJBQVFqQixJQUxmO0FBTVZyUyxvQkFBUSxLQUFLMUgsS0FBTCxDQUFXbEUsWUFBWCxHQUEwQjZKLFVBQVVxRixPQUFyQyxHQUFnRCxHQUFqRCxHQUF3RDtBQU5wRCxhQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQURGO0FBNURGLE9BREY7QUF5RUQ7OzsyQ0FFdUI7QUFDdEIsYUFDRTtBQUFBO0FBQUE7QUFDRSxxQkFBVSxXQURaO0FBRUUsaUJBQU87QUFDTHVNLG1CQUFPLE1BREY7QUFFTEQsb0JBQVEsRUFGSDtBQUdMMEQsNkJBQWlCLHlCQUFRb0IsSUFIcEI7QUFJTDVFLHNCQUFVLFNBSkw7QUFLTGQsc0JBQVUsT0FMTDtBQU1MOEgsb0JBQVEsQ0FOSDtBQU9MOVcsa0JBQU0sQ0FQRDtBQVFMNFIsb0JBQVE7QUFSSCxXQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVlHLGFBQUttRiw0QkFBTCxFQVpIO0FBYUcsYUFBS0MsOEJBQUw7QUFiSCxPQURGO0FBaUJEOzs7cURBRTJFO0FBQUEsVUFBL0NsZixJQUErQyxTQUEvQ0EsSUFBK0M7QUFBQSxVQUF6Q3NRLE9BQXlDLFNBQXpDQSxPQUF5QztBQUFBLFVBQWhDdkcsS0FBZ0MsU0FBaENBLEtBQWdDO0FBQUEsVUFBekJ3RyxRQUF5QixTQUF6QkEsUUFBeUI7QUFBQSxVQUFmdUQsV0FBZSxTQUFmQSxXQUFlOztBQUMxRTtBQUNBO0FBQ0EsVUFBTWdFLFNBQVNoRSxnQkFBZ0IsTUFBaEIsR0FBeUIsRUFBekIsR0FBOEIsRUFBN0M7QUFDQSxVQUFNc0gsUUFBUXBiLEtBQUtrSyxZQUFMLEdBQW9CLHlCQUFRcVEsSUFBNUIsR0FBbUMseUJBQVF5RCxVQUF6RDtBQUNBLFVBQU0vWCxjQUFlLFFBQU9qRyxLQUFLaUcsV0FBWixNQUE0QixRQUE3QixHQUF5QyxLQUF6QyxHQUFpRGpHLEtBQUtpRyxXQUExRTs7QUFFQSxhQUNHcUssWUFBWSxHQUFiLEdBQ0s7QUFBQTtBQUFBLFVBQUssT0FBTyxFQUFDd0gsUUFBUSxFQUFULEVBQWErQixTQUFTLGNBQXRCLEVBQXNDSSxXQUFXLGlCQUFqRCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBLGdDQUFTamEsS0FBS29KLFVBQUwsQ0FBZ0IsYUFBaEIsS0FBa0NuRCxXQUEzQyxFQUF3RCxFQUF4RDtBQURBLE9BREwsR0FJSztBQUFBO0FBQUEsVUFBTSxXQUFVLFdBQWhCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQTtBQUNFLG1CQUFPO0FBQ0w0VCx1QkFBUyxjQURKO0FBRUw0RCx3QkFBVSxFQUZMO0FBR0x2Ryx3QkFBVSxVQUhMO0FBSUw0QyxzQkFBUSxJQUpIO0FBS0wwRCw2QkFBZSxRQUxWO0FBTUxwQyxxQkFBTyx5QkFBUStELFNBTlY7QUFPTGYsMkJBQWEsQ0FQUjtBQVFMRix5QkFBVztBQVJOLGFBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBV0Usa0RBQU0sT0FBTyxFQUFDa0IsWUFBWSxDQUFiLEVBQWdCNUQsaUJBQWlCLHlCQUFRMkQsU0FBekMsRUFBb0RqSSxVQUFVLFVBQTlELEVBQTBFYSxPQUFPLENBQWpGLEVBQW9GRCxRQUFRQSxNQUE1RixFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQVhGO0FBWUU7QUFBQTtBQUFBLGNBQU0sT0FBTyxFQUFDc0gsWUFBWSxDQUFiLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVpGLFNBREM7QUFlRDtBQUFBO0FBQUE7QUFDRSxtQkFBTztBQUNMaEUsMEJBREs7QUFFTGxFLHdCQUFVLFVBRkw7QUFHTDRDLHNCQUFRO0FBSEgsYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNRyxrQ0FBUzlaLEtBQUtvSixVQUFMLENBQWdCLGFBQWhCLFdBQXNDbkQsV0FBdEMsTUFBVCxFQUErRCxDQUEvRDtBQU5IO0FBZkMsT0FMUDtBQThCRDs7OzhDQUUwQjBFLEksRUFBTVosSyxFQUFPK04sTSxFQUFRMUMsSyxFQUFPO0FBQUE7O0FBQ3JELFVBQUl2UyxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLDBDQUE4QnZHLFdBQTlCLFNBQTZDa0gsS0FEL0M7QUFFRSxxQkFBVSxpQ0FGWjtBQUdFLCtCQUFtQmxILFdBSHJCO0FBSUUsbUJBQVMsbUJBQU07QUFDYjtBQUNBLGdCQUFJOEgsS0FBSzNLLElBQUwsQ0FBVWtLLFlBQWQsRUFBNEI7QUFDMUIsc0JBQUswRixZQUFMLENBQWtCakYsS0FBSzNLLElBQXZCLEVBQTZCNkMsV0FBN0I7QUFDQSxzQkFBS3RDLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnNNLE1BQXJCLENBQTRCLGlCQUE1QixFQUErQyxDQUFDLFFBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0I4QixXQUFwQixDQUEvQyxFQUFpRixZQUFNLENBQUUsQ0FBekY7QUFDRCxhQUhELE1BR087QUFDTCxzQkFBSzJILFVBQUwsQ0FBZ0JHLEtBQUszSyxJQUFyQixFQUEyQjZDLFdBQTNCO0FBQ0Esc0JBQUt0QyxLQUFMLENBQVdVLFNBQVgsQ0FBcUJzTSxNQUFyQixDQUE0QixlQUE1QixFQUE2QyxDQUFDLFFBQUtoTixLQUFMLENBQVdRLE1BQVosRUFBb0I4QixXQUFwQixDQUE3QyxFQUErRSxZQUFNLENBQUUsQ0FBdkY7QUFDRDtBQUNGLFdBYkg7QUFjRSxpQkFBTztBQUNMZ1gscUJBQVMsT0FESjtBQUVMd0YseUJBQWEsT0FGUjtBQUdMdkgsb0JBQVFuTixLQUFLM0ssSUFBTCxDQUFVa0ssWUFBVixHQUF5QixDQUF6QixHQUE2QjROLE1BSGhDO0FBSUxDLG1CQUFPLE1BSkY7QUFLTGdDLG9CQUFRLFNBTEg7QUFNTDdDLHNCQUFVLFVBTkw7QUFPTDRDLG9CQUFRLElBUEg7QUFRTDBCLDZCQUFpQjdRLEtBQUszSyxJQUFMLENBQVVrSyxZQUFWLEdBQXlCLGFBQXpCLEdBQXlDLHlCQUFRb1YsVUFSN0Q7QUFTTDlCLDJCQUFlLEtBVFY7QUFVTCtCLHFCQUFVNVUsS0FBSzNLLElBQUwsQ0FBVXNQLFVBQVgsR0FBeUIsSUFBekIsR0FBZ0M7QUFWcEMsV0FkVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEwQkcsU0FBQzNFLEtBQUszSyxJQUFMLENBQVVrSyxZQUFYLElBQTJCO0FBQzFCLCtDQUFLLE9BQU87QUFDVmdOLHNCQUFVLFVBREE7QUFFVjRDLG9CQUFRLElBRkU7QUFHVjVSLGtCQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBSHpCO0FBSVZrTSxpQkFBSyxDQUpLO0FBS1Z1VCw2QkFBaUIseUJBQVE4RCxVQUxmO0FBTVZ2SCxtQkFBTyxFQU5HO0FBT1ZELG9CQUFRLEtBQUt0WCxLQUFMLENBQVd2RSxTQVBULEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBM0JKO0FBbUNFO0FBQUE7QUFBQSxZQUFLLE9BQU87QUFDVjRkLHVCQUFTLFlBREM7QUFFVjlCLHFCQUFPLEtBQUt2WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEdBRjFCO0FBR1YrYixzQkFBUSxTQUhFO0FBSVZaLHdCQUFVLFVBSkE7QUFLVjRDLHNCQUFRLENBTEU7QUFNVjBCLCtCQUFrQjdRLEtBQUszSyxJQUFMLENBQVVrSyxZQUFYLEdBQTJCLGFBQTNCLEdBQTJDLHlCQUFRb1Y7QUFOMUQsYUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRTtBQUFBO0FBQUEsY0FBSyxPQUFPLEVBQUV4SCxjQUFGLEVBQVVvRyxXQUFXLENBQUMsQ0FBdEIsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRTtBQUFBO0FBQUE7QUFDRSx1QkFBTztBQUNMa0IsOEJBQVk7QUFEUCxpQkFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFJSXpVLG1CQUFLM0ssSUFBTCxDQUFVa0ssWUFBWCxHQUNLO0FBQUE7QUFBQSxrQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRWpDLEtBQUssQ0FBUCxFQUFVQyxNQUFNLENBQUMsQ0FBakIsRUFBbEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXdELHlFQUFlLE9BQU8seUJBQVFxUyxJQUE5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeEQsZUFETCxHQUVLO0FBQUE7QUFBQSxrQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRXRTLEtBQUssQ0FBUCxFQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBOUM7QUFOUixhQURGO0FBVUcsaUJBQUt1WCx5QkFBTCxDQUErQjdVLElBQS9CO0FBVkg7QUFSRixTQW5DRjtBQXdERTtBQUFBO0FBQUEsWUFBSyxXQUFVLGtDQUFmLEVBQWtELE9BQU8sRUFBRWtQLFNBQVMsWUFBWCxFQUF5QjlCLE9BQU8sS0FBS3ZYLEtBQUwsQ0FBV3hFLGNBQTNDLEVBQTJEOGIsUUFBUSxTQUFuRSxFQUF6RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSSxXQUFDbk4sS0FBSzNLLElBQUwsQ0FBVWtLLFlBQVosR0FBNEIsS0FBS3VWLHVDQUFMLENBQTZDOVUsSUFBN0MsQ0FBNUIsR0FBaUY7QUFEcEY7QUF4REYsT0FERjtBQThERDs7O3NDQUVrQkEsSSxFQUFNWixLLEVBQU8rTixNLEVBQVExQyxLLEVBQU9zSyx1QixFQUF5QjtBQUFBOztBQUN0RSxVQUFJdlosWUFBWSxLQUFLQyxZQUFMLEVBQWhCO0FBQ0EsVUFBSXVaLFlBQVksb0NBQXFCaFYsS0FBS0QsUUFBTCxDQUFjL0csSUFBbkMsQ0FBaEI7QUFDQSxVQUFJZCxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxVQUFJbkQsY0FBZSxRQUFPMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWpCLE1BQWlDLFFBQWxDLEdBQThDLEtBQTlDLEdBQXNEMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWxGO0FBQ0EsVUFBSW5ELGVBQWU2SCxLQUFLRCxRQUFMLElBQWlCQyxLQUFLRCxRQUFMLENBQWMvRyxJQUFsRDs7QUFFQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGlDQUFxQm9HLEtBQXJCLFNBQThCbEgsV0FBOUIsU0FBNkNDLFlBRC9DO0FBRUUscUJBQVUsY0FGWjtBQUdFLGlCQUFPO0FBQ0xnViwwQkFESztBQUVMQyxtQkFBTyxLQUFLdlgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixLQUFLeUUsS0FBTCxDQUFXeEUsY0FGMUM7QUFHTGtNLGtCQUFNLENBSEQ7QUFJTHFYLHFCQUFVNVUsS0FBSzNLLElBQUwsQ0FBVXNQLFVBQVgsR0FBeUIsR0FBekIsR0FBK0IsR0FKbkM7QUFLTDRILHNCQUFVO0FBTEwsV0FIVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUE7QUFDRSxxQkFBUyxtQkFBTTtBQUNiO0FBQ0Esa0JBQUl4WiwyQkFBMkIsaUJBQU95TCxLQUFQLENBQWEsUUFBSzNJLEtBQUwsQ0FBVzlDLHdCQUF4QixDQUEvQjtBQUNBQSx1Q0FBeUJpTixLQUFLK0osVUFBOUIsSUFBNEMsQ0FBQ2hYLHlCQUF5QmlOLEtBQUsrSixVQUE5QixDQUE3QztBQUNBLHNCQUFLclMsUUFBTCxDQUFjO0FBQ1o3RSwrQkFBZSxJQURILEVBQ1M7QUFDckJDLDhCQUFjLElBRkYsRUFFUTtBQUNwQkM7QUFIWSxlQUFkO0FBS0QsYUFWSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXSWlOLGVBQUtnSyxnQkFBTixHQUNHO0FBQUE7QUFBQTtBQUNBLHFCQUFPO0FBQ0x1QywwQkFBVSxVQURMO0FBRUxhLHVCQUFPLEVBRkY7QUFHTDdQLHNCQUFNLEdBSEQ7QUFJTEQscUJBQUssQ0FBQyxDQUpEO0FBS0w2Uix3QkFBUSxJQUxIO0FBTUwrRCwyQkFBVyxPQU5OO0FBT0wvRix3QkFBUTtBQVBILGVBRFA7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUE7QUFBQTtBQUFBLGdCQUFNLFdBQVUsVUFBaEIsRUFBMkIsT0FBTyxFQUFFN1AsS0FBSyxDQUFDLENBQVIsRUFBV0MsTUFBTSxDQUFDLENBQWxCLEVBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF5RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF6RDtBQVZBLFdBREgsR0FhRyxFQXhCTjtBQTBCSSxXQUFDd1gsdUJBQUQsSUFBNEJDLGNBQWMsa0JBQTNDLElBQ0MsdUNBQUssT0FBTztBQUNWekksd0JBQVUsVUFEQTtBQUVWaFAsb0JBQU0sRUFGSTtBQUdWNlAscUJBQU8sQ0FIRztBQUlWK0Isc0JBQVEsSUFKRTtBQUtWNkMsMEJBQVksZUFBZSx5QkFBUXdDLFNBTHpCO0FBTVZySDtBQU5VLGFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBM0JKO0FBb0NFO0FBQUE7QUFBQTtBQUNFLHlCQUFVLDhCQURaO0FBRUUscUJBQU87QUFDTDhELHVCQUFPLENBREY7QUFFTDdELHVCQUFPLEtBQUt2WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRi9CO0FBR0wrYix3QkFBUSxLQUFLdFgsS0FBTCxDQUFXdkUsU0FIZDtBQUlMNGhCLDJCQUFXLE9BSk47QUFLTHJDLGlDQUFpQix5QkFBUUgsSUFMcEI7QUFNTHZCLHdCQUFRLElBTkg7QUFPTDVDLDBCQUFVLFVBUEw7QUFRTHlFLDRCQUFZLENBUlA7QUFTTG1DLDhCQUFjO0FBVFQsZUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhRTtBQUFBO0FBQUEsZ0JBQUssT0FBTztBQUNWOEIsaUNBQWUsV0FETDtBQUVWbkMsNEJBQVUsRUFGQTtBQUdWMUYseUJBQU8sRUFIRztBQUlWOEgsOEJBQVksQ0FKRjtBQUtWbEMseUJBQU8sT0FMRztBQU1WdkMseUJBQU8seUJBQVFiLElBTkw7QUFPVk4sNkJBQVcwRixjQUFjLGtCQUFkLEdBQW1DLGtCQUFuQyxHQUF3RCxpQkFQekQ7QUFRVnpJLDRCQUFVO0FBUkEsaUJBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUd5STtBQVZIO0FBYkY7QUFwQ0YsU0FWRjtBQXlFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLHNCQUFmO0FBQ0UsbUJBQU87QUFDTHpJLHdCQUFVLFVBREw7QUFFTGhQLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRjlCO0FBR0xnYyxxQkFBTyxFQUhGO0FBSUw5UCxtQkFBSyxDQUpBO0FBS0w2UCxzQkFBUSxLQUFLdFgsS0FBTCxDQUFXdkUsU0FBWCxHQUF1QixDQUwxQjtBQU1MNGhCLHlCQUFXO0FBTk4sYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTRTtBQUNFLG9CQUFRLElBRFY7QUFFRSxrQkFBTWxULElBRlI7QUFHRSxtQkFBT1osS0FIVDtBQUlFLG9CQUFRK04sTUFKVjtBQUtFLHVCQUFXM1IsU0FMYjtBQU1FLHVCQUFXLEtBQUt0RixVQU5sQjtBQU9FLDZCQUFpQixLQUFLTCxLQUFMLENBQVc1RCxlQVA5QjtBQVFFLDBCQUFjLEtBQUtpYixzQkFBTCxDQUE0QjFSLFNBQTVCLENBUmhCO0FBU0UsMEJBQWMsS0FBSzNGLEtBQUwsQ0FBVzdELG1CQVQzQjtBQVVFLHVCQUFXLEtBQUs2RCxLQUFMLENBQVd2RSxTQVZ4QjtBQVdFLDJCQUFlLEtBQUt1RSxLQUFMLENBQVdoRCxhQVg1QjtBQVlFLGdDQUFvQixLQUFLZ0QsS0FBTCxDQUFXM0Msa0JBWmpDO0FBYUUsNkJBQWlCLEtBQUsyQyxLQUFMLENBQVc1QyxlQWI5QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFURixTQXpFRjtBQWlHRTtBQUFBO0FBQUE7QUFDRSwyQkFBZSx1QkFBQ3NiLFlBQUQsRUFBa0I7QUFDL0JBLDJCQUFhQyxlQUFiO0FBQ0Esa0JBQUlDLGVBQWVGLGFBQWE3USxXQUFiLENBQXlCZ1IsT0FBNUM7QUFDQSxrQkFBSUMsZUFBZUYsZUFBZWpULFVBQVVnTSxHQUE1QztBQUNBLGtCQUFJcUgsZUFBZWhULEtBQUtDLEtBQUwsQ0FBVzZTLGVBQWVuVCxVQUFVK0UsSUFBcEMsQ0FBbkI7QUFDQSxrQkFBSXFPLFlBQVkvUyxLQUFLQyxLQUFMLENBQVk2UyxlQUFlblQsVUFBVStFLElBQTFCLEdBQWtDL0UsVUFBVUcsSUFBdkQsQ0FBaEI7QUFDQSxzQkFBSzVGLE9BQUwsQ0FBYStZLElBQWIsQ0FBa0I7QUFDaEI3VCxzQkFBTSxjQURVO0FBRWhCTyxvQ0FGZ0I7QUFHaEJ1VCx1QkFBT1IsYUFBYTdRLFdBSEo7QUFJaEJ4Rix3Q0FKZ0I7QUFLaEJDLDBDQUxnQjtBQU1oQmtELDhCQUFjLFFBQUt4RixLQUFMLENBQVc3RCxtQkFOVDtBQU9oQnljLDBDQVBnQjtBQVFoQkUsMENBUmdCO0FBU2hCRSwwQ0FUZ0I7QUFVaEJELG9DQVZnQjtBQVdoQnRUO0FBWGdCLGVBQWxCO0FBYUQsYUFwQkg7QUFxQkUsdUJBQVUsZ0NBckJaO0FBc0JFLHlCQUFhLHVCQUFNO0FBQ2pCLGtCQUFJakUsTUFBTTJJLEtBQUs5SCxXQUFMLEdBQW1CLEdBQW5CLEdBQXlCOEgsS0FBS0QsUUFBTCxDQUFjL0csSUFBakQ7QUFDQTtBQUNBLGtCQUFJLENBQUMsUUFBS25ELEtBQUwsQ0FBV2xELGFBQVgsQ0FBeUIwRSxHQUF6QixDQUFMLEVBQW9DO0FBQ2xDLG9CQUFJMUUsZ0JBQWdCLEVBQXBCO0FBQ0FBLDhCQUFjMEUsR0FBZCxJQUFxQixJQUFyQjtBQUNBLHdCQUFLSyxRQUFMLENBQWMsRUFBRS9FLDRCQUFGLEVBQWQ7QUFDRDtBQUNGLGFBOUJIO0FBK0JFLG1CQUFPO0FBQ0w0Wix3QkFBVSxVQURMO0FBRUxhLHFCQUFPLEtBQUt2WCxLQUFMLENBQVd4RSxjQUZiO0FBR0xrTSxvQkFBTSxLQUFLMUgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixDQUg5QixFQUdpQztBQUN0Q2tNLG1CQUFLLENBSkE7QUFLTDZQLHNCQUFRO0FBTEgsYUEvQlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBc0NHLGVBQUtnSSw4QkFBTCxDQUFvQzNaLFNBQXBDLEVBQStDd0UsSUFBL0MsRUFBcURaLEtBQXJELEVBQTREK04sTUFBNUQsRUFBb0UxQyxLQUFwRSxFQUEyRSxLQUFLNVUsS0FBTCxDQUFXNUMsZUFBdEY7QUF0Q0g7QUFqR0YsT0FERjtBQTRJRDs7O3FDQUVpQitNLEksRUFBTVosSyxFQUFPK04sTSxFQUFRMUMsSyxFQUFPc0ssdUIsRUFBeUI7QUFBQTs7QUFDckUsVUFBSXZaLFlBQVksS0FBS0MsWUFBTCxFQUFoQjtBQUNBLFVBQUl2RCxjQUFjOEgsS0FBSzNLLElBQUwsQ0FBVW9KLFVBQVYsQ0FBcUIsVUFBckIsQ0FBbEI7QUFDQSxVQUFJbkQsY0FBZSxRQUFPMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWpCLE1BQWlDLFFBQWxDLEdBQThDLEtBQTlDLEdBQXNEMEUsS0FBSzNLLElBQUwsQ0FBVWlHLFdBQWxGO0FBQ0EsVUFBSWlQLGNBQWN2SyxLQUFLdUssV0FBdkI7QUFDQSxVQUFJdFgsa0JBQWtCLEtBQUs0QyxLQUFMLENBQVc1QyxlQUFqQztBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UseUNBQTZCbU0sS0FBN0IsU0FBc0NsSCxXQUF0QyxTQUFxRHFTLFdBRHZEO0FBRUUscUJBQVUsc0JBRlo7QUFHRSxtQkFBUyxtQkFBTTtBQUNiO0FBQ0EsZ0JBQUl4WCwyQkFBMkIsaUJBQU95TCxLQUFQLENBQWEsUUFBSzNJLEtBQUwsQ0FBVzlDLHdCQUF4QixDQUEvQjtBQUNBQSxxQ0FBeUJpTixLQUFLK0osVUFBOUIsSUFBNEMsQ0FBQ2hYLHlCQUF5QmlOLEtBQUsrSixVQUE5QixDQUE3QztBQUNBLG9CQUFLclMsUUFBTCxDQUFjO0FBQ1o3RSw2QkFBZSxJQURIO0FBRVpDLDRCQUFjLElBRkY7QUFHWkM7QUFIWSxhQUFkO0FBS0QsV0FaSDtBQWFFLHlCQUFlLHVCQUFDd2IsWUFBRCxFQUFrQjtBQUMvQkEseUJBQWFDLGVBQWI7QUFDQSxnQkFBSXpiLDJCQUEyQixpQkFBT3lMLEtBQVAsQ0FBYSxRQUFLM0ksS0FBTCxDQUFXOUMsd0JBQXhCLENBQS9CO0FBQ0FBLHFDQUF5QmlOLEtBQUsrSixVQUE5QixJQUE0QyxDQUFDaFgseUJBQXlCaU4sS0FBSytKLFVBQTlCLENBQTdDO0FBQ0Esb0JBQUtyUyxRQUFMLENBQWM7QUFDWjdFLDZCQUFlLElBREg7QUFFWkMsNEJBQWMsSUFGRjtBQUdaQztBQUhZLGFBQWQ7QUFLRCxXQXRCSDtBQXVCRSxpQkFBTztBQUNMb2EsMEJBREs7QUFFTEMsbUJBQU8sS0FBS3ZYLEtBQUwsQ0FBV3pFLGVBQVgsR0FBNkIsS0FBS3lFLEtBQUwsQ0FBV3hFLGNBRjFDO0FBR0xrTSxrQkFBTSxDQUhEO0FBSUxxWCxxQkFBVTVVLEtBQUszSyxJQUFMLENBQVVzUCxVQUFYLEdBQXlCLEdBQXpCLEdBQStCLEdBSm5DO0FBS0w0SCxzQkFBVSxVQUxMO0FBTUw2QyxvQkFBUTtBQU5ILFdBdkJUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQStCRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxXQUFDMkYsdUJBQUQsSUFDQyx1Q0FBSyxPQUFPO0FBQ1Z4SSx3QkFBVSxVQURBO0FBRVZoUCxvQkFBTSxFQUZJO0FBR1Y2UCxxQkFBTyxDQUhHO0FBSVYrQixzQkFBUSxJQUpFO0FBS1Y2QywwQkFBWSxlQUFlLHlCQUFRd0MsU0FMekI7QUFNVnJIO0FBTlUsYUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFGSjtBQVdFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0xaLDBCQUFVLFVBREw7QUFFTGhQLHNCQUFNLEdBRkQ7QUFHTDZQLHVCQUFPLEVBSEY7QUFJTEQsd0JBQVE7QUFKSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9FO0FBQUE7QUFBQSxnQkFBTSxXQUFVLFVBQWhCLEVBQTJCLE9BQU8sRUFBRTdQLEtBQUssQ0FBQyxDQUFSLEVBQVdDLE1BQU0sQ0FBQyxDQUFsQixFQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBeUQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBekQ7QUFQRixXQVhGO0FBb0JFO0FBQUE7QUFBQTtBQUNFLHlCQUFVLHNDQURaO0FBRUUscUJBQU87QUFDTGdQLDBCQUFVLFVBREw7QUFFTDBFLHVCQUFPLENBRkY7QUFHTDdELHVCQUFPLEtBQUt2WCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBSC9CO0FBSUwrYix3QkFBUSxLQUFLdFgsS0FBTCxDQUFXdkUsU0FKZDtBQUtMMGYsNEJBQVksQ0FMUDtBQU1MbUMsOEJBQWMsRUFOVDtBQU9MdEMsaUNBQWlCLHlCQUFRSCxJQVBwQjtBQVFMdkIsd0JBQVEsSUFSSDtBQVNMK0QsMkJBQVc7QUFUTixlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFFO0FBQUE7QUFBQSxnQkFBTSxPQUFPO0FBQ1grQixpQ0FBZSxXQURKO0FBRVhuQyw0QkFBVSxFQUZDO0FBR1hyQyx5QkFBTyx5QkFBUWY7QUFISixpQkFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLR25GO0FBTEg7QUFiRjtBQXBCRixTQS9CRjtBQXlFRTtBQUFBO0FBQUEsWUFBSyxXQUFVLDhCQUFmO0FBQ0UsbUJBQU87QUFDTGdDLHdCQUFVLFVBREw7QUFFTGhQLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd6RSxlQUFYLEdBQTZCLEVBRjlCO0FBR0xnYyxxQkFBTyxFQUhGO0FBSUw5UCxtQkFBSyxDQUpBO0FBS0w2UCxzQkFBUSxFQUxIO0FBTUwrRix5QkFBVztBQU5OLGFBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBU0U7QUFDRSxvQkFBUSxJQURWO0FBRUUsa0JBQU1sVCxJQUZSO0FBR0UsbUJBQU9aLEtBSFQ7QUFJRSxvQkFBUStOLE1BSlY7QUFLRSx1QkFBVzNSLFNBTGI7QUFNRSx1QkFBVyxLQUFLdEYsVUFObEI7QUFPRSw2QkFBaUIsS0FBS0wsS0FBTCxDQUFXNUQsZUFQOUI7QUFRRSwwQkFBYyxLQUFLaWIsc0JBQUwsQ0FBNEIxUixTQUE1QixDQVJoQjtBQVNFLDBCQUFjLEtBQUszRixLQUFMLENBQVc3RCxtQkFUM0I7QUFVRSx1QkFBVyxLQUFLNkQsS0FBTCxDQUFXdkUsU0FWeEI7QUFXRSxnQ0FBb0IsS0FBS3VFLEtBQUwsQ0FBVzNDLGtCQVhqQztBQVlFLDZCQUFpQkQsZUFabkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVEYsU0F6RUY7QUFnR0U7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsd0NBRFo7QUFFRSxtQkFBTztBQUNMb2Esd0JBQVUsUUFETDtBQUVMZCx3QkFBVSxVQUZMO0FBR0xhLHFCQUFPLEtBQUt2WCxLQUFMLENBQVd4RSxjQUhiO0FBSUxrTSxvQkFBTSxLQUFLMUgsS0FBTCxDQUFXekUsZUFBWCxHQUE2QixDQUo5QixFQUlpQztBQUN0Q2tNLG1CQUFLLENBTEE7QUFNTDZQLHNCQUFRO0FBTkgsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRyxlQUFLRyxtQ0FBTCxDQUF5QzlSLFNBQXpDLEVBQW9EdEQsV0FBcEQsRUFBaUVvRCxXQUFqRSxFQUE4RSxDQUFDMEUsSUFBRCxDQUE5RSxFQUFzRi9NLGVBQXRGLEVBQXVHLFVBQUN5WSxJQUFELEVBQU9DLElBQVAsRUFBYXBSLElBQWIsRUFBbUJ5UixZQUFuQixFQUFpQ0MsYUFBakMsRUFBZ0Q3TSxLQUFoRCxFQUEwRDtBQUNoSyxnQkFBSW1PLGdCQUFnQixFQUFwQjtBQUNBLGdCQUFJNUIsS0FBS0ksS0FBVCxFQUFnQjtBQUNkd0IsNEJBQWN6VixJQUFkLENBQW1CLFFBQUswVixvQkFBTCxDQUEwQmhTLFNBQTFCLEVBQXFDdEQsV0FBckMsRUFBa0RvRCxXQUFsRCxFQUErRHFRLEtBQUszUyxJQUFwRSxFQUEwRS9GLGVBQTFFLEVBQTJGeVksSUFBM0YsRUFBaUdDLElBQWpHLEVBQXVHcFIsSUFBdkcsRUFBNkd5UixZQUE3RyxFQUEySEMsYUFBM0gsRUFBMEksQ0FBMUksRUFBNkksRUFBRXdCLFdBQVcsSUFBYixFQUFtQmdDLG1CQUFtQixJQUF0QyxFQUE3SSxDQUFuQjtBQUNELGFBRkQsTUFFTztBQUNMLGtCQUFJbFYsSUFBSixFQUFVO0FBQ1JnVCw4QkFBY3pWLElBQWQsQ0FBbUIsUUFBSzZWLGtCQUFMLENBQXdCblMsU0FBeEIsRUFBbUN0RCxXQUFuQyxFQUFnRG9ELFdBQWhELEVBQTZEcVEsS0FBSzNTLElBQWxFLEVBQXdFL0YsZUFBeEUsRUFBeUZ5WSxJQUF6RixFQUErRkMsSUFBL0YsRUFBcUdwUixJQUFyRyxFQUEyR3lSLFlBQTNHLEVBQXlIQyxhQUF6SCxFQUF3SSxDQUF4SSxFQUEySSxFQUFFd0IsV0FBVyxJQUFiLEVBQW1CZ0MsbUJBQW1CLElBQXRDLEVBQTNJLENBQW5CO0FBQ0Q7QUFDRCxrQkFBSSxDQUFDL0QsSUFBRCxJQUFTLENBQUNBLEtBQUtLLEtBQW5CLEVBQTBCO0FBQ3hCd0IsOEJBQWN6VixJQUFkLENBQW1CLFFBQUs4VixrQkFBTCxDQUF3QnBTLFNBQXhCLEVBQW1DdEQsV0FBbkMsRUFBZ0RvRCxXQUFoRCxFQUE2RHFRLEtBQUszUyxJQUFsRSxFQUF3RS9GLGVBQXhFLEVBQXlGeVksSUFBekYsRUFBK0ZDLElBQS9GLEVBQXFHcFIsSUFBckcsRUFBMkd5UixZQUEzRyxFQUF5SEMsYUFBekgsRUFBd0ksQ0FBeEksRUFBMkksRUFBRXdCLFdBQVcsSUFBYixFQUFtQmdDLG1CQUFtQixJQUF0QyxFQUEzSSxDQUFuQjtBQUNEO0FBQ0Y7QUFDRCxtQkFBT2xDLGFBQVA7QUFDRCxXQWJBO0FBVkg7QUFoR0YsT0FERjtBQTRIRDs7QUFFRDs7Ozt3Q0FDcUI5QyxLLEVBQU87QUFBQTs7QUFDMUIsVUFBSSxDQUFDLEtBQUs1VSxLQUFMLENBQVdvQixRQUFoQixFQUEwQixPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFFBQVA7O0FBRTFCLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVUsbUJBRFo7QUFFRSxpQkFBTyxpQkFBT25CLE1BQVAsQ0FBYyxFQUFkLEVBQWtCO0FBQ3ZCeVcsc0JBQVU7QUFEYSxXQUFsQixDQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtHOUIsY0FBTW5DLEdBQU4sQ0FBVSxVQUFDdEksSUFBRCxFQUFPWixLQUFQLEVBQWlCO0FBQzFCLGNBQU0yViwwQkFBMEIvVSxLQUFLNEYsUUFBTCxDQUFjblEsTUFBZCxHQUF1QixDQUF2QixJQUE0QnVLLEtBQUtaLEtBQUwsS0FBZVksS0FBSzRGLFFBQUwsQ0FBY25RLE1BQWQsR0FBdUIsQ0FBbEc7QUFDQSxjQUFJdUssS0FBS3dLLFNBQVQsRUFBb0I7QUFDbEIsbUJBQU8sUUFBSzRLLGdCQUFMLENBQXNCcFYsSUFBdEIsRUFBNEJaLEtBQTVCLEVBQW1DLFFBQUt2SixLQUFMLENBQVd2RSxTQUE5QyxFQUF5RG1aLEtBQXpELEVBQWdFc0ssdUJBQWhFLENBQVA7QUFDRCxXQUZELE1BRU8sSUFBSS9VLEtBQUtWLFVBQVQsRUFBcUI7QUFDMUIsbUJBQU8sUUFBSytWLGlCQUFMLENBQXVCclYsSUFBdkIsRUFBNkJaLEtBQTdCLEVBQW9DLFFBQUt2SixLQUFMLENBQVd2RSxTQUEvQyxFQUEwRG1aLEtBQTFELEVBQWlFc0ssdUJBQWpFLENBQVA7QUFDRCxXQUZNLE1BRUE7QUFDTCxtQkFBTyxRQUFLTyx5QkFBTCxDQUErQnRWLElBQS9CLEVBQXFDWixLQUFyQyxFQUE0QyxRQUFLdkosS0FBTCxDQUFXdkUsU0FBdkQsRUFBa0VtWixLQUFsRSxDQUFQO0FBQ0Q7QUFDRixTQVRBO0FBTEgsT0FERjtBQWtCRDs7OzZCQUVTO0FBQUE7O0FBQ1IsV0FBSzVVLEtBQUwsQ0FBV21KLGlCQUFYLEdBQStCLEtBQUt1VyxvQkFBTCxFQUEvQjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsZUFBSSxXQUROO0FBRUUsY0FBRyxVQUZMO0FBR0UscUJBQVUsV0FIWjtBQUlFLGlCQUFPO0FBQ0xoSixzQkFBVSxVQURMO0FBRUxzRSw2QkFBaUIseUJBQVFILElBRnBCO0FBR0xELG1CQUFPLHlCQUFRYixJQUhWO0FBSUx0UyxpQkFBSyxDQUpBO0FBS0xDLGtCQUFNLENBTEQ7QUFNTDRQLG9CQUFRLG1CQU5IO0FBT0xDLG1CQUFPLE1BUEY7QUFRTG9JLHVCQUFXLFFBUk47QUFTTEMsdUJBQVc7QUFUTixXQUpUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWVHLGFBQUs1ZixLQUFMLENBQVdyRCxvQkFBWCxJQUNDLHdDQUFNLFdBQVUsV0FBaEIsRUFBNEIsT0FBTztBQUNqQytaLHNCQUFVLFVBRHVCO0FBRWpDWSxvQkFBUSxNQUZ5QjtBQUdqQ0MsbUJBQU8sQ0FIMEI7QUFJakM3UCxrQkFBTSxHQUoyQjtBQUtqQzRSLG9CQUFRLElBTHlCO0FBTWpDN1IsaUJBQUssQ0FONEI7QUFPakMrVSx1QkFBVztBQVBzQixXQUFuQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFoQko7QUEwQkcsYUFBS3FELGlCQUFMLEVBMUJIO0FBMkJFO0FBQUE7QUFBQTtBQUNFLGlCQUFJLFlBRE47QUFFRSxnQkFBRyxlQUZMO0FBR0UsbUJBQU87QUFDTG5KLHdCQUFVLFVBREw7QUFFTGpQLG1CQUFLLEVBRkE7QUFHTEMsb0JBQU0sQ0FIRDtBQUlMNlAscUJBQU8sTUFKRjtBQUtMcUUsNkJBQWUsS0FBSzViLEtBQUwsQ0FBV3RELDBCQUFYLEdBQXdDLE1BQXhDLEdBQWlELE1BTDNEO0FBTUxvZSxnQ0FBa0IsS0FBSzlhLEtBQUwsQ0FBV3RELDBCQUFYLEdBQXdDLE1BQXhDLEdBQWlELE1BTjlEO0FBT0w4aEIsc0JBQVEsQ0FQSDtBQVFMbUIseUJBQVcsTUFSTjtBQVNMQyx5QkFBVztBQVROLGFBSFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBY0csZUFBS0UsbUJBQUwsQ0FBeUIsS0FBSzlmLEtBQUwsQ0FBV21KLGlCQUFwQztBQWRILFNBM0JGO0FBMkNHLGFBQUs0VyxvQkFBTCxFQTNDSDtBQTRDRTtBQUNFLGVBQUksaUJBRE47QUFFRSx1QkFBYSxJQUZmO0FBR0UseUJBQWUsS0FBSy9mLEtBQUwsQ0FBV2hELGFBSDVCO0FBSUUsd0JBQWMsS0FBS2dELEtBQUwsQ0FBVy9DLFlBSjNCO0FBS0UseUJBQWUsdUJBQUMraUIsY0FBRCxFQUFvQjtBQUNqQ3hjLG9CQUFRQyxJQUFSLENBQWEsMEJBQWIsRUFBeUN3YyxLQUFLQyxTQUFMLENBQWVGLGNBQWYsQ0FBekM7O0FBRUEsb0JBQUs5WixtQ0FBTCxDQUNFLHFDQUFtQixRQUFLbEcsS0FBTCxDQUFXL0MsWUFBOUIsQ0FERixFQUVFLFFBQUsrQyxLQUFMLENBQVc3RCxtQkFGYixFQUdFLFFBQUs2RCxLQUFMLENBQVcvQyxZQUFYLENBQXdCdUMsSUFBeEIsQ0FBNkJpRyxXQUgvQixFQUlFLHNDQUFvQixRQUFLekYsS0FBTCxDQUFXL0MsWUFBL0IsQ0FKRixFQUtFLFFBQUtvYSxzQkFBTCxDQUE0QixRQUFLelIsWUFBTCxFQUE1QixDQUxGLEVBTUVvYSxjQU5GLEVBT0UsS0FBTSxDQVBSLEVBT1k7QUFDVixpQkFBTSxDQVJSLEVBUVk7QUFDVixpQkFBTSxDQVRSLENBU1c7QUFUWDtBQVdELFdBbkJIO0FBb0JFLDRCQUFrQiw0QkFBTTtBQUN0QixvQkFBS25lLFFBQUwsQ0FBYztBQUNaNUUsNEJBQWMsUUFBSytDLEtBQUwsQ0FBV2hEO0FBRGIsYUFBZDtBQUdELFdBeEJIO0FBeUJFLCtCQUFxQiw2QkFBQ21qQixNQUFELEVBQVNDLE9BQVQsRUFBcUI7QUFDeEMsZ0JBQUlqVyxPQUFPLFFBQUtuSyxLQUFMLENBQVdoRCxhQUF0QjtBQUNBLGdCQUFJMEgsT0FBTywrQkFBYXlGLElBQWIsRUFBbUJnVyxNQUFuQixDQUFYO0FBQ0EsZ0JBQUl6YixJQUFKLEVBQVU7QUFDUixzQkFBSzdDLFFBQUwsQ0FBYztBQUNaNUUsOEJBQWVtakIsT0FBRCxHQUFZMWIsSUFBWixHQUFtQixJQURyQjtBQUVaMUgsK0JBQWUwSDtBQUZILGVBQWQ7QUFJRDtBQUNGLFdBbENIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTVDRixPQURGO0FBa0ZEOzs7O0VBcm1Gb0IsZ0JBQU0yYixTOztrQkF3bUZkdmdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBleHByZXNzaW9uVG9STyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL2V4cHJlc3Npb25Ub1JPJ1xuXG5pbXBvcnQgVGltZWxpbmVQcm9wZXJ0eSBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvVGltZWxpbmVQcm9wZXJ0eSdcbmltcG9ydCBCeXRlY29kZUFjdGlvbnMgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL2FjdGlvbnMnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcblxuaW1wb3J0IHtcbiAgbGlua0V4dGVybmFsQXNzZXRzT25Ecm9wLFxuICBwcmV2ZW50RGVmYXVsdERyYWdcbn0gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvZG5kSGVscGVycydcblxuaW1wb3J0IHtcbiAgbmV4dFByb3BJdGVtLFxuICBnZXRJdGVtQ29tcG9uZW50SWQsXG4gIGdldEl0ZW1Qcm9wZXJ0eU5hbWVcbn0gZnJvbSAnLi9oZWxwZXJzL0l0ZW1IZWxwZXJzJ1xuXG5pbXBvcnQgZ2V0TWF4aW11bU1zIGZyb20gJy4vaGVscGVycy9nZXRNYXhpbXVtTXMnXG5pbXBvcnQgbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSBmcm9tICcuL2hlbHBlcnMvbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSdcbmltcG9ydCBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMgZnJvbSAnLi9oZWxwZXJzL2NsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcydcbmltcG9ydCBodW1hbml6ZVByb3BlcnR5TmFtZSBmcm9tICcuL2hlbHBlcnMvaHVtYW5pemVQcm9wZXJ0eU5hbWUnXG5pbXBvcnQgZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IgZnJvbSAnLi9oZWxwZXJzL2dldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yJ1xuaW1wb3J0IGdldE1pbGxpc2Vjb25kTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0TWlsbGlzZWNvbmRNb2R1bHVzJ1xuaW1wb3J0IGdldEZyYW1lTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0RnJhbWVNb2R1bHVzJ1xuaW1wb3J0IGZvcm1hdFNlY29uZHMgZnJvbSAnLi9oZWxwZXJzL2Zvcm1hdFNlY29uZHMnXG5pbXBvcnQgcm91bmRVcCBmcm9tICcuL2hlbHBlcnMvcm91bmRVcCdcblxuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vaGVscGVycy90cnVuY2F0ZSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgS2V5ZnJhbWVTVkcgZnJvbSAnLi9pY29ucy9LZXlmcmFtZVNWRydcblxuaW1wb3J0IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufSBmcm9tICcuL2ljb25zL0N1cnZlU1ZHUydcblxuaW1wb3J0IERvd25DYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9Eb3duQ2Fycm90U1ZHJ1xuaW1wb3J0IFJpZ2h0Q2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvUmlnaHRDYXJyb3RTVkcnXG5pbXBvcnQgQ29udHJvbHNBcmVhIGZyb20gJy4vQ29udHJvbHNBcmVhJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vQ29udGV4dE1lbnUnXG5pbXBvcnQgRXhwcmVzc2lvbklucHV0IGZyb20gJy4vRXhwcmVzc2lvbklucHV0J1xuaW1wb3J0IENsdXN0ZXJJbnB1dEZpZWxkIGZyb20gJy4vQ2x1c3RlcklucHV0RmllbGQnXG5pbXBvcnQgUHJvcGVydHlJbnB1dEZpZWxkIGZyb20gJy4vUHJvcGVydHlJbnB1dEZpZWxkJ1xuXG4vKiB6LWluZGV4IGd1aWRlXG4gIGtleWZyYW1lOiAxMDAyXG4gIHRyYW5zaXRpb24gYm9keTogMTAwMlxuICBrZXlmcmFtZSBkcmFnZ2VyczogMTAwM1xuICBpbnB1dHM6IDEwMDQsICgxMDA1IGFjdGl2ZSlcbiAgdHJpbS1hcmVhIDEwMDZcbiAgc2NydWJiZXI6IDEwMDZcbiAgYm90dG9tIGNvbnRyb2xzOiAxMDAwMCA8LSBrYS1ib29tIVxuKi9cblxudmFyIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBwcm9wZXJ0aWVzV2lkdGg6IDMwMCxcbiAgdGltZWxpbmVzV2lkdGg6IDg3MCxcbiAgcm93SGVpZ2h0OiAyNSxcbiAgaW5wdXRDZWxsV2lkdGg6IDc1LFxuICBtZXRlckhlaWdodDogMjUsXG4gIGNvbnRyb2xzSGVpZ2h0OiA0MixcbiAgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCA2MF0sXG4gIGN1cnJlbnRGcmFtZTogMCxcbiAgbWF4RnJhbWU6IG51bGwsXG4gIGR1cmF0aW9uVHJpbTogMCxcbiAgZnJhbWVzUGVyU2Vjb25kOiA2MCxcbiAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJywgLy8gb3IgJ2ZyYW1lcydcbiAgY3VycmVudFRpbWVsaW5lTmFtZTogJ0RlZmF1bHQnLFxuICBpc1BsYXllclBsYXlpbmc6IGZhbHNlLFxuICBwbGF5ZXJQbGF5YmFja1NwZWVkOiAxLjAsXG4gIGlzU2hpZnRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb21tYW5kS2V5RG93bjogZmFsc2UsXG4gIGlzQ29udHJvbEtleURvd246IGZhbHNlLFxuICBpc0FsdEtleURvd246IGZhbHNlLFxuICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UsXG4gIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSxcbiAgc2VsZWN0ZWROb2Rlczoge30sXG4gIGV4cGFuZGVkTm9kZXM6IHt9LFxuICBhY3RpdmF0ZWRSb3dzOiB7fSxcbiAgaGlkZGVuTm9kZXM6IHt9LFxuICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyczoge30sXG4gIGFjdGl2ZUtleWZyYW1lczogW10sXG4gIHJlaWZpZWRCeXRlY29kZTogbnVsbCxcbiAgc2VyaWFsaXplZEJ5dGVjb2RlOiBudWxsXG59XG5cbmNvbnN0IENVUlZFU1ZHUyA9IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufVxuXG5jb25zdCBUSFJPVFRMRV9USU1FID0gMTcgLy8gbXNcblxuZnVuY3Rpb24gdmlzaXQgKG5vZGUsIHZpc2l0b3IpIHtcbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV1cbiAgICAgIGlmIChjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZpc2l0b3IoY2hpbGQpXG4gICAgICAgIHZpc2l0KGNoaWxkLCB2aXNpdG9yKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBUaW1lbGluZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IGxvZGFzaC5hc3NpZ24oe30sIERFRkFVTFRTKVxuICAgIHRoaXMuY3R4bWVudSA9IG5ldyBDb250ZXh0TWVudSh3aW5kb3csIHRoaXMpXG5cbiAgICB0aGlzLmVtaXR0ZXJzID0gW10gLy8gQXJyYXk8e2V2ZW50RW1pdHRlcjpFdmVudEVtaXR0ZXIsIGV2ZW50TmFtZTpzdHJpbmcsIGV2ZW50SGFuZGxlcjpGdW5jdGlvbn0+XG5cbiAgICB0aGlzLl9jb21wb25lbnQgPSBuZXcgQWN0aXZlQ29tcG9uZW50KHtcbiAgICAgIGFsaWFzOiAndGltZWxpbmUnLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHVzZXJjb25maWc6IHRoaXMucHJvcHMudXNlcmNvbmZpZyxcbiAgICAgIHdlYnNvY2tldDogdGhpcy5wcm9wcy53ZWJzb2NrZXQsXG4gICAgICBwbGF0Zm9ybTogd2luZG93LFxuICAgICAgZW52b3k6IHRoaXMucHJvcHMuZW52b3ksXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgLy8gU2luY2Ugd2Ugc3RvcmUgYWNjdW11bGF0ZWQga2V5ZnJhbWUgbW92ZW1lbnRzLCB3ZSBjYW4gc2VuZCB0aGUgd2Vic29ja2V0IHVwZGF0ZSBpbiBiYXRjaGVzO1xuICAgIC8vIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIGF2b2lkcyB1bm5lY2Vzc2FyeSB1cGRhdGVzIHRvIHRoZSBvdmVyIHZpZXdzXG4gICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gPSBsb2Rhc2gudGhyb3R0bGUodGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24uYmluZCh0aGlzKSwgMjUwKVxuICAgIHRoaXMudXBkYXRlU3RhdGUgPSB0aGlzLnVwZGF0ZVN0YXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHdpbmRvdy50aW1lbGluZSA9IHRoaXNcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHByZXZlbnREZWZhdWx0RHJhZywgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AuYmluZCh0aGlzKSwgZmFsc2UpXG4gIH1cblxuICBmbHVzaFVwZGF0ZXMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVwZGF0ZXMpLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnVwZGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW2tleV0gIT09IHRoaXMudXBkYXRlc1trZXldKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlc1trZXldID0gdGhpcy51cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHRoaXMuY2FsbGJhY2tzLnNwbGljZSgwKVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy51cGRhdGVzLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2hhbmdlcygpXG4gICAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKCkpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICh1cGRhdGVzLCBjYikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlc1trZXldID0gdXBkYXRlc1trZXldXG4gICAgfVxuICAgIGlmIChjYikge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYilcbiAgICB9XG4gICAgdGhpcy5mbHVzaFVwZGF0ZXMoKVxuICB9XG5cbiAgY2xlYXJDaGFuZ2VzICgpIHtcbiAgICBmb3IgKGNvbnN0IGsxIGluIHRoaXMudXBkYXRlcykgZGVsZXRlIHRoaXMudXBkYXRlc1trMV1cbiAgICBmb3IgKGNvbnN0IGsyIGluIHRoaXMuY2hhbmdlcykgZGVsZXRlIHRoaXMuY2hhbmdlc1trMl1cbiAgfVxuXG4gIHVwZGF0ZVRpbWUgKGN1cnJlbnRGcmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RnJhbWUgfSlcbiAgfVxuXG4gIHNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSB7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfVxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIHVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IG51bGxcbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICAvKlxuICAgKiBsaWZlY3ljbGUvZXZlbnRzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAvLyBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzIGFuZCByZWFjdCB3YXJuaW5nc1xuICAgIHRoaXMuZW1pdHRlcnMuZm9yRWFjaCgodHVwbGUpID0+IHtcbiAgICAgIHR1cGxlWzBdLnJlbW92ZUxpc3RlbmVyKHR1cGxlWzFdLCB0dXBsZVsyXSlcbiAgICB9KVxuICAgIHRoaXMuc3RhdGUuZGlkTW91bnQgPSBmYWxzZVxuXG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnYmVnaW4nKTtcbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnZW5kJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWRNb3VudDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCB9KVxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1RJTUUpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5wcm9wcy53ZWJzb2NrZXQsICdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZm9sZGVyICE9PSB0aGlzLnByb3BzLmZvbGRlcikgcmV0dXJuIHZvaWQgKDApXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzogcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gYWN0aW9uIHJlY2VpdmVkJywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCB1cGRhdGVkJywgbWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKVxuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBjbGVhciBjYWNoZXMgdGhlbiB0aGUgdGltZWxpbmUgZmllbGRzIG1pZ2h0IG5vdCB1cGRhdGUgcmlnaHQgYWZ0ZXIga2V5ZnJhbWUgZGVsZXRpb25zXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcblxuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG5cbiAgICAgIGlmIChtYXliZU1ldGFkYXRhICYmIG1heWJlTWV0YWRhdGEuZnJvbSAhPT0gJ3RpbWVsaW5lJykge1xuICAgICAgICBpZiAobWF5YmVDb21wb25lbnRJZHMgJiYgbWF5YmVUaW1lbGluZU5hbWUgJiYgbWF5YmVQcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgbWF5YmVDb21wb25lbnRJZHMuZm9yRWFjaCgoY29tcG9uZW50SWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZShjb21wb25lbnRJZCwgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lIHx8IDAsIG1heWJlUHJvcGVydHlOYW1lcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uU2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCB1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblVuc2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IG1vdW50ZWQnLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnJlaHlkcmF0ZUJ5dGVjb2RlKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKVxuICAgICAgLy8gdGhpcy51cGRhdGVUaW1lKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lKVxuICAgIH0pXG5cbiAgICAvLyBjb21wb25lbnQ6bW91bnRlZCBmaXJlcyB3aGVuIHRoaXMgZmluaXNoZXMgd2l0aG91dCBlcnJvclxuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGllbnQubmV4dCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBsZXQgZWRpdGFibGUgPSBwYXN0ZUV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIC8vIE91ciBpbnB1dCBmaWVsZHMgYXJlIDxzcGFuPnNcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScgfHwgZWRpdGFibGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIHZpYSBkZWZhdWx0JylcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBhIHByb3BlcnR5IGlucHV0LCBzbyBsZXQgdGhlIGRlZmF1bHQgYWN0aW9uIGhhcHBlblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY2hlY2sgbGVzcyBicml0dGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgZGVsZWdhdGVkIHRvIHBsdW1iaW5nJylcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY3JlYXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zLyogdmFsdWUsIGN1cnZlLCBlbmRtcywgZW5kdmFsdWUgKi8pXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdzcGxpdFNlZ21lbnQnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2pvaW5LZXlmcmFtZXMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdkZWxldGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY2hhbmdlU2VnbWVudEN1cnZlJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6dGljaycsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgd2UgZ290IGEgdGljaywgd2hpY2ggb2NjdXJzIGR1cmluZyBUaW1lbGluZSBtb2RlbCB1cGRhdGluZywgdGhlbiB3ZSB3YW50IHRvIHBhdXNlIGl0IGlmIHRoZSBzY3J1YmJlclxuICAgICAgLy8gaGFzIGFycml2ZWQgYXQgdGhlIG1heGltdW0gYWNjZXB0aWJsZSBmcmFtZSBpbiB0aGUgdGltZWxpbmUuXG4gICAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUGxheWVyUGxheWluZzogZmFsc2V9KVxuICAgICAgfVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOmF1dGhvcml0YXRpdmUtZnJhbWUtc2V0JywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAndGltZWxpbmUnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChuYXRpdmVFdmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGN1cnJlbnRseSBhY3RpdmUgZXhwcmVzc2lvbiBpbnB1dCBhIGNoYW5jZSB0byBjYXB0dXJlIHRoaXMgZXZlbnQgYW5kIHNob3J0IGNpcmN1aXQgdXMgaWYgc29cbiAgICBpZiAodGhpcy5yZWZzLmV4cHJlc3Npb25JbnB1dC53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQobmF0aXZlRXZlbnQpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoaXQgdGhlIHNwYWNlYmFyIF9hbmRfIHdlIGFyZW4ndCBpbnNpZGUgYW4gaW5wdXQgZmllbGQsIHRyZWF0IHRoYXQgbGlrZSBhIHBsYXliYWNrIHRyaWdnZXJcbiAgICBpZiAobmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gMzIgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0OmZvY3VzJykpIHtcbiAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzU2hpZnRLZXlEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXSwgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKDApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oLTEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoLTEpXG4gICAgICAgIH1cblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cpIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogdHJ1ZSB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKDEpXG4gICAgICAgIH1cblxuICAgICAgLy8gY2FzZSAzODogLy8gdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5qb2luS2V5ZnJhbWVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignam9pbktleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zLCBmcmFtZUluZm8pXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICBpZiAoT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3ZlcykubGVuZ3RoID4gMCkge1xuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEl0J3MgdmVyeSBoZWF2eSB0byB0cmFuc21pdCBhIHdlYnNvY2tldCBtZXNzYWdlIGZvciBldmVyeSBzaW5nbGUgbW92ZW1lbnQgd2hpbGUgdXBkYXRpbmcgdGhlIHVpLFxuICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSB0aGlzLl9rZXlmcmFtZU1vdmVzID0ge31cbiAgICAgIGxldCBtb3ZlbWVudEtleSA9IFtjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWVdLmpvaW4oJy0nKVxuICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uKClcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVwc2VydEZyb21Ob2RlV2l0aENvbXBvbmVudENhY2hlZChub2RlLCBwYXJlbnQsIHRoaXMuX2NvbXBvbmVudCwge30pXG5cbiAgICAgIGNvbnN0IGlzQ29tcG9uZW50ID0gZWxlbWVudC5pc0NvbXBvbmVudCgpXG4gICAgICBjb25zdCBlbGVtZW50TmFtZSA9IGVsZW1lbnQuZ2V0TmFtZVN0cmluZygpXG4gICAgICBjb25zdCBjb21wb25lbnRJZCA9IGVsZW1lbnQuZ2V0Q29tcG9uZW50SWQoKVxuXG4gICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9faXNFeHBhbmRlZCAmJiAodGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5BTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgY29uc3QgZG9Hb0RlZXAgPSBsb2NhdG9yLmxlbmd0aCA9PT0gMyAvLyAwLjAsIDAuMSwgZXRjXG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBPYmplY3QudmFsdWVzKGVsZW1lbnQuZ2V0QWRkcmVzc2FibGVQcm9wZXJ0aWVzKGRvR29EZWVwKSlcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0ge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQsXG4gICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICBwYXJlbnQsXG4gICAgICAgICAgICAgICAgbG9jYXRvcixcbiAgICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgICBzaWJsaW5ncyxcbiAgICAgICAgICAgICAgICBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXJLZXksXG4gICAgICAgICAgICAgICAgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLFxuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcsXG4gICAgICAgICAgICAgICAgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLFxuICAgICAgICAgICAgICAgIGlzUHJvcGVydHk6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIGNsdXN0ZXIsIHNoaWZ0aW5nIHRoZSBpbmRleCBmb3J3YXJkIHNvIHdlIGRvbid0IHJlLXJlbmRlciB0aGUgaW5kaXZpZHVhbHMgb24gdGhlIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgIGxldCBjbHVzdGVyU2V0ID0gW3Byb3BlcnR5R3JvdXBEZXNjcmlwdG9yXVxuICAgICAgICAgICAgICAgIC8vIExvb2sgYWhlYWQgYnkgYSBmZXcgc3RlcHMgaW4gdGhlIGFycmF5IGFuZCBzZWUgaWYgdGhlIG5leHQgZWxlbWVudCBpcyBhIG1lbWJlciBvZiB0aGUgY3VycmVudCBjbHVzdGVyXG4gICAgICAgICAgICAgIGxldCBrID0gaSAvLyBUZW1wb3Jhcnkgc28gd2UgY2FuIGluY3JlbWVudCBgaWAgaW4gcGxhY2VcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gaiArIGtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtuZXh0SW5kZXhdXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV4dCB0aGluZyBpbiB0aGUgbGlzdCBzaGFyZXMgdGhlIHNhbWUgY2x1c3RlciBuYW1lLCBtYWtlIGl0IHBhcnQgb2YgdGhpcyBjbHVzdGVzclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RGVzY3JpcHRvciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4ID09PSBjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBjbHVzdGVyU2V0LnB1c2gobmV4dERlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgZ28gdG8gdGhlIG5leHQgb25lLCBidW1wIHRoZSBpdGVyYXRpb24gaW5kZXggc28gd2Ugc2tpcCBpdCBvbiB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICAgIGxvY2F0b3IsXG4gICAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgICAgY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgICAgICBjbHVzdGVyS2V5LFxuICAgICAgICAgICAgICAgIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsXG4gICAgICAgICAgICAgICAgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSxcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHtcbiAgICAgICAgICAgICAgZWxlbWVudCxcbiAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgcGFyZW50LFxuICAgICAgICAgICAgICBsb2NhdG9yLFxuICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAgc2libGluZ3MsXG4gICAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcixcbiAgICAgICAgICAgICAgaXNQcm9wZXJ0eTogdHJ1ZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWFkaW5nUm93LnByb3BlcnR5Um93cy5wdXNoKHByb3BlcnR5Um93KVxuXG4gICAgICAgICAgICAvLyBQdXNoaW5nIGFuIGVsZW1lbnQgaW50byBhIGNvbXBvbmVudCByb3cgd2lsbCByZXN1bHQgaW4gaXQgcmVuZGVyaW5nLCBzbyBvbmx5IHB1c2hcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSByb3dzIG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGV4XG4gICAgICAgICAgaWYgKG5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICBjb21wb25lbnRSb3dzLnB1c2gocHJvcGVydHlSb3cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdG9ySXRlcmF0aW9ucysrXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtLl9pbmRleCA9IGluZGV4XG4gICAgICBpdGVtLl9pdGVtcyA9IGl0ZW1zXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MgPSBjb21wb25lbnRSb3dzLmZpbHRlcigoeyBub2RlLCBwYXJlbnQsIGxvY2F0b3IgfSkgPT4ge1xuICAgICAgICAvLyBMb2NhdG9ycyA+IDAuMCBhcmUgYmVsb3cgdGhlIGxldmVsIHdlIHdhbnQgdG8gZGlzcGxheSAod2Ugb25seSB3YW50IHRoZSB0b3AgYW5kIGl0cyBjaGlsZHJlbilcbiAgICAgIGlmIChsb2NhdG9yLnNwbGl0KCcuJykubGVuZ3RoID4gMikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gIXBhcmVudCB8fCBwYXJlbnQuX19pc0V4cGFuZGVkXG4gICAgfSlcblxuICAgIHJldHVybiBjb21wb25lbnRSb3dzXG4gIH1cblxuICBtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIGxldCB2YWx1ZUdyb3VwID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRWYWx1ZUdyb3VwKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlKVxuICAgIGlmICghdmFsdWVHcm91cCkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBsZXQga2V5ZnJhbWVzTGlzdCA9IE9iamVjdC5rZXlzKHZhbHVlR3JvdXApLm1hcCgoa2V5ZnJhbWVLZXkpID0+IHBhcnNlSW50KGtleWZyYW1lS2V5LCAxMCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxuICAgIGlmIChrZXlmcmFtZXNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNjdXJyID0ga2V5ZnJhbWVzTGlzdFtpXVxuICAgICAgaWYgKGlzTmFOKG1zY3VycikpIGNvbnRpbnVlXG4gICAgICBsZXQgbXNwcmV2ID0ga2V5ZnJhbWVzTGlzdFtpIC0gMV1cbiAgICAgIGxldCBtc25leHQgPSBrZXlmcmFtZXNMaXN0W2kgKyAxXVxuXG4gICAgICBpZiAobXNjdXJyID4gZnJhbWVJbmZvLm1zQikgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgYWZ0ZXIgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXRcbiAgICAgIGlmIChtc2N1cnIgPCBmcmFtZUluZm8ubXNBICYmIG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmIG1zbmV4dCA8IGZyYW1lSW5mby5tc0EpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGVudGlyZWx5IGJlZm9yZSB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdCAocGFydGlhbCBzZWdtZW50cyBhcmUgb2spXG5cbiAgICAgIGxldCBwcmV2XG4gICAgICBsZXQgY3VyclxuICAgICAgbGV0IG5leHRcblxuICAgICAgaWYgKG1zcHJldiAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc3ByZXYpKSB7XG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgbXM6IG1zcHJldixcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgLSAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zcHJldiwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zcHJldl0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNwcmV2XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSB7XG4gICAgICAgIG1zOiBtc2N1cnIsXG4gICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zY3VyciwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc2N1cnJdLnZhbHVlLFxuICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc2N1cnJdLmN1cnZlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc25leHQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNuZXh0KSkge1xuICAgICAgICBuZXh0ID0ge1xuICAgICAgICAgIG1zOiBtc25leHQsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc25leHQsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc25leHRdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zbmV4dF0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcHhPZmZzZXRMZWZ0ID0gKGN1cnIuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgbGV0IHB4T2Zmc2V0UmlnaHRcbiAgICAgIGlmIChuZXh0KSBweE9mZnNldFJpZ2h0ID0gKG5leHQuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgICBsZXQgc2VnbWVudE91dHB1dCA9IGl0ZXJhdGVlKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaSlcbiAgICAgIGlmIChzZWdtZW50T3V0cHV0KSBzZWdtZW50T3V0cHV0cy5wdXNoKHNlZ21lbnRPdXRwdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICBtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5Um93cywgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBwcm9wZXJ0eVJvd3MuZm9yRWFjaCgocHJvcGVydHlSb3cpID0+IHtcbiAgICAgIGlmIChwcm9wZXJ0eVJvdy5pc0NsdXN0ZXIpIHtcbiAgICAgICAgcHJvcGVydHlSb3cuY2x1c3Rlci5mb3JFYWNoKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlEZXNjcmlwdG9yLm5hbWVcbiAgICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eVJvdy5wcm9wZXJ0eS5uYW1lXG4gICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIHJlbW92ZVRpbWVsaW5lU2hhZG93ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gIH1cblxuICAvKlxuICAgKiByZW5kZXIgbWV0aG9kc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgdG9wOiAxN1xuICAgICAgICB9fT5cbiAgICAgICAgPENvbnRyb2xzQXJlYVxuICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnJlbW92ZVRpbWVsaW5lU2hhZG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWU9e3RoaXMucHJvcHMudXNlcmNvbmZpZy5uYW1lfVxuICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e09iamVjdC5rZXlzKCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSkgPyB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50aW1lbGluZXMgOiB7fSl9XG4gICAgICAgICAgc2VsZWN0ZWRUaW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICBjdXJyZW50RnJhbWU9e3RoaXMuc3RhdGUuY3VycmVudEZyYW1lfVxuICAgICAgICAgIGlzUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgcGxheWJhY2tTcGVlZD17dGhpcy5zdGF0ZS5wbGF5ZXJQbGF5YmFja1NwZWVkfVxuICAgICAgICAgIGxhc3RGcmFtZT17dGhpcy5nZXRGcmFtZUluZm8oKS5mcmlNYXh9XG4gICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXsob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjcmVhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkdXBsaWNhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkZWxldGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzZWxlY3RUaW1lbGluZT17KGN1cnJlbnRUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgaW4tbWVtb3J5IGNvbXBvbmVudCBvciBwcm9wZXJ0eSBhc3NpZ25tZW50IG1pZ2h0IG5vdCB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFRpbWVsaW5lTmFtZShjdXJyZW50VGltZWxpbmVOYW1lLCB7IGZyb206ICd0aW1lbGluZScgfSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NldFRpbWVsaW5lTmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgY3VycmVudFRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lbGluZU5hbWUgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8qIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBGb3J3YXJkPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaU1heCB9KVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17KGlucHV0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQbGF5YmFja1NwZWVkID0gTnVtYmVyKGlucHV0RXZlbnQudGFyZ2V0LnZhbHVlIHx8IDEpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGxheWVyUGxheWJhY2tTcGVlZCB9KVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIChpbnB1dEl0ZW0pIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKGlucHV0SXRlbS5ub2RlLCBmcmFtZUluZm8sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZSwgdGhpcy5fY29tcG9uZW50LCB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBpbnB1dEl0ZW0ucHJvcGVydHkpXG4gIH1cblxuICBnZXRDdXJyZW50VGltZWxpbmVUaW1lIChmcmFtZUluZm8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChpdGVtKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBsZXQgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgdGhpcz8gV2UgZG9uJ3QgbmVlZCB0byByZW5kZXIgZXZlcnkgc2VnbWVudCBzaW5jZSBzb21lIG9mIHRoZW0gb3ZlcmxhcC5cbiAgICAvLyBNYXliZSBrZWVwIGEgbGlzdCBvZiBrZXlmcmFtZSAncG9sZXMnIHJlbmRlcmVkLCBhbmQgb25seSByZW5kZXIgb25jZSBpbiB0aGF0IHNwb3Q/XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCBoZWlnaHQ6IDI1LCB3aWR0aDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBpdGVtLnByb3BlcnR5Um93cywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgaW5kZXgsIGhhbmRsZSwgb3B0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW50IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IGN1cnIubXNcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBjdXJyLmZyYW1lXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZScsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBudWxsLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDMsXG4gICAgICAgICAgICBjdXJzb3I6ICdjb2wtcmVzaXplJ1xuICAgICAgICAgIH19IC8+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU29sb0tleWZyYW1lIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBsZXQgaXNBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGlzQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgIHRvcDogLTMsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgOiAoaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICB9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFuc2l0aW9uQm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuICAgIGNvbnN0IGN1cnZlID0gY3Vyci5jdXJ2ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnIuY3VydmUuc2xpY2UoMSlcbiAgICBjb25zdCBicmVha2luZ0JvdW5kcyA9IGN1cnZlLmluY2x1ZGVzKCdCYWNrJykgfHwgY3VydmUuaW5jbHVkZXMoJ0JvdW5jZScpIHx8IGN1cnZlLmluY2x1ZGVzKCdFbGFzdGljJylcbiAgICBjb25zdCBDdXJ2ZVNWRyA9IENVUlZFU1ZHU1tjdXJ2ZSArICdTVkcnXVxuICAgIGxldCBmaXJzdEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBsZXQgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgICBpZiAoayA9PT0gY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbm5vdCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlLCBhY3RpdmVLZXlmcmFtZXM6IFtdIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODAsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDMsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7Y2x1c3Rlck5hbWV9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHRleHRBbGlnbjogJ2xlZnQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPENsdXN0ZXJJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXtyZWlmaWVkQnl0ZWNvZGV9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXRpbWVsaW5lLXNlZ21lbnRzLWJveCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBbaXRlbV0sIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cbiAgICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICAgIH0pfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIC8vIENyZWF0ZXMgYSB2aXJ0dWFsIGxpc3Qgb2YgYWxsIHRoZSBjb21wb25lbnQgcm93cyAoaW5jbHVkZXMgaGVhZGluZ3MgYW5kIHByb3BlcnR5IHJvd3MpXG4gIHJlbmRlckNvbXBvbmVudFJvd3MgKGl0ZW1zKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZE1vdW50KSByZXR1cm4gPHNwYW4gLz5cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxpc3QnXG4gICAgICAgIHN0eWxlPXtsb2Rhc2guYXNzaWduKHt9LCB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgICAgICAgfSl9PlxuICAgICAgICB7aXRlbXMubWFwKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5T25MYXN0Q29tcG9uZW50ID0gaXRlbS5zaWJsaW5ncy5sZW5ndGggPiAwICYmIGl0ZW0uaW5kZXggPT09IGl0ZW0uc2libGluZ3MubGVuZ3RoIC0gMVxuICAgICAgICAgIGlmIChpdGVtLmlzQ2x1c3Rlcikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ2x1c3RlclJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2UgaWYgKGl0ZW0uaXNQcm9wZXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyUHJvcGVydHlSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNvbXBvbmVudEhlYWRpbmdSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcylcbiAgICAgICAgICB9XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhID0gdGhpcy5nZXRDb21wb25lbnRSb3dzRGF0YSgpXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPSdjb250YWluZXInXG4gICAgICAgIGlkPSd0aW1lbGluZSdcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkdSQVksXG4gICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6ICdjYWxjKDEwMCUgLSA0NXB4KScsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBvdmVyZmxvd1k6ICdoaWRkZW4nLFxuICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmXG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSduby1zZWxlY3QnIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgd2lkdGg6IDMsXG4gICAgICAgICAgICBsZWZ0OiAyOTcsXG4gICAgICAgICAgICB6SW5kZXg6IDIwMDMsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBib3hTaGFkb3c6ICczcHggMCA2cHggMCByZ2JhKDAsMCwwLC4yMiknXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgfVxuICAgICAgICB7dGhpcy5yZW5kZXJUb3BDb250cm9scygpfVxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPSdzY3JvbGx2aWV3J1xuICAgICAgICAgIGlkPSdwcm9wZXJ0eS1yb3dzJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMzUsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgb3ZlcmZsb3dZOiAnYXV0bycsXG4gICAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93cyh0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvdHRvbUNvbnRyb2xzKCl9XG4gICAgICAgIDxFeHByZXNzaW9uSW5wdXRcbiAgICAgICAgICByZWY9J2V4cHJlc3Npb25JbnB1dCdcbiAgICAgICAgICByZWFjdFBhcmVudD17dGhpc31cbiAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgaW5wdXRGb2N1c2VkPXt0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZH1cbiAgICAgICAgICBvbkNvbW1pdFZhbHVlPXsoY29tbWl0dGVkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBpbnB1dCBjb21taXQ6JywgSlNPTi5zdHJpbmdpZnkoY29tbWl0dGVkVmFsdWUpKVxuXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKFxuICAgICAgICAgICAgICBnZXRJdGVtQ29tcG9uZW50SWQodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkLm5vZGUuZWxlbWVudE5hbWUsXG4gICAgICAgICAgICAgIGdldEl0ZW1Qcm9wZXJ0eU5hbWUodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUodGhpcy5nZXRGcmFtZUluZm8oKSksXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFZhbHVlLFxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gY3VydmVcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGVuZE1zXG4gICAgICAgICAgICAgIHZvaWQgKDApIC8vIGVuZFZhbHVlXG4gICAgICAgICAgICApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkZvY3VzUmVxdWVzdGVkPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk5hdmlnYXRlUmVxdWVzdGVkPXsobmF2RGlyLCBkb0ZvY3VzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgbGV0IG5leHQgPSBuZXh0UHJvcEl0ZW0oaXRlbSwgbmF2RGlyKVxuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiAoZG9Gb2N1cykgPyBuZXh0IDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBuZXh0XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lbGluZVxuIl19