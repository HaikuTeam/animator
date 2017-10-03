export interface Tour {
    next(): MaybeAsync<void>;
    start(force?: boolean): MaybeAsync<void>;
    finish(createFile?: boolean): MaybeAsync<void>;
    getCurrentStep(): MaybeAsync<number>;
    notifyScreenResize(): MaybeAsync<void>;
    receiveElementCoordinates(webview: string, position: ClientBoundingRect): MaybeAsync<void>;
    receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect): MaybeAsync<void>;
}
export interface TourState {
    selector: string;
    webview: string;
    component: string;
    display: string;
    offset: ClientBoundingRect;
    spotlightRadius: number | string;
    waitUserAction: boolean;
}
export interface ClientBoundingRect {
    top: number | string;
    left: number | string;
}
export declare type MaybeAsync<T> = T | Promise<T>;
export * from "./tour";
