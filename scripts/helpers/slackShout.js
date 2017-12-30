var slack = require('slack')
var log = require('./log')
var deploy = require('./../deploy')

module.exports = function shout (options, text, cb) {
  if (options && options.shout) {
    return slack.chat.postMessage({
      text: text,
      token: deploy.slack.legacy,
      channel: 'releases',
      username: 'Haiku Distro',
      icon_emoji: ':robot_face:'
    }, function (err) {
      if (err) log.err(err)
      return cb()
    })
  }
  return cb()
}
