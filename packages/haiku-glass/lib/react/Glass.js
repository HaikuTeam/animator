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

      function handleVirtualClipboard(clipboardAction, maybeClipboardEvent) {
        console.info('[glass] handling clipboard action', clipboardAction);

        // Avoid infinite loops due to the way we leverage execCommand
        if (this._clipboardActionLock) {
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

      document.addEventListener('cut', handleVirtualClipboard.bind(this, 'cut'));
      document.addEventListener('copy', handleVirtualClipboard.bind(this, 'copy'));

      // This fires when the context menu cut/copy action has been fired - not a keyboard action.
      // This fires with cut OR copy. In case of cut, the element has already been .cut()!
      this._component.on('element:copy', function (componentId) {
        console.info('[glass] element:copy', componentId);
        _this2._lastSelectedElement = _this2._component._elements.find(componentId);
        handleVirtualClipboard.call(_this2, 'copy');
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
            lineNumber: 1134
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
              lineNumber: 1138
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
              lineNumber: 1151
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
                lineNumber: 1197
              },
              __self: this
            },
            _react2.default.createElement(
              'defs',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1206
                },
                __self: this
              },
              _react2.default.createElement(
                'filter',
                { id: 'background-blur', x: '-50%', y: '-50%', width: '200%', height: '200%', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1207
                  },
                  __self: this
                },
                _react2.default.createElement('feGaussianBlur', { 'in': 'SourceAlpha', stdDeviation: '2', result: 'blur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1208
                  },
                  __self: this
                }),
                _react2.default.createElement('feFlood', { floodColor: 'rgba(33, 45, 49, .5)', floodOpacity: '0.8', result: 'offsetColor', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1209
                  },
                  __self: this
                }),
                _react2.default.createElement('feComposite', { 'in': 'offsetColor', in2: 'blur', operator: 'in', result: 'totalBlur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1210
                  },
                  __self: this
                }),
                _react2.default.createElement('feBlend', { 'in': 'SourceGraphic', in2: 'totalBlur', mode: 'normal', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1211
                  },
                  __self: this
                })
              )
            ),
            _react2.default.createElement('rect', { id: 'full-background', x: '0', y: '0', width: '100%', height: '100%', fill: 'transparent', __source: {
                fileName: _jsxFileName,
                lineNumber: 1214
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background-blur', filter: 'url(#background-blur)', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1215
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1216
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
                lineNumber: 1218
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
                lineNumber: 1227
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
                lineNumber: 1241
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
                  lineNumber: 1256
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
                lineNumber: 1269
              },
              __self: this
            },
            _react2.default.createElement('path', { d: 'M0,0V' + this.state.containerHeight + 'H' + this.state.containerWidth + 'V0ZM' + (this.state.mountX + this.state.mountWidth) + ',' + (this.state.mountY + this.state.mountHeight) + 'H' + this.state.mountX + 'V' + this.state.mountY + 'H' + (this.state.mountX + this.state.mountWidth) + 'Z',
              style: { 'fill': '#111', 'opacity': 0.1, 'pointerEvents': 'none' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1280
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
                lineNumber: 1286
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
                lineNumber: 1297
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
                lineNumber: 1303
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
                lineNumber: 1319
              },
              __self: this
            },
            this.state.comments.map(function (comment, index) {
              return _react2.default.createElement(_Comment2.default, { index: index, comment: comment, key: 'comment-' + comment.id, model: _this13._comments, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1332
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
              lineNumber: 1338
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
              lineNumber: 1347
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
              lineNumber: 1364
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9HbGFzcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2xpcGJvYXJkIiwiQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTIiwiR2xhc3MiLCJwcm9wcyIsInN0YXRlIiwiZXJyb3IiLCJtb3VudFdpZHRoIiwibW91bnRIZWlnaHQiLCJtb3VudFgiLCJtb3VudFkiLCJjb250cm9sQWN0aXZhdGlvbiIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwibW91c2VQb3NpdGlvblByZXZpb3VzIiwiaXNBbnl0aGluZ1NjYWxpbmciLCJpc0FueXRoaW5nUm90YXRpbmciLCJnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsImNvbnRhaW5lckhlaWdodCIsImNvbnRhaW5lcldpZHRoIiwiaXNTdGFnZVNlbGVjdGVkIiwiaXNTdGFnZU5hbWVIb3ZlcmluZyIsImlzTW91c2VEb3duIiwibGFzdE1vdXNlRG93blRpbWUiLCJsYXN0TW91c2VEb3duUG9zaXRpb24iLCJsYXN0TW91c2VVcFBvc2l0aW9uIiwibGFzdE1vdXNlVXBUaW1lIiwiaXNNb3VzZURyYWdnaW5nIiwiaXNLZXlTaGlmdERvd24iLCJpc0tleUN0cmxEb3duIiwiaXNLZXlBbHREb3duIiwiaXNLZXlDb21tYW5kRG93biIsImlzS2V5U3BhY2VEb3duIiwicGFuWCIsInBhblkiLCJvcmlnaW5hbFBhblgiLCJvcmlnaW5hbFBhblkiLCJ6b29tWFkiLCJjb21tZW50cyIsImRvU2hvd0NvbW1lbnRzIiwidGFyZ2V0RWxlbWVudCIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsImFjdGl2ZURyYXdpbmdUb29sIiwiZHJhd2luZ0lzTW9kYWwiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJ3aW5kb3ciLCJlbnZveSIsIldlYlNvY2tldCIsInNldFN0YWdlVHJhbnNmb3JtIiwiem9vbSIsInBhbiIsIngiLCJ5IiwiX2NvbW1lbnRzIiwiX2N0eG1lbnUiLCJfcGxheWluZyIsIl9zdG9wd2F0Y2giLCJfbGFzdEF1dGhvcml0YXRpdmVGcmFtZSIsIl9sYXN0U2VsZWN0ZWRFbGVtZW50IiwiX2NsaXBib2FyZEFjdGlvbkxvY2siLCJkcmF3TG9vcCIsImJpbmQiLCJkcmF3IiwiX2hhaWt1UmVuZGVyZXIiLCJfaGFpa3VDb250ZXh0IiwidGltZWxpbmVzIiwidGVtcGxhdGUiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJjaGlsZHJlbiIsIm9wdGlvbnMiLCJjYWNoZSIsInNlZWQiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwicmVzZXRDb250YWluZXJEaW1lbnNpb25zIiwiZ2xhc3MiLCJvbiIsInRpbWVsaW5lQ2hhbm5lbCIsImhhbmRsZVRpbWVsaW5lRGlkUGxheSIsImhhbmRsZVRpbWVsaW5lRGlkUGF1c2UiLCJoYW5kbGVUaW1lbGluZURpZFNlZWsiLCJjbGllbnQiLCJ0b3VyQ2xpZW50IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNlbGVjdG9yIiwid2VidmlldyIsImVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJ0b3AiLCJsZWZ0IiwicmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcyIsImNvbnNvbGUiLCJEYXRlIiwibm93IiwiZnJhbWVEYXRhIiwiZnJhbWUiLCJmb3JjZVNlZWsiLCJzZWVrTXMiLCJmcHMiLCJiYXNlTXMiLCJkZWx0YU1zIiwiTWF0aCIsInJvdW5kIiwiX3NldFRpbWVsaW5lVGltZVZhbHVlIiwicmVmcyIsIm92ZXJsYXkiLCJkcmF3T3ZlcmxheXMiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3VudEFwcGxpY2F0aW9uIiwibW91bnQiLCJmcmVlemUiLCJvdmVyZmxvd1giLCJvdmVyZmxvd1kiLCJjb250ZXh0TWVudSIsIm5ld01vdW50U2l6ZSIsImdldENvbnRleHRTaXplIiwic2V0U3RhdGUiLCJ3aWR0aCIsImhlaWdodCIsInVwZGF0ZWRBcnRib2FyZFNpemUiLCJ0aW1lbGluZU5hbWUiLCJ0aW1lbGluZVRpbWUiLCJnZXRNb3VudCIsImlzUmVsb2FkaW5nQ29kZSIsInBhc3RlRXZlbnQiLCJpbmZvIiwicHJldmVudERlZmF1bHQiLCJzZW5kIiwidHlwZSIsIm5hbWUiLCJmcm9tIiwiZGF0YSIsImhhbmRsZVZpcnR1YWxDbGlwYm9hcmQiLCJjbGlwYm9hcmRBY3Rpb24iLCJtYXliZUNsaXBib2FyZEV2ZW50IiwiY2xpcGJvYXJkUGF5bG9hZCIsImdldENsaXBib2FyZFBheWxvYWQiLCJjdXQiLCJzZXJpYWxpemVkUGF5bG9hZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3cml0ZVRleHQiLCJjb21wb25lbnRJZCIsIl9lbGVtZW50cyIsImZpbmQiLCJjYWxsIiwibWVzc2FnZSIsIm9sZFRyYW5zZm9ybSIsIm1vZHVsZVJlcGxhY2UiLCJlcnIiLCJnZXRTdGFnZVRyYW5zZm9ybSIsInBhcmFtcyIsIm1ldGhvZCIsImNiIiwiY2FsbE1ldGhvZCIsImxvYWQiLCJhY3Rpb24iLCJldmVudCIsImJ1aWxkIiwiX21lbnUiLCJsYXN0WCIsImxhc3RZIiwicmVidWlsZCIsInNob3dFdmVudEhhbmRsZXJzRWRpdG9yIiwidGhyb3R0bGUiLCJoYW5kbGVXaW5kb3dSZXNpemUiLCJ3aW5kb3dNb3VzZVVwSGFuZGxlciIsIndpbmRvd01vdXNlTW92ZUhhbmRsZXIiLCJ3aW5kb3dNb3VzZURvd25IYW5kbGVyIiwid2luZG93Q2xpY2tIYW5kbGVyIiwid2luZG93RGJsQ2xpY2tIYW5kbGVyIiwid2luZG93S2V5RG93bkhhbmRsZXIiLCJ3aW5kb3dLZXlVcEhhbmRsZXIiLCJ3aW5kb3dNb3VzZU91dEhhbmRsZXIiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJjbGlja0V2ZW50IiwiZXZlbnROYW1lIiwiaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkIiwic2VsZWN0b3JOYW1lIiwidWlkIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiZHgiLCJkeSIsIm5hdGl2ZUV2ZW50IiwiaXNQcmV2aWV3TW9kZSIsInNvdXJjZSIsInJlbGF0ZWRUYXJnZXQiLCJ0b0VsZW1lbnQiLCJub2RlTmFtZSIsImhvdmVyZWQiLCJkZXF1ZXVlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImhhbmRsZU1vdXNlRG93biIsImhhbmRsZUNsaWNrIiwiaGFuZGxlRG91YmxlQ2xpY2siLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlS2V5VXAiLCJtb3VzZWRvd25FdmVudCIsImJ1dHRvbiIsIm1vdXNlUG9zIiwic3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIiwiaW5zdGFudGlhdGVDb21wb25lbnQiLCJtaW5pbWl6ZWQiLCJtZXRhZGF0YSIsImluZGV4IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInBhcmVudE5vZGUiLCJ1bnNlbGVjdEFsbEVsZW1lbnRzIiwiaGFpa3VJZCIsImNvbnRhaW5lZCIsIndoZXJlIiwiaXNTZWxlY3RlZCIsInNlbGVjdEVsZW1lbnQiLCJtb3VzZXVwRXZlbnQiLCJoYW5kbGVEcmFnU3RvcCIsImRvdWJsZUNsaWNrRXZlbnQiLCJpc0Rvd24iLCJrZXlFdmVudCIsImRlbHRhIiwic2hpZnRLZXkiLCJmb3JFYWNoIiwibW92ZSIsImV2ZW50SGFuZGxlckVkaXRvciIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsIndoaWNoIiwiaGFuZGxlS2V5RXNjYXBlIiwiaGFuZGxlS2V5U3BhY2UiLCJoYW5kbGVLZXlMZWZ0QXJyb3ciLCJoYW5kbGVLZXlVcEFycm93IiwiaGFuZGxlS2V5UmlnaHRBcnJvdyIsImhhbmRsZUtleURvd25BcnJvdyIsImhhbmRsZUtleURlbGV0ZSIsImhhbmRsZUtleUVudGVyIiwiaGFuZGxlS2V5U2hpZnQiLCJoYW5kbGVLZXlDdHJsIiwiaGFuZGxlS2V5QWx0IiwiaGFuZGxlS2V5Q29tbWFuZCIsImNtZCIsInNoaWZ0IiwiY3RybCIsImFsdCIsImFydGJvYXJkIiwiZmluZFJvb3RzIiwiY2xpY2tlZCIsImFkZCIsInNlbGVjdCIsIm1vdXNlbW92ZUV2ZW50IiwiaGFuZGxlRHJhZ1N0YXJ0Iiwic3RhZ2VNb3VzZURvd24iLCJwZXJmb3JtUGFuIiwiY2xpZW50WCIsImNsaWVudFkiLCJzZWxlY3RlZCIsImxlbmd0aCIsImRyYWciLCJyZW1vdmUiLCJjb250YWluZXIiLCJ3IiwiY2xpZW50V2lkdGgiLCJoIiwiY2xpZW50SGVpZ2h0IiwicmlnaHQiLCJib3R0b20iLCJnZXRBcnRib2FyZFJlY3QiLCJhY3RpdmF0aW9uSW5mbyIsImFyYm9hcmQiLCJjb29yZHMiLCJtb3VzZUV2ZW50IiwiYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZSIsImZvcmNlIiwiYWxsIiwiY3JlYXRlQ29udGFpbmVyIiwicGFydHMiLCJidWlsZERyYXduT3ZlcmxheXMiLCJpZCIsInN0eWxlIiwidHJhbnNmb3JtIiwicG9zaXRpb24iLCJvdmVyZmxvdyIsImNvbXBvbmVudCIsIl9yZWdpc3RlcmVkRWxlbWVudEV2ZW50TGlzdGVuZXJzIiwicmVuZGVyIiwib3ZlcmxheXMiLCJwb2ludHMiLCJpc1JlbmRlcmFibGVUeXBlIiwiZ2V0UG9pbnRzVHJhbnNmb3JtZWQiLCJyZW5kZXJNb3JwaFBvaW50c092ZXJsYXkiLCJnZXRCb3hQb2ludHNUcmFuc2Zvcm1lZCIsInJvdGF0aW9uWiIsImdldFByb3BlcnR5VmFsdWUiLCJzY2FsZVgiLCJ1bmRlZmluZWQiLCJzY2FsZVkiLCJyZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5IiwiY2FuUm90YXRlIiwicG9pbnQiLCJwdXNoIiwiZ2V0Qm91bmRpbmdCb3hQb2ludHMiLCJyZW5kZXJDb250cm9sUG9pbnQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInN0cm9rZSIsIkRBUktFUl9ST0NLMiIsInBvaW50SW5kZXgiLCJfY29udHJvbFBvaW50TGlzdGVuZXJzIiwiY29udHJvbEtleSIsImxpc3RlbmVyRXZlbnQiLCJoYW5kbGVDbGFzcyIsInNjYWxlIiwia2V5IiwiY2xhc3MiLCJvbm1vdXNlZG93biIsImNyZWF0ZUNvbnRyb2xQb2ludExpc3RlbmVyIiwicG9pbnRlckV2ZW50cyIsImJvcmRlciIsImJhY2tncm91bmRDb2xvciIsIlJPQ0siLCJib3hTaGFkb3ciLCJTSEFEWSIsImJvcmRlclJhZGl1cyIsImlzUm90YXRpb25Nb2RlT24iLCJkZWZhdWx0UG9pbnRHcm91cCIsImluZGV4T2ZQb2ludCIsImtleU9mUG9pbnRHcm91cCIsIkVycm9yIiwic3BlY2lmaWVkUG9pbnRHcm91cCIsInJvdGF0aW9uRGVncmVlcyIsImdldFJvdGF0aW9uSW4zNjAiLCJwaGFzZU51bWJlciIsIm9mZnNldEluZGV4Iiwic2hpZnRlZEluZGV4IiwiY2FuQ29udHJvbEhhbmRsZXMiLCJjb3JuZXJzIiwibmV4dCIsInJlbmRlckxpbmUiLCJnZXRIYW5kbGVDbGFzcyIsImNvbnRyb2xJbmRleCIsInNlbGVjdGVkRWxlbWVudHMiLCJzZWxlY3RlZEVsZW1lbnQiLCJhIiwiYyIsImQiLCJqb2luIiwiX2ludGVyYWN0aW9uTW9kZSIsImRyYXdpbmdDbGFzc05hbWUiLCJ6SW5kZXgiLCJjb2xvciIsImZvbnRTaXplIiwiZ2V0R2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3MiLCJtb3VzZURvd24iLCJoaWRlRXZlbnRIYW5kbGVyc0VkaXRvciIsImN1cnNvciIsImdldEN1cnNvckNzc1J1bGUiLCJ1c2VyU2VsZWN0IiwiaGFuZGxlQ2xpY2tTdGFnZU5hbWUiLCJoYW5kbGVNb3VzZU92ZXJTdGFnZU5hbWUiLCJoYW5kbGVNb3VzZU91dFN0YWdlTmFtZSIsIkZBVEhFUl9DT0FMIiwicHJvamVjdE5hbWUiLCJzdHJva2VXaWR0aCIsImZpbGwiLCJMSUdIVF9QSU5LIiwib3BhY2l0eSIsIm1hcCIsImNvbW1lbnQiLCJzYXZlRXZlbnRIYW5kbGVyIiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwi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QXhDLEdBQThDO0FBUmxELGFBSlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBck5GO0FBakJGLE9BREY7QUF3UEQ7Ozs7RUF6MEN3QixnQkFBTXFWLFM7O0FBNDBDakMxWCxNQUFNMlgsU0FBTixHQUFrQjtBQUNoQmhWLGNBQVksZ0JBQU1pVixTQUFOLENBQWdCQyxNQURaO0FBRWhCalYsYUFBVyxnQkFBTWdWLFNBQU4sQ0FBZ0JDLE1BRlg7QUFHaEJuVixVQUFRLGdCQUFNa1YsU0FBTixDQUFnQkU7QUFIUixDQUFsQjs7a0JBTWUsc0JBQU85WCxLQUFQLEMiLCJmaWxlIjoiR2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IEhhaWt1RE9NUmVuZGVyZXIgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVuZGVyZXJzL2RvbSdcbmltcG9ydCBIYWlrdUNvbnRleHQgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvSGFpa3VDb250ZXh0J1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgQ29tbWVudCBmcm9tICcuL0NvbW1lbnQnXG5pbXBvcnQgRXZlbnRIYW5kbGVyRWRpdG9yIGZyb20gJy4vRXZlbnRIYW5kbGVyRWRpdG9yJ1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vbW9kZWxzL0NvbW1lbnRzJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vbW9kZWxzL0NvbnRleHRNZW51J1xuaW1wb3J0IGdldExvY2FsRG9tRXZlbnRQb3NpdGlvbiBmcm9tICcuL2hlbHBlcnMvZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uJ1xuaW1wb3J0IHtcbiAgbGlua0V4dGVybmFsQXNzZXRzT25Ecm9wLFxuICBwcmV2ZW50RGVmYXVsdERyYWdcbn0gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvZG5kSGVscGVycydcblxuY29uc3QgeyBjbGlwYm9hcmQgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcblxuY29uc3QgQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTID0ge1xuICAwOiBbMCwgMSwgMiwgNSwgOCwgNywgNiwgM10sXG4gIDE6IFs2LCA3LCA4LCA1LCAyLCAxLCAwLCAzXSwgLy8gZmxpcHBlZCB2ZXJ0aWNhbFxuICAyOiBbMiwgMSwgMCwgMywgNiwgNywgOCwgNV0sIC8vIGZsaXBwZWQgaG9yaXpvbnRhbFxuICAzOiBbOCwgNywgNiwgMywgMCwgMSwgMiwgNV0gLy8gZmxpcHBlZCBob3Jpem9udGFsICsgdmVydGljYWxcbn1cblxuLy8gVGhlIGNsYXNzIGlzIGV4cG9ydGVkIGFsc28gX3dpdGhvdXRfIHRoZSByYWRpdW0gd3JhcHBlciB0byBhbGxvdyBqc2RvbSB0ZXN0aW5nXG5leHBvcnQgY2xhc3MgR2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIG1vdW50V2lkdGg6IDU1MCxcbiAgICAgIG1vdW50SGVpZ2h0OiA0MDAsXG4gICAgICBtb3VudFg6IDAsXG4gICAgICBtb3VudFk6IDAsXG4gICAgICBjb250cm9sQWN0aXZhdGlvbjogbnVsbCxcbiAgICAgIG1vdXNlUG9zaXRpb25DdXJyZW50OiBudWxsLFxuICAgICAgbW91c2VQb3NpdGlvblByZXZpb3VzOiBudWxsLFxuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIGdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzOiAnJyxcbiAgICAgIGNvbnRhaW5lckhlaWdodDogMCxcbiAgICAgIGNvbnRhaW5lcldpZHRoOiAwLFxuICAgICAgaXNTdGFnZVNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIGlzU3RhZ2VOYW1lSG92ZXJpbmc6IGZhbHNlLFxuICAgICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgICAgbGFzdE1vdXNlRG93blRpbWU6IG51bGwsXG4gICAgICBsYXN0TW91c2VEb3duUG9zaXRpb246IG51bGwsXG4gICAgICBsYXN0TW91c2VVcFBvc2l0aW9uOiBudWxsLFxuICAgICAgbGFzdE1vdXNlVXBUaW1lOiBudWxsLFxuICAgICAgaXNNb3VzZURyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGlzS2V5U2hpZnREb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5Q3RybERvd246IGZhbHNlLFxuICAgICAgaXNLZXlBbHREb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5Q29tbWFuZERvd246IGZhbHNlLFxuICAgICAgaXNLZXlTcGFjZURvd246IGZhbHNlLFxuICAgICAgcGFuWDogMCxcbiAgICAgIHBhblk6IDAsXG4gICAgICBvcmlnaW5hbFBhblg6IDAsXG4gICAgICBvcmlnaW5hbFBhblk6IDAsXG4gICAgICB6b29tWFk6IDEsXG4gICAgICBjb21tZW50czogW10sXG4gICAgICBkb1Nob3dDb21tZW50czogZmFsc2UsXG4gICAgICB0YXJnZXRFbGVtZW50OiBudWxsLFxuICAgICAgaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuOiBmYWxzZSxcbiAgICAgIGFjdGl2ZURyYXdpbmdUb29sOiAncG9pbnRlcicsXG4gICAgICBkcmF3aW5nSXNNb2RhbDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICdnbGFzcycsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0oe3pvb206IHRoaXMuc3RhdGUuem9vbVhZLCBwYW46IHt4OiB0aGlzLnN0YXRlLnBhblgsIHk6IHRoaXMuc3RhdGUucGFuWX19KVxuICAgIHRoaXMuX2NvbW1lbnRzID0gbmV3IENvbW1lbnRzKHRoaXMucHJvcHMuZm9sZGVyKVxuICAgIHRoaXMuX2N0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5fcGxheWluZyA9IGZhbHNlXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gbnVsbFxuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSAwXG5cbiAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gbnVsbFxuICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSBmYWxzZVxuXG4gICAgdGhpcy5kcmF3TG9vcCA9IHRoaXMuZHJhd0xvb3AuYmluZCh0aGlzKVxuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpXG4gICAgdGhpcy5faGFpa3VSZW5kZXJlciA9IG5ldyBIYWlrdURPTVJlbmRlcmVyKClcbiAgICB0aGlzLl9oYWlrdUNvbnRleHQgPSBuZXcgSGFpa3VDb250ZXh0KG51bGwsIHRoaXMuX2hhaWt1UmVuZGVyZXIsIHt9LCB7IHRpbWVsaW5lczoge30sIHRlbXBsYXRlOiB7IGVsZW1lbnROYW1lOiAnZGl2JywgYXR0cmlidXRlczoge30sIGNoaWxkcmVuOiBbXSB9IH0sIHsgb3B0aW9uczogeyBjYWNoZToge30sIHNlZWQ6ICdhYmNkZScgfSB9KVxuXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcblxuICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcblxuICAgIHdpbmRvdy5nbGFzcyA9IHRoaXNcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dGltZWxpbmVDbGllbnRSZWFkeScsICh0aW1lbGluZUNoYW5uZWwpID0+IHtcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkUGxheScsIHRoaXMuaGFuZGxlVGltZWxpbmVEaWRQbGF5LmJpbmQodGhpcykpXG4gICAgICB0aW1lbGluZUNoYW5uZWwub24oJ2RpZFBhdXNlJywgdGhpcy5oYW5kbGVUaW1lbGluZURpZFBhdXNlLmJpbmQodGhpcykpXG4gICAgICB0aW1lbGluZUNoYW5uZWwub24oJ2RpZFNlZWsnLCB0aGlzLmhhbmRsZVRpbWVsaW5lRGlkU2Vlay5iaW5kKHRoaXMpKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgICAgdGhpcy50b3VyQ2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIHByZXZlbnREZWZhdWx0RHJhZywgZmFsc2UpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCBsaW5rRXh0ZXJuYWxBc3NldHNPbkRyb3AuYmluZCh0aGlzKSwgZmFsc2UpXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ2dsYXNzJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCdnbGFzcycsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVGltZWxpbmVEaWRQbGF5ICgpIHtcbiAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZVxuICAgIHRoaXMuX3N0b3B3YXRjaCA9IERhdGUubm93KClcbiAgfVxuXG4gIGhhbmRsZVRpbWVsaW5lRGlkUGF1c2UgKGZyYW1lRGF0YSkge1xuICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZVxuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSBmcmFtZURhdGEuZnJhbWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gIH1cblxuICBoYW5kbGVUaW1lbGluZURpZFNlZWsgKGZyYW1lRGF0YSkge1xuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSBmcmFtZURhdGEuZnJhbWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gICAgdGhpcy5kcmF3KHRydWUpXG4gIH1cblxuICBkcmF3IChmb3JjZVNlZWspIHtcbiAgICBpZiAodGhpcy5fcGxheWluZyB8fCBmb3JjZVNlZWspIHtcbiAgICAgIHZhciBzZWVrTXMgPSAwXG4gICAgICAvLyB0aGlzLl9zdG9wd2F0Y2ggaXMgbnVsbCB1bmxlc3Mgd2UndmUgcmVjZWl2ZWQgYW4gYWN0aW9uIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgICAgLy8gSWYgd2UncmUgZGV2ZWxvcGluZyB0aGUgZ2xhc3Mgc29sbywgaS5lLiB3aXRob3V0IGEgY29ubmVjdGlvbiB0byBlbnZveSB3aGljaFxuICAgICAgLy8gcHJvdmlkZXMgdGhlIHN5c3RlbSBjbG9jaywgd2UgY2FuIGp1c3QgbG9jayB0aGUgdGltZSB2YWx1ZSB0byB6ZXJvIGFzIGEgaGFjay5cbiAgICAgIC8vIFRPRE86IFdvdWxkIGJlIG5pY2UgdG8gYWxsb3cgZnVsbC1mbGVkZ2VkIHNvbG8gZGV2ZWxvcG1lbnQgb2YgZ2xhc3MuLi5cbiAgICAgIGlmICh0aGlzLl9zdG9wd2F0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZwcyA9IDYwIC8vIFRPRE86ICBzdXBwb3J0IHZhcmlhYmxlXG4gICAgICAgIHZhciBiYXNlTXMgPSB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lICogMTAwMCAvIGZwc1xuICAgICAgICB2YXIgZGVsdGFNcyA9IHRoaXMuX3BsYXlpbmcgPyBEYXRlLm5vdygpIC0gdGhpcy5fc3RvcHdhdGNoIDogMFxuICAgICAgICBzZWVrTXMgPSBiYXNlTXMgKyBkZWx0YU1zXG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgcm91bmRpbmcgaXMgcmVxdWlyZWQgb3RoZXJ3aXNlIHdlJ2xsIHNlZSBiaXphcnJlIGJlaGF2aW9yIG9uIHN0YWdlLlxuICAgICAgLy8gSSB0aGluayBpdCdzIGJlY2F1c2Ugc29tZSBwYXJ0IG9mIHRoZSBwbGF5ZXIncyBjYWNoaW5nIG9yIHRyYW5zaXRpb24gbG9naWNcbiAgICAgIC8vIHdoaWNoIHdhbnRzIHRoaW5ncyB0byBiZSByb3VuZCBudW1iZXJzLiBJZiB3ZSBkb24ndCByb3VuZCB0aGlzLCBpLmUuIGNvbnZlcnRcbiAgICAgIC8vIDE2LjY2NiAtPiAxNyBhbmQgMzMuMzMzIC0+IDMzLCB0aGVuIHRoZSBwbGF5ZXIgd29uJ3QgcmVuZGVyIHRob3NlIGZyYW1lcyxcbiAgICAgIC8vIHdoaWNoIG1lYW5zIHRoZSB1c2VyIHdpbGwgaGF2ZSB0cm91YmxlIG1vdmluZyB0aGluZ3Mgb24gc3RhZ2UgYXQgdGhvc2UgdGltZXMuXG4gICAgICBzZWVrTXMgPSBNYXRoLnJvdW5kKHNlZWtNcylcblxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9zZXRUaW1lbGluZVRpbWVWYWx1ZShzZWVrTXMsIGZvcmNlU2VlaylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZzLm92ZXJsYXkpIHtcbiAgICAgIHRoaXMuZHJhd092ZXJsYXlzKGZvcmNlU2VlaylcbiAgICB9XG4gIH1cblxuICBkcmF3TG9vcCAoKSB7XG4gICAgdGhpcy5kcmF3KClcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhd0xvb3ApXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24odGhpcy5yZWZzLm1vdW50LCB7IG9wdGlvbnM6IHsgZnJlZXplOiB0cnVlLCBvdmVyZmxvd1g6ICd2aXNpYmxlJywgb3ZlcmZsb3dZOiAndmlzaWJsZScsIGNvbnRleHRNZW51OiAnZGlzYWJsZWQnIH0gfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgbmV3TW91bnRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdW50V2lkdGg6IG5ld01vdW50U2l6ZS53aWR0aCxcbiAgICAgICAgbW91bnRIZWlnaHQ6IG5ld01vdW50U2l6ZS5oZWlnaHRcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZHJhd0xvb3AoKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5kcmF3KHRydWUpXG5cbiAgICAgIC8vIFRoaXMgaGFwcGVucyBvbiBhbG1vc3QgYW55IHVwZGF0ZSBiZWNhdXNlIHRoZW9yZXRpY2FsbHkgYSBrZXlmcmFtZSBjaGFuZ2UsXG4gICAgICAvLyBhIGN1cnZlIGNoYW5nZSwgZXRjLiwgY291bGQgYWxsIHJlc3VsdCBpbiB0aGUgbmVlZCB0byByZWNhbGMgdGhlIGFydGJvYXJkIDovXG4gICAgICB2YXIgdXBkYXRlZEFydGJvYXJkU2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91bnRXaWR0aDogdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCxcbiAgICAgICAgbW91bnRIZWlnaHQ6IHVwZGF0ZWRBcnRib2FyZFNpemUuaGVpZ2h0XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ3RpbWU6Y2hhbmdlJywgKHRpbWVsaW5lTmFtZSwgdGltZWxpbmVUaW1lKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29tcG9uZW50ICYmIHRoaXMuX2NvbXBvbmVudC5nZXRNb3VudCgpICYmICF0aGlzLl9jb21wb25lbnQuaXNSZWxvYWRpbmdDb2RlKSB7XG4gICAgICAgIHZhciB1cGRhdGVkQXJ0Ym9hcmRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcbiAgICAgICAgaWYgKHVwZGF0ZWRBcnRib2FyZFNpemUgJiYgdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCAmJiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgbW91bnRXaWR0aDogdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCxcbiAgICAgICAgICAgIG1vdW50SGVpZ2h0OiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gUGFzdGVhYmxlIHRoaW5ncyBhcmUgc3RvcmVkIGF0IHRoZSBnbG9iYWwgbGV2ZWwgaW4gdGhlIGNsaXBib2FyZCBidXQgd2UgbmVlZCB0aGF0IGFjdGlvbiB0byBmaXJlIGZyb20gdGhlIHRvcCBsZXZlbFxuICAgIC8vIHNvIHRoYXQgYWxsIHRoZSB2aWV3cyBnZXQgdGhlIG1lc3NhZ2UsIHNvIHdlIGVtaXQgdGhpcyBhcyBhbiBldmVudCBhbmQgdGhlbiB3YWl0IGZvciB0aGUgY2FsbCB0byBwYXN0ZVRoaW5nXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIHBhc3RlIGhlYXJkJylcbiAgICAgIC8vIE5vdGlmeSBjcmVhdG9yIHRoYXQgd2UgaGF2ZSBzb21lIGNvbnRlbnQgdGhhdCB0aGUgcGVyc29uIHdpc2hlcyB0byBwYXN0ZSBvbiB0aGUgc3RhZ2U7XG4gICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgZGF0YTogbnVsbCAvLyBUaGlzIGNhbiBob2xkIGNvb3JkaW5hdGVzIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIHBhc3RlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkIChjbGlwYm9hcmRBY3Rpb24sIG1heWJlQ2xpcGJvYXJkRXZlbnQpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBoYW5kbGluZyBjbGlwYm9hcmQgYWN0aW9uJywgY2xpcGJvYXJkQWN0aW9uKVxuXG4gICAgICAvLyBBdm9pZCBpbmZpbml0ZSBsb29wcyBkdWUgdG8gdGhlIHdheSB3ZSBsZXZlcmFnZSBleGVjQ29tbWFuZFxuICAgICAgaWYgKHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2spIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSB0cnVlXG5cbiAgICAgIGlmICh0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgIC8vIEdvdHRhIGdyYWIgX2JlZm9yZSBjdXR0aW5nXyBvciB3ZSdsbCBlbmQgdXAgd2l0aCBhIHBhcnRpYWwgb2JqZWN0IHRoYXQgd29uJ3Qgd29ya1xuICAgICAgICBsZXQgY2xpcGJvYXJkUGF5bG9hZCA9IHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQuZ2V0Q2xpcGJvYXJkUGF5bG9hZCgnZ2xhc3MnKVxuXG4gICAgICAgIGlmIChjbGlwYm9hcmRBY3Rpb24gPT09ICdjdXQnKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudC5jdXQoKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRQYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoWydhcHBsaWNhdGlvbi9oYWlrdScsIGNsaXBib2FyZFBheWxvYWRdKVxuXG4gICAgICAgIGNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplZFBheWxvYWQpXG5cbiAgICAgICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjdXQnLCBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkLmJpbmQodGhpcywgJ2N1dCcpKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkLmJpbmQodGhpcywgJ2NvcHknKSlcblxuICAgIC8vIFRoaXMgZmlyZXMgd2hlbiB0aGUgY29udGV4dCBtZW51IGN1dC9jb3B5IGFjdGlvbiBoYXMgYmVlbiBmaXJlZCAtIG5vdCBhIGtleWJvYXJkIGFjdGlvbi5cbiAgICAvLyBUaGlzIGZpcmVzIHdpdGggY3V0IE9SIGNvcHkuIEluIGNhc2Ugb2YgY3V0LCB0aGUgZWxlbWVudCBoYXMgYWxyZWFkeSBiZWVuIC5jdXQoKSFcbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6Y29weScsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6Y29weScsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZChjb21wb25lbnRJZClcbiAgICAgIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQuY2FsbCh0aGlzLCAnY29weScpXG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHRoZSBjdXJyZW50IHNlbGVjdGVkIGVsZW1lbnQgY2FuIGJlIGRlbGV0ZWQgZnJvbSB0aGUgZ2xvYmFsIG1lbnUsIHdlIG5lZWQgdG8ga2VlcCBpdCB0aGVyZVxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6c2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmQoY29tcG9uZW50SWQpXG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHRoZSBjdXJyZW50IHNlbGVjdGVkIGVsZW1lbnQgY2FuIGJlIGRlbGV0ZWQgZnJvbSB0aGUgZ2xvYmFsIG1lbnUsIHdlIG5lZWQgY2xlYXIgaXQgdGhlcmUgdG9vXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnVuc2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBlbGVtZW50OnVuc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSBudWxsXG4gICAgICB0aGlzLmRyYXcodHJ1ZSlcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICB2YXIgb2xkVHJhbnNmb3JtIC8vIERlZmluZWQgYmVsb3cgLy8gbGludGVyXG5cbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOlxuICAgICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQubW9kdWxlUmVwbGFjZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAvLyBOb3RpZnkgdGhlIHBsdW1iaW5nIHRoYXQgdGhlIG1vZHVsZSByZXBsYWNlbWVudCBoZXJlIGhhcyBmaW5pc2hlZCwgd2hpY2ggc2hvdWxkIHJlYWN0aXZhdGVcbiAgICAgICAgICAgIC8vIHRoZSB1bmRvL3JlZG8gcXVldWVzIHdoaWNoIHNob3VsZCBiZSB3YWl0aW5nIGZvciB0aGlzIHRvIGZpbmlzaFxuICAgICAgICAgICAgLy8gTm90ZSBob3cgd2UgZG8gdGhpcyB3aGV0aGVyIG9yIG5vdCB3ZSBnb3QgYW4gZXJyb3IgZnJvbSB0aGUgYWN0aW9uXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb21wb25lbnQ6cmVsb2FkOmNvbXBsZXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogJ2dsYXNzJ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhcnRib2FyZCBzaXplIG1heSBoYXZlIGNoYW5nZWQgYXMgYSBwYXJ0IG9mIHRoYXQsIGFuZCBzaW5jZSB0aGVyZSBhcmUgdHdvIHNvdXJjZXMgb2ZcbiAgICAgICAgICAgIC8vIHRydXRoIGZvciB0aGlzIChhY3R1YWwgYXJ0Ym9hcmQsIFJlYWN0IG1vdW50IGZvciBhcnRib2FyZCksIHdlIGhhdmUgdG8gdXBkYXRlIGl0IGhlcmUuXG4gICAgICAgICAgICB2YXIgdXBkYXRlZEFydGJvYXJkU2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgbW91bnRXaWR0aDogdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCxcbiAgICAgICAgICAgICAgbW91bnRIZWlnaHQ6IHVwZGF0ZWRBcnRib2FyZFNpemUuaGVpZ2h0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgY2FzZSAndmlldzp6b29tLWluJzpcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgICAgICAgIG9sZFRyYW5zZm9ybS56b29tID0gdGhpcy5zdGF0ZS56b29tWFkgKiAxLjI1XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHpvb21YWTogdGhpcy5zdGF0ZS56b29tWFkgKiAxLjI1IH0pXG5cbiAgICAgICAgY2FzZSAndmlldzp6b29tLW91dCc6XG4gICAgICAgICAgb2xkVHJhbnNmb3JtID0gdGhpcy5fY29tcG9uZW50LmdldFN0YWdlVHJhbnNmb3JtKClcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0uem9vbSA9IHRoaXMuc3RhdGUuem9vbVhZIC8gMS4yNVxuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybShvbGRUcmFuc2Zvcm0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyB6b29tWFk6IHRoaXMuc3RhdGUuem9vbVhZIC8gMS4yNSB9KVxuXG4gICAgICAgIGNhc2UgJ2RyYXdpbmc6c2V0QWN0aXZlJzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBhY3RpdmVEcmF3aW5nVG9vbDogbWVzc2FnZS5wYXJhbXNbMF0sXG4gICAgICAgICAgICBkcmF3aW5nSXNNb2RhbDogbWVzc2FnZS5wYXJhbXNbMV1cbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tbWVudHMubG9hZCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21tZW50czogdGhpcy5fY29tbWVudHMuY29tbWVudHMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY3R4bWVudS5vbignY2xpY2snLCAoYWN0aW9uLCBldmVudCwgZWxlbWVudCkgPT4ge1xuICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnQWRkIENvbW1lbnQnOlxuICAgICAgICAgIHRoaXMuX2NvbW1lbnRzLmJ1aWxkKHsgeDogdGhpcy5fY3R4bWVudS5fbWVudS5sYXN0WCwgeTogdGhpcy5fY3R4bWVudS5fbWVudS5sYXN0WSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21tZW50czogdGhpcy5fY29tbWVudHMuY29tbWVudHMsIGRvU2hvd0NvbW1lbnRzOiB0cnVlIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eG1lbnUucmVidWlsZCh0aGlzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnSGlkZSBDb21tZW50cyc6XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRvU2hvd0NvbW1lbnRzOiAhdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHhtZW51LnJlYnVpbGQodGhpcylcbiAgICAgICAgICB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1Nob3cgQ29tbWVudHMnOlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkb1Nob3dDb21tZW50czogIXRoaXMuc3RhdGUuZG9TaG93Q29tbWVudHMgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4bWVudS5yZWJ1aWxkKHRoaXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdTaG93IEV2ZW50IExpc3RlbmVycyc6XG4gICAgICAgICAgdGhpcy5zaG93RXZlbnRIYW5kbGVyc0VkaXRvcihldmVudCwgZWxlbWVudClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBQYXN0ZWFibGUgdGhpbmdzIGFyZSBzdG9yZWQgYXQgdGhlIGdsb2JhbCBsZXZlbCBpbiB0aGUgY2xpcGJvYXJkIGJ1dCB3ZSBuZWVkIHRoYXQgYWN0aW9uIHRvIGZpcmUgZnJvbSB0aGUgdG9wIGxldmVsXG4gICAgLy8gc28gdGhhdCBhbGwgdGhlIHZpZXdzIGdldCB0aGUgbWVzc2FnZSwgc28gd2UgZW1pdCB0aGlzIGFzIGFuIGV2ZW50IGFuZCB0aGVuIHdhaXQgZm9yIHRoZSBjYWxsIHRvIHBhc3RlVGhpbmdcbiAgICB0aGlzLl9jdHhtZW51Lm9uKCdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJywgKGRhdGEpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVdpbmRvd1Jlc2l6ZSgpXG4gICAgfSksIDY0KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLndpbmRvd01vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMud2luZG93TW91c2VNb3ZlSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy53aW5kb3dNb3VzZVVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLndpbmRvd01vdXNlRG93bkhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLndpbmRvd0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHRoaXMud2luZG93RGJsQ2xpY2tIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLndpbmRvd0tleURvd25IYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy53aW5kb3dLZXlVcEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLndpbmRvd01vdXNlT3V0SGFuZGxlci5iaW5kKHRoaXMpKVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlICgpIHtcbiAgICB0aGlzLnJlc2V0Q29udGFpbmVyRGltZW5zaW9ucygpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG4gIH1cblxuICBoYW5kbGVXaW5kb3dSZXNpemUgKCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKVxuICAgIH0pXG4gIH1cblxuICBzaG93RXZlbnRIYW5kbGVyc0VkaXRvciAoY2xpY2tFdmVudCwgdGFyZ2V0RWxlbWVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGFyZ2V0RWxlbWVudDogdGFyZ2V0RWxlbWVudCxcbiAgICAgIGlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbjogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBoaWRlRXZlbnRIYW5kbGVyc0VkaXRvciAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0YXJnZXRFbGVtZW50OiBudWxsLFxuICAgICAgaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBzYXZlRXZlbnRIYW5kbGVyICh0YXJnZXRFbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXJEZXNjcmlwdG9yU2VyaWFsaXplZCkge1xuICAgIGxldCBzZWxlY3Rvck5hbWUgPSAnaGFpa3U6JyArIHRhcmdldEVsZW1lbnQudWlkXG4gICAgdGhpcy5fY29tcG9uZW50LnVwc2VydEV2ZW50SGFuZGxlcihzZWxlY3Rvck5hbWUsIGV2ZW50TmFtZSwgaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkLCB7IGZyb206ICdnbGFzcycgfSwgKCkgPT4ge1xuXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm1QYW4gKGR4LCBkeSkge1xuICAgIHZhciBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgIG9sZFRyYW5zZm9ybS5wYW4ueCA9IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5YICsgZHhcbiAgICBvbGRUcmFuc2Zvcm0ucGFuLnkgPSB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWSArIGR5XG4gICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhblg6IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5YICsgZHgsXG4gICAgICBwYW5ZOiB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWSArIGR5XG4gICAgfSlcbiAgfVxuXG4gIHdpbmRvd01vdXNlT3V0SGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHZhciBzb3VyY2UgPSBuYXRpdmVFdmVudC5yZWxhdGVkVGFyZ2V0IHx8IG5hdGl2ZUV2ZW50LnRvRWxlbWVudFxuICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgICAvLyB0aGlzLnNldFN0YXRlKHtcbiAgICAgIC8vICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgLy8gICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgLy8gICBjb250cm9sQWN0aXZhdGlvbjogbnVsbFxuICAgICAgLy8gfSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuaG92ZXJlZC5kZXF1ZXVlKClcbiAgICB9XG4gIH1cblxuICB3aW5kb3dNb3VzZU1vdmVIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd01vdXNlVXBIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VVcCh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZURvd25IYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VEb3duKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0NsaWNrSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZUNsaWNrKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0RibENsaWNrSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZURvdWJsZUNsaWNrKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0tleURvd25IYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLZXlEb3duKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0tleVVwSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2V5VXAoeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duIChtb3VzZWRvd25FdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgaWYgKG1vdXNlZG93bkV2ZW50Lm5hdGl2ZUV2ZW50LmJ1dHRvbiAhPT0gMCkgcmV0dXJuIC8vIGxlZnQgY2xpY2sgb25seVxuXG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRG93biA9IHRydWVcbiAgICB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25UaW1lID0gRGF0ZS5ub3coKVxuICAgIHZhciBtb3VzZVBvcyA9IHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNlZG93bkV2ZW50LCAnbGFzdE1vdXNlRG93blBvc2l0aW9uJylcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZURyYXdpbmdUb29sICE9PSAncG9pbnRlcicpIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5kcmF3aW5nSXNNb2RhbCkge1xuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICdkcmF3aW5nOmNvbXBsZXRlZCcsIGZyb206ICdnbGFzcycgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29tcG9uZW50Lmluc3RhbnRpYXRlQ29tcG9uZW50KHRoaXMuc3RhdGUuYWN0aXZlRHJhd2luZ1Rvb2wsIHtcbiAgICAgICAgeDogbW91c2VQb3MueCxcbiAgICAgICAgeTogbW91c2VQb3MueSxcbiAgICAgICAgbWluaW1pemVkOiB0cnVlXG4gICAgICB9LCB7IGZyb206ICdnbGFzcycgfSwgKGVyciwgbWV0YWRhdGEsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBpcyBzdGlsbCBkb3duIGJlZ2luIGRyYWcgc2NhbGluZ1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc01vdXNlRG93bikge1xuICAgICAgICAgIC8vIGFjdGl2YXRlIHRoZSBib3R0b20gcmlnaHQgY29udHJvbCBwb2ludCwgZm9yIHNjYWxpbmdcbiAgICAgICAgICB0aGlzLmNvbnRyb2xBY3RpdmF0aW9uKHtcbiAgICAgICAgICAgIGluZGV4OiA4LFxuICAgICAgICAgICAgZXZlbnQ6IG1vdXNlZG93bkV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2xpbWIgdGhlIHRhcmdldCBwYXRoIHRvIGZpbmQgaWYgYSBoYWlrdSBlbGVtZW50IGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgICAvLyBOT1RFOiB3ZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhcmUgbm90IHNlbGVjdGluZyBlbGVtZW50cyBhdCB0aGUgd3JvbmcgY29udGV4dCBsZXZlbFxuICAgICAgdmFyIHRhcmdldCA9IG1vdXNlZG93bkV2ZW50Lm5hdGl2ZUV2ZW50LnRhcmdldFxuICAgICAgaWYgKCh0eXBlb2YgdGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ3N0cmluZycpICYmIHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignc2NhbGUtY3Vyc29yJykgIT09IC0xKSByZXR1cm5cblxuICAgICAgd2hpbGUgKHRhcmdldC5oYXNBdHRyaWJ1dGUgJiYgKCF0YXJnZXQuaGFzQXR0cmlidXRlKCdzb3VyY2UnKSB8fCAhdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaGFpa3UtaWQnKSB8fFxuICAgICAgICAgICAgICF0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmQodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaGFpa3UtaWQnKSkpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0IHx8ICF0YXJnZXQuaGFzQXR0cmlidXRlKSB7XG4gICAgICAgIC8vIElmIHNoaWZ0IGlzIGRvd24sIHRoYXQncyBjb25zdHJhaW5lZCBzY2FsaW5nLiBJZiBjbWQsIHRoYXQncyByb3RhdGlvbiBtb2RlLlxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24gJiYgIXRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bikge1xuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnc291cmNlJykgJiYgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaGFpa3UtaWQnKSAmJiB0YXJnZXQucGFyZW50Tm9kZSAhPT0gdGhpcy5yZWZzLm1vdW50KSB7XG4gICAgICAgIHZhciBoYWlrdUlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaGFpa3UtaWQnKVxuICAgICAgICB2YXIgY29udGFpbmVkID0gbG9kYXNoLmZpbmQodGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAoZWxlbWVudCkgPT4gZWxlbWVudC51aWQgPT09IGhhaWt1SWQpXG5cbiAgICAgICAgLy8gd2UgY2hlY2sgaWYgdGhlIGVsZW1lbnQgYmVpbmcgY2xpY2tlZCBvbiBpcyBhbHJlYWR5IGluIHRoZSBzZWxlY3Rpb24sIGlmIGl0IGlzIHdlIGRvbid0IHdhbnRcbiAgICAgICAgLy8gdG8gY2xlYXIgdGhlIHNlbGVjdGlvbiBzaW5jZSBpdCBjb3VsZCBiZSBhIGdyb3VwZWQgc2VsZWN0aW9uXG4gICAgICAgIC8vIElmIHNoaWZ0IGlzIGRvd24sIHRoYXQncyBjb25zdHJhaW5lZCBzY2FsaW5nLiBJZiBjbWQsIHRoYXQncyByb3RhdGlvbiBtb2RlLlxuICAgICAgICBpZiAoIWNvbnRhaW5lZCAmJiAoIXRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24gJiYgIXRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bikpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbnRhaW5lZCkge1xuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZWxlY3RFbGVtZW50KGhhaWt1SWQsIHsgZnJvbTogJ2dsYXNzJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAgKG1vdXNldXBFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRG93biA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5sYXN0TW91c2VVcFRpbWUgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5oYW5kbGVEcmFnU3RvcCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0FueXRoaW5nU2NhbGluZzogZmFsc2UsXG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgZ2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3M6ICcnLFxuICAgICAgY29udHJvbEFjdGl2YXRpb246IG51bGxcbiAgICB9KVxuICAgIHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNldXBFdmVudCwgJ2xhc3RNb3VzZVVwUG9zaXRpb24nKVxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgKGNsaWNrRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihjbGlja0V2ZW50KVxuICB9XG5cbiAgaGFuZGxlRG91YmxlQ2xpY2sgKGRvdWJsZUNsaWNrRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihkb3VibGVDbGlja0V2ZW50KVxuICB9XG5cbiAgaGFuZGxlRHJhZ1N0YXJ0IChjYikge1xuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc01vdXNlRHJhZ2dpbmc6IHRydWUgfSwgY2IpXG4gIH1cblxuICBoYW5kbGVEcmFnU3RvcCAoY2IpIHtcbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzTW91c2VEcmFnZ2luZzogZmFsc2UgfSwgY2IpXG4gIH1cblxuICBoYW5kbGVLZXlFc2NhcGUgKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgfVxuXG4gIGhhbmRsZUtleVNwYWNlIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5U3BhY2VEb3duOiBpc0Rvd24gfSlcbiAgICAvLyB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmRyaWxsZG93bkludG9BbHJlYWR5U2VsZWN0ZWRFbGVtZW50KHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQpXG4gIH1cblxuICBoYW5kbGVLZXlMZWZ0QXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZSgtZGVsdGEsIDAsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlVcEFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoMCwgLWRlbHRhLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5UmlnaHRBcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKGRlbHRhLCAwLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5RG93bkFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoMCwgZGVsdGEsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChrZXlFdmVudCkge1xuICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvci53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQoa2V5RXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5RXZlbnQubmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgMjc6IHJldHVybiB0aGlzLmhhbmRsZUtleUVzY2FwZSgpXG4gICAgICBjYXNlIDMyOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTcGFjZShrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMzc6IHJldHVybiB0aGlzLmhhbmRsZUtleUxlZnRBcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgMzg6IHJldHVybiB0aGlzLmhhbmRsZUtleVVwQXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDM5OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlSaWdodEFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSA0MDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RG93bkFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSA0NjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RGVsZXRlKClcbiAgICAgIGNhc2UgODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RGVsZXRlKClcbiAgICAgIGNhc2UgMTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUVudGVyKClcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLmhhbmRsZUtleVNoaWZ0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q3RybChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLmhhbmRsZUtleUFsdChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChrZXlFdmVudCkge1xuICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvci53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQoa2V5RXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5RXZlbnQubmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgMzI6IHJldHVybiB0aGlzLmhhbmRsZUtleVNwYWNlKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLmhhbmRsZUtleVNoaWZ0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLmhhbmRsZUtleUN0cmwoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5QWx0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleUVudGVyICgpIHtcbiAgICAvLyBub29wIGZvciBub3dcbiAgfVxuXG4gIGhhbmRsZUtleUNvbW1hbmQgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB2YXIgY29udHJvbEFjdGl2YXRpb24gPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uXG4gICAgaWYgKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgICBjb250cm9sQWN0aXZhdGlvbi5jbWQgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q29tbWFuZERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUtleVNoaWZ0IChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uc2hpZnQgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5U2hpZnREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVLZXlDdHJsIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uY3RybCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlDdHJsRG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlS2V5QWx0IChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uYWx0ID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleUFsdERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUNsaWNrU3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgdmFyIGFydGJvYXJkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kUm9vdHMoKVswXVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuY2xpY2tlZC5hZGQoYXJ0Ym9hcmQpXG4gICAgYXJ0Ym9hcmQuc2VsZWN0KHsgZnJvbTogJ2dsYXNzJyB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdmVyU3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTdGFnZU5hbWVIb3ZlcmluZzogdHJ1ZSB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdXRTdGFnZU5hbWUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1N0YWdlTmFtZUhvdmVyaW5nOiBmYWxzZSB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlIChtb3VzZW1vdmVFdmVudCkge1xuICAgIGNvbnN0IHpvb20gPSB0aGlzLnN0YXRlLnpvb21YWSB8fCAxXG4gICAgY29uc3QgbGFzdE1vdXNlRG93blBvc2l0aW9uID0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb25cbiAgICBjb25zdCBtb3VzZVBvc2l0aW9uQ3VycmVudCA9IHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNlbW92ZUV2ZW50KVxuICAgIGNvbnN0IG1vdXNlUG9zaXRpb25QcmV2aW91cyA9IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzIHx8IG1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgbGV0IGR4ID0gKG1vdXNlUG9zaXRpb25DdXJyZW50LnggLSBtb3VzZVBvc2l0aW9uUHJldmlvdXMueCkgLyB6b29tXG4gICAgbGV0IGR5ID0gKG1vdXNlUG9zaXRpb25DdXJyZW50LnkgLSBtb3VzZVBvc2l0aW9uUHJldmlvdXMueSkgLyB6b29tXG4gICAgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcblxuICAgIC8vIGlmIChkeCAhPT0gMCkgZHggPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuem9vbVhZIC8gZHgpXG4gICAgLy8gaWYgKGR5ICE9PSAwKSBkeSA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS56b29tWFkgLyBkeSlcbiAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIsIHRoZSBtb3VzZSBoYXMgY2hhbmdlZCBpdHMgcG9zaXRpb24gZnJvbSB0aGUgbW9zdCByZWNlbnQgbW91c2Vkb3duXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0KClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nICYmIHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzS2V5U3BhY2VEb3duICYmIHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24pIHtcbiAgICAgICAgdGhpcy5wZXJmb3JtUGFuKFxuICAgICAgICAgIG1vdXNlbW92ZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFggLSB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duLngsXG4gICAgICAgICAgbW91c2Vtb3ZlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WSAtIHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24ueVxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KVxuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuZHJhZyhkeCwgZHksIG1vdXNlUG9zaXRpb25DdXJyZW50LCBtb3VzZVBvc2l0aW9uUHJldmlvdXMsIGxhc3RNb3VzZURvd25Qb3NpdGlvbiwgdGhpcy5zdGF0ZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICB9XG5cbiAgaGFuZGxlS2V5RGVsZXRlICgpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpXG4gICAgfSlcbiAgfVxuXG4gIHJlc2V0Q29udGFpbmVyRGltZW5zaW9ucyAoY2IpIHtcbiAgICBpZiAoIXRoaXMucmVmcy5jb250YWluZXIpIHJldHVyblxuICAgIHZhciB3ID0gdGhpcy5yZWZzLmNvbnRhaW5lci5jbGllbnRXaWR0aFxuICAgIHZhciBoID0gdGhpcy5yZWZzLmNvbnRhaW5lci5jbGllbnRIZWlnaHRcbiAgICB2YXIgbW91bnRYID0gKHcgLSB0aGlzLnN0YXRlLm1vdW50V2lkdGgpIC8gMlxuICAgIHZhciBtb3VudFkgPSAoaCAtIHRoaXMuc3RhdGUubW91bnRIZWlnaHQpIC8gMlxuICAgIGlmICh3ICE9PSB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoIHx8IGggIT09IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0IHx8IG1vdW50WCAhPT0gdGhpcy5zdGF0ZS5tb3VudFggfHwgbW91bnRZICE9PSB0aGlzLnN0YXRlLm1vdW50WSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbnRhaW5lcldpZHRoOiB3LCBjb250YWluZXJIZWlnaHQ6IGgsIG1vdW50WCwgbW91bnRZIH0sIGNiKVxuICAgIH1cbiAgfVxuXG4gIGdldEFydGJvYXJkUmVjdCAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYLFxuICAgICAgcmlnaHQ6IHRoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSxcbiAgICAgIGJvdHRvbTogdGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodFxuICAgIH1cbiAgfVxuXG4gIGdldFNlbGVjdGlvbk1hcnF1ZWVTaXplICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQgfHwgIXRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLnggKyB0aGlzLmdldEFydGJvYXJkUmVjdCgpLmxlZnQsXG4gICAgICB5OiB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi55ICsgdGhpcy5nZXRBcnRib2FyZFJlY3QoKS50b3AsXG4gICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudC54IC0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueCxcbiAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudC55IC0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueVxuICAgIH1cbiAgfVxuXG4gIGNvbnRyb2xBY3RpdmF0aW9uIChhY3RpdmF0aW9uSW5mbykge1xuICAgIHZhciBhcnRib2FyZCA9IHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzQW55dGhpbmdSb3RhdGluZzogdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLFxuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6ICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sXG4gICAgICBjb250cm9sQWN0aXZhdGlvbjoge1xuICAgICAgICBzaGlmdDogdGhpcy5zdGF0ZS5pc0tleVNoaWZ0RG93bixcbiAgICAgICAgY3RybDogdGhpcy5zdGF0ZS5pc0tleUN0cmxEb3duLFxuICAgICAgICBjbWQ6IHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bixcbiAgICAgICAgYWx0OiB0aGlzLnN0YXRlLmlzS2V5QWx0RG93bixcbiAgICAgICAgaW5kZXg6IGFjdGl2YXRpb25JbmZvLmluZGV4LFxuICAgICAgICBhcmJvYXJkOiBhcnRib2FyZCxcbiAgICAgICAgY2xpZW50OiB7XG4gICAgICAgICAgeDogYWN0aXZhdGlvbkluZm8uZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICB5OiBhY3RpdmF0aW9uSW5mby5ldmVudC5jbGllbnRZXG4gICAgICAgIH0sXG4gICAgICAgIGNvb3Jkczoge1xuICAgICAgICAgIHg6IGFjdGl2YXRpb25JbmZvLmV2ZW50LmNsaWVudFggLSBhcnRib2FyZC5sZWZ0LFxuICAgICAgICAgIHk6IGFjdGl2YXRpb25JbmZvLmV2ZW50LmNsaWVudFkgLSBhcnRib2FyZC50b3BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24gKG1vdXNlRXZlbnQsIGFkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMucmVmcy5jb250YWluZXIpIHJldHVybiBudWxsIC8vIFdlIGhhdmVuJ3QgbW91bnRlZCB5ZXQsIG5vIHNpemUgYXZhaWxhYmxlXG4gICAgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMgPSB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgY29uc3QgbW91c2VQb3NpdGlvbkN1cnJlbnQgPSBnZXRMb2NhbERvbUV2ZW50UG9zaXRpb24obW91c2VFdmVudC5uYXRpdmVFdmVudCwgdGhpcy5yZWZzLmNvbnRhaW5lcilcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC5jbGllbnRYID0gbW91c2VFdmVudC5uYXRpdmVFdmVudC5jbGllbnRYXG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQuY2xpZW50WSA9IG1vdXNlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WVxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LnggLT0gdGhpcy5nZXRBcnRib2FyZFJlY3QoKS5sZWZ0XG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQueSAtPSB0aGlzLmdldEFydGJvYXJkUmVjdCgpLnRvcFxuICAgIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQgPSBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGlmIChhZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlKSB0aGlzLnN0YXRlW2FkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGVdID0gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgfVxuXG4gIGRyYXdPdmVybGF5cyAoZm9yY2UpIHtcbiAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKGZvcmNlIHx8IHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9oYWlrdVJlbmRlcmVyLmNyZWF0ZUNvbnRhaW5lcih0aGlzLnJlZnMub3ZlcmxheSlcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMuYnVpbGREcmF3bk92ZXJsYXlzKClcbiAgICAgIHZhciBvdmVybGF5ID0ge1xuICAgICAgICBlbGVtZW50TmFtZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBpZDogJ2hhaWt1LWdsYXNzLW92ZXJsYXktcm9vdCcsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ21hdHJpeDNkKDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDEpJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYICsgJ3B4JyxcbiAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFkgKyAncHgnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCArICdweCcsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHQgKyAncHgnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogcGFydHNcbiAgICAgIH1cblxuICAgICAgLy8gSEFDSyEgV2UgYWxyZWFkeSBjYWNoZSB0aGUgY29udHJvbCBwb2ludCBsaXN0ZW5lcnMgb3Vyc2VsdmVzLCBzbyBjbGVhciB0aGUgY2FjaGVcbiAgICAgIC8vIHVzZWQgbm9ybWFsbHkgYnkgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSBmb3IgY2FjaGluZy9kZWR1cGluZyBsaXN0ZW5lcnMgaW4gcHJvZHVjdGlvblxuICAgICAgdGhpcy5faGFpa3VDb250ZXh0LmNvbXBvbmVudC5fcmVnaXN0ZXJlZEVsZW1lbnRFdmVudExpc3RlbmVycyA9IHt9XG5cbiAgICAgIHRoaXMuX2hhaWt1UmVuZGVyZXIucmVuZGVyKHRoaXMucmVmcy5vdmVybGF5LCBjb250YWluZXIsIG92ZXJsYXksIHRoaXMuX2hhaWt1Q29udGV4dC5jb21wb25lbnQsIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgbWV0aG9kIGNyZWF0ZXMgb2JqZWN0cyB3aGljaCByZXByZXNlbnQgSGFpa3UgUGxheWVyIHJlbmRlcmluZyBpbnN0cnVjdGlvbnMgZm9yIGRpc3BsYXlpbmcgYWxsIG9mXG4gIC8vIHRoZSB2aXN1YWwgZWZmZWN0cyB0aGF0IHNpdCBhYm92ZSB0aGUgc3RhZ2UuIChUcmFuc2Zvcm0gY29udHJvbHMsIGV0Yy4pIFRoZSBIYWlrdSBQbGF5ZXIgaXMgc29ydCBvZiBhXG4gIC8vIGh5YnJpZCBvZiBSZWFjdCBGaWJlciBhbmQgRmFtb3VzIEVuZ2luZS4gSXQgaGFzIGEgdmlydHVhbCBET00gdHJlZSBvZiBlbGVtZW50cyBsaWtlIHtlbGVtZW50TmFtZTogJ2RpdicsIGF0dHJpYnV0ZXM6IHt9LCBbXX0sXG4gIC8vIGFuZCBmbHVzaGVzIHVwZGF0ZXMgdG8gdGhlbSBvbiBlYWNoIGZyYW1lLiBTbyB3aGF0IF90aGlzIG1ldGhvZF8gZG9lcyBpcyBqdXN0IGJ1aWxkIHRob3NlIG9iamVjdHMgYW5kIHRoZW5cbiAgLy8gdGhlc2UgZ2V0IHBhc3NlZCBpbnRvIGEgSGFpa3UgUGxheWVyIHJlbmRlciBtZXRob2QgKHNlZSBhYm92ZSkuIExPTkcgU1RPUlkgU0hPUlQ6IFRoaXMgY3JlYXRlcyBhIGZsYXQgbGlzdCBvZlxuICAvLyBub2RlcyB0aGF0IGdldCByZW5kZXJlZCB0byB0aGUgRE9NIGJ5IHRoZSBIYWlrdSBQbGF5ZXIuXG4gIGJ1aWxkRHJhd25PdmVybGF5cyAoKSB7XG4gICAgdmFyIG92ZXJsYXlzID0gW11cbiAgICAvLyBEb24ndCBzaG93IGFueSBvdmVybGF5cyBpZiB3ZSdyZSBpbiBwcmV2aWV3IChha2EgJ2xpdmUnKSBpbnRlcmFjdGlvbk1vZGVcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiBvdmVybGF5c1xuICAgIH1cbiAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwb2ludHNcbiAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzZWxlY3RlZFswXVxuICAgICAgICBpZiAoZWxlbWVudC5pc1JlbmRlcmFibGVUeXBlKCkpIHtcbiAgICAgICAgICBwb2ludHMgPSBlbGVtZW50LmdldFBvaW50c1RyYW5zZm9ybWVkKHRydWUpXG4gICAgICAgICAgdGhpcy5yZW5kZXJNb3JwaFBvaW50c092ZXJsYXkocG9pbnRzLCBvdmVybGF5cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwb2ludHMgPSBlbGVtZW50LmdldEJveFBvaW50c1RyYW5zZm9ybWVkKClcbiAgICAgICAgICB2YXIgcm90YXRpb25aID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdyb3RhdGlvbi56JykgfHwgMFxuICAgICAgICAgIHZhciBzY2FsZVggPSBlbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLngnKVxuICAgICAgICAgIGlmIChzY2FsZVggPT09IHVuZGVmaW5lZCB8fCBzY2FsZVggPT09IG51bGwpIHNjYWxlWCA9IDFcbiAgICAgICAgICB2YXIgc2NhbGVZID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS55JylcbiAgICAgICAgICBpZiAoc2NhbGVZID09PSB1bmRlZmluZWQgfHwgc2NhbGVZID09PSBudWxsKSBzY2FsZVkgPSAxXG4gICAgICAgICAgdGhpcy5yZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5KHBvaW50cywgb3ZlcmxheXMsIGVsZW1lbnQuY2FuUm90YXRlKCksIHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93biwgdHJ1ZSwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9pbnRzID0gW11cbiAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuZ2V0Qm94UG9pbnRzVHJhbnNmb3JtZWQoKS5mb3JFYWNoKChwb2ludCkgPT4gcG9pbnRzLnB1c2gocG9pbnQpKVxuICAgICAgICB9KVxuICAgICAgICBwb2ludHMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmdldEJvdW5kaW5nQm94UG9pbnRzKHBvaW50cylcbiAgICAgICAgdGhpcy5yZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5KHBvaW50cywgb3ZlcmxheXMsIGZhbHNlLCB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sIGZhbHNlLCAwLCAxLCAxKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nKSB7XG4gICAgICAgIC8vIFRPRE86IERyYXcgdG9vbHRpcCB3aXRoIHBvaW50cyBpbmZvXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdmVybGF5c1xuICB9XG5cbiAgcmVuZGVyTW9ycGhQb2ludHNPdmVybGF5IChwb2ludHMsIG92ZXJsYXlzKSB7XG4gICAgcG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckNvbnRyb2xQb2ludChwb2ludC54LCBwb2ludC55LCBpbmRleCkpXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlckxpbmUgKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW1lbnROYW1lOiAnc3ZnJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNoaWxkcmVuOiBbe1xuICAgICAgICBlbGVtZW50TmFtZTogJ2xpbmUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgeDE6IHgxLFxuICAgICAgICAgIHkxOiB5MSxcbiAgICAgICAgICB4MjogeDIsXG4gICAgICAgICAgeTI6IHkyLFxuICAgICAgICAgIHN0cm9rZTogUGFsZXR0ZS5EQVJLRVJfUk9DSzIsXG4gICAgICAgICAgJ3N0cm9rZS13aWR0aCc6ICcxcHgnLFxuICAgICAgICAgICd2ZWN0b3ItZWZmZWN0JzogJ25vbi1zY2FsaW5nLXN0cm9rZSdcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb250cm9sUG9pbnRMaXN0ZW5lciAoZXZlbnROYW1lLCBwb2ludEluZGV4KSB7XG4gICAgLy8gQ2FjaGluZyB0aGVzZSBhcyBvcHBvc2VkIHRvIGNyZWF0aW5nIG5ldyBmdW5jdGlvbnMgaHVuZHJlZHMgb2YgdGltZXNcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVycykgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzID0ge31cbiAgICBjb25zdCBjb250cm9sS2V5ID0gZXZlbnROYW1lICsgJy0nICsgcG9pbnRJbmRleFxuICAgIGlmICghdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldKSB7XG4gICAgICB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV0gPSAobGlzdGVuZXJFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRyb2xBY3RpdmF0aW9uKHtcbiAgICAgICAgICBpbmRleDogcG9pbnRJbmRleCxcbiAgICAgICAgICBldmVudDogbGlzdGVuZXJFdmVudFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldLmNvbnRyb2xLZXkgPSBjb250cm9sS2V5XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV1cbiAgfVxuXG4gIHJlbmRlckNvbnRyb2xQb2ludCAoeCwgeSwgaW5kZXgsIGhhbmRsZUNsYXNzKSB7XG4gICAgdmFyIHNjYWxlID0gMSAvICh0aGlzLnN0YXRlLnpvb21YWSB8fCAxKVxuICAgIHJldHVybiB7XG4gICAgICBlbGVtZW50TmFtZTogJ2RpdicsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGtleTogJ2NvbnRyb2wtcG9pbnQtJyArIGluZGV4LFxuICAgICAgICBjbGFzczogaGFuZGxlQ2xhc3MgfHwgJycsXG4gICAgICAgIG9ubW91c2Vkb3duOiB0aGlzLmNyZWF0ZUNvbnRyb2xQb2ludExpc3RlbmVyKCdtb3VzZWRvd24nLCBpbmRleCksXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZX0sJHtzY2FsZX0pYCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgICAgICAgbGVmdDogKHggLSAzLjUpICsgJ3B4JyxcbiAgICAgICAgICB0b3A6ICh5IC0gMy41KSArICdweCcsXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkRBUktFUl9ST0NLMixcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICBib3hTaGFkb3c6ICcwIDJweCA2cHggMCAnICsgUGFsZXR0ZS5TSEFEWSwgLy8gVE9ETzogYWNjb3VudCBmb3Igcm90YXRpb25cbiAgICAgICAgICB3aWR0aDogJzdweCcsXG4gICAgICAgICAgaGVpZ2h0OiAnN3B4JyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGtleTogJ2NvbnRyb2wtcG9pbnQtaGl0LWFyZWEtJyArIGluZGV4LFxuICAgICAgICAgICAgY2xhc3M6IGhhbmRsZUNsYXNzIHx8ICcnLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJyxcbiAgICAgICAgICAgICAgbGVmdDogJy0xNXB4JyxcbiAgICAgICAgICAgICAgdG9wOiAnLTE1cHgnLFxuICAgICAgICAgICAgICB3aWR0aDogJzMwcHgnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICczMHB4J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfVxuXG4gIGdldEhhbmRsZUNsYXNzIChpbmRleCwgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKSB7XG4gICAgdmFyIGRlZmF1bHRQb2ludEdyb3VwID0gQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTWzBdXG4gICAgdmFyIGluZGV4T2ZQb2ludCA9IGRlZmF1bHRQb2ludEdyb3VwLmluZGV4T2YoaW5kZXgpXG5cbiAgICB2YXIga2V5T2ZQb2ludEdyb3VwXG4gICAgaWYgKHNjYWxlWCA+PSAwICYmIHNjYWxlWSA+PSAwKSBrZXlPZlBvaW50R3JvdXAgPSAwIC8vIGRlZmF1bHRcbiAgICBlbHNlIGlmIChzY2FsZVggPj0gMCAmJiBzY2FsZVkgPCAwKSBrZXlPZlBvaW50R3JvdXAgPSAxIC8vIGZsaXBwZWQgdmVydGljYWxseVxuICAgIGVsc2UgaWYgKHNjYWxlWCA8IDAgJiYgc2NhbGVZID49IDApIGtleU9mUG9pbnRHcm91cCA9IDIgLy8gZmxpcHBlZCBob3Jpem9udGFsbHlcbiAgICBlbHNlIGlmIChzY2FsZVggPCAwICYmIHNjYWxlWSA8IDApIGtleU9mUG9pbnRHcm91cCA9IDMgLy8gZmxpcHBlZCBob3Jpem9udGFsbHkgYW5kIHZlcnRpY2FsbHlcblxuICAgIGlmIChrZXlPZlBvaW50R3JvdXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIGhhbmRsZSBjbGFzcyBkdWUgdG8gYmFkIHNjYWxlIHZhbHVlcycpXG4gICAgfVxuXG4gICAgdmFyIHNwZWNpZmllZFBvaW50R3JvdXAgPSBDTE9DS1dJU0VfQ09OVFJPTF9QT0lOVFNba2V5T2ZQb2ludEdyb3VwXVxuXG4gICAgdmFyIHJvdGF0aW9uRGVncmVlcyA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZ2V0Um90YXRpb25JbjM2MChyb3RhdGlvblopXG4gICAgLy8gRWFjaCA0NSBkZWdyZWUgdHVybiB3aWxsIGVxdWF0ZSB0byBhIHBoYXNlIGNoYW5nZSBvZiAxLCBhbmQgdGhhdCBwaGFzZSBjb3JyZXNwb25kcyB0b1xuICAgIC8vIGEgc3RhcnRpbmcgaW5kZXggZm9yIHRoZSBjb250cm9sIHBvaW50cyBpbiBjbG9ja3dpc2Ugb3JkZXJcbiAgICB2YXIgcGhhc2VOdW1iZXIgPSB+figocm90YXRpb25EZWdyZWVzICsgMjIuNSkgLyA0NSkgJSBzcGVjaWZpZWRQb2ludEdyb3VwLmxlbmd0aFxuICAgIHZhciBvZmZzZXRJbmRleCA9IChpbmRleE9mUG9pbnQgKyBwaGFzZU51bWJlcikgJSBzcGVjaWZpZWRQb2ludEdyb3VwLmxlbmd0aFxuICAgIHZhciBzaGlmdGVkSW5kZXggPSBzcGVjaWZpZWRQb2ludEdyb3VwW29mZnNldEluZGV4XVxuXG4gICAgLy8gVGhlc2UgY2xhc3MgbmFtZXMgYXJlIGRlZmluZWQgaW4gZ2xvYmFsLmNzczsgdGhlIGluZGljZXMgaW5kaWNhdGUgdGhlIGNvcnJlc3BvbmRpbmcgcG9pbnRzXG4gICAgaWYgKGNhblJvdGF0ZSAmJiBpc1JvdGF0aW9uTW9kZU9uKSB7XG4gICAgICByZXR1cm4gYHJvdGF0ZS1jdXJzb3ItJHtzaGlmdGVkSW5kZXh9YFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHNjYWxlLWN1cnNvci0ke3NoaWZ0ZWRJbmRleH1gXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheSAocG9pbnRzLCBvdmVybGF5cywgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCBjYW5Db250cm9sSGFuZGxlcywgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIHZhciBjb3JuZXJzID0gW3BvaW50c1swXSwgcG9pbnRzWzJdLCBwb2ludHNbOF0sIHBvaW50c1s2XV1cbiAgICBjb3JuZXJzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgdmFyIG5leHQgPSBjb3JuZXJzWyhpbmRleCArIDEpICUgY29ybmVycy5sZW5ndGhdXG4gICAgICBvdmVybGF5cy5wdXNoKHRoaXMucmVuZGVyTGluZShwb2ludC54LCBwb2ludC55LCBuZXh0LngsIG5leHQueSkpXG4gICAgfSlcbiAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggIT09IDQpIHtcbiAgICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckNvbnRyb2xQb2ludChwb2ludC54LCBwb2ludC55LCBpbmRleCwgY2FuQ29udHJvbEhhbmRsZXMgJiYgdGhpcy5nZXRIYW5kbGVDbGFzcyhpbmRleCwgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKSkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldEdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb24pIHJldHVybiAnJ1xuICAgIHZhciBjb250cm9sSW5kZXggPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uLmluZGV4XG4gICAgdmFyIGlzUm90YXRpb25Nb2RlT24gPSB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd25cbiAgICB2YXIgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuc2VsZWN0ZWQuYWxsKClcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBzZWxlY3RlZEVsZW1lbnQgPSBzZWxlY3RlZEVsZW1lbnRzWzBdXG4gICAgICB2YXIgcm90YXRpb25aID0gc2VsZWN0ZWRFbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3JvdGF0aW9uLnonKSB8fCAwXG4gICAgICB2YXIgc2NhbGVYID0gc2VsZWN0ZWRFbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLngnKVxuICAgICAgaWYgKHNjYWxlWCA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWCA9PT0gbnVsbCkgc2NhbGVYID0gMVxuICAgICAgdmFyIHNjYWxlWSA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS55JylcbiAgICAgIGlmIChzY2FsZVkgPT09IHVuZGVmaW5lZCB8fCBzY2FsZVkgPT09IG51bGwpIHNjYWxlWSA9IDFcbiAgICAgIHJldHVybiB0aGlzLmdldEhhbmRsZUNsYXNzKGNvbnRyb2xJbmRleCwgdHJ1ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGFuZGxlQ2xhc3MoY29udHJvbEluZGV4LCBmYWxzZSwgaXNSb3RhdGlvbk1vZGVPbiwgMCwgMSwgMSlcbiAgICB9XG4gIH1cblxuICBnZXRTdGFnZVRyYW5zZm9ybSAoKSB7XG4gICAgdmFyIGEgPSB0aGlzLnN0YXRlLnpvb21YWSB8fCAxXG4gICAgdmFyIGMgPSB0aGlzLnN0YXRlLnBhblggfHwgMFxuICAgIHZhciBkID0gdGhpcy5zdGF0ZS5wYW5ZIHx8IDBcblxuICAgIHJldHVybiAnbWF0cml4M2QoJyArXG4gICAgICBbYSwgMCwgMCwgMCxcbiAgICAgICAgMCwgYSwgMCwgMCxcbiAgICAgICAgMCwgMCwgMSwgMCxcbiAgICAgICAgYywgZCwgMCwgMV0uam9pbignLCcpICsgJyknXG4gIH1cblxuICBpc1ByZXZpZXdNb2RlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50Ll9pbnRlcmFjdGlvbk1vZGUudHlwZSA9PT0gJ2xpdmUnXG4gIH1cblxuICBnZXRDdXJzb3JDc3NSdWxlICgpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHJldHVybiAnZGVmYXVsdCdcbiAgICByZXR1cm4gKHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24pID8gJy13ZWJraXQtZ3JhYmJpbmcnIDogJy13ZWJraXQtZ3JhYidcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIGRyYXdpbmdDbGFzc05hbWUgPSAodGhpcy5zdGF0ZS5hY3RpdmVEcmF3aW5nVG9vbCAhPT0gJ3BvaW50ZXInKSA/ICdkcmF3LXNoYXBlJyA6ICcnXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q29tbWFuZERvd246IGZhbHNlIH0pfT5cblxuICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgIHJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2NjYycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7TWF0aC5yb3VuZCh0aGlzLnN0YXRlLnpvb21YWSAvIDEgKiAxMDApfSVcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1jb250YWluZXInXG4gICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLmdldEdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzKCl9XG4gICAgICAgICAgb25Nb3VzZURvd249eyhtb3VzZURvd24pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgaWYgKG1vdXNlRG93bi5uYXRpdmVFdmVudC50YXJnZXQgJiYgbW91c2VEb3duLm5hdGl2ZUV2ZW50LnRhcmdldC5pZCA9PT0gJ2Z1bGwtYmFja2dyb3VuZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRXZlbnRIYW5kbGVyc0VkaXRvcigpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYW5YOiB0aGlzLnN0YXRlLnBhblgsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYW5ZOiB0aGlzLnN0YXRlLnBhblksXG4gICAgICAgICAgICAgICAgc3RhZ2VNb3VzZURvd246IHtcbiAgICAgICAgICAgICAgICAgIHg6IG1vdXNlRG93bi5uYXRpdmVFdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgeTogbW91c2VEb3duLm5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YWdlTW91c2VEb3duOiBudWxsIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YWdlTW91c2VEb3duOiBudWxsIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyBUT0RPOiAgaWYvd2hlbiB3ZSBzdXBwb3J0IG5hdGl2ZSBzY3JvbGxpbmcgaGVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UnbGwgbmVlZCB0byBmaWd1cmUgb3V0IHNvbWUgcGhhbnRvbSByZWZsb3dpbmcvaml0dGVyIGlzc3Vlc1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0aGlzLmdldFN0YWdlVHJhbnNmb3JtKCksXG4gICAgICAgICAgICBjdXJzb3I6IHRoaXMuZ2V0Q3Vyc29yQ3NzUnVsZSgpLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpID8gJ3doaXRlJyA6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLWJhY2tncm91bmQtbGl2ZSdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICA8ZmlsdGVyIGlkPSdiYWNrZ3JvdW5kLWJsdXInIHg9Jy01MCUnIHk9Jy01MCUnIHdpZHRoPScyMDAlJyBoZWlnaHQ9JzIwMCUnPlxuICAgICAgICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIGluPSdTb3VyY2VBbHBoYScgc3RkRGV2aWF0aW9uPScyJyByZXN1bHQ9J2JsdXInIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVGbG9vZCBmbG9vZENvbG9yPSdyZ2JhKDMzLCA0NSwgNDksIC41KScgZmxvb2RPcGFjaXR5PScwLjgnIHJlc3VsdD0nb2Zmc2V0Q29sb3InIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49J29mZnNldENvbG9yJyBpbjI9J2JsdXInIG9wZXJhdG9yPSdpbicgcmVzdWx0PSd0b3RhbEJsdXInIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVCbGVuZCBpbj0nU291cmNlR3JhcGhpYycgaW4yPSd0b3RhbEJsdXInIG1vZGU9J25vcm1hbCcgLz5cbiAgICAgICAgICAgICAgICA8L2ZpbHRlcj5cbiAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICA8cmVjdCBpZD0nZnVsbC1iYWNrZ3JvdW5kJyB4PScwJyB5PScwJyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSd0cmFuc3BhcmVudCcgLz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J21vdW50LWJhY2tncm91bmQtYmx1cicgZmlsdGVyPSd1cmwoI2JhY2tncm91bmQtYmx1ciknIHg9e3RoaXMuc3RhdGUubW91bnRYfSB5PXt0aGlzLnN0YXRlLm1vdW50WX0gd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aH0gaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fSBmaWxsPSd3aGl0ZScgLz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J21vdW50LWJhY2tncm91bmQnIHg9e3RoaXMuc3RhdGUubW91bnRYfSB5PXt0aGlzLnN0YXRlLm1vdW50WX0gd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aH0gaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fSBmaWxsPSd3aGl0ZScgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiA8ZGl2XG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLXByZXZpZXcnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLXByZXZpZXctYm9yZGVyJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggZG90dGVkICNiYmInLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4J1xuICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8L2Rpdj59XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtdGl0bGUtdGV4dC1jb250YWluZXInXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMCxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZIC0gMTksXG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFggKyAyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja1N0YWdlTmFtZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17dGhpcy5oYW5kbGVNb3VzZU92ZXJTdGFnZU5hbWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17dGhpcy5oYW5kbGVNb3VzZU91dFN0YWdlTmFtZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgPHRleHRcbiAgICAgICAgICAgICAgICB5PScxMydcbiAgICAgICAgICAgICAgICBpZD0ncHJvamVjdC1uYW1lJ1xuICAgICAgICAgICAgICAgIGZpbGw9e1BhbGV0dGUuRkFUSEVSX0NPQUx9XG4gICAgICAgICAgICAgICAgZm9udFdlaWdodD0nbGlnaHRlcidcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5PSdGaXJhIFNhbnMnXG4gICAgICAgICAgICAgICAgZm9udFNpemU9JzEzJz5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5wcm9qZWN0TmFtZX1cbiAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLWJhY2tncm91bmQtY29sb3JhdG9yJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMjAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9e2BNMCwwViR7dGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHR9SCR7dGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aH1WMFpNJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH0sJHt0aGlzLnN0YXRlLm1vdW50WSArIHRoaXMuc3RhdGUubW91bnRIZWlnaHR9SCR7dGhpcy5zdGF0ZS5tb3VudFh9ViR7dGhpcy5zdGF0ZS5tb3VudFl9SCR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9WmB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3snZmlsbCc6ICcjMTExJywgJ29wYWNpdHknOiAwLjEsICdwb2ludGVyRXZlbnRzJzogJ25vbmUnfX0gLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1tb2F0LW9wYWNpdGF0b3InXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDEwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8cGF0aCBkPXtgTTAsMFYke3RoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0fUgke3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9VjBaTSR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9LCR7dGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fUgke3RoaXMuc3RhdGUubW91bnRYfVYke3RoaXMuc3RhdGUubW91bnRZfUgke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofVpgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAnZmlsbCc6ICcjRkZGJyxcbiAgICAgICAgICAgICAgICAgICdvcGFjaXR5JzogMC41LFxuICAgICAgICAgICAgICAgICAgJ3BvaW50ZXJFdmVudHMnOiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgIHg9e3RoaXMuc3RhdGUubW91bnRYIC0gMX1cbiAgICAgICAgICAgICAgICB5PXt0aGlzLnN0YXRlLm1vdW50WSAtIDF9XG4gICAgICAgICAgICAgICAgd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aCArIDJ9XG4gICAgICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0ICsgMn1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDEuNSxcbiAgICAgICAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIHN0cm9rZTogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogdGhpcy5zdGF0ZS5pc1N0YWdlTmFtZUhvdmVyaW5nICYmICF0aGlzLnN0YXRlLmlzU3RhZ2VTZWxlY3RlZCA/IDAuNzUgOiAwXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkgJiYgdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyAmJiB0aGlzLnN0YXRlLmNvbW1lbnRzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLWNvbW1lbnRzLWNvbnRhaW5lcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAyMDAwLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5jb21tZW50cy5tYXAoKGNvbW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxDb21tZW50IGluZGV4PXtpbmRleH0gY29tbWVudD17Y29tbWVudH0ga2V5PXtgY29tbWVudC0ke2NvbW1lbnQuaWR9YH0gbW9kZWw9e3RoaXMuX2NvbW1lbnRzfSAvPlxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpICYmIHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKVxuICAgICAgICAgICAgPyA8RXZlbnRIYW5kbGVyRWRpdG9yXG4gICAgICAgICAgICAgIHJlZj0nZXZlbnRIYW5kbGVyRWRpdG9yJ1xuICAgICAgICAgICAgICBlbGVtZW50PXt0aGlzLnN0YXRlLnRhcmdldEVsZW1lbnR9XG4gICAgICAgICAgICAgIHNhdmU9e3RoaXMuc2F2ZUV2ZW50SGFuZGxlci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBjbG9zZT17dGhpcy5oaWRlRXZlbnRIYW5kbGVyc0VkaXRvci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgcmVmPSdvdmVybGF5J1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtb3ZlcmxheS1tb3VudCdcbiAgICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodH1cbiAgICAgICAgICAgICAgd2lkdGg9e3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbWF0cml4M2QoMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsMCwwLDAsMSknLFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgLy8gVGhpcyBuZWVkcyB0byBiZSB1bi1zZXQgZm9yIHN1cmZhY2UgZWxlbWVudHMgdGhhdCB0YWtlIG1vdXNlIGludGVyYWN0aW9uXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSA/IDAuNSA6IDEuMFxuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHJlZj0nbW91bnQnXG4gICAgICAgICAgICBpZD0naG90LWNvbXBvbmVudC1tb3VudCdcbiAgICAgICAgICAgIGNsYXNzTmFtZT17ZHJhd2luZ0NsYXNzTmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDYwLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAodGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pID8gMC41IDogMS4wXG4gICAgICAgICAgICB9fSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5HbGFzcy5wcm9wVHlwZXMgPSB7XG4gIHVzZXJjb25maWc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHdlYnNvY2tldDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShHbGFzcylcbiJdfQ==