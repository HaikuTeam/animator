const cp = require('child_process')
const argv = require('yargs').argv
const log = require('../helpers/log')

const organization = `Test${Date.now()}`
const email = `matthew+${organization}@haiku.ai`
const password = 'supersecure'

cp.execSync([
  `curl`,
  `--verbose`,
  `-X POST`,
  `https://inkstonestaging.haiku.ai/v0/user`,
  `--data '{"OrganizationName": "${organization}", "Email": "${email}", "Password" : "${password}"}'`
].join(' '))

log.log(JSON.stringify({
  organization,
  email,
  password
}, null, 2))

// While in staging: Check your email, grab the token, and run this:
// curl --verbose -X POST https://inkstone.haiku.ai/v0/user/confirm/TOKEN
