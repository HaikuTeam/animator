
import * as clc from 'cli-color'
import * as path from 'path'
import * as inquirer from 'inquirer'
import { clone, merge } from 'lodash'
import { argv } from 'yargs'
import * as request from 'request'

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

function finish() {
  process.exit(1)
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

//TODO:  abstract out paths, env/config (env var?)
var LOGIN_ENDPOINT = "http://localhost:8080/v0/user/auth"
function performLogin(username, password, cb: request.RequestCallback) {
  var formData = {
    username: username,
    password: password
  }

  var options: request.UrlOptions & request.CoreOptions = {
    url: LOGIN_ENDPOINT,
    json: formData,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  request.post(options, cb)
}

switch (subcommand) {
  case 'login':
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

      performLogin(username, password, function (err, httpResponse, body) {
        if (httpResponse.statusCode != 200) {
          console.log(clc.red('username or password incorrect'))
        } else {
          //TODO: write auth token in response to ~/.haiku/auth
          console.log(clc.magenta(`Welcome ${username}! You're now logged in.`))
        }
      })
    });
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
