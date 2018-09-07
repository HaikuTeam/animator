import * as React from 'react';
import * as Radium from 'radium';
import * as Color from 'color';
import Palette from 'haiku-ui-common/lib/Palette';
import ComponentTab from './ComponentTab';

const STYLES = {
  container: {
    position: 'relative',
    width: '100%',
    height: 30,
    backgroundColor: Palette.PALE_GRAY,
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingTop: '6px',
    overflow: 'hidden',
    verticalAlign: 'top',
  },
  newComponentButton: {
    width: 24,
    backgroundColor: Palette.STAGE_GRAY,
    color: Color(Palette.LIGHTEST_GRAY).alpha(0.54),
    verticalAlign: 'text-bottom',
    borderRadius: 4,
    marginLeft: 4,
    textAlign: 'center',
    lineHeight: '13px',
    paddingBottom: 2,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease, color 200ms ease',
    ':hover': {
      color: Palette.LIGHTEST_GRAY,
    },
    ':active': {
      transform: 'scale(.8)',
    },
  },
};

class ComponentMenu extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  getAllTabs () {
    return this.props.projectModel.getMultiComponentTabs();
  }

  getMainComponentTab () {
    const tabs = this.getAllTabs();
    return tabs.filter((tab) => tab.scenename === 'main')[0];
  }

  getOtherComponentTabs () {
    const tabs = this.getAllTabs();
    return tabs.filter((tab) => tab.scenename !== 'main');
  }

  conglomerateComponent = () => {
    this.props.conglomerateComponent({
      isBlankComponent: true,
      skipInstantiateInHost: true,
    });
  };

  render () {
    return (
      <div
        id="component-menu"
        className="no-select"
        style={[STYLES.container, !this.props.showGlass && {backgroundColor: Palette.GRAY}]}>
        <ComponentTab
          forceActive={this.getAllTabs().length === 1}
          projectModel={this.props.projectModel}
          tab={this.getMainComponentTab()}
          showGlass={this.props.showGlass}
          nonSavedContentOnCodeEditor={this.props.nonSavedContentOnCodeEditor}
          tryToChangeCurrentActiveComponent={this.props.tryToChangeCurrentActiveComponent} />
        {(this.getOtherComponentTabs().map((tab, index) => {
          return (
            <ComponentTab
              projectModel={this.props.projectModel}
              key={index}
              tab={tab}
              showGlass={this.props.showGlass}
              nonSavedContentOnCodeEditor={this.props.nonSavedContentOnCodeEditor}
              tryToChangeCurrentActiveComponent={this.props.tryToChangeCurrentActiveComponent} />
          );
        }))}
        {this.props.showGlass &&
          <button
            aria-label="Create blank component"
            data-tooltip={true}
            data-tooltip-bottom={true}
            style={STYLES.newComponentButton}
            onClick={this.conglomerateComponent}>
            +
          </button>
        }
      </div>
    );
  }
}

ComponentMenu.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(ComponentMenu);
