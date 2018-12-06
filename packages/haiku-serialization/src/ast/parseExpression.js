const Parser = require('cst').Parser;
const walk = require('estree-walker').walk;
const fsm = require('fuzzy-string-matching');
const uniq = require('lodash').uniq;
const FORBIDDEN_EXPRESSION_TOKENS = require('@haiku/core/lib/HaikuComponent').default.FORBIDDEN_EXPRESSION_TOKENS;
const logger = require('./../utils/LoggerInstance');

const PARSER = new Parser({
  sourceType: 'script',
  strictMode: true,
});

// Thresholds for fuzzy string matches when detecting any of these types of tokens
const MATCH_WEIGHTS = {
  INJECTABLES: 0.5,
  KEYWORDS: 0.5,
  DECLARATIONS: 0.5,
};

function wrap (exprWithourWrap) {
  return '(function(){"use strict";\n' + exprWithourWrap + '\n})';
}

function unwrap (exprWithWrap) {
  return exprWithWrap.slice(26, exprWithWrap.length - 3);
}

function getSegsList (list, node) {
  if (node.type === 'Identifier') {
    list.push(node);
    return list;
  }

  if (node.type === 'MemberExpression') {
    getSegsList(list, node.object);
    list.push(node.property);
    return list;
  }
}

function isTokenStreamInvalid (tokens, options) {
  if (tokens.length < 1) {
    return {
      annotation: 'Expression is has no content',
    };
  }

  if (tokens.length === 1 && tokens[0].type === 'Keyword' && tokens[0].value === 'return') {
    return {
      annotation: 'Expression is incomplete',
    };
  }

  if (options.skipForbiddensCheck) {
    return false;
  }

  let foundReturn = false;
  let foundForbiddenToken = false;
  let otherWarning = false;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const parent = tokens[i - 1];
    const grandparent = tokens[i - 2];

    if (token.type === 'Keyword') {
      if (token.value === 'return') {
        foundReturn = true;
      }
    }

    if (token.type === 'Identifier' || token.type === 'Keyword') {
      if (token.value === 'random') {
        if (parent && parent.value === '.') {
          if (grandparent && grandparent.value === 'Math') {
            otherWarning = 'Instead of Math.random(), use $helpers.rand()';
            break;
          }
        }
      }

      if (token.value === 'now') {
        if (parent && parent.value === '.') {
          if (grandparent && grandparent.value === 'Date') {
            otherWarning = 'Instead of Date.now(), use $helpers.now()';
            break;
          }
        }
      }

      if (FORBIDDEN_EXPRESSION_TOKENS[token.value]) {
        foundForbiddenToken = token;
        break;
      }
    }
  }

  if (otherWarning) {
    return {
      annotation: otherWarning,
    };
  }

  if (foundForbiddenToken) {
    return {
      annotation: foundForbiddenToken.type + ' "' + foundForbiddenToken.value + '" is not allowed in expressions',
    };
  }

  if (!foundReturn) {
    return {
      annotation: 'Expression must have a return statement',
    };
  }

  return false;
}

function smushKeys (out, base, obj, depth, minDepth, maxDepth) {
  for (const key in obj) {
    const sub = (base) ? (base + '.' + key) : key;

    if (depth >= minDepth && depth <= maxDepth) {
      out.push(sub);
    }

    smushKeys(out, sub, obj[key], depth + 1, minDepth, maxDepth);
  }

  return out;
}

function populateCompletions (target, injectables, keywords, declarations) {
  const completions = {};

  const segs = getSegsList([], target);

  const chain = segs.map((identifierNode) => identifierNode.name).join('.');

  // Nothing to do if we have no segments
  if (segs.length < 1) {
    return completions;
  }

  // Only try to match declarations and keywords if we are only dealing with one segment
  if (segs.length === 1) {
    for (const declarationKey in declarations) {
      if (fsm(segs[0].name, declarationKey) > MATCH_WEIGHTS.DECLARATIONS) {
        completions[declarationKey] = true;
      }
    }

    for (const keywordKey in keywords) {
      if (!FORBIDDEN_EXPRESSION_TOKENS[keywordKey]) {
        if (fsm(segs[0].name, keywordKey) > MATCH_WEIGHTS.KEYWORDS) {
          completions[keywordKey] = true;
        }
      }
    }
  }

  const found = {};
  findMatches(found, segs, 0, injectables);

  const smush = smushKeys([], null, found, 0, segs.length - 1, segs.length);
  for (let i = 0; i < smush.length; i++) {
    completions[smush[i]] = true;
  }

  // Strip out any exact matches, leaving only remainders
  if (completions[chain]) {
    delete completions[chain];
  }

  // // Strip out any completions that are 'below' the current completion,
  // // but preserve those that are 'above' so we can reveal new possibilities
  // for (var completionString in completions) {
  //   if (completionString.split('.').length < segs.length) {
  //     delete completions[completionString]
  //   }
  // }

  // // If there's only one key here and we have a match, then there's nothing to complete
  // if (Object.keys(completions).length < 2 && completions[chain]) {
  //   return {}
  // }

  return completions;
}

