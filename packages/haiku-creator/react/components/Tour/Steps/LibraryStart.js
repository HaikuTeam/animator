import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Library</h2>
      <div style={styles.text}>
        <p style={styles.text}>Let's focus on the library now.</p>
        <p>
          You can drag any element from here to the stage to instantiate it.
        </p>
        <p>
        But let's try demonstrating the conected design and animation
        workflows first. Note xyz element let's change its color in Sketch
        and watch it update here in Haiku automatically.
        Double click the Sketch Diamond to open Sketch.</p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
