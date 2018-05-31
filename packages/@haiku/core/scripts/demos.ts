/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import * as childProcess from 'child_process';
import * as opn from 'opn';

const processOptions = {
  stdio: 'inherit',
  cwd: global.process.cwd(),
};
childProcess.exec(
  'yarn webpack --config=demo/webpack.config.js --progress --colors',
  processOptions,
);
childProcess.spawn(
  './node_modules/.bin/nodemon',
  ['demo/server.js'],
  processOptions,
);

if (!process.env.WAIT_FOR_DEBUGGER) {
  setTimeout(
    () => {
      console.log('opening browser demos');
      opn('http://localhost:3000');
    },
    2000,
  );
}
