"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLASS_CHANNEL = "glass";
class GlassHandler {
    constructor(server) {
        this.server = server;
    }
    cut() {
        this.server.emit(exports.GLASS_CHANNEL, {
            payload: {},
            name: "cut",
        });
    }
    copy() {
        this.server.emit(exports.GLASS_CHANNEL, {
            payload: {},
            name: "copy",
        });
    }
}
exports.GlassHandler = GlassHandler;
//# sourceMappingURL=glass.js.map