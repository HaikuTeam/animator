import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { ShareModal } from '../../src/react/ShareModal';
import styles from '../../../haiku-creator/public/stylesheets/global.css';

console.log(styles)

storiesOf('ShareModal', module)
  .add('default', () => (
    <ShareModal
      project={{projectName: 'Test'}}
      error={null}
      linkAddress={'http://test.com'}
      snapshotSaveConfirmed={false}
      isSnapshotSaveInProgress={false}
      isProjectInfoFetchInProgress={false}
      snapshotSyndicated={false}
      snapshotPublished={false}
      semverVersion={'0.0.1'}
      userName={'username'}
      organizationName={'organizationame'}
      projectUid={'projectUID'}
      sha={'sha'}
      mixpanel={{haikuTrack: () => {}}}
    />
  ))
