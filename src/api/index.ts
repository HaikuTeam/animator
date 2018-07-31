import HaikuBase from '../HaikuBase';
import HaikuClock from '../HaikuClock';
import {RFO} from '../reflection/functionToRFO';

export interface IHaikuElement extends HaikuBase {
  tagName: string|HaikuBytecode;
  node: BytecodeNode;
  target?: Element;
  originX: number;
  originY: number;
  visit: (
    iteratee: (component: IHaikuElement) => any,
    filter?: (value: IHaikuElement, index: number, array: IHaikuElement[]) => boolean,
  ) => any;
  getComponentId: () => string;
  getNearestDefinedNonZeroAncestorSizeX: () => number;
  getNearestDefinedNonZeroAncestorSizeY: () => number;
}

export interface IHaikuComponent extends IHaikuElement {
  bytecode: HaikuBytecode;
  config: BytecodeOptions;
  context: IHaikuContext;
  doPreserve3d: boolean;
  state: {[key in string]: any};
  host?: IHaikuComponent;
  eachEventHandler: (
    iteratee: (eventSelector: string, eventName: string, descriptor: BytecodeEventHandlerDescriptor) => void,
  ) => void;
  clearCaches: () => void;
  markForFullFlush: () => void;
  getClock: () => HaikuClock;
  emitFromRootComponent: (eventName: string, attachedObject: any) => void;
  routeEventToHandlerAndEmit: (eventSelectorGiven: string, eventNameGiven: string, eventArgs: any) => void;
  getTimelineDescriptor: (timelineName: string) => BytecodeTimeline;
}

export interface MountLayout {
  layout?: {
    computed: {
      size: {
        x: number;
        y: number;
      };
    };
  };
}

export interface IRenderer {
  mount?: Element;
  mountEventListener: (component: IHaikuComponent, selector: string, name: string, listener: Function) => void;
}

export interface IHaikuContext {
  // #FIXME: This is not necessarily going to be the renderer.
  renderer: IRenderer;
  config: BytecodeOptions;
  clock: HaikuClock;
  getClock: () => HaikuClock;
  getContainer: (doForceRecalc: boolean) => MountLayout;
  getGlobalUserState: () => any;
  contextMount: () => void;
  contextUnmount: () => void;
  tick: () => void;
  assignConfig: (config: BytecodeOptions, options?: {skipComponentAssign?: boolean}) => void;
}

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
export interface BytecodeSummonable {
  (...params: any[]): BytecodeStateType;
  specification: RFO;
}

/**
 * All possible types for timeline property value
 */
export type BytecodeInjectable = BytecodeStateType|BytecodeSummonable;

export interface BytecodeNodeAttributes {
  [attribute: string]: any;
  style?: {
    [key in string]: PrimitiveType;
    };
  /**
   * @deprecated
   */
  source?: string;
  identifier?: string;
}

export type PlaceholderSurrogate = any;

export interface RepeaterSpec {
  changed: boolean;
  instructions: any[];
  repeatees: BytecodeNode[];
}

export interface RepeateeSpec {
  index: number;
  instructions: any[];
  payload: any;
  source: BytecodeNode;
}

export interface IfSpec {
  answer: boolean;
}

export interface PlaceholderSpec {
  surrogate: PlaceholderSurrogate;
}

export interface BytecodeNodeMemoryObject {
  context?: IHaikuContext;
  element?: IHaikuElement;
  content?: string[];
  children?: (string|BytecodeNode)[];
  if?: IfSpec;
  instance?: IHaikuComponent;
  listener?: Function; // Bound event listener function
  parent?: BytecodeNode;
  patched?: boolean;
  placeholder?: PlaceholderSpec;
  repeatee?: RepeateeSpec;
  repeater?: RepeaterSpec;
  scope?: string;
  subcomponent?: IHaikuComponent;
  targets?: any[]; // DOM (or platform-specific) render targets
}

/**
 * Haiku bytecode element tree. eg. <div><svg>...</svg></div>.
 * `source` and `identifier` are rarely used.
 */
export interface BytecodeNode {
  elementName: string|HaikuBytecode;
  attributes: BytecodeNodeAttributes;
  isRootNode?: boolean;
  layout?: LayoutSpec;
  children: (BytecodeNode|string)[];
  __memory?: BytecodeNodeMemoryObject;

  /**
   * @deprecated
   */
  rect?: DomRect;
}

export type MaybeBytecodeNode = BytecodeNode|null;

/**
 * Haiku bytecode state.
 */
export interface BytecodeState {
  value: BytecodeStateType;
  type?: string;
  access?: string;
  edited?: boolean;
  mock?: boolean;
  getter?: () => BytecodeStateType;
  setter?: (param: BytecodeStateType) => void;
}

/**
 * Haiku bytecode state list.
 */
export interface BytecodeStates {
  [stateName: string]: BytecodeState;
}

/**
 * Haiku bytecode function `handler` for a specific `eventSelector`.
 */
export interface BytecodeEventHandlerCallable {
  (target?: any, event?: any): void;
  __rfo?: RFO;
}

export interface BytecodeEventHandlerDescriptor {
  handler: BytecodeEventHandlerCallable;
}

