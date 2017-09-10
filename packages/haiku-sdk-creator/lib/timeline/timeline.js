"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = console;
const DEFAULT_TIMELINE_DATA = {
    currentFrame: 0,
    fps: 60,
    playing: false,
    stopwatch: Date.now(),
};
const TIMELINE_CHANNEL = "timeline";
class TimelineHandler {
    constructor(server) {
        this.server = server;
        this.timelineRegistry = {};
    }
    getTimelineDataById(timelineId) {
        if (this.timelineRegistry[timelineId]) {
            return this.timelineRegistry[timelineId];
        }
        const newTimelineData = Object.assign({}, DEFAULT_TIMELINE_DATA, { stopwatch: Date.now() });
        this.timelineRegistry[timelineId] = newTimelineData;
        return newTimelineData;
    }
    play(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        timeline.playing = true;
        timeline.stopwatch = Date.now();
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didPlay",
            payload: {
                frame: this.getCurrentFrame(timelineId),
                time: timeline.stopwatch,
                timelineId,
            },
        });
    }
    pause(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        timeline.currentFrame = this.getCurrentFrame(timelineId);
        timeline.playing = false;
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didPause",
            payload: {
                frame: timeline.currentFrame,
                time: timeline.stopwatch,
                timelineId,
            },
        });
        return timeline.currentFrame;
    }
    seekToMs(timelineId, ms) {
        const timeline = this.getTimelineDataById(timelineId);
        throw new Error("unimplemented");
    }
    getDurationMs(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        throw new Error("unimplemented");
    }
    seekToFrame(timelineId, frame) {
        const timeline = this.getTimelineDataById(timelineId);
        timeline.currentFrame = frame | 0;
        timeline.stopwatch = Date.now();
        this.server.emit(TIMELINE_CHANNEL, {
            name: "didSeek",
            payload: {
                frame: timeline.currentFrame,
                time: timeline.stopwatch,
                timelineId,
            },
        });
    }
    seekToFrameAndPause(timelineId, frame) {
        this.seekToFrame(timelineId, frame);
        return this.pause(timelineId);
    }
    getDurationFrames(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        throw new Error("unimplemented");
    }
    setFps(timelineId, fps) {
        const timeline = this.getTimelineDataById(timelineId);
        timeline.fps = fps;
        throw new Error("unimplemented");
    }
    getFps(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        return timeline.fps;
    }
    getCurrentFrame(timelineId) {
        const timeline = this.getTimelineDataById(timelineId);
        let ret;
        if (timeline.playing) {
            const lap = Date.now();
            const spanMs = lap - timeline.stopwatch;
            const spanS = spanMs / 1000;
            const spanFrames = spanS * timeline.fps;
            ret = timeline.currentFrame + spanFrames;
        }
        else {
            ret = timeline.currentFrame;
        }
        return ret | 0;
    }
}
exports.default = TimelineHandler;
//# sourceMappingURL=timeline.js.map