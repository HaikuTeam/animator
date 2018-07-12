import {BytecodeTimelineProperties, BytecodeTimelineProperty, Curve} from '@haiku/core/lib/api';
import {LayoutPropertyType} from './layout';

/**
 * Gets the initial value of a timeline property.
 *
 * Warning: this method uses unchecked property access, assuming that the caller has already checked the timeline
 * property exists. In cases where there's no need to check outside the context of this property, prefer
 * `initialValueOrNull` below.
 */
export const initialValue = (timeline: BytecodeTimelineProperties, property: string): any =>
  timeline[property][0].value;

/**
 * Get the initial value of a timeline property, or `null` if the property is not defined.
 */
export const initialValueOrNull = (timeline: BytecodeTimelineProperties, property: string): any =>
  timeline.hasOwnProperty(property) ? initialValue(timeline, property) : null;

/**
 * Get the initial value of a timeline property, or an acceptable default if the property is not defined.
 */
export const initialValueOr = (timeline: BytecodeTimelineProperties, property: string, value: any): any =>
  timeline.hasOwnProperty(property) ? initialValue(timeline, property) : value;

export const timelineHasProperties = (timeline: BytecodeTimelineProperties, ...properties: string[]): boolean => {
  for (const property of properties) {
    if (typeof timeline[property] !== 'object' || Object.keys(timeline[property]).length === 0) {
      return false;
    }
  }

  return true;
};

/**
 * Private helper method for `simulateLayoutProperty`.
 * @param value
 * @returns {{'0': {value: number}}}
 */
const getShimLayoutTimeline: (value: number) => BytecodeTimelineProperty = (value: number) => ({
  0: {
    value,
    curve: 'linear' as Curve,
  },
});

/**
 * Simulate a layout property that was not explicitly provided in a timeline.
 * @param {LayoutPropertyType} propertyType
 * @returns {{'0': {value: number}}}
 */
export const simulateLayoutProperty = (propertyType: LayoutPropertyType) => {
  switch (propertyType) {
    case LayoutPropertyType.Additive:
      return getShimLayoutTimeline(0);
    case LayoutPropertyType.Multiplicative:
      return getShimLayoutTimeline(1);
    default:
      throw new Error('Unable to simulate layout property.');
  }
};
