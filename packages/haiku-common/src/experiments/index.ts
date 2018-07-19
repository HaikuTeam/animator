import {getExperimentConfig} from './config';

/**
 * Canonical experiment IDs for features and experiments.
 * TODO: Switch to numeric experiment IDs when possible.
 * @see {@link https://git.io/vdyLb}
 * @enum {string}
 */
export enum Experiment {
  HideInstantiatedElementUntilTimeInstantiated = 'HideInstantiatedElementUntilTimeInstantiated',
  MergeDesignChangesAtCurrentTime = 'MergeDesignChangesAtCurrentTime',
  CommentsOnStage = 'CommentsOnStage',
  AsyncClientActions = 'AsyncClientActions',
  NormalizeSvgContent = 'NormalizeSvgContent',
  BasicOfflineMode = 'BasicOfflineMode',
  MultiComponentControlsLibrary = 'MultiComponentControlsLibrary',
  ShowSubElementsInJitMenu = 'ShowSubElementsInJitMenu',
  BaseModelQueryCache = 'BaseModelQueryCache',
  ComponentInfoInspector = 'ComponentInfoInspector',
  AdvancedMultiTransform = 'AdvancedMultiTransform',
  OutliningElementsOnStage = 'OutliningElementsOnStage',
  OutliningElementsOnStageFromStage = 'OutliningElementsOnStageFromStage',
  DirectSelectionOfPrimitives = 'DirectSelectionOfPrimitives',
  IpcIntegrityCheck = 'IpcIntegrityCheck',
  CrashOnIpcIntegrityCheckFailure = 'CrashOnIpcIntegrityCheckFailure',
  IncludeSourceInIntegrityHash = 'IncludeSourceInIntegrityHash',
  OrderedActionStack = 'OrderedActionStack',
  CodeEditor = 'CodeEditor',
  WarnOnUndefinedStateVariables = 'WarnOnUndefinedStateVariables',
  NativeTimelineScroll = 'NativeTimelineScroll',
  TimelineMarqueeSelection = 'TimelineMarqueeSelection',
  LocalAssetExport = 'LocalAssetExport',
  UserConsole = 'UserConsole',
  AllowBitmapImages = 'AllowBitmapImages',
  SizeInsteadOfScaleWhenPossible = 'SizeInsteadOfScaleWhenPossible',
  CleanInitialLibraryState = 'CleanInitialLibraryState',
  CopyPasteTweens = 'CopyPasteTweens',
  CopyPasteTweensWithAccelerators = 'CopyPasteTweensWithAccelerators',
  Snapping = 'Snapping',
  PinchToZoomInGlass = 'PinchToZoomInGlass',
  PreserveFrontMatterInCode = 'PreserveFrontMatterInCode',
  UserFacingDevTools = 'UserFacingDevTools',
  SendLogMessagesToPlumbing = 'SendLogMessagesToPlumbing',
  ControlFlowIf = 'ControlFlowIf',
  ControlFlowRepeat = 'ControlFlowRepeat',
}

/**
 * Store the experiment configuration in a module-local. The format is:
 *
 *   {
 *     "ExperimentName": {
 *       "development": true,
 *       "release": false
 *     },
 *     ...
 *   }
 *
 * We'll lazily read the config from experiments.json when it is requested for the first time.
 */
type ExperimentConfig = {[key in Experiment]: boolean};
let experimentConfig: ExperimentConfig;

/**
 * Store the experiment cache as a module-local.
 *
 * We'll cache the result of checking each experiment status and use the cached version if available.
 * This will ensure the experiment status is the same throughout a session.
 */
type ExperimentCache = {[key in Experiment]: boolean};
const experimentCache = {} as ExperimentCache;

export const clearExperimentCache = () => {
  experimentConfig = null;
  Object.keys(experimentCache).forEach((experimentId) => {
    delete experimentCache[experimentId];
  });
};

export const experimentIsEnabled = (experiment: Experiment): boolean => {
  if (!experimentConfig) {
    experimentConfig = getExperimentConfig();
  }

  if (!experimentConfig.hasOwnProperty(experiment)) {
    throw new Error(`Unknown experiment: ${experiment}`);
  }

  if (experimentCache.hasOwnProperty(experiment)) {
    return experimentCache[experiment];
  }

  return experimentCache[experiment] = experimentConfig[experiment] || false;
};
