import React from 'react'

export default function ({ styles }) {
  return (
    <div style={{width: 440}}>
      <h2 style={styles.heading}>Library</h2>
      <div style={styles.text}>
        <p>Let's focus on the library now.</p>

        <p>You can drag any element from here to the stage to instantiate it.</p>

        <p>But let's check out the connected design and animation workflow first.  Notice the “checkmark” asset here, which is instantiated on the stage.  Let's change its color in Sketch and watch it update here in Haiku automatically.</p>

        <p><strong>Double-click the Sketch file to launch Sketch, then change the color of the checkmark and choose “File > Save” in Sketch.</strong></p>
      </div>
    </div>
  )
}
