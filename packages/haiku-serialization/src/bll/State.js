const camelcase = require('camelcase')
const ReservedWords = require('@haiku/player/lib/reflection/ReservedWords').default
const BaseModel = require('./BaseModel')

/**
 * @class State
 * @description
 *.  Collection of static class methods for logic related to states.
 */
class State extends BaseModel {}

State.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(State)

function nextAvailableWordIfReserved (word) {
  if (ReservedWords.isReserved(word)) {
    return nextAvailableWordIfReserved(`_${word}`)
  }

  return word
}

State.buildStateNameFromElementPropertyName = function buildStateNameFromElementPropertyName (n, states, elementNode, propertyName, originalName) {
  let stateName = originalName

  const elementName = elementNode && elementNode.elementName

  if (!stateName) {
    if (elementName === 'path' && propertyName === 'd') {
      stateName = 'pathInstructions'
    }
  }

  if (!stateName) {
    stateName = camelcase(propertyName)
  }

  stateName = `${stateName.split(/\W+/g).join('_')}${(n && `_${n}`) || ''}`

  // Some state names may match JavaScript reserved words like in="", which
  // will result in syntax errors when injected into expressions
  stateName = nextAvailableWordIfReserved(stateName)

  if (!states[stateName]) {
    return stateName
  }

  return State.buildStateNameFromElementPropertyName(n + 1, states, elementNode, propertyName, originalName)
}

/**
 * @method areStatesEquivalent
 * @description Determines whether two state objects have the same properties
 * @returns {Boolean}
 */
State.areStatesEquivalent = function areStatesEquivalent (s1, s2) {
  if (!s1 && !s2) return true
  if (s1 && !s2) return false
  if (!s1 && s2) return false
  for (const k1 in s1) {
    if (s2[k1] === undefined) return false
  }
  for (const k2 in s2) {
    if (s1[k2] === undefined) return false
  }
  return true
}

module.exports = State
