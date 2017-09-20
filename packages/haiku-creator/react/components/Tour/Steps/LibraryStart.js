import React from 'react'

export default function ({ styles }) {
  return (
    <div style={{width: 440}}>
      <h2 style={styles.heading}>Library</h2>
      <div style={styles.text}>
        <p>Let's focus on the library now.</p>
        <p>
          You can drag any element from here to the stage to instantiate it.
        </p>
        <p>
          But let's try demonstrating the conected design and animation
          workflows first. Note the "checkmarck" element, let's change
          its color in Sketch and watch it update here in Haiku automatically.
          Double click the Sketch Diamond to open Sketch.
        </p>
      </div>
    </div>
  )
}
