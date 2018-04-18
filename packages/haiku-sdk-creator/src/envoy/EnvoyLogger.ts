import LoggerInstance from 'haiku-serialization/src/utils/LoggerInstance';

export type EnvoyLogLevel = 'info' | 'log' | 'warn' | 'error';

export default class EnvoyLogger implements Console {
  logger: Console;
  logLevel: EnvoyLogLevel;
  // tslint:disable-next-line:variable-name
  Console;

  constructor(logLevel: EnvoyLogLevel, logger?: Console) {
    this.logger = logger || LoggerInstance;
    this.logLevel = logLevel;
  }

  info(...args) {
    if (this.logLevel === 'info') {
      return this.logger.info(...args);
    }
  }

  log(...args) {
    if (this.logLevel === 'info' || this.logLevel === 'log') {
      return this.logger.log(...args);
    }
  }

  warn(...args) {
    if (this.logLevel === 'info' || this.logLevel === 'log' || this.logLevel === 'warn') {
      return this.logger.warn(...args);
    }
  }

  error(...args) {
    return this.logger.error(...args);
  }

  assert(...args) {
    return this.logger.assert(...args);
  }

  clear(...args) {
    return this.logger.clear(...args);
  }

  count(...args) {
    return this.logger.count(...args);
  }

  debug(...args) {
    return this.logger.debug(...args);
  }

  dir(...args) {
    return this.logger.dir(...args);
  }

  dirxml(arg) {
    return this.logger.dirxml(arg);
  }

  exception(...args) {
    return this.logger.exception(...args);
  }

  group(...args) {
    return this.logger.group(...args);
  }

  groupCollapsed(...args) {
    return this.logger.groupCollapsed(...args);
  }

  groupEnd(...args) {
    return this.logger.groupEnd(...args);
  }

  msIsIndependentlyComposed(element: any) {
    return this.logger.msIsIndependentlyComposed(element);
  }

  profile(...args) {
    return this.logger.profile(...args);
  }

  profileEnd(...args) {
    return this.logger.profileEnd(...args);
  }

  select(arg) {
    return this.logger.select(arg);
  }

  table(...args) {
    return this.logger.table(...args);
  }

  time(...args) {
    return this.logger.time(...args);
  }

  timeEnd(...args) {
    return this.logger.timeEnd(...args);
  }

  trace(...args) {
    return this.logger.trace(...args);
  }
}
