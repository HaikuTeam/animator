import React from 'react'
import Modal, { MODAL_STYLES } from '../Modal'

export default class CreateGroupModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      groupName: props.groupName
    }
  }

  submitForm () {
    this.props.onSubmit(this.state.groupName)
  }

  cancelForm () {
    this.props.onCancel()
  }

  get groupNameIsAcceptable () {
    return this.state.groupName.length > 0
  }

  render () {
    return (
      <Modal isOpen>
        <div
          style={MODAL_STYLES.wrapper}>
          <p>Enter a name for your group:</p>
          <input
            type='text'
            autoFocus
            placeholder='Group name'
            value={this.state.groupName}
            style={MODAL_STYLES.input(this.groupNameIsAcceptable)}
            onKeyUp={({nativeEvent}) => {
              if (nativeEvent.which === 13) { // enter
                if (this.groupNameIsAcceptable) {
                  this.submitForm()
                }
              }
            }}
            onChange={(changeEvent) => {
              this.setState({
                groupName: changeEvent.target.value
              })
            }} />
          <p style={MODAL_STYLES.feedback(true)}>
            Warning: when you create a group, any existing animations will be removed and the layout will be reset to
            what you currently see. To preserve existing animations, create a component instead.
          </p>
          <div>
            <button
              disabled={!this.groupNameIsAcceptable}
              style={MODAL_STYLES.submit(this.groupNameIsAcceptable)}
              onClick={() => {
                if (this.groupNameIsAcceptable) {
                  this.submitForm()
                }
              }}
            >
              Create Group
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

CreateGroupModal.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  groupName: React.PropTypes.string.isRequired
}
