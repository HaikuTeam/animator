import React from 'react'
import {shell} from 'electron'
import EmbeddedVideo from '../EmbeddedVideo'

export default function ({ styles }) {
  return (
    <div>
      <h2 style={styles.heading}>[Advanced] Just add code</h2>
      <div style={styles.text}>
        <p>Want to learn more about adding interactivity to your designs?</p>
        <EmbeddedVideo name={'AdvancedUsage'} />
        <p>Read the docs and find tutorials at: <a href='#' style={styles.link} onClick={(e) => { e.preventDefault(); shell.openExternal('https://docs.haiku.ai') }}>https://docs.haiku.ai</a></p>
      </div>
    </div>
  )
}
