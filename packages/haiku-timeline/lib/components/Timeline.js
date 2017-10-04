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
  selectedKeyframes: {},
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
        _this3.executeBytecodeActionDeleteKeyframe({ componentId: { componentId: componentId, propertyName: propertyName, ms: startMs } }, timelineName);
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
    value: function executeBytecodeActionDeleteKeyframe(keyframes, timelineName) {
      var _this5 = this;

      _lodash2.default.each(keyframes, function (k) {
        _actions2.default.deleteKeyframe(_this5.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.ms);
        (0, _clearInMemoryBytecodeCaches2.default)(_this5.state.reifiedBytecode);
        _this5._component._clearCaches();
        _this5.setState({
          reifiedBytecode: _this5.state.reifiedBytecode,
          serializedBytecode: _this5._component.getSerializedBytecode(),
          keyframeDragStartPx: false,
          keyframeDragStartMs: false,
          transitionBodyDragging: false
        });
        _this5.props.websocket.action('deleteKeyframe', [_this5.props.folder, [k.componentId], timelineName, k.propertyName, k.ms], function () {});
      });
      this.setState({ selectedKeyframes: {} });
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
      var _this6 = this;

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
        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this6.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.handle, // todo: take a second look at this one
        k.index, k.ms, adjustedMs, frameInfo);
        // Update our selected keyframes start time now that we've moved them
        // Note: This seems like there's probably a more clever way to make sure this gets
        // updated via the BytecodeActions.moveSegmentEndpoints perhaps.
        selectedKeyframes[k.componentId + '-' + k.propertyName + '-' + k.index].ms = Object.keys(keyframeMoves)[k.index];
        _this6.setState({ selectedKeyframes: selectedKeyframes });

        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
          (0, _clearInMemoryBytecodeCaches2.default)(_this6.state.reifiedBytecode);
          _this6._component._clearCaches();
          _this6.setState({
            reifiedBytecode: _this6.state.reifiedBytecode,
            serializedBytecode: _this6._component.getSerializedBytecode()
          });

          // It's very heavy to transmit a websocket message for every single movement while updating the ui,
          // so the values are accumulated and sent via a single batched update.
          if (!_this6._keyframeMoves) _this6._keyframeMoves = {};
          var movementKey = [componentId, timelineName, propertyName].join('-');
          _this6._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
          _this6.debouncedKeyframeMoveAction();
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
      var _this7 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this7._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this7._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this8 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this8.state.selectedNodes[id];
            node.__isExpanded = !!_this8.state.expandedNodes[id];
            node.__isHidden = !!_this8.state.hiddenNodes[id];
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
      var _this9 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this9.selectNode(node);
          _this9.expandNode(node);
          _this9.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this10 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this10.deselectNode(node);
        _this10.collapseNode(node);
        _this10.scrollToTop(node);
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
      var _this11 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this11.activateRow(rowInfo);
        } else {
          _this11.deactivateRow(rowInfo);
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
      var _this12 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this12.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this13 = this;

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
              if (_this13.state.expandedPropertyClusters[clusterKey]) {
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
      var _this14 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this14.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this14.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
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
      var _this15 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1508
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
            _this15.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this15.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this15.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this15.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this15._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this15.props.websocket.action('setTimelineName', [_this15.props.folder, currentTimelineName], function () {});
            _this15.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this15.getFrameInfo();
            _this15._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this15.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this15.getFrameInfo();
            _this15.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this15._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this15.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this15.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1513
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
      var _this16 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1581
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this16.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this16.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this16.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this16.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this16.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this16.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this17 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this17.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this17.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this17.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this17.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this17.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this17.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this17.state.keyframeDragStartMs + msChange);
              _this17.executeBytecodeActionMoveSegmentEndpoints(componentId, _this17.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this17.state.selectedKeyframes;
            if (!e.shiftKey) selectedKeyframes = {};

            selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              index: curr.index,
              ms: curr.ms,
              handle: handle,
              componentId: componentId,
              propertyName: propertyName
            };
            _this17.setState({ selectedKeyframes: selectedKeyframes });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1604
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
            _this17.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this17.state.currentTimelineName,
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
            lineNumber: 1644
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
            lineNumber: 1690
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
              lineNumber: 1702
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1710
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this18 = this;

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
            _this18.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this18.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this18.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this18.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this18.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this18.state.keyframeDragStartMs + msChange);
            _this18.executeBytecodeActionMoveSegmentEndpoints(componentId, _this18.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this18.state.selectedKeyframes;
            if (!e.shiftKey) selectedKeyframes = {};
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
              index: next.index,
              ms: next.ms,
              handle: 'middle'
            };
            _this18.setState({ selectedKeyframes: selectedKeyframes });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1734
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this18[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this18.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this18.state.currentTimelineName,
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
              if (_this18[uniqueKey]) _this18[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this18[uniqueKey]) _this18[uniqueKey].style.color = 'transparent';
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
              lineNumber: 1781
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
              lineNumber: 1832
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
              lineNumber: 1848
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
                lineNumber: 1865
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
                  lineNumber: 1875
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1883
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
                lineNumber: 1893
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1902
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
                lineNumber: 1920
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
                  lineNumber: 1931
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1941
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
      var _this19 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this19[uniqueKey] = domElement;
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
            _this19.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this19.state.currentTimelineName,
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
            lineNumber: 1961
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
            lineNumber: 2000
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this20 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this20.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this20.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this20.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this20.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this20.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this20.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 2043
            },
            __self: _this20
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this21 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2059
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2060
                  },
                  __self: _this21
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
                  lineNumber: 2069
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2070
                  },
                  __self: _this21
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
                  lineNumber: 2075
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2076
                  },
                  __self: _this21
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
      var _this22 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 2087
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2089
            },
            __self: _this22
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this23 = this;

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
            _this23.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this23.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this23.setState({ scrubberDragStart: null, frameBaseline: _this23.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this23.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 2102
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2121
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
                lineNumber: 2122
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
                lineNumber: 2135
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
                lineNumber: 2145
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
              lineNumber: 2157
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this24 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this24.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this24.state.maxFrame ? _this24.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this24.state.addInterval);
              _this24.setState({ maxFrame: currentMax + _this24.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this24.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this24.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2180
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2199
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
                lineNumber: 2200
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
                lineNumber: 2213
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2227
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this25 = this;

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
            lineNumber: 2234
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
              lineNumber: 2247
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
                lineNumber: 2256
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2268
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2270
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
                    lineNumber: 2271
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
                lineNumber: 2275
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2290
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2292
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
                    lineNumber: 2293
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
                  lineNumber: 2296
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
                lineNumber: 2298
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2315
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2316
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2317
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2319
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
                  lineNumber: 2321
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2322
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2323
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2324
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
              if (_this25.state.scrubberDragStart === null || _this25.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this25.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this25._component.getCurrentTimeline().seek(newFrame);
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
              lineNumber: 2331
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
      var _this26 = this;

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
            lineNumber: 2368
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this26.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this26.state.visibleFrameRange[0],
                scrollbarEnd: _this26.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this26.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this26.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this26.state.scrollerLeftDragStart && !_this26.state.scrollerRightDragStart) {
                _this26.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2378
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
                lineNumber: 2402
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this26.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this26.state.visibleFrameRange[0], scrollbarEnd: _this26.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this26.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this26.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2412
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2417
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this26.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this26.state.visibleFrameRange[0], scrollbarEnd: _this26.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this26.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this26.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2419
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2424
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
              lineNumber: 2428
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
              lineNumber: 2429
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
            lineNumber: 2444
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
            lineNumber: 2471
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2474
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
              lineNumber: 2475
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2486
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2487
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
              lineNumber: 2489
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
      var _this27 = this;

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
              _this27.collapseNode(item.node, componentId);
              _this27.props.websocket.action('unselectElement', [_this27.props.folder, componentId], function () {});
            } else {
              _this27.expandNode(item.node, componentId);
              _this27.props.websocket.action('selectElement', [_this27.props.folder, componentId], function () {});
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
            lineNumber: 2504
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
            lineNumber: 2531
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
              lineNumber: 2539
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2547
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
                  lineNumber: 2548
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2553
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2553
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2554
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2554
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
              lineNumber: 2560
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
      var _this28 = this;

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
            lineNumber: 2575
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this28.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this28.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2585
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
                lineNumber: 2597
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2607
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2607
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
              lineNumber: 2612
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
                lineNumber: 2621
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
                  lineNumber: 2634
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
              lineNumber: 2648
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
              lineNumber: 2657
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
              _this28.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this28.state.currentTimelineName,
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
              if (!_this28.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this28.setState({ activatedRows: activatedRows });
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
              lineNumber: 2672
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
      var _this29 = this;

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
            var expandedPropertyClusters = _lodash2.default.clone(_this29.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this29.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this29.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this29.setState({
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
            lineNumber: 2723
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2754
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
              lineNumber: 2756
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
                lineNumber: 2764
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2771
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2771
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
                lineNumber: 2773
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
                  lineNumber: 2783
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
              lineNumber: 2792
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
              lineNumber: 2801
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
              lineNumber: 2815
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this29.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this29.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this29.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
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
      var _this30 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2846
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
            lineNumber: 2849
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this30.renderClusterRow(item, index, _this30.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this30.renderPropertyRow(item, index, _this30.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this30.renderComponentHeadingRow(item, index, _this30.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this31 = this;

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
            lineNumber: 2871
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
            lineNumber: 2887
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
              _this31.setState({ selectedKeyframes: {} });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2898
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

            _this31.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this31.state.inputFocused), _this31.state.currentTimelineName, _this31.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this31.state.inputFocused), _this31.getCurrentTimelineTime(_this31.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this31.setState({
              inputFocused: _this31.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this31.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this31.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2918
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwic2VsZWN0ZWRLZXlmcmFtZXMiLCJyZWlmaWVkQnl0ZWNvZGUiLCJzZXJpYWxpemVkQnl0ZWNvZGUiLCJDVVJWRVNWR1MiLCJFYXNlSW5CYWNrU1ZHIiwiRWFzZUluQm91bmNlU1ZHIiwiRWFzZUluQ2lyY1NWRyIsIkVhc2VJbkN1YmljU1ZHIiwiRWFzZUluRWxhc3RpY1NWRyIsIkVhc2VJbkV4cG9TVkciLCJFYXNlSW5RdWFkU1ZHIiwiRWFzZUluUXVhcnRTVkciLCJFYXNlSW5RdWludFNWRyIsIkVhc2VJblNpbmVTVkciLCJFYXNlSW5PdXRCYWNrU1ZHIiwiRWFzZUluT3V0Qm91bmNlU1ZHIiwiRWFzZUluT3V0Q2lyY1NWRyIsIkVhc2VJbk91dEN1YmljU1ZHIiwiRWFzZUluT3V0RWxhc3RpY1NWRyIsIkVhc2VJbk91dEV4cG9TVkciLCJFYXNlSW5PdXRRdWFkU1ZHIiwiRWFzZUluT3V0UXVhcnRTVkciLCJFYXNlSW5PdXRRdWludFNWRyIsIkVhc2VJbk91dFNpbmVTVkciLCJFYXNlT3V0QmFja1NWRyIsIkVhc2VPdXRCb3VuY2VTVkciLCJFYXNlT3V0Q2lyY1NWRyIsIkVhc2VPdXRDdWJpY1NWRyIsIkVhc2VPdXRFbGFzdGljU1ZHIiwiRWFzZU91dEV4cG9TVkciLCJFYXNlT3V0UXVhZFNWRyIsIkVhc2VPdXRRdWFydFNWRyIsIkVhc2VPdXRRdWludFNWRyIsIkVhc2VPdXRTaW5lU1ZHIiwiTGluZWFyU1ZHIiwiQUxMT1dFRF9QUk9QUyIsIkNMVVNURVJFRF9QUk9QUyIsIkNMVVNURVJfTkFNRVMiLCJBTExPV0VEX1BST1BTX1RPUF9MRVZFTCIsIkFMTE9XRURfVEFHTkFNRVMiLCJkaXYiLCJzdmciLCJnIiwicmVjdCIsImNpcmNsZSIsImVsbGlwc2UiLCJsaW5lIiwicG9seWxpbmUiLCJwb2x5Z29uIiwiVEhST1RUTEVfVElNRSIsInZpc2l0Iiwibm9kZSIsInZpc2l0b3IiLCJjaGlsZHJlbiIsImkiLCJsZW5ndGgiLCJjaGlsZCIsIlRpbWVsaW5lIiwicHJvcHMiLCJzdGF0ZSIsImFzc2lnbiIsImN0eG1lbnUiLCJ3aW5kb3ciLCJlbWl0dGVycyIsIl9jb21wb25lbnQiLCJhbGlhcyIsImZvbGRlciIsInVzZXJjb25maWciLCJ3ZWJzb2NrZXQiLCJwbGF0Zm9ybSIsImVudm95IiwiV2ViU29ja2V0IiwiZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uIiwidGhyb3R0bGUiLCJiaW5kIiwidXBkYXRlU3RhdGUiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwidGltZWxpbmUiLCJkaWRNb3VudCIsIk9iamVjdCIsImtleXMiLCJ1cGRhdGVzIiwia2V5IiwiY2hhbmdlcyIsImNicyIsImNhbGxiYWNrcyIsInNwbGljZSIsInNldFN0YXRlIiwiY2xlYXJDaGFuZ2VzIiwiZm9yRWFjaCIsImNiIiwicHVzaCIsImZsdXNoVXBkYXRlcyIsImsxIiwiazIiLCJjb21wb25lbnRJZCIsInByb3BlcnR5TmFtZSIsIl9yb3dDYWNoZUFjdGl2YXRpb24iLCJ0dXBsZSIsInJlbW92ZUxpc3RlbmVyIiwidG91ckNsaWVudCIsIm9mZiIsIl9lbnZveUNsaWVudCIsImNsb3NlQ29ubmVjdGlvbiIsImRvY3VtZW50IiwiYm9keSIsImNsaWVudFdpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZEVtaXR0ZXJMaXN0ZW5lciIsIm1lc3NhZ2UiLCJuYW1lIiwibW91bnRBcHBsaWNhdGlvbiIsIm9uIiwibWV0aG9kIiwicGFyYW1zIiwiY29uc29sZSIsImluZm8iLCJjYWxsTWV0aG9kIiwibWF5YmVDb21wb25lbnRJZHMiLCJtYXliZVRpbWVsaW5lTmFtZSIsIm1heWJlVGltZWxpbmVUaW1lIiwibWF5YmVQcm9wZXJ0eU5hbWVzIiwibWF5YmVNZXRhZGF0YSIsIl9jbGVhckNhY2hlcyIsImdldFJlaWZpZWRCeXRlY29kZSIsImdldFNlcmlhbGl6ZWRCeXRlY29kZSIsImZyb20iLCJtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIiwibWluaW9uU2VsZWN0RWxlbWVudCIsIm1pbmlvblVuc2VsZWN0RWxlbWVudCIsInJlaHlkcmF0ZUJ5dGVjb2RlIiwiY2xpZW50Iiwic2V0VGltZW91dCIsIm5leHQiLCJwYXN0ZUV2ZW50IiwidGFnbmFtZSIsInRhcmdldCIsInRhZ05hbWUiLCJ0b0xvd2VyQ2FzZSIsImVkaXRhYmxlIiwiZ2V0QXR0cmlidXRlIiwicHJldmVudERlZmF1bHQiLCJzZW5kIiwidHlwZSIsImRhdGEiLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlS2V5VXAiLCJ0aW1lbGluZU5hbWUiLCJlbGVtZW50TmFtZSIsInN0YXJ0TXMiLCJmcmFtZUluZm8iLCJnZXRGcmFtZUluZm8iLCJuZWFyZXN0RnJhbWUiLCJtc3BmIiwiZmluYWxNcyIsIk1hdGgiLCJyb3VuZCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50IiwiZW5kTXMiLCJjdXJ2ZU5hbWUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUiLCJtcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSIsImhhbmRsZSIsImtleWZyYW1lSW5kZXgiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyIsIl90aW1lbGluZXMiLCJ1cGRhdGVUaW1lIiwiZnJpTWF4IiwiZ2V0Q3VycmVudFRpbWVsaW5lIiwic2Vla0FuZFBhdXNlIiwiZnJpQiIsImZyaUEiLCJ0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UiLCJzZWxlY3RvciIsIndlYnZpZXciLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiZXJyb3IiLCJuYXRpdmVFdmVudCIsInJlZnMiLCJleHByZXNzaW9uSW5wdXQiLCJ3aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQiLCJrZXlDb2RlIiwidG9nZ2xlUGxheWJhY2siLCJ3aGljaCIsInVwZGF0ZVNjcnViYmVyUG9zaXRpb24iLCJ1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSIsImlzRW1wdHkiLCJ1cGRhdGVLZXlib2FyZFN0YXRlIiwiZXZlbnRFbWl0dGVyIiwiZXZlbnROYW1lIiwiZXZlbnRIYW5kbGVyIiwiX19pc1NlbGVjdGVkIiwiY2xvbmUiLCJhdHRyaWJ1dGVzIiwidHJlZVVwZGF0ZSIsIkRhdGUiLCJub3ciLCJzY3JvbGx2aWV3Iiwic2Nyb2xsVG9wIiwicm93c0RhdGEiLCJjb21wb25lbnRSb3dzRGF0YSIsImZvdW5kSW5kZXgiLCJpbmRleENvdW50ZXIiLCJyb3dJbmZvIiwiaW5kZXgiLCJpc0hlYWRpbmciLCJpc1Byb3BlcnR5IiwiX19pc0V4cGFuZGVkIiwiZG9tTm9kZSIsImN1cnRvcCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFRvcCIsInBhcmVudCIsImV4cGFuZE5vZGUiLCJyb3ciLCJwcm9wZXJ0eSIsIml0ZW0iLCJkcmFnWCIsImRyYWdTdGFydCIsInNjcnViYmVyRHJhZ1N0YXJ0IiwiZnJhbWVCYXNlbGluZSIsImRyYWdEZWx0YSIsImZyYW1lRGVsdGEiLCJweHBmIiwic2VlayIsImR1cmF0aW9uRHJhZ1N0YXJ0IiwiYWRkSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImN1cnJlbnRNYXgiLCJmcmlNYXgyIiwiZHJhZ0lzQWRkaW5nIiwiY2xlYXJJbnRlcnZhbCIsInhsIiwieHIiLCJhYnNMIiwiYWJzUiIsInNjcm9sbGVyTGVmdERyYWdTdGFydCIsInNjcm9sbGVyUmlnaHREcmFnU3RhcnQiLCJzY3JvbGxlckJvZHlEcmFnU3RhcnQiLCJvZmZzZXRMIiwic2Nyb2xsYmFyU3RhcnQiLCJzY1JhdGlvIiwib2Zmc2V0UiIsInNjcm9sbGJhckVuZCIsImRpZmZYIiwiZkwiLCJmUiIsImZyaTAiLCJkZWx0YSIsImwiLCJyIiwic3BhbiIsIm5ld0wiLCJuZXdSIiwic3RhcnRWYWx1ZSIsIm1heWJlQ3VydmUiLCJlbmRWYWx1ZSIsImNyZWF0ZUtleWZyYW1lIiwiZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUiLCJnZXQiLCJhY3Rpb24iLCJzcGxpdFNlZ21lbnQiLCJqb2luS2V5ZnJhbWVzIiwia2V5ZnJhbWVEcmFnU3RhcnRQeCIsImtleWZyYW1lRHJhZ1N0YXJ0TXMiLCJ0cmFuc2l0aW9uQm9keURyYWdnaW5nIiwiY3VydmVGb3JXaXJlIiwia2V5ZnJhbWVzIiwiZWFjaCIsImsiLCJkZWxldGVLZXlmcmFtZSIsImNoYW5nZVNlZ21lbnRDdXJ2ZSIsIm9sZFN0YXJ0TXMiLCJvbGRFbmRNcyIsIm5ld1N0YXJ0TXMiLCJuZXdFbmRNcyIsImNoYW5nZVNlZ21lbnRFbmRwb2ludHMiLCJvbGRUaW1lbGluZU5hbWUiLCJuZXdUaW1lbGluZU5hbWUiLCJyZW5hbWVUaW1lbGluZSIsImNyZWF0ZVRpbWVsaW5lIiwiZHVwbGljYXRlVGltZWxpbmUiLCJkZWxldGVUaW1lbGluZSIsImNoYW5nZU1zIiwiYWRqdXN0ZWRNcyIsInBhcnNlSW50Iiwia2V5ZnJhbWVNb3ZlcyIsIm1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX2tleWZyYW1lTW92ZXMiLCJtb3ZlbWVudEtleSIsImpvaW4iLCJrZXlmcmFtZU1vdmVzRm9yV2lyZSIsInBhdXNlIiwicGxheSIsInRlbXBsYXRlIiwidmlzaXRUZW1wbGF0ZSIsImlkIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJpc0NvbXBvbmVudCIsInNvdXJjZSIsImFzY2lpQnJhbmNoIiwiaGVhZGluZ1JvdyIsInByb3BlcnR5Um93cyIsIl9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyIsIl9idWlsZERPTUFkZHJlc3NhYmxlcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiaiIsIm5leHRJbmRleCIsIm5leHREZXNjcmlwdG9yIiwiY2x1c3Rlck5hbWUiLCJpc0NsdXN0ZXIiLCJpdGVtcyIsIl9pbmRleCIsIl9pdGVtcyIsInNlZ21lbnRPdXRwdXRzIiwidmFsdWVHcm91cCIsImdldFZhbHVlR3JvdXAiLCJrZXlmcmFtZXNMaXN0Iiwia2V5ZnJhbWVLZXkiLCJzb3J0IiwiYSIsImIiLCJtc2N1cnIiLCJpc05hTiIsIm1zcHJldiIsIm1zbmV4dCIsInVuZGVmaW5lZCIsInByZXYiLCJjdXJyIiwiZnJhbWUiLCJ2YWx1ZSIsImN1cnZlIiwicHhPZmZzZXRMZWZ0IiwicHhPZmZzZXRSaWdodCIsInNlZ21lbnRPdXRwdXQiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJwcm9wZXJ0eU91dHB1dHMiLCJtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwiY29uY2F0IiwicG9zaXRpb24iLCJyZW1vdmVUaW1lbGluZVNoYWRvdyIsInRpbWVsaW5lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lIiwic2V0VGltZWxpbmVOYW1lIiwiaW5wdXRFdmVudCIsIk51bWJlciIsImlucHV0SXRlbSIsImdldEN1cnJlbnRUaW1lbGluZVRpbWUiLCJoZWlnaHQiLCJ3aWR0aCIsIm92ZXJmbG93IiwibWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMiLCJzZWdtZW50UGllY2VzIiwicmVuZGVyVHJhbnNpdGlvbkJvZHkiLCJjb2xsYXBzZWQiLCJjb2xsYXBzZWRFbGVtZW50IiwicmVuZGVyQ29uc3RhbnRCb2R5IiwicmVuZGVyU29sb0tleWZyYW1lIiwib3B0aW9ucyIsImRyYWdFdmVudCIsImRyYWdEYXRhIiwic2V0Um93Q2FjaGVBY3RpdmF0aW9uIiwieCIsInVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uIiwicHhDaGFuZ2UiLCJsYXN0WCIsIm1zQ2hhbmdlIiwiZGVzdE1zIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInNoaWZ0S2V5IiwiY3R4TWVudUV2ZW50IiwibG9jYWxPZmZzZXRYIiwib2Zmc2V0WCIsInRvdGFsT2Zmc2V0WCIsImNsaWNrZWRNcyIsImNsaWNrZWRGcmFtZSIsInNob3ciLCJldmVudCIsInN0YXJ0RnJhbWUiLCJlbmRGcmFtZSIsImRpc3BsYXkiLCJ6SW5kZXgiLCJjdXJzb3IiLCJpc0FjdGl2ZSIsInRyYW5zZm9ybSIsInRyYW5zaXRpb24iLCJCTFVFIiwiY29sbGFwc2VkUHJvcGVydHkiLCJEQVJLX1JPQ0siLCJMSUdIVEVTVF9QSU5LIiwiUk9DSyIsInVuaXF1ZUtleSIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJicmVha2luZ0JvdW5kcyIsImluY2x1ZGVzIiwiQ3VydmVTVkciLCJmaXJzdEtleWZyYW1lQWN0aXZlIiwic2Vjb25kS2V5ZnJhbWVBY3RpdmUiLCJkb21FbGVtZW50IiwicmVhY3RFdmVudCIsInN0eWxlIiwiY29sb3IiLCJHUkFZIiwiV2Via2l0VXNlclNlbGVjdCIsImJvcmRlclJhZGl1cyIsImJhY2tncm91bmRDb2xvciIsIlNVTlNUT05FIiwiZmFkZSIsInBhZGRpbmdUb3AiLCJyaWdodCIsIkRBUktFUl9HUkFZIiwiYWxsSXRlbXMiLCJpc0FjdGl2YXRlZCIsImlzUm93QWN0aXZhdGVkIiwicmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIiwibWFwVmlzaWJsZUZyYW1lcyIsInBpeGVsc1BlckZyYW1lIiwicG9pbnRlckV2ZW50cyIsImZvbnRXZWlnaHQiLCJtYXBWaXNpYmxlVGltZXMiLCJtaWxsaXNlY29uZHNOdW1iZXIiLCJ0b3RhbE1pbGxpc2Vjb25kcyIsImd1aWRlSGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwiYm9yZGVyTGVmdCIsIkNPQUwiLCJmcmFCIiwic2hhZnRIZWlnaHQiLCJjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIiwiYm94U2hhZG93IiwiYm9yZGVyUmlnaHQiLCJib3JkZXJUb3AiLCJjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24iLCJib3JkZXJUb3BSaWdodFJhZGl1cyIsImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIiwibW91c2VFdmVudHMiLCJGQVRIRVJfQ09BTCIsInZlcnRpY2FsQWxpZ24iLCJmb250U2l6ZSIsImJvcmRlckJvdHRvbSIsImZsb2F0IiwibWluV2lkdGgiLCJ0ZXh0QWxpZ24iLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nIiwiUk9DS19NVVRFRCIsImZvbnRTdHlsZSIsIm1hcmdpblRvcCIsInRvZ2dsZVRpbWVEaXNwbGF5TW9kZSIsIm1hcmdpblJpZ2h0IiwiY2xpY2tFdmVudCIsImxlZnRYIiwiZnJhbWVYIiwibmV3RnJhbWUiLCJyZW5kZXJGcmFtZUdyaWQiLCJyZW5kZXJHYXVnZSIsInJlbmRlclNjcnViYmVyIiwicmVuZGVyRHVyYXRpb25Nb2RpZmllciIsImtub2JSYWRpdXMiLCJjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSIsIkxJR0hURVNUX0dSQVkiLCJib3R0b20iLCJyZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyIiwicmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzIiwiR1JBWV9GSVQxIiwibWFyZ2luTGVmdCIsInRhYmxlTGF5b3V0IiwiTElHSFRfR1JBWSIsIm9wYWNpdHkiLCJyZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nIiwicmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicHJvcGVydHlPbkxhc3RDb21wb25lbnQiLCJodW1hbk5hbWUiLCJ0ZXh0VHJhbnNmb3JtIiwibGluZUhlaWdodCIsInJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsInJlbmRlckNsdXN0ZXJSb3ciLCJyZW5kZXJQcm9wZXJ0eVJvdyIsInJlbmRlckNvbXBvbmVudEhlYWRpbmdSb3ciLCJnZXRDb21wb25lbnRSb3dzRGF0YSIsIm92ZXJmbG93WSIsIm92ZXJmbG93WCIsInJlbmRlclRvcENvbnRyb2xzIiwicmVuZGVyQ29tcG9uZW50Um93cyIsInJlbmRlckJvdHRvbUNvbnRyb2xzIiwiY29tbWl0dGVkVmFsdWUiLCJKU09OIiwic3RyaW5naWZ5IiwibmF2RGlyIiwiZG9Gb2N1cyIsIkNvbXBvbmVudCIsImFkZHJlc3NhYmxlcyIsInN0YXRlcyIsInN1ZmZpeCIsImZhbGxiYWNrIiwidHlwZWRlZiIsImRvbVNjaGVtYSIsImRvbUZhbGxiYWNrcyIsInByb3BlcnR5R3JvdXAiLCJuYW1lUGFydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFF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QjtBQU9EO0FBQ0Y7O0FBRUQsVUFBSTBlLGFBQUosRUFBbUI7QUFDakIsWUFBSTVNLGdCQUFnQjFWLGdCQUFnQnNpQixjQUFjNWQsSUFBOUIsQ0FBcEI7QUFDQSxZQUFJZ1IsYUFBSixFQUFtQjtBQUNqQjRNLHdCQUFjN00sT0FBZCxHQUF3QjtBQUN0QkUsb0JBQVFELGFBRGM7QUFFdEJoUixrQkFBTXpFLGNBQWN5VixhQUFkO0FBRmdCLFdBQXhCO0FBSUQ7O0FBRURxTSxxQkFBYXhlLElBQWIsQ0FBa0IrZSxhQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPUCxZQUFQO0FBQ0Q7O2tCQUVjMWdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gIHJlaWZpZWRCeXRlY29kZTogbnVsbCxcbiAgc2VyaWFsaXplZEJ5dGVjb2RlOiBudWxsXG59XG5cbmNvbnN0IENVUlZFU1ZHUyA9IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufVxuXG4vKipcbiAqIEhleSEgSWYgeW91IHdhbnQgdG8gQUREIGFueSBwcm9wZXJ0aWVzIGhlcmUsIHlvdSBtaWdodCBhbHNvIG5lZWQgdG8gdXBkYXRlIHRoZSBkaWN0aW9uYXJ5IGluXG4gKiBoYWlrdS1ieXRlY29kZS9zcmMvcHJvcGVydGllcy9kb20vc2NoZW1hLFxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL2ZhbGxiYWNrcyxcbiAqIG9yIHRoZXkgbWlnaHQgbm90IHNob3cgdXAgaW4gdGhlIHZpZXcuXG4gKi9cblxuY29uc3QgQUxMT1dFRF9QUk9QUyA9IHtcbiAgJ3RyYW5zbGF0aW9uLngnOiB0cnVlLFxuICAndHJhbnNsYXRpb24ueSc6IHRydWUsXG4gIC8vICd0cmFuc2xhdGlvbi56JzogdHJ1ZSwgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueic6IHRydWUsXG4gICdyb3RhdGlvbi54JzogdHJ1ZSxcbiAgJ3JvdGF0aW9uLnknOiB0cnVlLFxuICAnc2NhbGUueCc6IHRydWUsXG4gICdzY2FsZS55JzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlLFxuICAvLyAnc2hvd24nOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZVxuICAvLyAnY29sb3InOiB0cnVlLFxuICAvLyAnZmlsbCc6IHRydWUsXG4gIC8vICdzdHJva2UnOiB0cnVlXG59XG5cbmNvbnN0IENMVVNURVJFRF9QUk9QUyA9IHtcbiAgJ21vdW50LngnOiAnbW91bnQnLFxuICAnbW91bnQueSc6ICdtb3VudCcsXG4gICdtb3VudC56JzogJ21vdW50JyxcbiAgJ2FsaWduLngnOiAnYWxpZ24nLFxuICAnYWxpZ24ueSc6ICdhbGlnbicsXG4gICdhbGlnbi56JzogJ2FsaWduJyxcbiAgJ29yaWdpbi54JzogJ29yaWdpbicsXG4gICdvcmlnaW4ueSc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnonOiAnb3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uLngnOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueSc6ICd0cmFuc2xhdGlvbicsXG4gICd0cmFuc2xhdGlvbi56JzogJ3RyYW5zbGF0aW9uJywgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueCc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi55JzogJ3JvdGF0aW9uJyxcbiAgJ3JvdGF0aW9uLnonOiAncm90YXRpb24nLFxuICAvLyAncm90YXRpb24udyc6ICdyb3RhdGlvbicsIC8vIFByb2JhYmx5IGVhc2llc3Qgbm90IHRvIGxldCB0aGUgdXNlciBoYXZlIGNvbnRyb2wgb3ZlciBxdWF0ZXJuaW9uIG1hdGhcbiAgJ3NjYWxlLngnOiAnc2NhbGUnLFxuICAnc2NhbGUueSc6ICdzY2FsZScsXG4gICdzY2FsZS56JzogJ3NjYWxlJyxcbiAgJ3NpemVNb2RlLngnOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueSc6ICdzaXplTW9kZScsXG4gICdzaXplTW9kZS56JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueCc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueSc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueic6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueCc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueSc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueic6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVBYnNvbHV0ZS54JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzaXplQWJzb2x1dGUueSc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnonOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3N0eWxlLm92ZXJmbG93WCc6ICdvdmVyZmxvdycsXG4gICdzdHlsZS5vdmVyZmxvd1knOiAnb3ZlcmZsb3cnXG59XG5cbmNvbnN0IENMVVNURVJfTkFNRVMgPSB7XG4gICdtb3VudCc6ICdNb3VudCcsXG4gICdhbGlnbic6ICdBbGlnbicsXG4gICdvcmlnaW4nOiAnT3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uJzogJ1Bvc2l0aW9uJyxcbiAgJ3JvdGF0aW9uJzogJ1JvdGF0aW9uJyxcbiAgJ3NjYWxlJzogJ1NjYWxlJyxcbiAgJ3NpemVNb2RlJzogJ1NpemluZyBNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwnOiAnU2l6ZSAlJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwnOiAnU2l6ZSArLy0nLFxuICAnc2l6ZUFic29sdXRlJzogJ1NpemUnLFxuICAnb3ZlcmZsb3cnOiAnT3ZlcmZsb3cnXG59XG5cbmNvbnN0IEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMID0ge1xuICAnc2l6ZUFic29sdXRlLngnOiB0cnVlLFxuICAnc2l6ZUFic29sdXRlLnknOiB0cnVlLFxuICAvLyBFbmFibGUgdGhlc2UgYXMgc3VjaCBhIHRpbWUgYXMgd2UgY2FuIHJlcHJlc2VudCB0aGVtIHZpc3VhbGx5IGluIHRoZSBnbGFzc1xuICAvLyAnc3R5bGUub3ZlcmZsb3dYJzogdHJ1ZSxcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WSc6IHRydWUsXG4gICdiYWNrZ3JvdW5kQ29sb3InOiB0cnVlLFxuICAnb3BhY2l0eSc6IHRydWVcbn1cblxuY29uc3QgQUxMT1dFRF9UQUdOQU1FUyA9IHtcbiAgZGl2OiB0cnVlLFxuICBzdmc6IHRydWUsXG4gIGc6IHRydWUsXG4gIHJlY3Q6IHRydWUsXG4gIGNpcmNsZTogdHJ1ZSxcbiAgZWxsaXBzZTogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcG9seWxpbmU6IHRydWUsXG4gIHBvbHlnb246IHRydWVcbn1cblxuY29uc3QgVEhST1RUTEVfVElNRSA9IDE3IC8vIG1zXG5cbmZ1bmN0aW9uIHZpc2l0IChub2RlLCB2aXNpdG9yKSB7XG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2aXNpdG9yKGNoaWxkKVxuICAgICAgICB2aXNpdChjaGlsZCwgdmlzaXRvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSBsb2Rhc2guYXNzaWduKHt9LCBERUZBVUxUUylcbiAgICB0aGlzLmN0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdIC8vIEFycmF5PHtldmVudEVtaXR0ZXI6RXZlbnRFbWl0dGVyLCBldmVudE5hbWU6c3RyaW5nLCBldmVudEhhbmRsZXI6RnVuY3Rpb259PlxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ3RpbWVsaW5lJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHdlIHN0b3JlIGFjY3VtdWxhdGVkIGtleWZyYW1lIG1vdmVtZW50cywgd2UgY2FuIHNlbmQgdGhlIHdlYnNvY2tldCB1cGRhdGUgaW4gYmF0Y2hlcztcbiAgICAvLyBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBhdm9pZHMgdW5uZWNlc3NhcnkgdXBkYXRlcyB0byB0aGUgb3ZlciB2aWV3c1xuICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uID0gbG9kYXNoLnRocm90dGxlKHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uLmJpbmQodGhpcyksIDI1MClcbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB3aW5kb3cudGltZWxpbmUgPSB0aGlzXG4gIH1cblxuICBmbHVzaFVwZGF0ZXMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVwZGF0ZXMpLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnVwZGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW2tleV0gIT09IHRoaXMudXBkYXRlc1trZXldKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlc1trZXldID0gdGhpcy51cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHRoaXMuY2FsbGJhY2tzLnNwbGljZSgwKVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy51cGRhdGVzLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2hhbmdlcygpXG4gICAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKCkpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICh1cGRhdGVzLCBjYikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlc1trZXldID0gdXBkYXRlc1trZXldXG4gICAgfVxuICAgIGlmIChjYikge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYilcbiAgICB9XG4gICAgdGhpcy5mbHVzaFVwZGF0ZXMoKVxuICB9XG5cbiAgY2xlYXJDaGFuZ2VzICgpIHtcbiAgICBmb3IgKGNvbnN0IGsxIGluIHRoaXMudXBkYXRlcykgZGVsZXRlIHRoaXMudXBkYXRlc1trMV1cbiAgICBmb3IgKGNvbnN0IGsyIGluIHRoaXMuY2hhbmdlcykgZGVsZXRlIHRoaXMuY2hhbmdlc1trMl1cbiAgfVxuXG4gIHVwZGF0ZVRpbWUgKGN1cnJlbnRGcmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RnJhbWUgfSlcbiAgfVxuXG4gIHNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSB7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfVxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIHVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IG51bGxcbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICAvKlxuICAgKiBsaWZlY3ljbGUvZXZlbnRzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAvLyBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzIGFuZCByZWFjdCB3YXJuaW5nc1xuICAgIHRoaXMuZW1pdHRlcnMuZm9yRWFjaCgodHVwbGUpID0+IHtcbiAgICAgIHR1cGxlWzBdLnJlbW92ZUxpc3RlbmVyKHR1cGxlWzFdLCB0dXBsZVsyXSlcbiAgICB9KVxuICAgIHRoaXMuc3RhdGUuZGlkTW91bnQgPSBmYWxzZVxuXG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnYmVnaW4nKTtcbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnZW5kJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWRNb3VudDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCB9KVxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1RJTUUpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5wcm9wcy53ZWJzb2NrZXQsICdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZm9sZGVyICE9PSB0aGlzLnByb3BzLmZvbGRlcikgcmV0dXJuIHZvaWQgKDApXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzogcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gYWN0aW9uIHJlY2VpdmVkJywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCB1cGRhdGVkJywgbWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKVxuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBjbGVhciBjYWNoZXMgdGhlbiB0aGUgdGltZWxpbmUgZmllbGRzIG1pZ2h0IG5vdCB1cGRhdGUgcmlnaHQgYWZ0ZXIga2V5ZnJhbWUgZGVsZXRpb25zXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcblxuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG5cbiAgICAgIGlmIChtYXliZU1ldGFkYXRhICYmIG1heWJlTWV0YWRhdGEuZnJvbSAhPT0gJ3RpbWVsaW5lJykge1xuICAgICAgICBpZiAobWF5YmVDb21wb25lbnRJZHMgJiYgbWF5YmVUaW1lbGluZU5hbWUgJiYgbWF5YmVQcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgbWF5YmVDb21wb25lbnRJZHMuZm9yRWFjaCgoY29tcG9uZW50SWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZShjb21wb25lbnRJZCwgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lIHx8IDAsIG1heWJlUHJvcGVydHlOYW1lcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uU2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCB1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblVuc2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IG1vdW50ZWQnLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnJlaHlkcmF0ZUJ5dGVjb2RlKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKVxuICAgICAgLy8gdGhpcy51cGRhdGVUaW1lKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lKVxuICAgIH0pXG5cbiAgICAvLyBjb21wb25lbnQ6bW91bnRlZCBmaXJlcyB3aGVuIHRoaXMgZmluaXNoZXMgd2l0aG91dCBlcnJvclxuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGllbnQubmV4dCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBsZXQgZWRpdGFibGUgPSBwYXN0ZUV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIC8vIE91ciBpbnB1dCBmaWVsZHMgYXJlIDxzcGFuPnNcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScgfHwgZWRpdGFibGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIHZpYSBkZWZhdWx0JylcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBhIHByb3BlcnR5IGlucHV0LCBzbyBsZXQgdGhlIGRlZmF1bHQgYWN0aW9uIGhhcHBlblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY2hlY2sgbGVzcyBicml0dGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgZGVsZWdhdGVkIHRvIHBsdW1iaW5nJylcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY3JlYXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zLyogdmFsdWUsIGN1cnZlLCBlbmRtcywgZW5kdmFsdWUgKi8pXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdzcGxpdFNlZ21lbnQnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2pvaW5LZXlmcmFtZXMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdkZWxldGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUoe2NvbXBvbmVudElkOiB7Y29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSwgbXM6IHN0YXJ0TXN9fSwgdGltZWxpbmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY2hhbmdlU2VnbWVudEN1cnZlJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6dGljaycsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgd2UgZ290IGEgdGljaywgd2hpY2ggb2NjdXJzIGR1cmluZyBUaW1lbGluZSBtb2RlbCB1cGRhdGluZywgdGhlbiB3ZSB3YW50IHRvIHBhdXNlIGl0IGlmIHRoZSBzY3J1YmJlclxuICAgICAgLy8gaGFzIGFycml2ZWQgYXQgdGhlIG1heGltdW0gYWNjZXB0aWJsZSBmcmFtZSBpbiB0aGUgdGltZWxpbmUuXG4gICAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUGxheWVyUGxheWluZzogZmFsc2V9KVxuICAgICAgfVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOmF1dGhvcml0YXRpdmUtZnJhbWUtc2V0JywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAndGltZWxpbmUnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChuYXRpdmVFdmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGN1cnJlbnRseSBhY3RpdmUgZXhwcmVzc2lvbiBpbnB1dCBhIGNoYW5jZSB0byBjYXB0dXJlIHRoaXMgZXZlbnQgYW5kIHNob3J0IGNpcmN1aXQgdXMgaWYgc29cbiAgICBpZiAodGhpcy5yZWZzLmV4cHJlc3Npb25JbnB1dC53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQobmF0aXZlRXZlbnQpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoaXQgdGhlIHNwYWNlYmFyIF9hbmRfIHdlIGFyZW4ndCBpbnNpZGUgYW4gaW5wdXQgZmllbGQsIHRyZWF0IHRoYXQgbGlrZSBhIHBsYXliYWNrIHRyaWdnZXJcbiAgICBpZiAobmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gMzIgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0OmZvY3VzJykpIHtcbiAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzU2hpZnRLZXlEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXSwgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKDApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oLTEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoLTEpXG4gICAgICAgIH1cblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cpIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogdHJ1ZSB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKDEpXG4gICAgICAgIH1cblxuICAgICAgLy8gY2FzZSAzODogLy8gdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDg6IC8vIGRlbGV0ZVxuICAgICAgICBpZiAoIWxvZGFzaC5pc0VtcHR5KHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXMpKSB7XG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKG5hdGl2ZUV2ZW50KSB7XG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIC8vIGNhc2UgMzc6IC8vbGVmdFxuICAgICAgLy8gY2FzZSAzOTogLy9yaWdodFxuICAgICAgLy8gY2FzZSAzODogLy91cFxuICAgICAgLy8gY2FzZSA0MDogLy9kb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVLZXlib2FyZFN0YXRlICh1cGRhdGVzKSB7XG4gICAgLy8gSWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGRvbid0IGFsbG93IGtleWJvYXJkIHN0YXRlIGNoYW5nZXMgdG8gY2F1c2UgYSByZS1yZW5kZXIsIG90aGVyd2lzZVxuICAgIC8vIHRoZSBpbnB1dCBmaWVsZCB3aWxsIHN3aXRjaCBiYWNrIHRvIGl0cyBwcmV2aW91cyBjb250ZW50cyAoZS5nLiB3aGVuIGhvbGRpbmcgZG93biAnc2hpZnQnKVxuICAgIGlmICghdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHVwZGF0ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICAgIHRoaXMuc3RhdGVba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVtaXR0ZXJMaXN0ZW5lciAoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChbZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcl0pXG4gICAgZXZlbnRFbWl0dGVyLm9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxuICB9XG5cbiAgLypcbiAgICogc2V0dGVycy91cGRhdGVyc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBkZXNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IHRydWVcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAwXG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9Ob2RlIChub2RlKSB7XG4gICAgdmFyIHJvd3NEYXRhID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIHZhciBmb3VuZEluZGV4ID0gbnVsbFxuICAgIHZhciBpbmRleENvdW50ZXIgPSAwXG4gICAgcm93c0RhdGEuZm9yRWFjaCgocm93SW5mbywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzSGVhZGluZykge1xuICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgfSBlbHNlIGlmIChyb3dJbmZvLmlzUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXhDb3VudGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmb3VuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gKGZvdW5kSW5kZXggKiB0aGlzLnN0YXRlLnJvd0hlaWdodCkgLSB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREb21Ob2RlT2Zmc2V0WSAoZG9tTm9kZSkge1xuICAgIHZhciBjdXJ0b3AgPSAwXG4gICAgaWYgKGRvbU5vZGUub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIGN1cnRvcCArPSBkb21Ob2RlLm9mZnNldFRvcFxuICAgICAgfSB3aGlsZSAoZG9tTm9kZSA9IGRvbU5vZGUub2Zmc2V0UGFyZW50KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuICAgIHJldHVybiBjdXJ0b3BcbiAgfVxuXG4gIGNvbGxhcHNlTm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICB2aXNpdChub2RlLCAoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgICBjaGlsZC5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBsZXQgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGV4cGFuZE5vZGUgKG5vZGUsIGNvbXBvbmVudElkKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKG5vZGUucGFyZW50KSB0aGlzLmV4cGFuZE5vZGUobm9kZS5wYXJlbnQpIC8vIElmIHdlIGFyZSBleHBhbmRlZCwgb3VyIHBhcmVudCBoYXMgdG8gYmUgdG9vXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpc1Jvd0FjdGl2YXRlZCAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV1cbiAgICB9XG4gIH1cblxuICBpc0NsdXN0ZXJBY3RpdmF0ZWQgKGl0ZW0pIHtcbiAgICByZXR1cm4gZmFsc2UgLy8gVE9ET1xuICB9XG5cbiAgdG9nZ2xlVGltZURpc3BsYXlNb2RlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdzZWNvbmRzJ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVCYXNlbGluZSA9IHRoaXMuc3RhdGUuZnJhbWVCYXNlbGluZVxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICB2YXIgY3VycmVudEZyYW1lID0gZnJhbWVCYXNlbGluZSArIGZyYW1lRGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlCKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLmR1cmF0aW9uRHJhZ1N0YXJ0XG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIGlmIChkcmFnRGVsdGEgPiAwICYmIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltID49IDApIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkge1xuICAgICAgICB2YXIgYWRkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyAyMH0pXG4gICAgICAgIH0sIDMwMClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkSW50ZXJ2YWw6IGFkZEludGVydmFsfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdJc0FkZGluZzogdHJ1ZX0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAvLyBEb24ndCBsZXQgdXNlciBkcmFnIGJhY2sgcGFzdCBsYXN0IGZyYW1lOyBhbmQgZG9uJ3QgbGV0IHRoZW0gZHJhZyBtb3JlIHRoYW4gYW4gZW50aXJlIHdpZHRoIG9mIGZyYW1lc1xuICAgIGlmIChmcmFtZUluZm8uZnJpQiArIGZyYW1lRGVsdGEgPD0gZnJhbWVJbmZvLmZyaU1heCB8fCAtZnJhbWVEZWx0YSA+PSBmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICBmcmFtZURlbHRhID0gdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gLy8gVG9kbzogbWFrZSBtb3JlIHByZWNpc2Ugc28gaXQgcmVtb3ZlcyBhcyBtYW55IGZyYW1lcyBhc1xuICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGNhbiBpbnN0ZWFkIG9mIGNvbXBsZXRlbHkgaWdub3JpbmcgdGhlIGRyYWdcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uVHJpbTogZnJhbWVEZWx0YSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGwgfSlcbiAgfVxuXG4gIGNoYW5nZVZpc2libGVGcmFtZVJhbmdlICh4bCwgeHIsIGZyYW1lSW5mbykge1xuICAgIGxldCBhYnNMID0gbnVsbFxuICAgIGxldCBhYnNSID0gbnVsbFxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNMID0geGxcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgYWJzUiA9IHhyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydCkge1xuICAgICAgY29uc3Qgb2Zmc2V0TCA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhclN0YXJ0ICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IG9mZnNldFIgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJFbmQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3QgZGlmZlggPSB4bCAtIHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0XG4gICAgICBhYnNMID0gb2Zmc2V0TCArIGRpZmZYXG4gICAgICBhYnNSID0gb2Zmc2V0UiArIGRpZmZYXG4gICAgfVxuXG4gICAgbGV0IGZMID0gKGFic0wgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzTCAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICBsZXQgZlIgPSAoYWJzUiAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNSICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIGxlZnQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmTCA8PSBmcmFtZUluZm8uZnJpMCkge1xuICAgICAgZkwgPSBmcmFtZUluZm8uZnJpMFxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAtICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC0gZkwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIHJpZ2h0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZlIgPj0gZnJhbWVJbmZvLmZyaU1heDIpIHtcbiAgICAgIGZMID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtmTCwgZlJdIH0pXG4gIH1cblxuICB1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSAoZGVsdGEpIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gKyBkZWx0YVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSArIGRlbHRhXG4gICAgaWYgKGwgPj0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbCwgcl0gfSlcbiAgICB9XG4gIH1cblxuICAvLyB3aWxsIGxlZnQtYWxpZ24gdGhlIGN1cnJlbnQgdGltZWxpbmUgd2luZG93IChtYWludGFpbmluZyB6b29tKVxuICB0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UgKGZyYW1lSW5mbykge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuICAgIHZhciBzcGFuID0gciAtIGxcbiAgICB2YXIgbmV3TCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lXG4gICAgdmFyIG5ld1IgPSBuZXdMICsgc3BhblxuXG4gICAgaWYgKG5ld1IgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICBuZXdMIC09IChuZXdSIC0gZnJhbWVJbmZvLmZyaU1heClcbiAgICAgIG5ld1IgPSBmcmFtZUluZm8uZnJpTWF4XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbmV3TCwgbmV3Ul0gfSlcbiAgfVxuXG4gIHVwZGF0ZVNjcnViYmVyUG9zaXRpb24gKGRlbHRhKSB7XG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICsgZGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDw9IDApIGN1cnJlbnRGcmFtZSA9IDBcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlKSB7XG4gICAgLy8gTm90ZSB0aGF0IGlmIHN0YXJ0VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBleGFtaW5lZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBwcmVzZW50IG9uZVxuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ2hvc3RJbnN0YW5jZScpLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm8gbmVlZCB0byAnZXhwcmVzc2lvblRvUk8nIGhlcmUgYmVjYXVzZSBpZiB3ZSBnb3QgYW4gZXhwcmVzc2lvbiwgdGhhdCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwcm92aWRlZCBpbiBpdHMgc2VyaWFsaXplZCBfX2Z1bmN0aW9uIGZvcm1cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZV0sICgpID0+IHt9KVxuXG4gICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5zcGxpdFNlZ21lbnQodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NwbGl0U2VnbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdqb2luS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIChrZXlmcmFtZXMsIHRpbWVsaW5lTmFtZSkge1xuICAgIGxvZGFzaC5lYWNoKGtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgay5jb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBrLnByb3BlcnR5TmFtZSwgay5tcylcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9KVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2suY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGsucHJvcGVydHlOYW1lLCBrLm1zXSwgKCkgPT4ge30pXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3RlZEtleWZyYW1lczoge319KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgLypcbiAgICBXZSdyZSBnb2luZyB0byB1c2UgdGhlIGNhbGwgZnJvbSB3aGF0J3MgYmVpbmcgZHJhZ2dlZCwgYmVjYXVzZSB0aGF0J3Mgc29tZXRpbWVzIGEgdHJhbnNpdGlvbiBib2R5XG4gICAgcmF0aGVyIHRoYW4gYSBzaW1wbGUga2V5ZnJhbWUuXG5cbiAgICBGcm9tIHRoZXJlIHdlJ3JlIGdvaW5nIHRvIGxlYXJuIGhvdyBmYXIgdG8gbW92ZSBhbGwgb3RoZXIga2V5ZnJhbWVzIGluIHNlbGVjdGVkS2V5ZnJhbWVzOiB7fVxuXG4gICAgQ29uY2VybnM6XG4gICAgICBXaGVuIHdlIG5lZWQgdG8gc3RvcCBvbmUga2V5ZnJhbWUgYmVjYXVzZSBpdCBjYW4ndCBnbyBhbnkgZnVydGhlciwgd2UgbmVlZCB0byBzdG9wIHRoZSBlbnRpcmUgZ3JvdXAgZHJhZy5cblxuICAgIE5vdGVzOlxuICAgICAgV2hlbiBhIHVzZXIgZHJhZ3MgYSBzZWdtZW50IGJvZHkgaXQgaGFzIHRoZSBcImJvZHlcIiBoYW5kbGUuIEl0XG4gICAgKi9cbiAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGNoYW5nZU1zID0gZW5kTXMgLSBzdGFydE1zXG5cbiAgICBsb2Rhc2guZWFjaChzZWxlY3RlZEtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIGNvbnN0IGFkanVzdGVkTXMgPSBwYXJzZUludChrLm1zKSArIGNoYW5nZU1zXG4gICAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyhcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIGsuY29tcG9uZW50SWQsXG4gICAgICAgIHRpbWVsaW5lTmFtZSxcbiAgICAgICAgay5wcm9wZXJ0eU5hbWUsXG4gICAgICAgIGsuaGFuZGxlLCAvLyB0b2RvOiB0YWtlIGEgc2Vjb25kIGxvb2sgYXQgdGhpcyBvbmVcbiAgICAgICAgay5pbmRleCxcbiAgICAgICAgay5tcyxcbiAgICAgICAgYWRqdXN0ZWRNcyxcbiAgICAgICAgZnJhbWVJbmZvXG4gICAgICApXG4gICAgICAvLyBVcGRhdGUgb3VyIHNlbGVjdGVkIGtleWZyYW1lcyBzdGFydCB0aW1lIG5vdyB0aGF0IHdlJ3ZlIG1vdmVkIHRoZW1cbiAgICAgIC8vIE5vdGU6IFRoaXMgc2VlbXMgbGlrZSB0aGVyZSdzIHByb2JhYmx5IGEgbW9yZSBjbGV2ZXIgd2F5IHRvIG1ha2Ugc3VyZSB0aGlzIGdldHNcbiAgICAgIC8vIHVwZGF0ZWQgdmlhIHRoZSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHMgcGVyaGFwcy5cbiAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2suY29tcG9uZW50SWQgKyAnLScgKyBrLnByb3BlcnR5TmFtZSArICctJyArIGsuaW5kZXhdLm1zID0gT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3Zlcylbay5pbmRleF1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzfSlcblxuICAgICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIC8vIFRPRE8gaG93IHdpbGwgdGhpcyBiaXRlIHVzP1xuICAgICAgbGV0IGlzQ29tcG9uZW50ID0gKHR5cGVvZiBub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JylcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IGlzQ29tcG9uZW50ID8gbm9kZS5hdHRyaWJ1dGVzLnNvdXJjZSA6IG5vZGUuZWxlbWVudE5hbWVcblxuICAgICAgaWYgKCFwYXJlbnQgfHwgKHBhcmVudC5fX2lzRXhwYW5kZWQgJiYgKEFMTE9XRURfVEFHTkFNRVNbZWxlbWVudE5hbWVdIHx8IGlzQ29tcG9uZW50KSkpIHsgLy8gT25seSB0aGUgdG9wLWxldmVsIGFuZCBhbnkgZXhwYW5kZWQgc3ViY29tcG9uZW50c1xuICAgICAgICBjb25zdCBhc2NpaUJyYW5jaCA9IGFzY2lpU3ltYm9sc1t2aXNpdG9ySXRlcmF0aW9uc10gLy8gV2FybmluZzogVGhlIGNvbXBvbmVudCBzdHJ1Y3R1cmUgbXVzdCBtYXRjaCB0aGF0IGdpdmVuIHRvIGNyZWF0ZSB0aGUgYXNjaWkgdHJlZVxuICAgICAgICBjb25zdCBoZWFkaW5nUm93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2gsIHByb3BlcnR5Um93czogW10sIGlzSGVhZGluZzogdHJ1ZSwgY29tcG9uZW50SWQ6IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXSB9XG4gICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChoZWFkaW5nUm93KVxuXG4gICAgICAgIGlmICghYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSA9IGlzQ29tcG9uZW50ID8gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzKG5vZGUpIDogX2J1aWxkRE9NQWRkcmVzc2FibGVzKGVsZW1lbnROYW1lLCBsb2NhdG9yKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgY29uc3QgY2x1c3RlckhlYWRpbmdzRm91bmQgPSB7fVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlHcm91cERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtpXVxuXG4gICAgICAgICAgbGV0IHByb3BlcnR5Um93XG5cbiAgICAgICAgICAgIC8vIFNvbWUgcHJvcGVydGllcyBnZXQgZ3JvdXBlZCBpbnNpZGUgdGhlaXIgb3duIGFjY29yZGlvbiBzaW5jZSB0aGV5IGhhdmUgbXVsdGlwbGUgc3ViY29tcG9uZW50cywgZS5nLiB0cmFuc2xhdGlvbi54LHkselxuICAgICAgICAgIGlmIChwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyKSB7XG4gICAgICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4XG4gICAgICAgICAgICBsZXQgY2x1c3RlcktleSA9IGAke2NvbXBvbmVudElkfV8ke2NsdXN0ZXJQcmVmaXh9YFxuICAgICAgICAgICAgbGV0IGlzQ2x1c3RlckhlYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjbHVzdGVyIHdpdGggdGhlIGN1cnJlbnQga2V5IGlzIGV4cGFuZGVkIHJlbmRlciBlYWNoIG9mIHRoZSByb3dzIGluZGl2aWR1YWxseVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2NsdXN0ZXJLZXldKSB7XG4gICAgICAgICAgICAgIGlmICghY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0pIHtcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLCBpc0NsdXN0ZXJIZWFkaW5nLCBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsIGlzUHJvcGVydHk6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBjbHVzdGVyLCBzaGlmdGluZyB0aGUgaW5kZXggZm9yd2FyZCBzbyB3ZSBkb24ndCByZS1yZW5kZXIgdGhlIGluZGl2aWR1YWxzIG9uIHRoZSBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgbG9vcFxuICAgICAgICAgICAgICBsZXQgY2x1c3RlclNldCA9IFtwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcl1cbiAgICAgICAgICAgICAgICAvLyBMb29rIGFoZWFkIGJ5IGEgZmV3IHN0ZXBzIGluIHRoZSBhcnJheSBhbmQgc2VlIGlmIHRoZSBuZXh0IGVsZW1lbnQgaXMgYSBtZW1iZXIgb2YgdGhlIGN1cnJlbnQgY2x1c3RlclxuICAgICAgICAgICAgICBsZXQgayA9IGkgLy8gVGVtcG9yYXJ5IHNvIHdlIGNhbiBpbmNyZW1lbnQgYGlgIGluIHBsYWNlXG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IGogKyBrXG4gICAgICAgICAgICAgICAgbGV0IG5leHREZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1bbmV4dEluZGV4XVxuICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIG5leHQgdGhpbmcgaW4gdGhlIGxpc3Qgc2hhcmVzIHRoZSBzYW1lIGNsdXN0ZXIgbmFtZSwgbWFrZSBpdCBwYXJ0IG9mIHRoaXMgY2x1c3Rlc3JcbiAgICAgICAgICAgICAgICBpZiAobmV4dERlc2NyaXB0b3IgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3RlciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeCA9PT0gY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgY2x1c3RlclNldC5wdXNoKG5leHREZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBhbHJlYWR5IGdvIHRvIHRoZSBuZXh0IG9uZSwgYnVtcCB0aGUgaXRlcmF0aW9uIGluZGV4IHNvIHdlIHNraXAgaXQgb24gdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgY2x1c3RlcjogY2x1c3RlclNldCwgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSwgaXNDbHVzdGVyOiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVhZGluZ1Jvdy5wcm9wZXJ0eVJvd3MucHVzaChwcm9wZXJ0eVJvdylcblxuICAgICAgICAgICAgLy8gUHVzaGluZyBhbiBlbGVtZW50IGludG8gYSBjb21wb25lbnQgcm93IHdpbGwgcmVzdWx0IGluIGl0IHJlbmRlcmluZywgc28gb25seSBwdXNoXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVydHkgcm93cyBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRleFxuICAgICAgICAgIGlmIChub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKHByb3BlcnR5Um93KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXRvckl0ZXJhdGlvbnMrK1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzLmZvckVhY2goKGl0ZW0sIGluZGV4LCBpdGVtcykgPT4ge1xuICAgICAgaXRlbS5faW5kZXggPSBpbmRleFxuICAgICAgaXRlbS5faXRlbXMgPSBpdGVtc1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzID0gY29tcG9uZW50Um93cy5maWx0ZXIoKHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yIH0pID0+IHtcbiAgICAgICAgLy8gTG9jYXRvcnMgPiAwLjAgYXJlIGJlbG93IHRoZSBsZXZlbCB3ZSB3YW50IHRvIGRpc3BsYXkgKHdlIG9ubHkgd2FudCB0aGUgdG9wIGFuZCBpdHMgY2hpbGRyZW4pXG4gICAgICBpZiAobG9jYXRvci5zcGxpdCgnLicpLmxlbmd0aCA+IDIpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuICFwYXJlbnQgfHwgcGFyZW50Ll9faXNFeHBhbmRlZFxuICAgIH0pXG5cbiAgICByZXR1cm4gY29tcG9uZW50Um93c1xuICB9XG5cbiAgbWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBsZXQgdmFsdWVHcm91cCA9IFRpbWVsaW5lUHJvcGVydHkuZ2V0VmFsdWVHcm91cChjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSlcbiAgICBpZiAoIXZhbHVlR3JvdXApIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgbGV0IGtleWZyYW1lc0xpc3QgPSBPYmplY3Qua2V5cyh2YWx1ZUdyb3VwKS5tYXAoKGtleWZyYW1lS2V5KSA9PiBwYXJzZUludChrZXlmcmFtZUtleSwgMTApKS5zb3J0KChhLCBiKSA9PiBhIC0gYilcbiAgICBpZiAoa2V5ZnJhbWVzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5ZnJhbWVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zY3VyciA9IGtleWZyYW1lc0xpc3RbaV1cbiAgICAgIGlmIChpc05hTihtc2N1cnIpKSBjb250aW51ZVxuICAgICAgbGV0IG1zcHJldiA9IGtleWZyYW1lc0xpc3RbaSAtIDFdXG4gICAgICBsZXQgbXNuZXh0ID0ga2V5ZnJhbWVzTGlzdFtpICsgMV1cblxuICAgICAgaWYgKG1zY3VyciA+IGZyYW1lSW5mby5tc0IpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGFmdGVyIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0XG4gICAgICBpZiAobXNjdXJyIDwgZnJhbWVJbmZvLm1zQSAmJiBtc25leHQgIT09IHVuZGVmaW5lZCAmJiBtc25leHQgPCBmcmFtZUluZm8ubXNBKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBlbnRpcmVseSBiZWZvcmUgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXQgKHBhcnRpYWwgc2VnbWVudHMgYXJlIG9rKVxuXG4gICAgICBsZXQgcHJldlxuICAgICAgbGV0IGN1cnJcbiAgICAgIGxldCBuZXh0XG5cbiAgICAgIGlmIChtc3ByZXYgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNwcmV2KSkge1xuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIG1zOiBtc3ByZXYsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpIC0gMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc3ByZXYsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc3ByZXZdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zcHJldl0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdXJyID0ge1xuICAgICAgICBtczogbXNjdXJyLFxuICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc2N1cnIsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNjdXJyXS52YWx1ZSxcbiAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNjdXJyXS5jdXJ2ZVxuICAgICAgfVxuXG4gICAgICBpZiAobXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zbmV4dCkpIHtcbiAgICAgICAgbmV4dCA9IHtcbiAgICAgICAgICBtczogbXNuZXh0LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSArIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNuZXh0LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNuZXh0XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc25leHRdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHB4T2Zmc2V0TGVmdCA9IChjdXJyLmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGxldCBweE9mZnNldFJpZ2h0XG4gICAgICBpZiAobmV4dCkgcHhPZmZzZXRSaWdodCA9IChuZXh0LmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcblxuICAgICAgbGV0IHNlZ21lbnRPdXRwdXQgPSBpdGVyYXRlZShwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGkpXG4gICAgICBpZiAoc2VnbWVudE91dHB1dCkgc2VnbWVudE91dHB1dHMucHVzaChzZWdtZW50T3V0cHV0KVxuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgbWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eVJvd3MsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgcHJvcGVydHlSb3dzLmZvckVhY2goKHByb3BlcnR5Um93KSA9PiB7XG4gICAgICBpZiAocHJvcGVydHlSb3cuaXNDbHVzdGVyKSB7XG4gICAgICAgIHByb3BlcnR5Um93LmNsdXN0ZXIuZm9yRWFjaCgocHJvcGVydHlEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5RGVzY3JpcHRvci5uYW1lXG4gICAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlSb3cucHJvcGVydHkubmFtZVxuICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICByZW1vdmVUaW1lbGluZVNoYWRvdyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICB9XG5cbiAgLypcbiAgICogcmVuZGVyIG1ldGhvZHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHRvcDogMTdcbiAgICAgICAgfX0+XG4gICAgICAgIDxDb250cm9sc0FyZWFcbiAgICAgICAgICByZW1vdmVUaW1lbGluZVNoYWRvdz17dGhpcy5yZW1vdmVUaW1lbGluZVNoYWRvdy5iaW5kKHRoaXMpfVxuICAgICAgICAgIGFjdGl2ZUNvbXBvbmVudERpc3BsYXlOYW1lPXt0aGlzLnByb3BzLnVzZXJjb25maWcubmFtZX1cbiAgICAgICAgICB0aW1lbGluZU5hbWVzPXtPYmplY3Qua2V5cygodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpID8gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGltZWxpbmVzIDoge30pfVxuICAgICAgICAgIHNlbGVjdGVkVGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgY3VycmVudEZyYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1cbiAgICAgICAgICBpc1BsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgIHBsYXliYWNrU3BlZWQ9e3RoaXMuc3RhdGUucGxheWVyUGxheWJhY2tTcGVlZH1cbiAgICAgICAgICBsYXN0RnJhbWU9e3RoaXMuZ2V0RnJhbWVJbmZvKCkuZnJpTWF4fVxuICAgICAgICAgIGNoYW5nZVRpbWVsaW5lTmFtZT17KG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY3JlYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZHVwbGljYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZGVsZXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgc2VsZWN0VGltZWxpbmU9eyhjdXJyZW50VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIG1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIGluLW1lbW9yeSBjb21wb25lbnQgb3IgcHJvcGVydHkgYXNzaWdubWVudCBtaWdodCBub3Qgd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRUaW1lbGluZU5hbWUoY3VycmVudFRpbWVsaW5lTmFtZSwgeyBmcm9tOiAndGltZWxpbmUnIH0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZXRUaW1lbGluZU5hbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGN1cnJlbnRUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50VGltZWxpbmVOYW1lIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBCYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvKiB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8uZnJpMCAtIGZyYW1lSW5mby5mcmlBKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVUaW1lKGZyYW1lSW5mby5mcmkwKSAqL1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaTApXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpMCB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwRm9yd2FyZD17KCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmlNYXggfSlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrUGxheVBhdXNlPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNoYW5nZVBsYXliYWNrU3BlZWQ9eyhpbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUGxheWJhY2tTcGVlZCA9IE51bWJlcihpbnB1dEV2ZW50LnRhcmdldC52YWx1ZSB8fCAxKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBsYXllclBsYXliYWNrU3BlZWQgfSlcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0SXRlbVZhbHVlRGVzY3JpcHRvciAoaW5wdXRJdGVtKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihpbnB1dEl0ZW0ubm9kZSwgZnJhbWVJbmZvLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGUsIHRoaXMuX2NvbXBvbmVudCwgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyksIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgaW5wdXRJdGVtLnByb3BlcnR5KVxuICB9XG5cbiAgZ2V0Q3VycmVudFRpbWVsaW5lVGltZSAoZnJhbWVJbmZvKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgfVxuXG4gIHJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoaXRlbSkge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgbGV0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcblxuICAgIC8vIFRPRE86IE9wdGltaXplIHRoaXM/IFdlIGRvbid0IG5lZWQgdG8gcmVuZGVyIGV2ZXJ5IHNlZ21lbnQgc2luY2Ugc29tZSBvZiB0aGVtIG92ZXJsYXAuXG4gICAgLy8gTWF5YmUga2VlcCBhIGxpc3Qgb2Yga2V5ZnJhbWUgJ3BvbGVzJyByZW5kZXJlZCwgYW5kIG9ubHkgcmVuZGVyIG9uY2UgaW4gdGhhdCBzcG90P1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgaGVpZ2h0OiAyNSwgd2lkdGg6ICcxMDAlJywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgaXRlbS5wcm9wZXJ0eVJvd3MsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIGluZGV4LCBoYW5kbGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2FudCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBzZWxlY3RlZEtleWZyYW1lcyA9IHt9XG5cbiAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdID0ge1xuICAgICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGUsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBjdXJyLm1zXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gY3Vyci5mcmFtZVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbnVsbCxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG51bGwsXG4gICAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgekluZGV4OiAxMDAzLFxuICAgICAgICAgICAgY3Vyc29yOiAnY29sLXJlc2l6ZSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNvbG9LZXlmcmFtZSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgbGV0IGlzQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdICE9IHVuZGVmaW5lZCkgaXNBY3RpdmUgPSB0cnVlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gfVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgIHRvcDogLTMsXG4gICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgOiAoaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICB9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvc3Bhbj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUcmFuc2l0aW9uQm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuICAgIGNvbnN0IGN1cnZlID0gY3Vyci5jdXJ2ZS5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGN1cnIuY3VydmUuc2xpY2UoMSlcbiAgICBjb25zdCBicmVha2luZ0JvdW5kcyA9IGN1cnZlLmluY2x1ZGVzKCdCYWNrJykgfHwgY3VydmUuaW5jbHVkZXMoJ0JvdW5jZScpIHx8IGN1cnZlLmluY2x1ZGVzKCdFbGFzdGljJylcbiAgICBjb25zdCBDdXJ2ZVNWRyA9IENVUlZFU1ZHU1tjdXJ2ZSArICdTVkcnXVxuICAgIGxldCBmaXJzdEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBsZXQgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gIT0gdW5kZWZpbmVkKSBmaXJzdEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gIT0gdW5kZWZpbmVkKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBzZWxlY3RlZEtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdtaWRkbGUnXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpLFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBpbmRleDogbmV4dC5pbmRleCxcbiAgICAgICAgICAgIG1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgaGFuZGxlOiAnbWlkZGxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbnRhaW5lcidcbiAgICAgICAgICBrZXk9e3VuaXF1ZUtleX1cbiAgICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtdHJhbnNpdGlvbicsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIGN1cnZlOiBjdXJyLmN1cnZlLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSBQYWxldHRlLkdSQVlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7b3B0aW9ucy5jb2xsYXBzZWQgJiZcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb2xsYXBzZWQtYmFja2Ryb3AnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkdSQVlcbiAgICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDEsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MylcbiAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45NjUpXG4gICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDIsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgb3ZlcmZsb3c6IGJyZWFraW5nQm91bmRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJ2ZVNWR1xuICAgICAgICAgICAgICBpZD17dW5pcXVlS2V5fVxuICAgICAgICAgICAgICBsZWZ0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgICByaWdodEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbnN0YW50Qm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgLy8gY29uc3QgYWN0aXZlSW5mbyA9IHNldEFjdGl2ZUNvbnRlbnRzKHByb3BlcnR5TmFtZSwgY3VyciwgbmV4dCwgZmFsc2UsIHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgfX1cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb25zdGFudC1ib2R5J1xuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS1zZWdtZW50JyxcbiAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA5MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fX0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93cyh0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIHt0aGlzLnJlbmRlckJvdHRvbUNvbnRyb2xzKCl9XG4gICAgICAgIDxFeHByZXNzaW9uSW5wdXRcbiAgICAgICAgICByZWY9J2V4cHJlc3Npb25JbnB1dCdcbiAgICAgICAgICByZWFjdFBhcmVudD17dGhpc31cbiAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgaW5wdXRGb2N1c2VkPXt0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZH1cbiAgICAgICAgICBvbkNvbW1pdFZhbHVlPXsoY29tbWl0dGVkVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBpbnB1dCBjb21taXQ6JywgSlNPTi5zdHJpbmdpZnkoY29tbWl0dGVkVmFsdWUpKVxuXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKFxuICAgICAgICAgICAgICBnZXRJdGVtQ29tcG9uZW50SWQodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkLm5vZGUuZWxlbWVudE5hbWUsXG4gICAgICAgICAgICAgIGdldEl0ZW1Qcm9wZXJ0eU5hbWUodGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpLFxuICAgICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUodGhpcy5nZXRGcmFtZUluZm8oKSksXG4gICAgICAgICAgICAgIGNvbW1pdHRlZFZhbHVlLFxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gY3VydmVcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGVuZE1zXG4gICAgICAgICAgICAgIHZvaWQgKDApIC8vIGVuZFZhbHVlXG4gICAgICAgICAgICApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkZvY3VzUmVxdWVzdGVkPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk5hdmlnYXRlUmVxdWVzdGVkPXsobmF2RGlyLCBkb0ZvY3VzKSA9PiB7XG4gICAgICAgICAgICBsZXQgaXRlbSA9IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgbGV0IG5leHQgPSBuZXh0UHJvcEl0ZW0oaXRlbSwgbmF2RGlyKVxuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiAoZG9Gb2N1cykgPyBuZXh0IDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBuZXh0XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMgKG5vZGUpIHtcbiAgdmFyIGFkZHJlc3NhYmxlcyA9IF9idWlsZERPTUFkZHJlc3NhYmxlcygnZGl2JykgLy8gc3RhcnQgd2l0aCBkb20gcHJvcGVydGllcz9cbiAgZm9yIChsZXQgbmFtZSBpbiBub2RlLmVsZW1lbnROYW1lLnN0YXRlcykge1xuICAgIGxldCBzdGF0ZSA9IG5vZGUuZWxlbWVudE5hbWUuc3RhdGVzW25hbWVdXG5cbiAgICBhZGRyZXNzYWJsZXMucHVzaCh7XG4gICAgICBuYW1lOiBuYW1lLFxuICAgICAgcHJlZml4OiBuYW1lLFxuICAgICAgc3VmZml4OiB1bmRlZmluZWQsXG4gICAgICBmYWxsYmFjazogc3RhdGUudmFsdWUsXG4gICAgICB0eXBlZGVmOiBzdGF0ZS50eXBlXG4gICAgfSlcbiAgfVxuICByZXR1cm4gYWRkcmVzc2FibGVzXG59XG5cbmZ1bmN0aW9uIF9idWlsZERPTUFkZHJlc3NhYmxlcyAoZWxlbWVudE5hbWUsIGxvY2F0b3IpIHtcbiAgdmFyIGFkZHJlc3NhYmxlcyA9IFtdXG5cbiAgY29uc3QgZG9tU2NoZW1hID0gRE9NU2NoZW1hW2VsZW1lbnROYW1lXVxuICBjb25zdCBkb21GYWxsYmFja3MgPSBET01GYWxsYmFja3NbZWxlbWVudE5hbWVdXG5cbiAgaWYgKGRvbVNjaGVtYSkge1xuICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBkb21TY2hlbWEpIHtcbiAgICAgIGxldCBwcm9wZXJ0eUdyb3VwID0gbnVsbFxuXG4gICAgICBpZiAobG9jYXRvciA9PT0gJzAnKSB7IC8vIFRoaXMgaW5kaWNhdGVzIHRoZSB0b3AgbGV2ZWwgZWxlbWVudCAodGhlIGFydGJvYXJkKVxuICAgICAgICBpZiAoQUxMT1dFRF9QUk9QU19UT1BfTEVWRUxbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAgIGxldCBuYW1lUGFydHMgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJy4nKVxuXG4gICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ3N0eWxlLm92ZXJmbG93WCcpIG5hbWVQYXJ0cyA9IFsnb3ZlcmZsb3cnLCAneCddXG4gICAgICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ3N0eWxlLm92ZXJmbG93WScpIG5hbWVQYXJ0cyA9IFsnb3ZlcmZsb3cnLCAneSddXG5cbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgcHJlZml4OiBuYW1lUGFydHNbMF0sXG4gICAgICAgICAgICBzdWZmaXg6IG5hbWVQYXJ0c1sxXSxcbiAgICAgICAgICAgIGZhbGxiYWNrOiBkb21GYWxsYmFja3NbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHR5cGVkZWY6IGRvbVNjaGVtYVtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoQUxMT1dFRF9QUk9QU1twcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgbGV0IG5hbWVQYXJ0cyA9IHByb3BlcnR5TmFtZS5zcGxpdCgnLicpXG4gICAgICAgICAgcHJvcGVydHlHcm91cCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHByZWZpeDogbmFtZVBhcnRzWzBdLFxuICAgICAgICAgICAgc3VmZml4OiBuYW1lUGFydHNbMV0sXG4gICAgICAgICAgICBmYWxsYmFjazogZG9tRmFsbGJhY2tzW3Byb3BlcnR5TmFtZV0sXG4gICAgICAgICAgICB0eXBlZGVmOiBkb21TY2hlbWFbcHJvcGVydHlOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcGVydHlHcm91cCkge1xuICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IENMVVNURVJFRF9QUk9QU1twcm9wZXJ0eUdyb3VwLm5hbWVdXG4gICAgICAgIGlmIChjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgcHJvcGVydHlHcm91cC5jbHVzdGVyID0ge1xuICAgICAgICAgICAgcHJlZml4OiBjbHVzdGVyUHJlZml4LFxuICAgICAgICAgICAgbmFtZTogQ0xVU1RFUl9OQU1FU1tjbHVzdGVyUHJlZml4XVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFkZHJlc3NhYmxlcy5wdXNoKHByb3BlcnR5R3JvdXApXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGFkZHJlc3NhYmxlc1xufVxuXG5leHBvcnQgZGVmYXVsdCBUaW1lbGluZVxuIl19