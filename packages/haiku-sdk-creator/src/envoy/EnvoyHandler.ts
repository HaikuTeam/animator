export default abstract class EnvoyHandler {
  abstract on(eventName: string, eventHandler: Function);
  abstract off(eventName: string, eventHandler: Function);
}
