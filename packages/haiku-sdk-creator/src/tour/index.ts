export interface Tour {
    next(): MaybeAsync<void>
    start(options?: object): MaybeAsync<void>
    receiveElementCoordinates(webview: string, position: ClientBoundingRect): MaybeAsync<void>
    receiveWebviewCoordinates(webview: string, coordinates: ClientBoundingRect): MaybeAsync<void>
}

export interface TourState {
    selector: string
    webview: string
    component: string
    display: string
}

export interface ClientBoundingRect {
  top: number|string,
  left: number|string
}

export type MaybeAsync<T> = T | Promise<T>

export * from "./tour"
