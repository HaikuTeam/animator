/**
 * @file Work based on https://github.com/superRaytin/react-monaco-editor/blob/master/src/editor.js
 */

 /* global monaco:true */

import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'

// monaco is on global namespace as it uses vscode loader scheme
// import * as monaco from 'monaco-editor';

class MonacoEditor extends React.Component {
  constructor (props) {
    super(props)
    this.containerElement = undefined
    this.__current_value = props.value
    this.onUpdateDimensions = this.updateDimensions.bind(this)
    this.assignRef = this.assignRef.bind(this)
    this.state = {}
  }

  componentDidMount () {
    this.initMonaco()
    window.addEventListener('resize', this.onUpdateDimensions)
  }

  componentDidUpdate (prevProps) {
    if (this.props.value !== this.__current_value) {
      // Always refer to the latest value
      this.__current_value = this.props.value
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true
        this.editor.setValue(this.__current_value)
        this.__prevent_trigger_change_event = false
      }
    }
    if (prevProps.language !== this.props.language) {
      monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language)
    }
    if (prevProps.theme !== this.props.theme) {
      monaco.editor.setTheme(this.props.theme)
    }
    if (
      this.editor &&
      (this.props.width !== prevProps.width || this.props.height !== prevProps.height)
    ) {
      this.editor.layout()
    }
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onUpdateDimensions)
    this.destroyMonaco()
  }

  editorWillMount () {
    const { editorWillMount } = this.props
    editorWillMount(monaco)
  }

  editorDidMount (editor) {
    this.props.editorDidMount(editor, monaco)
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue()

      // Always refer to the latest value
      this.__current_value = value

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        this.props.onChange(value, event)
      }
    })
  }

  initMonaco () {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue
    const { language, theme, options } = this.props

    monaco.editor.defineTheme('haiku', {
      base: 'vs-dark',
      inherit: true,
      // `rules` requires colors without the leading '#' ¯\_(ツ)_/¯
      rules: [{ backgroundColor: Palette.SPECIAL_COAL.replace('#', '') }],
      colors: {
        'editor.foreground': Palette.PALE_GRAY,
        'editor.background': Palette.DARKEST_COAL,
        'editorCursor.foreground': Palette.LIGHTEST_PINK,
        'list.focusBackground': Palette.BLACK,
        focusBorder: Palette.BLACK,
        'editorWidget.background': Palette.DARKEST_COAL,
        'editor.lineHighlightBorder': Palette.DARKEST_COAL
      }
    })

    if (this.containerElement) {
      // Before initializing monaco editor
      this.editorWillMount()
      this.editor = monaco.editor.create(this.containerElement, {
        value,
        language,
        ...options
      })
      if (theme) {
        monaco.editor.setTheme(theme)
      }
      // After initializing monaco editor
      this.editorDidMount(this.editor)
    }
  }

  /**
   * Update monaco editor dimensions
   */
  updateDimensions () {
    console.log('Update dimensions')
    this.editor.layout()
  }

  destroyMonaco () {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose()
    }
  }

  assignRef (component) {
    this.containerElement = component
  };

  render () {
    return <div ref={this.assignRef} style={this.props.style} className='react-monaco-editor-container' />
  }
}

MonacoEditor.propTypes = {
  value: React.PropTypes.string,
  defaultValue: React.PropTypes.string,
  language: React.PropTypes.string,
  theme: React.PropTypes.string,
  options: React.PropTypes.object,
  style: React.PropTypes.object,
  editorDidMount: React.PropTypes.func,
  editorWillMount: React.PropTypes.func,
  onChange: React.PropTypes.func
}

function noop () {}

MonacoEditor.defaultProps = {
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: 'haiku',
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop
}

export default Radium(MonacoEditor)
