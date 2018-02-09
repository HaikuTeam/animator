import * as React from 'react'
import Palette from '../Palette'
import SyntaxHighlighter, { registerLanguage } from "react-syntax-highlighter/prism-light"
import jsx from 'react-syntax-highlighter/languages/prism/jsx'
import { atomDark } from 'react-syntax-highlighter/styles/prism';

registerLanguage('jsx', jsx);

export const CodeBox = ({children, lang='jsx'}) => {
  atomDark['pre[class*="language-"]'].background = Palette.FATHER_COAL

  return (
    <SyntaxHighlighter language={lang} style={atomDark}>
      {children}
    </SyntaxHighlighter>
  )
}
