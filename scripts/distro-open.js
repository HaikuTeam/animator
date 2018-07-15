const cp = require('child_process');
const path = require('path');
let ROOT = path.join(__dirname, '..');
cp.execSync('open ./dist/mac/Haiku.app/Contents/MacOS/Haiku', {cwd: ROOT, stdio: 'inherit'});
