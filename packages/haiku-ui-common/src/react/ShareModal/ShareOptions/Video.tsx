import {existsSync} from 'fs-extra';
import {HaikuShareUrls} from 'haiku-sdk-creator/lib/bll/Project';
import {join} from 'path';
import * as React from 'react';
import Palette from '../../../Palette';
import {LinkHolster} from '../LinkHolster';

const STYLES = {
  videoWrapper: {
    width: 'calc(100% + 20px)',
    minHeight: '200px',
    backgroundColor: Palette.GRAY,
    overflow: 'hidden',
  } as React.CSSProperties,
  video: {
    maxWidth: '100%',
    maxHeight: 440,
  },
};

export interface VideoProps {
  entry: string;
  userName: string;
  organizationName: string;
  urls: HaikuShareUrls;
  folder: string;
}

export default class Video extends React.PureComponent<VideoProps> {
  get videoUrl () {
    // Hack until we are simply subscribing to Envoy ExporterHandler.
    const maybeLocalFile = join(this.props.folder, 'animation.mp4');
    return existsSync(maybeLocalFile) ? maybeLocalFile : this.props.urls.video;
  }

  render () {
    return (
      <div style={{textAlign: 'center'}}>
        <div style={STYLES.videoWrapper}>
          <video controls={true} style={STYLES.video}>
            <source src={this.videoUrl} type="video/mp4" />
          </video>
        </div>
        <div style={{width: 'calc(100% + 20px)'}}>
          <LinkHolster
            linkAddress={this.props.urls.video}
            showLoadingBar={false}
            dark={true}
          />
        </div>
      </div>
    );
  }
}
