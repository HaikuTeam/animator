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
  activeKeyframes: {},
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
          if (!_lodash2.default.isEmpty(this.state.activeKeyframes)) {
            this.executeBytecodeActionDeleteKeyframe(this.state.activeKeyframes, this.state.currentTimelineName);
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
      this.setState({ activeKeyframes: {} });
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
       From there we're going to learn how far to move all other keyframes in activeKeyframes: {}
       Concerns:
        When we need to stop one keyframe because it can't go any further, we need to stop the entire group drag.
       Notes:
        When a user drags a segment body it has the "body" handle. It
      */
      var activeKeyframes = this.state.activeKeyframes;
      var frameInfo = this.getFrameInfo();
      var changeMs = endMs - startMs;

      _lodash2.default.each(activeKeyframes, function (k) {
        var adjustedMs = parseInt(k.ms) + changeMs;
        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this6.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.handle, // todo: take a second look at this one
        k.index, k.ms, adjustedMs, frameInfo);
        // Update our selected keyframes start time now that we've moved them
        // Note: This seems like there's probably a more clever way to make sure this gets
        // updated when via the BytecodeActions.moveSegmentEndpoints perhaps.
        activeKeyframes[k.componentId + '-' + k.propertyName + '-' + k.index].ms = Object.keys(keyframeMoves)[k.index];
        _this6.setState({ activeKeyframes: activeKeyframes });

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
            var activeKeyframes = _this17.state.activeKeyframes;
            if (!e.shiftKey) activeKeyframes = {};

            activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              index: curr.index,
              ms: curr.ms,
              handle: handle,
              componentId: componentId,
              propertyName: propertyName
            };
            _this17.setState({ activeKeyframes: activeKeyframes });
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
      if (this.state.activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] != undefined) isActive = true;

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
      if (this.state.activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] != undefined) firstKeyframeActive = true;
      if (this.state.activeKeyframes[componentId + '-' + propertyName + '-' + (curr.index + 1)] != undefined) secondKeyframeActive = true;

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
            var activeKeyframes = _this18.state.activeKeyframes;
            if (!e.shiftKey) activeKeyframes = {};
            activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              index: curr.index,
              ms: curr.ms,
              handle: 'middle'
            };
            activeKeyframes[componentId + '-' + propertyName + '-' + (curr.index + 1)] = {
              id: componentId + '-' + propertyName + '-' + (curr.index + 1),
              componentId: componentId,
              propertyName: propertyName,
              index: next.index,
              ms: next.ms,
              handle: 'middle'
            };
            _this18.setState({ activeKeyframes: activeKeyframes });
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
              _this31.setState({ activeKeyframes: {} });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwibXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUiLCJoYW5kbGUiLCJrZXlmcmFtZUluZGV4IiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMiLCJfdGltZWxpbmVzIiwidXBkYXRlVGltZSIsImZyaU1heCIsImdldEN1cnJlbnRUaW1lbGluZSIsInNlZWtBbmRQYXVzZSIsImZyaUIiLCJmcmlBIiwidHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsImVycm9yIiwibmF0aXZlRXZlbnQiLCJyZWZzIiwiZXhwcmVzc2lvbklucHV0Iiwid2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50Iiwia2V5Q29kZSIsInRvZ2dsZVBsYXliYWNrIiwid2hpY2giLCJ1cGRhdGVTY3J1YmJlclBvc2l0aW9uIiwidXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UiLCJpc0VtcHR5IiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImtleWZyYW1lcyIsImVhY2giLCJrIiwiZGVsZXRlS2V5ZnJhbWUiLCJjaGFuZ2VTZWdtZW50Q3VydmUiLCJvbGRTdGFydE1zIiwib2xkRW5kTXMiLCJuZXdTdGFydE1zIiwibmV3RW5kTXMiLCJjaGFuZ2VTZWdtZW50RW5kcG9pbnRzIiwib2xkVGltZWxpbmVOYW1lIiwibmV3VGltZWxpbmVOYW1lIiwicmVuYW1lVGltZWxpbmUiLCJjcmVhdGVUaW1lbGluZSIsImR1cGxpY2F0ZVRpbWVsaW5lIiwiZGVsZXRlVGltZWxpbmUiLCJjaGFuZ2VNcyIsImFkanVzdGVkTXMiLCJwYXJzZUludCIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIl9rZXlmcmFtZU1vdmVzIiwibW92ZW1lbnRLZXkiLCJqb2luIiwia2V5ZnJhbWVNb3Zlc0ZvcldpcmUiLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiaXNDb21wb25lbnQiLCJzb3VyY2UiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMiLCJfYnVpbGRET01BZGRyZXNzYWJsZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsImZyYW1lIiwidmFsdWUiLCJjdXJ2ZSIsInB4T2Zmc2V0TGVmdCIsInB4T2Zmc2V0UmlnaHQiLCJzZWdtZW50T3V0cHV0IiwicHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlPdXRwdXRzIiwibWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsImNvbmNhdCIsInBvc2l0aW9uIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJ0aW1lbGluZXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSIsInNldFRpbWVsaW5lTmFtZSIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsImN0eE1lbnVFdmVudCIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJEQVJLRVJfR1JBWSIsImFsbEl0ZW1zIiwiaXNBY3RpdmF0ZWQiLCJpc1Jvd0FjdGl2YXRlZCIsInJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciIsIm1hcFZpc2libGVGcmFtZXMiLCJwaXhlbHNQZXJGcmFtZSIsInBvaW50ZXJFdmVudHMiLCJmb250V2VpZ2h0IiwibWFwVmlzaWJsZVRpbWVzIiwibWlsbGlzZWNvbmRzTnVtYmVyIiwidG90YWxNaWxsaXNlY29uZHMiLCJndWlkZUhlaWdodCIsImNsaWVudEhlaWdodCIsImJvcmRlckxlZnQiLCJDT0FMIiwiZnJhQiIsInNoYWZ0SGVpZ2h0IiwiY2hhbmdlU2NydWJiZXJQb3NpdGlvbiIsImJveFNoYWRvdyIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIiwiYm9yZGVyVG9wUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21SaWdodFJhZGl1cyIsIm1vdXNlRXZlbnRzIiwiRkFUSEVSX0NPQUwiLCJ2ZXJ0aWNhbEFsaWduIiwiZm9udFNpemUiLCJib3JkZXJCb3R0b20iLCJmbG9hdCIsIm1pbldpZHRoIiwidGV4dEFsaWduIiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZyIsIlJPQ0tfTVVURUQiLCJmb250U3R5bGUiLCJtYXJnaW5Ub3AiLCJ0b2dnbGVUaW1lRGlzcGxheU1vZGUiLCJtYXJnaW5SaWdodCIsImNsaWNrRXZlbnQiLCJsZWZ0WCIsImZyYW1lWCIsIm5ld0ZyYW1lIiwicmVuZGVyRnJhbWVHcmlkIiwicmVuZGVyR2F1Z2UiLCJyZW5kZXJTY3J1YmJlciIsInJlbmRlckR1cmF0aW9uTW9kaWZpZXIiLCJrbm9iUmFkaXVzIiwiY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UiLCJMSUdIVEVTVF9HUkFZIiwiYm90dG9tIiwicmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciIsInJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyIsIkdSQVlfRklUMSIsIm1hcmdpbkxlZnQiLCJ0YWJsZUxheW91dCIsIkxJR0hUX0dSQVkiLCJvcGFjaXR5IiwicmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyIsInJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsInByb3BlcnR5T25MYXN0Q29tcG9uZW50IiwiaHVtYW5OYW1lIiwidGV4dFRyYW5zZm9ybSIsImxpbmVIZWlnaHQiLCJyZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJyZW5kZXJDbHVzdGVyUm93IiwicmVuZGVyUHJvcGVydHlSb3ciLCJyZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IiwiZ2V0Q29tcG9uZW50Um93c0RhdGEiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJyZW5kZXJUb3BDb250cm9scyIsInJlbmRlckNvbXBvbmVudFJvd3MiLCJyZW5kZXJCb3R0b21Db250cm9scyIsImNvbW1pdHRlZFZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hdkRpciIsImRvRm9jdXMiLCJDb21wb25lbnQiLCJhZGRyZXNzYWJsZXMiLCJzdGF0ZXMiLCJzdWZmaXgiLCJmYWxsYmFjayIsInR5cGVkZWYiLCJkb21TY2hlbWEiLCJkb21GYWxsYmFja3MiLCJwcm9wZXJ0eUdyb3VwIiwibmFtZVBhcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7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OztBQUVELFVBQUkwZSxhQUFKLEVBQW1CO0FBQ2pCLFlBQUk1TSxnQkFBZ0IxVixnQkFBZ0JzaUIsY0FBYzVkLElBQTlCLENBQXBCO0FBQ0EsWUFBSWdSLGFBQUosRUFBbUI7QUFDakI0TSx3QkFBYzdNLE9BQWQsR0FBd0I7QUFDdEJFLG9CQUFRRCxhQURjO0FBRXRCaFIsa0JBQU16RSxjQUFjeVYsYUFBZDtBQUZnQixXQUF4QjtBQUlEOztBQUVEcU0scUJBQWF4ZSxJQUFiLENBQWtCK2UsYUFBbEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsU0FBT1AsWUFBUDtBQUNEOztrQkFFYzFnQixRIiwiZmlsZSI6IlRpbWVsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IENvbG9yIGZyb20gJ2NvbG9yJ1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgYXJjaHkgZnJvbSAnYXJjaHknXG5pbXBvcnQgeyBEcmFnZ2FibGVDb3JlIH0gZnJvbSAncmVhY3QtZHJhZ2dhYmxlJ1xuXG5pbXBvcnQgRE9NU2NoZW1hIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSdcbmltcG9ydCBET01GYWxsYmFja3MgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vZmFsbGJhY2tzJ1xuaW1wb3J0IGV4cHJlc3Npb25Ub1JPIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlZmxlY3Rpb24vZXhwcmVzc2lvblRvUk8nXG5cbmltcG9ydCBUaW1lbGluZVByb3BlcnR5IGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9UaW1lbGluZVByb3BlcnR5J1xuaW1wb3J0IEJ5dGVjb2RlQWN0aW9ucyBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvYWN0aW9ucydcbmltcG9ydCBBY3RpdmVDb21wb25lbnQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvbW9kZWwvQWN0aXZlQ29tcG9uZW50J1xuXG5pbXBvcnQge1xuICBuZXh0UHJvcEl0ZW0sXG4gIGdldEl0ZW1Db21wb25lbnRJZCxcbiAgZ2V0SXRlbVByb3BlcnR5TmFtZVxufSBmcm9tICcuL2hlbHBlcnMvSXRlbUhlbHBlcnMnXG5cbmltcG9ydCBnZXRNYXhpbXVtTXMgZnJvbSAnLi9oZWxwZXJzL2dldE1heGltdW1NcydcbmltcG9ydCBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lIGZyb20gJy4vaGVscGVycy9taWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lJ1xuaW1wb3J0IGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyBmcm9tICcuL2hlbHBlcnMvY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzJ1xuaW1wb3J0IGh1bWFuaXplUHJvcGVydHlOYW1lIGZyb20gJy4vaGVscGVycy9odW1hbml6ZVByb3BlcnR5TmFtZSdcbmltcG9ydCBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvciBmcm9tICcuL2hlbHBlcnMvZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3InXG5pbXBvcnQgZ2V0TWlsbGlzZWNvbmRNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRNaWxsaXNlY29uZE1vZHVsdXMnXG5pbXBvcnQgZ2V0RnJhbWVNb2R1bHVzIGZyb20gJy4vaGVscGVycy9nZXRGcmFtZU1vZHVsdXMnXG5pbXBvcnQgZm9ybWF0U2Vjb25kcyBmcm9tICcuL2hlbHBlcnMvZm9ybWF0U2Vjb25kcydcbmltcG9ydCByb3VuZFVwIGZyb20gJy4vaGVscGVycy9yb3VuZFVwJ1xuXG5pbXBvcnQgdHJ1bmNhdGUgZnJvbSAnLi9oZWxwZXJzL3RydW5jYXRlJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9EZWZhdWx0UGFsZXR0ZSdcbmltcG9ydCBLZXlmcmFtZVNWRyBmcm9tICcuL2ljb25zL0tleWZyYW1lU1ZHJ1xuXG5pbXBvcnQge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59IGZyb20gJy4vaWNvbnMvQ3VydmVTVkdTJ1xuXG5pbXBvcnQgRG93bkNhcnJvdFNWRyBmcm9tICcuL2ljb25zL0Rvd25DYXJyb3RTVkcnXG5pbXBvcnQgUmlnaHRDYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9SaWdodENhcnJvdFNWRydcbmltcG9ydCBDb250cm9sc0FyZWEgZnJvbSAnLi9Db250cm9sc0FyZWEnXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi9Db250ZXh0TWVudSdcbmltcG9ydCBFeHByZXNzaW9uSW5wdXQgZnJvbSAnLi9FeHByZXNzaW9uSW5wdXQnXG5pbXBvcnQgQ2x1c3RlcklucHV0RmllbGQgZnJvbSAnLi9DbHVzdGVySW5wdXRGaWVsZCdcbmltcG9ydCBQcm9wZXJ0eUlucHV0RmllbGQgZnJvbSAnLi9Qcm9wZXJ0eUlucHV0RmllbGQnXG5cbi8qIHotaW5kZXggZ3VpZGVcbiAga2V5ZnJhbWU6IDEwMDJcbiAgdHJhbnNpdGlvbiBib2R5OiAxMDAyXG4gIGtleWZyYW1lIGRyYWdnZXJzOiAxMDAzXG4gIGlucHV0czogMTAwNCwgKDEwMDUgYWN0aXZlKVxuICB0cmltLWFyZWEgMTAwNlxuICBzY3J1YmJlcjogMTAwNlxuICBib3R0b20gY29udHJvbHM6IDEwMDAwIDwtIGthLWJvb20hXG4qL1xuXG52YXIgZWxlY3Ryb24gPSByZXF1aXJlKCdlbGVjdHJvbicpXG52YXIgd2ViRnJhbWUgPSBlbGVjdHJvbi53ZWJGcmFtZVxuaWYgKHdlYkZyYW1lKSB7XG4gIGlmICh3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cygxLCAxKVxuICBpZiAod2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMoMCwgMClcbn1cblxuY29uc3QgREVGQVVMVFMgPSB7XG4gIHByb3BlcnRpZXNXaWR0aDogMzAwLFxuICB0aW1lbGluZXNXaWR0aDogODcwLFxuICByb3dIZWlnaHQ6IDI1LFxuICBpbnB1dENlbGxXaWR0aDogNzUsXG4gIG1ldGVySGVpZ2h0OiAyNSxcbiAgY29udHJvbHNIZWlnaHQ6IDQyLFxuICB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIDYwXSxcbiAgY3VycmVudEZyYW1lOiAwLFxuICBtYXhGcmFtZTogbnVsbCxcbiAgZHVyYXRpb25UcmltOiAwLFxuICBmcmFtZXNQZXJTZWNvbmQ6IDYwLFxuICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnLCAvLyBvciAnZnJhbWVzJ1xuICBjdXJyZW50VGltZWxpbmVOYW1lOiAnRGVmYXVsdCcsXG4gIGlzUGxheWVyUGxheWluZzogZmFsc2UsXG4gIHBsYXllclBsYXliYWNrU3BlZWQ6IDEuMCxcbiAgaXNTaGlmdEtleURvd246IGZhbHNlLFxuICBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb250cm9sS2V5RG93bjogZmFsc2UsXG4gIGlzQWx0S2V5RG93bjogZmFsc2UsXG4gIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZSxcbiAgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlLFxuICBzZWxlY3RlZE5vZGVzOiB7fSxcbiAgZXhwYW5kZWROb2Rlczoge30sXG4gIGFjdGl2YXRlZFJvd3M6IHt9LFxuICBoaWRkZW5Ob2Rlczoge30sXG4gIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzOiB7fSxcbiAgYWN0aXZlS2V5ZnJhbWVzOiB7fSxcbiAgcmVpZmllZEJ5dGVjb2RlOiBudWxsLFxuICBzZXJpYWxpemVkQnl0ZWNvZGU6IG51bGxcbn1cblxuY29uc3QgQ1VSVkVTVkdTID0ge1xuICBFYXNlSW5CYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbkN1YmljU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5FeHBvU1ZHLFxuICBFYXNlSW5RdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Q2lyY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VJbk91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWludFNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VPdXRCb3VuY2VTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RXhwb1NWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1aW50U1ZHLFxuICBFYXNlT3V0U2luZVNWRyxcbiAgTGluZWFyU1ZHXG59XG5cbi8qKlxuICogSGV5ISBJZiB5b3Ugd2FudCB0byBBREQgYW55IHByb3BlcnRpZXMgaGVyZSwgeW91IG1pZ2h0IGFsc28gbmVlZCB0byB1cGRhdGUgdGhlIGRpY3Rpb25hcnkgaW5cbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9zY2hlbWEsXG4gKiBoYWlrdS1ieXRlY29kZS9zcmMvcHJvcGVydGllcy9kb20vZmFsbGJhY2tzLFxuICogb3IgdGhleSBtaWdodCBub3Qgc2hvdyB1cCBpbiB0aGUgdmlldy5cbiAqL1xuXG5jb25zdCBBTExPV0VEX1BST1BTID0ge1xuICAndHJhbnNsYXRpb24ueCc6IHRydWUsXG4gICd0cmFuc2xhdGlvbi55JzogdHJ1ZSxcbiAgLy8gJ3RyYW5zbGF0aW9uLnonOiB0cnVlLCAvLyBUaGlzIGRvZXNuJ3Qgd29yayBmb3Igc29tZSByZWFzb24sIHNvIGxlYXZpbmcgaXQgb3V0XG4gICdyb3RhdGlvbi56JzogdHJ1ZSxcbiAgJ3JvdGF0aW9uLngnOiB0cnVlLFxuICAncm90YXRpb24ueSc6IHRydWUsXG4gICdzY2FsZS54JzogdHJ1ZSxcbiAgJ3NjYWxlLnknOiB0cnVlLFxuICAnb3BhY2l0eSc6IHRydWUsXG4gIC8vICdzaG93bic6IHRydWUsXG4gICdiYWNrZ3JvdW5kQ29sb3InOiB0cnVlXG4gIC8vICdjb2xvcic6IHRydWUsXG4gIC8vICdmaWxsJzogdHJ1ZSxcbiAgLy8gJ3N0cm9rZSc6IHRydWVcbn1cblxuY29uc3QgQ0xVU1RFUkVEX1BST1BTID0ge1xuICAnbW91bnQueCc6ICdtb3VudCcsXG4gICdtb3VudC55JzogJ21vdW50JyxcbiAgJ21vdW50LnonOiAnbW91bnQnLFxuICAnYWxpZ24ueCc6ICdhbGlnbicsXG4gICdhbGlnbi55JzogJ2FsaWduJyxcbiAgJ2FsaWduLnonOiAnYWxpZ24nLFxuICAnb3JpZ2luLngnOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi55JzogJ29yaWdpbicsXG4gICdvcmlnaW4ueic6ICdvcmlnaW4nLFxuICAndHJhbnNsYXRpb24ueCc6ICd0cmFuc2xhdGlvbicsXG4gICd0cmFuc2xhdGlvbi55JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnonOiAndHJhbnNsYXRpb24nLCAvLyBUaGlzIGRvZXNuJ3Qgd29yayBmb3Igc29tZSByZWFzb24sIHNvIGxlYXZpbmcgaXQgb3V0XG4gICdyb3RhdGlvbi54JzogJ3JvdGF0aW9uJyxcbiAgJ3JvdGF0aW9uLnknOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueic6ICdyb3RhdGlvbicsXG4gIC8vICdyb3RhdGlvbi53JzogJ3JvdGF0aW9uJywgLy8gUHJvYmFibHkgZWFzaWVzdCBub3QgdG8gbGV0IHRoZSB1c2VyIGhhdmUgY29udHJvbCBvdmVyIHF1YXRlcm5pb24gbWF0aFxuICAnc2NhbGUueCc6ICdzY2FsZScsXG4gICdzY2FsZS55JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnonOiAnc2NhbGUnLFxuICAnc2l6ZU1vZGUueCc6ICdzaXplTW9kZScsXG4gICdzaXplTW9kZS55JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnonOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZVByb3BvcnRpb25hbC54JzogJ3NpemVQcm9wb3J0aW9uYWwnLFxuICAnc2l6ZVByb3BvcnRpb25hbC55JzogJ3NpemVQcm9wb3J0aW9uYWwnLFxuICAnc2l6ZVByb3BvcnRpb25hbC56JzogJ3NpemVQcm9wb3J0aW9uYWwnLFxuICAnc2l6ZURpZmZlcmVudGlhbC54JzogJ3NpemVEaWZmZXJlbnRpYWwnLFxuICAnc2l6ZURpZmZlcmVudGlhbC55JzogJ3NpemVEaWZmZXJlbnRpYWwnLFxuICAnc2l6ZURpZmZlcmVudGlhbC56JzogJ3NpemVEaWZmZXJlbnRpYWwnLFxuICAnc2l6ZUFic29sdXRlLngnOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS55JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzaXplQWJzb2x1dGUueic6ICdzaXplQWJzb2x1dGUnLFxuICAnc3R5bGUub3ZlcmZsb3dYJzogJ292ZXJmbG93JyxcbiAgJ3N0eWxlLm92ZXJmbG93WSc6ICdvdmVyZmxvdydcbn1cblxuY29uc3QgQ0xVU1RFUl9OQU1FUyA9IHtcbiAgJ21vdW50JzogJ01vdW50JyxcbiAgJ2FsaWduJzogJ0FsaWduJyxcbiAgJ29yaWdpbic6ICdPcmlnaW4nLFxuICAndHJhbnNsYXRpb24nOiAnUG9zaXRpb24nLFxuICAncm90YXRpb24nOiAnUm90YXRpb24nLFxuICAnc2NhbGUnOiAnU2NhbGUnLFxuICAnc2l6ZU1vZGUnOiAnU2l6aW5nIE1vZGUnLFxuICAnc2l6ZVByb3BvcnRpb25hbCc6ICdTaXplICUnLFxuICAnc2l6ZURpZmZlcmVudGlhbCc6ICdTaXplICsvLScsXG4gICdzaXplQWJzb2x1dGUnOiAnU2l6ZScsXG4gICdvdmVyZmxvdyc6ICdPdmVyZmxvdydcbn1cblxuY29uc3QgQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwgPSB7XG4gICdzaXplQWJzb2x1dGUueCc6IHRydWUsXG4gICdzaXplQWJzb2x1dGUueSc6IHRydWUsXG4gIC8vIEVuYWJsZSB0aGVzZSBhcyBzdWNoIGEgdGltZSBhcyB3ZSBjYW4gcmVwcmVzZW50IHRoZW0gdmlzdWFsbHkgaW4gdGhlIGdsYXNzXG4gIC8vICdzdHlsZS5vdmVyZmxvd1gnOiB0cnVlLFxuICAvLyAnc3R5bGUub3ZlcmZsb3dZJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZVxufVxuXG5jb25zdCBBTExPV0VEX1RBR05BTUVTID0ge1xuICBkaXY6IHRydWUsXG4gIHN2ZzogdHJ1ZSxcbiAgZzogdHJ1ZSxcbiAgcmVjdDogdHJ1ZSxcbiAgY2lyY2xlOiB0cnVlLFxuICBlbGxpcHNlOiB0cnVlLFxuICBsaW5lOiB0cnVlLFxuICBwb2x5bGluZTogdHJ1ZSxcbiAgcG9seWdvbjogdHJ1ZVxufVxuXG5jb25zdCBUSFJPVFRMRV9USU1FID0gMTcgLy8gbXNcblxuZnVuY3Rpb24gdmlzaXQgKG5vZGUsIHZpc2l0b3IpIHtcbiAgaWYgKG5vZGUuY2hpbGRyZW4pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBjaGlsZCA9IG5vZGUuY2hpbGRyZW5baV1cbiAgICAgIGlmIChjaGlsZCAmJiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHZpc2l0b3IoY2hpbGQpXG4gICAgICAgIHZpc2l0KGNoaWxkLCB2aXNpdG9yKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBUaW1lbGluZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IGxvZGFzaC5hc3NpZ24oe30sIERFRkFVTFRTKVxuICAgIHRoaXMuY3R4bWVudSA9IG5ldyBDb250ZXh0TWVudSh3aW5kb3csIHRoaXMpXG5cbiAgICB0aGlzLmVtaXR0ZXJzID0gW10gLy8gQXJyYXk8e2V2ZW50RW1pdHRlcjpFdmVudEVtaXR0ZXIsIGV2ZW50TmFtZTpzdHJpbmcsIGV2ZW50SGFuZGxlcjpGdW5jdGlvbn0+XG5cbiAgICB0aGlzLl9jb21wb25lbnQgPSBuZXcgQWN0aXZlQ29tcG9uZW50KHtcbiAgICAgIGFsaWFzOiAndGltZWxpbmUnLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHVzZXJjb25maWc6IHRoaXMucHJvcHMudXNlcmNvbmZpZyxcbiAgICAgIHdlYnNvY2tldDogdGhpcy5wcm9wcy53ZWJzb2NrZXQsXG4gICAgICBwbGF0Zm9ybTogd2luZG93LFxuICAgICAgZW52b3k6IHRoaXMucHJvcHMuZW52b3ksXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgLy8gU2luY2Ugd2Ugc3RvcmUgYWNjdW11bGF0ZWQga2V5ZnJhbWUgbW92ZW1lbnRzLCB3ZSBjYW4gc2VuZCB0aGUgd2Vic29ja2V0IHVwZGF0ZSBpbiBiYXRjaGVzO1xuICAgIC8vIFRoaXMgaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIGF2b2lkcyB1bm5lY2Vzc2FyeSB1cGRhdGVzIHRvIHRoZSBvdmVyIHZpZXdzXG4gICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gPSBsb2Rhc2gudGhyb3R0bGUodGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24uYmluZCh0aGlzKSwgMjUwKVxuICAgIHRoaXMudXBkYXRlU3RhdGUgPSB0aGlzLnVwZGF0ZVN0YXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuICAgIHdpbmRvdy50aW1lbGluZSA9IHRoaXNcbiAgfVxuXG4gIGZsdXNoVXBkYXRlcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHRoaXMudXBkYXRlcykubGVuZ3RoIDwgMSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMudXBkYXRlcykge1xuICAgICAgaWYgKHRoaXMuc3RhdGVba2V5XSAhPT0gdGhpcy51cGRhdGVzW2tleV0pIHtcbiAgICAgICAgdGhpcy5jaGFuZ2VzW2tleV0gPSB0aGlzLnVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgICB2YXIgY2JzID0gdGhpcy5jYWxsYmFja3Muc3BsaWNlKDApXG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnVwZGF0ZXMsICgpID0+IHtcbiAgICAgIHRoaXMuY2xlYXJDaGFuZ2VzKClcbiAgICAgIGNicy5mb3JFYWNoKChjYikgPT4gY2IoKSlcbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlU3RhdGUgKHVwZGF0ZXMsIGNiKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgdGhpcy51cGRhdGVzW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICB9XG4gICAgaWYgKGNiKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGNiKVxuICAgIH1cbiAgICB0aGlzLmZsdXNoVXBkYXRlcygpXG4gIH1cblxuICBjbGVhckNoYW5nZXMgKCkge1xuICAgIGZvciAoY29uc3QgazEgaW4gdGhpcy51cGRhdGVzKSBkZWxldGUgdGhpcy51cGRhdGVzW2sxXVxuICAgIGZvciAoY29uc3QgazIgaW4gdGhpcy5jaGFuZ2VzKSBkZWxldGUgdGhpcy5jaGFuZ2VzW2syXVxuICB9XG5cbiAgdXBkYXRlVGltZSAoY3VycmVudEZyYW1lKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRGcmFtZSB9KVxuICB9XG5cbiAgc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9XG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgdW5zZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0gbnVsbFxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIC8qXG4gICAqIGxpZmVjeWNsZS9ldmVudHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIC8vIENsZWFuIHVwIHN1YnNjcmlwdGlvbnMgdG8gcHJldmVudCBtZW1vcnkgbGVha3MgYW5kIHJlYWN0IHdhcm5pbmdzXG4gICAgdGhpcy5lbWl0dGVycy5mb3JFYWNoKCh0dXBsZSkgPT4ge1xuICAgICAgdHVwbGVbMF0ucmVtb3ZlTGlzdGVuZXIodHVwbGVbMV0sIHR1cGxlWzJdKVxuICAgIH0pXG4gICAgdGhpcy5zdGF0ZS5kaWRNb3VudCA9IGZhbHNlXG5cbiAgICB0aGlzLnRvdXJDbGllbnQub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5fZW52b3lDbGllbnQuY2xvc2VDb25uZWN0aW9uKClcblxuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdiZWdpbicpO1xuICAgIC8vIFNjcm9sbC5FdmVudHMuc2Nyb2xsRXZlbnQucmVtb3ZlKCdlbmQnKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGRpZE1vdW50OiB0cnVlXG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmRpZE1vdW50KSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIH0pXG4gICAgICB9XG4gICAgfSwgVEhST1RUTEVfVElNRSkpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLnByb3BzLndlYnNvY2tldCwgJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICBpZiAobWVzc2FnZS5mb2xkZXIgIT09IHRoaXMucHJvcHMuZm9sZGVyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOiByZXR1cm4gdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBhY3Rpb24gcmVjZWl2ZWQnLCBtZXRob2QsIHBhcmFtcylcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuY2FsbE1ldGhvZChtZXRob2QsIHBhcmFtcywgY2IpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50OnVwZGF0ZWQnLCAobWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IHVwZGF0ZWQnLCBtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpXG5cbiAgICAgIC8vIElmIHdlIGRvbid0IGNsZWFyIGNhY2hlcyB0aGVuIHRoZSB0aW1lbGluZSBmaWVsZHMgbWlnaHQgbm90IHVwZGF0ZSByaWdodCBhZnRlciBrZXlmcmFtZSBkZWxldGlvbnNcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuXG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcblxuICAgICAgaWYgKG1heWJlTWV0YWRhdGEgJiYgbWF5YmVNZXRhZGF0YS5mcm9tICE9PSAndGltZWxpbmUnKSB7XG4gICAgICAgIGlmIChtYXliZUNvbXBvbmVudElkcyAmJiBtYXliZVRpbWVsaW5lTmFtZSAmJiBtYXliZVByb3BlcnR5TmFtZXMpIHtcbiAgICAgICAgICBtYXliZUNvbXBvbmVudElkcy5mb3JFYWNoKChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5taW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlKGNvbXBvbmVudElkLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUgfHwgMCwgbWF5YmVQcm9wZXJ0eU5hbWVzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCBzZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25TZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnVuc2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHVuc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uVW5zZWxlY3RFbGVtZW50KHsgY29tcG9uZW50SWQgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6bW91bnRlZCcsICgpID0+IHtcbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgbW91bnRlZCcsIHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMucmVoeWRyYXRlQnl0ZWNvZGUocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpXG4gICAgICAvLyB0aGlzLnVwZGF0ZVRpbWUodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUpXG4gICAgfSlcblxuICAgIC8vIGNvbXBvbmVudDptb3VudGVkIGZpcmVzIHdoZW4gdGhpcyBmaW5pc2hlcyB3aXRob3V0IGVycm9yXG4gICAgdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24oKVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0b3VyQ2xpZW50UmVhZHknLCAoY2xpZW50KSA9PiB7XG4gICAgICBjbGllbnQub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGNsaWVudC5uZXh0KClcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgaGVhcmQnKVxuICAgICAgbGV0IHRhZ25hbWUgPSBwYXN0ZUV2ZW50LnRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgIGxldCBlZGl0YWJsZSA9IHBhc3RlRXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykgLy8gT3VyIGlucHV0IGZpZWxkcyBhcmUgPHNwYW4+c1xuICAgICAgaWYgKHRhZ25hbWUgPT09ICdpbnB1dCcgfHwgdGFnbmFtZSA9PT0gJ3RleHRhcmVhJyB8fCBlZGl0YWJsZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgdmlhIGRlZmF1bHQnKVxuICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGEgcHJvcGVydHkgaW5wdXQsIHNvIGxldCB0aGUgZGVmYXVsdCBhY3Rpb24gaGFwcGVuXG4gICAgICAgIC8vIFRPRE86IE1ha2UgdGhpcyBjaGVjayBsZXNzIGJyaXR0bGVcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vdGlmeSBjcmVhdG9yIHRoYXQgd2UgaGF2ZSBzb21lIGNvbnRlbnQgdGhhdCB0aGUgcGVyc29uIHdpc2hlcyB0byBwYXN0ZSBvbiB0aGUgc3RhZ2U7XG4gICAgICAgIC8vIHRoZSB0b3AgbGV2ZWwgbmVlZHMgdG8gaGFuZGxlIHRoaXMgYmVjYXVzZSBpdCBkb2VzIGNvbnRlbnQgdHlwZSBkZXRlY3Rpb24uXG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBkZWxlZ2F0ZWQgdG8gcGx1bWJpbmcnKVxuICAgICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgICAgZGF0YTogbnVsbCAvLyBUaGlzIGNhbiBob2xkIGNvb3JkaW5hdGVzIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIHBhc3RlXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlS2V5RG93bi5iaW5kKHRoaXMpLCBmYWxzZSlcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLmhhbmRsZUtleVVwLmJpbmQodGhpcykpXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjcmVhdGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMvKiB2YWx1ZSwgY3VydmUsIGVuZG1zLCBlbmR2YWx1ZSAqLylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ3NwbGl0U2VnbWVudCcsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdmFyIG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoc3RhcnRNcywgZnJhbWVJbmZvLm1zcGYpXG4gICAgICB2YXIgZmluYWxNcyA9IE1hdGgucm91bmQobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnam9pbktleWZyYW1lcycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2RlbGV0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSh7Y29tcG9uZW50SWQ6IHtjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lLCBtczogc3RhcnRNc319LCB0aW1lbGluZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdjaGFuZ2VTZWdtZW50Q3VydmUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnbW92ZVNlZ21lbnRFbmRwb2ludHMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcylcbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDp0aWNrJywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiB3ZSBnb3QgYSB0aWNrLCB3aGljaCBvY2N1cnMgZHVyaW5nIFRpbWVsaW5lIG1vZGVsIHVwZGF0aW5nLCB0aGVuIHdlIHdhbnQgdG8gcGF1c2UgaXQgaWYgdGhlIHNjcnViYmVyXG4gICAgICAvLyBoYXMgYXJyaXZlZCBhdCB0aGUgbWF4aW11bSBhY2NlcHRpYmxlIGZyYW1lIGluIHRoZSB0aW1lbGluZS5cbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNQbGF5ZXJQbGF5aW5nOiBmYWxzZX0pXG4gICAgICB9XG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6YXV0aG9yaXRhdGl2ZS1mcmFtZS1zZXQnLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICd0aW1lbGluZScpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygndGltZWxpbmUnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleURvd24gKG5hdGl2ZUV2ZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY3VycmVudGx5IGFjdGl2ZSBleHByZXNzaW9uIGlucHV0IGEgY2hhbmNlIHRvIGNhcHR1cmUgdGhpcyBldmVudCBhbmQgc2hvcnQgY2lyY3VpdCB1cyBpZiBzb1xuICAgIGlmICh0aGlzLnJlZnMuZXhwcmVzc2lvbklucHV0LndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudChuYXRpdmVFdmVudCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIElmIHRoZSB1c2VyIGhpdCB0aGUgc3BhY2ViYXIgX2FuZF8gd2UgYXJlbid0IGluc2lkZSBhbiBpbnB1dCBmaWVsZCwgdHJlYXQgdGhhdCBsaWtlIGEgcGxheWJhY2sgdHJpZ2dlclxuICAgIGlmIChuYXRpdmVFdmVudC5rZXlDb2RlID09PSAzMiAmJiAhZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXQ6Zm9jdXMnKSkge1xuICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgY2FzZSAzNzogLy8gbGVmdFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNTaGlmdEtleURvd24pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogWzAsIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1dLCBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVRpbWUoMClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigtMSlcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiYgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgtMSlcbiAgICAgICAgfVxuXG4gICAgICBjYXNlIDM5OiAvLyByaWdodFxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0NvbW1hbmRLZXlEb3duKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlU2NydWJiZXJQb3NpdGlvbigxKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdykgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiB0cnVlIH0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoMSlcbiAgICAgICAgfVxuXG4gICAgICAvLyBjYXNlIDM4OiAvLyB1cFxuICAgICAgLy8gY2FzZSA0MDogLy8gZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgODogLy8gZGVsZXRlXG4gICAgICAgIGlmICghbG9kYXNoLmlzRW1wdHkodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMpKSB7XG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lcywgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgICAgICB9XG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5qb2luS2V5ZnJhbWVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignam9pbktleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSAoa2V5ZnJhbWVzLCB0aW1lbGluZU5hbWUpIHtcbiAgICBsb2Rhc2guZWFjaChrZXlmcmFtZXMsIChrKSA9PiB7XG4gICAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGsuY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgay5wcm9wZXJ0eU5hbWUsIGsubXMpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtrLmNvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBrLnByb3BlcnR5TmFtZSwgay5tc10sICgpID0+IHt9KVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5ZnJhbWVzOiB7fX0pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRDdXJ2ZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50Q3VydmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50RW5kcG9pbnRzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSAob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMucmVuYW1lVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdyZW5hbWVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vdGU6IFdlIG1heSBuZWVkIHRvIHJlbWVtYmVyIHRvIHNlcmlhbGl6ZSBhIHRpbWVsaW5lIGRlc2NyaXB0b3IgaGVyZVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kdXBsaWNhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkdXBsaWNhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpIHtcbiAgICAvKlxuICAgIFdlJ3JlIGdvaW5nIHRvIHVzZSB0aGUgY2FsbCBmcm9tIHdoYXQncyBiZWluZyBkcmFnZ2VkLCBiZWNhdXNlIHRoYXQncyBzb21ldGltZXMgYSB0cmFuc2l0aW9uIGJvZHlcbiAgICByYXRoZXIgdGhhbiBhIHNpbXBsZSBrZXlmcmFtZS5cblxuICAgIEZyb20gdGhlcmUgd2UncmUgZ29pbmcgdG8gbGVhcm4gaG93IGZhciB0byBtb3ZlIGFsbCBvdGhlciBrZXlmcmFtZXMgaW4gYWN0aXZlS2V5ZnJhbWVzOiB7fVxuXG4gICAgQ29uY2VybnM6XG4gICAgICBXaGVuIHdlIG5lZWQgdG8gc3RvcCBvbmUga2V5ZnJhbWUgYmVjYXVzZSBpdCBjYW4ndCBnbyBhbnkgZnVydGhlciwgd2UgbmVlZCB0byBzdG9wIHRoZSBlbnRpcmUgZ3JvdXAgZHJhZy5cblxuICAgIE5vdGVzOlxuICAgICAgV2hlbiBhIHVzZXIgZHJhZ3MgYSBzZWdtZW50IGJvZHkgaXQgaGFzIHRoZSBcImJvZHlcIiBoYW5kbGUuIEl0XG4gICAgKi9cbiAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgY2hhbmdlTXMgPSBlbmRNcyAtIHN0YXJ0TXNcblxuICAgIGxvZGFzaC5lYWNoKGFjdGl2ZUtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIGNvbnN0IGFkanVzdGVkTXMgPSBwYXJzZUludChrLm1zKSArIGNoYW5nZU1zXG4gICAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyhcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIGsuY29tcG9uZW50SWQsXG4gICAgICAgIHRpbWVsaW5lTmFtZSxcbiAgICAgICAgay5wcm9wZXJ0eU5hbWUsXG4gICAgICAgIGsuaGFuZGxlLCAvLyB0b2RvOiB0YWtlIGEgc2Vjb25kIGxvb2sgYXQgdGhpcyBvbmVcbiAgICAgICAgay5pbmRleCxcbiAgICAgICAgay5tcyxcbiAgICAgICAgYWRqdXN0ZWRNcyxcbiAgICAgICAgZnJhbWVJbmZvXG4gICAgICApXG4gICAgICAvLyBVcGRhdGUgb3VyIHNlbGVjdGVkIGtleWZyYW1lcyBzdGFydCB0aW1lIG5vdyB0aGF0IHdlJ3ZlIG1vdmVkIHRoZW1cbiAgICAgIC8vIE5vdGU6IFRoaXMgc2VlbXMgbGlrZSB0aGVyZSdzIHByb2JhYmx5IGEgbW9yZSBjbGV2ZXIgd2F5IHRvIG1ha2Ugc3VyZSB0aGlzIGdldHNcbiAgICAgIC8vIHVwZGF0ZWQgd2hlbiB2aWEgdGhlIEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyBwZXJoYXBzLlxuICAgICAgYWN0aXZlS2V5ZnJhbWVzW2suY29tcG9uZW50SWQgKyAnLScgKyBrLnByb3BlcnR5TmFtZSArICctJyArIGsuaW5kZXhdLm1zID0gT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3Zlcylbay5pbmRleF1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleWZyYW1lc30pXG5cbiAgICAgIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgICBpZiAoT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3ZlcykubGVuZ3RoID4gMCkge1xuICAgICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgICAgIC8vIHNvIHRoZSB2YWx1ZXMgYXJlIGFjY3VtdWxhdGVkIGFuZCBzZW50IHZpYSBhIHNpbmdsZSBiYXRjaGVkIHVwZGF0ZS5cbiAgICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSB0aGlzLl9rZXlmcmFtZU1vdmVzID0ge31cbiAgICAgICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgICAgIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldID0geyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9XG4gICAgICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHJldHVybiB2b2lkICgwKVxuICAgIGZvciAobGV0IG1vdmVtZW50S2V5IGluIHRoaXMuX2tleWZyYW1lTW92ZXMpIHtcbiAgICAgIGlmICghbW92ZW1lbnRLZXkpIGNvbnRpbnVlXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldKSBjb250aW51ZVxuICAgICAgbGV0IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfSA9IHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgZnVuY3Rpb25zIGdldCBjb252ZXJ0ZWQgaW50byB0aGVpciBzZXJpYWwgZm9ybSBiZWZvcmUgcGFzc2luZyBvdmVyIHRoZSB3aXJlXG4gICAgICBsZXQga2V5ZnJhbWVNb3Zlc0ZvcldpcmUgPSBleHByZXNzaW9uVG9STyhrZXlmcmFtZU1vdmVzKVxuXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ21vdmVLZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzRm9yV2lyZSwgZnJhbWVJbmZvXSwgKCkgPT4ge30pXG4gICAgICBkZWxldGUgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cbiAgICB9XG4gIH1cblxuICB0b2dnbGVQbGF5YmFjayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IGZhbHNlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBsYXkoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZWh5ZHJhdGVCeXRlY29kZSAocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpIHtcbiAgICBpZiAocmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgICBpZiAocmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICAgIGlmICghaWQpIHJldHVybiB2b2lkICgwKVxuICAgICAgICAgIG5vZGUuX19pc1NlbGVjdGVkID0gISF0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzRXhwYW5kZWQgPSAhIXRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNIaWRkZW4gPSAhIXRoaXMuc3RhdGUuaGlkZGVuTm9kZXNbaWRdXG4gICAgICAgIH0pXG4gICAgICAgIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uU2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50KSA9PiB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuZXhwYW5kTm9kZShub2RlKVxuICAgICAgICB0aGlzLnNjcm9sbFRvTm9kZShub2RlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25VbnNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZE5vZGVzQnlDb21wb25lbnRJZChjb21wb25lbnRJZClcbiAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICB0aGlzLmRlc2VsZWN0Tm9kZShub2RlKVxuICAgICAgdGhpcy5jb2xsYXBzZU5vZGUobm9kZSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aobm9kZSlcbiAgICB9KVxuICB9XG5cbiAgZmluZE5vZGVzQnlDb21wb25lbnRJZCAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgZm91bmQgPSBbXVxuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgbWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgc3RhcnRNcywgcHJvcGVydHlOYW1lcykge1xuICAgIGxldCByZWxhdGVkRWxlbWVudCA9IHRoaXMuZmluZEVsZW1lbnRJblRlbXBsYXRlKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICBsZXQgZWxlbWVudE5hbWUgPSByZWxhdGVkRWxlbWVudCAmJiByZWxhdGVkRWxlbWVudC5lbGVtZW50TmFtZVxuICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIG1pc3NpbmcgZWxlbWVudCwgYW5kIHdpdGhvdXQgYW4gZWxlbWVudCBuYW1lIEkgY2Fubm90IHVwZGF0ZSBhIHByb3BlcnR5IHZhbHVlJylcbiAgICB9XG5cbiAgICB2YXIgYWxsUm93cyA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICBhbGxSb3dzLmZvckVhY2goKHJvd0luZm8pID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzUHJvcGVydHkgJiYgcm93SW5mby5jb21wb25lbnRJZCA9PT0gY29tcG9uZW50SWQgJiYgcHJvcGVydHlOYW1lcy5pbmRleE9mKHJvd0luZm8ucHJvcGVydHkubmFtZSkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBhY3RpdmF0ZWRSb3dzOiBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzKSxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgICogaXRlcmF0b3JzL3Zpc2l0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGZpbmRFbGVtZW50SW5UZW1wbGF0ZSAoY29tcG9uZW50SWQsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgbGV0IGZvdW5kXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kID0gbm9kZVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICB2aXNpdFRlbXBsYXRlIChsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLCBwYXJlbnQsIGl0ZXJhdGVlKSB7XG4gICAgaXRlcmF0ZWUodGVtcGxhdGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGVtcGxhdGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKCFjaGlsZCB8fCB0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBjb250aW51ZVxuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUobG9jYXRvciArICcuJyArIGksIGksIHRlbXBsYXRlLmNoaWxkcmVuLCBjaGlsZCwgdGVtcGxhdGUsIGl0ZXJhdGVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcFZpc2libGVGcmFtZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCByaWdodEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICBjb25zdCBmcmFtZU1vZHVsdXMgPSBnZXRGcmFtZU1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgbGV0IGl0ZXJhdGlvbkluZGV4ID0gLTFcbiAgICBmb3IgKGxldCBpID0gbGVmdEZyYW1lOyBpIDwgcmlnaHRGcmFtZTsgaSsrKSB7XG4gICAgICBpdGVyYXRpb25JbmRleCsrXG4gICAgICBsZXQgZnJhbWVOdW1iZXIgPSBpXG4gICAgICBsZXQgcGl4ZWxPZmZzZXRMZWZ0ID0gaXRlcmF0aW9uSW5kZXggKiBmcmFtZUluZm8ucHhwZlxuICAgICAgaWYgKHBpeGVsT2Zmc2V0TGVmdCA8PSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSB7XG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBmcmFtZUluZm8ucHhwZiwgZnJhbWVNb2R1bHVzKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSB7XG4gICAgICAgICAgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIG1hcFZpc2libGVUaW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBtc01vZHVsdXMgPSBnZXRNaWxsaXNlY29uZE1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCBsZWZ0TXMgPSBmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgcmlnaHRNcyA9IGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCB0b3RhbE1zID0gcmlnaHRNcyAtIGxlZnRNc1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gcm91bmRVcChsZWZ0TXMsIG1zTW9kdWx1cylcbiAgICBsZXQgbXNNYXJrZXJUbXAgPSBmaXJzdE1hcmtlclxuICAgIGNvbnN0IG1zTWFya2VycyA9IFtdXG4gICAgd2hpbGUgKG1zTWFya2VyVG1wIDw9IHJpZ2h0TXMpIHtcbiAgICAgIG1zTWFya2Vycy5wdXNoKG1zTWFya2VyVG1wKVxuICAgICAgbXNNYXJrZXJUbXAgKz0gbXNNb2R1bHVzXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNNYXJrZXIgPSBtc01hcmtlcnNbaV1cbiAgICAgIGxldCBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zTWFya2VyLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIGxldCBtc1JlbWFpbmRlciA9IE1hdGguZmxvb3IobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYgLSBtc01hcmtlcilcbiAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgbXNSZW1haW5kZXIgY2FzZSByYXRoZXIgdGhhbiBpZ25vcmluZyBpdFxuICAgICAgaWYgKCFtc1JlbWFpbmRlcikge1xuICAgICAgICBsZXQgZnJhbWVPZmZzZXQgPSBuZWFyZXN0RnJhbWUgLSBsZWZ0RnJhbWVcbiAgICAgICAgbGV0IHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUobXNNYXJrZXIsIHB4T2Zmc2V0LCB0b3RhbE1zKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIC8qXG4gICAqIGdldHRlcnMvY2FsY3VsYXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLyoqXG4gICAgLy8gU29ycnk6IFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gZ2l2ZW4gaHVtYW4tcmVhZGFibGUgbmFtZXNcbiAgICA8R0FVR0U+XG4gICAgICAgICAgICA8LS0tLWZyaVctLS0+XG4gICAgZnJpMCAgICBmcmlBICAgICAgICBmcmlCICAgICAgICBmcmlNYXggICAgICAgICAgICAgICAgICAgICAgICAgIGZyaU1heDJcbiAgICB8ICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8XG4gICAgICAgICAgICA8LS0tLS0tLS0tLS0+IDw8IHRpbWVsaW5lcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgIHxcbiAgICA8LS0tLS0tLT4gICAgICAgICAgIHwgPDwgcHJvcGVydGllcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgcHhBICAgICAgICAgcHhCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXggICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heDJcbiAgICA8U0NST0xMQkFSPlxuICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tfCA8PCBzY3JvbGxlciB2aWV3cG9ydFxuICAgICAgICAqPT09PSogICAgICAgICAgICA8PCBzY3JvbGxiYXJcbiAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAgICB8c2MwICAgICAgICAgICAgICAgIHxzY0wgJiYgc2NSYXRpb1xuICAgICAgICB8c2NBXG4gICAgICAgICAgICAgfHNjQlxuICAqL1xuICBnZXRGcmFtZUluZm8gKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHt9XG4gICAgZnJhbWVJbmZvLmZwcyA9IHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8vIE51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgIGZyYW1lSW5mby5tc3BmID0gMTAwMCAvIGZyYW1lSW5mby5mcHMgLy8gTWlsbGlzZWNvbmRzIHBlciBmcmFtZVxuICAgIGZyYW1lSW5mby5tYXhtcyA9IGdldE1heGltdW1Ncyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgIGZyYW1lSW5mby5tYXhmID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShmcmFtZUluZm8ubWF4bXMsIGZyYW1lSW5mby5tc3BmKSAvLyBNYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaTAgPSAwIC8vIFRoZSBsb3dlc3QgcG9zc2libGUgZnJhbWUgKGFsd2F5cyAwKVxuICAgIGZyYW1lSW5mby5mcmlBID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPCBmcmFtZUluZm8uZnJpMCkgPyBmcmFtZUluZm8uZnJpMCA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLy8gVGhlIGxlZnRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaU1heCA9IChmcmFtZUluZm8ubWF4ZiA8IDYwKSA/IDYwIDogZnJhbWVJbmZvLm1heGYgLy8gVGhlIG1heGltdW0gZnJhbWUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpTWF4MiA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heCAqIDEuODggIC8vIEV4dGVuZCB0aGUgbWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSAoYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBrZXlmcmFtZXMgYmV5b25kIHRoZSBwcmV2aW91c2x5IGRlZmluZWQgbWF4KVxuICAgIGZyYW1lSW5mby5mcmlCID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gPiBmcmFtZUluZm8uZnJpTWF4MikgPyBmcmFtZUluZm8uZnJpTWF4MiA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLy8gVGhlIHJpZ2h0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlXID0gTWF0aC5hYnMoZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkgLy8gVGhlIHdpZHRoIG9mIHRoZSB2aXNpYmxlIHJhbmdlIGluIGZyYW1lc1xuICAgIGZyYW1lSW5mby5weHBmID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8gZnJhbWVJbmZvLmZyaVcpIC8vIE51bWJlciBvZiBwaXhlbHMgcGVyIGZyYW1lIChyb3VuZGVkKVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA8IDEpIGZyYW1lSW5mby5wU2NyeHBmID0gMVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA+IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIGZyYW1lSW5mby5weHBmID0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aFxuICAgIGZyYW1lSW5mby5weEEgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4QiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhNYXgyID0gZnJhbWVJbmZvLmZyaU1heDIgKiBmcmFtZUluZm8ucHhwZiAvLyBUaGUgd2lkdGggaW4gcGl4ZWxzIHRoYXQgdGhlIGVudGlyZSB0aW1lbGluZSAoXCJmcmlNYXgyXCIpIHBhZGRpbmcgd291bGQgZXF1YWxcbiAgICBmcmFtZUluZm8ubXNBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgbGVmdG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8ubXNCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgcmlnaHRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLnNjTCA9IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvLyBUaGUgbGVuZ3RoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsZXIgdmlld1xuICAgIGZyYW1lSW5mby5zY1JhdGlvID0gZnJhbWVJbmZvLnB4TWF4MiAvIGZyYW1lSW5mby5zY0wgLy8gVGhlIHJhdGlvIG9mIHRoZSBzY3JvbGxlciB2aWV3IHRvIHRoZSB0aW1lbGluZSB2aWV3IChzbyB0aGUgc2Nyb2xsZXIgcmVuZGVycyBwcm9wb3J0aW9uYWxseSB0byB0aGUgdGltZWxpbmUgYmVpbmcgZWRpdGVkKVxuICAgIGZyYW1lSW5mby5zY0EgPSAoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIGxlZnQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgZnJhbWVJbmZvLnNjQiA9IChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgcmlnaHQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgcmV0dXJuIGZyYW1lSW5mb1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMvdGhlc2UgbWlzbm9tZXIocykuIEl0J3Mgbm90ICdBU0NJSSdcbiAgZ2V0QXNjaWlUcmVlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGxldCBhcmNoeUZvcm1hdCA9IHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgICBsZXQgYXJjaHlTdHIgPSBhcmNoeShhcmNoeUZvcm1hdClcbiAgICAgIHJldHVybiBhcmNoeVN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXRBcmNoeUZvcm1hdE5vZGVzIChsYWJlbCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWwsXG4gICAgICBub2RlczogY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykubWFwKChjaGlsZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCBjaGlsZC5jaGlsZHJlbilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50Um93c0RhdGEgKCkge1xuICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgKiptdXN0KiogY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIGNvbXBvbmVudCBoZWFkaW5ncy9wcm9wZXJ0eSByb3dzXG4gICAgbGV0IGFzY2lpU3ltYm9scyA9IHRoaXMuZ2V0QXNjaWlUcmVlKCkuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGNvbXBvbmVudFJvd3MgPSBbXVxuICAgIGxldCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlID0ge31cbiAgICBsZXQgdmlzaXRvckl0ZXJhdGlvbnMgPSAwXG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlIHx8ICF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIGNvbXBvbmVudFJvd3NcblxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzKSA9PiB7XG4gICAgICAvLyBUT0RPIGhvdyB3aWxsIHRoaXMgYml0ZSB1cz9cbiAgICAgIGxldCBpc0NvbXBvbmVudCA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpXG4gICAgICBsZXQgZWxlbWVudE5hbWUgPSBpc0NvbXBvbmVudCA/IG5vZGUuYXR0cmlidXRlcy5zb3VyY2UgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmIChBTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBpc0NvbXBvbmVudCA/IF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyhub2RlKSA6IF9idWlsZERPTUFkZHJlc3NhYmxlcyhlbGVtZW50TmFtZSwgbG9jYXRvcilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGlzQ2x1c3Rlck1lbWJlcjogdHJ1ZSwgaXNDbHVzdGVySGVhZGluZywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsIGNsdXN0ZXJOYW1lOiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLm5hbWUsIGlzQ2x1c3RlcjogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVGltZShmcmFtZUluZm8uZnJpMCkgKi9cbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaTAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBhY3RpdmVLZXlmcmFtZXMgPSB7fVxuXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmVLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBjdXJyLm1zXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gY3Vyci5mcmFtZVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbnVsbCxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG51bGwsXG4gICAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgekluZGV4OiAxMDAzLFxuICAgICAgICAgICAgY3Vyc29yOiAnY29sLXJlc2l6ZSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNvbG9LZXlmcmFtZSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgbGV0IGlzQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gIT0gdW5kZWZpbmVkKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIGFjdGl2ZUtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBpbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgaGFuZGxlOiAnbWlkZGxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSksXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBuZXh0LmluZGV4LFxuICAgICAgICAgICAgbXM6IG5leHQubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdtaWRkbGUnXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmVLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbnRhaW5lcidcbiAgICAgICAgICBrZXk9e3VuaXF1ZUtleX1cbiAgICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtdHJhbnNpdGlvbicsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIGN1cnZlOiBjdXJyLmN1cnZlLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlRW50ZXI9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSBQYWxldHRlLkdSQVlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9ICd0cmFuc3BhcmVudCdcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgICB3aWR0aDogcHhPZmZzZXRSaWdodCAtIHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7b3B0aW9ucy5jb2xsYXBzZWQgJiZcbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb2xsYXBzZWQtYmFja2Ryb3AnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIHpJbmRleDogNCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkdSQVlcbiAgICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDEsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gKG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MylcbiAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45NjUpXG4gICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkxKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZCkgPyAncG9pbnRlcicgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDIsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgb3ZlcmZsb3c6IGJyZWFraW5nQm91bmRzID8gJ3Zpc2libGUnIDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxDdXJ2ZVNWR1xuICAgICAgICAgICAgICBpZD17dW5pcXVlS2V5fVxuICAgICAgICAgICAgICBsZWZ0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChmaXJzdEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgICByaWdodEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHJpZ2h0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICAgICAgPyAncG9pbnRlcidcbiAgICAgICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgfSAvPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbnN0YW50Qm9keSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgLy8gY29uc3QgYWN0aXZlSW5mbyA9IHNldEFjdGl2ZUNvbnRlbnRzKHByb3BlcnR5TmFtZSwgY3VyciwgbmV4dCwgZmFsc2UsIHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgfX1cbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb25zdGFudC1ib2R5J1xuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS1zZWdtZW50JyxcbiAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCArIDQsXG4gICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQ6IDMsXG4gICAgICAgICAgdG9wOiAxMixcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB6SW5kZXg6IDIsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICA/IENvbG9yKFBhbGV0dGUuR1JBWSkuZmFkZSgwLjIzKVxuICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA5MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2FjdGl2ZUtleWZyYW1lczoge319KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzIChub2RlKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBfYnVpbGRET01BZGRyZXNzYWJsZXMoJ2RpdicpIC8vIHN0YXJ0IHdpdGggZG9tIHByb3BlcnRpZXM/XG4gIGZvciAobGV0IG5hbWUgaW4gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXMpIHtcbiAgICBsZXQgc3RhdGUgPSBub2RlLmVsZW1lbnROYW1lLnN0YXRlc1tuYW1lXVxuXG4gICAgYWRkcmVzc2FibGVzLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHByZWZpeDogbmFtZSxcbiAgICAgIHN1ZmZpeDogdW5kZWZpbmVkLFxuICAgICAgZmFsbGJhY2s6IHN0YXRlLnZhbHVlLFxuICAgICAgdHlwZWRlZjogc3RhdGUudHlwZVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGFkZHJlc3NhYmxlc1xufVxuXG5mdW5jdGlvbiBfYnVpbGRET01BZGRyZXNzYWJsZXMgKGVsZW1lbnROYW1lLCBsb2NhdG9yKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBbXVxuXG4gIGNvbnN0IGRvbVNjaGVtYSA9IERPTVNjaGVtYVtlbGVtZW50TmFtZV1cbiAgY29uc3QgZG9tRmFsbGJhY2tzID0gRE9NRmFsbGJhY2tzW2VsZW1lbnROYW1lXVxuXG4gIGlmIChkb21TY2hlbWEpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gZG9tU2NoZW1hKSB7XG4gICAgICBsZXQgcHJvcGVydHlHcm91cCA9IG51bGxcblxuICAgICAgaWYgKGxvY2F0b3IgPT09ICcwJykgeyAvLyBUaGlzIGluZGljYXRlcyB0aGUgdG9wIGxldmVsIGVsZW1lbnQgKHRoZSBhcnRib2FyZClcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcblxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1gnKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3gnXVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1knKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3knXVxuXG4gICAgICAgICAgcHJvcGVydHlHcm91cCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHByZWZpeDogbmFtZVBhcnRzWzBdLFxuICAgICAgICAgICAgc3VmZml4OiBuYW1lUGFydHNbMV0sXG4gICAgICAgICAgICBmYWxsYmFjazogZG9tRmFsbGJhY2tzW3Byb3BlcnR5TmFtZV0sXG4gICAgICAgICAgICB0eXBlZGVmOiBkb21TY2hlbWFbcHJvcGVydHlOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAgIGxldCBuYW1lUGFydHMgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BlcnR5R3JvdXApIHtcbiAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBDTFVTVEVSRURfUFJPUFNbcHJvcGVydHlHcm91cC5uYW1lXVxuICAgICAgICBpZiAoY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgIHByb3BlcnR5R3JvdXAuY2x1c3RlciA9IHtcbiAgICAgICAgICAgIHByZWZpeDogY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgIG5hbWU6IENMVVNURVJfTkFNRVNbY2x1c3RlclByZWZpeF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhZGRyZXNzYWJsZXMucHVzaChwcm9wZXJ0eUdyb3VwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==