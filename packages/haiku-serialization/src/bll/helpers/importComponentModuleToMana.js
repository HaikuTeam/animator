const overrideModulesLoaded = require('./../../utils/overrideModulesLoaded')
const getHaikuKnownImportMatch = require('./getHaikuKnownImportMatch')

module.exports = function _importComponentModuleToMana (modulePath, identifierName) {
  return overrideModulesLoaded((stop) => {
    let componentModule
    try {
      componentModule = require(modulePath)
      stop()
    } catch (exception) {
      console.warn('[file] Module ' + modulePath + ' could not be loaded (' + exception + ')')
      return null // What should we do if we can't load the module?
    }

    componentModule.__module = modulePath
    componentModule.__reference = identifierName

    return {
      elementName: componentModule,
      attributes: { source: modulePath, 'haiku-title': identifierName },
      children: []
    }
  }, getHaikuKnownImportMatch)
}
