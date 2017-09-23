'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('events'),
    EventEmitter = _require.EventEmitter;

var _require2 = require('electron'),
    Menu = _require2.Menu,
    app = _require2.app,
    shell = _require2.shell;

app.setName('Haiku');

var TopMenu = function (_EventEmitter) {
  _inherits(TopMenu, _EventEmitter);

  function TopMenu() {
    _classCallCheck(this, TopMenu);

    return _possibleConstructorReturn(this, (TopMenu.__proto__ || Object.getPrototypeOf(TopMenu)).apply(this, arguments));
  }

  _createClass(TopMenu, [{
    key: 'create',
    value: function create(options) {
      var _this2 = this;

      var developerMenuItems = [
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: !!options.folder,
      //   click: () => {
      //     this.emit('global-menu:open-text-editor')
      //   }
      // },
      {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: !!options.folder,
        click: function click() {
          _this2.emit('global-menu:open-terminal');
        }
      }];

      Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: app.getName(),
        submenu: [{
          label: 'About Haiku',
          click: function click() {
            shell.openExternal('https://www.haiku.ai/');
          }
        }, { type: 'separator' }, {
          label: 'Reload Haiku',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload'
        }, {
          label: 'Minimize Haiku',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        }, {
          label: 'Hide Haiku',
          accelerator: 'CmdOrCtrl+H',
          role: 'hide'
        }, { type: 'separator' }, {
          label: 'Quit Haiku',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit'
        }]
      }, {
        label: 'Project',
        submenu: [{
          label: 'Publish',
          accelerator: 'CmdOrCtrl+S',
          enabled: !options.isSaving,
          click: function click() {
            _this2.emit('global-menu:save');
          }
        }]
      }, {
        label: 'Edit',
        submenu: [{
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          enabled: !options.isSaving && options.undoables.length > 1, // Idiosyncracy: If there is one 'undoable', that is actually the bottommost commit which can't be undone... :P
          click: function click() {
            _this2.emit('global-menu:undo', options.undoables);
          }
        }, {
          label: 'Redo',
          accelerator: 'CmdOrCtrl+Shift+Z',
          enabled: !options.isSaving && options.redoables.length > 0,
          click: function click() {
            _this2.emit('global-menu:redo', options.redoables);
          }
        }, { type: 'separator' }, {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut'
        }, {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy'
        }, {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste'
        }, { type: 'separator' }, {
          label: 'Delete',
          accelerator: 'Delete',
          role: 'delete'
        }]
      },
      // {
      //   label: 'Insert',
      //   submenu: [
      //     {
      //       label: 'Shape',
      //       submenu: [
      //         {
      //           label: 'Rectangle',
      //           accelerator: 'R',
      //           enabled: !!options.folder,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Rectangle'])
      //         },
      //         {
      //           label: 'Oval',
      //           accelerator: 'O',
      //           enabled: !!options.folder,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Oval'])
      //         }
      //       ]
      //     },
      //     {
      //       label: 'Vector',
      //       accelerator: 'V',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['pen'])
      //     },
      //     {
      //       label: 'Brush',
      //       accelerator: 'B',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['brush'])
      //     },
      //     { type: 'separator' },
      //     {
      //       label: 'Text',
      //       accelerator: 'T',
      //       enabled: !!options.folder,
      //       click: () => this.emit('global-menu:set-tool', ['text'])
      //     }
      //   ]
      // },
      {
        label: 'View',
        submenu: [{
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          enabled: true,
          click: function click() {
            _this2.emit('global-menu:zoom-in');
          }
        }, {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
          enabled: true,
          click: function click() {
            _this2.emit('global-menu:zoom-out');
          }
        }]
      }, {
        label: 'Developer',
        submenu: developerMenuItems
      }, {
        label: 'Help',
        submenu: [{
          label: 'Docs',
          click: function click() {
            shell.openExternal('https://docs.haiku.ai/');
          }
        }, {
          label: 'Take Tour',
          click: function click() {
            _this2.emit('global-menu:start-tour');
          }
        }, { type: 'separator' }, {
          label: 'Haiku Community on Slack',
          click: function click() {
            shell.openExternal('https://haiku-community.slack.com/');
          }
        }]
      }]));
      return this;
    }
  }]);

  return TopMenu;
}(EventEmitter);

