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
        label: 'Check for updates',
        click: function click() {
          _this2.emit('global-menu:check-updates');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJNZW51IiwiYXBwIiwic2hlbGwiLCJzZXROYW1lIiwiVG9wTWVudSIsIm9wdGlvbnMiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImZvbGRlciIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwic2V0QXBwbGljYXRpb25NZW51IiwiYnVpbGRGcm9tVGVtcGxhdGUiLCJnZXROYW1lIiwic3VibWVudSIsImlzU2F2aW5nIiwidW5kb2FibGVzIiwibGVuZ3RoIiwicmVkb2FibGVzIiwicHJvamVjdExpc3QiLCJmaW5kIiwicHJvamVjdCIsInByb2plY3ROYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ3FCRCxRQUFRLFVBQVIsQztJQUFyQkUsSSxhQUFBQSxJO0lBQU1DLEcsYUFBQUEsRztJQUFLQyxLLGFBQUFBLEs7O0FBQ25CRCxJQUFJRSxPQUFKLENBQVksT0FBWjs7SUFFTUMsTzs7Ozs7Ozs7Ozs7MkJBQ0lDLE8sRUFBUztBQUFBOztBQUNmLFVBQUlDLHFCQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRUMsZUFBTyxrQkFEVDtBQUVFQyxxQkFBYSxvQkFGZjtBQUdFQyxpQkFBUyxDQUFDLENBQUNKLFFBQVFLLE1BSHJCO0FBSUVDLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixD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QUFOLENBQW1CLG9DQUFuQjtBQUNEO0FBSkgsU0FmTztBQUZYLE9BL0g2QyxDQUF2QixDQUF4QjtBQXlKQSxhQUFPLElBQVA7QUFDRDs7OztFQTVObUJoQixZOztBQStOdEJrQyxPQUFPQyxPQUFQLEdBQWlCOUIsT0FBakIiLCJmaWxlIjoiVG9wTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgeyBNZW51LCBhcHAsIHNoZWxsIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5hcHAuc2V0TmFtZSgnSGFpa3UnKVxuXG5jbGFzcyBUb3BNZW51IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY3JlYXRlIChvcHRpb25zKSB7XG4gICAgdmFyIGRldmVsb3Blck1lbnVJdGVtcyA9IFtcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdPcGVuIGluIFRleHQgRWRpdG9yJyxcbiAgICAgIC8vICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK0UnLFxuICAgICAgLy8gICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICBjbGljazogKCkgPT4ge1xuICAgICAgLy8gICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXh0LWVkaXRvcicpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnT3BlbiBpbiBUZXJtaW5hbCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitUJyxcbiAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgbWFpbk1lbnVQaWVjZXMgPSBbXVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0Fib3V0IEhhaWt1JyxcbiAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvJylcbiAgICAgIH1cbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdDaGVjayBmb3IgdXBkYXRlcycsXG4gICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OmNoZWNrLXVwZGF0ZXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3N0YWdpbmcnKSB7XG4gICAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdSZWxvYWQgSGFpa3UnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtSJyxcbiAgICAgICAgcm9sZTogJ3JlbG9hZCdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ01pbmltaXplIEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLFxuICAgICAgcm9sZTogJ21pbmltaXplJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0hpZGUgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrSCcsXG4gICAgICByb2xlOiAnaGlkZSdcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdRdWl0IEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1EnLFxuICAgICAgcm9sZTogJ3F1aXQnXG4gICAgfSlcblxuICAgIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAge1xuICAgICAgICBsYWJlbDogYXBwLmdldE5hbWUoKSxcbiAgICAgICAgc3VibWVudTogbWFpbk1lbnVQaWVjZXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHJvamVjdCcsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1B1Ymxpc2gnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0VkaXQnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdVbmRvJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcgJiYgb3B0aW9ucy51bmRvYWJsZXMubGVuZ3RoID4gMSwgLy8gSWRpb3N5bmNyYWN5OiBJZiB0aGVyZSBpcyBvbmUgJ3VuZG9hYmxlJywgdGhhdCBpcyBhY3R1YWxseSB0aGUgYm90dG9tbW9zdCBjb21taXQgd2hpY2ggY2FuJ3QgYmUgdW5kb25lLi4uIDpQXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnVuZG8nLCBvcHRpb25zLnVuZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVkbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTaGlmdCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMucmVkb2FibGVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnJlZG8nLCBvcHRpb25zLnJlZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0N1dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtYJyxcbiAgICAgICAgICAgIHJvbGU6ICdjdXQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0NvcHknLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQycsXG4gICAgICAgICAgICByb2xlOiAnY29weSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUGFzdGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVicsXG4gICAgICAgICAgICByb2xlOiAncGFzdGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEZWxldGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdEZWxldGUnLFxuICAgICAgICAgICAgcm9sZTogJ2RlbGV0ZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnSW5zZXJ0JyxcbiAgICAgIC8vICAgc3VibWVudTogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnU2hhcGUnLFxuICAgICAgLy8gICAgICAgc3VibWVudTogW1xuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdSZWN0YW5nbGUnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnUicsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnUmVjdGFuZ2xlJ10pXG4gICAgICAvLyAgICAgICAgIH0sXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ092YWwnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnTycsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnT3ZhbCddKVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgICBdXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1ZlY3RvcicsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1YnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydwZW4nXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnQnJ1c2gnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdCJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnYnJ1c2gnXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1RleHQnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdUJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsndGV4dCddKVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdWaWV3JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBJbicsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQbHVzJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20taW4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIE91dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCstJywgLy8gbm90ICdNaW51cycgOi9cbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20tb3V0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRGV2ZWxvcGVyJyxcbiAgICAgICAgc3VibWVudTogZGV2ZWxvcGVyTWVudUl0ZW1zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0hlbHAnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEb2NzJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9kb2NzLmhhaWt1LmFpLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Rha2UgVG91cicsXG4gICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMucHJvamVjdExpc3QuZmluZChwcm9qZWN0ID0+IHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJyksXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnSGFpa3UgQ29tbXVuaXR5IG9uIFNsYWNrJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9oYWlrdS1jb21tdW5pdHkuc2xhY2suY29tLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcE1lbnVcbiJdfQ==