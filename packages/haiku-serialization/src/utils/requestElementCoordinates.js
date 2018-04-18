const logger = require('haiku-serialization/src/utils/LoggerInstance')

module.exports = function requestElementCoordinates (
  {currentWebview, requestedWebview, selector, shouldNotifyEnvoy, tourClient},
  maxNumberOfTries = 15,
  currentNumberOfTries = 0
) {
  if (currentWebview !== requestedWebview) return

  logger.info(
    `[${currentWebview}] handleRequestElementCoordinates`,
    selector,
    currentWebview
  )

  const domElement = document.querySelector(selector)

  if (domElement) {
    let {top, left, width, height} = domElement.getBoundingClientRect()
    if (shouldNotifyEnvoy) {
      logger.info(
        `[${currentWebview}] receive element coordinates`,
        selector,
        top,
        left
      )
      tourClient.receiveElementCoordinates(currentWebview, {top, left, width, height})
    }
  } else {
    // If we didn't find a DOM element, try again in 300ms
    if (maxNumberOfTries >= currentNumberOfTries) {
      setTimeout(() => {
        requestElementCoordinates.apply(this, [
          ...arguments,
          maxNumberOfTries,
          currentNumberOfTries++
        ])
      }, 300)
    } else {
      logger.error(
        `[${currentWebview}] Error fetching ${selector} in webview ${
          currentWebview
        }`
      )
    }
  }
}
