import * as React from 'react';
import * as Radium from 'radium';
import {ModalWrapper, ModalFooter} from 'haiku-ui-common/lib/react/Modal';
import {BTN_STYLES} from '../../styles/btnShared';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  wrapper: {
    fontSize: 14,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: Palette.GRAY,
  },
  modalWrapper: {
    maxWidth: '400px',
    padding: 20,
    top: '50%',
    transform: 'translateY(-50%)',
  },
  modalBody: {
    minHeight: 90,
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
    fontSize: 15,
    textAlign: 'left',
    marginBottom: 7,
  },
};

class SaveContentsPopup extends React.Component {
  constructor (props) {
    super(props);
    this.saveEditorContentsToFile = this.saveEditorContentsToFile.bind(this);
    this.discardEditorContents = this.discardEditorContents.bind(this);
  }

  saveEditorContentsToFile () {
    this.props.saveCodeFromEditorToDisk();
    this.props.exitFromCodeEditorSavePopup();
  }

  discardEditorContents () {
    this.props.discardFromCodeEditor();
    this.props.exitFromCodeEditorSavePopup();
  }

  render () {
    return (
      <div style={STYLES.wrapper}>
        <ModalWrapper style={STYLES.modalWrapper}>
          <div style={STYLES.title}>Save your changes?</div>
          <div style={STYLES.modalBody}>
            Current opened file has unsaved changes. Do you want to save or discard changes?
          </div>
          <ModalFooter>
            <div style={[{display: 'inline-block'}]} >
              <button
                key="discard-code"
                id="discard-code"
                onClick={this.discardEditorContents}
                style={[
                  BTN_STYLES.btnText,
                  BTN_STYLES.centerBtns,
                  {
                    display: 'inline-block',
                    backgroundColor: 'transparent',
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
                  BTN_STYLES.btnPrimary,
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
