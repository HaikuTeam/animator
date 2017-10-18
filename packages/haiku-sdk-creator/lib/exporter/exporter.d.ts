import { Exporter, ExporterRequest } from ".";
import { MaybeAsync } from "../envoy";
import EnvoyServer from "../envoy/server";
export declare const EXPORTER_CHANNEL = "exporter";
export declare class ExporterHandler implements Exporter {
    private readonly server;
    constructor(server: EnvoyServer);
    save(request: ExporterRequest): MaybeAsync<void>;
    saved(request: ExporterRequest): MaybeAsync<void>;
}
