const DOMSchema = require('@haiku/player/lib/properties/dom/schema').default
const DOMFallbacks = require('@haiku/player/lib/properties/dom/fallbacks').default

const ALLOWED_PROPS_BY_NAME = require('./../element/AllowedPropsByName')
const DOM_CLUSTERED_PROPS = require('./../element/DomClusteredProps')
const DOM_CLUSTER_NAMES = require('./../element/DomClusterNames')

module.exports = function _assignDOMSchemaProperties (out, elementName) {
  const schema = DOMSchema[elementName]
  const fallbacks = DOMFallbacks[elementName]

  for (const name in schema) {
    let propertyGroup = null

    let nameParts = name.split('.')

    // HACK, but not sure what we can do that's better
    if (name === 'style.overflowX') nameParts = ['overflow', 'x']
    if (name === 'style.overflowY') nameParts = ['overflow', 'y']

    if (ALLOWED_PROPS_BY_NAME[elementName] && ALLOWED_PROPS_BY_NAME[elementName][name]) {
      propertyGroup = {
        name: name,
        prefix: nameParts[0],
        suffix: nameParts[1],
        fallback: fallbacks[name],
        typedef: schema[name]
      }
    }

    // If we successfully created a property group, push it onto the list
    if (propertyGroup) {
      let clusterPrefix = DOM_CLUSTERED_PROPS[propertyGroup.name]

      // Check if we are dealing with a special cluster like <rect>.foo
      if (!clusterPrefix) {
        clusterPrefix = DOM_CLUSTERED_PROPS[`<${elementName}>.${name}`]
      }

      if (clusterPrefix) {
        propertyGroup.cluster = {
          prefix: clusterPrefix,
          name: DOM_CLUSTER_NAMES[clusterPrefix]
        }
      }

      out[name] = propertyGroup
    }
  }
}
