import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <img src='http://placehold.it/250x100' alt='' />
      <h2>Travel in time</h2>
      <p style={styles.text}>Haikus are built on timelines. Scrub the ticker to move through time and leave it on frame 15.</p>
    </Dialog>
  )
}
