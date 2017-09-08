/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function domInjectStylesheet(doc, css) {
  if (doc.createStyleSheet) {
    let sheet = doc.createStyleSheet()
    sheet.cssText = css
  } else {
    let head = doc.getElementsByTagName("head")[0]
    let style = doc.createElement("style")
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(doc.createTextNode(css))
    }
    (head || doc.documentElement).appendChild(style)
  }
}

module.exports = domInjectStylesheet
