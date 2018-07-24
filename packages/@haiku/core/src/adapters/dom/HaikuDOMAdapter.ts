/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeOptions, HaikuBytecode} from '../../api';
import HaikuContext, {ComponentFactory} from './../../HaikuContext';
import dom from './../../renderers/dom';

const pkg = require('./../../../package.json');
const VERSION = pkg.version;

export interface DOMAdapter {
  (bytecode: HaikuBytecode, config?: BytecodeOptions, safeWindow?: Window): ComponentFactory;
  defineOnWindow?: () => void;
}

export declare interface AdaptedScreen extends Screen {
  availLeft: number;
  orientation: {
    angle: number;
    type: string;
  };
}

export declare interface AdaptedDocument extends Document {
  contentType: string;
  documentURI: string;
  fullscreen: boolean;
}

export declare interface AdaptedWindow extends Window {
  HaikuResolve?: (playerVersion: string) => DOMAdapter|undefined;
  HaikuCore?: {[key in string]: DOMAdapter};
  mixpanel?: any;
  screen: AdaptedScreen;
  document: AdaptedDocument;
}

declare var window: AdaptedWindow;

/**
 * Example ways in which the export of this module is invoked:
 *
 * // via embed snippet
 * window.HaikuPlayer['2.0.125'](require('./code/main/code.js')) // #LEGACY
 * window.HaikuCore['2.0.125'](require('./code/main/code.js'))
 *
 * // via module require
 * var HaikuDOMAdapter = require('@haiku/core/dom')
 * module.exports = HaikuDOMAdapter(require('./code/main/code.js'))
 */

/**
 * @function HaikuDOMAdapter
 * @description Given a bytecode object, return a factory function which can create a DOM-playable component.
 */
// tslint:disable-next-line:variable-name
const HaikuDOMAdapter: DOMAdapter = (bytecode, config?, safeWindow?) => {
  if (!config) {
    // tslint:disable-next-line:no-parameter-reassignment
    config = {};
  }

  if (!safeWindow) {
    if (typeof window !== 'undefined') {
      // tslint:disable-next-line:no-parameter-reassignment
      safeWindow = window;
    }
  }

  return HaikuContext.createComponentFactory(
    dom,
    bytecode,
    config, // Note: Full config object, of which options is one property!
    safeWindow,
  );
};

HaikuDOMAdapter.defineOnWindow = () => {
  // Allow multiple instances of different versions to exist on the same page
  if (typeof window !== 'undefined') {
    if (!window.HaikuResolve) {
      const haikuResolutions = {};
      window.HaikuResolve = (playerVersion) => {
        if (haikuResolutions[playerVersion]) {
          return haikuResolutions[playerVersion];
        }
        const matches = playerVersion.match(/^(\d+)\.(\d+)\.(\d+)$/).map(Number);
        if (!matches) {
          return;
        }
        const [_, major, minor, patch] = matches;
        const compatibleVersions = Object.keys(window.HaikuCore)
          .map((semver) => semver.split('.').map(Number))
          .filter((semverParts) => {
            if (semverParts.length !== 3 || semverParts[0] !== major) {
              return false;
            }

            return semverParts[1] >= minor && ((semverParts[1] > minor) ? true : semverParts[2] >= patch);
          });
        if (compatibleVersions.length === 0) {
          return;
        }
        compatibleVersions.sort(([__, aMinor, aPatch], [___, bMinor, bPatch]) => {
          if (aMinor < bMinor) {
            return -1;
          }
          if (aMinor > bMinor) {
            return 1;
          }
          return aPatch < bPatch ? -1 : 1;
        });

        return haikuResolutions[playerVersion] =
          window.HaikuCore[compatibleVersions[compatibleVersions.length - 1].join('.')];
      };
    }

    if (!window.HaikuCore) {
      window.HaikuCore = {};
    }

    window.HaikuCore[VERSION] = HaikuDOMAdapter;
  }
};

HaikuDOMAdapter.defineOnWindow();

export default HaikuDOMAdapter;
