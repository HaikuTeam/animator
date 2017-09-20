import React from 'react'

export default function ({ styles }) {
  return (
    <div style={{width: 300}}>
      <h2 style={styles.heading}>Summonables</h2>
      <div style={styles.text}>
        <p>
          In addition to states you create, there are also "built-in" summonables
          that can be referenced.
          Try the one below and move your mouse over the stage. For a full list
          of the built-in summonables, visit our <a href='https://docs.haiku.ai/using-haiku/summonables.html' style={styles.link}>docs.</a>
        </p>
      </div>
    </div>
  )
}
