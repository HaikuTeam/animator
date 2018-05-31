import * as async from 'async';

export default (steps: Function[], cb) => {
  let delta = 0;

  return async.eachOfSeries(steps, (step: Function, key, next) => {
    const start = Date.now();

    return step(() => {
      const end = Date.now();
      delta = end - start;

      return next();
    },          delta);
  },                        cb);
};
