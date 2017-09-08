import Playback from './playback';
export default class PlaybackServer extends Playback {
    play(): void;
    pause(): number;
    seekToMs(ms: any): void;
    getDurationMs(): number;
    seekToFrame(frame: any): void;
    getDurationFrames(): number;
    setFps(fps: any): void;
    getFps(): number;
    getCurrentFrame(): number;
}
