'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var _require2 = require('electron'),
    remote = _require2.remote,
    clipboard = _require2.clipboard,
    shell = _require2.shell;

var _require3 = require('haiku-serialization/src/utils/HaikuHomeDir'),
    HOMEDIR_PATH = _require3.HOMEDIR_PATH;

var path = require('path');
var fse = require('haiku-fs-extra');
var moment = require('moment');

// These are declared like this so we can run in headless mode while testing
var Menu = remote && remote.Menu;
var MenuItem = remote && remote.MenuItem;

function niceTimestamp() {
  return moment().format('YYYY-MM-DD-HHmmss');
}

fse.mkdirpSync(HOMEDIR_PATH);

function writeHtmlSnapshot(html, react) {
  fse.mkdirpSync(path.join(HOMEDIR_PATH, 'snapshots'));
  var filename = (react.props.projectName || 'Unknown') + '-' + niceTimestamp() + '.html';
  var filepath = path.join(HOMEDIR_PATH, 'snapshots', filename);
  fse.outputFile(filepath, html, function (err) {
    if (err) return void 0;
    shell.openItem(filepath);
  });
}

var ContextMenu = function (_EventEmitter) {
  _inherits(ContextMenu, _EventEmitter);

  function ContextMenu(window, react) {
    _classCallCheck(this, ContextMenu);

    var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this));

    _this.window = window;

    window.addEventListener('contextmenu', function (event) {
      // Don't show the context menu if our event handler editor is open
      if (react.isPreviewMode() || react.state.isEventHandlerEditorOpen) {
        return void 0;
      }

      event.preventDefault();

      react.setState({
        isAnythingScaling: false,
        isAnythingRotating: false,
        isStageSelected: false,
        isStageNameHovering: false,
        isMouseDown: false,
        isMouseDragging: false
      });

      window.setTimeout(function () {
        _this.show(event, react);
      }, 64);
    }, false);
    return _this;
  }

  _createClass(ContextMenu, [{
    key: 'rebuild',
    value: function rebuild(react) {
      var _this2 = this;

      this._menu = new Menu();

      var selected = react._component._elements.selected.all();
      var top = selected[0];
      var showingPasteAlready = false;
      var showingHtmlSnapshotAlready = false;

      if (top) {
        if (top.node && top.node.attributes) {
          if (top.node.attributes['haiku-title']) {
            this._menu.append(new MenuItem({
              label: top.node.attributes['haiku-title'],
              enabled: false
            }));

            this._menu.append(new MenuItem({ type: 'separator' }));
          }
        }
      }

      this._menu.append(new MenuItem({
        label: react.state.doShowComments ? 'Hide Comments' : 'Show Comments',
        enabled: react.state.comments && react.state.comments.length > 0,
        click: function click(event) {
          _this2.emit('click', react.state.doShowComments ? 'Hide Comments' : 'Show Comments', event);
        }
      }));

      this._menu.append(new MenuItem({
        label: 'Add Comment',
        click: function click(event) {
          _this2.emit('click', 'Add Comment', event);
        }
      }));

      if (top) {
        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Event Listeners',
          click: function click(clickEvent) {
            _this2.emit('click', 'Show Event Listeners', clickEvent, top);
          }
        }));

        if (top.node && top.node.attributes) {
          if (top.node.attributes['source']) {
            this._menu.append(new MenuItem({ type: 'separator' }));

            var source = top.node.attributes['source'];
            var folder = react.props.folder;
            var sketch = source.split(/\.sketch\.contents/)[0].concat('.sketch');

            this._menu.append(new MenuItem({
              label: 'Edit in Sketch',
              enabled: true,
              click: function click(event) {
                shell.openItem(path.join(folder, sketch));
              }
            }));

            // this._menu.append(new MenuItem({
            //   label: 'Edit Source',
            //   enabled: true,
            //   click: (event) => {
            //     shell.openItem(path.join(folder, source))
            //   }
            // }))
          }
        }

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Cut',
          enabled: true,
          click: function click(event) {
            top.cut();
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Copy',
          enabled: true,
          click: function click(event) {
            top.copy();
          }
        }));

        showingPasteAlready = true;

        this._menu.append(new MenuItem({
          label: 'Paste',
          enabled: true,
          click: function click(event) {
            _this2.emit('current-pasteable:request-paste', react.state.mousePositionCurrent);
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Delete',
          enabled: true,
          click: function click(event) {
            top.remove();
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Forward',
          enabled: !top.isAtFront(),
          click: function click(event) {
            top.sendForward();
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Backward',
          enabled: !top.isAtBack(),
          click: function click(event) {
            top.sendBackward();
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Bring to Front',
          enabled: !top.isAtFront(),
          click: function click(event) {
            top.bringToFront();
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Send to Back',
          enabled: !top.isAtBack(),
          click: function click(event) {
            top.sendToBack();
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Copy SVG',
          enabled: true,
          click: function click(event) {
            clipboard.writeText(top.toXMLString());
          }
        }));

        // this._menu.append(new MenuItem({
        //   label: 'Copy JSON',
        //   enabled: true,
        //   click: (event) => {
        //     clipboard.writeText(top.toJSONString())
        //   }
        // }))

        showingHtmlSnapshotAlready = true;

        this._menu.append(new MenuItem({
          label: 'HTML Snapshot',
          enabled: true,
          click: function click(event) {
            react._component._elements.HTMLSnapshot(function (err, html) {
              if (err) return void 0;
              clipboard.writeText(html);
              writeHtmlSnapshot(html, react);
            });
          }
        }));
      }

      if (!showingPasteAlready) {
        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Paste',
          enabled: true,
          click: function click(event) {
            _this2.emit('current-pasteable:request-paste', react.state.mousePositionCurrent);
          }
        }));
      }

      if (!showingHtmlSnapshotAlready) {
        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'HTML Snapshot',
          enabled: true,
          click: function click(event) {
            react._component._elements.HTMLSnapshot(function (err, html) {
              if (err) return void 0;
              clipboard.writeText(html);
              writeHtmlSnapshot(html, react);
            });
          }
        }));
      }
    }
  }, {
    key: 'show',
    value: function show(event, react) {
      this.rebuild(react);
      this._menu.lastX = event.clientX;
      this._menu.lastY = event.clientY;
      this._menu.popup(remote.getCurrentWindow());
    }
  }]);

  return ContextMenu;
}(EventEmitter);

