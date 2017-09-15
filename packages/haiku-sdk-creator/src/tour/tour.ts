import {
  createTourFile,
  didTakeTour,
} from "haiku-serialization/src/utils/HaikuHomeDir"
import { ClientBoundingRect, MaybeAsync, Tour, TourState } from "."
import { EnvoyEvent } from "../envoy"
import EnvoyServer from "../envoy/server"

const TOUR_CHANNEL = "tour"

export default class TourHandler implements Tour {

    private currentStep: number = 0

    private states: TourState[] = [
        {
            selector: "body",
            webview: "creator",
            component: "Welcome",
            display: "none",
            offset: {top: 0, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: "#project-edit-button",
            webview: "creator",
            component: "OpenProject",
            display: "left",
            offset: {top: 0, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: ".gauge-box",
            webview: "timeline",
            component: "ScrubTicker",
            display: "top",
            offset: {top: 0, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: ".property-timeline-segments-box",
            webview: "timeline",
            component: "PropertyChanger",
            display: "right",
            offset: {top: 0, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: ".pill-container span:nth-child(5)",
            webview: "timeline",
            component: "KeyframeCreator",
            display: "top",
            offset: {top: -50, left: 100},
            spotlightRadius: 8000,
        },
        {
            selector: ".pill-container span:nth-child(5)",
            webview: "timeline",
            component: "TweenCreator",
            display: "top",
            offset: {top: -50, left: 100},
            spotlightRadius: "default",
        },
        {
            selector: ".pill-container span:nth-child(5)",
            webview: "timeline",
            component: "AnimatorNotice",
            display: "top",
            offset: {top: -50, left: 100},
            spotlightRadius: "default",
        },
        {
            selector: "#stage-mount",
            webview: "creator",
            component: "LibraryStart",
            display: "right",
            offset: {top: 150, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: "#state-inspector",
            webview: "creator",
            component: "StatesStart",
            display: "right",
            offset: {top: 80, left: 50},
            spotlightRadius: "default",
        },
        {
            selector: "#add-state-button",
            webview: "creator",
            component: "AddState",
            display: "right",
            offset: {top: 70, left: 50},
            spotlightRadius: "default",
        },
        {
            selector: ".property-input-field",
            webview: "timeline",
            component: "ReferenceState",
            display: "top",
            offset: {top: -50, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: ".property-input-field",
            webview: "timeline",
            component: "ExpressionsCongrat",
            display: "top",
            offset: {top: -50, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: ".property-input-field",
            webview: "timeline",
            component: "Summonables",
            display: "top",
            offset: {top: -50, left: 0},
            spotlightRadius: "default",
        },
        {
            selector: "#publish",
            webview: "creator",
            component: "Publish",
            display: "left",
            offset: {top: 50, left: -50},
            spotlightRadius: "default",
        },
        {
            selector: ".Popover",
            webview: "creator",
            component: "PublishedLink",
            display: "left",
            offset: {top: 150, left: -150},
            spotlightRadius: "default",
        },
        {
            selector: "#go-to-dashboard",
            webview: "creator",
            component: "Finish",
            display: "bottom",
            offset: {top: 50, left: 0},
            spotlightRadius: "default",
        },
    ]

    private server: EnvoyServer

    private shouldRenderAgain: boolean

    private webviewData: object = {}

    constructor(server: EnvoyServer) {
        this.server = server
    }

    private performStepActions() {
        switch (this.currentStep) {
            case 1:
                this.requestSelectProject()
                break
        }
    }

    private renderCurrentStepAgain() {
        if (this.shouldRenderAgain) {
            this.currentStep--
            this.next()
            this.shouldRenderAgain = false
        }
    }

    private requestSelectProject() {
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
            payload: {},
            name: "tour:requestSelectProject",
        })
    }

    private requestWebviewCoordinates() {
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
            payload: {},
            name: "tour:requestWebviewCoordinates",
        })
    }

    private requestElementCoordinates(state: TourState): void {
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
            payload: state,
            name: "tour:requestElementCoordinates",
        })
    }

    private requestShowStep(state: TourState, position: ClientBoundingRect) {
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
            payload: { ...state, coordinates: position },
            name: "tour:requestShowStep",
        })
    }

    private requestFinish() {
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {
            payload: {},
            name: "tour:requestFinish",
        })
    }

    private getState() {
        return this.states[this.currentStep]
    }

    receiveElementCoordinates(webview: string, position: ClientBoundingRect) {
        const state = this.getState()
        const top = this.webviewData[webview].top + position.top
        const left =  this.webviewData[webview].left + position.left

        this.requestShowStep(state, { top, left })
    }

    receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect) {
        this.webviewData[webview] = coordinates
        this.renderCurrentStepAgain()
    }

    notifyScreenResize() {
        this.shouldRenderAgain = true
        this.requestWebviewCoordinates()
    }

    start(force) {
        if (!didTakeTour() || force) {
            this.currentStep = 0
            this.requestShowStep({ ...this.states[this.currentStep] }, { top: "50%", left: "50%" })
        }
    }

    finish(createFile?) {
        if (createFile) {
            createTourFile()
        }

        this.requestFinish()
    }

    next() {
        this.currentStep++

        const nextState = this.getState()

        this.performStepActions()

        if (nextState) {
            this.requestElementCoordinates(nextState)
        } else {
            this.finish()
        }
    }
}
