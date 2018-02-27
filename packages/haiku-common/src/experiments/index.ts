import {EnvironmentType, getEnvironmentType} from '../environments';
import {getExperimentConfig} from './config';

/**
 * Canonical experiment IDs for features and experiments.
 * TODO: Switch to numeric experiment IDs when possible.
 * @see {@link https://git.io/vdyLb}
 * @enum {string}
 */
export enum Experiment {
  LottieExportInGlobalMenu = 'LottieExportInGlobalMenu',
  MultiComponentFeatures = 'MultiComponentFeatures',
  JustInTimeProperties = 'JustInTimeProperties',
  InstantiationOfPrimitivesAsComponents = 'InstantiationOfPrimitivesAsComponents',
  HideInstantiatedElementUntilTimeInstantiated = 'HideInstantiatedElementUntilTimeInstantiated',
  MergeDesignChangesAtCurrentTime = 'MergeDesignChangesAtCurrentTime',
  CommentsOnStage = 'CommentsOnStage',
  AsyncClientActions = 'AsyncClientActions',
  NoNormalizeOnSetup = 'NoNormalizeOnSetup',
  SvgOptimizer = 'SvgOptimizer',
  NewPublishUI = 'NewPublishUI',
  NormalizeSvgContent = 'NormalizeSvgContent',
  BasicOfflineMode = 'BasicOfflineMode',
  MultiComponentControlsLibrary = 'MultiComponentControlsLibrary',
  ShowSubElementsInJitMenu = 'ShowSubElementsInJitMenu',
  ElementMultiSelectAndTransform = 'ElementMultiSelectAndTransform',
  BaseModelQueryCache = 'BaseModelQueryCache',
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
type ExperimentConfig = {[key in Experiment]: {[key in EnvironmentType]: boolean}};
let experimentConfig: ExperimentConfig;

/**
 * Store the experiment cache as a module-local.
 *
 * We'll cache the result of checking each experiment status and use the cached version if available.
 * This will ensure the experiment status is the same throughout a session.
 */
type ExperimentCache = {[key in Experiment]: boolean};
const experimentCache = {} as ExperimentCache;

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

  return experimentCache[experiment] = experimentConfig[experiment][getEnvironmentType()] || false;
};
