/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import assign from './../../vendor/assign';
import tiny from './../../vendor/mixpanel-browser/tiny';

export default function createMixpanel(domElement, mixpanelToken, component) {
  const mixpanel = tiny();

  if (!mixpanel) {
    console.warn('[haiku player] mixpanel could not be initialized');
  }

  mixpanel.init(mixpanelToken, domElement);

  // Why not expose this so others, e.g. the share page, can hook into it?
  component.mixpanel = {
    // A little wrapper that makes sure the bytecode's metadata passes through with whatever else we passed
    track: function track(eventName, eventProperties) {
      const metadata = (component._bytecode && component._bytecode.metadata) || {};
      mixpanel.track(
        eventName,
        assign(
          {
            platform: 'dom',
          },
          metadata,
          eventProperties,
        ),
      );
    },
  };

  component.on('haikuComponentDidInitialize', () => {
    component.mixpanel.track('component:initialize');
  });
}
