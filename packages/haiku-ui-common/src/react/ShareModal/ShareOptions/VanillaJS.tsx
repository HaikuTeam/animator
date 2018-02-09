import * as React from 'react'
import * as dedent from 'dedent'
import {CodeBox} from '../../CodeBox'
import {NpmInstallable} from './NpmInstallable'

export default class VanillaJS extends React.PureComponent {
  props

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string
  }

  render() {
    const {projectName, userName} = this.props

    return (
      <NpmInstallable>
        <CodeBox>
          {dedent`
          import ${projectName} from '@haiku/${userName.toLowerCase()}-${projectName}';

          const element = document.querySelector('.my-element');
          ${projectName}(element, {loop: true});
          `}
        </CodeBox>
      </NpmInstallable>
    )
  }
}
