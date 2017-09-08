import { Timeline } from ".";
import EnvoyServer from "../envoy/server";
export default class TimelineHandler implements Timeline {
    private server;
    constructor(server: EnvoyServer);
    private timelineRegistry;
    private getTimelineDataById(timelineId);
    play(timelineId: string): void;
    pause(timelineId: string): number;
    seekToMs(timelineId: string, ms: number): void;
    getDurationMs(timelineId: string): number;
    seekToFrame(timelineId: string, frame: number): void;
    seekToFrameAndPause(timelineId: string, frame: number): number;
    getDurationFrames(timelineId: string): number;
    setFps(timelineId: string, fps: number): void;
    getFps(timelineId: string): any;
    getCurrentFrame(timelineId: string): number;
}
