const lodash = require('lodash')
const assign = require('lodash.assign')
const BaseModel = require('./BaseModel')
const bytecodeObjectToAST = require('./../ast/bytecodeObjectToAST')
const normalizeBytecodeFile = require('./../ast/normalizeBytecodeFile')
const generateCode = require('./../ast/generateCode')
const formatStandardSync = require('./../formatter/formatStandardSync')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'

/**
 * @class Bytecode
 * @description
 *.  Collection of static class methods for bytecode manipulation.
 */
class Bytecode extends BaseModel {}

Bytecode.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Bytecode)

/**
 * @method bytecodeToCode
 * @description Given a bytecode object, convert it to its respective code string
 * @param bytecode {Object} A bytecode object (maybe reified or serialized)
 */
Bytecode.bytecodeToCode = (bytecode) => {
  Bytecode.cleanBytecode(bytecode)
  Template.cleanTemplate(bytecode.template)
  const ast = bytecodeObjectToAST(bytecode)
  normalizeBytecodeFile(ast)
  const code = formatStandardSync(generateCode(ast))
  return code
}

/**
 * @method areBytecodesIsomorphic
 * @description Determine whether two bytecode objects are isomorphic, i.e.
 * effectively represent the same scene graph structure and addressable properties.
 * @returns {Boolean}
 */
Bytecode.areBytecodesIsomorphic = (b1, b2) => {
  const areStates = State.areStatesEquivalent(b1.states, b2.states)
  const areTemplates = Template.areTemplatesEquivalent(b1.template, b2.template)
  return areStates && areTemplates
}

Bytecode.cleanBytecode = (bytecode) => {
  const elementsByHaikuId = Template.getAllElementsByHaikuId(bytecode.template)

  for (const timelineName in bytecode.timelines) {
    const timelineObject = bytecode.timelines[timelineName]
    for (const timelineSelector in timelineObject) {
      if (Template.isHaikuIdSelector(timelineSelector)) {
        const hid = Template.haikuSelectorToHaikuId(timelineSelector)
        if (!elementsByHaikuId[hid]) delete timelineObject[timelineSelector]
      } else {
        // Any property like __max or __depth is runtime-only and needs to be stripped
        if (timelineSelector[0] === '_' && timelineSelector[1] === '_') {
          delete timelineObject[timelineSelector]
        }
      }
    }
  }

  if (bytecode.eventHandlers) {
    for (const eventSelector in bytecode.eventHandlers) {
      if (Template.isHaikuIdSelector(eventSelector)) {
        const hid = Template.haikuSelectorToHaikuId(eventSelector)
        if (!elementsByHaikuId[hid]) {
          delete bytecode.eventHandlers[eventSelector]
        }
      }
    }
  }
}

Bytecode.getAppliedStatesForNode = (out, bytecode, element) => {
  Template.visit(element, (node) => {
    for (const stateName in bytecode.states) {
      // Is it possible for us to detect which states are actually in use by this node?
      // If so, TODO: perhaps only include those applicable states
      const stateDescriptor = bytecode.states[stateName]
      out[stateName] = lodash.clone(stateDescriptor)
    }
  })
  return out
}

Bytecode.getAppliedTimelinesForNode = (out, bytecode, element) => {
  Template.visit(element, (node) => {
    for (const timelineName in bytecode.timelines) {
      for (const timelineSelector in bytecode.timelines[timelineName]) {
        const haikuId = Template.haikuSelectorToHaikuId(timelineSelector)
        if (node && node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE] === haikuId) {
          if (!out[timelineName]) out[timelineName] = {}
          out[timelineName][timelineSelector] = bytecode.timelines[timelineName][timelineSelector]
        }
      }
    }
  })
  return out
}

Bytecode.getAppliedEventHandlersForNode = (out, bytecode, element) => {
  Template.visit(element, (node) => {
    for (const eventSelector in bytecode.eventHandlers) {
      const haikuId = Template.haikuSelectorToHaikuId(eventSelector)
      if (node && node.attributes && node.attributes[HAIKU_ID_ATTRIBUTE] === haikuId) {
        out[eventSelector] = bytecode.eventHandlers[eventSelector]
      }
    }
  })
  return out
}

