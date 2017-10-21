'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _electron = require('electron');

var _experiments = require('haiku-common/lib/experiments');

var _exporter = require('haiku-sdk-creator/lib/exporter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_electron.app.setName('Haiku');

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

      var isProjectOpen = !!options.folder;
      var developerMenuItems = [
      // {
      //   label: 'Open in Text Editor',
      //   accelerator: 'CmdOrCtrl+Option+E',
      //   enabled: isProjectOpen,
      //   click: () => {
      //     this.emit('global-menu:open-text-editor')
      //   }
      // },
      {
        label: 'Open in Terminal',
        accelerator: 'CmdOrCtrl+Option+T',
        enabled: isProjectOpen,
        click: function click() {
          _this2.emit('global-menu:open-terminal');
        }
      }];

      var mainMenuPieces = [];

      mainMenuPieces.push({
        label: 'About Haiku',
        click: function click() {
          _electron.shell.openExternal('https://www.haiku.ai/');
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

      var projectSubmenu = [{
        label: 'Publish',
        accelerator: 'CmdOrCtrl+S',
        enabled: !options.isSaving && isProjectOpen,
        click: function click() {
          _this2.emit('global-menu:save');
        }
      }];

      if ((0, _experiments.experimentIsEnabled)(_experiments.Experiment.LottieExport)) {
        projectSubmenu.push({
          label: 'Export',
          submenu: [{
            label: _exporter.ExporterFormat.Bodymovin,
            enabled: isProjectOpen,
            accelerator: 'Cmd+Shift+E', // TODO(sashajoseph): Remove this?
            click: function click() {
              _this2.emit('global-menu:export', [_exporter.ExporterFormat.Bodymovin]);
            }
          }]
        });
      }

      _electron.Menu.setApplicationMenu(_electron.Menu.buildFromTemplate([{
        label: _electron.app.getName(),
        submenu: mainMenuPieces
      }, {
        label: 'Project',
        submenu: projectSubmenu
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
        }, { role: 'selectall' }]
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
      //           enabled: isProjectOpen,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Rectangle'])
      //         },
      //         {
      //           label: 'Oval',
      //           accelerator: 'O',
      //           enabled: isProjectOpen,
      //           click: () => this.emit('global-menu:set-tool', ['shape', 'Oval'])
      //         }
      //       ]
      //     },
      //     {
      //       label: 'Vector',
      //       accelerator: 'V',
      //       enabled: isProjectOpen,
      //       click: () => this.emit('global-menu:set-tool', ['pen'])
      //     },
      //     {
      //       label: 'Brush',
      //       accelerator: 'B',
      //       enabled: isProjectOpen,
      //       click: () => this.emit('global-menu:set-tool', ['brush'])
      //     },
      //     { type: 'separator' },
      //     {
      //       label: 'Text',
      //       accelerator: 'T',
      //       enabled: isProjectOpen,
      //       click: () => this.emit('global-menu:set-tool', ['text'])
      //     }
      //   ]
      // },
      {
        label: 'View',
        submenu: [{
          label: 'Zoom In',
          accelerator: 'CmdOrCtrl+Plus',
          enabled: isProjectOpen,
          click: function click() {
            _this2.emit('global-menu:zoom-in');
          }
        }, {
          label: 'Zoom Out',
          accelerator: 'CmdOrCtrl+-', // not 'Minus' :/
          enabled: isProjectOpen,
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
            _electron.shell.openExternal('https://docs.haiku.ai/');
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
            _electron.shell.openExternal('https://haiku-community.slack.com/');
          }
        }]
      }]));
      return this;
    }
  }]);

  return TopMenu;
}(_events2.default);

