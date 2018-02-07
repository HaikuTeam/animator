import * as React from 'react'
import * as assign from 'lodash.assign'
import Palette from '../../Palette'
import {Tooltip} from '../Tooltip'
import {ExternalLink} from '../ExternalLink'
import {EmbedCategory} from './EmbedCategory'
import {SHARE_OPTIONS} from './shareModalOptions'

const STYLES = {
  categories: {
    display: 'flex',
    justifyContent: 'space-between'
  } as React.CSSProperties,
  subtitle: {
    textTransform: 'uppercase',
    fontSize: '14px',
    marginBottom: '0'
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
    onOptionClicked: React.PropTypes.func,
    isSnapshotSaveInProgress: React.PropTypes.bool,
    snapshotSyndicated: React.PropTypes.bool,
  }

  renderShareOptions () {
    return Object.entries(SHARE_OPTIONS).map(([category, options]) => (
      <EmbedCategory
        key={category}
        category={category}
        options={options}
        onOptionClicked={this.props.onOptionClicked}
        isSnapshotSaveInProgress={this.props.isSnapshotSaveInProgress}
        snapshotSyndicated={this.props.snapshotSyndicated}
      />
    ))
  }

  render () {
    return (
      <div>
        <h4 style={STYLES.subtitle}>
          Install Options

        <Tooltip content='Docs' place='right'>
          <ExternalLink
            style={STYLES.circle}
            href='https://docs.haiku.ai/embedding-and-using-haiku/publishing-and-embedding.html'
          >
            ?
          </ExternalLink>
        </Tooltip>
        </h4>

        <div style={STYLES.categories}>
          {this.renderShareOptions()}
         </div>
      </div>
    )
  }
}
