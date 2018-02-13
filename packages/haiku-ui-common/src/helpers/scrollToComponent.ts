// function calculateScrollOffset (element, offset, align) {
//   const body = document.body
//   const html = document.documentElement
//   const elementRect = element.getBoundingClientRect()
//   const clientHeight = html.clientHeight
//   const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

//   offset = offset || 0 // additional offset to top

//   let scrollPosition
//   switch (align) {
//     case 'top': scrollPosition = elementRect.top; break
//     case 'middle': scrollPosition = elementRect.bottom - clientHeight / 2 - elementRect.height / 2; break
//     case 'bottom': scrollPosition = elementRect.bottom - clientHeight; break
//     default: scrollPosition = elementRect.bottom - clientHeight / 2 - elementRect.height / 2; break // defaul to middle
//   }

//   const finalScrollPosition = scrollPosition + offset + window.pageYOffset
//   const maxScrollPosition = documentHeight - clientHeight

//   return Math.min(finalScrollPosition, maxScrollPosition)
// }

// function getScrollPos () {
//   var y = window.pageYOffset || document.documentElement.scrollTop
//   var x = window.pageXOffset || document.documentElement.scrollLeft
//   return { y, x }
// }

// module.exports = function scrollToComponent (ref, offset, align, duration) {
//   return null
// }
