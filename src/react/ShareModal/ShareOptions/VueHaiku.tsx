import * as React from 'react'
import * as dedent from 'dedent'
import {CodeBox} from '../../CodeBox'
import {NpmInstallable} from './NpmInstallable'

export default class VueHaiku extends React.PureComponent {
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
          import ${projectName} from '@haiku/${userName.toLowerCase()}-${projectName}/vue';

          new Vue({
            el: '#vue-dom-mount',
            template: \`<${projectName} haikuOptions={{loop: true}}></${projectName}>\`,
            components: {
              ${projectName}
            }
          })
          `}
        </CodeBox>
      </NpmInstallable>
    )
  }
}
