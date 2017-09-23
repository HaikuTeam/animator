'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'src/components/helpers/getPropertyValueDescriptor.js';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // eslint-disable-line


exports.default = getPropertyValueDescriptor;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _numeral = require('numeral');

var _numeral2 = _interopRequireDefault(_numeral);

var _TimelineProperty = require('haiku-bytecode/src/TimelineProperty');

var _TimelineProperty2 = _interopRequireDefault(_TimelineProperty);

var _retToEq = require('./retToEq');

var _retToEq2 = _interopRequireDefault(_retToEq);

var _inferUnitOfValue = require('./inferUnitOfValue');

var _inferUnitOfValue2 = _interopRequireDefault(_inferUnitOfValue);

var _humanizePropertyName = require('./humanizePropertyName');

var _humanizePropertyName2 = _interopRequireDefault(_humanizePropertyName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPropertyValueDescriptor(node, frameInfo, reifiedBytecode, serializedBytecode, component, currentTimelineTime, currentTimelineName, propertyDescriptor) {
  var options = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : {};

  var componentId = node.attributes['haiku-id'];
  var elementName = node.elementName;

  var propertyName = propertyDescriptor.name;

  var hostInstance = component.fetchActiveBytecodeFile().get('hostInstance');
  var hostStates = component.fetchActiveBytecodeFile().get('states');

  var fallbackValue = propertyDescriptor.fallback;
  var baselineValue = _TimelineProperty2.default.getBaselineValue(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, fallbackValue, reifiedBytecode, hostInstance, hostStates);
  var computedValue = _TimelineProperty2.default.getComputedValue(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, fallbackValue, reifiedBytecode, hostInstance, hostStates);

  var assignedValueObject = _TimelineProperty2.default.getAssignedValueObject(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, serializedBytecode);
  var assignedValue = assignedValueObject && assignedValueObject.value;

  var bookendValueObject = _TimelineProperty2.default.getAssignedBaselineValueObject(componentId, elementName, propertyName, currentTimelineName, currentTimelineTime, serializedBytecode);
  var bookendValue = bookendValueObject && bookendValueObject.value;

  var valueType = propertyDescriptor.typedef || (typeof baselineValue === 'undefined' ? 'undefined' : _typeof(baselineValue));

  var prettyValue = void 0;
  if (assignedValue !== undefined) {
    if (assignedValue && (typeof assignedValue === 'undefined' ? 'undefined' : _typeof(assignedValue)) === 'object' && assignedValue.__function) {
      var cleanValue = (0, _retToEq2.default)(assignedValue.__function.body.trim());
      if (cleanValue.length > 6) cleanValue = cleanValue.slice(0, 6) + '…';
      prettyValue = _react2.default.createElement(
        'span',
        { style: { whiteSpace: 'nowrap' }, __source: {
            fileName: _jsxFileName,
            lineNumber: 35
          },
          __self: this
        },
        cleanValue
      );
    }
  }
  if (prettyValue === undefined) {
    if (assignedValue === undefined && bookendValue !== undefined) {
      if (bookendValue && (typeof bookendValue === 'undefined' ? 'undefined' : _typeof(bookendValue)) === 'object' && bookendValue.__function) {
        prettyValue = _react2.default.createElement(
          'span',
          { style: { fontSize: '11px' }, __source: {
              fileName: _jsxFileName,
              lineNumber: 44
            },
            __self: this
          },
          '\u26A1'
        );
      }
    }
  }
  if (prettyValue === undefined) {
    prettyValue = valueType === 'number' ? (0, _numeral2.default)(computedValue || 0).format(options.numFormat || '0,0[.]0') : computedValue;
  }

  var valueUnit = (0, _inferUnitOfValue2.default)(propertyDescriptor.name);
  var valueLabel = (0, _humanizePropertyName2.default)(propertyName);

  return {
    timelineTime: currentTimelineTime,
    timelineName: currentTimelineName,
    propertyName: propertyName,
    valueType: valueType,
    valueUnit: valueUnit,
    valueLabel: valueLabel,
    fallbackValue: fallbackValue,
    baselineValue: baselineValue,
    computedValue: computedValue,
    assignedValue: assignedValue,
    bookendValue: bookendValue,
    prettyValue: prettyValue
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IuanMiXSwibmFtZXMiOlsiZ2V0UHJvcGVydHlWYWx1ZURlc2NyaXB0b3IiLCJub2RlIiwiZnJhbWVJbmZvIiwicmVpZmllZEJ5dGVjb2RlIiwic2VyaWFsaXplZEJ5dGVjb2RlIiwiY29tcG9uZW50IiwiY3VycmVudFRpbWVsaW5lVGltZSIsImN1cnJlbnRUaW1lbGluZU5hbWUiLCJwcm9wZXJ0eURlc2NyaXB0b3IiLCJvcHRpb25zIiwiY29tcG9uZW50SWQiLCJhdHRyaWJ1dGVzIiwiZWxlbWVudE5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJuYW1lIiwiaG9zdEluc3RhbmNlIiwiZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUiLCJnZXQiLCJob3N0U3RhdGVzIiwiZmFsbGJhY2tWYWx1ZSIsImZhbGxiYWNrIiwiYmFzZWxpbmVWYWx1ZSIsImdldEJhc2VsaW5lVmFsdWUiLCJjb21wdXRlZFZhbHVlIiwiZ2V0Q29tcHV0ZWRWYWx1ZSIsImFzc2lnbmVkVmFsdWVPYmplY3QiLCJnZXRBc3NpZ25lZFZhbHVlT2JqZWN0IiwiYXNzaWduZWRWYWx1ZSIsInZhbHVlIiwiYm9va2VuZFZhbHVlT2JqZWN0IiwiZ2V0QXNzaWduZWRCYXNlbGluZVZhbHVlT2JqZWN0IiwiYm9va2VuZFZhbHVlIiwidmFsdWVUeXBlIiwidHlwZWRlZiIsInByZXR0eVZhbHVlIiwidW5kZWZpbmVkIiwiX19mdW5jdGlvbiIsImNsZWFuVmFsdWUiLCJib2R5IiwidHJpbSIsImxlbmd0aCIsInNsaWNlIiwid2hpdGVTcGFjZSIsImZvbnRTaXplIiwiZm9ybWF0IiwibnVtRm9ybWF0IiwidmFsdWVVbml0IiwidmFsdWVMYWJlbCIsInRpbWVsaW5lVGltZSIsInRpbWVsaW5lTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs4UUFBMEI7OztrQkFPRkEsMEI7O0FBUHhCOzs7O0FBQ0E7Ozs7QUFDQTs7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QTtBQUFBO0FBQUEsU0FBZDtBQUNEO0FBQ0Y7QUFDRjtBQUNELE1BQUlULGdCQUFnQkMsU0FBcEIsRUFBK0I7QUFDN0JELGtCQUFlRixjQUFjLFFBQWYsR0FDVix1QkFBUVQsaUJBQWlCLENBQXpCLEVBQTRCcUIsTUFBNUIsQ0FBbUNuQyxRQUFRb0MsU0FBUixJQUFxQixTQUF4RCxDQURVLEdBRVZ0QixhQUZKO0FBR0Q7O0FBRUQsTUFBSXVCLFlBQVksZ0NBQWlCdEMsbUJBQW1CTSxJQUFwQyxDQUFoQjtBQUNBLE1BQUlpQyxhQUFhLG9DQUFxQmxDLFlBQXJCLENBQWpCOztBQUVBLFNBQU87QUFDTG1DLGtCQUFjMUMsbUJBRFQ7QUFFTDJDLGtCQUFjMUMsbUJBRlQ7QUFHTE0sOEJBSEs7QUFJTG1CLHdCQUpLO0FBS0xjLHdCQUxLO0FBTUxDLDBCQU5LO0FBT0w1QixnQ0FQSztBQVFMRSxnQ0FSSztBQVNMRSxnQ0FUSztBQVVMSSxnQ0FWSztBQVdMSSw4QkFYSztBQVlMRztBQVpLLEdBQVA7QUFjRCIsImZpbGUiOiJnZXRQcm9wZXJ0eVZhbHVlRGVzY3JpcHRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCcgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuaW1wb3J0IG51bWVyYWwgZnJvbSAnbnVtZXJhbCdcbmltcG9ydCBUaW1lbGluZVByb3BlcnR5IGZyb20gJ2hhaWt1LWJ5dGVjb2RlL3NyYy9UaW1lbGluZVByb3BlcnR5J1xuaW1wb3J0IHJldFRvRXEgZnJvbSAnLi9yZXRUb0VxJ1xuaW1wb3J0IGluZmVyVW5pdE9mVmFsdWUgZnJvbSAnLi9pbmZlclVuaXRPZlZhbHVlJ1xuaW1wb3J0IGh1bWFuaXplUHJvcGVydHlOYW1lIGZyb20gJy4vaHVtYW5pemVQcm9wZXJ0eU5hbWUnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFByb3BlcnR5VmFsdWVEZXNjcmlwdG9yIChub2RlLCBmcmFtZUluZm8sIHJlaWZpZWRCeXRlY29kZSwgc2VyaWFsaXplZEJ5dGVjb2RlLCBjb21wb25lbnQsIGN1cnJlbnRUaW1lbGluZVRpbWUsIGN1cnJlbnRUaW1lbGluZU5hbWUsIHByb3BlcnR5RGVzY3JpcHRvciwgb3B0aW9ucyA9IHt9KSB7XG4gIGxldCBjb21wb25lbnRJZCA9IG5vZGUuYXR0cmlidXRlc1snaGFpa3UtaWQnXVxuICBsZXQgZWxlbWVudE5hbWUgPSBub2RlLmVsZW1lbnROYW1lXG5cbiAgbGV0IHByb3BlcnR5TmFtZSA9IHByb3BlcnR5RGVzY3JpcHRvci5uYW1lXG5cbiAgbGV0IGhvc3RJbnN0YW5jZSA9IGNvbXBvbmVudC5mZXRjaEFjdGl2ZUJ5dGVjb2RlRmlsZSgpLmdldCgnaG9zdEluc3RhbmNlJylcbiAgbGV0IGhvc3RTdGF0ZXMgPSBjb21wb25lbnQuZmV0Y2hBY3RpdmVCeXRlY29kZUZpbGUoKS5nZXQoJ3N0YXRlcycpXG5cbiAgbGV0IGZhbGxiYWNrVmFsdWUgPSBwcm9wZXJ0eURlc2NyaXB0b3IuZmFsbGJhY2tcbiAgbGV0IGJhc2VsaW5lVmFsdWUgPSBUaW1lbGluZVByb3BlcnR5LmdldEJhc2VsaW5lVmFsdWUoY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGN1cnJlbnRUaW1lbGluZU5hbWUsIGN1cnJlbnRUaW1lbGluZVRpbWUsIGZhbGxiYWNrVmFsdWUsIHJlaWZpZWRCeXRlY29kZSwgaG9zdEluc3RhbmNlLCBob3N0U3RhdGVzKVxuICBsZXQgY29tcHV0ZWRWYWx1ZSA9IFRpbWVsaW5lUHJvcGVydHkuZ2V0Q29tcHV0ZWRWYWx1ZShjb21wb25lbnRJZCwgZWxlbWVudE5hbWUsIHByb3BlcnR5TmFtZSwgY3VycmVudFRpbWVsaW5lTmFtZSwgY3VycmVudFRpbWVsaW5lVGltZSwgZmFsbGJhY2tWYWx1ZSwgcmVpZmllZEJ5dGVjb2RlLCBob3N0SW5zdGFuY2UsIGhvc3RTdGF0ZXMpXG5cbiAgbGV0IGFzc2lnbmVkVmFsdWVPYmplY3QgPSBUaW1lbGluZVByb3BlcnR5LmdldEFzc2lnbmVkVmFsdWVPYmplY3QoY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGN1cnJlbnRUaW1lbGluZU5hbWUsIGN1cnJlbnRUaW1lbGluZVRpbWUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgbGV0IGFzc2lnbmVkVmFsdWUgPSBhc3NpZ25lZFZhbHVlT2JqZWN0ICYmIGFzc2lnbmVkVmFsdWVPYmplY3QudmFsdWVcblxuICBsZXQgYm9va2VuZFZhbHVlT2JqZWN0ID0gVGltZWxpbmVQcm9wZXJ0eS5nZXRBc3NpZ25lZEJhc2VsaW5lVmFsdWVPYmplY3QoY29tcG9uZW50SWQsIGVsZW1lbnROYW1lLCBwcm9wZXJ0eU5hbWUsIGN1cnJlbnRUaW1lbGluZU5hbWUsIGN1cnJlbnRUaW1lbGluZVRpbWUsIHNlcmlhbGl6ZWRCeXRlY29kZSlcbiAgbGV0IGJvb2tlbmRWYWx1ZSA9IGJvb2tlbmRWYWx1ZU9iamVjdCAmJiBib29rZW5kVmFsdWVPYmplY3QudmFsdWVcblxuICBsZXQgdmFsdWVUeXBlID0gcHJvcGVydHlEZXNjcmlwdG9yLnR5cGVkZWYgfHwgdHlwZW9mIGJhc2VsaW5lVmFsdWVcblxuICBsZXQgcHJldHR5VmFsdWVcbiAgaWYgKGFzc2lnbmVkVmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChhc3NpZ25lZFZhbHVlICYmIHR5cGVvZiBhc3NpZ25lZFZhbHVlID09PSAnb2JqZWN0JyAmJiBhc3NpZ25lZFZhbHVlLl9fZnVuY3Rpb24pIHtcbiAgICAgIGxldCBjbGVhblZhbHVlID0gcmV0VG9FcShhc3NpZ25lZFZhbHVlLl9fZnVuY3Rpb24uYm9keS50cmltKCkpXG4gICAgICBpZiAoY2xlYW5WYWx1ZS5sZW5ndGggPiA2KSBjbGVhblZhbHVlID0gKGNsZWFuVmFsdWUuc2xpY2UoMCwgNikgKyAn4oCmJylcbiAgICAgIHByZXR0eVZhbHVlID0gKFxuICAgICAgICA8c3BhbiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAnbm93cmFwJyB9fT5cbiAgICAgICAgICB7Y2xlYW5WYWx1ZX1cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKVxuICAgIH1cbiAgfVxuICBpZiAocHJldHR5VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChhc3NpZ25lZFZhbHVlID09PSB1bmRlZmluZWQgJiYgYm9va2VuZFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChib29rZW5kVmFsdWUgJiYgdHlwZW9mIGJvb2tlbmRWYWx1ZSA9PT0gJ29iamVjdCcgJiYgYm9va2VuZFZhbHVlLl9fZnVuY3Rpb24pIHtcbiAgICAgICAgcHJldHR5VmFsdWUgPSA8c3BhbiBzdHlsZT17eyBmb250U2l6ZTogJzExcHgnIH19PuKaoTwvc3Bhbj5cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgaWYgKHByZXR0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICBwcmV0dHlWYWx1ZSA9ICh2YWx1ZVR5cGUgPT09ICdudW1iZXInKVxuICAgICAgPyBudW1lcmFsKGNvbXB1dGVkVmFsdWUgfHwgMCkuZm9ybWF0KG9wdGlvbnMubnVtRm9ybWF0IHx8ICcwLDBbLl0wJylcbiAgICAgIDogY29tcHV0ZWRWYWx1ZVxuICB9XG5cbiAgbGV0IHZhbHVlVW5pdCA9IGluZmVyVW5pdE9mVmFsdWUocHJvcGVydHlEZXNjcmlwdG9yLm5hbWUpXG4gIGxldCB2YWx1ZUxhYmVsID0gaHVtYW5pemVQcm9wZXJ0eU5hbWUocHJvcGVydHlOYW1lKVxuXG4gIHJldHVybiB7XG4gICAgdGltZWxpbmVUaW1lOiBjdXJyZW50VGltZWxpbmVUaW1lLFxuICAgIHRpbWVsaW5lTmFtZTogY3VycmVudFRpbWVsaW5lTmFtZSxcbiAgICBwcm9wZXJ0eU5hbWUsXG4gICAgdmFsdWVUeXBlLFxuICAgIHZhbHVlVW5pdCxcbiAgICB2YWx1ZUxhYmVsLFxuICAgIGZhbGxiYWNrVmFsdWUsXG4gICAgYmFzZWxpbmVWYWx1ZSxcbiAgICBjb21wdXRlZFZhbHVlLFxuICAgIGFzc2lnbmVkVmFsdWUsXG4gICAgYm9va2VuZFZhbHVlLFxuICAgIHByZXR0eVZhbHVlXG4gIH1cbn1cbiJdfQ==