module.exports = TopMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJNZW51IiwiYXBwIiwic2hlbGwiLCJzZXROYW1lIiwiVG9wTWVudSIsIm9wdGlvbnMiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImZvbGRlciIsImNsaWNrIiwiZW1pdCIsInNldEFwcGxpY2F0aW9uTWVudSIsImJ1aWxkRnJvbVRlbXBsYXRlIiwiZ2V0TmFtZSIsInN1Ym1lbnUiLCJvcGVuRXh0ZXJuYWwiLCJ0eXBlIiwicm9sZSIsImlzU2F2aW5nIiwidW5kb2FibGVzIiwibGVuZ3RoIiwicmVkb2FibGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ3FCRCxRQUFRLFVBQVIsQztJQUFyQkUsSSxhQUFBQSxJO0lBQU1DLEcsYUFBQUEsRztJQUFLQyxLLGFBQUFBLEs7O0FBQ25CRCxJQUFJRSxPQUFKLENBQVksT0FBWjs7SUFFTUMsTzs7Ozs7Ozs7Ozs7MkJBQ0lDLE8sRUFBUztBQUFBOztBQUNmLFVBQUlDLHFCQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRUMsZUFBTyxrQkFEVDtBQUVFQyxxQkFBYSxvQkFGZjtBQUdFQyxpQkFBUyxDQUFDLENBQUNKLFFBQVFLLE1BSHJCO0FBSUVDLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkFaLFdBQUthLGtCQUFMLENBQXdCYixLQUFLYyxpQkFBTCxDQUF1QixDQUM3QztBQUNFUCxlQUFPTixJQUFJYyxPQUFKLEVBRFQ7QUFFRUMsaUJBQVMsQ0FDUDtBQUNFVCxpQkFBTyxhQURUO0FBRUVJLGlCQUFPLGlCQUFNO0FBQ1hULGtCQUFN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QUFTVjtBQUZYLE9BeEo2QyxFQTRKN0M7QUFDRUMsZUFBTyxNQURUO0FBRUVTLGlCQUFTLENBQ1A7QUFDRVQsaUJBQU8sTUFEVDtBQUVFSSxpQkFBTyxpQkFBTTtBQUNYVCxrQkFBTWUsWUFBTixDQUFtQix3QkFBbkI7QUFDRDtBQUpILFNBRE8sRUFPUDtBQUNFVixpQkFBTyxXQURUO0FBRUVJLGlCQUFPLGlCQUFNO0FBQ1gsbUJBQUtDLElBQUwsQ0FBVSx3QkFBVjtBQUNEO0FBSkgsU0FQTyxFQWFQLEVBQUVNLE1BQU0sV0FBUixFQWJPLEVBY1A7QUFDRVgsaUJBQU8sMEJBRFQ7QUFFRUksaUJBQU8saUJBQU07QUFDWFQsa0JBQU1lLFlBQU4sQ0FBbUIsb0NBQW5CO0FBQ0Q7QUFKSCxTQWRPO0FBRlgsT0E1SjZDLENBQXZCLENBQXhCO0FBcUxBLGFBQU8sSUFBUDtBQUNEOzs7O0VBM01tQmxCLFk7O0FBOE10QnlCLE9BQU9DLE9BQVAsR0FBaUJyQixPQUFqQiIsImZpbGUiOiJUb3BNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBFdmVudEVtaXR0ZXIgfSA9IHJlcXVpcmUoJ2V2ZW50cycpXG5jb25zdCB7IE1lbnUsIGFwcCwgc2hlbGwgfSA9IHJlcXVpcmUoJ2VsZWN0cm9uJylcbmFwcC5zZXROYW1lKCdIYWlrdScpXG5cbmNsYXNzIFRvcE1lbnUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjcmVhdGUgKG9wdGlvbnMpIHtcbiAgICB2YXIgZGV2ZWxvcGVyTWVudUl0ZW1zID0gW1xuICAgICAgLy8ge1xuICAgICAgLy8gICBsYWJlbDogJ09wZW4gaW4gVGV4dCBFZGl0b3InLFxuICAgICAgLy8gICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtPcHRpb24rRScsXG4gICAgICAvLyAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAvLyAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpvcGVuLXRleHQtZWRpdG9yJylcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdPcGVuIGluIFRlcm1pbmFsJyxcbiAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK1QnLFxuICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXJtaW5hbCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG5cbiAgICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGFwcC5nZXROYW1lKCksXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0Fib3V0IEhhaWt1JyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1JlbG9hZCBIYWlrdScsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtSJyxcbiAgICAgICAgICAgIHJvbGU6ICdyZWxvYWQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ01pbmltaXplIEhhaWt1JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLFxuICAgICAgICAgICAgcm9sZTogJ21pbmltaXplJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdIaWRlIEhhaWt1JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0gnLFxuICAgICAgICAgICAgcm9sZTogJ2hpZGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdRdWl0IEhhaWt1JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1EnLFxuICAgICAgICAgICAgcm9sZTogJ3F1aXQnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1Byb2plY3QnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdQdWJsaXNoJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1MnLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNhdmUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFZGl0JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVW5kbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMudW5kb2FibGVzLmxlbmd0aCA+IDEsIC8vIElkaW9zeW5jcmFjeTogSWYgdGhlcmUgaXMgb25lICd1bmRvYWJsZScsIHRoYXQgaXMgYWN0dWFsbHkgdGhlIGJvdHRvbW1vc3QgY29tbWl0IHdoaWNoIGNhbid0IGJlIHVuZG9uZS4uLiA6UFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp1bmRvJywgb3B0aW9ucy51bmRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1JlZG8nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrU2hpZnQrWicsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyAmJiBvcHRpb25zLnJlZG9hYmxlcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpyZWRvJywgb3B0aW9ucy5yZWRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDdXQnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXG4gICAgICAgICAgICByb2xlOiAnY3V0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDb3B5JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxuICAgICAgICAgICAgcm9sZTogJ2NvcHknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Bhc3RlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxuICAgICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIHJvbGU6ICdkZWxldGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8ge1xuICAgICAgLy8gICBsYWJlbDogJ0luc2VydCcsXG4gICAgICAvLyAgIHN1Ym1lbnU6IFtcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1NoYXBlJyxcbiAgICAgIC8vICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgIC8vICAgICAgICAge1xuICAgICAgLy8gICAgICAgICAgIGxhYmVsOiAnUmVjdGFuZ2xlJyxcbiAgICAgIC8vICAgICAgICAgICBhY2NlbGVyYXRvcjogJ1InLFxuICAgICAgLy8gICAgICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3NoYXBlJywgJ1JlY3RhbmdsZSddKVxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdPdmFsJyxcbiAgICAgIC8vICAgICAgICAgICBhY2NlbGVyYXRvcjogJ08nLFxuICAgICAgLy8gICAgICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3NoYXBlJywgJ092YWwnXSlcbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgICAgXVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdWZWN0b3InLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdWJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsncGVuJ10pXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ0JydXNoJyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnQicsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ2JydXNoJ10pXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdUZXh0JyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnVCcsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3RleHQnXSlcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIF1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnVmlldycsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1pvb20gSW4nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUGx1cycsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp6b29tLWluJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBPdXQnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrLScsIC8vIG5vdCAnTWludXMnIDovXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp6b29tLW91dCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0RldmVsb3BlcicsXG4gICAgICAgIHN1Ym1lbnU6IGRldmVsb3Blck1lbnVJdGVtc1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdIZWxwJyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRG9jcycsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vZG9jcy5oYWlrdS5haS8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdUYWtlIFRvdXInLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzdGFydC10b3VyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0hhaWt1IENvbW11bml0eSBvbiBTbGFjaycsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vaGFpa3UtY29tbXVuaXR5LnNsYWNrLmNvbS8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0pKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb3BNZW51XG4iXX0=