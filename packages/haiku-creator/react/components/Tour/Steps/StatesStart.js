import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>States</h2>
      <div style={styles.text}>
        <p>
          Alright, did you notice it change! That's the beauty of Haiku -
          you don't lose your ability to continue designing.
        </p>
        <p>
          Let's move ahead and toggle to the State Inspector, click on the icon
          to switch.
        </p>
      </div>
    </div>
  )
}
