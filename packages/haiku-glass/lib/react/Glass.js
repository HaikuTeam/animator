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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9HbGFzcy5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwiY2xpcGJvYXJkIiwiQ0xPQ0tXSVNFX0NPTlRST0xfUE9JTlRTIiwiR2xhc3MiLCJwcm9wcyIsInN0YXRlIiwiZXJyb3IiLCJtb3VudFdpZHRoIiwibW91bnRIZWlnaHQiLCJtb3VudFgiLCJtb3VudFkiLCJjb250cm9sQWN0aXZhdGlvbiIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwibW91c2VQb3NpdGlvblByZXZpb3VzIiwiaXNBbnl0aGluZ1NjYWxpbmciLCJpc0FueXRoaW5nUm90YXRpbmciLCJnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsImNvbnRhaW5lckhlaWdodCIsImNvbnRhaW5lcldpZHRoIiwiaXNTdGFnZVNlbGVjdGVkIiwiaXNTdGFnZU5hbWVIb3ZlcmluZyIsImlzTW91c2VEb3duIiwibGFzdE1vdXNlRG93blRpbWUiLCJsYXN0TW91c2VEb3duUG9zaXRpb24iLCJsYXN0TW91c2VVcFBvc2l0aW9uIiwibGFzdE1vdXNlVXBUaW1lIiwiaXNNb3VzZURyYWdnaW5nIiwiaXNLZXlTaGlmdERvd24iLCJpc0tleUN0cmxEb3duIiwiaXNLZXlBbHREb3duIiwiaXNLZXlDb21tYW5kRG93biIsImlzS2V5U3BhY2VEb3duIiwicGFuWCIsInBhblkiLCJvcmlnaW5hbFBhblgiLCJvcmlnaW5hbFBhblkiLCJ6b29tWFkiLCJjb21tZW50cyIsImRvU2hvd0NvbW1lbnRzIiwidGFyZ2V0RWxlbWVudCIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsImFjdGl2ZURyYXdpbmdUb29sIiwiZHJhd2luZ0lzTW9kYWwiLCJfY29tcG9uZW50IiwiYWxpYXMiLCJmb2xkZXIiLCJ1c2VyY29uZmlnIiwid2Vic29ja2V0IiwicGxhdGZvcm0iLCJ3aW5kb3ciLCJlbnZveSIsIldlYlNvY2tldCIsInNldFN0YWdlVHJhbnNmb3JtIiwiem9vbSIsInBhbiIsIngiLCJ5IiwiX2NvbW1lbnRzIiwiX2N0eG1lbnUiLCJfcGxheWluZyIsIl9zdG9wd2F0Y2giLCJfbGFzdEF1dGhvcml0YXRpdmVGcmFtZSIsIl9sYXN0U2VsZWN0ZWRFbGVtZW50IiwiX2NsaXBib2FyZEFjdGlvbkxvY2siLCJkcmF3TG9vcCIsImJpbmQiLCJkcmF3IiwiX2hhaWt1UmVuZGVyZXIiLCJfaGFpa3VDb250ZXh0IiwidGltZWxpbmVzIiwidGVtcGxhdGUiLCJlbGVtZW50TmFtZSIsImF0dHJpYnV0ZXMiLCJjaGlsZHJlbiIsIm9wdGlvbnMiLCJjYWNoZSIsInNlZWQiLCJoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzIiwicmVzZXRDb250YWluZXJEaW1lbnNpb25zIiwiZ2xhc3MiLCJvbiIsInRpbWVsaW5lQ2hhbm5lbCIsImhhbmRsZVRpbWVsaW5lRGlkUGxheSIsImhhbmRsZVRpbWVsaW5lRGlkUGF1c2UiLCJoYW5kbGVUaW1lbGluZURpZFNlZWsiLCJjbGllbnQiLCJ0b3VyQ2xpZW50Iiwic2VsZWN0b3IiLCJ3ZWJ2aWV3IiwiZWxlbWVudCIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvciIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsImxlZnQiLCJyZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzIiwiY29uc29sZSIsIkRhdGUiLCJub3ciLCJmcmFtZURhdGEiLCJmcmFtZSIsImZvcmNlU2VlayIsInNlZWtNcyIsImZwcyIsImJhc2VNcyIsImRlbHRhTXMiLCJNYXRoIiwicm91bmQiLCJfc2V0VGltZWxpbmVUaW1lVmFsdWUiLCJyZWZzIiwib3ZlcmxheSIsImRyYXdPdmVybGF5cyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vdW50QXBwbGljYXRpb24iLCJtb3VudCIsImZyZWV6ZSIsIm92ZXJmbG93WCIsIm92ZXJmbG93WSIsImNvbnRleHRNZW51IiwibmV3TW91bnRTaXplIiwiZ2V0Q29udGV4dFNpemUiLCJzZXRTdGF0ZSIsIndpZHRoIiwiaGVpZ2h0Iiwic2l6ZURlc2NyaXB0b3IiLCJ0aW1lbGluZU5hbWUiLCJ0aW1lbGluZVRpbWUiLCJnZXRNb3VudCIsImlzUmVsb2FkaW5nQ29kZSIsInVwZGF0ZWRBcnRib2FyZFNpemUiLCJhZGRFdmVudExpc3RlbmVyIiwicGFzdGVFdmVudCIsImluZm8iLCJwcmV2ZW50RGVmYXVsdCIsInNlbmQiLCJ0eXBlIiwibmFtZSIsImZyb20iLCJkYXRhIiwiaGFuZGxlVmlydHVhbENsaXBib2FyZCIsImNsaXBib2FyZEFjdGlvbiIsIm1heWJlQ2xpcGJvYXJkRXZlbnQiLCJjbGlwYm9hcmRQYXlsb2FkIiwiZ2V0Q2xpcGJvYXJkUGF5bG9hZCIsImN1dCIsInNlcmlhbGl6ZWRQYXlsb2FkIiwiSlNPTiIsInN0cmluZ2lmeSIsIndyaXRlVGV4dCIsImNvbXBvbmVudElkIiwiX2VsZW1lbnRzIiwiZmluZCIsImNhbGwiLCJtZXNzYWdlIiwib2xkVHJhbnNmb3JtIiwibW9kdWxlUmVwbGFjZSIsImVyciIsImdldFN0YWdlVHJhbnNmb3JtIiwicGFyYW1zIiwibWV0aG9kIiwiY2IiLCJjYWxsTWV0aG9kIiwibG9hZCIsImFjdGlvbiIsImV2ZW50IiwiYnVpbGQiLCJfbWVudSIsImxhc3RYIiwibGFzdFkiLCJyZWJ1aWxkIiwic2hvd0V2ZW50SGFuZGxlcnNFZGl0b3IiLCJ0aHJvdHRsZSIsImhhbmRsZVdpbmRvd1Jlc2l6ZSIsIndpbmRvd01vdXNlVXBIYW5kbGVyIiwid2luZG93TW91c2VNb3ZlSGFuZGxlciIsIndpbmRvd01vdXNlRG93bkhhbmRsZXIiLCJ3aW5kb3dDbGlja0hhbmRsZXIiLCJ3aW5kb3dEYmxDbGlja0hhbmRsZXIiLCJ3aW5kb3dLZXlEb3duSGFuZGxlciIsIndpbmRvd0tleVVwSGFuZGxlciIsIndpbmRvd01vdXNlT3V0SGFuZGxlciIsIm9uZXJyb3IiLCJvZmYiLCJfZW52b3lDbGllbnQiLCJjbG9zZUNvbm5lY3Rpb24iLCJjbGlja0V2ZW50IiwiZXZlbnROYW1lIiwiaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkIiwic2VsZWN0b3JOYW1lIiwidWlkIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiZHgiLCJkeSIsIm5hdGl2ZUV2ZW50IiwiaXNQcmV2aWV3TW9kZSIsInNvdXJjZSIsInJlbGF0ZWRUYXJnZXQiLCJ0b0VsZW1lbnQiLCJub2RlTmFtZSIsImhvdmVyZWQiLCJkZXF1ZXVlIiwiaGFuZGxlTW91c2VNb3ZlIiwiaGFuZGxlTW91c2VVcCIsImhhbmRsZU1vdXNlRG93biIsImhhbmRsZUNsaWNrIiwiaGFuZGxlRG91YmxlQ2xpY2siLCJoYW5kbGVLZXlEb3duIiwiaGFuZGxlS2V5VXAiLCJtb3VzZWRvd25FdmVudCIsImJ1dHRvbiIsIm1vdXNlUG9zIiwic3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uIiwiaW5zdGFudGlhdGVDb21wb25lbnQiLCJtaW5pbWl6ZWQiLCJtZXRhZGF0YSIsImluZGV4IiwidGFyZ2V0IiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsImhhc0F0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZSIsInBhcmVudE5vZGUiLCJ1bnNlbGVjdEFsbEVsZW1lbnRzIiwiaGFpa3VJZCIsImNvbnRhaW5lZCIsIndoZXJlIiwiaXNTZWxlY3RlZCIsInNlbGVjdEVsZW1lbnQiLCJtb3VzZXVwRXZlbnQiLCJoYW5kbGVEcmFnU3RvcCIsImRvdWJsZUNsaWNrRXZlbnQiLCJpc0Rvd24iLCJrZXlFdmVudCIsImRlbHRhIiwic2hpZnRLZXkiLCJmb3JFYWNoIiwibW92ZSIsImV2ZW50SGFuZGxlckVkaXRvciIsIndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCIsIndoaWNoIiwiaGFuZGxlS2V5RXNjYXBlIiwiaGFuZGxlS2V5U3BhY2UiLCJoYW5kbGVLZXlMZWZ0QXJyb3ciLCJoYW5kbGVLZXlVcEFycm93IiwiaGFuZGxlS2V5UmlnaHRBcnJvdyIsImhhbmRsZUtleURvd25BcnJvdyIsImhhbmRsZUtleURlbGV0ZSIsImhhbmRsZUtleUVudGVyIiwiaGFuZGxlS2V5U2hpZnQiLCJoYW5kbGVLZXlDdHJsIiwiaGFuZGxlS2V5QWx0IiwiaGFuZGxlS2V5Q29tbWFuZCIsImNtZCIsInNoaWZ0IiwiY3RybCIsImFsdCIsImFydGJvYXJkIiwiZmluZFJvb3RzIiwiY2xpY2tlZCIsImFkZCIsInNlbGVjdCIsIm1vdXNlbW92ZUV2ZW50IiwiaGFuZGxlRHJhZ1N0YXJ0Iiwic3RhZ2VNb3VzZURvd24iLCJwZXJmb3JtUGFuIiwiY2xpZW50WCIsImNsaWVudFkiLCJzZWxlY3RlZCIsImxlbmd0aCIsImRyYWciLCJyZW1vdmUiLCJjb250YWluZXIiLCJ3IiwiY2xpZW50V2lkdGgiLCJoIiwiY2xpZW50SGVpZ2h0IiwicmlnaHQiLCJib3R0b20iLCJnZXRBcnRib2FyZFJlY3QiLCJhcmJvYXJkIiwiY29vcmRzIiwibW91c2VFdmVudCIsImFkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGUiLCJmb3JjZSIsImFsbCIsImNyZWF0ZUNvbnRhaW5lciIsInBhcnRzIiwiYnVpbGREcmF3bk92ZXJsYXlzIiwiaWQiLCJzdHlsZSIsInRyYW5zZm9ybSIsInBvc2l0aW9uIiwib3ZlcmZsb3ciLCJyZW5kZXIiLCJjb21wb25lbnQiLCJvdmVybGF5cyIsInBvaW50cyIsImlzUmVuZGVyYWJsZVR5cGUiLCJnZXRQb2ludHNUcmFuc2Zvcm1lZCIsInJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheSIsImdldEJveFBvaW50c1RyYW5zZm9ybWVkIiwicm90YXRpb25aIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInNjYWxlWCIsInVuZGVmaW5lZCIsInNjYWxlWSIsInJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkiLCJjYW5Sb3RhdGUiLCJwb2ludCIsInB1c2giLCJnZXRCb3VuZGluZ0JveFBvaW50cyIsInJlbmRlckNvbnRyb2xQb2ludCIsIngxIiwieTEiLCJ4MiIsInkyIiwic3Ryb2tlIiwiREFSS0VSX1JPQ0syIiwicG9pbnRJbmRleCIsIl9jb250cm9sUG9pbnRMaXN0ZW5lcnMiLCJjb250cm9sS2V5IiwibGlzdGVuZXJFdmVudCIsImhhbmRsZUNsYXNzIiwic2NhbGUiLCJrZXkiLCJjbGFzcyIsIm9ubW91c2Vkb3duIiwiY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIiLCJwb2ludGVyRXZlbnRzIiwiYm9yZGVyIiwiYmFja2dyb3VuZENvbG9yIiwiUk9DSyIsImJveFNoYWRvdyIsIlNIQURZIiwiYm9yZGVyUmFkaXVzIiwiaXNSb3RhdGlvbk1vZGVPbiIsImRlZmF1bHRQb2ludEdyb3VwIiwiaW5kZXhPZlBvaW50Iiwia2V5T2ZQb2ludEdyb3VwIiwiRXJyb3IiLCJzcGVjaWZpZWRQb2ludEdyb3VwIiwicm90YXRpb25EZWdyZWVzIiwiZ2V0Um90YXRpb25JbjM2MCIsInBoYXNlTnVtYmVyIiwib2Zmc2V0SW5kZXgiLCJzaGlmdGVkSW5kZXgiLCJjYW5Db250cm9sSGFuZGxlcyIsImNvcm5lcnMiLCJuZXh0IiwicmVuZGVyTGluZSIsImdldEhhbmRsZUNsYXNzIiwiY29udHJvbEluZGV4Iiwic2VsZWN0ZWRFbGVtZW50cyIsInNlbGVjdGVkRWxlbWVudCIsImEiLCJjIiwiZCIsImpvaW4iLCJfaW50ZXJhY3Rpb25Nb2RlIiwiZHJhd2luZ0NsYXNzTmFtZSIsInpJbmRleCIsImNvbG9yIiwiZm9udFNpemUiLCJnZXRHbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzcyIsIm1vdXNlRG93biIsImhpZGVFdmVudEhhbmRsZXJzRWRpdG9yIiwiY3Vyc29yIiwiZ2V0Q3Vyc29yQ3NzUnVsZSIsInVzZXJTZWxlY3QiLCJoYW5kbGVDbGlja1N0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZSIsImhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lIiwiRkFUSEVSX0NPQUwiLCJwcm9qZWN0TmFtZSIsInN0cm9rZVdpZHRoIiwiZmlsbCIsIkxJR0hUX1BJTksiLCJvcGFjaXR5IiwibWFwIiwiY29tbWVudCIsInNhdmVFdmVudEhhbmRsZXIiLCJSRUQiLCJTVU5TVE9ORSIsInRleHRBbGlnbiIsInBhZGRpbmciLCJ3aGl0ZVNwYWNlIiwidGV4dFRyYW5zZm9ybSIsIlJFRF9EQVJLRVIiLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsInBhZGRpbmdMZWZ0IiwiQ29tcG9uZW50IiwicHJvcFR5cGVzIiwiUHJvcFR5cGVzIiwib2JqZWN0Iiwic3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7ZUFFc0JBLFFBQVEsVUFBUixDO0lBQWRDLFMsWUFBQUEsUzs7QUFFUixJQUFNQywyQkFBMkI7QUFDL0IsS0FBRyxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxFQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBRDRCO0FBRS9CLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUY0QixFQUVGO0FBQzdCLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUg0QixFQUdGO0FBQzdCLEtBQUcsQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLENBQVAsRUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUo0QixDQUlIOzs7QUFHOUI7QUFQaUMsQ0FBakM7SUFRYUMsSzs7O0FBQ1gsaUJBQWFDLEtBQWIsRUFBb0I7QUFBQTs7QUFBQSw4R0FDWkEsS0FEWTs7QUFHbEIsVUFBS0MsS0FBTCxHQUFhO0FBQ1hDLGFBQU8sSUFESTtBQUVYQyxrQkFBWSxHQUZEO0FBR1hDLG1CQUFhLEdBSEY7QUFJWEMsY0FBUSxDQUpHO0FBS1hDLGNBQVEsQ0FM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O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxhQWhCQTtBQWdDVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBTztBQUFQLGFBaENYO0FBaUNDLGlCQUFLRCxLQUFMLENBQVdDO0FBakNaLFdBREgsR0FvQ0c7QUF4UU47QUFqQkYsT0FERjtBQThSRDs7OztFQXQzQ3dCLGdCQUFNaVksUzs7Ozs7QUF5M0NqQ3BZLE1BQU1xWSxTQUFOLEdBQWtCO0FBQ2hCMVYsY0FBWSxnQkFBTTJWLFNBQU4sQ0FBZ0JDLE1BRFo7QUFFaEIzVixhQUFXLGdCQUFNMFYsU0FBTixDQUFnQkMsTUFGWDtBQUdoQjdWLFVBQVEsZ0JBQU00VixTQUFOLENBQWdCRTtBQUhSLENBQWxCOztrQkFNZSxzQkFBT3hZLEtBQVAsQyIsImZpbGUiOiJHbGFzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJhZGl1bSBmcm9tICdyYWRpdW0nXG5pbXBvcnQgSGFpa3VET01SZW5kZXJlciBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZW5kZXJlcnMvZG9tJ1xuaW1wb3J0IEhhaWt1Q29udGV4dCBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9IYWlrdUNvbnRleHQnXG5pbXBvcnQgQWN0aXZlQ29tcG9uZW50IGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL21vZGVsL0FjdGl2ZUNvbXBvbmVudCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCBDb21tZW50IGZyb20gJy4vQ29tbWVudCdcbmltcG9ydCBFdmVudEhhbmRsZXJFZGl0b3IgZnJvbSAnLi9FdmVudEhhbmRsZXJFZGl0b3InXG5pbXBvcnQgQ29tbWVudHMgZnJvbSAnLi9tb2RlbHMvQ29tbWVudHMnXG5pbXBvcnQgQ29udGV4dE1lbnUgZnJvbSAnLi9tb2RlbHMvQ29udGV4dE1lbnUnXG5pbXBvcnQgZ2V0TG9jYWxEb21FdmVudFBvc2l0aW9uIGZyb20gJy4vaGVscGVycy9nZXRMb2NhbERvbUV2ZW50UG9zaXRpb24nXG5cbmNvbnN0IHsgY2xpcGJvYXJkIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5cbmNvbnN0IENMT0NLV0lTRV9DT05UUk9MX1BPSU5UUyA9IHtcbiAgMDogWzAsIDEsIDIsIDUsIDgsIDcsIDYsIDNdLFxuICAxOiBbNiwgNywgOCwgNSwgMiwgMSwgMCwgM10sIC8vIGZsaXBwZWQgdmVydGljYWxcbiAgMjogWzIsIDEsIDAsIDMsIDYsIDcsIDgsIDVdLCAvLyBmbGlwcGVkIGhvcml6b250YWxcbiAgMzogWzgsIDcsIDYsIDMsIDAsIDEsIDIsIDVdIC8vIGZsaXBwZWQgaG9yaXpvbnRhbCArIHZlcnRpY2FsXG59XG5cbi8vIFRoZSBjbGFzcyBpcyBleHBvcnRlZCBhbHNvIF93aXRob3V0XyB0aGUgcmFkaXVtIHdyYXBwZXIgdG8gYWxsb3cganNkb20gdGVzdGluZ1xuZXhwb3J0IGNsYXNzIEdsYXNzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgZXJyb3I6IG51bGwsXG4gICAgICBtb3VudFdpZHRoOiA1NTAsXG4gICAgICBtb3VudEhlaWdodDogNDAwLFxuICAgICAgbW91bnRYOiAwLFxuICAgICAgbW91bnRZOiAwLFxuICAgICAgY29udHJvbEFjdGl2YXRpb246IG51bGwsXG4gICAgICBtb3VzZVBvc2l0aW9uQ3VycmVudDogbnVsbCxcbiAgICAgIG1vdXNlUG9zaXRpb25QcmV2aW91czogbnVsbCxcbiAgICAgIGlzQW55dGhpbmdTY2FsaW5nOiBmYWxzZSxcbiAgICAgIGlzQW55dGhpbmdSb3RhdGluZzogZmFsc2UsXG4gICAgICBnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzczogJycsXG4gICAgICBjb250YWluZXJIZWlnaHQ6IDAsXG4gICAgICBjb250YWluZXJXaWR0aDogMCxcbiAgICAgIGlzU3RhZ2VTZWxlY3RlZDogZmFsc2UsXG4gICAgICBpc1N0YWdlTmFtZUhvdmVyaW5nOiBmYWxzZSxcbiAgICAgIGlzTW91c2VEb3duOiBmYWxzZSxcbiAgICAgIGxhc3RNb3VzZURvd25UaW1lOiBudWxsLFxuICAgICAgbGFzdE1vdXNlRG93blBvc2l0aW9uOiBudWxsLFxuICAgICAgbGFzdE1vdXNlVXBQb3NpdGlvbjogbnVsbCxcbiAgICAgIGxhc3RNb3VzZVVwVGltZTogbnVsbCxcbiAgICAgIGlzTW91c2VEcmFnZ2luZzogZmFsc2UsXG4gICAgICBpc0tleVNoaWZ0RG93bjogZmFsc2UsXG4gICAgICBpc0tleUN0cmxEb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5QWx0RG93bjogZmFsc2UsXG4gICAgICBpc0tleUNvbW1hbmREb3duOiBmYWxzZSxcbiAgICAgIGlzS2V5U3BhY2VEb3duOiBmYWxzZSxcbiAgICAgIHBhblg6IDAsXG4gICAgICBwYW5ZOiAwLFxuICAgICAgb3JpZ2luYWxQYW5YOiAwLFxuICAgICAgb3JpZ2luYWxQYW5ZOiAwLFxuICAgICAgem9vbVhZOiAxLFxuICAgICAgY29tbWVudHM6IFtdLFxuICAgICAgZG9TaG93Q29tbWVudHM6IGZhbHNlLFxuICAgICAgdGFyZ2V0RWxlbWVudDogbnVsbCxcbiAgICAgIGlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbjogZmFsc2UsXG4gICAgICBhY3RpdmVEcmF3aW5nVG9vbDogJ3BvaW50ZXInLFxuICAgICAgZHJhd2luZ0lzTW9kYWw6IHRydWVcbiAgICB9XG5cbiAgICB0aGlzLl9jb21wb25lbnQgPSBuZXcgQWN0aXZlQ29tcG9uZW50KHtcbiAgICAgIGFsaWFzOiAnZ2xhc3MnLFxuICAgICAgZm9sZGVyOiB0aGlzLnByb3BzLmZvbGRlcixcbiAgICAgIHVzZXJjb25maWc6IHRoaXMucHJvcHMudXNlcmNvbmZpZyxcbiAgICAgIHdlYnNvY2tldDogdGhpcy5wcm9wcy53ZWJzb2NrZXQsXG4gICAgICBwbGF0Zm9ybTogd2luZG93LFxuICAgICAgZW52b3k6IHRoaXMucHJvcHMuZW52b3ksXG4gICAgICBXZWJTb2NrZXQ6IHdpbmRvdy5XZWJTb2NrZXRcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKHt6b29tOiB0aGlzLnN0YXRlLnpvb21YWSwgcGFuOiB7eDogdGhpcy5zdGF0ZS5wYW5YLCB5OiB0aGlzLnN0YXRlLnBhbll9fSlcbiAgICB0aGlzLl9jb21tZW50cyA9IG5ldyBDb21tZW50cyh0aGlzLnByb3BzLmZvbGRlcilcbiAgICB0aGlzLl9jdHhtZW51ID0gbmV3IENvbnRleHRNZW51KHdpbmRvdywgdGhpcylcblxuICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZVxuICAgIHRoaXMuX3N0b3B3YXRjaCA9IG51bGxcbiAgICB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lID0gMFxuXG4gICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IG51bGxcbiAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gZmFsc2VcblxuICAgIHRoaXMuZHJhd0xvb3AgPSB0aGlzLmRyYXdMb29wLmJpbmQodGhpcylcbiAgICB0aGlzLmRyYXcgPSB0aGlzLmRyYXcuYmluZCh0aGlzKVxuICAgIHRoaXMuX2hhaWt1UmVuZGVyZXIgPSBuZXcgSGFpa3VET01SZW5kZXJlcigpXG4gICAgdGhpcy5faGFpa3VDb250ZXh0ID0gbmV3IEhhaWt1Q29udGV4dChudWxsLCB0aGlzLl9oYWlrdVJlbmRlcmVyLCB7fSwgeyB0aW1lbGluZXM6IHt9LCB0ZW1wbGF0ZTogeyBlbGVtZW50TmFtZTogJ2RpdicsIGF0dHJpYnV0ZXM6IHt9LCBjaGlsZHJlbjogW10gfSB9LCB7IG9wdGlvbnM6IHsgY2FjaGU6IHt9LCBzZWVkOiAnYWJjZGUnIH0gfSlcblxuICAgIHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcyA9IHRoaXMuaGFuZGxlUmVxdWVzdEVsZW1lbnRDb29yZGluYXRlcy5iaW5kKHRoaXMpXG5cbiAgICB0aGlzLnJlc2V0Q29udGFpbmVyRGltZW5zaW9ucygpXG5cbiAgICB3aW5kb3cuZ2xhc3MgPSB0aGlzXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2Vudm95OnRpbWVsaW5lQ2xpZW50UmVhZHknLCAodGltZWxpbmVDaGFubmVsKSA9PiB7XG4gICAgICB0aW1lbGluZUNoYW5uZWwub24oJ2RpZFBsYXknLCB0aGlzLmhhbmRsZVRpbWVsaW5lRGlkUGxheS5iaW5kKHRoaXMpKVxuICAgICAgdGltZWxpbmVDaGFubmVsLm9uKCdkaWRQYXVzZScsIHRoaXMuaGFuZGxlVGltZWxpbmVEaWRQYXVzZS5iaW5kKHRoaXMpKVxuICAgICAgdGltZWxpbmVDaGFubmVsLm9uKCdkaWRTZWVrJywgdGhpcy5oYW5kbGVUaW1lbGluZURpZFNlZWsuYmluZCh0aGlzKSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbnZveTp0b3VyQ2xpZW50UmVhZHknLCAoY2xpZW50KSA9PiB7XG4gICAgICB0aGlzLnRvdXJDbGllbnQgPSBjbGllbnRcbiAgICAgIHRoaXMudG91ckNsaWVudC5vbigndG91cjpyZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzJywgdGhpcy5oYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVSZXF1ZXN0RWxlbWVudENvb3JkaW5hdGVzICh7IHNlbGVjdG9yLCB3ZWJ2aWV3IH0pIHtcbiAgICBpZiAod2VidmlldyAhPT0gJ2dsYXNzJykgeyByZXR1cm4gfVxuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IGZpbmQgaWYgdGhlcmUgaXMgYSBiZXR0ZXIgc29sdXRpb24gdG8gdGhpcyBzY2FwZSBoYXRjaFxuICAgICAgbGV0IGVsZW1lbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxuICAgICAgbGV0IHsgdG9wLCBsZWZ0IH0gPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICAgIHRoaXMudG91ckNsaWVudC5yZWNlaXZlRWxlbWVudENvb3JkaW5hdGVzKCdnbGFzcycsIHsgdG9wLCBsZWZ0IH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGZldGNoaW5nICR7c2VsZWN0b3J9IGluIHdlYnZpZXcgJHt3ZWJ2aWV3fWApXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlVGltZWxpbmVEaWRQbGF5ICgpIHtcbiAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZVxuICAgIHRoaXMuX3N0b3B3YXRjaCA9IERhdGUubm93KClcbiAgfVxuXG4gIGhhbmRsZVRpbWVsaW5lRGlkUGF1c2UgKGZyYW1lRGF0YSkge1xuICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZVxuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSBmcmFtZURhdGEuZnJhbWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gIH1cblxuICBoYW5kbGVUaW1lbGluZURpZFNlZWsgKGZyYW1lRGF0YSkge1xuICAgIHRoaXMuX2xhc3RBdXRob3JpdGF0aXZlRnJhbWUgPSBmcmFtZURhdGEuZnJhbWVcbiAgICB0aGlzLl9zdG9wd2F0Y2ggPSBEYXRlLm5vdygpXG4gICAgdGhpcy5kcmF3KHRydWUpXG4gIH1cblxuICBkcmF3IChmb3JjZVNlZWspIHtcbiAgICBpZiAodGhpcy5fcGxheWluZyB8fCBmb3JjZVNlZWspIHtcbiAgICAgIHZhciBzZWVrTXMgPSAwXG4gICAgICAvLyB0aGlzLl9zdG9wd2F0Y2ggaXMgbnVsbCB1bmxlc3Mgd2UndmUgcmVjZWl2ZWQgYW4gYWN0aW9uIGZyb20gdGhlIHRpbWVsaW5lLlxuICAgICAgLy8gSWYgd2UncmUgZGV2ZWxvcGluZyB0aGUgZ2xhc3Mgc29sbywgaS5lLiB3aXRob3V0IGEgY29ubmVjdGlvbiB0byBlbnZveSB3aGljaFxuICAgICAgLy8gcHJvdmlkZXMgdGhlIHN5c3RlbSBjbG9jaywgd2UgY2FuIGp1c3QgbG9jayB0aGUgdGltZSB2YWx1ZSB0byB6ZXJvIGFzIGEgaGFjay5cbiAgICAgIC8vIFRPRE86IFdvdWxkIGJlIG5pY2UgdG8gYWxsb3cgZnVsbC1mbGVkZ2VkIHNvbG8gZGV2ZWxvcG1lbnQgb2YgZ2xhc3MuLi5cbiAgICAgIGlmICh0aGlzLl9zdG9wd2F0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGZwcyA9IDYwIC8vIFRPRE86ICBzdXBwb3J0IHZhcmlhYmxlXG4gICAgICAgIHZhciBiYXNlTXMgPSB0aGlzLl9sYXN0QXV0aG9yaXRhdGl2ZUZyYW1lICogMTAwMCAvIGZwc1xuICAgICAgICB2YXIgZGVsdGFNcyA9IHRoaXMuX3BsYXlpbmcgPyBEYXRlLm5vdygpIC0gdGhpcy5fc3RvcHdhdGNoIDogMFxuICAgICAgICBzZWVrTXMgPSBiYXNlTXMgKyBkZWx0YU1zXG4gICAgICB9XG5cbiAgICAgIC8vIFRoaXMgcm91bmRpbmcgaXMgcmVxdWlyZWQgb3RoZXJ3aXNlIHdlJ2xsIHNlZSBiaXphcnJlIGJlaGF2aW9yIG9uIHN0YWdlLlxuICAgICAgLy8gSSB0aGluayBpdCdzIGJlY2F1c2Ugc29tZSBwYXJ0IG9mIHRoZSBwbGF5ZXIncyBjYWNoaW5nIG9yIHRyYW5zaXRpb24gbG9naWNcbiAgICAgIC8vIHdoaWNoIHdhbnRzIHRoaW5ncyB0byBiZSByb3VuZCBudW1iZXJzLiBJZiB3ZSBkb24ndCByb3VuZCB0aGlzLCBpLmUuIGNvbnZlcnRcbiAgICAgIC8vIDE2LjY2NiAtPiAxNyBhbmQgMzMuMzMzIC0+IDMzLCB0aGVuIHRoZSBwbGF5ZXIgd29uJ3QgcmVuZGVyIHRob3NlIGZyYW1lcyxcbiAgICAgIC8vIHdoaWNoIG1lYW5zIHRoZSB1c2VyIHdpbGwgaGF2ZSB0cm91YmxlIG1vdmluZyB0aGluZ3Mgb24gc3RhZ2UgYXQgdGhvc2UgdGltZXMuXG4gICAgICBzZWVrTXMgPSBNYXRoLnJvdW5kKHNlZWtNcylcblxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9zZXRUaW1lbGluZVRpbWVWYWx1ZShzZWVrTXMsIGZvcmNlU2VlaylcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWZzLm92ZXJsYXkpIHtcbiAgICAgIHRoaXMuZHJhd092ZXJsYXlzKGZvcmNlU2VlaylcbiAgICB9XG4gIH1cblxuICBkcmF3TG9vcCAoKSB7XG4gICAgdGhpcy5kcmF3KClcbiAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhd0xvb3ApXG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgdGhpcy5fY29tcG9uZW50Lm1vdW50QXBwbGljYXRpb24odGhpcy5yZWZzLm1vdW50LCB7IG9wdGlvbnM6IHsgZnJlZXplOiB0cnVlLCBvdmVyZmxvd1g6ICd2aXNpYmxlJywgb3ZlcmZsb3dZOiAndmlzaWJsZScsIGNvbnRleHRNZW51OiAnZGlzYWJsZWQnIH0gfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignY29tcG9uZW50Om1vdW50ZWQnLCAoKSA9PiB7XG4gICAgICB2YXIgbmV3TW91bnRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdW50V2lkdGg6IG5ld01vdW50U2l6ZS53aWR0aCxcbiAgICAgICAgbW91bnRIZWlnaHQ6IG5ld01vdW50U2l6ZS5oZWlnaHRcbiAgICAgIH0pXG5cbiAgICAgIHRoaXMuZHJhd0xvb3AoKVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2NvbXBvbmVudDp1cGRhdGVkJywgKCkgPT4ge1xuICAgICAgdGhpcy5kcmF3KHRydWUpXG4gICAgfSlcblxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignYXJ0Ym9hcmQ6cmVzaXplZCcsIChzaXplRGVzY3JpcHRvcikgPT4ge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG1vdW50V2lkdGg6IHNpemVEZXNjcmlwdG9yLndpZHRoLFxuICAgICAgICBtb3VudEhlaWdodDogc2l6ZURlc2NyaXB0b3IuaGVpZ2h0XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB0aGlzLl9jb21wb25lbnQub24oJ3RpbWU6Y2hhbmdlJywgKHRpbWVsaW5lTmFtZSwgdGltZWxpbmVUaW1lKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY29tcG9uZW50ICYmIHRoaXMuX2NvbXBvbmVudC5nZXRNb3VudCgpICYmICF0aGlzLl9jb21wb25lbnQuaXNSZWxvYWRpbmdDb2RlKSB7XG4gICAgICAgIHZhciB1cGRhdGVkQXJ0Ym9hcmRTaXplID0gdGhpcy5fY29tcG9uZW50LmdldENvbnRleHRTaXplKClcbiAgICAgICAgaWYgKHVwZGF0ZWRBcnRib2FyZFNpemUgJiYgdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCAmJiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodCkge1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgbW91bnRXaWR0aDogdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCxcbiAgICAgICAgICAgIG1vdW50SGVpZ2h0OiB1cGRhdGVkQXJ0Ym9hcmRTaXplLmhlaWdodFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdhcnRib2FyZDpzaXplLWNoYW5nZWQnLCAoc2l6ZURlc2NyaXB0b3IpID0+IHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBtb3VudFdpZHRoOiBzaXplRGVzY3JpcHRvci53aWR0aCxcbiAgICAgICAgbW91bnRIZWlnaHQ6IHNpemVEZXNjcmlwdG9yLmhlaWdodFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gUGFzdGVhYmxlIHRoaW5ncyBhcmUgc3RvcmVkIGF0IHRoZSBnbG9iYWwgbGV2ZWwgaW4gdGhlIGNsaXBib2FyZCBidXQgd2UgbmVlZCB0aGF0IGFjdGlvbiB0byBmaXJlIGZyb20gdGhlIHRvcCBsZXZlbFxuICAgIC8vIHNvIHRoYXQgYWxsIHRoZSB2aWV3cyBnZXQgdGhlIG1lc3NhZ2UsIHNvIHdlIGVtaXQgdGhpcyBhcyBhbiBldmVudCBhbmQgdGhlbiB3YWl0IGZvciB0aGUgY2FsbCB0byBwYXN0ZVRoaW5nXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFzdGUnLCAocGFzdGVFdmVudCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIHBhc3RlIGhlYXJkJylcbiAgICAgIC8vIE5vdGlmeSBjcmVhdG9yIHRoYXQgd2UgaGF2ZSBzb21lIGNvbnRlbnQgdGhhdCB0aGUgcGVyc29uIHdpc2hlcyB0byBwYXN0ZSBvbiB0aGUgc3RhZ2U7XG4gICAgICAvLyB0aGUgdG9wIGxldmVsIG5lZWRzIHRvIGhhbmRsZSB0aGlzIGJlY2F1c2UgaXQgZG9lcyBjb250ZW50IHR5cGUgZGV0ZWN0aW9uLlxuICAgICAgcGFzdGVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgIG5hbWU6ICdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJyxcbiAgICAgICAgZnJvbTogJ2dsYXNzJyxcbiAgICAgICAgZGF0YTogbnVsbCAvLyBUaGlzIGNhbiBob2xkIGNvb3JkaW5hdGVzIGZvciB0aGUgbG9jYXRpb24gb2YgdGhlIHBhc3RlXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBmdW5jdGlvbiBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkIChjbGlwYm9hcmRBY3Rpb24sIG1heWJlQ2xpcGJvYXJkRXZlbnQpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBoYW5kbGluZyBjbGlwYm9hcmQgYWN0aW9uJywgY2xpcGJvYXJkQWN0aW9uKVxuXG4gICAgICAvLyBBdm9pZCBpbmZpbml0ZSBsb29wcyBkdWUgdG8gdGhlIHdheSB3ZSBsZXZlcmFnZSBleGVjQ29tbWFuZFxuICAgICAgaWYgKHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2spIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2NsaXBib2FyZEFjdGlvbkxvY2sgPSB0cnVlXG5cbiAgICAgIGlmICh0aGlzLl9sYXN0U2VsZWN0ZWRFbGVtZW50KSB7XG4gICAgICAgIC8vIEdvdHRhIGdyYWIgX2JlZm9yZSBjdXR0aW5nXyBvciB3ZSdsbCBlbmQgdXAgd2l0aCBhIHBhcnRpYWwgb2JqZWN0IHRoYXQgd29uJ3Qgd29ya1xuICAgICAgICBsZXQgY2xpcGJvYXJkUGF5bG9hZCA9IHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQuZ2V0Q2xpcGJvYXJkUGF5bG9hZCgnZ2xhc3MnKVxuXG4gICAgICAgIGlmIChjbGlwYm9hcmRBY3Rpb24gPT09ICdjdXQnKSB7XG4gICAgICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudC5jdXQoKVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRQYXlsb2FkID0gSlNPTi5zdHJpbmdpZnkoWydhcHBsaWNhdGlvbi9oYWlrdScsIGNsaXBib2FyZFBheWxvYWRdKVxuXG4gICAgICAgIGNsaXBib2FyZC53cml0ZVRleHQoc2VyaWFsaXplZFBheWxvYWQpXG5cbiAgICAgICAgdGhpcy5fY2xpcGJvYXJkQWN0aW9uTG9jayA9IGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jbGlwYm9hcmRBY3Rpb25Mb2NrID0gZmFsc2VcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjdXQnLCBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkLmJpbmQodGhpcywgJ2N1dCcpKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NvcHknLCBoYW5kbGVWaXJ0dWFsQ2xpcGJvYXJkLmJpbmQodGhpcywgJ2NvcHknKSlcblxuICAgIC8vIFRoaXMgZmlyZXMgd2hlbiB0aGUgY29udGV4dCBtZW51IGN1dC9jb3B5IGFjdGlvbiBoYXMgYmVlbiBmaXJlZCAtIG5vdCBhIGtleWJvYXJkIGFjdGlvbi5cbiAgICAvLyBUaGlzIGZpcmVzIHdpdGggY3V0IE9SIGNvcHkuIEluIGNhc2Ugb2YgY3V0LCB0aGUgZWxlbWVudCBoYXMgYWxyZWFkeSBiZWVuIC5jdXQoKSFcbiAgICB0aGlzLl9jb21wb25lbnQub24oJ2VsZW1lbnQ6Y29weScsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6Y29weScsIGNvbXBvbmVudElkKVxuICAgICAgdGhpcy5fbGFzdFNlbGVjdGVkRWxlbWVudCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZChjb21wb25lbnRJZClcbiAgICAgIGhhbmRsZVZpcnR1YWxDbGlwYm9hcmQuY2FsbCh0aGlzLCAnY29weScpXG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHRoZSBjdXJyZW50IHNlbGVjdGVkIGVsZW1lbnQgY2FuIGJlIGRlbGV0ZWQgZnJvbSB0aGUgZ2xvYmFsIG1lbnUsIHdlIG5lZWQgdG8ga2VlcCBpdCB0aGVyZVxuICAgIHRoaXMuX2NvbXBvbmVudC5vbignZWxlbWVudDpzZWxlY3RlZCcsIChjb21wb25lbnRJZCkgPT4ge1xuICAgICAgY29uc29sZS5pbmZvKCdbZ2xhc3NdIGVsZW1lbnQ6c2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmQoY29tcG9uZW50SWQpXG4gICAgfSlcblxuICAgIC8vIFNpbmNlIHRoZSBjdXJyZW50IHNlbGVjdGVkIGVsZW1lbnQgY2FuIGJlIGRlbGV0ZWQgZnJvbSB0aGUgZ2xvYmFsIG1lbnUsIHdlIG5lZWQgY2xlYXIgaXQgdGhlcmUgdG9vXG4gICAgdGhpcy5fY29tcG9uZW50Lm9uKCdlbGVtZW50OnVuc2VsZWN0ZWQnLCAoY29tcG9uZW50SWQpID0+IHtcbiAgICAgIGNvbnNvbGUuaW5mbygnW2dsYXNzXSBlbGVtZW50OnVuc2VsZWN0ZWQnLCBjb21wb25lbnRJZClcbiAgICAgIHRoaXMuX2xhc3RTZWxlY3RlZEVsZW1lbnQgPSBudWxsXG4gICAgICB0aGlzLmRyYXcodHJ1ZSlcbiAgICB9KVxuXG4gICAgdGhpcy5wcm9wcy53ZWJzb2NrZXQub24oJ2Jyb2FkY2FzdCcsIChtZXNzYWdlKSA9PiB7XG4gICAgICB2YXIgb2xkVHJhbnNmb3JtIC8vIERlZmluZWQgYmVsb3cgLy8gbGludGVyXG5cbiAgICAgIHN3aXRjaCAobWVzc2FnZS5uYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbXBvbmVudDpyZWxvYWQnOlxuICAgICAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQubW9kdWxlUmVwbGFjZSgoZXJyKSA9PiB7XG4gICAgICAgICAgICAvLyBOb3RpZnkgdGhlIHBsdW1iaW5nIHRoYXQgdGhlIG1vZHVsZSByZXBsYWNlbWVudCBoZXJlIGhhcyBmaW5pc2hlZCwgd2hpY2ggc2hvdWxkIHJlYWN0aXZhdGVcbiAgICAgICAgICAgIC8vIHRoZSB1bmRvL3JlZG8gcXVldWVzIHdoaWNoIHNob3VsZCBiZSB3YWl0aW5nIGZvciB0aGlzIHRvIGZpbmlzaFxuICAgICAgICAgICAgLy8gTm90ZSBob3cgd2UgZG8gdGhpcyB3aGV0aGVyIG9yIG5vdCB3ZSBnb3QgYW4gZXJyb3IgZnJvbSB0aGUgYWN0aW9uXG4gICAgICAgICAgICB0aGlzLnByb3BzLndlYnNvY2tldC5zZW5kKHtcbiAgICAgICAgICAgICAgdHlwZTogJ2Jyb2FkY2FzdCcsXG4gICAgICAgICAgICAgIG5hbWU6ICdjb21wb25lbnQ6cmVsb2FkOmNvbXBsZXRlJyxcbiAgICAgICAgICAgICAgZnJvbTogJ2dsYXNzJ1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSBhcnRib2FyZCBzaXplIG1heSBoYXZlIGNoYW5nZWQgYXMgYSBwYXJ0IG9mIHRoYXQsIGFuZCBzaW5jZSB0aGVyZSBhcmUgdHdvIHNvdXJjZXMgb2ZcbiAgICAgICAgICAgIC8vIHRydXRoIGZvciB0aGlzIChhY3R1YWwgYXJ0Ym9hcmQsIFJlYWN0IG1vdW50IGZvciBhcnRib2FyZCksIHdlIGhhdmUgdG8gdXBkYXRlIGl0IGhlcmUuXG4gICAgICAgICAgICB2YXIgdXBkYXRlZEFydGJvYXJkU2l6ZSA9IHRoaXMuX2NvbXBvbmVudC5nZXRDb250ZXh0U2l6ZSgpXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgbW91bnRXaWR0aDogdXBkYXRlZEFydGJvYXJkU2l6ZS53aWR0aCxcbiAgICAgICAgICAgICAgbW91bnRIZWlnaHQ6IHVwZGF0ZWRBcnRib2FyZFNpemUuaGVpZ2h0XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pXG5cbiAgICAgICAgY2FzZSAndmlldzp6b29tLWluJzpcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0gPSB0aGlzLl9jb21wb25lbnQuZ2V0U3RhZ2VUcmFuc2Zvcm0oKVxuICAgICAgICAgIG9sZFRyYW5zZm9ybS56b29tID0gdGhpcy5zdGF0ZS56b29tWFkgKiAxLjI1XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNldFN0YWdlVHJhbnNmb3JtKG9sZFRyYW5zZm9ybSlcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IHpvb21YWTogdGhpcy5zdGF0ZS56b29tWFkgKiAxLjI1IH0pXG5cbiAgICAgICAgY2FzZSAndmlldzp6b29tLW91dCc6XG4gICAgICAgICAgb2xkVHJhbnNmb3JtID0gdGhpcy5fY29tcG9uZW50LmdldFN0YWdlVHJhbnNmb3JtKClcbiAgICAgICAgICBvbGRUcmFuc2Zvcm0uem9vbSA9IHRoaXMuc3RhdGUuem9vbVhZIC8gMS4yNVxuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5zZXRTdGFnZVRyYW5zZm9ybShvbGRUcmFuc2Zvcm0pXG4gICAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoeyB6b29tWFk6IHRoaXMuc3RhdGUuem9vbVhZIC8gMS4yNSB9KVxuXG4gICAgICAgIGNhc2UgJ2RyYXdpbmc6c2V0QWN0aXZlJzpcbiAgICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBhY3RpdmVEcmF3aW5nVG9vbDogbWVzc2FnZS5wYXJhbXNbMF0sXG4gICAgICAgICAgICBkcmF3aW5nSXNNb2RhbDogbWVzc2FnZS5wYXJhbXNbMV1cbiAgICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnByb3BzLndlYnNvY2tldC5vbignbWV0aG9kJywgKG1ldGhvZCwgcGFyYW1zLCBjYikgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudC5jYWxsTWV0aG9kKG1ldGhvZCwgcGFyYW1zLCBjYilcbiAgICB9KVxuXG4gICAgdGhpcy5fY29tbWVudHMubG9hZCgoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21tZW50czogdGhpcy5fY29tbWVudHMuY29tbWVudHMgfSlcbiAgICB9KVxuXG4gICAgdGhpcy5fY3R4bWVudS5vbignY2xpY2snLCAoYWN0aW9uLCBldmVudCwgZWxlbWVudCkgPT4ge1xuICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSAnQWRkIENvbW1lbnQnOlxuICAgICAgICAgIHRoaXMuX2NvbW1lbnRzLmJ1aWxkKHsgeDogdGhpcy5fY3R4bWVudS5fbWVudS5sYXN0WCwgeTogdGhpcy5fY3R4bWVudS5fbWVudS5sYXN0WSB9KVxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21tZW50czogdGhpcy5fY29tbWVudHMuY29tbWVudHMsIGRvU2hvd0NvbW1lbnRzOiB0cnVlIH0sICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2N0eG1lbnUucmVidWlsZCh0aGlzKVxuICAgICAgICAgIH0pXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnSGlkZSBDb21tZW50cyc6XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRvU2hvd0NvbW1lbnRzOiAhdGhpcy5zdGF0ZS5kb1Nob3dDb21tZW50cyB9LCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jdHhtZW51LnJlYnVpbGQodGhpcylcbiAgICAgICAgICB9KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ1Nob3cgQ29tbWVudHMnOlxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBkb1Nob3dDb21tZW50czogIXRoaXMuc3RhdGUuZG9TaG93Q29tbWVudHMgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY3R4bWVudS5yZWJ1aWxkKHRoaXMpXG4gICAgICAgICAgfSlcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdTaG93IEV2ZW50IExpc3RlbmVycyc6XG4gICAgICAgICAgdGhpcy5zaG93RXZlbnRIYW5kbGVyc0VkaXRvcihldmVudCwgZWxlbWVudClcbiAgICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH0pXG5cbiAgICAvLyBQYXN0ZWFibGUgdGhpbmdzIGFyZSBzdG9yZWQgYXQgdGhlIGdsb2JhbCBsZXZlbCBpbiB0aGUgY2xpcGJvYXJkIGJ1dCB3ZSBuZWVkIHRoYXQgYWN0aW9uIHRvIGZpcmUgZnJvbSB0aGUgdG9wIGxldmVsXG4gICAgLy8gc28gdGhhdCBhbGwgdGhlIHZpZXdzIGdldCB0aGUgbWVzc2FnZSwgc28gd2UgZW1pdCB0aGlzIGFzIGFuIGV2ZW50IGFuZCB0aGVuIHdhaXQgZm9yIHRoZSBjYWxsIHRvIHBhc3RlVGhpbmdcbiAgICB0aGlzLl9jdHhtZW51Lm9uKCdjdXJyZW50LXBhc3RlYWJsZTpyZXF1ZXN0LXBhc3RlJywgKGRhdGEpID0+IHtcbiAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoe1xuICAgICAgICB0eXBlOiAnYnJvYWRjYXN0JyxcbiAgICAgICAgbmFtZTogJ2N1cnJlbnQtcGFzdGVhYmxlOnJlcXVlc3QtcGFzdGUnLFxuICAgICAgICBmcm9tOiAnZ2xhc3MnLFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgbG9kYXNoLnRocm90dGxlKCgpID0+IHtcbiAgICAgIHJldHVybiB0aGlzLmhhbmRsZVdpbmRvd1Jlc2l6ZSgpXG4gICAgfSksIDY0KVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLndpbmRvd01vdXNlVXBIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMud2luZG93TW91c2VNb3ZlSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy53aW5kb3dNb3VzZVVwSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLndpbmRvd01vdXNlRG93bkhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLndpbmRvd0NsaWNrSGFuZGxlci5iaW5kKHRoaXMpKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIHRoaXMud2luZG93RGJsQ2xpY2tIYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLndpbmRvd0tleURvd25IYW5kbGVyLmJpbmQodGhpcykpXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy53aW5kb3dLZXlVcEhhbmRsZXIuYmluZCh0aGlzKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCB0aGlzLndpbmRvd01vdXNlT3V0SGFuZGxlci5iaW5kKHRoaXMpKVxuXG4gICAgd2luZG93Lm9uZXJyb3IgPSAoZXJyb3IpID0+IHtcbiAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IGVycm9yIH0pXG4gICAgfVxuXG4gICAgLy8gdGhpcy5yZXNldENvbnRhaW5lckRpbWVuc2lvbnMoKCkgPT4ge1xuICAgIC8vICAgIHRoaXMuZHJhd0xvb3AoKVxuICAgIC8vIH0pXG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUgKCkge1xuICAgIHRoaXMucmVzZXRDb250YWluZXJEaW1lbnNpb25zKClcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50ICgpIHtcbiAgICB0aGlzLnRvdXJDbGllbnQub2ZmKCd0b3VyOnJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMnLCB0aGlzLmhhbmRsZVJlcXVlc3RFbGVtZW50Q29vcmRpbmF0ZXMpXG4gICAgdGhpcy5fZW52b3lDbGllbnQuY2xvc2VDb25uZWN0aW9uKClcbiAgfVxuXG4gIGhhbmRsZVdpbmRvd1Jlc2l6ZSAoKSB7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlc2V0Q29udGFpbmVyRGltZW5zaW9ucygpXG4gICAgfSlcbiAgfVxuXG4gIHNob3dFdmVudEhhbmRsZXJzRWRpdG9yIChjbGlja0V2ZW50LCB0YXJnZXRFbGVtZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICB0YXJnZXRFbGVtZW50OiB0YXJnZXRFbGVtZW50LFxuICAgICAgaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuOiB0cnVlXG4gICAgfSlcbiAgfVxuXG4gIGhpZGVFdmVudEhhbmRsZXJzRWRpdG9yICgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIHRhcmdldEVsZW1lbnQ6IG51bGwsXG4gICAgICBpc0V2ZW50SGFuZGxlckVkaXRvck9wZW46IGZhbHNlXG4gICAgfSlcbiAgfVxuXG4gIHNhdmVFdmVudEhhbmRsZXIgKHRhcmdldEVsZW1lbnQsIGV2ZW50TmFtZSwgaGFuZGxlckRlc2NyaXB0b3JTZXJpYWxpemVkKSB7XG4gICAgbGV0IHNlbGVjdG9yTmFtZSA9ICdoYWlrdTonICsgdGFyZ2V0RWxlbWVudC51aWRcbiAgICB0aGlzLl9jb21wb25lbnQudXBzZXJ0RXZlbnRIYW5kbGVyKHNlbGVjdG9yTmFtZSwgZXZlbnROYW1lLCBoYW5kbGVyRGVzY3JpcHRvclNlcmlhbGl6ZWQsIHsgZnJvbTogJ2dsYXNzJyB9LCAoKSA9PiB7XG5cbiAgICB9KVxuICB9XG5cbiAgcGVyZm9ybVBhbiAoZHgsIGR5KSB7XG4gICAgdmFyIG9sZFRyYW5zZm9ybSA9IHRoaXMuX2NvbXBvbmVudC5nZXRTdGFnZVRyYW5zZm9ybSgpXG4gICAgb2xkVHJhbnNmb3JtLnBhbi54ID0gdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblggKyBkeFxuICAgIG9sZFRyYW5zZm9ybS5wYW4ueSA9IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5ZICsgZHlcbiAgICB0aGlzLl9jb21wb25lbnQuc2V0U3RhZ2VUcmFuc2Zvcm0ob2xkVHJhbnNmb3JtKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgcGFuWDogdGhpcy5zdGF0ZS5vcmlnaW5hbFBhblggKyBkeCxcbiAgICAgIHBhblk6IHRoaXMuc3RhdGUub3JpZ2luYWxQYW5ZICsgZHlcbiAgICB9KVxuICB9XG5cbiAgd2luZG93TW91c2VPdXRIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdmFyIHNvdXJjZSA9IG5hdGl2ZUV2ZW50LnJlbGF0ZWRUYXJnZXQgfHwgbmF0aXZlRXZlbnQudG9FbGVtZW50XG4gICAgaWYgKCFzb3VyY2UgfHwgc291cmNlLm5vZGVOYW1lID09PSAnSFRNTCcpIHtcbiAgICAgIC8vIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgLy8gICBpc0FueXRoaW5nU2NhbGluZzogZmFsc2UsXG4gICAgICAvLyAgIGlzQW55dGhpbmdSb3RhdGluZzogZmFsc2UsXG4gICAgICAvLyAgIGNvbnRyb2xBY3RpdmF0aW9uOiBudWxsXG4gICAgICAvLyB9KVxuICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5ob3ZlcmVkLmRlcXVldWUoKVxuICAgIH1cbiAgfVxuXG4gIHdpbmRvd01vdXNlTW92ZUhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVNb3VzZU1vdmUoeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93TW91c2VVcEhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVNb3VzZVVwKHsgbmF0aXZlRXZlbnQgfSlcbiAgfVxuXG4gIHdpbmRvd01vdXNlRG93bkhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBuYXRpdmVFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgdGhpcy5oYW5kbGVNb3VzZURvd24oeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93Q2xpY2tIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlQ2xpY2soeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93RGJsQ2xpY2tIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgbmF0aXZlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIHRoaXMuaGFuZGxlRG91YmxlQ2xpY2soeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93S2V5RG93bkhhbmRsZXIgKG5hdGl2ZUV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB0aGlzLmhhbmRsZUtleURvd24oeyBuYXRpdmVFdmVudCB9KVxuICB9XG5cbiAgd2luZG93S2V5VXBIYW5kbGVyIChuYXRpdmVFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSB8fCB0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3Blbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5oYW5kbGVLZXlVcCh7IG5hdGl2ZUV2ZW50IH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZURvd24gKG1vdXNlZG93bkV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICBpZiAobW91c2Vkb3duRXZlbnQubmF0aXZlRXZlbnQuYnV0dG9uICE9PSAwKSByZXR1cm4gLy8gbGVmdCBjbGljayBvbmx5XG5cbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEb3duID0gdHJ1ZVxuICAgIHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blRpbWUgPSBEYXRlLm5vdygpXG4gICAgdmFyIG1vdXNlUG9zID0gdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24obW91c2Vkb3duRXZlbnQsICdsYXN0TW91c2VEb3duUG9zaXRpb24nKVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuYWN0aXZlRHJhd2luZ1Rvb2wgIT09ICdwb2ludGVyJykge1xuICAgICAgaWYgKCF0aGlzLnN0YXRlLmRyYXdpbmdJc01vZGFsKSB7XG4gICAgICAgIHRoaXMucHJvcHMud2Vic29ja2V0LnNlbmQoeyB0eXBlOiAnYnJvYWRjYXN0JywgbmFtZTogJ2RyYXdpbmc6Y29tcGxldGVkJywgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgfVxuXG4gICAgICB0aGlzLl9jb21wb25lbnQuaW5zdGFudGlhdGVDb21wb25lbnQodGhpcy5zdGF0ZS5hY3RpdmVEcmF3aW5nVG9vbCwge1xuICAgICAgICB4OiBtb3VzZVBvcy54LFxuICAgICAgICB5OiBtb3VzZVBvcy55LFxuICAgICAgICBtaW5pbWl6ZWQ6IHRydWVcbiAgICAgIH0sIHsgZnJvbTogJ2dsYXNzJyB9LCAoZXJyLCBtZXRhZGF0YSwgZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnNvbGUuZXJyb3IoZXJyKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIG1vdXNlIGlzIHN0aWxsIGRvd24gYmVnaW4gZHJhZyBzY2FsaW5nXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmlzTW91c2VEb3duKSB7XG4gICAgICAgICAgLy8gYWN0aXZhdGUgdGhlIGJvdHRvbSByaWdodCBjb250cm9sIHBvaW50LCBmb3Igc2NhbGluZ1xuICAgICAgICAgIHRoaXMuY29udHJvbEFjdGl2YXRpb24oe1xuICAgICAgICAgICAgaW5kZXg6IDgsXG4gICAgICAgICAgICBldmVudDogbW91c2Vkb3duRXZlbnRcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjbGltYiB0aGUgdGFyZ2V0IHBhdGggdG8gZmluZCBpZiBhIGhhaWt1IGVsZW1lbnQgaGFzIGJlZW4gc2VsZWN0ZWRcbiAgICAgIC8vIE5PVEU6IHdlIHdhbnQgdG8gbWFrZSBzdXJlIHdlIGFyZSBub3Qgc2VsZWN0aW5nIGVsZW1lbnRzIGF0IHRoZSB3cm9uZyBjb250ZXh0IGxldmVsXG4gICAgICB2YXIgdGFyZ2V0ID0gbW91c2Vkb3duRXZlbnQubmF0aXZlRXZlbnQudGFyZ2V0XG4gICAgICBpZiAoKHR5cGVvZiB0YXJnZXQuY2xhc3NOYW1lID09PSAnc3RyaW5nJykgJiYgdGFyZ2V0LmNsYXNzTmFtZS5pbmRleE9mKCdzY2FsZS1jdXJzb3InKSAhPT0gLTEpIHJldHVyblxuXG4gICAgICB3aGlsZSAodGFyZ2V0Lmhhc0F0dHJpYnV0ZSAmJiAoIXRhcmdldC5oYXNBdHRyaWJ1dGUoJ3NvdXJjZScpIHx8ICF0YXJnZXQuaGFzQXR0cmlidXRlKCdoYWlrdS1pZCcpIHx8XG4gICAgICAgICAgICAgIXRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZmluZCh0YXJnZXQuZ2V0QXR0cmlidXRlKCdoYWlrdS1pZCcpKSkpIHtcbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcbiAgICAgIH1cblxuICAgICAgaWYgKCF0YXJnZXQgfHwgIXRhcmdldC5oYXNBdHRyaWJ1dGUpIHtcbiAgICAgICAgLy8gSWYgc2hpZnQgaXMgZG93biwgdGhhdCdzIGNvbnN0cmFpbmVkIHNjYWxpbmcuIElmIGNtZCwgdGhhdCdzIHJvdGF0aW9uIG1vZGUuXG4gICAgICAgIGlmICghdGhpcy5zdGF0ZS5pc0tleVNoaWZ0RG93biAmJiAhdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQuaGFzQXR0cmlidXRlKCdzb3VyY2UnKSAmJiB0YXJnZXQuaGFzQXR0cmlidXRlKCdoYWlrdS1pZCcpICYmIHRhcmdldC5wYXJlbnROb2RlICE9PSB0aGlzLnJlZnMubW91bnQpIHtcbiAgICAgICAgdmFyIGhhaWt1SWQgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdoYWlrdS1pZCcpXG4gICAgICAgIHZhciBjb250YWluZWQgPSBsb2Rhc2guZmluZCh0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KSxcbiAgICAgICAgICAgIChlbGVtZW50KSA9PiBlbGVtZW50LnVpZCA9PT0gaGFpa3VJZClcblxuICAgICAgICAvLyB3ZSBjaGVjayBpZiB0aGUgZWxlbWVudCBiZWluZyBjbGlja2VkIG9uIGlzIGFscmVhZHkgaW4gdGhlIHNlbGVjdGlvbiwgaWYgaXQgaXMgd2UgZG9uJ3Qgd2FudFxuICAgICAgICAvLyB0byBjbGVhciB0aGUgc2VsZWN0aW9uIHNpbmNlIGl0IGNvdWxkIGJlIGEgZ3JvdXBlZCBzZWxlY3Rpb25cbiAgICAgICAgLy8gSWYgc2hpZnQgaXMgZG93biwgdGhhdCdzIGNvbnN0cmFpbmVkIHNjYWxpbmcuIElmIGNtZCwgdGhhdCdzIHJvdGF0aW9uIG1vZGUuXG4gICAgICAgIGlmICghY29udGFpbmVkICYmICghdGhpcy5zdGF0ZS5pc0tleVNoaWZ0RG93biAmJiAhdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duKSkge1xuICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29udGFpbmVkKSB7XG4gICAgICAgICAgdGhpcy5fY29tcG9uZW50LnNlbGVjdEVsZW1lbnQoaGFpa3VJZCwgeyBmcm9tOiAnZ2xhc3MnIH0sICgpID0+IHt9KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlTW91c2VVcCAobW91c2V1cEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuaXNQcmV2aWV3TW9kZSgpIHx8IHRoaXMuc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB0aGlzLnN0YXRlLmlzTW91c2VEb3duID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlLmxhc3RNb3VzZVVwVGltZSA9IERhdGUubm93KClcbiAgICB0aGlzLmhhbmRsZURyYWdTdG9wKClcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGlzQW55dGhpbmdTY2FsaW5nOiBmYWxzZSxcbiAgICAgIGlzQW55dGhpbmdSb3RhdGluZzogZmFsc2UsXG4gICAgICBnbG9iYWxDb250cm9sUG9pbnRIYW5kbGVDbGFzczogJycsXG4gICAgICBjb250cm9sQWN0aXZhdGlvbjogbnVsbFxuICAgIH0pXG4gICAgdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24obW91c2V1cEV2ZW50LCAnbGFzdE1vdXNlVXBQb3NpdGlvbicpXG4gIH1cblxuICBoYW5kbGVDbGljayAoY2xpY2tFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKGNsaWNrRXZlbnQpXG4gIH1cblxuICBoYW5kbGVEb3VibGVDbGljayAoZG91YmxlQ2xpY2tFdmVudCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIHRoaXMuc3RvcmVBbmRSZXR1cm5Nb3VzZVBvc2l0aW9uKGRvdWJsZUNsaWNrRXZlbnQpXG4gIH1cblxuICBoYW5kbGVEcmFnU3RhcnQgKGNiKSB7XG4gICAgdGhpcy5zdGF0ZS5pc01vdXNlRHJhZ2dpbmcgPSB0cnVlXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzTW91c2VEcmFnZ2luZzogdHJ1ZSB9LCBjYilcbiAgfVxuXG4gIGhhbmRsZURyYWdTdG9wIChjYikge1xuICAgIHRoaXMuc3RhdGUuaXNNb3VzZURyYWdnaW5nID0gZmFsc2VcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNNb3VzZURyYWdnaW5nOiBmYWxzZSB9LCBjYilcbiAgfVxuXG4gIGhhbmRsZUtleUVzY2FwZSAoKSB7XG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy51bnNlbGVjdEFsbEVsZW1lbnRzKHsgZnJvbTogJ2dsYXNzJyB9KVxuICB9XG5cbiAgaGFuZGxlS2V5U3BhY2UgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlTcGFjZURvd246IGlzRG93biB9KVxuICAgIC8vIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZHJpbGxkb3duSW50b0FscmVhZHlTZWxlY3RlZEVsZW1lbnQodGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudClcbiAgfVxuXG4gIGhhbmRsZUtleUxlZnRBcnJvdyAoa2V5RXZlbnQpIHtcbiAgICB2YXIgZGVsdGEgPSBrZXlFdmVudC5zaGlmdEtleSA/IDUgOiAxXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy53aGVyZSh7IGlzU2VsZWN0ZWQ6IHRydWUgfSkuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgZWxlbWVudC5tb3ZlKC1kZWx0YSwgMCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleVVwQXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZSgwLCAtZGVsdGEsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlSaWdodEFycm93IChrZXlFdmVudCkge1xuICAgIHZhciBkZWx0YSA9IGtleUV2ZW50LnNoaWZ0S2V5ID8gNSA6IDFcbiAgICB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLndoZXJlKHsgaXNTZWxlY3RlZDogdHJ1ZSB9KS5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBlbGVtZW50Lm1vdmUoZGVsdGEsIDAsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnQsIHRoaXMuc3RhdGUubW91c2VQb3NpdGlvblByZXZpb3VzKVxuICAgIH0pXG4gIH1cblxuICBoYW5kbGVLZXlEb3duQXJyb3cgKGtleUV2ZW50KSB7XG4gICAgdmFyIGRlbHRhID0ga2V5RXZlbnQuc2hpZnRLZXkgPyA1IDogMVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQubW92ZSgwLCBkZWx0YSwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCwgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUtleURvd24gKGtleUV2ZW50KSB7XG4gICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3IpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yLndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudChrZXlFdmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChrZXlFdmVudC5uYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgY2FzZSAyNzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RXNjYXBlKClcbiAgICAgIGNhc2UgMzI6IHJldHVybiB0aGlzLmhhbmRsZUtleVNwYWNlKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSAzNzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5TGVmdEFycm93KGtleUV2ZW50Lm5hdGl2ZUV2ZW50KVxuICAgICAgY2FzZSAzODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5VXBBcnJvdyhrZXlFdmVudC5uYXRpdmVFdmVudClcbiAgICAgIGNhc2UgMzk6IHJldHVybiB0aGlzLmhhbmRsZUtleVJpZ2h0QXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDQwOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlEb3duQXJyb3coa2V5RXZlbnQubmF0aXZlRXZlbnQpXG4gICAgICBjYXNlIDQ2OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlEZWxldGUoKVxuICAgICAgY2FzZSA4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlEZWxldGUoKVxuICAgICAgY2FzZSAxMzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5RW50ZXIoKVxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5U2hpZnQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDE3OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDdHJsKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSAxODogcmV0dXJuIHRoaXMuaGFuZGxlS2V5QWx0KGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIHRydWUpXG4gICAgICBjYXNlIDkxOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCB0cnVlKVxuICAgICAgY2FzZSA5MzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgdHJ1ZSlcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5VXAgKGtleUV2ZW50KSB7XG4gICAgaWYgKHRoaXMucmVmcy5ldmVudEhhbmRsZXJFZGl0b3IpIHtcbiAgICAgIGlmICh0aGlzLnJlZnMuZXZlbnRIYW5kbGVyRWRpdG9yLndpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudChrZXlFdmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChrZXlFdmVudC5uYXRpdmVFdmVudC53aGljaCkge1xuICAgICAgY2FzZSAzMjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5U3BhY2Uoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSAxNjogcmV0dXJuIHRoaXMuaGFuZGxlS2V5U2hpZnQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSAxNzogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q3RybChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDE4OiByZXR1cm4gdGhpcy5oYW5kbGVLZXlBbHQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSAyMjQ6IHJldHVybiB0aGlzLmhhbmRsZUtleUNvbW1hbmQoa2V5RXZlbnQubmF0aXZlRXZlbnQsIGZhbHNlKVxuICAgICAgY2FzZSA5MTogcmV0dXJuIHRoaXMuaGFuZGxlS2V5Q29tbWFuZChrZXlFdmVudC5uYXRpdmVFdmVudCwgZmFsc2UpXG4gICAgICBjYXNlIDkzOiByZXR1cm4gdGhpcy5oYW5kbGVLZXlDb21tYW5kKGtleUV2ZW50Lm5hdGl2ZUV2ZW50LCBmYWxzZSlcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlS2V5RW50ZXIgKCkge1xuICAgIC8vIG5vb3AgZm9yIG5vd1xuICB9XG5cbiAgaGFuZGxlS2V5Q29tbWFuZCAobmF0aXZlRXZlbnQsIGlzRG93bikge1xuICAgIHZhciBjb250cm9sQWN0aXZhdGlvbiA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb25cbiAgICBpZiAoY29udHJvbEFjdGl2YXRpb24pIHtcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uLmNtZCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlDb21tYW5kRG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlS2V5U2hpZnQgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB2YXIgY29udHJvbEFjdGl2YXRpb24gPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uXG4gICAgaWYgKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgICBjb250cm9sQWN0aXZhdGlvbi5zaGlmdCA9IGlzRG93blxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHsgaXNLZXlTaGlmdERvd246IGlzRG93biwgY29udHJvbEFjdGl2YXRpb24gfSlcbiAgfVxuXG4gIGhhbmRsZUtleUN0cmwgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB2YXIgY29udHJvbEFjdGl2YXRpb24gPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uXG4gICAgaWYgKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgICBjb250cm9sQWN0aXZhdGlvbi5jdHJsID0gaXNEb3duXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoeyBpc0tleUN0cmxEb3duOiBpc0Rvd24sIGNvbnRyb2xBY3RpdmF0aW9uIH0pXG4gIH1cblxuICBoYW5kbGVLZXlBbHQgKG5hdGl2ZUV2ZW50LCBpc0Rvd24pIHtcbiAgICB2YXIgY29udHJvbEFjdGl2YXRpb24gPSB0aGlzLnN0YXRlLmNvbnRyb2xBY3RpdmF0aW9uXG4gICAgaWYgKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgICBjb250cm9sQWN0aXZhdGlvbi5hbHQgPSBpc0Rvd25cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzS2V5QWx0RG93bjogaXNEb3duLCBjb250cm9sQWN0aXZhdGlvbiB9KVxuICB9XG5cbiAgaGFuZGxlQ2xpY2tTdGFnZU5hbWUgKCkge1xuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgICB2YXIgYXJ0Ym9hcmQgPSB0aGlzLl9jb21wb25lbnQuX2VsZW1lbnRzLmZpbmRSb290cygpWzBdXG4gICAgdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5jbGlja2VkLmFkZChhcnRib2FyZClcbiAgICBhcnRib2FyZC5zZWxlY3QoeyBmcm9tOiAnZ2xhc3MnIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZU92ZXJTdGFnZU5hbWUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoeyBpc1N0YWdlTmFtZUhvdmVyaW5nOiB0cnVlIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZU91dFN0YWdlTmFtZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGlzU3RhZ2VOYW1lSG92ZXJpbmc6IGZhbHNlIH0pXG4gIH1cblxuICBoYW5kbGVNb3VzZU1vdmUgKG1vdXNlbW92ZUV2ZW50KSB7XG4gICAgY29uc3Qgem9vbSA9IHRoaXMuc3RhdGUuem9vbVhZIHx8IDFcbiAgICBjb25zdCBsYXN0TW91c2VEb3duUG9zaXRpb24gPSB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvblxuICAgIGNvbnN0IG1vdXNlUG9zaXRpb25DdXJyZW50ID0gdGhpcy5zdG9yZUFuZFJldHVybk1vdXNlUG9zaXRpb24obW91c2Vtb3ZlRXZlbnQpXG4gICAgY29uc3QgbW91c2VQb3NpdGlvblByZXZpb3VzID0gdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uUHJldmlvdXMgfHwgbW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICBsZXQgZHggPSAobW91c2VQb3NpdGlvbkN1cnJlbnQueCAtIG1vdXNlUG9zaXRpb25QcmV2aW91cy54KSAvIHpvb21cbiAgICBsZXQgZHkgPSAobW91c2VQb3NpdGlvbkN1cnJlbnQueSAtIG1vdXNlUG9zaXRpb25QcmV2aW91cy55KSAvIHpvb21cbiAgICBpZiAoZHggPT09IDAgJiYgZHkgPT09IDApIHJldHVybiBtb3VzZVBvc2l0aW9uQ3VycmVudFxuXG4gICAgLy8gaWYgKGR4ICE9PSAwKSBkeCA9IE1hdGgucm91bmQodGhpcy5zdGF0ZS56b29tWFkgLyBkeClcbiAgICAvLyBpZiAoZHkgIT09IDApIGR5ID0gTWF0aC5yb3VuZCh0aGlzLnN0YXRlLnpvb21YWSAvIGR5KVxuICAgIC8vIElmIHdlIGdvdCB0aGlzIGZhciwgdGhlIG1vdXNlIGhhcyBjaGFuZ2VkIGl0cyBwb3NpdGlvbiBmcm9tIHRoZSBtb3N0IHJlY2VudCBtb3VzZWRvd25cbiAgICBpZiAodGhpcy5zdGF0ZS5pc01vdXNlRG93bikge1xuICAgICAgdGhpcy5oYW5kbGVEcmFnU3RhcnQoKVxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5pc01vdXNlRHJhZ2dpbmcgJiYgdGhpcy5zdGF0ZS5pc01vdXNlRG93bikge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaXNLZXlTcGFjZURvd24gJiYgdGhpcy5zdGF0ZS5zdGFnZU1vdXNlRG93bikge1xuICAgICAgICB0aGlzLnBlcmZvcm1QYW4oXG4gICAgICAgICAgbW91c2Vtb3ZlRXZlbnQubmF0aXZlRXZlbnQuY2xpZW50WCAtIHRoaXMuc3RhdGUuc3RhZ2VNb3VzZURvd24ueCxcbiAgICAgICAgICBtb3VzZW1vdmVFdmVudC5uYXRpdmVFdmVudC5jbGllbnRZIC0gdGhpcy5zdGF0ZS5zdGFnZU1vdXNlRG93bi55XG4gICAgICAgIClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pXG4gICAgICAgIGlmIChzZWxlY3RlZC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VsZWN0ZWQuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgZWxlbWVudC5kcmFnKGR4LCBkeSwgbW91c2VQb3NpdGlvbkN1cnJlbnQsIG1vdXNlUG9zaXRpb25QcmV2aW91cywgbGFzdE1vdXNlRG93blBvc2l0aW9uLCB0aGlzLnN0YXRlKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1vdXNlUG9zaXRpb25DdXJyZW50XG4gIH1cblxuICBoYW5kbGVLZXlEZWxldGUgKCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMud2hlcmUoeyBpc1NlbGVjdGVkOiB0cnVlIH0pLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIGVsZW1lbnQucmVtb3ZlKClcbiAgICB9KVxuICB9XG5cbiAgcmVzZXRDb250YWluZXJEaW1lbnNpb25zIChjYikge1xuICAgIGlmICghdGhpcy5yZWZzLmNvbnRhaW5lcikgcmV0dXJuXG4gICAgdmFyIHcgPSB0aGlzLnJlZnMuY29udGFpbmVyLmNsaWVudFdpZHRoXG4gICAgdmFyIGggPSB0aGlzLnJlZnMuY29udGFpbmVyLmNsaWVudEhlaWdodFxuICAgIHZhciBtb3VudFggPSAodyAtIHRoaXMuc3RhdGUubW91bnRXaWR0aCkgLyAyXG4gICAgdmFyIG1vdW50WSA9IChoIC0gdGhpcy5zdGF0ZS5tb3VudEhlaWdodCkgLyAyXG4gICAgaWYgKHcgIT09IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGggfHwgaCAhPT0gdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHQgfHwgbW91bnRYICE9PSB0aGlzLnN0YXRlLm1vdW50WCB8fCBtb3VudFkgIT09IHRoaXMuc3RhdGUubW91bnRZKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHsgY29udGFpbmVyV2lkdGg6IHcsIGNvbnRhaW5lckhlaWdodDogaCwgbW91bnRYLCBtb3VudFkgfSwgY2IpXG4gICAgfVxuICB9XG5cbiAgZ2V0QXJ0Ym9hcmRSZWN0ICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFgsXG4gICAgICByaWdodDogdGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGgsXG4gICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZLFxuICAgICAgYm90dG9tOiB0aGlzLnN0YXRlLm1vdW50WSArIHRoaXMuc3RhdGUubW91bnRIZWlnaHQsXG4gICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdW50SGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgZ2V0U2VsZWN0aW9uTWFycXVlZVNpemUgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCB8fCAhdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24pIHtcbiAgICAgIHJldHVybiB7IHg6IDAsIHk6IDAsIHdpZHRoOiAwLCBoZWlnaHQ6IDAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgeDogdGhpcy5zdGF0ZS5sYXN0TW91c2VEb3duUG9zaXRpb24ueCArIHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkubGVmdCxcbiAgICAgIHk6IHRoaXMuc3RhdGUubGFzdE1vdXNlRG93blBvc2l0aW9uLnkgKyB0aGlzLmdldEFydGJvYXJkUmVjdCgpLnRvcCxcbiAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LnggLSB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi54LFxuICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50LnkgLSB0aGlzLnN0YXRlLmxhc3RNb3VzZURvd25Qb3NpdGlvbi55XG4gICAgfVxuICB9XG5cbiAgY29udHJvbEFjdGl2YXRpb24gKGNvbnRyb2xBY3RpdmF0aW9uKSB7XG4gICAgdmFyIGFydGJvYXJkID0gdGhpcy5nZXRBcnRib2FyZFJlY3QoKVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgaXNBbnl0aGluZ1JvdGF0aW5nOiB0aGlzLnN0YXRlLmlzS2V5Q29tbWFuZERvd24sXG4gICAgICBpc0FueXRoaW5nU2NhbGluZzogIXRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93bixcbiAgICAgIGNvbnRyb2xBY3RpdmF0aW9uOiB7XG4gICAgICAgIHNoaWZ0OiB0aGlzLnN0YXRlLmlzS2V5U2hpZnREb3duLFxuICAgICAgICBjdHJsOiB0aGlzLnN0YXRlLmlzS2V5Q3RybERvd24sXG4gICAgICAgIGNtZDogdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLFxuICAgICAgICBhbHQ6IHRoaXMuc3RhdGUuaXNLZXlBbHREb3duLFxuICAgICAgICBpbmRleDogY29udHJvbEFjdGl2YXRpb24uaW5kZXgsXG4gICAgICAgIGFyYm9hcmQ6IGFydGJvYXJkLFxuICAgICAgICBjbGllbnQ6IHtcbiAgICAgICAgICB4OiBjb250cm9sQWN0aXZhdGlvbi5ldmVudC5jbGllbnRYLFxuICAgICAgICAgIHk6IGNvbnRyb2xBY3RpdmF0aW9uLmV2ZW50LmNsaWVudFlcbiAgICAgICAgfSxcbiAgICAgICAgY29vcmRzOiB7XG4gICAgICAgICAgeDogY29udHJvbEFjdGl2YXRpb24uZXZlbnQuY2xpZW50WCAtIGFydGJvYXJkLmxlZnQsXG4gICAgICAgICAgeTogY29udHJvbEFjdGl2YXRpb24uZXZlbnQuY2xpZW50WSAtIGFydGJvYXJkLnRvcFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHN0b3JlQW5kUmV0dXJuTW91c2VQb3NpdGlvbiAobW91c2VFdmVudCwgYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZSkge1xuICAgIGlmICghdGhpcy5yZWZzLmNvbnRhaW5lcikgcmV0dXJuIG51bGwgLy8gV2UgaGF2ZW4ndCBtb3VudGVkIHlldCwgbm8gc2l6ZSBhdmFpbGFibGVcbiAgICB0aGlzLnN0YXRlLm1vdXNlUG9zaXRpb25QcmV2aW91cyA9IHRoaXMuc3RhdGUubW91c2VQb3NpdGlvbkN1cnJlbnRcbiAgICBjb25zdCBtb3VzZVBvc2l0aW9uQ3VycmVudCA9IGdldExvY2FsRG9tRXZlbnRQb3NpdGlvbihtb3VzZUV2ZW50Lm5hdGl2ZUV2ZW50LCB0aGlzLnJlZnMuY29udGFpbmVyKVxuICAgIG1vdXNlUG9zaXRpb25DdXJyZW50LmNsaWVudFggPSBtb3VzZUV2ZW50Lm5hdGl2ZUV2ZW50LmNsaWVudFhcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC5jbGllbnRZID0gbW91c2VFdmVudC5uYXRpdmVFdmVudC5jbGllbnRZXG4gICAgbW91c2VQb3NpdGlvbkN1cnJlbnQueCAtPSB0aGlzLmdldEFydGJvYXJkUmVjdCgpLmxlZnRcbiAgICBtb3VzZVBvc2l0aW9uQ3VycmVudC55IC09IHRoaXMuZ2V0QXJ0Ym9hcmRSZWN0KCkudG9wXG4gICAgdGhpcy5zdGF0ZS5tb3VzZVBvc2l0aW9uQ3VycmVudCA9IG1vdXNlUG9zaXRpb25DdXJyZW50XG4gICAgaWYgKGFkZGl0aW9uYWxQb3NpdGlvblRyYWNraW5nU3RhdGUpIHRoaXMuc3RhdGVbYWRkaXRpb25hbFBvc2l0aW9uVHJhY2tpbmdTdGF0ZV0gPSBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICAgIHJldHVybiBtb3VzZVBvc2l0aW9uQ3VycmVudFxuICB9XG5cbiAgZHJhd092ZXJsYXlzIChmb3JjZSkge1xuICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuc2VsZWN0ZWQuYWxsKClcbiAgICBpZiAoZm9yY2UgfHwgc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2hhaWt1UmVuZGVyZXIuY3JlYXRlQ29udGFpbmVyKHRoaXMucmVmcy5vdmVybGF5KVxuICAgICAgdmFyIHBhcnRzID0gdGhpcy5idWlsZERyYXduT3ZlcmxheXMoKVxuICAgICAgdmFyIG92ZXJsYXkgPSB7XG4gICAgICAgIGVsZW1lbnROYW1lOiAnZGl2JyxcbiAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgIGlkOiAnaGFpa3UtZ2xhc3Mtb3ZlcmxheS1yb290JyxcbiAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgdHJhbnNmb3JtOiAnbWF0cml4M2QoMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsMCwwLDAsMSknLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgICAgbGVmdDogdGhpcy5zdGF0ZS5tb3VudFggKyAncHgnLFxuICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSArICdweCcsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VudFdpZHRoICsgJ3B4JyxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodCArICdweCdcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNoaWxkcmVuOiBwYXJ0c1xuICAgICAgfVxuICAgICAgdGhpcy5faGFpa3VSZW5kZXJlci5yZW5kZXIodGhpcy5yZWZzLm92ZXJsYXksIGNvbnRhaW5lciwgb3ZlcmxheSwgdGhpcy5faGFpa3VDb250ZXh0LmNvbXBvbmVudCwgZmFsc2UpXG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyBtZXRob2QgY3JlYXRlcyBvYmplY3RzIHdoaWNoIHJlcHJlc2VudCBIYWlrdSBQbGF5ZXIgcmVuZGVyaW5nIGluc3RydWN0aW9ucyBmb3IgZGlzcGxheWluZyBhbGwgb2ZcbiAgLy8gdGhlIHZpc3VhbCBlZmZlY3RzIHRoYXQgc2l0IGFib3ZlIHRoZSBzdGFnZS4gKFRyYW5zZm9ybSBjb250cm9scywgZXRjLikgVGhlIEhhaWt1IFBsYXllciBpcyBzb3J0IG9mIGFcbiAgLy8gaHlicmlkIG9mIFJlYWN0IEZpYmVyIGFuZCBGYW1vdXMgRW5naW5lLiBJdCBoYXMgYSB2aXJ0dWFsIERPTSB0cmVlIG9mIGVsZW1lbnRzIGxpa2Uge2VsZW1lbnROYW1lOiAnZGl2JywgYXR0cmlidXRlczoge30sIFtdfSxcbiAgLy8gYW5kIGZsdXNoZXMgdXBkYXRlcyB0byB0aGVtIG9uIGVhY2ggZnJhbWUuIFNvIHdoYXQgX3RoaXMgbWV0aG9kXyBkb2VzIGlzIGp1c3QgYnVpbGQgdGhvc2Ugb2JqZWN0cyBhbmQgdGhlblxuICAvLyB0aGVzZSBnZXQgcGFzc2VkIGludG8gYSBIYWlrdSBQbGF5ZXIgcmVuZGVyIG1ldGhvZCAoc2VlIGFib3ZlKS4gTE9ORyBTVE9SWSBTSE9SVDogVGhpcyBjcmVhdGVzIGEgZmxhdCBsaXN0IG9mXG4gIC8vIG5vZGVzIHRoYXQgZ2V0IHJlbmRlcmVkIHRvIHRoZSBET00gYnkgdGhlIEhhaWt1IFBsYXllci5cbiAgYnVpbGREcmF3bk92ZXJsYXlzICgpIHtcbiAgICB2YXIgb3ZlcmxheXMgPSBbXVxuICAgIC8vIERvbid0IHNob3cgYW55IG92ZXJsYXlzIGlmIHdlJ3JlIGluIHByZXZpZXcgKGFrYSAnbGl2ZScpIGludGVyYWN0aW9uTW9kZVxuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgcmV0dXJuIG92ZXJsYXlzXG4gICAgfVxuICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuc2VsZWN0ZWQuYWxsKClcbiAgICBpZiAoc2VsZWN0ZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIHBvaW50c1xuICAgICAgaWYgKHNlbGVjdGVkLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IHNlbGVjdGVkWzBdXG4gICAgICAgIGlmIChlbGVtZW50LmlzUmVuZGVyYWJsZVR5cGUoKSkge1xuICAgICAgICAgIHBvaW50cyA9IGVsZW1lbnQuZ2V0UG9pbnRzVHJhbnNmb3JtZWQodHJ1ZSlcbiAgICAgICAgICB0aGlzLnJlbmRlck1vcnBoUG9pbnRzT3ZlcmxheShwb2ludHMsIG92ZXJsYXlzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBvaW50cyA9IGVsZW1lbnQuZ2V0Qm94UG9pbnRzVHJhbnNmb3JtZWQoKVxuICAgICAgICAgIHZhciByb3RhdGlvblogPSBlbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3JvdGF0aW9uLnonKSB8fCAwXG4gICAgICAgICAgdmFyIHNjYWxlWCA9IGVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueCcpXG4gICAgICAgICAgaWYgKHNjYWxlWCA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWCA9PT0gbnVsbCkgc2NhbGVYID0gMVxuICAgICAgICAgIHZhciBzY2FsZVkgPSBlbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLnknKVxuICAgICAgICAgIGlmIChzY2FsZVkgPT09IHVuZGVmaW5lZCB8fCBzY2FsZVkgPT09IG51bGwpIHNjYWxlWSA9IDFcbiAgICAgICAgICB0aGlzLnJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkocG9pbnRzLCBvdmVybGF5cywgZWxlbWVudC5jYW5Sb3RhdGUoKSwgdGhpcy5zdGF0ZS5pc0tleUNvbW1hbmREb3duLCB0cnVlLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwb2ludHMgPSBbXVxuICAgICAgICBzZWxlY3RlZC5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgZWxlbWVudC5nZXRCb3hQb2ludHNUcmFuc2Zvcm1lZCgpLmZvckVhY2goKHBvaW50KSA9PiBwb2ludHMucHVzaChwb2ludCkpXG4gICAgICAgIH0pXG4gICAgICAgIHBvaW50cyA9IHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMuZ2V0Qm91bmRpbmdCb3hQb2ludHMocG9pbnRzKVxuICAgICAgICB0aGlzLnJlbmRlclRyYW5zZm9ybUJveE92ZXJsYXkocG9pbnRzLCBvdmVybGF5cywgZmFsc2UsIHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93biwgZmFsc2UsIDAsIDEsIDEpXG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc01vdXNlRHJhZ2dpbmcpIHtcbiAgICAgICAgLy8gVE9ETzogRHJhdyB0b29sdGlwIHdpdGggcG9pbnRzIGluZm9cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG92ZXJsYXlzXG4gIH1cblxuICByZW5kZXJNb3JwaFBvaW50c092ZXJsYXkgKHBvaW50cywgb3ZlcmxheXMpIHtcbiAgICBwb2ludHMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICBvdmVybGF5cy5wdXNoKHRoaXMucmVuZGVyQ29udHJvbFBvaW50KHBvaW50LngsIHBvaW50LnksIGluZGV4KSlcbiAgICB9KVxuICB9XG5cbiAgcmVuZGVyTGluZSAoeDEsIHkxLCB4MiwgeTIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZWxlbWVudE5hbWU6ICdzdmcnLFxuICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICBzdHlsZToge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgb3ZlcmZsb3c6ICd2aXNpYmxlJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY2hpbGRyZW46IFt7XG4gICAgICAgIGVsZW1lbnROYW1lOiAnbGluZScsXG4gICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICB4MTogeDEsXG4gICAgICAgICAgeTE6IHkxLFxuICAgICAgICAgIHgyOiB4MixcbiAgICAgICAgICB5MjogeTIsXG4gICAgICAgICAgc3Ryb2tlOiBQYWxldHRlLkRBUktFUl9ST0NLMixcbiAgICAgICAgICAnc3Ryb2tlLXdpZHRoJzogJzFweCcsXG4gICAgICAgICAgJ3ZlY3Rvci1lZmZlY3QnOiAnbm9uLXNjYWxpbmctc3Ryb2tlJ1xuICAgICAgICB9XG4gICAgICB9XVxuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xQb2ludExpc3RlbmVyIChldmVudE5hbWUsIHBvaW50SW5kZXgpIHtcbiAgICAvLyBDYWNoaW5nIHRoZXNlIGFzIG9wcG9zZWQgdG8gY3JlYXRpbmcgbmV3IGZ1bmN0aW9ucyBodW5kcmVkcyBvZiB0aW1lc1xuICAgIGlmICghdGhpcy5fY29udHJvbFBvaW50TGlzdGVuZXJzKSB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnMgPSB7fVxuICAgIGNvbnN0IGNvbnRyb2xLZXkgPSBldmVudE5hbWUgKyAnLScgKyBwb2ludEluZGV4XG4gICAgaWYgKCF0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV0pIHtcbiAgICAgIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XSA9IChsaXN0ZW5lckV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuY29udHJvbEFjdGl2YXRpb24oe1xuICAgICAgICAgIGluZGV4OiBwb2ludEluZGV4LFxuICAgICAgICAgIGV2ZW50OiBsaXN0ZW5lckV2ZW50XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICB0aGlzLl9jb250cm9sUG9pbnRMaXN0ZW5lcnNbY29udHJvbEtleV0uY29udHJvbEtleSA9IGNvbnRyb2xLZXlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRyb2xQb2ludExpc3RlbmVyc1tjb250cm9sS2V5XVxuICB9XG5cbiAgcmVuZGVyQ29udHJvbFBvaW50ICh4LCB5LCBpbmRleCwgaGFuZGxlQ2xhc3MpIHtcbiAgICB2YXIgc2NhbGUgPSAxIC8gKHRoaXMuc3RhdGUuem9vbVhZIHx8IDEpXG4gICAgcmV0dXJuIHtcbiAgICAgIGVsZW1lbnROYW1lOiAnZGl2JyxcbiAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAga2V5OiAnY29udHJvbC1wb2ludC0nICsgaW5kZXgsXG4gICAgICAgIGNsYXNzOiBoYW5kbGVDbGFzcyB8fCAnJyxcbiAgICAgICAgb25tb3VzZWRvd246IHRoaXMuY3JlYXRlQ29udHJvbFBvaW50TGlzdGVuZXIoJ21vdXNlZG93bicsIGluZGV4KSxcbiAgICAgICAgc3R5bGU6IHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlfSwke3NjYWxlfSlgLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJyxcbiAgICAgICAgICBsZWZ0OiAoeCAtIDMuNSkgKyAncHgnLFxuICAgICAgICAgIHRvcDogKHkgLSAzLjUpICsgJ3B4JyxcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS0VSX1JPQ0syLFxuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgICAgIGJveFNoYWRvdzogJzAgMnB4IDZweCAwICcgKyBQYWxldHRlLlNIQURZLCAvLyBUT0RPOiBhY2NvdW50IGZvciByb3RhdGlvblxuICAgICAgICAgIHdpZHRoOiAnN3B4JyxcbiAgICAgICAgICBoZWlnaHQ6ICc3cHgnLFxuICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJSdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBlbGVtZW50TmFtZTogJ2RpdicsXG4gICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAga2V5OiAnY29udHJvbC1wb2ludC1oaXQtYXJlYS0nICsgaW5kZXgsXG4gICAgICAgICAgICBjbGFzczogaGFuZGxlQ2xhc3MgfHwgJycsXG4gICAgICAgICAgICBzdHlsZToge1xuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ2F1dG8nLFxuICAgICAgICAgICAgICBsZWZ0OiAnLTE1cHgnLFxuICAgICAgICAgICAgICB0b3A6ICctMTVweCcsXG4gICAgICAgICAgICAgIHdpZHRoOiAnMzBweCcsXG4gICAgICAgICAgICAgIGhlaWdodDogJzMwcHgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICB9XG5cbiAgZ2V0SGFuZGxlQ2xhc3MgKGluZGV4LCBjYW5Sb3RhdGUsIGlzUm90YXRpb25Nb2RlT24sIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpIHtcbiAgICB2YXIgZGVmYXVsdFBvaW50R3JvdXAgPSBDTE9DS1dJU0VfQ09OVFJPTF9QT0lOVFNbMF1cbiAgICB2YXIgaW5kZXhPZlBvaW50ID0gZGVmYXVsdFBvaW50R3JvdXAuaW5kZXhPZihpbmRleClcblxuICAgIHZhciBrZXlPZlBvaW50R3JvdXBcbiAgICBpZiAoc2NhbGVYID49IDAgJiYgc2NhbGVZID49IDApIGtleU9mUG9pbnRHcm91cCA9IDAgLy8gZGVmYXVsdFxuICAgIGVsc2UgaWYgKHNjYWxlWCA+PSAwICYmIHNjYWxlWSA8IDApIGtleU9mUG9pbnRHcm91cCA9IDEgLy8gZmxpcHBlZCB2ZXJ0aWNhbGx5XG4gICAgZWxzZSBpZiAoc2NhbGVYIDwgMCAmJiBzY2FsZVkgPj0gMCkga2V5T2ZQb2ludEdyb3VwID0gMiAvLyBmbGlwcGVkIGhvcml6b250YWxseVxuICAgIGVsc2UgaWYgKHNjYWxlWCA8IDAgJiYgc2NhbGVZIDwgMCkga2V5T2ZQb2ludEdyb3VwID0gMyAvLyBmbGlwcGVkIGhvcml6b250YWxseSBhbmQgdmVydGljYWxseVxuXG4gICAgaWYgKGtleU9mUG9pbnRHcm91cCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBkZXRlcm1pbmUgaGFuZGxlIGNsYXNzIGR1ZSB0byBiYWQgc2NhbGUgdmFsdWVzJylcbiAgICB9XG5cbiAgICB2YXIgc3BlY2lmaWVkUG9pbnRHcm91cCA9IENMT0NLV0lTRV9DT05UUk9MX1BPSU5UU1trZXlPZlBvaW50R3JvdXBdXG5cbiAgICB2YXIgcm90YXRpb25EZWdyZWVzID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5nZXRSb3RhdGlvbkluMzYwKHJvdGF0aW9uWilcbiAgICAvLyBFYWNoIDQ1IGRlZ3JlZSB0dXJuIHdpbGwgZXF1YXRlIHRvIGEgcGhhc2UgY2hhbmdlIG9mIDEsIGFuZCB0aGF0IHBoYXNlIGNvcnJlc3BvbmRzIHRvXG4gICAgLy8gYSBzdGFydGluZyBpbmRleCBmb3IgdGhlIGNvbnRyb2wgcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICAgIHZhciBwaGFzZU51bWJlciA9IH5+KChyb3RhdGlvbkRlZ3JlZXMgKyAyMi41KSAvIDQ1KSAlIHNwZWNpZmllZFBvaW50R3JvdXAubGVuZ3RoXG4gICAgdmFyIG9mZnNldEluZGV4ID0gKGluZGV4T2ZQb2ludCArIHBoYXNlTnVtYmVyKSAlIHNwZWNpZmllZFBvaW50R3JvdXAubGVuZ3RoXG4gICAgdmFyIHNoaWZ0ZWRJbmRleCA9IHNwZWNpZmllZFBvaW50R3JvdXBbb2Zmc2V0SW5kZXhdXG5cbiAgICAvLyBUaGVzZSBjbGFzcyBuYW1lcyBhcmUgZGVmaW5lZCBpbiBnbG9iYWwuY3NzOyB0aGUgaW5kaWNlcyBpbmRpY2F0ZSB0aGUgY29ycmVzcG9uZGluZyBwb2ludHNcbiAgICBpZiAoY2FuUm90YXRlICYmIGlzUm90YXRpb25Nb2RlT24pIHtcbiAgICAgIHJldHVybiBgcm90YXRlLWN1cnNvci0ke3NoaWZ0ZWRJbmRleH1gXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgc2NhbGUtY3Vyc29yLSR7c2hpZnRlZEluZGV4fWBcbiAgICB9XG4gIH1cblxuICByZW5kZXJUcmFuc2Zvcm1Cb3hPdmVybGF5IChwb2ludHMsIG92ZXJsYXlzLCBjYW5Sb3RhdGUsIGlzUm90YXRpb25Nb2RlT24sIGNhbkNvbnRyb2xIYW5kbGVzLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKSB7XG4gICAgdmFyIGNvcm5lcnMgPSBbcG9pbnRzWzBdLCBwb2ludHNbMl0sIHBvaW50c1s4XSwgcG9pbnRzWzZdXVxuICAgIGNvcm5lcnMuZm9yRWFjaCgocG9pbnQsIGluZGV4KSA9PiB7XG4gICAgICB2YXIgbmV4dCA9IGNvcm5lcnNbKGluZGV4ICsgMSkgJSBjb3JuZXJzLmxlbmd0aF1cbiAgICAgIG92ZXJsYXlzLnB1c2godGhpcy5yZW5kZXJMaW5lKHBvaW50LngsIHBvaW50LnksIG5leHQueCwgbmV4dC55KSlcbiAgICB9KVxuICAgIHBvaW50cy5mb3JFYWNoKChwb2ludCwgaW5kZXgpID0+IHtcbiAgICAgIGlmIChpbmRleCAhPT0gNCkge1xuICAgICAgICBvdmVybGF5cy5wdXNoKHRoaXMucmVuZGVyQ29udHJvbFBvaW50KHBvaW50LngsIHBvaW50LnksIGluZGV4LCBjYW5Db250cm9sSGFuZGxlcyAmJiB0aGlzLmdldEhhbmRsZUNsYXNzKGluZGV4LCBjYW5Sb3RhdGUsIGlzUm90YXRpb25Nb2RlT24sIHJvdGF0aW9uWiwgc2NhbGVYLCBzY2FsZVkpKSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZ2V0R2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3MgKCkge1xuICAgIGlmICghdGhpcy5zdGF0ZS5jb250cm9sQWN0aXZhdGlvbikgcmV0dXJuICcnXG4gICAgdmFyIGNvbnRyb2xJbmRleCA9IHRoaXMuc3RhdGUuY29udHJvbEFjdGl2YXRpb24uaW5kZXhcbiAgICB2YXIgaXNSb3RhdGlvbk1vZGVPbiA9IHRoaXMuc3RhdGUuaXNLZXlDb21tYW5kRG93blxuICAgIHZhciBzZWxlY3RlZEVsZW1lbnRzID0gdGhpcy5fY29tcG9uZW50Ll9lbGVtZW50cy5zZWxlY3RlZC5hbGwoKVxuICAgIGlmIChzZWxlY3RlZEVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHNlbGVjdGVkRWxlbWVudCA9IHNlbGVjdGVkRWxlbWVudHNbMF1cbiAgICAgIHZhciByb3RhdGlvblogPSBzZWxlY3RlZEVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgncm90YXRpb24ueicpIHx8IDBcbiAgICAgIHZhciBzY2FsZVggPSBzZWxlY3RlZEVsZW1lbnQuZ2V0UHJvcGVydHlWYWx1ZSgnc2NhbGUueCcpXG4gICAgICBpZiAoc2NhbGVYID09PSB1bmRlZmluZWQgfHwgc2NhbGVYID09PSBudWxsKSBzY2FsZVggPSAxXG4gICAgICB2YXIgc2NhbGVZID0gc2VsZWN0ZWRFbGVtZW50LmdldFByb3BlcnR5VmFsdWUoJ3NjYWxlLnknKVxuICAgICAgaWYgKHNjYWxlWSA9PT0gdW5kZWZpbmVkIHx8IHNjYWxlWSA9PT0gbnVsbCkgc2NhbGVZID0gMVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0SGFuZGxlQ2xhc3MoY29udHJvbEluZGV4LCB0cnVlLCBpc1JvdGF0aW9uTW9kZU9uLCByb3RhdGlvblosIHNjYWxlWCwgc2NhbGVZKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRIYW5kbGVDbGFzcyhjb250cm9sSW5kZXgsIGZhbHNlLCBpc1JvdGF0aW9uTW9kZU9uLCAwLCAxLCAxKVxuICAgIH1cbiAgfVxuXG4gIGdldFN0YWdlVHJhbnNmb3JtICgpIHtcbiAgICB2YXIgYSA9IHRoaXMuc3RhdGUuem9vbVhZIHx8IDFcbiAgICB2YXIgYyA9IHRoaXMuc3RhdGUucGFuWCB8fCAwXG4gICAgdmFyIGQgPSB0aGlzLnN0YXRlLnBhblkgfHwgMFxuXG4gICAgcmV0dXJuICdtYXRyaXgzZCgnICtcbiAgICAgIFthLCAwLCAwLCAwLFxuICAgICAgICAwLCBhLCAwLCAwLFxuICAgICAgICAwLCAwLCAxLCAwLFxuICAgICAgICBjLCBkLCAwLCAxXS5qb2luKCcsJykgKyAnKSdcbiAgfVxuXG4gIGlzUHJldmlld01vZGUgKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnQuX2ludGVyYWN0aW9uTW9kZS50eXBlID09PSAnbGl2ZSdcbiAgfVxuXG4gIGdldEN1cnNvckNzc1J1bGUgKCkge1xuICAgIGlmICh0aGlzLmlzUHJldmlld01vZGUoKSkgcmV0dXJuICdkZWZhdWx0J1xuICAgIHJldHVybiAodGhpcy5zdGF0ZS5zdGFnZU1vdXNlRG93bikgPyAnLXdlYmtpdC1ncmFiYmluZycgOiAnLXdlYmtpdC1ncmFiJ1xuICB9XG5cbiAgcmVuZGVyICgpIHtcbiAgICB2YXIgZHJhd2luZ0NsYXNzTmFtZSA9ICh0aGlzLnN0YXRlLmFjdGl2ZURyYXdpbmdUb29sICE9PSAncG9pbnRlcicpID8gJ2RyYXctc2hhcGUnIDogJydcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIG9uTW91c2VPdmVyPXsoKSA9PiB0aGlzLnNldFN0YXRlKHsgaXNLZXlDb21tYW5kRG93bjogZmFsc2UgfSl9PlxuXG4gICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgICAgICAgIHRvcDogNSxcbiAgICAgICAgICAgICAgcmlnaHQ6IDEwLFxuICAgICAgICAgICAgICB6SW5kZXg6IDEwMDAwMCxcbiAgICAgICAgICAgICAgY29sb3I6ICcjY2NjJyxcbiAgICAgICAgICAgICAgZm9udFNpemU6IDE0XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIHtNYXRoLnJvdW5kKHRoaXMuc3RhdGUuem9vbVhZIC8gMSAqIDEwMCl9JVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgOiAnJ31cblxuICAgICAgICA8ZGl2XG4gICAgICAgICAgcmVmPSdjb250YWluZXInXG4gICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLWNvbnRhaW5lcidcbiAgICAgICAgICBjbGFzc05hbWU9e3RoaXMuZ2V0R2xvYmFsQ29udHJvbFBvaW50SGFuZGxlQ2xhc3MoKX1cbiAgICAgICAgICBvbk1vdXNlRG93bj17KG1vdXNlRG93bikgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgICAgICAgICBpZiAobW91c2VEb3duLm5hdGl2ZUV2ZW50LnRhcmdldCAmJiBtb3VzZURvd24ubmF0aXZlRXZlbnQudGFyZ2V0LmlkID09PSAnZnVsbC1iYWNrZ3JvdW5kJykge1xuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudC5fZWxlbWVudHMudW5zZWxlY3RBbGxFbGVtZW50cyh7IGZyb206ICdnbGFzcycgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpZiAodGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGVFdmVudEhhbmRsZXJzRWRpdG9yKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBhblg6IHRoaXMuc3RhdGUucGFuWCxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbFBhblk6IHRoaXMuc3RhdGUucGFuWSxcbiAgICAgICAgICAgICAgICBzdGFnZU1vdXNlRG93bjoge1xuICAgICAgICAgICAgICAgICAgeDogbW91c2VEb3duLm5hdGl2ZUV2ZW50LmNsaWVudFgsXG4gICAgICAgICAgICAgICAgICB5OiBtb3VzZURvd24ubmF0aXZlRXZlbnQuY2xpZW50WVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VVcD17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3RhZ2VNb3VzZURvd246IG51bGwgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIG9uTW91c2VMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzUHJldmlld01vZGUoKSkge1xuICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgc3RhZ2VNb3VzZURvd246IG51bGwgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsIC8vIFRPRE86ICBpZi93aGVuIHdlIHN1cHBvcnQgbmF0aXZlIHNjcm9sbGluZyBoZXJlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSdsbCBuZWVkIHRvIGZpZ3VyZSBvdXQgc29tZSBwaGFudG9tIHJlZmxvd2luZy9qaXR0ZXIgaXNzdWVzXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMuZ2V0U3RhZ2VUcmFuc2Zvcm0oKSxcbiAgICAgICAgICAgIGN1cnNvcjogdGhpcy5nZXRDdXJzb3JDc3NSdWxlKCksXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICh0aGlzLmlzUHJldmlld01vZGUoKSkgPyAnd2hpdGUnIDogJ2luaGVyaXQnXG4gICAgICAgICAgfX0+XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3Mtc3RhZ2UtYmFja2dyb3VuZC1saXZlJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHdpZHRoOiB0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRoLFxuICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHRcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxkZWZzPlxuICAgICAgICAgICAgICAgIDxmaWx0ZXIgaWQ9J2JhY2tncm91bmQtYmx1cicgeD0nLTUwJScgeT0nLTUwJScgd2lkdGg9JzIwMCUnIGhlaWdodD0nMjAwJSc+XG4gICAgICAgICAgICAgICAgICA8ZmVHYXVzc2lhbkJsdXIgaW49J1NvdXJjZUFscGhhJyBzdGREZXZpYXRpb249JzInIHJlc3VsdD0nYmx1cicgLz5cbiAgICAgICAgICAgICAgICAgIDxmZUZsb29kIGZsb29kQ29sb3I9J3JnYmEoMzMsIDQ1LCA0OSwgLjUpJyBmbG9vZE9wYWNpdHk9JzAuOCcgcmVzdWx0PSdvZmZzZXRDb2xvcicgLz5cbiAgICAgICAgICAgICAgICAgIDxmZUNvbXBvc2l0ZSBpbj0nb2Zmc2V0Q29sb3InIGluMj0nYmx1cicgb3BlcmF0b3I9J2luJyByZXN1bHQ9J3RvdGFsQmx1cicgLz5cbiAgICAgICAgICAgICAgICAgIDxmZUJsZW5kIGluPSdTb3VyY2VHcmFwaGljJyBpbjI9J3RvdGFsQmx1cicgbW9kZT0nbm9ybWFsJyAvPlxuICAgICAgICAgICAgICAgIDwvZmlsdGVyPlxuICAgICAgICAgICAgICA8L2RlZnM+XG4gICAgICAgICAgICAgIDxyZWN0IGlkPSdmdWxsLWJhY2tncm91bmQnIHg9JzAnIHk9JzAnIHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9J3RyYW5zcGFyZW50JyAvPlxuICAgICAgICAgICAgICA8cmVjdCBpZD0nbW91bnQtYmFja2dyb3VuZC1ibHVyJyBmaWx0ZXI9J3VybCgjYmFja2dyb3VuZC1ibHVyKScgeD17dGhpcy5zdGF0ZS5tb3VudFh9IHk9e3RoaXMuc3RhdGUubW91bnRZfSB3aWR0aD17dGhpcy5zdGF0ZS5tb3VudFdpZHRofSBoZWlnaHQ9e3RoaXMuc3RhdGUubW91bnRIZWlnaHR9IGZpbGw9J3doaXRlJyAvPlxuICAgICAgICAgICAgICA8cmVjdCBpZD0nbW91bnQtYmFja2dyb3VuZCcgeD17dGhpcy5zdGF0ZS5tb3VudFh9IHk9e3RoaXMuc3RhdGUubW91bnRZfSB3aWR0aD17dGhpcy5zdGF0ZS5tb3VudFdpZHRofSBoZWlnaHQ9e3RoaXMuc3RhdGUubW91bnRIZWlnaHR9IGZpbGw9J3doaXRlJyAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6IDxkaXZcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLWJhY2tncm91bmQtcHJldmlldydcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0XG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLXN0YWdlLWJhY2tncm91bmQtcHJldmlldy1ib3JkZXInXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgdG9wOiB0aGlzLnN0YXRlLm1vdW50WSxcbiAgICAgICAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUubW91bnRXaWR0aCxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5zdGF0ZS5tb3VudEhlaWdodCxcbiAgICAgICAgICAgICAgICAgIGJvcmRlcjogJzFweCBkb3R0ZWQgI2JiYicsXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcycHgnXG4gICAgICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgICAgIDwvZGl2Pn1cblxuICAgICAgICAgIHsoIXRoaXMuaXNQcmV2aWV3TW9kZSgpKVxuICAgICAgICAgICAgPyA8c3ZnXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1zdGFnZS10aXRsZS10ZXh0LWNvbnRhaW5lcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwLFxuICAgICAgICAgICAgICAgIHRvcDogdGhpcy5zdGF0ZS5tb3VudFkgLSAxOSxcbiAgICAgICAgICAgICAgICBsZWZ0OiB0aGlzLnN0YXRlLm1vdW50WCArIDIsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMTIwLFxuICAgICAgICAgICAgICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdkZWZhdWx0J1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrU3RhZ2VOYW1lLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIG9uTW91c2VPdmVyPXt0aGlzLmhhbmRsZU1vdXNlT3ZlclN0YWdlTmFtZS5iaW5kKHRoaXMpfVxuICAgICAgICAgICAgICBvbk1vdXNlT3V0PXt0aGlzLmhhbmRsZU1vdXNlT3V0U3RhZ2VOYW1lLmJpbmQodGhpcyl9PlxuICAgICAgICAgICAgICA8dGV4dFxuICAgICAgICAgICAgICAgIHk9JzEzJ1xuICAgICAgICAgICAgICAgIGlkPSdwcm9qZWN0LW5hbWUnXG4gICAgICAgICAgICAgICAgZmlsbD17UGFsZXR0ZS5GQVRIRVJfQ09BTH1cbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0PSdsaWdodGVyJ1xuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk9J0ZpcmEgU2FucydcbiAgICAgICAgICAgICAgICBmb250U2l6ZT0nMTMnPlxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnByb2plY3ROYW1lfVxuICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPHN2Z1xuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3MtYmFja2dyb3VuZC1jb2xvcmF0b3InXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgekluZGV4OiAyMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aCxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0LFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPHBhdGggZD17YE0wLDBWJHt0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodH1IJHt0aGlzLnN0YXRlLmNvbnRhaW5lcldpZHRofVYwWk0ke3RoaXMuc3RhdGUubW91bnRYICsgdGhpcy5zdGF0ZS5tb3VudFdpZHRofSwke3RoaXMuc3RhdGUubW91bnRZICsgdGhpcy5zdGF0ZS5tb3VudEhlaWdodH1IJHt0aGlzLnN0YXRlLm1vdW50WH1WJHt0aGlzLnN0YXRlLm1vdW50WX1IJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH1aYH1cbiAgICAgICAgICAgICAgICBzdHlsZT17eydmaWxsJzogJyMxMTEnLCAnb3BhY2l0eSc6IDAuMSwgJ3BvaW50ZXJFdmVudHMnOiAnbm9uZSd9fSAvPlxuICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkpXG4gICAgICAgICAgICA/IDxzdmdcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLW1vYXQtb3BhY2l0YXRvcidcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDEwMTAsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMuc3RhdGUuY29udGFpbmVyV2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLnN0YXRlLmNvbnRhaW5lckhlaWdodCxcbiAgICAgICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnbm9uZSdcbiAgICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgIDxwYXRoIGQ9e2BNMCwwViR7dGhpcy5zdGF0ZS5jb250YWluZXJIZWlnaHR9SCR7dGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aH1WMFpNJHt0aGlzLnN0YXRlLm1vdW50WCArIHRoaXMuc3RhdGUubW91bnRXaWR0aH0sJHt0aGlzLnN0YXRlLm1vdW50WSArIHRoaXMuc3RhdGUubW91bnRIZWlnaHR9SCR7dGhpcy5zdGF0ZS5tb3VudFh9ViR7dGhpcy5zdGF0ZS5tb3VudFl9SCR7dGhpcy5zdGF0ZS5tb3VudFggKyB0aGlzLnN0YXRlLm1vdW50V2lkdGh9WmB9XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICdmaWxsJzogJyNGRkYnLFxuICAgICAgICAgICAgICAgICAgJ29wYWNpdHknOiAwLjUsXG4gICAgICAgICAgICAgICAgICAncG9pbnRlckV2ZW50cyc6ICdub25lJ1xuICAgICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICAgIDxyZWN0XG4gICAgICAgICAgICAgICAgeD17dGhpcy5zdGF0ZS5tb3VudFggLSAxfVxuICAgICAgICAgICAgICAgIHk9e3RoaXMuc3RhdGUubW91bnRZIC0gMX1cbiAgICAgICAgICAgICAgICB3aWR0aD17dGhpcy5zdGF0ZS5tb3VudFdpZHRoICsgMn1cbiAgICAgICAgICAgICAgICBoZWlnaHQ9e3RoaXMuc3RhdGUubW91bnRIZWlnaHQgKyAyfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMS41LFxuICAgICAgICAgICAgICAgICAgZmlsbDogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBQYWxldHRlLkxJR0hUX1BJTkssXG4gICAgICAgICAgICAgICAgICBvcGFjaXR5OiB0aGlzLnN0YXRlLmlzU3RhZ2VOYW1lSG92ZXJpbmcgJiYgIXRoaXMuc3RhdGUuaXNTdGFnZVNlbGVjdGVkID8gMC43NSA6IDBcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSAmJiB0aGlzLnN0YXRlLmRvU2hvd0NvbW1lbnRzICYmIHRoaXMuc3RhdGUuY29tbWVudHMubGVuZ3RoID4gMClcbiAgICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgICBpZD0naGFpa3UtZ2xhc3MtY29tbWVudHMtY29udGFpbmVyJ1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICAgICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDIwMDAsXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAnMTAwJScgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmNvbW1lbnRzLm1hcCgoY29tbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gPENvbW1lbnQgaW5kZXg9e2luZGV4fSBjb21tZW50PXtjb21tZW50fSBrZXk9e2Bjb21tZW50LSR7Y29tbWVudC5pZH1gfSBtb2RlbD17dGhpcy5fY29tbWVudHN9IC8+XG4gICAgICAgICAgICAgIH0pfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgeyghdGhpcy5pc1ByZXZpZXdNb2RlKCkgJiYgdGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pXG4gICAgICAgICAgICA/IDxFdmVudEhhbmRsZXJFZGl0b3JcbiAgICAgICAgICAgICAgcmVmPSdldmVudEhhbmRsZXJFZGl0b3InXG4gICAgICAgICAgICAgIGVsZW1lbnQ9e3RoaXMuc3RhdGUudGFyZ2V0RWxlbWVudH1cbiAgICAgICAgICAgICAgc2F2ZT17dGhpcy5zYXZlRXZlbnRIYW5kbGVyLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgIGNsb3NlPXt0aGlzLmhpZGVFdmVudEhhbmRsZXJzRWRpdG9yLmJpbmQodGhpcyl9XG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDogJyd9XG5cbiAgICAgICAgICB7KCF0aGlzLmlzUHJldmlld01vZGUoKSlcbiAgICAgICAgICAgID8gPGRpdlxuICAgICAgICAgICAgICByZWY9J292ZXJsYXknXG4gICAgICAgICAgICAgIGlkPSdoYWlrdS1nbGFzcy1vdmVybGF5LW1vdW50J1xuICAgICAgICAgICAgICBoZWlnaHQ9e3RoaXMuc3RhdGUuY29udGFpbmVySGVpZ2h0fVxuICAgICAgICAgICAgICB3aWR0aD17dGhpcy5zdGF0ZS5jb250YWluZXJXaWR0aH1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06ICdtYXRyaXgzZCgxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCwwLDAsMCwxKScsXG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogJ25vbmUnLCAvLyBUaGlzIG5lZWRzIHRvIGJlIHVuLXNldCBmb3Igc3VyZmFjZSBlbGVtZW50cyB0aGF0IHRha2UgbW91c2UgaW50ZXJhY3Rpb25cbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ3Zpc2libGUnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICBsZWZ0OiAwLFxuICAgICAgICAgICAgICAgIHpJbmRleDogMTAwMCxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAodGhpcy5zdGF0ZS5pc0V2ZW50SGFuZGxlckVkaXRvck9wZW4pID8gMC41IDogMS4wXG4gICAgICAgICAgICAgIH19IC8+XG4gICAgICAgICAgICA6ICcnfVxuXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgcmVmPSdtb3VudCdcbiAgICAgICAgICAgIGlkPSdob3QtY29tcG9uZW50LW1vdW50J1xuICAgICAgICAgICAgY2xhc3NOYW1lPXtkcmF3aW5nQ2xhc3NOYW1lfVxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgIGxlZnQ6IHRoaXMuc3RhdGUubW91bnRYLFxuICAgICAgICAgICAgICB0b3A6IHRoaXMuc3RhdGUubW91bnRZLFxuICAgICAgICAgICAgICB3aWR0aDogdGhpcy5zdGF0ZS5tb3VudFdpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IHRoaXMuc3RhdGUubW91bnRIZWlnaHQsXG4gICAgICAgICAgICAgIG92ZXJmbG93OiAndmlzaWJsZScsXG4gICAgICAgICAgICAgIHpJbmRleDogNjAsXG4gICAgICAgICAgICAgIG9wYWNpdHk6ICh0aGlzLnN0YXRlLmlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbikgPyAwLjUgOiAxLjBcbiAgICAgICAgICAgIH19IC8+XG5cbiAgICAgICAgICB7KHRoaXMuc3RhdGUuZXJyb3IpXG4gICAgICAgICAgICA/IDxkaXZcbiAgICAgICAgICAgICAgaWQ9J2hhaWt1LWdsYXNzLWV4Y2VwdGlvbi1iYXInXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzNSxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuUkVELFxuICAgICAgICAgICAgICAgIGNvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgICAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICB6SW5kZXg6IDk5OTksXG4gICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc5cHggMjBweCAwJyxcbiAgICAgICAgICAgICAgICB3aGl0ZVNwYWNlOiAnbm93cmFwJ1xuICAgICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogUGFsZXR0ZS5SRURfREFSS0VSLFxuICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ0FyaWFsJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuUkVEX0RBUktFUixcbiAgICAgICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6IDE1LFxuICAgICAgICAgICAgICAgICAgcGFkZGluZ0xlZnQ6IDFcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlcnJvcjogbnVsbCB9KVxuICAgICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgICAgeFxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPjxzcGFuPnsnICd9PC9zcGFuPlxuICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5lcnJvcn1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgOiAnJ31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cblxuR2xhc3MucHJvcFR5cGVzID0ge1xuICB1c2VyY29uZmlnOiBSZWFjdC5Qcm9wVHlwZXMub2JqZWN0LFxuICB3ZWJzb2NrZXQ6IFJlYWN0LlByb3BUeXBlcy5vYmplY3QsXG4gIGZvbGRlcjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oR2xhc3MpXG4iXX0=