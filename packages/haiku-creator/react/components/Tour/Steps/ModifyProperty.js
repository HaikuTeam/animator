import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Properties</h2>
      <div style={styles.text}>
        <p>
           Click on "Checkmark" element on the timeline to expand it and
           change the opacity value.
        </p>
      </div>
    </div>
  )
}
