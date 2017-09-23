'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Tooltip.js';

exports.default = function (_ref) {
  var coordinates = _ref.coordinates,
      offset = _ref.offset,
      spotlightRadius = _ref.spotlightRadius,
      display = _ref.display,
      children = _ref.children,
      next = _ref.next,
      finish = _ref.finish,
      stepData = _ref.stepData,
      waitUserAction = _ref.waitUserAction;
  var top = coordinates.top,
      left = coordinates.left;

  var circleDisplay = 'none';
  var positionStyles = STYLES[display.toUpperCase()] || {};
  var spotlightExtraStyles = {};

  if (display !== 'none') {
    // Temporally disable the circle until we figure out placement
    // and design
    // circleDisplay = 'inline-block'
  }

  if (display === 'left') {
    top = top + 10;
    left = coordinates.left - STYLES.circle.width - 20;
  }

  if (display === 'right') {
    top = top + 10;
    left = coordinates.left + 20;
  }

  if (display === 'bottom') {
    top = top + 10;
  }

  if (display === 'top') {
    top = top - 10;
  }

  if (typeof top === 'number') {
    top = top + offset.top;
    left = left + offset.left;
  }

  if (spotlightRadius !== 'default') {
    spotlightExtraStyles.width = spotlightRadius;
    spotlightExtraStyles.height = spotlightRadius;
  }

  return _react2.default.createElement(
    'div',
    { style: Object.assign({ top: top, left: left }, STYLES.container, positionStyles.container), __source: {
        fileName: _jsxFileName,
        lineNumber: 143
      },
      __self: this
    },
    _react2.default.createElement('div', { style: Object.assign({}, STYLES.spotlight, positionStyles.spotlight, spotlightExtraStyles), __source: {
        fileName: _jsxFileName,
        lineNumber: 144
      },
      __self: this
    }),
    _react2.default.createElement(
      'div',
      { style: Object.assign({}, STYLES.circle, { display: circleDisplay }), __source: {
          fileName: _jsxFileName,
          lineNumber: 146
        },
        __self: this
      },
      _react2.default.createElement('div', { style: STYLES.circleInner, __source: {
          fileName: _jsxFileName,
          lineNumber: 147
        },
        __self: this
      })
    ),
    _react2.default.createElement(
      'div',
      { style: Object.assign({}, STYLES.childrenWrapper, positionStyles.children), __source: {
          fileName: _jsxFileName,
          lineNumber: 149
        },
        __self: this
      },
      _react2.default.createElement(
        'div',
        { style: STYLES.children, __source: {
            fileName: _jsxFileName,
            lineNumber: 150
          },
          __self: this
        },
        children,
        stepData.current > 0 && stepData.current < stepData.total && _react2.default.createElement(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', marginTop: 30 }, __source: {
              fileName: _jsxFileName,
              lineNumber: 155
            },
            __self: this
          },
          _react2.default.createElement(
            'button',
            { style: _tourShared.TOUR_STYLES.btnSecondary, onClick: function onClick() {
                return finish(true, true);
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 156
              },
              __self: this
            },
            'Skip Tutorial'
          ),
          _react2.default.createElement(
            'div',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 157
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              { style: { marginRight: 10 }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 158
                },
                __self: this
              },
              stepData.current,
              ' of ',
              stepData.total
            ),
            !waitUserAction && _react2.default.createElement(
              'button',
              { style: _tourShared.TOUR_STYLES.btn, onClick: function onClick() {
                  return next();
                }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 161
                },
                __self: this
              },
              'Next'
            )
          )
        )
      )
    )
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _Palette = require('./Palette');

var _Palette2 = _interopRequireDefault(_Palette);

