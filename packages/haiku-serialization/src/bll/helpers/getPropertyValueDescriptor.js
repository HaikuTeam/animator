const numeral = require('numeral')
const TimelineProperty = require('haiku-bytecode/src/TimelineProperty')
const retToEq = require('./retToEq')
const inferUnitOfValue = require('./inferUnitOfValue')
const humanizePropertyName = require('./humanizePropertyName')

function getPropertyValueDescriptor (timelineRow, options) {
  const componentId = timelineRow.element.getComponentId()

  const elementName = timelineRow.element.getNameString()

  const propertyName = timelineRow.getPropertyNameString()

  const hostInstance = timelineRow.component.fetchActiveBytecodeFile().getHostInstance()

  const bytecodeFile = timelineRow.component.fetchActiveBytecodeFile()

  const hostStates = bytecodeFile.getHostStates()

  const serializedBytecode = bytecodeFile.getSerializedBytecode()

  const reifiedBytecode = bytecodeFile.getReifiedBytecode()

  const currentTimelineName = (options.timelineName)
    ? options.timelineName
    : timelineRow.component.getCurrentTimelineName()

  const currentTimelineTime = (options.timelineTime !== undefined)
    ? options.timelineTime
    : timelineRow.component.getCurrentTimelineTime()

  const propertyDescriptor = timelineRow.getDescriptor()

  const fallbackValue = propertyDescriptor.fallback

  const baselineValue = TimelineProperty.getBaselineValue(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates
  )

  const baselineCurve = TimelineProperty.getBaselineCurve(
    componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance,
    hostStates
  )

  const computedValue = TimelineProperty.getComputedValue(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    fallbackValue,
    reifiedBytecode,
    hostInstance, hostStates
  )

  const assignedValueObject = TimelineProperty.getAssignedValueObject(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode
  )

  const assignedValue = assignedValueObject && assignedValueObject.value

  const bookendValueObject = TimelineProperty.getAssignedBaselineValueObject(componentId,
    elementName,
    propertyName,
    currentTimelineName,
    currentTimelineTime,
    serializedBytecode
  )

  const bookendValue = bookendValueObject && bookendValueObject.value

  const valueType = propertyDescriptor.typedef || typeof baselineValue

  let prettyValue
  if (assignedValue !== undefined) {
    if (assignedValue && typeof assignedValue === 'object' && assignedValue.__function) {
      let cleanValue = retToEq(assignedValue.__function.body.trim())

      if (cleanValue.length > 6) cleanValue = (cleanValue.slice(0, 6) + '…')

      prettyValue = { text: cleanValue, style: { whiteSpace: 'nowrap' }, render: 'react' }
    }
  }

  if (prettyValue === undefined) {
    if (assignedValue === undefined && bookendValue !== undefined) {
      if (bookendValue && typeof bookendValue === 'object' && bookendValue.__function) {
        prettyValue = { text: '⚡', style: { fontSize: '11px' }, render: 'react' }
      }
    }
  }

  if (prettyValue === undefined) {
    prettyValue = (valueType === 'number')
      ? numeral(computedValue || 0).format(options.numFormat || '0,0[.]0')
      : computedValue
  }

  const valueUnit = inferUnitOfValue(propertyDescriptor.name)

  const valueLabel = humanizePropertyName(propertyName)

  return {
    timelineTime: currentTimelineTime,
    timelineName: currentTimelineName,
    propertyName,
    valueType,
    valueUnit,
    valueLabel,
    fallbackValue,
    baselineValue,
    baselineCurve,
    computedValue,
    assignedValue,
    bookendValue,
    prettyValue
  }
}

module.exports = getPropertyValueDescriptor
