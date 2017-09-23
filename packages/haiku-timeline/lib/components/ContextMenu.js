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
    remote = _require2.remote;

var Menu = remote.Menu,
    MenuItem = remote.MenuItem;

var _require3 = require('haiku-serialization/src/utils/HaikuHomeDir'),
    HOMEDIR_PATH = _require3.HOMEDIR_PATH;

var fse = require('haiku-fs-extra');

fse.mkdirpSync(HOMEDIR_PATH);

var ContextMenu = function (_EventEmitter) {
  _inherits(ContextMenu, _EventEmitter);

  function ContextMenu(window, react) {
    _classCallCheck(this, ContextMenu);

    var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).call(this));

    _this.window = window;
    _this.react = react;
    _this._menu = null; // ::Menu
    return _this;
  }

  _createClass(ContextMenu, [{
    key: 'rebuild',
    value: function rebuild(options) {
      var _this2 = this;

      this._menu = new Menu();

      if (options.type === 'keyframe') {
        this._menu.append(new MenuItem({
          label: 'Nudge Left',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'left', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf);
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Nudge Right',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'left', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf);
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Delete Keyframe',
          click: function click(event) {
            _this2.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.startMs);
          }
        }));
      } else if (options.type === 'keyframe-segment') {
        this._menu.append(new MenuItem({
          label: 'Make Tween',
          submenu: curvesMenu(options.curve, function (event, curveName) {
            _this2.emit('joinKeyframes', options.componentId, options.timelineName, options.elementName, options.propertyName, options.startMs, options.endMs, curveName);
          })
        }));

        this._menu.append(new MenuItem({
          label: 'Create Keyframe',
          click: function click(event) {
            _this2.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs);
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Nudge Left',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf);
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Nudge Right',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf);
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Delete Left Keyframe',
          click: function click(event) {
            _this2.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.startMs);
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Delete Right Keyframe',
          click: function click(event) {
            _this2.emit('deleteKeyframe', options.componentId, options.timelineName, options.propertyName, options.endMs);
          }
        }));
      } else if (options.type === 'keyframe-transition') {
        this._menu.append(new MenuItem({
          label: 'Change Curve',
          submenu: curvesMenu(options.curve, function (event, curveName) {
            _this2.emit('changeSegmentCurve', options.componentId, options.timelineName, options.propertyName, options.startMs, curveName);
          })
        }));

        this._menu.append(new MenuItem({
          label: 'Create Keyframe',
          click: function click(event) {
            _this2.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs);
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Remove Tween',
          click: function click(event) {
            _this2.emit('splitSegment', options.componentId, options.timelineName, options.elementName, options.propertyName, options.startMs);
          }
        }));

        this._menu.append(new MenuItem({ type: 'separator' }));

        this._menu.append(new MenuItem({
          label: 'Nudge Left',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs - options.frameInfo.mspf);
          }
        }));

        this._menu.append(new MenuItem({
          label: 'Nudge Right',
          click: function click(event) {
            _this2.emit('moveSegmentEndpoints', options.componentId, options.timelineName, options.propertyName, 'body', options.keyframeIndex, options.startMs, options.startMs + options.frameInfo.mspf);
          }
        }));
      } else if (options.type === 'property-row') {
        this._menu.append(new MenuItem({
          label: 'Create Keyframe',
          click: function click(event) {
            _this2.emit('createKeyframe', options.componentId, options.timelineName, options.elementName, options.propertyName, options.clickedMs);
          }
        }));
      }
    }
  }, {
    key: 'show',
    value: function show(options) {
      var _this3 = this;

      this.window.setTimeout(function () {
        _this3.rebuild(options);
        _this3._menu.popup(remote.getCurrentWindow());
      }, 64);
    }
  }]);

  return ContextMenu;
}(EventEmitter);

exports.default = ContextMenu;


function curvesMenu(maybeCurve, cb) {
  var menu = new Menu();

  menu.append(new MenuItem({
    label: 'Linear',
    enabled: maybeCurve !== 'linear' && maybeCurve !== 'Linear',
    click: function click(event) {
      return cb(event, 'linear');
    }
  }));

  menu.append(new MenuItem({
    label: 'Ease In',
    submenu: curveTypeMenu('easeIn', maybeCurve, cb)
  }));

  menu.append(new MenuItem({
    label: 'Ease Out',
    submenu: curveTypeMenu('easeOut', maybeCurve, cb)
  }));

  menu.append(new MenuItem({
    label: 'Ease In Out',
    submenu: curveTypeMenu('easeInOut', maybeCurve, cb)
  }));

  // menu.append(new MenuItem({
  //   label: 'Cubic Bezier',
  //   submenu: curveTypeMenu('cubicBezier', maybeCurve, cb)
  // }))

  return menu;
}

