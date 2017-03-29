module.exports = function isIE (window) {
  return new RegExp('MSIE ([0-9]{1,}[.0-9]{0,})').exec(window.navigator.userAgent) !== null ? parseFloat(RegExp.$1) : false
}
