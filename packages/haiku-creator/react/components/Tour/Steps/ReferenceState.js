import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>States</h2>
      <div style={styles.text}>
        <p>
          Try referencing your new state in your input field. Put an "=" in
          front of it and add a simple calculation.
        </p>
      </div>
    </div>
  )
}
