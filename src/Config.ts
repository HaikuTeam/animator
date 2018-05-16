/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {InteractionMode} from './helpers/interactionModes';
import {BytecodeOptions} from './api/HaikuBytecode';

export const DEFAULTS: BytecodeOptions = {
  seed: null,
  timestamp: null,
  automount: true,
  autoplay: true,
  forceFlush: false,
  freeze: false,
  loop: false,
  frame: null,
  clock: {},
  sizing: null,
  alwaysComputeSizing: false,
  preserve3d: 'auto',
  contextMenu: 'enabled',
  position: 'relative',
  overflowX: null,
  overflowY: null,
  overflow: null,
  mixpanel: '6f31d4f99cf71024ce27c3e404a79a61',
  useWebkitPrefix: void (0),
  interactionMode: InteractionMode.LIVE,
  states: null,
  eventHandlers: null,
  timelines: null,
  vanities: null,
  children: null,
  placeholder: null,
};

function seed() {
  return Math.random().toString(36).slice(2);
}

const CONFIG_KEYS_TO_MERGE = {
  states: true,
  eventHandlers: true,
  timelines: true,
  vanities: true,
  initialStates: true,
};

function build(...argums) {
  const config = {};

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
  if (config['overflow'] && (config['overflowX'] || config['overflowY'])) {
    console.warn('[haiku core] `overflow` overrides `overflowY`/`overflowX`');
    config['overflowX'] = null;
    config['overflowY'] = null;
  }

  return config;
}

export default {
  build,
  seed,
  DEFAULTS,
};
