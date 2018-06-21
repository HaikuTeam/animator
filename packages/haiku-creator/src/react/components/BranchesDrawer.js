import * as React from 'react';
import * as lodash from 'lodash';
import * as Radium from 'radium';
import Palette from 'haiku-ui-common/lib/Palette';
import {BranchIconSVG, CommentsIconSVG, EditsIconSVG, TeammatesIconSVG} from 'haiku-ui-common/lib/react/OtherIcons';

const fauxBranchState = [
  [false, false, true],
  [true, true, false],
  [true, false, false],
  [false, false, false],
  [true, false, false],
  [false, true, true],
  [false, false, false],
  [false, false, true],
  [false, false, false],
  [true, false, false],
  [false, false, false],
  [true, true, false],
  [false, false, false],
  [false, true, true],
  [false, false, false],
  [true, false, false],
  [true, true, false],
];

const STYLES = {
  container: {
    position: 'relative',
    boxShadow: 'inset -1px 0 0 ' + Palette.COAL,
    backgroundColor: Palette.GRAY,
    padding: 0,
    overflowY: 'auto',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
  },
  bar: { // This bar is for grabbing and moving around the application via its 'frame' class
    position: 'absolute',
    right: 0,
    left: 0,
    height: '36px',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  branchCurrent: {
    fontWeight: '400',
    color: Palette.ROCK,
    padding: '6px 4px 6px 12px',
    backgroundColor: Palette.COAL,
    borderLeft: `4px solid ${Palette.MEDIUM_PINK}`,
  },
  branchBase: {
    width: '100%',
    color: Palette.ROCK_MUTED,
    padding: '6px 4px 6px 16px',
    fontSize: '13.5px',
    position: 'relative',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: Palette.COAL,
    },
  },
  header: {
    textTransform: 'uppercase',
    margin: '40px 0 10px 0',
    textAlign: 'center',
  },
  branchStateHolster: {
    position: 'absolute',
    right: '1px',
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  branchStateBtns: {
    marginRight: '5px',
  },
  icon: {
    marginRight: '7px',
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px',
  },
};

class BranchesDrawer extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      branches: [],
    };
  }

  branchesList () {
    const currentBranches = this.state.branches;
    if (!currentBranches || currentBranches.length < 1) {
      return (
        // TODO: @taylor Add replacement loader
        <div style={STYLES.flex} />
      );
    }
    return (
      <div>
        {lodash.map(currentBranches, (branch, index) => {
          const show = fauxBranchState[index];
          return (
            <div
              style={[STYLES.branchBase, branch.isCurrent() && STYLES.branchCurrent]}
              key={`branch-${index}`}>
              <span style={STYLES.icon}><BranchIconSVG /></span>
              {branch.getName()}
              <span style={STYLES.branchStateHolster}>
                {show[0] ? <span style={STYLES.branchStateBtns}><EditsIconSVG /></span> : null}
                {show[1] ? <span style={STYLES.branchStateBtns}><TeammatesIconSVG /></span> : null}
                {show[2] ? <span style={STYLES.branchStateBtns}><CommentsIconSVG /></span> : null}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  branchesLoaded (branches) {
    this.setState({branches});
  }

  render () {
    return (
      <div style={STYLES.container} className="layout-box">
        <div style={STYLES.bar} className="frame" />
        <h3 style={STYLES.header}>Branches</h3>
        {this.branchesList()}
      </div>
    );
  }
}

export default Radium(BranchesDrawer);
