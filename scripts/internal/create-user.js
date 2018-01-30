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
  `--data '{"OrganizationName": "${organization}", "Email": "${email}", "Password" : "${password}"}'`,
].join(' '))

log.log(JSON.stringify({
  organization,
  email,
  password
}, null, 2))
