import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='220' width='460' autoPlay='' loop='' muted='' playsInline='' preload='true'>
        <source src='creator:///assets/scrub_ticker.webm' type='video/webm' />
      </video>
      <h2 style={styles.heading}>Travel in time</h2>
      <p style={styles.text}>Haikus are built on timelines. Scrub the ticker to move through time and leave it on frame 15.</p>
    </div>
  )
}