var _tourShared = require('../styles/tourShared');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STYLES = {
  container: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3
  },
  circle: {
    width: 30,
    height: 30,
    border: '1px solid #49c000',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 20
  },
  circleInner: {
    width: 20,
    height: 20,
    background: '#49c000',
    borderRadius: '50%',
    margin: '4px auto 0'
  },
  childrenWrapper: {
    position: 'absolute',
    minWidth: 340,
    WebkitUserSelect: 'none',
    color: _Palette2.default.ROCK,
    padding: 1,
    borderRadius: 3,
    background: 'linear-gradient(to bottom, rgba(255,221,100,1) 0%, rgba(214,37,99,1) 100%)',
    boxShadow: '0 4px 18px 0 rgba(1,28,33,0.38)'
  },
  children: {
    backgroundColor: _Palette2.default.COAL,
    borderRadius: 3,
    padding: 20
  },
  spotlight: {
    position: 'absolute',
    width: 500,
    height: 500,
    boxShadow: '0 0 0 2560px rgba(0, 0, 0, 0.5), 0 0 20px 0px #000 inset',
    borderRadius: '100%',
    background: 'transparent',
    pointerEvents: 'none'
  }
};

STYLES.TOP = {
  container: {
    flexDirection: 'column-reverse'
  },
  children: {
    bottom: 45
  },
  spotlight: {
    top: -40
  }
};

STYLES.BOTTOM = {
  container: {
    flexDirection: 'column'
  },
  children: {
    top: 45
  },
  spotlight: {
    bottom: -40
  }
};

STYLES.LEFT = {
  container: {
    flexDirection: 'row-reverse'
  },
  children: {
    right: '130%'
  },
  spotlight: {
    left: -40
  }
};

