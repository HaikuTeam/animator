/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeNode, IHaikuComponent} from './api';
import {visitManaTree, xmlToMana} from './HaikuNode';
import compareSemver from './helpers/compareSemver';
import migrateAutoSizing from './helpers/migrateAutoSizing';
import {SVG_SIZEABLES} from './layout/applyCssLayout';
import functionToRFO from './reflection/functionToRFO';
import reifyRFO from './reflection/reifyRFO';

const STRING_TYPE = 'string';

const enum UpgradeVersionRequirement {
  OriginSupport = '3.2.0',
  TimelineDefaultFrames = '3.2.23',
  CamelAutoSizingOffset3DOmnibus = '3.5.2',
}

const HAIKU_ID_ATTRIBUTE = 'haiku-id';
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

const isStringTemplate = (template: string|BytecodeNode): template is string => {
  return typeof template === STRING_TYPE;
};

export interface MigrationOptions {
  attrsHyphToCamel: {
    [key in string]: string;
  };
  referenceUniqueness?: string;
}

const ensure3dPreserved = (node: BytecodeNode) => {
  if (!node || !node.attributes || !node.attributes.style) {
    return;
  }

  let changed = false;

  // Only preserve 3D behavior if the node hasn't been *explicitly* defined yet
  if (!node.attributes.style.transformStyle) {
    node.attributes.style.transformStyle = 'preserve-3d';

    changed = true;

    if (!node.attributes.style.perspective) {
      node.attributes.style.perspective = 'inherit';
    }
  }

  return changed;
};

/**
 * Migrations are a mechanism to modify our bytecode from legacy format to the current format.
 * This always runs against production components' bytecode to ensure their data is a format
 * that the current version of the engine knows how to handle. There are two phases to migration:
 * the pre-phase, which runs before an initial .render call, and a post-phase, which runs after.
 */

