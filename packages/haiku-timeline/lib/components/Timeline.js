'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/Timeline.js';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var _schema = require('@haiku/player/lib/properties/dom/schema');

var _schema2 = _interopRequireDefault(_schema);

var _fallbacks = require('@haiku/player/lib/properties/dom/fallbacks');

var _fallbacks2 = _interopRequireDefault(_fallbacks);

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

  /**
   * Hey! If you want to ADD any properties here, you might also need to update the dictionary in
   * haiku-bytecode/src/properties/dom/schema,
   * haiku-bytecode/src/properties/dom/fallbacks,
   * or they might not show up in the view.
   */

};var ALLOWED_PROPS = {
  'translation.x': true,
  'translation.y': true,
  // 'translation.z': true, // This doesn't work for some reason, so leaving it out
  'rotation.z': true,
  'rotation.x': true,
  'rotation.y': true,
  'scale.x': true,
  'scale.y': true,
  'opacity': true,
  // 'shown': true,
  'backgroundColor': true
  // 'color': true,
  // 'fill': true,
  // 'stroke': true
};

var CLUSTERED_PROPS = {
  'mount.x': 'mount',
  'mount.y': 'mount',
  'mount.z': 'mount',
  'align.x': 'align',
  'align.y': 'align',
  'align.z': 'align',
  'origin.x': 'origin',
  'origin.y': 'origin',
  'origin.z': 'origin',
  'translation.x': 'translation',
  'translation.y': 'translation',
  'translation.z': 'translation', // This doesn't work for some reason, so leaving it out
  'rotation.x': 'rotation',
  'rotation.y': 'rotation',
  'rotation.z': 'rotation',
  // 'rotation.w': 'rotation', // Probably easiest not to let the user have control over quaternion math
  'scale.x': 'scale',
  'scale.y': 'scale',
  'scale.z': 'scale',
  'sizeMode.x': 'sizeMode',
  'sizeMode.y': 'sizeMode',
  'sizeMode.z': 'sizeMode',
  'sizeProportional.x': 'sizeProportional',
  'sizeProportional.y': 'sizeProportional',
  'sizeProportional.z': 'sizeProportional',
  'sizeDifferential.x': 'sizeDifferential',
  'sizeDifferential.y': 'sizeDifferential',
  'sizeDifferential.z': 'sizeDifferential',
  'sizeAbsolute.x': 'sizeAbsolute',
  'sizeAbsolute.y': 'sizeAbsolute',
  'sizeAbsolute.z': 'sizeAbsolute',
  'style.overflowX': 'overflow',
  'style.overflowY': 'overflow'
};

var CLUSTER_NAMES = {
  'mount': 'Mount',
  'align': 'Align',
  'origin': 'Origin',
  'translation': 'Position',
  'rotation': 'Rotation',
  'scale': 'Scale',
  'sizeMode': 'Sizing Mode',
  'sizeProportional': 'Size %',
  'sizeDifferential': 'Size +/-',
  'sizeAbsolute': 'Size',
  'overflow': 'Overflow'
};

var ALLOWED_PROPS_TOP_LEVEL = {
  'sizeAbsolute.x': true,
  'sizeAbsolute.y': true,
  // Enable these as such a time as we can represent them visually in the glass
  // 'style.overflowX': true,
  // 'style.overflowY': true,
  'backgroundColor': true,
  'opacity': true
};

var ALLOWED_TAGNAMES = {
  div: true,
  svg: true,
  g: true,
  rect: true,
  circle: true,
  ellipse: true,
  line: true,
  polyline: true,
  polygon: true
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
        // TODO how will this bite us?
        var isComponent = _typeof(node.elementName) === 'object';
        var elementName = isComponent ? node.attributes.source : node.elementName;

        if (!parent || parent.__isExpanded && (ALLOWED_TAGNAMES[elementName] || isComponent)) {
          // Only the top-level and any expanded subcomponents
          var asciiBranch = asciiSymbols[visitorIterations]; // Warning: The component structure must match that given to create the ascii tree
          var headingRow = { node: node, parent: parent, locator: locator, index: index, siblings: siblings, asciiBranch: asciiBranch, propertyRows: [], isHeading: true, componentId: node.attributes['haiku-id'] };
          componentRows.push(headingRow);

          if (!addressableArraysCache[elementName]) {
            addressableArraysCache[elementName] = isComponent ? _buildComponentAddressables(node) : _buildDOMAddressables(elementName, locator);
          }

          var componentId = node.attributes['haiku-id'];
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
                propertyRow = { node: node, parent: parent, locator: locator, index: index, siblings: siblings, clusterPrefix: clusterPrefix, clusterKey: clusterKey, isClusterMember: true, isClusterHeading: isClusterHeading, property: propertyGroupDescriptor, isProperty: true, componentId: componentId };
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
                propertyRow = { node: node, parent: parent, locator: locator, index: index, siblings: siblings, clusterPrefix: clusterPrefix, clusterKey: clusterKey, cluster: clusterSet, clusterName: propertyGroupDescriptor.cluster.name, isCluster: true, componentId: componentId };
              }
            } else {
              propertyRow = { node: node, parent: parent, locator: locator, index: index, siblings: siblings, property: propertyGroupDescriptor, isProperty: true, componentId: componentId };
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
            lineNumber: 1450
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
            lineNumber: 1455
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
            lineNumber: 1523
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
            lineNumber: 1546
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
            lineNumber: 1574
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
            lineNumber: 1622
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
              lineNumber: 1634
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1642
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
            lineNumber: 1668
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
              lineNumber: 1696
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
              lineNumber: 1747
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
              lineNumber: 1763
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
                lineNumber: 1780
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
                  lineNumber: 1790
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1798
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
                lineNumber: 1808
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1817
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
                lineNumber: 1835
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
                  lineNumber: 1846
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1856
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
            lineNumber: 1876
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
            lineNumber: 1915
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
              lineNumber: 1958
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
                  lineNumber: 1974
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1975
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
                  lineNumber: 1984
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1985
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
                  lineNumber: 1990
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1991
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
            lineNumber: 2002
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2004
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
            lineNumber: 2017
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2036
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
                lineNumber: 2037
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
                lineNumber: 2050
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
                lineNumber: 2060
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
              lineNumber: 2072
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
              lineNumber: 2095
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2114
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
                lineNumber: 2115
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
                lineNumber: 2128
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2142
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
            lineNumber: 2149
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
              lineNumber: 2162
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
                lineNumber: 2171
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2183
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2185
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
                    lineNumber: 2186
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
                lineNumber: 2190
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2205
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2207
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
                    lineNumber: 2208
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
                  lineNumber: 2211
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
                lineNumber: 2213
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2230
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2231
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2232
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2234
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
                  lineNumber: 2236
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2237
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2238
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2239
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
              lineNumber: 2246
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
            lineNumber: 2283
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
              lineNumber: 2293
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
                lineNumber: 2317
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
                  lineNumber: 2327
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2332
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
                  lineNumber: 2334
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2339
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
              lineNumber: 2343
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
              lineNumber: 2344
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
            lineNumber: 2359
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
            lineNumber: 2386
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2389
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
              lineNumber: 2390
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2401
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2402
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
              lineNumber: 2404
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
            lineNumber: 2419
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
            lineNumber: 2446
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
              lineNumber: 2454
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2462
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
                  lineNumber: 2463
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2468
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2468
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2469
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2469
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
              lineNumber: 2475
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
            lineNumber: 2490
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
              lineNumber: 2500
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
                lineNumber: 2512
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2522
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2522
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
              lineNumber: 2527
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
                lineNumber: 2536
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
                  lineNumber: 2549
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
              lineNumber: 2563
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
              lineNumber: 2572
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
              lineNumber: 2587
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
            lineNumber: 2638
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2669
            },
            __self: this
          },
          !propertyOnLastComponent && _react2.default.createElement('div', { style: {
              position: 'absolute',
              left: 36,
              width: 5,
              borderLeft: '1px solid ' + _DefaultPalette2.default.GRAY_FIT1,
              height: height
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2671
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
                lineNumber: 2679
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2686
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2686
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
                right: 0,
                width: this.state.propertiesWidth - 90,
                height: 'inherit',
                textAlign: 'right',
                position: 'relative',
                paddingTop: 5
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2688
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
                  lineNumber: 2698
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
              lineNumber: 2707
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
              lineNumber: 2716
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
              lineNumber: 2730
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
          lineNumber: 2761
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
            lineNumber: 2764
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
            lineNumber: 2786
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
            lineNumber: 2802
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
              lineNumber: 2813
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
            lineNumber: 2830
          },
          __self: this
        })
      );
    }
  }]);

  return Timeline;
}(_react2.default.Component);

