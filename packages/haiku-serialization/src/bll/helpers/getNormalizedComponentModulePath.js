var path = require('path')

/**
 * @function getNormalizedComponentModulePath
 * @description Given a path to something on the file system, determine if it is a path to what
 * seems to be a Haiku component module, and return the normalized string path (with respect to
 * our directory) if so. Otherwise, return null to indicate it is not a component module path,
 * or that that path is not accessible from where we are.
 */
module.exports = function getNormalizedComponentModulePath (theirpath, ourdir) {
  var extname = path.extname(theirpath)

  // As a baseline, a reference to anything other than a folder or .js file won't work
  if (extname !== '' && extname !== '.js') {
    return null
  }

  // Explode into the individual parts, e.g. foo/bar/baz -> [foo,bar,baz]
  var parts = theirpath.split(path.sep)

  // For now, we'll only assume that published Haikus are allowed to instantiate, no unpublished components yet
  if (parts[0] !== '@haiku') {
    return null
  }

  // May as well affirm that  we got at least a reasonably well-formed path...
  if (!parts[1] || !parts[2]) {
    console.warn('[haiku-serialization] File saw malformed component module path', parts.join(path.sep))
    return null
  }

  // We'll go backwards from the top and populate any "implied" parts of the path for convenience
  // @haiku/MyTeam/MyComponent -> @haiku/MyTeam/MyComponent/code/main/code
  // @haiku/MyTeam/MyComponent/code -> @haiku/MyTeam/MyComponent/code/main/code
  // @haiku/MyTeam/MyComponent/code/main -> @haiku/MyTeam/MyComponent/code/main/code
  if (parts[1] === 'player' && parts[2] === 'components') { // A built-in module
    if (parts[7]) {
      console.warn('[haiku-serialization] File saw malformed component module path', parts.join(path.sep))
      return null
    }
    if (parts[6] !== 'code') parts[6] = 'code'
    if (parts[5] !== 'main') parts[5] = 'main'
    if (parts[4] !== 'code') parts[4] = 'code'
  } else { // An installed module
    // @haiku/player/components/Path -> @haiku/player/components/Path/code/main/code
    if (parts[6]) {
      console.warn('[haiku-serialization] File saw malformed component module path', parts.join(path.sep))
      return null
    }
    if (parts[5] !== 'code') parts[5] = 'code'
    if (parts[4] !== 'main') parts[4] = 'main'
    if (parts[3] !== 'code') parts[3] = 'code'
  }

  return parts.join(path.sep)
}
