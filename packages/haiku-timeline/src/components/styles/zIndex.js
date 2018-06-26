/*
 * This object tries to be a canonical source for z-index management
 * in the timeline.
 *
  * Since z-index tends to be a mess because we can have different
  * [stacking contexts][1], the idea is to add a new key for every stacking context,
  * with a `base` z-index. Elements contained inside of a stacking context should
  * keys of a nested object, for example:
  *
  * ```
  * stackingContext: {
  *   base: 1,
  *   elementInsideStackingContext: 11,
  *   nestedStackingContext: {
  *     base: 12
  *   }
  * }
 */

const zIndex = {
  // Top controls
  gauge: {
    base: 2
  },
  scrubber: {
    base: 4
  },
  timekeepingWrapper: {
    base: 11
  },
  backgroundHelper: {
    base: 4
  },

  // Heading row (name of the row, drag handler, etc)
  headingRow: {
    base: 10
  },
  headingRowExpanded: {
    base: 10
  },

  // Cluster row (a row with sub-items that is collapsed)
  clusterRowHeading: {
    base: 5
  },
  clusterRow: {
    base: 1
  },

  // Property row
  propertyRowHeading: {
    base: 5
  },
  propertyRow: {
    base: 1
  },

  //
  segmentsBox: {
    base: 1
  },
  collapsedSegments: {
    base: 1
  },

  // Vertial line simulating a shadow between the properties and the tweens
  scrollShadow: {
    base: 1
  },

  // Box with the expression input
  expressionInput: {
    base: 10
  },

  // Box with the marquee
  marquee: {
    base: 10
  },

  // Overlay blocking all actions if preview mode is enabled
  previewModeBlocker: {
    base: 20
  }
}

export default zIndex
