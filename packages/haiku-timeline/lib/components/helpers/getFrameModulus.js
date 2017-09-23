"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getFrameModulus;
// return value means "show every nth frame"
function getFrameModulus(pxpf) {
  if (pxpf >= 20) return 1;
  if (pxpf >= 15) return 2;
  if (pxpf >= 10) return 5;
  if (pxpf >= 5) return 10;
  if (pxpf === 4) return 15;
  if (pxpf === 3) return 20;
  if (pxpf === 2) return 30;
  return 50;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2hlbHBlcnMvZ2V0RnJhbWVNb2R1bHVzLmpzIl0sIm5hbWVzIjpbImdldEZyYW1lTW9kdWx1cyIsInB4cGYiXSwibWFwcGluZ3MiOiI7Ozs7O2tCQUN3QkEsZTtBQUR4QjtBQUNlLFNBQVNBLGVBQVQsQ0FBMEJDLElBQTFCLEVBQWdDO0FBQzdDLE1BQUlBLFFBQVEsRUFBWixFQUFnQixPQUFPLENBQVA7QUFDaEIsTUFBSUEsUUFBUSxFQUFaLEVBQWdCLE9BQU8sQ0FBUDtBQUNoQixNQUFJQSxRQUFRLEVBQVosRUFBZ0IsT0FBTyxDQUFQO0FBQ2hCLE1BQUlBLFFBQVEsQ0FBWixFQUFlLE9BQU8sRUFBUDtBQUNmLE1BQUlBLFNBQVMsQ0FBYixFQUFnQixPQUFPLEVBQVA7QUFDaEIsTUFBSUEsU0FBUyxDQUFiLEVBQWdCLE9BQU8sRUFBUDtBQUNoQixNQUFJQSxTQUFTLENBQWIsRUFBZ0IsT0FBTyxFQUFQO0FBQ2hCLFNBQU8sRUFBUDtBQUNEIiwiZmlsZSI6ImdldEZyYW1lTW9kdWx1cy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHJldHVybiB2YWx1ZSBtZWFucyBcInNob3cgZXZlcnkgbnRoIGZyYW1lXCJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldEZyYW1lTW9kdWx1cyAocHhwZikge1xuICBpZiAocHhwZiA+PSAyMCkgcmV0dXJuIDFcbiAgaWYgKHB4cGYgPj0gMTUpIHJldHVybiAyXG4gIGlmIChweHBmID49IDEwKSByZXR1cm4gNVxuICBpZiAocHhwZiA+PSA1KSByZXR1cm4gMTBcbiAgaWYgKHB4cGYgPT09IDQpIHJldHVybiAxNVxuICBpZiAocHhwZiA9PT0gMykgcmV0dXJuIDIwXG4gIGlmIChweHBmID09PSAyKSByZXR1cm4gMzBcbiAgcmV0dXJuIDUwXG59XG4iXX0=