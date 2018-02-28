import React from 'react'
import {PresentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons'
import Palette from 'haiku-ui-common/lib/Palette'
import {UserSettings} from 'haiku-sdk-creator/lib/bll/User'

// returns -1 if a < b, returns 0 if a === b, returns 1 if b > a
function compareSemVerStrings (a, b) {
  const as = a.split('.').map(Number)
  const bs = b.split('.').map(Number)

  for (let i = 0; i < as.length; i++) {
    if (as[i] < bs[i]) {
      return -1
    }
    if (as[i] > bs[i]) {
      return 1
    }
  }
  return 0
}

const STYLES = {
  wrapper: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex'
  },
  dot: {
    position: 'absolute',
    top: '-3px',
    right: '-7px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: Palette.LIGHTEST_PINK
  }
}

class NotificationExplorer extends React.PureComponent {
  constructor () {
    super()

    this.state = {
      hasNotifications: false,
      showChangelogModal: false
    }
  }

  async setNotifications () {
    const lastViewedChangelog = await this.props.user.getConfig(UserSettings.lastViewedChangelog)
    const currentRelease = process.env.HAIKU_RELEASE_VERSION
    const hasNotifications =
      typeof lastViewedChangelog === 'undefined' ||
      compareSemVerStrings(lastViewedChangelog, currentRelease) === -1

    this.setState({hasNotifications})
  }

  componentDidMount () {
    this.setNotifications()
  }

  componentDidUpdate () {
    this.setNotifications()
  }

  showChangelogModal () {
    this.setState({hasNotifications: false})
    this.props.onShowChangelogModal()
  }

  render () {
    if (!this.state.hasNotifications) {
      return null
    }

    return (
      <div style={STYLES.wrapper} onClick={() => { this.showChangelogModal() }}>
        <span style={STYLES.dot} />
        <PresentIconSVG size={16} />
      </div>
    )
  }
}

NotificationExplorer.propTypes = {
  user: React.PropTypes.object.isRequired,
  onShowChangelogModal: React.PropTypes.func.isRequired
}

export default NotificationExplorer
