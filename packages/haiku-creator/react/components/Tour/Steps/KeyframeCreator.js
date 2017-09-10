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
      <img src='https://thumbs.gfycat.com/FalseNiftyCricket-size_restricted.gif' style={{width: 250}} alt='' />
      <h2>Keyframes</h2>
      <p style={STYLES.text}>
      Try right clicking a property row, choosing "create keyframe",
      and changing the value at this point in time.
      </p>
      <button style={STYLES.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
