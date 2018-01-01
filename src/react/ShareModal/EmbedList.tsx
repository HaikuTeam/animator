import * as React from 'react'
import * as assign from 'lodash.assign'
import Palette from '../../Palette'
import {ExternalLink} from '../ExternalLink'
import {EmbedCategory} from './EmbedCategory'
import {SHARE_OPTIONS} from './shareModalOptions'

const STYLES = {
  categories: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  subtitle: {
    textTransform: 'uppercase',
    fontSize: '14px'
  },
  circle: {
    display: 'inline-block',
    border: '1px solid currentColor',
    borderRadius: '50%',
    width: '1.3em',
    height: '1.3em',
    verticalAlign: 'middle',
    marginLeft: '5px',
    color: Palette.DARK_ROCK,
    fontSize: '0.7em',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '1.3em'
  }
}

export class EmbedList extends React.PureComponent {
  props;

  static propTypes = {
    onOptionClicked: React.PropTypes.func
  }

  renderShareOptions () {
    return Object.entries(SHARE_OPTIONS).map(([category, options]) => (
      <EmbedCategory
        key={category}
        category={category}
        options={options}
        onOptionClicked={this.props.onOptionClicked}
      />
    ))
  }

  render () {
    return (
      <div>
        <h4 style={assign({}, STYLES.subtitle)}>
          Embed Options

          <ExternalLink
            title='Embed Options Help'
            style={assign({}, STYLES.circle)}
            href='https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html'
          >
            ?
          </ExternalLink>
        </h4>

        <div style={assign({}, STYLES.categories)}>
          {this.renderShareOptions()}
         </div>
      </div>
    )
  }
}
