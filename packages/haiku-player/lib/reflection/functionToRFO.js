"use strict";
exports.__esModule = true;
var REGEXPS = [
    { type: 'whitespace', re: /^[\s]+/ },
    { type: 'paren_open', re: /^\(/ },
    { type: 'paren_close', re: /^\)/ },
    { type: 'square_open', re: /^\[/ },
    { type: 'square_close', re: /^]/ },
    { type: 'curly_open', re: /^\{/ },
    { type: 'curly_close', re: /^\}/ },
    { type: 'rest', re: /^\.\.\./ },
    { type: 'colon', re: /^:/ },
    { type: 'comma', re: /^,/ },
    { type: 'identifier', re: /^[a-zA-Z0-9_$]+/ },
];
function nth(n, type, arr) {
    var none = { value: null, type: 'void' };
    if (arr.length < 1 || n > arr.length) {
        return none;
    }
    var f = 0;
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].type === type) {
            f += 1;
        }
        if (f === n) {
            return arr[i];
        }
    }
    return none;
}
function tokenize(source) {
    var tokens = [];
    var chunk = source;
    var total = chunk.length;
    var iterations = 0;
    while (chunk.length > 0) {
        for (var i = 0; i < REGEXPS.length; i++) {
            var regexp = REGEXPS[i];
            var match = regexp.re.exec(chunk);
            if (match) {
                var value = match[0];
                tokens.push({ value: value, type: regexp.type });
                chunk = chunk.slice(match[0].length, chunk.length);
                break;
            }
        }
        if (iterations++ > total) {
            throw new Error('Unable to tokenize expression');
        }
    }
    return tokens;
}
function tokensToParams(tokens) {
    if (tokens.length < 1) {
        return [];
    }
    var json = '';
    var frag = '';
    var next;
    var token = tokens.shift();
    var scopes = [];
    while (token) {
        switch (token.type) {
            case 'whitespace':
                frag = ' ';
                break;
            case 'comma':
                frag = ',';
                break;
            case 'colon':
                frag = ':';
                break;
            case 'paren_open':
                frag = '[';
                scopes.push('square');
                break;
            case 'paren_close':
                frag = ']';
                scopes.pop();
                break;
            case 'square_open':
                frag = '[';
                scopes.push('square');
                break;
            case 'square_close':
                frag = ']';
                scopes.pop();
                break;
            case 'curly_open':
                frag = '{';
                scopes.push('curly');
                break;
            case 'curly_close':
                frag = '}';
                scopes.pop();
                break;
            case 'rest':
                next = tokens.shift();
                frag = JSON.stringify({ __rest: next.value });
                break;
            case 'identifier':
                frag = '"' + token.value + '"';
                if (tokens[0] &&
                    (tokens[0].type === 'comma' ||
                        tokens[0].type === 'square_close' ||
                        tokens[0].type === 'curly_close')) {
                    var scope = scopes[scopes.length - 1];
                    if (scope === 'square') {
                        frag += '';
                    }
                    else {
                        frag += ':"' + token.value + '"';
                    }
                }
                break;
            default:
                frag = '';
        }
        json += frag;
        token = tokens.shift();
    }
    return JSON.parse(json);
}
function signatureToParams(signature) {
    var tokens = tokenize(signature);
    var clean = [];
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type !== 'whitespace') {
            clean.push(tokens[i]);
        }
    }
    return tokensToParams(clean);
}
function functionToRFO(fn) {
    var str = fn.toString();
    if (str[str.length - 1] === ')') {
        if (str[0] === '(') {
            str = str.slice(1);
        }
    }
    var pidx1 = str.indexOf('(');
    var pidx2 = str.indexOf(')');
    var prefix = str.slice(0, pidx1);
    var signature = str.slice(pidx1, pidx2 + 1);
    var suffix = str.slice(pidx2 + 1, str.length);
    var body = suffix.slice(suffix.indexOf('{') + 1, suffix.length - 1).trim();
    var type = suffix.match(/^\s*=>\s*{/)
        ? 'ArrowFunctionExpression'
        : 'FunctionExpression';
    var name = nth(2, 'identifier', tokenize(prefix)).value;
    var params = signatureToParams(signature);
    var spec = {
        type: type,
        name: name,
        params: params,
        body: body
    };
    return {
        __function: spec
    };
}
exports["default"] = functionToRFO;
//# sourceMappingURL=functionToRFO.js.map