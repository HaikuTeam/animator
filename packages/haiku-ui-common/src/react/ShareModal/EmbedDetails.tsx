import * as React from 'react';
import {SHARED_STYLES} from '../../SharedStyles';
import * as ShareTemplates from './ShareOptions';

const STYLES = {
  wrapper: {
    padding: '20px',
    color: 'white',
  },
};

export interface EmbedDetailsProps {
  entry?: any;
  projectName?: string;
  userName?: string;
  organizationName?: string;
  onHide: (event: any) => void;
  projectUid?: string;
  sha?: string;
  mixpanel?: any;
}

export class EmbedDetails extends React.PureComponent<EmbedDetailsProps> {
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