function _buildComponentAddressables(node) {
  var addressables = _buildDOMAddressables('div'); // start with dom properties?
  for (var name in node.elementName.states) {
    var state = node.elementName.states[name];

    addressables.push({
      name: name,
      prefix: name,
      suffix: undefined,
      fallback: state.value,
      typedef: state.type
    });
  }
  return addressables;
}

function _buildDOMAddressables(elementName, locator) {
  var addressables = [];

  var domSchema = _schema2.default[elementName];
  var domFallbacks = _fallbacks2.default[elementName];

  if (domSchema) {
    for (var propertyName in domSchema) {
      var propertyGroup = null;

      if (locator === '0') {
        // This indicates the top level element (the artboard)
        if (ALLOWED_PROPS_TOP_LEVEL[propertyName]) {
          var nameParts = propertyName.split('.');

          if (propertyName === 'style.overflowX') nameParts = ['overflow', 'x'];
          if (propertyName === 'style.overflowY') nameParts = ['overflow', 'y'];

          propertyGroup = {
            name: propertyName,
            prefix: nameParts[0],
            suffix: nameParts[1],
            fallback: domFallbacks[propertyName],
            typedef: domSchema[propertyName]
          };
        }
      } else {
        if (ALLOWED_PROPS[propertyName]) {
          var _nameParts = propertyName.split('.');
          propertyGroup = {
            name: propertyName,
            prefix: _nameParts[0],
            suffix: _nameParts[1],
            fallback: domFallbacks[propertyName],
            typedef: domSchema[propertyName]
          };
        }
      }

      if (propertyGroup) {
        var clusterPrefix = CLUSTERED_PROPS[propertyGroup.name];
        if (clusterPrefix) {
          propertyGroup.cluster = {
            prefix: clusterPrefix,
            name: CLUSTER_NAMES[clusterPrefix]
          };
        }

        addressables.push(propertyGroup);
      }
    }
  }

  return addressables;
}

