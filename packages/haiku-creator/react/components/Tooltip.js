import React from 'react'

const STYLES = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
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
  children: {
    position: 'absolute',
    minWidth: '260px'
  }
}

STYLES.TOP = {
  container: {
    flexDirection: 'column-reverse'
  },
  children: {
    bottom: 45
  }
}

STYLES.BOTTOM = {
  container: {
    flexDirection: 'column'
  },
  children: {
    top: 45
  }
}

STYLES.LEFT = {
  container: {
    flexDirection: 'row-reverse'
  },
  children: {
    right: '130%'
  }
}

STYLES.RIGHT = {
  container: {
    flexDirection: 'row'
  },
  children: {
    left: '110%'
  }
}

export default function ({ coordinates, display, children }) {
  let { top, left } = coordinates
  let circleDisplay = 'none'
  let positionStyles = STYLES[display.toUpperCase()] || {}

  if (display !== 'none') {
    circleDisplay = 'inline-block'
  }

  if (display === 'left') {
    top = top + 10
    left = coordinates.left - STYLES.circle.width - 20
  }

  if (display === 'right') {
    top = top + 10
    left = coordinates.left + 20
  }

  if (display === 'bottom') {
    top = top + 10
  }

  if (display === 'top') {
    top = top - 10
  }

  return (
    <div style={{top, left, ...STYLES.container, ...positionStyles.container}}>
      <div style={{...STYLES.circle, display: circleDisplay}}>
        <div style={STYLES.circleInner} />
      </div>
      <div style={{...STYLES.children, ...positionStyles.children}}>
        {children}
      </div>
    </div>
  )
}
