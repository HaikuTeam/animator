
import * as clc from 'cli-color'
import * as path from 'path'
import * as inquirer from 'inquirer'
import { clone, merge } from 'lodash'
import { argv } from 'yargs'
import * as request from 'request'
import * as chalk from 'chalk'
import * as mkdirp from "mkdirp"
import { execSync } from 'child_process'

import { inkstone, client } from './sdk.js'

let dedent = require('dedent')

const banner = dedent`
  Haiku CLI (version 0.0.0)

  Usage:
    haiku <command> [flags]

  Commands:
    help - Display this message
    develop - Start dev server
`

const args = argv._

const subcommand = args.shift()

const flags = clone(argv)
delete flags._
delete flags.$0

function finish(code?: number) {
  process.exit(code)
}

// process.stdin.resume()
function exitwrap(maybeException) {
  if (maybeException) console.log(maybeException)
  process.exit()
}
process.on('exit', exitwrap)
process.on('SIGINT', exitwrap)
process.on('uncaughtException', exitwrap)

const main = path.join(__dirname, '..', 'creator', 'electron-main.js')

function help() {
  console.log(banner)
  finish()
}

function ensureAuth(cb) {
  var token = client.config.getAuthToken()
  if (token == "") {
    console.log("You must be authenticated to do that.")
    doLogin(function () {
      token = client.config.getAuthToken()
      if (token == "") {
        console.log("Hm, that didn't work.  Let's try again.")
        ensureAuth(cb)
      } else {
        cb(token)
      }
    })
  } else {
    cb(token)
  }
}

switch (subcommand) {
  case 'list':
    doList()
    break
  case 'login':
    doLogin()
    break
  case 'logout':
  case 'logoff':
    doLogout()
    break
  case 'import':
    // doImport()
    break
  case 'help':
    help()
    break
  case 'sync':
    doSync()
    break
  default:
    help()
    break
}


function doList() {
  ensureAuth((token: string) => {
    inkstone.project.list(token, (err, projects) => {
      console.log("projects", projects)
    })
  })
}


function doLogin(cb?: Function) {
  console.log(chalk.underline('Logging into Haiku'))
  var username = ''
  var password = ''

  inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Username:',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password:',
    }
  ]).then(function (answers: inquirer.Answers) {
    username = answers['username']
    password = answers['password']

    inkstone.user.authenticate(username, password, function (err, authResponse) {
      if (err != undefined) {
        console.log(chalk.bold.red('Username or password incorrect.'))
      } else {
        //TODO: write auth token from response to ~/.haiku/auth
        client.config.setAuthToken(authResponse.auth_token)
        console.log(chalk.bold.green(`Welcome ${username}!`))
      }
      if (cb) {
        cb()
      }
    })
  });
}

function doLogout() {
  client.config.setAuthToken("")
}

//TODO:  realtime sync
function doSync() {
  console.warn("Unimplemented")
}

//USAGE:  haiku import design-test dest/
//        clone git repo 'someendpoint/design-test' as a submodule into the dest/design-test folder
//TODO:  update with url to our public infra (codecommit or similar)
//TODO:  figure out auth (or do all public for now. +1 to hosting on our own infra)
var GIT_CMD_BASE = "git@github.com:HaikuTeam/${1}.git"
function doImport(projectName, destination) {
  //TODO:  handle numerous edge cases (e.g. dest path does/not already have contents; remote not found)
  if (destination.charAt(destination.length - 1) !== "/") destination += '/'
  mkdirp.sync(destination)
  destination += projectName

  var gitEndpoint = GIT_CMD_BASE.replace('${1}', projectName)
  execSync(`git remote add ${projectName} ${gitEndpoint}`)
  execSync(`git subtree add --prefix ${destination} ${projectName} master`)

}

//USAGE:  haiku deport design-test dest/design-test
//        removes subtree at dest/design-test
//TODO:  still seems to be polluting git history. may need to follow additional steps re: reflog, see link
//Could also explore submodules as a less history-intermingling solution (defeats part of the collaborative connection)
function performDeport(projectName, location) {
  //command from http://stackoverflow.com/questions/26107798/how-to-remove-previously-added-git-subtree-and-its-history
  var cmd = `git filter-branch --index-filter \'git rm --cached --ignore-unmatch -rf ${location}\' --prune-empty -f HEAD`
  execSync(cmd)
}