export interface BytecodeEventHandler {
  [eventSelector: string]: BytecodeEventHandlerDescriptor;
}

/**
 * Tuples of `elementName` and `BytecodeEventHandler`.
 */
export interface BytecodeEventHandlers {
  [elementName: string]: BytecodeEventHandler;
}

/**
 * Value of an element property in a given frame.
 */
export interface BytecodeTimelineValue {
  value: BytecodeInjectable;
  edited?: boolean;
  curve?: CurveDefinition;
}

/**
 * Map `frameNum` to a to a `BytecodeTimelineValue`.
 */
export interface BytecodeTimelineProperty {
  [frameNum: string]: BytecodeTimelineValue;
}

/**
 * Map `propertyName` to a `BytecodeTimelineProperty`
 */
export interface BytecodeTimelineProperties {
  [propertyName: string]: BytecodeTimelineProperty;
}

/**
 * Tuples of `haikuId` and `BytecodeTimelineProperties`.
 */
export interface BytecodeTimeline {
  [haikuId: string]: BytecodeTimelineProperties;
}

/**
 * Tuples of `timelineName` and `BytecodeTimeline`.
 */
export interface BytecodeTimelines {
  [timelineId: string]: BytecodeTimeline;
}

/**
 * Haiku bytecode metadata.
 */
export interface BytecodeMetadata {
  folder?: string;
  uuid?: string;
  player?: string;
  type?: string;
  name?: string;
  relpath?: string;
  core?: string;
  version?: string;
  username?: string;
  organization?: string;
  project?: string;
  branch?: string;
  title?: string;

  /**
   * @deprecated as of 3.2.20
   */
}

export type ComponentEventHandler = (component: IHaikuComponent) => void;

/**
 * Bytecode options.
 */
export interface BytecodeOptions {
  // Random seed used for producing deterministic randomness
  // and namespacing CSS selector behavior
  seed?: string;

  // Timestamp reflecting the point in time that rendering begin,
  // for deterministic timestamp production
  timestamp?: number;

  // Whether we should mount the given context to the mount
  // element automatically
  automount?: boolean;

  // Whether we should begin playing the context's animation automatically
  autoplay?: boolean;

  // If enabled (e.g. in the Haiku desktop app), bytecode is not cloned when a component is instantiated, and made be
  // live-edited.
  hotEditingMode?: boolean;

  // Whether to fully flush the component on every single frame
  // (warning: this can severely deoptimize animation)
  forceFlush?: boolean;

  // Whether we should freeze timelines and not update per global
  // timeline; useful in headless
  freeze?: boolean;

  // Whether we should loop the animation, i.e. restart from
  // the first frame after reaching the last
  loop?: boolean;

  // Optional function that we will call on every frame, provided
  // for developer convenience
  frame?: (() => void);

  // Configuration options that will be passed to the HaikuClock instance.
  // See HaikuClock.js for info.
  clock?: object;

  // Configures the sizing mode of the component; may be 'normal',
  // 'stretch', 'contain', or 'cover'. See HaikuComponent.js for info.
  sizing?: string;

  // Whether we should always assume the size of the mount will change on every tick. There is a significant
  // performance boost for all non-'normal' sizing modes if we *don't* always assume this, but the size of the
  // mount might change underneath for reasons other than changes in media queries. To be safe, we leave this on
  // by default.
  alwaysComputeSizing?: boolean;

  // Placeholder for an option to control whether to enable
  // preserve-3d mode in DOM environments. [UNUSED]
  preserve3d?: string;

  // Whether or not the Haiku context menu should display when the
  // component is right-clicked; may be 'enabled' or 'disabled'.
  contextMenu?: string;

  // CSS position setting for the root of the component in DOM;
  // recommended to keep as 'relative'.
  position?: string;

  // CSS overflow-x setting for the component. Convenience for allows user
  // to specify the overflow setting without needing a wrapper element.
  overflowX?: string;

  // CSS overflow-x setting for the component. Convenience for allows user
  // to specify the overflow setting without needing a wrapper element.
  overflowY?: string;

  // CSS overflow setting for the component. Use this OR overflowX/overflowY
  overflow?: string;

  // If provided, a Mixpanel tracking instance will be created using this
  // string as the API token. The default token is Haiku's production token.
  mixpanel?: string;

  // Control how this instance handles interaction, e.g. preview mode
  // TODO: create an use an enum from @haiku/core/src/helpers/interactionModes.ts
  interactionMode?: number;

  // A unique ID used during migrations.
  referenceUniqueness?: string;

  // Allow states to be passed in at runtime (ASSIGNED)
  states?: object;

  // Allow custom event handlers to be passed in at runtime (ASSIGNED)
  eventHandlers?: object;

  // Allow timelines to be passed in at runtime (ASSIGNED)
  timelines?: object;

  // Allow vanities to be passed in at runtime (ASSIGNED)
  vanities?: object;

  // Children may be passed in, typically via the React adapter
  children?: PrimitiveType[];

  // Key/values representing placeholders to inject, usually via React adapter
  placeholder?: object;

