'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EDITOR_STYLES = undefined;

var _DefaultPalette = require('./../DefaultPalette');

var _DefaultPalette2 = _interopRequireDefault(_DefaultPalette);

var _color = require('color');

var _color2 = _interopRequireDefault(_color);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EDITOR_STYLES = exports.EDITOR_STYLES = {
  inputHolster: {
    position: 'relative',
    height: '100%'
  },
  input: {
    color: (0, _color2.default)(_DefaultPalette2.default.ROCK).fade(0.2),
    width: '100%',
    height: 'calc(100% + 1px)',
    paddingLeft: 7,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    border: '1px solid ' + _DefaultPalette2.default.DARKER_GRAY,
    backgroundColor: _DefaultPalette2.default.LIGHT_GRAY,
    ':focus': {
      border: '1px solid ' + _DefaultPalette2.default.LIGHT_PINK
    },
    ':hover': {}
  },
  inputFocus: {
    color: _DefaultPalette2.default.ROCK,
    backgroundColor: (0, _color2.default)(_DefaultPalette2.default.LIGHT_PINK).fade(0.92),
    border: '1px solid ' + (0, _color2.default)(_DefaultPalette2.default.LIGHT_PINK).fade(0.5)
  },
  unit: {
    position: 'absolute',
    right: 17,
    top: 4,
    color: (0, _color2.default)(_DefaultPalette2.default.ROCK_MUTED).fade(0.3)
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3N0eWxlcy9wcm9wZXJ0eUVkaXRvclNoYXJlZC5qcyJdLCJuYW1lcyI6WyJFRElUT1JfU1RZTEVTIiwiaW5wdXRIb2xzdGVyIiwicG9zaXRpb24iLCJoZWlnaHQiLCJpbnB1dCIsImNvbG9yIiwiUk9DSyIsImZhZGUiLCJ3aWR0aCIsInBhZGRpbmdMZWZ0IiwiYm9yZGVyVG9wTGVmdFJhZGl1cyIsImJvcmRlckJvdHRvbUxlZnRSYWRpdXMiLCJib3JkZXIiLCJEQVJLRVJfR1JBWSIsImJhY2tncm91bmRDb2xvciIsIkxJR0hUX0dSQVkiLCJMSUdIVF9QSU5LIiwiaW5wdXRGb2N1cyIsInVuaXQiLCJyaWdodCIsInRvcCIsIlJPQ0tfTVVURUQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFTyxJQUFNQSx3Q0FBZ0I7QUFDM0JDLGdCQUFjO0FBQ1pDLGNBQVUsVUFERTtBQUVaQyxZQUFRO0FBRkksR0FEYTtBQUszQkMsU0FBTztBQUNMQyxXQUFPLHFCQUFNLHlCQUFRQyxJQUFkLEVBQW9CQyxJQUFwQixDQUF5QixHQUF6QixDQURGO0FBRUxDLFdBQU8sTUFGRjtBQUdMTCxZQUFRLGtCQUhIO0FBSUxNLGlCQUFhLENBSlI7QUFLTEMseUJBQXFCLENBTGhCO0FBTUxDLDRCQUF3QixDQU5uQjtBQU9MQyxZQUFRLGVBQWUseUJBQVFDLFdBUDFCO0FBUUxDLHFCQUFpQix5QkFBUUMsVUFScEI7QUFTTCxjQUFVO0FBQ1JILGNBQVEsZUFBZSx5QkFBUUk7QUFEdkIsS0FUTDtBQVlMLGNBQVU7QUFaTCxHQUxvQjtBQW1CM0JDLGNBQVk7QUFDVlosV0FBTyx5QkFBUUMsSUFETDtBQUVWUSxxQkFBaUIscUJBQU0seUJBQVFFLFVBQWQsRUFBMEJULElBQTFCLENBQStCLElBQS9CLENBRlA7QUFHVkssWUFBUSxlQUFlLHFCQUFNLHlCQUFRSSxVQUFkLEVBQTBCVCxJQUExQixDQUErQixHQUEvQjtBQUhiLEdBbkJlO0FBd0IzQlcsUUFBTTtBQUNKaEIsY0FBVSxVQUROO0FBRUppQixXQUFPLEVBRkg7QUFHSkMsU0FBSyxDQUhEO0FBSUpmLFdBQU8scUJBQU0seUJBQVFnQixVQUFkLEVBQTBCZCxJQUExQixDQUErQixHQUEvQjtBQUpIO0FBeEJxQixDQUF0QiIsImZpbGUiOiJwcm9wZXJ0eUVkaXRvclNoYXJlZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQYWxldHRlIGZyb20gJy4vLi4vRGVmYXVsdFBhbGV0dGUnXG5pbXBvcnQgQ29sb3IgZnJvbSAnY29sb3InXG5cbmV4cG9ydCBjb25zdCBFRElUT1JfU1RZTEVTID0ge1xuICBpbnB1dEhvbHN0ZXI6IHtcbiAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICBoZWlnaHQ6ICcxMDAlJ1xuICB9LFxuICBpbnB1dDoge1xuICAgIGNvbG9yOiBDb2xvcihQYWxldHRlLlJPQ0spLmZhZGUoMC4yKSxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGhlaWdodDogJ2NhbGMoMTAwJSArIDFweCknLFxuICAgIHBhZGRpbmdMZWZ0OiA3LFxuICAgIGJvcmRlclRvcExlZnRSYWRpdXM6IDQsXG4gICAgYm9yZGVyQm90dG9tTGVmdFJhZGl1czogNCxcbiAgICBib3JkZXI6ICcxcHggc29saWQgJyArIFBhbGV0dGUuREFSS0VSX0dSQVksXG4gICAgYmFja2dyb3VuZENvbG9yOiBQYWxldHRlLkxJR0hUX0dSQVksXG4gICAgJzpmb2N1cyc6IHtcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAnICsgUGFsZXR0ZS5MSUdIVF9QSU5LXG4gICAgfSxcbiAgICAnOmhvdmVyJzoge31cbiAgfSxcbiAgaW5wdXRGb2N1czoge1xuICAgIGNvbG9yOiBQYWxldHRlLlJPQ0ssXG4gICAgYmFja2dyb3VuZENvbG9yOiBDb2xvcihQYWxldHRlLkxJR0hUX1BJTkspLmZhZGUoMC45MiksXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkICcgKyBDb2xvcihQYWxldHRlLkxJR0hUX1BJTkspLmZhZGUoMC41KVxuICB9LFxuICB1bml0OiB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgcmlnaHQ6IDE3LFxuICAgIHRvcDogNCxcbiAgICBjb2xvcjogQ29sb3IoUGFsZXR0ZS5ST0NLX01VVEVEKS5mYWRlKDAuMylcbiAgfVxufVxuIl19