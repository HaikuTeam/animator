"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TOUR_CHANNEL = "tour";
class TourHandler {
    constructor(server) {
        this.states = [];
        this.server = server;
    }
    testMethod(str) {
        this.server.emit(TOUR_CHANNEL, { name: "test:event", payload: { hello: str } });
        return "HELLO, " + str;
    }
    start() {
    }
    next() {
        this.server.emit(TOUR_CHANNEL, { name: "tour:nextState", payload: {} });
    }
    goto(stateName) {
    }
    finish() {
    }
}
exports.default = TourHandler;
//# sourceMappingURL=tour.js.map