function findMatches (found, segs, idx, base) {
  if (Array.isArray(base)) {
    return found;
  }
  if (!base || typeof base !== 'object') {
    return found;
  }

  const name = segs[idx] && segs[idx].name;
  const prev = segs[idx - 1] && segs[idx - 1].name;

  if (!name && !prev) {
    return found;
  }

  // The user has probably typed a _full_ completion, but we need to check for sub-objects to recommend those
  if (!name && prev) {
    for (const k4 in base) {
      if (!found[k4]) {
        found[k4] = {};
      }
    }

    return found;
  }

  if (!name) {
    return found;
  }

  // Special case: Just display all injectable roots
  if (name === '$') {
    for (const k1 in base) {
      if (k1[0] === '$') {
        if (!found[k1]) {
          found[k1] = {};
        }
      }
    }

    return found;
  }

  // Special case: If under three characters, search on those chars
  if (name.length < 5) {
    const lcname = name.toLowerCase();

    for (const k2 in base) {
      if (k2.slice(0, lcname.length).toLowerCase() === lcname) {
        if (!found[k2]) {
          found[k2] = {};
        }

        findMatches(found[k2], segs, idx + 1, base[k2]);
      }
    }

    return found;
  }

  for (const k3 in base) {
    if (fsm(name, k3) < MATCH_WEIGHTS.INJECTABLES) {
      continue;
    }

    if (!found[k3]) {
      found[k3] = {};
    }

    findMatches(found[k3], segs, idx + 1, base[k3]);
  }

  return found;
}

function dataizeCompletion (completion) {
  return {name: completion};
}

function chooseTarget (candidate, existing) {
  if (!existing) {
    return candidate;
  }

  if (existing.type === 'Identifier' && candidate.type === 'MemberExpression') {
    return candidate;
  }

  if (existing.type === 'MemberExpression' && candidate.type === 'Identifier') {
    return existing;
  }

  return candidate;
}

/**
 * @function parseExpression
 * @description Given an expression string, parse it and return a summary about it, including
 * tokens, params, as well as any warnings/errors that need to be displayed to the coder.
 */
function parseExpression (expr, injectables, keywords, state, cursor, options) {
  if (!options) {
    options = {};
  }

  try {
    // At any point in the process here we may want to populate a warning based on what happens
    const warnings = [];

    const cst = PARSER._parseAst(expr);

    let tokens = PARSER._processTokens(cst, expr);
    tokens = tokens.slice(8); // Slice off the "(function(){"use strict";\n" tokens
    tokens.splice(tokens.length - 4); // Slice off the "})\n\eof" tokens

    const candidates = []; // Going to find possible targets and select the best fit

    // 1. Get a list of all variables that were declared inside the scope of this expression
    // TODO: What other besides var, let, const, and const { a } = {...} is there?
    const declarations = {};

    // 2. Create a list of identifiers that look like references to external things, i.e., anything
    // not defined inside our scope, possibly a keyword or an 'injectable' the user wants to summon.
    const references = [];

    walk(cst, {
      enter: function enter (node) {
        if (cursor) { // If no cursor, nothing to do
          if (!node.sourceCode && node.loc) { // If no node location, nothing to do; also skip 'Tokens' which have .sourceCode
            if (node.loc.start.line === node.loc.end.line) { // Only identifiers on the same line (not braces)
              if (node.loc.start.line === cursor.line) { // Only on the same line as the cursor
                if (node.loc.start.column <= cursor.ch && node.loc.end.column >= cursor.ch) {
                  if (node.type === 'MemberExpression' || node.type === 'Identifier') {
                    candidates.push(node);
                  }
                }
              }
            }
          }
        }

        if (node.type === 'VariableDeclaration') {
          for (let i = 0; i < node.declarations.length; i++) {
            const declarator = node.declarations[i];
            if (declarator.id.type === 'Identifier') {
              declarations[declarator.id.name] = true;
            } else if (declarator.id.type === 'ObjectPattern') {
              for (let j = 0; j < declarator.id.properties.length; j++) {
                declarations[declarator.id.properties[j].key.name] = true;
              }
            }
          }
        }

        // We check for node.name since estree-walker provides duplicates from the token stream
        // as well as the tree, and we use only the tree nodes
        if (node.type === 'Identifier' && node.name) {
          references.push(node);
        }
      },
    });

    // The node representing the current placement of the cursor, if any
    let target = null;
    // Loop through the candidates and find the one that is the best fit for a target
    for (let i = 0; i < candidates.length; i++) {
      target = chooseTarget(candidates[i], target);
    }

    // Now strip away any references that refer to any declarations that were made in scope
    for (let j = references.length - 1; j > -1; j--) {
      const reference = references[j];
      if (declarations[reference.name]) {
        references.splice(j, 1);
      }
    }

    let params = [];
    if (references.length > 0) {
      references.forEach((reference) => {
        // If this seg was the first element, and if it matches a forbidden
        // token, then don't include this in the list of injectables
        if (FORBIDDEN_EXPRESSION_TOKENS[reference.name]) {
          return null;
        }
        // Don't include any reference in the final params if it doesn't match
        // a known injectable that core can provide
        if (!injectables[reference.name]) {
          return null;
        }
        params.push(reference.name);
      });
    }
    params = uniq(params);

    // Completions is initially populated as a dict so we avoid having double entries in the list
    let completions;
    // If we got a target node that is an identifier, we can display autocompletions for it, if any match
    if (target && (target.type === 'Identifier' || target.type === 'MemberExpression')) {
      completions = populateCompletions(target, injectables, keywords, declarations);
    } else {
      completions = {};
    }

    completions = Object.keys(completions).map(dataizeCompletion);

    const tokenInvalidity = isTokenStreamInvalid(tokens, options);
    if (tokenInvalidity) {
      warnings.push(tokenInvalidity);
    }

    return {
      cst,
      tokens,
      declarations,
      references,
      params,
      warnings,
      completions,
      target,
      source: expr,
    };
  } catch (error) {
    logger.warn('[parse expression]', error.message);
    return {
      error,
    };
  }
}

// Must expose for Timeline <ExpressionInput> component
parseExpression.wrap = wrap;
parseExpression.unwrap = unwrap;

module.exports = parseExpression;
