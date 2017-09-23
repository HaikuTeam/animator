'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/components/Tour/Steps/Finish.js';

exports.default = function (_ref) {
  var styles = _ref.styles,
      finish = _ref.finish,
      openLink = _ref.openLink;

  return _react2.default.createElement(
    'div',
    {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 5
      },
      __self: this
    },
    _react2.default.createElement(
      'h2',
      { style: styles.heading, __source: {
          fileName: _jsxFileName,
          lineNumber: 6
        },
        __self: this
      },
      'Thanks for taking the tour!'
    ),
    _react2.default.createElement(
      'div',
      { style: styles.text, __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        },
        __self: this
      },
      'Take it anytime again from the \'Help\' menu. Be sure to check us out at the following links for more help.',
      _react2.default.createElement(
        'div',
        { style: styles.linksWrapper, __source: {
            fileName: _jsxFileName,
            lineNumber: 11
          },
          __self: this
        },
        _react2.default.createElement(
          'a',
          { onClick: openLink, href: 'https://docs.haiku.ai/', style: styles.link, __source: {
              fileName: _jsxFileName,
              lineNumber: 12
            },
            __self: this
          },
          'Haiku Docs'
        ),
        ' ',
        _react2.default.createElement('br', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 12
          },
          __self: this
        }),
        _react2.default.createElement(
          'a',
          { onClick: openLink, href: 'https://haiku-community.slack.com', style: styles.link, __source: {
              fileName: _jsxFileName,
              lineNumber: 13
            },
            __self: this
          },
          'Haiku Slack Community'
        ),
        ' ',
        _react2.default.createElement('br', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 13
          },
          __self: this
        }),
        _react2.default.createElement(
          'a',
          { onClick: openLink, href: 'https://twitter.com/HaikuForTeams', style: styles.link, __source: {
              fileName: _jsxFileName,
              lineNumber: 14
            },
            __self: this
          },
          '@HaikuForTeams'
        ),
        ' ',
        _react2.default.createElement('br', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 14
          },
          __self: this
        }),
        _react2.default.createElement(
          'a',
          { onClick: openLink, href: 'mailto:support@haiku.ai', style: styles.link, __source: {
              fileName: _jsxFileName,
              lineNumber: 15
            },
            __self: this
          },
          'support@haiku.ai'
        ),
        ' ',
        _react2.default.createElement('br', {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 15
          },
          __self: this
        })
      )
    ),
    _react2.default.createElement(
      'button',
      {
        style: styles.btn,
        onClick: function onClick() {
          return finish(true, false);
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 18
        },
        __self: this
      },
      ' Finish'
    )
  );
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9yZWFjdC9jb21wb25lbnRzL1RvdXIvU3RlcHMvRmluaXNoLmpzIl0sIm5hbWVzIjpbInN0eWxlcyIsImZpbmlzaCIsIm9wZW5MaW5rIiwiaGVhZGluZyIsInRleHQiLCJsaW5rc1dyYXBwZXIiLCJsaW5rIiwiYnRuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O2tCQUVlLGdCQUF3QztBQUFBLE1BQTVCQSxNQUE0QixRQUE1QkEsTUFBNEI7QUFBQSxNQUFwQkMsTUFBb0IsUUFBcEJBLE1BQW9CO0FBQUEsTUFBWkMsUUFBWSxRQUFaQSxRQUFZOztBQUNyRCxTQUNFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNFO0FBQUE7QUFBQSxRQUFJLE9BQU9GLE9BQU9HLE9BQWxCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsS0FERjtBQUVFO0FBQUE7QUFBQSxRQUFLLE9BQU9ILE9BQU9JLElBQW5CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSUU7QUFBQTtBQUFBLFVBQUssT0FBT0osT0FBT0ssWUFBbkI7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0U7QUFBQTtBQUFBLFlBQUcsU0FBU0gsUUFBWixFQUFzQixNQUFLLHdCQUEzQixFQUFvRCxPQUFPRixPQUFPTSxJQUFsRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBREY7QUFBQTtBQUN5RjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxVQUR6RjtBQUVFO0FBQUE7QUFBQSxZQUFHLFNBQVNKLFFBQVosRUFBc0IsTUFBSyxtQ0FBM0IsRUFBK0QsT0FBT0YsT0FBT00sSUFBN0U7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUZGO0FBQUE7QUFFK0c7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsVUFGL0c7QUFHRTtBQUFBO0FBQUEsWUFBRyxTQUFTSixRQUFaLEVBQXNCLE1BQUssbUNBQTNCLEVBQStELE9BQU9GLE9BQU9NLElBQTdFO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FIRjtBQUFBO0FBR3dHO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFVBSHhHO0FBSUU7QUFBQTtBQUFBLFlBQUcsU0FBU0osUUFBWixFQUFzQixNQUFLLHlCQUEzQixFQUFxRCxPQUFPRixPQUFPTSxJQUFuRTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFNBSkY7QUFBQTtBQUlnRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUpoRztBQUpGLEtBRkY7QUFhRTtBQUFBO0FBQUE7QUFDRSxlQUFPTixPQUFPTyxHQURoQjtBQUVFLGlCQUFTO0FBQUEsaUJBQU1OLE9BQU8sSUFBUCxFQUFhLEtBQWIsQ0FBTjtBQUFBLFNBRlg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBYkYsR0FERjtBQXFCRCxDOztBQXhCRCIsImZpbGUiOiJGaW5pc2guanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uICh7IHN0eWxlcywgZmluaXNoLCBvcGVuTGluayB9KSB7XG4gIHJldHVybiAoXG4gICAgPGRpdj5cbiAgICAgIDxoMiBzdHlsZT17c3R5bGVzLmhlYWRpbmd9PlRoYW5rcyBmb3IgdGFraW5nIHRoZSB0b3VyITwvaDI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMudGV4dH0+XG4gICAgICAgIFRha2UgaXQgYW55dGltZSBhZ2FpbiBmcm9tIHRoZSAnSGVscCcgbWVudS4gQmUgc3VyZSB0byBjaGVjayB1cyBvdXRcbiAgICAgICAgYXQgdGhlIGZvbGxvd2luZyBsaW5rcyBmb3IgbW9yZSBoZWxwLlxuXG4gICAgICAgIDxkaXYgc3R5bGU9e3N0eWxlcy5saW5rc1dyYXBwZXJ9PlxuICAgICAgICAgIDxhIG9uQ2xpY2s9e29wZW5MaW5rfSBocmVmPSdodHRwczovL2RvY3MuaGFpa3UuYWkvJyBzdHlsZT17c3R5bGVzLmxpbmt9PkhhaWt1IERvY3M8L2E+IDxiciAvPlxuICAgICAgICAgIDxhIG9uQ2xpY2s9e29wZW5MaW5rfSBocmVmPSdodHRwczovL2hhaWt1LWNvbW11bml0eS5zbGFjay5jb20nIHN0eWxlPXtzdHlsZXMubGlua30+SGFpa3UgU2xhY2sgQ29tbXVuaXR5PC9hPiA8YnIgLz5cbiAgICAgICAgICA8YSBvbkNsaWNrPXtvcGVuTGlua30gaHJlZj0naHR0cHM6Ly90d2l0dGVyLmNvbS9IYWlrdUZvclRlYW1zJyBzdHlsZT17c3R5bGVzLmxpbmt9PkBIYWlrdUZvclRlYW1zPC9hPiA8YnIgLz5cbiAgICAgICAgICA8YSBvbkNsaWNrPXtvcGVuTGlua30gaHJlZj0nbWFpbHRvOnN1cHBvcnRAaGFpa3UuYWknIHN0eWxlPXtzdHlsZXMubGlua30+c3VwcG9ydEBoYWlrdS5haTwvYT4gPGJyIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIHN0eWxlPXtzdHlsZXMuYnRufVxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBmaW5pc2godHJ1ZSwgZmFsc2UpfVxuICAgICAgPiBGaW5pc2hcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApXG59XG4iXX0=