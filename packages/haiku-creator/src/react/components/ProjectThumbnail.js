import {shell} from 'electron';
import * as path from 'path';
import * as Radium from 'radium';
import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ProjectPreview from './ProjectPreview';
import {StackMenuSVG} from 'haiku-ui-common/lib/react/OtherIcons';
import {DASH_STYLES} from '../styles/dashShared';
import {isMac, isWindows} from 'haiku-common/lib/environments/os';

class ProjectThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.bytecodePath = path.join(this.props.projectPath, 'code', 'main', 'code.js');
    this.state = {
      isMenuActive: false,
      isHovered: false,
    };
  }

  launchProjectIfAllowed = () => {
    if (this.props.allowInteractions && !this.props.expiredTrialNonPro) {
      this.props.launchProject();
    }
  };

  openBrowserToProjectSharePage () {
    shell.openExternal(this.props.projectShareUrl);
  }

  showDeleteModal = (e) => {
    e.stopPropagation();
    this.props.showDeleteModal();
  };

  showItemInFolder = (e) => {
    e.stopPropagation();
    shell.showItemInFolder(this.props.projectPath);
  };

  onClick = () => {
    if (!this.props.allowInteractions) {
      return;
    }

    if (this.props.expiredTrialNonPro) {
      return this.openBrowserToProjectSharePage();
    }

    if (!this.state.isMenuActive) {
      return this.launchProjectIfAllowed();
    }
  };

  onMouseOver = () => {
    if (this.props.allowInteractions) {
      this.setState({isHovered: true});
    }
  };

  onMouseLeave = () => {
    if (this.props.allowInteractions) {
      this.setState({isHovered: false});
    }
  };

  render () {
    return (
      <div
        style={[DASH_STYLES.card,
          this.props.isDeleted && DASH_STYLES.deleted,
          this.props.cardHeight && {height: this.props.cardHeight},
          !this.props.allowInteractions && DASH_STYLES.deadCard,
        ]}
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
            this.props.cardHeight && {height: this.props.cardHeight - 30},
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
            this.props.cardHeight && {height: this.props.cardHeight - 30},
            (this.state.isMenuActive || this.state.isHovered) && {opacity: 1},
          ]}
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
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
          {this.props.expiredTrialNonPro ? 'View Online' : 'Open'}
          </span>

          {(!this.props.expiredTrialNonPro) && <span
            key="view-online-alt"
            onClick={this.openBrowserToProjectSharePage.bind(this)}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone,
            ]}
          >
            View Online
          </span>}
          {(this.props.projectExistsLocally && !this.props.expiredTrialNonPro) && <span
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
            onClick={this.showItemInFolder}
            style={[
              DASH_STYLES.menuOption,
              DASH_STYLES.opt2,
              !this.state.isMenuActive && DASH_STYLES.gone,
            ]}
          >
            {isWindows() ? 'REVEAL IN FILE EXPLORER' : 'REVEAL IN FINDER'}
          </span>}
          {this.props.allowDelete && <span
            key="delete"
            onClick={this.showDeleteModal}
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
            onClick={this.launchProjectIfAllowed}
            style={DASH_STYLES.titleStrip}
        >
          <span style={DASH_STYLES.title}>
            {this.props.projectName}
          </span>
          {(this.props.allowDelete || this.props.projectExistsLocally) && this.props.allowInteractions && <span
            title="Show project options"
            style={[DASH_STYLES.titleOptions, {transform: 'translateY(1px)'}]}
            onClick={(e) => {
              // Prevent launching project, as parent div has onClick handler
              e.stopPropagation();
              if (this.props.allowInteractions) {
                this.setState({
                  isMenuActive: !this.state.isMenuActive,
                });
              }
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
