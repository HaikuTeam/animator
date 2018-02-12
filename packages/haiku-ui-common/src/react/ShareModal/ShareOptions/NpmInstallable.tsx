import * as React from 'react';
import * as Color from 'color';
import * as dedent from 'dedent';
import {PUBLISH_SHARED} from './PublishStyles';

export class NpmInstallable extends React.PureComponent {
  props;

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
  };

  render() {
    const {projectName, userName, organizationName} = this.props;

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
              Run the following from your project folder: <br />
            </div>
          </div>
        </div>
        <div style={PUBLISH_SHARED.instructionsRow}>
          <div style={PUBLISH_SHARED.instructionsCol1}>&nbsp;</div>
          <div style={PUBLISH_SHARED.instructionsCol2}>
            <code style={PUBLISH_SHARED.code}>
              {dedent`
                haiku init
                npm i --save @haiku/${organizationName.toLowerCase()}-${projectName}
              `}
            </code>
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
    );
  }
}
