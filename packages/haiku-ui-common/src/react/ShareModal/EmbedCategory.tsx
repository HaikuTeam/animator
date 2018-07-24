import * as React from 'react';
import {EmbedOption} from './EmbedOption';
import {SelectedEntry} from './index';

const STYLES = {
  categoryWrapper: {
    flexGrow: 1,
    flexBasis: 0,
    paddingRight: '20px',
  },
  categoryOptions: {
    margin: '0',
    padding: '0',
    listStyle: 'none',
    width: '85%',
  },
  categoryTitle: {
    fontSize: '16px',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
};

export interface EmbedCategoryProps {
  category: string;
  options: any;
  onOptionClicked?: (option: {entry: SelectedEntry, template: string}) => void;
  isSnapshotSaveInProgress?: boolean;
  snapshotSyndicated?: boolean;
}

export class EmbedCategory extends React.PureComponent<EmbedCategoryProps> {
  renderCategoryOptions (options: any) {
    return Object.entries(options).map(([entry, {disabled, template}]: any) => (
      <EmbedOption
        key={entry}
        category={this.props.category}
        entry={entry}
        disabled={disabled}
        template={template}
        onClick={this.props.onOptionClicked}
        isSnapshotSaveInProgress={this.props.isSnapshotSaveInProgress}
        snapshotSyndicated={this.props.snapshotSyndicated}
      />
    ));
  }

  render () {
    return (
      <div style={STYLES.categoryWrapper}>
        <h3 style={STYLES.categoryTitle}>{this.props.category}</h3>
        <ul style={STYLES.categoryOptions}>
          {this.renderCategoryOptions(this.props.options)}
        </ul>
      </div>
    );
  }
}
