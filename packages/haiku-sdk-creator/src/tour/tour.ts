import { ClientBoundingRect, MaybeAsync, Tour, TourState } from "."
import { EnvoyEvent } from "../envoy"
import EnvoyServer from "../envoy/server"
import {
  didTakeTour,
  createTourFile
} from 'haiku-serialization/src/utils/HaikuHomeDir'

const TOUR_CHANNEL = "tour"

export default class TourHandler implements Tour {

    private currentStep: number = 0

    private states: TourState[] = [
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
    ]

    private server: EnvoyServer

    private webviewData: object = {
        creator: { top: 0, left: 0 },
    }

    constructor(server: EnvoyServer) {
        this.server = server
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
    }

    start({ force }) {
        if (!didTakeTour() || force) {
            this.currentStep = 0
            this.requestShowStep({ ...this.states[0] }, { top: "50%", left: "50%" })
        }
    }

    finish() {
        createTourFile()
    }

    next() {
        this.currentStep++
        const nextState = this.getState()

        if (nextState) {
            this.requestElementCoordinates(nextState)
        } else {
            this.finish()
        }
    }
}