exports.default = ContextMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9tb2RlbHMvQ29udGV4dE1lbnUuanMiXSwibmFtZXMiOlsicmVxdWlyZSIsIkV2ZW50RW1pdHRlciIsInJlbW90ZSIsImNsaXBib2FyZCIsInNoZWxsIiwiSE9NRURJUl9QQVRIIiwicGF0aCIsImZzZSIsIm1vbWVudCIsIk1lbnUiLCJNZW51SXRlbSIsIm5pY2VUaW1lc3RhbXAiLCJmb3JtYXQiLCJta2RpcnBTeW5jIiwid3JpdGVIdG1sU25hcHNob3QiLCJodG1sIiwicmVhY3QiLCJqb2luIiwiZmlsZW5hbWUiLCJwcm9wcyIsInByb2plY3ROYW1lIiwiZmlsZXBhdGgiLCJvdXRwdXRGaWxlIiwiZXJyIiwib3Blbkl0ZW0iLCJDb250ZXh0TWVudSIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsImlzUHJldmlld01vZGUiLCJzdGF0ZSIsImlzRXZlbnRIYW5kbGVyRWRpdG9yT3BlbiIsInByZXZlbnREZWZhdWx0Iiwic2V0U3RhdGUiLCJpc0FueXRoaW5nU2NhbGluZyIsImlzQW55dGhpbmdSb3RhdGluZyIsImlzU3RhZ2VTZWxlY3RlZCIsImlzU3RhZ2VOYW1lSG92ZXJpbmciLCJpc01vdXNlRG93biIsImlzTW91c2VEcmFnZ2luZyIsInNldFRpbWVvdXQiLCJzaG93IiwiX21lbnUiLCJzZWxlY3RlZCIsIl9jb21wb25lbnQiLCJfZWxlbWVudHMiLCJhbGwiLCJ0b3AiLCJzaG93aW5nUGFzdGVBbHJlYWR5Iiwic2hvd2luZ0h0bWxTbmFwc2hvdEFscmVhZHkiLCJub2RlIiwiYXR0cmlidXRlcyIsImFwcGVuZCIsImxhYmVsIiwiZW5hYmxlZCIsInR5cGUiLCJkb1Nob3dDb21tZW50cyIsImNvbW1lbnRzIiwibGVuZ3RoIiwiY2xpY2siLCJlbWl0IiwiY2xpY2tFdmVudCIsInNvdXJjZSIsImZvbGRlciIsInNrZXRjaCIsInNwbGl0IiwiY29uY2F0IiwiY3V0IiwiY29weSIsIm1vdXNlUG9zaXRpb25DdXJyZW50IiwicmVtb3ZlIiwiaXNBdEZyb250Iiwic2VuZEZvcndhcmQiLCJpc0F0QmFjayIsInNlbmRCYWNrd2FyZCIsImJyaW5nVG9Gcm9udCIsInNlbmRUb0JhY2siLCJ3cml0ZVRleHQiLCJ0b1hNTFN0cmluZyIsIkhUTUxTbmFwc2hvdCIsInJlYnVpbGQiLCJsYXN0WCIsImNsaWVudFgiLCJsYXN0WSIsImNsaWVudFkiLCJwb3B1cCIsImdldEN1cnJlbnRXaW5kb3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O2VBQXlCQSxRQUFRLFFBQVIsQztJQUFqQkMsWSxZQUFBQSxZOztnQkFDNkJELFFBQVEsVUFBUixDO0lBQTdCRSxNLGFBQUFBLE07SUFBUUMsUyxhQUFBQSxTO0lBQVdDLEssYUFBQUEsSzs7Z0JBQ0ZKLFFBQVEsNENBQVIsQztJQUFqQkssWSxhQUFBQSxZOztBQUNSLElBQU1DLE9BQU9OLFFBQVEsTUFBUixDQUFiO0FBQ0EsSUFBSU8sTUFBTVAsUUFBUSxnQkFBUixDQUFWO0FBQ0EsSUFBSVEsU0FBU1IsUUFBUSxRQUFSLENBQWI7O0FBRUE7QUFDQSxJQUFNUyxPQUFPUCxVQUFVQSxPQUFPTyxJQUE5QjtBQUNBLElBQU1DLFdBQVdSLFVBQVVBLE9BQU9RLFFBQWxDOztBQUVBLFNBQVNDLGFBQVQsR0FBMEI7QUFDeEIsU0FBT0gsU0FBU0ksTUFBVCxDQUFnQixtQkFBaEIsQ0FBUDtBQUNEOztBQUVETCxJQUFJTSxVQUFKLENBQWVSLFlBQWY7O0FBRUEsU0FBU1MsaUJBQVQsQ0FBNEJDLElBQTVCLEVBQWtDQyxLQUFsQyxFQUF5QztBQUN2Q1QsTUFBSU0sVUFBSixDQUFlUCxLQUFLVyxJQUFMLENBQVVaLFlBQVYsRUFBd0IsV0FBeEIsQ0FBZjtBQUNBLE1BQUlhLFdBQVcsQ0FBQ0YsTUFBTUcsS0FBTixDQUFZQyxXQUFaLElBQTJCLFNBQTVCLElBQXlDLEdBQXpDLEdBQStDVCxlQUEvQyxHQUFpRSxPQUFoRjtBQUNBLE1BQUlVLFdBQVdmLEtBQUtXLElBQUwsQ0FBVVosWUFBVixF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bEI7QUFPRDs7QUFFRCxVQUFJLENBQUNwQiwwQkFBTCxFQUFpQztBQUMvQixhQUFLUCxLQUFMLENBQVdVLE1BQVgsQ0FBa0IsSUFBSTFDLFFBQUosQ0FBYSxFQUFFNkMsTUFBTSxXQUFSLEVBQWIsQ0FBbEI7O0FBRUEsYUFBS2IsS0FBTCxDQUFXVSxNQUFYLENBQWtCLElBQUkxQyxRQUFKLENBQWE7QUFDN0IyQyxpQkFBTyxlQURzQjtBQUU3QkMsbUJBQVMsSUFGb0I7QUFHN0JLLGlCQUFPLGVBQUMvQixLQUFELEVBQVc7QUFDaEJaLGtCQUFNNEIsVUFBTixDQUFpQkMsU0FBakIsQ0FBMkJrQyxZQUEzQixDQUF3QyxVQUFDeEQsR0FBRCxFQUFNUixJQUFOLEVBQWU7QUFDckQsa0JBQUlRLEdBQUosRUFBUyxPQUFPLEtBQU0sQ0FBYjtBQUNUcEIsd0JBQVUwRSxTQUFWLENBQW9COUQsSUFBcEI7QUFDQUQsZ0NBQWtCQyxJQUFsQixFQUF3QkMsS0FBeEI7QUFDRCxhQUpEO0FBS0Q7QUFUNEIsU0FBYixDQUFsQjtBQVdEO0FBQ0Y7Ozt5QkFFS1ksSyxFQUFPWixLLEVBQU87QUFDbEIsV0FBS2dFLE9BQUwsQ0FBYWhFLEtBQWI7QUFDQSxXQUFLMEIsS0FBTCxDQUFXdUMsS0FBWCxHQUFtQnJELE1BQU1zRCxPQUF6QjtBQUNBLFdBQUt4QyxLQUFMLENBQVd5QyxLQUFYLEdBQW1CdkQsTUFBTXdELE9BQXpCO0FBQ0EsV0FBSzFDLEtBQUwsQ0FBVzJDLEtBQVgsQ0FBaUJuRixPQUFPb0YsZ0JBQVAsRUFBakI7QUFDRDs7OztFQWhQc0NyRixZOztrQkFBcEJ3QixXIiwiZmlsZSI6IkNvbnRleHRNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBFdmVudEVtaXR0ZXIgfSA9IHJlcXVpcmUoJ2V2ZW50cycpXG5jb25zdCB7IHJlbW90ZSwgY2xpcGJvYXJkLCBzaGVsbCB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgeyBIT01FRElSX1BBVEggfSA9IHJlcXVpcmUoJ2hhaWt1LXNlcmlhbGl6YXRpb24vc3JjL3V0aWxzL0hhaWt1SG9tZURpcicpXG5jb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG52YXIgZnNlID0gcmVxdWlyZSgnaGFpa3UtZnMtZXh0cmEnKVxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpXG5cbi8vIFRoZXNlIGFyZSBkZWNsYXJlZCBsaWtlIHRoaXMgc28gd2UgY2FuIHJ1biBpbiBoZWFkbGVzcyBtb2RlIHdoaWxlIHRlc3RpbmdcbmNvbnN0IE1lbnUgPSByZW1vdGUgJiYgcmVtb3RlLk1lbnVcbmNvbnN0IE1lbnVJdGVtID0gcmVtb3RlICYmIHJlbW90ZS5NZW51SXRlbVxuXG5mdW5jdGlvbiBuaWNlVGltZXN0YW1wICgpIHtcbiAgcmV0dXJuIG1vbWVudCgpLmZvcm1hdCgnWVlZWS1NTS1ERC1ISG1tc3MnKVxufVxuXG5mc2UubWtkaXJwU3luYyhIT01FRElSX1BBVEgpXG5cbmZ1bmN0aW9uIHdyaXRlSHRtbFNuYXBzaG90IChodG1sLCByZWFjdCkge1xuICBmc2UubWtkaXJwU3luYyhwYXRoLmpvaW4oSE9NRURJUl9QQVRILCAnc25hcHNob3RzJykpXG4gIHZhciBmaWxlbmFtZSA9IChyZWFjdC5wcm9wcy5wcm9qZWN0TmFtZSB8fCAnVW5rbm93bicpICsgJy0nICsgbmljZVRpbWVzdGFtcCgpICsgJy5odG1sJ1xuICB2YXIgZmlsZXBhdGggPSBwYXRoLmpvaW4oSE9NRURJUl9QQVRILCAnc25hcHNob3RzJywgZmlsZW5hbWUpXG4gIGZzZS5vdXRwdXRGaWxlKGZpbGVwYXRoLCBodG1sLCAoZXJyKSA9PiB7XG4gICAgaWYgKGVycikgcmV0dXJuIHZvaWQgKDApXG4gICAgc2hlbGwub3Blbkl0ZW0oZmlsZXBhdGgpXG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRleHRNZW51IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IgKHdpbmRvdywgcmVhY3QpIHtcbiAgICBzdXBlcigpXG5cbiAgICB0aGlzLndpbmRvdyA9IHdpbmRvd1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgKGV2ZW50KSA9PiB7XG4gICAgICAvLyBEb24ndCBzaG93IHRoZSBjb250ZXh0IG1lbnUgaWYgb3VyIGV2ZW50IGhhbmRsZXIgZWRpdG9yIGlzIG9wZW5cbiAgICAgIGlmIChyZWFjdC5pc1ByZXZpZXdNb2RlKCkgfHwgcmVhY3Quc3RhdGUuaXNFdmVudEhhbmRsZXJFZGl0b3JPcGVuKSB7XG4gICAgICAgIHJldHVybiB2b2lkICgwKVxuICAgICAgfVxuXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICAgIHJlYWN0LnNldFN0YXRlKHtcbiAgICAgICAgaXNBbnl0aGluZ1NjYWxpbmc6IGZhbHNlLFxuICAgICAgICBpc0FueXRoaW5nUm90YXRpbmc6IGZhbHNlLFxuICAgICAgICBpc1N0YWdlU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgICBpc1N0YWdlTmFtZUhvdmVyaW5nOiBmYWxzZSxcbiAgICAgICAgaXNNb3VzZURvd246IGZhbHNlLFxuICAgICAgICBpc01vdXNlRHJhZ2dpbmc6IGZhbHNlXG4gICAgICB9KVxuXG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2hvdyhldmVudCwgcmVhY3QpXG4gICAgICB9LCA2NClcbiAgICB9LCBmYWxzZSlcbiAgfVxuXG4gIHJlYnVpbGQgKHJlYWN0KSB7XG4gICAgdGhpcy5fbWVudSA9IG5ldyBNZW51KClcblxuICAgIHZhciBzZWxlY3RlZCA9IHJlYWN0Ll9jb21wb25lbnQuX2VsZW1lbnRzLnNlbGVjdGVkLmFsbCgpXG4gICAgdmFyIHRvcCA9IHNlbGVjdGVkWzBdXG4gICAgdmFyIHNob3dpbmdQYXN0ZUFscmVhZHkgPSBmYWxzZVxuICAgIHZhciBzaG93aW5nSHRtbFNuYXBzaG90QWxyZWFkeSA9IGZhbHNlXG5cbiAgICBpZiAodG9wKSB7XG4gICAgICBpZiAodG9wLm5vZGUgJiYgdG9wLm5vZGUuYXR0cmlidXRlcykge1xuICAgICAgICBpZiAodG9wLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSkge1xuICAgICAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgICAgICBsYWJlbDogdG9wLm5vZGUuYXR0cmlidXRlc1snaGFpa3UtdGl0bGUnXSxcbiAgICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICAgICAgfSkpXG5cbiAgICAgICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oeyB0eXBlOiAnc2VwYXJhdG9yJyB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogKHJlYWN0LnN0YXRlLmRvU2hvd0NvbW1lbnRzKSA/ICdIaWRlIENvbW1lbnRzJyA6ICdTaG93IENvbW1lbnRzJyxcbiAgICAgIGVuYWJsZWQ6IHJlYWN0LnN0YXRlLmNvbW1lbnRzICYmIHJlYWN0LnN0YXRlLmNvbW1lbnRzLmxlbmd0aCA+IDAsXG4gICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnY2xpY2snLCAocmVhY3Quc3RhdGUuZG9TaG93Q29tbWVudHMpID8gJ0hpZGUgQ29tbWVudHMnIDogJ1Nob3cgQ29tbWVudHMnLCBldmVudClcbiAgICAgIH1cbiAgICB9KSlcblxuICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICBsYWJlbDogJ0FkZCBDb21tZW50JyxcbiAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdjbGljaycsICdBZGQgQ29tbWVudCcsIGV2ZW50KVxuICAgICAgfVxuICAgIH0pKVxuXG4gICAgaWYgKHRvcCkge1xuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnRXZlbnQgTGlzdGVuZXJzJyxcbiAgICAgICAgY2xpY2s6IChjbGlja0V2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdjbGljaycsICdTaG93IEV2ZW50IExpc3RlbmVycycsIGNsaWNrRXZlbnQsIHRvcClcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIGlmICh0b3Aubm9kZSAmJiB0b3Aubm9kZS5hdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICh0b3Aubm9kZS5hdHRyaWJ1dGVzWydzb3VyY2UnXSkge1xuICAgICAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IHR5cGU6ICdzZXBhcmF0b3InIH0pKVxuXG4gICAgICAgICAgdmFyIHNvdXJjZSA9IHRvcC5ub2RlLmF0dHJpYnV0ZXNbJ3NvdXJjZSddXG4gICAgICAgICAgdmFyIGZvbGRlciA9IHJlYWN0LnByb3BzLmZvbGRlclxuICAgICAgICAgIHZhciBza2V0Y2ggPSBzb3VyY2Uuc3BsaXQoL1xcLnNrZXRjaFxcLmNvbnRlbnRzLylbMF0uY29uY2F0KCcuc2tldGNoJylcblxuICAgICAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgICAgICBsYWJlbDogJ0VkaXQgaW4gU2tldGNoJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5JdGVtKHBhdGguam9pbihmb2xkZXIsIHNrZXRjaCkpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpXG5cbiAgICAgICAgICAvLyB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICAgIC8vICAgbGFiZWw6ICdFZGl0IFNvdXJjZScsXG4gICAgICAgICAgLy8gICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIC8vICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIC8vICAgICBzaGVsbC5vcGVuSXRlbShwYXRoLmpvaW4oZm9sZGVyLCBzb3VyY2UpKVxuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IHR5cGU6ICdzZXBhcmF0b3InIH0pKVxuXG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ0N1dCcsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0b3AuY3V0KClcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnQ29weScsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0b3AuY29weSgpXG4gICAgICAgIH1cbiAgICAgIH0pKVxuXG4gICAgICBzaG93aW5nUGFzdGVBbHJlYWR5ID0gdHJ1ZVxuXG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ1Bhc3RlJyxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIHJlYWN0LnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50KVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnRGVsZXRlJyxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRvcC5yZW1vdmUoKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnRm9yd2FyZCcsXG4gICAgICAgIGVuYWJsZWQ6ICF0b3AuaXNBdEZyb250KCksXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0b3Auc2VuZEZvcndhcmQoKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdCYWNrd2FyZCcsXG4gICAgICAgIGVuYWJsZWQ6ICF0b3AuaXNBdEJhY2soKSxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRvcC5zZW5kQmFja3dhcmQoKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdCcmluZyB0byBGcm9udCcsXG4gICAgICAgIGVuYWJsZWQ6ICF0b3AuaXNBdEZyb250KCksXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0b3AuYnJpbmdUb0Zyb250KClcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnU2VuZCB0byBCYWNrJyxcbiAgICAgICAgZW5hYmxlZDogIXRvcC5pc0F0QmFjaygpLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdG9wLnNlbmRUb0JhY2soKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnQ29weSBTVkcnLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY2xpcGJvYXJkLndyaXRlVGV4dCh0b3AudG9YTUxTdHJpbmcoKSlcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIC8vIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAvLyAgIGxhYmVsOiAnQ29weSBKU09OJyxcbiAgICAgIC8vICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgIC8vICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgLy8gICAgIGNsaXBib2FyZC53cml0ZVRleHQodG9wLnRvSlNPTlN0cmluZygpKVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9KSlcblxuICAgICAgc2hvd2luZ0h0bWxTbmFwc2hvdEFscmVhZHkgPSB0cnVlXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnSFRNTCBTbmFwc2hvdCcsXG4gICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICByZWFjdC5fY29tcG9uZW50Ll9lbGVtZW50cy5IVE1MU25hcHNob3QoKGVyciwgaHRtbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGVycikgcmV0dXJuIHZvaWQgKDApXG4gICAgICAgICAgICBjbGlwYm9hcmQud3JpdGVUZXh0KGh0bWwpXG4gICAgICAgICAgICB3cml0ZUh0bWxTbmFwc2hvdChodG1sLCByZWFjdClcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9XG5cbiAgICBpZiAoIXNob3dpbmdQYXN0ZUFscmVhZHkpIHtcbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IHR5cGU6ICdzZXBhcmF0b3InIH0pKVxuXG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ1Bhc3RlJyxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY3VycmVudC1wYXN0ZWFibGU6cmVxdWVzdC1wYXN0ZScsIHJlYWN0LnN0YXRlLm1vdXNlUG9zaXRpb25DdXJyZW50KVxuICAgICAgICB9XG4gICAgICB9KSlcbiAgICB9XG5cbiAgICBpZiAoIXNob3dpbmdIdG1sU25hcHNob3RBbHJlYWR5KSB7XG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oeyB0eXBlOiAnc2VwYXJhdG9yJyB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdIVE1MIFNuYXBzaG90JyxcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHJlYWN0Ll9jb21wb25lbnQuX2VsZW1lbnRzLkhUTUxTbmFwc2hvdCgoZXJyLCBodG1sKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gdm9pZCAoMClcbiAgICAgICAgICAgIGNsaXBib2FyZC53cml0ZVRleHQoaHRtbClcbiAgICAgICAgICAgIHdyaXRlSHRtbFNuYXBzaG90KGh0bWwsIHJlYWN0KVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH1cbiAgfVxuXG4gIHNob3cgKGV2ZW50LCByZWFjdCkge1xuICAgIHRoaXMucmVidWlsZChyZWFjdClcbiAgICB0aGlzLl9tZW51Lmxhc3RYID0gZXZlbnQuY2xpZW50WFxuICAgIHRoaXMuX21lbnUubGFzdFkgPSBldmVudC5jbGllbnRZXG4gICAgdGhpcy5fbWVudS5wb3B1cChyZW1vdGUuZ2V0Q3VycmVudFdpbmRvdygpKVxuICB9XG59XG4iXX0=