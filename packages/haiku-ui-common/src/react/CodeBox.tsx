/* tslint:disable:import-name */
import * as React from 'react';
// @ts-ignore
import jsx from 'react-syntax-highlighter/languages/prism/jsx';
// @ts-ignore
import SyntaxHighlighter, {registerLanguage} from 'react-syntax-highlighter/prism-light';
// @ts-ignore
import {atomDark} from 'react-syntax-highlighter/styles/prism';
import Palette from '../Palette';

registerLanguage('jsx', jsx);

export interface CodeBoxProps {
  lang?: string;
}

export class CodeBox extends React.PureComponent<CodeBoxProps> {
  static defaultProps = {
    lang: 'jsx',
  };

  render () {
    atomDark['pre[class*="language-"]'].background = Palette.FATHER_COAL;
    atomDark['pre[class*="language-"]'].userSelect = 'all';

    return (
      <SyntaxHighlighter language={this.props.lang} style={atomDark}>
        {this.props.children}
      </SyntaxHighlighter>
    );
  }
}
