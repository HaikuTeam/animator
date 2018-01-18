import React from 'react'

export default class EmbeddedVideo extends React.PureComponent {
  render () {
    return (
      <video width='100%' height='144px' autoPlay loop muted playsInline preload>
        <source src={`./public/static/videos/${this.props.name}.mp4`} type='video/mp4' />
      </video>
    )
  }
}
