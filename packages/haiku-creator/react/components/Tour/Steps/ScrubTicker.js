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
      <img src='http://placehold.it/250x100' alt='' />
      <h2>Travel in time</h2>
      <p style={STYLES.text}>Haikus are built on timelines. Scrub the ticker to move through time.</p>
    </Dialog>
  )
}