exports.default = TopMenu;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInNldE5hbWUiLCJUb3BNZW51Iiwib3B0aW9ucyIsImlzUHJvamVjdE9wZW4iLCJmb2xkZXIiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwicHJvamVjdFN1Ym1lbnUiLCJpc1NhdmluZyIsIkxvdHRpZUV4cG9ydCIsInN1Ym1lbnUiLCJCb2R5bW92aW4iLCJzZXRBcHBsaWNhdGlvbk1lbnUiLCJidWlsZEZyb21UZW1wbGF0ZSIsImdldE5hbWUiLCJ1bmRvYWJsZXMiLCJsZW5ndGgiLCJyZWRvYWJsZXMiLCJwcm9qZWN0TGlzdCIsImZpbmQiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLGNBQUlBLE9BQUosQ0FBWSxPQUFaOztJQUVxQkMsTzs7Ozs7Ozs7Ozs7MkJBQ1hDLE8sRUFBUztBQUFBOztBQUNmLFVBQU1DLGdCQUFnQixDQUFDLENBQUNELFFBQVFFLE1BQWhDO0FBQ0EsVUFBSUMscUJBQXFCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxlQUFPLGtCQURUO0FBRUVDLHFCQUFhLG9CQUZmO0FBR0VDLGlCQUFTTCxhQUhYO0FBSUVNLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixDQUFvQjtBQUNsQk4sZUFBTyxhQURXO0FBRWxCRyxlQUFPLGlCQUFNO0FBQ1gsMEJBQU1JLFlBQU4s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O0FBSkgsU0FETyxFQU9QO0FBQ0VQLGlCQUFPLFdBRFQ7QUFFRUUsbUJBQVMsQ0FBQyxDQUFDTixRQUFRNEIsV0FBUixDQUFvQkMsSUFBcEIsQ0FBeUI7QUFBQSxtQkFBV0MsUUFBUUMsV0FBUixLQUF3QixlQUFuQztBQUFBLFdBQXpCLENBRmI7QUFHRXhCLGlCQUFPLGlCQUFNO0FBQ1gsbUJBQUtDLElBQUwsQ0FBVSx3QkFBVjtBQUNEO0FBTEgsU0FQTyxFQWNQLEVBQUVJLE1BQU0sV0FBUixFQWRPLEVBZVA7QUFDRVIsaUJBQU8sMEJBRFQ7QUFFRUcsaUJBQU8saUJBQU07QUFDWCw0QkFBTUksWUFBTixDQUFtQixvQ0FBbkI7QUFDRDtBQUpILFNBZk87QUFGWCxPQXZINkMsQ0FBdkIsQ0FBeEI7QUFpSkEsYUFBTyxJQUFQO0FBQ0Q7Ozs7OztrQkEvT2tCWixPIiwiZmlsZSI6IlRvcE1lbnUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cydcbmltcG9ydCB7IE1lbnUsIGFwcCwgc2hlbGwgfSBmcm9tICdlbGVjdHJvbidcblxuaW1wb3J0IHsgRXhwZXJpbWVudCwgZXhwZXJpbWVudElzRW5hYmxlZCB9IGZyb20gJ2hhaWt1LWNvbW1vbi9saWIvZXhwZXJpbWVudHMnXG5pbXBvcnQgeyBFeHBvcnRlckZvcm1hdCB9IGZyb20gJ2hhaWt1LXNkay1jcmVhdG9yL2xpYi9leHBvcnRlcidcblxuYXBwLnNldE5hbWUoJ0hhaWt1JylcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9wTWVudSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNyZWF0ZSAob3B0aW9ucykge1xuICAgIGNvbnN0IGlzUHJvamVjdE9wZW4gPSAhIW9wdGlvbnMuZm9sZGVyXG4gICAgdmFyIGRldmVsb3Blck1lbnVJdGVtcyA9IFtcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdPcGVuIGluIFRleHQgRWRpdG9yJyxcbiAgICAgIC8vICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK0UnLFxuICAgICAgLy8gICBlbmFibGVkOiBpc1Byb2plY3RPcGVuLFxuICAgICAgLy8gICBjbGljazogKCkgPT4ge1xuICAgICAgLy8gICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXh0LWVkaXRvcicpXG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnT3BlbiBpbiBUZXJtaW5hbCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitUJyxcbiAgICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGVybWluYWwnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuXG4gICAgY29uc3QgbWFpbk1lbnVQaWVjZXMgPSBbXVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0Fib3V0IEhhaWt1JyxcbiAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cuaGFpa3UuYWkvJylcbiAgICAgIH1cbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdDaGVjayBmb3IgdXBkYXRlcycsXG4gICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OmNoZWNrLXVwZGF0ZXMnKVxuICAgICAgfVxuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xuICAgIH0pXG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyAmJiBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3N0YWdpbmcnKSB7XG4gICAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdSZWxvYWQgSGFpa3UnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtSJyxcbiAgICAgICAgcm9sZTogJ3JlbG9hZCdcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ01pbmltaXplIEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK00nLFxuICAgICAgcm9sZTogJ21pbmltaXplJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0hpZGUgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrSCcsXG4gICAgICByb2xlOiAnaGlkZSdcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdRdWl0IEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1EnLFxuICAgICAgcm9sZTogJ3F1aXQnXG4gICAgfSlcblxuXG4gICAgY29uc3QgcHJvamVjdFN1Ym1lbnUgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHVibGlzaCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1MnLFxuICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyAmJiBpc1Byb2plY3RPcGVuLFxuICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2F2ZScpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG5cbiAgICBpZiAoZXhwZXJpbWVudElzRW5hYmxlZChFeHBlcmltZW50LkxvdHRpZUV4cG9ydCkpIHtcbiAgICAgIHByb2plY3RTdWJtZW51LnB1c2goe1xuICAgICAgICBsYWJlbDogJ0V4cG9ydCcsXG4gICAgICAgIHN1Ym1lbnU6IFt7XG4gICAgICAgICAgbGFiZWw6IEV4cG9ydGVyRm9ybWF0LkJvZHltb3ZpbixcbiAgICAgICAgICBlbmFibGVkOiBpc1Byb2plY3RPcGVuLFxuICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kK1NoaWZ0K0UnLCAvLyBUT0RPKHNhc2hham9zZXBoKTogUmVtb3ZlIHRoaXM/XG4gICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6ZXhwb3J0JywgW0V4cG9ydGVyRm9ybWF0LkJvZHltb3Zpbl0pXG4gICAgICAgICAgfVxuICAgICAgICB9XVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBNZW51LnNldEFwcGxpY2F0aW9uTWVudShNZW51LmJ1aWxkRnJvbVRlbXBsYXRlKFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6IGFwcC5nZXROYW1lKCksXG4gICAgICAgIHN1Ym1lbnU6IG1haW5NZW51UGllY2VzXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1Byb2plY3QnLFxuICAgICAgICBzdWJtZW51OiBwcm9qZWN0U3VibWVudVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdFZGl0JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVW5kbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMudW5kb2FibGVzLmxlbmd0aCA+IDEsIC8vIElkaW9zeW5jcmFjeTogSWYgdGhlcmUgaXMgb25lICd1bmRvYWJsZScsIHRoYXQgaXMgYWN0dWFsbHkgdGhlIGJvdHRvbW1vc3QgY29tbWl0IHdoaWNoIGNhbid0IGJlIHVuZG9uZS4uLiA6UFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTp1bmRvJywgb3B0aW9ucy51bmRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1JlZG8nLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrU2hpZnQrWicsXG4gICAgICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyAmJiBvcHRpb25zLnJlZG9hYmxlcy5sZW5ndGggPiAwLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpyZWRvJywgb3B0aW9ucy5yZWRvYWJsZXMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDdXQnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrWCcsXG4gICAgICAgICAgICByb2xlOiAnY3V0J1xuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdDb3B5JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0MnLFxuICAgICAgICAgICAgcm9sZTogJ2NvcHknXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Bhc3RlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1YnLFxuICAgICAgICAgICAgcm9sZTogJ3Bhc3RlJ1xuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnRGVsZXRlJyxcbiAgICAgICAgICAgIHJvbGU6ICdkZWxldGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7cm9sZTogJ3NlbGVjdGFsbCd9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnSW5zZXJ0JyxcbiAgICAgIC8vICAgc3VibWVudTogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnU2hhcGUnLFxuICAgICAgLy8gICAgICAgc3VibWVudTogW1xuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdSZWN0YW5nbGUnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnUicsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnUmVjdGFuZ2xlJ10pXG4gICAgICAvLyAgICAgICAgIH0sXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ092YWwnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnTycsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnT3ZhbCddKVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgICBdXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1ZlY3RvcicsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1YnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydwZW4nXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnQnJ1c2gnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdCJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnYnJ1c2gnXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1RleHQnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdUJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsndGV4dCddKVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdWaWV3JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBJbicsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQbHVzJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20taW4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIE91dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCstJywgLy8gbm90ICdNaW51cycgOi9cbiAgICAgICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20tb3V0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRGV2ZWxvcGVyJyxcbiAgICAgICAgc3VibWVudTogZGV2ZWxvcGVyTWVudUl0ZW1zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0hlbHAnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEb2NzJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9kb2NzLmhhaWt1LmFpLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Rha2UgVG91cicsXG4gICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMucHJvamVjdExpc3QuZmluZChwcm9qZWN0ID0+IHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJyksXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnSGFpa3UgQ29tbXVuaXR5IG9uIFNsYWNrJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9oYWlrdS1jb21tdW5pdHkuc2xhY2suY29tLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIl19