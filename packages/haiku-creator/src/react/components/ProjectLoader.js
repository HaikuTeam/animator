import * as React from 'react';
import * as Hai from '@haiku/taylor-hai/react';
import Palette from 'haiku-ui-common/lib/Palette';

const STYLES = {
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: Palette.SUNSTONE,
    backgroundColor: Palette.COAL,
    zIndex: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    userSelect: 'none',
    fontSize: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingScreen: {
    height: '450px',
    width: '100%',
    backgroundColor: Palette.COAL,
  },
};

class ProjectLoader extends React.PureComponent {
  static defaultProps = {
    message: 'Initializing project....',
  };

  render () {
    return (
      <div style={STYLES.fullScreenCenterWrap} id="js-helper-project-loader">
        <div style={STYLES.loadingScreen}>
          <Hai
            loop={true}
            sizing={'contain'}
            contextMenu={'disabled'}
            onHaikuComponentWillUnmount={(component) => {
              component.context.destroy();
            }}
          />
        </div>
        <span>{this.props.message}</span>
      </div>
    );
  }
}

export default ProjectLoader;
