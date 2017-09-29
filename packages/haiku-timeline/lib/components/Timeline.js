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

        console.log('r', reifiedBytecode);
        console.log('s', serializedBytecode);

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
            lineNumber: 1471
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
            lineNumber: 1476
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
            lineNumber: 1544
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
            lineNumber: 1567
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
            lineNumber: 1595
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
            lineNumber: 1643
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
              lineNumber: 1655
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1663
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
            lineNumber: 1689
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
              lineNumber: 1717
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
              lineNumber: 1768
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
              lineNumber: 1784
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
                lineNumber: 1801
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
                  lineNumber: 1811
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1819
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
                lineNumber: 1829
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1838
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
                lineNumber: 1856
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
                  lineNumber: 1867
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1877
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
            lineNumber: 1897
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
            lineNumber: 1936
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
              lineNumber: 1979
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
                  lineNumber: 1995
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1996
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
                  lineNumber: 2005
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2006
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
                  lineNumber: 2011
                },
                __self: _this19
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2012
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
            lineNumber: 2023
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2025
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
            lineNumber: 2038
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2057
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
                lineNumber: 2058
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
                lineNumber: 2071
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
                lineNumber: 2081
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
              lineNumber: 2093
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
              lineNumber: 2116
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2135
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
                lineNumber: 2136
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
                lineNumber: 2149
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2163
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
            lineNumber: 2170
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
              lineNumber: 2183
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
                lineNumber: 2192
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2204
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2206
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
                    lineNumber: 2207
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
                lineNumber: 2211
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2226
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2228
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
                    lineNumber: 2229
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
                  lineNumber: 2232
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
                lineNumber: 2234
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2251
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2252
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2253
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2255
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
                  lineNumber: 2257
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2258
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2259
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2260
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
              lineNumber: 2267
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
            lineNumber: 2304
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
              lineNumber: 2314
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
                lineNumber: 2338
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
                  lineNumber: 2348
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2353
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
                  lineNumber: 2355
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2360
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
              lineNumber: 2364
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
              lineNumber: 2365
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
            lineNumber: 2380
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
            lineNumber: 2407
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2410
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
              lineNumber: 2411
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2422
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2423
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
              lineNumber: 2425
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
            lineNumber: 2440
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
            lineNumber: 2467
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
              lineNumber: 2475
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2483
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
                  lineNumber: 2484
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2489
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2489
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2490
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2490
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
              lineNumber: 2496
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
            lineNumber: 2511
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
              lineNumber: 2521
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
                lineNumber: 2533
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2543
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2543
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
              lineNumber: 2548
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
                lineNumber: 2557
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
                  lineNumber: 2570
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
              lineNumber: 2584
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
              lineNumber: 2593
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
              lineNumber: 2608
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
            lineNumber: 2659
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2690
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
              lineNumber: 2692
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
                lineNumber: 2700
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2707
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2707
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
                lineNumber: 2709
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
                  lineNumber: 2719
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
              lineNumber: 2728
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
              lineNumber: 2737
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
              lineNumber: 2751
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
          lineNumber: 2782
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
            lineNumber: 2785
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
            lineNumber: 2807
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
            lineNumber: 2823
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
              lineNumber: 2834
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
            lineNumber: 2851
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJsb2ciLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJpc0NvbXBvbmVudCIsInNvdXJjZSIsImFzY2lpQnJhbmNoIiwiaGVhZGluZ1JvdyIsInByb3BlcnR5Um93cyIsIl9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyIsIl9idWlsZERPTUFkZHJlc3NhYmxlcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiayIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5IiwicGFyc2VJbnQiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwibXMiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIsIm5hbWVQYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQU1BOzs7O0FBQ0E7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QU1kLFlBRFE7QUFFZHdSLG9CQUFRNk0sV0FBVSxDQUFWLENBRk07QUFHZE4sb0JBQVFNLFdBQVUsQ0FBVixDQUhNO0FBSWRMLHNCQUFVRyxhQUFhbmUsWUFBYixDQUpJO0FBS2RpZSxxQkFBU0MsVUFBVWxlLFlBQVY7QUFMSyxXQUFoQjtBQU9EO0FBQ0Y7O0FBRUQsVUFBSW9lLGFBQUosRUFBbUI7QUFDakIsWUFBSTdNLGdCQUFnQm5WLGdCQUFnQmdpQixjQUFjdGQsSUFBOUIsQ0FBcEI7QUFDQSxZQUFJeVEsYUFBSixFQUFtQjtBQUNqQjZNLHdCQUFjOU0sT0FBZCxHQUF3QjtBQUN0QkUsb0JBQVFELGFBRGM7QUFFdEJ6USxrQkFBTXpFLGNBQWNrVixhQUFkO0FBRmdCLFdBQXhCO0FBSUQ7O0FBRURzTSxxQkFBYWxlLElBQWIsQ0FBa0J5ZSxhQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPUCxZQUFQO0FBQ0Q7O2tCQUVjcGdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IFtdLFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuLyoqXG4gKiBIZXkhIElmIHlvdSB3YW50IHRvIEFERCBhbnkgcHJvcGVydGllcyBoZXJlLCB5b3UgbWlnaHQgYWxzbyBuZWVkIHRvIHVwZGF0ZSB0aGUgZGljdGlvbmFyeSBpblxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSxcbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MsXG4gKiBvciB0aGV5IG1pZ2h0IG5vdCBzaG93IHVwIGluIHRoZSB2aWV3LlxuICovXG5cbmNvbnN0IEFMTE9XRURfUFJPUFMgPSB7XG4gICd0cmFuc2xhdGlvbi54JzogdHJ1ZSxcbiAgJ3RyYW5zbGF0aW9uLnknOiB0cnVlLFxuICAvLyAndHJhbnNsYXRpb24ueic6IHRydWUsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLnonOiB0cnVlLFxuICAncm90YXRpb24ueCc6IHRydWUsXG4gICdyb3RhdGlvbi55JzogdHJ1ZSxcbiAgJ3NjYWxlLngnOiB0cnVlLFxuICAnc2NhbGUueSc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgLy8gJ3Nob3duJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWVcbiAgLy8gJ2NvbG9yJzogdHJ1ZSxcbiAgLy8gJ2ZpbGwnOiB0cnVlLFxuICAvLyAnc3Ryb2tlJzogdHJ1ZVxufVxuXG5jb25zdCBDTFVTVEVSRURfUFJPUFMgPSB7XG4gICdtb3VudC54JzogJ21vdW50JyxcbiAgJ21vdW50LnknOiAnbW91bnQnLFxuICAnbW91bnQueic6ICdtb3VudCcsXG4gICdhbGlnbi54JzogJ2FsaWduJyxcbiAgJ2FsaWduLnknOiAnYWxpZ24nLFxuICAnYWxpZ24ueic6ICdhbGlnbicsXG4gICdvcmlnaW4ueCc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnknOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi56JzogJ29yaWdpbicsXG4gICd0cmFuc2xhdGlvbi54JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueic6ICd0cmFuc2xhdGlvbicsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLngnOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueSc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi56JzogJ3JvdGF0aW9uJyxcbiAgLy8gJ3JvdGF0aW9uLncnOiAncm90YXRpb24nLCAvLyBQcm9iYWJseSBlYXNpZXN0IG5vdCB0byBsZXQgdGhlIHVzZXIgaGF2ZSBjb250cm9sIG92ZXIgcXVhdGVybmlvbiBtYXRoXG4gICdzY2FsZS54JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnknOiAnc2NhbGUnLFxuICAnc2NhbGUueic6ICdzY2FsZScsXG4gICdzaXplTW9kZS54JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnknOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueic6ICdzaXplTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsLngnOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnknOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnonOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLngnOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnknOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnonOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplQWJzb2x1dGUueCc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnknOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS56JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnb3ZlcmZsb3cnLFxuICAnc3R5bGUub3ZlcmZsb3dZJzogJ292ZXJmbG93J1xufVxuXG5jb25zdCBDTFVTVEVSX05BTUVTID0ge1xuICAnbW91bnQnOiAnTW91bnQnLFxuICAnYWxpZ24nOiAnQWxpZ24nLFxuICAnb3JpZ2luJzogJ09yaWdpbicsXG4gICd0cmFuc2xhdGlvbic6ICdQb3NpdGlvbicsXG4gICdyb3RhdGlvbic6ICdSb3RhdGlvbicsXG4gICdzY2FsZSc6ICdTY2FsZScsXG4gICdzaXplTW9kZSc6ICdTaXppbmcgTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsJzogJ1NpemUgJScsXG4gICdzaXplRGlmZmVyZW50aWFsJzogJ1NpemUgKy8tJyxcbiAgJ3NpemVBYnNvbHV0ZSc6ICdTaXplJyxcbiAgJ292ZXJmbG93JzogJ092ZXJmbG93J1xufVxuXG5jb25zdCBBTExPV0VEX1BST1BTX1RPUF9MRVZFTCA9IHtcbiAgJ3NpemVBYnNvbHV0ZS54JzogdHJ1ZSxcbiAgJ3NpemVBYnNvbHV0ZS55JzogdHJ1ZSxcbiAgLy8gRW5hYmxlIHRoZXNlIGFzIHN1Y2ggYSB0aW1lIGFzIHdlIGNhbiByZXByZXNlbnQgdGhlbSB2aXN1YWxseSBpbiB0aGUgZ2xhc3NcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WCc6IHRydWUsXG4gIC8vICdzdHlsZS5vdmVyZmxvd1knOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlXG59XG5cbmNvbnN0IEFMTE9XRURfVEFHTkFNRVMgPSB7XG4gIGRpdjogdHJ1ZSxcbiAgc3ZnOiB0cnVlLFxuICBnOiB0cnVlLFxuICByZWN0OiB0cnVlLFxuICBjaXJjbGU6IHRydWUsXG4gIGVsbGlwc2U6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHBvbHlsaW5lOiB0cnVlLFxuICBwb2x5Z29uOiB0cnVlXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIGNvbnNvbGUubG9nKCdyJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgY29uc29sZS5sb2coJ3MnLCBzZXJpYWxpemVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAobmF0aXZlRXZlbnQpIHtcbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgLy8gY2FzZSAzNzogLy9sZWZ0XG4gICAgICAvLyBjYXNlIDM5OiAvL3JpZ2h0XG4gICAgICAvLyBjYXNlIDM4OiAvL3VwXG4gICAgICAvLyBjYXNlIDQwOiAvL2Rvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUtleWJvYXJkU3RhdGUgKHVwZGF0ZXMpIHtcbiAgICAvLyBJZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZG9uJ3QgYWxsb3cga2V5Ym9hcmQgc3RhdGUgY2hhbmdlcyB0byBjYXVzZSBhIHJlLXJlbmRlciwgb3RoZXJ3aXNlXG4gICAgLy8gdGhlIGlucHV0IGZpZWxkIHdpbGwgc3dpdGNoIGJhY2sgdG8gaXRzIHByZXZpb3VzIGNvbnRlbnRzIChlLmcuIHdoZW4gaG9sZGluZyBkb3duICdzaGlmdCcpXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUodXBkYXRlcylcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtrZXldID0gdXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkRW1pdHRlckxpc3RlbmVyIChldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKFtldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyXSlcbiAgICBldmVudEVtaXR0ZXIub24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpXG4gIH1cblxuICAvKlxuICAgKiBzZXR0ZXJzL3VwZGF0ZXJzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGRlc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gdHJ1ZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IDBcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb05vZGUgKG5vZGUpIHtcbiAgICB2YXIgcm93c0RhdGEgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgdmFyIGZvdW5kSW5kZXggPSBudWxsXG4gICAgdmFyIGluZGV4Q291bnRlciA9IDBcbiAgICByb3dzRGF0YS5mb3JFYWNoKChyb3dJbmZvLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNIZWFkaW5nKSB7XG4gICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICB9IGVsc2UgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gbnVsbCkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGZvdW5kSW5kZXggPSBpbmRleENvdW50ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGZvdW5kSW5kZXggIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAoZm91bmRJbmRleCAqIHRoaXMuc3RhdGUucm93SGVpZ2h0KSAtIHRoaXMuc3RhdGUucm93SGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERvbU5vZGVPZmZzZXRZIChkb21Ob2RlKSB7XG4gICAgdmFyIGN1cnRvcCA9IDBcbiAgICBpZiAoZG9tTm9kZS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3VydG9wICs9IGRvbU5vZGUub2Zmc2V0VG9wXG4gICAgICB9IHdoaWxlIChkb21Ob2RlID0gZG9tTm9kZS5vZmZzZXRQYXJlbnQpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG4gICAgcmV0dXJuIGN1cnRvcFxuICB9XG5cbiAgY29sbGFwc2VOb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgIHZpc2l0KG5vZGUsIChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICAgIGNoaWxkLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgfSlcbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGxldCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgZXhwYW5kTm9kZSAobm9kZSwgY29tcG9uZW50SWQpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICBpZiAobm9kZS5wYXJlbnQpIHRoaXMuZXhwYW5kTm9kZShub2RlLnBhcmVudCkgLy8gSWYgd2UgYXJlIGV4cGFuZGVkLCBvdXIgcGFyZW50IGhhcyB0byBiZSB0b29cbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlzUm93QWN0aXZhdGVkIChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGlzQ2x1c3RlckFjdGl2YXRlZCAoaXRlbSkge1xuICAgIHJldHVybiBmYWxzZSAvLyBUT0RPXG4gIH1cblxuICB0b2dnbGVUaW1lRGlzcGxheU1vZGUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ3NlY29uZHMnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVNjcnViYmVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydFxuICAgIHZhciBmcmFtZUJhc2VsaW5lID0gdGhpcy5zdGF0ZS5mcmFtZUJhc2VsaW5lXG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIHZhciBjdXJyZW50RnJhbWUgPSBmcmFtZUJhc2VsaW5lICsgZnJhbWVEZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaUIpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuZHVyYXRpb25EcmFnU3RhcnRcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgaWYgKGRyYWdEZWx0YSA+IDAgJiYgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLmFkZEludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIDIwfSlcbiAgICAgICAgfSwgMzAwKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthZGRJbnRlcnZhbDogYWRkSW50ZXJ2YWx9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ0lzQWRkaW5nOiB0cnVlfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgIC8vIERvbid0IGxldCB1c2VyIGRyYWcgYmFjayBwYXN0IGxhc3QgZnJhbWU7IGFuZCBkb24ndCBsZXQgdGhlbSBkcmFnIG1vcmUgdGhhbiBhbiBlbnRpcmUgd2lkdGggb2YgZnJhbWVzXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCICsgZnJhbWVEZWx0YSA8PSBmcmFtZUluZm8uZnJpTWF4IHx8IC1mcmFtZURlbHRhID49IGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgIGZyYW1lRGVsdGEgPSB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAvLyBUb2RvOiBtYWtlIG1vcmUgcHJlY2lzZSBzbyBpdCByZW1vdmVzIGFzIG1hbnkgZnJhbWVzIGFzXG4gICAgICByZXR1cm4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgY2FuIGluc3RlYWQgb2YgY29tcGxldGVseSBpZ25vcmluZyB0aGUgZHJhZ1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25UcmltOiBmcmFtZURlbHRhLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbCB9KVxuICB9XG5cbiAgY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UgKHhsLCB4ciwgZnJhbWVJbmZvKSB7XG4gICAgbGV0IGFic0wgPSBudWxsXG4gICAgbGV0IGFic1IgPSBudWxsXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgIGFic0wgPSB4bFxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNSID0geHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0KSB7XG4gICAgICBjb25zdCBvZmZzZXRMID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyU3RhcnQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3Qgb2Zmc2V0UiA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhckVuZCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBkaWZmWCA9IHhsIC0gdGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnRcbiAgICAgIGFic0wgPSBvZmZzZXRMICsgZGlmZlhcbiAgICAgIGFic1IgPSBvZmZzZXRSICsgZGlmZlhcbiAgICB9XG5cbiAgICBsZXQgZkwgPSAoYWJzTCAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNMICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIGxldCBmUiA9IChhYnNSICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic1IgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgbGVmdCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZMIDw9IGZyYW1lSW5mby5mcmkwKSB7XG4gICAgICBmTCA9IGZyYW1lSW5mby5mcmkwXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLSBmTClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgcmlnaHQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmUiA+PSBmcmFtZUluZm8uZnJpTWF4Mikge1xuICAgICAgZkwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2ZMLCBmUl0gfSlcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIChkZWx0YSkge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSArIGRlbHRhXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdICsgZGVsdGFcbiAgICBpZiAobCA+PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtsLCByXSB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIHdpbGwgbGVmdC1hbGlnbiB0aGUgY3VycmVudCB0aW1lbGluZSB3aW5kb3cgKG1haW50YWluaW5nIHpvb20pXG4gIHRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG4gICAgdmFyIHNwYW4gPSByIC0gbFxuICAgIHZhciBuZXdMID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWVcbiAgICB2YXIgbmV3UiA9IG5ld0wgKyBzcGFuXG5cbiAgICBpZiAobmV3UiA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgIG5ld0wgLT0gKG5ld1IgLSBmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgbmV3UiA9IGZyYW1lSW5mby5mcmlNYXhcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtuZXdMLCBuZXdSXSB9KVxuICB9XG5cbiAgdXBkYXRlU2NydWJiZXJQb3NpdGlvbiAoZGVsdGEpIHtcbiAgICB2YXIgY3VycmVudEZyYW1lID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKyBkZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPD0gMCkgY3VycmVudEZyYW1lID0gMFxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUpIHtcbiAgICAvLyBOb3RlIHRoYXQgaWYgc3RhcnRWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSBwcmV2aW91cyB2YWx1ZSB3aWxsIGJlIGV4YW1pbmVkIHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIHByZXNlbnQgb25lXG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUsIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnaG9zdEluc3RhbmNlJyksIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnc3RhdGVzJykpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBObyBuZWVkIHRvICdleHByZXNzaW9uVG9STycgaGVyZSBiZWNhdXNlIGlmIHdlIGdvdCBhbiBleHByZXNzaW9uLCB0aGF0IHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHByb3ZpZGVkIGluIGl0cyBzZXJpYWxpemVkIF9fZnVuY3Rpb24gZm9ybVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlXSwgKCkgPT4ge30pXG5cbiAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzdmcnICYmIHByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknKSB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50IChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnNwbGl0U2VnbWVudCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc3BsaXRTZWdtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuam9pbktleWZyYW1lcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEN1cnZlKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRFbmRwb2ludHMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIChvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5yZW5hbWVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3JlbmFtZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm90ZTogV2UgbWF5IG5lZWQgdG8gcmVtZW1iZXIgdG8gc2VyaWFsaXplIGEgdGltZWxpbmUgZGVzY3JpcHRvciBoZXJlXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmR1cGxpY2F0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2R1cGxpY2F0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykge1xuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgbGV0IGtleWZyYW1lTW92ZXMgPSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcywgZnJhbWVJbmZvKVxuICAgIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICB9KVxuXG4gICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgIC8vIHNvIHRoZSB2YWx1ZXMgYXJlIGFjY3VtdWxhdGVkIGFuZCBzZW50IHZpYSBhIHNpbmdsZSBiYXRjaGVkIHVwZGF0ZS5cbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgdGhpcy5fa2V5ZnJhbWVNb3ZlcyA9IHt9XG4gICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldID0geyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9XG4gICAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbigpXG4gICAgfVxuICB9XG5cbiAgZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHJldHVybiB2b2lkICgwKVxuICAgIGZvciAobGV0IG1vdmVtZW50S2V5IGluIHRoaXMuX2tleWZyYW1lTW92ZXMpIHtcbiAgICAgIGlmICghbW92ZW1lbnRLZXkpIGNvbnRpbnVlXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldKSBjb250aW51ZVxuICAgICAgbGV0IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfSA9IHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgZnVuY3Rpb25zIGdldCBjb252ZXJ0ZWQgaW50byB0aGVpciBzZXJpYWwgZm9ybSBiZWZvcmUgcGFzc2luZyBvdmVyIHRoZSB3aXJlXG4gICAgICBsZXQga2V5ZnJhbWVNb3Zlc0ZvcldpcmUgPSBleHByZXNzaW9uVG9STyhrZXlmcmFtZU1vdmVzKVxuXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ21vdmVLZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzRm9yV2lyZSwgZnJhbWVJbmZvXSwgKCkgPT4ge30pXG4gICAgICBkZWxldGUgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cbiAgICB9XG4gIH1cblxuICB0b2dnbGVQbGF5YmFjayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IGZhbHNlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBsYXkoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZWh5ZHJhdGVCeXRlY29kZSAocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpIHtcbiAgICBpZiAocmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgICBpZiAocmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICAgIGlmICghaWQpIHJldHVybiB2b2lkICgwKVxuICAgICAgICAgIG5vZGUuX19pc1NlbGVjdGVkID0gISF0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzRXhwYW5kZWQgPSAhIXRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNIaWRkZW4gPSAhIXRoaXMuc3RhdGUuaGlkZGVuTm9kZXNbaWRdXG4gICAgICAgIH0pXG4gICAgICAgIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uU2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50KSA9PiB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuZXhwYW5kTm9kZShub2RlKVxuICAgICAgICB0aGlzLnNjcm9sbFRvTm9kZShub2RlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25VbnNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZE5vZGVzQnlDb21wb25lbnRJZChjb21wb25lbnRJZClcbiAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICB0aGlzLmRlc2VsZWN0Tm9kZShub2RlKVxuICAgICAgdGhpcy5jb2xsYXBzZU5vZGUobm9kZSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aobm9kZSlcbiAgICB9KVxuICB9XG5cbiAgZmluZE5vZGVzQnlDb21wb25lbnRJZCAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgZm91bmQgPSBbXVxuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgbWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgc3RhcnRNcywgcHJvcGVydHlOYW1lcykge1xuICAgIGxldCByZWxhdGVkRWxlbWVudCA9IHRoaXMuZmluZEVsZW1lbnRJblRlbXBsYXRlKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICBsZXQgZWxlbWVudE5hbWUgPSByZWxhdGVkRWxlbWVudCAmJiByZWxhdGVkRWxlbWVudC5lbGVtZW50TmFtZVxuICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIG1pc3NpbmcgZWxlbWVudCwgYW5kIHdpdGhvdXQgYW4gZWxlbWVudCBuYW1lIEkgY2Fubm90IHVwZGF0ZSBhIHByb3BlcnR5IHZhbHVlJylcbiAgICB9XG5cbiAgICB2YXIgYWxsUm93cyA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICBhbGxSb3dzLmZvckVhY2goKHJvd0luZm8pID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzUHJvcGVydHkgJiYgcm93SW5mby5jb21wb25lbnRJZCA9PT0gY29tcG9uZW50SWQgJiYgcHJvcGVydHlOYW1lcy5pbmRleE9mKHJvd0luZm8ucHJvcGVydHkubmFtZSkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBhY3RpdmF0ZWRSb3dzOiBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzKSxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgICogaXRlcmF0b3JzL3Zpc2l0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGZpbmRFbGVtZW50SW5UZW1wbGF0ZSAoY29tcG9uZW50SWQsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgbGV0IGZvdW5kXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kID0gbm9kZVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICB2aXNpdFRlbXBsYXRlIChsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLCBwYXJlbnQsIGl0ZXJhdGVlKSB7XG4gICAgaXRlcmF0ZWUodGVtcGxhdGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGVtcGxhdGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKCFjaGlsZCB8fCB0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBjb250aW51ZVxuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUobG9jYXRvciArICcuJyArIGksIGksIHRlbXBsYXRlLmNoaWxkcmVuLCBjaGlsZCwgdGVtcGxhdGUsIGl0ZXJhdGVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcFZpc2libGVGcmFtZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCByaWdodEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICBjb25zdCBmcmFtZU1vZHVsdXMgPSBnZXRGcmFtZU1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgbGV0IGl0ZXJhdGlvbkluZGV4ID0gLTFcbiAgICBmb3IgKGxldCBpID0gbGVmdEZyYW1lOyBpIDwgcmlnaHRGcmFtZTsgaSsrKSB7XG4gICAgICBpdGVyYXRpb25JbmRleCsrXG4gICAgICBsZXQgZnJhbWVOdW1iZXIgPSBpXG4gICAgICBsZXQgcGl4ZWxPZmZzZXRMZWZ0ID0gaXRlcmF0aW9uSW5kZXggKiBmcmFtZUluZm8ucHhwZlxuICAgICAgaWYgKHBpeGVsT2Zmc2V0TGVmdCA8PSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSB7XG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBmcmFtZUluZm8ucHhwZiwgZnJhbWVNb2R1bHVzKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSB7XG4gICAgICAgICAgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIG1hcFZpc2libGVUaW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBtc01vZHVsdXMgPSBnZXRNaWxsaXNlY29uZE1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCBsZWZ0TXMgPSBmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgcmlnaHRNcyA9IGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCB0b3RhbE1zID0gcmlnaHRNcyAtIGxlZnRNc1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gcm91bmRVcChsZWZ0TXMsIG1zTW9kdWx1cylcbiAgICBsZXQgbXNNYXJrZXJUbXAgPSBmaXJzdE1hcmtlclxuICAgIGNvbnN0IG1zTWFya2VycyA9IFtdXG4gICAgd2hpbGUgKG1zTWFya2VyVG1wIDw9IHJpZ2h0TXMpIHtcbiAgICAgIG1zTWFya2Vycy5wdXNoKG1zTWFya2VyVG1wKVxuICAgICAgbXNNYXJrZXJUbXAgKz0gbXNNb2R1bHVzXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNNYXJrZXIgPSBtc01hcmtlcnNbaV1cbiAgICAgIGxldCBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zTWFya2VyLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIGxldCBtc1JlbWFpbmRlciA9IE1hdGguZmxvb3IobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYgLSBtc01hcmtlcilcbiAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgbXNSZW1haW5kZXIgY2FzZSByYXRoZXIgdGhhbiBpZ25vcmluZyBpdFxuICAgICAgaWYgKCFtc1JlbWFpbmRlcikge1xuICAgICAgICBsZXQgZnJhbWVPZmZzZXQgPSBuZWFyZXN0RnJhbWUgLSBsZWZ0RnJhbWVcbiAgICAgICAgbGV0IHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUobXNNYXJrZXIsIHB4T2Zmc2V0LCB0b3RhbE1zKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIC8qXG4gICAqIGdldHRlcnMvY2FsY3VsYXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLyoqXG4gICAgLy8gU29ycnk6IFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gZ2l2ZW4gaHVtYW4tcmVhZGFibGUgbmFtZXNcbiAgICA8R0FVR0U+XG4gICAgICAgICAgICA8LS0tLWZyaVctLS0+XG4gICAgZnJpMCAgICBmcmlBICAgICAgICBmcmlCICAgICAgICBmcmlNYXggICAgICAgICAgICAgICAgICAgICAgICAgIGZyaU1heDJcbiAgICB8ICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8XG4gICAgICAgICAgICA8LS0tLS0tLS0tLS0+IDw8IHRpbWVsaW5lcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgIHxcbiAgICA8LS0tLS0tLT4gICAgICAgICAgIHwgPDwgcHJvcGVydGllcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgcHhBICAgICAgICAgcHhCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXggICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heDJcbiAgICA8U0NST0xMQkFSPlxuICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tfCA8PCBzY3JvbGxlciB2aWV3cG9ydFxuICAgICAgICAqPT09PSogICAgICAgICAgICA8PCBzY3JvbGxiYXJcbiAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAgICB8c2MwICAgICAgICAgICAgICAgIHxzY0wgJiYgc2NSYXRpb1xuICAgICAgICB8c2NBXG4gICAgICAgICAgICAgfHNjQlxuICAqL1xuICBnZXRGcmFtZUluZm8gKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHt9XG4gICAgZnJhbWVJbmZvLmZwcyA9IHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8vIE51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgIGZyYW1lSW5mby5tc3BmID0gMTAwMCAvIGZyYW1lSW5mby5mcHMgLy8gTWlsbGlzZWNvbmRzIHBlciBmcmFtZVxuICAgIGZyYW1lSW5mby5tYXhtcyA9IGdldE1heGltdW1Ncyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgIGZyYW1lSW5mby5tYXhmID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShmcmFtZUluZm8ubWF4bXMsIGZyYW1lSW5mby5tc3BmKSAvLyBNYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaTAgPSAwIC8vIFRoZSBsb3dlc3QgcG9zc2libGUgZnJhbWUgKGFsd2F5cyAwKVxuICAgIGZyYW1lSW5mby5mcmlBID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPCBmcmFtZUluZm8uZnJpMCkgPyBmcmFtZUluZm8uZnJpMCA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLy8gVGhlIGxlZnRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaU1heCA9IChmcmFtZUluZm8ubWF4ZiA8IDYwKSA/IDYwIDogZnJhbWVJbmZvLm1heGYgLy8gVGhlIG1heGltdW0gZnJhbWUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpTWF4MiA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heCAqIDEuODggIC8vIEV4dGVuZCB0aGUgbWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSAoYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBrZXlmcmFtZXMgYmV5b25kIHRoZSBwcmV2aW91c2x5IGRlZmluZWQgbWF4KVxuICAgIGZyYW1lSW5mby5mcmlCID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gPiBmcmFtZUluZm8uZnJpTWF4MikgPyBmcmFtZUluZm8uZnJpTWF4MiA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLy8gVGhlIHJpZ2h0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlXID0gTWF0aC5hYnMoZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkgLy8gVGhlIHdpZHRoIG9mIHRoZSB2aXNpYmxlIHJhbmdlIGluIGZyYW1lc1xuICAgIGZyYW1lSW5mby5weHBmID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8gZnJhbWVJbmZvLmZyaVcpIC8vIE51bWJlciBvZiBwaXhlbHMgcGVyIGZyYW1lIChyb3VuZGVkKVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA8IDEpIGZyYW1lSW5mby5wU2NyeHBmID0gMVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA+IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIGZyYW1lSW5mby5weHBmID0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aFxuICAgIGZyYW1lSW5mby5weEEgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4QiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhNYXgyID0gZnJhbWVJbmZvLmZyaU1heDIgKiBmcmFtZUluZm8ucHhwZiAvLyBUaGUgd2lkdGggaW4gcGl4ZWxzIHRoYXQgdGhlIGVudGlyZSB0aW1lbGluZSAoXCJmcmlNYXgyXCIpIHBhZGRpbmcgd291bGQgZXF1YWxcbiAgICBmcmFtZUluZm8ubXNBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgbGVmdG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8ubXNCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgcmlnaHRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLnNjTCA9IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvLyBUaGUgbGVuZ3RoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsZXIgdmlld1xuICAgIGZyYW1lSW5mby5zY1JhdGlvID0gZnJhbWVJbmZvLnB4TWF4MiAvIGZyYW1lSW5mby5zY0wgLy8gVGhlIHJhdGlvIG9mIHRoZSBzY3JvbGxlciB2aWV3IHRvIHRoZSB0aW1lbGluZSB2aWV3IChzbyB0aGUgc2Nyb2xsZXIgcmVuZGVycyBwcm9wb3J0aW9uYWxseSB0byB0aGUgdGltZWxpbmUgYmVpbmcgZWRpdGVkKVxuICAgIGZyYW1lSW5mby5zY0EgPSAoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIGxlZnQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgZnJhbWVJbmZvLnNjQiA9IChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgcmlnaHQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgcmV0dXJuIGZyYW1lSW5mb1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMvdGhlc2UgbWlzbm9tZXIocykuIEl0J3Mgbm90ICdBU0NJSSdcbiAgZ2V0QXNjaWlUcmVlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGxldCBhcmNoeUZvcm1hdCA9IHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgICBsZXQgYXJjaHlTdHIgPSBhcmNoeShhcmNoeUZvcm1hdClcbiAgICAgIHJldHVybiBhcmNoeVN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXRBcmNoeUZvcm1hdE5vZGVzIChsYWJlbCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWwsXG4gICAgICBub2RlczogY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykubWFwKChjaGlsZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCBjaGlsZC5jaGlsZHJlbilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50Um93c0RhdGEgKCkge1xuICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgKiptdXN0KiogY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIGNvbXBvbmVudCBoZWFkaW5ncy9wcm9wZXJ0eSByb3dzXG4gICAgbGV0IGFzY2lpU3ltYm9scyA9IHRoaXMuZ2V0QXNjaWlUcmVlKCkuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGNvbXBvbmVudFJvd3MgPSBbXVxuICAgIGxldCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlID0ge31cbiAgICBsZXQgdmlzaXRvckl0ZXJhdGlvbnMgPSAwXG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlIHx8ICF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIGNvbXBvbmVudFJvd3NcblxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzKSA9PiB7XG4gICAgICAvLyBUT0RPIGhvdyB3aWxsIHRoaXMgYml0ZSB1cz9cbiAgICAgIGxldCBpc0NvbXBvbmVudCA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpXG4gICAgICBsZXQgZWxlbWVudE5hbWUgPSBpc0NvbXBvbmVudCA/IG5vZGUuYXR0cmlidXRlcy5zb3VyY2UgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmIChBTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBpc0NvbXBvbmVudCA/IF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyhub2RlKSA6IF9idWlsZERPTUFkZHJlc3NhYmxlcyhlbGVtZW50TmFtZSwgbG9jYXRvcilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGlzQ2x1c3Rlck1lbWJlcjogdHJ1ZSwgaXNDbHVzdGVySGVhZGluZywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsIGNsdXN0ZXJOYW1lOiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLm5hbWUsIGlzQ2x1c3RlcjogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVGltZShmcmFtZUluZm8uZnJpMCkgKi9cbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaTAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgYWN0aXZlS2V5ZnJhbWVzOiBbXSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgaXNBY3RpdmUgPSB0cnVlXG4gICAgfSlcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWB9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgdG9wOiAtMyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICA6IChpc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgIH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYW5zaXRpb25Cb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG4gICAgY29uc3QgY3VydmUgPSBjdXJyLmN1cnZlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3Vyci5jdXJ2ZS5zbGljZSgxKVxuICAgIGNvbnN0IGJyZWFraW5nQm91bmRzID0gY3VydmUuaW5jbHVkZXMoJ0JhY2snKSB8fCBjdXJ2ZS5pbmNsdWRlcygnQm91bmNlJykgfHwgY3VydmUuaW5jbHVkZXMoJ0VsYXN0aWMnKVxuICAgIGNvbnN0IEN1cnZlU1ZHID0gQ1VSVkVTVkdTW2N1cnZlICsgJ1NWRyddXG4gICAgbGV0IGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGxldCBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuICAgICAgaWYgKGsgPT09IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCkgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICAgIGlmIChrID09PSBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSkpIHNlY29uZEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXMgPSBbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LCBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiB0cnVlLFxuICAgICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2UsIGFjdGl2ZUtleWZyYW1lczogW10gfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbnRhaW5lcidcbiAgICAgICAgICBrZXk9e3VuaXF1ZUtleX1cbiAgICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtdHJhbnNpdGlvbicsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIGN1cnZlOiBjdXJyLmN1cnZlLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSBQYWxldHRlLkdSQVlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7b3B0aW9ucy5jb2xsYXBzZWQgJiZcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb2xsYXBzZWQtYmFja2Ryb3AnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkdSQVlcbiAgICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDEsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MylcbiAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45NjUpXG4gICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDIsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgb3ZlcmZsb3c6IGJyZWFraW5nQm91bmRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJ2ZVNWR1xuICAgICAgICAgICAgICBpZD17dW5pcXVlS2V5fVxuICAgICAgICAgICAgICBsZWZ0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgICByaWdodEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbnN0YW50Qm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgLy8gY29uc3QgYWN0aXZlSW5mbyA9IHNldEFjdGl2ZUNvbnRlbnRzKHByb3BlcnR5TmFtZSwgY3VyciwgbmV4dCwgZmFsc2UsIHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgfX1cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb25zdGFudC1ib2R5J1xuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS1zZWdtZW50JyxcbiAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA5MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzIChub2RlKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBfYnVpbGRET01BZGRyZXNzYWJsZXMoJ2RpdicpIC8vIHN0YXJ0IHdpdGggZG9tIHByb3BlcnRpZXM/XG4gIGZvciAobGV0IG5hbWUgaW4gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXMpIHtcbiAgICBsZXQgc3RhdGUgPSBub2RlLmVsZW1lbnROYW1lLnN0YXRlc1tuYW1lXVxuXG4gICAgYWRkcmVzc2FibGVzLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHByZWZpeDogbmFtZSxcbiAgICAgIHN1ZmZpeDogdW5kZWZpbmVkLFxuICAgICAgZmFsbGJhY2s6IHN0YXRlLnZhbHVlLFxuICAgICAgdHlwZWRlZjogc3RhdGUudHlwZVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGFkZHJlc3NhYmxlc1xufVxuXG5mdW5jdGlvbiBfYnVpbGRET01BZGRyZXNzYWJsZXMgKGVsZW1lbnROYW1lLCBsb2NhdG9yKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBbXVxuXG4gIGNvbnN0IGRvbVNjaGVtYSA9IERPTVNjaGVtYVtlbGVtZW50TmFtZV1cbiAgY29uc3QgZG9tRmFsbGJhY2tzID0gRE9NRmFsbGJhY2tzW2VsZW1lbnROYW1lXVxuXG4gIGlmIChkb21TY2hlbWEpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gZG9tU2NoZW1hKSB7XG4gICAgICBsZXQgcHJvcGVydHlHcm91cCA9IG51bGxcblxuICAgICAgaWYgKGxvY2F0b3IgPT09ICcwJykgeyAvLyBUaGlzIGluZGljYXRlcyB0aGUgdG9wIGxldmVsIGVsZW1lbnQgKHRoZSBhcnRib2FyZClcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcblxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1gnKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3gnXVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1knKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3knXVxuXG4gICAgICAgICAgcHJvcGVydHlHcm91cCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHByZWZpeDogbmFtZVBhcnRzWzBdLFxuICAgICAgICAgICAgc3VmZml4OiBuYW1lUGFydHNbMV0sXG4gICAgICAgICAgICBmYWxsYmFjazogZG9tRmFsbGJhY2tzW3Byb3BlcnR5TmFtZV0sXG4gICAgICAgICAgICB0eXBlZGVmOiBkb21TY2hlbWFbcHJvcGVydHlOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAgIGxldCBuYW1lUGFydHMgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BlcnR5R3JvdXApIHtcbiAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBDTFVTVEVSRURfUFJPUFNbcHJvcGVydHlHcm91cC5uYW1lXVxuICAgICAgICBpZiAoY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgIHByb3BlcnR5R3JvdXAuY2x1c3RlciA9IHtcbiAgICAgICAgICAgIHByZWZpeDogY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgIG5hbWU6IENMVVNURVJfTkFNRVNbY2x1c3RlclByZWZpeF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhZGRyZXNzYWJsZXMucHVzaChwcm9wZXJ0eUdyb3VwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==