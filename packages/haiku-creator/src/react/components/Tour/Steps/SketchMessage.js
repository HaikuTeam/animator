import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Working with Sketch</h2>
      <div style={styles.text}>
        <p>Did you see it change immediately in the Haiku stage? Haiku monitors Sketch slices and artboards even after they’re integrated.</p>

        <p>To work with new elements, add a new slice to Sketch and you can drag and drop them to the stage.</p>
      </div>
    </div>
  )
}
