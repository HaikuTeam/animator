import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='67.2' width='392' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/RegalNeglectedCutworm.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Tweens</h2>
      <div style={styles.text}>
        <p> You may notice now as you scrub your timeline, the element just jumps to your new opacity when it crosses this keyframe.</p>
        <p>Let's make the opacity animate with a smooth transition:</p>
        <ol>
          <li>Right-click (or ctrl+click) the space between keyframes and choose “make a tween”</li>
          <li>Select any easing curve you'd like.  Each curve gives difference character to your animation—go ahead and experiment!</li>
        </ol>
      </div>
    </div>
  )
}
