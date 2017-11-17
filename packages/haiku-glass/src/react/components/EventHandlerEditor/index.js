import React from 'react'
import functionToRFO from '@haiku/player/lib/reflection/functionToRFO'
import ElementTitle from './ElementTitle'
import EventSelector from './EventSelector'
import CSSStyles from './CSSStyles'
import Editor from './Editor'
import EditorActions from './EditorActions'
import Palette from '../../Palette'
import {EVALUATOR_STATES, EDITOR_WIDTH, EDITOR_HEIGHT} from './constants'

const STYLES = {
  container: {
    width: EDITOR_WIDTH,
    height: EDITOR_HEIGHT,
    backgroundColor: Palette.COAL,
    borderRadius: '4px',
    padding: '20px',
    zIndex: 9001
  }
}

class EventHandlerEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      selectedEventName: 'click', // Seems a good default event to work with
      customEventOptions: [], // Allow user to type in a custom event name
      evaluator: {
        text: null,
        state: EVALUATOR_STATES.NONE
      }
    }
  }

  setEvaluator (evaluator) {
    this.setState({evaluator: evaluator})
  }

  isCommittableValueInvalid(committable, original) {
    // If we have any error/warning in the evaluator, assume it as grounds not to commit
    // the current content of the field. Basically leveraging pre-validation we've already done.
    if (this.state.evaluator.state > EVALUATOR_STATES.INFO) {
      return {
        reason: this.state.evaluator.text
      }
    }

    return false
  }

  getCommitableValue(valueDescriptor) {
    // Note that extra/cached fields are stripped off of the function, like '.summary'
    return {
      __function: {
        params: valueDescriptor.params,
        body: valueDescriptor.body
      }
    }
  }

  doSave() {
    let original = this.codemirror.getValue()
    let committable = this.getCommitableValue(this.state.editedValue)
    let invalid = this.isCommittableValueInvalid(committable, original)

    // If invalid, don't proceed - keep the input in a focused+selected state,
    // and then show an error message in the evaluator tooltip
    if (invalid) {
      return this.setState({
        evaluator: {
          state: EVALUATOR_STATES.ERROR,
          text: invalid.reason
        }
      })
    }

    this.setState(
      {
        originalValue: this.state.editedValue
      },
      () => {
        this.props.save(
          this.props.element,
          this.state.selectedEventName,
          {handler: committable} // The committable is serialized, i.e. __function: {...}
        )

        this.props.element.setEventHandlerSaveStatus(
          this.state.selectedEventName,
          true
        )
        this.forceUpdate()
        this.props.close()
      }
    )
  }

  doCancel() {
    // #TODO: What else?
    this.props.close()
  }

  willHandleExternalKeydownEvent(keydownEvent) {
    if (keydownEvent._alreadyHandled) {
      return true
    }

    if (this.props.element) {
      // <~ Possibly not needed, but this is a check to whether we're live or not
      // When focused, assume we *always* handle keyboard events, no exceptions.
      // If you want to handle an input when focused, used handleEditorKeydown
      return true
    }

    return false
  }

  fetchEventHandlerValueDescriptor(eventName) {
    let extant =
      this.props.element && this.props.element.getReifiedEventHandler(eventName)

    let found
    if (extant && extant.handler) {
      // The player wraps 'handler' to make sure binding is correct, but we want the original
      // function itself so we can actually access its body and parameters, etc.
      var original = extant.original || extant.handler
      found = functionToRFO(original).__function
    } else {
      found = {
        params: ['event'],
        body: '// "' + eventName + '" event logic goes here'
      }
    }

    return found
  }

  handleChangedEventName({value}) {
    if (value) {
      var existingHandler = this.fetchEventHandlerValueDescriptor(value)

      if (this.props.element) {
        this.storeEditedValue(value, existingHandler)
      }
      this.setState(
        {
          evaluator: {
            state: EVALUATOR_STATES.OPEN,
            text: null
          },
          selectedEventName: value,
          originalValue: existingHandler,
          editedValue: existingHandler
        }
      )
    }
  }

  render() {
    return (
      <div
        className="Absolute-Center"
        onMouseDown={mouseEvent => {
          // Prevent outer view from closing us
          mouseEvent.stopPropagation()
        }}
        style={STYLES.container}
      >
        <style>{CSSStyles}</style>

        <ElementTitle element={this.props.element} />

        <EventSelector
          element={this.props.element}
          selectedEventName={this.state.selectedEventName}
          onEventChange={(eventChange) => {
            this.handleChangedEventName(eventChange)
          }}
        />

        <Editor
          element={this.props.element}
          evaluator={this.state.evaluator}
          onEvaluatorChange={(evaluator) => { this.setEvaluator(evaluator) }}
          onEventChange={(eventChange) => {
            this.handleChangedEventName(eventChange)
          }}
        />

        <EditorActions
          onCancel={() => {
            this.doCancel()
          }}
          onSave={() => {
            this.doSave()
          }}
        />
      </div>
    )
  }
}

export default EventHandlerEditor
