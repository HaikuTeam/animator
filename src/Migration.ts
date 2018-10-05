/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {BytecodeNode, IHaikuComponent} from './api';
import {visitManaTree} from './HaikuNode';
import compareSemver from './helpers/compareSemver';
import migrateAutoSizing from './helpers/migrateAutoSizing';
import {SVG_SIZEABLES} from './layout/applyCssLayout';
import functionToRFO from './reflection/functionToRFO';
import reifyRFO from './reflection/reifyRFO';

const enum UpgradeVersionRequirement {
  OriginSupport = '3.2.0',
  TimelineDefaultFrames = '3.2.23',
  CamelAutoSizingOffset3DOmnibus = '3.5.2',
}

const HAIKU_ID_ATTRIBUTE = 'haiku-id';
const HAIKU_SOURCE_ATTRIBUTE = 'haiku-source';
const HAIKU_VAR_ATTRIBUTE = 'haiku-var';
const HAIKU_ROOT_DEFAULT_REGEX = /^web\+haikuroot:\/\//;
const HAIKU_ROOT_DEFAULT = 'web+haikuroot://';
const SRC_ATTRIBUTE = 'src';
const HREF_ATTRIBUTE = 'href';
const XLINKHREF_ATTRIBUTE = 'xlink:href';

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

export interface MigrationOptions {
  attrsHyphToCamel: {
    [key in string]: string;
  };
  mutations?: {
    referenceUniqueness: string;
    haikuRoot: string;
  };
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
    // y-overflow + preserve-3d leads to various rendering bugs, so for now, disable when overflow is available.
    // #FIXME
    const autoPreserve3d = component.config.preserve3d === 'auto' && component.config.overflowY !== 'visible';

    visitManaTree(
      '0',
      bytecode.template,
      (_, attributes) => {
        if (typeof attributes !== 'object') {
          return;
        }

        if (options.mutations) {
          if (attributes.id) {
            const prev = attributes.id;
            const next = prev + '-' + options.mutations.referenceUniqueness;
            attributes.id = next;
            referencesToUpdate[`#${prev}`] = `#${next}`;
            referencesToUpdate['url(#' + prev + ')'] = 'url(#' + next + ')';
          }
        }
      },
      null,
      0,
    );

    visitManaTree(
      '0',
      bytecode.template,
      (elementName, attributes) => {
        if (typeof attributes !== 'object') {
          return;
        }

        const timelineProperties = bytecode.timelines.Default[`haiku:${attributes[HAIKU_ID_ATTRIBUTE]}`] || {};

        // Hoist xlink:href up to the timeline if not already done. Older versions of Haiku installed xlink:href in the
        // attributes dictionary.
        if (attributes[XLINKHREF_ATTRIBUTE]) {
          timelineProperties[XLINKHREF_ATTRIBUTE] = {0: {value: attributes[XLINKHREF_ATTRIBUTE]}};
          delete attributes[XLINKHREF_ATTRIBUTE];
        }

        if (options.mutations) {
          for (const property in timelineProperties) {
            if (property !== SRC_ATTRIBUTE && property !== XLINKHREF_ATTRIBUTE && property !== HREF_ATTRIBUTE) {
              continue;
            }

            for (const keyframe in timelineProperties[property]) {
              const value = timelineProperties[property][keyframe].value as string;
              if (HAIKU_ROOT_DEFAULT_REGEX.test(value)) {
                timelineProperties[property][keyframe].value = value.replace(
                  HAIKU_ROOT_DEFAULT,
                  options.mutations.haikuRoot,
                );
              } else if (referencesToUpdate[value]) {
                timelineProperties[property][keyframe].value = referencesToUpdate[value];
              }
            }
          }
        }

        // Switch the legacy 'source' attribute to the new 'haiku-source'
        if (attributes.source) {
          attributes[HAIKU_SOURCE_ATTRIBUTE] = attributes.source;
          delete attributes.source;
        }

        if (attributes.identifier) {
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

        if (
          !bytecode.timelines.Default[`haiku:${attributes[HAIKU_ID_ATTRIBUTE]}`] &&
          Object.keys(timelineProperties).length > 0
        ) {
          // Update with our hot object if we inadvertently created this object during migration.
          bytecode.timelines.Default[`haiku:${attributes[HAIKU_ID_ATTRIBUTE]}`] = timelineProperties;
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
      for (let selector in bytecode.timelines[timelineName]) {
        if (needsOmnibusUpgrade) {
          // Migrate auto-sizing.
          migrateAutoSizing(bytecode.timelines[timelineName][selector]);
        }

        // Ensure ID-based selectors like #box work.
        if (referencesToUpdate[selector]) {
          bytecode.timelines[timelineName][referencesToUpdate[selector]] = bytecode.timelines[timelineName][selector];
          delete bytecode.timelines[timelineName][selector];
          selector = referencesToUpdate[selector];
        }

        for (const propertyName in bytecode.timelines[timelineName][selector]) {
          if (needsOmnibusUpgrade) {
            // Migrate camel-case property names.
            const camelVariant = options.attrsHyphToCamel[propertyName];
            if (camelVariant) {
              bytecode.timelines[timelineName][selector][camelVariant] =
                bytecode.timelines[timelineName][selector][propertyName];
              delete bytecode.timelines[timelineName][selector][propertyName];
            }
          }

          for (const keyframeMs in bytecode.timelines[timelineName][selector][propertyName]) {
            const keyframeDesc = bytecode.timelines[timelineName][selector][propertyName][keyframeMs];
            if (keyframeDesc && referencesToUpdate[keyframeDesc.value as string]) {
              keyframeDesc.value = referencesToUpdate[keyframeDesc.value as string];
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

  component.eachEventHandler((eventSelector, eventName, {handler}) => {
    if (!handler) {
      console.warn(`Unable to migrate event handler for ${eventSelector} ${eventName} in ${component.$id}`);
      return;
    }

    const rfo = handler.__rfo || functionToRFO(handler).__function;
    let params = rfo.params;
    let body: string = rfo.body;
    let changed = false;

    if (requiresUpgrade(coreVersion, UpgradeVersionRequirement.TimelineDefaultFrames)) {
      (['.seek(', '.gotoAndPlay(', '.gotoAndStop(']).forEach((methodSignature) => {
        for (let cursor = 0; cursor < body.length; ++cursor) {
          if (body.substring(cursor, cursor + methodSignature.length) !== methodSignature) {
            continue;
          }

          changed = true;

          // We have matched e.g. this.getDefaultTimeline().seek( at the string index of ".seek(".
          // Using the assumption that the method arguments do not contain string arguments with parentheses inside,
          // we can apply a simple parenthesis-balancing algorithm here.
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
    }

    if (params.length < 4) {
      params = ['component', 'element', 'target', 'event'];
      changed = true;
    }

    if (changed) {
      bytecode.eventHandlers[eventSelector][eventName].handler = reifyRFO({
        ...rfo,
        params,
        body,
      });
    }
  });

  if (needsRerender) {
    component.clearCaches();
    component.markForFullFlush();
  }

  // Ensure the bytecode metadata core version is recent.
  bytecode.metadata.core = version;
};
