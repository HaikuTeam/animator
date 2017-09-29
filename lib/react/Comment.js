'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/react/Comment.js';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Comment = function (_React$Component) {
  _inherits(Comment, _React$Component);

  function Comment(props) {
    _classCallCheck(this, Comment);

    var _this = _possibleConstructorReturn(this, (Comment.__proto__ || Object.getPrototypeOf(Comment)).call(this, props));

    _this.state = {
      replyContent: '',
      commentContent: ''
    };
    return _this;
  }

  _createClass(Comment, [{
    key: 'contentDisplay',
    value: function contentDisplay(comment) {
      var _this2 = this;

      if (comment.isEditing) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 16
            },
            __self: this
          },
          _react2.default.createElement('input', {
            type: 'text',
            name: 'commentContent',
            value: this.state.commentContent || '',
            ref: 'commentInput',
            tabIndex: '1',
            style: {
              display: 'block',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: 5,
              width: '100%',
              borderRadius: 2
            },
            onClick: function onClick(clickEvent) {
              clickEvent.preventDefault();
              _this2.refs.commentInput.focus();
            },
            onKeyDown: function onKeyDown(keyDownEvent) {
              if (keyDownEvent.which === 27) {
                // esc
                _this2.props.comment.isEditing = false;
                _this2.props.comment.isOpened = false;
                _this2.props.comment.isCancelled = true;
                _this2.setState({ commentContent: '' });
              }
            },
            onKeyPress: function onKeyPress(keyPressEvent) {
              if (keyPressEvent.which === 13) {
                // enter
                _this2.props.comment.content = _this2.state.commentContent;
                _this2.props.comment.isEditing = false;
                _this2.props.model.save();
                _this2.setState({ commentContent: '' });
              }
            },
            onChange: function onChange(keyEvent) {
              _this2.setState({
                commentContent: keyEvent.target.value
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 17
            },
            __self: this
          })
        );
      } else {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 61
            },
            __self: this
          },
          comment.content
        );
      }
    }
  }, {
    key: 'metaDisplay',
    value: function metaDisplay(comment, topLevel) {
      var _this3 = this;

      var humanTime = void 0;
      if (comment.created) {
        var mom = (0, _moment2.default)(comment.created);
        humanTime = mom.fromNow();
      }
      return _react2.default.createElement(
        'div',
        {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 75
          },
          __self: this
        },
        _react2.default.createElement(
          'span',
          { style: { color: '#999' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 76
            },
            __self: this
          },
          comment.author || 'Anonymous'
        ),
        _react2.default.createElement(
          'span',
          { style: { color: '#999' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 77
            },
            __self: this
          },
          humanTime ? _react2.default.createElement(
            'span',
            {
              __source: {
                fileName: _jsxFileName,
                lineNumber: 80
              },
              __self: this
            },
            _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 81
                },
                __self: this
              },
              '\xA0\xB7\xA0'
            ),
            _react2.default.createElement(
              'span',
              {
                __source: {
                  fileName: _jsxFileName,
                  lineNumber: 82
                },
                __self: this
              },
              humanTime
            )
          ) : ''
        ),
        topLevel ? _react2.default.createElement(
          'span',
          {
            style: {
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              color: '#999'
            },
            onClick: function onClick() {
              comment.isOpened = false;
              _this3.forceUpdate();
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 89
            },
            __self: this
          },
          'close'
        ) : '',
        topLevel && !comment.isEditing && !comment.isReplying ? _react2.default.createElement(
          'span',
          {
            style: {
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              bottom: '10px',
              color: '#f66'
            },
            onClick: function onClick() {
              comment.isOpened = false;
              comment.isArchived = true;
              _this3.props.model.save();
              _this3.forceUpdate();
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 106
            },
            __self: this
          },
          'trash'
        ) : ''
      );
    }
  }, {
    key: 'repliesDisplay',
    value: function repliesDisplay(comment) {
      var _this4 = this;

      if (comment.replies && comment.replies.length > 0) {
        return _react2.default.createElement(
          'div',
          {
            __source: {
              fileName: _jsxFileName,
              lineNumber: 131
            },
            __self: this
          },
          comment.replies.map(function (reply, index) {
            if (reply.isArchived) return '';
            if (!reply.content || reply.content.length < 1) return '';
            return _react2.default.createElement(
              'div',
              { key: 'reply-' + index, style: { marginTop: '10px' }, __source: {
                  fileName: _jsxFileName,
                  lineNumber: 136
                },
                __self: _this4
              },
              _this4.metaDisplay(reply),
              _this4.contentDisplay(reply)
            );
          })
        );
      } else {
        return '';
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this5 = this;

      if (this.props.comment.isArchived) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 150
        },
        __self: this
      });
      if (this.props.comment.isCancelled) return _react2.default.createElement('span', {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 151
        },
        __self: this
      });
      if (!this.props.comment.isOpened) {
        return _react2.default.createElement(
          'span',
          {
            onMouseDown: function onMouseDown(mouseEvent) {
              mouseEvent.stopPropagation();
              mouseEvent.preventDefault();
            },
            onMouseUp: function onMouseUp(mouseEvent) {
              mouseEvent.stopPropagation();
              mouseEvent.preventDefault();
            },
            onClick: function onClick(clickEvent) {
              clickEvent.stopPropagation();
              clickEvent.preventDefault();
              _this5.props.comment.isOpened = true;
              _this5.forceUpdate();
            },
            style: {
              position: 'absolute',
              left: this.props.comment.x || 0,
              top: this.props.comment.y || 0,
              pointerEvents: 'auto',
              width: 50,
              height: 50,
              padding: '11px 10px 10px',
              borderRadius: '50%',
              backgroundColor: '#333',
              color: 'white',
              fontSize: 18,
              textAlign: 'center',
              cursor: 'pointer',
              opacity: 0.8,
              boxShadow: '0px 1px 13px 0px rgba(0,0,0,0.75)'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 154
            },
            __self: this
          },
          this.props.index + 1
        );
      }
      return _react2.default.createElement(
        'span',
        {
          onMouseDown: function onMouseDown(mouseEvent) {
            mouseEvent.stopPropagation();
            mouseEvent.preventDefault();
          },
          onMouseUp: function onMouseUp(mouseEvent) {
            mouseEvent.stopPropagation();
            mouseEvent.preventDefault();
          },
          style: {
            position: 'absolute',
            left: this.props.comment.x || 0,
            top: this.props.comment.y || 0,
            width: this.props.comment.w || 250,
            height: this.props.comment.h || null,
            pointerEvents: 'auto',
            padding: 10,
            borderRadius: 2,
            backgroundColor: '#333',
            color: 'white',
            opacity: 0.8,
            boxShadow: '0px 1px 13px 0px rgba(0,0,0,0.5)',
            overflowX: 'hidden',
            overflowY: 'auto',
            zIndex: 2001
          }, __source: {
            fileName: _jsxFileName,
            lineNumber: 191
          },
          __self: this
        },
        this.metaDisplay(this.props.comment, true),
        this.contentDisplay(this.props.comment),
        this.repliesDisplay(this.props.comment),
        this.props.comment.isReplying ? _react2.default.createElement(
          'span',
          {
            style: {
              display: 'block',
              marginTop: 15
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 222
            },
            __self: this
          },
          _react2.default.createElement('input', {
            type: 'text',
            name: 'replyContent',
            value: this.state.replyContent || '',
            ref: 'replyInput',
            style: {
              display: 'block',
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              padding: 5,
              width: '100%',
              borderRadius: 2
            },
            onKeyPress: function onKeyPress(keyPressEvent) {
              if (keyPressEvent.which === 13) {
                // enter
                _this5.props.model.reply(_this5.props.comment.id, _this5.state.replyContent, {
                  created: Date.now(),
                  author: null // TODO
                });
                _this5.props.model.save();
                _this5.props.comment.isReplying = false;
                _this5.setState({ replyContent: '' });
              }
            },
            onKeyDown: function onKeyDown(keyDownEvent) {
              if (keyDownEvent.which === 27) {
                // esc
                _this5.props.comment.isReplying = false;
                _this5.setState({ replyContent: '' });
              }
            },
            onClick: function onClick() {
              _this5.refs.replyInput.focus();
            },
            onChange: function onChange(keyEvent) {
              _this5.setState({
                replyContent: keyEvent.target.value
              });
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 227
            },
            __self: this
          }),
          _react2.default.createElement(
            'span',
            {
              onClick: function onClick() {
                _this5.props.comment.isReplying = false;
                _this5.forceUpdate();
              },
              style: {
                cursor: 'pointer',
                color: '#999',
                marginTop: 5,
                marginBottom: 20
              }, __source: {
                fileName: _jsxFileName,
                lineNumber: 266
              },
              __self: this
            },
            'cancel'
          )
        ) : this.props.comment.isEditing ? '' : _react2.default.createElement(
          'span',
          {
            onClick: function onClick() {
              _this5.props.comment.isReplying = true;
              _this5.forceUpdate();
            },
            style: {
              display: 'block',
              marginTop: 15,
              marginBottom: 20,
              cursor: 'pointer',
              color: '#999'
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 282
            },
            __self: this
          },
          'reply'
        )
      );
    }
  }]);

  return Comment;
}(_react2.default.Component);

