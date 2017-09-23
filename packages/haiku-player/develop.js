var cp = require('child_process')
var path = require('path')
var opn = require('opn')
var chokidar = require('chokidar')

console.log('linking haiku player')
cp.execSync('yarn link && yarn link @haiku/player', { stdio: 'inherit' })

console.log('compiling typescript')
cp.execSync('yarn run compile', { stdio: 'inherit' })

console.log('watching typescript')
cp.spawn(`tsc`, [`--watch`], { stdio: 'inherit' })

if (process.env.HAIKU_PLAYER_WATCH_ONLY !== '1') {
  console.log('starting server')
  cp.spawn(`nodemon`, [`./test/demo/server.js`], { stdio: 'inherit' })
}

setTimeout(() => {
  if (process.env.HAIKU_PLAYER_WATCH_ONLY !== '1') {
    console.log('opening browser demos')
    opn('http://localhost:3000')
  }

  console.log('watching files')
  chokidar.watch('src', {
    ignored: /(^|[\/\\])\../
  }).on('change', (event, path) => {
    console.log('file changed', event)
    try {
      cp.execSync(`tslint -c tslint.json 'src/**/*.ts' --exclude 'src/vendor/**' --format stylish`, { stdio: 'inherit' })
    } catch (exception) {
      // empty
    }
  })
}, 2000)
