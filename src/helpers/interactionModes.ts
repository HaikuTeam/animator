/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

/**
 * Interaction mode types.
 * @namespace {object}
 */
// tslint:disable-next-line:no-namespace
export namespace InteractionMode {
  export const EDIT = 0; // Default mode, all is editable
  export const LIVE = 1; // Live mode
}

/**
 * @method isPreviewMode
 * @argument mode The mode to compare, must ve a valid InteractionMode type.
 * @description Utility that returns a boolean indicating if the provided
 * mode is 'preview' mode.
 * @returns boolean
 */
export function isPreviewMode (mode: number): boolean {
  return mode === InteractionMode.LIVE;
}

/**
 * @method isLiveMode
 * @argument mode The mode to compare, must ve a valid InteractionMode type.
 * @description Utility that returns a boolean indicating if the provided
 * mode is 'preview' mode.
 * @returns boolean
 */
export function isLiveMode (mode): boolean {
  return isPreviewMode(mode);
}
