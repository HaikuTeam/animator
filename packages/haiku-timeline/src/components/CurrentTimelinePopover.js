import * as React from 'react';
import * as Radium from 'radium';
import DuplicateIconSVG from 'haiku-ui-common/lib/react/icons/DuplicateIconSVG';
import EditsIconSVG from 'haiku-ui-common/lib/react/icons/EditsIconSVG';
import DeleteIconSVG from 'haiku-ui-common/lib/react/icons/DeleteIconSVG';
import CheckmarkIconSVG from 'haiku-ui-common/lib/react/icons/CheckmarkIconSVG';
import ChevronLeftIconSVG from 'haiku-ui-common/lib/react/icons/ChevronLeftIconSVG';
import Palette from 'haiku-ui-common/lib/Palette';

const popoverWidth = 170;
const popoverHeight = '200px';
const pageTransDur = 170;

const STYLES = {
  container: {
    minHeight: '155px',
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: Palette.FATHER_COAL,
    color: 'white',
    boxShadow: '0 6px 25px 0 ' + Palette.FATHER_COAL,
    borderRadius: '4px',
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    width: popoverWidth + 'px',
    height: popoverHeight,
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight,
    // paddingTop: '5px'
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)',
  },
  pageTwo: {
    backgroundColor: Palette.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: `transform ${pageTransDur}ms ease-out`,
    color: 'white',
    width: popoverWidth + 1 + 'px',
    borderLeft: '1px solid ' + Palette.COAL,
    marginLeft: '-1px',
  },
  onPage: {
    transform: 'translate3d(0, 0, 0)',
  },
  leftPage: {
    transform: 'translate3d(-30px, 0, 0)',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '35px',
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: '13px',
    letterSpacing: '2px',
    borderBottom: '1px solid ' + Palette.COAL,
  },
  btn: {
    backgroundColor: Palette.COAL,
    color: Palette.ROCK,
    padding: '4px 12px',
    borderRadius: '3px',
    ':hover': {
      backgroundColor: Palette.GRAY,
    },
  },
  btnFull: {
    width: '80%',
    margin: '0 0 0 17px',
  },
  btnMini: {
    padding: '4px 4px',
    opacity: 0.7,
    float: 'right',
    ':hover': {
      opacity: 1,
    },
  },
  rogueLayout: {
    marginTop: '3px',
  },
  btnTrans: {
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  btnPrev: {
    position: 'absolute',
    left: 0,
    top: '6px',
  },
  timelineRow: {
    width: '100%',
    padding: '3px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: Palette.DARK_GRAY,
    },
  },
  rowNoBg: {
    ':hover': {
      backgroundColor: 'transparent',
    },
  },
  input: {
    borderRadius: '2px',
    color: Palette.ROCK,
    padding: '5px 10px',
    border: '1px solid transparent',
    width: '80%',
    pointerEvents: 'auto',
    ':focus': {
      border: '1px solid ' + Palette.PINK,
      backgroundColor: Palette.MEDIUM_COAL,
    },
  },
  shorty: {
    width: '63%',
    pointerEvents: 'none',
  },
  inputSolo: {
    margin: '7px 0 4px 17px',
    backgroundColor: Palette.MEDIUM_COAL,
    ':hover': {
      backgroundColor: Palette.COAL,
    },
    ':focus': {
      backgroundColor: Palette.COAL,
    },
  },
};

class CurrentTimelinePopover extends React.Component {
  constructor (props) {
    super(props);
    this.state = {onPageTwo: false};
  }

  goToPageOne () {
    this.setState({onPageTwo: false});
  }

  goToPageTwo () {
    this.setState({onPageTwo: true});
    setTimeout(() => {
      this.creationInput.focus();
    }, pageTransDur);
  }

  handleRename (event, timelineName) {
    event.preventDefault();
    const originalName = this.state.focusedTimeline;
    const newName = this[timelineName].value;
    this.props.changeTimelineName({originalName, newName});
    this[timelineName].blur();
  }

  handleCreateTimeline (event, form) {
    event.preventDefault();
    const name = this.creationInput.value;
    this.props.createTimeline(name);
    this.creationInput.blur();
    this.creationInput.value = '';
    this.setState({onPageTwo: false});
  }

  handleDuplicateTimeline (event, timelineName) {
    event.preventDefault();
    event.stopPropagation();
    this.props.duplicateTimeline(timelineName);
  }

