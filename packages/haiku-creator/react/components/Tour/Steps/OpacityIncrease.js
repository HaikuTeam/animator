import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='163.2' width='452.8' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/WanWellwornBalloonfish.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Let's see if we can fade the checkmark in from 0 opacity to 1 opacity.</p>
        <p><strong>Start by moving the scrubber to frame 16 and inputting '1' into the input and pressing 'return'</strong></p>
        <p>You will see this has created a new keyframe.</p>
      </div>
    </div>
  )
}
