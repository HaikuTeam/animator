"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORTER_CHANNEL = "exporter";
class ExporterHandler {
    constructor(server) {
        this.server = server;
    }
    save(request) {
        this.server.emit(exports.EXPORTER_CHANNEL, {
            payload: request,
            name: `${exports.EXPORTER_CHANNEL}:save`,
        });
    }
    saved(request) {
        this.server.emit(exports.EXPORTER_CHANNEL, {
            payload: request,
            name: `${exports.EXPORTER_CHANNEL}:saved`,
        });
    }
}
exports.ExporterHandler = ExporterHandler;
//# sourceMappingURL=exporter.js.map