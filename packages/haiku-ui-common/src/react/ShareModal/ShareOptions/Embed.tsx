import * as React from 'react'
import * as dedent from 'dedent'
import {PUBLISH_SHARED} from './PublishStyles'
import {CodeBox} from '../../CodeBox'

export default class Embed extends React.PureComponent {
  props

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
    projectUid: React.PropTypes.string,
    sha: React.PropTypes.string,
  }

  get cdnBase() {
    let cdnBase = 'https://cdn.haiku.ai/';

    return `${cdnBase + this.props.projectUid}/${this.props.sha}/`;
  }

  render () {
    const {userName, projectName, organizationName, sha} = this.props
    const scriptPath = `${this.cdnBase}index.standalone.js`;
    const embedPath = `${this.cdnBase}index.embed.js`;

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
            <CodeBox>
              {dedent`
                <div id="mount-${sha}"></div>
                <script src="${scriptPath}"></script>
                <script src="${embedPath}"></script>
                <script>
                  HaikuComponentEmbed_${organizationName}_${projectName}(
                    document.getElementById('mount-${sha}'),
                    {loop: true}
                  );
                </script>
              `}
            </CodeBox>
          </div>
        </div>
       </div>
    )
  }
}
