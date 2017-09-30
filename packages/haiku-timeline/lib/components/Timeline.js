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
      var _this5 = this;

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

        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this5.state.reifiedBytecode, k.componentId, _this5.state.currentTimelineName, k.propertyName, k.handle, k.index, k.ms, endMs, frameInfo);

        // after moving all activeKeyframes, make sure we set the new curr ms on each of them
        // console.log('pre state', this.state.activeKeyframes)

        var activeKeyframes = _this5.state.activeKeyframes;
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

        _this5.setState({ activeKeyframes: activeKeyframes }, function () {
          // console.log('post state', this.state.activeKeyframes
        });
        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
          _this5.setState({
            reifiedBytecode: _this5.state.reifiedBytecode,
            serializedBytecode: _this5._component.getSerializedBytecode()
          });

          // It's very heavy to transmit a websocket message for every single movement while updating the ui,
          // so the values are accumulated and sent via a single batched update.
          if (!_this5._keyframeMoves) _this5._keyframeMoves = {};
          var movementKey = [componentId, timelineName, propertyName].join('-');
          _this5._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
          _this5.debouncedKeyframeMoveAction();
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
      var _this6 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this6._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this6._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this7 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this7.state.selectedNodes[id];
            node.__isExpanded = !!_this7.state.expandedNodes[id];
            node.__isHidden = !!_this7.state.hiddenNodes[id];
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
      var _this8 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this8.selectNode(node);
          _this8.expandNode(node);
          _this8.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this9 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this9.deselectNode(node);
        _this9.collapseNode(node);
        _this9.scrollToTop(node);
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
      var _this10 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this10.activateRow(rowInfo);
        } else {
          _this10.deactivateRow(rowInfo);
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
      var _this11 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this11.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this12 = this;

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
              if (_this12.state.expandedPropertyClusters[clusterKey]) {
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
      var _this13 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this13.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this13.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
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
      var _this14 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1570
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
            _this14.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this14.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this14.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this14.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this14._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this14.props.websocket.action('setTimelineName', [_this14.props.folder, currentTimelineName], function () {});
            _this14.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this14.getFrameInfo();
            _this14._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this14.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this14.getFrameInfo();
            _this14.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this14._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this14.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this14.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1575
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
      var _this15 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1643
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this15.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this15.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this15.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this15.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this15.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this15.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this16 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this16.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this16.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this16.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this16.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this16.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this16.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this16.state.keyframeDragStartMs + msChange);
              _this16.executeBytecodeActionMoveSegmentEndpoints(componentId, _this16.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            var activeKeyframes = _this16.state.activeKeyframes;
            if (!e.shiftKey) activeKeyframes = {};

            activeKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              index: curr.index,
              ms: curr.ms,
              handle: handle,
              componentId: componentId,
              propertyName: propertyName
            };
            _this16.setState({ activeKeyframes: activeKeyframes });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1666
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
            _this16.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this16.state.currentTimelineName,
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
            lineNumber: 1705
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
            lineNumber: 1751
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
              lineNumber: 1763
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1771
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this17 = this;

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
            _this17.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this17.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this17.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this17.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this17.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this17.state.keyframeDragStartMs + msChange);
            _this17.executeBytecodeActionMoveSegmentEndpoints(componentId, _this17.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            var activeKeyframes = _this17.state.activeKeyframes;
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
            _this17.setState({ activeKeyframes: activeKeyframes });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1795
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this17[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this17.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this17.state.currentTimelineName,
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
              if (_this17[uniqueKey]) _this17[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this17[uniqueKey]) _this17[uniqueKey].style.color = 'transparent';
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
              lineNumber: 1842
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
              lineNumber: 1893
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
              lineNumber: 1909
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
                lineNumber: 1926
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
                  lineNumber: 1936
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1944
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
                lineNumber: 1954
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1963
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
                lineNumber: 1981
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
                  lineNumber: 1992
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2002
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
      var _this18 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this18[uniqueKey] = domElement;
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
            _this18.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this18.state.currentTimelineName,
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
            lineNumber: 2022
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
            lineNumber: 2061
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this19 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this19.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this19.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this19.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this19.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this19.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this19.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 2104
            },
            __self: _this19
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this20 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2120
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2121
                  },
                  __self: _this20
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
                  lineNumber: 2130
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2131
                  },
                  __self: _this20
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
                  lineNumber: 2136
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2137
                  },
                  __self: _this20
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
      var _this21 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 2148
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2150
            },
            __self: _this21
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this22 = this;

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
            _this22.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this22.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this22.setState({ scrubberDragStart: null, frameBaseline: _this22.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this22.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 2163
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2182
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
                lineNumber: 2183
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
                lineNumber: 2196
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
                lineNumber: 2206
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
              lineNumber: 2218
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this23 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this23.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this23.state.maxFrame ? _this23.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this23.state.addInterval);
              _this23.setState({ maxFrame: currentMax + _this23.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this23.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this23.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2241
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2260
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
                lineNumber: 2261
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
                lineNumber: 2274
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2288
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this24 = this;

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
            lineNumber: 2295
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
              lineNumber: 2308
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
                lineNumber: 2317
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2329
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2331
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
                    lineNumber: 2332
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
                lineNumber: 2336
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2351
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2353
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
                    lineNumber: 2354
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
                  lineNumber: 2357
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
                lineNumber: 2359
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2376
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2377
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2378
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2380
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
                  lineNumber: 2382
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2383
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2384
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2385
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
              if (_this24.state.scrubberDragStart === null || _this24.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this24.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this24._component.getCurrentTimeline().seek(newFrame);
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
              lineNumber: 2392
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
      var _this25 = this;

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
            lineNumber: 2429
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this25.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this25.state.visibleFrameRange[0],
                scrollbarEnd: _this25.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this25.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this25.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this25.state.scrollerLeftDragStart && !_this25.state.scrollerRightDragStart) {
                _this25.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2439
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
                lineNumber: 2463
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this25.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this25.state.visibleFrameRange[0], scrollbarEnd: _this25.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this25.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this25.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2473
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2478
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this25.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this25.state.visibleFrameRange[0], scrollbarEnd: _this25.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this25.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this25.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2480
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2485
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
              lineNumber: 2489
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
              lineNumber: 2490
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
            lineNumber: 2505
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
            lineNumber: 2532
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2535
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
              lineNumber: 2536
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2547
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2548
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
              lineNumber: 2550
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
      var _this26 = this;

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
              _this26.collapseNode(item.node, componentId);
              _this26.props.websocket.action('unselectElement', [_this26.props.folder, componentId], function () {});
            } else {
              _this26.expandNode(item.node, componentId);
              _this26.props.websocket.action('selectElement', [_this26.props.folder, componentId], function () {});
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
            lineNumber: 2565
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
            lineNumber: 2592
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
              lineNumber: 2600
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2608
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
                  lineNumber: 2609
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2614
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2614
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2615
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2615
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
              lineNumber: 2621
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
      var _this27 = this;

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
            lineNumber: 2636
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this27.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this27.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2646
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
                lineNumber: 2658
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2668
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2668
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
              lineNumber: 2673
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
                lineNumber: 2682
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
                  lineNumber: 2695
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
              lineNumber: 2709
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
              lineNumber: 2718
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
              _this27.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this27.state.currentTimelineName,
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
              if (!_this27.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this27.setState({ activatedRows: activatedRows });
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
              lineNumber: 2733
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
      var _this28 = this;

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
            var expandedPropertyClusters = _lodash2.default.clone(_this28.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this28.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this28.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this28.setState({
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
            lineNumber: 2784
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2815
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
              lineNumber: 2817
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
                lineNumber: 2825
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2832
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2832
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
                lineNumber: 2834
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
                  lineNumber: 2844
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
              lineNumber: 2853
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
              lineNumber: 2862
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
              lineNumber: 2876
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this28.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this28.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this28.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
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
      var _this29 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2907
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
            lineNumber: 2910
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this29.renderClusterRow(item, index, _this29.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this29.renderPropertyRow(item, index, _this29.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this29.renderComponentHeadingRow(item, index, _this29.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this30 = this;

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
            lineNumber: 2932
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
            lineNumber: 2948
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
              lineNumber: 2959
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

            _this30.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this30.state.inputFocused), _this30.state.currentTimelineName, _this30.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this30.state.inputFocused), _this30.getCurrentTimelineTime(_this30.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this30.setState({
              inputFocused: _this30.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this30.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this30.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2976
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwibG9nIiwiayIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIm1zIiwia2V5ZnJhbWUiLCJmaW5kIiwiaWQiLCJfa2V5ZnJhbWVNb3ZlcyIsIm1vdmVtZW50S2V5Iiwiam9pbiIsImtleWZyYW1lTW92ZXNGb3JXaXJlIiwicGF1c2UiLCJwbGF5IiwidGVtcGxhdGUiLCJ2aXNpdFRlbXBsYXRlIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJpc0NvbXBvbmVudCIsInNvdXJjZSIsImFzY2lpQnJhbmNoIiwiaGVhZGluZ1JvdyIsInByb3BlcnR5Um93cyIsIl9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyIsIl9idWlsZERPTUFkZHJlc3NhYmxlcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiaiIsIm5leHRJbmRleCIsIm5leHREZXNjcmlwdG9yIiwiY2x1c3Rlck5hbWUiLCJpc0NsdXN0ZXIiLCJpdGVtcyIsIl9pbmRleCIsIl9pdGVtcyIsInNlZ21lbnRPdXRwdXRzIiwidmFsdWVHcm91cCIsImdldFZhbHVlR3JvdXAiLCJrZXlmcmFtZXNMaXN0Iiwia2V5ZnJhbWVLZXkiLCJwYXJzZUludCIsInNvcnQiLCJhIiwiYiIsIm1zY3VyciIsImlzTmFOIiwibXNwcmV2IiwibXNuZXh0IiwidW5kZWZpbmVkIiwicHJldiIsImN1cnIiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJlIiwic2hpZnRLZXkiLCJjdHhNZW51RXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIsIm5hbWVQYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FB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QWF2ZSxZQUFiLENBSkk7QUFLZHFlLHFCQUFTQyxVQUFVdGUsWUFBVjtBQUxLLFdBQWhCO0FBT0Q7QUFDRjs7QUFFRCxVQUFJd2UsYUFBSixFQUFtQjtBQUNqQixZQUFJN00sZ0JBQWdCdlYsZ0JBQWdCb2lCLGNBQWMxZCxJQUE5QixDQUFwQjtBQUNBLFlBQUk2USxhQUFKLEVBQW1CO0FBQ2pCNk0sd0JBQWM5TSxPQUFkLEdBQXdCO0FBQ3RCRSxvQkFBUUQsYUFEYztBQUV0QjdRLGtCQUFNekUsY0FBY3NWLGFBQWQ7QUFGZ0IsV0FBeEI7QUFJRDs7QUFFRHNNLHFCQUFhdGUsSUFBYixDQUFrQjZlLGFBQWxCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU9QLFlBQVA7QUFDRDs7a0JBRWN4Z0IsUSIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFyY2h5IGZyb20gJ2FyY2h5J1xuaW1wb3J0IHsgRHJhZ2dhYmxlQ29yZSB9IGZyb20gJ3JlYWN0LWRyYWdnYWJsZSdcblxuaW1wb3J0IERPTVNjaGVtYSBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9zY2hlbWEnXG5pbXBvcnQgRE9NRmFsbGJhY2tzIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3Byb3BlcnRpZXMvZG9tL2ZhbGxiYWNrcydcbmltcG9ydCBleHByZXNzaW9uVG9STyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL2V4cHJlc3Npb25Ub1JPJ1xuXG5pbXBvcnQgVGltZWxpbmVQcm9wZXJ0eSBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvVGltZWxpbmVQcm9wZXJ0eSdcbmltcG9ydCBCeXRlY29kZUFjdGlvbnMgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL2FjdGlvbnMnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcblxuaW1wb3J0IHtcbiAgbmV4dFByb3BJdGVtLFxuICBnZXRJdGVtQ29tcG9uZW50SWQsXG4gIGdldEl0ZW1Qcm9wZXJ0eU5hbWVcbn0gZnJvbSAnLi9oZWxwZXJzL0l0ZW1IZWxwZXJzJ1xuXG5pbXBvcnQgZ2V0TWF4aW11bU1zIGZyb20gJy4vaGVscGVycy9nZXRNYXhpbXVtTXMnXG5pbXBvcnQgbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSBmcm9tICcuL2hlbHBlcnMvbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSdcbmltcG9ydCBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMgZnJvbSAnLi9oZWxwZXJzL2NsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcydcbmltcG9ydCBodW1hbml6ZVByb3BlcnR5TmFtZSBmcm9tICcuL2hlbHBlcnMvaHVtYW5pemVQcm9wZXJ0eU5hbWUnXG5pbXBvcnQgZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IgZnJvbSAnLi9oZWxwZXJzL2dldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yJ1xuaW1wb3J0IGdldE1pbGxpc2Vjb25kTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0TWlsbGlzZWNvbmRNb2R1bHVzJ1xuaW1wb3J0IGdldEZyYW1lTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0RnJhbWVNb2R1bHVzJ1xuaW1wb3J0IGZvcm1hdFNlY29uZHMgZnJvbSAnLi9oZWxwZXJzL2Zvcm1hdFNlY29uZHMnXG5pbXBvcnQgcm91bmRVcCBmcm9tICcuL2hlbHBlcnMvcm91bmRVcCdcblxuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vaGVscGVycy90cnVuY2F0ZSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgS2V5ZnJhbWVTVkcgZnJvbSAnLi9pY29ucy9LZXlmcmFtZVNWRydcblxuaW1wb3J0IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufSBmcm9tICcuL2ljb25zL0N1cnZlU1ZHUydcblxuaW1wb3J0IERvd25DYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9Eb3duQ2Fycm90U1ZHJ1xuaW1wb3J0IFJpZ2h0Q2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvUmlnaHRDYXJyb3RTVkcnXG5pbXBvcnQgQ29udHJvbHNBcmVhIGZyb20gJy4vQ29udHJvbHNBcmVhJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vQ29udGV4dE1lbnUnXG5pbXBvcnQgRXhwcmVzc2lvbklucHV0IGZyb20gJy4vRXhwcmVzc2lvbklucHV0J1xuaW1wb3J0IENsdXN0ZXJJbnB1dEZpZWxkIGZyb20gJy4vQ2x1c3RlcklucHV0RmllbGQnXG5pbXBvcnQgUHJvcGVydHlJbnB1dEZpZWxkIGZyb20gJy4vUHJvcGVydHlJbnB1dEZpZWxkJ1xuXG4vKiB6LWluZGV4IGd1aWRlXG4gIGtleWZyYW1lOiAxMDAyXG4gIHRyYW5zaXRpb24gYm9keTogMTAwMlxuICBrZXlmcmFtZSBkcmFnZ2VyczogMTAwM1xuICBpbnB1dHM6IDEwMDQsICgxMDA1IGFjdGl2ZSlcbiAgdHJpbS1hcmVhIDEwMDZcbiAgc2NydWJiZXI6IDEwMDZcbiAgYm90dG9tIGNvbnRyb2xzOiAxMDAwMCA8LSBrYS1ib29tIVxuKi9cblxudmFyIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBwcm9wZXJ0aWVzV2lkdGg6IDMwMCxcbiAgdGltZWxpbmVzV2lkdGg6IDg3MCxcbiAgcm93SGVpZ2h0OiAyNSxcbiAgaW5wdXRDZWxsV2lkdGg6IDc1LFxuICBtZXRlckhlaWdodDogMjUsXG4gIGNvbnRyb2xzSGVpZ2h0OiA0MixcbiAgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCA2MF0sXG4gIGN1cnJlbnRGcmFtZTogMCxcbiAgbWF4RnJhbWU6IG51bGwsXG4gIGR1cmF0aW9uVHJpbTogMCxcbiAgZnJhbWVzUGVyU2Vjb25kOiA2MCxcbiAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJywgLy8gb3IgJ2ZyYW1lcydcbiAgY3VycmVudFRpbWVsaW5lTmFtZTogJ0RlZmF1bHQnLFxuICBpc1BsYXllclBsYXlpbmc6IGZhbHNlLFxuICBwbGF5ZXJQbGF5YmFja1NwZWVkOiAxLjAsXG4gIGlzU2hpZnRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb21tYW5kS2V5RG93bjogZmFsc2UsXG4gIGlzQ29udHJvbEtleURvd246IGZhbHNlLFxuICBpc0FsdEtleURvd246IGZhbHNlLFxuICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UsXG4gIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSxcbiAgc2VsZWN0ZWROb2Rlczoge30sXG4gIGV4cGFuZGVkTm9kZXM6IHt9LFxuICBhY3RpdmF0ZWRSb3dzOiB7fSxcbiAgaGlkZGVuTm9kZXM6IHt9LFxuICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyczoge30sXG4gIGFjdGl2ZUtleWZyYW1lczoge30sXG4gIHJlaWZpZWRCeXRlY29kZTogbnVsbCxcbiAgc2VyaWFsaXplZEJ5dGVjb2RlOiBudWxsXG59XG5cbmNvbnN0IENVUlZFU1ZHUyA9IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufVxuXG4vKipcbiAqIEhleSEgSWYgeW91IHdhbnQgdG8gQUREIGFueSBwcm9wZXJ0aWVzIGhlcmUsIHlvdSBtaWdodCBhbHNvIG5lZWQgdG8gdXBkYXRlIHRoZSBkaWN0aW9uYXJ5IGluXG4gKiBoYWlrdS1ieXRlY29kZS9zcmMvcHJvcGVydGllcy9kb20vc2NoZW1hLFxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL2ZhbGxiYWNrcyxcbiAqIG9yIHRoZXkgbWlnaHQgbm90IHNob3cgdXAgaW4gdGhlIHZpZXcuXG4gKi9cblxuY29uc3QgQUxMT1dFRF9QUk9QUyA9IHtcbiAgJ3RyYW5zbGF0aW9uLngnOiB0cnVlLFxuICAndHJhbnNsYXRpb24ueSc6IHRydWUsXG4gIC8vICd0cmFuc2xhdGlvbi56JzogdHJ1ZSwgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueic6IHRydWUsXG4gICdyb3RhdGlvbi54JzogdHJ1ZSxcbiAgJ3JvdGF0aW9uLnknOiB0cnVlLFxuICAnc2NhbGUueCc6IHRydWUsXG4gICdzY2FsZS55JzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlLFxuICAvLyAnc2hvd24nOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZVxuICAvLyAnY29sb3InOiB0cnVlLFxuICAvLyAnZmlsbCc6IHRydWUsXG4gIC8vICdzdHJva2UnOiB0cnVlXG59XG5cbmNvbnN0IENMVVNURVJFRF9QUk9QUyA9IHtcbiAgJ21vdW50LngnOiAnbW91bnQnLFxuICAnbW91bnQueSc6ICdtb3VudCcsXG4gICdtb3VudC56JzogJ21vdW50JyxcbiAgJ2FsaWduLngnOiAnYWxpZ24nLFxuICAnYWxpZ24ueSc6ICdhbGlnbicsXG4gICdhbGlnbi56JzogJ2FsaWduJyxcbiAgJ29yaWdpbi54JzogJ29yaWdpbicsXG4gICdvcmlnaW4ueSc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnonOiAnb3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uLngnOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueSc6ICd0cmFuc2xhdGlvbicsXG4gICd0cmFuc2xhdGlvbi56JzogJ3RyYW5zbGF0aW9uJywgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueCc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi55JzogJ3JvdGF0aW9uJyxcbiAgJ3JvdGF0aW9uLnonOiAncm90YXRpb24nLFxuICAvLyAncm90YXRpb24udyc6ICdyb3RhdGlvbicsIC8vIFByb2JhYmx5IGVhc2llc3Qgbm90IHRvIGxldCB0aGUgdXNlciBoYXZlIGNvbnRyb2wgb3ZlciBxdWF0ZXJuaW9uIG1hdGhcbiAgJ3NjYWxlLngnOiAnc2NhbGUnLFxuICAnc2NhbGUueSc6ICdzY2FsZScsXG4gICdzY2FsZS56JzogJ3NjYWxlJyxcbiAgJ3NpemVNb2RlLngnOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueSc6ICdzaXplTW9kZScsXG4gICdzaXplTW9kZS56JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueCc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueSc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueic6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueCc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueSc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueic6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVBYnNvbHV0ZS54JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzaXplQWJzb2x1dGUueSc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnonOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3N0eWxlLm92ZXJmbG93WCc6ICdvdmVyZmxvdycsXG4gICdzdHlsZS5vdmVyZmxvd1knOiAnb3ZlcmZsb3cnXG59XG5cbmNvbnN0IENMVVNURVJfTkFNRVMgPSB7XG4gICdtb3VudCc6ICdNb3VudCcsXG4gICdhbGlnbic6ICdBbGlnbicsXG4gICdvcmlnaW4nOiAnT3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uJzogJ1Bvc2l0aW9uJyxcbiAgJ3JvdGF0aW9uJzogJ1JvdGF0aW9uJyxcbiAgJ3NjYWxlJzogJ1NjYWxlJyxcbiAgJ3NpemVNb2RlJzogJ1NpemluZyBNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwnOiAnU2l6ZSAlJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwnOiAnU2l6ZSArLy0nLFxuICAnc2l6ZUFic29sdXRlJzogJ1NpemUnLFxuICAnb3ZlcmZsb3cnOiAnT3ZlcmZsb3cnXG59XG5cbmNvbnN0IEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMID0ge1xuICAnc2l6ZUFic29sdXRlLngnOiB0cnVlLFxuICAnc2l6ZUFic29sdXRlLnknOiB0cnVlLFxuICAvLyBFbmFibGUgdGhlc2UgYXMgc3VjaCBhIHRpbWUgYXMgd2UgY2FuIHJlcHJlc2VudCB0aGVtIHZpc3VhbGx5IGluIHRoZSBnbGFzc1xuICAvLyAnc3R5bGUub3ZlcmZsb3dYJzogdHJ1ZSxcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WSc6IHRydWUsXG4gICdiYWNrZ3JvdW5kQ29sb3InOiB0cnVlLFxuICAnb3BhY2l0eSc6IHRydWVcbn1cblxuY29uc3QgQUxMT1dFRF9UQUdOQU1FUyA9IHtcbiAgZGl2OiB0cnVlLFxuICBzdmc6IHRydWUsXG4gIGc6IHRydWUsXG4gIHJlY3Q6IHRydWUsXG4gIGNpcmNsZTogdHJ1ZSxcbiAgZWxsaXBzZTogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcG9seWxpbmU6IHRydWUsXG4gIHBvbHlnb246IHRydWVcbn1cblxuY29uc3QgVEhST1RUTEVfVElNRSA9IDE3IC8vIG1zXG5cbmZ1bmN0aW9uIHZpc2l0IChub2RlLCB2aXNpdG9yKSB7XG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2aXNpdG9yKGNoaWxkKVxuICAgICAgICB2aXNpdChjaGlsZCwgdmlzaXRvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSBsb2Rhc2guYXNzaWduKHt9LCBERUZBVUxUUylcbiAgICB0aGlzLmN0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdIC8vIEFycmF5PHtldmVudEVtaXR0ZXI6RXZlbnRFbWl0dGVyLCBldmVudE5hbWU6c3RyaW5nLCBldmVudEhhbmRsZXI6RnVuY3Rpb259PlxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ3RpbWVsaW5lJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHdlIHN0b3JlIGFjY3VtdWxhdGVkIGtleWZyYW1lIG1vdmVtZW50cywgd2UgY2FuIHNlbmQgdGhlIHdlYnNvY2tldCB1cGRhdGUgaW4gYmF0Y2hlcztcbiAgICAvLyBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBhdm9pZHMgdW5uZWNlc3NhcnkgdXBkYXRlcyB0byB0aGUgb3ZlciB2aWV3c1xuICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uID0gbG9kYXNoLnRocm90dGxlKHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uLmJpbmQodGhpcyksIDI1MClcbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB3aW5kb3cudGltZWxpbmUgPSB0aGlzXG4gIH1cblxuICBmbHVzaFVwZGF0ZXMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVwZGF0ZXMpLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnVwZGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW2tleV0gIT09IHRoaXMudXBkYXRlc1trZXldKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlc1trZXldID0gdGhpcy51cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHRoaXMuY2FsbGJhY2tzLnNwbGljZSgwKVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy51cGRhdGVzLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2hhbmdlcygpXG4gICAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKCkpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICh1cGRhdGVzLCBjYikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlc1trZXldID0gdXBkYXRlc1trZXldXG4gICAgfVxuICAgIGlmIChjYikge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYilcbiAgICB9XG4gICAgdGhpcy5mbHVzaFVwZGF0ZXMoKVxuICB9XG5cbiAgY2xlYXJDaGFuZ2VzICgpIHtcbiAgICBmb3IgKGNvbnN0IGsxIGluIHRoaXMudXBkYXRlcykgZGVsZXRlIHRoaXMudXBkYXRlc1trMV1cbiAgICBmb3IgKGNvbnN0IGsyIGluIHRoaXMuY2hhbmdlcykgZGVsZXRlIHRoaXMuY2hhbmdlc1trMl1cbiAgfVxuXG4gIHVwZGF0ZVRpbWUgKGN1cnJlbnRGcmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RnJhbWUgfSlcbiAgfVxuXG4gIHNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSB7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfVxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIHVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IG51bGxcbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICAvKlxuICAgKiBsaWZlY3ljbGUvZXZlbnRzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAvLyBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzIGFuZCByZWFjdCB3YXJuaW5nc1xuICAgIHRoaXMuZW1pdHRlcnMuZm9yRWFjaCgodHVwbGUpID0+IHtcbiAgICAgIHR1cGxlWzBdLnJlbW92ZUxpc3RlbmVyKHR1cGxlWzFdLCB0dXBsZVsyXSlcbiAgICB9KVxuICAgIHRoaXMuc3RhdGUuZGlkTW91bnQgPSBmYWxzZVxuXG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnYmVnaW4nKTtcbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnZW5kJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWRNb3VudDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCB9KVxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1RJTUUpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5wcm9wcy53ZWJzb2NrZXQsICdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZm9sZGVyICE9PSB0aGlzLnByb3BzLmZvbGRlcikgcmV0dXJuIHZvaWQgKDApXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzogcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gYWN0aW9uIHJlY2VpdmVkJywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCB1cGRhdGVkJywgbWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKVxuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBjbGVhciBjYWNoZXMgdGhlbiB0aGUgdGltZWxpbmUgZmllbGRzIG1pZ2h0IG5vdCB1cGRhdGUgcmlnaHQgYWZ0ZXIga2V5ZnJhbWUgZGVsZXRpb25zXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcblxuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG5cbiAgICAgIGlmIChtYXliZU1ldGFkYXRhICYmIG1heWJlTWV0YWRhdGEuZnJvbSAhPT0gJ3RpbWVsaW5lJykge1xuICAgICAgICBpZiAobWF5YmVDb21wb25lbnRJZHMgJiYgbWF5YmVUaW1lbGluZU5hbWUgJiYgbWF5YmVQcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgbWF5YmVDb21wb25lbnRJZHMuZm9yRWFjaCgoY29tcG9uZW50SWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZShjb21wb25lbnRJZCwgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lIHx8IDAsIG1heWJlUHJvcGVydHlOYW1lcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uU2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCB1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblVuc2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IG1vdW50ZWQnLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnJlaHlkcmF0ZUJ5dGVjb2RlKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKVxuICAgICAgLy8gdGhpcy51cGRhdGVUaW1lKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lKVxuICAgIH0pXG5cbiAgICAvLyBjb21wb25lbnQ6bW91bnRlZCBmaXJlcyB3aGVuIHRoaXMgZmluaXNoZXMgd2l0aG91dCBlcnJvclxuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGllbnQubmV4dCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBsZXQgZWRpdGFibGUgPSBwYXN0ZUV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIC8vIE91ciBpbnB1dCBmaWVsZHMgYXJlIDxzcGFuPnNcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScgfHwgZWRpdGFibGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIHZpYSBkZWZhdWx0JylcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBhIHByb3BlcnR5IGlucHV0LCBzbyBsZXQgdGhlIGRlZmF1bHQgYWN0aW9uIGhhcHBlblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY2hlY2sgbGVzcyBicml0dGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgZGVsZWdhdGVkIHRvIHBsdW1iaW5nJylcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY3JlYXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zLyogdmFsdWUsIGN1cnZlLCBlbmRtcywgZW5kdmFsdWUgKi8pXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdzcGxpdFNlZ21lbnQnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2pvaW5LZXlmcmFtZXMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdkZWxldGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY2hhbmdlU2VnbWVudEN1cnZlJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6dGljaycsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgd2UgZ290IGEgdGljaywgd2hpY2ggb2NjdXJzIGR1cmluZyBUaW1lbGluZSBtb2RlbCB1cGRhdGluZywgdGhlbiB3ZSB3YW50IHRvIHBhdXNlIGl0IGlmIHRoZSBzY3J1YmJlclxuICAgICAgLy8gaGFzIGFycml2ZWQgYXQgdGhlIG1heGltdW0gYWNjZXB0aWJsZSBmcmFtZSBpbiB0aGUgdGltZWxpbmUuXG4gICAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUGxheWVyUGxheWluZzogZmFsc2V9KVxuICAgICAgfVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOmF1dGhvcml0YXRpdmUtZnJhbWUtc2V0JywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAndGltZWxpbmUnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChuYXRpdmVFdmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGN1cnJlbnRseSBhY3RpdmUgZXhwcmVzc2lvbiBpbnB1dCBhIGNoYW5jZSB0byBjYXB0dXJlIHRoaXMgZXZlbnQgYW5kIHNob3J0IGNpcmN1aXQgdXMgaWYgc29cbiAgICBpZiAodGhpcy5yZWZzLmV4cHJlc3Npb25JbnB1dC53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQobmF0aXZlRXZlbnQpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoaXQgdGhlIHNwYWNlYmFyIF9hbmRfIHdlIGFyZW4ndCBpbnNpZGUgYW4gaW5wdXQgZmllbGQsIHRyZWF0IHRoYXQgbGlrZSBhIHBsYXliYWNrIHRyaWdnZXJcbiAgICBpZiAobmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gMzIgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0OmZvY3VzJykpIHtcbiAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzU2hpZnRLZXlEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXSwgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKDApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oLTEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoLTEpXG4gICAgICAgIH1cblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cpIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogdHJ1ZSB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKDEpXG4gICAgICAgIH1cblxuICAgICAgLy8gY2FzZSAzODogLy8gdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5qb2luS2V5ZnJhbWVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignam9pbktleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgcmV0dXJuIGZhbHNlXG5cblxuICAgIC8vICBmb3IgcmVmZXJlbmNlOiB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgJ2JvZHknLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TVxuXG4gICAgLy8gZm9yIHJlZmVyZW5jZTpcbiAgICAvLyBhY3RpdmVLZXlmcmFtZXMucHVzaCh7XG4gICAgLy8gICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LCBwcm9wZXJ0eU5hbWUsXG4gICAgLy8gICAgICAgICBpbmRleDogY3Vyci5pbmRleCxcbiAgICAvLyAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgIC8vICAgICAgICAgaGFuZGxlLFxuICAgIC8vICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgLy8gICAgICAgICBwcm9wZXJ0eU5hbWVcbiAgICAvLyAgICAgICB9KVxuXG4gICAgLy8gVGF5bG9yIENoYW5nZSBOb3RlICg4LjEwLjE3KTogcmF0aGVyIHRoYW4gcHVsbGluZyB0aGVzZSBpbiBmcm9tIHRoZSBtZXRob2QgY2FsbCwgSSdtIGp1c3QgZ3JhYmJpbmcgdGhlbSBoZXJlOlxuXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyBUaGUgJ2tleWZyYW1lTW92ZXMnIGluZGljYXRlIGEgbGlzdCBvZiBjaGFuZ2VzIHdlIGtub3cgb2NjdXJyZWQuIE9ubHkgaWYgc29tZSBvY2N1cnJlZCBkbyB3ZSBib3RoZXIgdG8gdXBkYXRlIHRoZSBvdGhlciB2aWV3c1xuICAgICAgY29uc29sZS5sb2codGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMpXG5cbiAgICB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lcy5mb3JFYWNoKChrKSA9PiB7XG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdvbGRtb3ZlJywgW1xuICAgICAgLy8gICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIC8vICAgY29tcG9uZW50SWQsXG4gICAgICAvLyAgIHRpbWVsaW5lTmFtZSxcbiAgICAgIC8vICAgcHJvcGVydHlOYW1lLFxuICAgICAgLy8gICBoYW5kbGUsXG4gICAgICAvLyAgIGtleWZyYW1lSW5kZXgsXG4gICAgICAvLyAgIHN0YXJ0TXMsXG4gICAgICAvLyAgIGVuZE1zXG4gICAgICAvLyBdKVxuICAgICAgLy8gY29uc29sZS5sb2coJ25ld21vdmUnLCBbdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAvLyAgIGsuY29tcG9uZW50SWQsXG4gICAgICAvLyAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgIC8vICAgay5wcm9wZXJ0eU5hbWUsXG4gICAgICAvLyAgIGsuaGFuZGxlLFxuICAgICAgLy8gICBrLmluZGV4LFxuICAgICAgLy8gICBrLm1zLFxuICAgICAgLy8gICBlbmRNc1xuICAgICAgLy8gXSlcblxuICAgICAgbGV0IGtleWZyYW1lTW92ZXMgPSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHMoXG4gICAgICAgIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBrLmNvbXBvbmVudElkLFxuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgIGsucHJvcGVydHlOYW1lLFxuICAgICAgICBrLmhhbmRsZSxcbiAgICAgICAgay5pbmRleCxcbiAgICAgICAgay5tcyxcbiAgICAgICAgZW5kTXMsXG4gICAgICAgIGZyYW1lSW5mb1xuICAgICAgKVxuXG4gICAgICAvLyBhZnRlciBtb3ZpbmcgYWxsIGFjdGl2ZUtleWZyYW1lcywgbWFrZSBzdXJlIHdlIHNldCB0aGUgbmV3IGN1cnIgbXMgb24gZWFjaCBvZiB0aGVtXG4gICAgICAvLyBjb25zb2xlLmxvZygncHJlIHN0YXRlJywgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMpXG5cbiAgICAgIGxldCBhY3RpdmVLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lc1xuICAgICAgY29uc3Qga2V5ZnJhbWUgPSBsb2Rhc2guZmluZChhY3RpdmVLZXlmcmFtZXMsIHsgaWQ6IGsuaWQgfSlcblxuICAgICAgLy8gdGhlc2UgdHdvIHNob3VsZCBiZSBzYW1lLCBidXQgdGhleSdyZSBub3QgOihcbiAgICAgIGNvbnNvbGUubG9nKCdrZXlmcmFtZS5tcycsIGtleWZyYW1lLm1zKVxuICAgICAgY29uc29sZS5sb2coJ3N0YXJ0TXMnLCBzdGFydE1zKVxuXG4gICAgICAvKiBzdGFydE1zIGlzbid0IGdldHRpbmcgZmFyIGVub3VnaCBhbG9uZyBuZXh0IHRpbWUgaXQgY29tZXMgaW4uXG4gICAgICB0aGUga2V5ZnJhbWUubXMgd2hpY2ggaXMgc2V0IGJ5IHRoZSBwcmV2aW91cyBlbmRNcyBpcyB0b28gZmFyIGFoZWFkXG5cbiAgICAgIHdoYXQgaSByZWFsbHkgbmVlZCB0byBrbm93IGlzIHdoYXQncyB0aGUgZGlmZmVyZW5jZSBvZiB0aGUgcHJldmlvdXMgZHJhZyAob2YgdGhlIG9uZSBJJ20gZHJhZ2dpbmcpXG4gICAgICB0aGVuIEkgY2FuIGFwcGx5IHRoaXMgdG8gaXRzIG93biBuZXh0IHN0YXJ0aW5nIHBsYWNlIChrZXlmcmFtZS5tcyksXG4gICAgICBidXQgYWxzbyB0byB0aGUgc3RhcnRpbmcgdmFsdWUgb2YgYWxsIHRoZSBvdGhlcnMgaW4gdGhlIGRyYWcgY29sbGVjdGlvblxuXG4gICAgKi9cblxuICAgICAgLy8gdGhlc2UgdHdvIHNob3VsZCBiZSBzYW1lLCBidXQgdGhleSdyZSBub3QgOihcbiAgICAgIGNvbnNvbGUubG9nKCdlbmRNcycsIGVuZE1zKVxuICAgICAgY29uc29sZS5sb2coJ2JlZ2lubmluZ19rZXlmcmFtZS5tcysgZW5kIC0gc3RhcnQnLCBrZXlmcmFtZS5tcysgZW5kTXMgLSBzdGFydE1zKVxuXG4gICAgICBrZXlmcmFtZS5tcyA9IGtleWZyYW1lLm1zKyBlbmRNcyAtIHN0YXJ0TXMgLy8gb3VnaHQgdG8gdXNlIHRoaXMsIGJ1dCBkb2Vzbid0IHdvcmsgeWV0XG4gICAgICBrZXlmcmFtZS5tcyA9IGVuZE1zXG5cbiAgICAgIC8vIGNvbnNvbGUubG9nKCdhZGp1c3RlZCBtcycsIGtleWZyYW1lLm1zKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXlmcmFtZXN9LCAoKSA9PiB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdwb3N0IHN0YXRlJywgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgfSlcbiAgICAvLyBUaGUgJ2tleWZyYW1lTW92ZXMnIGluZGljYXRlIGEgbGlzdCBvZiBjaGFuZ2VzIHdlIGtub3cgb2NjdXJyZWQuIE9ubHkgaWYgc29tZSBvY2N1cnJlZCBkbyB3ZSBib3RoZXIgdG8gdXBkYXRlIHRoZSBvdGhlciB2aWV3c1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEl0J3MgdmVyeSBoZWF2eSB0byB0cmFuc21pdCBhIHdlYnNvY2tldCBtZXNzYWdlIGZvciBldmVyeSBzaW5nbGUgbW92ZW1lbnQgd2hpbGUgdXBkYXRpbmcgdGhlIHVpLFxuICAgICAgICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgdGhpcy5fa2V5ZnJhbWVNb3ZlcyA9IHt9XG4gICAgICAgIGxldCBtb3ZlbWVudEtleSA9IFtjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWVdLmpvaW4oJy0nKVxuICAgICAgICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgICAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbigpXG4gICAgICB9XG4gICAgfSlcblxuXG4gICAgLy8gbGV0IGtleWZyYW1lTW92ZXMgPSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcywgZnJhbWVJbmZvKVxuXG4gICAgLy8gLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAvLyBpZiAoT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3ZlcykubGVuZ3RoID4gMCkge1xuICAgIC8vICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgLy8gICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgLy8gICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgLy8gICB9KVxuXG4gICAgLy8gICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAvLyAgIC8vIHNvIHRoZSB2YWx1ZXMgYXJlIGFjY3VtdWxhdGVkIGFuZCBzZW50IHZpYSBhIHNpbmdsZSBiYXRjaGVkIHVwZGF0ZS5cbiAgICAvLyAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgdGhpcy5fa2V5ZnJhbWVNb3ZlcyA9IHt9XG4gICAgLy8gICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAvLyAgIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldID0geyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9XG4gICAgLy8gICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbigpXG4gICAgLy8gfVxuXG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIC8vIFRPRE8gaG93IHdpbGwgdGhpcyBiaXRlIHVzP1xuICAgICAgbGV0IGlzQ29tcG9uZW50ID0gKHR5cGVvZiBub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JylcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IGlzQ29tcG9uZW50ID8gbm9kZS5hdHRyaWJ1dGVzLnNvdXJjZSA6IG5vZGUuZWxlbWVudE5hbWVcblxuICAgICAgaWYgKCFwYXJlbnQgfHwgKHBhcmVudC5fX2lzRXhwYW5kZWQgJiYgKEFMTE9XRURfVEFHTkFNRVNbZWxlbWVudE5hbWVdIHx8IGlzQ29tcG9uZW50KSkpIHsgLy8gT25seSB0aGUgdG9wLWxldmVsIGFuZCBhbnkgZXhwYW5kZWQgc3ViY29tcG9uZW50c1xuICAgICAgICBjb25zdCBhc2NpaUJyYW5jaCA9IGFzY2lpU3ltYm9sc1t2aXNpdG9ySXRlcmF0aW9uc10gLy8gV2FybmluZzogVGhlIGNvbXBvbmVudCBzdHJ1Y3R1cmUgbXVzdCBtYXRjaCB0aGF0IGdpdmVuIHRvIGNyZWF0ZSB0aGUgYXNjaWkgdHJlZVxuICAgICAgICBjb25zdCBoZWFkaW5nUm93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2gsIHByb3BlcnR5Um93czogW10sIGlzSGVhZGluZzogdHJ1ZSwgY29tcG9uZW50SWQ6IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXSB9XG4gICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChoZWFkaW5nUm93KVxuXG4gICAgICAgIGlmICghYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSA9IGlzQ29tcG9uZW50ID8gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzKG5vZGUpIDogX2J1aWxkRE9NQWRkcmVzc2FibGVzKGVsZW1lbnROYW1lLCBsb2NhdG9yKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgY29uc3QgY2x1c3RlckhlYWRpbmdzRm91bmQgPSB7fVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlHcm91cERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtpXVxuXG4gICAgICAgICAgbGV0IHByb3BlcnR5Um93XG5cbiAgICAgICAgICAgIC8vIFNvbWUgcHJvcGVydGllcyBnZXQgZ3JvdXBlZCBpbnNpZGUgdGhlaXIgb3duIGFjY29yZGlvbiBzaW5jZSB0aGV5IGhhdmUgbXVsdGlwbGUgc3ViY29tcG9uZW50cywgZS5nLiB0cmFuc2xhdGlvbi54LHkselxuICAgICAgICAgIGlmIChwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyKSB7XG4gICAgICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4XG4gICAgICAgICAgICBsZXQgY2x1c3RlcktleSA9IGAke2NvbXBvbmVudElkfV8ke2NsdXN0ZXJQcmVmaXh9YFxuICAgICAgICAgICAgbGV0IGlzQ2x1c3RlckhlYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjbHVzdGVyIHdpdGggdGhlIGN1cnJlbnQga2V5IGlzIGV4cGFuZGVkIHJlbmRlciBlYWNoIG9mIHRoZSByb3dzIGluZGl2aWR1YWxseVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2NsdXN0ZXJLZXldKSB7XG4gICAgICAgICAgICAgIGlmICghY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0pIHtcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLCBpc0NsdXN0ZXJIZWFkaW5nLCBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsIGlzUHJvcGVydHk6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBjbHVzdGVyLCBzaGlmdGluZyB0aGUgaW5kZXggZm9yd2FyZCBzbyB3ZSBkb24ndCByZS1yZW5kZXIgdGhlIGluZGl2aWR1YWxzIG9uIHRoZSBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgbG9vcFxuICAgICAgICAgICAgICBsZXQgY2x1c3RlclNldCA9IFtwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcl1cbiAgICAgICAgICAgICAgICAvLyBMb29rIGFoZWFkIGJ5IGEgZmV3IHN0ZXBzIGluIHRoZSBhcnJheSBhbmQgc2VlIGlmIHRoZSBuZXh0IGVsZW1lbnQgaXMgYSBtZW1iZXIgb2YgdGhlIGN1cnJlbnQgY2x1c3RlclxuICAgICAgICAgICAgICBsZXQgayA9IGkgLy8gVGVtcG9yYXJ5IHNvIHdlIGNhbiBpbmNyZW1lbnQgYGlgIGluIHBsYWNlXG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IGogKyBrXG4gICAgICAgICAgICAgICAgbGV0IG5leHREZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1bbmV4dEluZGV4XVxuICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIG5leHQgdGhpbmcgaW4gdGhlIGxpc3Qgc2hhcmVzIHRoZSBzYW1lIGNsdXN0ZXIgbmFtZSwgbWFrZSBpdCBwYXJ0IG9mIHRoaXMgY2x1c3Rlc3JcbiAgICAgICAgICAgICAgICBpZiAobmV4dERlc2NyaXB0b3IgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3RlciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeCA9PT0gY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgY2x1c3RlclNldC5wdXNoKG5leHREZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBhbHJlYWR5IGdvIHRvIHRoZSBuZXh0IG9uZSwgYnVtcCB0aGUgaXRlcmF0aW9uIGluZGV4IHNvIHdlIHNraXAgaXQgb24gdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgY2x1c3RlcjogY2x1c3RlclNldCwgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSwgaXNDbHVzdGVyOiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVhZGluZ1Jvdy5wcm9wZXJ0eVJvd3MucHVzaChwcm9wZXJ0eVJvdylcblxuICAgICAgICAgICAgLy8gUHVzaGluZyBhbiBlbGVtZW50IGludG8gYSBjb21wb25lbnQgcm93IHdpbGwgcmVzdWx0IGluIGl0IHJlbmRlcmluZywgc28gb25seSBwdXNoXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVydHkgcm93cyBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRleFxuICAgICAgICAgIGlmIChub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKHByb3BlcnR5Um93KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXRvckl0ZXJhdGlvbnMrK1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzLmZvckVhY2goKGl0ZW0sIGluZGV4LCBpdGVtcykgPT4ge1xuICAgICAgaXRlbS5faW5kZXggPSBpbmRleFxuICAgICAgaXRlbS5faXRlbXMgPSBpdGVtc1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzID0gY29tcG9uZW50Um93cy5maWx0ZXIoKHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yIH0pID0+IHtcbiAgICAgICAgLy8gTG9jYXRvcnMgPiAwLjAgYXJlIGJlbG93IHRoZSBsZXZlbCB3ZSB3YW50IHRvIGRpc3BsYXkgKHdlIG9ubHkgd2FudCB0aGUgdG9wIGFuZCBpdHMgY2hpbGRyZW4pXG4gICAgICBpZiAobG9jYXRvci5zcGxpdCgnLicpLmxlbmd0aCA+IDIpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuICFwYXJlbnQgfHwgcGFyZW50Ll9faXNFeHBhbmRlZFxuICAgIH0pXG5cbiAgICByZXR1cm4gY29tcG9uZW50Um93c1xuICB9XG5cbiAgbWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBsZXQgdmFsdWVHcm91cCA9IFRpbWVsaW5lUHJvcGVydHkuZ2V0VmFsdWVHcm91cChjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSlcbiAgICBpZiAoIXZhbHVlR3JvdXApIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgbGV0IGtleWZyYW1lc0xpc3QgPSBPYmplY3Qua2V5cyh2YWx1ZUdyb3VwKS5tYXAoKGtleWZyYW1lS2V5KSA9PiBwYXJzZUludChrZXlmcmFtZUtleSwgMTApKS5zb3J0KChhLCBiKSA9PiBhIC0gYilcbiAgICBpZiAoa2V5ZnJhbWVzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5ZnJhbWVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zY3VyciA9IGtleWZyYW1lc0xpc3RbaV1cbiAgICAgIGlmIChpc05hTihtc2N1cnIpKSBjb250aW51ZVxuICAgICAgbGV0IG1zcHJldiA9IGtleWZyYW1lc0xpc3RbaSAtIDFdXG4gICAgICBsZXQgbXNuZXh0ID0ga2V5ZnJhbWVzTGlzdFtpICsgMV1cblxuICAgICAgaWYgKG1zY3VyciA+IGZyYW1lSW5mby5tc0IpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGFmdGVyIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0XG4gICAgICBpZiAobXNjdXJyIDwgZnJhbWVJbmZvLm1zQSAmJiBtc25leHQgIT09IHVuZGVmaW5lZCAmJiBtc25leHQgPCBmcmFtZUluZm8ubXNBKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBlbnRpcmVseSBiZWZvcmUgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXQgKHBhcnRpYWwgc2VnbWVudHMgYXJlIG9rKVxuXG4gICAgICBsZXQgcHJldlxuICAgICAgbGV0IGN1cnJcbiAgICAgIGxldCBuZXh0XG5cbiAgICAgIGlmIChtc3ByZXYgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNwcmV2KSkge1xuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIG1zOiBtc3ByZXYsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpIC0gMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc3ByZXYsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc3ByZXZdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zcHJldl0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdXJyID0ge1xuICAgICAgICBtczogbXNjdXJyLFxuICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc2N1cnIsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNjdXJyXS52YWx1ZSxcbiAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNjdXJyXS5jdXJ2ZVxuICAgICAgfVxuXG4gICAgICBpZiAobXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zbmV4dCkpIHtcbiAgICAgICAgbmV4dCA9IHtcbiAgICAgICAgICBtczogbXNuZXh0LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSArIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNuZXh0LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNuZXh0XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc25leHRdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHB4T2Zmc2V0TGVmdCA9IChjdXJyLmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGxldCBweE9mZnNldFJpZ2h0XG4gICAgICBpZiAobmV4dCkgcHhPZmZzZXRSaWdodCA9IChuZXh0LmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcblxuICAgICAgbGV0IHNlZ21lbnRPdXRwdXQgPSBpdGVyYXRlZShwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGkpXG4gICAgICBpZiAoc2VnbWVudE91dHB1dCkgc2VnbWVudE91dHB1dHMucHVzaChzZWdtZW50T3V0cHV0KVxuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgbWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eVJvd3MsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgcHJvcGVydHlSb3dzLmZvckVhY2goKHByb3BlcnR5Um93KSA9PiB7XG4gICAgICBpZiAocHJvcGVydHlSb3cuaXNDbHVzdGVyKSB7XG4gICAgICAgIHByb3BlcnR5Um93LmNsdXN0ZXIuZm9yRWFjaCgocHJvcGVydHlEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5RGVzY3JpcHRvci5uYW1lXG4gICAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlSb3cucHJvcGVydHkubmFtZVxuICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICByZW1vdmVUaW1lbGluZVNoYWRvdyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICB9XG5cbiAgLypcbiAgICogcmVuZGVyIG1ldGhvZHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHRvcDogMTdcbiAgICAgICAgfX0+XG4gICAgICAgIDxDb250cm9sc0FyZWFcbiAgICAgICAgICByZW1vdmVUaW1lbGluZVNoYWRvdz17dGhpcy5yZW1vdmVUaW1lbGluZVNoYWRvdy5iaW5kKHRoaXMpfVxuICAgICAgICAgIGFjdGl2ZUNvbXBvbmVudERpc3BsYXlOYW1lPXt0aGlzLnByb3BzLnVzZXJjb25maWcubmFtZX1cbiAgICAgICAgICB0aW1lbGluZU5hbWVzPXtPYmplY3Qua2V5cygodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpID8gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGltZWxpbmVzIDoge30pfVxuICAgICAgICAgIHNlbGVjdGVkVGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgY3VycmVudEZyYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1cbiAgICAgICAgICBpc1BsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgIHBsYXliYWNrU3BlZWQ9e3RoaXMuc3RhdGUucGxheWVyUGxheWJhY2tTcGVlZH1cbiAgICAgICAgICBsYXN0RnJhbWU9e3RoaXMuZ2V0RnJhbWVJbmZvKCkuZnJpTWF4fVxuICAgICAgICAgIGNoYW5nZVRpbWVsaW5lTmFtZT17KG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY3JlYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZHVwbGljYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZGVsZXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgc2VsZWN0VGltZWxpbmU9eyhjdXJyZW50VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIG1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIGluLW1lbW9yeSBjb21wb25lbnQgb3IgcHJvcGVydHkgYXNzaWdubWVudCBtaWdodCBub3Qgd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRUaW1lbGluZU5hbWUoY3VycmVudFRpbWVsaW5lTmFtZSwgeyBmcm9tOiAndGltZWxpbmUnIH0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZXRUaW1lbGluZU5hbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGN1cnJlbnRUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50VGltZWxpbmVOYW1lIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBCYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvKiB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8uZnJpMCAtIGZyYW1lSW5mby5mcmlBKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVUaW1lKGZyYW1lSW5mby5mcmkwKSAqL1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaTApXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpMCB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwRm9yd2FyZD17KCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmlNYXggfSlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrUGxheVBhdXNlPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNoYW5nZVBsYXliYWNrU3BlZWQ9eyhpbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUGxheWJhY2tTcGVlZCA9IE51bWJlcihpbnB1dEV2ZW50LnRhcmdldC52YWx1ZSB8fCAxKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBsYXllclBsYXliYWNrU3BlZWQgfSlcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0SXRlbVZhbHVlRGVzY3JpcHRvciAoaW5wdXRJdGVtKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihpbnB1dEl0ZW0ubm9kZSwgZnJhbWVJbmZvLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGUsIHRoaXMuX2NvbXBvbmVudCwgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyksIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgaW5wdXRJdGVtLnByb3BlcnR5KVxuICB9XG5cbiAgZ2V0Q3VycmVudFRpbWVsaW5lVGltZSAoZnJhbWVJbmZvKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgfVxuXG4gIHJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoaXRlbSkge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgbGV0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcblxuICAgIC8vIFRPRE86IE9wdGltaXplIHRoaXM/IFdlIGRvbid0IG5lZWQgdG8gcmVuZGVyIGV2ZXJ5IHNlZ21lbnQgc2luY2Ugc29tZSBvZiB0aGVtIG92ZXJsYXAuXG4gICAgLy8gTWF5YmUga2VlcCBhIGxpc3Qgb2Yga2V5ZnJhbWUgJ3BvbGVzJyByZW5kZXJlZCwgYW5kIG9ubHkgcmVuZGVyIG9uY2UgaW4gdGhhdCBzcG90P1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgaGVpZ2h0OiAyNSwgd2lkdGg6ICcxMDAlJywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgaXRlbS5wcm9wZXJ0eVJvd3MsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIGluZGV4LCBoYW5kbGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2FudCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGxldCBhY3RpdmVLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lc1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkgYWN0aXZlS2V5ZnJhbWVzID0ge31cblxuICAgICAgICAgIGFjdGl2ZUtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdID0ge1xuICAgICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGUsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlS2V5ZnJhbWVzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gIT0gdW5kZWZpbmVkKSBpc0FjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWB9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgdG9wOiAtMyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICA6IChpc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgIH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYW5zaXRpb25Cb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG4gICAgY29uc3QgY3VydmUgPSBjdXJyLmN1cnZlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3Vyci5jdXJ2ZS5zbGljZSgxKVxuICAgIGNvbnN0IGJyZWFraW5nQm91bmRzID0gY3VydmUuaW5jbHVkZXMoJ0JhY2snKSB8fCBjdXJ2ZS5pbmNsdWRlcygnQm91bmNlJykgfHwgY3VydmUuaW5jbHVkZXMoJ0VsYXN0aWMnKVxuICAgIGNvbnN0IEN1cnZlU1ZHID0gQ1VSVkVTVkdTW2N1cnZlICsgJ1NWRyddXG4gICAgbGV0IGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGxldCBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gIT0gdW5kZWZpbmVkKSBmaXJzdEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZUtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldICE9IHVuZGVmaW5lZCkgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLCB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgJ2JvZHknLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIGFjdGl2ZUtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWRdID0ge31cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSksXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlS2V5ZnJhbWVzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gOTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyAobm9kZSkge1xuICB2YXIgYWRkcmVzc2FibGVzID0gX2J1aWxkRE9NQWRkcmVzc2FibGVzKCdkaXYnKSAvLyBzdGFydCB3aXRoIGRvbSBwcm9wZXJ0aWVzP1xuICBmb3IgKGxldCBuYW1lIGluIG5vZGUuZWxlbWVudE5hbWUuc3RhdGVzKSB7XG4gICAgbGV0IHN0YXRlID0gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXNbbmFtZV1cblxuICAgIGFkZHJlc3NhYmxlcy5wdXNoKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBwcmVmaXg6IG5hbWUsXG4gICAgICBzdWZmaXg6IHVuZGVmaW5lZCxcbiAgICAgIGZhbGxiYWNrOiBzdGF0ZS52YWx1ZSxcbiAgICAgIHR5cGVkZWY6IHN0YXRlLnR5cGVcbiAgICB9KVxuICB9XG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZnVuY3Rpb24gX2J1aWxkRE9NQWRkcmVzc2FibGVzIChlbGVtZW50TmFtZSwgbG9jYXRvcikge1xuICB2YXIgYWRkcmVzc2FibGVzID0gW11cblxuICBjb25zdCBkb21TY2hlbWEgPSBET01TY2hlbWFbZWxlbWVudE5hbWVdXG4gIGNvbnN0IGRvbUZhbGxiYWNrcyA9IERPTUZhbGxiYWNrc1tlbGVtZW50TmFtZV1cblxuICBpZiAoZG9tU2NoZW1hKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIGRvbVNjaGVtYSkge1xuICAgICAgbGV0IHByb3BlcnR5R3JvdXAgPSBudWxsXG5cbiAgICAgIGlmIChsb2NhdG9yID09PSAnMCcpIHsgLy8gVGhpcyBpbmRpY2F0ZXMgdGhlIHRvcCBsZXZlbCBlbGVtZW50ICh0aGUgYXJ0Ym9hcmQpXG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTX1RPUF9MRVZFTFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgbGV0IG5hbWVQYXJ0cyA9IHByb3BlcnR5TmFtZS5zcGxpdCgnLicpXG5cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dYJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd4J11cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dZJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd5J11cblxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgcHJlZml4OiBuYW1lUGFydHNbMF0sXG4gICAgICAgICAgICBzdWZmaXg6IG5hbWVQYXJ0c1sxXSxcbiAgICAgICAgICAgIGZhbGxiYWNrOiBkb21GYWxsYmFja3NbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHR5cGVkZWY6IGRvbVNjaGVtYVtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eUdyb3VwKSB7XG4gICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gQ0xVU1RFUkVEX1BST1BTW3Byb3BlcnR5R3JvdXAubmFtZV1cbiAgICAgICAgaWYgKGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwLmNsdXN0ZXIgPSB7XG4gICAgICAgICAgICBwcmVmaXg6IGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICBuYW1lOiBDTFVTVEVSX05BTUVTW2NsdXN0ZXJQcmVmaXhdXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkcmVzc2FibGVzLnB1c2gocHJvcGVydHlHcm91cClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRkcmVzc2FibGVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=