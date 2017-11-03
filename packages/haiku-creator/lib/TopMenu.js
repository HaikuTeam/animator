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

      if ((0, _experiments.experimentIsEnabled)(_experiments.Experiment.LottieExportInGlobalMenu)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInNldE5hbWUiLCJUb3BNZW51Iiwib3B0aW9ucyIsImlzUHJvamVjdE9wZW4iLCJmb2xkZXIiLCJkZXZlbG9wZXJNZW51SXRlbXMiLCJsYWJlbCIsImFjY2VsZXJhdG9yIiwiZW5hYmxlZCIsImNsaWNrIiwiZW1pdCIsIm1haW5NZW51UGllY2VzIiwicHVzaCIsIm9wZW5FeHRlcm5hbCIsInR5cGUiLCJwcm9jZXNzIiwiZW52IiwiTk9ERV9FTlYiLCJyb2xlIiwicHJvamVjdFN1Ym1lbnUiLCJpc1NhdmluZyIsIkxvdHRpZUV4cG9ydEluR2xvYmFsTWVudSIsInN1Ym1lbnUiLCJCb2R5bW92aW4iLCJzZXRBcHBsaWNhdGlvbk1lbnUiLCJidWlsZEZyb21UZW1wbGF0ZSIsImdldE5hbWUiLCJ1bmRvYWJsZXMiLCJsZW5ndGgiLCJyZWRvYWJsZXMiLCJwcm9qZWN0TGlzdCIsImZpbmQiLCJwcm9qZWN0IiwicHJvamVjdE5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztBQUVBLGNBQUlBLE9BQUosQ0FBWSxPQUFaOztJQUVxQkMsTzs7Ozs7Ozs7Ozs7MkJBQ1hDLE8sRUFBUztBQUFBOztBQUNmLFVBQU1DLGdCQUFnQixDQUFDLENBQUNELFFBQVFFLE1BQWhDO0FBQ0EsVUFBSUMscUJBQXFCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxlQUFPLGtCQURUO0FBRUVDLHFCQUFhLG9CQUZmO0FBR0VDLGlCQUFTTCxhQUhYO0FBSUVNLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFOSCxPQVR1QixDQUF6Qjs7QUFtQkEsVUFBTUMsaUJBQWlCLEVBQXZCOztBQUVBQSxxQkFBZUMsSUFBZixDQUFvQjtBQUNsQk4sZUFBTyxhQURXO0FBRWxCRyxlQUFPLGlCQUFNO0FBQ1gsMEJBQU1JLFlBQU4sQ0FBbUIsdUJBQW5CO0FBQ0Q7QUFKaUIsT0FBcEI7QUFNQUYscUJBQWVDLElBQWYsQ0FBb0I7QUFDbEJOLGVBQU8sbUJBRFc7QUFFbEJHLGVBQU8saUJBQU07QUFDWCxpQkFBS0MsSUFBTCxDQUFVLDJCQUFWO0FBQ0Q7QUFKaUIsT0FBcEI7QUFNQUMscUJBQWVDLElBQWYsQ0FBb0I7QUFDbEJFLGNBQU07QUFEWSxPQUFwQjs7QUFJQSxVQUFJQyxRQUFRQyxHQUFSLENBQVlDLFFBQVosS0FBeUIsWUFBekIsSUFBeUNGLFFBQVFDLEdBQVIsQ0FBWUMsUUFBWixLQUF5QixTQUF0RSxFQUFpRjtBQUMvRU4sdUJBQWVDLElBQWYsQ0FBb0I7QUFDbEJOLGlCQUFPLGNBRFc7QUFFbEJDLHVCQUFhLGFBRks7QUFHbEJXLGdCQUFNO0FBSFksU0FBcEI7QUFLRDs7QUFFRFAscUJBQWVDLElBQWYsQ0FBb0I7QUFDbEJOLGVBQU8sZ0JBRFc7QUFFbEJDLHFCQUFhLGFBRks7QUFHbEJXLGNBQU07QUFIWSxPQUFwQjtBQUtBUCxxQkFBZUMsSUFBZixDQUFvQjtBQUNsQk4sZUFBTyxZQURXO0FBRWxCQyxxQkFBYSxhQUZLO0FBR2xCVyxjQUFNO0FBSFksT0FBcEI7QUFLQVAscUJBQWVDLElBQWYsQ0FBb0I7QUFDbEJFLGNBQU07QUFEWSxPQUFwQjtBQUdBSCxxQkFBZUMsSUFBZixDQUFvQjtBQUNsQk4sZUFBTyxZQURXO0FBRWxCQyxxQkFBYSxhQUZLO0FBR2xCVyxjQUFNO0FBSFksT0FBcEI7O0FBTUEsVUFBTUMsaUJBQWlCLENBQ3JCO0FBQ0ViLGVBQU8sU0FEVDtBQUVFQyxxQkFBYSxhQUZmO0FBR0VDLGlCQUFTLENBQUNOLFFBQVFrQixRQUFULElBQXFCakIsYUFIaEM7QUFJRU0sZUFBTyxpQkFBTTtBQUNYLGlCQUFLQyxJQUFMLENBQVUsa0JBQVY7QUFDRDtBQU5ILE9BRHFCLENBQXZCOztBQVdBLFVBQUksc0NBQW9CLHdCQUFXVyx3QkFBL0IsQ0FBSixFQUE4RDtBQUM1REYsdUJBQWVQLElBQWYsQ0FBb0I7QUFDbEJOLGlCQUFPLFFBRFc7QUFFbEJnQixtQkFBUyxDQUFDO0FBQ1JoQixtQkFBTyx5QkFBZWlCLFNBRGQ7QUFFUmYscUJBQVNMLGFBRkQ7QUFHUkkseUJBQWEsYUFITCxFQUdvQjtBQUM1QkUsbUJBQU8saUJBQU07QUFDWCxxQkFBS0MsSUFBTCxDQUFVLG9CQUFWLEVBQWdDLENBQUMseUJBQWVhLFNBQWhCLENBQWhDO0FBQ0Q7QUFOTyxXQUFEO0FBRlMsU0FBcEI7QUFXRDs7QUFFRCxxQkFBS0Msa0JBQUwsQ0FBd0IsZUFBS0MsaUJBQUwsQ0FBdUIsQ0FDN0M7QUFDRW5CLGVBQU8sY0FBSW9CLE9BQUosRUFEVDtBQUVFSixpQkFBU1g7QUFGWCxPQUQ2QyxFQUs3QztBQUNFTCxlQUFPLFNBRFQ7QUFFRWdCLGlCQUFTSDtBQUZYLE9BTDZDLEVBUzdDO0FBQ0ViLGVBQU8sTUFEVDtBQUVFZ0IsaUJBQVMsQ0FDUDtBQUNFaEIsaUJBQU8sTUFEVDtBQUVFQyx1QkFBYSxhQUZmO0FBR0VDLG1CQUFTLENBQUNOLFFBQVFrQixRQUFULElBQXFCbEIsUUFBUXlCLFNBQVIsQ0FBa0JDLE1BQWxCLEdBQTJCLENBSDNELEVBRzhEO0FBQzVEbkIsaUJBQU8saUJBQU07QUFDWCxtQkFBS0MsSUFBTCxDQUFVLGtCQUFWLEVBQThCUixRQUFReUIsU0FBdEM7QUFDRDtBQU5ILFNBRE8sRUFTUDtBQUNFckIsaUJBQU8sTUFEVDtBQUVFQyx1QkFBYSxtQkFGZjtBQUdFQyxtQkFBUyxDQUFDTixRQUFRa0IsUUFBVCxJQUFxQmxCLFFBQVEyQixTQUFSLENBQWtCRCxNQUFsQixHQUEyQixDQUgzRDtBQUlFbkIsaUJBQU8saUJBQU07QUFDWCxtQkFBS0MsSUFBTCxDQUFVLGtCQUFWLEVBQThCUixRQUFRMkIsU0FBdEM7QUFDRDtBQU5ILFNBVE8sRUFpQlAsRUFBRWYsTUFBTSxXQUFSLEVBakJPLEVBa0JQO0FBQ0VSLGlCQUFPLEtBRFQ7QUFFRUMsdUJBQWEsYUFGZjtBQUdFVyxnQkFBTTtBQUhSLFNBbEJPLEVBdUJQO0FBQ0VaLGlCQUFPLE1BRFQ7QUFFRUMsdUJBQWEsYUFGZjtBQUdFVyxnQkFBTTtBQUhSLFNBdkJPLEVBNEJQO0FBQ0VaLGlCQUFPLE9BRFQ7QUFFRUMsdUJBQWEsYUFGZjtBQUdFVyxnQkFBTTtBQUhSLFNBNUJPLEVBaUNQLEVBQUVKLE1BQU0sV0FBUixFQWpDTyxFQWtDUDtBQUNFUixpQkFBTyxRQURUO0FBRUVDLHVCQUFhLFFBRmY7QUFHRVcsZ0JBQU07QUFIUixTQWxDTyxFQXVDUCxFQUFDQSxNQUFNLFdBQVAsRUF2Q087QUFGWCxPQVQ2QztBQXFEN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0VaLGVBQU8sTUFEVDtBQUVFZ0IsaUJBQVMsQ0FDUDtBQUNFaEIsaUJBQU8sU0FEVDtBQUVFQyx1QkFBYSxnQkFGZjtBQUdFQyxtQkFBU0wsYUFIWDtBQUlFTSxpQkFBTyxpQkFBTTtBQUNYLG1CQUFLQyxJQUFMLENBQVUscUJBQVY7QUFDRDtBQU5ILFNBRE8sRUFTUDtBQUNFSixpQkFBTyxVQURUO0FBRUVDLHVCQUFhLGFBRmYsRUFFOEI7QUFDNUJDLG1CQUFTTCxhQUhYO0FBSUVNLGlCQUFPLGlCQUFNO0FBQ1gsbUJBQUtDLElBQUwsQ0FBVSxzQkFBVjtBQUNEO0FBTkgsU0FUTztBQUZYLE9BOUY2QyxFQW1IN0M7QUFDRUosZUFBTyxXQURUO0FBRUVnQixpQkFBU2pCO0FBRlgsT0FuSDZDLEVBdUg3QztBQUNFQyxlQUFPLE1BRFQ7QUFFRWdCLGlCQUFTLENBQ1A7QUFDRWhCLGlCQUFPLE1BRFQ7QUFFRUcsaUJBQU8saUJBQU07QUFDWCw0QkFBTUksWUFBTixDQUFtQix3QkFBbkI7QUFDRDtBQUpILFNBRE8sRUFPUDtBQUNFUCxpQkFBTyxXQURUO0FBRUVFLG1CQUFTLENBQUMsQ0FBQ04sUUFBUTRCLFdBQVIsQ0FBb0JDLElBQXBCLENBQXlCO0FBQUEsbUJBQVdDLFFBQVFDLFdBQVIsS0FBd0IsZUFBbkM7QUFBQSxXQUF6QixDQUZiO0FBR0V4QixpQkFBTyxpQkFBTTtBQUNYLG1CQUFLQyxJQUFMLENBQVUsd0JBQVY7QUFDRDtBQUxILFNBUE8sRUFjUCxFQUFFSSxNQUFNLFdBQVIsRUFkTyxFQWVQO0FBQ0VSLGlCQUFPLDBCQURUO0FBRUVHLGlCQUFPLGlCQUFNO0FBQ1gsNEJBQU1JLFlBQU4sQ0FBbUIsb0NBQW5CO0FBQ0Q7QUFKSCxTQWZPO0FBRlgsT0F2SDZDLENBQXZCLENBQXhCO0FBaUpBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBOU9rQlosTyIsImZpbGUiOiJUb3BNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBNZW51LCBhcHAsIHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmltcG9ydCB7IEV4cGVyaW1lbnQsIGV4cGVyaW1lbnRJc0VuYWJsZWQgfSBmcm9tICdoYWlrdS1jb21tb24vbGliL2V4cGVyaW1lbnRzJ1xuaW1wb3J0IHsgRXhwb3J0ZXJGb3JtYXQgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZXhwb3J0ZXInXG5cbmFwcC5zZXROYW1lKCdIYWlrdScpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcE1lbnUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjcmVhdGUgKG9wdGlvbnMpIHtcbiAgICBjb25zdCBpc1Byb2plY3RPcGVuID0gISFvcHRpb25zLmZvbGRlclxuICAgIHZhciBkZXZlbG9wZXJNZW51SXRlbXMgPSBbXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnT3BlbiBpbiBUZXh0IEVkaXRvcicsXG4gICAgICAvLyAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK09wdGlvbitFJyxcbiAgICAgIC8vICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgY2xpY2s6ICgpID0+IHtcbiAgICAgIC8vICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Om9wZW4tdGV4dC1lZGl0b3InKVxuICAgICAgLy8gICB9XG4gICAgICAvLyB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ09wZW4gaW4gVGVybWluYWwnLFxuICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtPcHRpb24rVCcsXG4gICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpvcGVuLXRlcm1pbmFsJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cblxuICAgIGNvbnN0IG1haW5NZW51UGllY2VzID0gW11cblxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdBYm91dCBIYWlrdScsXG4gICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vd3d3LmhhaWt1LmFpLycpXG4gICAgICB9XG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnQ2hlY2sgZm9yIHVwZGF0ZXMnLFxuICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpjaGVjay11cGRhdGVzJylcbiAgICAgIH1cbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgdHlwZTogJ3NlcGFyYXRvcidcbiAgICB9KVxuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdzdGFnaW5nJykge1xuICAgICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICAgIGxhYmVsOiAnUmVsb2FkIEhhaWt1JyxcbiAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUicsXG4gICAgICAgIHJvbGU6ICdyZWxvYWQnXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdNaW5pbWl6ZSBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtNJyxcbiAgICAgIHJvbGU6ICdtaW5pbWl6ZSdcbiAgICB9KVxuICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgbGFiZWw6ICdIaWRlIEhhaWt1JyxcbiAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK0gnLFxuICAgICAgcm9sZTogJ2hpZGUnXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzZXBhcmF0b3InXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnUXVpdCBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtRJyxcbiAgICAgIHJvbGU6ICdxdWl0J1xuICAgIH0pXG5cbiAgICBjb25zdCBwcm9qZWN0U3VibWVudSA9IFtcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdQdWJsaXNoJyxcbiAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUycsXG4gICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIGlzUHJvamVjdE9wZW4sXG4gICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzYXZlJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIF1cblxuICAgIGlmIChleHBlcmltZW50SXNFbmFibGVkKEV4cGVyaW1lbnQuTG90dGllRXhwb3J0SW5HbG9iYWxNZW51KSkge1xuICAgICAgcHJvamVjdFN1Ym1lbnUucHVzaCh7XG4gICAgICAgIGxhYmVsOiAnRXhwb3J0JyxcbiAgICAgICAgc3VibWVudTogW3tcbiAgICAgICAgICBsYWJlbDogRXhwb3J0ZXJGb3JtYXQuQm9keW1vdmluLFxuICAgICAgICAgIGVuYWJsZWQ6IGlzUHJvamVjdE9wZW4sXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWQrU2hpZnQrRScsIC8vIFRPRE8oc2FzaGFqb3NlcGgpOiBSZW1vdmUgdGhpcz9cbiAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpleHBvcnQnLCBbRXhwb3J0ZXJGb3JtYXQuQm9keW1vdmluXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KVxuICAgIH1cblxuICAgIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAge1xuICAgICAgICBsYWJlbDogYXBwLmdldE5hbWUoKSxcbiAgICAgICAgc3VibWVudTogbWFpbk1lbnVQaWVjZXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHJvamVjdCcsXG4gICAgICAgIHN1Ym1lbnU6IHByb2plY3RTdWJtZW51XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0VkaXQnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdVbmRvJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcgJiYgb3B0aW9ucy51bmRvYWJsZXMubGVuZ3RoID4gMSwgLy8gSWRpb3N5bmNyYWN5OiBJZiB0aGVyZSBpcyBvbmUgJ3VuZG9hYmxlJywgdGhhdCBpcyBhY3R1YWxseSB0aGUgYm90dG9tbW9zdCBjb21taXQgd2hpY2ggY2FuJ3QgYmUgdW5kb25lLi4uIDpQXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnVuZG8nLCBvcHRpb25zLnVuZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVkbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTaGlmdCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMucmVkb2FibGVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnJlZG8nLCBvcHRpb25zLnJlZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0N1dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtYJyxcbiAgICAgICAgICAgIHJvbGU6ICdjdXQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0NvcHknLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQycsXG4gICAgICAgICAgICByb2xlOiAnY29weSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUGFzdGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVicsXG4gICAgICAgICAgICByb2xlOiAncGFzdGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEZWxldGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdEZWxldGUnLFxuICAgICAgICAgICAgcm9sZTogJ2RlbGV0ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtyb2xlOiAnc2VsZWN0YWxsJ31cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgbGFiZWw6ICdJbnNlcnQnLFxuICAgICAgLy8gICBzdWJtZW51OiBbXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdTaGFwZScsXG4gICAgICAvLyAgICAgICBzdWJtZW51OiBbXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ1JlY3RhbmdsZScsXG4gICAgICAvLyAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdSJyxcbiAgICAgIC8vICAgICAgICAgICBlbmFibGVkOiBpc1Byb2plY3RPcGVuLFxuICAgICAgLy8gICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydzaGFwZScsICdSZWN0YW5nbGUnXSlcbiAgICAgIC8vICAgICAgICAgfSxcbiAgICAgIC8vICAgICAgICAge1xuICAgICAgLy8gICAgICAgICAgIGxhYmVsOiAnT3ZhbCcsXG4gICAgICAvLyAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdPJyxcbiAgICAgIC8vICAgICAgICAgICBlbmFibGVkOiBpc1Byb2plY3RPcGVuLFxuICAgICAgLy8gICAgICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydzaGFwZScsICdPdmFsJ10pXG4gICAgICAvLyAgICAgICAgIH1cbiAgICAgIC8vICAgICAgIF1cbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnVmVjdG9yJyxcbiAgICAgIC8vICAgICAgIGFjY2VsZXJhdG9yOiAnVicsXG4gICAgICAvLyAgICAgICBlbmFibGVkOiBpc1Byb2plY3RPcGVuLFxuICAgICAgLy8gICAgICAgY2xpY2s6ICgpID0+IHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c2V0LXRvb2wnLCBbJ3BlbiddKVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgbGFiZWw6ICdCcnVzaCcsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ0InLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydicnVzaCddKVxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnVGV4dCcsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1QnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWyd0ZXh0J10pXG4gICAgICAvLyAgICAgfVxuICAgICAgLy8gICBdXG4gICAgICAvLyB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ1ZpZXcnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIEluJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1BsdXMnLFxuICAgICAgICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6em9vbS1pbicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1pvb20gT3V0JyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsKy0nLCAvLyBub3QgJ01pbnVzJyA6L1xuICAgICAgICAgICAgZW5hYmxlZDogaXNQcm9qZWN0T3BlbixcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6em9vbS1vdXQnKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdEZXZlbG9wZXInLFxuICAgICAgICBzdWJtZW51OiBkZXZlbG9wZXJNZW51SXRlbXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnSGVscCcsXG4gICAgICAgIHN1Ym1lbnU6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0RvY3MnLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2RvY3MuaGFpa3UuYWkvJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnVGFrZSBUb3VyJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5wcm9qZWN0TGlzdC5maW5kKHByb2plY3QgPT4gcHJvamVjdC5wcm9qZWN0TmFtZSA9PT0gJ0NoZWNrVHV0b3JpYWwnKSxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6c3RhcnQtdG91cicpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdIYWlrdSBDb21tdW5pdHkgb24gU2xhY2snLFxuICAgICAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2hhaWt1LWNvbW11bml0eS5zbGFjay5jb20vJylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKSlcbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG4iXX0=