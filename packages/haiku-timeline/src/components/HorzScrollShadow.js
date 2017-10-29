import React from 'react'

export default class HorzScrollShadow extends React.Component {
  constructor (props) {
    super(props)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentWillUnmount () {
    this.mounted = false
    this.props.timeline.removeListener('update', this.handleUpdate)
  }

  componentDidMount () {
    this.mounted = true
    this.props.timeline.on('update', this.handleUpdate)
  }

  handleUpdate (what) {
    if (!this.mounted) return null
    if (what === 'timeline-frame-range') this.forceUpdate()
  }

  render () {
    const frameInfo = this.props.timeline.getFrameInfo()

    if (frameInfo.scA < 1) {
      return <span></span>
    }

    return (
      <span className='no-select' style={{
        position: 'absolute',
        height: '100%',
        width: 3,
        left: 297,
        zIndex: 2003,
        top: 0,
        boxShadow: '3px 0 6px 0 rgba(0,0,0,.22)'
      }}></span>
    )
  }
}

HorzScrollShadow.propTypes = {
  timeline: React.PropTypes.object.isRequired,
}
