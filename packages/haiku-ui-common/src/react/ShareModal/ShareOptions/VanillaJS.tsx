import * as dedent from 'dedent';
import * as React from 'react';
import {CodeBox} from '../../CodeBox';
import {NpmInstallable} from './NpmInstallable';

export interface VanillaJSProps {
  projectName: string;
  organizationName: string;
}

export default class VanillaJS extends React.PureComponent<VanillaJSProps> {
  render () {
    const {projectName, organizationName} = this.props;

    return (
      <NpmInstallable projectName={projectName} organizationName={organizationName}>
        <CodeBox>
          {dedent`
          import ${projectName} from '@haiku/${organizationName.toLowerCase()}-${projectName.toLowerCase()}';

          const element = document.querySelector('.my-element');
          ${projectName}(element, {loop: true});
          `}
        </CodeBox>
      </NpmInstallable>
    );
  }
}
