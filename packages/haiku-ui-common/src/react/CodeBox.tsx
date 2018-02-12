import * as React from 'react';
import Palette from '../Palette';
// tslint:disable-next-line
import SyntaxHighlighter, {registerLanguage} from 'react-syntax-highlighter/prism-light';
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
import {atomDark} from 'react-syntax-highlighter/styles/prism';

registerLanguage('jsx', jsx);

export class CodeBox extends React.PureComponent {
  props;

  static propTypes = {
    lang: React.PropTypes.string,
  };

  static defaultProps = {
    lang: 'jsx',
  };

  render () {
    atomDark['pre[class*="language-"]'].background = Palette.FATHER_COAL;

    return (
      <SyntaxHighlighter language={this.props.lang} style={atomDark}>
        {this.props.children}
      </SyntaxHighlighter>
    );
  }
}
