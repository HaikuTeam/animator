import * as dedent from 'dedent';
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {PUBLISH_SHARED} from './PublishStyles';

export interface EmbedProps {
  projectName: string;
  userName: string;
  organizationName: string;
  projectUid: string;
  sha: string;
}

export default class Embed extends React.PureComponent<EmbedProps> {
  get cdnBase () {
    const cdnBase = 'https://cdn.haiku.ai/';

    return `${cdnBase + this.props.projectUid}/${this.props.sha}/`;
  }

  render () {
    const {projectName, organizationName, sha} = this.props;
    const scriptPath = `https://code.haiku.ai/scripts/core/HaikuCore.${process.env.HAIKU_RELEASE_VERSION}.min.js`;
    const embedPath = `${this.cdnBase}index.embed.js`;

    return (
      <div style={PUBLISH_SHARED.block}>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1} />
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
    );
  }
}
