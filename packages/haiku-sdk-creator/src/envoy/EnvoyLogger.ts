// @ts-ignore
import * as LoggerInstance from 'haiku-serialization/src/utils/LoggerInstance';

export type EnvoyLogLevel = 'info' | 'log' | 'warn' | 'error';

export default class EnvoyLogger implements Console {
  // tslint:disable-next-line:variable-name
  Console: NodeJS.ConsoleConstructor;
  memory: any;

  constructor (private readonly logLevel: EnvoyLogLevel, private readonly logger?: any) {
    if (!this.logger) {
      this.logger = LoggerInstance;
    }
  }

  info (...args: any[]) {
    if (this.logLevel === 'info') {
      return this.logger.info(...args);
    }
  }

  log (...args: any[]) {
    if (this.logLevel === 'info' || this.logLevel === 'log') {
      return this.logger.info(...args);
    }
  }

  warn (...args: any[]) {
    if (this.logLevel === 'info' || this.logLevel === 'log' || this.logLevel === 'warn') {
      return this.logger.warn(...args);
    }
  }

  error (...args: any[]) {
    return this.logger.error(...args);
  }

  assert (...args: any[]) {
    return this.logger.assert(...args);
  }

  clear () {
    return this.logger.clear();
  }

  count (...args: any[]) {
    return this.logger.count(...args);
  }

  countReset (label?: string) {
    return this.logger.countReset(label);
  }

  debug (...args: any[]) {
    return this.logger.debug(...args);
  }

  dir (...args: any[]) {
    return this.logger.dir(...args);
  }

  dirxml (arg: any[]) {
    return this.logger.dirxml(arg);
  }

  exception (...args: any[]) {
    return this.logger.exception(...args);
  }

  group (...args: any[]) {
    return this.logger.group(...args);
  }

  groupCollapsed (...args: any[]) {
    return this.logger.groupCollapsed(...args);
  }

  groupEnd () {
    return this.logger.groupEnd();
  }

  markTimeline (label?: string) {
    return this.logger.markTimeline(label);
  }

  msIsIndependentlyComposed (element: any) {
    return this.logger.msIsIndependentlyComposed(element);
  }

  profile (...args: any[]) {
    return this.logger.profile(...args);
  }

  profileEnd () {
    return this.logger.profileEnd();
  }

  select (arg: any) {
    return this.logger.select(arg);
  }

  table (...args: any[]) {
    return this.logger.table(...args);
  }

  time (...args: any[]) {
    return this.logger.time(...args);
  }

  timeEnd (...args: any[]) {
    return this.logger.timeEnd(...args);
  }

  timeLog (label?: string, ...data: any[]) {
    return this.logger.timeLog(label, ...data);
  }

  timeStamp (...args: any[]) {
    return this.logger.timeStamp(...args);
  }

  timeline (...args: any[]) {
    return this.logger.timeline(...args);
  }

  timelineEnd (...args: any[]) {
    return this.logger.timelineEnd(...args);
  }

  trace (...args: any[]) {
    return this.logger.trace(...args);
  }
}
