import { ClientBoundingRect, Tour } from ".";
import EnvoyServer from "../envoy/server";
export default class TourHandler implements Tour {
    private currentStep;
    private isActive;
    private states;
    private server;
    private shouldRenderAgain;
    private webviewData;
    constructor(server: EnvoyServer);
    private performStepActions();
    private renderCurrentStepAgain();
    private requestSelectProject();
    private requestWebviewCoordinates();
    private requestElementCoordinates(state);
    private requestShowStep(state, position);
    private requestFinish();
    private getState();
    receiveElementCoordinates(webview: string, position: ClientBoundingRect): void;
    receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect): void;
    notifyScreenResize(): void;
    start(force?: any): void;
    finish(createFile?: any): void;
    next(): void;
}
