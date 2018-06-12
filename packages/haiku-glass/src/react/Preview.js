import React from 'react'
import HaikuDOMAdapter from '@haiku/core/dom'
import {InteractionMode} from '@haiku/core/lib/helpers/interactionModes'

export default class Preview extends React.Component {
  mountHaikuComponent () {
    // If somehow the previous component still exists, destroy it
    if (this.component) {
      this.component.getClock().stop()
    }

    // We can't load from disk because the update may have not synchronized by the point that
    // preview mode is launched, so instead we just create a pristing copy of the bytecode
    const bytecode = this.props.component.getMemorySafeCleanBytecode()

    const factory = HaikuDOMAdapter(bytecode)

    this.component = factory(
      this.mount,
      {
        alwaysComputeSizing: false,
        loop: true,
        interactionMode: InteractionMode.LIVE,
        autoplay: true,
        mixpanel: false
      }
    )

    this.component.render(this.component.config)
  }

  componentDidMount () {
    if (this.mount) {
      this.mountHaikuComponent()
    }
  }

  render () {
    return (
      <div
        id='haiku-glass-preview-wrapper'
        style={{
          position: 'relative',
          top: this.props.container.y,
          left: this.props.container.x,
          width: this.props.container.w,
          height: this.props.container.h
        }}>
        <div
          ref={(mount) => {
            this.mount = mount
          }}
          id='haiku-glass-preview-mount'
          style={{
            position: 'absolute',
            top: this.props.mount.y,
            left: this.props.mount.x,
            width: this.props.mount.w,
            height: this.props.mount.h,
            outline: '1px dotted #bbb',
            borderRadius: '2px'
          }} />
      </div>
    )
  }
}

Preview.propTypes = {
  component: React.PropTypes.object.isRequired,
  mount: React.PropTypes.object.isRequired,
  container: React.PropTypes.object.isRequired
}
