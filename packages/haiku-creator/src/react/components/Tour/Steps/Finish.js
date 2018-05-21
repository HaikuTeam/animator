import React from 'react'

export default function ({ styles, openLink }) {
  return (
    <div>
      <h2 style={styles.heading}>That’s a wrap!</h2>
      <div style={styles.text}>
        You can now manage elements in your library, animate them and publish them to the web!

        If you’d like more help, you can re-take this tour at any time from the Help menu, or contact us on:

        <div style={styles.linksWrapper}>
          - Slack: <a onClick={openLink} href=' https://www.haiku.ai/slack-community/' style={styles.link}>Haiku Community</a> <br />
          - Email: <a onClick={openLink} href='mailto:support@haiku.ai' style={styles.link}>support@haiku.ai</a> <br />
        </div>
      </div>
    </div>
  )
}
