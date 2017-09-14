import React from 'react'
import Tooltip from '../Tooltip'
import * as steps from './Steps'

class Tour extends React.Component {
  constructor () {
    super()

    this.state = {
      component: null,
      coordinates: null
    }
  }

  componentDidMount () {
    this.props.envoy.get('tour').then((tourChannel) => {
      this.tourChannel = tourChannel
      this.tourChannel.on('tour:requestShowStep', this.showStep)
      this.tourChannel.on('tour:requestFinish', this.hide)

      if (this.props.startTourOnMount) {
        this.tourChannel.start()
      }
    })

    this.mnt = true
  }

  componentWillUnmount () {
    this.mnt = false
  }

  next = () => {
    this.tourChannel.next()
  }

  finish = (createFile) => {
    this.tourChannel.finish(createFile)
  }

  hide = () => {
    if (this.mnt) {
      this.setState({ component: null })
    }
  }

  showStep = (state) => {
    // TODO: this is a bad practice, we should implement
    // a way to unbind events from a client in Envoy, then
    // remove this
    if (this.mnt) {
      this.setState(state)
    }
  }

  render () {
    if (!this.state.component) {
      return null
    }

    const { display, coordinates, component } = this.state
    const Step = steps[component]

    return (
      <Tooltip coordinates={coordinates} display={display}>
        <Step next={this.next} finish={this.finish} />
      </Tooltip>
    )
  }
}

export default Tour
