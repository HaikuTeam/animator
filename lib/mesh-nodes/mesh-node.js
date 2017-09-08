"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SimplePeer = require("simple-peer");
const wrtc = require("wrtc");
var DatagramIntent;
(function (DatagramIntent) {
    DatagramIntent[DatagramIntent["REQUEST"] = 0] = "REQUEST";
    DatagramIntent[DatagramIntent["RESPONSE"] = 1] = "RESPONSE";
    DatagramIntent[DatagramIntent["SCHEMA"] = 2] = "SCHEMA";
})(DatagramIntent = exports.DatagramIntent || (exports.DatagramIntent = {}));
const DEFAULT_QUERY_OPTIONS = {
    retries: 25,
    timeout: 100
};
class MeshNode {
    constructor(initiator) {
        this.peer = new SimplePeer({ wrtc: wrtc, initiator: initiator });
        this.peers = [];
        this.peer.on("signal", (data) => {
            console.log("SIGNAL", data);
            var newPeer = new SimplePeer({ wrtc: wrtc, initiator: true });
            this.peers.push(newPeer);
            newPeer.signal(data);
        });
        this.peer.on("data", this.handleData.bind(this));
    }
    bindHandler(path, handler) {
        this.handlerRegistry[path] = handler;
    }
    getClient(path) {
        return this.getRemoteSchema(path).then((schema) => {
            var returnMe;
            for (var key in schema) {
                var property = key;
                if (schema[key] === 'function') {
                    returnMe[property] = (...args) => {
                        return new Promise((accept, reject) => {
                            this.broadcast(DatagramIntent.REQUEST, path, property, args)
                                .then((response) => { accept(response); })
                                .catch((reason) => { reject(reason); });
                        });
                    };
                }
            }
            return returnMe;
        });
    }
    generateUUIDv4() {
        var uuid = "";
        for (var i = 0; i < 32; i++) {
            var rnd = Math.random() * 16 | 0;
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-";
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (rnd & 3 | 8) : rnd)).toString(16);
        }
        return uuid;
    }
    getRemoteSchema(path) {
        return this.broadcast(DatagramIntent.SCHEMA, path, "", [], {}).then((data) => {
            return JSON.parse(data);
        });
    }
    broadcast(intent, path, methodName, params, options) {
        return new Promise((accept, reject) => {
            var mergedOptions = this.getMergedQueryOptions(options);
            var retries = mergedOptions.retries;
            var timeout = mergedOptions.timeout;
        });
    }
    ensureConnection() {
        return new Promise((accept, reject) => {
            if (this.connection && this.connection.open) {
                accept(this.connection);
            }
            this.connection = this.peer.connect();
        });
    }
    getMergedQueryOptions(options) {
        var retOpts = Object.assign({}, DEFAULT_QUERY_OPTIONS, options);
        return retOpts;
    }
    handleData(rawData) {
        var data = JSON.parse(rawData);
        if (data.intent === DatagramIntent.REQUEST) {
            var handler = this.handlerRegistry[data.channel];
            if (handler) {
                var method = handler[data.method];
                if (method && typeof method === "function") {
                    method.apply(data.params);
                }
                else {
                    logger.warn("Not Found", `Method ${method} not found at ${data.channel}`);
                }
            }
        }
        else if (data.intent === DatagramIntent.SCHEMA) {
            var handler = this.handlerRegistry[data.channel];
            if (handler) {
                var schema = this.discoverSchemaOfHandler(handler);
            }
        }
        else if (data.intent === DatagramIntent.RESPONSE) {
            var storedCb = function () { console.warn("UNIMPLEMENTED"); };
            storedCb();
        }
    }
    discoverSchemaOfHandler(handler) {
        var ret;
        for (var key in handler) {
            if (handler.hasOwnProperty(key) && typeof handler[key] === "function") {
                ret[key] = 'function';
            }
        }
        return ret;
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
//# sourceMappingURL=mesh-node.js.map