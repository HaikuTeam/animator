import * as React from 'react'
import * as Radium from 'radium'
import Palette from 'haiku-ui-common/lib/Palette'
import { ChevronLeftIconSVG, ChevronRightIconSVG } from 'haiku-ui-common/lib/react/OtherIcons'

const popoverWidth = 210
const popoverHeight = '200px'
const pageTransDur = 170

const STYLES = {
  container: {
    borderRadius: '4px',
    minHeight: '155px',
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: Palette.FATHER_COAL,
    color: Palette.ROCK,
    boxShadow: '0 6px 25px 0 ' + Palette.FATHER_COAL,
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth + 'px',
    height: popoverHeight,
    fontSize: '12px',
    WebkitUserSelect: 'none'
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)'
  },
  pageTwo: {
    backgroundColor: Palette.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: `transform ${pageTransDur}ms ease-out`,
    color: 'white',
    width: popoverWidth + 1 + 'px',
    borderLeft: '1px solid ' + Palette.COAL,
    marginLeft: '-1px'
  },
  pageThree: {
    backgroundColor: Palette.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: `transform ${pageTransDur}ms ease-out`,
    color: 'white',
    width: popoverWidth + 1 + 'px',
    borderLeft: '1px solid ' + Palette.COAL,
    marginLeft: '-1px'
  },
  onPage: {
    transform: 'translate3d(0, 0, 0)'
  },
  leftPage: {
    transform: 'translate3d(-30px, 0, 0)'
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '35px',
    width: '100%',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '1.3px',
    borderBottom: '1px solid ' + Palette.COAL
  },
  title: {
    paddingTop: 3,
    color: Palette.DARK_ROCK,
    cursor: 'default',
    width: '100%'
  },
  mutedText: {
    color: Palette.ROCK_MUTED,
    fontStyle: 'italic'
  },
  strong: {
    color: Palette.LIGHT_PINK,
    fontStyle: 'italic',
    fontWeight: 700
  },
  btn: {
    backgroundColor: Palette.COAL,
    color: Palette.ROCK,
    padding: '4px 12px',
    borderRadius: '3px',
    ':hover': {
      backgroundColor: Palette.GRAY
    }
  },
  btnFull: {
    width: '80%',
    margin: '0 0 0 17px'
  },
  flip: {
    transform: 'rotate(180deg)',
    padding: '8px !important'
  },
  bottomRow: {
    borderTop: '1px solid ' + Palette.COAL,
    padding: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  btnMini: {
    padding: '4px 4px',
    opacity: 0.7,
    float: 'right',
    ':hover': {
      opacity: 1
    }
  },
  rogueLayout: {
    marginTop: '3px'
  },
  btnTrans: {
    backgroundColor: 'transparent',
    ':hover': {
      backgroundColor: 'transparent'
    }
  },
  btnPrev: {
    position: 'absolute',
    left: 0,
    top: '6px'
  },
  row: {
    position: 'relative',
    width: '100%',
    padding: '3px 10px 3px 10px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: Palette.DARK_GRAY
    }
  },
  rowNoBg: {
    ':hover': {
      backgroundColor: 'transparent'
    }
  },
  shorty: {
    width: '63%',
    pointerEvents: 'none'
  },
  indicator: {
    borderRadius: '50%',
    marginRight: 7,
    marginLeft: 2,
    width: 8,
    height: 8,
    display: 'inline-block'
  },
  activeIndicator: {
    backgroundColor: Palette.LIGHT_PINK
  }
}

