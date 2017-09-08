function uniq (arr) {
  var len = arr.length
  var i = -1
  while (i++ < len) {
    var j = i + 1
    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice(j--, 1)
      }
    }
  }
  return arr
}

function immutable (arr) {
  var arrayLength = arr.length
  var newArray = new Array(arrayLength)
  for (var i = 0; i < arrayLength; i++) {
    newArray[i] = arr[i]
  }
  return uniq(newArray)
}

module.exports = {
  uniq: uniq,
  immutable: immutable
}
