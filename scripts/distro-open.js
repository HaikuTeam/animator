var cp = require('child_process')
var path = require('path')
var ROOT = path.join(__dirname, '..')
cp.execSync('open ./dist/mac/Haiku.app/Contents/MacOS/Haiku', { cwd: ROOT, stdio: 'inherit' })
