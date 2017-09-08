const SELECTION_TARGETS = {
  NONE: 0,
  DRILL: 3, // The topmost sub-element of the current selection
  GROUP: 4, // The topmost grouping element
  TARGET: 5, // The targeted element itself
  EXISTING: 6 // Whatever the pre-existing target was before, if any
}

export default SELECTION_TARGETS
