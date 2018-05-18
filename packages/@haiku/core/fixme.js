const {default: composedTransformsToTimelineProperties} = require('./lib/helpers/composedTransformsToTimelineProperties');
const out = {};
composedTransformsToTimelineProperties(out, [
  [-0.869104, 0.494629, 0, 0, -0.494629, -0.869104, 0, 0, 0, 0, 1, 0, 369.461, 284.514, 0, 1],
  [1.97164, 0.346414, -1.03811, 0, 0.174201, 2.06622, 1.02034, 0, 0.479426, -0.420735, 0.770151, 0, 0, 0, 0, 1]
]);
console.log(out);
