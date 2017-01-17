
import * as clc from 'cli-color'
import * as path from 'path'
import * as inquirer from 'inquirer'
import * as _ from 'lodash'
import { argv } from 'yargs'
import * as request from 'request'
import * as chalk from 'chalk'
import * as mkdirp from "mkdirp"
import { execSync } from 'child_process'

import { inkstone, client } from 'haiku-sdk'

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

const flags = _.clone(argv)
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
  if (!token || token == "") {
    console.log("You must be authenticated to do that.")
    doLogin(function () {
      token = client.config.getAuthToken()
      if (!token || token == "") {
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

inkstone.setConfig({
  baseUrl: flags.api || "https://inkstone.haiku.ai/"
});

if(flags.verbose){
  console.log("Flags: ", flags)
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
  case 'new':
  case 'generate':
  case 'create':
    //Not intended for user consumption yet
    doCreate()
    break
  case 'import':
    doImport()
    break
  case 'open':
    doOpen()
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

function doCreate() {
  ensureAuth((token: string) => {
    //TODO:  pull this from args if provided
    //TODO:  support 'cloning' project directly into fs (i.e. autoimport)
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project Name:',
      }
    ]).then(function (answers: inquirer.Answers) {
      var projectName = answers['name']
      console.log("Creating project...")
      inkstone.project.create({Name: projectName}, (err, project)=>{
        if(err){
          console.log("Error creating project.  Does this project with this name already exist?")
        }else{
          console.log("Project created!")
        }
      })
    })
  })
}

//TODO:  not extensively tested, needs to handle edge-cases
//USAGE:  haiku deport design-test dest/design-test
//        removes subtree at dest/design-test
//TODO:  still seems to be polluting git history. may need to follow additional steps re: reflog, see link
//Could also explore submodules as a less history-intermingling solution (defeats part of the collaborative connection)
function performDeport(projectName, location) {
  //command from http://stackoverflow.com/questions/26107798/how-to-remove-previously-added-git-subtree-and-its-history
  var cmd = `git filter-branch --index-filter \'git rm --cached --ignore-unmatch -rf ${location}\' --prune-empty -f HEAD`
  execSync(cmd)
}


//TODO:  custom/granular git subtree logic, supporting importing a bare repo

//USAGE:  haiku import design-test dest/
//        clone git repo 'someendpoint/design-test' as a subtree into the dest/design-test folder
function doImport() {
  var projectName = args[0]
  var destination = args[1] || projectName
  if (destination.charAt(destination.length - 1) !== "/") destination += '/'

  ensureAuth(function (token) {
    inkstone.project.getByName(projectName, function (err, projectAndCredentials) {
      if (err) {
        console.log(chalk.bold(`Project ${projectName} not found.`))
      } else {
        //TODO:  mkdirp all folders excluding the prefix directory itself (git subtree add doesn't want the folder to exist yet)
        //TODO:  maybe not worry about that with our own custom subtree logic
        // mkdirp.sync(destination)
        // destination += projectName
        var gitEndpoint = projectAndCredentials.Project.GitRemoteUrl
        //TODO:  store credentials more securely than this
        gitEndpoint = gitEndpoint.replace("https://", "https://" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsUsername) + ":" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsPassword) + "@")
        //TODO:  handle case where git remote is already added
        execSync(`git remote add ${projectName} ${gitEndpoint}`)
        execSync(`git subtree add --prefix=${destination} ${projectName} master`)
        console.log(`Project ${chalk.bold(projectName)} imported to ${chalk.bold(destination)}`)
      }

    })
  })
}


function doList() {
  ensureAuth((token: string) => {
    inkstone.project.list((err, projects) => {
      if (projects == undefined || projects.length == 0) {
        console.log("No existing projects.  Use " + chalk.bold("haiku generate") + " to make a new one!")
      } else {
        console.log(chalk.cyan("Your team's Haiku projects:"))
        console.log("(To work with one, call " + chalk.bold("haiku import project_name"))
        _.forEach(projects, (project) => {
          console.log("  " + project.Name)
        })
      }
    })
  })
}


function doLogin(cb?: Function) {
  console.log('Enter your Haiku credentials.')
  var username = ''
  var password = ''

  inquirer.prompt([
    {
      type: 'input',
      name: 'username',
      message: 'Email:',
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
        if(flags.verbose){
          console.log(err)
        }
      } else {
        console.log(chalk.bold.green(`Welcome ${username}!`))
      }
      if (cb) {
        cb()
      }
    })
  })
}

function doLogout() {
  client.config.setAuthToken("")
}

function doOpen() {
  var projectName = args[0]

  ensureAuth(function (token) {
    inkstone.project.getByName(projectName, function (err, project) {
      console.log("TODO:  launch an instance of Creator with this project open:", project)
    })
  })
}

//TODO:  realtime sync on a branch
function doSync() {
  console.warn("Unimplemented")
}





