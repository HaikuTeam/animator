"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HaikuHomeDir_1 = require("haiku-serialization/src/utils/HaikuHomeDir");
const TOUR_CHANNEL = "tour";
class TourHandler {
    constructor(server) {
        this.currentStep = 0;
        this.isActive = false;
        this.states = [
            {
                selector: "body",
                webview: "creator",
                component: "Welcome",
                display: "none",
                offset: { top: 0, left: 0 },
                spotlightRadius: "default",
                waitUserAction: true,
            },
            {
                selector: "#project-edit-button",
                webview: "creator",
                component: "OpenProject",
                display: "left",
                offset: { top: 0, left: 60 },
                spotlightRadius: "default",
                waitUserAction: true,
            },
            {
                selector: ".gauge-box",
                webview: "timeline",
                component: "OpacityIncrease",
                display: "top",
                offset: { top: 50, left: 20 },
                spotlightRadius: 8000,
                waitUserAction: true,
            },
            {
                selector: ".gauge-box",
                webview: "timeline",
                component: "OpacityReduce",
                display: "top",
                offset: { top: 50, left: 0 },
                spotlightRadius: 8000,
                waitUserAction: true,
            },
            {
                selector: ".gauge-box",
                webview: "timeline",
                component: "TweenCreator",
                display: "top",
                offset: { top: 50, left: 100 },
                spotlightRadius: 8000,
                waitUserAction: true,
            },
            {
                selector: ".gauge-box",
                webview: "timeline",
                component: "AnimatorNotice",
                display: "top",
                offset: { top: 50, left: 100 },
                spotlightRadius: 8000,
                waitUserAction: false,
            },
            {
                selector: "#stage-mount",
                webview: "creator",
                component: "LibraryStart",
                display: "right",
                offset: { top: 220, left: 0 },
                spotlightRadius: "default",
                waitUserAction: true,
            },
            {
                selector: "#state-inspector",
                webview: "creator",
                component: "StatesStart",
                display: "right",
                offset: { top: 220, left: 50 },
                spotlightRadius: 800,
                waitUserAction: true,
            },
            {
                selector: "#add-state-button",
                webview: "creator",
                component: "AddState",
                display: "right",
                offset: { top: 220, left: 50 },
                spotlightRadius: 800,
                waitUserAction: true,
            },
            {
                selector: ".property-input-field",
                webview: "timeline",
                component: "ReferenceState",
                display: "right",
                offset: { top: 0, left: 120 },
                spotlightRadius: "default",
                waitUserAction: false,
            },
            {
                selector: ".property-input-field",
                webview: "timeline",
                component: "Summonables",
                display: "right",
                offset: { top: 0, left: 120 },
                spotlightRadius: "default",
                waitUserAction: false,
            },
            {
                selector: ".property-input-field",
                webview: "timeline",
                component: "NoCodeRequired",
                display: "right",
                offset: { top: 0, left: 120 },
                spotlightRadius: "default",
                waitUserAction: false,
            },
            {
                selector: "#publish",
                webview: "creator",
                component: "Publish",
                display: "left",
                offset: { top: 140, left: -50 },
                spotlightRadius: "default",
                waitUserAction: true,
            },
            {
                selector: ".Popover",
                webview: "creator",
                component: "PublishedLink",
                display: "left",
                offset: { top: 260, left: -150 },
                spotlightRadius: 900,
                waitUserAction: false,
            },
            {
                selector: "#go-to-dashboard",
                webview: "creator",
                component: "Finish",
                display: "bottom",
                offset: { top: 50, left: 0 },
                spotlightRadius: "default",
                waitUserAction: true,
            },
        ];
        this.webviewData = {};
        this.server = server;
    }
    performStepActions() {
        switch (this.currentStep) {
            case 1:
                this.requestSelectProject();
                break;
        }
    }
    renderCurrentStepAgain() {
        if (this.shouldRenderAgain) {
            this.currentStep--;
            this.next();
            this.shouldRenderAgain = false;
        }
    }
    requestSelectProject() {
        this.server.emit(TOUR_CHANNEL, {
            payload: {},
            name: "tour:requestSelectProject",
        });
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
            payload: Object.assign({}, state, { coordinates: position, stepData: { current: this.currentStep, total: this.states.length - 1 } }),
            name: "tour:requestShowStep",
        });
    }
    requestFinish() {
        this.server.emit(TOUR_CHANNEL, {
            payload: {},
            name: "tour:requestFinish",
        });
    }
    getState() {
        return this.states[this.currentStep];
    }
    receiveElementCoordinates(webview, position) {
        const state = this.getState();
        const fallbackPosition = { top: 0, left: 0 };
        const origin = this.webviewData[webview] || fallbackPosition;
        const top = origin.top + position.top;
        const left = origin.left + position.left;
        this.requestShowStep(state, { top, left });
    }
    receiveWebviewCoordinates(webview, coordinates) {
        this.webviewData[webview] = coordinates;
        this.renderCurrentStepAgain();
    }
    notifyScreenResize() {
        if (this.currentStep > 0) {
            this.shouldRenderAgain = true;
        }
        this.requestWebviewCoordinates();
    }
    isTourActive() {
        return this.isActive;
    }
    getCurrentStep() {
        return this.currentStep;
    }
    start(force) {
        if ((!HaikuHomeDir_1.didTakeTour() && !this.isActive) || force) {
            this.currentStep = 0;
            this.isActive = true;
            this.requestShowStep(Object.assign({}, this.states[this.currentStep]), { top: "40%", left: "50%" });
        }
    }
    finish(createFile) {
        if (createFile) {
            HaikuHomeDir_1.createTourFile();
        }
        this.isActive = false;
        this.requestFinish();
    }
    next() {
        if (!this.isActive) {
            return;
        }
        this.currentStep++;
        const nextState = this.getState();
        this.performStepActions();
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