import { Glass } from ".";
import { MaybeAsync } from "../envoy";
import EnvoyServer from "../envoy/server";
export declare const GLASS_CHANNEL = "glass";
export declare class GlassHandler implements Glass {
    private readonly server;
    constructor(server: EnvoyServer);
    cut(): MaybeAsync<void>;
    copy(): MaybeAsync<void>;
}