Bytecode.padIds = (bytecode, padderFunction) => {
  const fixedReferences = {}

  const templateNodes = []

  // Apply padding to all identifiers within the template, tracking what changed
  Template.visit(bytecode.template, (node) => {
    if (node && node.attributes) {
      templateNodes.push(node)
    }
  })

  templateNodes.forEach((node) => {
    const haikuId = node.attributes[HAIKU_ID_ATTRIBUTE]
    if (haikuId) {
      const fixedHaikuId = padderFunction(haikuId)
      fixedReferences[haikuId] = fixedHaikuId
      node.attributes[HAIKU_ID_ATTRIBUTE] = fixedReferences[haikuId]
    }
    const domId = node.attributes.id
    if (domId) {
      const fixedDomId = padderFunction(domId)
      fixedReferences[domId] = fixedDomId
      fixedReferences[`url(#${domId})`] = `url(#${fixedDomId})` // filter="url(...)"
      fixedReferences[`#${domId}`] = `#${fixedDomId}` // xlink:href="#path-3-abc123"
      node.attributes.id = fixedReferences[domId]
    }
  })

  for (const originalReference in fixedReferences) {
    const updatedReference = fixedReferences[originalReference]
    if (bytecode.eventHandlers) {
      transferReferences(bytecode.eventHandlers, originalReference, updatedReference)
    }

    if (bytecode.timelines) {
      for (const timelineName in bytecode.timelines) {
        const timelineObject = bytecode.timelines[timelineName]
        transferReferences(timelineObject, originalReference, updatedReference)
        for (const timelineSelector in timelineObject) {
          for (const propertyName in timelineObject[timelineSelector]) {
            // TODO: Only apply to attributes known to use references? Or would that be brittle?
            //       For example, only filter, stroke, xlink:href...?
            for (const keyframeMs in timelineObject[timelineSelector][propertyName]) {
              const propertyValue = timelineObject[timelineSelector][propertyName][keyframeMs].value
              const fixedValue = fixedReferences[propertyValue]
              if (fixedValue) {
                timelineObject[timelineSelector][propertyName][keyframeMs].value = fixedValue
              }
            }
          }
        }
      }
    }
  }

  templateNodes.forEach((node) => {
    for (const attrKey in node.attributes) {
      const attrVal = node.attributes[attrKey]
      if (typeof attrVal !== 'string') continue
      if (fixedReferences[attrVal.trim()]) {
        node.attributes[attrKey] = fixedReferences[attrVal.trim()]
      }
    }
  })
}

function transferReferences (obj, originalReference, updatedReference) {
  if (obj[`#${originalReference}`]) {
    obj[`#${updatedReference}`] = obj[`#${originalReference}`]
    delete obj[`#${originalReference}`]
  } else if (obj[`haiku:${originalReference}`]) {
    obj[`haiku:${updatedReference}`] = obj[`haiku:${originalReference}`]
    delete obj[`haiku:${originalReference}`]
  }
}

/**
 * @method mergeBytecode
 * @description Given two bytecode objects assumed to be from the same design source
 * (effectively have the same structure and properties), merge their contents together,
 * incorporating default state changes etc.
 */
Bytecode.mergeBytecode = (b1, b2) => {
  if (b2.metadata && !b1.metadata) b1.metadata = {}
  assign(b1.metadata, b2.metadata)

  if (b2.options && !b1.options) b1.options = {}
  assign(b1.options, b2.options)

  Bytecode.mergeBytecodeControlStructures(b1, b2)

  // TODO: I have no idea of what the smartest way to do this is
  if (b2.template && !b1.template) b1.template = {}
  if (b2.template) {
    for (const key in b2.template) {
      b1.template[key] = b2.template[key]
    }
  }

  return b1
}

Bytecode.mergeBytecodeControlStructures = (b1, b2) => {
  if (b2.states && !b1.states) b1.states = {}
  if (b2.states) {
    for (const stateKey in b2.states) {
      const previousState = b1.states[stateKey]
      if (!previousState || (previousState && !previousState.edited)) {
        b1.states[stateKey] = b2.states[stateKey]
      }
    }
  }

  if (b2.eventHandlers && !b1.eventHandlers) b1.eventHandlers = {}
  if (b2.eventHandlers) {
    for (const eventSelector in b2.eventHandlers) {
      for (const eventName in b2.eventHandlers[eventSelector]) {
        const previousEventHandler = (
          b1.eventHandlers[eventSelector] &&
          b1.eventHandlers[eventSelector][eventName]
        )
        if (!previousEventHandler || (previousEventHandler && !previousEventHandler.edited)) {
          if (!b1.eventHandlers[eventSelector]) b1.eventHandlers[eventSelector] = {}
          b1.eventHandlers[eventSelector][eventName] = b2.eventHandlers[eventSelector][eventName]
        }
      }
    }
  }

  if (b2.timelines && !b1.timelines) b1.timelines = {}
  Bytecode.mergeTimelines(b1.timelines, b2.timelines)
}

