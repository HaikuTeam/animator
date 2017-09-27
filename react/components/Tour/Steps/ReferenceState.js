import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Expressions</h2>
      <div style={styles.text}>
        <p>You can reference your new state in any of your elements' properties.</p>

        <p>To create an expression, click on a field, type an “=” to start an expression, then type a simple formula like:</p>

        <pre style={styles.code}>
          <code>= myState * 2</code>
        </pre>

        <p>Expressions allow you to work with States as mock data—</p>
      </div>
    </div>
  )
}
