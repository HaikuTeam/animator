import * as React from 'react';
import * as ShareTemplates from './ShareOptions';
import {SHARED_STYLES} from '../../SharedStyles';

const STYLES = {
  wrapper: {
    padding: '20px',
    color: 'white',
  },
};

export class EmbedDetails extends React.PureComponent {
  props;

  static propTypes = {
    entry: React.PropTypes.object,
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
    onHide: React.PropTypes.func.isRequired,
    projectUid: React.PropTypes.string,
    sha: React.PropTypes.string,
    mixpanel: React.PropTypes.object,
  };

  render () {
    if (!this.props.entry) { return null; }

    // tslint:disable-next-line:variable-name
    const Template = ShareTemplates[this.props.entry.template];

    return (
      <div style={STYLES.wrapper}>
        <button onClick={this.props.onHide} style={SHARED_STYLES.btn}>
          &lt; ALL OPTIONS
        </button>

        <Template
          entry={this.props.entry.entry}
          projectName={this.props.projectName}
          userName={this.props.userName}
          organizationName={this.props.organizationName}
          projectUid={this.props.projectUid}
          sha={this.props.sha}
          mixpanel={this.props.mixpanel}
        />
      </div>
    );
  }
}
