/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function create(instance) {
  const registry = {};
  const eavesdroppers = [];

  instance.on = function on(key, fn) {
    if (!registry[key]) {
      registry[key] = [];
    }
    // Check for dupes and ignore if this is one
    for (let i = 0; i < registry[key].length; i++) {
      if (registry[key][i] === fn) {
        return this;
      }
    }
    registry[key].push(fn);
    return this;
  };

  instance.off = function off(key, fn) {
    const listeners = registry[key];
    if (!listeners || listeners.length < 1) {
      return this;
    }
    for (let i = 0; i < listeners.length; i++) {
      if (fn && listeners[i] === fn) {
        listeners.splice(i, 1);
      } else {
        listeners.splice(i, 1);
      }
    }
    return this;
  };

  instance.emit = function emit(
    key,
    msg,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z,
  ) {
    const listeners = registry[key];
    if (listeners && listeners.length > 0) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](
          msg,
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
        );
      }
    }
    if (eavesdroppers.length > 0) {
      for (let j = 0; j < eavesdroppers.length; j++) {
        eavesdroppers[j](
          key,
          msg,
          a,
          b,
          c,
          d,
          e,
          f,
          g,
          h,
          k,
          l,
          m,
          n,
          o,
          p,
          q,
          r,
          s,
          t,
          u,
          v,
          w,
          x,
          y,
          z,
        );
      }
    }
    return this;
  };

  instance.hear = function hear(fn) {
    eavesdroppers.push(fn);
  };

  instance._registry = registry;
  instance._eavesdroppers = eavesdroppers;

  return instance;
}

export default {
  create,
};
