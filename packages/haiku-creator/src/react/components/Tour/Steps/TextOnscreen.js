import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Now, let’s move the text to the middle of the stage.</p>
        <video height='152' width='440' autoPlay loop muted playsInline preload='true'>
          <source src='https://giant.gfycat.com/HotIdealInvisiblerail.mp4' type='video/mp4' />
        </video>
        <p>Drag the playhead to <strong>Frame 30</strong>, and set <strong>Position X</strong> of <strong>Title 1</strong> to 85.</p>
      </div>
    </div>
  )
}
