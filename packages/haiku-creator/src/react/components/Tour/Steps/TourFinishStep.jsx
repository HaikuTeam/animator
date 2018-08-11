import * as React from 'react';

export default function ({styles, openLink}) {
  return (
    <div>
      <h2 style={styles.heading}>That’s a wrap!</h2>
      <div style={styles.text}>
        Now it's your turn to build something awesome using Haiku. You can <strong>check out the following resources</strong> to help you kick-start your first project:

        <div style={styles.linksWrapper}>
          - <a onClick={openLink} href="https://www.haiku.ai/learn/" style={styles.link}>Tutorials</a> <br />
          - <a onClick={openLink} href="https://docs.haiku.ai/" style={styles.link}>Documentation</a> <br />
          - <a onClick={openLink} href="https://help.haiku.ai/" style={styles.link}>Help (FAQs &amp; troubleshooting)</a> <br />
          - <a onClick={openLink} href="https://share.haiku.ai/" style={styles.link}>Showcase</a>: Get inspired and learn from others by <a onClick={openLink} href="https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html#forking" style={styles.link}>forking</a> projects!
        </div>
      </div>
    </div>
  );
}
