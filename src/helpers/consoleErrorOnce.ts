/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

function generateLogger () {
  const CONSOLE_ERRORS = {};

  return function consoleErrorOnce (err) {
    const str = err && err.message.toString();
    if (!CONSOLE_ERRORS[str]) {
      CONSOLE_ERRORS[str] = true;
      console.error(err);
    }
  };
}

export default generateLogger();
