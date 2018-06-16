import * as dedent from 'dedent';
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export interface ReactHaikuProps {
  projectName: string;
  organizationName: string;
}

export default class ReactHaiku extends React.PureComponent<ReactHaikuProps> {
  render () {
    const {projectName, organizationName} = this.props;
    const componentName = projectName[0].toUpperCase() + projectName.substring(1);

    return (
      <NpmInstallable projectName={projectName} organizationName={organizationName}>
        <CodeBox>
          {dedent`
          import ${componentName} from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}/react';

          /*...*/

          render() {
            return (
              <div>
                <${componentName} loop={true} />
              </div>
            );
          }
          `}
        </CodeBox>
      </NpmInstallable>
    );
  }
}
