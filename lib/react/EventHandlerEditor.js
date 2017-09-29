'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/EventHandlerEditor.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _reactSelectPlus = require('react-select-plus');

var _truncate = require('./helpers/truncate');

var _truncate2 = _interopRequireDefault(_truncate);

var _parseExpression = require('haiku-serialization/src/ast/parseExpression');

var _parseExpression2 = _interopRequireDefault(_parseExpression);

var _marshalParams = require('@haiku/player/lib/reflection/marshalParams');

var _marshalParams2 = _interopRequireDefault(_marshalParams);

var _functionToRFO = require('@haiku/player/lib/reflection/functionToRFO');

var _functionToRFO2 = _interopRequireDefault(_functionToRFO);

var _reifyRFO = require('@haiku/player/lib/reflection/reifyRFO');

var _reifyRFO2 = _interopRequireDefault(_reifyRFO);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import AutoCompleter from './AutoCompleter'


var HaikuMode = require('./modes/haiku');

var EVALUATOR_STATES = {
  NONE: 1, // None means nothing to evaluate at all
  OPEN: 2, // Anything >= OPEN is also 'open'
  INFO: 3,
  WARN: 4,
  ERROR: 5
};

var NAVIGATION_DIRECTIONS = {
  SAME: 0,
  NEXT: +1,
  PREV: -1
};

var EDITOR_WIDTH = 500;
var EDITOR_HEIGHT = 300;
var EDITOR_LINE_HEIGHT = 18;

var MAX_AUTOCOMPLETION_ENTRIES = 8;

function mod(idx, max) {
  return (idx % max + max) % max;
}

function setOptions(opts) {
  for (var key in opts) {
    this.setOption(key, opts[key]);
  }return this;
}

function getRenderableValueMultiline(officialValue, skipFormatting) {
  // Update the editor contents
  var params = '';
  if (officialValue.params && officialValue.params.length > 0) {
    params = (0, _marshalParams2.default)(officialValue.params);
  }

  if (skipFormatting) {
    return 'function (' + params + ') {\n' + officialValue.body + '\n}';
  } else {
    return 'function (' + params + ') {\n  ' + officialValue.body + '\n}';
  }
}

var EventHandlerEditor = function (_React$Component) {
  _inherits(EventHandlerEditor, _React$Component);

  function EventHandlerEditor(props) {
    _classCallCheck(this, EventHandlerEditor);

    var _this = _possibleConstructorReturn(this, (EventHandlerEditor.__proto__ || Object.getPrototypeOf(EventHandlerEditor)).call(this, props));

    _this._context = null; // Our context element on which to mount codemirror

    _this.codemirror = (0, _codemirror2.default)(document.createElement('div'), {
      theme: 'haiku',
      mode: 'haiku',
      lineNumbers: true,
      scrollbarStyle: 'native'
    });
    _this.codemirror.setOptions = setOptions.bind(_this.codemirror);
    _this.codemirror.setValue('');
    _this.codemirror.setSize(EDITOR_WIDTH - 35, EDITOR_HEIGHT - 100);
    _this.codemirror.refresh(); // Must call this here or the gutter margin will be screwed up
    _this.codemirror.on('change', _this.handleEditorChange.bind(_this));
    _this.codemirror.on('keydown', _this.handleEditorKeydown.bind(_this));
    _this.codemirror.on('beforeChange', function (cm, changeObject) {
      // If multiline mode, only allow a change to the function body, not the signature
      // Simply cancel any change that occurs in either of those places.
      if (changeObject.origin !== 'setValue') {
        var lines = _this.codemirror.getValue().split('\n');
        if (changeObject.from.line === 0 || changeObject.from.line >= lines.length - 1) {
          return changeObject.cancel();
        }
        _this.props.element.setEventHandlerSaveStatus(_this.state.selectedEventName, false);
      }
    });

    _this.state = {
      selectedEventName: 'click', // Seems a good default event to work with
      customEventOptions: [], // Allow user to type in a custom event name
      autoCompletions: [],
      evaluatorText: null,
      evaluatorState: EVALUATOR_STATES.NONE,
      originalValue: null,
      editedValue: null
    };
    return _this;
  }

  _createClass(EventHandlerEditor, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this._context) {
        while (this._context.firstChild) {
          this._context.removeChild(this._context.firstChild);
        }
        var wrapper = this.codemirror.getWrapperElement();
        this._context.appendChild(wrapper);
      }

      // Not really a change event, but it contains the same business logic we want...
      this.handleChangedEventName({ value: this.state.selectedEventName }, true);
    }
  }, {
    key: 'recalibrateEditor',
    value: function recalibrateEditor(cursor) {
      var renderable = getRenderableValueMultiline(this.state.editedValue);

      this.codemirror.setValue(renderable);

      // If cursor explicitly passed, use it. This is used by chooseAutocompletion
      if (cursor) {
        this.codemirror.setCursor(cursor);
      } else {
        this.codemirror.setCursor({ line: 1, ch: renderable.split('\n')[1].length });
      }

      this.forceUpdate();
    }
  }, {
    key: 'isCommittableValueInvalid',
    value: function isCommittableValueInvalid(committable, original) {
      // If we have any error/warning in the evaluator, assume it as grounds not to commit
      // the current content of the field. Basically leveraging pre-validation we've already done.
      if (this.state.evaluatorState > EVALUATOR_STATES.INFO) {
        return {
          reason: this.state.evaluatorText
        };
      }

      return false;
    }
  }, {
    key: 'getCommitableValue',
    value: function getCommitableValue(valueDescriptor, originalDescriptor) {
      // Note that extra/cached fields are stripped off of the function, like '.summary'
      return {
        __function: {
          params: valueDescriptor.params,
          body: valueDescriptor.body
        }
      };
    }
  }, {
    key: 'doSave',
    value: function doSave() {
      var _this2 = this;

      var original = this.state.originalValue;
      var committable = this.getCommitableValue(this.state.editedValue, original);
      var invalid = this.isCommittableValueInvalid(committable, original);

      // If invalid, don't proceed - keep the input in a focused+selected state,
      // and then show an error message in the evaluator tooltip
      if (invalid) {
        return this.setState({
          evaluatorState: EVALUATOR_STATES.ERROR,
          evaluatorText: invalid.reason
        });
      }

      this.setState({
        originalValue: this.state.editedValue
      }, function () {
        _this2.props.save(_this2.props.element, _this2.state.selectedEventName, { handler: committable // The committable is serialized, i.e. __function: {...}
        });

        _this2.props.element.setEventHandlerSaveStatus(_this2.state.selectedEventName, true);
        _this2.forceUpdate();
      });
    }
  }, {
    key: 'doCancel',
    value: function doCancel() {
      // #TODO: What else?
      this.props.close();
    }
  }, {
    key: 'willHandleExternalKeydownEvent',
    value: function willHandleExternalKeydownEvent(keydownEvent) {
      if (keydownEvent._alreadyHandled) {
        return true;
      }

      if (this.props.element) {
        // <~ Possibly not needed, but this is a check to whether we're live or not
        // When focused, assume we *always* handle keyboard events, no exceptions.
        // If you want to handle an input when focused, used handleEditorKeydown
        return true;
      }

      return false;
    }
  }, {
    key: 'fetchEventHandlerValueDescriptor',
    value: function fetchEventHandlerValueDescriptor(eventName) {
      var extant = this.props.element && this.props.element.getReifiedEventHandler(eventName);

      var found = void 0;
      if (extant && extant.handler) {
        // The player wraps 'handler' to make sure binding is correct, but we want the original
        // function itself so we can actually access its body and parameters, etc.
        var original = extant.original || extant.handler;
        found = (0, _functionToRFO2.default)(original).__function;
      } else {
        found = {
          params: ['event'],
          body: '// "' + eventName + '" event logic goes here'
        };
      }

      return found;
    }
  }, {
    key: 'storeEditedValue',
    value: function storeEditedValue(eventName, functionSpec) {
      var fn = (0, _reifyRFO2.default)(functionSpec);

      // This just stores the updated function in memory but does _not_ persist it!
      this.props.element.upsertEventHandler(eventName, {
        handler: fn
      });
    }
  }, {
    key: 'handleChangedEventName',
    value: function handleChangedEventName(changeEvent) {
      var _this3 = this;

      if (changeEvent) {
        var existingHandler = this.fetchEventHandlerValueDescriptor(changeEvent.value);

        if (this.props.element) {
          this.storeEditedValue(changeEvent.value, existingHandler);
        }

        this.setState({
          evaluatorText: null,
          evaluatorState: EVALUATOR_STATES.OPEN,
          selectedEventName: changeEvent.value,
          originalValue: existingHandler,
          editedValue: existingHandler
        }, function () {
          _this3.recalibrateEditor();
          _this3.handleEditorChange(_this3.codemirror, {}, true);
        });
      }
    }
  }, {
    key: 'handleEditorChange',
    value: function handleEditorChange(cm, changeObject, alsoSetOriginal, wasInternalCall) {
      if (changeObject.origin === 'setValue') {
        return void 0;
      }

      // Any change should unset the current error state of the
      this.setState({
        evaluatorText: null
      });

      var rawValueFromEditor = cm.getValue();

      // The body will determine the params, so we can safely discard the function prefix/suffix
      var lines = rawValueFromEditor.split('\n');
      var body = lines.slice(1, lines.length - 1).join('\n');
      var officialValue = {
        params: ['event'],
        body: body

        // By default, assume we are in an open evaluator state (will check for error in a moment)
      };this.setState({
        evaluatorState: EVALUATOR_STATES.OPEN
      });

      // If the last entry was a space, remove autocomplete before we start parsing, which might fail
      // if we have an incomplete event-handler-in-progress inside the editor
      // Also remove any completions if the editor does not have focus
      if (!cm.hasFocus() || changeObject && changeObject.text && changeObject.text[0] === ' ') {
        this.setState({
          autoCompletions: []
        });
      }

      // This wrapping is required for parsing to work (parens are needed to make it an event-handler)
      var wrapped = _parseExpression2.default.wrap(officialValue.body);
      var cursor1 = this.codemirror.getCursor();

      var parse = (0, _parseExpression2.default)(wrapped, {}, HaikuMode.keywords, this.state, {
        line: this.getCursorOffsetLine(cursor1),
        ch: this.getCursorOffsetChar(cursor1)
      }, {
        // These checks are only needed for expressions in the timeline, so skip them here
        skipParamsImpurityCheck: true,
        skipForbiddensCheck: true
      });

      this._parse = parse; // Caching this to make it faster to read for autocompletions

      if (parse.error) {
        this.setState({
          autoCompletions: [],
          evaluatorState: EVALUATOR_STATES.ERROR,
          evaluatorText: parse.error.message
        });
      }

      if (!parse.error) {
        if (parse.warnings.length > 0) {
          this.setState({
            evaluatorState: EVALUATOR_STATES.WARN,
            evaluatorText: parse.warnings[0].annotation
          });
        }

        if (cm.hasFocus()) {
          var completions = parse.completions.sort(function (a, b) {
            var na = a.name.toLowerCase();
            var nb = b.name.toLowerCase();
            if (na < nb) return -1;
            if (na > nb) return 1;
            return 0;
          }).slice(0, MAX_AUTOCOMPLETION_ENTRIES);

          // Highlight the initial completion in the list
          if (completions[0]) {
            completions[0].highlighted = true;
          }

          this.setState({
            autoCompletions: completions
          });
        } else {
          this.setState({
            autoCompletions: []
          });
        }
      }

      // We can't store the edited value if it doesn't parse, since storing it requires that
      // we save the reified version, which depends on `new Function`
      if (!parse.error) {
        // Store the edited code in memory on the element so we can retrieve it if we navigate
        this.storeEditedValue(this.state.selectedEventName, officialValue);
      }

      // Need this for when we first load the code, our internal mods might change it subtlely
      // but we don't want a false positive for when a save is required
      if (alsoSetOriginal) {
        this.setState({
          originalValue: officialValue,
          editedValue: officialValue
        });
      } else {
        this.setState({
          editedValue: officialValue
        });
      }
    }
  }, {
    key: 'doesCurrentCodeNeedSave',
    value: function doesCurrentCodeNeedSave() {
      if (!this.props.element) return false;
      var status = this.props.element.getEventHandlerSaveStatus(this.state.selectedEventName);
      if (status === null || status === undefined) return false;
      // If the status is false, i.e. "not saved from a change", then yes, we need a save...
      return !status;
    }
  }, {
    key: 'handleEditorKeydown',
    value: function handleEditorKeydown(cm, keydownEvent) {
      keydownEvent._alreadyHandled = true;

      var highlightedAutoCompletions = this.state.autoCompletions.filter(function (completion) {
        return !!completion.highlighted;
      });

      // First, handle any autocompletions if we're in an autocomplete-active state, i.e.,
      // if we are showing autocomplete and if there are any of them currently highlighted
      if (highlightedAutoCompletions.length > 0) {
        if (keydownEvent.which === 40) {
          // ArrowDown
          keydownEvent.preventDefault();
          return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.NEXT);
        } else if (keydownEvent.which === 38) {
          // ArrowUp
          keydownEvent.preventDefault();
          return this.navigateAutoCompletion(NAVIGATION_DIRECTIONS.PREV);
        } else if (keydownEvent.which === 37) {
          // ArrowLeft
          this.setState({ autoCompletions: [] });
        } else if (keydownEvent.which === 39) {
          // ArrowRight
          this.setState({ autoCompletions: [] });
        } else if (keydownEvent.which === 13 && !keydownEvent.shiftKey) {
          // Enter (without Shift only!)
          keydownEvent.preventDefault();
          return this.chooseHighlightedAutoCompletion();
        } else if (keydownEvent.which === 9) {
          // Tab
          keydownEvent.preventDefault();
          return this.chooseHighlightedAutoCompletion();
        } else if (keydownEvent.which === 27) {
          // Escape
          keydownEvent.preventDefault();
          return this.setState({ autoCompletions: [] });
        }
      }

      if (keydownEvent.which === 13) {
        if (keydownEvent.metaKey) {
          // Meta+Enter when multi-line commits the value
          keydownEvent.preventDefault();
          return this.doSave();
        }
      }

      // Escape is the universal way to exit the editor without committing
      if (keydownEvent.which === 27) {
        // Escape
        return this.doCancel();
      }
    }
  }, {
    key: 'handleAutoCompleterClick',
    value: function handleAutoCompleterClick(completion) {
      this.chooseAutoCompletion(completion);
    }
  }, {
    key: 'navigateAutoCompletion',
    value: function navigateAutoCompletion(direction) {
      var _this4 = this;

      // If only one item in the list, no need to do anything, since there's nowhere to navigate
      if (this.state.autoCompletions.length < 2) {
        return void 0;
      }

      // Shift the currently toggled autocompletion to the next one in the list, using a wraparound.
      var changed = false;
      this.state.autoCompletions.forEach(function (completion, index) {
        if (!changed) {
          if (completion.highlighted) {
            var nidx = mod(index + direction, _this4.state.autoCompletions.length);
            // May as well check and skip if we're about to modify the current one
            if (nidx !== index) {
              var next = _this4.state.autoCompletions[nidx];
              completion.highlighted = false;
              next.highlighted = true;
              changed = true;
            }
          }
        }
      });

      this.setState({
        autoCompletions: this.state.autoCompletions
      });
    }
  }, {
    key: 'chooseHighlightedAutoCompletion',
    value: function chooseHighlightedAutoCompletion() {
      var completion = this.state.autoCompletions.filter(function (completion) {
        return !!completion.highlighted;
      })[0];

      // Not sure why we'd get here, but in case...
      if (!completion) {
        return void 0;
      }

      // If we don't have the parse populated, we really can't do anything
      if (!this._parse) {
        return void 0;
      }

      this.chooseAutoCompletion(completion);
    }
  }, {
    key: 'chooseAutoCompletion',
    value: function chooseAutoCompletion(completion) {
      var len = this._parse.target.end - this._parse.target.start;
      var doc = this.codemirror.getDoc();
      var cur = this.codemirror.getCursor();

      doc.replaceRange(completion.name, { line: cur.line, ch: cur.ch - len }, cur // { line: Number, ch: Number }
      );

      this.setState({ autoCompletions: [] });
    }
  }, {
    key: 'getCursorOffsetChar',
    value: function getCursorOffsetChar(curs, src) {
      return curs.ch;
    }
  }, {
    key: 'getCursorOffsetLine',
    value: function getCursorOffsetLine(curs, src) {
      return curs.line + 1;
    }
  }, {
    key: 'getEvaluatorText',
    value: function getEvaluatorText() {
      return this.state.evaluatorText || '•••';
    }
  }, {
    key: 'getEvalutatorStateColor',
    value: function getEvalutatorStateColor() {
      switch (this.state.evaluatorState) {
        case EVALUATOR_STATES.WARN:
          return _Palette2.default.ORANGE;
        case EVALUATOR_STATES.ERROR:
          return _Palette2.default.RED;
        default:
          return _Palette2.default.COAL;
      }
    }
  }, {
    key: 'getEditorContextClassName',
    value: function getEditorContextClassName() {
      var name = [];
      name.push('haiku-multiline');
      name.push('haiku-dynamic');
      return name.join(' ');
    }
  }, {
    key: 'getContainerStyle',
    value: function getContainerStyle() {
      var style = {
        width: EDITOR_WIDTH,
        height: EDITOR_HEIGHT,
        // overflow: 'hidden',
        backgroundColor: (0, _color2.default)('#4C434B'),
        borderRadius: '4px',
        zIndex: 9001
      };
      return style;
    }
  }, {
    key: 'getEditorContextStyle',
    value: function getEditorContextStyle() {
      var style = _lodash2.default.assign({
        cursor: 'default',
        fontFamily: 'Consolas, monospace',
        fontSize: 12,
        lineHeight: EDITOR_LINE_HEIGHT + 'px',
        height: 'calc(100% - 82px)',
        width: '100%',
        outline: 'none',
        paddingLeft: 7,
        paddingTop: 20,
        position: 'absolute',
        textShadow: '0 0 0 ' + (0, _color2.default)(_Palette2.default.ROCK).fade(0.3), // darkmagic
        zIndex: 2005,
        backgroundColor: (0, _color2.default)('#4C434B'),
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        color: _Palette2.default.ROCK,
        overflow: 'hidden', // Let codemirror do the scrolling
        top: 44
      });
      return style;
    }
  }, {
    key: 'getTooltipStyle',
    value: function getTooltipStyle() {
      var style = {
        backgroundColor: _Palette2.default.FATHER_COAL,
        borderRadius: 3,
        boxShadow: '0 3px 7px 0 rgba(7,0,3,0.40)',
        color: _Palette2.default.SUNSTONE,
        fontSize: 10,
        fontWeight: 400,
        left: 0,
        minHeight: 15,
        minWidth: 24,
        opacity: 0,
        padding: '3px 5px 2px 5px',
        position: 'absolute',
        textAlign: 'center',
        top: -24,
        transform: 'scale(.4)',
        transition: 'transform 182ms cubic-bezier(.175, .885, .316, 1.171)'
        // If we're open, we should show the evaluator tooltip
      };if (this.state.evaluatorState > EVALUATOR_STATES.NONE) {
        _lodash2.default.assign(style, {
          transform: 'scale(1)',
          opacity: 1
        });
      }
      // If we're info, warn, or error we have content to display
      if (this.state.evaluatorState > EVALUATOR_STATES.OPEN) {
        _lodash2.default.assign(style, {
          backgroundColor: this.getEvalutatorStateColor(),
          width: EDITOR_WIDTH
        });
      }
      return style;
    }
  }, {
    key: 'getTooltipTriStyle',
    value: function getTooltipTriStyle() {
      var style = {
        position: 'absolute',
        width: 0,
        height: 0,
        top: 13,
        left: 12,
        transform: 'translate(-8.8px, 0)',
        borderLeft: '8.8px solid transparent',
        borderRight: '8.8px solid transparent',
        borderTop: '8.8px solid ' + this.getEvalutatorStateColor()
      };
      if (this.state.evaluatorState > EVALUATOR_STATES.OPEN) {
        _lodash2.default.assign(style, {
          borderTop: '8.8px solid ' + this.getEvalutatorStateColor()
        });
      }
      return style;
    }
  }, {
    key: 'getSelectWrapperStyle',
    value: function getSelectWrapperStyle() {
      return {
        position: 'absolute',
        top: 28,
        paddingTop: 6,
        left: 0,
        width: '100%',
        height: 50,
        zIndex: 9000,
        borderTop: '1px solid ' + _Palette2.default.LIGHTEST_GRAY
      };
    }
  }, {
    key: 'getElementTitle',
    value: function getElementTitle() {
      if (this.props.element) {
        if (this.props.element.node) {
          if (this.props.element.node.attributes) {
            if (this.props.element.node.attributes['haiku-title']) {
              return '' + (0, _truncate2.default)(this.props.element.node.attributes['haiku-title'], 16);
            }
          }
        }
      }
      return '(unknown)';
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      return _react2.default.createElement(
        'div',
        {
          id: 'event-handler-editor-container',
          className: 'Absolute-Center',
          onMouseDown: function onMouseDown(mouseEvent) {
            // Prevent outer view from closing us
            mouseEvent.stopPropagation();
          },
          style: this.getContainerStyle(), __source: {
            fileName: _jsxFileName,
            lineNumber: 626
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            id: 'event-handler-input-tooltip',
            style: this.getTooltipStyle(), __source: {
              fileName: _jsxFileName,
              lineNumber: 634
            },
            __self: this
          },
          _react2.default.createElement('span', {
            id: 'event-handler-input-tooltip-tri',
            style: this.getTooltipTriStyle(), __source: {
              fileName: _jsxFileName,
              lineNumber: 637
            },
            __self: this
          }),
          this.getEvaluatorText()
        ),
        _react2.default.createElement(
          'div',
          {
            id: 'event-handler-select-wrapper',
            style: this.getSelectWrapperStyle(),
            className: 'no-select', __source: {
              fileName: _jsxFileName,
              lineNumber: 642
            },
            __self: this
          },
          _react2.default.createElement(_reactSelectPlus.Creatable, {
            name: 'event-name',
            placeholder: 'Choose Event Name...',
            clearable: false,
            value: this.state.selectedEventName,
            options: this.props.element && this.props.element.getApplicableEventHandlerOptionsList() || [],
            onChange: this.handleChangedEventName.bind(this), __source: {
              fileName: _jsxFileName,
              lineNumber: 646
            },
            __self: this
          })
        ),
        _react2.default.createElement(
          'div',
          {
            id: 'event-handler-element-title',
            className: 'no-select',
            style: {
              position: 'absolute',
              top: 5,
              left: EDITOR_WIDTH / 2 - 200,
              width: 400,
              margin: '0 auto',
              textAlign: 'center',
              color: '#999',
              zIndex: 9000
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 654
            },
            __self: this
          },
          'Event Listeners for ' + this.getElementTitle()
        ),
        _react2.default.createElement('div', {
          id: 'event-handler-input-editor-context',
          className: this.getEditorContextClassName(),
          ref: function ref(element) {
            _this5._context = element;
          },
          style: this.getEditorContextStyle(), __source: {
            fileName: _jsxFileName,
            lineNumber: 669
          },
          __self: this
        }),
        _react2.default.createElement(
          'button',
          {
            onClick: function onClick() {
              _this5.doCancel();
            },
            style: {
              position: 'absolute',
              bottom: 6,
              right: 12,
              height: 20,
              color: '#999',
              zIndex: 10000,
              fontSize: '12px',
              textTransform: 'none',
              textDecoration: 'underline'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 676
            },
            __self: this
          },
          'Cancel'
        ),
        _react2.default.createElement(
          'button',
          {
            onClick: function onClick() {
              _this5.doSave();
            },
            disabled: !this.doesCurrentCodeNeedSave(),
            style: {
              position: 'absolute',
              bottom: 6,
              right: 65,
              height: 20,
              color: this.doesCurrentCodeNeedSave() ? _Palette2.default.GREEN : '#666',
              cursor: this.doesCurrentCodeNeedSave() ? 'pointer' : 'not-allowed',
              zIndex: 10000,
              fontSize: '12px',
              textTransform: 'none',
              border: '1px solid ' + (this.doesCurrentCodeNeedSave() ? _Palette2.default.GREEN : '#666'),
              borderRadius: '2px',
              padding: '2px 12px 0px 11px'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 693
            },
            __self: this
          },
          'Save'
        )
      );
    }
  }]);

  return EventHandlerEditor;
}(_react2.default.Component);

