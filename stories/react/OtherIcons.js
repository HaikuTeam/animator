import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { ChevronDownIconSVG } from '../../src/react/OtherIcons';

storiesOf('ChevronDownIconSVG', module)
  .add('default', () => (
    <ChevronDownIconSVG color="red" />
  ))
