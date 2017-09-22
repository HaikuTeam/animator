import React from 'react'

export default function ({ styles, finish, openLink }) {
  return (
    <div>
      <h2 style={styles.heading}>Thanks for taking the tour!</h2>
      <div style={styles.text}>
        Take it anytime again from the 'Help' menu. Be sure to check us out
        at the following links for more help.

        <div style={styles.linksWrapper}>
          <a onClick={openLink} href='https://docs.haiku.ai/' style={styles.link}>Haiku Docs</a> <br />
          <a onClick={openLink} href='https://haiku-community.slack.com' style={styles.link}>Haiku Slack Community</a> <br />
          <a onClick={openLink} href='https://twitter.com/HaikuForTeams' style={styles.link}>@HaikuForTeams</a> <br />
          <a onClick={openLink} href='mailto:support@haiku.ai' style={styles.link}>support@haiku.ai</a> <br />
        </div>
      </div>
      <button
        style={styles.btn}
        onClick={() => finish(true, false)}
      > Finish
      </button>
    </div>
  )
}
