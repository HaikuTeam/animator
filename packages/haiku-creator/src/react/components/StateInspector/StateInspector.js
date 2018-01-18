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
  }
}

class StateInspector extends React.Component {
  constructor (props) {
    super(props)
    this.upsertStateValue = this.upsertStateValue.bind(this)
    this.deleteStateValue = this.deleteStateValue.bind(this)
    this.openNewStateForm = this.openNewStateForm.bind(this)
    this.closeNewStateForm = this.closeNewStateForm.bind(this)
    this.state = {
      statesData: null,
      addingNew: false
    }
  }

  componentDidMount () {
    this.props.projectModel.readAllStateValues(
      (err, statesData) => {
        if (err) {
          return this.props.createNotice({
            title: 'Uh oh',
            type: 'error',
            message: 'There was a problem loading the states data for this project'
          })
        }
        this.setState({ statesData })
      }
    )
  }

  upsertStateValue (stateName, stateDescriptor, maybeCb) {
    this.props.projectModel.upsertStateValue(
      stateName,
      stateDescriptor,
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
        this.setState({statesData})

        if (maybeCb) {
          return maybeCb()
        }
      }
    )
  }

  deleteStateValue (stateName, maybeCb) {
    return this.props.projectModel.deleteStateValue(
      stateName,
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
        this.setState({statesData})

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
    if (!this.props.projectModel) return 'State Inspector'
    if (!this.props.projectModel.getCurrentActiveComponent()) return 'State Inspector'
    return `State Inspector (${this.props.projectModel.getCurrentActiveComponent().getSceneName()})`
  }

  render () {
    return (
      <div style={STYLES.container}>
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
              allStatesData={this.state.statesData}
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
                  allStatesData={this.state.statesData}
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
        </div>
      </div>
    )
  }
}

export default Radium(StateInspector)
