import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='114.24' width='316.96' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/WanWellwornBalloonfish.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Let's animate the opacity of the checkmark, so it fades in smoothly from fully transparent to fully visible.  First, let's set the final value for the transition:</p>
        <ol style={styles.list}>
          <li>Drag the ticker to frame 16</li>
          <li>Click on the word “checkmark” below to expand its properties</li>
          <li>Then double-click the box next to “Opacity” to change its value</li>
          <li>Ensure the value is 1, then press Enter</li>
        </ol>
      </div>
    </div>
  )
}
