
import * as clc from 'cli-color'
import * as path from 'path'
import * as inquirer from 'inquirer'
import { clone, merge } from 'lodash'
import { argv } from 'yargs'
import * as request from 'request'
import * as chalk from 'chalk'

import { inkstone } from './sdk.js'

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

switch (subcommand) {
  case 'login':
    login()
    break
  case 'logout':
    console.warn('unimplemented')
    //TODO:  delete auth file from ~/.haiku
    break
  case 'help':
    help()
    break
  default:
    help()
    break
}

function login() {
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

    inkstone.user.authenticate(username, password, function (err, data) {
      if (err != undefined) {
        console.log(chalk.bold.red('Username or password incorrect.'))
      } else {
        //TODO: write auth token from response to ~/.haiku/auth
        console.log(chalk.bold.green(`Welcome ${username}!`))
      }
    })
  });
}