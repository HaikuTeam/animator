import { MaybeAsync, Tour } from "."
import { EnvoyEvent } from "../envoy"
import EnvoyServer from "../envoy/server"

const TOUR_CHANNEL = "tour"

export default class TourHandler implements Tour {

    //example
    private states = [] //or {}

    private server: EnvoyServer

    constructor(server: EnvoyServer) {
        this.server = server
    }

    testMethod(str: string) {
        //you can emit an event to all clients like this
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {name: "test:event", payload: {hello: str}})

        //this return value will be wrapped in a promise to the client who called this method
        return "HELLO, " + str
    }

    start() {
        //example
    }

    next() {
        //example

        //handle internal state changes

        //then broadcast to clients the new state
        this.server.emit(TOUR_CHANNEL, <EnvoyEvent> {name: "tour:nextState", payload: {}})
    }

    goto(stateName: string) {
        //example
    }

    finish(): MaybeAsync<void> {
        //example
    }
}
