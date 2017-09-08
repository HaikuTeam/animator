import { MaybeAsync, Tour } from ".";
import EnvoyServer from "../envoy/server";
export default class TourHandler implements Tour {
    private states;
    private server;
    constructor(server: EnvoyServer);
    testMethod(str: string): string;
    start(): void;
    next(): void;
    goto(stateName: string): void;
    finish(): MaybeAsync<void>;
}
