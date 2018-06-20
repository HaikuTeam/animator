import * as React from 'react';
import * as Radium from 'radium';
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
  }
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
      </div>
    );
  }
}

ComponentMenu.propTypes = {
  projectModel: React.PropTypes.object.isRequired,
};

export default Radium(ComponentMenu);
