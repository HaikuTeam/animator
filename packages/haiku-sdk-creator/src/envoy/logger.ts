export type EnvoyLogLevel = "info" | "log" | "warn" | "error"

export default class EnvoyLogger implements Console {
    logger: Console
    logLevel: EnvoyLogLevel
    Console

    constructor(logLevel: EnvoyLogLevel, logger?: Console) {
        this.logger = logger || console
        this.logLevel = logLevel
    }

    info(...args) {
        if (this.logLevel === "info") {
            return this.logger.info.apply(this, args)
        }
    }

    log(...args) {
        if (this.logLevel === "info" || this.logLevel === "log") {
            return this.logger.log.apply(this, args)
        }
    }

    warn(...args) {
        if (this.logLevel === "info" || this.logLevel === "log" || this.logLevel === "warn") {
            return this.logger.warn.apply(this, args)
        }
    }

    error(...args) {
        return this.logger.error.apply(this, args)
    }

    assert(...args) {
        return this.logger.assert.apply(this, args)
    }
    clear(...args) {
        return this.logger.clear.apply(this, args)
    }
    count(...args) {
        return this.logger.count.apply(this, args)
    }
    debug(...args) {
        return this.logger.debug.apply(this, args)
    }
    dir(...args) {
        return this.logger.dir.apply(this, args)
    }
    dirxml(...args) {
        return this.logger.dirxml.apply(this, args)
    }
    exception(...args) {
        return this.logger.exception.apply(this, args)
    }
    group(...args) {
        return this.logger.group.apply(this, args)
    }
    groupCollapsed(...args) {
        return this.logger.groupCollapsed.apply(this, args)
    }
    groupEnd(...args) {
        return this.logger.groupEnd.apply(this, args)
    }
    msIsIndependentlyComposed(element: any) {
        return this.logger.msIsIndependentlyComposed(element)
    }
    profile(...args) {
        return this.logger.profile.apply(this, args)
    }
    profileEnd(...args) {
        return this.logger.profileEnd.apply(this, args)
    }
    select(...args) {
        return this.logger.select.apply(this, args)
    }
    table(...args) {
        return this.logger.table.apply(this, args)
    }
    time(...args) {
        return this.logger.time.apply(this, args)
    }
    timeEnd(...args) {
        return this.logger.timeEnd.apply(this, args)
    }
    trace(...args) {
        return this.logger.trace.apply(this, args)
    }
}
