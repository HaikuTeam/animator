import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='152' width='440' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/HotIdealInvisiblerail.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Now lets set the first keyframe to have an opacity of 0.</p>
        <ol style={styles.list}>
          <li>Drag the ticker back to frame 0</li>
          <li>Double click the box next to Opacity to edit it</li>
          <li>Type 0 and press enter</li>
        </ol>
      </div>
    </div>
  )
}
