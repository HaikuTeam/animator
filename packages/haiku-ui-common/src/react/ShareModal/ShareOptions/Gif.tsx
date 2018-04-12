import * as React from 'react';
import {LinkHolster} from '../LinkHolster';
import Palette from '../../../Palette';

const STYLES = {
  imgWrapper: {
    width: 'calc(100% + 20px)',
    minHeight: '200px',
    backgroundColor: Palette.GRAY,
    overflow: 'hidden',
  } as React.CSSProperties,
  image: {
    maxWidth: 'calc(100% + 20px)',
    maxHeight: '440px',
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
        <div style={{width: 'calc(100% + 20px)'}}>
          <LinkHolster
            linkAddress={gif}
            showLoadingBar={false}
            dark={true}
          />
        </div>
      </div>
    );
  }
}
