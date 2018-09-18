import {existsSync} from 'fs-extra';
import {HaikuShareUrls} from 'haiku-sdk-creator/lib/bll/Project';
import {join} from 'path';
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
  folder: string;
  urls: HaikuShareUrls;
}

export default class Gif extends React.PureComponent<GifProps> {
  get gifUrl () {
    // Hack until we are simply subscribing to Envoy ExporterHandler.
    const maybeLocalFile = join(this.props.folder, 'animation.gif');
    // If serving a local file, we append ?<current timestamp> to cache-bust.
    return existsSync(maybeLocalFile) ? `${maybeLocalFile}?${Date.now()}` : this.props.urls.gif;
  }

  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={STYLES.imgWrapper}>
          <img src={this.gifUrl} style={STYLES.image} />
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
