'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // eslint-disable

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE

var _codemirror = require('codemirror');

var _codemirror2 = _interopRequireDefault(_codemirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function expressionAllowed(stream, state, backUp) {
  return (/^(?:operator|sof|keyword c|case|new|export|default|[\[{}\(,;:]|=>)$/.test(state.lastType) || state.lastType == 'quasi' && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0)))
  );
}

// We'll expose this object pointer to the module child so it can be monkey-patched at runtime
// to add dynamic keywords, e.g. for highlighting 'injectables' on the fly during code editing
var HaikuMode = {};
HaikuMode.keywords = {};

_codemirror2.default.defineMode('haiku', function (config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonldMode = parserConfig.jsonld;
  var jsonMode = parserConfig.json || jsonldMode;
  var isTS = parserConfig.typescript;
  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;

  // Tokenizer

  var keywords = function () {
    function kw(type) {
      return { type: type, style: 'keyword' };
    }
    var A = kw('keyword a'),
        B = kw('keyword b'),
        C = kw('keyword c');
    var operator = kw('operator'),
        atom = { type: 'atom', style: 'atom' };

    var jsKeywords = {
      'if': kw('if'),
      'while': A,
      'with': A,
      'else': B,
      'do': B,
      'try': B,
      'finally': B,
      'return': C,
      'break': C,
      'continue': C,
      'new': kw('new'),
      'delete': C,
      'throw': C,
      'debugger': C,
      'var': kw('var'),
      'const': kw('var'),
      'let': kw('var'),
      'function': kw('function'),
      'catch': kw('catch'),
      'for': kw('for'),
      'switch': kw('switch'),
      'case': kw('case'),
      'default': kw('default'),
      'in': operator,
      'typeof': operator,
      'instanceof': operator,
      'true': atom,
      'false': atom,
      'null': atom,
      'undefined': atom,
      'NaN': atom,
      'Infinity': atom,
      'this': kw('this'),
      'class': kw('class'),
      'super': kw('atom'),
      'yield': C,
      'export': kw('export'),
      'import': kw('import'),
      'extends': C,
      'await': C

      // Extend the 'normal' kws with the TypeScript language extensions
    };if (isTS) {
      var type = { type: 'variable', style: 'type' };
      var tsKeywords = {
        // object-like things
        'interface': kw('class'),
        'implements': C,
        'namespace': C,
        'module': kw('module'),
        'enum': kw('module'),

        // scope modifiers
        'public': kw('modifier'),
        'private': kw('modifier'),
        'protected': kw('modifier'),
        'abstract': kw('modifier'),

        // types
        'string': type,
        'number': type,
        'boolean': type,
        'any': type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    // Instead of returning the closed-over keywords, add them to our object pointer so that same
    // object pointer becomes the keywords to which we can monkeypatch new keyword types
    for (var attr in jsKeywords) {
      HaikuMode.keywords[attr] = jsKeywords[attr];
    }
    return HaikuMode.keywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^@]/;
  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;

  function readRegexp(stream) {
    var escaped = false,
        next,
        inSet = false;
    while ((next = stream.next()) != null) {
      if (!escaped) {
        if (next == '/' && !inSet) return;
        if (next == '[') inSet = true;else if (inSet && next == ']') inSet = false;
      }
      escaped = !escaped && next == '\\';
    }
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp;content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == '.' && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret('number', 'number');
    } else if (ch == '.' && stream.match('..')) {
      return ret('spread', 'meta');
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == '=' && stream.eat('>')) {
      return ret('=>', 'operator');
    } else if (ch == '0' && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret('number', 'number');
    } else if (ch == '0' && stream.eat(/o/i)) {
      stream.eatWhile(/[0-7]/i);
      return ret('number', 'number');
    } else if (ch == '0' && stream.eat(/b/i)) {
      stream.eatWhile(/[01]/i);
      return ret('number', 'number');
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret('number', 'number');
    } else if (ch == '/') {
      if (stream.eat('*')) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat('/')) {
        stream.skipToEnd();
        return ret('comment', 'comment');
      } else if (expressionAllowed(stream, state, 1)) {
        readRegexp(stream);
        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
        return ret('regexp', 'string-2');
      } else {
        stream.eatWhile(isOperatorChar);
        return ret('operator', 'operator', stream.current());
      }
    } else if (ch == '`') {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == '#') {
      stream.skipToEnd();
      return ret('error', 'error');
    } else if (isOperatorChar.test(ch)) {
      if (ch != '>' || !state.lexical || state.lexical.type != '>') {
        stream.eatWhile(isOperatorChar);
      }
      return ret('operator', 'operator', stream.current());
    } else if (wordRE.test(ch)) {
      stream.eatWhile(wordRE);
      var word = stream.current();
      if (state.lastType != '.') {
        if (keywords.propertyIsEnumerable(word)) {
          var kw = keywords[word];
          return ret(kw.type, kw.style, word);
        }
        if (word == 'async' && stream.match(/^\s*[\(\w]/, false)) {
          return ret('async', 'keyword', word);
        }
      }
      return ret('variable', 'variable', word);
    }
  }

  function tokenString(quote) {
    return function (stream, state) {
      var escaped = false,
          next;
      if (jsonldMode && stream.peek() == '@' && stream.match(isJsonldKeyword)) {
        state.tokenize = tokenBase;
        return ret('jsonld-keyword', 'meta');
      }
      while ((next = stream.next()) != null) {
        if (next == quote && !escaped) break;
        escaped = !escaped && next == '\\';
      }
      if (!escaped) state.tokenize = tokenBase;
      return ret('string', 'string');
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false,
        ch;
    while (ch = stream.next()) {
      if (ch == '/' && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = ch == '*';
    }
    return ret('comment', 'comment');
  }

  function tokenQuasi(stream, state) {
    var escaped = false,
        next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == '`' || next == '$' && stream.eat('{'))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == '\\';
    }
    return ret('quasi', 'string-2', stream.current());
  }

  var brackets = '([{}])';
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf('=>', stream.start);
    if (arrow < 0) return;

    if (isTS) {
      // Try to skip TypeScript return type declarations after the arguments
      var m = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(stream.string.slice(stream.start, arrow));
      if (m) arrow = m.index;
    }

    var depth = 0,
        sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) {
          ++pos;break;
        }
        if (--depth == 0) {
          if (ch == '(') sawSomething = true;break;
        }
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (wordRE.test(ch)) {
        sawSomething = true;
      } else if (/["'\/]/.test(ch)) {
        return;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = { 'atom': true, 'number': true, 'variable': true, 'string': true, 'regexp': true, 'this': true, 'jsonld-keyword': true };

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next) {
      if (v.name == varname) return true;
    }
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next) {
        if (v.name == varname) return true;
      }
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state;cx.stream = stream;cx.marked = null, cx.cc = cc;cx.style = style;

    if (!state.lexical.hasOwnProperty('align')) {
      state.lexical.align = true;
    }

    while (true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while (cc.length && cc[cc.length - 1].lex) {
          cc.pop()();
        }
        if (cx.marked) return cx.marked;
        if (type == 'variable' && inScope(state, content)) return 'variable-2';
        return style;
      }
    }
  }

  // Combinator utils

  var cx = { state: null, column: null, marked: null, cc: null };
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) {
      cx.cc.push(arguments[i]);
    }
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next) {
        if (v.name == varname) return true;
      }
      return false;
    }
    var state = cx.state;
    cx.marked = 'def';
    if (state.context) {
      if (inList(state.localVars)) return;
      state.localVars = { name: varname, next: state.localVars };
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars) {
        state.globalVars = { name: varname, next: state.globalVars };
      }
    }
  }

  // Combinators

  var defaultVars = { name: 'this', next: { name: 'arguments' } };
  function pushcontext() {
    cx.state.context = { prev: cx.state.context, vars: cx.state.localVars };
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function result() {
      var state = cx.state,
          indent = state.indented;
      if (state.lexical.type == 'stat') indent = state.lexical.indented;else {
        for (var outer = state.lexical; outer && outer.type == ')' && outer.align; outer = outer.prev) {
          indent = outer.indented;
        }
      }
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ')') {
        state.indented = state.lexical.indented;
      }
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    function exp(type) {
      if (type == wanted) return cont();else if (wanted == ';') return pass();else return cont(exp);
    };
    return exp;
  }

  function statement(type, value) {
    if (type == 'var') return cont(pushlex('vardef', value.length), vardef, expect(';'), poplex);
    if (type == 'keyword a') return cont(pushlex('form'), parenExpr, statement, poplex);
    if (type == 'keyword b') return cont(pushlex('form'), statement, poplex);
    if (type == '{') return cont(pushlex('}'), block, poplex);
    if (type == ';') return cont();
    if (type == 'if') {
      if (cx.state.lexical.info == 'else' && cx.state.cc[cx.state.cc.length - 1] == poplex) {
        cx.state.cc.pop()();
      }
      return cont(pushlex('form'), parenExpr, statement, poplex, maybeelse);
    }
    if (type == 'function') return cont(functiondef);
    if (type == 'for') return cont(pushlex('form'), forspec, statement, poplex);
    if (type == 'variable') {
      if (isTS && value == 'type') {
        cx.marked = 'keyword';
        return cont(typeexpr, expect('operator'), typeexpr, expect(';'));
      } else {
        return cont(pushlex('stat'), maybelabel);
      }
    }
    if (type == 'switch') {
      return cont(pushlex('form'), parenExpr, expect('{'), pushlex('}', 'switch'), block, poplex, poplex);
    }
    if (type == 'case') return cont(expression, expect(':'));
    if (type == 'default') return cont(expect(':'));
    if (type == 'catch') {
      return cont(pushlex('form'), pushcontext, expect('('), funarg, expect(')'), statement, poplex, popcontext);
    }
    if (type == 'class') return cont(pushlex('form'), className, poplex);
    if (type == 'export') return cont(pushlex('stat'), afterExport, poplex);
    if (type == 'import') return cont(pushlex('stat'), afterImport, poplex);
    if (type == 'module') return cont(pushlex('form'), pattern, expect('{'), pushlex('}'), block, poplex, poplex);
    if (type == 'async') return cont(statement);
    if (value == '@') return cont(expression, statement);
    return pass(pushlex('stat'), expression, expect(';'), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function parenExpr(type) {
    if (type != '(') return pass();
    return cont(pushlex(')'), expression, expect(')'), poplex);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == '(') return cont(pushcontext, pushlex(')'), commasep(pattern, ')'), poplex, expect('=>'), body, popcontext);else if (type == 'variable') return pass(pushcontext, pattern, expect('=>'), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == 'function') return cont(functiondef, maybeop);
    if (type == 'class') return cont(pushlex('form'), classExpression, poplex);
    if (type == 'keyword c' || type == 'async') return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == '(') return cont(pushlex(')'), maybeexpression, expect(')'), poplex, maybeop);
    if (type == 'operator' || type == 'spread') return cont(noComma ? expressionNoComma : expression);
    if (type == '[') return cont(pushlex(']'), arrayLiteral, poplex, maybeop);
    if (type == '{') return contCommasep(objprop, '}', null, maybeop);
    if (type == 'quasi') return pass(quasi, maybeop);
    if (type == 'new') return cont(maybeTarget(noComma));
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ',') return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (type == '=>') return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == 'operator') {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == '?') return cont(expression, expect(':'), expr);
      return cont(expr);
    }
    if (type == 'quasi') {
      return pass(quasi, me);
    }
    if (type == ';') return;
    if (type == '(') return contCommasep(expressionNoComma, ')', 'call', me);
    if (type == '.') return cont(property, me);
    if (type == '[') return cont(pushlex(']'), maybeexpression, expect(']'), poplex, me);
    if (isTS && value == 'as') {
      cx.marked = 'keyword';return cont(typeexpr, me);
    }
  }
  function quasi(type, value) {
    if (type != 'quasi') return pass();
    if (value.slice(value.length - 2) != '${') return cont(quasi);
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == '}') {
      cx.marked = 'string-2';
      cx.state.tokenize = tokenQuasi;
      return cont(quasi);
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == '{' ? statement : expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    return pass(type == '{' ? statement : expressionNoComma);
  }
  function maybeTarget(noComma) {
    return function (type) {
      if (type == '.') return cont(noComma ? targetNoComma : target);else return pass(noComma ? expressionNoComma : expression);
    };
  }
  function target(_, value) {
    if (value == 'target') {
      cx.marked = 'keyword';return cont(maybeoperatorComma);
    }
  }
  function targetNoComma(_, value) {
    if (value == 'target') {
      cx.marked = 'keyword';return cont(maybeoperatorNoComma);
    }
  }
  function maybelabel(type) {
    if (type == ':') return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(';'), poplex);
  }
  function property(type) {
    if (type == 'variable') {
      cx.marked = 'property';return cont();
    }
  }
  function objprop(type, value) {
    if (type == 'async') {
      cx.marked = 'property';
      return cont(objprop);
    } else if (type == 'variable' || cx.style == 'keyword') {
      cx.marked = 'property';
      if (value == 'get' || value == 'set') return cont(getterSetter);
      return cont(afterprop);
    } else if (type == 'number' || type == 'string') {
      cx.marked = jsonldMode ? 'property' : cx.style + ' property';
      return cont(afterprop);
    } else if (type == 'jsonld-keyword') {
      return cont(afterprop);
    } else if (type == 'modifier') {
      return cont(objprop);
    } else if (type == '[') {
      return cont(expression, expect(']'), afterprop);
    } else if (type == 'spread') {
      return cont(expression, afterprop);
    } else if (type == ':') {
      return pass(afterprop);
    }
  }
  function getterSetter(type) {
    if (type != 'variable') return pass(afterprop);
    cx.marked = 'property';
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ':') return cont(expressionNoComma);
    if (type == '(') return pass(functiondef);
  }
  function commasep(what, end, sep) {
    function proceed(type, value) {
      if (sep ? sep.indexOf(type) > -1 : type == ',') {
        var lex = cx.state.lexical;
        if (lex.info == 'call') lex.pos = (lex.pos || 0) + 1;
        return cont(function (type, value) {
          if (type == end || value == end) return pass();
          return pass(what);
        }, proceed);
      }
      if (type == end || value == end) return cont();
      return cont(expect(end));
    }
    return function (type, value) {
      if (type == end || value == end) return cont();
      return pass(what, proceed);
    };
  }
  function contCommasep(what, end, info) {
    for (var i = 3; i < arguments.length; i++) {
      cx.cc.push(arguments[i]);
    }
    return cont(pushlex(end, info), commasep(what, end), poplex);
  }
  function block(type) {
    if (type == '}') return cont();
    return pass(statement, block);
  }
  function maybetype(type, value) {
    if (isTS) {
      if (type == ':') return cont(typeexpr);
      if (value == '?') return cont(maybetype);
    }
  }
  function typeexpr(type) {
    if (type == 'variable') {
      cx.marked = 'type';return cont(afterType);
    }
    if (type == 'string' || type == 'number' || type == 'atom') return cont(afterType);
    if (type == '{') return cont(pushlex('}'), commasep(typeprop, '}', ',;'), poplex, afterType);
    if (type == '(') return cont(commasep(typearg, ')'), maybeReturnType);
  }
  function maybeReturnType(type) {
    if (type == '=>') return cont(typeexpr);
  }
  function typeprop(type, value) {
    if (type == 'variable' || cx.style == 'keyword') {
      cx.marked = 'property';
      return cont(typeprop);
    } else if (value == '?') {
      return cont(typeprop);
    } else if (type == ':') {
      return cont(typeexpr);
    } else if (type == '[') {
      return cont(expression, maybetype, expect(']'), typeprop);
    }
  }
  function typearg(type) {
    if (type == 'variable') return cont(typearg);else if (type == ':') return cont(typeexpr);
  }
  function afterType(type, value) {
    if (value == '<') return cont(pushlex('>'), commasep(typeexpr, '>'), poplex, afterType);
    if (value == '|' || type == '.') return cont(typeexpr);
    if (type == '[') return cont(expect(']'), afterType);
    if (value == 'extends') return cont(typeexpr);
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == 'modifier') return cont(pattern);
    if (type == 'variable') {
      register(value);return cont();
    }
    if (type == 'spread') return cont(pattern);
    if (type == '[') return contCommasep(pattern, ']');
    if (type == '{') return contCommasep(proppattern, '}');
  }
  function proppattern(type, value) {
    if (type == 'variable' && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == 'variable') cx.marked = 'property';
    if (type == 'spread') return cont(pattern);
    if (type == '}') return pass();
    return cont(expect(':'), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == '=') return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ',') return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == 'keyword b' && value == 'else') return cont(pushlex('form', 'else'), statement, poplex);
  }
  function forspec(type) {
    if (type == '(') return cont(pushlex(')'), forspec1, expect(')'), poplex);
  }
  function forspec1(type) {
    if (type == 'var') return cont(vardef, expect(';'), forspec2);
    if (type == ';') return cont(forspec2);
    if (type == 'variable') return cont(formaybeinof);
    return pass(expression, expect(';'), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == 'in' || value == 'of') {
      cx.marked = 'keyword';return cont(expression);
    }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ';') return cont(forspec3);
    if (value == 'in' || value == 'of') {
      cx.marked = 'keyword';return cont(expression);
    }
    return pass(expression, expect(';'), forspec3);
  }
  function forspec3(type) {
    if (type != ')') cont(expression);
  }
  function functiondef(type, value) {
    if (value == '*') {
      cx.marked = 'keyword';return cont(functiondef);
    }
    if (type == 'variable') {
      register(value);return cont(functiondef);
    }
    if (type == '(') return cont(pushcontext, pushlex(')'), commasep(funarg, ')'), poplex, maybetype, statement, popcontext);
    if (isTS && value == '<') return cont(pushlex('>'), commasep(typeexpr, '>'), poplex, functiondef);
  }
  function funarg(type) {
    if (type == 'spread') return cont(funarg);
    return pass(pattern, maybetype, maybeAssign);
  }
  function classExpression(type, value) {
    // Class expressions may have an optional name.
    if (type == 'variable') return className(type, value);
    return classNameAfter(type, value);
  }
  function className(type, value) {
    if (type == 'variable') {
      register(value);return cont(classNameAfter);
    }
  }
  function classNameAfter(type, value) {
    if (value == '<') return cont(pushlex('>'), commasep(typeexpr, '>'), poplex, classNameAfter);
    if (value == 'extends' || value == 'implements' || isTS && type == ',') {
      return cont(isTS ? typeexpr : expression, classNameAfter);
    }
    if (type == '{') return cont(pushlex('}'), classBody, poplex);
  }
  function classBody(type, value) {
    if (type == 'variable' || cx.style == 'keyword') {
      if ((value == 'async' || value == 'static' || value == 'get' || value == 'set' || isTS && (value == 'public' || value == 'private' || value == 'protected' || value == 'readonly' || value == 'abstract')) && cx.stream.match(/^\s+[\w$\xa1-\uffff]/, false)) {
        cx.marked = 'keyword';
        return cont(classBody);
      }
      cx.marked = 'property';
      return cont(isTS ? classfield : functiondef, classBody);
    }
    if (type == '[') {
      return cont(expression, expect(']'), isTS ? classfield : functiondef, classBody);
    }
    if (value == '*') {
      cx.marked = 'keyword';
      return cont(classBody);
    }
    if (type == ';') return cont(classBody);
    if (type == '}') return cont();
    if (value == '@') return cont(expression, classBody);
  }
  function classfield(type, value) {
    if (value == '?') return cont(classfield);
    if (type == ':') return cont(typeexpr, maybeAssign);
    if (value == '=') return cont(expressionNoComma);
    return pass(functiondef);
  }
  function afterExport(type, value) {
    if (value == '*') {
      cx.marked = 'keyword';return cont(maybeFrom, expect(';'));
    }
    if (value == 'default') {
      cx.marked = 'keyword';return cont(expression, expect(';'));
    }
    if (type == '{') return cont(commasep(exportField, '}'), maybeFrom, expect(';'));
    return pass(statement);
  }
  function exportField(type, value) {
    if (value == 'as') {
      cx.marked = 'keyword';return cont(expect('variable'));
    }
    if (type == 'variable') return pass(expressionNoComma, exportField);
  }
  function afterImport(type) {
    if (type == 'string') return cont();
    return pass(importSpec, maybeMoreImports, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == '{') return contCommasep(importSpec, '}');
    if (type == 'variable') register(value);
    if (value == '*') cx.marked = 'keyword';
    return cont(maybeAs);
  }
  function maybeMoreImports(type) {
    if (type == ',') return cont(importSpec, maybeMoreImports);
  }
  function maybeAs(_type, value) {
    if (value == 'as') {
      cx.marked = 'keyword';return cont(importSpec);
    }
  }
  function maybeFrom(_type, value) {
    if (value == 'from') {
      cx.marked = 'keyword';return cont(expression);
    }
  }
  function arrayLiteral(type) {
    if (type == ']') return cont();
    return pass(commasep(expressionNoComma, ']'));
  }

  function isContinuedStatement(state, textAfter) {
    return state.lastType == 'operator' || state.lastType == ',' || isOperatorChar.test(textAfter.charAt(0)) || /[,.]/.test(textAfter.charAt(0));
  }

  // Interface

  return {
    startState: function startState(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: 'sof',
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, 'block', false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && { vars: parserConfig.localVars },
        indented: basecolumn || 0
      };
      if (parserConfig.globalVars && _typeof(parserConfig.globalVars) === 'object') {
        state.globalVars = parserConfig.globalVars;
      }
      return state;
    },

    token: function token(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty('align')) {
          state.lexical.align = false;
        }
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == 'comment') return style;
      state.lastType = type == 'operator' && (content == '++' || content == '--') ? 'incdec' : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function indent(state, textAfter) {
      if (state.tokenize == tokenComment) return _codemirror2.default.Pass;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0),
          lexical = state.lexical,
          top;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      if (!/^\s*else\b/.test(textAfter)) {
        for (var i = state.cc.length - 1; i >= 0; --i) {
          var c = state.cc[i];
          if (c == poplex) lexical = lexical.prev;else if (c != maybeelse) break;
        }
      }
      while ((lexical.type == 'stat' || lexical.type == 'form') && (firstChar == '}' || (top = state.cc[state.cc.length - 1]) && (top == maybeoperatorComma || top == maybeoperatorNoComma) && !/^[,\.=+\-*:?[\(]/.test(textAfter))) {
        lexical = lexical.prev;
      }
      if (statementIndent && lexical.type == ')' && lexical.prev.type == 'stat') {
        lexical = lexical.prev;
      }
      var type = lexical.type,
          closing = firstChar == type;

      if (type == 'vardef') return lexical.indented + (state.lastType == 'operator' || state.lastType == ',' ? lexical.info + 1 : 0);else if (type == 'form' && firstChar == '{') return lexical.indented;else if (type == 'form') return lexical.indented + indentUnit;else if (type == 'stat') {
        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
      } else if (lexical.info == 'switch' && !closing && parserConfig.doubleIndentSwitch != false) {
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      } else if (lexical.align) return lexical.column + (closing ? 0 : 1);else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
    blockCommentStart: jsonMode ? null : '/*',
    blockCommentEnd: jsonMode ? null : '*/',
    lineComment: jsonMode ? null : '//',
    fold: 'brace',
    closeBrackets: "()[]{}''\"\"``",

    helperType: jsonMode ? 'json' : 'haiku',
    jsonldMode: jsonldMode,
    jsonMode: jsonMode,

    expressionAllowed: expressionAllowed,
    skipExpression: function skipExpression(state) {
      var top = state.cc[state.cc.length - 1];
      if (top == expression || top == expressionNoComma) state.cc.pop();
    }
  };
});

