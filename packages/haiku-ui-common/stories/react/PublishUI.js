import * as React from 'react'
import { storiesOf } from '@storybook/react'

import { ShareModal } from '../../src/react/ShareModal'
import styles from '../../../haiku-creator/public/stylesheets/global.css'

const defaultBeforeProps = {
  project: {
    projectPath: '/Users/roperzh/.haiku/projects/robertodip/lovedesign',
    projectName: 'lovedesign',
    projectExistsLocally: true,
    projectsHome: '/Users/roperzh/.haiku',
    repositoryUrl:
      'https://robertodip-User-1:VaLx7J7OwX1qhWmc3YXBtL0se0zJNKo6@git.haiku.ai/robertodip-projects/lovedesign.git',
    forkComplete: true,
    skipContentCreation: true,
    organizationName: 'robertodip',
    authorName: 'robertodip',
  },
  snapshotSaveConfirmed: null,
  isSnapshotSaveInProgress: true,
  linkAddress: 'Fetching Info',
  semverVersion: '0.0.0',
  error: null,
  snapshotSyndicated: false,
  snapshotPublished: false,
  userName: 'robertodip',
  organizationName: 'robertodip',
  projectUid: '',
  sha: '',
  mixpanel: {
    haikuTrack: () => {},
  },
  envoyProject: {
    getProjectDetail () {
      return new Promise((resolve, reject) => {
        resolve({
          IsPublic: true,
        })
      })
    },
    setIsPublic() {
      return new Promise((resolve, reject) => {
        resolve(true)
      })
    }
  },
}

const defaultAfterProps = {
  ...defaultBeforeProps,
  snapshotSaveConfirmed: false,
  isSnapshotSaveInProgress: false,
  linkAddress:
    'https://share.haiku.ai/6b68c8e4-0c85-42f4-859e-21918e012003/latest',
  semverVersion: '0.0.15',
  snapshotSyndicated: true,
  snapshotPublished: true,
  projectUid: 'fe00edbe-a00e-45ce-8498-327146d8b3fe',
  sha: 'b15b287091fd7312998c3158651e673418ec512b',
}

class Simulator extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      props: props.before || defaultBeforeProps,
    }

    setTimeout(() => {
      this.setState({ props: props.after || defaultAfterProps })
    }, props.timeout || 2000)
  }
  render() {
    return <ShareModal {...this.state.props} />
  }
}

storiesOf('ShareModal', module)
  .add('default', () => {
    return <Simulator />
  })
  .add('with error', () => {
    const errorProps = { ...defaultAfterProps, error: { message: 'adf' } }
    return <Simulator after={errorProps} />
  })
