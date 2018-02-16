import * as React from 'react';
import {EmbedOption} from './EmbedOption';

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
    marginBottom: 6
  },
};

export class EmbedCategory extends React.PureComponent {
  props;

  static propTypes = {
    category: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
    onOptionClicked: React.PropTypes.func,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    snapshotSyndicated: React.PropTypes.bool,
    snapshotPublished: React.PropTypes.bool,
  };

  renderCategoryOptions (options: Object) {
    return Object.entries(options).map(([entry, {disabled, template}]) => (
      <EmbedOption
        key={entry}
        category={this.props.category}
        entry={entry}
        disabled={disabled}
        template={template}
        onClick={this.props.onOptionClicked}
        isSnapshotSaveInProgress={this.props.isSnapshotSaveInProgress}
        snapshotSyndicated={this.props.snapshotSyndicated}
        snapshotPublished={this.props.snapshotPublished}
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
