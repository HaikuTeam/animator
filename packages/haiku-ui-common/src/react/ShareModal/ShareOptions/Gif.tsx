import {HaikuShareUrls} from 'haiku-sdk-creator/lib/bll/Project';
import * as React from 'react';
import Palette from '../../../Palette';
import {LinkHolster} from '../LinkHolster';

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

export interface GifProps {
  entry: string;
  userName: string;
  organizationName: string;
  urls: HaikuShareUrls;
}

export default class Gif extends React.PureComponent<GifProps> {
  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={STYLES.imgWrapper}>
          <img src={this.props.urls.gif} style={STYLES.image} />
        </div>
        <div style={{width: 'calc(100% + 20px)'}}>
          <LinkHolster
            linkAddress={this.props.urls.gif}
            showLoadingBar={false}
            dark={true}
          />
        </div>
      </div>
    );
  }
}
