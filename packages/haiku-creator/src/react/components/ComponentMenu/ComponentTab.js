import * as React from 'react';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import toTitleCase from '../../helpers/toTitleCase';
import * as logger from 'haiku-serialization/src/utils/LoggerInstance';

const STYLES = {
  container: {
    position: 'relative',
    display: 'inline-block',
    maxWidth: '400px',
    minWidth: '80px',
    height: '100%',
    margin: '0 1px 0 auto',
    verticalAlign: 'top',
  },
  tab: {
    position: 'relative',
    display: 'inline-block',
    backgroundColor: 'transparent',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    color: Palette.LIGHTEST_GRAY,
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '15px',
    paddingRight: '15px',
    height: '100%',
    width: '100%',
    cursor: 'pointer',
    ':hover': {
      color: Palette.GRAY,
    },
    active: {
      backgroundColor: Palette.STAGE_GRAY,
      color: Palette.FATHER_COAL,
    },
    nonActive: {
      backgroundColor: Palette.ROCK_MUTED,
    },
    activeDark: {
      backgroundColor: Palette.COAL,
      color: Palette.ROCK,
    },
    nonActiveDark: {
      backgroundColor: Palette.FATHER_COAL,
    },
  },
  label: {
    position: 'relative',
    width: '100%',
    display: 'inline-block',
    textAlign: 'center',
    whiteSpace: 'no-wrap',
  },
};

class ComponentTab extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
    this.changeComponent = this.changeComponent.bind(this);
  }

  changeComponent () {
    // If we're already the active component, do nothing
    if (
      this.props.tab.active ||
      this.props.projectModel.getCurrentActiveComponentSceneName() === this.props.tab.scenename
    ) {
      return;
    }

    // Stop preview mode if it happens to be active when we switch contexts
    this.props.projectModel.setInteractionMode(0, {from: 'creator'}, (err) => {
      if (err) {
        logger.error(err);
      }

      this.props.tryToChangeCurrentActiveComponent(this.props.tab.scenename);
    });
  }

  render () {
    const activeTabStyle = this.props.showGlass ? STYLES.tab.active : STYLES.tab.activeDark;
    const nonActiveTabStyle = this.props.showGlass ? STYLES.tab.nonActive : STYLES.tab.nonActiveDark;

    return (
      <div
        style={STYLES.container}>
        {this.props.tab && <div
          onClick={this.changeComponent}
          style={[
            STYLES.tab,
            !this.props.showGlass && {color: Palette.ROCK, ':hover': {color: Palette.SUNSTONE}},
            (this.props.forceActive || this.props.tab.active) ? activeTabStyle : nonActiveTabStyle,
          ]}>
          <div style={{display: 'inline-block', width: '100%'}}>
            <span style={STYLES.label} className="no-select">
              {toTitleCase(this.props.tab.scenename)}
            </span>
          </div>
          {(this.props.forceActive || this.props.tab.active) && this.props.nonSavedContentOnCodeEditor &&
          <div style={{position: 'absolute', display: 'inline-block', width: '30%', height: '12px'}}>
            <svg height="12" width="12">
              <circle cx="6" cy="6" r="4" fill="#f24082" />
            </svg>
          </div>}
        </div>}
      </div>
    );
  }
}

ComponentTab.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
  tab: React.PropTypes.object.isRequired,
};

export default Radium(ComponentTab);
