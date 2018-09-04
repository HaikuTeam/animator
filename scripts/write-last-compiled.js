const {argv} = require('yargs');
const {writeFileSync} = require('fs');

writeFileSync(argv.outputPath, `module.exports = ${JSON.stringify({lastCompileTime: new Date()})};`);
