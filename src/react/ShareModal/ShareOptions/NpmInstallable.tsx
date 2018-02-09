import * as React from 'react'
import * as Color from 'color'
import {PUBLISH_SHARED} from './PublishStyles'

export class NpmInstallable extends React.PureComponent {
  render() {
    return (
      <div style={PUBLISH_SHARED.block}>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>
            <span style={PUBLISH_SHARED.bullet}>1</span>
          </div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            Install the Haiku CLI: <br />
          </div>
        </div>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>&nbsp;</div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <code style={PUBLISH_SHARED.code}>npm install -g @haiku/cli</code>
          </div>
        </div>

        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>
            <span style={PUBLISH_SHARED.bullet}>2</span>
          </div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <div style={{marginTop: 19}}>
              Run the following from your React project folder: <br />
            </div>
          </div>
        </div>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>&nbsp;</div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <code style={PUBLISH_SHARED.code}>haiku install percy</code>
          </div>
        </div>

        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>
            <span style={PUBLISH_SHARED.bullet}>3</span>
          </div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <div style={{marginTop: 19}}>
              Example use: <br />
            </div>
          </div>
        </div>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>&nbsp;</div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
