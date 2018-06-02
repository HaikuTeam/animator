import React from 'react'
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal'
import {BTN_STYLES} from '../../styles/btnShared'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  wrapper: {
    fontSize: '14px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY
  },
  modalWrapper: {
    maxWidth: '600px',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  modalBody: {
    padding: '20px'
  },
}


export default class SaveContentsPopup extends React.Component {
  constructor(props) {
    super(props)
    this.saveEditorContentsToFile = this.saveEditorContentsToFile.bind(this)
    this.closeSaveContentsPopupAndChangeComponent = this.closeSaveContentsPopupAndChangeComponent.bind(this)

  }

  saveEditorContentsToFile () {
    console.log('saveEditorContentsToFile')
    //this.refs.codeEditor.saveCodeFromEditorToDisk()
    this.props.saveCodeFromEditorToDisk()
    this.closeSaveContentsPopupAndChangeComponent()
  }

  closeSaveContentsPopupAndChangeComponent () {
    this.props.projectModel.setCurrentActiveComponent(this.props.targetComponentToChange,
                                                      {from: 'creator'}, () => {})
    this.props.setShowPopupToSaveRawEditorContents(false)
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Do you want to save modifications?</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
          Current opened file has unsaved modifications. Do you want to save or 
          discard modifications?     
          </div>
          <ModalFooter>

          <div style={[{display: 'inline-block'}]} >

          <button
            key='discard-code'
            id='discard-code'
            onClick={this.closeSaveContentsPopupAndChangeComponent}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.centerBtns,
              {
                display: 'inline-block',
                marginRight: '0px',
              }
            ]}
          >
            <span style={{marginLeft: 7, color: Palette.PINK}}>Discard</span>
          </button>

          <button
            key='save-code'
            id='save-code'
            onClick={this.saveEditorContentsToFile}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.centerBtns,
              {
                display: 'inline-block',
                marginRight: '0px'
              }
            ]}
          >
            <span style={{marginLeft: 7, color: Palette.PINK}}>Save</span>
          </button>
        </div>          
          </ModalFooter>
        </ModalWrapper>
      </div>
    )
  }
}