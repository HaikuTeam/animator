/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import HaikuContext from './../../HaikuContext';
import dom from './../../renderers/dom';

const pkg = require('./../../../package.json');
const PLAYER_VERSION = pkg.version;

/**
 * Example ways in which the export of this module is invoked:
 *
 * // via embed snippet
 * window.HaikuPlayer['2.0.125'](require('./code/main/code.js'))
 *
 * // via module require
 * var HaikuDOMAdapter = require('@haiku/player/dom')
 * module.exports = HaikuDOMAdapter(require('./code/main/code.js'))
 */

/**
 * @function HaikuDOMAdapter
 * @description Given a bytecode object, return a factory function which can create a DOM-playable component.
 */
// tslint:disable-next-line:function-name
export default function HaikuDOMAdapter(bytecode, config, safeWindow) {
  if (!config) {
    // tslint:disable-next-line:no-parameter-reassignment
    config = {};
  }

  if (!config.options) {
    config.options = {};
  }

  if (!safeWindow) {
    if (typeof window !== 'undefined') {
      // tslint:disable-next-line:no-parameter-reassignment
      safeWindow = window;
    }
  }

  if (config.options.useWebkitPrefix === undefined) {
    // Allow headless mode, e.g. in server-side rendering or in Node.js unit tests
    if (safeWindow && safeWindow.document) {
      config.options.useWebkitPrefix = 'WebkitAppearance' in safeWindow.document.documentElement.style;
    }
  }

  return HaikuContext['createComponentFactory'](
    dom,
    bytecode,
    config, // Note: Full config object, of which options is one property!
    safeWindow,
  );
}

HaikuDOMAdapter['defineOnWindow'] = function () {
  // Allow multiple players of different versions to exist on the same page
  if (typeof window !== 'undefined') {
    if (!window['HaikuResolve']) {
      window['HaikuResolve'] = (playerVersion) => {
        const matches = playerVersion.match(/^(\d+)\.(\d+)\.(\d+)$/);
        if (!matches) {
          return undefined;
        }
        const [_, major, minor, patch] = matches;
        const compatibleVersions = Object.keys(window['HaikuPlayer'])
          .map((semver) => semver.split('.'))
          .filter((semverParts) => {
            if (semverParts.length !== 3 || semverParts[0] !== major) {
              return false;
            }

            return semverParts[1] >= minor && ((semverParts[1] > minor) ? true : semverParts[2] >= patch);
          });
        if (compatibleVersions.length === 0) {
          return undefined;
        }
        compatibleVersions.sort(([_, aMinor, aPatch], [__, bMinor, bPatch]) => {
          if (aMinor < bMinor) {
            return -1;
          }
          if (aMinor > bMinor) {
            return 1;
          }
          return aPatch < bPatch ? -1 : 1;
        });

        return window['HaikuPlayer'][compatibleVersions[compatibleVersions.length - 1].join('.')];
      };
    }

    if (!window['HaikuPlayer']) {
      window['HaikuPlayer'] = {};
    }

    window['HaikuPlayer'][PLAYER_VERSION] = HaikuDOMAdapter;
  }
};

HaikuDOMAdapter['defineOnWindow']();
