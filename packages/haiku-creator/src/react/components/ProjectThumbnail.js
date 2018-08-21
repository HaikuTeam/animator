import {shell} from 'electron';
import * as path from 'path';
import * as Radium from 'radium';
import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ProjectPreview from './ProjectPreview';
import {StackMenuSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import {DASH_STYLES} from '../styles/dashShared';

class ProjectThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.bytecodePath = path.join(this.props.projectPath, 'code', 'main', 'code.js');
    this.state = {
      isMenuActive: false,
      isHovered: false,
    };
  }

  render () {
    return (
      <div
        style={[DASH_STYLES.card, this.props.isDeleted && DASH_STYLES.deleted]}
        id={`js-utility-${this.props.projectName}`}
        key="wrap"
        onMouseLeave={() => {
          this.setState({
            isMenuActive: false,
          });
        }}
      >
        <div
          key="thumb"
          style={[
            DASH_STYLES.thumb,
            this.state.isMenuActive && DASH_STYLES.blurred,
          ]}>
          <ProjectPreview
            bytecodePath={this.bytecodePath}
            projectName={this.props.projectName}
            projectPath={this.props.projectPath}
            playing={this.state.isHovered && !this.state.isMenuActive}
          />
        </div>
        <div
          key="scrim"
          className="js-utility-project-launcher"
          style={[
            DASH_STYLES.scrim,
            (this.state.isMenuActive || this.state.isHovered) && {opacity: 1},
          ]}
          onClick={() => {
            if (!this.state.isMenuActive) {
              this.props.launchProject();
            }
          }}
          onMouseOver={() => {
            this.setState({isHovered: true});
          }}
          onMouseLeave={() => {
            this.setState({isHovered: false});
          }}
        >
          <span
            key="open"
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.single,
              this.state.isMenuActive && DASH_STYLES.gone,
              !this.state.isHovered && DASH_STYLES.gone2,
            ]}
          >
            OPEN
          </span>
          {this.props.projectExistsLocally && <span
            key="duplicate"
            onClick={this.props.showDuplicateProjectModal}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone,
            ]}
          >
            DUPLICATE
          </span>}
          {this.props.projectExistsLocally && <span
            key="reveal"
            onClick={() => shell.showItemInFolder(this.props.projectPath)}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone,
            ]}
          >
            REVEAL IN FINDER
          </span>}
          {this.props.allowDelete && <span
            key="delete"
            onClick={this.props.showDeleteModal}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone,
            ]}
          >
            DELETE
          </span>}
        </div>
        <div
            onClick={this.props.launchProject}
            style={DASH_STYLES.titleStrip}
        >
          <span style={DASH_STYLES.title}>
            {this.props.projectName}
          </span>
          {(this.props.allowDelete || this.props.projectExistsLocally) && <span
            title="Show project options"
            style={[DASH_STYLES.titleOptions, {transform: 'translateY(1px)'}]}
            onClick={(e) => {
              // Prevend launching project, as parent div has onClick handler
              e.stopPropagation();
              this.setState({
                isMenuActive: !this.state.isMenuActive,
              });
            }}
          >
            <StackMenuSVG color={Palette.SUNSTONE} width="5px" height="12px" />
          </span>}
        </div>
      </div>
    );
  }
}

export default Radium(ProjectThumbnail);
