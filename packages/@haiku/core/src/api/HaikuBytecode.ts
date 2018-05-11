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
  /*  Had to change children type from BytecodeTemplate[]|string[], as union 
   *  types do not have call signature (eg. cannot use forEach). More indo
   *  at https://stackoverflow.com/a/47493372/1524655 and
   *  https://github.com/Microsoft/TypeScript/issues/7294#issuecomment-380586802
   */
  children: (BytecodeTemplate|string)[];
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
  value: (BytecodeStateType|((any) => BytecodeStateType));
  edited?: boolean;
  curve?: any;
};


/**
 * Map `frameNum` to a to a `BytecodeTimelineValue`.
 */
export type BytecodeTimelineProperty = {[frameNum: string]: BytecodeTimelineValue};


/**
 * Map `propertyName` to a `BytecodeTimelineProperty` 
 */
export type BytecodeTimelineProperties = {
  [propertyName: string]: BytecodeTimelineProperty;
};

/**
 * Tuples of `haikuId` and `BytecodeTimelineProperties`. 
 */
export type BytecodeTimeline = {
  [haikuId: string]: BytecodeTimelineProperties;
};

/**
 * Tuples of `timelineName` and `BytecodeTimeline`. 
 */
export type BytecodeTimelines = {
  [timelineId: string]: BytecodeTimeline;
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
export type HaikuBytecode = {
  template: BytecodeTemplate;
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

