export default function getWindowsBrowser(window) {
  let rv = -1
  if (!window) return rv
  if (!window.navigator) return rv
  if (!window.navigator.userAgent) return rv
  if (!window.navigator.appName) return rv
  if (window.navigator.appName === "Microsoft Internet Explorer") {
    let ua = window.navigator.userAgent
    let re = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})")
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1)
    }
  } else if (window.navigator.appName === "Netscape") {
    rv = (window.navigator.appVersion.indexOf("Trident") === -1) ? 12 : 11
  }
  return rv
}
