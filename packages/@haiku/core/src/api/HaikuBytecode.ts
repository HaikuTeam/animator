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
 * `BytecodeSummonable` defines functions that can be called on timeline 
 * property value
 */
export type BytecodeSummonable = ((param: any) => BytecodeStateType);


/** 
 * All possible types for timeline property value
 */ 
export type BytecodeInjectable = BytecodeStateType|BytecodeSummonable;

/**
 * Haiku bytecode element tree. eg. <div><svg>...</svg></div>.
 * `source` and `identifier` are rarely used.
 */
export type BytecodeNode = {
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
  // Children type changed from BytecodeNode[]|string[], as union 
  // types do not have call signature (eg. cannot use forEach). More indo
  // at https://stackoverflow.com/a/47493372/1524655 and
  // https://github.com/Microsoft/TypeScript/issues/7294#issuecomment-380586802
  children: (BytecodeNode|string)[];
};

/**
 * Haiku bytecode state.
 */
export type BytecodeState = {
  value: BytecodeStateType;
  type?: string;
  access?: string;
  edited?: boolean;
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
 * Haiku bytecode function `handler` for an specific `eventSelectors`. 
 */
export type BytecodeEventHandler = {
  [eventSelectors: string]: {handler: (target?: any, event?: any) => void};
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
  value: BytecodeInjectable;
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
 * Bytecode options. 
 */
export type BytecodeOptions = {
  // Random seed used for producing deterministic randomness 
  // and namespacing CSS selector behavior
  seed?: string,

  // Timestamp reflecting the point in time that rendering begin, 
  // for deterministic timestamp production
  timestamp?: number,

  // Whether we should mount the given context to the mount 
  // element automatically
  automount?: boolean,

  // Whether we should begin playing the context's animation automatically
  autoplay?: boolean,

  // Whether to fully flush the component on every single frame 
  // (warning: this can severely deoptimize animation)
  forceFlush?: boolean,

  // Whether we should freeze timelines and not update per global 
  // timeline; useful in headless
  freeze?: boolean,

  // Whether we should loop the animation, i.e. restart from 
  // the first frame after reaching the last
  loop?: boolean,

  // Optional function that we will call on every frame, provided 
  // for developer convenience
  frame?: (() => void)|null,

  // Configuration options that will be passed to the HaikuClock instance. 
  // See HaikuClock.js for info.
  clock?: object,

  // Configures the sizing mode of the component; may be 'normal', 
  // 'stretch', 'contain', or 'cover'. See HaikuComponent.js for info.
  sizing?: string,

  // Whether we should always assume the size of the mount will change on every tick. There is a significant
  // performance boost for all non-'normal' sizing modes if we *don't* always assume this, but the size of the
  // mount might change underneath for reasons other than changes in media queries. To be safe, we leave this on
  // by default.
  alwaysComputeSizing?: boolean,

  // Placeholder for an option to control whether to enable 
  // preserve-3d mode in DOM environments. [UNUSED]
  preserve3d?: string,

  // Whether or not the Haiku context menu should display when the 
  // component is right-clicked; may be 'enabled' or 'disabled'.
  contextMenu?: string,

  // CSS position setting for the root of the component in DOM; 
  // recommended to keep as 'relative'.
  position?: string,

  // CSS overflow-x setting for the component. Convenience for allows user 
  // to specify the overflow setting without needing a wrapper element.
  overflowX?: string,

  // CSS overflow-x setting for the component. Convenience for allows user 
  // to specify the overflow setting without needing a wrapper element.
  overflowY?: string,

  // CSS overflow setting for the component. Use this OR overflowX/overflowY
  overflow?: string,

  // If provided, a Mixpanel tracking instance will be created using this 
  // string as the API token. The default token is Haiku's production token.
  mixpanel?: string,

  // Whether to prepend a webkit prefix to transform properties
  useWebkitPrefix?: boolean,

  // Control how this instance handles interaction, e.g. preview mode
  // TODO: create an use an enum from @haiku/core/src/helpers/interactionModes.ts
  interactionMode?: number,

  // Allow states to be passed in at runtime (ASSIGNED)
  states?: object,

  // Allow custom event handlers to be passed in at runtime (ASSIGNED)
  eventHandlers?: object,

  // Allow timelines to be passed in at runtime (ASSIGNED)
  timelines?: object,

  // Allow vanities to be passed in at runtime (ASSIGNED)
  vanities?: object,

  // Children may be passed in, typically via the React adapter
  children?: PrimitiveType[],

  // Key/values representing placeholders to inject, usually via React adapter
  placeholder?: object,
};

/**
 * Bytecode definition. Properties are *rarely* used.
 */
export type HaikuBytecode = {
  template: BytecodeNode|string;
  states?: BytecodeStates;
  eventHandlers: BytecodeEventHandlers;
  timelines: BytecodeTimelines;
  metadata?: BytecodeMetadata;
  /**
   * @deprecated as of 3.2.20
   */
  properties?: any[];
  options?: BytecodeOptions
};

