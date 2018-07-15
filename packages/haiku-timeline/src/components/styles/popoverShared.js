import Palette from 'haiku-ui-common/lib/Palette';

const popoverWidth = 170;
const pageTransDur = 170;

export const POPOVER_STYLES = {
  container: {
    borderRadius: '4px',
    minHeight: 80,
    maxHeight: '200px',
    width: popoverWidth + 'px',
    display: 'relative',
    backgroundColor: Palette.FATHER_COAL,
    color: Palette.ROCK,
    boxShadow: '0 6px 25px 0 ' + Palette.FATHER_COAL,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  pagesWrapper: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '4px',
    width: popoverWidth,
  },
  pages: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    width: popoverWidth,
    fontSize: '12px',
    WebkitUserSelect: 'none',
    overflow: 'auto',
  },
  pageOne: {
    transition: 'transform 220ms ease',
    transform: 'translate3d(0, 0, 0)',
    height: 100,
  },
  pageTwo: {
    backgroundColor: Palette.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: `transform ${pageTransDur}ms ease-out`,
    color: 'white',
    width: popoverWidth + 1,
    height: 142,
    borderLeft: '1px solid ' + Palette.COAL,
    marginLeft: '-1px',
  },
  pageThree: {
    backgroundColor: Palette.FATHER_COAL,
    transform: 'translate3d(100%, 0, 0)',
    transition: `transform ${pageTransDur}ms ease-out`,
    color: 'white',
    width: popoverWidth + 1,
    height: 200,
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
    letterSpacing: '1.3px',
    borderBottom: '1px solid ' + Palette.COAL,
  },
  title: {
    paddingTop: 3,
    color: Palette.DARK_ROCK,
    cursor: 'default',
    width: '100%',
  },
  mutedText: {
    color: Palette.ROCK_MUTED,
    fontStyle: 'italic',
  },
  strong: {
    color: Palette.ROCK,
    fontStyle: 'italic',
    fontWeight: 700,
  },
  btn: {
    backgroundColor: Palette.COAL,
    color: Palette.ROCK,
    fontSize: 12,
    padding: '4px 12px',
    borderRadius: 3,
    ':hover': {
      backgroundColor: Palette.GRAY,
    },
  },
  btnFull: {
    width: '90%',
    margin: '0 0 0 8px',
  },
  flip: {
    transform: 'rotate(180deg)',
    padding: '8px !important',
  },
  bottomRow: {
    borderTop: '1px solid ' + Palette.COAL,
    padding: 6,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  btnMini: {
    padding: 4,
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
  row: {
    position: 'relative',
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
  shorty: {
    width: '63%',
    pointerEvents: 'none',
  },
  indicator: {
    borderRadius: '50%',
    marginRight: 7,
    marginLeft: 2,
    width: 8,
    height: 8,
    display: 'inline-block',
  },
  activeIndicator: {
    backgroundColor: Palette.LIGHT_PINK,
  },
};
