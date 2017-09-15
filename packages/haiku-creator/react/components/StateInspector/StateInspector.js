import React from 'react'
import Radium from 'radium'
import lodash from 'lodash'
import Color from 'color'
import StateRow from './StateRow'
import Palette from '../Palette'
// import { StackMenuSVG } from '../Icons'
// import { BTN_STYLES } from '../../styles/btnShared'

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
    height: 25,
    marginBottom: 8,
    padding: '18px 14px 10px',
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
    this.closeNewStateForm = this.closeNewStateForm.bind(this)
    this.state = {
      statesData: null,
      addingNew: false
    }
  }

  componentWillMount () {
    this.props.websocket.request({ method: 'readAllStateValues', params: [this.props.folder] }, (err, statesData) => {
      if (err) {
        return this.props.createNotice({
          title: 'Uh oh',
          type: 'error',
          message: 'There was a problem loading the states data for this project'
        })
      }
      this.setState({ statesData })
    })

    this.props.websocket.on('broadcast', (message) => {
      if (message.name === 'state:set') {
        // TODO: What?
        console.info('[creator] state set', message.params[1])
      }
    })
  }

  upsertStateValue (stateName, stateDescriptor, maybeCb) {
    console.info('[creator] inserting state', stateName, stateDescriptor)

    this.props.websocket.request({ type: 'action', method: 'upsertStateValue', params: [this.props.folder, stateName, stateDescriptor] }, (err) => {
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
    })

    this.props.tourChannel.next()
  }

  deleteStateValue (stateName, maybeCb) {
    console.info('[creator] deleting state', stateName)

    this.props.websocket.request({ type: 'action', method: 'deleteStateValue', params: [this.props.folder, stateName] }, (err) => {
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
    })
  }

  closeNewStateForm () {
    this.setState({addingNew: false})
  }

  render () {
    return (
      <div style={STYLES.container}>
        <div style={STYLES.sectionHeader}>
          State Inspector
          <button id='add-state-button' style={STYLES.button}
            onClick={() => this.setState({addingNew: true})}>
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
            })
            : <div>LOADING...</div>
          }
        </div>
      </div>
    )
  }
}

export default Radium(StateInspector)
