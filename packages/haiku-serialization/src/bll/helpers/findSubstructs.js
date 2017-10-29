const Aspects = require('haiku-bytecode/src/Aspects')
const _makeSubstruct = require('./makeSubstruct')
const getNormalizedComponentModulePath = require('./getNormalizedComponentModulePath')
const _importComponentModuleToMana = require('./importComponentModuleToMana')
const traverseAST = require('./../../ast/traverseAST')
const getObjectPropertyKey = require('./../../ast/getObjectPropertyKey')
const reifyOAST = require('./../../ast/reifyOAST')

const TEMPLATE_KEY_NAME = 'template'

function _findSubstructs (ast, relpath) {
  let builtSubstructs = []
  let imports = {}

  traverseAST(ast, function _visitor (node) {
    let foundSubstruct

    if (node.type === 'AssignmentExpression') {
      // module.exports = {BYTECODE}
      if (node.left && node.left.type === 'MemberExpression') {
        if (node.left.object.name === 'module' && node.left.property.name === 'exports') {
          if (node.right && node.right.type === 'ObjectExpression') {
            foundSubstruct = _makeSubstruct(node.right)
          }
        }
      } else if (node.left && node.left.type === 'Identifier') {
        // exports = {BYTECODE}
        if (node.left.name === 'exports') {
          if (node.right && node.right.type === 'ObjectExpression') {
            foundSubstruct = _makeSubstruct(node.right)
          }
        }
      }
    } else if (node.type === 'ExportDefaultDeclaration') {
      // export default {BYTECODE}
      if (node.declaration.type === 'ObjectExpression') {
        foundSubstruct = _makeSubstruct(node.declaration)
      }
    } else if (node.type === 'VariableDeclaration') {
      // let Ident = require('module')
      if (node.declarations.length === 1) {
        let decl = node.declarations[0]
        if (decl.id.type === 'Identifier' && decl.init &&
            decl.init.type === 'CallExpression' && decl.init.callee.name === 'require') {
          let filepath = decl.init.arguments[0].value
          let modulepath = getNormalizedComponentModulePath(filepath, relpath)
          if (modulepath) {
            imports[decl.id.name] = modulepath
          }
        }
      }
    }

    // TODO: JSON/YAML/XML files?

    if (foundSubstruct) {
      builtSubstructs.push(foundSubstruct)

      for (let i = 0; i < foundSubstruct.objectExpression.properties.length; i++) {
        let property = foundSubstruct.objectExpression.properties[i]
        let key = getObjectPropertyKey(property)
        if ((key in Aspects)) {
          foundSubstruct.aspects[key] = property.value
        } else if (key === TEMPLATE_KEY_NAME) {
          foundSubstruct.template = property.value
        }
      }
    }
  })

  // The 'substruct' should constitute the equivalent of what the bytecode would look
  // like when loaded by the player, so we need to make sure functions get reified too
  let skipFunctionReification = false
  let refEvaluator = (identifierName) => {
    if (identifierName in imports) {
      return _importComponentModuleToMana(imports[identifierName], identifierName).elementName
    }
  }

  for (let k = 0; k < builtSubstructs.length; k++) {
    let builtNode = builtSubstructs[k]
    for (let aspectName in builtNode.aspects) {
      let aspectNode = builtNode.aspects[aspectName]
      builtNode.bytecode[aspectName] = reifyOAST(aspectNode, refEvaluator, skipFunctionReification)
    }
    if (builtNode.template) {
      builtNode.bytecode.template = reifyOAST(builtNode.template, refEvaluator, skipFunctionReification)
    }
  }

  return builtSubstructs
}

module.exports = _findSubstructs
