module.exports = function getWindowsBrowser (window) {
  var rv = -1
  if (window.navigator.appName === 'Microsoft Internet Explorer') {
    var ua = window.navigator.userAgent
    var re = new RegExp('MSIE ([0-9]{1,}[\\.0-9]{0,})')
    if (re.exec(ua) !== null) {
      rv = parseFloat(RegExp.$1)
    }
  } else if (window.navigator.appName === 'Netscape') {
    rv = (window.navigator.appVersion.indexOf('Trident') === -1) ? 12 : 11
  }
  return rv
}
