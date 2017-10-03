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
};

// The class is exported also _without_ the radium wrapper to allow jsdom testing

var Glass = function (_React$Component) {
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
    value: function controlActivation(_controlActivation) {
      var artboard = this.getArtboardRect();
      this.setState({
        isAnythingRotating: this.state.isKeyCommandDown,
        isAnythingScaling: !this.state.isKeyCommandDown,
        controlActivation: {
          shift: this.state.isKeyShiftDown,
          ctrl: this.state.isKeyCtrlDown,
          cmd: this.state.isKeyCommandDown,
          alt: this.state.isKeyAltDown,
          index: _controlActivation.index,
          arboard: artboard,
          client: {
            x: _controlActivation.event.clientX,
            y: _controlActivation.event.clientY
          },
          coords: {
            x: _controlActivation.event.clientX - artboard.left,
            y: _controlActivation.event.clientY - artboard.top
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
        };
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
            lineNumber: 1137
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
              lineNumber: 1141
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
              lineNumber: 1154
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
                lineNumber: 1200
              },
              __self: this
            },
            _react2.default.createElement(
              'defs',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1209
                },
                __self: this
              },
              _react2.default.createElement(
                'filter',
                { id: 'background-blur', x: '-50%', y: '-50%', width: '200%', height: '200%', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1210
                  },
                  __self: this
                },
                _react2.default.createElement('feGaussianBlur', { 'in': 'SourceAlpha', stdDeviation: '2', result: 'blur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1211
                  },
                  __self: this
                }),
                _react2.default.createElement('feFlood', { floodColor: 'rgba(33, 45, 49, .5)', floodOpacity: '0.8', result: 'offsetColor', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1212
                  },
                  __self: this
                }),
                _react2.default.createElement('feComposite', { 'in': 'offsetColor', in2: 'blur', operator: 'in', result: 'totalBlur', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1213
                  },
                  __self: this
                }),
                _react2.default.createElement('feBlend', { 'in': 'SourceGraphic', in2: 'totalBlur', mode: 'normal', __source: {
                    fileName: _jsxFileName,
                    lineNumber: 1214
                  },
                  __self: this
                })
              )
            ),
            _react2.default.createElement('rect', { id: 'full-background', x: '0', y: '0', width: '100%', height: '100%', fill: 'transparent', __source: {
                fileName: _jsxFileName,
                lineNumber: 1217
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background-blur', filter: 'url(#background-blur)', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1218
              },
              __self: this
            }),
            _react2.default.createElement('rect', { id: 'mount-background', x: this.state.mountX, y: this.state.mountY, width: this.state.mountWidth, height: this.state.mountHeight, fill: 'white', __source: {
                fileName: _jsxFileName,
                lineNumber: 1219
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
                lineNumber: 1221
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
                lineNumber: 1230
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
                lineNumber: 1244
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
                  lineNumber: 1259
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
                lineNumber: 1272
              },
              __self: this
            },
            _react2.default.createElement('path', { d: 'M0,0V' + this.state.containerHeight + 'H' + this.state.containerWidth + 'V0ZM' + (this.state.mountX + this.state.mountWidth) + ',' + (this.state.mountY + this.state.mountHeight) + 'H' + this.state.mountX + 'V' + this.state.mountY + 'H' + (this.state.mountX + this.state.mountWidth) + 'Z',
              style: { 'fill': '#111', 'opacity': 0.1, 'pointerEvents': 'none' }, __source: {
                fileName: _jsxFileName,
                lineNumber: 1283
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
                lineNumber: 1289
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
                lineNumber: 1300
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
                lineNumber: 1306
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
                lineNumber: 1322
              },
              __self: this
            },
            this.state.comments.map(function (comment, index) {
              return _react2.default.createElement(_Comment2.default, { index: index, comment: comment, key: 'comment-' + comment.id, model: _this13._comments, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 1335
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
              lineNumber: 1341
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
              lineNumber: 1350
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
              lineNumber: 1367
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
                lineNumber: 1383
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
                  lineNumber: 1399
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
                  lineNumber: 1415
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

exports.Glass = Glass;


Glass.propTypes = {
  userconfig: _react2.default.PropTypes.object,
  websocket: _react2.default.PropTypes.object,
  folder: _react2.default.PropTypes.string
};

exports.default = (0, _radium2.default)(Glass);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9HbGFzcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2xpcGJvYXJkIiwiQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTIiwiR2xhc3MiLCJwcm9wcyIsInN0YXRlIiwiZXJyb3IiLCJtb3VudFdpZHRoIiwibW91bnRIZWlnaHQiLCJtb3VudFgiLCJtb3VudFkiLCJjb250cm9sQWN0aXZhdGlvbiIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwibW91c2VQb3NpdGlvblByZXZpb3VzIiwiaXNBbnl0aGluZ1NjYWxpbmciLCJpc0FueXRoaW5nUm90YXRpbmciLCJnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsImNvbnRhaW5lckhlaWdodCIsImNvbnRhaW5lcldpZHRoIiwiaXNTdGFnZVNlbGVjdGVkIiwiaXNTdGFnZU5hbWVIb3ZlcmluZyIsImlzTW91c2VEb3duIiwibGFzdE1vdXNlRG93blRpbWUiLCJsYXN0TW91c2VEb3duUG9zaXRpb24iLCJsYXN0TW91c2VVcFBvc2l0aW9uIiwibGFzdE1vdXNlVXBUaW1lIiwiaXNNb3VzZURyYWdnaW5nIiwiaXNLZXlTaGlmdERvd24iLCJpc0tleUN0cmxEb3duIiwiaXNLZXlBbHREb3duIiwiaXNLZXlDb21tYW5kRG93biIsImlzS2V5U3BhY2VEb3duIiwicGFuWCIsInBhblkiLCJvcmlnaW5hbFBhblgiLCJvcmlnaW5hbFBhblkiLCJ6b29tWFkiLCJjb21tZW50cyIsImRvU2hvd0NvbW1lbnRzIiwidGFyZ2V0RWxlbWVudCIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsImFjdGl2ZURyYXdpbmdUb29sIiwiZHJhd2luZ0lzTW9kYWwiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJ3aW5kb3ciLCJlbnZveSIsIldlYlNvY2tldCIsInNldFN0YWdlVHJhbnNmb3JtIiwiem9vbSIsInBhbiIsIngiLCJ5IiwiX2NvbW1lbnRzIiwiX2N0eG1lbnUiLCJfcGxheWluZyIsIl9zdG9wd2F0Y2giLCJfbGFzdEF1dGhvcml0YXRpdmVGcmFtZSIsIl9sYXN0U2VsZWN0ZWRFbGVtZW50IiwiX2NsaXBib2FyZEFjdGlvbkxvY2siLCJkcmF3TG9vcCIsImJpbmQiLCJkcmF3IiwiX2hhaWt1UmVuZGVyZXIiLCJfaGFpa3VDb250ZXh0IiwidGltZWxpbmVzIiwidGVtcGxhdGUiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJjaGlsZHJlbiIsIm9wdGlvbnMiLCJjYWNoZSIsInNlZWQiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwicmVzZXRDb250YWluZXJEaW1lbnNpb25zIiwiZ2xhc3MiLCJvbiIsInRpbWVsaW5lQ2hhbm5lbCIsImhhbmRsZVRpbWVsaW5lRGlkUGxheSIsImhhbmRsZVRpbWVsaW5lRGlkUGF1c2UiLCJoYW5kbGVUaW1lbGluZURpZFNlZWsiLCJjbGllbnQiLCJ0b3VyQ2xpZW50Iiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiY29uc29sZSIsIkRhdGUiLCJub3ciLCJmcmFtZURhdGEiLCJmcmFtZSIsImZvcmNlU2VlayIsInNlZWtNcyIsImZwcyIsImJhc2VNcyIsImRlbHRhTXMiLCJNYXRoIiwicm91bmQiLCJfc2V0VGltZWxpbmVUaW1lVmFsdWUiLCJyZWZzIiwib3ZlcmxheSIsImRyYXdPdmVybGF5cyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJtb3VudCIsImZyZWV6ZSIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsImNvbnRleHRNZW51IiwibmV3TW91bnRTaXplIiwiZ2V0Q29udGV4dFNpemUiLCJzZXRTdGF0ZSIsIndpZHRoIiwiaGVpZ2h0Iiwic2l6ZURlc2NyaXB0b3IiLCJ0aW1lbGluZU5hbWUiLCJ0aW1lbGluZVRpbWUiLCJnZXRNb3VudCIsImlzUmVsb2FkaW5nQ29kZSIsInVwZGF0ZWRBcnRib2FyZFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwicGFzdGVFdmVudCIsImluZm8iLCJwcmV2ZW50RGVmYXVsdCIsInNlbmQiLCJ0eXBlIiwibmFtZSIsImZyb20iLCJkYXRhIiwiaGFuZGxlVmlydHVhbENsaXBib2FyZCIsImNsaXBib2FyZEFjdGlvbiIsIm1heWJlQ2xpcGJvYXJkRXZlbnQiLCJjbGlwYm9hcmRQYXlsb2FkIiwiZ2V0Q2xpcGJvYXJkUGF5bG9hZCIsImN1dCIsInNlcmlhbGl6ZWRQYXlsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlVGV4dCIsImNvbXBvbmVudElkIiwiX2VsZW1lbnRzIiwiZmluZCIsImNhbGwiLCJtZXNzYWdlIiwib2xkVHJhbnNmb3JtIiwibW9kdWxlUmVwbGFjZSIsImVyciIsImdldFN0YWdlVHJhbnNmb3JtIiwicGFyYW1zIiwibWV0aG9kIiwiY2IiLCJjYWxsTWV0aG9kIiwibG9hZCIsImFjdGlvbiIsImV2ZW50IiwiYnVpbGQiLCJfbWVudSIsImxhc3RYIiwibGFzdFkiLCJyZWJ1aWxkIiwic2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IiLCJ0aHJvdHRsZSIsImhhbmRsZVdpbmRvd1Jlc2l6ZSIsIndpbmRvd01vdXNlVXBIYW5kbGVyIiwid2luZG93TW91c2VNb3ZlSGFuZGxlciIsIndpbmRvd01vdXNlRG93bkhhbmRsZXIiLCJ3aW5kb3dDbGlja0hhbmRsZXIiLCJ3aW5kb3dEYmxDbGlja0hhbmRsZXIiLCJ3aW5kb3dLZXlEb3duSGFuZGxlciIsIndpbmRvd0tleVVwSGFuZGxlciIsIndpbmRvd01vdXNlT3V0SGFuZGxlciIsIm9uZXJyb3IiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJjbGlja0V2ZW50IiwiZXZlbnROYW1lIiwiaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkIiwic2VsZWN0b3JOYW1lIiwidWlkIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiZHgiLCJkeSIsIm5hdGl2ZUV2ZW50IiwiaXNQcmV2aWV3TW9kZSIsInNvdXJjZSIsInJlbGF0ZWRUYXJnZXQiLCJ0b0VsZW1lbnQiLCJub2RlTmFtZSIsImhvdmVyZWQiLCJkZXF1ZXVlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImhhbmRsZU1vdXNlRG93biIsImhhbmRsZUNsaWNrIiwiaGFuZGxlRG91YmxlQ2xpY2siLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlS2V5VXAiLCJtb3VzZWRvd25FdmVudCIsImJ1dHRvbiIsIm1vdXNlUG9zIiwic3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIiwiaW5zdGFudGlhdGVDb21wb25lbnQiLCJtaW5pbWl6ZWQiLCJtZXRhZGF0YSIsImluZGV4IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInBhcmVudE5vZGUiLCJ1bnNlbGVjdEFsbEVsZW1lbnRzIiwiaGFpa3VJZCIsImNvbnRhaW5lZCIsIndoZXJlIiwiaXNTZWxlY3RlZCIsInNlbGVjdEVsZW1lbnQiLCJtb3VzZXVwRXZlbnQiLCJoYW5kbGVEcmFnU3RvcCIsImRvdWJsZUNsaWNrRXZlbnQiLCJpc0Rvd24iLCJrZXlFdmVudCIsImRlbHRhIiwic2hpZnRLZXkiLCJmb3JFYWNoIiwibW92ZSIsImV2ZW50SGFuZGxlckVkaXRvciIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsIndoaWNoIiwiaGFuZGxlS2V5RXNjYXBlIiwiaGFuZGxlS2V5U3BhY2UiLCJoYW5kbGVLZXlMZWZ0QXJyb3ciLCJoYW5kbGVLZXlVcEFycm93IiwiaGFuZGxlS2V5UmlnaHRBcnJvdyIsImhhbmRsZUtleURvd25BcnJvdyIsImhhbmRsZUtleURlbGV0ZSIsImhhbmRsZUtleUVudGVyIiwiaGFuZGxlS2V5U2hpZnQiLCJoYW5kbGVLZXlDdHJsIiwiaGFuZGxlS2V5QWx0IiwiaGFuZGxlS2V5Q29tbWFuZCIsImNtZCIsInNoaWZ0IiwiY3RybCIsImFsdCIsImFydGJvYXJkIiwiZmluZFJvb3RzIiwiY2xpY2tlZCIsImFkZCIsInNlbGVjdCIsIm1vdXNlbW92ZUV2ZW50IiwiaGFuZGxlRHJhZ1N0YXJ0Iiwic3RhZ2VNb3VzZURvd24iLCJwZXJmb3JtUGFuIiwiY2xpZW50WCIsImNsaWVudFkiLCJzZWxlY3RlZCIsImxlbmd0aCIsImRyYWciLCJyZW1vdmUiLCJjb250YWluZXIiLCJ3IiwiY2xpZW50V2lkdGgiLCJoIiwiY2xpZW50SGVpZ2h0IiwicmlnaHQiLCJib3R0b20iLCJnZXRBcnRib2FyZFJlY3QiLCJhcmJvYXJkIiwiY29vcmRzIiwibW91c2VFdmVudCIsImFkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGUiLCJmb3JjZSIsImFsbCIsImNyZWF0ZUNvbnRhaW5lciIsInBhcnRzIiwiYnVpbGREcmF3bk92ZXJsYXlzIiwiaWQiLCJzdHlsZSIsInRyYW5zZm9ybSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJyZW5kZXIiLCJjb21wb25lbnQiLCJvdmVybGF5cyIsInBvaW50cyIsImlzUmVuZGVyYWJsZVR5cGUiLCJnZXRQb2ludHNUcmFuc2Zvcm1lZCIsInJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheSIsImdldEJveFBvaW50c1RyYW5zZm9ybWVkIiwicm90YXRpb25aIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjYWxlWCIsInVuZGVmaW5lZCIsInNjYWxlWSIsInJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkiLCJjYW5Sb3RhdGUiLCJwb2ludCIsInB1c2giLCJnZXRCb3VuZGluZ0JveFBvaW50cyIsInJlbmRlckNvbnRyb2xQb2ludCIsIngxIiwieTEiLCJ4MiIsInkyIiwic3Ryb2tlIiwiREFSS0VSX1JPQ0syIiwicG9pbnRJbmRleCIsIl9jb250cm9sUG9pbnRMaXN0ZW5lcnMiLCJjb250cm9sS2V5IiwibGlzdGVuZXJFdmVudCIsImhhbmRsZUNsYXNzIiwic2NhbGUiLCJrZXkiLCJjbGFzcyIsIm9ubW91c2Vkb3duIiwiY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIiLCJwb2ludGVyRXZlbnRzIiwiYm9yZGVyIiwiYmFja2dyb3VuZENvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsIlNIQURZIiwiYm9yZGVyUmFkaXVzIiwiaXNSb3RhdGlvbk1vZGVPbiIsImRlZmF1bHRQb2ludEdyb3VwIiwiaW5kZXhPZlBvaW50Iiwia2V5T2ZQb2ludEdyb3VwIiwiRXJyb3IiLCJzcGVjaWZpZWRQb2ludEdyb3VwIiwicm90YXRpb25EZWdyZWVzIiwiZ2V0Um90YXRpb25JbjM2MCIsInBoYXNlTnVtYmVyIiwib2Zmc2V0SW5kZXgiLCJzaGlmdGVkSW5kZXgiLCJjYW5Db250cm9sSGFuZGxlcyIsImNvcm5lcnMiLCJuZXh0IiwicmVuZGVyTGluZSIsImdldEhhbmRsZUNsYXNzIiwiY29udHJvbEluZGV4Iiwic2VsZWN0ZWRFbGVtZW50cyIsInNlbGVjdGVkRWxlbWVudCIsImEiLCJjIiwiZCIsImpvaW4iLCJfaW50ZXJhY3Rpb25Nb2RlIiwiZHJhd2luZ0NsYXNzTmFtZSIsInpJbmRleCIsImNvbG9yIiwiZm9udFNpemUiLCJnZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsIm1vdXNlRG93biIsImhpZGVFdmVudEhhbmRsZXJzRWRpdG9yIiwiY3Vyc29yIiwiZ2V0Q3Vyc29yQ3NzUnVsZSIsInVzZXJTZWxlY3QiLCJoYW5kbGVDbGlja1N0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lIiwiRkFUSEVSX0NPQUwiLCJwcm9qZWN0TmFtZSIsInN0cm9rZVdpZHRoIiwiZmlsbCIsIkxJR0hUX1BJTksiLCJvcGFjaXR5IiwibWFwIiwiY29tbWVudCIsInNhdmVFdmVudEhhbmRsZXIiLCJSRUQiLCJTVU5TVE9ORSIsInRleHRBbGlnbiIsInBhZGRpbmciLCJ3aGl0ZVNwYWNlIiwidGV4dFRyYW5zZm9ybSIsIlJFRF9EQVJLRVIiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsInBhZGRpbmdMZWZ0IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib2JqZWN0Iiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7ZUFFc0JBLFFBQVEsVUFBUixDO0lBQWRDLFMsWUFBQUEsUzs7QUFFUixJQUFNQywyQkFBMkI7QUFDL0IsS0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBRDRCO0FBRS9CLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUY0QixFQUVGO0FBQzdCLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUg0QixFQUdGO0FBQzdCLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUo0QixDQUlIO0FBSkcsQ0FBakM7O0FBT0E7O0lBQ2FDLEs7OztBQUNYLGlCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsOEdBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLEtBQUwsR0FBYTtBQUNYQyxhQUFPLElBREk7QUFFWEMsa0JBQVksR0FGRDtBQUdYQyxtQkFBYSxHQUhGO0FBSVhDLGNBQVEsQ0FKRztBQUtYQyxjQUFRLENBTEc7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QUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsYUFoQkE7QUFnQ1c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQU87QUFBUCxhQWhDWDtBQWlDQyxpQkFBS0QsS0FBTCxDQUFXQztBQWpDWixXQURILEdBb0NHO0FBeFFOO0FBakJGLE9BREY7QUE4UkQ7Ozs7RUF0M0N3QixnQkFBTWlZLFM7Ozs7O0FBeTNDakNwWSxNQUFNcVksU0FBTixHQUFrQjtBQUNoQjFWLGNBQVksZ0JBQU0yVixTQUFOLENBQWdCQyxNQURaO0FBRWhCM1YsYUFBVyxnQkFBTTBWLFNBQU4sQ0FBZ0JDLE1BRlg7QUFHaEI3VixVQUFRLGdCQUFNNFYsU0FBTixDQUFnQkU7QUFIUixDQUFsQjs7a0JBTWUsc0JBQU94WSxLQUFQLEMiLCJmaWxlIjoiR2xhc3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBSYWRpdW0gZnJvbSAncmFkaXVtJ1xuaW1wb3J0IEhhaWt1RE9NUmVuZGVyZXIgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVuZGVyZXJzL2RvbSdcbmltcG9ydCBIYWlrdUNvbnRleHQgZnJvbSAnQGhhaWt1L3BsYXllci9saWIvSGFpa3VDb250ZXh0J1xuaW1wb3J0IEFjdGl2ZUNvbXBvbmVudCBmcm9tICdoYWlrdS1zZXJpYWxpemF0aW9uL3NyYy9tb2RlbC9BY3RpdmVDb21wb25lbnQnXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL1BhbGV0dGUnXG5pbXBvcnQgQ29tbWVudCBmcm9tICcuL0NvbW1lbnQnXG5pbXBvcnQgRXZlbnRIYW5kbGVyRWRpdG9yIGZyb20gJy4vRXZlbnRIYW5kbGVyRWRpdG9yJ1xuaW1wb3J0IENvbW1lbnRzIGZyb20gJy4vbW9kZWxzL0NvbW1lbnRzJ1xuaW1wb3J0IENvbnRleHRNZW51IGZyb20gJy4vbW9kZWxzL0NvbnRleHRNZW51J1xuaW1wb3J0IGdldExvY2FsRG9tRXZlbnRQb3NpdGlvbiBmcm9tICcuL2hlbHBlcnMvZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uJ1xuXG5jb25zdCB7IGNsaXBib2FyZCB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuXG5jb25zdCBDTE9DS1dJU0VfQ09OVFJPTF9QT0lOVFMgPSB7XG4gIDA6IFswLCAxLCAyLCA1LCA4LCA3LCA2LCAzXSxcbiAgMTogWzYsIDcsIDgsIDUsIDIsIDEsIDAsIDNdLCAvLyBmbGlwcGVkIHZlcnRpY2FsXG4gIDI6IFsyLCAxLCAwLCAzLCA2LCA3LCA4LCA1XSwgLy8gZmxpcHBlZCBob3Jpem9udGFsXG4gIDM6IFs4LCA3LCA2LCAzLCAwLCAxLCAyLCA1XSAvLyBmbGlwcGVkIGhvcml6b250YWwgKyB2ZXJ0aWNhbFxufVxuXG4vLyBUaGUgY2xhc3MgaXMgZXhwb3J0ZWQgYWxzbyBfd2l0aG91dF8gdGhlIHJhZGl1bSB3cmFwcGVyIHRvIGFsbG93IGpzZG9tIHRlc3RpbmdcbmV4cG9ydCBjbGFzcyBHbGFzcyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGVycm9yOiBudWxsLFxuICAgICAgbW91bnRXaWR0aDogNTUwLFxuICAgICAgbW91bnRIZWlnaHQ6IDQwMCxcbiAgICAgIG1vdW50WDogMCxcbiAgICAgIG1vdW50WTogMCxcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uOiBudWxsLFxuICAgICAgbW91c2VQb3NpdGlvbkN1cnJlbnQ6IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uUHJldmlvdXM6IG51bGwsXG4gICAgICBpc0FueXRoaW5nU2NhbGluZzogZmFsc2UsXG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgZ2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3M6ICcnLFxuICAgICAgY29udGFpbmVySGVpZ2h0OiAwLFxuICAgICAgY29udGFpbmVyV2lkdGg6IDAsXG4gICAgICBpc1N0YWdlU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgaXNTdGFnZU5hbWVIb3ZlcmluZzogZmFsc2UsXG4gICAgICBpc01vdXNlRG93bjogZmFsc2UsXG4gICAgICBsYXN0TW91c2VEb3duVGltZTogbnVsbCxcbiAgICAgIGxhc3RNb3VzZURvd25Qb3NpdGlvbjogbnVsbCxcbiAgICAgIGxhc3RNb3VzZVVwUG9zaXRpb246IG51bGwsXG4gICAgICBsYXN0TW91c2VVcFRpbWU6IG51bGwsXG4gICAgICBpc01vdXNlRHJhZ2dpbmc6IGZhbHNlLFxuICAgICAgaXNLZXlTaGlmdERvd246IGZhbHNlLFxuICAgICAgaXNLZXlDdHJsRG93bjogZmFsc2UsXG4gICAgICBpc0tleUFsdERvd246IGZhbHNlLFxuICAgICAgaXNLZXlDb21tYW5kRG93bjogZmFsc2UsXG4gICAgICBpc0tleVNwYWNlRG93bjogZmFsc2UsXG4gICAgICBwYW5YOiAwLFxuICAgICAgcGFuWTogMCxcbiAgICAgIG9yaWdpbmFsUGFuWDogMCxcbiAgICAgIG9yaWdpbmFsUGFuWTogMCxcbiAgICAgIHpvb21YWTogMSxcbiAgICAgIGNvbW1lbnRzOiBbXSxcbiAgICAgIGRvU2hvd0NvbW1lbnRzOiBmYWxzZSxcbiAgICAgIHRhcmdldEVsZW1lbnQ6IG51bGwsXG4gICAgICBpc0V2ZW50SGFuZGxlckVkaXRvck9wZW46IGZhbHNlLFxuICAgICAgYWN0aXZlRHJhd2luZ1Rvb2w6ICdwb2ludGVyJyxcbiAgICAgIGRyYXdpbmdJc01vZGFsOiB0cnVlXG4gICAgfVxuXG4gICAgdGhpcy5fY29tcG9uZW50ID0gbmV3IEFjdGl2ZUNvbXBvbmVudCh7XG4gICAgICBhbGlhczogJ2dsYXNzJyxcbiAgICAgIGZvbGRlcjogdGhpcy5wcm9wcy5mb2xkZXIsXG4gICAgICB1c2VyY29uZmlnOiB0aGlzLnByb3BzLnVzZXJjb25maWcsXG4gICAgICB3ZWJzb2NrZXQ6IHRoaXMucHJvcHMud2Vic29ja2V0LFxuICAgICAgcGxhdGZvcm06IHdpbmRvdyxcbiAgICAgIGVudm95OiB0aGlzLnByb3BzLmVudm95LFxuICAgICAgV2ViU29ja2V0OiB3aW5kb3cuV2ViU29ja2V0XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybSh7em9vbTogdGhpcy5zdGF0ZS56b29tWFksIHBhbjoge3g6IHRoaXMuc3RhdGUucGFuWCwgeTogdGhpcy5zdGF0ZS5wYW5ZfX0pXG4gICAgdGhpcy5fY29tbWVudHMgPSBuZXcgQ29tbWVudHModGhpcy5wcm9wcy5mb2xkZXIpXG4gICAgdGhpcy5fY3R4bWVudSA9IG5ldyBDb250ZXh0TWVudSh3aW5kb3csIHRoaXMpXG5cbiAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2VcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBudWxsXG4gICAgdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSA9IDBcblxuICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG5cbiAgICB0aGlzLmRyYXdMb29wID0gdGhpcy5kcmF3TG9vcC5iaW5kKHRoaXMpXG4gICAgdGhpcy5kcmF3ID0gdGhpcy5kcmF3LmJpbmQodGhpcylcbiAgICB0aGlzLl9oYWlrdVJlbmRlcmVyID0gbmV3IEhhaWt1RE9NUmVuZGVyZXIoKVxuICAgIHRoaXMuX2hhaWt1Q29udGV4dCA9IG5ldyBIYWlrdUNvbnRleHQobnVsbCwgdGhpcy5faGFpa3VSZW5kZXJlciwge30sIHsgdGltZWxpbmVzOiB7fSwgdGVtcGxhdGU6IHsgZWxlbWVudE5hbWU6ICdkaXYnLCBhdHRyaWJ1dGVzOiB7fSwgY2hpbGRyZW46IFtdIH0gfSwgeyBvcHRpb25zOiB7IGNhY2hlOiB7fSwgc2VlZDogJ2FiY2RlJyB9IH0pXG5cbiAgICB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMgPSB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMuYmluZCh0aGlzKVxuXG4gICAgdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKVxuXG4gICAgd2luZG93LmdsYXNzID0gdGhpc1xuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0aW1lbGluZUNsaWVudFJlYWR5JywgKHRpbWVsaW5lQ2hhbm5lbCkgPT4ge1xuICAgICAgdGltZWxpbmVDaGFubmVsLm9uKCdkaWRQbGF5JywgdGhpcy5oYW5kbGVUaW1lbGluZURpZFBsYXkuYmluZCh0aGlzKSlcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkUGF1c2UnLCB0aGlzLmhhbmRsZVRpbWVsaW5lRGlkUGF1c2UuYmluZCh0aGlzKSlcbiAgICAgIHRpbWVsaW5lQ2hhbm5lbC5vbignZGlkU2VlaycsIHRoaXMuaGFuZGxlVGltZWxpbmVEaWRTZWVrLmJpbmQodGhpcykpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZW52b3k6dG91ckNsaWVudFJlYWR5JywgKGNsaWVudCkgPT4ge1xuICAgICAgdGhpcy50b3VyQ2xpZW50ID0gY2xpZW50XG4gICAgICB0aGlzLnRvdXJDbGllbnQub24oJ3RvdXI6cmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcycsIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyAoeyBzZWxlY3Rvciwgd2VidmlldyB9KSB7XG4gICAgaWYgKHdlYnZpZXcgIT09ICdnbGFzcycpIHsgcmV0dXJuIH1cblxuICAgIHRyeSB7XG4gICAgICAvLyBUT0RPOiBmaW5kIGlmIHRoZXJlIGlzIGEgYmV0dGVyIHNvbHV0aW9uIHRvIHRoaXMgc2NhcGUgaGF0Y2hcbiAgICAgIGxldCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3RvcilcbiAgICAgIGxldCB7IHRvcCwgbGVmdCB9ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuXG4gICAgICB0aGlzLnRvdXJDbGllbnQucmVjZWl2ZUVsZW1lbnRDb29yZGluYXRlcygnZ2xhc3MnLCB7IHRvcCwgbGVmdCB9KVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBmZXRjaGluZyAke3NlbGVjdG9yfSBpbiB3ZWJ2aWV3ICR7d2Vidmlld31gKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVRpbWVsaW5lRGlkUGxheSAoKSB7XG4gICAgdGhpcy5fcGxheWluZyA9IHRydWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gIH1cblxuICBoYW5kbGVUaW1lbGluZURpZFBhdXNlIChmcmFtZURhdGEpIHtcbiAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2VcbiAgICB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lID0gZnJhbWVEYXRhLmZyYW1lXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gRGF0ZS5ub3coKVxuICB9XG5cbiAgaGFuZGxlVGltZWxpbmVEaWRTZWVrIChmcmFtZURhdGEpIHtcbiAgICB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lID0gZnJhbWVEYXRhLmZyYW1lXG4gICAgdGhpcy5fc3RvcHdhdGNoID0gRGF0ZS5ub3coKVxuICAgIHRoaXMuZHJhdyh0cnVlKVxuICB9XG5cbiAgZHJhdyAoZm9yY2VTZWVrKSB7XG4gICAgaWYgKHRoaXMuX3BsYXlpbmcgfHwgZm9yY2VTZWVrKSB7XG4gICAgICB2YXIgc2Vla01zID0gMFxuICAgICAgLy8gdGhpcy5fc3RvcHdhdGNoIGlzIG51bGwgdW5sZXNzIHdlJ3ZlIHJlY2VpdmVkIGFuIGFjdGlvbiBmcm9tIHRoZSB0aW1lbGluZS5cbiAgICAgIC8vIElmIHdlJ3JlIGRldmVsb3BpbmcgdGhlIGdsYXNzIHNvbG8sIGkuZS4gd2l0aG91dCBhIGNvbm5lY3Rpb24gdG8gZW52b3kgd2hpY2hcbiAgICAgIC8vIHByb3ZpZGVzIHRoZSBzeXN0ZW0gY2xvY2ssIHdlIGNhbiBqdXN0IGxvY2sgdGhlIHRpbWUgdmFsdWUgdG8gemVybyBhcyBhIGhhY2suXG4gICAgICAvLyBUT0RPOiBXb3VsZCBiZSBuaWNlIHRvIGFsbG93IGZ1bGwtZmxlZGdlZCBzb2xvIGRldmVsb3BtZW50IG9mIGdsYXNzLi4uXG4gICAgICBpZiAodGhpcy5fc3RvcHdhdGNoICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBmcHMgPSA2MCAvLyBUT0RPOiAgc3VwcG9ydCB2YXJpYWJsZVxuICAgICAgICB2YXIgYmFzZU1zID0gdGhpcy5fbGFzdEF1dGhvcml0YXRpdmVGcmFtZSAqIDEwMDAgLyBmcHNcbiAgICAgICAgdmFyIGRlbHRhTXMgPSB0aGlzLl9wbGF5aW5nID8gRGF0ZS5ub3coKSAtIHRoaXMuX3N0b3B3YXRjaCA6IDBcbiAgICAgICAgc2Vla01zID0gYmFzZU1zICsgZGVsdGFNc1xuICAgICAgfVxuXG4gICAgICAvLyBUaGlzIHJvdW5kaW5nIGlzIHJlcXVpcmVkIG90aGVyd2lzZSB3ZSdsbCBzZWUgYml6YXJyZSBiZWhhdmlvciBvbiBzdGFnZS5cbiAgICAgIC8vIEkgdGhpbmsgaXQncyBiZWNhdXNlIHNvbWUgcGFydCBvZiB0aGUgcGxheWVyJ3MgY2FjaGluZyBvciB0cmFuc2l0aW9uIGxvZ2ljXG4gICAgICAvLyB3aGljaCB3YW50cyB0aGluZ3MgdG8gYmUgcm91bmQgbnVtYmVycy4gSWYgd2UgZG9uJ3Qgcm91bmQgdGhpcywgaS5lLiBjb252ZXJ0XG4gICAgICAvLyAxNi42NjYgLT4gMTcgYW5kIDMzLjMzMyAtPiAzMywgdGhlbiB0aGUgcGxheWVyIHdvbid0IHJlbmRlciB0aG9zZSBmcmFtZXMsXG4gICAgICAvLyB3aGljaCBtZWFucyB0aGUgdXNlciB3aWxsIGhhdmUgdHJvdWJsZSBtb3ZpbmcgdGhpbmdzIG9uIHN0YWdlIGF0IHRob3NlIHRpbWVzLlxuICAgICAgc2Vla01zID0gTWF0aC5yb3VuZChzZWVrTXMpXG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fc2V0VGltZWxpbmVUaW1lVmFsdWUoc2Vla01zLCBmb3JjZVNlZWspXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVmcy5vdmVybGF5KSB7XG4gICAgICB0aGlzLmRyYXdPdmVybGF5cyhmb3JjZVNlZWspXG4gICAgfVxuICB9XG5cbiAgZHJhd0xvb3AgKCkge1xuICAgIHRoaXMuZHJhdygpXG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXdMb29wKVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudC5tb3VudEFwcGxpY2F0aW9uKHRoaXMucmVmcy5tb3VudCwgeyBvcHRpb25zOiB7IGZyZWV6ZTogdHJ1ZSwgb3ZlcmZsb3dYOiAndmlzaWJsZScsIG92ZXJmbG93WTogJ3Zpc2libGUnLCBjb250ZXh0TWVudTogJ2Rpc2FibGVkJyB9IH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDptb3VudGVkJywgKCkgPT4ge1xuICAgICAgdmFyIG5ld01vdW50U2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG5cbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3VudFdpZHRoOiBuZXdNb3VudFNpemUud2lkdGgsXG4gICAgICAgIG1vdW50SGVpZ2h0OiBuZXdNb3VudFNpemUuaGVpZ2h0XG4gICAgICB9KVxuXG4gICAgICB0aGlzLmRyYXdMb29wKClcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdjb21wb25lbnQ6dXBkYXRlZCcsICgpID0+IHtcbiAgICAgIHRoaXMuZHJhdyh0cnVlKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2FydGJvYXJkOnJlc2l6ZWQnLCAoc2l6ZURlc2NyaXB0b3IpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3VudFdpZHRoOiBzaXplRGVzY3JpcHRvci53aWR0aCxcbiAgICAgICAgbW91bnRIZWlnaHQ6IHNpemVEZXNjcmlwdG9yLmhlaWdodFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCd0aW1lOmNoYW5nZScsICh0aW1lbGluZU5hbWUsIHRpbWVsaW5lVGltZSkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudCAmJiB0aGlzLl9jb21wb25lbnQuZ2V0TW91bnQoKSAmJiAhdGhpcy5fY29tcG9uZW50LmlzUmVsb2FkaW5nQ29kZSkge1xuICAgICAgICB2YXIgdXBkYXRlZEFydGJvYXJkU2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG4gICAgICAgIGlmICh1cGRhdGVkQXJ0Ym9hcmRTaXplICYmIHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGggJiYgdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgIG1vdW50V2lkdGg6IHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGgsXG4gICAgICAgICAgICBtb3VudEhlaWdodDogdXBkYXRlZEFydGJvYXJkU2l6ZS5oZWlnaHRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignYXJ0Ym9hcmQ6c2l6ZS1jaGFuZ2VkJywgKHNpemVEZXNjcmlwdG9yKSA9PiB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgbW91bnRXaWR0aDogc2l6ZURlc2NyaXB0b3Iud2lkdGgsXG4gICAgICAgIG1vdW50SGVpZ2h0OiBzaXplRGVzY3JpcHRvci5oZWlnaHRcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8vIFBhc3RlYWJsZSB0aGluZ3MgYXJlIHN0b3JlZCBhdCB0aGUgZ2xvYmFsIGxldmVsIGluIHRoZSBjbGlwYm9hcmQgYnV0IHdlIG5lZWQgdGhhdCBhY3Rpb24gdG8gZmlyZSBmcm9tIHRoZSB0b3AgbGV2ZWxcbiAgICAvLyBzbyB0aGF0IGFsbCB0aGUgdmlld3MgZ2V0IHRoZSBtZXNzYWdlLCBzbyB3ZSBlbWl0IHRoaXMgYXMgYW4gZXZlbnQgYW5kIHRoZW4gd2FpdCBmb3IgdGhlIGNhbGwgdG8gcGFzdGVUaGluZ1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Bhc3RlJywgKHBhc3RlRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBwYXN0ZSBoZWFyZCcpXG4gICAgICAvLyBOb3RpZnkgY3JlYXRvciB0aGF0IHdlIGhhdmUgc29tZSBjb250ZW50IHRoYXQgdGhlIHBlcnNvbiB3aXNoZXMgdG8gcGFzdGUgb24gdGhlIHN0YWdlO1xuICAgICAgLy8gdGhlIHRvcCBsZXZlbCBuZWVkcyB0byBoYW5kbGUgdGhpcyBiZWNhdXNlIGl0IGRvZXMgY29udGVudCB0eXBlIGRldGVjdGlvbi5cbiAgICAgIHBhc3RlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICBuYW1lOiAnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsXG4gICAgICAgIGZyb206ICdnbGFzcycsXG4gICAgICAgIGRhdGE6IG51bGwgLy8gVGhpcyBjYW4gaG9sZCBjb29yZGluYXRlcyBmb3IgdGhlIGxvY2F0aW9uIG9mIHRoZSBwYXN0ZVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZnVuY3Rpb24gaGFuZGxlVmlydHVhbENsaXBib2FyZCAoY2xpcGJvYXJkQWN0aW9uLCBtYXliZUNsaXBib2FyZEV2ZW50KSB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gaGFuZGxpbmcgY2xpcGJvYXJkIGFjdGlvbicsIGNsaXBib2FyZEFjdGlvbilcblxuICAgICAgLy8gQXZvaWQgaW5maW5pdGUgbG9vcHMgZHVlIHRvIHRoZSB3YXkgd2UgbGV2ZXJhZ2UgZXhlY0NvbW1hbmRcbiAgICAgIGlmICh0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gdHJ1ZVxuXG4gICAgICBpZiAodGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCkge1xuICAgICAgICAvLyBHb3R0YSBncmFiIF9iZWZvcmUgY3V0dGluZ18gb3Igd2UnbGwgZW5kIHVwIHdpdGggYSBwYXJ0aWFsIG9iamVjdCB0aGF0IHdvbid0IHdvcmtcbiAgICAgICAgbGV0IGNsaXBib2FyZFBheWxvYWQgPSB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50LmdldENsaXBib2FyZFBheWxvYWQoJ2dsYXNzJylcblxuICAgICAgICBpZiAoY2xpcGJvYXJkQWN0aW9uID09PSAnY3V0Jykge1xuICAgICAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQuY3V0KClcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZXJpYWxpemVkUGF5bG9hZCA9IEpTT04uc3RyaW5naWZ5KFsnYXBwbGljYXRpb24vaGFpa3UnLCBjbGlwYm9hcmRQYXlsb2FkXSlcblxuICAgICAgICBjbGlwYm9hcmQud3JpdGVUZXh0KHNlcmlhbGl6ZWRQYXlsb2FkKVxuXG4gICAgICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSBmYWxzZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG4gICAgICB9XG4gICAgfVxuXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY3V0JywgaGFuZGxlVmlydHVhbENsaXBib2FyZC5iaW5kKHRoaXMsICdjdXQnKSlcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjb3B5JywgaGFuZGxlVmlydHVhbENsaXBib2FyZC5iaW5kKHRoaXMsICdjb3B5JykpXG5cbiAgICAvLyBUaGlzIGZpcmVzIHdoZW4gdGhlIGNvbnRleHQgbWVudSBjdXQvY29weSBhY3Rpb24gaGFzIGJlZW4gZmlyZWQgLSBub3QgYSBrZXlib2FyZCBhY3Rpb24uXG4gICAgLy8gVGhpcyBmaXJlcyB3aXRoIGN1dCBPUiBjb3B5LiBJbiBjYXNlIG9mIGN1dCwgdGhlIGVsZW1lbnQgaGFzIGFscmVhZHkgYmVlbiAuY3V0KCkhXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OmNvcHknLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBlbGVtZW50OmNvcHknLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmQoY29tcG9uZW50SWQpXG4gICAgICBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkLmNhbGwodGhpcywgJ2NvcHknKVxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB0aGUgY3VycmVudCBzZWxlY3RlZCBlbGVtZW50IGNhbiBiZSBkZWxldGVkIGZyb20gdGhlIGdsb2JhbCBtZW51LCB3ZSBuZWVkIHRvIGtlZXAgaXQgdGhlcmVcbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6c2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBlbGVtZW50OnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kKGNvbXBvbmVudElkKVxuICAgIH0pXG5cbiAgICAvLyBTaW5jZSB0aGUgY3VycmVudCBzZWxlY3RlZCBlbGVtZW50IGNhbiBiZSBkZWxldGVkIGZyb20gdGhlIGdsb2JhbCBtZW51LCB3ZSBuZWVkIGNsZWFyIGl0IHRoZXJlIHRvb1xuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDp1bnNlbGVjdGVkJywgKGNvbXBvbmVudElkKSA9PiB7XG4gICAgICBjb25zb2xlLmluZm8oJ1tnbGFzc10gZWxlbWVudDp1bnNlbGVjdGVkJywgY29tcG9uZW50SWQpXG4gICAgICB0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50ID0gbnVsbFxuICAgICAgdGhpcy5kcmF3KHRydWUpXG4gICAgfSlcblxuICAgIHRoaXMucHJvcHMud2Vic29ja2V0Lm9uKCdicm9hZGNhc3QnLCAobWVzc2FnZSkgPT4ge1xuICAgICAgdmFyIG9sZFRyYW5zZm9ybSAvLyBEZWZpbmVkIGJlbG93IC8vIGxpbnRlclxuXG4gICAgICBzd2l0Y2ggKG1lc3NhZ2UubmFtZSkge1xuICAgICAgICBjYXNlICdjb21wb25lbnQ6cmVsb2FkJzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50Lm1vZHVsZVJlcGxhY2UoKGVycikgPT4ge1xuICAgICAgICAgICAgLy8gTm90aWZ5IHRoZSBwbHVtYmluZyB0aGF0IHRoZSBtb2R1bGUgcmVwbGFjZW1lbnQgaGVyZSBoYXMgZmluaXNoZWQsIHdoaWNoIHNob3VsZCByZWFjdGl2YXRlXG4gICAgICAgICAgICAvLyB0aGUgdW5kby9yZWRvIHF1ZXVlcyB3aGljaCBzaG91bGQgYmUgd2FpdGluZyBmb3IgdGhpcyB0byBmaW5pc2hcbiAgICAgICAgICAgIC8vIE5vdGUgaG93IHdlIGRvIHRoaXMgd2hldGhlciBvciBub3Qgd2UgZ290IGFuIGVycm9yIGZyb20gdGhlIGFjdGlvblxuICAgICAgICAgICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQuc2VuZCh7XG4gICAgICAgICAgICAgIHR5cGU6ICdicm9hZGNhc3QnLFxuICAgICAgICAgICAgICBuYW1lOiAnY29tcG9uZW50OnJlbG9hZDpjb21wbGV0ZScsXG4gICAgICAgICAgICAgIGZyb206ICdnbGFzcydcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgYXJ0Ym9hcmQgc2l6ZSBtYXkgaGF2ZSBjaGFuZ2VkIGFzIGEgcGFydCBvZiB0aGF0LCBhbmQgc2luY2UgdGhlcmUgYXJlIHR3byBzb3VyY2VzIG9mXG4gICAgICAgICAgICAvLyB0cnV0aCBmb3IgdGhpcyAoYWN0dWFsIGFydGJvYXJkLCBSZWFjdCBtb3VudCBmb3IgYXJ0Ym9hcmQpLCB3ZSBoYXZlIHRvIHVwZGF0ZSBpdCBoZXJlLlxuICAgICAgICAgICAgdmFyIHVwZGF0ZWRBcnRib2FyZFNpemUgPSB0aGlzLl9jb21wb25lbnQuZ2V0Q29udGV4dFNpemUoKVxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgIG1vdW50V2lkdGg6IHVwZGF0ZWRBcnRib2FyZFNpemUud2lkdGgsXG4gICAgICAgICAgICAgIG1vdW50SGVpZ2h0OiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuXG4gICAgICAgIGNhc2UgJ3ZpZXc6em9vbS1pbic6XG4gICAgICAgICAgb2xkVHJhbnNmb3JtID0gdGhpcy5fY29tcG9uZW50LmdldFN0YWdlVHJhbnNmb3JtKClcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0uem9vbSA9IHRoaXMuc3RhdGUuem9vbVhZICogMS4yNVxuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybShvbGRUcmFuc2Zvcm0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyB6b29tWFk6IHRoaXMuc3RhdGUuem9vbVhZICogMS4yNSB9KVxuXG4gICAgICAgIGNhc2UgJ3ZpZXc6em9vbS1vdXQnOlxuICAgICAgICAgIG9sZFRyYW5zZm9ybSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTdGFnZVRyYW5zZm9ybSgpXG4gICAgICAgICAgb2xkVHJhbnNmb3JtLnpvb20gPSB0aGlzLnN0YXRlLnpvb21YWSAvIDEuMjVcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0ob2xkVHJhbnNmb3JtKVxuICAgICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgem9vbVhZOiB0aGlzLnN0YXRlLnpvb21YWSAvIDEuMjUgfSlcblxuICAgICAgICBjYXNlICdkcmF3aW5nOnNldEFjdGl2ZSc6XG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgYWN0aXZlRHJhd2luZ1Rvb2w6IG1lc3NhZ2UucGFyYW1zWzBdLFxuICAgICAgICAgICAgZHJhd2luZ0lzTW9kYWw6IG1lc3NhZ2UucGFyYW1zWzFdXG4gICAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ21ldGhvZCcsIChtZXRob2QsIHBhcmFtcywgY2IpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuY2FsbE1ldGhvZChtZXRob2QsIHBhcmFtcywgY2IpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbW1lbnRzLmxvYWQoKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgcmV0dXJuIHZvaWQgKDApXG4gICAgICB0aGlzLnNldFN0YXRlKHsgY29tbWVudHM6IHRoaXMuX2NvbW1lbnRzLmNvbW1lbnRzIH0pXG4gICAgfSlcblxuICAgIHRoaXMuX2N0eG1lbnUub24oJ2NsaWNrJywgKGFjdGlvbiwgZXZlbnQsIGVsZW1lbnQpID0+IHtcbiAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgJ0FkZCBDb21tZW50JzpcbiAgICAgICAgICB0aGlzLl9jb21tZW50cy5idWlsZCh7IHg6IHRoaXMuX2N0eG1lbnUuX21lbnUubGFzdFgsIHk6IHRoaXMuX2N0eG1lbnUuX21lbnUubGFzdFkgfSlcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tbWVudHM6IHRoaXMuX2NvbW1lbnRzLmNvbW1lbnRzLCBkb1Nob3dDb21tZW50czogdHJ1ZSB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHhtZW51LnJlYnVpbGQodGhpcylcbiAgICAgICAgICB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ0hpZGUgQ29tbWVudHMnOlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkb1Nob3dDb21tZW50czogIXRoaXMuc3RhdGUuZG9TaG93Q29tbWVudHMgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4bWVudS5yZWJ1aWxkKHRoaXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdTaG93IENvbW1lbnRzJzpcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZG9TaG93Q29tbWVudHM6ICF0aGlzLnN0YXRlLmRvU2hvd0NvbW1lbnRzIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eG1lbnUucmVidWlsZCh0aGlzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnU2hvdyBFdmVudCBMaXN0ZW5lcnMnOlxuICAgICAgICAgIHRoaXMuc2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IoZXZlbnQsIGVsZW1lbnQpXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gUGFzdGVhYmxlIHRoaW5ncyBhcmUgc3RvcmVkIGF0IHRoZSBnbG9iYWwgbGV2ZWwgaW4gdGhlIGNsaXBib2FyZCBidXQgd2UgbmVlZCB0aGF0IGFjdGlvbiB0byBmaXJlIGZyb20gdGhlIHRvcCBsZXZlbFxuICAgIC8vIHNvIHRoYXQgYWxsIHRoZSB2aWV3cyBnZXQgdGhlIG1lc3NhZ2UsIHNvIHdlIGVtaXQgdGhpcyBhcyBhbiBldmVudCBhbmQgdGhlbiB3YWl0IGZvciB0aGUgY2FsbCB0byBwYXN0ZVRoaW5nXG4gICAgdGhpcy5fY3R4bWVudS5vbignY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIChkYXRhKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgZGF0YTogZGF0YVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGxvZGFzaC50aHJvdHRsZSgoKSA9PiB7XG4gICAgICByZXR1cm4gdGhpcy5oYW5kbGVXaW5kb3dSZXNpemUoKVxuICAgIH0pLCA2NClcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy53aW5kb3dNb3VzZVVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLndpbmRvd01vdXNlTW92ZUhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMud2luZG93TW91c2VVcEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy53aW5kb3dNb3VzZURvd25IYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy53aW5kb3dDbGlja0hhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCB0aGlzLndpbmRvd0RibENsaWNrSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcy53aW5kb3dLZXlEb3duSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMud2luZG93S2V5VXBIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgdGhpcy53aW5kb3dNb3VzZU91dEhhbmRsZXIuYmluZCh0aGlzKSlcblxuICAgIHdpbmRvdy5vbmVycm9yID0gKGVycm9yKSA9PiB7XG4gICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2VcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvciB9KVxuICAgIH1cblxuICAgIC8vIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKCgpID0+IHtcbiAgICAvLyAgICB0aGlzLmRyYXdMb29wKClcbiAgICAvLyB9KVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlICgpIHtcbiAgICB0aGlzLnJlc2V0Q29udGFpbmVyRGltZW5zaW9ucygpXG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCAoKSB7XG4gICAgdGhpcy50b3VyQ2xpZW50Lm9mZigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIHRoaXMuX2Vudm95Q2xpZW50LmNsb3NlQ29ubmVjdGlvbigpXG4gIH1cblxuICBoYW5kbGVXaW5kb3dSZXNpemUgKCkge1xuICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKVxuICAgIH0pXG4gIH1cblxuICBzaG93RXZlbnRIYW5kbGVyc0VkaXRvciAoY2xpY2tFdmVudCwgdGFyZ2V0RWxlbWVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgdGFyZ2V0RWxlbWVudDogdGFyZ2V0RWxlbWVudCxcbiAgICAgIGlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbjogdHJ1ZVxuICAgIH0pXG4gIH1cblxuICBoaWRlRXZlbnRIYW5kbGVyc0VkaXRvciAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0YXJnZXRFbGVtZW50OiBudWxsLFxuICAgICAgaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuOiBmYWxzZVxuICAgIH0pXG4gIH1cblxuICBzYXZlRXZlbnRIYW5kbGVyICh0YXJnZXRFbGVtZW50LCBldmVudE5hbWUsIGhhbmRsZXJEZXNjcmlwdG9yU2VyaWFsaXplZCkge1xuICAgIGxldCBzZWxlY3Rvck5hbWUgPSAnaGFpa3U6JyArIHRhcmdldEVsZW1lbnQudWlkXG4gICAgdGhpcy5fY29tcG9uZW50LnVwc2VydEV2ZW50SGFuZGxlcihzZWxlY3Rvck5hbWUsIGV2ZW50TmFtZSwgaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkLCB7IGZyb206ICdnbGFzcycgfSwgKCkgPT4ge1xuXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm1QYW4gKGR4LCBkeSkge1xuICAgIHZhciBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgIG9sZFRyYW5zZm9ybS5wYW4ueCA9IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5YICsgZHhcbiAgICBvbGRUcmFuc2Zvcm0ucGFuLnkgPSB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWSArIGR5XG4gICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHBhblg6IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5YICsgZHgsXG4gICAgICBwYW5ZOiB0aGlzLnN0YXRlLm9yaWdpbmFsUGFuWSArIGR5XG4gICAgfSlcbiAgfVxuXG4gIHdpbmRvd01vdXNlT3V0SGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHZhciBzb3VyY2UgPSBuYXRpdmVFdmVudC5yZWxhdGVkVGFyZ2V0IHx8IG5hdGl2ZUV2ZW50LnRvRWxlbWVudFxuICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5ub2RlTmFtZSA9PT0gJ0hUTUwnKSB7XG4gICAgICAvLyB0aGlzLnNldFN0YXRlKHtcbiAgICAgIC8vICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgLy8gICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgLy8gICBjb250cm9sQWN0aXZhdGlvbjogbnVsbFxuICAgICAgLy8gfSlcbiAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuaG92ZXJlZC5kZXF1ZXVlKClcbiAgICB9XG4gIH1cblxuICB3aW5kb3dNb3VzZU1vdmVIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VNb3ZlKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd01vdXNlVXBIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VVcCh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICB3aW5kb3dNb3VzZURvd25IYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlTW91c2VEb3duKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0NsaWNrSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZUNsaWNrKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0RibENsaWNrSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIG5hdGl2ZUV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICB0aGlzLmhhbmRsZURvdWJsZUNsaWNrKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0tleURvd25IYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLZXlEb3duKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd0tleVVwSGFuZGxlciAobmF0aXZlRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkgfHwgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuaGFuZGxlS2V5VXAoeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VEb3duIChtb3VzZWRvd25FdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgaWYgKG1vdXNlZG93bkV2ZW50Lm5hdGl2ZUV2ZW50LmJ1dHRvbiAhPT0gMCkgcmV0dXJuIC8vIGxlZnQgY2xpY2sgb25seVxuXG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRG93biA9IHRydWVcbiAgICB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25UaW1lID0gRGF0ZS5ub3coKVxuICAgIHZhciBtb3VzZVBvcyA9IHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNlZG93bkV2ZW50LCAnbGFzdE1vdXNlRG93blBvc2l0aW9uJylcblxuICAgIGlmICh0aGlzLnN0YXRlLmFjdGl2ZURyYXdpbmdUb29sICE9PSAncG9pbnRlcicpIHtcbiAgICAgIGlmICghdGhpcy5zdGF0ZS5kcmF3aW5nSXNNb2RhbCkge1xuICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHsgdHlwZTogJ2Jyb2FkY2FzdCcsIG5hbWU6ICdkcmF3aW5nOmNvbXBsZXRlZCcsIGZyb206ICdnbGFzcycgfSlcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29tcG9uZW50Lmluc3RhbnRpYXRlQ29tcG9uZW50KHRoaXMuc3RhdGUuYWN0aXZlRHJhd2luZ1Rvb2wsIHtcbiAgICAgICAgeDogbW91c2VQb3MueCxcbiAgICAgICAgeTogbW91c2VQb3MueSxcbiAgICAgICAgbWluaW1pemVkOiB0cnVlXG4gICAgICB9LCB7IGZyb206ICdnbGFzcycgfSwgKGVyciwgbWV0YWRhdGEsIGVsZW1lbnQpID0+IHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycilcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBtb3VzZSBpcyBzdGlsbCBkb3duIGJlZ2luIGRyYWcgc2NhbGluZ1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc01vdXNlRG93bikge1xuICAgICAgICAgIC8vIGFjdGl2YXRlIHRoZSBib3R0b20gcmlnaHQgY29udHJvbCBwb2ludCwgZm9yIHNjYWxpbmdcbiAgICAgICAgICB0aGlzLmNvbnRyb2xBY3RpdmF0aW9uKHtcbiAgICAgICAgICAgIGluZGV4OiA4LFxuICAgICAgICAgICAgZXZlbnQ6IG1vdXNlZG93bkV2ZW50XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2xpbWIgdGhlIHRhcmdldCBwYXRoIHRvIGZpbmQgaWYgYSBoYWlrdSBlbGVtZW50IGhhcyBiZWVuIHNlbGVjdGVkXG4gICAgICAvLyBOT1RFOiB3ZSB3YW50IHRvIG1ha2Ugc3VyZSB3ZSBhcmUgbm90IHNlbGVjdGluZyBlbGVtZW50cyBhdCB0aGUgd3JvbmcgY29udGV4dCBsZXZlbFxuICAgICAgdmFyIHRhcmdldCA9IG1vdXNlZG93bkV2ZW50Lm5hdGl2ZUV2ZW50LnRhcmdldFxuICAgICAgaWYgKCh0eXBlb2YgdGFyZ2V0LmNsYXNzTmFtZSA9PT0gJ3N0cmluZycpICYmIHRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignc2NhbGUtY3Vyc29yJykgIT09IC0xKSByZXR1cm5cblxuICAgICAgd2hpbGUgKHRhcmdldC5oYXNBdHRyaWJ1dGUgJiYgKCF0YXJnZXQuaGFzQXR0cmlidXRlKCdzb3VyY2UnKSB8fCAhdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaGFpa3UtaWQnKSB8fFxuICAgICAgICAgICAgICF0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmQodGFyZ2V0LmdldEF0dHJpYnV0ZSgnaGFpa3UtaWQnKSkpKSB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXG4gICAgICB9XG5cbiAgICAgIGlmICghdGFyZ2V0IHx8ICF0YXJnZXQuaGFzQXR0cmlidXRlKSB7XG4gICAgICAgIC8vIElmIHNoaWZ0IGlzIGRvd24sIHRoYXQncyBjb25zdHJhaW5lZCBzY2FsaW5nLiBJZiBjbWQsIHRoYXQncyByb3RhdGlvbiBtb2RlLlxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24gJiYgIXRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bikge1xuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnc291cmNlJykgJiYgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaGFpa3UtaWQnKSAmJiB0YXJnZXQucGFyZW50Tm9kZSAhPT0gdGhpcy5yZWZzLm1vdW50KSB7XG4gICAgICAgIHZhciBoYWlrdUlkID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnaGFpa3UtaWQnKVxuICAgICAgICB2YXIgY29udGFpbmVkID0gbG9kYXNoLmZpbmQodGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSksXG4gICAgICAgICAgICAoZWxlbWVudCkgPT4gZWxlbWVudC51aWQgPT09IGhhaWt1SWQpXG5cbiAgICAgICAgLy8gd2UgY2hlY2sgaWYgdGhlIGVsZW1lbnQgYmVpbmcgY2xpY2tlZCBvbiBpcyBhbHJlYWR5IGluIHRoZSBzZWxlY3Rpb24sIGlmIGl0IGlzIHdlIGRvbid0IHdhbnRcbiAgICAgICAgLy8gdG8gY2xlYXIgdGhlIHNlbGVjdGlvbiBzaW5jZSBpdCBjb3VsZCBiZSBhIGdyb3VwZWQgc2VsZWN0aW9uXG4gICAgICAgIC8vIElmIHNoaWZ0IGlzIGRvd24sIHRoYXQncyBjb25zdHJhaW5lZCBzY2FsaW5nLiBJZiBjbWQsIHRoYXQncyByb3RhdGlvbiBtb2RlLlxuICAgICAgICBpZiAoIWNvbnRhaW5lZCAmJiAoIXRoaXMuc3RhdGUuaXNLZXlTaGlmdERvd24gJiYgIXRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bikpIHtcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbnRhaW5lZCkge1xuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZWxlY3RFbGVtZW50KGhhaWt1SWQsIHsgZnJvbTogJ2dsYXNzJyB9LCAoKSA9PiB7fSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZU1vdXNlVXAgKG1vdXNldXBFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRG93biA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5sYXN0TW91c2VVcFRpbWUgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5oYW5kbGVEcmFnU3RvcCgpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBpc0FueXRoaW5nU2NhbGluZzogZmFsc2UsXG4gICAgICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgZ2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3M6ICcnLFxuICAgICAgY29udHJvbEFjdGl2YXRpb246IG51bGxcbiAgICB9KVxuICAgIHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNldXBFdmVudCwgJ2xhc3RNb3VzZVVwUG9zaXRpb24nKVxuICB9XG5cbiAgaGFuZGxlQ2xpY2sgKGNsaWNrRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihjbGlja0V2ZW50KVxuICB9XG5cbiAgaGFuZGxlRG91YmxlQ2xpY2sgKGRvdWJsZUNsaWNrRXZlbnQpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLnN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbihkb3VibGVDbGlja0V2ZW50KVxuICB9XG5cbiAgaGFuZGxlRHJhZ1N0YXJ0IChjYikge1xuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nID0gdHJ1ZVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc01vdXNlRHJhZ2dpbmc6IHRydWUgfSwgY2IpXG4gIH1cblxuICBoYW5kbGVEcmFnU3RvcCAoY2IpIHtcbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEcmFnZ2luZyA9IGZhbHNlXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzTW91c2VEcmFnZ2luZzogZmFsc2UgfSwgY2IpXG4gIH1cblxuICBoYW5kbGVLZXlFc2NhcGUgKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgfVxuXG4gIGhhbmRsZUtleVNwYWNlIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5U3BhY2VEb3duOiBpc0Rvd24gfSlcbiAgICAvLyB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmRyaWxsZG93bkludG9BbHJlYWR5U2VsZWN0ZWRFbGVtZW50KHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQpXG4gIH1cblxuICBoYW5kbGVLZXlMZWZ0QXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZSgtZGVsdGEsIDAsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlVcEFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoMCwgLWRlbHRhLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5UmlnaHRBcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKGRlbHRhLCAwLCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LCB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cylcbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlS2V5RG93bkFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoMCwgZGVsdGEsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlEb3duIChrZXlFdmVudCkge1xuICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvci53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQoa2V5RXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5RXZlbnQubmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgMjc6IHJldHVybiB0aGlzLmhhbmRsZUtleUVzY2FwZSgpXG4gICAgICBjYXNlIDMyOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlTcGFjZShrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMzc6IHJldHVybiB0aGlzLmhhbmRsZUtleUxlZnRBcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgMzg6IHJldHVybiB0aGlzLmhhbmRsZUtleVVwQXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDM5OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlSaWdodEFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSA0MDogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RG93bkFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSA0NjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RGVsZXRlKClcbiAgICAgIGNhc2UgODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RGVsZXRlKClcbiAgICAgIGNhc2UgMTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUVudGVyKClcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLmhhbmRsZUtleVNoaWZ0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q3RybChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMTg6IHJldHVybiB0aGlzLmhhbmRsZUtleUFsdChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGNhc2UgOTM6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleVVwIChrZXlFdmVudCkge1xuICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yKSB7XG4gICAgICBpZiAodGhpcy5yZWZzLmV2ZW50SGFuZGxlckVkaXRvci53aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQoa2V5RXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAoa2V5RXZlbnQubmF0aXZlRXZlbnQud2hpY2gpIHtcbiAgICAgIGNhc2UgMzI6IHJldHVybiB0aGlzLmhhbmRsZUtleVNwYWNlKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTY6IHJldHVybiB0aGlzLmhhbmRsZUtleVNoaWZ0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMTc6IHJldHVybiB0aGlzLmhhbmRsZUtleUN0cmwoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5QWx0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgMjI0OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGNhc2UgOTE6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUtleUVudGVyICgpIHtcbiAgICAvLyBub29wIGZvciBub3dcbiAgfVxuXG4gIGhhbmRsZUtleUNvbW1hbmQgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB2YXIgY29udHJvbEFjdGl2YXRpb24gPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uXG4gICAgaWYgKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgICBjb250cm9sQWN0aXZhdGlvbi5jbWQgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q29tbWFuZERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUtleVNoaWZ0IChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uc2hpZnQgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5U2hpZnREb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVLZXlDdHJsIChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uY3RybCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlDdHJsRG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlS2V5QWx0IChuYXRpdmVFdmVudCwgaXNEb3duKSB7XG4gICAgdmFyIGNvbnRyb2xBY3RpdmF0aW9uID0gdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvblxuICAgIGlmIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgICAgY29udHJvbEFjdGl2YXRpb24uYWx0ID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleUFsdERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUNsaWNrU3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgdmFyIGFydGJvYXJkID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5maW5kUm9vdHMoKVswXVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuY2xpY2tlZC5hZGQoYXJ0Ym9hcmQpXG4gICAgYXJ0Ym9hcmQuc2VsZWN0KHsgZnJvbTogJ2dsYXNzJyB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdmVyU3RhZ2VOYW1lICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNTdGFnZU5hbWVIb3ZlcmluZzogdHJ1ZSB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VPdXRTdGFnZU5hbWUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1N0YWdlTmFtZUhvdmVyaW5nOiBmYWxzZSB9KVxuICB9XG5cbiAgaGFuZGxlTW91c2VNb3ZlIChtb3VzZW1vdmVFdmVudCkge1xuICAgIGNvbnN0IHpvb20gPSB0aGlzLnN0YXRlLnpvb21YWSB8fCAxXG4gICAgY29uc3QgbGFzdE1vdXNlRG93blBvc2l0aW9uID0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb25cbiAgICBjb25zdCBtb3VzZVBvc2l0aW9uQ3VycmVudCA9IHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKG1vdXNlbW92ZUV2ZW50KVxuICAgIGNvbnN0IG1vdXNlUG9zaXRpb25QcmV2aW91cyA9IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzIHx8IG1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgbGV0IGR4ID0gKG1vdXNlUG9zaXRpb25DdXJyZW50LnggLSBtb3VzZVBvc2l0aW9uUHJldmlvdXMueCkgLyB6b29tXG4gICAgbGV0IGR5ID0gKG1vdXNlUG9zaXRpb25DdXJyZW50LnkgLSBtb3VzZVBvc2l0aW9uUHJldmlvdXMueSkgLyB6b29tXG4gICAgaWYgKGR4ID09PSAwICYmIGR5ID09PSAwKSByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcblxuICAgIC8vIGlmIChkeCAhPT0gMCkgZHggPSBNYXRoLnJvdW5kKHRoaXMuc3RhdGUuem9vbVhZIC8gZHgpXG4gICAgLy8gaWYgKGR5ICE9PSAwKSBkeSA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS56b29tWFkgLyBkeSlcbiAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIsIHRoZSBtb3VzZSBoYXMgY2hhbmdlZCBpdHMgcG9zaXRpb24gZnJvbSB0aGUgbW9zdCByZWNlbnQgbW91c2Vkb3duXG4gICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgIHRoaXMuaGFuZGxlRHJhZ1N0YXJ0KClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nICYmIHRoaXMuc3RhdGUuaXNNb3VzZURvd24pIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzS2V5U3BhY2VEb3duICYmIHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24pIHtcbiAgICAgICAgdGhpcy5wZXJmb3JtUGFuKFxuICAgICAgICAgIG1vdXNlbW92ZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFggLSB0aGlzLnN0YXRlLnN0YWdlTW91c2VEb3duLngsXG4gICAgICAgICAgbW91c2Vtb3ZlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WSAtIHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24ueVxuICAgICAgICApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KVxuICAgICAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNlbGVjdGVkLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGVsZW1lbnQuZHJhZyhkeCwgZHksIG1vdXNlUG9zaXRpb25DdXJyZW50LCBtb3VzZVBvc2l0aW9uUHJldmlvdXMsIGxhc3RNb3VzZURvd25Qb3NpdGlvbiwgdGhpcy5zdGF0ZSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICB9XG5cbiAgaGFuZGxlS2V5RGVsZXRlICgpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50LnJlbW92ZSgpXG4gICAgfSlcbiAgfVxuXG4gIHJlc2V0Q29udGFpbmVyRGltZW5zaW9ucyAoY2IpIHtcbiAgICBpZiAoIXRoaXMucmVmcy5jb250YWluZXIpIHJldHVyblxuICAgIHZhciB3ID0gdGhpcy5yZWZzLmNvbnRhaW5lci5jbGllbnRXaWR0aFxuICAgIHZhciBoID0gdGhpcy5yZWZzLmNvbnRhaW5lci5jbGllbnRIZWlnaHRcbiAgICB2YXIgbW91bnRYID0gKHcgLSB0aGlzLnN0YXRlLm1vdW50V2lkdGgpIC8gMlxuICAgIHZhciBtb3VudFkgPSAoaCAtIHRoaXMuc3RhdGUubW91bnRIZWlnaHQpIC8gMlxuICAgIGlmICh3ICE9PSB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoIHx8IGggIT09IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0IHx8IG1vdW50WCAhPT0gdGhpcy5zdGF0ZS5tb3VudFggfHwgbW91bnRZICE9PSB0aGlzLnN0YXRlLm1vdW50WSkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGNvbnRhaW5lcldpZHRoOiB3LCBjb250YWluZXJIZWlnaHQ6IGgsIG1vdW50WCwgbW91bnRZIH0sIGNiKVxuICAgIH1cbiAgfVxuXG4gIGdldEFydGJvYXJkUmVjdCAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYLFxuICAgICAgcmlnaHQ6IHRoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSxcbiAgICAgIGJvdHRvbTogdGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodFxuICAgIH1cbiAgfVxuXG4gIGdldFNlbGVjdGlvbk1hcnF1ZWVTaXplICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQgfHwgIXRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uKSB7XG4gICAgICByZXR1cm4geyB4OiAwLCB5OiAwLCB3aWR0aDogMCwgaGVpZ2h0OiAwIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLnggKyB0aGlzLmdldEFydGJvYXJkUmVjdCgpLmxlZnQsXG4gICAgICB5OiB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi55ICsgdGhpcy5nZXRBcnRib2FyZFJlY3QoKS50b3AsXG4gICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudC54IC0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueCxcbiAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudC55IC0gdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueVxuICAgIH1cbiAgfVxuXG4gIGNvbnRyb2xBY3RpdmF0aW9uIChjb250cm9sQWN0aXZhdGlvbikge1xuICAgIHZhciBhcnRib2FyZCA9IHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzQW55dGhpbmdSb3RhdGluZzogdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLFxuICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6ICF0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sXG4gICAgICBjb250cm9sQWN0aXZhdGlvbjoge1xuICAgICAgICBzaGlmdDogdGhpcy5zdGF0ZS5pc0tleVNoaWZ0RG93bixcbiAgICAgICAgY3RybDogdGhpcy5zdGF0ZS5pc0tleUN0cmxEb3duLFxuICAgICAgICBjbWQ6IHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bixcbiAgICAgICAgYWx0OiB0aGlzLnN0YXRlLmlzS2V5QWx0RG93bixcbiAgICAgICAgaW5kZXg6IGNvbnRyb2xBY3RpdmF0aW9uLmluZGV4LFxuICAgICAgICBhcmJvYXJkOiBhcnRib2FyZCxcbiAgICAgICAgY2xpZW50OiB7XG4gICAgICAgICAgeDogY29udHJvbEFjdGl2YXRpb24uZXZlbnQuY2xpZW50WCxcbiAgICAgICAgICB5OiBjb250cm9sQWN0aXZhdGlvbi5ldmVudC5jbGllbnRZXG4gICAgICAgIH0sXG4gICAgICAgIGNvb3Jkczoge1xuICAgICAgICAgIHg6IGNvbnRyb2xBY3RpdmF0aW9uLmV2ZW50LmNsaWVudFggLSBhcnRib2FyZC5sZWZ0LFxuICAgICAgICAgIHk6IGNvbnRyb2xBY3RpdmF0aW9uLmV2ZW50LmNsaWVudFkgLSBhcnRib2FyZC50b3BcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBzdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24gKG1vdXNlRXZlbnQsIGFkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGUpIHtcbiAgICBpZiAoIXRoaXMucmVmcy5jb250YWluZXIpIHJldHVybiBudWxsIC8vIFdlIGhhdmVuJ3QgbW91bnRlZCB5ZXQsIG5vIHNpemUgYXZhaWxhYmxlXG4gICAgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMgPSB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgY29uc3QgbW91c2VQb3NpdGlvbkN1cnJlbnQgPSBnZXRMb2NhbERvbUV2ZW50UG9zaXRpb24obW91c2VFdmVudC5uYXRpdmVFdmVudCwgdGhpcy5yZWZzLmNvbnRhaW5lcilcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC5jbGllbnRYID0gbW91c2VFdmVudC5uYXRpdmVFdmVudC5jbGllbnRYXG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQuY2xpZW50WSA9IG1vdXNlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WVxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LnggLT0gdGhpcy5nZXRBcnRib2FyZFJlY3QoKS5sZWZ0XG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQueSAtPSB0aGlzLmdldEFydGJvYXJkUmVjdCgpLnRvcFxuICAgIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQgPSBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIGlmIChhZGRpdGlvbmFsUG9zaXRpb25UcmFja2luZ1N0YXRlKSB0aGlzLnN0YXRlW2FkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGVdID0gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICByZXR1cm4gbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgfVxuXG4gIGRyYXdPdmVybGF5cyAoZm9yY2UpIHtcbiAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKGZvcmNlIHx8IHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9oYWlrdVJlbmRlcmVyLmNyZWF0ZUNvbnRhaW5lcih0aGlzLnJlZnMub3ZlcmxheSlcbiAgICAgIHZhciBwYXJ0cyA9IHRoaXMuYnVpbGREcmF3bk92ZXJsYXlzKClcbiAgICAgIHZhciBvdmVybGF5ID0ge1xuICAgICAgICBlbGVtZW50TmFtZTogJ2RpdicsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICBpZDogJ2hhaWt1LWdsYXNzLW92ZXJsYXktcm9vdCcsXG4gICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ21hdHJpeDNkKDEsMCwwLDAsMCwxLDAsMCwwLDAsMSwwLDAsMCwwLDEpJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYICsgJ3B4JyxcbiAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFkgKyAncHgnLFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCArICdweCcsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHQgKyAncHgnXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBjaGlsZHJlbjogcGFydHNcbiAgICAgIH1cbiAgICAgIHRoaXMuX2hhaWt1UmVuZGVyZXIucmVuZGVyKHRoaXMucmVmcy5vdmVybGF5LCBjb250YWluZXIsIG92ZXJsYXksIHRoaXMuX2hhaWt1Q29udGV4dC5jb21wb25lbnQsIGZhbHNlKVxuICAgIH1cbiAgfVxuXG4gIC8vIFRoaXMgbWV0aG9kIGNyZWF0ZXMgb2JqZWN0cyB3aGljaCByZXByZXNlbnQgSGFpa3UgUGxheWVyIHJlbmRlcmluZyBpbnN0cnVjdGlvbnMgZm9yIGRpc3BsYXlpbmcgYWxsIG9mXG4gIC8vIHRoZSB2aXN1YWwgZWZmZWN0cyB0aGF0IHNpdCBhYm92ZSB0aGUgc3RhZ2UuIChUcmFuc2Zvcm0gY29udHJvbHMsIGV0Yy4pIFRoZSBIYWlrdSBQbGF5ZXIgaXMgc29ydCBvZiBhXG4gIC8vIGh5YnJpZCBvZiBSZWFjdCBGaWJlciBhbmQgRmFtb3VzIEVuZ2luZS4gSXQgaGFzIGEgdmlydHVhbCBET00gdHJlZSBvZiBlbGVtZW50cyBsaWtlIHtlbGVtZW50TmFtZTogJ2RpdicsIGF0dHJpYnV0ZXM6IHt9LCBbXX0sXG4gIC8vIGFuZCBmbHVzaGVzIHVwZGF0ZXMgdG8gdGhlbSBvbiBlYWNoIGZyYW1lLiBTbyB3aGF0IF90aGlzIG1ldGhvZF8gZG9lcyBpcyBqdXN0IGJ1aWxkIHRob3NlIG9iamVjdHMgYW5kIHRoZW5cbiAgLy8gdGhlc2UgZ2V0IHBhc3NlZCBpbnRvIGEgSGFpa3UgUGxheWVyIHJlbmRlciBtZXRob2QgKHNlZSBhYm92ZSkuIExPTkcgU1RPUlkgU0hPUlQ6IFRoaXMgY3JlYXRlcyBhIGZsYXQgbGlzdCBvZlxuICAvLyBub2RlcyB0aGF0IGdldCByZW5kZXJlZCB0byB0aGUgRE9NIGJ5IHRoZSBIYWlrdSBQbGF5ZXIuXG4gIGJ1aWxkRHJhd25PdmVybGF5cyAoKSB7XG4gICAgdmFyIG92ZXJsYXlzID0gW11cbiAgICAvLyBEb24ndCBzaG93IGFueSBvdmVybGF5cyBpZiB3ZSdyZSBpbiBwcmV2aWV3IChha2EgJ2xpdmUnKSBpbnRlcmFjdGlvbk1vZGVcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgIHJldHVybiBvdmVybGF5c1xuICAgIH1cbiAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBwb2ludHNcbiAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSBzZWxlY3RlZFswXVxuICAgICAgICBpZiAoZWxlbWVudC5pc1JlbmRlcmFibGVUeXBlKCkpIHtcbiAgICAgICAgICBwb2ludHMgPSBlbGVtZW50LmdldFBvaW50c1RyYW5zZm9ybWVkKHRydWUpXG4gICAgICAgICAgdGhpcy5yZW5kZXJNb3JwaFBvaW50c092ZXJsYXkocG9pbnRzLCBvdmVybGF5cylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwb2ludHMgPSBlbGVtZW50LmdldEJveFBvaW50c1RyYW5zZm9ybWVkKClcbiAgICAgICAgICB2YXIgcm90YXRpb25aID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdyb3RhdGlvbi56JykgfHwgMFxuICAgICAgICAgIHZhciBzY2FsZVggPSBlbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLngnKVxuICAgICAgICAgIGlmIChzY2FsZVggPT09IHVuZGVmaW5lZCB8fCBzY2FsZVggPT09IG51bGwpIHNjYWxlWCA9IDFcbiAgICAgICAgICB2YXIgc2NhbGVZID0gZWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS55JylcbiAgICAgICAgICBpZiAoc2NhbGVZID09PSB1bmRlZmluZWQgfHwgc2NhbGVZID09PSBudWxsKSBzY2FsZVkgPSAxXG4gICAgICAgICAgdGhpcy5yZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5KHBvaW50cywgb3ZlcmxheXMsIGVsZW1lbnQuY2FuUm90YXRlKCksIHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93biwgdHJ1ZSwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcG9pbnRzID0gW11cbiAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgIGVsZW1lbnQuZ2V0Qm94UG9pbnRzVHJhbnNmb3JtZWQoKS5mb3JFYWNoKChwb2ludCkgPT4gcG9pbnRzLnB1c2gocG9pbnQpKVxuICAgICAgICB9KVxuICAgICAgICBwb2ludHMgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmdldEJvdW5kaW5nQm94UG9pbnRzKHBvaW50cylcbiAgICAgICAgdGhpcy5yZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5KHBvaW50cywgb3ZlcmxheXMsIGZhbHNlLCB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sIGZhbHNlLCAwLCAxLCAxKVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nKSB7XG4gICAgICAgIC8vIFRPRE86IERyYXcgdG9vbHRpcCB3aXRoIHBvaW50cyBpbmZvXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdmVybGF5c1xuICB9XG5cbiAgcmVuZGVyTW9ycGhQb2ludHNPdmVybGF5IChwb2ludHMsIG92ZXJsYXlzKSB7XG4gICAgcG9pbnRzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckNvbnRyb2xQb2ludChwb2ludC54LCBwb2ludC55LCBpbmRleCkpXG4gICAgfSlcbiAgfVxuXG4gIHJlbmRlckxpbmUgKHgxLCB5MSwgeDIsIHkyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW1lbnROYW1lOiAnc3ZnJyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNoaWxkcmVuOiBbe1xuICAgICAgICBlbGVtZW50TmFtZTogJ2xpbmUnLFxuICAgICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgeDE6IHgxLFxuICAgICAgICAgIHkxOiB5MSxcbiAgICAgICAgICB4MjogeDIsXG4gICAgICAgICAgeTI6IHkyLFxuICAgICAgICAgIHN0cm9rZTogUGFsZXR0ZS5EQVJLRVJfUk9DSzIsXG4gICAgICAgICAgJ3N0cm9rZS13aWR0aCc6ICcxcHgnLFxuICAgICAgICAgICd2ZWN0b3ItZWZmZWN0JzogJ25vbi1zY2FsaW5nLXN0cm9rZSdcbiAgICAgICAgfVxuICAgICAgfV1cbiAgICB9XG4gIH1cblxuICBjcmVhdGVDb250cm9sUG9pbnRMaXN0ZW5lciAoZXZlbnROYW1lLCBwb2ludEluZGV4KSB7XG4gICAgLy8gQ2FjaGluZyB0aGVzZSBhcyBvcHBvc2VkIHRvIGNyZWF0aW5nIG5ldyBmdW5jdGlvbnMgaHVuZHJlZHMgb2YgdGltZXNcbiAgICBpZiAoIXRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVycykgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzID0ge31cbiAgICBjb25zdCBjb250cm9sS2V5ID0gZXZlbnROYW1lICsgJy0nICsgcG9pbnRJbmRleFxuICAgIGlmICghdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldKSB7XG4gICAgICB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV0gPSAobGlzdGVuZXJFdmVudCkgPT4ge1xuICAgICAgICB0aGlzLmNvbnRyb2xBY3RpdmF0aW9uKHtcbiAgICAgICAgICBpbmRleDogcG9pbnRJbmRleCxcbiAgICAgICAgICBldmVudDogbGlzdGVuZXJFdmVudFxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzW2NvbnRyb2xLZXldLmNvbnRyb2xLZXkgPSBjb250cm9sS2V5XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV1cbiAgfVxuXG4gIHJlbmRlckNvbnRyb2xQb2ludCAoeCwgeSwgaW5kZXgsIGhhbmRsZUNsYXNzKSB7XG4gICAgdmFyIHNjYWxlID0gMSAvICh0aGlzLnN0YXRlLnpvb21YWSB8fCAxKVxuICAgIHJldHVybiB7XG4gICAgICBlbGVtZW50TmFtZTogJ2RpdicsXG4gICAgICBhdHRyaWJ1dGVzOiB7XG4gICAgICAgIGtleTogJ2NvbnRyb2wtcG9pbnQtJyArIGluZGV4LFxuICAgICAgICBjbGFzczogaGFuZGxlQ2xhc3MgfHwgJycsXG4gICAgICAgIG9ubW91c2Vkb3duOiB0aGlzLmNyZWF0ZUNvbnRyb2xQb2ludExpc3RlbmVyKCdtb3VzZWRvd24nLCBpbmRleCksXG4gICAgICAgIHN0eWxlOiB7XG4gICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgdHJhbnNmb3JtOiBgc2NhbGUoJHtzY2FsZX0sJHtzY2FsZX0pYCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgICAgICAgbGVmdDogKHggLSAzLjUpICsgJ3B4JyxcbiAgICAgICAgICB0b3A6ICh5IC0gMy41KSArICdweCcsXG4gICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkRBUktFUl9ST0NLMixcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgICAgICBib3hTaGFkb3c6ICcwIDJweCA2cHggMCAnICsgUGFsZXR0ZS5TSEFEWSwgLy8gVE9ETzogYWNjb3VudCBmb3Igcm90YXRpb25cbiAgICAgICAgICB3aWR0aDogJzdweCcsXG4gICAgICAgICAgaGVpZ2h0OiAnN3B4JyxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjaGlsZHJlbjogW1xuICAgICAgICB7XG4gICAgICAgICAgZWxlbWVudE5hbWU6ICdkaXYnLFxuICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgIGtleTogJ2NvbnRyb2wtcG9pbnQtaGl0LWFyZWEtJyArIGluZGV4LFxuICAgICAgICAgICAgY2xhc3M6IGhhbmRsZUNsYXNzIHx8ICcnLFxuICAgICAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJyxcbiAgICAgICAgICAgICAgbGVmdDogJy0xNXB4JyxcbiAgICAgICAgICAgICAgdG9wOiAnLTE1cHgnLFxuICAgICAgICAgICAgICB3aWR0aDogJzMwcHgnLFxuICAgICAgICAgICAgICBoZWlnaHQ6ICczMHB4J1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgfVxuXG4gIGdldEhhbmRsZUNsYXNzIChpbmRleCwgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKSB7XG4gICAgdmFyIGRlZmF1bHRQb2ludEdyb3VwID0gQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTWzBdXG4gICAgdmFyIGluZGV4T2ZQb2ludCA9IGRlZmF1bHRQb2ludEdyb3VwLmluZGV4T2YoaW5kZXgpXG5cbiAgICB2YXIga2V5T2ZQb2ludEdyb3VwXG4gICAgaWYgKHNjYWxlWCA+PSAwICYmIHNjYWxlWSA+PSAwKSBrZXlPZlBvaW50R3JvdXAgPSAwIC8vIGRlZmF1bHRcbiAgICBlbHNlIGlmIChzY2FsZVggPj0gMCAmJiBzY2FsZVkgPCAwKSBrZXlPZlBvaW50R3JvdXAgPSAxIC8vIGZsaXBwZWQgdmVydGljYWxseVxuICAgIGVsc2UgaWYgKHNjYWxlWCA8IDAgJiYgc2NhbGVZID49IDApIGtleU9mUG9pbnRHcm91cCA9IDIgLy8gZmxpcHBlZCBob3Jpem9udGFsbHlcbiAgICBlbHNlIGlmIChzY2FsZVggPCAwICYmIHNjYWxlWSA8IDApIGtleU9mUG9pbnRHcm91cCA9IDMgLy8gZmxpcHBlZCBob3Jpem9udGFsbHkgYW5kIHZlcnRpY2FsbHlcblxuICAgIGlmIChrZXlPZlBvaW50R3JvdXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmFibGUgdG8gZGV0ZXJtaW5lIGhhbmRsZSBjbGFzcyBkdWUgdG8gYmFkIHNjYWxlIHZhbHVlcycpXG4gICAgfVxuXG4gICAgdmFyIHNwZWNpZmllZFBvaW50R3JvdXAgPSBDTE9DS1dJU0VfQ09OVFJPTF9QT0lOVFNba2V5T2ZQb2ludEdyb3VwXVxuXG4gICAgdmFyIHJvdGF0aW9uRGVncmVlcyA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZ2V0Um90YXRpb25JbjM2MChyb3RhdGlvblopXG4gICAgLy8gRWFjaCA0NSBkZWdyZWUgdHVybiB3aWxsIGVxdWF0ZSB0byBhIHBoYXNlIGNoYW5nZSBvZiAxLCBhbmQgdGhhdCBwaGFzZSBjb3JyZXNwb25kcyB0b1xuICAgIC8vIGEgc3RhcnRpbmcgaW5kZXggZm9yIHRoZSBjb250cm9sIHBvaW50cyBpbiBjbG9ja3dpc2Ugb3JkZXJcbiAgICB2YXIgcGhhc2VOdW1iZXIgPSB+figocm90YXRpb25EZWdyZWVzICsgMjIuNSkgLyA0NSkgJSBzcGVjaWZpZWRQb2ludEdyb3VwLmxlbmd0aFxuICAgIHZhciBvZmZzZXRJbmRleCA9IChpbmRleE9mUG9pbnQgKyBwaGFzZU51bWJlcikgJSBzcGVjaWZpZWRQb2ludEdyb3VwLmxlbmd0aFxuICAgIHZhciBzaGlmdGVkSW5kZXggPSBzcGVjaWZpZWRQb2ludEdyb3VwW29mZnNldEluZGV4XVxuXG4gICAgLy8gVGhlc2UgY2xhc3MgbmFtZXMgYXJlIGRlZmluZWQgaW4gZ2xvYmFsLmNzczsgdGhlIGluZGljZXMgaW5kaWNhdGUgdGhlIGNvcnJlc3BvbmRpbmcgcG9pbnRzXG4gICAgaWYgKGNhblJvdGF0ZSAmJiBpc1JvdGF0aW9uTW9kZU9uKSB7XG4gICAgICByZXR1cm4gYHJvdGF0ZS1jdXJzb3ItJHtzaGlmdGVkSW5kZXh9YFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYHNjYWxlLWN1cnNvci0ke3NoaWZ0ZWRJbmRleH1gXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyVHJhbnNmb3JtQm94T3ZlcmxheSAocG9pbnRzLCBvdmVybGF5cywgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCBjYW5Db250cm9sSGFuZGxlcywgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIHZhciBjb3JuZXJzID0gW3BvaW50c1swXSwgcG9pbnRzWzJdLCBwb2ludHNbOF0sIHBvaW50c1s2XV1cbiAgICBjb3JuZXJzLmZvckVhY2goKHBvaW50LCBpbmRleCkgPT4ge1xuICAgICAgdmFyIG5leHQgPSBjb3JuZXJzWyhpbmRleCArIDEpICUgY29ybmVycy5sZW5ndGhdXG4gICAgICBvdmVybGF5cy5wdXNoKHRoaXMucmVuZGVyTGluZShwb2ludC54LCBwb2ludC55LCBuZXh0LngsIG5leHQueSkpXG4gICAgfSlcbiAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggIT09IDQpIHtcbiAgICAgICAgb3ZlcmxheXMucHVzaCh0aGlzLnJlbmRlckNvbnRyb2xQb2ludChwb2ludC54LCBwb2ludC55LCBpbmRleCwgY2FuQ29udHJvbEhhbmRsZXMgJiYgdGhpcy5nZXRIYW5kbGVDbGFzcyhpbmRleCwgY2FuUm90YXRlLCBpc1JvdGF0aW9uTW9kZU9uLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKSkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGdldEdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzICgpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb24pIHJldHVybiAnJ1xuICAgIHZhciBjb250cm9sSW5kZXggPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uLmluZGV4XG4gICAgdmFyIGlzUm90YXRpb25Nb2RlT24gPSB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd25cbiAgICB2YXIgc2VsZWN0ZWRFbGVtZW50cyA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuc2VsZWN0ZWQuYWxsKClcbiAgICBpZiAoc2VsZWN0ZWRFbGVtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciBzZWxlY3RlZEVsZW1lbnQgPSBzZWxlY3RlZEVsZW1lbnRzWzBdXG4gICAgICB2YXIgcm90YXRpb25aID0gc2VsZWN0ZWRFbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3JvdGF0aW9uLnonKSB8fCAwXG4gICAgICB2YXIgc2NhbGVYID0gc2VsZWN0ZWRFbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLngnKVxuICAgICAgaWYgKHNjYWxlWCA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWCA9PT0gbnVsbCkgc2NhbGVYID0gMVxuICAgICAgdmFyIHNjYWxlWSA9IHNlbGVjdGVkRWxlbWVudC5nZXRQcm9wZXJ0eVZhbHVlKCdzY2FsZS55JylcbiAgICAgIGlmIChzY2FsZVkgPT09IHVuZGVmaW5lZCB8fCBzY2FsZVkgPT09IG51bGwpIHNjYWxlWSA9IDFcbiAgICAgIHJldHVybiB0aGlzLmdldEhhbmRsZUNsYXNzKGNvbnRyb2xJbmRleCwgdHJ1ZSwgaXNSb3RhdGlvbk1vZGVPbiwgcm90YXRpb25aLCBzY2FsZVgsIHNjYWxlWSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGFuZGxlQ2xhc3MoY29udHJvbEluZGV4LCBmYWxzZSwgaXNSb3RhdGlvbk1vZGVPbiwgMCwgMSwgMSlcbiAgICB9XG4gIH1cblxuICBnZXRTdGFnZVRyYW5zZm9ybSAoKSB7XG4gICAgdmFyIGEgPSB0aGlzLnN0YXRlLnpvb21YWSB8fCAxXG4gICAgdmFyIGMgPSB0aGlzLnN0YXRlLnBhblggfHwgMFxuICAgIHZhciBkID0gdGhpcy5zdGF0ZS5wYW5ZIHx8IDBcblxuICAgIHJldHVybiAnbWF0cml4M2QoJyArXG4gICAgICBbYSwgMCwgMCwgMCxcbiAgICAgICAgMCwgYSwgMCwgMCxcbiAgICAgICAgMCwgMCwgMSwgMCxcbiAgICAgICAgYywgZCwgMCwgMV0uam9pbignLCcpICsgJyknXG4gIH1cblxuICBpc1ByZXZpZXdNb2RlICgpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50Ll9pbnRlcmFjdGlvbk1vZGUudHlwZSA9PT0gJ2xpdmUnXG4gIH1cblxuICBnZXRDdXJzb3JDc3NSdWxlICgpIHtcbiAgICBpZiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpIHJldHVybiAnZGVmYXVsdCdcbiAgICByZXR1cm4gKHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24pID8gJy13ZWJraXQtZ3JhYmJpbmcnIDogJy13ZWJraXQtZ3JhYidcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgdmFyIGRyYXdpbmdDbGFzc05hbWUgPSAodGhpcy5zdGF0ZS5hY3RpdmVEcmF3aW5nVG9vbCAhPT0gJ3BvaW50ZXInKSA/ICdkcmF3LXNoYXBlJyA6ICcnXG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdlxuICAgICAgICBvbk1vdXNlT3Zlcj17KCkgPT4gdGhpcy5zZXRTdGF0ZSh7IGlzS2V5Q29tbWFuZERvd246IGZhbHNlIH0pfT5cblxuICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICAgIHJpZ2h0OiAxMCxcbiAgICAgICAgICAgICAgekluZGV4OiAxMDAwMDAsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2NjYycsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxNFxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICB7TWF0aC5yb3VuZCh0aGlzLnN0YXRlLnpvb21YWSAvIDEgKiAxMDApfSVcbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIHJlZj0nY29udGFpbmVyJ1xuICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1jb250YWluZXInXG4gICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLmdldEdsb2JhbENvbnRyb2xQb2ludEhhbmRsZUNsYXNzKCl9XG4gICAgICAgICAgb25Nb3VzZURvd249eyhtb3VzZURvd24pID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgaWYgKG1vdXNlRG93bi5uYXRpdmVFdmVudC50YXJnZXQgJiYgbW91c2VEb3duLm5hdGl2ZUV2ZW50LnRhcmdldC5pZCA9PT0gJ2Z1bGwtYmFja2dyb3VuZCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLnVuc2VsZWN0QWxsRWxlbWVudHMoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlRXZlbnRIYW5kbGVyc0VkaXRvcigpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYW5YOiB0aGlzLnN0YXRlLnBhblgsXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYW5ZOiB0aGlzLnN0YXRlLnBhblksXG4gICAgICAgICAgICAgICAgc3RhZ2VNb3VzZURvd246IHtcbiAgICAgICAgICAgICAgICAgIHg6IG1vdXNlRG93bi5uYXRpdmVFdmVudC5jbGllbnRYLFxuICAgICAgICAgICAgICAgICAgeTogbW91c2VEb3duLm5hdGl2ZUV2ZW50LmNsaWVudFlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlVXA9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YWdlTW91c2VEb3duOiBudWxsIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ByZXZpZXdNb2RlKCkpIHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHN0YWdlTW91c2VEb3duOiBudWxsIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyBUT0RPOiAgaWYvd2hlbiB3ZSBzdXBwb3J0IG5hdGl2ZSBzY3JvbGxpbmcgaGVyZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2UnbGwgbmVlZCB0byBmaWd1cmUgb3V0IHNvbWUgcGhhbnRvbSByZWZsb3dpbmcvaml0dGVyIGlzc3Vlc1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiB0aGlzLmdldFN0YWdlVHJhbnNmb3JtKCksXG4gICAgICAgICAgICBjdXJzb3I6IHRoaXMuZ2V0Q3Vyc29yQ3NzUnVsZSgpLFxuICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAodGhpcy5pc1ByZXZpZXdNb2RlKCkpID8gJ3doaXRlJyA6ICdpbmhlcml0J1xuICAgICAgICAgIH19PlxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLWJhY2tncm91bmQtbGl2ZSdcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGVmcz5cbiAgICAgICAgICAgICAgICA8ZmlsdGVyIGlkPSdiYWNrZ3JvdW5kLWJsdXInIHg9Jy01MCUnIHk9Jy01MCUnIHdpZHRoPScyMDAlJyBoZWlnaHQ9JzIwMCUnPlxuICAgICAgICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIGluPSdTb3VyY2VBbHBoYScgc3RkRGV2aWF0aW9uPScyJyByZXN1bHQ9J2JsdXInIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVGbG9vZCBmbG9vZENvbG9yPSdyZ2JhKDMzLCA0NSwgNDksIC41KScgZmxvb2RPcGFjaXR5PScwLjgnIHJlc3VsdD0nb2Zmc2V0Q29sb3InIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVDb21wb3NpdGUgaW49J29mZnNldENvbG9yJyBpbjI9J2JsdXInIG9wZXJhdG9yPSdpbicgcmVzdWx0PSd0b3RhbEJsdXInIC8+XG4gICAgICAgICAgICAgICAgICA8ZmVCbGVuZCBpbj0nU291cmNlR3JhcGhpYycgaW4yPSd0b3RhbEJsdXInIG1vZGU9J25vcm1hbCcgLz5cbiAgICAgICAgICAgICAgICA8L2ZpbHRlcj5cbiAgICAgICAgICAgICAgPC9kZWZzPlxuICAgICAgICAgICAgICA8cmVjdCBpZD0nZnVsbC1iYWNrZ3JvdW5kJyB4PScwJyB5PScwJyB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPSd0cmFuc3BhcmVudCcgLz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J21vdW50LWJhY2tncm91bmQtYmx1cicgZmlsdGVyPSd1cmwoI2JhY2tncm91bmQtYmx1ciknIHg9e3RoaXMuc3RhdGUubW91bnRYfSB5PXt0aGlzLnN0YXRlLm1vdW50WX0gd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aH0gaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fSBmaWxsPSd3aGl0ZScgLz5cbiAgICAgICAgICAgICAgPHJlY3QgaWQ9J21vdW50LWJhY2tncm91bmQnIHg9e3RoaXMuc3RhdGUubW91bnRYfSB5PXt0aGlzLnN0YXRlLm1vdW50WX0gd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aH0gaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fSBmaWxsPSd3aGl0ZScgLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiA8ZGl2XG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLXByZXZpZXcnXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodFxuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS1iYWNrZ3JvdW5kLXByZXZpZXctYm9yZGVyJ1xuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFksXG4gICAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHQsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggZG90dGVkICNiYmInLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4J1xuICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA8L2Rpdj59XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtdGl0bGUtdGV4dC1jb250YWluZXInXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMCxcbiAgICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZIC0gMTksXG4gICAgICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFggKyAyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IDEyMCxcbiAgICAgICAgICAgICAgICB1c2VyU2VsZWN0OiAnbm9uZScsXG4gICAgICAgICAgICAgICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja1N0YWdlTmFtZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3Zlcj17dGhpcy5oYW5kbGVNb3VzZU92ZXJTdGFnZU5hbWUuYmluZCh0aGlzKX1cbiAgICAgICAgICAgICAgb25Nb3VzZU91dD17dGhpcy5oYW5kbGVNb3VzZU91dFN0YWdlTmFtZS5iaW5kKHRoaXMpfT5cbiAgICAgICAgICAgICAgPHRleHRcbiAgICAgICAgICAgICAgICB5PScxMydcbiAgICAgICAgICAgICAgICBpZD0ncHJvamVjdC1uYW1lJ1xuICAgICAgICAgICAgICAgIGZpbGw9e1BhbGV0dGUuRkFUSEVSX0NPQUx9XG4gICAgICAgICAgICAgICAgZm9udFdlaWdodD0nbGlnaHRlcidcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5PSdGaXJhIFNhbnMnXG4gICAgICAgICAgICAgICAgZm9udFNpemU9JzEzJz5cbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5wcm9qZWN0TmFtZX1cbiAgICAgICAgICAgICAgPC90ZXh0PlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLWJhY2tncm91bmQtY29sb3JhdG9yJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMjAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9e2BNMCwwViR7dGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHR9SCR7dGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aH1WMFpNJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH0sJHt0aGlzLnN0YXRlLm1vdW50WSArIHRoaXMuc3RhdGUubW91bnRIZWlnaHR9SCR7dGhpcy5zdGF0ZS5tb3VudFh9ViR7dGhpcy5zdGF0ZS5tb3VudFl9SCR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9WmB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3snZmlsbCc6ICcjMTExJywgJ29wYWNpdHknOiAwLjEsICdwb2ludGVyRXZlbnRzJzogJ25vbmUnfX0gLz5cbiAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1tb2F0LW9wYWNpdGF0b3InXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAxMDEwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHQsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8cGF0aCBkPXtgTTAsMFYke3RoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0fUgke3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9VjBaTSR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9LCR7dGhpcy5zdGF0ZS5tb3VudFkgKyB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0fUgke3RoaXMuc3RhdGUubW91bnRYfVYke3RoaXMuc3RhdGUubW91bnRZfUgke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofVpgfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAnZmlsbCc6ICcjRkZGJyxcbiAgICAgICAgICAgICAgICAgICdvcGFjaXR5JzogMC41LFxuICAgICAgICAgICAgICAgICAgJ3BvaW50ZXJFdmVudHMnOiAnbm9uZSdcbiAgICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgICA8cmVjdFxuICAgICAgICAgICAgICAgIHg9e3RoaXMuc3RhdGUubW91bnRYIC0gMX1cbiAgICAgICAgICAgICAgICB5PXt0aGlzLnN0YXRlLm1vdW50WSAtIDF9XG4gICAgICAgICAgICAgICAgd2lkdGg9e3RoaXMuc3RhdGUubW91bnRXaWR0aCArIDJ9XG4gICAgICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnN0YXRlLm1vdW50SGVpZ2h0ICsgMn1cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDEuNSxcbiAgICAgICAgICAgICAgICAgIGZpbGw6ICdub25lJyxcbiAgICAgICAgICAgICAgICAgIHN0cm9rZTogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgICAgICAgICAgICAgICAgb3BhY2l0eTogdGhpcy5zdGF0ZS5pc1N0YWdlTmFtZUhvdmVyaW5nICYmICF0aGlzLnN0YXRlLmlzU3RhZ2VTZWxlY3RlZCA/IDAuNzUgOiAwXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkgJiYgdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyAmJiB0aGlzLnN0YXRlLmNvbW1lbnRzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLWNvbW1lbnRzLWNvbnRhaW5lcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAyMDAwLFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5jb21tZW50cy5tYXAoKGNvbW1lbnQsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxDb21tZW50IGluZGV4PXtpbmRleH0gY29tbWVudD17Y29tbWVudH0ga2V5PXtgY29tbWVudC0ke2NvbW1lbnQuaWR9YH0gbW9kZWw9e3RoaXMuX2NvbW1lbnRzfSAvPlxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpICYmIHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKVxuICAgICAgICAgICAgPyA8RXZlbnRIYW5kbGVyRWRpdG9yXG4gICAgICAgICAgICAgIHJlZj0nZXZlbnRIYW5kbGVyRWRpdG9yJ1xuICAgICAgICAgICAgICBlbGVtZW50PXt0aGlzLnN0YXRlLnRhcmdldEVsZW1lbnR9XG4gICAgICAgICAgICAgIHNhdmU9e3RoaXMuc2F2ZUV2ZW50SGFuZGxlci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBjbG9zZT17dGhpcy5oaWRlRXZlbnRIYW5kbGVyc0VkaXRvci5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgcmVmPSdvdmVybGF5J1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtb3ZlcmxheS1tb3VudCdcbiAgICAgICAgICAgICAgaGVpZ2h0PXt0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodH1cbiAgICAgICAgICAgICAgd2lkdGg9e3RoaXMuc3RhdGUuY29udGFpbmVyV2lkdGh9XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtOiAnbWF0cml4M2QoMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsMCwwLDAsMSknLFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJywgLy8gVGhpcyBuZWVkcyB0byBiZSB1bi1zZXQgZm9yIHN1cmZhY2UgZWxlbWVudHMgdGhhdCB0YWtlIG1vdXNlIGludGVyYWN0aW9uXG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMDAsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogKHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSA/IDAuNSA6IDEuMFxuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgOiAnJ31cblxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHJlZj0nbW91bnQnXG4gICAgICAgICAgICBpZD0naG90LWNvbXBvbmVudC1tb3VudCdcbiAgICAgICAgICAgIGNsYXNzTmFtZT17ZHJhd2luZ0NsYXNzTmFtZX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCxcbiAgICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSxcbiAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0LFxuICAgICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgICAgICB6SW5kZXg6IDYwLFxuICAgICAgICAgICAgICBvcGFjaXR5OiAodGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pID8gMC41IDogMS4wXG4gICAgICAgICAgICB9fSAvPlxuXG4gICAgICAgICAgeyh0aGlzLnN0YXRlLmVycm9yKVxuICAgICAgICAgICAgPyA8ZGl2XG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1leGNlcHRpb24tYmFyJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIGhlaWdodDogMzUsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLlJFRCxcbiAgICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgekluZGV4OiA5OTk5LFxuICAgICAgICAgICAgICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAnOXB4IDIwcHggMCcsXG4gICAgICAgICAgICAgICAgd2hpdGVTcGFjZTogJ25vd3JhcCdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgY29sb3I6IFBhbGV0dGUuUkVEX0RBUktFUixcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdBcmlhbCcsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICc1MCUnLFxuICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLlJFRF9EQVJLRVIsXG4gICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNSxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmdMZWZ0OiAxXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgZXJyb3I6IG51bGwgfSlcbiAgICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICAgIHhcbiAgICAgICAgICAgICAgICA8L2J1dHRvbj48c3Bhbj57JyAnfTwvc3Bhbj5cbiAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZXJyb3J9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDogJyd9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG5cbkdsYXNzLnByb3BUeXBlcyA9IHtcbiAgdXNlcmNvbmZpZzogUmVhY3QuUHJvcFR5cGVzLm9iamVjdCxcbiAgd2Vic29ja2V0OiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICBmb2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmFkaXVtKEdsYXNzKVxuIl19