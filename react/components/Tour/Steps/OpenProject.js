import React from 'react'
import Dialog from '../../Dialog'

const STYLES = {
  text: {
    fontSize: 16
  }
}

export default function ({ style, next }) {
  return (
    <Dialog style={style}>
      <h2>Let's get started!</h2>
      <p style={STYLES.text}>First let's open up a sample project and learn some Haiku basics.</p>
    </Dialog>
  )
}
