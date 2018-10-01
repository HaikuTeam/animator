import * as path from 'path';
import * as React from 'react';
import Palette from 'haiku-ui-common/lib/Palette';
import ProjectPreview from './ProjectPreview';
import * as Color from 'color';

const STYLES = {
  card: {
    position: 'relative',
    minWidth: 100,
    height: 90,
    cursor: 'pointer',
    overflow: 'hidden',
    WebkitUserSelect: 'none',
    filter: 'blur(0px)',
    backgroundColor: Palette.COAL,
    backgroundImage: `linear-gradient(45deg, ${Palette.FATHER_COAL} 25%, transparent 25%, transparent 75%, ${Palette.FATHER_COAL} 75%, ${Palette.FATHER_COAL}), linear-gradient(45deg, ${Palette.FATHER_COAL} 25%, transparent 25%, transparent 75%, ${Palette.FATHER_COAL} 75%, ${Palette.FATHER_COAL})`,
    backgroundSize: '10px 10px',
    backgroundPosition: '0 0, 5px 5px',
    boxShadow: '0 10px 40px 0 rgba(21,32,34,0.39)',
    borderRadius: 5,
    transform: 'scale(1)',
    transition: 'all 200ms ease',
    ':hover': {
      boxShadow: '0 10px 40px 0 rgba(21,32,34,0.69)',
    },
  },
  thumb: {
    height: 90,
    overflow: 'hidden',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    transform: 'translate3d(0,0,0)',
    transition: 'transform 140ms ease',
    margin: 0,
    width: '100%',
  },
  scrim: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    top: 0,
    left: 0,
    width: '100%',
    height: 90,
    opacity: 0,
    color: Palette.SUNSTONE,
    backgroundColor: Color(Palette.FATHER_COAL).fade(0.4),
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  option: {
    opacity: 0.84,
    display: 'block',
    transform: 'translateY(0px)',
    transition: 'opacity 120ms ease, transform 390ms cubic-bezier(.35,.44,0,1.3)',
    pointerEvents: 'auto',
    ':hover': {
      opacity: 1,
    },
    transition: 'opacity 120ms 62ms ease, transform 390ms 62ms cubic-bezier(.35,.44,0,1.3)',
  },
  gone: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateY(20px)',
  },
};

export default class ComponentsearchThumbnail extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isMenuActive: false,
      isHovered: false,
    };
  }

  get bytecodePath () {
    return path.join(this.props.projectPath, 'code', 'main', 'code.js');
  }

  render () {
    return (
      <div
        style={{
          ...STYLES.card,
        }}
        onMouseLeave={() => {
          this.setState({
            isMenuActive: false,
          });
        }}>
        <div
          style={{
            ...STYLES.thumb,
            ...(this.state.isMenuActive && STYLES.blurred),
          }}>
          <ProjectPreview
            bytecodePath={this.bytecodePath}
            projectName={this.props.projectName}
            projectPath={this.props.projectPath}
            playing={this.state.isHovered && !this.state.isMenuActive}
          />
        </div>
        <div
          style={{
            ...STYLES.scrim,
            ...((this.state.isMenuActive || this.state.isHovered) && {opacity: 1}),
          }}
          onMouseOver={() => {
            this.setState({isHovered: true, isMenuActive: true});
          }}
          onMouseLeave={() => {
            this.setState({isHovered: false, isMenuActive: false});
          }}>
          {this.props.projectExistsLocally && <span
            key="duplicate"
            onClick={() => {
              this.props.handleIngest();
            }}
            style={{
              ...STYLES.option,
              ...(!this.state.isMenuActive && STYLES.gone),
            }}>
            INGEST
          </span>}
        </div>
      </div>
    );
  }
}
