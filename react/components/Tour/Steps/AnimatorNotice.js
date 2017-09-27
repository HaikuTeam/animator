import React from 'react'
import CheckTutorial from '@haiku/zack2-checktutorial/react'

export default function ({ styles }) {
  return (
    <div>
      <CheckTutorial haikuOptions={{loop: false}} />
      <h2 style={styles.heading}>Congratulations!</h2>
      <p style={styles.text}>You're now an animator.</p>
    </div>
  )
}
