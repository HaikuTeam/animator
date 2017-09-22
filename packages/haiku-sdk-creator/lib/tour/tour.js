"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TOUR_CHANNEL = "tour";
class TourHandler {
    constructor(server) {
        this.currentStep = 0;
        this.states = [
            {
                selector: "#",
                webview: "creator",
                component: "Welcome",
                display: "none",
            },
            {
                selector: "#project-edit-button",
                webview: "creator",
                component: "OpenProject",
                display: "left",
            },
            {
                selector: "#gauge-box",
                webview: "timeline",
                component: "ScrubTicker",
                display: "top",
            },
            {
                selector: ".property-timeline-segments-box",
                webview: "timeline",
                component: "PropertyChanger",
                display: "right",
            },
            {
                selector: ".pill-container span:nth-child(5)",
                webview: "timeline",
                component: "KeyframeCreator",
                display: "top",
            },
            {
                selector: ".pill-container span:nth-child(5)",
                webview: "timeline",
                component: "AnimatorNotice",
                display: "top",
            },
            {
                selector: "#library-wrapper",
                webview: "creator",
                component: "LibraryStart",
                display: "right",
            },
            {
                selector: "#go-to-dashboard",
                webview: "creator",
                component: "Finish",
                display: "bottom",
            },
        ];
        this.webviewData = {
            creator: { top: 0, left: 0 },
        };
        this.server = server;
    }
    requestWebviewCoordinates() {
        this.server.emit(TOUR_CHANNEL, {
            payload: {},
            name: "tour:requestWebviewCoordinates",
        });
    }
    requestElementCoordinates(state) {
        this.server.emit(TOUR_CHANNEL, {
            payload: state,
            name: "tour:requestElementCoordinates",
        });
    }
    requestShowStep(state, position) {
        this.server.emit(TOUR_CHANNEL, {
            payload: Object.assign({}, state, { coordinates: position }),
            name: "tour:requestShowStep",
        });
    }
    getState() {
        return this.states[this.currentStep];
    }
    receiveElementCoordinates(webview, position) {
        const state = this.getState();
        const top = this.webviewData[webview].top + position.top;
        const left = this.webviewData[webview].left + position.left;
        this.requestShowStep(state, { top, left });
    }
    receiveWebviewCoordinates(webview, coordinates) {
        this.webviewData[webview] = coordinates;
    }
    start() {
        this.requestShowStep(Object.assign({}, this.states[0]), { top: "50%", left: "50%" });
    }
    finish() {
    }
    next() {
        this.currentStep++;
        const nextState = this.getState();
        if (nextState) {
            this.requestElementCoordinates(nextState);
        }
        else {
            this.finish();
        }
    }
}
exports.default = TourHandler;
//# sourceMappingURL=tour.js.map