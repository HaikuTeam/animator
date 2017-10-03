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
        _this2.props.save(_this2.props.element, _this2.state.selectedEventName, { handler: committable } // The committable is serialized, i.e. __function: {...}
        );

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
      };

      // By default, assume we are in an open evaluator state (will check for error in a moment)
      this.setState({
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
      };
      // If we're open, we should show the evaluator tooltip
      if (this.state.evaluatorState > EVALUATOR_STATES.NONE) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9FdmVudEhhbmRsZXJFZGl0b3IuanMiXSwibmFtZXMiOlsiSGFpa3VNb2RlIiwicmVxdWlyZSIsIkVWQUxVQVRPUl9TVEFURVMiLCJOT05FIiwiT1BFTiIsIklORk8iLCJXQVJOIiwiRVJST1IiLCJOQVZJR0FUSU9OX0RJUkVDVElPTlMiLCJTQU1FIiwiTkVYVCIsIlBSRVYiLCJFRElUT1JfV0lEVEgiLCJFRElUT1JfSEVJR0hUIiwiRURJVE9SX0xJTkVfSEVJR0hUIiwiTUFYX0FVVE9DT01QTEVUSU9OX0VOVFJJRVMiLCJtb2QiLCJpZHgiLCJtYXgiLCJzZXRPcHRpb25zIiwib3B0cyIsImtleSIsInNldE9wdGlvbiIsImdldFJlbmRlcmFibGVWYWx1ZU11bHRpbGluZSIsIm9mZmljaWFsVmFsdWUiLCJza2lwRm9ybWF0dGluZyIsInBhcmFtcyIsImxlbmd0aCIsImJvZHkiLCJFdmVudEhhbmRsZXJFZGl0b3IiLCJwcm9wcyIsIl9jb250ZXh0IiwiY29kZW1pcnJvciIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInRoZW1lIiwibW9kZSIsImxpbmVOdW1iZXJzIiwic2Nyb2xsYmFyU3R5bGUiLCJiaW5kIiwic2V0VmFsdWUiLCJzZXRTaXplIiwicmVmcmVzaCIsIm9uIiwiaGFuZGxlRWRpdG9yQ2hhbmdlIiwiaGFuZGxlRWRpdG9yS2V5ZG93biIsImNtIiwiY2hhbmdlT2JqZWN0Iiwib3JpZ2luIiwibGluZXMiLCJnZXRWYWx1ZSIsInNwbGl0IiwiZnJvbSIsImxpbmUiLCJjYW5jZWwiLCJlbGVtZW50Iiwic2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyIsInN0YXRlIiwic2VsZWN0ZWRFdmVudE5hbWUiLCJjdXN0b21FdmVudE9wdGlvbnMiLCJhdXRvQ29tcGxldGlvbnMiLCJldmFsdWF0b3JUZXh0IiwiZXZhbHVhdG9yU3RhdGUiLCJvcmlnaW5hbFZhbHVlIiwiZWRpdGVkVmFsdWUiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJ3cmFwcGVyIiwiZ2V0V3JhcHBlckVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImhhbmRsZUNoYW5nZWRFdmVudE5hbWUiLCJ2YWx1ZSIsImN1cnNvciIsInJlbmRlcmFibGUiLCJzZXRDdXJzb3IiLCJjaCIsImZvcmNlVXBkYXRlIiwiY29tbWl0dGFibGUiLCJvcmlnaW5hbCIsInJlYXNvbiIsInZhbHVlRGVzY3JpcHRvciIsIm9yaWdpbmFsRGVzY3JpcHRvciIsIl9fZnVuY3Rpb24iLCJnZXRDb21taXRhYmxlVmFsdWUiLCJpbnZhbGlkIiwiaXNDb21taXR0YWJsZVZhbHVlSW52YWxpZCIsInNldFN0YXRlIiwic2F2ZSIsImhhbmRsZXIiLCJjbG9zZSIsImtleWRvd25FdmVudCIsIl9hbHJlYWR5SGFuZGxlZCIsImV2ZW50TmFtZSIsImV4dGFudCIsImdldFJlaWZpZWRFdmVudEhhbmRsZXIiLCJmb3VuZCIsImZ1bmN0aW9uU3BlYyIsImZuIiwidXBzZXJ0RXZlbnRIYW5kbGVyIiwiY2hhbmdlRXZlbnQiLCJleGlzdGluZ0hhbmRsZXIiLCJmZXRjaEV2ZW50SGFuZGxlclZhbHVlRGVzY3JpcHRvciIsInN0b3JlRWRpdGVkVmFsdWUiLCJyZWNhbGlicmF0ZUVkaXRvciIsImFsc29TZXRPcmlnaW5hbCIsIndhc0ludGVybmFsQ2FsbCIsInJhd1ZhbHVlRnJvbUVkaXRvciIsInNsaWNlIiwiam9pbiIsImhhc0ZvY3VzIiwidGV4dCIsIndyYXBwZWQiLCJ3cmFwIiwiY3Vyc29yMSIsImdldEN1cnNvciIsInBhcnNlIiwia2V5d29yZHMiLCJnZXRDdXJzb3JPZmZzZXRMaW5lIiwiZ2V0Q3Vyc29yT2Zmc2V0Q2hhciIsInNraXBQYXJhbXNJbXB1cml0eUNoZWNrIiwic2tpcEZvcmJpZGRlbnNDaGVjayIsIl9wYXJzZSIsImVycm9yIiwibWVzc2FnZSIsIndhcm5pbmdzIiwiYW5ub3RhdGlvbiIsImNvbXBsZXRpb25zIiwic29ydCIsImEiLCJiIiwibmEiLCJuYW1lIiwidG9Mb3dlckNhc2UiLCJuYiIsImhpZ2hsaWdodGVkIiwic3RhdHVzIiwiZ2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyIsInVuZGVmaW5lZCIsImhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zIiwiZmlsdGVyIiwiY29tcGxldGlvbiIsIndoaWNoIiwicHJldmVudERlZmF1bHQiLCJuYXZpZ2F0ZUF1dG9Db21wbGV0aW9uIiwic2hpZnRLZXkiLCJjaG9vc2VIaWdobGlnaHRlZEF1dG9Db21wbGV0aW9uIiwibWV0YUtleSIsImRvU2F2ZSIsImRvQ2FuY2VsIiwiY2hvb3NlQXV0b0NvbXBsZXRpb24iLCJkaXJlY3Rpb24iLCJjaGFuZ2VkIiwiZm9yRWFjaCIsImluZGV4IiwibmlkeCIsIm5leHQiLCJsZW4iLCJ0YXJnZXQiLCJlbmQiLCJzdGFydCIsImRvYyIsImdldERvYyIsImN1ciIsInJlcGxhY2VSYW5nZSIsImN1cnMiLCJzcmMiLCJPUkFOR0UiLCJSRUQiLCJDT0FMIiwicHVzaCIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCJiYWNrZ3JvdW5kQ29sb3IiLCJib3JkZXJSYWRpdXMiLCJ6SW5kZXgiLCJhc3NpZ24iLCJmb250RmFtaWx5IiwiZm9udFNpemUiLCJsaW5lSGVpZ2h0Iiwib3V0bGluZSIsInBhZGRpbmdMZWZ0IiwicGFkZGluZ1RvcCIsInBvc2l0aW9uIiwidGV4dFNoYWRvdyIsIlJPQ0siLCJmYWRlIiwiYm9yZGVyQm90dG9tTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzIiwiYm9yZGVyVG9wTGVmdFJhZGl1cyIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiY29sb3IiLCJvdmVyZmxvdyIsInRvcCIsIkZBVEhFUl9DT0FMIiwiYm94U2hhZG93IiwiU1VOU1RPTkUiLCJmb250V2VpZ2h0IiwibGVmdCIsIm1pbkhlaWdodCIsIm1pbldpZHRoIiwib3BhY2l0eSIsInBhZGRpbmciLCJ0ZXh0QWxpZ24iLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IiLCJib3JkZXJMZWZ0IiwiYm9yZGVyUmlnaHQiLCJib3JkZXJUb3AiLCJMSUdIVEVTVF9HUkFZIiwibm9kZSIsImF0dHJpYnV0ZXMiLCJtb3VzZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwiZ2V0Q29udGFpbmVyU3R5bGUiLCJnZXRUb29sdGlwU3R5bGUiLCJnZXRUb29sdGlwVHJpU3R5bGUiLCJnZXRFdmFsdWF0b3JUZXh0IiwiZ2V0U2VsZWN0V3JhcHBlclN0eWxlIiwiZ2V0QXBwbGljYWJsZUV2ZW50SGFuZGxlck9wdGlvbnNMaXN0IiwibWFyZ2luIiwiZ2V0RWxlbWVudFRpdGxlIiwiZ2V0RWRpdG9yQ29udGV4dENsYXNzTmFtZSIsImdldEVkaXRvckNvbnRleHRTdHlsZSIsImJvdHRvbSIsInJpZ2h0IiwidGV4dFRyYW5zZm9ybSIsInRleHREZWNvcmF0aW9uIiwiZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUiLCJHUkVFTiIsImJvcmRlciIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7O0FBREE7OztBQUVBLElBQU1BLFlBQVlDLFFBQVEsZUFBUixDQUFsQjs7QUFFQSxJQUFNQyxtQkFBbUI7QUFDdkJDLFFBQU0sQ0FEaUIsRUFDZDtBQUNUQyxRQUFNLENBRmlCLEVBRWQ7QUFDVEMsUUFBTSxDQUhpQjtBQUl2QkMsUUFBTSxDQUppQjtBQUt2QkMsU0FBTztBQUxnQixDQUF6Qjs7QUFRQSxJQUFNQyx3QkFBd0I7QUFDNUJDLFFBQU0sQ0FEc0I7QUFFNUJDLFFBQU0sQ0FBQyxDQUZxQjtBQUc1QkMsUUFBTSxDQUFDO0FBSHFCLENBQTlCOztBQU1BLElBQU1DLGVBQWUsR0FBckI7QUFDQSxJQUFNQyxnQkFBZ0IsR0FBdEI7QUFDQSxJQUFNQyxxQkFBcUIsRUFBM0I7O0FBRUEsSUFBTUMsNkJBQTZCLENBQW5DOztBQUVBLFNB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USxLQUFLc0MsdUJBQUwsRUFBRCxHQUFtQyxrQkFBUUMsS0FBM0MsR0FBbUQsTUFMckQ7QUFNTDlKLHNCQUFTLEtBQUs2Six1QkFBTCxFQUFELEdBQW1DLFNBQW5DLEdBQStDLGFBTmxEO0FBT0x0RCxzQkFBUSxLQVBIO0FBUUxHLHdCQUFVLE1BUkw7QUFTTGlELDZCQUFlLE1BVFY7QUFVTEksc0NBQXVCLEtBQUtGLHVCQUFMLEVBQUQsR0FBbUMsa0JBQVFDLEtBQTNDLEdBQW1ELE1BQXpFLENBVks7QUFXTHhELDRCQUFjLEtBWFQ7QUFZTDRCLHVCQUFTO0FBWkosYUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBbkVGLE9BREY7QUFrR0Q7Ozs7RUFycEI2QyxnQkFBTThCLFM7O2tCQUFqQzNNLGtCIiwiZmlsZSI6IkV2ZW50SGFuZGxlckVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcidcbmltcG9ydCB7IENyZWF0YWJsZSB9IGZyb20gJ3JlYWN0LXNlbGVjdC1wbHVzJ1xuaW1wb3J0IHRydW5jYXRlIGZyb20gJy4vaGVscGVycy90cnVuY2F0ZSdcbmltcG9ydCBwYXJzZUV4cHJlc3Npb24gZnJvbSAnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvYXN0L3BhcnNlRXhwcmVzc2lvbidcbmltcG9ydCBtYXJzaGFsUGFyYW1zIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlZmxlY3Rpb24vbWFyc2hhbFBhcmFtcydcbmltcG9ydCBmdW5jdGlvblRvUkZPIGZyb20gJ0BoYWlrdS9wbGF5ZXIvbGliL3JlZmxlY3Rpb24vZnVuY3Rpb25Ub1JGTydcbmltcG9ydCByZWlmeVJGTyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL3JlaWZ5UkZPJ1xuLy8gaW1wb3J0IEF1dG9Db21wbGV0ZXIgZnJvbSAnLi9BdXRvQ29tcGxldGVyJ1xuaW1wb3J0IFBhbGV0dGUgZnJvbSAnLi9QYWxldHRlJ1xuY29uc3QgSGFpa3VNb2RlID0gcmVxdWlyZSgnLi9tb2Rlcy9oYWlrdScpXG5cbmNvbnN0IEVWQUxVQVRPUl9TVEFURVMgPSB7XG4gIE5PTkU6IDEsIC8vIE5vbmUgbWVhbnMgbm90aGluZyB0byBldmFsdWF0ZSBhdCBhbGxcbiAgT1BFTjogMiwgLy8gQW55dGhpbmcgPj0gT1BFTiBpcyBhbHNvICdvcGVuJ1xuICBJTkZPOiAzLFxuICBXQVJOOiA0LFxuICBFUlJPUjogNVxufVxuXG5jb25zdCBOQVZJR0FUSU9OX0RJUkVDVElPTlMgPSB7XG4gIFNBTUU6IDAsXG4gIE5FWFQ6ICsxLFxuICBQUkVWOiAtMVxufVxuXG5jb25zdCBFRElUT1JfV0lEVEggPSA1MDBcbmNvbnN0IEVESVRPUl9IRUlHSFQgPSAzMDBcbmNvbnN0IEVESVRPUl9MSU5FX0hFSUdIVCA9IDE4XG5cbmNvbnN0IE1BWF9BVVRPQ09NUExFVElPTl9FTlRSSUVTID0gOFxuXG5mdW5jdGlvbiBtb2QgKGlkeCwgbWF4KSB7XG4gIHJldHVybiAoaWR4ICUgbWF4ICsgbWF4KSAlIG1heFxufVxuXG5mdW5jdGlvbiBzZXRPcHRpb25zIChvcHRzKSB7XG4gIGZvciAodmFyIGtleSBpbiBvcHRzKSB0aGlzLnNldE9wdGlvbihrZXksIG9wdHNba2V5XSlcbiAgcmV0dXJuIHRoaXNcbn1cblxuZnVuY3Rpb24gZ2V0UmVuZGVyYWJsZVZhbHVlTXVsdGlsaW5lIChvZmZpY2lhbFZhbHVlLCBza2lwRm9ybWF0dGluZykge1xuICAvLyBVcGRhdGUgdGhlIGVkaXRvciBjb250ZW50c1xuICBsZXQgcGFyYW1zID0gJydcbiAgaWYgKG9mZmljaWFsVmFsdWUucGFyYW1zICYmIG9mZmljaWFsVmFsdWUucGFyYW1zLmxlbmd0aCA+IDApIHtcbiAgICBwYXJhbXMgPSBtYXJzaGFsUGFyYW1zKG9mZmljaWFsVmFsdWUucGFyYW1zKVxuICB9XG5cbiAgaWYgKHNraXBGb3JtYXR0aW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAoJHtwYXJhbXN9KSB7XG4ke29mZmljaWFsVmFsdWUuYm9keX1cbn1gXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAoJHtwYXJhbXN9KSB7XG4gICR7b2ZmaWNpYWxWYWx1ZS5ib2R5fVxufWBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFdmVudEhhbmRsZXJFZGl0b3IgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsIC8vIE91ciBjb250ZXh0IGVsZW1lbnQgb24gd2hpY2ggdG8gbW91bnQgY29kZW1pcnJvclxuXG4gICAgdGhpcy5jb2RlbWlycm9yID0gQ29kZU1pcnJvcihkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSwge1xuICAgICAgdGhlbWU6ICdoYWlrdScsXG4gICAgICBtb2RlOiAnaGFpa3UnLFxuICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICBzY3JvbGxiYXJTdHlsZTogJ25hdGl2ZSdcbiAgICB9KVxuICAgIHRoaXMuY29kZW1pcnJvci5zZXRPcHRpb25zID0gc2V0T3B0aW9ucy5iaW5kKHRoaXMuY29kZW1pcnJvcilcbiAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0VmFsdWUoJycpXG4gICAgdGhpcy5jb2RlbWlycm9yLnNldFNpemUoRURJVE9SX1dJRFRIIC0gMzUsIEVESVRPUl9IRUlHSFQgLSAxMDApXG4gICAgdGhpcy5jb2RlbWlycm9yLnJlZnJlc2goKSAvLyBNdXN0IGNhbGwgdGhpcyBoZXJlIG9yIHRoZSBndXR0ZXIgbWFyZ2luIHdpbGwgYmUgc2NyZXdlZCB1cFxuICAgIHRoaXMuY29kZW1pcnJvci5vbignY2hhbmdlJywgdGhpcy5oYW5kbGVFZGl0b3JDaGFuZ2UuYmluZCh0aGlzKSlcbiAgICB0aGlzLmNvZGVtaXJyb3Iub24oJ2tleWRvd24nLCB0aGlzLmhhbmRsZUVkaXRvcktleWRvd24uYmluZCh0aGlzKSlcbiAgICB0aGlzLmNvZGVtaXJyb3Iub24oJ2JlZm9yZUNoYW5nZScsIChjbSwgY2hhbmdlT2JqZWN0KSA9PiB7XG4gICAgICAvLyBJZiBtdWx0aWxpbmUgbW9kZSwgb25seSBhbGxvdyBhIGNoYW5nZSB0byB0aGUgZnVuY3Rpb24gYm9keSwgbm90IHRoZSBzaWduYXR1cmVcbiAgICAgIC8vIFNpbXBseSBjYW5jZWwgYW55IGNoYW5nZSB0aGF0IG9jY3VycyBpbiBlaXRoZXIgb2YgdGhvc2UgcGxhY2VzLlxuICAgICAgaWYgKGNoYW5nZU9iamVjdC5vcmlnaW4gIT09ICdzZXRWYWx1ZScpIHtcbiAgICAgICAgbGV0IGxpbmVzID0gdGhpcy5jb2RlbWlycm9yLmdldFZhbHVlKCkuc3BsaXQoJ1xcbicpXG4gICAgICAgIGlmIChjaGFuZ2VPYmplY3QuZnJvbS5saW5lID09PSAwIHx8IGNoYW5nZU9iamVjdC5mcm9tLmxpbmUgPj0gbGluZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIHJldHVybiBjaGFuZ2VPYmplY3QuY2FuY2VsKClcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByb3BzLmVsZW1lbnQuc2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyh0aGlzLnN0YXRlLnNlbGVjdGVkRXZlbnROYW1lLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIHNlbGVjdGVkRXZlbnROYW1lOiAnY2xpY2snLCAvLyBTZWVtcyBhIGdvb2QgZGVmYXVsdCBldmVudCB0byB3b3JrIHdpdGhcbiAgICAgIGN1c3RvbUV2ZW50T3B0aW9uczogW10sIC8vIEFsbG93IHVzZXIgdG8gdHlwZSBpbiBhIGN1c3RvbSBldmVudCBuYW1lXG4gICAgICBhdXRvQ29tcGxldGlvbnM6IFtdLFxuICAgICAgZXZhbHVhdG9yVGV4dDogbnVsbCxcbiAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLk5PTkUsXG4gICAgICBvcmlnaW5hbFZhbHVlOiBudWxsLFxuICAgICAgZWRpdGVkVmFsdWU6IG51bGxcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCAoKSB7XG4gICAgaWYgKHRoaXMuX2NvbnRleHQpIHtcbiAgICAgIHdoaWxlICh0aGlzLl9jb250ZXh0LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgdGhpcy5fY29udGV4dC5yZW1vdmVDaGlsZCh0aGlzLl9jb250ZXh0LmZpcnN0Q2hpbGQpXG4gICAgICB9XG4gICAgICBsZXQgd3JhcHBlciA9IHRoaXMuY29kZW1pcnJvci5nZXRXcmFwcGVyRWxlbWVudCgpXG4gICAgICB0aGlzLl9jb250ZXh0LmFwcGVuZENoaWxkKHdyYXBwZXIpXG4gICAgfVxuXG4gICAgLy8gTm90IHJlYWxseSBhIGNoYW5nZSBldmVudCwgYnV0IGl0IGNvbnRhaW5zIHRoZSBzYW1lIGJ1c2luZXNzIGxvZ2ljIHdlIHdhbnQuLi5cbiAgICB0aGlzLmhhbmRsZUNoYW5nZWRFdmVudE5hbWUoeyB2YWx1ZTogdGhpcy5zdGF0ZS5zZWxlY3RlZEV2ZW50TmFtZSB9LCB0cnVlKVxuICB9XG5cbiAgcmVjYWxpYnJhdGVFZGl0b3IgKGN1cnNvcikge1xuICAgIGxldCByZW5kZXJhYmxlID0gZ2V0UmVuZGVyYWJsZVZhbHVlTXVsdGlsaW5lKHRoaXMuc3RhdGUuZWRpdGVkVmFsdWUpXG5cbiAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0VmFsdWUocmVuZGVyYWJsZSlcblxuICAgIC8vIElmIGN1cnNvciBleHBsaWNpdGx5IHBhc3NlZCwgdXNlIGl0LiBUaGlzIGlzIHVzZWQgYnkgY2hvb3NlQXV0b2NvbXBsZXRpb25cbiAgICBpZiAoY3Vyc29yKSB7XG4gICAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0Q3Vyc29yKGN1cnNvcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb2RlbWlycm9yLnNldEN1cnNvcih7IGxpbmU6IDEsIGNoOiByZW5kZXJhYmxlLnNwbGl0KCdcXG4nKVsxXS5sZW5ndGggfSlcbiAgICB9XG5cbiAgICB0aGlzLmZvcmNlVXBkYXRlKClcbiAgfVxuXG4gIGlzQ29tbWl0dGFibGVWYWx1ZUludmFsaWQgKGNvbW1pdHRhYmxlLCBvcmlnaW5hbCkge1xuICAgIC8vIElmIHdlIGhhdmUgYW55IGVycm9yL3dhcm5pbmcgaW4gdGhlIGV2YWx1YXRvciwgYXNzdW1lIGl0IGFzIGdyb3VuZHMgbm90IHRvIGNvbW1pdFxuICAgIC8vIHRoZSBjdXJyZW50IGNvbnRlbnQgb2YgdGhlIGZpZWxkLiBCYXNpY2FsbHkgbGV2ZXJhZ2luZyBwcmUtdmFsaWRhdGlvbiB3ZSd2ZSBhbHJlYWR5IGRvbmUuXG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLklORk8pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlYXNvbjogdGhpcy5zdGF0ZS5ldmFsdWF0b3JUZXh0XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICBnZXRDb21taXRhYmxlVmFsdWUgKHZhbHVlRGVzY3JpcHRvciwgb3JpZ2luYWxEZXNjcmlwdG9yKSB7XG4gICAgLy8gTm90ZSB0aGF0IGV4dHJhL2NhY2hlZCBmaWVsZHMgYXJlIHN0cmlwcGVkIG9mZiBvZiB0aGUgZnVuY3Rpb24sIGxpa2UgJy5zdW1tYXJ5J1xuICAgIHJldHVybiB7XG4gICAgICBfX2Z1bmN0aW9uOiB7XG4gICAgICAgIHBhcmFtczogdmFsdWVEZXNjcmlwdG9yLnBhcmFtcyxcbiAgICAgICAgYm9keTogdmFsdWVEZXNjcmlwdG9yLmJvZHlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkb1NhdmUgKCkge1xuICAgIGxldCBvcmlnaW5hbCA9IHRoaXMuc3RhdGUub3JpZ2luYWxWYWx1ZVxuICAgIGxldCBjb21taXR0YWJsZSA9IHRoaXMuZ2V0Q29tbWl0YWJsZVZhbHVlKHRoaXMuc3RhdGUuZWRpdGVkVmFsdWUsIG9yaWdpbmFsKVxuICAgIGxldCBpbnZhbGlkID0gdGhpcy5pc0NvbW1pdHRhYmxlVmFsdWVJbnZhbGlkKGNvbW1pdHRhYmxlLCBvcmlnaW5hbClcblxuICAgIC8vIElmIGludmFsaWQsIGRvbid0IHByb2NlZWQgLSBrZWVwIHRoZSBpbnB1dCBpbiBhIGZvY3VzZWQrc2VsZWN0ZWQgc3RhdGUsXG4gICAgLy8gYW5kIHRoZW4gc2hvdyBhbiBlcnJvciBtZXNzYWdlIGluIHRoZSBldmFsdWF0b3IgdG9vbHRpcFxuICAgIGlmIChpbnZhbGlkKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLkVSUk9SLFxuICAgICAgICBldmFsdWF0b3JUZXh0OiBpbnZhbGlkLnJlYXNvblxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIG9yaWdpbmFsVmFsdWU6IHRoaXMuc3RhdGUuZWRpdGVkVmFsdWVcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLnByb3BzLnNhdmUoXG4gICAgICAgIHRoaXMucHJvcHMuZWxlbWVudCxcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWxlY3RlZEV2ZW50TmFtZSxcbiAgICAgICAgeyBoYW5kbGVyOiBjb21taXR0YWJsZSB9IC8vIFRoZSBjb21taXR0YWJsZSBpcyBzZXJpYWxpemVkLCBpLmUuIF9fZnVuY3Rpb246IHsuLi59XG4gICAgICApXG5cbiAgICAgIHRoaXMucHJvcHMuZWxlbWVudC5zZXRFdmVudEhhbmRsZXJTYXZlU3RhdHVzKHRoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudE5hbWUsIHRydWUpXG4gICAgICB0aGlzLmZvcmNlVXBkYXRlKClcbiAgICB9KVxuICB9XG5cbiAgZG9DYW5jZWwgKCkge1xuICAgIC8vICNUT0RPOiBXaGF0IGVsc2U/XG4gICAgdGhpcy5wcm9wcy5jbG9zZSgpXG4gIH1cblxuICB3aWxsSGFuZGxlRXh0ZXJuYWxLZXlkb3duRXZlbnQgKGtleWRvd25FdmVudCkge1xuICAgIGlmIChrZXlkb3duRXZlbnQuX2FscmVhZHlIYW5kbGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmVsZW1lbnQpIHsgLy8gPH4gUG9zc2libHkgbm90IG5lZWRlZCwgYnV0IHRoaXMgaXMgYSBjaGVjayB0byB3aGV0aGVyIHdlJ3JlIGxpdmUgb3Igbm90XG4gICAgICAvLyBXaGVuIGZvY3VzZWQsIGFzc3VtZSB3ZSAqYWx3YXlzKiBoYW5kbGUga2V5Ym9hcmQgZXZlbnRzLCBubyBleGNlcHRpb25zLlxuICAgICAgLy8gSWYgeW91IHdhbnQgdG8gaGFuZGxlIGFuIGlucHV0IHdoZW4gZm9jdXNlZCwgdXNlZCBoYW5kbGVFZGl0b3JLZXlkb3duXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgZmV0Y2hFdmVudEhhbmRsZXJWYWx1ZURlc2NyaXB0b3IgKGV2ZW50TmFtZSkge1xuICAgIGxldCBleHRhbnQgPSB0aGlzLnByb3BzLmVsZW1lbnQgJiYgdGhpcy5wcm9wcy5lbGVtZW50LmdldFJlaWZpZWRFdmVudEhhbmRsZXIoZXZlbnROYW1lKVxuXG4gICAgbGV0IGZvdW5kXG4gICAgaWYgKGV4dGFudCAmJiBleHRhbnQuaGFuZGxlcikge1xuICAgICAgLy8gVGhlIHBsYXllciB3cmFwcyAnaGFuZGxlcicgdG8gbWFrZSBzdXJlIGJpbmRpbmcgaXMgY29ycmVjdCwgYnV0IHdlIHdhbnQgdGhlIG9yaWdpbmFsXG4gICAgICAvLyBmdW5jdGlvbiBpdHNlbGYgc28gd2UgY2FuIGFjdHVhbGx5IGFjY2VzcyBpdHMgYm9keSBhbmQgcGFyYW1ldGVycywgZXRjLlxuICAgICAgdmFyIG9yaWdpbmFsID0gZXh0YW50Lm9yaWdpbmFsIHx8IGV4dGFudC5oYW5kbGVyXG4gICAgICBmb3VuZCA9IGZ1bmN0aW9uVG9SRk8ob3JpZ2luYWwpLl9fZnVuY3Rpb25cbiAgICB9IGVsc2Uge1xuICAgICAgZm91bmQgPSB7XG4gICAgICAgIHBhcmFtczogWydldmVudCddLFxuICAgICAgICBib2R5OiAnLy8gXCInICsgZXZlbnROYW1lICsgJ1wiIGV2ZW50IGxvZ2ljIGdvZXMgaGVyZSdcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmRcbiAgfVxuXG4gIHN0b3JlRWRpdGVkVmFsdWUgKGV2ZW50TmFtZSwgZnVuY3Rpb25TcGVjKSB7XG4gICAgdmFyIGZuID0gcmVpZnlSRk8oZnVuY3Rpb25TcGVjKVxuXG4gICAgLy8gVGhpcyBqdXN0IHN0b3JlcyB0aGUgdXBkYXRlZCBmdW5jdGlvbiBpbiBtZW1vcnkgYnV0IGRvZXMgX25vdF8gcGVyc2lzdCBpdCFcbiAgICB0aGlzLnByb3BzLmVsZW1lbnQudXBzZXJ0RXZlbnRIYW5kbGVyKGV2ZW50TmFtZSwge1xuICAgICAgaGFuZGxlcjogZm5cbiAgICB9KVxuICB9XG5cbiAgaGFuZGxlQ2hhbmdlZEV2ZW50TmFtZSAoY2hhbmdlRXZlbnQpIHtcbiAgICBpZiAoY2hhbmdlRXZlbnQpIHtcbiAgICAgIHZhciBleGlzdGluZ0hhbmRsZXIgPSB0aGlzLmZldGNoRXZlbnRIYW5kbGVyVmFsdWVEZXNjcmlwdG9yKGNoYW5nZUV2ZW50LnZhbHVlKVxuXG4gICAgICBpZiAodGhpcy5wcm9wcy5lbGVtZW50KSB7XG4gICAgICAgIHRoaXMuc3RvcmVFZGl0ZWRWYWx1ZShjaGFuZ2VFdmVudC52YWx1ZSwgZXhpc3RpbmdIYW5kbGVyKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXZhbHVhdG9yVGV4dDogbnVsbCxcbiAgICAgICAgZXZhbHVhdG9yU3RhdGU6IEVWQUxVQVRPUl9TVEFURVMuT1BFTixcbiAgICAgICAgc2VsZWN0ZWRFdmVudE5hbWU6IGNoYW5nZUV2ZW50LnZhbHVlLFxuICAgICAgICBvcmlnaW5hbFZhbHVlOiBleGlzdGluZ0hhbmRsZXIsXG4gICAgICAgIGVkaXRlZFZhbHVlOiBleGlzdGluZ0hhbmRsZXJcbiAgICAgIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5yZWNhbGlicmF0ZUVkaXRvcigpXG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdG9yQ2hhbmdlKHRoaXMuY29kZW1pcnJvciwge30sIHRydWUpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUVkaXRvckNoYW5nZSAoY20sIGNoYW5nZU9iamVjdCwgYWxzb1NldE9yaWdpbmFsLCB3YXNJbnRlcm5hbENhbGwpIHtcbiAgICBpZiAoY2hhbmdlT2JqZWN0Lm9yaWdpbiA9PT0gJ3NldFZhbHVlJykge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gQW55IGNoYW5nZSBzaG91bGQgdW5zZXQgdGhlIGN1cnJlbnQgZXJyb3Igc3RhdGUgb2YgdGhlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBldmFsdWF0b3JUZXh0OiBudWxsXG4gICAgfSlcblxuICAgIGxldCByYXdWYWx1ZUZyb21FZGl0b3IgPSBjbS5nZXRWYWx1ZSgpXG5cbiAgICAvLyBUaGUgYm9keSB3aWxsIGRldGVybWluZSB0aGUgcGFyYW1zLCBzbyB3ZSBjYW4gc2FmZWx5IGRpc2NhcmQgdGhlIGZ1bmN0aW9uIHByZWZpeC9zdWZmaXhcbiAgICBsZXQgbGluZXMgPSByYXdWYWx1ZUZyb21FZGl0b3Iuc3BsaXQoJ1xcbicpXG4gICAgbGV0IGJvZHkgPSBsaW5lcy5zbGljZSgxLCBsaW5lcy5sZW5ndGggLSAxKS5qb2luKCdcXG4nKVxuICAgIGxldCBvZmZpY2lhbFZhbHVlID0ge1xuICAgICAgcGFyYW1zOiBbJ2V2ZW50J10sXG4gICAgICBib2R5OiBib2R5XG4gICAgfVxuXG4gICAgLy8gQnkgZGVmYXVsdCwgYXNzdW1lIHdlIGFyZSBpbiBhbiBvcGVuIGV2YWx1YXRvciBzdGF0ZSAod2lsbCBjaGVjayBmb3IgZXJyb3IgaW4gYSBtb21lbnQpXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5PUEVOXG4gICAgfSlcblxuICAgIC8vIElmIHRoZSBsYXN0IGVudHJ5IHdhcyBhIHNwYWNlLCByZW1vdmUgYXV0b2NvbXBsZXRlIGJlZm9yZSB3ZSBzdGFydCBwYXJzaW5nLCB3aGljaCBtaWdodCBmYWlsXG4gICAgLy8gaWYgd2UgaGF2ZSBhbiBpbmNvbXBsZXRlIGV2ZW50LWhhbmRsZXItaW4tcHJvZ3Jlc3MgaW5zaWRlIHRoZSBlZGl0b3JcbiAgICAvLyBBbHNvIHJlbW92ZSBhbnkgY29tcGxldGlvbnMgaWYgdGhlIGVkaXRvciBkb2VzIG5vdCBoYXZlIGZvY3VzXG4gICAgaWYgKCFjbS5oYXNGb2N1cygpIHx8IChjaGFuZ2VPYmplY3QgJiYgY2hhbmdlT2JqZWN0LnRleHQgJiYgY2hhbmdlT2JqZWN0LnRleHRbMF0gPT09ICcgJykpIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBhdXRvQ29tcGxldGlvbnM6IFtdXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8vIFRoaXMgd3JhcHBpbmcgaXMgcmVxdWlyZWQgZm9yIHBhcnNpbmcgdG8gd29yayAocGFyZW5zIGFyZSBuZWVkZWQgdG8gbWFrZSBpdCBhbiBldmVudC1oYW5kbGVyKVxuICAgIGxldCB3cmFwcGVkID0gcGFyc2VFeHByZXNzaW9uLndyYXAob2ZmaWNpYWxWYWx1ZS5ib2R5KVxuICAgIGxldCBjdXJzb3IxID0gdGhpcy5jb2RlbWlycm9yLmdldEN1cnNvcigpXG5cbiAgICBsZXQgcGFyc2UgPSBwYXJzZUV4cHJlc3Npb24od3JhcHBlZCwge30sIEhhaWt1TW9kZS5rZXl3b3JkcywgdGhpcy5zdGF0ZSwge1xuICAgICAgbGluZTogdGhpcy5nZXRDdXJzb3JPZmZzZXRMaW5lKGN1cnNvcjEpLFxuICAgICAgY2g6IHRoaXMuZ2V0Q3Vyc29yT2Zmc2V0Q2hhcihjdXJzb3IxKVxuICAgIH0sIHtcbiAgICAgIC8vIFRoZXNlIGNoZWNrcyBhcmUgb25seSBuZWVkZWQgZm9yIGV4cHJlc3Npb25zIGluIHRoZSB0aW1lbGluZSwgc28gc2tpcCB0aGVtIGhlcmVcbiAgICAgIHNraXBQYXJhbXNJbXB1cml0eUNoZWNrOiB0cnVlLFxuICAgICAgc2tpcEZvcmJpZGRlbnNDaGVjazogdHJ1ZVxuICAgIH0pXG5cbiAgICB0aGlzLl9wYXJzZSA9IHBhcnNlIC8vIENhY2hpbmcgdGhpcyB0byBtYWtlIGl0IGZhc3RlciB0byByZWFkIGZvciBhdXRvY29tcGxldGlvbnNcblxuICAgIGlmIChwYXJzZS5lcnJvcikge1xuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGF1dG9Db21wbGV0aW9uczogW10sXG4gICAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLkVSUk9SLFxuICAgICAgICBldmFsdWF0b3JUZXh0OiBwYXJzZS5lcnJvci5tZXNzYWdlXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmICghcGFyc2UuZXJyb3IpIHtcbiAgICAgIGlmIChwYXJzZS53YXJuaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLldBUk4sXG4gICAgICAgICAgZXZhbHVhdG9yVGV4dDogcGFyc2Uud2FybmluZ3NbMF0uYW5ub3RhdGlvblxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAoY20uaGFzRm9jdXMoKSkge1xuICAgICAgICBsZXQgY29tcGxldGlvbnMgPSBwYXJzZS5jb21wbGV0aW9ucy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgdmFyIG5hID0gYS5uYW1lLnRvTG93ZXJDYXNlKClcbiAgICAgICAgICB2YXIgbmIgPSBiLm5hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgIGlmIChuYSA8IG5iKSByZXR1cm4gLTFcbiAgICAgICAgICBpZiAobmEgPiBuYikgcmV0dXJuIDFcbiAgICAgICAgICByZXR1cm4gMFxuICAgICAgICB9KS5zbGljZSgwLCBNQVhfQVVUT0NPTVBMRVRJT05fRU5UUklFUylcblxuICAgICAgICAvLyBIaWdobGlnaHQgdGhlIGluaXRpYWwgY29tcGxldGlvbiBpbiB0aGUgbGlzdFxuICAgICAgICBpZiAoY29tcGxldGlvbnNbMF0pIHtcbiAgICAgICAgICBjb21wbGV0aW9uc1swXS5oaWdobGlnaHRlZCA9IHRydWVcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGF1dG9Db21wbGV0aW9uczogY29tcGxldGlvbnNcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGF1dG9Db21wbGV0aW9uczogW11cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBXZSBjYW4ndCBzdG9yZSB0aGUgZWRpdGVkIHZhbHVlIGlmIGl0IGRvZXNuJ3QgcGFyc2UsIHNpbmNlIHN0b3JpbmcgaXQgcmVxdWlyZXMgdGhhdFxuICAgIC8vIHdlIHNhdmUgdGhlIHJlaWZpZWQgdmVyc2lvbiwgd2hpY2ggZGVwZW5kcyBvbiBgbmV3IEZ1bmN0aW9uYFxuICAgIGlmICghcGFyc2UuZXJyb3IpIHtcbiAgICAgIC8vIFN0b3JlIHRoZSBlZGl0ZWQgY29kZSBpbiBtZW1vcnkgb24gdGhlIGVsZW1lbnQgc28gd2UgY2FuIHJldHJpZXZlIGl0IGlmIHdlIG5hdmlnYXRlXG4gICAgICB0aGlzLnN0b3JlRWRpdGVkVmFsdWUodGhpcy5zdGF0ZS5zZWxlY3RlZEV2ZW50TmFtZSwgb2ZmaWNpYWxWYWx1ZSlcbiAgICB9XG5cbiAgICAvLyBOZWVkIHRoaXMgZm9yIHdoZW4gd2UgZmlyc3QgbG9hZCB0aGUgY29kZSwgb3VyIGludGVybmFsIG1vZHMgbWlnaHQgY2hhbmdlIGl0IHN1YnRsZWx5XG4gICAgLy8gYnV0IHdlIGRvbid0IHdhbnQgYSBmYWxzZSBwb3NpdGl2ZSBmb3Igd2hlbiBhIHNhdmUgaXMgcmVxdWlyZWRcbiAgICBpZiAoYWxzb1NldE9yaWdpbmFsKSB7XG4gICAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgb3JpZ2luYWxWYWx1ZTogb2ZmaWNpYWxWYWx1ZSxcbiAgICAgICAgZWRpdGVkVmFsdWU6IG9mZmljaWFsVmFsdWVcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICBlZGl0ZWRWYWx1ZTogb2ZmaWNpYWxWYWx1ZVxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBkb2VzQ3VycmVudENvZGVOZWVkU2F2ZSAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmVsZW1lbnQpIHJldHVybiBmYWxzZVxuICAgIHZhciBzdGF0dXMgPSB0aGlzLnByb3BzLmVsZW1lbnQuZ2V0RXZlbnRIYW5kbGVyU2F2ZVN0YXR1cyh0aGlzLnN0YXRlLnNlbGVjdGVkRXZlbnROYW1lKVxuICAgIGlmIChzdGF0dXMgPT09IG51bGwgfHwgc3RhdHVzID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZVxuICAgIC8vIElmIHRoZSBzdGF0dXMgaXMgZmFsc2UsIGkuZS4gXCJub3Qgc2F2ZWQgZnJvbSBhIGNoYW5nZVwiLCB0aGVuIHllcywgd2UgbmVlZCBhIHNhdmUuLi5cbiAgICByZXR1cm4gIXN0YXR1c1xuICB9XG5cbiAgaGFuZGxlRWRpdG9yS2V5ZG93biAoY20sIGtleWRvd25FdmVudCkge1xuICAgIGtleWRvd25FdmVudC5fYWxyZWFkeUhhbmRsZWQgPSB0cnVlXG5cbiAgICBsZXQgaGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbnMgPSB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5maWx0ZXIoKGNvbXBsZXRpb24pID0+IHtcbiAgICAgIHJldHVybiAhIWNvbXBsZXRpb24uaGlnaGxpZ2h0ZWRcbiAgICB9KVxuXG4gICAgLy8gRmlyc3QsIGhhbmRsZSBhbnkgYXV0b2NvbXBsZXRpb25zIGlmIHdlJ3JlIGluIGFuIGF1dG9jb21wbGV0ZS1hY3RpdmUgc3RhdGUsIGkuZS4sXG4gICAgLy8gaWYgd2UgYXJlIHNob3dpbmcgYXV0b2NvbXBsZXRlIGFuZCBpZiB0aGVyZSBhcmUgYW55IG9mIHRoZW0gY3VycmVudGx5IGhpZ2hsaWdodGVkXG4gICAgaWYgKGhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDQwKSB7IC8vIEFycm93RG93blxuICAgICAgICBrZXlkb3duRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5uYXZpZ2F0ZUF1dG9Db21wbGV0aW9uKE5BVklHQVRJT05fRElSRUNUSU9OUy5ORVhUKVxuICAgICAgfSBlbHNlIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDM4KSB7IC8vIEFycm93VXBcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGVBdXRvQ29tcGxldGlvbihOQVZJR0FUSU9OX0RJUkVDVElPTlMuUFJFVilcbiAgICAgIH0gZWxzZSBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzNykgeyAvLyBBcnJvd0xlZnRcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGF1dG9Db21wbGV0aW9uczogW10gfSlcbiAgICAgIH0gZWxzZSBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzOSkgeyAvLyBBcnJvd1JpZ2h0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhdXRvQ29tcGxldGlvbnM6IFtdIH0pXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMTMgJiYgIWtleWRvd25FdmVudC5zaGlmdEtleSkgeyAvLyBFbnRlciAod2l0aG91dCBTaGlmdCBvbmx5ISlcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hvb3NlSGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbigpXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gOSkgeyAvLyBUYWJcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hvb3NlSGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbigpXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgYXV0b0NvbXBsZXRpb25zOiBbXSB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDEzKSB7XG4gICAgICBpZiAoa2V5ZG93bkV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgICAgLy8gTWV0YStFbnRlciB3aGVuIG11bHRpLWxpbmUgY29tbWl0cyB0aGUgdmFsdWVcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9TYXZlKClcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFc2NhcGUgaXMgdGhlIHVuaXZlcnNhbCB3YXkgdG8gZXhpdCB0aGUgZWRpdG9yIHdpdGhvdXQgY29tbWl0dGluZ1xuICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDI3KSB7IC8vIEVzY2FwZVxuICAgICAgcmV0dXJuIHRoaXMuZG9DYW5jZWwoKVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUF1dG9Db21wbGV0ZXJDbGljayAoY29tcGxldGlvbikge1xuICAgIHRoaXMuY2hvb3NlQXV0b0NvbXBsZXRpb24oY29tcGxldGlvbilcbiAgfVxuXG4gIG5hdmlnYXRlQXV0b0NvbXBsZXRpb24gKGRpcmVjdGlvbikge1xuICAgIC8vIElmIG9ubHkgb25lIGl0ZW0gaW4gdGhlIGxpc3QsIG5vIG5lZWQgdG8gZG8gYW55dGhpbmcsIHNpbmNlIHRoZXJlJ3Mgbm93aGVyZSB0byBuYXZpZ2F0ZVxuICAgIGlmICh0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5sZW5ndGggPCAyKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICAvLyBTaGlmdCB0aGUgY3VycmVudGx5IHRvZ2dsZWQgYXV0b2NvbXBsZXRpb24gdG8gdGhlIG5leHQgb25lIGluIHRoZSBsaXN0LCB1c2luZyBhIHdyYXBhcm91bmQuXG4gICAgbGV0IGNoYW5nZWQgPSBmYWxzZVxuICAgIHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zLmZvckVhY2goKGNvbXBsZXRpb24sIGluZGV4KSA9PiB7XG4gICAgICBpZiAoIWNoYW5nZWQpIHtcbiAgICAgICAgaWYgKGNvbXBsZXRpb24uaGlnaGxpZ2h0ZWQpIHtcbiAgICAgICAgICBsZXQgbmlkeCA9IG1vZChpbmRleCArIGRpcmVjdGlvbiwgdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnMubGVuZ3RoKVxuICAgICAgICAgIC8vIE1heSBhcyB3ZWxsIGNoZWNrIGFuZCBza2lwIGlmIHdlJ3JlIGFib3V0IHRvIG1vZGlmeSB0aGUgY3VycmVudCBvbmVcbiAgICAgICAgICBpZiAobmlkeCAhPT0gaW5kZXgpIHtcbiAgICAgICAgICAgIGxldCBuZXh0ID0gdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnNbbmlkeF1cbiAgICAgICAgICAgIGNvbXBsZXRpb24uaGlnaGxpZ2h0ZWQgPSBmYWxzZVxuICAgICAgICAgICAgbmV4dC5oaWdobGlnaHRlZCA9IHRydWVcbiAgICAgICAgICAgIGNoYW5nZWQgPSB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYXV0b0NvbXBsZXRpb25zOiB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9uc1xuICAgIH0pXG4gIH1cblxuICBjaG9vc2VIaWdobGlnaHRlZEF1dG9Db21wbGV0aW9uICgpIHtcbiAgICBsZXQgY29tcGxldGlvbiA9IHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zLmZpbHRlcigoY29tcGxldGlvbikgPT4ge1xuICAgICAgcmV0dXJuICEhY29tcGxldGlvbi5oaWdobGlnaHRlZFxuICAgIH0pWzBdXG5cbiAgICAvLyBOb3Qgc3VyZSB3aHkgd2UnZCBnZXQgaGVyZSwgYnV0IGluIGNhc2UuLi5cbiAgICBpZiAoIWNvbXBsZXRpb24pIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgdGhlIHBhcnNlIHBvcHVsYXRlZCwgd2UgcmVhbGx5IGNhbid0IGRvIGFueXRoaW5nXG4gICAgaWYgKCF0aGlzLl9wYXJzZSkge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgdGhpcy5jaG9vc2VBdXRvQ29tcGxldGlvbihjb21wbGV0aW9uKVxuICB9XG5cbiAgY2hvb3NlQXV0b0NvbXBsZXRpb24gKGNvbXBsZXRpb24pIHtcbiAgICBsZXQgbGVuID0gdGhpcy5fcGFyc2UudGFyZ2V0LmVuZCAtIHRoaXMuX3BhcnNlLnRhcmdldC5zdGFydFxuICAgIGxldCBkb2MgPSB0aGlzLmNvZGVtaXJyb3IuZ2V0RG9jKClcbiAgICBsZXQgY3VyID0gdGhpcy5jb2RlbWlycm9yLmdldEN1cnNvcigpXG5cbiAgICBkb2MucmVwbGFjZVJhbmdlKFxuICAgICAgY29tcGxldGlvbi5uYW1lLFxuICAgICAgeyBsaW5lOiBjdXIubGluZSwgY2g6IGN1ci5jaCAtIGxlbiB9LFxuICAgICAgY3VyIC8vIHsgbGluZTogTnVtYmVyLCBjaDogTnVtYmVyIH1cbiAgICApXG5cbiAgICB0aGlzLnNldFN0YXRlKHsgYXV0b0NvbXBsZXRpb25zOiBbXSB9KVxuICB9XG5cbiAgZ2V0Q3Vyc29yT2Zmc2V0Q2hhciAoY3Vycywgc3JjKSB7XG4gICAgcmV0dXJuIGN1cnMuY2hcbiAgfVxuXG4gIGdldEN1cnNvck9mZnNldExpbmUgKGN1cnMsIHNyYykge1xuICAgIHJldHVybiBjdXJzLmxpbmUgKyAxXG4gIH1cblxuICBnZXRFdmFsdWF0b3JUZXh0ICgpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0ZS5ldmFsdWF0b3JUZXh0IHx8ICfigKLigKLigKInXG4gIH1cblxuICBnZXRFdmFsdXRhdG9yU3RhdGVDb2xvciAoKSB7XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLmV2YWx1YXRvclN0YXRlKSB7XG4gICAgICBjYXNlIEVWQUxVQVRPUl9TVEFURVMuV0FSTjogcmV0dXJuIFBhbGV0dGUuT1JBTkdFXG4gICAgICBjYXNlIEVWQUxVQVRPUl9TVEFURVMuRVJST1I6IHJldHVybiBQYWxldHRlLlJFRFxuICAgICAgZGVmYXVsdDogcmV0dXJuIFBhbGV0dGUuQ09BTFxuICAgIH1cbiAgfVxuXG4gIGdldEVkaXRvckNvbnRleHRDbGFzc05hbWUgKCkge1xuICAgIGxldCBuYW1lID0gW11cbiAgICBuYW1lLnB1c2goJ2hhaWt1LW11bHRpbGluZScpXG4gICAgbmFtZS5wdXNoKCdoYWlrdS1keW5hbWljJylcbiAgICByZXR1cm4gbmFtZS5qb2luKCcgJylcbiAgfVxuXG4gIGdldENvbnRhaW5lclN0eWxlICgpIHtcbiAgICBsZXQgc3R5bGUgPSB7XG4gICAgICB3aWR0aDogRURJVE9SX1dJRFRILFxuICAgICAgaGVpZ2h0OiBFRElUT1JfSEVJR0hULFxuICAgICAgLy8gb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcignIzRDNDM0QicpLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICAgIHpJbmRleDogOTAwMVxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldEVkaXRvckNvbnRleHRTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0gbG9kYXNoLmFzc2lnbih7XG4gICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIGZvbnRGYW1pbHk6ICdDb25zb2xhcywgbW9ub3NwYWNlJyxcbiAgICAgIGZvbnRTaXplOiAxMixcbiAgICAgIGxpbmVIZWlnaHQ6IEVESVRPUl9MSU5FX0hFSUdIVCArICdweCcsXG4gICAgICBoZWlnaHQ6ICdjYWxjKDEwMCUgLSA4MnB4KScsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgcGFkZGluZ0xlZnQ6IDcsXG4gICAgICBwYWRkaW5nVG9wOiAyMCxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdGV4dFNoYWRvdzogJzAgMCAwICcgKyBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC4zKSwgLy8gZGFya21hZ2ljXG4gICAgICB6SW5kZXg6IDIwMDUsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKCcjNEM0MzRCJyksXG4gICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiA0LFxuICAgICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDQsXG4gICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiA0LFxuICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDQsXG4gICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLCAvLyBMZXQgY29kZW1pcnJvciBkbyB0aGUgc2Nyb2xsaW5nXG4gICAgICB0b3A6IDQ0XG4gICAgfSlcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldFRvb2x0aXBTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkZBVEhFUl9DT0FMLFxuICAgICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgICAgYm94U2hhZG93OiAnMCAzcHggN3B4IDAgcmdiYSg3LDAsMywwLjQwKScsXG4gICAgICBjb2xvcjogUGFsZXR0ZS5TVU5TVE9ORSxcbiAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgIGZvbnRXZWlnaHQ6IDQwMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICBtaW5IZWlnaHQ6IDE1LFxuICAgICAgbWluV2lkdGg6IDI0LFxuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIHBhZGRpbmc6ICczcHggNXB4IDJweCA1cHgnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgdG9wOiAtMjQsXG4gICAgICB0cmFuc2Zvcm06ICdzY2FsZSguNCknLFxuICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAxODJtcyBjdWJpYy1iZXppZXIoLjE3NSwgLjg4NSwgLjMxNiwgMS4xNzEpJ1xuICAgIH1cbiAgICAvLyBJZiB3ZSdyZSBvcGVuLCB3ZSBzaG91bGQgc2hvdyB0aGUgZXZhbHVhdG9yIHRvb2x0aXBcbiAgICBpZiAodGhpcy5zdGF0ZS5ldmFsdWF0b3JTdGF0ZSA+IEVWQUxVQVRPUl9TVEFURVMuTk9ORSkge1xuICAgICAgbG9kYXNoLmFzc2lnbihzdHlsZSwge1xuICAgICAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKScsXG4gICAgICAgIG9wYWNpdHk6IDFcbiAgICAgIH0pXG4gICAgfVxuICAgIC8vIElmIHdlJ3JlIGluZm8sIHdhcm4sIG9yIGVycm9yIHdlIGhhdmUgY29udGVudCB0byBkaXNwbGF5XG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk9QRU4pIHtcbiAgICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLmdldEV2YWx1dGF0b3JTdGF0ZUNvbG9yKCksXG4gICAgICAgIHdpZHRoOiBFRElUT1JfV0lEVEhcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiBzdHlsZVxuICB9XG5cbiAgZ2V0VG9vbHRpcFRyaVN0eWxlICgpIHtcbiAgICBsZXQgc3R5bGUgPSB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAwLFxuICAgICAgaGVpZ2h0OiAwLFxuICAgICAgdG9wOiAxMyxcbiAgICAgIGxlZnQ6IDEyLFxuICAgICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC04LjhweCwgMCknLFxuICAgICAgYm9yZGVyTGVmdDogJzguOHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlclJpZ2h0OiAnOC44cHggc29saWQgdHJhbnNwYXJlbnQnLFxuICAgICAgYm9yZGVyVG9wOiAnOC44cHggc29saWQgJyArIHRoaXMuZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IoKVxuICAgIH1cbiAgICBpZiAodGhpcy5zdGF0ZS5ldmFsdWF0b3JTdGF0ZSA+IEVWQUxVQVRPUl9TVEFURVMuT1BFTikge1xuICAgICAgbG9kYXNoLmFzc2lnbihzdHlsZSwge1xuICAgICAgICBib3JkZXJUb3A6ICc4LjhweCBzb2xpZCAnICsgdGhpcy5nZXRFdmFsdXRhdG9yU3RhdGVDb2xvcigpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldFNlbGVjdFdyYXBwZXJTdHlsZSAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAyOCxcbiAgICAgIHBhZGRpbmdUb3A6IDYsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogNTAsXG4gICAgICB6SW5kZXg6IDkwMDAsXG4gICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgJyArIFBhbGV0dGUuTElHSFRFU1RfR1JBWVxuICAgIH1cbiAgfVxuXG4gIGdldEVsZW1lbnRUaXRsZSAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZWxlbWVudCkge1xuICAgICAgaWYgKHRoaXMucHJvcHMuZWxlbWVudC5ub2RlKSB7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmVsZW1lbnQubm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaWYgKHRoaXMucHJvcHMuZWxlbWVudC5ub2RlLmF0dHJpYnV0ZXNbJ2hhaWt1LXRpdGxlJ10pIHtcbiAgICAgICAgICAgIHJldHVybiBgJHt0cnVuY2F0ZSh0aGlzLnByb3BzLmVsZW1lbnQubm9kZS5hdHRyaWJ1dGVzWydoYWlrdS10aXRsZSddLCAxNil9YFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJyh1bmtub3duKSdcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9J2V2ZW50LWhhbmRsZXItZWRpdG9yLWNvbnRhaW5lcidcbiAgICAgICAgY2xhc3NOYW1lPSdBYnNvbHV0ZS1DZW50ZXInXG4gICAgICAgIG9uTW91c2VEb3duPXsobW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgIC8vIFByZXZlbnQgb3V0ZXIgdmlldyBmcm9tIGNsb3NpbmcgdXNcbiAgICAgICAgICBtb3VzZUV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIH19XG4gICAgICAgIHN0eWxlPXt0aGlzLmdldENvbnRhaW5lclN0eWxlKCl9PlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGlkPSdldmVudC1oYW5kbGVyLWlucHV0LXRvb2x0aXAnXG4gICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0VG9vbHRpcFN0eWxlKCl9PlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBpZD0nZXZlbnQtaGFuZGxlci1pbnB1dC10b29sdGlwLXRyaSdcbiAgICAgICAgICAgIHN0eWxlPXt0aGlzLmdldFRvb2x0aXBUcmlTdHlsZSgpfSAvPlxuICAgICAgICAgIHt0aGlzLmdldEV2YWx1YXRvclRleHQoKX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgaWQ9J2V2ZW50LWhhbmRsZXItc2VsZWN0LXdyYXBwZXInXG4gICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0U2VsZWN0V3JhcHBlclN0eWxlKCl9XG4gICAgICAgICAgY2xhc3NOYW1lPSduby1zZWxlY3QnPlxuICAgICAgICAgIDxDcmVhdGFibGVcbiAgICAgICAgICAgIG5hbWU9J2V2ZW50LW5hbWUnXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj0nQ2hvb3NlIEV2ZW50IE5hbWUuLi4nXG4gICAgICAgICAgICBjbGVhcmFibGU9e2ZhbHNlfVxuICAgICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUuc2VsZWN0ZWRFdmVudE5hbWV9XG4gICAgICAgICAgICBvcHRpb25zPXsodGhpcy5wcm9wcy5lbGVtZW50ICYmIHRoaXMucHJvcHMuZWxlbWVudC5nZXRBcHBsaWNhYmxlRXZlbnRIYW5kbGVyT3B0aW9uc0xpc3QoKSkgfHwgW119XG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2VkRXZlbnROYW1lLmJpbmQodGhpcyl9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgaWQ9J2V2ZW50LWhhbmRsZXItZWxlbWVudC10aXRsZSdcbiAgICAgICAgICBjbGFzc05hbWU9J25vLXNlbGVjdCdcbiAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6IDUsXG4gICAgICAgICAgICBsZWZ0OiBFRElUT1JfV0lEVEggLyAyIC0gMjAwLFxuICAgICAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgICAgIG1hcmdpbjogJzAgYXV0bycsXG4gICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgY29sb3I6ICcjOTk5JyxcbiAgICAgICAgICAgIHpJbmRleDogOTAwMFxuICAgICAgICAgIH19PlxuICAgICAgICAgIHtgRXZlbnQgTGlzdGVuZXJzIGZvciAke3RoaXMuZ2V0RWxlbWVudFRpdGxlKCl9YH1cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBpZD0nZXZlbnQtaGFuZGxlci1pbnB1dC1lZGl0b3ItY29udGV4dCdcbiAgICAgICAgICBjbGFzc05hbWU9e3RoaXMuZ2V0RWRpdG9yQ29udGV4dENsYXNzTmFtZSgpfVxuICAgICAgICAgIHJlZj17KGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHQgPSBlbGVtZW50XG4gICAgICAgICAgfX1cbiAgICAgICAgICBzdHlsZT17dGhpcy5nZXRFZGl0b3JDb250ZXh0U3R5bGUoKX0gLz5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9DYW5jZWwoKVxuICAgICAgICAgIH19XG4gICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgYm90dG9tOiA2LFxuICAgICAgICAgICAgcmlnaHQ6IDEyLFxuICAgICAgICAgICAgaGVpZ2h0OiAyMCxcbiAgICAgICAgICAgIGNvbG9yOiAnIzk5OScsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAwLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICdub25lJyxcbiAgICAgICAgICAgIHRleHREZWNvcmF0aW9uOiAndW5kZXJsaW5lJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIENhbmNlbFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9TYXZlKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIGRpc2FibGVkPXshdGhpcy5kb2VzQ3VycmVudENvZGVOZWVkU2F2ZSgpfVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGJvdHRvbTogNixcbiAgICAgICAgICAgIHJpZ2h0OiA2NSxcbiAgICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgICBjb2xvcjogKHRoaXMuZG9lc0N1cnJlbnRDb2RlTmVlZFNhdmUoKSkgPyBQYWxldHRlLkdSRUVOIDogJyM2NjYnLFxuICAgICAgICAgICAgY3Vyc29yOiAodGhpcy5kb2VzQ3VycmVudENvZGVOZWVkU2F2ZSgpKSA/ICdwb2ludGVyJyA6ICdub3QtYWxsb3dlZCcsXG4gICAgICAgICAgICB6SW5kZXg6IDEwMDAwLFxuICAgICAgICAgICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICdub25lJyxcbiAgICAgICAgICAgIGJvcmRlcjogYDFweCBzb2xpZCAkeygodGhpcy5kb2VzQ3VycmVudENvZGVOZWVkU2F2ZSgpKSA/IFBhbGV0dGUuR1JFRU4gOiAnIzY2NicpfWAsXG4gICAgICAgICAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgICAgICAgICAgcGFkZGluZzogJzJweCAxMnB4IDBweCAxMXB4J1xuICAgICAgICAgIH19PlxuICAgICAgICAgIFNhdmVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIHsvKiAgICAgICAgPEF1dG9Db21wbGV0ZXJcbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLmhhbmRsZUF1dG9Db21wbGV0ZXJDbGljay5iaW5kKHRoaXMpfVxuICAgICAgICAgIGxpbmU9e3RoaXMuZ2V0Q3Vyc29yT2Zmc2V0TGluZSh0aGlzLmNvZGVtaXJyb3IuZ2V0Q3Vyc29yKCkpIC0gMn1cbiAgICAgICAgICBoZWlnaHQ9e0VESVRPUl9IRUlHSFR9XG4gICAgICAgICAgd2lkdGg9e0VESVRPUl9XSURUSH1cbiAgICAgICAgICBsaW5lSGVpZ2h0PXtFRElUT1JfTElORV9IRUlHSFR9XG4gICAgICAgICAgYXV0b0NvbXBsZXRpb25zPXt0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9uc30gLz4gKi99XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cbn1cbiJdfQ==