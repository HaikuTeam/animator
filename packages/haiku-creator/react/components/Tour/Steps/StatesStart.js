import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>States</h2>
      <div style={styles.text}>
        <p>
          Alright, did you notice it change! That's the beauty of Haiku -
          you don't lose your ability to continue designing.
        </p>
        <p>
          Let's move ahead and toggle to the State Inspector.
        </p>
      </div>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
