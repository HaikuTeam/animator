import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>States</h2>
      <div style={styles.text}>
        <p>
          Add a new state. Give it a name and a value.
        </p>
      </div>
    </div>
  )
}
