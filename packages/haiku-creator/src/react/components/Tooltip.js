import React from 'react'
import Palette from './Palette'
import { TOUR_STYLES } from '../styles/tourShared'

const STYLES = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  circle: {
    width: 30,
    height: 30,
    border: '1px solid #49c000',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 20
  },
  circleInner: {
    width: 20,
    height: 20,
    background: '#49c000',
    borderRadius: '50%',
    margin: '4px auto 0'
  },
  childrenWrapper: {
    position: 'absolute',
    minWidth: 340,
    WebkitUserSelect: 'none',
    color: Palette.ROCK,
    padding: 1,
    borderRadius: 3,
    background: 'linear-gradient(to bottom, rgba(255,221,100,1) 0%, rgba(214,37,99,1) 100%)',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)'
  },
  children: {
    backgroundColor: Palette.COAL,
    borderRadius: 3,
    padding: 20
  },
  spotlight: {
    position: 'absolute',
    width: 500,
    height: 500,
    boxShadow: '0 0 0 2560px rgba(0, 0, 0, 0.5), 0 0 20px 0px #000 inset',
    borderRadius: '100%',
    background: 'transparent',
    pointerEvents: 'none'
  }
}

STYLES.TOP = {
  container: {
    flexDirection: 'column-reverse'
  },
  children: {
    bottom: -35
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
    waitUserAction
  } = props
  let {top, left} = coordinates
  let circleDisplay = 'none'
  let positionStyles = STYLES[display.toUpperCase()] || {}
  let spotlightExtraStyles = {}

  if (display !== 'none') {
    // Temporally disable the circle until we figure out placement
    // and design
    // circleDisplay = 'inline-block'
  }

  if (display === 'left') {
    top = top + (coordinates.height / 2)
    left = coordinates.left - STYLES.circle.width

    if (left - 350 <= 10) {
      return Tooltip({...props, display: 'top'})
    }
  }

  if (display === 'right') {
    top = top + (coordinates.height / 2)
    left = coordinates.left + STYLES.circle.width + coordinates.width
  }

  if (display === 'bottom') {
    top = top + coordinates.height + STYLES.circle.width
    left = left + (coordinates.width / 2)
  }

  if (display === 'top') {
    top = coordinates.top - STYLES.circle.width
    left = left + (coordinates.width / 2)

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
      <div
        style={{
          ...STYLES.spotlight,
          ...positionStyles.spotlight,
          ...spotlightExtraStyles
        }}
      />

      <div style={{...STYLES.circle, display: circleDisplay}}>
        <div style={STYLES.circleInner} />
      </div>
      <div style={{...STYLES.childrenWrapper, ...positionStyles.children}}>
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
                  Skip Tutorial
                </button>
                <div>
                  <span style={{marginRight: 10}}>
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
    </div>
  )
}

export default Tooltip
