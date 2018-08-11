export interface Tour {
  next (): MaybeAsync<void>;
  hide (): MaybeAsync<void>;
  start (force?: boolean): MaybeAsync<void>;
  finish (createFile?: boolean): MaybeAsync<void>;
  updateLayout (): MaybeAsync<void>;
  receiveElementCoordinates (webview: string, position: ClientBoundingRect): MaybeAsync<void>;
  receiveWebviewCoordinates (webview: string, coordinates: ClientBoundingRect): MaybeAsync<void>;
}

export interface TourState {
  selector: string;
  webview: string;
  component: string;
  display: string;
  offset: object;
  spotlightRadius: number|string;
  size: string;
  isOverlayHideable: boolean;
  showPreviousButton: boolean;
  modalOffset: {x: number, y: number};
}

export interface ClientBoundingRect {
  top: number|string;
  left: number|string;
  width: number|string;
  height: number|string;
}

export type MaybeAsync<T> = T | Promise<T>;

export * from './TourHandler';
