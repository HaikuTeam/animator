/**
 * @file Work based on https://github.com/superRaytin/react-monaco-editor/blob/master/src/editor.js
 */

import React from 'react'
import Radium from 'radium'
import MonacoEditor from './MonacoEditor'
import SaveContentsPopup from './SaveContentsPopup'

class CodeEditor extends React.Component {
  constructor (props) {
    super(props)

    this.onMonacoEditorChange = this.onMonacoEditorChange.bind(this)
    this.saveCodeFromEditorToDisk = this.saveCodeFromEditorToDisk.bind(this)

    this.state = {
      currentComponentCode: '',
      currentEditorContents: ''
    }
  }

  componentWillMount () {
    console.log('componentWillMount')
    if (this.props.projectModel) {
      this.props.projectModel.on('update', (what, ...args) => {
        // console.log('RRRR what:',what)
        switch (what) {
          case 'reloaded':
            const newComponentCode = this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().getCode()

            // If component code changed, update it on Editor
            // TODO: this logic could be migrated in the future to Monaco Editor
            // getDerivedStateFromProps on react 16+
            if (newComponentCode !== this.state.currentComponentCode) {
              // This probably is portable to getDerivedStateFromProps
              this.setState({currentComponentCode: newComponentCode, currentEditorContents: newComponentCode}, () => {
                this.onMonacoEditorChange(newComponentCode, null)
              })
            } else {
              this.setState({currentComponentCode: newComponentCode})
            }
            break
        }
      })
    }
  }

  onMonacoEditorChange (newContent, e) {
    this.setState({currentEditorContents: newContent})
    this.props.setNonSavedContentOnCodeEditor(this.state.currentComponentCode !== this.state.currentEditorContents)
  }

  saveCodeFromEditorToDisk () {
    const currentEditorContents = this.state.currentEditorContents
    // Save contents to file
    this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().flushContentFromString(currentEditorContents)
    // Force module reload
    this.props.projectModel.getCurrentActiveComponent().moduleReplace(() => {})
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

    return <div style={{width: '100%', height: '100%'}}>
      {this.props.showPopupToSaveRawEditorContents &&
        <SaveContentsPopup
          projectModel={this.props.projectModel}
          targetComponentToChange={this.props.targetComponentToChange}
          setShowPopupToSaveRawEditorContents={this.props.setShowPopupToSaveRawEditorContents}
          saveCodeFromEditorToDisk={this.saveCodeFromEditorToDisk}
        />}
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
