import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Animations</h2>
      <div style={styles.text}>
        <p>Let’s animate <strong>Title 1</strong> to make it bounce in from the right. First, let’s start our animation with the text being off stage.</p>
        <video height='114.24' width='316.96' autoPlay loop muted playsInline preload='true'>
          <source src='https://giant.gfycat.com/WanWellwornBalloonfish.mp4' type='video/mp4' />
        </video>
        <p>With the playhead at <strong>Frame 0</strong>, ensure <strong>Position X</strong> of <strong>Title 1</strong> is 300.</p>
      </div>
    </div>
  )
}
