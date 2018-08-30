import * as React from 'react';
import * as Radium from 'radium';
import * as lodash from 'lodash';
import * as Color from 'color';
import StateRow from './StateRow';
import Loader from './Loader';
import Palette from 'haiku-ui-common/lib/Palette';

const NEW_ROW_NAME = `new-row`;

const STYLES = {
  container: {
    position: 'relative',
    backgroundColor: Palette.GRAY,
    WebkitUserSelect: 'none',
    height: '100%',
  },
  statesContainer: {
    overflow: 'auto',
    height: 'calc(100% - 50px)',
  },
  sectionHeader: {
    cursor: 'default',
    // height: 25, // If you enable this, note that component names can be long; header may take multiple lines
    marginBottom: 8,
    padding: '12px 14px 0px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    fontSize: 15,
    justifyContent: 'space-between',
  },
  button: {
    padding: '3px 9px',
    backgroundColor: Palette.DARKER_GRAY,
    color: Palette.ROCK,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: -4,
    borderRadius: 3,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease',
    ':hover': {
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2),
    },
    ':active': {
      transform: 'scale(.8)',
    },
  },
  emptyMessage: {
    lineHeight: '16px',
    color: Palette.DARKER_ROCK2,
    padding: '0 14px',
  },
  howToDeleteMessage: {
    lineHeight: '16px',
    color: Palette.DARKER_ROCK2,
    padding: '0 14px',
  },
};

class StateInspector extends React.Component {
  constructor (props) {
    super(props);
    this.upsertStateValue = this.upsertStateValue.bind(this);
    this.deleteStateValue = this.deleteStateValue.bind(this);
    this.openNewStateForm = this.openNewStateForm.bind(this);
    this.closeNewStateForm = this.closeNewStateForm.bind(this);
    this.onProjectModelUpdate = this.onProjectModelUpdate.bind(this);

    this.state = {
      sceneName: 'State Inspector',
      statesData: null,
      editingStateName: null,
    };
  }

  loadStatesDataFromActiveComponent () {
    const activeComponent = this.props.projectModel.getCurrentActiveComponent();

    if (!activeComponent) {
      return;
    }

    activeComponent.readAllStateValues(null,
      (err, statesData) => {
        if (err) {
          // Don't rapidly re-request state 1000s of times if we got an error
          return this.setState({
            statesData: {},
            sceneName: activeComponent.getSceneName(),
          }, () => {
            this.props.createNotice({
              title: 'Uh oh',
              type: 'error',
              message: 'There was a problem loading the states data for this project',
            });
          });
        }

        /* To avoid unnecessary component repaint, only setState if states are different */
        if (!lodash.isEqual(this.state.statesData, statesData) || this.state.statesData !== activeComponent.getSceneName()) {
          this.setState({
            statesData,
            sceneName: activeComponent.getSceneName(),
          });
        }
      },
    );
  }

  getActiveSceneName (props) {
    return (
      props.projectModel &&
      props.projectModel.getCurrentActiveComponent() &&
      props.projectModel.getCurrentActiveComponent().getSceneName()
    );
  }

  onProjectModelUpdate (what, ...args) {
    // We only reload states on a hard reload (eg when a component is loaded from disk)
    // Editing states on state inspector only triggers soft reload
    if (
      what === 'setCurrentActiveComponent' ||
      (what === 'reloaded' && args[0] === 'hard')
    ) {
      this.loadStatesDataFromActiveComponent();
    }
  }

  componentDidMount () {
    if (this.props.projectModel) {
      this.props.projectModel.on('update', this.onProjectModelUpdate);
      this.props.projectModel.on('remote-update', this.onProjectModelUpdate);
    }
  }

  componentWillUnmount () {
    if (this.props.projectModel) {
      this.props.projectModel.removeListener('update', this.onProjectModelUpdate);
      this.props.projectModel.removeListener('remote-update', this.onProjectModelUpdate);
    }
  }

  upsertStateValue (stateName, stateDescriptor, maybeCb) {
    this.props.projectModel.getCurrentActiveComponent().upsertStateValue(
      stateName,
      stateDescriptor,
      {from: 'creator'},
      (err) => {
        if (err) {
          return this.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem editing that state value',
          });
        }

        const statesData = this.state.statesData;
        statesData[stateName] = stateDescriptor;
        this.setState({
          sceneName: this.getActiveSceneName(this.props),
          statesData,
        });

        if (maybeCb) {
          return maybeCb();
        }
      },
    );
  }

  deleteStateValue (stateName, maybeCb) {
    return this.props.projectModel.getCurrentActiveComponent().deleteStateValue(
      stateName,
      {from: 'creator'},
      (err) => {
        if (err) {
          return this.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem deleting that state value',
          });
        }

        const statesData = this.state.statesData;
        delete statesData[stateName];
        this.setState({
          sceneName: this.getActiveSceneName(this.props),
          statesData,
        });

        if (maybeCb) {
          return maybeCb();
        }
      },
    );
  }

  openNewStateForm () {
    this.setState({editingStateName: NEW_ROW_NAME});
  }

  closeNewStateForm () {
    this.setState({editingStateName: null});
  }

  getHeadingText () {
    return `States (${this.state.sceneName})`;
  }

  shouldDisplayEmptyMessage () {
    return (
      this.state.statesData &&
      Object.keys(this.state.statesData).length === 0 &&
      !this.state.editingStateName
    );
  }

  requestEditValue (stateName) {
    this.setState({editingStateName: stateName});
  }

  requestBlurValue (stateName) {
    if (stateName === this.state.editingStateName) {
      this.setState({editingStateName: null});
    }
  }

  render () {
    return (
      <div style={{
        ...STYLES.container,
        display: this.props.visible ? 'initial' : 'none',
      }}>
        <div style={STYLES.sectionHeader}>
          {this.getHeadingText()}
          <button
            id="add-state-button"
            style={STYLES.button}
            title="Add state"
            onClick={this.openNewStateForm}>
            +
          </button>
        </div>
        <div style={STYLES.statesContainer}>
          {this.state.editingStateName === NEW_ROW_NAME &&
            <StateRow
              key={NEW_ROW_NAME}
              stateDescriptor={{value: ''}}
              stateName={''}
              isNew={true}
              createNotice={this.props.createNotice}
              removeNotice={this.props.removeNotice}
              closeNewStateForm={this.closeNewStateForm}
              upsertStateValue={this.upsertStateValue}
              deleteStateValue={this.deleteStateValue}
              requestBlur={this.requestBlurValue.bind(this, NEW_ROW_NAME)}
              isEditing={true} />
          }
          {this.state.statesData
            ? lodash.map(this.state.statesData, (stateDescriptor, stateName) => {
              return (
                <StateRow
                  key={`${stateName}-row`}
                  stateDescriptor={stateDescriptor}
                  stateName={stateName}
                  createNotice={this.props.createNotice}
                  removeNotice={this.props.removeNotice}
                  upsertStateValue={this.upsertStateValue}
                  deleteStateValue={this.deleteStateValue}
                  isEditing={this.state.editingStateName === stateName}
                  requestEdit={this.requestEditValue.bind(this, stateName)}
                  requestBlur={this.requestBlurValue.bind(this, stateName)} />
              );
            }).reverse()
            : <Loader />
          }
          {this.shouldDisplayEmptyMessage() &&
            <p style={STYLES.emptyMessage}>
              Click the + button to add a state.
            </p>
          }
          <p style={STYLES.howToDeleteMessage}>
            To delete a state, delete its name and press Enter.
          </p>
        </div>
      </div>
    );
  }
}

export default Radium(StateInspector);
