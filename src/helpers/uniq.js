// The code in uniq.js is modified vendored from code in npm package array-unique, which is MIT licensed:
// The MIT License (MIT)
// Copyright (c) 2014-2016, Jon Schlinkert
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function uniq (arr) {
  var len = arr.length
  var i = -1
  while (i++ < len) {
    var j = i + 1
    for (; j < arr.length; ++j) {
      if (arr[i] === arr[j]) {
        arr.splice((j--), 1)
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
