import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import PrivatePublicToggle from './PrivatePublicToggle';
import * as Hai from '@haiku/taylor-hai/react';
import {DASH_STYLES} from '../styles/dashShared';
import {BTN_STYLES} from '../styles/btnShared';

const STYLES = {
  loadingScreen: {
    position: 'absolute',
    height: '450px',
    width: '100%',
    left: '0',
    top: '0',
    zIndex: '99999',
    backgroundColor: Palette.COAL,
  },
  title: {
    position: 'absolute',
    zIndex: '999999',
    bottom: 23,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
    color: Palette.SUNSTONE,
  },
};

class NewProjectModal extends React.PureComponent {
  constructor (props) {
    super(props);

    this.state = {
      newProjectIsPublic: true,
      newProjecterror: null,
      recordedNewProjectName: props.defaultProjectName || '',
    };
  }

  handleNewProjectToggleChange (newProjectIsPublic) {
    this.setState({newProjectIsPublic});
  }

  handleNewProjectInputChange (event) {
    const rawValue = event.target.value || '';

    const recordedNewProjectName = rawValue
      .replace(/\W+/g, '') // Non-alphanumeric characters not allowed
      .replace(/_/g, '') // Underscores are considered alphanumeric (?); strip them
      .slice(0, 32); // Keep the overall name length short

    this.setState({recordedNewProjectName});
  }

  handleNewProjectGo (duplicate = false) {
    if (this.state.newProjectError) {
      return false;
    }
    const rawNameValue = this.newProjectInput.value;
    if (!rawNameValue) {
      return false;
    }
    // HACK: strip all non-alphanumeric chars for now.  something more user-friendly would be ideal
    const name = rawNameValue && rawNameValue.replace(/[^a-z0-9]/gi, '');
    const isPublic = this.state.newProjectIsPublic;

    this.setState({isLoading: true});
    this.props.onCreateProject(name, isPublic, duplicate, (err) => {
      this.setState({isLoading: false});

      if (err) {
        return this.setState({newProjectError: err.message});
      }

      this.props.onClose();
    });
  }

  handleNewProjectInputKeyDown (e, duplicate = false) {
    if (e.keyCode === 13) {
      this.handleNewProjectGo(duplicate);
    } else if (e.keyCode === 27) {
      this.props.onClose(e);
    }
  }

  render () {
    const {duplicate, disabled} = this.props;

    return (
      <div style={DASH_STYLES.overlay}
        onClick={() => {
          this.props.onClose();
        }}
      >
        <div style={DASH_STYLES.modal} onClick={(e) => e.stopPropagation()}>
          {
            this.state.isLoading && (
              <div style={{height: 120}}>
                <div style={STYLES.loadingScreen}>
                  <Hai loop={true} sizing={'contain'} contextMenu={'disabled'} onHaikuComponentWillUnmount={(component) => {
                    component.context.destroy();
                  }} />
                </div>
                <div style={STYLES.title}>Initializing project...</div>
              </div>
            )
          }
          <div style={DASH_STYLES.modalTitle}>{duplicate ? 'Name Duplicated Project' : 'Project Setup'}</div>
          <div style={[DASH_STYLES.inputTitle, DASH_STYLES.upcase]}>Project Name</div>
          <input
            key="new-project-input"
            ref={(input) => {
              this.newProjectInput = input;
            }}
            disabled={disabled}
            onKeyDown={(e) => {
              this.handleNewProjectInputKeyDown(e, duplicate);
            }}
            style={[DASH_STYLES.newProjectInput]}
            value={this.state.recordedNewProjectName}
            onChange={(e) => {
              this.handleNewProjectInputChange(e);
            }}
            placeholder="NewProjectName"
            autoFocus={true} />
          <div style={{marginBottom: '30px'}}>
            <PrivatePublicToggle
              onChange={(isPublic) => {
                this.handleNewProjectToggleChange(isPublic);
              }}
              isPublic={this.state.newProjectIsPublic}
            />
          </div>
          <span key="new-project-error" style={DASH_STYLES.newProjectError}>{this.state.newProjectError}</span>
          <button key="new-project-go-button"
            disabled={disabled || !this.state.recordedNewProjectName || this.state.newProjectError}
            onClick={() => {
              this.handleNewProjectGo(duplicate);
            }}
            style={[
              BTN_STYLES.btnText,
              BTN_STYLES.rightBtns,
              BTN_STYLES.btnPrimary,
              DASH_STYLES.upcase,
              (!this.state.recordedNewProjectName || this.state.newProjectError) && BTN_STYLES.btnDisabled,
              {marginRight: 0},
            ]}>
            {duplicate ? 'Duplicate Project' : 'Name Project'}
          </button>
          <span style={[DASH_STYLES.upcase, BTN_STYLES.btnCancel, BTN_STYLES.rightBtns]}
            onClick={() => {
              this.props.onClose();
            }}
          >
            Cancel
          </span>
        </div>
      </div>
    );
  }
}

NewProjectModal.propTypes = {
  duplicate: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  onCancel: React.PropTypes.func,
  setProjectLaunchStatus: React.PropTypes.func,
};

export default Radium(NewProjectModal);
