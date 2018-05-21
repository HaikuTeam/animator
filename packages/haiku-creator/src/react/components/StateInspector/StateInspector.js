import React from 'react'
import Radium from 'radium'
import lodash from 'lodash'
import Color from 'color'
import StateRow from './StateRow'
import Loader from './Loader'
import Palette from 'haiku-ui-common/lib/Palette'

const STYLES = {
  container: {
    position: 'relative',
    backgroundColor: Palette.GRAY,
    WebkitUserSelect: 'none',
    height: '100%'
  },
  statesContainer: {
    overflow: 'auto',
    height: 'calc(100% - 50px)'
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
    justifyContent: 'space-between'
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
      backgroundColor: Color(Palette.DARKER_GRAY).darken(0.2)
    },
    ':active': {
      transform: 'scale(.8)'
    }
  },
  emptyMessage: {
    lineHeight: '16px',
    color: Palette.DARKER_ROCK2,
    padding: '0 14px'
  }
}

class StateInspector extends React.Component {
  constructor (props) {
    super(props)
    this.upsertStateValue = this.upsertStateValue.bind(this)
    this.deleteStateValue = this.deleteStateValue.bind(this)
    this.openNewStateForm = this.openNewStateForm.bind(this)
    this.closeNewStateForm = this.closeNewStateForm.bind(this)
    this.isPopulatingStateData = false
    this.state = {
      sceneName: 'State Inspector',
      statesData: null,
      addingNew: false
    }
  }

  populateStatesData () {
    this.isPopulatingStateData = true

    this.props.projectModel.readAllStateValues(
      (err, statesData) => {
        this.isPopulatingStateData = false

        if (err) {
          // Don't rapidly re-request state 1000s of times if we got an error
          return this.setState({
            statesData: {},
            sceneName: this.getActiveSceneName(this.props)
          }, () => {
            this.props.createNotice({
              title: 'Uh oh',
              type: 'error',
              message: 'There was a problem loading the states data for this project'
            })
          })
        }

        this.setState({
          sceneName: this.getActiveSceneName(this.props),
          statesData
        })
      }
    )
  }

  getActiveSceneName (props) {
    return (
      props.projectModel &&
      props.projectModel.getCurrentActiveComponent() &&
      props.projectModel.getCurrentActiveComponent().getSceneName()
    )
  }

  componentWillReceiveProps (nextProps) {
    if (
      (nextProps.visible && !this.state.statesData) || // If we haven't populated yet
      this.state.sceneName !== this.getActiveSceneName(nextProps) // If we have context-switched
    ) {
      if (!this.isPopulatingStateData) {
        this.populateStatesData()
      }
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
            message: 'There was a problem editing that state value'
          })
        }

        const statesData = this.state.statesData
        statesData[stateName] = stateDescriptor
        this.setState({
          sceneName: this.getActiveSceneName(this.props),
          statesData
        })

        if (maybeCb) {
          return maybeCb()
        }
      }
    )
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
            message: 'There was a problem deleting that state value'
          })
        }

        const statesData = this.state.statesData
        delete statesData[stateName]
        this.setState({
          sceneName: this.getActiveSceneName(this.props),
          statesData
        })

        if (maybeCb) {
          return maybeCb()
        }
      }
    )
  }

  openNewStateForm () {
    if (!this.state.addingNew) {
      this.setState({addingNew: true})
    }
  }

  closeNewStateForm () {
    this.setState({addingNew: false})
  }

  getHeadingText () {
    return `State Inspector (${this.state.sceneName})`
  }

  shouldDisplayEmptyMessage () {
    return (
      this.state.statesData &&
      Object.keys(this.state.statesData).length === 0 &&
      !this.state.addingNew
    )
  }

  render () {
    return (
      <div style={{
        ...STYLES.container,
        display: this.props.visible ? 'initial' : 'none'
      }}>
        <div style={STYLES.sectionHeader}>
          {this.getHeadingText()}
          <button id='add-state-button' style={STYLES.button}
            onClick={this.openNewStateForm}>
            +
          </button>
        </div>
        <div style={STYLES.statesContainer}>
          {this.state.addingNew &&
            <StateRow
              key={`new-row`}
              stateDescriptor={{value: ''}}
              stateName={''}
              isNew
              createNotice={this.props.createNotice}
              removeNotice={this.props.removeNotice}
              closeNewStateForm={this.closeNewStateForm}
              upsertStateValue={this.upsertStateValue}
              deleteStateValue={this.deleteStateValue} />
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
                  deleteStateValue={this.deleteStateValue} />
              )
            }).reverse()
            : <Loader />
          }
          {this.shouldDisplayEmptyMessage() &&
            <p style={STYLES.emptyMessage}>
              You have no states yet! Click on the plus sign above to add one.<br /><br />
              States can be referenced by name in property input fields
            </p>
          }
        </div>
      </div>
    )
  }
}

export default Radium(StateInspector)
