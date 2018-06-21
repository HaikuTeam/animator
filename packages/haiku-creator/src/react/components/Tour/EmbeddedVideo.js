import * as React from 'react';

export default class EmbeddedVideo extends React.PureComponent {
  render () {
    return (
      <video width="100%" height="144px" autoPlay={true} loop={true} muted={true} playsInline={true} preload={true}>
        <source src={`./public/static/videos/${this.props.name}.mp4`} type="video/mp4" />
      </video>
    );
  }
}
