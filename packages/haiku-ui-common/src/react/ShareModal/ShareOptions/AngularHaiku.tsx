import * as React from 'react';
import * as dedent from 'dedent';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';
import * as Project from 'haiku-serialization/src/bll/Project';

export default class AngularHaiku extends React.PureComponent {
  props;

  static propTypes = {
    projectName: React.PropTypes.string,
    userName: React.PropTypes.string,
  };

  render() {
    const {projectName, userName, organizationName} = this.props;
    const angularSelectorName = Project.getAngularSelectorName(projectName);
    return (
      <NpmInstallable projectName={projectName} userName={userName} organizationName={organizationName}>
        <CodeBox>
          {dedent`
          import ${projectName}Module from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}/angular-module';

          @NgModule({
            ...,
            declarations: [..., AppComponent],
            imports: [..., ${projectName}Module],
            ...
          })
          export class AppModule {...}

          @Component({
            ...,
            template: \`<${angularSelectorName} [loop]="true"></${angularSelectorName}>\`,
            ...
          })
          export class AppComponent {...}
          `}
        </CodeBox>
      </NpmInstallable>
    );
  }
}
