const path = require('path')
const snakecase = require('snake-case')
const BaseModel = require('./BaseModel')

/**
 * @class Design
 * @description
 *.  Collection of static class methods for design-related logic.
 */
class Design extends BaseModel {}

Design.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Design)

/**
 * @method designSourceToIdentifierName
 * @description Given the relpath to some source of 'mana' data (which may be a
 * SVG file), return an identifier name that can work in code and as the name for
 * a destination folder for its component
 * @return {String} The identifier, like foo_bar_svg
 */
Design.designSourceToIdentifierName = (relpath) => {
  return snakecase(relpath)
}

Design.designSourceToCodeSource = (relpath) => {
  const identifier = Design.designSourceToIdentifierName(relpath)
  return path.join('code', identifier, 'code.js')
}

/**
 * @method designAsCode
 * @description Given a relpath to a design asset (SVG only for now), convert that
 * design asset into a bytecode object (in-memory).
 * @param relpath {String} Path to the design element
 * @param cb {Function}
 */
Design.designAsCode = (folder, relpath, options = {}, cb) => {
  // Note that readMana runs the contents through svgo
  return File.readMana(folder, relpath, (err, mana) => {
    if (err) return cb(err)
    return Design.manaAsCode(relpath, mana, options, cb)
  })
}

Design.manaAsCode = (relpath, mana, options = {}, cb) => {
  const identifier = Design.designSourceToIdentifierName(relpath)
  const modpath = ModuleWrapper.identifierToLocalModpath(identifier)
  Template.fixManaSourceAttribute(mana, relpath) // Adds source="relpath_to_file_from_project_root"
  const bytecode = Template.manaToDynamicBytecode(mana, identifier, modpath, options)
  return cb(null, identifier, modpath, bytecode)
}

module.exports = Design

// Down here to avoid Node circular dependency stub objects. #FIXME
const File = require('./File')
const ModuleWrapper = require('./ModuleWrapper')
const Template = require('./Template')
