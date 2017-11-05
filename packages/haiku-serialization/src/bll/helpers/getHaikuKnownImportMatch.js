var path = require('path')

// When building a distribution (see 'distro' repo) the node_modules folder is at a different level #FIXME matthew
var rootdir
if (typeof process !== 'undefined' && process && process.env && process.env.HAIKU_INTERPRETER_URL_MODE === 'distro') {
  rootdir = path.join(__dirname, '..', '..', '..', '..', '..')
} else {
  rootdir = path.join(__dirname, '..', '..', '..')
}

var NODE_MODULES_PATH = path.join(rootdir, 'node_modules')
var replacements = {
  // legacy name (global npm)
  'haiku.ai/player/dom': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  'haiku.ai/player/dom/index': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  'haiku.ai/player/dom/react': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom', 'react'),
  // new name (haiku org npm)
  '@haiku/player': path.join(NODE_MODULES_PATH, '@haiku', 'player'),
  '@haiku/player/dom': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  '@haiku/player/dom/index': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom'),
  '@haiku/player/dom/react': path.join(NODE_MODULES_PATH, '@haiku', 'player', 'dom', 'react')
}

var CANONICAL_PLAYER_SOURCE_CODE_PATH = path.join(NODE_MODULES_PATH, '@haiku', 'player')

/**
 * @function getHaikuKnownImportMatch
 * @description Convert a known import path to an application local installation
 */
function getHaikuKnownImportMatch (importPath) {
  var normalizedPath = importPath.trim().toLowerCase()
  if (normalizedPath in replacements) return replacements[normalizedPath]

  // not a good general solution, but good enough for player components
  return importPath.replace(/^@haiku\/player/, replacements['@haiku/player'])
}

getHaikuKnownImportMatch.CANONICAL_PLAYER_SOURCE_CODE_PATH = CANONICAL_PLAYER_SOURCE_CODE_PATH

module.exports = getHaikuKnownImportMatch
