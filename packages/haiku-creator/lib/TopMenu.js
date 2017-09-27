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

      if (process.env.NODE_ENV !== 'production') {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJNZW51IiwiYXBwIiwic2hlbGwiLCJzZXROYW1lIiwiVG9wTWVudSIsIm9wdGlvbnMiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImZvbGRlciIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwic2V0QXBwbGljYXRpb25NZW51IiwiYnVpbGRGcm9tVGVtcGxhdGUiLCJnZXROYW1lIiwic3VibWVudSIsImlzU2F2aW5nIiwidW5kb2FibGVzIiwibGVuZ3RoIiwicmVkb2FibGVzIiwicHJvamVjdExpc3QiLCJmaW5kIiwicHJvamVjdCIsInByb2plY3ROYW1lIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ3FCRCxRQUFRLFVBQVIsQztJQUFyQkUsSSxhQUFBQSxJO0lBQU1DLEcsYUFBQUEsRztJQUFLQyxLLGFBQUFBLEs7O0FBQ25CRCxJQUFJRSxPQUFKLENBQVksT0FBWjs7SUFFTUMsTzs7Ozs7Ozs7Ozs7MkJBQ0lDLE8sRUFBUztBQUFBOztBQUNmLFVBQUlDLHFCQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRUMsZUFBTyxrQkFEVDtBQUVFQyxxQkFBYSxvQkFGZjtBQUdFQyxpQkFBUyxDQUFDLENBQUNKLFFBQVFLLE1BSHJCO0FBSUVDLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixD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LCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IEV2ZW50RW1pdHRlciB9ID0gcmVxdWlyZSgnZXZlbnRzJylcbmNvbnN0IHsgTWVudSwgYXBwLCBzaGVsbCB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuYXBwLnNldE5hbWUoJ0hhaWt1JylcblxuY2xhc3MgVG9wTWVudSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNyZWF0ZSAob3B0aW9ucykge1xuICAgIHZhciBkZXZlbG9wZXJNZW51SXRlbXMgPSBbXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnT3BlbiBpbiBUZXh0IEVkaXRvcicsXG4gICAgICAvLyAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitFJyxcbiAgICAgIC8vICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgY2xpY2s6ICgpID0+IHtcbiAgICAgIC8vICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGV4dC1lZGl0b3InKVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ09wZW4gaW4gVGVybWluYWwnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtPcHRpb24rVCcsXG4gICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cblxuICAgIGNvbnN0IG1haW5NZW51UGllY2VzID0gW11cblxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdBYm91dCBIYWlrdScsXG4gICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vd3d3LmhhaWt1LmFpLycpXG4gICAgICB9XG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzZXBhcmF0b3InXG4gICAgfSlcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdSZWxvYWQgSGFpa3UnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtSJyxcbiAgICAgICAgcm9sZTogJ3JlbG9hZCdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ01pbmltaXplIEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLFxuICAgICAgcm9sZTogJ21pbmltaXplJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0hpZGUgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrSCcsXG4gICAgICByb2xlOiAnaGlkZSdcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdRdWl0IEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1EnLFxuICAgICAgcm9sZTogJ3F1aXQnXG4gICAgfSlcblxuICAgIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAge1xuICAgICAgICBsYWJlbDogYXBwLmdldE5hbWUoKSxcbiAgICAgICAgc3VibWVudTogbWFpbk1lbnVQaWVjZXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHJvamVjdCcsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1B1Ymxpc2gnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2F2ZScpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0VkaXQnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdVbmRvJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcgJiYgb3B0aW9ucy51bmRvYWJsZXMubGVuZ3RoID4gMSwgLy8gSWRpb3N5bmNyYWN5OiBJZiB0aGVyZSBpcyBvbmUgJ3VuZG9hYmxlJywgdGhhdCBpcyBhY3R1YWxseSB0aGUgYm90dG9tbW9zdCBjb21taXQgd2hpY2ggY2FuJ3QgYmUgdW5kb25lLi4uIDpQXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnVuZG8nLCBvcHRpb25zLnVuZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVkbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTaGlmdCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMucmVkb2FibGVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnJlZG8nLCBvcHRpb25zLnJlZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0N1dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtYJyxcbiAgICAgICAgICAgIHJvbGU6ICdjdXQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0NvcHknLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQycsXG4gICAgICAgICAgICByb2xlOiAnY29weSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUGFzdGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVicsXG4gICAgICAgICAgICByb2xlOiAncGFzdGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEZWxldGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdEZWxldGUnLFxuICAgICAgICAgICAgcm9sZTogJ2RlbGV0ZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnSW5zZXJ0JyxcbiAgICAgIC8vICAgc3VibWVudTogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnU2hhcGUnLFxuICAgICAgLy8gICAgICAgc3VibWVudTogW1xuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdSZWN0YW5nbGUnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnUicsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnUmVjdGFuZ2xlJ10pXG4gICAgICAvLyAgICAgICAgIH0sXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ092YWwnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnTycsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnT3ZhbCddKVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgICBdXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1ZlY3RvcicsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1YnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydwZW4nXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnQnJ1c2gnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdCJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnYnJ1c2gnXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1RleHQnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdUJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsndGV4dCddKVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdWaWV3JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBJbicsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQbHVzJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20taW4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIE91dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCstJywgLy8gbm90ICdNaW51cycgOi9cbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20tb3V0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRGV2ZWxvcGVyJyxcbiAgICAgICAgc3VibWVudTogZGV2ZWxvcGVyTWVudUl0ZW1zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0hlbHAnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEb2NzJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9kb2NzLmhhaWt1LmFpLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Rha2UgVG91cicsXG4gICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMucHJvamVjdExpc3QuZmluZChwcm9qZWN0ID0+IHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJyksXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnSGFpa3UgQ29tbXVuaXR5IG9uIFNsYWNrJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9oYWlrdS1jb21tdW5pdHkuc2xhY2suY29tLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcE1lbnVcbiJdfQ==