/**
 * @file Type definition for Haiku bytecode.
 */

export type PrimitiveType = string|number|object|boolean|null;

/** 
 * Allowed state types, including function return type for timeline functions, 
 * state getter and setter. 
 */
export type BytecodeStateType = PrimitiveType|PrimitiveType[];

/**
 * Haiku bytecode element tree. eg. <div><svg>...</svg></div>.
 * `source` and `identifier` are rarely used.
 */
export type BytecodeTemplate = {
  elementName: string;
  attributes: {
    [attribute: string] : string;
    /**
     * @deprecated as of 3.2.20
     */
    source?: string;
    /**
     * @deprecated as of 3.2.20
     */
    identifier?: string;
  };
  children: BytecodeTemplate[]|string[];
};

/**
 * Haiku bytecode state.
 */
export type BytecodeState = {
  value: BytecodeStateType;
  type?: string;
  access?: string;
  getter?: () => BytecodeStateType;
  setter?: (param: BytecodeStateType) => void;
};

/**
 * Haiku bytecode state list.
 */
export type BytecodeStates = {
  [stateName: string]: BytecodeState;
};

/**
 * Haiku bytecode function `handler` for an specific `eventName`. 
 */
export type BytecodeEventHandler = {
  [eventName: string]: {handler: (any) => any};
};

/**
 * Tuples of `elementName` and `BytecodeEventHandler`. 
 */
export type BytecodeEventHandlers = {
  [elementName: string]: BytecodeEventHandler;
};

/**
 * Value of an element property in a given frame. 
 */
export type BytecodeTimelineValue = {
  value: (boolean|string|number|((any) => BytecodeStateType));
  edited?: boolean;
  curve?: string;
};

/**
 * Map `propertyName` to a list of `frameNum` and its given `BytecodeTimelineValue`.
 * *Most* of tests use frameNum as string.
 */
export type BytecodeElementTimeline = {
  [propertyName: string]: {[key in string]: BytecodeTimelineValue};
};

/**
 * Tuples of `elementName` and `BytecodeElementTimeline`. 
 */
export type BytecodeTimeline = {
  [elementName: string]: BytecodeElementTimeline;
};

/**
 * Tuples of `timelineName` and `BytecodeTimeline`. 
 */
export type BytecodeTimelines = {
  [timelineName: string]: BytecodeTimeline;
};
  
/**
 * Haiky bytecode metadata. 
 */
export type BytecodeMetadata = {
  folder?: string;
  uuid: string;
  /**
   * @deprecated as of 3.2.20
   */
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
  title?: string;
};

/**
 * Properties. 
 */
export type BytecodeProperties = {
  name: string;
  type: string;
  value: number;
};

/**
 * Bytecode definition. Properties are *rarely* used.
 */
type HaikuBytecode = {
  template: BytecodeTemplate | string;
  states?: BytecodeStates;
  eventHandlers: BytecodeEventHandlers;
  timelines: BytecodeTimelines;
  metadata?: BytecodeMetadata;
  /**
   * @deprecated as of 3.2.20
   */
  properties?: BytecodeProperties[];
  options?: any
};

export default HaikuBytecode;
