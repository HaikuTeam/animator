import * as React from 'react'
import {LinkHolster} from '../LinkHolster'
import Palette from '../../../Palette'

const STYLES = {
  imgWrapper: {
    width: '100%',
    minHeight: '200px',
    background: Palette.GRAY,
  }
}

export default class Gif extends React.PureComponent {
  props

  static propTypes = {
    entry: React.PropTypes.string,
    userName: React.PropTypes.string,
    projectUid: React.PropTypes.string,
    sha: React.PropTypes.string,
  }

  get cdnBase() {
    let cdnBase = 'https://cdn.haiku.ai/';

    return `${cdnBase + this.props.projectUid}/${this.props.sha}/`;
  }

  render () {
    const gif = `${this.cdnBase}animation.gif`

    return (
      <div style={{textAlign: 'center'}}>
        <div style={STYLES.imgWrapper}>
          <img src={gif} />
        </div>
        <LinkHolster linkAddress={gif} showLoadingBar={false} dark={true} linkLenght={75} />
      </div>
    )
  }
}
