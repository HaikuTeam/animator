import * as React from 'react';
import * as dedent from 'dedent';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export default class VanillaJS extends React.PureComponent {
  props;

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
    organizationName: React.PropTypes.string,
  };

  render() {
    const {projectName, userName, organizationName} = this.props;
    const componentName = projectName[0].toUpperCase() + projectName.substring(1);

    return (
      <NpmInstallable projectName={projectName} userName={userName} organizationName={organizationName}>
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
