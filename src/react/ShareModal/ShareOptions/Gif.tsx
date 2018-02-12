import * as React from 'react';
import {LinkHolster} from '../LinkHolster';
import Palette from '../../../Palette';

const STYLES = {
  imgWrapper: {
    width: '100%',
    minHeight: '200px',
    background: Palette.GRAY,
    overflow: 'hidden',
  } as React.CSSProperties,
  image: {
    maxWidth: '100%',
  },
};

export default class Gif extends React.PureComponent {
  props;
  imgEl;

  static propTypes = {
    entry: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
    projectUid: React.PropTypes.string,
    sha: React.PropTypes.string,
  };

  get cdnBase() {
    const cdnBase = 'https://cdn.haiku.ai/';

    return `${cdnBase + this.props.projectUid}/${this.props.sha}/`;
  }

  render() {
    const gif = `${this.cdnBase}animation.gif`;

    return (
      <div style={{textAlign: 'center'}}>
        <div style={STYLES.imgWrapper}>
          <img src={gif} style={STYLES.image} />
        </div>
        <LinkHolster
          linkAddress={gif}
          showLoadingBar={false}
          dark={true}
          linkLenght={75}
        />
      </div>
    );
  }
}
