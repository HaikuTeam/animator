import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <img src='https://thumbs.gfycat.com/FalseNiftyCricket-size_restricted.gif' style={{width: 250}} alt='' />
      <h2>Keyframes</h2>
      <p style={styles.text}>
      Try right clicking a property row, choosing "create keyframe",
      and changing the value at this point in time.
      </p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
