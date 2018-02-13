import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { PopoverMenu } from '../../src/react/PopoverMenu';

storiesOf('PopoverMenu', module)
  .add('default', () => (
    <PopoverMenu />
  ))
