const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

function _manaWithOnlyStandardProps (mana) {
  if (mana && typeof mana === 'object') {
    var out = {}
    out.elementName = mana.elementName
    if (typeof mana.elementName === 'object') {
      out.elementName = {
        __module: mana.attributes.source
      }
    }

    if (mana.attributes) {
      out.attributes = {}
      out.attributes.source = mana.attributes.source
      out.attributes[HAIKU_ID_ATTRIBUTE] = mana.attributes[HAIKU_ID_ATTRIBUTE]
      out.attributes[HAIKU_TITLE_ATTRIBUTE] = mana.attributes[HAIKU_TITLE_ATTRIBUTE]
    }
    out.children = mana.children && mana.children.map(_manaWithOnlyStandardProps)
    return out
  } else if (typeof mana === 'string') {
    return mana
  }
}

module.exports = _manaWithOnlyStandardProps
