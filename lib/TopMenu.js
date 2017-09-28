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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJNZW51IiwiYXBwIiwic2hlbGwiLCJzZXROYW1lIiwiVG9wTWVudSIsIm9wdGlvbnMiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImZvbGRlciIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwic2V0QXBwbGljYXRpb25NZW51IiwiYnVpbGRGcm9tVGVtcGxhdGUiLCJnZXROYW1lIiwic3VibWVudSIsImlzU2F2aW5nIiwidW5kb2FibGVzIiwibGVuZ3RoIiwicmVkb2FibGVzIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ3FCRCxRQUFRLFVBQVIsQztJQUFyQkUsSSxhQUFBQSxJO0lBQU1DLEcsYUFBQUEsRztJQUFLQyxLLGFBQUFBLEs7O0FBQ25CRCxJQUFJRSxPQUFKLENBQVksT0FBWjs7SUFFTUMsTzs7Ozs7Ozs7Ozs7MkJBQ0lDLE8sRUFBUztBQUFBOztBQUNmLFVBQUlDLHFCQUFxQjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRUMsZUFBTyxrQkFEVDtBQUVFQyxxQkFBYSxvQkFGZjtBQUdFQyxpQkFBUyxDQUFDLENBQUNKLFFBQVFLLE1BSHJCO0FBSUVDLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixDQUFvQjtBQUNsQlAsZUFBTyxhQURXO0FBRWxCSSxlQUFPLGlCQUFNO0FBQ1hU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RUVpQixpQkFBUyxDQUNQO0FBQ0VqQixpQkFBTyxTQURUO0FBRUVDLHVCQUFhLGdCQUZmO0FBR0VDLG1CQUFTLElBSFg7QUFJRUUsaUJBQU8saUJBQU07QUFDWCxtQkFBS0MsSUFBTCxDQUFVLHFCQUFWO0FBQ0Q7QUFOSCxTQURPLEVBU1A7QUFDRUwsaUJBQU8sVUFEVDtBQUVFQyx1QkFBYSxhQUZmLEVBRThCO0FBQzVCQyxtQkFBUyxJQUhYO0FBSUVFLGlCQUFPLGlCQUFNO0FBQ1gsbUJBQUtDLElBQUwsQ0FBVSxzQkFBVjtBQUNEO0FBTkgsU0FUTztBQUZYLE9BdEc2QyxFQTJIN0M7QUFDRUwsZUFBTyxXQURUO0FBRUVpQixpQkFBU2xCO0FBRlgsT0EzSDZDLEVBK0g3QztBQUNFQyxlQUFPLE1BRFQ7QUFFRWlCLGlCQUFTLENBQ1A7QUFDRWpCLGlCQUFPLE1BRFQ7QUFFRUksaUJBQU8saUJBQU07QUFDWFQsa0JBQU1hLFlBQU4sQ0FBbUIsd0JBQW5CO0FBQ0Q7QUFKSCxTQURPLEVBT1A7QUFDRVIsaUJBQU8sV0FEVDtBQUVFSSxpQkFBTyxpQkFBTTtBQUNYLG1CQUFLQyxJQUFMLENBQVUsd0JBQVY7QUFDRDtBQUpILFNBUE8sRUFhUCxFQUFFSSxNQUFNLFdBQVIsRUFiTyxFQWNQO0FBQ0VULGlCQUFPLDBCQURUO0FBRUVJLGlCQUFPLGlCQUFNO0FBQ1hULGtCQUFNYSxZQUFOLENBQW1CLG9DQUFuQjtBQUNEO0FBSkgsU0FkTztBQUZYLE9BL0g2QyxDQUF2QixDQUF4QjtBQXdKQSxhQUFPLElBQVA7QUFDRDs7OztFQXJObUJoQixZOztBQXdOdEI4QixPQUFPQyxPQUFQLEdBQWlCMUIsT0FBakIiLCJmaWxlIjoiVG9wTWVudS5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgRXZlbnRFbWl0dGVyIH0gPSByZXF1aXJlKCdldmVudHMnKVxuY29uc3QgeyBNZW51LCBhcHAsIHNoZWxsIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5hcHAuc2V0TmFtZSgnSGFpa3UnKVxuXG5jbGFzcyBUb3BNZW51IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY3JlYXRlIChvcHRpb25zKSB7XG4gICAgdmFyIGRldmVsb3Blck1lbnVJdGVtcyA9IFtcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdPcGVuIGluIFRleHQgRWRpdG9yJyxcbiAgICAgIC8vICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK0UnLFxuICAgICAgLy8gICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICBjbGljazogKCkgPT4ge1xuICAgICAgLy8gICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXh0LWVkaXRvcicpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnT3BlbiBpbiBUZXJtaW5hbCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitUJyxcbiAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgbWFpbk1lbnVQaWVjZXMgPSBbXVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0Fib3V0IEhhaWt1JyxcbiAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvJylcbiAgICAgIH1cbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgICBsYWJlbDogJ1JlbG9hZCBIYWlrdScsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1InLFxuICAgICAgICByb2xlOiAncmVsb2FkJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnTWluaW1pemUgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTScsXG4gICAgICByb2xlOiAnbWluaW1pemUnXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnSGlkZSBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtIJyxcbiAgICAgIHJvbGU6ICdoaWRlJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ1F1aXQgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUScsXG4gICAgICByb2xlOiAncXVpdCdcbiAgICB9KVxuXG4gICAgTWVudS5zZXRBcHBsaWNhdGlvbk1lbnUoTWVudS5idWlsZEZyb21UZW1wbGF0ZShbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiBhcHAuZ2V0TmFtZSgpLFxuICAgICAgICBzdWJtZW51OiBtYWluTWVudVBpZWNlc1xuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdQcm9qZWN0JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUHVibGlzaCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzYXZlJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRWRpdCcsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1VuZG8nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWicsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyAmJiBvcHRpb25zLnVuZG9hYmxlcy5sZW5ndGggPiAxLCAvLyBJZGlvc3luY3JhY3k6IElmIHRoZXJlIGlzIG9uZSAndW5kb2FibGUnLCB0aGF0IGlzIGFjdHVhbGx5IHRoZSBib3R0b21tb3N0IGNvbW1pdCB3aGljaCBjYW4ndCBiZSB1bmRvbmUuLi4gOlBcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6dW5kbycsIG9wdGlvbnMudW5kb2FibGVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdSZWRvJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1NoaWZ0K1onLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcgJiYgb3B0aW9ucy5yZWRvYWJsZXMubGVuZ3RoID4gMCxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6cmVkbycsIG9wdGlvbnMucmVkb2FibGVzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnQ3V0JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1gnLFxuICAgICAgICAgICAgcm9sZTogJ2N1dCdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnQ29weScsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtDJyxcbiAgICAgICAgICAgIHJvbGU6ICdjb3B5J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdQYXN0ZScsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtWJyxcbiAgICAgICAgICAgIHJvbGU6ICdwYXN0ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0RlbGV0ZScsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0RlbGV0ZScsXG4gICAgICAgICAgICByb2xlOiAnZGVsZXRlJ1xuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdJbnNlcnQnLFxuICAgICAgLy8gICBzdWJtZW51OiBbXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdTaGFwZScsXG4gICAgICAvLyAgICAgICBzdWJtZW51OiBbXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ1JlY3RhbmdsZScsXG4gICAgICAvLyAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdSJyxcbiAgICAgIC8vICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydzaGFwZScsICdSZWN0YW5nbGUnXSlcbiAgICAgIC8vICAgICAgICAgfSxcbiAgICAgIC8vICAgICAgICAge1xuICAgICAgLy8gICAgICAgICAgIGxhYmVsOiAnT3ZhbCcsXG4gICAgICAvLyAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdPJyxcbiAgICAgIC8vICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydzaGFwZScsICdPdmFsJ10pXG4gICAgICAvLyAgICAgICAgIH1cbiAgICAgIC8vICAgICAgIF1cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnVmVjdG9yJyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnVicsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3BlbiddKVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdCcnVzaCcsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ0InLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydicnVzaCddKVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnVGV4dCcsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1QnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWyd0ZXh0J10pXG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICBdXG4gICAgICAvLyB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1ZpZXcnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIEluJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1BsdXMnLFxuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6em9vbS1pbicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1pvb20gT3V0JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsKy0nLCAvLyBub3QgJ01pbnVzJyA6L1xuICAgICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6em9vbS1vdXQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdEZXZlbG9wZXInLFxuICAgICAgICBzdWJtZW51OiBkZXZlbG9wZXJNZW51SXRlbXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnSGVscCcsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0RvY3MnLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2RvY3MuaGFpa3UuYWkvJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVGFrZSBUb3VyJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdIYWlrdSBDb21tdW5pdHkgb24gU2xhY2snLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2hhaWt1LWNvbW11bml0eS5zbGFjay5jb20vJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9wTWVudVxuIl19