_codemirror2.default.registerHelper('wordChars', 'haiku', /[\w$]/);

_codemirror2.default.defineMIME('text/x-haiku', 'haiku');

module.exports = HaikuMode;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9tb2Rlcy9oYWlrdS5qcyJdLCJuYW1lcyI6WyJleHByZXNzaW9uQWxsb3dlZCIsInN0cmVhbSIsInN0YXRlIiwiYmFja1VwIiwidGVzdCIsImxhc3RUeXBlIiwic3RyaW5nIiwic2xpY2UiLCJwb3MiLCJIYWlrdU1vZGUiLCJrZXl3b3JkcyIsImRlZmluZU1vZGUiLCJjb25maWciLCJwYXJzZXJDb25maWciLCJpbmRlbnRVbml0Iiwic3RhdGVtZW50SW5kZW50IiwianNvbmxkTW9kZSIsImpzb25sZCIsImpzb25Nb2RlIiwianNvbiIsImlzVFMiLCJ0eXBlc2NyaXB0Iiwid29yZFJFIiwid29yZENoYXJhY3RlcnMiLCJrdyIsInR5cGUiLCJzdHlsZSIsIkEiLCJCIiwiQyIsIm9wZXJhdG9yIiwiYXRvbSIsImpzS2V5d29yZHMiLCJ0c0tleXdvcmRzIiwiYXR0ciIsImlzT3BlcmF0b3JDaGFyIiwiaXNKc29ubGRLZXl3b3JkIiwicmVhZFJlZ2V4cCIsImVzY2FwZWQiLCJuZXh0IiwiaW5TZXQiLCJjb250ZW50IiwicmV0IiwidHAiLCJjb250IiwidG9rZW5CYXNlIiwiY2giLCJ0b2tlbml6ZSIsInRva2VuU3RyaW5nIiwibWF0Y2giLCJlYXQiLCJlYXRXaGlsZSIsInRva2VuQ29tbWVudCIsInNraXBUb0VuZCIsImN1cnJlbnQiLCJ0b2tlblF1YXNpIiwibGV4aWNhbCIsIndvcmQiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsInF1b3RlIiwicGVlayIsIm1heWJlRW5kIiwiYnJhY2tldHMiLCJmaW5kRmF0QXJyb3ciLCJmYXRBcnJvd0F0IiwiYXJyb3ciLCJpbmRleE9mIiwic3RhcnQiLCJtIiwiZXhlYyIsImluZGV4IiwiZGVwdGgiLCJzYXdTb21ldGhpbmciLCJjaGFyQXQiLCJicmFja2V0IiwiYXRvbWljVHlwZXMiLCJKU0xleGljYWwiLCJpbmRlbnRlZCIsImNvbHVtbiIsImFsaWduIiwicHJldiIsImluZm8iLCJpblNjb3BlIiwidmFybmFtZSIsInYiLCJsb2NhbFZhcnMiLCJuYW1lIiwiY3giLCJjb250ZXh0IiwidmFycyIsInBhcnNlSlMiLCJjYyIsIm1hcmtlZCIsImhhc093blByb3BlcnR5IiwiY29tYmluYXRvciIsImxlbmd0aCIsInBvcCIsImV4cHJlc3Npb24iLCJzdGF0ZW1lbnQiLCJsZXgiLCJwYXNzIiwiaSIsImFyZ3VtZW50cyIsInB1c2giLCJhcHBseSIsInJlZ2lzdGVyIiwiaW5MaXN0IiwibGlzdCIsImdsb2JhbFZhcnMiLCJkZWZhdWx0VmFycyIsInB1c2hjb250ZXh0IiwicG9wY29udGV4dCIsInB1c2hsZXgiLCJyZXN1bHQiLCJpbmRlbnQiLCJvdXRlciIsInBvcGxleCIsImV4cGVjdCIsIndhbnRlZCIsImV4cCIsInZhbHVlIiwidmFyZGVmIiwicGFyZW5FeHByIiwiYmxvY2siLCJtYXliZWVsc2UiLCJmdW5jdGlvbmRlZiIsImZvcnNwZWMiLCJ0eXBlZXhwciIsIm1heWJlbGFiZWwiLCJmdW5hcmciLCJjbGFzc05hbWUiLCJhZnRlckV4cG9ydCIsImFmdGVySW1wb3J0IiwicGF0dGVybiIsImV4cHJlc3Npb25Jbm5lciIsImV4cHJlc3Npb25Ob0NvbW1hIiwibm9Db21tYSIsImJvZHkiLCJhcnJvd0JvZHlOb0NvbW1hIiwiYXJyb3dCb2R5IiwiY29tbWFzZXAiLCJtYXliZW9wIiwibWF5YmVvcGVyYXRvck5vQ29tbWEiLCJtYXliZW9wZXJhdG9yQ29tbWEiLCJjbGFzc0V4cHJlc3Npb24iLCJtYXliZWV4cHJlc3Npb25Ob0NvbW1hIiwibWF5YmVleHByZXNzaW9uIiwiYXJyYXlMaXRlcmFsIiwiY29udENvbW1hc2VwIiwib2JqcHJvcCIsInF1YXNpIiwibWF5YmVUYXJnZXQiLCJtZSIsImV4cHIiLCJwcm9wZXJ0eSIsImNvbnRpbnVlUXVhc2kiLCJ0YXJnZXROb0NvbW1hIiwidGFyZ2V0IiwiXyIsImdldHRlclNldHRlciIsImFmdGVycHJvcCIsIndoYXQiLCJlbmQiLCJzZXAiLCJwcm9jZWVkIiwibWF5YmV0eXBlIiwiYWZ0ZXJUeXBlIiwidHlwZXByb3AiLCJ0eXBlYXJnIiwibWF5YmVSZXR1cm5UeXBlIiwibWF5YmVBc3NpZ24iLCJ2YXJkZWZDb250IiwicHJvcHBhdHRlcm4iLCJfdHlwZSIsImZvcnNwZWMxIiwiZm9yc3BlYzIiLCJmb3JtYXliZWlub2YiLCJmb3JzcGVjMyIsImNsYXNzTmFtZUFmdGVyIiwiY2xhc3NCb2R5IiwiY2xhc3NmaWVsZCIsIm1heWJlRnJvbSIsImV4cG9ydEZpZWxkIiwiaW1wb3J0U3BlYyIsIm1heWJlTW9yZUltcG9ydHMiLCJtYXliZUFzIiwiaXNDb250aW51ZWRTdGF0ZW1lbnQiLCJ0ZXh0QWZ0ZXIiLCJzdGFydFN0YXRlIiwiYmFzZWNvbHVtbiIsInRva2VuIiwic29sIiwiaW5kZW50YXRpb24iLCJlYXRTcGFjZSIsIlBhc3MiLCJmaXJzdENoYXIiLCJ0b3AiLCJjIiwiY2xvc2luZyIsImRvdWJsZUluZGVudFN3aXRjaCIsImVsZWN0cmljSW5wdXQiLCJibG9ja0NvbW1lbnRTdGFydCIsImJsb2NrQ29tbWVudEVuZCIsImxpbmVDb21tZW50IiwiZm9sZCIsImNsb3NlQnJhY2tldHMiLCJoZWxwZXJUeXBlIiwic2tpcEV4cHJlc3Npb24iLCJyZWdpc3RlckhlbHBlciIsImRlZmluZU1JTUUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs4UUFBQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7QUFFQSxTQUFTQSxpQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEtBQXBDLEVBQTJDQyxNQUEzQyxFQUFtRDtBQUNqRCxTQUFPLHVFQUFzRUMsSUFBdEUsQ0FBMkVGLE1BQU1HLFFBQWpGLEtBQ0pILE1BQU1HLFFBQU4sSUFBa0IsT0FBbEIsSUFBNkIsU0FBU0QsSUFBVCxDQUFjSCxPQUFPSyxNQUFQLENBQWNDLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUJOLE9BQU9PLEdBQVAsSUFBY0wsVUFBVSxDQUF4QixDQUF2QixDQUFkO0FBRGhDO0FBRUQ7O0FBRUQ7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QW9CLE9BN0QzQjtBQThETEYsZ0JBQVlBLFVBOURQO0FBK0RMRSxjQUFVQSxRQS9ETDs7QUFpRUxsQix1QkFBbUJBLGlCQWpFZDtBQWtFTCtNLG9CQUFnQix3QkFBVTdNLEtBQVYsRUFBaUI7QUFDL0IsVUFBSWtNLE1BQU1sTSxNQUFNeUYsRUFBTixDQUFTekYsTUFBTXlGLEVBQU4sQ0FBU0ksTUFBVCxHQUFrQixDQUEzQixDQUFWO0FBQ0EsVUFBSXFHLE9BQU9uRyxVQUFQLElBQXFCbUcsT0FBTzdELGlCQUFoQyxFQUFtRHJJLE1BQU15RixFQUFOLENBQVNLLEdBQVQ7QUFDcEQ7QUFyRUksR0FBUDtBQXVFRCxDQXh5QkQ7O0FBMHlCQSxxQkFBV2dILGNBQVgsQ0FBMEIsV0FBMUIsRUFBdUMsT0FBdkMsRUFBZ0QsT0FBaEQ7O0FBRUEscUJBQVdDLFVBQVgsQ0FBc0IsY0FBdEIsRUFBc0MsT0FBdEM7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUIxTSxTQUFqQiIsImZpbGUiOiJoYWlrdS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGVzbGludC1kaXNhYmxlXG5cbi8vIENvZGVNaXJyb3IsIGNvcHlyaWdodCAoYykgYnkgTWFyaWpuIEhhdmVyYmVrZSBhbmQgb3RoZXJzXG4vLyBEaXN0cmlidXRlZCB1bmRlciBhbiBNSVQgbGljZW5zZTogaHR0cDovL2NvZGVtaXJyb3IubmV0L0xJQ0VOU0VcblxuaW1wb3J0IENvZGVNaXJyb3IgZnJvbSAnY29kZW1pcnJvcidcblxuZnVuY3Rpb24gZXhwcmVzc2lvbkFsbG93ZWQgKHN0cmVhbSwgc3RhdGUsIGJhY2tVcCkge1xuICByZXR1cm4gL14oPzpvcGVyYXRvcnxzb2Z8a2V5d29yZCBjfGNhc2V8bmV3fGV4cG9ydHxkZWZhdWx0fFtcXFt7fVxcKCw7Ol18PT4pJC8udGVzdChzdGF0ZS5sYXN0VHlwZSkgfHxcbiAgICAoc3RhdGUubGFzdFR5cGUgPT0gJ3F1YXNpJyAmJiAvXFx7XFxzKiQvLnRlc3Qoc3RyZWFtLnN0cmluZy5zbGljZSgwLCBzdHJlYW0ucG9zIC0gKGJhY2tVcCB8fCAwKSkpKVxufVxuXG4vLyBXZSdsbCBleHBvc2UgdGhpcyBvYmplY3QgcG9pbnRlciB0byB0aGUgbW9kdWxlIGNoaWxkIHNvIGl0IGNhbiBiZSBtb25rZXktcGF0Y2hlZCBhdCBydW50aW1lXG4vLyB0byBhZGQgZHluYW1pYyBrZXl3b3JkcywgZS5nLiBmb3IgaGlnaGxpZ2h0aW5nICdpbmplY3RhYmxlcycgb24gdGhlIGZseSBkdXJpbmcgY29kZSBlZGl0aW5nXG52YXIgSGFpa3VNb2RlID0ge31cbkhhaWt1TW9kZS5rZXl3b3JkcyA9IHt9XG5cbkNvZGVNaXJyb3IuZGVmaW5lTW9kZSgnaGFpa3UnLCBmdW5jdGlvbiAoY29uZmlnLCBwYXJzZXJDb25maWcpIHtcbiAgdmFyIGluZGVudFVuaXQgPSBjb25maWcuaW5kZW50VW5pdFxuICB2YXIgc3RhdGVtZW50SW5kZW50ID0gcGFyc2VyQ29uZmlnLnN0YXRlbWVudEluZGVudFxuICB2YXIganNvbmxkTW9kZSA9IHBhcnNlckNvbmZpZy5qc29ubGRcbiAgdmFyIGpzb25Nb2RlID0gcGFyc2VyQ29uZmlnLmpzb24gfHwganNvbmxkTW9kZVxuICB2YXIgaXNUUyA9IHBhcnNlckNvbmZpZy50eXBlc2NyaXB0XG4gIHZhciB3b3JkUkUgPSBwYXJzZXJDb25maWcud29yZENoYXJhY3RlcnMgfHwgL1tcXHckXFx4YTEtXFx1ZmZmZl0vXG5cbiAgLy8gVG9rZW5pemVyXG5cbiAgdmFyIGtleXdvcmRzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBrdyAodHlwZSkgeyByZXR1cm4ge3R5cGU6IHR5cGUsIHN0eWxlOiAna2V5d29yZCd9IH1cbiAgICB2YXIgQSA9IGt3KCdrZXl3b3JkIGEnKSwgQiA9IGt3KCdrZXl3b3JkIGInKSwgQyA9IGt3KCdrZXl3b3JkIGMnKVxuICAgIHZhciBvcGVyYXRvciA9IGt3KCdvcGVyYXRvcicpLCBhdG9tID0ge3R5cGU6ICdhdG9tJywgc3R5bGU6ICdhdG9tJ31cblxuICAgIHZhciBqc0tleXdvcmRzID0ge1xuICAgICAgJ2lmJzoga3coJ2lmJyksXG4gICAgICAnd2hpbGUnOiBBLFxuICAgICAgJ3dpdGgnOiBBLFxuICAgICAgJ2Vsc2UnOiBCLFxuICAgICAgJ2RvJzogQixcbiAgICAgICd0cnknOiBCLFxuICAgICAgJ2ZpbmFsbHknOiBCLFxuICAgICAgJ3JldHVybic6IEMsXG4gICAgICAnYnJlYWsnOiBDLFxuICAgICAgJ2NvbnRpbnVlJzogQyxcbiAgICAgICduZXcnOiBrdygnbmV3JyksXG4gICAgICAnZGVsZXRlJzogQyxcbiAgICAgICd0aHJvdyc6IEMsXG4gICAgICAnZGVidWdnZXInOiBDLFxuICAgICAgJ3Zhcic6IGt3KCd2YXInKSxcbiAgICAgICdjb25zdCc6IGt3KCd2YXInKSxcbiAgICAgICdsZXQnOiBrdygndmFyJyksXG4gICAgICAnZnVuY3Rpb24nOiBrdygnZnVuY3Rpb24nKSxcbiAgICAgICdjYXRjaCc6IGt3KCdjYXRjaCcpLFxuICAgICAgJ2Zvcic6IGt3KCdmb3InKSxcbiAgICAgICdzd2l0Y2gnOiBrdygnc3dpdGNoJyksXG4gICAgICAnY2FzZSc6IGt3KCdjYXNlJyksXG4gICAgICAnZGVmYXVsdCc6IGt3KCdkZWZhdWx0JyksXG4gICAgICAnaW4nOiBvcGVyYXRvcixcbiAgICAgICd0eXBlb2YnOiBvcGVyYXRvcixcbiAgICAgICdpbnN0YW5jZW9mJzogb3BlcmF0b3IsXG4gICAgICAndHJ1ZSc6IGF0b20sXG4gICAgICAnZmFsc2UnOiBhdG9tLFxuICAgICAgJ251bGwnOiBhdG9tLFxuICAgICAgJ3VuZGVmaW5lZCc6IGF0b20sXG4gICAgICAnTmFOJzogYXRvbSxcbiAgICAgICdJbmZpbml0eSc6IGF0b20sXG4gICAgICAndGhpcyc6IGt3KCd0aGlzJyksXG4gICAgICAnY2xhc3MnOiBrdygnY2xhc3MnKSxcbiAgICAgICdzdXBlcic6IGt3KCdhdG9tJyksXG4gICAgICAneWllbGQnOiBDLFxuICAgICAgJ2V4cG9ydCc6IGt3KCdleHBvcnQnKSxcbiAgICAgICdpbXBvcnQnOiBrdygnaW1wb3J0JyksXG4gICAgICAnZXh0ZW5kcyc6IEMsXG4gICAgICAnYXdhaXQnOiBDXG4gICAgfVxuXG4gICAgLy8gRXh0ZW5kIHRoZSAnbm9ybWFsJyBrd3Mgd2l0aCB0aGUgVHlwZVNjcmlwdCBsYW5ndWFnZSBleHRlbnNpb25zXG4gICAgaWYgKGlzVFMpIHtcbiAgICAgIHZhciB0eXBlID0ge3R5cGU6ICd2YXJpYWJsZScsIHN0eWxlOiAndHlwZSd9XG4gICAgICB2YXIgdHNLZXl3b3JkcyA9IHtcbiAgICAgICAgLy8gb2JqZWN0LWxpa2UgdGhpbmdzXG4gICAgICAgICdpbnRlcmZhY2UnOiBrdygnY2xhc3MnKSxcbiAgICAgICAgJ2ltcGxlbWVudHMnOiBDLFxuICAgICAgICAnbmFtZXNwYWNlJzogQyxcbiAgICAgICAgJ21vZHVsZSc6IGt3KCdtb2R1bGUnKSxcbiAgICAgICAgJ2VudW0nOiBrdygnbW9kdWxlJyksXG5cbiAgICAgICAgLy8gc2NvcGUgbW9kaWZpZXJzXG4gICAgICAgICdwdWJsaWMnOiBrdygnbW9kaWZpZXInKSxcbiAgICAgICAgJ3ByaXZhdGUnOiBrdygnbW9kaWZpZXInKSxcbiAgICAgICAgJ3Byb3RlY3RlZCc6IGt3KCdtb2RpZmllcicpLFxuICAgICAgICAnYWJzdHJhY3QnOiBrdygnbW9kaWZpZXInKSxcblxuICAgICAgICAvLyB0eXBlc1xuICAgICAgICAnc3RyaW5nJzogdHlwZSxcbiAgICAgICAgJ251bWJlcic6IHR5cGUsXG4gICAgICAgICdib29sZWFuJzogdHlwZSxcbiAgICAgICAgJ2FueSc6IHR5cGVcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgYXR0ciBpbiB0c0tleXdvcmRzKSB7XG4gICAgICAgIGpzS2V5d29yZHNbYXR0cl0gPSB0c0tleXdvcmRzW2F0dHJdXG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSW5zdGVhZCBvZiByZXR1cm5pbmcgdGhlIGNsb3NlZC1vdmVyIGtleXdvcmRzLCBhZGQgdGhlbSB0byBvdXIgb2JqZWN0IHBvaW50ZXIgc28gdGhhdCBzYW1lXG4gICAgLy8gb2JqZWN0IHBvaW50ZXIgYmVjb21lcyB0aGUga2V5d29yZHMgdG8gd2hpY2ggd2UgY2FuIG1vbmtleXBhdGNoIG5ldyBrZXl3b3JkIHR5cGVzXG4gICAgZm9yICh2YXIgYXR0ciBpbiBqc0tleXdvcmRzKSB7XG4gICAgICBIYWlrdU1vZGUua2V5d29yZHNbYXR0cl0gPSBqc0tleXdvcmRzW2F0dHJdXG4gICAgfVxuICAgIHJldHVybiBIYWlrdU1vZGUua2V5d29yZHNcbiAgfSgpKVxuXG4gIHZhciBpc09wZXJhdG9yQ2hhciA9IC9bK1xcLSomJT08PiE/fH5eQF0vXG4gIHZhciBpc0pzb25sZEtleXdvcmQgPSAvXkAoY29udGV4dHxpZHx2YWx1ZXxsYW5ndWFnZXx0eXBlfGNvbnRhaW5lcnxsaXN0fHNldHxyZXZlcnNlfGluZGV4fGJhc2V8dm9jYWJ8Z3JhcGgpXCIvXG5cbiAgZnVuY3Rpb24gcmVhZFJlZ2V4cCAoc3RyZWFtKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dCwgaW5TZXQgPSBmYWxzZVxuICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgIGlmICghZXNjYXBlZCkge1xuICAgICAgICBpZiAobmV4dCA9PSAnLycgJiYgIWluU2V0KSByZXR1cm5cbiAgICAgICAgaWYgKG5leHQgPT0gJ1snKSBpblNldCA9IHRydWVcbiAgICAgICAgZWxzZSBpZiAoaW5TZXQgJiYgbmV4dCA9PSAnXScpIGluU2V0ID0gZmFsc2VcbiAgICAgIH1cbiAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZCAmJiBuZXh0ID09ICdcXFxcJ1xuICAgIH1cbiAgfVxuXG4gIC8vIFVzZWQgYXMgc2NyYXRjaCB2YXJpYWJsZXMgdG8gY29tbXVuaWNhdGUgbXVsdGlwbGUgdmFsdWVzIHdpdGhvdXRcbiAgLy8gY29uc2luZyB1cCB0b25zIG9mIG9iamVjdHMuXG4gIHZhciB0eXBlLCBjb250ZW50XG4gIGZ1bmN0aW9uIHJldCAodHAsIHN0eWxlLCBjb250KSB7XG4gICAgdHlwZSA9IHRwOyBjb250ZW50ID0gY29udFxuICAgIHJldHVybiBzdHlsZVxuICB9XG4gIGZ1bmN0aW9uIHRva2VuQmFzZSAoc3RyZWFtLCBzdGF0ZSkge1xuICAgIHZhciBjaCA9IHN0cmVhbS5uZXh0KClcbiAgICBpZiAoY2ggPT0gJ1wiJyB8fCBjaCA9PSBcIidcIikge1xuICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlblN0cmluZyhjaClcbiAgICAgIHJldHVybiBzdGF0ZS50b2tlbml6ZShzdHJlYW0sIHN0YXRlKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJy4nICYmIHN0cmVhbS5tYXRjaCgvXlxcZCsoPzpbZUVdWytcXC1dP1xcZCspPy8pKSB7XG4gICAgICByZXR1cm4gcmV0KCdudW1iZXInLCAnbnVtYmVyJylcbiAgICB9IGVsc2UgaWYgKGNoID09ICcuJyAmJiBzdHJlYW0ubWF0Y2goJy4uJykpIHtcbiAgICAgIHJldHVybiByZXQoJ3NwcmVhZCcsICdtZXRhJylcbiAgICB9IGVsc2UgaWYgKC9bXFxbXFxde31cXChcXCksO1xcOlxcLl0vLnRlc3QoY2gpKSB7XG4gICAgICByZXR1cm4gcmV0KGNoKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJz0nICYmIHN0cmVhbS5lYXQoJz4nKSkge1xuICAgICAgcmV0dXJuIHJldCgnPT4nLCAnb3BlcmF0b3InKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJzAnICYmIHN0cmVhbS5lYXQoL3gvaSkpIHtcbiAgICAgIHN0cmVhbS5lYXRXaGlsZSgvW1xcZGEtZl0vaSlcbiAgICAgIHJldHVybiByZXQoJ251bWJlcicsICdudW1iZXInKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJzAnICYmIHN0cmVhbS5lYXQoL28vaSkpIHtcbiAgICAgIHN0cmVhbS5lYXRXaGlsZSgvWzAtN10vaSlcbiAgICAgIHJldHVybiByZXQoJ251bWJlcicsICdudW1iZXInKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJzAnICYmIHN0cmVhbS5lYXQoL2IvaSkpIHtcbiAgICAgIHN0cmVhbS5lYXRXaGlsZSgvWzAxXS9pKVxuICAgICAgcmV0dXJuIHJldCgnbnVtYmVyJywgJ251bWJlcicpXG4gICAgfSBlbHNlIGlmICgvXFxkLy50ZXN0KGNoKSkge1xuICAgICAgc3RyZWFtLm1hdGNoKC9eXFxkKig/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/LylcbiAgICAgIHJldHVybiByZXQoJ251bWJlcicsICdudW1iZXInKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJy8nKSB7XG4gICAgICBpZiAoc3RyZWFtLmVhdCgnKicpKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5Db21tZW50XG4gICAgICAgIHJldHVybiB0b2tlbkNvbW1lbnQoc3RyZWFtLCBzdGF0ZSlcbiAgICAgIH0gZWxzZSBpZiAoc3RyZWFtLmVhdCgnLycpKSB7XG4gICAgICAgIHN0cmVhbS5za2lwVG9FbmQoKVxuICAgICAgICByZXR1cm4gcmV0KCdjb21tZW50JywgJ2NvbW1lbnQnKVxuICAgICAgfSBlbHNlIGlmIChleHByZXNzaW9uQWxsb3dlZChzdHJlYW0sIHN0YXRlLCAxKSkge1xuICAgICAgICByZWFkUmVnZXhwKHN0cmVhbSlcbiAgICAgICAgc3RyZWFtLm1hdGNoKC9eXFxiKChbZ2lteXVdKSg/IVtnaW15dV0qXFwyKSkrXFxiLylcbiAgICAgICAgcmV0dXJuIHJldCgncmVnZXhwJywgJ3N0cmluZy0yJylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0cmVhbS5lYXRXaGlsZShpc09wZXJhdG9yQ2hhcilcbiAgICAgICAgcmV0dXJuIHJldCgnb3BlcmF0b3InLCAnb3BlcmF0b3InLCBzdHJlYW0uY3VycmVudCgpKVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJ2AnKSB7XG4gICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuUXVhc2lcbiAgICAgIHJldHVybiB0b2tlblF1YXNpKHN0cmVhbSwgc3RhdGUpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnIycpIHtcbiAgICAgIHN0cmVhbS5za2lwVG9FbmQoKVxuICAgICAgcmV0dXJuIHJldCgnZXJyb3InLCAnZXJyb3InKVxuICAgIH0gZWxzZSBpZiAoaXNPcGVyYXRvckNoYXIudGVzdChjaCkpIHtcbiAgICAgIGlmIChjaCAhPSAnPicgfHwgIXN0YXRlLmxleGljYWwgfHwgc3RhdGUubGV4aWNhbC50eXBlICE9ICc+JykgeyBzdHJlYW0uZWF0V2hpbGUoaXNPcGVyYXRvckNoYXIpIH1cbiAgICAgIHJldHVybiByZXQoJ29wZXJhdG9yJywgJ29wZXJhdG9yJywgc3RyZWFtLmN1cnJlbnQoKSlcbiAgICB9IGVsc2UgaWYgKHdvcmRSRS50ZXN0KGNoKSkge1xuICAgICAgc3RyZWFtLmVhdFdoaWxlKHdvcmRSRSlcbiAgICAgIHZhciB3b3JkID0gc3RyZWFtLmN1cnJlbnQoKVxuICAgICAgaWYgKHN0YXRlLmxhc3RUeXBlICE9ICcuJykge1xuICAgICAgICBpZiAoa2V5d29yZHMucHJvcGVydHlJc0VudW1lcmFibGUod29yZCkpIHtcbiAgICAgICAgICB2YXIga3cgPSBrZXl3b3Jkc1t3b3JkXVxuICAgICAgICAgIHJldHVybiByZXQoa3cudHlwZSwga3cuc3R5bGUsIHdvcmQpXG4gICAgICAgIH1cbiAgICAgICAgaWYgKHdvcmQgPT0gJ2FzeW5jJyAmJiBzdHJlYW0ubWF0Y2goL15cXHMqW1xcKFxcd10vLCBmYWxzZSkpIHsgcmV0dXJuIHJldCgnYXN5bmMnLCAna2V5d29yZCcsIHdvcmQpIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXQoJ3ZhcmlhYmxlJywgJ3ZhcmlhYmxlJywgd29yZClcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2tlblN0cmluZyAocXVvdGUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsIG5leHRcbiAgICAgIGlmIChqc29ubGRNb2RlICYmIHN0cmVhbS5wZWVrKCkgPT0gJ0AnICYmIHN0cmVhbS5tYXRjaChpc0pzb25sZEtleXdvcmQpKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlXG4gICAgICAgIHJldHVybiByZXQoJ2pzb25sZC1rZXl3b3JkJywgJ21ldGEnKVxuICAgICAgfVxuICAgICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAobmV4dCA9PSBxdW90ZSAmJiAhZXNjYXBlZCkgYnJlYWtcbiAgICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gJ1xcXFwnXG4gICAgICB9XG4gICAgICBpZiAoIWVzY2FwZWQpIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlXG4gICAgICByZXR1cm4gcmV0KCdzdHJpbmcnLCAnc3RyaW5nJylcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB0b2tlbkNvbW1lbnQgKHN0cmVhbSwgc3RhdGUpIHtcbiAgICB2YXIgbWF5YmVFbmQgPSBmYWxzZSwgY2hcbiAgICB3aGlsZSAoY2ggPSBzdHJlYW0ubmV4dCgpKSB7XG4gICAgICBpZiAoY2ggPT0gJy8nICYmIG1heWJlRW5kKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBtYXliZUVuZCA9IChjaCA9PSAnKicpXG4gICAgfVxuICAgIHJldHVybiByZXQoJ2NvbW1lbnQnLCAnY29tbWVudCcpXG4gIH1cblxuICBmdW5jdGlvbiB0b2tlblF1YXNpIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dFxuICAgIHdoaWxlICgobmV4dCA9IHN0cmVhbS5uZXh0KCkpICE9IG51bGwpIHtcbiAgICAgIGlmICghZXNjYXBlZCAmJiAobmV4dCA9PSAnYCcgfHwgbmV4dCA9PSAnJCcgJiYgc3RyZWFtLmVhdCgneycpKSkge1xuICAgICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuQmFzZVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gJ1xcXFwnXG4gICAgfVxuICAgIHJldHVybiByZXQoJ3F1YXNpJywgJ3N0cmluZy0yJywgc3RyZWFtLmN1cnJlbnQoKSlcbiAgfVxuXG4gIHZhciBicmFja2V0cyA9ICcoW3t9XSknXG4gIC8vIFRoaXMgaXMgYSBjcnVkZSBsb29rYWhlYWQgdHJpY2sgdG8gdHJ5IGFuZCBub3RpY2UgdGhhdCB3ZSdyZVxuICAvLyBwYXJzaW5nIHRoZSBhcmd1bWVudCBwYXR0ZXJucyBmb3IgYSBmYXQtYXJyb3cgZnVuY3Rpb24gYmVmb3JlIHdlXG4gIC8vIGFjdHVhbGx5IGhpdCB0aGUgYXJyb3cgdG9rZW4uIEl0IG9ubHkgd29ya3MgaWYgdGhlIGFycm93IGlzIG9uXG4gIC8vIHRoZSBzYW1lIGxpbmUgYXMgdGhlIGFyZ3VtZW50cyBhbmQgdGhlcmUncyBubyBzdHJhbmdlIG5vaXNlXG4gIC8vIChjb21tZW50cykgaW4gYmV0d2Vlbi4gRmFsbGJhY2sgaXMgdG8gb25seSBub3RpY2Ugd2hlbiB3ZSBoaXQgdGhlXG4gIC8vIGFycm93LCBhbmQgbm90IGRlY2xhcmUgdGhlIGFyZ3VtZW50cyBhcyBsb2NhbHMgZm9yIHRoZSBhcnJvd1xuICAvLyBib2R5LlxuICBmdW5jdGlvbiBmaW5kRmF0QXJyb3cgKHN0cmVhbSwgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUuZmF0QXJyb3dBdCkgc3RhdGUuZmF0QXJyb3dBdCA9IG51bGxcbiAgICB2YXIgYXJyb3cgPSBzdHJlYW0uc3RyaW5nLmluZGV4T2YoJz0+Jywgc3RyZWFtLnN0YXJ0KVxuICAgIGlmIChhcnJvdyA8IDApIHJldHVyblxuXG4gICAgaWYgKGlzVFMpIHsgLy8gVHJ5IHRvIHNraXAgVHlwZVNjcmlwdCByZXR1cm4gdHlwZSBkZWNsYXJhdGlvbnMgYWZ0ZXIgdGhlIGFyZ3VtZW50c1xuICAgICAgdmFyIG0gPSAvOlxccyooPzpcXHcrKD86PFtePl0qPnxcXFtcXF0pP3xcXHtbXn1dKlxcfSlcXHMqJC8uZXhlYyhzdHJlYW0uc3RyaW5nLnNsaWNlKHN0cmVhbS5zdGFydCwgYXJyb3cpKVxuICAgICAgaWYgKG0pIGFycm93ID0gbS5pbmRleFxuICAgIH1cblxuICAgIHZhciBkZXB0aCA9IDAsIHNhd1NvbWV0aGluZyA9IGZhbHNlXG4gICAgZm9yICh2YXIgcG9zID0gYXJyb3cgLSAxOyBwb3MgPj0gMDsgLS1wb3MpIHtcbiAgICAgIHZhciBjaCA9IHN0cmVhbS5zdHJpbmcuY2hhckF0KHBvcylcbiAgICAgIHZhciBicmFja2V0ID0gYnJhY2tldHMuaW5kZXhPZihjaClcbiAgICAgIGlmIChicmFja2V0ID49IDAgJiYgYnJhY2tldCA8IDMpIHtcbiAgICAgICAgaWYgKCFkZXB0aCkgeyArK3BvczsgYnJlYWsgfVxuICAgICAgICBpZiAoLS1kZXB0aCA9PSAwKSB7IGlmIChjaCA9PSAnKCcpIHNhd1NvbWV0aGluZyA9IHRydWU7IGJyZWFrIH1cbiAgICAgIH0gZWxzZSBpZiAoYnJhY2tldCA+PSAzICYmIGJyYWNrZXQgPCA2KSB7XG4gICAgICAgICsrZGVwdGhcbiAgICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICAgIHNhd1NvbWV0aGluZyA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAoL1tcIidcXC9dLy50ZXN0KGNoKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH0gZWxzZSBpZiAoc2F3U29tZXRoaW5nICYmICFkZXB0aCkge1xuICAgICAgICArK3Bvc1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2F3U29tZXRoaW5nICYmICFkZXB0aCkgc3RhdGUuZmF0QXJyb3dBdCA9IHBvc1xuICB9XG5cbiAgLy8gUGFyc2VyXG5cbiAgdmFyIGF0b21pY1R5cGVzID0geydhdG9tJzogdHJ1ZSwgJ251bWJlcic6IHRydWUsICd2YXJpYWJsZSc6IHRydWUsICdzdHJpbmcnOiB0cnVlLCAncmVnZXhwJzogdHJ1ZSwgJ3RoaXMnOiB0cnVlLCAnanNvbmxkLWtleXdvcmQnOiB0cnVlfVxuXG4gIGZ1bmN0aW9uIEpTTGV4aWNhbCAoaW5kZW50ZWQsIGNvbHVtbiwgdHlwZSwgYWxpZ24sIHByZXYsIGluZm8pIHtcbiAgICB0aGlzLmluZGVudGVkID0gaW5kZW50ZWRcbiAgICB0aGlzLmNvbHVtbiA9IGNvbHVtblxuICAgIHRoaXMudHlwZSA9IHR5cGVcbiAgICB0aGlzLnByZXYgPSBwcmV2XG4gICAgdGhpcy5pbmZvID0gaW5mb1xuICAgIGlmIChhbGlnbiAhPSBudWxsKSB0aGlzLmFsaWduID0gYWxpZ25cbiAgfVxuXG4gIGZ1bmN0aW9uIGluU2NvcGUgKHN0YXRlLCB2YXJuYW1lKSB7XG4gICAgZm9yICh2YXIgdiA9IHN0YXRlLmxvY2FsVmFyczsgdjsgdiA9IHYubmV4dCkgeyBpZiAodi5uYW1lID09IHZhcm5hbWUpIHJldHVybiB0cnVlIH1cbiAgICBmb3IgKHZhciBjeCA9IHN0YXRlLmNvbnRleHQ7IGN4OyBjeCA9IGN4LnByZXYpIHtcbiAgICAgIGZvciAodmFyIHYgPSBjeC52YXJzOyB2OyB2ID0gdi5uZXh0KSB7IGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWUgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlSlMgKHN0YXRlLCBzdHlsZSwgdHlwZSwgY29udGVudCwgc3RyZWFtKSB7XG4gICAgdmFyIGNjID0gc3RhdGUuY2NcbiAgICAvLyBDb21tdW5pY2F0ZSBvdXIgY29udGV4dCB0byB0aGUgY29tYmluYXRvcnMuXG4gICAgLy8gKExlc3Mgd2FzdGVmdWwgdGhhbiBjb25zaW5nIHVwIGEgaHVuZHJlZCBjbG9zdXJlcyBvbiBldmVyeSBjYWxsLilcbiAgICBjeC5zdGF0ZSA9IHN0YXRlOyBjeC5zdHJlYW0gPSBzdHJlYW07IGN4Lm1hcmtlZCA9IG51bGwsIGN4LmNjID0gY2M7IGN4LnN0eWxlID0gc3R5bGVcblxuICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eSgnYWxpZ24nKSkgeyBzdGF0ZS5sZXhpY2FsLmFsaWduID0gdHJ1ZSB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgdmFyIGNvbWJpbmF0b3IgPSBjYy5sZW5ndGggPyBjYy5wb3AoKSA6IGpzb25Nb2RlID8gZXhwcmVzc2lvbiA6IHN0YXRlbWVudFxuICAgICAgaWYgKGNvbWJpbmF0b3IodHlwZSwgY29udGVudCkpIHtcbiAgICAgICAgd2hpbGUgKGNjLmxlbmd0aCAmJiBjY1tjYy5sZW5ndGggLSAxXS5sZXgpIHsgY2MucG9wKCkoKSB9XG4gICAgICAgIGlmIChjeC5tYXJrZWQpIHJldHVybiBjeC5tYXJrZWRcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJyAmJiBpblNjb3BlKHN0YXRlLCBjb250ZW50KSkgcmV0dXJuICd2YXJpYWJsZS0yJ1xuICAgICAgICByZXR1cm4gc3R5bGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDb21iaW5hdG9yIHV0aWxzXG5cbiAgdmFyIGN4ID0ge3N0YXRlOiBudWxsLCBjb2x1bW46IG51bGwsIG1hcmtlZDogbnVsbCwgY2M6IG51bGx9XG4gIGZ1bmN0aW9uIHBhc3MgKCkge1xuICAgIGZvciAodmFyIGkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGN4LmNjLnB1c2goYXJndW1lbnRzW2ldKVxuICB9XG4gIGZ1bmN0aW9uIGNvbnQgKCkge1xuICAgIHBhc3MuYXBwbHkobnVsbCwgYXJndW1lbnRzKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbiAgZnVuY3Rpb24gcmVnaXN0ZXIgKHZhcm5hbWUpIHtcbiAgICBmdW5jdGlvbiBpbkxpc3QgKGxpc3QpIHtcbiAgICAgIGZvciAodmFyIHYgPSBsaXN0OyB2OyB2ID0gdi5uZXh0KSB7IGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWUgfVxuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlXG4gICAgY3gubWFya2VkID0gJ2RlZidcbiAgICBpZiAoc3RhdGUuY29udGV4dCkge1xuICAgICAgaWYgKGluTGlzdChzdGF0ZS5sb2NhbFZhcnMpKSByZXR1cm5cbiAgICAgIHN0YXRlLmxvY2FsVmFycyA9IHtuYW1lOiB2YXJuYW1lLCBuZXh0OiBzdGF0ZS5sb2NhbFZhcnN9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbkxpc3Qoc3RhdGUuZ2xvYmFsVmFycykpIHJldHVyblxuICAgICAgaWYgKHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzKSB7IHN0YXRlLmdsb2JhbFZhcnMgPSB7bmFtZTogdmFybmFtZSwgbmV4dDogc3RhdGUuZ2xvYmFsVmFyc30gfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbWJpbmF0b3JzXG5cbiAgdmFyIGRlZmF1bHRWYXJzID0ge25hbWU6ICd0aGlzJywgbmV4dDoge25hbWU6ICdhcmd1bWVudHMnfX1cbiAgZnVuY3Rpb24gcHVzaGNvbnRleHQgKCkge1xuICAgIGN4LnN0YXRlLmNvbnRleHQgPSB7cHJldjogY3guc3RhdGUuY29udGV4dCwgdmFyczogY3guc3RhdGUubG9jYWxWYXJzfVxuICAgIGN4LnN0YXRlLmxvY2FsVmFycyA9IGRlZmF1bHRWYXJzXG4gIH1cbiAgZnVuY3Rpb24gcG9wY29udGV4dCAoKSB7XG4gICAgY3guc3RhdGUubG9jYWxWYXJzID0gY3guc3RhdGUuY29udGV4dC52YXJzXG4gICAgY3guc3RhdGUuY29udGV4dCA9IGN4LnN0YXRlLmNvbnRleHQucHJldlxuICB9XG4gIGZ1bmN0aW9uIHB1c2hsZXggKHR5cGUsIGluZm8pIHtcbiAgICB2YXIgcmVzdWx0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0YXRlID0gY3guc3RhdGUsIGluZGVudCA9IHN0YXRlLmluZGVudGVkXG4gICAgICBpZiAoc3RhdGUubGV4aWNhbC50eXBlID09ICdzdGF0JykgaW5kZW50ID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZFxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAodmFyIG91dGVyID0gc3RhdGUubGV4aWNhbDsgb3V0ZXIgJiYgb3V0ZXIudHlwZSA9PSAnKScgJiYgb3V0ZXIuYWxpZ247IG91dGVyID0gb3V0ZXIucHJldikgeyBpbmRlbnQgPSBvdXRlci5pbmRlbnRlZCB9XG4gICAgICB9XG4gICAgICBzdGF0ZS5sZXhpY2FsID0gbmV3IEpTTGV4aWNhbChpbmRlbnQsIGN4LnN0cmVhbS5jb2x1bW4oKSwgdHlwZSwgbnVsbCwgc3RhdGUubGV4aWNhbCwgaW5mbylcbiAgICB9XG4gICAgcmVzdWx0LmxleCA9IHRydWVcbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbiAgZnVuY3Rpb24gcG9wbGV4ICgpIHtcbiAgICB2YXIgc3RhdGUgPSBjeC5zdGF0ZVxuICAgIGlmIChzdGF0ZS5sZXhpY2FsLnByZXYpIHtcbiAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gJyknKSB7IHN0YXRlLmluZGVudGVkID0gc3RhdGUubGV4aWNhbC5pbmRlbnRlZCB9XG4gICAgICBzdGF0ZS5sZXhpY2FsID0gc3RhdGUubGV4aWNhbC5wcmV2XG4gICAgfVxuICB9XG4gIHBvcGxleC5sZXggPSB0cnVlXG5cbiAgZnVuY3Rpb24gZXhwZWN0ICh3YW50ZWQpIHtcbiAgICBmdW5jdGlvbiBleHAgKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09IHdhbnRlZCkgcmV0dXJuIGNvbnQoKVxuICAgICAgZWxzZSBpZiAod2FudGVkID09ICc7JykgcmV0dXJuIHBhc3MoKVxuICAgICAgZWxzZSByZXR1cm4gY29udChleHApXG4gICAgfTtcbiAgICByZXR1cm4gZXhwXG4gIH1cblxuICBmdW5jdGlvbiBzdGF0ZW1lbnQgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcicpIHJldHVybiBjb250KHB1c2hsZXgoJ3ZhcmRlZicsIHZhbHVlLmxlbmd0aCksIHZhcmRlZiwgZXhwZWN0KCc7JyksIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAna2V5d29yZCBhJykgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBwYXJlbkV4cHIsIHN0YXRlbWVudCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICdrZXl3b3JkIGInKSByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJyksIHN0YXRlbWVudCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICd7JykgcmV0dXJuIGNvbnQocHVzaGxleCgnfScpLCBibG9jaywgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICc7JykgcmV0dXJuIGNvbnQoKVxuICAgIGlmICh0eXBlID09ICdpZicpIHtcbiAgICAgIGlmIChjeC5zdGF0ZS5sZXhpY2FsLmluZm8gPT0gJ2Vsc2UnICYmIGN4LnN0YXRlLmNjW2N4LnN0YXRlLmNjLmxlbmd0aCAtIDFdID09IHBvcGxleCkgeyBjeC5zdGF0ZS5jYy5wb3AoKSgpIH1cbiAgICAgIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgcGFyZW5FeHByLCBzdGF0ZW1lbnQsIHBvcGxleCwgbWF5YmVlbHNlKVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnZnVuY3Rpb24nKSByZXR1cm4gY29udChmdW5jdGlvbmRlZilcbiAgICBpZiAodHlwZSA9PSAnZm9yJykgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBmb3JzcGVjLCBzdGF0ZW1lbnQsIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSB7XG4gICAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSAndHlwZScpIHtcbiAgICAgICAgY3gubWFya2VkID0gJ2tleXdvcmQnXG4gICAgICAgIHJldHVybiBjb250KHR5cGVleHByLCBleHBlY3QoJ29wZXJhdG9yJyksIHR5cGVleHByLCBleHBlY3QoJzsnKSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjb250KHB1c2hsZXgoJ3N0YXQnKSwgbWF5YmVsYWJlbClcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3N3aXRjaCcpIHtcbiAgICAgIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgcGFyZW5FeHByLCBleHBlY3QoJ3snKSwgcHVzaGxleCgnfScsICdzd2l0Y2gnKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxvY2ssIHBvcGxleCwgcG9wbGV4KVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnY2FzZScpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdCgnOicpKVxuICAgIGlmICh0eXBlID09ICdkZWZhdWx0JykgcmV0dXJuIGNvbnQoZXhwZWN0KCc6JykpXG4gICAgaWYgKHR5cGUgPT0gJ2NhdGNoJykge1xuICAgICAgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBwdXNoY29udGV4dCwgZXhwZWN0KCcoJyksIGZ1bmFyZywgZXhwZWN0KCcpJyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50LCBwb3BsZXgsIHBvcGNvbnRleHQpXG4gICAgfVxuICAgIGlmICh0eXBlID09ICdjbGFzcycpIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgY2xhc3NOYW1lLCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJ2V4cG9ydCcpIHJldHVybiBjb250KHB1c2hsZXgoJ3N0YXQnKSwgYWZ0ZXJFeHBvcnQsIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAnaW1wb3J0JykgcmV0dXJuIGNvbnQocHVzaGxleCgnc3RhdCcpLCBhZnRlckltcG9ydCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICdtb2R1bGUnKSByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJyksIHBhdHRlcm4sIGV4cGVjdCgneycpLCBwdXNobGV4KCd9JyksIGJsb2NrLCBwb3BsZXgsIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAnYXN5bmMnKSByZXR1cm4gY29udChzdGF0ZW1lbnQpXG4gICAgaWYgKHZhbHVlID09ICdAJykgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgc3RhdGVtZW50KVxuICAgIHJldHVybiBwYXNzKHB1c2hsZXgoJ3N0YXQnKSwgZXhwcmVzc2lvbiwgZXhwZWN0KCc7JyksIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBleHByZXNzaW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb25Jbm5lcih0eXBlLCBmYWxzZSlcbiAgfVxuICBmdW5jdGlvbiBleHByZXNzaW9uTm9Db21tYSAodHlwZSkge1xuICAgIHJldHVybiBleHByZXNzaW9uSW5uZXIodHlwZSwgdHJ1ZSlcbiAgfVxuICBmdW5jdGlvbiBwYXJlbkV4cHIgKHR5cGUpIHtcbiAgICBpZiAodHlwZSAhPSAnKCcpIHJldHVybiBwYXNzKClcbiAgICByZXR1cm4gY29udChwdXNobGV4KCcpJyksIGV4cHJlc3Npb24sIGV4cGVjdCgnKScpLCBwb3BsZXgpXG4gIH1cbiAgZnVuY3Rpb24gZXhwcmVzc2lvbklubmVyICh0eXBlLCBub0NvbW1hKSB7XG4gICAgaWYgKGN4LnN0YXRlLmZhdEFycm93QXQgPT0gY3guc3RyZWFtLnN0YXJ0KSB7XG4gICAgICB2YXIgYm9keSA9IG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5XG4gICAgICBpZiAodHlwZSA9PSAnKCcpIHJldHVybiBjb250KHB1c2hjb250ZXh0LCBwdXNobGV4KCcpJyksIGNvbW1hc2VwKHBhdHRlcm4sICcpJyksIHBvcGxleCwgZXhwZWN0KCc9PicpLCBib2R5LCBwb3Bjb250ZXh0KVxuICAgICAgZWxzZSBpZiAodHlwZSA9PSAndmFyaWFibGUnKSByZXR1cm4gcGFzcyhwdXNoY29udGV4dCwgcGF0dGVybiwgZXhwZWN0KCc9PicpLCBib2R5LCBwb3Bjb250ZXh0KVxuICAgIH1cblxuICAgIHZhciBtYXliZW9wID0gbm9Db21tYSA/IG1heWJlb3BlcmF0b3JOb0NvbW1hIDogbWF5YmVvcGVyYXRvckNvbW1hXG4gICAgaWYgKGF0b21pY1R5cGVzLmhhc093blByb3BlcnR5KHR5cGUpKSByZXR1cm4gY29udChtYXliZW9wKVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHJldHVybiBjb250KGZ1bmN0aW9uZGVmLCBtYXliZW9wKVxuICAgIGlmICh0eXBlID09ICdjbGFzcycpIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgY2xhc3NFeHByZXNzaW9uLCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJ2tleXdvcmQgYycgfHwgdHlwZSA9PSAnYXN5bmMnKSByZXR1cm4gY29udChub0NvbW1hID8gbWF5YmVleHByZXNzaW9uTm9Db21tYSA6IG1heWJlZXhwcmVzc2lvbilcbiAgICBpZiAodHlwZSA9PSAnKCcpIHJldHVybiBjb250KHB1c2hsZXgoJyknKSwgbWF5YmVleHByZXNzaW9uLCBleHBlY3QoJyknKSwgcG9wbGV4LCBtYXliZW9wKVxuICAgIGlmICh0eXBlID09ICdvcGVyYXRvcicgfHwgdHlwZSA9PSAnc3ByZWFkJykgcmV0dXJuIGNvbnQobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbilcbiAgICBpZiAodHlwZSA9PSAnWycpIHJldHVybiBjb250KHB1c2hsZXgoJ10nKSwgYXJyYXlMaXRlcmFsLCBwb3BsZXgsIG1heWJlb3ApXG4gICAgaWYgKHR5cGUgPT0gJ3snKSByZXR1cm4gY29udENvbW1hc2VwKG9ianByb3AsICd9JywgbnVsbCwgbWF5YmVvcClcbiAgICBpZiAodHlwZSA9PSAncXVhc2knKSByZXR1cm4gcGFzcyhxdWFzaSwgbWF5YmVvcClcbiAgICBpZiAodHlwZSA9PSAnbmV3JykgcmV0dXJuIGNvbnQobWF5YmVUYXJnZXQobm9Db21tYSkpXG4gICAgcmV0dXJuIGNvbnQoKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlZXhwcmVzc2lvbiAodHlwZSkge1xuICAgIGlmICh0eXBlLm1hdGNoKC9bO1xcfVxcKVxcXSxdLykpIHJldHVybiBwYXNzKClcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlZXhwcmVzc2lvbk5vQ29tbWEgKHR5cGUpIHtcbiAgICBpZiAodHlwZS5tYXRjaCgvWztcXH1cXClcXF0sXS8pKSByZXR1cm4gcGFzcygpXG4gICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbk5vQ29tbWEpXG4gIH1cblxuICBmdW5jdGlvbiBtYXliZW9wZXJhdG9yQ29tbWEgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJywnKSByZXR1cm4gY29udChleHByZXNzaW9uKVxuICAgIHJldHVybiBtYXliZW9wZXJhdG9yTm9Db21tYSh0eXBlLCB2YWx1ZSwgZmFsc2UpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVvcGVyYXRvck5vQ29tbWEgKHR5cGUsIHZhbHVlLCBub0NvbW1hKSB7XG4gICAgdmFyIG1lID0gbm9Db21tYSA9PSBmYWxzZSA/IG1heWJlb3BlcmF0b3JDb21tYSA6IG1heWJlb3BlcmF0b3JOb0NvbW1hXG4gICAgdmFyIGV4cHIgPSBub0NvbW1hID09IGZhbHNlID8gZXhwcmVzc2lvbiA6IGV4cHJlc3Npb25Ob0NvbW1hXG4gICAgaWYgKHR5cGUgPT0gJz0+JykgcmV0dXJuIGNvbnQocHVzaGNvbnRleHQsIG5vQ29tbWEgPyBhcnJvd0JvZHlOb0NvbW1hIDogYXJyb3dCb2R5LCBwb3Bjb250ZXh0KVxuICAgIGlmICh0eXBlID09ICdvcGVyYXRvcicpIHtcbiAgICAgIGlmICgvXFwrXFwrfC0tLy50ZXN0KHZhbHVlKSkgcmV0dXJuIGNvbnQobWUpXG4gICAgICBpZiAodmFsdWUgPT0gJz8nKSByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoJzonKSwgZXhwcilcbiAgICAgIHJldHVybiBjb250KGV4cHIpXG4gICAgfVxuICAgIGlmICh0eXBlID09ICdxdWFzaScpIHsgcmV0dXJuIHBhc3MocXVhc2ksIG1lKSB9XG4gICAgaWYgKHR5cGUgPT0gJzsnKSByZXR1cm5cbiAgICBpZiAodHlwZSA9PSAnKCcpIHJldHVybiBjb250Q29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsICcpJywgJ2NhbGwnLCBtZSlcbiAgICBpZiAodHlwZSA9PSAnLicpIHJldHVybiBjb250KHByb3BlcnR5LCBtZSlcbiAgICBpZiAodHlwZSA9PSAnWycpIHJldHVybiBjb250KHB1c2hsZXgoJ10nKSwgbWF5YmVleHByZXNzaW9uLCBleHBlY3QoJ10nKSwgcG9wbGV4LCBtZSlcbiAgICBpZiAoaXNUUyAmJiB2YWx1ZSA9PSAnYXMnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQodHlwZWV4cHIsIG1lKSB9XG4gIH1cbiAgZnVuY3Rpb24gcXVhc2kgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgIT0gJ3F1YXNpJykgcmV0dXJuIHBhc3MoKVxuICAgIGlmICh2YWx1ZS5zbGljZSh2YWx1ZS5sZW5ndGggLSAyKSAhPSAnJHsnKSByZXR1cm4gY29udChxdWFzaSlcbiAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBjb250aW51ZVF1YXNpKVxuICB9XG4gIGZ1bmN0aW9uIGNvbnRpbnVlUXVhc2kgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnfScpIHtcbiAgICAgIGN4Lm1hcmtlZCA9ICdzdHJpbmctMidcbiAgICAgIGN4LnN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaVxuICAgICAgcmV0dXJuIGNvbnQocXVhc2kpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGFycm93Qm9keSAodHlwZSkge1xuICAgIGZpbmRGYXRBcnJvdyhjeC5zdHJlYW0sIGN4LnN0YXRlKVxuICAgIHJldHVybiBwYXNzKHR5cGUgPT0gJ3snID8gc3RhdGVtZW50IDogZXhwcmVzc2lvbilcbiAgfVxuICBmdW5jdGlvbiBhcnJvd0JvZHlOb0NvbW1hICh0eXBlKSB7XG4gICAgZmluZEZhdEFycm93KGN4LnN0cmVhbSwgY3guc3RhdGUpXG4gICAgcmV0dXJuIHBhc3ModHlwZSA9PSAneycgPyBzdGF0ZW1lbnQgOiBleHByZXNzaW9uTm9Db21tYSlcbiAgfVxuICBmdW5jdGlvbiBtYXliZVRhcmdldCAobm9Db21tYSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAodHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT0gJy4nKSByZXR1cm4gY29udChub0NvbW1hID8gdGFyZ2V0Tm9Db21tYSA6IHRhcmdldClcbiAgICAgIGVsc2UgcmV0dXJuIHBhc3Mobm9Db21tYSA/IGV4cHJlc3Npb25Ob0NvbW1hIDogZXhwcmVzc2lvbilcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdGFyZ2V0IChfLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAndGFyZ2V0JykgeyBjeC5tYXJrZWQgPSAna2V5d29yZCc7IHJldHVybiBjb250KG1heWJlb3BlcmF0b3JDb21tYSkgfVxuICB9XG4gIGZ1bmN0aW9uIHRhcmdldE5vQ29tbWEgKF8sIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICd0YXJnZXQnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvck5vQ29tbWEpIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZWxhYmVsICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJzonKSByZXR1cm4gY29udChwb3BsZXgsIHN0YXRlbWVudClcbiAgICByZXR1cm4gcGFzcyhtYXliZW9wZXJhdG9yQ29tbWEsIGV4cGVjdCgnOycpLCBwb3BsZXgpXG4gIH1cbiAgZnVuY3Rpb24gcHJvcGVydHkgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSB7IGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSc7IHJldHVybiBjb250KCkgfVxuICB9XG4gIGZ1bmN0aW9uIG9ianByb3AgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ2FzeW5jJykge1xuICAgICAgY3gubWFya2VkID0gJ3Byb3BlcnR5J1xuICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJyB8fCBjeC5zdHlsZSA9PSAna2V5d29yZCcpIHtcbiAgICAgIGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSdcbiAgICAgIGlmICh2YWx1ZSA9PSAnZ2V0JyB8fCB2YWx1ZSA9PSAnc2V0JykgcmV0dXJuIGNvbnQoZ2V0dGVyU2V0dGVyKVxuICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzdHJpbmcnKSB7XG4gICAgICBjeC5tYXJrZWQgPSBqc29ubGRNb2RlID8gJ3Byb3BlcnR5JyA6IChjeC5zdHlsZSArICcgcHJvcGVydHknKVxuICAgICAgcmV0dXJuIGNvbnQoYWZ0ZXJwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnanNvbmxkLWtleXdvcmQnKSB7XG4gICAgICByZXR1cm4gY29udChhZnRlcnByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdtb2RpZmllcicpIHtcbiAgICAgIHJldHVybiBjb250KG9ianByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdbJykge1xuICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KCddJyksIGFmdGVycHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3NwcmVhZCcpIHtcbiAgICAgIHJldHVybiBjb250KGV4cHJlc3Npb24sIGFmdGVycHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJzonKSB7XG4gICAgICByZXR1cm4gcGFzcyhhZnRlcnByb3ApXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGdldHRlclNldHRlciAodHlwZSkge1xuICAgIGlmICh0eXBlICE9ICd2YXJpYWJsZScpIHJldHVybiBwYXNzKGFmdGVycHJvcClcbiAgICBjeC5tYXJrZWQgPSAncHJvcGVydHknXG4gICAgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYpXG4gIH1cbiAgZnVuY3Rpb24gYWZ0ZXJwcm9wICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJzonKSByZXR1cm4gY29udChleHByZXNzaW9uTm9Db21tYSlcbiAgICBpZiAodHlwZSA9PSAnKCcpIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVmKVxuICB9XG4gIGZ1bmN0aW9uIGNvbW1hc2VwICh3aGF0LCBlbmQsIHNlcCkge1xuICAgIGZ1bmN0aW9uIHByb2NlZWQgKHR5cGUsIHZhbHVlKSB7XG4gICAgICBpZiAoc2VwID8gc2VwLmluZGV4T2YodHlwZSkgPiAtMSA6IHR5cGUgPT0gJywnKSB7XG4gICAgICAgIHZhciBsZXggPSBjeC5zdGF0ZS5sZXhpY2FsXG4gICAgICAgIGlmIChsZXguaW5mbyA9PSAnY2FsbCcpIGxleC5wb3MgPSAobGV4LnBvcyB8fCAwKSArIDFcbiAgICAgICAgcmV0dXJuIGNvbnQoZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgICAgICAgaWYgKHR5cGUgPT0gZW5kIHx8IHZhbHVlID09IGVuZCkgcmV0dXJuIHBhc3MoKVxuICAgICAgICAgIHJldHVybiBwYXNzKHdoYXQpXG4gICAgICAgIH0sIHByb2NlZWQpXG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gY29udCgpXG4gICAgICByZXR1cm4gY29udChleHBlY3QoZW5kKSlcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0eXBlLCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGUgPT0gZW5kIHx8IHZhbHVlID09IGVuZCkgcmV0dXJuIGNvbnQoKVxuICAgICAgcmV0dXJuIHBhc3Mod2hhdCwgcHJvY2VlZClcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY29udENvbW1hc2VwICh3aGF0LCBlbmQsIGluZm8pIHtcbiAgICBmb3IgKHZhciBpID0gMzsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyBjeC5jYy5wdXNoKGFyZ3VtZW50c1tpXSkgfVxuICAgIHJldHVybiBjb250KHB1c2hsZXgoZW5kLCBpbmZvKSwgY29tbWFzZXAod2hhdCwgZW5kKSwgcG9wbGV4KVxuICB9XG4gIGZ1bmN0aW9uIGJsb2NrICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ30nKSByZXR1cm4gY29udCgpXG4gICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50LCBibG9jaylcbiAgfVxuICBmdW5jdGlvbiBtYXliZXR5cGUgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKGlzVFMpIHtcbiAgICAgIGlmICh0eXBlID09ICc6JykgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gICAgICBpZiAodmFsdWUgPT0gJz8nKSByZXR1cm4gY29udChtYXliZXR5cGUpXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHR5cGVleHByICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgeyBjeC5tYXJrZWQgPSAndHlwZSc7IHJldHVybiBjb250KGFmdGVyVHlwZSkgfVxuICAgIGlmICh0eXBlID09ICdzdHJpbmcnIHx8IHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYXRvbScpIHJldHVybiBjb250KGFmdGVyVHlwZSlcbiAgICBpZiAodHlwZSA9PSAneycpIHJldHVybiBjb250KHB1c2hsZXgoJ30nKSwgY29tbWFzZXAodHlwZXByb3AsICd9JywgJyw7JyksIHBvcGxleCwgYWZ0ZXJUeXBlKVxuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnQoY29tbWFzZXAodHlwZWFyZywgJyknKSwgbWF5YmVSZXR1cm5UeXBlKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlUmV0dXJuVHlwZSAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICc9PicpIHJldHVybiBjb250KHR5cGVleHByKVxuICB9XG4gIGZ1bmN0aW9uIHR5cGVwcm9wICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScgfHwgY3guc3R5bGUgPT0gJ2tleXdvcmQnKSB7XG4gICAgICBjeC5tYXJrZWQgPSAncHJvcGVydHknXG4gICAgICByZXR1cm4gY29udCh0eXBlcHJvcClcbiAgICB9IGVsc2UgaWYgKHZhbHVlID09ICc/Jykge1xuICAgICAgcmV0dXJuIGNvbnQodHlwZXByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICc6Jykge1xuICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdbJykge1xuICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgbWF5YmV0eXBlLCBleHBlY3QoJ10nKSwgdHlwZXByb3ApXG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHR5cGVhcmcgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSByZXR1cm4gY29udCh0eXBlYXJnKVxuICAgIGVsc2UgaWYgKHR5cGUgPT0gJzonKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgfVxuICBmdW5jdGlvbiBhZnRlclR5cGUgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICc8JykgcmV0dXJuIGNvbnQocHVzaGxleCgnPicpLCBjb21tYXNlcCh0eXBlZXhwciwgJz4nKSwgcG9wbGV4LCBhZnRlclR5cGUpXG4gICAgaWYgKHZhbHVlID09ICd8JyB8fCB0eXBlID09ICcuJykgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gICAgaWYgKHR5cGUgPT0gJ1snKSByZXR1cm4gY29udChleHBlY3QoJ10nKSwgYWZ0ZXJUeXBlKVxuICAgIGlmICh2YWx1ZSA9PSAnZXh0ZW5kcycpIHJldHVybiBjb250KHR5cGVleHByKVxuICB9XG4gIGZ1bmN0aW9uIHZhcmRlZiAoKSB7XG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbiwgdmFyZGVmQ29udClcbiAgfVxuICBmdW5jdGlvbiBwYXR0ZXJuICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09ICdtb2RpZmllcicpIHJldHVybiBjb250KHBhdHRlcm4pXG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgeyByZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KCkgfVxuICAgIGlmICh0eXBlID09ICdzcHJlYWQnKSByZXR1cm4gY29udChwYXR0ZXJuKVxuICAgIGlmICh0eXBlID09ICdbJykgcmV0dXJuIGNvbnRDb21tYXNlcChwYXR0ZXJuLCAnXScpXG4gICAgaWYgKHR5cGUgPT0gJ3snKSByZXR1cm4gY29udENvbW1hc2VwKHByb3BwYXR0ZXJuLCAnfScpXG4gIH1cbiAgZnVuY3Rpb24gcHJvcHBhdHRlcm4gKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJyAmJiAhY3guc3RyZWFtLm1hdGNoKC9eXFxzKjovLCBmYWxzZSkpIHtcbiAgICAgIHJlZ2lzdGVyKHZhbHVlKVxuICAgICAgcmV0dXJuIGNvbnQobWF5YmVBc3NpZ24pXG4gICAgfVxuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSdcbiAgICBpZiAodHlwZSA9PSAnc3ByZWFkJykgcmV0dXJuIGNvbnQocGF0dGVybilcbiAgICBpZiAodHlwZSA9PSAnfScpIHJldHVybiBwYXNzKClcbiAgICByZXR1cm4gY29udChleHBlY3QoJzonKSwgcGF0dGVybiwgbWF5YmVBc3NpZ24pXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVBc3NpZ24gKF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnPScpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKVxuICB9XG4gIGZ1bmN0aW9uIHZhcmRlZkNvbnQgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnLCcpIHJldHVybiBjb250KHZhcmRlZilcbiAgfVxuICBmdW5jdGlvbiBtYXliZWVsc2UgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ2tleXdvcmQgYicgJiYgdmFsdWUgPT0gJ2Vsc2UnKSByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJywgJ2Vsc2UnKSwgc3RhdGVtZW50LCBwb3BsZXgpXG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYyAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnQocHVzaGxleCgnKScpLCBmb3JzcGVjMSwgZXhwZWN0KCcpJyksIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBmb3JzcGVjMSAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICd2YXInKSByZXR1cm4gY29udCh2YXJkZWYsIGV4cGVjdCgnOycpLCBmb3JzcGVjMilcbiAgICBpZiAodHlwZSA9PSAnOycpIHJldHVybiBjb250KGZvcnNwZWMyKVxuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHJldHVybiBjb250KGZvcm1heWJlaW5vZilcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uLCBleHBlY3QoJzsnKSwgZm9yc3BlYzIpXG4gIH1cbiAgZnVuY3Rpb24gZm9ybWF5YmVpbm9mIChfdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJ2luJyB8fCB2YWx1ZSA9PSAnb2YnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbikgfVxuICAgIHJldHVybiBjb250KG1heWJlb3BlcmF0b3JDb21tYSwgZm9yc3BlYzIpXG4gIH1cbiAgZnVuY3Rpb24gZm9yc3BlYzIgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJzsnKSByZXR1cm4gY29udChmb3JzcGVjMylcbiAgICBpZiAodmFsdWUgPT0gJ2luJyB8fCB2YWx1ZSA9PSAnb2YnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbikgfVxuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGV4cGVjdCgnOycpLCBmb3JzcGVjMylcbiAgfVxuICBmdW5jdGlvbiBmb3JzcGVjMyAodHlwZSkge1xuICAgIGlmICh0eXBlICE9ICcpJykgY29udChleHByZXNzaW9uKVxuICB9XG4gIGZ1bmN0aW9uIGZ1bmN0aW9uZGVmICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnKicpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChmdW5jdGlvbmRlZikgfVxuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHsgcmVnaXN0ZXIodmFsdWUpOyByZXR1cm4gY29udChmdW5jdGlvbmRlZikgfVxuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnQocHVzaGNvbnRleHQsIHB1c2hsZXgoJyknKSwgY29tbWFzZXAoZnVuYXJnLCAnKScpLCBwb3BsZXgsIG1heWJldHlwZSwgc3RhdGVtZW50LCBwb3Bjb250ZXh0KVxuICAgIGlmIChpc1RTICYmIHZhbHVlID09ICc8JykgcmV0dXJuIGNvbnQocHVzaGxleCgnPicpLCBjb21tYXNlcCh0eXBlZXhwciwgJz4nKSwgcG9wbGV4LCBmdW5jdGlvbmRlZilcbiAgfVxuICBmdW5jdGlvbiBmdW5hcmcgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnc3ByZWFkJykgcmV0dXJuIGNvbnQoZnVuYXJnKVxuICAgIHJldHVybiBwYXNzKHBhdHRlcm4sIG1heWJldHlwZSwgbWF5YmVBc3NpZ24pXG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NFeHByZXNzaW9uICh0eXBlLCB2YWx1ZSkge1xuICAgIC8vIENsYXNzIGV4cHJlc3Npb25zIG1heSBoYXZlIGFuIG9wdGlvbmFsIG5hbWUuXG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgcmV0dXJuIGNsYXNzTmFtZSh0eXBlLCB2YWx1ZSlcbiAgICByZXR1cm4gY2xhc3NOYW1lQWZ0ZXIodHlwZSwgdmFsdWUpXG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NOYW1lICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHsgcmVnaXN0ZXIodmFsdWUpOyByZXR1cm4gY29udChjbGFzc05hbWVBZnRlcikgfVxuICB9XG4gIGZ1bmN0aW9uIGNsYXNzTmFtZUFmdGVyICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnPCcpIHJldHVybiBjb250KHB1c2hsZXgoJz4nKSwgY29tbWFzZXAodHlwZWV4cHIsICc+JyksIHBvcGxleCwgY2xhc3NOYW1lQWZ0ZXIpXG4gICAgaWYgKHZhbHVlID09ICdleHRlbmRzJyB8fCB2YWx1ZSA9PSAnaW1wbGVtZW50cycgfHwgKGlzVFMgJiYgdHlwZSA9PSAnLCcpKSB7IHJldHVybiBjb250KGlzVFMgPyB0eXBlZXhwciA6IGV4cHJlc3Npb24sIGNsYXNzTmFtZUFmdGVyKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3snKSByZXR1cm4gY29udChwdXNobGV4KCd9JyksIGNsYXNzQm9keSwgcG9wbGV4KVxuICB9XG4gIGZ1bmN0aW9uIGNsYXNzQm9keSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnIHx8IGN4LnN0eWxlID09ICdrZXl3b3JkJykge1xuICAgICAgaWYgKCh2YWx1ZSA9PSAnYXN5bmMnIHx8IHZhbHVlID09ICdzdGF0aWMnIHx8IHZhbHVlID09ICdnZXQnIHx8IHZhbHVlID09ICdzZXQnIHx8XG4gICAgICAgICAgIChpc1RTICYmICh2YWx1ZSA9PSAncHVibGljJyB8fCB2YWx1ZSA9PSAncHJpdmF0ZScgfHwgdmFsdWUgPT0gJ3Byb3RlY3RlZCcgfHwgdmFsdWUgPT0gJ3JlYWRvbmx5JyB8fCB2YWx1ZSA9PSAnYWJzdHJhY3QnKSkpICYmXG4gICAgICAgICAgY3guc3RyZWFtLm1hdGNoKC9eXFxzK1tcXHckXFx4YTEtXFx1ZmZmZl0vLCBmYWxzZSkpIHtcbiAgICAgICAgY3gubWFya2VkID0gJ2tleXdvcmQnXG4gICAgICAgIHJldHVybiBjb250KGNsYXNzQm9keSlcbiAgICAgIH1cbiAgICAgIGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSdcbiAgICAgIHJldHVybiBjb250KGlzVFMgPyBjbGFzc2ZpZWxkIDogZnVuY3Rpb25kZWYsIGNsYXNzQm9keSlcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ1snKSB7IHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdCgnXScpLCBpc1RTID8gY2xhc3NmaWVsZCA6IGZ1bmN0aW9uZGVmLCBjbGFzc0JvZHkpIH1cbiAgICBpZiAodmFsdWUgPT0gJyonKSB7XG4gICAgICBjeC5tYXJrZWQgPSAna2V5d29yZCdcbiAgICAgIHJldHVybiBjb250KGNsYXNzQm9keSlcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJzsnKSByZXR1cm4gY29udChjbGFzc0JvZHkpXG4gICAgaWYgKHR5cGUgPT0gJ30nKSByZXR1cm4gY29udCgpXG4gICAgaWYgKHZhbHVlID09ICdAJykgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgY2xhc3NCb2R5KVxuICB9XG4gIGZ1bmN0aW9uIGNsYXNzZmllbGQgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICc/JykgcmV0dXJuIGNvbnQoY2xhc3NmaWVsZClcbiAgICBpZiAodHlwZSA9PSAnOicpIHJldHVybiBjb250KHR5cGVleHByLCBtYXliZUFzc2lnbilcbiAgICBpZiAodmFsdWUgPT0gJz0nKSByZXR1cm4gY29udChleHByZXNzaW9uTm9Db21tYSlcbiAgICByZXR1cm4gcGFzcyhmdW5jdGlvbmRlZilcbiAgfVxuICBmdW5jdGlvbiBhZnRlckV4cG9ydCAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJyonKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQobWF5YmVGcm9tLCBleHBlY3QoJzsnKSkgfVxuICAgIGlmICh2YWx1ZSA9PSAnZGVmYXVsdCcpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoJzsnKSkgfVxuICAgIGlmICh0eXBlID09ICd7JykgcmV0dXJuIGNvbnQoY29tbWFzZXAoZXhwb3J0RmllbGQsICd9JyksIG1heWJlRnJvbSwgZXhwZWN0KCc7JykpXG4gICAgcmV0dXJuIHBhc3Moc3RhdGVtZW50KVxuICB9XG4gIGZ1bmN0aW9uIGV4cG9ydEZpZWxkICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnYXMnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQoZXhwZWN0KCd2YXJpYWJsZScpKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbk5vQ29tbWEsIGV4cG9ydEZpZWxkKVxuICB9XG4gIGZ1bmN0aW9uIGFmdGVySW1wb3J0ICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHJldHVybiBjb250KClcbiAgICByZXR1cm4gcGFzcyhpbXBvcnRTcGVjLCBtYXliZU1vcmVJbXBvcnRzLCBtYXliZUZyb20pXG4gIH1cbiAgZnVuY3Rpb24gaW1wb3J0U3BlYyAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAneycpIHJldHVybiBjb250Q29tbWFzZXAoaW1wb3J0U3BlYywgJ30nKVxuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHJlZ2lzdGVyKHZhbHVlKVxuICAgIGlmICh2YWx1ZSA9PSAnKicpIGN4Lm1hcmtlZCA9ICdrZXl3b3JkJ1xuICAgIHJldHVybiBjb250KG1heWJlQXMpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVNb3JlSW1wb3J0cyAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICcsJykgcmV0dXJuIGNvbnQoaW1wb3J0U3BlYywgbWF5YmVNb3JlSW1wb3J0cylcbiAgfVxuICBmdW5jdGlvbiBtYXliZUFzIChfdHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJ2FzJykgeyBjeC5tYXJrZWQgPSAna2V5d29yZCc7IHJldHVybiBjb250KGltcG9ydFNwZWMpIH1cbiAgfVxuICBmdW5jdGlvbiBtYXliZUZyb20gKF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnZnJvbScpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChleHByZXNzaW9uKSB9XG4gIH1cbiAgZnVuY3Rpb24gYXJyYXlMaXRlcmFsICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ10nKSByZXR1cm4gY29udCgpXG4gICAgcmV0dXJuIHBhc3MoY29tbWFzZXAoZXhwcmVzc2lvbk5vQ29tbWEsICddJykpXG4gIH1cblxuICBmdW5jdGlvbiBpc0NvbnRpbnVlZFN0YXRlbWVudCAoc3RhdGUsIHRleHRBZnRlcikge1xuICAgIHJldHVybiBzdGF0ZS5sYXN0VHlwZSA9PSAnb3BlcmF0b3InIHx8IHN0YXRlLmxhc3RUeXBlID09ICcsJyB8fFxuICAgICAgaXNPcGVyYXRvckNoYXIudGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKSB8fFxuICAgICAgL1ssLl0vLnRlc3QodGV4dEFmdGVyLmNoYXJBdCgwKSlcbiAgfVxuXG4gIC8vIEludGVyZmFjZVxuXG4gIHJldHVybiB7XG4gICAgc3RhcnRTdGF0ZTogZnVuY3Rpb24gKGJhc2Vjb2x1bW4pIHtcbiAgICAgIHZhciBzdGF0ZSA9IHtcbiAgICAgICAgdG9rZW5pemU6IHRva2VuQmFzZSxcbiAgICAgICAgbGFzdFR5cGU6ICdzb2YnLFxuICAgICAgICBjYzogW10sXG4gICAgICAgIGxleGljYWw6IG5ldyBKU0xleGljYWwoKGJhc2Vjb2x1bW4gfHwgMCkgLSBpbmRlbnRVbml0LCAwLCAnYmxvY2snLCBmYWxzZSksXG4gICAgICAgIGxvY2FsVmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyxcbiAgICAgICAgY29udGV4dDogcGFyc2VyQ29uZmlnLmxvY2FsVmFycyAmJiB7dmFyczogcGFyc2VyQ29uZmlnLmxvY2FsVmFyc30sXG4gICAgICAgIGluZGVudGVkOiBiYXNlY29sdW1uIHx8IDBcbiAgICAgIH1cbiAgICAgIGlmIChwYXJzZXJDb25maWcuZ2xvYmFsVmFycyAmJiB0eXBlb2YgcGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMgPT09ICdvYmplY3QnKSB7IHN0YXRlLmdsb2JhbFZhcnMgPSBwYXJzZXJDb25maWcuZ2xvYmFsVmFycyB9XG4gICAgICByZXR1cm4gc3RhdGVcbiAgICB9LFxuXG4gICAgdG9rZW46IGZ1bmN0aW9uIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgICBpZiAoc3RyZWFtLnNvbCgpKSB7XG4gICAgICAgIGlmICghc3RhdGUubGV4aWNhbC5oYXNPd25Qcm9wZXJ0eSgnYWxpZ24nKSkgeyBzdGF0ZS5sZXhpY2FsLmFsaWduID0gZmFsc2UgfVxuICAgICAgICBzdGF0ZS5pbmRlbnRlZCA9IHN0cmVhbS5pbmRlbnRhdGlvbigpXG4gICAgICAgIGZpbmRGYXRBcnJvdyhzdHJlYW0sIHN0YXRlKVxuICAgICAgfVxuICAgICAgaWYgKHN0YXRlLnRva2VuaXplICE9IHRva2VuQ29tbWVudCAmJiBzdHJlYW0uZWF0U3BhY2UoKSkgcmV0dXJuIG51bGxcbiAgICAgIHZhciBzdHlsZSA9IHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpXG4gICAgICBpZiAodHlwZSA9PSAnY29tbWVudCcpIHJldHVybiBzdHlsZVxuICAgICAgc3RhdGUubGFzdFR5cGUgPSB0eXBlID09ICdvcGVyYXRvcicgJiYgKGNvbnRlbnQgPT0gJysrJyB8fCBjb250ZW50ID09ICctLScpID8gJ2luY2RlYycgOiB0eXBlXG4gICAgICByZXR1cm4gcGFyc2VKUyhzdGF0ZSwgc3R5bGUsIHR5cGUsIGNvbnRlbnQsIHN0cmVhbSlcbiAgICB9LFxuXG4gICAgaW5kZW50OiBmdW5jdGlvbiAoc3RhdGUsIHRleHRBZnRlcikge1xuICAgICAgaWYgKHN0YXRlLnRva2VuaXplID09IHRva2VuQ29tbWVudCkgcmV0dXJuIENvZGVNaXJyb3IuUGFzc1xuICAgICAgaWYgKHN0YXRlLnRva2VuaXplICE9IHRva2VuQmFzZSkgcmV0dXJuIDBcbiAgICAgIHZhciBmaXJzdENoYXIgPSB0ZXh0QWZ0ZXIgJiYgdGV4dEFmdGVyLmNoYXJBdCgwKSwgbGV4aWNhbCA9IHN0YXRlLmxleGljYWwsIHRvcFxuICAgICAgLy8gS2x1ZGdlIHRvIHByZXZlbnQgJ21heWJlbHNlJyBmcm9tIGJsb2NraW5nIGxleGljYWwgc2NvcGUgcG9wc1xuICAgICAgaWYgKCEvXlxccyplbHNlXFxiLy50ZXN0KHRleHRBZnRlcikpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IHN0YXRlLmNjLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgdmFyIGMgPSBzdGF0ZS5jY1tpXVxuICAgICAgICAgIGlmIChjID09IHBvcGxleCkgbGV4aWNhbCA9IGxleGljYWwucHJldlxuICAgICAgICAgIGVsc2UgaWYgKGMgIT0gbWF5YmVlbHNlKSBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB3aGlsZSAoKGxleGljYWwudHlwZSA9PSAnc3RhdCcgfHwgbGV4aWNhbC50eXBlID09ICdmb3JtJykgJiZcbiAgICAgICAgICAgICAoZmlyc3RDaGFyID09ICd9JyB8fCAoKHRvcCA9IHN0YXRlLmNjW3N0YXRlLmNjLmxlbmd0aCAtIDFdKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodG9wID09IG1heWJlb3BlcmF0b3JDb21tYSB8fCB0b3AgPT0gbWF5YmVvcGVyYXRvck5vQ29tbWEpICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICEvXlssXFwuPStcXC0qOj9bXFwoXS8udGVzdCh0ZXh0QWZ0ZXIpKSkpIHsgbGV4aWNhbCA9IGxleGljYWwucHJldiB9XG4gICAgICBpZiAoc3RhdGVtZW50SW5kZW50ICYmIGxleGljYWwudHlwZSA9PSAnKScgJiYgbGV4aWNhbC5wcmV2LnR5cGUgPT0gJ3N0YXQnKSB7IGxleGljYWwgPSBsZXhpY2FsLnByZXYgfVxuICAgICAgdmFyIHR5cGUgPSBsZXhpY2FsLnR5cGUsIGNsb3NpbmcgPSBmaXJzdENoYXIgPT0gdHlwZVxuXG4gICAgICBpZiAodHlwZSA9PSAndmFyZGVmJykgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQgKyAoc3RhdGUubGFzdFR5cGUgPT0gJ29wZXJhdG9yJyB8fCBzdGF0ZS5sYXN0VHlwZSA9PSAnLCcgPyBsZXhpY2FsLmluZm8gKyAxIDogMClcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2Zvcm0nICYmIGZpcnN0Q2hhciA9PSAneycpIHJldHVybiBsZXhpY2FsLmluZGVudGVkXG4gICAgICBlbHNlIGlmICh0eXBlID09ICdmb3JtJykgcmV0dXJuIGxleGljYWwuaW5kZW50ZWQgKyBpbmRlbnRVbml0XG4gICAgICBlbHNlIGlmICh0eXBlID09ICdzdGF0JykgeyByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChpc0NvbnRpbnVlZFN0YXRlbWVudChzdGF0ZSwgdGV4dEFmdGVyKSA/IHN0YXRlbWVudEluZGVudCB8fCBpbmRlbnRVbml0IDogMCkgfSBlbHNlIGlmIChsZXhpY2FsLmluZm8gPT0gJ3N3aXRjaCcgJiYgIWNsb3NpbmcgJiYgcGFyc2VyQ29uZmlnLmRvdWJsZUluZGVudFN3aXRjaCAhPSBmYWxzZSkgeyByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArICgvXig/OmNhc2V8ZGVmYXVsdClcXGIvLnRlc3QodGV4dEFmdGVyKSA/IGluZGVudFVuaXQgOiAyICogaW5kZW50VW5pdCkgfSBlbHNlIGlmIChsZXhpY2FsLmFsaWduKSByZXR1cm4gbGV4aWNhbC5jb2x1bW4gKyAoY2xvc2luZyA/IDAgOiAxKVxuICAgICAgZWxzZSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChjbG9zaW5nID8gMCA6IGluZGVudFVuaXQpXG4gICAgfSxcblxuICAgIGVsZWN0cmljSW5wdXQ6IC9eXFxzKig/OmNhc2UgLio/OnxkZWZhdWx0OnxcXHt8XFx9KSQvLFxuICAgIGJsb2NrQ29tbWVudFN0YXJ0OiBqc29uTW9kZSA/IG51bGwgOiAnLyonLFxuICAgIGJsb2NrQ29tbWVudEVuZDoganNvbk1vZGUgPyBudWxsIDogJyovJyxcbiAgICBsaW5lQ29tbWVudDoganNvbk1vZGUgPyBudWxsIDogJy8vJyxcbiAgICBmb2xkOiAnYnJhY2UnLFxuICAgIGNsb3NlQnJhY2tldHM6IFwiKClbXXt9JydcXFwiXFxcImBgXCIsXG5cbiAgICBoZWxwZXJUeXBlOiBqc29uTW9kZSA/ICdqc29uJyA6ICdoYWlrdScsXG4gICAganNvbmxkTW9kZToganNvbmxkTW9kZSxcbiAgICBqc29uTW9kZToganNvbk1vZGUsXG5cbiAgICBleHByZXNzaW9uQWxsb3dlZDogZXhwcmVzc2lvbkFsbG93ZWQsXG4gICAgc2tpcEV4cHJlc3Npb246IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgdmFyIHRvcCA9IHN0YXRlLmNjW3N0YXRlLmNjLmxlbmd0aCAtIDFdXG4gICAgICBpZiAodG9wID09IGV4cHJlc3Npb24gfHwgdG9wID09IGV4cHJlc3Npb25Ob0NvbW1hKSBzdGF0ZS5jYy5wb3AoKVxuICAgIH1cbiAgfVxufSlcblxuQ29kZU1pcnJvci5yZWdpc3RlckhlbHBlcignd29yZENoYXJzJywgJ2hhaWt1JywgL1tcXHckXS8pXG5cbkNvZGVNaXJyb3IuZGVmaW5lTUlNRSgndGV4dC94LWhhaWt1JywgJ2hhaWt1JylcblxubW9kdWxlLmV4cG9ydHMgPSBIYWlrdU1vZGVcbiJdfQ==