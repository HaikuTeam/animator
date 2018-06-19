/**
 * @file Work based on https://github.com/superRaytin/react-monaco-editor/blob/master/src/editor.js
 */

import * as React from 'react';
import * as Radium from 'radium';
import MonacoEditor from './MonacoEditor';
import SaveContentsPopup from './SaveContentsPopup';
import BytecodeErrorPopup from './BytecodeErrorPopup';
import * as ModuleWrapper from 'haiku-serialization/src/bll/ModuleWrapper';

class CodeEditor extends React.Component {
  constructor (props) {
    super(props);

    this.onMonacoEditorChange = this.onMonacoEditorChange.bind(this);
    this.saveCodeFromEditorToDisk = this.saveCodeFromEditorToDisk.bind(this);
    this.onProjectModelUpdate = this.onProjectModelUpdate.bind(this);

    this.state = {
      currentComponentCode: '',
      currentEditorContents: '',
      currentBytecodeErrorString: '',
      showBytecodeErrorPopup: false,
    };
  }

  onProjectModelUpdate (what, ...args) {
    switch (what) {
      case 'reloaded':
        const ac = this.props.projectModel.getCurrentActiveComponent();
        if (!ac) {
          break;
        }

        const newComponentCode = ac.fetchActiveBytecodeFile().getCode();

        // If component code changed, update it on Editor
        // TODO: this logic could be migrated in the future to Monaco Editor
        // getDerivedStateFromProps on react 16+
        if (newComponentCode !== this.state.currentComponentCode) {
          // This probably is portable to getDerivedStateFromProps
          this.setState({currentComponentCode: newComponentCode, currentEditorContents: newComponentCode}, () => {
            this.onMonacoEditorChange(newComponentCode, null);
          });
        } else {
          this.setState({currentComponentCode: newComponentCode});
        }
        break;
    }
  }

  componentDidMount () {
    if (this.props.projectModel) {
      // Reload monaco contents on component load (eg. changing active component, loading a new project, ..)
      this.props.projectModel.on('update', this.onProjectModelUpdate);
    }
  }

  componentWillUnmount () {
    if (this.props.projectModel) {
      this.props.projectModel.removeListener('update', this.onProjectModelUpdate);
    }
  }

  /**
   * Keep monaco component synced with states from CodeEditor(currentEditorContents) and
   * Stage(nonSavedContentOnCodeEditor)
   */
  onMonacoEditorChange (newContent, e) {
    this.setState({currentEditorContents: newContent});
    this.props.setNonSavedContentOnCodeEditor(this.state.currentComponentCode !== this.state.currentEditorContents);
  }

  saveCodeFromEditorToDisk () {
    const activeComponent = this.props.projectModel.getCurrentActiveComponent();
    if (!activeComponent) {
      return;
    }

    activeComponent.replaceBytecode(this.state.currentEditorContents, {from: 'creator'}, (error) => {
      if (error) {
        this.setState({
          showBytecodeErrorPopup: true,
          currentBytecodeErrorString: `${error.name}: ${error.message}`,
        });
      }
    });
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
      scrollBeyondLastLine: false,
    };

    return (
      <div style={{width: '100%', height: '100%'}}>
        {this.props.showPopupToSaveRawEditorContents &&
          <SaveContentsPopup
            projectModel={this.props.projectModel}
            targetComponentToChange={this.props.targetComponentToChange}
            setShowPopupToSaveRawEditorContents={this.props.setShowPopupToSaveRawEditorContents}
            saveCodeFromEditorToDisk={this.saveCodeFromEditorToDisk}
          />}
        {this.state.showBytecodeErrorPopup &&
          <BytecodeErrorPopup
            currentBytecodeErrorString={this.state.currentBytecodeErrorString}
            closeBytecodeErrorPopup={() => {
              this.setState({showBytecodeErrorPopup: false});
            }}
          />}
        <MonacoEditor
          language="javascript"
          value={this.state.currentEditorContents}
          options={monacoOptions}
          style={{
            width: '100%',
            height: '100%',
          }}
          onChange={this.onMonacoEditorChange}
        />
      </div>
    );
  }
}

export default Radium(CodeEditor);
