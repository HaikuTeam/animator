/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import reifyRFO from './reflection/reifyRFO';
import HaikuComponent from './HaikuComponent';
import addLegacyOriginSupport from './helpers/addLegacyOriginSupport';
import compareSemver from './helpers/compareSemver';
import visitManaTree from './helpers/visitManaTree';
import xmlToMana from './helpers/xmlToMana';
import schema from './properties/dom/schema';
import functionToRFO from './reflection/functionToRFO';

const STRING_TYPE = 'string';

const enum UpgradeVersionRequirement {
  OriginSupport = '3.2.0',
  TimelineDefaultFrames = '3.2.23',
}

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
const HAIKU_VAR_ATTRIBUTE = 'haiku-var';

const requiresUpgrade = (coreVersion: string, requiredVersion: UpgradeVersionRequirement) => !coreVersion ||
  compareSemver(
    coreVersion,
    requiredVersion,
  ) < 0;

/**
 * @function run
 * @description Mechanism to modify our bytecode from legacy format to the current format.
 * Think of this like a migration that always runs in production components just in case we
 * get something that happens to be legacy.
 */
export const runMigrations = (component: HaikuComponent, options: any, version: string) => {
  const bytecode = component.bytecode;
  if (!bytecode.states) {
    bytecode.states = {};
  }

  if (!bytecode.metadata) {
    bytecode.metadata = {};
  }

  // Convert the properties array to the states dictionary
  if (bytecode.properties) {
    const properties = bytecode.properties;
    delete bytecode.properties;
    for (let i = 0; i < properties.length; i++) {
      const propertySpec = properties[i];
      const updatedSpec = {};
      if (propertySpec.value !== undefined) {
        updatedSpec['value'] = propertySpec.value;
      }
      if (propertySpec.type !== undefined) {
        updatedSpec['type'] = propertySpec.type;
      }
      if (propertySpec.setter !== undefined) {
        updatedSpec['set'] = propertySpec.setter;
      }
      if (propertySpec.getter !== undefined) {
        updatedSpec['get'] = propertySpec.getter;
      }
      if (propertySpec.set !== undefined) {
        updatedSpec['set'] = propertySpec.set;
      }
      if (propertySpec.get !== undefined) {
        updatedSpec['get'] = propertySpec.get;
      }
      bytecode.states[propertySpec.name] = updatedSpec;
    }
  }

  // Convert the eventHandlers array into a dictionary
  // [{selector:'foo',name:'onclick',handler:function}] => {'foo':{'onclick':{handler:function}}}
  if (Array.isArray(bytecode.eventHandlers)) {
    const eventHandlers = bytecode.eventHandlers;
    delete bytecode.eventHandlers;
    bytecode.eventHandlers = {};
    for (let j = 0; j < eventHandlers.length; j++) {
      const eventHandlerSpec = eventHandlers[j];
      if (!bytecode.eventHandlers[eventHandlerSpec.selector]) {
        bytecode.eventHandlers[eventHandlerSpec.selector] = {};
      }
      bytecode.eventHandlers[eventHandlerSpec.selector][eventHandlerSpec.name] = {
        handler: eventHandlerSpec.handler,
      };
    }
  }

  // Convert a string template into our internal object format
  if (typeof bytecode.template === STRING_TYPE) {
    bytecode.template = xmlToMana(bytecode.template);
  }

  // If specified, make sure that internal URL references, e.g. url(#my-filter), are unique
  // per each component instance, otherwise we will get filter collisions and weirdness on the page
  const referencesToUpdate = {};
  const alreadyUpdatedReferences = {};

  
  if (bytecode.template) {
    visitManaTree(
      '0',
      bytecode.template,
      (elementName, attributes, children, node) => {
        if (options && options.referenceUniqueness) {
          if (
            elementName === 'filter' ||
            elementName === 'filterGradient'
          ) {
            if (attributes.id && !alreadyUpdatedReferences[attributes.id]) {
              const prev = attributes.id;
              const next = prev + '-' + options.referenceUniqueness;
              attributes.id = next;
              referencesToUpdate['url(#' + prev + ')'] = 'url(#' + next + ')';
              alreadyUpdatedReferences[attributes.id] = true;
            }
          }
        }

        // Switch the legacy 'source' attribute to the new 'haiku-source'
        if (attributes && attributes.source) {
          attributes[HAIKU_SOURCE_ATTRIBUTE] = attributes.source;
          delete attributes.source;
        }
        if (attributes && attributes.identifier) {
          attributes[HAIKU_VAR_ATTRIBUTE] = attributes.identifier;
          delete attributes.identifier;
        }
      },
      null,
      0,
    );
  }

  if (bytecode.timelines) {
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        // Legacy backgroundColor was a root prop; in newer versions it's style.backgroundColor.
        // We only want to update this if the user *hasn't* explicitly set style.backroundColor.
        if (
          bytecode.timelines[timelineName][selector]['backgroundColor'] &&
          !bytecode.timelines[timelineName][selector]['style.backgroundColor']
        ) {
          bytecode.timelines[timelineName][selector]['style.backgroundColor'] =
            bytecode.timelines[timelineName][selector]['backgroundColor'];

          delete bytecode.timelines[timelineName][selector]['backgroundColor'];
          continue;
        }

        // If we're a filter attribute, update our references per those to whom uniqueness was added above.
        // This appends a "*-abc123" string to the filter to avoid collisions when multiple same components
        // are mounted in a single web page
        if (bytecode.timelines[timelineName][selector]['filter']) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector]['filter']) {
            const keyframeDesc = bytecode.timelines[timelineName][selector]['filter'][keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value];
            }
          }
        }

        // The fill attribute may reference a <filterGradient> property; avoid collisions same as above.
        if (bytecode.timelines[timelineName][selector]['fill']) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector]['fill']) {
            const keyframeDesc = bytecode.timelines[timelineName][selector]['fill'][keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value];
            }
          }
        }
      }
    }
  }

  const coreVersion = bytecode.metadata.core || bytecode.metadata.player;

  if (requiresUpgrade(coreVersion, UpgradeVersionRequirement.OriginSupport)) {
    component.visit((element) => {
      if (schema[element.tagName] && schema[element.tagName]['origin.x']) {
        // We only need to upgrade elements whose schemas support origin.
        addLegacyOriginSupport(
          element.tagName === 'svg',
          element.rawLayout,
          (
            (element.parent && element.parent.layout && element.parent.layout.size) ||
            {x: 0, y: 0, z: 0}
          ),
          bytecode.timelines.Default[`haiku:${element.getComponentId()}`],
        );
      }
    });

    // Bust caches; we only rendered to populate our layout stubs.
    component.clearCaches();
    component.markForFullFlush();
  }

  if (requiresUpgrade(coreVersion, UpgradeVersionRequirement.TimelineDefaultFrames)) {
    let wereAnyEventHandlersUpgraded = false;
    component.eachEventHandler((eventSelector, eventName, {original}) => {
      const rfo = functionToRFO(original);
      let body: string = rfo.__function.body;
      let changed = false;
      ['.seek(', '.gotoAndPlay(', '.gotoAndStop('].forEach((methodSignature) => {
        for (let cursor = 0; cursor < body.length; ++cursor) {
          if (body.substring(cursor, cursor + methodSignature.length) !== methodSignature) {
            continue;
          }

          // We have matched e.g. this.getDefaultTimeline().seek( at the string index of ".seek(".
          // Using the assumption that the method arguments do not contain string arguments with parentheses inside,
          // we can apply a simple parenthesis-balancing algorithm here.
          wereAnyEventHandlersUpgraded = changed = true;
          cursor += methodSignature.length;
          let openParens = 1;
          while (openParens > 0 && cursor < body.length) {
            if (body[cursor] === '(') {
              openParens++;
            } else if (body[cursor] === ')') {
              openParens--;
            }
            ++cursor;
          }
          // Essentially, replace .seek(foo) with .seek(foo, 'ms').
          body = `${body.slice(0, cursor - 1)}, 'ms')${body.slice(cursor)}`;
        }
      });

      if (changed) {
        bytecode.eventHandlers[eventSelector][eventName].handler = reifyRFO({
          ...rfo.__function,
          body,
        });
        delete bytecode.eventHandlers[eventSelector][eventName].original;
      }
    });

    if (wereAnyEventHandlersUpgraded) {
      component.bindEventHandlers();
    }
  }

  // Ensure the bytecode metadata core version is recent.
  bytecode.metadata.core = version;
};
