import { Playback } from '.';
export default class PlaybackHandler implements Playback {
    play(timelineId: string): void;
    pause(timelineId: string): number;
    seekToMs(timelineId: string, ms: number): void;
    getDurationMs(timelineId: string): number;
    seekToFrame(timelineId: string, frame: number): void;
    getDurationFrames(timelineId: string): number;
    setFps(timelineId: string, fps: number): void;
    getFps(timelineId: string): number;
    getCurrentFrame(timelineId: string): number;
}
