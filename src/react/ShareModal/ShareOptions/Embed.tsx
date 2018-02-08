import * as React from 'react'
import {PUBLISH_SHARED} from './PublishStyles'

export default class Embed extends React.PureComponent {
  render () {
    return (
      <div style={PUBLISH_SHARED.block}>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>
          </div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            Example usage: <br />
          </div>
        </div>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>&nbsp;</div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <code style={PUBLISH_SHARED.code}>
              {`
                <div id="mount-b0d5e758-77d4-48df-a966-a168bdfad0b7"></div>
                <script src="https://code.haiku.ai/scripts/core/HaikuCore.3.0.21.min.js"></script>
                <script src="https://cdn.haiku.ai/0f8a24de-4f24-4b51-9c4c-da30ff838caa/7dd870deef3f287f9c030404190f2ee89e8000b3/index.embed.js"></script>
                <script>
                  HaikuComponentEmbed_ash_shik2(
                    document.getElementById('mount-b0d5e758-77d4-48df-a966-a168bdfad0b7'),
                    {loop: true}
                  );
                </script>
              `}
            </code>
          </div>
        </div>
       </div>
    )
  }
}
