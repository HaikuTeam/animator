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
      });

      this._component.on('artboard:resized', function (sizeDescriptor) {
        _this2.setState({
          mountWidth: sizeDescriptor.width,
          mountHeight: sizeDescriptor.height
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

      this._component.on('artboard:size-changed', function (sizeDescriptor) {
        _this2.setState({
          mountWidth: sizeDescriptor.width,
          mountHeight: sizeDescriptor.height
        });
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

      window.onerror = function (error) {
        _this2._playing = false;
        _this2.setState({ error: error });
      };

      // this.resetContainerDimensions(() => {
      //    this.drawLoop()
      // })
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
            lineNumber: 1142
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
              lineNumber: 1146
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
              lineNumber: 1159
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
                lineNumber: 1205
              },
              __self: this
            },
            _react2.default.createElement(
              'defs',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1214
                },
                __self: this
              },
              _react2.default.createElement(
                'filter',
                { id: 'background-blur', x: '-50%', y: '-50%', width: '200%', height: '200%', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1215
                  },
                  __self: this
                },
                _react2.default.createElement('feGaussianBlur', { 'in': 'SourceAlpha', stdDeviation: '2', result: 'blur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1216
                  },
                  __self: this
                }),
                _react2.default.createElement('feFlood', { floodColor: 'rgba(33, 45, 49, .5)', floodOpacity: '0.8', result: 'offsetColor', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1217
                  },
                  __self: this
                }),
                _react2.default.createElement('feComposite', { 'in': 'offsetColor', in2: 'blur', operator: 'in', result: 'totalBlur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1218
                  },
                  __self: this
                }),
                _react2.default.createElement('feBlend', { 'in': 'SourceGraphic', in2: 'totalBlur', mode: 'normal', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1219
                  },
                  __self: this
                })
              )
            ),
            _react2.default.createElement('rect', { id: 'full-background', x: '0', y: '0', width: '100%', height: '100%', fill: 'transparent', __source: {
                fileName: _jsxFileName,
                lineNumber: 1222
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background-blur', filter: 'url(#background-blur)', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1223
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1224
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
                lineNumber: 1226
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
                lineNumber: 1235
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
                lineNumber: 1249
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
                  lineNumber: 1264
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
                lineNumber: 1277
              },
              __self: this
            },
            _react2.default.createElement('path', { d: 'M0,0V' + this.state.containerHeight + 'H' + this.state.containerWidth + 'V0ZM' + (this.state.mountX + this.state.mountWidth) + ',' + (this.state.mountY + this.state.mountHeight) + 'H' + this.state.mountX + 'V' + this.state.mountY + 'H' + (this.state.mountX + this.state.mountWidth) + 'Z',
              style: { 'fill': '#111', 'opacity': 0.1, 'pointerEvents': 'none' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1288
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
                lineNumber: 1294
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
                lineNumber: 1305
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
                lineNumber: 1311
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
                lineNumber: 1327
              },
              __self: this
            },
            this.state.comments.map(function (comment, index) {
              return _react2.default.createElement(_Comment2.default, { index: index, comment: comment, key: 'comment-' + comment.id, model: _this13._comments, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1340
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
              lineNumber: 1346
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
              lineNumber: 1355
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
              lineNumber: 1372
            },
            __self: this
          }),
          this.state.error ? _react2.default.createElement(
            'div',
            {
              id: 'haiku-glass-exception-bar',
              style: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: 35,
                backgroundColor: _Palette2.default.RED,
                color: _Palette2.default.SUNSTONE,
                textAlign: 'center',
                width: '100%',
                zIndex: 9999,
                overflow: 'hidden',
                padding: '9px 20px 0',
                whiteSpace: 'nowrap'
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1388
              },
              __self: this
            },
            _react2.default.createElement(
              'button',
              {
                style: {
                  textTransform: 'none',
                  color: _Palette2.default.RED_DARKER,
                  fontFamily: 'Arial',
                  fontWeight: 'bold',
                  borderRadius: '50%',
                  border: '1px solid ' + _Palette2.default.RED_DARKER,
                  cursor: 'pointer',
                  width: 15,
                  paddingLeft: 1
                },
                onClick: function onClick() {
                  _this13.setState({ error: null });
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1404
                },
                __self: this
              },
              'x'
            ),
            _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1420
                },
                __self: this
              },
              ' '
            ),
            this.state.error
          ) : ''
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9HbGFzcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2xpcGJvYXJkIiwiQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTIiwiR2xhc3MiLCJwcm9wcyIsInN0YXRlIiwiZXJyb3IiLCJtb3VudFdpZHRoIiwibW91bnRIZWlnaHQiLCJtb3VudFgiLCJtb3VudFkiLCJjb250cm9sQWN0aXZhdGlvbiIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwibW91c2VQb3NpdGlvblByZXZpb3VzIiwiaXNBbnl0aGluZ1NjYWxpbmciLCJpc0FueXRoaW5nUm90YXRpbmciLCJnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsImNvbnRhaW5lckhlaWdodCIsImNvbnRhaW5lcldpZHRoIiwiaXNTdGFnZVNlbGVjdGVkIiwiaXNTdGFnZU5hbWVIb3ZlcmluZyIsImlzTW91c2VEb3duIiwibGFzdE1vdXNlRG93blRpbWUiLCJsYXN0TW91c2VEb3duUG9zaXRpb24iLCJsYXN0TW91c2VVcFBvc2l0aW9uIiwibGFzdE1vdXNlVXBUaW1lIiwiaXNNb3VzZURyYWdnaW5nIiwiaXNLZXlTaGlmdERvd24iLCJpc0tleUN0cmxEb3duIiwiaXNLZXlBbHREb3duIiwiaXNLZXlDb21tYW5kRG93biIsImlzS2V5U3BhY2VEb3duIiwicGFuWCIsInBhblkiLCJvcmlnaW5hbFBhblgiLCJvcmlnaW5hbFBhblkiLCJ6b29tWFkiLCJjb21tZW50cyIsImRvU2hvd0NvbW1lbnRzIiwidGFyZ2V0RWxlbWVudCIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsImFjdGl2ZURyYXdpbmdUb29sIiwiZHJhd2luZ0lzTW9kYWwiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJ3aW5kb3ciLCJlbnZveSIsIldlYlNvY2tldCIsInNldFN0YWdlVHJhbnNmb3JtIiwiem9vbSIsInBhbiIsIngiLCJ5IiwiX2NvbW1lbnRzIiwiX2N0eG1lbnUiLCJfcGxheWluZyIsIl9zdG9wd2F0Y2giLCJfbGFzdEF1dGhvcml0YXRpdmVGcmFtZSIsIl9sYXN0U2VsZWN0ZWRFbGVtZW50IiwiX2NsaXBib2FyZEFjdGlvbkxvY2siLCJkcmF3TG9vcCIsImJpbmQiLCJkcmF3IiwiX2hhaWt1UmVuZGVyZXIiLCJfaGFpa3VDb250ZXh0IiwidGltZWxpbmVzIiwidGVtcGxhdGUiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJjaGlsZHJlbiIsIm9wdGlvbnMiLCJjYWNoZSIsInNlZWQiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwicmVzZXRDb250YWluZXJEaW1lbnNpb25zIiwiZ2xhc3MiLCJvbiIsInRpbWVsaW5lQ2hhbm5lbCIsImhhbmRsZVRpbWVsaW5lRGlkUGxheSIsImhhbmRsZVRpbWVsaW5lRGlkUGF1c2UiLCJoYW5kbGVUaW1lbGluZURpZFNlZWsiLCJjbGllbnQiLCJ0b3VyQ2xpZW50Iiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiY29uc29sZSIsIkRhdGUiLCJub3ciLCJmcmFtZURhdGEiLCJmcmFtZSIsImZvcmNlU2VlayIsInNlZWtNcyIsImZwcyIsImJhc2VNcyIsImRlbHRhTXMiLCJNYXRoIiwicm91bmQiLCJfc2V0VGltZWxpbmVUaW1lVmFsdWUiLCJyZWZzIiwib3ZlcmxheSIsImRyYXdPdmVybGF5cyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJtb3VudCIsImZyZWV6ZSIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsImNvbnRleHRNZW51IiwibmV3TW91bnRTaXplIiwiZ2V0Q29udGV4dFNpemUiLCJzZXRTdGF0ZSIsIndpZHRoIiwiaGVpZ2h0Iiwic2l6ZURlc2NyaXB0b3IiLCJ0aW1lbGluZU5hbWUiLCJ0aW1lbGluZVRpbWUiLCJnZXRNb3VudCIsImlzUmVsb2FkaW5nQ29kZSIsInVwZGF0ZWRBcnRib2FyZFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwicGFzdGVFdmVudCIsImluZm8iLCJwcmV2ZW50RGVmYXVsdCIsInNlbmQiLCJ0eXBlIiwibmFtZSIsImZyb20iLCJkYXRhIiwiaGFuZGxlVmlydHVhbENsaXBib2FyZCIsImNsaXBib2FyZEFjdGlvbiIsIm1heWJlQ2xpcGJvYXJkRXZlbnQiLCJjbGlwYm9hcmRQYXlsb2FkIiwiZ2V0Q2xpcGJvYXJkUGF5bG9hZCIsImN1dCIsInNlcmlhbGl6ZWRQYXlsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlVGV4dCIsImNvbXBvbmVudElkIiwiX2VsZW1lbnRzIiwiZmluZCIsImNhbGwiLCJtZXNzYWdlIiwib2xkVHJhbnNmb3JtIiwibW9kdWxlUmVwbGFjZSIsImVyciIsImdldFN0YWdlVHJhbnNmb3JtIiwicGFyYW1zIiwibWV0aG9kIiwiY2IiLCJjYWxsTWV0aG9kIiwibG9hZCIsImFjdGlvbiIsImV2ZW50IiwiYnVpbGQiLCJfbWVudSIsImxhc3RYIiwibGFzdFkiLCJyZWJ1aWxkIiwic2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IiLCJ0aHJvdHRsZSIsImhhbmRsZVdpbmRvd1Jlc2l6ZSIsIndpbmRvd01vdXNlVXBIYW5kbGVyIiwid2luZG93TW91c2VNb3ZlSGFuZGxlciIsIndpbmRvd01vdXNlRG93bkhhbmRsZXIiLCJ3aW5kb3dDbGlja0hhbmRsZXIiLCJ3aW5kb3dEYmxDbGlja0hhbmRsZXIiLCJ3aW5kb3dLZXlEb3duSGFuZGxlciIsIndpbmRvd0tleVVwSGFuZGxlciIsIndpbmRvd01vdXNlT3V0SGFuZGxlciIsIm9uZXJyb3IiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJjbGlja0V2ZW50IiwiZXZlbnROYW1lIiwiaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkIiwic2VsZWN0b3JOYW1lIiwidWlkIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiZHgiLCJkeSIsIm5hdGl2ZUV2ZW50IiwiaXNQcmV2aWV3TW9kZSIsInNvdXJjZSIsInJlbGF0ZWRUYXJnZXQiLCJ0b0VsZW1lbnQiLCJub2RlTmFtZSIsImhvdmVyZWQiLCJkZXF1ZXVlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImhhbmRsZU1vdXNlRG93biIsImhhbmRsZUNsaWNrIiwiaGFuZGxlRG91YmxlQ2xpY2siLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlS2V5VXAiLCJtb3VzZWRvd25FdmVudCIsImJ1dHRvbiIsIm1vdXNlUG9zIiwic3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIiwiaW5zdGFudGlhdGVDb21wb25lbnQiLCJtaW5pbWl6ZWQiLCJtZXRhZGF0YSIsImluZGV4IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInBhcmVudE5vZGUiLCJ1bnNlbGVjdEFsbEVsZW1lbnRzIiwiaGFpa3VJZCIsImNvbnRhaW5lZCIsIndoZXJlIiwiaXNTZWxlY3RlZCIsInNlbGVjdEVsZW1lbnQiLCJtb3VzZXVwRXZlbnQiLCJoYW5kbGVEcmFnU3RvcCIsImRvdWJsZUNsaWNrRXZlbnQiLCJpc0Rvd24iLCJrZXlFdmVudCIsImRlbHRhIiwic2hpZnRLZXkiLCJmb3JFYWNoIiwibW92ZSIsImV2ZW50SGFuZGxlckVkaXRvciIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsIndoaWNoIiwiaGFuZGxlS2V5RXNjYXBlIiwiaGFuZGxlS2V5U3BhY2UiLCJoYW5kbGVLZXlMZWZ0QXJyb3ciLCJoYW5kbGVLZXlVcEFycm93IiwiaGFuZGxlS2V5UmlnaHRBcnJvdyIsImhhbmRsZUtleURvd25BcnJvdyIsImhhbmRsZUtleURlbGV0ZSIsImhhbmRsZUtleUVudGVyIiwiaGFuZGxlS2V5U2hpZnQiLCJoYW5kbGVLZXlDdHJsIiwiaGFuZGxlS2V5QWx0IiwiaGFuZGxlS2V5Q29tbWFuZCIsImNtZCIsInNoaWZ0IiwiY3RybCIsImFsdCIsImFydGJvYXJkIiwiZmluZFJvb3RzIiwiY2xpY2tlZCIsImFkZCIsInNlbGVjdCIsIm1vdXNlbW92ZUV2ZW50IiwiaGFuZGxlRHJhZ1N0YXJ0Iiwic3RhZ2VNb3VzZURvd24iLCJwZXJmb3JtUGFuIiwiY2xpZW50WCIsImNsaWVudFkiLCJzZWxlY3RlZCIsImxlbmd0aCIsImRyYWciLCJyZW1vdmUiLCJjb250YWluZXIiLCJ3IiwiY2xpZW50V2lkdGgiLCJoIiwiY2xpZW50SGVpZ2h0IiwicmlnaHQiLCJib3R0b20iLCJnZXRBcnRib2FyZFJlY3QiLCJhY3RpdmF0aW9uSW5mbyIsImFyYm9hcmQiLCJjb29yZHMiLCJtb3VzZUV2ZW50IiwiYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZSIsImZvcmNlIiwiYWxsIiwiY3JlYXRlQ29udGFpbmVyIiwicGFydHMiLCJidWlsZERyYXduT3ZlcmxheXMiLCJpZCIsInN0eWxlIiwidHJhbnNmb3JtIiwicG9zaXRpb24iLCJvdmVyZmxvdyIsImNvbXBvbmVudCIsIl9yZWdpc3RlcmVkRWxlbWVudEV2ZW50TGlzdGVuZXJzIiwicmVuZGVyIiwib3ZlcmxheXMiLCJwb2ludHMiLCJpc1JlbmRlcmFibGVUeXBlIiwiZ2V0UG9pbnRzVHJhbnNmb3JtZWQiLCJyZW5kZXJNb3JwaFBvaW50c092ZXJsYXkiLCJnZXRCb3hQb2ludHNUcmFuc2Zvcm1lZCIsInJvdGF0aW9uWiIsImdldFByb3BlcnR5VmFsdWUiLCJzY2FsZVgiLCJ1bmRlZmluZWQiLCJzY2FsZVkiLCJyZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5IiwiY2FuUm90YXRlIiwicG9pbnQiLCJwdXNoIiwiZ2V0Qm91bmRpbmdCb3hQb2ludHMiLCJyZW5kZXJDb250cm9sUG9pbnQiLCJ4MSIsInkxIiwieDIiLCJ5MiIsInN0cm9rZSIsIkRBUktFUl9ST0NLMiIsInBvaW50SW5kZXgiLCJfY29udHJvbFBvaW50TGlzdGVuZXJzIiwiY29udHJvbEtleSIsImxpc3RlbmVyRXZlbnQiLCJoYW5kbGVDbGFzcyIsInNjYWxlIiwia2V5IiwiY2xhc3MiLCJvbm1vdXNlZG93biIsImNyZWF0ZUNvbnRyb2xQb2ludExpc3RlbmVyIiwicG9pbnRlckV2ZW50cyIsImJvcmRlciIsImJhY2tncm91bmRDb2xvciIsIlJPQ0siLCJib3hTaGFkb3ciLCJTSEFEWSIsImJvcmRlclJhZGl1cyIsImlzUm90YXRpb25Nb2RlT24iLCJkZWZhdWx0UG9pbnRHcm91cCIsImluZGV4T2ZQb2ludCIsImtleU9mUG9pbnRHcm91cCIsIkVycm9yIiwic3BlY2lmaWVkUG9pbnRHcm91cCIsInJvdGF0aW9uRGVncmVlcyIsImdldFJvdGF0aW9uSW4zNjAiLCJwaGFzZU51bWJlciIsIm9mZnNldEluZGV4Iiwic2hpZnRlZEluZGV4IiwiY2FuQ29udHJvbEhhbmRsZXMiLCJjb3JuZXJzIiwibmV4dCIsInJlbmRlckxpbmUiLCJnZXRIYW5kbGVDbGFzcyIsImNvbnRyb2xJbmRleCIsInNlbGVjdGVkRWxlbWVudHMiLCJzZWxlY3RlZEVsZW1lbnQiLCJhIiwiYyIsImQiLCJqb2luIiwiX2ludGVyYWN0aW9uTW9kZSIsImRyYXdpbmdDbGFzc05hbWUiLCJ6SW5kZXgiLCJjb2xvciIsImZvbnRTaXplIiwiZ2V0R2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3MiLCJtb3VzZURvd24iLCJoaWRlRXZlbnRIYW5kbGVyc0VkaXRvciIsImN1cnNvciIsImdldEN1cnNvckNzc1J1bGUiLCJ1c2VyU2VsZWN0IiwiaGFuZGxlQ2xpY2tTdGFnZU5hbWUiLCJoYW5kbGVNb3VzZU92ZXJTdGFnZU5hbWUiLCJoYW5kbGVNb3VzZU91dFN0YWdlTmFtZSIsIkZBVEhFUl9DT0FMIiwicHJvamVjdE5hbWUiLCJzdHJva2VXaWR0aCIsImZpbGwiLCJMSUdIVF9QSU5LIiwib3BhY2l0eSIsIm1hcCIsImNvbW1lbnQiLCJzYXZlRXZlbnRIYW5kbGVyIiwiUkVEIiwiU1VOU1RPTkUiLCJ0ZXh0QWxpZ24iLCJwYWRkaW5nIiwid2hpdGVTcGFjZSIsInRleHRUcmFuc2Zvcm0iLCJSRURfREFSS0VSIiwiZm9udEZhbWlseSIsImZvbnRXZWlnaHQiLCJwYWRkaW5nTGVmdCIsIkNvbXBvbmVudCIsInByb3BUeXBlcyIsIlByb3BUeXBlcyIsIm9iamVjdCIsInN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O2VBRXNCQSxRQUFRLFVBQVIsQztJQUFkQyxTLFlBQUFBLFM7O0FBRVIsSUFBTUMsMkJBQTJCO0FBQy9CLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUQ0QjtBQUUvQixLQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FGNEIsRUFFRjtBQUM3QixLQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FINEIsRUFHRjtBQUM3QixLQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FKNEIsQ0FJSDs7O0FBRzlCO0FBUGlDLENBQWpDO0lBUWFDLEssV0FBQUEsSzs7O0FBQ1gsaUJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSw4R0FDWkEsS0FEWTs7QUFHbEIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVY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QkFBTyxFQVJGO0FBU0w4USwrQkFBYTtBQVRSLGlCQURUO0FBWUUseUJBQVMsbUJBQU07QUFDYiwwQkFBSy9RLFFBQUwsQ0FBYyxFQUFFbkgsT0FBTyxJQUFULEVBQWQ7QUFDRCxpQkFkSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGFBaEJBO0FBZ0NXO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFPO0FBQVAsYUFoQ1g7QUFpQ0MsaUJBQUtELEtBQUwsQ0FBV0M7QUFqQ1osV0FESCxHQW9DRztBQXhRTjtBQWpCRixPQURGO0FBOFJEOzs7O0VBMzNDd0IsZ0JBQU1tWSxTOztBQTgzQ2pDdFksTUFBTXVZLFNBQU4sR0FBa0I7QUFDaEI1VixjQUFZLGdCQUFNNlYsU0FBTixDQUFnQkMsTUFEWjtBQUVoQjdWLGFBQVcsZ0JBQU00VixTQUFOLENBQWdCQyxNQUZYO0FBR2hCL1YsVUFBUSxnQkFBTThWLFNBQU4sQ0FBZ0JFO0FBSFIsQ0FBbEI7O2tCQU1lLHNCQUFPMVksS0FBUCxDIiwiZmlsZSI6IkdsYXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBIYWlrdURPTVJlbmRlcmVyIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlbmRlcmVycy9kb20nXG5pbXBvcnQgSGFpa3VDb250ZXh0IGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL0hhaWt1Q29udGV4dCdcbmltcG9ydCBBY3RpdmVDb21wb25lbnQgZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvbW9kZWwvQWN0aXZlQ29tcG9uZW50J1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuaW1wb3J0IENvbW1lbnQgZnJvbSAnLi9Db21tZW50J1xuaW1wb3J0IEV2ZW50SGFuZGxlckVkaXRvciBmcm9tICcuL0V2ZW50SGFuZGxlckVkaXRvcidcbmltcG9ydCBDb21tZW50cyBmcm9tICcuL21vZGVscy9Db21tZW50cydcbmltcG9ydCBDb250ZXh0TWVudSBmcm9tICcuL21vZGVscy9Db250ZXh0TWVudSdcbmltcG9ydCBnZXRMb2NhbERvbUV2ZW50UG9zaXRpb24gZnJvbSAnLi9oZWxwZXJzL2dldExvY2FsRG9tRXZlbnRQb3NpdGlvbidcblxuY29uc3QgeyBjbGlwYm9hcmQgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcblxuY29uc3QgQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTID0ge1xuICAwOiBbMCwgMSwgMiwgNSwgOCwgNywgNiwgM10sXG4gIDE6IFs2LCA3LCA4LCA1LCAyLCAxLCAwLCAzXSwgLy8gZmxpcHBlZCB2ZXJ0aWNhbFxuICAyOiBbMiwgMSwgMCwgMywgNiwgNywgOCwgNV0sIC8vIGZsaXBwZWQgaG9yaXpvbnRhbFxuICAzOiBbOCwgNywgNiwgMywgMCwgMSwgMiwgNV0gLy8gZmxpcHBlZCBob3Jpem9udGFsICsgdmVydGljYWxcbn1cblxuLy8gVGhlIGNsYXNzIGlzIGV4cG9ydGVkIGFsc28gX3dpdGhvdXRfIHRoZSByYWRpdW0gd3JhcHBlciB0byBhbGxvdyBqc2RvbSB0ZXN0aW5nXG5leHBvcnQgY2xhc3MgR2xhc3MgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBlcnJvcjogbnVsbCxcbiAgICAgIG1vdW50V2lkdGg6IDU1MCxcbiAgICAgIG1vdW50SGVpZ2h0OiA0MDAsXG4gICAgICBtb3VudFg6IDAsXG4gICAgICBtb3VudFk6IDAsXG4gICAgICBjb250cm9sQWN0aXZhdGlvbjogbnVsbCxcbiAgICAgIG1vdXNlUG9zaXRpb25DdXJyZW50OiBudWxsLFxuICAgICAgbW91c2VQb3NpdGlvblByZXZpb3VzOiBudWxsLFxuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIGdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzOiAnJyxcbiAgICAgIGNvbnRhaW5lckhlaWdodDogMCxcbiAgICAgIGNvbnRhaW5lcldpZHRoOiAwLFxuICAgICAgaXNTdGFnZVNlbGVjdGVkOiBmYWxzZSxcbiAgICAgIGlzU3RhZ2VOYW1lSG92ZXJpbmc6IGZhbHNlLFxuICAgICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgICAgbGFzdE1vdXNlRG93blRpbWU6IG51bGwsXG4gICAgICBsYXN0TW91c2VEb3duUG9zaXRpb246IG51bGwsXG4gICAgICBsYXN0TW91c2VVcFBvc2l0aW9uOiBudWxsLFxuICAgICAgbGFzdE1vdXNlVXBUaW1lOiBudWxsLFxuICAgICAgaXNNb3VzZURyYWdnaW5nOiBmYWxzZSxcbiAgICAgIGlzS2V5U2hpZnREb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5Q3RybERvd246IGZhbHNlLFxuICAgICAgaXNLZXlBbHREb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5Q29tbWFuZERvd246IGZhbHNlLFxuICAgICAgaXNLZXlTcGFjZURvd246IGZhbHNlLFxuICAgICAgcGFuWDogMCxcbiAgICAgIHBhblk6IDAsXG4gICAgICBvcmlnaW5hbFBhblg6IDAsXG4gICAgICBvcmlnaW5hbFBhblk6IDAsXG4gICAgICB6b29tWFk6IDEsXG4gICAgICBjb21tZW50czogW10sXG4gICAgICBkb1Nob3dDb21tZW50czogZmFsc2UsXG4gICAgICB0YXJnZXRFbGVtZW50OiBudWxsLFxuICAgICAgaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuOiBmYWxzZSxcbiAgICAgIGFjdGl2ZURyYXdpbmdUb29sOiAncG9pbnRlcicsXG4gICAgICBkcmF3aW5nSXNNb2RhbDogdHJ1ZVxuICAgIH1cblxuICAgIHRoaXMuX2NvbXBvbmVudCA9IG5ldyBBY3RpdmVDb21wb25lbnQoe1xuICAgICAgYWxpYXM6ICdnbGFzcycsXG4gICAgICBmb2xkZXI6IHRoaXMucHJvcHMuZm9sZGVyLFxuICAgICAgdXNlcmNvbmZpZzogdGhpcy5wcm9wcy51c2VyY29uZmlnLFxuICAgICAgd2Vic29ja2V0OiB0aGlzLnByb3BzLndlYnNvY2tldCxcbiAgICAgIHBsYXRmb3JtOiB3aW5kb3csXG4gICAgICBlbnZveTogdGhpcy5wcm9wcy5lbnZveSxcbiAgICAgIFdlYlNvY2tldDogd2luZG93LldlYlNvY2tldFxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0oe3pvb206IHRoaXMuc3RhdGUuem9vbVhZLCBwYW46IHt4OiB0aGlzLnN0YXRlLnBhblgsIHk6IHRoaXMuc3RhdGUucGFuWX19KVxuICAgIHRoaXMuX2NvbW1lbnRzID0gbmV3IENvbW1lbnRzKHRoaXMucHJvcHMuZm9sZGVyKVxuICAgIHRoaXMuX2N0eG1lbnUgPSBuZXcgQ29udGV4dE1lbnUod2luZG93LCB0aGlzKVxuXG4gICAgdGhpcy5fcGxheWluZyA9IGZhbHNlXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gbnVsbFxuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSAwXG5cbiAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gbnVsbFxuICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSBmYWxzZVxuXG4gICAgdGhpcy5kcmF3TG9vcCA9IHRoaXMuZHJhd0xvb3AuYmluZCh0aGlzKVxuICAgIHRoaXMuZHJhdyA9IHRoaXMuZHJhdy5iaW5kKHRoaXMpXG4gICAgdGhpcy5faGFpa3VSZW5kZXJlciA9IG5ldyBIYWlrdURPTVJlbmRlcmVyKClcbiAgICB0aGlzLl9oYWlrdUNvbnRleHQgPSBuZXcgSGFpa3VDb250ZXh0KG51bGwsIHRoaXMuX2hhaWt1UmVuZGVyZXIsIHt9LCB7IHRpbWVsaW5lczoge30sIHRlbXBsYXRlOiB7IGVsZW1lbnROYW1lOiAnZGl2JywgYXR0cmlidXRlczoge30sIGNoaWxkcmVuOiBbXSB9IH0sIHsgb3B0aW9uczogeyBjYWNoZToge30sIHNlZWQ6ICdhYmNkZScgfSB9KVxuXG4gICAgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzID0gdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzLmJpbmQodGhpcylcblxuICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcblxuICAgIHdpbmRvdy5nbGFzcyA9IHRoaXNcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dGltZWxpbmVDbGllbnRSZWFkeScsICh0aW1lbGluZUNoYW5uZWwpID0+IHtcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkUGxheScsIHRoaXMuaGFuZGxlVGltZWxpbmVEaWRQbGF5LmJpbmQodGhpcykpXG4gICAgICB0aW1lbGluZUNoYW5uZWwub24oJ2RpZFBhdXNlJywgdGhpcy5oYW5kbGVUaW1lbGluZURpZFBhdXNlLmJpbmQodGhpcykpXG4gICAgICB0aW1lbGluZUNoYW5uZWwub24oJ2RpZFNlZWsnLCB0aGlzLmhhbmRsZVRpbWVsaW5lRGlkU2Vlay5iaW5kKHRoaXMpKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRvdXJDbGllbnRSZWFkeScsIChjbGllbnQpID0+IHtcbiAgICAgIHRoaXMudG91ckNsaWVudCA9IGNsaWVudFxuICAgICAgdGhpcy50b3VyQ2xpZW50Lm9uKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgKHsgc2VsZWN0b3IsIHdlYnZpZXcgfSkge1xuICAgIGlmICh3ZWJ2aWV3ICE9PSAnZ2xhc3MnKSB7IHJldHVybiB9XG5cbiAgICB0cnkge1xuICAgICAgLy8gVE9ETzogZmluZCBpZiB0aGVyZSBpcyBhIGJldHRlciBzb2x1dGlvbiB0byB0aGlzIHNjYXBlIGhhdGNoXG4gICAgICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpXG4gICAgICBsZXQgeyB0b3AsIGxlZnQgfSA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgICAgdGhpcy50b3VyQ2xpZW50LnJlY2VpdmVFbGVtZW50Q29vcmRpbmF0ZXMoJ2dsYXNzJywgeyB0b3AsIGxlZnQgfSlcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZmV0Y2hpbmcgJHtzZWxlY3Rvcn0gaW4gd2VidmlldyAke3dlYnZpZXd9YClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVUaW1lbGluZURpZFBsYXkgKCkge1xuICAgIHRoaXMuX3BsYXlpbmcgPSB0cnVlXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gRGF0ZS5ub3coKVxuICB9XG5cbiAgaGFuZGxlVGltZWxpbmVEaWRQYXVzZSAoZnJhbWVEYXRhKSB7XG4gICAgdGhpcy5fcGxheWluZyA9IGZhbHNlXG4gICAgdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSA9IGZyYW1lRGF0YS5mcmFtZVxuICAgIHRoaXMuX3N0b3B3YXRjaCA9IERhdGUubm93KClcbiAgfVxuXG4gIGhhbmRsZVRpbWVsaW5lRGlkU2VlayAoZnJhbWVEYXRhKSB7XG4gICAgdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSA9IGZyYW1lRGF0YS5mcmFtZVxuICAgIHRoaXMuX3N0b3B3YXRjaCA9IERhdGUubm93KClcbiAgICB0aGlzLmRyYXcodHJ1ZSlcbiAgfVxuXG4gIGRyYXcgKGZvcmNlU2Vlaykge1xuICAgIGlmICh0aGlzLl9wbGF5aW5nIHx8IGZvcmNlU2Vlaykge1xuICAgICAgdmFyIHNlZWtNcyA9IDBcbiAgICAgIC8vIHRoaXMuX3N0b3B3YXRjaCBpcyBudWxsIHVubGVzcyB3ZSd2ZSByZWNlaXZlZCBhbiBhY3Rpb24gZnJvbSB0aGUgdGltZWxpbmUuXG4gICAgICAvLyBJZiB3ZSdyZSBkZXZlbG9waW5nIHRoZSBnbGFzcyBzb2xvLCBpLmUuIHdpdGhvdXQgYSBjb25uZWN0aW9uIHRvIGVudm95IHdoaWNoXG4gICAgICAvLyBwcm92aWRlcyB0aGUgc3lzdGVtIGNsb2NrLCB3ZSBjYW4ganVzdCBsb2NrIHRoZSB0aW1lIHZhbHVlIHRvIHplcm8gYXMgYSBoYWNrLlxuICAgICAgLy8gVE9ETzogV291bGQgYmUgbmljZSB0byBhbGxvdyBmdWxsLWZsZWRnZWQgc29sbyBkZXZlbG9wbWVudCBvZiBnbGFzcy4uLlxuICAgICAgaWYgKHRoaXMuX3N0b3B3YXRjaCAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgZnBzID0gNjAgLy8gVE9ETzogIHN1cHBvcnQgdmFyaWFibGVcbiAgICAgICAgdmFyIGJhc2VNcyA9IHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgKiAxMDAwIC8gZnBzXG4gICAgICAgIHZhciBkZWx0YU1zID0gdGhpcy5fcGxheWluZyA/IERhdGUubm93KCkgLSB0aGlzLl9zdG9wd2F0Y2ggOiAwXG4gICAgICAgIHNlZWtNcyA9IGJhc2VNcyArIGRlbHRhTXNcbiAgICAgIH1cblxuICAgICAgLy8gVGhpcyByb3VuZGluZyBpcyByZXF1aXJlZCBvdGhlcndpc2Ugd2UnbGwgc2VlIGJpemFycmUgYmVoYXZpb3Igb24gc3RhZ2UuXG4gICAgICAvLyBJIHRoaW5rIGl0J3MgYmVjYXVzZSBzb21lIHBhcnQgb2YgdGhlIHBsYXllcidzIGNhY2hpbmcgb3IgdHJhbnNpdGlvbiBsb2dpY1xuICAgICAgLy8gd2hpY2ggd2FudHMgdGhpbmdzIHRvIGJlIHJvdW5kIG51bWJlcnMuIElmIHdlIGRvbid0IHJvdW5kIHRoaXMsIGkuZS4gY29udmVydFxuICAgICAgLy8gMTYuNjY2IC0+IDE3IGFuZCAzMy4zMzMgLT4gMzMsIHRoZW4gdGhlIHBsYXllciB3b24ndCByZW5kZXIgdGhvc2UgZnJhbWVzLFxuICAgICAgLy8gd2hpY2ggbWVhbnMgdGhlIHVzZXIgd2lsbCBoYXZlIHRyb3VibGUgbW92aW5nIHRoaW5ncyBvbiBzdGFnZSBhdCB0aG9zZSB0aW1lcy5cbiAgICAgIHNlZWtNcyA9IE1hdGgucm91bmQoc2Vla01zKVxuXG4gICAgICB0aGlzLl9jb21wb25lbnQuX3NldFRpbWVsaW5lVGltZVZhbHVlKHNlZWtNcywgZm9yY2VTZWVrKVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJlZnMub3ZlcmxheSkge1xuICAgICAgdGhpcy5kcmF3T3ZlcmxheXMoZm9yY2VTZWVrKVxuICAgIH1cbiAgfVxuXG4gIGRyYXdMb29wICgpIHtcbiAgICB0aGlzLmRyYXcoKVxuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5kcmF3TG9vcClcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50ICgpIHtcbiAgICB0aGlzLl9jb21wb25lbnQubW91bnRBcHBsaWNhdGlvbih0aGlzLnJlZnMubW91bnQsIHsgb3B0aW9uczogeyBmcmVlemU6IHRydWUsIG92ZXJmbG93WDogJ3Zpc2libGUnLCBvdmVyZmxvd1k6ICd2aXNpYmxlJywgY29udGV4dE1lbnU6ICdkaXNhYmxlZCcgfSB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6bW91bnRlZCcsICgpID0+IHtcbiAgICAgIHZhciBuZXdNb3VudFNpemUgPSB0aGlzLl9jb21wb25lbnQuZ2V0Q29udGV4dFNpemUoKVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91bnRXaWR0aDogbmV3TW91bnRTaXplLndpZHRoLFxuICAgICAgICBtb3VudEhlaWdodDogbmV3TW91bnRTaXplLmhlaWdodFxuICAgICAgfSlcblxuICAgICAgdGhpcy5kcmF3TG9vcCgpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50OnVwZGF0ZWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLmRyYXcodHJ1ZSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdhcnRib2FyZDpyZXNpemVkJywgKHNpemVEZXNjcmlwdG9yKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91bnRXaWR0aDogc2l6ZURlc2NyaXB0b3Iud2lkdGgsXG4gICAgICAgIG1vdW50SGVpZ2h0OiBzaXplRGVzY3JpcHRvci5oZWlnaHRcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbigndGltZTpjaGFuZ2UnLCAodGltZWxpbmVOYW1lLCB0aW1lbGluZVRpbWUpID0+IHtcbiAgICAgIGlmICh0aGlzLl9jb21wb25lbnQgJiYgdGhpcy5fY29tcG9uZW50LmdldE1vdW50KCkgJiYgIXRoaXMuX2NvbXBvbmVudC5pc1JlbG9hZGluZ0NvZGUpIHtcbiAgICAgICAgdmFyIHVwZGF0ZWRBcnRib2FyZFNpemUgPSB0aGlzLl9jb21wb25lbnQuZ2V0Q29udGV4dFNpemUoKVxuICAgICAgICBpZiAodXBkYXRlZEFydGJvYXJkU2l6ZSAmJiB1cGRhdGVkQXJ0Ym9hcmRTaXplLndpZHRoICYmIHVwZGF0ZWRBcnRib2FyZFNpemUuaGVpZ2h0KSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBtb3VudFdpZHRoOiB1cGRhdGVkQXJ0Ym9hcmRTaXplLndpZHRoLFxuICAgICAgICAgICAgbW91bnRIZWlnaHQ6IHVwZGF0ZWRBcnRib2FyZFNpemUuaGVpZ2h0XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2FydGJvYXJkOnNpemUtY2hhbmdlZCcsIChzaXplRGVzY3JpcHRvcikgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdW50V2lkdGg6IHNpemVEZXNjcmlwdG9yLndpZHRoLFxuICAgICAgICBtb3VudEhlaWdodDogc2l6ZURlc2NyaXB0b3IuaGVpZ2h0XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvLyBQYXN0ZWFibGUgdGhpbmdzIGFyZSBzdG9yZWQgYXQgdGhlIGdsb2JhbCBsZXZlbCBpbiB0aGUgY2xpcGJvYXJkIGJ1dCB3ZSBuZWVkIHRoYXQgYWN0aW9uIHRvIGZpcmUgZnJvbSB0aGUgdG9wIGxldmVsXG4gICAgLy8gc28gdGhhdCBhbGwgdGhlIHZpZXdzIGdldCB0aGUgbWVzc2FnZSwgc28gd2UgZW1pdCB0aGlzIGFzIGFuIGV2ZW50IGFuZCB0aGVuIHdhaXQgZm9yIHRoZSBjYWxsIHRvIHBhc3RlVGhpbmdcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdwYXN0ZScsIChwYXN0ZUV2ZW50KSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gcGFzdGUgaGVhcmQnKVxuICAgICAgLy8gTm90aWZ5IGNyZWF0b3IgdGhhdCB3ZSBoYXZlIHNvbWUgY29udGVudCB0aGF0IHRoZSBwZXJzb24gd2lzaGVzIHRvIHBhc3RlIG9uIHRoZSBzdGFnZTtcbiAgICAgIC8vIHRoZSB0b3AgbGV2ZWwgbmVlZHMgdG8gaGFuZGxlIHRoaXMgYmVjYXVzZSBpdCBkb2VzIGNvbnRlbnQgdHlwZSBkZXRlY3Rpb24uXG4gICAgICBwYXN0ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICBkYXRhOiBudWxsIC8vIFRoaXMgY2FuIGhvbGQgY29vcmRpbmF0ZXMgZm9yIHRoZSBsb2NhdGlvbiBvZiB0aGUgcGFzdGVcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQgKGNsaXBib2FyZEFjdGlvbiwgbWF5YmVDbGlwYm9hcmRFdmVudCkge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGhhbmRsaW5nIGNsaXBib2FyZCBhY3Rpb24nLCBjbGlwYm9hcmRBY3Rpb24pXG5cbiAgICAgIC8vIEF2b2lkIGluZmluaXRlIGxvb3BzIGR1ZSB0byB0aGUgd2F5IHdlIGxldmVyYWdlIGV4ZWNDb21tYW5kXG4gICAgICBpZiAodGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jaykge1xuICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IHRydWVcblxuICAgICAgaWYgKHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQpIHtcbiAgICAgICAgLy8gR290dGEgZ3JhYiBfYmVmb3JlIGN1dHRpbmdfIG9yIHdlJ2xsIGVuZCB1cCB3aXRoIGEgcGFydGlhbCBvYmplY3QgdGhhdCB3b24ndCB3b3JrXG4gICAgICAgIGxldCBjbGlwYm9hcmRQYXlsb2FkID0gdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudC5nZXRDbGlwYm9hcmRQYXlsb2FkKCdnbGFzcycpXG5cbiAgICAgICAgaWYgKGNsaXBib2FyZEFjdGlvbiA9PT0gJ2N1dCcpIHtcbiAgICAgICAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50LmN1dCgpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VyaWFsaXplZFBheWxvYWQgPSBKU09OLnN0cmluZ2lmeShbJ2FwcGxpY2F0aW9uL2hhaWt1JywgY2xpcGJvYXJkUGF5bG9hZF0pXG5cbiAgICAgICAgY2xpcGJvYXJkLndyaXRlVGV4dChzZXJpYWxpemVkUGF5bG9hZClcblxuICAgICAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gZmFsc2VcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSBmYWxzZVxuICAgICAgfVxuICAgIH1cblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2N1dCcsIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQuYmluZCh0aGlzLCAnY3V0JykpXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY29weScsIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQuYmluZCh0aGlzLCAnY29weScpKVxuXG4gICAgLy8gVGhpcyBmaXJlcyB3aGVuIHRoZSBjb250ZXh0IG1lbnUgY3V0L2NvcHkgYWN0aW9uIGhhcyBiZWVuIGZpcmVkIC0gbm90IGEga2V5Ym9hcmQgYWN0aW9uLlxuICAgIC8vIFRoaXMgZmlyZXMgd2l0aCBjdXQgT1IgY29weS4gSW4gY2FzZSBvZiBjdXQsIHRoZSBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gLmN1dCgpIVxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpjb3B5JywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gZWxlbWVudDpjb3B5JywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kKGNvbXBvbmVudElkKVxuICAgICAgaGFuZGxlVmlydHVhbENsaXBib2FyZC5jYWxsKHRoaXMsICdjb3B5JylcbiAgICB9KVxuXG4gICAgLy8gU2luY2UgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgZWxlbWVudCBjYW4gYmUgZGVsZXRlZCBmcm9tIHRoZSBnbG9iYWwgbWVudSwgd2UgbmVlZCB0byBrZWVwIGl0IHRoZXJlXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gZWxlbWVudDpzZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZChjb21wb25lbnRJZClcbiAgICB9KVxuXG4gICAgLy8gU2luY2UgdGhlIGN1cnJlbnQgc2VsZWN0ZWQgZWxlbWVudCBjYW4gYmUgZGVsZXRlZCBmcm9tIHRoZSBnbG9iYWwgbWVudSwgd2UgbmVlZCBjbGVhciBpdCB0aGVyZSB0b29cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6dW5zZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6dW5zZWxlY3RlZCcsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IG51bGxcbiAgICAgIHRoaXMuZHJhdyh0cnVlKVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignYnJvYWRjYXN0JywgKG1lc3NhZ2UpID0+IHtcbiAgICAgIHZhciBvbGRUcmFuc2Zvcm0gLy8gRGVmaW5lZCBiZWxvdyAvLyBsaW50ZXJcblxuICAgICAgc3dpdGNoIChtZXNzYWdlLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnY29tcG9uZW50OnJlbG9hZCc6XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5tb2R1bGVSZXBsYWNlKChlcnIpID0+IHtcbiAgICAgICAgICAgIC8vIE5vdGlmeSB0aGUgcGx1bWJpbmcgdGhhdCB0aGUgbW9kdWxlIHJlcGxhY2VtZW50IGhlcmUgaGFzIGZpbmlzaGVkLCB3aGljaCBzaG91bGQgcmVhY3RpdmF0ZVxuICAgICAgICAgICAgLy8gdGhlIHVuZG8vcmVkbyBxdWV1ZXMgd2hpY2ggc2hvdWxkIGJlIHdhaXRpbmcgZm9yIHRoaXMgdG8gZmluaXNoXG4gICAgICAgICAgICAvLyBOb3RlIGhvdyB3ZSBkbyB0aGlzIHdoZXRoZXIgb3Igbm90IHdlIGdvdCBhbiBlcnJvciBmcm9tIHRoZSBhY3Rpb25cbiAgICAgICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgICAgICAgbmFtZTogJ2NvbXBvbmVudDpyZWxvYWQ6Y29tcGxldGUnLFxuICAgICAgICAgICAgICBmcm9tOiAnZ2xhc3MnXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIGFydGJvYXJkIHNpemUgbWF5IGhhdmUgY2hhbmdlZCBhcyBhIHBhcnQgb2YgdGhhdCwgYW5kIHNpbmNlIHRoZXJlIGFyZSB0d28gc291cmNlcyBvZlxuICAgICAgICAgICAgLy8gdHJ1dGggZm9yIHRoaXMgKGFjdHVhbCBhcnRib2FyZCwgUmVhY3QgbW91bnQgZm9yIGFydGJvYXJkKSwgd2UgaGF2ZSB0byB1cGRhdGUgaXQgaGVyZS5cbiAgICAgICAgICAgIHZhciB1cGRhdGVkQXJ0Ym9hcmRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBtb3VudFdpZHRoOiB1cGRhdGVkQXJ0Ym9hcmRTaXplLndpZHRoLFxuICAgICAgICAgICAgICBtb3VudEhlaWdodDogdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHRcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcblxuICAgICAgICBjYXNlICd2aWV3Onpvb20taW4nOlxuICAgICAgICAgIG9sZFRyYW5zZm9ybSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTdGFnZVRyYW5zZm9ybSgpXG4gICAgICAgICAgb2xkVHJhbnNmb3JtLnpvb20gPSB0aGlzLnN0YXRlLnpvb21YWSAqIDEuMjVcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0ob2xkVHJhbnNmb3JtKVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgem9vbVhZOiB0aGlzLnN0YXRlLnpvb21YWSAqIDEuMjUgfSlcblxuICAgICAgICBjYXNlICd2aWV3Onpvb20tb3V0JzpcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgICAgICAgIG9sZFRyYW5zZm9ybS56b29tID0gdGhpcy5zdGF0ZS56b29tWFkgLyAxLjI1XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHpvb21YWTogdGhpcy5zdGF0ZS56b29tWFkgLyAxLjI1IH0pXG5cbiAgICAgICAgY2FzZSAnZHJhd2luZzpzZXRBY3RpdmUnOlxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIGFjdGl2ZURyYXdpbmdUb29sOiBtZXNzYWdlLnBhcmFtc1swXSxcbiAgICAgICAgICAgIGRyYXdpbmdJc01vZGFsOiBtZXNzYWdlLnBhcmFtc1sxXVxuICAgICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdtZXRob2QnLCAobWV0aG9kLCBwYXJhbXMsIGNiKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50LmNhbGxNZXRob2QobWV0aG9kLCBwYXJhbXMsIGNiKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21tZW50cy5sb2FkKChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIHJldHVybiB2b2lkICgwKVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbW1lbnRzOiB0aGlzLl9jb21tZW50cy5jb21tZW50cyB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jdHhtZW51Lm9uKCdjbGljaycsIChhY3Rpb24sIGV2ZW50LCBlbGVtZW50KSA9PiB7XG4gICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBjYXNlICdBZGQgQ29tbWVudCc6XG4gICAgICAgICAgdGhpcy5fY29tbWVudHMuYnVpbGQoeyB4OiB0aGlzLl9jdHhtZW51Ll9tZW51Lmxhc3RYLCB5OiB0aGlzLl9jdHhtZW51Ll9tZW51Lmxhc3RZIH0pXG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbW1lbnRzOiB0aGlzLl9jb21tZW50cy5jb21tZW50cywgZG9TaG93Q29tbWVudHM6IHRydWUgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4bWVudS5yZWJ1aWxkKHRoaXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdIaWRlIENvbW1lbnRzJzpcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZG9TaG93Q29tbWVudHM6ICF0aGlzLnN0YXRlLmRvU2hvd0NvbW1lbnRzIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eG1lbnUucmVidWlsZCh0aGlzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnU2hvdyBDb21tZW50cyc6XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRvU2hvd0NvbW1lbnRzOiAhdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHhtZW51LnJlYnVpbGQodGhpcylcbiAgICAgICAgICB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1Nob3cgRXZlbnQgTGlzdGVuZXJzJzpcbiAgICAgICAgICB0aGlzLnNob3dFdmVudEhhbmRsZXJzRWRpdG9yKGV2ZW50LCBlbGVtZW50KVxuICAgICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIFBhc3RlYWJsZSB0aGluZ3MgYXJlIHN0b3JlZCBhdCB0aGUgZ2xvYmFsIGxldmVsIGluIHRoZSBjbGlwYm9hcmQgYnV0IHdlIG5lZWQgdGhhdCBhY3Rpb24gdG8gZmlyZSBmcm9tIHRoZSB0b3AgbGV2ZWxcbiAgICAvLyBzbyB0aGF0IGFsbCB0aGUgdmlld3MgZ2V0IHRoZSBtZXNzYWdlLCBzbyB3ZSBlbWl0IHRoaXMgYXMgYW4gZXZlbnQgYW5kIHRoZW4gd2FpdCBmb3IgdGhlIGNhbGwgdG8gcGFzdGVUaGluZ1xuICAgIHRoaXMuX2N0eG1lbnUub24oJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLCAoZGF0YSkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgIGRhdGE6IGRhdGFcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBsb2Rhc2gudGhyb3R0bGUoKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuaGFuZGxlV2luZG93UmVzaXplKClcbiAgICB9KSwgNjQpXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMud2luZG93TW91c2VVcEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy53aW5kb3dNb3VzZU1vdmVIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLndpbmRvd01vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMud2luZG93TW91c2VEb3duSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMud2luZG93Q2xpY2tIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgdGhpcy53aW5kb3dEYmxDbGlja0hhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMud2luZG93S2V5RG93bkhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCB0aGlzLndpbmRvd0tleVVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMud2luZG93TW91c2VPdXRIYW5kbGVyLmJpbmQodGhpcykpXG5cbiAgICB3aW5kb3cub25lcnJvciA9IChlcnJvcikgPT4ge1xuICAgICAgdGhpcy5fcGxheWluZyA9IGZhbHNlXG4gICAgICB0aGlzLnNldFN0YXRlKHsgZXJyb3IgfSlcbiAgICB9XG5cbiAgICAvLyB0aGlzLnJlc2V0Q29udGFpbmVyRGltZW5zaW9ucygoKSA9PiB7XG4gICAgLy8gICAgdGhpcy5kcmF3TG9vcCgpXG4gICAgLy8gfSlcbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZSAoKSB7XG4gICAgdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQgKCkge1xuICAgIHRoaXMudG91ckNsaWVudC5vZmYoJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB0aGlzLl9lbnZveUNsaWVudC5jbG9zZUNvbm5lY3Rpb24oKVxuICB9XG5cbiAgaGFuZGxlV2luZG93UmVzaXplICgpIHtcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcbiAgICB9KVxuICB9XG5cbiAgc2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IgKGNsaWNrRXZlbnQsIHRhcmdldEVsZW1lbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRhcmdldEVsZW1lbnQ6IHRhcmdldEVsZW1lbnQsXG4gICAgICBpc0V2ZW50SGFuZGxlckVkaXRvck9wZW46IHRydWVcbiAgICB9KVxuICB9XG5cbiAgaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGFyZ2V0RWxlbWVudDogbnVsbCxcbiAgICAgIGlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbjogZmFsc2VcbiAgICB9KVxuICB9XG5cbiAgc2F2ZUV2ZW50SGFuZGxlciAodGFyZ2V0RWxlbWVudCwgZXZlbnROYW1lLCBoYW5kbGVyRGVzY3JpcHRvclNlcmlhbGl6ZWQpIHtcbiAgICBsZXQgc2VsZWN0b3JOYW1lID0gJ2hhaWt1OicgKyB0YXJnZXRFbGVtZW50LnVpZFxuICAgIHRoaXMuX2NvbXBvbmVudC51cHNlcnRFdmVudEhhbmRsZXIoc2VsZWN0b3JOYW1lLCBldmVudE5hbWUsIGhhbmRsZXJEZXNjcmlwdG9yU2VyaWFsaXplZCwgeyBmcm9tOiAnZ2xhc3MnIH0sICgpID0+IHtcblxuICAgIH0pXG4gIH1cblxuICBwZXJmb3JtUGFuIChkeCwgZHkpIHtcbiAgICB2YXIgb2xkVHJhbnNmb3JtID0gdGhpcy5fY29tcG9uZW50LmdldFN0YWdlVHJhbnNmb3JtKClcbiAgICBvbGRUcmFuc2Zvcm0ucGFuLnggPSB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWCArIGR4XG4gICAgb2xkVHJhbnNmb3JtLnBhbi55ID0gdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblkgKyBkeVxuICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybShvbGRUcmFuc2Zvcm0pXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBwYW5YOiB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWCArIGR4LFxuICAgICAgcGFuWTogdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblkgKyBkeVxuICAgIH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZU91dEhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB2YXIgc291cmNlID0gbmF0aXZlRXZlbnQucmVsYXRlZFRhcmdldCB8fCBuYXRpdmVFdmVudC50b0VsZW1lbnRcbiAgICBpZiAoIXNvdXJjZSB8fCBzb3VyY2Uubm9kZU5hbWUgPT09ICdIVE1MJykge1xuICAgICAgLy8gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAvLyAgIGlzQW55dGhpbmdTY2FsaW5nOiBmYWxzZSxcbiAgICAgIC8vICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIC8vICAgY29udHJvbEFjdGl2YXRpb246IG51bGxcbiAgICAgIC8vIH0pXG4gICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmhvdmVyZWQuZGVxdWV1ZSgpXG4gICAgfVxuICB9XG5cbiAgd2luZG93TW91c2VNb3ZlSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlTW92ZSh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZVVwSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlVXAoeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93TW91c2VEb3duSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZU1vdXNlRG93bih7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dDbGlja0hhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVDbGljayh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dEYmxDbGlja0hhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVEb3VibGVDbGljayh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dLZXlEb3duSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2V5RG93bih7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dLZXlVcEhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtleVVwKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlRG93biAobW91c2Vkb3duRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIGlmIChtb3VzZWRvd25FdmVudC5uYXRpdmVFdmVudC5idXR0b24gIT09IDApIHJldHVybiAvLyBsZWZ0IGNsaWNrIG9ubHlcblxuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURvd24gPSB0cnVlXG4gICAgdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duVGltZSA9IERhdGUubm93KClcbiAgICB2YXIgbW91c2VQb3MgPSB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZWRvd25FdmVudCwgJ2xhc3RNb3VzZURvd25Qb3NpdGlvbicpXG5cbiAgICBpZiAodGhpcy5zdGF0ZS5hY3RpdmVEcmF3aW5nVG9vbCAhPT0gJ3BvaW50ZXInKSB7XG4gICAgICBpZiAoIXRoaXMuc3RhdGUuZHJhd2luZ0lzTW9kYWwpIHtcbiAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7IHR5cGU6ICdicm9hZGNhc3QnLCBuYW1lOiAnZHJhd2luZzpjb21wbGV0ZWQnLCBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudC5pbnN0YW50aWF0ZUNvbXBvbmVudCh0aGlzLnN0YXRlLmFjdGl2ZURyYXdpbmdUb29sLCB7XG4gICAgICAgIHg6IG1vdXNlUG9zLngsXG4gICAgICAgIHk6IG1vdXNlUG9zLnksXG4gICAgICAgIG1pbmltaXplZDogdHJ1ZVxuICAgICAgfSwgeyBmcm9tOiAnZ2xhc3MnIH0sIChlcnIsIG1ldGFkYXRhLCBlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgbW91c2UgaXMgc3RpbGwgZG93biBiZWdpbiBkcmFnIHNjYWxpbmdcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgYm90dG9tIHJpZ2h0IGNvbnRyb2wgcG9pbnQsIGZvciBzY2FsaW5nXG4gICAgICAgICAgdGhpcy5jb250cm9sQWN0aXZhdGlvbih7XG4gICAgICAgICAgICBpbmRleDogOCxcbiAgICAgICAgICAgIGV2ZW50OiBtb3VzZWRvd25FdmVudFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNsaW1iIHRoZSB0YXJnZXQgcGF0aCB0byBmaW5kIGlmIGEgaGFpa3UgZWxlbWVudCBoYXMgYmVlbiBzZWxlY3RlZFxuICAgICAgLy8gTk9URTogd2Ugd2FudCB0byBtYWtlIHN1cmUgd2UgYXJlIG5vdCBzZWxlY3RpbmcgZWxlbWVudHMgYXQgdGhlIHdyb25nIGNvbnRleHQgbGV2ZWxcbiAgICAgIHZhciB0YXJnZXQgPSBtb3VzZWRvd25FdmVudC5uYXRpdmVFdmVudC50YXJnZXRcbiAgICAgIGlmICgodHlwZW9mIHRhcmdldC5jbGFzc05hbWUgPT09ICdzdHJpbmcnKSAmJiB0YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ3NjYWxlLWN1cnNvcicpICE9PSAtMSkgcmV0dXJuXG5cbiAgICAgIHdoaWxlICh0YXJnZXQuaGFzQXR0cmlidXRlICYmICghdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnc291cmNlJykgfHwgIXRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hhaWt1LWlkJykgfHxcbiAgICAgICAgICAgICAhdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hhaWt1LWlkJykpKSkge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRhcmdldCB8fCAhdGFyZ2V0Lmhhc0F0dHJpYnV0ZSkge1xuICAgICAgICAvLyBJZiBzaGlmdCBpcyBkb3duLCB0aGF0J3MgY29uc3RyYWluZWQgc2NhbGluZy4gSWYgY21kLCB0aGF0J3Mgcm90YXRpb24gbW9kZS5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmlzS2V5U2hpZnREb3duICYmICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24pIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUoJ3NvdXJjZScpICYmIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2hhaWt1LWlkJykgJiYgdGFyZ2V0LnBhcmVudE5vZGUgIT09IHRoaXMucmVmcy5tb3VudCkge1xuICAgICAgICB2YXIgaGFpa3VJZCA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hhaWt1LWlkJylcbiAgICAgICAgdmFyIGNvbnRhaW5lZCA9IGxvZGFzaC5maW5kKHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLFxuICAgICAgICAgICAgKGVsZW1lbnQpID0+IGVsZW1lbnQudWlkID09PSBoYWlrdUlkKVxuXG4gICAgICAgIC8vIHdlIGNoZWNrIGlmIHRoZSBlbGVtZW50IGJlaW5nIGNsaWNrZWQgb24gaXMgYWxyZWFkeSBpbiB0aGUgc2VsZWN0aW9uLCBpZiBpdCBpcyB3ZSBkb24ndCB3YW50XG4gICAgICAgIC8vIHRvIGNsZWFyIHRoZSBzZWxlY3Rpb24gc2luY2UgaXQgY291bGQgYmUgYSBncm91cGVkIHNlbGVjdGlvblxuICAgICAgICAvLyBJZiBzaGlmdCBpcyBkb3duLCB0aGF0J3MgY29uc3RyYWluZWQgc2NhbGluZy4gSWYgY21kLCB0aGF0J3Mgcm90YXRpb24gbW9kZS5cbiAgICAgICAgaWYgKCFjb250YWluZWQgJiYgKCF0aGlzLnN0YXRlLmlzS2V5U2hpZnREb3duICYmICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24pKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb250YWluZWQpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2VsZWN0RWxlbWVudChoYWlrdUlkLCB7IGZyb206ICdnbGFzcycgfSwgKCkgPT4ge30pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVNb3VzZVVwIChtb3VzZXVwRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURvd24gPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUubGFzdE1vdXNlVXBUaW1lID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuaGFuZGxlRHJhZ1N0b3AoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgaXNBbnl0aGluZ1JvdGF0aW5nOiBmYWxzZSxcbiAgICAgIGdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzOiAnJyxcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uOiBudWxsXG4gICAgfSlcbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZXVwRXZlbnQsICdsYXN0TW91c2VVcFBvc2l0aW9uJylcbiAgfVxuXG4gIGhhbmRsZUNsaWNrIChjbGlja0V2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24oY2xpY2tFdmVudClcbiAgfVxuXG4gIGhhbmRsZURvdWJsZUNsaWNrIChkb3VibGVDbGlja0V2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24oZG91YmxlQ2xpY2tFdmVudClcbiAgfVxuXG4gIGhhbmRsZURyYWdTdGFydCAoY2IpIHtcbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyA9IHRydWVcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNNb3VzZURyYWdnaW5nOiB0cnVlIH0sIGNiKVxuICB9XG5cbiAgaGFuZGxlRHJhZ1N0b3AgKGNiKSB7XG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRHJhZ2dpbmcgPSBmYWxzZVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc01vdXNlRHJhZ2dpbmc6IGZhbHNlIH0sIGNiKVxuICB9XG5cbiAgaGFuZGxlS2V5RXNjYXBlICgpIHtcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gIH1cblxuICBoYW5kbGVLZXlTcGFjZSAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleVNwYWNlRG93bjogaXNEb3duIH0pXG4gICAgLy8gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5kcmlsbGRvd25JbnRvQWxyZWFkeVNlbGVjdGVkRWxlbWVudCh0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50KVxuICB9XG5cbiAgaGFuZGxlS2V5TGVmdEFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoLWRlbHRhLCAwLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5VXBBcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKDAsIC1kZWx0YSwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleVJpZ2h0QXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZShkZWx0YSwgMCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleURvd25BcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKDAsIGRlbHRhLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5RG93biAoa2V5RXZlbnQpIHtcbiAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvcikge1xuICAgICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3Iud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KGtleUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIDI3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlFc2NhcGUoKVxuICAgICAgY2FzZSAzMjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5U3BhY2Uoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDM3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlMZWZ0QXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDM4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlVcEFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSAzOTogcmV0dXJuIHRoaXMuaGFuZGxlS2V5UmlnaHRBcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgNDA6IHJldHVybiB0aGlzLmhhbmRsZUtleURvd25BcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgNDY6IHJldHVybiB0aGlzLmhhbmRsZUtleURlbGV0ZSgpXG4gICAgICBjYXNlIDg6IHJldHVybiB0aGlzLmhhbmRsZUtleURlbGV0ZSgpXG4gICAgICBjYXNlIDEzOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlFbnRlcigpXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTaGlmdChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLmhhbmRsZUtleUN0cmwoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlBbHQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlVcCAoa2V5RXZlbnQpIHtcbiAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvcikge1xuICAgICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3Iud2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50KGtleUV2ZW50KSkge1xuICAgICAgICByZXR1cm4gdm9pZCAoMClcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzd2l0Y2ggKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LndoaWNoKSB7XG4gICAgICBjYXNlIDMyOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTcGFjZShrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDE2OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTaGlmdChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDdHJsKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLmhhbmRsZUtleUFsdChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDIyNDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgZGVmYXVsdDogcmV0dXJuIG51bGxcbiAgICB9XG4gIH1cblxuICBoYW5kbGVLZXlFbnRlciAoKSB7XG4gICAgLy8gbm9vcCBmb3Igbm93XG4gIH1cblxuICBoYW5kbGVLZXlDb21tYW5kIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uY21kID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleUNvbW1hbmREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVLZXlTaGlmdCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLnNoaWZ0ID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleVNoaWZ0RG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlS2V5Q3RybCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLmN0cmwgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q3RybERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUtleUFsdCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLmFsdCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlBbHREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVDbGlja1N0YWdlTmFtZSAoKSB7XG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgIHZhciBhcnRib2FyZCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZFJvb3RzKClbMF1cbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmNsaWNrZWQuYWRkKGFydGJvYXJkKVxuICAgIGFydGJvYXJkLnNlbGVjdCh7IGZyb206ICdnbGFzcycgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzU3RhZ2VOYW1lSG92ZXJpbmc6IHRydWUgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTdGFnZU5hbWVIb3ZlcmluZzogZmFsc2UgfSlcbiAgfVxuXG4gIGhhbmRsZU1vdXNlTW92ZSAobW91c2Vtb3ZlRXZlbnQpIHtcbiAgICBjb25zdCB6b29tID0gdGhpcy5zdGF0ZS56b29tWFkgfHwgMVxuICAgIGNvbnN0IGxhc3RNb3VzZURvd25Qb3NpdGlvbiA9IHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uXG4gICAgY29uc3QgbW91c2VQb3NpdGlvbkN1cnJlbnQgPSB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihtb3VzZW1vdmVFdmVudClcbiAgICBjb25zdCBtb3VzZVBvc2l0aW9uUHJldmlvdXMgPSB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cyB8fCBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGxldCBkeCA9IChtb3VzZVBvc2l0aW9uQ3VycmVudC54IC0gbW91c2VQb3NpdGlvblByZXZpb3VzLngpIC8gem9vbVxuICAgIGxldCBkeSA9IChtb3VzZVBvc2l0aW9uQ3VycmVudC55IC0gbW91c2VQb3NpdGlvblByZXZpb3VzLnkpIC8gem9vbVxuICAgIGlmIChkeCA9PT0gMCAmJiBkeSA9PT0gMCkgcmV0dXJuIG1vdXNlUG9zaXRpb25DdXJyZW50XG5cbiAgICAvLyBpZiAoZHggIT09IDApIGR4ID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLnpvb21YWSAvIGR4KVxuICAgIC8vIGlmIChkeSAhPT0gMCkgZHkgPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuem9vbVhZIC8gZHkpXG4gICAgLy8gSWYgd2UgZ290IHRoaXMgZmFyLCB0aGUgbW91c2UgaGFzIGNoYW5nZWQgaXRzIHBvc2l0aW9uIGZyb20gdGhlIG1vc3QgcmVjZW50IG1vdXNlZG93blxuICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEb3duKSB7XG4gICAgICB0aGlzLmhhbmRsZURyYWdTdGFydCgpXG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyAmJiB0aGlzLnN0YXRlLmlzTW91c2VEb3duKSB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc0tleVNwYWNlRG93biAmJiB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duKSB7XG4gICAgICAgIHRoaXMucGVyZm9ybVBhbihcbiAgICAgICAgICBtb3VzZW1vdmVFdmVudC5uYXRpdmVFdmVudC5jbGllbnRYIC0gdGhpcy5zdGF0ZS5zdGFnZU1vdXNlRG93bi54LFxuICAgICAgICAgIG1vdXNlbW92ZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFkgLSB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duLnlcbiAgICAgICAgKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSlcbiAgICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBlbGVtZW50LmRyYWcoZHgsIGR5LCBtb3VzZVBvc2l0aW9uQ3VycmVudCwgbW91c2VQb3NpdGlvblByZXZpb3VzLCBsYXN0TW91c2VEb3duUG9zaXRpb24sIHRoaXMuc3RhdGUpXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgfVxuXG4gIGhhbmRsZUtleURlbGV0ZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5yZW1vdmUoKVxuICAgIH0pXG4gIH1cblxuICByZXNldENvbnRhaW5lckRpbWVuc2lvbnMgKGNiKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuY29udGFpbmVyKSByZXR1cm5cbiAgICB2YXIgdyA9IHRoaXMucmVmcy5jb250YWluZXIuY2xpZW50V2lkdGhcbiAgICB2YXIgaCA9IHRoaXMucmVmcy5jb250YWluZXIuY2xpZW50SGVpZ2h0XG4gICAgdmFyIG1vdW50WCA9ICh3IC0gdGhpcy5zdGF0ZS5tb3VudFdpZHRoKSAvIDJcbiAgICB2YXIgbW91bnRZID0gKGggLSB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0KSAvIDJcbiAgICBpZiAodyAhPT0gdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCB8fCBoICE9PSB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodCB8fCBtb3VudFggIT09IHRoaXMuc3RhdGUubW91bnRYIHx8IG1vdW50WSAhPT0gdGhpcy5zdGF0ZS5tb3VudFkpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb250YWluZXJXaWR0aDogdywgY29udGFpbmVySGVpZ2h0OiBoLCBtb3VudFgsIG1vdW50WSB9LCBjYilcbiAgICB9XG4gIH1cblxuICBnZXRBcnRib2FyZFJlY3QgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgIHJpZ2h0OiB0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICBib3R0b206IHRoaXMuc3RhdGUubW91bnRZICsgdGhpcy5zdGF0ZS5tb3VudEhlaWdodCxcbiAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHRcbiAgICB9XG4gIH1cblxuICBnZXRTZWxlY3Rpb25NYXJxdWVlU2l6ZSAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50IHx8ICF0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbikge1xuICAgICAgcmV0dXJuIHsgeDogMCwgeTogMCwgd2lkdGg6IDAsIGhlaWdodDogMCB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB4OiB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi54ICsgdGhpcy5nZXRBcnRib2FyZFJlY3QoKS5sZWZ0LFxuICAgICAgeTogdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueSArIHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkudG9wLFxuICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQueCAtIHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLngsXG4gICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQueSAtIHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLnlcbiAgICB9XG4gIH1cblxuICBjb250cm9sQWN0aXZhdGlvbiAoYWN0aXZhdGlvbkluZm8pIHtcbiAgICB2YXIgYXJ0Ym9hcmQgPSB0aGlzLmdldEFydGJvYXJkUmVjdCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bixcbiAgICAgIGlzQW55dGhpbmdTY2FsaW5nOiAhdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLFxuICAgICAgY29udHJvbEFjdGl2YXRpb246IHtcbiAgICAgICAgc2hpZnQ6IHRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24sXG4gICAgICAgIGN0cmw6IHRoaXMuc3RhdGUuaXNLZXlDdHJsRG93bixcbiAgICAgICAgY21kOiB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sXG4gICAgICAgIGFsdDogdGhpcy5zdGF0ZS5pc0tleUFsdERvd24sXG4gICAgICAgIGluZGV4OiBhY3RpdmF0aW9uSW5mby5pbmRleCxcbiAgICAgICAgYXJib2FyZDogYXJ0Ym9hcmQsXG4gICAgICAgIGNsaWVudDoge1xuICAgICAgICAgIHg6IGFjdGl2YXRpb25JbmZvLmV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgeTogYWN0aXZhdGlvbkluZm8uZXZlbnQuY2xpZW50WVxuICAgICAgICB9LFxuICAgICAgICBjb29yZHM6IHtcbiAgICAgICAgICB4OiBhY3RpdmF0aW9uSW5mby5ldmVudC5jbGllbnRYIC0gYXJ0Ym9hcmQubGVmdCxcbiAgICAgICAgICB5OiBhY3RpdmF0aW9uSW5mby5ldmVudC5jbGllbnRZIC0gYXJ0Ym9hcmQudG9wXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIChtb3VzZUV2ZW50LCBhZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlKSB7XG4gICAgaWYgKCF0aGlzLnJlZnMuY29udGFpbmVyKSByZXR1cm4gbnVsbCAvLyBXZSBoYXZlbid0IG1vdW50ZWQgeWV0LCBubyBzaXplIGF2YWlsYWJsZVxuICAgIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzID0gdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGNvbnN0IG1vdXNlUG9zaXRpb25DdXJyZW50ID0gZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uKG1vdXNlRXZlbnQubmF0aXZlRXZlbnQsIHRoaXMucmVmcy5jb250YWluZXIpXG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQuY2xpZW50WCA9IG1vdXNlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WFxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LmNsaWVudFkgPSBtb3VzZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC54IC09IHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkubGVmdFxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LnkgLT0gdGhpcy5nZXRBcnRib2FyZFJlY3QoKS50b3BcbiAgICB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50ID0gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICBpZiAoYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZSkgdGhpcy5zdGF0ZVthZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlXSA9IG1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgcmV0dXJuIG1vdXNlUG9zaXRpb25DdXJyZW50XG4gIH1cblxuICBkcmF3T3ZlcmxheXMgKGZvcmNlKSB7XG4gICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5zZWxlY3RlZC5hbGwoKVxuICAgIGlmIChmb3JjZSB8fCBzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgY29udGFpbmVyID0gdGhpcy5faGFpa3VSZW5kZXJlci5jcmVhdGVDb250YWluZXIodGhpcy5yZWZzLm92ZXJsYXkpXG4gICAgICB2YXIgcGFydHMgPSB0aGlzLmJ1aWxkRHJhd25PdmVybGF5cygpXG4gICAgICB2YXIgb3ZlcmxheSA9IHtcbiAgICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgaWQ6ICdoYWlrdS1nbGFzcy1vdmVybGF5LXJvb3QnLFxuICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICB0cmFuc2Zvcm06ICdtYXRyaXgzZCgxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCwwLDAsMCwxKScsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCArICdweCcsXG4gICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZICsgJ3B4JyxcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGggKyAncHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0ICsgJ3B4J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgY2hpbGRyZW46IHBhcnRzXG4gICAgICB9XG5cbiAgICAgIC8vIEhBQ0shIFdlIGFscmVhZHkgY2FjaGUgdGhlIGNvbnRyb2wgcG9pbnQgbGlzdGVuZXJzIG91cnNlbHZlcywgc28gY2xlYXIgdGhlIGNhY2hlXG4gICAgICAvLyB1c2VkIG5vcm1hbGx5IGJ5IHRoZSBjb21wb25lbnQgaW5zdGFuY2UgZm9yIGNhY2hpbmcvZGVkdXBpbmcgbGlzdGVuZXJzIGluIHByb2R1Y3Rpb25cbiAgICAgIHRoaXMuX2hhaWt1Q29udGV4dC5jb21wb25lbnQuX3JlZ2lzdGVyZWRFbGVtZW50RXZlbnRMaXN0ZW5lcnMgPSB7fVxuXG4gICAgICB0aGlzLl9oYWlrdVJlbmRlcmVyLnJlbmRlcih0aGlzLnJlZnMub3ZlcmxheSwgY29udGFpbmVyLCBvdmVybGF5LCB0aGlzLl9oYWlrdUNvbnRleHQuY29tcG9uZW50LCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIG1ldGhvZCBjcmVhdGVzIG9iamVjdHMgd2hpY2ggcmVwcmVzZW50IEhhaWt1IFBsYXllciByZW5kZXJpbmcgaW5zdHJ1Y3Rpb25zIGZvciBkaXNwbGF5aW5nIGFsbCBvZlxuICAvLyB0aGUgdmlzdWFsIGVmZmVjdHMgdGhhdCBzaXQgYWJvdmUgdGhlIHN0YWdlLiAoVHJhbnNmb3JtIGNvbnRyb2xzLCBldGMuKSBUaGUgSGFpa3UgUGxheWVyIGlzIHNvcnQgb2YgYVxuICAvLyBoeWJyaWQgb2YgUmVhY3QgRmliZXIgYW5kIEZhbW91cyBFbmdpbmUuIEl0IGhhcyBhIHZpcnR1YWwgRE9NIHRyZWUgb2YgZWxlbWVudHMgbGlrZSB7ZWxlbWVudE5hbWU6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7fSwgW119LFxuICAvLyBhbmQgZmx1c2hlcyB1cGRhdGVzIHRvIHRoZW0gb24gZWFjaCBmcmFtZS4gU28gd2hhdCBfdGhpcyBtZXRob2RfIGRvZXMgaXMganVzdCBidWlsZCB0aG9zZSBvYmplY3RzIGFuZCB0aGVuXG4gIC8vIHRoZXNlIGdldCBwYXNzZWQgaW50byBhIEhhaWt1IFBsYXllciByZW5kZXIgbWV0aG9kIChzZWUgYWJvdmUpLiBMT05HIFNUT1JZIFNIT1JUOiBUaGlzIGNyZWF0ZXMgYSBmbGF0IGxpc3Qgb2ZcbiAgLy8gbm9kZXMgdGhhdCBnZXQgcmVuZGVyZWQgdG8gdGhlIERPTSBieSB0aGUgSGFpa3UgUGxheWVyLlxuICBidWlsZERyYXduT3ZlcmxheXMgKCkge1xuICAgIHZhciBvdmVybGF5cyA9IFtdXG4gICAgLy8gRG9uJ3Qgc2hvdyBhbnkgb3ZlcmxheXMgaWYgd2UncmUgaW4gcHJldmlldyAoYWthICdsaXZlJykgaW50ZXJhY3Rpb25Nb2RlXG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICByZXR1cm4gb3ZlcmxheXNcbiAgICB9XG4gICAgdmFyIHNlbGVjdGVkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5zZWxlY3RlZC5hbGwoKVxuICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgcG9pbnRzXG4gICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gc2VsZWN0ZWRbMF1cbiAgICAgICAgaWYgKGVsZW1lbnQuaXNSZW5kZXJhYmxlVHlwZSgpKSB7XG4gICAgICAgICAgcG9pbnRzID0gZWxlbWVudC5nZXRQb2ludHNUcmFuc2Zvcm1lZCh0cnVlKVxuICAgICAgICAgIHRoaXMucmVuZGVyTW9ycGhQb2ludHNPdmVybGF5KHBvaW50cywgb3ZlcmxheXMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcG9pbnRzID0gZWxlbWVudC5nZXRCb3hQb2ludHNUcmFuc2Zvcm1lZCgpXG4gICAgICAgICAgdmFyIHJvdGF0aW9uWiA9IGVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgncm90YXRpb24ueicpIHx8IDBcbiAgICAgICAgICB2YXIgc2NhbGVYID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS54JylcbiAgICAgICAgICBpZiAoc2NhbGVYID09PSB1bmRlZmluZWQgfHwgc2NhbGVYID09PSBudWxsKSBzY2FsZVggPSAxXG4gICAgICAgICAgdmFyIHNjYWxlWSA9IGVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueScpXG4gICAgICAgICAgaWYgKHNjYWxlWSA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWSA9PT0gbnVsbCkgc2NhbGVZID0gMVxuICAgICAgICAgIHRoaXMucmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheShwb2ludHMsIG92ZXJsYXlzLCBlbGVtZW50LmNhblJvdGF0ZSgpLCB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sIHRydWUsIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvaW50cyA9IFtdXG4gICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICBlbGVtZW50LmdldEJveFBvaW50c1RyYW5zZm9ybWVkKCkuZm9yRWFjaCgocG9pbnQpID0+IHBvaW50cy5wdXNoKHBvaW50KSlcbiAgICAgICAgfSlcbiAgICAgICAgcG9pbnRzID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5nZXRCb3VuZGluZ0JveFBvaW50cyhwb2ludHMpXG4gICAgICAgIHRoaXMucmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheShwb2ludHMsIG92ZXJsYXlzLCBmYWxzZSwgdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLCBmYWxzZSwgMCwgMSwgMSlcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZykge1xuICAgICAgICAvLyBUT0RPOiBEcmF3IHRvb2x0aXAgd2l0aCBwb2ludHMgaW5mb1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb3ZlcmxheXNcbiAgfVxuXG4gIHJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheSAocG9pbnRzLCBvdmVybGF5cykge1xuICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIG92ZXJsYXlzLnB1c2godGhpcy5yZW5kZXJDb250cm9sUG9pbnQocG9pbnQueCwgcG9pbnQueSwgaW5kZXgpKVxuICAgIH0pXG4gIH1cblxuICByZW5kZXJMaW5lICh4MSwgeTEsIHgyLCB5Mikge1xuICAgIHJldHVybiB7XG4gICAgICBlbGVtZW50TmFtZTogJ3N2ZycsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGlsZHJlbjogW3tcbiAgICAgICAgZWxlbWVudE5hbWU6ICdsaW5lJyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIHgxOiB4MSxcbiAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgeDI6IHgyLFxuICAgICAgICAgIHkyOiB5MixcbiAgICAgICAgICBzdHJva2U6IFBhbGV0dGUuREFSS0VSX1JPQ0syLFxuICAgICAgICAgICdzdHJva2Utd2lkdGgnOiAnMXB4JyxcbiAgICAgICAgICAndmVjdG9yLWVmZmVjdCc6ICdub24tc2NhbGluZy1zdHJva2UnXG4gICAgICAgIH1cbiAgICAgIH1dXG4gICAgfVxuICB9XG5cbiAgY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIgKGV2ZW50TmFtZSwgcG9pbnRJbmRleCkge1xuICAgIC8vIENhY2hpbmcgdGhlc2UgYXMgb3Bwb3NlZCB0byBjcmVhdGluZyBuZXcgZnVuY3Rpb25zIGh1bmRyZWRzIG9mIHRpbWVzXG4gICAgaWYgKCF0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnMpIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVycyA9IHt9XG4gICAgY29uc3QgY29udHJvbEtleSA9IGV2ZW50TmFtZSArICctJyArIHBvaW50SW5kZXhcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XSkge1xuICAgICAgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldID0gKGxpc3RlbmVyRXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5jb250cm9sQWN0aXZhdGlvbih7XG4gICAgICAgICAgaW5kZXg6IHBvaW50SW5kZXgsXG4gICAgICAgICAgZXZlbnQ6IGxpc3RlbmVyRXZlbnRcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XS5jb250cm9sS2V5ID0gY29udHJvbEtleVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldXG4gIH1cblxuICByZW5kZXJDb250cm9sUG9pbnQgKHgsIHksIGluZGV4LCBoYW5kbGVDbGFzcykge1xuICAgIHZhciBzY2FsZSA9IDEgLyAodGhpcy5zdGF0ZS56b29tWFkgfHwgMSlcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBrZXk6ICdjb250cm9sLXBvaW50LScgKyBpbmRleCxcbiAgICAgICAgY2xhc3M6IGhhbmRsZUNsYXNzIHx8ICcnLFxuICAgICAgICBvbm1vdXNlZG93bjogdGhpcy5jcmVhdGVDb250cm9sUG9pbnRMaXN0ZW5lcignbW91c2Vkb3duJywgaW5kZXgpLFxuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRyYW5zZm9ybTogYHNjYWxlKCR7c2NhbGV9LCR7c2NhbGV9KWAsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogJ2F1dG8nLFxuICAgICAgICAgIGxlZnQ6ICh4IC0gMy41KSArICdweCcsXG4gICAgICAgICAgdG9wOiAoeSAtIDMuNSkgKyAncHgnLFxuICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLRVJfUk9DSzIsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgICAgICAgYm94U2hhZG93OiAnMCAycHggNnB4IDAgJyArIFBhbGV0dGUuU0hBRFksIC8vIFRPRE86IGFjY291bnQgZm9yIHJvdGF0aW9uXG4gICAgICAgICAgd2lkdGg6ICc3cHgnLFxuICAgICAgICAgIGhlaWdodDogJzdweCcsXG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAge1xuICAgICAgICAgIGVsZW1lbnROYW1lOiAnZGl2JyxcbiAgICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICBrZXk6ICdjb250cm9sLXBvaW50LWhpdC1hcmVhLScgKyBpbmRleCxcbiAgICAgICAgICAgIGNsYXNzOiBoYW5kbGVDbGFzcyB8fCAnJyxcbiAgICAgICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgICAgICAgICAgIGxlZnQ6ICctMTVweCcsXG4gICAgICAgICAgICAgIHRvcDogJy0xNXB4JyxcbiAgICAgICAgICAgICAgd2lkdGg6ICczMHB4JyxcbiAgICAgICAgICAgICAgaGVpZ2h0OiAnMzBweCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIH1cblxuICBnZXRIYW5kbGVDbGFzcyAoaW5kZXgsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIHZhciBkZWZhdWx0UG9pbnRHcm91cCA9IENMT0NLV0lTRV9DT05UUk9MX1BPSU5UU1swXVxuICAgIHZhciBpbmRleE9mUG9pbnQgPSBkZWZhdWx0UG9pbnRHcm91cC5pbmRleE9mKGluZGV4KVxuXG4gICAgdmFyIGtleU9mUG9pbnRHcm91cFxuICAgIGlmIChzY2FsZVggPj0gMCAmJiBzY2FsZVkgPj0gMCkga2V5T2ZQb2ludEdyb3VwID0gMCAvLyBkZWZhdWx0XG4gICAgZWxzZSBpZiAoc2NhbGVYID49IDAgJiYgc2NhbGVZIDwgMCkga2V5T2ZQb2ludEdyb3VwID0gMSAvLyBmbGlwcGVkIHZlcnRpY2FsbHlcbiAgICBlbHNlIGlmIChzY2FsZVggPCAwICYmIHNjYWxlWSA+PSAwKSBrZXlPZlBvaW50R3JvdXAgPSAyIC8vIGZsaXBwZWQgaG9yaXpvbnRhbGx5XG4gICAgZWxzZSBpZiAoc2NhbGVYIDwgMCAmJiBzY2FsZVkgPCAwKSBrZXlPZlBvaW50R3JvdXAgPSAzIC8vIGZsaXBwZWQgaG9yaXpvbnRhbGx5IGFuZCB2ZXJ0aWNhbGx5XG5cbiAgICBpZiAoa2V5T2ZQb2ludEdyb3VwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIGRldGVybWluZSBoYW5kbGUgY2xhc3MgZHVlIHRvIGJhZCBzY2FsZSB2YWx1ZXMnKVxuICAgIH1cblxuICAgIHZhciBzcGVjaWZpZWRQb2ludEdyb3VwID0gQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTW2tleU9mUG9pbnRHcm91cF1cblxuICAgIHZhciByb3RhdGlvbkRlZ3JlZXMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmdldFJvdGF0aW9uSW4zNjAocm90YXRpb25aKVxuICAgIC8vIEVhY2ggNDUgZGVncmVlIHR1cm4gd2lsbCBlcXVhdGUgdG8gYSBwaGFzZSBjaGFuZ2Ugb2YgMSwgYW5kIHRoYXQgcGhhc2UgY29ycmVzcG9uZHMgdG9cbiAgICAvLyBhIHN0YXJ0aW5nIGluZGV4IGZvciB0aGUgY29udHJvbCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gICAgdmFyIHBoYXNlTnVtYmVyID0gfn4oKHJvdGF0aW9uRGVncmVlcyArIDIyLjUpIC8gNDUpICUgc3BlY2lmaWVkUG9pbnRHcm91cC5sZW5ndGhcbiAgICB2YXIgb2Zmc2V0SW5kZXggPSAoaW5kZXhPZlBvaW50ICsgcGhhc2VOdW1iZXIpICUgc3BlY2lmaWVkUG9pbnRHcm91cC5sZW5ndGhcbiAgICB2YXIgc2hpZnRlZEluZGV4ID0gc3BlY2lmaWVkUG9pbnRHcm91cFtvZmZzZXRJbmRleF1cblxuICAgIC8vIFRoZXNlIGNsYXNzIG5hbWVzIGFyZSBkZWZpbmVkIGluIGdsb2JhbC5jc3M7IHRoZSBpbmRpY2VzIGluZGljYXRlIHRoZSBjb3JyZXNwb25kaW5nIHBvaW50c1xuICAgIGlmIChjYW5Sb3RhdGUgJiYgaXNSb3RhdGlvbk1vZGVPbikge1xuICAgICAgcmV0dXJuIGByb3RhdGUtY3Vyc29yLSR7c2hpZnRlZEluZGV4fWBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGBzY2FsZS1jdXJzb3ItJHtzaGlmdGVkSW5kZXh9YFxuICAgIH1cbiAgfVxuXG4gIHJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkgKHBvaW50cywgb3ZlcmxheXMsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgY2FuQ29udHJvbEhhbmRsZXMsIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpIHtcbiAgICB2YXIgY29ybmVycyA9IFtwb2ludHNbMF0sIHBvaW50c1syXSwgcG9pbnRzWzhdLCBwb2ludHNbNl1dXG4gICAgY29ybmVycy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIHZhciBuZXh0ID0gY29ybmVyc1soaW5kZXggKyAxKSAlIGNvcm5lcnMubGVuZ3RoXVxuICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckxpbmUocG9pbnQueCwgcG9pbnQueSwgbmV4dC54LCBuZXh0LnkpKVxuICAgIH0pXG4gICAgcG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgaWYgKGluZGV4ICE9PSA0KSB7XG4gICAgICAgIG92ZXJsYXlzLnB1c2godGhpcy5yZW5kZXJDb250cm9sUG9pbnQocG9pbnQueCwgcG9pbnQueSwgaW5kZXgsIGNhbkNvbnRyb2xIYW5kbGVzICYmIHRoaXMuZ2V0SGFuZGxlQ2xhc3MoaW5kZXgsIGNhblJvdGF0ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkpKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBnZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyAoKSB7XG4gICAgaWYgKCF0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uKSByZXR1cm4gJydcbiAgICB2YXIgY29udHJvbEluZGV4ID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvbi5pbmRleFxuICAgIHZhciBpc1JvdGF0aW9uTW9kZU9uID0gdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duXG4gICAgdmFyIHNlbGVjdGVkRWxlbWVudHMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKHNlbGVjdGVkRWxlbWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB2YXIgc2VsZWN0ZWRFbGVtZW50ID0gc2VsZWN0ZWRFbGVtZW50c1swXVxuICAgICAgdmFyIHJvdGF0aW9uWiA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdyb3RhdGlvbi56JykgfHwgMFxuICAgICAgdmFyIHNjYWxlWCA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS54JylcbiAgICAgIGlmIChzY2FsZVggPT09IHVuZGVmaW5lZCB8fCBzY2FsZVggPT09IG51bGwpIHNjYWxlWCA9IDFcbiAgICAgIHZhciBzY2FsZVkgPSBzZWxlY3RlZEVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueScpXG4gICAgICBpZiAoc2NhbGVZID09PSB1bmRlZmluZWQgfHwgc2NhbGVZID09PSBudWxsKSBzY2FsZVkgPSAxXG4gICAgICByZXR1cm4gdGhpcy5nZXRIYW5kbGVDbGFzcyhjb250cm9sSW5kZXgsIHRydWUsIGlzUm90YXRpb25Nb2RlT24sIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmdldEhhbmRsZUNsYXNzKGNvbnRyb2xJbmRleCwgZmFsc2UsIGlzUm90YXRpb25Nb2RlT24sIDAsIDEsIDEpXG4gICAgfVxuICB9XG5cbiAgZ2V0U3RhZ2VUcmFuc2Zvcm0gKCkge1xuICAgIHZhciBhID0gdGhpcy5zdGF0ZS56b29tWFkgfHwgMVxuICAgIHZhciBjID0gdGhpcy5zdGF0ZS5wYW5YIHx8IDBcbiAgICB2YXIgZCA9IHRoaXMuc3RhdGUucGFuWSB8fCAwXG5cbiAgICByZXR1cm4gJ21hdHJpeDNkKCcgK1xuICAgICAgW2EsIDAsIDAsIDAsXG4gICAgICAgIDAsIGEsIDAsIDAsXG4gICAgICAgIDAsIDAsIDEsIDAsXG4gICAgICAgIGMsIGQsIDAsIDFdLmpvaW4oJywnKSArICcpJ1xuICB9XG5cbiAgaXNQcmV2aWV3TW9kZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5faW50ZXJhY3Rpb25Nb2RlLnR5cGUgPT09ICdsaXZlJ1xuICB9XG5cbiAgZ2V0Q3Vyc29yQ3NzUnVsZSAoKSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSByZXR1cm4gJ2RlZmF1bHQnXG4gICAgcmV0dXJuICh0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duKSA/ICctd2Via2l0LWdyYWJiaW5nJyA6ICctd2Via2l0LWdyYWInXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHZhciBkcmF3aW5nQ2xhc3NOYW1lID0gKHRoaXMuc3RhdGUuYWN0aXZlRHJhd2luZ1Rvb2wgIT09ICdwb2ludGVyJykgPyAnZHJhdy1zaGFwZScgOiAnJ1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgb25Nb3VzZU92ZXI9eygpID0+IHRoaXMuc2V0U3RhdGUoeyBpc0tleUNvbW1hbmREb3duOiBmYWxzZSB9KX0+XG5cbiAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgICByaWdodDogMTAsXG4gICAgICAgICAgICAgIHpJbmRleDogMTAwMDAwLFxuICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTRcbiAgICAgICAgICAgIH19PlxuICAgICAgICAgICAge01hdGgucm91bmQodGhpcy5zdGF0ZS56b29tWFkgLyAxICogMTAwKX0lXG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA6ICcnfVxuXG4gICAgICAgIDxkaXZcbiAgICAgICAgICByZWY9J2NvbnRhaW5lcidcbiAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtY29udGFpbmVyJ1xuICAgICAgICAgIGNsYXNzTmFtZT17dGhpcy5nZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcygpfVxuICAgICAgICAgIG9uTW91c2VEb3duPXsobW91c2VEb3duKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIGlmIChtb3VzZURvd24ubmF0aXZlRXZlbnQudGFyZ2V0ICYmIG1vdXNlRG93bi5uYXRpdmVFdmVudC50YXJnZXQuaWQgPT09ICdmdWxsLWJhY2tncm91bmQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmICh0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgICAgICAgICAgIHRoaXMuaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IoKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsUGFuWDogdGhpcy5zdGF0ZS5wYW5YLFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsUGFuWTogdGhpcy5zdGF0ZS5wYW5ZLFxuICAgICAgICAgICAgICAgIHN0YWdlTW91c2VEb3duOiB7XG4gICAgICAgICAgICAgICAgICB4OiBtb3VzZURvd24ubmF0aXZlRXZlbnQuY2xpZW50WCxcbiAgICAgICAgICAgICAgICAgIHk6IG1vdXNlRG93bi5uYXRpdmVFdmVudC5jbGllbnRZXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZVVwPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdGFnZU1vdXNlRG93bjogbnVsbCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZUxlYXZlPXsoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKSB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBzdGFnZU1vdXNlRG93bjogbnVsbCB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgLy8gVE9ETzogIGlmL3doZW4gd2Ugc3VwcG9ydCBuYXRpdmUgc2Nyb2xsaW5nIGhlcmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdlJ2xsIG5lZWQgdG8gZmlndXJlIG91dCBzb21lIHBoYW50b20gcmVmbG93aW5nL2ppdHRlciBpc3N1ZXNcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogdGhpcy5nZXRTdGFnZVRyYW5zZm9ybSgpLFxuICAgICAgICAgICAgY3Vyc29yOiB0aGlzLmdldEN1cnNvckNzc1J1bGUoKSxcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogKHRoaXMuaXNQcmV2aWV3TW9kZSgpKSA/ICd3aGl0ZScgOiAnaW5oZXJpdCdcbiAgICAgICAgICB9fT5cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLWxpdmUnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGRlZnM+XG4gICAgICAgICAgICAgICAgPGZpbHRlciBpZD0nYmFja2dyb3VuZC1ibHVyJyB4PSctNTAlJyB5PSctNTAlJyB3aWR0aD0nMjAwJScgaGVpZ2h0PScyMDAlJz5cbiAgICAgICAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0nU291cmNlQWxwaGEnIHN0ZERldmlhdGlvbj0nMicgcmVzdWx0PSdibHVyJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlRmxvb2QgZmxvb2RDb2xvcj0ncmdiYSgzMywgNDUsIDQ5LCAuNSknIGZsb29kT3BhY2l0eT0nMC44JyByZXN1bHQ9J29mZnNldENvbG9yJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlQ29tcG9zaXRlIGluPSdvZmZzZXRDb2xvcicgaW4yPSdibHVyJyBvcGVyYXRvcj0naW4nIHJlc3VsdD0ndG90YWxCbHVyJyAvPlxuICAgICAgICAgICAgICAgICAgPGZlQmxlbmQgaW49J1NvdXJjZUdyYXBoaWMnIGluMj0ndG90YWxCbHVyJyBtb2RlPSdub3JtYWwnIC8+XG4gICAgICAgICAgICAgICAgPC9maWx0ZXI+XG4gICAgICAgICAgICAgIDwvZGVmcz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J2Z1bGwtYmFja2dyb3VuZCcgeD0nMCcgeT0nMCcgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0ndHJhbnNwYXJlbnQnIC8+XG4gICAgICAgICAgICAgIDxyZWN0IGlkPSdtb3VudC1iYWNrZ3JvdW5kLWJsdXInIGZpbHRlcj0ndXJsKCNiYWNrZ3JvdW5kLWJsdXIpJyB4PXt0aGlzLnN0YXRlLm1vdW50WH0geT17dGhpcy5zdGF0ZS5tb3VudFl9IHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGh9IGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodH0gZmlsbD0nd2hpdGUnIC8+XG4gICAgICAgICAgICAgIDxyZWN0IGlkPSdtb3VudC1iYWNrZ3JvdW5kJyB4PXt0aGlzLnN0YXRlLm1vdW50WH0geT17dGhpcy5zdGF0ZS5tb3VudFl9IHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGh9IGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodH0gZmlsbD0nd2hpdGUnIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogPGRpdlxuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtYmFja2dyb3VuZC1wcmV2aWV3J1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHRcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtYmFja2dyb3VuZC1wcmV2aWV3LWJvcmRlcidcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZLFxuICAgICAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFgsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IGRvdHRlZCAjYmJiJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzJweCdcbiAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPC9kaXY+fVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLXRpdGxlLXRleHQtY29udGFpbmVyJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAsXG4gICAgICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSAtIDE5LFxuICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYICsgMixcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAxMjAsXG4gICAgICAgICAgICAgICAgdXNlclNlbGVjdDogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGN1cnNvcjogJ2RlZmF1bHQnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2tTdGFnZU5hbWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU92ZXI9e3RoaXMuaGFuZGxlTW91c2VPdmVyU3RhZ2VOYW1lLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdXQ9e3RoaXMuaGFuZGxlTW91c2VPdXRTdGFnZU5hbWUuYmluZCh0aGlzKX0+XG4gICAgICAgICAgICAgIDx0ZXh0XG4gICAgICAgICAgICAgICAgeT0nMTMnXG4gICAgICAgICAgICAgICAgaWQ9J3Byb2plY3QtbmFtZSdcbiAgICAgICAgICAgICAgICBmaWxsPXtQYWxldHRlLkZBVEhFUl9DT0FMfVxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ9J2xpZ2h0ZXInXG4gICAgICAgICAgICAgICAgZm9udEZhbWlseT0nRmlyYSBTYW5zJ1xuICAgICAgICAgICAgICAgIGZvbnRTaXplPScxMyc+XG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMucHJvamVjdE5hbWV9XG4gICAgICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1iYWNrZ3JvdW5kLWNvbG9yYXRvcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDIwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8cGF0aCBkPXtgTTAsMFYke3RoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0fUgke3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9VjBaTSR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9LCR7dGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fUgke3RoaXMuc3RhdGUubW91bnRYfVYke3RoaXMuc3RhdGUubW91bnRZfUgke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofVpgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7J2ZpbGwnOiAnIzExMScsICdvcGFjaXR5JzogMC4xLCAncG9pbnRlckV2ZW50cyc6ICdub25lJ319IC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3MtbW9hdC1vcGFjaXRhdG9yJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAxMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHBhdGggZD17YE0wLDBWJHt0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodH1IJHt0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRofVYwWk0ke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofSwke3RoaXMuc3RhdGUubW91bnRZICsgdGhpcy5zdGF0ZS5tb3VudEhlaWdodH1IJHt0aGlzLnN0YXRlLm1vdW50WH1WJHt0aGlzLnN0YXRlLm1vdW50WX1IJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH1aYH1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgJ2ZpbGwnOiAnI0ZGRicsXG4gICAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDAuNSxcbiAgICAgICAgICAgICAgICAgICdwb2ludGVyRXZlbnRzJzogJ25vbmUnXG4gICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgICAgPHJlY3RcbiAgICAgICAgICAgICAgICB4PXt0aGlzLnN0YXRlLm1vdW50WCAtIDF9XG4gICAgICAgICAgICAgICAgeT17dGhpcy5zdGF0ZS5tb3VudFkgLSAxfVxuICAgICAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLm1vdW50V2lkdGggKyAyfVxuICAgICAgICAgICAgICAgIGhlaWdodD17dGhpcy5zdGF0ZS5tb3VudEhlaWdodCArIDJ9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHN0cm9rZVdpZHRoOiAxLjUsXG4gICAgICAgICAgICAgICAgICBmaWxsOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBzdHJva2U6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IHRoaXMuc3RhdGUuaXNTdGFnZU5hbWVIb3ZlcmluZyAmJiAhdGhpcy5zdGF0ZS5pc1N0YWdlU2VsZWN0ZWQgPyAwLjc1IDogMFxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpICYmIHRoaXMuc3RhdGUuZG9TaG93Q29tbWVudHMgJiYgdGhpcy5zdGF0ZS5jb21tZW50cy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1jb21tZW50cy1jb250YWluZXInXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMjAwMCxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxMDAlJyB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuY29tbWVudHMubWFwKChjb21tZW50LCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiA8Q29tbWVudCBpbmRleD17aW5kZXh9IGNvbW1lbnQ9e2NvbW1lbnR9IGtleT17YGNvbW1lbnQtJHtjb21tZW50LmlkfWB9IG1vZGVsPXt0aGlzLl9jb21tZW50c30gLz5cbiAgICAgICAgICAgICAgfSl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSAmJiB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbilcbiAgICAgICAgICAgID8gPEV2ZW50SGFuZGxlckVkaXRvclxuICAgICAgICAgICAgICByZWY9J2V2ZW50SGFuZGxlckVkaXRvcidcbiAgICAgICAgICAgICAgZWxlbWVudD17dGhpcy5zdGF0ZS50YXJnZXRFbGVtZW50fVxuICAgICAgICAgICAgICBzYXZlPXt0aGlzLnNhdmVFdmVudEhhbmRsZXIuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgY2xvc2U9e3RoaXMuaGlkZUV2ZW50SGFuZGxlcnNFZGl0b3IuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIHJlZj0nb3ZlcmxheSdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLW92ZXJsYXktbW91bnQnXG4gICAgICAgICAgICAgIGhlaWdodD17dGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHR9XG4gICAgICAgICAgICAgIHdpZHRoPXt0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRofVxuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogJ21hdHJpeDNkKDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDEpJyxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsIC8vIFRoaXMgbmVlZHMgdG8gYmUgdW4tc2V0IGZvciBzdXJmYWNlIGVsZW1lbnRzIHRoYXQgdGFrZSBtb3VzZSBpbnRlcmFjdGlvblxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDAwLFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbikgPyAwLjUgOiAxLjBcbiAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICByZWY9J21vdW50J1xuICAgICAgICAgICAgaWQ9J2hvdC1jb21wb25lbnQtbW91bnQnXG4gICAgICAgICAgICBjbGFzc05hbWU9e2RyYXdpbmdDbGFzc05hbWV9XG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFgsXG4gICAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodCxcbiAgICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgekluZGV4OiA2MCxcbiAgICAgICAgICAgICAgb3BhY2l0eTogKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSA/IDAuNSA6IDEuMFxuICAgICAgICAgICAgfX0gLz5cblxuICAgICAgICAgIHsodGhpcy5zdGF0ZS5lcnJvcilcbiAgICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3MtZXhjZXB0aW9uLWJhcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDM1LFxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5SRUQsXG4gICAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogOTk5OSxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzlweCAyMHB4IDAnLFxuICAgICAgICAgICAgICAgIHdoaXRlU3BhY2U6ICdub3dyYXAnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlJFRF9EQVJLRVIsXG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnQXJpYWwnLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5SRURfREFSS0VSLFxuICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICB3aWR0aDogMTUsXG4gICAgICAgICAgICAgICAgICBwYWRkaW5nTGVmdDogMVxuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yOiBudWxsIH0pXG4gICAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgICB4XG4gICAgICAgICAgICAgICAgPC9idXR0b24+PHNwYW4+eycgJ308L3NwYW4+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmVycm9yfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5HbGFzcy5wcm9wVHlwZXMgPSB7XG4gIHVzZXJjb25maWc6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIHdlYnNvY2tldDogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgZm9sZGVyOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZGl1bShHbGFzcylcbiJdfQ==