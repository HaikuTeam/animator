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
  selectedSegments: {},
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
        if (_this3.tourClient) _this3.tourClient.next();
        _this3.changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName);
      });
      this.addEmitterListener(this.ctxmenu, 'deleteKeyframe', function (componentId, timelineName, propertyName, startMs) {
        _this3.executeBytecodeActionDeleteKeyframe({ componentId: { componentId: componentId, propertyName: propertyName, ms: startMs } }, timelineName);
      });
      this.addEmitterListener(this.ctxmenu, 'changeSegmentCurve', function (componentId, timelineName, propertyName, startMs, curveName) {
        _this3.changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName);
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
      var _this5 = this;

      _lodash2.default.each(this.state.selectedSegments, function (s) {
        if (s.hasCurve) {
          _actions2.default.splitSegment(_this5.state.reifiedBytecode, componentId, timelineName, s.elementName, s.propertyName, s.ms);
          (0, _clearInMemoryBytecodeCaches2.default)(_this5.state.reifiedBytecode);
          _this5._component._clearCaches();
          _this5.setState({
            reifiedBytecode: _this5.state.reifiedBytecode,
            serializedBytecode: _this5._component.getSerializedBytecode(),
            selectedKeyframes: {},
            selectedSegments: {}
          });
          _this5.props.websocket.action('splitSegment', [_this5.props.folder, [componentId], timelineName, s.elementName, s.propertyName, s.ms], function () {});
        }
      });
    }
  }, {
    key: 'executeBytecodeActionDeleteKeyframe',
    value: function executeBytecodeActionDeleteKeyframe(keyframes, timelineName) {
      var _this6 = this;

      _lodash2.default.each(keyframes, function (k) {
        _actions2.default.deleteKeyframe(_this6.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.ms);
        (0, _clearInMemoryBytecodeCaches2.default)(_this6.state.reifiedBytecode);
        _this6._component._clearCaches();
        _this6.setState({
          reifiedBytecode: _this6.state.reifiedBytecode,
          serializedBytecode: _this6._component.getSerializedBytecode(),
          keyframeDragStartPx: false,
          keyframeDragStartMs: false,
          transitionBodyDragging: false
        });
        _this6.props.websocket.action('deleteKeyframe', [_this6.props.folder, [k.componentId], timelineName, k.propertyName, k.ms], function () {});
      });
      this.setState({ selectedKeyframes: {} });
    }
  }, {
    key: 'changeMultipleSegmentCurves',
    value: function changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName) {
      var _this7 = this;

      _lodash2.default.each(this.state.selectedSegments, function (s) {
        if (!s.hasCurve) {
          _this7.executeBytecodeActionJoinKeyframes(componentId, timelineName, s.elementName, s.propertyName, s.ms, s.endMs, curveName);
        } else {
          _this7.executeBytecodeActionChangeSegmentCurve(componentId, timelineName, s.propertyName, s.ms, curveName);
        }
      });
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
        transitionBodyDragging: false,
        selectedKeyframes: {},
        selectedSegments: {}
      });
      // In the future, curve may be a function
      var curveForWire = (0, _expressionToRO2.default)(curveName);
      this.props.websocket.action('joinKeyframes', [this.props.folder, [componentId], timelineName, elementName, propertyName, startMs, endMs, curveForWire], function () {});
    }
  }, {
    key: 'executeBytecodeActionChangeSegmentCurve',
    value: function executeBytecodeActionChangeSegmentCurve(componentId, timelineName, propertyName, startMs, curveName) {
      _actions2.default.changeSegmentCurve(this.state.reifiedBytecode, componentId, timelineName, propertyName, startMs, curveName);
      (0, _clearInMemoryBytecodeCaches2.default)(this.state.reifiedBytecode);
      this._component._clearCaches();
      this.setState({
        reifiedBytecode: this.state.reifiedBytecode,
        serializedBytecode: this._component.getSerializedBytecode(),
        selectedKeyframes: {},
        selectedSegments: {}
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
      var _this8 = this;

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
        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this8.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.handle, // todo: take a second look at this one
        k.index, k.ms, adjustedMs, frameInfo);
        // Update our selected keyframes start time now that we've moved them
        // Note: This seems like there's probably a more clever way to make sure this gets
        // updated via the BytecodeActions.moveSegmentEndpoints perhaps.
        selectedKeyframes[k.componentId + '-' + k.propertyName + '-' + k.index].ms = Object.keys(keyframeMoves)[k.index];
        _this8.setState({ selectedKeyframes: selectedKeyframes });

        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
          (0, _clearInMemoryBytecodeCaches2.default)(_this8.state.reifiedBytecode);
          _this8._component._clearCaches();
          _this8.setState({
            reifiedBytecode: _this8.state.reifiedBytecode,
            serializedBytecode: _this8._component.getSerializedBytecode()
          });

          // It's very heavy to transmit a websocket message for every single movement while updating the ui,
          // so the values are accumulated and sent via a single batched update.
          if (!_this8._keyframeMoves) _this8._keyframeMoves = {};
          var movementKey = [componentId, timelineName, propertyName].join('-');
          _this8._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
          _this8.debouncedKeyframeMoveAction();
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
      var _this9 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this9._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this9._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this10 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this10.state.selectedNodes[id];
            node.__isExpanded = !!_this10.state.expandedNodes[id];
            node.__isHidden = !!_this10.state.hiddenNodes[id];
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
      var _this11 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this11.selectNode(node);
          _this11.expandNode(node);
          _this11.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this12 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this12.deselectNode(node);
        _this12.collapseNode(node);
        _this12.scrollToTop(node);
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
      var _this13 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this13.activateRow(rowInfo);
        } else {
          _this13.deactivateRow(rowInfo);
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
      var _this14 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this14.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this15 = this;

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
              if (_this15.state.expandedPropertyClusters[clusterKey]) {
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
      var _this16 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this16.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this16.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
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
      var _this17 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1545
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
            _this17.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this17.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this17.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this17.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this17._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this17.props.websocket.action('setTimelineName', [_this17.props.folder, currentTimelineName], function () {});
            _this17.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this17.getFrameInfo();
            _this17._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this17.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this17.getFrameInfo();
            _this17.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this17._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this17.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this17.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1550
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
      var _this18 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1618
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this18.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this18.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this18.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this18.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this19 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this19.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this19.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this19.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this19.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this19.state.keyframeDragStartMs + msChange);
              _this19.executeBytecodeActionMoveSegmentEndpoints(componentId, _this19.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this19.state.selectedKeyframes;
            var selectedSegments = _this19.state.selectedSegments;
            if (!e.shiftKey) {
              selectedKeyframes = {};
              selectedSegments = {};
            }

            selectedKeyframes[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              index: curr.index,
              ms: curr.ms,
              handle: handle,
              componentId: componentId,
              propertyName: propertyName
            };
            _this19.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1641
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
            _this19.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this19.state.currentTimelineName,
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
            lineNumber: 1685
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
            lineNumber: 1731
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
              lineNumber: 1743
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1751
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this20 = this;

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
            _this20.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this20.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this20.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this20.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this20.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this20.state.keyframeDragStartMs + msChange);
            _this20.executeBytecodeActionMoveSegmentEndpoints(componentId, _this20.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this20.state.selectedKeyframes;
            var selectedSegments = _this20.state.selectedSegments;
            if (!e.shiftKey) {
              selectedKeyframes = {};
              selectedSegments = {};
            }
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
              elementName: elementName,
              index: next.index,
              ms: next.ms,
              handle: 'middle'
            };
            selectedSegments[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              ms: curr.ms,
              hasCurve: true
            };
            _this20.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1775
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this20[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this20.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this20.state.currentTimelineName,
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
              if (_this20[uniqueKey]) _this20[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this20[uniqueKey]) _this20[uniqueKey].style.color = 'transparent';
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
              lineNumber: 1834
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
              lineNumber: 1885
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
              lineNumber: 1901
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
                lineNumber: 1918
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
                  lineNumber: 1928
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1936
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
                lineNumber: 1946
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1955
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
                lineNumber: 1973
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
                  lineNumber: 1984
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1994
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
      var _this21 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;
      var isSelected = false;
      if (this.state.selectedSegments[componentId + '-' + propertyName + '-' + curr.index] != undefined) isSelected = true;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this21[uniqueKey] = domElement;
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
            _this21.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this21.state.currentTimelineName,
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
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedSegments = _this21.state.selectedSegments;
            var selectedKeyframes = _this21.state.selectedKeyframes;
            if (!e.shiftKey) {
              selectedSegments = {};
              selectedKeyframes = {};
            } else {
              selectedSegments[componentId + '-' + propertyName + '-' + curr.index] = {
                id: componentId + '-' + propertyName + '-' + curr.index,
                componentId: componentId,
                elementName: elementName,
                propertyName: propertyName,
                ms: curr.ms,
                endMs: next.ms,
                hasCurve: false
              };
            }
            _this21.setState({ selectedSegments: selectedSegments, selectedKeyframes: selectedKeyframes });
          },
          style: {
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            height: this.state.rowHeight
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2016
          },
          __self: this
        },
        _react2.default.createElement('span', { style: {
            height: 3,
            top: 12,
            position: 'absolute',
            zIndex: 2,
            width: '100%',
            backgroundColor: options.collapsedElement ? (0, _color2.default)(_DefaultPalette2.default.GRAY).fade(0.23) : isSelected ? (0, _color2.default)(_DefaultPalette2.default.LIGHTEST_PINK).fade(.5) : _DefaultPalette2.default.DARKER_GRAY
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2075
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this22 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this22.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this22.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this22.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this22.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 2120
            },
            __self: _this22
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this23 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2136
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2137
                  },
                  __self: _this23
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
                  lineNumber: 2146
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2147
                  },
                  __self: _this23
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
                  lineNumber: 2152
                },
                __self: _this23
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2153
                  },
                  __self: _this23
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
      var _this24 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 2164
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2166
            },
            __self: _this24
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this25 = this;

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
            _this25.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this25.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this25.setState({ scrubberDragStart: null, frameBaseline: _this25.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this25.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 2179
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2198
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
                lineNumber: 2199
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
                lineNumber: 2212
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
                lineNumber: 2222
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
              lineNumber: 2234
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this26 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this26.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this26.state.maxFrame ? _this26.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this26.state.addInterval);
              _this26.setState({ maxFrame: currentMax + _this26.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this26.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this26.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2257
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2276
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
                lineNumber: 2277
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
                lineNumber: 2290
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2304
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this27 = this;

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
            lineNumber: 2311
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
              lineNumber: 2324
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
                lineNumber: 2333
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2345
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2347
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
                    lineNumber: 2348
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
                lineNumber: 2352
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
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
                    lineNumber: 2369
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
                    lineNumber: 2370
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
                  lineNumber: 2373
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
                lineNumber: 2375
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2392
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2393
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2394
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2396
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
                  lineNumber: 2398
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2399
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2400
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2401
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
              if (_this27.state.scrubberDragStart === null || _this27.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this27.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this27._component.getCurrentTimeline().seek(newFrame);
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
              lineNumber: 2408
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
      var _this28 = this;

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
            lineNumber: 2445
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this28.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this28.state.visibleFrameRange[0],
                scrollbarEnd: _this28.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this28.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this28.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this28.state.scrollerLeftDragStart && !_this28.state.scrollerRightDragStart) {
                _this28.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2455
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
                lineNumber: 2479
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this28.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this28.state.visibleFrameRange[0], scrollbarEnd: _this28.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this28.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this28.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2489
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2494
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this28.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this28.state.visibleFrameRange[0], scrollbarEnd: _this28.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this28.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this28.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2496
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2501
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
              lineNumber: 2505
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
              lineNumber: 2506
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
            lineNumber: 2521
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
            lineNumber: 2548
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2551
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
              lineNumber: 2552
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2563
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2564
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
              lineNumber: 2566
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
      var _this29 = this;

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
              _this29.collapseNode(item.node, componentId);
              _this29.props.websocket.action('unselectElement', [_this29.props.folder, componentId], function () {});
            } else {
              _this29.expandNode(item.node, componentId);
              _this29.props.websocket.action('selectElement', [_this29.props.folder, componentId], function () {});
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
            lineNumber: 2581
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
            lineNumber: 2608
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
              lineNumber: 2616
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2624
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
                  lineNumber: 2625
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2630
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2630
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2631
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2631
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
              lineNumber: 2637
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
      var _this30 = this;

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
            lineNumber: 2652
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this30.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this30.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2662
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
                lineNumber: 2674
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2684
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2684
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
              lineNumber: 2689
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
                lineNumber: 2698
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
                  lineNumber: 2711
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
              lineNumber: 2725
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
              lineNumber: 2734
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
              _this30.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this30.state.currentTimelineName,
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
              if (!_this30.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this30.setState({ activatedRows: activatedRows });
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
              lineNumber: 2749
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
      var _this31 = this;

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
            var expandedPropertyClusters = _lodash2.default.clone(_this31.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this31.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this31.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this31.setState({
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
            lineNumber: 2800
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2831
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
              lineNumber: 2833
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
                lineNumber: 2841
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2848
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2848
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
                lineNumber: 2850
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
                  lineNumber: 2860
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
              lineNumber: 2869
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
              lineNumber: 2878
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
              lineNumber: 2892
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this31.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this31.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this31.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
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
      var _this32 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2923
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
            lineNumber: 2926
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this32.renderClusterRow(item, index, _this32.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this32.renderPropertyRow(item, index, _this32.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this32.renderComponentHeadingRow(item, index, _this32.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this33 = this;

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
            lineNumber: 2948
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
            lineNumber: 2964
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
              _this33.setState({ selectedKeyframes: {}, selectedSegments: {} });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2975
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

            _this33.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this33.state.inputFocused), _this33.state.currentTimelineName, _this33.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this33.state.inputFocused), _this33.getCurrentTimelineTime(_this33.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this33.setState({
              inputFocused: _this33.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this33.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this33.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2995
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwic2VsZWN0ZWRLZXlmcmFtZXMiLCJzZWxlY3RlZFNlZ21lbnRzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiY2hhbmdlTXVsdGlwbGVTZWdtZW50Q3VydmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUiLCJtcyIsImhhbmRsZSIsImtleWZyYW1lSW5kZXgiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyIsIl90aW1lbGluZXMiLCJ1cGRhdGVUaW1lIiwiZnJpTWF4IiwiZ2V0Q3VycmVudFRpbWVsaW5lIiwic2Vla0FuZFBhdXNlIiwiZnJpQiIsImZyaUEiLCJ0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UiLCJzZWxlY3RvciIsIndlYnZpZXciLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiZXJyb3IiLCJuYXRpdmVFdmVudCIsInJlZnMiLCJleHByZXNzaW9uSW5wdXQiLCJ3aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQiLCJrZXlDb2RlIiwidG9nZ2xlUGxheWJhY2siLCJ3aGljaCIsInVwZGF0ZVNjcnViYmVyUG9zaXRpb24iLCJ1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSIsImlzRW1wdHkiLCJ1cGRhdGVLZXlib2FyZFN0YXRlIiwiZXZlbnRFbWl0dGVyIiwiZXZlbnROYW1lIiwiZXZlbnRIYW5kbGVyIiwiX19pc1NlbGVjdGVkIiwiY2xvbmUiLCJhdHRyaWJ1dGVzIiwidHJlZVVwZGF0ZSIsIkRhdGUiLCJub3ciLCJzY3JvbGx2aWV3Iiwic2Nyb2xsVG9wIiwicm93c0RhdGEiLCJjb21wb25lbnRSb3dzRGF0YSIsImZvdW5kSW5kZXgiLCJpbmRleENvdW50ZXIiLCJyb3dJbmZvIiwiaW5kZXgiLCJpc0hlYWRpbmciLCJpc1Byb3BlcnR5IiwiX19pc0V4cGFuZGVkIiwiZG9tTm9kZSIsImN1cnRvcCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFRvcCIsInBhcmVudCIsImV4cGFuZE5vZGUiLCJyb3ciLCJwcm9wZXJ0eSIsIml0ZW0iLCJkcmFnWCIsImRyYWdTdGFydCIsInNjcnViYmVyRHJhZ1N0YXJ0IiwiZnJhbWVCYXNlbGluZSIsImRyYWdEZWx0YSIsImZyYW1lRGVsdGEiLCJweHBmIiwic2VlayIsImR1cmF0aW9uRHJhZ1N0YXJ0IiwiYWRkSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImN1cnJlbnRNYXgiLCJmcmlNYXgyIiwiZHJhZ0lzQWRkaW5nIiwiY2xlYXJJbnRlcnZhbCIsInhsIiwieHIiLCJhYnNMIiwiYWJzUiIsInNjcm9sbGVyTGVmdERyYWdTdGFydCIsInNjcm9sbGVyUmlnaHREcmFnU3RhcnQiLCJzY3JvbGxlckJvZHlEcmFnU3RhcnQiLCJvZmZzZXRMIiwic2Nyb2xsYmFyU3RhcnQiLCJzY1JhdGlvIiwib2Zmc2V0UiIsInNjcm9sbGJhckVuZCIsImRpZmZYIiwiZkwiLCJmUiIsImZyaTAiLCJkZWx0YSIsImwiLCJyIiwic3BhbiIsIm5ld0wiLCJuZXdSIiwic3RhcnRWYWx1ZSIsIm1heWJlQ3VydmUiLCJlbmRWYWx1ZSIsImNyZWF0ZUtleWZyYW1lIiwiZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUiLCJnZXQiLCJhY3Rpb24iLCJlYWNoIiwicyIsImhhc0N1cnZlIiwic3BsaXRTZWdtZW50Iiwia2V5ZnJhbWVzIiwiayIsImRlbGV0ZUtleWZyYW1lIiwia2V5ZnJhbWVEcmFnU3RhcnRQeCIsImtleWZyYW1lRHJhZ1N0YXJ0TXMiLCJ0cmFuc2l0aW9uQm9keURyYWdnaW5nIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSIsImpvaW5LZXlmcmFtZXMiLCJjdXJ2ZUZvcldpcmUiLCJjaGFuZ2VTZWdtZW50Q3VydmUiLCJvbGRTdGFydE1zIiwib2xkRW5kTXMiLCJuZXdTdGFydE1zIiwibmV3RW5kTXMiLCJjaGFuZ2VTZWdtZW50RW5kcG9pbnRzIiwib2xkVGltZWxpbmVOYW1lIiwibmV3VGltZWxpbmVOYW1lIiwicmVuYW1lVGltZWxpbmUiLCJjcmVhdGVUaW1lbGluZSIsImR1cGxpY2F0ZVRpbWVsaW5lIiwiZGVsZXRlVGltZWxpbmUiLCJjaGFuZ2VNcyIsImFkanVzdGVkTXMiLCJwYXJzZUludCIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIl9rZXlmcmFtZU1vdmVzIiwibW92ZW1lbnRLZXkiLCJqb2luIiwia2V5ZnJhbWVNb3Zlc0ZvcldpcmUiLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiaXNDb21wb25lbnQiLCJzb3VyY2UiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMiLCJfYnVpbGRET01BZGRyZXNzYWJsZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsImZyYW1lIiwidmFsdWUiLCJjdXJ2ZSIsInB4T2Zmc2V0TGVmdCIsInB4T2Zmc2V0UmlnaHQiLCJzZWdtZW50T3V0cHV0IiwicHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlPdXRwdXRzIiwibWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsImNvbmNhdCIsInBvc2l0aW9uIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJ0aW1lbGluZXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSIsInNldFRpbWVsaW5lTmFtZSIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsImN0eE1lbnVFdmVudCIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJpc1NlbGVjdGVkIiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIsIm5hbWVQYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQU1BOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOztBQWtDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxJQUFJQSxXQUFXQyxRQUFRLFVBQVIsQ0FBZjtBQUNBLElBQUlDLFdBQVdGLFNBQVNFLFFBQXhCO0FBQ0EsSUFBSUEsUUFBSixFQUFjO0FBQ1osTUFBSUEsU0FBU0Msa0JBQWIsRUFBaUNELFNBQVNDLGtCQUFULENBQTRCLENBQTVCLEVBQStCLENBQS9CO0FBQ2pDLE1BQUlELFNBQVNFLHdCQUFiLEVBQXVDRixTQUFTRSx3QkFBVCxDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQztBQUN4Qzs7QUFFRCxJQUFNQyxXQUFXO0FBQ2ZDLG1CQUFpQixHQURGO0FBRWZDLGtCQUFnQixHQUZEO0FBR2ZDLGFBQVcsRUFISTtBQUlmQyxrQkFBZ0IsRUFKRDtBQUtmQyxlQUFhLEVBTEU7QUFNZkMsa0JBQWdCLEVBTkQ7QUFPZkMscUJBQW1CLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FQSjtBQVFmQyxnQkFBYyxDQVJDO0FBU2ZDLFlBQVUsSUFUSztBQVVmQyxnQkFBYyxDQVZDO0FBV2ZDLG1CQUFpQixFQVhGO0FBWWZDLG1CQUFpQixRQVpGLEVBWVk7QUFDM0JDLHVCQUFxQixTQWJOO0FBY2ZDLG1CQUFpQixLQWRGO0FBZWZDLHVCQUFxQixHQWZOO0FBZ0JmQyxrQkFBZ0IsS0FoQkQ7QUFpQmZDLG9CQUFrQixLQWpCSDtBQWtCZkMsb0JBQWtCLEtBbEJIO0FBbUJmQyxnQkFBYyxLQW5CQztBQW9CZkMsOEJBQTRCLEtBcEJiO0FBcUJmQyx3QkFBc0IsS0FyQlA7QUFzQmZDLGlCQUFlLEVBdEJBO0FBdUJmQyxpQkFBZSxFQXZCQTtBQXdCZkMsaUJBQWUsRUF4QkE7QUF5QmZDLGVBQWEsRUF6QkU7QUEwQmZDLGlCQUFlLElBMUJBO0FBMkJmQyxnQkFBYyxJQTNCQztBQTRCZkMsNEJBQTBCLEVBNUJYO0FBNkJmQyxxQkFBbUIsRUE3Qko7QUE4QmZDLG9CQUFrQixFQTlCSDtBQStCZkMsbUJBQWlCLElBL0JGO0FBZ0NmQyxzQkFBb0I7QUFoQ0wsQ0FBakI7O0FBbUNBLElBQU1DLFlBQVk7QUFDaEJDLHlDQURnQjtBQUVoQkMsNkNBRmdCO0FBR2hCQyx5Q0FIZ0I7QUFJaEJDLDJDQUpnQjtBQUtoQkMsK0NBTGdCO0FBTWhCQyx5Q0FOZ0I7QUFPaEJDLHlDQVBnQjtBQVFoQkMsMkNBUmdCO0FBU2hCQywyQ0FUZ0I7QUFVaEJDLHlDQVZnQjtBQVdoQkMsK0NBWGdCO0FBWWhCQyxtREFaZ0I7QUFhaEJDLCtDQWJnQjtBQWNoQkMsaURBZGdCO0FBZWhCQyxxREFmZ0I7QUFnQmhCQywrQ0FoQmdCO0FBaUJoQkMsK0NBakJnQjtBQWtCaEJDLGlEQWxCZ0I7QUFtQmhCQyxpREFuQmdCO0FBb0JoQkMsK0NBcEJnQjtBQXFCaEJDLDJDQXJCZ0I7QUFzQmhCQywrQ0F0QmdCO0FBdUJoQkMsMkNBdkJnQjtBQXdCaEJDLDZDQXhCZ0I7QUF5QmhCQyxpREF6QmdCO0FBMEJoQkMsMkNBMUJnQjtBQTJCaEJDLDJDQTNCZ0I7QUE0QmhCQyw2Q0E1QmdCO0FBNkJoQkMsNkNBN0JnQjtBQThCaEJDLDJDQTlCZ0I7QUErQmhCQzs7QUFHRjs7Ozs7OztBQWxDa0IsQ0FBbEIsQ0F5Q0EsSUFBTUMsZ0JBQWdCO0FBQ3BCLG1CQUFpQixJQURHO0FBRXBCLG1CQUFpQixJQUZHO0FBR3BCO0FBQ0EsZ0JBQWMsSUFKTTtBQUtwQixnQkFBYyxJQUxNO0FBTXBCLGdCQUFjLElBTk07QUFPcEIsYUFBVyxJQVBTO0FBUXBCLGFBQVcsSUFSUztBQVNwQixhQUFXLElBVFM7QUFVcEI7QUFDQSxxQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBZG9CLENBQXRCOztBQWlCQSxJQUFNQyxrQkFBa0I7QUFDdEIsYUFBVyxPQURXO0FBRXRCLGFBQVcsT0FGVztBQUd0QixhQUFXLE9BSFc7QUFJdEIsYUFBVyxPQUpXO0FBS3RCLGFBQVcsT0FMVztBQU10QixhQUFXLE9BTlc7QUFPdEIsY0FBWSxRQVBVO0FBUXRCLGNBQVksUUFSVTtBQVN0QixjQUFZLFFBVFU7QUFVdEIsbUJBQWlCLGFBVks7QUFXdEIsbUJBQWlCLGFBWEs7QUFZdEIsbUJBQWlCLGFBWkssRUFZVTtBQUNoQyxnQkFBYyxVQWJRO0FBY3RCLGdCQUFjLFVBZFE7QUFldEIsZ0JBQWMsVUFmUTtBQWdCdEI7QUFDQSxhQUFXLE9BakJXO0FBa0J0QixhQUFXLE9BbEJXO0FBbUJ0QixhQUFXLE9BbkJXO0FBb0J0QixnQkFBYyxVQXBCUTtBQXFCdEIsZ0JBQWMsVUFyQlE7QUFzQnRCLGdCQUFjLFVBdEJRO0FBdUJ0Qix3QkFBc0Isa0JBdkJBO0FBd0J0Qix3QkFBc0Isa0JBeEJBO0FBeUJ0Qix3QkFBc0Isa0JBekJBO0FBMEJ0Qix3QkFBc0Isa0JBMUJBO0FBMkJ0Qix3QkFBc0Isa0JBM0JBO0FBNEJ0Qix3QkFBc0Isa0JBNUJBO0FBNkJ0QixvQkFBa0IsY0E3Qkk7QUE4QnRCLG9CQUFrQixjQTlCSTtBQStCdEIsb0JBQWtCLGNBL0JJO0FBZ0N0QixxQkFBbUIsVUFoQ0c7QUFpQ3RCLHFCQUFtQjtBQWpDRyxDQUF4Qjs7QUFvQ0EsSUFBTUMsZ0JBQWdCO0FBQ3BCLFdBQVMsT0FEVztBQUVwQixXQUFTLE9BRlc7QUFHcEIsWUFBVSxRQUhVO0FBSXBCLGlCQUFlLFVBSks7QUFLcEIsY0FBWSxVQUxRO0FBTXBCLFdBQVMsT0FOVztBQU9wQixjQUFZLGFBUFE7QUFRcEIsc0JBQW9CLFFBUkE7QUFTcEIsc0JBQW9CLFVBVEE7QUFVcEIsa0JBQWdCLE1BVkk7QUFXcEIsY0FBWTtBQVhRLENBQXRCOztBQWNBLElBQU1DLDBCQUEwQjtBQUM5QixvQkFBa0IsSUFEWTtBQUU5QixvQkFBa0IsSUFGWTtBQUc5QjtBQUNBO0FBQ0E7QUFDQSxxQkFBbUIsSUFOVztBQU85QixhQUFXO0FBUG1CLENBQWhDOztBQVVBLElBQU1DLG1CQUFtQjtBQUN2QkMsT0FBSyxJQURrQjtBQUV2QkMsT0FBSyxJQUZrQjtBQUd2QkMsS0FBRyxJQUhvQjtBQUl2QkMsUUFBTSxJQUppQjtBQUt2QkMsVUFBUSxJQUxlO0FBTXZCQyxXQUFTLElBTmM7QUFPdkJDLFFBQU0sSUFQaUI7QUFRdkJDLFlBQVUsSUFSYTtBQVN2QkMsV0FBUztBQVRjLENBQXpCOztBQVlBLElBQU1DLGdCQUFnQixFQUF0QixDLENBQXlCOztBQUV6QixTQUFTQyxLQUFULENBQWdCQyxJQUFoQixFQUFzQkMsT0FBdEIsRUFBK0I7QUFDN0IsTUFBSUQsS0FBS0UsUUFBVCxFQUFtQjtBQUNqQixTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUgsS0FBS0UsUUFBTCxDQUFjRSxNQUFsQyxFQUEwQ0QsR0FBMUMsRUFBK0M7QUFDN0MsVUFBSUUsUUFBUUwsS0FBS0UsUUFBTCxDQUFjQyxDQUFkLENBQVo7QUFDQSxVQUFJRSxTQUFTLE9BQU9BLEtBQVAsS0FBaUIsUUFBOUIsRUFBd0M7QUFDdENKLGdCQUFRSSxLQUFSO0FBQ0FOLGNBQU1NLEtBQU4sRUFBYUosT0FBYjtBQUNEO0FBQ0Y7QUFDRjtBQUNGOztJQUVLSyxROzs7QUFDSixvQkFBYUMsS0FBYixFQUFvQjtBQUFBOztBQUFBLG9IQUNaQSxLQURZOztBQUdsQixVQUFLQyxLQUFMLEdBQWEsaUJBQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCMUYsUUFBbEIsQ0FBYjtBQUNBLFVBQUsyRixPQUFMLEdBQWUsMEJBQWdCQyxNQUFoQixRQUFmOztBQUVBLFVBQUtDLFFBQUwsR0FBZ0IsRUFBaEIsQ0FOa0IsQ0FNQzs7QUFFbkIsVUFBS0MsVUFBTCxHQUFrQiw4QkFBb0I7QUFDcENDLGFBQU8sVUFENkI7QUFFcENDLGNBQVEsTUFBS1IsS0FBTCxDQUFXUSxNQUZpQjtBQUdwQ0Msa0JBQVksTUFBS1QsS0FBTCxDQUFXUyxVQUhhO0FBSXBDQyxpQkFBVyxNQUFLVixLQUFMLENBQVdVLFNBSmM7QUFLcENDLGdCQUFVUCxNQUwwQjtBQU1wQ1EsYUFBTyxNQUFLWixLQUFMLENBQVdZLEtBTmtCO0FBT3BDQyxpQkFBV1QsT0FBT1M7QUFQa0IsS0FBcEIsQ0FBbEI7O0FBVUE7QUFDQTtBQUNBLFVBQUtDLDJCQUFMLEdBQW1DLGlCQUFPQyxRQUFQLENBQWdCLE1BQUtELDJCQUFMLENBQWlDRSxJQUFqQyxPQUFoQixFQUE2RCxHQUE3RCxDQUFuQztBQUNBLFVBQUtDLFdBQUwsR0FBbUIsTUFBS0EsV0FBTCxDQUFpQkQsSUFBakIsT0FBbkI7QUFDQSxVQUFLRSwrQkFBTCxHQUF1QyxNQUFLQSwrQkFBTCxDQUFxQ0YsSUFBckMsT0FBdkM7QUFDQVosV0FBT2UsUUFBUDtBQXZCa0I7QUF3Qm5COzs7O21DQUVlO0FBQUE7O0FBQ2QsVUFBSSxDQUFDLEtBQUtsQixLQUFMLENBQVdtQixRQUFoQixFQUEwQjtBQUN4QixlQUFPLEtBQU0sQ0FBYjtBQUNEO0FBQ0QsVUFBSUMsT0FBT0MsSUFBUCxDQUFZLEtBQUtDLE9BQWpCLEVBQTBCMUIsTUFBMUIsR0FBbUMsQ0FBdkMsRUFBMEM7QUFDeEMsZUFBTyxLQUFNLENBQWI7QUFDRDtBQUNELFdBQUssSUFBTTJCLEdBQVgsSUFBa0IsS0FBS0QsT0FBdkIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLdEIsS0FBTCxDQUFXdUIsR0FBWCxNQUFvQixLQUFLRCxPQUFMLENBQWFDLEdBQWIsQ0FBeEIsRUFBMkM7QUFDekMsZUFBS0MsT0FBTCxDQUFhRCxHQUFiLElBQW9CLEtBQUtELE9BQUwsQ0FBYUMsR0FBYixDQUFwQjtBQUNEO0FBQ0Y7QUFDRCxVQUFJRSxNQUFNLEtBQUtDLFNBQUwsQ0FBZUMsTUFBZixDQUFzQixDQUF0QixDQUFWO0FBQ0EsV0FBS0MsUUFBTCxDQUFjLEtBQUtOLE9BQW5CLEVBQTRCLFlBQU07QUFDaEMsZUFBS08sWUFBTDtBQUNBSixZQUFJSyxPQUFKLENBQVksVUFBQ0MsRUFBRDtBQUFBLGlCQUFRQSxJQUFSO0FBQUEsU0FBWjtBQUNELE9BSEQ7QUFJRDs7O2dDQUVZVCxPLEVBQVNTLEUsRUFBSTtBQUN4QixXQUFLLElBQU1SLEdBQVgsSUFBa0JELE9BQWxCLEVBQTJCO0FBQ3pCLGFBQUtBLE9BQUwsQ0FBYUMsR0FBYixJQUFvQkQsUUFBUUMsR0FBUixDQUFwQjtBQUNEO0FBQ0QsVUFBSVEsRUFBSixFQUFRO0FBQ04sYUFBS0wsU0FBTCxDQUFlTSxJQUFmLENBQW9CRCxFQUFwQjtBQUNEO0FBQ0QsV0FBS0UsWUFBTDtBQUNEOzs7bUNBRWU7QUFDZCxXQUFLLElBQU1DLEVBQVgsSUFBaUIsS0FBS1osT0FBdEI7QUFBK0IsZUFBTyxLQUFLQSxPQUFMLENBQWFZLEVBQWIsQ0FBUDtBQUEvQixPQUNBLEtBQUssSUFBTUMsRUFBWCxJQUFpQixLQUFLWCxPQUF0QjtBQUErQixlQUFPLEtBQUtBLE9BQUwsQ0FBYVcsRUFBYixDQUFQO0FBQS9CO0FBQ0Q7OzsrQkFFV3BILFksRUFBYztBQUN4QixXQUFLNkcsUUFBTCxDQUFjLEVBQUU3RywwQkFBRixFQUFkO0FBQ0Q7OztnREFFcUQ7QUFBQSxVQUE3QnFILFdBQTZCLFFBQTdCQSxXQUE2QjtBQUFBLFVBQWhCQyxZQUFnQixRQUFoQkEsWUFBZ0I7O0FBQ3BELFdBQUtDLG1CQUFMLEdBQTJCLEVBQUVGLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTNCO0FBQ0EsYUFBTyxLQUFLQyxtQkFBWjtBQUNEOzs7bURBRXVEO0FBQUEsVUFBN0JGLFdBQTZCLFNBQTdCQSxXQUE2QjtBQUFBLFVBQWhCQyxZQUFnQixTQUFoQkEsWUFBZ0I7O0FBQ3RELFdBQUtDLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0EsYUFBTyxLQUFLQSxtQkFBWjtBQUNEOztBQUVEOzs7Ozs7MkNBSXdCO0FBQ3RCO0FBQ0EsV0FBS2xDLFFBQUwsQ0FBYzBCLE9BQWQsQ0FBc0IsVUFBQ1MsS0FBRCxFQUFXO0FBQy9CQSxjQUFNLENBQU4sRUFBU0MsY0FBVCxDQUF3QkQsTUFBTSxDQUFOLENBQXhCLEVBQWtDQSxNQUFNLENBQU4sQ0FBbEM7QUFDRCxPQUZEO0FBR0EsV0FBS3ZDLEtBQUwsQ0FBV21CLFFBQVgsR0FBc0IsS0FBdEI7O0FBRUEsV0FBS3NCLFVBQUwsQ0FBZ0JDLEdBQWhCLENBQW9CLGdDQUFwQixFQUFzRCxLQUFLekIsK0JBQTNEO0FBQ0EsV0FBSzBCLFlBQUwsQ0FBa0JDLGVBQWxCOztBQUVBO0FBQ0E7QUFDRDs7O3dDQUVvQjtBQUFBOztBQUNuQixXQUFLaEIsUUFBTCxDQUFjO0FBQ1pULGtCQUFVO0FBREUsT0FBZDs7QUFJQSxXQUFLUyxRQUFMLENBQWM7QUFDWm5ILHdCQUFnQm9JLFNBQVNDLElBQVQsQ0FBY0MsV0FBZCxHQUE0QixLQUFLL0MsS0FBTCxDQUFXeEY7QUFEM0MsT0FBZDs7QUFJQTJGLGFBQU82QyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxpQkFBT2xDLFFBQVAsQ0FBZ0IsWUFBTTtBQUN0RCxZQUFJLE9BQUtkLEtBQUwsQ0FBV21CLFFBQWYsRUFBeUI7QUFDdkIsaUJBQUtTLFFBQUwsQ0FBYyxFQUFFbkgsZ0JBQWdCb0ksU0FBU0MsSUFBVCxDQUFjQyxXQUFkLEdBQTRCLE9BQUsvQyxLQUFMLENBQVd4RixlQUF6RCxFQUFkO0FBQ0Q7QUFDRixPQUppQyxFQUkvQjhFLGFBSitCLENBQWxDOztBQU1BLFdBQUsyRCxrQkFBTCxDQUF3QixLQUFLbEQsS0FBTCxDQUFXVSxTQUFuQyxFQUE4QyxXQUE5QyxFQUEyRCxVQUFDeUMsT0FBRCxFQUFhO0FBQ3RFLFlBQUlBLFFBQVEzQyxNQUFSLEtBQW1CLE9BQUtSLEtBQUwsQ0FBV1EsTUFBbEMsRUFBMEMsT0FBTyxLQUFNLENBQWI7QUFDMUMsZ0JBQVEyQyxRQUFRQyxJQUFoQjtBQUNFLGVBQUssa0JBQUw7QUFBeUIsbUJBQU8sT0FBSzlDLFVBQUwsQ0FBZ0IrQyxnQkFBaEIsRUFBUDtBQUN6QjtBQUFTLG1CQUFPLEtBQU0sQ0FBYjtBQUZYO0FBSUQsT0FORDs7QUFRQSxXQUFLckQsS0FBTCxDQUFXVSxTQUFYLENBQXFCNEMsRUFBckIsQ0FBd0IsUUFBeEIsRUFBa0MsVUFBQ0MsTUFBRCxFQUFTQyxNQUFULEVBQWlCeEIsRUFBakIsRUFBd0I7QUFDeER5QixnQkFBUUMsSUFBUixDQUFhLDRCQUFiLEVBQTJDSCxNQUEzQyxFQUFtREMsTUFBbkQ7QUFDQSxlQUFPLE9BQUtsRCxVQUFMLENBQWdCcUQsVUFBaEIsQ0FBMkJKLE1BQTNCLEVBQW1DQyxNQUFuQyxFQUEyQ3hCLEVBQTNDLENBQVA7QUFDRCxPQUhEOztBQUtBLFdBQUsxQixVQUFMLENBQWdCZ0QsRUFBaEIsQ0FBbUIsbUJBQW5CLEVBQXdDLFVBQUNNLGlCQUFELEVBQW9CQyxpQkFBcEIsRUFBdUNDLGlCQUF2QyxFQUEwREMsa0JBQTFELEVBQThFQyxhQUE5RSxFQUFnRztBQUN0SVAsZ0JBQVFDLElBQVIsQ0FBYSw4QkFBYixFQUE2Q0UsaUJBQTdDLEVBQWdFQyxpQkFBaEUsRUFBbUZDLGlCQUFuRixFQUFzR0Msa0JBQXRHLEVBQTBIQyxhQUExSDs7QUFFQTtBQUNBLGVBQUsxRCxVQUFMLENBQWdCMkQsWUFBaEI7O0FBRUEsWUFBSTFILGtCQUFrQixPQUFLK0QsVUFBTCxDQUFnQjRELGtCQUFoQixFQUF0QjtBQUNBLFlBQUkxSCxxQkFBcUIsT0FBSzhELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFBekI7QUFDQSxtREFBNEI1SCxlQUE1Qjs7QUFFQSxlQUFLc0YsUUFBTCxDQUFjLEVBQUV0RixnQ0FBRixFQUFtQkMsc0NBQW5CLEVBQWQ7O0FBRUEsWUFBSXdILGlCQUFpQkEsY0FBY0ksSUFBZCxLQUF1QixVQUE1QyxFQUF3RDtBQUN0RCxjQUFJUixxQkFBcUJDLGlCQUFyQixJQUEwQ0Usa0JBQTlDLEVBQWtFO0FBQ2hFSCw4QkFBa0I3QixPQUFsQixDQUEwQixVQUFDTSxXQUFELEVBQWlCO0FBQ3pDLHFCQUFLZ0MseUJBQUwsQ0FBK0JoQyxXQUEvQixFQUE0Q3dCLGlCQUE1QyxFQUErREMscUJBQXFCLENBQXBGLEVBQXVGQyxrQkFBdkY7QUFDRCxhQUZEO0FBR0Q7QUFDRjtBQUNGLE9BbkJEOztBQXFCQSxXQUFLekQsVUFBTCxDQUFnQmdELEVBQWhCLENBQW1CLGtCQUFuQixFQUF1QyxVQUFDakIsV0FBRCxFQUFpQjtBQUN0RG9CLGdCQUFRQyxJQUFSLENBQWEsNkJBQWIsRUFBNENyQixXQUE1QztBQUNBLGVBQUtpQyxtQkFBTCxDQUF5QixFQUFFakMsd0JBQUYsRUFBekI7QUFDRCxPQUhEOztBQUtBLFdBQUsvQixVQUFMLENBQWdCZ0QsRUFBaEIsQ0FBbUIsb0JBQW5CLEVBQXlDLFVBQUNqQixXQUFELEVBQWlCO0FBQ3hEb0IsZ0JBQVFDLElBQVIsQ0FBYSwrQkFBYixFQUE4Q3JCLFdBQTlDO0FBQ0EsZUFBS2tDLHFCQUFMLENBQTJCLEVBQUVsQyx3QkFBRixFQUEzQjtBQUNELE9BSEQ7O0FBS0EsV0FBSy9CLFVBQUwsQ0FBZ0JnRCxFQUFoQixDQUFtQixtQkFBbkIsRUFBd0MsWUFBTTtBQUM1QyxZQUFJL0csa0JBQWtCLE9BQUsrRCxVQUFMLENBQWdCNEQsa0JBQWhCLEVBQXRCO0FBQ0EsWUFBSTFILHFCQUFxQixPQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQixFQUF6QjtBQUNBVixnQkFBUUMsSUFBUixDQUFhLDhCQUFiLEVBQTZDbkgsZUFBN0M7QUFDQSxlQUFLaUksaUJBQUwsQ0FBdUJqSSxlQUF2QixFQUF3Q0Msa0JBQXhDO0FBQ0E7QUFDRCxPQU5EOztBQVFBO0FBQ0EsV0FBSzhELFVBQUwsQ0FBZ0IrQyxnQkFBaEI7O0FBRUEsV0FBSy9DLFVBQUwsQ0FBZ0JnRCxFQUFoQixDQUFtQix1QkFBbkIsRUFBNEMsVUFBQ21CLE1BQUQsRUFBWTtBQUN0REEsZUFBT25CLEVBQVAsQ0FBVSxnQ0FBVixFQUE0QyxPQUFLcEMsK0JBQWpEOztBQUVBd0QsbUJBQVcsWUFBTTtBQUNmRCxpQkFBT0UsSUFBUDtBQUNELFNBRkQ7O0FBSUEsZUFBS2pDLFVBQUwsR0FBa0IrQixNQUFsQjtBQUNELE9BUkQ7O0FBVUEzQixlQUFTRyxnQkFBVCxDQUEwQixPQUExQixFQUFtQyxVQUFDMkIsVUFBRCxFQUFnQjtBQUNqRG5CLGdCQUFRQyxJQUFSLENBQWEsd0JBQWI7QUFDQSxZQUFJbUIsVUFBVUQsV0FBV0UsTUFBWCxDQUFrQkMsT0FBbEIsQ0FBMEJDLFdBQTFCLEVBQWQ7QUFDQSxZQUFJQyxXQUFXTCxXQUFXRSxNQUFYLENBQWtCSSxZQUFsQixDQUErQixpQkFBL0IsQ0FBZixDQUhpRCxDQUdnQjtBQUNqRSxZQUFJTCxZQUFZLE9BQVosSUFBdUJBLFlBQVksVUFBbkMsSUFBaURJLFFBQXJELEVBQStEO0FBQzdEeEIsa0JBQVFDLElBQVIsQ0FBYSw4QkFBYjtBQUNBO0FBQ0E7QUFDRCxTQUpELE1BSU87QUFDTDtBQUNBO0FBQ0FELGtCQUFRQyxJQUFSLENBQWEsd0NBQWI7QUFDQWtCLHFCQUFXTyxjQUFYO0FBQ0EsaUJBQUtuRixLQUFMLENBQVdVLFNBQVgsQ0FBcUIwRSxJQUFyQixDQUEwQjtBQUN4QkMsa0JBQU0sV0FEa0I7QUFFeEJqQyxrQkFBTSxpQ0FGa0I7QUFHeEJnQixrQkFBTSxPQUhrQjtBQUl4QmtCLGtCQUFNLElBSmtCLENBSWI7QUFKYSxXQUExQjtBQU1EO0FBQ0YsT0FwQkQ7O0FBc0JBeEMsZUFBU0MsSUFBVCxDQUFjRSxnQkFBZCxDQUErQixTQUEvQixFQUEwQyxLQUFLc0MsYUFBTCxDQUFtQnZFLElBQW5CLENBQXdCLElBQXhCLENBQTFDLEVBQXlFLEtBQXpFOztBQUVBOEIsZUFBU0MsSUFBVCxDQUFjRSxnQkFBZCxDQUErQixPQUEvQixFQUF3QyxLQUFLdUMsV0FBTCxDQUFpQnhFLElBQWpCLENBQXNCLElBQXRCLENBQXhDOztBQUVBLFdBQUtrQyxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0MsZ0JBQXRDLEVBQXdELFVBQUNrQyxXQUFELEVBQWNvRCxZQUFkLEVBQTRCQyxXQUE1QixFQUF5Q3BELFlBQXpDLEVBQXVEcUQsT0FBdkQsRUFBbUU7QUFDekgsWUFBSUMsWUFBWSxPQUFLQyxZQUFMLEVBQWhCO0FBQ0EsWUFBSUMsZUFBZSx5Q0FBMEJILE9BQTFCLEVBQW1DQyxVQUFVRyxJQUE3QyxDQUFuQjtBQUNBLFlBQUlDLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osZUFBZUYsVUFBVUcsSUFBcEMsQ0FBZDtBQUNBLGVBQUtJLG1DQUFMLENBQXlDOUQsV0FBekMsRUFBc0RvRCxZQUF0RCxFQUFvRUMsV0FBcEUsRUFBaUZwRCxZQUFqRixFQUErRjBELE9BQS9GLENBQXNHLG1DQUF0RztBQUNELE9BTEQ7QUFNQSxXQUFLOUMsa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLGNBQXRDLEVBQXNELFVBQUNrQyxXQUFELEVBQWNvRCxZQUFkLEVBQTRCQyxXQUE1QixFQUF5Q3BELFlBQXpDLEVBQXVEcUQsT0FBdkQsRUFBbUU7QUFDdkgsWUFBSUMsWUFBWSxPQUFLQyxZQUFMLEVBQWhCO0FBQ0EsWUFBSUMsZUFBZSx5Q0FBMEJILE9BQTFCLEVBQW1DQyxVQUFVRyxJQUE3QyxDQUFuQjtBQUNBLFlBQUlDLFVBQVVDLEtBQUtDLEtBQUwsQ0FBV0osZUFBZUYsVUFBVUcsSUFBcEMsQ0FBZDtBQUNBLGVBQUtLLGlDQUFMLENBQXVDL0QsV0FBdkMsRUFBb0RvRCxZQUFwRCxFQUFrRUMsV0FBbEUsRUFBK0VwRCxZQUEvRSxFQUE2RjBELE9BQTdGO0FBQ0QsT0FMRDtBQU1BLFdBQUs5QyxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0MsZUFBdEMsRUFBdUQsVUFBQ2tDLFdBQUQsRUFBY29ELFlBQWQsRUFBNEJDLFdBQTVCLEVBQXlDcEQsWUFBekMsRUFBdURxRCxPQUF2RCxFQUFnRVUsS0FBaEUsRUFBdUVDLFNBQXZFLEVBQXFGO0FBQzFJLFlBQUksT0FBSzVELFVBQVQsRUFBcUIsT0FBS0EsVUFBTCxDQUFnQmlDLElBQWhCO0FBQ3JCLGVBQUs0QiwyQkFBTCxDQUFpQ2xFLFdBQWpDLEVBQThDb0QsWUFBOUMsRUFBNERuRCxZQUE1RCxFQUEwRXFELE9BQTFFLEVBQW1GVyxTQUFuRjtBQUNELE9BSEQ7QUFJQSxXQUFLcEQsa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLGdCQUF0QyxFQUF3RCxVQUFDa0MsV0FBRCxFQUFjb0QsWUFBZCxFQUE0Qm5ELFlBQTVCLEVBQTBDcUQsT0FBMUMsRUFBc0Q7QUFDNUcsZUFBS2EsbUNBQUwsQ0FBeUMsRUFBQ25FLGFBQWEsRUFBQ0Esd0JBQUQsRUFBY0MsMEJBQWQsRUFBNEJtRSxJQUFJZCxPQUFoQyxFQUFkLEVBQXpDLEVBQWtHRixZQUFsRztBQUNELE9BRkQ7QUFHQSxXQUFLdkMsa0JBQUwsQ0FBd0IsS0FBSy9DLE9BQTdCLEVBQXNDLG9CQUF0QyxFQUE0RCxVQUFDa0MsV0FBRCxFQUFjb0QsWUFBZCxFQUE0Qm5ELFlBQTVCLEVBQTBDcUQsT0FBMUMsRUFBbURXLFNBQW5ELEVBQWlFO0FBQzNILGVBQUtDLDJCQUFMLENBQWlDbEUsV0FBakMsRUFBOENvRCxZQUE5QyxFQUE0RG5ELFlBQTVELEVBQTBFcUQsT0FBMUUsRUFBbUZXLFNBQW5GO0FBQ0QsT0FGRDtBQUdBLFdBQUtwRCxrQkFBTCxDQUF3QixLQUFLL0MsT0FBN0IsRUFBc0Msc0JBQXRDLEVBQThELFVBQUNrQyxXQUFELEVBQWNvRCxZQUFkLEVBQTRCbkQsWUFBNUIsRUFBMENvRSxNQUExQyxFQUFrREMsYUFBbEQsRUFBaUVoQixPQUFqRSxFQUEwRVUsS0FBMUUsRUFBb0Y7QUFDaEosZUFBS08seUNBQUwsQ0FBK0N2RSxXQUEvQyxFQUE0RG9ELFlBQTVELEVBQTBFbkQsWUFBMUUsRUFBd0ZvRSxNQUF4RixFQUFnR0MsYUFBaEcsRUFBK0doQixPQUEvRyxFQUF3SFUsS0FBeEg7QUFDRCxPQUZEOztBQUlBLFdBQUtuRCxrQkFBTCxDQUF3QixLQUFLNUMsVUFBTCxDQUFnQnVHLFVBQXhDLEVBQW9ELHFCQUFwRCxFQUEyRSxVQUFDN0wsWUFBRCxFQUFrQjtBQUMzRixZQUFJNEssWUFBWSxPQUFLQyxZQUFMLEVBQWhCO0FBQ0EsZUFBS2lCLFVBQUwsQ0FBZ0I5TCxZQUFoQjtBQUNBO0FBQ0E7QUFDQSxZQUFJQSxlQUFlNEssVUFBVW1CLE1BQTdCLEVBQXFDO0FBQ25DLGlCQUFLekcsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQ0MsWUFBckMsQ0FBa0RyQixVQUFVbUIsTUFBNUQ7QUFDQSxpQkFBS2xGLFFBQUwsQ0FBYyxFQUFDdkcsaUJBQWlCLEtBQWxCLEVBQWQ7QUFDRDtBQUNEO0FBQ0E7QUFDQSxZQUFJTixnQkFBZ0I0SyxVQUFVc0IsSUFBMUIsSUFBa0NsTSxlQUFlNEssVUFBVXVCLElBQS9ELEVBQXFFO0FBQ25FLGlCQUFLQyx1Q0FBTCxDQUE2Q3hCLFNBQTdDO0FBQ0Q7QUFDRixPQWREOztBQWdCQSxXQUFLMUMsa0JBQUwsQ0FBd0IsS0FBSzVDLFVBQUwsQ0FBZ0J1RyxVQUF4QyxFQUFvRCx3Q0FBcEQsRUFBOEYsVUFBQzdMLFlBQUQsRUFBa0I7QUFDOUcsWUFBSTRLLFlBQVksT0FBS0MsWUFBTCxFQUFoQjtBQUNBLGVBQUtpQixVQUFMLENBQWdCOUwsWUFBaEI7QUFDQTtBQUNBO0FBQ0EsWUFBSUEsZ0JBQWdCNEssVUFBVXNCLElBQTFCLElBQWtDbE0sZUFBZTRLLFVBQVV1QixJQUEvRCxFQUFxRTtBQUNuRSxpQkFBS0MsdUNBQUwsQ0FBNkN4QixTQUE3QztBQUNEO0FBQ0YsT0FSRDtBQVNEOzs7MkRBRXVEO0FBQUEsVUFBckJ5QixRQUFxQixTQUFyQkEsUUFBcUI7QUFBQSxVQUFYQyxPQUFXLFNBQVhBLE9BQVc7O0FBQ3RELFVBQUlBLFlBQVksVUFBaEIsRUFBNEI7QUFBRTtBQUFROztBQUV0QyxVQUFJO0FBQ0Y7QUFDQSxZQUFJQyxVQUFVekUsU0FBUzBFLGFBQVQsQ0FBdUJILFFBQXZCLENBQWQ7O0FBRkUsb0NBR2tCRSxRQUFRRSxxQkFBUixFQUhsQjtBQUFBLFlBR0lDLEdBSEoseUJBR0lBLEdBSEo7QUFBQSxZQUdTQyxJQUhULHlCQUdTQSxJQUhUOztBQUtGLGFBQUtqRixVQUFMLENBQWdCa0YseUJBQWhCLENBQTBDLFVBQTFDLEVBQXNELEVBQUVGLFFBQUYsRUFBT0MsVUFBUCxFQUF0RDtBQUNELE9BTkQsQ0FNRSxPQUFPRSxLQUFQLEVBQWM7QUFDZHBFLGdCQUFRb0UsS0FBUixxQkFBZ0NSLFFBQWhDLG9CQUF1REMsT0FBdkQ7QUFDRDtBQUNGOzs7a0NBRWNRLFcsRUFBYTtBQUMxQjtBQUNBLFVBQUksS0FBS0MsSUFBTCxDQUFVQyxlQUFWLENBQTBCQyw4QkFBMUIsQ0FBeURILFdBQXpELENBQUosRUFBMkU7QUFDekUsZUFBTyxLQUFNLENBQWI7QUFDRDs7QUFFRDtBQUNBLFVBQUlBLFlBQVlJLE9BQVosS0FBd0IsRUFBeEIsSUFBOEIsQ0FBQ3BGLFNBQVMwRSxhQUFULENBQXVCLGFBQXZCLENBQW5DLEVBQTBFO0FBQ3hFLGFBQUtXLGNBQUw7QUFDQUwsb0JBQVkzQyxjQUFaO0FBQ0EsZUFBTyxLQUFNLENBQWI7QUFDRDs7QUFFRCxjQUFRMkMsWUFBWU0sS0FBcEI7QUFDRTtBQUNBO0FBQ0EsYUFBSyxFQUFMO0FBQVM7QUFDUCxjQUFJLEtBQUtuSSxLQUFMLENBQVd4RSxnQkFBZixFQUFpQztBQUMvQixnQkFBSSxLQUFLd0UsS0FBTCxDQUFXekUsY0FBZixFQUErQjtBQUM3QixtQkFBS3FHLFFBQUwsQ0FBYyxFQUFFOUcsbUJBQW1CLENBQUMsQ0FBRCxFQUFJLEtBQUtrRixLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixDQUFKLENBQXJCLEVBQTJEYyxzQkFBc0IsS0FBakYsRUFBZDtBQUNBLHFCQUFPLEtBQUtpTCxVQUFMLENBQWdCLENBQWhCLENBQVA7QUFDRCxhQUhELE1BR087QUFDTCxxQkFBTyxLQUFLdUIsc0JBQUwsQ0FBNEIsQ0FBQyxDQUE3QixDQUFQO0FBQ0Q7QUFDRixXQVBELE1BT087QUFDTCxnQkFBSSxLQUFLcEksS0FBTCxDQUFXcEUsb0JBQVgsSUFBbUMsS0FBS29FLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLE1BQW9DLENBQTNFLEVBQThFO0FBQzVFLG1CQUFLOEcsUUFBTCxDQUFjLEVBQUVoRyxzQkFBc0IsS0FBeEIsRUFBZDtBQUNEO0FBQ0QsbUJBQU8sS0FBS3lNLHVCQUFMLENBQTZCLENBQUMsQ0FBOUIsQ0FBUDtBQUNEOztBQUVILGFBQUssRUFBTDtBQUFTO0FBQ1AsY0FBSSxLQUFLckksS0FBTCxDQUFXeEUsZ0JBQWYsRUFBaUM7QUFDL0IsbUJBQU8sS0FBSzRNLHNCQUFMLENBQTRCLENBQTVCLENBQVA7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSSxDQUFDLEtBQUtwSSxLQUFMLENBQVdwRSxvQkFBaEIsRUFBc0MsS0FBS2dHLFFBQUwsQ0FBYyxFQUFFaEcsc0JBQXNCLElBQXhCLEVBQWQ7QUFDdEMsbUJBQU8sS0FBS3lNLHVCQUFMLENBQTZCLENBQTdCLENBQVA7QUFDRDs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUssQ0FBTDtBQUFRO0FBQ04sY0FBSSxDQUFDLGlCQUFPQyxPQUFQLENBQWUsS0FBS3RJLEtBQUwsQ0FBVzVELGlCQUExQixDQUFMLEVBQW1EO0FBQ2pELGlCQUFLbUssbUNBQUwsQ0FBeUMsS0FBS3ZHLEtBQUwsQ0FBVzVELGlCQUFwRCxFQUF1RSxLQUFLNEQsS0FBTCxDQUFXNUUsbUJBQWxGO0FBQ0Q7QUFDSCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLbU4sbUJBQUwsQ0FBeUIsRUFBRWhOLGdCQUFnQixJQUFsQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBS2dOLG1CQUFMLENBQXlCLEVBQUU5TSxrQkFBa0IsSUFBcEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUs4TSxtQkFBTCxDQUF5QixFQUFFN00sY0FBYyxJQUFoQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxHQUFMO0FBQVUsaUJBQU8sS0FBSzZNLG1CQUFMLENBQXlCLEVBQUUvTSxrQkFBa0IsSUFBcEIsRUFBekIsQ0FBUDtBQUNWLGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUsrTSxtQkFBTCxDQUF5QixFQUFFL00sa0JBQWtCLElBQXBCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLK00sbUJBQUwsQ0FBeUIsRUFBRS9NLGtCQUFrQixJQUFwQixFQUF6QixDQUFQO0FBdkNYO0FBeUNEOzs7Z0NBRVlxTSxXLEVBQWE7QUFDeEIsY0FBUUEsWUFBWU0sS0FBcEI7QUFDRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLSSxtQkFBTCxDQUF5QixFQUFFaE4sZ0JBQWdCLEtBQWxCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEVBQUw7QUFBUyxpQkFBTyxLQUFLZ04sbUJBQUwsQ0FBeUIsRUFBRTlNLGtCQUFrQixLQUFwQixFQUF6QixDQUFQO0FBQ1QsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSzhNLG1CQUFMLENBQXlCLEVBQUU3TSxjQUFjLEtBQWhCLEVBQXpCLENBQVA7QUFDVCxhQUFLLEdBQUw7QUFBVSxpQkFBTyxLQUFLNk0sbUJBQUwsQ0FBeUIsRUFBRS9NLGtCQUFrQixLQUFwQixFQUF6QixDQUFQO0FBQ1YsYUFBSyxFQUFMO0FBQVMsaUJBQU8sS0FBSytNLG1CQUFMLENBQXlCLEVBQUUvTSxrQkFBa0IsS0FBcEIsRUFBekIsQ0FBUDtBQUNULGFBQUssRUFBTDtBQUFTLGlCQUFPLEtBQUsrTSxtQkFBTCxDQUF5QixFQUFFL00sa0JBQWtCLEtBQXBCLEVBQXpCLENBQVA7QUFmWDtBQWlCRDs7O3dDQUVvQjhGLE8sRUFBUztBQUM1QjtBQUNBO0FBQ0EsVUFBSSxDQUFDLEtBQUt0QixLQUFMLENBQVc5RCxZQUFoQixFQUE4QjtBQUM1QixlQUFPLEtBQUswRixRQUFMLENBQWNOLE9BQWQsQ0FBUDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUssSUFBSUMsR0FBVCxJQUFnQkQsT0FBaEIsRUFBeUI7QUFDdkIsZUFBS3RCLEtBQUwsQ0FBV3VCLEdBQVgsSUFBa0JELFFBQVFDLEdBQVIsQ0FBbEI7QUFDRDtBQUNGO0FBQ0Y7Ozt1Q0FFbUJpSCxZLEVBQWNDLFMsRUFBV0MsWSxFQUFjO0FBQ3pELFdBQUt0SSxRQUFMLENBQWM0QixJQUFkLENBQW1CLENBQUN3RyxZQUFELEVBQWVDLFNBQWYsRUFBMEJDLFlBQTFCLENBQW5CO0FBQ0FGLG1CQUFhbkYsRUFBYixDQUFnQm9GLFNBQWhCLEVBQTJCQyxZQUEzQjtBQUNEOztBQUVEOzs7Ozs7aUNBSWNsSixJLEVBQU07QUFDbEJBLFdBQUttSixZQUFMLEdBQW9CLEtBQXBCO0FBQ0EsVUFBSTlNLGdCQUFnQixpQkFBTytNLEtBQVAsQ0FBYSxLQUFLNUksS0FBTCxDQUFXbkUsYUFBeEIsQ0FBcEI7QUFDQUEsb0JBQWMyRCxLQUFLcUosVUFBTCxDQUFnQixVQUFoQixDQUFkLElBQTZDLEtBQTdDO0FBQ0EsV0FBS2pILFFBQUwsQ0FBYztBQUNaM0YsdUJBQWUsSUFESCxFQUNTO0FBQ3JCQyxzQkFBYyxJQUZGLEVBRVE7QUFDcEJMLHVCQUFlQSxhQUhIO0FBSVppTixvQkFBWUMsS0FBS0MsR0FBTDtBQUpBLE9BQWQ7QUFNRDs7OytCQUVXeEosSSxFQUFNO0FBQ2hCQSxXQUFLbUosWUFBTCxHQUFvQixJQUFwQjtBQUNBLFVBQUk5TSxnQkFBZ0IsaUJBQU8rTSxLQUFQLENBQWEsS0FBSzVJLEtBQUwsQ0FBV25FLGFBQXhCLENBQXBCO0FBQ0FBLG9CQUFjMkQsS0FBS3FKLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBZCxJQUE2QyxJQUE3QztBQUNBLFdBQUtqSCxRQUFMLENBQWM7QUFDWjNGLHVCQUFlLElBREgsRUFDUztBQUNyQkMsc0JBQWMsSUFGRixFQUVRO0FBQ3BCTCx1QkFBZUEsYUFISDtBQUlaaU4sb0JBQVlDLEtBQUtDLEdBQUw7QUFKQSxPQUFkO0FBTUQ7OztrQ0FFYztBQUNiLFVBQUksS0FBS2xCLElBQUwsQ0FBVW1CLFVBQWQsRUFBMEI7QUFDeEIsYUFBS25CLElBQUwsQ0FBVW1CLFVBQVYsQ0FBcUJDLFNBQXJCLEdBQWlDLENBQWpDO0FBQ0Q7QUFDRjs7O2lDQUVhMUosSSxFQUFNO0FBQ2xCLFVBQUkySixXQUFXLEtBQUtuSixLQUFMLENBQVdvSixpQkFBWCxJQUFnQyxFQUEvQztBQUNBLFVBQUlDLGFBQWEsSUFBakI7QUFDQSxVQUFJQyxlQUFlLENBQW5CO0FBQ0FILGVBQVNySCxPQUFULENBQWlCLFVBQUN5SCxPQUFELEVBQVVDLEtBQVYsRUFBb0I7QUFDbkMsWUFBSUQsUUFBUUUsU0FBWixFQUF1QjtBQUNyQkg7QUFDRCxTQUZELE1BRU8sSUFBSUMsUUFBUUcsVUFBWixFQUF3QjtBQUM3QixjQUFJSCxRQUFRL0osSUFBUixJQUFnQitKLFFBQVEvSixJQUFSLENBQWFtSyxZQUFqQyxFQUErQztBQUM3Q0w7QUFDRDtBQUNGO0FBQ0QsWUFBSUQsZUFBZSxJQUFuQixFQUF5QjtBQUN2QixjQUFJRSxRQUFRL0osSUFBUixJQUFnQitKLFFBQVEvSixJQUFSLEtBQWlCQSxJQUFyQyxFQUEyQztBQUN6QzZKLHlCQUFhQyxZQUFiO0FBQ0Q7QUFDRjtBQUNGLE9BYkQ7QUFjQSxVQUFJRCxlQUFlLElBQW5CLEVBQXlCO0FBQ3ZCLFlBQUksS0FBS3ZCLElBQUwsQ0FBVW1CLFVBQWQsRUFBMEI7QUFDeEIsZUFBS25CLElBQUwsQ0FBVW1CLFVBQVYsQ0FBcUJDLFNBQXJCLEdBQWtDRyxhQUFhLEtBQUtySixLQUFMLENBQVd0RixTQUF6QixHQUFzQyxLQUFLc0YsS0FBTCxDQUFXdEYsU0FBbEY7QUFDRDtBQUNGO0FBQ0Y7Ozt1Q0FFbUJrUCxPLEVBQVM7QUFDM0IsVUFBSUMsU0FBUyxDQUFiO0FBQ0EsVUFBSUQsUUFBUUUsWUFBWixFQUEwQjtBQUN4QixXQUFHO0FBQ0RELG9CQUFVRCxRQUFRRyxTQUFsQjtBQUNELFNBRkQsUUFFU0gsVUFBVUEsUUFBUUUsWUFGM0IsRUFEd0IsQ0FHaUI7QUFDMUM7QUFDRCxhQUFPRCxNQUFQO0FBQ0Q7OztpQ0FFYXJLLEksRUFBTTtBQUNsQkEsV0FBS21LLFlBQUwsR0FBb0IsS0FBcEI7QUFDQXBLLFlBQU1DLElBQU4sRUFBWSxVQUFDSyxLQUFELEVBQVc7QUFDckJBLGNBQU04SixZQUFOLEdBQXFCLEtBQXJCO0FBQ0E5SixjQUFNOEksWUFBTixHQUFxQixLQUFyQjtBQUNELE9BSEQ7QUFJQSxVQUFJN00sZ0JBQWdCLEtBQUtrRSxLQUFMLENBQVdsRSxhQUEvQjtBQUNBLFVBQUlzRyxjQUFjNUMsS0FBS3FKLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBbEI7QUFDQS9NLG9CQUFjc0csV0FBZCxJQUE2QixLQUE3QjtBQUNBLFdBQUtSLFFBQUwsQ0FBYztBQUNaM0YsdUJBQWUsSUFESCxFQUNTO0FBQ3JCQyxzQkFBYyxJQUZGLEVBRVE7QUFDcEJKLHVCQUFlQSxhQUhIO0FBSVpnTixvQkFBWUMsS0FBS0MsR0FBTDtBQUpBLE9BQWQ7QUFNRDs7OytCQUVXeEosSSxFQUFNNEMsVyxFQUFhO0FBQzdCNUMsV0FBS21LLFlBQUwsR0FBb0IsSUFBcEI7QUFDQSxVQUFJbkssS0FBS3dLLE1BQVQsRUFBaUIsS0FBS0MsVUFBTCxDQUFnQnpLLEtBQUt3SyxNQUFyQixFQUZZLENBRWlCO0FBQzlDLFVBQUlsTyxnQkFBZ0IsS0FBS2tFLEtBQUwsQ0FBV2xFLGFBQS9CO0FBQ0FzRyxvQkFBYzVDLEtBQUtxSixVQUFMLENBQWdCLFVBQWhCLENBQWQ7QUFDQS9NLG9CQUFjc0csV0FBZCxJQUE2QixJQUE3QjtBQUNBLFdBQUtSLFFBQUwsQ0FBYztBQUNaM0YsdUJBQWUsSUFESCxFQUNTO0FBQ3JCQyxzQkFBYyxJQUZGLEVBRVE7QUFDcEJKLHVCQUFlQSxhQUhIO0FBSVpnTixvQkFBWUMsS0FBS0MsR0FBTDtBQUpBLE9BQWQ7QUFNRDs7O2dDQUVZa0IsRyxFQUFLO0FBQ2hCLFVBQUlBLElBQUlDLFFBQVIsRUFBa0I7QUFDaEIsYUFBS25LLEtBQUwsQ0FBV2pFLGFBQVgsQ0FBeUJtTyxJQUFJOUgsV0FBSixHQUFrQixHQUFsQixHQUF3QjhILElBQUlDLFFBQUosQ0FBYWhILElBQTlELElBQXNFLElBQXRFO0FBQ0Q7QUFDRjs7O2tDQUVjK0csRyxFQUFLO0FBQ2xCLFVBQUlBLElBQUlDLFFBQVIsRUFBa0I7QUFDaEIsYUFBS25LLEtBQUwsQ0FBV2pFLGFBQVgsQ0FBeUJtTyxJQUFJOUgsV0FBSixHQUFrQixHQUFsQixHQUF3QjhILElBQUlDLFFBQUosQ0FBYWhILElBQTlELElBQXNFLEtBQXRFO0FBQ0Q7QUFDRjs7O21DQUVlK0csRyxFQUFLO0FBQ25CLFVBQUlBLElBQUlDLFFBQVIsRUFBa0I7QUFDaEIsZUFBTyxLQUFLbkssS0FBTCxDQUFXakUsYUFBWCxDQUF5Qm1PLElBQUk5SCxXQUFKLEdBQWtCLEdBQWxCLEdBQXdCOEgsSUFBSUMsUUFBSixDQUFhaEgsSUFBOUQsQ0FBUDtBQUNEO0FBQ0Y7Ozt1Q0FFbUJpSCxJLEVBQU07QUFDeEIsYUFBTyxLQUFQLENBRHdCLENBQ1g7QUFDZDs7OzRDQUV3QjtBQUN2QixVQUFJLEtBQUtwSyxLQUFMLENBQVc3RSxlQUFYLEtBQStCLFFBQW5DLEVBQTZDO0FBQzNDLGFBQUt5RyxRQUFMLENBQWM7QUFDWjNGLHlCQUFlLElBREg7QUFFWkMsd0JBQWMsSUFGRjtBQUdaZiwyQkFBaUI7QUFITCxTQUFkO0FBS0QsT0FORCxNQU1PO0FBQ0wsYUFBS3lHLFFBQUwsQ0FBYztBQUNaM0YseUJBQWUsSUFESDtBQUVaQyx3QkFBYyxJQUZGO0FBR1pmLDJCQUFpQjtBQUhMLFNBQWQ7QUFLRDtBQUNGOzs7MkNBRXVCa1AsSyxFQUFPMUUsUyxFQUFXO0FBQ3hDLFVBQUkyRSxZQUFZLEtBQUt0SyxLQUFMLENBQVd1SyxpQkFBM0I7QUFDQSxVQUFJQyxnQkFBZ0IsS0FBS3hLLEtBQUwsQ0FBV3dLLGFBQS9CO0FBQ0EsVUFBSUMsWUFBWUosUUFBUUMsU0FBeEI7QUFDQSxVQUFJSSxhQUFhMUUsS0FBS0MsS0FBTCxDQUFXd0UsWUFBWTlFLFVBQVVnRixJQUFqQyxDQUFqQjtBQUNBLFVBQUk1UCxlQUFleVAsZ0JBQWdCRSxVQUFuQztBQUNBLFVBQUkzUCxlQUFlNEssVUFBVXVCLElBQTdCLEVBQW1Dbk0sZUFBZTRLLFVBQVV1QixJQUF6QjtBQUNuQyxVQUFJbk0sZUFBZTRLLFVBQVVzQixJQUE3QixFQUFtQ2xNLGVBQWU0SyxVQUFVc0IsSUFBekI7QUFDbkMsV0FBSzVHLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUM2RCxJQUFyQyxDQUEwQzdQLFlBQTFDO0FBQ0Q7OzttREFFK0JzUCxLLEVBQU8xRSxTLEVBQVc7QUFBQTs7QUFDaEQsVUFBSTJFLFlBQVksS0FBS3RLLEtBQUwsQ0FBVzZLLGlCQUEzQjtBQUNBLFVBQUlKLFlBQVlKLFFBQVFDLFNBQXhCO0FBQ0EsVUFBSUksYUFBYTFFLEtBQUtDLEtBQUwsQ0FBV3dFLFlBQVk5RSxVQUFVZ0YsSUFBakMsQ0FBakI7QUFDQSxVQUFJRixZQUFZLENBQVosSUFBaUIsS0FBS3pLLEtBQUwsQ0FBVy9FLFlBQVgsSUFBMkIsQ0FBaEQsRUFBbUQ7QUFDakQsWUFBSSxDQUFDLEtBQUsrRSxLQUFMLENBQVc4SyxXQUFoQixFQUE2QjtBQUMzQixjQUFJQSxjQUFjQyxZQUFZLFlBQU07QUFDbEMsZ0JBQUlDLGFBQWEsT0FBS2hMLEtBQUwsQ0FBV2hGLFFBQVgsR0FBc0IsT0FBS2dGLEtBQUwsQ0FBV2hGLFFBQWpDLEdBQTRDMkssVUFBVXNGLE9BQXZFO0FBQ0EsbUJBQUtySixRQUFMLENBQWMsRUFBQzVHLFVBQVVnUSxhQUFhLEVBQXhCLEVBQWQ7QUFDRCxXQUhpQixFQUdmLEdBSGUsQ0FBbEI7QUFJQSxlQUFLcEosUUFBTCxDQUFjLEVBQUNrSixhQUFhQSxXQUFkLEVBQWQ7QUFDRDtBQUNELGFBQUtsSixRQUFMLENBQWMsRUFBQ3NKLGNBQWMsSUFBZixFQUFkO0FBQ0E7QUFDRDtBQUNELFVBQUksS0FBS2xMLEtBQUwsQ0FBVzhLLFdBQWYsRUFBNEJLLGNBQWMsS0FBS25MLEtBQUwsQ0FBVzhLLFdBQXpCO0FBQzVCO0FBQ0EsVUFBSW5GLFVBQVVzQixJQUFWLEdBQWlCeUQsVUFBakIsSUFBK0IvRSxVQUFVbUIsTUFBekMsSUFBbUQsQ0FBQzRELFVBQUQsSUFBZS9FLFVBQVVzQixJQUFWLEdBQWlCdEIsVUFBVXVCLElBQWpHLEVBQXVHO0FBQ3JHd0QscUJBQWEsS0FBSzFLLEtBQUwsQ0FBVy9FLFlBQXhCLENBRHFHLENBQ2hFO0FBQ3JDLGVBRnFHLENBRWhFO0FBQ3RDO0FBQ0QsV0FBSzJHLFFBQUwsQ0FBYyxFQUFFM0csY0FBY3lQLFVBQWhCLEVBQTRCUSxjQUFjLEtBQTFDLEVBQWlESixhQUFhLElBQTlELEVBQWQ7QUFDRDs7OzRDQUV3Qk0sRSxFQUFJQyxFLEVBQUkxRixTLEVBQVc7QUFDMUMsVUFBSTJGLE9BQU8sSUFBWDtBQUNBLFVBQUlDLE9BQU8sSUFBWDs7QUFFQSxVQUFJLEtBQUt2TCxLQUFMLENBQVd3TCxxQkFBZixFQUFzQztBQUNwQ0YsZUFBT0YsRUFBUDtBQUNELE9BRkQsTUFFTyxJQUFJLEtBQUtwTCxLQUFMLENBQVd5TCxzQkFBZixFQUF1QztBQUM1Q0YsZUFBT0YsRUFBUDtBQUNELE9BRk0sTUFFQSxJQUFJLEtBQUtyTCxLQUFMLENBQVcwTCxxQkFBZixFQUFzQztBQUMzQyxZQUFNQyxVQUFXLEtBQUszTCxLQUFMLENBQVc0TCxjQUFYLEdBQTRCakcsVUFBVWdGLElBQXZDLEdBQStDaEYsVUFBVWtHLE9BQXpFO0FBQ0EsWUFBTUMsVUFBVyxLQUFLOUwsS0FBTCxDQUFXK0wsWUFBWCxHQUEwQnBHLFVBQVVnRixJQUFyQyxHQUE2Q2hGLFVBQVVrRyxPQUF2RTtBQUNBLFlBQU1HLFFBQVFaLEtBQUssS0FBS3BMLEtBQUwsQ0FBVzBMLHFCQUE5QjtBQUNBSixlQUFPSyxVQUFVSyxLQUFqQjtBQUNBVCxlQUFPTyxVQUFVRSxLQUFqQjtBQUNEOztBQUVELFVBQUlDLEtBQU1YLFNBQVMsSUFBVixHQUFrQnRGLEtBQUtDLEtBQUwsQ0FBWXFGLE9BQU8zRixVQUFVa0csT0FBbEIsR0FBNkJsRyxVQUFVZ0YsSUFBbEQsQ0FBbEIsR0FBNEUsS0FBSzNLLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBQXJGO0FBQ0EsVUFBSW9SLEtBQU1YLFNBQVMsSUFBVixHQUFrQnZGLEtBQUtDLEtBQUwsQ0FBWXNGLE9BQU81RixVQUFVa0csT0FBbEIsR0FBNkJsRyxVQUFVZ0YsSUFBbEQsQ0FBbEIsR0FBNEUsS0FBSzNLLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBQXJGOztBQUVBO0FBQ0EsVUFBSW1SLE1BQU10RyxVQUFVd0csSUFBcEIsRUFBMEI7QUFDeEJGLGFBQUt0RyxVQUFVd0csSUFBZjtBQUNBLFlBQUksQ0FBQyxLQUFLbk0sS0FBTCxDQUFXeUwsc0JBQVosSUFBc0MsQ0FBQyxLQUFLekwsS0FBTCxDQUFXd0wscUJBQXRELEVBQTZFO0FBQzNFVSxlQUFLLEtBQUtsTSxLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixLQUFtQyxLQUFLa0YsS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0NtUixFQUFyRSxDQUFMO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBLFVBQUlDLE1BQU12RyxVQUFVc0YsT0FBcEIsRUFBNkI7QUFDM0JnQixhQUFLLEtBQUtqTSxLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixDQUFMO0FBQ0EsWUFBSSxDQUFDLEtBQUtrRixLQUFMLENBQVd5TCxzQkFBWixJQUFzQyxDQUFDLEtBQUt6TCxLQUFMLENBQVd3TCxxQkFBdEQsRUFBNkU7QUFDM0VVLGVBQUt2RyxVQUFVc0YsT0FBZjtBQUNEO0FBQ0Y7O0FBRUQsV0FBS3JKLFFBQUwsQ0FBYyxFQUFFOUcsbUJBQW1CLENBQUNtUixFQUFELEVBQUtDLEVBQUwsQ0FBckIsRUFBZDtBQUNEOzs7NENBRXdCRSxLLEVBQU87QUFDOUIsVUFBSUMsSUFBSSxLQUFLck0sS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0NzUixLQUExQztBQUNBLFVBQUlFLElBQUksS0FBS3RNLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLElBQWtDc1IsS0FBMUM7QUFDQSxVQUFJQyxLQUFLLENBQVQsRUFBWTtBQUNWLGFBQUt6SyxRQUFMLENBQWMsRUFBRTlHLG1CQUFtQixDQUFDdVIsQ0FBRCxFQUFJQyxDQUFKLENBQXJCLEVBQWQ7QUFDRDtBQUNGOztBQUVEOzs7OzREQUN5QzNHLFMsRUFBVztBQUNsRCxVQUFJMEcsSUFBSSxLQUFLck0sS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBUjtBQUNBLFVBQUl3UixJQUFJLEtBQUt0TSxLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixDQUFSO0FBQ0EsVUFBSXlSLE9BQU9ELElBQUlELENBQWY7QUFDQSxVQUFJRyxPQUFPLEtBQUt4TSxLQUFMLENBQVdqRixZQUF0QjtBQUNBLFVBQUkwUixPQUFPRCxPQUFPRCxJQUFsQjs7QUFFQSxVQUFJRSxPQUFPOUcsVUFBVW1CLE1BQXJCLEVBQTZCO0FBQzNCMEYsZ0JBQVNDLE9BQU85RyxVQUFVbUIsTUFBMUI7QUFDQTJGLGVBQU85RyxVQUFVbUIsTUFBakI7QUFDRDs7QUFFRCxXQUFLbEYsUUFBTCxDQUFjLEVBQUU5RyxtQkFBbUIsQ0FBQzBSLElBQUQsRUFBT0MsSUFBUCxDQUFyQixFQUFkO0FBQ0Q7OzsyQ0FFdUJMLEssRUFBTztBQUM3QixVQUFJclIsZUFBZSxLQUFLaUYsS0FBTCxDQUFXakYsWUFBWCxHQUEwQnFSLEtBQTdDO0FBQ0EsVUFBSXJSLGdCQUFnQixDQUFwQixFQUF1QkEsZUFBZSxDQUFmO0FBQ3ZCLFdBQUtzRixVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDNkQsSUFBckMsQ0FBMEM3UCxZQUExQztBQUNEOzs7d0RBRW9DcUgsVyxFQUFhb0QsWSxFQUFjQyxXLEVBQWFwRCxZLEVBQWNxRCxPLEVBQVNnSCxVLEVBQVlDLFUsRUFBWXZHLEssRUFBT3dHLFEsRUFBVTtBQUMzSTtBQUNBLHdCQUFnQkMsY0FBaEIsQ0FBK0IsS0FBSzdNLEtBQUwsQ0FBVzFELGVBQTFDLEVBQTJEOEYsV0FBM0QsRUFBd0VvRCxZQUF4RSxFQUFzRkMsV0FBdEYsRUFBbUdwRCxZQUFuRyxFQUFpSHFELE9BQWpILEVBQTBIZ0gsVUFBMUgsRUFBc0lDLFVBQXRJLEVBQWtKdkcsS0FBbEosRUFBeUp3RyxRQUF6SixFQUFtSyxLQUFLdk0sVUFBTCxDQUFnQnlNLHVCQUFoQixHQUEwQ0MsR0FBMUMsQ0FBOEMsY0FBOUMsQ0FBbkssRUFBa08sS0FBSzFNLFVBQUwsQ0FBZ0J5TSx1QkFBaEIsR0FBMENDLEdBQTFDLENBQThDLFFBQTlDLENBQWxPO0FBQ0EsaURBQTRCLEtBQUsvTSxLQUFMLENBQVcxRCxlQUF2QztBQUNBLFdBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1p0Rix5QkFBaUIsS0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQTtBQUNBLFdBQUtuRSxLQUFMLENBQVdVLFNBQVgsQ0FBcUJ1TSxNQUFyQixDQUE0QixnQkFBNUIsRUFBOEMsQ0FBQyxLQUFLak4sS0FBTCxDQUFXUSxNQUFaLEVBQW9CLENBQUM2QixXQUFELENBQXBCLEVBQW1Db0QsWUFBbkMsRUFBaURDLFdBQWpELEVBQThEcEQsWUFBOUQsRUFBNEVxRCxPQUE1RSxFQUFxRmdILFVBQXJGLEVBQWlHQyxVQUFqRyxFQUE2R3ZHLEtBQTdHLEVBQW9Id0csUUFBcEgsQ0FBOUMsRUFBNkssWUFBTSxDQUFFLENBQXJMOztBQUVBLFVBQUluSCxnQkFBZ0IsS0FBaEIsSUFBeUJwRCxpQkFBaUIsU0FBOUMsRUFBeUQ7QUFDdkQsYUFBS0ksVUFBTCxDQUFnQmlDLElBQWhCO0FBQ0Q7QUFDRjs7O3NEQUVrQ3RDLFcsRUFBYW9ELFksRUFBY0MsVyxFQUFhcEQsWSxFQUFjcUQsTyxFQUFTO0FBQUE7O0FBQ2hHLHVCQUFPdUgsSUFBUCxDQUFZLEtBQUtqTixLQUFMLENBQVczRCxnQkFBdkIsRUFBeUMsVUFBQzZRLENBQUQsRUFBTztBQUM5QyxZQUFJQSxFQUFFQyxRQUFOLEVBQWdCO0FBQ2QsNEJBQWdCQyxZQUFoQixDQUE2QixPQUFLcE4sS0FBTCxDQUFXMUQsZUFBeEMsRUFBeUQ4RixXQUF6RCxFQUFzRW9ELFlBQXRFLEVBQW9GMEgsRUFBRXpILFdBQXRGLEVBQW1HeUgsRUFBRTdLLFlBQXJHLEVBQW1INkssRUFBRTFHLEVBQXJIO0FBQ0EscURBQTRCLE9BQUt4RyxLQUFMLENBQVcxRCxlQUF2QztBQUNBLGlCQUFLK0QsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsaUJBQUtwQyxRQUFMLENBQWM7QUFDWnRGLDZCQUFpQixPQUFLMEQsS0FBTCxDQUFXMUQsZUFEaEI7QUFFWkMsZ0NBQW9CLE9BQUs4RCxVQUFMLENBQWdCNkQscUJBQWhCLEVBRlI7QUFHWjlILCtCQUFtQixFQUhQO0FBSVpDLDhCQUFrQjtBQUpOLFdBQWQ7QUFNQSxpQkFBSzBELEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGNBQTVCLEVBQTRDLENBQUMsT0FBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDNkIsV0FBRCxDQUFwQixFQUFtQ29ELFlBQW5DLEVBQWlEMEgsRUFBRXpILFdBQW5ELEVBQWdFeUgsRUFBRTdLLFlBQWxFLEVBQWdGNkssRUFBRTFHLEVBQWxGLENBQTVDLEVBQW1JLFlBQU0sQ0FBRSxDQUEzSTtBQUNEO0FBQ0YsT0FiRDtBQWNEOzs7d0RBRW9DNkcsUyxFQUFXN0gsWSxFQUFjO0FBQUE7O0FBQzVELHVCQUFPeUgsSUFBUCxDQUFZSSxTQUFaLEVBQXVCLFVBQUNDLENBQUQsRUFBTztBQUM1QiwwQkFBZ0JDLGNBQWhCLENBQStCLE9BQUt2TixLQUFMLENBQVcxRCxlQUExQyxFQUEyRGdSLEVBQUVsTCxXQUE3RCxFQUEwRW9ELFlBQTFFLEVBQXdGOEgsRUFBRWpMLFlBQTFGLEVBQXdHaUwsRUFBRTlHLEVBQTFHO0FBQ0EsbURBQTRCLE9BQUt4RyxLQUFMLENBQVcxRCxlQUF2QztBQUNBLGVBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxlQUFLcEMsUUFBTCxDQUFjO0FBQ1p0RiwyQkFBaUIsT0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDhCQUFvQixPQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1pzSiwrQkFBcUIsS0FIVDtBQUlaQywrQkFBcUIsS0FKVDtBQUtaQyxrQ0FBd0I7QUFMWixTQUFkO0FBT0EsZUFBSzNOLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLE9BQUtqTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQytNLEVBQUVsTCxXQUFILENBQXBCLEVBQXFDb0QsWUFBckMsRUFBbUQ4SCxFQUFFakwsWUFBckQsRUFBbUVpTCxFQUFFOUcsRUFBckUsQ0FBOUMsRUFBd0gsWUFBTSxDQUFFLENBQWhJO0FBQ0QsT0FaRDtBQWFBLFdBQUs1RSxRQUFMLENBQWMsRUFBQ3hGLG1CQUFtQixFQUFwQixFQUFkO0FBQ0Q7OztnREFFNEJnRyxXLEVBQWFvRCxZLEVBQWNuRCxZLEVBQWNxRCxPLEVBQVNXLFMsRUFBVztBQUFBOztBQUN4Rix1QkFBTzRHLElBQVAsQ0FBWSxLQUFLak4sS0FBTCxDQUFXM0QsZ0JBQXZCLEVBQXlDLFVBQUM2USxDQUFELEVBQU87QUFDOUMsWUFBSSxDQUFDQSxFQUFFQyxRQUFQLEVBQWlCO0FBQ2YsaUJBQUtRLGtDQUFMLENBQXdDdkwsV0FBeEMsRUFBcURvRCxZQUFyRCxFQUFtRTBILEVBQUV6SCxXQUFyRSxFQUFrRnlILEVBQUU3SyxZQUFwRixFQUFrRzZLLEVBQUUxRyxFQUFwRyxFQUF3RzBHLEVBQUU5RyxLQUExRyxFQUFpSEMsU0FBakg7QUFDRCxTQUZELE1BRU87QUFDTCxpQkFBS3VILHVDQUFMLENBQTZDeEwsV0FBN0MsRUFBMERvRCxZQUExRCxFQUF3RTBILEVBQUU3SyxZQUExRSxFQUF3RjZLLEVBQUUxRyxFQUExRixFQUE4RkgsU0FBOUY7QUFDRDtBQUNGLE9BTkQ7QUFPRDs7O3VEQUVrQ2pFLFcsRUFBYW9ELFksRUFBY0MsVyxFQUFhcEQsWSxFQUFjcUQsTyxFQUFTVSxLLEVBQU9DLFMsRUFBVztBQUNsSCx3QkFBZ0J3SCxhQUFoQixDQUNFLEtBQUs3TixLQUFMLENBQVcxRCxlQURiLEVBRUU4RixXQUZGLEVBR0VvRCxZQUhGLEVBSUVDLFdBSkYsRUFLRXBELFlBTEYsRUFNRXFELE9BTkYsRUFPRVUsS0FQRixFQVFFQyxTQVJGO0FBVUEsaURBQTRCLEtBQUtyRyxLQUFMLENBQVcxRCxlQUF2QztBQUNBLFdBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1p0Rix5QkFBaUIsS0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1pzSiw2QkFBcUIsS0FIVDtBQUlaQyw2QkFBcUIsS0FKVDtBQUtaQyxnQ0FBd0IsS0FMWjtBQU1adFIsMkJBQW1CLEVBTlA7QUFPWkMsMEJBQWtCO0FBUE4sT0FBZDtBQVNBO0FBQ0EsVUFBSXlSLGVBQWUsOEJBQWV6SCxTQUFmLENBQW5CO0FBQ0EsV0FBS3RHLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGVBQTVCLEVBQTZDLENBQUMsS0FBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDNkIsV0FBRCxDQUFwQixFQUFtQ29ELFlBQW5DLEVBQWlEQyxXQUFqRCxFQUE4RHBELFlBQTlELEVBQTRFcUQsT0FBNUUsRUFBcUZVLEtBQXJGLEVBQTRGMEgsWUFBNUYsQ0FBN0MsRUFBd0osWUFBTSxDQUFFLENBQWhLO0FBQ0Q7Ozs0REFFd0MxTCxXLEVBQWFvRCxZLEVBQWNuRCxZLEVBQWNxRCxPLEVBQVNXLFMsRUFBVztBQUNwRyx3QkFBZ0IwSCxrQkFBaEIsQ0FDRSxLQUFLL04sS0FBTCxDQUFXMUQsZUFEYixFQUVFOEYsV0FGRixFQUdFb0QsWUFIRixFQUlFbkQsWUFKRixFQUtFcUQsT0FMRixFQU1FVyxTQU5GO0FBUUEsaURBQTRCLEtBQUtyRyxLQUFMLENBQVcxRCxlQUF2QztBQUNBLFdBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1p0Rix5QkFBaUIsS0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQixFQUZSO0FBR1o5SCwyQkFBbUIsRUFIUDtBQUlaQywwQkFBa0I7QUFKTixPQUFkO0FBTUE7QUFDQSxVQUFJeVIsZUFBZSw4QkFBZXpILFNBQWYsQ0FBbkI7QUFDQSxXQUFLdEcsS0FBTCxDQUFXVSxTQUFYLENBQXFCdU0sTUFBckIsQ0FBNEIsb0JBQTVCLEVBQWtELENBQUMsS0FBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDNkIsV0FBRCxDQUFwQixFQUFtQ29ELFlBQW5DLEVBQWlEbkQsWUFBakQsRUFBK0RxRCxPQUEvRCxFQUF3RW9JLFlBQXhFLENBQWxELEVBQXlJLFlBQU0sQ0FBRSxDQUFqSjtBQUNEOzs7Z0VBRTRDMUwsVyxFQUFhb0QsWSxFQUFjbkQsWSxFQUFjMkwsVSxFQUFZQyxRLEVBQVVDLFUsRUFBWUMsUSxFQUFVO0FBQ2hJLHdCQUFnQkMsc0JBQWhCLENBQXVDLEtBQUtwTyxLQUFMLENBQVcxRCxlQUFsRCxFQUFtRThGLFdBQW5FLEVBQWdGb0QsWUFBaEYsRUFBOEZuRCxZQUE5RixFQUE0RzJMLFVBQTVHLEVBQXdIQyxRQUF4SCxFQUFrSUMsVUFBbEksRUFBOElDLFFBQTlJO0FBQ0EsaURBQTRCLEtBQUtuTyxLQUFMLENBQVcxRCxlQUF2QztBQUNBLFdBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1p0Rix5QkFBaUIsS0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCdU0sTUFBckIsQ0FBNEIsd0JBQTVCLEVBQXNELENBQUMsS0FBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQixDQUFDNkIsV0FBRCxDQUFwQixFQUFtQ29ELFlBQW5DLEVBQWlEbkQsWUFBakQsRUFBK0QyTCxVQUEvRCxFQUEyRUMsUUFBM0UsRUFBcUZDLFVBQXJGLEVBQWlHQyxRQUFqRyxDQUF0RCxFQUFrSyxZQUFNLENBQUUsQ0FBMUs7QUFDRDs7O3dEQUVvQ0UsZSxFQUFpQkMsZSxFQUFpQjtBQUNyRSx3QkFBZ0JDLGNBQWhCLENBQStCLEtBQUt2TyxLQUFMLENBQVcxRCxlQUExQyxFQUEyRCtSLGVBQTNELEVBQTRFQyxlQUE1RTtBQUNBLGlEQUE0QixLQUFLdE8sS0FBTCxDQUFXMUQsZUFBdkM7QUFDQSxXQUFLK0QsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS3BDLFFBQUwsQ0FBYztBQUNadEYseUJBQWlCLEtBQUswRCxLQUFMLENBQVcxRCxlQURoQjtBQUVaQyw0QkFBb0IsS0FBSzhELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUEsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtqTixLQUFMLENBQVdRLE1BQVosRUFBb0I4TixlQUFwQixFQUFxQ0MsZUFBckMsQ0FBOUMsRUFBcUcsWUFBTSxDQUFFLENBQTdHO0FBQ0Q7Ozt3REFFb0M5SSxZLEVBQWM7QUFDakQsd0JBQWdCZ0osY0FBaEIsQ0FBK0IsS0FBS3hPLEtBQUwsQ0FBVzFELGVBQTFDLEVBQTJEa0osWUFBM0Q7QUFDQSxpREFBNEIsS0FBS3hGLEtBQUwsQ0FBVzFELGVBQXZDO0FBQ0EsV0FBSytELFVBQUwsQ0FBZ0IyRCxZQUFoQjtBQUNBLFdBQUtwQyxRQUFMLENBQWM7QUFDWnRGLHlCQUFpQixLQUFLMEQsS0FBTCxDQUFXMUQsZUFEaEI7QUFFWkMsNEJBQW9CLEtBQUs4RCxVQUFMLENBQWdCNkQscUJBQWhCO0FBRlIsT0FBZDtBQUlBO0FBQ0EsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGdCQUE1QixFQUE4QyxDQUFDLEtBQUtqTixLQUFMLENBQVdRLE1BQVosRUFBb0JpRixZQUFwQixDQUE5QyxFQUFpRixZQUFNLENBQUUsQ0FBekY7QUFDRDs7OzJEQUV1Q0EsWSxFQUFjO0FBQ3BELHdCQUFnQmlKLGlCQUFoQixDQUFrQyxLQUFLek8sS0FBTCxDQUFXMUQsZUFBN0MsRUFBOERrSixZQUE5RDtBQUNBLGlEQUE0QixLQUFLeEYsS0FBTCxDQUFXMUQsZUFBdkM7QUFDQSxXQUFLK0QsVUFBTCxDQUFnQjJELFlBQWhCO0FBQ0EsV0FBS3BDLFFBQUwsQ0FBYztBQUNadEYseUJBQWlCLEtBQUswRCxLQUFMLENBQVcxRCxlQURoQjtBQUVaQyw0QkFBb0IsS0FBSzhELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixPQUFkO0FBSUEsV0FBS25FLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLG1CQUE1QixFQUFpRCxDQUFDLEtBQUtqTixLQUFMLENBQVdRLE1BQVosRUFBb0JpRixZQUFwQixDQUFqRCxFQUFvRixZQUFNLENBQUUsQ0FBNUY7QUFDRDs7O3dEQUVvQ0EsWSxFQUFjO0FBQ2pELHdCQUFnQmtKLGNBQWhCLENBQStCLEtBQUsxTyxLQUFMLENBQVcxRCxlQUExQyxFQUEyRGtKLFlBQTNEO0FBQ0EsaURBQTRCLEtBQUt4RixLQUFMLENBQVcxRCxlQUF2QztBQUNBLFdBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxXQUFLcEMsUUFBTCxDQUFjO0FBQ1p0Rix5QkFBaUIsS0FBSzBELEtBQUwsQ0FBVzFELGVBRGhCO0FBRVpDLDRCQUFvQixLQUFLOEQsVUFBTCxDQUFnQjZELHFCQUFoQjtBQUZSLE9BQWQ7QUFJQSxXQUFLbkUsS0FBTCxDQUFXVSxTQUFYLENBQXFCdU0sTUFBckIsQ0FBNEIsZ0JBQTVCLEVBQThDLENBQUMsS0FBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQmlGLFlBQXBCLENBQTlDLEVBQWlGLFlBQU0sQ0FBRSxDQUF6RjtBQUNEOzs7OERBRTBDcEQsVyxFQUFhb0QsWSxFQUFjbkQsWSxFQUFjb0UsTSxFQUFRQyxhLEVBQWVoQixPLEVBQVNVLEssRUFBTztBQUFBOztBQUN6SDs7Ozs7Ozs7O0FBWUEsVUFBSWhLLG9CQUFvQixLQUFLNEQsS0FBTCxDQUFXNUQsaUJBQW5DO0FBQ0EsVUFBTXVKLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLFVBQU0rSSxXQUFXdkksUUFBUVYsT0FBekI7O0FBRUEsdUJBQU91SCxJQUFQLENBQVk3USxpQkFBWixFQUErQixVQUFDa1IsQ0FBRCxFQUFPO0FBQ3BDLFlBQU1zQixhQUFhQyxTQUFTdkIsRUFBRTlHLEVBQVgsSUFBaUJtSSxRQUFwQztBQUNBLFlBQUlHLGdCQUFnQixrQkFBZ0JDLG9CQUFoQixDQUNsQixPQUFLL08sS0FBTCxDQUFXMUQsZUFETyxFQUVsQmdSLEVBQUVsTCxXQUZnQixFQUdsQm9ELFlBSGtCLEVBSWxCOEgsRUFBRWpMLFlBSmdCLEVBS2xCaUwsRUFBRTdHLE1BTGdCLEVBS1I7QUFDVjZHLFVBQUU5RCxLQU5nQixFQU9sQjhELEVBQUU5RyxFQVBnQixFQVFsQm9JLFVBUmtCLEVBU2xCakosU0FUa0IsQ0FBcEI7QUFXQTtBQUNBO0FBQ0E7QUFDQXZKLDBCQUFrQmtSLEVBQUVsTCxXQUFGLEdBQWdCLEdBQWhCLEdBQXNCa0wsRUFBRWpMLFlBQXhCLEdBQXVDLEdBQXZDLEdBQTZDaUwsRUFBRTlELEtBQWpFLEVBQXdFaEQsRUFBeEUsR0FBNkVwRixPQUFPQyxJQUFQLENBQVl5TixhQUFaLEVBQTJCeEIsRUFBRTlELEtBQTdCLENBQTdFO0FBQ0EsZUFBSzVILFFBQUwsQ0FBYyxFQUFDeEYsb0NBQUQsRUFBZDs7QUFFQTtBQUNBLFlBQUlnRixPQUFPQyxJQUFQLENBQVl5TixhQUFaLEVBQTJCbFAsTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkM7QUFDekMscURBQTRCLE9BQUtJLEtBQUwsQ0FBVzFELGVBQXZDO0FBQ0EsaUJBQUsrRCxVQUFMLENBQWdCMkQsWUFBaEI7QUFDQSxpQkFBS3BDLFFBQUwsQ0FBYztBQUNadEYsNkJBQWlCLE9BQUswRCxLQUFMLENBQVcxRCxlQURoQjtBQUVaQyxnQ0FBb0IsT0FBSzhELFVBQUwsQ0FBZ0I2RCxxQkFBaEI7QUFGUixXQUFkOztBQUtBO0FBQ0E7QUFDQSxjQUFJLENBQUMsT0FBSzhLLGNBQVYsRUFBMEIsT0FBS0EsY0FBTCxHQUFzQixFQUF0QjtBQUMxQixjQUFJQyxjQUFjLENBQUM3TSxXQUFELEVBQWNvRCxZQUFkLEVBQTRCbkQsWUFBNUIsRUFBMEM2TSxJQUExQyxDQUErQyxHQUEvQyxDQUFsQjtBQUNBLGlCQUFLRixjQUFMLENBQW9CQyxXQUFwQixJQUFtQyxFQUFFN00sd0JBQUYsRUFBZW9ELDBCQUFmLEVBQTZCbkQsMEJBQTdCLEVBQTJDeU0sNEJBQTNDLEVBQTBEbkosb0JBQTFELEVBQW5DO0FBQ0EsaUJBQUs5RSwyQkFBTDtBQUNEO0FBQ0YsT0FuQ0Q7QUFvQ0Q7OztrREFFOEI7QUFDN0IsVUFBSSxDQUFDLEtBQUttTyxjQUFWLEVBQTBCLE9BQU8sS0FBTSxDQUFiO0FBQzFCLFdBQUssSUFBSUMsV0FBVCxJQUF3QixLQUFLRCxjQUE3QixFQUE2QztBQUMzQyxZQUFJLENBQUNDLFdBQUwsRUFBa0I7QUFDbEIsWUFBSSxDQUFDLEtBQUtELGNBQUwsQ0FBb0JDLFdBQXBCLENBQUwsRUFBdUM7QUFGSSxvQ0FHaUMsS0FBS0QsY0FBTCxDQUFvQkMsV0FBcEIsQ0FIakM7QUFBQSxZQUdyQzdNLFdBSHFDLHlCQUdyQ0EsV0FIcUM7QUFBQSxZQUd4Qm9ELFlBSHdCLHlCQUd4QkEsWUFId0I7QUFBQSxZQUdWbkQsWUFIVSx5QkFHVkEsWUFIVTtBQUFBLFlBR0l5TSxhQUhKLHlCQUdJQSxhQUhKO0FBQUEsWUFHbUJuSixTQUhuQix5QkFHbUJBLFNBSG5COztBQUszQzs7QUFDQSxZQUFJd0osdUJBQXVCLDhCQUFlTCxhQUFmLENBQTNCOztBQUVBLGFBQUsvTyxLQUFMLENBQVdVLFNBQVgsQ0FBcUJ1TSxNQUFyQixDQUE0QixlQUE1QixFQUE2QyxDQUFDLEtBQUtqTixLQUFMLENBQVdRLE1BQVosRUFBb0IsQ0FBQzZCLFdBQUQsQ0FBcEIsRUFBbUNvRCxZQUFuQyxFQUFpRG5ELFlBQWpELEVBQStEOE0sb0JBQS9ELEVBQXFGeEosU0FBckYsQ0FBN0MsRUFBOEksWUFBTSxDQUFFLENBQXRKO0FBQ0EsZUFBTyxLQUFLcUosY0FBTCxDQUFvQkMsV0FBcEIsQ0FBUDtBQUNEO0FBQ0Y7OztxQ0FFaUI7QUFBQTs7QUFDaEIsVUFBSSxLQUFLalAsS0FBTCxDQUFXM0UsZUFBZixFQUFnQztBQUM5QixhQUFLdUcsUUFBTCxDQUFjO0FBQ1oxRix3QkFBYyxJQURGO0FBRVpELHlCQUFlLElBRkg7QUFHWlosMkJBQWlCO0FBSEwsU0FBZCxFQUlHLFlBQU07QUFDUCxpQkFBS2dGLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUNxSSxLQUFyQztBQUNELFNBTkQ7QUFPRCxPQVJELE1BUU87QUFDTCxhQUFLeE4sUUFBTCxDQUFjO0FBQ1oxRix3QkFBYyxJQURGO0FBRVpELHlCQUFlLElBRkg7QUFHWlosMkJBQWlCO0FBSEwsU0FBZCxFQUlHLFlBQU07QUFDUCxpQkFBS2dGLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUNzSSxJQUFyQztBQUNELFNBTkQ7QUFPRDtBQUNGOzs7c0NBRWtCL1MsZSxFQUFpQkMsa0IsRUFBb0I7QUFBQTs7QUFDdEQsVUFBSUQsZUFBSixFQUFxQjtBQUNuQixZQUFJQSxnQkFBZ0JnVCxRQUFwQixFQUE4QjtBQUM1QixlQUFLQyxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCalQsZ0JBQWdCZ1QsUUFBL0MsRUFBeUQsSUFBekQsRUFBK0QsVUFBQzlQLElBQUQsRUFBVTtBQUN2RSxnQkFBSWdRLEtBQUtoUSxLQUFLcUosVUFBTCxJQUFtQnJKLEtBQUtxSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsZ0JBQUksQ0FBQzJHLEVBQUwsRUFBUyxPQUFPLEtBQU0sQ0FBYjtBQUNUaFEsaUJBQUttSixZQUFMLEdBQW9CLENBQUMsQ0FBQyxRQUFLM0ksS0FBTCxDQUFXbkUsYUFBWCxDQUF5QjJULEVBQXpCLENBQXRCO0FBQ0FoUSxpQkFBS21LLFlBQUwsR0FBb0IsQ0FBQyxDQUFDLFFBQUszSixLQUFMLENBQVdsRSxhQUFYLENBQXlCMFQsRUFBekIsQ0FBdEI7QUFDQWhRLGlCQUFLaVEsVUFBTCxHQUFrQixDQUFDLENBQUMsUUFBS3pQLEtBQUwsQ0FBV2hFLFdBQVgsQ0FBdUJ3VCxFQUF2QixDQUFwQjtBQUNELFdBTkQ7QUFPQWxULDBCQUFnQmdULFFBQWhCLENBQXlCM0YsWUFBekIsR0FBd0MsSUFBeEM7QUFDRDtBQUNELG1EQUE0QnJOLGVBQTVCO0FBQ0EsYUFBS3NGLFFBQUwsQ0FBYyxFQUFFdEYsZ0NBQUYsRUFBbUJDLHNDQUFuQixFQUFkO0FBQ0Q7QUFDRjs7OytDQUVxQztBQUFBOztBQUFBLFVBQWY2RixXQUFlLFNBQWZBLFdBQWU7O0FBQ3BDLFVBQUksS0FBS3BDLEtBQUwsQ0FBVzFELGVBQVgsSUFBOEIsS0FBSzBELEtBQUwsQ0FBVzFELGVBQVgsQ0FBMkJnVCxRQUE3RCxFQUF1RTtBQUNyRSxZQUFJSSxRQUFRLEVBQVo7QUFDQSxhQUFLSCxhQUFMLENBQW1CLEdBQW5CLEVBQXdCLENBQXhCLEVBQTJCLEVBQTNCLEVBQStCLEtBQUt2UCxLQUFMLENBQVcxRCxlQUFYLENBQTJCZ1QsUUFBMUQsRUFBb0UsSUFBcEUsRUFBMEUsVUFBQzlQLElBQUQsRUFBT3dLLE1BQVAsRUFBa0I7QUFDMUZ4SyxlQUFLd0ssTUFBTCxHQUFjQSxNQUFkO0FBQ0EsY0FBSXdGLEtBQUtoUSxLQUFLcUosVUFBTCxJQUFtQnJKLEtBQUtxSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsY0FBSTJHLE1BQU1BLE9BQU9wTixXQUFqQixFQUE4QnNOLE1BQU0xTixJQUFOLENBQVd4QyxJQUFYO0FBQy9CLFNBSkQ7QUFLQWtRLGNBQU01TixPQUFOLENBQWMsVUFBQ3RDLElBQUQsRUFBVTtBQUN0QixrQkFBS21RLFVBQUwsQ0FBZ0JuUSxJQUFoQjtBQUNBLGtCQUFLeUssVUFBTCxDQUFnQnpLLElBQWhCO0FBQ0Esa0JBQUtvUSxZQUFMLENBQWtCcFEsSUFBbEI7QUFDRCxTQUpEO0FBS0Q7QUFDRjs7O2lEQUV1QztBQUFBOztBQUFBLFVBQWY0QyxXQUFlLFNBQWZBLFdBQWU7O0FBQ3RDLFVBQUlzTixRQUFRLEtBQUtHLHNCQUFMLENBQTRCek4sV0FBNUIsQ0FBWjtBQUNBc04sWUFBTTVOLE9BQU4sQ0FBYyxVQUFDdEMsSUFBRCxFQUFVO0FBQ3RCLGdCQUFLc1EsWUFBTCxDQUFrQnRRLElBQWxCO0FBQ0EsZ0JBQUt1USxZQUFMLENBQWtCdlEsSUFBbEI7QUFDQSxnQkFBS3dRLFdBQUwsQ0FBaUJ4USxJQUFqQjtBQUNELE9BSkQ7QUFLRDs7OzJDQUV1QjRDLFcsRUFBYTtBQUNuQyxVQUFJc04sUUFBUSxFQUFaO0FBQ0EsVUFBSSxLQUFLMVAsS0FBTCxDQUFXMUQsZUFBWCxJQUE4QixLQUFLMEQsS0FBTCxDQUFXMUQsZUFBWCxDQUEyQmdULFFBQTdELEVBQXVFO0FBQ3JFLGFBQUtDLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBS3ZQLEtBQUwsQ0FBVzFELGVBQVgsQ0FBMkJnVCxRQUExRCxFQUFvRSxJQUFwRSxFQUEwRSxVQUFDOVAsSUFBRCxFQUFVO0FBQ2xGLGNBQUlnUSxLQUFLaFEsS0FBS3FKLFVBQUwsSUFBbUJySixLQUFLcUosVUFBTCxDQUFnQixVQUFoQixDQUE1QjtBQUNBLGNBQUkyRyxNQUFNQSxPQUFPcE4sV0FBakIsRUFBOEJzTixNQUFNMU4sSUFBTixDQUFXeEMsSUFBWDtBQUMvQixTQUhEO0FBSUQ7QUFDRCxhQUFPa1EsS0FBUDtBQUNEOzs7OENBRTBCdE4sVyxFQUFhb0QsWSxFQUFjRSxPLEVBQVN1SyxhLEVBQWU7QUFBQTs7QUFDNUUsVUFBSUMsaUJBQWlCLEtBQUtDLHFCQUFMLENBQTJCL04sV0FBM0IsRUFBd0MsS0FBS3BDLEtBQUwsQ0FBVzFELGVBQW5ELENBQXJCO0FBQ0EsVUFBSW1KLGNBQWN5SyxrQkFBa0JBLGVBQWV6SyxXQUFuRDtBQUNBLFVBQUksQ0FBQ0EsV0FBTCxFQUFrQjtBQUNoQixlQUFPakMsUUFBUTRNLElBQVIsQ0FBYSxlQUFlaE8sV0FBZixHQUE2QixnRkFBMUMsQ0FBUDtBQUNEOztBQUVELFVBQUlpTyxVQUFVLEtBQUtyUSxLQUFMLENBQVdvSixpQkFBWCxJQUFnQyxFQUE5QztBQUNBaUgsY0FBUXZPLE9BQVIsQ0FBZ0IsVUFBQ3lILE9BQUQsRUFBYTtBQUMzQixZQUFJQSxRQUFRRyxVQUFSLElBQXNCSCxRQUFRbkgsV0FBUixLQUF3QkEsV0FBOUMsSUFBNkQ2TixjQUFjSyxPQUFkLENBQXNCL0csUUFBUVksUUFBUixDQUFpQmhILElBQXZDLE1BQWlELENBQUMsQ0FBbkgsRUFBc0g7QUFDcEgsa0JBQUtvTixXQUFMLENBQWlCaEgsT0FBakI7QUFDRCxTQUZELE1BRU87QUFDTCxrQkFBS2lILGFBQUwsQ0FBbUJqSCxPQUFuQjtBQUNEO0FBQ0YsT0FORDs7QUFRQSxpREFBNEIsS0FBS3ZKLEtBQUwsQ0FBVzFELGVBQXZDO0FBQ0EsV0FBS3NGLFFBQUwsQ0FBYztBQUNadEYseUJBQWlCLEtBQUswRCxLQUFMLENBQVcxRCxlQURoQjtBQUVaQyw0QkFBb0IsS0FBSzhELFVBQUwsQ0FBZ0I2RCxxQkFBaEIsRUFGUjtBQUdabkksdUJBQWUsaUJBQU82TSxLQUFQLENBQWEsS0FBSzVJLEtBQUwsQ0FBV2pFLGFBQXhCLENBSEg7QUFJWitNLG9CQUFZQyxLQUFLQyxHQUFMO0FBSkEsT0FBZDtBQU1EOztBQUVEOzs7Ozs7MENBSXVCNUcsVyxFQUFhOUYsZSxFQUFpQjtBQUNuRCxVQUFJLENBQUNBLGVBQUwsRUFBc0IsT0FBTyxLQUFNLENBQWI7QUFDdEIsVUFBSSxDQUFDQSxnQkFBZ0JnVCxRQUFyQixFQUErQixPQUFPLEtBQU0sQ0FBYjtBQUMvQixVQUFJSSxjQUFKO0FBQ0EsV0FBS0gsYUFBTCxDQUFtQixHQUFuQixFQUF3QixDQUF4QixFQUEyQixFQUEzQixFQUErQmpULGdCQUFnQmdULFFBQS9DLEVBQXlELElBQXpELEVBQStELFVBQUM5UCxJQUFELEVBQVU7QUFDdkUsWUFBSWdRLEtBQUtoUSxLQUFLcUosVUFBTCxJQUFtQnJKLEtBQUtxSixVQUFMLENBQWdCLFVBQWhCLENBQTVCO0FBQ0EsWUFBSTJHLE1BQU1BLE9BQU9wTixXQUFqQixFQUE4QnNOLFFBQVFsUSxJQUFSO0FBQy9CLE9BSEQ7QUFJQSxhQUFPa1EsS0FBUDtBQUNEOzs7a0NBRWNlLE8sRUFBU2pILEssRUFBT2tILFEsRUFBVXBCLFEsRUFBVXRGLE0sRUFBUTJHLFEsRUFBVTtBQUNuRUEsZUFBU3JCLFFBQVQsRUFBbUJ0RixNQUFuQixFQUEyQnlHLE9BQTNCLEVBQW9DakgsS0FBcEMsRUFBMkNrSCxRQUEzQyxFQUFxRHBCLFNBQVM1UCxRQUE5RDtBQUNBLFVBQUk0UCxTQUFTNVAsUUFBYixFQUF1QjtBQUNyQixhQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSTJQLFNBQVM1UCxRQUFULENBQWtCRSxNQUF0QyxFQUE4Q0QsR0FBOUMsRUFBbUQ7QUFDakQsY0FBSUUsUUFBUXlQLFNBQVM1UCxRQUFULENBQWtCQyxDQUFsQixDQUFaO0FBQ0EsY0FBSSxDQUFDRSxLQUFELElBQVUsT0FBT0EsS0FBUCxLQUFpQixRQUEvQixFQUF5QztBQUN6QyxlQUFLMFAsYUFBTCxDQUFtQmtCLFVBQVUsR0FBVixHQUFnQjlRLENBQW5DLEVBQXNDQSxDQUF0QyxFQUF5QzJQLFNBQVM1UCxRQUFsRCxFQUE0REcsS0FBNUQsRUFBbUV5UCxRQUFuRSxFQUE2RXFCLFFBQTdFO0FBQ0Q7QUFDRjtBQUNGOzs7cUNBRWlCQSxRLEVBQVU7QUFDMUIsVUFBTUMsZUFBZSxFQUFyQjtBQUNBLFVBQU1qTCxZQUFZLEtBQUtDLFlBQUwsRUFBbEI7QUFDQSxVQUFNaUwsWUFBWWxMLFVBQVV1QixJQUE1QjtBQUNBLFVBQU00SixhQUFhbkwsVUFBVXNCLElBQTdCO0FBQ0EsVUFBTThKLGVBQWUsK0JBQWdCcEwsVUFBVWdGLElBQTFCLENBQXJCO0FBQ0EsVUFBSXFHLGlCQUFpQixDQUFDLENBQXRCO0FBQ0EsV0FBSyxJQUFJclIsSUFBSWtSLFNBQWIsRUFBd0JsUixJQUFJbVIsVUFBNUIsRUFBd0NuUixHQUF4QyxFQUE2QztBQUMzQ3FSO0FBQ0EsWUFBSUMsY0FBY3RSLENBQWxCO0FBQ0EsWUFBSXVSLGtCQUFrQkYsaUJBQWlCckwsVUFBVWdGLElBQWpEO0FBQ0EsWUFBSXVHLG1CQUFtQixLQUFLbFIsS0FBTCxDQUFXdkYsY0FBbEMsRUFBa0Q7QUFDaEQsY0FBSTBXLFlBQVlSLFNBQVNNLFdBQVQsRUFBc0JDLGVBQXRCLEVBQXVDdkwsVUFBVWdGLElBQWpELEVBQXVEb0csWUFBdkQsQ0FBaEI7QUFDQSxjQUFJSSxTQUFKLEVBQWU7QUFDYlAseUJBQWE1TyxJQUFiLENBQWtCbVAsU0FBbEI7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxhQUFPUCxZQUFQO0FBQ0Q7OztvQ0FFZ0JELFEsRUFBVTtBQUN6QixVQUFNQyxlQUFlLEVBQXJCO0FBQ0EsVUFBTWpMLFlBQVksS0FBS0MsWUFBTCxFQUFsQjtBQUNBLFVBQU13TCxZQUFZLHFDQUFzQnpMLFVBQVVnRixJQUFoQyxDQUFsQjtBQUNBLFVBQU1rRyxZQUFZbEwsVUFBVXVCLElBQTVCO0FBQ0EsVUFBTW1LLFNBQVMxTCxVQUFVdUIsSUFBVixHQUFpQnZCLFVBQVVHLElBQTFDO0FBQ0EsVUFBTXdMLFVBQVUzTCxVQUFVc0IsSUFBVixHQUFpQnRCLFVBQVVHLElBQTNDO0FBQ0EsVUFBTXlMLFVBQVVELFVBQVVELE1BQTFCO0FBQ0EsVUFBTUcsY0FBYyx1QkFBUUgsTUFBUixFQUFnQkQsU0FBaEIsQ0FBcEI7QUFDQSxVQUFJSyxjQUFjRCxXQUFsQjtBQUNBLFVBQU1FLFlBQVksRUFBbEI7QUFDQSxhQUFPRCxlQUFlSCxPQUF0QixFQUErQjtBQUM3Qkksa0JBQVUxUCxJQUFWLENBQWV5UCxXQUFmO0FBQ0FBLHVCQUFlTCxTQUFmO0FBQ0Q7QUFDRCxXQUFLLElBQUl6UixJQUFJLENBQWIsRUFBZ0JBLElBQUkrUixVQUFVOVIsTUFBOUIsRUFBc0NELEdBQXRDLEVBQTJDO0FBQ3pDLFlBQUlnUyxXQUFXRCxVQUFVL1IsQ0FBVixDQUFmO0FBQ0EsWUFBSWtHLGVBQWUseUNBQTBCOEwsUUFBMUIsRUFBb0NoTSxVQUFVRyxJQUE5QyxDQUFuQjtBQUNBLFlBQUk4TCxjQUFjNUwsS0FBSzZMLEtBQUwsQ0FBV2hNLGVBQWVGLFVBQVVHLElBQXpCLEdBQWdDNkwsUUFBM0MsQ0FBbEI7QUFDQTtBQUNBLFlBQUksQ0FBQ0MsV0FBTCxFQUFrQjtBQUNoQixjQUFJRSxjQUFjak0sZUFBZWdMLFNBQWpDO0FBQ0EsY0FBSWtCLFdBQVdELGNBQWNuTSxVQUFVZ0YsSUFBdkM7QUFDQSxjQUFJd0csWUFBWVIsU0FBU2dCLFFBQVQsRUFBbUJJLFFBQW5CLEVBQTZCUixPQUE3QixDQUFoQjtBQUNBLGNBQUlKLFNBQUosRUFBZVAsYUFBYTVPLElBQWIsQ0FBa0JtUCxTQUFsQjtBQUNoQjtBQUNGO0FBQ0QsYUFBT1AsWUFBUDtBQUNEOztBQUVEOzs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7bUNBbUJnQjtBQUNkLFVBQU1qTCxZQUFZLEVBQWxCO0FBQ0FBLGdCQUFVcU0sR0FBVixHQUFnQixLQUFLaFMsS0FBTCxDQUFXOUUsZUFBM0IsQ0FGYyxDQUU2QjtBQUMzQ3lLLGdCQUFVRyxJQUFWLEdBQWlCLE9BQU9ILFVBQVVxTSxHQUFsQyxDQUhjLENBR3dCO0FBQ3RDck0sZ0JBQVVzTSxLQUFWLEdBQWtCLDRCQUFhLEtBQUtqUyxLQUFMLENBQVcxRCxlQUF4QixFQUF5QyxLQUFLMEQsS0FBTCxDQUFXNUUsbUJBQXBELENBQWxCO0FBQ0F1SyxnQkFBVXVNLElBQVYsR0FBaUIseUNBQTBCdk0sVUFBVXNNLEtBQXBDLEVBQTJDdE0sVUFBVUcsSUFBckQsQ0FBakIsQ0FMYyxDQUs4RDtBQUM1RUgsZ0JBQVV3RyxJQUFWLEdBQWlCLENBQWpCLENBTmMsQ0FNSztBQUNuQnhHLGdCQUFVdUIsSUFBVixHQUFrQixLQUFLbEgsS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsSUFBa0M2SyxVQUFVd0csSUFBN0MsR0FBcUR4RyxVQUFVd0csSUFBL0QsR0FBc0UsS0FBS25NLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBQXZGLENBUGMsQ0FPeUc7QUFDdkg2SyxnQkFBVW1CLE1BQVYsR0FBb0JuQixVQUFVdU0sSUFBVixHQUFpQixFQUFsQixHQUF3QixFQUF4QixHQUE2QnZNLFVBQVV1TSxJQUExRCxDQVJjLENBUWlEO0FBQy9Edk0sZ0JBQVVzRixPQUFWLEdBQW9CLEtBQUtqTCxLQUFMLENBQVdoRixRQUFYLEdBQXNCLEtBQUtnRixLQUFMLENBQVdoRixRQUFqQyxHQUE0QzJLLFVBQVVtQixNQUFWLEdBQW1CLElBQW5GLENBVGMsQ0FTMkU7QUFDekZuQixnQkFBVXNCLElBQVYsR0FBa0IsS0FBS2pILEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLElBQWtDNkssVUFBVXNGLE9BQTdDLEdBQXdEdEYsVUFBVXNGLE9BQWxFLEdBQTRFLEtBQUtqTCxLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixDQUE3RixDQVZjLENBVStHO0FBQzdINkssZ0JBQVV3TSxJQUFWLEdBQWlCbk0sS0FBS29NLEdBQUwsQ0FBU3pNLFVBQVVzQixJQUFWLEdBQWlCdEIsVUFBVXVCLElBQXBDLENBQWpCLENBWGMsQ0FXNkM7QUFDM0R2QixnQkFBVWdGLElBQVYsR0FBaUIzRSxLQUFLNkwsS0FBTCxDQUFXLEtBQUs3UixLQUFMLENBQVd2RixjQUFYLEdBQTRCa0wsVUFBVXdNLElBQWpELENBQWpCLENBWmMsQ0FZMEQ7QUFDeEUsVUFBSXhNLFVBQVVnRixJQUFWLEdBQWlCLENBQXJCLEVBQXdCaEYsVUFBVTBNLE9BQVYsR0FBb0IsQ0FBcEI7QUFDeEIsVUFBSTFNLFVBQVVnRixJQUFWLEdBQWlCLEtBQUszSyxLQUFMLENBQVd2RixjQUFoQyxFQUFnRGtMLFVBQVVnRixJQUFWLEdBQWlCLEtBQUszSyxLQUFMLENBQVd2RixjQUE1QjtBQUNoRGtMLGdCQUFVMk0sR0FBVixHQUFnQnRNLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVZ0YsSUFBdEMsQ0FBaEI7QUFDQWhGLGdCQUFVNE0sR0FBVixHQUFnQnZNLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVZ0YsSUFBdEMsQ0FBaEI7QUFDQWhGLGdCQUFVNk0sTUFBVixHQUFtQjdNLFVBQVVzRixPQUFWLEdBQW9CdEYsVUFBVWdGLElBQWpELENBakJjLENBaUJ3QztBQUN0RGhGLGdCQUFVOE0sR0FBVixHQUFnQnpNLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVRyxJQUF0QyxDQUFoQixDQWxCYyxDQWtCOEM7QUFDNURILGdCQUFVK00sR0FBVixHQUFnQjFNLEtBQUtDLEtBQUwsQ0FBV04sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVRyxJQUF0QyxDQUFoQixDQW5CYyxDQW1COEM7QUFDNURILGdCQUFVZ04sR0FBVixHQUFnQixLQUFLM1MsS0FBTCxDQUFXeEYsZUFBWCxHQUE2QixLQUFLd0YsS0FBTCxDQUFXdkYsY0FBeEQsQ0FwQmMsQ0FvQnlEO0FBQ3ZFa0wsZ0JBQVVrRyxPQUFWLEdBQW9CbEcsVUFBVTZNLE1BQVYsR0FBbUI3TSxVQUFVZ04sR0FBakQsQ0FyQmMsQ0FxQnVDO0FBQ3JEaE4sZ0JBQVVpTixHQUFWLEdBQWlCak4sVUFBVXVCLElBQVYsR0FBaUJ2QixVQUFVZ0YsSUFBNUIsR0FBb0NoRixVQUFVa0csT0FBOUQsQ0F0QmMsQ0FzQndEO0FBQ3RFbEcsZ0JBQVVrTixHQUFWLEdBQWlCbE4sVUFBVXNCLElBQVYsR0FBaUJ0QixVQUFVZ0YsSUFBNUIsR0FBb0NoRixVQUFVa0csT0FBOUQsQ0F2QmMsQ0F1QndEO0FBQ3RFLGFBQU9sRyxTQUFQO0FBQ0Q7O0FBRUQ7Ozs7bUNBQ2dCO0FBQ2QsVUFBSSxLQUFLM0YsS0FBTCxDQUFXMUQsZUFBWCxJQUE4QixLQUFLMEQsS0FBTCxDQUFXMUQsZUFBWCxDQUEyQmdULFFBQXpELElBQXFFLEtBQUt0UCxLQUFMLENBQVcxRCxlQUFYLENBQTJCZ1QsUUFBM0IsQ0FBb0M1UCxRQUE3RyxFQUF1SDtBQUNySCxZQUFJb1QsY0FBYyxLQUFLQyxtQkFBTCxDQUF5QixFQUF6QixFQUE2QixLQUFLL1MsS0FBTCxDQUFXMUQsZUFBWCxDQUEyQmdULFFBQTNCLENBQW9DNVAsUUFBakUsQ0FBbEI7QUFDQSxZQUFJc1QsV0FBVyxxQkFBTUYsV0FBTixDQUFmO0FBQ0EsZUFBT0UsUUFBUDtBQUNELE9BSkQsTUFJTztBQUNMLGVBQU8sRUFBUDtBQUNEO0FBQ0Y7Ozt3Q0FFb0JDLEssRUFBT3ZULFEsRUFBVTtBQUFBOztBQUNwQyxhQUFPO0FBQ0x1VCxvQkFESztBQUVMQyxlQUFPeFQsU0FBU3lULE1BQVQsQ0FBZ0IsVUFBQ3RULEtBQUQ7QUFBQSxpQkFBVyxPQUFPQSxLQUFQLEtBQWlCLFFBQTVCO0FBQUEsU0FBaEIsRUFBc0R1VCxHQUF0RCxDQUEwRCxVQUFDdlQsS0FBRCxFQUFXO0FBQzFFLGlCQUFPLFFBQUtrVCxtQkFBTCxDQUF5QixFQUF6QixFQUE2QmxULE1BQU1ILFFBQW5DLENBQVA7QUFDRCxTQUZNO0FBRkYsT0FBUDtBQU1EOzs7MkNBRXVCO0FBQUE7O0FBQ3RCO0FBQ0EsVUFBSTJULGVBQWUsS0FBS0MsWUFBTCxHQUFvQkMsS0FBcEIsQ0FBMEIsSUFBMUIsQ0FBbkI7QUFDQSxVQUFJQyxnQkFBZ0IsRUFBcEI7QUFDQSxVQUFJQyx5QkFBeUIsRUFBN0I7QUFDQSxVQUFJQyxvQkFBb0IsQ0FBeEI7O0FBRUEsVUFBSSxDQUFDLEtBQUsxVCxLQUFMLENBQVcxRCxlQUFaLElBQStCLENBQUMsS0FBSzBELEtBQUwsQ0FBVzFELGVBQVgsQ0FBMkJnVCxRQUEvRCxFQUF5RSxPQUFPa0UsYUFBUDs7QUFFekUsV0FBS2pFLGFBQUwsQ0FBbUIsR0FBbkIsRUFBd0IsQ0FBeEIsRUFBMkIsRUFBM0IsRUFBK0IsS0FBS3ZQLEtBQUwsQ0FBVzFELGVBQVgsQ0FBMkJnVCxRQUExRCxFQUFvRSxJQUFwRSxFQUEwRSxVQUFDOVAsSUFBRCxFQUFPd0ssTUFBUCxFQUFleUcsT0FBZixFQUF3QmpILEtBQXhCLEVBQStCa0gsUUFBL0IsRUFBNEM7QUFDcEg7QUFDQSxZQUFJaUQsY0FBZSxRQUFPblUsS0FBS2lHLFdBQVosTUFBNEIsUUFBL0M7QUFDQSxZQUFJQSxjQUFja08sY0FBY25VLEtBQUtxSixVQUFMLENBQWdCK0ssTUFBOUIsR0FBdUNwVSxLQUFLaUcsV0FBOUQ7O0FBRUEsWUFBSSxDQUFDdUUsTUFBRCxJQUFZQSxPQUFPTCxZQUFQLEtBQXdCL0ssaUJBQWlCNkcsV0FBakIsS0FBaUNrTyxXQUF6RCxDQUFoQixFQUF3RjtBQUFFO0FBQ3hGLGNBQU1FLGNBQWNSLGFBQWFLLGlCQUFiLENBQXBCLENBRHNGLENBQ2xDO0FBQ3BELGNBQU1JLGFBQWEsRUFBRXRVLFVBQUYsRUFBUXdLLGNBQVIsRUFBZ0J5RyxnQkFBaEIsRUFBeUJqSCxZQUF6QixFQUFnQ2tILGtCQUFoQyxFQUEwQ21ELHdCQUExQyxFQUF1REUsY0FBYyxFQUFyRSxFQUF5RXRLLFdBQVcsSUFBcEYsRUFBMEZySCxhQUFhNUMsS0FBS3FKLFVBQUwsQ0FBZ0IsVUFBaEIsQ0FBdkcsRUFBbkI7QUFDQTJLLHdCQUFjeFIsSUFBZCxDQUFtQjhSLFVBQW5COztBQUVBLGNBQUksQ0FBQ0wsdUJBQXVCaE8sV0FBdkIsQ0FBTCxFQUEwQztBQUN4Q2dPLG1DQUF1QmhPLFdBQXZCLElBQXNDa08sY0FBY0ssNEJBQTRCeFUsSUFBNUIsQ0FBZCxHQUFrRHlVLHNCQUFzQnhPLFdBQXRCLEVBQW1DZ0wsT0FBbkMsQ0FBeEY7QUFDRDs7QUFFRCxjQUFNck8sY0FBYzVDLEtBQUtxSixVQUFMLENBQWdCLFVBQWhCLENBQXBCO0FBQ0EsY0FBTXFMLHVCQUF1QixFQUE3Qjs7QUFFQSxlQUFLLElBQUl2VSxJQUFJLENBQWIsRUFBZ0JBLElBQUk4VCx1QkFBdUJoTyxXQUF2QixFQUFvQzdGLE1BQXhELEVBQWdFRCxHQUFoRSxFQUFxRTtBQUNuRSxnQkFBSXdVLDBCQUEwQlYsdUJBQXVCaE8sV0FBdkIsRUFBb0M5RixDQUFwQyxDQUE5Qjs7QUFFQSxnQkFBSXlVLG9CQUFKOztBQUVFO0FBQ0YsZ0JBQUlELHdCQUF3QkUsT0FBNUIsRUFBcUM7QUFDbkMsa0JBQUlDLGdCQUFnQkgsd0JBQXdCRSxPQUF4QixDQUFnQ0UsTUFBcEQ7QUFDQSxrQkFBSUMsYUFBZ0JwUyxXQUFoQixTQUErQmtTLGFBQW5DO0FBQ0Esa0JBQUlHLG1CQUFtQixLQUF2Qjs7QUFFRTtBQUNGLGtCQUFJLFFBQUt6VSxLQUFMLENBQVc3RCx3QkFBWCxDQUFvQ3FZLFVBQXBDLENBQUosRUFBcUQ7QUFDbkQsb0JBQUksQ0FBQ04scUJBQXFCSSxhQUFyQixDQUFMLEVBQTBDO0FBQ3hDRyxxQ0FBbUIsSUFBbkI7QUFDQVAsdUNBQXFCSSxhQUFyQixJQUFzQyxJQUF0QztBQUNEO0FBQ0RGLDhCQUFjLEVBQUU1VSxVQUFGLEVBQVF3SyxjQUFSLEVBQWdCeUcsZ0JBQWhCLEVBQXlCakgsWUFBekIsRUFBZ0NrSCxrQkFBaEMsRUFBMEM0RCw0QkFBMUMsRUFBeURFLHNCQUF6RCxFQUFxRUUsaUJBQWlCLElBQXRGLEVBQTRGRCxrQ0FBNUYsRUFBOEd0SyxVQUFVZ0ssdUJBQXhILEVBQWlKekssWUFBWSxJQUE3SixFQUFtS3RILHdCQUFuSyxFQUFkO0FBQ0QsZUFORCxNQU1PO0FBQ0g7QUFDRixvQkFBSXVTLGFBQWEsQ0FBQ1IsdUJBQUQsQ0FBakI7QUFDRTtBQUNGLG9CQUFJN0csSUFBSTNOLENBQVIsQ0FKSyxDQUlLO0FBQ1YscUJBQUssSUFBSWlWLElBQUksQ0FBYixFQUFnQkEsSUFBSSxDQUFwQixFQUF1QkEsR0FBdkIsRUFBNEI7QUFDMUIsc0JBQUlDLFlBQVlELElBQUl0SCxDQUFwQjtBQUNBLHNCQUFJd0gsaUJBQWlCckIsdUJBQXVCaE8sV0FBdkIsRUFBb0NvUCxTQUFwQyxDQUFyQjtBQUNFO0FBQ0Ysc0JBQUlDLGtCQUFrQkEsZUFBZVQsT0FBakMsSUFBNENTLGVBQWVULE9BQWYsQ0FBdUJFLE1BQXZCLEtBQWtDRCxhQUFsRixFQUFpRztBQUMvRkssK0JBQVczUyxJQUFYLENBQWdCOFMsY0FBaEI7QUFDRTtBQUNGblYseUJBQUssQ0FBTDtBQUNEO0FBQ0Y7QUFDRHlVLDhCQUFjLEVBQUU1VSxVQUFGLEVBQVF3SyxjQUFSLEVBQWdCeUcsZ0JBQWhCLEVBQXlCakgsWUFBekIsRUFBZ0NrSCxrQkFBaEMsRUFBMEM0RCw0QkFBMUMsRUFBeURFLHNCQUF6RCxFQUFxRUgsU0FBU00sVUFBOUUsRUFBMEZJLGFBQWFaLHdCQUF3QkUsT0FBeEIsQ0FBZ0NsUixJQUF2SSxFQUE2STZSLFdBQVcsSUFBeEosRUFBOEo1Uyx3QkFBOUosRUFBZDtBQUNEO0FBQ0YsYUE3QkQsTUE2Qk87QUFDTGdTLDRCQUFjLEVBQUU1VSxVQUFGLEVBQVF3SyxjQUFSLEVBQWdCeUcsZ0JBQWhCLEVBQXlCakgsWUFBekIsRUFBZ0NrSCxrQkFBaEMsRUFBMEN2RyxVQUFVZ0ssdUJBQXBELEVBQTZFekssWUFBWSxJQUF6RixFQUErRnRILHdCQUEvRixFQUFkO0FBQ0Q7O0FBRUQwUix1QkFBV0MsWUFBWCxDQUF3Qi9SLElBQXhCLENBQTZCb1MsV0FBN0I7O0FBRUU7QUFDQTtBQUNGLGdCQUFJNVUsS0FBS21LLFlBQVQsRUFBdUI7QUFDckI2Siw0QkFBY3hSLElBQWQsQ0FBbUJvUyxXQUFuQjtBQUNEO0FBQ0Y7QUFDRjtBQUNEVjtBQUNELE9BbEVEOztBQW9FQUYsb0JBQWMxUixPQUFkLENBQXNCLFVBQUNzSSxJQUFELEVBQU9aLEtBQVAsRUFBY3lMLEtBQWQsRUFBd0I7QUFDNUM3SyxhQUFLOEssTUFBTCxHQUFjMUwsS0FBZDtBQUNBWSxhQUFLK0ssTUFBTCxHQUFjRixLQUFkO0FBQ0QsT0FIRDs7QUFLQXpCLHNCQUFnQkEsY0FBY0wsTUFBZCxDQUFxQixpQkFBK0I7QUFBQSxZQUE1QjNULElBQTRCLFNBQTVCQSxJQUE0QjtBQUFBLFlBQXRCd0ssTUFBc0IsU0FBdEJBLE1BQXNCO0FBQUEsWUFBZHlHLE9BQWMsU0FBZEEsT0FBYzs7QUFDaEU7QUFDRixZQUFJQSxRQUFROEMsS0FBUixDQUFjLEdBQWQsRUFBbUIzVCxNQUFuQixHQUE0QixDQUFoQyxFQUFtQyxPQUFPLEtBQVA7QUFDbkMsZUFBTyxDQUFDb0ssTUFBRCxJQUFXQSxPQUFPTCxZQUF6QjtBQUNELE9BSmUsQ0FBaEI7O0FBTUEsYUFBTzZKLGFBQVA7QUFDRDs7O3VEQUVtQzdOLFMsRUFBV3ZELFcsRUFBYXFELFcsRUFBYXBELFksRUFBYy9GLGUsRUFBaUJxVSxRLEVBQVU7QUFDaEgsVUFBSXlFLGlCQUFpQixFQUFyQjs7QUFFQSxVQUFJQyxhQUFhLDJCQUFpQkMsYUFBakIsQ0FBK0JsVCxXQUEvQixFQUE0QyxLQUFLcEMsS0FBTCxDQUFXNUUsbUJBQXZELEVBQTRFaUgsWUFBNUUsRUFBMEYvRixlQUExRixDQUFqQjtBQUNBLFVBQUksQ0FBQytZLFVBQUwsRUFBaUIsT0FBT0QsY0FBUDs7QUFFakIsVUFBSUcsZ0JBQWdCblUsT0FBT0MsSUFBUCxDQUFZZ1UsVUFBWixFQUF3QmpDLEdBQXhCLENBQTRCLFVBQUNvQyxXQUFEO0FBQUEsZUFBaUIzRyxTQUFTMkcsV0FBVCxFQUFzQixFQUF0QixDQUFqQjtBQUFBLE9BQTVCLEVBQXdFQyxJQUF4RSxDQUE2RSxVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxlQUFVRCxJQUFJQyxDQUFkO0FBQUEsT0FBN0UsQ0FBcEI7QUFDQSxVQUFJSixjQUFjM1YsTUFBZCxHQUF1QixDQUEzQixFQUE4QixPQUFPd1YsY0FBUDs7QUFFOUIsV0FBSyxJQUFJelYsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNFYsY0FBYzNWLE1BQWxDLEVBQTBDRCxHQUExQyxFQUErQztBQUM3QyxZQUFJaVcsU0FBU0wsY0FBYzVWLENBQWQsQ0FBYjtBQUNBLFlBQUlrVyxNQUFNRCxNQUFOLENBQUosRUFBbUI7QUFDbkIsWUFBSUUsU0FBU1AsY0FBYzVWLElBQUksQ0FBbEIsQ0FBYjtBQUNBLFlBQUlvVyxTQUFTUixjQUFjNVYsSUFBSSxDQUFsQixDQUFiOztBQUVBLFlBQUlpVyxTQUFTalEsVUFBVStNLEdBQXZCLEVBQTRCLFNBTmlCLENBTVI7QUFDckMsWUFBSWtELFNBQVNqUSxVQUFVOE0sR0FBbkIsSUFBMEJzRCxXQUFXQyxTQUFyQyxJQUFrREQsU0FBU3BRLFVBQVU4TSxHQUF6RSxFQUE4RSxTQVBqQyxDQU8wQzs7QUFFdkYsWUFBSXdELGFBQUo7QUFDQSxZQUFJQyxhQUFKO0FBQ0EsWUFBSXhSLGFBQUo7O0FBRUEsWUFBSW9SLFdBQVdFLFNBQVgsSUFBd0IsQ0FBQ0gsTUFBTUMsTUFBTixDQUE3QixFQUE0QztBQUMxQ0csaUJBQU87QUFDTHpQLGdCQUFJc1AsTUFEQztBQUVMM1Msa0JBQU1kLFlBRkQ7QUFHTG1ILG1CQUFPN0osSUFBSSxDQUhOO0FBSUx3VyxtQkFBTyx5Q0FBMEJMLE1BQTFCLEVBQWtDblEsVUFBVUcsSUFBNUMsQ0FKRjtBQUtMc1EsbUJBQU9mLFdBQVdTLE1BQVgsRUFBbUJNLEtBTHJCO0FBTUxDLG1CQUFPaEIsV0FBV1MsTUFBWCxFQUFtQk87QUFOckIsV0FBUDtBQVFEOztBQUVESCxlQUFPO0FBQ0wxUCxjQUFJb1AsTUFEQztBQUVMelMsZ0JBQU1kLFlBRkQ7QUFHTG1ILGlCQUFPN0osQ0FIRjtBQUlMd1csaUJBQU8seUNBQTBCUCxNQUExQixFQUFrQ2pRLFVBQVVHLElBQTVDLENBSkY7QUFLTHNRLGlCQUFPZixXQUFXTyxNQUFYLEVBQW1CUSxLQUxyQjtBQU1MQyxpQkFBT2hCLFdBQVdPLE1BQVgsRUFBbUJTO0FBTnJCLFNBQVA7O0FBU0EsWUFBSU4sV0FBV0MsU0FBWCxJQUF3QixDQUFDSCxNQUFNRSxNQUFOLENBQTdCLEVBQTRDO0FBQzFDclIsaUJBQU87QUFDTDhCLGdCQUFJdVAsTUFEQztBQUVMNVMsa0JBQU1kLFlBRkQ7QUFHTG1ILG1CQUFPN0osSUFBSSxDQUhOO0FBSUx3VyxtQkFBTyx5Q0FBMEJKLE1BQTFCLEVBQWtDcFEsVUFBVUcsSUFBNUMsQ0FKRjtBQUtMc1EsbUJBQU9mLFdBQVdVLE1BQVgsRUFBbUJLLEtBTHJCO0FBTUxDLG1CQUFPaEIsV0FBV1UsTUFBWCxFQUFtQk07QUFOckIsV0FBUDtBQVFEOztBQUVELFlBQUlDLGVBQWUsQ0FBQ0osS0FBS0MsS0FBTCxHQUFheFEsVUFBVXVCLElBQXhCLElBQWdDdkIsVUFBVWdGLElBQTdEO0FBQ0EsWUFBSTRMLHNCQUFKO0FBQ0EsWUFBSTdSLElBQUosRUFBVTZSLGdCQUFnQixDQUFDN1IsS0FBS3lSLEtBQUwsR0FBYXhRLFVBQVV1QixJQUF4QixJQUFnQ3ZCLFVBQVVnRixJQUExRDs7QUFFVixZQUFJNkwsZ0JBQWdCN0YsU0FBU3NGLElBQVQsRUFBZUMsSUFBZixFQUFxQnhSLElBQXJCLEVBQTJCNFIsWUFBM0IsRUFBeUNDLGFBQXpDLEVBQXdENVcsQ0FBeEQsQ0FBcEI7QUFDQSxZQUFJNlcsYUFBSixFQUFtQnBCLGVBQWVwVCxJQUFmLENBQW9Cd1UsYUFBcEI7QUFDcEI7O0FBRUQsYUFBT3BCLGNBQVA7QUFDRDs7O3dEQUVvQ3pQLFMsRUFBV3ZELFcsRUFBYXFELFcsRUFBYXNPLFksRUFBY3pYLGUsRUFBaUJxVSxRLEVBQVU7QUFBQTs7QUFDakgsVUFBSXlFLGlCQUFpQixFQUFyQjs7QUFFQXJCLG1CQUFhalMsT0FBYixDQUFxQixVQUFDc1MsV0FBRCxFQUFpQjtBQUNwQyxZQUFJQSxZQUFZWSxTQUFoQixFQUEyQjtBQUN6Qlosc0JBQVlDLE9BQVosQ0FBb0J2UyxPQUFwQixDQUE0QixVQUFDMlUsa0JBQUQsRUFBd0I7QUFDbEQsZ0JBQUlwVSxlQUFlb1UsbUJBQW1CdFQsSUFBdEM7QUFDQSxnQkFBSXVULGtCQUFrQixRQUFLQyxrQ0FBTCxDQUF3Q2hSLFNBQXhDLEVBQW1EdkQsV0FBbkQsRUFBZ0VxRCxXQUFoRSxFQUE2RXBELFlBQTdFLEVBQTJGL0YsZUFBM0YsRUFBNEdxVSxRQUE1RyxDQUF0QjtBQUNBLGdCQUFJK0YsZUFBSixFQUFxQjtBQUNuQnRCLCtCQUFpQkEsZUFBZXdCLE1BQWYsQ0FBc0JGLGVBQXRCLENBQWpCO0FBQ0Q7QUFDRixXQU5EO0FBT0QsU0FSRCxNQVFPO0FBQ0wsY0FBSXJVLGVBQWUrUixZQUFZakssUUFBWixDQUFxQmhILElBQXhDO0FBQ0EsY0FBSXVULGtCQUFrQixRQUFLQyxrQ0FBTCxDQUF3Q2hSLFNBQXhDLEVBQW1EdkQsV0FBbkQsRUFBZ0VxRCxXQUFoRSxFQUE2RXBELFlBQTdFLEVBQTJGL0YsZUFBM0YsRUFBNEdxVSxRQUE1RyxDQUF0QjtBQUNBLGNBQUkrRixlQUFKLEVBQXFCO0FBQ25CdEIsNkJBQWlCQSxlQUFld0IsTUFBZixDQUFzQkYsZUFBdEIsQ0FBakI7QUFDRDtBQUNGO0FBQ0YsT0FoQkQ7O0FBa0JBLGFBQU90QixjQUFQO0FBQ0Q7OzsyQ0FFdUI7QUFDdEIsV0FBS3hULFFBQUwsQ0FBYyxFQUFFaEcsc0JBQXNCLEtBQXhCLEVBQWQ7QUFDRDs7QUFFRDs7OztBQUlBOzs7O3FEQUVrQztBQUFBOztBQUNoQyxhQUNFO0FBQUE7QUFBQTtBQUNFLGlCQUFPO0FBQ0xpYixzQkFBVSxVQURMO0FBRUxwUCxpQkFBSztBQUZBLFdBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0U7QUFDRSxnQ0FBc0IsS0FBS3FQLG9CQUFMLENBQTBCL1YsSUFBMUIsQ0FBK0IsSUFBL0IsQ0FEeEI7QUFFRSxzQ0FBNEIsS0FBS2hCLEtBQUwsQ0FBV1MsVUFBWCxDQUFzQjJDLElBRnBEO0FBR0UseUJBQWUvQixPQUFPQyxJQUFQLENBQWEsS0FBS3JCLEtBQUwsQ0FBVzFELGVBQVosR0FBK0IsS0FBSzBELEtBQUwsQ0FBVzFELGVBQVgsQ0FBMkJ5YSxTQUExRCxHQUFzRSxFQUFsRixDQUhqQjtBQUlFLGdDQUFzQixLQUFLL1csS0FBTCxDQUFXNUUsbUJBSm5DO0FBS0Usd0JBQWMsS0FBSzRFLEtBQUwsQ0FBV2pGLFlBTDNCO0FBTUUscUJBQVcsS0FBS2lGLEtBQUwsQ0FBVzNFLGVBTnhCO0FBT0UseUJBQWUsS0FBSzJFLEtBQUwsQ0FBVzFFLG1CQVA1QjtBQVFFLHFCQUFXLEtBQUtzSyxZQUFMLEdBQW9Ca0IsTUFSakM7QUFTRSw4QkFBb0IsNEJBQUN1SCxlQUFELEVBQWtCQyxlQUFsQixFQUFzQztBQUN4RCxvQkFBSzBJLG1DQUFMLENBQXlDM0ksZUFBekMsRUFBMERDLGVBQTFEO0FBQ0QsV0FYSDtBQVlFLDBCQUFnQix3QkFBQzlJLFlBQUQsRUFBa0I7QUFDaEMsb0JBQUt5UixtQ0FBTCxDQUF5Q3pSLFlBQXpDO0FBQ0QsV0FkSDtBQWVFLDZCQUFtQiwyQkFBQ0EsWUFBRCxFQUFrQjtBQUNuQyxvQkFBSzBSLHNDQUFMLENBQTRDMVIsWUFBNUM7QUFDRCxXQWpCSDtBQWtCRSwwQkFBZ0Isd0JBQUNBLFlBQUQsRUFBa0I7QUFDaEMsb0JBQUsyUixtQ0FBTCxDQUF5QzNSLFlBQXpDO0FBQ0QsV0FwQkg7QUFxQkUsMEJBQWdCLHdCQUFDcEssbUJBQUQsRUFBeUI7QUFDdkM7QUFDQSxvQkFBS2lGLFVBQUwsQ0FBZ0IrVyxlQUFoQixDQUFnQ2hjLG1CQUFoQyxFQUFxRCxFQUFFK0ksTUFBTSxVQUFSLEVBQXJELEVBQTJFLFlBQU0sQ0FBRSxDQUFuRjtBQUNBLG9CQUFLcEUsS0FBTCxDQUFXVSxTQUFYLENBQXFCdU0sTUFBckIsQ0FBNEIsaUJBQTVCLEVBQStDLENBQUMsUUFBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQm5GLG1CQUFwQixDQUEvQyxFQUF5RixZQUFNLENBQUUsQ0FBakc7QUFDQSxvQkFBS3dHLFFBQUwsQ0FBYyxFQUFFeEcsd0NBQUYsRUFBZDtBQUNELFdBMUJIO0FBMkJFLDRCQUFrQiw0QkFBTTtBQUN0QjtBQUNBO0FBQ0E7QUFDQSxnQkFBSXVLLFlBQVksUUFBS0MsWUFBTCxFQUFoQjtBQUNBLG9CQUFLdkYsVUFBTCxDQUFnQjBHLGtCQUFoQixHQUFxQ0MsWUFBckMsQ0FBa0RyQixVQUFVd0csSUFBNUQ7QUFDQSxvQkFBS3ZLLFFBQUwsQ0FBYyxFQUFFdkcsaUJBQWlCLEtBQW5CLEVBQTBCTixjQUFjNEssVUFBVXdHLElBQWxELEVBQWQ7QUFDRCxXQWxDSDtBQW1DRSwrQkFBcUIsK0JBQU07QUFDekIsZ0JBQUl4RyxZQUFZLFFBQUtDLFlBQUwsRUFBaEI7QUFDQSxvQkFBS2hFLFFBQUwsQ0FBYyxFQUFFdkcsaUJBQWlCLEtBQW5CLEVBQTBCTixjQUFjNEssVUFBVW1CLE1BQWxELEVBQWQ7QUFDQSxvQkFBS3pHLFVBQUwsQ0FBZ0IwRyxrQkFBaEIsR0FBcUNDLFlBQXJDLENBQWtEckIsVUFBVW1CLE1BQTVEO0FBQ0QsV0F2Q0g7QUF3Q0UsNkJBQW1CLDZCQUFNO0FBQ3ZCLG9CQUFLb0IsY0FBTDtBQUNELFdBMUNIO0FBMkNFLCtCQUFxQiw2QkFBQ21QLFVBQUQsRUFBZ0I7QUFDbkMsZ0JBQUkvYixzQkFBc0JnYyxPQUFPRCxXQUFXeFMsTUFBWCxDQUFrQnVSLEtBQWxCLElBQTJCLENBQWxDLENBQTFCO0FBQ0Esb0JBQUt4VSxRQUFMLENBQWMsRUFBRXRHLHdDQUFGLEVBQWQ7QUFDRCxXQTlDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFMRixPQURGO0FBdUREOzs7MkNBRXVCaWMsUyxFQUFXO0FBQ2pDLFVBQU01UixZQUFZLEtBQUtDLFlBQUwsRUFBbEI7QUFDQSxhQUFPLDBDQUEyQjJSLFVBQVUvWCxJQUFyQyxFQUEyQ21HLFNBQTNDLEVBQXNELEtBQUszRixLQUFMLENBQVcxRCxlQUFqRSxFQUFrRixLQUFLMEQsS0FBTCxDQUFXekQsa0JBQTdGLEVBQWlILEtBQUs4RCxVQUF0SCxFQUFrSSxLQUFLbVgsc0JBQUwsQ0FBNEI3UixTQUE1QixDQUFsSSxFQUEwSyxLQUFLM0YsS0FBTCxDQUFXNUUsbUJBQXJMLEVBQTBNbWMsVUFBVXBOLFFBQXBOLENBQVA7QUFDRDs7OzJDQUV1QnhFLFMsRUFBVztBQUNqQyxhQUFPSyxLQUFLQyxLQUFMLENBQVcsS0FBS2pHLEtBQUwsQ0FBV2pGLFlBQVgsR0FBMEI0SyxVQUFVRyxJQUEvQyxDQUFQO0FBQ0Q7Ozs0REFFd0NzRSxJLEVBQU07QUFBQTs7QUFDN0MsVUFBSWhJLGNBQWNnSSxLQUFLNUssSUFBTCxDQUFVcUosVUFBVixDQUFxQixVQUFyQixDQUFsQjtBQUNBLFVBQUlwRCxjQUFlLFFBQU8yRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QyRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBbEY7QUFDQSxVQUFJRSxZQUFZLEtBQUtDLFlBQUwsRUFBaEI7O0FBRUE7QUFDQTtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssV0FBVSx3QkFBZixFQUF3QyxPQUFPLEVBQUVpUixVQUFVLFVBQVosRUFBd0JuUCxNQUFNLEtBQUsxSCxLQUFMLENBQVd4RixlQUFYLEdBQTZCLENBQTNELEVBQThEaWQsUUFBUSxFQUF0RSxFQUEwRUMsT0FBTyxNQUFqRixFQUF5RkMsVUFBVSxRQUFuRyxFQUEvQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRyxhQUFLQyxtQ0FBTCxDQUF5Q2pTLFNBQXpDLEVBQW9EdkQsV0FBcEQsRUFBaUVxRCxXQUFqRSxFQUE4RTJFLEtBQUsySixZQUFuRixFQUFpRyxLQUFLL1QsS0FBTCxDQUFXMUQsZUFBNUcsRUFBNkgsVUFBQzJaLElBQUQsRUFBT0MsSUFBUCxFQUFheFIsSUFBYixFQUFtQjRSLFlBQW5CLEVBQWlDQyxhQUFqQyxFQUFnRC9NLEtBQWhELEVBQTBEO0FBQ3RMLGNBQUlxTyxnQkFBZ0IsRUFBcEI7O0FBRUEsY0FBSTNCLEtBQUtHLEtBQVQsRUFBZ0I7QUFDZHdCLDBCQUFjN1YsSUFBZCxDQUFtQixRQUFLOFYsb0JBQUwsQ0FBMEJuUyxTQUExQixFQUFxQ3ZELFdBQXJDLEVBQWtEcUQsV0FBbEQsRUFBK0R5USxLQUFLL1MsSUFBcEUsRUFBMEUsUUFBS25ELEtBQUwsQ0FBVzFELGVBQXJGLEVBQXNHMlosSUFBdEcsRUFBNEdDLElBQTVHLEVBQWtIeFIsSUFBbEgsRUFBd0g0UixZQUF4SCxFQUFzSUMsYUFBdEksRUFBcUosQ0FBckosRUFBd0osRUFBRXdCLFdBQVcsSUFBYixFQUFtQkMsa0JBQWtCLElBQXJDLEVBQXhKLENBQW5CO0FBQ0QsV0FGRCxNQUVPO0FBQ0wsZ0JBQUl0VCxJQUFKLEVBQVU7QUFDUm1ULDRCQUFjN1YsSUFBZCxDQUFtQixRQUFLaVcsa0JBQUwsQ0FBd0J0UyxTQUF4QixFQUFtQ3ZELFdBQW5DLEVBQWdEcUQsV0FBaEQsRUFBNkR5USxLQUFLL1MsSUFBbEUsRUFBd0UsUUFBS25ELEtBQUwsQ0FBVzFELGVBQW5GLEVBQW9HMlosSUFBcEcsRUFBMEdDLElBQTFHLEVBQWdIeFIsSUFBaEgsRUFBc0g0UixZQUF0SCxFQUFvSUMsYUFBcEksRUFBbUosQ0FBbkosRUFBc0osRUFBRXdCLFdBQVcsSUFBYixFQUFtQkMsa0JBQWtCLElBQXJDLEVBQXRKLENBQW5CO0FBQ0Q7QUFDRCxnQkFBSSxDQUFDL0IsSUFBRCxJQUFTLENBQUNBLEtBQUtJLEtBQW5CLEVBQTBCO0FBQ3hCd0IsNEJBQWM3VixJQUFkLENBQW1CLFFBQUtrVyxrQkFBTCxDQUF3QnZTLFNBQXhCLEVBQW1DdkQsV0FBbkMsRUFBZ0RxRCxXQUFoRCxFQUE2RHlRLEtBQUsvUyxJQUFsRSxFQUF3RSxRQUFLbkQsS0FBTCxDQUFXMUQsZUFBbkYsRUFBb0cyWixJQUFwRyxFQUEwR0MsSUFBMUcsRUFBZ0h4UixJQUFoSCxFQUFzSDRSLFlBQXRILEVBQW9JQyxhQUFwSSxFQUFtSixDQUFuSixFQUFzSixFQUFFd0IsV0FBVyxJQUFiLEVBQW1CQyxrQkFBa0IsSUFBckMsRUFBdEosQ0FBbkI7QUFDRDtBQUNGOztBQUVELGlCQUFPSCxhQUFQO0FBQ0QsU0FmQTtBQURILE9BREY7QUFvQkQ7OzttREFFK0JsUyxTLEVBQVd2RCxXLEVBQWFxRCxXLEVBQWFwRCxZLEVBQWMvRixlLEVBQWlCMlosSSxFQUFNQyxJLEVBQU14UixJLEVBQU00UixZLEVBQWM5TSxLLEVBQU8vQyxNLEVBQVEwUixPLEVBQVM7QUFBQTs7QUFDMUosYUFDRTtBQUFBO0FBQ0U7O0FBc0lBO0FBdklGO0FBQUEsVUFFRSxLQUFROVYsWUFBUixTQUF3Qm1ILEtBRjFCO0FBR0UsZ0JBQUssR0FIUDtBQUlFLG1CQUFTLGlCQUFDNE8sU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLG9CQUFLQyxxQkFBTCxDQUEyQixFQUFFbFcsd0JBQUYsRUFBZUMsMEJBQWYsRUFBM0I7QUFDQSxvQkFBS1QsUUFBTCxDQUFjO0FBQ1ozRiw2QkFBZSxJQURIO0FBRVpDLDRCQUFjLElBRkY7QUFHWnNSLG1DQUFxQjZLLFNBQVNFLENBSGxCO0FBSVo5SyxtQ0FBcUJ5SSxLQUFLMVA7QUFKZCxhQUFkO0FBTUQsV0FaSDtBQWFFLGtCQUFRLGdCQUFDNFIsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CLG9CQUFLRyx1QkFBTCxDQUE2QixFQUFFcFcsd0JBQUYsRUFBZUMsMEJBQWYsRUFBN0I7QUFDQSxvQkFBS1QsUUFBTCxDQUFjLEVBQUU0TCxxQkFBcUIsS0FBdkIsRUFBOEJDLHFCQUFxQixLQUFuRCxFQUFkO0FBQ0QsV0FoQkg7QUFpQkUsa0JBQVEsaUJBQU8zTSxRQUFQLENBQWdCLFVBQUNzWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0MsZ0JBQUksQ0FBQyxRQUFLclksS0FBTCxDQUFXME4sc0JBQWhCLEVBQXdDO0FBQ3RDLGtCQUFJK0ssV0FBV0osU0FBU0ssS0FBVCxHQUFpQixRQUFLMVksS0FBTCxDQUFXd04sbUJBQTNDO0FBQ0Esa0JBQUltTCxXQUFZRixXQUFXOVMsVUFBVWdGLElBQXRCLEdBQThCaEYsVUFBVUcsSUFBdkQ7QUFDQSxrQkFBSThTLFNBQVM1UyxLQUFLQyxLQUFMLENBQVcsUUFBS2pHLEtBQUwsQ0FBV3lOLG1CQUFYLEdBQWlDa0wsUUFBNUMsQ0FBYjtBQUNBLHNCQUFLaFMseUNBQUwsQ0FBK0N2RSxXQUEvQyxFQUE0RCxRQUFLcEMsS0FBTCxDQUFXNUUsbUJBQXZFLEVBQTRGaUgsWUFBNUYsRUFBMEdvRSxNQUExRyxFQUFrSHlQLEtBQUsxTSxLQUF2SCxFQUE4SDBNLEtBQUsxUCxFQUFuSSxFQUF1SW9TLE1BQXZJO0FBQ0Q7QUFDRixXQVBPLEVBT0x0WixhQVBLLENBakJWO0FBeUJFLHVCQUFhLHFCQUFDdVosQ0FBRCxFQUFPO0FBQ2xCQSxjQUFFQyxlQUFGO0FBQ0EsZ0JBQUkxYyxvQkFBb0IsUUFBSzRELEtBQUwsQ0FBVzVELGlCQUFuQztBQUNBLGdCQUFJQyxtQkFBbUIsUUFBSzJELEtBQUwsQ0FBVzNELGdCQUFsQztBQUNBLGdCQUFJLENBQUN3YyxFQUFFRSxRQUFQLEVBQWlCO0FBQ2YzYyxrQ0FBb0IsRUFBcEI7QUFDQUMsaUNBQW1CLEVBQW5CO0FBQ0Q7O0FBRURELDhCQUFrQmdHLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUM2VCxLQUFLMU0sS0FBaEUsSUFBeUU7QUFDdkVnRyxrQkFBSXBOLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUM2VCxLQUFLMU0sS0FEcUI7QUFFdkVBLHFCQUFPME0sS0FBSzFNLEtBRjJEO0FBR3ZFaEQsa0JBQUkwUCxLQUFLMVAsRUFIOEQ7QUFJdkVDLDRCQUp1RTtBQUt2RXJFLHNDQUx1RTtBQU12RUM7QUFOdUUsYUFBekU7QUFRQSxvQkFBS1QsUUFBTCxDQUFjLEVBQUV4RixvQ0FBRixFQUFxQkMsa0NBQXJCLEVBQWQ7QUFDRCxXQTNDSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUE0Q0U7QUFDRSx5QkFBZSx1QkFBQzJjLFlBQUQsRUFBa0I7QUFDL0JBLHlCQUFhRixlQUFiO0FBQ0EsZ0JBQUlHLGVBQWVELGFBQWFuUixXQUFiLENBQXlCcVIsT0FBNUM7QUFDQSxnQkFBSUMsZUFBZUYsZUFBZTNDLFlBQWYsR0FBOEJ0USxLQUFLQyxLQUFMLENBQVdOLFVBQVUyTSxHQUFWLEdBQWdCM00sVUFBVWdGLElBQXJDLENBQWpEO0FBQ0EsZ0JBQUl5TyxZQUFZbEQsS0FBSzFQLEVBQXJCO0FBQ0EsZ0JBQUk2UyxlQUFlbkQsS0FBS0MsS0FBeEI7QUFDQSxvQkFBS2pXLE9BQUwsQ0FBYW9aLElBQWIsQ0FBa0I7QUFDaEJsVSxvQkFBTSxVQURVO0FBRWhCTyxrQ0FGZ0I7QUFHaEI0VCxxQkFBT1AsYUFBYW5SLFdBSEo7QUFJaEJ6RixzQ0FKZ0I7QUFLaEJvRCw0QkFBYyxRQUFLeEYsS0FBTCxDQUFXNUUsbUJBTFQ7QUFNaEJpSCx3Q0FOZ0I7QUFPaEJxRSw2QkFBZXdQLEtBQUsxTSxLQVBKO0FBUWhCOUQsdUJBQVN3USxLQUFLMVAsRUFSRTtBQVNoQmdULDBCQUFZdEQsS0FBS0MsS0FURDtBQVVoQi9QLHFCQUFPLElBVlM7QUFXaEJxVCx3QkFBVSxJQVhNO0FBWWhCcEQscUJBQU8sSUFaUztBQWFoQjRDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQjNUO0FBakJnQixhQUFsQjtBQW1CRCxXQTFCSDtBQTJCRSxpQkFBTztBQUNMaVUscUJBQVMsY0FESjtBQUVMN0Msc0JBQVUsVUFGTDtBQUdMcFAsaUJBQUssQ0FIQTtBQUlMQyxrQkFBTTRPLFlBSkQ7QUFLTG9CLG1CQUFPLEVBTEY7QUFNTEQsb0JBQVEsRUFOSDtBQU9Ma0Msb0JBQVEsSUFQSDtBQVFMQyxvQkFBUTtBQVJILFdBM0JUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTVDRixPQURGO0FBb0ZEOzs7dUNBRW1CalUsUyxFQUFXdkQsVyxFQUFhcUQsVyxFQUFhcEQsWSxFQUFjL0YsZSxFQUFpQjJaLEksRUFBTUMsSSxFQUFNeFIsSSxFQUFNNFIsWSxFQUFjQyxhLEVBQWUvTSxLLEVBQU8yTyxPLEVBQVM7QUFDckosVUFBSTBCLFdBQVcsS0FBZjtBQUNBLFVBQUksS0FBSzdaLEtBQUwsQ0FBVzVELGlCQUFYLENBQTZCZ0csY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5QzZULEtBQUsxTSxLQUEzRSxLQUFxRndNLFNBQXpGLEVBQW9HNkQsV0FBVyxJQUFYOztBQUVwRyxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQVF4WCxZQUFSLFNBQXdCbUgsS0FBeEIsU0FBaUMwTSxLQUFLMVAsRUFEeEM7QUFFRSxpQkFBTztBQUNMcVEsc0JBQVUsVUFETDtBQUVMblAsa0JBQU00TyxZQUZEO0FBR0xvQixtQkFBTyxDQUhGO0FBSUxELG9CQUFRLEVBSkg7QUFLTGhRLGlCQUFLLENBQUMsQ0FMRDtBQU1McVMsdUJBQVcsWUFOTjtBQU9MQyx3QkFBWSxzQkFQUDtBQVFMSixvQkFBUTtBQVJILFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUU7QUFBQTtBQUFBO0FBQ0UsdUJBQVUsa0JBRFo7QUFFRSxtQkFBTztBQUNMOUMsd0JBQVUsVUFETDtBQUVMcFAsbUJBQUssQ0FGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUxrUyxzQkFBU3pCLFFBQVFKLFNBQVQsR0FBc0IsU0FBdEIsR0FBa0M7QUFKckMsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRSxpRUFBYSxPQUFRSSxRQUFRSCxnQkFBVCxHQUNoQix5QkFBUWdDLElBRFEsR0FFZjdCLFFBQVE4QixpQkFBVCxHQUNJLHlCQUFRQyxTQURaLEdBRUtMLFFBQUQsR0FDRSx5QkFBUU0sYUFEVixHQUVFLHlCQUFRQyxJQU5sQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFSRjtBQVpGLE9BREY7QUFnQ0Q7Ozt5Q0FFcUJ6VSxTLEVBQVd2RCxXLEVBQWFxRCxXLEVBQWFwRCxZLEVBQWMvRixlLEVBQWlCMlosSSxFQUFNQyxJLEVBQU14UixJLEVBQU00UixZLEVBQWNDLGEsRUFBZS9NLEssRUFBTzJPLE8sRUFBUztBQUFBOztBQUN2SixVQUFNa0MsWUFBZWpZLFdBQWYsU0FBOEJDLFlBQTlCLFNBQThDbUgsS0FBOUMsU0FBdUQwTSxLQUFLMVAsRUFBbEU7QUFDQSxVQUFNNlAsUUFBUUgsS0FBS0csS0FBTCxDQUFXaUUsTUFBWCxDQUFrQixDQUFsQixFQUFxQkMsV0FBckIsS0FBcUNyRSxLQUFLRyxLQUFMLENBQVdtRSxLQUFYLENBQWlCLENBQWpCLENBQW5EO0FBQ0EsVUFBTUMsaUJBQWlCcEUsTUFBTXFFLFFBQU4sQ0FBZSxNQUFmLEtBQTBCckUsTUFBTXFFLFFBQU4sQ0FBZSxRQUFmLENBQTFCLElBQXNEckUsTUFBTXFFLFFBQU4sQ0FBZSxTQUFmLENBQTdFO0FBQ0EsVUFBTUMsV0FBV25lLFVBQVU2WixRQUFRLEtBQWxCLENBQWpCO0FBQ0EsVUFBSXVFLHNCQUFzQixLQUExQjtBQUNBLFVBQUlDLHVCQUF1QixLQUEzQjtBQUNBLFVBQUksS0FBSzdhLEtBQUwsQ0FBVzVELGlCQUFYLENBQTZCZ0csY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxHQUF5QzZULEtBQUsxTSxLQUEzRSxLQUFxRndNLFNBQXpGLEVBQW9HNEUsc0JBQXNCLElBQXRCO0FBQ3BHLFVBQUksS0FBSzVhLEtBQUwsQ0FBVzVELGlCQUFYLENBQTZCZ0csY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxJQUEwQzZULEtBQUsxTSxLQUFMLEdBQWEsQ0FBdkQsQ0FBN0IsS0FBMkZ3TSxTQUEvRixFQUEwRzZFLHVCQUF1QixJQUF2Qjs7QUFFMUcsYUFDRTtBQUFBO0FBQUEsVUFFRSxLQUFReFksWUFBUixTQUF3Qm1ILEtBRjFCO0FBR0UsZ0JBQUssR0FIUDtBQUlFLG1CQUFTLGlCQUFDNE8sU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQ2hDLGdCQUFJRixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QixvQkFBS08scUJBQUwsQ0FBMkIsRUFBRWxXLHdCQUFGLEVBQWVDLDBCQUFmLEVBQTNCO0FBQ0Esb0JBQUtULFFBQUwsQ0FBYztBQUNaM0YsNkJBQWUsSUFESDtBQUVaQyw0QkFBYyxJQUZGO0FBR1pzUixtQ0FBcUI2SyxTQUFTRSxDQUhsQjtBQUlaOUssbUNBQXFCeUksS0FBSzFQLEVBSmQ7QUFLWmtILHNDQUF3QjtBQUxaLGFBQWQ7QUFPRCxXQWRIO0FBZUUsa0JBQVEsZ0JBQUMwSyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0Isb0JBQUtHLHVCQUFMLENBQTZCLEVBQUVwVyx3QkFBRixFQUFlQywwQkFBZixFQUE3QjtBQUNBLG9CQUFLVCxRQUFMLENBQWMsRUFBRTRMLHFCQUFxQixLQUF2QixFQUE4QkMscUJBQXFCLEtBQW5ELEVBQTBEQyx3QkFBd0IsS0FBbEYsRUFBZDtBQUNELFdBbEJIO0FBbUJFLGtCQUFRLGlCQUFPNU0sUUFBUCxDQUFnQixVQUFDc1gsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9DLGdCQUFJSSxXQUFXSixTQUFTSyxLQUFULEdBQWlCLFFBQUsxWSxLQUFMLENBQVd3TixtQkFBM0M7QUFDQSxnQkFBSW1MLFdBQVlGLFdBQVc5UyxVQUFVZ0YsSUFBdEIsR0FBOEJoRixVQUFVRyxJQUF2RDtBQUNBLGdCQUFJOFMsU0FBUzVTLEtBQUtDLEtBQUwsQ0FBVyxRQUFLakcsS0FBTCxDQUFXeU4sbUJBQVgsR0FBaUNrTCxRQUE1QyxDQUFiO0FBQ0Esb0JBQUtoUyx5Q0FBTCxDQUErQ3ZFLFdBQS9DLEVBQTRELFFBQUtwQyxLQUFMLENBQVc1RSxtQkFBdkUsRUFBNEZpSCxZQUE1RixFQUEwRyxNQUExRyxFQUFrSDZULEtBQUsxTSxLQUF2SCxFQUE4SDBNLEtBQUsxUCxFQUFuSSxFQUF1SW9TLE1BQXZJO0FBQ0QsV0FMTyxFQUtMdFosYUFMSyxDQW5CVjtBQXlCRSx1QkFBYSxxQkFBQ3VaLENBQUQsRUFBTztBQUNsQkEsY0FBRUMsZUFBRjtBQUNBLGdCQUFJMWMsb0JBQW9CLFFBQUs0RCxLQUFMLENBQVc1RCxpQkFBbkM7QUFDQSxnQkFBSUMsbUJBQW1CLFFBQUsyRCxLQUFMLENBQVczRCxnQkFBbEM7QUFDQSxnQkFBSSxDQUFDd2MsRUFBRUUsUUFBUCxFQUFpQjtBQUNmM2Msa0NBQW9CLEVBQXBCO0FBQ0FDLGlDQUFtQixFQUFuQjtBQUNEO0FBQ0RELDhCQUFrQmdHLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUM2VCxLQUFLMU0sS0FBaEUsSUFBeUU7QUFDdkVnRyxrQkFBSXBOLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUM2VCxLQUFLMU0sS0FEcUI7QUFFdkVwSCxzQ0FGdUU7QUFHdkVDLHdDQUh1RTtBQUl2RW1ILHFCQUFPME0sS0FBSzFNLEtBSjJEO0FBS3ZFaEQsa0JBQUkwUCxLQUFLMVAsRUFMOEQ7QUFNdkVDLHNCQUFRO0FBTitELGFBQXpFO0FBUUFySyw4QkFBa0JnRyxjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLElBQTBDNlQsS0FBSzFNLEtBQUwsR0FBYSxDQUF2RCxDQUFsQixJQUErRTtBQUM3RWdHLGtCQUFJcE4sY0FBYyxHQUFkLEdBQW9CQyxZQUFwQixHQUFtQyxHQUFuQyxJQUEwQzZULEtBQUsxTSxLQUFMLEdBQWEsQ0FBdkQsQ0FEeUU7QUFFN0VwSCxzQ0FGNkU7QUFHN0VDLHdDQUg2RTtBQUk3RW9ELHNDQUo2RTtBQUs3RStELHFCQUFPOUUsS0FBSzhFLEtBTGlFO0FBTTdFaEQsa0JBQUk5QixLQUFLOEIsRUFOb0U7QUFPN0VDLHNCQUFRO0FBUHFFLGFBQS9FO0FBU0FwSyw2QkFBaUIrRixjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLEdBQXlDNlQsS0FBSzFNLEtBQS9ELElBQXdFO0FBQ3RFZ0csa0JBQUlwTixjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLEdBQXlDNlQsS0FBSzFNLEtBRG9CO0FBRXRFcEgsc0NBRnNFO0FBR3RFQyx3Q0FIc0U7QUFJdEVtRSxrQkFBSTBQLEtBQUsxUCxFQUo2RDtBQUt0RTJHLHdCQUFVO0FBTDRELGFBQXhFO0FBT0Esb0JBQUt2TCxRQUFMLENBQWMsRUFBRXhGLG9DQUFGLEVBQXFCQyxrQ0FBckIsRUFBZDtBQUNELFdBMURIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTJERTtBQUFBO0FBQUE7QUFDRSx1QkFBVSxnQkFEWjtBQUVFLGlCQUFLZ2UsU0FGUDtBQUdFLGlCQUFLLGFBQUNTLFVBQUQsRUFBZ0I7QUFDbkIsc0JBQUtULFNBQUwsSUFBa0JTLFVBQWxCO0FBQ0QsYUFMSDtBQU1FLDJCQUFlLHVCQUFDOUIsWUFBRCxFQUFrQjtBQUMvQixrQkFBSWIsUUFBUUosU0FBWixFQUF1QixPQUFPLEtBQVA7QUFDdkJpQiwyQkFBYUYsZUFBYjtBQUNBLGtCQUFJRyxlQUFlRCxhQUFhblIsV0FBYixDQUF5QnFSLE9BQTVDO0FBQ0Esa0JBQUlDLGVBQWVGLGVBQWUzQyxZQUFmLEdBQThCdFEsS0FBS0MsS0FBTCxDQUFXTixVQUFVMk0sR0FBVixHQUFnQjNNLFVBQVVnRixJQUFyQyxDQUFqRDtBQUNBLGtCQUFJME8sZUFBZXJULEtBQUtDLEtBQUwsQ0FBV2tULGVBQWV4VCxVQUFVZ0YsSUFBcEMsQ0FBbkI7QUFDQSxrQkFBSXlPLFlBQVlwVCxLQUFLQyxLQUFMLENBQVlrVCxlQUFleFQsVUFBVWdGLElBQTFCLEdBQWtDaEYsVUFBVUcsSUFBdkQsQ0FBaEI7QUFDQSxzQkFBSzVGLE9BQUwsQ0FBYW9aLElBQWIsQ0FBa0I7QUFDaEJsVSxzQkFBTSxxQkFEVTtBQUVoQk8sb0NBRmdCO0FBR2hCNFQsdUJBQU9QLGFBQWFuUixXQUhKO0FBSWhCekYsd0NBSmdCO0FBS2hCb0QsOEJBQWMsUUFBS3hGLEtBQUwsQ0FBVzVFLG1CQUxUO0FBTWhCaUgsMENBTmdCO0FBT2hCbVgsNEJBQVl0RCxLQUFLQyxLQVBEO0FBUWhCelAsK0JBQWV3UCxLQUFLMU0sS0FSSjtBQVNoQjlELHlCQUFTd1EsS0FBSzFQLEVBVEU7QUFVaEI2UCx1QkFBT0gsS0FBS0csS0FWSTtBQVdoQm9ELDBCQUFVL1UsS0FBS3lSLEtBWEM7QUFZaEIvUCx1QkFBTzFCLEtBQUs4QixFQVpJO0FBYWhCeVMsMENBYmdCO0FBY2hCRSwwQ0FkZ0I7QUFlaEJFLDBDQWZnQjtBQWdCaEJELG9DQWhCZ0I7QUFpQmhCM1Q7QUFqQmdCLGVBQWxCO0FBbUJELGFBaENIO0FBaUNFLDBCQUFjLHNCQUFDc1YsVUFBRCxFQUFnQjtBQUM1QixrQkFBSSxRQUFLVixTQUFMLENBQUosRUFBcUIsUUFBS0EsU0FBTCxFQUFnQlcsS0FBaEIsQ0FBc0JDLEtBQXRCLEdBQThCLHlCQUFRQyxJQUF0QztBQUN0QixhQW5DSDtBQW9DRSwwQkFBYyxzQkFBQ0gsVUFBRCxFQUFnQjtBQUM1QixrQkFBSSxRQUFLVixTQUFMLENBQUosRUFBcUIsUUFBS0EsU0FBTCxFQUFnQlcsS0FBaEIsQ0FBc0JDLEtBQXRCLEdBQThCLGFBQTlCO0FBQ3RCLGFBdENIO0FBdUNFLG1CQUFPO0FBQ0xwRSx3QkFBVSxVQURMO0FBRUxuUCxvQkFBTTRPLGVBQWUsQ0FGaEI7QUFHTG9CLHFCQUFPbkIsZ0JBQWdCRCxZQUhsQjtBQUlMN08sbUJBQUssQ0FKQTtBQUtMZ1Esc0JBQVEsRUFMSDtBQU1MMEQsZ0NBQWtCLE1BTmI7QUFPTHZCLHNCQUFTekIsUUFBUUosU0FBVCxHQUNKLFNBREksR0FFSjtBQVRDLGFBdkNUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWtER0ksa0JBQVFKLFNBQVIsSUFDQztBQUNFLHVCQUFVLHlCQURaO0FBRUUsbUJBQU87QUFDTGxCLHdCQUFVLFVBREw7QUFFTGEscUJBQU8sTUFGRjtBQUdMRCxzQkFBUSxNQUhIO0FBSUxoUSxtQkFBSyxDQUpBO0FBS0wyVCw0QkFBYyxDQUxUO0FBTUx6QixzQkFBUSxDQU5IO0FBT0xqUyxvQkFBTSxDQVBEO0FBUUwyVCwrQkFBa0JsRCxRQUFRSixTQUFULEdBQ2IseUJBQVFtRCxJQURLLEdBRWIscUJBQU0seUJBQVFJLFFBQWQsRUFBd0JDLElBQXhCLENBQTZCLElBQTdCO0FBVkMsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQW5ESjtBQW1FRTtBQUNFLHVCQUFVLE1BRFo7QUFFRSxtQkFBTztBQUNMMUUsd0JBQVUsVUFETDtBQUVMOEMsc0JBQVEsSUFGSDtBQUdMakMscUJBQU8sTUFIRjtBQUlMRCxzQkFBUSxNQUpIO0FBS0xoUSxtQkFBSyxDQUxBO0FBTUwyVCw0QkFBYyxDQU5UO0FBT0wxVCxvQkFBTSxDQVBEO0FBUUwyVCwrQkFBa0JsRCxRQUFRSixTQUFULEdBQ2RJLFFBQVFILGdCQUFULEdBQ0UscUJBQU0seUJBQVFzRCxRQUFkLEVBQXdCQyxJQUF4QixDQUE2QixJQUE3QixDQURGLEdBRUUscUJBQU0seUJBQVFELFFBQWQsRUFBd0JDLElBQXhCLENBQTZCLEtBQTdCLENBSGEsR0FJZixxQkFBTSx5QkFBUUQsUUFBZCxFQUF3QkMsSUFBeEIsQ0FBNkIsSUFBN0I7QUFaRyxhQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBbkVGO0FBb0ZFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0wxRSwwQkFBVSxVQURMO0FBRUxuUCxzQkFBTSxDQUFDLENBRkY7QUFHTGdRLHVCQUFPLENBSEY7QUFJTEQsd0JBQVEsRUFKSDtBQUtMaFEscUJBQUssQ0FBQyxDQUxEO0FBTUxxUywyQkFBVyxZQU5OO0FBT0xILHdCQUFRO0FBUEgsZUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUE7QUFDRSwyQkFBVSxrQkFEWjtBQUVFLHVCQUFPO0FBQ0w5Qyw0QkFBVSxVQURMO0FBRUxwUCx1QkFBSyxDQUZBO0FBR0xDLHdCQUFNLENBSEQ7QUFJTGtTLDBCQUFTekIsUUFBUUosU0FBVCxHQUFzQixTQUF0QixHQUFrQztBQUpyQyxpQkFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRSxxRUFBYSxPQUFRSSxRQUFRSCxnQkFBVCxHQUNkLHlCQUFRZ0MsSUFETSxHQUViN0IsUUFBUThCLGlCQUFULEdBQ0kseUJBQVFDLFNBRFosR0FFS1UsbUJBQUQsR0FDRSx5QkFBUVQsYUFEVixHQUVFLHlCQUFRQyxJQU5wQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFSRjtBQVZGLFdBcEZGO0FBZ0hFO0FBQUE7QUFBQSxjQUFNLE9BQU87QUFDWHZELDBCQUFVLFVBREM7QUFFWDhDLHdCQUFRLElBRkc7QUFHWGpDLHVCQUFPLE1BSEk7QUFJWEQsd0JBQVEsTUFKRztBQUtYMkQsOEJBQWMsQ0FMSDtBQU1YSSw0QkFBWSxDQU5EO0FBT1g3RCwwQkFBVThDLGlCQUFpQixTQUFqQixHQUE2QjtBQVA1QixlQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNFLDBDQUFDLFFBQUQ7QUFDRSxrQkFBSUosU0FETjtBQUVFLDRCQUFlbEMsUUFBUUgsZ0JBQVQsR0FDVix5QkFBUWdDLElBREUsR0FFUjdCLFFBQVE4QixpQkFBVCxHQUNHLHlCQUFRQyxTQURYLEdBRUlVLG1CQUFELEdBQ0UseUJBQVFULGFBRFYsR0FFRSx5QkFBUUMsSUFScEI7QUFTRSw2QkFBZ0JqQyxRQUFRSCxnQkFBVCxHQUNYLHlCQUFRZ0MsSUFERyxHQUVUN0IsUUFBUThCLGlCQUFULEdBQ0cseUJBQVFDLFNBRFgsR0FFSVcsb0JBQUQsR0FDRSx5QkFBUVYsYUFEVixHQUVFLHlCQUFRQyxJQWZwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVRGLFdBaEhGO0FBMklFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0x2RCwwQkFBVSxVQURMO0FBRUw0RSx1QkFBTyxDQUFDLENBRkg7QUFHTC9ELHVCQUFPLENBSEY7QUFJTEQsd0JBQVEsRUFKSDtBQUtMaFEscUJBQUssQ0FBQyxDQUxEO0FBTUxxUywyQkFBVyxZQU5OO0FBT0xDLDRCQUFZLHNCQVBQO0FBUUxKLHdCQUFRO0FBUkgsZUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXRTtBQUFBO0FBQUE7QUFDRSwyQkFBVSxrQkFEWjtBQUVFLHVCQUFPO0FBQ0w5Qyw0QkFBVSxVQURMO0FBRUxwUCx1QkFBSyxDQUZBO0FBR0xDLHdCQUFNLENBSEQ7QUFJTGtTLDBCQUFTekIsUUFBUUosU0FBVCxHQUNKLFNBREksR0FFSjtBQU5DLGlCQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFLHFFQUFhLE9BQVFJLFFBQVFILGdCQUFULEdBQ2hCLHlCQUFRZ0MsSUFEUSxHQUVmN0IsUUFBUThCLGlCQUFULEdBQ0kseUJBQVFDLFNBRFosR0FFS1csb0JBQUQsR0FDRSx5QkFBUVYsYUFEVixHQUVFLHlCQUFRQyxJQU5sQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFWRjtBQVhGO0FBM0lGO0FBM0RGLE9BREY7QUF5T0Q7Ozt1Q0FFbUJ6VSxTLEVBQVd2RCxXLEVBQWFxRCxXLEVBQWFwRCxZLEVBQWMvRixlLEVBQWlCMlosSSxFQUFNQyxJLEVBQU14UixJLEVBQU00UixZLEVBQWNDLGEsRUFBZS9NLEssRUFBTzJPLE8sRUFBUztBQUFBOztBQUNySjtBQUNBLFVBQU1rQyxZQUFlaFksWUFBZixTQUErQm1ILEtBQS9CLFNBQXdDME0sS0FBSzFQLEVBQW5EO0FBQ0EsVUFBSWtWLGFBQWEsS0FBakI7QUFDQSxVQUFJLEtBQUsxYixLQUFMLENBQVczRCxnQkFBWCxDQUE0QitGLGNBQWMsR0FBZCxHQUFvQkMsWUFBcEIsR0FBbUMsR0FBbkMsR0FBeUM2VCxLQUFLMU0sS0FBMUUsS0FBb0Z3TSxTQUF4RixFQUFtRzBGLGFBQWEsSUFBYjs7QUFFbkcsYUFDRTtBQUFBO0FBQUE7QUFDRSxlQUFLLGFBQUNaLFVBQUQsRUFBZ0I7QUFDbkIsb0JBQUtULFNBQUwsSUFBa0JTLFVBQWxCO0FBQ0QsV0FISDtBQUlFLGVBQVF6WSxZQUFSLFNBQXdCbUgsS0FKMUI7QUFLRSxxQkFBVSxlQUxaO0FBTUUseUJBQWUsdUJBQUN3UCxZQUFELEVBQWtCO0FBQy9CLGdCQUFJYixRQUFRSixTQUFaLEVBQXVCLE9BQU8sS0FBUDtBQUN2QmlCLHlCQUFhRixlQUFiO0FBQ0EsZ0JBQUlHLGVBQWVELGFBQWFuUixXQUFiLENBQXlCcVIsT0FBNUM7QUFDQSxnQkFBSUMsZUFBZUYsZUFBZTNDLFlBQWYsR0FBOEJ0USxLQUFLQyxLQUFMLENBQVdOLFVBQVUyTSxHQUFWLEdBQWdCM00sVUFBVWdGLElBQXJDLENBQWpEO0FBQ0EsZ0JBQUkwTyxlQUFlclQsS0FBS0MsS0FBTCxDQUFXa1QsZUFBZXhULFVBQVVnRixJQUFwQyxDQUFuQjtBQUNBLGdCQUFJeU8sWUFBWXBULEtBQUtDLEtBQUwsQ0FBWWtULGVBQWV4VCxVQUFVZ0YsSUFBMUIsR0FBa0NoRixVQUFVRyxJQUF2RCxDQUFoQjtBQUNBLG9CQUFLNUYsT0FBTCxDQUFhb1osSUFBYixDQUFrQjtBQUNoQmxVLG9CQUFNLGtCQURVO0FBRWhCTyxrQ0FGZ0I7QUFHaEI0VCxxQkFBT1AsYUFBYW5SLFdBSEo7QUFJaEJ6RixzQ0FKZ0I7QUFLaEJvRCw0QkFBYyxRQUFLeEYsS0FBTCxDQUFXNUUsbUJBTFQ7QUFNaEJpSCx3Q0FOZ0I7QUFPaEJtWCwwQkFBWXRELEtBQUtDLEtBUEQ7QUFRaEJ6UCw2QkFBZXdQLEtBQUsxTSxLQVJKO0FBU2hCOUQsdUJBQVN3USxLQUFLMVAsRUFURTtBQVVoQmlULHdCQUFVL1UsS0FBS3lSLEtBVkM7QUFXaEIvUCxxQkFBTzFCLEtBQUs4QixFQVhJO0FBWWhCNlAscUJBQU8sSUFaUztBQWFoQjRDLHdDQWJnQjtBQWNoQkUsd0NBZGdCO0FBZWhCRSx3Q0FmZ0I7QUFnQmhCRCxrQ0FoQmdCO0FBaUJoQjNUO0FBakJnQixhQUFsQjtBQW1CRCxXQWhDSDtBQWlDRSx1QkFBYSxxQkFBQ29ULENBQUQsRUFBTztBQUNsQkEsY0FBRUMsZUFBRjtBQUNBLGdCQUFJemMsbUJBQW1CLFFBQUsyRCxLQUFMLENBQVczRCxnQkFBbEM7QUFDQSxnQkFBSUQsb0JBQW9CLFFBQUs0RCxLQUFMLENBQVc1RCxpQkFBbkM7QUFDQSxnQkFBSSxDQUFDeWMsRUFBRUUsUUFBUCxFQUFpQjtBQUNmMWMsaUNBQW1CLEVBQW5CO0FBQ0FELGtDQUFvQixFQUFwQjtBQUNELGFBSEQsTUFHTztBQUNMQywrQkFBaUIrRixjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLEdBQXlDNlQsS0FBSzFNLEtBQS9ELElBQXdFO0FBQ3RFZ0csb0JBQUlwTixjQUFjLEdBQWQsR0FBb0JDLFlBQXBCLEdBQW1DLEdBQW5DLEdBQXlDNlQsS0FBSzFNLEtBRG9CO0FBRXRFcEgsd0NBRnNFO0FBR3RFcUQsd0NBSHNFO0FBSXRFcEQsMENBSnNFO0FBS3RFbUUsb0JBQUkwUCxLQUFLMVAsRUFMNkQ7QUFNdEVKLHVCQUFPMUIsS0FBSzhCLEVBTjBEO0FBT3RFMkcsMEJBQVU7QUFQNEQsZUFBeEU7QUFTRDtBQUNELG9CQUFLdkwsUUFBTCxDQUFjLEVBQUV2RixrQ0FBRixFQUFvQkQsb0NBQXBCLEVBQWQ7QUFDRCxXQXBESDtBQXFERSxpQkFBTztBQUNMeWEsc0JBQVUsVUFETDtBQUVMblAsa0JBQU00TyxlQUFlLENBRmhCO0FBR0xvQixtQkFBT25CLGdCQUFnQkQsWUFIbEI7QUFJTG1CLG9CQUFRLEtBQUt6WCxLQUFMLENBQVd0RjtBQUpkLFdBckRUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTJERSxnREFBTSxPQUFPO0FBQ1grYyxvQkFBUSxDQURHO0FBRVhoUSxpQkFBSyxFQUZNO0FBR1hvUCxzQkFBVSxVQUhDO0FBSVg4QyxvQkFBUSxDQUpHO0FBS1hqQyxtQkFBTyxNQUxJO0FBTVgyRCw2QkFBa0JsRCxRQUFRSCxnQkFBVCxHQUNiLHFCQUFNLHlCQUFRa0QsSUFBZCxFQUFvQkssSUFBcEIsQ0FBeUIsSUFBekIsQ0FEYSxHQUVaRyxVQUFELEdBQ0cscUJBQU0seUJBQVF2QixhQUFkLEVBQTZCb0IsSUFBN0IsQ0FBa0MsRUFBbEMsQ0FESCxHQUVFLHlCQUFRSTtBQVZILFdBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBM0RGLE9BREY7QUEwRUQ7OzttREFFK0JoVyxTLEVBQVd5RSxJLEVBQU1aLEssRUFBT2lPLE0sRUFBUW1FLFEsRUFBVXRmLGUsRUFBaUI7QUFBQTs7QUFDekYsVUFBTThGLGNBQWNnSSxLQUFLNUssSUFBTCxDQUFVcUosVUFBVixDQUFxQixVQUFyQixDQUFwQjtBQUNBLFVBQU1wRCxjQUFlLFFBQU8yRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QyRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBcEY7QUFDQSxVQUFNcEQsZUFBZStILEtBQUtELFFBQUwsQ0FBY2hILElBQW5DO0FBQ0EsVUFBTTBZLGNBQWMsS0FBS0MsY0FBTCxDQUFvQjFSLElBQXBCLENBQXBCOztBQUVBLGFBQU8sS0FBS3VNLGtDQUFMLENBQXdDaFIsU0FBeEMsRUFBbUR2RCxXQUFuRCxFQUFnRXFELFdBQWhFLEVBQTZFcEQsWUFBN0UsRUFBMkYvRixlQUEzRixFQUE0RyxVQUFDMlosSUFBRCxFQUFPQyxJQUFQLEVBQWF4UixJQUFiLEVBQW1CNFIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEL00sS0FBaEQsRUFBMEQ7QUFDM0ssWUFBSXFPLGdCQUFnQixFQUFwQjs7QUFFQSxZQUFJM0IsS0FBS0csS0FBVCxFQUFnQjtBQUNkd0Isd0JBQWM3VixJQUFkLENBQW1CLFFBQUs4VixvQkFBTCxDQUEwQm5TLFNBQTFCLEVBQXFDdkQsV0FBckMsRUFBa0RxRCxXQUFsRCxFQUErRHBELFlBQS9ELEVBQTZFL0YsZUFBN0UsRUFBOEYyWixJQUE5RixFQUFvR0MsSUFBcEcsRUFBMEd4UixJQUExRyxFQUFnSDRSLFlBQWhILEVBQThIQyxhQUE5SCxFQUE2SSxDQUE3SSxFQUFnSixFQUFFc0Ysd0JBQUYsRUFBaEosQ0FBbkI7QUFDRCxTQUZELE1BRU87QUFDTCxjQUFJblgsSUFBSixFQUFVO0FBQ1JtVCwwQkFBYzdWLElBQWQsQ0FBbUIsUUFBS2lXLGtCQUFMLENBQXdCdFMsU0FBeEIsRUFBbUN2RCxXQUFuQyxFQUFnRHFELFdBQWhELEVBQTZEcEQsWUFBN0QsRUFBMkUvRixlQUEzRSxFQUE0RjJaLElBQTVGLEVBQWtHQyxJQUFsRyxFQUF3R3hSLElBQXhHLEVBQThHNFIsWUFBOUcsRUFBNEhDLGFBQTVILEVBQTJJLENBQTNJLEVBQThJLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRCxjQUFJLENBQUNOLElBQUQsSUFBUyxDQUFDQSxLQUFLSSxLQUFuQixFQUEwQjtBQUN4QndCLDBCQUFjN1YsSUFBZCxDQUFtQixRQUFLa1csa0JBQUwsQ0FBd0J2UyxTQUF4QixFQUFtQ3ZELFdBQW5DLEVBQWdEcUQsV0FBaEQsRUFBNkRwRCxZQUE3RCxFQUEyRS9GLGVBQTNFLEVBQTRGMlosSUFBNUYsRUFBa0dDLElBQWxHLEVBQXdHeFIsSUFBeEcsRUFBOEc0UixZQUE5RyxFQUE0SEMsYUFBNUgsRUFBMkksQ0FBM0ksRUFBOEksRUFBRXNGLHdCQUFGLEVBQTlJLENBQW5CO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJNUYsSUFBSixFQUFVO0FBQ1I0Qix3QkFBYzdWLElBQWQsQ0FBbUIsUUFBSytaLDhCQUFMLENBQW9DcFcsU0FBcEMsRUFBK0N2RCxXQUEvQyxFQUE0RHFELFdBQTVELEVBQXlFcEQsWUFBekUsRUFBdUYvRixlQUF2RixFQUF3RzJaLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHhSLElBQXBILEVBQTBINFIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixNQUFoSixFQUF3SixFQUF4SixDQUFuQjtBQUNEO0FBQ0R1QixzQkFBYzdWLElBQWQsQ0FBbUIsUUFBSytaLDhCQUFMLENBQW9DcFcsU0FBcEMsRUFBK0N2RCxXQUEvQyxFQUE0RHFELFdBQTVELEVBQXlFcEQsWUFBekUsRUFBdUYvRixlQUF2RixFQUF3RzJaLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHhSLElBQXBILEVBQTBINFIsWUFBMUgsRUFBd0ksQ0FBeEksRUFBMkksUUFBM0ksRUFBcUosRUFBckosQ0FBbkI7QUFDQSxZQUFJNVIsSUFBSixFQUFVO0FBQ1JtVCx3QkFBYzdWLElBQWQsQ0FBbUIsUUFBSytaLDhCQUFMLENBQW9DcFcsU0FBcEMsRUFBK0N2RCxXQUEvQyxFQUE0RHFELFdBQTVELEVBQXlFcEQsWUFBekUsRUFBdUYvRixlQUF2RixFQUF3RzJaLElBQXhHLEVBQThHQyxJQUE5RyxFQUFvSHhSLElBQXBILEVBQTBINFIsZUFBZSxFQUF6SSxFQUE2SSxDQUE3SSxFQUFnSixPQUFoSixFQUF5SixFQUF6SixDQUFuQjtBQUNEOztBQUVELGVBQ0U7QUFBQTtBQUFBO0FBQ0UseUNBQTJCbFUsV0FBM0IsU0FBMENDLFlBQTFDLFNBQTBEbUgsS0FENUQ7QUFFRSwyQ0FGRjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHR3FPO0FBSEgsU0FERjtBQU9ELE9BN0JNLENBQVA7QUE4QkQ7O0FBRUQ7Ozs7Z0NBRWFsUyxTLEVBQVc7QUFBQTs7QUFDdEIsVUFBSSxLQUFLM0YsS0FBTCxDQUFXN0UsZUFBWCxLQUErQixRQUFuQyxFQUE2QztBQUMzQyxlQUFPLEtBQUs2Z0IsZ0JBQUwsQ0FBc0IsVUFBQy9LLFdBQUQsRUFBY0MsZUFBZCxFQUErQitLLGNBQS9CLEVBQStDbEwsWUFBL0MsRUFBZ0U7QUFDM0YsY0FBSUUsZ0JBQWdCLENBQWhCLElBQXFCQSxjQUFjRixZQUFkLEtBQStCLENBQXhELEVBQTJEO0FBQ3pELG1CQUNFO0FBQUE7QUFBQSxnQkFBTSxnQkFBY0UsV0FBcEIsRUFBbUMsT0FBTyxFQUFFaUwsZUFBZSxNQUFqQixFQUF5QnhDLFNBQVMsY0FBbEMsRUFBa0Q3QyxVQUFVLFVBQTVELEVBQXdFblAsTUFBTXdKLGVBQTlFLEVBQStGNEksV0FBVyxrQkFBMUcsRUFBMUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGtCQUFNLE9BQU8sRUFBRXFDLFlBQVksTUFBZCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFzQ2xMO0FBQXRDO0FBREYsYUFERjtBQUtEO0FBQ0YsU0FSTSxDQUFQO0FBU0QsT0FWRCxNQVVPLElBQUksS0FBS2pSLEtBQUwsQ0FBVzdFLGVBQVgsS0FBK0IsU0FBbkMsRUFBOEM7QUFBRTtBQUNyRCxlQUFPLEtBQUtpaEIsZUFBTCxDQUFxQixVQUFDQyxrQkFBRCxFQUFxQm5MLGVBQXJCLEVBQXNDb0wsaUJBQXRDLEVBQTREO0FBQ3RGLGNBQUlBLHFCQUFxQixJQUF6QixFQUErQjtBQUM3QixtQkFDRTtBQUFBO0FBQUEsZ0JBQU0sZUFBYUQsa0JBQW5CLEVBQXlDLE9BQU8sRUFBRUgsZUFBZSxNQUFqQixFQUF5QnhDLFNBQVMsY0FBbEMsRUFBa0Q3QyxVQUFVLFVBQTVELEVBQXdFblAsTUFBTXdKLGVBQTlFLEVBQStGNEksV0FBVyxrQkFBMUcsRUFBaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGtCQUFNLE9BQU8sRUFBRXFDLFlBQVksTUFBZCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFzQ0Usa0NBQXRDO0FBQUE7QUFBQTtBQURGLGFBREY7QUFLRCxXQU5ELE1BTU87QUFDTCxtQkFDRTtBQUFBO0FBQUEsZ0JBQU0sZUFBYUEsa0JBQW5CLEVBQXlDLE9BQU8sRUFBRUgsZUFBZSxNQUFqQixFQUF5QnhDLFNBQVMsY0FBbEMsRUFBa0Q3QyxVQUFVLFVBQTVELEVBQXdFblAsTUFBTXdKLGVBQTlFLEVBQStGNEksV0FBVyxrQkFBMUcsRUFBaEQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLGtCQUFNLE9BQU8sRUFBRXFDLFlBQVksTUFBZCxFQUFiO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFzQyw2Q0FBY0UscUJBQXFCLElBQW5DLENBQXRDO0FBQUE7QUFBQTtBQURGLGFBREY7QUFLRDtBQUNGLFNBZE0sQ0FBUDtBQWVEO0FBQ0Y7OztvQ0FFZ0IxVyxTLEVBQVc7QUFBQTs7QUFDMUIsVUFBSTRXLGNBQWUsS0FBS3pVLElBQUwsQ0FBVW1CLFVBQVYsSUFBd0IsS0FBS25CLElBQUwsQ0FBVW1CLFVBQVYsQ0FBcUJ1VCxZQUFyQixHQUFvQyxFQUE3RCxJQUFvRSxDQUF0RjtBQUNBLGFBQ0U7QUFBQTtBQUFBLFVBQUssSUFBRyxZQUFSO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLGFBQUtSLGdCQUFMLENBQXNCLFVBQUMvSyxXQUFELEVBQWNDLGVBQWQsRUFBK0IrSyxjQUEvQixFQUErQ2xMLFlBQS9DLEVBQWdFO0FBQ3JGLGlCQUFPLHdDQUFNLGdCQUFjRSxXQUFwQixFQUFtQyxPQUFPLEVBQUN3RyxRQUFROEUsY0FBYyxFQUF2QixFQUEyQkUsWUFBWSxlQUFlLHFCQUFNLHlCQUFRQyxJQUFkLEVBQW9CbkIsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBdEQsRUFBc0YxRSxVQUFVLFVBQWhHLEVBQTRHblAsTUFBTXdKLGVBQWxILEVBQW1JekosS0FBSyxFQUF4SSxFQUExQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFBUDtBQUNELFNBRkE7QUFESCxPQURGO0FBT0Q7OztxQ0FFaUI7QUFBQTs7QUFDaEIsVUFBSTlCLFlBQVksS0FBS0MsWUFBTCxFQUFoQjtBQUNBLFVBQUksS0FBSzVGLEtBQUwsQ0FBV2pGLFlBQVgsR0FBMEI0SyxVQUFVdUIsSUFBcEMsSUFBNEMsS0FBS2xILEtBQUwsQ0FBV2pGLFlBQVgsR0FBMEI0SyxVQUFVZ1gsSUFBcEYsRUFBMEYsT0FBTyxFQUFQO0FBQzFGLFVBQUk3SyxjQUFjLEtBQUs5UixLQUFMLENBQVdqRixZQUFYLEdBQTBCNEssVUFBVXVCLElBQXREO0FBQ0EsVUFBSTZLLFdBQVdELGNBQWNuTSxVQUFVZ0YsSUFBdkM7QUFDQSxVQUFJaVMsY0FBZSxLQUFLOVUsSUFBTCxDQUFVbUIsVUFBVixJQUF3QixLQUFLbkIsSUFBTCxDQUFVbUIsVUFBVixDQUFxQnVULFlBQXJCLEdBQW9DLEVBQTdELElBQW9FLENBQXRGO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFDRSxnQkFBSyxHQURQO0FBRUUsbUJBQVMsaUJBQUNwRSxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDaEMsb0JBQUt6VyxRQUFMLENBQWM7QUFDWjFGLDRCQUFjLElBREY7QUFFWkQsNkJBQWUsSUFGSDtBQUdac08saUNBQW1COE4sU0FBU0UsQ0FIaEI7QUFJWi9OLDZCQUFlLFFBQUt4SyxLQUFMLENBQVdqRixZQUpkO0FBS1pZLDBDQUE0QjtBQUxoQixhQUFkO0FBT0QsV0FWSDtBQVdFLGtCQUFRLGdCQUFDeWMsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CNVQsdUJBQVcsWUFBTTtBQUNmLHNCQUFLN0MsUUFBTCxDQUFjLEVBQUUySSxtQkFBbUIsSUFBckIsRUFBMkJDLGVBQWUsUUFBS3hLLEtBQUwsQ0FBV2pGLFlBQXJELEVBQW1FWSw0QkFBNEIsS0FBL0YsRUFBZDtBQUNELGFBRkQsRUFFRyxHQUZIO0FBR0QsV0FmSDtBQWdCRSxrQkFBUSxpQkFBT21GLFFBQVAsQ0FBZ0IsVUFBQ3NYLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUMvQyxvQkFBS3dFLHNCQUFMLENBQTRCeEUsU0FBU0UsQ0FBckMsRUFBd0M1UyxTQUF4QztBQUNELFdBRk8sRUFFTHJHLGFBRkssQ0FoQlY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbUJFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFPO0FBQ0x1WCwwQkFBVSxVQURMO0FBRUx3RSxpQ0FBaUIseUJBQVFDLFFBRnBCO0FBR0w3RCx3QkFBUSxFQUhIO0FBSUxDLHVCQUFPLEVBSkY7QUFLTGpRLHFCQUFLLEVBTEE7QUFNTEMsc0JBQU1xSyxXQUFXLENBTlo7QUFPTHFKLDhCQUFjLEtBUFQ7QUFRTHhCLHdCQUFRLE1BUkg7QUFTTGtELDJCQUFXLDZCQVROO0FBVUxuRCx3QkFBUTtBQVZILGVBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYUUsb0RBQU0sT0FBTztBQUNYOUMsMEJBQVUsVUFEQztBQUVYOEMsd0JBQVEsSUFGRztBQUdYakMsdUJBQU8sQ0FISTtBQUlYRCx3QkFBUSxDQUpHO0FBS1hoUSxxQkFBSyxDQUxNO0FBTVhnViw0QkFBWSx1QkFORDtBQU9YTSw2QkFBYSx1QkFQRjtBQVFYQywyQkFBVyxlQUFlLHlCQUFRMUI7QUFSdkIsZUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsY0FiRjtBQXVCRSxvREFBTSxPQUFPO0FBQ1h6RSwwQkFBVSxVQURDO0FBRVg4Qyx3QkFBUSxJQUZHO0FBR1hqQyx1QkFBTyxDQUhJO0FBSVhELHdCQUFRLENBSkc7QUFLWC9QLHNCQUFNLENBTEs7QUFNWEQscUJBQUssQ0FOTTtBQU9YZ1YsNEJBQVksdUJBUEQ7QUFRWE0sNkJBQWEsdUJBUkY7QUFTWEMsMkJBQVcsZUFBZSx5QkFBUTFCO0FBVHZCLGVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBdkJGLFdBREY7QUFvQ0U7QUFDRSxtQkFBTztBQUNMekUsd0JBQVUsVUFETDtBQUVMOEMsc0JBQVEsSUFGSDtBQUdMMEIsK0JBQWlCLHlCQUFRQyxRQUhwQjtBQUlMN0Qsc0JBQVFtRixXQUpIO0FBS0xsRixxQkFBTyxDQUxGO0FBTUxqUSxtQkFBSyxFQU5BO0FBT0xDLG9CQUFNcUssUUFQRDtBQVFMbUssNkJBQWU7QUFSVixhQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXBDRjtBQW5CRixPQURGO0FBc0VEOzs7NkNBRXlCO0FBQUE7O0FBQ3hCLFVBQUl2VyxZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQTtBQUNBLFVBQUltTSxXQUFXLEtBQUsvUixLQUFMLENBQVdrTCxZQUFYLEdBQTBCLENBQTFCLEdBQThCLENBQUMsS0FBS2xMLEtBQUwsQ0FBVy9FLFlBQVosR0FBMkIwSyxVQUFVZ0YsSUFBbEY7O0FBRUEsVUFBSWhGLFVBQVVzQixJQUFWLElBQWtCdEIsVUFBVXNGLE9BQTVCLElBQXVDLEtBQUtqTCxLQUFMLENBQVdrTCxZQUF0RCxFQUFvRTtBQUNsRSxlQUNFO0FBQUE7QUFBQTtBQUNFLGtCQUFLLEdBRFA7QUFFRSxxQkFBUyxpQkFBQ2tOLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUNoQyxzQkFBS3pXLFFBQUwsQ0FBYztBQUNaM0YsK0JBQWUsSUFESDtBQUVaQyw4QkFBYyxJQUZGO0FBR1oyTyxtQ0FBbUJ3TixTQUFTRSxDQUhoQjtBQUladGQsOEJBQWM7QUFKRixlQUFkO0FBTUQsYUFUSDtBQVVFLG9CQUFRLGdCQUFDbWQsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CLGtCQUFJck4sYUFBYSxRQUFLaEwsS0FBTCxDQUFXaEYsUUFBWCxHQUFzQixRQUFLZ0YsS0FBTCxDQUFXaEYsUUFBakMsR0FBNEMySyxVQUFVc0YsT0FBdkU7QUFDQUUsNEJBQWMsUUFBS25MLEtBQUwsQ0FBVzhLLFdBQXpCO0FBQ0Esc0JBQUtsSixRQUFMLENBQWMsRUFBQzVHLFVBQVVnUSxhQUFhLFFBQUtoTCxLQUFMLENBQVcvRSxZQUFuQyxFQUFpRGlRLGNBQWMsS0FBL0QsRUFBc0VKLGFBQWEsSUFBbkYsRUFBZDtBQUNBckcseUJBQVcsWUFBTTtBQUFFLHdCQUFLN0MsUUFBTCxDQUFjLEVBQUVpSixtQkFBbUIsSUFBckIsRUFBMkI1UCxjQUFjLENBQXpDLEVBQWQ7QUFBNkQsZUFBaEYsRUFBa0YsR0FBbEY7QUFDRCxhQWZIO0FBZ0JFLG9CQUFRLGdCQUFDbWQsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQy9CLHNCQUFLNEUsOEJBQUwsQ0FBb0M1RSxTQUFTRSxDQUE3QyxFQUFnRDVTLFNBQWhEO0FBQ0QsYUFsQkg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbUJFO0FBQUE7QUFBQSxjQUFLLE9BQU8sRUFBQ2tSLFVBQVUsVUFBWCxFQUF1QjRFLE9BQU8xSixRQUE5QixFQUF3Q3RLLEtBQUssQ0FBN0MsRUFBZ0RrUyxRQUFRLElBQXhELEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFDRSxxQkFBTztBQUNMOUMsMEJBQVUsVUFETDtBQUVMd0UsaUNBQWlCLHlCQUFRakIsSUFGcEI7QUFHTDFDLHVCQUFPLENBSEY7QUFJTEQsd0JBQVEsRUFKSDtBQUtMa0Msd0JBQVEsQ0FMSDtBQU1MbFMscUJBQUssQ0FOQTtBQU9MZ1UsdUJBQU8sQ0FQRjtBQVFMeUIsc0NBQXNCLENBUmpCO0FBU0xDLHlDQUF5QixDQVRwQjtBQVVMdkQsd0JBQVE7QUFWSCxlQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxjQURGO0FBY0UsbURBQUssV0FBVSxXQUFmLEVBQTJCLE9BQU87QUFDaEMvQywwQkFBVSxVQURzQjtBQUVoQ3BQLHFCQUFLLENBRjJCO0FBR2hDMlYsNkJBQWEsTUFIbUI7QUFJaEMxVixzQkFBTSxDQUFDLENBSnlCO0FBS2hDZ1EsdUJBQU8sS0FBSzNGLFFBTG9CO0FBTWhDMEYsd0JBQVMsS0FBSzNQLElBQUwsQ0FBVW1CLFVBQVYsSUFBd0IsS0FBS25CLElBQUwsQ0FBVW1CLFVBQVYsQ0FBcUJ1VCxZQUFyQixHQUFvQyxFQUE3RCxJQUFvRSxDQU41QztBQU9oQ0MsNEJBQVksZUFBZSx5QkFBUVksV0FQSDtBQVFoQ2hDLGlDQUFpQixxQkFBTSx5QkFBUWdDLFdBQWQsRUFBMkI5QixJQUEzQixDQUFnQyxHQUFoQztBQVJlLGVBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWRGO0FBbkJGLFNBREY7QUErQ0QsT0FoREQsTUFnRE87QUFDTCxlQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBQVA7QUFDRDtBQUNGOzs7d0NBRW9CO0FBQUE7O0FBQ25CLFVBQU01VixZQUFZLEtBQUtDLFlBQUwsRUFBbEI7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLHdCQURaO0FBRUUsaUJBQU87QUFDTGlSLHNCQUFVLFVBREw7QUFFTHBQLGlCQUFLLENBRkE7QUFHTEMsa0JBQU0sQ0FIRDtBQUlMK1Asb0JBQVEsS0FBS3pYLEtBQUwsQ0FBV3RGLFNBQVgsR0FBdUIsRUFKMUI7QUFLTGdkLG1CQUFPLEtBQUsxWCxLQUFMLENBQVd4RixlQUFYLEdBQTZCLEtBQUt3RixLQUFMLENBQVd2RixjQUwxQztBQU1MNmlCLDJCQUFlLEtBTlY7QUFPTEMsc0JBQVUsRUFQTDtBQVFMQywwQkFBYyxlQUFlLHlCQUFRSCxXQVJoQztBQVNMaEMsNkJBQWlCLHlCQUFRcUI7QUFUcEIsV0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFhRTtBQUFBO0FBQUE7QUFDRSx1QkFBVSwyQkFEWjtBQUVFLG1CQUFPO0FBQ0w3Rix3QkFBVSxVQURMO0FBRUxwUCxtQkFBSyxDQUZBO0FBR0xDLG9CQUFNLENBSEQ7QUFJTCtQLHNCQUFRLFNBSkg7QUFLTEMscUJBQU8sS0FBSzFYLEtBQUwsQ0FBV3hGO0FBTGIsYUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFTRTtBQUFBO0FBQUE7QUFDRSx5QkFBVSxvQkFEWjtBQUVFLHFCQUFPO0FBQ0xpakIsdUJBQU8sT0FERjtBQUVMaFcscUJBQUssQ0FGQTtBQUdMaVcsMEJBQVUsRUFITDtBQUlMakcsd0JBQVEsU0FKSDtBQUtMNkYsK0JBQWUsS0FMVjtBQU1MSywyQkFBVyxPQU5OO0FBT0xuQyw0QkFBWSxDQVBQO0FBUUxvQyw4QkFBYztBQVJULGVBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUU7QUFBQTtBQUFBLGdCQUFNLE9BQU8sRUFBRWxFLFNBQVMsY0FBWCxFQUEyQmpDLFFBQVEsRUFBbkMsRUFBdUNvRyxTQUFTLENBQWhELEVBQW1EMUIsWUFBWSxTQUEvRCxFQUEwRW9CLFVBQVUsRUFBcEYsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDSSxtQkFBS3ZkLEtBQUwsQ0FBVzdFLGVBQVgsS0FBK0IsUUFBaEMsR0FDRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxpQkFBQyxDQUFDLEtBQUs2RSxLQUFMLENBQVdqRixZQUFwQjtBQUFBO0FBQUEsZUFESCxHQUVHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPLDZDQUFjLEtBQUtpRixLQUFMLENBQVdqRixZQUFYLEdBQTBCLElBQTFCLEdBQWlDLEtBQUtpRixLQUFMLENBQVc5RSxlQUE1QyxHQUE4RCxJQUE1RSxDQUFQO0FBQUE7QUFBQTtBQUhOO0FBWkYsV0FURjtBQTRCRTtBQUFBO0FBQUE7QUFDRSx5QkFBVSxtQkFEWjtBQUVFLHFCQUFPO0FBQ0x3Yyx1QkFBTyxFQURGO0FBRUwrRix1QkFBTyxPQUZGO0FBR0wvVixzQkFBTSxHQUhEO0FBSUwrUCx3QkFBUSxTQUpIO0FBS0w2RiwrQkFBZSxLQUxWO0FBTUxyQyx1QkFBTyx5QkFBUTZDLFVBTlY7QUFPTEMsMkJBQVcsUUFQTjtBQVFMSiwyQkFBVyxPQVJOO0FBU0xuQyw0QkFBWSxDQVRQO0FBVUxvQyw4QkFBYyxDQVZUO0FBV0xoRSx3QkFBUTtBQVhILGVBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBZUU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ksbUJBQUs1WixLQUFMLENBQVc3RSxlQUFYLEtBQStCLFFBQWhDLEdBQ0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU8sNkNBQWMsS0FBSzZFLEtBQUwsQ0FBV2pGLFlBQVgsR0FBMEIsSUFBMUIsR0FBaUMsS0FBS2lGLEtBQUwsQ0FBVzlFLGVBQTVDLEdBQThELElBQTVFLENBQVA7QUFBQTtBQUFBLGVBREgsR0FFRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTyxpQkFBQyxDQUFDLEtBQUs4RSxLQUFMLENBQVdqRixZQUFwQjtBQUFBO0FBQUE7QUFITixhQWZGO0FBcUJFO0FBQUE7QUFBQSxnQkFBSyxPQUFPLEVBQUNpakIsV0FBVyxNQUFaLEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWtDLG1CQUFLaGUsS0FBTCxDQUFXOUUsZUFBN0M7QUFBQTtBQUFBO0FBckJGLFdBNUJGO0FBbURFO0FBQUE7QUFBQTtBQUNFLHlCQUFVLGNBRFo7QUFFRSx1QkFBUyxLQUFLK2lCLHFCQUFMLENBQTJCbGQsSUFBM0IsQ0FBZ0MsSUFBaEMsQ0FGWDtBQUdFLHFCQUFPO0FBQ0wyVyx1QkFBTyxFQURGO0FBRUwrRix1QkFBTyxPQUZGO0FBR0xTLDZCQUFhLEVBSFI7QUFJTFgsMEJBQVUsQ0FKTDtBQUtMOUYsd0JBQVEsU0FMSDtBQU1MNkYsK0JBQWUsS0FOVjtBQU9MckMsdUJBQU8seUJBQVE2QyxVQVBWO0FBUUxILDJCQUFXLE9BUk47QUFTTG5DLDRCQUFZLENBVFA7QUFVTG9DLDhCQUFjLENBVlQ7QUFXTGhFLHdCQUFRO0FBWEgsZUFIVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFnQkcsaUJBQUs1WixLQUFMLENBQVc3RSxlQUFYLEtBQStCLFFBQS9CLEdBQ0k7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0Q7QUFBQTtBQUFBLGtCQUFLLE9BQU8sRUFBQzhmLE9BQU8seUJBQVFiLElBQWhCLEVBQXNCdkQsVUFBVSxVQUFoQyxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ksd0RBQU0sT0FBTyxFQUFDYSxPQUFPLENBQVIsRUFBV0QsUUFBUSxDQUFuQixFQUFzQjRELGlCQUFpQix5QkFBUWpCLElBQS9DLEVBQXFEZ0IsY0FBYyxLQUFuRSxFQUEwRXZFLFVBQVUsVUFBcEYsRUFBZ0c0RSxPQUFPLENBQUMsRUFBeEcsRUFBNEdoVSxLQUFLLENBQWpILEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREosZUFEQztBQUlEO0FBQUE7QUFBQSxrQkFBSyxPQUFPLEVBQUN1VyxXQUFXLE1BQVosRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSkMsYUFESixHQU9JO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsZUFEQztBQUVEO0FBQUE7QUFBQSxrQkFBSyxPQUFPLEVBQUNBLFdBQVcsTUFBWixFQUFvQi9DLE9BQU8seUJBQVFiLElBQW5DLEVBQXlDdkQsVUFBVSxVQUFuRCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0ksd0RBQU0sT0FBTyxFQUFDYSxPQUFPLENBQVIsRUFBV0QsUUFBUSxDQUFuQixFQUFzQjRELGlCQUFpQix5QkFBUWpCLElBQS9DLEVBQXFEZ0IsY0FBYyxLQUFuRSxFQUEwRXZFLFVBQVUsVUFBcEYsRUFBZ0c0RSxPQUFPLENBQUMsRUFBeEcsRUFBNEdoVSxLQUFLLENBQWpILEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREo7QUFGQztBQXZCUDtBQW5ERixTQWJGO0FBaUdFO0FBQUE7QUFBQTtBQUNFLHVCQUFVLFdBRFo7QUFFRSxxQkFBUyxpQkFBQzBXLFVBQUQsRUFBZ0I7QUFDdkIsa0JBQUksUUFBS25lLEtBQUwsQ0FBV3VLLGlCQUFYLEtBQWlDLElBQWpDLElBQXlDLFFBQUt2SyxLQUFMLENBQVd1SyxpQkFBWCxLQUFpQ3lMLFNBQTlFLEVBQXlGO0FBQ3ZGLG9CQUFJb0ksUUFBUUQsV0FBV3RXLFdBQVgsQ0FBdUJxUixPQUFuQztBQUNBLG9CQUFJbUYsU0FBU3JZLEtBQUtDLEtBQUwsQ0FBV21ZLFFBQVF6WSxVQUFVZ0YsSUFBN0IsQ0FBYjtBQUNBLG9CQUFJMlQsV0FBVzNZLFVBQVV1QixJQUFWLEdBQWlCbVgsTUFBaEM7QUFDQSx3QkFBS3pjLFFBQUwsQ0FBYztBQUNaM0YsaUNBQWUsSUFESDtBQUVaQyxnQ0FBYztBQUZGLGlCQUFkO0FBSUEsd0JBQUttRSxVQUFMLENBQWdCMEcsa0JBQWhCLEdBQXFDNkQsSUFBckMsQ0FBMEMwVCxRQUExQztBQUNEO0FBQ0YsYUFiSDtBQWNFLG1CQUFPO0FBQ0w7QUFDQXpILHdCQUFVLFVBRkw7QUFHTHBQLG1CQUFLLENBSEE7QUFJTEMsb0JBQU0sS0FBSzFILEtBQUwsQ0FBV3hGLGVBSlo7QUFLTGtkLHFCQUFPLEtBQUsxWCxLQUFMLENBQVd2RixjQUxiO0FBTUxnZCxzQkFBUSxTQU5IO0FBT0w2Riw2QkFBZSxLQVBWO0FBUUw5QiwwQkFBWSxFQVJQO0FBU0xQLHFCQUFPLHlCQUFRNkMsVUFUVixFQWRUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXdCRyxlQUFLUyxlQUFMLENBQXFCNVksU0FBckIsQ0F4Qkg7QUF5QkcsZUFBSzZZLFdBQUwsQ0FBaUI3WSxTQUFqQixDQXpCSDtBQTBCRyxlQUFLOFksY0FBTDtBQTFCSCxTQWpHRjtBQTZIRyxhQUFLQyxzQkFBTDtBQTdISCxPQURGO0FBaUlEOzs7bURBRStCO0FBQUE7O0FBQzlCLFVBQU0vWSxZQUFZLEtBQUtDLFlBQUwsRUFBbEI7QUFDQSxVQUFNK1ksYUFBYSxDQUFuQjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UscUJBQVUsMEJBRFo7QUFFRSxpQkFBTztBQUNMakgsbUJBQU8vUixVQUFVZ04sR0FEWjtBQUVMOEUsb0JBQVFrSCxhQUFhLENBRmhCO0FBR0w5SCxzQkFBVSxVQUhMO0FBSUx3RSw2QkFBaUIseUJBQVFNLFdBSnBCO0FBS0xxQix1QkFBVyxlQUFlLHlCQUFRSyxXQUw3QjtBQU1MRywwQkFBYyxlQUFlLHlCQUFRSDtBQU5oQyxXQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLGtCQUFLLEdBRFA7QUFFRSxxQkFBUyxpQkFBQ2pGLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUNoQyxzQkFBS3pXLFFBQUwsQ0FBYztBQUNaOEosdUNBQXVCMk0sU0FBU0UsQ0FEcEI7QUFFWjNNLGdDQUFnQixRQUFLNUwsS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FGSjtBQUdaaVIsOEJBQWMsUUFBSy9MLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBSEY7QUFJWmEsNENBQTRCO0FBSmhCLGVBQWQ7QUFNRCxhQVRIO0FBVUUsb0JBQVEsZ0JBQUN5YyxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0Isc0JBQUt6VyxRQUFMLENBQWM7QUFDWjhKLHVDQUF1QixLQURYO0FBRVpFLGdDQUFnQixJQUZKO0FBR1pHLDhCQUFjLElBSEY7QUFJWnBRLDRDQUE0QjtBQUpoQixlQUFkO0FBTUQsYUFqQkg7QUFrQkUsb0JBQVEsaUJBQU9tRixRQUFQLENBQWdCLFVBQUNzWCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFDL0Msc0JBQUt6VyxRQUFMLENBQWMsRUFBRWhHLHNCQUFzQitKLFVBQVVpTixHQUFWLEdBQWdCLENBQXhDLEVBQWQsRUFEK0MsQ0FDWTtBQUMzRCxrQkFBSSxDQUFDLFFBQUs1UyxLQUFMLENBQVd3TCxxQkFBWixJQUFxQyxDQUFDLFFBQUt4TCxLQUFMLENBQVd5TCxzQkFBckQsRUFBNkU7QUFDM0Usd0JBQUttVCx1QkFBTCxDQUE2QnZHLFNBQVNFLENBQXRDLEVBQXlDRixTQUFTRSxDQUFsRCxFQUFxRDVTLFNBQXJEO0FBQ0Q7QUFDRixhQUxPLEVBS0xyRyxhQUxLLENBbEJWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQXdCRTtBQUFBO0FBQUE7QUFDRSxxQkFBTztBQUNMdVgsMEJBQVUsVUFETDtBQUVMd0UsaUNBQWlCLHlCQUFRd0QsYUFGcEI7QUFHTHBILHdCQUFRa0gsYUFBYSxDQUhoQjtBQUlMalgsc0JBQU0vQixVQUFVaU4sR0FKWDtBQUtMOEUsdUJBQU8vUixVQUFVa04sR0FBVixHQUFnQmxOLFVBQVVpTixHQUExQixHQUFnQyxFQUxsQztBQU1Md0ksOEJBQWN1RCxVQU5UO0FBT0wvRSx3QkFBUTtBQVBILGVBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUU7QUFBQTtBQUFBO0FBQ0Usc0JBQUssR0FEUDtBQUVFLHlCQUFTLGlCQUFDeEIsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUt6VyxRQUFMLENBQWMsRUFBRTRKLHVCQUF1QjZNLFNBQVNFLENBQWxDLEVBQXFDM00sZ0JBQWdCLFFBQUs1TCxLQUFMLENBQVdsRixpQkFBWCxDQUE2QixDQUE3QixDQUFyRCxFQUFzRmlSLGNBQWMsUUFBSy9MLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBQXBHLEVBQWQ7QUFBc0osaUJBRjVMO0FBR0Usd0JBQVEsZ0JBQUNzZCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS3pXLFFBQUwsQ0FBYyxFQUFFNEosdUJBQXVCLEtBQXpCLEVBQWdDSSxnQkFBZ0IsSUFBaEQsRUFBc0RHLGNBQWMsSUFBcEUsRUFBZDtBQUEyRixpQkFIaEk7QUFJRSx3QkFBUSxpQkFBT2pMLFFBQVAsQ0FBZ0IsVUFBQ3NYLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLdUcsdUJBQUwsQ0FBNkJ2RyxTQUFTRSxDQUFULEdBQWE1UyxVQUFVaU4sR0FBcEQsRUFBeUQsQ0FBekQsRUFBNERqTixTQUE1RDtBQUF3RSxpQkFBbkgsRUFBcUhyRyxhQUFySCxDQUpWO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtFLHFEQUFLLE9BQU8sRUFBRW9ZLE9BQU8sRUFBVCxFQUFhRCxRQUFRLEVBQXJCLEVBQXlCWixVQUFVLFVBQW5DLEVBQStDK0MsUUFBUSxXQUF2RCxFQUFvRWxTLE1BQU0sQ0FBMUUsRUFBNkUwVCxjQUFjLEtBQTNGLEVBQWtHQyxpQkFBaUIseUJBQVFDLFFBQTNILEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTEYsYUFWRjtBQWlCRTtBQUFBO0FBQUE7QUFDRSxzQkFBSyxHQURQO0FBRUUseUJBQVMsaUJBQUNsRCxTQUFELEVBQVlDLFFBQVosRUFBeUI7QUFBRSwwQkFBS3pXLFFBQUwsQ0FBYyxFQUFFNkosd0JBQXdCNE0sU0FBU0UsQ0FBbkMsRUFBc0MzTSxnQkFBZ0IsUUFBSzVMLEtBQUwsQ0FBV2xGLGlCQUFYLENBQTZCLENBQTdCLENBQXRELEVBQXVGaVIsY0FBYyxRQUFLL0wsS0FBTCxDQUFXbEYsaUJBQVgsQ0FBNkIsQ0FBN0IsQ0FBckcsRUFBZDtBQUF1SixpQkFGN0w7QUFHRSx3QkFBUSxnQkFBQ3NkLFNBQUQsRUFBWUMsUUFBWixFQUF5QjtBQUFFLDBCQUFLelcsUUFBTCxDQUFjLEVBQUU2Six3QkFBd0IsS0FBMUIsRUFBaUNHLGdCQUFnQixJQUFqRCxFQUF1REcsY0FBYyxJQUFyRSxFQUFkO0FBQTRGLGlCQUhqSTtBQUlFLHdCQUFRLGlCQUFPakwsUUFBUCxDQUFnQixVQUFDc1gsU0FBRCxFQUFZQyxRQUFaLEVBQXlCO0FBQUUsMEJBQUt1Ryx1QkFBTCxDQUE2QixDQUE3QixFQUFnQ3ZHLFNBQVNFLENBQVQsR0FBYTVTLFVBQVVpTixHQUF2RCxFQUE0RGpOLFNBQTVEO0FBQXdFLGlCQUFuSCxFQUFxSHJHLGFBQXJILENBSlY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0UscURBQUssT0FBTyxFQUFFb1ksT0FBTyxFQUFULEVBQWFELFFBQVEsRUFBckIsRUFBeUJaLFVBQVUsVUFBbkMsRUFBK0MrQyxRQUFRLFdBQXZELEVBQW9FNkIsT0FBTyxDQUEzRSxFQUE4RUwsY0FBYyxLQUE1RixFQUFtR0MsaUJBQWlCLHlCQUFRQyxRQUE1SCxFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUxGO0FBakJGO0FBeEJGLFNBVkY7QUE0REU7QUFBQTtBQUFBLFlBQUssT0FBTyxFQUFFNUQsT0FBTyxLQUFLMVgsS0FBTCxDQUFXeEYsZUFBWCxHQUE2QixLQUFLd0YsS0FBTCxDQUFXdkYsY0FBeEMsR0FBeUQsRUFBbEUsRUFBc0VpTixNQUFNLEVBQTVFLEVBQWdGbVAsVUFBVSxVQUExRixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFLGlEQUFLLE9BQU87QUFDVkEsd0JBQVUsVUFEQTtBQUVWcUYsNkJBQWUsTUFGTDtBQUdWekUsc0JBQVFrSCxhQUFhLENBSFg7QUFJVmpILHFCQUFPLENBSkc7QUFLVjJELCtCQUFpQix5QkFBUWpCLElBTGY7QUFNVjFTLG9CQUFRLEtBQUsxSCxLQUFMLENBQVdqRixZQUFYLEdBQTBCNEssVUFBVXNGLE9BQXJDLEdBQWdELEdBQWpELEdBQXdEO0FBTnBELGFBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBREY7QUE1REYsT0FERjtBQXlFRDs7OzJDQUV1QjtBQUN0QixhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLFdBRFo7QUFFRSxpQkFBTztBQUNMeU0sbUJBQU8sTUFERjtBQUVMRCxvQkFBUSxFQUZIO0FBR0w0RCw2QkFBaUIseUJBQVFxQixJQUhwQjtBQUlML0Usc0JBQVUsU0FKTDtBQUtMZCxzQkFBVSxPQUxMO0FBTUxpSSxvQkFBUSxDQU5IO0FBT0xwWCxrQkFBTSxDQVBEO0FBUUxpUyxvQkFBUTtBQVJILFdBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWUcsYUFBS29GLDRCQUFMLEVBWkg7QUFhRyxhQUFLQyw4QkFBTDtBQWJILE9BREY7QUFpQkQ7OztxREFFMkU7QUFBQSxVQUEvQ3hmLElBQStDLFNBQS9DQSxJQUErQztBQUFBLFVBQXpDaVIsT0FBeUMsU0FBekNBLE9BQXlDO0FBQUEsVUFBaENqSCxLQUFnQyxTQUFoQ0EsS0FBZ0M7QUFBQSxVQUF6QmtILFFBQXlCLFNBQXpCQSxRQUF5QjtBQUFBLFVBQWZtRCxXQUFlLFNBQWZBLFdBQWU7O0FBQzFFO0FBQ0E7QUFDQSxVQUFNNEQsU0FBUzVELGdCQUFnQixNQUFoQixHQUF5QixFQUF6QixHQUE4QixFQUE3QztBQUNBLFVBQU1vSCxRQUFRemIsS0FBS21LLFlBQUwsR0FBb0IseUJBQVF5USxJQUE1QixHQUFtQyx5QkFBUTBELFVBQXpEO0FBQ0EsVUFBTXJZLGNBQWUsUUFBT2pHLEtBQUtpRyxXQUFaLE1BQTRCLFFBQTdCLEdBQXlDLEtBQXpDLEdBQWlEakcsS0FBS2lHLFdBQTFFOztBQUVBLGFBQ0dnTCxZQUFZLEdBQWIsR0FDSztBQUFBO0FBQUEsVUFBSyxPQUFPLEVBQUNnSCxRQUFRLEVBQVQsRUFBYWlDLFNBQVMsY0FBdEIsRUFBc0NJLFdBQVcsaUJBQWpELEVBQVo7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsZ0NBQVN0YSxLQUFLcUosVUFBTCxDQUFnQixhQUFoQixLQUFrQ3BELFdBQTNDLEVBQXdELEVBQXhEO0FBREEsT0FETCxHQUlLO0FBQUE7QUFBQSxVQUFNLFdBQVUsV0FBaEI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0Q7QUFBQTtBQUFBO0FBQ0UsbUJBQU87QUFDTGlVLHVCQUFTLGNBREo7QUFFTDZELHdCQUFVLEVBRkw7QUFHTDFHLHdCQUFVLFVBSEw7QUFJTDhDLHNCQUFRLElBSkg7QUFLTDJELDZCQUFlLFFBTFY7QUFNTHJDLHFCQUFPLHlCQUFRZ0UsU0FOVjtBQU9MZiwyQkFBYSxDQVBSO0FBUUxGLHlCQUFXO0FBUk4sYUFEVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXRSxrREFBTSxPQUFPLEVBQUNrQixZQUFZLENBQWIsRUFBZ0I3RCxpQkFBaUIseUJBQVE0RCxTQUF6QyxFQUFvRHBJLFVBQVUsVUFBOUQsRUFBMEVhLE9BQU8sQ0FBakYsRUFBb0ZELFFBQVFBLE1BQTVGLEVBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBWEY7QUFZRTtBQUFBO0FBQUEsY0FBTSxPQUFPLEVBQUN5SCxZQUFZLENBQWIsRUFBYjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBWkYsU0FEQztBQWVEO0FBQUE7QUFBQTtBQUNFLG1CQUFPO0FBQ0xqRSwwQkFESztBQUVMcEUsd0JBQVUsVUFGTDtBQUdMOEMsc0JBQVE7QUFISCxhQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU1HLGtDQUFTbmEsS0FBS3FKLFVBQUwsQ0FBZ0IsYUFBaEIsV0FBc0NwRCxXQUF0QyxNQUFULEVBQStELENBQS9EO0FBTkg7QUFmQyxPQUxQO0FBOEJEOzs7OENBRTBCMkUsSSxFQUFNWixLLEVBQU9pTyxNLEVBQVF4QyxLLEVBQU87QUFBQTs7QUFDckQsVUFBSTdTLGNBQWNnSSxLQUFLNUssSUFBTCxDQUFVcUosVUFBVixDQUFxQixVQUFyQixDQUFsQjtBQUNBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsMENBQThCekcsV0FBOUIsU0FBNkNvSCxLQUQvQztBQUVFLHFCQUFVLGlDQUZaO0FBR0UsK0JBQW1CcEgsV0FIckI7QUFJRSxtQkFBUyxtQkFBTTtBQUNiO0FBQ0EsZ0JBQUlnSSxLQUFLNUssSUFBTCxDQUFVbUssWUFBZCxFQUE0QjtBQUMxQixzQkFBS29HLFlBQUwsQ0FBa0IzRixLQUFLNUssSUFBdkIsRUFBNkI0QyxXQUE3QjtBQUNBLHNCQUFLckMsS0FBTCxDQUFXVSxTQUFYLENBQXFCdU0sTUFBckIsQ0FBNEIsaUJBQTVCLEVBQStDLENBQUMsUUFBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQjZCLFdBQXBCLENBQS9DLEVBQWlGLFlBQU0sQ0FBRSxDQUF6RjtBQUNELGFBSEQsTUFHTztBQUNMLHNCQUFLNkgsVUFBTCxDQUFnQkcsS0FBSzVLLElBQXJCLEVBQTJCNEMsV0FBM0I7QUFDQSxzQkFBS3JDLEtBQUwsQ0FBV1UsU0FBWCxDQUFxQnVNLE1BQXJCLENBQTRCLGVBQTVCLEVBQTZDLENBQUMsUUFBS2pOLEtBQUwsQ0FBV1EsTUFBWixFQUFvQjZCLFdBQXBCLENBQTdDLEVBQStFLFlBQU0sQ0FBRSxDQUF2RjtBQUNEO0FBQ0YsV0FiSDtBQWNFLGlCQUFPO0FBQ0xzWCxxQkFBUyxPQURKO0FBRUx5Rix5QkFBYSxPQUZSO0FBR0wxSCxvQkFBUXJOLEtBQUs1SyxJQUFMLENBQVVtSyxZQUFWLEdBQXlCLENBQXpCLEdBQTZCOE4sTUFIaEM7QUFJTEMsbUJBQU8sTUFKRjtBQUtMa0Msb0JBQVEsU0FMSDtBQU1ML0Msc0JBQVUsVUFOTDtBQU9MOEMsb0JBQVEsSUFQSDtBQVFMMEIsNkJBQWlCalIsS0FBSzVLLElBQUwsQ0FBVW1LLFlBQVYsR0FBeUIsYUFBekIsR0FBeUMseUJBQVF5VixVQVI3RDtBQVNMOUIsMkJBQWUsS0FUVjtBQVVMK0IscUJBQVVqVixLQUFLNUssSUFBTCxDQUFVaVEsVUFBWCxHQUF5QixJQUF6QixHQUFnQztBQVZwQyxXQWRUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQTBCRyxTQUFDckYsS0FBSzVLLElBQUwsQ0FBVW1LLFlBQVgsSUFBMkI7QUFDMUIsK0NBQUssT0FBTztBQUNWa04sc0JBQVUsVUFEQTtBQUVWOEMsb0JBQVEsSUFGRTtBQUdWalMsa0JBQU0sS0FBSzFILEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsRUFIekI7QUFJVmlOLGlCQUFLLENBSks7QUFLVjRULDZCQUFpQix5QkFBUStELFVBTGY7QUFNVjFILG1CQUFPLEVBTkc7QUFPVkQsb0JBQVEsS0FBS3pYLEtBQUwsQ0FBV3RGLFNBUFQsRUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUEzQko7QUFtQ0U7QUFBQTtBQUFBLFlBQUssT0FBTztBQUNWZ2YsdUJBQVMsWUFEQztBQUVWaEMscUJBQU8sS0FBSzFYLEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsR0FGMUI7QUFHVmlkLHNCQUFRLFNBSEU7QUFJVlosd0JBQVUsVUFKQTtBQUtWOEMsc0JBQVEsQ0FMRTtBQU1WMEIsK0JBQWtCalIsS0FBSzVLLElBQUwsQ0FBVW1LLFlBQVgsR0FBMkIsYUFBM0IsR0FBMkMseUJBQVF5VjtBQU4xRCxhQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFFO0FBQUE7QUFBQSxjQUFLLE9BQU8sRUFBRTNILGNBQUYsRUFBVXVHLFdBQVcsQ0FBQyxDQUF0QixFQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQTtBQUNFLHVCQUFPO0FBQ0xrQiw4QkFBWTtBQURQLGlCQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlJOVUsbUJBQUs1SyxJQUFMLENBQVVtSyxZQUFYLEdBQ0s7QUFBQTtBQUFBLGtCQUFNLFdBQVUsVUFBaEIsRUFBMkIsT0FBTyxFQUFFbEMsS0FBSyxDQUFQLEVBQVVDLE1BQU0sQ0FBQyxDQUFqQixFQUFsQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBd0QseUVBQWUsT0FBTyx5QkFBUTBTLElBQTlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF4RCxlQURMLEdBRUs7QUFBQTtBQUFBLGtCQUFNLFdBQVUsVUFBaEIsRUFBMkIsT0FBTyxFQUFFM1MsS0FBSyxDQUFQLEVBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUE5QztBQU5SLGFBREY7QUFVRyxpQkFBSzZYLHlCQUFMLENBQStCbFYsSUFBL0I7QUFWSDtBQVJGLFNBbkNGO0FBd0RFO0FBQUE7QUFBQSxZQUFLLFdBQVUsa0NBQWYsRUFBa0QsT0FBTyxFQUFFc1AsU0FBUyxZQUFYLEVBQXlCaEMsT0FBTyxLQUFLMVgsS0FBTCxDQUFXdkYsY0FBM0MsRUFBMkRnZCxRQUFRLFNBQW5FLEVBQXpEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNJLFdBQUNyTixLQUFLNUssSUFBTCxDQUFVbUssWUFBWixHQUE0QixLQUFLNFYsdUNBQUwsQ0FBNkNuVixJQUE3QyxDQUE1QixHQUFpRjtBQURwRjtBQXhERixPQURGO0FBOEREOzs7c0NBRWtCQSxJLEVBQU1aLEssRUFBT2lPLE0sRUFBUXhDLEssRUFBT3VLLHVCLEVBQXlCO0FBQUE7O0FBQ3RFLFVBQUk3WixZQUFZLEtBQUtDLFlBQUwsRUFBaEI7QUFDQSxVQUFJNlosWUFBWSxvQ0FBcUJyVixLQUFLRCxRQUFMLENBQWNoSCxJQUFuQyxDQUFoQjtBQUNBLFVBQUlmLGNBQWNnSSxLQUFLNUssSUFBTCxDQUFVcUosVUFBVixDQUFxQixVQUFyQixDQUFsQjtBQUNBLFVBQUlwRCxjQUFlLFFBQU8yRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QyRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBbEY7QUFDQSxVQUFJcEQsZUFBZStILEtBQUtELFFBQUwsSUFBaUJDLEtBQUtELFFBQUwsQ0FBY2hILElBQWxEOztBQUVBLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsaUNBQXFCcUcsS0FBckIsU0FBOEJwSCxXQUE5QixTQUE2Q0MsWUFEL0M7QUFFRSxxQkFBVSxjQUZaO0FBR0UsaUJBQU87QUFDTG9WLDBCQURLO0FBRUxDLG1CQUFPLEtBQUsxWCxLQUFMLENBQVd4RixlQUFYLEdBQTZCLEtBQUt3RixLQUFMLENBQVd2RixjQUYxQztBQUdMaU4sa0JBQU0sQ0FIRDtBQUlMMlgscUJBQVVqVixLQUFLNUssSUFBTCxDQUFVaVEsVUFBWCxHQUF5QixHQUF6QixHQUErQixHQUpuQztBQUtMb0gsc0JBQVU7QUFMTCxXQUhUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVVFO0FBQUE7QUFBQTtBQUNFLHFCQUFTLG1CQUFNO0FBQ2I7QUFDQSxrQkFBSTFhLDJCQUEyQixpQkFBT3lNLEtBQVAsQ0FBYSxRQUFLNUksS0FBTCxDQUFXN0Qsd0JBQXhCLENBQS9CO0FBQ0FBLHVDQUF5QmlPLEtBQUtvSyxVQUE5QixJQUE0QyxDQUFDclkseUJBQXlCaU8sS0FBS29LLFVBQTlCLENBQTdDO0FBQ0Esc0JBQUs1UyxRQUFMLENBQWM7QUFDWjNGLCtCQUFlLElBREgsRUFDUztBQUNyQkMsOEJBQWMsSUFGRixFQUVRO0FBQ3BCQztBQUhZLGVBQWQ7QUFLRCxhQVZIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVdJaU8sZUFBS3FLLGdCQUFOLEdBQ0c7QUFBQTtBQUFBO0FBQ0EscUJBQU87QUFDTG9DLDBCQUFVLFVBREw7QUFFTGEsdUJBQU8sRUFGRjtBQUdMaFEsc0JBQU0sR0FIRDtBQUlMRCxxQkFBSyxDQUFDLENBSkQ7QUFLTGtTLHdCQUFRLElBTEg7QUFNTGdFLDJCQUFXLE9BTk47QUFPTGxHLHdCQUFRO0FBUEgsZUFEUDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVQTtBQUFBO0FBQUEsZ0JBQU0sV0FBVSxVQUFoQixFQUEyQixPQUFPLEVBQUVoUSxLQUFLLENBQUMsQ0FBUixFQUFXQyxNQUFNLENBQUMsQ0FBbEIsRUFBbEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXlEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQXpEO0FBVkEsV0FESCxHQWFHLEVBeEJOO0FBMEJJLFdBQUM4WCx1QkFBRCxJQUE0QkMsY0FBYyxrQkFBM0MsSUFDQyx1Q0FBSyxPQUFPO0FBQ1Y1SSx3QkFBVSxVQURBO0FBRVZuUCxvQkFBTSxFQUZJO0FBR1ZnUSxxQkFBTyxDQUhHO0FBSVZpQyxzQkFBUSxJQUpFO0FBS1Y4QywwQkFBWSxlQUFlLHlCQUFRd0MsU0FMekI7QUFNVnhIO0FBTlUsYUFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUEzQko7QUFvQ0U7QUFBQTtBQUFBO0FBQ0UseUJBQVUsOEJBRFo7QUFFRSxxQkFBTztBQUNMZ0UsdUJBQU8sQ0FERjtBQUVML0QsdUJBQU8sS0FBSzFYLEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsRUFGL0I7QUFHTGlkLHdCQUFRLEtBQUt6WCxLQUFMLENBQVd0RixTQUhkO0FBSUxpakIsMkJBQVcsT0FKTjtBQUtMdEMsaUNBQWlCLHlCQUFRSCxJQUxwQjtBQU1MdkIsd0JBQVEsSUFOSDtBQU9MOUMsMEJBQVUsVUFQTDtBQVFMMkUsNEJBQVksQ0FSUDtBQVNMb0MsOEJBQWM7QUFUVCxlQUZUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWFFO0FBQUE7QUFBQSxnQkFBSyxPQUFPO0FBQ1Y4QixpQ0FBZSxXQURMO0FBRVZuQyw0QkFBVSxFQUZBO0FBR1Y3Rix5QkFBTyxFQUhHO0FBSVZpSSw4QkFBWSxDQUpGO0FBS1ZsQyx5QkFBTyxPQUxHO0FBTVZ4Qyx5QkFBTyx5QkFBUWIsSUFOTDtBQU9WTiw2QkFBVzJGLGNBQWMsa0JBQWQsR0FBbUMsa0JBQW5DLEdBQXdELGlCQVB6RDtBQVFWNUksNEJBQVU7QUFSQSxpQkFBWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRzRJO0FBVkg7QUFiRjtBQXBDRixTQVZGO0FBeUVFO0FBQUE7QUFBQSxZQUFLLFdBQVUsc0JBQWY7QUFDRSxtQkFBTztBQUNMNUksd0JBQVUsVUFETDtBQUVMblAsb0JBQU0sS0FBSzFILEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsRUFGOUI7QUFHTGtkLHFCQUFPLEVBSEY7QUFJTGpRLG1CQUFLLENBSkE7QUFLTGdRLHNCQUFRLEtBQUt6WCxLQUFMLENBQVd0RixTQUFYLEdBQXVCLENBTDFCO0FBTUxpakIseUJBQVc7QUFOTixhQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNFO0FBQ0Usb0JBQVEsSUFEVjtBQUVFLGtCQUFNdlQsSUFGUjtBQUdFLG1CQUFPWixLQUhUO0FBSUUsb0JBQVFpTyxNQUpWO0FBS0UsdUJBQVc5UixTQUxiO0FBTUUsdUJBQVcsS0FBS3RGLFVBTmxCO0FBT0UsNkJBQWlCLEtBQUtMLEtBQUwsQ0FBVzNFLGVBUDlCO0FBUUUsMEJBQWMsS0FBS21jLHNCQUFMLENBQTRCN1IsU0FBNUIsQ0FSaEI7QUFTRSwwQkFBYyxLQUFLM0YsS0FBTCxDQUFXNUUsbUJBVDNCO0FBVUUsdUJBQVcsS0FBSzRFLEtBQUwsQ0FBV3RGLFNBVnhCO0FBV0UsMkJBQWUsS0FBS3NGLEtBQUwsQ0FBVy9ELGFBWDVCO0FBWUUsZ0NBQW9CLEtBQUsrRCxLQUFMLENBQVd6RCxrQkFaakM7QUFhRSw2QkFBaUIsS0FBS3lELEtBQUwsQ0FBVzFELGVBYjlCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVRGLFNBekVGO0FBaUdFO0FBQUE7QUFBQTtBQUNFLDJCQUFlLHVCQUFDMGMsWUFBRCxFQUFrQjtBQUMvQkEsMkJBQWFGLGVBQWI7QUFDQSxrQkFBSUcsZUFBZUQsYUFBYW5SLFdBQWIsQ0FBeUJxUixPQUE1QztBQUNBLGtCQUFJQyxlQUFlRixlQUFldFQsVUFBVTJNLEdBQTVDO0FBQ0Esa0JBQUkrRyxlQUFlclQsS0FBS0MsS0FBTCxDQUFXa1QsZUFBZXhULFVBQVVnRixJQUFwQyxDQUFuQjtBQUNBLGtCQUFJeU8sWUFBWXBULEtBQUtDLEtBQUwsQ0FBWWtULGVBQWV4VCxVQUFVZ0YsSUFBMUIsR0FBa0NoRixVQUFVRyxJQUF2RCxDQUFoQjtBQUNBLHNCQUFLNUYsT0FBTCxDQUFhb1osSUFBYixDQUFrQjtBQUNoQmxVLHNCQUFNLGNBRFU7QUFFaEJPLG9DQUZnQjtBQUdoQjRULHVCQUFPUCxhQUFhblIsV0FISjtBQUloQnpGLHdDQUpnQjtBQUtoQkMsMENBTGdCO0FBTWhCbUQsOEJBQWMsUUFBS3hGLEtBQUwsQ0FBVzVFLG1CQU5UO0FBT2hCNmQsMENBUGdCO0FBUWhCRSwwQ0FSZ0I7QUFTaEJFLDBDQVRnQjtBQVVoQkQsb0NBVmdCO0FBV2hCM1Q7QUFYZ0IsZUFBbEI7QUFhRCxhQXBCSDtBQXFCRSx1QkFBVSxnQ0FyQlo7QUFzQkUseUJBQWEsdUJBQU07QUFDakIsa0JBQUlsRSxNQUFNNkksS0FBS2hJLFdBQUwsR0FBbUIsR0FBbkIsR0FBeUJnSSxLQUFLRCxRQUFMLENBQWNoSCxJQUFqRDtBQUNBO0FBQ0Esa0JBQUksQ0FBQyxRQUFLbkQsS0FBTCxDQUFXakUsYUFBWCxDQUF5QndGLEdBQXpCLENBQUwsRUFBb0M7QUFDbEMsb0JBQUl4RixnQkFBZ0IsRUFBcEI7QUFDQUEsOEJBQWN3RixHQUFkLElBQXFCLElBQXJCO0FBQ0Esd0JBQUtLLFFBQUwsQ0FBYyxFQUFFN0YsNEJBQUYsRUFBZDtBQUNEO0FBQ0YsYUE5Qkg7QUErQkUsbUJBQU87QUFDTDhhLHdCQUFVLFVBREw7QUFFTGEscUJBQU8sS0FBSzFYLEtBQUwsQ0FBV3ZGLGNBRmI7QUFHTGlOLG9CQUFNLEtBQUsxSCxLQUFMLENBQVd4RixlQUFYLEdBQTZCLENBSDlCLEVBR2lDO0FBQ3RDaU4sbUJBQUssQ0FKQTtBQUtMZ1Esc0JBQVE7QUFMSCxhQS9CVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFzQ0csZUFBS21JLDhCQUFMLENBQW9DamEsU0FBcEMsRUFBK0N5RSxJQUEvQyxFQUFxRFosS0FBckQsRUFBNERpTyxNQUE1RCxFQUFvRXhDLEtBQXBFLEVBQTJFLEtBQUtqVixLQUFMLENBQVcxRCxlQUF0RjtBQXRDSDtBQWpHRixPQURGO0FBNElEOzs7cUNBRWlCOE4sSSxFQUFNWixLLEVBQU9pTyxNLEVBQVF4QyxLLEVBQU91Syx1QixFQUF5QjtBQUFBOztBQUNyRSxVQUFJN1osWUFBWSxLQUFLQyxZQUFMLEVBQWhCO0FBQ0EsVUFBSXhELGNBQWNnSSxLQUFLNUssSUFBTCxDQUFVcUosVUFBVixDQUFxQixVQUFyQixDQUFsQjtBQUNBLFVBQUlwRCxjQUFlLFFBQU8yRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBakIsTUFBaUMsUUFBbEMsR0FBOEMsS0FBOUMsR0FBc0QyRSxLQUFLNUssSUFBTCxDQUFVaUcsV0FBbEY7QUFDQSxVQUFJc1AsY0FBYzNLLEtBQUsySyxXQUF2QjtBQUNBLFVBQUl6WSxrQkFBa0IsS0FBSzBELEtBQUwsQ0FBVzFELGVBQWpDO0FBQ0EsYUFDRTtBQUFBO0FBQUE7QUFDRSx5Q0FBNkJrTixLQUE3QixTQUFzQ3BILFdBQXRDLFNBQXFEMlMsV0FEdkQ7QUFFRSxxQkFBVSxzQkFGWjtBQUdFLG1CQUFTLG1CQUFNO0FBQ2I7QUFDQSxnQkFBSTVZLDJCQUEyQixpQkFBT3lNLEtBQVAsQ0FBYSxRQUFLNUksS0FBTCxDQUFXN0Qsd0JBQXhCLENBQS9CO0FBQ0FBLHFDQUF5QmlPLEtBQUtvSyxVQUE5QixJQUE0QyxDQUFDclkseUJBQXlCaU8sS0FBS29LLFVBQTlCLENBQTdDO0FBQ0Esb0JBQUs1UyxRQUFMLENBQWM7QUFDWjNGLDZCQUFlLElBREg7QUFFWkMsNEJBQWMsSUFGRjtBQUdaQztBQUhZLGFBQWQ7QUFLRCxXQVpIO0FBYUUseUJBQWUsdUJBQUM2YyxZQUFELEVBQWtCO0FBQy9CQSx5QkFBYUYsZUFBYjtBQUNBLGdCQUFJM2MsMkJBQTJCLGlCQUFPeU0sS0FBUCxDQUFhLFFBQUs1SSxLQUFMLENBQVc3RCx3QkFBeEIsQ0FBL0I7QUFDQUEscUNBQXlCaU8sS0FBS29LLFVBQTlCLElBQTRDLENBQUNyWSx5QkFBeUJpTyxLQUFLb0ssVUFBOUIsQ0FBN0M7QUFDQSxvQkFBSzVTLFFBQUwsQ0FBYztBQUNaM0YsNkJBQWUsSUFESDtBQUVaQyw0QkFBYyxJQUZGO0FBR1pDO0FBSFksYUFBZDtBQUtELFdBdEJIO0FBdUJFLGlCQUFPO0FBQ0xzYiwwQkFESztBQUVMQyxtQkFBTyxLQUFLMVgsS0FBTCxDQUFXeEYsZUFBWCxHQUE2QixLQUFLd0YsS0FBTCxDQUFXdkYsY0FGMUM7QUFHTGlOLGtCQUFNLENBSEQ7QUFJTDJYLHFCQUFValYsS0FBSzVLLElBQUwsQ0FBVWlRLFVBQVgsR0FBeUIsR0FBekIsR0FBK0IsR0FKbkM7QUFLTG9ILHNCQUFVLFVBTEw7QUFNTCtDLG9CQUFRO0FBTkgsV0F2QlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBK0JFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNHLFdBQUM0Rix1QkFBRCxJQUNDLHVDQUFLLE9BQU87QUFDVjNJLHdCQUFVLFVBREE7QUFFVm5QLG9CQUFNLEVBRkk7QUFHVmdRLHFCQUFPLENBSEc7QUFJVitFLDBCQUFZLGVBQWUseUJBQVF3QyxTQUp6QjtBQUtWeEg7QUFMVSxhQUFaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxZQUZKO0FBVUU7QUFBQTtBQUFBO0FBQ0UscUJBQU87QUFDTFosMEJBQVUsVUFETDtBQUVMblAsc0JBQU0sR0FGRDtBQUdMZ1EsdUJBQU8sRUFIRjtBQUlMRCx3QkFBUTtBQUpILGVBRFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBT0U7QUFBQTtBQUFBLGdCQUFNLFdBQVUsVUFBaEIsRUFBMkIsT0FBTyxFQUFFaFEsS0FBSyxDQUFDLENBQVIsRUFBV0MsTUFBTSxDQUFDLENBQWxCLEVBQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF5RDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUF6RDtBQVBGLFdBVkY7QUFtQkU7QUFBQTtBQUFBO0FBQ0UseUJBQVUsc0NBRFo7QUFFRSxxQkFBTztBQUNMK1QsdUJBQU8sQ0FERjtBQUVML0QsdUJBQU8sS0FBSzFYLEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsRUFGL0I7QUFHTGlkLHdCQUFRLFNBSEg7QUFJTGtHLDJCQUFXLE9BSk47QUFLTDlHLDBCQUFVLFVBTEw7QUFNTDJFLDRCQUFZO0FBTlAsZUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFVRTtBQUFBO0FBQUEsZ0JBQU0sT0FBTztBQUNYa0UsaUNBQWUsV0FESjtBQUVYbkMsNEJBQVUsRUFGQztBQUdYdEMseUJBQU8seUJBQVFmO0FBSEosaUJBQWI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0duRjtBQUxIO0FBVkY7QUFuQkYsU0EvQkY7QUFxRUU7QUFBQTtBQUFBLFlBQUssV0FBVSw4QkFBZjtBQUNFLG1CQUFPO0FBQ0w4Qix3QkFBVSxVQURMO0FBRUxuUCxvQkFBTSxLQUFLMUgsS0FBTCxDQUFXeEYsZUFBWCxHQUE2QixFQUY5QjtBQUdMa2QscUJBQU8sRUFIRjtBQUlMalEsbUJBQUssQ0FKQTtBQUtMZ1Esc0JBQVEsRUFMSDtBQU1Ma0cseUJBQVc7QUFOTixhQURUO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNFO0FBQ0Usb0JBQVEsSUFEVjtBQUVFLGtCQUFNdlQsSUFGUjtBQUdFLG1CQUFPWixLQUhUO0FBSUUsb0JBQVFpTyxNQUpWO0FBS0UsdUJBQVc5UixTQUxiO0FBTUUsdUJBQVcsS0FBS3RGLFVBTmxCO0FBT0UsNkJBQWlCLEtBQUtMLEtBQUwsQ0FBVzNFLGVBUDlCO0FBUUUsMEJBQWMsS0FBS21jLHNCQUFMLENBQTRCN1IsU0FBNUIsQ0FSaEI7QUFTRSwwQkFBYyxLQUFLM0YsS0FBTCxDQUFXNUUsbUJBVDNCO0FBVUUsdUJBQVcsS0FBSzRFLEtBQUwsQ0FBV3RGLFNBVnhCO0FBV0UsZ0NBQW9CLEtBQUtzRixLQUFMLENBQVd6RCxrQkFYakM7QUFZRSw2QkFBaUJELGVBWm5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVRGLFNBckVGO0FBNEZFO0FBQUE7QUFBQTtBQUNFLHVCQUFVLHdDQURaO0FBRUUsbUJBQU87QUFDTHFiLHdCQUFVLFFBREw7QUFFTGQsd0JBQVUsVUFGTDtBQUdMYSxxQkFBTyxLQUFLMVgsS0FBTCxDQUFXdkYsY0FIYjtBQUlMaU4sb0JBQU0sS0FBSzFILEtBQUwsQ0FBV3hGLGVBQVgsR0FBNkIsQ0FKOUIsRUFJaUM7QUFDdENpTixtQkFBSyxDQUxBO0FBTUxnUSxzQkFBUTtBQU5ILGFBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVUcsZUFBS0csbUNBQUwsQ0FBeUNqUyxTQUF6QyxFQUFvRHZELFdBQXBELEVBQWlFcUQsV0FBakUsRUFBOEUsQ0FBQzJFLElBQUQsQ0FBOUUsRUFBc0Y5TixlQUF0RixFQUF1RyxVQUFDMlosSUFBRCxFQUFPQyxJQUFQLEVBQWF4UixJQUFiLEVBQW1CNFIsWUFBbkIsRUFBaUNDLGFBQWpDLEVBQWdEL00sS0FBaEQsRUFBMEQ7QUFDaEssZ0JBQUlxTyxnQkFBZ0IsRUFBcEI7QUFDQSxnQkFBSTNCLEtBQUtHLEtBQVQsRUFBZ0I7QUFDZHdCLDRCQUFjN1YsSUFBZCxDQUFtQixRQUFLOFYsb0JBQUwsQ0FBMEJuUyxTQUExQixFQUFxQ3ZELFdBQXJDLEVBQWtEcUQsV0FBbEQsRUFBK0R5USxLQUFLL1MsSUFBcEUsRUFBMEU3RyxlQUExRSxFQUEyRjJaLElBQTNGLEVBQWlHQyxJQUFqRyxFQUF1R3hSLElBQXZHLEVBQTZHNFIsWUFBN0csRUFBMkhDLGFBQTNILEVBQTBJLENBQTFJLEVBQTZJLEVBQUV3QixXQUFXLElBQWIsRUFBbUJrQyxtQkFBbUIsSUFBdEMsRUFBN0ksQ0FBbkI7QUFDRCxhQUZELE1BRU87QUFDTCxrQkFBSXZWLElBQUosRUFBVTtBQUNSbVQsOEJBQWM3VixJQUFkLENBQW1CLFFBQUtpVyxrQkFBTCxDQUF3QnRTLFNBQXhCLEVBQW1DdkQsV0FBbkMsRUFBZ0RxRCxXQUFoRCxFQUE2RHlRLEtBQUsvUyxJQUFsRSxFQUF3RTdHLGVBQXhFLEVBQXlGMlosSUFBekYsRUFBK0ZDLElBQS9GLEVBQXFHeFIsSUFBckcsRUFBMkc0UixZQUEzRyxFQUF5SEMsYUFBekgsRUFBd0ksQ0FBeEksRUFBMkksRUFBRXdCLFdBQVcsSUFBYixFQUFtQmtDLG1CQUFtQixJQUF0QyxFQUEzSSxDQUFuQjtBQUNEO0FBQ0Qsa0JBQUksQ0FBQ2hFLElBQUQsSUFBUyxDQUFDQSxLQUFLSSxLQUFuQixFQUEwQjtBQUN4QndCLDhCQUFjN1YsSUFBZCxDQUFtQixRQUFLa1csa0JBQUwsQ0FBd0J2UyxTQUF4QixFQUFtQ3ZELFdBQW5DLEVBQWdEcUQsV0FBaEQsRUFBNkR5USxLQUFLL1MsSUFBbEUsRUFBd0U3RyxlQUF4RSxFQUF5RjJaLElBQXpGLEVBQStGQyxJQUEvRixFQUFxR3hSLElBQXJHLEVBQTJHNFIsWUFBM0csRUFBeUhDLGFBQXpILEVBQXdJLENBQXhJLEVBQTJJLEVBQUV3QixXQUFXLElBQWIsRUFBbUJrQyxtQkFBbUIsSUFBdEMsRUFBM0ksQ0FBbkI7QUFDRDtBQUNGO0FBQ0QsbUJBQU9wQyxhQUFQO0FBQ0QsV0FiQTtBQVZIO0FBNUZGLE9BREY7QUF3SEQ7O0FBRUQ7Ozs7d0NBQ3FCNUMsSyxFQUFPO0FBQUE7O0FBQzFCLFVBQUksQ0FBQyxLQUFLalYsS0FBTCxDQUFXbUIsUUFBaEIsRUFBMEIsT0FBTztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQUFQOztBQUUxQixhQUNFO0FBQUE7QUFBQTtBQUNFLHFCQUFVLG1CQURaO0FBRUUsaUJBQU8saUJBQU9sQixNQUFQLENBQWMsRUFBZCxFQUFrQjtBQUN2QjRXLHNCQUFVO0FBRGEsV0FBbEIsQ0FGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLRzVCLGNBQU03QixHQUFOLENBQVUsVUFBQ2hKLElBQUQsRUFBT1osS0FBUCxFQUFpQjtBQUMxQixjQUFNZ1csMEJBQTBCcFYsS0FBS3NHLFFBQUwsQ0FBYzlRLE1BQWQsR0FBdUIsQ0FBdkIsSUFBNEJ3SyxLQUFLWixLQUFMLEtBQWVZLEtBQUtzRyxRQUFMLENBQWM5USxNQUFkLEdBQXVCLENBQWxHO0FBQ0EsY0FBSXdLLEtBQUs0SyxTQUFULEVBQW9CO0FBQ2xCLG1CQUFPLFFBQUs2SyxnQkFBTCxDQUFzQnpWLElBQXRCLEVBQTRCWixLQUE1QixFQUFtQyxRQUFLeEosS0FBTCxDQUFXdEYsU0FBOUMsRUFBeUR1YSxLQUF6RCxFQUFnRXVLLHVCQUFoRSxDQUFQO0FBQ0QsV0FGRCxNQUVPLElBQUlwVixLQUFLVixVQUFULEVBQXFCO0FBQzFCLG1CQUFPLFFBQUtvVyxpQkFBTCxDQUF1QjFWLElBQXZCLEVBQTZCWixLQUE3QixFQUFvQyxRQUFLeEosS0FBTCxDQUFXdEYsU0FBL0MsRUFBMER1YSxLQUExRCxFQUFpRXVLLHVCQUFqRSxDQUFQO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsbUJBQU8sUUFBS08seUJBQUwsQ0FBK0IzVixJQUEvQixFQUFxQ1osS0FBckMsRUFBNEMsUUFBS3hKLEtBQUwsQ0FBV3RGLFNBQXZELEVBQWtFdWEsS0FBbEUsQ0FBUDtBQUNEO0FBQ0YsU0FUQTtBQUxILE9BREY7QUFrQkQ7Ozs2QkFFUztBQUFBOztBQUNSLFdBQUtqVixLQUFMLENBQVdvSixpQkFBWCxHQUErQixLQUFLNFcsb0JBQUwsRUFBL0I7QUFDQSxhQUNFO0FBQUE7QUFBQTtBQUNFLGVBQUksV0FETjtBQUVFLGNBQUcsVUFGTDtBQUdFLHFCQUFVLFdBSFo7QUFJRSxpQkFBTztBQUNMbkosc0JBQVUsVUFETDtBQUVMd0UsNkJBQWlCLHlCQUFRSCxJQUZwQjtBQUdMRCxtQkFBTyx5QkFBUWIsSUFIVjtBQUlMM1MsaUJBQUssQ0FKQTtBQUtMQyxrQkFBTSxDQUxEO0FBTUwrUCxvQkFBUSxtQkFOSDtBQU9MQyxtQkFBTyxNQVBGO0FBUUx1SSx1QkFBVyxRQVJOO0FBU0xDLHVCQUFXO0FBVE4sV0FKVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFlRyxhQUFLbGdCLEtBQUwsQ0FBV3BFLG9CQUFYLElBQ0Msd0NBQU0sV0FBVSxXQUFoQixFQUE0QixPQUFPO0FBQ2pDaWIsc0JBQVUsVUFEdUI7QUFFakNZLG9CQUFRLE1BRnlCO0FBR2pDQyxtQkFBTyxDQUgwQjtBQUlqQ2hRLGtCQUFNLEdBSjJCO0FBS2pDaVMsb0JBQVEsSUFMeUI7QUFNakNsUyxpQkFBSyxDQU40QjtBQU9qQ3FWLHVCQUFXO0FBUHNCLFdBQW5DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQWhCSjtBQTBCRyxhQUFLcUQsaUJBQUwsRUExQkg7QUEyQkU7QUFBQTtBQUFBO0FBQ0UsaUJBQUksWUFETjtBQUVFLGdCQUFHLGVBRkw7QUFHRSxtQkFBTztBQUNMdEosd0JBQVUsVUFETDtBQUVMcFAsbUJBQUssRUFGQTtBQUdMQyxvQkFBTSxDQUhEO0FBSUxnUSxxQkFBTyxNQUpGO0FBS0x3RSw2QkFBZSxLQUFLbGMsS0FBTCxDQUFXckUsMEJBQVgsR0FBd0MsTUFBeEMsR0FBaUQsTUFMM0Q7QUFNTHdmLGdDQUFrQixLQUFLbmIsS0FBTCxDQUFXckUsMEJBQVgsR0FBd0MsTUFBeEMsR0FBaUQsTUFOOUQ7QUFPTG1qQixzQkFBUSxDQVBIO0FBUUxtQix5QkFBVyxNQVJOO0FBU0xDLHlCQUFXO0FBVE4sYUFIVDtBQWNFLHlCQUFhLHVCQUFNO0FBQ2pCLHNCQUFLdGUsUUFBTCxDQUFjLEVBQUN4RixtQkFBbUIsRUFBcEIsRUFBd0JDLGtCQUFrQixFQUExQyxFQUFkO0FBQ0QsYUFoQkg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBaUJHLGVBQUsrakIsbUJBQUwsQ0FBeUIsS0FBS3BnQixLQUFMLENBQVdvSixpQkFBcEM7QUFqQkgsU0EzQkY7QUE4Q0csYUFBS2lYLG9CQUFMLEVBOUNIO0FBK0NFO0FBQ0UsZUFBSSxpQkFETjtBQUVFLHVCQUFhLElBRmY7QUFHRSx5QkFBZSxLQUFLcmdCLEtBQUwsQ0FBVy9ELGFBSDVCO0FBSUUsd0JBQWMsS0FBSytELEtBQUwsQ0FBVzlELFlBSjNCO0FBS0UseUJBQWUsdUJBQUNva0IsY0FBRCxFQUFvQjtBQUNqQzljLG9CQUFRQyxJQUFSLENBQWEsMEJBQWIsRUFBeUM4YyxLQUFLQyxTQUFMLENBQWVGLGNBQWYsQ0FBekM7O0FBRUEsb0JBQUtwYSxtQ0FBTCxDQUNFLHFDQUFtQixRQUFLbEcsS0FBTCxDQUFXOUQsWUFBOUIsQ0FERixFQUVFLFFBQUs4RCxLQUFMLENBQVc1RSxtQkFGYixFQUdFLFFBQUs0RSxLQUFMLENBQVc5RCxZQUFYLENBQXdCc0QsSUFBeEIsQ0FBNkJpRyxXQUgvQixFQUlFLHNDQUFvQixRQUFLekYsS0FBTCxDQUFXOUQsWUFBL0IsQ0FKRixFQUtFLFFBQUtzYixzQkFBTCxDQUE0QixRQUFLNVIsWUFBTCxFQUE1QixDQUxGLEVBTUUwYSxjQU5GLEVBT0UsS0FBTSxDQVBSLEVBT1k7QUFDVixpQkFBTSxDQVJSLEVBUVk7QUFDVixpQkFBTSxDQVRSLENBU1c7QUFUWDtBQVdELFdBbkJIO0FBb0JFLDRCQUFrQiw0QkFBTTtBQUN0QixvQkFBSzFlLFFBQUwsQ0FBYztBQUNaMUYsNEJBQWMsUUFBSzhELEtBQUwsQ0FBVy9EO0FBRGIsYUFBZDtBQUdELFdBeEJIO0FBeUJFLCtCQUFxQiw2QkFBQ3drQixNQUFELEVBQVNDLE9BQVQsRUFBcUI7QUFDeEMsZ0JBQUl0VyxPQUFPLFFBQUtwSyxLQUFMLENBQVcvRCxhQUF0QjtBQUNBLGdCQUFJeUksT0FBTywrQkFBYTBGLElBQWIsRUFBbUJxVyxNQUFuQixDQUFYO0FBQ0EsZ0JBQUkvYixJQUFKLEVBQVU7QUFDUixzQkFBSzlDLFFBQUwsQ0FBYztBQUNaMUYsOEJBQWV3a0IsT0FBRCxHQUFZaGMsSUFBWixHQUFtQixJQURyQjtBQUVaekksK0JBQWV5STtBQUZILGVBQWQ7QUFJRDtBQUNGLFdBbENIO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQS9DRixPQURGO0FBcUZEOzs7O0VBdnNGb0IsZ0JBQU1pYyxTOztBQTBzRjdCLFNBQVMzTSwyQkFBVCxDQUFzQ3hVLElBQXRDLEVBQTRDO0FBQzFDLE1BQUlvaEIsZUFBZTNNLHNCQUFzQixLQUF0QixDQUFuQixDQUQwQyxDQUNNO0FBQ2hELE9BQUssSUFBSTlRLElBQVQsSUFBaUIzRCxLQUFLaUcsV0FBTCxDQUFpQm9iLE1BQWxDLEVBQTBDO0FBQ3hDLFFBQUk3Z0IsUUFBUVIsS0FBS2lHLFdBQUwsQ0FBaUJvYixNQUFqQixDQUF3QjFkLElBQXhCLENBQVo7O0FBRUF5ZCxpQkFBYTVlLElBQWIsQ0FBa0I7QUFDaEJtQixZQUFNQSxJQURVO0FBRWhCb1IsY0FBUXBSLElBRlE7QUFHaEIyZCxjQUFROUssU0FIUTtBQUloQitLLGdCQUFVL2dCLE1BQU1vVyxLQUpBO0FBS2hCNEssZUFBU2hoQixNQUFNb0Y7QUFMQyxLQUFsQjtBQU9EO0FBQ0QsU0FBT3diLFlBQVA7QUFDRDs7QUFFRCxTQUFTM00scUJBQVQsQ0FBZ0N4TyxXQUFoQyxFQUE2Q2dMLE9BQTdDLEVBQXNEO0FBQ3BELE1BQUltUSxlQUFlLEVBQW5COztBQUVBLE1BQU1LLFlBQVksaUJBQVV4YixXQUFWLENBQWxCO0FBQ0EsTUFBTXliLGVBQWUsb0JBQWF6YixXQUFiLENBQXJCOztBQUVBLE1BQUl3YixTQUFKLEVBQWU7QUFDYixTQUFLLElBQUk1ZSxZQUFULElBQXlCNGUsU0FBekIsRUFBb0M7QUFDbEMsVUFBSUUsZ0JBQWdCLElBQXBCOztBQUVBLFVBQUkxUSxZQUFZLEdBQWhCLEVBQXFCO0FBQUU7QUFDckIsWUFBSTlSLHdCQUF3QjBELFlBQXhCLENBQUosRUFBMkM7QUFDekMsY0FBSStlLFlBQVkvZSxhQUFha1IsS0FBYixDQUFtQixHQUFuQixDQUFoQjs7QUFFQSxjQUFJbFIsaUJBQWlCLGlCQUFyQixFQUF3QytlLFlBQVksQ0FBQyxVQUFELEVBQWEsR0FBYixDQUFaO0FBQ3hDLGNBQUkvZSxpQkFBaUIsaUJBQXJCLEVBQXdDK2UsWUFBWSxDQUFDLFVBQUQsRUFBYSxHQUFiLENBQVo7O0FBRXhDRCwwQkFBZ0I7QUFDZGhlLGtCQUFNZCxZQURRO0FBRWRrUyxvQkFBUTZNLFVBQVUsQ0FBVixDQUZNO0FBR2ROLG9CQUFRTSxVQUFVLENBQVYsQ0FITTtBQUlkTCxzQkFBVUcsYUFBYTdlLFlBQWIsQ0FKSTtBQUtkMmUscUJBQVNDLFVBQVU1ZSxZQUFWO0FBTEssV0FBaEI7QUFPRDtBQUNGLE9BZkQsTUFlTztBQUNMLFlBQUk3RCxjQUFjNkQsWUFBZCxDQUFKLEVBQWlDO0FBQy9CLGNBQUkrZSxhQUFZL2UsYUFBYWtSLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBaEI7QUFDQTROLDBCQUFnQjtBQUNkaGUsa0JBQU1kLFlBRFE7QUFFZGtTLG9CQUFRNk0sV0FBVSxDQUFWLENBRk07QUFHZE4sb0JBQVFNLFdBQVUsQ0FBVixDQUhNO0FBSWRMLHNCQUFVRyxhQUFhN2UsWUFBYixDQUpJO0FBS2QyZSxxQkFBU0MsVUFBVTVlLFlBQVY7QUFMSyxXQUFoQjtBQU9EO0FBQ0Y7O0FBRUQsVUFBSThlLGFBQUosRUFBbUI7QUFDakIsWUFBSTdNLGdCQUFnQjdWLGdCQUFnQjBpQixjQUFjaGUsSUFBOUIsQ0FBcEI7QUFDQSxZQUFJbVIsYUFBSixFQUFtQjtBQUNqQjZNLHdCQUFjOU0sT0FBZCxHQUF3QjtBQUN0QkUsb0JBQVFELGFBRGM7QUFFdEJuUixrQkFBTXpFLGNBQWM0VixhQUFkO0FBRmdCLFdBQXhCO0FBSUQ7O0FBRURzTSxxQkFBYTVlLElBQWIsQ0FBa0JtZixhQUFsQjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPUCxZQUFQO0FBQ0Q7O2tCQUVjOWdCLFEiLCJmaWxlIjoiVGltZWxpbmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBhcmNoeSBmcm9tICdhcmNoeSdcbmltcG9ydCB7IERyYWdnYWJsZUNvcmUgfSBmcm9tICdyZWFjdC1kcmFnZ2FibGUnXG5cbmltcG9ydCBET01TY2hlbWEgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcHJvcGVydGllcy9kb20vc2NoZW1hJ1xuaW1wb3J0IERPTUZhbGxiYWNrcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MnXG5pbXBvcnQgZXhwcmVzc2lvblRvUk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9leHByZXNzaW9uVG9STydcblxuaW1wb3J0IFRpbWVsaW5lUHJvcGVydHkgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL1RpbWVsaW5lUHJvcGVydHknXG5pbXBvcnQgQnl0ZWNvZGVBY3Rpb25zIGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9hY3Rpb25zJ1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5cbmltcG9ydCB7XG4gIG5leHRQcm9wSXRlbSxcbiAgZ2V0SXRlbUNvbXBvbmVudElkLFxuICBnZXRJdGVtUHJvcGVydHlOYW1lXG59IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcblxuaW1wb3J0IGdldE1heGltdW1NcyBmcm9tICcuL2hlbHBlcnMvZ2V0TWF4aW11bU1zJ1xuaW1wb3J0IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUgZnJvbSAnLi9oZWxwZXJzL21pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUnXG5pbXBvcnQgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzIGZyb20gJy4vaGVscGVycy9jbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMnXG5pbXBvcnQgaHVtYW5pemVQcm9wZXJ0eU5hbWUgZnJvbSAnLi9oZWxwZXJzL2h1bWFuaXplUHJvcGVydHlOYW1lJ1xuaW1wb3J0IGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIGZyb20gJy4vaGVscGVycy9nZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcidcbmltcG9ydCBnZXRNaWxsaXNlY29uZE1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldE1pbGxpc2Vjb25kTW9kdWx1cydcbmltcG9ydCBnZXRGcmFtZU1vZHVsdXMgZnJvbSAnLi9oZWxwZXJzL2dldEZyYW1lTW9kdWx1cydcbmltcG9ydCBmb3JtYXRTZWNvbmRzIGZyb20gJy4vaGVscGVycy9mb3JtYXRTZWNvbmRzJ1xuaW1wb3J0IHJvdW5kVXAgZnJvbSAnLi9oZWxwZXJzL3JvdW5kVXAnXG5cbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEtleWZyYW1lU1ZHIGZyb20gJy4vaWNvbnMvS2V5ZnJhbWVTVkcnXG5cbmltcG9ydCB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbk91dEJhY2tTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlSW5Cb3VuY2VTVkcsXG4gIEVhc2VJbk91dEJvdW5jZVNWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJbk91dEV4cG9TVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlT3V0Q3ViaWNTVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJbk91dFF1YWRTVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlSW5RdWFydFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWFydFNWRyxcbiAgRWFzZUluUXVpbnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VJblNpbmVTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn0gZnJvbSAnLi9pY29ucy9DdXJ2ZVNWR1MnXG5cbmltcG9ydCBEb3duQ2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvRG93bkNhcnJvdFNWRydcbmltcG9ydCBSaWdodENhcnJvdFNWRyBmcm9tICcuL2ljb25zL1JpZ2h0Q2Fycm90U1ZHJ1xuaW1wb3J0IENvbnRyb2xzQXJlYSBmcm9tICcuL0NvbnRyb2xzQXJlYSdcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL0NvbnRleHRNZW51J1xuaW1wb3J0IEV4cHJlc3Npb25JbnB1dCBmcm9tICcuL0V4cHJlc3Npb25JbnB1dCdcbmltcG9ydCBDbHVzdGVySW5wdXRGaWVsZCBmcm9tICcuL0NsdXN0ZXJJbnB1dEZpZWxkJ1xuaW1wb3J0IFByb3BlcnR5SW5wdXRGaWVsZCBmcm9tICcuL1Byb3BlcnR5SW5wdXRGaWVsZCdcblxuLyogei1pbmRleCBndWlkZVxuICBrZXlmcmFtZTogMTAwMlxuICB0cmFuc2l0aW9uIGJvZHk6IDEwMDJcbiAga2V5ZnJhbWUgZHJhZ2dlcnM6IDEwMDNcbiAgaW5wdXRzOiAxMDA0LCAoMTAwNSBhY3RpdmUpXG4gIHRyaW0tYXJlYSAxMDA2XG4gIHNjcnViYmVyOiAxMDA2XG4gIGJvdHRvbSBjb250cm9sczogMTAwMDAgPC0ga2EtYm9vbSFcbiovXG5cbnZhciBlbGVjdHJvbiA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbnZhciB3ZWJGcmFtZSA9IGVsZWN0cm9uLndlYkZyYW1lXG5pZiAod2ViRnJhbWUpIHtcbiAgaWYgKHdlYkZyYW1lLnNldFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKDEsIDEpXG4gIGlmICh3ZWJGcmFtZS5zZXRMYXlvdXRab29tTGV2ZWxMaW1pdHMpIHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cygwLCAwKVxufVxuXG5jb25zdCBERUZBVUxUUyA9IHtcbiAgcHJvcGVydGllc1dpZHRoOiAzMDAsXG4gIHRpbWVsaW5lc1dpZHRoOiA4NzAsXG4gIHJvd0hlaWdodDogMjUsXG4gIGlucHV0Q2VsbFdpZHRoOiA3NSxcbiAgbWV0ZXJIZWlnaHQ6IDI1LFxuICBjb250cm9sc0hlaWdodDogNDIsXG4gIHZpc2libGVGcmFtZVJhbmdlOiBbMCwgNjBdLFxuICBjdXJyZW50RnJhbWU6IDAsXG4gIG1heEZyYW1lOiBudWxsLFxuICBkdXJhdGlvblRyaW06IDAsXG4gIGZyYW1lc1BlclNlY29uZDogNjAsXG4gIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcycsIC8vIG9yICdmcmFtZXMnXG4gIGN1cnJlbnRUaW1lbGluZU5hbWU6ICdEZWZhdWx0JyxcbiAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSxcbiAgcGxheWVyUGxheWJhY2tTcGVlZDogMS4wLFxuICBpc1NoaWZ0S2V5RG93bjogZmFsc2UsXG4gIGlzQ29tbWFuZEtleURvd246IGZhbHNlLFxuICBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSxcbiAgaXNBbHRLZXlEb3duOiBmYWxzZSxcbiAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IGZhbHNlLFxuICBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UsXG4gIHNlbGVjdGVkTm9kZXM6IHt9LFxuICBleHBhbmRlZE5vZGVzOiB7fSxcbiAgYWN0aXZhdGVkUm93czoge30sXG4gIGhpZGRlbk5vZGVzOiB7fSxcbiAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnM6IHt9LFxuICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gIHNlbGVjdGVkU2VnbWVudHM6IHt9LFxuICByZWlmaWVkQnl0ZWNvZGU6IG51bGwsXG4gIHNlcmlhbGl6ZWRCeXRlY29kZTogbnVsbFxufVxuXG5jb25zdCBDVVJWRVNWR1MgPSB7XG4gIEVhc2VJbkJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluQ2lyY1NWRyxcbiAgRWFzZUluQ3ViaWNTVkcsXG4gIEVhc2VJbkVsYXN0aWNTVkcsXG4gIEVhc2VJbkV4cG9TVkcsXG4gIEVhc2VJblF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5PdXRDaXJjU1ZHLFxuICBFYXNlSW5PdXRDdWJpY1NWRyxcbiAgRWFzZUluT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhcnRTVkcsXG4gIEVhc2VJbk91dFF1aW50U1ZHLFxuICBFYXNlSW5PdXRTaW5lU1ZHLFxuICBFYXNlT3V0QmFja1NWRyxcbiAgRWFzZU91dEJvdW5jZVNWRyxcbiAgRWFzZU91dENpcmNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZU91dEVsYXN0aWNTVkcsXG4gIEVhc2VPdXRFeHBvU1ZHLFxuICBFYXNlT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRTaW5lU1ZHLFxuICBMaW5lYXJTVkdcbn1cblxuLyoqXG4gKiBIZXkhIElmIHlvdSB3YW50IHRvIEFERCBhbnkgcHJvcGVydGllcyBoZXJlLCB5b3UgbWlnaHQgYWxzbyBuZWVkIHRvIHVwZGF0ZSB0aGUgZGljdGlvbmFyeSBpblxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL3NjaGVtYSxcbiAqIGhhaWt1LWJ5dGVjb2RlL3NyYy9wcm9wZXJ0aWVzL2RvbS9mYWxsYmFja3MsXG4gKiBvciB0aGV5IG1pZ2h0IG5vdCBzaG93IHVwIGluIHRoZSB2aWV3LlxuICovXG5cbmNvbnN0IEFMTE9XRURfUFJPUFMgPSB7XG4gICd0cmFuc2xhdGlvbi54JzogdHJ1ZSxcbiAgJ3RyYW5zbGF0aW9uLnknOiB0cnVlLFxuICAvLyAndHJhbnNsYXRpb24ueic6IHRydWUsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLnonOiB0cnVlLFxuICAncm90YXRpb24ueCc6IHRydWUsXG4gICdyb3RhdGlvbi55JzogdHJ1ZSxcbiAgJ3NjYWxlLngnOiB0cnVlLFxuICAnc2NhbGUueSc6IHRydWUsXG4gICdvcGFjaXR5JzogdHJ1ZSxcbiAgLy8gJ3Nob3duJzogdHJ1ZSxcbiAgJ2JhY2tncm91bmRDb2xvcic6IHRydWVcbiAgLy8gJ2NvbG9yJzogdHJ1ZSxcbiAgLy8gJ2ZpbGwnOiB0cnVlLFxuICAvLyAnc3Ryb2tlJzogdHJ1ZVxufVxuXG5jb25zdCBDTFVTVEVSRURfUFJPUFMgPSB7XG4gICdtb3VudC54JzogJ21vdW50JyxcbiAgJ21vdW50LnknOiAnbW91bnQnLFxuICAnbW91bnQueic6ICdtb3VudCcsXG4gICdhbGlnbi54JzogJ2FsaWduJyxcbiAgJ2FsaWduLnknOiAnYWxpZ24nLFxuICAnYWxpZ24ueic6ICdhbGlnbicsXG4gICdvcmlnaW4ueCc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnknOiAnb3JpZ2luJyxcbiAgJ29yaWdpbi56JzogJ29yaWdpbicsXG4gICd0cmFuc2xhdGlvbi54JzogJ3RyYW5zbGF0aW9uJyxcbiAgJ3RyYW5zbGF0aW9uLnknOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueic6ICd0cmFuc2xhdGlvbicsIC8vIFRoaXMgZG9lc24ndCB3b3JrIGZvciBzb21lIHJlYXNvbiwgc28gbGVhdmluZyBpdCBvdXRcbiAgJ3JvdGF0aW9uLngnOiAncm90YXRpb24nLFxuICAncm90YXRpb24ueSc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi56JzogJ3JvdGF0aW9uJyxcbiAgLy8gJ3JvdGF0aW9uLncnOiAncm90YXRpb24nLCAvLyBQcm9iYWJseSBlYXNpZXN0IG5vdCB0byBsZXQgdGhlIHVzZXIgaGF2ZSBjb250cm9sIG92ZXIgcXVhdGVybmlvbiBtYXRoXG4gICdzY2FsZS54JzogJ3NjYWxlJyxcbiAgJ3NjYWxlLnknOiAnc2NhbGUnLFxuICAnc2NhbGUueic6ICdzY2FsZScsXG4gICdzaXplTW9kZS54JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVNb2RlLnknOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueic6ICdzaXplTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsLngnOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnknOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplUHJvcG9ydGlvbmFsLnonOiAnc2l6ZVByb3BvcnRpb25hbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLngnOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnknOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplRGlmZmVyZW50aWFsLnonOiAnc2l6ZURpZmZlcmVudGlhbCcsXG4gICdzaXplQWJzb2x1dGUueCc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnknOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3NpemVBYnNvbHV0ZS56JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzdHlsZS5vdmVyZmxvd1gnOiAnb3ZlcmZsb3cnLFxuICAnc3R5bGUub3ZlcmZsb3dZJzogJ292ZXJmbG93J1xufVxuXG5jb25zdCBDTFVTVEVSX05BTUVTID0ge1xuICAnbW91bnQnOiAnTW91bnQnLFxuICAnYWxpZ24nOiAnQWxpZ24nLFxuICAnb3JpZ2luJzogJ09yaWdpbicsXG4gICd0cmFuc2xhdGlvbic6ICdQb3NpdGlvbicsXG4gICdyb3RhdGlvbic6ICdSb3RhdGlvbicsXG4gICdzY2FsZSc6ICdTY2FsZScsXG4gICdzaXplTW9kZSc6ICdTaXppbmcgTW9kZScsXG4gICdzaXplUHJvcG9ydGlvbmFsJzogJ1NpemUgJScsXG4gICdzaXplRGlmZmVyZW50aWFsJzogJ1NpemUgKy8tJyxcbiAgJ3NpemVBYnNvbHV0ZSc6ICdTaXplJyxcbiAgJ292ZXJmbG93JzogJ092ZXJmbG93J1xufVxuXG5jb25zdCBBTExPV0VEX1BST1BTX1RPUF9MRVZFTCA9IHtcbiAgJ3NpemVBYnNvbHV0ZS54JzogdHJ1ZSxcbiAgJ3NpemVBYnNvbHV0ZS55JzogdHJ1ZSxcbiAgLy8gRW5hYmxlIHRoZXNlIGFzIHN1Y2ggYSB0aW1lIGFzIHdlIGNhbiByZXByZXNlbnQgdGhlbSB2aXN1YWxseSBpbiB0aGUgZ2xhc3NcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WCc6IHRydWUsXG4gIC8vICdzdHlsZS5vdmVyZmxvd1knOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlXG59XG5cbmNvbnN0IEFMTE9XRURfVEFHTkFNRVMgPSB7XG4gIGRpdjogdHJ1ZSxcbiAgc3ZnOiB0cnVlLFxuICBnOiB0cnVlLFxuICByZWN0OiB0cnVlLFxuICBjaXJjbGU6IHRydWUsXG4gIGVsbGlwc2U6IHRydWUsXG4gIGxpbmU6IHRydWUsXG4gIHBvbHlsaW5lOiB0cnVlLFxuICBwb2x5Z29uOiB0cnVlXG59XG5cbmNvbnN0IFRIUk9UVExFX1RJTUUgPSAxNyAvLyBtc1xuXG5mdW5jdGlvbiB2aXNpdCAobm9kZSwgdmlzaXRvcikge1xuICBpZiAobm9kZS5jaGlsZHJlbikge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gbm9kZS5jaGlsZHJlbltpXVxuICAgICAgaWYgKGNoaWxkICYmIHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdmlzaXRvcihjaGlsZClcbiAgICAgICAgdmlzaXQoY2hpbGQsIHZpc2l0b3IpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFRpbWVsaW5lIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0gbG9kYXNoLmFzc2lnbih7fSwgREVGQVVMVFMpXG4gICAgdGhpcy5jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuZW1pdHRlcnMgPSBbXSAvLyBBcnJheTx7ZXZlbnRFbWl0dGVyOkV2ZW50RW1pdHRlciwgZXZlbnROYW1lOnN0cmluZywgZXZlbnRIYW5kbGVyOkZ1bmN0aW9ufT5cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICd0aW1lbGluZScsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB3ZSBzdG9yZSBhY2N1bXVsYXRlZCBrZXlmcmFtZSBtb3ZlbWVudHMsIHdlIGNhbiBzZW5kIHRoZSB3ZWJzb2NrZXQgdXBkYXRlIGluIGJhdGNoZXM7XG4gICAgLy8gVGhpcyBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgYXZvaWRzIHVubmVjZXNzYXJ5IHVwZGF0ZXMgdG8gdGhlIG92ZXIgdmlld3NcbiAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiA9IGxvZGFzaC50aHJvdHRsZSh0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbi5iaW5kKHRoaXMpLCAyNTApXG4gICAgdGhpcy51cGRhdGVTdGF0ZSA9IHRoaXMudXBkYXRlU3RhdGUuYmluZCh0aGlzKVxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG4gICAgd2luZG93LnRpbWVsaW5lID0gdGhpc1xuICB9XG5cbiAgZmx1c2hVcGRhdGVzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBpZiAoT2JqZWN0LmtleXModGhpcy51cGRhdGVzKS5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy51cGRhdGVzKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZVtrZXldICE9PSB0aGlzLnVwZGF0ZXNba2V5XSkge1xuICAgICAgICB0aGlzLmNoYW5nZXNba2V5XSA9IHRoaXMudXBkYXRlc1trZXldXG4gICAgICB9XG4gICAgfVxuICAgIHZhciBjYnMgPSB0aGlzLmNhbGxiYWNrcy5zcGxpY2UoMClcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMudXBkYXRlcywgKCkgPT4ge1xuICAgICAgdGhpcy5jbGVhckNoYW5nZXMoKVxuICAgICAgY2JzLmZvckVhY2goKGNiKSA9PiBjYigpKVxuICAgIH0pXG4gIH1cblxuICB1cGRhdGVTdGF0ZSAodXBkYXRlcywgY2IpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICB0aGlzLnVwZGF0ZXNba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgIH1cbiAgICBpZiAoY2IpIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzLnB1c2goY2IpXG4gICAgfVxuICAgIHRoaXMuZmx1c2hVcGRhdGVzKClcbiAgfVxuXG4gIGNsZWFyQ2hhbmdlcyAoKSB7XG4gICAgZm9yIChjb25zdCBrMSBpbiB0aGlzLnVwZGF0ZXMpIGRlbGV0ZSB0aGlzLnVwZGF0ZXNbazFdXG4gICAgZm9yIChjb25zdCBrMiBpbiB0aGlzLmNoYW5nZXMpIGRlbGV0ZSB0aGlzLmNoYW5nZXNbazJdXG4gIH1cblxuICB1cGRhdGVUaW1lIChjdXJyZW50RnJhbWUpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudEZyYW1lIH0pXG4gIH1cblxuICBzZXRSb3dDYWNoZUFjdGl2YXRpb24gKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KSB7XG4gICAgdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uID0geyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH1cbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICB1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSBudWxsXG4gICAgcmV0dXJuIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvblxuICB9XG5cbiAgLypcbiAgICogbGlmZWN5Y2xlL2V2ZW50c1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgLy8gQ2xlYW4gdXAgc3Vic2NyaXB0aW9ucyB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcyBhbmQgcmVhY3Qgd2FybmluZ3NcbiAgICB0aGlzLmVtaXR0ZXJzLmZvckVhY2goKHR1cGxlKSA9PiB7XG4gICAgICB0dXBsZVswXS5yZW1vdmVMaXN0ZW5lcih0dXBsZVsxXSwgdHVwbGVbMl0pXG4gICAgfSlcbiAgICB0aGlzLnN0YXRlLmRpZE1vdW50ID0gZmFsc2VcblxuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuXG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2JlZ2luJyk7XG4gICAgLy8gU2Nyb2xsLkV2ZW50cy5zY3JvbGxFdmVudC5yZW1vdmUoJ2VuZCcpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZGlkTW91bnQ6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0aW1lbGluZXNXaWR0aDogZG9jdW1lbnQuYm9keS5jbGllbnRXaWR0aCAtIHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuZGlkTW91bnQpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggfSlcbiAgICAgIH1cbiAgICB9LCBUSFJPVFRMRV9USU1FKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMucHJvcHMud2Vic29ja2V0LCAnYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIGlmIChtZXNzYWdlLmZvbGRlciAhPT0gdGhpcy5wcm9wcy5mb2xkZXIpIHJldHVybiB2b2lkICgwKVxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6IHJldHVybiB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGFjdGlvbiByZWNlaXZlZCcsIG1ldGhvZCwgcGFyYW1zKVxuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsIChtYXliZUNvbXBvbmVudElkcywgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lLCBtYXliZVByb3BlcnR5TmFtZXMsIG1heWJlTWV0YWRhdGEpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBjb21wb25lbnQgdXBkYXRlZCcsIG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSlcblxuICAgICAgLy8gSWYgd2UgZG9uJ3QgY2xlYXIgY2FjaGVzIHRoZW4gdGhlIHRpbWVsaW5lIGZpZWxkcyBtaWdodCBub3QgdXBkYXRlIHJpZ2h0IGFmdGVyIGtleWZyYW1lIGRlbGV0aW9uc1xuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG5cbiAgICAgIHZhciByZWlmaWVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0UmVpZmllZEJ5dGVjb2RlKClcbiAgICAgIHZhciBzZXJpYWxpemVkQnl0ZWNvZGUgPSB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuXG4gICAgICBpZiAobWF5YmVNZXRhZGF0YSAmJiBtYXliZU1ldGFkYXRhLmZyb20gIT09ICd0aW1lbGluZScpIHtcbiAgICAgICAgaWYgKG1heWJlQ29tcG9uZW50SWRzICYmIG1heWJlVGltZWxpbmVOYW1lICYmIG1heWJlUHJvcGVydHlOYW1lcykge1xuICAgICAgICAgIG1heWJlQ29tcG9uZW50SWRzLmZvckVhY2goKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICAgICAgICB0aGlzLm1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUoY29tcG9uZW50SWQsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSB8fCAwLCBtYXliZVByb3BlcnR5TmFtZXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBlbGVtZW50IHNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgdW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5taW5pb25VbnNlbGVjdEVsZW1lbnQoeyBjb21wb25lbnRJZCB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCBtb3VudGVkJywgcmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5yZWh5ZHJhdGVCeXRlY29kZShyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgICAgIC8vIHRoaXMudXBkYXRlVGltZSh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSlcbiAgICB9KVxuXG4gICAgLy8gY29tcG9uZW50Om1vdW50ZWQgZmlyZXMgd2hlbiB0aGlzIGZpbmlzaGVzIHdpdGhvdXQgZXJyb3JcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbigpXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIGNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgY2xpZW50Lm5leHQoKVxuICAgICAgfSlcblxuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgfSlcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSBoZWFyZCcpXG4gICAgICBsZXQgdGFnbmFtZSA9IHBhc3RlRXZlbnQudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgbGV0IGVkaXRhYmxlID0gcGFzdGVFdmVudC50YXJnZXQuZ2V0QXR0cmlidXRlKCdjb250ZW50ZWRpdGFibGUnKSAvLyBPdXIgaW5wdXQgZmllbGRzIGFyZSA8c3Bhbj5zXG4gICAgICBpZiAodGFnbmFtZSA9PT0gJ2lucHV0JyB8fCB0YWduYW1lID09PSAndGV4dGFyZWEnIHx8IGVkaXRhYmxlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnW3RpbWVsaW5lXSBwYXN0ZSB2aWEgZGVmYXVsdCcpXG4gICAgICAgIC8vIFRoaXMgaXMgcHJvYmFibHkgYSBwcm9wZXJ0eSBpbnB1dCwgc28gbGV0IHRoZSBkZWZhdWx0IGFjdGlvbiBoYXBwZW5cbiAgICAgICAgLy8gVE9ETzogTWFrZSB0aGlzIGNoZWNrIGxlc3MgYnJpdHRsZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGRlbGVnYXRlZCB0byBwbHVtYmluZycpXG4gICAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy5oYW5kbGVLZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKVxuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5VXAuYmluZCh0aGlzKSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NyZWF0ZUtleWZyYW1lJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcy8qIHZhbHVlLCBjdXJ2ZSwgZW5kbXMsIGVuZHZhbHVlICovKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnc3BsaXRTZWdtZW50JywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB2YXIgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShzdGFydE1zLCBmcmFtZUluZm8ubXNwZilcbiAgICAgIHZhciBmaW5hbE1zID0gTWF0aC5yb3VuZChuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uU3BsaXRTZWdtZW50KGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGZpbmFsTXMpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdqb2luS2V5ZnJhbWVzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgIGlmICh0aGlzLnRvdXJDbGllbnQpIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICAgIHRoaXMuY2hhbmdlTXVsdGlwbGVTZWdtZW50Q3VydmVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnZGVsZXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zKSA9PiB7XG4gICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkRlbGV0ZUtleWZyYW1lKHtjb21wb25lbnRJZDoge2NvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUsIG1zOiBzdGFydE1zfX0sIHRpbWVsaW5lTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2NoYW5nZVNlZ21lbnRDdXJ2ZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VNdWx0aXBsZVNlZ21lbnRDdXJ2ZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdtb3ZlU2VnbWVudEVuZHBvaW50cycsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uTW92ZVNlZ21lbnRFbmRwb2ludHMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOnRpY2snLCAoY3VycmVudEZyYW1lKSA9PiB7XG4gICAgICB2YXIgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgdGhpcy51cGRhdGVUaW1lKGN1cnJlbnRGcmFtZSlcbiAgICAgIC8vIElmIHdlIGdvdCBhIHRpY2ssIHdoaWNoIG9jY3VycyBkdXJpbmcgVGltZWxpbmUgbW9kZWwgdXBkYXRpbmcsIHRoZW4gd2Ugd2FudCB0byBwYXVzZSBpdCBpZiB0aGUgc2NydWJiZXJcbiAgICAgIC8vIGhhcyBhcnJpdmVkIGF0IHRoZSBtYXhpbXVtIGFjY2VwdGlibGUgZnJhbWUgaW4gdGhlIHRpbWVsaW5lLlxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlNYXgpIHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1BsYXllclBsYXlpbmc6IGZhbHNlfSlcbiAgICAgIH1cbiAgICAgIC8vIElmIG91ciBjdXJyZW50IGZyYW1lIGhhcyBnb25lIG91dHNpZGUgb2YgdGhlIGludGVydmFsIHRoYXQgZGVmaW5lcyB0aGUgdGltZWxpbmUgdmlld3BvcnQsIHRoZW5cbiAgICAgIC8vIHRyeSB0byByZS1hbGlnbiB0aGUgdGlja2VyIGluc2lkZSBvZiB0aGF0IHJhbmdlXG4gICAgICBpZiAoY3VycmVudEZyYW1lID49IGZyYW1lSW5mby5mcmlCIHx8IGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICAgIHRoaXMudHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5fY29tcG9uZW50Ll90aW1lbGluZXMsICd0aW1lbGluZS1tb2RlbDphdXRob3JpdGF0aXZlLWZyYW1lLXNldCcsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ3RpbWVsaW5lJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCd0aW1lbGluZScsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAobmF0aXZlRXZlbnQpIHtcbiAgICAvLyBHaXZlIHRoZSBjdXJyZW50bHkgYWN0aXZlIGV4cHJlc3Npb24gaW5wdXQgYSBjaGFuY2UgdG8gY2FwdHVyZSB0aGlzIGV2ZW50IGFuZCBzaG9ydCBjaXJjdWl0IHVzIGlmIHNvXG4gICAgaWYgKHRoaXMucmVmcy5leHByZXNzaW9uSW5wdXQud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KG5hdGl2ZUV2ZW50KSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHVzZXIgaGl0IHRoZSBzcGFjZWJhciBfYW5kXyB3ZSBhcmVuJ3QgaW5zaWRlIGFuIGlucHV0IGZpZWxkLCB0cmVhdCB0aGF0IGxpa2UgYSBwbGF5YmFjayB0cmlnZ2VyXG4gICAgaWYgKG5hdGl2ZUV2ZW50LmtleUNvZGUgPT09IDMyICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dDpmb2N1cycpKSB7XG4gICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICBjYXNlIDM3OiAvLyBsZWZ0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc1NoaWZ0S2V5RG93bikge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbMCwgdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXV0sIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVGltZSgwKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKC0xKVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKC0xKVxuICAgICAgICB9XG5cbiAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzQ29tbWFuZEtleURvd24pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVTY3J1YmJlclBvc2l0aW9uKDEpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93KSB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IHRydWUgfSlcbiAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSgxKVxuICAgICAgICB9XG5cbiAgICAgIC8vIGNhc2UgMzg6IC8vIHVwXG4gICAgICAvLyBjYXNlIDQwOiAvLyBkb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSA4OiAvLyBkZWxldGVcbiAgICAgICAgaWYgKCFsb2Rhc2guaXNFbXB0eSh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzKSkge1xuICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lcywgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lKVxuICAgICAgICB9XG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNTaGlmdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChuYXRpdmVFdmVudCkge1xuICAgIHN3aXRjaCAobmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIC8vIGNhc2UgMjc6IC8vZXNjYXBlXG4gICAgICAvLyBjYXNlIDMyOiAvL3NwYWNlXG4gICAgICAvLyBjYXNlIDM3OiAvL2xlZnRcbiAgICAgIC8vIGNhc2UgMzk6IC8vcmlnaHRcbiAgICAgIC8vIGNhc2UgMzg6IC8vdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vZG93blxuICAgICAgLy8gY2FzZSA0NjogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgODogLy9kZWxldGVcbiAgICAgIC8vIGNhc2UgMTM6IC8vZW50ZXJcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbnRyb2xLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQWx0S2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgdXBkYXRlS2V5Ym9hcmRTdGF0ZSAodXBkYXRlcykge1xuICAgIC8vIElmIHRoZSBpbnB1dCBpcyBmb2N1c2VkLCBkb24ndCBhbGxvdyBrZXlib2FyZCBzdGF0ZSBjaGFuZ2VzIHRvIGNhdXNlIGEgcmUtcmVuZGVyLCBvdGhlcndpc2VcbiAgICAvLyB0aGUgaW5wdXQgZmllbGQgd2lsbCBzd2l0Y2ggYmFjayB0byBpdHMgcHJldmlvdXMgY29udGVudHMgKGUuZy4gd2hlbiBob2xkaW5nIGRvd24gJ3NoaWZ0JylcbiAgICBpZiAoIXRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh1cGRhdGVzKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBrZXkgaW4gdXBkYXRlcykge1xuICAgICAgICB0aGlzLnN0YXRlW2tleV0gPSB1cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhZGRFbWl0dGVyTGlzdGVuZXIgKGV2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXIpIHtcbiAgICB0aGlzLmVtaXR0ZXJzLnB1c2goW2V2ZW50RW1pdHRlciwgZXZlbnROYW1lLCBldmVudEhhbmRsZXJdKVxuICAgIGV2ZW50RW1pdHRlci5vbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcilcbiAgfVxuXG4gIC8qXG4gICAqIHNldHRlcnMvdXBkYXRlcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZGVzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIGxldCBzZWxlY3RlZE5vZGVzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuc2VsZWN0ZWROb2RlcylcbiAgICBzZWxlY3RlZE5vZGVzW25vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXV0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzZWxlY3ROb2RlIChub2RlKSB7XG4gICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSB0cnVlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgc2VsZWN0ZWROb2Rlczogc2VsZWN0ZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgc2Nyb2xsVG9Ub3AgKCkge1xuICAgIGlmICh0aGlzLnJlZnMuc2Nyb2xsdmlldykge1xuICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gMFxuICAgIH1cbiAgfVxuXG4gIHNjcm9sbFRvTm9kZSAobm9kZSkge1xuICAgIHZhciByb3dzRGF0YSA9IHRoaXMuc3RhdGUuY29tcG9uZW50Um93c0RhdGEgfHwgW11cbiAgICB2YXIgZm91bmRJbmRleCA9IG51bGxcbiAgICB2YXIgaW5kZXhDb3VudGVyID0gMFxuICAgIHJvd3NEYXRhLmZvckVhY2goKHJvd0luZm8sIGluZGV4KSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc0hlYWRpbmcpIHtcbiAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgIH0gZWxzZSBpZiAocm93SW5mby5pc1Byb3BlcnR5KSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgIGluZGV4Q291bnRlcisrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChmb3VuZEluZGV4ID09PSBudWxsKSB7XG4gICAgICAgIGlmIChyb3dJbmZvLm5vZGUgJiYgcm93SW5mby5ub2RlID09PSBub2RlKSB7XG4gICAgICAgICAgZm91bmRJbmRleCA9IGluZGV4Q291bnRlclxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgICBpZiAoZm91bmRJbmRleCAhPT0gbnVsbCkge1xuICAgICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICAgIHRoaXMucmVmcy5zY3JvbGx2aWV3LnNjcm9sbFRvcCA9IChmb3VuZEluZGV4ICogdGhpcy5zdGF0ZS5yb3dIZWlnaHQpIC0gdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmaW5kRG9tTm9kZU9mZnNldFkgKGRvbU5vZGUpIHtcbiAgICB2YXIgY3VydG9wID0gMFxuICAgIGlmIChkb21Ob2RlLm9mZnNldFBhcmVudCkge1xuICAgICAgZG8ge1xuICAgICAgICBjdXJ0b3AgKz0gZG9tTm9kZS5vZmZzZXRUb3BcbiAgICAgIH0gd2hpbGUgKGRvbU5vZGUgPSBkb21Ob2RlLm9mZnNldFBhcmVudCkgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIH1cbiAgICByZXR1cm4gY3VydG9wXG4gIH1cblxuICBjb2xsYXBzZU5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgdmlzaXQobm9kZSwgKGNoaWxkKSA9PiB7XG4gICAgICBjaGlsZC5fX2lzRXhwYW5kZWQgPSBmYWxzZVxuICAgICAgY2hpbGQuX19pc1NlbGVjdGVkID0gZmFsc2VcbiAgICB9KVxuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgbGV0IGNvbXBvbmVudElkID0gbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgZXhwYW5kZWROb2Rlc1tjb21wb25lbnRJZF0gPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBleHBhbmROb2RlIChub2RlLCBjb21wb25lbnRJZCkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgIGlmIChub2RlLnBhcmVudCkgdGhpcy5leHBhbmROb2RlKG5vZGUucGFyZW50KSAvLyBJZiB3ZSBhcmUgZXhwYW5kZWQsIG91ciBwYXJlbnQgaGFzIHRvIGJlIHRvb1xuICAgIGxldCBleHBhbmRlZE5vZGVzID0gdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzXG4gICAgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsIC8vIERlc2VsY3QgYW55IHNlbGVjdGVkIGlucHV0XG4gICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgZXhwYW5kZWROb2RlczogZXhwYW5kZWROb2RlcyxcbiAgICAgIHRyZWVVcGRhdGU6IERhdGUubm93KClcbiAgICB9KVxuICB9XG5cbiAgYWN0aXZhdGVSb3cgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV0gPSB0cnVlXG4gICAgfVxuICB9XG5cbiAgZGVhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaXNSb3dBY3RpdmF0ZWQgKHJvdykge1xuICAgIGlmIChyb3cucHJvcGVydHkpIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdXG4gICAgfVxuICB9XG5cbiAgaXNDbHVzdGVyQWN0aXZhdGVkIChpdGVtKSB7XG4gICAgcmV0dXJuIGZhbHNlIC8vIFRPRE9cbiAgfVxuXG4gIHRvZ2dsZVRpbWVEaXNwbGF5TW9kZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnc2Vjb25kcydcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIHRpbWVEaXNwbGF5TW9kZTogJ2ZyYW1lcydcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgY2hhbmdlU2NydWJiZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lQmFzZWxpbmUgPSB0aGlzLnN0YXRlLmZyYW1lQmFzZWxpbmVcbiAgICB2YXIgZHJhZ0RlbHRhID0gZHJhZ1ggLSBkcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVEZWx0YSA9IE1hdGgucm91bmQoZHJhZ0RlbHRhIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IGZyYW1lQmFzZWxpbmUgKyBmcmFtZURlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8IGZyYW1lSW5mby5mcmlBKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGlmIChjdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJpQikgY3VycmVudEZyYW1lID0gZnJhbWVJbmZvLmZyaUJcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBjaGFuZ2VEdXJhdGlvbk1vZGlmaWVyUG9zaXRpb24gKGRyYWdYLCBmcmFtZUluZm8pIHtcbiAgICB2YXIgZHJhZ1N0YXJ0ID0gdGhpcy5zdGF0ZS5kdXJhdGlvbkRyYWdTdGFydFxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICBpZiAoZHJhZ0RlbHRhID4gMCAmJiB0aGlzLnN0YXRlLmR1cmF0aW9uVHJpbSA+PSAwKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIHtcbiAgICAgICAgdmFyIGFkZEludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgIHZhciBjdXJyZW50TWF4ID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4MlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgMjB9KVxuICAgICAgICB9LCAzMDApXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2FkZEludGVydmFsOiBhZGRJbnRlcnZhbH0pXG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtkcmFnSXNBZGRpbmc6IHRydWV9KVxuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmFkZEludGVydmFsKSBjbGVhckludGVydmFsKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpXG4gICAgLy8gRG9uJ3QgbGV0IHVzZXIgZHJhZyBiYWNrIHBhc3QgbGFzdCBmcmFtZTsgYW5kIGRvbid0IGxldCB0aGVtIGRyYWcgbW9yZSB0aGFuIGFuIGVudGlyZSB3aWR0aCBvZiBmcmFtZXNcbiAgICBpZiAoZnJhbWVJbmZvLmZyaUIgKyBmcmFtZURlbHRhIDw9IGZyYW1lSW5mby5mcmlNYXggfHwgLWZyYW1lRGVsdGEgPj0gZnJhbWVJbmZvLmZyaUIgLSBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgZnJhbWVEZWx0YSA9IHRoaXMuc3RhdGUuZHVyYXRpb25UcmltIC8vIFRvZG86IG1ha2UgbW9yZSBwcmVjaXNlIHNvIGl0IHJlbW92ZXMgYXMgbWFueSBmcmFtZXMgYXNcbiAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBjYW4gaW5zdGVhZCBvZiBjb21wbGV0ZWx5IGlnbm9yaW5nIHRoZSBkcmFnXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBkdXJhdGlvblRyaW06IGZyYW1lRGVsdGEsIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsIH0pXG4gIH1cblxuICBjaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSAoeGwsIHhyLCBmcmFtZUluZm8pIHtcbiAgICBsZXQgYWJzTCA9IG51bGxcbiAgICBsZXQgYWJzUiA9IG51bGxcblxuICAgIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgYWJzTCA9IHhsXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgIGFic1IgPSB4clxuICAgIH0gZWxzZSBpZiAodGhpcy5zdGF0ZS5zY3JvbGxlckJvZHlEcmFnU3RhcnQpIHtcbiAgICAgIGNvbnN0IG9mZnNldEwgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJTdGFydCAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvXG4gICAgICBjb25zdCBvZmZzZXRSID0gKHRoaXMuc3RhdGUuc2Nyb2xsYmFyRW5kICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IGRpZmZYID0geGwgLSB0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydFxuICAgICAgYWJzTCA9IG9mZnNldEwgKyBkaWZmWFxuICAgICAgYWJzUiA9IG9mZnNldFIgKyBkaWZmWFxuICAgIH1cblxuICAgIGxldCBmTCA9IChhYnNMICE9PSBudWxsKSA/IE1hdGgucm91bmQoKGFic0wgKiBmcmFtZUluZm8uc2NSYXRpbykgLyBmcmFtZUluZm8ucHhwZikgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdXG4gICAgbGV0IGZSID0gKGFic1IgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzUiAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSBsZWZ0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZkwgPD0gZnJhbWVJbmZvLmZyaTApIHtcbiAgICAgIGZMID0gZnJhbWVJbmZvLmZyaTBcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gLSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAtIGZMKVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFN0b3AgdGhlIHNjcm9sbGVyIGF0IHRoZSByaWdodCBzaWRlIGFuZCBsb2NrIHRoZSBzaXplXG4gICAgaWYgKGZSID49IGZyYW1lSW5mby5mcmlNYXgyKSB7XG4gICAgICBmTCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICAgIGlmICghdGhpcy5zdGF0ZS5zY3JvbGxlclJpZ2h0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyTGVmdERyYWdTdGFydCkge1xuICAgICAgICBmUiA9IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbZkwsIGZSXSB9KVxuICB9XG5cbiAgdXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UgKGRlbHRhKSB7XG4gICAgdmFyIGwgPSB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdICsgZGVsdGFcbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gKyBkZWx0YVxuICAgIGlmIChsID49IDApIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW2wsIHJdIH0pXG4gICAgfVxuICB9XG5cbiAgLy8gd2lsbCBsZWZ0LWFsaWduIHRoZSBjdXJyZW50IHRpbWVsaW5lIHdpbmRvdyAobWFpbnRhaW5pbmcgem9vbSlcbiAgdHJ5VG9MZWZ0QWxpZ25UaWNrZXJJblZpc2libGVGcmFtZVJhbmdlIChmcmFtZUluZm8pIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICB2YXIgciA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV1cbiAgICB2YXIgc3BhbiA9IHIgLSBsXG4gICAgdmFyIG5ld0wgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZVxuICAgIHZhciBuZXdSID0gbmV3TCArIHNwYW5cblxuICAgIGlmIChuZXdSID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgbmV3TCAtPSAobmV3UiAtIGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICBuZXdSID0gZnJhbWVJbmZvLmZyaU1heFxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoeyB2aXNpYmxlRnJhbWVSYW5nZTogW25ld0wsIG5ld1JdIH0pXG4gIH1cblxuICB1cGRhdGVTY3J1YmJlclBvc2l0aW9uIChkZWx0YSkge1xuICAgIHZhciBjdXJyZW50RnJhbWUgPSB0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSArIGRlbHRhXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA8PSAwKSBjdXJyZW50RnJhbWUgPSAwXG4gICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsoY3VycmVudEZyYW1lKVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlS2V5ZnJhbWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSkge1xuICAgIC8vIE5vdGUgdGhhdCBpZiBzdGFydFZhbHVlIGlzIHVuZGVmaW5lZCwgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZXhhbWluZWQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiB0aGUgcHJlc2VudCBvbmVcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdob3N0SW5zdGFuY2UnKSwgdGhpcy5fY29tcG9uZW50LmZldGNoQWN0aXZlQnl0ZWNvZGVGaWxlKCkuZ2V0KCdzdGF0ZXMnKSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vIG5lZWQgdG8gJ2V4cHJlc3Npb25Ub1JPJyBoZXJlIGJlY2F1c2UgaWYgd2UgZ290IGFuIGV4cHJlc3Npb24sIHRoYXQgd291bGQgaGF2ZSBhbHJlYWR5IGJlZW4gcHJvdmlkZWQgaW4gaXRzIHNlcmlhbGl6ZWQgX19mdW5jdGlvbiBmb3JtXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjcmVhdGVLZXlmcmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBzdGFydFZhbHVlLCBtYXliZUN1cnZlLCBlbmRNcywgZW5kVmFsdWVdLCAoKSA9PiB7fSlcblxuICAgIGlmIChlbGVtZW50TmFtZSA9PT0gJ3N2ZycgJiYgcHJvcGVydHlOYW1lID09PSAnb3BhY2l0eScpIHtcbiAgICAgIHRoaXMudG91ckNsaWVudC5uZXh0KClcbiAgICB9XG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpIHtcbiAgICBsb2Rhc2guZWFjaCh0aGlzLnN0YXRlLnNlbGVjdGVkU2VnbWVudHMsIChzKSA9PiB7XG4gICAgICBpZiAocy5oYXNDdXJ2ZSkge1xuICAgICAgICBCeXRlY29kZUFjdGlvbnMuc3BsaXRTZWdtZW50KHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzLmVsZW1lbnROYW1lLCBzLnByb3BlcnR5TmFtZSwgcy5tcylcbiAgICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gICAgICAgICAgc2VsZWN0ZWRTZWdtZW50czoge31cbiAgICAgICAgfSlcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzcGxpdFNlZ21lbnQnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcy5lbGVtZW50TmFtZSwgcy5wcm9wZXJ0eU5hbWUsIHMubXNdLCAoKSA9PiB7fSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUgKGtleWZyYW1lcywgdGltZWxpbmVOYW1lKSB7XG4gICAgbG9kYXNoLmVhY2goa2V5ZnJhbWVzLCAoaykgPT4ge1xuICAgICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZUtleWZyYW1lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBrLmNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGsucHJvcGVydHlOYW1lLCBrLm1zKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLFxuICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2VcbiAgICAgIH0pXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbay5jb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgay5wcm9wZXJ0eU5hbWUsIGsubXNdLCAoKSA9PiB7fSlcbiAgICB9KVxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fX0pXG4gIH1cblxuICBjaGFuZ2VNdWx0aXBsZVNlZ21lbnRDdXJ2ZXMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgbG9kYXNoLmVhY2godGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzLCAocykgPT4ge1xuICAgICAgaWYgKCFzLmhhc0N1cnZlKSB7XG4gICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzLmVsZW1lbnROYW1lLCBzLnByb3BlcnR5TmFtZSwgcy5tcywgcy5lbmRNcywgY3VydmVOYW1lKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcy5wcm9wZXJ0eU5hbWUsIHMubXMsIGN1cnZlTmFtZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmpvaW5LZXlmcmFtZXMoXG4gICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIGNvbXBvbmVudElkLFxuICAgICAgdGltZWxpbmVOYW1lLFxuICAgICAgZWxlbWVudE5hbWUsXG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICBzdGFydE1zLFxuICAgICAgZW5kTXMsXG4gICAgICBjdXJ2ZU5hbWVcbiAgICApXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSxcbiAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgc2VsZWN0ZWRLZXlmcmFtZXM6IHt9LFxuICAgICAgc2VsZWN0ZWRTZWdtZW50czoge31cbiAgICB9KVxuICAgIC8vIEluIHRoZSBmdXR1cmUsIGN1cnZlIG1heSBiZSBhIGZ1bmN0aW9uXG4gICAgbGV0IGN1cnZlRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGN1cnZlTmFtZSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2pvaW5LZXlmcmFtZXMnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlRm9yV2lyZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ2hhbmdlU2VnbWVudEN1cnZlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50Q3VydmUoXG4gICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIGNvbXBvbmVudElkLFxuICAgICAgdGltZWxpbmVOYW1lLFxuICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgc3RhcnRNcyxcbiAgICAgIGN1cnZlTmFtZVxuICAgIClcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gICAgICBzZWxlY3RlZFNlZ21lbnRzOiB7fVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEN1cnZlJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5jaGFuZ2VTZWdtZW50RW5kcG9pbnRzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNcylcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY2hhbmdlU2VnbWVudEVuZHBvaW50cycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIG9sZFN0YXJ0TXMsIG9sZEVuZE1zLCBuZXdTdGFydE1zLCBuZXdFbmRNc10sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUgKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLnJlbmFtZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBvbGRUaW1lbGluZU5hbWUsIG5ld1RpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigncmVuYW1lVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNyZWF0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICAvLyBOb3RlOiBXZSBtYXkgbmVlZCB0byByZW1lbWJlciB0byBzZXJpYWxpemUgYSB0aW1lbGluZSBkZXNjcmlwdG9yIGhlcmVcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkR1cGxpY2F0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuZHVwbGljYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZHVwbGljYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kZWxldGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkZWxldGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBoYW5kbGUsIGtleWZyYW1lSW5kZXgsIHN0YXJ0TXMsIGVuZE1zKSB7XG4gICAgLypcbiAgICBXZSdyZSBnb2luZyB0byB1c2UgdGhlIGNhbGwgZnJvbSB3aGF0J3MgYmVpbmcgZHJhZ2dlZCwgYmVjYXVzZSB0aGF0J3Mgc29tZXRpbWVzIGEgdHJhbnNpdGlvbiBib2R5XG4gICAgcmF0aGVyIHRoYW4gYSBzaW1wbGUga2V5ZnJhbWUuXG5cbiAgICBGcm9tIHRoZXJlIHdlJ3JlIGdvaW5nIHRvIGxlYXJuIGhvdyBmYXIgdG8gbW92ZSBhbGwgb3RoZXIga2V5ZnJhbWVzIGluIHNlbGVjdGVkS2V5ZnJhbWVzOiB7fVxuXG4gICAgQ29uY2VybnM6XG4gICAgICBXaGVuIHdlIG5lZWQgdG8gc3RvcCBvbmUga2V5ZnJhbWUgYmVjYXVzZSBpdCBjYW4ndCBnbyBhbnkgZnVydGhlciwgd2UgbmVlZCB0byBzdG9wIHRoZSBlbnRpcmUgZ3JvdXAgZHJhZy5cblxuICAgIE5vdGVzOlxuICAgICAgV2hlbiBhIHVzZXIgZHJhZ3MgYSBzZWdtZW50IGJvZHkgaXQgaGFzIHRoZSBcImJvZHlcIiBoYW5kbGUuIEl0XG4gICAgKi9cbiAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGNoYW5nZU1zID0gZW5kTXMgLSBzdGFydE1zXG5cbiAgICBsb2Rhc2guZWFjaChzZWxlY3RlZEtleWZyYW1lcywgKGspID0+IHtcbiAgICAgIGNvbnN0IGFkanVzdGVkTXMgPSBwYXJzZUludChrLm1zKSArIGNoYW5nZU1zXG4gICAgICBsZXQga2V5ZnJhbWVNb3ZlcyA9IEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyhcbiAgICAgICAgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgIGsuY29tcG9uZW50SWQsXG4gICAgICAgIHRpbWVsaW5lTmFtZSxcbiAgICAgICAgay5wcm9wZXJ0eU5hbWUsXG4gICAgICAgIGsuaGFuZGxlLCAvLyB0b2RvOiB0YWtlIGEgc2Vjb25kIGxvb2sgYXQgdGhpcyBvbmVcbiAgICAgICAgay5pbmRleCxcbiAgICAgICAgay5tcyxcbiAgICAgICAgYWRqdXN0ZWRNcyxcbiAgICAgICAgZnJhbWVJbmZvXG4gICAgICApXG4gICAgICAvLyBVcGRhdGUgb3VyIHNlbGVjdGVkIGtleWZyYW1lcyBzdGFydCB0aW1lIG5vdyB0aGF0IHdlJ3ZlIG1vdmVkIHRoZW1cbiAgICAgIC8vIE5vdGU6IFRoaXMgc2VlbXMgbGlrZSB0aGVyZSdzIHByb2JhYmx5IGEgbW9yZSBjbGV2ZXIgd2F5IHRvIG1ha2Ugc3VyZSB0aGlzIGdldHNcbiAgICAgIC8vIHVwZGF0ZWQgdmlhIHRoZSBCeXRlY29kZUFjdGlvbnMubW92ZVNlZ21lbnRFbmRwb2ludHMgcGVyaGFwcy5cbiAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2suY29tcG9uZW50SWQgKyAnLScgKyBrLnByb3BlcnR5TmFtZSArICctJyArIGsuaW5kZXhdLm1zID0gT2JqZWN0LmtleXMoa2V5ZnJhbWVNb3Zlcylbay5pbmRleF1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzfSlcblxuICAgICAgLy8gVGhlICdrZXlmcmFtZU1vdmVzJyBpbmRpY2F0ZSBhIGxpc3Qgb2YgY2hhbmdlcyB3ZSBrbm93IG9jY3VycmVkLiBPbmx5IGlmIHNvbWUgb2NjdXJyZWQgZG8gd2UgYm90aGVyIHRvIHVwZGF0ZSB0aGUgb3RoZXIgdmlld3NcbiAgICAgIGlmIChPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJdCdzIHZlcnkgaGVhdnkgdG8gdHJhbnNtaXQgYSB3ZWJzb2NrZXQgbWVzc2FnZSBmb3IgZXZlcnkgc2luZ2xlIG1vdmVtZW50IHdoaWxlIHVwZGF0aW5nIHRoZSB1aSxcbiAgICAgICAgLy8gc28gdGhlIHZhbHVlcyBhcmUgYWNjdW11bGF0ZWQgYW5kIHNlbnQgdmlhIGEgc2luZ2xlIGJhdGNoZWQgdXBkYXRlLlxuICAgICAgICBpZiAoIXRoaXMuX2tleWZyYW1lTW92ZXMpIHRoaXMuX2tleWZyYW1lTW92ZXMgPSB7fVxuICAgICAgICBsZXQgbW92ZW1lbnRLZXkgPSBbY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lXS5qb2luKCctJylcbiAgICAgICAgdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0gPSB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH1cbiAgICAgICAgdGhpcy5kZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24oKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkZWJvdW5jZWRLZXlmcmFtZU1vdmVBY3Rpb24gKCkge1xuICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgcmV0dXJuIHZvaWQgKDApXG4gICAgZm9yIChsZXQgbW92ZW1lbnRLZXkgaW4gdGhpcy5fa2V5ZnJhbWVNb3Zlcykge1xuICAgICAgaWYgKCFtb3ZlbWVudEtleSkgY29udGludWVcbiAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV0pIGNvbnRpbnVlXG4gICAgICBsZXQgeyBjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXMsIGZyYW1lSW5mbyB9ID0gdGhpcy5fa2V5ZnJhbWVNb3Zlc1ttb3ZlbWVudEtleV1cblxuICAgICAgLy8gTWFrZSBzdXJlIGFueSBmdW5jdGlvbnMgZ2V0IGNvbnZlcnRlZCBpbnRvIHRoZWlyIHNlcmlhbCBmb3JtIGJlZm9yZSBwYXNzaW5nIG92ZXIgdGhlIHdpcmVcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzRm9yV2lyZSA9IGV4cHJlc3Npb25Ub1JPKGtleWZyYW1lTW92ZXMpXG5cbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignbW92ZUtleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGtleWZyYW1lTW92ZXNGb3JXaXJlLCBmcmFtZUluZm9dLCAoKSA9PiB7fSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuICAgIH1cbiAgfVxuXG4gIHRvZ2dsZVBsYXliYWNrICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmcpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogZmFsc2VcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnBhdXNlKClcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzUGxheWVyUGxheWluZzogdHJ1ZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGxheSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlaHlkcmF0ZUJ5dGVjb2RlIChyZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSkge1xuICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICAgIGlmIChyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgICAgaWYgKCFpZCkgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgbm9kZS5fX2lzU2VsZWN0ZWQgPSAhIXRoaXMuc3RhdGUuc2VsZWN0ZWROb2Rlc1tpZF1cbiAgICAgICAgICBub2RlLl9faXNFeHBhbmRlZCA9ICEhdGhpcy5zdGF0ZS5leHBhbmRlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0hpZGRlbiA9ICEhdGhpcy5zdGF0ZS5oaWRkZW5Ob2Rlc1tpZF1cbiAgICAgICAgfSlcbiAgICAgICAgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLl9faXNFeHBhbmRlZCA9IHRydWVcbiAgICAgIH1cbiAgICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyhyZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgcmVpZmllZEJ5dGVjb2RlLCBzZXJpYWxpemVkQnl0ZWNvZGUgfSlcbiAgICB9XG4gIH1cblxuICBtaW5pb25TZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIGxldCBmb3VuZCA9IFtdXG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQpID0+IHtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5leHBhbmROb2RlKG5vZGUpXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9Ob2RlKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblVuc2VsZWN0RWxlbWVudCAoeyBjb21wb25lbnRJZCB9KSB7XG4gICAgbGV0IGZvdW5kID0gdGhpcy5maW5kTm9kZXNCeUNvbXBvbmVudElkKGNvbXBvbmVudElkKVxuICAgIGZvdW5kLmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgIHRoaXMuZGVzZWxlY3ROb2RlKG5vZGUpXG4gICAgICB0aGlzLmNvbGxhcHNlTm9kZShub2RlKVxuICAgICAgdGhpcy5zY3JvbGxUb1RvcChub2RlKVxuICAgIH0pXG4gIH1cblxuICBmaW5kTm9kZXNCeUNvbXBvbmVudElkIChjb21wb25lbnRJZCkge1xuICAgIHZhciBmb3VuZCA9IFtdXG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSB7XG4gICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQucHVzaChub2RlKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBtaW5pb25VcGRhdGVQcm9wZXJ0eVZhbHVlIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzdGFydE1zLCBwcm9wZXJ0eU5hbWVzKSB7XG4gICAgbGV0IHJlbGF0ZWRFbGVtZW50ID0gdGhpcy5maW5kRWxlbWVudEluVGVtcGxhdGUoY29tcG9uZW50SWQsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIGxldCBlbGVtZW50TmFtZSA9IHJlbGF0ZWRFbGVtZW50ICYmIHJlbGF0ZWRFbGVtZW50LmVsZW1lbnROYW1lXG4gICAgaWYgKCFlbGVtZW50TmFtZSkge1xuICAgICAgcmV0dXJuIGNvbnNvbGUud2FybignQ29tcG9uZW50ICcgKyBjb21wb25lbnRJZCArICcgbWlzc2luZyBlbGVtZW50LCBhbmQgd2l0aG91dCBhbiBlbGVtZW50IG5hbWUgSSBjYW5ub3QgdXBkYXRlIGEgcHJvcGVydHkgdmFsdWUnKVxuICAgIH1cblxuICAgIHZhciBhbGxSb3dzID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIGFsbFJvd3MuZm9yRWFjaCgocm93SW5mbykgPT4ge1xuICAgICAgaWYgKHJvd0luZm8uaXNQcm9wZXJ0eSAmJiByb3dJbmZvLmNvbXBvbmVudElkID09PSBjb21wb25lbnRJZCAmJiBwcm9wZXJ0eU5hbWVzLmluZGV4T2Yocm93SW5mby5wcm9wZXJ0eS5uYW1lKSAhPT0gLTEpIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZVJvdyhyb3dJbmZvKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9XG4gICAgfSlcblxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIGFjdGl2YXRlZFJvd3M6IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3MpLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICAvKlxuICAgKiBpdGVyYXRvcnMvdmlzaXRvcnNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgZmluZEVsZW1lbnRJblRlbXBsYXRlIChjb21wb25lbnRJZCwgcmVpZmllZEJ5dGVjb2RlKSB7XG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUpIHJldHVybiB2b2lkICgwKVxuICAgIGlmICghcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gdm9pZCAoMClcbiAgICBsZXQgZm91bmRcbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgaWYgKGlkICYmIGlkID09PSBjb21wb25lbnRJZCkgZm91bmQgPSBub2RlXG4gICAgfSlcbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHZpc2l0VGVtcGxhdGUgKGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUsIHBhcmVudCwgaXRlcmF0ZWUpIHtcbiAgICBpdGVyYXRlZSh0ZW1wbGF0ZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MsIHRlbXBsYXRlLmNoaWxkcmVuKVxuICAgIGlmICh0ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZW1wbGF0ZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hpbGQgPSB0ZW1wbGF0ZS5jaGlsZHJlbltpXVxuICAgICAgICBpZiAoIWNoaWxkIHx8IHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIGNvbnRpbnVlXG4gICAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZShsb2NhdG9yICsgJy4nICsgaSwgaSwgdGVtcGxhdGUuY2hpbGRyZW4sIGNoaWxkLCB0ZW1wbGF0ZSwgaXRlcmF0ZWUpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbWFwVmlzaWJsZUZyYW1lcyAoaXRlcmF0ZWUpIHtcbiAgICBjb25zdCBtYXBwZWRPdXRwdXQgPSBbXVxuICAgIGNvbnN0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IHJpZ2h0RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIGNvbnN0IGZyYW1lTW9kdWx1cyA9IGdldEZyYW1lTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBsZXQgaXRlcmF0aW9uSW5kZXggPSAtMVxuICAgIGZvciAobGV0IGkgPSBsZWZ0RnJhbWU7IGkgPCByaWdodEZyYW1lOyBpKyspIHtcbiAgICAgIGl0ZXJhdGlvbkluZGV4KytcbiAgICAgIGxldCBmcmFtZU51bWJlciA9IGlcbiAgICAgIGxldCBwaXhlbE9mZnNldExlZnQgPSBpdGVyYXRpb25JbmRleCAqIGZyYW1lSW5mby5weHBmXG4gICAgICBpZiAocGl4ZWxPZmZzZXRMZWZ0IDw9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgpIHtcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKGZyYW1lTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIGZyYW1lSW5mby5weHBmLCBmcmFtZU1vZHVsdXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIHtcbiAgICAgICAgICBtYXBwZWRPdXRwdXQucHVzaChtYXBPdXRwdXQpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgbWFwVmlzaWJsZVRpbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IG1zTW9kdWx1cyA9IGdldE1pbGxpc2Vjb25kTW9kdWx1cyhmcmFtZUluZm8ucHhwZilcbiAgICBjb25zdCBsZWZ0RnJhbWUgPSBmcmFtZUluZm8uZnJpQVxuICAgIGNvbnN0IGxlZnRNcyA9IGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGZcbiAgICBjb25zdCByaWdodE1zID0gZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHRvdGFsTXMgPSByaWdodE1zIC0gbGVmdE1zXG4gICAgY29uc3QgZmlyc3RNYXJrZXIgPSByb3VuZFVwKGxlZnRNcywgbXNNb2R1bHVzKVxuICAgIGxldCBtc01hcmtlclRtcCA9IGZpcnN0TWFya2VyXG4gICAgY29uc3QgbXNNYXJrZXJzID0gW11cbiAgICB3aGlsZSAobXNNYXJrZXJUbXAgPD0gcmlnaHRNcykge1xuICAgICAgbXNNYXJrZXJzLnB1c2gobXNNYXJrZXJUbXApXG4gICAgICBtc01hcmtlclRtcCArPSBtc01vZHVsdXNcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtc01hcmtlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBtc01hcmtlciA9IG1zTWFya2Vyc1tpXVxuICAgICAgbGV0IG5lYXJlc3RGcmFtZSA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNNYXJrZXIsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgbGV0IG1zUmVtYWluZGVyID0gTWF0aC5mbG9vcihuZWFyZXN0RnJhbWUgKiBmcmFtZUluZm8ubXNwZiAtIG1zTWFya2VyKVxuICAgICAgLy8gVE9ETzogaGFuZGxlIHRoZSBtc1JlbWFpbmRlciBjYXNlIHJhdGhlciB0aGFuIGlnbm9yaW5nIGl0XG4gICAgICBpZiAoIW1zUmVtYWluZGVyKSB7XG4gICAgICAgIGxldCBmcmFtZU9mZnNldCA9IG5lYXJlc3RGcmFtZSAtIGxlZnRGcmFtZVxuICAgICAgICBsZXQgcHhPZmZzZXQgPSBmcmFtZU9mZnNldCAqIGZyYW1lSW5mby5weHBmXG4gICAgICAgIGxldCBtYXBPdXRwdXQgPSBpdGVyYXRlZShtc01hcmtlciwgcHhPZmZzZXQsIHRvdGFsTXMpXG4gICAgICAgIGlmIChtYXBPdXRwdXQpIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZE91dHB1dFxuICB9XG5cbiAgLypcbiAgICogZ2V0dGVycy9jYWxjdWxhdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvKipcbiAgICAvLyBTb3JyeTogVGhlc2Ugc2hvdWxkIGhhdmUgYmVlbiBnaXZlbiBodW1hbi1yZWFkYWJsZSBuYW1lc1xuICAgIDxHQVVHRT5cbiAgICAgICAgICAgIDwtLS0tZnJpVy0tLT5cbiAgICBmcmkwICAgIGZyaUEgICAgICAgIGZyaUIgICAgICAgIGZyaU1heCAgICAgICAgICAgICAgICAgICAgICAgICAgZnJpTWF4MlxuICAgIHwgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gICAgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHxcbiAgICAgICAgICAgIDwtLS0tLS0tLS0tLT4gPDwgdGltZWxpbmVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICAgfFxuICAgIDwtLS0tLS0tPiAgICAgICAgICAgfCA8PCBwcm9wZXJ0aWVzIHZpZXdwb3J0ICAgICAgICAgICAgICAgICAgICB8XG4gICAgICAgICAgICBweEEgICAgICAgICBweEIgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxweE1heCAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4MlxuICAgIDxTQ1JPTExCQVI+XG4gICAgfC0tLS0tLS0tLS0tLS0tLS0tLS18IDw8IHNjcm9sbGVyIHZpZXdwb3J0XG4gICAgICAgICo9PT09KiAgICAgICAgICAgIDw8IHNjcm9sbGJhclxuICAgIDwtLS0tLS0tLS0tLS0tLS0tLS0tPlxuICAgIHxzYzAgICAgICAgICAgICAgICAgfHNjTCAmJiBzY1JhdGlvXG4gICAgICAgIHxzY0FcbiAgICAgICAgICAgICB8c2NCXG4gICovXG4gIGdldEZyYW1lSW5mbyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0ge31cbiAgICBmcmFtZUluZm8uZnBzID0gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLy8gTnVtYmVyIG9mIGZyYW1lcyBwZXIgc2Vjb25kXG4gICAgZnJhbWVJbmZvLm1zcGYgPSAxMDAwIC8gZnJhbWVJbmZvLmZwcyAvLyBNaWxsaXNlY29uZHMgcGVyIGZyYW1lXG4gICAgZnJhbWVJbmZvLm1heG1zID0gZ2V0TWF4aW11bU1zKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgZnJhbWVJbmZvLm1heGYgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKGZyYW1lSW5mby5tYXhtcywgZnJhbWVJbmZvLm1zcGYpIC8vIE1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmVcbiAgICBmcmFtZUluZm8uZnJpMCA9IDAgLy8gVGhlIGxvd2VzdCBwb3NzaWJsZSBmcmFtZSAoYWx3YXlzIDApXG4gICAgZnJhbWVJbmZvLmZyaUEgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSA8IGZyYW1lSW5mby5mcmkwKSA/IGZyYW1lSW5mby5mcmkwIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXSAvLyBUaGUgbGVmdG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpTWF4ID0gKGZyYW1lSW5mby5tYXhmIDwgNjApID8gNjAgOiBmcmFtZUluZm8ubWF4ZiAvLyBUaGUgbWF4aW11bSBmcmFtZSBhcyBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmlNYXgyID0gdGhpcy5zdGF0ZS5tYXhGcmFtZSA/IHRoaXMuc3RhdGUubWF4RnJhbWUgOiBmcmFtZUluZm8uZnJpTWF4ICogMS44OCAgLy8gRXh0ZW5kIHRoZSBtYXhpbXVtIGZyYW1lIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lIChhbGxvd3MgdGhlIHVzZXIgdG8gZGVmaW5lIGtleWZyYW1lcyBiZXlvbmQgdGhlIHByZXZpb3VzbHkgZGVmaW5lZCBtYXgpXG4gICAgZnJhbWVJbmZvLmZyaUIgPSAodGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSA+IGZyYW1lSW5mby5mcmlNYXgyKSA/IGZyYW1lSW5mby5mcmlNYXgyIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAvLyBUaGUgcmlnaHRtb3N0IGZyYW1lIG9uIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLmZyaVcgPSBNYXRoLmFicyhmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSAvLyBUaGUgd2lkdGggb2YgdGhlIHZpc2libGUgcmFuZ2UgaW4gZnJhbWVzXG4gICAgZnJhbWVJbmZvLnB4cGYgPSBNYXRoLmZsb29yKHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLyBmcmFtZUluZm8uZnJpVykgLy8gTnVtYmVyIG9mIHBpeGVscyBwZXIgZnJhbWUgKHJvdW5kZWQpXG4gICAgaWYgKGZyYW1lSW5mby5weHBmIDwgMSkgZnJhbWVJbmZvLnBTY3J4cGYgPSAxXG4gICAgaWYgKGZyYW1lSW5mby5weHBmID4gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkgZnJhbWVJbmZvLnB4cGYgPSB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoXG4gICAgZnJhbWVJbmZvLnB4QSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ucHhwZilcbiAgICBmcmFtZUluZm8ucHhCID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weE1heDIgPSBmcmFtZUluZm8uZnJpTWF4MiAqIGZyYW1lSW5mby5weHBmIC8vIFRoZSB3aWR0aCBpbiBwaXhlbHMgdGhhdCB0aGUgZW50aXJlIHRpbWVsaW5lIChcImZyaU1heDJcIikgcGFkZGluZyB3b3VsZCBlcXVhbFxuICAgIGZyYW1lSW5mby5tc0EgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSBsZWZ0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5tc0IgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLm1zcGYpIC8vIFRoZSByaWdodG1vc3QgbWlsbGlzZWNvbmQgaW4gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uc2NMID0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoIC8vIFRoZSBsZW5ndGggaW4gcGl4ZWxzIG9mIHRoZSBzY3JvbGxlciB2aWV3XG4gICAgZnJhbWVJbmZvLnNjUmF0aW8gPSBmcmFtZUluZm8ucHhNYXgyIC8gZnJhbWVJbmZvLnNjTCAvLyBUaGUgcmF0aW8gb2YgdGhlIHNjcm9sbGVyIHZpZXcgdG8gdGhlIHRpbWVsaW5lIHZpZXcgKHNvIHRoZSBzY3JvbGxlciByZW5kZXJzIHByb3BvcnRpb25hbGx5IHRvIHRoZSB0aW1lbGluZSBiZWluZyBlZGl0ZWQpXG4gICAgZnJhbWVJbmZvLnNjQSA9IChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKSAvIGZyYW1lSW5mby5zY1JhdGlvIC8vIFRoZSBwaXhlbCBvZiB0aGUgbGVmdCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICBmcmFtZUluZm8uc2NCID0gKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSByaWdodCBlbmRwb2ludCBvZiB0aGUgc2Nyb2xsZXJcbiAgICByZXR1cm4gZnJhbWVJbmZvXG4gIH1cblxuICAvLyBUT0RPOiBGaXggdGhpcy90aGVzZSBtaXNub21lcihzKS4gSXQncyBub3QgJ0FTQ0lJJ1xuICBnZXRBc2NpaVRyZWUgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbikge1xuICAgICAgbGV0IGFyY2h5Rm9ybWF0ID0gdGhpcy5nZXRBcmNoeUZvcm1hdE5vZGVzKCcnLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZS5jaGlsZHJlbilcbiAgICAgIGxldCBhcmNoeVN0ciA9IGFyY2h5KGFyY2h5Rm9ybWF0KVxuICAgICAgcmV0dXJuIGFyY2h5U3RyXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIGdldEFyY2h5Rm9ybWF0Tm9kZXMgKGxhYmVsLCBjaGlsZHJlbikge1xuICAgIHJldHVybiB7XG4gICAgICBsYWJlbCxcbiAgICAgIG5vZGVzOiBjaGlsZHJlbi5maWx0ZXIoKGNoaWxkKSA9PiB0eXBlb2YgY2hpbGQgIT09ICdzdHJpbmcnKS5tYXAoKGNoaWxkKSA9PiB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIGNoaWxkLmNoaWxkcmVuKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBnZXRDb21wb25lbnRSb3dzRGF0YSAoKSB7XG4gICAgLy8gVGhlIG51bWJlciBvZiBsaW5lcyAqKm11c3QqKiBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2YgY29tcG9uZW50IGhlYWRpbmdzL3Byb3BlcnR5IHJvd3NcbiAgICBsZXQgYXNjaWlTeW1ib2xzID0gdGhpcy5nZXRBc2NpaVRyZWUoKS5zcGxpdCgnXFxuJylcbiAgICBsZXQgY29tcG9uZW50Um93cyA9IFtdXG4gICAgbGV0IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGUgPSB7fVxuICAgIGxldCB2aXNpdG9ySXRlcmF0aW9ucyA9IDBcblxuICAgIGlmICghdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgfHwgIXRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlKSByZXR1cm4gY29tcG9uZW50Um93c1xuXG4gICAgdGhpcy52aXNpdFRlbXBsYXRlKCcwJywgMCwgW10sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSwgcGFyZW50LCBsb2NhdG9yLCBpbmRleCwgc2libGluZ3MpID0+IHtcbiAgICAgIC8vIFRPRE8gaG93IHdpbGwgdGhpcyBiaXRlIHVzP1xuICAgICAgbGV0IGlzQ29tcG9uZW50ID0gKHR5cGVvZiBub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JylcbiAgICAgIGxldCBlbGVtZW50TmFtZSA9IGlzQ29tcG9uZW50ID8gbm9kZS5hdHRyaWJ1dGVzLnNvdXJjZSA6IG5vZGUuZWxlbWVudE5hbWVcblxuICAgICAgaWYgKCFwYXJlbnQgfHwgKHBhcmVudC5fX2lzRXhwYW5kZWQgJiYgKEFMTE9XRURfVEFHTkFNRVNbZWxlbWVudE5hbWVdIHx8IGlzQ29tcG9uZW50KSkpIHsgLy8gT25seSB0aGUgdG9wLWxldmVsIGFuZCBhbnkgZXhwYW5kZWQgc3ViY29tcG9uZW50c1xuICAgICAgICBjb25zdCBhc2NpaUJyYW5jaCA9IGFzY2lpU3ltYm9sc1t2aXNpdG9ySXRlcmF0aW9uc10gLy8gV2FybmluZzogVGhlIGNvbXBvbmVudCBzdHJ1Y3R1cmUgbXVzdCBtYXRjaCB0aGF0IGdpdmVuIHRvIGNyZWF0ZSB0aGUgYXNjaWkgdHJlZVxuICAgICAgICBjb25zdCBoZWFkaW5nUm93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgYXNjaWlCcmFuY2gsIHByb3BlcnR5Um93czogW10sIGlzSGVhZGluZzogdHJ1ZSwgY29tcG9uZW50SWQ6IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXSB9XG4gICAgICAgIGNvbXBvbmVudFJvd3MucHVzaChoZWFkaW5nUm93KVxuXG4gICAgICAgIGlmICghYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0pIHtcbiAgICAgICAgICBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSA9IGlzQ29tcG9uZW50ID8gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzKG5vZGUpIDogX2J1aWxkRE9NQWRkcmVzc2FibGVzKGVsZW1lbnROYW1lLCBsb2NhdG9yKVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgY29uc3QgY2x1c3RlckhlYWRpbmdzRm91bmQgPSB7fVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlHcm91cERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtpXVxuXG4gICAgICAgICAgbGV0IHByb3BlcnR5Um93XG5cbiAgICAgICAgICAgIC8vIFNvbWUgcHJvcGVydGllcyBnZXQgZ3JvdXBlZCBpbnNpZGUgdGhlaXIgb3duIGFjY29yZGlvbiBzaW5jZSB0aGV5IGhhdmUgbXVsdGlwbGUgc3ViY29tcG9uZW50cywgZS5nLiB0cmFuc2xhdGlvbi54LHkselxuICAgICAgICAgIGlmIChwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvci5jbHVzdGVyKSB7XG4gICAgICAgICAgICBsZXQgY2x1c3RlclByZWZpeCA9IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4XG4gICAgICAgICAgICBsZXQgY2x1c3RlcktleSA9IGAke2NvbXBvbmVudElkfV8ke2NsdXN0ZXJQcmVmaXh9YFxuICAgICAgICAgICAgbGV0IGlzQ2x1c3RlckhlYWRpbmcgPSBmYWxzZVxuXG4gICAgICAgICAgICAgIC8vIElmIHRoZSBjbHVzdGVyIHdpdGggdGhlIGN1cnJlbnQga2V5IGlzIGV4cGFuZGVkIHJlbmRlciBlYWNoIG9mIHRoZSByb3dzIGluZGl2aWR1YWxseVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2NsdXN0ZXJLZXldKSB7XG4gICAgICAgICAgICAgIGlmICghY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0pIHtcbiAgICAgICAgICAgICAgICBpc0NsdXN0ZXJIZWFkaW5nID0gdHJ1ZVxuICAgICAgICAgICAgICAgIGNsdXN0ZXJIZWFkaW5nc0ZvdW5kW2NsdXN0ZXJQcmVmaXhdID0gdHJ1ZVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgaXNDbHVzdGVyTWVtYmVyOiB0cnVlLCBpc0NsdXN0ZXJIZWFkaW5nLCBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsIGlzUHJvcGVydHk6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBjcmVhdGUgYSBjbHVzdGVyLCBzaGlmdGluZyB0aGUgaW5kZXggZm9yd2FyZCBzbyB3ZSBkb24ndCByZS1yZW5kZXIgdGhlIGluZGl2aWR1YWxzIG9uIHRoZSBuZXh0IGl0ZXJhdGlvbiBvZiB0aGUgbG9vcFxuICAgICAgICAgICAgICBsZXQgY2x1c3RlclNldCA9IFtwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvcl1cbiAgICAgICAgICAgICAgICAvLyBMb29rIGFoZWFkIGJ5IGEgZmV3IHN0ZXBzIGluIHRoZSBhcnJheSBhbmQgc2VlIGlmIHRoZSBuZXh0IGVsZW1lbnQgaXMgYSBtZW1iZXIgb2YgdGhlIGN1cnJlbnQgY2x1c3RlclxuICAgICAgICAgICAgICBsZXQgayA9IGkgLy8gVGVtcG9yYXJ5IHNvIHdlIGNhbiBpbmNyZW1lbnQgYGlgIGluIHBsYWNlXG4gICAgICAgICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgNDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IGogKyBrXG4gICAgICAgICAgICAgICAgbGV0IG5leHREZXNjcmlwdG9yID0gYWRkcmVzc2FibGVBcnJheXNDYWNoZVtlbGVtZW50TmFtZV1bbmV4dEluZGV4XVxuICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlIG5leHQgdGhpbmcgaW4gdGhlIGxpc3Qgc2hhcmVzIHRoZSBzYW1lIGNsdXN0ZXIgbmFtZSwgbWFrZSBpdCBwYXJ0IG9mIHRoaXMgY2x1c3Rlc3JcbiAgICAgICAgICAgICAgICBpZiAobmV4dERlc2NyaXB0b3IgJiYgbmV4dERlc2NyaXB0b3IuY2x1c3RlciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyLnByZWZpeCA9PT0gY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgICAgICAgICAgY2x1c3RlclNldC5wdXNoKG5leHREZXNjcmlwdG9yKVxuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB3ZSBhbHJlYWR5IGdvIHRvIHRoZSBuZXh0IG9uZSwgYnVtcCB0aGUgaXRlcmF0aW9uIGluZGV4IHNvIHdlIHNraXAgaXQgb24gdGhlIG5leHQgbG9vcFxuICAgICAgICAgICAgICAgICAgaSArPSAxXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgY2x1c3RlclByZWZpeCwgY2x1c3RlcktleSwgY2x1c3RlcjogY2x1c3RlclNldCwgY2x1c3Rlck5hbWU6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIubmFtZSwgaXNDbHVzdGVyOiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3BlcnR5Um93ID0geyBub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgcHJvcGVydHk6IHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLCBpc1Byb3BlcnR5OiB0cnVlLCBjb21wb25lbnRJZCB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaGVhZGluZ1Jvdy5wcm9wZXJ0eVJvd3MucHVzaChwcm9wZXJ0eVJvdylcblxuICAgICAgICAgICAgLy8gUHVzaGluZyBhbiBlbGVtZW50IGludG8gYSBjb21wb25lbnQgcm93IHdpbGwgcmVzdWx0IGluIGl0IHJlbmRlcmluZywgc28gb25seSBwdXNoXG4gICAgICAgICAgICAvLyB0aGUgcHJvcGVydHkgcm93cyBvZiBub2RlcyB0aGF0IGhhdmUgYmVlbiBleHBhbmRleFxuICAgICAgICAgIGlmIChub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKHByb3BlcnR5Um93KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmlzaXRvckl0ZXJhdGlvbnMrK1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzLmZvckVhY2goKGl0ZW0sIGluZGV4LCBpdGVtcykgPT4ge1xuICAgICAgaXRlbS5faW5kZXggPSBpbmRleFxuICAgICAgaXRlbS5faXRlbXMgPSBpdGVtc1xuICAgIH0pXG5cbiAgICBjb21wb25lbnRSb3dzID0gY29tcG9uZW50Um93cy5maWx0ZXIoKHsgbm9kZSwgcGFyZW50LCBsb2NhdG9yIH0pID0+IHtcbiAgICAgICAgLy8gTG9jYXRvcnMgPiAwLjAgYXJlIGJlbG93IHRoZSBsZXZlbCB3ZSB3YW50IHRvIGRpc3BsYXkgKHdlIG9ubHkgd2FudCB0aGUgdG9wIGFuZCBpdHMgY2hpbGRyZW4pXG4gICAgICBpZiAobG9jYXRvci5zcGxpdCgnLicpLmxlbmd0aCA+IDIpIHJldHVybiBmYWxzZVxuICAgICAgcmV0dXJuICFwYXJlbnQgfHwgcGFyZW50Ll9faXNFeHBhbmRlZFxuICAgIH0pXG5cbiAgICByZXR1cm4gY29tcG9uZW50Um93c1xuICB9XG5cbiAgbWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBsZXQgdmFsdWVHcm91cCA9IFRpbWVsaW5lUHJvcGVydHkuZ2V0VmFsdWVHcm91cChjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSlcbiAgICBpZiAoIXZhbHVlR3JvdXApIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgbGV0IGtleWZyYW1lc0xpc3QgPSBPYmplY3Qua2V5cyh2YWx1ZUdyb3VwKS5tYXAoKGtleWZyYW1lS2V5KSA9PiBwYXJzZUludChrZXlmcmFtZUtleSwgMTApKS5zb3J0KChhLCBiKSA9PiBhIC0gYilcbiAgICBpZiAoa2V5ZnJhbWVzTGlzdC5sZW5ndGggPCAxKSByZXR1cm4gc2VnbWVudE91dHB1dHNcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5ZnJhbWVzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zY3VyciA9IGtleWZyYW1lc0xpc3RbaV1cbiAgICAgIGlmIChpc05hTihtc2N1cnIpKSBjb250aW51ZVxuICAgICAgbGV0IG1zcHJldiA9IGtleWZyYW1lc0xpc3RbaSAtIDFdXG4gICAgICBsZXQgbXNuZXh0ID0ga2V5ZnJhbWVzTGlzdFtpICsgMV1cblxuICAgICAgaWYgKG1zY3VyciA+IGZyYW1lSW5mby5tc0IpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGFmdGVyIHRoZSB2aXNpYmxlIHJhbmdlLCBza2lwIGl0XG4gICAgICBpZiAobXNjdXJyIDwgZnJhbWVJbmZvLm1zQSAmJiBtc25leHQgIT09IHVuZGVmaW5lZCAmJiBtc25leHQgPCBmcmFtZUluZm8ubXNBKSBjb250aW51ZSAvLyBJZiB0aGlzIHNlZ21lbnQgaGFwcGVucyBlbnRpcmVseSBiZWZvcmUgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXQgKHBhcnRpYWwgc2VnbWVudHMgYXJlIG9rKVxuXG4gICAgICBsZXQgcHJldlxuICAgICAgbGV0IGN1cnJcbiAgICAgIGxldCBuZXh0XG5cbiAgICAgIGlmIChtc3ByZXYgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNwcmV2KSkge1xuICAgICAgICBwcmV2ID0ge1xuICAgICAgICAgIG1zOiBtc3ByZXYsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpIC0gMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc3ByZXYsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc3ByZXZdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zcHJldl0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjdXJyID0ge1xuICAgICAgICBtczogbXNjdXJyLFxuICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgIGluZGV4OiBpLFxuICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc2N1cnIsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNjdXJyXS52YWx1ZSxcbiAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNjdXJyXS5jdXJ2ZVxuICAgICAgfVxuXG4gICAgICBpZiAobXNuZXh0ICE9PSB1bmRlZmluZWQgJiYgIWlzTmFOKG1zbmV4dCkpIHtcbiAgICAgICAgbmV4dCA9IHtcbiAgICAgICAgICBtczogbXNuZXh0LFxuICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICBpbmRleDogaSArIDEsXG4gICAgICAgICAgZnJhbWU6IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUobXNuZXh0LCBmcmFtZUluZm8ubXNwZiksXG4gICAgICAgICAgdmFsdWU6IHZhbHVlR3JvdXBbbXNuZXh0XS52YWx1ZSxcbiAgICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc25leHRdLmN1cnZlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbGV0IHB4T2Zmc2V0TGVmdCA9IChjdXJyLmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGxldCBweE9mZnNldFJpZ2h0XG4gICAgICBpZiAobmV4dCkgcHhPZmZzZXRSaWdodCA9IChuZXh0LmZyYW1lIC0gZnJhbWVJbmZvLmZyaUEpICogZnJhbWVJbmZvLnB4cGZcblxuICAgICAgbGV0IHNlZ21lbnRPdXRwdXQgPSBpdGVyYXRlZShwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGkpXG4gICAgICBpZiAoc2VnbWVudE91dHB1dCkgc2VnbWVudE91dHB1dHMucHVzaChzZWdtZW50T3V0cHV0KVxuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50T3V0cHV0c1xuICB9XG5cbiAgbWFwVmlzaWJsZUNvbXBvbmVudFRpbWVsaW5lU2VnbWVudHMgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eVJvd3MsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpIHtcbiAgICBsZXQgc2VnbWVudE91dHB1dHMgPSBbXVxuXG4gICAgcHJvcGVydHlSb3dzLmZvckVhY2goKHByb3BlcnR5Um93KSA9PiB7XG4gICAgICBpZiAocHJvcGVydHlSb3cuaXNDbHVzdGVyKSB7XG4gICAgICAgIHByb3BlcnR5Um93LmNsdXN0ZXIuZm9yRWFjaCgocHJvcGVydHlEZXNjcmlwdG9yKSA9PiB7XG4gICAgICAgICAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5RGVzY3JpcHRvci5uYW1lXG4gICAgICAgICAgbGV0IHByb3BlcnR5T3V0cHV0cyA9IHRoaXMubWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlSb3cucHJvcGVydHkubmFtZVxuICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgIGlmIChwcm9wZXJ0eU91dHB1dHMpIHtcbiAgICAgICAgICBzZWdtZW50T3V0cHV0cyA9IHNlZ21lbnRPdXRwdXRzLmNvbmNhdChwcm9wZXJ0eU91dHB1dHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICByZW1vdmVUaW1lbGluZVNoYWRvdyAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSB9KVxuICB9XG5cbiAgLypcbiAgICogcmVuZGVyIG1ldGhvZHNcbiAgICogLS0tLS0tLS0tICovXG5cbiAgLy8gLS0tLS0tLS0tXG5cbiAgcmVuZGVyVGltZWxpbmVQbGF5YmFja0NvbnRyb2xzICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIHRvcDogMTdcbiAgICAgICAgfX0+XG4gICAgICAgIDxDb250cm9sc0FyZWFcbiAgICAgICAgICByZW1vdmVUaW1lbGluZVNoYWRvdz17dGhpcy5yZW1vdmVUaW1lbGluZVNoYWRvdy5iaW5kKHRoaXMpfVxuICAgICAgICAgIGFjdGl2ZUNvbXBvbmVudERpc3BsYXlOYW1lPXt0aGlzLnByb3BzLnVzZXJjb25maWcubmFtZX1cbiAgICAgICAgICB0aW1lbGluZU5hbWVzPXtPYmplY3Qua2V5cygodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpID8gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGltZWxpbmVzIDoge30pfVxuICAgICAgICAgIHNlbGVjdGVkVGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgY3VycmVudEZyYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZX1cbiAgICAgICAgICBpc1BsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgIHBsYXliYWNrU3BlZWQ9e3RoaXMuc3RhdGUucGxheWVyUGxheWJhY2tTcGVlZH1cbiAgICAgICAgICBsYXN0RnJhbWU9e3RoaXMuZ2V0RnJhbWVJbmZvKCkuZnJpTWF4fVxuICAgICAgICAgIGNoYW5nZVRpbWVsaW5lTmFtZT17KG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvblJlbmFtZVRpbWVsaW5lKG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY3JlYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uQ3JlYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZHVwbGljYXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgZGVsZXRlVGltZWxpbmU9eyh0aW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlVGltZWxpbmUodGltZWxpbmVOYW1lKVxuICAgICAgICAgIH19XG4gICAgICAgICAgc2VsZWN0VGltZWxpbmU9eyhjdXJyZW50VGltZWxpbmVOYW1lKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIG1ha2Ugc3VyZSB3ZSB1cGRhdGUgdGhlIGluLW1lbW9yeSBjb21wb25lbnQgb3IgcHJvcGVydHkgYXNzaWdubWVudCBtaWdodCBub3Qgd29yayBjb3JyZWN0bHlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRUaW1lbGluZU5hbWUoY3VycmVudFRpbWVsaW5lTmFtZSwgeyBmcm9tOiAndGltZWxpbmUnIH0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdzZXRUaW1lbGluZU5hbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIGN1cnJlbnRUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50VGltZWxpbmVOYW1lIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBCYWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAvKiB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVWaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8uZnJpMCAtIGZyYW1lSW5mby5mcmlBKSAqL1xuICAgICAgICAgICAgLyogdGhpcy51cGRhdGVUaW1lKGZyYW1lSW5mby5mcmkwKSAqL1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaTApXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZSwgY3VycmVudEZyYW1lOiBmcmFtZUluZm8uZnJpMCB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tTa2lwRm9yd2FyZD17KCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmlNYXggfSlcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrQW5kUGF1c2UoZnJhbWVJbmZvLmZyaU1heClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrUGxheVBhdXNlPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZVBsYXliYWNrKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIGNoYW5nZVBsYXliYWNrU3BlZWQ9eyhpbnB1dEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBsZXQgcGxheWVyUGxheWJhY2tTcGVlZCA9IE51bWJlcihpbnB1dEV2ZW50LnRhcmdldC52YWx1ZSB8fCAxKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHBsYXllclBsYXliYWNrU3BlZWQgfSlcbiAgICAgICAgICB9fSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgZ2V0SXRlbVZhbHVlRGVzY3JpcHRvciAoaW5wdXRJdGVtKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiBnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvcihpbnB1dEl0ZW0ubm9kZSwgZnJhbWVJbmZvLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGUsIHRoaXMuX2NvbXBvbmVudCwgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKGZyYW1lSW5mbyksIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSwgaW5wdXRJdGVtLnByb3BlcnR5KVxuICB9XG5cbiAgZ2V0Q3VycmVudFRpbWVsaW5lVGltZSAoZnJhbWVJbmZvKSB7XG4gICAgcmV0dXJuIE1hdGgucm91bmQodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiBmcmFtZUluZm8ubXNwZilcbiAgfVxuXG4gIHJlbmRlckNvbGxhcHNlZFByb3BlcnR5VGltZWxpbmVTZWdtZW50cyAoaXRlbSkge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgbGV0IGVsZW1lbnROYW1lID0gKHR5cGVvZiBpdGVtLm5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKSA/ICdkaXYnIDogaXRlbS5ub2RlLmVsZW1lbnROYW1lXG4gICAgbGV0IGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcblxuICAgIC8vIFRPRE86IE9wdGltaXplIHRoaXM/IFdlIGRvbid0IG5lZWQgdG8gcmVuZGVyIGV2ZXJ5IHNlZ21lbnQgc2luY2Ugc29tZSBvZiB0aGVtIG92ZXJsYXAuXG4gICAgLy8gTWF5YmUga2VlcCBhIGxpc3Qgb2Yga2V5ZnJhbWUgJ3BvbGVzJyByZW5kZXJlZCwgYW5kIG9ubHkgcmVuZGVyIG9uY2UgaW4gdGhhdCBzcG90P1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nY29sbGFwc2VkLXNlZ21lbnRzLWJveCcgc3R5bGU9e3sgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgaGVpZ2h0OiAyNSwgd2lkdGg6ICcxMDAlJywgb3ZlcmZsb3c6ICdoaWRkZW4nIH19PlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgaXRlbS5wcm9wZXJ0eVJvd3MsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgICAgIGxldCBzZWdtZW50UGllY2VzID0gW11cblxuICAgICAgICAgIGlmIChjdXJyLmN1cnZlKSB7XG4gICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAxLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclNvbG9LZXlmcmFtZShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGNvbGxhcHNlZDogdHJ1ZSwgY29sbGFwc2VkRWxlbWVudDogdHJ1ZSB9KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gc2VnbWVudFBpZWNlc1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlciAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIGluZGV4LCBoYW5kbGUsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2FudCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMuc2V0Um93Q2FjaGVBY3RpdmF0aW9uKHsgY29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydE1zOiBjdXJyLm1zXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS50cmFuc2l0aW9uQm9keURyYWdnaW5nKSB7XG4gICAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICAgIGxldCBkZXN0TXMgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRNcyArIG1zQ2hhbmdlKVxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICAgIH1cbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRLZXlmcmFtZXMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzXG4gICAgICAgICAgbGV0IHNlbGVjdGVkU2VnbWVudHMgPSB0aGlzLnN0YXRlLnNlbGVjdGVkU2VnbWVudHNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzID0ge31cbiAgICAgICAgICAgIHNlbGVjdGVkU2VnbWVudHMgPSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgaW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhbmRsZSxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEtleWZyYW1lcywgc2VsZWN0ZWRTZWdtZW50cyB9KVxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBvbkNvbnRleHRNZW51PXsoY3R4TWVudUV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRNcyA9IGN1cnIubXNcbiAgICAgICAgICAgIGxldCBjbGlja2VkRnJhbWUgPSBjdXJyLmZyYW1lXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZScsXG4gICAgICAgICAgICAgIGZyYW1lSW5mbyxcbiAgICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIGtleWZyYW1lSW5kZXg6IGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICAgIHN0YXJ0RnJhbWU6IGN1cnIuZnJhbWUsXG4gICAgICAgICAgICAgIGVuZE1zOiBudWxsLFxuICAgICAgICAgICAgICBlbmRGcmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICAgIGxvY2FsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgdG90YWxPZmZzZXRYLFxuICAgICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICAgIGNsaWNrZWRNcyxcbiAgICAgICAgICAgICAgZWxlbWVudE5hbWVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMSxcbiAgICAgICAgICAgIGxlZnQ6IHB4T2Zmc2V0TGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDMsXG4gICAgICAgICAgICBjdXJzb3I6ICdjb2wtcmVzaXplJ1xuICAgICAgICAgIH19IC8+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU29sb0tleWZyYW1lIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBsZXQgaXNBY3RpdmUgPSBmYWxzZVxuICAgIGlmICh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gIT0gdW5kZWZpbmVkKSBpc0FjdGl2ZSA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWB9XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIHdpZHRoOiA5LFxuICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgdG9wOiAtMyxcbiAgICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjcpJyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAxMzBtcyBsaW5lYXInLFxuICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgID8gUGFsZXR0ZS5CTFVFXG4gICAgICAgICAgICA6IChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICA6IChpc0FjdGl2ZSlcbiAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5MSUdIVEVTVF9QSU5LXG4gICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgIH0gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxuXG4gIHJlbmRlclRyYW5zaXRpb25Cb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1bmlxdWVLZXkgPSBgJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9LSR7Y3Vyci5tc31gXG4gICAgY29uc3QgY3VydmUgPSBjdXJyLmN1cnZlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY3Vyci5jdXJ2ZS5zbGljZSgxKVxuICAgIGNvbnN0IGJyZWFraW5nQm91bmRzID0gY3VydmUuaW5jbHVkZXMoJ0JhY2snKSB8fCBjdXJ2ZS5pbmNsdWRlcygnQm91bmNlJykgfHwgY3VydmUuaW5jbHVkZXMoJ0VsYXN0aWMnKVxuICAgIGNvbnN0IEN1cnZlU1ZHID0gQ1VSVkVTVkdTW2N1cnZlICsgJ1NWRyddXG4gICAgbGV0IGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSBmYWxzZVxuICAgIGxldCBzZWNvbmRLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGZpcnN0S2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpXSAhPSB1bmRlZmluZWQpIHNlY29uZEtleWZyYW1lQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxEcmFnZ2FibGVDb3JlXG4gICAgICAgIC8vIE5PVEU6IFdlIGNhbm5vdCB1c2UgJ2N1cnIubXMnIGZvciBrZXkgaGVyZSBiZWNhdXNlIHRoZXNlIHRoaW5ncyBtb3ZlIGFyb3VuZFxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBheGlzPSd4J1xuICAgICAgICBvblN0YXJ0PXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiB0cnVlXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIHRoaXMudW5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGtleWZyYW1lRHJhZ1N0YXJ0UHg6IGZhbHNlLCBrZXlmcmFtZURyYWdTdGFydE1zOiBmYWxzZSwgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2UgfSlcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICBsZXQgcHhDaGFuZ2UgPSBkcmFnRGF0YS5sYXN0WCAtIHRoaXMuc3RhdGUua2V5ZnJhbWVEcmFnU3RhcnRQeFxuICAgICAgICAgIGxldCBtc0NoYW5nZSA9IChweENoYW5nZSAvIGZyYW1lSW5mby5weHBmKSAqIGZyYW1lSW5mby5tc3BmXG4gICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsICdib2R5JywgY3Vyci5pbmRleCwgY3Vyci5tcywgZGVzdE1zKVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX1cbiAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRTZWdtZW50cyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXMgPSB7fVxuICAgICAgICAgICAgc2VsZWN0ZWRTZWdtZW50cyA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBpbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgaGFuZGxlOiAnbWlkZGxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldID0ge1xuICAgICAgICAgICAgaWQ6IGNvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKSxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgZWxlbWVudE5hbWUsXG4gICAgICAgICAgICBpbmRleDogbmV4dC5pbmRleCxcbiAgICAgICAgICAgIG1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgaGFuZGxlOiAnbWlkZGxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhc0N1cnZlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEtleWZyYW1lcywgc2VsZWN0ZWRTZWdtZW50cyB9KVxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29udGFpbmVyJ1xuICAgICAgICAgIGtleT17dW5pcXVlS2V5fVxuICAgICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS10cmFuc2l0aW9uJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgY3VydmU6IGN1cnIuY3VydmUsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9IFBhbGV0dGUuR1JBWVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gJ3RyYW5zcGFyZW50J1xuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0ICsgNCxcbiAgICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHtvcHRpb25zLmNvbGxhcHNlZCAmJlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbGxhcHNlZC1iYWNrZHJvcCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgekluZGV4OiA0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuR1JBWVxuICAgICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsJ1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMSxcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkzKVxuICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjk2NSlcbiAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMixcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICBvdmVyZmxvdzogYnJlYWtpbmdCb3VuZHMgPyAndmlzaWJsZScgOiAnaGlkZGVuJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPEN1cnZlU1ZHXG4gICAgICAgICAgICAgIGlkPXt1bmlxdWVLZXl9XG4gICAgICAgICAgICAgIGxlZnRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAgIHJpZ2h0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29uc3RhbnRCb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICAvLyBjb25zdCBhY3RpdmVJbmZvID0gc2V0QWN0aXZlQ29udGVudHMocHJvcGVydHlOYW1lLCBjdXJyLCBuZXh0LCBmYWxzZSwgdGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBsZXQgaXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdICE9IHVuZGVmaW5lZCkgaXNTZWxlY3RlZCA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICB9fVxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBjbGFzc05hbWU9J2NvbnN0YW50LWJvZHknXG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXNlZ21lbnQnLFxuICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRTZWdtZW50cyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1xuICAgICAgICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkU2VnbWVudHMgPSB7fVxuICAgICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXMgPSB7fVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGhhc0N1cnZlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRTZWdtZW50cywgc2VsZWN0ZWRLZXlmcmFtZXMgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogKGlzU2VsZWN0ZWQpXG4gICAgICAgICAgICAgID8gIENvbG9yKFBhbGV0dGUuTElHSFRFU1RfUElOSykuZmFkZSguNSlcbiAgICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA5MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fSwgc2VsZWN0ZWRTZWdtZW50czoge319KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzIChub2RlKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBfYnVpbGRET01BZGRyZXNzYWJsZXMoJ2RpdicpIC8vIHN0YXJ0IHdpdGggZG9tIHByb3BlcnRpZXM/XG4gIGZvciAobGV0IG5hbWUgaW4gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXMpIHtcbiAgICBsZXQgc3RhdGUgPSBub2RlLmVsZW1lbnROYW1lLnN0YXRlc1tuYW1lXVxuXG4gICAgYWRkcmVzc2FibGVzLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHByZWZpeDogbmFtZSxcbiAgICAgIHN1ZmZpeDogdW5kZWZpbmVkLFxuICAgICAgZmFsbGJhY2s6IHN0YXRlLnZhbHVlLFxuICAgICAgdHlwZWRlZjogc3RhdGUudHlwZVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGFkZHJlc3NhYmxlc1xufVxuXG5mdW5jdGlvbiBfYnVpbGRET01BZGRyZXNzYWJsZXMgKGVsZW1lbnROYW1lLCBsb2NhdG9yKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBbXVxuXG4gIGNvbnN0IGRvbVNjaGVtYSA9IERPTVNjaGVtYVtlbGVtZW50TmFtZV1cbiAgY29uc3QgZG9tRmFsbGJhY2tzID0gRE9NRmFsbGJhY2tzW2VsZW1lbnROYW1lXVxuXG4gIGlmIChkb21TY2hlbWEpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gZG9tU2NoZW1hKSB7XG4gICAgICBsZXQgcHJvcGVydHlHcm91cCA9IG51bGxcblxuICAgICAgaWYgKGxvY2F0b3IgPT09ICcwJykgeyAvLyBUaGlzIGluZGljYXRlcyB0aGUgdG9wIGxldmVsIGVsZW1lbnQgKHRoZSBhcnRib2FyZClcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcblxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1gnKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3gnXVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1knKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3knXVxuXG4gICAgICAgICAgcHJvcGVydHlHcm91cCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHByZWZpeDogbmFtZVBhcnRzWzBdLFxuICAgICAgICAgICAgc3VmZml4OiBuYW1lUGFydHNbMV0sXG4gICAgICAgICAgICBmYWxsYmFjazogZG9tRmFsbGJhY2tzW3Byb3BlcnR5TmFtZV0sXG4gICAgICAgICAgICB0eXBlZGVmOiBkb21TY2hlbWFbcHJvcGVydHlOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAgIGxldCBuYW1lUGFydHMgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BlcnR5R3JvdXApIHtcbiAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBDTFVTVEVSRURfUFJPUFNbcHJvcGVydHlHcm91cC5uYW1lXVxuICAgICAgICBpZiAoY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgIHByb3BlcnR5R3JvdXAuY2x1c3RlciA9IHtcbiAgICAgICAgICAgIHByZWZpeDogY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgIG5hbWU6IENMVVNURVJfTkFNRVNbY2x1c3RlclByZWZpeF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhZGRyZXNzYWJsZXMucHVzaChwcm9wZXJ0eUdyb3VwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==