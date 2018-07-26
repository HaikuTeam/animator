/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {IHaikuComponent} from './api';
import {visitManaTree, xmlToMana} from './HaikuNode';
import compareSemver from './helpers/compareSemver';
import migrateAutoSizing from './helpers/migrateAutoSizing';
import functionToRFO from './reflection/functionToRFO';
import reifyRFO from './reflection/reifyRFO';

const STRING_TYPE = 'string';

const enum UpgradeVersionRequirement {
  OriginSupport = '3.2.0',
  TimelineDefaultFrames = '3.2.23',
  CamelAutoSizingOffsetOmnibus = '3.5.1',
  AutoPreserveThreeDee = '3.5.2',
}

const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
const HAIKU_VAR_ATTRIBUTE = 'haiku-var';

const requiresUpgrade = (coreVersion: string, requiredVersion: UpgradeVersionRequirement) => !coreVersion ||
  compareSemver(
    coreVersion,
    requiredVersion,
  ) < 0;

const areKeyframesDefined = (keyframeGroup) => {
  return (
    keyframeGroup &&
    Object.keys(keyframeGroup).length > 0
  );
};

/**
 * Migrations are a mechanism to modify our bytecode from legacy format to the current format.
 * This always runs against production components' bytecode to ensure their data is a format
 * that the current version of the engine knows how to handle. There are two phases to migration:
 * the pre-phase, which runs before an initial .render call, and a post-phase, which runs after.
 */

