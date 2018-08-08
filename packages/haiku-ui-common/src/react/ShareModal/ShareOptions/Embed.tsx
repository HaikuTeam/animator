import * as dedent from 'dedent';
import {HaikuShareUrls} from 'haiku-sdk-creator/lib/bll/Project';
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {PUBLISH_SHARED} from './PublishStyles';

export interface EmbedProps {
  projectName: string;
  userName: string;
  organizationName: string;
  urls: HaikuShareUrls;
}

export default class Embed extends React.PureComponent<EmbedProps> {
  render () {
    const {projectName, organizationName, urls} = this.props;
    const scriptPath = `https://code.haiku.ai/scripts/core/HaikuCore.${process.env.HAIKU_RELEASE_VERSION}.min.js`;

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
                <div id="mount"></div>
                <script src="${scriptPath}"></script>
                <script src="${urls.embed}"></script>
                <script>
                  HaikuComponentEmbed_${organizationName}_${projectName}(
                    document.getElementById('mount'),
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
