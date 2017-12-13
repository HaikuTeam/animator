import { shell } from 'electron'
import path from 'path'
import Radium from 'radium'
import React from 'react'
import Palette from 'haiku-ui-common/lib/Palette'
import ProjectPreview from './ProjectPreview'
import { StackMenuSVG } from 'haiku-ui-common/lib/react/OtherIcons'
import { DASH_STYLES } from '../styles/dashShared'

class ProjectThumbnail extends React.Component {
  constructor (props) {
    super(props)
    this.bytecodePath = path.join(this.props.projectPath, 'code', 'main', 'code.js')
    this.state = {
      isMenuActive: false,
      isHovered: false
    }
  }

  render () {
    return (
      <div
        style={[DASH_STYLES.card, this.props.isDeleted && DASH_STYLES.deleted]}
        id={`js-utility-${this.props.projectName}`}
        key='wrap'
        onMouseLeave={() => {
          this.setState({
            isMenuActive: false
          })
        }}
      >
        <div
          key='thumb'
          style={[
            DASH_STYLES.thumb,
            this.state.isMenuActive && DASH_STYLES.blurred
          ]}>
          <ProjectPreview
            bytecodePath={this.bytecodePath}
            projectName={this.props.projectName}
            playing={this.state.isHovered && !this.state.isMenuActive}
          />
        </div>
        <div
          key='scrim'
          style={[
            DASH_STYLES.scrim,
            (this.state.isMenuActive || this.state.isHovered) && {opacity: 1}
          ]}
          onClick={() => {
            if (!this.state.isMenuActive) {
              this.props.launchProject(this.props.projectName)
            }
          }}
          onMouseOver={() => {
            this.setState({isHovered: true})
          }}
          onMouseLeave={() => {
            this.setState({isHovered: false})
          }}
        >
          <span
            key='open'
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.single,
              this.state.isMenuActive && DASH_STYLES.gone,
              !this.state.isHovered && DASH_STYLES.gone2
            ]}
          >
            OPEN
          </span>
          <span
            key='delete'
            onClick={this.props.showDeleteModal}
            style={[
              DASH_STYLES.menuOption,
              !this.state.isMenuActive && DASH_STYLES.gone
            ]}
          >
            DELETE
          </span>
          <span
            key='reveal'
            onClick={() => shell.showItemInFolder(this.props.projectPath)}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone
            ]}
          >
            REVEAL IN FINDER
          </span>
        </div>
        <div style={DASH_STYLES.titleStrip}>
          <span style={DASH_STYLES.title}>
            {this.props.projectName.charAt(0).toUpperCase() + this.props.projectName.slice(1)}
          </span>
          <span
            style={[DASH_STYLES.titleOptions, {transform: 'translateY(1px)'}]}
            onClick={() => {
              this.setState({
                isMenuActive: !this.state.isMenuActive
              })
            }}
          >
            <StackMenuSVG color={Palette.SUNSTONE} width='5px' height='12px' />
          </span>
        </div>
      </div>
    )
  }
}

export default Radium(ProjectThumbnail)
