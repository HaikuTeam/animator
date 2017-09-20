import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <video height="110" width="260" autoPlay loop muted playsInline preload="true">
        <source src="https://giant.gfycat.com/EarnestDearAmethystsunbird.mp4" type="video/mp4" />
        <img src="https://thumbs.gfycat.com/EarnestDearAmethystsunbird-small.gif" height="110" width="260" />
      </video>
      <h2 style={styles.heading}>States</h2>
      <div style={styles.text}>
        <p>
          Add a new state. Give it a name and a value.
        </p>
      </div>
    </div>
  )
}
