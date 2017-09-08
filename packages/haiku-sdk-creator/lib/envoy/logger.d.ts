export declare type EnvoyLogLevel = "info" | "log" | "warn" | "error";
export default class EnvoyLogger implements Console {
    logger: Console;
    logLevel: EnvoyLogLevel;
    Console: any;
    constructor(logLevel: EnvoyLogLevel, logger?: Console);
    info(...args: any[]): any;
    log(...args: any[]): any;
    warn(...args: any[]): any;
    error(...args: any[]): any;
    assert(...args: any[]): any;
    clear(...args: any[]): any;
    count(...args: any[]): any;
    debug(...args: any[]): any;
    dir(...args: any[]): any;
    dirxml(...args: any[]): any;
    exception(...args: any[]): any;
    group(...args: any[]): any;
    groupCollapsed(...args: any[]): any;
    groupEnd(...args: any[]): any;
    msIsIndependentlyComposed(element: any): boolean;
    profile(...args: any[]): any;
    profileEnd(...args: any[]): any;
    select(...args: any[]): any;
    table(...args: any[]): any;
    time(...args: any[]): any;
    timeEnd(...args: any[]): any;
    trace(...args: any[]): any;
}