function curveTypeMenu(baseCurve, maybeCurve, cb) {
  var menu = new Menu();

  menu.append(new MenuItem({
    label: 'Back',
    enabled: maybeCurve !== baseCurve + 'Back',
    click: function click(event) {
      return cb(event, baseCurve + 'Back');
    }
  }));

  menu.append(new MenuItem({
    label: 'Bounce',
    enabled: maybeCurve !== baseCurve + 'Bounce',
    click: function click(event) {
      return cb(event, baseCurve + 'Bounce');
    }
  }));

  menu.append(new MenuItem({
    label: 'Circ',
    enabled: maybeCurve !== baseCurve + 'Circ',
    click: function click(event) {
      return cb(event, baseCurve + 'Circ');
    }
  }));

  menu.append(new MenuItem({
    label: 'Cubic',
    enabled: maybeCurve !== baseCurve + 'Cubic',
    click: function click(event) {
      return cb(event, baseCurve + 'Cubic');
    }
  }));

  menu.append(new MenuItem({
    label: 'Elastic',
    enabled: maybeCurve !== baseCurve + 'Elastic',
    click: function click(event) {
      return cb(event, baseCurve + 'Elastic');
    }
  }));

  menu.append(new MenuItem({
    label: 'Expo',
    enabled: maybeCurve !== baseCurve + 'Expo',
    click: function click(event) {
      return cb(event, baseCurve + 'Expo');
    }
  }));

  menu.append(new MenuItem({
    label: 'Quad',
    enabled: maybeCurve !== baseCurve + 'Quad',
    click: function click(event) {
      return cb(event, baseCurve + 'Quad');
    }
  }));

  menu.append(new MenuItem({
    label: 'Quart',
    enabled: maybeCurve !== baseCurve + 'Quart',
    click: function click(event) {
      return cb(event, baseCurve + 'Quart');
    }
  }));

  menu.append(new MenuItem({
    label: 'Quint',
    enabled: maybeCurve !== baseCurve + 'Quint',
    click: function click(event) {
      return cb(event, baseCurve + 'Quint');
    }
  }));

  menu.append(new MenuItem({
    label: 'Sine',
    enabled: maybeCurve !== baseCurve + 'Sine',
    click: function click(event) {
      return cb(event, baseCurve + 'Sine');
    }
  }));

  return menu;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL0NvbnRleHRNZW51LmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCJFdmVudEVtaXR0ZXIiLCJyZW1vdGUiLCJNZW51IiwiTWVudUl0ZW0iLCJIT01FRElSX1BBVEgiLCJmc2UiLCJta2RpcnBTeW5jIiwiQ29udGV4dE1lbnUiLCJ3aW5kb3ciLCJyZWFjdCIsIl9tZW51Iiwib3B0aW9ucyIsInR5cGUiLCJhcHBlbmQiLCJsYWJlbCIsImNsaWNrIiwiZXZlbnQiLCJlbWl0IiwiY29tcG9uZW50SWQiLCJ0aW1lbGluZU5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJrZXlmcmFtZUluZGV4Iiwic3RhcnRNcyIsImZyYW1lSW5mbyIsIm1zcGYiLCJzdWJtZW51IiwiY3VydmVzTWVudSIsImN1cnZlIiwiY3VydmVOYW1lIiwiZWxlbWVudE5hbWUiLCJlbmRNcyIsImNsaWNrZWRNcyIsInNldFRpbWVvdXQiLCJyZWJ1aWxkIiwicG9wdXAiLCJnZXRDdXJyZW50V2luZG93IiwibWF5YmVDdXJ2ZSIsImNiIiwibWVudSIsImVuYWJsZWQiLCJjdXJ2ZVR5cGVNZW51IiwiYmFzZUN1cnZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztlQUF5QkEsUUFBUSxRQUFSLEM7SUFBakJDLFksWUFBQUEsWTs7Z0JBQ1dELFFBQVEsVUFBUixDO0lBQVhFLE0sYUFBQUEsTTs7SUFDQUMsSSxHQUFtQkQsTSxDQUFuQkMsSTtJQUFNQyxRLEdBQWFGLE0sQ0FBYkUsUTs7Z0JBQ1dKLFFBQVEsNENBQVIsQztJQUFqQkssWSxhQUFBQSxZOztBQUNSLElBQUlDLE1BQU1OLFFBQVEsZ0JBQVIsQ0FBVjs7QUFFQU0sSUFBSUMsVUFBSixDQUFlRixZQUFmOztJQUVxQkcsVzs7O0FBQ25CLHVCQUFhQyxNQUFiLEVBQXFCQyxLQUFyQixFQUE0QjtBQUFBOztBQUFBOztBQUUxQixVQUFLRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxVQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxVQUFLQyxLQUFMLEdBQWEsSUFBYixDQUowQixDQUlSO0FBSlE7QUFLM0I7Ozs7NEJBRVFDLE8sRUFBUztBQUFBOztBQUNoQixXQUFLRCxLQUFMLEdBQWEsSUFBSVIsSUFBSixFQUFiOztBQUVBLFVBQUlTLFFBQVFDLElBQVIsS0FBaUIsVUFBckIsRUFBaUM7QUFDL0IsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sWUFEc0I7QUFFN0JDLGlCQUFPLGVBQUNDLEtBQUQsRUFBVztBQUNoQixtQkFBS0MsSUFBTCxDQUFVLHNCQUFWLEVBQWtDTixRQUFRTyxXQUExQyxFQUF1RFAsUUFBUVEsWUFBL0QsRUFBNkVSLFFBQVFTLFlBQXJGLEVBQW1HLE1BQW5HLEVBQTJHVCxRQUFRVSxhQUFuSCxFQUFrSVYsUUFBUVcsT0FBMUksRUFBbUpYLFFBQVFXLE9BQVIsR0FBa0JYLFFBQVFZLFNBQVIsQ0FBa0JDLElBQXZMO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjs7QUFPQSxhQUFLZCxLQUFMLENBQVdHLE1BQVgsQ0FBa0IsSUFBSVYsUUFBSixDQUFhO0FBQzdCVyxpQkFBTyxhQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsc0JBQVYsRUFBa0NOLFFBQVFPLFdBQTFDLEVBQXVEUCxRQUFRUSxZQUEvRCxFQUE2RVIsUUFBUVMsWUFBckYsRUFBbUcsTUFBbkcsRUFBMkdULFFBQVFVLGFBQW5ILEVBQWtJVixRQUFRVyxPQUExSSxFQUFtSlgsUUFBUVcsT0FBUixHQUFrQlgsUUFBUVksU0FBUixDQUFrQkMsSUFBdkw7QUFDRDtBQUo0QixTQUFiLENBQWxCOztBQU9BLGFBQUtkLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWEsRUFBRVMsTUFBTSxXQUFSLEVBQWIsQ0FBbEI7O0FBRUEsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8saUJBRHNCO0FBRTdCQyxpQkFBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsbUJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0Qk4sUUFBUU8sV0FBcEMsRUFBaURQLFFBQVFRLFlBQXpELEVBQXVFUixRQUFRUyxZQUEvRSxFQUE2RlQsUUFBUVcsT0FBckc7QUFDRDtBQUo0QixTQUFiLENBQWxCO0FBTUQsT0F2QkQsTUF1Qk8sSUFBSVgsUUFBUUMsSUFBUixLQUFpQixrQkFBckIsRUFBeUM7QUFDOUMsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sWUFEc0I7QUFFN0JXLG1CQUFTQyxXQUFXZixRQUFRZ0IsS0FBbkIsRUFBMEIsVUFBQ1gsS0FBRCxFQUFRWSxTQUFSLEVBQXNCO0FBQ3ZELG1CQUFLWCxJQUFMLENBQVUsZUFBVixFQUEyQk4sUUFBUU8sV0FBbkMsRUFBZ0RQLFFBQVFRLFlBQXhELEVBQXNFUixRQUFRa0IsV0FBOUUsRUFBMkZsQixRQUFRUyxZQUFuRyxFQUFpSFQsUUFBUVcsT0FBekgsRUFBa0lYLFFBQVFtQixLQUExSSxFQUFpSkYsU0FBako7QUFDRCxXQUZRO0FBRm9CLFNBQWIsQ0FBbEI7O0FBT0EsYUFBS2xCLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWE7QUFDN0JXLGlCQUFPLGlCQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJOLFFBQVFPLFdBQXBDLEVBQWlEUCxRQUFRUSxZQUF6RCxFQUF1RVIsUUFBUWtCLFdBQS9FLEVBQTRGbEIsUUFBUVMsWUFBcEcsRUFBa0hULFFBQVFvQixTQUExSDtBQUNEO0FBSjRCLFNBQWIsQ0FBbEI7O0FBT0EsYUFBS3JCLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWEsRUFBRVMsTUFBTSxXQUFSLEVBQWIsQ0FBbEI7O0FBRUEsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sWUFEc0I7QUFFN0JDLGlCQUFPLGVBQUNDLEtBQUQsRUFBVztBQUNoQixtQkFBS0MsSUFBTCxDQUFVLHNCQUFWLEVBQWtDTixRQUFRTyxXQUExQyxFQUF1RFAsUUFBUVEsWUFBL0QsRUFBNkVSLFFBQVFTLFlBQXJGLEVBQW1HLE1BQW5HLEVBQTJHVCxRQUFRVSxhQUFuSCxFQUFrSVYsUUFBUVcsT0FBMUksRUFBbUpYLFFBQVFXLE9BQVIsR0FBa0JYLFFBQVFZLFNBQVIsQ0FBa0JDLElBQXZMO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjs7QUFPQSxhQUFLZCxLQUFMLENBQVdHLE1BQVgsQ0FBa0IsSUFBSVYsUUFBSixDQUFhO0FBQzdCVyxpQkFBTyxhQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsc0JBQVYsRUFBa0NOLFFBQVFPLFdBQTFDLEVBQXVEUCxRQUFRUSxZQUEvRCxFQUE2RVIsUUFBUVMsWUFBckYsRUFBbUcsTUFBbkcsRUFBMkdULFFBQVFVLGFBQW5ILEVBQWtJVixRQUFRVyxPQUExSSxFQUFtSlgsUUFBUVcsT0FBUixHQUFrQlgsUUFBUVksU0FBUixDQUFrQkMsSUFBdkw7QUFDRDtBQUo0QixTQUFiLENBQWxCOztBQU9BLGFBQUtkLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWEsRUFBRVMsTUFBTSxXQUFSLEVBQWIsQ0FBbEI7O0FBRUEsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sc0JBRHNCO0FBRTdCQyxpQkFBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsbUJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0Qk4sUUFBUU8sV0FBcEMsRUFBaURQLFFBQVFRLFlBQXpELEVBQXVFUixRQUFRUyxZQUEvRSxFQUE2RlQsUUFBUVcsT0FBckc7QUFDRDtBQUo0QixTQUFiLENBQWxCOztBQU9BLGFBQUtaLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWE7QUFDN0JXLGlCQUFPLHVCQURzQjtBQUU3QkMsaUJBQU8sZUFBQ0MsS0FBRCxFQUFXO0FBQ2hCLG1CQUFLQyxJQUFMLENBQVUsZ0JBQVYsRUFBNEJOLFFBQVFPLFdBQXBDLEVBQWlEUCxRQUFRUSxZQUF6RCxFQUF1RVIsUUFBUVMsWUFBL0UsRUFBNkZULFFBQVFtQixLQUFyRztBQUNEO0FBSjRCLFNBQWIsQ0FBbEI7QUFNRCxPQTlDTSxNQThDQSxJQUFJbkIsUUFBUUMsSUFBUixLQUFpQixxQkFBckIsRUFBNEM7QUFDakQsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sY0FEc0I7QUFFN0JXLG1CQUFTQyxXQUFXZixRQUFRZ0IsS0FBbkIsRUFBMEIsVUFBQ1gsS0FBRCxFQUFRWSxTQUFSLEVBQXNCO0FBQ3ZELG1CQUFLWCxJQUFMLENBQVUsb0JBQVYsRUFBZ0NOLFFBQVFPLFdBQXhDLEVBQXFEUCxRQUFRUSxZQUE3RCxFQUEyRVIsUUFBUVMsWUFBbkYsRUFBaUdULFFBQVFXLE9BQXpHLEVBQWtITSxTQUFsSDtBQUNELFdBRlE7QUFGb0IsU0FBYixDQUFsQjs7QUFPQSxhQUFLbEIsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8saUJBRHNCO0FBRTdCQyxpQkFBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsbUJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0Qk4sUUFBUU8sV0FBcEMsRUFBaURQLFFBQVFRLFlBQXpELEVBQXVFUixRQUFRa0IsV0FBL0UsRUFBNEZsQixRQUFRUyxZQUFwRyxFQUFrSFQsUUFBUW9CLFNBQTFIO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjs7QUFPQSxhQUFLckIsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sY0FEc0I7QUFFN0JDLGlCQUFPLGVBQUNDLEtBQUQsRUFBVztBQUNoQixtQkFBS0MsSUFBTCxDQUFVLGNBQVYsRUFBMEJOLFFBQVFPLFdBQWxDLEVBQStDUCxRQUFRUSxZQUF2RCxFQUFxRVIsUUFBUWtCLFdBQTdFLEVBQTBGbEIsUUFBUVMsWUFBbEcsRUFBZ0hULFFBQVFXLE9BQXhIO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjs7QUFPQSxhQUFLWixLQUFMLENBQVdHLE1BQVgsQ0FBa0IsSUFBSVYsUUFBSixDQUFhLEVBQUVTLE1BQU0sV0FBUixFQUFiLENBQWxCOztBQUVBLGFBQUtGLEtBQUwsQ0FBV0csTUFBWCxDQUFrQixJQUFJVixRQUFKLENBQWE7QUFDN0JXLGlCQUFPLFlBRHNCO0FBRTdCQyxpQkFBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsbUJBQUtDLElBQUwsQ0FBVSxzQkFBVixFQUFrQ04sUUFBUU8sV0FBMUMsRUFBdURQLFFBQVFRLFlBQS9ELEVBQTZFUixRQUFRUyxZQUFyRixFQUFtRyxNQUFuRyxFQUEyR1QsUUFBUVUsYUFBbkgsRUFBa0lWLFFBQVFXLE9BQTFJLEVBQW1KWCxRQUFRVyxPQUFSLEdBQWtCWCxRQUFRWSxTQUFSLENBQWtCQyxJQUF2TDtBQUNEO0FBSjRCLFNBQWIsQ0FBbEI7O0FBT0EsYUFBS2QsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8sYUFEc0I7QUFFN0JDLGlCQUFPLGVBQUNDLEtBQUQsRUFBVztBQUNoQixtQkFBS0MsSUFBTCxDQUFVLHNCQUFWLEVBQWtDTixRQUFRTyxXQUExQyxFQUF1RFAsUUFBUVEsWUFBL0QsRUFBNkVSLFFBQVFTLFlBQXJGLEVBQW1HLE1BQW5HLEVBQTJHVCxRQUFRVSxhQUFuSCxFQUFrSVYsUUFBUVcsT0FBMUksRUFBbUpYLFFBQVFXLE9BQVIsR0FBa0JYLFFBQVFZLFNBQVIsQ0FBa0JDLElBQXZMO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjtBQU1ELE9BckNNLE1BcUNBLElBQUliLFFBQVFDLElBQVIsS0FBaUIsY0FBckIsRUFBcUM7QUFDMUMsYUFBS0YsS0FBTCxDQUFXRyxNQUFYLENBQWtCLElBQUlWLFFBQUosQ0FBYTtBQUM3QlcsaUJBQU8saUJBRHNCO0FBRTdCQyxpQkFBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsbUJBQUtDLElBQUwsQ0FBVSxnQkFBVixFQUE0Qk4sUUFBUU8sV0FBcEMsRUFBaURQLFFBQVFRLFlBQXpELEVBQXVFUixRQUFRa0IsV0FBL0UsRUFBNEZsQixRQUFRUyxZQUFwRyxFQUFrSFQsUUFBUW9CLFNBQTFIO0FBQ0Q7QUFKNEIsU0FBYixDQUFsQjtBQU1EO0FBQ0Y7Ozt5QkFFS3BCLE8sRUFBUztBQUFBOztBQUNiLFdBQUtILE1BQUwsQ0FBWXdCLFVBQVosQ0FBdUIsWUFBTTtBQUMzQixlQUFLQyxPQUFMLENBQWF0QixPQUFiO0FBQ0EsZUFBS0QsS0FBTCxDQUFXd0IsS0FBWCxDQUFpQmpDLE9BQU9rQyxnQkFBUCxFQUFqQjtBQUNELE9BSEQsRUFHRyxFQUhIO0FBSUQ7Ozs7RUFwSXNDbkMsWTs7a0JBQXBCTyxXOzs7QUF1SXJCLFNBQVNtQixVQUFULENBQXFCVSxVQUFyQixFQUFpQ0MsRUFBakMsRUFBcUM7QUFDbkMsTUFBSUMsT0FBTyxJQUFJcEMsSUFBSixFQUFYOztBQUVBb0MsT0FBS3pCLE1BQUwsQ0FBWSxJQUFJVixRQUFKLENBQWE7QUFDdkJXLFdBQU8sUUFEZ0I7QUFFdkJ5QixhQUFTSCxlQUFlLFFBQWYsSUFBMkJBLGVBQWUsUUFGNUI7QUFHdkJyQixXQUFPLGVBQUNDLEtBQUQsRUFBVztBQUNoQixhQUFPcUIsR0FBR3JCLEtBQUgsRUFBVSxRQUFWLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFzQixPQUFLekIsTUFBTCxDQUFZLElBQUlWLFFBQUosQ0FBYTtBQUN2QlcsV0FBTyxTQURnQjtBQUV2QlcsYUFBU2UsY0FBYyxRQUFkLEVBQXdCSixVQUF4QixFQUFvQ0MsRUFBcEM7QUFGYyxHQUFiLENBQVo7O0FBS0FDLE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLFVBRGdCO0FBRXZCVyxhQUFTZSxjQUFjLFNBQWQsRUFBeUJKLFVBQXpCLEVBQXFDQyxFQUFyQztBQUZjLEdBQWIsQ0FBWjs7QUFLQUMsT0FBS3pCLE1BQUwsQ0FBWSxJQUFJVixRQUFKLENBQWE7QUFDdkJXLFdBQU8sYUFEZ0I7QUFFdkJXLGFBQVNlLGNBQWMsV0FBZCxFQUEyQkosVUFBM0IsRUFBdUNDLEVBQXZDO0FBRmMsR0FBYixDQUFaOztBQUtBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQU9DLElBQVA7QUFDRDs7QUFFRCxTQUFTRSxhQUFULENBQXdCQyxTQUF4QixFQUFtQ0wsVUFBbkMsRUFBK0NDLEVBQS9DLEVBQW1EO0FBQ2pELE1BQUlDLE9BQU8sSUFBSXBDLElBQUosRUFBWDs7QUFFQW9DLE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE1BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxNQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE1BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLFFBRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxRQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLFFBQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE1BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxNQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE1BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE9BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxPQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE9BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLFNBRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxTQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLFNBQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE1BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxNQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE1BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE1BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxNQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE1BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE9BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxPQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE9BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE9BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxPQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE9BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUFILE9BQUt6QixNQUFMLENBQVksSUFBSVYsUUFBSixDQUFhO0FBQ3ZCVyxXQUFPLE1BRGdCO0FBRXZCeUIsYUFBU0gsZUFBZUssWUFBWSxNQUZiO0FBR3ZCMUIsV0FBTyxlQUFDQyxLQUFELEVBQVc7QUFDaEIsYUFBT3FCLEdBQUdyQixLQUFILEVBQVV5QixZQUFZLE1BQXRCLENBQVA7QUFDRDtBQUxzQixHQUFiLENBQVo7O0FBUUEsU0FBT0gsSUFBUDtBQUNEIiwiZmlsZSI6IkNvbnRleHRNZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgeyBFdmVudEVtaXR0ZXIgfSA9IHJlcXVpcmUoJ2V2ZW50cycpXG5jb25zdCB7IHJlbW90ZSB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgeyBNZW51LCBNZW51SXRlbSB9ID0gcmVtb3RlXG5jb25zdCB7IEhPTUVESVJfUEFUSCB9ID0gcmVxdWlyZSgnaGFpa3Utc2VyaWFsaXphdGlvbi9zcmMvdXRpbHMvSGFpa3VIb21lRGlyJylcbnZhciBmc2UgPSByZXF1aXJlKCdoYWlrdS1mcy1leHRyYScpXG5cbmZzZS5ta2RpcnBTeW5jKEhPTUVESVJfUEFUSClcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGV4dE1lbnUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvciAod2luZG93LCByZWFjdCkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLndpbmRvdyA9IHdpbmRvd1xuICAgIHRoaXMucmVhY3QgPSByZWFjdFxuICAgIHRoaXMuX21lbnUgPSBudWxsIC8vIDo6TWVudVxuICB9XG5cbiAgcmVidWlsZCAob3B0aW9ucykge1xuICAgIHRoaXMuX21lbnUgPSBuZXcgTWVudSgpXG5cbiAgICBpZiAob3B0aW9ucy50eXBlID09PSAna2V5ZnJhbWUnKSB7XG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ051ZGdlIExlZnQnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlU2VnbWVudEVuZHBvaW50cycsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgJ2xlZnQnLCBvcHRpb25zLmtleWZyYW1lSW5kZXgsIG9wdGlvbnMuc3RhcnRNcywgb3B0aW9ucy5zdGFydE1zIC0gb3B0aW9ucy5mcmFtZUluZm8ubXNwZilcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnTnVkZ2UgUmlnaHQnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlU2VnbWVudEVuZHBvaW50cycsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgJ2xlZnQnLCBvcHRpb25zLmtleWZyYW1lSW5kZXgsIG9wdGlvbnMuc3RhcnRNcywgb3B0aW9ucy5zdGFydE1zICsgb3B0aW9ucy5mcmFtZUluZm8ubXNwZilcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IHR5cGU6ICdzZXBhcmF0b3InIH0pKVxuXG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ0RlbGV0ZSBLZXlmcmFtZScsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2RlbGV0ZUtleWZyYW1lJywgb3B0aW9ucy5jb21wb25lbnRJZCwgb3B0aW9ucy50aW1lbGluZU5hbWUsIG9wdGlvbnMucHJvcGVydHlOYW1lLCBvcHRpb25zLnN0YXJ0TXMpXG4gICAgICAgIH1cbiAgICAgIH0pKVxuICAgIH0gZWxzZSBpZiAob3B0aW9ucy50eXBlID09PSAna2V5ZnJhbWUtc2VnbWVudCcpIHtcbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnTWFrZSBUd2VlbicsXG4gICAgICAgIHN1Ym1lbnU6IGN1cnZlc01lbnUob3B0aW9ucy5jdXJ2ZSwgKGV2ZW50LCBjdXJ2ZU5hbWUpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2pvaW5LZXlmcmFtZXMnLCBvcHRpb25zLmNvbXBvbmVudElkLCBvcHRpb25zLnRpbWVsaW5lTmFtZSwgb3B0aW9ucy5lbGVtZW50TmFtZSwgb3B0aW9ucy5wcm9wZXJ0eU5hbWUsIG9wdGlvbnMuc3RhcnRNcywgb3B0aW9ucy5lbmRNcywgY3VydmVOYW1lKVxuICAgICAgICB9KVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnQ3JlYXRlIEtleWZyYW1lJyxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY3JlYXRlS2V5ZnJhbWUnLCBvcHRpb25zLmNvbXBvbmVudElkLCBvcHRpb25zLnRpbWVsaW5lTmFtZSwgb3B0aW9ucy5lbGVtZW50TmFtZSwgb3B0aW9ucy5wcm9wZXJ0eU5hbWUsIG9wdGlvbnMuY2xpY2tlZE1zKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnTnVkZ2UgTGVmdCcsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgb3B0aW9ucy5jb21wb25lbnRJZCwgb3B0aW9ucy50aW1lbGluZU5hbWUsIG9wdGlvbnMucHJvcGVydHlOYW1lLCAnYm9keScsIG9wdGlvbnMua2V5ZnJhbWVJbmRleCwgb3B0aW9ucy5zdGFydE1zLCBvcHRpb25zLnN0YXJ0TXMgLSBvcHRpb25zLmZyYW1lSW5mby5tc3BmKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdOdWRnZSBSaWdodCcsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ21vdmVTZWdtZW50RW5kcG9pbnRzJywgb3B0aW9ucy5jb21wb25lbnRJZCwgb3B0aW9ucy50aW1lbGluZU5hbWUsIG9wdGlvbnMucHJvcGVydHlOYW1lLCAnYm9keScsIG9wdGlvbnMua2V5ZnJhbWVJbmRleCwgb3B0aW9ucy5zdGFydE1zLCBvcHRpb25zLnN0YXJ0TXMgKyBvcHRpb25zLmZyYW1lSW5mby5tc3BmKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHsgdHlwZTogJ3NlcGFyYXRvcicgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnRGVsZXRlIExlZnQgS2V5ZnJhbWUnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdkZWxldGVLZXlmcmFtZScsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgb3B0aW9ucy5zdGFydE1zKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdEZWxldGUgUmlnaHQgS2V5ZnJhbWUnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdkZWxldGVLZXlmcmFtZScsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgb3B0aW9ucy5lbmRNcylcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09ICdrZXlmcmFtZS10cmFuc2l0aW9uJykge1xuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdDaGFuZ2UgQ3VydmUnLFxuICAgICAgICBzdWJtZW51OiBjdXJ2ZXNNZW51KG9wdGlvbnMuY3VydmUsIChldmVudCwgY3VydmVOYW1lKSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2VTZWdtZW50Q3VydmUnLCBvcHRpb25zLmNvbXBvbmVudElkLCBvcHRpb25zLnRpbWVsaW5lTmFtZSwgb3B0aW9ucy5wcm9wZXJ0eU5hbWUsIG9wdGlvbnMuc3RhcnRNcywgY3VydmVOYW1lKVxuICAgICAgICB9KVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnQ3JlYXRlIEtleWZyYW1lJyxcbiAgICAgICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgICAgIHRoaXMuZW1pdCgnY3JlYXRlS2V5ZnJhbWUnLCBvcHRpb25zLmNvbXBvbmVudElkLCBvcHRpb25zLnRpbWVsaW5lTmFtZSwgb3B0aW9ucy5lbGVtZW50TmFtZSwgb3B0aW9ucy5wcm9wZXJ0eU5hbWUsIG9wdGlvbnMuY2xpY2tlZE1zKVxuICAgICAgICB9XG4gICAgICB9KSlcblxuICAgICAgdGhpcy5fbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICAgICAgbGFiZWw6ICdSZW1vdmUgVHdlZW4nLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdzcGxpdFNlZ21lbnQnLCBvcHRpb25zLmNvbXBvbmVudElkLCBvcHRpb25zLnRpbWVsaW5lTmFtZSwgb3B0aW9ucy5lbGVtZW50TmFtZSwgb3B0aW9ucy5wcm9wZXJ0eU5hbWUsIG9wdGlvbnMuc3RhcnRNcylcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7IHR5cGU6ICdzZXBhcmF0b3InIH0pKVxuXG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ051ZGdlIExlZnQnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlU2VnbWVudEVuZHBvaW50cycsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgJ2JvZHknLCBvcHRpb25zLmtleWZyYW1lSW5kZXgsIG9wdGlvbnMuc3RhcnRNcywgb3B0aW9ucy5zdGFydE1zIC0gb3B0aW9ucy5mcmFtZUluZm8ubXNwZilcbiAgICAgICAgfVxuICAgICAgfSkpXG5cbiAgICAgIHRoaXMuX21lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgICAgIGxhYmVsOiAnTnVkZ2UgUmlnaHQnLFxuICAgICAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdtb3ZlU2VnbWVudEVuZHBvaW50cycsIG9wdGlvbnMuY29tcG9uZW50SWQsIG9wdGlvbnMudGltZWxpbmVOYW1lLCBvcHRpb25zLnByb3BlcnR5TmFtZSwgJ2JvZHknLCBvcHRpb25zLmtleWZyYW1lSW5kZXgsIG9wdGlvbnMuc3RhcnRNcywgb3B0aW9ucy5zdGFydE1zICsgb3B0aW9ucy5mcmFtZUluZm8ubXNwZilcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfSBlbHNlIGlmIChvcHRpb25zLnR5cGUgPT09ICdwcm9wZXJ0eS1yb3cnKSB7XG4gICAgICB0aGlzLl9tZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgICAgICBsYWJlbDogJ0NyZWF0ZSBLZXlmcmFtZScsXG4gICAgICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2NyZWF0ZUtleWZyYW1lJywgb3B0aW9ucy5jb21wb25lbnRJZCwgb3B0aW9ucy50aW1lbGluZU5hbWUsIG9wdGlvbnMuZWxlbWVudE5hbWUsIG9wdGlvbnMucHJvcGVydHlOYW1lLCBvcHRpb25zLmNsaWNrZWRNcylcbiAgICAgICAgfVxuICAgICAgfSkpXG4gICAgfVxuICB9XG5cbiAgc2hvdyAob3B0aW9ucykge1xuICAgIHRoaXMud2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5yZWJ1aWxkKG9wdGlvbnMpXG4gICAgICB0aGlzLl9tZW51LnBvcHVwKHJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkpXG4gICAgfSwgNjQpXG4gIH1cbn1cblxuZnVuY3Rpb24gY3VydmVzTWVudSAobWF5YmVDdXJ2ZSwgY2IpIHtcbiAgdmFyIG1lbnUgPSBuZXcgTWVudSgpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ0xpbmVhcicsXG4gICAgZW5hYmxlZDogbWF5YmVDdXJ2ZSAhPT0gJ2xpbmVhcicgJiYgbWF5YmVDdXJ2ZSAhPT0gJ0xpbmVhcicsXG4gICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgcmV0dXJuIGNiKGV2ZW50LCAnbGluZWFyJylcbiAgICB9XG4gIH0pKVxuXG4gIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6ICdFYXNlIEluJyxcbiAgICBzdWJtZW51OiBjdXJ2ZVR5cGVNZW51KCdlYXNlSW4nLCBtYXliZUN1cnZlLCBjYilcbiAgfSkpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ0Vhc2UgT3V0JyxcbiAgICBzdWJtZW51OiBjdXJ2ZVR5cGVNZW51KCdlYXNlT3V0JywgbWF5YmVDdXJ2ZSwgY2IpXG4gIH0pKVxuXG4gIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6ICdFYXNlIEluIE91dCcsXG4gICAgc3VibWVudTogY3VydmVUeXBlTWVudSgnZWFzZUluT3V0JywgbWF5YmVDdXJ2ZSwgY2IpXG4gIH0pKVxuXG4gIC8vIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gIC8vICAgbGFiZWw6ICdDdWJpYyBCZXppZXInLFxuICAvLyAgIHN1Ym1lbnU6IGN1cnZlVHlwZU1lbnUoJ2N1YmljQmV6aWVyJywgbWF5YmVDdXJ2ZSwgY2IpXG4gIC8vIH0pKVxuXG4gIHJldHVybiBtZW51XG59XG5cbmZ1bmN0aW9uIGN1cnZlVHlwZU1lbnUgKGJhc2VDdXJ2ZSwgbWF5YmVDdXJ2ZSwgY2IpIHtcbiAgdmFyIG1lbnUgPSBuZXcgTWVudSgpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ0JhY2snLFxuICAgIGVuYWJsZWQ6IG1heWJlQ3VydmUgIT09IGJhc2VDdXJ2ZSArICdCYWNrJyxcbiAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICByZXR1cm4gY2IoZXZlbnQsIGJhc2VDdXJ2ZSArICdCYWNrJylcbiAgICB9XG4gIH0pKVxuXG4gIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6ICdCb3VuY2UnLFxuICAgIGVuYWJsZWQ6IG1heWJlQ3VydmUgIT09IGJhc2VDdXJ2ZSArICdCb3VuY2UnLFxuICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBjYihldmVudCwgYmFzZUN1cnZlICsgJ0JvdW5jZScpXG4gICAgfVxuICB9KSlcblxuICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgIGxhYmVsOiAnQ2lyYycsXG4gICAgZW5hYmxlZDogbWF5YmVDdXJ2ZSAhPT0gYmFzZUN1cnZlICsgJ0NpcmMnLFxuICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBjYihldmVudCwgYmFzZUN1cnZlICsgJ0NpcmMnKVxuICAgIH1cbiAgfSkpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ0N1YmljJyxcbiAgICBlbmFibGVkOiBtYXliZUN1cnZlICE9PSBiYXNlQ3VydmUgKyAnQ3ViaWMnLFxuICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBjYihldmVudCwgYmFzZUN1cnZlICsgJ0N1YmljJylcbiAgICB9XG4gIH0pKVxuXG4gIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6ICdFbGFzdGljJyxcbiAgICBlbmFibGVkOiBtYXliZUN1cnZlICE9PSBiYXNlQ3VydmUgKyAnRWxhc3RpYycsXG4gICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgcmV0dXJuIGNiKGV2ZW50LCBiYXNlQ3VydmUgKyAnRWxhc3RpYycpXG4gICAgfVxuICB9KSlcblxuICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgIGxhYmVsOiAnRXhwbycsXG4gICAgZW5hYmxlZDogbWF5YmVDdXJ2ZSAhPT0gYmFzZUN1cnZlICsgJ0V4cG8nLFxuICAgIGNsaWNrOiAoZXZlbnQpID0+IHtcbiAgICAgIHJldHVybiBjYihldmVudCwgYmFzZUN1cnZlICsgJ0V4cG8nKVxuICAgIH1cbiAgfSkpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ1F1YWQnLFxuICAgIGVuYWJsZWQ6IG1heWJlQ3VydmUgIT09IGJhc2VDdXJ2ZSArICdRdWFkJyxcbiAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICByZXR1cm4gY2IoZXZlbnQsIGJhc2VDdXJ2ZSArICdRdWFkJylcbiAgICB9XG4gIH0pKVxuXG4gIG1lbnUuYXBwZW5kKG5ldyBNZW51SXRlbSh7XG4gICAgbGFiZWw6ICdRdWFydCcsXG4gICAgZW5hYmxlZDogbWF5YmVDdXJ2ZSAhPT0gYmFzZUN1cnZlICsgJ1F1YXJ0JyxcbiAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICByZXR1cm4gY2IoZXZlbnQsIGJhc2VDdXJ2ZSArICdRdWFydCcpXG4gICAgfVxuICB9KSlcblxuICBtZW51LmFwcGVuZChuZXcgTWVudUl0ZW0oe1xuICAgIGxhYmVsOiAnUXVpbnQnLFxuICAgIGVuYWJsZWQ6IG1heWJlQ3VydmUgIT09IGJhc2VDdXJ2ZSArICdRdWludCcsXG4gICAgY2xpY2s6IChldmVudCkgPT4ge1xuICAgICAgcmV0dXJuIGNiKGV2ZW50LCBiYXNlQ3VydmUgKyAnUXVpbnQnKVxuICAgIH1cbiAgfSkpXG5cbiAgbWVudS5hcHBlbmQobmV3IE1lbnVJdGVtKHtcbiAgICBsYWJlbDogJ1NpbmUnLFxuICAgIGVuYWJsZWQ6IG1heWJlQ3VydmUgIT09IGJhc2VDdXJ2ZSArICdTaW5lJyxcbiAgICBjbGljazogKGV2ZW50KSA9PiB7XG4gICAgICByZXR1cm4gY2IoZXZlbnQsIGJhc2VDdXJ2ZSArICdTaW5lJylcbiAgICB9XG4gIH0pKVxuXG4gIHJldHVybiBtZW51XG59XG4iXX0=