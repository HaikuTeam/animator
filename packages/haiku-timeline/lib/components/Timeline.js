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

      return false;

      //  for reference: this.executeBytecodeActionMoveSegmentEndpoints(componentId, this.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destM

      // for reference:
      // activeKeyframes.push({
      //         id: componentId + '-' + propertyName + '-' + curr.index, propertyName,
      //         index: curr.index,
      //         ms: curr.ms,
      //         handle,
      //         componentId,
      //         propertyName
      //       })

      // Taylor Change Note (8.10.17): rather than pulling these in from the method call, I'm just grabbing them here:

      var frameInfo = this.getFrameInfo();
      // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
      console.log(this.state.activeKeyframes);

      this.state.activeKeyframes.forEach(function (k) {

        // console.log('oldmove', [
        //   this.state.reifiedBytecode,
        //   componentId,
        //   timelineName,
        //   propertyName,
        //   handle,
        //   keyframeIndex,
        //   startMs,
        //   endMs
        // ])
        // console.log('newmove', [this.state.reifiedBytecode,
        //   k.componentId,
        //   this.state.currentTimelineName,
        //   k.propertyName,
        //   k.handle,
        //   k.index,
        //   k.ms,
        //   endMs
        // ])

        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this6.state.reifiedBytecode, k.componentId, _this6.state.currentTimelineName, k.propertyName, k.handle, k.index, k.ms, endMs, frameInfo);

        // after moving all activeKeyframes, make sure we set the new curr ms on each of them
        // console.log('pre state', this.state.activeKeyframes)

        var activeKeyframes = _this6.state.activeKeyframes;
        var keyframe = _lodash2.default.find(activeKeyframes, { id: k.id });

        // these two should be same, but they're not :(
        console.log('keyframe.ms', keyframe.ms);
        console.log('startMs', startMs);

        /* startMs isn't getting far enough along next time it comes in.
        the keyframe.ms which is set by the previous endMs is too far ahead
         what i really need to know is what's the difference of the previous drag (of the one I'm dragging)
        then I can apply this to its own next starting place (keyframe.ms),
        but also to the starting value of all the others in the drag collection
        */

        // these two should be same, but they're not :(
        console.log('endMs', endMs);
        console.log('beginning_keyframe.ms+ end - start', keyframe.ms + endMs - startMs);

        keyframe.ms = keyframe.ms + endMs - startMs; // ought to use this, but doesn't work yet
        keyframe.ms = endMs;

        // console.log('adjusted ms', keyframe.ms)

        _this6.setState({ activeKeyframes: activeKeyframes }, function () {
          // console.log('post state', this.state.activeKeyframes
        });
        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
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

      // let keyframeMoves = BytecodeActions.moveSegmentEndpoints(this.state.reifiedBytecode, componentId, timelineName, propertyName, handle, keyframeIndex, startMs, endMs, frameInfo)

      // // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
      // if (Object.keys(keyframeMoves).length > 0) {
      //   this.setState({
      //     reifiedBytecode: this.state.reifiedBytecode,
      //     serializedBytecode: this._component.getSerializedBytecode()
      //   })

      //   // It's very heavy to transmit a websocket message for every single movement while updating the ui,
      //   // so the values are accumulated and sent via a single batched update.
      //   if (!this._keyframeMoves) this._keyframeMoves = {}
      //   let movementKey = [componentId, timelineName, propertyName].join('-')
      //   this._keyframeMoves[movementKey] = { componentId, timelineName, propertyName, keyframeMoves, frameInfo }
      //   this.debouncedKeyframeMoveAction()
      // }
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
            lineNumber: 1576
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
            lineNumber: 1581
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
            lineNumber: 1649
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
            lineNumber: 1672
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
            lineNumber: 1712
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
            lineNumber: 1758
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
              lineNumber: 1770
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1778
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
            activeKeyframes[(componentId + '-' + propertyName + '-' + curr.index, componentId)] = {};
            activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              index: curr.index,
              ms: curr.ms,
              handle: 'body'
            };
            activeKeyframes[componentId + '-' + propertyName + '-' + (curr.index + 1)] = {
              id: componentId + '-' + propertyName + '-' + (curr.index + 1),
              componentId: componentId,
              propertyName: propertyName,
              index: curr.index,
              ms: curr.ms,
              handle: 'body'
            };
            _this18.setState({ activeKeyframes: activeKeyframes });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1802
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
              lineNumber: 1850
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
              lineNumber: 1901
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
              lineNumber: 1917
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
                lineNumber: 1934
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
                  lineNumber: 1944
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1952
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
                lineNumber: 1962
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1971
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
                lineNumber: 1989
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
                  lineNumber: 2000
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2010
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
            lineNumber: 2030
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
            lineNumber: 2069
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
              lineNumber: 2112
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
                  lineNumber: 2128
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2129
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
                  lineNumber: 2138
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2139
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
                  lineNumber: 2144
                },
                __self: _this21
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2145
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
            lineNumber: 2156
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2158
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
            lineNumber: 2171
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2190
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
                lineNumber: 2191
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
                lineNumber: 2204
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
                lineNumber: 2214
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
              lineNumber: 2226
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
              lineNumber: 2249
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2268
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
                lineNumber: 2269
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
                lineNumber: 2282
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2296
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
            lineNumber: 2303
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
              lineNumber: 2316
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
                lineNumber: 2325
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2337
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2339
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
                    lineNumber: 2340
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
                lineNumber: 2344
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2359
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2361
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
                    lineNumber: 2362
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
                  lineNumber: 2365
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
                lineNumber: 2367
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2384
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2385
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2386
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2388
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
                  lineNumber: 2390
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2391
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2392
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2393
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
              lineNumber: 2400
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
            lineNumber: 2437
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
              lineNumber: 2447
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
                lineNumber: 2471
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
                  lineNumber: 2481
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2486
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
                  lineNumber: 2488
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2493
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
              lineNumber: 2497
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
              lineNumber: 2498
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
            lineNumber: 2513
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
            lineNumber: 2540
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2543
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
              lineNumber: 2544
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2555
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2556
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
              lineNumber: 2558
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
            lineNumber: 2573
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
            lineNumber: 2600
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
              lineNumber: 2608
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2616
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
                  lineNumber: 2617
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2622
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2622
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2623
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2623
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
              lineNumber: 2629
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
            lineNumber: 2644
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
              lineNumber: 2654
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
                lineNumber: 2666
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2676
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2676
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
              lineNumber: 2681
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
                lineNumber: 2690
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
                  lineNumber: 2703
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
              lineNumber: 2717
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
              lineNumber: 2726
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
              lineNumber: 2741
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
            lineNumber: 2792
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2823
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
              lineNumber: 2825
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
                lineNumber: 2833
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2840
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2840
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
                lineNumber: 2842
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
                  lineNumber: 2852
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
              lineNumber: 2861
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
              lineNumber: 2870
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
              lineNumber: 2884
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
          lineNumber: 2915
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
            lineNumber: 2918
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
            lineNumber: 2940
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
            lineNumber: 2956
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
              lineNumber: 2967
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
            lineNumber: 2987
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwibXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUiLCJoYW5kbGUiLCJrZXlmcmFtZUluZGV4IiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMiLCJfdGltZWxpbmVzIiwidXBkYXRlVGltZSIsImZyaU1heCIsImdldEN1cnJlbnRUaW1lbGluZSIsInNlZWtBbmRQYXVzZSIsImZyaUIiLCJmcmlBIiwidHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsImVycm9yIiwibmF0aXZlRXZlbnQiLCJyZWZzIiwiZXhwcmVzc2lvbklucHV0Iiwid2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50Iiwia2V5Q29kZSIsInRvZ2dsZVBsYXliYWNrIiwid2hpY2giLCJ1cGRhdGVTY3J1YmJlclBvc2l0aW9uIiwidXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UiLCJpc0VtcHR5IiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImtleWZyYW1lcyIsImVhY2giLCJrIiwiZGVsZXRlS2V5ZnJhbWUiLCJjaGFuZ2VTZWdtZW50Q3VydmUiLCJvbGRTdGFydE1zIiwib2xkRW5kTXMiLCJuZXdTdGFydE1zIiwibmV3RW5kTXMiLCJjaGFuZ2VTZWdtZW50RW5kcG9pbnRzIiwib2xkVGltZWxpbmVOYW1lIiwibmV3VGltZWxpbmVOYW1lIiwicmVuYW1lVGltZWxpbmUiLCJjcmVhdGVUaW1lbGluZSIsImR1cGxpY2F0ZVRpbWVsaW5lIiwiZGVsZXRlVGltZWxpbmUiLCJsb2ciLCJrZXlmcmFtZU1vdmVzIiwibW92ZVNlZ21lbnRFbmRwb2ludHMiLCJrZXlmcmFtZSIsImZpbmQiLCJpZCIsIl9rZXlmcmFtZU1vdmVzIiwibW92ZW1lbnRLZXkiLCJqb2luIiwia2V5ZnJhbWVNb3Zlc0ZvcldpcmUiLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJfX2lzSGlkZGVuIiwiZm91bmQiLCJzZWxlY3ROb2RlIiwic2Nyb2xsVG9Ob2RlIiwiZmluZE5vZGVzQnlDb21wb25lbnRJZCIsImRlc2VsZWN0Tm9kZSIsImNvbGxhcHNlTm9kZSIsInNjcm9sbFRvVG9wIiwicHJvcGVydHlOYW1lcyIsInJlbGF0ZWRFbGVtZW50IiwiZmluZEVsZW1lbnRJblRlbXBsYXRlIiwid2FybiIsImFsbFJvd3MiLCJpbmRleE9mIiwiYWN0aXZhdGVSb3ciLCJkZWFjdGl2YXRlUm93IiwibG9jYXRvciIsInNpYmxpbmdzIiwiaXRlcmF0ZWUiLCJtYXBwZWRPdXRwdXQiLCJsZWZ0RnJhbWUiLCJyaWdodEZyYW1lIiwiZnJhbWVNb2R1bHVzIiwiaXRlcmF0aW9uSW5kZXgiLCJmcmFtZU51bWJlciIsInBpeGVsT2Zmc2V0TGVmdCIsIm1hcE91dHB1dCIsIm1zTW9kdWx1cyIsImxlZnRNcyIsInJpZ2h0TXMiLCJ0b3RhbE1zIiwiZmlyc3RNYXJrZXIiLCJtc01hcmtlclRtcCIsIm1zTWFya2VycyIsIm1zTWFya2VyIiwibXNSZW1haW5kZXIiLCJmbG9vciIsImZyYW1lT2Zmc2V0IiwicHhPZmZzZXQiLCJmcHMiLCJtYXhtcyIsIm1heGYiLCJmcmlXIiwiYWJzIiwicFNjcnhwZiIsInB4QSIsInB4QiIsInB4TWF4MiIsIm1zQSIsIm1zQiIsInNjTCIsInNjQSIsInNjQiIsImFyY2h5Rm9ybWF0IiwiZ2V0QXJjaHlGb3JtYXROb2RlcyIsImFyY2h5U3RyIiwibGFiZWwiLCJub2RlcyIsImZpbHRlciIsIm1hcCIsImFzY2lpU3ltYm9scyIsImdldEFzY2lpVHJlZSIsInNwbGl0IiwiY29tcG9uZW50Um93cyIsImFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUiLCJ2aXNpdG9ySXRlcmF0aW9ucyIsImlzQ29tcG9uZW50Iiwic291cmNlIiwiYXNjaWlCcmFuY2giLCJoZWFkaW5nUm93IiwicHJvcGVydHlSb3dzIiwiX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzIiwiX2J1aWxkRE9NQWRkcmVzc2FibGVzIiwiY2x1c3RlckhlYWRpbmdzRm91bmQiLCJwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciIsInByb3BlcnR5Um93IiwiY2x1c3RlciIsImNsdXN0ZXJQcmVmaXgiLCJwcmVmaXgiLCJjbHVzdGVyS2V5IiwiaXNDbHVzdGVySGVhZGluZyIsImlzQ2x1c3Rlck1lbWJlciIsImNsdXN0ZXJTZXQiLCJqIiwibmV4dEluZGV4IiwibmV4dERlc2NyaXB0b3IiLCJjbHVzdGVyTmFtZSIsImlzQ2x1c3RlciIsIml0ZW1zIiwiX2luZGV4IiwiX2l0ZW1zIiwic2VnbWVudE91dHB1dHMiLCJ2YWx1ZUdyb3VwIiwiZ2V0VmFsdWVHcm91cCIsImtleWZyYW1lc0xpc3QiLCJrZXlmcmFtZUtleSIsInBhcnNlSW50Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsImZyYW1lIiwidmFsdWUiLCJjdXJ2ZSIsInB4T2Zmc2V0TGVmdCIsInB4T2Zmc2V0UmlnaHQiLCJzZWdtZW50T3V0cHV0IiwicHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlPdXRwdXRzIiwibWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsImNvbmNhdCIsInBvc2l0aW9uIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJ0aW1lbGluZXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSIsInNldFRpbWVsaW5lTmFtZSIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsImN0eE1lbnVFdmVudCIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJEQVJLRVJfR1JBWSIsImFsbEl0ZW1zIiwiaXNBY3RpdmF0ZWQiLCJpc1Jvd0FjdGl2YXRlZCIsInJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciIsIm1hcFZpc2libGVGcmFtZXMiLCJwaXhlbHNQZXJGcmFtZSIsInBvaW50ZXJFdmVudHMiLCJmb250V2VpZ2h0IiwibWFwVmlzaWJsZVRpbWVzIiwibWlsbGlzZWNvbmRzTnVtYmVyIiwidG90YWxNaWxsaXNlY29uZHMiLCJndWlkZUhlaWdodCIsImNsaWVudEhlaWdodCIsImJvcmRlckxlZnQiLCJDT0FMIiwiZnJhQiIsInNoYWZ0SGVpZ2h0IiwiY2hhbmdlU2NydWJiZXJQb3NpdGlvbiIsImJveFNoYWRvdyIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIiwiYm9yZGVyVG9wUmlnaHRSYWRpdXMiLCJib3JkZXJCb3R0b21SaWdodFJhZGl1cyIsIm1vdXNlRXZlbnRzIiwiRkFUSEVSX0NPQUwiLCJ2ZXJ0aWNhbEFsaWduIiwiZm9udFNpemUiLCJib3JkZXJCb3R0b20iLCJmbG9hdCIsIm1pbldpZHRoIiwidGV4dEFsaWduIiwicGFkZGluZ1JpZ2h0IiwicGFkZGluZyIsIlJPQ0tfTVVURUQiLCJmb250U3R5bGUiLCJtYXJnaW5Ub3AiLCJ0b2dnbGVUaW1lRGlzcGxheU1vZGUiLCJtYXJnaW5SaWdodCIsImNsaWNrRXZlbnQiLCJsZWZ0WCIsImZyYW1lWCIsIm5ld0ZyYW1lIiwicmVuZGVyRnJhbWVHcmlkIiwicmVuZGVyR2F1Z2UiLCJyZW5kZXJTY3J1YmJlciIsInJlbmRlckR1cmF0aW9uTW9kaWZpZXIiLCJrbm9iUmFkaXVzIiwiY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UiLCJMSUdIVEVTVF9HUkFZIiwiYm90dG9tIiwicmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciIsInJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyIsIkdSQVlfRklUMSIsIm1hcmdpbkxlZnQiLCJ0YWJsZUxheW91dCIsIkxJR0hUX0dSQVkiLCJvcGFjaXR5IiwicmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyIsInJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsInByb3BlcnR5T25MYXN0Q29tcG9uZW50IiwiaHVtYW5OYW1lIiwidGV4dFRyYW5zZm9ybSIsImxpbmVIZWlnaHQiLCJyZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJyZW5kZXJDbHVzdGVyUm93IiwicmVuZGVyUHJvcGVydHlSb3ciLCJyZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IiwiZ2V0Q29tcG9uZW50Um93c0RhdGEiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJyZW5kZXJUb3BDb250cm9scyIsInJlbmRlckNvbXBvbmVudFJvd3MiLCJyZW5kZXJCb3R0b21Db250cm9scyIsImNvbW1pdHRlZFZhbHVlIiwiSlNPTiIsInN0cmluZ2lmeSIsIm5hdkRpciIsImRvRm9jdXMiLCJDb21wb25lbnQiLCJhZGRyZXNzYWJsZXMiLCJzdGF0ZXMiLCJzdWZmaXgiLCJmYWxsYmFjayIsInR5cGVkZWYiLCJkb21TY2hlbWEiLCJkb21GYWxsYmFja3MiLCJwcm9wZXJ0eUdyb3VwIiwibmFtZVBhcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBRUE7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Q29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IHt9LFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuLyoqXG4gKiBIZXkhIElmIHlvdSB3YW50IHRvIEFERCBhbnkgcHJvcGVydGllcyBoZXJlLCB5b3UgbWlnaHQgYWxzbyBuZWVkIHRvIHVwZGF0ZSB0aGUgZGljdGlvbmFyeSBpblxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSxcbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MsXG4gKiBvciB0aGV5IG1pZ2h0IG5vdCBzaG93IHVwIGluIHRoZSB2aWV3LlxuICovXG5cbmNvbnN0IEFMTE9XRURfUFJPUFMgPSB7XG4gICd0cmFuc2xhdGlvbi54JzogdHJ1ZSxcbiAgJ3RyYW5zbGF0aW9uLnknOiB0cnVlLFxuICAvLyAndHJhbnNsYXRpb24ueic6IHRydWUsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLnonOiB0cnVlLFxuICAncm90YXRpb24ueCc6IHRydWUsXG4gICdyb3RhdGlvbi55JzogdHJ1ZSxcbiAgJ3NjYWxlLngnOiB0cnVlLFxuICAnc2NhbGUueSc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgLy8gJ3Nob3duJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWVcbiAgLy8gJ2NvbG9yJzogdHJ1ZSxcbiAgLy8gJ2ZpbGwnOiB0cnVlLFxuICAvLyAnc3Ryb2tlJzogdHJ1ZVxufVxuXG5jb25zdCBDTFVTVEVSRURfUFJPUFMgPSB7XG4gICdtb3VudC54JzogJ21vdW50JyxcbiAgJ21vdW50LnknOiAnbW91bnQnLFxuICAnbW91bnQueic6ICdtb3VudCcsXG4gICdhbGlnbi54JzogJ2FsaWduJyxcbiAgJ2FsaWduLnknOiAnYWxpZ24nLFxuICAnYWxpZ24ueic6ICdhbGlnbicsXG4gICdvcmlnaW4ueCc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnknOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi56JzogJ29yaWdpbicsXG4gICd0cmFuc2xhdGlvbi54JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueic6ICd0cmFuc2xhdGlvbicsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLngnOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueSc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi56JzogJ3JvdGF0aW9uJyxcbiAgLy8gJ3JvdGF0aW9uLncnOiAncm90YXRpb24nLCAvLyBQcm9iYWJseSBlYXNpZXN0IG5vdCB0byBsZXQgdGhlIHVzZXIgaGF2ZSBjb250cm9sIG92ZXIgcXVhdGVybmlvbiBtYXRoXG4gICdzY2FsZS54JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnknOiAnc2NhbGUnLFxuICAnc2NhbGUueic6ICdzY2FsZScsXG4gICdzaXplTW9kZS54JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnknOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueic6ICdzaXplTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsLngnOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnknOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnonOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLngnOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnknOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnonOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplQWJzb2x1dGUueCc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnknOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS56JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnb3ZlcmZsb3cnLFxuICAnc3R5bGUub3ZlcmZsb3dZJzogJ292ZXJmbG93J1xufVxuXG5jb25zdCBDTFVTVEVSX05BTUVTID0ge1xuICAnbW91bnQnOiAnTW91bnQnLFxuICAnYWxpZ24nOiAnQWxpZ24nLFxuICAnb3JpZ2luJzogJ09yaWdpbicsXG4gICd0cmFuc2xhdGlvbic6ICdQb3NpdGlvbicsXG4gICdyb3RhdGlvbic6ICdSb3RhdGlvbicsXG4gICdzY2FsZSc6ICdTY2FsZScsXG4gICdzaXplTW9kZSc6ICdTaXppbmcgTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsJzogJ1NpemUgJScsXG4gICdzaXplRGlmZmVyZW50aWFsJzogJ1NpemUgKy8tJyxcbiAgJ3NpemVBYnNvbHV0ZSc6ICdTaXplJyxcbiAgJ292ZXJmbG93JzogJ092ZXJmbG93J1xufVxuXG5jb25zdCBBTExPV0VEX1BST1BTX1RPUF9MRVZFTCA9IHtcbiAgJ3NpemVBYnNvbHV0ZS54JzogdHJ1ZSxcbiAgJ3NpemVBYnNvbHV0ZS55JzogdHJ1ZSxcbiAgLy8gRW5hYmxlIHRoZXNlIGFzIHN1Y2ggYSB0aW1lIGFzIHdlIGNhbiByZXByZXNlbnQgdGhlbSB2aXN1YWxseSBpbiB0aGUgZ2xhc3NcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WCc6IHRydWUsXG4gIC8vICdzdHlsZS5vdmVyZmxvd1knOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlXG59XG5cbmNvbnN0IEFMTE9XRURfVEFHTkFNRVMgPSB7XG4gIGRpdjogdHJ1ZSxcbiAgc3ZnOiB0cnVlLFxuICBnOiB0cnVlLFxuICByZWN0OiB0cnVlLFxuICBjaXJjbGU6IHRydWUsXG4gIGVsbGlwc2U6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHBvbHlsaW5lOiB0cnVlLFxuICBwb2x5Z29uOiB0cnVlXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKHtjb21wb25lbnRJZDoge2NvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUsIG1zOiBzdGFydE1zfX0sIHRpbWVsaW5lTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSA4OiAvLyBkZWxldGVcbiAgICAgICAgaWYgKCFsb2Rhc2guaXNFbXB0eSh0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lcykpIHtcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKG5hdGl2ZUV2ZW50KSB7XG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIC8vIGNhc2UgMzc6IC8vbGVmdFxuICAgICAgLy8gY2FzZSAzOTogLy9yaWdodFxuICAgICAgLy8gY2FzZSAzODogLy91cFxuICAgICAgLy8gY2FzZSA0MDogLy9kb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVLZXlib2FyZFN0YXRlICh1cGRhdGVzKSB7XG4gICAgLy8gSWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGRvbid0IGFsbG93IGtleWJvYXJkIHN0YXRlIGNoYW5nZXMgdG8gY2F1c2UgYSByZS1yZW5kZXIsIG90aGVyd2lzZVxuICAgIC8vIHRoZSBpbnB1dCBmaWVsZCB3aWxsIHN3aXRjaCBiYWNrIHRvIGl0cyBwcmV2aW91cyBjb250ZW50cyAoZS5nLiB3aGVuIGhvbGRpbmcgZG93biAnc2hpZnQnKVxuICAgIGlmICghdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHVwZGF0ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICAgIHRoaXMuc3RhdGVba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVtaXR0ZXJMaXN0ZW5lciAoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChbZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcl0pXG4gICAgZXZlbnRFbWl0dGVyLm9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxuICB9XG5cbiAgLypcbiAgICogc2V0dGVycy91cGRhdGVyc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBkZXNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IHRydWVcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAwXG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9Ob2RlIChub2RlKSB7XG4gICAgdmFyIHJvd3NEYXRhID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIHZhciBmb3VuZEluZGV4ID0gbnVsbFxuICAgIHZhciBpbmRleENvdW50ZXIgPSAwXG4gICAgcm93c0RhdGEuZm9yRWFjaCgocm93SW5mbywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzSGVhZGluZykge1xuICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgfSBlbHNlIGlmIChyb3dJbmZvLmlzUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXhDb3VudGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmb3VuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gKGZvdW5kSW5kZXggKiB0aGlzLnN0YXRlLnJvd0hlaWdodCkgLSB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREb21Ob2RlT2Zmc2V0WSAoZG9tTm9kZSkge1xuICAgIHZhciBjdXJ0b3AgPSAwXG4gICAgaWYgKGRvbU5vZGUub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIGN1cnRvcCArPSBkb21Ob2RlLm9mZnNldFRvcFxuICAgICAgfSB3aGlsZSAoZG9tTm9kZSA9IGRvbU5vZGUub2Zmc2V0UGFyZW50KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuICAgIHJldHVybiBjdXJ0b3BcbiAgfVxuXG4gIGNvbGxhcHNlTm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICB2aXNpdChub2RlLCAoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgICBjaGlsZC5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBsZXQgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGV4cGFuZE5vZGUgKG5vZGUsIGNvbXBvbmVudElkKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKG5vZGUucGFyZW50KSB0aGlzLmV4cGFuZE5vZGUobm9kZS5wYXJlbnQpIC8vIElmIHdlIGFyZSBleHBhbmRlZCwgb3VyIHBhcmVudCBoYXMgdG8gYmUgdG9vXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpc1Jvd0FjdGl2YXRlZCAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV1cbiAgICB9XG4gIH1cblxuICBpc0NsdXN0ZXJBY3RpdmF0ZWQgKGl0ZW0pIHtcbiAgICByZXR1cm4gZmFsc2UgLy8gVE9ET1xuICB9XG5cbiAgdG9nZ2xlVGltZURpc3BsYXlNb2RlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdzZWNvbmRzJ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVCYXNlbGluZSA9IHRoaXMuc3RhdGUuZnJhbWVCYXNlbGluZVxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICB2YXIgY3VycmVudEZyYW1lID0gZnJhbWVCYXNlbGluZSArIGZyYW1lRGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlCKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLmR1cmF0aW9uRHJhZ1N0YXJ0XG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIGlmIChkcmFnRGVsdGEgPiAwICYmIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltID49IDApIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkge1xuICAgICAgICB2YXIgYWRkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyAyMH0pXG4gICAgICAgIH0sIDMwMClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkSW50ZXJ2YWw6IGFkZEludGVydmFsfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdJc0FkZGluZzogdHJ1ZX0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAvLyBEb24ndCBsZXQgdXNlciBkcmFnIGJhY2sgcGFzdCBsYXN0IGZyYW1lOyBhbmQgZG9uJ3QgbGV0IHRoZW0gZHJhZyBtb3JlIHRoYW4gYW4gZW50aXJlIHdpZHRoIG9mIGZyYW1lc1xuICAgIGlmIChmcmFtZUluZm8uZnJpQiArIGZyYW1lRGVsdGEgPD0gZnJhbWVJbmZvLmZyaU1heCB8fCAtZnJhbWVEZWx0YSA+PSBmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICBmcmFtZURlbHRhID0gdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gLy8gVG9kbzogbWFrZSBtb3JlIHByZWNpc2Ugc28gaXQgcmVtb3ZlcyBhcyBtYW55IGZyYW1lcyBhc1xuICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGNhbiBpbnN0ZWFkIG9mIGNvbXBsZXRlbHkgaWdub3JpbmcgdGhlIGRyYWdcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uVHJpbTogZnJhbWVEZWx0YSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGwgfSlcbiAgfVxuXG4gIGNoYW5nZVZpc2libGVGcmFtZVJhbmdlICh4bCwgeHIsIGZyYW1lSW5mbykge1xuICAgIGxldCBhYnNMID0gbnVsbFxuICAgIGxldCBhYnNSID0gbnVsbFxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNMID0geGxcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgYWJzUiA9IHhyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydCkge1xuICAgICAgY29uc3Qgb2Zmc2V0TCA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhclN0YXJ0ICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IG9mZnNldFIgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJFbmQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3QgZGlmZlggPSB4bCAtIHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0XG4gICAgICBhYnNMID0gb2Zmc2V0TCArIGRpZmZYXG4gICAgICBhYnNSID0gb2Zmc2V0UiArIGRpZmZYXG4gICAgfVxuXG4gICAgbGV0IGZMID0gKGFic0wgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzTCAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICBsZXQgZlIgPSAoYWJzUiAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNSICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIGxlZnQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmTCA8PSBmcmFtZUluZm8uZnJpMCkge1xuICAgICAgZkwgPSBmcmFtZUluZm8uZnJpMFxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAtICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC0gZkwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIHJpZ2h0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZlIgPj0gZnJhbWVJbmZvLmZyaU1heDIpIHtcbiAgICAgIGZMID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtmTCwgZlJdIH0pXG4gIH1cblxuICB1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSAoZGVsdGEpIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gKyBkZWx0YVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSArIGRlbHRhXG4gICAgaWYgKGwgPj0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbCwgcl0gfSlcbiAgICB9XG4gIH1cblxuICAvLyB3aWxsIGxlZnQtYWxpZ24gdGhlIGN1cnJlbnQgdGltZWxpbmUgd2luZG93IChtYWludGFpbmluZyB6b29tKVxuICB0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UgKGZyYW1lSW5mbykge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuICAgIHZhciBzcGFuID0gciAtIGxcbiAgICB2YXIgbmV3TCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lXG4gICAgdmFyIG5ld1IgPSBuZXdMICsgc3BhblxuXG4gICAgaWYgKG5ld1IgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICBuZXdMIC09IChuZXdSIC0gZnJhbWVJbmZvLmZyaU1heClcbiAgICAgIG5ld1IgPSBmcmFtZUluZm8uZnJpTWF4XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbmV3TCwgbmV3Ul0gfSlcbiAgfVxuXG4gIHVwZGF0ZVNjcnViYmVyUG9zaXRpb24gKGRlbHRhKSB7XG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICsgZGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDw9IDApIGN1cnJlbnRGcmFtZSA9IDBcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlKSB7XG4gICAgLy8gTm90ZSB0aGF0IGlmIHN0YXJ0VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBleGFtaW5lZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBwcmVzZW50IG9uZVxuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ2hvc3RJbnN0YW5jZScpLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm8gbmVlZCB0byAnZXhwcmVzc2lvblRvUk8nIGhlcmUgYmVjYXVzZSBpZiB3ZSBnb3QgYW4gZXhwcmVzc2lvbiwgdGhhdCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwcm92aWRlZCBpbiBpdHMgc2VyaWFsaXplZCBfX2Z1bmN0aW9uIGZvcm1cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZV0sICgpID0+IHt9KVxuXG4gICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5zcGxpdFNlZ21lbnQodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NwbGl0U2VnbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdqb2luS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIChrZXlmcmFtZXMsIHRpbWVsaW5lTmFtZSkge1xuICAgIGxvZGFzaC5lYWNoKGtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgay5jb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBrLnByb3BlcnR5TmFtZSwgay5tcylcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9KVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2suY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGsucHJvcGVydHlOYW1lLCBrLm1zXSwgKCkgPT4ge30pXG4gICAgfSlcbiAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXlmcmFtZXM6IHt9fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEN1cnZlKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRFbmRwb2ludHMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIChvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5yZW5hbWVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3JlbmFtZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm90ZTogV2UgbWF5IG5lZWQgdG8gcmVtZW1iZXIgdG8gc2VyaWFsaXplIGEgdGltZWxpbmUgZGVzY3JpcHRvciBoZXJlXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmR1cGxpY2F0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2R1cGxpY2F0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykge1xuICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICAvLyAgZm9yIHJlZmVyZW5jZTogdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1cblxuICAgIC8vIGZvciByZWZlcmVuY2U6XG4gICAgLy8gYWN0aXZlS2V5ZnJhbWVzLnB1c2goe1xuICAgIC8vICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgcHJvcGVydHlOYW1lLFxuICAgIC8vICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgLy8gICAgICAgICBtczogY3Vyci5tcyxcbiAgICAvLyAgICAgICAgIGhhbmRsZSxcbiAgICAvLyAgICAgICAgIGNvbXBvbmVudElkLFxuICAgIC8vICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgLy8gICAgICAgfSlcblxuICAgIC8vIFRheWxvciBDaGFuZ2UgTm90ZSAoOC4xMC4xNyk6IHJhdGhlciB0aGFuIHB1bGxpbmcgdGhlc2UgaW4gZnJvbSB0aGUgbWV0aG9kIGNhbGwsIEknbSBqdXN0IGdyYWJiaW5nIHRoZW0gaGVyZTpcblxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzKVxuXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnb2xkbW92ZScsIFtcbiAgICAgIC8vICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAvLyAgIGNvbXBvbmVudElkLFxuICAgICAgLy8gICB0aW1lbGluZU5hbWUsXG4gICAgICAvLyAgIHByb3BlcnR5TmFtZSxcbiAgICAgIC8vICAgaGFuZGxlLFxuICAgICAgLy8gICBrZXlmcmFtZUluZGV4LFxuICAgICAgLy8gICBzdGFydE1zLFxuICAgICAgLy8gICBlbmRNc1xuICAgICAgLy8gXSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKCduZXdtb3ZlJywgW3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgLy8gICBrLmNvbXBvbmVudElkLFxuICAgICAgLy8gICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAvLyAgIGsucHJvcGVydHlOYW1lLFxuICAgICAgLy8gICBrLmhhbmRsZSxcbiAgICAgIC8vICAgay5pbmRleCxcbiAgICAgIC8vICAgay5tcyxcbiAgICAgIC8vICAgZW5kTXNcbiAgICAgIC8vIF0pXG5cbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKFxuICAgICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgay5jb21wb25lbnRJZCxcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICBrLnByb3BlcnR5TmFtZSxcbiAgICAgICAgay5oYW5kbGUsXG4gICAgICAgIGsuaW5kZXgsXG4gICAgICAgIGsubXMsXG4gICAgICAgIGVuZE1zLFxuICAgICAgICBmcmFtZUluZm9cbiAgICAgIClcblxuICAgICAgLy8gYWZ0ZXIgbW92aW5nIGFsbCBhY3RpdmVLZXlmcmFtZXMsIG1ha2Ugc3VyZSB3ZSBzZXQgdGhlIG5ldyBjdXJyIG1zIG9uIGVhY2ggb2YgdGhlbVxuICAgICAgLy8gY29uc29sZS5sb2coJ3ByZSBzdGF0ZScsIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzKVxuXG4gICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgIGNvbnN0IGtleWZyYW1lID0gbG9kYXNoLmZpbmQoYWN0aXZlS2V5ZnJhbWVzLCB7IGlkOiBrLmlkIH0pXG5cbiAgICAgIC8vIHRoZXNlIHR3byBzaG91bGQgYmUgc2FtZSwgYnV0IHRoZXkncmUgbm90IDooXG4gICAgICBjb25zb2xlLmxvZygna2V5ZnJhbWUubXMnLCBrZXlmcmFtZS5tcylcbiAgICAgIGNvbnNvbGUubG9nKCdzdGFydE1zJywgc3RhcnRNcylcblxuICAgICAgLyogc3RhcnRNcyBpc24ndCBnZXR0aW5nIGZhciBlbm91Z2ggYWxvbmcgbmV4dCB0aW1lIGl0IGNvbWVzIGluLlxuICAgICAgdGhlIGtleWZyYW1lLm1zIHdoaWNoIGlzIHNldCBieSB0aGUgcHJldmlvdXMgZW5kTXMgaXMgdG9vIGZhciBhaGVhZFxuXG4gICAgICB3aGF0IGkgcmVhbGx5IG5lZWQgdG8ga25vdyBpcyB3aGF0J3MgdGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHByZXZpb3VzIGRyYWcgKG9mIHRoZSBvbmUgSSdtIGRyYWdnaW5nKVxuICAgICAgdGhlbiBJIGNhbiBhcHBseSB0aGlzIHRvIGl0cyBvd24gbmV4dCBzdGFydGluZyBwbGFjZSAoa2V5ZnJhbWUubXMpLFxuICAgICAgYnV0IGFsc28gdG8gdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIGFsbCB0aGUgb3RoZXJzIGluIHRoZSBkcmFnIGNvbGxlY3Rpb25cblxuICAgICovXG5cbiAgICAgIC8vIHRoZXNlIHR3byBzaG91bGQgYmUgc2FtZSwgYnV0IHRoZXkncmUgbm90IDooXG4gICAgICBjb25zb2xlLmxvZygnZW5kTXMnLCBlbmRNcylcbiAgICAgIGNvbnNvbGUubG9nKCdiZWdpbm5pbmdfa2V5ZnJhbWUubXMrIGVuZCAtIHN0YXJ0Jywga2V5ZnJhbWUubXMrIGVuZE1zIC0gc3RhcnRNcylcblxuICAgICAga2V5ZnJhbWUubXMgPSBrZXlmcmFtZS5tcysgZW5kTXMgLSBzdGFydE1zIC8vIG91Z2h0IHRvIHVzZSB0aGlzLCBidXQgZG9lc24ndCB3b3JrIHlldFxuICAgICAga2V5ZnJhbWUubXMgPSBlbmRNc1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnYWRqdXN0ZWQgbXMnLCBrZXlmcmFtZS5tcylcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5ZnJhbWVzfSwgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncG9zdCBzdGF0ZScsIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgIH0pXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgICAgfVxuICAgIH0pXG5cblxuICAgIC8vIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMsIGZyYW1lSW5mbylcblxuICAgIC8vIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgLy8gaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgIC8vICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIC8vICAgfSlcblxuICAgIC8vICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgLy8gICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgLy8gICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgIC8vICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgLy8gICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgIC8vICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgIC8vIH1cblxuICB9XG5cbiAgZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHJldHVybiB2b2lkICgwKVxuICAgIGZvciAobGV0IG1vdmVtZW50S2V5IGluIHRoaXMuX2tleWZyYW1lTW92ZXMpIHtcbiAgICAgIGlmICghbW92ZW1lbnRLZXkpIGNvbnRpbnVlXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldKSBjb250aW51ZVxuICAgICAgbGV0IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfSA9IHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgZnVuY3Rpb25zIGdldCBjb252ZXJ0ZWQgaW50byB0aGVpciBzZXJpYWwgZm9ybSBiZWZvcmUgcGFzc2luZyBvdmVyIHRoZSB3aXJlXG4gICAgICBsZXQga2V5ZnJhbWVNb3Zlc0ZvcldpcmUgPSBleHByZXNzaW9uVG9STyhrZXlmcmFtZU1vdmVzKVxuXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ21vdmVLZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzRm9yV2lyZSwgZnJhbWVJbmZvXSwgKCkgPT4ge30pXG4gICAgICBkZWxldGUgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cbiAgICB9XG4gIH1cblxuICB0b2dnbGVQbGF5YmFjayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IGZhbHNlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBsYXkoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZWh5ZHJhdGVCeXRlY29kZSAocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpIHtcbiAgICBpZiAocmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgICBpZiAocmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICAgIGlmICghaWQpIHJldHVybiB2b2lkICgwKVxuICAgICAgICAgIG5vZGUuX19pc1NlbGVjdGVkID0gISF0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzRXhwYW5kZWQgPSAhIXRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNIaWRkZW4gPSAhIXRoaXMuc3RhdGUuaGlkZGVuTm9kZXNbaWRdXG4gICAgICAgIH0pXG4gICAgICAgIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uU2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50KSA9PiB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuZXhwYW5kTm9kZShub2RlKVxuICAgICAgICB0aGlzLnNjcm9sbFRvTm9kZShub2RlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25VbnNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZE5vZGVzQnlDb21wb25lbnRJZChjb21wb25lbnRJZClcbiAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICB0aGlzLmRlc2VsZWN0Tm9kZShub2RlKVxuICAgICAgdGhpcy5jb2xsYXBzZU5vZGUobm9kZSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aobm9kZSlcbiAgICB9KVxuICB9XG5cbiAgZmluZE5vZGVzQnlDb21wb25lbnRJZCAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgZm91bmQgPSBbXVxuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgbWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgc3RhcnRNcywgcHJvcGVydHlOYW1lcykge1xuICAgIGxldCByZWxhdGVkRWxlbWVudCA9IHRoaXMuZmluZEVsZW1lbnRJblRlbXBsYXRlKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICBsZXQgZWxlbWVudE5hbWUgPSByZWxhdGVkRWxlbWVudCAmJiByZWxhdGVkRWxlbWVudC5lbGVtZW50TmFtZVxuICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIG1pc3NpbmcgZWxlbWVudCwgYW5kIHdpdGhvdXQgYW4gZWxlbWVudCBuYW1lIEkgY2Fubm90IHVwZGF0ZSBhIHByb3BlcnR5IHZhbHVlJylcbiAgICB9XG5cbiAgICB2YXIgYWxsUm93cyA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICBhbGxSb3dzLmZvckVhY2goKHJvd0luZm8pID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzUHJvcGVydHkgJiYgcm93SW5mby5jb21wb25lbnRJZCA9PT0gY29tcG9uZW50SWQgJiYgcHJvcGVydHlOYW1lcy5pbmRleE9mKHJvd0luZm8ucHJvcGVydHkubmFtZSkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBhY3RpdmF0ZWRSb3dzOiBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzKSxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgICogaXRlcmF0b3JzL3Zpc2l0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGZpbmRFbGVtZW50SW5UZW1wbGF0ZSAoY29tcG9uZW50SWQsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgbGV0IGZvdW5kXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kID0gbm9kZVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICB2aXNpdFRlbXBsYXRlIChsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLCBwYXJlbnQsIGl0ZXJhdGVlKSB7XG4gICAgaXRlcmF0ZWUodGVtcGxhdGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGVtcGxhdGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKCFjaGlsZCB8fCB0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBjb250aW51ZVxuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUobG9jYXRvciArICcuJyArIGksIGksIHRlbXBsYXRlLmNoaWxkcmVuLCBjaGlsZCwgdGVtcGxhdGUsIGl0ZXJhdGVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcFZpc2libGVGcmFtZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCByaWdodEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICBjb25zdCBmcmFtZU1vZHVsdXMgPSBnZXRGcmFtZU1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgbGV0IGl0ZXJhdGlvbkluZGV4ID0gLTFcbiAgICBmb3IgKGxldCBpID0gbGVmdEZyYW1lOyBpIDwgcmlnaHRGcmFtZTsgaSsrKSB7XG4gICAgICBpdGVyYXRpb25JbmRleCsrXG4gICAgICBsZXQgZnJhbWVOdW1iZXIgPSBpXG4gICAgICBsZXQgcGl4ZWxPZmZzZXRMZWZ0ID0gaXRlcmF0aW9uSW5kZXggKiBmcmFtZUluZm8ucHhwZlxuICAgICAgaWYgKHBpeGVsT2Zmc2V0TGVmdCA8PSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSB7XG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBmcmFtZUluZm8ucHhwZiwgZnJhbWVNb2R1bHVzKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSB7XG4gICAgICAgICAgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIG1hcFZpc2libGVUaW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBtc01vZHVsdXMgPSBnZXRNaWxsaXNlY29uZE1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCBsZWZ0TXMgPSBmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgcmlnaHRNcyA9IGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCB0b3RhbE1zID0gcmlnaHRNcyAtIGxlZnRNc1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gcm91bmRVcChsZWZ0TXMsIG1zTW9kdWx1cylcbiAgICBsZXQgbXNNYXJrZXJUbXAgPSBmaXJzdE1hcmtlclxuICAgIGNvbnN0IG1zTWFya2VycyA9IFtdXG4gICAgd2hpbGUgKG1zTWFya2VyVG1wIDw9IHJpZ2h0TXMpIHtcbiAgICAgIG1zTWFya2Vycy5wdXNoKG1zTWFya2VyVG1wKVxuICAgICAgbXNNYXJrZXJUbXAgKz0gbXNNb2R1bHVzXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNNYXJrZXIgPSBtc01hcmtlcnNbaV1cbiAgICAgIGxldCBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zTWFya2VyLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIGxldCBtc1JlbWFpbmRlciA9IE1hdGguZmxvb3IobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYgLSBtc01hcmtlcilcbiAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgbXNSZW1haW5kZXIgY2FzZSByYXRoZXIgdGhhbiBpZ25vcmluZyBpdFxuICAgICAgaWYgKCFtc1JlbWFpbmRlcikge1xuICAgICAgICBsZXQgZnJhbWVPZmZzZXQgPSBuZWFyZXN0RnJhbWUgLSBsZWZ0RnJhbWVcbiAgICAgICAgbGV0IHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUobXNNYXJrZXIsIHB4T2Zmc2V0LCB0b3RhbE1zKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIC8qXG4gICAqIGdldHRlcnMvY2FsY3VsYXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLyoqXG4gICAgLy8gU29ycnk6IFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gZ2l2ZW4gaHVtYW4tcmVhZGFibGUgbmFtZXNcbiAgICA8R0FVR0U+XG4gICAgICAgICAgICA8LS0tLWZyaVctLS0+XG4gICAgZnJpMCAgICBmcmlBICAgICAgICBmcmlCICAgICAgICBmcmlNYXggICAgICAgICAgICAgICAgICAgICAgICAgIGZyaU1heDJcbiAgICB8ICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8XG4gICAgICAgICAgICA8LS0tLS0tLS0tLS0+IDw8IHRpbWVsaW5lcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgIHxcbiAgICA8LS0tLS0tLT4gICAgICAgICAgIHwgPDwgcHJvcGVydGllcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgcHhBICAgICAgICAgcHhCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXggICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heDJcbiAgICA8U0NST0xMQkFSPlxuICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tfCA8PCBzY3JvbGxlciB2aWV3cG9ydFxuICAgICAgICAqPT09PSogICAgICAgICAgICA8PCBzY3JvbGxiYXJcbiAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAgICB8c2MwICAgICAgICAgICAgICAgIHxzY0wgJiYgc2NSYXRpb1xuICAgICAgICB8c2NBXG4gICAgICAgICAgICAgfHNjQlxuICAqL1xuICBnZXRGcmFtZUluZm8gKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHt9XG4gICAgZnJhbWVJbmZvLmZwcyA9IHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8vIE51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgIGZyYW1lSW5mby5tc3BmID0gMTAwMCAvIGZyYW1lSW5mby5mcHMgLy8gTWlsbGlzZWNvbmRzIHBlciBmcmFtZVxuICAgIGZyYW1lSW5mby5tYXhtcyA9IGdldE1heGltdW1Ncyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgIGZyYW1lSW5mby5tYXhmID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShmcmFtZUluZm8ubWF4bXMsIGZyYW1lSW5mby5tc3BmKSAvLyBNYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaTAgPSAwIC8vIFRoZSBsb3dlc3QgcG9zc2libGUgZnJhbWUgKGFsd2F5cyAwKVxuICAgIGZyYW1lSW5mby5mcmlBID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPCBmcmFtZUluZm8uZnJpMCkgPyBmcmFtZUluZm8uZnJpMCA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLy8gVGhlIGxlZnRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaU1heCA9IChmcmFtZUluZm8ubWF4ZiA8IDYwKSA/IDYwIDogZnJhbWVJbmZvLm1heGYgLy8gVGhlIG1heGltdW0gZnJhbWUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpTWF4MiA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heCAqIDEuODggIC8vIEV4dGVuZCB0aGUgbWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSAoYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBrZXlmcmFtZXMgYmV5b25kIHRoZSBwcmV2aW91c2x5IGRlZmluZWQgbWF4KVxuICAgIGZyYW1lSW5mby5mcmlCID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gPiBmcmFtZUluZm8uZnJpTWF4MikgPyBmcmFtZUluZm8uZnJpTWF4MiA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLy8gVGhlIHJpZ2h0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlXID0gTWF0aC5hYnMoZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkgLy8gVGhlIHdpZHRoIG9mIHRoZSB2aXNpYmxlIHJhbmdlIGluIGZyYW1lc1xuICAgIGZyYW1lSW5mby5weHBmID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8gZnJhbWVJbmZvLmZyaVcpIC8vIE51bWJlciBvZiBwaXhlbHMgcGVyIGZyYW1lIChyb3VuZGVkKVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA8IDEpIGZyYW1lSW5mby5wU2NyeHBmID0gMVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA+IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIGZyYW1lSW5mby5weHBmID0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aFxuICAgIGZyYW1lSW5mby5weEEgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4QiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhNYXgyID0gZnJhbWVJbmZvLmZyaU1heDIgKiBmcmFtZUluZm8ucHhwZiAvLyBUaGUgd2lkdGggaW4gcGl4ZWxzIHRoYXQgdGhlIGVudGlyZSB0aW1lbGluZSAoXCJmcmlNYXgyXCIpIHBhZGRpbmcgd291bGQgZXF1YWxcbiAgICBmcmFtZUluZm8ubXNBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgbGVmdG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8ubXNCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgcmlnaHRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLnNjTCA9IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvLyBUaGUgbGVuZ3RoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsZXIgdmlld1xuICAgIGZyYW1lSW5mby5zY1JhdGlvID0gZnJhbWVJbmZvLnB4TWF4MiAvIGZyYW1lSW5mby5zY0wgLy8gVGhlIHJhdGlvIG9mIHRoZSBzY3JvbGxlciB2aWV3IHRvIHRoZSB0aW1lbGluZSB2aWV3IChzbyB0aGUgc2Nyb2xsZXIgcmVuZGVycyBwcm9wb3J0aW9uYWxseSB0byB0aGUgdGltZWxpbmUgYmVpbmcgZWRpdGVkKVxuICAgIGZyYW1lSW5mby5zY0EgPSAoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIGxlZnQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgZnJhbWVJbmZvLnNjQiA9IChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgcmlnaHQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgcmV0dXJuIGZyYW1lSW5mb1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMvdGhlc2UgbWlzbm9tZXIocykuIEl0J3Mgbm90ICdBU0NJSSdcbiAgZ2V0QXNjaWlUcmVlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGxldCBhcmNoeUZvcm1hdCA9IHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgICBsZXQgYXJjaHlTdHIgPSBhcmNoeShhcmNoeUZvcm1hdClcbiAgICAgIHJldHVybiBhcmNoeVN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXRBcmNoeUZvcm1hdE5vZGVzIChsYWJlbCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWwsXG4gICAgICBub2RlczogY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykubWFwKChjaGlsZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCBjaGlsZC5jaGlsZHJlbilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50Um93c0RhdGEgKCkge1xuICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgKiptdXN0KiogY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIGNvbXBvbmVudCBoZWFkaW5ncy9wcm9wZXJ0eSByb3dzXG4gICAgbGV0IGFzY2lpU3ltYm9scyA9IHRoaXMuZ2V0QXNjaWlUcmVlKCkuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGNvbXBvbmVudFJvd3MgPSBbXVxuICAgIGxldCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlID0ge31cbiAgICBsZXQgdmlzaXRvckl0ZXJhdGlvbnMgPSAwXG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlIHx8ICF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIGNvbXBvbmVudFJvd3NcblxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzKSA9PiB7XG4gICAgICAvLyBUT0RPIGhvdyB3aWxsIHRoaXMgYml0ZSB1cz9cbiAgICAgIGxldCBpc0NvbXBvbmVudCA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpXG4gICAgICBsZXQgZWxlbWVudE5hbWUgPSBpc0NvbXBvbmVudCA/IG5vZGUuYXR0cmlidXRlcy5zb3VyY2UgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmIChBTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBpc0NvbXBvbmVudCA/IF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyhub2RlKSA6IF9idWlsZERPTUFkZHJlc3NhYmxlcyhlbGVtZW50TmFtZSwgbG9jYXRvcilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGlzQ2x1c3Rlck1lbWJlcjogdHJ1ZSwgaXNDbHVzdGVySGVhZGluZywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsIGNsdXN0ZXJOYW1lOiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLm5hbWUsIGlzQ2x1c3RlcjogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVGltZShmcmFtZUluZm8uZnJpMCkgKi9cbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaTAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBhY3RpdmVLZXlmcmFtZXMgPSB7fVxuXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmVLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBjdXJyLm1zXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gY3Vyci5mcmFtZVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbnVsbCxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG51bGwsXG4gICAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgekluZGV4OiAxMDAzLFxuICAgICAgICAgICAgY3Vyc29yOiAnY29sLXJlc2l6ZSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNvbG9LZXlmcmFtZSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgbGV0IGlzQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gIT0gdW5kZWZpbmVkKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIGFjdGl2ZUtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWRdID0ge31cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSksXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlS2V5ZnJhbWVzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gOTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXlmcmFtZXM6IHt9fSlcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyAobm9kZSkge1xuICB2YXIgYWRkcmVzc2FibGVzID0gX2J1aWxkRE9NQWRkcmVzc2FibGVzKCdkaXYnKSAvLyBzdGFydCB3aXRoIGRvbSBwcm9wZXJ0aWVzP1xuICBmb3IgKGxldCBuYW1lIGluIG5vZGUuZWxlbWVudE5hbWUuc3RhdGVzKSB7XG4gICAgbGV0IHN0YXRlID0gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXNbbmFtZV1cblxuICAgIGFkZHJlc3NhYmxlcy5wdXNoKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBwcmVmaXg6IG5hbWUsXG4gICAgICBzdWZmaXg6IHVuZGVmaW5lZCxcbiAgICAgIGZhbGxiYWNrOiBzdGF0ZS52YWx1ZSxcbiAgICAgIHR5cGVkZWY6IHN0YXRlLnR5cGVcbiAgICB9KVxuICB9XG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZnVuY3Rpb24gX2J1aWxkRE9NQWRkcmVzc2FibGVzIChlbGVtZW50TmFtZSwgbG9jYXRvcikge1xuICB2YXIgYWRkcmVzc2FibGVzID0gW11cblxuICBjb25zdCBkb21TY2hlbWEgPSBET01TY2hlbWFbZWxlbWVudE5hbWVdXG4gIGNvbnN0IGRvbUZhbGxiYWNrcyA9IERPTUZhbGxiYWNrc1tlbGVtZW50TmFtZV1cblxuICBpZiAoZG9tU2NoZW1hKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIGRvbVNjaGVtYSkge1xuICAgICAgbGV0IHByb3BlcnR5R3JvdXAgPSBudWxsXG5cbiAgICAgIGlmIChsb2NhdG9yID09PSAnMCcpIHsgLy8gVGhpcyBpbmRpY2F0ZXMgdGhlIHRvcCBsZXZlbCBlbGVtZW50ICh0aGUgYXJ0Ym9hcmQpXG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTX1RPUF9MRVZFTFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgbGV0IG5hbWVQYXJ0cyA9IHByb3BlcnR5TmFtZS5zcGxpdCgnLicpXG5cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dYJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd4J11cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dZJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd5J11cblxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgcHJlZml4OiBuYW1lUGFydHNbMF0sXG4gICAgICAgICAgICBzdWZmaXg6IG5hbWVQYXJ0c1sxXSxcbiAgICAgICAgICAgIGZhbGxiYWNrOiBkb21GYWxsYmFja3NbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHR5cGVkZWY6IGRvbVNjaGVtYVtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eUdyb3VwKSB7XG4gICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gQ0xVU1RFUkVEX1BST1BTW3Byb3BlcnR5R3JvdXAubmFtZV1cbiAgICAgICAgaWYgKGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwLmNsdXN0ZXIgPSB7XG4gICAgICAgICAgICBwcmVmaXg6IGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICBuYW1lOiBDTFVTVEVSX05BTUVTW2NsdXN0ZXJQcmVmaXhdXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkcmVzc2FibGVzLnB1c2gocHJvcGVydHlHcm91cClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRkcmVzc2FibGVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=