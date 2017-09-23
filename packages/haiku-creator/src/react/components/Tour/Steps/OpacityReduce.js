import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='152' width='440' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/HotIdealInvisiblerail.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Now move the ticker back to the starting position and change that keyframe to 0.</p>
      </div>
    </div>
  )
}
