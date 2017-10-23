'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Glass = undefined;
var _jsxFileName = 'src/react/Glass.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _dom = require('@haiku/player/lib/renderers/dom');

var _dom2 = _interopRequireDefault(_dom);

var _HaikuContext = require('@haiku/player/lib/HaikuContext');

var _HaikuContext2 = _interopRequireDefault(_HaikuContext);

var _ActiveComponent = require('haiku-serialization/src/model/ActiveComponent');

var _ActiveComponent2 = _interopRequireDefault(_ActiveComponent);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Comment = require('./Comment');

var _Comment2 = _interopRequireDefault(_Comment);

var _EventHandlerEditor = require('./EventHandlerEditor');

var _EventHandlerEditor2 = _interopRequireDefault(_EventHandlerEditor);

var _Comments = require('./models/Comments');

var _Comments2 = _interopRequireDefault(_Comments);

var _ContextMenu = require('./models/ContextMenu');

var _ContextMenu2 = _interopRequireDefault(_ContextMenu);

var _getLocalDomEventPosition = require('./helpers/getLocalDomEventPosition');

var _getLocalDomEventPosition2 = _interopRequireDefault(_getLocalDomEventPosition);

var _dndHelpers = require('haiku-serialization/src/utils/dndHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('electron'),
    clipboard = _require.clipboard;

var CLOCKWISE_CONTROL_POINTS = {
  0: [0, 1, 2, 5, 8, 7, 6, 3],
  1: [6, 7, 8, 5, 2, 1, 0, 3], // flipped vertical
  2: [2, 1, 0, 3, 6, 7, 8, 5], // flipped horizontal
  3: [8, 7, 6, 3, 0, 1, 2, 5] // flipped horizontal + vertical


  // The class is exported also _without_ the radium wrapper to allow jsdom testing
};
var Glass = exports.Glass = function (_React$Component) {
  _inherits(Glass, _React$Component);

  function Glass(props) {
    _classCallCheck(this, Glass);

    var _this = _possibleConstructorReturn(this, (Glass.__proto__ || Object.getPrototypeOf(Glass)).call(this, props));

    _this.state = {
      error: null,
      mountWidth: 550,
      mountHeight: 400,
      mountX: 0,
      mountY: 0,
      controlActivation: null,
      mousePositionCurrent: null,
      mousePositionPrevious: null,
      isAnythingScaling: false,
      isAnythingRotating: false,
      globalControlPointHandleClass: '',
      containerHeight: 0,
      containerWidth: 0,
      isStageSelected: false,
      isStageNameHovering: false,
      isMouseDown: false,
      lastMouseDownTime: null,
      lastMouseDownPosition: null,
      lastMouseUpPosition: null,
      lastMouseUpTime: null,
      isMouseDragging: false,
      isKeyShiftDown: false,
      isKeyCtrlDown: false,
      isKeyAltDown: false,
      isKeyCommandDown: false,
      isKeySpaceDown: false,
      panX: 0,
      panY: 0,
      originalPanX: 0,
      originalPanY: 0,
      zoomXY: 1,
      comments: [],
      doShowComments: false,
      targetElement: null,
      isEventHandlerEditorOpen: false,
      activeDrawingTool: 'pointer',
      drawingIsModal: true
    };

    _this._component = new _ActiveComponent2.default({
      alias: 'glass',
      folder: _this.props.folder,
      userconfig: _this.props.userconfig,
      websocket: _this.props.websocket,
      platform: window,
      envoy: _this.props.envoy,
      WebSocket: window.WebSocket
    });

    _this._component.setStageTransform({ zoom: _this.state.zoomXY, pan: { x: _this.state.panX, y: _this.state.panY } });
    _this._comments = new _Comments2.default(_this.props.folder);
    _this._ctxmenu = new _ContextMenu2.default(window, _this);

    _this._playing = false;
    _this._stopwatch = null;
    _this._lastAuthoritativeFrame = 0;

    _this._lastSelectedElement = null;
    _this._clipboardActionLock = false;

    _this.drawLoop = _this.drawLoop.bind(_this);
    _this.draw = _this.draw.bind(_this);
    _this._haikuRenderer = new _dom2.default();
    _this._haikuContext = new _HaikuContext2.default(null, _this._haikuRenderer, {}, { timelines: {}, template: { elementName: 'div', attributes: {}, children: [] } }, { options: { cache: {}, seed: 'abcde' } });

    _this.handleRequestElementCoordinates = _this.handleRequestElementCoordinates.bind(_this);

    _this.resetContainerDimensions();

    window.glass = _this;

    _this._component.on('envoy:timelineClientReady', function (timelineChannel) {
      timelineChannel.on('didPlay', _this.handleTimelineDidPlay.bind(_this));
      timelineChannel.on('didPause', _this.handleTimelineDidPause.bind(_this));
      timelineChannel.on('didSeek', _this.handleTimelineDidSeek.bind(_this));
    });

    _this._component.on('envoy:glassClientReady', function (glassChannel) {
      glassChannel.on('cut', function () {
        _this.handleVirtualClipboard('cut');
      });
      glassChannel.on('copy', function () {
        _this.handleVirtualClipboard('copy');
      });
    });

    _this._component.on('envoy:tourClientReady', function (client) {
      _this.tourClient = client;
      _this.tourClient.on('tour:requestElementCoordinates', _this.handleRequestElementCoordinates);
    });

    window.addEventListener('dragover', _dndHelpers.preventDefaultDrag, false);
    window.addEventListener('drop', _dndHelpers.linkExternalAssetsOnDrop.bind(_this), false);
    return _this;
  }

  _createClass(Glass, [{
    key: 'handleRequestElementCoordinates',
    value: function handleRequestElementCoordinates(_ref) {
      var selector = _ref.selector,
          webview = _ref.webview;

      if (webview !== 'glass') {
        return;
      }

      try {
        // TODO: find if there is a better solution to this scape hatch
        var element = document.querySelector(selector);

        var _element$getBoundingC = element.getBoundingClientRect(),
            top = _element$getBoundingC.top,
            left = _element$getBoundingC.left;

        this.tourClient.receiveElementCoordinates('glass', { top: top, left: left });
      } catch (error) {
        console.error('Error fetching ' + selector + ' in webview ' + webview);
      }
    }
  }, {
    key: 'handleTimelineDidPlay',
    value: function handleTimelineDidPlay() {
      this._playing = true;
      this._stopwatch = Date.now();
    }
  }, {
    key: 'handleTimelineDidPause',
    value: function handleTimelineDidPause(frameData) {
      this._playing = false;
      this._lastAuthoritativeFrame = frameData.frame;
      this._stopwatch = Date.now();
    }
  }, {
    key: 'handleTimelineDidSeek',
    value: function handleTimelineDidSeek(frameData) {
      this._lastAuthoritativeFrame = frameData.frame;
      this._stopwatch = Date.now();
      this.draw(true);
    }
  }, {
    key: 'draw',
    value: function draw(forceSeek) {
      if (this._playing || forceSeek) {
        var seekMs = 0;
        // this._stopwatch is null unless we've received an action from the timeline.
        // If we're developing the glass solo, i.e. without a connection to envoy which
        // provides the system clock, we can just lock the time value to zero as a hack.
        // TODO: Would be nice to allow full-fledged solo development of glass...
        if (this._stopwatch !== null) {
          var fps = 60; // TODO:  support variable
          var baseMs = this._lastAuthoritativeFrame * 1000 / fps;
          var deltaMs = this._playing ? Date.now() - this._stopwatch : 0;
          seekMs = baseMs + deltaMs;
        }

        // This rounding is required otherwise we'll see bizarre behavior on stage.
        // I think it's because some part of the player's caching or transition logic
        // which wants things to be round numbers. If we don't round this, i.e. convert
        // 16.666 -> 17 and 33.333 -> 33, then the player won't render those frames,
        // which means the user will have trouble moving things on stage at those times.
        seekMs = Math.round(seekMs);

        this._component._setTimelineTimeValue(seekMs, forceSeek);
      }

      if (this.refs.overlay) {
        this.drawOverlays(forceSeek);
      }
    }
  }, {
    key: 'drawLoop',
    value: function drawLoop() {
      this.draw();
      window.requestAnimationFrame(this.drawLoop);
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this._component.mountApplication(this.refs.mount, { options: { freeze: true, overflowX: 'visible', overflowY: 'visible', contextMenu: 'disabled' } });

      this._component.on('component:mounted', function () {
        var newMountSize = _this2._component.getContextSize();

        _this2.setState({
          mountWidth: newMountSize.width,
          mountHeight: newMountSize.height
        });

        _this2.drawLoop();
      });

      this._component.on('component:updated', function () {
        _this2.draw(true);

        // This happens on almost any update because theoretically a keyframe change,
        // a curve change, etc., could all result in the need to recalc the artboard :/
        var updatedArtboardSize = _this2._component.getContextSize();
        _this2.setState({
          mountWidth: updatedArtboardSize.width,
          mountHeight: updatedArtboardSize.height
        });
      });

      this._component.on('time:change', function (timelineName, timelineTime) {
        if (_this2._component && _this2._component.getMount() && !_this2._component.isReloadingCode) {
          var updatedArtboardSize = _this2._component.getContextSize();
          if (updatedArtboardSize && updatedArtboardSize.width && updatedArtboardSize.height) {
            _this2.setState({
              mountWidth: updatedArtboardSize.width,
              mountHeight: updatedArtboardSize.height
            });
          }
        }
      });

      // Pasteable things are stored at the global level in the clipboard but we need that action to fire from the top level
      // so that all the views get the message, so we emit this as an event and then wait for the call to pasteThing
      document.addEventListener('paste', function (pasteEvent) {
        console.info('[glass] paste heard');
        // Notify creator that we have some content that the person wishes to paste on the stage;
        // the top level needs to handle this because it does content type detection.
        pasteEvent.preventDefault();
        _this2.props.websocket.send({
          type: 'broadcast',
          name: 'current-pasteable:request-paste',
          from: 'glass',
          data: null // This can hold coordinates for the location of the paste
        });
      });

      document.addEventListener('cut', function () {
        _this2.handleVirtualClipboard('cut');
      });
      document.addEventListener('copy', function () {
        _this2.handleVirtualClipboard('copy');
      });

      // This fires when the context menu cut/copy action has been fired - not a keyboard action.
      // This fires with cut OR copy. In case of cut, the element has already been .cut()!
      this._component.on('element:copy', function (componentId) {
        console.info('[glass] element:copy', componentId);
        _this2._lastSelectedElement = _this2._component._elements.find(componentId);
        _this2.handleVirtualClipboard('copy');
      });

      // Since the current selected element can be deleted from the global menu, we need to keep it there
      this._component.on('element:selected', function (componentId) {
        console.info('[glass] element:selected', componentId);
        _this2._lastSelectedElement = _this2._component._elements.find(componentId);
      });

      // Since the current selected element can be deleted from the global menu, we need clear it there too
      this._component.on('element:unselected', function (componentId) {
        console.info('[glass] element:unselected', componentId);
        _this2._lastSelectedElement = null;
        _this2.draw(true);
      });

      this.props.websocket.on('broadcast', function (message) {
        var oldTransform; // Defined below // linter

        switch (message.name) {
          case 'component:reload':
            return _this2._component.moduleReplace(function (err) {
              // Notify the plumbing that the module replacement here has finished, which should reactivate
              // the undo/redo queues which should be waiting for this to finish
              // Note how we do this whether or not we got an error from the action
              _this2.props.websocket.send({
                type: 'broadcast',
                name: 'component:reload:complete',
                from: 'glass'
              });

              if (err) {
                return console.error(err);
              }

              // The artboard size may have changed as a part of that, and since there are two sources of
              // truth for this (actual artboard, React mount for artboard), we have to update it here.
              var updatedArtboardSize = _this2._component.getContextSize();
              _this2.setState({
                mountWidth: updatedArtboardSize.width,
                mountHeight: updatedArtboardSize.height
              });
            });

          case 'view:zoom-in':
            oldTransform = _this2._component.getStageTransform();
            oldTransform.zoom = _this2.state.zoomXY * 1.25;
            _this2._component.setStageTransform(oldTransform);
            return _this2.setState({ zoomXY: _this2.state.zoomXY * 1.25 });

          case 'view:zoom-out':
            oldTransform = _this2._component.getStageTransform();
            oldTransform.zoom = _this2.state.zoomXY / 1.25;
            _this2._component.setStageTransform(oldTransform);
            return _this2.setState({ zoomXY: _this2.state.zoomXY / 1.25 });

          case 'drawing:setActive':
            return _this2.setState({
              activeDrawingTool: message.params[0],
              drawingIsModal: message.params[1]
            });
        }
      });

      this.props.websocket.on('method', function (method, params, cb) {
        return _this2._component.callMethod(method, params, cb);
      });

      this._comments.load(function (err) {
        if (err) return void 0;
        _this2.setState({ comments: _this2._comments.comments });
      });

      this._ctxmenu.on('click', function (action, event, element) {
        switch (action) {
          case 'Add Comment':
            _this2._comments.build({ x: _this2._ctxmenu._menu.lastX, y: _this2._ctxmenu._menu.lastY });
            _this2.setState({ comments: _this2._comments.comments, doShowComments: true }, function () {
              _this2._ctxmenu.rebuild(_this2);
            });
            break;
          case 'Hide Comments':
            _this2.setState({ doShowComments: !_this2.state.doShowComments }, function () {
              _this2._ctxmenu.rebuild(_this2);
            });
            break;
          case 'Show Comments':
            _this2.setState({ doShowComments: !_this2.state.doShowComments }, function () {
              _this2._ctxmenu.rebuild(_this2);
            });
            break;
          case 'Show Event Listeners':
            _this2.showEventHandlersEditor(event, element);
            break;
        }
      });

      // Pasteable things are stored at the global level in the clipboard but we need that action to fire from the top level
      // so that all the views get the message, so we emit this as an event and then wait for the call to pasteThing
      this._ctxmenu.on('current-pasteable:request-paste', function (data) {
        _this2.props.websocket.send({
          type: 'broadcast',
          name: 'current-pasteable:request-paste',
          from: 'glass',
          data: data
        });
      });

      window.addEventListener('resize', _lodash2.default.throttle(function () {
        return _this2.handleWindowResize();
      }), 64);

      window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this));
      window.addEventListener('mousemove', this.windowMouseMoveHandler.bind(this));
      window.addEventListener('mouseup', this.windowMouseUpHandler.bind(this));
      window.addEventListener('mousedown', this.windowMouseDownHandler.bind(this));
      window.addEventListener('click', this.windowClickHandler.bind(this));
      window.addEventListener('dblclick', this.windowDblClickHandler.bind(this));
      window.addEventListener('keydown', this.windowKeyDownHandler.bind(this));
      window.addEventListener('keyup', this.windowKeyUpHandler.bind(this));
      window.addEventListener('mouseout', this.windowMouseOutHandler.bind(this));
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.resetContainerDimensions();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.tourClient.off('tour:requestElementCoordinates', this.handleRequestElementCoordinates);
      this._envoyClient.closeConnection();
    }
  }, {
    key: 'handleVirtualClipboard',
    value: function handleVirtualClipboard(clipboardAction, maybeClipboardEvent) {
      console.info('[glass] handling clipboard action', clipboardAction);

      if (
      // Avoid infinite loops due to the way we leverage execCommand
      this._clipboardActionLock ||
      // Avoid interfering with cut/copy events in the events editor
      this.state.isEventHandlerEditorOpen) {
        return false;
      }

      this._clipboardActionLock = true;

      if (this._lastSelectedElement) {
        // Gotta grab _before cutting_ or we'll end up with a partial object that won't work
        var clipboardPayload = this._lastSelectedElement.getClipboardPayload('glass');

        if (clipboardAction === 'cut') {
          this._lastSelectedElement.cut();
        }

        var serializedPayload = JSON.stringify(['application/haiku', clipboardPayload]);

        clipboard.writeText(serializedPayload);

        this._clipboardActionLock = false;
      } else {
        this._clipboardActionLock = false;
      }
    }
  }, {
    key: 'handleWindowResize',
    value: function handleWindowResize() {
      var _this3 = this;

      window.requestAnimationFrame(function () {
        _this3.resetContainerDimensions();
      });
    }
  }, {
    key: 'showEventHandlersEditor',
    value: function showEventHandlersEditor(clickEvent, targetElement) {
      this.setState({
        targetElement: targetElement,
        isEventHandlerEditorOpen: true
      });
    }
  }, {
    key: 'hideEventHandlersEditor',
    value: function hideEventHandlersEditor() {
      this.setState({
        targetElement: null,
        isEventHandlerEditorOpen: false
      });
    }
  }, {
    key: 'saveEventHandler',
    value: function saveEventHandler(targetElement, eventName, handlerDescriptorSerialized) {
      var selectorName = 'haiku:' + targetElement.uid;
      this._component.upsertEventHandler(selectorName, eventName, handlerDescriptorSerialized, { from: 'glass' }, function () {});
    }
  }, {
    key: 'performPan',
    value: function performPan(dx, dy) {
      var oldTransform = this._component.getStageTransform();
      oldTransform.pan.x = this.state.originalPanX + dx;
      oldTransform.pan.y = this.state.originalPanY + dy;
      this._component.setStageTransform(oldTransform);
      this.setState({
        panX: this.state.originalPanX + dx,
        panY: this.state.originalPanY + dy
      });
    }
  }, {
    key: 'windowMouseOutHandler',
    value: function windowMouseOutHandler(nativeEvent) {
      if (this.isPreviewMode()) {
        return void 0;
      }

      var source = nativeEvent.relatedTarget || nativeEvent.toElement;
      if (!source || source.nodeName === 'HTML') {
        // this.setState({
        //   isAnythingScaling: false,
        //   isAnythingRotating: false,
        //   controlActivation: null
        // })
        this._component._elements.hovered.dequeue();
      }
    }
  }, {
    key: 'windowMouseMoveHandler',
    value: function windowMouseMoveHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      nativeEvent.preventDefault();
      this.handleMouseMove({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowMouseUpHandler',
    value: function windowMouseUpHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      nativeEvent.preventDefault();
      this.handleMouseUp({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowMouseDownHandler',
    value: function windowMouseDownHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      nativeEvent.preventDefault();
      this.handleMouseDown({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowClickHandler',
    value: function windowClickHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      nativeEvent.preventDefault();
      this.handleClick({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowDblClickHandler',
    value: function windowDblClickHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      nativeEvent.preventDefault();
      this.handleDoubleClick({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowKeyDownHandler',
    value: function windowKeyDownHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      this.handleKeyDown({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'windowKeyUpHandler',
    value: function windowKeyUpHandler(nativeEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      this.handleKeyUp({ nativeEvent: nativeEvent });
    }
  }, {
    key: 'handleMouseDown',
    value: function handleMouseDown(mousedownEvent) {
      var _this4 = this;

      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      if (mousedownEvent.nativeEvent.button !== 0) return; // left click only

      this.state.isMouseDown = true;
      this.state.lastMouseDownTime = Date.now();
      var mousePos = this.storeAndReturnMousePosition(mousedownEvent, 'lastMouseDownPosition');

      if (this.state.activeDrawingTool !== 'pointer') {
        if (!this.state.drawingIsModal) {
          this.props.websocket.send({ type: 'broadcast', name: 'drawing:completed', from: 'glass' });
        }

        this._component.instantiateComponent(this.state.activeDrawingTool, {
          x: mousePos.x,
          y: mousePos.y,
          minimized: true
        }, { from: 'glass' }, function (err, metadata, element) {
          if (err) {
            return console.error(err);
          }

          // if the mouse is still down begin drag scaling
          if (_this4.state.isMouseDown) {
            // activate the bottom right control point, for scaling
            _this4.controlActivation({
              index: 8,
              event: mousedownEvent
            });
          }
        });
      } else {
        // climb the target path to find if a haiku element has been selected
        // NOTE: we want to make sure we are not selecting elements at the wrong context level
        var target = mousedownEvent.nativeEvent.target;
        if (typeof target.className === 'string' && target.className.indexOf('scale-cursor') !== -1) return;

        while (target.hasAttribute && (!target.hasAttribute('source') || !target.hasAttribute('haiku-id') || !this._component._elements.find(target.getAttribute('haiku-id')))) {
          target = target.parentNode;
        }

        if (!target || !target.hasAttribute) {
          // If shift is down, that's constrained scaling. If cmd, that's rotation mode.
          if (!this.state.isKeyShiftDown && !this.state.isKeyCommandDown) {
            this._component._elements.unselectAllElements({ from: 'glass' });
          }

          return;
        }

        if (target.hasAttribute('source') && target.hasAttribute('haiku-id') && target.parentNode !== this.refs.mount) {
          var haikuId = target.getAttribute('haiku-id');
          var contained = _lodash2.default.find(this._component._elements.where({ isSelected: true }), function (element) {
            return element.uid === haikuId;
          });

          // we check if the element being clicked on is already in the selection, if it is we don't want
          // to clear the selection since it could be a grouped selection
          // If shift is down, that's constrained scaling. If cmd, that's rotation mode.
          if (!contained && !this.state.isKeyShiftDown && !this.state.isKeyCommandDown) {
            this._component._elements.unselectAllElements({ from: 'glass' });
          }

          if (!contained) {
            this._component.selectElement(haikuId, { from: 'glass' }, function () {});
          }
        }
      }
    }
  }, {
    key: 'handleMouseUp',
    value: function handleMouseUp(mouseupEvent) {
      if (this.isPreviewMode() || this.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      this.state.isMouseDown = false;
      this.state.lastMouseUpTime = Date.now();
      this.handleDragStop();
      this.setState({
        isAnythingScaling: false,
        isAnythingRotating: false,
        globalControlPointHandleClass: '',
        controlActivation: null
      });
      this.storeAndReturnMousePosition(mouseupEvent, 'lastMouseUpPosition');
    }
  }, {
    key: 'handleClick',
    value: function handleClick(clickEvent) {
      if (this.isPreviewMode()) {
        return void 0;
      }
      this.storeAndReturnMousePosition(clickEvent);
    }
  }, {
    key: 'handleDoubleClick',
    value: function handleDoubleClick(doubleClickEvent) {
      if (this.isPreviewMode()) {
        return void 0;
      }
      this.storeAndReturnMousePosition(doubleClickEvent);
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart(cb) {
      this.state.isMouseDragging = true;
      this.setState({ isMouseDragging: true }, cb);
    }
  }, {
    key: 'handleDragStop',
    value: function handleDragStop(cb) {
      this.state.isMouseDragging = false;
      this.setState({ isMouseDragging: false }, cb);
    }
  }, {
    key: 'handleKeyEscape',
    value: function handleKeyEscape() {
      this._component._elements.unselectAllElements({ from: 'glass' });
    }
  }, {
    key: 'handleKeySpace',
    value: function handleKeySpace(nativeEvent, isDown) {
      this.setState({ isKeySpaceDown: isDown });
      // this._component._elements.drilldownIntoAlreadySelectedElement(this.state.mousePositionCurrent)
    }
  }, {
    key: 'handleKeyLeftArrow',
    value: function handleKeyLeftArrow(keyEvent) {
      var _this5 = this;

      var delta = keyEvent.shiftKey ? 5 : 1;
      this._component._elements.where({ isSelected: true }).forEach(function (element) {
        element.move(-delta, 0, _this5.state.mousePositionCurrent, _this5.state.mousePositionPrevious);
      });
    }
  }, {
    key: 'handleKeyUpArrow',
    value: function handleKeyUpArrow(keyEvent) {
      var _this6 = this;

      var delta = keyEvent.shiftKey ? 5 : 1;
      this._component._elements.where({ isSelected: true }).forEach(function (element) {
        element.move(0, -delta, _this6.state.mousePositionCurrent, _this6.state.mousePositionPrevious);
      });
    }
  }, {
    key: 'handleKeyRightArrow',
    value: function handleKeyRightArrow(keyEvent) {
      var _this7 = this;

      var delta = keyEvent.shiftKey ? 5 : 1;
      this._component._elements.where({ isSelected: true }).forEach(function (element) {
        element.move(delta, 0, _this7.state.mousePositionCurrent, _this7.state.mousePositionPrevious);
      });
    }
  }, {
    key: 'handleKeyDownArrow',
    value: function handleKeyDownArrow(keyEvent) {
      var _this8 = this;

      var delta = keyEvent.shiftKey ? 5 : 1;
      this._component._elements.where({ isSelected: true }).forEach(function (element) {
        element.move(0, delta, _this8.state.mousePositionCurrent, _this8.state.mousePositionPrevious);
      });
    }
  }, {
    key: 'handleKeyDown',
    value: function handleKeyDown(keyEvent) {
      if (this.refs.eventHandlerEditor) {
        if (this.refs.eventHandlerEditor.willHandleExternalKeydownEvent(keyEvent)) {
          return void 0;
        }
      }

      switch (keyEvent.nativeEvent.which) {
        case 27:
          return this.handleKeyEscape();
        case 32:
          return this.handleKeySpace(keyEvent.nativeEvent, true);
        case 37:
          return this.handleKeyLeftArrow(keyEvent.nativeEvent);
        case 38:
          return this.handleKeyUpArrow(keyEvent.nativeEvent);
        case 39:
          return this.handleKeyRightArrow(keyEvent.nativeEvent);
        case 40:
          return this.handleKeyDownArrow(keyEvent.nativeEvent);
        case 46:
          return this.handleKeyDelete();
        case 8:
          return this.handleKeyDelete();
        case 13:
          return this.handleKeyEnter();
        case 16:
          return this.handleKeyShift(keyEvent.nativeEvent, true);
        case 17:
          return this.handleKeyCtrl(keyEvent.nativeEvent, true);
        case 18:
          return this.handleKeyAlt(keyEvent.nativeEvent, true);
        case 224:
          return this.handleKeyCommand(keyEvent.nativeEvent, true);
        case 91:
          return this.handleKeyCommand(keyEvent.nativeEvent, true);
        case 93:
          return this.handleKeyCommand(keyEvent.nativeEvent, true);
        default:
          return null;
      }
    }
  }, {
    key: 'handleKeyUp',
    value: function handleKeyUp(keyEvent) {
      if (this.refs.eventHandlerEditor) {
        if (this.refs.eventHandlerEditor.willHandleExternalKeydownEvent(keyEvent)) {
          return void 0;
        }
      }

      switch (keyEvent.nativeEvent.which) {
        case 32:
          return this.handleKeySpace(keyEvent.nativeEvent, false);
        case 16:
          return this.handleKeyShift(keyEvent.nativeEvent, false);
        case 17:
          return this.handleKeyCtrl(keyEvent.nativeEvent, false);
        case 18:
          return this.handleKeyAlt(keyEvent.nativeEvent, false);
        case 224:
          return this.handleKeyCommand(keyEvent.nativeEvent, false);
        case 91:
          return this.handleKeyCommand(keyEvent.nativeEvent, false);
        case 93:
          return this.handleKeyCommand(keyEvent.nativeEvent, false);
        default:
          return null;
      }
    }
  }, {
    key: 'handleKeyEnter',
    value: function handleKeyEnter() {
      // noop for now
    }
  }, {
    key: 'handleKeyCommand',
    value: function handleKeyCommand(nativeEvent, isDown) {
      var controlActivation = this.state.controlActivation;
      if (controlActivation) {
        controlActivation.cmd = isDown;
      }
      this.setState({ isKeyCommandDown: isDown, controlActivation: controlActivation });
    }
  }, {
    key: 'handleKeyShift',
    value: function handleKeyShift(nativeEvent, isDown) {
      var controlActivation = this.state.controlActivation;
      if (controlActivation) {
        controlActivation.shift = isDown;
      }
      this.setState({ isKeyShiftDown: isDown, controlActivation: controlActivation });
    }
  }, {
    key: 'handleKeyCtrl',
    value: function handleKeyCtrl(nativeEvent, isDown) {
      var controlActivation = this.state.controlActivation;
      if (controlActivation) {
        controlActivation.ctrl = isDown;
      }
      this.setState({ isKeyCtrlDown: isDown, controlActivation: controlActivation });
    }
  }, {
    key: 'handleKeyAlt',
    value: function handleKeyAlt(nativeEvent, isDown) {
      var controlActivation = this.state.controlActivation;
      if (controlActivation) {
        controlActivation.alt = isDown;
      }
      this.setState({ isKeyAltDown: isDown, controlActivation: controlActivation });
    }
  }, {
    key: 'handleClickStageName',
    value: function handleClickStageName() {
      this._component._elements.unselectAllElements({ from: 'glass' });
      var artboard = this._component._elements.findRoots()[0];
      this._component._elements.clicked.add(artboard);
      artboard.select({ from: 'glass' });
    }
  }, {
    key: 'handleMouseOverStageName',
    value: function handleMouseOverStageName() {
      this.setState({ isStageNameHovering: true });
    }
  }, {
    key: 'handleMouseOutStageName',
    value: function handleMouseOutStageName() {
      this.setState({ isStageNameHovering: false });
    }
  }, {
    key: 'handleMouseMove',
    value: function handleMouseMove(mousemoveEvent) {
      var _this9 = this;

      var zoom = this.state.zoomXY || 1;
      var lastMouseDownPosition = this.state.lastMouseDownPosition;
      var mousePositionCurrent = this.storeAndReturnMousePosition(mousemoveEvent);
      var mousePositionPrevious = this.state.mousePositionPrevious || mousePositionCurrent;
      var dx = (mousePositionCurrent.x - mousePositionPrevious.x) / zoom;
      var dy = (mousePositionCurrent.y - mousePositionPrevious.y) / zoom;
      if (dx === 0 && dy === 0) return mousePositionCurrent;

      // if (dx !== 0) dx = Math.round(this.state.zoomXY / dx)
      // if (dy !== 0) dy = Math.round(this.state.zoomXY / dy)
      // If we got this far, the mouse has changed its position from the most recent mousedown
      if (this.state.isMouseDown) {
        this.handleDragStart();
      }
      if (this.state.isMouseDragging && this.state.isMouseDown) {
        if (this.state.isKeySpaceDown && this.state.stageMouseDown) {
          this.performPan(mousemoveEvent.nativeEvent.clientX - this.state.stageMouseDown.x, mousemoveEvent.nativeEvent.clientY - this.state.stageMouseDown.y);
        } else {
          var selected = this._component._elements.where({ isSelected: true });
          if (selected.length > 0) {
            selected.forEach(function (element) {
              element.drag(dx, dy, mousePositionCurrent, mousePositionPrevious, lastMouseDownPosition, _this9.state);
            });
          }
        }
      }
      return mousePositionCurrent;
    }
  }, {
    key: 'handleKeyDelete',
    value: function handleKeyDelete() {
      if (this.isPreviewMode()) {
        return void 0;
      }
      this._component._elements.where({ isSelected: true }).forEach(function (element) {
        element.remove();
      });
    }
  }, {
    key: 'resetContainerDimensions',
    value: function resetContainerDimensions(cb) {
      if (!this.refs.container) return;
      var w = this.refs.container.clientWidth;
      var h = this.refs.container.clientHeight;
      var mountX = (w - this.state.mountWidth) / 2;
      var mountY = (h - this.state.mountHeight) / 2;
      if (w !== this.state.containerWidth || h !== this.state.containerHeight || mountX !== this.state.mountX || mountY !== this.state.mountY) {
        this.setState({ containerWidth: w, containerHeight: h, mountX: mountX, mountY: mountY }, cb);
      }
    }
  }, {
    key: 'getArtboardRect',
    value: function getArtboardRect() {
      return {
        left: this.state.mountX,
        right: this.state.mountX + this.state.mountWidth,
        top: this.state.mountY,
        bottom: this.state.mountY + this.state.mountHeight,
        width: this.state.mountWidth,
        height: this.state.mountHeight
      };
    }
  }, {
    key: 'getSelectionMarqueeSize',
    value: function getSelectionMarqueeSize() {
      if (!this.state.mousePositionCurrent || !this.state.lastMouseDownPosition) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }
      return {
        x: this.state.lastMouseDownPosition.x + this.getArtboardRect().left,
        y: this.state.lastMouseDownPosition.y + this.getArtboardRect().top,
        width: this.state.mousePositionCurrent.x - this.state.lastMouseDownPosition.x,
        height: this.state.mousePositionCurrent.y - this.state.lastMouseDownPosition.y
      };
    }
  }, {
    key: 'controlActivation',
    value: function controlActivation(activationInfo) {
      var artboard = this.getArtboardRect();
      this.setState({
        isAnythingRotating: this.state.isKeyCommandDown,
        isAnythingScaling: !this.state.isKeyCommandDown,
        controlActivation: {
          shift: this.state.isKeyShiftDown,
          ctrl: this.state.isKeyCtrlDown,
          cmd: this.state.isKeyCommandDown,
          alt: this.state.isKeyAltDown,
          index: activationInfo.index,
          arboard: artboard,
          client: {
            x: activationInfo.event.clientX,
            y: activationInfo.event.clientY
          },
          coords: {
            x: activationInfo.event.clientX - artboard.left,
            y: activationInfo.event.clientY - artboard.top
          }
        }
      });
    }
  }, {
    key: 'storeAndReturnMousePosition',
    value: function storeAndReturnMousePosition(mouseEvent, additionalPositionTrackingState) {
      if (!this.refs.container) return null; // We haven't mounted yet, no size available
      this.state.mousePositionPrevious = this.state.mousePositionCurrent;
      var mousePositionCurrent = (0, _getLocalDomEventPosition2.default)(mouseEvent.nativeEvent, this.refs.container);
      mousePositionCurrent.clientX = mouseEvent.nativeEvent.clientX;
      mousePositionCurrent.clientY = mouseEvent.nativeEvent.clientY;
      mousePositionCurrent.x -= this.getArtboardRect().left;
      mousePositionCurrent.y -= this.getArtboardRect().top;
      this.state.mousePositionCurrent = mousePositionCurrent;
      if (additionalPositionTrackingState) this.state[additionalPositionTrackingState] = mousePositionCurrent;
      return mousePositionCurrent;
    }
  }, {
    key: 'drawOverlays',
    value: function drawOverlays(force) {
      var selected = this._component._elements.selected.all();
      if (force || selected.length > 0) {
        var container = this._haikuRenderer.createContainer(this.refs.overlay);
        var parts = this.buildDrawnOverlays();
        var overlay = {
          elementName: 'div',
          attributes: {
            id: 'haiku-glass-overlay-root',
            style: {
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
              position: 'absolute',
              overflow: 'visible',
              left: this.state.mountX + 'px',
              top: this.state.mountY + 'px',
              width: this.state.mountWidth + 'px',
              height: this.state.mountHeight + 'px'
            }
          },
          children: parts

          // HACK! We already cache the control point listeners ourselves, so clear the cache
          // used normally by the component instance for caching/deduping listeners in production
        };this._haikuContext.component._registeredElementEventListeners = {};

        this._haikuRenderer.render(this.refs.overlay, container, overlay, this._haikuContext.component, false);
      }
    }

    // This method creates objects which represent Haiku Player rendering instructions for displaying all of
    // the visual effects that sit above the stage. (Transform controls, etc.) The Haiku Player is sort of a
    // hybrid of React Fiber and Famous Engine. It has a virtual DOM tree of elements like {elementName: 'div', attributes: {}, []},
    // and flushes updates to them on each frame. So what _this method_ does is just build those objects and then
    // these get passed into a Haiku Player render method (see above). LONG STORY SHORT: This creates a flat list of
    // nodes that get rendered to the DOM by the Haiku Player.

  }, {
    key: 'buildDrawnOverlays',
    value: function buildDrawnOverlays() {
      var overlays = [];
      // Don't show any overlays if we're in preview (aka 'live') interactionMode
      if (this.isPreviewMode()) {
        return overlays;
      }
      var selected = this._component._elements.selected.all();
      if (selected.length > 0) {
        var points;
        if (selected.length === 1) {
          var element = selected[0];
          if (element.isRenderableType()) {
            points = element.getPointsTransformed(true);
            this.renderMorphPointsOverlay(points, overlays);
          } else {
            points = element.getBoxPointsTransformed();
            var rotationZ = element.getPropertyValue('rotation.z') || 0;
            var scaleX = element.getPropertyValue('scale.x');
            if (scaleX === undefined || scaleX === null) scaleX = 1;
            var scaleY = element.getPropertyValue('scale.y');
            if (scaleY === undefined || scaleY === null) scaleY = 1;
            this.renderTransformBoxOverlay(points, overlays, element.canRotate(), this.state.isKeyCommandDown, true, rotationZ, scaleX, scaleY);
          }
        } else {
          points = [];
          selected.forEach(function (element) {
            element.getBoxPointsTransformed().forEach(function (point) {
              return points.push(point);
            });
          });
          points = this._component._elements.getBoundingBoxPoints(points);
          this.renderTransformBoxOverlay(points, overlays, false, this.state.isKeyCommandDown, false, 0, 1, 1);
        }
        if (this.state.isMouseDragging) {
          // TODO: Draw tooltip with points info
        }
      }
      return overlays;
    }
  }, {
    key: 'renderMorphPointsOverlay',
    value: function renderMorphPointsOverlay(points, overlays) {
      var _this10 = this;

      points.forEach(function (point, index) {
        overlays.push(_this10.renderControlPoint(point.x, point.y, index));
      });
    }
  }, {
    key: 'renderLine',
    value: function renderLine(x1, y1, x2, y2) {
      return {
        elementName: 'svg',
        attributes: {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible'
          }
        },
        children: [{
          elementName: 'line',
          attributes: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            stroke: _Palette2.default.DARKER_ROCK2,
            'stroke-width': '1px',
            'vector-effect': 'non-scaling-stroke'
          }
        }]
      };
    }
  }, {
    key: 'createControlPointListener',
    value: function createControlPointListener(eventName, pointIndex) {
      var _this11 = this;

      // Caching these as opposed to creating new functions hundreds of times
      if (!this._controlPointListeners) this._controlPointListeners = {};
      var controlKey = eventName + '-' + pointIndex;
      if (!this._controlPointListeners[controlKey]) {
        this._controlPointListeners[controlKey] = function (listenerEvent) {
          _this11.controlActivation({
            index: pointIndex,
            event: listenerEvent
          });
        };
        this._controlPointListeners[controlKey].controlKey = controlKey;
      }
      return this._controlPointListeners[controlKey];
    }
  }, {
    key: 'renderControlPoint',
    value: function renderControlPoint(x, y, index, handleClass) {
      var scale = 1 / (this.state.zoomXY || 1);
      return {
        elementName: 'div',
        attributes: {
          key: 'control-point-' + index,
          class: handleClass || '',
          onmousedown: this.createControlPointListener('mousedown', index),
          style: {
            position: 'absolute',
            transform: 'scale(' + scale + ',' + scale + ')',
            pointerEvents: 'auto',
            left: x - 3.5 + 'px',
            top: y - 3.5 + 'px',
            border: '1px solid ' + _Palette2.default.DARKER_ROCK2,
            backgroundColor: _Palette2.default.ROCK,
            boxShadow: '0 2px 6px 0 ' + _Palette2.default.SHADY, // TODO: account for rotation
            width: '7px',
            height: '7px',
            borderRadius: '50%'
          }
        },
        children: [{
          elementName: 'div',
          attributes: {
            key: 'control-point-hit-area-' + index,
            class: handleClass || '',
            style: {
              position: 'absolute',
              pointerEvents: 'auto',
              left: '-15px',
              top: '-15px',
              width: '30px',
              height: '30px'
            }
          }
        }]
      };
    }
  }, {
    key: 'getHandleClass',
    value: function getHandleClass(index, canRotate, isRotationModeOn, rotationZ, scaleX, scaleY) {
      var defaultPointGroup = CLOCKWISE_CONTROL_POINTS[0];
      var indexOfPoint = defaultPointGroup.indexOf(index);

      var keyOfPointGroup;
      if (scaleX >= 0 && scaleY >= 0) keyOfPointGroup = 0; // default
      else if (scaleX >= 0 && scaleY < 0) keyOfPointGroup = 1; // flipped vertically
        else if (scaleX < 0 && scaleY >= 0) keyOfPointGroup = 2; // flipped horizontally
          else if (scaleX < 0 && scaleY < 0) keyOfPointGroup = 3; // flipped horizontally and vertically

      if (keyOfPointGroup === undefined) {
        throw new Error('Unable to determine handle class due to bad scale values');
      }

      var specifiedPointGroup = CLOCKWISE_CONTROL_POINTS[keyOfPointGroup];

      var rotationDegrees = this._component._elements.getRotationIn360(rotationZ);
      // Each 45 degree turn will equate to a phase change of 1, and that phase corresponds to
      // a starting index for the control points in clockwise order
      var phaseNumber = ~~((rotationDegrees + 22.5) / 45) % specifiedPointGroup.length;
      var offsetIndex = (indexOfPoint + phaseNumber) % specifiedPointGroup.length;
      var shiftedIndex = specifiedPointGroup[offsetIndex];

      // These class names are defined in global.css; the indices indicate the corresponding points
      if (canRotate && isRotationModeOn) {
        return 'rotate-cursor-' + shiftedIndex;
      } else {
        return 'scale-cursor-' + shiftedIndex;
      }
    }
  }, {
    key: 'renderTransformBoxOverlay',
    value: function renderTransformBoxOverlay(points, overlays, canRotate, isRotationModeOn, canControlHandles, rotationZ, scaleX, scaleY) {
      var _this12 = this;

      var corners = [points[0], points[2], points[8], points[6]];
      corners.forEach(function (point, index) {
        var next = corners[(index + 1) % corners.length];
        overlays.push(_this12.renderLine(point.x, point.y, next.x, next.y));
      });
      points.forEach(function (point, index) {
        if (index !== 4) {
          overlays.push(_this12.renderControlPoint(point.x, point.y, index, canControlHandles && _this12.getHandleClass(index, canRotate, isRotationModeOn, rotationZ, scaleX, scaleY)));
        }
      });
    }
  }, {
    key: 'getGlobalControlPointHandleClass',
    value: function getGlobalControlPointHandleClass() {
      if (!this.state.controlActivation) return '';
      var controlIndex = this.state.controlActivation.index;
      var isRotationModeOn = this.state.isKeyCommandDown;
      var selectedElements = this._component._elements.selected.all();
      if (selectedElements.length === 1) {
        var selectedElement = selectedElements[0];
        var rotationZ = selectedElement.getPropertyValue('rotation.z') || 0;
        var scaleX = selectedElement.getPropertyValue('scale.x');
        if (scaleX === undefined || scaleX === null) scaleX = 1;
        var scaleY = selectedElement.getPropertyValue('scale.y');
        if (scaleY === undefined || scaleY === null) scaleY = 1;
        return this.getHandleClass(controlIndex, true, isRotationModeOn, rotationZ, scaleX, scaleY);
      } else {
        return this.getHandleClass(controlIndex, false, isRotationModeOn, 0, 1, 1);
      }
    }
  }, {
    key: 'getStageTransform',
    value: function getStageTransform() {
      var a = this.state.zoomXY || 1;
      var c = this.state.panX || 0;
      var d = this.state.panY || 0;

      return 'matrix3d(' + [a, 0, 0, 0, 0, a, 0, 0, 0, 0, 1, 0, c, d, 0, 1].join(',') + ')';
    }
  }, {
    key: 'isPreviewMode',
    value: function isPreviewMode() {
      return this._component._interactionMode.type === 'live';
    }
  }, {
    key: 'getCursorCssRule',
    value: function getCursorCssRule() {
      if (this.isPreviewMode()) return 'default';
      return this.state.stageMouseDown ? '-webkit-grabbing' : '-webkit-grab';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this13 = this;

      var drawingClassName = this.state.activeDrawingTool !== 'pointer' ? 'draw-shape' : '';

      return _react2.default.createElement(
        'div',
        {
          onMouseOver: function onMouseOver() {
            return _this13.setState({ isKeyCommandDown: false });
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 1143
          },
          __self: this
        },
        !this.isPreviewMode() ? _react2.default.createElement(
          'div',
          {
            style: {
              position: 'fixed',
              top: 5,
              right: 10,
              zIndex: 100000,
              color: '#ccc',
              fontSize: 14
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1147
            },
            __self: this
          },
          Math.round(this.state.zoomXY / 1 * 100),
          '%'
        ) : '',
        _react2.default.createElement(
          'div',
          {
            ref: 'container',
            id: 'haiku-glass-stage-container',
            className: this.getGlobalControlPointHandleClass(),
            onMouseDown: function onMouseDown(mouseDown) {
              if (!_this13.isPreviewMode()) {
                if (mouseDown.nativeEvent.target && mouseDown.nativeEvent.target.id === 'full-background') {
                  _this13._component._elements.unselectAllElements({ from: 'glass' });
                }
                if (_this13.state.isEventHandlerEditorOpen) {
                  _this13.hideEventHandlersEditor();
                }
                _this13.setState({
                  originalPanX: _this13.state.panX,
                  originalPanY: _this13.state.panY,
                  stageMouseDown: {
                    x: mouseDown.nativeEvent.clientX,
                    y: mouseDown.nativeEvent.clientY
                  }
                });
              }
            },
            onMouseUp: function onMouseUp() {
              if (!_this13.isPreviewMode()) {
                _this13.setState({ stageMouseDown: null });
              }
            },
            onMouseLeave: function onMouseLeave() {
              if (!_this13.isPreviewMode()) {
                _this13.setState({ stageMouseDown: null });
              }
            },
            style: {
              width: '100%',
              height: '100%',
              overflow: 'hidden', // TODO:  if/when we support native scrolling here,
              // we'll need to figure out some phantom reflowing/jitter issues
              position: 'absolute',
              top: 0,
              left: 0,
              transform: this.getStageTransform(),
              cursor: this.getCursorCssRule(),
              backgroundColor: this.isPreviewMode() ? 'white' : 'inherit'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1160
            },
            __self: this
          },
          !this.isPreviewMode() ? _react2.default.createElement(
            'svg',
            {
              id: 'haiku-glass-stage-background-live',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.containerWidth,
                height: this.state.containerHeight
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1206
              },
              __self: this
            },
            _react2.default.createElement(
              'defs',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1215
                },
                __self: this
              },
              _react2.default.createElement(
                'filter',
                { id: 'background-blur', x: '-50%', y: '-50%', width: '200%', height: '200%', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1216
                  },
                  __self: this
                },
                _react2.default.createElement('feGaussianBlur', { 'in': 'SourceAlpha', stdDeviation: '2', result: 'blur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1217
                  },
                  __self: this
                }),
                _react2.default.createElement('feFlood', { floodColor: 'rgba(33, 45, 49, .5)', floodOpacity: '0.8', result: 'offsetColor', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1218
                  },
                  __self: this
                }),
                _react2.default.createElement('feComposite', { 'in': 'offsetColor', in2: 'blur', operator: 'in', result: 'totalBlur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1219
                  },
                  __self: this
                }),
                _react2.default.createElement('feBlend', { 'in': 'SourceGraphic', in2: 'totalBlur', mode: 'normal', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1220
                  },
                  __self: this
                })
              )
            ),
            _react2.default.createElement('rect', { id: 'full-background', x: '0', y: '0', width: '100%', height: '100%', fill: 'transparent', __source: {
                fileName: _jsxFileName,
                lineNumber: 1223
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background-blur', filter: 'url(#background-blur)', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1224
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1225
              },
              __self: this
            })
          ) : _react2.default.createElement(
            'div',
            {
              id: 'haiku-glass-stage-background-preview',
              style: {
                position: 'relative',
                top: 0,
                left: 0,
                width: this.state.containerWidth,
                height: this.state.containerHeight
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1227
              },
              __self: this
            },
            _react2.default.createElement('div', {
              id: 'haiku-glass-stage-background-preview-border',
              style: {
                position: 'absolute',
                top: this.state.mountY,
                left: this.state.mountX,
                width: this.state.mountWidth,
                height: this.state.mountHeight,
                border: '1px dotted #bbb',
                borderRadius: '2px'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1236
              },
              __self: this
            })
          ),
          !this.isPreviewMode() ? _react2.default.createElement(
            'svg',
            {
              id: 'haiku-glass-stage-title-text-container',
              style: {
                position: 'absolute',
                zIndex: 10,
                top: this.state.mountY - 19,
                left: this.state.mountX + 2,
                height: 20,
                width: 120,
                userSelect: 'none',
                cursor: 'default'
              },
              onClick: this.handleClickStageName.bind(this),
              onMouseOver: this.handleMouseOverStageName.bind(this),
              onMouseOut: this.handleMouseOutStageName.bind(this), __source: {
                fileName: _jsxFileName,
                lineNumber: 1250
              },
              __self: this
            },
            _react2.default.createElement(
              'text',
              {
                y: '13',
                id: 'project-name',
                fill: _Palette2.default.FATHER_COAL,
                fontWeight: 'lighter',
                fontFamily: 'Fira Sans',
                fontSize: '13', __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1265
                },
                __self: this
              },
              this.props.projectName
            )
          ) : '',
          !this.isPreviewMode() ? _react2.default.createElement(
            'svg',
            {
              id: 'haiku-glass-background-colorator',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 20,
                width: this.state.containerWidth,
                height: this.state.containerHeight,
                pointerEvents: 'none'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1278
              },
              __self: this
            },
            _react2.default.createElement('path', { d: 'M0,0V' + this.state.containerHeight + 'H' + this.state.containerWidth + 'V0ZM' + (this.state.mountX + this.state.mountWidth) + ',' + (this.state.mountY + this.state.mountHeight) + 'H' + this.state.mountX + 'V' + this.state.mountY + 'H' + (this.state.mountX + this.state.mountWidth) + 'Z',
              style: { 'fill': '#111', 'opacity': 0.1, 'pointerEvents': 'none' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1289
              },
              __self: this
            })
          ) : '',
          !this.isPreviewMode() ? _react2.default.createElement(
            'svg',
            {
              id: 'haiku-glass-moat-opacitator',
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1010,
                width: this.state.containerWidth,
                height: this.state.containerHeight,
                pointerEvents: 'none'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1295
              },
              __self: this
            },
            _react2.default.createElement('path', { d: 'M0,0V' + this.state.containerHeight + 'H' + this.state.containerWidth + 'V0ZM' + (this.state.mountX + this.state.mountWidth) + ',' + (this.state.mountY + this.state.mountHeight) + 'H' + this.state.mountX + 'V' + this.state.mountY + 'H' + (this.state.mountX + this.state.mountWidth) + 'Z',
              style: {
                'fill': '#FFF',
                'opacity': 0.5,
                'pointerEvents': 'none'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1306
              },
              __self: this
            }),
            _react2.default.createElement('rect', {
              x: this.state.mountX - 1,
              y: this.state.mountY - 1,
              width: this.state.mountWidth + 2,
              height: this.state.mountHeight + 2,
              style: {
                strokeWidth: 1.5,
                fill: 'none',
                stroke: _Palette2.default.LIGHT_PINK,
                opacity: this.state.isStageNameHovering && !this.state.isStageSelected ? 0.75 : 0
              },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1312
              },
              __self: this
            })
          ) : '',
          !this.isPreviewMode() && this.state.doShowComments && this.state.comments.length > 0 ? _react2.default.createElement(
            'div',
            {
              id: 'haiku-glass-comments-container',
              style: {
                position: 'absolute',
                pointerEvents: 'none',
                top: 0,
                left: 0,
                zIndex: 2000,
                overflow: 'hidden',
                width: '100%',
                height: '100%' },
              __source: {
                fileName: _jsxFileName,
                lineNumber: 1328
              },
              __self: this
            },
            this.state.comments.map(function (comment, index) {
              return _react2.default.createElement(_Comment2.default, { index: index, comment: comment, key: 'comment-' + comment.id, model: _this13._comments, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1341
                },
                __self: _this13
              });
            })
          ) : '',
          !this.isPreviewMode() && this.state.isEventHandlerEditorOpen ? _react2.default.createElement(_EventHandlerEditor2.default, {
            ref: 'eventHandlerEditor',
            element: this.state.targetElement,
            save: this.saveEventHandler.bind(this),
            close: this.hideEventHandlersEditor.bind(this),
            __source: {
              fileName: _jsxFileName,
              lineNumber: 1347
            },
            __self: this
          }) : '',
          !this.isPreviewMode() ? _react2.default.createElement('div', {
            ref: 'overlay',
            id: 'haiku-glass-overlay-mount',
            height: this.state.containerHeight,
            width: this.state.containerWidth,
            style: {
              transform: 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)',
              pointerEvents: 'none', // This needs to be un-set for surface elements that take mouse interaction
              position: 'relative',
              overflow: 'visible',
              top: 0,
              left: 0,
              zIndex: 1000,
              opacity: this.state.isEventHandlerEditorOpen ? 0.5 : 1.0
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1356
            },
            __self: this
          }) : '',
          _react2.default.createElement('div', {
            ref: 'mount',
            id: 'hot-component-mount',
            className: drawingClassName,
            style: {
              position: 'absolute',
              left: this.state.mountX,
              top: this.state.mountY,
              width: this.state.mountWidth,
              height: this.state.mountHeight,
              overflow: 'visible',
              zIndex: 60,
              opacity: this.state.isEventHandlerEditorOpen ? 0.5 : 1.0
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 1373
            },
            __self: this
          })
        )
      );
    }
  }]);

  return Glass;
}(_react2.default.Component);

