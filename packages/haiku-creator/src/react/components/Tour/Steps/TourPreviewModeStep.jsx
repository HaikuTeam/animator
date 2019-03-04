import * as React from 'react';

export default function ({styles, openLink}) {
  return (
    <div>
      <h2 style={styles.heading}>Preview mode</h2>
      <p style={styles.text}>
        In preview mode you can <strong> see how your project is looking</strong>, and interact
        with it. If you choose to write code in your project, it will run here in Preview Mode. {' '}
        <a onClick={openLink} href="https://docs.haiku.ai/using-haiku/writing-expressions.html" style={styles.link}>Read more about writing code in Animator</a>
      </p>
    </div>
  );
}
