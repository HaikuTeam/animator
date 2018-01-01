import * as React from 'react'
import * as assign from 'lodash.assign'
import {SHARE_OPTIONS} from './shareModalOptions'
import {EmbedOption} from './EmbedOption'

const STYLES = {
  categoryWrapper: {
    flexGrow: 1,
    flexBasis: 0,
    paddingRight: '20px'
  },
  categoryOptions: {
    margin: '0',
    padding: '0',
    listStyle: 'none',
    width: '85%'
  },
  categoryTitle: {
    fontSize: '16px',
    textTransform: 'uppercase'
  }
}

export class EmbedCategory extends React.PureComponent {
  props;

  static propTypes = {
    category: React.PropTypes.string.isRequired,
    options: React.PropTypes.object.isRequired,
    onOptionClicked: React.PropTypes.func
  }

  renderCategoryOptions (options: Object) {
    return Object.entries(options).map(([entry, {disabled}]) => (
      <EmbedOption
        key={entry}
        entry={entry}
        disabled={disabled}
        onClick={this.props.onOptionClicked}
      />
    ))
  }

  render () {
    return (
      <div style={STYLES.categoryWrapper}>
        <h3 style={STYLES.categoryTitle}>{this.props.category}</h3>
        <ul style={STYLES.categoryOptions}>
          {this.renderCategoryOptions(this.props.options)}
        </ul>
      </div>
    )
  }
}
