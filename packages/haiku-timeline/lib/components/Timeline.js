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
    key: 'changeMultipleSegmentCurves',
    value: function changeMultipleSegmentCurves(componentId, timelineName, propertyName, startMs, curveName) {
      var _this6 = this;

      _lodash2.default.each(this.state.selectedSegments, function (s) {
        if (!s.hasCurve) {
          _this6.executeBytecodeActionJoinKeyframes(componentId, timelineName, s.elementName, s.propertyName, s.ms, s.endMs, curveName);
        } else {
          _this6.executeBytecodeActionChangeSegmentCurve(componentId, timelineName, s.propertyName, s.ms, curveName);
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
      var _this7 = this;

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
        var keyframeMoves = _actions2.default.moveSegmentEndpoints(_this7.state.reifiedBytecode, k.componentId, timelineName, k.propertyName, k.handle, // todo: take a second look at this one
        k.index, k.ms, adjustedMs, frameInfo);
        // Update our selected keyframes start time now that we've moved them
        // Note: This seems like there's probably a more clever way to make sure this gets
        // updated via the BytecodeActions.moveSegmentEndpoints perhaps.
        selectedKeyframes[k.componentId + '-' + k.propertyName + '-' + k.index].ms = Object.keys(keyframeMoves)[k.index];
        _this7.setState({ selectedKeyframes: selectedKeyframes });

        // The 'keyframeMoves' indicate a list of changes we know occurred. Only if some occurred do we bother to update the other views
        if (Object.keys(keyframeMoves).length > 0) {
          (0, _clearInMemoryBytecodeCaches2.default)(_this7.state.reifiedBytecode);
          _this7._component._clearCaches();
          _this7.setState({
            reifiedBytecode: _this7.state.reifiedBytecode,
            serializedBytecode: _this7._component.getSerializedBytecode()
          });

          // It's very heavy to transmit a websocket message for every single movement while updating the ui,
          // so the values are accumulated and sent via a single batched update.
          if (!_this7._keyframeMoves) _this7._keyframeMoves = {};
          var movementKey = [componentId, timelineName, propertyName].join('-');
          _this7._keyframeMoves[movementKey] = { componentId: componentId, timelineName: timelineName, propertyName: propertyName, keyframeMoves: keyframeMoves, frameInfo: frameInfo };
          _this7.debouncedKeyframeMoveAction();
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
      var _this8 = this;

      if (this.state.isPlayerPlaying) {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: false
        }, function () {
          _this8._component.getCurrentTimeline().pause();
        });
      } else {
        this.setState({
          inputFocused: null,
          inputSelected: null,
          isPlayerPlaying: true
        }, function () {
          _this8._component.getCurrentTimeline().play();
        });
      }
    }
  }, {
    key: 'rehydrateBytecode',
    value: function rehydrateBytecode(reifiedBytecode, serializedBytecode) {
      var _this9 = this;

      if (reifiedBytecode) {
        if (reifiedBytecode.template) {
          this.visitTemplate('0', 0, [], reifiedBytecode.template, null, function (node) {
            var id = node.attributes && node.attributes['haiku-id'];
            if (!id) return void 0;
            node.__isSelected = !!_this9.state.selectedNodes[id];
            node.__isExpanded = !!_this9.state.expandedNodes[id];
            node.__isHidden = !!_this9.state.hiddenNodes[id];
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
      var _this10 = this;

      var componentId = _ref4.componentId;

      if (this.state.reifiedBytecode && this.state.reifiedBytecode.template) {
        var found = [];
        this.visitTemplate('0', 0, [], this.state.reifiedBytecode.template, null, function (node, parent) {
          node.parent = parent;
          var id = node.attributes && node.attributes['haiku-id'];
          if (id && id === componentId) found.push(node);
        });
        found.forEach(function (node) {
          _this10.selectNode(node);
          _this10.expandNode(node);
          _this10.scrollToNode(node);
        });
      }
    }
  }, {
    key: 'minionUnselectElement',
    value: function minionUnselectElement(_ref5) {
      var _this11 = this;

      var componentId = _ref5.componentId;

      var found = this.findNodesByComponentId(componentId);
      found.forEach(function (node) {
        _this11.deselectNode(node);
        _this11.collapseNode(node);
        _this11.scrollToTop(node);
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
      var _this12 = this;

      var relatedElement = this.findElementInTemplate(componentId, this.state.reifiedBytecode);
      var elementName = relatedElement && relatedElement.elementName;
      if (!elementName) {
        return console.warn('Component ' + componentId + ' missing element, and without an element name I cannot update a property value');
      }

      var allRows = this.state.componentRowsData || [];
      allRows.forEach(function (rowInfo) {
        if (rowInfo.isProperty && rowInfo.componentId === componentId && propertyNames.indexOf(rowInfo.property.name) !== -1) {
          _this12.activateRow(rowInfo);
        } else {
          _this12.deactivateRow(rowInfo);
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
      var _this13 = this;

      return {
        label: label,
        nodes: children.filter(function (child) {
          return typeof child !== 'string';
        }).map(function (child) {
          return _this13.getArchyFormatNodes('', child.children);
        })
      };
    }
  }, {
    key: 'getComponentRowsData',
    value: function getComponentRowsData() {
      var _this14 = this;

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
              if (_this14.state.expandedPropertyClusters[clusterKey]) {
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
      var _this15 = this;

      var segmentOutputs = [];

      propertyRows.forEach(function (propertyRow) {
        if (propertyRow.isCluster) {
          propertyRow.cluster.forEach(function (propertyDescriptor) {
            var propertyName = propertyDescriptor.name;
            var propertyOutputs = _this15.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
            if (propertyOutputs) {
              segmentOutputs = segmentOutputs.concat(propertyOutputs);
            }
          });
        } else {
          var propertyName = propertyRow.property.name;
          var propertyOutputs = _this15.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, iteratee);
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
      var _this16 = this;

      return _react2.default.createElement(
        'div',
        {
          style: {
            position: 'relative',
            top: 17
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1539
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
            _this16.executeBytecodeActionRenameTimeline(oldTimelineName, newTimelineName);
          },
          createTimeline: function createTimeline(timelineName) {
            _this16.executeBytecodeActionCreateTimeline(timelineName);
          },
          duplicateTimeline: function duplicateTimeline(timelineName) {
            _this16.executeBytecodeActionDuplicateTimeline(timelineName);
          },
          deleteTimeline: function deleteTimeline(timelineName) {
            _this16.executeBytecodeActionDeleteTimeline(timelineName);
          },
          selectTimeline: function selectTimeline(currentTimelineName) {
            // Need to make sure we update the in-memory component or property assignment might not work correctly
            _this16._component.setTimelineName(currentTimelineName, { from: 'timeline' }, function () {});
            _this16.props.websocket.action('setTimelineName', [_this16.props.folder, currentTimelineName], function () {});
            _this16.setState({ currentTimelineName: currentTimelineName });
          },
          playbackSkipBack: function playbackSkipBack() {
            /* this._component.getCurrentTimeline().pause() */
            /* this.updateVisibleFrameRange(frameInfo.fri0 - frameInfo.friA) */
            /* this.updateTime(frameInfo.fri0) */
            var frameInfo = _this16.getFrameInfo();
            _this16._component.getCurrentTimeline().seekAndPause(frameInfo.fri0);
            _this16.setState({ isPlayerPlaying: false, currentFrame: frameInfo.fri0 });
          },
          playbackSkipForward: function playbackSkipForward() {
            var frameInfo = _this16.getFrameInfo();
            _this16.setState({ isPlayerPlaying: false, currentFrame: frameInfo.friMax });
            _this16._component.getCurrentTimeline().seekAndPause(frameInfo.friMax);
          },
          playbackPlayPause: function playbackPlayPause() {
            _this16.togglePlayback();
          },
          changePlaybackSpeed: function changePlaybackSpeed(inputEvent) {
            var playerPlaybackSpeed = Number(inputEvent.target.value || 1);
            _this16.setState({ playerPlaybackSpeed: playerPlaybackSpeed });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1544
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
      var _this17 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var frameInfo = this.getFrameInfo();

      // TODO: Optimize this? We don't need to render every segment since some of them overlap.
      // Maybe keep a list of keyframe 'poles' rendered, and only render once in that spot?
      return _react2.default.createElement(
        'div',
        { className: 'collapsed-segments-box', style: { position: 'absolute', left: this.state.propertiesWidth - 4, height: 25, width: '100%', overflow: 'hidden' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1612
          },
          __self: this
        },
        this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, item.propertyRows, this.state.reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
          var segmentPieces = [];

          if (curr.curve) {
            segmentPieces.push(_this17.renderTransitionBody(frameInfo, componentId, elementName, curr.name, _this17.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedElement: true }));
          } else {
            if (next) {
              segmentPieces.push(_this17.renderConstantBody(frameInfo, componentId, elementName, curr.name, _this17.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedElement: true }));
            }
            if (!prev || !prev.curve) {
              segmentPieces.push(_this17.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, _this17.state.reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedElement: true }));
            }
          }

          return segmentPieces;
        })
      );
    }
  }, {
    key: 'renderInvisibleKeyframeDragger',
    value: function renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, index, handle, options) {
      var _this18 = this;

      return _react2.default.createElement(
        _reactDraggable.DraggableCore
        // NOTE: We cant use 'curr.ms' for key here because these things move around

        // NOTE: We cannot use 'curr.ms' for key here because these things move around
        ,
        { key: propertyName + '-' + index,
          axis: 'x',
          onStart: function onStart(dragEvent, dragData) {
            _this18.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this18.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this18.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this18.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            if (!_this18.state.transitionBodyDragging) {
              var pxChange = dragData.lastX - _this18.state.keyframeDragStartPx;
              var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
              var destMs = Math.round(_this18.state.keyframeDragStartMs + msChange);
              _this18.executeBytecodeActionMoveSegmentEndpoints(componentId, _this18.state.currentTimelineName, propertyName, handle, curr.index, curr.ms, destMs);
            }
          }, THROTTLE_TIME),
          onMouseDown: function onMouseDown(e) {
            e.stopPropagation();
            var selectedKeyframes = _this18.state.selectedKeyframes;
            var selectedSegments = _this18.state.selectedSegments;
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
            _this18.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1635
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
            _this18.ctxmenu.show({
              type: 'keyframe',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this18.state.currentTimelineName,
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
            lineNumber: 1679
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
            lineNumber: 1725
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
              lineNumber: 1737
            },
            __self: this
          },
          _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : isActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
              fileName: _jsxFileName,
              lineNumber: 1745
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderTransitionBody',
    value: function renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, index, options) {
      var _this19 = this;

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
            _this19.setRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({
              inputSelected: null,
              inputFocused: null,
              keyframeDragStartPx: dragData.x,
              keyframeDragStartMs: curr.ms,
              transitionBodyDragging: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            _this19.unsetRowCacheActivation({ componentId: componentId, propertyName: propertyName });
            _this19.setState({ keyframeDragStartPx: false, keyframeDragStartMs: false, transitionBodyDragging: false });
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            var pxChange = dragData.lastX - _this19.state.keyframeDragStartPx;
            var msChange = pxChange / frameInfo.pxpf * frameInfo.mspf;
            var destMs = Math.round(_this19.state.keyframeDragStartMs + msChange);
            _this19.executeBytecodeActionMoveSegmentEndpoints(componentId, _this19.state.currentTimelineName, propertyName, 'body', curr.index, curr.ms, destMs);
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
            selectedSegments[componentId + '-' + propertyName + '-' + curr.index] = {
              id: componentId + '-' + propertyName + '-' + curr.index,
              componentId: componentId,
              propertyName: propertyName,
              ms: curr.ms,
              hasCurve: true
            };
            _this19.setState({ selectedKeyframes: selectedKeyframes, selectedSegments: selectedSegments });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1769
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            className: 'pill-container',
            key: uniqueKey,
            ref: function ref(domElement) {
              _this19[uniqueKey] = domElement;
            },
            onContextMenu: function onContextMenu(ctxMenuEvent) {
              if (options.collapsed) return false;
              ctxMenuEvent.stopPropagation();
              var localOffsetX = ctxMenuEvent.nativeEvent.offsetX;
              var totalOffsetX = localOffsetX + pxOffsetLeft + Math.round(frameInfo.pxA / frameInfo.pxpf);
              var clickedFrame = Math.round(totalOffsetX / frameInfo.pxpf);
              var clickedMs = Math.round(totalOffsetX / frameInfo.pxpf * frameInfo.mspf);
              _this19.ctxmenu.show({
                type: 'keyframe-transition',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                timelineName: _this19.state.currentTimelineName,
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
              if (_this19[uniqueKey]) _this19[uniqueKey].style.color = _DefaultPalette2.default.GRAY;
            },
            onMouseLeave: function onMouseLeave(reactEvent) {
              if (_this19[uniqueKey]) _this19[uniqueKey].style.color = 'transparent';
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
              lineNumber: 1827
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
              lineNumber: 1878
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
              lineNumber: 1894
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
                lineNumber: 1911
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
                  lineNumber: 1921
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1929
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
                lineNumber: 1939
              },
              __self: this
            },
            _react2.default.createElement(CurveSVG, {
              id: uniqueKey,
              leftGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : firstKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              rightGradFill: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK,
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1948
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
                lineNumber: 1966
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
                  lineNumber: 1977
                },
                __self: this
              },
              _react2.default.createElement(_KeyframeSVG2.default, { color: options.collapsedElement ? _DefaultPalette2.default.BLUE : options.collapsedProperty ? _DefaultPalette2.default.DARK_ROCK : secondKeyframeActive ? _DefaultPalette2.default.LIGHTEST_PINK : _DefaultPalette2.default.ROCK, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1987
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
      var _this20 = this;

      // const activeInfo = setActiveContents(propertyName, curr, next, false, this.state.timeDisplayMode === 'frames')
      var uniqueKey = propertyName + '-' + index + '-' + curr.ms;
      var isSelected = false;
      if (this.state.selectedSegments[componentId + '-' + propertyName + '-' + curr.index] != undefined) isSelected = true;

      return _react2.default.createElement(
        'span',
        {
          ref: function ref(domElement) {
            _this20[uniqueKey] = domElement;
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
            _this20.ctxmenu.show({
              type: 'keyframe-segment',
              frameInfo: frameInfo,
              event: ctxMenuEvent.nativeEvent,
              componentId: componentId,
              timelineName: _this20.state.currentTimelineName,
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
            var selectedSegments = _this20.state.selectedSegments;
            var selectedKeyframes = _this20.state.selectedKeyframes;
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
            _this20.setState({ selectedSegments: selectedSegments, selectedKeyframes: selectedKeyframes });
          },
          style: {
            position: 'absolute',
            left: pxOffsetLeft + 4,
            width: pxOffsetRight - pxOffsetLeft,
            height: this.state.rowHeight
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2009
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
            lineNumber: 2068
          },
          __self: this
        })
      );
    }
  }, {
    key: 'renderPropertyTimelineSegments',
    value: function renderPropertyTimelineSegments(frameInfo, item, index, height, allItems, reifiedBytecode) {
      var _this21 = this;

      var componentId = item.node.attributes['haiku-id'];
      var elementName = _typeof(item.node.elementName) === 'object' ? 'div' : item.node.elementName;
      var propertyName = item.property.name;
      var isActivated = this.isRowActivated(item);

      return this.mapVisiblePropertyTimelineSegments(frameInfo, componentId, elementName, propertyName, reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
        var segmentPieces = [];

        if (curr.curve) {
          segmentPieces.push(_this21.renderTransitionBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { isActivated: isActivated }));
        } else {
          if (next) {
            segmentPieces.push(_this21.renderConstantBody(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, {}));
          }
          if (!prev || !prev.curve) {
            segmentPieces.push(_this21.renderSoloKeyframe(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { isActivated: isActivated }));
          }
        }

        if (prev) {
          segmentPieces.push(_this21.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft - 10, 4, 'left', {}));
        }
        segmentPieces.push(_this21.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft, 5, 'middle', {}));
        if (next) {
          segmentPieces.push(_this21.renderInvisibleKeyframeDragger(frameInfo, componentId, elementName, propertyName, reifiedBytecode, prev, curr, next, pxOffsetLeft + 10, 6, 'right', {}));
        }

        return _react2.default.createElement(
          'div',
          {
            key: 'keyframe-container-' + componentId + '-' + propertyName + '-' + index,
            className: 'keyframe-container', __source: {
              fileName: _jsxFileName,
              lineNumber: 2113
            },
            __self: _this21
          },
          segmentPieces
        );
      });
    }

    // ---------

  }, {
    key: 'renderGauge',
    value: function renderGauge(frameInfo) {
      var _this22 = this;

      if (this.state.timeDisplayMode === 'frames') {
        return this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          if (frameNumber === 0 || frameNumber % frameModulus === 0) {
            return _react2.default.createElement(
              'span',
              { key: 'frame-' + frameNumber, style: { pointerEvents: 'none', display: 'inline-block', position: 'absolute', left: pixelOffsetLeft, transform: 'translateX(-50%)' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2129
                },
                __self: _this22
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2130
                  },
                  __self: _this22
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
                  lineNumber: 2139
                },
                __self: _this22
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2140
                  },
                  __self: _this22
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
                  lineNumber: 2145
                },
                __self: _this22
              },
              _react2.default.createElement(
                'span',
                { style: { fontWeight: 'bold' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2146
                  },
                  __self: _this22
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
      var _this23 = this;

      var guideHeight = this.refs.scrollview && this.refs.scrollview.clientHeight - 25 || 0;
      return _react2.default.createElement(
        'div',
        { id: 'frame-grid', __source: {
            fileName: _jsxFileName,
            lineNumber: 2157
          },
          __self: this
        },
        this.mapVisibleFrames(function (frameNumber, pixelOffsetLeft, pixelsPerFrame, frameModulus) {
          return _react2.default.createElement('span', { key: 'frame-' + frameNumber, style: { height: guideHeight + 35, borderLeft: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.COAL).fade(0.65), position: 'absolute', left: pixelOffsetLeft, top: 34 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2159
            },
            __self: _this23
          });
        })
      );
    }
  }, {
    key: 'renderScrubber',
    value: function renderScrubber() {
      var _this24 = this;

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
            _this24.setState({
              inputFocused: null,
              inputSelected: null,
              scrubberDragStart: dragData.x,
              frameBaseline: _this24.state.currentFrame,
              avoidTimelinePointerEvents: true
            });
          },
          onStop: function onStop(dragEvent, dragData) {
            setTimeout(function () {
              _this24.setState({ scrubberDragStart: null, frameBaseline: _this24.state.currentFrame, avoidTimelinePointerEvents: false });
            }, 100);
          },
          onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
            _this24.changeScrubberPosition(dragData.x, frameInfo);
          }, THROTTLE_TIME), __source: {
            fileName: _jsxFileName,
            lineNumber: 2172
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2191
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
                lineNumber: 2192
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
                lineNumber: 2205
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
                lineNumber: 2215
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
              lineNumber: 2227
            },
            __self: this
          })
        )
      );
    }
  }, {
    key: 'renderDurationModifier',
    value: function renderDurationModifier() {
      var _this25 = this;

      var frameInfo = this.getFrameInfo();
      // var trimAreaHeight = (this.refs.scrollview && this.refs.scrollview.clientHeight - 25) || 0
      var pxOffset = this.state.dragIsAdding ? 0 : -this.state.durationTrim * frameInfo.pxpf;

      if (frameInfo.friB >= frameInfo.friMax2 || this.state.dragIsAdding) {
        return _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this25.setState({
                inputSelected: null,
                inputFocused: null,
                durationDragStart: dragData.x,
                durationTrim: 0
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              var currentMax = _this25.state.maxFrame ? _this25.state.maxFrame : frameInfo.friMax2;
              clearInterval(_this25.state.addInterval);
              _this25.setState({ maxFrame: currentMax + _this25.state.durationTrim, dragIsAdding: false, addInterval: null });
              setTimeout(function () {
                _this25.setState({ durationDragStart: null, durationTrim: 0 });
              }, 100);
            },
            onDrag: function onDrag(dragEvent, dragData) {
              _this25.changeDurationModifierPosition(dragData.x, frameInfo);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2250
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { position: 'absolute', right: pxOffset, top: 0, zIndex: 1006 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2269
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
                lineNumber: 2270
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
                lineNumber: 2283
              },
              __self: this
            })
          )
        );
      } else {
        return _react2.default.createElement('span', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 2297
          },
          __self: this
        });
      }
    }
  }, {
    key: 'renderTopControls',
    value: function renderTopControls() {
      var _this26 = this;

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
            lineNumber: 2304
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
              lineNumber: 2317
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
                lineNumber: 2326
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { display: 'inline-block', height: 24, padding: 4, fontWeight: 'lighter', fontSize: 19 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2338
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2340
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
                    lineNumber: 2341
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
                lineNumber: 2345
              },
              __self: this
            },
            _react2.default.createElement(
              'div',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2360
                },
                __self: this
              },
              this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
                'span',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2362
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
                    lineNumber: 2363
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
                  lineNumber: 2366
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
                lineNumber: 2368
              },
              __self: this
            },
            this.state.timeDisplayMode === 'frames' ? _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2385
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                { style: { color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2386
                  },
                  __self: this
                },
                'FRAMES',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2387
                  },
                  __self: this
                })
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2389
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
                  lineNumber: 2391
                },
                __self: this
              },
              _react2.default.createElement(
                'div',
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2392
                  },
                  __self: this
                },
                'FRAMES'
              ),
              _react2.default.createElement(
                'div',
                { style: { marginTop: '-2px', color: _DefaultPalette2.default.ROCK, position: 'relative' }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2393
                  },
                  __self: this
                },
                'SECONDS',
                _react2.default.createElement('span', { style: { width: 6, height: 6, backgroundColor: _DefaultPalette2.default.ROCK, borderRadius: '50%', position: 'absolute', right: -11, top: 2 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2394
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
              if (_this26.state.scrubberDragStart === null || _this26.state.scrubberDragStart === undefined) {
                var leftX = clickEvent.nativeEvent.offsetX;
                var frameX = Math.round(leftX / frameInfo.pxpf);
                var newFrame = frameInfo.friA + frameX;
                _this26.setState({
                  inputSelected: null,
                  inputFocused: null
                });
                _this26._component.getCurrentTimeline().seek(newFrame);
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
              lineNumber: 2401
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
      var _this27 = this;

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
            lineNumber: 2438
          },
          __self: this
        },
        _react2.default.createElement(
          _reactDraggable.DraggableCore,
          {
            axis: 'x',
            onStart: function onStart(dragEvent, dragData) {
              _this27.setState({
                scrollerBodyDragStart: dragData.x,
                scrollbarStart: _this27.state.visibleFrameRange[0],
                scrollbarEnd: _this27.state.visibleFrameRange[1],
                avoidTimelinePointerEvents: true
              });
            },
            onStop: function onStop(dragEvent, dragData) {
              _this27.setState({
                scrollerBodyDragStart: false,
                scrollbarStart: null,
                scrollbarEnd: null,
                avoidTimelinePointerEvents: false
              });
            },
            onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
              _this27.setState({ showHorzScrollShadow: frameInfo.scA > 0 }); // if the scrollbar not at position zero, show inner shadow for timeline area
              if (!_this27.state.scrollerLeftDragStart && !_this27.state.scrollerRightDragStart) {
                _this27.changeVisibleFrameRange(dragData.x, dragData.x, frameInfo);
              }
            }, THROTTLE_TIME), __source: {
              fileName: _jsxFileName,
              lineNumber: 2448
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
                lineNumber: 2472
              },
              __self: this
            },
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this27.setState({ scrollerLeftDragStart: dragData.x, scrollbarStart: _this27.state.visibleFrameRange[0], scrollbarEnd: _this27.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this27.setState({ scrollerLeftDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this27.changeVisibleFrameRange(dragData.x + frameInfo.scA, 0, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2482
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', left: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2487
                },
                __self: this
              })
            ),
            _react2.default.createElement(
              _reactDraggable.DraggableCore,
              {
                axis: 'x',
                onStart: function onStart(dragEvent, dragData) {
                  _this27.setState({ scrollerRightDragStart: dragData.x, scrollbarStart: _this27.state.visibleFrameRange[0], scrollbarEnd: _this27.state.visibleFrameRange[1] });
                },
                onStop: function onStop(dragEvent, dragData) {
                  _this27.setState({ scrollerRightDragStart: false, scrollbarStart: null, scrollbarEnd: null });
                },
                onDrag: _lodash2.default.throttle(function (dragEvent, dragData) {
                  _this27.changeVisibleFrameRange(0, dragData.x + frameInfo.scA, frameInfo);
                }, THROTTLE_TIME), __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2489
                },
                __self: this
              },
              _react2.default.createElement('div', { style: { width: 10, height: 10, position: 'absolute', cursor: 'ew-resize', right: 0, borderRadius: '50%', backgroundColor: _DefaultPalette2.default.SUNSTONE }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2494
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
              lineNumber: 2498
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
              lineNumber: 2499
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
            lineNumber: 2514
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
            lineNumber: 2541
          },
          __self: this
        },
        (0, _truncate2.default)(node.attributes['haiku-title'] || elementName, 12)
      ) : _react2.default.createElement(
        'span',
        { className: 'no-select', __source: {
            fileName: _jsxFileName,
            lineNumber: 2544
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
              lineNumber: 2545
            },
            __self: this
          },
          _react2.default.createElement('span', { style: { marginLeft: 5, backgroundColor: _DefaultPalette2.default.GRAY_FIT1, position: 'absolute', width: 1, height: height }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2556
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            { style: { marginLeft: 4 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2557
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
              lineNumber: 2559
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
      var _this28 = this;

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
              _this28.collapseNode(item.node, componentId);
              _this28.props.websocket.action('unselectElement', [_this28.props.folder, componentId], function () {});
            } else {
              _this28.expandNode(item.node, componentId);
              _this28.props.websocket.action('selectElement', [_this28.props.folder, componentId], function () {});
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
            lineNumber: 2574
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
            lineNumber: 2601
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
              lineNumber: 2609
            },
            __self: this
          },
          _react2.default.createElement(
            'div',
            { style: { height: height, marginTop: -6 }, __source: {
                fileName: _jsxFileName,
                lineNumber: 2617
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
                  lineNumber: 2618
                },
                __self: this
              },
              item.node.__isExpanded ? _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 1, left: -1 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2623
                  },
                  __self: this
                },
                _react2.default.createElement(_DownCarrotSVG2.default, { color: _DefaultPalette2.default.ROCK, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2623
                  },
                  __self: this
                })
              ) : _react2.default.createElement(
                'span',
                { className: 'utf-icon', style: { top: 3 }, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2624
                  },
                  __self: this
                },
                _react2.default.createElement(_RightCarrotSVG2.default, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 2624
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
              lineNumber: 2630
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
      var _this29 = this;

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
            lineNumber: 2645
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            onClick: function onClick() {
              // Collapse this cluster if the arrow or name is clicked
              var expandedPropertyClusters = _lodash2.default.clone(_this29.state.expandedPropertyClusters);
              expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
              _this29.setState({
                inputSelected: null, // Deselct any selected input
                inputFocused: null, // Cancel any pending change inside a focused input
                expandedPropertyClusters: expandedPropertyClusters
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2655
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
                lineNumber: 2667
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -4, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2677
                },
                __self: this
              },
              _react2.default.createElement(_DownCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2677
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
              lineNumber: 2682
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
                lineNumber: 2691
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
                  lineNumber: 2704
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
              lineNumber: 2718
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
              lineNumber: 2727
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
              _this29.ctxmenu.show({
                type: 'property-row',
                frameInfo: frameInfo,
                event: ctxMenuEvent.nativeEvent,
                componentId: componentId,
                propertyName: propertyName,
                timelineName: _this29.state.currentTimelineName,
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
              if (!_this29.state.activatedRows[key]) {
                var activatedRows = {};
                activatedRows[key] = true;
                _this29.setState({ activatedRows: activatedRows });
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
              lineNumber: 2742
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
      var _this30 = this;

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
            var expandedPropertyClusters = _lodash2.default.clone(_this30.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this30.setState({
              inputSelected: null,
              inputFocused: null,
              expandedPropertyClusters: expandedPropertyClusters
            });
          },
          onContextMenu: function onContextMenu(ctxMenuEvent) {
            ctxMenuEvent.stopPropagation();
            var expandedPropertyClusters = _lodash2.default.clone(_this30.state.expandedPropertyClusters);
            expandedPropertyClusters[item.clusterKey] = !expandedPropertyClusters[item.clusterKey];
            _this30.setState({
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
            lineNumber: 2793
          },
          __self: this
        },
        _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 2824
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
              lineNumber: 2826
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
                lineNumber: 2834
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { className: 'utf-icon', style: { top: -2, left: -3 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2841
                },
                __self: this
              },
              _react2.default.createElement(_RightCarrotSVG2.default, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 2841
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
                lineNumber: 2843
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
                  lineNumber: 2853
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
              lineNumber: 2862
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
              lineNumber: 2871
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
              lineNumber: 2885
            },
            __self: this
          },
          this.mapVisibleComponentTimelineSegments(frameInfo, componentId, elementName, [item], reifiedBytecode, function (prev, curr, next, pxOffsetLeft, pxOffsetRight, index) {
            var segmentPieces = [];
            if (curr.curve) {
              segmentPieces.push(_this30.renderTransitionBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 1, { collapsed: true, collapsedProperty: true }));
            } else {
              if (next) {
                segmentPieces.push(_this30.renderConstantBody(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 2, { collapsed: true, collapsedProperty: true }));
              }
              if (!prev || !prev.curve) {
                segmentPieces.push(_this30.renderSoloKeyframe(frameInfo, componentId, elementName, curr.name, reifiedBytecode, prev, curr, next, pxOffsetLeft, pxOffsetRight, 3, { collapsed: true, collapsedProperty: true }));
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
      var _this31 = this;

      if (!this.state.didMount) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 2916
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
            lineNumber: 2919
          },
          __self: this
        },
        items.map(function (item, index) {
          var propertyOnLastComponent = item.siblings.length > 0 && item.index === item.siblings.length - 1;
          if (item.isCluster) {
            return _this31.renderClusterRow(item, index, _this31.state.rowHeight, items, propertyOnLastComponent);
          } else if (item.isProperty) {
            return _this31.renderPropertyRow(item, index, _this31.state.rowHeight, items, propertyOnLastComponent);
          } else {
            return _this31.renderComponentHeadingRow(item, index, _this31.state.rowHeight, items);
          }
        })
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this32 = this;

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
            lineNumber: 2941
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
            lineNumber: 2957
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
              _this32.setState({ selectedKeyframes: {}, selectedSegments: {} });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 2968
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

            _this32.executeBytecodeActionCreateKeyframe((0, _ItemHelpers.getItemComponentId)(_this32.state.inputFocused), _this32.state.currentTimelineName, _this32.state.inputFocused.node.elementName, (0, _ItemHelpers.getItemPropertyName)(_this32.state.inputFocused), _this32.getCurrentTimelineTime(_this32.getFrameInfo()), committedValue, void 0, // curve
            void 0, // endMs
            void 0 // endValue
            );
          },
          onFocusRequested: function onFocusRequested() {
            _this32.setState({
              inputFocused: _this32.state.inputSelected
            });
          },
          onNavigateRequested: function onNavigateRequested(navDir, doFocus) {
            var item = _this32.state.inputSelected;
            var next = (0, _ItemHelpers.nextPropItem)(item, navDir);
            if (next) {
              _this32.setState({
                inputFocused: doFocus ? next : null,
                inputSelected: next
              });
            }
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 2988
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL1RpbWVsaW5lLmpzIl0sIm5hbWVzIjpbImVsZWN0cm9uIiwicmVxdWlyZSIsIndlYkZyYW1lIiwic2V0Wm9vbUxldmVsTGltaXRzIiwic2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzIiwiREVGQVVMVFMiLCJwcm9wZXJ0aWVzV2lkdGgiLCJ0aW1lbGluZXNXaWR0aCIsInJvd0hlaWdodCIsImlucHV0Q2VsbFdpZHRoIiwibWV0ZXJIZWlnaHQiLCJjb250cm9sc0hlaWdodCIsInZpc2libGVGcmFtZVJhbmdlIiwiY3VycmVudEZyYW1lIiwibWF4RnJhbWUiLCJkdXJhdGlvblRyaW0iLCJmcmFtZXNQZXJTZWNvbmQiLCJ0aW1lRGlzcGxheU1vZGUiLCJjdXJyZW50VGltZWxpbmVOYW1lIiwiaXNQbGF5ZXJQbGF5aW5nIiwicGxheWVyUGxheWJhY2tTcGVlZCIsImlzU2hpZnRLZXlEb3duIiwiaXNDb21tYW5kS2V5RG93biIsImlzQ29udHJvbEtleURvd24iLCJpc0FsdEtleURvd24iLCJhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyIsInNob3dIb3J6U2Nyb2xsU2hhZG93Iiwic2VsZWN0ZWROb2RlcyIsImV4cGFuZGVkTm9kZXMiLCJhY3RpdmF0ZWRSb3dzIiwiaGlkZGVuTm9kZXMiLCJpbnB1dFNlbGVjdGVkIiwiaW5wdXRGb2N1c2VkIiwiZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzIiwic2VsZWN0ZWRLZXlmcmFtZXMiLCJzZWxlY3RlZFNlZ21lbnRzIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiQ1VSVkVTVkdTIiwiRWFzZUluQmFja1NWRyIsIkVhc2VJbkJvdW5jZVNWRyIsIkVhc2VJbkNpcmNTVkciLCJFYXNlSW5DdWJpY1NWRyIsIkVhc2VJbkVsYXN0aWNTVkciLCJFYXNlSW5FeHBvU1ZHIiwiRWFzZUluUXVhZFNWRyIsIkVhc2VJblF1YXJ0U1ZHIiwiRWFzZUluUXVpbnRTVkciLCJFYXNlSW5TaW5lU1ZHIiwiRWFzZUluT3V0QmFja1NWRyIsIkVhc2VJbk91dEJvdW5jZVNWRyIsIkVhc2VJbk91dENpcmNTVkciLCJFYXNlSW5PdXRDdWJpY1NWRyIsIkVhc2VJbk91dEVsYXN0aWNTVkciLCJFYXNlSW5PdXRFeHBvU1ZHIiwiRWFzZUluT3V0UXVhZFNWRyIsIkVhc2VJbk91dFF1YXJ0U1ZHIiwiRWFzZUluT3V0UXVpbnRTVkciLCJFYXNlSW5PdXRTaW5lU1ZHIiwiRWFzZU91dEJhY2tTVkciLCJFYXNlT3V0Qm91bmNlU1ZHIiwiRWFzZU91dENpcmNTVkciLCJFYXNlT3V0Q3ViaWNTVkciLCJFYXNlT3V0RWxhc3RpY1NWRyIsIkVhc2VPdXRFeHBvU1ZHIiwiRWFzZU91dFF1YWRTVkciLCJFYXNlT3V0UXVhcnRTVkciLCJFYXNlT3V0UXVpbnRTVkciLCJFYXNlT3V0U2luZVNWRyIsIkxpbmVhclNWRyIsIkFMTE9XRURfUFJPUFMiLCJDTFVTVEVSRURfUFJPUFMiLCJDTFVTVEVSX05BTUVTIiwiQUxMT1dFRF9QUk9QU19UT1BfTEVWRUwiLCJBTExPV0VEX1RBR05BTUVTIiwiZGl2Iiwic3ZnIiwiZyIsInJlY3QiLCJjaXJjbGUiLCJlbGxpcHNlIiwibGluZSIsInBvbHlsaW5lIiwicG9seWdvbiIsIlRIUk9UVExFX1RJTUUiLCJ2aXNpdCIsIm5vZGUiLCJ2aXNpdG9yIiwiY2hpbGRyZW4iLCJpIiwibGVuZ3RoIiwiY2hpbGQiLCJUaW1lbGluZSIsInByb3BzIiwic3RhdGUiLCJhc3NpZ24iLCJjdHhtZW51Iiwid2luZG93IiwiZW1pdHRlcnMiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJlbnZveSIsIldlYlNvY2tldCIsImRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiIsInRocm90dGxlIiwiYmluZCIsInVwZGF0ZVN0YXRlIiwiaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyIsInRpbWVsaW5lIiwiZGlkTW91bnQiLCJPYmplY3QiLCJrZXlzIiwidXBkYXRlcyIsImtleSIsImNoYW5nZXMiLCJjYnMiLCJjYWxsYmFja3MiLCJzcGxpY2UiLCJzZXRTdGF0ZSIsImNsZWFyQ2hhbmdlcyIsImZvckVhY2giLCJjYiIsInB1c2giLCJmbHVzaFVwZGF0ZXMiLCJrMSIsImsyIiwiY29tcG9uZW50SWQiLCJwcm9wZXJ0eU5hbWUiLCJfcm93Q2FjaGVBY3RpdmF0aW9uIiwidHVwbGUiLCJyZW1vdmVMaXN0ZW5lciIsInRvdXJDbGllbnQiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJkb2N1bWVudCIsImJvZHkiLCJjbGllbnRXaWR0aCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRFbWl0dGVyTGlzdGVuZXIiLCJtZXNzYWdlIiwibmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJvbiIsIm1ldGhvZCIsInBhcmFtcyIsImNvbnNvbGUiLCJpbmZvIiwiY2FsbE1ldGhvZCIsIm1heWJlQ29tcG9uZW50SWRzIiwibWF5YmVUaW1lbGluZU5hbWUiLCJtYXliZVRpbWVsaW5lVGltZSIsIm1heWJlUHJvcGVydHlOYW1lcyIsIm1heWJlTWV0YWRhdGEiLCJfY2xlYXJDYWNoZXMiLCJnZXRSZWlmaWVkQnl0ZWNvZGUiLCJnZXRTZXJpYWxpemVkQnl0ZWNvZGUiLCJmcm9tIiwibWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZSIsIm1pbmlvblNlbGVjdEVsZW1lbnQiLCJtaW5pb25VbnNlbGVjdEVsZW1lbnQiLCJyZWh5ZHJhdGVCeXRlY29kZSIsImNsaWVudCIsInNldFRpbWVvdXQiLCJuZXh0IiwicGFzdGVFdmVudCIsInRhZ25hbWUiLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJlZGl0YWJsZSIsImdldEF0dHJpYnV0ZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJkYXRhIiwiaGFuZGxlS2V5RG93biIsImhhbmRsZUtleVVwIiwidGltZWxpbmVOYW1lIiwiZWxlbWVudE5hbWUiLCJzdGFydE1zIiwiZnJhbWVJbmZvIiwiZ2V0RnJhbWVJbmZvIiwibmVhcmVzdEZyYW1lIiwibXNwZiIsImZpbmFsTXMiLCJNYXRoIiwicm91bmQiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCIsImVuZE1zIiwiY3VydmVOYW1lIiwiY2hhbmdlTXVsdGlwbGVTZWdtZW50Q3VydmVzIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUiLCJtcyIsImhhbmRsZSIsImtleWZyYW1lSW5kZXgiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyIsIl90aW1lbGluZXMiLCJ1cGRhdGVUaW1lIiwiZnJpTWF4IiwiZ2V0Q3VycmVudFRpbWVsaW5lIiwic2Vla0FuZFBhdXNlIiwiZnJpQiIsImZyaUEiLCJ0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UiLCJzZWxlY3RvciIsIndlYnZpZXciLCJlbGVtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiZXJyb3IiLCJuYXRpdmVFdmVudCIsInJlZnMiLCJleHByZXNzaW9uSW5wdXQiLCJ3aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQiLCJrZXlDb2RlIiwidG9nZ2xlUGxheWJhY2siLCJ3aGljaCIsInVwZGF0ZVNjcnViYmVyUG9zaXRpb24iLCJ1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSIsImlzRW1wdHkiLCJ1cGRhdGVLZXlib2FyZFN0YXRlIiwiZXZlbnRFbWl0dGVyIiwiZXZlbnROYW1lIiwiZXZlbnRIYW5kbGVyIiwiX19pc1NlbGVjdGVkIiwiY2xvbmUiLCJhdHRyaWJ1dGVzIiwidHJlZVVwZGF0ZSIsIkRhdGUiLCJub3ciLCJzY3JvbGx2aWV3Iiwic2Nyb2xsVG9wIiwicm93c0RhdGEiLCJjb21wb25lbnRSb3dzRGF0YSIsImZvdW5kSW5kZXgiLCJpbmRleENvdW50ZXIiLCJyb3dJbmZvIiwiaW5kZXgiLCJpc0hlYWRpbmciLCJpc1Byb3BlcnR5IiwiX19pc0V4cGFuZGVkIiwiZG9tTm9kZSIsImN1cnRvcCIsIm9mZnNldFBhcmVudCIsIm9mZnNldFRvcCIsInBhcmVudCIsImV4cGFuZE5vZGUiLCJyb3ciLCJwcm9wZXJ0eSIsIml0ZW0iLCJkcmFnWCIsImRyYWdTdGFydCIsInNjcnViYmVyRHJhZ1N0YXJ0IiwiZnJhbWVCYXNlbGluZSIsImRyYWdEZWx0YSIsImZyYW1lRGVsdGEiLCJweHBmIiwic2VlayIsImR1cmF0aW9uRHJhZ1N0YXJ0IiwiYWRkSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImN1cnJlbnRNYXgiLCJmcmlNYXgyIiwiZHJhZ0lzQWRkaW5nIiwiY2xlYXJJbnRlcnZhbCIsInhsIiwieHIiLCJhYnNMIiwiYWJzUiIsInNjcm9sbGVyTGVmdERyYWdTdGFydCIsInNjcm9sbGVyUmlnaHREcmFnU3RhcnQiLCJzY3JvbGxlckJvZHlEcmFnU3RhcnQiLCJvZmZzZXRMIiwic2Nyb2xsYmFyU3RhcnQiLCJzY1JhdGlvIiwib2Zmc2V0UiIsInNjcm9sbGJhckVuZCIsImRpZmZYIiwiZkwiLCJmUiIsImZyaTAiLCJkZWx0YSIsImwiLCJyIiwic3BhbiIsIm5ld0wiLCJuZXdSIiwic3RhcnRWYWx1ZSIsIm1heWJlQ3VydmUiLCJlbmRWYWx1ZSIsImNyZWF0ZUtleWZyYW1lIiwiZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUiLCJnZXQiLCJhY3Rpb24iLCJzcGxpdFNlZ21lbnQiLCJrZXlmcmFtZXMiLCJlYWNoIiwiayIsImRlbGV0ZUtleWZyYW1lIiwia2V5ZnJhbWVEcmFnU3RhcnRQeCIsImtleWZyYW1lRHJhZ1N0YXJ0TXMiLCJ0cmFuc2l0aW9uQm9keURyYWdnaW5nIiwicyIsImhhc0N1cnZlIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uSm9pbktleWZyYW1lcyIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZSIsImpvaW5LZXlmcmFtZXMiLCJjdXJ2ZUZvcldpcmUiLCJjaGFuZ2VTZWdtZW50Q3VydmUiLCJvbGRTdGFydE1zIiwib2xkRW5kTXMiLCJuZXdTdGFydE1zIiwibmV3RW5kTXMiLCJjaGFuZ2VTZWdtZW50RW5kcG9pbnRzIiwib2xkVGltZWxpbmVOYW1lIiwibmV3VGltZWxpbmVOYW1lIiwicmVuYW1lVGltZWxpbmUiLCJjcmVhdGVUaW1lbGluZSIsImR1cGxpY2F0ZVRpbWVsaW5lIiwiZGVsZXRlVGltZWxpbmUiLCJjaGFuZ2VNcyIsImFkanVzdGVkTXMiLCJwYXJzZUludCIsImtleWZyYW1lTW92ZXMiLCJtb3ZlU2VnbWVudEVuZHBvaW50cyIsIl9rZXlmcmFtZU1vdmVzIiwibW92ZW1lbnRLZXkiLCJqb2luIiwia2V5ZnJhbWVNb3Zlc0ZvcldpcmUiLCJwYXVzZSIsInBsYXkiLCJ0ZW1wbGF0ZSIsInZpc2l0VGVtcGxhdGUiLCJpZCIsIl9faXNIaWRkZW4iLCJmb3VuZCIsInNlbGVjdE5vZGUiLCJzY3JvbGxUb05vZGUiLCJmaW5kTm9kZXNCeUNvbXBvbmVudElkIiwiZGVzZWxlY3ROb2RlIiwiY29sbGFwc2VOb2RlIiwic2Nyb2xsVG9Ub3AiLCJwcm9wZXJ0eU5hbWVzIiwicmVsYXRlZEVsZW1lbnQiLCJmaW5kRWxlbWVudEluVGVtcGxhdGUiLCJ3YXJuIiwiYWxsUm93cyIsImluZGV4T2YiLCJhY3RpdmF0ZVJvdyIsImRlYWN0aXZhdGVSb3ciLCJsb2NhdG9yIiwic2libGluZ3MiLCJpdGVyYXRlZSIsIm1hcHBlZE91dHB1dCIsImxlZnRGcmFtZSIsInJpZ2h0RnJhbWUiLCJmcmFtZU1vZHVsdXMiLCJpdGVyYXRpb25JbmRleCIsImZyYW1lTnVtYmVyIiwicGl4ZWxPZmZzZXRMZWZ0IiwibWFwT3V0cHV0IiwibXNNb2R1bHVzIiwibGVmdE1zIiwicmlnaHRNcyIsInRvdGFsTXMiLCJmaXJzdE1hcmtlciIsIm1zTWFya2VyVG1wIiwibXNNYXJrZXJzIiwibXNNYXJrZXIiLCJtc1JlbWFpbmRlciIsImZsb29yIiwiZnJhbWVPZmZzZXQiLCJweE9mZnNldCIsImZwcyIsIm1heG1zIiwibWF4ZiIsImZyaVciLCJhYnMiLCJwU2NyeHBmIiwicHhBIiwicHhCIiwicHhNYXgyIiwibXNBIiwibXNCIiwic2NMIiwic2NBIiwic2NCIiwiYXJjaHlGb3JtYXQiLCJnZXRBcmNoeUZvcm1hdE5vZGVzIiwiYXJjaHlTdHIiLCJsYWJlbCIsIm5vZGVzIiwiZmlsdGVyIiwibWFwIiwiYXNjaWlTeW1ib2xzIiwiZ2V0QXNjaWlUcmVlIiwic3BsaXQiLCJjb21wb25lbnRSb3dzIiwiYWRkcmVzc2FibGVBcnJheXNDYWNoZSIsInZpc2l0b3JJdGVyYXRpb25zIiwiaXNDb21wb25lbnQiLCJzb3VyY2UiLCJhc2NpaUJyYW5jaCIsImhlYWRpbmdSb3ciLCJwcm9wZXJ0eVJvd3MiLCJfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMiLCJfYnVpbGRET01BZGRyZXNzYWJsZXMiLCJjbHVzdGVySGVhZGluZ3NGb3VuZCIsInByb3BlcnR5R3JvdXBEZXNjcmlwdG9yIiwicHJvcGVydHlSb3ciLCJjbHVzdGVyIiwiY2x1c3RlclByZWZpeCIsInByZWZpeCIsImNsdXN0ZXJLZXkiLCJpc0NsdXN0ZXJIZWFkaW5nIiwiaXNDbHVzdGVyTWVtYmVyIiwiY2x1c3RlclNldCIsImoiLCJuZXh0SW5kZXgiLCJuZXh0RGVzY3JpcHRvciIsImNsdXN0ZXJOYW1lIiwiaXNDbHVzdGVyIiwiaXRlbXMiLCJfaW5kZXgiLCJfaXRlbXMiLCJzZWdtZW50T3V0cHV0cyIsInZhbHVlR3JvdXAiLCJnZXRWYWx1ZUdyb3VwIiwia2V5ZnJhbWVzTGlzdCIsImtleWZyYW1lS2V5Iiwic29ydCIsImEiLCJiIiwibXNjdXJyIiwiaXNOYU4iLCJtc3ByZXYiLCJtc25leHQiLCJ1bmRlZmluZWQiLCJwcmV2IiwiY3VyciIsImZyYW1lIiwidmFsdWUiLCJjdXJ2ZSIsInB4T2Zmc2V0TGVmdCIsInB4T2Zmc2V0UmlnaHQiLCJzZWdtZW50T3V0cHV0IiwicHJvcGVydHlEZXNjcmlwdG9yIiwicHJvcGVydHlPdXRwdXRzIiwibWFwVmlzaWJsZVByb3BlcnR5VGltZWxpbmVTZWdtZW50cyIsImNvbmNhdCIsInBvc2l0aW9uIiwicmVtb3ZlVGltZWxpbmVTaGFkb3ciLCJ0aW1lbGluZXMiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSIsImV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lIiwiZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUiLCJleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSIsInNldFRpbWVsaW5lTmFtZSIsImlucHV0RXZlbnQiLCJOdW1iZXIiLCJpbnB1dEl0ZW0iLCJnZXRDdXJyZW50VGltZWxpbmVUaW1lIiwiaGVpZ2h0Iiwid2lkdGgiLCJvdmVyZmxvdyIsIm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzIiwic2VnbWVudFBpZWNlcyIsInJlbmRlclRyYW5zaXRpb25Cb2R5IiwiY29sbGFwc2VkIiwiY29sbGFwc2VkRWxlbWVudCIsInJlbmRlckNvbnN0YW50Qm9keSIsInJlbmRlclNvbG9LZXlmcmFtZSIsIm9wdGlvbnMiLCJkcmFnRXZlbnQiLCJkcmFnRGF0YSIsInNldFJvd0NhY2hlQWN0aXZhdGlvbiIsIngiLCJ1bnNldFJvd0NhY2hlQWN0aXZhdGlvbiIsInB4Q2hhbmdlIiwibGFzdFgiLCJtc0NoYW5nZSIsImRlc3RNcyIsImUiLCJzdG9wUHJvcGFnYXRpb24iLCJzaGlmdEtleSIsImN0eE1lbnVFdmVudCIsImxvY2FsT2Zmc2V0WCIsIm9mZnNldFgiLCJ0b3RhbE9mZnNldFgiLCJjbGlja2VkTXMiLCJjbGlja2VkRnJhbWUiLCJzaG93IiwiZXZlbnQiLCJzdGFydEZyYW1lIiwiZW5kRnJhbWUiLCJkaXNwbGF5IiwiekluZGV4IiwiY3Vyc29yIiwiaXNBY3RpdmUiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiQkxVRSIsImNvbGxhcHNlZFByb3BlcnR5IiwiREFSS19ST0NLIiwiTElHSFRFU1RfUElOSyIsIlJPQ0siLCJ1bmlxdWVLZXkiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsInNsaWNlIiwiYnJlYWtpbmdCb3VuZHMiLCJpbmNsdWRlcyIsIkN1cnZlU1ZHIiwiZmlyc3RLZXlmcmFtZUFjdGl2ZSIsInNlY29uZEtleWZyYW1lQWN0aXZlIiwiZG9tRWxlbWVudCIsInJlYWN0RXZlbnQiLCJzdHlsZSIsImNvbG9yIiwiR1JBWSIsIldlYmtpdFVzZXJTZWxlY3QiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kQ29sb3IiLCJTVU5TVE9ORSIsImZhZGUiLCJwYWRkaW5nVG9wIiwicmlnaHQiLCJpc1NlbGVjdGVkIiwiREFSS0VSX0dSQVkiLCJhbGxJdGVtcyIsImlzQWN0aXZhdGVkIiwiaXNSb3dBY3RpdmF0ZWQiLCJyZW5kZXJJbnZpc2libGVLZXlmcmFtZURyYWdnZXIiLCJtYXBWaXNpYmxlRnJhbWVzIiwicGl4ZWxzUGVyRnJhbWUiLCJwb2ludGVyRXZlbnRzIiwiZm9udFdlaWdodCIsIm1hcFZpc2libGVUaW1lcyIsIm1pbGxpc2Vjb25kc051bWJlciIsInRvdGFsTWlsbGlzZWNvbmRzIiwiZ3VpZGVIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJib3JkZXJMZWZ0IiwiQ09BTCIsImZyYUIiLCJzaGFmdEhlaWdodCIsImNoYW5nZVNjcnViYmVyUG9zaXRpb24iLCJib3hTaGFkb3ciLCJib3JkZXJSaWdodCIsImJvcmRlclRvcCIsImNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJtb3VzZUV2ZW50cyIsIkZBVEhFUl9DT0FMIiwidmVydGljYWxBbGlnbiIsImZvbnRTaXplIiwiYm9yZGVyQm90dG9tIiwiZmxvYXQiLCJtaW5XaWR0aCIsInRleHRBbGlnbiIsInBhZGRpbmdSaWdodCIsInBhZGRpbmciLCJST0NLX01VVEVEIiwiZm9udFN0eWxlIiwibWFyZ2luVG9wIiwidG9nZ2xlVGltZURpc3BsYXlNb2RlIiwibWFyZ2luUmlnaHQiLCJjbGlja0V2ZW50IiwibGVmdFgiLCJmcmFtZVgiLCJuZXdGcmFtZSIsInJlbmRlckZyYW1lR3JpZCIsInJlbmRlckdhdWdlIiwicmVuZGVyU2NydWJiZXIiLCJyZW5kZXJEdXJhdGlvbk1vZGlmaWVyIiwia25vYlJhZGl1cyIsImNoYW5nZVZpc2libGVGcmFtZVJhbmdlIiwiTElHSFRFU1RfR1JBWSIsImJvdHRvbSIsInJlbmRlclRpbWVsaW5lUmFuZ2VTY3JvbGxiYXIiLCJyZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMiLCJHUkFZX0ZJVDEiLCJtYXJnaW5MZWZ0IiwidGFibGVMYXlvdXQiLCJMSUdIVF9HUkFZIiwib3BhY2l0eSIsInJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmciLCJyZW5kZXJDb2xsYXBzZWRQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMiLCJwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCIsImh1bWFuTmFtZSIsInRleHRUcmFuc2Zvcm0iLCJsaW5lSGVpZ2h0IiwicmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIiwicmVuZGVyQ2x1c3RlclJvdyIsInJlbmRlclByb3BlcnR5Um93IiwicmVuZGVyQ29tcG9uZW50SGVhZGluZ1JvdyIsImdldENvbXBvbmVudFJvd3NEYXRhIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwicmVuZGVyVG9wQ29udHJvbHMiLCJyZW5kZXJDb21wb25lbnRSb3dzIiwicmVuZGVyQm90dG9tQ29udHJvbHMiLCJjb21taXR0ZWRWYWx1ZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJuYXZEaXIiLCJkb0ZvY3VzIiwiQ29tcG9uZW50IiwiYWRkcmVzc2FibGVzIiwic3RhdGVzIiwic3VmZml4IiwiZmFsbGJhY2siLCJ0eXBlZGVmIiwiZG9tU2NoZW1hIiwiZG9tRmFsbGJhY2tzIiwicHJvcGVydHlHcm91cCIs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WUFBVjtBQUxLLFdBQWhCO0FBT0Q7QUFDRjs7QUFFRCxVQUFJOGUsYUFBSixFQUFtQjtBQUNqQixZQUFJN00sZ0JBQWdCN1YsZ0JBQWdCMGlCLGNBQWNoZSxJQUE5QixDQUFwQjtBQUNBLFlBQUltUixhQUFKLEVBQW1CO0FBQ2pCNk0sd0JBQWM5TSxPQUFkLEdBQXdCO0FBQ3RCRSxvQkFBUUQsYUFEYztBQUV0Qm5SLGtCQUFNekUsY0FBYzRWLGFBQWQ7QUFGZ0IsV0FBeEI7QUFJRDs7QUFFRHNNLHFCQUFhNWUsSUFBYixDQUFrQm1mLGFBQWxCO0FBQ0Q7QUFDRjtBQUNGOztBQUVELFNBQU9QLFlBQVA7QUFDRDs7a0JBRWM5Z0IsUSIsImZpbGUiOiJUaW1lbGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IGFyY2h5IGZyb20gJ2FyY2h5J1xuaW1wb3J0IHsgRHJhZ2dhYmxlQ29yZSB9IGZyb20gJ3JlYWN0LWRyYWdnYWJsZSdcblxuaW1wb3J0IERPTVNjaGVtYSBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9wcm9wZXJ0aWVzL2RvbS9zY2hlbWEnXG5pbXBvcnQgRE9NRmFsbGJhY2tzIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3Byb3BlcnRpZXMvZG9tL2ZhbGxiYWNrcydcbmltcG9ydCBleHByZXNzaW9uVG9STyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL2V4cHJlc3Npb25Ub1JPJ1xuXG5pbXBvcnQgVGltZWxpbmVQcm9wZXJ0eSBmcm9tICdoYWlrdS1ieXRlY29kZS9zcmMvVGltZWxpbmVQcm9wZXJ0eSdcbmltcG9ydCBCeXRlY29kZUFjdGlvbnMgZnJvbSAnaGFpa3UtYnl0ZWNvZGUvc3JjL2FjdGlvbnMnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcblxuaW1wb3J0IHtcbiAgbmV4dFByb3BJdGVtLFxuICBnZXRJdGVtQ29tcG9uZW50SWQsXG4gIGdldEl0ZW1Qcm9wZXJ0eU5hbWVcbn0gZnJvbSAnLi9oZWxwZXJzL0l0ZW1IZWxwZXJzJ1xuXG5pbXBvcnQgZ2V0TWF4aW11bU1zIGZyb20gJy4vaGVscGVycy9nZXRNYXhpbXVtTXMnXG5pbXBvcnQgbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSBmcm9tICcuL2hlbHBlcnMvbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZSdcbmltcG9ydCBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXMgZnJvbSAnLi9oZWxwZXJzL2NsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcydcbmltcG9ydCBodW1hbml6ZVByb3BlcnR5TmFtZSBmcm9tICcuL2hlbHBlcnMvaHVtYW5pemVQcm9wZXJ0eU5hbWUnXG5pbXBvcnQgZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IgZnJvbSAnLi9oZWxwZXJzL2dldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yJ1xuaW1wb3J0IGdldE1pbGxpc2Vjb25kTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0TWlsbGlzZWNvbmRNb2R1bHVzJ1xuaW1wb3J0IGdldEZyYW1lTW9kdWx1cyBmcm9tICcuL2hlbHBlcnMvZ2V0RnJhbWVNb2R1bHVzJ1xuaW1wb3J0IGZvcm1hdFNlY29uZHMgZnJvbSAnLi9oZWxwZXJzL2Zvcm1hdFNlY29uZHMnXG5pbXBvcnQgcm91bmRVcCBmcm9tICcuL2hlbHBlcnMvcm91bmRVcCdcblxuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vaGVscGVycy90cnVuY2F0ZSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgS2V5ZnJhbWVTVkcgZnJvbSAnLi9pY29ucy9LZXlmcmFtZVNWRydcblxuaW1wb3J0IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluT3V0QmFja1NWRyxcbiAgRWFzZU91dEJhY2tTVkcsXG4gIEVhc2VJbkJvdW5jZVNWRyxcbiAgRWFzZUluT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlSW5FbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluT3V0RXhwb1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VJbkNpcmNTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VPdXRDaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluT3V0Q3ViaWNTVkcsXG4gIEVhc2VPdXRDdWJpY1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluT3V0UXVhZFNWRyxcbiAgRWFzZU91dFF1YWRTVkcsXG4gIEVhc2VJblF1YXJ0U1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZU91dFF1YXJ0U1ZHLFxuICBFYXNlSW5RdWludFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZUluU2luZVNWRyxcbiAgRWFzZUluT3V0U2luZVNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufSBmcm9tICcuL2ljb25zL0N1cnZlU1ZHUydcblxuaW1wb3J0IERvd25DYXJyb3RTVkcgZnJvbSAnLi9pY29ucy9Eb3duQ2Fycm90U1ZHJ1xuaW1wb3J0IFJpZ2h0Q2Fycm90U1ZHIGZyb20gJy4vaWNvbnMvUmlnaHRDYXJyb3RTVkcnXG5pbXBvcnQgQ29udHJvbHNBcmVhIGZyb20gJy4vQ29udHJvbHNBcmVhJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vQ29udGV4dE1lbnUnXG5pbXBvcnQgRXhwcmVzc2lvbklucHV0IGZyb20gJy4vRXhwcmVzc2lvbklucHV0J1xuaW1wb3J0IENsdXN0ZXJJbnB1dEZpZWxkIGZyb20gJy4vQ2x1c3RlcklucHV0RmllbGQnXG5pbXBvcnQgUHJvcGVydHlJbnB1dEZpZWxkIGZyb20gJy4vUHJvcGVydHlJbnB1dEZpZWxkJ1xuXG4vKiB6LWluZGV4IGd1aWRlXG4gIGtleWZyYW1lOiAxMDAyXG4gIHRyYW5zaXRpb24gYm9keTogMTAwMlxuICBrZXlmcmFtZSBkcmFnZ2VyczogMTAwM1xuICBpbnB1dHM6IDEwMDQsICgxMDA1IGFjdGl2ZSlcbiAgdHJpbS1hcmVhIDEwMDZcbiAgc2NydWJiZXI6IDEwMDZcbiAgYm90dG9tIGNvbnRyb2xzOiAxMDAwMCA8LSBrYS1ib29tIVxuKi9cblxudmFyIGVsZWN0cm9uID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxudmFyIHdlYkZyYW1lID0gZWxlY3Ryb24ud2ViRnJhbWVcbmlmICh3ZWJGcmFtZSkge1xuICBpZiAod2ViRnJhbWUuc2V0Wm9vbUxldmVsTGltaXRzKSB3ZWJGcmFtZS5zZXRab29tTGV2ZWxMaW1pdHMoMSwgMSlcbiAgaWYgKHdlYkZyYW1lLnNldExheW91dFpvb21MZXZlbExpbWl0cykgd2ViRnJhbWUuc2V0TGF5b3V0Wm9vbUxldmVsTGltaXRzKDAsIDApXG59XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICBwcm9wZXJ0aWVzV2lkdGg6IDMwMCxcbiAgdGltZWxpbmVzV2lkdGg6IDg3MCxcbiAgcm93SGVpZ2h0OiAyNSxcbiAgaW5wdXRDZWxsV2lkdGg6IDc1LFxuICBtZXRlckhlaWdodDogMjUsXG4gIGNvbnRyb2xzSGVpZ2h0OiA0MixcbiAgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCA2MF0sXG4gIGN1cnJlbnRGcmFtZTogMCxcbiAgbWF4RnJhbWU6IG51bGwsXG4gIGR1cmF0aW9uVHJpbTogMCxcbiAgZnJhbWVzUGVyU2Vjb25kOiA2MCxcbiAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJywgLy8gb3IgJ2ZyYW1lcydcbiAgY3VycmVudFRpbWVsaW5lTmFtZTogJ0RlZmF1bHQnLFxuICBpc1BsYXllclBsYXlpbmc6IGZhbHNlLFxuICBwbGF5ZXJQbGF5YmFja1NwZWVkOiAxLjAsXG4gIGlzU2hpZnRLZXlEb3duOiBmYWxzZSxcbiAgaXNDb21tYW5kS2V5RG93bjogZmFsc2UsXG4gIGlzQ29udHJvbEtleURvd246IGZhbHNlLFxuICBpc0FsdEtleURvd246IGZhbHNlLFxuICBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UsXG4gIHNob3dIb3J6U2Nyb2xsU2hhZG93OiBmYWxzZSxcbiAgc2VsZWN0ZWROb2Rlczoge30sXG4gIGV4cGFuZGVkTm9kZXM6IHt9LFxuICBhY3RpdmF0ZWRSb3dzOiB7fSxcbiAgaGlkZGVuTm9kZXM6IHt9LFxuICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyczoge30sXG4gIHNlbGVjdGVkS2V5ZnJhbWVzOiB7fSxcbiAgc2VsZWN0ZWRTZWdtZW50czoge30sXG4gIHJlaWZpZWRCeXRlY29kZTogbnVsbCxcbiAgc2VyaWFsaXplZEJ5dGVjb2RlOiBudWxsXG59XG5cbmNvbnN0IENVUlZFU1ZHUyA9IHtcbiAgRWFzZUluQmFja1NWRyxcbiAgRWFzZUluQm91bmNlU1ZHLFxuICBFYXNlSW5DaXJjU1ZHLFxuICBFYXNlSW5DdWJpY1NWRyxcbiAgRWFzZUluRWxhc3RpY1NWRyxcbiAgRWFzZUluRXhwb1NWRyxcbiAgRWFzZUluUXVhZFNWRyxcbiAgRWFzZUluUXVhcnRTVkcsXG4gIEVhc2VJblF1aW50U1ZHLFxuICBFYXNlSW5TaW5lU1ZHLFxuICBFYXNlSW5PdXRCYWNrU1ZHLFxuICBFYXNlSW5PdXRCb3VuY2VTVkcsXG4gIEVhc2VJbk91dENpcmNTVkcsXG4gIEVhc2VJbk91dEN1YmljU1ZHLFxuICBFYXNlSW5PdXRFbGFzdGljU1ZHLFxuICBFYXNlSW5PdXRFeHBvU1ZHLFxuICBFYXNlSW5PdXRRdWFkU1ZHLFxuICBFYXNlSW5PdXRRdWFydFNWRyxcbiAgRWFzZUluT3V0UXVpbnRTVkcsXG4gIEVhc2VJbk91dFNpbmVTVkcsXG4gIEVhc2VPdXRCYWNrU1ZHLFxuICBFYXNlT3V0Qm91bmNlU1ZHLFxuICBFYXNlT3V0Q2lyY1NWRyxcbiAgRWFzZU91dEN1YmljU1ZHLFxuICBFYXNlT3V0RWxhc3RpY1NWRyxcbiAgRWFzZU91dEV4cG9TVkcsXG4gIEVhc2VPdXRRdWFkU1ZHLFxuICBFYXNlT3V0UXVhcnRTVkcsXG4gIEVhc2VPdXRRdWludFNWRyxcbiAgRWFzZU91dFNpbmVTVkcsXG4gIExpbmVhclNWR1xufVxuXG4vKipcbiAqIEhleSEgSWYgeW91IHdhbnQgdG8gQUREIGFueSBwcm9wZXJ0aWVzIGhlcmUsIHlvdSBtaWdodCBhbHNvIG5lZWQgdG8gdXBkYXRlIHRoZSBkaWN0aW9uYXJ5IGluXG4gKiBoYWlrdS1ieXRlY29kZS9zcmMvcHJvcGVydGllcy9kb20vc2NoZW1hLFxuICogaGFpa3UtYnl0ZWNvZGUvc3JjL3Byb3BlcnRpZXMvZG9tL2ZhbGxiYWNrcyxcbiAqIG9yIHRoZXkgbWlnaHQgbm90IHNob3cgdXAgaW4gdGhlIHZpZXcuXG4gKi9cblxuY29uc3QgQUxMT1dFRF9QUk9QUyA9IHtcbiAgJ3RyYW5zbGF0aW9uLngnOiB0cnVlLFxuICAndHJhbnNsYXRpb24ueSc6IHRydWUsXG4gIC8vICd0cmFuc2xhdGlvbi56JzogdHJ1ZSwgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueic6IHRydWUsXG4gICdyb3RhdGlvbi54JzogdHJ1ZSxcbiAgJ3JvdGF0aW9uLnknOiB0cnVlLFxuICAnc2NhbGUueCc6IHRydWUsXG4gICdzY2FsZS55JzogdHJ1ZSxcbiAgJ29wYWNpdHknOiB0cnVlLFxuICAvLyAnc2hvd24nOiB0cnVlLFxuICAnYmFja2dyb3VuZENvbG9yJzogdHJ1ZVxuICAvLyAnY29sb3InOiB0cnVlLFxuICAvLyAnZmlsbCc6IHRydWUsXG4gIC8vICdzdHJva2UnOiB0cnVlXG59XG5cbmNvbnN0IENMVVNURVJFRF9QUk9QUyA9IHtcbiAgJ21vdW50LngnOiAnbW91bnQnLFxuICAnbW91bnQueSc6ICdtb3VudCcsXG4gICdtb3VudC56JzogJ21vdW50JyxcbiAgJ2FsaWduLngnOiAnYWxpZ24nLFxuICAnYWxpZ24ueSc6ICdhbGlnbicsXG4gICdhbGlnbi56JzogJ2FsaWduJyxcbiAgJ29yaWdpbi54JzogJ29yaWdpbicsXG4gICdvcmlnaW4ueSc6ICdvcmlnaW4nLFxuICAnb3JpZ2luLnonOiAnb3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uLngnOiAndHJhbnNsYXRpb24nLFxuICAndHJhbnNsYXRpb24ueSc6ICd0cmFuc2xhdGlvbicsXG4gICd0cmFuc2xhdGlvbi56JzogJ3RyYW5zbGF0aW9uJywgLy8gVGhpcyBkb2Vzbid0IHdvcmsgZm9yIHNvbWUgcmVhc29uLCBzbyBsZWF2aW5nIGl0IG91dFxuICAncm90YXRpb24ueCc6ICdyb3RhdGlvbicsXG4gICdyb3RhdGlvbi55JzogJ3JvdGF0aW9uJyxcbiAgJ3JvdGF0aW9uLnonOiAncm90YXRpb24nLFxuICAvLyAncm90YXRpb24udyc6ICdyb3RhdGlvbicsIC8vIFByb2JhYmx5IGVhc2llc3Qgbm90IHRvIGxldCB0aGUgdXNlciBoYXZlIGNvbnRyb2wgb3ZlciBxdWF0ZXJuaW9uIG1hdGhcbiAgJ3NjYWxlLngnOiAnc2NhbGUnLFxuICAnc2NhbGUueSc6ICdzY2FsZScsXG4gICdzY2FsZS56JzogJ3NjYWxlJyxcbiAgJ3NpemVNb2RlLngnOiAnc2l6ZU1vZGUnLFxuICAnc2l6ZU1vZGUueSc6ICdzaXplTW9kZScsXG4gICdzaXplTW9kZS56JzogJ3NpemVNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueCc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueSc6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwueic6ICdzaXplUHJvcG9ydGlvbmFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueCc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueSc6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwueic6ICdzaXplRGlmZmVyZW50aWFsJyxcbiAgJ3NpemVBYnNvbHV0ZS54JzogJ3NpemVBYnNvbHV0ZScsXG4gICdzaXplQWJzb2x1dGUueSc6ICdzaXplQWJzb2x1dGUnLFxuICAnc2l6ZUFic29sdXRlLnonOiAnc2l6ZUFic29sdXRlJyxcbiAgJ3N0eWxlLm92ZXJmbG93WCc6ICdvdmVyZmxvdycsXG4gICdzdHlsZS5vdmVyZmxvd1knOiAnb3ZlcmZsb3cnXG59XG5cbmNvbnN0IENMVVNURVJfTkFNRVMgPSB7XG4gICdtb3VudCc6ICdNb3VudCcsXG4gICdhbGlnbic6ICdBbGlnbicsXG4gICdvcmlnaW4nOiAnT3JpZ2luJyxcbiAgJ3RyYW5zbGF0aW9uJzogJ1Bvc2l0aW9uJyxcbiAgJ3JvdGF0aW9uJzogJ1JvdGF0aW9uJyxcbiAgJ3NjYWxlJzogJ1NjYWxlJyxcbiAgJ3NpemVNb2RlJzogJ1NpemluZyBNb2RlJyxcbiAgJ3NpemVQcm9wb3J0aW9uYWwnOiAnU2l6ZSAlJyxcbiAgJ3NpemVEaWZmZXJlbnRpYWwnOiAnU2l6ZSArLy0nLFxuICAnc2l6ZUFic29sdXRlJzogJ1NpemUnLFxuICAnb3ZlcmZsb3cnOiAnT3ZlcmZsb3cnXG59XG5cbmNvbnN0IEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMID0ge1xuICAnc2l6ZUFic29sdXRlLngnOiB0cnVlLFxuICAnc2l6ZUFic29sdXRlLnknOiB0cnVlLFxuICAvLyBFbmFibGUgdGhlc2UgYXMgc3VjaCBhIHRpbWUgYXMgd2UgY2FuIHJlcHJlc2VudCB0aGVtIHZpc3VhbGx5IGluIHRoZSBnbGFzc1xuICAvLyAnc3R5bGUub3ZlcmZsb3dYJzogdHJ1ZSxcbiAgLy8gJ3N0eWxlLm92ZXJmbG93WSc6IHRydWUsXG4gICdiYWNrZ3JvdW5kQ29sb3InOiB0cnVlLFxuICAnb3BhY2l0eSc6IHRydWVcbn1cblxuY29uc3QgQUxMT1dFRF9UQUdOQU1FUyA9IHtcbiAgZGl2OiB0cnVlLFxuICBzdmc6IHRydWUsXG4gIGc6IHRydWUsXG4gIHJlY3Q6IHRydWUsXG4gIGNpcmNsZTogdHJ1ZSxcbiAgZWxsaXBzZTogdHJ1ZSxcbiAgbGluZTogdHJ1ZSxcbiAgcG9seWxpbmU6IHRydWUsXG4gIHBvbHlnb246IHRydWVcbn1cblxuY29uc3QgVEhST1RUTEVfVElNRSA9IDE3IC8vIG1zXG5cbmZ1bmN0aW9uIHZpc2l0IChub2RlLCB2aXNpdG9yKSB7XG4gIGlmIChub2RlLmNoaWxkcmVuKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlLmNoaWxkcmVuW2ldXG4gICAgICBpZiAoY2hpbGQgJiYgdHlwZW9mIGNoaWxkICE9PSAnc3RyaW5nJykge1xuICAgICAgICB2aXNpdG9yKGNoaWxkKVxuICAgICAgICB2aXNpdChjaGlsZCwgdmlzaXRvcilcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgVGltZWxpbmUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSBsb2Rhc2guYXNzaWduKHt9LCBERUZBVUxUUylcbiAgICB0aGlzLmN0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5lbWl0dGVycyA9IFtdIC8vIEFycmF5PHtldmVudEVtaXR0ZXI6RXZlbnRFbWl0dGVyLCBldmVudE5hbWU6c3RyaW5nLCBldmVudEhhbmRsZXI6RnVuY3Rpb259PlxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ3RpbWVsaW5lJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHdlIHN0b3JlIGFjY3VtdWxhdGVkIGtleWZyYW1lIG1vdmVtZW50cywgd2UgY2FuIHNlbmQgdGhlIHdlYnNvY2tldCB1cGRhdGUgaW4gYmF0Y2hlcztcbiAgICAvLyBUaGlzIGltcHJvdmVzIHBlcmZvcm1hbmNlIGFuZCBhdm9pZHMgdW5uZWNlc3NhcnkgdXBkYXRlcyB0byB0aGUgb3ZlciB2aWV3c1xuICAgIHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uID0gbG9kYXNoLnRocm90dGxlKHRoaXMuZGVib3VuY2VkS2V5ZnJhbWVNb3ZlQWN0aW9uLmJpbmQodGhpcyksIDI1MClcbiAgICB0aGlzLnVwZGF0ZVN0YXRlID0gdGhpcy51cGRhdGVTdGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcbiAgICB3aW5kb3cudGltZWxpbmUgPSB0aGlzXG4gIH1cblxuICBmbHVzaFVwZGF0ZXMgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnVwZGF0ZXMpLmxlbmd0aCA8IDEpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnVwZGF0ZXMpIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlW2tleV0gIT09IHRoaXMudXBkYXRlc1trZXldKSB7XG4gICAgICAgIHRoaXMuY2hhbmdlc1trZXldID0gdGhpcy51cGRhdGVzW2tleV1cbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIGNicyA9IHRoaXMuY2FsbGJhY2tzLnNwbGljZSgwKVxuICAgIHRoaXMuc2V0U3RhdGUodGhpcy51cGRhdGVzLCAoKSA9PiB7XG4gICAgICB0aGlzLmNsZWFyQ2hhbmdlcygpXG4gICAgICBjYnMuZm9yRWFjaCgoY2IpID0+IGNiKCkpXG4gICAgfSlcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlICh1cGRhdGVzLCBjYikge1xuICAgIGZvciAoY29uc3Qga2V5IGluIHVwZGF0ZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlc1trZXldID0gdXBkYXRlc1trZXldXG4gICAgfVxuICAgIGlmIChjYikge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYilcbiAgICB9XG4gICAgdGhpcy5mbHVzaFVwZGF0ZXMoKVxuICB9XG5cbiAgY2xlYXJDaGFuZ2VzICgpIHtcbiAgICBmb3IgKGNvbnN0IGsxIGluIHRoaXMudXBkYXRlcykgZGVsZXRlIHRoaXMudXBkYXRlc1trMV1cbiAgICBmb3IgKGNvbnN0IGsyIGluIHRoaXMuY2hhbmdlcykgZGVsZXRlIHRoaXMuY2hhbmdlc1trMl1cbiAgfVxuXG4gIHVwZGF0ZVRpbWUgKGN1cnJlbnRGcmFtZSkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBjdXJyZW50RnJhbWUgfSlcbiAgfVxuXG4gIHNldFJvd0NhY2hlQWN0aXZhdGlvbiAoeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pIHtcbiAgICB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb24gPSB7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfVxuICAgIHJldHVybiB0aGlzLl9yb3dDYWNoZUFjdGl2YXRpb25cbiAgfVxuXG4gIHVuc2V0Um93Q2FjaGVBY3RpdmF0aW9uICh7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSkge1xuICAgIHRoaXMuX3Jvd0NhY2hlQWN0aXZhdGlvbiA9IG51bGxcbiAgICByZXR1cm4gdGhpcy5fcm93Q2FjaGVBY3RpdmF0aW9uXG4gIH1cblxuICAvKlxuICAgKiBsaWZlY3ljbGUvZXZlbnRzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICAvLyBDbGVhbiB1cCBzdWJzY3JpcHRpb25zIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzIGFuZCByZWFjdCB3YXJuaW5nc1xuICAgIHRoaXMuZW1pdHRlcnMuZm9yRWFjaCgodHVwbGUpID0+IHtcbiAgICAgIHR1cGxlWzBdLnJlbW92ZUxpc3RlbmVyKHR1cGxlWzFdLCB0dXBsZVsyXSlcbiAgICB9KVxuICAgIHRoaXMuc3RhdGUuZGlkTW91bnQgPSBmYWxzZVxuXG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG5cbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnYmVnaW4nKTtcbiAgICAvLyBTY3JvbGwuRXZlbnRzLnNjcm9sbEV2ZW50LnJlbW92ZSgnZW5kJyk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBkaWRNb3VudDogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRpbWVsaW5lc1dpZHRoOiBkb2N1bWVudC5ib2R5LmNsaWVudFdpZHRoIC0gdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGhcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5kaWRNb3VudCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHsgdGltZWxpbmVzV2lkdGg6IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggLSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCB9KVxuICAgICAgfVxuICAgIH0sIFRIUk9UVExFX1RJTUUpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5wcm9wcy53ZWJzb2NrZXQsICdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuZm9sZGVyICE9PSB0aGlzLnByb3BzLmZvbGRlcikgcmV0dXJuIHZvaWQgKDApXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzogcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gYWN0aW9uIHJlY2VpdmVkJywgbWV0aG9kLCBwYXJhbXMpXG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKG1heWJlQ29tcG9uZW50SWRzLCBtYXliZVRpbWVsaW5lTmFtZSwgbWF5YmVUaW1lbGluZVRpbWUsIG1heWJlUHJvcGVydHlOYW1lcywgbWF5YmVNZXRhZGF0YSkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGNvbXBvbmVudCB1cGRhdGVkJywgbWF5YmVDb21wb25lbnRJZHMsIG1heWJlVGltZWxpbmVOYW1lLCBtYXliZVRpbWVsaW5lVGltZSwgbWF5YmVQcm9wZXJ0eU5hbWVzLCBtYXliZU1ldGFkYXRhKVxuXG4gICAgICAvLyBJZiB3ZSBkb24ndCBjbGVhciBjYWNoZXMgdGhlbiB0aGUgdGltZWxpbmUgZmllbGRzIG1pZ2h0IG5vdCB1cGRhdGUgcmlnaHQgYWZ0ZXIga2V5ZnJhbWUgZGVsZXRpb25zXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcblxuICAgICAgdmFyIHJlaWZpZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRSZWlmaWVkQnl0ZWNvZGUoKVxuICAgICAgdmFyIHNlcmlhbGl6ZWRCeXRlY29kZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlIH0pXG5cbiAgICAgIGlmIChtYXliZU1ldGFkYXRhICYmIG1heWJlTWV0YWRhdGEuZnJvbSAhPT0gJ3RpbWVsaW5lJykge1xuICAgICAgICBpZiAobWF5YmVDb21wb25lbnRJZHMgJiYgbWF5YmVUaW1lbGluZU5hbWUgJiYgbWF5YmVQcm9wZXJ0eU5hbWVzKSB7XG4gICAgICAgICAgbWF5YmVDb21wb25lbnRJZHMuZm9yRWFjaCgoY29tcG9uZW50SWQpID0+IHtcbiAgICAgICAgICAgIHRoaXMubWluaW9uVXBkYXRlUHJvcGVydHlWYWx1ZShjb21wb25lbnRJZCwgbWF5YmVUaW1lbGluZU5hbWUsIG1heWJlVGltZWxpbmVUaW1lIHx8IDAsIG1heWJlUHJvcGVydHlOYW1lcylcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIGVsZW1lbnQgc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMubWluaW9uU2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gZWxlbWVudCB1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLm1pbmlvblVuc2VsZWN0RWxlbWVudCh7IGNvbXBvbmVudElkIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFJlaWZpZWRCeXRlY29kZSgpXG4gICAgICB2YXIgc2VyaWFsaXplZEJ5dGVjb2RlID0gdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gY29tcG9uZW50IG1vdW50ZWQnLCByZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLnJlaHlkcmF0ZUJ5dGVjb2RlKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKVxuICAgICAgLy8gdGhpcy51cGRhdGVUaW1lKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lKVxuICAgIH0pXG5cbiAgICAvLyBjb21wb25lbnQ6bW91bnRlZCBmaXJlcyB3aGVuIHRoaXMgZmluaXNoZXMgd2l0aG91dCBlcnJvclxuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKClcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgY2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjbGllbnQubmV4dCgpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIGhlYXJkJylcbiAgICAgIGxldCB0YWduYW1lID0gcGFzdGVFdmVudC50YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICBsZXQgZWRpdGFibGUgPSBwYXN0ZUV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnRlZGl0YWJsZScpIC8vIE91ciBpbnB1dCBmaWVsZHMgYXJlIDxzcGFuPnNcbiAgICAgIGlmICh0YWduYW1lID09PSAnaW5wdXQnIHx8IHRhZ25hbWUgPT09ICd0ZXh0YXJlYScgfHwgZWRpdGFibGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCdbdGltZWxpbmVdIHBhc3RlIHZpYSBkZWZhdWx0JylcbiAgICAgICAgLy8gVGhpcyBpcyBwcm9iYWJseSBhIHByb3BlcnR5IGlucHV0LCBzbyBsZXQgdGhlIGRlZmF1bHQgYWN0aW9uIGhhcHBlblxuICAgICAgICAvLyBUT0RPOiBNYWtlIHRoaXMgY2hlY2sgbGVzcyBicml0dGxlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gcGFzdGUgZGVsZWdhdGVkIHRvIHBsdW1iaW5nJylcbiAgICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleURvd24uYmluZCh0aGlzKSwgZmFsc2UpXG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXlVcC5iaW5kKHRoaXMpKVxuXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY3JlYXRlS2V5ZnJhbWUnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBmaW5hbE1zLyogdmFsdWUsIGN1cnZlLCBlbmRtcywgZW5kdmFsdWUgKi8pXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdzcGxpdFNlZ21lbnQnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHZhciBuZWFyZXN0RnJhbWUgPSBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKHN0YXJ0TXMsIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdmFyIGZpbmFsTXMgPSBNYXRoLnJvdW5kKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25TcGxpdFNlZ21lbnQoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgZmluYWxNcylcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ2pvaW5LZXlmcmFtZXMnLCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgZW5kTXMsIGN1cnZlTmFtZSkgPT4ge1xuICAgICAgaWYgKHRoaXMudG91ckNsaWVudCkgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgICAgdGhpcy5jaGFuZ2VNdWx0aXBsZVNlZ21lbnRDdXJ2ZXMoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpXG4gICAgfSlcbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLmN0eG1lbnUsICdkZWxldGVLZXlmcmFtZScsIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpID0+IHtcbiAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRGVsZXRlS2V5ZnJhbWUoe2NvbXBvbmVudElkOiB7Y29tcG9uZW50SWQsIHByb3BlcnR5TmFtZSwgbXM6IHN0YXJ0TXN9fSwgdGltZWxpbmVOYW1lKVxuICAgIH0pXG4gICAgdGhpcy5hZGRFbWl0dGVyTGlzdGVuZXIodGhpcy5jdHhtZW51LCAnY2hhbmdlU2VnbWVudEN1cnZlJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZU11bHRpcGxlU2VnbWVudEN1cnZlcyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGN1cnZlTmFtZSlcbiAgICB9KVxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuY3R4bWVudSwgJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBrZXlmcmFtZUluZGV4LCBzdGFydE1zLCBlbmRNcykgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Nb3ZlU2VnbWVudEVuZHBvaW50cyhjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpXG4gICAgfSlcblxuICAgIHRoaXMuYWRkRW1pdHRlckxpc3RlbmVyKHRoaXMuX2NvbXBvbmVudC5fdGltZWxpbmVzLCAndGltZWxpbmUtbW9kZWw6dGljaycsIChjdXJyZW50RnJhbWUpID0+IHtcbiAgICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgICB0aGlzLnVwZGF0ZVRpbWUoY3VycmVudEZyYW1lKVxuICAgICAgLy8gSWYgd2UgZ290IGEgdGljaywgd2hpY2ggb2NjdXJzIGR1cmluZyBUaW1lbGluZSBtb2RlbCB1cGRhdGluZywgdGhlbiB3ZSB3YW50IHRvIHBhdXNlIGl0IGlmIHRoZSBzY3J1YmJlclxuICAgICAgLy8gaGFzIGFycml2ZWQgYXQgdGhlIG1heGltdW0gYWNjZXB0aWJsZSBmcmFtZSBpbiB0aGUgdGltZWxpbmUuXG4gICAgICBpZiAoY3VycmVudEZyYW1lID4gZnJhbWVJbmZvLmZyaU1heCkge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2Vla0FuZFBhdXNlKGZyYW1lSW5mby5mcmlNYXgpXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUGxheWVyUGxheWluZzogZmFsc2V9KVxuICAgICAgfVxuICAgICAgLy8gSWYgb3VyIGN1cnJlbnQgZnJhbWUgaGFzIGdvbmUgb3V0c2lkZSBvZiB0aGUgaW50ZXJ2YWwgdGhhdCBkZWZpbmVzIHRoZSB0aW1lbGluZSB2aWV3cG9ydCwgdGhlblxuICAgICAgLy8gdHJ5IHRvIHJlLWFsaWduIHRoZSB0aWNrZXIgaW5zaWRlIG9mIHRoYXQgcmFuZ2VcbiAgICAgIGlmIChjdXJyZW50RnJhbWUgPj0gZnJhbWVJbmZvLmZyaUIgfHwgY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIHtcbiAgICAgICAgdGhpcy50cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UoZnJhbWVJbmZvKVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLmFkZEVtaXR0ZXJMaXN0ZW5lcih0aGlzLl9jb21wb25lbnQuX3RpbWVsaW5lcywgJ3RpbWVsaW5lLW1vZGVsOmF1dGhvcml0YXRpdmUtZnJhbWUtc2V0JywgKGN1cnJlbnRGcmFtZSkgPT4ge1xuICAgICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAgIHRoaXMudXBkYXRlVGltZShjdXJyZW50RnJhbWUpXG4gICAgICAvLyBJZiBvdXIgY3VycmVudCBmcmFtZSBoYXMgZ29uZSBvdXRzaWRlIG9mIHRoZSBpbnRlcnZhbCB0aGF0IGRlZmluZXMgdGhlIHRpbWVsaW5lIHZpZXdwb3J0LCB0aGVuXG4gICAgICAvLyB0cnkgdG8gcmUtYWxpZ24gdGhlIHRpY2tlciBpbnNpZGUgb2YgdGhhdCByYW5nZVxuICAgICAgaWYgKGN1cnJlbnRGcmFtZSA+PSBmcmFtZUluZm8uZnJpQiB8fCBjdXJyZW50RnJhbWUgPCBmcmFtZUluZm8uZnJpQSkge1xuICAgICAgICB0aGlzLnRyeVRvTGVmdEFsaWduVGlja2VySW5WaXNpYmxlRnJhbWVSYW5nZShmcmFtZUluZm8pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAndGltZWxpbmUnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ3RpbWVsaW5lJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChuYXRpdmVFdmVudCkge1xuICAgIC8vIEdpdmUgdGhlIGN1cnJlbnRseSBhY3RpdmUgZXhwcmVzc2lvbiBpbnB1dCBhIGNoYW5jZSB0byBjYXB0dXJlIHRoaXMgZXZlbnQgYW5kIHNob3J0IGNpcmN1aXQgdXMgaWYgc29cbiAgICBpZiAodGhpcy5yZWZzLmV4cHJlc3Npb25JbnB1dC53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQobmF0aXZlRXZlbnQpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdXNlciBoaXQgdGhlIHNwYWNlYmFyIF9hbmRfIHdlIGFyZW4ndCBpbnNpZGUgYW4gaW5wdXQgZmllbGQsIHRyZWF0IHRoYXQgbGlrZSBhIHBsYXliYWNrIHRyaWdnZXJcbiAgICBpZiAobmF0aXZlRXZlbnQua2V5Q29kZSA9PT0gMzIgJiYgIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0OmZvY3VzJykpIHtcbiAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIGNhc2UgMzc6IC8vIGxlZnRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzU2hpZnRLZXlEb3duKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFswLCB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdXSwgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gICAgICAgICAgICByZXR1cm4gdGhpcy51cGRhdGVUaW1lKDApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oLTEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNob3dIb3J6U2Nyb2xsU2hhZG93ICYmIHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogZmFsc2UgfSlcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlVmlzaWJsZUZyYW1lUmFuZ2UoLTEpXG4gICAgICAgIH1cblxuICAgICAgY2FzZSAzOTogLy8gcmlnaHRcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNDb21tYW5kS2V5RG93bikge1xuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVNjcnViYmVyUG9zaXRpb24oMSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2hvd0hvcnpTY3JvbGxTaGFkb3cpIHRoaXMuc2V0U3RhdGUoeyBzaG93SG9yelNjcm9sbFNoYWRvdzogdHJ1ZSB9KVxuICAgICAgICAgIHJldHVybiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKDEpXG4gICAgICAgIH1cblxuICAgICAgLy8gY2FzZSAzODogLy8gdXBcbiAgICAgIC8vIGNhc2UgNDA6IC8vIGRvd25cbiAgICAgIC8vIGNhc2UgNDY6IC8vZGVsZXRlXG4gICAgICAvLyBjYXNlIDEzOiAvL2VudGVyXG4gICAgICBjYXNlIDg6IC8vIGRlbGV0ZVxuICAgICAgICBpZiAoIWxvZGFzaC5pc0VtcHR5KHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXMpKSB7XG4gICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSh0aGlzLnN0YXRlLnNlbGVjdGVkS2V5ZnJhbWVzLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUpXG4gICAgICAgIH1cbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc1NoaWZ0S2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0FsdEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogdHJ1ZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IHRydWUgfSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiB0cnVlIH0pXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKG5hdGl2ZUV2ZW50KSB7XG4gICAgc3dpdGNoIChuYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgLy8gY2FzZSAyNzogLy9lc2NhcGVcbiAgICAgIC8vIGNhc2UgMzI6IC8vc3BhY2VcbiAgICAgIC8vIGNhc2UgMzc6IC8vbGVmdFxuICAgICAgLy8gY2FzZSAzOTogLy9yaWdodFxuICAgICAgLy8gY2FzZSAzODogLy91cFxuICAgICAgLy8gY2FzZSA0MDogLy9kb3duXG4gICAgICAvLyBjYXNlIDQ2OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSA4OiAvL2RlbGV0ZVxuICAgICAgLy8gY2FzZSAxMzogLy9lbnRlclxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzU2hpZnRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29udHJvbEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNBbHRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLnVwZGF0ZUtleWJvYXJkU3RhdGUoeyBpc0NvbW1hbmRLZXlEb3duOiBmYWxzZSB9KVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMudXBkYXRlS2V5Ym9hcmRTdGF0ZSh7IGlzQ29tbWFuZEtleURvd246IGZhbHNlIH0pXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy51cGRhdGVLZXlib2FyZFN0YXRlKHsgaXNDb21tYW5kS2V5RG93bjogZmFsc2UgfSlcbiAgICB9XG4gIH1cblxuICB1cGRhdGVLZXlib2FyZFN0YXRlICh1cGRhdGVzKSB7XG4gICAgLy8gSWYgdGhlIGlucHV0IGlzIGZvY3VzZWQsIGRvbid0IGFsbG93IGtleWJvYXJkIHN0YXRlIGNoYW5nZXMgdG8gY2F1c2UgYSByZS1yZW5kZXIsIG90aGVyd2lzZVxuICAgIC8vIHRoZSBpbnB1dCBmaWVsZCB3aWxsIHN3aXRjaCBiYWNrIHRvIGl0cyBwcmV2aW91cyBjb250ZW50cyAoZS5nLiB3aGVuIGhvbGRpbmcgZG93biAnc2hpZnQnKVxuICAgIGlmICghdGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHVwZGF0ZXMpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGtleSBpbiB1cGRhdGVzKSB7XG4gICAgICAgIHRoaXMuc3RhdGVba2V5XSA9IHVwZGF0ZXNba2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFkZEVtaXR0ZXJMaXN0ZW5lciAoZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xuICAgIHRoaXMuZW1pdHRlcnMucHVzaChbZXZlbnRFbWl0dGVyLCBldmVudE5hbWUsIGV2ZW50SGFuZGxlcl0pXG4gICAgZXZlbnRFbWl0dGVyLm9uKGV2ZW50TmFtZSwgZXZlbnRIYW5kbGVyKVxuICB9XG5cbiAgLypcbiAgICogc2V0dGVycy91cGRhdGVyc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBkZXNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgbGV0IHNlbGVjdGVkTm9kZXMgPSBsb2Rhc2guY2xvbmUodGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzKVxuICAgIHNlbGVjdGVkTm9kZXNbbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIHNlbGVjdGVkTm9kZXM6IHNlbGVjdGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIHNlbGVjdE5vZGUgKG5vZGUpIHtcbiAgICBub2RlLl9faXNTZWxlY3RlZCA9IHRydWVcbiAgICBsZXQgc2VsZWN0ZWROb2RlcyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLnNlbGVjdGVkTm9kZXMpXG4gICAgc2VsZWN0ZWROb2Rlc1tub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11dID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBzZWxlY3RlZE5vZGVzOiBzZWxlY3RlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBzY3JvbGxUb1RvcCAoKSB7XG4gICAgaWYgKHRoaXMucmVmcy5zY3JvbGx2aWV3KSB7XG4gICAgICB0aGlzLnJlZnMuc2Nyb2xsdmlldy5zY3JvbGxUb3AgPSAwXG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG9Ob2RlIChub2RlKSB7XG4gICAgdmFyIHJvd3NEYXRhID0gdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSB8fCBbXVxuICAgIHZhciBmb3VuZEluZGV4ID0gbnVsbFxuICAgIHZhciBpbmRleENvdW50ZXIgPSAwXG4gICAgcm93c0RhdGEuZm9yRWFjaCgocm93SW5mbywgaW5kZXgpID0+IHtcbiAgICAgIGlmIChyb3dJbmZvLmlzSGVhZGluZykge1xuICAgICAgICBpbmRleENvdW50ZXIrK1xuICAgICAgfSBlbHNlIGlmIChyb3dJbmZvLmlzUHJvcGVydHkpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgaW5kZXhDb3VudGVyKytcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kSW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgaWYgKHJvd0luZm8ubm9kZSAmJiByb3dJbmZvLm5vZGUgPT09IG5vZGUpIHtcbiAgICAgICAgICBmb3VuZEluZGV4ID0gaW5kZXhDb3VudGVyXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICAgIGlmIChmb3VuZEluZGV4ICE9PSBudWxsKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLnNjcm9sbHZpZXcpIHtcbiAgICAgICAgdGhpcy5yZWZzLnNjcm9sbHZpZXcuc2Nyb2xsVG9wID0gKGZvdW5kSW5kZXggKiB0aGlzLnN0YXRlLnJvd0hlaWdodCkgLSB0aGlzLnN0YXRlLnJvd0hlaWdodFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmREb21Ob2RlT2Zmc2V0WSAoZG9tTm9kZSkge1xuICAgIHZhciBjdXJ0b3AgPSAwXG4gICAgaWYgKGRvbU5vZGUub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIGN1cnRvcCArPSBkb21Ob2RlLm9mZnNldFRvcFxuICAgICAgfSB3aGlsZSAoZG9tTm9kZSA9IGRvbU5vZGUub2Zmc2V0UGFyZW50KSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgfVxuICAgIHJldHVybiBjdXJ0b3BcbiAgfVxuXG4gIGNvbGxhcHNlTm9kZSAobm9kZSkge1xuICAgIG5vZGUuX19pc0V4cGFuZGVkID0gZmFsc2VcbiAgICB2aXNpdChub2RlLCAoY2hpbGQpID0+IHtcbiAgICAgIGNoaWxkLl9faXNFeHBhbmRlZCA9IGZhbHNlXG4gICAgICBjaGlsZC5fX2lzU2VsZWN0ZWQgPSBmYWxzZVxuICAgIH0pXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBsZXQgY29tcG9uZW50SWQgPSBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBleHBhbmRlZE5vZGVzW2NvbXBvbmVudElkXSA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLCAvLyBDYW5jZWwgYW55IHBlbmRpbmcgY2hhbmdlIGluc2lkZSBhIGZvY3VzZWQgaW5wdXRcbiAgICAgIGV4cGFuZGVkTm9kZXM6IGV4cGFuZGVkTm9kZXMsXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIGV4cGFuZE5vZGUgKG5vZGUsIGNvbXBvbmVudElkKSB7XG4gICAgbm9kZS5fX2lzRXhwYW5kZWQgPSB0cnVlXG4gICAgaWYgKG5vZGUucGFyZW50KSB0aGlzLmV4cGFuZE5vZGUobm9kZS5wYXJlbnQpIC8vIElmIHdlIGFyZSBleHBhbmRlZCwgb3VyIHBhcmVudCBoYXMgdG8gYmUgdG9vXG4gICAgbGV0IGV4cGFuZGVkTm9kZXMgPSB0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNcbiAgICBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIGV4cGFuZGVkTm9kZXNbY29tcG9uZW50SWRdID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCwgLy8gRGVzZWxjdCBhbnkgc2VsZWN0ZWQgaW5wdXRcbiAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCwgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGNoYW5nZSBpbnNpZGUgYSBmb2N1c2VkIGlucHV0XG4gICAgICBleHBhbmRlZE5vZGVzOiBleHBhbmRlZE5vZGVzLFxuICAgICAgdHJlZVVwZGF0ZTogRGF0ZS5ub3coKVxuICAgIH0pXG4gIH1cblxuICBhY3RpdmF0ZVJvdyAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW3Jvdy5jb21wb25lbnRJZCArICcgJyArIHJvdy5wcm9wZXJ0eS5uYW1lXSA9IHRydWVcbiAgICB9XG4gIH1cblxuICBkZWFjdGl2YXRlUm93IChyb3cpIHtcbiAgICBpZiAocm93LnByb3BlcnR5KSB7XG4gICAgICB0aGlzLnN0YXRlLmFjdGl2YXRlZFJvd3Nbcm93LmNvbXBvbmVudElkICsgJyAnICsgcm93LnByb3BlcnR5Lm5hbWVdID0gZmFsc2VcbiAgICB9XG4gIH1cblxuICBpc1Jvd0FjdGl2YXRlZCAocm93KSB7XG4gICAgaWYgKHJvdy5wcm9wZXJ0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93c1tyb3cuY29tcG9uZW50SWQgKyAnICcgKyByb3cucHJvcGVydHkubmFtZV1cbiAgICB9XG4gIH1cblxuICBpc0NsdXN0ZXJBY3RpdmF0ZWQgKGl0ZW0pIHtcbiAgICByZXR1cm4gZmFsc2UgLy8gVE9ET1xuICB9XG5cbiAgdG9nZ2xlVGltZURpc3BsYXlNb2RlICgpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICB0aW1lRGlzcGxheU1vZGU6ICdzZWNvbmRzJ1xuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgdGltZURpc3BsYXlNb2RlOiAnZnJhbWVzJ1xuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTY3J1YmJlclBvc2l0aW9uIChkcmFnWCwgZnJhbWVJbmZvKSB7XG4gICAgdmFyIGRyYWdTdGFydCA9IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnRcbiAgICB2YXIgZnJhbWVCYXNlbGluZSA9IHRoaXMuc3RhdGUuZnJhbWVCYXNlbGluZVxuICAgIHZhciBkcmFnRGVsdGEgPSBkcmFnWCAtIGRyYWdTdGFydFxuICAgIHZhciBmcmFtZURlbHRhID0gTWF0aC5yb3VuZChkcmFnRGVsdGEgLyBmcmFtZUluZm8ucHhwZilcbiAgICB2YXIgY3VycmVudEZyYW1lID0gZnJhbWVCYXNlbGluZSArIGZyYW1lRGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEpIGN1cnJlbnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgaWYgKGN1cnJlbnRGcmFtZSA+IGZyYW1lSW5mby5mcmlCKSBjdXJyZW50RnJhbWUgPSBmcmFtZUluZm8uZnJpQlxuICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5zZWVrKGN1cnJlbnRGcmFtZSlcbiAgfVxuXG4gIGNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbiAoZHJhZ1gsIGZyYW1lSW5mbykge1xuICAgIHZhciBkcmFnU3RhcnQgPSB0aGlzLnN0YXRlLmR1cmF0aW9uRHJhZ1N0YXJ0XG4gICAgdmFyIGRyYWdEZWx0YSA9IGRyYWdYIC0gZHJhZ1N0YXJ0XG4gICAgdmFyIGZyYW1lRGVsdGEgPSBNYXRoLnJvdW5kKGRyYWdEZWx0YSAvIGZyYW1lSW5mby5weHBmKVxuICAgIGlmIChkcmFnRGVsdGEgPiAwICYmIHRoaXMuc3RhdGUuZHVyYXRpb25UcmltID49IDApIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5hZGRJbnRlcnZhbCkge1xuICAgICAgICB2YXIgYWRkSW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgdmFyIGN1cnJlbnRNYXggPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXgyXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWF4RnJhbWU6IGN1cnJlbnRNYXggKyAyMH0pXG4gICAgICAgIH0sIDMwMClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7YWRkSW50ZXJ2YWw6IGFkZEludGVydmFsfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2RyYWdJc0FkZGluZzogdHJ1ZX0pXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuYWRkSW50ZXJ2YWwpIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAvLyBEb24ndCBsZXQgdXNlciBkcmFnIGJhY2sgcGFzdCBsYXN0IGZyYW1lOyBhbmQgZG9uJ3QgbGV0IHRoZW0gZHJhZyBtb3JlIHRoYW4gYW4gZW50aXJlIHdpZHRoIG9mIGZyYW1lc1xuICAgIGlmIChmcmFtZUluZm8uZnJpQiArIGZyYW1lRGVsdGEgPD0gZnJhbWVJbmZvLmZyaU1heCB8fCAtZnJhbWVEZWx0YSA+PSBmcmFtZUluZm8uZnJpQiAtIGZyYW1lSW5mby5mcmlBKSB7XG4gICAgICBmcmFtZURlbHRhID0gdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gLy8gVG9kbzogbWFrZSBtb3JlIHByZWNpc2Ugc28gaXQgcmVtb3ZlcyBhcyBtYW55IGZyYW1lcyBhc1xuICAgICAgcmV0dXJuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0IGNhbiBpbnN0ZWFkIG9mIGNvbXBsZXRlbHkgaWdub3JpbmcgdGhlIGRyYWdcbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGR1cmF0aW9uVHJpbTogZnJhbWVEZWx0YSwgZHJhZ0lzQWRkaW5nOiBmYWxzZSwgYWRkSW50ZXJ2YWw6IG51bGwgfSlcbiAgfVxuXG4gIGNoYW5nZVZpc2libGVGcmFtZVJhbmdlICh4bCwgeHIsIGZyYW1lSW5mbykge1xuICAgIGxldCBhYnNMID0gbnVsbFxuICAgIGxldCBhYnNSID0gbnVsbFxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICBhYnNMID0geGxcbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuc2Nyb2xsZXJSaWdodERyYWdTdGFydCkge1xuICAgICAgYWJzUiA9IHhyXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnNjcm9sbGVyQm9keURyYWdTdGFydCkge1xuICAgICAgY29uc3Qgb2Zmc2V0TCA9ICh0aGlzLnN0YXRlLnNjcm9sbGJhclN0YXJ0ICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW9cbiAgICAgIGNvbnN0IG9mZnNldFIgPSAodGhpcy5zdGF0ZS5zY3JvbGxiYXJFbmQgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpb1xuICAgICAgY29uc3QgZGlmZlggPSB4bCAtIHRoaXMuc3RhdGUuc2Nyb2xsZXJCb2R5RHJhZ1N0YXJ0XG4gICAgICBhYnNMID0gb2Zmc2V0TCArIGRpZmZYXG4gICAgICBhYnNSID0gb2Zmc2V0UiArIGRpZmZYXG4gICAgfVxuXG4gICAgbGV0IGZMID0gKGFic0wgIT09IG51bGwpID8gTWF0aC5yb3VuZCgoYWJzTCAqIGZyYW1lSW5mby5zY1JhdGlvKSAvIGZyYW1lSW5mby5weHBmKSA6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF1cbiAgICBsZXQgZlIgPSAoYWJzUiAhPT0gbnVsbCkgPyBNYXRoLnJvdW5kKChhYnNSICogZnJhbWVJbmZvLnNjUmF0aW8pIC8gZnJhbWVJbmZvLnB4cGYpIDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIGxlZnQgc2lkZSBhbmQgbG9jayB0aGUgc2l6ZVxuICAgIGlmIChmTCA8PSBmcmFtZUluZm8uZnJpMCkge1xuICAgICAgZkwgPSBmcmFtZUluZm8uZnJpMFxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSAtICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC0gZkwpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU3RvcCB0aGUgc2Nyb2xsZXIgYXQgdGhlIHJpZ2h0IHNpZGUgYW5kIGxvY2sgdGhlIHNpemVcbiAgICBpZiAoZlIgPj0gZnJhbWVJbmZvLmZyaU1heDIpIHtcbiAgICAgIGZMID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgICAgaWYgKCF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQgJiYgIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0KSB7XG4gICAgICAgIGZSID0gZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgdmlzaWJsZUZyYW1lUmFuZ2U6IFtmTCwgZlJdIH0pXG4gIH1cblxuICB1cGRhdGVWaXNpYmxlRnJhbWVSYW5nZSAoZGVsdGEpIHtcbiAgICB2YXIgbCA9IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0gKyBkZWx0YVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSArIGRlbHRhXG4gICAgaWYgKGwgPj0gMCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbCwgcl0gfSlcbiAgICB9XG4gIH1cblxuICAvLyB3aWxsIGxlZnQtYWxpZ24gdGhlIGN1cnJlbnQgdGltZWxpbmUgd2luZG93IChtYWludGFpbmluZyB6b29tKVxuICB0cnlUb0xlZnRBbGlnblRpY2tlckluVmlzaWJsZUZyYW1lUmFuZ2UgKGZyYW1lSW5mbykge1xuICAgIHZhciBsID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVswXVxuICAgIHZhciByID0gdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXVxuICAgIHZhciBzcGFuID0gciAtIGxcbiAgICB2YXIgbmV3TCA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lXG4gICAgdmFyIG5ld1IgPSBuZXdMICsgc3BhblxuXG4gICAgaWYgKG5ld1IgPiBmcmFtZUluZm8uZnJpTWF4KSB7XG4gICAgICBuZXdMIC09IChuZXdSIC0gZnJhbWVJbmZvLmZyaU1heClcbiAgICAgIG5ld1IgPSBmcmFtZUluZm8uZnJpTWF4XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IHZpc2libGVGcmFtZVJhbmdlOiBbbmV3TCwgbmV3Ul0gfSlcbiAgfVxuXG4gIHVwZGF0ZVNjcnViYmVyUG9zaXRpb24gKGRlbHRhKSB7XG4gICAgdmFyIGN1cnJlbnRGcmFtZSA9IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICsgZGVsdGFcbiAgICBpZiAoY3VycmVudEZyYW1lIDw9IDApIGN1cnJlbnRGcmFtZSA9IDBcbiAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkuc2VlayhjdXJyZW50RnJhbWUpXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZSAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlKSB7XG4gICAgLy8gTm90ZSB0aGF0IGlmIHN0YXJ0VmFsdWUgaXMgdW5kZWZpbmVkLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBleGFtaW5lZCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIHRoZSBwcmVzZW50IG9uZVxuICAgIEJ5dGVjb2RlQWN0aW9ucy5jcmVhdGVLZXlmcmFtZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgc3RhcnRWYWx1ZSwgbWF5YmVDdXJ2ZSwgZW5kTXMsIGVuZFZhbHVlLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ2hvc3RJbnN0YW5jZScpLCB0aGlzLl9jb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgLy8gTm8gbmVlZCB0byAnZXhwcmVzc2lvblRvUk8nIGhlcmUgYmVjYXVzZSBpZiB3ZSBnb3QgYW4gZXhwcmVzc2lvbiwgdGhhdCB3b3VsZCBoYXZlIGFscmVhZHkgYmVlbiBwcm92aWRlZCBpbiBpdHMgc2VyaWFsaXplZCBfX2Z1bmN0aW9uIGZvcm1cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2NyZWF0ZUtleWZyYW1lJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIHN0YXJ0VmFsdWUsIG1heWJlQ3VydmUsIGVuZE1zLCBlbmRWYWx1ZV0sICgpID0+IHt9KVxuXG4gICAgaWYgKGVsZW1lbnROYW1lID09PSAnc3ZnJyAmJiBwcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgdGhpcy50b3VyQ2xpZW50Lm5leHQoKVxuICAgIH1cbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvblNwbGl0U2VnbWVudCAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcykge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5zcGxpdFNlZ21lbnQodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NwbGl0U2VnbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVLZXlmcmFtZSAoa2V5ZnJhbWVzLCB0aW1lbGluZU5hbWUpIHtcbiAgICBsb2Rhc2guZWFjaChrZXlmcmFtZXMsIChrKSA9PiB7XG4gICAgICBCeXRlY29kZUFjdGlvbnMuZGVsZXRlS2V5ZnJhbWUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGsuY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgay5wcm9wZXJ0eU5hbWUsIGsubXMpXG4gICAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsXG4gICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgICB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZVxuICAgICAgfSlcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignZGVsZXRlS2V5ZnJhbWUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtrLmNvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBrLnByb3BlcnR5TmFtZSwgay5tc10sICgpID0+IHt9KVxuICAgIH0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRLZXlmcmFtZXM6IHt9fSlcbiAgfVxuXG4gIGNoYW5nZU11bHRpcGxlU2VnbWVudEN1cnZlcyAoY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBsb2Rhc2guZWFjaCh0aGlzLnN0YXRlLnNlbGVjdGVkU2VnbWVudHMsIChzKSA9PiB7XG4gICAgICBpZiAoIXMuaGFzQ3VydmUpIHtcbiAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHMuZWxlbWVudE5hbWUsIHMucHJvcGVydHlOYW1lLCBzLm1zLCBzLmVuZE1zLCBjdXJ2ZU5hbWUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRDdXJ2ZShjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBzLnByb3BlcnR5TmFtZSwgcy5tcywgY3VydmVOYW1lKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25Kb2luS2V5ZnJhbWVzKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHN0YXJ0TXMsIGVuZE1zLCBjdXJ2ZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuam9pbktleWZyYW1lcyhcbiAgICAgIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgY29tcG9uZW50SWQsXG4gICAgICB0aW1lbGluZU5hbWUsXG4gICAgICBlbGVtZW50TmFtZSxcbiAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgIHN0YXJ0TXMsXG4gICAgICBlbmRNcyxcbiAgICAgIGN1cnZlTmFtZVxuICAgIClcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKCksXG4gICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBmYWxzZSxcbiAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLFxuICAgICAgdHJhbnNpdGlvbkJvZHlEcmFnZ2luZzogZmFsc2UsXG4gICAgICBzZWxlY3RlZEtleWZyYW1lczoge30sXG4gICAgICBzZWxlY3RlZFNlZ21lbnRzOiB7fVxuICAgIH0pXG4gICAgLy8gSW4gdGhlIGZ1dHVyZSwgY3VydmUgbWF5IGJlIGEgZnVuY3Rpb25cbiAgICBsZXQgY3VydmVGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oY3VydmVOYW1lKVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignam9pbktleWZyYW1lcycsIFt0aGlzLnByb3BzLmZvbGRlciwgW2NvbXBvbmVudElkXSwgdGltZWxpbmVOYW1lLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBlbmRNcywgY3VydmVGb3JXaXJlXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25DaGFuZ2VTZWdtZW50Q3VydmUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgc3RhcnRNcywgY3VydmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRDdXJ2ZShcbiAgICAgIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgY29tcG9uZW50SWQsXG4gICAgICB0aW1lbGluZU5hbWUsXG4gICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICBzdGFydE1zLFxuICAgICAgY3VydmVOYW1lXG4gICAgKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKSxcbiAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzOiB7fSxcbiAgICAgIHNlbGVjdGVkU2VnbWVudHM6IHt9XG4gICAgfSlcbiAgICAvLyBJbiB0aGUgZnV0dXJlLCBjdXJ2ZSBtYXkgYmUgYSBmdW5jdGlvblxuICAgIGxldCBjdXJ2ZUZvcldpcmUgPSBleHByZXNzaW9uVG9STyhjdXJ2ZU5hbWUpXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50Q3VydmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIFtjb21wb25lbnRJZF0sIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBzdGFydE1zLCBjdXJ2ZUZvcldpcmVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNoYW5nZVNlZ21lbnRFbmRwb2ludHMgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmNoYW5nZVNlZ21lbnRFbmRwb2ludHModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdjaGFuZ2VTZWdtZW50RW5kcG9pbnRzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgb2xkU3RhcnRNcywgb2xkRW5kTXMsIG5ld1N0YXJ0TXMsIG5ld0VuZE1zXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25SZW5hbWVUaW1lbGluZSAob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMucmVuYW1lVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIG9sZFRpbWVsaW5lTmFtZSwgbmV3VGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdyZW5hbWVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgb2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbkNyZWF0ZVRpbWVsaW5lICh0aW1lbGluZU5hbWUpIHtcbiAgICBCeXRlY29kZUFjdGlvbnMuY3JlYXRlVGltZWxpbmUodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRpbWVsaW5lTmFtZSlcbiAgICBjbGVhckluTWVtb3J5Qnl0ZWNvZGVDYWNoZXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgdGhpcy5fY29tcG9uZW50Ll9jbGVhckNhY2hlcygpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICByZWlmaWVkQnl0ZWNvZGU6IHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLFxuICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlOiB0aGlzLl9jb21wb25lbnQuZ2V0U2VyaWFsaXplZEJ5dGVjb2RlKClcbiAgICB9KVxuICAgIC8vIE5vdGU6IFdlIG1heSBuZWVkIHRvIHJlbWVtYmVyIHRvIHNlcmlhbGl6ZSBhIHRpbWVsaW5lIGRlc2NyaXB0b3IgaGVyZVxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignY3JlYXRlVGltZWxpbmUnLCBbdGhpcy5wcm9wcy5mb2xkZXIsIHRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICB9XG5cbiAgZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uRHVwbGljYXRlVGltZWxpbmUgKHRpbWVsaW5lTmFtZSkge1xuICAgIEJ5dGVjb2RlQWN0aW9ucy5kdXBsaWNhdGVUaW1lbGluZSh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSwgdGltZWxpbmVOYW1lKVxuICAgIGNsZWFySW5NZW1vcnlCeXRlY29kZUNhY2hlcyh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSlcbiAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHJlaWZpZWRCeXRlY29kZTogdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsXG4gICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgIH0pXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdkdXBsaWNhdGVUaW1lbGluZScsIFt0aGlzLnByb3BzLmZvbGRlciwgdGltZWxpbmVOYW1lXSwgKCkgPT4ge30pXG4gIH1cblxuICBleGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSAodGltZWxpbmVOYW1lKSB7XG4gICAgQnl0ZWNvZGVBY3Rpb25zLmRlbGV0ZVRpbWVsaW5lKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aW1lbGluZU5hbWUpXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuX2NvbXBvbmVudC5fY2xlYXJDYWNoZXMoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpXG4gICAgfSlcbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ2RlbGV0ZVRpbWVsaW5lJywgW3RoaXMucHJvcHMuZm9sZGVyLCB0aW1lbGluZU5hbWVdLCAoKSA9PiB7fSlcbiAgfVxuXG4gIGV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzIChjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWUsIGhhbmRsZSwga2V5ZnJhbWVJbmRleCwgc3RhcnRNcywgZW5kTXMpIHtcbiAgICAvKlxuICAgIFdlJ3JlIGdvaW5nIHRvIHVzZSB0aGUgY2FsbCBmcm9tIHdoYXQncyBiZWluZyBkcmFnZ2VkLCBiZWNhdXNlIHRoYXQncyBzb21ldGltZXMgYSB0cmFuc2l0aW9uIGJvZHlcbiAgICByYXRoZXIgdGhhbiBhIHNpbXBsZSBrZXlmcmFtZS5cblxuICAgIEZyb20gdGhlcmUgd2UncmUgZ29pbmcgdG8gbGVhcm4gaG93IGZhciB0byBtb3ZlIGFsbCBvdGhlciBrZXlmcmFtZXMgaW4gc2VsZWN0ZWRLZXlmcmFtZXM6IHt9XG5cbiAgICBDb25jZXJuczpcbiAgICAgIFdoZW4gd2UgbmVlZCB0byBzdG9wIG9uZSBrZXlmcmFtZSBiZWNhdXNlIGl0IGNhbid0IGdvIGFueSBmdXJ0aGVyLCB3ZSBuZWVkIHRvIHN0b3AgdGhlIGVudGlyZSBncm91cCBkcmFnLlxuXG4gICAgTm90ZXM6XG4gICAgICBXaGVuIGEgdXNlciBkcmFncyBhIHNlZ21lbnQgYm9keSBpdCBoYXMgdGhlIFwiYm9keVwiIGhhbmRsZS4gSXRcbiAgICAqL1xuICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgY2hhbmdlTXMgPSBlbmRNcyAtIHN0YXJ0TXNcblxuICAgIGxvZGFzaC5lYWNoKHNlbGVjdGVkS2V5ZnJhbWVzLCAoaykgPT4ge1xuICAgICAgY29uc3QgYWRqdXN0ZWRNcyA9IHBhcnNlSW50KGsubXMpICsgY2hhbmdlTXNcbiAgICAgIGxldCBrZXlmcmFtZU1vdmVzID0gQnl0ZWNvZGVBY3Rpb25zLm1vdmVTZWdtZW50RW5kcG9pbnRzKFxuICAgICAgICB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgay5jb21wb25lbnRJZCxcbiAgICAgICAgdGltZWxpbmVOYW1lLFxuICAgICAgICBrLnByb3BlcnR5TmFtZSxcbiAgICAgICAgay5oYW5kbGUsIC8vIHRvZG86IHRha2UgYSBzZWNvbmQgbG9vayBhdCB0aGlzIG9uZVxuICAgICAgICBrLmluZGV4LFxuICAgICAgICBrLm1zLFxuICAgICAgICBhZGp1c3RlZE1zLFxuICAgICAgICBmcmFtZUluZm9cbiAgICAgIClcbiAgICAgIC8vIFVwZGF0ZSBvdXIgc2VsZWN0ZWQga2V5ZnJhbWVzIHN0YXJ0IHRpbWUgbm93IHRoYXQgd2UndmUgbW92ZWQgdGhlbVxuICAgICAgLy8gTm90ZTogVGhpcyBzZWVtcyBsaWtlIHRoZXJlJ3MgcHJvYmFibHkgYSBtb3JlIGNsZXZlciB3YXkgdG8gbWFrZSBzdXJlIHRoaXMgZ2V0c1xuICAgICAgLy8gdXBkYXRlZCB2aWEgdGhlIEJ5dGVjb2RlQWN0aW9ucy5tb3ZlU2VnbWVudEVuZHBvaW50cyBwZXJoYXBzLlxuICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbay5jb21wb25lbnRJZCArICctJyArIGsucHJvcGVydHlOYW1lICsgJy0nICsgay5pbmRleF0ubXMgPSBPYmplY3Qua2V5cyhrZXlmcmFtZU1vdmVzKVtrLmluZGV4XVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWRLZXlmcmFtZXN9KVxuXG4gICAgICAvLyBUaGUgJ2tleWZyYW1lTW92ZXMnIGluZGljYXRlIGEgbGlzdCBvZiBjaGFuZ2VzIHdlIGtub3cgb2NjdXJyZWQuIE9ubHkgaWYgc29tZSBvY2N1cnJlZCBkbyB3ZSBib3RoZXIgdG8gdXBkYXRlIHRoZSBvdGhlciB2aWV3c1xuICAgICAgaWYgKE9iamVjdC5rZXlzKGtleWZyYW1lTW92ZXMpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgICAgICB0aGlzLl9jb21wb25lbnQuX2NsZWFyQ2FjaGVzKClcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgICAgICBzZXJpYWxpemVkQnl0ZWNvZGU6IHRoaXMuX2NvbXBvbmVudC5nZXRTZXJpYWxpemVkQnl0ZWNvZGUoKVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEl0J3MgdmVyeSBoZWF2eSB0byB0cmFuc21pdCBhIHdlYnNvY2tldCBtZXNzYWdlIGZvciBldmVyeSBzaW5nbGUgbW92ZW1lbnQgd2hpbGUgdXBkYXRpbmcgdGhlIHVpLFxuICAgICAgICAvLyBzbyB0aGUgdmFsdWVzIGFyZSBhY2N1bXVsYXRlZCBhbmQgc2VudCB2aWEgYSBzaW5nbGUgYmF0Y2hlZCB1cGRhdGUuXG4gICAgICAgIGlmICghdGhpcy5fa2V5ZnJhbWVNb3ZlcykgdGhpcy5fa2V5ZnJhbWVNb3ZlcyA9IHt9XG4gICAgICAgIGxldCBtb3ZlbWVudEtleSA9IFtjb21wb25lbnRJZCwgdGltZWxpbmVOYW1lLCBwcm9wZXJ0eU5hbWVdLmpvaW4oJy0nKVxuICAgICAgICB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSA9IHsgY29tcG9uZW50SWQsIHRpbWVsaW5lTmFtZSwgcHJvcGVydHlOYW1lLCBrZXlmcmFtZU1vdmVzLCBmcmFtZUluZm8gfVxuICAgICAgICB0aGlzLmRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbigpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGRlYm91bmNlZEtleWZyYW1lTW92ZUFjdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzKSByZXR1cm4gdm9pZCAoMClcbiAgICBmb3IgKGxldCBtb3ZlbWVudEtleSBpbiB0aGlzLl9rZXlmcmFtZU1vdmVzKSB7XG4gICAgICBpZiAoIW1vdmVtZW50S2V5KSBjb250aW51ZVxuICAgICAgaWYgKCF0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XSkgY29udGludWVcbiAgICAgIGxldCB7IGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3ZlcywgZnJhbWVJbmZvIH0gPSB0aGlzLl9rZXlmcmFtZU1vdmVzW21vdmVtZW50S2V5XVxuXG4gICAgICAvLyBNYWtlIHN1cmUgYW55IGZ1bmN0aW9ucyBnZXQgY29udmVydGVkIGludG8gdGhlaXIgc2VyaWFsIGZvcm0gYmVmb3JlIHBhc3Npbmcgb3ZlciB0aGUgd2lyZVxuICAgICAgbGV0IGtleWZyYW1lTW92ZXNGb3JXaXJlID0gZXhwcmVzc2lvblRvUk8oa2V5ZnJhbWVNb3ZlcylcblxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuYWN0aW9uKCdtb3ZlS2V5ZnJhbWVzJywgW3RoaXMucHJvcHMuZm9sZGVyLCBbY29tcG9uZW50SWRdLCB0aW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwga2V5ZnJhbWVNb3Zlc0ZvcldpcmUsIGZyYW1lSW5mb10sICgpID0+IHt9KVxuICAgICAgZGVsZXRlIHRoaXMuX2tleWZyYW1lTW92ZXNbbW92ZW1lbnRLZXldXG4gICAgfVxuICB9XG5cbiAgdG9nZ2xlUGxheWJhY2sgKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLmlzUGxheWVyUGxheWluZykge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiBmYWxzZVxuICAgICAgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLl9jb21wb25lbnQuZ2V0Q3VycmVudFRpbWVsaW5lKCkucGF1c2UoKVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgaXNQbGF5ZXJQbGF5aW5nOiB0cnVlXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wbGF5KClcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcmVoeWRyYXRlQnl0ZWNvZGUgKHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlKSB7XG4gICAgaWYgKHJlaWZpZWRCeXRlY29kZSkge1xuICAgICAgaWYgKHJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgcmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLCBudWxsLCAobm9kZSkgPT4ge1xuICAgICAgICAgIGxldCBpZCA9IG5vZGUuYXR0cmlidXRlcyAmJiBub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICAgICAgICBpZiAoIWlkKSByZXR1cm4gdm9pZCAoMClcbiAgICAgICAgICBub2RlLl9faXNTZWxlY3RlZCA9ICEhdGhpcy5zdGF0ZS5zZWxlY3RlZE5vZGVzW2lkXVxuICAgICAgICAgIG5vZGUuX19pc0V4cGFuZGVkID0gISF0aGlzLnN0YXRlLmV4cGFuZGVkTm9kZXNbaWRdXG4gICAgICAgICAgbm9kZS5fX2lzSGlkZGVuID0gISF0aGlzLnN0YXRlLmhpZGRlbk5vZGVzW2lkXVxuICAgICAgICB9KVxuICAgICAgICByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUuX19pc0V4cGFuZGVkID0gdHJ1ZVxuICAgICAgfVxuICAgICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHJlaWZpZWRCeXRlY29kZSlcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyByZWlmaWVkQnl0ZWNvZGUsIHNlcmlhbGl6ZWRCeXRlY29kZSB9KVxuICAgIH1cbiAgfVxuXG4gIG1pbmlvblNlbGVjdEVsZW1lbnQgKHsgY29tcG9uZW50SWQgfSkge1xuICAgIGlmICh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSAmJiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSkge1xuICAgICAgbGV0IGZvdW5kID0gW11cbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUsIHBhcmVudCkgPT4ge1xuICAgICAgICBub2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICAgIGlmIChpZCAmJiBpZCA9PT0gY29tcG9uZW50SWQpIGZvdW5kLnB1c2gobm9kZSlcbiAgICAgIH0pXG4gICAgICBmb3VuZC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIHRoaXMuc2VsZWN0Tm9kZShub2RlKVxuICAgICAgICB0aGlzLmV4cGFuZE5vZGUobm9kZSlcbiAgICAgICAgdGhpcy5zY3JvbGxUb05vZGUobm9kZSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgbWluaW9uVW5zZWxlY3RFbGVtZW50ICh7IGNvbXBvbmVudElkIH0pIHtcbiAgICBsZXQgZm91bmQgPSB0aGlzLmZpbmROb2Rlc0J5Q29tcG9uZW50SWQoY29tcG9uZW50SWQpXG4gICAgZm91bmQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgdGhpcy5kZXNlbGVjdE5vZGUobm9kZSlcbiAgICAgIHRoaXMuY29sbGFwc2VOb2RlKG5vZGUpXG4gICAgICB0aGlzLnNjcm9sbFRvVG9wKG5vZGUpXG4gICAgfSlcbiAgfVxuXG4gIGZpbmROb2Rlc0J5Q29tcG9uZW50SWQgKGNvbXBvbmVudElkKSB7XG4gICAgdmFyIGZvdW5kID0gW11cbiAgICBpZiAodGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUgJiYgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHtcbiAgICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50ZW1wbGF0ZSwgbnVsbCwgKG5vZGUpID0+IHtcbiAgICAgICAgbGV0IGlkID0gbm9kZS5hdHRyaWJ1dGVzICYmIG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZC5wdXNoKG5vZGUpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIG1pbmlvblVwZGF0ZVByb3BlcnR5VmFsdWUgKGNvbXBvbmVudElkLCB0aW1lbGluZU5hbWUsIHN0YXJ0TXMsIHByb3BlcnR5TmFtZXMpIHtcbiAgICBsZXQgcmVsYXRlZEVsZW1lbnQgPSB0aGlzLmZpbmRFbGVtZW50SW5UZW1wbGF0ZShjb21wb25lbnRJZCwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUpXG4gICAgbGV0IGVsZW1lbnROYW1lID0gcmVsYXRlZEVsZW1lbnQgJiYgcmVsYXRlZEVsZW1lbnQuZWxlbWVudE5hbWVcbiAgICBpZiAoIWVsZW1lbnROYW1lKSB7XG4gICAgICByZXR1cm4gY29uc29sZS53YXJuKCdDb21wb25lbnQgJyArIGNvbXBvbmVudElkICsgJyBtaXNzaW5nIGVsZW1lbnQsIGFuZCB3aXRob3V0IGFuIGVsZW1lbnQgbmFtZSBJIGNhbm5vdCB1cGRhdGUgYSBwcm9wZXJ0eSB2YWx1ZScpXG4gICAgfVxuXG4gICAgdmFyIGFsbFJvd3MgPSB0aGlzLnN0YXRlLmNvbXBvbmVudFJvd3NEYXRhIHx8IFtdXG4gICAgYWxsUm93cy5mb3JFYWNoKChyb3dJbmZvKSA9PiB7XG4gICAgICBpZiAocm93SW5mby5pc1Byb3BlcnR5ICYmIHJvd0luZm8uY29tcG9uZW50SWQgPT09IGNvbXBvbmVudElkICYmIHByb3BlcnR5TmFtZXMuaW5kZXhPZihyb3dJbmZvLnByb3BlcnR5Lm5hbWUpICE9PSAtMSkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlUm93KHJvd0luZm8pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGVSb3cocm93SW5mbylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgY2xlYXJJbk1lbW9yeUJ5dGVjb2RlQ2FjaGVzKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcmVpZmllZEJ5dGVjb2RlOiB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSxcbiAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZTogdGhpcy5fY29tcG9uZW50LmdldFNlcmlhbGl6ZWRCeXRlY29kZSgpLFxuICAgICAgYWN0aXZhdGVkUm93czogbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuYWN0aXZhdGVkUm93cyksXG4gICAgICB0cmVlVXBkYXRlOiBEYXRlLm5vdygpXG4gICAgfSlcbiAgfVxuXG4gIC8qXG4gICAqIGl0ZXJhdG9ycy92aXNpdG9yc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICBmaW5kRWxlbWVudEluVGVtcGxhdGUgKGNvbXBvbmVudElkLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBpZiAoIXJlaWZpZWRCeXRlY29kZSkgcmV0dXJuIHZvaWQgKDApXG4gICAgaWYgKCFyZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiB2b2lkICgwKVxuICAgIGxldCBmb3VuZFxuICAgIHRoaXMudmlzaXRUZW1wbGF0ZSgnMCcsIDAsIFtdLCByZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlKSA9PiB7XG4gICAgICBsZXQgaWQgPSBub2RlLmF0dHJpYnV0ZXMgJiYgbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgICBpZiAoaWQgJiYgaWQgPT09IGNvbXBvbmVudElkKSBmb3VuZCA9IG5vZGVcbiAgICB9KVxuICAgIHJldHVybiBmb3VuZFxuICB9XG5cbiAgdmlzaXRUZW1wbGF0ZSAobG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCB0ZW1wbGF0ZSwgcGFyZW50LCBpdGVyYXRlZSkge1xuICAgIGl0ZXJhdGVlKHRlbXBsYXRlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncywgdGVtcGxhdGUuY2hpbGRyZW4pXG4gICAgaWYgKHRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRlbXBsYXRlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjaGlsZCA9IHRlbXBsYXRlLmNoaWxkcmVuW2ldXG4gICAgICAgIGlmICghY2hpbGQgfHwgdHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykgY29udGludWVcbiAgICAgICAgdGhpcy52aXNpdFRlbXBsYXRlKGxvY2F0b3IgKyAnLicgKyBpLCBpLCB0ZW1wbGF0ZS5jaGlsZHJlbiwgY2hpbGQsIHRlbXBsYXRlLCBpdGVyYXRlZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtYXBWaXNpYmxlRnJhbWVzIChpdGVyYXRlZSkge1xuICAgIGNvbnN0IG1hcHBlZE91dHB1dCA9IFtdXG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgcmlnaHRGcmFtZSA9IGZyYW1lSW5mby5mcmlCXG4gICAgY29uc3QgZnJhbWVNb2R1bHVzID0gZ2V0RnJhbWVNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGxldCBpdGVyYXRpb25JbmRleCA9IC0xXG4gICAgZm9yIChsZXQgaSA9IGxlZnRGcmFtZTsgaSA8IHJpZ2h0RnJhbWU7IGkrKykge1xuICAgICAgaXRlcmF0aW9uSW5kZXgrK1xuICAgICAgbGV0IGZyYW1lTnVtYmVyID0gaVxuICAgICAgbGV0IHBpeGVsT2Zmc2V0TGVmdCA9IGl0ZXJhdGlvbkluZGV4ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgIGlmIChwaXhlbE9mZnNldExlZnQgPD0gdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCkge1xuICAgICAgICBsZXQgbWFwT3V0cHV0ID0gaXRlcmF0ZWUoZnJhbWVOdW1iZXIsIHBpeGVsT2Zmc2V0TGVmdCwgZnJhbWVJbmZvLnB4cGYsIGZyYW1lTW9kdWx1cylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkge1xuICAgICAgICAgIG1hcHBlZE91dHB1dC5wdXNoKG1hcE91dHB1dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICBtYXBWaXNpYmxlVGltZXMgKGl0ZXJhdGVlKSB7XG4gICAgY29uc3QgbWFwcGVkT3V0cHV0ID0gW11cbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3QgbXNNb2R1bHVzID0gZ2V0TWlsbGlzZWNvbmRNb2R1bHVzKGZyYW1lSW5mby5weHBmKVxuICAgIGNvbnN0IGxlZnRGcmFtZSA9IGZyYW1lSW5mby5mcmlBXG4gICAgY29uc3QgbGVmdE1zID0gZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZlxuICAgIGNvbnN0IHJpZ2h0TXMgPSBmcmFtZUluZm8uZnJpQiAqIGZyYW1lSW5mby5tc3BmXG4gICAgY29uc3QgdG90YWxNcyA9IHJpZ2h0TXMgLSBsZWZ0TXNcbiAgICBjb25zdCBmaXJzdE1hcmtlciA9IHJvdW5kVXAobGVmdE1zLCBtc01vZHVsdXMpXG4gICAgbGV0IG1zTWFya2VyVG1wID0gZmlyc3RNYXJrZXJcbiAgICBjb25zdCBtc01hcmtlcnMgPSBbXVxuICAgIHdoaWxlIChtc01hcmtlclRtcCA8PSByaWdodE1zKSB7XG4gICAgICBtc01hcmtlcnMucHVzaChtc01hcmtlclRtcClcbiAgICAgIG1zTWFya2VyVG1wICs9IG1zTW9kdWx1c1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1zTWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IG1zTWFya2VyID0gbXNNYXJrZXJzW2ldXG4gICAgICBsZXQgbmVhcmVzdEZyYW1lID0gbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc01hcmtlciwgZnJhbWVJbmZvLm1zcGYpXG4gICAgICBsZXQgbXNSZW1haW5kZXIgPSBNYXRoLmZsb29yKG5lYXJlc3RGcmFtZSAqIGZyYW1lSW5mby5tc3BmIC0gbXNNYXJrZXIpXG4gICAgICAvLyBUT0RPOiBoYW5kbGUgdGhlIG1zUmVtYWluZGVyIGNhc2UgcmF0aGVyIHRoYW4gaWdub3JpbmcgaXRcbiAgICAgIGlmICghbXNSZW1haW5kZXIpIHtcbiAgICAgICAgbGV0IGZyYW1lT2Zmc2V0ID0gbmVhcmVzdEZyYW1lIC0gbGVmdEZyYW1lXG4gICAgICAgIGxldCBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICAgICAgbGV0IG1hcE91dHB1dCA9IGl0ZXJhdGVlKG1zTWFya2VyLCBweE9mZnNldCwgdG90YWxNcylcbiAgICAgICAgaWYgKG1hcE91dHB1dCkgbWFwcGVkT3V0cHV0LnB1c2gobWFwT3V0cHV0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWFwcGVkT3V0cHV0XG4gIH1cblxuICAvKlxuICAgKiBnZXR0ZXJzL2NhbGN1bGF0b3JzXG4gICAqIC0tLS0tLS0tLSAqL1xuXG4gIC8qKlxuICAgIC8vIFNvcnJ5OiBUaGVzZSBzaG91bGQgaGF2ZSBiZWVuIGdpdmVuIGh1bWFuLXJlYWRhYmxlIG5hbWVzXG4gICAgPEdBVUdFPlxuICAgICAgICAgICAgPC0tLS1mcmlXLS0tPlxuICAgIGZyaTAgICAgZnJpQSAgICAgICAgZnJpQiAgICAgICAgZnJpTWF4ICAgICAgICAgICAgICAgICAgICAgICAgICBmcmlNYXgyXG4gICAgfCAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHxcbiAgICB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfCB8IHwgfFxuICAgICAgICAgICAgPC0tLS0tLS0tLS0tPiA8PCB0aW1lbGluZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgICB8XG4gICAgPC0tLS0tLS0+ICAgICAgICAgICB8IDw8IHByb3BlcnRpZXMgdmlld3BvcnQgICAgICAgICAgICAgICAgICAgIHxcbiAgICAgICAgICAgIHB4QSAgICAgICAgIHB4QiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHB4TWF4ICAgICAgICAgICAgICAgICAgICAgICAgICB8cHhNYXgyXG4gICAgPFNDUk9MTEJBUj5cbiAgICB8LS0tLS0tLS0tLS0tLS0tLS0tLXwgPDwgc2Nyb2xsZXIgdmlld3BvcnRcbiAgICAgICAgKj09PT0qICAgICAgICAgICAgPDwgc2Nyb2xsYmFyXG4gICAgPC0tLS0tLS0tLS0tLS0tLS0tLS0+XG4gICAgfHNjMCAgICAgICAgICAgICAgICB8c2NMICYmIHNjUmF0aW9cbiAgICAgICAgfHNjQVxuICAgICAgICAgICAgIHxzY0JcbiAgKi9cbiAgZ2V0RnJhbWVJbmZvICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB7fVxuICAgIGZyYW1lSW5mby5mcHMgPSB0aGlzLnN0YXRlLmZyYW1lc1BlclNlY29uZCAvLyBOdW1iZXIgb2YgZnJhbWVzIHBlciBzZWNvbmRcbiAgICBmcmFtZUluZm8ubXNwZiA9IDEwMDAgLyBmcmFtZUluZm8uZnBzIC8vIE1pbGxpc2Vjb25kcyBwZXIgZnJhbWVcbiAgICBmcmFtZUluZm8ubWF4bXMgPSBnZXRNYXhpbXVtTXModGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHRoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZSlcbiAgICBmcmFtZUluZm8ubWF4ZiA9IG1pbGxpc2Vjb25kVG9OZWFyZXN0RnJhbWUoZnJhbWVJbmZvLm1heG1zLCBmcmFtZUluZm8ubXNwZikgLy8gTWF4aW11bSBmcmFtZSBkZWZpbmVkIGluIHRoZSB0aW1lbGluZVxuICAgIGZyYW1lSW5mby5mcmkwID0gMCAvLyBUaGUgbG93ZXN0IHBvc3NpYmxlIGZyYW1lIChhbHdheXMgMClcbiAgICBmcmFtZUluZm8uZnJpQSA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIDwgZnJhbWVJbmZvLmZyaTApID8gZnJhbWVJbmZvLmZyaTAgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdIC8vIFRoZSBsZWZ0bW9zdCBmcmFtZSBvbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5mcmlNYXggPSAoZnJhbWVJbmZvLm1heGYgPCA2MCkgPyA2MCA6IGZyYW1lSW5mby5tYXhmIC8vIFRoZSBtYXhpbXVtIGZyYW1lIGFzIGRlZmluZWQgaW4gdGhlIHRpbWVsaW5lXG4gICAgZnJhbWVJbmZvLmZyaU1heDIgPSB0aGlzLnN0YXRlLm1heEZyYW1lID8gdGhpcy5zdGF0ZS5tYXhGcmFtZSA6IGZyYW1lSW5mby5mcmlNYXggKiAxLjg4ICAvLyBFeHRlbmQgdGhlIG1heGltdW0gZnJhbWUgZGVmaW5lZCBpbiB0aGUgdGltZWxpbmUgKGFsbG93cyB0aGUgdXNlciB0byBkZWZpbmUga2V5ZnJhbWVzIGJleW9uZCB0aGUgcHJldmlvdXNseSBkZWZpbmVkIG1heClcbiAgICBmcmFtZUluZm8uZnJpQiA9ICh0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdID4gZnJhbWVJbmZvLmZyaU1heDIpID8gZnJhbWVJbmZvLmZyaU1heDIgOiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzFdIC8vIFRoZSByaWdodG1vc3QgZnJhbWUgb24gdGhlIHZpc2libGUgcmFuZ2VcbiAgICBmcmFtZUluZm8uZnJpVyA9IE1hdGguYWJzKGZyYW1lSW5mby5mcmlCIC0gZnJhbWVJbmZvLmZyaUEpIC8vIFRoZSB3aWR0aCBvZiB0aGUgdmlzaWJsZSByYW5nZSBpbiBmcmFtZXNcbiAgICBmcmFtZUluZm8ucHhwZiA9IE1hdGguZmxvb3IodGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAvIGZyYW1lSW5mby5mcmlXKSAvLyBOdW1iZXIgb2YgcGl4ZWxzIHBlciBmcmFtZSAocm91bmRlZClcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPCAxKSBmcmFtZUluZm8ucFNjcnhwZiA9IDFcbiAgICBpZiAoZnJhbWVJbmZvLnB4cGYgPiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoKSBmcmFtZUluZm8ucHhwZiA9IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGhcbiAgICBmcmFtZUluZm8ucHhBID0gTWF0aC5yb3VuZChmcmFtZUluZm8uZnJpQSAqIGZyYW1lSW5mby5weHBmKVxuICAgIGZyYW1lSW5mby5weEIgPSBNYXRoLnJvdW5kKGZyYW1lSW5mby5mcmlCICogZnJhbWVJbmZvLnB4cGYpXG4gICAgZnJhbWVJbmZvLnB4TWF4MiA9IGZyYW1lSW5mby5mcmlNYXgyICogZnJhbWVJbmZvLnB4cGYgLy8gVGhlIHdpZHRoIGluIHBpeGVscyB0aGF0IHRoZSBlbnRpcmUgdGltZWxpbmUgKFwiZnJpTWF4MlwiKSBwYWRkaW5nIHdvdWxkIGVxdWFsXG4gICAgZnJhbWVJbmZvLm1zQSA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUEgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIGxlZnRtb3N0IG1pbGxpc2Vjb25kIGluIHRoZSB2aXNpYmxlIHJhbmdlXG4gICAgZnJhbWVJbmZvLm1zQiA9IE1hdGgucm91bmQoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ubXNwZikgLy8gVGhlIHJpZ2h0bW9zdCBtaWxsaXNlY29uZCBpbiB0aGUgdmlzaWJsZSByYW5nZVxuICAgIGZyYW1lSW5mby5zY0wgPSB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCArIHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGggLy8gVGhlIGxlbmd0aCBpbiBwaXhlbHMgb2YgdGhlIHNjcm9sbGVyIHZpZXdcbiAgICBmcmFtZUluZm8uc2NSYXRpbyA9IGZyYW1lSW5mby5weE1heDIgLyBmcmFtZUluZm8uc2NMIC8vIFRoZSByYXRpbyBvZiB0aGUgc2Nyb2xsZXIgdmlldyB0byB0aGUgdGltZWxpbmUgdmlldyAoc28gdGhlIHNjcm9sbGVyIHJlbmRlcnMgcHJvcG9ydGlvbmFsbHkgdG8gdGhlIHRpbWVsaW5lIGJlaW5nIGVkaXRlZClcbiAgICBmcmFtZUluZm8uc2NBID0gKGZyYW1lSW5mby5mcmlBICogZnJhbWVJbmZvLnB4cGYpIC8gZnJhbWVJbmZvLnNjUmF0aW8gLy8gVGhlIHBpeGVsIG9mIHRoZSBsZWZ0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIGZyYW1lSW5mby5zY0IgPSAoZnJhbWVJbmZvLmZyaUIgKiBmcmFtZUluZm8ucHhwZikgLyBmcmFtZUluZm8uc2NSYXRpbyAvLyBUaGUgcGl4ZWwgb2YgdGhlIHJpZ2h0IGVuZHBvaW50IG9mIHRoZSBzY3JvbGxlclxuICAgIHJldHVybiBmcmFtZUluZm9cbiAgfVxuXG4gIC8vIFRPRE86IEZpeCB0aGlzL3RoZXNlIG1pc25vbWVyKHMpLiBJdCdzIG5vdCAnQVNDSUknXG4gIGdldEFzY2lpVHJlZSAoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlICYmIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKSB7XG4gICAgICBsZXQgYXJjaHlGb3JtYXQgPSB0aGlzLmdldEFyY2h5Rm9ybWF0Tm9kZXMoJycsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLnRlbXBsYXRlLmNoaWxkcmVuKVxuICAgICAgbGV0IGFyY2h5U3RyID0gYXJjaHkoYXJjaHlGb3JtYXQpXG4gICAgICByZXR1cm4gYXJjaHlTdHJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICcnXG4gICAgfVxuICB9XG5cbiAgZ2V0QXJjaHlGb3JtYXROb2RlcyAobGFiZWwsIGNoaWxkcmVuKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhYmVsLFxuICAgICAgbm9kZXM6IGNoaWxkcmVuLmZpbHRlcigoY2hpbGQpID0+IHR5cGVvZiBjaGlsZCAhPT0gJ3N0cmluZycpLm1hcCgoY2hpbGQpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0QXJjaHlGb3JtYXROb2RlcygnJywgY2hpbGQuY2hpbGRyZW4pXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGdldENvbXBvbmVudFJvd3NEYXRhICgpIHtcbiAgICAvLyBUaGUgbnVtYmVyIG9mIGxpbmVzICoqbXVzdCoqIGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBjb21wb25lbnQgaGVhZGluZ3MvcHJvcGVydHkgcm93c1xuICAgIGxldCBhc2NpaVN5bWJvbHMgPSB0aGlzLmdldEFzY2lpVHJlZSgpLnNwbGl0KCdcXG4nKVxuICAgIGxldCBjb21wb25lbnRSb3dzID0gW11cbiAgICBsZXQgYWRkcmVzc2FibGVBcnJheXNDYWNoZSA9IHt9XG4gICAgbGV0IHZpc2l0b3JJdGVyYXRpb25zID0gMFxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSB8fCAhdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUpIHJldHVybiBjb21wb25lbnRSb3dzXG5cbiAgICB0aGlzLnZpc2l0VGVtcGxhdGUoJzAnLCAwLCBbXSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUudGVtcGxhdGUsIG51bGwsIChub2RlLCBwYXJlbnQsIGxvY2F0b3IsIGluZGV4LCBzaWJsaW5ncykgPT4ge1xuICAgICAgLy8gVE9ETyBob3cgd2lsbCB0aGlzIGJpdGUgdXM/XG4gICAgICBsZXQgaXNDb21wb25lbnQgPSAodHlwZW9mIG5vZGUuZWxlbWVudE5hbWUgPT09ICdvYmplY3QnKVxuICAgICAgbGV0IGVsZW1lbnROYW1lID0gaXNDb21wb25lbnQgPyBub2RlLmF0dHJpYnV0ZXMuc291cmNlIDogbm9kZS5lbGVtZW50TmFtZVxuXG4gICAgICBpZiAoIXBhcmVudCB8fCAocGFyZW50Ll9faXNFeHBhbmRlZCAmJiAoQUxMT1dFRF9UQUdOQU1FU1tlbGVtZW50TmFtZV0gfHwgaXNDb21wb25lbnQpKSkgeyAvLyBPbmx5IHRoZSB0b3AtbGV2ZWwgYW5kIGFueSBleHBhbmRlZCBzdWJjb21wb25lbnRzXG4gICAgICAgIGNvbnN0IGFzY2lpQnJhbmNoID0gYXNjaWlTeW1ib2xzW3Zpc2l0b3JJdGVyYXRpb25zXSAvLyBXYXJuaW5nOiBUaGUgY29tcG9uZW50IHN0cnVjdHVyZSBtdXN0IG1hdGNoIHRoYXQgZ2l2ZW4gdG8gY3JlYXRlIHRoZSBhc2NpaSB0cmVlXG4gICAgICAgIGNvbnN0IGhlYWRpbmdSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCwgcHJvcGVydHlSb3dzOiBbXSwgaXNIZWFkaW5nOiB0cnVlLCBjb21wb25lbnRJZDogbm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddIH1cbiAgICAgICAgY29tcG9uZW50Um93cy5wdXNoKGhlYWRpbmdSb3cpXG5cbiAgICAgICAgaWYgKCFhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXSkge1xuICAgICAgICAgIGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdID0gaXNDb21wb25lbnQgPyBfYnVpbGRDb21wb25lbnRBZGRyZXNzYWJsZXMobm9kZSkgOiBfYnVpbGRET01BZGRyZXNzYWJsZXMoZWxlbWVudE5hbWUsIGxvY2F0b3IpXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgICAgICBjb25zdCBjbHVzdGVySGVhZGluZ3NGb3VuZCA9IHt9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciA9IGFkZHJlc3NhYmxlQXJyYXlzQ2FjaGVbZWxlbWVudE5hbWVdW2ldXG5cbiAgICAgICAgICBsZXQgcHJvcGVydHlSb3dcblxuICAgICAgICAgICAgLy8gU29tZSBwcm9wZXJ0aWVzIGdldCBncm91cGVkIGluc2lkZSB0aGVpciBvd24gYWNjb3JkaW9uIHNpbmNlIHRoZXkgaGF2ZSBtdWx0aXBsZSBzdWJjb21wb25lbnRzLCBlLmcuIHRyYW5zbGF0aW9uLngseSx6XG4gICAgICAgICAgaWYgKHByb3BlcnR5R3JvdXBEZXNjcmlwdG9yLmNsdXN0ZXIpIHtcbiAgICAgICAgICAgIGxldCBjbHVzdGVyUHJlZml4ID0gcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5wcmVmaXhcbiAgICAgICAgICAgIGxldCBjbHVzdGVyS2V5ID0gYCR7Y29tcG9uZW50SWR9XyR7Y2x1c3RlclByZWZpeH1gXG4gICAgICAgICAgICBsZXQgaXNDbHVzdGVySGVhZGluZyA9IGZhbHNlXG5cbiAgICAgICAgICAgICAgLy8gSWYgdGhlIGNsdXN0ZXIgd2l0aCB0aGUgY3VycmVudCBrZXkgaXMgZXhwYW5kZWQgcmVuZGVyIGVhY2ggb2YgdGhlIHJvd3MgaW5kaXZpZHVhbGx5XG4gICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5leHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbY2x1c3RlcktleV0pIHtcbiAgICAgICAgICAgICAgaWYgKCFjbHVzdGVySGVhZGluZ3NGb3VuZFtjbHVzdGVyUHJlZml4XSkge1xuICAgICAgICAgICAgICAgIGlzQ2x1c3RlckhlYWRpbmcgPSB0cnVlXG4gICAgICAgICAgICAgICAgY2x1c3RlckhlYWRpbmdzRm91bmRbY2x1c3RlclByZWZpeF0gPSB0cnVlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBjbHVzdGVyUHJlZml4LCBjbHVzdGVyS2V5LCBpc0NsdXN0ZXJNZW1iZXI6IHRydWUsIGlzQ2x1c3RlckhlYWRpbmcsIHByb3BlcnR5OiBwcm9wZXJ0eUdyb3VwRGVzY3JpcHRvciwgaXNQcm9wZXJ0eTogdHJ1ZSwgY29tcG9uZW50SWQgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIGNyZWF0ZSBhIGNsdXN0ZXIsIHNoaWZ0aW5nIHRoZSBpbmRleCBmb3J3YXJkIHNvIHdlIGRvbid0IHJlLXJlbmRlciB0aGUgaW5kaXZpZHVhbHMgb24gdGhlIG5leHQgaXRlcmF0aW9uIG9mIHRoZSBsb29wXG4gICAgICAgICAgICAgIGxldCBjbHVzdGVyU2V0ID0gW3Byb3BlcnR5R3JvdXBEZXNjcmlwdG9yXVxuICAgICAgICAgICAgICAgIC8vIExvb2sgYWhlYWQgYnkgYSBmZXcgc3RlcHMgaW4gdGhlIGFycmF5IGFuZCBzZWUgaWYgdGhlIG5leHQgZWxlbWVudCBpcyBhIG1lbWJlciBvZiB0aGUgY3VycmVudCBjbHVzdGVyXG4gICAgICAgICAgICAgIGxldCBrID0gaSAvLyBUZW1wb3Jhcnkgc28gd2UgY2FuIGluY3JlbWVudCBgaWAgaW4gcGxhY2VcbiAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDE7IGogPCA0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dEluZGV4ID0gaiArIGtcbiAgICAgICAgICAgICAgICBsZXQgbmV4dERlc2NyaXB0b3IgPSBhZGRyZXNzYWJsZUFycmF5c0NhY2hlW2VsZW1lbnROYW1lXVtuZXh0SW5kZXhdXG4gICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbmV4dCB0aGluZyBpbiB0aGUgbGlzdCBzaGFyZXMgdGhlIHNhbWUgY2x1c3RlciBuYW1lLCBtYWtlIGl0IHBhcnQgb2YgdGhpcyBjbHVzdGVzclxuICAgICAgICAgICAgICAgIGlmIChuZXh0RGVzY3JpcHRvciAmJiBuZXh0RGVzY3JpcHRvci5jbHVzdGVyICYmIG5leHREZXNjcmlwdG9yLmNsdXN0ZXIucHJlZml4ID09PSBjbHVzdGVyUHJlZml4KSB7XG4gICAgICAgICAgICAgICAgICBjbHVzdGVyU2V0LnB1c2gobmV4dERlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHdlIGFscmVhZHkgZ28gdG8gdGhlIG5leHQgb25lLCBidW1wIHRoZSBpdGVyYXRpb24gaW5kZXggc28gd2Ugc2tpcCBpdCBvbiB0aGUgbmV4dCBsb29wXG4gICAgICAgICAgICAgICAgICBpICs9IDFcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBjbHVzdGVyUHJlZml4LCBjbHVzdGVyS2V5LCBjbHVzdGVyOiBjbHVzdGVyU2V0LCBjbHVzdGVyTmFtZTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IuY2x1c3Rlci5uYW1lLCBpc0NsdXN0ZXI6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvcGVydHlSb3cgPSB7IG5vZGUsIHBhcmVudCwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBwcm9wZXJ0eTogcHJvcGVydHlHcm91cERlc2NyaXB0b3IsIGlzUHJvcGVydHk6IHRydWUsIGNvbXBvbmVudElkIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBoZWFkaW5nUm93LnByb3BlcnR5Um93cy5wdXNoKHByb3BlcnR5Um93KVxuXG4gICAgICAgICAgICAvLyBQdXNoaW5nIGFuIGVsZW1lbnQgaW50byBhIGNvbXBvbmVudCByb3cgd2lsbCByZXN1bHQgaW4gaXQgcmVuZGVyaW5nLCBzbyBvbmx5IHB1c2hcbiAgICAgICAgICAgIC8vIHRoZSBwcm9wZXJ0eSByb3dzIG9mIG5vZGVzIHRoYXQgaGF2ZSBiZWVuIGV4cGFuZGV4XG4gICAgICAgICAgaWYgKG5vZGUuX19pc0V4cGFuZGVkKSB7XG4gICAgICAgICAgICBjb21wb25lbnRSb3dzLnB1c2gocHJvcGVydHlSb3cpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2aXNpdG9ySXRlcmF0aW9ucysrXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MuZm9yRWFjaCgoaXRlbSwgaW5kZXgsIGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtLl9pbmRleCA9IGluZGV4XG4gICAgICBpdGVtLl9pdGVtcyA9IGl0ZW1zXG4gICAgfSlcblxuICAgIGNvbXBvbmVudFJvd3MgPSBjb21wb25lbnRSb3dzLmZpbHRlcigoeyBub2RlLCBwYXJlbnQsIGxvY2F0b3IgfSkgPT4ge1xuICAgICAgICAvLyBMb2NhdG9ycyA+IDAuMCBhcmUgYmVsb3cgdGhlIGxldmVsIHdlIHdhbnQgdG8gZGlzcGxheSAod2Ugb25seSB3YW50IHRoZSB0b3AgYW5kIGl0cyBjaGlsZHJlbilcbiAgICAgIGlmIChsb2NhdG9yLnNwbGl0KCcuJykubGVuZ3RoID4gMikgcmV0dXJuIGZhbHNlXG4gICAgICByZXR1cm4gIXBhcmVudCB8fCBwYXJlbnQuX19pc0V4cGFuZGVkXG4gICAgfSlcblxuICAgIHJldHVybiBjb21wb25lbnRSb3dzXG4gIH1cblxuICBtYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIGl0ZXJhdGVlKSB7XG4gICAgbGV0IHNlZ21lbnRPdXRwdXRzID0gW11cblxuICAgIGxldCB2YWx1ZUdyb3VwID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRWYWx1ZUdyb3VwKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlKVxuICAgIGlmICghdmFsdWVHcm91cCkgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG5cbiAgICBsZXQga2V5ZnJhbWVzTGlzdCA9IE9iamVjdC5rZXlzKHZhbHVlR3JvdXApLm1hcCgoa2V5ZnJhbWVLZXkpID0+IHBhcnNlSW50KGtleWZyYW1lS2V5LCAxMCkpLnNvcnQoKGEsIGIpID0+IGEgLSBiKVxuICAgIGlmIChrZXlmcmFtZXNMaXN0Lmxlbmd0aCA8IDEpIHJldHVybiBzZWdtZW50T3V0cHV0c1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlmcmFtZXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgbXNjdXJyID0ga2V5ZnJhbWVzTGlzdFtpXVxuICAgICAgaWYgKGlzTmFOKG1zY3VycikpIGNvbnRpbnVlXG4gICAgICBsZXQgbXNwcmV2ID0ga2V5ZnJhbWVzTGlzdFtpIC0gMV1cbiAgICAgIGxldCBtc25leHQgPSBrZXlmcmFtZXNMaXN0W2kgKyAxXVxuXG4gICAgICBpZiAobXNjdXJyID4gZnJhbWVJbmZvLm1zQikgY29udGludWUgLy8gSWYgdGhpcyBzZWdtZW50IGhhcHBlbnMgYWZ0ZXIgdGhlIHZpc2libGUgcmFuZ2UsIHNraXAgaXRcbiAgICAgIGlmIChtc2N1cnIgPCBmcmFtZUluZm8ubXNBICYmIG1zbmV4dCAhPT0gdW5kZWZpbmVkICYmIG1zbmV4dCA8IGZyYW1lSW5mby5tc0EpIGNvbnRpbnVlIC8vIElmIHRoaXMgc2VnbWVudCBoYXBwZW5zIGVudGlyZWx5IGJlZm9yZSB0aGUgdmlzaWJsZSByYW5nZSwgc2tpcCBpdCAocGFydGlhbCBzZWdtZW50cyBhcmUgb2spXG5cbiAgICAgIGxldCBwcmV2XG4gICAgICBsZXQgY3VyclxuICAgICAgbGV0IG5leHRcblxuICAgICAgaWYgKG1zcHJldiAhPT0gdW5kZWZpbmVkICYmICFpc05hTihtc3ByZXYpKSB7XG4gICAgICAgIHByZXYgPSB7XG4gICAgICAgICAgbXM6IG1zcHJldixcbiAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgaW5kZXg6IGkgLSAxLFxuICAgICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zcHJldiwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZUdyb3VwW21zcHJldl0udmFsdWUsXG4gICAgICAgICAgY3VydmU6IHZhbHVlR3JvdXBbbXNwcmV2XS5jdXJ2ZVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGN1cnIgPSB7XG4gICAgICAgIG1zOiBtc2N1cnIsXG4gICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgaW5kZXg6IGksXG4gICAgICAgIGZyYW1lOiBtaWxsaXNlY29uZFRvTmVhcmVzdEZyYW1lKG1zY3VyciwgZnJhbWVJbmZvLm1zcGYpLFxuICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc2N1cnJdLnZhbHVlLFxuICAgICAgICBjdXJ2ZTogdmFsdWVHcm91cFttc2N1cnJdLmN1cnZlXG4gICAgICB9XG5cbiAgICAgIGlmIChtc25leHQgIT09IHVuZGVmaW5lZCAmJiAhaXNOYU4obXNuZXh0KSkge1xuICAgICAgICBuZXh0ID0ge1xuICAgICAgICAgIG1zOiBtc25leHQsXG4gICAgICAgICAgbmFtZTogcHJvcGVydHlOYW1lLFxuICAgICAgICAgIGluZGV4OiBpICsgMSxcbiAgICAgICAgICBmcmFtZTogbWlsbGlzZWNvbmRUb05lYXJlc3RGcmFtZShtc25leHQsIGZyYW1lSW5mby5tc3BmKSxcbiAgICAgICAgICB2YWx1ZTogdmFsdWVHcm91cFttc25leHRdLnZhbHVlLFxuICAgICAgICAgIGN1cnZlOiB2YWx1ZUdyb3VwW21zbmV4dF0uY3VydmVcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgcHhPZmZzZXRMZWZ0ID0gKGN1cnIuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuICAgICAgbGV0IHB4T2Zmc2V0UmlnaHRcbiAgICAgIGlmIChuZXh0KSBweE9mZnNldFJpZ2h0ID0gKG5leHQuZnJhbWUgLSBmcmFtZUluZm8uZnJpQSkgKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgICBsZXQgc2VnbWVudE91dHB1dCA9IGl0ZXJhdGVlKHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaSlcbiAgICAgIGlmIChzZWdtZW50T3V0cHV0KSBzZWdtZW50T3V0cHV0cy5wdXNoKHNlZ21lbnRPdXRwdXQpXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRPdXRwdXRzXG4gIH1cblxuICBtYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyAoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5Um93cywgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSkge1xuICAgIGxldCBzZWdtZW50T3V0cHV0cyA9IFtdXG5cbiAgICBwcm9wZXJ0eVJvd3MuZm9yRWFjaCgocHJvcGVydHlSb3cpID0+IHtcbiAgICAgIGlmIChwcm9wZXJ0eVJvdy5pc0NsdXN0ZXIpIHtcbiAgICAgICAgcHJvcGVydHlSb3cuY2x1c3Rlci5mb3JFYWNoKChwcm9wZXJ0eURlc2NyaXB0b3IpID0+IHtcbiAgICAgICAgICBsZXQgcHJvcGVydHlOYW1lID0gcHJvcGVydHlEZXNjcmlwdG9yLm5hbWVcbiAgICAgICAgICBsZXQgcHJvcGVydHlPdXRwdXRzID0gdGhpcy5tYXBWaXNpYmxlUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgaXRlcmF0ZWUpXG4gICAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgICAgc2VnbWVudE91dHB1dHMgPSBzZWdtZW50T3V0cHV0cy5jb25jYXQocHJvcGVydHlPdXRwdXRzKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eVJvdy5wcm9wZXJ0eS5uYW1lXG4gICAgICAgIGxldCBwcm9wZXJ0eU91dHB1dHMgPSB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBpdGVyYXRlZSlcbiAgICAgICAgaWYgKHByb3BlcnR5T3V0cHV0cykge1xuICAgICAgICAgIHNlZ21lbnRPdXRwdXRzID0gc2VnbWVudE91dHB1dHMuY29uY2F0KHByb3BlcnR5T3V0cHV0cylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICByZXR1cm4gc2VnbWVudE91dHB1dHNcbiAgfVxuXG4gIHJlbW92ZVRpbWVsaW5lU2hhZG93ICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZhbHNlIH0pXG4gIH1cblxuICAvKlxuICAgKiByZW5kZXIgbWV0aG9kc1xuICAgKiAtLS0tLS0tLS0gKi9cblxuICAvLyAtLS0tLS0tLS1cblxuICByZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgdG9wOiAxN1xuICAgICAgICB9fT5cbiAgICAgICAgPENvbnRyb2xzQXJlYVxuICAgICAgICAgIHJlbW92ZVRpbWVsaW5lU2hhZG93PXt0aGlzLnJlbW92ZVRpbWVsaW5lU2hhZG93LmJpbmQodGhpcyl9XG4gICAgICAgICAgYWN0aXZlQ29tcG9uZW50RGlzcGxheU5hbWU9e3RoaXMucHJvcHMudXNlcmNvbmZpZy5uYW1lfVxuICAgICAgICAgIHRpbWVsaW5lTmFtZXM9e09iamVjdC5rZXlzKCh0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSkgPyB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZS50aW1lbGluZXMgOiB7fSl9XG4gICAgICAgICAgc2VsZWN0ZWRUaW1lbGluZU5hbWU9e3RoaXMuc3RhdGUuY3VycmVudFRpbWVsaW5lTmFtZX1cbiAgICAgICAgICBjdXJyZW50RnJhbWU9e3RoaXMuc3RhdGUuY3VycmVudEZyYW1lfVxuICAgICAgICAgIGlzUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgcGxheWJhY2tTcGVlZD17dGhpcy5zdGF0ZS5wbGF5ZXJQbGF5YmFja1NwZWVkfVxuICAgICAgICAgIGxhc3RGcmFtZT17dGhpcy5nZXRGcmFtZUluZm8oKS5mcmlNYXh9XG4gICAgICAgICAgY2hhbmdlVGltZWxpbmVOYW1lPXsob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZXhlY3V0ZUJ5dGVjb2RlQWN0aW9uUmVuYW1lVGltZWxpbmUob2xkVGltZWxpbmVOYW1lLCBuZXdUaW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBjcmVhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkdXBsaWNhdGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EdXBsaWNhdGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkZWxldGVUaW1lbGluZT17KHRpbWVsaW5lTmFtZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25EZWxldGVUaW1lbGluZSh0aW1lbGluZU5hbWUpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBzZWxlY3RUaW1lbGluZT17KGN1cnJlbnRUaW1lbGluZU5hbWUpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHdlIHVwZGF0ZSB0aGUgaW4tbWVtb3J5IGNvbXBvbmVudCBvciBwcm9wZXJ0eSBhc3NpZ25tZW50IG1pZ2h0IG5vdCB3b3JrIGNvcnJlY3RseVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFRpbWVsaW5lTmFtZShjdXJyZW50VGltZWxpbmVOYW1lLCB7IGZyb206ICd0aW1lbGluZScgfSwgKCkgPT4ge30pXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5hY3Rpb24oJ3NldFRpbWVsaW5lTmFtZScsIFt0aGlzLnByb3BzLmZvbGRlciwgY3VycmVudFRpbWVsaW5lTmFtZV0sICgpID0+IHt9KVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGN1cnJlbnRUaW1lbGluZU5hbWUgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHBsYXliYWNrU2tpcEJhY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8qIHRoaXMuX2NvbXBvbmVudC5nZXRDdXJyZW50VGltZWxpbmUoKS5wYXVzZSgpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVZpc2libGVGcmFtZVJhbmdlKGZyYW1lSW5mby5mcmkwIC0gZnJhbWVJbmZvLmZyaUEpICovXG4gICAgICAgICAgICAvKiB0aGlzLnVwZGF0ZVRpbWUoZnJhbWVJbmZvLmZyaTApICovXG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpMClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBpc1BsYXllclBsYXlpbmc6IGZhbHNlLCBjdXJyZW50RnJhbWU6IGZyYW1lSW5mby5mcmkwIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBwbGF5YmFja1NraXBGb3J3YXJkPXsoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGlzUGxheWVyUGxheWluZzogZmFsc2UsIGN1cnJlbnRGcmFtZTogZnJhbWVJbmZvLmZyaU1heCB9KVxuICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWtBbmRQYXVzZShmcmFtZUluZm8uZnJpTWF4KVxuICAgICAgICAgIH19XG4gICAgICAgICAgcGxheWJhY2tQbGF5UGF1c2U9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlUGxheWJhY2soKVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2hhbmdlUGxheWJhY2tTcGVlZD17KGlucHV0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGxldCBwbGF5ZXJQbGF5YmFja1NwZWVkID0gTnVtYmVyKGlucHV0RXZlbnQudGFyZ2V0LnZhbHVlIHx8IDEpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcGxheWVyUGxheWJhY2tTcGVlZCB9KVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIChpbnB1dEl0ZW0pIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgcmV0dXJuIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yKGlucHV0SXRlbS5ub2RlLCBmcmFtZUluZm8sIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCB0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZSwgdGhpcy5fY29tcG9uZW50LCB0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKSwgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLCBpbnB1dEl0ZW0ucHJvcGVydHkpXG4gIH1cblxuICBnZXRDdXJyZW50VGltZWxpbmVUaW1lIChmcmFtZUluZm8pIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmN1cnJlbnRGcmFtZSAqIGZyYW1lSW5mby5tc3BmKVxuICB9XG5cbiAgcmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChpdGVtKSB7XG4gICAgbGV0IGNvbXBvbmVudElkID0gaXRlbS5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LWlkJ11cbiAgICBsZXQgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBsZXQgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuXG4gICAgLy8gVE9ETzogT3B0aW1pemUgdGhpcz8gV2UgZG9uJ3QgbmVlZCB0byByZW5kZXIgZXZlcnkgc2VnbWVudCBzaW5jZSBzb21lIG9mIHRoZW0gb3ZlcmxhcC5cbiAgICAvLyBNYXliZSBrZWVwIGEgbGlzdCBvZiBrZXlmcmFtZSAncG9sZXMnIHJlbmRlcmVkLCBhbmQgb25seSByZW5kZXIgb25jZSBpbiB0aGF0IHNwb3Q/XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSdjb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA0LCBoZWlnaHQ6IDI1LCB3aWR0aDogJzEwMCUnLCBvdmVyZmxvdzogJ2hpZGRlbicgfX0+XG4gICAgICAgIHt0aGlzLm1hcFZpc2libGVDb21wb25lbnRUaW1lbGluZVNlZ21lbnRzKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBpdGVtLnByb3BlcnR5Um93cywgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICAgICAgaWYgKGN1cnIuY3VydmUpIHtcbiAgICAgICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlclRyYW5zaXRpb25Cb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDEsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAobmV4dCkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMiwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZEVsZW1lbnQ6IHRydWUgfSkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBjdXJyLm5hbWUsIHRoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRFbGVtZW50OiB0cnVlIH0pKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzZWdtZW50UGllY2VzXG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVySW52aXNpYmxlS2V5ZnJhbWVEcmFnZ2VyIChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgaW5kZXgsIGhhbmRsZSwgb3B0aW9ucykge1xuICAgIHJldHVybiAoXG4gICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAvLyBOT1RFOiBXZSBjYW50IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRSb3dDYWNoZUFjdGl2YXRpb24oeyBjb21wb25lbnRJZCwgcHJvcGVydHlOYW1lIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRQeDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGN1cnIubXNcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnRyYW5zaXRpb25Cb2R5RHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgICBsZXQgbXNDaGFuZ2UgPSAocHhDaGFuZ2UgLyBmcmFtZUluZm8ucHhwZikgKiBmcmFtZUluZm8ubXNwZlxuICAgICAgICAgICAgbGV0IGRlc3RNcyA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydE1zICsgbXNDaGFuZ2UpXG4gICAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgaGFuZGxlLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgICAgfVxuICAgICAgICB9LCBUSFJPVFRMRV9USU1FKX1cbiAgICAgICAgb25Nb3VzZURvd249eyhlKSA9PiB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRTZWdtZW50cyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1xuICAgICAgICAgIGlmICghZS5zaGlmdEtleSkge1xuICAgICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXMgPSB7fVxuICAgICAgICAgICAgc2VsZWN0ZWRTZWdtZW50cyA9IHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBpbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIG1zOiBjdXJyLm1zLFxuICAgICAgICAgICAgaGFuZGxlLFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWVcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNlbGVjdGVkS2V5ZnJhbWVzLCBzZWxlY3RlZFNlZ21lbnRzIH0pXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgcHhPZmZzZXRMZWZ0ICsgTWF0aC5yb3VuZChmcmFtZUluZm8ucHhBIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gY3Vyci5tc1xuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IGN1cnIuZnJhbWVcbiAgICAgICAgICAgIHRoaXMuY3R4bWVudS5zaG93KHtcbiAgICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAgZW5kTXM6IG51bGwsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBudWxsLFxuICAgICAgICAgICAgICBjdXJ2ZTogbnVsbCxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgd2lkdGg6IDEwLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMyxcbiAgICAgICAgICAgIGN1cnNvcjogJ2NvbC1yZXNpemUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgIDwvRHJhZ2dhYmxlQ29yZT5cbiAgICApXG4gIH1cblxuICByZW5kZXJTb2xvS2V5ZnJhbWUgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGxldCBpc0FjdGl2ZSA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSAhPSB1bmRlZmluZWQpIGlzQWN0aXZlID0gdHJ1ZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fS0ke2N1cnIubXN9YH1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQsXG4gICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICB0b3A6IC0zLFxuICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgekluZGV4OiAxMDAyXG4gICAgICAgIH19PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzTmFtZT0na2V5ZnJhbWUtZGlhbW9uZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpID8gJ3BvaW50ZXInIDogJ21vdmUnXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgIDogKGlzQWN0aXZlKVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLXG4gICAgICAgICAgfSAvPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyVHJhbnNpdGlvbkJvZHkgKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke2NvbXBvbmVudElkfS0ke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBjb25zdCBjdXJ2ZSA9IGN1cnIuY3VydmUuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjdXJyLmN1cnZlLnNsaWNlKDEpXG4gICAgY29uc3QgYnJlYWtpbmdCb3VuZHMgPSBjdXJ2ZS5pbmNsdWRlcygnQmFjaycpIHx8IGN1cnZlLmluY2x1ZGVzKCdCb3VuY2UnKSB8fCBjdXJ2ZS5pbmNsdWRlcygnRWxhc3RpYycpXG4gICAgY29uc3QgQ3VydmVTVkcgPSBDVVJWRVNWR1NbY3VydmUgKyAnU1ZHJ11cbiAgICBsZXQgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IGZhbHNlXG4gICAgbGV0IHNlY29uZEtleWZyYW1lQWN0aXZlID0gZmFsc2VcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdICE9IHVuZGVmaW5lZCkgZmlyc3RLZXlmcmFtZUFjdGl2ZSA9IHRydWVcbiAgICBpZiAodGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIChjdXJyLmluZGV4ICsgMSldICE9IHVuZGVmaW5lZCkgc2Vjb25kS2V5ZnJhbWVBY3RpdmUgPSB0cnVlXG5cbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgLy8gTk9URTogV2UgY2Fubm90IHVzZSAnY3Vyci5tcycgZm9yIGtleSBoZXJlIGJlY2F1c2UgdGhlc2UgdGhpbmdzIG1vdmUgYXJvdW5kXG4gICAgICAgIGtleT17YCR7cHJvcGVydHlOYW1lfS0ke2luZGV4fWB9XG4gICAgICAgIGF4aXM9J3gnXG4gICAgICAgIG9uU3RhcnQ9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuY29sbGFwc2VkKSByZXR1cm4gZmFsc2VcbiAgICAgICAgICB0aGlzLnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICBrZXlmcmFtZURyYWdTdGFydFB4OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAga2V5ZnJhbWVEcmFnU3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgIHRyYW5zaXRpb25Cb2R5RHJhZ2dpbmc6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy51bnNldFJvd0NhY2hlQWN0aXZhdGlvbih7IGNvbXBvbmVudElkLCBwcm9wZXJ0eU5hbWUgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsga2V5ZnJhbWVEcmFnU3RhcnRQeDogZmFsc2UsIGtleWZyYW1lRHJhZ1N0YXJ0TXM6IGZhbHNlLCB0cmFuc2l0aW9uQm9keURyYWdnaW5nOiBmYWxzZSB9KVxuICAgICAgICB9fVxuICAgICAgICBvbkRyYWc9e2xvZGFzaC50aHJvdHRsZSgoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBweENoYW5nZSA9IGRyYWdEYXRhLmxhc3RYIC0gdGhpcy5zdGF0ZS5rZXlmcmFtZURyYWdTdGFydFB4XG4gICAgICAgICAgbGV0IG1zQ2hhbmdlID0gKHB4Q2hhbmdlIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGZcbiAgICAgICAgICBsZXQgZGVzdE1zID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLmtleWZyYW1lRHJhZ1N0YXJ0TXMgKyBtc0NoYW5nZSlcbiAgICAgICAgICB0aGlzLmV4ZWN1dGVCeXRlY29kZUFjdGlvbk1vdmVTZWdtZW50RW5kcG9pbnRzKGNvbXBvbmVudElkLCB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5TmFtZSwgJ2JvZHknLCBjdXJyLmluZGV4LCBjdXJyLm1zLCBkZXN0TXMpXG4gICAgICAgIH0sIFRIUk9UVExFX1RJTUUpfVxuICAgICAgICBvbk1vdXNlRG93bj17KGUpID0+IHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgICAgbGV0IHNlbGVjdGVkS2V5ZnJhbWVzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZEtleWZyYW1lc1xuICAgICAgICAgIGxldCBzZWxlY3RlZFNlZ21lbnRzID0gdGhpcy5zdGF0ZS5zZWxlY3RlZFNlZ21lbnRzXG4gICAgICAgICAgaWYgKCFlLnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBzZWxlY3RlZEtleWZyYW1lcyA9IHt9XG4gICAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzID0ge31cbiAgICAgICAgICB9XG4gICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXNbY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4XSA9IHtcbiAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIGluZGV4OiBjdXJyLmluZGV4LFxuICAgICAgICAgICAgbXM6IGN1cnIubXMsXG4gICAgICAgICAgICBoYW5kbGU6ICdtaWRkbGUnXG4gICAgICAgICAgfVxuICAgICAgICAgIHNlbGVjdGVkS2V5ZnJhbWVzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgKGN1cnIuaW5kZXggKyAxKV0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyAoY3Vyci5pbmRleCArIDEpLFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBpbmRleDogbmV4dC5pbmRleCxcbiAgICAgICAgICAgIG1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgaGFuZGxlOiAnbWlkZGxlJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICBpZDogY29tcG9uZW50SWQgKyAnLScgKyBwcm9wZXJ0eU5hbWUgKyAnLScgKyBjdXJyLmluZGV4LFxuICAgICAgICAgICAgY29tcG9uZW50SWQsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgIGhhc0N1cnZlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzZWxlY3RlZEtleWZyYW1lcywgc2VsZWN0ZWRTZWdtZW50cyB9KVxuICAgICAgICB9fT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBjbGFzc05hbWU9J3BpbGwtY29udGFpbmVyJ1xuICAgICAgICAgIGtleT17dW5pcXVlS2V5fVxuICAgICAgICAgIHJlZj17KGRvbUVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXNbdW5pcXVlS2V5XSA9IGRvbUVsZW1lbnRcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmNvbGxhcHNlZCkgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgICAgbGV0IHRvdGFsT2Zmc2V0WCA9IGxvY2FsT2Zmc2V0WCArIHB4T2Zmc2V0TGVmdCArIE1hdGgucm91bmQoZnJhbWVJbmZvLnB4QSAvIGZyYW1lSW5mby5weHBmKVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdrZXlmcmFtZS10cmFuc2l0aW9uJyxcbiAgICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgICBldmVudDogY3R4TWVudUV2ZW50Lm5hdGl2ZUV2ZW50LFxuICAgICAgICAgICAgICBjb21wb25lbnRJZCxcbiAgICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICAgIHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgICAgc3RhcnRGcmFtZTogY3Vyci5mcmFtZSxcbiAgICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgICAgc3RhcnRNczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgY3VydmU6IGN1cnIuY3VydmUsXG4gICAgICAgICAgICAgIGVuZEZyYW1lOiBuZXh0LmZyYW1lLFxuICAgICAgICAgICAgICBlbmRNczogbmV4dC5tcyxcbiAgICAgICAgICAgICAgbG9jYWxPZmZzZXRYLFxuICAgICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICAgIGNsaWNrZWRGcmFtZSxcbiAgICAgICAgICAgICAgY2xpY2tlZE1zLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VFbnRlcj17KHJlYWN0RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzW3VuaXF1ZUtleV0pIHRoaXNbdW5pcXVlS2V5XS5zdHlsZS5jb2xvciA9IFBhbGV0dGUuR1JBWVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsocmVhY3RFdmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXNbdW5pcXVlS2V5XSkgdGhpc1t1bmlxdWVLZXldLnN0eWxlLmNvbG9yID0gJ3RyYW5zcGFyZW50J1xuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogcHhPZmZzZXRMZWZ0ICsgNCxcbiAgICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgIFdlYmtpdFVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKVxuICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICA6ICdtb3ZlJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHtvcHRpb25zLmNvbGxhcHNlZCAmJlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsLWNvbGxhcHNlZC1iYWNrZHJvcCdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDUsXG4gICAgICAgICAgICAgICAgekluZGV4OiA0LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuR1JBWVxuICAgICAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwaWxsJ1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMSxcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiA1LFxuICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IChvcHRpb25zLmNvbGxhcHNlZClcbiAgICAgICAgICAgICAgPyAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgID8gQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjkzKVxuICAgICAgICAgICAgICAgIDogQ29sb3IoUGFsZXR0ZS5TVU5TVE9ORSkuZmFkZSgwLjk2NSlcbiAgICAgICAgICAgICAgOiBDb2xvcihQYWxldHRlLlNVTlNUT05FKS5mYWRlKDAuOTEpXG4gICAgICAgICAgICB9fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNSxcbiAgICAgICAgICAgICAgd2lkdGg6IDksXG4gICAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICAgIHRvcDogLTQsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEuNyknLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDJcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPSdrZXlmcmFtZS1kaWFtb25kJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgICBsZWZ0OiAxLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogKG9wdGlvbnMuY29sbGFwc2VkKSA/ICdwb2ludGVyJyA6ICdtb3ZlJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPEtleWZyYW1lU1ZHIGNvbG9yPXsob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgICAgOiBQYWxldHRlLlJPQ0tcbiAgICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwMixcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogNSxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICAgICAgICBvdmVyZmxvdzogYnJlYWtpbmdCb3VuZHMgPyAndmlzaWJsZScgOiAnaGlkZGVuJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgICAgPEN1cnZlU1ZHXG4gICAgICAgICAgICAgIGlkPXt1bmlxdWVLZXl9XG4gICAgICAgICAgICAgIGxlZnRHcmFkRmlsbD17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKChvcHRpb25zLmNvbGxhcHNlZFByb3BlcnR5KVxuICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICAgICAgICAgIDogKGZpcnN0S2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DSyl9XG4gICAgICAgICAgICAgIHJpZ2h0R3JhZEZpbGw9eyhvcHRpb25zLmNvbGxhcHNlZEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgPyBQYWxldHRlLkJMVUVcbiAgICAgICAgICAgICAgICA6ICgob3B0aW9ucy5jb2xsYXBzZWRQcm9wZXJ0eSlcbiAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkRBUktfUk9DS1xuICAgICAgICAgICAgICAgICAgICA6IChzZWNvbmRLZXlmcmFtZUFjdGl2ZSlcbiAgICAgICAgICAgICAgICAgICAgICA/IFBhbGV0dGUuTElHSFRFU1RfUElOS1xuICAgICAgICAgICAgICAgICAgICAgIDogUGFsZXR0ZS5ST0NLKX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6IC01LFxuICAgICAgICAgICAgICB3aWR0aDogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAyNCxcbiAgICAgICAgICAgICAgdG9wOiAtNCxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMS43KScsXG4gICAgICAgICAgICAgIHRyYW5zaXRpb246ICdvcGFjaXR5IDEzMG1zIGxpbmVhcicsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMlxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICBjbGFzc05hbWU9J2tleWZyYW1lLWRpYW1vbmQnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICAgIGxlZnQ6IDEsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAob3B0aW9ucy5jb2xsYXBzZWQpXG4gICAgICAgICAgICAgICAgICA/ICdwb2ludGVyJ1xuICAgICAgICAgICAgICAgICAgOiAnbW92ZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxLZXlmcmFtZVNWRyBjb2xvcj17KG9wdGlvbnMuY29sbGFwc2VkRWxlbWVudClcbiAgICAgICAgICAgICAgICA/IFBhbGV0dGUuQkxVRVxuICAgICAgICAgICAgICAgIDogKG9wdGlvbnMuY29sbGFwc2VkUHJvcGVydHkpXG4gICAgICAgICAgICAgICAgICAgID8gUGFsZXR0ZS5EQVJLX1JPQ0tcbiAgICAgICAgICAgICAgICAgICAgOiAoc2Vjb25kS2V5ZnJhbWVBY3RpdmUpXG4gICAgICAgICAgICAgICAgICAgICAgPyBQYWxldHRlLkxJR0hURVNUX1BJTktcbiAgICAgICAgICAgICAgICAgICAgICA6IFBhbGV0dGUuUk9DS1xuICAgICAgICAgICAgICB9IC8+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ29uc3RhbnRCb2R5IChmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgaW5kZXgsIG9wdGlvbnMpIHtcbiAgICAvLyBjb25zdCBhY3RpdmVJbmZvID0gc2V0QWN0aXZlQ29udGVudHMocHJvcGVydHlOYW1lLCBjdXJyLCBuZXh0LCBmYWxzZSwgdGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgIGNvbnN0IHVuaXF1ZUtleSA9IGAke3Byb3BlcnR5TmFtZX0tJHtpbmRleH0tJHtjdXJyLm1zfWBcbiAgICBsZXQgaXNTZWxlY3RlZCA9IGZhbHNlXG4gICAgaWYgKHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1tjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXhdICE9IHVuZGVmaW5lZCkgaXNTZWxlY3RlZCA9IHRydWVcblxuICAgIHJldHVybiAoXG4gICAgICA8c3BhblxuICAgICAgICByZWY9eyhkb21FbGVtZW50KSA9PiB7XG4gICAgICAgICAgdGhpc1t1bmlxdWVLZXldID0gZG9tRWxlbWVudFxuICAgICAgICB9fVxuICAgICAgICBrZXk9e2Ake3Byb3BlcnR5TmFtZX0tJHtpbmRleH1gfVxuICAgICAgICBjbGFzc05hbWU9J2NvbnN0YW50LWJvZHknXG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5jb2xsYXBzZWQpIHJldHVybiBmYWxzZVxuICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIGxldCBsb2NhbE9mZnNldFggPSBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQub2Zmc2V0WFxuICAgICAgICAgIGxldCB0b3RhbE9mZnNldFggPSBsb2NhbE9mZnNldFggKyBweE9mZnNldExlZnQgKyBNYXRoLnJvdW5kKGZyYW1lSW5mby5weEEgLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZEZyYW1lID0gTWF0aC5yb3VuZCh0b3RhbE9mZnNldFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgdGhpcy5jdHhtZW51LnNob3coe1xuICAgICAgICAgICAgdHlwZTogJ2tleWZyYW1lLXNlZ21lbnQnLFxuICAgICAgICAgICAgZnJhbWVJbmZvLFxuICAgICAgICAgICAgZXZlbnQ6IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudCxcbiAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgdGltZWxpbmVOYW1lOiB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWUsXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBzdGFydEZyYW1lOiBjdXJyLmZyYW1lLFxuICAgICAgICAgICAga2V5ZnJhbWVJbmRleDogY3Vyci5pbmRleCxcbiAgICAgICAgICAgIHN0YXJ0TXM6IGN1cnIubXMsXG4gICAgICAgICAgICBlbmRGcmFtZTogbmV4dC5mcmFtZSxcbiAgICAgICAgICAgIGVuZE1zOiBuZXh0Lm1zLFxuICAgICAgICAgICAgY3VydmU6IG51bGwsXG4gICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICB0b3RhbE9mZnNldFgsXG4gICAgICAgICAgICBjbGlja2VkRnJhbWUsXG4gICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICBlbGVtZW50TmFtZVxuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uTW91c2VEb3duPXsoZSkgPT4ge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgc2VsZWN0ZWRTZWdtZW50cyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRTZWdtZW50c1xuICAgICAgICAgIGxldCBzZWxlY3RlZEtleWZyYW1lcyA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRLZXlmcmFtZXNcbiAgICAgICAgICBpZiAoIWUuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkU2VnbWVudHMgPSB7fVxuICAgICAgICAgICAgc2VsZWN0ZWRLZXlmcmFtZXMgPSB7fVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxlY3RlZFNlZ21lbnRzW2NvbXBvbmVudElkICsgJy0nICsgcHJvcGVydHlOYW1lICsgJy0nICsgY3Vyci5pbmRleF0gPSB7XG4gICAgICAgICAgICAgIGlkOiBjb21wb25lbnRJZCArICctJyArIHByb3BlcnR5TmFtZSArICctJyArIGN1cnIuaW5kZXgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBlbGVtZW50TmFtZSxcbiAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLFxuICAgICAgICAgICAgICBtczogY3Vyci5tcyxcbiAgICAgICAgICAgICAgZW5kTXM6IG5leHQubXMsXG4gICAgICAgICAgICAgIGhhc0N1cnZlOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2VsZWN0ZWRTZWdtZW50cywgc2VsZWN0ZWRLZXlmcmFtZXMgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiBweE9mZnNldExlZnQgKyA0LFxuICAgICAgICAgIHdpZHRoOiBweE9mZnNldFJpZ2h0IC0gcHhPZmZzZXRMZWZ0LFxuICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHRcbiAgICAgICAgfX0+XG4gICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgaGVpZ2h0OiAzLFxuICAgICAgICAgIHRvcDogMTIsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAyLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAob3B0aW9ucy5jb2xsYXBzZWRFbGVtZW50KVxuICAgICAgICAgICAgPyBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4yMylcbiAgICAgICAgICAgIDogKGlzU2VsZWN0ZWQpXG4gICAgICAgICAgICAgID8gIENvbG9yKFBhbGV0dGUuTElHSFRFU1RfUElOSykuZmFkZSguNSlcbiAgICAgICAgICAgICAgOiBQYWxldHRlLkRBUktFUl9HUkFZXG4gICAgICAgIH19IC8+XG4gICAgICA8L3NwYW4+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzIChmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGFsbEl0ZW1zLCByZWlmaWVkQnl0ZWNvZGUpIHtcbiAgICBjb25zdCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgY29uc3QgZWxlbWVudE5hbWUgPSAodHlwZW9mIGl0ZW0ubm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBpdGVtLm5vZGUuZWxlbWVudE5hbWVcbiAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5Lm5hbWVcbiAgICBjb25zdCBpc0FjdGl2YXRlZCA9IHRoaXMuaXNSb3dBY3RpdmF0ZWQoaXRlbSlcblxuICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVQcm9wZXJ0eVRpbWVsaW5lU2VnbWVudHMoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgcmVpZmllZEJ5dGVjb2RlLCAocHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHNlZ21lbnRQaWVjZXMgPSBbXVxuXG4gICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBpc0FjdGl2YXRlZCB9KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyQ29uc3RhbnRCb2R5KGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAyLCB7fSkpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmV2IHx8ICFwcmV2LmN1cnZlKSB7XG4gICAgICAgICAgc2VnbWVudFBpZWNlcy5wdXNoKHRoaXMucmVuZGVyU29sb0tleWZyYW1lKGZyYW1lSW5mbywgY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIHJlaWZpZWRCeXRlY29kZSwgcHJldiwgY3VyciwgbmV4dCwgcHhPZmZzZXRMZWZ0LCBweE9mZnNldFJpZ2h0LCAzLCB7IGlzQWN0aXZhdGVkIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCAtIDEwLCA0LCAnbGVmdCcsIHt9KSlcbiAgICAgIH1cbiAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgNSwgJ21pZGRsZScsIHt9KSlcbiAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgIHNlZ21lbnRQaWVjZXMucHVzaCh0aGlzLnJlbmRlckludmlzaWJsZUtleWZyYW1lRHJhZ2dlcihmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgcHJvcGVydHlOYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCArIDEwLCA2LCAncmlnaHQnLCB7fSkpXG4gICAgICB9XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXZcbiAgICAgICAgICBrZXk9e2BrZXlmcmFtZS1jb250YWluZXItJHtjb21wb25lbnRJZH0tJHtwcm9wZXJ0eU5hbWV9LSR7aW5kZXh9YH1cbiAgICAgICAgICBjbGFzc05hbWU9e2BrZXlmcmFtZS1jb250YWluZXJgfT5cbiAgICAgICAgICB7c2VnbWVudFBpZWNlc31cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSlcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLVxuXG4gIHJlbmRlckdhdWdlIChmcmFtZUluZm8pIHtcbiAgICBpZiAodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKSB7XG4gICAgICByZXR1cm4gdGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgIGlmIChmcmFtZU51bWJlciA9PT0gMCB8fCBmcmFtZU51bWJlciAlIGZyYW1lTW9kdWx1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c3BhbiBrZXk9e2BmcmFtZS0ke2ZyYW1lTnVtYmVyfWB9IHN0eWxlPXt7IHBvaW50ZXJFdmVudHM6ICdub25lJywgZGlzcGxheTogJ2lubGluZS1ibG9jaycsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCBsZWZ0OiBwaXhlbE9mZnNldExlZnQsIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSknIH19PlxuICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBmb250V2VpZ2h0OiAnYm9sZCcgfX0+e2ZyYW1lTnVtYmVyfTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmICh0aGlzLnN0YXRlLnRpbWVEaXNwbGF5TW9kZSA9PT0gJ3NlY29uZHMnKSB7IC8vIGFrYSB0aW1lIGVsYXBzZWQsIG5vdCBmcmFtZXNcbiAgICAgIHJldHVybiB0aGlzLm1hcFZpc2libGVUaW1lcygobWlsbGlzZWNvbmRzTnVtYmVyLCBwaXhlbE9mZnNldExlZnQsIHRvdGFsTWlsbGlzZWNvbmRzKSA9PiB7XG4gICAgICAgIGlmICh0b3RhbE1pbGxpc2Vjb25kcyA8PSAxMDAwKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxzcGFuIGtleT17YHRpbWUtJHttaWxsaXNlY29uZHNOdW1iZXJ9YH0gc3R5bGU9e3sgcG9pbnRlckV2ZW50czogJ25vbmUnLCBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKScgfX0+XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRXZWlnaHQ6ICdib2xkJyB9fT57bWlsbGlzZWNvbmRzTnVtYmVyfW1zPC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHNwYW4ga2V5PXtgdGltZS0ke21pbGxpc2Vjb25kc051bWJlcn1gfSBzdHlsZT17eyBwb2ludGVyRXZlbnRzOiAnbm9uZScsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogcGl4ZWxPZmZzZXRMZWZ0LCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgZm9udFdlaWdodDogJ2JvbGQnIH19Pntmb3JtYXRTZWNvbmRzKG1pbGxpc2Vjb25kc051bWJlciAvIDEwMDApfXM8L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlckZyYW1lR3JpZCAoZnJhbWVJbmZvKSB7XG4gICAgdmFyIGd1aWRlSGVpZ2h0ID0gKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCAtIDI1KSB8fCAwXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgaWQ9J2ZyYW1lLWdyaWQnPlxuICAgICAgICB7dGhpcy5tYXBWaXNpYmxlRnJhbWVzKChmcmFtZU51bWJlciwgcGl4ZWxPZmZzZXRMZWZ0LCBwaXhlbHNQZXJGcmFtZSwgZnJhbWVNb2R1bHVzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIDxzcGFuIGtleT17YGZyYW1lLSR7ZnJhbWVOdW1iZXJ9YH0gc3R5bGU9e3toZWlnaHQ6IGd1aWRlSGVpZ2h0ICsgMzUsIGJvcmRlckxlZnQ6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjY1KSwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGxlZnQ6IHBpeGVsT2Zmc2V0TGVmdCwgdG9wOiAzNH19IC8+XG4gICAgICAgIH0pfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyU2NydWJiZXIgKCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgaWYgKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lIDwgZnJhbWVJbmZvLmZyaUEgfHwgdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgPiBmcmFtZUluZm8uZnJhQikgcmV0dXJuICcnXG4gICAgdmFyIGZyYW1lT2Zmc2V0ID0gdGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLSBmcmFtZUluZm8uZnJpQVxuICAgIHZhciBweE9mZnNldCA9IGZyYW1lT2Zmc2V0ICogZnJhbWVJbmZvLnB4cGZcbiAgICB2YXIgc2hhZnRIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0ICsgMTApIHx8IDBcbiAgICByZXR1cm4gKFxuICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgYXhpcz0neCdcbiAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgICAgICBzY3J1YmJlckRyYWdTdGFydDogZHJhZ0RhdGEueCxcbiAgICAgICAgICAgIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLFxuICAgICAgICAgICAgYXZvaWRUaW1lbGluZVBvaW50ZXJFdmVudHM6IHRydWVcbiAgICAgICAgICB9KVxuICAgICAgICB9fVxuICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2NydWJiZXJEcmFnU3RhcnQ6IG51bGwsIGZyYW1lQmFzZWxpbmU6IHRoaXMuc3RhdGUuY3VycmVudEZyYW1lLCBhdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50czogZmFsc2UgfSlcbiAgICAgICAgICB9LCAxMDApXG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgdGhpcy5jaGFuZ2VTY3J1YmJlclBvc2l0aW9uKGRyYWdEYXRhLngsIGZyYW1lSW5mbylcbiAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgIGhlaWdodDogMTMsXG4gICAgICAgICAgICAgIHdpZHRoOiAxMyxcbiAgICAgICAgICAgICAgdG9wOiAyMCxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQgLSA2LFxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICBjdXJzb3I6ICdtb3ZlJyxcbiAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAwIHJnYmEoMCwgMCwgMCwgLjkpJyxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDA2XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDYsXG4gICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IDAsXG4gICAgICAgICAgICAgIHRvcDogOCxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzZweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICAgICAgICAgIGJvcmRlclJpZ2h0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyVG9wOiAnOHB4IHNvbGlkICcgKyBQYWxldHRlLlNVTlNUT05FXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICAgIGhlaWdodDogMCxcbiAgICAgICAgICAgICAgbGVmdDogMSxcbiAgICAgICAgICAgICAgdG9wOiA4LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnNnB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgYm9yZGVyUmlnaHQ6ICc2cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgICAgICAgICBib3JkZXJUb3A6ICc4cHggc29saWQgJyArIFBhbGV0dGUuU1VOU1RPTkVcbiAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHNoYWZ0SGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgdG9wOiAyNSxcbiAgICAgICAgICAgICAgbGVmdDogcHhPZmZzZXQsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyRHVyYXRpb25Nb2RpZmllciAoKSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICAvLyB2YXIgdHJpbUFyZWFIZWlnaHQgPSAodGhpcy5yZWZzLnNjcm9sbHZpZXcgJiYgdGhpcy5yZWZzLnNjcm9sbHZpZXcuY2xpZW50SGVpZ2h0IC0gMjUpIHx8IDBcbiAgICB2YXIgcHhPZmZzZXQgPSB0aGlzLnN0YXRlLmRyYWdJc0FkZGluZyA/IDAgOiAtdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0gKiBmcmFtZUluZm8ucHhwZlxuXG4gICAgaWYgKGZyYW1lSW5mby5mcmlCID49IGZyYW1lSW5mby5mcmlNYXgyIHx8IHRoaXMuc3RhdGUuZHJhZ0lzQWRkaW5nKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsXG4gICAgICAgICAgICAgIGR1cmF0aW9uRHJhZ1N0YXJ0OiBkcmFnRGF0YS54LFxuICAgICAgICAgICAgICBkdXJhdGlvblRyaW06IDBcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB2YXIgY3VycmVudE1heCA9IHRoaXMuc3RhdGUubWF4RnJhbWUgPyB0aGlzLnN0YXRlLm1heEZyYW1lIDogZnJhbWVJbmZvLmZyaU1heDJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5zdGF0ZS5hZGRJbnRlcnZhbClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe21heEZyYW1lOiBjdXJyZW50TWF4ICsgdGhpcy5zdGF0ZS5kdXJhdGlvblRyaW0sIGRyYWdJc0FkZGluZzogZmFsc2UsIGFkZEludGVydmFsOiBudWxsfSlcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNldFN0YXRlKHsgZHVyYXRpb25EcmFnU3RhcnQ6IG51bGwsIGR1cmF0aW9uVHJpbTogMCB9KSB9LCAxMDApXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkRyYWc9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUR1cmF0aW9uTW9kaWZpZXJQb3NpdGlvbihkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogcHhPZmZzZXQsIHRvcDogMCwgekluZGV4OiAxMDA2fX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgICAgICAgd2lkdGg6IDYsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzMixcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDMsXG4gICAgICAgICAgICAgICAgdG9wOiAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA1LFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ21vdmUnXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndHJpbS1hcmVhJyBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICBtb3VzZUV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICBsZWZ0OiAtNixcbiAgICAgICAgICAgICAgd2lkdGg6IDI2ICsgcHhPZmZzZXQsXG4gICAgICAgICAgICAgIGhlaWdodDogKHRoaXMucmVmcy5zY3JvbGx2aWV3ICYmIHRoaXMucmVmcy5zY3JvbGx2aWV3LmNsaWVudEhlaWdodCArIDM1KSB8fCAwLFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC42KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPHNwYW4gLz5cbiAgICB9XG4gIH1cblxuICByZW5kZXJUb3BDb250cm9scyAoKSB7XG4gICAgY29uc3QgZnJhbWVJbmZvID0gdGhpcy5nZXRGcmFtZUluZm8oKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzTmFtZT0ndG9wLWNvbnRyb2xzIG5vLXNlbGVjdCdcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0ICsgMTAsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10aW1la2VlcGluZy13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aFxuICAgICAgICAgIH19PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtdGltZS1yZWFkb3V0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZmxvYXQ6ICdyaWdodCcsXG4gICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgbWluV2lkdGg6IDg2LFxuICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0JyxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcGFkZGluZ1RvcDogMixcbiAgICAgICAgICAgICAgcGFkZGluZ1JpZ2h0OiAxMFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgaGVpZ2h0OiAyNCwgcGFkZGluZzogNCwgZm9udFdlaWdodDogJ2xpZ2h0ZXInLCBmb250U2l6ZTogMTkgfX0+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA6IDxzcGFuPntmb3JtYXRTZWNvbmRzKHRoaXMuc3RhdGUuY3VycmVudEZyYW1lICogMTAwMCAvIHRoaXMuc3RhdGUuZnJhbWVzUGVyU2Vjb25kIC8gMTAwMCl9czwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT0nZ2F1Z2UtZnBzLXJlYWRvdXQnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICB3aWR0aDogMzgsXG4gICAgICAgICAgICAgIGZsb2F0OiAncmlnaHQnLFxuICAgICAgICAgICAgICBsZWZ0OiAyMTEsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnLFxuICAgICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCxcbiAgICAgICAgICAgICAgZm9udFN0eWxlOiAnaXRhbGljJyxcbiAgICAgICAgICAgICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA1LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDUsXG4gICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICAgIHsodGhpcy5zdGF0ZS50aW1lRGlzcGxheU1vZGUgPT09ICdmcmFtZXMnKVxuICAgICAgICAgICAgICAgID8gPHNwYW4+e2Zvcm1hdFNlY29uZHModGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgKiAxMDAwIC8gdGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmQgLyAxMDAwKX1zPC9zcGFuPlxuICAgICAgICAgICAgICAgIDogPHNwYW4+e35+dGhpcy5zdGF0ZS5jdXJyZW50RnJhbWV9Zjwvc3Bhbj5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7bWFyZ2luVG9wOiAnLTRweCd9fT57dGhpcy5zdGF0ZS5mcmFtZXNQZXJTZWNvbmR9ZnBzPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS10b2dnbGUnXG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnRvZ2dsZVRpbWVEaXNwbGF5TW9kZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgd2lkdGg6IDUwLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDEwLFxuICAgICAgICAgICAgICBmb250U2l6ZTogOSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0b3AnLFxuICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLX01VVEVELFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDcsXG4gICAgICAgICAgICAgIHBhZGRpbmdSaWdodDogNSxcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RoaXMuc3RhdGUudGltZURpc3BsYXlNb2RlID09PSAnZnJhbWVzJ1xuICAgICAgICAgICAgICA/ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7Y29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5GUkFNRVNcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3t3aWR0aDogNiwgaGVpZ2h0OiA2LCBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSywgYm9yZGVyUmFkaXVzOiAnNTAlJywgcG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAtMTEsIHRvcDogMn19IC8+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17e21hcmdpblRvcDogJy0ycHgnfX0+U0VDT05EUzwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgICA6ICg8c3Bhbj5cbiAgICAgICAgICAgICAgICA8ZGl2PkZSQU1FUzwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3ttYXJnaW5Ub3A6ICctMnB4JywgY29sb3I6IFBhbGV0dGUuUk9DSywgcG9zaXRpb246ICdyZWxhdGl2ZSd9fT5TRUNPTkRTXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7d2lkdGg6IDYsIGhlaWdodDogNiwgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssIGJvcmRlclJhZGl1czogJzUwJScsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCByaWdodDogLTExLCB0b3A6IDJ9fSAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L3NwYW4+KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPSdnYXVnZS1ib3gnXG4gICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLnNjcnViYmVyRHJhZ1N0YXJ0ID09PSBudWxsIHx8IHRoaXMuc3RhdGUuc2NydWJiZXJEcmFnU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXQgbGVmdFggPSBjbGlja0V2ZW50Lm5hdGl2ZUV2ZW50Lm9mZnNldFhcbiAgICAgICAgICAgICAgbGV0IGZyYW1lWCA9IE1hdGgucm91bmQobGVmdFggLyBmcmFtZUluZm8ucHhwZilcbiAgICAgICAgICAgICAgbGV0IG5ld0ZyYW1lID0gZnJhbWVJbmZvLmZyaUEgKyBmcmFtZVhcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50LmdldEN1cnJlbnRUaW1lbGluZSgpLnNlZWsobmV3RnJhbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgLy8gZGlzcGxheTogJ3RhYmxlLWNlbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndG9wJyxcbiAgICAgICAgICAgIHBhZGRpbmdUb3A6IDEwLFxuICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DS19NVVRFRCB9fT5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJGcmFtZUdyaWQoZnJhbWVJbmZvKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJHYXVnZShmcmFtZUluZm8pfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclNjcnViYmVyKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJEdXJhdGlvbk1vZGlmaWVyKCl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJUaW1lbGluZVJhbmdlU2Nyb2xsYmFyICgpIHtcbiAgICBjb25zdCBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgY29uc3Qga25vYlJhZGl1cyA9IDVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3RpbWVsaW5lLXJhbmdlLXNjcm9sbGJhcidcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICB3aWR0aDogZnJhbWVJbmZvLnNjTCxcbiAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgICAgIH19PlxuICAgICAgICA8RHJhZ2dhYmxlQ29yZVxuICAgICAgICAgIGF4aXM9J3gnXG4gICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBzY3JvbGxlckJvZHlEcmFnU3RhcnQ6IGRyYWdEYXRhLngsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0sXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiB0cnVlXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIHNjcm9sbGVyQm9keURyYWdTdGFydDogZmFsc2UsXG4gICAgICAgICAgICAgIHNjcm9sbGJhclN0YXJ0OiBudWxsLFxuICAgICAgICAgICAgICBzY3JvbGxiYXJFbmQ6IG51bGwsXG4gICAgICAgICAgICAgIGF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzOiBmYWxzZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2hvd0hvcnpTY3JvbGxTaGFkb3c6IGZyYW1lSW5mby5zY0EgPiAwIH0pIC8vIGlmIHRoZSBzY3JvbGxiYXIgbm90IGF0IHBvc2l0aW9uIHplcm8sIHNob3cgaW5uZXIgc2hhZG93IGZvciB0aW1lbGluZSBhcmVhXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3RhdGUuc2Nyb2xsZXJMZWZ0RHJhZ1N0YXJ0ICYmICF0aGlzLnN0YXRlLnNjcm9sbGVyUmlnaHREcmFnU3RhcnQpIHtcbiAgICAgICAgICAgICAgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZShkcmFnRGF0YS54LCBkcmFnRGF0YS54LCBmcmFtZUluZm8pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRFU1RfR1JBWSxcbiAgICAgICAgICAgICAgaGVpZ2h0OiBrbm9iUmFkaXVzICogMixcbiAgICAgICAgICAgICAgbGVmdDogZnJhbWVJbmZvLnNjQSxcbiAgICAgICAgICAgICAgd2lkdGg6IGZyYW1lSW5mby5zY0IgLSBmcmFtZUluZm8uc2NBICsgMTcsXG4gICAgICAgICAgICAgIGJvcmRlclJhZGl1czoga25vYlJhZGl1cyxcbiAgICAgICAgICAgICAgY3Vyc29yOiAnbW92ZSdcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyTGVmdERyYWdTdGFydDogZHJhZ0RhdGEueCwgc2Nyb2xsYmFyU3RhcnQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMF0sIHNjcm9sbGJhckVuZDogdGhpcy5zdGF0ZS52aXNpYmxlRnJhbWVSYW5nZVsxXSB9KSB9fVxuICAgICAgICAgICAgICBvblN0b3A9eyhkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuc2V0U3RhdGUoeyBzY3JvbGxlckxlZnREcmFnU3RhcnQ6IGZhbHNlLCBzY3JvbGxiYXJTdGFydDogbnVsbCwgc2Nyb2xsYmFyRW5kOiBudWxsIH0pIH19XG4gICAgICAgICAgICAgIG9uRHJhZz17bG9kYXNoLnRocm90dGxlKChkcmFnRXZlbnQsIGRyYWdEYXRhKSA9PiB7IHRoaXMuY2hhbmdlVmlzaWJsZUZyYW1lUmFuZ2UoZHJhZ0RhdGEueCArIGZyYW1lSW5mby5zY0EsIDAsIGZyYW1lSW5mbykgfSwgVEhST1RUTEVfVElNRSl9PlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiAxMCwgaGVpZ2h0OiAxMCwgcG9zaXRpb246ICdhYnNvbHV0ZScsIGN1cnNvcjogJ2V3LXJlc2l6ZScsIGxlZnQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgICAgPERyYWdnYWJsZUNvcmVcbiAgICAgICAgICAgICAgYXhpcz0neCdcbiAgICAgICAgICAgICAgb25TdGFydD17KGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5zZXRTdGF0ZSh7IHNjcm9sbGVyUmlnaHREcmFnU3RhcnQ6IGRyYWdEYXRhLngsIHNjcm9sbGJhclN0YXJ0OiB0aGlzLnN0YXRlLnZpc2libGVGcmFtZVJhbmdlWzBdLCBzY3JvbGxiYXJFbmQ6IHRoaXMuc3RhdGUudmlzaWJsZUZyYW1lUmFuZ2VbMV0gfSkgfX1cbiAgICAgICAgICAgICAgb25TdG9wPXsoZHJhZ0V2ZW50LCBkcmFnRGF0YSkgPT4geyB0aGlzLnNldFN0YXRlKHsgc2Nyb2xsZXJSaWdodERyYWdTdGFydDogZmFsc2UsIHNjcm9sbGJhclN0YXJ0OiBudWxsLCBzY3JvbGxiYXJFbmQ6IG51bGwgfSkgfX1cbiAgICAgICAgICAgICAgb25EcmFnPXtsb2Rhc2gudGhyb3R0bGUoKGRyYWdFdmVudCwgZHJhZ0RhdGEpID0+IHsgdGhpcy5jaGFuZ2VWaXNpYmxlRnJhbWVSYW5nZSgwLCBkcmFnRGF0YS54ICsgZnJhbWVJbmZvLnNjQSwgZnJhbWVJbmZvKSB9LCBUSFJPVFRMRV9USU1FKX0+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDEwLCBoZWlnaHQ6IDEwLCBwb3NpdGlvbjogJ2Fic29sdXRlJywgY3Vyc29yOiAnZXctcmVzaXplJywgcmlnaHQ6IDAsIGJvcmRlclJhZGl1czogJzUwJScsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSB9fSAvPlxuICAgICAgICAgICAgPC9EcmFnZ2FibGVDb3JlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0RyYWdnYWJsZUNvcmU+XG4gICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCAtIDEwLCBsZWZ0OiAxMCwgcG9zaXRpb246ICdyZWxhdGl2ZScgfX0+XG4gICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBoZWlnaHQ6IGtub2JSYWRpdXMgKiAyLFxuICAgICAgICAgICAgd2lkdGg6IDEsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgIGxlZnQ6ICgodGhpcy5zdGF0ZS5jdXJyZW50RnJhbWUgLyBmcmFtZUluZm8uZnJpTWF4MikgKiAxMDApICsgJyUnXG4gICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICByZW5kZXJCb3R0b21Db250cm9scyAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6IDQ1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgekluZGV4OiAxMDAwMFxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMucmVuZGVyVGltZWxpbmVSYW5nZVNjcm9sbGJhcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJUaW1lbGluZVBsYXliYWNrQ29udHJvbHMoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlckNvbXBvbmVudFJvd0hlYWRpbmcgKHsgbm9kZSwgbG9jYXRvciwgaW5kZXgsIHNpYmxpbmdzLCBhc2NpaUJyYW5jaCB9KSB7XG4gICAgLy8gSEFDSzogVW50aWwgd2UgZW5hYmxlIGZ1bGwgc3VwcG9ydCBmb3IgbmVzdGVkIGRpc3BsYXkgaW4gdGhpcyBsaXN0LCBzd2FwIHRoZSBcInRlY2huaWNhbGx5IGNvcnJlY3RcIlxuICAgIC8vIHRyZWUgbWFya2VyIHdpdGggYSBcInZpc3VhbGx5IGNvcnJlY3RcIiBtYXJrZXIgcmVwcmVzZW50aW5nIHRoZSB0cmVlIHdlIGFjdHVhbGx5IHNob3dcbiAgICBjb25zdCBoZWlnaHQgPSBhc2NpaUJyYW5jaCA9PT0gJ+KUlOKUgOKUrCAnID8gMTUgOiAyNVxuICAgIGNvbnN0IGNvbG9yID0gbm9kZS5fX2lzRXhwYW5kZWQgPyBQYWxldHRlLlJPQ0sgOiBQYWxldHRlLlJPQ0tfTVVURURcbiAgICBjb25zdCBlbGVtZW50TmFtZSA9ICh0eXBlb2Ygbm9kZS5lbGVtZW50TmFtZSA9PT0gJ29iamVjdCcpID8gJ2RpdicgOiBub2RlLmVsZW1lbnROYW1lXG5cbiAgICByZXR1cm4gKFxuICAgICAgKGxvY2F0b3IgPT09ICcwJylcbiAgICAgICAgPyAoPGRpdiBzdHlsZT17e2hlaWdodDogMjcsIGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKDFweCknfX0+XG4gICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBlbGVtZW50TmFtZSwgMTIpfVxuICAgICAgICA8L2Rpdj4pXG4gICAgICAgIDogKDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAyMSxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ21pZGRsZScsXG4gICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IDcsXG4gICAgICAgICAgICAgIG1hcmdpblRvcDogMVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICA8c3BhbiBzdHlsZT17e21hcmdpbkxlZnQ6IDUsIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZX0ZJVDEsIHBvc2l0aW9uOiAnYWJzb2x1dGUnLCB3aWR0aDogMSwgaGVpZ2h0OiBoZWlnaHR9fSAvPlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3ttYXJnaW5MZWZ0OiA0fX0+4oCUPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY29sb3IsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge3RydW5jYXRlKG5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSB8fCBgPCR7ZWxlbWVudE5hbWV9PmAsIDgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPilcbiAgICApXG4gIH1cblxuICByZW5kZXJDb21wb25lbnRIZWFkaW5nUm93IChpdGVtLCBpbmRleCwgaGVpZ2h0LCBpdGVtcykge1xuICAgIGxldCBjb21wb25lbnRJZCA9IGl0ZW0ubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS1pZCddXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgY29tcG9uZW50LWhlYWRpbmctcm93LSR7Y29tcG9uZW50SWR9LSR7aW5kZXh9YH1cbiAgICAgICAgY2xhc3NOYW1lPSdjb21wb25lbnQtaGVhZGluZy1yb3cgbm8tc2VsZWN0J1xuICAgICAgICBkYXRhLWNvbXBvbmVudC1pZD17Y29tcG9uZW50SWR9XG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBDb2xsYXBzZS9leHBhbmQgdGhlIGVudGlyZSBjb21wb25lbnQgYXJlYSB3aGVuIGl0IGlzIGNsaWNrZWRcbiAgICAgICAgICBpZiAoaXRlbS5ub2RlLl9faXNFeHBhbmRlZCkge1xuICAgICAgICAgICAgdGhpcy5jb2xsYXBzZU5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbigndW5zZWxlY3RFbGVtZW50JywgW3RoaXMucHJvcHMuZm9sZGVyLCBjb21wb25lbnRJZF0sICgpID0+IHt9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmV4cGFuZE5vZGUoaXRlbS5ub2RlLCBjb21wb25lbnRJZClcbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LmFjdGlvbignc2VsZWN0RWxlbWVudCcsIFt0aGlzLnByb3BzLmZvbGRlciwgY29tcG9uZW50SWRdLCAoKSA9PiB7fSlcbiAgICAgICAgICB9XG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgZGlzcGxheTogJ3RhYmxlJyxcbiAgICAgICAgICB0YWJsZUxheW91dDogJ2ZpeGVkJyxcbiAgICAgICAgICBoZWlnaHQ6IGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQgPyAwIDogaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgekluZGV4OiAxMDA1LFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXRlbS5ub2RlLl9faXNFeHBhbmRlZCA/ICd0cmFuc3BhcmVudCcgOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RvcCcsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNzUgOiAxLjBcbiAgICAgICAgfX0+XG4gICAgICAgIHshaXRlbS5ub2RlLl9faXNFeHBhbmRlZCAmJiAvLyBjb3ZlcnMga2V5ZnJhbWUgaGFuZ292ZXIgYXQgZnJhbWUgMCB0aGF0IGZvciB1bmNvbGxhcHNlZCByb3dzIGlzIGhpZGRlbiBieSB0aGUgaW5wdXQgZmllbGRcbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHpJbmRleDogMTAwNixcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gMTAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgICAgICAgIHdpZHRoOiAxMCxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5yb3dIZWlnaHR9fSAvPn1cbiAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgIGRpc3BsYXk6ICd0YWJsZS1jZWxsJyxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSAxNTAsXG4gICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgekluZGV4OiAzLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKGl0ZW0ubm9kZS5fX2lzRXhwYW5kZWQpID8gJ3RyYW5zcGFyZW50JyA6IFBhbGV0dGUuTElHSFRfR1JBWVxuICAgICAgICB9fT5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodCwgbWFyZ2luVG9wOiAtNiB9fT5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgbWFyZ2luTGVmdDogMTBcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHsoaXRlbS5ub2RlLl9faXNFeHBhbmRlZClcbiAgICAgICAgICAgICAgICAgID8gPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAxLCBsZWZ0OiAtMSB9fT48RG93bkNhcnJvdFNWRyBjb2xvcj17UGFsZXR0ZS5ST0NLfSAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDogPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAzIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICB7dGhpcy5yZW5kZXJDb21wb25lbnRSb3dIZWFkaW5nKGl0ZW0pfVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J2NvbXBvbmVudC1jb2xsYXBzZWQtc2VnbWVudHMtYm94JyBzdHlsZT17eyBkaXNwbGF5OiAndGFibGUtY2VsbCcsIHdpZHRoOiB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLCBoZWlnaHQ6ICdpbmhlcml0JyB9fT5cbiAgICAgICAgICB7KCFpdGVtLm5vZGUuX19pc0V4cGFuZGVkKSA/IHRoaXMucmVuZGVyQ29sbGFwc2VkUHJvcGVydHlUaW1lbGluZVNlZ21lbnRzKGl0ZW0pIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyUHJvcGVydHlSb3cgKGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCkge1xuICAgIHZhciBmcmFtZUluZm8gPSB0aGlzLmdldEZyYW1lSW5mbygpXG4gICAgdmFyIGh1bWFuTmFtZSA9IGh1bWFuaXplUHJvcGVydHlOYW1lKGl0ZW0ucHJvcGVydHkubmFtZSlcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBpdGVtLnByb3BlcnR5ICYmIGl0ZW0ucHJvcGVydHkubmFtZVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAga2V5PXtgcHJvcGVydHktcm93LSR7aW5kZXh9LSR7Y29tcG9uZW50SWR9LSR7cHJvcGVydHlOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktcm93J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIGhlaWdodCxcbiAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggKyB0aGlzLnN0YXRlLnRpbWVsaW5lc1dpZHRoLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgb3BhY2l0eTogKGl0ZW0ubm9kZS5fX2lzSGlkZGVuKSA/IDAuNSA6IDEuMCxcbiAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICB9fT5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIC8vIENvbGxhcHNlIHRoaXMgY2x1c3RlciBpZiB0aGUgYXJyb3cgb3IgbmFtZSBpcyBjbGlja2VkXG4gICAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV0gPSAhZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzW2l0ZW0uY2x1c3RlcktleV1cbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLCAvLyBEZXNlbGN0IGFueSBzZWxlY3RlZCBpbnB1dFxuICAgICAgICAgICAgICBpbnB1dEZvY3VzZWQ6IG51bGwsIC8vIENhbmNlbCBhbnkgcGVuZGluZyBjaGFuZ2UgaW5zaWRlIGEgZm9jdXNlZCBpbnB1dFxuICAgICAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfX0+XG4gICAgICAgICAgeyhpdGVtLmlzQ2x1c3RlckhlYWRpbmcpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTQsXG4gICAgICAgICAgICAgICAgbGVmdDogMTM2LFxuICAgICAgICAgICAgICAgIHRvcDogLTIsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDA2LFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPSd1dGYtaWNvbicgc3R5bGU9e3sgdG9wOiAtNCwgbGVmdDogLTMgfX0+PERvd25DYXJyb3RTVkcgLz48L3NwYW4+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJydcbiAgICAgICAgICB9XG4gICAgICAgICAgeyghcHJvcGVydHlPbkxhc3RDb21wb25lbnQgJiYgaHVtYW5OYW1lICE9PSAnYmFja2dyb3VuZCBjb2xvcicpICYmXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiAzNixcbiAgICAgICAgICAgICAgd2lkdGg6IDUsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwNSxcbiAgICAgICAgICAgICAgYm9yZGVyTGVmdDogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5HUkFZX0ZJVDEsXG4gICAgICAgICAgICAgIGhlaWdodFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICB9XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS1yb3ctbGFiZWwgbm8tc2VsZWN0J1xuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcmlnaHQ6IDAsXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgwLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUucm93SGVpZ2h0LFxuICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdyaWdodCcsXG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDQsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgICAgICAgICBwYWRkaW5nUmlnaHQ6IDEwXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgd2lkdGg6IDkxLFxuICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLFxuICAgICAgICAgICAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICAgICAgdHJhbnNmb3JtOiBodW1hbk5hbWUgPT09ICdiYWNrZ3JvdW5kIGNvbG9yJyA/ICd0cmFuc2xhdGVZKC0ycHgpJyA6ICd0cmFuc2xhdGVZKDNweCknLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJ1xuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIHtodW1hbk5hbWV9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwcm9wZXJ0eS1pbnB1dC1maWVsZCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDgyLFxuICAgICAgICAgICAgd2lkdGg6IDgyLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLnJvd0hlaWdodCAtIDEsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxQcm9wZXJ0eUlucHV0RmllbGRcbiAgICAgICAgICAgIHBhcmVudD17dGhpc31cbiAgICAgICAgICAgIGl0ZW09e2l0ZW19XG4gICAgICAgICAgICBpbmRleD17aW5kZXh9XG4gICAgICAgICAgICBoZWlnaHQ9e2hlaWdodH1cbiAgICAgICAgICAgIGZyYW1lSW5mbz17ZnJhbWVJbmZvfVxuICAgICAgICAgICAgY29tcG9uZW50PXt0aGlzLl9jb21wb25lbnR9XG4gICAgICAgICAgICBpc1BsYXllclBsYXlpbmc9e3RoaXMuc3RhdGUuaXNQbGF5ZXJQbGF5aW5nfVxuICAgICAgICAgICAgdGltZWxpbmVUaW1lPXt0aGlzLmdldEN1cnJlbnRUaW1lbGluZVRpbWUoZnJhbWVJbmZvKX1cbiAgICAgICAgICAgIHRpbWVsaW5lTmFtZT17dGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lfVxuICAgICAgICAgICAgcm93SGVpZ2h0PXt0aGlzLnN0YXRlLnJvd0hlaWdodH1cbiAgICAgICAgICAgIGlucHV0U2VsZWN0ZWQ9e3RoaXMuc3RhdGUuaW5wdXRTZWxlY3RlZH1cbiAgICAgICAgICAgIHNlcmlhbGl6ZWRCeXRlY29kZT17dGhpcy5zdGF0ZS5zZXJpYWxpemVkQnl0ZWNvZGV9XG4gICAgICAgICAgICByZWlmaWVkQnl0ZWNvZGU9e3RoaXMuc3RhdGUucmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICAgIGN0eE1lbnVFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbGV0IGxvY2FsT2Zmc2V0WCA9IGN0eE1lbnVFdmVudC5uYXRpdmVFdmVudC5vZmZzZXRYXG4gICAgICAgICAgICBsZXQgdG90YWxPZmZzZXRYID0gbG9jYWxPZmZzZXRYICsgZnJhbWVJbmZvLnB4QVxuICAgICAgICAgICAgbGV0IGNsaWNrZWRGcmFtZSA9IE1hdGgucm91bmQodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpXG4gICAgICAgICAgICBsZXQgY2xpY2tlZE1zID0gTWF0aC5yb3VuZCgodG90YWxPZmZzZXRYIC8gZnJhbWVJbmZvLnB4cGYpICogZnJhbWVJbmZvLm1zcGYpXG4gICAgICAgICAgICB0aGlzLmN0eG1lbnUuc2hvdyh7XG4gICAgICAgICAgICAgIHR5cGU6ICdwcm9wZXJ0eS1yb3cnLFxuICAgICAgICAgICAgICBmcmFtZUluZm8sXG4gICAgICAgICAgICAgIGV2ZW50OiBjdHhNZW51RXZlbnQubmF0aXZlRXZlbnQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudElkLFxuICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICAgIHRpbWVsaW5lTmFtZTogdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICBsb2NhbE9mZnNldFgsXG4gICAgICAgICAgICAgIHRvdGFsT2Zmc2V0WCxcbiAgICAgICAgICAgICAgY2xpY2tlZEZyYW1lLFxuICAgICAgICAgICAgICBjbGlja2VkTXMsXG4gICAgICAgICAgICAgIGVsZW1lbnROYW1lXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgY2xhc3NOYW1lPSdwcm9wZXJ0eS10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIGxldCBrZXkgPSBpdGVtLmNvbXBvbmVudElkICsgJyAnICsgaXRlbS5wcm9wZXJ0eS5uYW1lXG4gICAgICAgICAgICAvLyBBdm9pZCB1bm5lY2Vzc2FyeSBzZXRTdGF0ZXMgd2hpY2ggY2FuIGltcGFjdCByZW5kZXJpbmcgcGVyZm9ybWFuY2VcbiAgICAgICAgICAgIGlmICghdGhpcy5zdGF0ZS5hY3RpdmF0ZWRSb3dzW2tleV0pIHtcbiAgICAgICAgICAgICAgbGV0IGFjdGl2YXRlZFJvd3MgPSB7fVxuICAgICAgICAgICAgICBhY3RpdmF0ZWRSb3dzW2tleV0gPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhY3RpdmF0ZWRSb3dzIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoIC0gNCwgLy8gb2Zmc2V0IGhhbGYgb2YgbG9uZSBrZXlmcmFtZSB3aWR0aCBzbyBpdCBsaW5lcyB1cCB3aXRoIHRoZSBwb2xlXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBoZWlnaHQ6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlclByb3BlcnR5VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGl0ZW0sIGluZGV4LCBoZWlnaHQsIGl0ZW1zLCB0aGlzLnN0YXRlLnJlaWZpZWRCeXRlY29kZSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmVuZGVyQ2x1c3RlclJvdyAoaXRlbSwgaW5kZXgsIGhlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KSB7XG4gICAgdmFyIGZyYW1lSW5mbyA9IHRoaXMuZ2V0RnJhbWVJbmZvKClcbiAgICB2YXIgY29tcG9uZW50SWQgPSBpdGVtLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICAgIHZhciBlbGVtZW50TmFtZSA9ICh0eXBlb2YgaXRlbS5ub2RlLmVsZW1lbnROYW1lID09PSAnb2JqZWN0JykgPyAnZGl2JyA6IGl0ZW0ubm9kZS5lbGVtZW50TmFtZVxuICAgIHZhciBjbHVzdGVyTmFtZSA9IGl0ZW0uY2x1c3Rlck5hbWVcbiAgICB2YXIgcmVpZmllZEJ5dGVjb2RlID0gdGhpcy5zdGF0ZS5yZWlmaWVkQnl0ZWNvZGVcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBrZXk9e2Bwcm9wZXJ0eS1jbHVzdGVyLXJvdy0ke2luZGV4fS0ke2NvbXBvbmVudElkfS0ke2NsdXN0ZXJOYW1lfWB9XG4gICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci1yb3cnXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAvLyBFeHBhbmQgdGhlIHByb3BlcnR5IGNsdXN0ZXIgd2hlbiBpdCBpcyBjbGlja2VkXG4gICAgICAgICAgbGV0IGV4cGFuZGVkUHJvcGVydHlDbHVzdGVycyA9IGxvZGFzaC5jbG9uZSh0aGlzLnN0YXRlLmV4cGFuZGVkUHJvcGVydHlDbHVzdGVycylcbiAgICAgICAgICBleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XSA9ICFleHBhbmRlZFByb3BlcnR5Q2x1c3RlcnNbaXRlbS5jbHVzdGVyS2V5XVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbnVsbCxcbiAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogbnVsbCxcbiAgICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1xuICAgICAgICAgIH0pXG4gICAgICAgIH19XG4gICAgICAgIG9uQ29udGV4dE1lbnU9eyhjdHhNZW51RXZlbnQpID0+IHtcbiAgICAgICAgICBjdHhNZW51RXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICBsZXQgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzID0gbG9kYXNoLmNsb25lKHRoaXMuc3RhdGUuZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzKVxuICAgICAgICAgIGV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldID0gIWV4cGFuZGVkUHJvcGVydHlDbHVzdGVyc1tpdGVtLmNsdXN0ZXJLZXldXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBpbnB1dFNlbGVjdGVkOiBudWxsLFxuICAgICAgICAgICAgaW5wdXRGb2N1c2VkOiBudWxsLFxuICAgICAgICAgICAgZXhwYW5kZWRQcm9wZXJ0eUNsdXN0ZXJzXG4gICAgICAgICAgfSlcbiAgICAgICAgfX1cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUucHJvcGVydGllc1dpZHRoICsgdGhpcy5zdGF0ZS50aW1lbGluZXNXaWR0aCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIG9wYWNpdHk6IChpdGVtLm5vZGUuX19pc0hpZGRlbikgPyAwLjUgOiAxLjAsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICAgICAgfX0+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgeyFwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMzYsXG4gICAgICAgICAgICAgIHdpZHRoOiA1LFxuICAgICAgICAgICAgICBib3JkZXJMZWZ0OiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkdSQVlfRklUMSxcbiAgICAgICAgICAgICAgaGVpZ2h0XG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICAgIH1cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogMTQ1LFxuICAgICAgICAgICAgICB3aWR0aDogMTAsXG4gICAgICAgICAgICAgIGhlaWdodDogJ2luaGVyaXQnXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0ndXRmLWljb24nIHN0eWxlPXt7IHRvcDogLTIsIGxlZnQ6IC0zIH19PjxSaWdodENhcnJvdFNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItcm93LWxhYmVsIG5vLXNlbGVjdCdcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA5MCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCcsXG4gICAgICAgICAgICAgIHRleHRBbGlnbjogJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgIHBhZGRpbmdUb3A6IDVcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3tcbiAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuREFSS19ST0NLXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAge2NsdXN0ZXJOYW1lfVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3Byb3BlcnR5LWNsdXN0ZXItaW5wdXQtZmllbGQnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5wcm9wZXJ0aWVzV2lkdGggLSA4MixcbiAgICAgICAgICAgIHdpZHRoOiA4MixcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGhlaWdodDogMjQsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdsZWZ0J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIDxDbHVzdGVySW5wdXRGaWVsZFxuICAgICAgICAgICAgcGFyZW50PXt0aGlzfVxuICAgICAgICAgICAgaXRlbT17aXRlbX1cbiAgICAgICAgICAgIGluZGV4PXtpbmRleH1cbiAgICAgICAgICAgIGhlaWdodD17aGVpZ2h0fVxuICAgICAgICAgICAgZnJhbWVJbmZvPXtmcmFtZUluZm99XG4gICAgICAgICAgICBjb21wb25lbnQ9e3RoaXMuX2NvbXBvbmVudH1cbiAgICAgICAgICAgIGlzUGxheWVyUGxheWluZz17dGhpcy5zdGF0ZS5pc1BsYXllclBsYXlpbmd9XG4gICAgICAgICAgICB0aW1lbGluZVRpbWU9e3RoaXMuZ2V0Q3VycmVudFRpbWVsaW5lVGltZShmcmFtZUluZm8pfVxuICAgICAgICAgICAgdGltZWxpbmVOYW1lPXt0aGlzLnN0YXRlLmN1cnJlbnRUaW1lbGluZU5hbWV9XG4gICAgICAgICAgICByb3dIZWlnaHQ9e3RoaXMuc3RhdGUucm93SGVpZ2h0fVxuICAgICAgICAgICAgc2VyaWFsaXplZEJ5dGVjb2RlPXt0aGlzLnN0YXRlLnNlcmlhbGl6ZWRCeXRlY29kZX1cbiAgICAgICAgICAgIHJlaWZpZWRCeXRlY29kZT17cmVpZmllZEJ5dGVjb2RlfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT0ncHJvcGVydHktY2x1c3Rlci10aW1lbGluZS1zZWdtZW50cy1ib3gnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUudGltZWxpbmVzV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLnByb3BlcnRpZXNXaWR0aCAtIDQsIC8vIG9mZnNldCBoYWxmIG9mIGxvbmUga2V5ZnJhbWUgd2lkdGggc28gaXQgbGluZXMgdXAgd2l0aCB0aGUgcG9sZVxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgaGVpZ2h0OiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7dGhpcy5tYXBWaXNpYmxlQ29tcG9uZW50VGltZWxpbmVTZWdtZW50cyhmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgW2l0ZW1dLCByZWlmaWVkQnl0ZWNvZGUsIChwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBsZXQgc2VnbWVudFBpZWNlcyA9IFtdXG4gICAgICAgICAgICBpZiAoY3Vyci5jdXJ2ZSkge1xuICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJUcmFuc2l0aW9uQm9keShmcmFtZUluZm8sIGNvbXBvbmVudElkLCBlbGVtZW50TmFtZSwgY3Vyci5uYW1lLCByZWlmaWVkQnl0ZWNvZGUsIHByZXYsIGN1cnIsIG5leHQsIHB4T2Zmc2V0TGVmdCwgcHhPZmZzZXRSaWdodCwgMSwgeyBjb2xsYXBzZWQ6IHRydWUsIGNvbGxhcHNlZFByb3BlcnR5OiB0cnVlIH0pKVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKG5leHQpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJDb25zdGFudEJvZHkoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDIsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAoIXByZXYgfHwgIXByZXYuY3VydmUpIHtcbiAgICAgICAgICAgICAgICBzZWdtZW50UGllY2VzLnB1c2godGhpcy5yZW5kZXJTb2xvS2V5ZnJhbWUoZnJhbWVJbmZvLCBjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIGN1cnIubmFtZSwgcmVpZmllZEJ5dGVjb2RlLCBwcmV2LCBjdXJyLCBuZXh0LCBweE9mZnNldExlZnQsIHB4T2Zmc2V0UmlnaHQsIDMsIHsgY29sbGFwc2VkOiB0cnVlLCBjb2xsYXBzZWRQcm9wZXJ0eTogdHJ1ZSB9KSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNlZ21lbnRQaWVjZXNcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICAvLyBDcmVhdGVzIGEgdmlydHVhbCBsaXN0IG9mIGFsbCB0aGUgY29tcG9uZW50IHJvd3MgKGluY2x1ZGVzIGhlYWRpbmdzIGFuZCBwcm9wZXJ0eSByb3dzKVxuICByZW5kZXJDb21wb25lbnRSb3dzIChpdGVtcykge1xuICAgIGlmICghdGhpcy5zdGF0ZS5kaWRNb3VudCkgcmV0dXJuIDxzcGFuIC8+XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9J3Byb3BlcnR5LXJvdy1saXN0J1xuICAgICAgICBzdHlsZT17bG9kYXNoLmFzc2lnbih7fSwge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgIH0pfT5cbiAgICAgICAge2l0ZW1zLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU9uTGFzdENvbXBvbmVudCA9IGl0ZW0uc2libGluZ3MubGVuZ3RoID4gMCAmJiBpdGVtLmluZGV4ID09PSBpdGVtLnNpYmxpbmdzLmxlbmd0aCAtIDFcbiAgICAgICAgICBpZiAoaXRlbS5pc0NsdXN0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckNsdXN0ZXJSb3coaXRlbSwgaW5kZXgsIHRoaXMuc3RhdGUucm93SGVpZ2h0LCBpdGVtcywgcHJvcGVydHlPbkxhc3RDb21wb25lbnQpXG4gICAgICAgICAgfSBlbHNlIGlmIChpdGVtLmlzUHJvcGVydHkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlclByb3BlcnR5Um93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMsIHByb3BlcnR5T25MYXN0Q29tcG9uZW50KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJDb21wb25lbnRIZWFkaW5nUm93KGl0ZW0sIGluZGV4LCB0aGlzLnN0YXRlLnJvd0hlaWdodCwgaXRlbXMpXG4gICAgICAgICAgfVxuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSA9IHRoaXMuZ2V0Q29tcG9uZW50Um93c0RhdGEoKVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICBpZD0ndGltZWxpbmUnXG4gICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0J1xuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5HUkFZLFxuICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gNDVweCknLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3dZOiAnaGlkZGVuJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nXG4gICAgICAgIH19PlxuICAgICAgICB7dGhpcy5zdGF0ZS5zaG93SG9yelNjcm9sbFNoYWRvdyAmJlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT0nbm8tc2VsZWN0JyBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIHdpZHRoOiAzLFxuICAgICAgICAgICAgbGVmdDogMjk3LFxuICAgICAgICAgICAgekluZGV4OiAyMDAzLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgYm94U2hhZG93OiAnM3B4IDAgNnB4IDAgcmdiYSgwLDAsMCwuMjIpJ1xuICAgICAgICAgIH19IC8+XG4gICAgICAgIH1cbiAgICAgICAge3RoaXMucmVuZGVyVG9wQ29udHJvbHMoKX1cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nc2Nyb2xsdmlldydcbiAgICAgICAgICBpZD0ncHJvcGVydHktcm93cydcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDM1LFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiB0aGlzLnN0YXRlLmF2b2lkVGltZWxpbmVQb2ludGVyRXZlbnRzID8gJ25vbmUnIDogJ2F1dG8nLFxuICAgICAgICAgICAgV2Via2l0VXNlclNlbGVjdDogdGhpcy5zdGF0ZS5hdm9pZFRpbWVsaW5lUG9pbnRlckV2ZW50cyA/ICdub25lJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgICAgb3ZlcmZsb3dYOiAnaGlkZGVuJ1xuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZURvd249eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkS2V5ZnJhbWVzOiB7fSwgc2VsZWN0ZWRTZWdtZW50czoge319KVxuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnJlbmRlckNvbXBvbmVudFJvd3ModGhpcy5zdGF0ZS5jb21wb25lbnRSb3dzRGF0YSl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICB7dGhpcy5yZW5kZXJCb3R0b21Db250cm9scygpfVxuICAgICAgICA8RXhwcmVzc2lvbklucHV0XG4gICAgICAgICAgcmVmPSdleHByZXNzaW9uSW5wdXQnXG4gICAgICAgICAgcmVhY3RQYXJlbnQ9e3RoaXN9XG4gICAgICAgICAgaW5wdXRTZWxlY3RlZD17dGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkfVxuICAgICAgICAgIGlucHV0Rm9jdXNlZD17dGhpcy5zdGF0ZS5pbnB1dEZvY3VzZWR9XG4gICAgICAgICAgb25Db21taXRWYWx1ZT17KGNvbW1pdHRlZFZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ1t0aW1lbGluZV0gaW5wdXQgY29tbWl0OicsIEpTT04uc3RyaW5naWZ5KGNvbW1pdHRlZFZhbHVlKSlcblxuICAgICAgICAgICAgdGhpcy5leGVjdXRlQnl0ZWNvZGVBY3Rpb25DcmVhdGVLZXlmcmFtZShcbiAgICAgICAgICAgICAgZ2V0SXRlbUNvbXBvbmVudElkKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50VGltZWxpbmVOYW1lLFxuICAgICAgICAgICAgICB0aGlzLnN0YXRlLmlucHV0Rm9jdXNlZC5ub2RlLmVsZW1lbnROYW1lLFxuICAgICAgICAgICAgICBnZXRJdGVtUHJvcGVydHlOYW1lKHRoaXMuc3RhdGUuaW5wdXRGb2N1c2VkKSxcbiAgICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50VGltZWxpbmVUaW1lKHRoaXMuZ2V0RnJhbWVJbmZvKCkpLFxuICAgICAgICAgICAgICBjb21taXR0ZWRWYWx1ZSxcbiAgICAgICAgICAgICAgdm9pZCAoMCksIC8vIGN1cnZlXG4gICAgICAgICAgICAgIHZvaWQgKDApLCAvLyBlbmRNc1xuICAgICAgICAgICAgICB2b2lkICgwKSAvLyBlbmRWYWx1ZVxuICAgICAgICAgICAgKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Gb2N1c1JlcXVlc3RlZD17KCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogdGhpcy5zdGF0ZS5pbnB1dFNlbGVjdGVkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25OYXZpZ2F0ZVJlcXVlc3RlZD17KG5hdkRpciwgZG9Gb2N1cykgPT4ge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLnN0YXRlLmlucHV0U2VsZWN0ZWRcbiAgICAgICAgICAgIGxldCBuZXh0ID0gbmV4dFByb3BJdGVtKGl0ZW0sIG5hdkRpcilcbiAgICAgICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIGlucHV0Rm9jdXNlZDogKGRvRm9jdXMpID8gbmV4dCA6IG51bGwsXG4gICAgICAgICAgICAgICAgaW5wdXRTZWxlY3RlZDogbmV4dFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19IC8+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuZnVuY3Rpb24gX2J1aWxkQ29tcG9uZW50QWRkcmVzc2FibGVzIChub2RlKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBfYnVpbGRET01BZGRyZXNzYWJsZXMoJ2RpdicpIC8vIHN0YXJ0IHdpdGggZG9tIHByb3BlcnRpZXM/XG4gIGZvciAobGV0IG5hbWUgaW4gbm9kZS5lbGVtZW50TmFtZS5zdGF0ZXMpIHtcbiAgICBsZXQgc3RhdGUgPSBub2RlLmVsZW1lbnROYW1lLnN0YXRlc1tuYW1lXVxuXG4gICAgYWRkcmVzc2FibGVzLnB1c2goe1xuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHByZWZpeDogbmFtZSxcbiAgICAgIHN1ZmZpeDogdW5kZWZpbmVkLFxuICAgICAgZmFsbGJhY2s6IHN0YXRlLnZhbHVlLFxuICAgICAgdHlwZWRlZjogc3RhdGUudHlwZVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIGFkZHJlc3NhYmxlc1xufVxuXG5mdW5jdGlvbiBfYnVpbGRET01BZGRyZXNzYWJsZXMgKGVsZW1lbnROYW1lLCBsb2NhdG9yKSB7XG4gIHZhciBhZGRyZXNzYWJsZXMgPSBbXVxuXG4gIGNvbnN0IGRvbVNjaGVtYSA9IERPTVNjaGVtYVtlbGVtZW50TmFtZV1cbiAgY29uc3QgZG9tRmFsbGJhY2tzID0gRE9NRmFsbGJhY2tzW2VsZW1lbnROYW1lXVxuXG4gIGlmIChkb21TY2hlbWEpIHtcbiAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gZG9tU2NoZW1hKSB7XG4gICAgICBsZXQgcHJvcGVydHlHcm91cCA9IG51bGxcblxuICAgICAgaWYgKGxvY2F0b3IgPT09ICcwJykgeyAvLyBUaGlzIGluZGljYXRlcyB0aGUgdG9wIGxldmVsIGVsZW1lbnQgKHRoZSBhcnRib2FyZClcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNfVE9QX0xFVkVMW3Byb3BlcnR5TmFtZV0pIHtcbiAgICAgICAgICBsZXQgbmFtZVBhcnRzID0gcHJvcGVydHlOYW1lLnNwbGl0KCcuJylcblxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1gnKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3gnXVxuICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUgPT09ICdzdHlsZS5vdmVyZmxvd1knKSBuYW1lUGFydHMgPSBbJ292ZXJmbG93JywgJ3knXVxuXG4gICAgICAgICAgcHJvcGVydHlHcm91cCA9IHtcbiAgICAgICAgICAgIG5hbWU6IHByb3BlcnR5TmFtZSxcbiAgICAgICAgICAgIHByZWZpeDogbmFtZVBhcnRzWzBdLFxuICAgICAgICAgICAgc3VmZml4OiBuYW1lUGFydHNbMV0sXG4gICAgICAgICAgICBmYWxsYmFjazogZG9tRmFsbGJhY2tzW3Byb3BlcnR5TmFtZV0sXG4gICAgICAgICAgICB0eXBlZGVmOiBkb21TY2hlbWFbcHJvcGVydHlOYW1lXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKEFMTE9XRURfUFJPUFNbcHJvcGVydHlOYW1lXSkge1xuICAgICAgICAgIGxldCBuYW1lUGFydHMgPSBwcm9wZXJ0eU5hbWUuc3BsaXQoJy4nKVxuICAgICAgICAgIHByb3BlcnR5R3JvdXAgPSB7XG4gICAgICAgICAgICBuYW1lOiBwcm9wZXJ0eU5hbWUsXG4gICAgICAgICAgICBwcmVmaXg6IG5hbWVQYXJ0c1swXSxcbiAgICAgICAgICAgIHN1ZmZpeDogbmFtZVBhcnRzWzFdLFxuICAgICAgICAgICAgZmFsbGJhY2s6IGRvbUZhbGxiYWNrc1twcm9wZXJ0eU5hbWVdLFxuICAgICAgICAgICAgdHlwZWRlZjogZG9tU2NoZW1hW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BlcnR5R3JvdXApIHtcbiAgICAgICAgbGV0IGNsdXN0ZXJQcmVmaXggPSBDTFVTVEVSRURfUFJPUFNbcHJvcGVydHlHcm91cC5uYW1lXVxuICAgICAgICBpZiAoY2x1c3RlclByZWZpeCkge1xuICAgICAgICAgIHByb3BlcnR5R3JvdXAuY2x1c3RlciA9IHtcbiAgICAgICAgICAgIHByZWZpeDogY2x1c3RlclByZWZpeCxcbiAgICAgICAgICAgIG5hbWU6IENMVVNURVJfTkFNRVNbY2x1c3RlclByZWZpeF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhZGRyZXNzYWJsZXMucHVzaChwcm9wZXJ0eUdyb3VwKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBhZGRyZXNzYWJsZXNcbn1cblxuZXhwb3J0IGRlZmF1bHQgVGltZWxpbmVcbiJdfQ==