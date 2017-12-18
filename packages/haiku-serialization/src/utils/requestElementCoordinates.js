module.exports = function requestElementCoordinates (
  {currentWebview, requestedWebview, selector, shouldNotifyEnvoy, tourClient},
  maxNumberOfTries = 15,
  currentNumberOfTries = 0
) {
  if (currentWebview !== requestedWebview) return

  console.info(
    `[${currentWebview}] handleRequestElementCoordinates`,
    selector,
    currentWebview
  )

  let element = document.querySelector(selector)

  if (element) {
    let {top, left, width, height} = element.getBoundingClientRect()
    if (shouldNotifyEnvoy) {
      console.info(
        `[${currentWebview}] receive element coordinates`,
        selector,
        top,
        left
      )
      tourClient.receiveElementCoordinates(currentWebview, {top, left, width, height})
    }
  } else {
    // If we didn't find an element, try again in 300ms
    if (maxNumberOfTries >= currentNumberOfTries) {
      setTimeout(() => {
        requestElementCoordinates.apply(this, [
          ...arguments,
          maxNumberOfTries,
          currentNumberOfTries++
        ])
      }, 300)
    } else {
      console.error(
        `[${currentWebview}] Error fetching ${selector} in webview ${
          currentWebview
        }`
      )
    }
  }
}
