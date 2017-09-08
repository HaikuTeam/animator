"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = console;
var _stopwatch = (new Date()).getTime();
var _currentFrame = 0;
var _playing = false;
var _fps = 60;
class PlaybackHandler {
    play(timelineId) {
        logger.info("[playback] PLAY");
        _playing = true;
        _stopwatch = (new Date).getTime();
    }
    pause(timelineId) {
        _currentFrame = this.getCurrentFrame(timelineId);
        _playing = false;
        return _currentFrame;
    }
    seekToMs(timelineId, ms) {
        throw new Error("unimplemented");
    }
    getDurationMs(timelineId) {
        throw new Error("unimplemented");
    }
    seekToFrame(timelineId, frame) {
        _currentFrame = frame;
        _stopwatch = (new Date()).getTime();
    }
    getDurationFrames(timelineId) {
        throw new Error("unimplemented");
    }
    setFps(timelineId, fps) {
        _fps = fps;
    }
    getFps(timelineId) {
        return _fps;
    }
    getCurrentFrame(timelineId) {
        var ret;
        if (_playing) {
            var lap = (new Date()).getTime();
            var spanMs = lap - _stopwatch;
            var spanS = spanMs / 1000;
            var spanFrames = spanS * _fps;
            var max;
            ret = _currentFrame + spanFrames;
        }
        else {
            ret = _currentFrame;
        }
        logger.info("[playback] returning frame " + ret);
        return ret;
    }
}
exports.default = PlaybackHandler;
//# sourceMappingURL=playback.js.map