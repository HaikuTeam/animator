import {Glass, ClipboardRequest} from "."
import {EnvoyEvent, MaybeAsync} from "../envoy"
import EnvoyServer from "../envoy/server"

export const GLASS_CHANNEL = "glass"

export class GlassHandler implements Glass {
    constructor(private readonly server: EnvoyServer) {}
}
