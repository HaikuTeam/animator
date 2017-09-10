import { ClientBoundingRect, Tour } from ".";
import EnvoyServer from "../envoy/server";
export default class TourHandler implements Tour {
    private currentStep;
    private states;
    private server;
    private webviewData;
    constructor(server: EnvoyServer);
    private requestWebviewCoordinates();
    private requestElementCoordinates(state);
    private requestShowStep(state, position);
    private getState();
    receiveElementCoordinates(webview: string, position: ClientBoundingRect): void;
    receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect): void;
    start(): void;
    finish(): void;
    next(): void;
}
