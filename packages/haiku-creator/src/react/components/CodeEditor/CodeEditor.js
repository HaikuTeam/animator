/**
 * @file Work based on https://github.com/superRaytin/react-monaco-editor/blob/master/src/editor.js
 */

import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import {BTN_STYLES} from '../../styles/btnShared'
import MonacoEditor from './MonacoEditor'

class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentComponentCode: '',
      currentEditorContents: '',
    }
  }

  componentWillMount () {
    console.log('componentWillMount')
    if (this.props.projectModel) {
      this.props.projectModel.on('update', (what, ...args) => {
        switch (what) {
          case 'reloaded':
            const newComponentCode = this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().getCode()
          
            // If component code changed, update it on Editor 
            // TODO: this logic could be migrated in the future to Monaco Editor
            // getDerivedStateFromProps on react 16+ 
            if (newComponentCode!==this.state.currentComponentCode){
              // This probably is portable to getDerivedStateFromProps
              this.setState({currentComponentCode: newComponentCode, currentEditorContents: newComponentCode}, () => {
                this.onMonacoEditorChange(newComponentCode, null)
              })
            }
            else{
              this.setState({currentComponentCode: newComponentCode})
            }
            break
        }
      })
    }
  }

  onMonacoEditorChange = (newContent, e) => {
    this.setState({currentEditorContents: newContent})
    this.props.setNonSavedContentOnCodeEditor(this.state.currentComponentCode!==this.state.currentEditorContents)
  }

  saveCodeFromEditorToDisk = () => {
    const currentEditorContents = this.state.currentEditorContents
    console.log('currentEditorContents:', {currentEditorContents: currentEditorContents})
    this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().flushContentFromString(currentEditorContents)
  }

  render () {
    const monacoOptions = {
      language: 'javascript',
      lineNumbers: 'on',
      links: false,
      theme: 'haiku',
      minimap: {enabled: false},
      autoIndent: true,
      contextmenu: false,
      codeLens: false,
      parameterHints: false,
      cursorBlinking: 'blink',
      scrollBeyondLastLine: false
    }

    return <div style={{
      width: '100%',
      height: '100%'
    }}>
      <button
        key='save-button'
        id='save-button'
        onClick={this.saveCodeFromEditorToDisk}
        style={{
          ...BTN_STYLES.btnText,
          backgroundColor: Palette.LIGHTEST_GRAY,
          position: 'absolute',
          zIndex: 2,
          right: '12px',
          top: '3px',
          padding: '2px 5px'
        }}>
        <span>SAVE</span>
      </button>
      <MonacoEditor
        language='javascript'
        value={this.state.currentEditorContents}
        options={monacoOptions}
        style={{
          width: '100%',
          height: '100%'
        }}
        onChange={this.onMonacoEditorChange}
      />
    </div>
  }
}

export default Radium(CodeEditor)
