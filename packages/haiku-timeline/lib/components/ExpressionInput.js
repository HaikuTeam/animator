'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/ExpressionInput.js';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

var _stripIndent = require('strip-indent');

var _stripIndent2 = _interopRequireDefault(_stripIndent);

var _marshalParams = require('@haiku/player/lib/reflection/marshalParams');

var _marshalParams2 = _interopRequireDefault(_marshalParams);

var _parseExpression = require('haiku-serialization/src/ast/parseExpression');

var _parseExpression2 = _interopRequireDefault(_parseExpression);

var _DefaultPalette = require('./DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _AutoCompleter = require('./AutoCompleter');

var _AutoCompleter2 = _interopRequireDefault(_AutoCompleter);

var _ItemHelpers = require('./helpers/ItemHelpers');

var _ExprSigns = require('./helpers/ExprSigns');

var EXPR_SIGNS = _interopRequireWildcard(_ExprSigns);

var _isNumeric = require('./helpers/isNumeric');

var _isNumeric2 = _interopRequireDefault(_isNumeric);

var _retToEq = require('./helpers/retToEq');

var _retToEq2 = _interopRequireDefault(_retToEq);

var _eqToRet = require('./helpers/eqToRet');

var _eqToRet2 = _interopRequireDefault(_eqToRet);

var _ensureRet = require('./helpers/ensureRet');

var _ensureRet2 = _interopRequireDefault(_ensureRet);

var _ensureEq = require('./helpers/ensureEq');

var _ensureEq2 = _interopRequireDefault(_ensureEq);

var _doesValueImplyExpression = require('./helpers/doesValueImplyExpression');

var _doesValueImplyExpression2 = _interopRequireDefault(_doesValueImplyExpression);

var _humanizePropertyName = require('./helpers/humanizePropertyName');

var _humanizePropertyName2 = _interopRequireDefault(_humanizePropertyName);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HaikuMode = require('./modes/haiku');

var MAX_AUTOCOMPLETION_ENTRIES = 8;

var EDITOR_MODES = {
  SINGLE_LINE: 1,
  MULTI_LINE: 2
};

var EVALUATOR_STATES = {
  NONE: 1, // None means a static value, no expression to evaluate
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

var EXPR_KINDS = {
  VALUE: 1, // A static value
  MACHINE: 2 // To be written as a function
};

var EDITOR_LINE_HEIGHT = 24;
var MAX_EDITOR_HEIGHT = 300;
var MIN_EDITOR_WIDTH_MULTILINE = 200;
var MAX_EDITOR_WIDTH_MULTILINE = 600;
var MIN_EDITOR_WIDTH_SINGLE_LINE = 140;
var MAX_EDITOR_WIDTH_SINGLE_LINE = 400;

function setOptions(opts) {
  for (var key in opts) {
    this.setOption(key, opts[key]);
  }return this;
}

/**
 * @function toValueDescriptor
 * @description Convert from object format provided by timeline to our internal format.
 */
function toValueDescriptor(_ref) {
  var bookendValue = _ref.bookendValue,
      computedValue = _ref.computedValue;

  if (bookendValue && bookendValue.__function) {
    return {
      kind: EXPR_KINDS.MACHINE,
      params: bookendValue.__function.params,
      body: bookendValue.__function.body
    };
  }

  return {
    kind: EXPR_KINDS.VALUE,
    params: [],
    body: computedValue + ''
  };
}

function getRenderableValueSingleline(valueDescriptor) {
  return (0, _retToEq2.default)(valueDescriptor.body.trim());
}

function getRenderableValueMultiline(valueDescriptor, skipFormatting) {
  var params = '';
  if (valueDescriptor.params && valueDescriptor.params.length > 0) {
    params = (0, _marshalParams2.default)(valueDescriptor.params);
  }

  // When initially loading the value, we probably want to format it.
  // During editing, when we dynamically change the signature, formatting can
  // mess things up, giving us extra spaces, and also mess with the cursor
  // position resetting, so we return it as-is.
  if (skipFormatting) {
    return 'function (' + params + ') {\n' + valueDescriptor.body + '\n}';
  } else {
    // We don't 'ensureRet' because in case of a multiline function, we can't be assured that
    // the user didn't return on a later line. However, we do a sanity check for the initial equal
    // sign in case the current case is converting from single to multi.
    return 'function (' + params + ') {\n  ' + (0, _eqToRet2.default)(valueDescriptor.body) + '\n}';
  }
}

var ExpressionInput = function (_React$Component) {
  _inherits(ExpressionInput, _React$Component);

  function ExpressionInput(props) {
    _classCallCheck(this, ExpressionInput);

    var _this = _possibleConstructorReturn(this, (ExpressionInput.__proto__ || Object.getPrototypeOf(ExpressionInput)).call(this, props));

    _this._context = null; // Our context element on which to mount codemirror
    _this._injectables = {}; // List of current custom keywords (to be erased/reset)
    _this._paramcache = null;
    _this._parse = null; // Cache of last parse of the input field

    _this.codemirror = (0, _codemirror2.default)(document.createElement('div'), {
      theme: 'haiku',
      mode: 'haiku'
    });
    _this.codemirror.setOptions = setOptions.bind(_this.codemirror);
    _this.codemirror.setValue('');
    _this.codemirror.on('change', _this.handleEditorChange.bind(_this));
    _this.codemirror.on('keydown', _this.handleEditorKeydown.bind(_this));
    _this.codemirror.on('beforeChange', function (cm, changeObject) {
      // If multiline mode, only allow a change to the function body, not the signature
      // Simply cancel any change that occurs in either of those places.
      if (_this.state.editingMode === EDITOR_MODES.MULTI_LINE && changeObject.origin !== 'setValue') {
        var lines = _this.state.editedValue.body.split('\n');
        if (changeObject.from.line === 0 || changeObject.from.line > lines.length) {
          changeObject.cancel();
        }
      }
    });

    _this.state = {
      useAutoCompleter: false, // Used to 'comment out' this feature until it's fully baked
      autoCompletions: [],
      editingMode: EDITOR_MODES.SINGLE_LINE,
      evaluatorText: null,
      evaluatorState: EVALUATOR_STATES.NONE,
      originalValue: null,
      editedValue: null
    };

    if (props.inputFocused) {
      _this.engageFocus(props);
    }
    return _this;
  }

  _createClass(ExpressionInput, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this._context) {
        while (this._context.firstChild) {
          this._context.removeChild(this._context.firstChild);
        }
        this._context.appendChild(this.codemirror.getWrapperElement());
      }
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.inputFocused) {
        this.engageFocus(nextProps);
      }
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

      if (committable.__function) {
        // Assume that we already stored warnings about this function in the evaluator state from a change action
        return false;
      } else {
        var observedType = typeof committable === 'undefined' ? 'undefined' : _typeof(committable);
        var expectedType = original.valueType;

        if (observedType !== expectedType) {
          return {
            reason: original.valueLabel + ' must have type "' + expectedType + '"'
          };
        }

        if (expectedType === 'number') {
          if (Math.abs(committable) === Infinity) {
            return {
              reason: 'Number cannot be infinity'
            };
          }

          if (isNaN(committable)) {
            return {
              reason: 'Not a number!'
            };
          }
        }
      }

      return false;
    }
  }, {
    key: 'requestNavigate',
    value: function requestNavigate(maybeDirection, maybeDoFocus) {
      var direction = maybeDirection === undefined ? NAVIGATION_DIRECTIONS.NEXT : maybeDirection;
      this.props.onNavigateRequested(direction, maybeDoFocus);
    }
  }, {
    key: 'getCommitableValue',
    value: function getCommitableValue(valueDescriptor, originalDescriptor) {
      // If we are in multi-line mode then assume we want to create an expression as opposed to a string.
      // We get problems if we don't do this like a function that doesn't match our naive expression check
      // e.g. function () { if (foo) { ... } else { ... }} which doesn't begin with a return
      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE || (0, _doesValueImplyExpression2.default)(valueDescriptor.body)) {
        // Note that extra/cached fields are stripped off of the function, like '.summary'
        return {
          __function: {
            // Flag this function as an injectee, so downstream AST producers
            // know that this function needs to be wrapped in `Haiku.inject`
            injectee: true,
            params: valueDescriptor.params,
            body: (0, _eqToRet2.default)(valueDescriptor.body)
          }
        };
      }

      var out = void 0;
      try {
        out = JSON.parse(valueDescriptor.body);
      } catch (exception) {
        out = valueDescriptor.body + '';
      }

      if ((0, _isNumeric2.default)(out)) {
        out = Number(out);
      }

      if (originalDescriptor.valueType === 'boolean') {
        if (out === 'true') {
          out = true;
        } else if (out === 'false') {
          out = false;
        }
      } else if (originalDescriptor.propertyName === 'opacity') {
        if (out > 1) {
          out = 1;
        } else if (out < 0) {
          out = 0;
        }
      }

      return out;
    }
  }, {
    key: 'performCommit',
    value: function performCommit(maybeNavigationDirection, doFocusSubsequentCell) {
      var original = this.props.reactParent.getItemValueDescriptor(this.props.inputFocused);

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

      this.props.onCommitValue(committable);

      // Once finished with a successful commit, navigate to 'select' the next cell
      this.requestNavigate(maybeNavigationDirection, doFocusSubsequentCell);
    }
  }, {
    key: 'handleEditorChange',
    value: function handleEditorChange(cm, changeObject) {
      if (changeObject.origin === 'setValue') {
        return void 0;
      }

      // Any change should unset the current error state of the
      this.setState({
        evaluatorText: null
      });

      var rawValueFromEditor = cm.getValue();

      // We 'skipFormatting' to avoid keystroke spacing problems
      var officialValue = this.rawValueToOfficialValue(rawValueFromEditor, EXPR_SIGNS.RET, true);

      if (officialValue.kind === EXPR_KINDS.VALUE) {
        // For a static value, simply set the state as-is based on the input
        this.setState({
          autoCompletions: [], // No autocompletions at all if we're only doing a static value
          evaluatorState: EVALUATOR_STATES.NONE
        });
      } else if (officialValue.kind === EXPR_KINDS.MACHINE) {
        // By default, assume we are in an open evaluator state (will check for error in a moment)
        this.setState({
          evaluatorState: EVALUATOR_STATES.OPEN
        });

        // If the last entry was a space, remove autocomplete before we start parsing, which might fail
        // if we have an incomplete expression-in-progress inside the editor
        // Also remove any completions if the editor does not have focus
        if (!cm.hasFocus() || changeObject && changeObject.text && changeObject.text[0] === ' ') {
          this.setState({
            autoCompletions: []
          });
        }

        // We'll use these both for auto-assigning function signature params and for syntax highlighting.
        // We do this first because it populates HaikuMode.keywords with vars, which we will use when
        // parsing to produce a summary that includes add'l validation information about the contents
        var injectables = this.props.reactParent._component._componentInstance._getInjectables();
        this.resetSyntaxInjectables(injectables);

        // This wrapping is required for parsing to work (parens are needed to make it an expression)
        var wrapped = _parseExpression2.default.wrap(officialValue.body);
        var cursor1 = this.codemirror.getCursor();

        var parse = (0, _parseExpression2.default)(wrapped, injectables, HaikuMode.keywords, this.state, {
          line: this.getCursorOffsetLine(cursor1),
          ch: this.getCursorOffsetChar(cursor1)
        });

        this._parse = parse; // Caching this to make it faster to read for autocompletions

        if (parse.error) {
          this.setState({
            autoCompletions: [],
            evaluatorState: EVALUATOR_STATES.ERROR,
            evaluatorText: parse.error.message
          });
        }

        // Even despite an error, we still want to allow the function signature to display, so use a cached one.
        // Without this, the function signature appears to quickly reappear and disappear as the user types, which is annoying.
        if (parse.error && this._paramcache) {
          officialValue.params = this._paramcache;
        } else if (!parse.error) {
          // Used to display previous params despite a syntax error in the function body
          this._paramcache = parse.params;
          officialValue.params = parse.params;
          officialValue.parse = parse; // Cached for faster validation downstream

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
        } else {
          // TODO: Can we do anything except continue if we have an error but no param cache?
        }
      } else {
        throw new Error('[timeline] Expression input saw unexpexcted expression kind');
      }

      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        // If we're in multi-line mode, then update the function signature
        // Track the cursor so we can place it back where it was...
        var cursor2 = this.codemirror.getCursor();

        // Update the editor contents
        // We set 'skipFormatting' to true here so we don't get weird spacing issues
        var renderable = getRenderableValueMultiline(officialValue, true);

        this.codemirror.setValue(renderable);

        // Now put the cursor where it was originally
        this.codemirror.setCursor(cursor2);
      }

      this.codemirror.setSize(this.getEditorWidth(), this.getEditorHeight() - 2);

      this.setState({
        editedValue: officialValue
      });
    }
  }, {
    key: 'getCursorOffsetLine',
    value: function getCursorOffsetLine(curs, src) {
      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        return curs.line + 1;
      } else {
        return curs.line + 2; // Offset to account for 1-based index and initial function signature line
      }
    }
  }, {
    key: 'getCursorOffsetChar',
    value: function getCursorOffsetChar(curs, src) {
      if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        return curs.ch;
      } else {
        return curs.ch + 5; // Offset to account for replacing = with 'return'
      }
    }
  }, {
    key: 'resetSyntaxInjectables',
    value: function resetSyntaxInjectables(injectables) {
      // Remove all former entries in the keywords list
      for (var key in this._injectables) {
        if (!injectables[key]) {
          // No point deleting if it will be in the new list
          delete HaikuMode.keywords[key];
        }
      }

      // Add new entries in the list
      this._injectables = injectables;
      for (var _key in this._injectables) {
        if (!HaikuMode.keywords[_key]) {
          // No point adding if it is already in the list
          HaikuMode.keywords[_key] = {
            type: 'keyword a',
            style: 'keyword'
          };
        }
      }
    }
  }, {
    key: 'rawValueToOfficialValue',
    value: function rawValueToOfficialValue(raw, desiredExpressionSign, skipFormatting) {
      if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
        if ((0, _doesValueImplyExpression2.default)(raw)) {
          var clean = raw.trim();

          // The caller can decide whether they want the expression symbol to officially be '=' or 'return'
          // when presented as the formal final value for this method
          clean = desiredExpressionSign === EXPR_SIGNS.EQ ? (0, _ensureEq2.default)(clean) : (0, _ensureRet2.default)(clean);

          return {
            kind: EXPR_KINDS.MACHINE,
            params: [], // To populate later
            body: clean
          };
        } else {
          return {
            kind: EXPR_KINDS.VALUE,
            params: [], // To populate later
            body: raw // Just use the raw body, no machine no trimming (allow spaces!)
          };
        }
      } else if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        // The body will determine the params, so we can safely discard the function prefix/suffix
        var lines = raw.split('\n');
        var body = lines.slice(1, lines.length - 1).join('\n');

        // In some cases the indent stripping causes issues, so don't do it in all cases.
        // For example, while typing we need to update the function signature but not interferer
        // with the function body being mutated.
        if (!skipFormatting) {
          body = (0, _stripIndent2.default)(body);
        }

        return {
          kind: EXPR_KINDS.MACHINE,
          params: [], // To populate later
          body: body
        };
      } else {
        throw new Error('[timeline] Expression input saw unexpexcted editing mode');
      }
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

      if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
        // If tab during single-line editing, commit and navigate
        if (keydownEvent.which === 9) {
          // Tab
          keydownEvent.preventDefault();
          return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false);
        }

        if (keydownEvent.which === 13) {
          // Enter
          // Shift+Enter when multi-line starts multi-line mode (and adds a new line)
          if (keydownEvent.shiftKey) {
            keydownEvent.preventDefault();
            return this.launchMultilineMode(keydownEvent.key);
          }
          // Enter when single-line commits the value
          // Meta+Enter when single-line commits the value
          keydownEvent.preventDefault();
          return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false);
        }

        if (keydownEvent.which === 40) {
          // ArrowDown
          keydownEvent.preventDefault();
          return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false);
        }

        if (keydownEvent.which === 38) {
          // ArrowUp
          keydownEvent.preventDefault();
          return this.performCommit(NAVIGATION_DIRECTIONS.PREV, false);
        }
      } else if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
        if (keydownEvent.which === 13) {
          if (keydownEvent.metaKey) {
            // Meta+Enter when multi-line commits the value
            keydownEvent.preventDefault();
            return this.performCommit(NAVIGATION_DIRECTIONS.NEXT, false);
          }
          // Enter when multi-line just adds a new line
          // Shift+Enter when multi-line just adds a new line
        }
      }

      // Escape is the universal way to exit the editor without committing
      if (keydownEvent.which === 27) {
        // Escape
        this.requestNavigate(NAVIGATION_DIRECTIONS.SAME, false);
      }

      // Let all other keys pass through
    }
  }, {
    key: 'navigateAutoCompletion',
    value: function navigateAutoCompletion(direction) {
      var _this2 = this;

      // If only one item in the list, no need to do anything, since there's nowhere to navigate
      if (this.state.autoCompletions.length < 2) {
        return void 0;
      }

      // Shift the currently toggled autocompletion to the next one in the list, using a wraparound.
      var changed = false;
      this.state.autoCompletions.forEach(function (completion, index) {
        if (!changed) {
          if (completion.highlighted) {
            var nidx = (0, _ItemHelpers.mod)(index + direction, _this2.state.autoCompletions.length);
            // May as well check and skip if we're about to modify the current one
            if (nidx !== index) {
              var next = _this2.state.autoCompletions[nidx];
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
    key: 'handleAutoCompleterClick',
    value: function handleAutoCompleterClick(completion) {
      this.chooseAutoCompletion(completion);
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

    /**
     * @method willHandleKeydownEvent
     * @description If we want to handle this, return true to short circuit higher-level handlers.
     * If we don't care, return a falsy value to indicate downstream handlers can take it.
     */

  }, {
    key: 'willHandleExternalKeydownEvent',
    value: function willHandleExternalKeydownEvent(keydownEvent) {
      if (keydownEvent._alreadyHandled) {
        return true;
      }

      if (this.props.inputFocused) {
        // When focused, assume we *always* handle keyboard events, no exceptions.
        // If you want to handle an input when focused, used handleEditorKeydown
        return true;
      } else if (this.props.inputSelected) {
        // Up/down arrows (when selected) navigate the selection state between cells
        if (keydownEvent.which === 38) {
          // Up arrow
          this.requestNavigate(NAVIGATION_DIRECTIONS.PREV, false);
          return true;
        } else if (keydownEvent.which === 40) {
          // Down arrow
          this.requestNavigate(NAVIGATION_DIRECTIONS.NEXT, false);
          return true;
        }

        // When tabbing, we navigate down by one input
        if (keydownEvent.which === 9) {
          // Tab
          this.requestNavigate(NAVIGATION_DIRECTIONS.NEXT, false);
          return true;
        }

        // Enter when selected brings us into a focused state
        if (keydownEvent.which === 13) {
          // Enter
          // Without this preventDefault, a newline will be inserted prior to the contents!
          // Note we only want to block this if we are requesting focused, newlines need to be
          // permitted in case of multiline mode
          keydownEvent.preventDefault();

          this.props.onFocusRequested();
          return true;
        }

        // Any 'edit' key (letters, numbers, etc) brings us into a focused state
        // Any mismatch of these usually indicates the key is a letter/number/symbol
        if (keydownEvent.key !== keydownEvent.code) {
          this.props.onFocusRequested(keydownEvent.key);
          return true;
        }
        // The delete key is also supported as a way to enter into a focused state
        if (keydownEvent.which === 46 || keydownEvent.which === 8) {
          // Delete
          this.props.onFocusRequested(keydownEvent.key);
        }

        return false;
      } else {
        return false;
      }
    }
  }, {
    key: 'launchMultilineMode',
    value: function launchMultilineMode() {
      var _this3 = this;

      this.setState({
        editingMode: EDITOR_MODES.MULTI_LINE
      }, function () {
        _this3.recalibrateEditor();
      });
    }
  }, {
    key: 'launchSinglelineMode',
    value: function launchSinglelineMode() {
      var _this4 = this;

      this.setState({
        editingMode: EDITOR_MODES.SINGLE_LINE
      }, function () {
        _this4.recalibrateEditor();
      });
    }
  }, {
    key: 'engageFocus',
    value: function engageFocus(props) {
      var _this5 = this;

      if (!props.inputFocused) {
        throw new Error('[timeline] Focused input payload must be passed before calling engageFocus()');
      }

      var originalDescriptor = props.reactParent.getItemValueDescriptor(props.inputFocused);
      var originalValue = toValueDescriptor(originalDescriptor);

      var editingMode = EDITOR_MODES.SINGLE_LINE;

      // If we received an input with multiple lines that is a machine, assume it should be treated like
      // an expression with a multi-line view, otherwise just a normal expression term
      if (originalValue.kind === EXPR_KINDS.MACHINE) {
        if (originalValue.body.split('\n').length > 1) {
          editingMode = EDITOR_MODES.MULTI_LINE;
        }
      }

      this.setState({
        editingMode: editingMode,
        evaluatorText: null,
        // If we detect the incoming value is static (a "VALUE"), don't show the evaluator.
        // Otherwise, we have an expression, so make sure we show the evaluator from the outset.
        evaluatorState: originalValue.kind === EXPR_KINDS.VALUE ? EVALUATOR_STATES.NONE : EVALUATOR_STATES.OPEN,
        originalValue: originalValue,
        editedValue: originalValue
      }, function () {
        _this5.recalibrateEditor();
        _this5.handleEditorChange(_this5.codemirror, {});
      });
    }
  }, {
    key: 'recalibrateEditor',
    value: function recalibrateEditor(cursor) {
      var renderable = '';

      switch (this.state.editingMode) {
        case EDITOR_MODES.MULTI_LINE:
          this.codemirror.setOptions({
            lineNumbers: true,
            scrollbarStyle: 'native'
          });
          renderable = getRenderableValueMultiline(this.state.editedValue);
          this.codemirror.setValue(renderable);
          break;

        default:
          this.codemirror.setOptions({
            lineNumbers: false,
            scrollbarStyle: 'null'
          });
          renderable = getRenderableValueSingleline(this.state.editedValue);
          this.codemirror.setValue(renderable);
      }

      // Must focus in order to correctly capture key events and put the curser in the field
      this.codemirror.focus();

      // If cursor explicitly passed, use it. This is used by chooseAutocompletion
      if (cursor) {
        this.codemirror.setCursor(cursor);
      } else {
        if (this.state.editingMode === EDITOR_MODES.MULTI_LINE) {
          this.codemirror.setCursor({ line: 1, ch: renderable.split('\n')[1].length });
        } else {
          this.codemirror.setCursor({ line: 1, ch: renderable.length });
        }
      }

      // Note that this has to happen *after* we set the value or it'll end up with the previous value
      this.codemirror.setSize(this.getEditorWidth(), this.getEditorHeight() - 2);

      // If single-line, select all so the user can quickly delete the previous entry
      if (this.state.editingMode === EDITOR_MODES.SINGLE_LINE) {
        this.codemirror.execCommand('selectAll');
      }

      this.forceUpdate();
    }
  }, {
    key: 'getEditorWidth',
    value: function getEditorWidth() {
      var longest = this.getLongestLine();
      var pxw = longest.length * this.getEstimatedCharWidth();
      switch (this.state.editingMode) {
        case EDITOR_MODES.MULTI_LINE:
          if (pxw < MIN_EDITOR_WIDTH_MULTILINE) return MIN_EDITOR_WIDTH_MULTILINE;
          if (pxw > MAX_EDITOR_WIDTH_MULTILINE) return MAX_EDITOR_WIDTH_MULTILINE;
          return pxw;
        default:
          if (pxw < MIN_EDITOR_WIDTH_SINGLE_LINE) return MIN_EDITOR_WIDTH_SINGLE_LINE;
          if (pxw > MAX_EDITOR_WIDTH_SINGLE_LINE) return MAX_EDITOR_WIDTH_SINGLE_LINE;
          return pxw;
      }
    }
  }, {
    key: 'getEditorHeight',
    value: function getEditorHeight() {
      var rowh = this.props.reactParent.state.rowHeight;
      switch (this.state.editingMode) {
        case EDITOR_MODES.MULTI_LINE:
          rowh = rowh - 4; // Ends up a bit too big...
          var finalh = rowh * this.getTotalLineCount();
          if (finalh > MAX_EDITOR_HEIGHT) finalh = MAX_EDITOR_HEIGHT;
          return ~~finalh;
        default:
          return rowh;
      }
    }
  }, {
    key: 'getEstimatedCharWidth',
    value: function getEstimatedCharWidth() {
      // Trivial for monospace, but for normal fonts, what to use?
      return 9; // ???
    }
  }, {
    key: 'getLines',
    value: function getLines() {
      return this.codemirror.getValue().split('\n');
    }
  }, {
    key: 'getTotalLineCount',
    value: function getTotalLineCount() {
      return this.getLines().length;
    }
  }, {
    key: 'getLongestLine',
    value: function getLongestLine() {
      var max = '';
      var lines = this.getLines();
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length > max.length) {
          max = lines[i];
        }
      }
      return max;
    }
  }, {
    key: 'getEvaluatorText',
    value: function getEvaluatorText() {
      return this.state.evaluatorText || '•••';
    }
  }, {
    key: 'getLabelString',
    value: function getLabelString() {
      var name = this.props.inputFocused && this.props.inputFocused.property.name || '';
      return (0, _humanizePropertyName2.default)(name);
    }
  }, {
    key: 'getRootRect',
    value: function getRootRect() {
      if (!this.props.inputFocused) {
        return {
          left: 0,
          top: 0
        };
      }

      // When we become focused, we need to move to the position of the input cell we are
      // working with, and we do so by looking up the DOM node of the cell matching our property id
      var elid = (0, _ItemHelpers.getItemPropertyId)(this.props.inputFocused);
      var fellow = document.getElementById(elid);

      // There might not be an element for the input cell if the cell was unfocused as part of accordion
      // collapse (which would result in that element being removed from the DOM), hence this guard
      if (!fellow) {
        return {
          left: 0,
          top: 0
        };
      }

      return fellow.getBoundingClientRect();
    }
  }, {
    key: 'getEvalutatorStateColor',
    value: function getEvalutatorStateColor() {
      switch (this.state.evaluatorState) {
        case EVALUATOR_STATES.WARN:
          return _DefaultPalette2.default.ORANGE;
        case EVALUATOR_STATES.ERROR:
          return _DefaultPalette2.default.RED;
        default:
          return _DefaultPalette2.default.FATHER_COAL;
      }
    }
  }, {
    key: 'getRootStyle',
    value: function getRootStyle() {
      var style = _lodash2.default.assign({
        height: this.getEditorHeight() + 1,
        left: 0,
        outline: 'none',
        position: 'relative',
        top: 0,
        visibility: 'hidden',
        width: this.props.reactParent.state.inputCellWidth,
        zIndex: 5000
      });

      if (this.props.inputFocused) {
        style.visibility = 'visible';
        var rect = this.getRootRect();
        style.left = rect.left;
        style.top = rect.top;
      }

      return style;
    }
  }, {
    key: 'getColsWrapperStyle',
    value: function getColsWrapperStyle() {
      var style = _lodash2.default.assign({
        position: 'absolute',
        top: 0,
        left: 0,
        display: 'inline-flex',
        height: '100%'
      }, this.props.inputFocused && {
        boxShadow: '0 2px 4px 0 rgba(15,1,6,0.06), 0 6px 53px 3px rgba(7,0,3,0.37), inset 0 0 7px 0 rgba(16,0,6,0.30)'
      });
      return style;
    }
  }, {
    key: 'getInputLabelStyle',
    value: function getInputLabelStyle() {
      var style = {
        backgroundColor: _DefaultPalette2.default.LIGHTEST_PINK,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        color: _DefaultPalette2.default.SUNSTONE,
        display: 'none',
        fontWeight: 400,
        left: -83,
        lineHeight: 1,
        position: 'absolute',
        textAlign: 'center',
        textTransform: 'uppercase',
        width: 83
      };
      _lodash2.default.assign(style, this.props.inputFocused && {
        fontSize: 10,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      });
      style.height = this.getEditorHeight() + 1;
      return style;
    }
  }, {
    key: 'getEditorContextStyle',
    value: function getEditorContextStyle() {
      var style = _lodash2.default.assign({
        backgroundColor: _DefaultPalette2.default.LIGHT_GRAY,
        border: '1px solid ' + _DefaultPalette2.default.DARKER_GRAY,
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4,
        color: 'transparent',
        cursor: 'default',
        fontFamily: this.state.editingMode === EDITOR_MODES.SINGLE_LINE ? 'inherit' : 'Consolas, monospace',
        fontSize: 12,
        lineHeight: EDITOR_LINE_HEIGHT + 'px',
        height: this.getEditorHeight() + 1,
        width: this.getEditorWidth(),
        outline: 'none',
        overflow: 'hidden',
        paddingLeft: 7,
        paddingTop: 1,
        position: 'absolute',
        textShadow: '0 0 0 ' + (0, _color2.default)(_DefaultPalette2.default.ROCK).fade(0.3), // darkmagic
        zIndex: 1004
      });
      _lodash2.default.assign(style, {
        border: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.LIGHTEST_PINK).fade(0.2),
        zIndex: 2005
      });
      _lodash2.default.assign(style, this.props.inputFocused && {
        backgroundColor: (0, _color2.default)('#4C434B').fade(0.1),
        border: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.LIGHTEST_PINK).fade(0.2),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 4,
        color: _DefaultPalette2.default.ROCK
      });
      return style;
    }
  }, {
    key: 'getEditorContextClassName',
    value: function getEditorContextClassName() {
      var name = [];
      name.push(this.state.editingMode === EDITOR_MODES.SINGLE_LINE ? 'haiku-singleline' : 'haiku-multiline');
      name.push(this.state.evaluatorState > EVALUATOR_STATES.NONE ? 'haiku-dynamic' : 'haiku-static');
      return name.join(' ');
    }
  }, {
    key: 'getTooltipStyle',
    value: function getTooltipStyle() {
      var style = {
        backgroundColor: _DefaultPalette2.default.FATHER_COAL,
        borderRadius: 3,
        boxShadow: '0 3px 7px 0 rgba(7,0,3,0.40)',
        color: _DefaultPalette2.default.SUNSTONE,
        fontSize: 10,
        fontWeight: 400,
        left: 0,
        minHeight: 15,
        minWidth: 24,
        opacity: 0,
        padding: '3px 5px 2px 5px',
        position: 'absolute',
        textAlign: 'center',
        top: -26,
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
          width: 300
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
        top: 17,
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
    key: 'render',
    value: function render() {
      var _this6 = this;

      return _react2.default.createElement(
        'div',
        {
          id: 'expression-input-holster',
          style: this.getRootStyle(), __source: {
            fileName: _jsxFileName,
            lineNumber: 1042
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          {
            id: 'expression-input-cols-wrapper',
            style: this.getColsWrapperStyle(), __source: {
              fileName: _jsxFileName,
              lineNumber: 1045
            },
            __self: this
          },
          _react2.default.createElement(
            'span',
            {
              id: 'expression-input-label',
              style: this.getInputLabelStyle(), __source: {
                fileName: _jsxFileName,
                lineNumber: 1048
              },
              __self: this
            },
            this.getLabelString()
          ),
          _react2.default.createElement(
            'span',
            {
              id: 'expression-input-tooltip',
              style: this.getTooltipStyle(), __source: {
                fileName: _jsxFileName,
                lineNumber: 1054
              },
              __self: this
            },
            _react2.default.createElement('span', {
              id: 'expression-input-tooltip-tri',
              style: this.getTooltipTriStyle(), __source: {
                fileName: _jsxFileName,
                lineNumber: 1057
              },
              __self: this
            }),
            this.getEvaluatorText()
          ),
          _react2.default.createElement('div', {
            id: 'expression-input-editor-context',
            className: this.getEditorContextClassName(),
            ref: function ref(element) {
              _this6._context = element;
            },
            style: this.getEditorContextStyle(), __source: {
              fileName: _jsxFileName,
              lineNumber: 1062
            },
            __self: this
          }),
          _react2.default.createElement(_AutoCompleter2.default, {
            onClick: this.handleAutoCompleterClick.bind(this),
            line: this.getCursorOffsetLine(this.codemirror.getCursor()) - 2,
            height: this.getEditorHeight(),
            width: this.getEditorWidth(),
            lineHeight: EDITOR_LINE_HEIGHT,
            autoCompletions: this.state.autoCompletions, __source: {
              fileName: _jsxFileName,
              lineNumber: 1069
            },
            __self: this
          })
        )
      );
    }
  }]);

  return ExpressionInput;
}(_react2.default.Component);

exports.default = ExpressionInput;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0V4cHJlc3Npb25JbnB1dC5qcyJdLCJuYW1lcyI6WyJFWFBSX1NJR05TIiwiSGFpa3VNb2RlIiwicmVxdWlyZSIsIk1BWF9BVVRPQ09NUExFVElPTl9FTlRSSUVTIiwiRURJVE9SX01PREVTIiwiU0lOR0xFX0xJTkUiLCJNVUxUSV9MSU5FIiwiRVZBTFVBVE9SX1NUQVRFUyIsIk5PTkUiLCJPUEVOIiwiSU5GTyIsIldBUk4iLCJFUlJPUiIsIk5BVklHQVRJT05fRElSRUNUSU9OUyIsIlNBTUUiLCJORVhUIiwiUFJFViIsIkVYUFJfS0lORFMiLCJWQUxVRSIsIk1BQ0hJTkUiLCJFRElUT1JfTElORV9IRUlHSFQiLCJNQVhfRURJVE9SX0hFSUdIVCIsIk1JTl9FRElUT1JfV0lEVEhfTVVMVElMSU5FIiwiTUFYX0VESVRPUl9XSURUSF9NVUxUSUxJTkUiLCJNSU5fRURJVE9SX1dJRFRIX1NJTkdMRV9MSU5FIiwiTUFYX0VESVRPUl9XSURUSF9TSU5HTEVfTElORSIsInNldE9wdGlvbnMiLCJvcHRzIiwia2V5Iiwic2V0T3B0aW9uIiwidG9WYWx1ZURlc2NyaXB0b3IiLCJib29rZW5kVmFsdWUiLCJjb21wdXRlZFZhbHVlIiwiX19mdW5jdGlvbiIsImtpbmQiLCJwYXJhbXMiLCJib2R5IiwiZ2V0UmVuZGVyYWJsZVZhbHVlU2luZ2xlbGluZSIsInZhbHVlRGVzY3JpcHRvciIsInRyaW0iLCJnZXRSZW5kZXJhYmxlVmFsdWVNdWx0aWxpbmUiLCJza2lwRm9ybWF0dGluZyIsImxlbmd0aCIsIkV4cHJlc3Npb25JbnB1dCIsInByb3BzIiwiX2NvbnRleHQiLCJfaW5qZWN0YWJsZXMiLCJfcGFyYW1jYWNoZSIsIl9wYXJzZSIsImNvZGVtaXJyb3IiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ0aGVtZSIsIm1vZGUiLCJiaW5kIiwic2V0VmFsdWUiLCJvbiIsImhhbmRsZUVkaXRvckNoYW5nZSIsImhhbmRsZUVkaXRvcktleWRvd24iLCJjbSIsImNoYW5nZU9iamVjdCIsInN0YXRlIiwiZWRpdGluZ01vZGUiLCJvcmlnaW4iLCJsaW5lcyIsImVkaXRlZFZhbHVlIiwic3BsaXQiLCJmcm9tIiwibGluZSIsImNhbmNlbCIsInVzZUF1dG9Db21wbGV0ZXIiLCJhdXRvQ29tcGxldGlvbnMiLCJldmFsdWF0b3JUZXh0IiwiZXZhbHVhdG9yU3RhdGUiLCJvcmlnaW5hbFZhbHVlIiwiaW5wdXRGb2N1c2VkIiwiZW5nYWdlRm9jdXMiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJhcHBlbmRDaGlsZCIsImdldFdyYXBwZXJFbGVtZW50IiwibmV4dFByb3BzIiwiY29tbWl0dGFibGUiLCJvcmlnaW5hbCIsInJlYXNvbiIsIm9ic2VydmVkVHlwZSIsImV4cGVjdGVkVHlwZSIsInZhbHVlVHlwZSIsInZhbHVlTGFiZWwiLCJNYXRoIiwiYWJzIiwiSW5maW5pdHkiLCJpc05hTiIsIm1heWJlRGlyZWN0aW9uIiwibWF5YmVEb0ZvY3VzIiwiZGlyZWN0aW9uIiwidW5kZWZpbmVkIiwib25OYXZpZ2F0ZVJlcXVlc3RlZCIsIm9yaWdpbmFsRGVzY3JpcHRvciIsImluamVjdGVlIiwib3V0IiwiSlNPTiIsInBhcnNlIiwiZXhjZXB0aW9uIiwiTnVtYmVyIiwicHJvcGVydHlOYW1lIiwibWF5YmVOYXZpZ2F0aW9uRGlyZWN0aW9uIiwiZG9Gb2N1c1N1YnNlcXVlbnRDZWxsIiwicmVhY3RQYXJlbnQiLCJnZXRJdGVtVmFsdWVEZXNjcmlwdG9yIiwiZ2V0Q29tbWl0YWJsZVZhbHVlIiwiaW52YWxpZCIsImlzQ29tbWl0dGFibGVWYWx1ZUludmFsaWQiLCJzZXRTdGF0ZSIsIm9uQ29tbWl0VmFsdWUiLCJyZXF1ZXN0TmF2aWdhdGUiLCJyYXdWYWx1ZUZyb21FZGl0b3IiLCJnZXRWYWx1ZSIsIm9mZmljaWFsVmFsdWUiLCJyYXdWYWx1ZVRvT2ZmaWNpYWxWYWx1ZSIsIlJFVCIsImhhc0ZvY3VzIiwidGV4dCIsImluamVjdGFibGVzIiwiX2NvbXBvbmVudCIsIl9jb21wb25lbnRJbnN0YW5jZSIsIl9nZXRJbmplY3RhYmxlcyIsInJlc2V0U3ludGF4SW5qZWN0YWJsZXMiLCJ3cmFwcGVkIiwid3JhcCIsImN1cnNvcjEiLCJnZXRDdXJzb3IiLCJrZXl3b3JkcyIsImdldEN1cnNvck9mZnNldExpbmUiLCJjaCIsImdldEN1cnNvck9mZnNldENoYXIiLCJlcnJvciIsIm1lc3NhZ2UiLCJ3YXJuaW5ncyIsImFubm90YXRpb24iLCJjb21wbGV0aW9ucyIsInNvcnQiLCJhIiwiYiIsIm5hIiwibmFtZSIsInRvTG93ZXJDYXNlIiwibmIiLCJzbGljZSIsImhpZ2hsaWdodGVkIiwiRXJyb3IiLCJjdXJzb3IyIiwicmVuZGVyYWJsZSIsInNldEN1cnNvciIsInNldFNpemUiLCJnZXRFZGl0b3JXaWR0aCIsImdldEVkaXRvckhlaWdodCIsImN1cnMiLCJzcmMiLCJ0eXBlIiwic3R5bGUiLCJyYXciLCJkZXNpcmVkRXhwcmVzc2lvblNpZ24iLCJjbGVhbiIsIkVRIiwiam9pbiIsImtleWRvd25FdmVudCIsIl9hbHJlYWR5SGFuZGxlZCIsImhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zIiwiZmlsdGVyIiwiY29tcGxldGlvbiIsIndoaWNoIiwicHJldmVudERlZmF1bHQiLCJuYXZpZ2F0ZUF1dG9Db21wbGV0aW9uIiwic2hpZnRLZXkiLCJjaG9vc2VIaWdobGlnaHRlZEF1dG9Db21wbGV0aW9uIiwicGVyZm9ybUNvbW1pdCIsImxhdW5jaE11bHRpbGluZU1vZGUiLCJtZXRhS2V5IiwiY2hhbmdlZCIsImZvckVhY2giLCJpbmRleCIsIm5pZHgiLCJuZXh0IiwiY2hvb3NlQXV0b0NvbXBsZXRpb24iLCJsZW4iLCJ0YXJnZXQiLCJlbmQiLCJzdGFydCIsImRvYyIsImdldERvYyIsImN1ciIsInJlcGxhY2VSYW5nZSIsImlucHV0U2VsZWN0ZWQiLCJvbkZvY3VzUmVxdWVzdGVkIiwiY29kZSIsInJlY2FsaWJyYXRlRWRpdG9yIiwiY3Vyc29yIiwibGluZU51bWJlcnMiLCJzY3JvbGxiYXJTdHlsZSIsImZvY3VzIiwiZXhlY0NvbW1hbmQiLCJmb3JjZVVwZGF0ZSIsImxvbmdlc3QiLCJnZXRMb25nZXN0TGluZSIsInB4dyIsImdldEVzdGltYXRlZENoYXJXaWR0aCIsInJvd2giLCJyb3dIZWlnaHQiLCJmaW5hbGgiLCJnZXRUb3RhbExpbmVDb3VudCIsImdldExpbmVzIiwibWF4IiwiaSIsInByb3BlcnR5IiwibGVmdCIsInRvcCIsImVsaWQiLCJmZWxsb3ciLCJnZXRFbGVtZW50QnlJZCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIk9SQU5HRSIsIlJFRCIsIkZBVEhFUl9DT0FMIiwiYXNzaWduIiwiaGVpZ2h0Iiwib3V0bGluZSIsInBvc2l0aW9uIiwidmlzaWJpbGl0eSIsIndpZHRoIiwiaW5wdXRDZWxsV2lkdGgiLCJ6SW5kZXgiLCJyZWN0IiwiZ2V0Um9vdFJlY3QiLCJkaXNwbGF5IiwiYm94U2hhZG93IiwiYmFja2dyb3VuZENvbG9yIiwiTElHSFRFU1RfUElOSyIsImJvcmRlckJvdHRvbUxlZnRSYWRpdXMiLCJib3JkZXJUb3BMZWZ0UmFkaXVzIiwiY29sb3IiLCJTVU5TVE9ORSIsImZvbnRXZWlnaHQiLCJsaW5lSGVpZ2h0IiwidGV4dEFsaWduIiwidGV4dFRyYW5zZm9ybSIsImZvbnRTaXplIiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiTElHSFRfR1JBWSIsImJvcmRlciIsIkRBUktFUl9HUkFZIiwiZm9udEZhbWlseSIsIm92ZXJmbG93IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nVG9wIiwidGV4dFNoYWRvdyIsIlJPQ0siLCJmYWRlIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJib3JkZXJUb3BSaWdodFJhZGl1cyIsInB1c2giLCJib3JkZXJSYWRpdXMiLCJtaW5IZWlnaHQiLCJtaW5XaWR0aCIsIm9wYWNpdHkiLCJwYWRkaW5nIiwidHJhbnNmb3JtIiwidHJhbnNpdGlvbiIsImdldEV2YWx1dGF0b3JTdGF0ZUNvbG9yIiwiYm9yZGVyTGVmdCIsImJvcmRlclJpZ2h0IiwiYm9yZGVyVG9wIiwiZ2V0Um9vdFN0eWxlIiwiZ2V0Q29sc1dyYXBwZXJTdHlsZSIsImdldElucHV0TGFiZWxTdHlsZSIsImdldExhYmVsU3RyaW5nIiwiZ2V0VG9vbHRpcFN0eWxlIiwiZ2V0VG9vbHRpcFRyaVN0eWxlIiwiZ2V0RXZhbHVhdG9yVGV4dCIsImdldEVkaXRvckNvbnRleHRDbGFzc05hbWUiLCJlbGVtZW50IiwiZ2V0RWRpdG9yQ29udGV4dFN0eWxlIiwiaGFuZGxlQXV0b0NvbXBsZXRlckNsaWNrIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOztBQUNBOztJQUFZQSxVOztBQUNaOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7OztBQUVBLElBQU1DLFlBQVlDLFFBQVEsZUFBUixDQUFsQjs7QUFFQSxJQUFNQyw2QkFBNkIsQ0FBbkM7O0FBRUEsSUFBTUMsZUFBZTtBQUNuQkMsZUFBYSxDQURNO0FBRW5CQyxjQUFZO0FBRk8sQ0FBckI7O0FBS0EsSUFBTUMsbUJBQW1CO0FBQ3ZCQyxRQUFNLENBRGlCLEVBQ2Q7QUFDVEMsUUFBTSxDQUZpQixFQUVkO0FBQ1RDLFFBQU0sQ0FIaUI7QUFJdkJDLFFBQU0sQ0FKaUI7QUFLdkJDLFNBQU87QUFMZ0IsQ0FBekI7O0FBUUEsSUFBTUMsd0JBQXdCO0FBQzVCQyxRQUFNLENBRHNCO0FBRTVCQyxRQUFNLENBQUMsQ0FGcUI7QUFHNUJDLFFBQU0sQ0FBQztBQUhxQixDQUE5Qjs7QUFNQSxJQUFNQyxhQUFhO0FBQ2pCQyxTQUFPLENBRFUsRUFDUDtBQUNWQyxXQUFTLENBRlEsQ0FFTjtBQUZNLENBQW5COztBQUtBLElBQU1DLHFCQUFxQixFQUEzQjtBQUNBLElBQU1DLG9CQUFvQixHQUExQjtBQUNB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QTtBQUFBO0FBQ0Usa0JBQUcsMEJBREw7QUFFRSxxQkFBTyxLQUFLQyxlQUFMLEVBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBR0U7QUFDRSxrQkFBRyw4QkFETDtBQUVFLHFCQUFPLEtBQUtDLGtCQUFMLEVBRlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGNBSEY7QUFNRyxpQkFBS0MsZ0JBQUw7QUFOSCxXQVRGO0FBaUJFO0FBQ0UsZ0JBQUcsaUNBREw7QUFFRSx1QkFBVyxLQUFLQyx5QkFBTCxFQUZiO0FBR0UsaUJBQUssYUFBQ0MsT0FBRCxFQUFhO0FBQ2hCLHFCQUFLNU8sUUFBTCxHQUFnQjRPLE9BQWhCO0FBQ0QsYUFMSDtBQU1FLG1CQUFPLEtBQUtDLHFCQUFMLEVBTlQ7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFlBakJGO0FBd0JFO0FBQ0UscUJBQVMsS0FBS0Msd0JBQUwsQ0FBOEJyTyxJQUE5QixDQUFtQyxJQUFuQyxDQURYO0FBRUUsa0JBQU0sS0FBSytFLG1CQUFMLENBQXlCLEtBQUtwRixVQUFMLENBQWdCa0YsU0FBaEIsRUFBekIsSUFBd0QsQ0FGaEU7QUFHRSxvQkFBUSxLQUFLeUIsZUFBTCxFQUhWO0FBSUUsbUJBQU8sS0FBS0QsY0FBTCxFQUpUO0FBS0Usd0JBQVl2SSxrQkFMZDtBQU1FLDZCQUFpQixLQUFLeUMsS0FBTCxDQUFXVSxlQU45QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF4QkY7QUFIRixPQURGO0FBc0NEOzs7O0VBMzhCMEMsZ0JBQU1xTixTOztrQkFBOUJqUCxlIiwiZmlsZSI6IkV4cHJlc3Npb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBDb2xvciBmcm9tICdjb2xvcidcbmltcG9ydCBsb2Rhc2ggZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcidcbmltcG9ydCBzdHJpcGluZGVudCBmcm9tICdzdHJpcC1pbmRlbnQnXG5pbXBvcnQgbWFyc2hhbFBhcmFtcyBmcm9tICdAaGFpa3UvcGxheWVyL2xpYi9yZWZsZWN0aW9uL21hcnNoYWxQYXJhbXMnXG5pbXBvcnQgcGFyc2VFeHByZXNzaW9uIGZyb20gJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL2FzdC9wYXJzZUV4cHJlc3Npb24nXG5pbXBvcnQgUGFsZXR0ZSBmcm9tICcuL0RlZmF1bHRQYWxldHRlJ1xuaW1wb3J0IEF1dG9Db21wbGV0ZXIgZnJvbSAnLi9BdXRvQ29tcGxldGVyJ1xuaW1wb3J0IHsgZ2V0SXRlbVByb3BlcnR5SWQsIG1vZCB9IGZyb20gJy4vaGVscGVycy9JdGVtSGVscGVycydcbmltcG9ydCAqIGFzIEVYUFJfU0lHTlMgZnJvbSAnLi9oZWxwZXJzL0V4cHJTaWducydcbmltcG9ydCBpc051bWVyaWMgZnJvbSAnLi9oZWxwZXJzL2lzTnVtZXJpYydcbmltcG9ydCByZXRUb0VxIGZyb20gJy4vaGVscGVycy9yZXRUb0VxJ1xuaW1wb3J0IGVxVG9SZXQgZnJvbSAnLi9oZWxwZXJzL2VxVG9SZXQnXG5pbXBvcnQgZW5zdXJlUmV0IGZyb20gJy4vaGVscGVycy9lbnN1cmVSZXQnXG5pbXBvcnQgZW5zdXJlRXEgZnJvbSAnLi9oZWxwZXJzL2Vuc3VyZUVxJ1xuaW1wb3J0IGRvZXNWYWx1ZUltcGx5RXhwcmVzc2lvbiBmcm9tICcuL2hlbHBlcnMvZG9lc1ZhbHVlSW1wbHlFeHByZXNzaW9uJ1xuaW1wb3J0IGh1bWFuaXplUHJvcGVydHlOYW1lIGZyb20gJy4vaGVscGVycy9odW1hbml6ZVByb3BlcnR5TmFtZSdcblxuY29uc3QgSGFpa3VNb2RlID0gcmVxdWlyZSgnLi9tb2Rlcy9oYWlrdScpXG5cbmNvbnN0IE1BWF9BVVRPQ09NUExFVElPTl9FTlRSSUVTID0gOFxuXG5jb25zdCBFRElUT1JfTU9ERVMgPSB7XG4gIFNJTkdMRV9MSU5FOiAxLFxuICBNVUxUSV9MSU5FOiAyXG59XG5cbmNvbnN0IEVWQUxVQVRPUl9TVEFURVMgPSB7XG4gIE5PTkU6IDEsIC8vIE5vbmUgbWVhbnMgYSBzdGF0aWMgdmFsdWUsIG5vIGV4cHJlc3Npb24gdG8gZXZhbHVhdGVcbiAgT1BFTjogMiwgLy8gQW55dGhpbmcgPj0gT1BFTiBpcyBhbHNvICdvcGVuJ1xuICBJTkZPOiAzLFxuICBXQVJOOiA0LFxuICBFUlJPUjogNVxufVxuXG5jb25zdCBOQVZJR0FUSU9OX0RJUkVDVElPTlMgPSB7XG4gIFNBTUU6IDAsXG4gIE5FWFQ6ICsxLFxuICBQUkVWOiAtMVxufVxuXG5jb25zdCBFWFBSX0tJTkRTID0ge1xuICBWQUxVRTogMSwgLy8gQSBzdGF0aWMgdmFsdWVcbiAgTUFDSElORTogMiAvLyBUbyBiZSB3cml0dGVuIGFzIGEgZnVuY3Rpb25cbn1cblxuY29uc3QgRURJVE9SX0xJTkVfSEVJR0hUID0gMjRcbmNvbnN0IE1BWF9FRElUT1JfSEVJR0hUID0gMzAwXG5jb25zdCBNSU5fRURJVE9SX1dJRFRIX01VTFRJTElORSA9IDIwMFxuY29uc3QgTUFYX0VESVRPUl9XSURUSF9NVUxUSUxJTkUgPSA2MDBcbmNvbnN0IE1JTl9FRElUT1JfV0lEVEhfU0lOR0xFX0xJTkUgPSAxNDBcbmNvbnN0IE1BWF9FRElUT1JfV0lEVEhfU0lOR0xFX0xJTkUgPSA0MDBcblxuZnVuY3Rpb24gc2V0T3B0aW9ucyAob3B0cykge1xuICBmb3IgKHZhciBrZXkgaW4gb3B0cykgdGhpcy5zZXRPcHRpb24oa2V5LCBvcHRzW2tleV0pXG4gIHJldHVybiB0aGlzXG59XG5cbi8qKlxuICogQGZ1bmN0aW9uIHRvVmFsdWVEZXNjcmlwdG9yXG4gKiBAZGVzY3JpcHRpb24gQ29udmVydCBmcm9tIG9iamVjdCBmb3JtYXQgcHJvdmlkZWQgYnkgdGltZWxpbmUgdG8gb3VyIGludGVybmFsIGZvcm1hdC5cbiAqL1xuZnVuY3Rpb24gdG9WYWx1ZURlc2NyaXB0b3IgKHsgYm9va2VuZFZhbHVlLCBjb21wdXRlZFZhbHVlIH0pIHtcbiAgaWYgKGJvb2tlbmRWYWx1ZSAmJiBib29rZW5kVmFsdWUuX19mdW5jdGlvbikge1xuICAgIHJldHVybiB7XG4gICAgICBraW5kOiBFWFBSX0tJTkRTLk1BQ0hJTkUsXG4gICAgICBwYXJhbXM6IGJvb2tlbmRWYWx1ZS5fX2Z1bmN0aW9uLnBhcmFtcyxcbiAgICAgIGJvZHk6IGJvb2tlbmRWYWx1ZS5fX2Z1bmN0aW9uLmJvZHlcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGtpbmQ6IEVYUFJfS0lORFMuVkFMVUUsXG4gICAgcGFyYW1zOiBbXSxcbiAgICBib2R5OiBjb21wdXRlZFZhbHVlICsgJydcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZW5kZXJhYmxlVmFsdWVTaW5nbGVsaW5lICh2YWx1ZURlc2NyaXB0b3IpIHtcbiAgcmV0dXJuIHJldFRvRXEodmFsdWVEZXNjcmlwdG9yLmJvZHkudHJpbSgpKVxufVxuXG5mdW5jdGlvbiBnZXRSZW5kZXJhYmxlVmFsdWVNdWx0aWxpbmUgKHZhbHVlRGVzY3JpcHRvciwgc2tpcEZvcm1hdHRpbmcpIHtcbiAgbGV0IHBhcmFtcyA9ICcnXG4gIGlmICh2YWx1ZURlc2NyaXB0b3IucGFyYW1zICYmIHZhbHVlRGVzY3JpcHRvci5wYXJhbXMubGVuZ3RoID4gMCkge1xuICAgIHBhcmFtcyA9IG1hcnNoYWxQYXJhbXModmFsdWVEZXNjcmlwdG9yLnBhcmFtcylcbiAgfVxuXG4gIC8vIFdoZW4gaW5pdGlhbGx5IGxvYWRpbmcgdGhlIHZhbHVlLCB3ZSBwcm9iYWJseSB3YW50IHRvIGZvcm1hdCBpdC5cbiAgLy8gRHVyaW5nIGVkaXRpbmcsIHdoZW4gd2UgZHluYW1pY2FsbHkgY2hhbmdlIHRoZSBzaWduYXR1cmUsIGZvcm1hdHRpbmcgY2FuXG4gIC8vIG1lc3MgdGhpbmdzIHVwLCBnaXZpbmcgdXMgZXh0cmEgc3BhY2VzLCBhbmQgYWxzbyBtZXNzIHdpdGggdGhlIGN1cnNvclxuICAvLyBwb3NpdGlvbiByZXNldHRpbmcsIHNvIHdlIHJldHVybiBpdCBhcy1pcy5cbiAgaWYgKHNraXBGb3JtYXR0aW5nKSB7XG4gICAgcmV0dXJuIGBmdW5jdGlvbiAoJHtwYXJhbXN9KSB7XG4ke3ZhbHVlRGVzY3JpcHRvci5ib2R5fVxufWBcbiAgfSBlbHNlIHtcbiAgICAvLyBXZSBkb24ndCAnZW5zdXJlUmV0JyBiZWNhdXNlIGluIGNhc2Ugb2YgYSBtdWx0aWxpbmUgZnVuY3Rpb24sIHdlIGNhbid0IGJlIGFzc3VyZWQgdGhhdFxuICAgIC8vIHRoZSB1c2VyIGRpZG4ndCByZXR1cm4gb24gYSBsYXRlciBsaW5lLiBIb3dldmVyLCB3ZSBkbyBhIHNhbml0eSBjaGVjayBmb3IgdGhlIGluaXRpYWwgZXF1YWxcbiAgICAvLyBzaWduIGluIGNhc2UgdGhlIGN1cnJlbnQgY2FzZSBpcyBjb252ZXJ0aW5nIGZyb20gc2luZ2xlIHRvIG11bHRpLlxuICAgIHJldHVybiBgZnVuY3Rpb24gKCR7cGFyYW1zfSkge1xuICAke2VxVG9SZXQodmFsdWVEZXNjcmlwdG9yLmJvZHkpfVxufWBcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHByZXNzaW9uSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcblxuICAgIHRoaXMuX2NvbnRleHQgPSBudWxsIC8vIE91ciBjb250ZXh0IGVsZW1lbnQgb24gd2hpY2ggdG8gbW91bnQgY29kZW1pcnJvclxuICAgIHRoaXMuX2luamVjdGFibGVzID0ge30gLy8gTGlzdCBvZiBjdXJyZW50IGN1c3RvbSBrZXl3b3JkcyAodG8gYmUgZXJhc2VkL3Jlc2V0KVxuICAgIHRoaXMuX3BhcmFtY2FjaGUgPSBudWxsXG4gICAgdGhpcy5fcGFyc2UgPSBudWxsIC8vIENhY2hlIG9mIGxhc3QgcGFyc2Ugb2YgdGhlIGlucHV0IGZpZWxkXG5cbiAgICB0aGlzLmNvZGVtaXJyb3IgPSBDb2RlTWlycm9yKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCB7XG4gICAgICB0aGVtZTogJ2hhaWt1JyxcbiAgICAgIG1vZGU6ICdoYWlrdSdcbiAgICB9KVxuICAgIHRoaXMuY29kZW1pcnJvci5zZXRPcHRpb25zID0gc2V0T3B0aW9ucy5iaW5kKHRoaXMuY29kZW1pcnJvcilcbiAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0VmFsdWUoJycpXG4gICAgdGhpcy5jb2RlbWlycm9yLm9uKCdjaGFuZ2UnLCB0aGlzLmhhbmRsZUVkaXRvckNoYW5nZS5iaW5kKHRoaXMpKVxuICAgIHRoaXMuY29kZW1pcnJvci5vbigna2V5ZG93bicsIHRoaXMuaGFuZGxlRWRpdG9yS2V5ZG93bi5iaW5kKHRoaXMpKVxuICAgIHRoaXMuY29kZW1pcnJvci5vbignYmVmb3JlQ2hhbmdlJywgKGNtLCBjaGFuZ2VPYmplY3QpID0+IHtcbiAgICAgIC8vIElmIG11bHRpbGluZSBtb2RlLCBvbmx5IGFsbG93IGEgY2hhbmdlIHRvIHRoZSBmdW5jdGlvbiBib2R5LCBub3QgdGhlIHNpZ25hdHVyZVxuICAgICAgLy8gU2ltcGx5IGNhbmNlbCBhbnkgY2hhbmdlIHRoYXQgb2NjdXJzIGluIGVpdGhlciBvZiB0aG9zZSBwbGFjZXMuXG4gICAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nTW9kZSA9PT0gRURJVE9SX01PREVTLk1VTFRJX0xJTkUgJiYgY2hhbmdlT2JqZWN0Lm9yaWdpbiAhPT0gJ3NldFZhbHVlJykge1xuICAgICAgICBsZXQgbGluZXMgPSB0aGlzLnN0YXRlLmVkaXRlZFZhbHVlLmJvZHkuc3BsaXQoJ1xcbicpXG4gICAgICAgIGlmIChjaGFuZ2VPYmplY3QuZnJvbS5saW5lID09PSAwIHx8IGNoYW5nZU9iamVjdC5mcm9tLmxpbmUgPiBsaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICBjaGFuZ2VPYmplY3QuY2FuY2VsKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgdXNlQXV0b0NvbXBsZXRlcjogZmFsc2UsIC8vIFVzZWQgdG8gJ2NvbW1lbnQgb3V0JyB0aGlzIGZlYXR1cmUgdW50aWwgaXQncyBmdWxseSBiYWtlZFxuICAgICAgYXV0b0NvbXBsZXRpb25zOiBbXSxcbiAgICAgIGVkaXRpbmdNb2RlOiBFRElUT1JfTU9ERVMuU0lOR0xFX0xJTkUsXG4gICAgICBldmFsdWF0b3JUZXh0OiBudWxsLFxuICAgICAgZXZhbHVhdG9yU3RhdGU6IEVWQUxVQVRPUl9TVEFURVMuTk9ORSxcbiAgICAgIG9yaWdpbmFsVmFsdWU6IG51bGwsXG4gICAgICBlZGl0ZWRWYWx1ZTogbnVsbFxuICAgIH1cblxuICAgIGlmIChwcm9wcy5pbnB1dEZvY3VzZWQpIHtcbiAgICAgIHRoaXMuZW5nYWdlRm9jdXMocHJvcHMpXG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQgKCkge1xuICAgIGlmICh0aGlzLl9jb250ZXh0KSB7XG4gICAgICB3aGlsZSAodGhpcy5fY29udGV4dC5maXJzdENoaWxkKSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQucmVtb3ZlQ2hpbGQodGhpcy5fY29udGV4dC5maXJzdENoaWxkKVxuICAgICAgfVxuICAgICAgdGhpcy5fY29udGV4dC5hcHBlbmRDaGlsZCh0aGlzLmNvZGVtaXJyb3IuZ2V0V3JhcHBlckVsZW1lbnQoKSlcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzIChuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLmlucHV0Rm9jdXNlZCkge1xuICAgICAgdGhpcy5lbmdhZ2VGb2N1cyhuZXh0UHJvcHMpXG4gICAgfVxuICB9XG5cbiAgaXNDb21taXR0YWJsZVZhbHVlSW52YWxpZCAoY29tbWl0dGFibGUsIG9yaWdpbmFsKSB7XG4gICAgLy8gSWYgd2UgaGF2ZSBhbnkgZXJyb3Ivd2FybmluZyBpbiB0aGUgZXZhbHVhdG9yLCBhc3N1bWUgaXQgYXMgZ3JvdW5kcyBub3QgdG8gY29tbWl0XG4gICAgLy8gdGhlIGN1cnJlbnQgY29udGVudCBvZiB0aGUgZmllbGQuIEJhc2ljYWxseSBsZXZlcmFnaW5nIHByZS12YWxpZGF0aW9uIHdlJ3ZlIGFscmVhZHkgZG9uZS5cbiAgICBpZiAodGhpcy5zdGF0ZS5ldmFsdWF0b3JTdGF0ZSA+IEVWQUxVQVRPUl9TVEFURVMuSU5GTykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVhc29uOiB0aGlzLnN0YXRlLmV2YWx1YXRvclRleHRcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY29tbWl0dGFibGUuX19mdW5jdGlvbikge1xuICAgICAgLy8gQXNzdW1lIHRoYXQgd2UgYWxyZWFkeSBzdG9yZWQgd2FybmluZ3MgYWJvdXQgdGhpcyBmdW5jdGlvbiBpbiB0aGUgZXZhbHVhdG9yIHN0YXRlIGZyb20gYSBjaGFuZ2UgYWN0aW9uXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG9ic2VydmVkVHlwZSA9IHR5cGVvZiBjb21taXR0YWJsZVxuICAgICAgbGV0IGV4cGVjdGVkVHlwZSA9IG9yaWdpbmFsLnZhbHVlVHlwZVxuXG4gICAgICBpZiAob2JzZXJ2ZWRUeXBlICE9PSBleHBlY3RlZFR5cGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByZWFzb246IGAke29yaWdpbmFsLnZhbHVlTGFiZWx9IG11c3QgaGF2ZSB0eXBlIFwiJHtleHBlY3RlZFR5cGV9XCJgXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV4cGVjdGVkVHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGNvbW1pdHRhYmxlKSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgcmVhc29uOiAnTnVtYmVyIGNhbm5vdCBiZSBpbmZpbml0eSdcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNOYU4oY29tbWl0dGFibGUpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlYXNvbjogJ05vdCBhIG51bWJlciEnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cblxuICByZXF1ZXN0TmF2aWdhdGUgKG1heWJlRGlyZWN0aW9uLCBtYXliZURvRm9jdXMpIHtcbiAgICBsZXQgZGlyZWN0aW9uID0gKG1heWJlRGlyZWN0aW9uID09PSB1bmRlZmluZWQpID8gTkFWSUdBVElPTl9ESVJFQ1RJT05TLk5FWFQgOiBtYXliZURpcmVjdGlvblxuICAgIHRoaXMucHJvcHMub25OYXZpZ2F0ZVJlcXVlc3RlZChkaXJlY3Rpb24sIG1heWJlRG9Gb2N1cylcbiAgfVxuXG4gIGdldENvbW1pdGFibGVWYWx1ZSAodmFsdWVEZXNjcmlwdG9yLCBvcmlnaW5hbERlc2NyaXB0b3IpIHtcbiAgICAvLyBJZiB3ZSBhcmUgaW4gbXVsdGktbGluZSBtb2RlIHRoZW4gYXNzdW1lIHdlIHdhbnQgdG8gY3JlYXRlIGFuIGV4cHJlc3Npb24gYXMgb3Bwb3NlZCB0byBhIHN0cmluZy5cbiAgICAvLyBXZSBnZXQgcHJvYmxlbXMgaWYgd2UgZG9uJ3QgZG8gdGhpcyBsaWtlIGEgZnVuY3Rpb24gdGhhdCBkb2Vzbid0IG1hdGNoIG91ciBuYWl2ZSBleHByZXNzaW9uIGNoZWNrXG4gICAgLy8gZS5nLiBmdW5jdGlvbiAoKSB7IGlmIChmb28pIHsgLi4uIH0gZWxzZSB7IC4uLiB9fSB3aGljaCBkb2Vzbid0IGJlZ2luIHdpdGggYSByZXR1cm5cbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nTW9kZSA9PT0gRURJVE9SX01PREVTLk1VTFRJX0xJTkUgfHwgZG9lc1ZhbHVlSW1wbHlFeHByZXNzaW9uKHZhbHVlRGVzY3JpcHRvci5ib2R5KSkge1xuICAgICAgLy8gTm90ZSB0aGF0IGV4dHJhL2NhY2hlZCBmaWVsZHMgYXJlIHN0cmlwcGVkIG9mZiBvZiB0aGUgZnVuY3Rpb24sIGxpa2UgJy5zdW1tYXJ5J1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX19mdW5jdGlvbjoge1xuICAgICAgICAgIC8vIEZsYWcgdGhpcyBmdW5jdGlvbiBhcyBhbiBpbmplY3RlZSwgc28gZG93bnN0cmVhbSBBU1QgcHJvZHVjZXJzXG4gICAgICAgICAgLy8ga25vdyB0aGF0IHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgd3JhcHBlZCBpbiBgSGFpa3UuaW5qZWN0YFxuICAgICAgICAgIGluamVjdGVlOiB0cnVlLFxuICAgICAgICAgIHBhcmFtczogdmFsdWVEZXNjcmlwdG9yLnBhcmFtcyxcbiAgICAgICAgICBib2R5OiBlcVRvUmV0KHZhbHVlRGVzY3JpcHRvci5ib2R5KVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IG91dFxuICAgIHRyeSB7XG4gICAgICBvdXQgPSBKU09OLnBhcnNlKHZhbHVlRGVzY3JpcHRvci5ib2R5KVxuICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgb3V0ID0gdmFsdWVEZXNjcmlwdG9yLmJvZHkgKyAnJ1xuICAgIH1cblxuICAgIGlmIChpc051bWVyaWMob3V0KSkge1xuICAgICAgb3V0ID0gTnVtYmVyKG91dClcbiAgICB9XG5cbiAgICBpZiAob3JpZ2luYWxEZXNjcmlwdG9yLnZhbHVlVHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpZiAob3V0ID09PSAndHJ1ZScpIHtcbiAgICAgICAgb3V0ID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmIChvdXQgPT09ICdmYWxzZScpIHtcbiAgICAgICAgb3V0ID0gZmFsc2VcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKG9yaWdpbmFsRGVzY3JpcHRvci5wcm9wZXJ0eU5hbWUgPT09ICdvcGFjaXR5Jykge1xuICAgICAgaWYgKG91dCA+IDEpIHtcbiAgICAgICAgb3V0ID0gMVxuICAgICAgfSBlbHNlIGlmIChvdXQgPCAwKSB7XG4gICAgICAgIG91dCA9IDBcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3V0XG4gIH1cblxuICBwZXJmb3JtQ29tbWl0IChtYXliZU5hdmlnYXRpb25EaXJlY3Rpb24sIGRvRm9jdXNTdWJzZXF1ZW50Q2VsbCkge1xuICAgIGxldCBvcmlnaW5hbCA9IHRoaXMucHJvcHMucmVhY3RQYXJlbnQuZ2V0SXRlbVZhbHVlRGVzY3JpcHRvcih0aGlzLnByb3BzLmlucHV0Rm9jdXNlZClcblxuICAgIGxldCBjb21taXR0YWJsZSA9IHRoaXMuZ2V0Q29tbWl0YWJsZVZhbHVlKHRoaXMuc3RhdGUuZWRpdGVkVmFsdWUsIG9yaWdpbmFsKVxuXG4gICAgbGV0IGludmFsaWQgPSB0aGlzLmlzQ29tbWl0dGFibGVWYWx1ZUludmFsaWQoY29tbWl0dGFibGUsIG9yaWdpbmFsKVxuXG4gICAgLy8gSWYgaW52YWxpZCwgZG9uJ3QgcHJvY2VlZCAtIGtlZXAgdGhlIGlucHV0IGluIGEgZm9jdXNlZCtzZWxlY3RlZCBzdGF0ZSxcbiAgICAvLyBhbmQgdGhlbiBzaG93IGFuIGVycm9yIG1lc3NhZ2UgaW4gdGhlIGV2YWx1YXRvciB0b29sdGlwXG4gICAgaWYgKGludmFsaWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHtcbiAgICAgICAgZXZhbHVhdG9yU3RhdGU6IEVWQUxVQVRPUl9TVEFURVMuRVJST1IsXG4gICAgICAgIGV2YWx1YXRvclRleHQ6IGludmFsaWQucmVhc29uXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMucHJvcHMub25Db21taXRWYWx1ZShjb21taXR0YWJsZSlcblxuICAgIC8vIE9uY2UgZmluaXNoZWQgd2l0aCBhIHN1Y2Nlc3NmdWwgY29tbWl0LCBuYXZpZ2F0ZSB0byAnc2VsZWN0JyB0aGUgbmV4dCBjZWxsXG4gICAgdGhpcy5yZXF1ZXN0TmF2aWdhdGUobWF5YmVOYXZpZ2F0aW9uRGlyZWN0aW9uLCBkb0ZvY3VzU3Vic2VxdWVudENlbGwpXG4gIH1cblxuICBoYW5kbGVFZGl0b3JDaGFuZ2UgKGNtLCBjaGFuZ2VPYmplY3QpIHtcbiAgICBpZiAoY2hhbmdlT2JqZWN0Lm9yaWdpbiA9PT0gJ3NldFZhbHVlJykge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gQW55IGNoYW5nZSBzaG91bGQgdW5zZXQgdGhlIGN1cnJlbnQgZXJyb3Igc3RhdGUgb2YgdGhlXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBldmFsdWF0b3JUZXh0OiBudWxsXG4gICAgfSlcblxuICAgIGxldCByYXdWYWx1ZUZyb21FZGl0b3IgPSBjbS5nZXRWYWx1ZSgpXG5cbiAgICAvLyBXZSAnc2tpcEZvcm1hdHRpbmcnIHRvIGF2b2lkIGtleXN0cm9rZSBzcGFjaW5nIHByb2JsZW1zXG4gICAgbGV0IG9mZmljaWFsVmFsdWUgPSB0aGlzLnJhd1ZhbHVlVG9PZmZpY2lhbFZhbHVlKHJhd1ZhbHVlRnJvbUVkaXRvciwgRVhQUl9TSUdOUy5SRVQsIHRydWUpXG5cbiAgICBpZiAob2ZmaWNpYWxWYWx1ZS5raW5kID09PSBFWFBSX0tJTkRTLlZBTFVFKSB7XG4gICAgICAvLyBGb3IgYSBzdGF0aWMgdmFsdWUsIHNpbXBseSBzZXQgdGhlIHN0YXRlIGFzLWlzIGJhc2VkIG9uIHRoZSBpbnB1dFxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGF1dG9Db21wbGV0aW9uczogW10sIC8vIE5vIGF1dG9jb21wbGV0aW9ucyBhdCBhbGwgaWYgd2UncmUgb25seSBkb2luZyBhIHN0YXRpYyB2YWx1ZVxuICAgICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5OT05FXG4gICAgICB9KVxuICAgIH0gZWxzZSBpZiAob2ZmaWNpYWxWYWx1ZS5raW5kID09PSBFWFBSX0tJTkRTLk1BQ0hJTkUpIHtcbiAgICAgIC8vIEJ5IGRlZmF1bHQsIGFzc3VtZSB3ZSBhcmUgaW4gYW4gb3BlbiBldmFsdWF0b3Igc3RhdGUgKHdpbGwgY2hlY2sgZm9yIGVycm9yIGluIGEgbW9tZW50KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGV2YWx1YXRvclN0YXRlOiBFVkFMVUFUT1JfU1RBVEVTLk9QRU5cbiAgICAgIH0pXG5cbiAgICAgIC8vIElmIHRoZSBsYXN0IGVudHJ5IHdhcyBhIHNwYWNlLCByZW1vdmUgYXV0b2NvbXBsZXRlIGJlZm9yZSB3ZSBzdGFydCBwYXJzaW5nLCB3aGljaCBtaWdodCBmYWlsXG4gICAgICAvLyBpZiB3ZSBoYXZlIGFuIGluY29tcGxldGUgZXhwcmVzc2lvbi1pbi1wcm9ncmVzcyBpbnNpZGUgdGhlIGVkaXRvclxuICAgICAgLy8gQWxzbyByZW1vdmUgYW55IGNvbXBsZXRpb25zIGlmIHRoZSBlZGl0b3IgZG9lcyBub3QgaGF2ZSBmb2N1c1xuICAgICAgaWYgKCFjbS5oYXNGb2N1cygpIHx8IChjaGFuZ2VPYmplY3QgJiYgY2hhbmdlT2JqZWN0LnRleHQgJiYgY2hhbmdlT2JqZWN0LnRleHRbMF0gPT09ICcgJykpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgYXV0b0NvbXBsZXRpb25zOiBbXVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBXZSdsbCB1c2UgdGhlc2UgYm90aCBmb3IgYXV0by1hc3NpZ25pbmcgZnVuY3Rpb24gc2lnbmF0dXJlIHBhcmFtcyBhbmQgZm9yIHN5bnRheCBoaWdobGlnaHRpbmcuXG4gICAgICAvLyBXZSBkbyB0aGlzIGZpcnN0IGJlY2F1c2UgaXQgcG9wdWxhdGVzIEhhaWt1TW9kZS5rZXl3b3JkcyB3aXRoIHZhcnMsIHdoaWNoIHdlIHdpbGwgdXNlIHdoZW5cbiAgICAgIC8vIHBhcnNpbmcgdG8gcHJvZHVjZSBhIHN1bW1hcnkgdGhhdCBpbmNsdWRlcyBhZGQnbCB2YWxpZGF0aW9uIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjb250ZW50c1xuICAgICAgbGV0IGluamVjdGFibGVzID0gdGhpcy5wcm9wcy5yZWFjdFBhcmVudC5fY29tcG9uZW50Ll9jb21wb25lbnRJbnN0YW5jZS5fZ2V0SW5qZWN0YWJsZXMoKVxuICAgICAgdGhpcy5yZXNldFN5bnRheEluamVjdGFibGVzKGluamVjdGFibGVzKVxuXG4gICAgICAvLyBUaGlzIHdyYXBwaW5nIGlzIHJlcXVpcmVkIGZvciBwYXJzaW5nIHRvIHdvcmsgKHBhcmVucyBhcmUgbmVlZGVkIHRvIG1ha2UgaXQgYW4gZXhwcmVzc2lvbilcbiAgICAgIGxldCB3cmFwcGVkID0gcGFyc2VFeHByZXNzaW9uLndyYXAob2ZmaWNpYWxWYWx1ZS5ib2R5KVxuICAgICAgbGV0IGN1cnNvcjEgPSB0aGlzLmNvZGVtaXJyb3IuZ2V0Q3Vyc29yKClcblxuICAgICAgbGV0IHBhcnNlID0gcGFyc2VFeHByZXNzaW9uKHdyYXBwZWQsIGluamVjdGFibGVzLCBIYWlrdU1vZGUua2V5d29yZHMsIHRoaXMuc3RhdGUsIHtcbiAgICAgICAgbGluZTogdGhpcy5nZXRDdXJzb3JPZmZzZXRMaW5lKGN1cnNvcjEpLFxuICAgICAgICBjaDogdGhpcy5nZXRDdXJzb3JPZmZzZXRDaGFyKGN1cnNvcjEpXG4gICAgICB9KVxuXG4gICAgICB0aGlzLl9wYXJzZSA9IHBhcnNlIC8vIENhY2hpbmcgdGhpcyB0byBtYWtlIGl0IGZhc3RlciB0byByZWFkIGZvciBhdXRvY29tcGxldGlvbnNcblxuICAgICAgaWYgKHBhcnNlLmVycm9yKSB7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgIGF1dG9Db21wbGV0aW9uczogW10sXG4gICAgICAgICAgZXZhbHVhdG9yU3RhdGU6IEVWQUxVQVRPUl9TVEFURVMuRVJST1IsXG4gICAgICAgICAgZXZhbHVhdG9yVGV4dDogcGFyc2UuZXJyb3IubWVzc2FnZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBFdmVuIGRlc3BpdGUgYW4gZXJyb3IsIHdlIHN0aWxsIHdhbnQgdG8gYWxsb3cgdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSB0byBkaXNwbGF5LCBzbyB1c2UgYSBjYWNoZWQgb25lLlxuICAgICAgLy8gV2l0aG91dCB0aGlzLCB0aGUgZnVuY3Rpb24gc2lnbmF0dXJlIGFwcGVhcnMgdG8gcXVpY2tseSByZWFwcGVhciBhbmQgZGlzYXBwZWFyIGFzIHRoZSB1c2VyIHR5cGVzLCB3aGljaCBpcyBhbm5veWluZy5cbiAgICAgIGlmIChwYXJzZS5lcnJvciAmJiB0aGlzLl9wYXJhbWNhY2hlKSB7XG4gICAgICAgIG9mZmljaWFsVmFsdWUucGFyYW1zID0gdGhpcy5fcGFyYW1jYWNoZVxuICAgICAgfSBlbHNlIGlmICghcGFyc2UuZXJyb3IpIHtcbiAgICAgICAgLy8gVXNlZCB0byBkaXNwbGF5IHByZXZpb3VzIHBhcmFtcyBkZXNwaXRlIGEgc3ludGF4IGVycm9yIGluIHRoZSBmdW5jdGlvbiBib2R5XG4gICAgICAgIHRoaXMuX3BhcmFtY2FjaGUgPSBwYXJzZS5wYXJhbXNcbiAgICAgICAgb2ZmaWNpYWxWYWx1ZS5wYXJhbXMgPSBwYXJzZS5wYXJhbXNcbiAgICAgICAgb2ZmaWNpYWxWYWx1ZS5wYXJzZSA9IHBhcnNlIC8vIENhY2hlZCBmb3IgZmFzdGVyIHZhbGlkYXRpb24gZG93bnN0cmVhbVxuXG4gICAgICAgIGlmIChwYXJzZS53YXJuaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBldmFsdWF0b3JTdGF0ZTogRVZBTFVBVE9SX1NUQVRFUy5XQVJOLFxuICAgICAgICAgICAgZXZhbHVhdG9yVGV4dDogcGFyc2Uud2FybmluZ3NbMF0uYW5ub3RhdGlvblxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY20uaGFzRm9jdXMoKSkge1xuICAgICAgICAgIGxldCBjb21wbGV0aW9ucyA9IHBhcnNlLmNvbXBsZXRpb25zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgICAgIHZhciBuYSA9IGEubmFtZS50b0xvd2VyQ2FzZSgpXG4gICAgICAgICAgICB2YXIgbmIgPSBiLm5hbWUudG9Mb3dlckNhc2UoKVxuICAgICAgICAgICAgaWYgKG5hIDwgbmIpIHJldHVybiAtMVxuICAgICAgICAgICAgaWYgKG5hID4gbmIpIHJldHVybiAxXG4gICAgICAgICAgICByZXR1cm4gMFxuICAgICAgICAgIH0pLnNsaWNlKDAsIE1BWF9BVVRPQ09NUExFVElPTl9FTlRSSUVTKVxuXG4gICAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBpbml0aWFsIGNvbXBsZXRpb24gaW4gdGhlIGxpc3RcbiAgICAgICAgICBpZiAoY29tcGxldGlvbnNbMF0pIHtcbiAgICAgICAgICAgIGNvbXBsZXRpb25zWzBdLmhpZ2hsaWdodGVkID0gdHJ1ZVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgYXV0b0NvbXBsZXRpb25zOiBjb21wbGV0aW9uc1xuICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICBhdXRvQ29tcGxldGlvbnM6IFtdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogQ2FuIHdlIGRvIGFueXRoaW5nIGV4Y2VwdCBjb250aW51ZSBpZiB3ZSBoYXZlIGFuIGVycm9yIGJ1dCBubyBwYXJhbSBjYWNoZT9cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbdGltZWxpbmVdIEV4cHJlc3Npb24gaW5wdXQgc2F3IHVuZXhwZXhjdGVkIGV4cHJlc3Npb24ga2luZCcpXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ01vZGUgPT09IEVESVRPUl9NT0RFUy5NVUxUSV9MSU5FKSB7XG4gICAgICAvLyBJZiB3ZSdyZSBpbiBtdWx0aS1saW5lIG1vZGUsIHRoZW4gdXBkYXRlIHRoZSBmdW5jdGlvbiBzaWduYXR1cmVcbiAgICAgIC8vIFRyYWNrIHRoZSBjdXJzb3Igc28gd2UgY2FuIHBsYWNlIGl0IGJhY2sgd2hlcmUgaXQgd2FzLi4uXG4gICAgICBsZXQgY3Vyc29yMiA9IHRoaXMuY29kZW1pcnJvci5nZXRDdXJzb3IoKVxuXG4gICAgICAvLyBVcGRhdGUgdGhlIGVkaXRvciBjb250ZW50c1xuICAgICAgLy8gV2Ugc2V0ICdza2lwRm9ybWF0dGluZycgdG8gdHJ1ZSBoZXJlIHNvIHdlIGRvbid0IGdldCB3ZWlyZCBzcGFjaW5nIGlzc3Vlc1xuICAgICAgbGV0IHJlbmRlcmFibGUgPSBnZXRSZW5kZXJhYmxlVmFsdWVNdWx0aWxpbmUob2ZmaWNpYWxWYWx1ZSwgdHJ1ZSlcblxuICAgICAgdGhpcy5jb2RlbWlycm9yLnNldFZhbHVlKHJlbmRlcmFibGUpXG5cbiAgICAgIC8vIE5vdyBwdXQgdGhlIGN1cnNvciB3aGVyZSBpdCB3YXMgb3JpZ2luYWxseVxuICAgICAgdGhpcy5jb2RlbWlycm9yLnNldEN1cnNvcihjdXJzb3IyKVxuICAgIH1cblxuICAgIHRoaXMuY29kZW1pcnJvci5zZXRTaXplKHRoaXMuZ2V0RWRpdG9yV2lkdGgoKSwgdGhpcy5nZXRFZGl0b3JIZWlnaHQoKSAtIDIpXG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGVkaXRlZFZhbHVlOiBvZmZpY2lhbFZhbHVlXG4gICAgfSlcbiAgfVxuXG4gIGdldEN1cnNvck9mZnNldExpbmUgKGN1cnMsIHNyYykge1xuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlID09PSBFRElUT1JfTU9ERVMuTVVMVElfTElORSkge1xuICAgICAgcmV0dXJuIGN1cnMubGluZSArIDFcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN1cnMubGluZSArIDIgLy8gT2Zmc2V0IHRvIGFjY291bnQgZm9yIDEtYmFzZWQgaW5kZXggYW5kIGluaXRpYWwgZnVuY3Rpb24gc2lnbmF0dXJlIGxpbmVcbiAgICB9XG4gIH1cblxuICBnZXRDdXJzb3JPZmZzZXRDaGFyIChjdXJzLCBzcmMpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nTW9kZSA9PT0gRURJVE9SX01PREVTLk1VTFRJX0xJTkUpIHtcbiAgICAgIHJldHVybiBjdXJzLmNoXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdXJzLmNoICsgNSAvLyBPZmZzZXQgdG8gYWNjb3VudCBmb3IgcmVwbGFjaW5nID0gd2l0aCAncmV0dXJuJ1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0U3ludGF4SW5qZWN0YWJsZXMgKGluamVjdGFibGVzKSB7XG4gICAgLy8gUmVtb3ZlIGFsbCBmb3JtZXIgZW50cmllcyBpbiB0aGUga2V5d29yZHMgbGlzdFxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2luamVjdGFibGVzKSB7XG4gICAgICBpZiAoIWluamVjdGFibGVzW2tleV0pIHsgLy8gTm8gcG9pbnQgZGVsZXRpbmcgaWYgaXQgd2lsbCBiZSBpbiB0aGUgbmV3IGxpc3RcbiAgICAgICAgZGVsZXRlIEhhaWt1TW9kZS5rZXl3b3Jkc1trZXldXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWRkIG5ldyBlbnRyaWVzIGluIHRoZSBsaXN0XG4gICAgdGhpcy5faW5qZWN0YWJsZXMgPSBpbmplY3RhYmxlc1xuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuX2luamVjdGFibGVzKSB7XG4gICAgICBpZiAoIUhhaWt1TW9kZS5rZXl3b3Jkc1trZXldKSB7IC8vIE5vIHBvaW50IGFkZGluZyBpZiBpdCBpcyBhbHJlYWR5IGluIHRoZSBsaXN0XG4gICAgICAgIEhhaWt1TW9kZS5rZXl3b3Jkc1trZXldID0ge1xuICAgICAgICAgIHR5cGU6ICdrZXl3b3JkIGEnLFxuICAgICAgICAgIHN0eWxlOiAna2V5d29yZCdcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJhd1ZhbHVlVG9PZmZpY2lhbFZhbHVlIChyYXcsIGRlc2lyZWRFeHByZXNzaW9uU2lnbiwgc2tpcEZvcm1hdHRpbmcpIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5lZGl0aW5nTW9kZSA9PT0gRURJVE9SX01PREVTLlNJTkdMRV9MSU5FKSB7XG4gICAgICBpZiAoZG9lc1ZhbHVlSW1wbHlFeHByZXNzaW9uKHJhdykpIHtcbiAgICAgICAgbGV0IGNsZWFuID0gcmF3LnRyaW0oKVxuXG4gICAgICAgIC8vIFRoZSBjYWxsZXIgY2FuIGRlY2lkZSB3aGV0aGVyIHRoZXkgd2FudCB0aGUgZXhwcmVzc2lvbiBzeW1ib2wgdG8gb2ZmaWNpYWxseSBiZSAnPScgb3IgJ3JldHVybidcbiAgICAgICAgLy8gd2hlbiBwcmVzZW50ZWQgYXMgdGhlIGZvcm1hbCBmaW5hbCB2YWx1ZSBmb3IgdGhpcyBtZXRob2RcbiAgICAgICAgY2xlYW4gPSAoZGVzaXJlZEV4cHJlc3Npb25TaWduID09PSBFWFBSX1NJR05TLkVRKSA/IGVuc3VyZUVxKGNsZWFuKSA6IGVuc3VyZVJldChjbGVhbilcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGtpbmQ6IEVYUFJfS0lORFMuTUFDSElORSxcbiAgICAgICAgICBwYXJhbXM6IFtdLCAvLyBUbyBwb3B1bGF0ZSBsYXRlclxuICAgICAgICAgIGJvZHk6IGNsZWFuXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAga2luZDogRVhQUl9LSU5EUy5WQUxVRSxcbiAgICAgICAgICBwYXJhbXM6IFtdLCAvLyBUbyBwb3B1bGF0ZSBsYXRlclxuICAgICAgICAgIGJvZHk6IHJhdyAvLyBKdXN0IHVzZSB0aGUgcmF3IGJvZHksIG5vIG1hY2hpbmUgbm8gdHJpbW1pbmcgKGFsbG93IHNwYWNlcyEpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ01vZGUgPT09IEVESVRPUl9NT0RFUy5NVUxUSV9MSU5FKSB7XG4gICAgICAvLyBUaGUgYm9keSB3aWxsIGRldGVybWluZSB0aGUgcGFyYW1zLCBzbyB3ZSBjYW4gc2FmZWx5IGRpc2NhcmQgdGhlIGZ1bmN0aW9uIHByZWZpeC9zdWZmaXhcbiAgICAgIHZhciBsaW5lcyA9IHJhdy5zcGxpdCgnXFxuJylcbiAgICAgIHZhciBib2R5ID0gbGluZXMuc2xpY2UoMSwgbGluZXMubGVuZ3RoIC0gMSkuam9pbignXFxuJylcblxuICAgICAgLy8gSW4gc29tZSBjYXNlcyB0aGUgaW5kZW50IHN0cmlwcGluZyBjYXVzZXMgaXNzdWVzLCBzbyBkb24ndCBkbyBpdCBpbiBhbGwgY2FzZXMuXG4gICAgICAvLyBGb3IgZXhhbXBsZSwgd2hpbGUgdHlwaW5nIHdlIG5lZWQgdG8gdXBkYXRlIHRoZSBmdW5jdGlvbiBzaWduYXR1cmUgYnV0IG5vdCBpbnRlcmZlcmVyXG4gICAgICAvLyB3aXRoIHRoZSBmdW5jdGlvbiBib2R5IGJlaW5nIG11dGF0ZWQuXG4gICAgICBpZiAoIXNraXBGb3JtYXR0aW5nKSB7XG4gICAgICAgIGJvZHkgPSBzdHJpcGluZGVudChib2R5KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBraW5kOiBFWFBSX0tJTkRTLk1BQ0hJTkUsXG4gICAgICAgIHBhcmFtczogW10sIC8vIFRvIHBvcHVsYXRlIGxhdGVyXG4gICAgICAgIGJvZHk6IGJvZHlcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbdGltZWxpbmVdIEV4cHJlc3Npb24gaW5wdXQgc2F3IHVuZXhwZXhjdGVkIGVkaXRpbmcgbW9kZScpXG4gICAgfVxuICB9XG5cbiAgaGFuZGxlRWRpdG9yS2V5ZG93biAoY20sIGtleWRvd25FdmVudCkge1xuICAgIGtleWRvd25FdmVudC5fYWxyZWFkeUhhbmRsZWQgPSB0cnVlXG5cbiAgICBsZXQgaGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbnMgPSB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5maWx0ZXIoKGNvbXBsZXRpb24pID0+IHtcbiAgICAgIHJldHVybiAhIWNvbXBsZXRpb24uaGlnaGxpZ2h0ZWRcbiAgICB9KVxuXG4gICAgLy8gRmlyc3QsIGhhbmRsZSBhbnkgYXV0b2NvbXBsZXRpb25zIGlmIHdlJ3JlIGluIGFuIGF1dG9jb21wbGV0ZS1hY3RpdmUgc3RhdGUsIGkuZS4sXG4gICAgLy8gaWYgd2UgYXJlIHNob3dpbmcgYXV0b2NvbXBsZXRlIGFuZCBpZiB0aGVyZSBhcmUgYW55IG9mIHRoZW0gY3VycmVudGx5IGhpZ2hsaWdodGVkXG4gICAgaWYgKGhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb25zLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDQwKSB7IC8vIEFycm93RG93blxuICAgICAgICBrZXlkb3duRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5uYXZpZ2F0ZUF1dG9Db21wbGV0aW9uKE5BVklHQVRJT05fRElSRUNUSU9OUy5ORVhUKVxuICAgICAgfSBlbHNlIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDM4KSB7IC8vIEFycm93VXBcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMubmF2aWdhdGVBdXRvQ29tcGxldGlvbihOQVZJR0FUSU9OX0RJUkVDVElPTlMuUFJFVilcbiAgICAgIH0gZWxzZSBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzNykgeyAvLyBBcnJvd0xlZnRcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGF1dG9Db21wbGV0aW9uczogW10gfSlcbiAgICAgIH0gZWxzZSBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzOSkgeyAvLyBBcnJvd1JpZ2h0XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBhdXRvQ29tcGxldGlvbnM6IFtdIH0pXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMTMgJiYgIWtleWRvd25FdmVudC5zaGlmdEtleSkgeyAvLyBFbnRlciAod2l0aG91dCBTaGlmdCBvbmx5ISlcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hvb3NlSGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbigpXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gOSkgeyAvLyBUYWJcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hvb3NlSGlnaGxpZ2h0ZWRBdXRvQ29tcGxldGlvbigpXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlXG4gICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlKHsgYXV0b0NvbXBsZXRpb25zOiBbXSB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlID09PSBFRElUT1JfTU9ERVMuU0lOR0xFX0xJTkUpIHtcbiAgICAgIC8vIElmIHRhYiBkdXJpbmcgc2luZ2xlLWxpbmUgZWRpdGluZywgY29tbWl0IGFuZCBuYXZpZ2F0ZVxuICAgICAgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gOSkgeyAvLyBUYWJcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybUNvbW1pdChOQVZJR0FUSU9OX0RJUkVDVElPTlMuTkVYVCwgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDEzKSB7IC8vIEVudGVyXG4gICAgICAgIC8vIFNoaWZ0K0VudGVyIHdoZW4gbXVsdGktbGluZSBzdGFydHMgbXVsdGktbGluZSBtb2RlIChhbmQgYWRkcyBhIG5ldyBsaW5lKVxuICAgICAgICBpZiAoa2V5ZG93bkV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgICByZXR1cm4gdGhpcy5sYXVuY2hNdWx0aWxpbmVNb2RlKGtleWRvd25FdmVudC5rZXkpXG4gICAgICAgIH1cbiAgICAgICAgLy8gRW50ZXIgd2hlbiBzaW5nbGUtbGluZSBjb21taXRzIHRoZSB2YWx1ZVxuICAgICAgICAvLyBNZXRhK0VudGVyIHdoZW4gc2luZ2xlLWxpbmUgY29tbWl0cyB0aGUgdmFsdWVcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybUNvbW1pdChOQVZJR0FUSU9OX0RJUkVDVElPTlMuTkVYVCwgZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDQwKSB7IC8vIEFycm93RG93blxuICAgICAgICBrZXlkb3duRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtQ29tbWl0KE5BVklHQVRJT05fRElSRUNUSU9OUy5ORVhULCBmYWxzZSlcbiAgICAgIH1cblxuICAgICAgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMzgpIHsgLy8gQXJyb3dVcFxuICAgICAgICBrZXlkb3duRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICByZXR1cm4gdGhpcy5wZXJmb3JtQ29tbWl0KE5BVklHQVRJT05fRElSRUNUSU9OUy5QUkVWLCBmYWxzZSlcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ01vZGUgPT09IEVESVRPUl9NT0RFUy5NVUxUSV9MSU5FKSB7XG4gICAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgICBpZiAoa2V5ZG93bkV2ZW50Lm1ldGFLZXkpIHtcbiAgICAgICAgICAvLyBNZXRhK0VudGVyIHdoZW4gbXVsdGktbGluZSBjb21taXRzIHRoZSB2YWx1ZVxuICAgICAgICAgIGtleWRvd25FdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgcmV0dXJuIHRoaXMucGVyZm9ybUNvbW1pdChOQVZJR0FUSU9OX0RJUkVDVElPTlMuTkVYVCwgZmFsc2UpXG4gICAgICAgIH1cbiAgICAgICAgLy8gRW50ZXIgd2hlbiBtdWx0aS1saW5lIGp1c3QgYWRkcyBhIG5ldyBsaW5lXG4gICAgICAgIC8vIFNoaWZ0K0VudGVyIHdoZW4gbXVsdGktbGluZSBqdXN0IGFkZHMgYSBuZXcgbGluZVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEVzY2FwZSBpcyB0aGUgdW5pdmVyc2FsIHdheSB0byBleGl0IHRoZSBlZGl0b3Igd2l0aG91dCBjb21taXR0aW5nXG4gICAgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gMjcpIHsgLy8gRXNjYXBlXG4gICAgICB0aGlzLnJlcXVlc3ROYXZpZ2F0ZShOQVZJR0FUSU9OX0RJUkVDVElPTlMuU0FNRSwgZmFsc2UpXG4gICAgfVxuXG4gICAgLy8gTGV0IGFsbCBvdGhlciBrZXlzIHBhc3MgdGhyb3VnaFxuICB9XG5cbiAgbmF2aWdhdGVBdXRvQ29tcGxldGlvbiAoZGlyZWN0aW9uKSB7XG4gICAgLy8gSWYgb25seSBvbmUgaXRlbSBpbiB0aGUgbGlzdCwgbm8gbmVlZCB0byBkbyBhbnl0aGluZywgc2luY2UgdGhlcmUncyBub3doZXJlIHRvIG5hdmlnYXRlXG4gICAgaWYgKHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zLmxlbmd0aCA8IDIpIHtcbiAgICAgIHJldHVybiB2b2lkICgwKVxuICAgIH1cblxuICAgIC8vIFNoaWZ0IHRoZSBjdXJyZW50bHkgdG9nZ2xlZCBhdXRvY29tcGxldGlvbiB0byB0aGUgbmV4dCBvbmUgaW4gdGhlIGxpc3QsIHVzaW5nIGEgd3JhcGFyb3VuZC5cbiAgICBsZXQgY2hhbmdlZCA9IGZhbHNlXG4gICAgdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnMuZm9yRWFjaCgoY29tcGxldGlvbiwgaW5kZXgpID0+IHtcbiAgICAgIGlmICghY2hhbmdlZCkge1xuICAgICAgICBpZiAoY29tcGxldGlvbi5oaWdobGlnaHRlZCkge1xuICAgICAgICAgIGxldCBuaWR4ID0gbW9kKGluZGV4ICsgZGlyZWN0aW9uLCB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9ucy5sZW5ndGgpXG4gICAgICAgICAgLy8gTWF5IGFzIHdlbGwgY2hlY2sgYW5kIHNraXAgaWYgd2UncmUgYWJvdXQgdG8gbW9kaWZ5IHRoZSBjdXJyZW50IG9uZVxuICAgICAgICAgIGlmIChuaWR4ICE9PSBpbmRleCkge1xuICAgICAgICAgICAgbGV0IG5leHQgPSB0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9uc1tuaWR4XVxuICAgICAgICAgICAgY29tcGxldGlvbi5oaWdobGlnaHRlZCA9IGZhbHNlXG4gICAgICAgICAgICBuZXh0LmhpZ2hsaWdodGVkID0gdHJ1ZVxuICAgICAgICAgICAgY2hhbmdlZCA9IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBhdXRvQ29tcGxldGlvbnM6IHRoaXMuc3RhdGUuYXV0b0NvbXBsZXRpb25zXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUF1dG9Db21wbGV0ZXJDbGljayAoY29tcGxldGlvbikge1xuICAgIHRoaXMuY2hvb3NlQXV0b0NvbXBsZXRpb24oY29tcGxldGlvbilcbiAgfVxuXG4gIGNob29zZUhpZ2hsaWdodGVkQXV0b0NvbXBsZXRpb24gKCkge1xuICAgIGxldCBjb21wbGV0aW9uID0gdGhpcy5zdGF0ZS5hdXRvQ29tcGxldGlvbnMuZmlsdGVyKChjb21wbGV0aW9uKSA9PiB7XG4gICAgICByZXR1cm4gISFjb21wbGV0aW9uLmhpZ2hsaWdodGVkXG4gICAgfSlbMF1cblxuICAgIC8vIE5vdCBzdXJlIHdoeSB3ZSdkIGdldCBoZXJlLCBidXQgaW4gY2FzZS4uLlxuICAgIGlmICghY29tcGxldGlvbikge1xuICAgICAgcmV0dXJuIHZvaWQgKDApXG4gICAgfVxuXG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSB0aGUgcGFyc2UgcG9wdWxhdGVkLCB3ZSByZWFsbHkgY2FuJ3QgZG8gYW55dGhpbmdcbiAgICBpZiAoIXRoaXMuX3BhcnNlKSB7XG4gICAgICByZXR1cm4gdm9pZCAoMClcbiAgICB9XG5cbiAgICB0aGlzLmNob29zZUF1dG9Db21wbGV0aW9uKGNvbXBsZXRpb24pXG4gIH1cblxuICBjaG9vc2VBdXRvQ29tcGxldGlvbiAoY29tcGxldGlvbikge1xuICAgIGxldCBsZW4gPSB0aGlzLl9wYXJzZS50YXJnZXQuZW5kIC0gdGhpcy5fcGFyc2UudGFyZ2V0LnN0YXJ0XG4gICAgbGV0IGRvYyA9IHRoaXMuY29kZW1pcnJvci5nZXREb2MoKVxuICAgIGxldCBjdXIgPSB0aGlzLmNvZGVtaXJyb3IuZ2V0Q3Vyc29yKClcblxuICAgIGRvYy5yZXBsYWNlUmFuZ2UoXG4gICAgICBjb21wbGV0aW9uLm5hbWUsXG4gICAgICB7IGxpbmU6IGN1ci5saW5lLCBjaDogY3VyLmNoIC0gbGVuIH0sXG4gICAgICBjdXIgLy8geyBsaW5lOiBOdW1iZXIsIGNoOiBOdW1iZXIgfVxuICAgIClcblxuICAgIHRoaXMuc2V0U3RhdGUoeyBhdXRvQ29tcGxldGlvbnM6IFtdIH0pXG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCB3aWxsSGFuZGxlS2V5ZG93bkV2ZW50XG4gICAqIEBkZXNjcmlwdGlvbiBJZiB3ZSB3YW50IHRvIGhhbmRsZSB0aGlzLCByZXR1cm4gdHJ1ZSB0byBzaG9ydCBjaXJjdWl0IGhpZ2hlci1sZXZlbCBoYW5kbGVycy5cbiAgICogSWYgd2UgZG9uJ3QgY2FyZSwgcmV0dXJuIGEgZmFsc3kgdmFsdWUgdG8gaW5kaWNhdGUgZG93bnN0cmVhbSBoYW5kbGVycyBjYW4gdGFrZSBpdC5cbiAgICovXG4gIHdpbGxIYW5kbGVFeHRlcm5hbEtleWRvd25FdmVudCAoa2V5ZG93bkV2ZW50KSB7XG4gICAgaWYgKGtleWRvd25FdmVudC5fYWxyZWFkeUhhbmRsZWQpIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkKSB7XG4gICAgICAvLyBXaGVuIGZvY3VzZWQsIGFzc3VtZSB3ZSAqYWx3YXlzKiBoYW5kbGUga2V5Ym9hcmQgZXZlbnRzLCBubyBleGNlcHRpb25zLlxuICAgICAgLy8gSWYgeW91IHdhbnQgdG8gaGFuZGxlIGFuIGlucHV0IHdoZW4gZm9jdXNlZCwgdXNlZCBoYW5kbGVFZGl0b3JLZXlkb3duXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0gZWxzZSBpZiAodGhpcy5wcm9wcy5pbnB1dFNlbGVjdGVkKSB7XG4gICAgICAvLyBVcC9kb3duIGFycm93cyAod2hlbiBzZWxlY3RlZCkgbmF2aWdhdGUgdGhlIHNlbGVjdGlvbiBzdGF0ZSBiZXR3ZWVuIGNlbGxzXG4gICAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSAzOCkgeyAvLyBVcCBhcnJvd1xuICAgICAgICB0aGlzLnJlcXVlc3ROYXZpZ2F0ZShOQVZJR0FUSU9OX0RJUkVDVElPTlMuUFJFViwgZmFsc2UpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGVsc2UgaWYgKGtleWRvd25FdmVudC53aGljaCA9PT0gNDApIHsgLy8gRG93biBhcnJvd1xuICAgICAgICB0aGlzLnJlcXVlc3ROYXZpZ2F0ZShOQVZJR0FUSU9OX0RJUkVDVElPTlMuTkVYVCwgZmFsc2UpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9XG5cbiAgICAgIC8vIFdoZW4gdGFiYmluZywgd2UgbmF2aWdhdGUgZG93biBieSBvbmUgaW5wdXRcbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDkpIHsgLy8gVGFiXG4gICAgICAgIHRoaXMucmVxdWVzdE5hdmlnYXRlKE5BVklHQVRJT05fRElSRUNUSU9OUy5ORVhULCBmYWxzZSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cblxuICAgICAgLy8gRW50ZXIgd2hlbiBzZWxlY3RlZCBicmluZ3MgdXMgaW50byBhIGZvY3VzZWQgc3RhdGVcbiAgICAgIGlmIChrZXlkb3duRXZlbnQud2hpY2ggPT09IDEzKSB7IC8vIEVudGVyXG4gICAgICAgIC8vIFdpdGhvdXQgdGhpcyBwcmV2ZW50RGVmYXVsdCwgYSBuZXdsaW5lIHdpbGwgYmUgaW5zZXJ0ZWQgcHJpb3IgdG8gdGhlIGNvbnRlbnRzIVxuICAgICAgICAvLyBOb3RlIHdlIG9ubHkgd2FudCB0byBibG9jayB0aGlzIGlmIHdlIGFyZSByZXF1ZXN0aW5nIGZvY3VzZWQsIG5ld2xpbmVzIG5lZWQgdG8gYmVcbiAgICAgICAgLy8gcGVybWl0dGVkIGluIGNhc2Ugb2YgbXVsdGlsaW5lIG1vZGVcbiAgICAgICAga2V5ZG93bkV2ZW50LnByZXZlbnREZWZhdWx0KClcblxuICAgICAgICB0aGlzLnByb3BzLm9uRm9jdXNSZXF1ZXN0ZWQoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuXG4gICAgICAvLyBBbnkgJ2VkaXQnIGtleSAobGV0dGVycywgbnVtYmVycywgZXRjKSBicmluZ3MgdXMgaW50byBhIGZvY3VzZWQgc3RhdGVcbiAgICAgIC8vIEFueSBtaXNtYXRjaCBvZiB0aGVzZSB1c3VhbGx5IGluZGljYXRlcyB0aGUga2V5IGlzIGEgbGV0dGVyL251bWJlci9zeW1ib2xcbiAgICAgIGlmIChrZXlkb3duRXZlbnQua2V5ICE9PSBrZXlkb3duRXZlbnQuY29kZSkge1xuICAgICAgICB0aGlzLnByb3BzLm9uRm9jdXNSZXF1ZXN0ZWQoa2V5ZG93bkV2ZW50LmtleSlcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICAgIC8vIFRoZSBkZWxldGUga2V5IGlzIGFsc28gc3VwcG9ydGVkIGFzIGEgd2F5IHRvIGVudGVyIGludG8gYSBmb2N1c2VkIHN0YXRlXG4gICAgICBpZiAoa2V5ZG93bkV2ZW50LndoaWNoID09PSA0NiB8fCBrZXlkb3duRXZlbnQud2hpY2ggPT09IDgpIHsgLy8gRGVsZXRlXG4gICAgICAgIHRoaXMucHJvcHMub25Gb2N1c1JlcXVlc3RlZChrZXlkb3duRXZlbnQua2V5KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9XG5cbiAgbGF1bmNoTXVsdGlsaW5lTW9kZSAoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBlZGl0aW5nTW9kZTogRURJVE9SX01PREVTLk1VTFRJX0xJTkVcbiAgICB9LCAoKSA9PiB7XG4gICAgICB0aGlzLnJlY2FsaWJyYXRlRWRpdG9yKClcbiAgICB9KVxuICB9XG5cbiAgbGF1bmNoU2luZ2xlbGluZU1vZGUgKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZWRpdGluZ01vZGU6IEVESVRPUl9NT0RFUy5TSU5HTEVfTElORVxuICAgIH0sICgpID0+IHtcbiAgICAgIHRoaXMucmVjYWxpYnJhdGVFZGl0b3IoKVxuICAgIH0pXG4gIH1cblxuICBlbmdhZ2VGb2N1cyAocHJvcHMpIHtcbiAgICBpZiAoIXByb3BzLmlucHV0Rm9jdXNlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbdGltZWxpbmVdIEZvY3VzZWQgaW5wdXQgcGF5bG9hZCBtdXN0IGJlIHBhc3NlZCBiZWZvcmUgY2FsbGluZyBlbmdhZ2VGb2N1cygpJylcbiAgICB9XG5cbiAgICBsZXQgb3JpZ2luYWxEZXNjcmlwdG9yID0gcHJvcHMucmVhY3RQYXJlbnQuZ2V0SXRlbVZhbHVlRGVzY3JpcHRvcihwcm9wcy5pbnB1dEZvY3VzZWQpXG4gICAgbGV0IG9yaWdpbmFsVmFsdWUgPSB0b1ZhbHVlRGVzY3JpcHRvcihvcmlnaW5hbERlc2NyaXB0b3IpXG5cbiAgICBsZXQgZWRpdGluZ01vZGUgPSBFRElUT1JfTU9ERVMuU0lOR0xFX0xJTkVcblxuICAgIC8vIElmIHdlIHJlY2VpdmVkIGFuIGlucHV0IHdpdGggbXVsdGlwbGUgbGluZXMgdGhhdCBpcyBhIG1hY2hpbmUsIGFzc3VtZSBpdCBzaG91bGQgYmUgdHJlYXRlZCBsaWtlXG4gICAgLy8gYW4gZXhwcmVzc2lvbiB3aXRoIGEgbXVsdGktbGluZSB2aWV3LCBvdGhlcndpc2UganVzdCBhIG5vcm1hbCBleHByZXNzaW9uIHRlcm1cbiAgICBpZiAob3JpZ2luYWxWYWx1ZS5raW5kID09PSBFWFBSX0tJTkRTLk1BQ0hJTkUpIHtcbiAgICAgIGlmIChvcmlnaW5hbFZhbHVlLmJvZHkuc3BsaXQoJ1xcbicpLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZWRpdGluZ01vZGUgPSBFRElUT1JfTU9ERVMuTVVMVElfTElORVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgZWRpdGluZ01vZGUsXG4gICAgICBldmFsdWF0b3JUZXh0OiBudWxsLFxuICAgICAgLy8gSWYgd2UgZGV0ZWN0IHRoZSBpbmNvbWluZyB2YWx1ZSBpcyBzdGF0aWMgKGEgXCJWQUxVRVwiKSwgZG9uJ3Qgc2hvdyB0aGUgZXZhbHVhdG9yLlxuICAgICAgLy8gT3RoZXJ3aXNlLCB3ZSBoYXZlIGFuIGV4cHJlc3Npb24sIHNvIG1ha2Ugc3VyZSB3ZSBzaG93IHRoZSBldmFsdWF0b3IgZnJvbSB0aGUgb3V0c2V0LlxuICAgICAgZXZhbHVhdG9yU3RhdGU6IChvcmlnaW5hbFZhbHVlLmtpbmQgPT09IEVYUFJfS0lORFMuVkFMVUUpXG4gICAgICAgID8gRVZBTFVBVE9SX1NUQVRFUy5OT05FXG4gICAgICAgIDogRVZBTFVBVE9SX1NUQVRFUy5PUEVOLFxuICAgICAgb3JpZ2luYWxWYWx1ZSxcbiAgICAgIGVkaXRlZFZhbHVlOiBvcmlnaW5hbFZhbHVlXG4gICAgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWNhbGlicmF0ZUVkaXRvcigpXG4gICAgICB0aGlzLmhhbmRsZUVkaXRvckNoYW5nZSh0aGlzLmNvZGVtaXJyb3IsIHt9KVxuICAgIH0pXG4gIH1cblxuICByZWNhbGlicmF0ZUVkaXRvciAoY3Vyc29yKSB7XG4gICAgbGV0IHJlbmRlcmFibGUgPSAnJ1xuXG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlKSB7XG4gICAgICBjYXNlIEVESVRPUl9NT0RFUy5NVUxUSV9MSU5FOlxuICAgICAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0T3B0aW9ucyh7XG4gICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICduYXRpdmUnXG4gICAgICAgIH0pXG4gICAgICAgIHJlbmRlcmFibGUgPSBnZXRSZW5kZXJhYmxlVmFsdWVNdWx0aWxpbmUodGhpcy5zdGF0ZS5lZGl0ZWRWYWx1ZSlcbiAgICAgICAgdGhpcy5jb2RlbWlycm9yLnNldFZhbHVlKHJlbmRlcmFibGUpXG4gICAgICAgIGJyZWFrXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuY29kZW1pcnJvci5zZXRPcHRpb25zKHtcbiAgICAgICAgICBsaW5lTnVtYmVyczogZmFsc2UsXG4gICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6ICdudWxsJ1xuICAgICAgICB9KVxuICAgICAgICByZW5kZXJhYmxlID0gZ2V0UmVuZGVyYWJsZVZhbHVlU2luZ2xlbGluZSh0aGlzLnN0YXRlLmVkaXRlZFZhbHVlKVxuICAgICAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0VmFsdWUocmVuZGVyYWJsZSlcbiAgICB9XG5cbiAgICAvLyBNdXN0IGZvY3VzIGluIG9yZGVyIHRvIGNvcnJlY3RseSBjYXB0dXJlIGtleSBldmVudHMgYW5kIHB1dCB0aGUgY3Vyc2VyIGluIHRoZSBmaWVsZFxuICAgIHRoaXMuY29kZW1pcnJvci5mb2N1cygpXG5cbiAgICAvLyBJZiBjdXJzb3IgZXhwbGljaXRseSBwYXNzZWQsIHVzZSBpdC4gVGhpcyBpcyB1c2VkIGJ5IGNob29zZUF1dG9jb21wbGV0aW9uXG4gICAgaWYgKGN1cnNvcikge1xuICAgICAgdGhpcy5jb2RlbWlycm9yLnNldEN1cnNvcihjdXJzb3IpXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlID09PSBFRElUT1JfTU9ERVMuTVVMVElfTElORSkge1xuICAgICAgICB0aGlzLmNvZGVtaXJyb3Iuc2V0Q3Vyc29yKHsgbGluZTogMSwgY2g6IHJlbmRlcmFibGUuc3BsaXQoJ1xcbicpWzFdLmxlbmd0aCB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb2RlbWlycm9yLnNldEN1cnNvcih7IGxpbmU6IDEsIGNoOiByZW5kZXJhYmxlLmxlbmd0aCB9KVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIE5vdGUgdGhhdCB0aGlzIGhhcyB0byBoYXBwZW4gKmFmdGVyKiB3ZSBzZXQgdGhlIHZhbHVlIG9yIGl0J2xsIGVuZCB1cCB3aXRoIHRoZSBwcmV2aW91cyB2YWx1ZVxuICAgIHRoaXMuY29kZW1pcnJvci5zZXRTaXplKHRoaXMuZ2V0RWRpdG9yV2lkdGgoKSwgdGhpcy5nZXRFZGl0b3JIZWlnaHQoKSAtIDIpXG5cbiAgICAvLyBJZiBzaW5nbGUtbGluZSwgc2VsZWN0IGFsbCBzbyB0aGUgdXNlciBjYW4gcXVpY2tseSBkZWxldGUgdGhlIHByZXZpb3VzIGVudHJ5XG4gICAgaWYgKHRoaXMuc3RhdGUuZWRpdGluZ01vZGUgPT09IEVESVRPUl9NT0RFUy5TSU5HTEVfTElORSkge1xuICAgICAgdGhpcy5jb2RlbWlycm9yLmV4ZWNDb21tYW5kKCdzZWxlY3RBbGwnKVxuICAgIH1cblxuICAgIHRoaXMuZm9yY2VVcGRhdGUoKVxuICB9XG5cbiAgZ2V0RWRpdG9yV2lkdGggKCkge1xuICAgIGxldCBsb25nZXN0ID0gdGhpcy5nZXRMb25nZXN0TGluZSgpXG4gICAgbGV0IHB4dyA9IGxvbmdlc3QubGVuZ3RoICogdGhpcy5nZXRFc3RpbWF0ZWRDaGFyV2lkdGgoKVxuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5lZGl0aW5nTW9kZSkge1xuICAgICAgY2FzZSBFRElUT1JfTU9ERVMuTVVMVElfTElORTpcbiAgICAgICAgaWYgKHB4dyA8IE1JTl9FRElUT1JfV0lEVEhfTVVMVElMSU5FKSByZXR1cm4gTUlOX0VESVRPUl9XSURUSF9NVUxUSUxJTkVcbiAgICAgICAgaWYgKHB4dyA+IE1BWF9FRElUT1JfV0lEVEhfTVVMVElMSU5FKSByZXR1cm4gTUFYX0VESVRPUl9XSURUSF9NVUxUSUxJTkVcbiAgICAgICAgcmV0dXJuIHB4d1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHB4dyA8IE1JTl9FRElUT1JfV0lEVEhfU0lOR0xFX0xJTkUpIHJldHVybiBNSU5fRURJVE9SX1dJRFRIX1NJTkdMRV9MSU5FXG4gICAgICAgIGlmIChweHcgPiBNQVhfRURJVE9SX1dJRFRIX1NJTkdMRV9MSU5FKSByZXR1cm4gTUFYX0VESVRPUl9XSURUSF9TSU5HTEVfTElORVxuICAgICAgICByZXR1cm4gcHh3XG4gICAgfVxuICB9XG5cbiAgZ2V0RWRpdG9ySGVpZ2h0ICgpIHtcbiAgICBsZXQgcm93aCA9IHRoaXMucHJvcHMucmVhY3RQYXJlbnQuc3RhdGUucm93SGVpZ2h0XG4gICAgc3dpdGNoICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlKSB7XG4gICAgICBjYXNlIEVESVRPUl9NT0RFUy5NVUxUSV9MSU5FOlxuICAgICAgICByb3doID0gcm93aCAtIDQgLy8gRW5kcyB1cCBhIGJpdCB0b28gYmlnLi4uXG4gICAgICAgIGxldCBmaW5hbGggPSByb3doICogdGhpcy5nZXRUb3RhbExpbmVDb3VudCgpXG4gICAgICAgIGlmIChmaW5hbGggPiBNQVhfRURJVE9SX0hFSUdIVCkgZmluYWxoID0gTUFYX0VESVRPUl9IRUlHSFRcbiAgICAgICAgcmV0dXJuIH5+ZmluYWxoXG4gICAgICBkZWZhdWx0OiByZXR1cm4gcm93aFxuICAgIH1cbiAgfVxuXG4gIGdldEVzdGltYXRlZENoYXJXaWR0aCAoKSB7XG4gICAgLy8gVHJpdmlhbCBmb3IgbW9ub3NwYWNlLCBidXQgZm9yIG5vcm1hbCBmb250cywgd2hhdCB0byB1c2U/XG4gICAgcmV0dXJuIDkgLy8gPz8/XG4gIH1cblxuICBnZXRMaW5lcyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29kZW1pcnJvci5nZXRWYWx1ZSgpLnNwbGl0KCdcXG4nKVxuICB9XG5cbiAgZ2V0VG90YWxMaW5lQ291bnQgKCkge1xuICAgIHJldHVybiB0aGlzLmdldExpbmVzKCkubGVuZ3RoXG4gIH1cblxuICBnZXRMb25nZXN0TGluZSAoKSB7XG4gICAgbGV0IG1heCA9ICcnXG4gICAgbGV0IGxpbmVzID0gdGhpcy5nZXRMaW5lcygpXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGxpbmVzW2ldLmxlbmd0aCA+IG1heC5sZW5ndGgpIHtcbiAgICAgICAgbWF4ID0gbGluZXNbaV1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG1heFxuICB9XG5cbiAgZ2V0RXZhbHVhdG9yVGV4dCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUuZXZhbHVhdG9yVGV4dCB8fCAn4oCi4oCi4oCiJ1xuICB9XG5cbiAgZ2V0TGFiZWxTdHJpbmcgKCkge1xuICAgIGxldCBuYW1lID0gKHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkICYmIHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkLnByb3BlcnR5Lm5hbWUpIHx8ICcnXG4gICAgcmV0dXJuIGh1bWFuaXplUHJvcGVydHlOYW1lKG5hbWUpXG4gIH1cblxuICBnZXRSb290UmVjdCAoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmlucHV0Rm9jdXNlZCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gV2hlbiB3ZSBiZWNvbWUgZm9jdXNlZCwgd2UgbmVlZCB0byBtb3ZlIHRvIHRoZSBwb3NpdGlvbiBvZiB0aGUgaW5wdXQgY2VsbCB3ZSBhcmVcbiAgICAvLyB3b3JraW5nIHdpdGgsIGFuZCB3ZSBkbyBzbyBieSBsb29raW5nIHVwIHRoZSBET00gbm9kZSBvZiB0aGUgY2VsbCBtYXRjaGluZyBvdXIgcHJvcGVydHkgaWRcbiAgICBsZXQgZWxpZCA9IGdldEl0ZW1Qcm9wZXJ0eUlkKHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkKVxuICAgIGxldCBmZWxsb3cgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGlkKVxuXG4gICAgLy8gVGhlcmUgbWlnaHQgbm90IGJlIGFuIGVsZW1lbnQgZm9yIHRoZSBpbnB1dCBjZWxsIGlmIHRoZSBjZWxsIHdhcyB1bmZvY3VzZWQgYXMgcGFydCBvZiBhY2NvcmRpb25cbiAgICAvLyBjb2xsYXBzZSAod2hpY2ggd291bGQgcmVzdWx0IGluIHRoYXQgZWxlbWVudCBiZWluZyByZW1vdmVkIGZyb20gdGhlIERPTSksIGhlbmNlIHRoaXMgZ3VhcmRcbiAgICBpZiAoIWZlbGxvdykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbGVmdDogMCxcbiAgICAgICAgdG9wOiAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZlbGxvdy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICB9XG5cbiAgZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IgKCkge1xuICAgIHN3aXRjaCAodGhpcy5zdGF0ZS5ldmFsdWF0b3JTdGF0ZSkge1xuICAgICAgY2FzZSBFVkFMVUFUT1JfU1RBVEVTLldBUk46IHJldHVybiBQYWxldHRlLk9SQU5HRVxuICAgICAgY2FzZSBFVkFMVUFUT1JfU1RBVEVTLkVSUk9SOiByZXR1cm4gUGFsZXR0ZS5SRURcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBQYWxldHRlLkZBVEhFUl9DT0FMXG4gICAgfVxuICB9XG5cbiAgZ2V0Um9vdFN0eWxlICgpIHtcbiAgICBsZXQgc3R5bGUgPSBsb2Rhc2guYXNzaWduKHtcbiAgICAgIGhlaWdodDogdGhpcy5nZXRFZGl0b3JIZWlnaHQoKSArIDEsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICB0b3A6IDAsXG4gICAgICB2aXNpYmlsaXR5OiAnaGlkZGVuJyxcbiAgICAgIHdpZHRoOiB0aGlzLnByb3BzLnJlYWN0UGFyZW50LnN0YXRlLmlucHV0Q2VsbFdpZHRoLFxuICAgICAgekluZGV4OiA1MDAwXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnByb3BzLmlucHV0Rm9jdXNlZCkge1xuICAgICAgc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJ1xuICAgICAgbGV0IHJlY3QgPSB0aGlzLmdldFJvb3RSZWN0KClcbiAgICAgIHN0eWxlLmxlZnQgPSByZWN0LmxlZnRcbiAgICAgIHN0eWxlLnRvcCA9IHJlY3QudG9wXG4gICAgfVxuXG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICBnZXRDb2xzV3JhcHBlclN0eWxlICgpIHtcbiAgICBsZXQgc3R5bGUgPSBsb2Rhc2guYXNzaWduKHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAwLFxuICAgICAgbGVmdDogMCxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICBoZWlnaHQ6ICcxMDAlJ1xuICAgIH0sIHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkICYmIHtcbiAgICAgIGJveFNoYWRvdzogJzAgMnB4IDRweCAwIHJnYmEoMTUsMSw2LDAuMDYpLCAwIDZweCA1M3B4IDNweCByZ2JhKDcsMCwzLDAuMzcpLCBpbnNldCAwIDAgN3B4IDAgcmdiYSgxNiwwLDYsMC4zMCknXG4gICAgfSlcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldElucHV0TGFiZWxTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0ge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hURVNUX1BJTkssXG4gICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiA0LFxuICAgICAgYm9yZGVyVG9wTGVmdFJhZGl1czogNCxcbiAgICAgIGNvbG9yOiBQYWxldHRlLlNVTlNUT05FLFxuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgZm9udFdlaWdodDogNDAwLFxuICAgICAgbGVmdDogLTgzLFxuICAgICAgbGluZUhlaWdodDogMSxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgd2lkdGg6IDgzXG4gICAgfVxuICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHRoaXMucHJvcHMuaW5wdXRGb2N1c2VkICYmIHtcbiAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJ1xuICAgIH0pXG4gICAgc3R5bGUuaGVpZ2h0ID0gdGhpcy5nZXRFZGl0b3JIZWlnaHQoKSArIDFcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldEVkaXRvckNvbnRleHRTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0gbG9kYXNoLmFzc2lnbih7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfR1JBWSxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5EQVJLRVJfR1JBWSxcbiAgICAgIGJvcmRlckJvdHRvbUxlZnRSYWRpdXM6IDQsXG4gICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiA0LFxuICAgICAgY29sb3I6ICd0cmFuc3BhcmVudCcsXG4gICAgICBjdXJzb3I6ICdkZWZhdWx0JyxcbiAgICAgIGZvbnRGYW1pbHk6ICh0aGlzLnN0YXRlLmVkaXRpbmdNb2RlID09PSBFRElUT1JfTU9ERVMuU0lOR0xFX0xJTkUpXG4gICAgICAgID8gJ2luaGVyaXQnXG4gICAgICAgIDogJ0NvbnNvbGFzLCBtb25vc3BhY2UnLFxuICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgbGluZUhlaWdodDogRURJVE9SX0xJTkVfSEVJR0hUICsgJ3B4JyxcbiAgICAgIGhlaWdodDogdGhpcy5nZXRFZGl0b3JIZWlnaHQoKSArIDEsXG4gICAgICB3aWR0aDogdGhpcy5nZXRFZGl0b3JXaWR0aCgpLFxuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgcGFkZGluZ0xlZnQ6IDcsXG4gICAgICBwYWRkaW5nVG9wOiAxLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0ZXh0U2hhZG93OiAnMCAwIDAgJyArIENvbG9yKFBhbGV0dGUuUk9DSykuZmFkZSgwLjMpLCAvLyBkYXJrbWFnaWNcbiAgICAgIHpJbmRleDogMTAwNFxuICAgIH0pXG4gICAgbG9kYXNoLmFzc2lnbihzdHlsZSwge1xuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkxJR0hURVNUX1BJTkspLmZhZGUoMC4yKSxcbiAgICAgIHpJbmRleDogMjAwNVxuICAgIH0pXG4gICAgbG9kYXNoLmFzc2lnbihzdHlsZSwgdGhpcy5wcm9wcy5pbnB1dEZvY3VzZWQgJiYge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcignIzRDNDM0QicpLmZhZGUoMC4xKSxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgQ29sb3IoUGFsZXR0ZS5MSUdIVEVTVF9QSU5LKS5mYWRlKDAuMiksXG4gICAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAwLFxuICAgICAgYm9yZGVyQm90dG9tUmlnaHRSYWRpdXM6IDQsXG4gICAgICBib3JkZXJUb3BMZWZ0UmFkaXVzOiAwLFxuICAgICAgYm9yZGVyVG9wUmlnaHRSYWRpdXM6IDQsXG4gICAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gICAgfSlcbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldEVkaXRvckNvbnRleHRDbGFzc05hbWUgKCkge1xuICAgIGxldCBuYW1lID0gW11cbiAgICBuYW1lLnB1c2goKHRoaXMuc3RhdGUuZWRpdGluZ01vZGUgPT09IEVESVRPUl9NT0RFUy5TSU5HTEVfTElORSkgPyAnaGFpa3Utc2luZ2xlbGluZScgOiAnaGFpa3UtbXVsdGlsaW5lJylcbiAgICBuYW1lLnB1c2goKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk5PTkUpID8gJ2hhaWt1LWR5bmFtaWMnIDogJ2hhaWt1LXN0YXRpYycpXG4gICAgcmV0dXJuIG5hbWUuam9pbignICcpXG4gIH1cblxuICBnZXRUb29sdGlwU3R5bGUgKCkge1xuICAgIGxldCBzdHlsZSA9IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICAgIGJvcmRlclJhZGl1czogMyxcbiAgICAgIGJveFNoYWRvdzogJzAgM3B4IDdweCAwIHJnYmEoNywwLDMsMC40MCknLFxuICAgICAgY29sb3I6IFBhbGV0dGUuU1VOU1RPTkUsXG4gICAgICBmb250U2l6ZTogMTAsXG4gICAgICBmb250V2VpZ2h0OiA0MDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgbWluSGVpZ2h0OiAxNSxcbiAgICAgIG1pbldpZHRoOiAyNCxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBwYWRkaW5nOiAnM3B4IDVweCAycHggNXB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIHRvcDogLTI2LFxuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjQpJyxcbiAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMTgybXMgY3ViaWMtYmV6aWVyKC4xNzUsIC44ODUsIC4zMTYsIDEuMTcxKSdcbiAgICB9XG4gICAgLy8gSWYgd2UncmUgb3Blbiwgd2Ugc2hvdWxkIHNob3cgdGhlIGV2YWx1YXRvciB0b29sdGlwXG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk5PTkUpIHtcbiAgICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHtcbiAgICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoMSknLFxuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9KVxuICAgIH1cbiAgICAvLyBJZiB3ZSdyZSBpbmZvLCB3YXJuLCBvciBlcnJvciB3ZSBoYXZlIGNvbnRlbnQgdG8gZGlzcGxheVxuICAgIGlmICh0aGlzLnN0YXRlLmV2YWx1YXRvclN0YXRlID4gRVZBTFVBVE9SX1NUQVRFUy5PUEVOKSB7XG4gICAgICBsb2Rhc2guYXNzaWduKHN0eWxlLCB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRFdmFsdXRhdG9yU3RhdGVDb2xvcigpLFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gc3R5bGVcbiAgfVxuXG4gIGdldFRvb2x0aXBUcmlTdHlsZSAoKSB7XG4gICAgbGV0IHN0eWxlID0ge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB3aWR0aDogMCxcbiAgICAgIGhlaWdodDogMCxcbiAgICAgIHRvcDogMTcsXG4gICAgICBsZWZ0OiAxMixcbiAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZSgtOC44cHgsIDApJyxcbiAgICAgIGJvcmRlckxlZnQ6ICc4LjhweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgICBib3JkZXJSaWdodDogJzguOHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlclRvcDogJzguOHB4IHNvbGlkICcgKyB0aGlzLmdldEV2YWx1dGF0b3JTdGF0ZUNvbG9yKClcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdGUuZXZhbHVhdG9yU3RhdGUgPiBFVkFMVUFUT1JfU1RBVEVTLk9QRU4pIHtcbiAgICAgIGxvZGFzaC5hc3NpZ24oc3R5bGUsIHtcbiAgICAgICAgYm9yZGVyVG9wOiAnOC44cHggc29saWQgJyArIHRoaXMuZ2V0RXZhbHV0YXRvclN0YXRlQ29sb3IoKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cblxuICByZW5kZXIgKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2XG4gICAgICAgIGlkPSdleHByZXNzaW9uLWlucHV0LWhvbHN0ZXInXG4gICAgICAgIHN0eWxlPXt0aGlzLmdldFJvb3RTdHlsZSgpfT5cbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBpZD0nZXhwcmVzc2lvbi1pbnB1dC1jb2xzLXdyYXBwZXInXG4gICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0Q29sc1dyYXBwZXJTdHlsZSgpfT5cbiAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgaWQ9J2V4cHJlc3Npb24taW5wdXQtbGFiZWwnXG4gICAgICAgICAgICBzdHlsZT17dGhpcy5nZXRJbnB1dExhYmVsU3R5bGUoKX0+XG4gICAgICAgICAgICB7dGhpcy5nZXRMYWJlbFN0cmluZygpfVxuICAgICAgICAgIDwvc3Bhbj5cblxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBpZD0nZXhwcmVzc2lvbi1pbnB1dC10b29sdGlwJ1xuICAgICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0VG9vbHRpcFN0eWxlKCl9PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgaWQ9J2V4cHJlc3Npb24taW5wdXQtdG9vbHRpcC10cmknXG4gICAgICAgICAgICAgIHN0eWxlPXt0aGlzLmdldFRvb2x0aXBUcmlTdHlsZSgpfSAvPlxuICAgICAgICAgICAge3RoaXMuZ2V0RXZhbHVhdG9yVGV4dCgpfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBpZD0nZXhwcmVzc2lvbi1pbnB1dC1lZGl0b3ItY29udGV4dCdcbiAgICAgICAgICAgIGNsYXNzTmFtZT17dGhpcy5nZXRFZGl0b3JDb250ZXh0Q2xhc3NOYW1lKCl9XG4gICAgICAgICAgICByZWY9eyhlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuX2NvbnRleHQgPSBlbGVtZW50XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgc3R5bGU9e3RoaXMuZ2V0RWRpdG9yQ29udGV4dFN0eWxlKCl9IC8+XG4gICAgICAgICAgPEF1dG9Db21wbGV0ZXJcbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMuaGFuZGxlQXV0b0NvbXBsZXRlckNsaWNrLmJpbmQodGhpcyl9XG4gICAgICAgICAgICBsaW5lPXt0aGlzLmdldEN1cnNvck9mZnNldExpbmUodGhpcy5jb2RlbWlycm9yLmdldEN1cnNvcigpKSAtIDJ9XG4gICAgICAgICAgICBoZWlnaHQ9e3RoaXMuZ2V0RWRpdG9ySGVpZ2h0KCl9XG4gICAgICAgICAgICB3aWR0aD17dGhpcy5nZXRFZGl0b3JXaWR0aCgpfVxuICAgICAgICAgICAgbGluZUhlaWdodD17RURJVE9SX0xJTkVfSEVJR0hUfVxuICAgICAgICAgICAgYXV0b0NvbXBsZXRpb25zPXt0aGlzLnN0YXRlLmF1dG9Db21wbGV0aW9uc30gLz5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG59XG4iXX0=