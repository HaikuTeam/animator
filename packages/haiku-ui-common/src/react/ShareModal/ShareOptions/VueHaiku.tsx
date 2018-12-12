import * as dedent from 'dedent';
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export interface VueHaikuProps {
  projectName: string;
  organizationName: string;
}

export default class VueHaiku extends React.PureComponent<VueHaikuProps> {
  render () {
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
          });
          `}
        </CodeBox>

        <br />
        <i>Or using single file components:</i>
        <CodeBox>
          {dedent`
          <template>
            <${projectName} :loop="true"></${projectName}>
          </template>

          <script>
          import ${projectName} from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}/vue';

          export default {
            components: {
              ${projectName}
            }
          }
          </script>
          `}
        </CodeBox>

      </NpmInstallable>
    );
  }
}
