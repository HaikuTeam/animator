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
            e.stopPropagation();
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
            lineNumber: 1706
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
            lineNumber: 1752
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
              lineNumber: 1764
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1772
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
            e.stopPropagation();
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
            lineNumber: 1796
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
              lineNumber: 1844
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
              lineNumber: 1895
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
              lineNumber: 1911
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
                lineNumber: 1928
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
                  lineNumber: 1938
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1946
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
                lineNumber: 1956
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1965
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
                lineNumber: 1983
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
                  lineNumber: 1994
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2004
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
            lineNumber: 2024
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
            lineNumber: 2063
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
              lineNumber: 2106
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
                  lineNumber: 2122
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2123
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
                  lineNumber: 2132
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2133
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
                  lineNumber: 2138
                },
                __self: _this20
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2139
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
            lineNumber: 2150
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2152
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
            lineNumber: 2165
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
                lineNumber: 2185
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
                lineNumber: 2198
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
                lineNumber: 2208
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
              lineNumber: 2220
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
              lineNumber: 2243
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2262
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
                lineNumber: 2263
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
                lineNumber: 2276
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2290
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
            lineNumber: 2297
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
              lineNumber: 2310
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
                lineNumber: 2319
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2331
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2333
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
                    lineNumber: 2334
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
                lineNumber: 2338
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2353
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2355
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
                    lineNumber: 2356
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
                  lineNumber: 2359
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
                lineNumber: 2361
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2378
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2379
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2380
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2382
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
                  lineNumber: 2384
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2385
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2386
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2387
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
              lineNumber: 2394
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
            lineNumber: 2431
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
              lineNumber: 2441
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
                lineNumber: 2465
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
                  lineNumber: 2475
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2480
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
                  lineNumber: 2482
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2487
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
              lineNumber: 2491
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
              lineNumber: 2492
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
            lineNumber: 2507
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
            lineNumber: 2534
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2537
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
              lineNumber: 2538
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2549
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2550
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
              lineNumber: 2552
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
            lineNumber: 2567
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
            lineNumber: 2594
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
              lineNumber: 2602
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2610
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
                  lineNumber: 2611
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2616
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2616
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2617
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2617
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
              lineNumber: 2623
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
            lineNumber: 2638
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
              lineNumber: 2648
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
                lineNumber: 2660
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2670
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2670
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
              lineNumber: 2675
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
                lineNumber: 2684
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
                  lineNumber: 2697
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
              lineNumber: 2711
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
              lineNumber: 2720
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
              lineNumber: 2735
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
            lineNumber: 2786
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2817
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
              lineNumber: 2819
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
                lineNumber: 2827
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2834
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2834
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
                lineNumber: 2836
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
                  lineNumber: 2846
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
              lineNumber: 2855
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
              lineNumber: 2864
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
              lineNumber: 2878
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
          lineNumber: 2909
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
            lineNumber: 2912
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
            lineNumber: 2934
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
            lineNumber: 2950
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
              _this30.setState({ activeKeyframes: {} });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2961
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
            lineNumber: 2981
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwiYWN0aXZlS2V5ZnJhbWVzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIiwiaGFuZGxlIiwia2V5ZnJhbWVJbmRleCIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIiwiX3RpbWVsaW5lcyIsInVwZGF0ZVRpbWUiLCJmcmlNYXgiLCJnZXRDdXJyZW50VGltZWxpbmUiLCJzZWVrQW5kUGF1c2UiLCJmcmlCIiwiZnJpQSIsInRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJlcnJvciIsIm5hdGl2ZUV2ZW50IiwicmVmcyIsImV4cHJlc3Npb25JbnB1dCIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsImtleUNvZGUiLCJ0b2dnbGVQbGF5YmFjayIsIndoaWNoIiwidXBkYXRlU2NydWJiZXJQb3NpdGlvbiIsInVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIiwidXBkYXRlS2V5Ym9hcmRTdGF0ZSIsImV2ZW50RW1pdHRlciIsImV2ZW50TmFtZSIsImV2ZW50SGFuZGxlciIsIl9faXNTZWxlY3RlZCIsImNsb25lIiwiYXR0cmlidXRlcyIsInRyZWVVcGRhdGUiLCJEYXRlIiwibm93Iiwic2Nyb2xsdmlldyIsInNjcm9sbFRvcCIsInJvd3NEYXRhIiwiY29tcG9uZW50Um93c0RhdGEiLCJmb3VuZEluZGV4IiwiaW5kZXhDb3VudGVyIiwicm93SW5mbyIsImluZGV4IiwiaXNIZWFkaW5nIiwiaXNQcm9wZXJ0eSIsIl9faXNFeHBhbmRlZCIsImRvbU5vZGUiLCJjdXJ0b3AiLCJvZmZzZXRQYXJlbnQiLCJvZmZzZXRUb3AiLCJwYXJlbnQiLCJleHBhbmROb2RlIiwicm93IiwicHJvcGVydHkiLCJpdGVtIiwiZHJhZ1giLCJkcmFnU3RhcnQiLCJzY3J1YmJlckRyYWdTdGFydCIsImZyYW1lQmFzZWxpbmUiLCJkcmFnRGVsdGEiLCJmcmFtZURlbHRhIiwicHhwZiIsInNlZWsiLCJkdXJhdGlvbkRyYWdTdGFydCIsImFkZEludGVydmFsIiwic2V0SW50ZXJ2YWwiLCJjdXJyZW50TWF4IiwiZnJpTWF4MiIsImRyYWdJc0FkZGluZyIsImNsZWFySW50ZXJ2YWwiLCJ4bCIsInhyIiwiYWJzTCIsImFic1IiLCJzY3JvbGxlckxlZnREcmFnU3RhcnQiLCJzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0Iiwic2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0Iiwib2Zmc2V0TCIsInNjcm9sbGJhclN0YXJ0Iiwic2NSYXRpbyIsIm9mZnNldFIiLCJzY3JvbGxiYXJFbmQiLCJkaWZmWCIsImZMIiwiZlIiLCJmcmkwIiwiZGVsdGEiLCJsIiwiciIsInNwYW4iLCJuZXdMIiwibmV3UiIsInN0YXJ0VmFsdWUiLCJtYXliZUN1cnZlIiwiZW5kVmFsdWUiLCJjcmVhdGVLZXlmcmFtZSIsImZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlIiwiZ2V0IiwiYWN0aW9uIiwic3BsaXRTZWdtZW50Iiwiam9pbktleWZyYW1lcyIsImtleWZyYW1lRHJhZ1N0YXJ0UHgiLCJrZXlmcmFtZURyYWdTdGFydE1zIiwidHJhbnNpdGlvbkJvZHlEcmFnZ2luZyIsImN1cnZlRm9yV2lyZSIsImRlbGV0ZUtleWZyYW1lIiwiY2hhbmdlU2VnbWVudEN1cnZlIiwib2xkU3RhcnRNcyIsIm9sZEVuZE1zIiwibmV3U3RhcnRNcyIsIm5ld0VuZE1zIiwiY2hhbmdlU2VnbWVudEVuZHBvaW50cyIsIm9sZFRpbWVsaW5lTmFtZSIsIm5ld1RpbWVsaW5lTmFtZSIsInJlbmFtZVRpbWVsaW5lIiwiY3JlYXRlVGltZWxpbmUiLCJkdXBsaWNhdGVUaW1lbGluZSIsImRlbGV0ZVRpbWVsaW5lIiwibG9nIiwiayIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIm1zIiwia2V5ZnJhbWUiLCJmaW5kIiwiaWQiLCJfa2V5ZnJhbWVNb3ZlcyIsIm1vdmVtZW50S2V5Iiwiam9pbiIsImtleWZyYW1lTW92ZXNGb3JXaXJlIiwicGF1c2UiLCJwbGF5IiwidGVtcGxhdGUiLCJ2aXNpdFRlbXBsYXRlIiwiX19pc0hpZGRlbiIsImZvdW5kIiwic2VsZWN0Tm9kZSIsInNjcm9sbFRvTm9kZSIsImZpbmROb2Rlc0J5Q29tcG9uZW50SWQiLCJkZXNlbGVjdE5vZGUiLCJjb2xsYXBzZU5vZGUiLCJzY3JvbGxUb1RvcCIsInByb3BlcnR5TmFtZXMiLCJyZWxhdGVkRWxlbWVudCIsImZpbmRFbGVtZW50SW5UZW1wbGF0ZSIsIndhcm4iLCJhbGxSb3dzIiwiaW5kZXhPZiIsImFjdGl2YXRlUm93IiwiZGVhY3RpdmF0ZVJvdyIsImxvY2F0b3IiLCJzaWJsaW5ncyIsIml0ZXJhdGVlIiwibWFwcGVkT3V0cHV0IiwibGVmdEZyYW1lIiwicmlnaHRGcmFtZSIsImZyYW1lTW9kdWx1cyIsIml0ZXJhdGlvbkluZGV4IiwiZnJhbWVOdW1iZXIiLCJwaXhlbE9mZnNldExlZnQiLCJtYXBPdXRwdXQiLCJtc01vZHVsdXMiLCJsZWZ0TXMiLCJyaWdodE1zIiwidG90YWxNcyIsImZpcnN0TWFya2VyIiwibXNNYXJrZXJUbXAiLCJtc01hcmtlcnMiLCJtc01hcmtlciIsIm1zUmVtYWluZGVyIiwiZmxvb3IiLCJmcmFtZU9mZnNldCIsInB4T2Zmc2V0IiwiZnBzIiwibWF4bXMiLCJtYXhmIiwiZnJpVyIsImFicyIsInBTY3J4cGYiLCJweEEiLCJweEIiLCJweE1heDIiLCJtc0EiLCJtc0IiLCJzY0wiLCJzY0EiLCJzY0IiLCJhcmNoeUZvcm1hdCIsImdldEFyY2h5Rm9ybWF0Tm9kZXMiLCJhcmNoeVN0ciIsImxhYmVsIiwibm9kZXMiLCJmaWx0ZXIiLCJtYXAiLCJhc2NpaVN5bWJvbHMiLCJnZXRBc2NpaVRyZWUiLCJzcGxpdCIsImNvbXBvbmVudFJvd3MiLCJhZGRyZXNzYWJsZUFycmF5c0NhY2hlIiwidmlzaXRvckl0ZXJhdGlvbnMiLCJpc0NvbXBvbmVudCIsInNvdXJjZSIsImFzY2lpQnJhbmNoIiwiaGVhZGluZ1JvdyIsInByb3BlcnR5Um93cyIsIl9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyIsIl9idWlsZERPTUFkZHJlc3NhYmxlcyIsImNsdXN0ZXJIZWFkaW5nc0ZvdW5kIiwicHJvcGVydHlHcm91cERlc2NyaXB0b3IiLCJwcm9wZXJ0eVJvdyIsImNsdXN0ZXIiLCJjbHVzdGVyUHJlZml4IiwicHJlZml4IiwiY2x1c3RlcktleSIsImlzQ2x1c3RlckhlYWRpbmciLCJpc0NsdXN0ZXJNZW1iZXIiLCJjbHVzdGVyU2V0IiwiaiIsIm5leHRJbmRleCIsIm5leHREZXNjcmlwdG9yIiwiY2x1c3Rlck5hbWUiLCJpc0NsdXN0ZXIiLCJpdGVtcyIsIl9pbmRleCIsIl9pdGVtcyIsInNlZ21lbnRPdXRwdXRzIiwidmFsdWVHcm91cCIsImdldFZhbHVlR3JvdXAiLCJrZXlmcmFtZXNMaXN0Iiwia2V5ZnJhbWVLZXkiLCJwYXJzZUludCIsInNvcnQiLCJhIiwiYiIsIm1zY3VyciIsImlzTmFOIiwibXNwcmV2IiwibXNuZXh0IiwidW5kZWZpbmVkIiwicHJldiIsImN1cnIiLCJmcmFtZSIsInZhbHVlIiwiY3VydmUiLCJweE9mZnNldExlZnQiLCJweE9mZnNldFJpZ2h0Iiwic2VnbWVudE91dHB1dCIsInByb3BlcnR5RGVzY3JpcHRvciIsInByb3BlcnR5T3V0cHV0cyIsIm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJjb25jYXQiLCJwb3NpdGlvbiIsInJlbW92ZVRpbWVsaW5lU2hhZG93IiwidGltZWxpbmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUiLCJzZXRUaW1lbGluZU5hbWUiLCJpbnB1dEV2ZW50IiwiTnVtYmVyIiwiaW5wdXRJdGVtIiwiZ2V0Q3VycmVudFRpbWVsaW5lVGltZSIsImhlaWdodCIsIndpZHRoIiwib3ZlcmZsb3ciLCJtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyIsInNlZ21lbnRQaWVjZXMiLCJyZW5kZXJUcmFuc2l0aW9uQm9keSIsImNvbGxhcHNlZCIsImNvbGxhcHNlZEVsZW1lbnQiLCJyZW5kZXJDb25zdGFudEJvZHkiLCJyZW5kZXJTb2xvS2V5ZnJhbWUiLCJvcHRpb25zIiwiZHJhZ0V2ZW50IiwiZHJhZ0RhdGEiLCJzZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJ4IiwidW5zZXRSb3dDYWNoZUFjdGl2YXRpb24iLCJweENoYW5nZSIsImxhc3RYIiwibXNDaGFuZ2UiLCJkZXN0TXMiLCJlIiwic3RvcFByb3BhZ2F0aW9uIiwic2hpZnRLZXkiLCJjdHhNZW51RXZlbnQiLCJsb2NhbE9mZnNldFgiLCJvZmZzZXRYIiwidG90YWxPZmZzZXRYIiwiY2xpY2tlZE1zIiwiY2xpY2tlZEZyYW1lIiwic2hvdyIsImV2ZW50Iiwic3RhcnRGcmFtZSIsImVuZEZyYW1lIiwiZGlzcGxheSIsInpJbmRleCIsImN1cnNvciIsImlzQWN0aXZlIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsIkJMVUUiLCJjb2xsYXBzZWRQcm9wZXJ0eSIsIkRBUktfUk9DSyIsIkxJR0hURVNUX1BJTksiLCJST0NLIiwidW5pcXVlS2V5IiwiY2hhckF0IiwidG9VcHBlckNhc2UiLCJzbGljZSIsImJyZWFraW5nQm91bmRzIiwiaW5jbHVkZXMiLCJDdXJ2ZVNWRyIsImZpcnN0S2V5ZnJhbWVBY3RpdmUiLCJzZWNvbmRLZXlmcmFtZUFjdGl2ZSIsImRvbUVsZW1lbnQiLCJyZWFjdEV2ZW50Iiwic3R5bGUiLCJjb2xvciIsIkdSQVkiLCJXZWJraXRVc2VyU2VsZWN0IiwiYm9yZGVyUmFkaXVzIiwiYmFja2dyb3VuZENvbG9yIiwiU1VOU1RPTkUiLCJmYWRlIiwicGFkZGluZ1RvcCIsInJpZ2h0IiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIsIm5hbWVQYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FB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bkIsQ0FBaEI7QUFDQTROLDBCQUFnQjtBQUNkMWQsa0JBQU1kLFlBRFE7QUFFZDRSLG9CQUFRNk0sV0FBVSxDQUFWLENBRk07QUFHZE4sb0JBQVFNLFdBQVUsQ0FBVixDQUhNO0FBSWRMLHNCQUFVRyxhQUFhdmUsWUFBYixDQUpJO0FBS2RxZSxxQkFBU0MsVUFBVXRlLFlBQVY7QUFMSyxXQUFoQjtBQU9EO0FBQ0Y7O0FBRUQsVUFBSXdlLGFBQUosRUFBbUI7QUFDakIsWUFBSTdNLGdCQUFnQnZWLGdCQUFnQm9pQixjQUFjMWQsSUFBOUIsQ0FBcEI7QUFDQSxZQUFJNlEsYUFBSixFQUFtQjtBQUNqQjZNLHdCQUFjOU0sT0FBZCxHQUF3QjtBQUN0QkUsb0JBQVFELGFBRGM7QUFFdEI3USxrQkFBTXpFLGNBQWNzVixhQUFkO0FBRmdCLFdBQXhCO0FBSUQ7O0FBRURzTSxxQkFBYXRlLElBQWIsQ0FBa0I2ZSxhQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPUCxZQUFQO0FBQ0Q7O2tCQUVjeGdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBhY3RpdmVLZXlmcmFtZXM6IHt9LFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuLyoqXG4gKiBIZXkhIElmIHlvdSB3YW50IHRvIEFERCBhbnkgcHJvcGVydGllcyBoZXJlLCB5b3UgbWlnaHQgYWxzbyBuZWVkIHRvIHVwZGF0ZSB0aGUgZGljdGlvbmFyeSBpblxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSxcbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MsXG4gKiBvciB0aGV5IG1pZ2h0IG5vdCBzaG93IHVwIGluIHRoZSB2aWV3LlxuICovXG5cbmNvbnN0IEFMTE9XRURfUFJPUFMgPSB7XG4gICd0cmFuc2xhdGlvbi54JzogdHJ1ZSxcbiAgJ3RyYW5zbGF0aW9uLnknOiB0cnVlLFxuICAvLyAndHJhbnNsYXRpb24ueic6IHRydWUsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLnonOiB0cnVlLFxuICAncm90YXRpb24ueCc6IHRydWUsXG4gICdyb3RhdGlvbi55JzogdHJ1ZSxcbiAgJ3NjYWxlLngnOiB0cnVlLFxuICAnc2NhbGUueSc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgLy8gJ3Nob3duJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWVcbiAgLy8gJ2NvbG9yJzogdHJ1ZSxcbiAgLy8gJ2ZpbGwnOiB0cnVlLFxuICAvLyAnc3Ryb2tlJzogdHJ1ZVxufVxuXG5jb25zdCBDTFVTVEVSRURfUFJPUFMgPSB7XG4gICdtb3VudC54JzogJ21vdW50JyxcbiAgJ21vdW50LnknOiAnbW91bnQnLFxuICAnbW91bnQueic6ICdtb3VudCcsXG4gICdhbGlnbi54JzogJ2FsaWduJyxcbiAgJ2FsaWduLnknOiAnYWxpZ24nLFxuICAnYWxpZ24ueic6ICdhbGlnbicsXG4gICdvcmlnaW4ueCc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnknOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi56JzogJ29yaWdpbicsXG4gICd0cmFuc2xhdGlvbi54JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueic6ICd0cmFuc2xhdGlvbicsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLngnOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueSc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi56JzogJ3JvdGF0aW9uJyxcbiAgLy8gJ3JvdGF0aW9uLncnOiAncm90YXRpb24nLCAvLyBQcm9iYWJseSBlYXNpZXN0IG5vdCB0byBsZXQgdGhlIHVzZXIgaGF2ZSBjb250cm9sIG92ZXIgcXVhdGVybmlvbiBtYXRoXG4gICdzY2FsZS54JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnknOiAnc2NhbGUnLFxuICAnc2NhbGUueic6ICdzY2FsZScsXG4gICdzaXplTW9kZS54JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnknOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueic6ICdzaXplTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsLngnOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnknOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnonOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLngnOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnknOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnonOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplQWJzb2x1dGUueCc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnknOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS56JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnb3ZlcmZsb3cnLFxuICAnc3R5bGUub3ZlcmZsb3dZJzogJ292ZXJmbG93J1xufVxuXG5jb25zdCBDTFVTVEVSX05BTUVTID0ge1xuICAnbW91bnQnOiAnTW91bnQnLFxuICAnYWxpZ24nOiAnQWxpZ24nLFxuICAnb3JpZ2luJzogJ09yaWdpbicsXG4gICd0cmFuc2xhdGlvbic6ICdQb3NpdGlvbicsXG4gICdyb3RhdGlvbic6ICdSb3RhdGlvbicsXG4gICdzY2FsZSc6ICdTY2FsZScsXG4gICdzaXplTW9kZSc6ICdTaXppbmcgTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsJzogJ1NpemUgJScsXG4gICdzaXplRGlmZmVyZW50aWFsJzogJ1NpemUgKy8tJyxcbiAgJ3NpemVBYnNvbHV0ZSc6ICdTaXplJyxcbiAgJ292ZXJmbG93JzogJ092ZXJmbG93J1xufVxuXG5jb25zdCBBTExPV0VEX1BST1BTX1RPUF9MRVZFTCA9IHtcbiAgJ3NpemVBYnNvbHV0ZS54JzogdHJ1ZSxcbiAgJ3NpemVBYnNvbHV0ZS55JzogdHJ1ZSxcbiAgLy8gRW5hYmxlIHRoZXNlIGFzIHN1Y2ggYSB0aW1lIGFzIHdlIGNhbiByZXByZXNlbnQgdGhlbSB2aXN1YWxseSBpbiB0aGUgZ2xhc3NcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WCc6IHRydWUsXG4gIC8vICdzdHlsZS5vdmVyZmxvd1knOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlXG59XG5cbmNvbnN0IEFMTE9XRURfVEFHTkFNRVMgPSB7XG4gIGRpdjogdHJ1ZSxcbiAgc3ZnOiB0cnVlLFxuICBnOiB0cnVlLFxuICByZWN0OiB0cnVlLFxuICBjaXJjbGU6IHRydWUsXG4gIGVsbGlwc2U6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHBvbHlsaW5lOiB0cnVlLFxuICBwb2x5Z29uOiB0cnVlXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAobmF0aXZlRXZlbnQpIHtcbiAgICBzd2l0Y2ggKG5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICAvLyBjYXNlIDI3OiAvL2VzY2FwZVxuICAgICAgLy8gY2FzZSAzMjogLy9zcGFjZVxuICAgICAgLy8gY2FzZSAzNzogLy9sZWZ0XG4gICAgICAvLyBjYXNlIDM5OiAvL3JpZ2h0XG4gICAgICAvLyBjYXNlIDM4OiAvL3VwXG4gICAgICAvLyBjYXNlIDQwOiAvL2Rvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDg6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb250cm9sS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUtleWJvYXJkU3RhdGUgKHVwZGF0ZXMpIHtcbiAgICAvLyBJZiB0aGUgaW5wdXQgaXMgZm9jdXNlZCwgZG9uJ3QgYWxsb3cga2V5Ym9hcmQgc3RhdGUgY2hhbmdlcyB0byBjYXVzZSBhIHJlLXJlbmRlciwgb3RoZXJ3aXNlXG4gICAgLy8gdGhlIGlucHV0IGZpZWxkIHdpbGwgc3dpdGNoIGJhY2sgdG8gaXRzIHByZXZpb3VzIGNvbnRlbnRzIChlLmcuIHdoZW4gaG9sZGluZyBkb3duICdzaGlmdCcpXG4gICAgaWYgKCF0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUodXBkYXRlcylcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgICAgdGhpcy5zdGF0ZVtrZXldID0gdXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYWRkRW1pdHRlckxpc3RlbmVyIChldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKSB7XG4gICAgdGhpcy5lbWl0dGVycy5wdXNoKFtldmVudEVtaXR0ZXIsIGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyXSlcbiAgICBldmVudEVtaXR0ZXIub24oZXZlbnROYW1lLCBldmVudEhhbmRsZXIpXG4gIH1cblxuICAvKlxuICAgKiBzZXR0ZXJzL3VwZGF0ZXJzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGRlc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2VsZWN0Tm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc1NlbGVjdGVkID0gdHJ1ZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNjcm9sbFRvVG9wICgpIHtcbiAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IDBcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb05vZGUgKG5vZGUpIHtcbiAgICB2YXIgcm93c0RhdGEgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgdmFyIGZvdW5kSW5kZXggPSBudWxsXG4gICAgdmFyIGluZGV4Q291bnRlciA9IDBcbiAgICByb3dzRGF0YS5mb3JFYWNoKChyb3dJbmZvLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNIZWFkaW5nKSB7XG4gICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICB9IGVsc2UgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmRJbmRleCA9PT0gbnVsbCkge1xuICAgICAgICBpZiAocm93SW5mby5ub2RlICYmIHJvd0luZm8ubm9kZSA9PT0gbm9kZSkge1xuICAgICAgICAgIGZvdW5kSW5kZXggPSBpbmRleENvdW50ZXJcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gICAgaWYgKGZvdW5kSW5kZXggIT09IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAoZm91bmRJbmRleCAqIHRoaXMuc3RhdGUucm93SGVpZ2h0KSAtIHRoaXMuc3RhdGUucm93SGVpZ2h0XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZmluZERvbU5vZGVPZmZzZXRZIChkb21Ob2RlKSB7XG4gICAgdmFyIGN1cnRvcCA9IDBcbiAgICBpZiAoZG9tTm9kZS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgY3VydG9wICs9IGRvbU5vZGUub2Zmc2V0VG9wXG4gICAgICB9IHdoaWxlIChkb21Ob2RlID0gZG9tTm9kZS5vZmZzZXRQYXJlbnQpIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICB9XG4gICAgcmV0dXJuIGN1cnRvcFxuICB9XG5cbiAgY29sbGFwc2VOb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgIHZpc2l0KG5vZGUsIChjaGlsZCkgPT4ge1xuICAgICAgY2hpbGQuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICAgIGNoaWxkLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgfSlcbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGxldCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgZXhwYW5kTm9kZSAobm9kZSwgY29tcG9uZW50SWQpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICBpZiAobm9kZS5wYXJlbnQpIHRoaXMuZXhwYW5kTm9kZShub2RlLnBhcmVudCkgLy8gSWYgd2UgYXJlIGV4cGFuZGVkLCBvdXIgcGFyZW50IGhhcyB0byBiZSB0b29cbiAgICBsZXQgZXhwYW5kZWROb2RlcyA9IHRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1xuICAgIGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGRlYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSBmYWxzZVxuICAgIH1cbiAgfVxuXG4gIGlzUm93QWN0aXZhdGVkIChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXVxuICAgIH1cbiAgfVxuXG4gIGlzQ2x1c3RlckFjdGl2YXRlZCAoaXRlbSkge1xuICAgIHJldHVybiBmYWxzZSAvLyBUT0RPXG4gIH1cblxuICB0b2dnbGVUaW1lRGlzcGxheU1vZGUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ3NlY29uZHMnXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdmcmFtZXMnXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGNoYW5nZVNjcnViYmVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydFxuICAgIHZhciBmcmFtZUJhc2VsaW5lID0gdGhpcy5zdGF0ZS5mcmFtZUJhc2VsaW5lXG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIHZhciBjdXJyZW50RnJhbWUgPSBmcmFtZUJhc2VsaW5lICsgZnJhbWVEZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaUIpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgY2hhbmdlRHVyYXRpb25Nb2RpZmllclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuZHVyYXRpb25EcmFnU3RhcnRcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgaWYgKGRyYWdEZWx0YSA+IDAgJiYgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gPj0gMCkge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLmFkZEludGVydmFsKSB7XG4gICAgICAgIHZhciBhZGRJbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIDIwfSlcbiAgICAgICAgfSwgMzAwKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHthZGRJbnRlcnZhbDogYWRkSW50ZXJ2YWx9KVxuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7ZHJhZ0lzQWRkaW5nOiB0cnVlfSlcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkgY2xlYXJJbnRlcnZhbCh0aGlzLnN0YXRlLmFkZEludGVydmFsKVxuICAgIC8vIERvbid0IGxldCB1c2VyIGRyYWcgYmFjayBwYXN0IGxhc3QgZnJhbWU7IGFuZCBkb24ndCBsZXQgdGhlbSBkcmFnIG1vcmUgdGhhbiBhbiBlbnRpcmUgd2lkdGggb2YgZnJhbWVzXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCICsgZnJhbWVEZWx0YSA8PSBmcmFtZUluZm8uZnJpTWF4IHx8IC1mcmFtZURlbHRhID49IGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgIGZyYW1lRGVsdGEgPSB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSAvLyBUb2RvOiBtYWtlIG1vcmUgcHJlY2lzZSBzbyBpdCByZW1vdmVzIGFzIG1hbnkgZnJhbWVzIGFzXG4gICAgICByZXR1cm4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQgY2FuIGluc3RlYWQgb2YgY29tcGxldGVseSBpZ25vcmluZyB0aGUgZHJhZ1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25UcmltOiBmcmFtZURlbHRhLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbCB9KVxuICB9XG5cbiAgY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UgKHhsLCB4ciwgZnJhbWVJbmZvKSB7XG4gICAgbGV0IGFic0wgPSBudWxsXG4gICAgbGV0IGFic1IgPSBudWxsXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgIGFic0wgPSB4bFxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNSID0geHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0KSB7XG4gICAgICBjb25zdCBvZmZzZXRMID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyU3RhcnQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3Qgb2Zmc2V0UiA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhckVuZCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBkaWZmWCA9IHhsIC0gdGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnRcbiAgICAgIGFic0wgPSBvZmZzZXRMICsgZGlmZlhcbiAgICAgIGFic1IgPSBvZmZzZXRSICsgZGlmZlhcbiAgICB9XG5cbiAgICBsZXQgZkwgPSAoYWJzTCAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNMICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIGxldCBmUiA9IChhYnNSICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic1IgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgbGVmdCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZMIDw9IGZyYW1lSW5mby5mcmkwKSB7XG4gICAgICBmTCA9IGZyYW1lSW5mby5mcmkwXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLSBmTClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTdG9wIHRoZSBzY3JvbGxlciBhdCB0aGUgcmlnaHQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmUiA+PSBmcmFtZUluZm8uZnJpTWF4Mikge1xuICAgICAgZkwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlckxlZnREcmFnU3RhcnQpIHtcbiAgICAgICAgZlIgPSBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2ZMLCBmUl0gfSlcbiAgfVxuXG4gIHVwZGF0ZVZpc2libGVGcmFtZVJhbmdlIChkZWx0YSkge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSArIGRlbHRhXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdICsgZGVsdGFcbiAgICBpZiAobCA+PSAwKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtsLCByXSB9KVxuICAgIH1cbiAgfVxuXG4gIC8vIHdpbGwgbGVmdC1hbGlnbiB0aGUgY3VycmVudCB0aW1lbGluZSB3aW5kb3cgKG1haW50YWluaW5nIHpvb20pXG4gIHRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZSAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgdmFyIHIgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXG4gICAgdmFyIHNwYW4gPSByIC0gbFxuICAgIHZhciBuZXdMID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWVcbiAgICB2YXIgbmV3UiA9IG5ld0wgKyBzcGFuXG5cbiAgICBpZiAobmV3UiA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgIG5ld0wgLT0gKG5ld1IgLSBmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgbmV3UiA9IGZyYW1lSW5mby5mcmlNYXhcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtuZXdMLCBuZXdSXSB9KVxuICB9XG5cbiAgdXBkYXRlU2NydWJiZXJQb3NpdGlvbiAoZGVsdGEpIHtcbiAgICB2YXIgY3VycmVudEZyYW1lID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKyBkZWx0YVxuICAgIGlmIChjdXJyZW50RnJhbWUgPD0gMCkgY3VycmVudEZyYW1lID0gMFxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZUtleWZyYW1lIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUpIHtcbiAgICAvLyBOb3RlIHRoYXQgaWYgc3RhcnRWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSBwcmV2aW91cyB2YWx1ZSB3aWxsIGJlIGV4YW1pbmVkIHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgdGhlIHByZXNlbnQgb25lXG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWUsIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnaG9zdEluc3RhbmNlJyksIHRoaXMuX2NvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnc3RhdGVzJykpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBObyBuZWVkIHRvICdleHByZXNzaW9uVG9STycgaGVyZSBiZWNhdXNlIGlmIHdlIGdvdCBhbiBleHByZXNzaW9uLCB0aGF0IHdvdWxkIGhhdmUgYWxyZWFkeSBiZWVuIHByb3ZpZGVkIGluIGl0cyBzZXJpYWxpemVkIF9fZnVuY3Rpb24gZm9ybVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlXSwgKCkgPT4ge30pXG5cbiAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdzdmcnICYmIHByb3BlcnR5TmFtZSA9PT0gJ29wYWNpdHknKSB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQubmV4dCgpXG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50IChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnNwbGl0U2VnbWVudCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc3BsaXRTZWdtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkpvaW5LZXlmcmFtZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuam9pbktleWZyYW1lcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsXG4gICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEN1cnZlKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY2hhbmdlU2VnbWVudEVuZHBvaW50cyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NoYW5nZVNlZ21lbnRFbmRwb2ludHMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBvbGRTdGFydE1zLCBvbGRFbmRNcywgbmV3U3RhcnRNcywgbmV3RW5kTXNdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lIChvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5yZW5hbWVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3JlbmFtZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm90ZTogV2UgbWF5IG5lZWQgdG8gcmVtZW1iZXIgdG8gc2VyaWFsaXplIGEgdGltZWxpbmUgZGVzY3JpcHRvciBoZXJlXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmR1cGxpY2F0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2R1cGxpY2F0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykge1xuICAgIHJldHVybiBmYWxzZVxuXG5cbiAgICAvLyAgZm9yIHJlZmVyZW5jZTogdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1cblxuICAgIC8vIGZvciByZWZlcmVuY2U6XG4gICAgLy8gYWN0aXZlS2V5ZnJhbWVzLnB1c2goe1xuICAgIC8vICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgcHJvcGVydHlOYW1lLFxuICAgIC8vICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgLy8gICAgICAgICBtczogY3Vyci5tcyxcbiAgICAvLyAgICAgICAgIGhhbmRsZSxcbiAgICAvLyAgICAgICAgIGNvbXBvbmVudElkLFxuICAgIC8vICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgLy8gICAgICAgfSlcblxuICAgIC8vIFRheWxvciBDaGFuZ2UgTm90ZSAoOC4xMC4xNyk6IHJhdGhlciB0aGFuIHB1bGxpbmcgdGhlc2UgaW4gZnJvbSB0aGUgbWV0aG9kIGNhbGwsIEknbSBqdXN0IGdyYWJiaW5nIHRoZW0gaGVyZTpcblxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzKVxuXG4gICAgdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXMuZm9yRWFjaCgoaykgPT4ge1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnb2xkbW92ZScsIFtcbiAgICAgIC8vICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAvLyAgIGNvbXBvbmVudElkLFxuICAgICAgLy8gICB0aW1lbGluZU5hbWUsXG4gICAgICAvLyAgIHByb3BlcnR5TmFtZSxcbiAgICAgIC8vICAgaGFuZGxlLFxuICAgICAgLy8gICBrZXlmcmFtZUluZGV4LFxuICAgICAgLy8gICBzdGFydE1zLFxuICAgICAgLy8gICBlbmRNc1xuICAgICAgLy8gXSlcbiAgICAgIC8vIGNvbnNvbGUubG9nKCduZXdtb3ZlJywgW3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgLy8gICBrLmNvbXBvbmVudElkLFxuICAgICAgLy8gICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAvLyAgIGsucHJvcGVydHlOYW1lLFxuICAgICAgLy8gICBrLmhhbmRsZSxcbiAgICAgIC8vICAgay5pbmRleCxcbiAgICAgIC8vICAgay5tcyxcbiAgICAgIC8vICAgZW5kTXNcbiAgICAgIC8vIF0pXG5cbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKFxuICAgICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgay5jb21wb25lbnRJZCxcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICBrLnByb3BlcnR5TmFtZSxcbiAgICAgICAgay5oYW5kbGUsXG4gICAgICAgIGsuaW5kZXgsXG4gICAgICAgIGsubXMsXG4gICAgICAgIGVuZE1zLFxuICAgICAgICBmcmFtZUluZm9cbiAgICAgIClcblxuICAgICAgLy8gYWZ0ZXIgbW92aW5nIGFsbCBhY3RpdmVLZXlmcmFtZXMsIG1ha2Ugc3VyZSB3ZSBzZXQgdGhlIG5ldyBjdXJyIG1zIG9uIGVhY2ggb2YgdGhlbVxuICAgICAgLy8gY29uc29sZS5sb2coJ3ByZSBzdGF0ZScsIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzKVxuXG4gICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgIGNvbnN0IGtleWZyYW1lID0gbG9kYXNoLmZpbmQoYWN0aXZlS2V5ZnJhbWVzLCB7IGlkOiBrLmlkIH0pXG5cbiAgICAgIC8vIHRoZXNlIHR3byBzaG91bGQgYmUgc2FtZSwgYnV0IHRoZXkncmUgbm90IDooXG4gICAgICBjb25zb2xlLmxvZygna2V5ZnJhbWUubXMnLCBrZXlmcmFtZS5tcylcbiAgICAgIGNvbnNvbGUubG9nKCdzdGFydE1zJywgc3RhcnRNcylcblxuICAgICAgLyogc3RhcnRNcyBpc24ndCBnZXR0aW5nIGZhciBlbm91Z2ggYWxvbmcgbmV4dCB0aW1lIGl0IGNvbWVzIGluLlxuICAgICAgdGhlIGtleWZyYW1lLm1zIHdoaWNoIGlzIHNldCBieSB0aGUgcHJldmlvdXMgZW5kTXMgaXMgdG9vIGZhciBhaGVhZFxuXG4gICAgICB3aGF0IGkgcmVhbGx5IG5lZWQgdG8ga25vdyBpcyB3aGF0J3MgdGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHByZXZpb3VzIGRyYWcgKG9mIHRoZSBvbmUgSSdtIGRyYWdnaW5nKVxuICAgICAgdGhlbiBJIGNhbiBhcHBseSB0aGlzIHRvIGl0cyBvd24gbmV4dCBzdGFydGluZyBwbGFjZSAoa2V5ZnJhbWUubXMpLFxuICAgICAgYnV0IGFsc28gdG8gdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIGFsbCB0aGUgb3RoZXJzIGluIHRoZSBkcmFnIGNvbGxlY3Rpb25cblxuICAgICovXG5cbiAgICAgIC8vIHRoZXNlIHR3byBzaG91bGQgYmUgc2FtZSwgYnV0IHRoZXkncmUgbm90IDooXG4gICAgICBjb25zb2xlLmxvZygnZW5kTXMnLCBlbmRNcylcbiAgICAgIGNvbnNvbGUubG9nKCdiZWdpbm5pbmdfa2V5ZnJhbWUubXMrIGVuZCAtIHN0YXJ0Jywga2V5ZnJhbWUubXMrIGVuZE1zIC0gc3RhcnRNcylcblxuICAgICAga2V5ZnJhbWUubXMgPSBrZXlmcmFtZS5tcysgZW5kTXMgLSBzdGFydE1zIC8vIG91Z2h0IHRvIHVzZSB0aGlzLCBidXQgZG9lc24ndCB3b3JrIHlldFxuICAgICAga2V5ZnJhbWUubXMgPSBlbmRNc1xuXG4gICAgICAvLyBjb25zb2xlLmxvZygnYWRqdXN0ZWQgbXMnLCBrZXlmcmFtZS5tcylcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7YWN0aXZlS2V5ZnJhbWVzfSwgKCkgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygncG9zdCBzdGF0ZScsIHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgIH0pXG4gICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgICAgfVxuICAgIH0pXG5cblxuICAgIC8vIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMsIGZyYW1lSW5mbylcblxuICAgIC8vIC8vIFRoZSAna2V5ZnJhbWVNb3ZlcycgaW5kaWNhdGUgYSBsaXN0IG9mIGNoYW5nZXMgd2Uga25vdyBvY2N1cnJlZC4gT25seSBpZiBzb21lIG9jY3VycmVkIGRvIHdlIGJvdGhlciB0byB1cGRhdGUgdGhlIG90aGVyIHZpZXdzXG4gICAgLy8gaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAvLyAgIHRoaXMuc2V0U3RhdGUoe1xuICAgIC8vICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgIC8vICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIC8vICAgfSlcblxuICAgIC8vICAgLy8gSXQncyB2ZXJ5IGhlYXZ5IHRvIHRyYW5zbWl0IGEgd2Vic29ja2V0IG1lc3NhZ2UgZm9yIGV2ZXJ5IHNpbmdsZSBtb3ZlbWVudCB3aGlsZSB1cGRhdGluZyB0aGUgdWksXG4gICAgLy8gICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgLy8gICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgIC8vICAgbGV0IG1vdmVtZW50S2V5ID0gW2NvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZV0uam9pbignLScpXG4gICAgLy8gICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgIC8vICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgIC8vIH1cblxuICB9XG5cbiAgZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uICgpIHtcbiAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHJldHVybiB2b2lkICgwKVxuICAgIGZvciAobGV0IG1vdmVtZW50S2V5IGluIHRoaXMuX2tleWZyYW1lTW92ZXMpIHtcbiAgICAgIGlmICghbW92ZW1lbnRLZXkpIGNvbnRpbnVlXG4gICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldKSBjb250aW51ZVxuICAgICAgbGV0IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfSA9IHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG5cbiAgICAgIC8vIE1ha2Ugc3VyZSBhbnkgZnVuY3Rpb25zIGdldCBjb252ZXJ0ZWQgaW50byB0aGVpciBzZXJpYWwgZm9ybSBiZWZvcmUgcGFzc2luZyBvdmVyIHRoZSB3aXJlXG4gICAgICBsZXQga2V5ZnJhbWVNb3Zlc0ZvcldpcmUgPSBleHByZXNzaW9uVG9STyhrZXlmcmFtZU1vdmVzKVxuXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ21vdmVLZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzRm9yV2lyZSwgZnJhbWVJbmZvXSwgKCkgPT4ge30pXG4gICAgICBkZWxldGUgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cbiAgICB9XG4gIH1cblxuICB0b2dnbGVQbGF5YmFjayAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IGZhbHNlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc1BsYXllclBsYXlpbmc6IHRydWVcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBsYXkoKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZWh5ZHJhdGVCeXRlY29kZSAocmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUpIHtcbiAgICBpZiAocmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgICBpZiAocmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICAgIGlmICghaWQpIHJldHVybiB2b2lkICgwKVxuICAgICAgICAgIG5vZGUuX19pc1NlbGVjdGVkID0gISF0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzRXhwYW5kZWQgPSAhIXRoaXMuc3RhdGUuZXhwYW5kZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNIaWRkZW4gPSAhIXRoaXMuc3RhdGUuaGlkZGVuTm9kZXNbaWRdXG4gICAgICAgIH0pXG4gICAgICAgIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgICB9XG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMocmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uU2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICBsZXQgZm91bmQgPSBbXVxuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50KSA9PiB7XG4gICAgICAgIG5vZGUucGFyZW50ID0gcGFyZW50XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgdGhpcy5zZWxlY3ROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuZXhwYW5kTm9kZShub2RlKVxuICAgICAgICB0aGlzLnNjcm9sbFRvTm9kZShub2RlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25VbnNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGxldCBmb3VuZCA9IHRoaXMuZmluZE5vZGVzQnlDb21wb25lbnRJZChjb21wb25lbnRJZClcbiAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICB0aGlzLmRlc2VsZWN0Tm9kZShub2RlKVxuICAgICAgdGhpcy5jb2xsYXBzZU5vZGUobm9kZSlcbiAgICAgIHRoaXMuc2Nyb2xsVG9Ub3Aobm9kZSlcbiAgICB9KVxuICB9XG5cbiAgZmluZE5vZGVzQnlDb21wb25lbnRJZCAoY29tcG9uZW50SWQpIHtcbiAgICB2YXIgZm91bmQgPSBbXVxuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgbWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgc3RhcnRNcywgcHJvcGVydHlOYW1lcykge1xuICAgIGxldCByZWxhdGVkRWxlbWVudCA9IHRoaXMuZmluZEVsZW1lbnRJblRlbXBsYXRlKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICBsZXQgZWxlbWVudE5hbWUgPSByZWxhdGVkRWxlbWVudCAmJiByZWxhdGVkRWxlbWVudC5lbGVtZW50TmFtZVxuICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgIHJldHVybiBjb25zb2xlLndhcm4oJ0NvbXBvbmVudCAnICsgY29tcG9uZW50SWQgKyAnIG1pc3NpbmcgZWxlbWVudCwgYW5kIHdpdGhvdXQgYW4gZWxlbWVudCBuYW1lIEkgY2Fubm90IHVwZGF0ZSBhIHByb3BlcnR5IHZhbHVlJylcbiAgICB9XG5cbiAgICB2YXIgYWxsUm93cyA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICBhbGxSb3dzLmZvckVhY2goKHJvd0luZm8pID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzUHJvcGVydHkgJiYgcm93SW5mby5jb21wb25lbnRJZCA9PT0gY29tcG9uZW50SWQgJiYgcHJvcGVydHlOYW1lcy5pbmRleE9mKHJvd0luZm8ucHJvcGVydHkubmFtZSkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBhY3RpdmF0ZWRSb3dzOiBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzKSxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgLypcbiAgICogaXRlcmF0b3JzL3Zpc2l0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGZpbmRFbGVtZW50SW5UZW1wbGF0ZSAoY29tcG9uZW50SWQsIHJlaWZpZWRCeXRlY29kZSkge1xuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlKSByZXR1cm4gdm9pZCAoMClcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgbGV0IGZvdW5kXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kID0gbm9kZVxuICAgIH0pXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICB2aXNpdFRlbXBsYXRlIChsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLCBwYXJlbnQsIGl0ZXJhdGVlKSB7XG4gICAgaXRlcmF0ZWUodGVtcGxhdGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICBpZiAodGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGVtcGxhdGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGNoaWxkID0gdGVtcGxhdGUuY2hpbGRyZW5baV1cbiAgICAgICAgaWYgKCFjaGlsZCB8fCB0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSBjb250aW51ZVxuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUobG9jYXRvciArICcuJyArIGksIGksIHRlbXBsYXRlLmNoaWxkcmVuLCBjaGlsZCwgdGVtcGxhdGUsIGl0ZXJhdGVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1hcFZpc2libGVGcmFtZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCByaWdodEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICBjb25zdCBmcmFtZU1vZHVsdXMgPSBnZXRGcmFtZU1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgbGV0IGl0ZXJhdGlvbkluZGV4ID0gLTFcbiAgICBmb3IgKGxldCBpID0gbGVmdEZyYW1lOyBpIDwgcmlnaHRGcmFtZTsgaSsrKSB7XG4gICAgICBpdGVyYXRpb25JbmRleCsrXG4gICAgICBsZXQgZnJhbWVOdW1iZXIgPSBpXG4gICAgICBsZXQgcGl4ZWxPZmZzZXRMZWZ0ID0gaXRlcmF0aW9uSW5kZXggKiBmcmFtZUluZm8ucHhwZlxuICAgICAgaWYgKHBpeGVsT2Zmc2V0TGVmdCA8PSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSB7XG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBmcmFtZUluZm8ucHhwZiwgZnJhbWVNb2R1bHVzKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSB7XG4gICAgICAgICAgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIG1hcFZpc2libGVUaW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBtc01vZHVsdXMgPSBnZXRNaWxsaXNlY29uZE1vZHVsdXMoZnJhbWVJbmZvLnB4cGYpXG4gICAgY29uc3QgbGVmdEZyYW1lID0gZnJhbWVJbmZvLmZyaUFcbiAgICBjb25zdCBsZWZ0TXMgPSBmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgcmlnaHRNcyA9IGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCB0b3RhbE1zID0gcmlnaHRNcyAtIGxlZnRNc1xuICAgIGNvbnN0IGZpcnN0TWFya2VyID0gcm91bmRVcChsZWZ0TXMsIG1zTW9kdWx1cylcbiAgICBsZXQgbXNNYXJrZXJUbXAgPSBmaXJzdE1hcmtlclxuICAgIGNvbnN0IG1zTWFya2VycyA9IFtdXG4gICAgd2hpbGUgKG1zTWFya2VyVG1wIDw9IHJpZ2h0TXMpIHtcbiAgICAgIG1zTWFya2Vycy5wdXNoKG1zTWFya2VyVG1wKVxuICAgICAgbXNNYXJrZXJUbXAgKz0gbXNNb2R1bHVzXG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbXNNYXJrZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNNYXJrZXIgPSBtc01hcmtlcnNbaV1cbiAgICAgIGxldCBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zTWFya2VyLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIGxldCBtc1JlbWFpbmRlciA9IE1hdGguZmxvb3IobmVhcmVzdEZyYW1lICogZnJhbWVJbmZvLm1zcGYgLSBtc01hcmtlcilcbiAgICAgIC8vIFRPRE86IGhhbmRsZSB0aGUgbXNSZW1haW5kZXIgY2FzZSByYXRoZXIgdGhhbiBpZ25vcmluZyBpdFxuICAgICAgaWYgKCFtc1JlbWFpbmRlcikge1xuICAgICAgICBsZXQgZnJhbWVPZmZzZXQgPSBuZWFyZXN0RnJhbWUgLSBsZWZ0RnJhbWVcbiAgICAgICAgbGV0IHB4T2Zmc2V0ID0gZnJhbWVPZmZzZXQgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUobXNNYXJrZXIsIHB4T2Zmc2V0LCB0b3RhbE1zKVxuICAgICAgICBpZiAobWFwT3V0cHV0KSBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRPdXRwdXRcbiAgfVxuXG4gIC8qXG4gICAqIGdldHRlcnMvY2FsY3VsYXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLyoqXG4gICAgLy8gU29ycnk6IFRoZXNlIHNob3VsZCBoYXZlIGJlZW4gZ2l2ZW4gaHVtYW4tcmVhZGFibGUgbmFtZXNcbiAgICA8R0FVR0U+XG4gICAgICAgICAgICA8LS0tLWZyaVctLS0+XG4gICAgZnJpMCAgICBmcmlBICAgICAgICBmcmlCICAgICAgICBmcmlNYXggICAgICAgICAgICAgICAgICAgICAgICAgIGZyaU1heDJcbiAgICB8ICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgIHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8XG4gICAgICAgICAgICA8LS0tLS0tLS0tLS0+IDw8IHRpbWVsaW5lcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgIHxcbiAgICA8LS0tLS0tLT4gICAgICAgICAgIHwgPDwgcHJvcGVydGllcyB2aWV3cG9ydCAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgcHhBICAgICAgICAgcHhCICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXggICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heDJcbiAgICA8U0NST0xMQkFSPlxuICAgIHwtLS0tLS0tLS0tLS0tLS0tLS0tfCA8PCBzY3JvbGxlciB2aWV3cG9ydFxuICAgICAgICAqPT09PSogICAgICAgICAgICA8PCBzY3JvbGxiYXJcbiAgICA8LS0tLS0tLS0tLS0tLS0tLS0tLT5cbiAgICB8c2MwICAgICAgICAgICAgICAgIHxzY0wgJiYgc2NSYXRpb1xuICAgICAgICB8c2NBXG4gICAgICAgICAgICAgfHNjQlxuICAqL1xuICBnZXRGcmFtZUluZm8gKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHt9XG4gICAgZnJhbWVJbmZvLmZwcyA9IHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8vIE51bWJlciBvZiBmcmFtZXMgcGVyIHNlY29uZFxuICAgIGZyYW1lSW5mby5tc3BmID0gMTAwMCAvIGZyYW1lSW5mby5mcHMgLy8gTWlsbGlzZWNvbmRzIHBlciBmcmFtZVxuICAgIGZyYW1lSW5mby5tYXhtcyA9IGdldE1heGltdW1Ncyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgIGZyYW1lSW5mby5tYXhmID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShmcmFtZUluZm8ubWF4bXMsIGZyYW1lSW5mby5tc3BmKSAvLyBNYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaTAgPSAwIC8vIFRoZSBsb3dlc3QgcG9zc2libGUgZnJhbWUgKGFsd2F5cyAwKVxuICAgIGZyYW1lSW5mby5mcmlBID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPCBmcmFtZUluZm8uZnJpMCkgPyBmcmFtZUluZm8uZnJpMCA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gLy8gVGhlIGxlZnRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaU1heCA9IChmcmFtZUluZm8ubWF4ZiA8IDYwKSA/IDYwIDogZnJhbWVJbmZvLm1heGYgLy8gVGhlIG1heGltdW0gZnJhbWUgYXMgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpTWF4MiA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heCAqIDEuODggIC8vIEV4dGVuZCB0aGUgbWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZSAoYWxsb3dzIHRoZSB1c2VyIHRvIGRlZmluZSBrZXlmcmFtZXMgYmV5b25kIHRoZSBwcmV2aW91c2x5IGRlZmluZWQgbWF4KVxuICAgIGZyYW1lSW5mby5mcmlCID0gKHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gPiBmcmFtZUluZm8uZnJpTWF4MikgPyBmcmFtZUluZm8uZnJpTWF4MiA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLy8gVGhlIHJpZ2h0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlXID0gTWF0aC5hYnMoZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkgLy8gVGhlIHdpZHRoIG9mIHRoZSB2aXNpYmxlIHJhbmdlIGluIGZyYW1lc1xuICAgIGZyYW1lSW5mby5weHBmID0gTWF0aC5mbG9vcih0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8gZnJhbWVJbmZvLmZyaVcpIC8vIE51bWJlciBvZiBwaXhlbHMgcGVyIGZyYW1lIChyb3VuZGVkKVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA8IDEpIGZyYW1lSW5mby5wU2NyeHBmID0gMVxuICAgIGlmIChmcmFtZUluZm8ucHhwZiA+IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIGZyYW1lSW5mby5weHBmID0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aFxuICAgIGZyYW1lSW5mby5weEEgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4QiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhNYXgyID0gZnJhbWVJbmZvLmZyaU1heDIgKiBmcmFtZUluZm8ucHhwZiAvLyBUaGUgd2lkdGggaW4gcGl4ZWxzIHRoYXQgdGhlIGVudGlyZSB0aW1lbGluZSAoXCJmcmlNYXgyXCIpIHBhZGRpbmcgd291bGQgZXF1YWxcbiAgICBmcmFtZUluZm8ubXNBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgbGVmdG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8ubXNCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmKSAvLyBUaGUgcmlnaHRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLnNjTCA9IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvLyBUaGUgbGVuZ3RoIGluIHBpeGVscyBvZiB0aGUgc2Nyb2xsZXIgdmlld1xuICAgIGZyYW1lSW5mby5zY1JhdGlvID0gZnJhbWVJbmZvLnB4TWF4MiAvIGZyYW1lSW5mby5zY0wgLy8gVGhlIHJhdGlvIG9mIHRoZSBzY3JvbGxlciB2aWV3IHRvIHRoZSB0aW1lbGluZSB2aWV3IChzbyB0aGUgc2Nyb2xsZXIgcmVuZGVycyBwcm9wb3J0aW9uYWxseSB0byB0aGUgdGltZWxpbmUgYmVpbmcgZWRpdGVkKVxuICAgIGZyYW1lSW5mby5zY0EgPSAoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIGxlZnQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgZnJhbWVJbmZvLnNjQiA9IChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgcmlnaHQgZW5kcG9pbnQgb2YgdGhlIHNjcm9sbGVyXG4gICAgcmV0dXJuIGZyYW1lSW5mb1xuICB9XG5cbiAgLy8gVE9ETzogRml4IHRoaXMvdGhlc2UgbWlzbm9tZXIocykuIEl0J3Mgbm90ICdBU0NJSSdcbiAgZ2V0QXNjaWlUcmVlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pIHtcbiAgICAgIGxldCBhcmNoeUZvcm1hdCA9IHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgICBsZXQgYXJjaHlTdHIgPSBhcmNoeShhcmNoeUZvcm1hdClcbiAgICAgIHJldHVybiBhcmNoeVN0clxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJydcbiAgICB9XG4gIH1cblxuICBnZXRBcmNoeUZvcm1hdE5vZGVzIChsYWJlbCwgY2hpbGRyZW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGFiZWwsXG4gICAgICBub2RlczogY2hpbGRyZW4uZmlsdGVyKChjaGlsZCkgPT4gdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykubWFwKChjaGlsZCkgPT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCBjaGlsZC5jaGlsZHJlbilcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZ2V0Q29tcG9uZW50Um93c0RhdGEgKCkge1xuICAgIC8vIFRoZSBudW1iZXIgb2YgbGluZXMgKiptdXN0KiogY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIGNvbXBvbmVudCBoZWFkaW5ncy9wcm9wZXJ0eSByb3dzXG4gICAgbGV0IGFzY2lpU3ltYm9scyA9IHRoaXMuZ2V0QXNjaWlUcmVlKCkuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGNvbXBvbmVudFJvd3MgPSBbXVxuICAgIGxldCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlID0ge31cbiAgICBsZXQgdmlzaXRvckl0ZXJhdGlvbnMgPSAwXG5cbiAgICBpZiAoIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlIHx8ICF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkgcmV0dXJuIGNvbXBvbmVudFJvd3NcblxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzKSA9PiB7XG4gICAgICAvLyBUT0RPIGhvdyB3aWxsIHRoaXMgYml0ZSB1cz9cbiAgICAgIGxldCBpc0NvbXBvbmVudCA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpXG4gICAgICBsZXQgZWxlbWVudE5hbWUgPSBpc0NvbXBvbmVudCA/IG5vZGUuYXR0cmlidXRlcy5zb3VyY2UgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICAgIGlmICghcGFyZW50IHx8IChwYXJlbnQuX19pc0V4cGFuZGVkICYmIChBTExPV0VEX1RBR05BTUVTW2VsZW1lbnROYW1lXSB8fCBpc0NvbXBvbmVudCkpKSB7IC8vIE9ubHkgdGhlIHRvcC1sZXZlbCBhbmQgYW55IGV4cGFuZGVkIHN1YmNvbXBvbmVudHNcbiAgICAgICAgY29uc3QgYXNjaWlCcmFuY2ggPSBhc2NpaVN5bWJvbHNbdmlzaXRvckl0ZXJhdGlvbnNdIC8vIFdhcm5pbmc6IFRoZSBjb21wb25lbnQgc3RydWN0dXJlIG11c3QgbWF0Y2ggdGhhdCBnaXZlbiB0byBjcmVhdGUgdGhlIGFzY2lpIHRyZWVcbiAgICAgICAgY29uc3QgaGVhZGluZ1JvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGFzY2lpQnJhbmNoLCBwcm9wZXJ0eVJvd3M6IFtdLCBpc0hlYWRpbmc6IHRydWUsIGNvbXBvbmVudElkOiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ10gfVxuICAgICAgICBjb21wb25lbnRSb3dzLnB1c2goaGVhZGluZ1JvdylcblxuICAgICAgICBpZiAoIWFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdKSB7XG4gICAgICAgICAgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0gPSBpc0NvbXBvbmVudCA/IF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyhub2RlKSA6IF9idWlsZERPTUFkZHJlc3NhYmxlcyhlbGVtZW50TmFtZSwgbG9jYXRvcilcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGNvbnN0IGNsdXN0ZXJIZWFkaW5nc0ZvdW5kID0ge31cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1baV1cblxuICAgICAgICAgIGxldCBwcm9wZXJ0eVJvd1xuXG4gICAgICAgICAgICAvLyBTb21lIHByb3BlcnRpZXMgZ2V0IGdyb3VwZWQgaW5zaWRlIHRoZWlyIG93biBhY2NvcmRpb24gc2luY2UgdGhleSBoYXZlIG11bHRpcGxlIHN1YmNvbXBvbmVudHMsIGUuZy4gdHJhbnNsYXRpb24ueCx5LHpcbiAgICAgICAgICBpZiAocHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlcikge1xuICAgICAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeFxuICAgICAgICAgICAgbGV0IGNsdXN0ZXJLZXkgPSBgJHtjb21wb25lbnRJZH1fJHtjbHVzdGVyUHJlZml4fWBcbiAgICAgICAgICAgIGxldCBpc0NsdXN0ZXJIZWFkaW5nID0gZmFsc2VcblxuICAgICAgICAgICAgICAvLyBJZiB0aGUgY2x1c3RlciB3aXRoIHRoZSBjdXJyZW50IGtleSBpcyBleHBhbmRlZCByZW5kZXIgZWFjaCBvZiB0aGUgcm93cyBpbmRpdmlkdWFsbHlcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tjbHVzdGVyS2V5XSkge1xuICAgICAgICAgICAgICBpZiAoIWNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdKSB7XG4gICAgICAgICAgICAgICAgaXNDbHVzdGVySGVhZGluZyA9IHRydWVcbiAgICAgICAgICAgICAgICBjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGlzQ2x1c3Rlck1lbWJlcjogdHJ1ZSwgaXNDbHVzdGVySGVhZGluZywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgY3JlYXRlIGEgY2x1c3Rlciwgc2hpZnRpbmcgdGhlIGluZGV4IGZvcndhcmQgc28gd2UgZG9uJ3QgcmUtcmVuZGVyIHRoZSBpbmRpdmlkdWFscyBvbiB0aGUgbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3BcbiAgICAgICAgICAgICAgbGV0IGNsdXN0ZXJTZXQgPSBbcHJvcGVydHlHcm91cERlc2NyaXB0b3JdXG4gICAgICAgICAgICAgICAgLy8gTG9vayBhaGVhZCBieSBhIGZldyBzdGVwcyBpbiB0aGUgYXJyYXkgYW5kIHNlZSBpZiB0aGUgbmV4dCBlbGVtZW50IGlzIGEgbWVtYmVyIG9mIHRoZSBjdXJyZW50IGNsdXN0ZXJcbiAgICAgICAgICAgICAgbGV0IGsgPSBpIC8vIFRlbXBvcmFyeSBzbyB3ZSBjYW4gaW5jcmVtZW50IGBpYCBpbiBwbGFjZVxuICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IDQ7IGorKykge1xuICAgICAgICAgICAgICAgIGxldCBuZXh0SW5kZXggPSBqICsga1xuICAgICAgICAgICAgICAgIGxldCBuZXh0RGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW25leHRJbmRleF1cbiAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBuZXh0IHRoaW5nIGluIHRoZSBsaXN0IHNoYXJlcyB0aGUgc2FtZSBjbHVzdGVyIG5hbWUsIG1ha2UgaXQgcGFydCBvZiB0aGlzIGNsdXN0ZXNyXG4gICAgICAgICAgICAgICAgaWYgKG5leHREZXNjcmlwdG9yICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXggPT09IGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgIGNsdXN0ZXJTZXQucHVzaChuZXh0RGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICAgICAgLy8gU2luY2Ugd2UgYWxyZWFkeSBnbyB0byB0aGUgbmV4dCBvbmUsIGJ1bXAgdGhlIGl0ZXJhdGlvbiBpbmRleCBzbyB3ZSBza2lwIGl0IG9uIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgICAgICAgICAgIGkgKz0gMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIGNsdXN0ZXJQcmVmaXgsIGNsdXN0ZXJLZXksIGNsdXN0ZXI6IGNsdXN0ZXJTZXQsIGNsdXN0ZXJOYW1lOiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyLm5hbWUsIGlzQ2x1c3RlcjogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0eVJvdyA9IHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGhlYWRpbmdSb3cucHJvcGVydHlSb3dzLnB1c2gocHJvcGVydHlSb3cpXG5cbiAgICAgICAgICAgIC8vIFB1c2hpbmcgYW4gZWxlbWVudCBpbnRvIGEgY29tcG9uZW50IHJvdyB3aWxsIHJlc3VsdCBpbiBpdCByZW5kZXJpbmcsIHNvIG9ubHkgcHVzaFxuICAgICAgICAgICAgLy8gdGhlIHByb3BlcnR5IHJvd3Mgb2Ygbm9kZXMgdGhhdCBoYXZlIGJlZW4gZXhwYW5kZXhcbiAgICAgICAgICBpZiAobm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChwcm9wZXJ0eVJvdylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZpc2l0b3JJdGVyYXRpb25zKytcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cy5mb3JFYWNoKChpdGVtLCBpbmRleCwgaXRlbXMpID0+IHtcbiAgICAgIGl0ZW0uX2luZGV4ID0gaW5kZXhcbiAgICAgIGl0ZW0uX2l0ZW1zID0gaXRlbXNcbiAgICB9KVxuXG4gICAgY29tcG9uZW50Um93cyA9IGNvbXBvbmVudFJvd3MuZmlsdGVyKCh7IG5vZGUsIHBhcmVudCwgbG9jYXRvciB9KSA9PiB7XG4gICAgICAgIC8vIExvY2F0b3JzID4gMC4wIGFyZSBiZWxvdyB0aGUgbGV2ZWwgd2Ugd2FudCB0byBkaXNwbGF5ICh3ZSBvbmx5IHdhbnQgdGhlIHRvcCBhbmQgaXRzIGNoaWxkcmVuKVxuICAgICAgaWYgKGxvY2F0b3Iuc3BsaXQoJy4nKS5sZW5ndGggPiAyKSByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiAhcGFyZW50IHx8IHBhcmVudC5fX2lzRXhwYW5kZWRcbiAgICB9KVxuXG4gICAgcmV0dXJuIGNvbXBvbmVudFJvd3NcbiAgfVxuXG4gIG1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgbGV0IHZhbHVlR3JvdXAgPSBUaW1lbGluZVByb3BlcnR5LmdldFZhbHVlR3JvdXAoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgaWYgKCF2YWx1ZUdyb3VwKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGxldCBrZXlmcmFtZXNMaXN0ID0gT2JqZWN0LmtleXModmFsdWVHcm91cCkubWFwKChrZXlmcmFtZUtleSkgPT4gcGFyc2VJbnQoa2V5ZnJhbWVLZXksIDEwKSkuc29ydCgoYSwgYikgPT4gYSAtIGIpXG4gICAgaWYgKGtleWZyYW1lc0xpc3QubGVuZ3RoIDwgMSkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleWZyYW1lc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc2N1cnIgPSBrZXlmcmFtZXNMaXN0W2ldXG4gICAgICBpZiAoaXNOYU4obXNjdXJyKSkgY29udGludWVcbiAgICAgIGxldCBtc3ByZXYgPSBrZXlmcmFtZXNMaXN0W2kgLSAxXVxuICAgICAgbGV0IG1zbmV4dCA9IGtleWZyYW1lc0xpc3RbaSArIDFdXG5cbiAgICAgIGlmIChtc2N1cnIgPiBmcmFtZUluZm8ubXNCKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBhZnRlciB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdFxuICAgICAgaWYgKG1zY3VyciA8IGZyYW1lSW5mby5tc0EgJiYgbXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgbXNuZXh0IDwgZnJhbWVJbmZvLm1zQSkgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgZW50aXJlbHkgYmVmb3JlIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0IChwYXJ0aWFsIHNlZ21lbnRzIGFyZSBvaylcblxuICAgICAgbGV0IHByZXZcbiAgICAgIGxldCBjdXJyXG4gICAgICBsZXQgbmV4dFxuXG4gICAgICBpZiAobXNwcmV2ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zcHJldikpIHtcbiAgICAgICAgcHJldiA9IHtcbiAgICAgICAgICBtczogbXNwcmV2LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSAtIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNwcmV2LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNwcmV2XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc3ByZXZdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY3VyciA9IHtcbiAgICAgICAgbXM6IG1zY3VycixcbiAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICBpbmRleDogaSxcbiAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNjdXJyLCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zY3Vycl0udmFsdWUsXG4gICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zY3Vycl0uY3VydmVcbiAgICAgIH1cblxuICAgICAgaWYgKG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc25leHQpKSB7XG4gICAgICAgIG5leHQgPSB7XG4gICAgICAgICAgbXM6IG1zbmV4dCxcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgKyAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zbmV4dCwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zbmV4dF0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNuZXh0XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBweE9mZnNldExlZnQgPSAoY3Vyci5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG4gICAgICBsZXQgcHhPZmZzZXRSaWdodFxuICAgICAgaWYgKG5leHQpIHB4T2Zmc2V0UmlnaHQgPSAobmV4dC5mcmFtZSAtIGZyYW1lSW5mby5mcmlBKSAqIGZyYW1lSW5mby5weHBmXG5cbiAgICAgIGxldCBzZWdtZW50T3V0cHV0ID0gaXRlcmF0ZWUocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpKVxuICAgICAgaWYgKHNlZ21lbnRPdXRwdXQpIHNlZ21lbnRPdXRwdXRzLnB1c2goc2VnbWVudE91dHB1dClcbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIG1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlSb3dzLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIHByb3BlcnR5Um93cy5mb3JFYWNoKChwcm9wZXJ0eVJvdykgPT4ge1xuICAgICAgaWYgKHByb3BlcnR5Um93LmlzQ2x1c3Rlcikge1xuICAgICAgICBwcm9wZXJ0eVJvdy5jbHVzdGVyLmZvckVhY2goKHByb3BlcnR5RGVzY3JpcHRvcikgPT4ge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IubmFtZVxuICAgICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5Um93LnByb3BlcnR5Lm5hbWVcbiAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICBpZiAocHJvcGVydHlPdXRwdXRzKSB7XG4gICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgcmVtb3ZlVGltZWxpbmVTaGFkb3cgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgfVxuXG4gIC8qXG4gICAqIHJlbmRlciBtZXRob2RzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlclRpbWVsaW5lUGxheWJhY2tDb250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICB0b3A6IDE3XG4gICAgICAgIH19PlxuICAgICAgICA8Q29udHJvbHNBcmVhXG4gICAgICAgICAgcmVtb3ZlVGltZWxpbmVTaGFkb3c9e3RoaXMucmVtb3ZlVGltZWxpbmVTaGFkb3cuYmluZCh0aGlzKX1cbiAgICAgICAgICBhY3RpdmVDb21wb25lbnREaXNwbGF5TmFtZT17dGhpcy5wcm9wcy51c2VyY29uZmlnLm5hbWV9XG4gICAgICAgICAgdGltZWxpbmVOYW1lcz17T2JqZWN0LmtleXMoKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKSA/IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRpbWVsaW5lcyA6IHt9KX1cbiAgICAgICAgICBzZWxlY3RlZFRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgIGN1cnJlbnRGcmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9XG4gICAgICAgICAgaXNQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICBwbGF5YmFja1NwZWVkPXt0aGlzLnN0YXRlLnBsYXllclBsYXliYWNrU3BlZWR9XG4gICAgICAgICAgbGFzdEZyYW1lPXt0aGlzLmdldEZyYW1lSW5mbygpLmZyaU1heH1cbiAgICAgICAgICBjaGFuZ2VUaW1lbGluZU5hbWU9eyhvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZShvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNyZWF0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGR1cGxpY2F0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRlbGV0ZVRpbWVsaW5lPXsodGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZVRpbWVsaW5lKHRpbWVsaW5lTmFtZSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHNlbGVjdFRpbWVsaW5lPXsoY3VycmVudFRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byBtYWtlIHN1cmUgd2UgdXBkYXRlIHRoZSBpbi1tZW1vcnkgY29tcG9uZW50IG9yIHByb3BlcnR5IGFzc2lnbm1lbnQgbWlnaHQgbm90IHdvcmsgY29ycmVjdGx5XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0VGltZWxpbmVOYW1lKGN1cnJlbnRUaW1lbGluZU5hbWUsIHsgZnJvbTogJ3RpbWVsaW5lJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2V0VGltZWxpbmVOYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBjdXJyZW50VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFRpbWVsaW5lTmFtZSB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwQmFjaz17KCkgPT4ge1xuICAgICAgICAgICAgLyogdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKCkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvLmZyaTAgLSBmcmFtZUluZm8uZnJpQSkgKi9cbiAgICAgICAgICAgIC8qIHRoaXMudXBkYXRlVGltZShmcmFtZUluZm8uZnJpMCkgKi9cbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmkwKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaTAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEZvcndhcmQ9eygpID0+IHtcbiAgICAgICAgICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpTWF4IH0pXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1BsYXlQYXVzZT17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVQbGF5YmFjaygpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjaGFuZ2VQbGF5YmFja1NwZWVkPXsoaW5wdXRFdmVudCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBsYXllclBsYXliYWNrU3BlZWQgPSBOdW1iZXIoaW5wdXRFdmVudC50YXJnZXQudmFsdWUgfHwgMSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBwbGF5ZXJQbGF5YmFja1NwZWVkIH0pXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGdldEl0ZW1WYWx1ZURlc2NyaXB0b3IgKGlucHV0SXRlbSkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IoaW5wdXRJdGVtLm5vZGUsIGZyYW1lSW5mbywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlLCB0aGlzLl9jb21wb25lbnQsIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIGlucHV0SXRlbS5wcm9wZXJ0eSlcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lbGluZVRpbWUgKGZyYW1lSW5mbykge1xuICAgIHJldHVybiBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogZnJhbWVJbmZvLm1zcGYpXG4gIH1cblxuICByZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMgKGl0ZW0pIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGxldCBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIGxldCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG5cbiAgICAvLyBUT0RPOiBPcHRpbWl6ZSB0aGlzPyBXZSBkb24ndCBuZWVkIHRvIHJlbmRlciBldmVyeSBzZWdtZW50IHNpbmNlIHNvbWUgb2YgdGhlbSBvdmVybGFwLlxuICAgIC8vIE1heWJlIGtlZXAgYSBsaXN0IG9mIGtleWZyYW1lICdwb2xlcycgcmVuZGVyZWQsIGFuZCBvbmx5IHJlbmRlciBvbmNlIGluIHRoYXQgc3BvdD9cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbGxhcHNlZC1zZWdtZW50cy1ib3gnIHN0eWxlPXt7IHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIGhlaWdodDogMjUsIHdpZHRoOiAnMTAwJScsIG92ZXJmbG93OiAnaGlkZGVuJyB9fT5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGl0ZW0ucHJvcGVydHlSb3dzLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG5cbiAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBpbmRleCwgaGFuZGxlLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbnQgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUudHJhbnNpdGlvbkJvZHlEcmFnZ2luZykge1xuICAgICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGFjdGl2ZUtleWZyYW1lcyA9IHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSBhY3RpdmVLZXlmcmFtZXMgPSB7fVxuXG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmVLZXlmcmFtZXMgfSlcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgICBsZXQgbG9jYWxPZmZzZXRYID0gY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBjdXJyLm1zXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gY3Vyci5mcmFtZVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbnVsbCxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG51bGwsXG4gICAgICAgICAgICAgIGN1cnZlOiBudWxsLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgekluZGV4OiAxMDAzLFxuICAgICAgICAgICAgY3Vyc29yOiAnY29sLXJlc2l6ZSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNvbG9LZXlmcmFtZSAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4LCBvcHRpb25zKSB7XG4gICAgbGV0IGlzQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gIT0gdW5kZWZpbmVkKSBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW5ub3QgdXNlICdjdXJyLm1zJyBmb3Iga2V5IGhlcmUgYmVjYXVzZSB0aGVzZSB0aGluZ3MgbW92ZSBhcm91bmRcbiAgICAgICAga2V5PXtgJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogdHJ1ZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSwga2V5ZnJhbWVEcmFnU3RhcnRNczogZmFsc2UsIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IHB4Q2hhbmdlID0gZHJhZ0RhdGEubGFzdFggLSB0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0UHhcbiAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCAnYm9keScsIGN1cnIuaW5kZXgsIGN1cnIubXMsIGRlc3RNcylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgYWN0aXZlS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5hY3RpdmVLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIGFjdGl2ZUtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgYWN0aXZlS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleCwgY29tcG9uZW50SWRdID0ge31cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICBhY3RpdmVLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSksXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdib2R5J1xuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZlS2V5ZnJhbWVzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0ncGlsbC1jb250YWluZXInXG4gICAgICAgICAga2V5PXt1bmlxdWVLZXl9XG4gICAgICAgICAgcmVmPXsoZG9tRWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXRyYW5zaXRpb24nLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgICBzdGFydE1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgICBjdXJ2ZTogY3Vyci5jdXJ2ZSxcbiAgICAgICAgICAgICAgZW5kRnJhbWU6IG5leHQuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUVudGVyPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eyhyZWFjdEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpc1t1bmlxdWVLZXldKSB0aGlzW3VuaXF1ZUtleV0uc3R5bGUuY29sb3IgPSAndHJhbnNwYXJlbnQnXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgICAgd2lkdGg6IHB4T2Zmc2V0UmlnaHQgLSBweE9mZnNldExlZnQsXG4gICAgICAgICAgICB0b3A6IDEsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge29wdGlvbnMuY29sbGFwc2VkICYmXG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29sbGFwc2VkLWJhY2tkcm9wJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDQsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5HUkFZXG4gICAgICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzc05hbWU9J3BpbGwnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAxLFxuICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/IChvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTMpXG4gICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTY1KVxuICAgICAgICAgICAgICA6IENvbG9yKFBhbGV0dGUuU1VOU1RPTkUpLmZhZGUoMC45MSlcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8S2V5ZnJhbWVTVkcgY29sb3I9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAyLFxuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgIG92ZXJmbG93OiBicmVha2luZ0JvdW5kcyA/ICd2aXNpYmxlJyA6ICdoaWRkZW4nXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgICA8Q3VydmVTVkdcbiAgICAgICAgICAgICAgaWQ9e3VuaXF1ZUtleX1cbiAgICAgICAgICAgICAgbGVmdEdyYWRGaWxsPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAoKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoZmlyc3RLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgICAgcmlnaHRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKHNlY29uZEtleWZyYW1lQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0spfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogLTUsXG4gICAgICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgICB0b3A6IC00LFxuICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMTMwbXMgbGluZWFyJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgICAgID8gJ3BvaW50ZXInXG4gICAgICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICAgICAgOiAob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgICAgIH0gLz5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb25zdGFudEJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIC8vIGNvbnN0IGFjdGl2ZUluZm8gPSBzZXRBY3RpdmVDb250ZW50cyhwcm9wZXJ0eU5hbWUsIGN1cnIsIG5leHQsIGZhbHNlLCB0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcycpXG4gICAgY29uc3QgdW5pcXVlS2V5ID0gYCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YFxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICB0aGlzW3VuaXF1ZUtleV0gPSBkb21FbGVtZW50XG4gICAgICAgIH19XG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29uc3RhbnQtYm9keSdcbiAgICAgICAgb25Db250ZXh0TWVudT17KGN0eE1lbnVFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgIGxldCBjbGlja2VkTXMgPSBNYXRoLnJvdW5kKCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICB0eXBlOiAna2V5ZnJhbWUtc2VnbWVudCcsXG4gICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICBrZXlmcmFtZUluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogUGFsZXR0ZS5EQVJLRVJfR1JBWVxuICAgICAgICB9fSAvPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBhbGxJdGVtcywgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgY29uc3QgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGNvbnN0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgY29uc3QgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgY29uc3QgaXNBY3RpdmF0ZWQgPSB0aGlzLmlzUm93QWN0aXZhdGVkKGl0ZW0pXG5cbiAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgpID0+IHtcbiAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgaXNBY3RpdmF0ZWQgfSkpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckNvbnN0YW50Qm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwge30pKVxuICAgICAgICB9XG4gICAgICAgIGlmICghcHJldiB8fCAhcHJldi5jdXJ2ZSkge1xuICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMywgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldikge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgLSAxMCwgNCwgJ2xlZnQnLCB7fSkpXG4gICAgICB9XG4gICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIDUsICdtaWRkbGUnLCB7fSkpXG4gICAgICBpZiAobmV4dCkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQgKyAxMCwgNiwgJ3JpZ2h0Jywge30pKVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2XG4gICAgICAgICAga2V5PXtga2V5ZnJhbWUtY29udGFpbmVyLSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgICAgY2xhc3NOYW1lPXtga2V5ZnJhbWUtY29udGFpbmVyYH0+XG4gICAgICAgICAge3NlZ21lbnRQaWVjZXN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuICAgIH0pXG4gIH1cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJHYXVnZSAoZnJhbWVJbmZvKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgcmV0dXJuIHRoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICBpZiAoZnJhbWVOdW1iZXIgPT09IDAgfHwgZnJhbWVOdW1iZXIgJSBmcmFtZU1vZHVsdXMgPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgZnJhbWUtJHtmcmFtZU51bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19PntmcmFtZU51bWJlcn08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdzZWNvbmRzJykgeyAvLyBha2EgdGltZSBlbGFwc2VkLCBub3QgZnJhbWVzXG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlVGltZXMoKG1pbGxpc2Vjb25kc051bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCB0b3RhbE1pbGxpc2Vjb25kcykgPT4ge1xuICAgICAgICBpZiAodG90YWxNaWxsaXNlY29uZHMgPD0gMTAwMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2B0aW1lLSR7bWlsbGlzZWNvbmRzTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e21pbGxpc2Vjb25kc051bWJlcn1tczwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57Zm9ybWF0U2Vjb25kcyhtaWxsaXNlY29uZHNOdW1iZXIgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICByZW5kZXJGcmFtZUdyaWQgKGZyYW1lSW5mbykge1xuICAgIHZhciBndWlkZUhlaWdodCA9ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgLSAyNSkgfHwgMFxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGlkPSdmcmFtZS1ncmlkJz5cbiAgICAgICAge3RoaXMubWFwVmlzaWJsZUZyYW1lcygoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgcGl4ZWxzUGVyRnJhbWUsIGZyYW1lTW9kdWx1cykgPT4ge1xuICAgICAgICAgIHJldHVybiA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7aGVpZ2h0OiBndWlkZUhlaWdodCArIDM1LCBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkNPQUwpLmZhZGUoMC42NSksIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRvcDogMzR9fSAvPlxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclNjcnViYmVyICgpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGlmICh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBIHx8IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyYUIpIHJldHVybiAnJ1xuICAgIHZhciBmcmFtZU9mZnNldCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC0gZnJhbWVJbmZvLmZyaUFcbiAgICB2YXIgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgdmFyIHNoYWZ0SGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDEwKSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgc2NydWJiZXJEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSxcbiAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNjcnViYmVyRHJhZ1N0YXJ0OiBudWxsLCBmcmFtZUJhc2VsaW5lOiB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSwgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlIH0pXG4gICAgICAgICAgfSwgMTAwKVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuY2hhbmdlU2NydWJiZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDEzLFxuICAgICAgICAgICAgICB3aWR0aDogMTMsXG4gICAgICAgICAgICAgIHRvcDogMjAsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0IC0gNixcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZScsXG4gICAgICAgICAgICAgIGJveFNoYWRvdzogJzAgMCAycHggMCByZ2JhKDAsIDAsIDAsIC45KScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxuICAgICAgICAgICAgICB0b3A6IDgsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJSaWdodDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclRvcDogJzhweCBzb2xpZCAnICsgUGFsZXR0ZS5TVU5TVE9ORVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBzaGFmdEhlaWdodCxcbiAgICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICAgIHRvcDogMjUsXG4gICAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckR1cmF0aW9uTW9kaWZpZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgLy8gdmFyIHRyaW1BcmVhSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgdmFyIHB4T2Zmc2V0ID0gdGhpcy5zdGF0ZS5kcmFnSXNBZGRpbmcgPyAwIDogLXRoaXMuc3RhdGUuZHVyYXRpb25UcmltICogZnJhbWVJbmZvLnB4cGZcblxuICAgIGlmIChmcmFtZUluZm8uZnJpQiA+PSBmcmFtZUluZm8uZnJpTWF4MiB8fCB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgICBkdXJhdGlvbkRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgICAgZHVyYXRpb25UcmltOiAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHttYXhGcmFtZTogY3VycmVudE1heCArIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltLCBkcmFnSXNBZGRpbmc6IGZhbHNlLCBhZGRJbnRlcnZhbDogbnVsbH0pXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uRHJhZ1N0YXJ0OiBudWxsLCBkdXJhdGlvblRyaW06IDAgfSkgfSwgMTAwKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25EcmFnPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5jaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24oZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IHB4T2Zmc2V0LCB0b3A6IDAsIHpJbmRleDogMTAwNn19PlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgICAgICAgIHdpZHRoOiA2LFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJUb3BSaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBib3JkZXJCb3R0b21SaWdodFJhZGl1czogNSxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9J3RyaW0tYXJlYScgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbW91c2VFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgbGVmdDogLTYsXG4gICAgICAgICAgICAgIHdpZHRoOiAyNiArIHB4T2Zmc2V0LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICh0aGlzLnJlZnMuc2Nyb2xsdmlldyAmJiB0aGlzLnJlZnMuc2Nyb2xsdmlldy5jbGllbnRIZWlnaHQgKyAzNSkgfHwgMCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5mYWRlKDAuNilcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgIClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxzcGFuIC8+XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVG9wQ29udHJvbHMgKCkge1xuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RvcC1jb250cm9scyBuby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCArIDEwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZWtlZXBpbmctd3JhcHBlcidcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLXRpbWUtcmVhZG91dCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgIG1pbldpZHRoOiA4NixcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDIsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogMTBcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIGhlaWdodDogMjQsIHBhZGRpbmc6IDQsIGZvbnRXZWlnaHQ6ICdsaWdodGVyJywgZm9udFNpemU6IDE5IH19PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgICAgOiA8c3Bhbj57Zm9ybWF0U2Vjb25kcyh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIDEwMDAgLyB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J2dhdWdlLWZwcy1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDM4LFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbGVmdDogMjExLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgICAgICAgICAgIGZvbnRTdHlsZTogJ2l0YWxpYycsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNSxcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICB7KHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJylcbiAgICAgICAgICAgICAgICA/IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPnt+fnRoaXMuc3RhdGUuY3VycmVudEZyYW1lfWY8L3NwYW4+XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy00cHgnfX0+e3RoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kfWZwczwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdG9nZ2xlJ1xuICAgICAgICAgICAgb25DbGljaz17dGhpcy50b2dnbGVUaW1lRGlzcGxheU1vZGUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHdpZHRoOiA1MCxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA3LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ2ZyYW1lcydcbiAgICAgICAgICAgICAgPyAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e2NvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+RlJBTUVTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4J319PlNFQ09ORFM8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgICAgOiAoPHNwYW4+XG4gICAgICAgICAgICAgICAgPGRpdj5GUkFNRVM8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTJweCcsIGNvbG9yOiBQYWxldHRlLlJPQ0ssIHBvc2l0aW9uOiAncmVsYXRpdmUnfX0+U0VDT05EU1xuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17e3dpZHRoOiA2LCBoZWlnaHQ6IDYsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgcmlnaHQ6IC0xMSwgdG9wOiAyfX0gLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9zcGFuPilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtYm94J1xuICAgICAgICAgIG9uQ2xpY2s9eyhjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY3J1YmJlckRyYWdTdGFydCA9PT0gbnVsbCB8fCB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgbGV0IGxlZnRYID0gY2xpY2tFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICAgIGxldCBmcmFtZVggPSBNYXRoLnJvdW5kKGxlZnRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICAgIGxldCBuZXdGcmFtZSA9IGZyYW1lSW5mby5mcmlBICsgZnJhbWVYXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKG5ld0ZyYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIC8vIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGgsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICBwYWRkaW5nVG9wOiAxMCxcbiAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQgfX0+XG4gICAgICAgICAge3RoaXMucmVuZGVyRnJhbWVHcmlkKGZyYW1lSW5mbyl9XG4gICAgICAgICAge3RoaXMucmVuZGVyR2F1Z2UoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJTY3J1YmJlcigpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyRHVyYXRpb25Nb2RpZmllcigpfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhciAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGtub2JSYWRpdXMgPSA1XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSd0aW1lbGluZS1yYW5nZS1zY3JvbGxiYXInXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0wsXG4gICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5GQVRIRVJfQ09BTFxuICAgICAgICB9fT5cbiAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICBheGlzPSd4J1xuICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogdHJ1ZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJTdGFydDogbnVsbCxcbiAgICAgICAgICAgICAgc2Nyb2xsYmFyRW5kOiBudWxsLFxuICAgICAgICAgICAgICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmcmFtZUluZm8uc2NBID4gMCB9KSAvLyBpZiB0aGUgc2Nyb2xsYmFyIG5vdCBhdCBwb3NpdGlvbiB6ZXJvLCBzaG93IGlubmVyIHNoYWRvdyBmb3IgdGltZWxpbmUgYXJlYVxuICAgICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCAmJiAhdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0KSB7XG4gICAgICAgICAgICAgIHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCwgZHJhZ0RhdGEueCwgZnJhbWVJbmZvKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX0dSQVksXG4gICAgICAgICAgICAgIGhlaWdodDoga25vYlJhZGl1cyAqIDIsXG4gICAgICAgICAgICAgIGxlZnQ6IGZyYW1lSW5mby5zY0EsXG4gICAgICAgICAgICAgIHdpZHRoOiBmcmFtZUluZm8uc2NCIC0gZnJhbWVJbmZvLnNjQSArIDE3LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IGtub2JSYWRpdXMsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0OiBmYWxzZSwgc2Nyb2xsYmFyU3RhcnQ6IG51bGwsIHNjcm9sbGJhckVuZDogbnVsbCB9KSB9fVxuICAgICAgICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLmNoYW5nZVZpc2libGVGcmFtZVJhbmdlKGRyYWdEYXRhLnggKyBmcmFtZUluZm8uc2NBLCAwLCBmcmFtZUluZm8pIH0sIFRIUk9UVExFX1RJTUUpfT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogMTAsIGhlaWdodDogMTAsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBjdXJzb3I6ICdldy1yZXNpemUnLCBsZWZ0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0OiBkcmFnRGF0YS54LCBzY3JvbGxiYXJTdGFydDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSwgc2Nyb2xsYmFyRW5kOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIH0pIH19XG4gICAgICAgICAgICAgIG9uU3RvcD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoMCwgZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIHJpZ2h0OiAwLCBib3JkZXJSYWRpdXM6ICc1MCUnLCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUgfX0gLz5cbiAgICAgICAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLSAxMCwgbGVmdDogMTAsIHBvc2l0aW9uOiAncmVsYXRpdmUnIH19PlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICBsZWZ0OiAoKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIC8gZnJhbWVJbmZvLmZyaU1heDIpICogMTAwKSArICclJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQm90dG9tQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiA0NSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHpJbmRleDogMTAwMDBcbiAgICAgICAgfX0+XG4gICAgICAgIHt0aGlzLnJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIoKX1cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nICh7IG5vZGUsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2ggfSkge1xuICAgIC8vIEhBQ0s6IFVudGlsIHdlIGVuYWJsZSBmdWxsIHN1cHBvcnQgZm9yIG5lc3RlZCBkaXNwbGF5IGluIHRoaXMgbGlzdCwgc3dhcCB0aGUgXCJ0ZWNobmljYWxseSBjb3JyZWN0XCJcbiAgICAvLyB0cmVlIG1hcmtlciB3aXRoIGEgXCJ2aXN1YWxseSBjb3JyZWN0XCIgbWFya2VyIHJlcHJlc2VudGluZyB0aGUgdHJlZSB3ZSBhY3R1YWxseSBzaG93XG4gICAgY29uc3QgaGVpZ2h0ID0gYXNjaWlCcmFuY2ggPT09ICfilJTilIDilKwgJyA/IDE1IDogMjVcbiAgICBjb25zdCBjb2xvciA9IG5vZGUuX19pc0V4cGFuZGVkID8gUGFsZXR0ZS5ST0NLIDogUGFsZXR0ZS5ST0NLX01VVEVEXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIChsb2NhdG9yID09PSAnMCcpXG4gICAgICAgID8gKDxkaXYgc3R5bGU9e3toZWlnaHQ6IDI3LCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgxcHgpJ319PlxuICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgZWxlbWVudE5hbWUsIDEyKX1cbiAgICAgICAgPC9kaXY+KVxuICAgICAgICA6ICg8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCc+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMjEsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICdtaWRkbGUnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIG1hcmdpblJpZ2h0OiA3LFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDFcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA1LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWV9GSVQxLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IDEsIGhlaWdodDogaGVpZ2h0fX0gLz5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luTGVmdDogNH19PuKAlDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGNvbG9yLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHt0cnVuY2F0ZShub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10gfHwgYDwke2VsZW1lbnROYW1lfT5gLCA4KX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj4pXG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMpIHtcbiAgICBsZXQgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YGNvbXBvbmVudC1oZWFkaW5nLXJvdy0ke2NvbXBvbmVudElkfS0ke2luZGV4fWB9XG4gICAgICAgIGNsYXNzTmFtZT0nY29tcG9uZW50LWhlYWRpbmctcm93IG5vLXNlbGVjdCdcbiAgICAgICAgZGF0YS1jb21wb25lbnQtaWQ9e2NvbXBvbmVudElkfVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gQ29sbGFwc2UvZXhwYW5kIHRoZSBlbnRpcmUgY29tcG9uZW50IGFyZWEgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgaWYgKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29sbGFwc2VOb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3Vuc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5leHBhbmROb2RlKGl0ZW0ubm9kZSwgY29tcG9uZW50SWQpXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NlbGVjdEVsZW1lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGNvbXBvbmVudElkXSwgKCkgPT4ge30pXG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZScsXG4gICAgICAgICAgdGFibGVMYXlvdXQ6ICdmaXhlZCcsXG4gICAgICAgICAgaGVpZ2h0OiBpdGVtLm5vZGUuX19pc0V4cGFuZGVkID8gMCA6IGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAndHJhbnNwYXJlbnQnIDogUGFsZXR0ZS5MSUdIVF9HUkFZLFxuICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjc1IDogMS4wXG4gICAgICAgIH19PlxuICAgICAgICB7IWl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgJiYgLy8gY292ZXJzIGtleWZyYW1lIGhhbmdvdmVyIGF0IGZyYW1lIDAgdGhhdCBmb3IgdW5jb2xsYXBzZWQgcm93cyBpcyBoaWRkZW4gYnkgdGhlIGlucHV0IGZpZWxkXG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDEwLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0fX0gLz59XG4gICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICBkaXNwbGF5OiAndGFibGUtY2VsbCcsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTUwLFxuICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHpJbmRleDogMyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVlcbiAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQsIG1hcmdpblRvcDogLTYgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIG1hcmdpbkxlZnQ6IDEwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7KGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpXG4gICAgICAgICAgICAgICAgICA/IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMSwgbGVmdDogLTEgfX0+PERvd25DYXJyb3RTVkcgY29sb3I9e1BhbGV0dGUuUk9DS30gLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgICA6IDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAge3RoaXMucmVuZGVyQ29tcG9uZW50Um93SGVhZGluZyhpdGVtKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb21wb25lbnQtY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgZGlzcGxheTogJ3RhYmxlLWNlbGwnLCB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCwgaGVpZ2h0OiAnaW5oZXJpdCcgfX0+XG4gICAgICAgICAgeyghaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkgPyB0aGlzLnJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhpdGVtKSA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclByb3BlcnR5Um93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpIHtcbiAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHZhciBodW1hbk5hbWUgPSBodW1hbml6ZVByb3BlcnR5TmFtZShpdGVtLnByb3BlcnR5Lm5hbWUpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgcHJvcGVydHlOYW1lID0gaXRlbS5wcm9wZXJ0eSAmJiBpdGVtLnByb3BlcnR5Lm5hbWVcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGtleT17YHByb3BlcnR5LXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdydcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvLyBDb2xsYXBzZSB0aGlzIGNsdXN0ZXIgaWYgdGhlIGFycm93IG9yIG5hbWUgaXMgY2xpY2tlZFxuICAgICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHsoaXRlbS5pc0NsdXN0ZXJIZWFkaW5nKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDE0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEzNixcbiAgICAgICAgICAgICAgICB0b3A6IC0yLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTQsIGxlZnQ6IC0zIH19PjxEb3duQ2Fycm90U1ZHIC8+PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICAgIHsoIXByb3BlcnR5T25MYXN0Q29tcG9uZW50ICYmIGh1bWFuTmFtZSAhPT0gJ2JhY2tncm91bmQgY29sb3InKSAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDUsXG4gICAgICAgICAgICAgIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIFBhbGV0dGUuR1JBWV9GSVQxLFxuICAgICAgICAgICAgICBoZWlnaHRcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgfVxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA0LFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogNixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIHdpZHRoOiA5MSxcbiAgICAgICAgICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogaHVtYW5OYW1lID09PSAnYmFja2dyb3VuZCBjb2xvcicgPyAndHJhbnNsYXRlWSgtMnB4KScgOiAndHJhbnNsYXRlWSgzcHgpJyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICB7aHVtYW5OYW1lfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncHJvcGVydHktaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHQgLSAxLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8UHJvcGVydHlJbnB1dEZpZWxkXG4gICAgICAgICAgICBwYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgICBpdGVtPXtpdGVtfVxuICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgaGVpZ2h0PXtoZWlnaHR9XG4gICAgICAgICAgICBmcmFtZUluZm89e2ZyYW1lSW5mb31cbiAgICAgICAgICAgIGNvbXBvbmVudD17dGhpcy5fY29tcG9uZW50fVxuICAgICAgICAgICAgaXNQbGF5ZXJQbGF5aW5nPXt0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZ31cbiAgICAgICAgICAgIHRpbWVsaW5lVGltZT17dGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyl9XG4gICAgICAgICAgICB0aW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICAgIHJvd0hlaWdodD17dGhpcy5zdGF0ZS5yb3dIZWlnaHR9XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkPXt0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWR9XG4gICAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUuc2VyaWFsaXplZEJ5dGVjb2RlfVxuICAgICAgICAgICAgcmVpZmllZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIGZyYW1lSW5mby5weEFcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBNYXRoLnJvdW5kKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IE1hdGgucm91bmQoKHRvdGFsT2Zmc2V0WCAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgICB0eXBlOiAncHJvcGVydHktcm93JyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICB0aW1lbGluZU5hbWU6IHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQga2V5ID0gaXRlbS5jb21wb25lbnRJZCArICcgJyArIGl0ZW0ucHJvcGVydHkubmFtZVxuICAgICAgICAgICAgLy8gQXZvaWQgdW5uZWNlc3Nhcnkgc2V0U3RhdGVzIHdoaWNoIGNhbiBpbXBhY3QgcmVuZGVyaW5nIHBlcmZvcm1hbmNlXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1trZXldKSB7XG4gICAgICAgICAgICAgIGxldCBhY3RpdmF0ZWRSb3dzID0ge31cbiAgICAgICAgICAgICAgYWN0aXZhdGVkUm93c1trZXldID0gdHJ1ZVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgYWN0aXZhdGVkUm93cyB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNsdXN0ZXJSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICB2YXIgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICB2YXIgY2x1c3Rlck5hbWUgPSBpdGVtLmNsdXN0ZXJOYW1lXG4gICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktY2x1c3Rlci1yb3ctJHtpbmRleH0tJHtjb21wb25lbnRJZH0tJHtjbHVzdGVyTmFtZX1gfVxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93J1xuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgLy8gRXhwYW5kIHRoZSBwcm9wZXJ0eSBjbHVzdGVyIHdoZW4gaXQgaXMgY2xpY2tlZFxuICAgICAgICAgIGxldCBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnMpXG4gICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgY3R4TWVudUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBvcGFjaXR5OiAoaXRlbS5ub2RlLl9faXNIaWRkZW4pID8gMC41IDogMS4wLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIHshcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiZcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDM2LFxuICAgICAgICAgICAgICB3aWR0aDogNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IDE0NSxcbiAgICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J3V0Zi1pY29uJyBzdHlsZT17eyB0b3A6IC0yLCBsZWZ0OiAtMyB9fT48UmlnaHRDYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLXJvdy1sYWJlbCBuby1zZWxlY3QnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gOTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtjbHVzdGVyTmFtZX1cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1jbHVzdGVyLWlucHV0LWZpZWxkJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gODIsXG4gICAgICAgICAgICB3aWR0aDogODIsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6IDI0LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICA8Q2x1c3RlcklucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3JlaWZpZWRCeXRlY29kZX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItdGltZWxpbmUtc2VnbWVudHMtYm94J1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCAvLyBvZmZzZXQgaGFsZiBvZiBsb25lIGtleWZyYW1lIHdpZHRoIHNvIGl0IGxpbmVzIHVwIHdpdGggdGhlIHBvbGVcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAge3RoaXMubWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIFtpdGVtXSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuICAgICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyVHJhbnNpdGlvbkJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkUHJvcGVydHk6IHRydWUgfSkpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgICAgfSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgLy8gQ3JlYXRlcyBhIHZpcnR1YWwgbGlzdCBvZiBhbGwgdGhlIGNvbXBvbmVudCByb3dzIChpbmNsdWRlcyBoZWFkaW5ncyBhbmQgcHJvcGVydHkgcm93cylcbiAgcmVuZGVyQ29tcG9uZW50Um93cyAoaXRlbXMpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHJldHVybiA8c3BhbiAvPlxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGlzdCdcbiAgICAgICAgc3R5bGU9e2xvZGFzaC5hc3NpZ24oe30sIHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJ1xuICAgICAgICB9KX0+XG4gICAgICAgIHtpdGVtcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlPbkxhc3RDb21wb25lbnQgPSBpdGVtLnNpYmxpbmdzLmxlbmd0aCA+IDAgJiYgaXRlbS5pbmRleCA9PT0gaXRlbS5zaWJsaW5ncy5sZW5ndGggLSAxXG4gICAgICAgICAgaWYgKGl0ZW0uaXNDbHVzdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDbHVzdGVyUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXRlbS5pc1Byb3BlcnR5KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJQcm9wZXJ0eVJvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyhpdGVtLCBpbmRleCwgdGhpcy5zdGF0ZS5yb3dIZWlnaHQsIGl0ZW1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgPSB0aGlzLmdldENvbXBvbmVudFJvd3NEYXRhKClcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgaWQ9J3RpbWVsaW5lJ1xuICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDQ1cHgpJyxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2hpZGRlbicsXG4gICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cgJiZcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9J25vLXNlbGVjdCcgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICB3aWR0aDogMyxcbiAgICAgICAgICAgIGxlZnQ6IDI5NyxcbiAgICAgICAgICAgIHpJbmRleDogMjAwMyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGJveFNoYWRvdzogJzNweCAwIDZweCAwIHJnYmEoMCwwLDAsLjIyKSdcbiAgICAgICAgICB9fSAvPlxuICAgICAgICB9XG4gICAgICAgIHt0aGlzLnJlbmRlclRvcENvbnRyb2xzKCl9XG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J3Njcm9sbHZpZXcnXG4gICAgICAgICAgaWQ9J3Byb3BlcnR5LXJvd3MnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAzNSxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6IHRoaXMuc3RhdGUuYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHMgPyAnbm9uZScgOiAnYXV0bycsXG4gICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICBvdmVyZmxvd1k6ICdhdXRvJyxcbiAgICAgICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbidcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VEb3duPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHthY3RpdmVLZXlmcmFtZXM6IHt9fSlcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dzKHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3RoaXMucmVuZGVyQm90dG9tQ29udHJvbHMoKX1cbiAgICAgICAgPEV4cHJlc3Npb25JbnB1dFxuICAgICAgICAgIHJlZj0nZXhwcmVzc2lvbklucHV0J1xuICAgICAgICAgIHJlYWN0UGFyZW50PXt0aGlzfVxuICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICBpbnB1dEZvY3VzZWQ9e3RoaXMuc3RhdGUuaW5wdXRGb2N1c2VkfVxuICAgICAgICAgIG9uQ29tbWl0VmFsdWU9eyhjb21taXR0ZWRWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGlucHV0IGNvbW1pdDonLCBKU09OLnN0cmluZ2lmeShjb21taXR0ZWRWYWx1ZSkpXG5cbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoXG4gICAgICAgICAgICAgIGdldEl0ZW1Db21wb25lbnRJZCh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQubm9kZS5lbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgZ2V0SXRlbVByb3BlcnR5TmFtZSh0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZCksXG4gICAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZSh0aGlzLmdldEZyYW1lSW5mbygpKSxcbiAgICAgICAgICAgICAgY29tbWl0dGVkVmFsdWUsXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBjdXJ2ZVxuICAgICAgICAgICAgICB2b2lkICgwKSwgLy8gZW5kTXNcbiAgICAgICAgICAgICAgdm9pZCAoMCkgLy8gZW5kVmFsdWVcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRm9jdXNSZXF1ZXN0ZWQ9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IHRoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTmF2aWdhdGVSZXF1ZXN0ZWQ9eyhuYXZEaXIsIGRvRm9jdXMpID0+IHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICBsZXQgbmV4dCA9IG5leHRQcm9wSXRlbShpdGVtLCBuYXZEaXIpXG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IChkb0ZvY3VzKSA/IG5leHQgOiBudWxsLFxuICAgICAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG5leHRcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbmZ1bmN0aW9uIF9idWlsZENvbXBvbmVudEFkZHJlc3NhYmxlcyAobm9kZSkge1xuICB2YXIgYWRkcmVzc2FibGVzID0gX2J1aWxkRE9NQWRkcmVzc2FibGVzKCdkaXYnKSAvLyBzdGFydCB3aXRoIGRvbSBwcm9wZXJ0aWVzP1xuICBmb3IgKGxldCBuYW1lIGluIG5vZGUuZWxlbWVudE5hbWUuc3RhdGVzKSB7XG4gICAgbGV0IHN0YXRlID0gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXNbbmFtZV1cblxuICAgIGFkZHJlc3NhYmxlcy5wdXNoKHtcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBwcmVmaXg6IG5hbWUsXG4gICAgICBzdWZmaXg6IHVuZGVmaW5lZCxcbiAgICAgIGZhbGxiYWNrOiBzdGF0ZS52YWx1ZSxcbiAgICAgIHR5cGVkZWY6IHN0YXRlLnR5cGVcbiAgICB9KVxuICB9XG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZnVuY3Rpb24gX2J1aWxkRE9NQWRkcmVzc2FibGVzIChlbGVtZW50TmFtZSwgbG9jYXRvcikge1xuICB2YXIgYWRkcmVzc2FibGVzID0gW11cblxuICBjb25zdCBkb21TY2hlbWEgPSBET01TY2hlbWFbZWxlbWVudE5hbWVdXG4gIGNvbnN0IGRvbUZhbGxiYWNrcyA9IERPTUZhbGxiYWNrc1tlbGVtZW50TmFtZV1cblxuICBpZiAoZG9tU2NoZW1hKSB7XG4gICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIGRvbVNjaGVtYSkge1xuICAgICAgbGV0IHByb3BlcnR5R3JvdXAgPSBudWxsXG5cbiAgICAgIGlmIChsb2NhdG9yID09PSAnMCcpIHsgLy8gVGhpcyBpbmRpY2F0ZXMgdGhlIHRvcCBsZXZlbCBlbGVtZW50ICh0aGUgYXJ0Ym9hcmQpXG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTX1RPUF9MRVZFTFtwcm9wZXJ0eU5hbWVdKSB7XG4gICAgICAgICAgbGV0IG5hbWVQYXJ0cyA9IHByb3BlcnR5TmFtZS5zcGxpdCgnLicpXG5cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dYJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd4J11cbiAgICAgICAgICBpZiAocHJvcGVydHlOYW1lID09PSAnc3R5bGUub3ZlcmZsb3dZJykgbmFtZVBhcnRzID0gWydvdmVyZmxvdycsICd5J11cblxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChBTExPV0VEX1BST1BTW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwID0ge1xuICAgICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgcHJlZml4OiBuYW1lUGFydHNbMF0sXG4gICAgICAgICAgICBzdWZmaXg6IG5hbWVQYXJ0c1sxXSxcbiAgICAgICAgICAgIGZhbGxiYWNrOiBkb21GYWxsYmFja3NbcHJvcGVydHlOYW1lXSxcbiAgICAgICAgICAgIHR5cGVkZWY6IGRvbVNjaGVtYVtwcm9wZXJ0eU5hbWVdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wZXJ0eUdyb3VwKSB7XG4gICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gQ0xVU1RFUkVEX1BST1BTW3Byb3BlcnR5R3JvdXAubmFtZV1cbiAgICAgICAgaWYgKGNsdXN0ZXJQcmVmaXgpIHtcbiAgICAgICAgICBwcm9wZXJ0eUdyb3VwLmNsdXN0ZXIgPSB7XG4gICAgICAgICAgICBwcmVmaXg6IGNsdXN0ZXJQcmVmaXgsXG4gICAgICAgICAgICBuYW1lOiBDTFVTVEVSX05BTUVTW2NsdXN0ZXJQcmVmaXhdXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWRkcmVzc2FibGVzLnB1c2gocHJvcGVydHlHcm91cClcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gYWRkcmVzc2FibGVzXG59XG5cbmV4cG9ydCBkZWZhdWx0IFRpbWVsaW5lXG4iXX0=