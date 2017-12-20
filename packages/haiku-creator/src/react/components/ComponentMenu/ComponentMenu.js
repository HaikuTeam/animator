import React from 'react'
import Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import ComponentTab from './ComponentTab'

const STYLES = {
  container: {
    position: 'relative',
    width: '100%',
    height: 30,
    backgroundColor: Palette.GRAY,
    paddingLeft: '5px',
    paddingRight: '5px',
    paddingTop: '7px',
    overflow: 'hidden',
    verticalAlign: 'top'
  }
}

class ComponentMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  getAllTabs () {
    return this.props.projectModel.getMultiComponentTabs()
  }

  getMainComponentTab () {
    const tabs = this.getAllTabs()
    return tabs.filter((tab) => tab.scenename === 'main')[0]
  }

  getOtherComponentTabs () {
    const tabs = this.getAllTabs()
    return tabs.filter((tab) => tab.scenename !== 'main')
  }

  render () {
    return (
      <div
        id='component-menu'
        className='no-select'
        style={[STYLES.container]}>
        <ComponentTab
          forceActive={this.getAllTabs().length === 1}
          projectModel={this.props.projectModel}
          tab={this.getMainComponentTab()} />
        {(this.getOtherComponentTabs().map((tab, index) => {
          return (
            <ComponentTab
              projectModel={this.props.projectModel}
              key={index}
              tab={tab} />
          )
        }))}
      </div>
    )
  }
}

ComponentMenu.propTypes = {
  projectModel: React.PropTypes.object.isRequired
}

export default Radium(ComponentMenu)
