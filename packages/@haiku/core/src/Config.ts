/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeOptions} from './api';
import {InteractionMode} from './helpers/interactionModes';

export const DEFAULTS: BytecodeOptions = {
  alwaysComputeSizing: false,
  automount: true,
  autoplay: true,
  children: null,
  clock: {},
  contextMenu: 'enabled',
  eventHandlers: null,
  folder: null,
  forceFlush: false,
  frame: null,
  freeze: false,
  helpers: null,
  hooks: null,
  interactionMode: InteractionMode.LIVE,
  loop: false,
  mixpanel: '6f31d4f99cf71024ce27c3e404a79a61',
  overflow: null,
  overflowX: null,
  overflowY: null,
  placeholder: null,
  position: 'relative',
  preserve3d: 'auto',
  seed: null,
  sizing: null,
  states: null,
  timelines: null,
  timestamp: null,
  vanities: null,
};

/**
 * Configuration from HaikuContext is forwarded to all HaikuComponent instances in its tree.
 * For child instances, certain settings (such as `loop`) give unexpected behavior and
 * other settings (such as `states`) don't make much sense to pass down. This specifies the
 * settings that are considered safe to forward from the context to all subcomponents.
 */
const CHILD_SAFE_CONFIG = {
  alwaysComputeSizing: true,
  clock: true,
  contextMenu: true,
  folder: true,
  freeze: true,
  interactionMode: true,
  mixpanel: true,
  overflow: true,
  overflowX: true,
  overflowY: true,
  preserve3d: true,
  seed: true,
  sizing: true,
  timestamp: true,
};

const buildChildSafeConfig = (config: BytecodeOptions): BytecodeOptions => {
  const out = {};

  for (const key in config) {
    if (CHILD_SAFE_CONFIG[key]) {
      out[key] = config[key];
    }
  }

  return out;
};

function seed () {
  return Math.random().toString(36).slice(2);
}

const CONFIG_KEYS_TO_MERGE = {
  states: true,
  eventHandlers: true,
  timelines: true,
  helpers: true,
  vanities: true,
  initialStates: true,
};

function build (...argums): BytecodeOptions {
  const config: BytecodeOptions = {};

  const args = [...argums];

  args.unshift(DEFAULTS);

  args.forEach((incoming) => {
    if (!incoming || typeof incoming !== 'object') {
      return;
    }

    for (const key in incoming) {
      if (incoming[key] === undefined) {
        continue;
      }

      if (CONFIG_KEYS_TO_MERGE[key]) {
        if (!config[key]) {
          config[key] = {};
        }

        config[key] = {
          ...config[key],
          ...incoming[key],
        };
      } else {
        config[key] = incoming[key];
      }
    }
  });

  // Validations
  if (config.overflow && (config.overflowX || config.overflowY)) {
    console.warn('[haiku core] `overflow` overrides `overflowY`/`overflowX`');
    config.overflowX = null;
    config.overflowY = null;
  }

  return config;
}

export default {
  build,
  seed,
  DEFAULTS,
  buildChildSafeConfig,
};
