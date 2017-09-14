import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Tweens</h2>
      <p style={styles.text}>
      You may notice now as you scrub your timeline, the element just jumps
      to your new position when it crosses this keyframe. Try making it a
      smooth transition by right clicking the space between keyframes and
      choosing "make a tween".
      </p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
