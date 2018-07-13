import * as dedent from 'dedent';
import * as fse from 'fs-extra';
import * as path from 'path';
import {getAngularSelectorName, getHaikuCoreVersion} from './ProjectDefinitions';

export const bootstrapSceneFilesSync = (componentFolder: string, scenename: string, userconfig: any) => {
  const rootComponentId = getCodeJs(scenename, userconfig);

    // Only write these files if they don't exist yet; don't overwrite the user's own content
  if (!fse.existsSync(path.join(componentFolder, `code/${scenename}/code.js`))) {
    fse.outputFileSync(path.join(componentFolder, `code/${scenename}/code.js`), rootComponentId);
  }

  fse.outputFileSync(path.join(componentFolder, `code/${scenename}/dom.js`), DOM_JS);
  fse.outputFileSync(path.join(componentFolder, `code/${scenename}/dom-embed.js`),
    DOM_EMBED_JS(getHaikuCoreVersion()),
  );
  fse.outputFileSync(path.join(componentFolder, `code/${scenename}/react-dom.js`), REACT_DOM_JS);
  fse.outputFileSync(path.join(componentFolder, `code/${scenename}/angular-dom.js`),
    ANGULAR_DOM_JS(getAngularSelectorName(componentFolder, scenename), scenename),
  );
  fse.outputFileSync(path.join(componentFolder, `code/${scenename}/vue-dom.js`), VUE_DOM_JS);

  if (!fse.existsSync(path.join(componentFolder, `code/${scenename}/dom-standalone.js`))) {
    fse.outputFileSync(path.join(componentFolder, `code/${scenename}/dom-standalone.js`), DOM_STANDALONE_JS);
  }

  return rootComponentId;
};

const getCodeJs = (haikuComponentName: string, metadata = {}) => {
  return dedent`
    var Haiku = require("@haiku/core");
    module.exports = {
      metadata: ${JSON.stringify(metadata, null, 2)},
      options: {},
      states: {},
      eventHandlers: {},
      timelines: {
        Default: {}
      },
      template: {
        elementName: "div",
        attributes: {
          "haiku-title": "${haikuComponentName}"
        },
        children: []
      }
    };
  `.trim();
};

const DOM_JS = dedent`
  var HaikuDOMAdapter = require('@haiku/core/dom')
  module.exports = HaikuDOMAdapter(require('./code'))
`.trim();

const DOM_EMBED_JS = (coreVersion: string) => dedent`
  var code = require('./code')
  var adapter = window.HaikuResolve && window.HaikuResolve('${coreVersion}')
  if (adapter) {
    module.exports = adapter(code)
  } else  {
    function safety () {
      console.error(
        '[haiku core] core version ${coreVersion} seems to be missing. ' +
        'index.embed.js expects it at window.HaikuCore["${coreVersion}"], but we cannot find it. ' +
        'you may need to add a <script src="path/to/HaikuCore.js"></script> to fix this.'
      )
      return code
    }
    for (var key in code) {
      safety[key] = code[key]
    }
    module.exports = safety
  }
`.trim();

const DOM_STANDALONE_JS = dedent`
  module.exports = require('./dom')
`.trim();

const REACT_DOM_JS = dedent`
  var React = require('react') // Installed as a peer dependency of '@haiku/core'
  var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
  var HaikuReactAdapter = require('@haiku/core/dom/react')
  var HaikuReactComponent = HaikuReactAdapter(require('./dom'))
  if (HaikuReactComponent.default) HaikuReactComponent = HaikuReactComponent.default
  module.exports = HaikuReactComponent
`.trim();

const ANGULAR_DOM_JS = (selector: string, scene: string) => dedent`
  var HaikuAngularAdapter = require('@haiku/core/dom/angular')
  var HaikuAngularModule = HaikuAngularAdapter('${selector}${scene !== 'main' ? `-${scene}` : ''}', require('./dom'))
  module.exports = HaikuAngularModule
`.trim();

const VUE_DOM_JS = dedent`
  var HaikuVueAdapter = require('@haiku/core/dom/vue')
  var HaikuVueComponent = HaikuVueAdapter(require('./dom'))
  if (HaikuVueComponent.default) HaikuVueComponent = HaikuVueComponent.default
  module.exports = HaikuVueComponent
`.trim();
