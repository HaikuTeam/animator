import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <img src='http://placehold.it/250x100' alt='' />
      <h2 style={styles.heading}>Travel in time</h2>
      <p style={styles.text}>Haikus are built on timelines. Scrub the ticker to move through time and leave it on frame 15.</p>
    </div>
  )
}