Bytecode.mergeTimelines = (t1, t2, doMergeValueFn) => {
  if (!t1 || !t2) return
  for (const timelineName in t2) {
    for (const timelineSelector in t2[timelineName]) {
      for (const propertyName in t2[timelineName][timelineSelector]) {
        for (const keyframeMs in t2[timelineName][timelineSelector][propertyName]) {
          const previousKeyframe = (
            t1[timelineName] &&
            t1[timelineName][timelineSelector] &&
            t1[timelineName][timelineSelector][propertyName] &&
            t1[timelineName][timelineSelector][propertyName][keyframeMs]
          )
          if (!previousKeyframe || (previousKeyframe && !previousKeyframe.edited)) {
            if (!t1[timelineName]) t1[timelineName] = {}
            if (!t1[timelineName][timelineSelector]) t1[timelineName][timelineSelector] = {}
            if (!t1[timelineName][timelineSelector][propertyName]) t1[timelineName][timelineSelector][propertyName] = {}
            if (!t1[timelineName][timelineSelector][propertyName][keyframeMs]) t1[timelineName][timelineSelector][propertyName][keyframeMs] = {}

            const targetObj = t1[timelineName][timelineSelector][propertyName][keyframeMs]
            const sourceObj = t2[timelineName][timelineSelector][propertyName][keyframeMs]

            if (sourceObj && sourceObj.curve !== undefined) {
              targetObj.curve = sourceObj.curve
            }

            if (sourceObj && sourceObj.value !== undefined) {
              if (doMergeValueFn) {
                if (doMergeValueFn(propertyName, targetObj.value, sourceObj.value)) {
                  targetObj.value = sourceObj.value
                }
              } else {
                targetObj.value = sourceObj.value
              }
            }
          }
        }
      }
    }
  }
}

Bytecode.pasteBytecode = (destination, pasted, translation) => {
  if (pasted.states) {
    if (!destination.states) destination.states = {}
    for (const stateKey in pasted.states) {
      destination.states[stateKey] = pasted.states[stateKey]
    }
  }

  if (pasted.eventHandlers) {
    if (!destination.eventHandlers) destination.eventHandlers = {}
    for (const eventSelector in pasted.eventHandlers) {
      for (const eventName in pasted.eventHandlers[eventSelector]) {
        if (!destination.eventHandlers[eventSelector]) destination.eventHandlers[eventSelector] = {}
        destination.eventHandlers[eventSelector][eventName] = pasted.eventHandlers[eventSelector][eventName]
      }
    }
  }

  if (pasted.timelines) {
    if (!destination.timelines) destination.timelines = {}
    for (const timelineName in pasted.timelines) {
      for (const timelineSelector in pasted.timelines[timelineName]) {
        for (const propertyName in pasted.timelines[timelineName][timelineSelector]) {
          for (const keyframeMs in pasted.timelines[timelineName][timelineSelector][propertyName]) {
            if (!destination.timelines[timelineName]) destination.timelines[timelineName] = {}
            if (!destination.timelines[timelineName][timelineSelector]) destination.timelines[timelineName][timelineSelector] = {}
            if (!destination.timelines[timelineName][timelineSelector][propertyName]) destination.timelines[timelineName][timelineSelector][propertyName] = {}
            destination.timelines[timelineName][timelineSelector][propertyName][keyframeMs] = pasted.timelines[timelineName][timelineSelector][propertyName][keyframeMs]
          }
        }
      }
    }
  }

  // In case of a paste, we need to add a new child rather than merging into existing elements
  if (pasted.template) {
    if (!destination.template) destination.template = { elementName: 'div', attributes: {}, children: [] }
    if (!destination.template.children) destination.template.children = []
    destination.template.children.push(pasted.template)
  }

  return destination
}

Bytecode.applyOverrides = (overrides, timelinesObject, timelineName, timelineSelector, timelineTime) => {
  if (overrides && Object.keys(overrides).length > 0) {
    if (!timelinesObject[timelineName]) timelinesObject[timelineName] = {}
    if (!timelinesObject[timelineName][timelineSelector]) timelinesObject[timelineName][timelineSelector] = {}

    for (const propertyName in overrides) {
      if (!timelinesObject[timelineName][timelineSelector][propertyName]) timelinesObject[timelineName][timelineSelector][propertyName] = {}
      if (!timelinesObject[timelineName][timelineSelector][propertyName][timelineTime]) timelinesObject[timelineName][timelineSelector][propertyName][timelineTime] = {}
      if (!timelinesObject[timelineName][timelineSelector][propertyName][timelineTime].edited) {
        timelinesObject[timelineName][timelineSelector][propertyName][timelineTime].value = overrides[propertyName]
      }
    }
  }
}

Bytecode.extractOverrides = (bytecode) => {
  const overrides = {}

  if (bytecode.states) {
    for (const stateName in bytecode.states) {
      overrides[stateName] = bytecode.states[stateName].value
    }
  }

  return overrides
}

Bytecode.clone = (bytecode) => {
  // Eventually we may lean on a more custom-tailored clone method instead of lodash
  return lodash.cloneDeep(bytecode)
}

module.exports = Bytecode

// Down here to avoid Node circular dependency stub objects. #FIXME
const State = require('./State')
const Template = require('./Template')
