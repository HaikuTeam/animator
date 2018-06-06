/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function domInjectStylesheet (doc, css) {
  if (doc.createStyleSheet) {
    const sheet = doc.createStyleSheet();
    sheet.cssText = css;
  } else {
    const head = doc.getElementsByTagName('head')[0];
    const style = doc.createElement('style');
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }
    (head || doc.documentElement).appendChild(style);
  }
}
