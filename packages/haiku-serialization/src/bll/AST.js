const prettier = require('prettier')
const BaseModel = require('./BaseModel')
const objectToRO = require('@haiku/core/lib/reflection/objectToRO').default
const bytecodeObjectToAST = require('./../ast/bytecodeObjectToAST')
const normalizeBytecodeAST = require('./../ast/normalizeBytecodeAST')
const parseCode = require('./../ast/parseCode')
const generateCode = require('./../ast/generateCode')

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source'
const HAIKU_VAR_ATTRIBUTE = 'haiku-var'

/**
 * @class AST
 * @description
 *.  Holds a copy of a File's AST in memory and makes manipulation calls
 *.  more convenient. Includes static helper methods for AST manpulation.
 */
class AST extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    // To contain the actual AST object from our associated file
    this.obj = {}
  }

  updateWithBytecode (bytecode) {
    // Grab imports before we strip the __reference property
    const imports = AST.findImportsFromTemplate(this.file, bytecode.template)

    const ro = AST.normalizeBytecode(bytecode)

    const ast = bytecodeObjectToAST(ro, imports)

    normalizeBytecodeAST(ast)

    // Merge instead of replacing wholesale in case we have any pointers
    for (const k1 in this.obj) delete this.obj[k1]
    for (const k2 in ast) this.obj[k2] = ast[k2]

    return this.obj
  }

  updateWithBytecodeAndReturnCode (bytecode) {
    this.updateWithBytecode(bytecode)
    return this.toCode()
  }

  toCode () {
    return prettier.format(generateCode(this.obj))
  }
}

AST.DEFAULT_OPTIONS = {
  required: {
    file: true
  }
}

BaseModel.extend(AST)

AST.normalizeBytecode = (bytecode) => {
  const safe = AST.safeBytecode(bytecode)

  const decycled = Bytecode.decycle(safe, {doCleanMana: false})

  // Strip off `__max` and other cruft editor/core may have added
  Bytecode.cleanBytecode(decycled)
  Template.cleanTemplate(decycled.template)

  return objectToRO(decycled)
}

AST.findImportsFromTemplate = (hostfile, template) => {
  // We'll build a mapping from source path to identifier name
  const imports = {}

  // This assumes that the module paths have been normalized and relativized
  Template.visitWithoutDescendingIntoSubcomponents(template, (node, parent, index, depth, address) => {
    if (node && node.elementName && typeof node.elementName === 'object') {
      let source
      let identifier

      // If we're loading from in-memory then this should be present
      if (node.elementName.__reference) {
        const reference = ModuleWrapper.parseReference(node.elementName.__reference)
        if (reference) {
          source = reference.source
          identifier = reference.identifier
        }
      } else {
        // But if we just reloaded from disk via require, it'll be the bytecode object
        // and we have to do a bit of hackery in case the element was a primitive
        source = node.attributes && node.attributes[HAIKU_SOURCE_ATTRIBUTE]
        identifier = node.attributes && node.attributes[HAIKU_VAR_ATTRIBUTE]
      }

      if (source && identifier) {
        // In case these weren't set (see above), set them so downstream codegen works :/
        node.elementName.__reference = ModuleWrapper.buildReference(
          ModuleWrapper.REF_TYPES.COMPONENT, // type
          Template.normalizePath(`./${hostfile.relpath}`), // host
          Template.normalizePathOfPossiblyExternalModule(source),
          identifier
        )

        // While the source string we store as an attribute is always with respect to the project
        // folder, the actual import path we need to write to the file is relative to this module
        const importSourcePath = hostfile.getImportPathTo(source)

        imports[importSourcePath] = identifier
      }
    }
  })

  return imports
}

AST.safeBytecode = (bytecode) => {
  const safe = {}
  // We're dealing with a chunk of bytecode that has been rendered, so we need to fix
  // the template object which has been mutated, and return it to its serializable form
  for (const key in bytecode) {
    if (key === 'template') {
      safe[key] = Template.manaWithOnlyStandardProps(bytecode[key], true, (__reference) => {
        const ref = ModuleWrapper.parseReference(__reference)

        if (ref && ref.identifier) {
          return ref.identifier
        }

        return __reference
      })
    } else {
      safe[key] = bytecode[key]
    }
  }
  return safe
}

AST.parseFile = (folder, relpath, contents, cb) => {
  let ast = parseCode(contents)
  if (ast instanceof Error) return cb(ast)
  else return cb(null, ast)
}

module.exports = AST

// Down here to avoid Node circular dependency stub objects. #FIXME
const Bytecode = require('./Bytecode')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')
