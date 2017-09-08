"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./client"));
__export(require("./handler"));
var DatagramIntent;
(function (DatagramIntent) {
    DatagramIntent[DatagramIntent["REQUEST"] = 0] = "REQUEST";
    DatagramIntent[DatagramIntent["RESPONSE"] = 1] = "RESPONSE";
    DatagramIntent[DatagramIntent["SCHEMA_REQUEST"] = 2] = "SCHEMA_REQUEST";
    DatagramIntent[DatagramIntent["EVENT"] = 3] = "EVENT";
    DatagramIntent[DatagramIntent["ID_REQUEST"] = 4] = "ID_REQUEST";
})(DatagramIntent = exports.DatagramIntent || (exports.DatagramIntent = {}));
exports.DEFAULT_ENVOY_OPTIONS = {
    host: "0.0.0.0",
    logger: console,
    mock: false,
    path: "/",
    port: null,
    protocol: "ws",
};
exports.DEFAULT_REQUEST_OPTIONS = {
    timeout: 5000,
};
//# sourceMappingURL=index.js.map