"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const peerjs_1 = require("peerjs");
var DatagramDirection;
(function (DatagramDirection) {
    DatagramDirection[DatagramDirection["REQUEST"] = 0] = "REQUEST";
    DatagramDirection[DatagramDirection["RESPONSE"] = 1] = "RESPONSE";
})(DatagramDirection = exports.DatagramDirection || (exports.DatagramDirection = {}));
const TIMEOUT = 2000;
class MeshNode {
    constructor(channel, options) {
        this.peer = new peerjs_1.Peer();
        this.peer.on("connection", (connection) => {
            connection.on("data", this.handleData);
        });
    }
    bindHandler(path, handler) {
        this.handlerRegistry[path] = handler;
    }
    bindClient(path, clientTemplate) {
        var returnMe = {};
        for (var key in clientTemplate) {
            var property = key;
            if (clientTemplate.hasOwnProperty(key)) {
                returnMe[property] = (...args) => {
                    return new Promise((accept, reject) => {
                        this.queryPeers(path, property, args)
                            .then((response) => { accept(response); })
                            .catch((reason) => { reject(reason); });
                    });
                };
            }
        }
        return returnMe;
    }
    queryPeers(path, methodName, params, options) {
        return new Promise((accept, reject) => {
        });
    }
    handleData(data) {
        if (data.type === DatagramDirection.REQUEST) {
            var handler = this.handlerRegistry[data.path];
            if (handler) {
            }
        }
    }
}
exports.MeshNode = MeshNode;
var logger = console;
var _stopwatch = (new Date()).getTime();
var _currentFrame = 0;
var _playing = false;
var _fps = 60;
class PlaybackHandler {
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
}
//# sourceMappingURL=peer-node.js.map