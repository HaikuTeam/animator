"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const peer_1 = require("peer");
class MeshHost {
    start(config) {
        this.config = config;
        var server = peer_1.PeerServer(config);
    }
    restart(config) {
        this.stop();
        this.start(config || this.config);
    }
    stop() {
    }
}
exports.default = MeshHost;
//# sourceMappingURL=mesh-broker.js.map