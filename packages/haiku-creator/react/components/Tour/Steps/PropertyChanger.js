import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <img src='http://placehold.it/250x100' alt='' />
      <h2>Play with properties</h2>
      <p style={styles.text}>Each component has elements whose properties can be changed at any point in time.</p>
      <button style={styles.btn} onClick={next}>Next</button>
    </Dialog>
  )
}
