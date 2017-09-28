import React from 'react'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>Expressions (Advanced)</h2>
      <div style={styles.text}>
        <p>Think of Expressions as “Excel Formulas.”  They're the easiest way to put any of your States to use.</p>

        <p>Any property on the timeline can be an Expression instead of a plain old number.  In fact, you can set different Expressions and numbers at different keyframes, then animate between them!</p>

        <p>This is an advanced feature, so we invite you to check it out later—but all you have to do is start your value with an '=' sign, and Haiku will know you're writing an Expression.  For example:</p>

        <pre style={styles.code}>
          <code>= myState * 2</code>
        </pre>
      </div>
    </div>
  )
}
