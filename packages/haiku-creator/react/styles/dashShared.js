import Palette from '../components/Palette'
import Color from 'color'

export const DASH_STYLES = {
  dashLevelWrapper: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: Color(Palette.FATHER_COAL).fade(0.07),
    opacity: 0,
    transform: 'scale(1.3)',
    transition: 'transform 340ms ease-out, opacity 140ms linear'
  },
  appearDashLevel: {
    pointerEvents: 'all',
    opacity: 1,
    transform: 'scale(1)'
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 32,
    zIndex: 1
  },
  projectsBar: {
    backgroundColor: Palette.FATHER_COAL,
    float: 'left',
    width: 300,
    height: '100%',
    color: Palette.ROCK,
    paddingTop: 30
  },
  titleWrapper: {
    paddingLeft: 32,
    paddingRight: 18,
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  projectsTitle: {
    fontSize: 26,
    color: Color(Palette.ROCK).fade(0.33),
    textTransform: 'uppercase'
  },
  btnNewProject: {
    borderRadius: '50%',
    backgroundColor: Palette.COAL,
    color: Palette.ROCK,
    width: 22,
    height: 22,
    marginTop: -1,
    ':hover': {
      backgroundColor: Palette.DARKER_GRAY
    }
  },
  tooltip: {
    backgroundColor: Palette.LIGHT_PINK,
    color: Palette.ROCK,
    position: 'absolute',
    right: '-132px',
    padding: '7px 16px',
    fontSize: 13,
    borderRadius: 4
  },
  arrowLeft: {
    width: 0,
    height: 0,
    position: 'absolute',
    left: -10,
    borderTop: '10px solid transparent',
    borderBottom: '10px solid transparent',
    borderRight: '10px solid ' + Palette.LIGHT_PINK
  },
  projectWrapper: {
    height: 55,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingRight: 12,
    cursor: 'pointer',
    WebkitUserSelect: 'none',
    ':hover': {
      backgroundColor: Color(Palette.COAL).fade(0.38)
    }
  },
  activeWrapper: {
    backgroundColor: Palette.COAL
  },
  activeProject: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 7,
    backgroundColor: Palette.LIGHT_PINK
  },
  loadingWrap: {
    height: 'calc(100% - 113px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    paddingLeft: 32,
    height: 25,
    opacity: 0.4
  },
  logoActive: {
    opacity: 1
  },
  projectTitle: {
    paddingLeft: 12,
    fontSize: 18,
    opacity: 0.73,
    cursor: 'pointer',
    color: Palette.ROCK
  },
  projectTitleNew: {
    paddingLeft: 12,
    color: Palette.ROCK
  },
  newProjectInput: {
    fontSize: 18,
    backgroundColor: Palette.FATHER_COAL,
    marginTop: 0,
    height: 35,
    paddingLeft: 5,
    paddingRight: 5,
    width: 195,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: Palette.ROCK,
    border: '1px solid ' + Color(Palette.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_PINK
    }
  },
  newProjectGoButton: {
    paddingLeft: 1,
    paddingRight: 1,
    backgroundColor: Palette.LIGHT_PINK,
    color: Palette.ROCK,
    marginTop: 0,
    width: 30,
    height: 35,
    fontSize: 12,
    letterSpacing: 1.3,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
    cursor: 'pointer',
    transform: 'scale(1)',
    transition: 'transform 200ms ease, background-color 200ms ease',
    ':hover': {
      backgroundColor: Palette.PINK
    },
    ':active': {
      transform: 'scale(.8)'
    },
    ':disabled': {
      backgroundColor: Palette.DARK_GRAY
    }
  },
  activeTitle: {
    opacity: 1
  },
  date: {
    marginLeft: 'auto',
    opacity: 0.6,
    textAlign: 'right',
    fontSize: 10,
    lineHeight: 1.3,
    color: Color(Palette.ROCK).fade(0.1)
  },
  activeDate: {
    opacity: 1
  },
  dateTitle: {
    color: Color(Palette.ROCK).fade(0.48)
  },
  details: {
    float: 'left',
    width: 'calc(100% - 300px)',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative'
  },
  centerCol: {
    width: 490,
    paddingTop: 68,
    paddingBottom: 68
  },
  fieldTitle: {
    fontSize: 15,
    color: Color(Palette.ROCK).fade(0.3),
    marginBottom: 4
  },
  field: {
    height: 69,
    width: '100%',
    marginBottom: 30,
    paddingLeft: 25,
    fontSize: 32,
    backgroundColor: Palette.FATHER_COAL,
    borderRadius: 3,
    color: Palette.ROCK,
    border: '1px solid ' + Color(Palette.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + Palette.LIGHT_PINK
    }
  },
  fieldDialogue: {
    width: 364,
    minHeight: 100,
    position: 'absolute',
    bottom: 'calc(-100% - 21px)',
    left: 'calc(50% - 177px)',
    boxShadow: '0 15px 24px 0 rgba(0,0,0,0.21)',
    borderRadius: 4,
    backgroundColor: Palette.COAL,
    padding: '17px 26px',
    fontSize: 16,
    transform: 'translateY(-25px)',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'all 300ms cubic-bezier(0.51, 0.55, 0.17, 1.55)'
  },
  fieldDialogueActive: {
    opacity: 1,
    transform: 'translateY(0)',
    pointerEvents: 'auto'
  },
  arrowTop: {
    width: 0,
    height: 0,
    position: 'absolute',
    top: -10,
    left: '50%',
    transform: 'translateX(-50%)',
    borderLeft: '10px solid transparent',
    borderRight: '10px solid transparent',
    borderBottom: '10px solid ' + Palette.COAL
  },
  fieldMono: {
    fontSize: 17,
    fontFamily: 'Fira Mono'
  },
  btn: {
    backgroundColor: Palette.LIGHT_PINK,
    padding: '5px 15px',
    borderRadius: 2,
    color: 'white',
    transform: 'scale(1)',
    textTransform: 'uppercase',
    transition: 'transform 200ms ease',
    ':active': {
      transform: 'scale(.8)'
    }
  },
  btnRight: {
    float: 'right',
    marginLeft: 6
  },
  btnSecondary: {
    backgroundColor: 'transparent'
  },
  editProject: {
    width: '100%',
    borderRadius: 3,
    height: 53,
    fontSize: 22,
    letterSpacing: 1.5,
    backgroundColor: Palette.LIGHT_PINK,
    color: Palette.ROCK
  },
  btnClose: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: Palette.LIGHT_PINK,
    padding: '10px 15px'
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 490,
    fontSize: 40,
    color: Color(Palette.FATHER_COAL).darken(0.2),
    textAlign: 'center'
  },
  noSelect: {
    WebkitUserSelect: 'none',
    cursor: 'default'
  }
}
