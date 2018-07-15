import * as React from 'react'
import Modal, { MODAL_STYLES } from '../Modal'

const DEFAULT_COMPONENT_NAME = 'untitled'
const INITIAL_INVALIDITY_REASON = 'Use only lowercase letters and numbers'

export default class CreateComponentModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      componentName: props.componentName || '',
      invalidityReason: INITIAL_INVALIDITY_REASON,
      isSubmitEnabled: false
    }
  }

  submitForm () {
    this.props.onSubmit(this.state.componentName)
  }

  cancelForm () {
    this.props.onCancel()
  }

  cleanComponentName (componentNameRaw) {
    return componentNameRaw
      .replace(/\W+/g, '') // Non-alphanumeric characters not allowed
      .replace(/_/g, '') // Underscores are considered alphanumeric (?); strip them
      .slice(0, 32) // Keep the overall name length short
      .toLowerCase() // Avoid confusion of fooBar vs foobar
  }

  invalidityCheck (componentName) {
    if (componentName.length < 1) {
      return INITIAL_INVALIDITY_REASON // No error when nothing has been entered yet
    }

    if (!isLetter(componentName[0])) {
      return 'Name must begin with a letter'
    }

    if (componentName.length < 3) {
      return 'Name must be at least 3 characters'
    }

    if (componentName.length > 32) {
      return 'Name must be fewer than 32 characters'
    }

    if (this.props.existingComponentNames[componentName]) {
      return `Component name "${componentName}" unavailable`
    }

    // `false` means there is no invalidity; the name is valid
    return false
  }

  render () {
    return (
      <Modal
        isOpen={this.props.isOpen}>
        <div
          style={MODAL_STYLES.wrapper}>
          <div style={MODAL_STYLES.title}>Name your component</div>
          <input
            type='text'
            autoFocus
            placeholder={DEFAULT_COMPONENT_NAME}
            value={this.state.componentName}
            style={MODAL_STYLES.input(this.state.isSubmitEnabled || this.state.componentName.length < 1)}
            onKeyUp={({nativeEvent}) => {
              if (nativeEvent.which === 13) { // enter
                if (this.state.isSubmitEnabled) {
                  this.submitForm()
                }
              }
            }}
            onChange={(changeEvent) => {
              const componentNameRaw = changeEvent.target.value
              const componentName = this.cleanComponentName(componentNameRaw)
              const invalidityReason = this.invalidityCheck(componentName)
              if (invalidityReason) {
                this.setState({
                  componentName,
                  invalidityReason,
                  isSubmitEnabled: false
                })
              } else {
                this.setState({
                  componentName,
                  invalidityReason,
                  isSubmitEnabled: true
                })
              }
            }} />
          <p style={MODAL_STYLES.feedback(this.state.componentName.length === 0)}>
            {this.state.invalidityReason || ''}
          </p>
          <div style={{minHeight: 30}}>
            <button
              disabled={!this.state.isSubmitEnabled}
              style={MODAL_STYLES.submit(this.state.isSubmitEnabled)}
              onClick={() => {
                if (this.state.isSubmitEnabled) {
                  this.submitForm()
                }
              }}>
              Create Component
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

const isLetter = (c) => {
  return c.toLowerCase() !== c.toUpperCase()
}

CreateComponentModal.propTypes = {
  existingComponentNames: React.PropTypes.object.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  isOpen: React.PropTypes.bool.isRequired
}
