let lastSelectionString = null

function logSelectionString (prefix, serializedElement) {
  let newSelectionString
  if (!serializedElement) newSelectionString = '[none]'
  else newSelectionString = `<${serializedElement.elementName}#${serializedElement.attributes['haiku-id']}>`
  if (newSelectionString !== lastSelectionString) {
    lastSelectionString = newSelectionString
    console.info(`${prefix} ${newSelectionString}`)
  }
}

module.exports = logSelectionString
