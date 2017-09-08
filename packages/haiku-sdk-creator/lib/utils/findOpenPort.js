"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const DEFAULT_PORT_SEARCH_START = 45032;
const DEFAULT_HOST = "0.0.0.0";
const ADDRESS_IN_USE_CODE = "EADDRINUSE";
function findOpenPort(port, host, cb) {
    if (port === null || port === undefined) {
        port = DEFAULT_PORT_SEARCH_START;
    }
    if (host === null || host === undefined) {
        host = DEFAULT_HOST;
    }
    const server = net.createServer();
    try {
        server.listen(port, host);
        server.once("listening", () => {
            server.once("close", () => {
                return cb(null, port);
            });
            server.close();
        });
        server.on("error", (err) => {
            if (err && err.code === ADDRESS_IN_USE_CODE) {
                return findOpenPort(port + 1, host, cb);
            }
            return cb(err);
        });
    }
    catch (exception) {
        return cb(exception);
    }
}
exports.default = findOpenPort;
//# sourceMappingURL=findOpenPort.js.map