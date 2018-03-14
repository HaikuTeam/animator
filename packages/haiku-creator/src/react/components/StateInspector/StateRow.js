import React from 'react'
import Radium from 'radium'
import onClickOutside from 'react-onclickoutside'
import Color from 'color'
import State from 'haiku-serialization/src/bll/State'
import Palette from 'haiku-ui-common/lib/Palette'
import { StackMenuSVG } from 'haiku-ui-common/lib/react/OtherIcons'

const STYLES = {
  stateWrapper: {
    padding: 6,
    display: 'flex',
    alignItems: 'flex-start',
    ':hover': {
      backgroundColor: Color(Palette.GRAY).darken(0.1)
    }
  },
  col: {
    display: 'inline-block',
    width: '50%'
  },
  col1: {
    maxWidth: 145
  },
  col2: {
    position: 'relative'
  },
  stateMenu: {
    width: 10,
    position: 'absolute',
    right: -3,
    transform: 'scale(1.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    cursor: 'pointer',
    ':hover': {}
  },
  pill: {
    padding: '2px 5px',
    borderRadius: 3,
    maxHeight: 21,
    cursor: 'pointer'
  },
  pillName: {
    backgroundColor: Palette.BLUE,
    float: 'right',
    marginRight: 4,
    color: Palette.ROCK
  },
  pillValue: {
    backgroundColor: Color(Palette.GRAY).lighten(0.17),
    overflow: 'hidden',
    float: 'left',
    marginLeft: 4,
    maxWidth: 'calc(100% - 12px)',
    minHeight: 22
  },
  input: {
    backgroundColor: Palette.COAL,
    padding: '4px 5px 3px',
    WebkitUserSelect: 'auto',
    cursor: 'text',
    color: Palette.ROCK,
    width: 'calc(100% - 4px)',
    minHeight: 22,
    fontSize: 12,
    fontFamily: 'Fira Sans',
    border: '1px solid transparent',
    ':focus': {
      border: '1px solid ' + Palette.LIGHTEST_PINK
    }
  },
  input2: {
    width: 'calc(100% - 8px)',
    marginLeft: 4
  }
}

function isBlank (str) {
  return /^\s*$/.test(str)
}

