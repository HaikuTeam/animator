/**
 * Gets the initial value of a timeline property.
 *
 * Warning: this method uses unchecked property access, assuming that the caller has already checked the timeline
 * property exists. In cases where there's no need to check outside the context of this property, prefer
 * `initialValueOrNull` below.
 * @param timeline
 * @param {string} property
 * @returns {any}
 */
export const initialValue = (timeline: any, property: string): any => timeline[property][0].value;

/**
 * Get the initial value of a timeline property, or `null` if the property is not defined.
 * @param timeline
 * @param {string} property
 * @returns {any?}
 */
export const initialValueOrNull = (timeline: any, property: string): any => timeline.hasOwnProperty(property)
  ? initialValue(timeline, property)
  : null;

/**
 * Get the initial value of a timeline property, or an acceptable default if the property is not defined.
 * @param timeline
 * @param {string} property
 * @returns {any}
 */
export const initialValueOr = (timeline: any, property: string, value: any): any => timeline.hasOwnProperty(property)
  ? initialValue(timeline, property) : value;
