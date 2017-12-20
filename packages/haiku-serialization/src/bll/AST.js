const fse = require('haiku-fs-extra')
const prettier = require('prettier')
const BaseModel = require('./BaseModel')
const objectToRO = require('@haiku/player/lib/reflection/objectToRO').default
const bytecodeObjectToAST = require('./../ast/bytecodeObjectToAST')
const parseCode = require('./../ast/parseCode')
const generateCode = require('./../ast/generateCode')

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
    // Grab imports before we strip off the __module property
    const imports = AST.findImportsFromTemplate(bytecode.template)
    const safe = AST.safeBytecode(bytecode)
    const ro = objectToRO(safe)
    const ast = bytecodeObjectToAST(ro, imports)
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

AST.findImportsFromTemplate = (template) => {
  // We'll build a mapping from source path to identifier name
  const imports = {}
  // This assumes that the module paths have been normalized and relativized
  Template.visit(template, (node) => {
    if (node && node.elementName && typeof node.elementName === 'object' && node.elementName.__module) {
      // See Mod.prototype.moduleAsMana to understand how this gets setup
      const modpath = node.elementName.__module
      const identifier = node.elementName.__reference
      imports[modpath] = identifier
    }
  })
  return imports
}

AST.safeBytecode = (bytecode) => {
  const safe = {}
  // We're dealing with a chunk of bytecode that has been rendered, so we need to fix
  // the template object which has been mutated, and return it to its serializable form
  for (const key in bytecode) {
    if (key === 'template') safe[key] = Template.manaWithOnlyStandardProps(bytecode[key])
    else safe[key] = bytecode[key]
  }
  return safe
}

AST.mutateWith = (abspath, fn) => {
  try {
    const str = fse.readFileSync(abspath).toString()
    const ast = parseCode(str)
    fn(ast)
    const code = generateCode(ast)
    const formatted = prettier.format(code)
    fse.outputFileSync(abspath, formatted)
    return void (0)
  } catch (exception) {
    console.warn('[file] Could not provide AST for ' + abspath + '; ' + exception)
    return void (0)
  }
}

AST.parseFile = (folder, relpath, contents, cb) => {
  let ast = parseCode(contents)
  if (ast instanceof Error) return cb(ast)
  else return cb(null, ast)
}

module.exports = AST

// Down here to avoid Node circular dependency stub objects. #FIXME
const Template = require('./Template')
