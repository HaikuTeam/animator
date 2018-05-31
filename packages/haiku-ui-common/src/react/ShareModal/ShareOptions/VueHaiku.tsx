import * as React from 'react';
import * as dedent from 'dedent';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export type VueHaikuProps = {
  projectName: string;
  organizationName: string;
};

export default class VueHaiku extends React.PureComponent<VueHaikuProps> {
  render() {
    const {projectName, organizationName} = this.props;
    return (
      <NpmInstallable projectName={projectName} organizationName={organizationName}>
        <CodeBox>
          {dedent`
          import ${projectName} from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}/vue';

          new Vue({
            el: '#vue-dom-mount',
            template: \`<${projectName} :loop="true"></${projectName}>\`,
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
