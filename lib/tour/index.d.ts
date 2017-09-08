export interface Tour {
    testMethod(str: string): MaybeAsync<string>;
    start(): MaybeAsync<void>;
    next(): MaybeAsync<void>;
    goto(stateName: string): MaybeAsync<void>;
    finish(): MaybeAsync<void>;
}
export declare type MaybeAsync<T> = T | Promise<T>;
export * from "./tour";
