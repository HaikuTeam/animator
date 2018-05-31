import * as React from 'react';
import * as dedent from 'dedent';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';
// @ts-ignore
import * as Project from 'haiku-serialization/src/bll/Project';

export type AngularHaikuProps = {
  projectName: string;
  organizationName: string;
};

export default class AngularHaiku extends React.PureComponent<AngularHaikuProps> {
  render() {
    const {projectName, organizationName} = this.props;
    const angularSelectorName = Project.getAngularSelectorName(projectName);
    return (
      <NpmInstallable projectName={projectName} organizationName={organizationName}>
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
