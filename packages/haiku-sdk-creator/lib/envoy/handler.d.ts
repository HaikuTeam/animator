export declare abstract class EnvoyHandler {
    on(eventName: string, eventHandler: Function): void;
    off(eventName: string, eventHandler: Function): void;
}
export default EnvoyHandler;
