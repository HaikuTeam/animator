import {BytecodeTimelineProperties, LayoutSpec, ThreeDimensionalLayoutProperty} from '@haiku/core/lib/api';
import {LAYOUT_3D_VANITIES} from '@haiku/core/lib/HaikuComponent';
import Layout3D from '@haiku/core/lib/Layout3D';
import composedTransformsToTimelineProperties,
  {ComposedTransformSpec} from 'haiku-common/lib/layout/composedTransformsToTimelineProperties';
import {initialValueOr} from './timelineUtils';

const {createLayoutSpec, computeMatrix} = Layout3D;

export const enum LayoutPropertyType {
  Unknown = 0,
  Additive = 1,
  Multiplicative = 2,
}

/**
 * The small set of composable additive layout properties that Lottie actually supports.
 * @type {string[]}
 */
const supportedAdditiveLayoutProperties = [
  'translation.x',
  'translation.y',
  'rotation.z',

  // Not officially supported, but may be strippable when we run `simplify3dTransformations` below.
  'rotation.x',
  'rotation.y',
];

/**
 * The small set of composable multiplicative layout properties that Lottie actually supports.
 * @type {string[]}
 */
const supportedMultiplicativeLayoutProperties = [
  'scale.x',
  'scale.y',
];

/**
 * Hacks into @haiku/core vanities to splice our official "layout spec" into a virtual element.
 *
 * TODO: isolate the timeline -> layout spec algorithm more cleanly.
 * @param timeline
 * @param element
 */
const shimLayoutForPseudoElement = (timeline: BytecodeTimelineProperties, element: {layout: LayoutSpec}) => {
  supportedAdditiveLayoutProperties.forEach((property) => {
    if (timeline.hasOwnProperty(property)) {
      LAYOUT_3D_VANITIES[property](null, element, initialValueOr(timeline, property, 0));
    }
  });

  supportedMultiplicativeLayoutProperties.forEach((property) => {
    if (timeline.hasOwnProperty(property)) {
      LAYOUT_3D_VANITIES[property](null, element, initialValueOr(timeline, property, 1));
    }
  });
};

const precision = 1e-6;

const doublesEqual = (d1: number, d2: number, epsilon = precision): boolean => Math.abs(d1 - d2) < epsilon;

/**
 * Private helper method for removing 3D transformations _to the extent possible_.
 */
const simplify3dTransformations = (out: ComposedTransformSpec, epislon = 1e-3) => {
  // Note: the following technique is known to be imperfect, but seems to cover most use cases until Lottie supports
  // 3D rotation.

  // The demo projects that are fixed with this good-enough approach are:
  //  - Panda
  //  - Personality
  //  - daloading2
  //  - percy
  if (doublesEqual(Math.abs(out['rotation.x']), Math.PI, epislon)) {
    out['rotation.x'] = 0;
    out['scale.y'] *= -1;
  }

  if (doublesEqual(Math.abs(out['rotation.y']), Math.PI, epislon)) {
    out['rotation.y'] = 0;
    out['scale.x'] *= -1;
  }
};

/**
 * Composes a child timeline with a parent timeline.
 *
 * This function hijacks some @haiku/core-owned code for consistency and to avoid duplication. In most Haiku, we
 * get free layout composition via nested <g> elements in an <svg>. Lottie and potentially other formats do not support
 * layout composition on shapes (or grouping in general), so we have to collapse layout properties down to the
 * visible primitive element (e.g. <rect>), which can get very mathy depending on how parent groups are transformed.
 *
 * The simplest and least mathy composition might look like this:
 *
 * <g [translation.x]=60 [translation.y]=90>
 *   <g [translation.x]=-60 [translation.y]=-90>
 *     <rect ... />
 *   </g>
 * </g>
 *
 * The upshot of these groupings is as if there had been no translation at all—we can simply add translations pairwise.
 *
 * We only need to actually calculate affine transformation matrices and multiply them when translation and rotation
 * are composed together.
 *
 * @param {ThreeDimensionalLayoutProperty} shapeLayerSize
 * @param {ThreeDimensionalLayoutProperty} animationSize
 * @param childTimeline
 * @param parentTimeline
 * @returns {{}}
 */
export const composeTimelines = (
  shapeLayerSize: ThreeDimensionalLayoutProperty,
  childTimeline: any,
  parentTimeline: any,
) => {
  const composedTimeline = {
    ...parentTimeline,
    ...childTimeline,
  };

  const childPseudoElement = {layout: createLayoutSpec()};
  const parentPseudoElement = {layout: createLayoutSpec()};
  shimLayoutForPseudoElement(childTimeline, childPseudoElement);
  shimLayoutForPseudoElement(parentTimeline, parentPseudoElement);
  const childMatrix = computeMatrix(childPseudoElement.layout, shapeLayerSize);
  const parentMatrix = computeMatrix(parentPseudoElement.layout, shapeLayerSize);
  const composition = composedTransformsToTimelineProperties({}, [parentMatrix, childMatrix], true);
  simplify3dTransformations(composition);

  Object.assign(composedTimeline, {
    ...supportedAdditiveLayoutProperties.reduce(
      (properties, property) => {
        properties[property] = {0: {value: composition[property] || 0}};
        return properties;
      },
      {},
    ),
    ...supportedMultiplicativeLayoutProperties.reduce(
      (properties, property) => {
        properties[property] = {0: {value: composition[property] || 1}};
        return properties;
      },
      {},
    ),
  });

  return composedTimeline;
};
