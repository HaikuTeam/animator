import * as React from 'react';
import * as dedent from 'dedent';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export default class VueHaiku extends React.PureComponent {
  props;

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
  };

  render() {
    const {projectName, userName, organizationName} = this.props;
    return (
      <NpmInstallable projectName={projectName} userName={userName} organizationName={organizationName}>
        <CodeBox>
          {dedent`
          import ${projectName} from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}/vue';

          new Vue({
            el: '#vue-dom-mount',
            template: \`<${projectName} haikuOptions="{{loop: true}}"></${projectName}>\`,
            components: {
              ${projectName}
            }
          })
          `}
        </CodeBox>
      </NpmInstallable>
    );
  }
}
