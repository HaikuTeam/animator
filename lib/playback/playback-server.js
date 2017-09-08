"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const playback_1 = require("./playback");
const surrogates_1 = require("../helpers/surrogates");
var logger = console;
var _stopwatch = (new Date()).getTime();
var _currentFrame = 0;
var _playing = false;
var _fps = 60;
let PlaybackServer = class PlaybackServer extends playback_1.default {
    play() {
        logger.info("[playback] PLAY");
        _playing = true;
        _stopwatch = (new Date).getTime();
    }
    pause() {
        _currentFrame = this.getCurrentFrame();
        _playing = false;
        return _currentFrame;
    }
    seekToMs(ms) {
        throw new Error("unimplemented");
    }
    getDurationMs() {
        throw new Error("unimplemented");
    }
    seekToFrame(frame) {
        _currentFrame = frame();
        _stopwatch = (new Date()).getTime();
    }
    getDurationFrames() {
        throw new Error("unimplemented");
    }
    setFps(fps) {
        _fps = fps;
    }
    getFps() {
        return _fps;
    }
    getCurrentFrame() {
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
};
PlaybackServer = __decorate([
    surrogates_1.SurrogateHandler("Playback")
], PlaybackServer);
exports.default = PlaybackServer;
//# sourceMappingURL=playback-server.js.map