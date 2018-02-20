/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const child_process = require('child_process');

const processOptions = {stdio: 'inherit', cwd: global.process.cwd()};
child_process.exec('yarn webpack --config=demos/webpack.config.js --progress --colors', processOptions);
child_process.spawn('./node_modules/.bin/nodemon', ['demos/server.js'], processOptions);
