import React from 'react' // eslint-disable-line
import numeral from 'numeral'
import TimelineProperty from 'haiku-bytecode/src/TimelineProperty'
import retToEq from './retToEq'
import inferUnitOfValue from './inferUnitOfValue'
import humanizePropertyName from './humanizePropertyName'

export default function getPropertyValueDescriptor (node, frameInfo, reifiedBytecode, serializedBytecode, component, currentTimelineTime, currentTimelineName, propertyDescriptor, options = {}) {
  let componentId = node.attributes['haiku-id']
  let elementName = node.elementName

  let propertyName = propertyDescriptor.name

  let hostInstance = component.fetchActiveBytecodeFile().get('hostInstance')
  let hostStates = component.fetchActiveBytecodeFile().get('states')

  let fallbackValue = propertyDescriptor.fallback
  let baselineValue = TimelineProperty.getBaselineValue(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, fallbackValue, reifiedBytecode, hostInstance, hostStates)
  let computedValue = TimelineProperty.getComputedValue(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, fallbackValue, reifiedBytecode, hostInstance, hostStates)

  let assignedValueObject = TimelineProperty.getAssignedValueObject(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, serializedBytecode)
  let assignedValue = assignedValueObject && assignedValueObject.value

  let bookendValueObject = TimelineProperty.getAssignedBaselineValueObject(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, serializedBytecode)
  let bookendValue = bookendValueObject && bookendValueObject.value

  let valueType = propertyDescriptor.typedef || typeof baselineValue

  let prettyValue
  if (assignedValue !== undefined) {
    if (assignedValue && typeof assignedValue === 'object' && assignedValue.__function) {
      let cleanValue = retToEq(assignedValue.__function.body.trim())
      if (cleanValue.length > 6) cleanValue = (cleanValue.slice(0, 6) + '…')
      prettyValue = (
        <span style={{ whiteSpace: 'nowrap' }}>
          {cleanValue}
        </span>
      )
    }
  }
  if (prettyValue === undefined) {
    if (assignedValue === undefined && bookendValue !== undefined) {
      if (bookendValue && typeof bookendValue === 'object' && bookendValue.__function) {
        prettyValue = <span style={{ fontSize: '11px' }}>⚡</span>
      }
    }
  }
  if (prettyValue === undefined) {
    prettyValue = (valueType === 'number')
      ? numeral(computedValue || 0).format(options.numFormat || '0,0[.]0')
      : computedValue
  }

  let valueUnit = inferUnitOfValue(propertyDescriptor.name)
  let valueLabel = humanizePropertyName(propertyName)

  return {
    timelineTime: currentTimelineTime,
    timelineName: currentTimelineName,
    propertyName,
    valueType,
    valueUnit,
    valueLabel,
    fallbackValue,
    baselineValue,
    computedValue,
    assignedValue,
    bookendValue,
    prettyValue
  }
}
