/**
 * @file Work based on https://github.com/superRaytin/react-monaco-editor/blob/master/src/editor.js
 */

import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import {BTN_STYLES} from '../../styles/btnShared'
import MonacoEditor from './MonacoEditor'


class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentActiveComponentContents: '',
    }
    this.currentEditorContents = '';
  }

  componentWillMount () {
    console.log('componentWillMount')
    if (this.props.projectModel) {
      this.props.projectModel.on('update', (what, ...args) => {
  
        console.log('RECEIVED what:', what);
        switch (what) {
          case 'reloaded':
            const content = this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().getCode();
            console.log('RELOADED content',{content:content})
            this.setState({currentActiveComponentContents: content})
          break;
        }
      })
    }
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }


  componentWillUnmount() {
  }


  updateDimensions() {
  }

  onMonacoEditorChange = (newContent, e) => {
    this.currentEditorContents = newContent;
  }

  saveCodeFromEditorToDisk = () => {
    const currentEditorContents = this.currentEditorContents;
    console.log('currentEditorContents:',{currentEditorContents: currentEditorContents})
    this.props.projectModel.getCurrentActiveComponent().fetchActiveBytecodeFile().flushContentFromString(currentEditorContents)
  }

  render() {
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
              height: '100%',
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
                value={this.state.currentActiveComponentContents}
                options={monacoOptions}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                onChange={this.onMonacoEditorChange}
                />
            </div>;
  }

}


export default Radium(CodeEditor)
