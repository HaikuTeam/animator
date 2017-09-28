import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='88' width='206' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/JauntySociableAmphibian.mp4' type='video/mp4' />
        <img src='https://thumbs.gfycat.com/JauntySociableAmphibian-small.gif' height='88' width='206' />
      </video>
      <h2 style={styles.heading}>Sketch</h2>
      <div style={styles.text}>
        <p>Alright, did you notice it change?  (Go ahead and drag the timeline ticker forward in time, otherwise your opacity changes in Step 1 made the check invisible.)</p>
        <p>This is a central theme in Haiku—as a designer, you never lose your connection to your work.</p>
        <p>Let's move on to some of Haiku's features for building real apps.  Click on the icon to the left to toggle the State Inspector.</p>
      </div>
    </div>
  )
}