Glass.propTypes = {
  userconfig: _react2.default.PropTypes.object,
  websocket: _react2.default.PropTypes.object,
  folder: _react2.default.PropTypes.string
};

exports.default = (0, _radium2.default)(Glass);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9HbGFzcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2xpcGJvYXJkIiwiQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTIiwiR2xhc3MiLCJwcm9wcyIsInN0YXRlIiwiZXJyb3IiLCJtb3VudFdpZHRoIiwibW91bnRIZWlnaHQiLCJtb3VudFgiLCJtb3VudFkiLCJjb250cm9sQWN0aXZhdGlvbiIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwibW91c2VQb3NpdGlvblByZXZpb3VzIiwiaXNBbnl0aGluZ1NjYWxpbmciLCJpc0FueXRoaW5nUm90YXRpbmciLCJnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsImNvbnRhaW5lckhlaWdodCIsImNvbnRhaW5lcldpZHRoIiwiaXNTdGFnZVNlbGVjdGVkIiwiaXNTdGFnZU5hbWVIb3ZlcmluZyIsImlzTW91c2VEb3duIiwibGFzdE1vdXNlRG93blRpbWUiLCJsYXN0TW91c2VEb3duUG9zaXRpb24iLCJsYXN0TW91c2VVcFBvc2l0aW9uIiwibGFzdE1vdXNlVXBUaW1lIiwiaXNNb3VzZURyYWdnaW5nIiwiaXNLZXlTaGlmdERvd24iLCJpc0tleUN0cmxEb3duIiwiaXNLZXlBbHREb3duIiwiaXNLZXlDb21tYW5kRG93biIsImlzS2V5U3BhY2VEb3duIiwicGFuWCIsInBhblkiLCJvcmlnaW5hbFBhblgiLCJvcmlnaW5hbFBhblkiLCJ6b29tWFkiLCJjb21tZW50cyIsImRvU2hvd0NvbW1lbnRzIiwidGFyZ2V0RWxlbWVudCIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsImFjdGl2ZURyYXdpbmdUb29sIiwiZHJhd2luZ0lzTW9kYWwiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJ3aW5kb3ciLCJlbnZveSIsIldlYlNvY2tldCIsInNldFN0YWdlVHJhbnNmb3JtIiwiem9vbSIsInBhbiIsIngiLCJ5IiwiX2NvbW1lbnRzIiwiX2N0eG1lbnUiLCJfcGxheWluZyIsIl9zdG9wd2F0Y2giLCJfbGFzdEF1dGhvcml0YXRpdmVGcmFtZSIsIl9sYXN0U2VsZWN0ZWRFbGVtZW50IiwiX2NsaXBib2FyZEFjdGlvbkxvY2siLCJkcmF3TG9vcCIsImJpbmQiLCJkcmF3IiwiX2hhaWt1UmVuZGVyZXIiLCJfaGFpa3VDb250ZXh0IiwidGltZWxpbmVzIiwidGVtcGxhdGUiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJjaGlsZHJlbiIsIm9wdGlvbnMiLCJjYWNoZSIsInNlZWQiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwicmVzZXRDb250YWluZXJEaW1lbnNpb25zIiwiZ2xhc3MiLCJvbiIsInRpbWVsaW5lQ2hhbm5lbCIsImhhbmRsZVRpbWVsaW5lRGlkUGxheSIsImhhbmRsZVRpbWVsaW5lRGlkUGF1c2UiLCJoYW5kbGVUaW1lbGluZURpZFNlZWsiLCJnbGFzc0NoYW5uZWwiLCJoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkIiwiY2xpZW50IiwidG91ckNsaWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZWxlY3RvciIsIndlYnZpZXciLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwidG9wIiwibGVmdCIsInJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMiLCJjb25zb2xlIiwiRGF0ZSIsIm5vdyIsImZyYW1lRGF0YSIsImZyYW1lIiwiZm9yY2VTZWVrIiwic2Vla01zIiwiZnBzIiwiYmFzZU1zIiwiZGVsdGFNcyIsIk1hdGgiLCJyb3VuZCIsIl9zZXRUaW1lbGluZVRpbWVWYWx1ZSIsInJlZnMiLCJvdmVybGF5IiwiZHJhd092ZXJsYXlzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW91bnRBcHBsaWNhdGlvbiIsIm1vdW50IiwiZnJlZXplIiwib3ZlcmZsb3dYIiwib3ZlcmZsb3dZIiwiY29udGV4dE1lbnUiLCJuZXdNb3VudFNpemUiLCJnZXRDb250ZXh0U2l6ZSIsInNldFN0YXRlIiwid2lkdGgiLCJoZWlnaHQiLCJ1cGRhdGVkQXJ0Ym9hcmRTaXplIiwidGltZWxpbmVOYW1lIiwidGltZWxpbmVUaW1lIiwiZ2V0TW91bnQiLCJpc1JlbG9hZGluZ0NvZGUiLCJwYXN0ZUV2ZW50IiwiaW5mbyIsInByZXZlbnREZWZhdWx0Iiwic2VuZCIsInR5cGUiLCJuYW1lIiwiZnJvbSIsImRhdGEiLCJjb21wb25lbnRJZCIsIl9lbGVtZW50cyIsImZpbmQiLCJtZXNzYWdlIiwib2xkVHJhbnNmb3JtIiwibW9kdWxlUmVwbGFjZSIsImVyciIsImdldFN0YWdlVHJhbnNmb3JtIiwicGFyYW1zIiwibWV0aG9kIiwiY2IiLCJjYWxsTWV0aG9kIiwibG9hZCIsImFjdGlvbiIsImV2ZW50IiwiYnVpbGQiLCJfbWVudSIsImxhc3RYIiwibGFzdFkiLCJyZWJ1aWxkIiwic2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IiLCJ0aHJvdHRsZSIsImhhbmRsZVdpbmRvd1Jlc2l6ZSIsIndpbmRvd01vdXNlVXBIYW5kbGVyIiwid2luZG93TW91c2VNb3ZlSGFuZGxlciIsIndpbmRvd01vdXNlRG93bkhhbmRsZXIiLCJ3aW5kb3dDbGlja0hhbmRsZXIiLCJ3aW5kb3dEYmxDbGlja0hhbmRsZXIiLCJ3aW5kb3dLZXlEb3duSGFuZGxlciIsIndpbmRvd0tleVVwSGFuZGxlciIsIndpbmRvd01vdXNlT3V0SGFuZGxlciIsIm9mZiIsIl9lbnZveUNsaWVudCIsImNsb3NlQ29ubmVjdGlvbiIsImNsaXBib2FyZEFjdGlvbiIsIm1heWJlQ2xpcGJvYXJkRXZlbnQiLCJjbGlwYm9hcmRQYXlsb2FkIiwiZ2V0Q2xpcGJvYXJkUGF5bG9hZCIsImN1dCIsInNlcmlhbGl6ZWRQYXlsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlVGV4dCIsImNsaWNrRXZlbnQiLCJldmVudE5hbWUiLCJoYW5kbGVyRGVzY3JpcHRvclNlcmlhbGl6ZWQiLCJzZWxlY3Rvck5hbWUiLCJ1aWQiLCJ1cHNlcnRFdmVudEhhbmRsZXIiLCJkeCIsImR5IiwibmF0aXZlRXZlbnQiLCJpc1ByZXZpZXdNb2RlIiwic291cmNlIiwicmVsYXRlZFRhcmdldCIsInRvRWxlbWVudCIsIm5vZGVOYW1lIiwiaG92ZXJlZCIsImRlcXVldWUiLCJoYW5kbGVNb3VzZU1vdmUiLCJoYW5kbGVNb3VzZVVwIiwiaGFuZGxlTW91c2VEb3duIiwiaGFuZGxlQ2xpY2siLCJoYW5kbGVEb3VibGVDbGljayIsImhhbmRsZUtleURvd24iLCJoYW5kbGVLZXlVcCIsIm1vdXNlZG93bkV2ZW50IiwiYnV0dG9uIiwibW91c2VQb3MiLCJzdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24iLCJpbnN0YW50aWF0ZUNvbXBvbmVudCIsIm1pbmltaXplZCIsIm1ldGFkYXRhIiwiaW5kZXgiLCJ0YXJnZXQiLCJjbGFzc05hbWUiLCJpbmRleE9mIiwiaGFzQXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlIiwicGFyZW50Tm9kZSIsInVuc2VsZWN0QWxsRWxlbWVudHMiLCJoYWlrdUlkIiwiY29udGFpbmVkIiwid2hlcmUiLCJpc1NlbGVjdGVkIiwic2VsZWN0RWxlbWVudCIsIm1vdXNldXBFdmVudCIsImhhbmRsZURyYWdTdG9wIiwiZG91YmxlQ2xpY2tFdmVudCIsImlzRG93biIsImtleUV2ZW50IiwiZGVsdGEiLCJzaGlmdEtleSIsImZvckVhY2giLCJtb3ZlIiwiZXZlbnRIYW5kbGVyRWRpdG9yIiwid2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50Iiwid2hpY2giLCJoYW5kbGVLZXlFc2NhcGUiLCJoYW5kbGVLZXlTcGFjZSIsImhhbmRsZUtleUxlZnRBcnJvdyIsImhhbmRsZUtleVVwQXJyb3ciLCJoYW5kbGVLZXlSaWdodEFycm93IiwiaGFuZGxlS2V5RG93bkFycm93IiwiaGFuZGxlS2V5RGVsZXRlIiwiaGFuZGxlS2V5RW50ZXIiLCJoYW5kbGVLZXlTaGlmdCIsImhhbmRsZUtleUN0cmwiLCJoYW5kbGVLZXlBbHQiLCJoYW5kbGVLZXlDb21tYW5kIiwiY21kIiwic2hpZnQiLCJjdHJsIiwiYWx0IiwiYXJ0Ym9hcmQiLCJmaW5kUm9vdHMiLCJjbGlja2VkIiwiYWRkIiwic2VsZWN0IiwibW91c2Vtb3ZlRXZlbnQiLCJoYW5kbGVEcmFnU3RhcnQiLCJzdGFnZU1vdXNlRG93biIsInBlcmZvcm1QYW4iLCJjbGllbnRYIiwiY2xpZW50WSIsInNlbGVjdGVkIiwibGVuZ3RoIiwiZHJhZyIsInJlbW92ZSIsImNvbnRhaW5lciIsInciLCJjbGllbnRXaWR0aCIsImgiLCJjbGllbnRIZWlnaHQiLCJyaWdodCIsImJvdHRvbSIsImdldEFydGJvYXJkUmVjdCIsImFjdGl2YXRpb25JbmZvIiwiYXJib2FyZCIsImNvb3JkcyIsIm1vdXNlRXZlbnQiLCJhZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlIiwiZm9yY2UiLCJhbGwiLCJjcmVhdGVDb250YWluZXIiLCJwYXJ0cyIsImJ1aWxkRHJhd25PdmVybGF5cyIsImlkIiwic3R5bGUiLCJ0cmFuc2Zvcm0iLCJwb3NpdGlvbiIsIm92ZXJmbG93IiwiY29tcG9uZW50IiwiX3JlZ2lzdGVyZWRFbGVtZW50RXZlbnRMaXN0ZW5lcnMiLCJyZW5kZXIiLCJvdmVybGF5cyIsInBvaW50cyIsImlzUmVuZGVyYWJsZVR5cGUiLCJnZXRQb2ludHNUcmFuc2Zvcm1lZCIsInJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheSIsImdldEJveFBvaW50c1RyYW5zZm9ybWVkIiwicm90YXRpb25aIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjYWxlWCIsInVuZGVmaW5lZCIsInNjYWxlWSIsInJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkiLCJjYW5Sb3RhdGUiLCJwb2ludCIsInB1c2giLCJnZXRCb3VuZGluZ0JveFBvaW50cyIsInJlbmRlckNvbnRyb2xQb2ludCIsIngxIiwieTEiLCJ4MiIsInkyIiwic3Ryb2tlIiwiREFSS0VSX1JPQ0syIiwicG9pbnRJbmRleCIsIl9jb250cm9sUG9pbnRMaXN0ZW5lcnMiLCJjb250cm9sS2V5IiwibGlzdGVuZXJFdmVudCIsImhhbmRsZUNsYXNzIiwic2NhbGUiLCJrZXkiLCJjbGFzcyIsIm9ubW91c2Vkb3duIiwiY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIiLCJwb2ludGVyRXZlbnRzIiwiYm9yZGVyIiwiYmFja2dyb3VuZENvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsIlNIQURZIiwiYm9yZGVyUmFkaXVzIiwiaXNSb3RhdGlvbk1vZGVPbiIsImRlZmF1bHRQb2ludEdyb3VwIiwiaW5kZXhPZlBvaW50Iiwia2V5T2ZQb2ludEdyb3VwIiwiRXJyb3IiLCJzcGVjaWZpZWRQb2ludEdyb3VwIiwicm90YXRpb25EZWdyZWVzIiwiZ2V0Um90YXRpb25JbjM2MCIsInBoYXNlTnVtYmVyIiwib2Zmc2V0SW5kZXgiLCJzaGlmdGVkSW5kZXgiLCJjYW5Db250cm9sSGFuZGxlcyIsImNvcm5lcnMiLCJuZXh0IiwicmVuZGVyTGluZSIsImdldEhhbmRsZUNsYXNzIiwiY29udHJvbEluZGV4Iiwic2VsZWN0ZWRFbGVtZW50cyIsInNlbGVjdGVkRWxlbWVudCIsImEiLCJjIiwiZCIsImpvaW4iLCJfaW50ZXJhY3Rpb25Nb2RlIiwiZHJhd2luZ0NsYXNzTmFtZSIsInpJbmRleCIsImNvbG9yIiwiZm9udFNpemUiLCJnZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsIm1vdXNlRG93biIsImhpZGVFdmVudEhhbmRsZXJzRWRpdG9yIiwiY3Vyc29yIiwiZ2V0Q3Vyc29yQ3NzUnVsZSIsInVzZXJTZWxlY3QiLCJoYW5kbGVDbGlja1N0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lIiwiRkFUSEVSX0NPQUwiLCJwcm9qZWN0TmFtZSIsInN0cm9rZVdpZHRoIiwiZmlsbCIsIkxJR0hUX1BJTksiLCJvcGFjaXR5IiwibWFwIiwiY29tbWVudCIsInNhdmVFdmVudEhhbmRsZXIiLCJDb21wb25lbnQiLCJwcm9wVHlwZXMiLCJQcm9w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QUFPO0FBQ0xyRSx3QkFBVSxVQURMO0FBRUxqTSxvQkFBTSxLQUFLNUYsS0FBTCxDQUFXSSxNQUZaO0FBR0x1RixtQkFBSyxLQUFLM0YsS0FBTCxDQUFXSyxNQUhYO0FBSUxtSCxxQkFBTyxLQUFLeEgsS0FBTCxDQUFXRSxVQUpiO0FBS0x1SCxzQkFBUSxLQUFLekgsS0FBTCxDQUFXRyxXQUxkO0FBTUwyUix3QkFBVSxTQU5MO0FBT0xxRSxzQkFBUSxFQVBIO0FBUUxpQix1QkFBVSxLQUFLcFgsS0FBTCxDQUFXbUMsd0JBQVosR0FBd0MsR0FBeEMsR0FBOEM7QUFSbEQsYUFKVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFyTkY7QUFqQkYsT0FERjtBQXdQRDs7OztFQWwxQ3dCLGdCQUFNcVYsUzs7QUFxMUNqQzFYLE1BQU0yWCxTQUFOLEdBQWtCO0FBQ2hCaFYsY0FBWSxnQkFBTWlWLFNBQU4sQ0FBZ0JDLE1BRFo7QUFFaEJqVixhQUFXLGdCQUFNZ1YsU0FBTixDQUFnQkMsTUFGWDtBQUdoQm5WLFVBQVEsZ0JBQU1rVixTQUFOLENBQWdCRTtBQUhSLENBQWxCOztrQkFNZSxzQkFBTzlYLEtBQVAsQyIsImZpbGUiOiJHbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgSGFpa3VET01SZW5kZXJlciBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZW5kZXJlcnMvZG9tJ1xuaW1wb3J0IEhhaWt1Q29udGV4dCBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9IYWlrdUNvbnRleHQnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBDb21tZW50IGZyb20gJy4vQ29tbWVudCdcbmltcG9ydCBFdmVudEhhbmRsZXJFZGl0b3IgZnJvbSAnLi9FdmVudEhhbmRsZXJFZGl0b3InXG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9tb2RlbHMvQ29tbWVudHMnXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi9tb2RlbHMvQ29udGV4dE1lbnUnXG5pbXBvcnQgZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uIGZyb20gJy4vaGVscGVycy9nZXRMb2NhbERvbUV2ZW50UG9zaXRpb24nXG5pbXBvcnQge1xuICBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AsXG4gIHByZXZlbnREZWZhdWx0RHJhZ1xufSBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy91dGlscy9kbmRIZWxwZXJzJ1xuXG5jb25zdCB7IGNsaXBib2FyZCB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuXG5jb25zdCBDTE9DS1dJU0VfQ09OVFJPTF9QT0lOVFMgPSB7XG4gIDA6IFswLCAxLCAyLCA1LCA4LCA3LCA2LCAzXSxcbiAgMTogWzYsIDcsIDgsIDUsIDIsIDEsIDAsIDNdLCAvLyBmbGlwcGVkIHZlcnRpY2FsXG4gIDI6IFsyLCAxLCAwLCAzLCA2LCA3LCA4LCA1XSwgLy8gZmxpcHBlZCBob3Jpem9udGFsXG4gIDM6IFs4LCA3LCA2LCAzLCAwLCAxLCAyLCA1XSAvLyBmbGlwcGVkIGhvcml6b250YWwgKyB2ZXJ0aWNhbFxufVxuXG4vLyBUaGUgY2xhc3MgaXMgZXhwb3J0ZWQgYWxzbyBfd2l0aG91dF8gdGhlIHJhZGl1bSB3cmFwcGVyIHRvIGFsbG93IGpzZG9tIHRlc3RpbmdcbmV4cG9ydCBjbGFzcyBHbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgbW91bnRXaWR0aDogNTUwLFxuICAgICAgbW91bnRIZWlnaHQ6IDQwMCxcbiAgICAgIG1vdW50WDogMCxcbiAgICAgIG1vdW50WTogMCxcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uOiBudWxsLFxuICAgICAgbW91c2VQb3NpdGlvbkN1cnJlbnQ6IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uUHJldmlvdXM6IG51bGwsXG4gICAgICBpc0FueXRoaW5nU2NhbGluZzogZmFsc2UsXG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgZ2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3M6ICcnLFxuICAgICAgY29udGFpbmVySGVpZ2h0OiAwLFxuICAgICAgY29udGFpbmVyV2lkdGg6IDAsXG4gICAgICBpc1N0YWdlU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgaXNTdGFnZU5hbWVIb3ZlcmluZzogZmFsc2UsXG4gICAgICBpc01vdXNlRG93bjogZmFsc2UsXG4gICAgICBsYXN0TW91c2VEb3duVGltZTogbnVsbCxcbiAgICAgIGxhc3RNb3VzZURvd25Qb3NpdGlvbjogbnVsbCxcbiAgICAgIGxhc3RNb3VzZVVwUG9zaXRpb246IG51bGwsXG4gICAgICBsYXN0TW91c2VVcFRpbWU6IG51bGwsXG4gICAgICBpc01vdXNlRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgaXNLZXlTaGlmdERvd246IGZhbHNlLFxuICAgICAgaXNLZXlDdHJsRG93bjogZmFsc2UsXG4gICAgICBpc0tleUFsdERvd246IGZhbHNlLFxuICAgICAgaXNLZXlDb21tYW5kRG93bjogZmFsc2UsXG4gICAgICBpc0tleVNwYWNlRG93bjogZmFsc2UsXG4gICAgICBwYW5YOiAwLFxuICAgICAgcGFuWTogMCxcbiAgICAgIG9yaWdpbmFsUGFuWDogMCxcbiAgICAgIG9yaWdpbmFsUGFuWTogMCxcbiAgICAgIHpvb21YWTogMSxcbiAgICAgIGNvbW1lbnRzOiBbXSxcbiAgICAgIGRvU2hvd0NvbW1lbnRzOiBmYWxzZSxcbiAgICAgIHRhcmdldEVsZW1lbnQ6IG51bGwsXG4gICAgICBpc0V2ZW50SGFuZGxlckVkaXRvck9wZW46IGZhbHNlLFxuICAgICAgYWN0aXZlRHJhd2luZ1Rvb2w6ICdwb2ludGVyJyxcbiAgICAgIGRyYXdpbmdJc01vZGFsOiB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ2dsYXNzJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybSh7em9vbTogdGhpcy5zdGF0ZS56b29tWFksIHBhbjoge3g6IHRoaXMuc3RhdGUucGFuWCwgeTogdGhpcy5zdGF0ZS5wYW5ZfX0pXG4gICAgdGhpcy5fY29tbWVudHMgPSBuZXcgQ29tbWVudHModGhpcy5wcm9wcy5mb2xkZXIpXG4gICAgdGhpcy5fY3R4bWVudSA9IG5ldyBDb250ZXh0TWVudSh3aW5kb3csIHRoaXMpXG5cbiAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2VcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBudWxsXG4gICAgdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSA9IDBcblxuICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG5cbiAgICB0aGlzLmRyYXdMb29wID0gdGhpcy5kcmF3TG9vcC5iaW5kKHRoaXMpXG4gICAgdGhpcy5kcmF3ID0gdGhpcy5kcmF3LmJpbmQodGhpcylcbiAgICB0aGlzLl9oYWlrdVJlbmRlcmVyID0gbmV3IEhhaWt1RE9NUmVuZGVyZXIoKVxuICAgIHRoaXMuX2hhaWt1Q29udGV4dCA9IG5ldyBIYWlrdUNvbnRleHQobnVsbCwgdGhpcy5faGFpa3VSZW5kZXJlciwge30sIHsgdGltZWxpbmVzOiB7fSwgdGVtcGxhdGU6IHsgZWxlbWVudE5hbWU6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7fSwgY2hpbGRyZW46IFtdIH0gfSwgeyBvcHRpb25zOiB7IGNhY2hlOiB7fSwgc2VlZDogJ2FiY2RlJyB9IH0pXG5cbiAgICB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKVxuXG4gICAgd2luZG93LmdsYXNzID0gdGhpc1xuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0aW1lbGluZUNsaWVudFJlYWR5JywgKHRpbWVsaW5lQ2hhbm5lbCkgPT4ge1xuICAgICAgdGltZWxpbmVDaGFubmVsLm9uKCdkaWRQbGF5JywgdGhpcy5oYW5kbGVUaW1lbGluZURpZFBsYXkuYmluZCh0aGlzKSlcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkUGF1c2UnLCB0aGlzLmhhbmRsZVRpbWVsaW5lRGlkUGF1c2UuYmluZCh0aGlzKSlcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkU2VlaycsIHRoaXMuaGFuZGxlVGltZWxpbmVEaWRTZWVrLmJpbmQodGhpcykpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6Z2xhc3NDbGllbnRSZWFkeScsIChnbGFzc0NoYW5uZWwpID0+IHtcbiAgICAgIGdsYXNzQ2hhbm5lbC5vbignY3V0JywgKCkgPT4ge3RoaXMuaGFuZGxlVmlydHVhbENsaXBib2FyZCgnY3V0Jyl9KVxuICAgICAgZ2xhc3NDaGFubmVsLm9uKCdjb3B5JywgKCkgPT4ge3RoaXMuaGFuZGxlVmlydHVhbENsaXBib2FyZCgnY29weScpfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0b3VyQ2xpZW50UmVhZHknLCAoY2xpZW50KSA9PiB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICAgIHRoaXMudG91ckNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBwcmV2ZW50RGVmYXVsdERyYWcsIGZhbHNlKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcm9wJywgbGlua0V4dGVybmFsQXNzZXRzT25Ecm9wLmJpbmQodGhpcyksIGZhbHNlKVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdnbGFzcycpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnZ2xhc3MnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRpbWVsaW5lRGlkUGxheSAoKSB7XG4gICAgdGhpcy5fcGxheWluZyA9IHRydWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gIH1cblxuICBoYW5kbGVUaW1lbGluZURpZFBhdXNlIChmcmFtZURhdGEpIHtcbiAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2VcbiAgICB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lID0gZnJhbWVEYXRhLmZyYW1lXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gRGF0ZS5ub3coKVxuICB9XG5cbiAgaGFuZGxlVGltZWxpbmVEaWRTZWVrIChmcmFtZURhdGEpIHtcbiAgICB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lID0gZnJhbWVEYXRhLmZyYW1lXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuZHJhdyh0cnVlKVxuICB9XG5cbiAgZHJhdyAoZm9yY2VTZWVrKSB7XG4gICAgaWYgKHRoaXMuX3BsYXlpbmcgfHwgZm9yY2VTZWVrKSB7XG4gICAgICB2YXIgc2Vla01zID0gMFxuICAgICAgLy8gdGhpcy5fc3RvcHdhdGNoIGlzIG51bGwgdW5sZXNzIHdlJ3ZlIHJlY2VpdmVkIGFuIGFjdGlvbiBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICAgIC8vIElmIHdlJ3JlIGRldmVsb3BpbmcgdGhlIGdsYXNzIHNvbG8sIGkuZS4gd2l0aG91dCBhIGNvbm5lY3Rpb24gdG8gZW52b3kgd2hpY2hcbiAgICAgIC8vIHByb3ZpZGVzIHRoZSBzeXN0ZW0gY2xvY2ssIHdlIGNhbiBqdXN0IGxvY2sgdGhlIHRpbWUgdmFsdWUgdG8gemVybyBhcyBhIGhhY2suXG4gICAgICAvLyBUT0RPOiBXb3VsZCBiZSBuaWNlIHRvIGFsbG93IGZ1bGwtZmxlZGdlZCBzb2xvIGRldmVsb3BtZW50IG9mIGdsYXNzLi4uXG4gICAgICBpZiAodGhpcy5fc3RvcHdhdGNoICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmcHMgPSA2MCAvLyBUT0RPOiAgc3VwcG9ydCB2YXJpYWJsZVxuICAgICAgICB2YXIgYmFzZU1zID0gdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSAqIDEwMDAgLyBmcHNcbiAgICAgICAgdmFyIGRlbHRhTXMgPSB0aGlzLl9wbGF5aW5nID8gRGF0ZS5ub3coKSAtIHRoaXMuX3N0b3B3YXRjaCA6IDBcbiAgICAgICAgc2Vla01zID0gYmFzZU1zICsgZGVsdGFNc1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIHJvdW5kaW5nIGlzIHJlcXVpcmVkIG90aGVyd2lzZSB3ZSdsbCBzZWUgYml6YXJyZSBiZWhhdmlvciBvbiBzdGFnZS5cbiAgICAgIC8vIEkgdGhpbmsgaXQncyBiZWNhdXNlIHNvbWUgcGFydCBvZiB0aGUgcGxheWVyJ3MgY2FjaGluZyBvciB0cmFuc2l0aW9uIGxvZ2ljXG4gICAgICAvLyB3aGljaCB3YW50cyB0aGluZ3MgdG8gYmUgcm91bmQgbnVtYmVycy4gSWYgd2UgZG9uJ3Qgcm91bmQgdGhpcywgaS5lLiBjb252ZXJ0XG4gICAgICAvLyAxNi42NjYgLT4gMTcgYW5kIDMzLjMzMyAtPiAzMywgdGhlbiB0aGUgcGxheWVyIHdvbid0IHJlbmRlciB0aG9zZSBmcmFtZXMsXG4gICAgICAvLyB3aGljaCBtZWFucyB0aGUgdXNlciB3aWxsIGhhdmUgdHJvdWJsZSBtb3ZpbmcgdGhpbmdzIG9uIHN0YWdlIGF0IHRob3NlIHRpbWVzLlxuICAgICAgc2Vla01zID0gTWF0aC5yb3VuZChzZWVrTXMpXG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fc2V0VGltZWxpbmVUaW1lVmFsdWUoc2Vla01zLCBmb3JjZVNlZWspXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmcy5vdmVybGF5KSB7XG4gICAgICB0aGlzLmRyYXdPdmVybGF5cyhmb3JjZVNlZWspXG4gICAgfVxuICB9XG5cbiAgZHJhd0xvb3AgKCkge1xuICAgIHRoaXMuZHJhdygpXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXdMb29wKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKHRoaXMucmVmcy5tb3VudCwgeyBvcHRpb25zOiB7IGZyZWV6ZTogdHJ1ZSwgb3ZlcmZsb3dYOiAndmlzaWJsZScsIG92ZXJmbG93WTogJ3Zpc2libGUnLCBjb250ZXh0TWVudTogJ2Rpc2FibGVkJyB9IH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIG5ld01vdW50U2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3VudFdpZHRoOiBuZXdNb3VudFNpemUud2lkdGgsXG4gICAgICAgIG1vdW50SGVpZ2h0OiBuZXdNb3VudFNpemUuaGVpZ2h0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmRyYXdMb29wKClcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuZHJhdyh0cnVlKVxuXG4gICAgICAvLyBUaGlzIGhhcHBlbnMgb24gYWxtb3N0IGFueSB1cGRhdGUgYmVjYXVzZSB0aGVvcmV0aWNhbGx5IGEga2V5ZnJhbWUgY2hhbmdlLFxuICAgICAgLy8gYSBjdXJ2ZSBjaGFuZ2UsIGV0Yy4sIGNvdWxkIGFsbCByZXN1bHQgaW4gdGhlIG5lZWQgdG8gcmVjYWxjIHRoZSBhcnRib2FyZCA6L1xuICAgICAgdmFyIHVwZGF0ZWRBcnRib2FyZFNpemUgPSB0aGlzLl9jb21wb25lbnQuZ2V0Q29udGV4dFNpemUoKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdW50V2lkdGg6IHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGgsXG4gICAgICAgIG1vdW50SGVpZ2h0OiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCd0aW1lOmNoYW5nZScsICh0aW1lbGluZU5hbWUsIHRpbWVsaW5lVGltZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudCAmJiB0aGlzLl9jb21wb25lbnQuZ2V0TW91bnQoKSAmJiAhdGhpcy5fY29tcG9uZW50LmlzUmVsb2FkaW5nQ29kZSkge1xuICAgICAgICB2YXIgdXBkYXRlZEFydGJvYXJkU2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG4gICAgICAgIGlmICh1cGRhdGVkQXJ0Ym9hcmRTaXplICYmIHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGggJiYgdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG1vdW50V2lkdGg6IHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGgsXG4gICAgICAgICAgICBtb3VudEhlaWdodDogdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFBhc3RlYWJsZSB0aGluZ3MgYXJlIHN0b3JlZCBhdCB0aGUgZ2xvYmFsIGxldmVsIGluIHRoZSBjbGlwYm9hcmQgYnV0IHdlIG5lZWQgdGhhdCBhY3Rpb24gdG8gZmlyZSBmcm9tIHRoZSB0b3AgbGV2ZWxcbiAgICAvLyBzbyB0aGF0IGFsbCB0aGUgdmlld3MgZ2V0IHRoZSBtZXNzYWdlLCBzbyB3ZSBlbWl0IHRoaXMgYXMgYW4gZXZlbnQgYW5kIHRoZW4gd2FpdCBmb3IgdGhlIGNhbGwgdG8gcGFzdGVUaGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBwYXN0ZSBoZWFyZCcpXG4gICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY3V0JywgKCkgPT4ge3RoaXMuaGFuZGxlVmlydHVhbENsaXBib2FyZCgnY3V0Jyl9KVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCAoKSA9PiB7dGhpcy5oYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkKCdjb3B5Jyl9KVxuXG4gICAgLy8gVGhpcyBmaXJlcyB3aGVuIHRoZSBjb250ZXh0IG1lbnUgY3V0L2NvcHkgYWN0aW9uIGhhcyBiZWVuIGZpcmVkIC0gbm90IGEga2V5Ym9hcmQgYWN0aW9uLlxuICAgIC8vIFRoaXMgZmlyZXMgd2l0aCBjdXQgT1IgY29weS4gSW4gY2FzZSBvZiBjdXQsIHRoZSBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gLmN1dCgpIVxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpjb3B5JywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gZWxlbWVudDpjb3B5JywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kKGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5oYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkKCdjb3B5JylcbiAgICB9KVxuXG4gICAgLy8gU2luY2UgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgZWxlbWVudCBjYW4gYmUgZGVsZXRlZCBmcm9tIHRoZSBnbG9iYWwgbWVudSwgd2UgbmVlZCB0byBrZWVwIGl0IHRoZXJlXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gZWxlbWVudDpzZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZChjb21wb25lbnRJZClcbiAgICB9KVxuXG4gICAgLy8gU2luY2UgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgZWxlbWVudCBjYW4gYmUgZGVsZXRlZCBmcm9tIHRoZSBnbG9iYWwgbWVudSwgd2UgbmVlZCBjbGVhciBpdCB0aGVyZSB0b29cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6dW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IG51bGxcbiAgICAgIHRoaXMuZHJhdyh0cnVlKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIHZhciBvbGRUcmFuc2Zvcm0gLy8gRGVmaW5lZCBiZWxvdyAvLyBsaW50ZXJcblxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb2R1bGVSZXBsYWNlKChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vIE5vdGlmeSB0aGUgcGx1bWJpbmcgdGhhdCB0aGUgbW9kdWxlIHJlcGxhY2VtZW50IGhlcmUgaGFzIGZpbmlzaGVkLCB3aGljaCBzaG91bGQgcmVhY3RpdmF0ZVxuICAgICAgICAgICAgLy8gdGhlIHVuZG8vcmVkbyBxdWV1ZXMgd2hpY2ggc2hvdWxkIGJlIHdhaXRpbmcgZm9yIHRoaXMgdG8gZmluaXNoXG4gICAgICAgICAgICAvLyBOb3RlIGhvdyB3ZSBkbyB0aGlzIHdoZXRoZXIgb3Igbm90IHdlIGdvdCBhbiBlcnJvciBmcm9tIHRoZSBhY3Rpb25cbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICAgICAgbmFtZTogJ2NvbXBvbmVudDpyZWxvYWQ6Y29tcGxldGUnLFxuICAgICAgICAgICAgICBmcm9tOiAnZ2xhc3MnXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFydGJvYXJkIHNpemUgbWF5IGhhdmUgY2hhbmdlZCBhcyBhIHBhcnQgb2YgdGhhdCwgYW5kIHNpbmNlIHRoZXJlIGFyZSB0d28gc291cmNlcyBvZlxuICAgICAgICAgICAgLy8gdHJ1dGggZm9yIHRoaXMgKGFjdHVhbCBhcnRib2FyZCwgUmVhY3QgbW91bnQgZm9yIGFydGJvYXJkKSwgd2UgaGF2ZSB0byB1cGRhdGUgaXQgaGVyZS5cbiAgICAgICAgICAgIHZhciB1cGRhdGVkQXJ0Ym9hcmRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBtb3VudFdpZHRoOiB1cGRhdGVkQXJ0Ym9hcmRTaXplLndpZHRoLFxuICAgICAgICAgICAgICBtb3VudEhlaWdodDogdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcblxuICAgICAgICBjYXNlICd2aWV3Onpvb20taW4nOlxuICAgICAgICAgIG9sZFRyYW5zZm9ybSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTdGFnZVRyYW5zZm9ybSgpXG4gICAgICAgICAgb2xkVHJhbnNmb3JtLnpvb20gPSB0aGlzLnN0YXRlLnpvb21YWSAqIDEuMjVcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0ob2xkVHJhbnNmb3JtKVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgem9vbVhZOiB0aGlzLnN0YXRlLnpvb21YWSAqIDEuMjUgfSlcblxuICAgICAgICBjYXNlICd2aWV3Onpvb20tb3V0JzpcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgICAgICAgIG9sZFRyYW5zZm9ybS56b29tID0gdGhpcy5zdGF0ZS56b29tWFkgLyAxLjI1XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHpvb21YWTogdGhpcy5zdGF0ZS56b29tWFkgLyAxLjI1IH0pXG5cbiAgICAgICAgY2FzZSAnZHJhd2luZzpzZXRBY3RpdmUnOlxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGFjdGl2ZURyYXdpbmdUb29sOiBtZXNzYWdlLnBhcmFtc1swXSxcbiAgICAgICAgICAgIGRyYXdpbmdJc01vZGFsOiBtZXNzYWdlLnBhcmFtc1sxXVxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21tZW50cy5sb2FkKChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB2b2lkICgwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbW1lbnRzOiB0aGlzLl9jb21tZW50cy5jb21tZW50cyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jdHhtZW51Lm9uKCdjbGljaycsIChhY3Rpb24sIGV2ZW50LCBlbGVtZW50KSA9PiB7XG4gICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBjYXNlICdBZGQgQ29tbWVudCc6XG4gICAgICAgICAgdGhpcy5fY29tbWVudHMuYnVpbGQoeyB4OiB0aGlzLl9jdHhtZW51Ll9tZW51Lmxhc3RYLCB5OiB0aGlzLl9jdHhtZW51Ll9tZW51Lmxhc3RZIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbW1lbnRzOiB0aGlzLl9jb21tZW50cy5jb21tZW50cywgZG9TaG93Q29tbWVudHM6IHRydWUgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4bWVudS5yZWJ1aWxkKHRoaXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdIaWRlIENvbW1lbnRzJzpcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZG9TaG93Q29tbWVudHM6ICF0aGlzLnN0YXRlLmRvU2hvd0NvbW1lbnRzIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eG1lbnUucmVidWlsZCh0aGlzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnU2hvdyBDb21tZW50cyc6XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRvU2hvd0NvbW1lbnRzOiAhdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHhtZW51LnJlYnVpbGQodGhpcylcbiAgICAgICAgICB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1Nob3cgRXZlbnQgTGlzdGVuZXJzJzpcbiAgICAgICAgICB0aGlzLnNob3dFdmVudEhhbmRsZXJzRWRpdG9yKGV2ZW50LCBlbGVtZW50KVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFBhc3RlYWJsZSB0aGluZ3MgYXJlIHN0b3JlZCBhdCB0aGUgZ2xvYmFsIGxldmVsIGluIHRoZSBjbGlwYm9hcmQgYnV0IHdlIG5lZWQgdGhhdCBhY3Rpb24gdG8gZmlyZSBmcm9tIHRoZSB0b3AgbGV2ZWxcbiAgICAvLyBzbyB0aGF0IGFsbCB0aGUgdmlld3MgZ2V0IHRoZSBtZXNzYWdlLCBzbyB3ZSBlbWl0IHRoaXMgYXMgYW4gZXZlbnQgYW5kIHRoZW4gd2FpdCBmb3IgdGhlIGNhbGwgdG8gcGFzdGVUaGluZ1xuICAgIHRoaXMuX2N0eG1lbnUub24oJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlV2luZG93UmVzaXplKClcbiAgICB9KSwgNjQpXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMud2luZG93TW91c2VVcEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy53aW5kb3dNb3VzZU1vdmVIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLndpbmRvd01vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMud2luZG93TW91c2VEb3duSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMud2luZG93Q2xpY2tIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy53aW5kb3dEYmxDbGlja0hhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMud2luZG93S2V5RG93bkhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLndpbmRvd0tleVVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMud2luZG93TW91c2VPdXRIYW5kbGVyLmJpbmQodGhpcykpXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUgKCkge1xuICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDbGllbnQub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5fZW52b3lDbGllbnQuY2xvc2VDb25uZWN0aW9uKClcbiAgfVxuXG4gIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQgKGNsaXBib2FyZEFjdGlvbiwgbWF5YmVDbGlwYm9hcmRFdmVudCkge1xuICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBoYW5kbGluZyBjbGlwYm9hcmQgYWN0aW9uJywgY2xpcGJvYXJkQWN0aW9uKVxuXG4gICAgaWYgKFxuICAgICAgLy8gQXZvaWQgaW5maW5pdGUgbG9vcHMgZHVlIHRvIHRoZSB3YXkgd2UgbGV2ZXJhZ2UgZXhlY0NvbW1hbmRcbiAgICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgfHxcbiAgICAgIC8vIEF2b2lkIGludGVyZmVyaW5nIHdpdGggY3V0L2NvcHkgZXZlbnRzIGluIHRoZSBldmVudHMgZWRpdG9yXG4gICAgICB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlblxuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuXG4gICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IHRydWVcblxuICAgIGlmICh0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAvLyBHb3R0YSBncmFiIF9iZWZvcmUgY3V0dGluZ18gb3Igd2UnbGwgZW5kIHVwIHdpdGggYSBwYXJ0aWFsIG9iamVjdCB0aGF0IHdvbid0IHdvcmtcbiAgICAgIGxldCBjbGlwYm9hcmRQYXlsb2FkID0gdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudC5nZXRDbGlwYm9hcmRQYXlsb2FkKCdnbGFzcycpXG5cbiAgICAgIGlmIChjbGlwYm9hcmRBY3Rpb24gPT09ICdjdXQnKSB7XG4gICAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQuY3V0KClcbiAgICAgIH1cblxuICAgICAgbGV0IHNlcmlhbGl6ZWRQYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoWydhcHBsaWNhdGlvbi9oYWlrdScsIGNsaXBib2FyZFBheWxvYWRdKVxuXG4gICAgICBjbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZWRQYXlsb2FkKVxuXG4gICAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlV2luZG93UmVzaXplICgpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcbiAgICB9KVxuICB9XG5cbiAgc2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IgKGNsaWNrRXZlbnQsIHRhcmdldEVsZW1lbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRhcmdldEVsZW1lbnQ6IHRhcmdldEVsZW1lbnQsXG4gICAgICBpc0V2ZW50SGFuZGxlckVkaXRvck9wZW46IHRydWVcbiAgICB9KVxuICB9XG5cbiAgaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGFyZ2V0RWxlbWVudDogbnVsbCxcbiAgICAgIGlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbjogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgc2F2ZUV2ZW50SGFuZGxlciAodGFyZ2V0RWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyRGVzY3JpcHRvclNlcmlhbGl6ZWQpIHtcbiAgICBsZXQgc2VsZWN0b3JOYW1lID0gJ2hhaWt1OicgKyB0YXJnZXRFbGVtZW50LnVpZFxuICAgIHRoaXMuX2NvbXBvbmVudC51cHNlcnRFdmVudEhhbmRsZXIoc2VsZWN0b3JOYW1lLCBldmVudE5hbWUsIGhhbmRsZXJEZXNjcmlwdG9yU2VyaWFsaXplZCwgeyBmcm9tOiAnZ2xhc3MnIH0sICgpID0+IHtcblxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtUGFuIChkeCwgZHkpIHtcbiAgICB2YXIgb2xkVHJhbnNmb3JtID0gdGhpcy5fY29tcG9uZW50LmdldFN0YWdlVHJhbnNmb3JtKClcbiAgICBvbGRUcmFuc2Zvcm0ucGFuLnggPSB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWCArIGR4XG4gICAgb2xkVHJhbnNmb3JtLnBhbi55ID0gdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblkgKyBkeVxuICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybShvbGRUcmFuc2Zvcm0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYW5YOiB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWCArIGR4LFxuICAgICAgcGFuWTogdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblkgKyBkeVxuICAgIH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZU91dEhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB2YXIgc291cmNlID0gbmF0aXZlRXZlbnQucmVsYXRlZFRhcmdldCB8fCBuYXRpdmVFdmVudC50b0VsZW1lbnRcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2Uubm9kZU5hbWUgPT09ICdIVE1MJykge1xuICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAvLyAgIGlzQW55dGhpbmdTY2FsaW5nOiBmYWxzZSxcbiAgICAgIC8vICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIC8vICAgY29udHJvbEFjdGl2YXRpb246IG51bGxcbiAgICAgIC8vIH0pXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmhvdmVyZWQuZGVxdWV1ZSgpXG4gICAgfVxuICB9XG5cbiAgd2luZG93TW91c2VNb3ZlSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlTW92ZSh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZVVwSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXAoeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93TW91c2VEb3duSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlRG93bih7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dDbGlja0hhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVDbGljayh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dEYmxDbGlja0hhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVEb3VibGVDbGljayh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dLZXlEb3duSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2V5RG93bih7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dLZXlVcEhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtleVVwKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93biAobW91c2Vkb3duRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIGlmIChtb3VzZWRvd25FdmVudC5uYXRpdmVFdmVudC5idXR0b24gIT09IDApIHJldHVybiAvLyBsZWZ0IGNsaWNrIG9ubHlcblxuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURvd24gPSB0cnVlXG4gICAgdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duVGltZSA9IERhdGUubm93KClcbiAgICB2YXIgbW91c2VQb3MgPSB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZWRvd25FdmVudCwgJ2xhc3RNb3VzZURvd25Qb3NpdGlvbicpXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVEcmF3aW5nVG9vbCAhPT0gJ3BvaW50ZXInKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZHJhd2luZ0lzTW9kYWwpIHtcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAnZHJhd2luZzpjb21wbGV0ZWQnLCBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudC5pbnN0YW50aWF0ZUNvbXBvbmVudCh0aGlzLnN0YXRlLmFjdGl2ZURyYXdpbmdUb29sLCB7XG4gICAgICAgIHg6IG1vdXNlUG9zLngsXG4gICAgICAgIHk6IG1vdXNlUG9zLnksXG4gICAgICAgIG1pbmltaXplZDogdHJ1ZVxuICAgICAgfSwgeyBmcm9tOiAnZ2xhc3MnIH0sIChlcnIsIG1ldGFkYXRhLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbW91c2UgaXMgc3RpbGwgZG93biBiZWdpbiBkcmFnIHNjYWxpbmdcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgYm90dG9tIHJpZ2h0IGNvbnRyb2wgcG9pbnQsIGZvciBzY2FsaW5nXG4gICAgICAgICAgdGhpcy5jb250cm9sQWN0aXZhdGlvbih7XG4gICAgICAgICAgICBpbmRleDogOCxcbiAgICAgICAgICAgIGV2ZW50OiBtb3VzZWRvd25FdmVudFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNsaW1iIHRoZSB0YXJnZXQgcGF0aCB0byBmaW5kIGlmIGEgaGFpa3UgZWxlbWVudCBoYXMgYmVlbiBzZWxlY3RlZFxuICAgICAgLy8gTk9URTogd2Ugd2FudCB0byBtYWtlIHN1cmUgd2UgYXJlIG5vdCBzZWxlY3RpbmcgZWxlbWVudHMgYXQgdGhlIHdyb25nIGNvbnRleHQgbGV2ZWxcbiAgICAgIHZhciB0YXJnZXQgPSBtb3VzZWRvd25FdmVudC5uYXRpdmVFdmVudC50YXJnZXRcbiAgICAgIGlmICgodHlwZW9mIHRhcmdldC5jbGFzc05hbWUgPT09ICdzdHJpbmcnKSAmJiB0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3NjYWxlLWN1cnNvcicpICE9PSAtMSkgcmV0dXJuXG5cbiAgICAgIHdoaWxlICh0YXJnZXQuaGFzQXR0cmlidXRlICYmICghdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnc291cmNlJykgfHwgIXRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hhaWt1LWlkJykgfHxcbiAgICAgICAgICAgICAhdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hhaWt1LWlkJykpKSkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRhcmdldCB8fCAhdGFyZ2V0Lmhhc0F0dHJpYnV0ZSkge1xuICAgICAgICAvLyBJZiBzaGlmdCBpcyBkb3duLCB0aGF0J3MgY29uc3RyYWluZWQgc2NhbGluZy4gSWYgY21kLCB0aGF0J3Mgcm90YXRpb24gbW9kZS5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmlzS2V5U2hpZnREb3duICYmICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24pIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ3NvdXJjZScpICYmIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hhaWt1LWlkJykgJiYgdGFyZ2V0LnBhcmVudE5vZGUgIT09IHRoaXMucmVmcy5tb3VudCkge1xuICAgICAgICB2YXIgaGFpa3VJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hhaWt1LWlkJylcbiAgICAgICAgdmFyIGNvbnRhaW5lZCA9IGxvZGFzaC5maW5kKHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgKGVsZW1lbnQpID0+IGVsZW1lbnQudWlkID09PSBoYWlrdUlkKVxuXG4gICAgICAgIC8vIHdlIGNoZWNrIGlmIHRoZSBlbGVtZW50IGJlaW5nIGNsaWNrZWQgb24gaXMgYWxyZWFkeSBpbiB0aGUgc2VsZWN0aW9uLCBpZiBpdCBpcyB3ZSBkb24ndCB3YW50XG4gICAgICAgIC8vIHRvIGNsZWFyIHRoZSBzZWxlY3Rpb24gc2luY2UgaXQgY291bGQgYmUgYSBncm91cGVkIHNlbGVjdGlvblxuICAgICAgICAvLyBJZiBzaGlmdCBpcyBkb3duLCB0aGF0J3MgY29uc3RyYWluZWQgc2NhbGluZy4gSWYgY21kLCB0aGF0J3Mgcm90YXRpb24gbW9kZS5cbiAgICAgICAgaWYgKCFjb250YWluZWQgJiYgKCF0aGlzLnN0YXRlLmlzS2V5U2hpZnREb3duICYmICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24pKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb250YWluZWQpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2VsZWN0RWxlbWVudChoYWlrdUlkLCB7IGZyb206ICdnbGFzcycgfSwgKCkgPT4ge30pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwIChtb3VzZXVwRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURvd24gPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUubGFzdE1vdXNlVXBUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuaGFuZGxlRHJhZ1N0b3AoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIGdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzOiAnJyxcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uOiBudWxsXG4gICAgfSlcbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZXVwRXZlbnQsICdsYXN0TW91c2VVcFBvc2l0aW9uJylcbiAgfVxuXG4gIGhhbmRsZUNsaWNrIChjbGlja0V2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24oY2xpY2tFdmVudClcbiAgfVxuXG4gIGhhbmRsZURvdWJsZUNsaWNrIChkb3VibGVDbGlja0V2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24oZG91YmxlQ2xpY2tFdmVudClcbiAgfVxuXG4gIGhhbmRsZURyYWdTdGFydCAoY2IpIHtcbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNNb3VzZURyYWdnaW5nOiB0cnVlIH0sIGNiKVxuICB9XG5cbiAgaGFuZGxlRHJhZ1N0b3AgKGNiKSB7XG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRHJhZ2dpbmcgPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc01vdXNlRHJhZ2dpbmc6IGZhbHNlIH0sIGNiKVxuICB9XG5cbiAgaGFuZGxlS2V5RXNjYXBlICgpIHtcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gIH1cblxuICBoYW5kbGVLZXlTcGFjZSAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleVNwYWNlRG93bjogaXNEb3duIH0pXG4gICAgLy8gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5kcmlsbGRvd25JbnRvQWxyZWFkeVNlbGVjdGVkRWxlbWVudCh0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50KVxuICB9XG5cbiAgaGFuZGxlS2V5TGVmdEFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoLWRlbHRhLCAwLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5VXBBcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKDAsIC1kZWx0YSwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleVJpZ2h0QXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZShkZWx0YSwgMCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleURvd25BcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKDAsIGRlbHRhLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAoa2V5RXZlbnQpIHtcbiAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvcikge1xuICAgICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3Iud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KGtleUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIDI3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlFc2NhcGUoKVxuICAgICAgY2FzZSAzMjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5U3BhY2Uoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDM3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlMZWZ0QXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDM4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlVcEFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSAzOTogcmV0dXJuIHRoaXMuaGFuZGxlS2V5UmlnaHRBcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgNDA6IHJldHVybiB0aGlzLmhhbmRsZUtleURvd25BcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgNDY6IHJldHVybiB0aGlzLmhhbmRsZUtleURlbGV0ZSgpXG4gICAgICBjYXNlIDg6IHJldHVybiB0aGlzLmhhbmRsZUtleURlbGV0ZSgpXG4gICAgICBjYXNlIDEzOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlFbnRlcigpXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTaGlmdChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLmhhbmRsZUtleUN0cmwoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlBbHQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAoa2V5RXZlbnQpIHtcbiAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvcikge1xuICAgICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3Iud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KGtleUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIDMyOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTcGFjZShrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTaGlmdChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDdHJsKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLmhhbmRsZUtleUFsdChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlFbnRlciAoKSB7XG4gICAgLy8gbm9vcCBmb3Igbm93XG4gIH1cblxuICBoYW5kbGVLZXlDb21tYW5kIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uY21kID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleUNvbW1hbmREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVLZXlTaGlmdCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLnNoaWZ0ID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleVNoaWZ0RG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlS2V5Q3RybCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLmN0cmwgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q3RybERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUtleUFsdCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLmFsdCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlBbHREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVDbGlja1N0YWdlTmFtZSAoKSB7XG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgIHZhciBhcnRib2FyZCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZFJvb3RzKClbMF1cbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmNsaWNrZWQuYWRkKGFydGJvYXJkKVxuICAgIGFydGJvYXJkLnNlbGVjdCh7IGZyb206ICdnbGFzcycgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzU3RhZ2VOYW1lSG92ZXJpbmc6IHRydWUgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTdGFnZU5hbWVIb3ZlcmluZzogZmFsc2UgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZSAobW91c2Vtb3ZlRXZlbnQpIHtcbiAgICBjb25zdCB6b29tID0gdGhpcy5zdGF0ZS56b29tWFkgfHwgMVxuICAgIGNvbnN0IGxhc3RNb3VzZURvd25Qb3NpdGlvbiA9IHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uXG4gICAgY29uc3QgbW91c2VQb3NpdGlvbkN1cnJlbnQgPSB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZW1vdmVFdmVudClcbiAgICBjb25zdCBtb3VzZVBvc2l0aW9uUHJldmlvdXMgPSB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cyB8fCBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGxldCBkeCA9IChtb3VzZVBvc2l0aW9uQ3VycmVudC54IC0gbW91c2VQb3NpdGlvblByZXZpb3VzLngpIC8gem9vbVxuICAgIGxldCBkeSA9IChtb3VzZVBvc2l0aW9uQ3VycmVudC55IC0gbW91c2VQb3NpdGlvblByZXZpb3VzLnkpIC8gem9vbVxuICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkgcmV0dXJuIG1vdXNlUG9zaXRpb25DdXJyZW50XG5cbiAgICAvLyBpZiAoZHggIT09IDApIGR4ID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLnpvb21YWSAvIGR4KVxuICAgIC8vIGlmIChkeSAhPT0gMCkgZHkgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuem9vbVhZIC8gZHkpXG4gICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyLCB0aGUgbW91c2UgaGFzIGNoYW5nZWQgaXRzIHBvc2l0aW9uIGZyb20gdGhlIG1vc3QgcmVjZW50IG1vdXNlZG93blxuICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEb3duKSB7XG4gICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCgpXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyAmJiB0aGlzLnN0YXRlLmlzTW91c2VEb3duKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc0tleVNwYWNlRG93biAmJiB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duKSB7XG4gICAgICAgIHRoaXMucGVyZm9ybVBhbihcbiAgICAgICAgICBtb3VzZW1vdmVFdmVudC5uYXRpdmVFdmVudC5jbGllbnRYIC0gdGhpcy5zdGF0ZS5zdGFnZU1vdXNlRG93bi54LFxuICAgICAgICAgIG1vdXNlbW92ZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFkgLSB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duLnlcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSlcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LmRyYWcoZHgsIGR5LCBtb3VzZVBvc2l0aW9uQ3VycmVudCwgbW91c2VQb3NpdGlvblByZXZpb3VzLCBsYXN0TW91c2VEb3duUG9zaXRpb24sIHRoaXMuc3RhdGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgfVxuXG4gIGhhbmRsZUtleURlbGV0ZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKVxuICAgIH0pXG4gIH1cblxuICByZXNldENvbnRhaW5lckRpbWVuc2lvbnMgKGNiKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuY29udGFpbmVyKSByZXR1cm5cbiAgICB2YXIgdyA9IHRoaXMucmVmcy5jb250YWluZXIuY2xpZW50V2lkdGhcbiAgICB2YXIgaCA9IHRoaXMucmVmcy5jb250YWluZXIuY2xpZW50SGVpZ2h0XG4gICAgdmFyIG1vdW50WCA9ICh3IC0gdGhpcy5zdGF0ZS5tb3VudFdpZHRoKSAvIDJcbiAgICB2YXIgbW91bnRZID0gKGggLSB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0KSAvIDJcbiAgICBpZiAodyAhPT0gdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCB8fCBoICE9PSB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodCB8fCBtb3VudFggIT09IHRoaXMuc3RhdGUubW91bnRYIHx8IG1vdW50WSAhPT0gdGhpcy5zdGF0ZS5tb3VudFkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb250YWluZXJXaWR0aDogdywgY29udGFpbmVySGVpZ2h0OiBoLCBtb3VudFgsIG1vdW50WSB9LCBjYilcbiAgICB9XG4gIH1cblxuICBnZXRBcnRib2FyZFJlY3QgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgIHJpZ2h0OiB0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICBib3R0b206IHRoaXMuc3RhdGUubW91bnRZICsgdGhpcy5zdGF0ZS5tb3VudEhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHRcbiAgICB9XG4gIH1cblxuICBnZXRTZWxlY3Rpb25NYXJxdWVlU2l6ZSAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50IHx8ICF0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbikge1xuICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB4OiB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi54ICsgdGhpcy5nZXRBcnRib2FyZFJlY3QoKS5sZWZ0LFxuICAgICAgeTogdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueSArIHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkudG9wLFxuICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQueCAtIHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLngsXG4gICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQueSAtIHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLnlcbiAgICB9XG4gIH1cblxuICBjb250cm9sQWN0aXZhdGlvbiAoYWN0aXZhdGlvbkluZm8pIHtcbiAgICB2YXIgYXJ0Ym9hcmQgPSB0aGlzLmdldEFydGJvYXJkUmVjdCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bixcbiAgICAgIGlzQW55dGhpbmdTY2FsaW5nOiAhdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLFxuICAgICAgY29udHJvbEFjdGl2YXRpb246IHtcbiAgICAgICAgc2hpZnQ6IHRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24sXG4gICAgICAgIGN0cmw6IHRoaXMuc3RhdGUuaXNLZXlDdHJsRG93bixcbiAgICAgICAgY21kOiB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sXG4gICAgICAgIGFsdDogdGhpcy5zdGF0ZS5pc0tleUFsdERvd24sXG4gICAgICAgIGluZGV4OiBhY3RpdmF0aW9uSW5mby5pbmRleCxcbiAgICAgICAgYXJib2FyZDogYXJ0Ym9hcmQsXG4gICAgICAgIGNsaWVudDoge1xuICAgICAgICAgIHg6IGFjdGl2YXRpb25JbmZvLmV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgeTogYWN0aXZhdGlvbkluZm8uZXZlbnQuY2xpZW50WVxuICAgICAgICB9LFxuICAgICAgICBjb29yZHM6IHtcbiAgICAgICAgICB4OiBhY3RpdmF0aW9uSW5mby5ldmVudC5jbGllbnRYIC0gYXJ0Ym9hcmQubGVmdCxcbiAgICAgICAgICB5OiBhY3RpdmF0aW9uSW5mby5ldmVudC5jbGllbnRZIC0gYXJ0Ym9hcmQudG9wXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIChtb3VzZUV2ZW50LCBhZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuY29udGFpbmVyKSByZXR1cm4gbnVsbCAvLyBXZSBoYXZlbid0IG1vdW50ZWQgeWV0LCBubyBzaXplIGF2YWlsYWJsZVxuICAgIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzID0gdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGNvbnN0IG1vdXNlUG9zaXRpb25DdXJyZW50ID0gZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uKG1vdXNlRXZlbnQubmF0aXZlRXZlbnQsIHRoaXMucmVmcy5jb250YWluZXIpXG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQuY2xpZW50WCA9IG1vdXNlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WFxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LmNsaWVudFkgPSBtb3VzZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC54IC09IHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkubGVmdFxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LnkgLT0gdGhpcy5nZXRBcnRib2FyZFJlY3QoKS50b3BcbiAgICB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50ID0gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICBpZiAoYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZSkgdGhpcy5zdGF0ZVthZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlXSA9IG1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgcmV0dXJuIG1vdXNlUG9zaXRpb25DdXJyZW50XG4gIH1cblxuICBkcmF3T3ZlcmxheXMgKGZvcmNlKSB7XG4gICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5zZWxlY3RlZC5hbGwoKVxuICAgIGlmIChmb3JjZSB8fCBzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5faGFpa3VSZW5kZXJlci5jcmVhdGVDb250YWluZXIodGhpcy5yZWZzLm92ZXJsYXkpXG4gICAgICB2YXIgcGFydHMgPSB0aGlzLmJ1aWxkRHJhd25PdmVybGF5cygpXG4gICAgICB2YXIgb3ZlcmxheSA9IHtcbiAgICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgaWQ6ICdoYWlrdS1nbGFzcy1vdmVybGF5LXJvb3QnLFxuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06ICdtYXRyaXgzZCgxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCwwLDAsMCwxKScsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCArICdweCcsXG4gICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZICsgJ3B4JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGggKyAncHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IHBhcnRzXG4gICAgICB9XG5cbiAgICAgIC8vIEhBQ0shIFdlIGFscmVhZHkgY2FjaGUgdGhlIGNvbnRyb2wgcG9pbnQgbGlzdGVuZXJzIG91cnNlbHZlcywgc28gY2xlYXIgdGhlIGNhY2hlXG4gICAgICAvLyB1c2VkIG5vcm1hbGx5IGJ5IHRoZSBjb21wb25lbnQgaW5zdGFuY2UgZm9yIGNhY2hpbmcvZGVkdXBpbmcgbGlzdGVuZXJzIGluIHByb2R1Y3Rpb25cbiAgICAgIHRoaXMuX2hhaWt1Q29udGV4dC5jb21wb25lbnQuX3JlZ2lzdGVyZWRFbGVtZW50RXZlbnRMaXN0ZW5lcnMgPSB7fVxuXG4gICAgICB0aGlzLl9oYWlrdVJlbmRlcmVyLnJlbmRlcih0aGlzLnJlZnMub3ZlcmxheSwgY29udGFpbmVyLCBvdmVybGF5LCB0aGlzLl9oYWlrdUNvbnRleHQuY29tcG9uZW50LCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBjcmVhdGVzIG9iamVjdHMgd2hpY2ggcmVwcmVzZW50IEhhaWt1IFBsYXllciByZW5kZXJpbmcgaW5zdHJ1Y3Rpb25zIGZvciBkaXNwbGF5aW5nIGFsbCBvZlxuICAvLyB0aGUgdmlzdWFsIGVmZmVjdHMgdGhhdCBzaXQgYWJvdmUgdGhlIHN0YWdlLiAoVHJhbnNmb3JtIGNvbnRyb2xzLCBldGMuKSBUaGUgSGFpa3UgUGxheWVyIGlzIHNvcnQgb2YgYVxuICAvLyBoeWJyaWQgb2YgUmVhY3QgRmliZXIgYW5kIEZhbW91cyBFbmdpbmUuIEl0IGhhcyBhIHZpcnR1YWwgRE9NIHRyZWUgb2YgZWxlbWVudHMgbGlrZSB7ZWxlbWVudE5hbWU6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7fSwgW119LFxuICAvLyBhbmQgZmx1c2hlcyB1cGRhdGVzIHRvIHRoZW0gb24gZWFjaCBmcmFtZS4gU28gd2hhdCBfdGhpcyBtZXRob2RfIGRvZXMgaXMganVzdCBidWlsZCB0aG9zZSBvYmplY3RzIGFuZCB0aGVuXG4gIC8vIHRoZXNlIGdldCBwYXNzZWQgaW50byBhIEhhaWt1IFBsYXllciByZW5kZXIgbWV0aG9kIChzZWUgYWJvdmUpLiBMT05HIFNUT1JZIFNIT1JUOiBUaGlzIGNyZWF0ZXMgYSBmbGF0IGxpc3Qgb2ZcbiAgLy8gbm9kZXMgdGhhdCBnZXQgcmVuZGVyZWQgdG8gdGhlIERPTSBieSB0aGUgSGFpa3UgUGxheWVyLlxuICBidWlsZERyYXduT3ZlcmxheXMgKCkge1xuICAgIHZhciBvdmVybGF5cyA9IFtdXG4gICAgLy8gRG9uJ3Qgc2hvdyBhbnkgb3ZlcmxheXMgaWYgd2UncmUgaW4gcHJldmlldyAoYWthICdsaXZlJykgaW50ZXJhY3Rpb25Nb2RlXG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gb3ZlcmxheXNcbiAgICB9XG4gICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5zZWxlY3RlZC5hbGwoKVxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgcG9pbnRzXG4gICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gc2VsZWN0ZWRbMF1cbiAgICAgICAgaWYgKGVsZW1lbnQuaXNSZW5kZXJhYmxlVHlwZSgpKSB7XG4gICAgICAgICAgcG9pbnRzID0gZWxlbWVudC5nZXRQb2ludHNUcmFuc2Zvcm1lZCh0cnVlKVxuICAgICAgICAgIHRoaXMucmVuZGVyTW9ycGhQb2ludHNPdmVybGF5KHBvaW50cywgb3ZlcmxheXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9pbnRzID0gZWxlbWVudC5nZXRCb3hQb2ludHNUcmFuc2Zvcm1lZCgpXG4gICAgICAgICAgdmFyIHJvdGF0aW9uWiA9IGVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgncm90YXRpb24ueicpIHx8IDBcbiAgICAgICAgICB2YXIgc2NhbGVYID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS54JylcbiAgICAgICAgICBpZiAoc2NhbGVYID09PSB1bmRlZmluZWQgfHwgc2NhbGVYID09PSBudWxsKSBzY2FsZVggPSAxXG4gICAgICAgICAgdmFyIHNjYWxlWSA9IGVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueScpXG4gICAgICAgICAgaWYgKHNjYWxlWSA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWSA9PT0gbnVsbCkgc2NhbGVZID0gMVxuICAgICAgICAgIHRoaXMucmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheShwb2ludHMsIG92ZXJsYXlzLCBlbGVtZW50LmNhblJvdGF0ZSgpLCB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sIHRydWUsIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50cyA9IFtdXG4gICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmdldEJveFBvaW50c1RyYW5zZm9ybWVkKCkuZm9yRWFjaCgocG9pbnQpID0+IHBvaW50cy5wdXNoKHBvaW50KSlcbiAgICAgICAgfSlcbiAgICAgICAgcG9pbnRzID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5nZXRCb3VuZGluZ0JveFBvaW50cyhwb2ludHMpXG4gICAgICAgIHRoaXMucmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheShwb2ludHMsIG92ZXJsYXlzLCBmYWxzZSwgdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLCBmYWxzZSwgMCwgMSwgMSlcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZykge1xuICAgICAgICAvLyBUT0RPOiBEcmF3IHRvb2x0aXAgd2l0aCBwb2ludHMgaW5mb1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheXNcbiAgfVxuXG4gIHJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheSAocG9pbnRzLCBvdmVybGF5cykge1xuICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIG92ZXJsYXlzLnB1c2godGhpcy5yZW5kZXJDb250cm9sUG9pbnQocG9pbnQueCwgcG9pbnQueSwgaW5kZXgpKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJMaW5lICh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiB7XG4gICAgICBlbGVtZW50TmFtZTogJ3N2ZycsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgZWxlbWVudE5hbWU6ICdsaW5lJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIHgxOiB4MSxcbiAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgeDI6IHgyLFxuICAgICAgICAgIHkyOiB5MixcbiAgICAgICAgICBzdHJva2U6IFBhbGV0dGUuREFSS0VSX1JPQ0syLFxuICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAnMXB4JyxcbiAgICAgICAgICAndmVjdG9yLWVmZmVjdCc6ICdub24tc2NhbGluZy1zdHJva2UnXG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIgKGV2ZW50TmFtZSwgcG9pbnRJbmRleCkge1xuICAgIC8vIENhY2hpbmcgdGhlc2UgYXMgb3Bwb3NlZCB0byBjcmVhdGluZyBuZXcgZnVuY3Rpb25zIGh1bmRyZWRzIG9mIHRpbWVzXG4gICAgaWYgKCF0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnMpIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVycyA9IHt9XG4gICAgY29uc3QgY29udHJvbEtleSA9IGV2ZW50TmFtZSArICctJyArIHBvaW50SW5kZXhcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XSkge1xuICAgICAgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldID0gKGxpc3RlbmVyRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jb250cm9sQWN0aXZhdGlvbih7XG4gICAgICAgICAgaW5kZXg6IHBvaW50SW5kZXgsXG4gICAgICAgICAgZXZlbnQ6IGxpc3RlbmVyRXZlbnRcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XS5jb250cm9sS2V5ID0gY29udHJvbEtleVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldXG4gIH1cblxuICByZW5kZXJDb250cm9sUG9pbnQgKHgsIHksIGluZGV4LCBoYW5kbGVDbGFzcykge1xuICAgIHZhciBzY2FsZSA9IDEgLyAodGhpcy5zdGF0ZS56b29tWFkgfHwgMSlcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBrZXk6ICdjb250cm9sLXBvaW50LScgKyBpbmRleCxcbiAgICAgICAgY2xhc3M6IGhhbmRsZUNsYXNzIHx8ICcnLFxuICAgICAgICBvbm1vdXNlZG93bjogdGhpcy5jcmVhdGVDb250cm9sUG9pbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaW5kZXgpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGV9LCR7c2NhbGV9KWAsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ2F1dG8nLFxuICAgICAgICAgIGxlZnQ6ICh4IC0gMy41KSArICdweCcsXG4gICAgICAgICAgdG9wOiAoeSAtIDMuNSkgKyAncHgnLFxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLRVJfUk9DSzIsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgYm94U2hhZG93OiAnMCAycHggNnB4IDAgJyArIFBhbGV0dGUuU0hBRFksIC8vIFRPRE86IGFjY291bnQgZm9yIHJvdGF0aW9uXG4gICAgICAgICAgd2lkdGg6ICc3cHgnLFxuICAgICAgICAgIGhlaWdodDogJzdweCcsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsZW1lbnROYW1lOiAnZGl2JyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBrZXk6ICdjb250cm9sLXBvaW50LWhpdC1hcmVhLScgKyBpbmRleCxcbiAgICAgICAgICAgIGNsYXNzOiBoYW5kbGVDbGFzcyB8fCAnJyxcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgICAgICAgICAgIGxlZnQ6ICctMTVweCcsXG4gICAgICAgICAgICAgIHRvcDogJy0xNXB4JyxcbiAgICAgICAgICAgICAgd2lkdGg6ICczMHB4JyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMzBweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cblxuICBnZXRIYW5kbGVDbGFzcyAoaW5kZXgsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIHZhciBkZWZhdWx0UG9pbnRHcm91cCA9IENMT0NLV0lTRV9DT05UUk9MX1BPSU5UU1swXVxuICAgIHZhciBpbmRleE9mUG9pbnQgPSBkZWZhdWx0UG9pbnRHcm91cC5pbmRleE9mKGluZGV4KVxuXG4gICAgdmFyIGtleU9mUG9pbnRHcm91cFxuICAgIGlmIChzY2FsZVggPj0gMCAmJiBzY2FsZVkgPj0gMCkga2V5T2ZQb2ludEdyb3VwID0gMCAvLyBkZWZhdWx0XG4gICAgZWxzZSBpZiAoc2NhbGVYID49IDAgJiYgc2NhbGVZIDwgMCkga2V5T2ZQb2ludEdyb3VwID0gMSAvLyBmbGlwcGVkIHZlcnRpY2FsbHlcbiAgICBlbHNlIGlmIChzY2FsZVggPCAwICYmIHNjYWxlWSA+PSAwKSBrZXlPZlBvaW50R3JvdXAgPSAyIC8vIGZsaXBwZWQgaG9yaXpvbnRhbGx5XG4gICAgZWxzZSBpZiAoc2NhbGVYIDwgMCAmJiBzY2FsZVkgPCAwKSBrZXlPZlBvaW50R3JvdXAgPSAzIC8vIGZsaXBwZWQgaG9yaXpvbnRhbGx5IGFuZCB2ZXJ0aWNhbGx5XG5cbiAgICBpZiAoa2V5T2ZQb2ludEdyb3VwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBoYW5kbGUgY2xhc3MgZHVlIHRvIGJhZCBzY2FsZSB2YWx1ZXMnKVxuICAgIH1cblxuICAgIHZhciBzcGVjaWZpZWRQb2ludEdyb3VwID0gQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTW2tleU9mUG9pbnRHcm91cF1cblxuICAgIHZhciByb3RhdGlvbkRlZ3JlZXMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmdldFJvdGF0aW9uSW4zNjAocm90YXRpb25aKVxuICAgIC8vIEVhY2ggNDUgZGVncmVlIHR1cm4gd2lsbCBlcXVhdGUgdG8gYSBwaGFzZSBjaGFuZ2Ugb2YgMSwgYW5kIHRoYXQgcGhhc2UgY29ycmVzcG9uZHMgdG9cbiAgICAvLyBhIHN0YXJ0aW5nIGluZGV4IGZvciB0aGUgY29udHJvbCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gICAgdmFyIHBoYXNlTnVtYmVyID0gfn4oKHJvdGF0aW9uRGVncmVlcyArIDIyLjUpIC8gNDUpICUgc3BlY2lmaWVkUG9pbnRHcm91cC5sZW5ndGhcbiAgICB2YXIgb2Zmc2V0SW5kZXggPSAoaW5kZXhPZlBvaW50ICsgcGhhc2VOdW1iZXIpICUgc3BlY2lmaWVkUG9pbnRHcm91cC5sZW5ndGhcbiAgICB2YXIgc2hpZnRlZEluZGV4ID0gc3BlY2lmaWVkUG9pbnRHcm91cFtvZmZzZXRJbmRleF1cblxuICAgIC8vIFRoZXNlIGNsYXNzIG5hbWVzIGFyZSBkZWZpbmVkIGluIGdsb2JhbC5jc3M7IHRoZSBpbmRpY2VzIGluZGljYXRlIHRoZSBjb3JyZXNwb25kaW5nIHBvaW50c1xuICAgIGlmIChjYW5Sb3RhdGUgJiYgaXNSb3RhdGlvbk1vZGVPbikge1xuICAgICAgcmV0dXJuIGByb3RhdGUtY3Vyc29yLSR7c2hpZnRlZEluZGV4fWBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBzY2FsZS1jdXJzb3ItJHtzaGlmdGVkSW5kZXh9YFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkgKHBvaW50cywgb3ZlcmxheXMsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgY2FuQ29udHJvbEhhbmRsZXMsIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpIHtcbiAgICB2YXIgY29ybmVycyA9IFtwb2ludHNbMF0sIHBvaW50c1syXSwgcG9pbnRzWzhdLCBwb2ludHNbNl1dXG4gICAgY29ybmVycy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIHZhciBuZXh0ID0gY29ybmVyc1soaW5kZXggKyAxKSAlIGNvcm5lcnMubGVuZ3RoXVxuICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckxpbmUocG9pbnQueCwgcG9pbnQueSwgbmV4dC54LCBuZXh0LnkpKVxuICAgIH0pXG4gICAgcG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICE9PSA0KSB7XG4gICAgICAgIG92ZXJsYXlzLnB1c2godGhpcy5yZW5kZXJDb250cm9sUG9pbnQocG9pbnQueCwgcG9pbnQueSwgaW5kZXgsIGNhbkNvbnRyb2xIYW5kbGVzICYmIHRoaXMuZ2V0SGFuZGxlQ2xhc3MoaW5kZXgsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uKSByZXR1cm4gJydcbiAgICB2YXIgY29udHJvbEluZGV4ID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvbi5pbmRleFxuICAgIHZhciBpc1JvdGF0aW9uTW9kZU9uID0gdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duXG4gICAgdmFyIHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRFbGVtZW50ID0gc2VsZWN0ZWRFbGVtZW50c1swXVxuICAgICAgdmFyIHJvdGF0aW9uWiA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdyb3RhdGlvbi56JykgfHwgMFxuICAgICAgdmFyIHNjYWxlWCA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS54JylcbiAgICAgIGlmIChzY2FsZVggPT09IHVuZGVmaW5lZCB8fCBzY2FsZVggPT09IG51bGwpIHNjYWxlWCA9IDFcbiAgICAgIHZhciBzY2FsZVkgPSBzZWxlY3RlZEVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueScpXG4gICAgICBpZiAoc2NhbGVZID09PSB1bmRlZmluZWQgfHwgc2NhbGVZID09PSBudWxsKSBzY2FsZVkgPSAxXG4gICAgICByZXR1cm4gdGhpcy5nZXRIYW5kbGVDbGFzcyhjb250cm9sSW5kZXgsIHRydWUsIGlzUm90YXRpb25Nb2RlT24sIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhhbmRsZUNsYXNzKGNvbnRyb2xJbmRleCwgZmFsc2UsIGlzUm90YXRpb25Nb2RlT24sIDAsIDEsIDEpXG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhZ2VUcmFuc2Zvcm0gKCkge1xuICAgIHZhciBhID0gdGhpcy5zdGF0ZS56b29tWFkgfHwgMVxuICAgIHZhciBjID0gdGhpcy5zdGF0ZS5wYW5YIHx8IDBcbiAgICB2YXIgZCA9IHRoaXMuc3RhdGUucGFuWSB8fCAwXG5cbiAgICByZXR1cm4gJ21hdHJpeDNkKCcgK1xuICAgICAgW2EsIDAsIDAsIDAsXG4gICAgICAgIDAsIGEsIDAsIDAsXG4gICAgICAgIDAsIDAsIDEsIDAsXG4gICAgICAgIGMsIGQsIDAsIDFdLmpvaW4oJywnKSArICcpJ1xuICB9XG5cbiAgaXNQcmV2aWV3TW9kZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5faW50ZXJhY3Rpb25Nb2RlLnR5cGUgPT09ICdsaXZlJ1xuICB9XG5cbiAgZ2V0Q3Vyc29yQ3NzUnVsZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSByZXR1cm4gJ2RlZmF1bHQnXG4gICAgcmV0dXJuICh0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duKSA/ICctd2Via2l0LWdyYWJiaW5nJyA6ICctd2Via2l0LWdyYWInXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHZhciBkcmF3aW5nQ2xhc3NOYW1lID0gKHRoaXMuc3RhdGUuYWN0aXZlRHJhd2luZ1Rvb2wgIT09ICdwb2ludGVyJykgPyAnZHJhdy1zaGFwZScgOiAnJ1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBpc0tleUNvbW1hbmREb3duOiBmYWxzZSB9KX0+XG5cbiAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICByaWdodDogMTAsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMDAwLFxuICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTRcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge01hdGgucm91bmQodGhpcy5zdGF0ZS56b29tWFkgLyAxICogMTAwKX0lXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA6ICcnfVxuXG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtY29udGFpbmVyJ1xuICAgICAgICAgIGNsYXNzTmFtZT17dGhpcy5nZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcygpfVxuICAgICAgICAgIG9uTW91c2VEb3duPXsobW91c2VEb3duKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIGlmIChtb3VzZURvd24ubmF0aXZlRXZlbnQudGFyZ2V0ICYmIG1vdXNlRG93bi5uYXRpdmVFdmVudC50YXJnZXQuaWQgPT09ICdmdWxsLWJhY2tncm91bmQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsUGFuWDogdGhpcy5zdGF0ZS5wYW5YLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUGFuWTogdGhpcy5zdGF0ZS5wYW5ZLFxuICAgICAgICAgICAgICAgIHN0YWdlTW91c2VEb3duOiB7XG4gICAgICAgICAgICAgICAgICB4OiBtb3VzZURvd24ubmF0aXZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICAgIHk6IG1vdXNlRG93bi5uYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdGFnZU1vdXNlRG93bjogbnVsbCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdGFnZU1vdXNlRG93bjogbnVsbCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgLy8gVE9ETzogIGlmL3doZW4gd2Ugc3VwcG9ydCBuYXRpdmUgc2Nyb2xsaW5nIGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ2xsIG5lZWQgdG8gZmlndXJlIG91dCBzb21lIHBoYW50b20gcmVmbG93aW5nL2ppdHRlciBpc3N1ZXNcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdGhpcy5nZXRTdGFnZVRyYW5zZm9ybSgpLFxuICAgICAgICAgICAgY3Vyc29yOiB0aGlzLmdldEN1cnNvckNzc1J1bGUoKSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSA/ICd3aGl0ZScgOiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLWxpdmUnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgPGZpbHRlciBpZD0nYmFja2dyb3VuZC1ibHVyJyB4PSctNTAlJyB5PSctNTAlJyB3aWR0aD0nMjAwJScgaGVpZ2h0PScyMDAlJz5cbiAgICAgICAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0nU291cmNlQWxwaGEnIHN0ZERldmlhdGlvbj0nMicgcmVzdWx0PSdibHVyJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlRmxvb2QgZmxvb2RDb2xvcj0ncmdiYSgzMywgNDUsIDQ5LCAuNSknIGZsb29kT3BhY2l0eT0nMC44JyByZXN1bHQ9J29mZnNldENvbG9yJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSdvZmZzZXRDb2xvcicgaW4yPSdibHVyJyBvcGVyYXRvcj0naW4nIHJlc3VsdD0ndG90YWxCbHVyJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlQmxlbmQgaW49J1NvdXJjZUdyYXBoaWMnIGluMj0ndG90YWxCbHVyJyBtb2RlPSdub3JtYWwnIC8+XG4gICAgICAgICAgICAgICAgPC9maWx0ZXI+XG4gICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J2Z1bGwtYmFja2dyb3VuZCcgeD0nMCcgeT0nMCcgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0ndHJhbnNwYXJlbnQnIC8+XG4gICAgICAgICAgICAgIDxyZWN0IGlkPSdtb3VudC1iYWNrZ3JvdW5kLWJsdXInIGZpbHRlcj0ndXJsKCNiYWNrZ3JvdW5kLWJsdXIpJyB4PXt0aGlzLnN0YXRlLm1vdW50WH0geT17dGhpcy5zdGF0ZS5tb3VudFl9IHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGh9IGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodH0gZmlsbD0nd2hpdGUnIC8+XG4gICAgICAgICAgICAgIDxyZWN0IGlkPSdtb3VudC1iYWNrZ3JvdW5kJyB4PXt0aGlzLnN0YXRlLm1vdW50WH0geT17dGhpcy5zdGF0ZS5tb3VudFl9IHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGh9IGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodH0gZmlsbD0nd2hpdGUnIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogPGRpdlxuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtYmFja2dyb3VuZC1wcmV2aWV3J1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHRcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtYmFja2dyb3VuZC1wcmV2aWV3LWJvcmRlcidcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZLFxuICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFgsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IGRvdHRlZCAjYmJiJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzJweCdcbiAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPC9kaXY+fVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLXRpdGxlLXRleHQtY29udGFpbmVyJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAsXG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSAtIDE5LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYICsgMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgICAgICAgICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2tTdGFnZU5hbWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e3RoaXMuaGFuZGxlTW91c2VPdmVyU3RhZ2VOYW1lLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9e3RoaXMuaGFuZGxlTW91c2VPdXRTdGFnZU5hbWUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgIDx0ZXh0XG4gICAgICAgICAgICAgICAgeT0nMTMnXG4gICAgICAgICAgICAgICAgaWQ9J3Byb2plY3QtbmFtZSdcbiAgICAgICAgICAgICAgICBmaWxsPXtQYWxldHRlLkZBVEhFUl9DT0FMfVxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9J2xpZ2h0ZXInXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseT0nRmlyYSBTYW5zJ1xuICAgICAgICAgICAgICAgIGZvbnRTaXplPScxMyc+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMucHJvamVjdE5hbWV9XG4gICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1iYWNrZ3JvdW5kLWNvbG9yYXRvcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDIwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8cGF0aCBkPXtgTTAsMFYke3RoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0fUgke3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9VjBaTSR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9LCR7dGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fUgke3RoaXMuc3RhdGUubW91bnRYfVYke3RoaXMuc3RhdGUubW91bnRZfUgke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofVpgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7J2ZpbGwnOiAnIzExMScsICdvcGFjaXR5JzogMC4xLCAncG9pbnRlckV2ZW50cyc6ICdub25lJ319IC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3MtbW9hdC1vcGFjaXRhdG9yJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAxMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHBhdGggZD17YE0wLDBWJHt0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodH1IJHt0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRofVYwWk0ke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofSwke3RoaXMuc3RhdGUubW91bnRZICsgdGhpcy5zdGF0ZS5tb3VudEhlaWdodH1IJHt0aGlzLnN0YXRlLm1vdW50WH1WJHt0aGlzLnN0YXRlLm1vdW50WX1IJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH1aYH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgJ2ZpbGwnOiAnI0ZGRicsXG4gICAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgICAgICAgICAgICdwb2ludGVyRXZlbnRzJzogJ25vbmUnXG4gICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAgICB4PXt0aGlzLnN0YXRlLm1vdW50WCAtIDF9XG4gICAgICAgICAgICAgICAgeT17dGhpcy5zdGF0ZS5tb3VudFkgLSAxfVxuICAgICAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGggKyAyfVxuICAgICAgICAgICAgICAgIGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodCArIDJ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxLjUsXG4gICAgICAgICAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBzdHJva2U6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHRoaXMuc3RhdGUuaXNTdGFnZU5hbWVIb3ZlcmluZyAmJiAhdGhpcy5zdGF0ZS5pc1N0YWdlU2VsZWN0ZWQgPyAwLjc1IDogMFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpICYmIHRoaXMuc3RhdGUuZG9TaG93Q29tbWVudHMgJiYgdGhpcy5zdGF0ZS5jb21tZW50cy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1jb21tZW50cy1jb250YWluZXInXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMjAwMCxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuY29tbWVudHMubWFwKChjb21tZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiA8Q29tbWVudCBpbmRleD17aW5kZXh9IGNvbW1lbnQ9e2NvbW1lbnR9IGtleT17YGNvbW1lbnQtJHtjb21tZW50LmlkfWB9IG1vZGVsPXt0aGlzLl9jb21tZW50c30gLz5cbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSAmJiB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbilcbiAgICAgICAgICAgID8gPEV2ZW50SGFuZGxlckVkaXRvclxuICAgICAgICAgICAgICByZWY9J2V2ZW50SGFuZGxlckVkaXRvcidcbiAgICAgICAgICAgICAgZWxlbWVudD17dGhpcy5zdGF0ZS50YXJnZXRFbGVtZW50fVxuICAgICAgICAgICAgICBzYXZlPXt0aGlzLnNhdmVFdmVudEhhbmRsZXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgY2xvc2U9e3RoaXMuaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHJlZj0nb3ZlcmxheSdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLW92ZXJsYXktbW91bnQnXG4gICAgICAgICAgICAgIGhlaWdodD17dGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHR9XG4gICAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRofVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ21hdHJpeDNkKDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDEpJyxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsIC8vIFRoaXMgbmVlZHMgdG8gYmUgdW4tc2V0IGZvciBzdXJmYWNlIGVsZW1lbnRzIHRoYXQgdGFrZSBtb3VzZSBpbnRlcmFjdGlvblxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbikgPyAwLjUgOiAxLjBcbiAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICByZWY9J21vdW50J1xuICAgICAgICAgICAgaWQ9J2hvdC1jb21wb25lbnQtbW91bnQnXG4gICAgICAgICAgICBjbGFzc05hbWU9e2RyYXdpbmdDbGFzc05hbWV9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFgsXG4gICAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodCxcbiAgICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgekluZGV4OiA2MCxcbiAgICAgICAgICAgICAgb3BhY2l0eTogKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSA/IDAuNSA6IDEuMFxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuR2xhc3MucHJvcFR5cGVzID0ge1xuICB1c2VyY29uZmlnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB3ZWJzb2NrZXQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oR2xhc3MpXG4iXX0=