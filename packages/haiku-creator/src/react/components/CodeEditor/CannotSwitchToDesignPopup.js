import React from 'react'
import Radium from 'radium'
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
  }
}

class CannotSwitchToDesignPopup extends React.Component {
  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Cannot switch to Design</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            Cannot switch to design with unsaved changes. Save contents and try again.
          </div>
          <br />
          <br />
          <br />
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key='discard-code'
                id='discard-code'
                onClick={this.props.closePopupCannotSwitchToDesign}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    marginRight: '10px'
                  }
                ]}
              >
                <span>Close</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    )
  }
}

export default Radium(CannotSwitchToDesignPopup)
