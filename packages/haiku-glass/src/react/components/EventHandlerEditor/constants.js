export const EVALUATOR_STATES = {
  NONE: 1, // None means nothing to evaluate at all
  OPEN: 2, // Anything >= OPEN is also 'open'
  INFO: 3,
  WARN: 4,
  ERROR: 5
}

export const NAVIGATION_DIRECTIONS = {
  SAME: 0,
  NEXT: +1,
  PREV: -1
}

export const EDITOR_WIDTH = 500

export const EDITOR_HEIGHT = 350

export const MAX_AUTOCOMPLETION_ENTRIES = 8

export const EDITOR_LINE_HEIGHT = 18
