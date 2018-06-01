export interface Timeline {
  play (timelineId: string): MaybeAsync<void>;

  pause (timelineId: string): MaybeAsync<number>;

  seekToFrame (timelineId: string, frame: number): MaybeAsync<void>;

  seekToMs (timelineId: string, ms: number): MaybeAsync<void>;

  getCurrentFrame (timelineId: string): MaybeAsync<number>;

  getDurationFrames (timelineId: string): MaybeAsync<number>;

  getDurationMs (timelineId: string): MaybeAsync<number>;

  getFps (timelineId: string): MaybeAsync<number>;

  setFps (timelineId: string, fps: number): MaybeAsync<void>;
}

export type MaybeAsync<T> = T | Promise<T>;

export * from './TimelineHandler';