  // Event handlers.
  onHaikuComponentWillInitialize?: ComponentEventHandler;
  onHaikuComponentDidInitialize?: ComponentEventHandler;
  onHaikuComponentDidMount?: ComponentEventHandler;
  onHaikuComponentWillUnmount?: ComponentEventHandler;
}

/**
 * Bytecode definition. Properties are *rarely* used.
 */
export interface HaikuBytecode {
  template: BytecodeNode|string;
  states?: BytecodeStates;
  eventHandlers?: BytecodeEventHandlers;
  timelines: BytecodeTimelines;
  metadata?: BytecodeMetadata;
  methods?: {
    [key in string]: Function;
  };
  /**
   * @deprecated as of 3.2.20
   */
  properties?: any[];
  options?: BytecodeOptions;
}

export type Mat4 = number[];

export interface ThreeDimensionalLayoutProperty {
  x: number;
  y: number;
  z: number;
}

export interface DomRect {
  width: number;
  height: number;
  left: number;
  top: number;
}

// The layout specification naming in createLayoutSpec is derived in part from:
// https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
export interface LayoutSpec {
  shown: boolean;
  opacity: number;
  offset: ThreeDimensionalLayoutProperty;
  origin: ThreeDimensionalLayoutProperty;
  translation: ThreeDimensionalLayoutProperty;
  rotation: ThreeDimensionalLayoutProperty;
  scale: ThreeDimensionalLayoutProperty;
  sizeMode: ThreeDimensionalLayoutProperty;
  sizeProportional: ThreeDimensionalLayoutProperty;
  sizeDifferential: ThreeDimensionalLayoutProperty;
  sizeAbsolute: ThreeDimensionalLayoutProperty;

  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };

  shear: {
    xy: number;
    xz: number;
    yz: number;
  };

  matrix?: Mat4;
  format?: number;

  computed?: ComputedLayoutSpec;
}

export interface LayoutSpecPartial {
  shown?: boolean;
  opacity?: number;
  mount?: ThreeDimensionalLayoutProperty;
  offset?: ThreeDimensionalLayoutProperty;
  origin?: ThreeDimensionalLayoutProperty;
  translation?: ThreeDimensionalLayoutProperty;
  rotation?: ThreeDimensionalLayoutProperty;
  scale?: ThreeDimensionalLayoutProperty;
  sizeMode?: ThreeDimensionalLayoutProperty;
  sizeProportional?: ThreeDimensionalLayoutProperty;
  sizeDifferential?: ThreeDimensionalLayoutProperty;
  sizeAbsolute?: ThreeDimensionalLayoutProperty;
  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  shear?: {
    xy: number;
    xz: number;
    yz: number;
  };
  computed: ComputedLayoutSpecPartial;
}

export interface ComputedLayoutSpec extends LayoutSpec {
  matrix: Mat4;
  size: ThreeDimensionalLayoutProperty;
  bounds: BoundsSpecPartial;
}

export interface ComputedLayoutSpecPartial {
  shown?: boolean;
  opacity?: number;
  mount?: ThreeDimensionalLayoutProperty;
  offset?: ThreeDimensionalLayoutProperty;
  origin?: ThreeDimensionalLayoutProperty;
  translation?: ThreeDimensionalLayoutProperty;
  rotation?: ThreeDimensionalLayoutProperty;
  scale?: ThreeDimensionalLayoutProperty;
  sizeMode?: ThreeDimensionalLayoutProperty;
  sizeProportional?: ThreeDimensionalLayoutProperty;
  sizeDifferential?: ThreeDimensionalLayoutProperty;
  sizeAbsolute?: ThreeDimensionalLayoutProperty;
  orientation?: {
    x: number;
    y: number;
    z: number;
    w: number;
  };
  shear?: {
    xy: number;
    xz: number;
    yz: number;
  };
  matrix: Mat4;
  size: ThreeDimensionalLayoutProperty;
  bounds: BoundsSpecPartial;
}

export interface StringableThreeDimensionalLayoutProperty {
  x: number|string;
  y: number|string;
  z: number|string;
}

export interface TwoPointFiveDimensionalLayoutProperty {
  x: number;
  y: number;
  z?: number;
}

export interface ClientRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export interface BoundsSpecX {
  left: number;
  right: number;
}

export interface BoundsSpecY {
  top: number;
  bottom: number;
}

export interface BoundsSpecZ {
  front: number;
  back: number;
}

export interface BoundsSpec extends BoundsSpecX, BoundsSpecY, BoundsSpecZ {}

export interface BoundsSpecPartial {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  front?: number;
  back?: number;
}

export type AxisString = 'x'|'y'|'z';

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
 * Defines a normalized curve, to be used in BytecodeTimelineValue and also in
 * state transition
 */
export type CurveFunction = ((offset: number) => number);

/**
 * Can be a function or a string from just-curves. The string is
 * converted into CuverFunction inside Interpolate
 */
export type CurveDefinition = Curve|CurveFunction|number[];

export interface ParsedValueCluster {
  parsee: {
    [ms: number]: {
      expression?: boolean;
      value: any;
      curve?: CurveDefinition;
    };
  };
  keys: number[];
}
