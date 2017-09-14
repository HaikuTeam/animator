import React from 'react'
import Dialog from '../../Dialog'

export default function ({ styles, next }) {
  return (
    <Dialog>
      <h2>Let's get started!</h2>
      <p style={styles.text}>First let's open up a sample project and learn some Haiku basics.</p>
    </Dialog>
  )
}
