/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

/**
 * Interaction mode types.
 * @namespace {object}
 */
// tslint:disable-next-line:no-namespace
export namespace InteractionMode {
  export const GLASS_EDIT = 0; // Default mode, all is editable
  export const GLASS_LIVE = 1; // Preview mode
  export const CODE_EDITOR = 2; // Code editor mode
}

/**
 * @method isPreviewMode
 * @argument mode The mode to compare, must ve a valid InteractionMode type.
 * @description Utility that returns a boolean indicating if the provided
 * mode is 'preview' mode.
 * @returns boolean
 */
export function isPreviewMode (mode): boolean {
  return mode === InteractionMode.GLASS_LIVE;
}

export function isEditMode (mode): boolean {
  return mode === InteractionMode.GLASS_EDIT;
}

export function isCodeEditorMode (mode): boolean {
  return mode === InteractionMode.CODE_EDITOR;
}

export function showGlassOnStage (mode): boolean {
  return isPreviewMode(mode) || isEditMode(mode);
}

/**
 * @method isPreviewMode
 * Alias for isPreviewMode more befitting of @haiku/core usage outside of the Haiku app.
 */
export function isLiveMode (mode): boolean {
  return isPreviewMode(mode);
}
