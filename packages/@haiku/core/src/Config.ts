/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {InteractionMode} from './helpers/interactionModes';

export const DEFAULTS = {
  // seed: String
  // Random seed used for producing deterministic randomness and namespacing CSS selector behavior
  seed: null,

  // timestamp: Integer
  // Timestamp reflecting the point in time that rendering begin, for deterministic timestamp production
  timestamp: null,

  // automount: Boolean
  // Whether we should mount the given context to the mount element automatically
  automount: true,

  // autoplay: Boolean
  // Whether we should begin playing the context's animation automatically
  autoplay: true,

  // forceFlush: Boolean
  // Whether to fully flush the component on every single frame (warning: this can severely deoptimize animation)
  forceFlush: false,

  // freeze: Boolean
  // Whether we should freeze timelines and not update per global timeline; useful in headless
  freeze: false,

  // loop: Boolean
  // Whether we should loop the animation, i.e. restart from the first frame after reaching the last
  loop: false,

  // frame: Function|null
  // Optional function that we will call on every frame, provided for developer convenience
  frame: null,

  // clock: Object|null
  // Configuration options that will be passed to the HaikuClock instance. See HaikuClock.js for info.
  clock: {},

  // sizing: String|null
  // Configures the sizing mode of the component; may be 'normal', 'stretch', 'contain', or 'cover'. See
  // HaikuComponent.js for info.
  sizing: null,

  // alwaysComputeSizing: Boolean|null
  // Whether we should always assume the size of the mount will change on every tick. There is a significant
  // performance boost for all non-'normal' sizing modes if we *don't* always assume this, but the size of the
  // mount might change underneath for reasons other than changes in media queries.
  alwaysComputeSizing: false,

  // preserve3d: String
  // Placeholder for an option to control whether to enable preserve-3d mode in DOM environments. [UNUSED]
  preserve3d: 'auto',

  // contextMenu: String
  // Whether or not the Haiku context menu should display when the component is right-clicked; may be 'enabled' or
  // 'disabled'.
  contextMenu: 'enabled',

  // position: String
  // CSS position setting for the root of the component in DOM; recommended to keep as 'relative'.
  position: 'relative',

  // overflowX: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without
  // needing a wrapper element.
  overflowX: null,

  // overflowY: String|null
  // CSS overflow-x setting for the component. Convenience for allows user to specify the overflow setting without
  // needing a wrapper element.
  overflowY: null,

  // overflow: String|null
  // CSS overflow setting for the component. Use this OR overflowX/overflowY
  overflow: null,

  // mixpanel: String|null
  // If provided, a Mixpanel tracking instance will be created using this string as the API token. The default token
  // is Haiku's production token.
  mixpanel: '6f31d4f99cf71024ce27c3e404a79a61',

  // useWebkitPrefix: boolean
  // Whether to prepend a webkit prefix to transform properties
  useWebkitPrefix: void (0),

  // interactionMode: object
  // Control how this instance handles interaction, e.g. preview mode
  interactionMode: InteractionMode.LIVE,

  // states: Object|null
  // Allow states to be passed in at runtime (ASSIGNED)
  states: null,

  // eventHandlers: Object|null
  // Allow custom event handlers to be passed in at runtime (ASSIGNED)
  eventHandlers: null,

  // timelines: Object|null
  // Allow timelines to be passed in at runtime (ASSIGNED)
  timelines: null,

  // vanities: Object|null
  // Allow vanities to be passed in at runtime (ASSIGNED)
  vanities: null,

  // children: Array|null
  // Children may be passed in, typically via the React adapter
  children: null,

  // placeholder: Object|null
  // Key/values representing placeholders to inject, usually via React adapter
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