  showRenameField (event, timelineName) {
    event.preventDefault();
    event.stopPropagation();
    // this[timelineName].focus() // ?
  }

  handleDeleteTimeline (event, timelineName) {
    event.preventDefault();
    event.stopPropagation();
    this.props.deleteTimeline(timelineName);
  }

  handleSelectTimeline (event, timelineName) {
    this.props.selectTimeline(timelineName);
    this.props.closePopover();
  }

  timelineElementsList () {
    return (
      <div>
        {this.props.timelineNames.map((timelineName) => {
          return (
            <div
              key={`main-${timelineName}`}
              onClick={(e) => {
                if (!Radium.getState(this.state, `t-${timelineName}`, ':focus')) {
                  this.handleSelectTimeline(e, timelineName);
                }
              }}
              style={{position: 'relative'}}>
              <form
                onSubmit={(e) => {
                  this.handleRename(e, timelineName);
                }}
                onFocus={(e) => {
                  this.setState({focusedTimeline: timelineName});
                }}
                key={`timelineName-${timelineName}`}
                style={[STYLES.timelineNameRow, Radium.getState(this.state, `t-${timelineName}`, ':focus') && STYLES.rowNoBg]}>
                <div>
                  <input
                    placeholder="Enter name"
                    key={`t-${timelineName}`}
                    defaultValue={timelineName}
                    className="popover-input"
                    style={[STYLES.input, !Radium.getState(this.state, `t-${timelineName}`, ':focus') && STYLES.shorty]}
                    ref={(input) => {
                      this[timelineName] = input;
                    }} />
                  {Radium.getState(this.state, `t-${timelineName}`, ':focus')
                      ? (<button
                        key={`b-${timelineName}`}
                        style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini, STYLES.rogueLayout]}
                        type="submit">
                        <CheckmarkIconSVG color={Palette.ROCK} />
                      </button>)
                      : null}
                </div>
              </form>
              {!Radium.getState(this.state, `t-${timelineName}`, ':focus')
                ? (<span style={{position: 'absolute', right: '4px', top: '5px'}}>
                  <button
                    onClick={this.handleDeleteTimeline.bind(this)}
                    key={`d-${timelineName}`}
                    style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini]}>
                    <DeleteIconSVG color={Palette.ROCK} />
                  </button>
                  <button
                    onClick={this.showRenameField.bind(this)}
                    key={`e-${timelineName}`}
                    style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini]}>
                    <EditsIconSVG color={Palette.ROCK} />
                  </button>
                  <button
                    onClick={this.handleDuplicateTimeline.bind(this)}
                    key={`v-${timelineName}`}
                    style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini]}>
                    <DuplicateIconSVG color={Palette.ROCK} />
                  </button>
                </span>)
                : null}
            </div>
          );
        })
        }
      </div>
    );
  }

  render () {
    return (
      <div style={STYLES.container}>
        <div style={STYLES.pagesWrapper}>
          <div style={[STYLES.pages, STYLES.pageOne, this.state.onPageTwo && STYLES.leftPage]}>
            <div style={STYLES.titleRow}>
              <button key="btn1" style={[STYLES.btn, STYLES.btnFull]} onClick={this.goToPageTwo.bind(this)}>Add Timeline</button>
            </div>
            {this.timelineElementsList()}
          </div>
          <div style={[STYLES.pages, STYLES.pageTwo, this.state.onPageTwo && STYLES.onPage]}>
            <div style={STYLES.titleRow}>
              <button
                key="btn2"
                style={[STYLES.btn, STYLES.btnTrans, STYLES.btnPrev]}
                onClick={this.goToPageOne.bind(this)}>
                <ChevronLeftIconSVG color={Palette.ROCK} />
              </button>
              <div style={{paddingTop: '5px', width: '100%'}}>NEW TIMELINE</div>
            </div>
            <form
              onSubmit={this.handleCreateTimeline.bind(this)}
              key={`timeline-new`}>
              <div>
                <input
                  placeholder="Name timeline"
                  key={`t-new`}
                  className="normal-input"
                  style={[STYLES.input, STYLES.inputSolo]}
                  ref={(input) => {
                    this.creationInput = input;
                  }} />
                <button style={[STYLES.btn, STYLES.btnFull]} type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Radium(CurrentTimelinePopover);
