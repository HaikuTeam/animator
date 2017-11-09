const child_process = require('child_process');
const opn = require('opn');

const processOptions = {stdio: 'inherit', cwd: global.process.cwd()};
child_process.exec('yarn webpack --config=demo/webpack.config.js --progress --colors', processOptions);
child_process.spawn('./node_modules/.bin/nodemon', ['demo/server.js'], processOptions);

if (!process.env.WAIT_FOR_DEBUGGER) {
  setTimeout(() => {
    console.log('opening browser demos');
    opn('http://localhost:3000');
  }, 2000);
}
