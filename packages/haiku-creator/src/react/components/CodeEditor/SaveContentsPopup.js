import React from 'react'
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal'
import {BTN_STYLES} from '../styles/btnShared'


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
  listItem: {
    marginBottom: '8px'
  }
}


export default class Stage extends React.Component {
  constructor(props) {
    super(props)

  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Do you want to save the file?</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
          Do you want to save the file or discard every change?     

          </div>
          <ModalFooter>

          <div style={[{display: 'inline-block'}]} >
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
                backgroundColor: Palette.FATHER_COAL
              }
            ]}
          >
            <span style={{marginLeft: 7, color: Palette.PINK}}>Discard</span>
          </button>
        </div>          
          </ModalFooter>
        </ModalWrapper>
      </div>
    )
  }
}