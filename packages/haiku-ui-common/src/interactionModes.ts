/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */
export * from '@haiku/core/lib/helpers/interactionModes';

import {
  InteractionMode as CoreInteractionMode,
  isPreviewMode
} from '@haiku/core/lib/helpers/interactionModes';


/**
 * Interaction mode types.
 * @namespace {object}
 */
// tslint:disable-next-line:no-namespace
export namespace InteractionMode {
  export const GLASS_EDIT = CoreInteractionMode.EDIT; // Default mode, all is editable
  export const GLASS_LIVE = CoreInteractionMode.LIVE; // Preview mode
  export const CODE_EDITOR = 2; // Code editor mode
}

export function isEditMode (mode: number): boolean {
  return mode === InteractionMode.GLASS_EDIT;
}

export function isCodeEditorMode (mode: number): boolean {
  return mode === InteractionMode.CODE_EDITOR;
}

export function showGlassOnStage (mode: number): boolean {
  return isPreviewMode(mode) || isEditMode(mode);
}