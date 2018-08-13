import * as React from 'react';
import {PresentIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  wrapper: {
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    marginRight: 15,
  },
  dot: {
    position: 'absolute',
    top: '-3px',
    right: '-7px',
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    backgroundColor: Palette.LIGHTEST_PINK,
  },
};

class NotificationExplorer extends React.PureComponent {
  constructor () {
    super();

    this.state = {
      hasNotifications: false,
      showChangelogModal: false,
    };
  }

  componentDidMount () {
    this.setState({
      hasNotifications: process.env.HAIKU_RELEASE_VERSION !== this.props.lastViewedChangelog,
    });
  }

  showChangelogModal () {
    this.setState({hasNotifications: false});
    this.props.onShowChangelogModal();
  }

  render () {
    if (!this.state.hasNotifications) {
      return null;
    }

    return (
      <div style={STYLES.wrapper} onClick={() => {
        this.showChangelogModal();
      }}>
        <span style={STYLES.dot} />
        <PresentIconSVG size={16} />
      </div>
    );
  }
}

NotificationExplorer.propTypes = {
  lastViewedChangelog: React.PropTypes.string,
  onShowChangelogModal: React.PropTypes.func.isRequired,
};

export default NotificationExplorer;
