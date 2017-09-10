import React from 'react'
import Radium from 'radium'
import Palette from './Palette'

const STYLES = {
  container: {
    WebkitUserSelect: 'none',
    backgroundColor: Palette.COAL,
    padding: 20,
    borderRadius: '3px',
    color: Palette.ROCK,
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)'
  }
}

function Dialog ({ children, style }) {
  return (
    <div style={{...style, ...STYLES.container}}>
      {children}
    </div>
  )
}

export default Radium(Dialog)
