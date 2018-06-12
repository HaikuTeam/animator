import * as React from 'react';
import {enumerateAllProjectsByOrganization} from 'haiku-serialization/src/utils/HaikuHomeDir';
import Palette from 'haiku-ui-common/lib/Palette';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

export default class OfflineModePage extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      organizations: {},
    };

    return enumerateAllProjectsByOrganization((err, organizations) => {
      if (err) {
        return logger.error(err);
      }
      this.setState({organizations});
    });
  }

  renderProjectsList (orgName) {
    const projects = this.state.organizations[orgName];
    return projects.map(({project, abspath}, index) => {
      return (
        <span
          key={abspath}>
          <span
            style={{
              listStyleType: 'none',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={() => {
              this.props.setProjectLaunchStatus({
                launchingProject: true,
              });

              return this.props.launchFolder(project, abspath, (err) => {
                if (err) {
                  return logger.error(err);
                }
              });
            }}>
            {project}
          </span>
          {(index < projects.length - 1) ? ', ' : ''}
        </span>
      );
    });
  }

  renderProjectsArea () {
    if (!this.state.organizations) {
      return <span />;
    }
    if (Object.keys(this.state.organizations).length < 1) {
      return <span />;
    }
    return (
      <div>
        {Object.keys(this.state.organizations).map((orgName) => {
          return (
            <div
              key={orgName}>
              <p style={{
                maxWidth: 600,
                margin: '0 auto 20px',
                fontSize: 16,
              }}>
                <span><strong>{orgName}</strong>'s projects: </span>
                {this.renderProjectsList(orgName)}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  render () {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: Palette.GRAY,
          paddingTop: 100,
        }}
        className="no-select"
        id="offline-mode-page">
        <div
          style={{
            textAlign: 'center',
          }}>
          <p style={{fontSize: 24}}>
            It seems your computer is not<br />
            connected to the internet.
          </p>
          <p style={{fontSize: 24}}>
            You can always edit Haiku projects<br />
            offline, but you won't be able<br />
            to publish them until you connect.
          </p>
          <br />
          {this.renderProjectsArea()}
        </div>
      </div>
    );
  }
}

OfflineModePage.propTypes = {
  launchFolder: React.PropTypes.func.isRequired,
  setProjectLaunchStatus: React.PropTypes.func.isRequired,
};
