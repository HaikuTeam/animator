'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/BranchesDrawer.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _radium = require('radium');

var _radium2 = _interopRequireDefault(_radium);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _Icons = require('./Icons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fauxBranchState = [[false, false, true], [true, true, false], [true, false, false], [false, false, false], [true, false, false], [false, true, true], [false, false, false], [false, false, true], [false, false, false], [true, false, false], [false, false, false], [true, true, false], [false, false, false], [false, true, true], [false, false, false], [true, false, false], [true, true, false]];

var STYLES = {
  container: {
    position: 'relative',
    boxShadow: 'inset -1px 0 0 ' + _Palette2.default.COAL,
    backgroundColor: _Palette2.default.GRAY,
    padding: 0,
    overflowY: 'auto',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
  },
  bar: { // This bar is for grabbing and moving around the application via its 'frame' class
    position: 'absolute',
    right: 0,
    left: 0,
    height: '36px',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  branchCurrent: {
    fontWeight: '400',
    color: _Palette2.default.ROCK,
    padding: '6px 4px 6px 12px',
    backgroundColor: _Palette2.default.COAL,
    borderLeft: '4px solid ' + _Palette2.default.MEDIUM_PINK
  },
  branchBase: {
    width: '100%',
    color: _Palette2.default.ROCK_MUTED,
    padding: '6px 4px 6px 16px',
    fontSize: '13.5px',
    position: 'relative',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: _Palette2.default.COAL
    }
  },
  header: {
    textTransform: 'uppercase',
    margin: '40px 0 10px 0',
    textAlign: 'center'
  },
  branchStateHolster: {
    position: 'absolute',
    right: '1px',
    top: 0,
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  branchStateBtns: {
    marginRight: '5px'
  },
  icon: {
    marginRight: '7px'
  },
  flex: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '15px'
  }
};

var BranchesDrawer = function (_React$Component) {
  _inherits(BranchesDrawer, _React$Component);

  function BranchesDrawer(props) {
    _classCallCheck(this, BranchesDrawer);

    var _this = _possibleConstructorReturn(this, (BranchesDrawer.__proto__ || Object.getPrototypeOf(BranchesDrawer)).call(this, props));

    _this.state = {
      branches: []
    };
    return _this;
  }

  _createClass(BranchesDrawer, [{
    key: 'branchesList',
    value: function branchesList() {
      var _this2 = this;

      var currentBranches = this.state.branches;
      if (!currentBranches || currentBranches.length < 1) {
        return _react2.default.createElement(
          'div',
          { style: STYLES.flex, __source: {
              fileName: _jsxFileName,
              lineNumber: 106
            },
            __self: this
          },
          '//TODO: @taylor Add replacement loader'
        );
      }
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 112
          },
          __self: this
        },
        _lodash2.default.map(currentBranches, function (branch, index) {
          var show = fauxBranchState[index];
          return _react2.default.createElement(
            'div',
            {
              style: [STYLES.branchBase, branch.isCurrent() && STYLES.branchCurrent],
              key: 'branch-' + index, __source: {
                fileName: _jsxFileName,
                lineNumber: 116
              },
              __self: _this2
            },
            _react2.default.createElement(
              'span',
              { style: STYLES.icon, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 119
                },
                __self: _this2
              },
              _react2.default.createElement(_Icons.BranchIconSVG, {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 119
                },
                __self: _this2
              })
            ),
            branch.getName(),
            _react2.default.createElement(
              'span',
              { style: STYLES.branchStateHolster, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 121
                },
                __self: _this2
              },
              show[0] ? _react2.default.createElement(
                'span',
                { style: STYLES.branchStateBtns, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 122
                  },
                  __self: _this2
                },
                _react2.default.createElement(_Icons.EditsIconSVG, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 122
                  },
                  __self: _this2
                })
              ) : null,
              show[1] ? _react2.default.createElement(
                'span',
                { style: STYLES.branchStateBtns, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 123
                  },
                  __self: _this2
                },
                _react2.default.createElement(_Icons.TeammatesIconSVG, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 123
                  },
                  __self: _this2
                })
              ) : null,
              show[2] ? _react2.default.createElement(
                'span',
                { style: STYLES.branchStateBtns, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 124
                  },
                  __self: _this2
                },
                _react2.default.createElement(_Icons.CommentsIconSVG, {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 124
                  },
                  __self: _this2
                })
              ) : null
            )
          );
        })
      );
    }
  }, {
    key: 'branchesLoaded',
    value: function branchesLoaded(branches) {
      this.setState({ branches: branches });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { style: STYLES.container, className: 'layout-box', __source: {
            fileName: _jsxFileName,
            lineNumber: 139
          },
          __self: this
        },
        _react2.default.createElement('div', { style: STYLES.bar, className: 'frame', __source: {
            fileName: _jsxFileName,
            lineNumber: 140
          },
          __self: this
        }),
        _react2.default.createElement(
          'h3',
          { style: STYLES.header, __source: {
              fileName: _jsxFileName,
              lineNumber: 141
            },
            __self: this
          },
          'Branches'
        ),
        this.branchesList()
      );
    }
  }]);

  return BranchesDrawer;
}(_react2.default.Component);

