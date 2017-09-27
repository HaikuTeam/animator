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

      var mainMenuPieces = [];

      mainMenuPieces.push({
        label: 'About Haiku',
        click: function click() {
          shell.openExternal('https://www.haiku.ai/');
        }
      });
      mainMenuPieces.push({
        type: 'separator'
      });

      if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
        mainMenuPieces.push({
          label: 'Reload Haiku',
          accelerator: 'CmdOrCtrl+R',
          role: 'reload'
        });
      }

      mainMenuPieces.push({
        label: 'Minimize Haiku',
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize'
      });
      mainMenuPieces.push({
        label: 'Hide Haiku',
        accelerator: 'CmdOrCtrl+H',
        role: 'hide'
      });
      mainMenuPieces.push({
        type: 'separator'
      });
      mainMenuPieces.push({
        label: 'Quit Haiku',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      });

      Menu.setApplicationMenu(Menu.buildFromTemplate([{
        label: app.getName(),
        submenu: mainMenuPieces
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
          enabled: !!options.projectList.find(function (project) {
            return project.projectName === 'CheckTutorial';
          }),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJNZW51IiwiYXBwIiwic2hlbGwiLCJzZXROYW1lIiwiVG9wTWVudSIsIm9wdGlvbnMiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImZvbGRlciIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwic2V0QXBwbGljYXRpb25NZW51IiwiYnVpbGRGcm9tVGVtcGxhdGUiLCJnZXROYW1lIiwic3VibWVudSIsImlzU2F2aW5nIiwidW5kb2FibGVzIiwibGVuZ3RoIiwicmVkb2FibGVzIiwicHJvamVjdExpc3QiLCJmaW5kIiwicHJvamVjdCIsInByb2plY3ROYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ3FCRCxRQUFRLFVBQVIsQztJQUFyQkUsSSxhQUFBQSxJO0lBQU1DLEcsYUFBQUEsRztJQUFLQyxLLGFBQUFBLEs7O0FBQ25CRCxJQUFJRSxPQUFKLENBQVksT0FBWjs7SUFFTUMsTzs7Ozs7Ozs7Ozs7MkJBQ0lDLE8sRUFBUztBQUFBOztBQUNmLFVBQUlDLHFCQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRUMsZUFBTyxrQkFEVDtBQUVFQyxxQkFBYSxvQkFGZjtBQUdFQyxpQkFBUyxDQUFDLENBQUNKLFFBQVFLLE1BSHJCO0FBSUVDLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixD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QyxPQUFQLEdBQWlCOUIsT0FBakIiLCJmaWxlIjoiVG9wTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgeyBNZW51LCBhcHAsIHNoZWxsIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5hcHAuc2V0TmFtZSgnSGFpa3UnKVxuXG5jbGFzcyBUb3BNZW51IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY3JlYXRlIChvcHRpb25zKSB7XG4gICAgdmFyIGRldmVsb3Blck1lbnVJdGVtcyA9IFtcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdPcGVuIGluIFRleHQgRWRpdG9yJyxcbiAgICAgIC8vICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK0UnLFxuICAgICAgLy8gICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICBjbGljazogKCkgPT4ge1xuICAgICAgLy8gICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXh0LWVkaXRvcicpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnT3BlbiBpbiBUZXJtaW5hbCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitUJyxcbiAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgbWFpbk1lbnVQaWVjZXMgPSBbXVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0Fib3V0IEhhaWt1JyxcbiAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvJylcbiAgICAgIH1cbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdzdGFnaW5nJykge1xuICAgICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAnUmVsb2FkIEhhaWt1JyxcbiAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUicsXG4gICAgICAgIHJvbGU6ICdyZWxvYWQnXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdNaW5pbWl6ZSBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtNJyxcbiAgICAgIHJvbGU6ICdtaW5pbWl6ZSdcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdIaWRlIEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0gnLFxuICAgICAgcm9sZTogJ2hpZGUnXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzZXBhcmF0b3InXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnUXVpdCBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtRJyxcbiAgICAgIHJvbGU6ICdxdWl0J1xuICAgIH0pXG5cbiAgICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGFwcC5nZXROYW1lKCksXG4gICAgICAgIHN1Ym1lbnU6IG1haW5NZW51UGllY2VzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1Byb2plY3QnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdQdWJsaXNoJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1MnLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNhdmUnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFZGl0JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVW5kbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMudW5kb2FibGVzLmxlbmd0aCA+IDEsIC8vIElkaW9zeW5jcmFjeTogSWYgdGhlcmUgaXMgb25lICd1bmRvYWJsZScsIHRoYXQgaXMgYWN0dWFsbHkgdGhlIGJvdHRvbW1vc3QgY29tbWl0IHdoaWNoIGNhbid0IGJlIHVuZG9uZS4uLiA6UFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp1bmRvJywgb3B0aW9ucy51bmRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1JlZG8nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrU2hpZnQrWicsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyAmJiBvcHRpb25zLnJlZG9hYmxlcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpyZWRvJywgb3B0aW9ucy5yZWRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDdXQnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXG4gICAgICAgICAgICByb2xlOiAnY3V0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDb3B5JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxuICAgICAgICAgICAgcm9sZTogJ2NvcHknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Bhc3RlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxuICAgICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIHJvbGU6ICdkZWxldGUnXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgLy8ge1xuICAgICAgLy8gICBsYWJlbDogJ0luc2VydCcsXG4gICAgICAvLyAgIHN1Ym1lbnU6IFtcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1NoYXBlJyxcbiAgICAgIC8vICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgIC8vICAgICAgICAge1xuICAgICAgLy8gICAgICAgICAgIGxhYmVsOiAnUmVjdGFuZ2xlJyxcbiAgICAgIC8vICAgICAgICAgICBhY2NlbGVyYXRvcjogJ1InLFxuICAgICAgLy8gICAgICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3NoYXBlJywgJ1JlY3RhbmdsZSddKVxuICAgICAgLy8gICAgICAgICB9LFxuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdPdmFsJyxcbiAgICAgIC8vICAgICAgICAgICBhY2NlbGVyYXRvcjogJ08nLFxuICAgICAgLy8gICAgICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3NoYXBlJywgJ092YWwnXSlcbiAgICAgIC8vICAgICAgICAgfVxuICAgICAgLy8gICAgICAgXVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdWZWN0b3InLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdWJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsncGVuJ10pXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ0JydXNoJyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnQicsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ2JydXNoJ10pXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdUZXh0JyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnVCcsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3RleHQnXSlcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIF1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnVmlldycsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1pvb20gSW4nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUGx1cycsXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp6b29tLWluJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBPdXQnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrLScsIC8vIG5vdCAnTWludXMnIDovXG4gICAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp6b29tLW91dCcpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0RldmVsb3BlcicsXG4gICAgICAgIHN1Ym1lbnU6IGRldmVsb3Blck1lbnVJdGVtc1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdIZWxwJyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRG9jcycsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vZG9jcy5oYWlrdS5haS8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdUYWtlIFRvdXInLFxuICAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLnByb2plY3RMaXN0LmZpbmQocHJvamVjdCA9PiBwcm9qZWN0LnByb2plY3ROYW1lID09PSAnQ2hlY2tUdXRvcmlhbCcpLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzdGFydC10b3VyJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0hhaWt1IENvbW11bml0eSBvbiBTbGFjaycsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vaGFpa3UtY29tbXVuaXR5LnNsYWNrLmNvbS8nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF0pKVxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb3BNZW51XG4iXX0=