class StateRow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isEditing: false,
      isHovered: false,
      name: null,
      desc: null,
      valuePreEdit: null,
      didEscape: false
    }
  }

  componentDidMount () {
    this.setState({
      originalName: this.props.stateName,
      name: this.props.stateName,
      desc: this.props.stateDescriptor,
      valuePreEdit: this.props.stateDescriptor.value
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      originalName: nextProps.stateName,
      name: nextProps.stateName,
      desc: nextProps.stateDescriptor,
      valuePreEdit: nextProps.stateDescriptor.value
    })
  }

  handleTabSwitch (event, side) {
    if (event.keyCode === 9) {
      event.preventDefault()

      if (side === 'name') {
        this.valueInput.focus()
      }

      if (side === 'value') {
        this.nameInput.focus()
      }
    }
  }

  handleChange (event, side) {
    if (event.keyCode === 27) { // esc key
      return this.setState({isEditing: false, didEscape: true})
    }

    let desc = this.state.desc

    // Only update the inputs in the UI if the user didn't press Return
    // Here we're only updating the view state, we haven't committed anything yet
    if (event.key !== 'Enter') {
      if (side === 'name') {
        let trimmedName = event.target.value.trim()
        this.setState({ name: trimmedName })
      } else { // Update the value
        desc.value = event.target.value.trim()
        this.setState({desc})
      }
      return
    }

    // If we got here, Enter was pressed, meaning we want to commit the state value/name
    desc = State.autoCastToType(desc)

    // If the name field is blank, delete the state (or just remove it if it is new)
    if (isBlank(this.state.name)) {
      if (this.props.isNew) {
        return this.props.closeNewStateForm()
      } else {
        return this.props.deleteStateValue(this.state.originalName, () => {
          return this.setState({isEditing: false})
        })
      }
    }

    // If made it this far, at least one of the fields is NOT blank, and we can attempt a submit
    if (isBlank(desc.value) || isBlank(this.state.name)) {
      if (isBlank(this.state.name)) {
        return this.props.createNotice({
          type: 'warning',
          title: 'Sorry',
          message: 'State names cannot be blank'
        })
      }

      // For now, only support US ASCII chars that would be valid as a JavaScript identifier
      if (!/^[$A-Z_][0-9A-Z_$]*$/i.test(this.state.name)) {
        return this.props.createNotice({
          type: 'warning',
          title: 'Sorry',
          message: 'State names cannot have spaces or special characters, and must begin with a letter'
        })
      }

      if (isBlank(desc.value)) {
        // TODO: Not sure if we want to set this as null or not
      }

      this.setState({desc, name: this.state.name}, () => {
        this.submitChanges()
        if (this.props.isNew) this.props.closeNewStateForm()
        return this.setState({isEditing: false})
      })
    } else { // neither were blank
      this.setState({desc, name: this.state.name}, () => {
        this.submitChanges()
        if (this.props.isNew) this.props.closeNewStateForm()
        this.setState({isEditing: false})
      })
    }
  }

  submitChanges () {
    const didValueChange = this.state.desc.value !== this.state.valuePreEdit
    const didNameChange = this.state.name !== this.props.stateName

    if (didNameChange && didValueChange) {
      return this.props.deleteStateValue(this.props.stateName, () => {
        return this.props.upsertStateValue(this.state.name, this.state.desc, () => {
          this.setState({ isEditing: false })
        })
      })
    } else if (didNameChange) {
      return this.props.deleteStateValue(this.props.stateName, () => {
        return this.props.upsertStateValue(this.state.name, this.state.desc, () => {
          this.setState({ isEditing: false })
        })
      })
    } else if (didValueChange) {
      return this.props.upsertStateValue(this.state.name, this.state.desc, () => {
        this.setState({ isEditing: false })
      })
    }
  }

  handleClickOutside () {
    if (this.props.isNew) return this.props.closeNewStateForm()
    this.submitChanges()
  }

  getEditableStateValue () {
    if (this.state.desc) {
      return State.autoStringify(this.state.desc)
    } else if (this.props.stateDescriptor) {
      return State.autoStringify(this.props.stateDescriptor)
    } else {
      return ''
    }
  }

  getDisplayableStateValue () {
    if (this.state.valuePreEdit) {
      return State.autoStringify({ value: this.state.valuePreEdit })
    } else if (this.props.stateDescriptor) {
      return State.autoStringify(this.props.stateDescriptor)
    } else {
      return ''
    }
  }

  isValidColor (color) {
    const dummyElement = document.createElement('span')
    dummyElement.style.backgroundColor = color

    return dummyElement.style.backgroundColor !== ''
  }

  generateColorCap () {
    const maybeColor = this.getDisplayableStateValue()

    if (this.isValidColor(maybeColor)) {
      return {
        borderRightWidth: 4,
        borderRightColor: maybeColor,
        borderRightStyle: 'solid'
      }
    }
  }

  render () {
    return (
      <form key={`${this.props.stateName}-state`}
        onMouseOver={() => this.setState({isHovered: true})}
        onMouseOut={() => this.setState({isHovered: false})}
        onDoubleClick={() => this.setState({isEditing: true, didEscape: false})}>
        {!this.state.isEditing && !this.props.isNew
          ? <div style={STYLES.stateWrapper}>
            <div style={[STYLES.col, STYLES.col1]}>
              <span key={`${this.props.stateName}-name`}
                style={[STYLES.pill, STYLES.pillName]}>
                {this.props.stateName}
              </span>
            </div>
            <div style={[STYLES.col, STYLES.col2]}>
              <span key={`${this.props.stateName}-value`}
                style={[STYLES.pill, STYLES.pillValue, this.generateColorCap()]}>
                {this.getDisplayableStateValue()}
              </span>
              <span key={`${this.props.stateName}-menu`}
                style={[
                  STYLES.stateMenu,
                  (!this.state.isHovered || true) && {display: 'none'} // TODO: remove this '|| true' to show stack menu on hover and create popover
                ]}>
                <StackMenuSVG color={Radium.getState(this.state, `${this.props.stateName}-menu`, ':hover') ? Palette.ROCK : Palette.ROCK_MUTED} />
              </span>
            </div>
          </div>
          : <div style={STYLES.stateWrapper}>
            <div style={[STYLES.col, STYLES.col2]}>
              <input key={`${this.props.stateName}-name`}
                ref={(nameInput) => { this.nameInput = nameInput }}
                style={[STYLES.pill, STYLES.input]}
                defaultValue={this.props.stateName}
                placeholder='STATE NAME'
                onKeyUp={(event) => this.handleChange(event, 'name')}
                onKeyDown={(event) => this.handleTabSwitch(event, 'name')}
                autoFocus />
            </div>
            <div style={[STYLES.col, STYLES.col2]}>
              <input key={`${this.props.stateName}-value`}
                ref={(valueInput) => { this.valueInput = valueInput }}
                style={[STYLES.pill, STYLES.input, STYLES.input2]}
                defaultValue={this.getEditableStateValue()}
                placeholder='STATE VALUE'
                onKeyUp={(event) => this.handleChange(event, 'value')}
                onKeyDown={(event) => this.handleTabSwitch(event, 'value')} />
              <span key={`${this.props.stateName}-menu`}
                style={[
                  STYLES.stateMenu,
                  !Radium.getState(this.state, `${this.props.stateName}-state`, ':hover') && {display: 'none'}
                ]}>
                <StackMenuSVG color={Radium.getState(this.state, `${this.props.stateName}-menu`, ':hover') ? Palette.ROCK : Palette.ROCK_MUTED} />
              </span>
            </div>
          </div>
        }
      </form>
    )
  }
}

export default onClickOutside(Radium(StateRow))