exports.default = EventHandlerEditor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9FdmVudEhhbmRsZXJFZGl0b3IuanMiXSwibmFtZXMiOlsiSGFpa3VNb2RlIiwicmVxdWlyZSIsIkVWQUxVQVRPUl9TVEFURVMiLCJOT05FIiwiT1BFTiIsIklORk8iLCJXQVJOIiwiRVJST1IiLCJOQVZJR0FUSU9OX0RJUkVDVElPTlMiLCJTQU1FIiwiTkVYVCIsIlBSRVYiLCJFRElUT1JfV0lEVEgiLCJFRElUT1JfSEVJR0hUIiwiRURJVE9SX0xJTkVfSEVJR0hUIiwiTUFYX0FVVE9DT01QTEVUSU9OX0VOVFJJRVMiLCJtb2QiLCJpZHgiLCJtYXgiLCJzZXRPcHRpb25zIiwib3B0cyIsImtleSIsInNldE9wdGlvbiIsImdldFJlbmRlcmFibGVWYWx1ZU11bHRpbGluZSIsIm9mZmljaWFsVmFsdWUiLCJza2lwRm9ybWF0dGluZyIsInBhcmFtcyIsImxlbmd0aCIsImJvZHkiLCJFdmVudEhhbmRsZXJFZGl0b3IiLCJwcm9wcyIsIl9jb250ZXh0IiwiY29kZW1pcnJvciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInRoZW1lIiwibW9kZSIsImxpbmVOdW1iZXJzIiwic2Nyb2xsYmFyU3R5bGUiLCJiaW5kIiwic2V0VmFsdWUiLCJzZXRTaXplIiwicmVmcmVzaCIsIm9uIiwiaGFuZGxlRWRpdG9yQ2hhbmdlIiwiaGFuZGxlRWRpdG9yS2V5ZG93biIsImNtIiwiY2hhbmdlT2JqZWN0Iiwib3JpZ2luIiwibGluZXMiLCJnZXRWYWx1ZSIsInNwbGl0IiwiZnJvbSIsImxpbmUiLCJjYW5jZWwiLCJlbGVtZW50Iiwic2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyIsInN0YXRlIiwic2VsZWN0ZWRFdmVudE5hbWUiLCJjdXN0b21FdmVudE9wdGlvbnMiLCJhdXRvQ29tcGxldGlvbnMiLCJldmFsdWF0b3JUZXh0IiwiZXZhbHVhdG9yU3RhdGUiLCJvcmlnaW5hbFZhbHVlIiwiZWRpdGVkVmFsdWUiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJ3cmFwcGVyIiwiZ2V0V3JhcHBlckVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImhhbmRsZUNoYW5nZWRFdmVudE5hbWUiLCJ2YWx1ZSIsImN1cnNvciIsInJlbmRlcmFibGUiLCJzZXRDdXJzb3IiLCJjaCIsImZvcmNlVXBkYXRlIiwiY29tbWl0dGFibGUiLCJvcmlnaW5hbCIsInJlYXNvbiIsInZhbHVlRGVzY3JpcHRvciIsIm9yaWdpbmFsRGVzY3JpcHRvciIsIl9fZnVuY3Rpb24iLCJnZXRDb21taXRhYmxlVmFsdWUiLCJpbnZhbGlkIiwiaXNDb21taXR0YWJsZVZhbHVlSW52YWxpZCIsInNldFN0YXRlIiwic2F2ZSIsImhhbmRsZXIiLCJjbG9zZSIsImtleWRvd25FdmVudCIsIl9hbHJlYWR5SGFuZGxlZCIsImV2ZW50TmFtZSIsImV4dGFudCIsImdldFJlaWZpZWRFdmVudEhhbmRsZXIiLCJmb3VuZCIsImZ1bmN0aW9uU3BlYyIsImZuIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiY2hhbmdlRXZlbnQiLCJleGlzdGluZ0hhbmRsZXIiLCJmZXRjaEV2ZW50SGFuZGxlclZhbHVlRGVzY3JpcHRvciIsInN0b3JlRWRpdGVkVmFsdWUiLCJyZWNhbGlicmF0ZUVkaXRvciIsImFsc29TZXRPcmlnaW5hbCIsIndhc0ludGVybmFsQ2FsbCIsInJhd1ZhbHVlRnJvbUVkaXRvciIsInNsaWNlIiwiam9pbiIsImhhc0ZvY3VzIiwidGV4dCIsIndyYXBwZWQiLCJ3cmFwIiwiY3Vyc29yMSIsImdldEN1cnNvciIsInBhcnNlIiwia2V5d29yZHMiLCJnZXRDdXJzb3JPZmZzZXRMaW5lIiwiZ2V0Q3Vyc29yT2Zmc2V0Q2hhciIsInNraXBQYXJhbXNJbXB1cml0eUNoZWNrIiwic2tpcEZvcmJpZGRlbnNDaGVjayIsIl9wYXJzZSIsImVycm9yIiwibWVzc2FnZSIsIndhcm5pbmdzIiwiYW5ub3RhdGlvbiIsImNvbXBsZXRpb25zIiwic29ydCIsImEiLCJiIiwibmEiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJuYiIsImhpZ2hsaWdodGVkIiwic3RhdHVzIiwiZ2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyIsInVuZGVmaW5lZCIsImhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zIiwiZmlsdGVyIiwiY29tcGxldGlvbiIsIndoaWNoIiwicHJldmVudERlZmF1bHQiLCJuYXZpZ2F0ZUF1dG9Db21wbGV0aW9uIiwic2hpZnRLZXkiLCJjaG9vc2VIaWdobGlnaHRlZEF1dG9Db21wbGV0aW9uIiwibWV0YUtleSIsImRvU2F2ZSIsImRvQ2FuY2VsIiwiY2hvb3NlQXV0b0NvbXBsZXRpb24iLCJkaXJlY3Rpb24iLCJjaGFuZ2VkIiwiZm9yRWFjaCIsImluZGV4IiwibmlkeCIsIm5leHQiLCJsZW4iLCJ0YXJnZXQiLCJlbmQiLCJzdGFydCIsImRvYyIsImdldERvYyIsImN1ciIsInJlcGxhY2VSYW5nZSIsImN1cnMiLCJzcmMiLCJPUkFOR0UiLCJSRUQiLCJDT0FMIiwicHVzaCIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJ6SW5kZXgiLCJhc3NpZ24iLCJmb250RmFtaWx5IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0Iiwib3V0bGluZSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1RvcCIsInBvc2l0aW9uIiwidGV4dFNoYWRvdyIsIlJPQ0siLCJmYWRlIiwiYm9yZGVyQm90dG9tTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIiwiYm9yZGVyVG9wTGVmdFJhZGl1cyIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiY29sb3IiLCJvdmVyZmxvdyIsInRvcCIsIkZBVEhFUl9DT0FMIiwiYm94U2hhZG93IiwiU1VOU1RPTkUiLCJmb250V2VpZ2h0IiwibGVmdCIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwib3BhY2l0eSIsInBhZGRpbmciLCJ0ZXh0QWxpZ24iLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IiLCJib3JkZXJMZWZ0IiwiYm9yZGVyUmlnaHQiLCJib3JkZXJUb3AiLCJMSUdIVEVTVF9HUkFZIiwibm9kZSIsImF0dHJpYnV0ZXMiLCJtb3VzZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZ2V0Q29udGFpbmVyU3R5bGUiLCJnZXRUb29sdGlwU3R5bGUiLCJnZXRUb29sdGlwVHJpU3R5bGUiLCJnZXRFdmFsdWF0b3JUZXh0IiwiZ2V0U2VsZWN0V3JhcHBlclN0eWxlIiwiZ2V0QXBwbGljYWJsZUV2ZW50SGFuZGxlck9wdGlvbnNMaXN0IiwibWFyZ2luIiwiZ2V0RWxlbWVudFRpdGxlIiwiZ2V0RWRpdG9yQ29udGV4dENsYXNzTmFtZSIsImdldEVkaXRvckNvbnRleHRTdHlsZSIsImJvdHRvbSIsInJpZ2h0IiwidGV4dFRyYW5zZm9ybSIsInRleHREZWNvcmF0aW9uIiwiZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUiLCJHUkVFTiIsImJvcmRlciIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7O0FBREE7OztBQUVBLElBQU1BLFlBQVlDLFFBQVEsZUFBUixDQUFsQjs7QUFFQSxJQUFNQyxtQkFBbUI7QUFDdkJDLFFBQU0sQ0FEaUIsRUFDZDtBQUNUQyxRQUFNLENBRmlCLEVBRWQ7QUFDVEMsUUFBTSxDQUhpQjtBQUl2QkMsUUFBTSxDQUppQjtBQUt2QkMsU0FBTztBQUxnQixDQUF6Qjs7QUFRQSxJQUFNQyx3QkFBd0I7QUFDNUJDLFFBQU0sQ0FEc0I7QUFFNUJDLFFBQU0sQ0FBQyxDQUZxQjtBQUc1QkMsUUFBTSxDQUFDO0FBSHFCLENBQTlCOztBQU1BLElBQU1DLGVBQWUsR0FBckI7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBdEI7QUFDQSxJQUFNQyxxQkFBcUIsRUFBM0I7O0FBRUEsSUFBTUMsNkJBQTZCLENBQW5DOztBQUVBLFNBQVNDLEdBQVQsQ0FBY0MsR0FBZCxFQUFtQkMsR0FBbkIsRUFBd0I7QUFDdEIsU0FBTyxDQUFDRCxNQUFNQyxHQUFOLEdBQVlBLEdBQWIsSUFBb0JBLEdBQTNCO0FBQ0Q7O0FBRUQsU0FBU0MsVUFBVCxDQUFxQkMsSUFBckIsRUFBMkI7QUFDekIsT0FBSyxJQUFJQyxHQUFULElBQWdCRCxJQUFoQjtBQUFzQixTQUFLRSxTQUFMLENBQWVELEdBQWYsRUFBb0JELEtBQUtDLEdBQUwsQ0FBcEI7QUFBdEIsR0FDQSxPQUFPLElBQVA7QUFDRDs7QUFFRCxTQUFTRSwyQkFBVCxDQUFzQ0MsYUFBdEMsRUFBcURDLGNBQXJELEVBQXFFO0FBQ25FO0FBQ0EsTUFBSUMsU0FBUyxFQUFiO0FBQ0EsTUFBSUYsY0FBY0UsTUFBZCxJQUF3QkYsY0FBY0UsTUFBZCxDQUFxQkMsTUFBckIsR0FBOEIsQ0FBMUQsRUFBNkQ7QUFDM0RELGFBQVMsNkJBQWNGLGNBQWNFLE1BQTVCLENBQVQ7QUFDRDs7QUFFRCxNQUFJRCxjQUFKLEVBQW9CO0FBQ2xCLDBCQUFvQkMsTUFBcEIsYUFDRkYsY0FBY0ksSUFEWjtBQUdELEdBSkQsTUFJTztBQUNMLDBCQUFvQkYsTUFBcEIsZUFDQUYsY0FBY0ksSUFEZDtBQUdEO0FBQ0Y7O0lBRW9CQyxrQjs7O0FBQ25CLDhCQUFhQyxLQUFiLEVBQW9CO0FBQUE7O0FBQUEsd0lBQ1pBLEtBRFk7O0FBR2xCLFVBQUtDLFFBQUwsR0FBZ0IsSUFBaEIsQ0FIa0IsQ0FHRzs7QUFFckIsVUFBS0MsVUFBTCxHQUFrQiwwQkFBV0MsU0FBU0MsYUFBVCxDQUF1QixLQUF2QixDQUFYLEVBQTBDO0FBQzFEQyxhQUFPLE9BRG1EO0FBRTFEQyxZQUFNLE9BRm9EO0FBRzFEQyxtQkFBYSxJQUg2QztBQUkxREMsc0JBQWdCO0FBSjBDLEtBQTFDLENBQWxCO0FBTUEsVUFBS04sVUFBTCxDQUFnQmIsVUFBaEIsR0FBNkJBLFdBQVdvQixJQUFYLENBQWdCLE1BQUtQLFVBQXJCLENBQTdCO0FBQ0EsVUFBS0EsVUFBTCxDQUFnQlEsUUFBaEIsQ0FBeUIsRUFBekI7QUFDQSxVQUFLUixVQUFMLENBQWdCUyxPQUFoQixDQUF3QjdCLGVBQWUsRUFBdkMsRUFBMkNDLGdCQUFnQixHQUEzRDtBQUNBLFVBQUttQixVQUFMLENBQWdCVSxPQUFoQixHQWRrQixDQWNRO0FBQzFCLFVBQUtWLFVBQUwsQ0FBZ0JXLEVBQWhCLENBQW1CLFFBQW5CLEVBQTZCLE1BQUtDLGtCQUFMLENBQXdCTCxJQUF4QixPQUE3QjtBQUNBLFVBQUtQLFVBQUwsQ0FBZ0JXLEVBQWhCLENBQW1CLFNBQW5CLEVBQThCLE1BQUtFLG1CQUFMLENBQXlCTixJQUF6QixPQUE5QjtBQUNBLFVBQUtQLFVBQUwsQ0FBZ0JXLEVBQWhCLENBQW1CLGNBQW5CLEVBQW1DLFVBQUNHLEVBQUQsRUFBS0MsWUFBTCxFQUFzQjtBQUN2RDtBQUNBO0FBQ0EsVUFBSUEsYUFBYUMsTUFBYixLQUF3QixVQUE1QixFQUF3QztBQUN0QyxZQUFJQyxRQUFRLE1BQUtqQixVQUFMLENBQWdCa0IsUUFBaEIsR0FBMkJDLEtBQTNCLENBQWlDLElBQWpDLENBQVo7QUFDQSxZQUFJSixhQUFhSyxJQUFiLENBQWtCQyxJQUFsQixLQUEyQixDQUEzQixJQUFnQ04sYUFBYUssSUFBYixDQUFrQkMsSUFBbEIsSUFBMEJKLE1BQU10QixNQUFOLEdBQWUsQ0FBN0UsRUFBZ0Y7QUFDOUUsaUJBQU9vQixhQUFhTyxNQUFiLEVBQVA7QUFDRDtBQUNELGNBQUt4QixLQUFMLENBQVd5QixPQUFYLENBQW1CQyx5QkFBbkIsQ0FBNkMsTUFBS0MsS0FBTCxDQUFXQyxpQkFBeEQsRUFBMkUsS0FBM0U7QUFDRDtBQUNGLEtBVkQ7O0FBWUEsVUFBS0QsS0FBTCxHQUFhO0FBQ1hDLHlCQUFtQixPQURSLEVBQ2lCO0FBQzVCQywwQkFBb0IsRUFGVCxFQUVhO0FBQ3hCQyx1QkFBaUIsRUFITjtBQUlYQyxxQkFBZSxJQUpKO0FBS1hDLHNCQUFnQjVELGlCQUFpQkMsSUFMdEI7QUFNWDRELHFCQUFlLElBTko7QUFPWEMsbUJBQWE7QUFQRixLQUFiO0FBN0JrQjtBQXNDbkI7Ozs7d0NBRW9CO0FBQ25CLFVBQUksS0FBS2pDLFFBQVQsRUFBbUI7QUFDakIsZUFBTyxLQUFLQSxRQUFMLENBQWNrQyxVQUFyQixFQUFpQztBQUMvQixlQUFLbEMsUUFBTCxDQUFjbUMsV0FBZCxDQUEwQixLQUFLbkMsUUFBTCxDQUFja0MsVUFBeEM7QUFDRDtBQUNELFlBQUlFLFVBQVUsS0FBS25DLFVBQUwsQ0FBZ0JvQyxpQkFBaEIsRUFBZDtBQUNBLGFBQUtyQyxRQUFMLENBQWNzQyxXQUFkLENBQTBCRixPQUExQjtBQUNEOztBQUVEO0FBQ0EsV0FBS0csc0JBQUwsQ0FBNEIsRUFBRUMsT0FBTyxLQUFLZCxLQUFMLENBQVdDLGlCQUFwQixFQUE1QixFQUFxRSxJQUFyRTtBQUNEOzs7c0NBRWtCYyxNLEVBQVE7QUFDekIsVUFBSUMsYUFBYWxELDRCQUE0QixLQUFLa0MsS0FBTCxDQUFXTyxXQUF2QyxDQUFqQjs7QUFFQSxXQUFLaEMsVUFBTCxDQUFnQlEsUUFBaEIsQ0FBeUJpQyxVQUF6Qjs7QUFFQTtBQUNBLFVBQUlELE1BQUosRUFBWTtBQUNWLGFBQUt4QyxVQUFMLENBQWdCMEMsU0FBaEIsQ0FBMEJGLE1BQTFCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS3hDLFVBQUwsQ0FBZ0IwQyxTQUFoQixDQUEwQixFQUFFckIsTUFBTSxDQUFSLEVBQVdzQixJQUFJRixXQUFXdEIsS0FBWCxDQUFpQixJQUFqQixFQUF1QixDQUF2QixFQUEwQnhCLE1BQXpDLEVBQTFCO0FBQ0Q7O0FBRUQsV0FBS2lELFdBQUw7QUFDRDs7OzhDQUUwQkMsVyxFQUFhQyxRLEVBQVU7QUFDaEQ7QUFDQTtBQUNBLFVBQUksS0FBS3JCLEtBQUwsQ0FBV0ssY0FBWCxHQUE0QjVELGlCQUFpQkcsSUFBakQsRUFBdUQ7QUFDckQsZUFBTztBQUNMMEUsa0JBQVEsS0FBS3RCLEtBQUwsQ0FBV0k7QUFEZCxTQUFQO0FBR0Q7O0FBRUQsYUFBTyxLQUFQO0FBQ0Q7Ozt1Q0FFbUJtQixlLEVBQWlCQyxrQixFQUFvQjtBQUN2RDtBQUNBLGFBQU87QUFDTEMsb0JBQVk7QUFDVnhELGtCQUFRc0QsZ0JBQWdCdEQsTUFEZDtBQUVWRSxnQkFBTW9ELGdCQUFnQnBEO0FBRlo7QUFEUCxPQUFQO0FBTUQ7Ozs2QkFFUztBQUFBOztBQUNSLFVBQUlrRCxXQUFXLEtBQUtyQixLQUFMLENBQVdNLGFBQTFCO0FBQ0EsVUFBSWMsY0FBYyxLQUFLTSxrQkFBTCxDQUF3QixLQUFLMUIsS0FBTCxDQUFXTyxXQUFuQyxFQUFnRGMsUUFBaEQsQ0FBbEI7QUFDQSxVQUFJTSxVQUFVLEtBQUtDLHlCQUFMLENBQStCUixXQUEvQixFQUE0Q0MsUUFBNUMsQ0FBZDs7QUFFQTtBQUNBO0FBQ0EsVUFBSU0sT0FBSixFQUFhO0FBQ1gsZUFBTyxLQUFLRSxRQUFMLENBQWM7QUFDbkJ4QiwwQkFBZ0I1RCxpQkFBaUJLLEtBRGQ7QUFFbkJzRCx5QkFBZXVCLFFBQVFMO0FBRkosU0FBZCxDQUFQO0FBSUQ7O0FBRUQsV0FBS08sUUFBTCxDQUFjO0FBQ1p2Qix1QkFBZSxLQUFLTixLQUFMLENBQVdPO0FBRGQsT0FBZCxFQUVHLFlBQU07QUFDUCxlQUFLbEMsS0FBTCxDQUFXeUQsSUFBWCxDQUNFLE9BQUt6RCxLQUFMLENBQVd5QixPQURiLEVBRUUsT0FBS0UsS0FBTCxDQUFXQyxpQkFGYixFQUdFLEVBQUU4QixTQUFTWCxXQUFYLENBQXlCO0FBQXpCLFNBSEY7O0FBTUEsZUFBSy9DLEtBQUwsQ0FBV3lCLE9BQVgsQ0FBbUJDLHlCQUFuQixDQUE2QyxPQUFLQyxLQUFMLENBQVdDLGlCQUF4RCxFQUEyRSxJQUEzRTtBQUNBLGVBQUtrQixXQUFMO0FBQ0QsT0FYRDtBQVlEOzs7K0JBRVc7QUFDVjtBQUNBLFdBQUs5QyxLQUFMLENBQVcyRCxLQUFYO0FBQ0Q7OzttREFFK0JDLFksRUFBYztBQUM1QyxVQUFJQSxhQUFhQyxlQUFqQixFQUFrQztBQUNoQyxlQUFPLElBQVA7QUFDRDs7QUFFRCxVQUFJLEtBQUs3RCxLQUFMLENBQVd5QixPQUFmLEVBQXdCO0FBQUU7QUFDeEI7QUFDQTtBQUNBLGVBQU8sSUFBUDtBQUNEOztBQUVELGFBQU8sS0FBUDtBQUNEOzs7cURBRWlDcUMsUyxFQUFXO0FBQzNDLFVBQUlDLFNBQVMsS0FBSy9ELEtBQUwsQ0FBV3lCLE9BQVgsSUFBc0IsS0FBS3pCLEtBQUwsQ0FBV3lCLE9BQVgsQ0FBbUJ1QyxzQkFBbkIsQ0FBMENGLFNBQTFDLENBQW5DOztBQUVBLFVBQUlHLGNBQUo7QUFDQSxVQUFJRixVQUFVQSxPQUFPTCxPQUFyQixFQUE4QjtBQUM1QjtBQUNBO0FBQ0EsWUFBSVYsV0FBV2UsT0FBT2YsUUFBUCxJQUFtQmUsT0FBT0wsT0FBekM7QUFDQU8sZ0JBQVEsNkJBQWNqQixRQUFkLEVBQXdCSSxVQUFoQztBQUNELE9BTEQsTUFLTztBQUNMYSxnQkFBUTtBQUNOckUsa0JBQVEsQ0FBQyxPQUFELENBREY7QUFFTkUsZ0JBQU0sU0FBU2dFLFNBQVQsR0FBcUI7QUFGckIsU0FBUjtBQUlEOztBQUVELGFBQU9HLEtBQVA7QUFDRDs7O3FDQUVpQkgsUyxFQUFXSSxZLEVBQWM7QUFDekMsVUFBSUMsS0FBSyx3QkFBU0QsWUFBVCxDQUFUOztBQUVBO0FBQ0EsV0FBS2xFLEtBQUwsQ0FBV3lCLE9BQVgsQ0FBbUIyQyxrQkFBbkIsQ0FBc0NOLFNBQXRDLEVBQWlEO0FBQy9DSixpQkFBU1M7QUFEc0MsT0FBakQ7QUFHRDs7OzJDQUV1QkUsVyxFQUFhO0FBQUE7O0FBQ25DLFVBQUlBLFdBQUosRUFBaUI7QUFDZixZQUFJQyxrQkFBa0IsS0FBS0MsZ0NBQUwsQ0FBc0NGLFlBQVk1QixLQUFsRCxDQUF0Qjs7QUFFQSxZQUFJLEtBQUt6QyxLQUFMLENBQVd5QixPQUFmLEVBQXdCO0FBQ3RCLGVBQUsrQyxnQkFBTCxDQUFzQkgsWUFBWTVCLEtBQWxDLEVBQXlDNkIsZUFBekM7QUFDRDs7QUFFRCxhQUFLZCxRQUFMLENBQWM7QUFDWnpCLHlCQUFlLElBREg7QUFFWkMsMEJBQWdCNUQsaUJBQWlCRSxJQUZyQjtBQUdac0QsNkJBQW1CeUMsWUFBWTVCLEtBSG5CO0FBSVpSLHlCQUFlcUMsZUFKSDtBQUtacEMsdUJBQWFvQztBQUxELFNBQWQsRUFNRyxZQUFNO0FBQ1AsaUJBQUtHLGlCQUFMO0FBQ0EsaUJBQUszRCxrQkFBTCxDQUF3QixPQUFLWixVQUE3QixFQUF5QyxFQUF6QyxFQUE2QyxJQUE3QztBQUNELFNBVEQ7QUFVRDtBQUNGOzs7dUNBRW1CYyxFLEVBQUlDLFksRUFBY3lELGUsRUFBaUJDLGUsRUFBaUI7QUFDdEUsVUFBSTFELGFBQWFDLE1BQWIsS0FBd0IsVUFBNUIsRUFBd0M7QUFDdEMsZUFBTyxLQUFNLENBQWI7QUFDRDs7QUFFRDtBQUNBLFdBQUtzQyxRQUFMLENBQWM7QUFDWnpCLHVCQUFlO0FBREgsT0FBZDs7QUFJQSxVQUFJNkMscUJBQXFCNUQsR0FBR0ksUUFBSCxFQUF6Qjs7QUFFQTtBQUNBLFVBQUlELFFBQVF5RCxtQkFBbUJ2RCxLQUFuQixDQUF5QixJQUF6QixDQUFaO0FBQ0EsVUFBSXZCLE9BQU9xQixNQUFNMEQsS0FBTixDQUFZLENBQVosRUFBZTFELE1BQU10QixNQUFOLEdBQWUsQ0FBOUIsRUFBaUNpRixJQUFqQyxDQUFzQyxJQUF0QyxDQUFYO0FBQ0EsVUFBSXBGLGdCQUFnQjtBQUNsQkUsZ0JBQVEsQ0FBQyxPQUFELENBRFU7QUFFbEJFLGNBQU1BOztBQUdSO0FBTG9CLE9BQXBCLENBTUEsS0FBSzBELFFBQUwsQ0FBYztBQUNaeEIsd0JBQWdCNUQsaUJBQWlCRTtBQURyQixPQUFkOztBQUlBO0FBQ0E7QUFDQTtBQUNBLFVBQUksQ0FBQzBDLEdBQUcrRCxRQUFILEVBQUQsSUFBbUI5RCxnQkFBZ0JBLGFBQWErRCxJQUE3QixJQUFxQy9ELGFBQWErRCxJQUFiLENBQWtCLENBQWxCLE1BQXlCLEdBQXJGLEVBQTJGO0FBQ3pGLGFBQUt4QixRQUFMLENBQWM7QUFDWjFCLDJCQUFpQjtBQURMLFNBQWQ7QUFHRDs7QUFFRDtBQUNBLFVBQUltRCxVQUFVLDBCQUFnQkMsSUFBaEIsQ0FBcUJ4RixjQUFjSSxJQUFuQyxDQUFkO0FBQ0EsVUFBSXFGLFVBQVUsS0FBS2pGLFVBQUwsQ0FBZ0JrRixTQUFoQixFQUFkOztBQUVBLFVBQUlDLFFBQVEsK0JBQWdCSixPQUFoQixFQUF5QixFQUF6QixFQUE2Qi9HLFVBQVVvSCxRQUF2QyxFQUFpRCxLQUFLM0QsS0FBdEQsRUFBNkQ7QUFDdkVKLGNBQU0sS0FBS2dFLG1CQUFMLENBQXlCSixPQUF6QixDQURpRTtBQUV2RXRDLFlBQUksS0FBSzJDLG1CQUFMLENBQXlCTCxPQUF6QjtBQUZtRSxPQUE3RCxFQUdUO0FBQ0Q7QUFDQU0saUNBQXlCLElBRnhCO0FBR0RDLDZCQUFxQjtBQUhwQixPQUhTLENBQVo7O0FBU0EsV0FBS0MsTUFBTCxHQUFjTixLQUFkLENBL0NzRSxDQStDbEQ7O0FBRXBCLFVBQUlBLE1BQU1PLEtBQVYsRUFBaUI7QUFDZixhQUFLcEMsUUFBTCxDQUFjO0FBQ1oxQiwyQkFBaUIsRUFETDtBQUVaRSwwQkFBZ0I1RCxpQkFBaUJLLEtBRnJCO0FBR1pzRCx5QkFBZXNELE1BQU1PLEtBQU4sQ0FBWUM7QUFIZixTQUFkO0FBS0Q7O0FBRUQsVUFBSSxDQUFDUixNQUFNTyxLQUFYLEVBQWtCO0FBQ2hCLFlBQUlQLE1BQU1TLFFBQU4sQ0FBZWpHLE1BQWYsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDN0IsZUFBSzJELFFBQUwsQ0FBYztBQUNaeEIsNEJBQWdCNUQsaUJBQWlCSSxJQURyQjtBQUVadUQsMkJBQWVzRCxNQUFNUyxRQUFOLENBQWUsQ0FBZixFQUFrQkM7QUFGckIsV0FBZDtBQUlEOztBQUVELFlBQUkvRSxHQUFHK0QsUUFBSCxFQUFKLEVBQW1CO0FBQ2pCLGNBQUlpQixjQUFjWCxNQUFNVyxXQUFOLENBQWtCQyxJQUFsQixDQUF1QixVQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTtBQUNqRCxnQkFBSUMsS0FBS0YsRUFBRUcsSUFBRixDQUFPQyxXQUFQLEVBQVQ7QUFDQSxnQkFBSUMsS0FBS0osRUFBRUUsSUFBRixDQUFPQyxXQUFQLEVBQVQ7QUFDQSxnQkFBSUYsS0FBS0csRUFBVCxFQUFhLE9BQU8sQ0FBQyxDQUFSO0FBQ2IsZ0JBQUlILEtBQUtHLEVBQVQsRUFBYSxPQUFPLENBQVA7QUFDYixtQkFBTyxDQUFQO0FBQ0QsV0FOaUIsRUFNZjFCLEtBTmUsQ0FNVCxDQU5TLEVBTU41RiwwQkFOTSxDQUFsQjs7QUFRQTtBQUNBLGNBQUkrRyxZQUFZLENBQVosQ0FBSixFQUFvQjtBQUNsQkEsd0JBQVksQ0FBWixFQUFlUSxXQUFmLEdBQTZCLElBQTdCO0FBQ0Q7O0FBRUQsZUFBS2hELFFBQUwsQ0FBYztBQUNaMUIsNkJBQWlCa0U7QUFETCxXQUFkO0FBR0QsU0FqQkQsTUFpQk87QUFDTCxlQUFLeEMsUUFBTCxDQUFjO0FBQ1oxQiw2QkFBaUI7QUFETCxXQUFkO0FBR0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0EsVUFBSSxDQUFDdUQsTUFBTU8sS0FBWCxFQUFrQjtBQUNoQjtBQUNBLGFBQUtwQixnQkFBTCxDQUFzQixLQUFLN0MsS0FBTCxDQUFXQyxpQkFBakMsRUFBb0RsQyxhQUFwRDtBQUNEOztBQUVEO0FBQ0E7QUFDQSxVQUFJZ0YsZUFBSixFQUFxQjtBQUNuQixhQUFLbEIsUUFBTCxDQUFjO0FBQ1p2Qix5QkFBZXZDLGFBREg7QUFFWndDLHVCQUFheEM7QUFGRCxTQUFkO0FBSUQsT0FMRCxNQUtPO0FBQ0wsYUFBSzhELFFBQUwsQ0FBYztBQUNadEIsdUJBQWF4QztBQURELFNBQWQ7QUFHRDtBQUNGOzs7OENBRTBCO0FBQ3pCLFVBQUksQ0FBQyxLQUFLTSxLQUFMLENBQVd5QixPQUFoQixFQUF5QixPQUFPLEtBQVA7QUFDekIsVUFBSWdGLFNBQVMsS0FBS3pHLEtBQUwsQ0FBV3lCLE9BQVgsQ0FBbUJpRix5QkFBbkIsQ0FBNkMsS0FBSy9FLEtBQUwsQ0FBV0MsaUJBQXhELENBQWI7QUFDQSxVQUFJNkUsV0FBVyxJQUFYLElBQW1CQSxXQUFXRSxTQUFsQyxFQUE2QyxPQUFPLEtBQVA7QUFDN0M7QUFDQSxhQUFPLENBQUNGLE1BQVI7QUFDRDs7O3dDQUVvQnpGLEUsRUFBSTRDLFksRUFBYztBQUNyQ0EsbUJBQWFDLGVBQWIsR0FBK0IsSUFBL0I7O0FBRUEsVUFBSStDLDZCQUE2QixLQUFLakYsS0FBTCxDQUFXRyxlQUFYLENBQTJCK0UsTUFBM0IsQ0FBa0MsVUFBQ0MsVUFBRCxFQUFnQjtBQUNqRixlQUFPLENBQUMsQ0FBQ0EsV0FBV04sV0FBcEI7QUFDRCxPQUZnQyxDQUFqQzs7QUFJQTtBQUNBO0FBQ0EsVUFBSUksMkJBQTJCL0csTUFBM0IsR0FBb0MsQ0FBeEMsRUFBMkM7QUFDekMsWUFBSStELGFBQWFtRCxLQUFiLEtBQXVCLEVBQTNCLEVBQStCO0FBQUU7QUFDL0JuRCx1QkFBYW9ELGNBQWI7QUFDQSxpQkFBTyxLQUFLQyxzQkFBTCxDQUE0QnZJLHNCQUFzQkUsSUFBbEQsQ0FBUDtBQUNELFNBSEQsTUFHTyxJQUFJZ0YsYUFBYW1ELEtBQWIsS0FBdUIsRUFBM0IsRUFBK0I7QUFBRTtBQUN0Q25ELHVCQUFhb0QsY0FBYjtBQUNBLGlCQUFPLEtBQUtDLHNCQUFMLENBQTRCdkksc0JBQXNCRyxJQUFsRCxDQUFQO0FBQ0QsU0FITSxNQUdBLElBQUkrRSxhQUFhbUQsS0FBYixLQUF1QixFQUEzQixFQUErQjtBQUFFO0FBQ3RDLGVBQUt2RCxRQUFMLENBQWMsRUFBRTFCLGlCQUFpQixFQUFuQixFQUFkO0FBQ0QsU0FGTSxNQUVBLElBQUk4QixhQUFhbUQsS0FBYixLQUF1QixFQUEzQixFQUErQjtBQUFFO0FBQ3RDLGVBQUt2RCxRQUFMLENBQWMsRUFBRTFCLGlCQUFpQixFQUFuQixFQUFkO0FBQ0QsU0FGTSxNQUVBLElBQUk4QixhQUFhbUQsS0FBYixLQUF1QixFQUF2QixJQUE2QixDQUFDbkQsYUFBYXNELFFBQS9DLEVBQXlEO0FBQUU7QUFDaEV0RCx1QkFBYW9ELGNBQWI7QUFDQSxpQkFBTyxLQUFLRywrQkFBTCxFQUFQO0FBQ0QsU0FITSxNQUdBLElBQUl2RCxhQUFhbUQsS0FBYixLQUF1QixDQUEzQixFQUE4QjtBQUFFO0FBQ3JDbkQsdUJBQWFvRCxjQUFiO0FBQ0EsaUJBQU8sS0FBS0csK0JBQUwsRUFBUDtBQUNELFNBSE0sTUFHQSxJQUFJdkQsYUFBYW1ELEtBQWIsS0FBdUIsRUFBM0IsRUFBK0I7QUFBRTtBQUN0Q25ELHVCQUFhb0QsY0FBYjtBQUNBLGlCQUFPLEtBQUt4RCxRQUFMLENBQWMsRUFBRTFCLGlCQUFpQixFQUFuQixFQUFkLENBQVA7QUFDRDtBQUNGOztBQUVELFVBQUk4QixhQUFhbUQsS0FBYixLQUF1QixFQUEzQixFQUErQjtBQUM3QixZQUFJbkQsYUFBYXdELE9BQWpCLEVBQTBCO0FBQ3hCO0FBQ0F4RCx1QkFBYW9ELGNBQWI7QUFDQSxpQkFBTyxLQUFLSyxNQUFMLEVBQVA7QUFDRDtBQUNGOztBQUVEO0FBQ0EsVUFBSXpELGFBQWFtRCxLQUFiLEtBQXVCLEVBQTNCLEVBQStCO0FBQUU7QUFDL0IsZUFBTyxLQUFLTyxRQUFMLEVBQVA7QUFDRDtBQUNGOzs7NkNBRXlCUixVLEVBQVk7QUFDcEMsV0FBS1Msb0JBQUwsQ0FBMEJULFVBQTFCO0FBQ0Q7OzsyQ0FFdUJVLFMsRUFBVztBQUFBOztBQUNqQztBQUNBLFVBQUksS0FBSzdGLEtBQUwsQ0FBV0csZUFBWCxDQUEyQmpDLE1BQTNCLEdBQW9DLENBQXhDLEVBQTJDO0FBQ3pDLGVBQU8sS0FBTSxDQUFiO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJNEgsVUFBVSxLQUFkO0FBQ0EsV0FBSzlGLEtBQUwsQ0FBV0csZUFBWCxDQUEyQjRGLE9BQTNCLENBQW1DLFVBQUNaLFVBQUQsRUFBYWEsS0FBYixFQUF1QjtBQUN4RCxZQUFJLENBQUNGLE9BQUwsRUFBYztBQUNaLGNBQUlYLFdBQVdOLFdBQWYsRUFBNEI7QUFDMUIsZ0JBQUlvQixPQUFPMUksSUFBSXlJLFFBQVFILFNBQVosRUFBdUIsT0FBSzdGLEtBQUwsQ0FBV0csZUFBWCxDQUEyQmpDLE1BQWxELENBQVg7QUFDQTtBQUNBLGdCQUFJK0gsU0FBU0QsS0FBYixFQUFvQjtBQUNsQixrQkFBSUUsT0FBTyxPQUFLbEcsS0FBTCxDQUFXRyxlQUFYLENBQTJCOEYsSUFBM0IsQ0FBWDtBQUNBZCx5QkFBV04sV0FBWCxHQUF5QixLQUF6QjtBQUNBcUIsbUJBQUtyQixXQUFMLEdBQW1CLElBQW5CO0FBQ0FpQix3QkFBVSxJQUFWO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsT0FiRDs7QUFlQSxXQUFLakUsUUFBTCxDQUFjO0FBQ1oxQix5QkFBaUIsS0FBS0gsS0FBTCxDQUFXRztBQURoQixPQUFkO0FBR0Q7OztzREFFa0M7QUFDakMsVUFBSWdGLGFBQWEsS0FBS25GLEtBQUwsQ0FBV0csZUFBWCxDQUEyQitFLE1BQTNCLENBQWtDLFVBQUNDLFVBQUQsRUFBZ0I7QUFDakUsZUFBTyxDQUFDLENBQUNBLFdBQVdOLFdBQXBCO0FBQ0QsT0FGZ0IsRUFFZCxDQUZjLENBQWpCOztBQUlBO0FBQ0EsVUFBSSxDQUFDTSxVQUFMLEVBQWlCO0FBQ2YsZUFBTyxLQUFNLENBQWI7QUFDRDs7QUFFRDtBQUNBLFVBQUksQ0FBQyxLQUFLbkIsTUFBVixFQUFrQjtBQUNoQixlQUFPLEtBQU0sQ0FBYjtBQUNEOztBQUVELFdBQUs0QixvQkFBTCxDQUEwQlQsVUFBMUI7QUFDRDs7O3lDQUVxQkEsVSxFQUFZO0FBQ2hDLFVBQUlnQixNQUFNLEtBQUtuQyxNQUFMLENBQVlvQyxNQUFaLENBQW1CQyxHQUFuQixHQUF5QixLQUFLckMsTUFBTCxDQUFZb0MsTUFBWixDQUFtQkUsS0FBdEQ7QUFDQSxVQUFJQyxNQUFNLEtBQUtoSSxVQUFMLENBQWdCaUksTUFBaEIsRUFBVjtBQUNBLFVBQUlDLE1BQU0sS0FBS2xJLFVBQUwsQ0FBZ0JrRixTQUFoQixFQUFWOztBQUVBOEMsVUFBSUcsWUFBSixDQUNFdkIsV0FBV1QsSUFEYixFQUVFLEVBQUU5RSxNQUFNNkcsSUFBSTdHLElBQVosRUFBa0JzQixJQUFJdUYsSUFBSXZGLEVBQUosR0FBU2lGLEdBQS9CLEVBRkYsRUFHRU0sR0FIRixDQUdNO0FBSE47O0FBTUEsV0FBSzVFLFFBQUwsQ0FBYyxFQUFFMUIsaUJBQWlCLEVBQW5CLEVBQWQ7QUFDRDs7O3dDQUVvQndHLEksRUFBTUMsRyxFQUFLO0FBQzlCLGFBQU9ELEtBQUt6RixFQUFaO0FBQ0Q7Ozt3Q0FFb0J5RixJLEVBQU1DLEcsRUFBSztBQUM5QixhQUFPRCxLQUFLL0csSUFBTCxHQUFZLENBQW5CO0FBQ0Q7Ozt1Q0FFbUI7QUFDbEIsYUFBTyxLQUFLSSxLQUFMLENBQVdJLGFBQVgsSUFBNEIsS0FBbkM7QUFDRDs7OzhDQUUwQjtBQUN6QixjQUFRLEtBQUtKLEtBQUwsQ0FBV0ssY0FBbkI7QUFDRSxhQUFLNUQsaUJBQWlCSSxJQUF0QjtBQUE0QixpQkFBTyxrQkFBUWdLLE1BQWY7QUFDNUIsYUFBS3BLLGlCQUFpQkssS0FBdEI7QUFBNkIsaUJBQU8sa0JBQVFnSyxHQUFmO0FBQzdCO0FBQVMsaUJBQU8sa0JBQVFDLElBQWY7QUFIWDtBQUtEOzs7Z0RBRTRCO0FBQzNCLFVBQUlyQyxPQUFPLEVBQVg7QUFDQUEsV0FBS3NDLElBQUwsQ0FBVSxpQkFBVjtBQUNBdEMsV0FBS3NDLElBQUwsQ0FBVSxlQUFWO0FBQ0EsYUFBT3RDLEtBQUt2QixJQUFMLENBQVUsR0FBVixDQUFQO0FBQ0Q7Ozt3Q0FFb0I7QUFDbkIsVUFBSThELFFBQVE7QUFDVkMsZUFBTy9KLFlBREc7QUFFVmdLLGdCQUFRL0osYUFGRTtBQUdWO0FBQ0FnSyx5QkFBaUIscUJBQU0sU0FBTixDQUpQO0FBS1ZDLHNCQUFjLEtBTEo7QUFNVkMsZ0JBQVE7QUFORSxPQUFaO0FBUUEsYUFBT0wsS0FBUDtBQUNEOzs7NENBRXdCO0FBQ3ZCLFVBQUlBLFFBQVEsaUJBQU9NLE1BQVAsQ0FBYztBQUN4QnhHLGdCQUFRLFNBRGdCO0FBRXhCeUcsb0JBQVkscUJBRlk7QUFHeEJDLGtCQUFVLEVBSGM7QUFJeEJDLG9CQUFZcksscUJBQXFCLElBSlQ7QUFLeEI4SixnQkFBUSxtQkFMZ0I7QUFNeEJELGVBQU8sTUFOaUI7QUFPeEJTLGlCQUFTLE1BUGU7QUFReEJDLHFCQUFhLENBUlc7QUFTeEJDLG9CQUFZLEVBVFk7QUFVeEJDLGtCQUFVLFVBVmM7QUFXeEJDLG9CQUFZLFdBQVcscUJBQU0sa0JBQVFDLElBQWQsRUFBb0JDLElBQXBCLENBQXlCLEdBQXpCLENBWEMsRUFXOEI7QUFDdERYLGdCQUFRLElBWmdCO0FBYXhCRix5QkFBaUIscUJBQU0sU0FBTixDQWJPO0FBY3hCYyxnQ0FBd0IsQ0FkQTtBQWV4QkMsaUNBQXlCLENBZkQ7QUFnQnhCQyw2QkFBcUIsQ0FoQkc7QUFpQnhCQyw4QkFBc0IsQ0FqQkU7QUFrQnhCQyxlQUFPLGtCQUFRTixJQWxCUztBQW1CeEJPLGtCQUFVLFFBbkJjLEVBbUJKO0FBQ3BCQyxhQUFLO0FBcEJtQixPQUFkLENBQVo7QUFzQkEsYUFBT3ZCLEtBQVA7QUFDRDs7O3NDQUVrQjtBQUNqQixVQUFJQSxRQUFRO0FBQ1ZHLHlCQUFpQixrQkFBUXFCLFdBRGY7QUFFVnBCLHNCQUFjLENBRko7QUFHVnFCLG1CQUFXLDhCQUhEO0FBSVZKLGVBQU8sa0JBQVFLLFFBSkw7QUFLVmxCLGtCQUFVLEVBTEE7QUFNVm1CLG9CQUFZLEdBTkY7QUFPVkMsY0FBTSxDQVBJO0FBUVZDLG1CQUFXLEVBUkQ7QUFTVkMsa0JBQVUsRUFUQTtBQVVWQyxpQkFBUyxDQVZDO0FBV1ZDLGlCQUFTLGlCQVhDO0FBWVZuQixrQkFBVSxVQVpBO0FBYVZvQixtQkFBVyxRQWJEO0FBY1ZWLGFBQUssQ0FBQyxFQWRJO0FBZVZXLG1CQUFXLFdBZkQ7QUFnQlZDLG9CQUFZO0FBRWQ7QUFsQlksT0FBWixDQW1CQSxJQUFJLEtBQUtwSixLQUFMLENBQVdLLGNBQVgsR0FBNEI1RCxpQkFBaUJDLElBQWpELEVBQXVEO0FBQ3JELHlCQUFPNkssTUFBUCxDQUFjTixLQUFkLEVBQXFCO0FBQ25Ca0MscUJBQVcsVUFEUTtBQUVuQkgsbUJBQVM7QUFGVSxTQUFyQjtBQUlEO0FBQ0Q7QUFDQSxVQUFJLEtBQUtoSixLQUFMLENBQVdLLGNBQVgsR0FBNEI1RCxpQkFBaUJFLElBQWpELEVBQXVEO0FBQ3JELHlCQUFPNEssTUFBUCxDQUFjTixLQUFkLEVBQXFCO0FBQ25CRywyQkFBaUIsS0FBS2lDLHVCQUFMLEVBREU7QUFFbkJuQyxpQkFBTy9KO0FBRlksU0FBckI7QUFJRDtBQUNELGFBQU84SixLQUFQO0FBQ0Q7Ozt5Q0FFcUI7QUFDcEIsVUFBSUEsUUFBUTtBQUNWYSxrQkFBVSxVQURBO0FBRVZaLGVBQU8sQ0FGRztBQUdWQyxnQkFBUSxDQUhFO0FBSVZxQixhQUFLLEVBSks7QUFLVkssY0FBTSxFQUxJO0FBTVZNLG1CQUFXLHNCQU5EO0FBT1ZHLG9CQUFZLHlCQVBGO0FBUVZDLHFCQUFhLHlCQVJIO0FBU1ZDLG1CQUFXLGlCQUFpQixLQUFLSCx1QkFBTDtBQVRsQixPQUFaO0FBV0EsVUFBSSxLQUFLckosS0FBTCxDQUFXSyxjQUFYLEdBQTRCNUQsaUJBQWlCRSxJQUFqRCxFQUF1RDtBQUNyRCx5QkFBTzRLLE1BQVAsQ0FBY04sS0FBZCxFQUFxQjtBQUNuQnVDLHFCQUFXLGlCQUFpQixLQUFLSCx1QkFBTDtBQURULFNBQXJCO0FBR0Q7QUFDRCxhQUFPcEMsS0FBUDtBQUNEOzs7NENBRXdCO0FBQ3ZCLGFBQU87QUFDTGEsa0JBQVUsVUFETDtBQUVMVSxhQUFLLEVBRkE7QUFHTFgsb0JBQVksQ0FIUDtBQUlMZ0IsY0FBTSxDQUpEO0FBS0wzQixlQUFPLE1BTEY7QUFNTEMsZ0JBQVEsRUFOSDtBQU9MRyxnQkFBUSxJQVBIO0FBUUxrQyxtQkFBVyxlQUFlLGtCQUFRQztBQVI3QixPQUFQO0FBVUQ7OztzQ0FFa0I7QUFDakIsVUFBSSxLQUFLcEwsS0FBTCxDQUFXeUIsT0FBZixFQUF3QjtBQUN0QixZQUFJLEtBQUt6QixLQUFMLENBQVd5QixPQUFYLENBQW1CNEosSUFBdkIsRUFBNkI7QUFDM0IsY0FBSSxLQUFLckwsS0FBTCxDQUFXeUIsT0FBWCxDQUFtQjRKLElBQW5CLENBQXdCQyxVQUE1QixFQUF3QztBQUN0QyxnQkFBSSxLQUFLdEwsS0FBTCxDQUFXeUIsT0FBWCxDQUFtQjRKLElBQW5CLENBQXdCQyxVQUF4QixDQUFtQyxhQUFuQyxDQUFKLEVBQXVEO0FBQ3JELDBCQUFVLHdCQUFTLEtBQUt0TCxLQUFMLENBQVd5QixPQUFYLENBQW1CNEosSUFBbkIsQ0FBd0JDLFVBQXhCLENBQW1DLGFBQW5DLENBQVQsRUFBNEQsRUFBNUQsQ0FBVjtBQUNEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0QsYUFBTyxXQUFQO0FBQ0Q7Ozs2QkFFUztBQUFBOztBQUNSLGFBQ0U7QUFBQTtBQUFBO0FBQ0UsY0FBRyxnQ0FETDtBQUVFLHFCQUFVLGlCQUZaO0FBR0UsdUJBQWEscUJBQUNDLFVBQUQsRUFBZ0I7QUFDM0I7QUFDQUEsdUJBQVdDLGVBQVg7QUFDRCxXQU5IO0FBT0UsaUJBQU8sS0FBS0MsaUJBQUwsRUFQVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRRTtBQUFBO0FBQUE7QUFDRSxnQkFBRyw2QkFETDtBQUVFLG1CQUFPLEtBQUtDLGVBQUwsRUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHRTtBQUNFLGdCQUFHLGlDQURMO0FBRUUsbUJBQU8sS0FBS0Msa0JBQUwsRUFGVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFIRjtBQU1HLGVBQUtDLGdCQUFMO0FBTkgsU0FSRjtBQWdCRTtBQUFBO0FBQUE7QUFDRSxnQkFBRyw4QkFETDtBQUVFLG1CQUFPLEtBQUtDLHFCQUFMLEVBRlQ7QUFHRSx1QkFBVSxXQUhaO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUlFO0FBQ0Usa0JBQUssWUFEUDtBQUVFLHlCQUFZLHNCQUZkO0FBR0UsdUJBQVcsS0FIYjtBQUlFLG1CQUFPLEtBQUtsSyxLQUFMLENBQVdDLGlCQUpwQjtBQUtFLHFCQUFVLEtBQUs1QixLQUFMLENBQVd5QixPQUFYLElBQXNCLEtBQUt6QixLQUFMLENBQVd5QixPQUFYLENBQW1CcUssb0NBQW5CLEVBQXZCLElBQXFGLEVBTGhHO0FBTUUsc0JBQVUsS0FBS3RKLHNCQUFMLENBQTRCL0IsSUFBNUIsQ0FBaUMsSUFBakMsQ0FOWjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFKRixTQWhCRjtBQTRCRTtBQUFBO0FBQUE7QUFDRSxnQkFBRyw2QkFETDtBQUVFLHVCQUFVLFdBRlo7QUFHRSxtQkFBTztBQUNMZ0osd0JBQVUsVUFETDtBQUVMVSxtQkFBSyxDQUZBO0FBR0xLLG9CQUFNMUwsZUFBZSxDQUFmLEdBQW1CLEdBSHBCO0FBSUwrSixxQkFBTyxHQUpGO0FBS0xrRCxzQkFBUSxRQUxIO0FBTUxsQix5QkFBVyxRQU5OO0FBT0xaLHFCQUFPLE1BUEY7QUFRTGhCLHNCQUFRO0FBUkgsYUFIVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxtQ0FhMEIsS0FBSytDLGVBQUw7QUFiMUIsU0E1QkY7QUEyQ0U7QUFDRSxjQUFHLG9DQURMO0FBRUUscUJBQVcsS0FBS0MseUJBQUwsRUFGYjtBQUdFLGVBQUssYUFBQ3hLLE9BQUQsRUFBYTtBQUNoQixtQkFBS3hCLFFBQUwsR0FBZ0J3QixPQUFoQjtBQUNELFdBTEg7QUFNRSxpQkFBTyxLQUFLeUsscUJBQUwsRUFOVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUEzQ0Y7QUFrREU7QUFBQTtBQUFBO0FBQ0UscUJBQVMsbUJBQU07QUFDYixxQkFBSzVFLFFBQUw7QUFDRCxhQUhIO0FBSUUsbUJBQU87QUFDTG1DLHdCQUFVLFVBREw7QUFFTDBDLHNCQUFRLENBRkg7QUFHTEMscUJBQU8sRUFIRjtBQUlMdEQsc0JBQVEsRUFKSDtBQUtMbUIscUJBQU8sTUFMRjtBQU1MaEIsc0JBQVEsS0FOSDtBQU9MRyx3QkFBVSxNQVBMO0FBUUxpRCw2QkFBZSxNQVJWO0FBU0xDLDhCQUFnQjtBQVRYLGFBSlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWxERjtBQW1FRTtBQUFBO0FBQUE7QUFDRSxxQkFBUyxtQkFBTTtBQUNiLHFCQUFLakYsTUFBTDtBQUNELGFBSEg7QUFJRSxzQkFBVSxDQUFDLEtBQUtrRix1QkFBTCxFQUpiO0FBS0UsbUJBQU87QUFDTDlDLHdCQUFVLFVBREw7QUFFTDBDLHNCQUFRLENBRkg7QUFHTEMscUJBQU8sRUFIRjtBQUlMdEQsc0JBQVEsRUFKSDtBQUtMbUIscUJBQVEsS0FBS3NDLHVCQUFMLEVBQUQsR0FBbUMsa0JBQVFDLEtBQTNDLEdBQW1ELE1BTHJEO0FBTUw5SixzQkFBUyxLQUFLNkosdUJBQUwsRUFBRCxHQUFtQyxTQUFuQyxHQUErQyxhQU5sRDtBQU9MdEQsc0JBQVEsS0FQSDtBQVFMRyx3QkFBVSxNQVJMO0FBU0xpRCw2QkFBZSxNQVRWO0FBVUxJLHNDQUF1QixLQUFLRix1QkFBTCxFQUFELEdBQW1DLGtCQUFRQyxLQUEzQyxHQUFtRCxNQUF6RSxDQVZLO0FBV0x4RCw0QkFBYyxLQVhUO0FBWUw0Qix1QkFBUztBQVpKLGFBTFQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQW5FRixPQURGO0FBa0dEOzs7O0VBcnBCNkMsZ0JBQU04QixTOztrQkFBakMzTSxrQiIsImZpbGUiOiJFdmVudEhhbmRsZXJFZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5pbXBvcnQgbG9kYXNoIGZyb20gJ2xvZGFzaCdcbmltcG9ydCBDb2RlTWlycm9yIGZyb20gJ2NvZGVtaXJyb3InXG5pbXBvcnQgeyBDcmVhdGFibGUgfSBmcm9tICdyZWFjdC1zZWxlY3QtcGx1cydcbmltcG9ydCB0cnVuY2F0ZSBmcm9tICcuL2hlbHBlcnMvdHJ1bmNhdGUnXG5pbXBvcnQgcGFyc2VFeHByZXNzaW9uIGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL2FzdC9wYXJzZUV4cHJlc3Npb24nXG5pbXBvcnQgbWFyc2hhbFBhcmFtcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL21hcnNoYWxQYXJhbXMnXG5pbXBvcnQgZnVuY3Rpb25Ub1JGTyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL2Z1bmN0aW9uVG9SRk8nXG5pbXBvcnQgcmVpZnlSRk8gZnJvbSAnQGhhaWt1L3BsYXllci9saWIvcmVmbGVjdGlvbi9yZWlmeVJGTydcbi8vIGltcG9ydCBBdXRvQ29tcGxldGVyIGZyb20gJy4vQXV0b0NvbXBsZXRlcidcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmNvbnN0IEhhaWt1TW9kZSA9IHJlcXVpcmUoJy4vbW9kZXMvaGFpa3UnKVxuXG5jb25zdCBFVkFMVUFUT1JfU1RBVEVTID0ge1xuICBOT05FOiAxLCAvLyBOb25lIG1lYW5zIG5vdGhpbmcgdG8gZXZhbHVhdGUgYXQgYWxsXG4gIE9QRU46IDIsIC8vIEFueXRoaW5nID49IE9QRU4gaXMgYWxzbyAnb3BlbidcbiAgSU5GTzogMyxcbiAgV0FSTjogNCxcbiAgRVJST1I6IDVcbn1cblxuY29uc3QgTkFWSUdBVElPTl9ESVJFQ1RJT05TID0ge1xuICBTQU1FOiAwLFxuICBORVhUOiArMSxcbiAgUFJFVjogLTFcbn1cblxuY29uc3QgRURJVE9SX1dJRFRIID0gNTAwXG5jb25zdCBFRElUT1JfSEVJR0hUID0gMzAwXG5jb25zdCBFRElUT1JfTElORV9IRUlHSFQgPSAxOFxuXG5jb25zdCBNQVhfQVVUT0NPTVBMRVRJT05fRU5UUklFUyA9IDhcblxuZnVuY3Rpb24gbW9kIChpZHgsIG1heCkge1xuICByZXR1cm4gKGlkeCAlIG1heCArIG1heCkgJSBtYXhcbn1cblxuZnVuY3Rpb24gc2V0T3B0aW9ucyAob3B0cykge1xuICBmb3IgKHZhciBrZXkgaW4gb3B0cykgdGhpcy5zZXRPcHRpb24oa2V5LCBvcHRzW2tleV0pXG4gIHJldHVybiB0aGlzXG59XG5cbmZ1bmN0aW9uIGdldFJlbmRlcmFibGVWYWx1ZU11bHRpbGluZSAob2ZmaWNpYWxWYWx1ZSwgc2tpcEZvcm1hdHRpbmcpIHtcbiAgLy8gVXBkYXRlIHRoZSBlZGl0b3IgY29udGVudHNcbiAgbGV0IHBhcmFtcyA9ICcnXG4gIGlmIChvZmZpY2lhbFZhbHVlLnBhcmFtcyAmJiBvZmZpY2lhbFZhbHVlLnBhcmFtcy5sZW5ndGggPiAwKSB7XG4gICAgcGFyYW1zID0gbWFyc2hhbFBhcmFtcyhvZmZpY2lhbFZhbHVlLnBhcmFtcylcbiAgfVxuXG4gIGlmIChza2lwRm9ybWF0dGluZykge1xuICAgIHJldHVybiBgZnVuY3Rpb24gKCR7cGFyYW1zfSkge1xuJHtvZmZpY2lhbFZhbHVlLmJvZHl9XG59YFxuICB9IGVsc2Uge1xuICAgIHJldHVybiBgZnVuY3Rpb24gKCR7cGFyYW1zfSkge1xuICAke29mZmljaWFsVmFsdWUuYm9keX1cbn1gXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXZlbnRIYW5kbGVyRWRpdG9yIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IgKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLl9jb250ZXh0ID0gbnVsbCAvLyBPdXIgY29udGV4dCBlbGVtZW50IG9uIHdoaWNoIHRvIG1vdW50IGNvZGVtaXJyb3JcblxuICAgIHRoaXMuY29kZW1pcnJvciA9IENvZGVNaXJyb3IoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksIHtcbiAgICAgIHRoZW1lOiAnaGFpa3UnLFxuICAgICAgbW9kZTogJ2hhaWt1JyxcbiAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgc2Nyb2xsYmFyU3R5bGU6ICduYXRpdmUnXG4gICAgfSlcbiAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0T3B0aW9ucyA9IHNldE9wdGlvbnMuYmluZCh0aGlzLmNvZGVtaXJyb3IpXG4gICAgdGhpcy5jb2RlbWlycm9yLnNldFZhbHVlKCcnKVxuICAgIHRoaXMuY29kZW1pcnJvci5zZXRTaXplKEVESVRPUl9XSURUSCAtIDM1LCBFRElUT1JfSEVJR0hUIC0gMTAwKVxuICAgIHRoaXMuY29kZW1pcnJvci5yZWZyZXNoKCkgLy8gTXVzdCBjYWxsIHRoaXMgaGVyZSBvciB0aGUgZ3V0dGVyIG1hcmdpbiB3aWxsIGJlIHNjcmV3ZWQgdXBcbiAgICB0aGlzLmNvZGVtaXJyb3Iub24oJ2NoYW5nZScsIHRoaXMuaGFuZGxlRWRpdG9yQ2hhbmdlLmJpbmQodGhpcykpXG4gICAgdGhpcy5jb2RlbWlycm9yLm9uKCdrZXlkb3duJywgdGhpcy5oYW5kbGVFZGl0b3JLZXlkb3duLmJpbmQodGhpcykpXG4gICAgdGhpcy5jb2RlbWlycm9yLm9uKCdiZWZvcmVDaGFuZ2UnLCAoY20sIGNoYW5nZU9iamVjdCkgPT4ge1xuICAgICAgLy8gSWYgbXVsdGlsaW5lIG1vZGUsIG9ubHkgYWxsb3cgYSBjaGFuZ2UgdG8gdGhlIGZ1bmN0aW9uIGJvZHksIG5vdCB0aGUgc2lnbmF0dXJlXG4gICAgICAvLyBTaW1wbHkgY2FuY2VsIGFueSBjaGFuZ2UgdGhhdCBvY2N1cnMgaW4gZWl0aGVyIG9mIHRob3NlIHBsYWNlcy5cbiAgICAgIGlmIChjaGFuZ2VPYmplY3Qub3JpZ2luICE9PSAnc2V0VmFsdWUnKSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHRoaXMuY29kZW1pcnJvci5nZXRWYWx1ZSgpLnNwbGl0KCdcXG4nKVxuICAgICAgICBpZiAoY2hhbmdlT2JqZWN0LmZyb20ubGluZSA9PT0gMCB8fCBjaGFuZ2VPYmplY3QuZnJvbS5saW5lID49IGxpbmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICByZXR1cm4gY2hhbmdlT2JqZWN0LmNhbmNlbCgpXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wcm9wcy5lbGVtZW50LnNldEV2ZW50SGFuZGxlclNhdmVTdGF0dXModGhpcy5zdGF0ZS5zZWxlY3RlZEV2ZW50TmFtZSwgZmFsc2UpXG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBzZWxlY3RlZEV2ZW50TmFtZTogJ2NsaWNrJywgLy8gU2VlbXMgYSBnb29kIGRlZmF1bHQgZXZlbnQgdG8gd29yayB3aXRoXG4gICAgICBjdXN0b21FdmVudE9wdGlvbnM6IFtdLCAvLyBBbGxvdyB1c2VyIHRvIHR5cGUgaW4gYSBjdXN0b20gZXZlbnQgbmFtZVxuICAgICAgYXV0b0NvbXBsZXRpb25zOiBbXSxcbiAgICAgIGV2YWx1YXRvclRleHQ6IG51bGwsXG4gICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5OT05FLFxuICAgICAgb3JpZ2luYWxWYWx1ZTogbnVsbCxcbiAgICAgIGVkaXRlZFZhbHVlOiBudWxsXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICB3aGlsZSAodGhpcy5fY29udGV4dC5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQucmVtb3ZlQ2hpbGQodGhpcy5fY29udGV4dC5maXJzdENoaWxkKVxuICAgICAgfVxuICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLmNvZGVtaXJyb3IuZ2V0V3JhcHBlckVsZW1lbnQoKVxuICAgICAgdGhpcy5fY29udGV4dC5hcHBlbmRDaGlsZCh3cmFwcGVyKVxuICAgIH1cblxuICAgIC8vIE5vdCByZWFsbHkgYSBjaGFuZ2UgZXZlbnQsIGJ1dCBpdCBjb250YWlucyB0aGUgc2FtZSBidXNpbmVzcyBsb2dpYyB3ZSB3YW50Li4uXG4gICAgdGhpcy5oYW5kbGVDaGFuZ2VkRXZlbnROYW1lKHsgdmFsdWU6IHRoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudE5hbWUgfSwgdHJ1ZSlcbiAgfVxuXG4gIHJlY2FsaWJyYXRlRWRpdG9yIChjdXJzb3IpIHtcbiAgICBsZXQgcmVuZGVyYWJsZSA9IGdldFJlbmRlcmFibGVWYWx1ZU11bHRpbGluZSh0aGlzLnN0YXRlLmVkaXRlZFZhbHVlKVxuXG4gICAgdGhpcy5jb2RlbWlycm9yLnNldFZhbHVlKHJlbmRlcmFibGUpXG5cbiAgICAvLyBJZiBjdXJzb3IgZXhwbGljaXRseSBwYXNzZWQsIHVzZSBpdC4gVGhpcyBpcyB1c2VkIGJ5IGNob29zZUF1dG9jb21wbGV0aW9uXG4gICAgaWYgKGN1cnNvcikge1xuICAgICAgdGhpcy5jb2RlbWlycm9yLnNldEN1cnNvcihjdXJzb3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY29kZW1pcnJvci5zZXRDdXJzb3IoeyBsaW5lOiAxLCBjaDogcmVuZGVyYWJsZS5zcGxpdCgnXFxuJylbMV0ubGVuZ3RoIH0pXG4gICAgfVxuXG4gICAgdGhpcy5mb3JjZVVwZGF0ZSgpXG4gIH1cblxuICBpc0NvbW1pdHRhYmxlVmFsdWVJbnZhbGlkIChjb21taXR0YWJsZSwgb3JpZ2luYWwpIHtcbiAgICAvLyBJZiB3ZSBoYXZlIGFueSBlcnJvci93YXJuaW5nIGluIHRoZSBldmFsdWF0b3IsIGFzc3VtZSBpdCBhcyBncm91bmRzIG5vdCB0byBjb21taXRcbiAgICAvLyB0aGUgY3VycmVudCBjb250ZW50IG9mIHRoZSBmaWVsZC4gQmFzaWNhbGx5IGxldmVyYWdpbmcgcHJlLXZhbGlkYXRpb24gd2UndmUgYWxyZWFkeSBkb25lLlxuICAgIGlmICh0aGlzLnN0YXRlLmV2YWx1YXRvclN0YXRlID4gRVZBTFVBVE9SX1NUQVRFUy5JTkZPKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWFzb246IHRoaXMuc3RhdGUuZXZhbHVhdG9yVGV4dFxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZ2V0Q29tbWl0YWJsZVZhbHVlICh2YWx1ZURlc2NyaXB0b3IsIG9yaWdpbmFsRGVzY3JpcHRvcikge1xuICAgIC8vIE5vdGUgdGhhdCBleHRyYS9jYWNoZWQgZmllbGRzIGFyZSBzdHJpcHBlZCBvZmYgb2YgdGhlIGZ1bmN0aW9uLCBsaWtlICcuc3VtbWFyeSdcbiAgICByZXR1cm4ge1xuICAgICAgX19mdW5jdGlvbjoge1xuICAgICAgICBwYXJhbXM6IHZhbHVlRGVzY3JpcHRvci5wYXJhbXMsXG4gICAgICAgIGJvZHk6IHZhbHVlRGVzY3JpcHRvci5ib2R5XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZG9TYXZlICgpIHtcbiAgICBsZXQgb3JpZ2luYWwgPSB0aGlzLnN0YXRlLm9yaWdpbmFsVmFsdWVcbiAgICBsZXQgY29tbWl0dGFibGUgPSB0aGlzLmdldENvbW1pdGFibGVWYWx1ZSh0aGlzLnN0YXRlLmVkaXRlZFZhbHVlLCBvcmlnaW5hbClcbiAgICBsZXQgaW52YWxpZCA9IHRoaXMuaXNDb21taXR0YWJsZVZhbHVlSW52YWxpZChjb21taXR0YWJsZSwgb3JpZ2luYWwpXG5cbiAgICAvLyBJZiBpbnZhbGlkLCBkb24ndCBwcm9jZWVkIC0ga2VlcCB0aGUgaW5wdXQgaW4gYSBmb2N1c2VkK3NlbGVjdGVkIHN0YXRlLFxuICAgIC8vIGFuZCB0aGVuIHNob3cgYW4gZXJyb3IgbWVzc2FnZSBpbiB0aGUgZXZhbHVhdG9yIHRvb2x0aXBcbiAgICBpZiAoaW52YWxpZCkge1xuICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5FUlJPUixcbiAgICAgICAgZXZhbHVhdG9yVGV4dDogaW52YWxpZC5yZWFzb25cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvcmlnaW5hbFZhbHVlOiB0aGlzLnN0YXRlLmVkaXRlZFZhbHVlXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5wcm9wcy5zYXZlKFxuICAgICAgICB0aGlzLnByb3BzLmVsZW1lbnQsXG4gICAgICAgIHRoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudE5hbWUsXG4gICAgICAgIHsgaGFuZGxlcjogY29tbWl0dGFibGUgfSAvLyBUaGUgY29tbWl0dGFibGUgaXMgc2VyaWFsaXplZCwgaS5lLiBfX2Z1bmN0aW9uOiB7Li4ufVxuICAgICAgKVxuXG4gICAgICB0aGlzLnByb3BzLmVsZW1lbnQuc2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyh0aGlzLnN0YXRlLnNlbGVjdGVkRXZlbnROYW1lLCB0cnVlKVxuICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpXG4gICAgfSlcbiAgfVxuXG4gIGRvQ2FuY2VsICgpIHtcbiAgICAvLyAjVE9ETzogV2hhdCBlbHNlP1xuICAgIHRoaXMucHJvcHMuY2xvc2UoKVxuICB9XG5cbiAgd2lsbEhhbmRsZUV4dGVybmFsS2V5ZG93bkV2ZW50IChrZXlkb3duRXZlbnQpIHtcbiAgICBpZiAoa2V5ZG93bkV2ZW50Ll9hbHJlYWR5SGFuZGxlZCkge1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcm9wcy5lbGVtZW50KSB7IC8vIDx+IFBvc3NpYmx5IG5vdCBuZWVkZWQsIGJ1dCB0aGlzIGlzIGEgY2hlY2sgdG8gd2hldGhlciB3ZSdyZSBsaXZlIG9yIG5vdFxuICAgICAgLy8gV2hlbiBmb2N1c2VkLCBhc3N1bWUgd2UgKmFsd2F5cyogaGFuZGxlIGtleWJvYXJkIGV2ZW50cywgbm8gZXhjZXB0aW9ucy5cbiAgICAgIC8vIElmIHlvdSB3YW50IHRvIGhhbmRsZSBhbiBpbnB1dCB3aGVuIGZvY3VzZWQsIHVzZWQgaGFuZGxlRWRpdG9yS2V5ZG93blxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIGZldGNoRXZlbnRIYW5kbGVyVmFsdWVEZXNjcmlwdG9yIChldmVudE5hbWUpIHtcbiAgICBsZXQgZXh0YW50ID0gdGhpcy5wcm9wcy5lbGVtZW50ICYmIHRoaXMucHJvcHMuZWxlbWVudC5nZXRSZWlmaWVkRXZlbnRIYW5kbGVyKGV2ZW50TmFtZSlcblxuICAgIGxldCBmb3VuZFxuICAgIGlmIChleHRhbnQgJiYgZXh0YW50LmhhbmRsZXIpIHtcbiAgICAgIC8vIFRoZSBwbGF5ZXIgd3JhcHMgJ2hhbmRsZXInIHRvIG1ha2Ugc3VyZSBiaW5kaW5nIGlzIGNvcnJlY3QsIGJ1dCB3ZSB3YW50IHRoZSBvcmlnaW5hbFxuICAgICAgLy8gZnVuY3Rpb24gaXRzZWxmIHNvIHdlIGNhbiBhY3R1YWxseSBhY2Nlc3MgaXRzIGJvZHkgYW5kIHBhcmFtZXRlcnMsIGV0Yy5cbiAgICAgIHZhciBvcmlnaW5hbCA9IGV4dGFudC5vcmlnaW5hbCB8fCBleHRhbnQuaGFuZGxlclxuICAgICAgZm91bmQgPSBmdW5jdGlvblRvUkZPKG9yaWdpbmFsKS5fX2Z1bmN0aW9uXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvdW5kID0ge1xuICAgICAgICBwYXJhbXM6IFsnZXZlbnQnXSxcbiAgICAgICAgYm9keTogJy8vIFwiJyArIGV2ZW50TmFtZSArICdcIiBldmVudCBsb2dpYyBnb2VzIGhlcmUnXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kXG4gIH1cblxuICBzdG9yZUVkaXRlZFZhbHVlIChldmVudE5hbWUsIGZ1bmN0aW9uU3BlYykge1xuICAgIHZhciBmbiA9IHJlaWZ5UkZPKGZ1bmN0aW9uU3BlYylcblxuICAgIC8vIFRoaXMganVzdCBzdG9yZXMgdGhlIHVwZGF0ZWQgZnVuY3Rpb24gaW4gbWVtb3J5IGJ1dCBkb2VzIF9ub3RfIHBlcnNpc3QgaXQhXG4gICAgdGhpcy5wcm9wcy5lbGVtZW50LnVwc2VydEV2ZW50SGFuZGxlcihldmVudE5hbWUsIHtcbiAgICAgIGhhbmRsZXI6IGZuXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZWRFdmVudE5hbWUgKGNoYW5nZUV2ZW50KSB7XG4gICAgaWYgKGNoYW5nZUV2ZW50KSB7XG4gICAgICB2YXIgZXhpc3RpbmdIYW5kbGVyID0gdGhpcy5mZXRjaEV2ZW50SGFuZGxlclZhbHVlRGVzY3JpcHRvcihjaGFuZ2VFdmVudC52YWx1ZSlcblxuICAgICAgaWYgKHRoaXMucHJvcHMuZWxlbWVudCkge1xuICAgICAgICB0aGlzLnN0b3JlRWRpdGVkVmFsdWUoY2hhbmdlRXZlbnQudmFsdWUsIGV4aXN0aW5nSGFuZGxlcilcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGV2YWx1YXRvclRleHQ6IG51bGwsXG4gICAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLk9QRU4sXG4gICAgICAgIHNlbGVjdGVkRXZlbnROYW1lOiBjaGFuZ2VFdmVudC52YWx1ZSxcbiAgICAgICAgb3JpZ2luYWxWYWx1ZTogZXhpc3RpbmdIYW5kbGVyLFxuICAgICAgICBlZGl0ZWRWYWx1ZTogZXhpc3RpbmdIYW5kbGVyXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMucmVjYWxpYnJhdGVFZGl0b3IoKVxuICAgICAgICB0aGlzLmhhbmRsZUVkaXRvckNoYW5nZSh0aGlzLmNvZGVtaXJyb3IsIHt9LCB0cnVlKVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBoYW5kbGVFZGl0b3JDaGFuZ2UgKGNtLCBjaGFuZ2VPYmplY3QsIGFsc29TZXRPcmlnaW5hbCwgd2FzSW50ZXJuYWxDYWxsKSB7XG4gICAgaWYgKGNoYW5nZU9iamVjdC5vcmlnaW4gPT09ICdzZXRWYWx1ZScpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIEFueSBjaGFuZ2Ugc2hvdWxkIHVuc2V0IHRoZSBjdXJyZW50IGVycm9yIHN0YXRlIG9mIHRoZVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXZhbHVhdG9yVGV4dDogbnVsbFxuICAgIH0pXG5cbiAgICBsZXQgcmF3VmFsdWVGcm9tRWRpdG9yID0gY20uZ2V0VmFsdWUoKVxuXG4gICAgLy8gVGhlIGJvZHkgd2lsbCBkZXRlcm1pbmUgdGhlIHBhcmFtcywgc28gd2UgY2FuIHNhZmVseSBkaXNjYXJkIHRoZSBmdW5jdGlvbiBwcmVmaXgvc3VmZml4XG4gICAgbGV0IGxpbmVzID0gcmF3VmFsdWVGcm9tRWRpdG9yLnNwbGl0KCdcXG4nKVxuICAgIGxldCBib2R5ID0gbGluZXMuc2xpY2UoMSwgbGluZXMubGVuZ3RoIC0gMSkuam9pbignXFxuJylcbiAgICBsZXQgb2ZmaWNpYWxWYWx1ZSA9IHtcbiAgICAgIHBhcmFtczogWydldmVudCddLFxuICAgICAgYm9keTogYm9keVxuICAgIH1cblxuICAgIC8vIEJ5IGRlZmF1bHQsIGFzc3VtZSB3ZSBhcmUgaW4gYW4gb3BlbiBldmFsdWF0b3Igc3RhdGUgKHdpbGwgY2hlY2sgZm9yIGVycm9yIGluIGEgbW9tZW50KVxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZXZhbHVhdG9yU3RhdGU6IEVWQUxVQVRPUl9TVEFURVMuT1BFTlxuICAgIH0pXG5cbiAgICAvLyBJZiB0aGUgbGFzdCBlbnRyeSB3YXMgYSBzcGFjZSwgcmVtb3ZlIGF1dG9jb21wbGV0ZSBiZWZvcmUgd2Ugc3RhcnQgcGFyc2luZywgd2hpY2ggbWlnaHQgZmFpbFxuICAgIC8vIGlmIHdlIGhhdmUgYW4gaW5jb21wbGV0ZSBldmVudC1oYW5kbGVyLWluLXByb2dyZXNzIGluc2lkZSB0aGUgZWRpdG9yXG4gICAgLy8gQWxzbyByZW1vdmUgYW55IGNvbXBsZXRpb25zIGlmIHRoZSBlZGl0b3IgZG9lcyBub3QgaGF2ZSBmb2N1c1xuICAgIGlmICghY20uaGFzRm9jdXMoKSB8fCAoY2hhbmdlT2JqZWN0ICYmIGNoYW5nZU9iamVjdC50ZXh0ICYmIGNoYW5nZU9iamVjdC50ZXh0WzBdID09PSAnICcpKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgYXV0b0NvbXBsZXRpb25zOiBbXVxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyBUaGlzIHdyYXBwaW5nIGlzIHJlcXVpcmVkIGZvciBwYXJzaW5nIHRvIHdvcmsgKHBhcmVucyBhcmUgbmVlZGVkIHRvIG1ha2UgaXQgYW4gZXZlbnQtaGFuZGxlcilcbiAgICBsZXQgd3JhcHBlZCA9IHBhcnNlRXhwcmVzc2lvbi53cmFwKG9mZmljaWFsVmFsdWUuYm9keSlcbiAgICBsZXQgY3Vyc29yMSA9IHRoaXMuY29kZW1pcnJvci5nZXRDdXJzb3IoKVxuXG4gICAgbGV0IHBhcnNlID0gcGFyc2VFeHByZXNzaW9uKHdyYXBwZWQsIHt9LCBIYWlrdU1vZGUua2V5d29yZHMsIHRoaXMuc3RhdGUsIHtcbiAgICAgIGxpbmU6IHRoaXMuZ2V0Q3Vyc29yT2Zmc2V0TGluZShjdXJzb3IxKSxcbiAgICAgIGNoOiB0aGlzLmdldEN1cnNvck9mZnNldENoYXIoY3Vyc29yMSlcbiAgICB9LCB7XG4gICAgICAvLyBUaGVzZSBjaGVja3MgYXJlIG9ubHkgbmVlZGVkIGZvciBleHByZXNzaW9ucyBpbiB0aGUgdGltZWxpbmUsIHNvIHNraXAgdGhlbSBoZXJlXG4gICAgICBza2lwUGFyYW1zSW1wdXJpdHlDaGVjazogdHJ1ZSxcbiAgICAgIHNraXBGb3JiaWRkZW5zQ2hlY2s6IHRydWVcbiAgICB9KVxuXG4gICAgdGhpcy5fcGFyc2UgPSBwYXJzZSAvLyBDYWNoaW5nIHRoaXMgdG8gbWFrZSBpdCBmYXN0ZXIgdG8gcmVhZCBmb3IgYXV0b2NvbXBsZXRpb25zXG5cbiAgICBpZiAocGFyc2UuZXJyb3IpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhdXRvQ29tcGxldGlvbnM6IFtdLFxuICAgICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5FUlJPUixcbiAgICAgICAgZXZhbHVhdG9yVGV4dDogcGFyc2UuZXJyb3IubWVzc2FnZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZiAoIXBhcnNlLmVycm9yKSB7XG4gICAgICBpZiAocGFyc2Uud2FybmluZ3MubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5XQVJOLFxuICAgICAgICAgIGV2YWx1YXRvclRleHQ6IHBhcnNlLndhcm5pbmdzWzBdLmFubm90YXRpb25cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKGNtLmhhc0ZvY3VzKCkpIHtcbiAgICAgICAgbGV0IGNvbXBsZXRpb25zID0gcGFyc2UuY29tcGxldGlvbnMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIHZhciBuYSA9IGEubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgdmFyIG5iID0gYi5uYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICBpZiAobmEgPCBuYikgcmV0dXJuIC0xXG4gICAgICAgICAgaWYgKG5hID4gbmIpIHJldHVybiAxXG4gICAgICAgICAgcmV0dXJuIDBcbiAgICAgICAgfSkuc2xpY2UoMCwgTUFYX0FVVE9DT01QTEVUSU9OX0VOVFJJRVMpXG5cbiAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBpbml0aWFsIGNvbXBsZXRpb24gaW4gdGhlIGxpc3RcbiAgICAgICAgaWYgKGNvbXBsZXRpb25zWzBdKSB7XG4gICAgICAgICAgY29tcGxldGlvbnNbMF0uaGlnaGxpZ2h0ZWQgPSB0cnVlXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBhdXRvQ29tcGxldGlvbnM6IGNvbXBsZXRpb25zXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgICBhdXRvQ29tcGxldGlvbnM6IFtdXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2UgY2FuJ3Qgc3RvcmUgdGhlIGVkaXRlZCB2YWx1ZSBpZiBpdCBkb2Vzbid0IHBhcnNlLCBzaW5jZSBzdG9yaW5nIGl0IHJlcXVpcmVzIHRoYXRcbiAgICAvLyB3ZSBzYXZlIHRoZSByZWlmaWVkIHZlcnNpb24sIHdoaWNoIGRlcGVuZHMgb24gYG5ldyBGdW5jdGlvbmBcbiAgICBpZiAoIXBhcnNlLmVycm9yKSB7XG4gICAgICAvLyBTdG9yZSB0aGUgZWRpdGVkIGNvZGUgaW4gbWVtb3J5IG9uIHRoZSBlbGVtZW50IHNvIHdlIGNhbiByZXRyaWV2ZSBpdCBpZiB3ZSBuYXZpZ2F0ZVxuICAgICAgdGhpcy5zdG9yZUVkaXRlZFZhbHVlKHRoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudE5hbWUsIG9mZmljaWFsVmFsdWUpXG4gICAgfVxuXG4gICAgLy8gTmVlZCB0aGlzIGZvciB3aGVuIHdlIGZpcnN0IGxvYWQgdGhlIGNvZGUsIG91ciBpbnRlcm5hbCBtb2RzIG1pZ2h0IGNoYW5nZSBpdCBzdWJ0bGVseVxuICAgIC8vIGJ1dCB3ZSBkb24ndCB3YW50IGEgZmFsc2UgcG9zaXRpdmUgZm9yIHdoZW4gYSBzYXZlIGlzIHJlcXVpcmVkXG4gICAgaWYgKGFsc29TZXRPcmlnaW5hbCkge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIG9yaWdpbmFsVmFsdWU6IG9mZmljaWFsVmFsdWUsXG4gICAgICAgIGVkaXRlZFZhbHVlOiBvZmZpY2lhbFZhbHVlXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZWRpdGVkVmFsdWU6IG9mZmljaWFsVmFsdWVcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUgKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5lbGVtZW50KSByZXR1cm4gZmFsc2VcbiAgICB2YXIgc3RhdHVzID0gdGhpcy5wcm9wcy5lbGVtZW50LmdldEV2ZW50SGFuZGxlclNhdmVTdGF0dXModGhpcy5zdGF0ZS5zZWxlY3RlZEV2ZW50TmFtZSlcbiAgICBpZiAoc3RhdHVzID09PSBudWxsIHx8IHN0YXR1cyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2VcbiAgICAvLyBJZiB0aGUgc3RhdHVzIGlzIGZhbHNlLCBpLmUuIFwibm90IHNhdmVkIGZyb20gYSBjaGFuZ2VcIiwgdGhlbiB5ZXMsIHdlIG5lZWQgYSBzYXZlLi4uXG4gICAgcmV0dXJuICFzdGF0dXNcbiAgfVxuXG4gIGhhbmRsZUVkaXRvcktleWRvd24gKGNtLCBrZXlkb3duRXZlbnQpIHtcbiAgICBrZXlkb3duRXZlbnQuX2FscmVhZHlIYW5kbGVkID0gdHJ1ZVxuXG4gICAgbGV0IGhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zID0gdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnMuZmlsdGVyKChjb21wbGV0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gISFjb21wbGV0aW9uLmhpZ2hsaWdodGVkXG4gICAgfSlcblxuICAgIC8vIEZpcnN0LCBoYW5kbGUgYW55IGF1dG9jb21wbGV0aW9ucyBpZiB3ZSdyZSBpbiBhbiBhdXRvY29tcGxldGUtYWN0aXZlIHN0YXRlLCBpLmUuLFxuICAgIC8vIGlmIHdlIGFyZSBzaG93aW5nIGF1dG9jb21wbGV0ZSBhbmQgaWYgdGhlcmUgYXJlIGFueSBvZiB0aGVtIGN1cnJlbnRseSBoaWdobGlnaHRlZFxuICAgIGlmIChoaWdobGlnaHRlZEF1dG9Db21wbGV0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSA0MCkgeyAvLyBBcnJvd0Rvd25cbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGVBdXRvQ29tcGxldGlvbihOQVZJR0FUSU9OX0RJUkVDVElPTlMuTkVYVClcbiAgICAgIH0gZWxzZSBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzOCkgeyAvLyBBcnJvd1VwXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLm5hdmlnYXRlQXV0b0NvbXBsZXRpb24oTkFWSUdBVElPTl9ESVJFQ1RJT05TLlBSRVYpXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMzcpIHsgLy8gQXJyb3dMZWZ0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhdXRvQ29tcGxldGlvbnM6IFtdIH0pXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMzkpIHsgLy8gQXJyb3dSaWdodFxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgYXV0b0NvbXBsZXRpb25zOiBbXSB9KVxuICAgICAgfSBlbHNlIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDEzICYmICFrZXlkb3duRXZlbnQuc2hpZnRLZXkpIHsgLy8gRW50ZXIgKHdpdGhvdXQgU2hpZnQgb25seSEpXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLmNob29zZUhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb24oKVxuICAgICAgfSBlbHNlIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDkpIHsgLy8gVGFiXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLmNob29zZUhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb24oKVxuICAgICAgfSBlbHNlIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZVxuICAgICAgICBrZXlkb3duRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7IGF1dG9Db21wbGV0aW9uczogW10gfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgaWYgKGtleWRvd25FdmVudC5tZXRhS2V5KSB7XG4gICAgICAgIC8vIE1ldGErRW50ZXIgd2hlbiBtdWx0aS1saW5lIGNvbW1pdHMgdGhlIHZhbHVlXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLmRvU2F2ZSgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gRXNjYXBlIGlzIHRoZSB1bml2ZXJzYWwgd2F5IHRvIGV4aXQgdGhlIGVkaXRvciB3aXRob3V0IGNvbW1pdHRpbmdcbiAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAyNykgeyAvLyBFc2NhcGVcbiAgICAgIHJldHVybiB0aGlzLmRvQ2FuY2VsKClcbiAgICB9XG4gIH1cblxuICBoYW5kbGVBdXRvQ29tcGxldGVyQ2xpY2sgKGNvbXBsZXRpb24pIHtcbiAgICB0aGlzLmNob29zZUF1dG9Db21wbGV0aW9uKGNvbXBsZXRpb24pXG4gIH1cblxuICBuYXZpZ2F0ZUF1dG9Db21wbGV0aW9uIChkaXJlY3Rpb24pIHtcbiAgICAvLyBJZiBvbmx5IG9uZSBpdGVtIGluIHRoZSBsaXN0LCBubyBuZWVkIHRvIGRvIGFueXRoaW5nLCBzaW5jZSB0aGVyZSdzIG5vd2hlcmUgdG8gbmF2aWdhdGVcbiAgICBpZiAodGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnMubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gU2hpZnQgdGhlIGN1cnJlbnRseSB0b2dnbGVkIGF1dG9jb21wbGV0aW9uIHRvIHRoZSBuZXh0IG9uZSBpbiB0aGUgbGlzdCwgdXNpbmcgYSB3cmFwYXJvdW5kLlxuICAgIGxldCBjaGFuZ2VkID0gZmFsc2VcbiAgICB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5mb3JFYWNoKChjb21wbGV0aW9uLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKCFjaGFuZ2VkKSB7XG4gICAgICAgIGlmIChjb21wbGV0aW9uLmhpZ2hsaWdodGVkKSB7XG4gICAgICAgICAgbGV0IG5pZHggPSBtb2QoaW5kZXggKyBkaXJlY3Rpb24sIHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zLmxlbmd0aClcbiAgICAgICAgICAvLyBNYXkgYXMgd2VsbCBjaGVjayBhbmQgc2tpcCBpZiB3ZSdyZSBhYm91dCB0byBtb2RpZnkgdGhlIGN1cnJlbnQgb25lXG4gICAgICAgICAgaWYgKG5pZHggIT09IGluZGV4KSB7XG4gICAgICAgICAgICBsZXQgbmV4dCA9IHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zW25pZHhdXG4gICAgICAgICAgICBjb21wbGV0aW9uLmhpZ2hsaWdodGVkID0gZmFsc2VcbiAgICAgICAgICAgIG5leHQuaGlnaGxpZ2h0ZWQgPSB0cnVlXG4gICAgICAgICAgICBjaGFuZ2VkID0gdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGF1dG9Db21wbGV0aW9uczogdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnNcbiAgICB9KVxuICB9XG5cbiAgY2hvb3NlSGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbiAoKSB7XG4gICAgbGV0IGNvbXBsZXRpb24gPSB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5maWx0ZXIoKGNvbXBsZXRpb24pID0+IHtcbiAgICAgIHJldHVybiAhIWNvbXBsZXRpb24uaGlnaGxpZ2h0ZWRcbiAgICB9KVswXVxuXG4gICAgLy8gTm90IHN1cmUgd2h5IHdlJ2QgZ2V0IGhlcmUsIGJ1dCBpbiBjYXNlLi4uXG4gICAgaWYgKCFjb21wbGV0aW9uKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIHRoZSBwYXJzZSBwb3B1bGF0ZWQsIHdlIHJlYWxseSBjYW4ndCBkbyBhbnl0aGluZ1xuICAgIGlmICghdGhpcy5fcGFyc2UpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIHRoaXMuY2hvb3NlQXV0b0NvbXBsZXRpb24oY29tcGxldGlvbilcbiAgfVxuXG4gIGNob29zZUF1dG9Db21wbGV0aW9uIChjb21wbGV0aW9uKSB7XG4gICAgbGV0IGxlbiA9IHRoaXMuX3BhcnNlLnRhcmdldC5lbmQgLSB0aGlzLl9wYXJzZS50YXJnZXQuc3RhcnRcbiAgICBsZXQgZG9jID0gdGhpcy5jb2RlbWlycm9yLmdldERvYygpXG4gICAgbGV0IGN1ciA9IHRoaXMuY29kZW1pcnJvci5nZXRDdXJzb3IoKVxuXG4gICAgZG9jLnJlcGxhY2VSYW5nZShcbiAgICAgIGNvbXBsZXRpb24ubmFtZSxcbiAgICAgIHsgbGluZTogY3VyLmxpbmUsIGNoOiBjdXIuY2ggLSBsZW4gfSxcbiAgICAgIGN1ciAvLyB7IGxpbmU6IE51bWJlciwgY2g6IE51bWJlciB9XG4gICAgKVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7IGF1dG9Db21wbGV0aW9uczogW10gfSlcbiAgfVxuXG4gIGdldEN1cnNvck9mZnNldENoYXIgKGN1cnMsIHNyYykge1xuICAgIHJldHVybiBjdXJzLmNoXG4gIH1cblxuICBnZXRDdXJzb3JPZmZzZXRMaW5lIChjdXJzLCBzcmMpIHtcbiAgICByZXR1cm4gY3Vycy5saW5lICsgMVxuICB9XG5cbiAgZ2V0RXZhbHVhdG9yVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZXZhbHVhdG9yVGV4dCB8fCAn4oCi4oCi4oCiJ1xuICB9XG5cbiAgZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IgKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5ldmFsdWF0b3JTdGF0ZSkge1xuICAgICAgY2FzZSBFVkFMVUFUT1JfU1RBVEVTLldBUk46IHJldHVybiBQYWxldHRlLk9SQU5HRVxuICAgICAgY2FzZSBFVkFMVUFUT1JfU1RBVEVTLkVSUk9SOiByZXR1cm4gUGFsZXR0ZS5SRURcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBQYWxldHRlLkNPQUxcbiAgICB9XG4gIH1cblxuICBnZXRFZGl0b3JDb250ZXh0Q2xhc3NOYW1lICgpIHtcbiAgICBsZXQgbmFtZSA9IFtdXG4gICAgbmFtZS5wdXNoKCdoYWlrdS1tdWx0aWxpbmUnKVxuICAgIG5hbWUucHVzaCgnaGFpa3UtZHluYW1pYycpXG4gICAgcmV0dXJuIG5hbWUuam9pbignICcpXG4gIH1cblxuICBnZXRDb250YWluZXJTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0ge1xuICAgICAgd2lkdGg6IEVESVRPUl9XSURUSCxcbiAgICAgIGhlaWdodDogRURJVE9SX0hFSUdIVCxcbiAgICAgIC8vIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogQ29sb3IoJyM0QzQzNEInKSxcbiAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICB6SW5kZXg6IDkwMDFcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXRFZGl0b3JDb250ZXh0U3R5bGUgKCkge1xuICAgIGxldCBzdHlsZSA9IGxvZGFzaC5hc3NpZ24oe1xuICAgICAgY3Vyc29yOiAnZGVmYXVsdCcsXG4gICAgICBmb250RmFtaWx5OiAnQ29uc29sYXMsIG1vbm9zcGFjZScsXG4gICAgICBmb250U2l6ZTogMTIsXG4gICAgICBsaW5lSGVpZ2h0OiBFRElUT1JfTElORV9IRUlHSFQgKyAncHgnLFxuICAgICAgaGVpZ2h0OiAnY2FsYygxMDAlIC0gODJweCknLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgIHBhZGRpbmdMZWZ0OiA3LFxuICAgICAgcGFkZGluZ1RvcDogMjAsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRleHRTaGFkb3c6ICcwIDAgMCAnICsgQ29sb3IoUGFsZXR0ZS5ST0NLKS5mYWRlKDAuMyksIC8vIGRhcmttYWdpY1xuICAgICAgekluZGV4OiAyMDA1LFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcignIzRDNDM0QicpLFxuICAgICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiA0LFxuICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogNCxcbiAgICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiA0LFxuICAgICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJywgLy8gTGV0IGNvZGVtaXJyb3IgZG8gdGhlIHNjcm9sbGluZ1xuICAgICAgdG9wOiA0NFxuICAgIH0pXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXRUb29sdGlwU3R5bGUgKCkge1xuICAgIGxldCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgIGJveFNoYWRvdzogJzAgM3B4IDdweCAwIHJnYmEoNywwLDMsMC40MCknLFxuICAgICAgY29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICBmb250U2l6ZTogMTAsXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgbWluSGVpZ2h0OiAxNSxcbiAgICAgIG1pbldpZHRoOiAyNCxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBwYWRkaW5nOiAnM3B4IDVweCAycHggNXB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIHRvcDogLTI0LFxuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjQpJyxcbiAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMTgybXMgY3ViaWMtYmV6aWVyKC4xNzUsIC44ODUsIC4zMTYsIDEuMTcxKSdcbiAgICB9XG4gICAgLy8gSWYgd2UncmUgb3Blbiwgd2Ugc2hvdWxkIHNob3cgdGhlIGV2YWx1YXRvciB0b29sdGlwXG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk5PTkUpIHtcbiAgICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBJZiB3ZSdyZSBpbmZvLCB3YXJuLCBvciBlcnJvciB3ZSBoYXZlIGNvbnRlbnQgdG8gZGlzcGxheVxuICAgIGlmICh0aGlzLnN0YXRlLmV2YWx1YXRvclN0YXRlID4gRVZBTFVBVE9SX1NUQVRFUy5PUEVOKSB7XG4gICAgICBsb2Rhc2guYXNzaWduKHN0eWxlLCB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRFdmFsdXRhdG9yU3RhdGVDb2xvcigpLFxuICAgICAgICB3aWR0aDogRURJVE9SX1dJRFRIXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldFRvb2x0aXBUcmlTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0ge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIHRvcDogMTMsXG4gICAgICBsZWZ0OiAxMixcbiAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtOC44cHgsIDApJyxcbiAgICAgIGJvcmRlckxlZnQ6ICc4LjhweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXJSaWdodDogJzguOHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlclRvcDogJzguOHB4IHNvbGlkICcgKyB0aGlzLmdldEV2YWx1dGF0b3JTdGF0ZUNvbG9yKClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk9QRU4pIHtcbiAgICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHtcbiAgICAgICAgYm9yZGVyVG9wOiAnOC44cHggc29saWQgJyArIHRoaXMuZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IoKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXRTZWxlY3RXcmFwcGVyU3R5bGUgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogMjgsXG4gICAgICBwYWRkaW5nVG9wOiA2LFxuICAgICAgbGVmdDogMCxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6IDUwLFxuICAgICAgekluZGV4OiA5MDAwLFxuICAgICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkxJR0hURVNUX0dSQVlcbiAgICB9XG4gIH1cblxuICBnZXRFbGVtZW50VGl0bGUgKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmVsZW1lbnQpIHtcbiAgICAgIGlmICh0aGlzLnByb3BzLmVsZW1lbnQubm9kZSkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5lbGVtZW50Lm5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICAgIGlmICh0aGlzLnByb3BzLmVsZW1lbnQubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddKSB7XG4gICAgICAgICAgICByZXR1cm4gYCR7dHJ1bmNhdGUodGhpcy5wcm9wcy5lbGVtZW50Lm5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSwgMTYpfWBcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICcodW5rbm93biknXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPSdldmVudC1oYW5kbGVyLWVkaXRvci1jb250YWluZXInXG4gICAgICAgIGNsYXNzTmFtZT0nQWJzb2x1dGUtQ2VudGVyJ1xuICAgICAgICBvbk1vdXNlRG93bj17KG1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAvLyBQcmV2ZW50IG91dGVyIHZpZXcgZnJvbSBjbG9zaW5nIHVzXG4gICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17dGhpcy5nZXRDb250YWluZXJTdHlsZSgpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBpZD0nZXZlbnQtaGFuZGxlci1pbnB1dC10b29sdGlwJ1xuICAgICAgICAgIHN0eWxlPXt0aGlzLmdldFRvb2x0aXBTdHlsZSgpfT5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgaWQ9J2V2ZW50LWhhbmRsZXItaW5wdXQtdG9vbHRpcC10cmknXG4gICAgICAgICAgICBzdHlsZT17dGhpcy5nZXRUb29sdGlwVHJpU3R5bGUoKX0gLz5cbiAgICAgICAgICB7dGhpcy5nZXRFdmFsdWF0b3JUZXh0KCl9XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGlkPSdldmVudC1oYW5kbGVyLXNlbGVjdC13cmFwcGVyJ1xuICAgICAgICAgIHN0eWxlPXt0aGlzLmdldFNlbGVjdFdyYXBwZXJTdHlsZSgpfVxuICAgICAgICAgIGNsYXNzTmFtZT0nbm8tc2VsZWN0Jz5cbiAgICAgICAgICA8Q3JlYXRhYmxlXG4gICAgICAgICAgICBuYW1lPSdldmVudC1uYW1lJ1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI9J0Nob29zZSBFdmVudCBOYW1lLi4uJ1xuICAgICAgICAgICAgY2xlYXJhYmxlPXtmYWxzZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnNlbGVjdGVkRXZlbnROYW1lfVxuICAgICAgICAgICAgb3B0aW9ucz17KHRoaXMucHJvcHMuZWxlbWVudCAmJiB0aGlzLnByb3BzLmVsZW1lbnQuZ2V0QXBwbGljYWJsZUV2ZW50SGFuZGxlck9wdGlvbnNMaXN0KCkpIHx8IFtdfVxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlZEV2ZW50TmFtZS5iaW5kKHRoaXMpfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGlkPSdldmVudC1oYW5kbGVyLWVsZW1lbnQtdGl0bGUnXG4gICAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnXG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiA1LFxuICAgICAgICAgICAgbGVmdDogRURJVE9SX1dJRFRIIC8gMiAtIDIwMCxcbiAgICAgICAgICAgIHdpZHRoOiA0MDAsXG4gICAgICAgICAgICBtYXJnaW46ICcwIGF1dG8nLFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGNvbG9yOiAnIzk5OScsXG4gICAgICAgICAgICB6SW5kZXg6IDkwMDBcbiAgICAgICAgICB9fT5cbiAgICAgICAgICB7YEV2ZW50IExpc3RlbmVycyBmb3IgJHt0aGlzLmdldEVsZW1lbnRUaXRsZSgpfWB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgaWQ9J2V2ZW50LWhhbmRsZXItaW5wdXQtZWRpdG9yLWNvbnRleHQnXG4gICAgICAgICAgY2xhc3NOYW1lPXt0aGlzLmdldEVkaXRvckNvbnRleHRDbGFzc05hbWUoKX1cbiAgICAgICAgICByZWY9eyhlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0ID0gZWxlbWVudFxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0RWRpdG9yQ29udGV4dFN0eWxlKCl9IC8+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvQ2FuY2VsKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGJvdHRvbTogNixcbiAgICAgICAgICAgIHJpZ2h0OiAxMixcbiAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICBjb2xvcjogJyM5OTknLFxuICAgICAgICAgICAgekluZGV4OiAxMDAwMCxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ3VuZGVybGluZSdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICBDYW5jZWxcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmRvU2F2ZSgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBkaXNhYmxlZD17IXRoaXMuZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUoKX1cbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICBib3R0b206IDYsXG4gICAgICAgICAgICByaWdodDogNjUsXG4gICAgICAgICAgICBoZWlnaHQ6IDIwLFxuICAgICAgICAgICAgY29sb3I6ICh0aGlzLmRvZXNDdXJyZW50Q29kZU5lZWRTYXZlKCkpID8gUGFsZXR0ZS5HUkVFTiA6ICcjNjY2JyxcbiAgICAgICAgICAgIGN1cnNvcjogKHRoaXMuZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUoKSkgPyAncG9pbnRlcicgOiAnbm90LWFsbG93ZWQnLFxuICAgICAgICAgICAgekluZGV4OiAxMDAwMCxcbiAgICAgICAgICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAnbm9uZScsXG4gICAgICAgICAgICBib3JkZXI6IGAxcHggc29saWQgJHsoKHRoaXMuZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUoKSkgPyBQYWxldHRlLkdSRUVOIDogJyM2NjYnKX1gLFxuICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgICAgICAgIHBhZGRpbmc6ICcycHggMTJweCAwcHggMTFweCdcbiAgICAgICAgICB9fT5cbiAgICAgICAgICBTYXZlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICB7LyogICAgICAgIDxBdXRvQ29tcGxldGVyXG4gICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVBdXRvQ29tcGxldGVyQ2xpY2suYmluZCh0aGlzKX1cbiAgICAgICAgICBsaW5lPXt0aGlzLmdldEN1cnNvck9mZnNldExpbmUodGhpcy5jb2RlbWlycm9yLmdldEN1cnNvcigpKSAtIDJ9XG4gICAgICAgICAgaGVpZ2h0PXtFRElUT1JfSEVJR0hUfVxuICAgICAgICAgIHdpZHRoPXtFRElUT1JfV0lEVEh9XG4gICAgICAgICAgbGluZUhlaWdodD17RURJVE9SX0xJTkVfSEVJR0hUfVxuICAgICAgICAgIGF1dG9Db21wbGV0aW9ucz17dGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnN9IC8+ICovfVxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=