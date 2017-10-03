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
    };

    // Extend the 'normal' kws with the TypeScript language extensions
    if (isTS) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9tb2Rlcy9oYWlrdS5qcyJdLCJuYW1lcyI6WyJleHByZXNzaW9uQWxsb3dlZCIsInN0cmVhbSIsInN0YXRlIiwiYmFja1VwIiwidGVzdCIsImxhc3RUeXBlIiwic3RyaW5nIiwic2xpY2UiLCJwb3MiLCJIYWlrdU1vZGUiLCJrZXl3b3JkcyIsImRlZmluZU1vZGUiLCJjb25maWciLCJwYXJzZXJDb25maWciLCJpbmRlbnRVbml0Iiwic3RhdGVtZW50SW5kZW50IiwianNvbmxkTW9kZSIsImpzb25sZCIsImpzb25Nb2RlIiwianNvbiIsImlzVFMiLCJ0eXBlc2NyaXB0Iiwid29yZFJFIiwid29yZENoYXJhY3RlcnMiLCJrdyIsInR5cGUiLCJzdHlsZSIsIkEiLCJCIiwiQyIsIm9wZXJhdG9yIiwiYXRvbSIsImpzS2V5d29yZHMiLCJ0c0tleXdvcmRzIiwiYXR0ciIsImlzT3BlcmF0b3JDaGFyIiwiaXNKc29ubGRLZXl3b3JkIiwicmVhZFJlZ2V4cCIsImVzY2FwZWQiLCJuZXh0IiwiaW5TZXQiLCJjb250ZW50IiwicmV0IiwidHAiLCJjb250IiwidG9rZW5CYXNlIiwiY2giLCJ0b2tlbml6ZSIsInRva2VuU3RyaW5nIiwibWF0Y2giLCJlYXQiLCJlYXRXaGlsZSIsInRva2VuQ29tbWVudCIsInNraXBUb0VuZCIsImN1cnJlbnQiLCJ0b2tlblF1YXNpIiwibGV4aWNhbCIsIndvcmQiLCJwcm9wZXJ0eUlzRW51bWVyYWJsZSIsInF1b3RlIiwicGVlayIsIm1heWJlRW5kIiwiYnJhY2tldHMiLCJmaW5kRmF0QXJyb3ciLCJmYXRBcnJvd0F0IiwiYXJyb3ciLCJpbmRleE9mIiwic3RhcnQiLCJtIiwiZXhlYyIsImluZGV4IiwiZGVwdGgiLCJzYXdTb21ldGhpbmciLCJjaGFyQXQiLCJicmFja2V0IiwiYXRvbWljVHlwZXMiLCJKU0xleGljYWwiLCJpbmRlbnRlZCIsImNvbHVtbiIsImFsaWduIiwicHJldiIsImluZm8iLCJpblNjb3BlIiwidmFybmFtZSIsInYiLCJsb2NhbFZhcnMiLCJuYW1lIiwiY3giLCJjb250ZXh0IiwidmFycyIsInBhcnNlSlMiLCJjYyIsIm1hcmtlZCIsImhhc093blByb3BlcnR5IiwiY29tYmluYXRvciIsImxlbmd0aCIsInBvcCIsImV4cHJlc3Npb24iLCJzdGF0ZW1lbnQiLCJsZXgiLCJwYXNzIiwiaSIsImFyZ3VtZW50cyIsInB1c2giLCJhcHBseSIsInJlZ2lzdGVyIiwiaW5MaXN0IiwibGlzdCIsImdsb2JhbFZhcnMiLCJkZWZhdWx0VmFycyIsInB1c2hjb250ZXh0IiwicG9wY29udGV4dCIsInB1c2hsZXgiLCJyZXN1bHQiLCJpbmRlbnQiLCJvdXRlciIsInBvcGxleCIsImV4cGVjdCIsIndhbnRlZCIsImV4cCIsInZhbHVlIiwidmFyZGVmIiwicGFyZW5FeHByIiwiYmxvY2siLCJtYXliZWVsc2UiLCJmdW5jdGlvbmRlZiIsImZvcnNwZWMiLCJ0eXBlZXhwciIsIm1heWJlbGFiZWwiLCJmdW5hcmciLCJjbGFzc05hbWUiLCJhZnRlckV4cG9ydCIsImFmdGVySW1wb3J0IiwicGF0dGVybiIsImV4cHJlc3Npb25Jbm5lciIsImV4cHJlc3Npb25Ob0NvbW1hIiwibm9Db21tYSIsImJvZHkiLCJhcnJvd0JvZHlOb0NvbW1hIiwiYXJyb3dCb2R5IiwiY29tbWFzZXAiLCJtYXliZW9wIiwibWF5YmVvcGVyYXRvck5vQ29tbWEiLCJtYXliZW9wZXJhdG9yQ29tbWEiLCJjbGFzc0V4cHJlc3Npb24iLCJtYXliZWV4cHJlc3Npb25Ob0NvbW1hIiwibWF5YmVleHByZXNzaW9uIiwiYXJyYXlMaXRlcmFsIiwiY29udENvbW1hc2VwIiwib2JqcHJvcCIsInF1YXNpIiwibWF5YmVUYXJnZXQiLCJtZSIsImV4cHIiLCJwcm9wZXJ0eSIsImNvbnRpbnVlUXVhc2kiLCJ0YXJnZXROb0NvbW1hIiwidGFyZ2V0IiwiXyIsImdldHRlclNldHRlciIsImFmdGVycHJvcCIsIndoYXQiLCJlbmQiLCJzZXAiLCJwcm9jZWVkIiwibWF5YmV0eXBlIiwiYWZ0ZXJUeXBlIiwidHlwZXByb3AiLCJ0eXBlYXJnIiwibWF5YmVSZXR1cm5UeXBlIiwibWF5YmVBc3NpZ24iLCJ2YXJkZWZDb250IiwicHJvcHBhdHRlcm4iLCJfdHlwZSIsImZvcnNwZWMxIiwiZm9yc3BlYzIiLCJmb3JtYXliZWlub2YiLCJmb3JzcGVjMyIsImNsYXNzTmFtZUFmdGVyIiwiY2xhc3NCb2R5IiwiY2xhc3NmaWVsZCIsIm1heWJlRnJvbSIsImV4cG9ydEZpZWxkIiwiaW1wb3J0U3BlYyIsIm1heWJlTW9yZUltcG9ydHMiLCJtYXliZUFzIiwiaXNDb250aW51ZWRTdGF0ZW1lbnQiLCJ0ZXh0QWZ0ZXIiLCJzdGFydFN0YXRlIiwiYmFzZWNvbHVtbiIsInRva2VuIiwic29sIiwiaW5kZW50YXRpb24iLCJlYXRTcGFjZSIsIlBhc3MiLCJmaXJzdENoYXIiLCJ0b3AiLCJjIiwiY2xvc2luZyIsImRvdWJsZUluZGVudFN3aXRjaCIsImVsZWN0cmljSW5wdXQiLCJibG9ja0NvbW1lbnRTdGFydCIsImJsb2NrQ29tbWVudEVuZCIsImxpbmVDb21tZW50IiwiZm9sZCIsImNsb3NlQnJhY2tldHMiLCJoZWxwZXJUeXBlIiwic2tpcEV4cHJlc3Npb24iLCJyZWdpc3RlckhlbHBlciIsImRlZmluZU1JTUUiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs4UUFBQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7QUFFQSxTQUFTQSxpQkFBVCxDQUE0QkMsTUFBNUIsRUFBb0NDLEtBQXBDLEVBQTJDQyxNQUEzQyxFQUFtRDtBQUNqRCxTQUFPLHVFQUFzRUMsSUFBdEUsQ0FBMkVGLE1BQU1HLFFBQWpGLEtBQ0pILE1BQU1HLFFBQU4sSUFBa0IsT0FBbEIsSUFBNkIsU0FBU0QsSUFBVCxDQUFjSCxPQUFPSyxNQUFQLENBQWNDLEtBQWQsQ0FBb0IsQ0FBcEIsRUFBdUJOLE9BQU9PLEdBQVAsSUFBY0wsVUFBVSxDQUF4QixDQUF2QixDQUFkO0FBRGhDO0FBRUQ7O0FBRUQ7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b0IsT0E3RDNCO0FBOERMRixnQkFBWUEsVUE5RFA7QUErRExFLGNBQVVBLFFBL0RMOztBQWlFTGxCLHVCQUFtQkEsaUJBakVkO0FBa0VMK00sb0JBQWdCLHdCQUFVN00sS0FBVixFQUFpQjtBQUMvQixVQUFJa00sTUFBTWxNLE1BQU15RixFQUFOLENBQVN6RixNQUFNeUYsRUFBTixDQUFTSSxNQUFULEdBQWtCLENBQTNCLENBQVY7QUFDQSxVQUFJcUcsT0FBT25HLFVBQVAsSUFBcUJtRyxPQUFPN0QsaUJBQWhDLEVBQW1EckksTUFBTXlGLEVBQU4sQ0FBU0ssR0FBVDtBQUNwRDtBQXJFSSxHQUFQO0FBdUVELENBeHlCRDs7QUEweUJBLHFCQUFXZ0gsY0FBWCxDQUEwQixXQUExQixFQUF1QyxPQUF2QyxFQUFnRCxPQUFoRDs7QUFFQSxxQkFBV0MsVUFBWCxDQUFzQixjQUF0QixFQUFzQyxPQUF0Qzs7QUFFQUMsT0FBT0MsT0FBUCxHQUFpQjFNLFNBQWpCIiwiZmlsZSI6ImhhaWt1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZXNsaW50LWRpc2FibGVcblxuLy8gQ29kZU1pcnJvciwgY29weXJpZ2h0IChjKSBieSBNYXJpam4gSGF2ZXJiZWtlIGFuZCBvdGhlcnNcbi8vIERpc3RyaWJ1dGVkIHVuZGVyIGFuIE1JVCBsaWNlbnNlOiBodHRwOi8vY29kZW1pcnJvci5uZXQvTElDRU5TRVxuXG5pbXBvcnQgQ29kZU1pcnJvciBmcm9tICdjb2RlbWlycm9yJ1xuXG5mdW5jdGlvbiBleHByZXNzaW9uQWxsb3dlZCAoc3RyZWFtLCBzdGF0ZSwgYmFja1VwKSB7XG4gIHJldHVybiAvXig/Om9wZXJhdG9yfHNvZnxrZXl3b3JkIGN8Y2FzZXxuZXd8ZXhwb3J0fGRlZmF1bHR8W1xcW3t9XFwoLDs6XXw9PikkLy50ZXN0KHN0YXRlLmxhc3RUeXBlKSB8fFxuICAgIChzdGF0ZS5sYXN0VHlwZSA9PSAncXVhc2knICYmIC9cXHtcXHMqJC8udGVzdChzdHJlYW0uc3RyaW5nLnNsaWNlKDAsIHN0cmVhbS5wb3MgLSAoYmFja1VwIHx8IDApKSkpXG59XG5cbi8vIFdlJ2xsIGV4cG9zZSB0aGlzIG9iamVjdCBwb2ludGVyIHRvIHRoZSBtb2R1bGUgY2hpbGQgc28gaXQgY2FuIGJlIG1vbmtleS1wYXRjaGVkIGF0IHJ1bnRpbWVcbi8vIHRvIGFkZCBkeW5hbWljIGtleXdvcmRzLCBlLmcuIGZvciBoaWdobGlnaHRpbmcgJ2luamVjdGFibGVzJyBvbiB0aGUgZmx5IGR1cmluZyBjb2RlIGVkaXRpbmdcbnZhciBIYWlrdU1vZGUgPSB7fVxuSGFpa3VNb2RlLmtleXdvcmRzID0ge31cblxuQ29kZU1pcnJvci5kZWZpbmVNb2RlKCdoYWlrdScsIGZ1bmN0aW9uIChjb25maWcsIHBhcnNlckNvbmZpZykge1xuICB2YXIgaW5kZW50VW5pdCA9IGNvbmZpZy5pbmRlbnRVbml0XG4gIHZhciBzdGF0ZW1lbnRJbmRlbnQgPSBwYXJzZXJDb25maWcuc3RhdGVtZW50SW5kZW50XG4gIHZhciBqc29ubGRNb2RlID0gcGFyc2VyQ29uZmlnLmpzb25sZFxuICB2YXIganNvbk1vZGUgPSBwYXJzZXJDb25maWcuanNvbiB8fCBqc29ubGRNb2RlXG4gIHZhciBpc1RTID0gcGFyc2VyQ29uZmlnLnR5cGVzY3JpcHRcbiAgdmFyIHdvcmRSRSA9IHBhcnNlckNvbmZpZy53b3JkQ2hhcmFjdGVycyB8fCAvW1xcdyRcXHhhMS1cXHVmZmZmXS9cblxuICAvLyBUb2tlbml6ZXJcblxuICB2YXIga2V5d29yZHMgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGt3ICh0eXBlKSB7IHJldHVybiB7dHlwZTogdHlwZSwgc3R5bGU6ICdrZXl3b3JkJ30gfVxuICAgIHZhciBBID0ga3coJ2tleXdvcmQgYScpLCBCID0ga3coJ2tleXdvcmQgYicpLCBDID0ga3coJ2tleXdvcmQgYycpXG4gICAgdmFyIG9wZXJhdG9yID0ga3coJ29wZXJhdG9yJyksIGF0b20gPSB7dHlwZTogJ2F0b20nLCBzdHlsZTogJ2F0b20nfVxuXG4gICAgdmFyIGpzS2V5d29yZHMgPSB7XG4gICAgICAnaWYnOiBrdygnaWYnKSxcbiAgICAgICd3aGlsZSc6IEEsXG4gICAgICAnd2l0aCc6IEEsXG4gICAgICAnZWxzZSc6IEIsXG4gICAgICAnZG8nOiBCLFxuICAgICAgJ3RyeSc6IEIsXG4gICAgICAnZmluYWxseSc6IEIsXG4gICAgICAncmV0dXJuJzogQyxcbiAgICAgICdicmVhayc6IEMsXG4gICAgICAnY29udGludWUnOiBDLFxuICAgICAgJ25ldyc6IGt3KCduZXcnKSxcbiAgICAgICdkZWxldGUnOiBDLFxuICAgICAgJ3Rocm93JzogQyxcbiAgICAgICdkZWJ1Z2dlcic6IEMsXG4gICAgICAndmFyJzoga3coJ3ZhcicpLFxuICAgICAgJ2NvbnN0Jzoga3coJ3ZhcicpLFxuICAgICAgJ2xldCc6IGt3KCd2YXInKSxcbiAgICAgICdmdW5jdGlvbic6IGt3KCdmdW5jdGlvbicpLFxuICAgICAgJ2NhdGNoJzoga3coJ2NhdGNoJyksXG4gICAgICAnZm9yJzoga3coJ2ZvcicpLFxuICAgICAgJ3N3aXRjaCc6IGt3KCdzd2l0Y2gnKSxcbiAgICAgICdjYXNlJzoga3coJ2Nhc2UnKSxcbiAgICAgICdkZWZhdWx0Jzoga3coJ2RlZmF1bHQnKSxcbiAgICAgICdpbic6IG9wZXJhdG9yLFxuICAgICAgJ3R5cGVvZic6IG9wZXJhdG9yLFxuICAgICAgJ2luc3RhbmNlb2YnOiBvcGVyYXRvcixcbiAgICAgICd0cnVlJzogYXRvbSxcbiAgICAgICdmYWxzZSc6IGF0b20sXG4gICAgICAnbnVsbCc6IGF0b20sXG4gICAgICAndW5kZWZpbmVkJzogYXRvbSxcbiAgICAgICdOYU4nOiBhdG9tLFxuICAgICAgJ0luZmluaXR5JzogYXRvbSxcbiAgICAgICd0aGlzJzoga3coJ3RoaXMnKSxcbiAgICAgICdjbGFzcyc6IGt3KCdjbGFzcycpLFxuICAgICAgJ3N1cGVyJzoga3coJ2F0b20nKSxcbiAgICAgICd5aWVsZCc6IEMsXG4gICAgICAnZXhwb3J0Jzoga3coJ2V4cG9ydCcpLFxuICAgICAgJ2ltcG9ydCc6IGt3KCdpbXBvcnQnKSxcbiAgICAgICdleHRlbmRzJzogQyxcbiAgICAgICdhd2FpdCc6IENcbiAgICB9XG5cbiAgICAvLyBFeHRlbmQgdGhlICdub3JtYWwnIGt3cyB3aXRoIHRoZSBUeXBlU2NyaXB0IGxhbmd1YWdlIGV4dGVuc2lvbnNcbiAgICBpZiAoaXNUUykge1xuICAgICAgdmFyIHR5cGUgPSB7dHlwZTogJ3ZhcmlhYmxlJywgc3R5bGU6ICd0eXBlJ31cbiAgICAgIHZhciB0c0tleXdvcmRzID0ge1xuICAgICAgICAvLyBvYmplY3QtbGlrZSB0aGluZ3NcbiAgICAgICAgJ2ludGVyZmFjZSc6IGt3KCdjbGFzcycpLFxuICAgICAgICAnaW1wbGVtZW50cyc6IEMsXG4gICAgICAgICduYW1lc3BhY2UnOiBDLFxuICAgICAgICAnbW9kdWxlJzoga3coJ21vZHVsZScpLFxuICAgICAgICAnZW51bSc6IGt3KCdtb2R1bGUnKSxcblxuICAgICAgICAvLyBzY29wZSBtb2RpZmllcnNcbiAgICAgICAgJ3B1YmxpYyc6IGt3KCdtb2RpZmllcicpLFxuICAgICAgICAncHJpdmF0ZSc6IGt3KCdtb2RpZmllcicpLFxuICAgICAgICAncHJvdGVjdGVkJzoga3coJ21vZGlmaWVyJyksXG4gICAgICAgICdhYnN0cmFjdCc6IGt3KCdtb2RpZmllcicpLFxuXG4gICAgICAgIC8vIHR5cGVzXG4gICAgICAgICdzdHJpbmcnOiB0eXBlLFxuICAgICAgICAnbnVtYmVyJzogdHlwZSxcbiAgICAgICAgJ2Jvb2xlYW4nOiB0eXBlLFxuICAgICAgICAnYW55JzogdHlwZVxuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBhdHRyIGluIHRzS2V5d29yZHMpIHtcbiAgICAgICAganNLZXl3b3Jkc1thdHRyXSA9IHRzS2V5d29yZHNbYXR0cl1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBJbnN0ZWFkIG9mIHJldHVybmluZyB0aGUgY2xvc2VkLW92ZXIga2V5d29yZHMsIGFkZCB0aGVtIHRvIG91ciBvYmplY3QgcG9pbnRlciBzbyB0aGF0IHNhbWVcbiAgICAvLyBvYmplY3QgcG9pbnRlciBiZWNvbWVzIHRoZSBrZXl3b3JkcyB0byB3aGljaCB3ZSBjYW4gbW9ua2V5cGF0Y2ggbmV3IGtleXdvcmQgdHlwZXNcbiAgICBmb3IgKHZhciBhdHRyIGluIGpzS2V5d29yZHMpIHtcbiAgICAgIEhhaWt1TW9kZS5rZXl3b3Jkc1thdHRyXSA9IGpzS2V5d29yZHNbYXR0cl1cbiAgICB9XG4gICAgcmV0dXJuIEhhaWt1TW9kZS5rZXl3b3Jkc1xuICB9KCkpXG5cbiAgdmFyIGlzT3BlcmF0b3JDaGFyID0gL1srXFwtKiYlPTw+IT98fl5AXS9cbiAgdmFyIGlzSnNvbmxkS2V5d29yZCA9IC9eQChjb250ZXh0fGlkfHZhbHVlfGxhbmd1YWdlfHR5cGV8Y29udGFpbmVyfGxpc3R8c2V0fHJldmVyc2V8aW5kZXh8YmFzZXx2b2NhYnxncmFwaClcIi9cblxuICBmdW5jdGlvbiByZWFkUmVnZXhwIChzdHJlYW0pIHtcbiAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLCBuZXh0LCBpblNldCA9IGZhbHNlXG4gICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgaWYgKCFlc2NhcGVkKSB7XG4gICAgICAgIGlmIChuZXh0ID09ICcvJyAmJiAhaW5TZXQpIHJldHVyblxuICAgICAgICBpZiAobmV4dCA9PSAnWycpIGluU2V0ID0gdHJ1ZVxuICAgICAgICBlbHNlIGlmIChpblNldCAmJiBuZXh0ID09ICddJykgaW5TZXQgPSBmYWxzZVxuICAgICAgfVxuICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkICYmIG5leHQgPT0gJ1xcXFwnXG4gICAgfVxuICB9XG5cbiAgLy8gVXNlZCBhcyBzY3JhdGNoIHZhcmlhYmxlcyB0byBjb21tdW5pY2F0ZSBtdWx0aXBsZSB2YWx1ZXMgd2l0aG91dFxuICAvLyBjb25zaW5nIHVwIHRvbnMgb2Ygb2JqZWN0cy5cbiAgdmFyIHR5cGUsIGNvbnRlbnRcbiAgZnVuY3Rpb24gcmV0ICh0cCwgc3R5bGUsIGNvbnQpIHtcbiAgICB0eXBlID0gdHA7IGNvbnRlbnQgPSBjb250XG4gICAgcmV0dXJuIHN0eWxlXG4gIH1cbiAgZnVuY3Rpb24gdG9rZW5CYXNlIChzdHJlYW0sIHN0YXRlKSB7XG4gICAgdmFyIGNoID0gc3RyZWFtLm5leHQoKVxuICAgIGlmIChjaCA9PSAnXCInIHx8IGNoID09IFwiJ1wiKSB7XG4gICAgICBzdGF0ZS50b2tlbml6ZSA9IHRva2VuU3RyaW5nKGNoKVxuICAgICAgcmV0dXJuIHN0YXRlLnRva2VuaXplKHN0cmVhbSwgc3RhdGUpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnLicgJiYgc3RyZWFtLm1hdGNoKC9eXFxkKyg/OltlRV1bK1xcLV0/XFxkKyk/LykpIHtcbiAgICAgIHJldHVybiByZXQoJ251bWJlcicsICdudW1iZXInKVxuICAgIH0gZWxzZSBpZiAoY2ggPT0gJy4nICYmIHN0cmVhbS5tYXRjaCgnLi4nKSkge1xuICAgICAgcmV0dXJuIHJldCgnc3ByZWFkJywgJ21ldGEnKVxuICAgIH0gZWxzZSBpZiAoL1tcXFtcXF17fVxcKFxcKSw7XFw6XFwuXS8udGVzdChjaCkpIHtcbiAgICAgIHJldHVybiByZXQoY2gpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnPScgJiYgc3RyZWFtLmVhdCgnPicpKSB7XG4gICAgICByZXR1cm4gcmV0KCc9PicsICdvcGVyYXRvcicpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnMCcgJiYgc3RyZWFtLmVhdCgveC9pKSkge1xuICAgICAgc3RyZWFtLmVhdFdoaWxlKC9bXFxkYS1mXS9pKVxuICAgICAgcmV0dXJuIHJldCgnbnVtYmVyJywgJ251bWJlcicpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnMCcgJiYgc3RyZWFtLmVhdCgvby9pKSkge1xuICAgICAgc3RyZWFtLmVhdFdoaWxlKC9bMC03XS9pKVxuICAgICAgcmV0dXJuIHJldCgnbnVtYmVyJywgJ251bWJlcicpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnMCcgJiYgc3RyZWFtLmVhdCgvYi9pKSkge1xuICAgICAgc3RyZWFtLmVhdFdoaWxlKC9bMDFdL2kpXG4gICAgICByZXR1cm4gcmV0KCdudW1iZXInLCAnbnVtYmVyJylcbiAgICB9IGVsc2UgaWYgKC9cXGQvLnRlc3QoY2gpKSB7XG4gICAgICBzdHJlYW0ubWF0Y2goL15cXGQqKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vKVxuICAgICAgcmV0dXJuIHJldCgnbnVtYmVyJywgJ251bWJlcicpXG4gICAgfSBlbHNlIGlmIChjaCA9PSAnLycpIHtcbiAgICAgIGlmIChzdHJlYW0uZWF0KCcqJykpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkNvbW1lbnRcbiAgICAgICAgcmV0dXJuIHRva2VuQ29tbWVudChzdHJlYW0sIHN0YXRlKVxuICAgICAgfSBlbHNlIGlmIChzdHJlYW0uZWF0KCcvJykpIHtcbiAgICAgICAgc3RyZWFtLnNraXBUb0VuZCgpXG4gICAgICAgIHJldHVybiByZXQoJ2NvbW1lbnQnLCAnY29tbWVudCcpXG4gICAgICB9IGVsc2UgaWYgKGV4cHJlc3Npb25BbGxvd2VkKHN0cmVhbSwgc3RhdGUsIDEpKSB7XG4gICAgICAgIHJlYWRSZWdleHAoc3RyZWFtKVxuICAgICAgICBzdHJlYW0ubWF0Y2goL15cXGIoKFtnaW15dV0pKD8hW2dpbXl1XSpcXDIpKStcXGIvKVxuICAgICAgICByZXR1cm4gcmV0KCdyZWdleHAnLCAnc3RyaW5nLTInKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyZWFtLmVhdFdoaWxlKGlzT3BlcmF0b3JDaGFyKVxuICAgICAgICByZXR1cm4gcmV0KCdvcGVyYXRvcicsICdvcGVyYXRvcicsIHN0cmVhbS5jdXJyZW50KCkpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjaCA9PSAnYCcpIHtcbiAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5RdWFzaVxuICAgICAgcmV0dXJuIHRva2VuUXVhc2koc3RyZWFtLCBzdGF0ZSlcbiAgICB9IGVsc2UgaWYgKGNoID09ICcjJykge1xuICAgICAgc3RyZWFtLnNraXBUb0VuZCgpXG4gICAgICByZXR1cm4gcmV0KCdlcnJvcicsICdlcnJvcicpXG4gICAgfSBlbHNlIGlmIChpc09wZXJhdG9yQ2hhci50ZXN0KGNoKSkge1xuICAgICAgaWYgKGNoICE9ICc+JyB8fCAhc3RhdGUubGV4aWNhbCB8fCBzdGF0ZS5sZXhpY2FsLnR5cGUgIT0gJz4nKSB7IHN0cmVhbS5lYXRXaGlsZShpc09wZXJhdG9yQ2hhcikgfVxuICAgICAgcmV0dXJuIHJldCgnb3BlcmF0b3InLCAnb3BlcmF0b3InLCBzdHJlYW0uY3VycmVudCgpKVxuICAgIH0gZWxzZSBpZiAod29yZFJFLnRlc3QoY2gpKSB7XG4gICAgICBzdHJlYW0uZWF0V2hpbGUod29yZFJFKVxuICAgICAgdmFyIHdvcmQgPSBzdHJlYW0uY3VycmVudCgpXG4gICAgICBpZiAoc3RhdGUubGFzdFR5cGUgIT0gJy4nKSB7XG4gICAgICAgIGlmIChrZXl3b3Jkcy5wcm9wZXJ0eUlzRW51bWVyYWJsZSh3b3JkKSkge1xuICAgICAgICAgIHZhciBrdyA9IGtleXdvcmRzW3dvcmRdXG4gICAgICAgICAgcmV0dXJuIHJldChrdy50eXBlLCBrdy5zdHlsZSwgd29yZClcbiAgICAgICAgfVxuICAgICAgICBpZiAod29yZCA9PSAnYXN5bmMnICYmIHN0cmVhbS5tYXRjaCgvXlxccypbXFwoXFx3XS8sIGZhbHNlKSkgeyByZXR1cm4gcmV0KCdhc3luYycsICdrZXl3b3JkJywgd29yZCkgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJldCgndmFyaWFibGUnLCAndmFyaWFibGUnLCB3b3JkKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRva2VuU3RyaW5nIChxdW90ZSkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoc3RyZWFtLCBzdGF0ZSkge1xuICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSwgbmV4dFxuICAgICAgaWYgKGpzb25sZE1vZGUgJiYgc3RyZWFtLnBlZWsoKSA9PSAnQCcgJiYgc3RyZWFtLm1hdGNoKGlzSnNvbmxkS2V5d29yZCkpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2VcbiAgICAgICAgcmV0dXJuIHJldCgnanNvbmxkLWtleXdvcmQnLCAnbWV0YScpXG4gICAgICB9XG4gICAgICB3aGlsZSAoKG5leHQgPSBzdHJlYW0ubmV4dCgpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChuZXh0ID09IHF1b3RlICYmICFlc2NhcGVkKSBicmVha1xuICAgICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSAnXFxcXCdcbiAgICAgIH1cbiAgICAgIGlmICghZXNjYXBlZCkgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2VcbiAgICAgIHJldHVybiByZXQoJ3N0cmluZycsICdzdHJpbmcnKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHRva2VuQ29tbWVudCAoc3RyZWFtLCBzdGF0ZSkge1xuICAgIHZhciBtYXliZUVuZCA9IGZhbHNlLCBjaFxuICAgIHdoaWxlIChjaCA9IHN0cmVhbS5uZXh0KCkpIHtcbiAgICAgIGlmIChjaCA9PSAnLycgJiYgbWF5YmVFbmQpIHtcbiAgICAgICAgc3RhdGUudG9rZW5pemUgPSB0b2tlbkJhc2VcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIG1heWJlRW5kID0gKGNoID09ICcqJylcbiAgICB9XG4gICAgcmV0dXJuIHJldCgnY29tbWVudCcsICdjb21tZW50JylcbiAgfVxuXG4gIGZ1bmN0aW9uIHRva2VuUXVhc2kgKHN0cmVhbSwgc3RhdGUpIHtcbiAgICB2YXIgZXNjYXBlZCA9IGZhbHNlLCBuZXh0XG4gICAgd2hpbGUgKChuZXh0ID0gc3RyZWFtLm5leHQoKSkgIT0gbnVsbCkge1xuICAgICAgaWYgKCFlc2NhcGVkICYmIChuZXh0ID09ICdgJyB8fCBuZXh0ID09ICckJyAmJiBzdHJlYW0uZWF0KCd7JykpKSB7XG4gICAgICAgIHN0YXRlLnRva2VuaXplID0gdG9rZW5CYXNlXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBlc2NhcGVkID0gIWVzY2FwZWQgJiYgbmV4dCA9PSAnXFxcXCdcbiAgICB9XG4gICAgcmV0dXJuIHJldCgncXVhc2knLCAnc3RyaW5nLTInLCBzdHJlYW0uY3VycmVudCgpKVxuICB9XG5cbiAgdmFyIGJyYWNrZXRzID0gJyhbe31dKSdcbiAgLy8gVGhpcyBpcyBhIGNydWRlIGxvb2thaGVhZCB0cmljayB0byB0cnkgYW5kIG5vdGljZSB0aGF0IHdlJ3JlXG4gIC8vIHBhcnNpbmcgdGhlIGFyZ3VtZW50IHBhdHRlcm5zIGZvciBhIGZhdC1hcnJvdyBmdW5jdGlvbiBiZWZvcmUgd2VcbiAgLy8gYWN0dWFsbHkgaGl0IHRoZSBhcnJvdyB0b2tlbi4gSXQgb25seSB3b3JrcyBpZiB0aGUgYXJyb3cgaXMgb25cbiAgLy8gdGhlIHNhbWUgbGluZSBhcyB0aGUgYXJndW1lbnRzIGFuZCB0aGVyZSdzIG5vIHN0cmFuZ2Ugbm9pc2VcbiAgLy8gKGNvbW1lbnRzKSBpbiBiZXR3ZWVuLiBGYWxsYmFjayBpcyB0byBvbmx5IG5vdGljZSB3aGVuIHdlIGhpdCB0aGVcbiAgLy8gYXJyb3csIGFuZCBub3QgZGVjbGFyZSB0aGUgYXJndW1lbnRzIGFzIGxvY2FscyBmb3IgdGhlIGFycm93XG4gIC8vIGJvZHkuXG4gIGZ1bmN0aW9uIGZpbmRGYXRBcnJvdyAoc3RyZWFtLCBzdGF0ZSkge1xuICAgIGlmIChzdGF0ZS5mYXRBcnJvd0F0KSBzdGF0ZS5mYXRBcnJvd0F0ID0gbnVsbFxuICAgIHZhciBhcnJvdyA9IHN0cmVhbS5zdHJpbmcuaW5kZXhPZignPT4nLCBzdHJlYW0uc3RhcnQpXG4gICAgaWYgKGFycm93IDwgMCkgcmV0dXJuXG5cbiAgICBpZiAoaXNUUykgeyAvLyBUcnkgdG8gc2tpcCBUeXBlU2NyaXB0IHJldHVybiB0eXBlIGRlY2xhcmF0aW9ucyBhZnRlciB0aGUgYXJndW1lbnRzXG4gICAgICB2YXIgbSA9IC86XFxzKig/OlxcdysoPzo8W14+XSo+fFxcW1xcXSk/fFxce1tefV0qXFx9KVxccyokLy5leGVjKHN0cmVhbS5zdHJpbmcuc2xpY2Uoc3RyZWFtLnN0YXJ0LCBhcnJvdykpXG4gICAgICBpZiAobSkgYXJyb3cgPSBtLmluZGV4XG4gICAgfVxuXG4gICAgdmFyIGRlcHRoID0gMCwgc2F3U29tZXRoaW5nID0gZmFsc2VcbiAgICBmb3IgKHZhciBwb3MgPSBhcnJvdyAtIDE7IHBvcyA+PSAwOyAtLXBvcykge1xuICAgICAgdmFyIGNoID0gc3RyZWFtLnN0cmluZy5jaGFyQXQocG9zKVxuICAgICAgdmFyIGJyYWNrZXQgPSBicmFja2V0cy5pbmRleE9mKGNoKVxuICAgICAgaWYgKGJyYWNrZXQgPj0gMCAmJiBicmFja2V0IDwgMykge1xuICAgICAgICBpZiAoIWRlcHRoKSB7ICsrcG9zOyBicmVhayB9XG4gICAgICAgIGlmICgtLWRlcHRoID09IDApIHsgaWYgKGNoID09ICcoJykgc2F3U29tZXRoaW5nID0gdHJ1ZTsgYnJlYWsgfVxuICAgICAgfSBlbHNlIGlmIChicmFja2V0ID49IDMgJiYgYnJhY2tldCA8IDYpIHtcbiAgICAgICAgKytkZXB0aFxuICAgICAgfSBlbHNlIGlmICh3b3JkUkUudGVzdChjaCkpIHtcbiAgICAgICAgc2F3U29tZXRoaW5nID0gdHJ1ZVxuICAgICAgfSBlbHNlIGlmICgvW1wiJ1xcL10vLnRlc3QoY2gpKSB7XG4gICAgICAgIHJldHVyblxuICAgICAgfSBlbHNlIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSB7XG4gICAgICAgICsrcG9zXG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzYXdTb21ldGhpbmcgJiYgIWRlcHRoKSBzdGF0ZS5mYXRBcnJvd0F0ID0gcG9zXG4gIH1cblxuICAvLyBQYXJzZXJcblxuICB2YXIgYXRvbWljVHlwZXMgPSB7J2F0b20nOiB0cnVlLCAnbnVtYmVyJzogdHJ1ZSwgJ3ZhcmlhYmxlJzogdHJ1ZSwgJ3N0cmluZyc6IHRydWUsICdyZWdleHAnOiB0cnVlLCAndGhpcyc6IHRydWUsICdqc29ubGQta2V5d29yZCc6IHRydWV9XG5cbiAgZnVuY3Rpb24gSlNMZXhpY2FsIChpbmRlbnRlZCwgY29sdW1uLCB0eXBlLCBhbGlnbiwgcHJldiwgaW5mbykge1xuICAgIHRoaXMuaW5kZW50ZWQgPSBpbmRlbnRlZFxuICAgIHRoaXMuY29sdW1uID0gY29sdW1uXG4gICAgdGhpcy50eXBlID0gdHlwZVxuICAgIHRoaXMucHJldiA9IHByZXZcbiAgICB0aGlzLmluZm8gPSBpbmZvXG4gICAgaWYgKGFsaWduICE9IG51bGwpIHRoaXMuYWxpZ24gPSBhbGlnblxuICB9XG5cbiAgZnVuY3Rpb24gaW5TY29wZSAoc3RhdGUsIHZhcm5hbWUpIHtcbiAgICBmb3IgKHZhciB2ID0gc3RhdGUubG9jYWxWYXJzOyB2OyB2ID0gdi5uZXh0KSB7IGlmICh2Lm5hbWUgPT0gdmFybmFtZSkgcmV0dXJuIHRydWUgfVxuICAgIGZvciAodmFyIGN4ID0gc3RhdGUuY29udGV4dDsgY3g7IGN4ID0gY3gucHJldikge1xuICAgICAgZm9yICh2YXIgdiA9IGN4LnZhcnM7IHY7IHYgPSB2Lm5leHQpIHsgaWYgKHYubmFtZSA9PSB2YXJuYW1lKSByZXR1cm4gdHJ1ZSB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VKUyAoc3RhdGUsIHN0eWxlLCB0eXBlLCBjb250ZW50LCBzdHJlYW0pIHtcbiAgICB2YXIgY2MgPSBzdGF0ZS5jY1xuICAgIC8vIENvbW11bmljYXRlIG91ciBjb250ZXh0IHRvIHRoZSBjb21iaW5hdG9ycy5cbiAgICAvLyAoTGVzcyB3YXN0ZWZ1bCB0aGFuIGNvbnNpbmcgdXAgYSBodW5kcmVkIGNsb3N1cmVzIG9uIGV2ZXJ5IGNhbGwuKVxuICAgIGN4LnN0YXRlID0gc3RhdGU7IGN4LnN0cmVhbSA9IHN0cmVhbTsgY3gubWFya2VkID0gbnVsbCwgY3guY2MgPSBjYzsgY3guc3R5bGUgPSBzdHlsZVxuXG4gICAgaWYgKCFzdGF0ZS5sZXhpY2FsLmhhc093blByb3BlcnR5KCdhbGlnbicpKSB7IHN0YXRlLmxleGljYWwuYWxpZ24gPSB0cnVlIH1cblxuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICB2YXIgY29tYmluYXRvciA9IGNjLmxlbmd0aCA/IGNjLnBvcCgpIDoganNvbk1vZGUgPyBleHByZXNzaW9uIDogc3RhdGVtZW50XG4gICAgICBpZiAoY29tYmluYXRvcih0eXBlLCBjb250ZW50KSkge1xuICAgICAgICB3aGlsZSAoY2MubGVuZ3RoICYmIGNjW2NjLmxlbmd0aCAtIDFdLmxleCkgeyBjYy5wb3AoKSgpIH1cbiAgICAgICAgaWYgKGN4Lm1hcmtlZCkgcmV0dXJuIGN4Lm1hcmtlZFxuICAgICAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnICYmIGluU2NvcGUoc3RhdGUsIGNvbnRlbnQpKSByZXR1cm4gJ3ZhcmlhYmxlLTInXG4gICAgICAgIHJldHVybiBzdHlsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIENvbWJpbmF0b3IgdXRpbHNcblxuICB2YXIgY3ggPSB7c3RhdGU6IG51bGwsIGNvbHVtbjogbnVsbCwgbWFya2VkOiBudWxsLCBjYzogbnVsbH1cbiAgZnVuY3Rpb24gcGFzcyAoKSB7XG4gICAgZm9yICh2YXIgaSA9IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgY3guY2MucHVzaChhcmd1bWVudHNbaV0pXG4gIH1cbiAgZnVuY3Rpb24gY29udCAoKSB7XG4gICAgcGFzcy5hcHBseShudWxsLCBhcmd1bWVudHMpXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBmdW5jdGlvbiByZWdpc3RlciAodmFybmFtZSkge1xuICAgIGZ1bmN0aW9uIGluTGlzdCAobGlzdCkge1xuICAgICAgZm9yICh2YXIgdiA9IGxpc3Q7IHY7IHYgPSB2Lm5leHQpIHsgaWYgKHYubmFtZSA9PSB2YXJuYW1lKSByZXR1cm4gdHJ1ZSB9XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgdmFyIHN0YXRlID0gY3guc3RhdGVcbiAgICBjeC5tYXJrZWQgPSAnZGVmJ1xuICAgIGlmIChzdGF0ZS5jb250ZXh0KSB7XG4gICAgICBpZiAoaW5MaXN0KHN0YXRlLmxvY2FsVmFycykpIHJldHVyblxuICAgICAgc3RhdGUubG9jYWxWYXJzID0ge25hbWU6IHZhcm5hbWUsIG5leHQ6IHN0YXRlLmxvY2FsVmFyc31cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGluTGlzdChzdGF0ZS5nbG9iYWxWYXJzKSkgcmV0dXJuXG4gICAgICBpZiAocGFyc2VyQ29uZmlnLmdsb2JhbFZhcnMpIHsgc3RhdGUuZ2xvYmFsVmFycyA9IHtuYW1lOiB2YXJuYW1lLCBuZXh0OiBzdGF0ZS5nbG9iYWxWYXJzfSB9XG4gICAgfVxuICB9XG5cbiAgLy8gQ29tYmluYXRvcnNcblxuICB2YXIgZGVmYXVsdFZhcnMgPSB7bmFtZTogJ3RoaXMnLCBuZXh0OiB7bmFtZTogJ2FyZ3VtZW50cyd9fVxuICBmdW5jdGlvbiBwdXNoY29udGV4dCAoKSB7XG4gICAgY3guc3RhdGUuY29udGV4dCA9IHtwcmV2OiBjeC5zdGF0ZS5jb250ZXh0LCB2YXJzOiBjeC5zdGF0ZS5sb2NhbFZhcnN9XG4gICAgY3guc3RhdGUubG9jYWxWYXJzID0gZGVmYXVsdFZhcnNcbiAgfVxuICBmdW5jdGlvbiBwb3Bjb250ZXh0ICgpIHtcbiAgICBjeC5zdGF0ZS5sb2NhbFZhcnMgPSBjeC5zdGF0ZS5jb250ZXh0LnZhcnNcbiAgICBjeC5zdGF0ZS5jb250ZXh0ID0gY3guc3RhdGUuY29udGV4dC5wcmV2XG4gIH1cbiAgZnVuY3Rpb24gcHVzaGxleCAodHlwZSwgaW5mbykge1xuICAgIHZhciByZXN1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RhdGUgPSBjeC5zdGF0ZSwgaW5kZW50ID0gc3RhdGUuaW5kZW50ZWRcbiAgICAgIGlmIChzdGF0ZS5sZXhpY2FsLnR5cGUgPT0gJ3N0YXQnKSBpbmRlbnQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkXG4gICAgICBlbHNlIHtcbiAgICAgICAgZm9yICh2YXIgb3V0ZXIgPSBzdGF0ZS5sZXhpY2FsOyBvdXRlciAmJiBvdXRlci50eXBlID09ICcpJyAmJiBvdXRlci5hbGlnbjsgb3V0ZXIgPSBvdXRlci5wcmV2KSB7IGluZGVudCA9IG91dGVyLmluZGVudGVkIH1cbiAgICAgIH1cbiAgICAgIHN0YXRlLmxleGljYWwgPSBuZXcgSlNMZXhpY2FsKGluZGVudCwgY3guc3RyZWFtLmNvbHVtbigpLCB0eXBlLCBudWxsLCBzdGF0ZS5sZXhpY2FsLCBpbmZvKVxuICAgIH1cbiAgICByZXN1bHQubGV4ID0gdHJ1ZVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuICBmdW5jdGlvbiBwb3BsZXggKCkge1xuICAgIHZhciBzdGF0ZSA9IGN4LnN0YXRlXG4gICAgaWYgKHN0YXRlLmxleGljYWwucHJldikge1xuICAgICAgaWYgKHN0YXRlLmxleGljYWwudHlwZSA9PSAnKScpIHsgc3RhdGUuaW5kZW50ZWQgPSBzdGF0ZS5sZXhpY2FsLmluZGVudGVkIH1cbiAgICAgIHN0YXRlLmxleGljYWwgPSBzdGF0ZS5sZXhpY2FsLnByZXZcbiAgICB9XG4gIH1cbiAgcG9wbGV4LmxleCA9IHRydWVcblxuICBmdW5jdGlvbiBleHBlY3QgKHdhbnRlZCkge1xuICAgIGZ1bmN0aW9uIGV4cCAodHlwZSkge1xuICAgICAgaWYgKHR5cGUgPT0gd2FudGVkKSByZXR1cm4gY29udCgpXG4gICAgICBlbHNlIGlmICh3YW50ZWQgPT0gJzsnKSByZXR1cm4gcGFzcygpXG4gICAgICBlbHNlIHJldHVybiBjb250KGV4cClcbiAgICB9O1xuICAgIHJldHVybiBleHBcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXRlbWVudCAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyJykgcmV0dXJuIGNvbnQocHVzaGxleCgndmFyZGVmJywgdmFsdWUubGVuZ3RoKSwgdmFyZGVmLCBleHBlY3QoJzsnKSwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICdrZXl3b3JkIGEnKSByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJyksIHBhcmVuRXhwciwgc3RhdGVtZW50LCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJ2tleXdvcmQgYicpIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgc3RhdGVtZW50LCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJ3snKSByZXR1cm4gY29udChwdXNobGV4KCd9JyksIGJsb2NrLCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJzsnKSByZXR1cm4gY29udCgpXG4gICAgaWYgKHR5cGUgPT0gJ2lmJykge1xuICAgICAgaWYgKGN4LnN0YXRlLmxleGljYWwuaW5mbyA9PSAnZWxzZScgJiYgY3guc3RhdGUuY2NbY3guc3RhdGUuY2MubGVuZ3RoIC0gMV0gPT0gcG9wbGV4KSB7IGN4LnN0YXRlLmNjLnBvcCgpKCkgfVxuICAgICAgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBwYXJlbkV4cHIsIHN0YXRlbWVudCwgcG9wbGV4LCBtYXliZWVsc2UpXG4gICAgfVxuICAgIGlmICh0eXBlID09ICdmdW5jdGlvbicpIHJldHVybiBjb250KGZ1bmN0aW9uZGVmKVxuICAgIGlmICh0eXBlID09ICdmb3InKSByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJyksIGZvcnNwZWMsIHN0YXRlbWVudCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHtcbiAgICAgIGlmIChpc1RTICYmIHZhbHVlID09ICd0eXBlJykge1xuICAgICAgICBjeC5tYXJrZWQgPSAna2V5d29yZCdcbiAgICAgICAgcmV0dXJuIGNvbnQodHlwZWV4cHIsIGV4cGVjdCgnb3BlcmF0b3InKSwgdHlwZWV4cHIsIGV4cGVjdCgnOycpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNvbnQocHVzaGxleCgnc3RhdCcpLCBtYXliZWxhYmVsKVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnc3dpdGNoJykge1xuICAgICAgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBwYXJlbkV4cHIsIGV4cGVjdCgneycpLCBwdXNobGV4KCd9JywgJ3N3aXRjaCcpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibG9jaywgcG9wbGV4LCBwb3BsZXgpXG4gICAgfVxuICAgIGlmICh0eXBlID09ICdjYXNlJykgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KCc6JykpXG4gICAgaWYgKHR5cGUgPT0gJ2RlZmF1bHQnKSByZXR1cm4gY29udChleHBlY3QoJzonKSlcbiAgICBpZiAodHlwZSA9PSAnY2F0Y2gnKSB7XG4gICAgICByZXR1cm4gY29udChwdXNobGV4KCdmb3JtJyksIHB1c2hjb250ZXh0LCBleHBlY3QoJygnKSwgZnVuYXJnLCBleHBlY3QoJyknKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZW1lbnQsIHBvcGxleCwgcG9wY29udGV4dClcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ2NsYXNzJykgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBjbGFzc05hbWUsIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAnZXhwb3J0JykgcmV0dXJuIGNvbnQocHVzaGxleCgnc3RhdCcpLCBhZnRlckV4cG9ydCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICdpbXBvcnQnKSByZXR1cm4gY29udChwdXNobGV4KCdzdGF0JyksIGFmdGVySW1wb3J0LCBwb3BsZXgpXG4gICAgaWYgKHR5cGUgPT0gJ21vZHVsZScpIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nKSwgcGF0dGVybiwgZXhwZWN0KCd7JyksIHB1c2hsZXgoJ30nKSwgYmxvY2ssIHBvcGxleCwgcG9wbGV4KVxuICAgIGlmICh0eXBlID09ICdhc3luYycpIHJldHVybiBjb250KHN0YXRlbWVudClcbiAgICBpZiAodmFsdWUgPT0gJ0AnKSByZXR1cm4gY29udChleHByZXNzaW9uLCBzdGF0ZW1lbnQpXG4gICAgcmV0dXJuIHBhc3MocHVzaGxleCgnc3RhdCcpLCBleHByZXNzaW9uLCBleHBlY3QoJzsnKSwgcG9wbGV4KVxuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb24gKHR5cGUpIHtcbiAgICByZXR1cm4gZXhwcmVzc2lvbklubmVyKHR5cGUsIGZhbHNlKVxuICB9XG4gIGZ1bmN0aW9uIGV4cHJlc3Npb25Ob0NvbW1hICh0eXBlKSB7XG4gICAgcmV0dXJuIGV4cHJlc3Npb25Jbm5lcih0eXBlLCB0cnVlKVxuICB9XG4gIGZ1bmN0aW9uIHBhcmVuRXhwciAodHlwZSkge1xuICAgIGlmICh0eXBlICE9ICcoJykgcmV0dXJuIHBhc3MoKVxuICAgIHJldHVybiBjb250KHB1c2hsZXgoJyknKSwgZXhwcmVzc2lvbiwgZXhwZWN0KCcpJyksIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBleHByZXNzaW9uSW5uZXIgKHR5cGUsIG5vQ29tbWEpIHtcbiAgICBpZiAoY3guc3RhdGUuZmF0QXJyb3dBdCA9PSBjeC5zdHJlYW0uc3RhcnQpIHtcbiAgICAgIHZhciBib2R5ID0gbm9Db21tYSA/IGFycm93Qm9keU5vQ29tbWEgOiBhcnJvd0JvZHlcbiAgICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnQocHVzaGNvbnRleHQsIHB1c2hsZXgoJyknKSwgY29tbWFzZXAocGF0dGVybiwgJyknKSwgcG9wbGV4LCBleHBlY3QoJz0+JyksIGJvZHksIHBvcGNvbnRleHQpXG4gICAgICBlbHNlIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHJldHVybiBwYXNzKHB1c2hjb250ZXh0LCBwYXR0ZXJuLCBleHBlY3QoJz0+JyksIGJvZHksIHBvcGNvbnRleHQpXG4gICAgfVxuXG4gICAgdmFyIG1heWJlb3AgPSBub0NvbW1hID8gbWF5YmVvcGVyYXRvck5vQ29tbWEgOiBtYXliZW9wZXJhdG9yQ29tbWFcbiAgICBpZiAoYXRvbWljVHlwZXMuaGFzT3duUHJvcGVydHkodHlwZSkpIHJldHVybiBjb250KG1heWJlb3ApXG4gICAgaWYgKHR5cGUgPT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGNvbnQoZnVuY3Rpb25kZWYsIG1heWJlb3ApXG4gICAgaWYgKHR5cGUgPT0gJ2NsYXNzJykgcmV0dXJuIGNvbnQocHVzaGxleCgnZm9ybScpLCBjbGFzc0V4cHJlc3Npb24sIHBvcGxleClcbiAgICBpZiAodHlwZSA9PSAna2V5d29yZCBjJyB8fCB0eXBlID09ICdhc3luYycpIHJldHVybiBjb250KG5vQ29tbWEgPyBtYXliZWV4cHJlc3Npb25Ob0NvbW1hIDogbWF5YmVleHByZXNzaW9uKVxuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnQocHVzaGxleCgnKScpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdCgnKScpLCBwb3BsZXgsIG1heWJlb3ApXG4gICAgaWYgKHR5cGUgPT0gJ29wZXJhdG9yJyB8fCB0eXBlID09ICdzcHJlYWQnKSByZXR1cm4gY29udChub0NvbW1hID8gZXhwcmVzc2lvbk5vQ29tbWEgOiBleHByZXNzaW9uKVxuICAgIGlmICh0eXBlID09ICdbJykgcmV0dXJuIGNvbnQocHVzaGxleCgnXScpLCBhcnJheUxpdGVyYWwsIHBvcGxleCwgbWF5YmVvcClcbiAgICBpZiAodHlwZSA9PSAneycpIHJldHVybiBjb250Q29tbWFzZXAob2JqcHJvcCwgJ30nLCBudWxsLCBtYXliZW9wKVxuICAgIGlmICh0eXBlID09ICdxdWFzaScpIHJldHVybiBwYXNzKHF1YXNpLCBtYXliZW9wKVxuICAgIGlmICh0eXBlID09ICduZXcnKSByZXR1cm4gY29udChtYXliZVRhcmdldChub0NvbW1hKSlcbiAgICByZXR1cm4gY29udCgpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVleHByZXNzaW9uICh0eXBlKSB7XG4gICAgaWYgKHR5cGUubWF0Y2goL1s7XFx9XFwpXFxdLF0vKSkgcmV0dXJuIHBhc3MoKVxuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24pXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVleHByZXNzaW9uTm9Db21tYSAodHlwZSkge1xuICAgIGlmICh0eXBlLm1hdGNoKC9bO1xcfVxcKVxcXSxdLykpIHJldHVybiBwYXNzKClcbiAgICByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSlcbiAgfVxuXG4gIGZ1bmN0aW9uIG1heWJlb3BlcmF0b3JDb21tYSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAnLCcpIHJldHVybiBjb250KGV4cHJlc3Npb24pXG4gICAgcmV0dXJuIG1heWJlb3BlcmF0b3JOb0NvbW1hKHR5cGUsIHZhbHVlLCBmYWxzZSlcbiAgfVxuICBmdW5jdGlvbiBtYXliZW9wZXJhdG9yTm9Db21tYSAodHlwZSwgdmFsdWUsIG5vQ29tbWEpIHtcbiAgICB2YXIgbWUgPSBub0NvbW1hID09IGZhbHNlID8gbWF5YmVvcGVyYXRvckNvbW1hIDogbWF5YmVvcGVyYXRvck5vQ29tbWFcbiAgICB2YXIgZXhwciA9IG5vQ29tbWEgPT0gZmFsc2UgPyBleHByZXNzaW9uIDogZXhwcmVzc2lvbk5vQ29tbWFcbiAgICBpZiAodHlwZSA9PSAnPT4nKSByZXR1cm4gY29udChwdXNoY29udGV4dCwgbm9Db21tYSA/IGFycm93Qm9keU5vQ29tbWEgOiBhcnJvd0JvZHksIHBvcGNvbnRleHQpXG4gICAgaWYgKHR5cGUgPT0gJ29wZXJhdG9yJykge1xuICAgICAgaWYgKC9cXCtcXCt8LS0vLnRlc3QodmFsdWUpKSByZXR1cm4gY29udChtZSlcbiAgICAgIGlmICh2YWx1ZSA9PSAnPycpIHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdCgnOicpLCBleHByKVxuICAgICAgcmV0dXJuIGNvbnQoZXhwcilcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3F1YXNpJykgeyByZXR1cm4gcGFzcyhxdWFzaSwgbWUpIH1cbiAgICBpZiAodHlwZSA9PSAnOycpIHJldHVyblxuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIGNvbnRDb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgJyknLCAnY2FsbCcsIG1lKVxuICAgIGlmICh0eXBlID09ICcuJykgcmV0dXJuIGNvbnQocHJvcGVydHksIG1lKVxuICAgIGlmICh0eXBlID09ICdbJykgcmV0dXJuIGNvbnQocHVzaGxleCgnXScpLCBtYXliZWV4cHJlc3Npb24sIGV4cGVjdCgnXScpLCBwb3BsZXgsIG1lKVxuICAgIGlmIChpc1RTICYmIHZhbHVlID09ICdhcycpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udCh0eXBlZXhwciwgbWUpIH1cbiAgfVxuICBmdW5jdGlvbiBxdWFzaSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSAhPSAncXVhc2knKSByZXR1cm4gcGFzcygpXG4gICAgaWYgKHZhbHVlLnNsaWNlKHZhbHVlLmxlbmd0aCAtIDIpICE9ICckeycpIHJldHVybiBjb250KHF1YXNpKVxuICAgIHJldHVybiBjb250KGV4cHJlc3Npb24sIGNvbnRpbnVlUXVhc2kpXG4gIH1cbiAgZnVuY3Rpb24gY29udGludWVRdWFzaSAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICd9Jykge1xuICAgICAgY3gubWFya2VkID0gJ3N0cmluZy0yJ1xuICAgICAgY3guc3RhdGUudG9rZW5pemUgPSB0b2tlblF1YXNpXG4gICAgICByZXR1cm4gY29udChxdWFzaSlcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gYXJyb3dCb2R5ICh0eXBlKSB7XG4gICAgZmluZEZhdEFycm93KGN4LnN0cmVhbSwgY3guc3RhdGUpXG4gICAgcmV0dXJuIHBhc3ModHlwZSA9PSAneycgPyBzdGF0ZW1lbnQgOiBleHByZXNzaW9uKVxuICB9XG4gIGZ1bmN0aW9uIGFycm93Qm9keU5vQ29tbWEgKHR5cGUpIHtcbiAgICBmaW5kRmF0QXJyb3coY3guc3RyZWFtLCBjeC5zdGF0ZSlcbiAgICByZXR1cm4gcGFzcyh0eXBlID09ICd7JyA/IHN0YXRlbWVudCA6IGV4cHJlc3Npb25Ob0NvbW1hKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlVGFyZ2V0IChub0NvbW1hKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PSAnLicpIHJldHVybiBjb250KG5vQ29tbWEgPyB0YXJnZXROb0NvbW1hIDogdGFyZ2V0KVxuICAgICAgZWxzZSByZXR1cm4gcGFzcyhub0NvbW1hID8gZXhwcmVzc2lvbk5vQ29tbWEgOiBleHByZXNzaW9uKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0YXJnZXQgKF8sIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICd0YXJnZXQnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvckNvbW1hKSB9XG4gIH1cbiAgZnVuY3Rpb24gdGFyZ2V0Tm9Db21tYSAoXywgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJ3RhcmdldCcpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChtYXliZW9wZXJhdG9yTm9Db21tYSkgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlbGFiZWwgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnOicpIHJldHVybiBjb250KHBvcGxleCwgc3RhdGVtZW50KVxuICAgIHJldHVybiBwYXNzKG1heWJlb3BlcmF0b3JDb21tYSwgZXhwZWN0KCc7JyksIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBwcm9wZXJ0eSAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHsgY3gubWFya2VkID0gJ3Byb3BlcnR5JzsgcmV0dXJuIGNvbnQoKSB9XG4gIH1cbiAgZnVuY3Rpb24gb2JqcHJvcCAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAnYXN5bmMnKSB7XG4gICAgICBjeC5tYXJrZWQgPSAncHJvcGVydHknXG4gICAgICByZXR1cm4gY29udChvYmpwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAndmFyaWFibGUnIHx8IGN4LnN0eWxlID09ICdrZXl3b3JkJykge1xuICAgICAgY3gubWFya2VkID0gJ3Byb3BlcnR5J1xuICAgICAgaWYgKHZhbHVlID09ICdnZXQnIHx8IHZhbHVlID09ICdzZXQnKSByZXR1cm4gY29udChnZXR0ZXJTZXR0ZXIpXG4gICAgICByZXR1cm4gY29udChhZnRlcnByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N0cmluZycpIHtcbiAgICAgIGN4Lm1hcmtlZCA9IGpzb25sZE1vZGUgPyAncHJvcGVydHknIDogKGN4LnN0eWxlICsgJyBwcm9wZXJ0eScpXG4gICAgICByZXR1cm4gY29udChhZnRlcnByb3ApXG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdqc29ubGQta2V5d29yZCcpIHtcbiAgICAgIHJldHVybiBjb250KGFmdGVycHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ21vZGlmaWVyJykge1xuICAgICAgcmV0dXJuIGNvbnQob2JqcHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ1snKSB7XG4gICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBleHBlY3QoJ10nKSwgYWZ0ZXJwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc3ByZWFkJykge1xuICAgICAgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgYWZ0ZXJwcm9wKVxuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnOicpIHtcbiAgICAgIHJldHVybiBwYXNzKGFmdGVycHJvcClcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZ2V0dGVyU2V0dGVyICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgIT0gJ3ZhcmlhYmxlJykgcmV0dXJuIHBhc3MoYWZ0ZXJwcm9wKVxuICAgIGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSdcbiAgICByZXR1cm4gY29udChmdW5jdGlvbmRlZilcbiAgfVxuICBmdW5jdGlvbiBhZnRlcnByb3AgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnOicpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKVxuICAgIGlmICh0eXBlID09ICcoJykgcmV0dXJuIHBhc3MoZnVuY3Rpb25kZWYpXG4gIH1cbiAgZnVuY3Rpb24gY29tbWFzZXAgKHdoYXQsIGVuZCwgc2VwKSB7XG4gICAgZnVuY3Rpb24gcHJvY2VlZCAodHlwZSwgdmFsdWUpIHtcbiAgICAgIGlmIChzZXAgPyBzZXAuaW5kZXhPZih0eXBlKSA+IC0xIDogdHlwZSA9PSAnLCcpIHtcbiAgICAgICAgdmFyIGxleCA9IGN4LnN0YXRlLmxleGljYWxcbiAgICAgICAgaWYgKGxleC5pbmZvID09ICdjYWxsJykgbGV4LnBvcyA9IChsZXgucG9zIHx8IDApICsgMVxuICAgICAgICByZXR1cm4gY29udChmdW5jdGlvbiAodHlwZSwgdmFsdWUpIHtcbiAgICAgICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gcGFzcygpXG4gICAgICAgICAgcmV0dXJuIHBhc3Mod2hhdClcbiAgICAgICAgfSwgcHJvY2VlZClcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlID09IGVuZCB8fCB2YWx1ZSA9PSBlbmQpIHJldHVybiBjb250KClcbiAgICAgIHJldHVybiBjb250KGV4cGVjdChlbmQpKVxuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgICBpZiAodHlwZSA9PSBlbmQgfHwgdmFsdWUgPT0gZW5kKSByZXR1cm4gY29udCgpXG4gICAgICByZXR1cm4gcGFzcyh3aGF0LCBwcm9jZWVkKVxuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBjb250Q29tbWFzZXAgKHdoYXQsIGVuZCwgaW5mbykge1xuICAgIGZvciAodmFyIGkgPSAzOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IGN4LmNjLnB1c2goYXJndW1lbnRzW2ldKSB9XG4gICAgcmV0dXJuIGNvbnQocHVzaGxleChlbmQsIGluZm8pLCBjb21tYXNlcCh3aGF0LCBlbmQpLCBwb3BsZXgpXG4gIH1cbiAgZnVuY3Rpb24gYmxvY2sgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnfScpIHJldHVybiBjb250KClcbiAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQsIGJsb2NrKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJldHlwZSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAoaXNUUykge1xuICAgICAgaWYgKHR5cGUgPT0gJzonKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICAgIGlmICh2YWx1ZSA9PSAnPycpIHJldHVybiBjb250KG1heWJldHlwZSlcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdHlwZWV4cHIgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSB7IGN4Lm1hcmtlZCA9ICd0eXBlJzsgcmV0dXJuIGNvbnQoYWZ0ZXJUeXBlKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdhdG9tJykgcmV0dXJuIGNvbnQoYWZ0ZXJUeXBlKVxuICAgIGlmICh0eXBlID09ICd7JykgcmV0dXJuIGNvbnQocHVzaGxleCgnfScpLCBjb21tYXNlcCh0eXBlcHJvcCwgJ30nLCAnLDsnKSwgcG9wbGV4LCBhZnRlclR5cGUpXG4gICAgaWYgKHR5cGUgPT0gJygnKSByZXR1cm4gY29udChjb21tYXNlcCh0eXBlYXJnLCAnKScpLCBtYXliZVJldHVyblR5cGUpXG4gIH1cbiAgZnVuY3Rpb24gbWF5YmVSZXR1cm5UeXBlICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJz0+JykgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gIH1cbiAgZnVuY3Rpb24gdHlwZXByb3AgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJyB8fCBjeC5zdHlsZSA9PSAna2V5d29yZCcpIHtcbiAgICAgIGN4Lm1hcmtlZCA9ICdwcm9wZXJ0eSdcbiAgICAgIHJldHVybiBjb250KHR5cGVwcm9wKVxuICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gJz8nKSB7XG4gICAgICByZXR1cm4gY29udCh0eXBlcHJvcClcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJzonKSB7XG4gICAgICByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ1snKSB7XG4gICAgICByZXR1cm4gY29udChleHByZXNzaW9uLCBtYXliZXR5cGUsIGV4cGVjdCgnXScpLCB0eXBlcHJvcClcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdHlwZWFyZyAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScpIHJldHVybiBjb250KHR5cGVhcmcpXG4gICAgZWxzZSBpZiAodHlwZSA9PSAnOicpIHJldHVybiBjb250KHR5cGVleHByKVxuICB9XG4gIGZ1bmN0aW9uIGFmdGVyVHlwZSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJzwnKSByZXR1cm4gY29udChwdXNobGV4KCc+JyksIGNvbW1hc2VwKHR5cGVleHByLCAnPicpLCBwb3BsZXgsIGFmdGVyVHlwZSlcbiAgICBpZiAodmFsdWUgPT0gJ3wnIHx8IHR5cGUgPT0gJy4nKSByZXR1cm4gY29udCh0eXBlZXhwcilcbiAgICBpZiAodHlwZSA9PSAnWycpIHJldHVybiBjb250KGV4cGVjdCgnXScpLCBhZnRlclR5cGUpXG4gICAgaWYgKHZhbHVlID09ICdleHRlbmRzJykgcmV0dXJuIGNvbnQodHlwZWV4cHIpXG4gIH1cbiAgZnVuY3Rpb24gdmFyZGVmICgpIHtcbiAgICByZXR1cm4gcGFzcyhwYXR0ZXJuLCBtYXliZXR5cGUsIG1heWJlQXNzaWduLCB2YXJkZWZDb250KVxuICB9XG4gIGZ1bmN0aW9uIHBhdHRlcm4gKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ21vZGlmaWVyJykgcmV0dXJuIGNvbnQocGF0dGVybilcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSB7IHJlZ2lzdGVyKHZhbHVlKTsgcmV0dXJuIGNvbnQoKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3NwcmVhZCcpIHJldHVybiBjb250KHBhdHRlcm4pXG4gICAgaWYgKHR5cGUgPT0gJ1snKSByZXR1cm4gY29udENvbW1hc2VwKHBhdHRlcm4sICddJylcbiAgICBpZiAodHlwZSA9PSAneycpIHJldHVybiBjb250Q29tbWFzZXAocHJvcHBhdHRlcm4sICd9JylcbiAgfVxuICBmdW5jdGlvbiBwcm9wcGF0dGVybiAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnICYmICFjeC5zdHJlYW0ubWF0Y2goL15cXHMqOi8sIGZhbHNlKSkge1xuICAgICAgcmVnaXN0ZXIodmFsdWUpXG4gICAgICByZXR1cm4gY29udChtYXliZUFzc2lnbilcbiAgICB9XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgY3gubWFya2VkID0gJ3Byb3BlcnR5J1xuICAgIGlmICh0eXBlID09ICdzcHJlYWQnKSByZXR1cm4gY29udChwYXR0ZXJuKVxuICAgIGlmICh0eXBlID09ICd9JykgcmV0dXJuIHBhc3MoKVxuICAgIHJldHVybiBjb250KGV4cGVjdCgnOicpLCBwYXR0ZXJuLCBtYXliZUFzc2lnbilcbiAgfVxuICBmdW5jdGlvbiBtYXliZUFzc2lnbiAoX3R5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICc9JykgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbk5vQ29tbWEpXG4gIH1cbiAgZnVuY3Rpb24gdmFyZGVmQ29udCAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICcsJykgcmV0dXJuIGNvbnQodmFyZGVmKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlZWxzZSAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAna2V5d29yZCBiJyAmJiB2YWx1ZSA9PSAnZWxzZScpIHJldHVybiBjb250KHB1c2hsZXgoJ2Zvcm0nLCAnZWxzZScpLCBzdGF0ZW1lbnQsIHBvcGxleClcbiAgfVxuICBmdW5jdGlvbiBmb3JzcGVjICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJygnKSByZXR1cm4gY29udChwdXNobGV4KCcpJyksIGZvcnNwZWMxLCBleHBlY3QoJyknKSwgcG9wbGV4KVxuICB9XG4gIGZ1bmN0aW9uIGZvcnNwZWMxICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcicpIHJldHVybiBjb250KHZhcmRlZiwgZXhwZWN0KCc7JyksIGZvcnNwZWMyKVxuICAgIGlmICh0eXBlID09ICc7JykgcmV0dXJuIGNvbnQoZm9yc3BlYzIpXG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgcmV0dXJuIGNvbnQoZm9ybWF5YmVpbm9mKVxuICAgIHJldHVybiBwYXNzKGV4cHJlc3Npb24sIGV4cGVjdCgnOycpLCBmb3JzcGVjMilcbiAgfVxuICBmdW5jdGlvbiBmb3JtYXliZWlub2YgKF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnaW4nIHx8IHZhbHVlID09ICdvZicpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChleHByZXNzaW9uKSB9XG4gICAgcmV0dXJuIGNvbnQobWF5YmVvcGVyYXRvckNvbW1hLCBmb3JzcGVjMilcbiAgfVxuICBmdW5jdGlvbiBmb3JzcGVjMiAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZSA9PSAnOycpIHJldHVybiBjb250KGZvcnNwZWMzKVxuICAgIGlmICh2YWx1ZSA9PSAnaW4nIHx8IHZhbHVlID09ICdvZicpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChleHByZXNzaW9uKSB9XG4gICAgcmV0dXJuIHBhc3MoZXhwcmVzc2lvbiwgZXhwZWN0KCc7JyksIGZvcnNwZWMzKVxuICB9XG4gIGZ1bmN0aW9uIGZvcnNwZWMzICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgIT0gJyknKSBjb250KGV4cHJlc3Npb24pXG4gIH1cbiAgZnVuY3Rpb24gZnVuY3Rpb25kZWYgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICcqJykgeyBjeC5tYXJrZWQgPSAna2V5d29yZCc7IHJldHVybiBjb250KGZ1bmN0aW9uZGVmKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgeyByZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KGZ1bmN0aW9uZGVmKSB9XG4gICAgaWYgKHR5cGUgPT0gJygnKSByZXR1cm4gY29udChwdXNoY29udGV4dCwgcHVzaGxleCgnKScpLCBjb21tYXNlcChmdW5hcmcsICcpJyksIHBvcGxleCwgbWF5YmV0eXBlLCBzdGF0ZW1lbnQsIHBvcGNvbnRleHQpXG4gICAgaWYgKGlzVFMgJiYgdmFsdWUgPT0gJzwnKSByZXR1cm4gY29udChwdXNobGV4KCc+JyksIGNvbW1hc2VwKHR5cGVleHByLCAnPicpLCBwb3BsZXgsIGZ1bmN0aW9uZGVmKVxuICB9XG4gIGZ1bmN0aW9uIGZ1bmFyZyAodHlwZSkge1xuICAgIGlmICh0eXBlID09ICdzcHJlYWQnKSByZXR1cm4gY29udChmdW5hcmcpXG4gICAgcmV0dXJuIHBhc3MocGF0dGVybiwgbWF5YmV0eXBlLCBtYXliZUFzc2lnbilcbiAgfVxuICBmdW5jdGlvbiBjbGFzc0V4cHJlc3Npb24gKHR5cGUsIHZhbHVlKSB7XG4gICAgLy8gQ2xhc3MgZXhwcmVzc2lvbnMgbWF5IGhhdmUgYW4gb3B0aW9uYWwgbmFtZS5cbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSByZXR1cm4gY2xhc3NOYW1lKHR5cGUsIHZhbHVlKVxuICAgIHJldHVybiBjbGFzc05hbWVBZnRlcih0eXBlLCB2YWx1ZSlcbiAgfVxuICBmdW5jdGlvbiBjbGFzc05hbWUgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgeyByZWdpc3Rlcih2YWx1ZSk7IHJldHVybiBjb250KGNsYXNzTmFtZUFmdGVyKSB9XG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NOYW1lQWZ0ZXIgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICc8JykgcmV0dXJuIGNvbnQocHVzaGxleCgnPicpLCBjb21tYXNlcCh0eXBlZXhwciwgJz4nKSwgcG9wbGV4LCBjbGFzc05hbWVBZnRlcilcbiAgICBpZiAodmFsdWUgPT0gJ2V4dGVuZHMnIHx8IHZhbHVlID09ICdpbXBsZW1lbnRzJyB8fCAoaXNUUyAmJiB0eXBlID09ICcsJykpIHsgcmV0dXJuIGNvbnQoaXNUUyA/IHR5cGVleHByIDogZXhwcmVzc2lvbiwgY2xhc3NOYW1lQWZ0ZXIpIH1cbiAgICBpZiAodHlwZSA9PSAneycpIHJldHVybiBjb250KHB1c2hsZXgoJ30nKSwgY2xhc3NCb2R5LCBwb3BsZXgpXG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NCb2R5ICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09ICd2YXJpYWJsZScgfHwgY3guc3R5bGUgPT0gJ2tleXdvcmQnKSB7XG4gICAgICBpZiAoKHZhbHVlID09ICdhc3luYycgfHwgdmFsdWUgPT0gJ3N0YXRpYycgfHwgdmFsdWUgPT0gJ2dldCcgfHwgdmFsdWUgPT0gJ3NldCcgfHxcbiAgICAgICAgICAgKGlzVFMgJiYgKHZhbHVlID09ICdwdWJsaWMnIHx8IHZhbHVlID09ICdwcml2YXRlJyB8fCB2YWx1ZSA9PSAncHJvdGVjdGVkJyB8fCB2YWx1ZSA9PSAncmVhZG9ubHknIHx8IHZhbHVlID09ICdhYnN0cmFjdCcpKSkgJiZcbiAgICAgICAgICBjeC5zdHJlYW0ubWF0Y2goL15cXHMrW1xcdyRcXHhhMS1cXHVmZmZmXS8sIGZhbHNlKSkge1xuICAgICAgICBjeC5tYXJrZWQgPSAna2V5d29yZCdcbiAgICAgICAgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KVxuICAgICAgfVxuICAgICAgY3gubWFya2VkID0gJ3Byb3BlcnR5J1xuICAgICAgcmV0dXJuIGNvbnQoaXNUUyA/IGNsYXNzZmllbGQgOiBmdW5jdGlvbmRlZiwgY2xhc3NCb2R5KVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnWycpIHsgcmV0dXJuIGNvbnQoZXhwcmVzc2lvbiwgZXhwZWN0KCddJyksIGlzVFMgPyBjbGFzc2ZpZWxkIDogZnVuY3Rpb25kZWYsIGNsYXNzQm9keSkgfVxuICAgIGlmICh2YWx1ZSA9PSAnKicpIHtcbiAgICAgIGN4Lm1hcmtlZCA9ICdrZXl3b3JkJ1xuICAgICAgcmV0dXJuIGNvbnQoY2xhc3NCb2R5KVxuICAgIH1cbiAgICBpZiAodHlwZSA9PSAnOycpIHJldHVybiBjb250KGNsYXNzQm9keSlcbiAgICBpZiAodHlwZSA9PSAnfScpIHJldHVybiBjb250KClcbiAgICBpZiAodmFsdWUgPT0gJ0AnKSByZXR1cm4gY29udChleHByZXNzaW9uLCBjbGFzc0JvZHkpXG4gIH1cbiAgZnVuY3Rpb24gY2xhc3NmaWVsZCAodHlwZSwgdmFsdWUpIHtcbiAgICBpZiAodmFsdWUgPT0gJz8nKSByZXR1cm4gY29udChjbGFzc2ZpZWxkKVxuICAgIGlmICh0eXBlID09ICc6JykgcmV0dXJuIGNvbnQodHlwZWV4cHIsIG1heWJlQXNzaWduKVxuICAgIGlmICh2YWx1ZSA9PSAnPScpIHJldHVybiBjb250KGV4cHJlc3Npb25Ob0NvbW1hKVxuICAgIHJldHVybiBwYXNzKGZ1bmN0aW9uZGVmKVxuICB9XG4gIGZ1bmN0aW9uIGFmdGVyRXhwb3J0ICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnKicpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChtYXliZUZyb20sIGV4cGVjdCgnOycpKSB9XG4gICAgaWYgKHZhbHVlID09ICdkZWZhdWx0JykgeyBjeC5tYXJrZWQgPSAna2V5d29yZCc7IHJldHVybiBjb250KGV4cHJlc3Npb24sIGV4cGVjdCgnOycpKSB9XG4gICAgaWYgKHR5cGUgPT0gJ3snKSByZXR1cm4gY29udChjb21tYXNlcChleHBvcnRGaWVsZCwgJ30nKSwgbWF5YmVGcm9tLCBleHBlY3QoJzsnKSlcbiAgICByZXR1cm4gcGFzcyhzdGF0ZW1lbnQpXG4gIH1cbiAgZnVuY3Rpb24gZXhwb3J0RmllbGQgKHR5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICdhcycpIHsgY3gubWFya2VkID0gJ2tleXdvcmQnOyByZXR1cm4gY29udChleHBlY3QoJ3ZhcmlhYmxlJykpIH1cbiAgICBpZiAodHlwZSA9PSAndmFyaWFibGUnKSByZXR1cm4gcGFzcyhleHByZXNzaW9uTm9Db21tYSwgZXhwb3J0RmllbGQpXG4gIH1cbiAgZnVuY3Rpb24gYWZ0ZXJJbXBvcnQgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnc3RyaW5nJykgcmV0dXJuIGNvbnQoKVxuICAgIHJldHVybiBwYXNzKGltcG9ydFNwZWMsIG1heWJlTW9yZUltcG9ydHMsIG1heWJlRnJvbSlcbiAgfVxuICBmdW5jdGlvbiBpbXBvcnRTcGVjICh0eXBlLCB2YWx1ZSkge1xuICAgIGlmICh0eXBlID09ICd7JykgcmV0dXJuIGNvbnRDb21tYXNlcChpbXBvcnRTcGVjLCAnfScpXG4gICAgaWYgKHR5cGUgPT0gJ3ZhcmlhYmxlJykgcmVnaXN0ZXIodmFsdWUpXG4gICAgaWYgKHZhbHVlID09ICcqJykgY3gubWFya2VkID0gJ2tleXdvcmQnXG4gICAgcmV0dXJuIGNvbnQobWF5YmVBcylcbiAgfVxuICBmdW5jdGlvbiBtYXliZU1vcmVJbXBvcnRzICh0eXBlKSB7XG4gICAgaWYgKHR5cGUgPT0gJywnKSByZXR1cm4gY29udChpbXBvcnRTcGVjLCBtYXliZU1vcmVJbXBvcnRzKVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlQXMgKF90eXBlLCB2YWx1ZSkge1xuICAgIGlmICh2YWx1ZSA9PSAnYXMnKSB7IGN4Lm1hcmtlZCA9ICdrZXl3b3JkJzsgcmV0dXJuIGNvbnQoaW1wb3J0U3BlYykgfVxuICB9XG4gIGZ1bmN0aW9uIG1heWJlRnJvbSAoX3R5cGUsIHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlID09ICdmcm9tJykgeyBjeC5tYXJrZWQgPSAna2V5d29yZCc7IHJldHVybiBjb250KGV4cHJlc3Npb24pIH1cbiAgfVxuICBmdW5jdGlvbiBhcnJheUxpdGVyYWwgKHR5cGUpIHtcbiAgICBpZiAodHlwZSA9PSAnXScpIHJldHVybiBjb250KClcbiAgICByZXR1cm4gcGFzcyhjb21tYXNlcChleHByZXNzaW9uTm9Db21tYSwgJ10nKSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzQ29udGludWVkU3RhdGVtZW50IChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgcmV0dXJuIHN0YXRlLmxhc3RUeXBlID09ICdvcGVyYXRvcicgfHwgc3RhdGUubGFzdFR5cGUgPT0gJywnIHx8XG4gICAgICBpc09wZXJhdG9yQ2hhci50ZXN0KHRleHRBZnRlci5jaGFyQXQoMCkpIHx8XG4gICAgICAvWywuXS8udGVzdCh0ZXh0QWZ0ZXIuY2hhckF0KDApKVxuICB9XG5cbiAgLy8gSW50ZXJmYWNlXG5cbiAgcmV0dXJuIHtcbiAgICBzdGFydFN0YXRlOiBmdW5jdGlvbiAoYmFzZWNvbHVtbikge1xuICAgICAgdmFyIHN0YXRlID0ge1xuICAgICAgICB0b2tlbml6ZTogdG9rZW5CYXNlLFxuICAgICAgICBsYXN0VHlwZTogJ3NvZicsXG4gICAgICAgIGNjOiBbXSxcbiAgICAgICAgbGV4aWNhbDogbmV3IEpTTGV4aWNhbCgoYmFzZWNvbHVtbiB8fCAwKSAtIGluZGVudFVuaXQsIDAsICdibG9jaycsIGZhbHNlKSxcbiAgICAgICAgbG9jYWxWYXJzOiBwYXJzZXJDb25maWcubG9jYWxWYXJzLFxuICAgICAgICBjb250ZXh0OiBwYXJzZXJDb25maWcubG9jYWxWYXJzICYmIHt2YXJzOiBwYXJzZXJDb25maWcubG9jYWxWYXJzfSxcbiAgICAgICAgaW5kZW50ZWQ6IGJhc2Vjb2x1bW4gfHwgMFxuICAgICAgfVxuICAgICAgaWYgKHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzICYmIHR5cGVvZiBwYXJzZXJDb25maWcuZ2xvYmFsVmFycyA9PT0gJ29iamVjdCcpIHsgc3RhdGUuZ2xvYmFsVmFycyA9IHBhcnNlckNvbmZpZy5nbG9iYWxWYXJzIH1cbiAgICAgIHJldHVybiBzdGF0ZVxuICAgIH0sXG5cbiAgICB0b2tlbjogZnVuY3Rpb24gKHN0cmVhbSwgc3RhdGUpIHtcbiAgICAgIGlmIChzdHJlYW0uc29sKCkpIHtcbiAgICAgICAgaWYgKCFzdGF0ZS5sZXhpY2FsLmhhc093blByb3BlcnR5KCdhbGlnbicpKSB7IHN0YXRlLmxleGljYWwuYWxpZ24gPSBmYWxzZSB9XG4gICAgICAgIHN0YXRlLmluZGVudGVkID0gc3RyZWFtLmluZGVudGF0aW9uKClcbiAgICAgICAgZmluZEZhdEFycm93KHN0cmVhbSwgc3RhdGUpXG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5Db21tZW50ICYmIHN0cmVhbS5lYXRTcGFjZSgpKSByZXR1cm4gbnVsbFxuICAgICAgdmFyIHN0eWxlID0gc3RhdGUudG9rZW5pemUoc3RyZWFtLCBzdGF0ZSlcbiAgICAgIGlmICh0eXBlID09ICdjb21tZW50JykgcmV0dXJuIHN0eWxlXG4gICAgICBzdGF0ZS5sYXN0VHlwZSA9IHR5cGUgPT0gJ29wZXJhdG9yJyAmJiAoY29udGVudCA9PSAnKysnIHx8IGNvbnRlbnQgPT0gJy0tJykgPyAnaW5jZGVjJyA6IHR5cGVcbiAgICAgIHJldHVybiBwYXJzZUpTKHN0YXRlLCBzdHlsZSwgdHlwZSwgY29udGVudCwgc3RyZWFtKVxuICAgIH0sXG5cbiAgICBpbmRlbnQ6IGZ1bmN0aW9uIChzdGF0ZSwgdGV4dEFmdGVyKSB7XG4gICAgICBpZiAoc3RhdGUudG9rZW5pemUgPT0gdG9rZW5Db21tZW50KSByZXR1cm4gQ29kZU1pcnJvci5QYXNzXG4gICAgICBpZiAoc3RhdGUudG9rZW5pemUgIT0gdG9rZW5CYXNlKSByZXR1cm4gMFxuICAgICAgdmFyIGZpcnN0Q2hhciA9IHRleHRBZnRlciAmJiB0ZXh0QWZ0ZXIuY2hhckF0KDApLCBsZXhpY2FsID0gc3RhdGUubGV4aWNhbCwgdG9wXG4gICAgICAvLyBLbHVkZ2UgdG8gcHJldmVudCAnbWF5YmVsc2UnIGZyb20gYmxvY2tpbmcgbGV4aWNhbCBzY29wZSBwb3BzXG4gICAgICBpZiAoIS9eXFxzKmVsc2VcXGIvLnRlc3QodGV4dEFmdGVyKSkge1xuICAgICAgICBmb3IgKHZhciBpID0gc3RhdGUuY2MubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICB2YXIgYyA9IHN0YXRlLmNjW2ldXG4gICAgICAgICAgaWYgKGMgPT0gcG9wbGV4KSBsZXhpY2FsID0gbGV4aWNhbC5wcmV2XG4gICAgICAgICAgZWxzZSBpZiAoYyAhPSBtYXliZWVsc2UpIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHdoaWxlICgobGV4aWNhbC50eXBlID09ICdzdGF0JyB8fCBsZXhpY2FsLnR5cGUgPT0gJ2Zvcm0nKSAmJlxuICAgICAgICAgICAgIChmaXJzdENoYXIgPT0gJ30nIHx8ICgodG9wID0gc3RhdGUuY2Nbc3RhdGUuY2MubGVuZ3RoIC0gMV0pICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh0b3AgPT0gbWF5YmVvcGVyYXRvckNvbW1hIHx8IHRvcCA9PSBtYXliZW9wZXJhdG9yTm9Db21tYSkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIS9eWyxcXC49K1xcLSo6P1tcXChdLy50ZXN0KHRleHRBZnRlcikpKSkgeyBsZXhpY2FsID0gbGV4aWNhbC5wcmV2IH1cbiAgICAgIGlmIChzdGF0ZW1lbnRJbmRlbnQgJiYgbGV4aWNhbC50eXBlID09ICcpJyAmJiBsZXhpY2FsLnByZXYudHlwZSA9PSAnc3RhdCcpIHsgbGV4aWNhbCA9IGxleGljYWwucHJldiB9XG4gICAgICB2YXIgdHlwZSA9IGxleGljYWwudHlwZSwgY2xvc2luZyA9IGZpcnN0Q2hhciA9PSB0eXBlXG5cbiAgICAgIGlmICh0eXBlID09ICd2YXJkZWYnKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIChzdGF0ZS5sYXN0VHlwZSA9PSAnb3BlcmF0b3InIHx8IHN0YXRlLmxhc3RUeXBlID09ICcsJyA/IGxleGljYWwuaW5mbyArIDEgOiAwKVxuICAgICAgZWxzZSBpZiAodHlwZSA9PSAnZm9ybScgJiYgZmlyc3RDaGFyID09ICd7JykgcmV0dXJuIGxleGljYWwuaW5kZW50ZWRcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ2Zvcm0nKSByZXR1cm4gbGV4aWNhbC5pbmRlbnRlZCArIGluZGVudFVuaXRcbiAgICAgIGVsc2UgaWYgKHR5cGUgPT0gJ3N0YXQnKSB7IHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGlzQ29udGludWVkU3RhdGVtZW50KHN0YXRlLCB0ZXh0QWZ0ZXIpID8gc3RhdGVtZW50SW5kZW50IHx8IGluZGVudFVuaXQgOiAwKSB9IGVsc2UgaWYgKGxleGljYWwuaW5mbyA9PSAnc3dpdGNoJyAmJiAhY2xvc2luZyAmJiBwYXJzZXJDb25maWcuZG91YmxlSW5kZW50U3dpdGNoICE9IGZhbHNlKSB7IHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKC9eKD86Y2FzZXxkZWZhdWx0KVxcYi8udGVzdCh0ZXh0QWZ0ZXIpID8gaW5kZW50VW5pdCA6IDIgKiBpbmRlbnRVbml0KSB9IGVsc2UgaWYgKGxleGljYWwuYWxpZ24pIHJldHVybiBsZXhpY2FsLmNvbHVtbiArIChjbG9zaW5nID8gMCA6IDEpXG4gICAgICBlbHNlIHJldHVybiBsZXhpY2FsLmluZGVudGVkICsgKGNsb3NpbmcgPyAwIDogaW5kZW50VW5pdClcbiAgICB9LFxuXG4gICAgZWxlY3RyaWNJbnB1dDogL15cXHMqKD86Y2FzZSAuKj86fGRlZmF1bHQ6fFxce3xcXH0pJC8sXG4gICAgYmxvY2tDb21tZW50U3RhcnQ6IGpzb25Nb2RlID8gbnVsbCA6ICcvKicsXG4gICAgYmxvY2tDb21tZW50RW5kOiBqc29uTW9kZSA/IG51bGwgOiAnKi8nLFxuICAgIGxpbmVDb21tZW50OiBqc29uTW9kZSA/IG51bGwgOiAnLy8nLFxuICAgIGZvbGQ6ICdicmFjZScsXG4gICAgY2xvc2VCcmFja2V0czogXCIoKVtde30nJ1xcXCJcXFwiYGBcIixcblxuICAgIGhlbHBlclR5cGU6IGpzb25Nb2RlID8gJ2pzb24nIDogJ2hhaWt1JyxcbiAgICBqc29ubGRNb2RlOiBqc29ubGRNb2RlLFxuICAgIGpzb25Nb2RlOiBqc29uTW9kZSxcblxuICAgIGV4cHJlc3Npb25BbGxvd2VkOiBleHByZXNzaW9uQWxsb3dlZCxcbiAgICBza2lwRXhwcmVzc2lvbjogZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICB2YXIgdG9wID0gc3RhdGUuY2Nbc3RhdGUuY2MubGVuZ3RoIC0gMV1cbiAgICAgIGlmICh0b3AgPT0gZXhwcmVzc2lvbiB8fCB0b3AgPT0gZXhwcmVzc2lvbk5vQ29tbWEpIHN0YXRlLmNjLnBvcCgpXG4gICAgfVxuICB9XG59KVxuXG5Db2RlTWlycm9yLnJlZ2lzdGVySGVscGVyKCd3b3JkQ2hhcnMnLCAnaGFpa3UnLCAvW1xcdyRdLylcblxuQ29kZU1pcnJvci5kZWZpbmVNSU1FKCd0ZXh0L3gtaGFpa3UnLCAnaGFpa3UnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IEhhaWt1TW9kZVxuIl19