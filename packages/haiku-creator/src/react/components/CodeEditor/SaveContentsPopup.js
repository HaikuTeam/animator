import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalHeader, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  wrapper: {
    fontSize: '14px',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY,
  },
  modalWrapper: {
    maxWidth: '600px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
    padding: '20px',
  },
};

class SaveContentsPopup extends React.Component {
  constructor (props) {
    super(props);
    this.saveEditorContentsToFile = this.saveEditorContentsToFile.bind(this);
    this.closeSaveContentsPopupAndChangeComponent = this.closeSaveContentsPopupAndChangeComponent.bind(this);
  }

  saveEditorContentsToFile () {
    this.props.saveCodeFromEditorToDisk();
    this.closeSaveContentsPopupAndChangeComponent();
  }

  closeSaveContentsPopupAndChangeComponent () {
    this.props.projectModel.setCurrentActiveComponent(this.props.targetComponentToChange,
                                                      {from: 'creator'}, () => {});
    this.props.setShowPopupToSaveRawEditorContents(false);
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <ModalHeader>
            <h2>Do you want to save changes?</h2>
          </ModalHeader>
          <div style={STYLES.modalBody}>
            Current opened file has unsaved changes. Do you want to save or discard changes?
          </div>
          <br />
          <br />
          <br />
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="discard-code"
                id="discard-code"
                onClick={this.closeSaveContentsPopupAndChangeComponent}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>Discard</span>
              </button>

              <button
                key="save-code"
                id="save-code"
                onClick={this.saveEditorContentsToFile}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    marginRight: '10px',
                  },
                ]}
              >
                <span>Save</span>
              </button>
            </div>
          </ModalFooter>
        </ModalWrapper>
      </div>
    );
  }
}

export default Radium(SaveContentsPopup);
