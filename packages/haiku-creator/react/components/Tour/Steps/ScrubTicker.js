import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height="116" width="264" autoPlay loop muted playsInline preload="true" poster="https://thumbs.gfycat.com/OrdinaryIckyBalloonfish-small.gif">
        <source src="https://giant.gfycat.com/OrdinaryIckyBalloonfish.mp4" type="video/mp4" />
        <img src="https://thumbs.gfycat.com/OrdinaryIckyBalloonfish-small.gif" height="116" width="264" />
      </video>
      <h2 style={styles.heading}>Travel in time</h2>
      <p style={styles.text}>Haikus are built on timelines. Scrub the ticker to move through time and leave it on frame 15.</p>
    </div>
  )
}
