import {MaybeAsync} from "../envoy"

export interface ClipboardRequest {
    event: Event
}

export interface Glass {
    copy(request: GlassRequest): MaybeAsync<void>
    cut(request: GlassRequest): MaybeAsync<void>
}

export {GLASS_CHANNEL, GlassHandler} from "./glass"
