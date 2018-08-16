import {getAngularSelectorName} from '@haiku/sdk-client/lib/ProjectDefinitions';
import * as dedent from 'dedent';
// @ts-ignore
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export interface AngularHaikuProps {
  projectName: string;
  organizationName: string;
}

export default class AngularHaiku extends React.PureComponent<AngularHaikuProps> {
  render () {
    const {projectName, organizationName} = this.props;
    const angularSelectorName = getAngularSelectorName(projectName);
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
