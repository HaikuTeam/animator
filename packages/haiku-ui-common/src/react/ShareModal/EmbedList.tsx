import * as React from 'react';
import Palette from '../../Palette';
import {ExternalLink} from '../ExternalLink';
import {Tooltip} from '../Tooltip';
import {EmbedCategory} from './EmbedCategory';
import {SelectedEntry} from './index';
import {getShareOptions} from './ShareModalOptions';

const STYLES = {
  categories: {
    display: 'flex',
    justifyContent: 'space-between',
  } as React.CSSProperties,
  subtitle: {
    textTransform: 'uppercase',
    fontSize: '14px',
    marginBottom: '0',
    fontWeight: 400,
  } as React.CSSProperties,
  circle: {
    display: 'inline-block',
    border: '1px solid currentColor',
    borderRadius: '50%',
    width: '1.1em',
    height: '1.2em',
    verticalAlign: 'middle',
    marginLeft: '5px',
    color: Palette.DARK_ROCK,
    fontSize: '0.7em',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '1.2em',
    marginTop: '-2px',
  } as React.CSSProperties,
};

export interface EmbedListProps {
  onOptionClicked: (option: {entry: SelectedEntry, template: string}) => void;
  isSnapshotSaveInProgress: boolean;
  snapshotSyndicated: boolean;
  mixpanel: any;
  supportOfflineExport: boolean;
  hasError: boolean;
}

export interface EmbedListStates {
  shareOptions: [string, any][];
}

export class EmbedList extends React.PureComponent<EmbedListProps, EmbedListStates> {
  constructor (props: EmbedListProps) {
    super(props);
    this.state = {
      shareOptions: Object.entries(getShareOptions(props.supportOfflineExport)),
    };
  }

  renderShareOptions () {
    return this.state.shareOptions.map(([category, options]) => (
      <EmbedCategory
        key={category}
        category={category}
        options={options}
        onOptionClicked={this.props.onOptionClicked}
        isSnapshotSaveInProgress={this.props.isSnapshotSaveInProgress}
        snapshotSyndicated={this.props.snapshotSyndicated}
        hasError={this.props.hasError}
      />
    ));
  }

  componentWillReceiveProps (nextProps: EmbedListProps) {
    this.setState({
      shareOptions: Object.entries(getShareOptions(nextProps.supportOfflineExport)),
    });
  }

  private onClick = () => {
    this.props.mixpanel.haikuTrack('install-options', {
      from: 'app',
      event: 'open-help-embedding',
    });
  };

  render () {
    return (
      <div>
        <h4 style={STYLES.subtitle}>
          Install Options

        <Tooltip content="Docs" place="right">
          <ExternalLink
            style={STYLES.circle}
            href="https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html"
            onClick={this.onClick}
          >
            ?
          </ExternalLink>
        </Tooltip>
        </h4>

        <div style={STYLES.categories}>
          {this.renderShareOptions()}
         </div>
      </div>
    );
  }
}
