import { MaybeAsync, Timeline } from "."
import {EnvoyEvent} from "../envoy"
import EnvoyServer from "../envoy/server"

const logger = console //TODO:  hook into winston etc

interface TimelineData {
    stopwatch: number,
    currentFrame: number,
    playing: boolean,
    fps: number
}

const DEFAULT_TIMELINE_DATA: TimelineData = {
    currentFrame: 0,
    fps: 60,
    playing: false,
    stopwatch: (new Date()).getTime(),
}

const TIMELINE_CHANNEL = "timeline"

export default class TimelineHandler implements Timeline {

    private server: EnvoyServer
    //TODO:  pass logger in here
    constructor(server: EnvoyServer) {
        this.server = server
        this.timelineRegistry = {}
    }

    private timelineRegistry: {}

    private getTimelineDataById(timelineId: string) {
        if (this.timelineRegistry[timelineId]) {
            return this.timelineRegistry[timelineId]
        }

        const newTimelineData = Object.assign({}, DEFAULT_TIMELINE_DATA, { stopwatch: (new Date()).getTime() })
        this.timelineRegistry[timelineId] = newTimelineData
        return newTimelineData
    }

    play(timelineId: string) {
        const timeline = this.getTimelineDataById(timelineId)
        //TODO:  need to setTimelineTime in ActiveComponent
        // let currentTime = Math.round(currentFrame * frameInfo.mspf)
        timeline.playing = true
        timeline.stopwatch = (new Date()).getTime()
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didPlay",
            payload: {
                frame: this.getCurrentFrame(timelineId),
                time: timeline.stopwatch,
                timelineId,
            },
        })
    }

    pause(timelineId: string): number {
        const timeline = this.getTimelineDataById(timelineId)
        timeline.currentFrame = this.getCurrentFrame(timelineId)
        timeline.playing = false
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didPause",
            payload: {
                frame: timeline.currentFrame,
                time: timeline.stopwatch,
                timelineId,
            },
        })
        return timeline.currentFrame
    }

    seekToMs(timelineId: string, ms: number) {
        const timeline = this.getTimelineDataById(timelineId)
        // timeline.currentFrame = 0 //TODO
        // timeline.stopwatch = (new Date()).getTime()
        throw new Error("unimplemented")
    }

    getDurationMs(timelineId: string): number {
        const timeline = this.getTimelineDataById(timelineId)
        //TODO:  read bytecode and cache here
        //TODO:  evaluate if timeline still needs to know max duration.
        //       if it does, query it from here instead of doing bad lookup
        throw new Error("unimplemented")
    }

    seekToFrame(timelineId: string, frame: number) {
        const timeline = this.getTimelineDataById(timelineId)
        timeline.currentFrame = frame | 0
        timeline.stopwatch = (new Date()).getTime()
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didSeek",
            payload: {
                frame: timeline.currentFrame,
                time: timeline.stopwatch,
                timelineId,
            },
        })
    }

    seekToFrameAndPause(timelineId: string, frame: number): number {
        this.seekToFrame(timelineId, frame)
        return this.pause(timelineId)
    }

    getDurationFrames(timelineId: string): number {
        const timeline = this.getTimelineDataById(timelineId)
        //this should perhaps be PASSED IN AS AN OPTION (and updated by the passer)

        //TODO:  read bytecode and cache here
        //TODO:  evaluate if timeline still needs to know max duration.
        //       if it does, query it from here instead of doing bad lookup
        throw new Error("unimplemented")
    }

    setFps(timelineId: string, fps: number) {
        const timeline = this.getTimelineDataById(timelineId)
        timeline.fps = fps
        throw new Error("unimplemented")
    }

    getFps(timelineId: string) {
        const timeline = this.getTimelineDataById(timelineId)
        return timeline.fps
    }

    getCurrentFrame(timelineId: string) {
        const timeline = this.getTimelineDataById(timelineId)
        let ret: number
        if (timeline.playing) {
            const lap = (new Date()).getTime()
            const spanMs = lap - timeline.stopwatch
            const spanS = spanMs / 1000
            const spanFrames = spanS * timeline.fps
            // const max
            ret = timeline.currentFrame + spanFrames
        } else {
            ret = timeline.currentFrame
        }

        // logger.info("[timeline] returning frame " + ret)
        return ret | 0
    }

}