exports.default = (0, _radium2.default)(BranchesDrawer);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL0JyYW5jaGVzRHJhd2VyLmpzIl0sIm5hbWVzIjpbImZhdXhCcmFuY2hTdGF0ZSIsIlNUWUxFUyIsImNvbnRhaW5lciIsInBvc2l0aW9uIiwiYm94U2hhZG93IiwiQ09BTCIsImJhY2tncm91bmRDb2xvciIsIkdSQVkiLCJwYWRkaW5nIiwib3ZlcmZsb3dZIiwidXNlclNlbGVjdCIsIk1velVzZXJTZWxlY3QiLCJXZWJraXRVc2VyU2VsZWN0IiwibXNVc2VyU2VsZWN0IiwiYmFyIiwicmlnaHQiLCJsZWZ0IiwiaGVpZ2h0IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsImJyYW5jaEN1cnJlbnQiLCJmb250V2VpZ2h0IiwiY29sb3IiLCJST0NLIiwiYm9yZGVyTGVmdCIsIk1FRElVTV9QSU5LIiwiYnJhbmNoQmFzZSIsIndpZHRoIiwiUk9DS19NVVRFRCIsImZvbnRTaXplIiwiY3Vyc29yIiwiaGVhZGVyIiwidGV4dFRyYW5zZm9ybSIsIm1hcmdpbiIsInRleHRBbGlnbiIsImJyYW5jaFN0YXRlSG9sc3RlciIsInRvcCIsImJvdHRvbSIsImJyYW5jaFN0YXRlQnRucyIsIm1hcmdpblJpZ2h0IiwiaWNvbiIsImZsZXgiLCJtYXJnaW5Ub3AiLCJCcmFuY2hlc0RyYXdlciIsInByb3BzIiwic3RhdGUiLCJicmFuY2hlcyIsImN1cnJlbnRCcmFuY2hlcyIsImxlbmd0aCIsIm1hcCIsImJyYW5jaCIsImluZGV4Iiwic2hvdyIsImlzQ3VycmVudCIsImdldE5hbWUiLCJzZXRTdGF0ZSIsImJyYW5jaGVzTGlzdCIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7OztBQUVBLElBQU1BLGtCQUFrQixDQUN0QixDQUFDLEtBQUQsRUFBUSxLQUFSLEVBQWUsSUFBZixDQURzQixFQUV0QixDQUFDLElB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QXBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFxQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFyQyxlQUFWLEdBQTZFLElBRmpGO0FBR0ljLG1CQUFLLENBQUwsSUFBVTtBQUFBO0FBQUEsa0JBQU0sT0FBT3BELE9BQU9zQyxlQUFwQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBcUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBckMsZUFBVixHQUE0RTtBQUhoRjtBQUxGLFdBREY7QUFhRCxTQWZBO0FBREgsT0FERjtBQW9CRDs7O21DQUVlUSxRLEVBQVU7QUFDeEIsV0FBS1MsUUFBTCxDQUFjLEVBQUVULGtCQUFGLEVBQWQ7QUFDRDs7OzZCQUVTO0FBQ1IsYUFDRTtBQUFBO0FBQUEsVUFBSyxPQUFPOUMsT0FBT0MsU0FBbkIsRUFBOEIsV0FBVSxZQUF4QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDRSwrQ0FBSyxPQUFPRCxPQUFPYSxHQUFuQixFQUF3QixXQUFVLE9BQWxDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQURGO0FBRUU7QUFBQTtBQUFBLFlBQUksT0FBT2IsT0FBTytCLE1BQWxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FGRjtBQUdHLGFBQUt5QixZQUFMO0FBSEgsT0FERjtBQU9EOzs7O0VBbkQwQixnQkFBTUMsUzs7a0JBc0RwQixzQkFBT2QsY0FBUCxDIiwiZmlsZSI6IkJyYW5jaGVzRHJhd2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IGxvZGFzaCBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgUmFkaXVtIGZyb20gJ3JhZGl1bSdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IEJyYW5jaEljb25TVkcsIENvbW1lbnRzSWNvblNWRywgRWRpdHNJY29uU1ZHLCBUZWFtbWF0ZXNJY29uU1ZHIH0gZnJvbSAnLi9JY29ucydcblxuY29uc3QgZmF1eEJyYW5jaFN0YXRlID0gW1xuICBbZmFsc2UsIGZhbHNlLCB0cnVlXSxcbiAgW3RydWUsIHRydWUsIGZhbHNlXSxcbiAgW3RydWUsIGZhbHNlLCBmYWxzZV0sXG4gIFtmYWxzZSwgZmFsc2UsIGZhbHNlXSxcbiAgW3RydWUsIGZhbHNlLCBmYWxzZV0sXG4gIFtmYWxzZSwgdHJ1ZSwgdHJ1ZV0sXG4gIFtmYWxzZSwgZmFsc2UsIGZhbHNlXSxcbiAgW2ZhbHNlLCBmYWxzZSwgdHJ1ZV0sXG4gIFtmYWxzZSwgZmFsc2UsIGZhbHNlXSxcbiAgW3RydWUsIGZhbHNlLCBmYWxzZV0sXG4gIFtmYWxzZSwgZmFsc2UsIGZhbHNlXSxcbiAgW3RydWUsIHRydWUsIGZhbHNlXSxcbiAgW2ZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuICBbZmFsc2UsIHRydWUsIHRydWVdLFxuICBbZmFsc2UsIGZhbHNlLCBmYWxzZV0sXG4gIFt0cnVlLCBmYWxzZSwgZmFsc2VdLFxuICBbdHJ1ZSwgdHJ1ZSwgZmFsc2VdXG5dXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgYm94U2hhZG93OiAnaW5zZXQgLTFweCAwIDAgJyArIFBhbGV0dGUuQ09BTCxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuR1JBWSxcbiAgICBwYWRkaW5nOiAwLFxuICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgIHVzZXJTZWxlY3Q6ICdub25lJyxcbiAgICBNb3pVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgV2Via2l0VXNlclNlbGVjdDogJ25vbmUnLFxuICAgIG1zVXNlclNlbGVjdDogJ25vbmUnXG4gIH0sXG4gIGJhcjogeyAvLyBUaGlzIGJhciBpcyBmb3IgZ3JhYmJpbmcgYW5kIG1vdmluZyBhcm91bmQgdGhlIGFwcGxpY2F0aW9uIHZpYSBpdHMgJ2ZyYW1lJyBjbGFzc1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHJpZ2h0OiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgaGVpZ2h0OiAnMzZweCcsXG4gICAgcGFkZGluZzogJzZweCcsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnXG4gIH0sXG4gIGJyYW5jaEN1cnJlbnQ6IHtcbiAgICBmb250V2VpZ2h0OiAnNDAwJyxcbiAgICBjb2xvcjogUGFsZXR0ZS5ST0NLLFxuICAgIHBhZGRpbmc6ICc2cHggNHB4IDZweCAxMnB4JyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFBhbGV0dGUuQ09BTCxcbiAgICBib3JkZXJMZWZ0OiBgNHB4IHNvbGlkICR7UGFsZXR0ZS5NRURJVU1fUElOS31gXG4gIH0sXG4gIGJyYW5jaEJhc2U6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0tfTVVURUQsXG4gICAgcGFkZGluZzogJzZweCA0cHggNnB4IDE2cHgnLFxuICAgIGZvbnRTaXplOiAnMTMuNXB4JyxcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAnOmhvdmVyJzoge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUxcbiAgICB9XG4gIH0sXG4gIGhlYWRlcjoge1xuICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgIG1hcmdpbjogJzQwcHggMCAxMHB4IDAnLFxuICAgIHRleHRBbGlnbjogJ2NlbnRlcidcbiAgfSxcbiAgYnJhbmNoU3RhdGVIb2xzdGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6ICcxcHgnLFxuICAgIHRvcDogMCxcbiAgICBib3R0b206IDAsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gIH0sXG4gIGJyYW5jaFN0YXRlQnRuczoge1xuICAgIG1hcmdpblJpZ2h0OiAnNXB4J1xuICB9LFxuICBpY29uOiB7XG4gICAgbWFyZ2luUmlnaHQ6ICc3cHgnXG4gIH0sXG4gIGZsZXg6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLFxuICAgIG1hcmdpblRvcDogJzE1cHgnXG4gIH1cbn1cblxuY2xhc3MgQnJhbmNoZXNEcmF3ZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3RvciAocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcylcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgYnJhbmNoZXM6IFtdXG4gICAgfVxuICB9XG5cbiAgYnJhbmNoZXNMaXN0ICgpIHtcbiAgICBsZXQgY3VycmVudEJyYW5jaGVzID0gdGhpcy5zdGF0ZS5icmFuY2hlc1xuICAgIGlmICghY3VycmVudEJyYW5jaGVzIHx8IGN1cnJlbnRCcmFuY2hlcy5sZW5ndGggPCAxKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IHN0eWxlPXtTVFlMRVMuZmxleH0+XG4gICAgICAgICAgLy9UT0RPOiBAdGF5bG9yIEFkZCByZXBsYWNlbWVudCBsb2FkZXJcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICB7bG9kYXNoLm1hcChjdXJyZW50QnJhbmNoZXMsIChicmFuY2gsIGluZGV4KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc2hvdyA9IGZhdXhCcmFuY2hTdGF0ZVtpbmRleF1cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICBzdHlsZT17W1NUWUxFUy5icmFuY2hCYXNlLCBicmFuY2guaXNDdXJyZW50KCkgJiYgU1RZTEVTLmJyYW5jaEN1cnJlbnRdfVxuICAgICAgICAgICAgICBrZXk9e2BicmFuY2gtJHtpbmRleH1gfT5cbiAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e1NUWUxFUy5pY29ufT48QnJhbmNoSWNvblNWRyAvPjwvc3Bhbj5cbiAgICAgICAgICAgICAge2JyYW5jaC5nZXROYW1lKCl9XG4gICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtTVFlMRVMuYnJhbmNoU3RhdGVIb2xzdGVyfT5cbiAgICAgICAgICAgICAgICB7IHNob3dbMF0gPyA8c3BhbiBzdHlsZT17U1RZTEVTLmJyYW5jaFN0YXRlQnRuc30+PEVkaXRzSWNvblNWRyAvPjwvc3Bhbj4gOiBudWxsIH1cbiAgICAgICAgICAgICAgICB7IHNob3dbMV0gPyA8c3BhbiBzdHlsZT17U1RZTEVTLmJyYW5jaFN0YXRlQnRuc30+PFRlYW1tYXRlc0ljb25TVkcgLz48L3NwYW4+IDogbnVsbCB9XG4gICAgICAgICAgICAgICAgeyBzaG93WzJdID8gPHNwYW4gc3R5bGU9e1NUWUxFUy5icmFuY2hTdGF0ZUJ0bnN9PjxDb21tZW50c0ljb25TVkcgLz48L3NwYW4+IDogbnVsbCB9XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIClcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxuICBicmFuY2hlc0xvYWRlZCAoYnJhbmNoZXMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHsgYnJhbmNoZXMgfSlcbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5jb250YWluZXJ9IGNsYXNzTmFtZT0nbGF5b3V0LWJveCc+XG4gICAgICAgIDxkaXYgc3R5bGU9e1NUWUxFUy5iYXJ9IGNsYXNzTmFtZT0nZnJhbWUnIC8+XG4gICAgICAgIDxoMyBzdHlsZT17U1RZTEVTLmhlYWRlcn0+QnJhbmNoZXM8L2gzPlxuICAgICAgICB7dGhpcy5icmFuY2hlc0xpc3QoKX1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSYWRpdW0oQnJhbmNoZXNEcmF3ZXIpXG4iXX0=