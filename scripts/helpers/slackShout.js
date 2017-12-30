const slack = require('slack');
const log = require('./log');
const deploy = require('./../deploy');

module.exports = function shout(options, text, cb) {
  if (options && options.shout) {
    return slack.chat.postMessage({
      text,
      token: deploy.slack.legacy,
      channel: 'releases',
      username: 'Haiku Distro',
      icon_emoji: ':robot_face:',
    }, (err) => {
      if (err) log.err(err);
      return cb();
    });
  }
  return cb();
};