export const runMigrationsPrePhase = (component: IHaikuComponent, options: MigrationOptions) => {
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
  if (isStringTemplate(bytecode.template)) {
    bytecode.template = xmlToMana(bytecode.template);
  }

  if (bytecode.timelines) {
    // Expand all bytecode properties represented as shorthand.
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        for (const property in bytecode.timelines[timelineName][selector]) {
          if (typeof bytecode.timelines[timelineName][selector][property] !== 'object') {
            bytecode.timelines[timelineName][selector][property] = {
              0: {
                value: bytecode.timelines[timelineName][selector][property],
              },
            };
          }
        }
      }
    }
  }

  const needsOmnibusUpgrade = requiresUpgrade(
    coreVersion,
    UpgradeVersionRequirement.CamelAutoSizingOffset3DOmnibus,
  );
  const referencesToUpdate = {};

  if (bytecode.template) {
    const autoPreserve3d = component.config.preserve3d === 'auto';

    // If specified, make sure that internal URL references, e.g. url(#my-filter), are unique
    // per each component instance, otherwise we will get filter collisions and weirdness on the page
    const alreadyUpdatedReferences = {};

    visitManaTree(
      '0',
      bytecode.template,
      (elementName, attributes) => {
        if (typeof attributes !== 'object') {
          return;
        }

        const timelineProperties = bytecode.timelines.Default[`haiku:${attributes[HAIKU_ID_ATTRIBUTE]}`];
        if (!timelineProperties) {
          return;
        }

        if (options && options.referenceUniqueness) {
          if (elementName === 'filter' || elementName === 'filterGradient') {
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

        // Legacy backgroundColor was a root prop; in newer versions it's style.backgroundColor.
        // We only want to update this if the user *hasn't* explicitly set style.backroundColor.
        if (timelineProperties.backgroundColor && !timelineProperties['style.backgroundColor']) {
          timelineProperties['style.backgroundColor'] = timelineProperties.backgroundColor;
          delete timelineProperties.backgroundColor;
        }

        if (needsOmnibusUpgrade) {
          const transformStyleGroup = timelineProperties['style.transformStyle'];
          if (transformStyleGroup && transformStyleGroup[0] && transformStyleGroup[0].value === 'flat') {
            delete timelineProperties['style.transformStyle'];
          }

          const perspectiveGroup = timelineProperties['style.perspective'];
          if (perspectiveGroup && perspectiveGroup[0] && perspectiveGroup[0].value === 'none') {
            delete timelineProperties['style.perspective'];
          }

          // Retire sizing layout from any SVG sizeable in favor of explicit properties.
          if (typeof elementName === 'string' && SVG_SIZEABLES[elementName]) {
            if (timelineProperties['sizeAbsolute.x']) {
              timelineProperties.width = {0: {value: timelineProperties['sizeAbsolute.x'][0].value}};
              delete timelineProperties['sizeAbsolute.x'];
              delete timelineProperties['sizeMode.x'];
            }

            if (timelineProperties['sizeAbsolute.y']) {
              timelineProperties.height = {0: {value: timelineProperties['sizeAbsolute.y'][0].value}};
              delete timelineProperties['sizeAbsolute.y'];
              delete timelineProperties['sizeMode.y'];
            }

            if (timelineProperties['sizeProportional.x']) {
              timelineProperties.width = {
                0: {value: `${Number(timelineProperties['sizeProportional.x'][0].value) * 100}%`},
              };
              delete timelineProperties['sizeProportional.x'];
              delete timelineProperties['sizeMode.x'];
            }

            if (timelineProperties['sizeProportional.y']) {
              timelineProperties.height = {
                0: {value: `${Number(timelineProperties['sizeProportional.y'][0].value) * 100}%`},
              };
              delete timelineProperties['sizeProportional.y'];
              delete timelineProperties['sizeMode.y'];
            }
          }
        }

        // If we see that any 3D transformations are applied, automatically override flat perspective
        // if it hasn't been automatically set, so that 3D perspective "just works"
        if (
          !component.doPreserve3d &&
          autoPreserve3d && (
            areKeyframesDefined(timelineProperties['rotation.x']) ||
            areKeyframesDefined(timelineProperties['rotation.y']) ||
            areKeyframesDefined(timelineProperties['translation.z']) ||
            areKeyframesDefined(timelineProperties['scale.z'])
          )
        ) {
          component.doPreserve3d = true;
        }
      },
      null,
      0,
    );
  }

  if (bytecode.timelines) {
    // Although not ideal, it's likely beneficial to do another pass through the timelines to fill in
    // reference uniqueness. This may allow us to avoid a rerender below.
    for (const timelineName in bytecode.timelines) {
      for (const selector in bytecode.timelines[timelineName]) {
        // If we're a filter attribute, update our references per those to whom uniqueness was added above.
        // This appends a "*-abc123" string to the filter to avoid collisions when multiple same components
        // are mounted in a single web page
        if (bytecode.timelines[timelineName][selector].filter) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector].filter) {
            const keyframeDesc = bytecode.timelines[timelineName][selector].filter[keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value as string]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value as string];
            }
          }
        }

        // The fill attribute may reference a <filterGradient> property; avoid collisions same as above.
        if (bytecode.timelines[timelineName][selector].fill) {
          for (const keyframeMs in bytecode.timelines[timelineName][selector].fill) {
            const keyframeDesc = bytecode.timelines[timelineName][selector].fill[keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value as string]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value as string];
            }
          }
        }

        if (needsOmnibusUpgrade) {
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
      }
    }
  }
};

export const runMigrationsPostPhase = (component: IHaikuComponent, options: MigrationOptions, version: string) => {
  const bytecode = component.bytecode;

  const coreVersion = bytecode.metadata.core || bytecode.metadata.player;

  let needsRerender = false;

  if (component.doPreserve3d) {
    const node = component.node;
    if (node) {
      const didNodePreserve3dChange = ensure3dPreserved(node);
      if (didNodePreserve3dChange) {
        component.patches.push(node);
      }
    }

    // The wrapper also needs preserve-3d set for 3d-preservation to work
    const parent = component.parentNode; // This should be the "wrapper div" node
    if (parent) {
      const didParentPreserve3dChange = ensure3dPreserved(parent);
      if (didParentPreserve3dChange) {
        component.patches.push(parent);
      }
    }
  }

  const needsCamelAutoSizingOffsetOmnibus = requiresUpgrade(
    coreVersion, UpgradeVersionRequirement.CamelAutoSizingOffset3DOmnibus);

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
