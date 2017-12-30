import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { LoadingSpinnerSVG } from '../../src/react/OtherIcons';

storiesOf('LoadingSpinnerSVG', module)
  .add('default', () => (
    <LoadingSpinnerSVG color="red" />
  ))
