import {Timeline} from '.';
import EnvoyServer from '../envoy/EnvoyServer';

interface TimelineData {
  stopwatch: number;
  currentFrame: number;
  playing: boolean;
  fps: number;
}

const DEFAULT_TIMELINE_DATA: TimelineData = {
  currentFrame: 0,
  fps: 60,
  playing: false,
  stopwatch: Date.now(),
};

export const TIMELINE_CHANNEL = 'timeline';

export class TimelineHandler implements Timeline {

  private server: EnvoyServer;

  // TODO: pass EnvoyLogger in here
  constructor (server: EnvoyServer) {
    this.server = server;
    this.timelineRegistry = {};
  }

  private timelineRegistry: {};

  private getTimelineDataById (timelineId: string) {
    if (this.timelineRegistry[timelineId]) {
      return this.timelineRegistry[timelineId];
    }

    const newTimelineData = Object.assign({}, DEFAULT_TIMELINE_DATA, {stopwatch: Date.now()});
    this.timelineRegistry[timelineId] = newTimelineData;
    return newTimelineData;
  }

  play (timelineId: string) {
    const timeline = this.getTimelineDataById(timelineId);
    // TODO: need to setTimelineTime in ActiveComponent
    // let currentTime = Math.round(currentFrame * frameInfo.mspf)
    timeline.playing = true;
    timeline.stopwatch = Date.now();
    this.server.emit(TIMELINE_CHANNEL, {
      name: 'didPlay',
      payload: {
        timelineId,
        frame: this.getCurrentFrame(timelineId),
        time: timeline.stopwatch,
      },
    });
  }

  pause (timelineId: string): number {
    const timeline = this.getTimelineDataById(timelineId);
    timeline.currentFrame = this.getCurrentFrame(timelineId);
    timeline.playing = false;
    this.server.emit(TIMELINE_CHANNEL, {
      name: 'didPause',
      payload: {
        timelineId,
        frame: timeline.currentFrame,
        time: timeline.stopwatch,
      },
    });
    return timeline.currentFrame;
  }

  seekToMs (timelineId: string, ms: number) {
    throw new Error('unimplemented');
  }

  getDurationMs (timelineId: string): number {
    throw new Error('unimplemented');
  }

  seekToFrame (timelineId: string, frame: number) {
    const timeline = this.getTimelineDataById(timelineId);
    timeline.currentFrame = frame | 0;
    timeline.stopwatch = Date.now();
    this.server.emit(TIMELINE_CHANNEL, {
      name: 'didSeek',
      payload: {
        timelineId,
        frame: timeline.currentFrame,
        time: timeline.stopwatch,
      },
    });
  }

  seekToFrameAndPause (timelineId: string, frame: number): number {
    this.seekToFrame(timelineId, frame);
    return this.pause(timelineId);
  }

  getDurationFrames (timelineId: string): number {
    // TODO: read bytecode and cache here
    // TODO: evaluate if timeline still needs to know max duration.
    //       if it does, query it from here instead of doing bad lookup
    throw new Error('unimplemented');
  }

  setFps (timelineId: string, fps: number) {
    const timeline = this.getTimelineDataById(timelineId);
    timeline.fps = fps;
    throw new Error('unimplemented');
  }

  getFps (timelineId: string) {
    const timeline = this.getTimelineDataById(timelineId);
    return timeline.fps;
  }

  getCurrentFrame (timelineId: string) {
    const timeline = this.getTimelineDataById(timelineId);
    let ret: number;
    if (timeline.playing) {
      const lap = Date.now();
      const spanMs = lap - timeline.stopwatch;
      const spanS = spanMs / 1000;
      const spanFrames = spanS * timeline.fps;
      ret = timeline.currentFrame + spanFrames;
    } else {
      ret = timeline.currentFrame;
    }

    return ret | 0;
  }
}