class EventsPopover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      onPageTwo: false,
      onPageThree: false,
      prevPage: null,
      selectedEvent: null
    }
    this.goToPageOne = this.goToPageOne.bind(this)
    this.goToPageTwo = this.goToPageTwo.bind(this)
    this.goToPageThree = this.goToPageThree.bind(this)
    this.goPrevPage = this.goPrevPage.bind(this)
    this.selectTimeline = this.selectTimeline.bind(this)
  }

  goToPageOne () {
    this.setState({onPageTwo: false})
    this.setState({onPageThree: false})
    this.setState({prevPage: null})
  }

  goToPageTwo () {
    this.setState({onPageTwo: true})
    this.setState({onPageThree: false})
  }

  goToPageThree (prevPage, chosenEvent) {
    this.setState({onPageThree: true})
    this.setState({prevPage})
    this.setState({selectedEvent: chosenEvent})
  }

  goPrevPage () {
    this.state.prevPage === 'Two'
      ? this.goToPageTwo()
      : this.goToPageOne()
  }

  selectTimeline () {
    // TODO
  }

  renderConnections () {
    return (
      <div>
        {this.props.connections.map((connection) => {
          return (
            <div
              key={`main-${connection}`}
              style={STYLES.row}
              onClick={() => this.goToPageThree('One', connection[0])}>
              {connection[0]} <span style={STYLES.mutedText}>plays</span> {connection[1]}
              <span style={{position: 'absolute', right: '4px', top: 0}}>
                <button
                  key={`v-${connection}`}
                  style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini]}>
                  <ChevronRightIconSVG color={Palette.ROCK} />
                </button>
              </span>
            </div>
          )
        })
        }
      </div>
    )
  }

  renderAvailEvents () {
    return (
      <div>
        {this.props.availEvents.map((theEvent) => {
          return (
            <div
              key={`main-${theEvent}`}
              style={STYLES.row}
              onClick={() => this.goToPageThree('Two', theEvent)}>
              {theEvent}
              <span style={{position: 'absolute', right: '4px', top: 0}}>
                <button
                  key={`v-${theEvent}`}
                  style={[STYLES.btn, STYLES.btnTrans, STYLES.btnMini]}>
                  <ChevronRightIconSVG color={Palette.ROCK} />
                </button>
              </span>
            </div>
          )
        })
        }
      </div>
    )
  }

  renderAvailTimelines () {
    const connections = this.props.connections
    let match
    let active

    return (
      <div>
        {this.props.availTimelines.map((timeline) => {
          connections.forEach(connection => {
            if (connection[0] === this.state.selectedEvent) active = connection[1]
          })

          match = active === timeline

          return (
            <div
              key={`main-${timeline}`}
              style={STYLES.row}
              onClick={this.selectTimeline}>
              <span style={[STYLES.indicator, match && STYLES.activeIndicator]} />
              {timeline}
            </div>
          )
        })
        }
      </div>
    )
  }

  render () {
    return (
      <div style={STYLES.container}>
        <div style={STYLES.pagesWrapper}>

          <div style={[STYLES.pages, STYLES.pageOne, this.state.onPageTwo && STYLES.leftPage]}>
            <div style={STYLES.titleRow}>
              <div style={STYLES.title}>Linked Events</div>
            </div>
            {this.renderConnections()}
            <div style={STYLES.bottomRow}>
              <button key='btn1' style={[STYLES.btn, STYLES.btnFull]} onClick={this.goToPageTwo}>Create Link</button>
            </div>
          </div>

          <div style={[STYLES.pages, STYLES.pageTwo, this.state.onPageTwo && STYLES.onPage, this.state.onPageThree && STYLES.leftPage]}>
            <div style={STYLES.titleRow}>
              <button
                key='btn2'
                style={[STYLES.btn, STYLES.btnTrans, STYLES.btnPrev]}
                onClick={this.goToPageOne}>
                <ChevronLeftIconSVG color={Palette.ROCK} />
              </button>
              <div style={STYLES.title}>Select Event</div>
            </div>
            {this.renderAvailEvents()}
          </div>

          <div style={[STYLES.pages, STYLES.pageThree, this.state.onPageThree && STYLES.onPage]}>
            <div style={STYLES.titleRow}>
              <button
                key='btn3'
                style={[STYLES.btn, STYLES.btnTrans, STYLES.btnPrev]}
                onClick={this.goPrevPage}>
                <ChevronLeftIconSVG color={Palette.ROCK} />
              </button>
              <div style={STYLES.title}>On <span style={STYLES.strong}>{this.state.selectedEvent}</span> Play</div>
            </div>
            {this.renderAvailTimelines()}
            <div style={STYLES.bottomRow}>
              <button key='btn4' style={[STYLES.btn, STYLES.btnFull]} onClick={this.props.closePopover}>Done</button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Radium(EventsPopover)