exports.default = Comment;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9Db21tZW50LmpzIl0sIm5hbWVzIjpbIkNvbW1lbnQiLCJwcm9wcyIsInN0YXRlIiwicmVwbHlDb250ZW50IiwiY29tbWVudENvbnRlbnQiLCJjb21tZW50IiwiaXNFZGl0aW5nIiwiZGlzcGxheSIsImJhY2tncm91bmRDb2xvciIsImNvbG9yIiwiYm9yZGVyIiwicGFkZGluZyIsIndpZHRoIiwiYm9yZGVyUmFkaXVzIiwiY2xpY2tFdmVudCIsInByZXZlbnREZWZhdWx0IiwicmVmcyIsImNvbW1lbnRJbnB1dCIsImZvY3VzIiwia2V5RG93bkV2ZW50Iiwid2hpY2giLCJpc09wZW5lZCIsImlzQ2FuY2VsbGVkIiwic2V0U3RhdGUiLCJrZXlQcmVzc0V2ZW50IiwiY29udGVudCIsIm1vZGVsIiwic2F2ZSIsImtleUV2ZW50IiwidGFyZ2V0IiwidmFsdWUiLCJ0b3BMZXZlbCIsImh1bWFuVGltZSIsImNyZWF0ZWQiLCJtb20iLCJmcm9tTm93IiwiYXV0aG9yIiwiY3Vyc29yIiwicG9zaXRpb24iLCJyaWdodCIsImZvcmNlVXBkYXRlIiwiaXNSZXBseWluZyIsImJvdHRvbSIsImlzQXJjaGl2ZWQiLCJyZXBsaWVzIiwibGVuZ3RoIiwibWFwIiwicmVwbHkiLCJpbmRleCIsIm1hcmdpblRvcCIsIm1ldGFEaXNwbGF5IiwiY29udGVudERpc3BsYXkiLCJtb3VzZUV2ZW50Iiwic3RvcFByb3BhZ2F0aW9uIiwibGVmdCIsIngiLCJ0b3AiLCJ5IiwicG9pbnRlckV2ZW50cyIsImhlaWdodCIsImZvbnRTaXplIiwidGV4dEFsaWduIiwib3BhY2l0eSIsImJveFNoYWRvdyIsInciLCJoIiwib3ZlcmZsb3dYIiwib3ZlcmZsb3dZIiwiekluZGV4IiwicmVwbGllc0Rpc3BsYXkiLCJpZCIsIkRhdGUiLCJub3ciLCJyZXBseUlucHV0IiwibWFyZ2luQm90dG9tIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNB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QUFBO0FBQUE7QUFBQSxZQUxBO0FBNENBO0FBQUE7QUFBQTtBQUNFLHVCQUFTLG1CQUFNO0FBQ2IsdUJBQUs3QixLQUFMLENBQVdJLE9BQVgsQ0FBbUJvQyxVQUFuQixHQUFnQyxLQUFoQztBQUNBLHVCQUFLRCxXQUFMO0FBQ0QsZUFKSDtBQUtFLHFCQUFPO0FBQ0xILHdCQUFRLFNBREg7QUFFTDVCLHVCQUFPLE1BRkY7QUFHTHdDLDJCQUFXLENBSE47QUFJTHlCLDhCQUFjO0FBSlQsZUFMVDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBNUNBLFNBREYsR0EyREcsS0FBS3pFLEtBQUwsQ0FBV0ksT0FBWCxDQUFtQkMsU0FBcEIsR0FDRSxFQURGLEdBRUU7QUFBQTtBQUFBO0FBQ0EscUJBQVMsbUJBQU07QUFDYixxQkFBS0wsS0FBTCxDQUFXSSxPQUFYLENBQW1Cb0MsVUFBbkIsR0FBZ0MsSUFBaEM7QUFDQSxxQkFBS0QsV0FBTDtBQUNELGFBSkQ7QUFLQSxtQkFBTztBQUNMakMsdUJBQVMsT0FESjtBQUVMMEMseUJBQVcsRUFGTjtBQUdMeUIsNEJBQWMsRUFIVDtBQUlMckMsc0JBQVEsU0FKSDtBQUtMNUIscUJBQU87QUFMRixhQUxQO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUEzRlIsT0FERjtBQTZHRDs7OztFQXZTa0MsZ0JBQU1rRSxTOztrQkFBdEIzRSxPIiwiZmlsZSI6IkNvbW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yIChwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICByZXBseUNvbnRlbnQ6ICcnLFxuICAgICAgY29tbWVudENvbnRlbnQ6ICcnXG4gICAgfVxuICB9XG5cbiAgY29udGVudERpc3BsYXkgKGNvbW1lbnQpIHtcbiAgICBpZiAoY29tbWVudC5pc0VkaXRpbmcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgbmFtZT0nY29tbWVudENvbnRlbnQnXG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5jb21tZW50Q29udGVudCB8fCAnJ31cbiAgICAgICAgICAgIHJlZj0nY29tbWVudElucHV0J1xuICAgICAgICAgICAgdGFiSW5kZXg9JzEnXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdibGFjaycsXG4gICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICBib3JkZXI6ICdub25lJyxcbiAgICAgICAgICAgICAgcGFkZGluZzogNSxcbiAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAyXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KGNsaWNrRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgY2xpY2tFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICAgIHRoaXMucmVmcy5jb21tZW50SW5wdXQuZm9jdXMoKVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uS2V5RG93bj17KGtleURvd25FdmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoa2V5RG93bkV2ZW50LndoaWNoID09PSAyNykgeyAvLyBlc2NcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNFZGl0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNPcGVuZWQgPSBmYWxzZVxuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudC5pc0NhbmNlbGxlZCA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgY29tbWVudENvbnRlbnQ6ICcnIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbktleVByZXNzPXsoa2V5UHJlc3NFdmVudCkgPT4ge1xuICAgICAgICAgICAgICBpZiAoa2V5UHJlc3NFdmVudC53aGljaCA9PT0gMTMpIHsgLy8gZW50ZXJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuY29udGVudCA9IHRoaXMuc3RhdGUuY29tbWVudENvbnRlbnRcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNFZGl0aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLm1vZGVsLnNhdmUoKVxuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBjb21tZW50Q29udGVudDogJycgfSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIG9uQ2hhbmdlPXsoa2V5RXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgY29tbWVudENvbnRlbnQ6IGtleUV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfX0gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXY+XG4gICAgICAgICAge2NvbW1lbnQuY29udGVudH1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgbWV0YURpc3BsYXkgKGNvbW1lbnQsIHRvcExldmVsKSB7XG4gICAgbGV0IGh1bWFuVGltZVxuICAgIGlmIChjb21tZW50LmNyZWF0ZWQpIHtcbiAgICAgIGxldCBtb20gPSBtb21lbnQoY29tbWVudC5jcmVhdGVkKVxuICAgICAgaHVtYW5UaW1lID0gbW9tLmZyb21Ob3coKVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjOTk5JyB9fT57Y29tbWVudC5hdXRob3IgfHwgJ0Fub255bW91cyd9PC9zcGFuPlxuICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyM5OTknIH19PlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIChodW1hblRpbWUpXG4gICAgICAgICAgICA/IDxzcGFuPlxuICAgICAgICAgICAgICA8c3Bhbj4mbmJzcDsmbWlkZG90OyZuYnNwOzwvc3Bhbj5cbiAgICAgICAgICAgICAgPHNwYW4+e2h1bWFuVGltZX08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA6ICcnXG4gICAgICAgICAgfVxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIHtcbiAgICAgICAgICAodG9wTGV2ZWwpXG4gICAgICAgICAgPyA8c3BhblxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICByaWdodDogJzEwcHgnLFxuICAgICAgICAgICAgICBjb2xvcjogJyM5OTknXG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBjb21tZW50LmlzT3BlbmVkID0gZmFsc2VcbiAgICAgICAgICAgICAgdGhpcy5mb3JjZVVwZGF0ZSgpXG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgICAgICBjbG9zZVxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDogJydcbiAgICAgICAgfVxuICAgICAgICB7XG4gICAgICAgICAgKHRvcExldmVsICYmICFjb21tZW50LmlzRWRpdGluZyAmJiAhY29tbWVudC5pc1JlcGx5aW5nKVxuICAgICAgICAgID8gPHNwYW5cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgICAgcmlnaHQ6ICcxMHB4JyxcbiAgICAgICAgICAgICAgYm90dG9tOiAnMTBweCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2Y2NidcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbW1lbnQuaXNPcGVuZWQgPSBmYWxzZVxuICAgICAgICAgICAgICBjb21tZW50LmlzQXJjaGl2ZWQgPSB0cnVlXG4gICAgICAgICAgICAgIHRoaXMucHJvcHMubW9kZWwuc2F2ZSgpXG4gICAgICAgICAgICAgIHRoaXMuZm9yY2VVcGRhdGUoKVxuICAgICAgICAgICAgfX0+XG4gICAgICAgICAgICAgICAgdHJhc2hcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA6ICcnXG4gICAgICAgIH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHJlcGxpZXNEaXNwbGF5IChjb21tZW50KSB7XG4gICAgaWYgKGNvbW1lbnQucmVwbGllcyAmJiBjb21tZW50LnJlcGxpZXMubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdj5cbiAgICAgICAgICB7Y29tbWVudC5yZXBsaWVzLm1hcCgocmVwbHksIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVwbHkuaXNBcmNoaXZlZCkgcmV0dXJuICcnXG4gICAgICAgICAgICBpZiAoIXJlcGx5LmNvbnRlbnQgfHwgcmVwbHkuY29udGVudC5sZW5ndGggPCAxKSByZXR1cm4gJydcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxkaXYga2V5PXtgcmVwbHktJHtpbmRleH1gfSBzdHlsZT17eyBtYXJnaW5Ub3A6ICcxMHB4JyB9fT5cbiAgICAgICAgICAgICAgICB7dGhpcy5tZXRhRGlzcGxheShyZXBseSl9XG4gICAgICAgICAgICAgICAge3RoaXMuY29udGVudERpc3BsYXkocmVwbHkpfVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIClcbiAgICAgICAgICB9KX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnJ1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlciAoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuY29tbWVudC5pc0FyY2hpdmVkKSByZXR1cm4gPHNwYW4gLz5cbiAgICBpZiAodGhpcy5wcm9wcy5jb21tZW50LmlzQ2FuY2VsbGVkKSByZXR1cm4gPHNwYW4gLz5cbiAgICBpZiAoIXRoaXMucHJvcHMuY29tbWVudC5pc09wZW5lZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICBvbk1vdXNlRG93bj17KG1vdXNlRXZlbnQpID0+IHtcbiAgICAgICAgICAgIG1vdXNlRXZlbnQuc3RvcFByb3BhZ2F0aW9uKClcbiAgICAgICAgICAgIG1vdXNlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICAgIH19XG4gICAgICAgICAgb25Nb3VzZVVwPXsobW91c2VFdmVudCkgPT4ge1xuICAgICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgbW91c2VFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgfX1cbiAgICAgICAgICBvbkNsaWNrPXsoY2xpY2tFdmVudCkgPT4ge1xuICAgICAgICAgICAgY2xpY2tFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgICAgY2xpY2tFdmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNPcGVuZWQgPSB0cnVlXG4gICAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKClcbiAgICAgICAgICB9fVxuICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIGxlZnQ6IHRoaXMucHJvcHMuY29tbWVudC54IHx8IDAsXG4gICAgICAgICAgICB0b3A6IHRoaXMucHJvcHMuY29tbWVudC55IHx8IDAsXG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiAnYXV0bycsXG4gICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICBoZWlnaHQ6IDUwLFxuICAgICAgICAgICAgcGFkZGluZzogJzExcHggMTBweCAxMHB4JyxcbiAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMzMzJyxcbiAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgZm9udFNpemU6IDE4LFxuICAgICAgICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICAgICAgYm94U2hhZG93OiAnMHB4IDFweCAxM3B4IDBweCByZ2JhKDAsMCwwLDAuNzUpJ1xuICAgICAgICAgIH19PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmluZGV4ICsgMX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW5cbiAgICAgICAgb25Nb3VzZURvd249eyhtb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIG1vdXNlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB9fVxuICAgICAgICBvbk1vdXNlVXA9eyhtb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgbW91c2VFdmVudC5zdG9wUHJvcGFnYXRpb24oKVxuICAgICAgICAgIG1vdXNlRXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgICAgICB9fVxuICAgICAgICBzdHlsZT17e1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIGxlZnQ6IHRoaXMucHJvcHMuY29tbWVudC54IHx8IDAsXG4gICAgICAgICAgdG9wOiB0aGlzLnByb3BzLmNvbW1lbnQueSB8fCAwLFxuICAgICAgICAgIHdpZHRoOiB0aGlzLnByb3BzLmNvbW1lbnQudyB8fCAyNTAsXG4gICAgICAgICAgaGVpZ2h0OiB0aGlzLnByb3BzLmNvbW1lbnQuaCB8fCBudWxsLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6ICdhdXRvJyxcbiAgICAgICAgICBwYWRkaW5nOiAxMCxcbiAgICAgICAgICBib3JkZXJSYWRpdXM6IDIsXG4gICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzMzMycsXG4gICAgICAgICAgY29sb3I6ICd3aGl0ZScsXG4gICAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICAgIGJveFNoYWRvdzogJzBweCAxcHggMTNweCAwcHggcmdiYSgwLDAsMCwwLjUpJyxcbiAgICAgICAgICBvdmVyZmxvd1g6ICdoaWRkZW4nLFxuICAgICAgICAgIG92ZXJmbG93WTogJ2F1dG8nLFxuICAgICAgICAgIHpJbmRleDogMjAwMVxuICAgICAgICB9fT5cbiAgICAgICAge3RoaXMubWV0YURpc3BsYXkodGhpcy5wcm9wcy5jb21tZW50LCB0cnVlKX1cbiAgICAgICAge3RoaXMuY29udGVudERpc3BsYXkodGhpcy5wcm9wcy5jb21tZW50KX1cbiAgICAgICAge3RoaXMucmVwbGllc0Rpc3BsYXkodGhpcy5wcm9wcy5jb21tZW50KX1cbiAgICAgICAge1xuICAgICAgICAgICh0aGlzLnByb3BzLmNvbW1lbnQuaXNSZXBseWluZylcbiAgICAgICAgICA/IDxzcGFuXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICBtYXJnaW5Ub3A6IDE1XG4gICAgICAgICAgICB9fT5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICB0eXBlPSd0ZXh0J1xuICAgICAgICAgICAgICBuYW1lPSdyZXBseUNvbnRlbnQnXG4gICAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnJlcGx5Q29udGVudCB8fCAnJ31cbiAgICAgICAgICAgICAgcmVmPSdyZXBseUlucHV0J1xuICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnYmxhY2snLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnd2hpdGUnLFxuICAgICAgICAgICAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDUsXG4gICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM6IDJcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25LZXlQcmVzcz17KGtleVByZXNzRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoa2V5UHJlc3NFdmVudC53aGljaCA9PT0gMTMpIHsgLy8gZW50ZXJcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubW9kZWwucmVwbHkodGhpcy5wcm9wcy5jb21tZW50LmlkLCB0aGlzLnN0YXRlLnJlcGx5Q29udGVudCwge1xuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkOiBEYXRlLm5vdygpLFxuICAgICAgICAgICAgICAgICAgICBhdXRob3I6IG51bGwgLy8gVE9ET1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMubW9kZWwuc2F2ZSgpXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNSZXBseWluZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHlDb250ZW50OiAnJyB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25LZXlEb3duPXsoa2V5RG93bkV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGtleURvd25FdmVudC53aGljaCA9PT0gMjcpIHsgLy8gZXNjXG4gICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNSZXBseWluZyA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgcmVwbHlDb250ZW50OiAnJyB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucmVmcy5yZXBseUlucHV0LmZvY3VzKClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgb25DaGFuZ2U9eyhrZXlFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICAgICAgcmVwbHlDb250ZW50OiBrZXlFdmVudC50YXJnZXQudmFsdWVcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICB9fSAvPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuY29tbWVudC5pc1JlcGx5aW5nID0gZmFsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5OTknLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogNSxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206IDIwXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIGNhbmNlbFxuICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDogKHRoaXMucHJvcHMuY29tbWVudC5pc0VkaXRpbmcpXG4gICAgICAgICAgICA/ICcnXG4gICAgICAgICAgICA6IDxzcGFuXG4gICAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLmNvbW1lbnQuaXNSZXBseWluZyA9IHRydWVcbiAgICAgICAgICAgICAgICB0aGlzLmZvcmNlVXBkYXRlKClcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgICAgIG1hcmdpblRvcDogMTUsXG4gICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAyMCxcbiAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyM5OTknXG4gICAgICAgICAgICAgIH19PlxuICAgICAgICAgICAgICAgIHJlcGx5XG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgfVxuICAgICAgPC9zcGFuPlxuICAgIClcbiAgfVxufVxuIl19