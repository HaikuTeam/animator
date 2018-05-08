import React from 'react'
import Modal, { MODAL_STYLES } from '../Modal'

export default class UngroupModal extends React.Component {
  constructor (props) {
    super(props)
    this.handleKeyup = this.handleKeyup.bind(this)
  }

  handleKeyup (e) {
    e.preventDefault()
    e.stopPropagation()
    switch (e.which) {
      case 13:
        // enter
        this.submitForm()
        break
      case 27:
        // esc
        this.cancelForm()
        break
      default:
        // ...
    }
  }

  componentDidMount () {
    window.addEventListener('keyup', this.handleKeyup)
  }

  componentWillUnmount () {
    window.removeEventListener('keyup', this.handleKeyup)
  }

  submitForm () {
    this.props.onSubmit()
  }

  cancelForm () {
    this.props.onCancel()
  }

  render () {
    return (
      <Modal isOpen>
        <div style={MODAL_STYLES.wrapper}>
          <p style={MODAL_STYLES.feedback(true)}>
            Warning: when you ungroup, any existing animations will be removed and individual element layout will be
            reset to what you currently see.
          </p>
          <div>
            <button
              style={MODAL_STYLES.submit(true)}
              onClick={() => {
                this.submitForm()
              }}
            >
              Ungroup
            </button>
            <button
              style={MODAL_STYLES.cancel}
              onClick={() => {
                this.cancelForm()
              }}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    )
  }
}

UngroupModal.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired
}