export const runMigrationsPrePhase = (component: IHaikuComponent, options: any, version: string) => {
  const bytecode = component.bytecode;

  if (!bytecode.states) {
    bytecode.states = {};
  }

  if (!bytecode.metadata) {
    bytecode.metadata = {};
  }

  const coreVersion = bytecode.metadata.core || bytecode.metadata.player;

  // Convert the properties array to the states dictionary
  if (bytecode.properties) {
    const properties = bytecode.properties;

    delete bytecode.properties;

    for (let i = 0; i < properties.length; i++) {
      const propertySpec = properties[i];
      const updatedSpec = {} as any;

      if (propertySpec.value !== undefined) {
        updatedSpec.value = propertySpec.value;
      }
      if (propertySpec.type !== undefined) {
        updatedSpec.type = propertySpec.type;
      }
      if (propertySpec.setter !== undefined) {
        updatedSpec.set = propertySpec.setter;
      }
      if (propertySpec.getter !== undefined) {
        updatedSpec.get = propertySpec.getter;
      }
      if (propertySpec.set !== undefined) {
        updatedSpec.set = propertySpec.set;
      }
      if (propertySpec.get !== undefined) {
        updatedSpec.get = propertySpec.get;
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

  if (bytecode.timelines) {
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        // Legacy backgroundColor was a root prop; in newer versions it's style.backgroundColor.
        // We only want to update this if the user *hasn't* explicitly set style.backroundColor.
        if (
          bytecode.timelines[timelineName][selector].backgroundColor &&
          !bytecode.timelines[timelineName][selector]['style.backgroundColor']
        ) {
          bytecode.timelines[timelineName][selector]['style.backgroundColor'] =
            bytecode.timelines[timelineName][selector].backgroundColor;

          delete bytecode.timelines[timelineName][selector].backgroundColor;
          continue;
        }

        if (requiresUpgrade(coreVersion, UpgradeVersionRequirement.AutoPreserveThreeDee)) {
          const transformStyleGroup = bytecode.timelines[timelineName][selector]['style.transformStyle'];

          if (
            transformStyleGroup &&
            Object.keys(transformStyleGroup).length === 1 &&
            transformStyleGroup[0] &&
            transformStyleGroup[0].value === 'flat'
          ) {
            delete bytecode.timelines[timelineName][selector]['style.transformStyle'][0];
          }

          const perspectiveGroup = bytecode.timelines[timelineName][selector]['style.perspective'];

          if (
            perspectiveGroup &&
            Object.keys(perspectiveGroup).length === 1 &&
            perspectiveGroup[0] &&
            perspectiveGroup[0].value === 'none'
          ) {
            delete bytecode.timelines[timelineName][selector]['style.perspective'][0];
          }
        }

        // If we see that any 3D transformations are applied, automatically override flat perspective
        // if it hasn't been automatically set, so that 3D perspective "just works"
        if (component.config.preserve3d === 'auto') {
          if (
            areKeyframesDefined(bytecode.timelines[timelineName][selector]['rotation.x']) ||
            areKeyframesDefined(bytecode.timelines[timelineName][selector]['rotation.y']) ||
            areKeyframesDefined(bytecode.timelines[timelineName][selector]['translation.z']) ||
            areKeyframesDefined(bytecode.timelines[timelineName][selector]['scale.z'])
          ) {
            component.doPreserve3d = true;
          }
        }
      }
    }
  }
};

export const runMigrationsPostPhase = (component: IHaikuComponent, options: any, version: string) => {
  const bytecode = component.bytecode;

  const coreVersion = bytecode.metadata.core || bytecode.metadata.player;

  // If specified, make sure that internal URL references, e.g. url(#my-filter), are unique
  // per each component instance, otherwise we will get filter collisions and weirdness on the page
  const referencesToUpdate = {};
  const alreadyUpdatedReferences = {};

  let needsRerender = false;

  if (bytecode.template) {
    visitManaTree(
      '0',
      bytecode.template,
      (elementName, attributes, children, node) => {
        if (options && options.referenceUniqueness) {
          if (elementName === 'filter' || elementName === 'filterGradient') {
            if (attributes.id && !alreadyUpdatedReferences[attributes.id]) {
              const prev = attributes.id;
              const next = prev + '-' + options.referenceUniqueness;
              attributes.id = next;
              referencesToUpdate['url(#' + prev + ')'] = 'url(#' + next + ')';
              alreadyUpdatedReferences[attributes.id] = true;
              needsRerender = true;
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

  const needsCamelAutoSizingOffsetOmnibus = requiresUpgrade(
    coreVersion, UpgradeVersionRequirement.CamelAutoSizingOffsetOmnibus);

  if (bytecode.timelines) {
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        if (needsCamelAutoSizingOffsetOmnibus) {
          // Migrate auto-sizing.
          migrateAutoSizing(bytecode.timelines[timelineName][selector]);
          // Migrate camel-case property names.
          for (const propertyName in bytecode.timelines[timelineName][selector]) {
            const camelVariant = options.attrsHyphToCamel[propertyName];
            if (camelVariant) {
              bytecode.timelines[timelineName][selector][camelVariant] =
                bytecode.timelines[timelineName][selector][propertyName];

              delete bytecode.timelines[timelineName][selector][propertyName];
            }
          }
        }

        // If we're a filter attribute, update our references per those to whom uniqueness was added above.
        // This appends a "*-abc123" string to the filter to avoid collisions when multiple same components
        // are mounted in a single web page
        if (bytecode.timelines[timelineName][selector].filter) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector].filter) {
            const keyframeDesc = bytecode.timelines[timelineName][selector].filter[keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value];
            }
          }
        }

        // The fill attribute may reference a <filterGradient> property; avoid collisions same as above.
        if (bytecode.timelines[timelineName][selector].fill) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector].fill) {
            const keyframeDesc = bytecode.timelines[timelineName][selector].fill[keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value];
            }
          }
        }
      }
    }
  }

  if (needsCamelAutoSizingOffsetOmnibus) {
    const alsoMigrateOrigin = requiresUpgrade(coreVersion, UpgradeVersionRequirement.OriginSupport);
    component.visit((element) => {
      let offsetX = 0;
      let offsetY = 0;
      const timelineProperties = bytecode.timelines.Default[`haiku:${element.getComponentId()}`];
      if (!timelineProperties) {
        return;
      }

      // Note: the migrations below are incorrect if align properties were ever defined on an element with explicit
      // size. Since in practice this never happened, this is fine.
      if (timelineProperties['align.x']) {
        const alignX = timelineProperties['align.x'][0] && timelineProperties['align.x'][0].value;
        if (typeof alignX === 'number') {
          offsetX += alignX * element.getNearestDefinedNonZeroAncestorSizeX();
        }
      }

      if (timelineProperties['align.y']) {
        const alignY = timelineProperties['align.y'][0] && timelineProperties['align.y'][0].value;
        if (typeof alignY === 'number') {
          offsetY += alignY * element.getNearestDefinedNonZeroAncestorSizeY();
        }
      }

      if (timelineProperties['mount.x']) {
        const mountX = timelineProperties['mount.x'][0] && timelineProperties['mount.x'][0].value;
        if (typeof mountX === 'number') {
          offsetX -= mountX * element.getNearestDefinedNonZeroAncestorSizeX();
        }
      }

      if (timelineProperties['mount.y']) {
        const mountY = timelineProperties['mount.y'][0] && timelineProperties['mount.y'][0].value;
        if (typeof mountY === 'number') {
          offsetY -= mountY * element.getNearestDefinedNonZeroAncestorSizeY();
        }
      }

      if (alsoMigrateOrigin) {
        // Prior to explicit origin support, we were applying a default origin of (0, 0, 0) for all objects, then
        // allowing the browser default for SVG elements (50%, 50%, 0px) be the effective transform-origin. This led to
        // inaccuracies in the layout system, specifically related to addressing translation on SVG elements and
        // addressing origin in general. Since as of the introduction of explicit origin support we had not made layout
        // offset addressable in Haiku, we can "backport" to the old coordinate system by simply offsetting layout
        // by its "origin error".
        if (element.tagName === 'svg') {
          offsetX += 0.5 * element.getNearestDefinedNonZeroAncestorSizeX();
          offsetY += 0.5 * element.getNearestDefinedNonZeroAncestorSizeY();
        } else {
          offsetX += element.originX * element.getNearestDefinedNonZeroAncestorSizeX();
          offsetY += element.originY * element.getNearestDefinedNonZeroAncestorSizeY();
        }
      }

      if (offsetX !== 0) {
        timelineProperties['offset.x'] = {0: {value: offsetX}};
        needsRerender = true;
      }

      if (offsetY !== 0) {
        timelineProperties['offset.y'] = {0: {value: offsetY}};
        needsRerender = true;
      }

      delete timelineProperties['align.x'];
      delete timelineProperties['align.y'];
      delete timelineProperties['align.z'];
      delete timelineProperties['mount.x'];
      delete timelineProperties['mount.y'];
      delete timelineProperties['mount.z'];
    });
  }

  if (requiresUpgrade(coreVersion, UpgradeVersionRequirement.TimelineDefaultFrames)) {
    component.eachEventHandler((eventSelector, eventName, {handler}) => {
      if (!handler) {
        console.warn(`Unable to migrate event handler for ${eventSelector} ${eventName} in ${component.$id}`);
        return;
      }

      const rfo = handler.__rfo || functionToRFO(handler).__function;
      let body: string = rfo.body;
      let changed = false;
      ['.seek(', '.gotoAndPlay(', '.gotoAndStop('].forEach((methodSignature) => {
        for (let cursor = 0; cursor < body.length; ++cursor) {
          if (body.substring(cursor, cursor + methodSignature.length) !== methodSignature) {
            continue;
          }

          // We have matched e.g. this.getDefaultTimeline().seek( at the string index of ".seek(".
          // Using the assumption that the method arguments do not contain string arguments with parentheses inside,
          // we can apply a simple parenthesis-balancing algorithm here.
          changed = true;
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
          ...rfo,
          body,
        });
      }
    });
  }

  if (needsRerender) {
    component.clearCaches();
    component.markForFullFlush();
  }

  // Ensure the bytecode metadata core version is recent.
  bytecode.metadata.core = version;
};
