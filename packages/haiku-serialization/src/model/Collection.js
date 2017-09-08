var lodash = require('lodash')

module.exports = function Collection () {
  var data = []

  return {
    all: function all () {
      return data
    },

    add: function add (item) {
      for (var i = 0; i < data.length; i++) {
        // Don't add duplicates
        if (data[i].uid === item.uid) return item
      }
      data.push(item)
      return item
    },

    remove: function remove (item) {
      var i = data.length
      while (i--) {
        var maybe = data[i]
        if (maybe.uid === item.uid) {
          data.splice(i, 1)
        }
      }
    },

    each: function each (iteratee) {
      for (var i = 0; i < data.length; i++) {
        iteratee(data[i], i, data)
      }
    },

    count: function count () {
      return data.length
    },

    dequeue: function dequeue () {
      var items = data.splice(0)
      var uniqs = lodash.uniqBy(items, 'uid')
      return uniqs
    }
  }
}
