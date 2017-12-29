const checkYarnVersion = require('./helpers/checkYarnVersion');
const checkNodeVersion = require('./helpers/checkNodeVersion');
const allPackages = require('./helpers/packages')();

checkYarnVersion();
checkNodeVersion();
allPackages.forEach((pack) => {

});
