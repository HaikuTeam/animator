// Convenient when you need to slice the array in place and have iteration continue
module.exports = function reverseEach (arr, iterator) {
  for (let i = arr.length - 1; i >= 0; i--) iterator(arr[i], i, arr)
}
