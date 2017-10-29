var diff = require('diff')

class Differ {
  constructor () {
    this.edits = ['']
  }

  push (string) {
    this.edits.push(string || '')
    return this
  }

  deltas () {
    if (this.edits.length < 2) return []
    return diff.diffLines(this.edits[this.edits.length - 2], this.edits[this.edits.length - 1])
  }

  set (first, second) {
    this.edits.splice(0)
    this.edits[0] = first || ''
    this.edits[1] = second || ''
  }

  pair (first, second, opts = {}) {
    this.set(first, second)
    if (this.edits[0] === this.edits[1]) return void (0)
    else return this.deltas()
  }
}

Differ.create = function () {
  return new Differ()
}

module.exports = Differ