exports.default = Timeline;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJpc0NvbXBvbmVudCIsInNvdXJjZSIsImFzY2lpQnJhbmNoIiwiaGVhZGluZ1JvdyIsInByb3BlcnR5Um93cyIsIl9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyIsIl9idWlsZERPTUFkZHJlc3NhYmxlcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiayIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5IiwicGFyc2VJbnQiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwibXMiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIsIm5hbWVQYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQU1BOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFD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QkFBaUIsaUJBQXJCLEVBQXdDaWUsWUFBWSxDQUFDLFVBQUQsRUFBYSxHQUFiLENBQVo7O0FBRXhDRCwwQkFBZ0I7QUFDZHBkLGtCQUFNWixZQURRO0FBRWRvUixvQkFBUTZNLFVBQVUsQ0FBVixDQUZNO0FBR2ROLG9CQUFRTSxVQUFVLENBQVYsQ0FITTtBQUlkTCxzQkFBVUcsYUFBYS9kLFlBQWIsQ0FKSTtBQUtkNmQscUJBQVNDLFVBQVU5ZCxZQUFWO0FBTEssV0FBaEI7QUFPRDtBQUNGLE9BZkQsTUFlTztBQUNMLFlBQUk3RCxjQUFjNkQsWUFBZCxDQUFKLEVBQWlDO0FBQy9CLGNBQUlpZSxhQUFZamUsYUFBYW9RLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBaEI7QUFDQTROLDBCQUFnQjtBQUNkcGQsa0JBQU1aLFlBRFE7QUFFZG9SLG9CQUFRNk0sV0FBVSxDQUFWLENBRk07QUFHZE4sb0JBQVFNLFdBQVUsQ0FBVixDQUhNO0FBSWRMLHNCQUFVRyxhQUFhL2QsWUFBYixDQUpJO0FBS2Q2ZCxxQkFBU0MsVUFBVTlkLFlBQVY7QUFMSyxXQUFoQjtBQU9EO0FBQ0Y7O0FBRUQsVUFBSWdlLGFBQUosRUFBbUI7QUFDakIsWUFBSTdNLGdCQUFnQi9VLGdCQUFnQjRoQixjQUFjcGQsSUFBOUIsQ0FBcEI7QUFDQSxZQUFJdVEsYUFBSixFQUFtQjtBQUNqQjZNLHdCQUFjOU0sT0FBZCxHQUF3QjtBQUN0QkUsb0JBQVFELGFBRGM7QUFFdEJ2USxrQkFBTXZFLGNBQWM4VSxhQUFkO0FBRmdCLFdBQXhCO0FBSUQ7O0FBRURzTSxxQkFBYTlkLElBQWIsQ0FBa0JxZSxhQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPUCxZQUFQO0FBQ0Q7O2tCQUVjaGdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IFtdLFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuLyoqXG4gKiBIZXkhIElmIHlvdSB3YW50IHRvIEFERCBhbnkgcHJvcGVydGllcyBoZXJlLCB5b3UgbWlnaHQgYWxzbyBuZWVkIHRvIHVwZGF0ZSB0aGUgZGljdGlvbmFyeSBpblxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSxcbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MsXG4gKiBvciB0aGV5IG1pZ2h0IG5vdCBzaG93IHVwIGluIHRoZSB2aWV3LlxuICovXG5cbmNvbnN0IEFMTE9XRURfUFJPUFMgPSB7XG4gICd0cmFuc2xhdGlvbi54JzogdHJ1ZSxcbiAgJ3RyYW5zbGF0aW9uLnknOiB0cnVlLFxuICAvLyAndHJhbnNsYXRpb24ueic6IHRydWUsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLnonOiB0cnVlLFxuICAncm90YXRpb24ueCc6IHRydWUsXG4gICdyb3RhdGlvbi55JzogdHJ1ZSxcbiAgJ3NjYWxlLngnOiB0cnVlLFxuICAnc2NhbGUueSc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgLy8gJ3Nob3duJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWVcbiAgLy8gJ2NvbG9yJzogdHJ1ZSxcbiAgLy8gJ2ZpbGwnOiB0cnVlLFxuICAvLyAnc3Ryb2tlJzogdHJ1ZVxufVxuXG5jb25zdCBDTFVTVEVSRURfUFJPUFMgPSB7XG4gICdtb3VudC54JzogJ21vdW50JyxcbiAgJ21vdW50LnknOiAnbW91bnQnLFxuICAnbW91bnQueic6ICdtb3VudCcsXG4gICdhbGlnbi54JzogJ2FsaWduJyxcbiAgJ2FsaWduLnknOiAnYWxpZ24nLFxuICAnYWxpZ24ueic6ICdhbGlnbicsXG4gICdvcmlnaW4ueCc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnknOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi56JzogJ29yaWdpbicsXG4gICd0cmFuc2xhdGlvbi54JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueic6ICd0cmFuc2xhdGlvbicsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLngnOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueSc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi56JzogJ3JvdGF0aW9uJyxcbiAgLy8gJ3JvdGF0aW9uLncnOiAncm90YXRpb24nLCAvLyBQcm9iYWJseSBlYXNpZXN0IG5vdCB0byBsZXQgdGhlIHVzZXIgaGF2ZSBjb250cm9sIG92ZXIgcXVhdGVybmlvbiBtYXRoXG4gICdzY2FsZS54JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnknOiAnc2NhbGUnLFxuICAnc2NhbGUueic6ICdzY2FsZScsXG4gICdzaXplTW9kZS54JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnknOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueic6ICdzaXplTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsLngnOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnknOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnonOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLngnOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnknOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnonOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplQWJzb2x1dGUueCc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnknOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS56JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnb3ZlcmZsb3cnLFxuICAnc3R5bGUub3ZlcmZsb3dZJzogJ292ZXJmbG93J1xufVxuXG5jb25zdCBDTFVTVEVSX05BTUVTID0ge1xuICAnbW91bnQnOiAnTW91bnQnLFxuICAnYWxpZ24nOiAnQWxpZ24nLFxuICAnb3JpZ2luJzogJ09yaWdpbicsXG4gICd0cmFuc2xhdGlvbic6ICdQb3NpdGlvbicsXG4gICdyb3RhdGlvbic6ICdSb3RhdGlvbicsXG4gICdzY2FsZSc6ICdTY2FsZScsXG4gICdzaXplTW9kZSc6ICdTaXppbmcgTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsJzogJ1NpemUgJScsXG4gICdzaXplRGlmZmVyZW50aWFsJzogJ1NpemUgKy8tJyxcbiAgJ3NpemVBYnNvbHV0ZSc6ICdTaXplJyxcbiAgJ292ZXJmbG93JzogJ092ZXJmbG93J1xufVxuXG5jb25zdCBBTExPV0VEX1BST1BTX1RPUF9MRVZFTCA9IHtcbiAgJ3NpemVBYnNvbHV0ZS54JzogdHJ1ZSxcbiAgJ3NpemVBYnNvbHV0ZS55JzogdHJ1ZSxcbiAgLy8gRW5hYmxlIHRoZXNlIGFzIHN1Y2ggYSB0aW1lIGFzIHdlIGNhbiByZXByZXNlbnQgdGhlbSB2aXN1YWxseSBpbiB0aGUgZ2xhc3NcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WCc6IHRydWUsXG4gIC8vICdzdHlsZS5vdmVyZmxvd1knOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlXG59XG5cbmNvbnN0IEFMTE9XRURfVEFHTkFNRVMgPSB7XG4gIGRpdjogdHJ1ZSxcbiAgc3ZnOiB0cnVlLFxuICBnOiB0cnVlLFxuICByZWN0OiB0cnVlLFxuICBjaXJjbGU6IHRydWUsXG4gIGVsbGlwc2U6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHBvbHlsaW5lOiB0cnVlLFxuICBwb2x5Z29uOiB0cnVlXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdiZWdpbicpO1xuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdlbmQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRpZE1vdW50OiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIH0pXG4gICAgICB9XG4gICAgfSwgVEhST1RUTEVfVElNRSkpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLnByb3BzLndlYnNvY2tldCwgJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5mb2xkZXIgIT09IHRoaXMucHJvcHMuZm9sZGVyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOiByZXR1cm4gdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBhY3Rpb24gcmVjZWl2ZWQnLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuY2FsbE1ldGhvZChtZXRob2QsIHBhcmFtcywgY2IpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50OnVwZGF0ZWQnLCAobWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IHVwZGF0ZWQnLCBtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpXG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAobmF0aXZlRXZlbnQpIHtcbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgLy8gY2FzZSAzNzogLy9sZWZ0XG4gICAgICAvLyBjYXNlIDM5OiAvL3JpZ2h0XG4gICAgICAvLyBjYXNlIDM4OiAvL3VwXG4gICAgICAvLyBjYXNlIDQwOiAvL2Rvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUtleWJvYXJkU3RhdGUgKHVwZGF0ZXMpIHtcbiAgICAvLyBJZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZG9uJ3QgYWxsb3cga2V5Ym9hcmQgc3RhdGUgY2hhbmdlcyB0byBjYXVzZSBhIHJlLXJlbmRlciwgb3RoZXJ3aXNlXG4gICAgLy8gdGhlIGlucHV0IGZpZWxkIHdpbGwgc3dpdGNoIGJhY2sgdG8gaXRzIHByZXZpb3VzIGNvbnRlbnRzIChlLmcuIHdoZW4gaG9sZGluZyBkb3duICdzaGlmdCcpXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUodXBkYXRlcylcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtrZXldID0gdXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkRW1pdHRlckxpc3RlbmVyIChldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKFtldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyXSlcbiAgICBldmVudEVtaXR0ZXIub24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpXG4gIH1cblxuICAvKlxuICAgKiBzZXR0ZXJzL3VwZGF0ZXJzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGRlc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gdHJ1ZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IDBcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb05vZGUgKG5vZGUpIHtcbiAgICB2YXIgcm93c0RhdGEgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgdmFyIGZvdW5kSW5kZXggPSBudWxsXG4gICAgdmFyIGluZGV4Q291bnRlciA9IDBcbiAgICByb3dzRGF0YS5mb3JFYWNoKChyb3dJbmZvLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNIZWFkaW5nKSB7XG4gICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICB9IGVsc2UgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gbnVsbCkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGZvdW5kSW5kZXggPSBpbmRleENvdW50ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGZvdW5kSW5kZXggIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAoZm91bmRJbmRleCAqIHRoaXMuc3RhdGUucm93SGVpZ2h0KSAtIHRoaXMuc3RhdGUucm93SGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERvbU5vZGVPZmZzZXRZIChkb21Ob2RlKSB7XG4gICAgdmFyIGN1cnRvcCA9IDBcbiAgICBpZiAoZG9tTm9kZS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3VydG9wICs9IGRvbU5vZGUub2Zmc2V0VG9wXG4gICAgICB9IHdoaWxlIChkb21Ob2RlID0gZG9tTm9kZS5vZmZzZXRQYXJlbnQpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG4gICAgcmV0dXJuIGN1cnRvcFxuICB9XG5cbiAgY29sbGFwc2VOb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgIHZpc2l0KG5vZGUsIChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICAgIGNoaWxkLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgfSlcbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGxldCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgZXhwYW5kTm9kZSAobm9kZSwgY29tcG9uZW50SWQpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICBpZiAobm9kZS5wYXJlbnQpIHRoaXMuZXhwYW5kTm9kZShub2RlLnBhcmVudCkgLy8gSWYgd2UgYXJlIGV4cGFuZGVkLCBvdXIgcGFyZW50IGhhcyB0byBiZSB0b29cbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlzUm93QWN0aXZhdGVkIChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGlzQ2x1c3RlckFjdGl2YXRlZCAoaXRlbSkge1xuICAgIHJldHVybiBmYWxzZSAvLyBUT0RPXG4gIH1cblxuICB0b2dnbGVUaW1lRGlzcGxheU1vZGUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ3NlY29uZHMnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVNjcnViYmVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydFxuICAgIHZhciBmcmFtZUJhc2VsaW5lID0gdGhpcy5zdGF0ZS5mcmFtZUJhc2VsaW5lXG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIHZhciBjdXJyZW50RnJhbWUgPSBmcmFtZUJhc2VsaW5lICsgZnJhbWVEZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaUIpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuZHVyYXRpb25EcmFnU3RhcnRcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgaWYgKGRyYWdEZWx0YSA+IDAgJiYgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLmFkZEludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIDIwfSlcbiAgICAgICAgfSwgMzAwKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthZGRJbnRlcnZhbDogYWRkSW50ZXJ2YWx9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ0lzQWRkaW5nOiB0cnVlfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgIC8vIERvbid0IGxldCB1c2VyIGRyYWcgYmFjayBwYXN0IGxhc3QgZnJhbWU7IGFuZCBkb24ndCBsZXQgdGhlbSBkcmFnIG1vcmUgdGhhbiBhbiBlbnRpcmUgd2lkdGggb2YgZnJhbWVzXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCICsgZnJhbWVEZWx0YSA8PSBmcmFtZUluZm8uZnJpTWF4IHx8IC1mcmFtZURlbHRhID49IGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgIGZyYW1lRGVsdGEgPSB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAvLyBUb2RvOiBtYWtlIG1vcmUgcHJlY2lzZSBzbyBpdCByZW1vdmVzIGFzIG1hbnkgZnJhbWVzIGFzXG4gICAgICByZXR1cm4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgY2FuIGluc3RlYWQgb2YgY29tcGxldGVseSBpZ25vcmluZyB0aGUgZHJhZ1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25UcmltOiBmcmFtZURlbHRhLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbCB9KVxuICB9XG5cbiAgY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UgKHhsLCB4ciwgZnJhbWVJbmZvKSB7XG4gICAgbGV0IGFic0wgPSBudWxsXG4gICAgbGV0IGFic1IgPSBudWxsXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgIGFic0wgPSB4bFxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNSID0geHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0KSB7XG4gICAgICBjb25zdCBvZmZzZXRMID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyU3RhcnQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3Qgb2Zmc2V0UiA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhckVuZCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBkaWZmWCA9IHhsIC0gdGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnRcbiAgICAgIGFic0wgPSBvZmZzZXRMICsgZGlmZlhcbiAgICAgIGFic1IgPSBvZmZzZXRSICsgZGlmZlhcbiAgICB9XG5cbiAgICBsZXQgZkwgPSAoYWJzTCAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNMICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIGxldCBmUiA9IChhYnNSICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic1IgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgbGVmdCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZMIDw9IGZyYW1lSW5mby5mcmkwKSB7XG4gICAgICBmTCA9IGZyYW1lSW5mby5mcmkwXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLSBmTClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgcmlnaHQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmUiA+PSBmcmFtZUluZm8uZnJpTWF4Mikge1xuICAgICAgZkwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2ZMLCBmUl0gfSlcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIChkZWx0YSkge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSArIGRlbHRhXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdICsgZGVsdGFcbiAgICBpZiAobCA+PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtsLCByXSB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIHdpbGwgbGVmdC1hbGlnbiB0aGUgY3VycmVudCB0aW1lbGluZSB3aW5kb3cgKG1haW50YWluaW5nIHpvb20pXG4gIHRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG4gICAgdmFyIHNwYW4gPSByIC0gbFxuICAgIHZhciBuZXdMID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWVcbiAgICB2YXIgbmV3UiA9IG5ld0wgKyBzcGFuXG5cbiAgICBpZiAobmV3UiA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgIG5ld0wgLT0gKG5ld1IgLSBmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgbmV3UiA9IGZyYW1lSW5mby5mcmlNYXhcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtuZXdMLCBuZXdSXSB9KVxuICB9XG5cbiAgdXBkYXRlU2NydWJiZXJQb3NpdGlvbiAoZGVsdGEpIHtcbiAgICB2YXIgY3VycmVudEZyYW1lID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKyBkZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPD0gMCkgY3VycmVudEZyYW1lID0gMFxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUpIHtcbiAgICAvLyBOb3RlIHRoYXQgaWYgc3RhcnRWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSBwcmV2aW91cyB2YWx1ZSB3aWxsIGJlIGV4YW1pbmVkIHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIHByZXNlbnQgb25lXG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUsIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnaG9zdEluc3RhbmNlJyksIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnc3RhdGVzJykpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBObyBuZWVkIHRvICdleHByZXNzaW9uVG9STycgaGVyZSBiZWNhdXNlIGlmIHdlIGdvdCBhbiBleHByZXNzaW9uLCB0aGF0IHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHByb3ZpZGVkIGluIGl0cyBzZXJpYWxpemVkIF9fZnVuY3Rpb24gZm9ybVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlXSwgKCkgPT4ge30pXG5cbiAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzdmcnICYmIHByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknKSB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50IChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnNwbGl0U2VnbWVudCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc3BsaXRTZWdtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuam9pbktleWZyYW1lcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEN1cnZlKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRFbmRwb2ludHMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIChvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5yZW5hbWVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3JlbmFtZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm90ZTogV2UgbWF5IG5lZWQgdG8gcmVtZW1iZXIgdG8gc2VyaWFsaXplIGEgdGltZWxpbmUgZGVzY3JpcHRvciBoZXJlXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmR1cGxpY2F0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2R1cGxpY2F0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykge1xuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgbGV0IGtleWZyYW1lTW92ZXMgPSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcywgZnJhbWVJbmZvKVxuICAgIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgfSlcblxuICAgICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgIH1cbiAgfVxuXG4gIGRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSByZXR1cm4gdm9pZCAoMClcbiAgICBmb3IgKGxldCBtb3ZlbWVudEtleSBpbiB0aGlzLl9rZXlmcmFtZU1vdmVzKSB7XG4gICAgICBpZiAoIW1vdmVtZW50S2V5KSBjb250aW51ZVxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSkgY29udGludWVcbiAgICAgIGxldCB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH0gPSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuXG4gICAgICAvLyBNYWtlIHN1cmUgYW55IGZ1bmN0aW9ucyBnZXQgY29udmVydGVkIGludG8gdGhlaXIgc2VyaWFsIGZvcm0gYmVmb3JlIHBhc3Npbmcgb3ZlciB0aGUgd2lyZVxuICAgICAgbGV0IGtleWZyYW1lTW92ZXNGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oa2V5ZnJhbWVNb3ZlcylcblxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdtb3ZlS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3Zlc0ZvcldpcmUsIGZyYW1lSW5mb10sICgpID0+IHt9KVxuICAgICAgZGVsZXRlIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlUGxheWJhY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiB0cnVlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wbGF5KClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVoeWRyYXRlQnl0ZWNvZGUgKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKSB7XG4gICAgaWYgKHJlaWZpZWRCeXRlY29kZSkge1xuICAgICAgaWYgKHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgICBpZiAoIWlkKSByZXR1cm4gdm9pZCAoMClcbiAgICAgICAgICBub2RlLl9faXNTZWxlY3RlZCA9ICEhdGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0V4cGFuZGVkID0gISF0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzSGlkZGVuID0gISF0aGlzLnN0YXRlLmhpZGRlbk5vZGVzW2lkXVxuICAgICAgICB9KVxuICAgICAgICByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgbGV0IGZvdW5kID0gW11cbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCkgPT4ge1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShub2RlKVxuICAgICAgICB0aGlzLmV4cGFuZE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5zY3JvbGxUb05vZGUobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uVW5zZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBsZXQgZm91bmQgPSB0aGlzLmZpbmROb2Rlc0J5Q29tcG9uZW50SWQoY29tcG9uZW50SWQpXG4gICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgdGhpcy5kZXNlbGVjdE5vZGUobm9kZSlcbiAgICAgIHRoaXMuY29sbGFwc2VOb2RlKG5vZGUpXG4gICAgICB0aGlzLnNjcm9sbFRvVG9wKG5vZGUpXG4gICAgfSlcbiAgfVxuXG4gIGZpbmROb2Rlc0J5Q29tcG9uZW50SWQgKGNvbXBvbmVudElkKSB7XG4gICAgdmFyIGZvdW5kID0gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIG1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHN0YXJ0TXMsIHByb3BlcnR5TmFtZXMpIHtcbiAgICBsZXQgcmVsYXRlZEVsZW1lbnQgPSB0aGlzLmZpbmRFbGVtZW50SW5UZW1wbGF0ZShjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgbGV0IGVsZW1lbnROYW1lID0gcmVsYXRlZEVsZW1lbnQgJiYgcmVsYXRlZEVsZW1lbnQuZWxlbWVudE5hbWVcbiAgICBpZiAoIWVsZW1lbnROYW1lKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDb21wb25lbnQgJyArIGNvbXBvbmVudElkICsgJyBtaXNzaW5nIGVsZW1lbnQsIGFuZCB3aXRob3V0IGFuIGVsZW1lbnQgbmFtZSBJIGNhbm5vdCB1cGRhdGUgYSBwcm9wZXJ0eSB2YWx1ZScpXG4gICAgfVxuXG4gICAgdmFyIGFsbFJvd3MgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgYWxsUm93cy5mb3JFYWNoKChyb3dJbmZvKSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc1Byb3BlcnR5ICYmIHJvd0luZm8uY29tcG9uZW50SWQgPT09IGNvbXBvbmVudElkICYmIHByb3BlcnR5TmFtZXMuaW5kZXhPZihyb3dJbmZvLnByb3BlcnR5Lm5hbWUpICE9PSAtMSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgYWN0aXZhdGVkUm93czogbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93cyksXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICAqIGl0ZXJhdG9ycy92aXNpdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBmaW5kRWxlbWVudEluVGVtcGxhdGUgKGNvbXBvbmVudElkLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiB2b2lkICgwKVxuICAgIGxldCBmb3VuZFxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZCA9IG5vZGVcbiAgICB9KVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSAobG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZSwgcGFyZW50LCBpdGVyYXRlZSkge1xuICAgIGl0ZXJhdGVlKHRlbXBsYXRlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgaWYgKHRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRlbXBsYXRlLmNoaWxkcmVuW2ldXG4gICAgICAgIGlmICghY2hpbGQgfHwgdHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykgY29udGludWVcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKGxvY2F0b3IgKyAnLicgKyBpLCBpLCB0ZW1wbGF0ZS5jaGlsZHJlbiwgY2hpbGQsIHRlbXBsYXRlLCBpdGVyYXRlZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtYXBWaXNpYmxlRnJhbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgcmlnaHRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgY29uc3QgZnJhbWVNb2R1bHVzID0gZ2V0RnJhbWVNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGxldCBpdGVyYXRpb25JbmRleCA9IC0xXG4gICAgZm9yIChsZXQgaSA9IGxlZnRGcmFtZTsgaSA8IHJpZ2h0RnJhbWU7IGkrKykge1xuICAgICAgaXRlcmF0aW9uSW5kZXgrK1xuICAgICAgbGV0IGZyYW1lTnVtYmVyID0gaVxuICAgICAgbGV0IHBpeGVsT2Zmc2V0TGVmdCA9IGl0ZXJhdGlvbkluZGV4ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGlmIChwaXhlbE9mZnNldExlZnQgPD0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkge1xuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgZnJhbWVJbmZvLnB4cGYsIGZyYW1lTW9kdWx1cylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkge1xuICAgICAgICAgIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICBtYXBWaXNpYmxlVGltZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbXNNb2R1bHVzID0gZ2V0TWlsbGlzZWNvbmRNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgbGVmdE1zID0gZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHJpZ2h0TXMgPSBmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgdG90YWxNcyA9IHJpZ2h0TXMgLSBsZWZ0TXNcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IHJvdW5kVXAobGVmdE1zLCBtc01vZHVsdXMpXG4gICAgbGV0IG1zTWFya2VyVG1wID0gZmlyc3RNYXJrZXJcbiAgICBjb25zdCBtc01hcmtlcnMgPSBbXVxuICAgIHdoaWxlIChtc01hcmtlclRtcCA8PSByaWdodE1zKSB7XG4gICAgICBtc01hcmtlcnMucHVzaChtc01hcmtlclRtcClcbiAgICAgIG1zTWFya2VyVG1wICs9IG1zTW9kdWx1c1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zTWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zTWFya2VyID0gbXNNYXJrZXJzW2ldXG4gICAgICBsZXQgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc01hcmtlciwgZnJhbWVJbmZvLm1zcGYpXG4gICAgICBsZXQgbXNSZW1haW5kZXIgPSBNYXRoLmZsb29yKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmIC0gbXNNYXJrZXIpXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgdGhlIG1zUmVtYWluZGVyIGNhc2UgcmF0aGVyIHRoYW4gaWdub3JpbmcgaXRcbiAgICAgIGlmICghbXNSZW1haW5kZXIpIHtcbiAgICAgICAgbGV0IGZyYW1lT2Zmc2V0ID0gbmVhcmVzdEZyYW1lIC0gbGVmdEZyYW1lXG4gICAgICAgIGxldCBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKG1zTWFya2VyLCBweE9mZnNldCwgdG90YWxNcylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICAvKlxuICAgKiBnZXR0ZXJzL2NhbGN1bGF0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8qKlxuICAgIC8vIFNvcnJ5OiBUaGVzZSBzaG91bGQgaGF2ZSBiZWVuIGdpdmVuIGh1bWFuLXJlYWRhYmxlIG5hbWVzXG4gICAgPEdBVUdFPlxuICAgICAgICAgICAgPC0tLS1mcmlXLS0tPlxuICAgIGZyaTAgICAgZnJpQSAgICAgICAgZnJpQiAgICAgICAgZnJpTWF4ICAgICAgICAgICAgICAgICAgICAgICAgICBmcmlNYXgyXG4gICAgfCAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfFxuICAgICAgICAgICAgPC0tLS0tLS0tLS0tPiA8PCB0aW1lbGluZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgICB8XG4gICAgPC0tLS0tLS0+ICAgICAgICAgICB8IDw8IHByb3BlcnRpZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgIHB4QSAgICAgICAgIHB4QiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4ICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXgyXG4gICAgPFNDUk9MTEJBUj5cbiAgICB8LS0tLS0tLS0tLS0tLS0tLS0tLXwgPDwgc2Nyb2xsZXIgdmlld3BvcnRcbiAgICAgICAgKj09PT0qICAgICAgICAgICAgPDwgc2Nyb2xsYmFyXG4gICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gICAgfHNjMCAgICAgICAgICAgICAgICB8c2NMICYmIHNjUmF0aW9cbiAgICAgICAgfHNjQVxuICAgICAgICAgICAgIHxzY0JcbiAgKi9cbiAgZ2V0RnJhbWVJbmZvICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB7fVxuICAgIGZyYW1lSW5mby5mcHMgPSB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvLyBOdW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICBmcmFtZUluZm8ubXNwZiA9IDEwMDAgLyBmcmFtZUluZm8uZnBzIC8vIE1pbGxpc2Vjb25kcyBwZXIgZnJhbWVcbiAgICBmcmFtZUluZm8ubWF4bXMgPSBnZXRNYXhpbXVtTXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSlcbiAgICBmcmFtZUluZm8ubWF4ZiA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoZnJhbWVJbmZvLm1heG1zLCBmcmFtZUluZm8ubXNwZikgLy8gTWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmkwID0gMCAvLyBUaGUgbG93ZXN0IHBvc3NpYmxlIGZyYW1lIChhbHdheXMgMClcbiAgICBmcmFtZUluZm8uZnJpQSA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIDwgZnJhbWVJbmZvLmZyaTApID8gZnJhbWVJbmZvLmZyaTAgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC8vIFRoZSBsZWZ0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlNYXggPSAoZnJhbWVJbmZvLm1heGYgPCA2MCkgPyA2MCA6IGZyYW1lSW5mby5tYXhmIC8vIFRoZSBtYXhpbXVtIGZyYW1lIGFzIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaU1heDIgPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXggKiAxLjg4ICAvLyBFeHRlbmQgdGhlIG1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmUgKGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUga2V5ZnJhbWVzIGJleW9uZCB0aGUgcHJldmlvdXNseSBkZWZpbmVkIG1heClcbiAgICBmcmFtZUluZm8uZnJpQiA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdID4gZnJhbWVJbmZvLmZyaU1heDIpID8gZnJhbWVJbmZvLmZyaU1heDIgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC8vIFRoZSByaWdodG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpVyA9IE1hdGguYWJzKGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIC8vIFRoZSB3aWR0aCBvZiB0aGUgdmlzaWJsZSByYW5nZSBpbiBmcmFtZXNcbiAgICBmcmFtZUluZm8ucHhwZiA9IE1hdGguZmxvb3IodGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvIGZyYW1lSW5mby5mcmlXKSAvLyBOdW1iZXIgb2YgcGl4ZWxzIHBlciBmcmFtZSAocm91bmRlZClcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPCAxKSBmcmFtZUluZm8ucFNjcnhwZiA9IDFcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSBmcmFtZUluZm8ucHhwZiA9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGhcbiAgICBmcmFtZUluZm8ucHhBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weEIgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4TWF4MiA9IGZyYW1lSW5mby5mcmlNYXgyICogZnJhbWVJbmZvLnB4cGYgLy8gVGhlIHdpZHRoIGluIHBpeGVscyB0aGF0IHRoZSBlbnRpcmUgdGltZWxpbmUgKFwiZnJpTWF4MlwiKSBwYWRkaW5nIHdvdWxkIGVxdWFsXG4gICAgZnJhbWVJbmZvLm1zQSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIGxlZnRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLm1zQiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIHJpZ2h0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5zY0wgPSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLy8gVGhlIGxlbmd0aCBpbiBwaXhlbHMgb2YgdGhlIHNjcm9sbGVyIHZpZXdcbiAgICBmcmFtZUluZm8uc2NSYXRpbyA9IGZyYW1lSW5mby5weE1heDIgLyBmcmFtZUluZm8uc2NMIC8vIFRoZSByYXRpbyBvZiB0aGUgc2Nyb2xsZXIgdmlldyB0byB0aGUgdGltZWxpbmUgdmlldyAoc28gdGhlIHNjcm9sbGVyIHJlbmRlcnMgcHJvcG9ydGlvbmFsbHkgdG8gdGhlIHRpbWVsaW5lIGJlaW5nIGVkaXRlZClcbiAgICBmcmFtZUluZm8uc2NBID0gKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSBsZWZ0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIGZyYW1lSW5mby5zY0IgPSAoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIHJpZ2h0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIHJldHVybiBmcmFtZUluZm9cbiAgfVxuXG4gIC8vIFRPRE86IEZpeCB0aGlzL3RoZXNlIG1pc25vbWVyKHMpLiBJdCdzIG5vdCAnQVNDSUknXG4gIGdldEFzY2lpVHJlZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBsZXQgYXJjaHlGb3JtYXQgPSB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKVxuICAgICAgbGV0IGFyY2h5U3RyID0gYXJjaHkoYXJjaHlGb3JtYXQpXG4gICAgICByZXR1cm4gYXJjaHlTdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgZ2V0QXJjaHlGb3JtYXROb2RlcyAobGFiZWwsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsLFxuICAgICAgbm9kZXM6IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgY2hpbGQuY2hpbGRyZW4pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudFJvd3NEYXRhICgpIHtcbiAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzICoqbXVzdCoqIGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBjb21wb25lbnQgaGVhZGluZ3MvcHJvcGVydHkgcm93c1xuICAgIGxldCBhc2NpaVN5bWJvbHMgPSB0aGlzLmdldEFzY2lpVHJlZSgpLnNwbGl0KCdcXG4nKVxuICAgIGxldCBjb21wb25lbnRSb3dzID0gW11cbiAgICBsZXQgYWRkcmVzc2FibGVBcnJheXNDYWNoZSA9IHt9XG4gICAgbGV0IHZpc2l0b3JJdGVyYXRpb25zID0gMFxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSB8fCAhdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiBjb21wb25lbnRSb3dzXG5cbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncykgPT4ge1xuICAgICAgLy8gVE9ETyBob3cgd2lsbCB0aGlzIGJpdGUgdXM/XG4gICAgICBsZXQgaXNDb21wb25lbnQgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKVxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gaXNDb21wb25lbnQgPyBub2RlLmF0dHJpYnV0ZXMuc291cmNlIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9faXNFeHBhbmRlZCAmJiAoQUxMT1dFRF9UQUdOQU1FU1tlbGVtZW50TmFtZV0gfHwgaXNDb21wb25lbnQpKSkgeyAvLyBPbmx5IHRoZSB0b3AtbGV2ZWwgYW5kIGFueSBleHBhbmRlZCBzdWJjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IGFzY2lpQnJhbmNoID0gYXNjaWlTeW1ib2xzW3Zpc2l0b3JJdGVyYXRpb25zXSAvLyBXYXJuaW5nOiBUaGUgY29tcG9uZW50IHN0cnVjdHVyZSBtdXN0IG1hdGNoIHRoYXQgZ2l2ZW4gdG8gY3JlYXRlIHRoZSBhc2NpaSB0cmVlXG4gICAgICAgIGNvbnN0IGhlYWRpbmdSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCwgcHJvcGVydHlSb3dzOiBbXSwgaXNIZWFkaW5nOiB0cnVlLCBjb21wb25lbnRJZDogbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddIH1cbiAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKGhlYWRpbmdSb3cpXG5cbiAgICAgICAgaWYgKCFhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSkge1xuICAgICAgICAgIGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdID0gaXNDb21wb25lbnQgPyBfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMobm9kZSkgOiBfYnVpbGRET01BZGRyZXNzYWJsZXMoZWxlbWVudE5hbWUsIGxvY2F0b3IpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBjb25zdCBjbHVzdGVySGVhZGluZ3NGb3VuZCA9IHt9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW2ldXG5cbiAgICAgICAgICBsZXQgcHJvcGVydHlSb3dcblxuICAgICAgICAgICAgLy8gU29tZSBwcm9wZXJ0aWVzIGdldCBncm91cGVkIGluc2lkZSB0aGVpciBvd24gYWNjb3JkaW9uIHNpbmNlIHRoZXkgaGF2ZSBtdWx0aXBsZSBzdWJjb21wb25lbnRzLCBlLmcuIHRyYW5zbGF0aW9uLngseSx6XG4gICAgICAgICAgaWYgKHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIpIHtcbiAgICAgICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXhcbiAgICAgICAgICAgIGxldCBjbHVzdGVyS2V5ID0gYCR7Y29tcG9uZW50SWR9XyR7Y2x1c3RlclByZWZpeH1gXG4gICAgICAgICAgICBsZXQgaXNDbHVzdGVySGVhZGluZyA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGNsdXN0ZXIgd2l0aCB0aGUgY3VycmVudCBrZXkgaXMgZXhwYW5kZWQgcmVuZGVyIGVhY2ggb2YgdGhlIHJvd3MgaW5kaXZpZHVhbGx5XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbY2x1c3RlcktleV0pIHtcbiAgICAgICAgICAgICAgaWYgKCFjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSkge1xuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0gPSB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBjbHVzdGVyUHJlZml4LCBjbHVzdGVyS2V5LCBpc0NsdXN0ZXJNZW1iZXI6IHRydWUsIGlzQ2x1c3RlckhlYWRpbmcsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIGNsdXN0ZXIsIHNoaWZ0aW5nIHRoZSBpbmRleCBmb3J3YXJkIHNvIHdlIGRvbid0IHJlLXJlbmRlciB0aGUgaW5kaXZpZHVhbHMgb24gdGhlIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgIGxldCBjbHVzdGVyU2V0ID0gW3Byb3BlcnR5R3JvdXBEZXNjcmlwdG9yXVxuICAgICAgICAgICAgICAgIC8vIExvb2sgYWhlYWQgYnkgYSBmZXcgc3RlcHMgaW4gdGhlIGFycmF5IGFuZCBzZWUgaWYgdGhlIG5leHQgZWxlbWVudCBpcyBhIG1lbWJlciBvZiB0aGUgY3VycmVudCBjbHVzdGVyXG4gICAgICAgICAgICAgIGxldCBrID0gaSAvLyBUZW1wb3Jhcnkgc28gd2UgY2FuIGluY3JlbWVudCBgaWAgaW4gcGxhY2VcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gaiArIGtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtuZXh0SW5kZXhdXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV4dCB0aGluZyBpbiB0aGUgbGlzdCBzaGFyZXMgdGhlIHNhbWUgY2x1c3RlciBuYW1lLCBtYWtlIGl0IHBhcnQgb2YgdGhpcyBjbHVzdGVzclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RGVzY3JpcHRvciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4ID09PSBjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBjbHVzdGVyU2V0LnB1c2gobmV4dERlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgZ28gdG8gdGhlIG5leHQgb25lLCBidW1wIHRoZSBpdGVyYXRpb24gaW5kZXggc28gd2Ugc2tpcCBpdCBvbiB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBjbHVzdGVyUHJlZml4LCBjbHVzdGVyS2V5LCBjbHVzdGVyOiBjbHVzdGVyU2V0LCBjbHVzdGVyTmFtZTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5uYW1lLCBpc0NsdXN0ZXI6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsIGlzUHJvcGVydHk6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWFkaW5nUm93LnByb3BlcnR5Um93cy5wdXNoKHByb3BlcnR5Um93KVxuXG4gICAgICAgICAgICAvLyBQdXNoaW5nIGFuIGVsZW1lbnQgaW50byBhIGNvbXBvbmVudCByb3cgd2lsbCByZXN1bHQgaW4gaXQgcmVuZGVyaW5nLCBzbyBvbmx5IHB1c2hcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSByb3dzIG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGV4XG4gICAgICAgICAgaWYgKG5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICBjb21wb25lbnRSb3dzLnB1c2gocHJvcGVydHlSb3cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdG9ySXRlcmF0aW9ucysrXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtLl9pbmRleCA9IGluZGV4XG4gICAgICBpdGVtLl9pdGVtcyA9IGl0ZW1zXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MgPSBjb21wb25lbnRSb3dzLmZpbHRlcigoeyBub2RlLCBwYXJlbnQsIGxvY2F0b3IgfSkgPT4ge1xuICAgICAgICAvLyBMb2NhdG9ycyA+IDAuMCBhcmUgYmVsb3cgdGhlIGxldmVsIHdlIHdhbnQgdG8gZGlzcGxheSAod2Ugb25seSB3YW50IHRoZSB0b3AgYW5kIGl0cyBjaGlsZHJlbilcbiAgICAgIGlmIChsb2NhdG9yLnNwbGl0KCcuJykubGVuZ3RoID4gMikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gIXBhcmVudCB8fCBwYXJlbnQuX19pc0V4cGFuZGVkXG4gICAgfSlcblxuICAgIHJldHVybiBjb21wb25lbnRSb3dzXG4gIH1cblxuICBtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIGxldCB2YWx1ZUdyb3VwID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRWYWx1ZUdyb3VwKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlKVxuICAgIGlmICghdmFsdWVHcm91cCkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBsZXQga2V5ZnJhbWVzTGlzdCA9IE9iamVjdC5rZXlzKHZhbHVlR3JvdXApLm1hcCgoa2V5ZnJhbWVLZXkpID0+IHBhcnNlSW50KGtleWZyYW1lS2V5LCAxMCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxuICAgIGlmIChrZXlmcmFtZXNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNjdXJyID0ga2V5ZnJhbWVzTGlzdFtpXVxuICAgICAgaWYgKGlzTmFOKG1zY3VycikpIGNvbnRpbnVlXG4gICAgICBsZXQgbXNwcmV2ID0ga2V5ZnJhbWVzTGlzdFtpIC0gMV1cbiAgICAgIGxldCBtc25leHQgPSBrZXlmcmFtZXNMaXN0W2kgKyAxXVxuXG4gICAgICBpZiAobXNjdXJyID4gZnJhbWVJbmZvLm1zQikgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgYWZ0ZXIgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXRcbiAgICAgIGlmIChtc2N1cnIgPCBmcmFtZUluZm8ubXNBICYmIG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmIG1zbmV4dCA8IGZyYW1lSW5mby5tc0EpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGVudGlyZWx5IGJlZm9yZSB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdCAocGFydGlhbCBzZWdtZW50cyBhcmUgb2spXG5cbiAgICAgIGxldCBwcmV2XG4gICAgICBsZXQgY3VyclxuICAgICAgbGV0IG5leHRcblxuICAgICAgaWYgKG1zcHJldiAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc3ByZXYpKSB7XG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgbXM6IG1zcHJldixcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgLSAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zcHJldiwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zcHJldl0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNwcmV2XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSB7XG4gICAgICAgIG1zOiBtc2N1cnIsXG4gICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zY3VyciwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc2N1cnJdLnZhbHVlLFxuICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc2N1cnJdLmN1cnZlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc25leHQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNuZXh0KSkge1xuICAgICAgICBuZXh0ID0ge1xuICAgICAgICAgIG1zOiBtc25leHQsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc25leHQsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc25leHRdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zbmV4dF0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcHhPZmZzZXRMZWZ0ID0gKGN1cnIuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgbGV0IHB4T2Zmc2V0UmlnaHRcbiAgICAgIGlmIChuZXh0KSBweE9mZnNldFJpZ2h0ID0gKG5leHQuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgICBsZXQgc2VnbWVudE91dHB1dCA9IGl0ZXJhdGVlKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaSlcbiAgICAgIGlmIChzZWdtZW50T3V0cHV0KSBzZWdtZW50T3V0cHV0cy5wdXNoKHNlZ21lbnRPdXRwdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICBtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5Um93cywgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBwcm9wZXJ0eVJvd3MuZm9yRWFjaCgocHJvcGVydHlSb3cpID0+IHtcbiAgICAgIGlmIChwcm9wZXJ0eVJvdy5pc0NsdXN0ZXIpIHtcbiAgICAgICAgcHJvcGVydHlSb3cuY2x1c3Rlci5mb3JFYWNoKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlEZXNjcmlwdG9yLm5hbWVcbiAgICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eVJvdy5wcm9wZXJ0eS5uYW1lXG4gICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIHJlbW92ZVRpbWVsaW5lU2hhZG93ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gIH1cblxuICAvKlxuICAgKiByZW5kZXIgbWV0aG9kc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgdG9wOiAxN1xuICAgICAgICB9fT5cbiAgICAgICAgPENvbnRyb2xzQXJlYVxuICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnJlbW92ZVRpbWVsaW5lU2hhZG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWU9e3RoaXMucHJvcHMudXNlcmNvbmZpZy5uYW1lfVxuICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e09iamVjdC5rZXlzKCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSkgPyB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50aW1lbGluZXMgOiB7fSl9XG4gICAgICAgICAgc2VsZWN0ZWRUaW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICBjdXJyZW50RnJhbWU9e3RoaXMuc3RhdGUuY3VycmVudEZyYW1lfVxuICAgICAgICAgIGlzUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgcGxheWJhY2tTcGVlZD17dGhpcy5zdGF0ZS5wbGF5ZXJQbGF5YmFja1NwZWVkfVxuICAgICAgICAgIGxhc3RGcmFtZT17dGhpcy5nZXRGcmFtZUluZm8oKS5mcmlNYXh9XG4gICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXsob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjcmVhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkdXBsaWNhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkZWxldGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzZWxlY3RUaW1lbGluZT17KGN1cnJlbnRUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgaW4tbWVtb3J5IGNvbXBvbmVudCBvciBwcm9wZXJ0eSBhc3NpZ25tZW50IG1pZ2h0IG5vdCB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFRpbWVsaW5lTmFtZShjdXJyZW50VGltZWxpbmVOYW1lLCB7IGZyb206ICd0aW1lbGluZScgfSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NldFRpbWVsaW5lTmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgY3VycmVudFRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lbGluZU5hbWUgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8qIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBGb3J3YXJkPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaU1heCB9KVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17KGlucHV0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQbGF5YmFja1NwZWVkID0gTnVtYmVyKGlucHV0RXZlbnQudGFyZ2V0LnZhbHVlIHx8IDEpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGxheWVyUGxheWJhY2tTcGVlZCB9KVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIChpbnB1dEl0ZW0pIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKGlucHV0SXRlbS5ub2RlLCBmcmFtZUluZm8sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZSwgdGhpcy5fY29tcG9uZW50LCB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBpbnB1dEl0ZW0ucHJvcGVydHkpXG4gIH1cblxuICBnZXRDdXJyZW50VGltZWxpbmVUaW1lIChmcmFtZUluZm8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChpdGVtKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBsZXQgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgdGhpcz8gV2UgZG9uJ3QgbmVlZCB0byByZW5kZXIgZXZlcnkgc2VnbWVudCBzaW5jZSBzb21lIG9mIHRoZW0gb3ZlcmxhcC5cbiAgICAvLyBNYXliZSBrZWVwIGEgbGlzdCBvZiBrZXlmcmFtZSAncG9sZXMnIHJlbmRlcmVkLCBhbmQgb25seSByZW5kZXIgb25jZSBpbiB0aGF0IHNwb3Q/XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCBoZWlnaHQ6IDI1LCB3aWR0aDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBpdGVtLnByb3BlcnR5Um93cywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgaW5kZXgsIGhhbmRsZSwgb3B0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW50IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IGN1cnIubXNcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBjdXJyLmZyYW1lXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZScsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBudWxsLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDMsXG4gICAgICAgICAgICBjdXJzb3I6ICdjb2wtcmVzaXplJ1xuICAgICAgICAgIH19IC8+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU29sb0tleWZyYW1lIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBsZXQgaXNBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGlzQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgIHRvcDogLTMsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgOiAoaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICB9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFuc2l0aW9uQm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuICAgIGNvbnN0IGN1cnZlID0gY3Vyci5jdXJ2ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnIuY3VydmUuc2xpY2UoMSlcbiAgICBjb25zdCBicmVha2luZ0JvdW5kcyA9IGN1cnZlLmluY2x1ZGVzKCdCYWNrJykgfHwgY3VydmUuaW5jbHVkZXMoJ0JvdW5jZScpIHx8IGN1cnZlLmluY2x1ZGVzKCdFbGFzdGljJylcbiAgICBjb25zdCBDdXJ2ZVNWRyA9IENVUlZFU1ZHU1tjdXJ2ZSArICdTVkcnXVxuICAgIGxldCBmaXJzdEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBsZXQgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLmZvckVhY2goKGspID0+IHtcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgICBpZiAoayA9PT0gY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICB9KVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbm5vdCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzID0gW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZSxcbiAgICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlLCBhY3RpdmVLZXlmcmFtZXM6IFtdIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gOTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyAobm9kZSkge1xuICB2YXIgYWRkcmVzc2FibGVzID0gX2J1aWxkRE9NQWRkcmVzc2FibGVzKCdkaXYnKSAvLyBzdGFydCB3aXRoIGRvbSBwcm9wZXJ0aWVzP1xuICBmb3IgKGxldCBuYW1lIGluIG5vZGUuZWxlbWVudE5hbWUuc3RhdGVzKSB7XG4gICAgbGV0IHN0YXRlID0gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXNbbmFtZV1cblxuICAgIGFkZHJlc3NhYmxlcy5wdXNoKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBwcmVmaXg6IG5hbWUsXG4gICAgICBzdWZmaXg6IHVuZGVmaW5lZCxcbiAgICAgIGZhbGxiYWNrOiBzdGF0ZS52YWx1ZSxcbiAgICAgIHR5cGVkZWY6IHN0YXRlLnR5cGVcbiAgICB9KVxuICB9XG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZnVuY3Rpb24gX2J1aWxkRE9NQWRkcmVzc2FibGVzIChlbGVtZW50TmFtZSwgbG9jYXRvcikge1xuICB2YXIgYWRkcmVzc2FibGVzID0gW11cblxuICBjb25zdCBkb21TY2hlbWEgPSBET01TY2hlbWFbZWxlbWVudE5hbWVdXG4gIGNvbnN0IGRvbUZhbGxiYWNrcyA9IERPTUZhbGxiYWNrc1tlbGVtZW50TmFtZV1cblxuICBpZiAoZG9tU2NoZW1hKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIGRvbVNjaGVtYSkge1xuICAgICAgbGV0IHByb3BlcnR5R3JvdXAgPSBudWxsXG5cbiAgICAgIGlmIChsb2NhdG9yID09PSAnMCcpIHsgLy8gVGhpcyBpbmRpY2F0ZXMgdGhlIHRvcCBsZXZlbCBlbGVtZW50ICh0aGUgYXJ0Ym9hcmQpXG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTX1RPUF9MRVZFTFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgbGV0IG5hbWVQYXJ0cyA9IHByb3BlcnR5TmFtZS5zcGxpdCgnLicpXG5cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dYJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd4J11cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dZJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd5J11cblxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgcHJlZml4OiBuYW1lUGFydHNbMF0sXG4gICAgICAgICAgICBzdWZmaXg6IG5hbWVQYXJ0c1sxXSxcbiAgICAgICAgICAgIGZhbGxiYWNrOiBkb21GYWxsYmFja3NbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHR5cGVkZWY6IGRvbVNjaGVtYVtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eUdyb3VwKSB7XG4gICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gQ0xVU1RFUkVEX1BST1BTW3Byb3BlcnR5R3JvdXAubmFtZV1cbiAgICAgICAgaWYgKGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwLmNsdXN0ZXIgPSB7XG4gICAgICAgICAgICBwcmVmaXg6IGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICBuYW1lOiBDTFVTVEVSX05BTUVTW2NsdXN0ZXJQcmVmaXhdXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkcmVzc2FibGVzLnB1c2gocHJvcGVydHlHcm91cClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRkcmVzc2FibGVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=