STYLES.RIGHT = {
  container: {
    flexDirection: 'row'
  },
  children: {
    left: '110%'
  },
  spotlight: {
    right: -40
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1Rvb2x0aXAuanMiXSwibmFtZXMiOlsiY29vcmRpbmF0ZXMiLCJvZmZzZXQiLCJzcG90bGlnaHRSYWRpdXMiLCJkaXNwbGF5IiwiY2hpbGRyZW4iLCJuZXh0IiwiZmluaXNoIiwic3RlcERhdGEiLCJ3YWl0VXNlckFjdGlvbiIsInRvcCIsImxlZnQiLCJjaXJjbGVEaXNwbGF5IiwicG9zaXRpb25TdHlsZXMiLCJTVFlMRVMiLCJ0b1VwcGVyQ2FzZSIsInNwb3RsaWdodEV4dHJhU3R5bGVzIiwiY2lyY2xlIiwid2lkdGgiLCJoZWlnaHQiLCJjb250YWluZXIiLCJzcG90bGlnaHQiLCJjaXJjbGVJbm5lciIsImNoaWxkcmVuV3JhcHBlciIsImN1cnJlbnQiLCJ0b3RhbCIsImp1c3RpZnlDb250ZW50IiwibWFyZ2luVG9wIiwiYnRuU2Vjb25kYXJ5IiwibWFyZ2luUmlnaHQiLCJidG4iLCJwb3NpdGlvbiIsImFsaWduSXRlbXMiLCJ6SW5kZXgiLCJib3JkZXIiLCJib3JkZXJSYWRpdXMiLCJiYWNrZ3JvdW5kIiwibWFyZ2luIiwibWluV2lkdGgiLCJXZWJraXRVc2VyU2VsZWN0IiwiY29sb3IiLCJST0NLIiwicGFkZGluZyIsImJveFNoYWRvdyIsImJhY2tncm91bmRDb2xvciIsIkNPQUwiLCJwb2ludGVyRXZlbnRzIiwiVE9QIiwiZmxleERpcmVjdGlvbiIsImJvdHRvbSIsIkJPVFRPTSIsIkxFRlQiLCJyaWdodCIsIlJJR0hUIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O2tCQXFHZSxnQkFBK0c7QUFBQSxNQUFuR0EsV0FBbUcsUUFBbkdBLFdBQW1HO0FBQUEsTUFBdEZDLE1BQXNGLFFBQXRGQSxNQUFzRjtBQUFBLE1BQTlFQyxlQUE4RSxRQUE5RUEsZUFBOEU7QUFBQSxNQUE3REMsT0FBNkQsUUFBN0RBLE9BQTZEO0FBQUEsTUFBcERDLFFBQW9ELFFBQXBEQSxRQUFvRDtBQUFBLE1BQTFDQyxJQUEwQyxRQUEx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QUREO0FBRVRiLFdBQU8sR0FGRTtBQUdUQyxZQUFRLEdBSEM7QUFJVHdCLGVBQVcsMERBSkY7QUFLVFIsa0JBQWMsTUFMTDtBQU1UQyxnQkFBWSxhQU5IO0FBT1RVLG1CQUFlO0FBUE47QUF0Q0UsQ0FBZjs7QUFpREFoQyxPQUFPaUMsR0FBUCxHQUFhO0FBQ1gzQixhQUFXO0FBQ1Q0QixtQkFBZTtBQUROLEdBREE7QUFJWDNDLFlBQVU7QUFDUjRDLFlBQVE7QUFEQSxHQUpDO0FBT1g1QixhQUFXO0FBQ1RYLFNBQUssQ0FBQztBQURHO0FBUEEsQ0FBYjs7QUFZQUksT0FBT29DLE1BQVAsR0FBZ0I7QUFDZDlCLGFBQVc7QUFDVDRCLG1CQUFlO0FBRE4sR0FERztBQUlkM0MsWUFBVTtBQUNSSyxTQUFLO0FBREcsR0FKSTtBQU9kVyxhQUFXO0FBQ1Q0QixZQUFRLENBQUM7QUFEQTtBQVBHLENBQWhCOztBQVlBbkMsT0FBT3FDLElBQVAsR0FBYztBQUNaL0IsYUFBVztBQUNUNEIsbUJBQWU7QUFETixHQURDO0FBSVozQyxZQUFVO0FBQ1IrQyxXQUFPO0FBREMsR0FKRTtBQU9aL0IsYUFBVztBQUNUVixVQUFNLENBQUM7QUFERTtBQVBDLENBQWQ7O0FBWUFHLE9BQU91QyxLQUFQLEdBQWU7QUFDYmpDLGFBQVc7QUFDVDRCLG1CQUFlO0FBRE4sR0FERTtBQUliM0MsWUFBVTtBQUNSTSxVQUFNO0FBREUsR0FKRztBQU9iVSxhQUFXO0FBQ1QrQixXQUFPLENBQUM7QUFEQztBQVBFLENBQWYiLCJmaWxlIjoiVG9vbHRpcC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBQYWxldHRlIGZyb20gJy4vUGFsZXR0ZSdcbmltcG9ydCB7IFRPVVJfU1RZTEVTIH0gZnJvbSAnLi4vc3R5bGVzL3RvdXJTaGFyZWQnXG5cbmNvbnN0IFNUWUxFUyA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICB6SW5kZXg6IDNcbiAgfSxcbiAgY2lyY2xlOiB7XG4gICAgd2lkdGg6IDMwLFxuICAgIGhlaWdodDogMzAsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICM0OWMwMDAnLFxuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgbWFyZ2luUmlnaHQ6IDIwXG4gIH0sXG4gIGNpcmNsZUlubmVyOiB7XG4gICAgd2lkdGg6IDIwLFxuICAgIGhlaWdodDogMjAsXG4gICAgYmFja2dyb3VuZDogJyM0OWMwMDAnLFxuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgbWFyZ2luOiAnNHB4IGF1dG8gMCdcbiAgfSxcbiAgY2hpbGRyZW5XcmFwcGVyOiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgbWluV2lkdGg6IDM0MCxcbiAgICBXZWJraXRVc2VyU2VsZWN0OiAnbm9uZScsXG4gICAgY29sb3I6IFBhbGV0dGUuUk9DSyxcbiAgICBwYWRkaW5nOiAxLFxuICAgIGJvcmRlclJhZGl1czogMyxcbiAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KHRvIGJvdHRvbSwgcmdiYSgyNTUsMjIxLDEwMCwxKSAwJSwgcmdiYSgyMTQsMzcsOTksMSkgMTAwJSknLFxuICAgIGJveFNoYWRvdzogJzAgNHB4IDE4cHggMCByZ2JhKDEsMjgsMzMsMC4zOCknXG4gIH0sXG4gIGNoaWxkcmVuOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkNPQUwsXG4gICAgYm9yZGVyUmFkaXVzOiAzLFxuICAgIHBhZGRpbmc6IDIwXG4gIH0sXG4gIHNwb3RsaWdodDoge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHdpZHRoOiA1MDAsXG4gICAgaGVpZ2h0OiA1MDAsXG4gICAgYm94U2hhZG93OiAnMCAwIDAgMjU2MHB4IHJnYmEoMCwgMCwgMCwgMC41KSwgMCAwIDIwcHggMHB4ICMwMDAgaW5zZXQnLFxuICAgIGJvcmRlclJhZGl1czogJzEwMCUnLFxuICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCcsXG4gICAgcG9pbnRlckV2ZW50czogJ25vbmUnXG4gIH1cbn1cblxuU1RZTEVTLlRPUCA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbi1yZXZlcnNlJ1xuICB9LFxuICBjaGlsZHJlbjoge1xuICAgIGJvdHRvbTogNDVcbiAgfSxcbiAgc3BvdGxpZ2h0OiB7XG4gICAgdG9wOiAtNDBcbiAgfVxufVxuXG5TVFlMRVMuQk9UVE9NID0ge1xuICBjb250YWluZXI6IHtcbiAgICBmbGV4RGlyZWN0aW9uOiAnY29sdW1uJ1xuICB9LFxuICBjaGlsZHJlbjoge1xuICAgIHRvcDogNDVcbiAgfSxcbiAgc3BvdGxpZ2h0OiB7XG4gICAgYm90dG9tOiAtNDBcbiAgfVxufVxuXG5TVFlMRVMuTEVGVCA9IHtcbiAgY29udGFpbmVyOiB7XG4gICAgZmxleERpcmVjdGlvbjogJ3Jvdy1yZXZlcnNlJ1xuICB9LFxuICBjaGlsZHJlbjoge1xuICAgIHJpZ2h0OiAnMTMwJSdcbiAgfSxcbiAgc3BvdGxpZ2h0OiB7XG4gICAgbGVmdDogLTQwXG4gIH1cbn1cblxuU1RZTEVTLlJJR0hUID0ge1xuICBjb250YWluZXI6IHtcbiAgICBmbGV4RGlyZWN0aW9uOiAncm93J1xuICB9LFxuICBjaGlsZHJlbjoge1xuICAgIGxlZnQ6ICcxMTAlJ1xuICB9LFxuICBzcG90bGlnaHQ6IHtcbiAgICByaWdodDogLTQwXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHsgY29vcmRpbmF0ZXMsIG9mZnNldCwgc3BvdGxpZ2h0UmFkaXVzLCBkaXNwbGF5LCBjaGlsZHJlbiwgbmV4dCwgZmluaXNoLCBzdGVwRGF0YSwgd2FpdFVzZXJBY3Rpb24gfSkge1xuICBsZXQgeyB0b3AsIGxlZnQgfSA9IGNvb3JkaW5hdGVzXG4gIGxldCBjaXJjbGVEaXNwbGF5ID0gJ25vbmUnXG4gIGxldCBwb3NpdGlvblN0eWxlcyA9IFNUWUxFU1tkaXNwbGF5LnRvVXBwZXJDYXNlKCldIHx8IHt9XG4gIGxldCBzcG90bGlnaHRFeHRyYVN0eWxlcyA9IHt9XG5cbiAgaWYgKGRpc3BsYXkgIT09ICdub25lJykge1xuICAgIC8vIFRlbXBvcmFsbHkgZGlzYWJsZSB0aGUgY2lyY2xlIHVudGlsIHdlIGZpZ3VyZSBvdXQgcGxhY2VtZW50XG4gICAgLy8gYW5kIGRlc2lnblxuICAgIC8vIGNpcmNsZURpc3BsYXkgPSAnaW5saW5lLWJsb2NrJ1xuICB9XG5cbiAgaWYgKGRpc3BsYXkgPT09ICdsZWZ0Jykge1xuICAgIHRvcCA9IHRvcCArIDEwXG4gICAgbGVmdCA9IGNvb3JkaW5hdGVzLmxlZnQgLSBTVFlMRVMuY2lyY2xlLndpZHRoIC0gMjBcbiAgfVxuXG4gIGlmIChkaXNwbGF5ID09PSAncmlnaHQnKSB7XG4gICAgdG9wID0gdG9wICsgMTBcbiAgICBsZWZ0ID0gY29vcmRpbmF0ZXMubGVmdCArIDIwXG4gIH1cblxuICBpZiAoZGlzcGxheSA9PT0gJ2JvdHRvbScpIHtcbiAgICB0b3AgPSB0b3AgKyAxMFxuICB9XG5cbiAgaWYgKGRpc3BsYXkgPT09ICd0b3AnKSB7XG4gICAgdG9wID0gdG9wIC0gMTBcbiAgfVxuXG4gIGlmICh0eXBlb2YgdG9wID09PSAnbnVtYmVyJykge1xuICAgIHRvcCA9IHRvcCArIG9mZnNldC50b3BcbiAgICBsZWZ0ID0gbGVmdCArIG9mZnNldC5sZWZ0XG4gIH1cblxuICBpZiAoc3BvdGxpZ2h0UmFkaXVzICE9PSAnZGVmYXVsdCcpIHtcbiAgICBzcG90bGlnaHRFeHRyYVN0eWxlcy53aWR0aCA9IHNwb3RsaWdodFJhZGl1c1xuICAgIHNwb3RsaWdodEV4dHJhU3R5bGVzLmhlaWdodCA9IHNwb3RsaWdodFJhZGl1c1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXt7dG9wLCBsZWZ0LCAuLi5TVFlMRVMuY29udGFpbmVyLCAuLi5wb3NpdGlvblN0eWxlcy5jb250YWluZXJ9fT5cbiAgICAgIDxkaXYgc3R5bGU9e3suLi5TVFlMRVMuc3BvdGxpZ2h0LCAuLi5wb3NpdGlvblN0eWxlcy5zcG90bGlnaHQsIC4uLnNwb3RsaWdodEV4dHJhU3R5bGVzfX0gLz5cblxuICAgICAgPGRpdiBzdHlsZT17ey4uLlNUWUxFUy5jaXJjbGUsIGRpc3BsYXk6IGNpcmNsZURpc3BsYXl9fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNpcmNsZUlubmVyfSAvPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IHN0eWxlPXt7Li4uU1RZTEVTLmNoaWxkcmVuV3JhcHBlciwgLi4ucG9zaXRpb25TdHlsZXMuY2hpbGRyZW59fT5cbiAgICAgICAgPGRpdiBzdHlsZT17U1RZTEVTLmNoaWxkcmVufT5cbiAgICAgICAgICB7Y2hpbGRyZW59XG5cbiAgICAgICAgICB7LyogRG9uJ3Qgc2hvdyBidXR0b25zIG9uIHRoZSBmaXJzdCBhbmQgbGFzdCBzbGlkZXMgKi99XG4gICAgICAgICAge3N0ZXBEYXRhLmN1cnJlbnQgPiAwICYmIHN0ZXBEYXRhLmN1cnJlbnQgPCBzdGVwRGF0YS50b3RhbCAmJlxuICAgICAgICAgICAgPGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJywgbWFyZ2luVG9wOiAzMH19PlxuICAgICAgICAgICAgICA8YnV0dG9uIHN0eWxlPXtUT1VSX1NUWUxFUy5idG5TZWNvbmRhcnl9IG9uQ2xpY2s9eygpID0+IGZpbmlzaCh0cnVlLCB0cnVlKX0+U2tpcCBUdXRvcmlhbDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7bWFyZ2luUmlnaHQ6IDEwfX0+e3N0ZXBEYXRhLmN1cnJlbnR9IG9mIHtzdGVwRGF0YS50b3RhbH08L3NwYW4+XG4gICAgICAgICAgICAgICAgey8qIFNob3cgdGhlIG5leHQgYnV0dG9uIGlmIHdlIGFyZW4ndCB3YWl0aW5nIGZvciB1c2VyIGludGVyYWN0aW9uICovfVxuICAgICAgICAgICAgICAgIHshd2FpdFVzZXJBY3Rpb24gJiZcbiAgICAgICAgICAgICAgICAgIDxidXR0b24gc3R5bGU9e1RPVVJfU1RZTEVTLmJ0bn0gb25DbGljaz17KCkgPT4gbmV4dCgpfT5OZXh0PC9idXR0b24+XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIH1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKVxufVxuIl19