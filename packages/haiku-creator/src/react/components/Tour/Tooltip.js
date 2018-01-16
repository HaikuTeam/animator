import React from 'react'
import Draggable from 'react-draggable'
import Palette from 'haiku-ui-common/lib/Palette'
import {TOUR_STYLES} from '../../styles/tourShared'
import Spotlight from './Spotlight'

const STYLES = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  childrenWrapper: {
    position: 'absolute',
    minWidth: 340,
    WebkitUserSelect: 'none',
    color: Palette.ROCK,
    padding: 1,
    borderRadius: 3,
    background:
      'linear-gradient(to bottom, rgba(255,221,100,1) 0%, rgba(214,37,99,1) 100%)',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)',
    zIndex: 9999
  },
  children: {
    backgroundColor: Palette.FATHER_COAL,
    borderRadius: 3,
    padding: 20
  }
}

STYLES.TOP = {
  container: {
    flexDirection: 'column-reverse'
  },
  children: {
    bottom: 45
  },
  spotlight: {
    top: -40
  }
}

STYLES.BOTTOM = {
  container: {
    flexDirection: 'column'
  },
  children: {
    top: 45
  },
  spotlight: {
    bottom: -40
  }
}

STYLES.LEFT = {
  container: {
    flexDirection: 'row-reverse'
  },
  children: {
    right: '130%'
  },
  spotlight: {
    left: -40
  }
}

STYLES.RIGHT = {
  container: {
    flexDirection: 'row'
  },
  children: {
    left: '110%'
  },
  spotlight: {
    right: -40
  }
}

const TOOLTIP_SIZES = {
  small: 340,
  default: 505
}

function Tooltip (props) {
  const {
    coordinates,
    offset,
    spotlightRadius,
    display,
    children,
    next,
    finish,
    stepData,
    waitUserAction,
    size,
    isOverlayHideable
  } = props
  let {top, left} = coordinates
  let positionStyles = STYLES[display.toUpperCase()] || {}
  let spotlightExtraStyles = {}

  if (display === 'left') {
    top = top + coordinates.height / 2
    left = coordinates.left

    if (left - 350 <= 10) {
      return Tooltip({...props, display: 'top'})
    }
  }

  if (display === 'right') {
    top = top + coordinates.height / 2
    left = coordinates.left + coordinates.width
  }

  if (display === 'bottom') {
    top = top + coordinates.height
    left = left + coordinates.width / 2
  }

  if (display === 'top') {
    top = coordinates.top
    left = left + coordinates.width / 2

    if (top - 350 <= 10) {
      return Tooltip({...props, display: 'bottom'})
    }
  }

  if (spotlightRadius !== 'default') {
    spotlightExtraStyles.width = spotlightRadius
    spotlightExtraStyles.height = spotlightRadius
  }

  if (typeof top === 'number') {
    top = top + offset.top
    left = left + offset.left
  }

  return (
    <div style={{top, left, ...STYLES.container, ...positionStyles.container}}>
      <Spotlight
        offset={positionStyles.spotlight}
        position={{top, left}}
        containerStyles={STYLES.container}
        holeStyles={spotlightExtraStyles}
        display={display}
        isOverlayHideable={isOverlayHideable}
      />

      <Draggable key={stepData.current}>
        <div
          style={{
            ...STYLES.childrenWrapper,
            ...positionStyles.children,
            width: TOOLTIP_SIZES[size] || TOOLTIP_SIZES.default
          }}
        >
          <div style={STYLES.children}>
            {children}

            {/* Don't show buttons on the first and last slides */}
            {stepData.current > 0 &&
              stepData.current < stepData.total && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 30
                  }}
                >
                  <button
                    style={TOUR_STYLES.btnSecondary}
                    onClick={() => finish(true, true)}
                  >
                    Finish
                  </button>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: 10, fontStyle: 'oblique'}}>
                      {stepData.current} of {stepData.total}
                    </span>
                    {/* Show the next button if we aren't waiting for user interaction */}
                    {!waitUserAction && (
                      <button style={TOUR_STYLES.btn} onClick={() => next()}>
                        Next
                      </button>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </Draggable>
    </div>
  )
}

export default Tooltip
