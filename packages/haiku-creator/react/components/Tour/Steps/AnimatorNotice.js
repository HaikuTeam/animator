import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Congratulations!</h2>
      <p style={styles.text}>You're now an animator.</p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
