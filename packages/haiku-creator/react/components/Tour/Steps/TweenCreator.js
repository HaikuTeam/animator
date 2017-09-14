import React from 'react'
import Dialog from '../../Dialog'
import { DASH_STYLES } from '../../../styles/dashShared'

const STYLES = {
  btn: {
    ...DASH_STYLES.btn,
    padding: '10px 15px',
    margin: '0 10px 0 0',
    fontSize: 16
  },
  text: {
    fontSize: 16
  }
}

export default function ({ style, next }) {
  return (
    <Dialog style={style}>
      <h2>Tweens</h2>
      <p style={STYLES.text}>
      You may notice now as you scrub your timeline, the element just jumps
      to your new position when it crosses this keyframe. Try making it a
      smooth transition by right clicking the space between keyframes and
      choosing "make a tween".
      </p>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
