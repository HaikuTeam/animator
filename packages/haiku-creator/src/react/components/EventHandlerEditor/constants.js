export const EVALUATOR_STATES = {
  NONE: 1, // None means nothing to evaluate at all
  OPEN: 2, // Anything >= OPEN is also 'open'
  INFO: 3,
  WARN: 4,
  ERROR: 5,
};

export const EDITOR_WIDTH = 500;

export const AUTOCOMPLETION_ITEMS = [
  {
    detail: 'Change State',
    label: 'setState',
    insertText: 'this.setState({stateName: value})',
  },
  {
    detail: 'Change State (Transition)',
    label: 'setState (Using transition)',
    insertText: 'this.setState({stateName: value}, {duration: 1000, curve: "linear", queued: false})',
  },
  {
    detail: 'Seek and play from a specific frame.',
    label: 'gotoAndPlay',
    insertText: 'this.getDefaultTimeline().gotoAndPlay(frame)',
  },
  {
    detail: 'Seek to a specific frame, and stop the timeline at that point.',
    label: 'gotoAndStop',
    insertText: 'this.getDefaultTimeline().gotoAndStop(frame)',
  },
  {
    detail: 'Play this timeline at the current frame.',
    label: 'play',
    insertText: 'this.getDefaultTimeline().play()',
  },
  {
    detail: 'Pause this timeline at the current frame.',
    label: 'pause',
    insertText: 'this.getDefaultTimeline().pause()',
  },
  {
    detail: 'Pauses the timeline and resets to 0.',
    label: 'stop',
    insertText: 'this.getDefaultTimeline().stop()',
  },
  {
    detail: 'Start this timeline from frame 0.',
    label: 'start',
    insertText: 'this.getDefaultTimeline().start()',
  },
  {
    detail: 'Jump to a specific frame in the timeline.',
    label: 'seek',
    insertText: 'this.getDefaultTimeline().seek(frame)',
  },
  {
    detail: 'Returns whether or not this timeline is currently playing.',
    label: 'isPlaying',
    insertText: 'this.getDefaultTimeline().isPlaying()',
  },
  {
    detail: 'Returns whether or not this timeline has gone past its max frame.',
    label: 'isFinished',
    insertText: 'this.getDefaultTimeline().isFinished()',
  },
  {
    detail: 'Returns default timeline.',
    label: 'this.getDefaultTimeline()',
  },
];
