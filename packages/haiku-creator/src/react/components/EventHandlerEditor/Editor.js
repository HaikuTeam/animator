/* global monaco */
import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import SyntaxEvaluator from './SyntaxEvaluator';
import Snippets from './Snippets';

const STYLES = {
  amble: {
    backgroundColor: Palette.SPECIAL_COAL,
    fontFamily: 'Fira Mono',
    fontSize: '11px',
    padding: '3px 13px',
  },
  preamble: {
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  postamble: {
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    marginBottom: '25px',
    errors: {
      float: 'right',
      fontFamily: 'Fira Sans',
    },
  },
  editorContext: {
    fontFamily: 'Fira Mono',
    height: '200px',
    width: '100%',
    padding: '6px 0 6px 22px',
    backgroundColor: Palette.DARKEST_COAL,
    overflow: 'hidden',
  },
  editorWrapper: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
};

class Editor extends React.Component {
  constructor (props) {
    super(props);

    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.remove = this.remove.bind(this);
    this.evaluator = null;

    this.state = {
      contents: props.contents,
    };
  }

  componentDidMount () {
    this.editor = monaco.editor.create(this._context, {
      value: this.props.contents || '',
      language: 'javascript',
      lineNumbers: 'off',
      links: false,
      theme: 'haiku',
      minimap: {enabled: false},
      autoIndent: false,
      contextmenu: false,
      codeLens: false,
      parameterHints: false,
      scrollbar: {
        vertical: 'hidden',
        verticalScrollbarSize: '0',
      },
      cursorBlinking: 'blink',
      scrollBeyondLastLine: false,
      fontFamily: 'Fira Mono',
    });

    this.editor.onDidChangeModelContent(this.handleEditorChange);
    this.editor.focus();
    monaco.editor.setTheme('haiku-actions');
    // this.editor.onMouseMove listener declared in Snippets.js

    this.forceUpdate();
  }

  handleEditorChange () {
    setTimeout(() => {
      this.setState({contents: this.editor.getValue()});
      this.props.onContentChange(this.serialize());
    });
  }

  serialize (eventName = this.props.selectedEventName) {
    return {
      id: this.props.id,
      event: eventName,
      handler: {
        params: this.props.params,
        body: this.state.contents,
        type: 'FunctionExpression',
        name: null,
      },
      evaluator: this.evaluator,
    };
  }

  remove () {
    this.props.onRemove(this.serialize());
  }

  render () {
    return (
      <div
        id={this.props.id}
      >
        <div style={{...STYLES.amble, ...STYLES.preamble}}>
          {`function (${this.props.params.join(', ')}) {`}
        </div>
        <div
          style={STYLES.editorContext}
          className="haiku-multiline haiku-dynamic"
        >
          <div
            style={STYLES.editorWrapper}
            ref={(element) => {
              this._context = element;
            }}
          >
            <Snippets editor={this.editor} />
          </div>
        </div>
        <div style={{...STYLES.amble, ...STYLES.postamble}}>
          {'}'}
          <SyntaxEvaluator
            onChange={(evaluator) => {
              this.evaluator = evaluator;
            }}
            evaluate={this.state.contents}
            style={STYLES.postamble.errors}
          />
        </div>
      </div>
    );
  }
}

Editor.propTypes = {
  onContentChange: React.PropTypes.func.isRequired,
  selectedEventName: React.PropTypes.string.isRequired,
  contents: React.PropTypes.string,
  params: React.PropTypes.array.isRequired,
};

export default Radium(Editor);
