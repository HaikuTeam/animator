 /* Copy from haiku-common/src/types/enums.ts  */
export enum Curve {
  EaseInBack = 'easeInBack',
  EaseInCirc = 'easeInCirc',
  EaseInCubic = 'easeInCubic',
  EaseInExpo = 'easeInExpo',
  EaseInQuad = 'easeInQuad',
  EaseInQuart = 'easeInQuart',
  EaseInBounce = 'easeInBounce',
  EaseInElastic = 'easeInElastic',
  EaseInQuint = 'easeInQuint',
  EaseInSine = 'easeInSine',
  EaseOutBack = 'easeOutBack',
  EaseOutCirc = 'easeOutCirc',
  EaseOutCubic = 'easeOutCubic',
  EaseOutExpo = 'easeOutExpo',
  EaseOutQuad = 'easeOutQuad',
  EaseOutQuart = 'easeOutQuart',
  EaseOutBounce = 'easeOutBounce',
  EaseOutElastic = 'easeOutElastic',
  EaseOutQuint = 'easeOutQuint',
  EaseOutSine = 'easeOutSine',
  EaseInOutBack = 'easeInOutBack',
  EaseInOutCirc = 'easeInOutCirc',
  EaseInOutCubic = 'easeInOutCubic',
  EaseInOutExpo = 'easeInOutExpo',
  EaseInOutQuad = 'easeInOutQuad',
  EaseInOutQuart = 'easeInOutQuart',
  EaseInOutBounce = 'easeInOutBounce',
  EaseInOutElastic = 'easeInOutElastic',
  EaseInOutQuint = 'easeInOutQuint',
  EaseInOutSine = 'easeInOutSine',
  Linear = 'linear',
}
  
/**
 * Haiku element tree. eg. <div><svg>...</div></svg>. 
 * `source` and `identifier` are rarely used.
 */
export type HaikuTemplate = {
  elementName: string;
  attributes: {[attribute: string] : string;
    source?: string;
    identifier?: string; };
  children : HaikuTemplate[] | string[];
};

/**
 * Haiku states.
 */
export type HaikuStates = {
  [stateName: string] : {value: string | {text: string}[] };
};

/**
 * Haiku function `handler` for an specific `eventName`. 
 */
export type HaikuEventHandler = {
  [eventName: string]: {handler: (any) => any};
};

/**
 * Tuples of `elementName` and `HaikuEventHandler`. 
 */
export type HaikuEventHandlers = {
  [elementName: string]: HaikuEventHandler;
};

/**
 * Value of an element property in a given frame. 
 */
export type HaikuTimelineValue = {
  value: (boolean | string | ((any) => string));
  edited?: boolean;
  curve?: Curve;
};

/**
 * Map `propertyName` to a list of `frameNum` and its given `HaikuTimelineValue`.
 * *Most* of tests use frameNum as string.
 */
export type HaikuElementTimeline = {
  [propertyName: string]: {[frameNum : number]: HaikuTimelineValue} | 
                            {[frameNum : string]: HaikuTimelineValue};
};
  
/**
 * Tuples of `elementName` and `HaikuElementTimeline`. 
 */
export type HaikuTimeline = {
  [elementName: string]: HaikuElementTimeline;
};

/**
 * Tuples of `timelineName` and `HaikuTimeline`. 
 */
export type HaikuTimelines = {
  [timelineName: string]: HaikuTimeline;
};
  
/**
 * Haiky bytecode metadata. 
 */
export type HaikuMetadata = {
  folder?: string;
  uuid: string;
  player?: string;
  type: string;
  name?: string;
  relpath: string;
  core?: string;
  version?: string;
  username?: string;
  organization?: string;
  project?: string;
  branch?: string;
};
  
/**
 * Properties. 
 */
export type HaikuProperties = {
  name: string;
  type: string;
  value: number;
};
  
/**
 * Bytecode definition. Properties are *rarely* used.
 */
type HaikuBytecode = {
  template: HaikuTemplate | string;
  states?: HaikuStates;
  eventHandlers: HaikuEventHandlers;
  timelines: HaikuTimelines;
  metadata?: HaikuMetadata;
  properties?: HaikuProperties[]
};
  
export default HaikuBytecode;
