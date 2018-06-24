const zIndex = {
  // Top controls
  gauge: {
    base: 2
  },
  scrubber: {
    base: 1
  },

  // Heading row (name of the row, drag handler, etc)
  headingRow: {
    base: 3
  },

  // Cluster row (a row with sub-items that is collapsed)
  clusterRowHeading: {
    base: 2
  },
  clusterRow: {
    base: 1
  },

  // Property row
  propertyRowHeading: {
    base: 2
  },
  propertyRow: {
    base: 1
  },

  //
  segmentsBox: {
    base: 1
  },

  // Frames/seconds switcher block
  timekeepingWrapper: {
    base: 4
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
