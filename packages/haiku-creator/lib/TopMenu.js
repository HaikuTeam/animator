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
        enabled: !options.isSaving,
        click: function click() {
          _this2.emit('global-menu:save');
        }
      }];

      if ((0, _experiments.experimentIsEnabled)(_experiments.Experiment.LottieExport)) {
        projectSubmenu.push({
          label: 'Export',
          submenu: [{
            label: _exporter.ExporterFormat.Bodymovin,
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
        // TODO(xifm6diW): disable when there is no active project.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BNZW51LmpzIl0sIm5hbWVzIjpbInNldE5hbWUiLCJUb3BNZW51Iiwib3B0aW9ucyIsImRldmVsb3Blck1lbnVJdGVtcyIsImxhYmVsIiwiYWNjZWxlcmF0b3IiLCJlbmFibGVkIiwiZm9sZGVyIiwiY2xpY2siLCJlbWl0IiwibWFpbk1lbnVQaWVjZXMiLCJwdXNoIiwib3BlbkV4dGVybmFsIiwidHlwZSIsInByb2Nlc3MiLCJlbnYiLCJOT0RFX0VOViIsInJvbGUiLCJwcm9qZWN0U3VibWVudSIsImlzU2F2aW5nIiwiTG90dGllRXhwb3J0Iiwic3VibWVudSIsIkJvZHltb3ZpbiIsInNldEFwcGxpY2F0aW9uTWVudSIsImJ1aWxkRnJvbVRlbXBsYXRlIiwiZ2V0TmFtZSIsInVuZG9hYmxlcyIsImxlbmd0aCIsInJlZG9hYmxlcyIsInByb2plY3RMaXN0IiwiZmluZCIsInByb2plY3QiLCJwcm9qZWN0TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsY0FBSUEsT0FBSixDQUFZLE9BQVo7O0lBRXFCQyxPOzs7Ozs7Ozs7OzsyQkFDWEMsTyxFQUFTO0FBQUE7O0FBQ2YsVUFBSUMscUJBQXFCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFQyxlQUFPLGtCQURUO0FBRUVDLHFCQUFhLG9CQUZmO0FBR0VDLGlCQUFTLENBQUMsQ0FBQ0osUUFBUUssTUFIckI7QUFJRUMsZUFBTyxpQkFBTTtBQUNYLGlCQUFLQyxJQUFMLENBQVUsMkJBQVY7QUFDRDtBQU5ILE9BVHVCLENBQXpCOztBQW1CQSxVQUFNQyxpQkFBaUIsRUFBdkI7O0FBRUFBLHFCQUFlQyxJQUFmLENBQW9CO0FBQ2xCUCxlQUFPLGFBRFc7QUFFbEJJLGVBQU8saUJBQU07QUFDWCwwQkFBTUksWUFBTixDQUFtQix1QkFBbkI7QUFDRDtBQUppQixPQUFwQjtBQU1BRixxQkFB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QVdDLFFBQVFDLFdBQVIsS0FBd0IsZUFBbkM7QUFBQSxXQUF6QixDQUZiO0FBR0V4QixpQkFBTyxpQkFBTTtBQUNYLG1CQUFLQyxJQUFMLENBQVUsd0JBQVY7QUFDRDtBQUxILFNBUE8sRUFjUCxFQUFFSSxNQUFNLFdBQVIsRUFkTyxFQWVQO0FBQ0VULGlCQUFPLDBCQURUO0FBRUVJLGlCQUFPLGlCQUFNO0FBQ1gsNEJBQU1JLFlBQU4sQ0FBbUIsb0NBQW5CO0FBQ0Q7QUFKSCxTQWZPO0FBRlgsT0F2SDZDLENBQXZCLENBQXhCO0FBaUpBLGFBQU8sSUFBUDtBQUNEOzs7Ozs7a0JBNU9rQlgsTyIsImZpbGUiOiJUb3BNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICdldmVudHMnXG5pbXBvcnQgeyBNZW51LCBhcHAsIHNoZWxsIH0gZnJvbSAnZWxlY3Ryb24nXG5cbmltcG9ydCB7IEV4cGVyaW1lbnQsIGV4cGVyaW1lbnRJc0VuYWJsZWQgfSBmcm9tICdoYWlrdS1jb21tb24vbGliL2V4cGVyaW1lbnRzJ1xuaW1wb3J0IHsgRXhwb3J0ZXJGb3JtYXQgfSBmcm9tICdoYWlrdS1zZGstY3JlYXRvci9saWIvZXhwb3J0ZXInXG5cbmFwcC5zZXROYW1lKCdIYWlrdScpXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvcE1lbnUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjcmVhdGUgKG9wdGlvbnMpIHtcbiAgICB2YXIgZGV2ZWxvcGVyTWVudUl0ZW1zID0gW1xuICAgICAgLy8ge1xuICAgICAgLy8gICBsYWJlbDogJ09wZW4gaW4gVGV4dCBFZGl0b3InLFxuICAgICAgLy8gICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtPcHRpb24rRScsXG4gICAgICAvLyAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAvLyAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpvcGVuLXRleHQtZWRpdG9yJylcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdPcGVuIGluIFRlcm1pbmFsJyxcbiAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrT3B0aW9uK1QnLFxuICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMuZm9sZGVyLFxuICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6b3Blbi10ZXJtaW5hbCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdXG5cbiAgICBjb25zdCBtYWluTWVudVBpZWNlcyA9IFtdXG5cbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnQWJvdXQgSGFpa3UnLFxuICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL3d3dy5oYWlrdS5haS8nKVxuICAgICAgfVxuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ0NoZWNrIGZvciB1cGRhdGVzJyxcbiAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW1pdCgnZ2xvYmFsLW1lbnU6Y2hlY2stdXBkYXRlcycpXG4gICAgICB9XG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIHR5cGU6ICdzZXBhcmF0b3InXG4gICAgfSlcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAnc3RhZ2luZycpIHtcbiAgICAgIG1haW5NZW51UGllY2VzLnB1c2goe1xuICAgICAgICBsYWJlbDogJ1JlbG9hZCBIYWlrdScsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1InLFxuICAgICAgICByb2xlOiAncmVsb2FkJ1xuICAgICAgfSlcbiAgICB9XG5cbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnTWluaW1pemUgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrTScsXG4gICAgICByb2xlOiAnbWluaW1pemUnXG4gICAgfSlcbiAgICBtYWluTWVudVBpZWNlcy5wdXNoKHtcbiAgICAgIGxhYmVsOiAnSGlkZSBIYWlrdScsXG4gICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtIJyxcbiAgICAgIHJvbGU6ICdoaWRlJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICB0eXBlOiAnc2VwYXJhdG9yJ1xuICAgIH0pXG4gICAgbWFpbk1lbnVQaWVjZXMucHVzaCh7XG4gICAgICBsYWJlbDogJ1F1aXQgSGFpa3UnLFxuICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrUScsXG4gICAgICByb2xlOiAncXVpdCdcbiAgICB9KVxuXG4gICAgY29uc3QgcHJvamVjdFN1Ym1lbnUgPSBbXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnUHVibGlzaCcsXG4gICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1MnLFxuICAgICAgICBlbmFibGVkOiAhb3B0aW9ucy5pc1NhdmluZyxcbiAgICAgICAgY2xpY2s6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNhdmUnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuXG4gICAgaWYgKGV4cGVyaW1lbnRJc0VuYWJsZWQoRXhwZXJpbWVudC5Mb3R0aWVFeHBvcnQpKSB7XG4gICAgICBwcm9qZWN0U3VibWVudS5wdXNoKHtcbiAgICAgICAgbGFiZWw6ICdFeHBvcnQnLFxuICAgICAgICBzdWJtZW51OiBbe1xuICAgICAgICAgIGxhYmVsOiBFeHBvcnRlckZvcm1hdC5Cb2R5bW92aW4sXG4gICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWQrU2hpZnQrRScsIC8vIFRPRE8oc2FzaGFqb3NlcGgpOiBSZW1vdmUgdGhpcz9cbiAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpleHBvcnQnLCBbRXhwb3J0ZXJGb3JtYXQuQm9keW1vdmluXSlcbiAgICAgICAgICB9XG4gICAgICAgIH1dXG4gICAgICB9KVxuICAgIH1cblxuICAgIE1lbnUuc2V0QXBwbGljYXRpb25NZW51KE1lbnUuYnVpbGRGcm9tVGVtcGxhdGUoW1xuICAgICAge1xuICAgICAgICBsYWJlbDogYXBwLmdldE5hbWUoKSxcbiAgICAgICAgc3VibWVudTogbWFpbk1lbnVQaWVjZXNcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIC8vIFRPRE8oeGlmbTZkaVcpOiBkaXNhYmxlIHdoZW4gdGhlcmUgaXMgbm8gYWN0aXZlIHByb2plY3QuXG4gICAgICAgIGxhYmVsOiAnUHJvamVjdCcsXG4gICAgICAgIHN1Ym1lbnU6IHByb2plY3RTdWJtZW51XG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0VkaXQnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdVbmRvJyxcbiAgICAgICAgICAgIGFjY2VsZXJhdG9yOiAnQ21kT3JDdHJsK1onLFxuICAgICAgICAgICAgZW5hYmxlZDogIW9wdGlvbnMuaXNTYXZpbmcgJiYgb3B0aW9ucy51bmRvYWJsZXMubGVuZ3RoID4gMSwgLy8gSWRpb3N5bmNyYWN5OiBJZiB0aGVyZSBpcyBvbmUgJ3VuZG9hYmxlJywgdGhhdCBpcyBhY3R1YWxseSB0aGUgYm90dG9tbW9zdCBjb21taXQgd2hpY2ggY2FuJ3QgYmUgdW5kb25lLi4uIDpQXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnVuZG8nLCBvcHRpb25zLnVuZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUmVkbycsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtTaGlmdCtaJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6ICFvcHRpb25zLmlzU2F2aW5nICYmIG9wdGlvbnMucmVkb2FibGVzLmxlbmd0aCA+IDAsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnJlZG8nLCBvcHRpb25zLnJlZG9hYmxlcylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0N1dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtYJyxcbiAgICAgICAgICAgIHJvbGU6ICdjdXQnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ0NvcHknLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrQycsXG4gICAgICAgICAgICByb2xlOiAnY29weSdcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnUGFzdGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdDbWRPckN0cmwrVicsXG4gICAgICAgICAgICByb2xlOiAncGFzdGUnXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7IHR5cGU6ICdzZXBhcmF0b3InIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEZWxldGUnLFxuICAgICAgICAgICAgYWNjZWxlcmF0b3I6ICdEZWxldGUnLFxuICAgICAgICAgICAgcm9sZTogJ2RlbGV0ZSdcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAvLyB7XG4gICAgICAvLyAgIGxhYmVsOiAnSW5zZXJ0JyxcbiAgICAgIC8vICAgc3VibWVudTogW1xuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnU2hhcGUnLFxuICAgICAgLy8gICAgICAgc3VibWVudTogW1xuICAgICAgLy8gICAgICAgICB7XG4gICAgICAvLyAgICAgICAgICAgbGFiZWw6ICdSZWN0YW5nbGUnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnUicsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnUmVjdGFuZ2xlJ10pXG4gICAgICAvLyAgICAgICAgIH0sXG4gICAgICAvLyAgICAgICAgIHtcbiAgICAgIC8vICAgICAgICAgICBsYWJlbDogJ092YWwnLFxuICAgICAgLy8gICAgICAgICAgIGFjY2VsZXJhdG9yOiAnTycsXG4gICAgICAvLyAgICAgICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnc2hhcGUnLCAnT3ZhbCddKVxuICAgICAgLy8gICAgICAgICB9XG4gICAgICAvLyAgICAgICBdXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1ZlY3RvcicsXG4gICAgICAvLyAgICAgICBhY2NlbGVyYXRvcjogJ1YnLFxuICAgICAgLy8gICAgICAgZW5hYmxlZDogISFvcHRpb25zLmZvbGRlcixcbiAgICAgIC8vICAgICAgIGNsaWNrOiAoKSA9PiB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnNldC10b29sJywgWydwZW4nXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHtcbiAgICAgIC8vICAgICAgIGxhYmVsOiAnQnJ1c2gnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdCJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsnYnJ1c2gnXSlcbiAgICAgIC8vICAgICB9LFxuICAgICAgLy8gICAgIHsgdHlwZTogJ3NlcGFyYXRvcicgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBsYWJlbDogJ1RleHQnLFxuICAgICAgLy8gICAgICAgYWNjZWxlcmF0b3I6ICdUJyxcbiAgICAgIC8vICAgICAgIGVuYWJsZWQ6ICEhb3B0aW9ucy5mb2xkZXIsXG4gICAgICAvLyAgICAgICBjbGljazogKCkgPT4gdGhpcy5lbWl0KCdnbG9iYWwtbWVudTpzZXQtdG9vbCcsIFsndGV4dCddKVxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXVxuICAgICAgLy8gfSxcbiAgICAgIHtcbiAgICAgICAgbGFiZWw6ICdWaWV3JyxcbiAgICAgICAgc3VibWVudTogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnWm9vbSBJbicsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCtQbHVzJyxcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20taW4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdab29tIE91dCcsXG4gICAgICAgICAgICBhY2NlbGVyYXRvcjogJ0NtZE9yQ3RybCstJywgLy8gbm90ICdNaW51cycgOi9cbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51Onpvb20tb3V0JylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGxhYmVsOiAnRGV2ZWxvcGVyJyxcbiAgICAgICAgc3VibWVudTogZGV2ZWxvcGVyTWVudUl0ZW1zXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBsYWJlbDogJ0hlbHAnLFxuICAgICAgICBzdWJtZW51OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgbGFiZWw6ICdEb2NzJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9kb2NzLmhhaWt1LmFpLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBsYWJlbDogJ1Rha2UgVG91cicsXG4gICAgICAgICAgICBlbmFibGVkOiAhIW9wdGlvbnMucHJvamVjdExpc3QuZmluZChwcm9qZWN0ID0+IHByb2plY3QucHJvamVjdE5hbWUgPT09ICdDaGVja1R1dG9yaWFsJyksXG4gICAgICAgICAgICBjbGljazogKCkgPT4ge1xuICAgICAgICAgICAgICB0aGlzLmVtaXQoJ2dsb2JhbC1tZW51OnN0YXJ0LXRvdXInKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgeyB0eXBlOiAnc2VwYXJhdG9yJyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGxhYmVsOiAnSGFpa3UgQ29tbXVuaXR5IG9uIFNsYWNrJyxcbiAgICAgICAgICAgIGNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgICAgIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9oYWlrdS1jb21tdW5pdHkuc2xhY2suY29tLycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSkpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxufVxuIl19