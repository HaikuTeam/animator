'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DASH_STYLES = undefined;

var _Palette = require('../components/Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DASH_STYLES = exports.DASH_STYLES = {
  dashLevelWrapper: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: (0, _color2.default)(_Palette2.default.FATHER_COAL).fade(0.07),
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
    backgroundColor: _Palette2.default.FATHER_COAL,
    float: 'left',
    width: 300,
    height: '100%',
    color: _Palette2.default.ROCK,
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
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.33),
    textTransform: 'uppercase'
  },
  btnNewProject: {
    borderRadius: '50%',
    backgroundColor: _Palette2.default.COAL,
    color: _Palette2.default.ROCK,
    width: 22,
    height: 22,
    marginTop: -1,
    ':hover': {
      backgroundColor: _Palette2.default.DARKER_GRAY
    }
  },
  tooltip: {
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK,
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
    borderRight: '10px solid ' + _Palette2.default.LIGHT_PINK
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
      backgroundColor: (0, _color2.default)(_Palette2.default.COAL).fade(0.38)
    }
  },
  activeWrapper: {
    backgroundColor: _Palette2.default.COAL
  },
  activeProject: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: 7,
    backgroundColor: _Palette2.default.LIGHT_PINK
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
    color: _Palette2.default.ROCK
  },
  projectTitleNew: {
    paddingLeft: 12,
    color: _Palette2.default.ROCK
  },
  newProjectInput: {
    fontSize: 18,
    backgroundColor: _Palette2.default.FATHER_COAL,
    marginTop: 0,
    height: 35,
    paddingLeft: 5,
    paddingRight: 5,
    width: 195,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    color: _Palette2.default.ROCK,
    border: '1px solid ' + (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_PINK
    }
  },
  newProjectGoButton: {
    paddingLeft: 1,
    paddingRight: 1,
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK,
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
      backgroundColor: _Palette2.default.PINK
    },
    ':active': {
      transform: 'scale(.8)'
    },
    ':disabled': {
      backgroundColor: _Palette2.default.DARK_GRAY
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
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.1)
  },
  activeDate: {
    opacity: 1
  },
  dateTitle: {
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.48)
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
    color: (0, _color2.default)(_Palette2.default.ROCK).fade(0.3),
    marginBottom: 4
  },
  field: {
    height: 69,
    width: '100%',
    marginBottom: 30,
    paddingLeft: 25,
    fontSize: 32,
    backgroundColor: _Palette2.default.FATHER_COAL,
    borderRadius: 3,
    color: _Palette2.default.ROCK,
    border: '1px solid ' + (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.4),
    ':focus': {
      border: '1px solid ' + _Palette2.default.LIGHT_PINK
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
    backgroundColor: _Palette2.default.COAL,
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
    borderBottom: '10px solid ' + _Palette2.default.COAL
  },
  fieldMono: {
    fontSize: 17,
    fontFamily: 'Fira Mono'
  },
  btn: {
    backgroundColor: _Palette2.default.LIGHT_PINK,
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
    backgroundColor: _Palette2.default.LIGHT_PINK,
    color: _Palette2.default.ROCK
  },
  btnClose: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: _Palette2.default.LIGHT_PINK,
    padding: '10px 15px'
  },
  emptyState: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    width: 490,
    fontSize: 40,
    color: (0, _color2.default)(_Palette2.default.FATHER_COAL).darken(0.2),
    textAlign: 'center'
  },
  noSelect: {
    WebkitUserSelect: 'none',
    cursor: 'default'
  },
  fullScreenCenterWrap: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: (0, _color2.default)(_Palette2.default.GRAY).fade(0.1),
    zIndex: 6
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9zdHlsZXMvZGFzaFNoYXJlZC5qcyJdLCJuYW1lcyI6WyJEQVNIX1NUWUxFUyIsImRhc2hMZXZlbFdyYXBwZXIiLCJwb3NpdGlvbiIsInBvaW50ZXJFdmVudHMiLCJ0b3AiLCJsZWZ0Iiwid2lkdGgiLCJoZWlnaHQiLCJvdmVyZmxvdyIsImJhY2tncm91bmRDb2xvciIsIkZBVEhFUl9DT0FMIiwiZmFkZSIsIm9wYWNpdHkiLCJ0cmFuc2Zvcm0iLCJ0cmFuc2l0aW9uIiwiYXBwZWFyRGFzaExldmVsIiwiZnJhbWUiLCJyaWdodCIsInpJbmRleCIsInByb2plY3RzQmFyIiwiZmxvYXQiLCJjb2xvciIsIlJPQ0siLCJwYWRkaW5nVG9wIiwidGl0bGVXcmFwcGVyIiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJkaXNwbGF5IiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwicHJvamVjdHNUaXRsZSIsImZvbnRTaXplIiwidGV4dFRyYW5zZm9ybSIsImJ0bk5ld1Byb2plY3QiLCJib3JkZXJSYWRpdXMiLCJDT0FMIiwibWFyZ2luVG9wIiwiREFSS0VSX0dSQVkiLCJ0b29sdGlwIiwiTElHSFRfUElOSyIsInBhZGRpbmciLCJhcnJvd0xlZnQiLCJib3JkZXJUb3AiLCJib3JkZXJCb3R0b20iLCJib3JkZXJSaWdodCIsInByb2plY3RXcmFwcGVyIiwiY3Vyc29yIiwiV2Via2l0VXNlclNlbGVjdCIsImFjdGl2ZVdyYXBwZXIiLCJhY3RpdmVQcm9qZWN0IiwibG9hZGluZ1dyYXAiLCJsb2dvIiwibG9nb0FjdGl2ZSIsInByb2plY3RUaXRsZSIsInByb2plY3RUaXRsZU5ldyIsIm5ld1Byb2plY3RJbnB1dCIsImJvcmRlclRvcExlZnRSYWRpdXMiLCJib3JkZXJCb3R0b21MZWZ0UmFkaXVzIiwiYm9yZGVyIiwiZGFya2VuIiwibmV3UHJvamVjdEdvQnV0dG9uIiwibGV0dGVyU3BhY2luZyIsImJvcmRlclRvcFJpZ2h0UmFkaXVzIiwiYm9yZGVyQm90dG9tUmlnaHRSYWRpdXMiLCJQSU5LIiwiREFSS19HUkFZIiwiYWN0aXZlVGl0bGUiLCJkYXRlIiwibWFyZ2luTGVmdCIsInRleHRBbGlnbiIsImxpbmVIZWlnaHQiLCJhY3RpdmVEYXRlIiwiZGF0ZVRpdGxlIiwiZGV0YWlscyIsImNlbnRlckNvbCIsInBhZGRpbmdCb3R0b20iLCJmaWVsZFRpdGxlIiwibWFyZ2luQm90dG9tIiwiZmllbGQiLCJmaWVsZERpYWxvZ3VlIiwibWluSGVpZ2h0IiwiYm90dG9tIiwiYm94U2hhZG93IiwiZmllbGREaWFsb2d1ZUFjdGl2ZSIsImFycm93VG9wIiwiYm9yZGVyTGVmdCIsImZpZWxkTW9ubyIsImZvbnRGYW1pbHkiLCJidG4iLCJidG5SaWdodCIsImJ0blNlY29uZGFyeSIsImVkaXRQcm9qZWN0IiwiYnRuQ2xvc2UiLCJlbXB0eVN0YXRlIiwibm9TZWxlY3QiLCJmdWxsU2NyZWVuQ2VudGVyV3JhcCIsIkdSQVkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFTyxJQUFNQSxvQ0FBYztBQUN6QkMsb0JBQWtCO0FBQ2hCQyxjQUFVLFVBRE07QUFFaEJDLG1CQUFlLE1BRkM7QUFHaEJDLFNBQUssQ0FIVztBQUloQkMsVUFBTSxDQUpVO0FBS2hCQyxXQUFPLE1BTFM7QUFNaEJDLFlBQVEsTUFOUTtBQU9oQkMsY0FBVSxRQVBNO0FBUWhCQyxxQkFBaUIscUJBQU0sa0JBQVFDLFdBQWQsRUFBMkJDLElBQTNCLENBQWdDLElBQWhDLENBUkQ7QUFTaEJDLGFBQVMsQ0FUTztBQVVoQkMsZUFBVyxZQVZLO0FBV2hCQyxnQkFBWTtBQVhJLEdBRE87QUFjekJDLG1CQUFpQjtBQUNmWixtQkFBZSxLQURBO0FBRWZTLGFBQVMsQ0FGTTtBQUdmQyxlQUFXO0FBSEksR0FkUTtBQW1CekJHLFNBQU87QUFDTGQsY0FBVSxVQURMO0FBRUxFLFNBQUssQ0FGQTtBQUdMQyxVQUFNLENBSEQ7QUFJTFksV0FBTyxDQUpGO0FBS0xWLFlBQVEsRUFMSDtBQU1MVyxZQUFRO0FBTkgsR0FuQmtCO0FBMkJ6QkMsZUFBYTtBQUNYVixxQkFBaUIsa0JBQVFDLFdBRGQ7QUFFWFUsV0FBTyxNQUZJO0FBR1hkLFdBQU8sR0FISTtBQUlYQyxZQUFRLE1BSkc7QUFLWGMsV0FBTyxrQkFBUUMsSUFMSjtBQU1YQyxnQkFBWTtBQU5ELEdBM0JZO0FBbUN6QkMsZ0JBQWM7QUFDWkMsaUJBQWEsRUFERDtBQUVaQyxrQkFBYyxFQUZGO0FBR1p4QixjQUFVLFVBSEU7QUFJWnlCLGFBQVMsTUFKRztBQUtaQyxvQkFBZ0IsZUFMSjtBQU1aQyxnQkFBWTtBQU5BLEdBbkNXO0FBMkN6QkMsaUJBQWU7QUFDYkMsY0FBVSxFQURHO0FBRWJWLFdBQU8scUJBQU0sa0JBQVFDLElBQWQsRUFBb0JYLElBQXBCLENBQXlCLElBQXpCLENBRk07QUFHYnFCLG1CQUFlO0FBSEYsR0EzQ1U7QUFnRHpCQyxpQkFBZTtBQUNiQyxrQkFBYyxLQUREO0FBRWJ6QixxQkFBaUIsa0JBQVEwQixJQUZaO0FBR2JkLFdBQU8sa0JBQVFDLElBSEY7QUFJYmhCLFdBQU8sRUFKTTtBQUtiQyxZQUFRLEVBTEs7QUFNYjZCLGVBQVcsQ0FBQyxDQU5DO0FBT2IsY0FBVTtBQUNSM0IsdUJBQWlCLGtCQUFRNEI7QUFEakI7QUFQRyxHQWhEVTtBQTJEekJDLFdBQVM7QUFDUDdCLHFCQUFpQixrQkFBUThCLFVBRGxCO0FBRVBsQixXQUFPLGtCQUFRQyxJQUZSO0FBR1BwQixjQUFVLFVBSEg7QUFJUGUsV0FBTyxRQUpBO0FBS1B1QixhQUFTLFVBTEY7QUFNUFQsY0FBVSxFQU5IO0FBT1BHLGtCQUFjO0FBUFAsR0EzRGdCO0FBb0V6Qk8sYUFBVztBQUNUbkMsV0FBTyxDQURFO0FBRVRDLFlBQVEsQ0FGQztBQUdUTCxjQUFVLFVBSEQ7QUFJVEcsVUFBTSxDQUFDLEVBSkU7QUFLVHFDLGVBQVcsd0JBTEY7QUFNVEMsa0JBQWMsd0JBTkw7QUFPVEMsaUJBQWEsZ0JBQWdCLGtCQUFRTDtBQVA1QixHQXBFYztBQTZFekJNLGtCQUFnQjtBQUNkdEMsWUFBUSxFQURNO0FBRWRvQixhQUFTLE1BRks7QUFHZEUsZ0JBQVksUUFIRTtBQUlkM0IsY0FBVSxVQUpJO0FBS2R3QixrQkFBYyxFQUxBO0FBTWRvQixZQUFRLFNBTk07QUFPZEMsc0JBQWtCLE1BUEo7QUFRZCxjQUFVO0FBQ1J0Qyx1QkFBaUIscUJBQU0sa0JBQVEwQixJQUFkLEVBQW9CeEIsSUFBcEIsQ0FBeUIsSUFBekI7QUFEVDtBQVJJLEdBN0VTO0FBeUZ6QnFDLGlCQUFlO0FBQ2J2QyxxQkFBaUIsa0JBQVEwQjtBQURaLEdBekZVO0FBNEZ6QmMsaUJBQWU7QUFDYi9DLGNBQVUsVUFERztBQUViRyxVQUFNLENBRk87QUFHYkQsU0FBSyxDQUhRO0FBSWJHLFlBQVEsTUFKSztBQUtiRCxXQUFPLENBTE07QUFNYkcscUJBQWlCLGtCQUFROEI7QUFOWixHQTVGVTtBQW9HekJXLGVBQWE7QUFDWDNDLFlBQVEsb0JBREc7QUFFWG9CLGFBQVMsTUFGRTtBQUdYRSxnQkFBWSxRQUhEO0FBSVhELG9CQUFnQjtBQUpMLEdBcEdZO0FBMEd6QnVCLFFBQU07QUFDSjFCLGlCQUFhLEVBRFQ7QUFFSmxCLFlBQVEsRUFGSjtBQUdKSyxhQUFTO0FBSEwsR0ExR21CO0FBK0d6QndDLGNBQVk7QUFDVnhDLGFBQVM7QUFEQyxHQS9HYTtBQWtIekJ5QyxnQkFBYztBQUNaNUIsaUJBQWEsRUFERDtBQUVaTSxjQUFVLEVBRkU7QUFHWm5CLGFBQVMsSUFIRztBQUlaa0MsWUFBUSxTQUpJO0FBS1p6QixXQUFPLGtCQUFRQztBQUxILEdBbEhXO0FBeUh6QmdDLG1CQUFpQjtBQUNmN0IsaUJBQWEsRUFERTtBQUVmSixXQUFPLGtCQUFRQztBQUZBLEdBekhRO0FBNkh6QmlDLG1CQUFpQjtBQUNmeEIsY0FBVSxFQURLO0FBRWZ0QixxQkFBaUIsa0JBQVFDLFdBRlY7QUFHZjBCLGVBQVcsQ0FISTtBQUlmN0IsWUFBUSxFQUpPO0FBS2ZrQixpQkFBYSxDQUxFO0FBTWZDLGtCQUFjLENBTkM7QUFPZnBCLFdBQU8sR0FQUTtBQVFma0QseUJBQXFCLENBUk47QUFTZkMsNEJBQXdCLENBVFQ7QUFVZnBDLFdBQU8sa0JBQVFDLElBVkE7QUFXZm9DLFlBQVEsZUFBZSxxQkFBTSxrQkFBUWhELFdBQWQsRUFBMkJpRCxNQUEzQixDQUFrQyxHQUFsQyxDQVhSO0FBWWYsY0FBVTtBQUNSRCxjQUFRLGVBQWUsa0JBQVFuQjtBQUR2QjtBQVpLLEdBN0hRO0FBNkl6QnFCLHNCQUFvQjtBQUNsQm5DLGlCQUFhLENBREs7QUFFbEJDLGtCQUFjLENBRkk7QUFHbEJqQixxQkFBaUIsa0JBQVE4QixVQUhQO0FBSWxCbEIsV0FBTyxrQkFBUUMsSUFKRztBQUtsQmMsZUFBVyxDQUxPO0FBTWxCOUIsV0FBTyxFQU5XO0FBT2xCQyxZQUFRLEVBUFU7QUFRbEJ3QixjQUFVLEVBUlE7QUFTbEI4QixtQkFBZSxHQVRHO0FBVWxCQywwQkFBc0IsQ0FWSjtBQVdsQkMsNkJBQXlCLENBWFA7QUFZbEJqQixZQUFRLFNBWlU7QUFhbEJqQyxlQUFXLFVBYk87QUFjbEJDLGdCQUFZLG1EQWRNO0FBZWxCLGNBQVU7QUFDUkwsdUJBQWlCLGtCQUFRdUQ7QUFEakIsS0FmUTtBQWtCbEIsZUFBVztBQUNUbkQsaUJBQVc7QUFERixLQWxCTztBQXFCbEIsaUJBQWE7QUFDWEosdUJBQWlCLGtCQUFRd0Q7QUFEZDtBQXJCSyxHQTdJSztBQXNLekJDLGVBQWE7QUFDWHRELGFBQVM7QUFERSxHQXRLWTtBQXlLekJ1RCxRQUFNO0FBQ0pDLGdCQUFZLE1BRFI7QUFFSnhELGFBQVMsR0FGTDtBQUdKeUQsZUFBVyxPQUhQO0FBSUp0QyxjQUFVLEVBSk47QUFLSnVDLGdCQUFZLEdBTFI7QUFNSmpELFdBQU8scUJBQU0sa0JBQVFDLElBQWQsRUFBb0JYLElBQXBCLENBQXlCLEdBQXpCO0FBTkgsR0F6S21CO0FBaUx6QjRELGNBQVk7QUFDVjNELGFBQVM7QUFEQyxHQWpMYTtBQW9MekI0RCxhQUFXO0FBQ1RuRCxXQUFPLHFCQUFNLGtCQUFRQyxJQUFkLEVBQW9CWCxJQUFwQixDQUF5QixJQUF6QjtBQURFLEdBcExjO0FBdUx6QjhELFdBQVM7QUFDUHJELFdBQU8sTUFEQTtBQUVQZCxXQUFPLG9CQUZBO0FBR1BDLFlBQVEsTUFIRDtBQUlQb0IsYUFBUyxNQUpGO0FBS1BDLG9CQUFnQixRQUxUO0FBTVAxQixjQUFVO0FBTkgsR0F2TGdCO0FBK0x6QndFLGFBQVc7QUFDVHBFLFdBQU8sR0FERTtBQUVUaUIsZ0JBQVksRUFGSDtBQUdUb0QsbUJBQWU7QUFITixHQS9MYztBQW9NekJDLGNBQVk7QUFDVjdDLGNBQVUsRUFEQTtBQUVWVixXQUFPLHFCQUFNLGtCQUFRQyxJQUFkLEVBQW9CWCxJQUFwQixDQUF5QixHQUF6QixDQUZHO0FBR1ZrRSxrQkFBYztBQUhKLEdBcE1hO0FBeU16QkMsU0FBTztBQUNMdkUsWUFBUSxFQURIO0FBRUxELFdBQU8sTUFGRjtBQUdMdUUsa0JBQWMsRUFIVDtBQUlMcEQsaUJBQWEsRUFKUjtBQUtMTSxjQUFVLEVBTEw7QUFNTHRCLHFCQUFpQixrQkFBUUMsV0FOcEI7QUFPTHdCLGtCQUFjLENBUFQ7QUFRTGIsV0FBTyxrQkFBUUMsSUFSVjtBQVNMb0MsWUFBUSxlQUFlLHFCQUFNLGtCQUFRaEQsV0FBZCxFQUEyQmlELE1BQTNCLENBQWtDLEdBQWxDLENBVGxCO0FBVUwsY0FBVTtBQUNSRCxjQUFRLGVBQWUsa0JBQVFuQjtBQUR2QjtBQVZMLEdBek1rQjtBQXVOekJ3QyxpQkFBZTtBQUNiekUsV0FBTyxHQURNO0FBRWIwRSxlQUFXLEdBRkU7QUFHYjlFLGNBQVUsVUFIRztBQUliK0UsWUFBUSxvQkFKSztBQUtiNUUsVUFBTSxtQkFMTztBQU1iNkUsZUFBVyxnQ0FORTtBQU9iaEQsa0JBQWMsQ0FQRDtBQVFiekIscUJBQWlCLGtCQUFRMEIsSUFSWjtBQVNiSyxhQUFTLFdBVEk7QUFVYlQsY0FBVSxFQVZHO0FBV2JsQixlQUFXLG1CQVhFO0FBWWJELGFBQVMsQ0FaSTtBQWFiVCxtQkFBZSxNQWJGO0FBY2JXLGdCQUFZO0FBZEMsR0F2TlU7QUF1T3pCcUUsdUJBQXFCO0FBQ25CdkUsYUFBUyxDQURVO0FBRW5CQyxlQUFXLGVBRlE7QUFHbkJWLG1CQUFlO0FBSEksR0F2T0k7QUE0T3pCaUYsWUFBVTtBQUNSOUUsV0FBTyxDQURDO0FBRVJDLFlBQVEsQ0FGQTtBQUdSTCxjQUFVLFVBSEY7QUFJUkUsU0FBSyxDQUFDLEVBSkU7QUFLUkMsVUFBTSxLQUxFO0FBTVJRLGVBQVcsa0JBTkg7QUFPUndFLGdCQUFZLHdCQVBKO0FBUVJ6QyxpQkFBYSx3QkFSTDtBQVNSRCxrQkFBYyxnQkFBZ0Isa0JBQVFSO0FBVDlCLEdBNU9lO0FBdVB6Qm1ELGFBQVc7QUFDVHZELGNBQVUsRUFERDtBQUVUd0QsZ0JBQVk7QUFGSCxHQXZQYztBQTJQekJDLE9BQUs7QUFDSC9FLHFCQUFpQixrQkFBUThCLFVBRHRCO0FBRUhDLGFBQVMsVUFGTjtBQUdITixrQkFBYyxDQUhYO0FBSUhiLFdBQU8sT0FKSjtBQUtIUixlQUFXLFVBTFI7QUFNSG1CLG1CQUFlLFdBTlo7QUFPSGxCLGdCQUFZLHNCQVBUO0FBUUgsZUFBVztBQUNURCxpQkFBVztBQURGO0FBUlIsR0EzUG9CO0FBdVF6QjRFLFlBQVU7QUFDUnJFLFdBQU8sT0FEQztBQUVSZ0QsZ0JBQVk7QUFGSixHQXZRZTtBQTJRekJzQixnQkFBYztBQUNaakYscUJBQWlCO0FBREwsR0EzUVc7QUE4UXpCa0YsZUFBYTtBQUNYckYsV0FBTyxNQURJO0FBRVg0QixrQkFBYyxDQUZIO0FBR1gzQixZQUFRLEVBSEc7QUFJWHdCLGNBQVUsRUFKQztBQUtYOEIsbUJBQWUsR0FMSjtBQU1YcEQscUJBQWlCLGtCQUFROEIsVUFOZDtBQU9YbEIsV0FBTyxrQkFBUUM7QUFQSixHQTlRWTtBQXVSekJzRSxZQUFVO0FBQ1IxRixjQUFVLFVBREY7QUFFUmUsV0FBTyxFQUZDO0FBR1JiLFNBQUssRUFIRztBQUlSSyxxQkFBaUIsa0JBQVE4QixVQUpqQjtBQUtSQyxhQUFTO0FBTEQsR0F2UmU7QUE4UnpCcUQsY0FBWTtBQUNWM0YsY0FBVSxVQURBO0FBRVZFLFNBQUssS0FGSztBQUdWUyxlQUFXLGtCQUhEO0FBSVZQLFdBQU8sR0FKRztBQUtWeUIsY0FBVSxFQUxBO0FBTVZWLFdBQU8scUJBQU0sa0JBQVFYLFdBQWQsRUFBMkJpRCxNQUEzQixDQUFrQyxHQUFsQyxDQU5HO0FBT1ZVLGVBQVc7QUFQRCxHQTlSYTtBQXVTekJ5QixZQUFVO0FBQ1IvQyxzQkFBa0IsTUFEVjtBQUVSRCxZQUFRO0FBRkEsR0F2U2U7QUEyU3pCaUQsd0JBQXNCO0FBQ3BCN0YsY0FBVSxVQURVO0FBRXBCSSxXQUFPLE1BRmE7QUFHcEJDLFlBQVEsTUFIWTtBQUlwQm9CLGFBQVMsTUFKVztBQUtwQkUsZ0JBQVksUUFMUTtBQU1wQkQsb0JBQWdCLFFBTkk7QUFPcEJuQixxQkFBaUIscUJBQU0sa0JBQVF1RixJQUFkLEVBQW9CckYsSUFBcEIsQ0FBeUIsR0FBekIsQ0FQRztBQVFwQk8sWUFBUTtBQVJZO0FBM1NHLENBQXBCIiwiZmlsZSI6ImRhc2hTaGFyZWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFsZXR0ZSBmcm9tICcuLi9jb21wb25lbnRzL1BhbGV0dGUnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5cbmV4cG9ydCBjb25zdCBEQVNIX1NUWUxFUyA9IHtcbiAgZGFzaExldmVsV3JhcHBlcjoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHBvaW50ZXJFdmVudHM6ICdub25lJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIG92ZXJmbG93OiAnaGlkZGVuJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmZhZGUoMC4wNyksXG4gICAgb3BhY2l0eTogMCxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxLjMpJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDM0MG1zIGVhc2Utb3V0LCBvcGFjaXR5IDE0MG1zIGxpbmVhcidcbiAgfSxcbiAgYXBwZWFyRGFzaExldmVsOiB7XG4gICAgcG9pbnRlckV2ZW50czogJ2FsbCcsXG4gICAgb3BhY2l0eTogMSxcbiAgICB0cmFuc2Zvcm06ICdzY2FsZSgxKSdcbiAgfSxcbiAgZnJhbWU6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IDAsXG4gICAgbGVmdDogMCxcbiAgICByaWdodDogMCxcbiAgICBoZWlnaHQ6IDMyLFxuICAgIHpJbmRleDogMVxuICB9LFxuICBwcm9qZWN0c0Jhcjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBmbG9hdDogJ2xlZnQnLFxuICAgIHdpZHRoOiAzMDAsXG4gICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBwYWRkaW5nVG9wOiAzMFxuICB9LFxuICB0aXRsZVdyYXBwZXI6IHtcbiAgICBwYWRkaW5nTGVmdDogMzIsXG4gICAgcGFkZGluZ1JpZ2h0OiAxOCxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xuICB9LFxuICBwcm9qZWN0c1RpdGxlOiB7XG4gICAgZm9udFNpemU6IDI2LFxuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC4zMyksXG4gICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZSdcbiAgfSxcbiAgYnRuTmV3UHJvamVjdDoge1xuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICB3aWR0aDogMjIsXG4gICAgaGVpZ2h0OiAyMixcbiAgICBtYXJnaW5Ub3A6IC0xLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS0VSX0dSQVlcbiAgICB9XG4gIH0sXG4gIHRvb2x0aXA6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHJpZ2h0OiAnLTEzMnB4JyxcbiAgICBwYWRkaW5nOiAnN3B4IDE2cHgnLFxuICAgIGZvbnRTaXplOiAxMyxcbiAgICBib3JkZXJSYWRpdXM6IDRcbiAgfSxcbiAgYXJyb3dMZWZ0OiB7XG4gICAgd2lkdGg6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIGxlZnQ6IC0xMCxcbiAgICBib3JkZXJUb3A6ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJCb3R0b206ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJSaWdodDogJzEwcHggc29saWQgJyArIFBhbGV0dGUuTElHSFRfUElOS1xuICB9LFxuICBwcm9qZWN0V3JhcHBlcjoge1xuICAgIGhlaWdodDogNTUsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHBhZGRpbmdSaWdodDogMTIsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgICc6aG92ZXInOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IENvbG9yKFBhbGV0dGUuQ09BTCkuZmFkZSgwLjM4KVxuICAgIH1cbiAgfSxcbiAgYWN0aXZlV3JhcHBlcjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMXG4gIH0sXG4gIGFjdGl2ZVByb2plY3Q6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICBsZWZ0OiAwLFxuICAgIHRvcDogMCxcbiAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICB3aWR0aDogNyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfUElOS1xuICB9LFxuICBsb2FkaW5nV3JhcDoge1xuICAgIGhlaWdodDogJ2NhbGMoMTAwJSAtIDExM3B4KScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJ1xuICB9LFxuICBsb2dvOiB7XG4gICAgcGFkZGluZ0xlZnQ6IDMyLFxuICAgIGhlaWdodDogMjUsXG4gICAgb3BhY2l0eTogMC40XG4gIH0sXG4gIGxvZ29BY3RpdmU6IHtcbiAgICBvcGFjaXR5OiAxXG4gIH0sXG4gIHByb2plY3RUaXRsZToge1xuICAgIHBhZGRpbmdMZWZ0OiAxMixcbiAgICBmb250U2l6ZTogMTgsXG4gICAgb3BhY2l0eTogMC43MyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gIH0sXG4gIHByb2plY3RUaXRsZU5ldzoge1xuICAgIHBhZGRpbmdMZWZ0OiAxMixcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gIH0sXG4gIG5ld1Byb2plY3RJbnB1dDoge1xuICAgIGZvbnRTaXplOiAxOCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuRkFUSEVSX0NPQUwsXG4gICAgbWFyZ2luVG9wOiAwLFxuICAgIGhlaWdodDogMzUsXG4gICAgcGFkZGluZ0xlZnQ6IDUsXG4gICAgcGFkZGluZ1JpZ2h0OiA1LFxuICAgIHdpZHRoOiAxOTUsXG4gICAgYm9yZGVyVG9wTGVmdFJhZGl1czogMyxcbiAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAzLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkZBVEhFUl9DT0FMKS5kYXJrZW4oMC40KSxcbiAgICAnOmZvY3VzJzoge1xuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBQYWxldHRlLkxJR0hUX1BJTktcbiAgICB9XG4gIH0sXG4gIG5ld1Byb2plY3RHb0J1dHRvbjoge1xuICAgIHBhZGRpbmdMZWZ0OiAxLFxuICAgIHBhZGRpbmdSaWdodDogMSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIG1hcmdpblRvcDogMCxcbiAgICB3aWR0aDogMzAsXG4gICAgaGVpZ2h0OiAzNSxcbiAgICBmb250U2l6ZTogMTIsXG4gICAgbGV0dGVyU3BhY2luZzogMS4zLFxuICAgIGJvcmRlclRvcFJpZ2h0UmFkaXVzOiAyLFxuICAgIGJvcmRlckJvdHRvbVJpZ2h0UmFkaXVzOiAyLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UsIGJhY2tncm91bmQtY29sb3IgMjAwbXMgZWFzZScsXG4gICAgJzpob3Zlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5QSU5LXG4gICAgfSxcbiAgICAnOmFjdGl2ZSc6IHtcbiAgICAgIHRyYW5zZm9ybTogJ3NjYWxlKC44KSdcbiAgICB9LFxuICAgICc6ZGlzYWJsZWQnOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuREFSS19HUkFZXG4gICAgfVxuICB9LFxuICBhY3RpdmVUaXRsZToge1xuICAgIG9wYWNpdHk6IDFcbiAgfSxcbiAgZGF0ZToge1xuICAgIG1hcmdpbkxlZnQ6ICdhdXRvJyxcbiAgICBvcGFjaXR5OiAwLjYsXG4gICAgdGV4dEFsaWduOiAncmlnaHQnLFxuICAgIGZvbnRTaXplOiAxMCxcbiAgICBsaW5lSGVpZ2h0OiAxLjMsXG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuUk9DSykuZmFkZSgwLjEpXG4gIH0sXG4gIGFjdGl2ZURhdGU6IHtcbiAgICBvcGFjaXR5OiAxXG4gIH0sXG4gIGRhdGVUaXRsZToge1xuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC40OClcbiAgfSxcbiAgZGV0YWlsczoge1xuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgd2lkdGg6ICdjYWxjKDEwMCUgLSAzMDBweCknLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgfSxcbiAgY2VudGVyQ29sOiB7XG4gICAgd2lkdGg6IDQ5MCxcbiAgICBwYWRkaW5nVG9wOiA2OCxcbiAgICBwYWRkaW5nQm90dG9tOiA2OFxuICB9LFxuICBmaWVsZFRpdGxlOiB7XG4gICAgZm9udFNpemU6IDE1LFxuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC4zKSxcbiAgICBtYXJnaW5Cb3R0b206IDRcbiAgfSxcbiAgZmllbGQ6IHtcbiAgICBoZWlnaHQ6IDY5LFxuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgbWFyZ2luQm90dG9tOiAzMCxcbiAgICBwYWRkaW5nTGVmdDogMjUsXG4gICAgZm9udFNpemU6IDMyLFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5GQVRIRVJfQ09BTCxcbiAgICBib3JkZXJSYWRpdXM6IDMsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBib3JkZXI6ICcxcHggc29saWQgJyArIENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmRhcmtlbigwLjQpLFxuICAgICc6Zm9jdXMnOiB7XG4gICAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuTElHSFRfUElOS1xuICAgIH1cbiAgfSxcbiAgZmllbGREaWFsb2d1ZToge1xuICAgIHdpZHRoOiAzNjQsXG4gICAgbWluSGVpZ2h0OiAxMDAsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgYm90dG9tOiAnY2FsYygtMTAwJSAtIDIxcHgpJyxcbiAgICBsZWZ0OiAnY2FsYyg1MCUgLSAxNzdweCknLFxuICAgIGJveFNoYWRvdzogJzAgMTVweCAyNHB4IDAgcmdiYSgwLDAsMCwwLjIxKScsXG4gICAgYm9yZGVyUmFkaXVzOiA0LFxuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5DT0FMLFxuICAgIHBhZGRpbmc6ICcxN3B4IDI2cHgnLFxuICAgIGZvbnRTaXplOiAxNixcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0yNXB4KScsXG4gICAgb3BhY2l0eTogMCxcbiAgICBwb2ludGVyRXZlbnRzOiAnbm9uZScsXG4gICAgdHJhbnNpdGlvbjogJ2FsbCAzMDBtcyBjdWJpYy1iZXppZXIoMC41MSwgMC41NSwgMC4xNywgMS41NSknXG4gIH0sXG4gIGZpZWxkRGlhbG9ndWVBY3RpdmU6IHtcbiAgICBvcGFjaXR5OiAxLFxuICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknLFxuICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJ1xuICB9LFxuICBhcnJvd1RvcDoge1xuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB0b3A6IC0xMCxcbiAgICBsZWZ0OiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpJyxcbiAgICBib3JkZXJMZWZ0OiAnMTBweCBzb2xpZCB0cmFuc3BhcmVudCcsXG4gICAgYm9yZGVyUmlnaHQ6ICcxMHB4IHNvbGlkIHRyYW5zcGFyZW50JyxcbiAgICBib3JkZXJCb3R0b206ICcxMHB4IHNvbGlkICcgKyBQYWxldHRlLkNPQUxcbiAgfSxcbiAgZmllbGRNb25vOiB7XG4gICAgZm9udFNpemU6IDE3LFxuICAgIGZvbnRGYW1pbHk6ICdGaXJhIE1vbm8nXG4gIH0sXG4gIGJ0bjoge1xuICAgIGJhY2tncm91bmRDb2xvcjogUGFsZXR0ZS5MSUdIVF9QSU5LLFxuICAgIHBhZGRpbmc6ICc1cHggMTVweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAyLFxuICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgIHRyYW5zZm9ybTogJ3NjYWxlKDEpJyxcbiAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICB0cmFuc2l0aW9uOiAndHJhbnNmb3JtIDIwMG1zIGVhc2UnLFxuICAgICc6YWN0aXZlJzoge1xuICAgICAgdHJhbnNmb3JtOiAnc2NhbGUoLjgpJ1xuICAgIH1cbiAgfSxcbiAgYnRuUmlnaHQ6IHtcbiAgICBmbG9hdDogJ3JpZ2h0JyxcbiAgICBtYXJnaW5MZWZ0OiA2XG4gIH0sXG4gIGJ0blNlY29uZGFyeToge1xuICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50J1xuICB9LFxuICBlZGl0UHJvamVjdDoge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIGhlaWdodDogNTMsXG4gICAgZm9udFNpemU6IDIyLFxuICAgIGxldHRlclNwYWNpbmc6IDEuNSxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuTElHSFRfUElOSyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLXG4gIH0sXG4gIGJ0bkNsb3NlOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6IDE1LFxuICAgIHRvcDogMTAsXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX1BJTkssXG4gICAgcGFkZGluZzogJzEwcHggMTVweCdcbiAgfSxcbiAgZW1wdHlTdGF0ZToge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzUwJScsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlWSgtNTAlKScsXG4gICAgd2lkdGg6IDQ5MCxcbiAgICBmb250U2l6ZTogNDAsXG4gICAgY29sb3I6IENvbG9yKFBhbGV0dGUuRkFUSEVSX0NPQUwpLmRhcmtlbigwLjIpLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfSxcbiAgbm9TZWxlY3Q6IHtcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgY3Vyc29yOiAnZGVmYXVsdCdcbiAgfSxcbiAgZnVsbFNjcmVlbkNlbnRlcldyYXA6IHtcbiAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJzEwMCUnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkdSQVkpLmZhZGUoMC4xKSxcbiAgICB6SW5kZXg6IDZcbiAgfVxufVxuIl19