/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

/**
 * @method isMutableProperty
 * @description Mechanism to determine if a property is mutated within the timeline.
 */
export default function isMutableProperty (property, propertyName: string) {
  // For now, we can use a "naive" set of sufficient (but not necessary) conditions for immutability of a property:
  //   1. Has exactly one keyframe.
  //   2. The keyframe is "0".
  //   3. The value at keyframe "0" is not a function (and so it cannot be mutated by changes in the state container).
  // Although there is a more complete definition of immutability, this is enough to identify a property which is
  // "likely mutable".
  return (
    typeof property === 'object' &&
    property !== null &&
    (
      Object.keys(property).length !== 1
      || !property.hasOwnProperty('0')
      || typeof property[0].value === 'function'
      || /^controlFlow/.test(propertyName)
    )
  );
}
