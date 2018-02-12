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

    return (
      <NpmInstallable>
        <CodeBox>
          {dedent`
          import ${projectName} from '@haiku/${organizationName.toLowerCase()}-${projectName}';

          const element = document.querySelector('.my-element');
          ${projectName}(element, {loop: true});
          `}
        </CodeBox>
      </NpmInstallable>
    );
  }
}
