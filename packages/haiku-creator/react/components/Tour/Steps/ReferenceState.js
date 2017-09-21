import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Expression</h2>
      <div style={styles.text}>
        <p>You can reference your new state in any of your elements' properties.</p>

        <p>To create an expression, click on a field, type an “=” to start an expression, then type a simple formula like “= myState * 2”</p>

        <p>Expressions allow you to work with States as mock data—</p>
      </div>
    </div>
  )
}
