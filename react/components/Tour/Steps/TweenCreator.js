import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height='67.2' width='392' autoPlay loop muted playsInline preload='true'>
        <source src='https://giant.gfycat.com/RegalNeglectedCutworm.mp4' type='video/mp4' />
      </video>
      <h2 style={styles.heading}>Tweens</h2>
      <p style={styles.text}>
      You may notice now as you scrub your timeline, the element just jumps
      to your new position when it crosses this keyframe. Try making it a
      smooth transition by right clicking the space between keyframes and
      choosing "make a tween".
      </p>
    </div>
  )
}
