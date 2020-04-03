const path = require('path');
const winston = require('winston');
const jsonStringify = require('fast-safe-stringify');
const EventEmitter = require('events');
const {isProduction} = require('haiku-common/lib/environments');
const {isWindows} = require('haiku-common/lib/environments/os');

require('colors'); // TODO: use non-string-extending module

const formatJsonLogToString = (message) => {
  if (message.noFormat) {
    return message.message;
  }

  if (Array.isArray(message.message)) {
    message.message = message.message.map((message) => {
      if (typeof message === 'string') {
        return message;
      }
      return jsonStringify(message);
    }).join(' ');
  }

  // Pading is done to visually align on file
  return `${message.timestamp}|${message.view.padEnd(8)}|${message.level}${message.tag ? '|' + message.tag : ''}${message.durationMs ? '|d=' + message.durationMs : ''}|${message.message}`;
};

/**
 * Control log message format output
 */
const haikuFormat = winston.format.printf((info, opts) => {
  return formatJsonLogToString(info);
});

// Ignore log messages if they have { doNotLogOnFile: true }
// Its needed to avoid double writing to log file on plumbing
const ignoreDoNotWriteToFile = winston.format((info, opts) => {
  if (info.doNotLogOnFile) {
    return false;
  }
  return info;
});

const DEFAULTS = {
  maxsize: 1000000,
  maxFiles: 1,
  colorize: true,
};

class Logger extends EventEmitter {
  constructor (folder, relpath, options = {}) {
    super(options);

    const config = Object.assign({}, DEFAULTS, options);

    const transports = [];

    if (folder && relpath) {
      const filename = path.join(folder, relpath);
      transports.push(new winston.transports.File({
        filename,
        tailable: true,
        maxsize: config.maxsize,
        maxFiles: config.maxFiles,
        colorize: config.colorize,
        level: 'info',
        json: false,
        format: winston.format.combine(
          ignoreDoNotWriteToFile(),
          haikuFormat,
        ),
      }));
    }

    // In prod, we don't really benefit from sending logs to the dev console.
    // In Windows, our logging library (winston) has problems with stdout.
    if (!isProduction() && !isWindows()) {
      transports.push(new winston.transports.Console({
        format: winston.format.combine(
          haikuFormat,
        ),
      }));
    }

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
      ),
      transports,
    });

    // Hook to allow consumers to configure the view prefix from which we log
    this.view = '?';
  }

  raw (jsonMessage) {
    this.logger.log(jsonMessage);
  }

  info (...args) {
    this.logger.info(args, {view: this.view});
  }

  traceInfo (tag, message, attachedObject) {
    this.logger.info(message, {view: this.view, tag, attachedObject});
  }

  debug (...args) {
    this.logger.debug(args, {view: this.view});
  }

  warn (...args) {
    this.logger.warn(args, {view: this.view});
  }

  error (...args) {
    this.logger.error(args, {view: this.view});
  }

  /**
   * Methods not supported by winston fall back to console
   */

  assert (...args) {
    console.assert(...args);
  }

  count (...args) {
    console.count(...args);
  }

  countReset (...args) {
    console.countReset(...args);
  }

  dir (...args) {
    console.dir(...args);
  }

  dirxml (...args) {
    console.dirxml(...args);
  }

  exception (...args) {
    console.exception(...args);
  }

  group (...args) {
    console.group(...args);
  }

  groupCollapsed (...args) {
    console.groupCollapsed(...args);
  }

  groupEnd (...args) {
    console.groupEnd(...args);
  }

  profileEnd (...args) {
    console.profileEnd(...args);
  }

  select (...args) {
    console.select(...args);
  }

  table (...args) {
    console.table(...args);
  }

  time (...args) {
    this.logger.profile(args, {view: this.view});
  }

  timeLog (...args) {
    console.timeLog(...args);
  }

  timeEnd (...args) {
    this.logger.profile(args, {view: this.view});
  }

  trace (...args) {
    console.trace(...args);
  }
}

module.exports = {Logger, formatJsonLogToString};
