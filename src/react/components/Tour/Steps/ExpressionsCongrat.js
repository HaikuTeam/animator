import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Yay!</h2>
      <div style={styles.text}>
        <p>
          Congrats you just discovered Haiku expressions!
        </p>
      </div>
    </div>
  )
}
