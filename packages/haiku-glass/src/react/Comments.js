/* tslint:disable */
var fse = require('haiku-fs-extra')
var path = require('path')
var lodash = require('lodash')
var FILE_PATH = path.join('.haiku', 'comments.json')

function Comments (folder) {
  if (!folder) throw new Error('Folder is required')
  this.datapath = path.join(folder, FILE_PATH)
  this.comments = []
}

Comments.prototype.load = function _load (cb) {
  return fse.readJson(this.datapath, function (err, comments) {
    if (err) return cb(err)
    this.comments = comments || []
    this.comments.forEach((comment) => {
      if (!comment.id) comment.id = Math.random() + ''
    })
    return cb()
  }.bind(this))
}

Comments.prototype.save = function _save (cb) {
  return fse.writeJson(this.datapath, cleanComments(this.comments), { spaces: 2 }, cb || function () {})
}

// @function add
// @param content {string} The content string (can be Markdown)
// @param options {object} Optional attributes for the comment object.
// @returns id {number} Id of the comment
// @description
// Example:
// {
//   context: "stage",
//   timeline: "Default",
//   time: 0,
//   x: 123,
//   y: 231,
//   w: 300,
//   h: 200,
//   content: "Lookout _belooooow_"
// }
// It's up to the UI to decide how to render these.
Comments.prototype.add = function _add (content, options) {
  var id = Date.now()
  var comment = { content: content, id: id }
  lodash.merge(comment, options || {})
  this.comments.push(comment)
  this.comments = lodash.uniqWith(this.comments, lodash.isEqual)
  return id
}

Comments.prototype.build = function _build (options) {
  this.add('', lodash.merge({
    created: Date.now(),
    author: null, // TODO
    isOpened: true,
    isEditing: true
  }, options))
}

// @function remove
// @param id {number} Id of the comment to remove
Comments.prototype.remove = function _remove (id) {
  lodash.pullAllWith(this.comments, [{ id: id }], lodash.matches)
  return id
}

Comments.prototype.reply = function _reply (id, content, options) {
  var comment = lodash.find(this.comments, { id: id })
  if (!comment.replies) comment.replies = []
  var reply = { id: Date.now(), content: content }
  lodash.merge(reply, options || {})
  comment.replies.push(reply)
  return reply.id
}

function cleanComments (dirty) {
  var clean = []
  dirty.forEach((dirt) => {
    if (dirt.isCancelled) return void (0)
    clean.push(lodash.omit(dirt, ['isReplying', 'isOpened']))
  })
  return clean
}

module.exports = Comments
