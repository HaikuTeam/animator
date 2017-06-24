
import * as clc from "cli-color"
import * as path from "path"
import * as prependFile from "prepend-file"
import * as inquirer from "inquirer"
import * as _ from "lodash"
import * as os from "os"
import * as tail from "tail"
import { argv } from "yargs"
import * as request from "request"
import * as chalk from "chalk"
import * as mkdirp from "mkdirp"
import * as fs from "fs"
import * as hasbin from "hasbin"
import { execSync } from 'child_process'

import { inkstone } from "haiku-sdk-inkstone"
import { client } from "haiku-sdk-client"

let dedent = require("dedent")

const banner = dedent`
  Haiku CLI (version 2.1.1)

  Usage:
    haiku <command> [flags]

  Commands:
    clone <project_name> - Clone a Haiku project to your filesystem, passing through to git clone
    delete - Delete a Haiku project by name (interactive)
    diff-tail - See a live stream of code diffs that are being written by Haiku
    list - List your team's Haiku projects
    login - Log in to Haiku (interactive)
    logout - Log out of Haiku
    install <project_name> - Install a Haiku project as an npm module, requires a package.json
    update - Updates all Haiku-installed packages, passing through to npm update
    help - Display this message
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
process.on("exit", exitwrap)
process.on("SIGINT", exitwrap)
process.on("uncaughtException", exitwrap)

const main = path.join(__dirname, "..", "creator", "electron-main.js")

function handleError(err) {
  //TODO: figure out error categories, allow individual CLI commands to handle categories as needed
}

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
  baseUrl: flags.api || "https://inkstone.haiku.ai/",
  baseShareUrl: flags.share || "https://share.haiku.ai/"
});

if (flags.verbose) {
  client.setConfig({ verbose: true })
  console.log("Flags: ", flags)
}

switch (subcommand) {
  case "await-share":
    //undocumented; used for SDK development
    doAwaitShare()
    break
  case "check-invite":
    //undocumented: used for SDK development
    doCheckInvite()
    break
  case "claim-invite":
    //undocumented: used for SDK development
    doClaimInvite()
    break
  case "clone":
    doClone()
    break
  case "delete":
    doDelete()
    break
  case "diff-tail":
    doDiffTail()
    break
  case "heal":
    doHeal()
    break
  case "list":
    doList()
    break
  case "login":
    doLogin()
    break
  case "logout":
  case "logoff":
    doLogout()
    break
  case "new":
  case "generate":
  case "create":
    //Not intended for user consumption yet
    doCreate()
    break
  // case "import":
  //   doImport()
  //   break
  case "install":
    doInstall()
    break
  case "open":
    doOpen()
    break
  case "update":
  case "upgrade":
    doUpdate()
    break
  case "help":
    help()
    break
  default:
    help()
    break
}

function doAwaitShare() {
  var id = args[0]
  inkstone.snapshot.awaitSnapshotLink(id, (err, str) => {
    if (err !== undefined) {
      console.log(chalk.red(err))
    } else {
      console.log(chalk.green("Share link: " + str))
    }
  })
}

function doCheckInvite() {
  var code = args[0]
  inkstone.invite.checkValidity(code, (err, valid) => {
    if (valid) console.log(chalk.green("invite is valid"))
    else console.log(chalk.red(err))
  })
}

function doClaimInvite() {
  inquirer.prompt([
    {
      type: "input",
      name: "code",
      message: "Invite Code:",
    },
    {
      type: "input",
      name: "email",
      message: "Email Address:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
    },
    {
      type: "input",
      name: "organizationName",
      message: "Organization Name (only needed if org invite):",
    }
  ]).then(function (answers: inquirer.Answers) {
    var projectName = answers["name"]
    var claim: inkstone.invite.InviteClaim = {
      Code: answers["code"],
      Email: answers["email"],
      OrganizationName: answers["organizationName"],
      Password: answers["password"]
    }

    inkstone.invite.claimInvite(claim, (err, valid) => {
      if (valid) console.log(chalk.green("Invite successfully claimed. Welcome to Haiku!"))
      else console.log(chalk.red(err))
    })
  })
}


function doClone() {
  var projectName = args[0]
  var destination = args[1] || projectName
  if (destination.charAt(destination.length - 1) !== "/") destination += "/"

  ensureAuth(function (token) {
    console.log("Cloning project...")
    inkstone.project.getByName(token, projectName, function (err, projectAndCredentials) {
      if (err) {
        console.log(chalk.bold(`Project ${projectName} not found.`))
        process.exit(1)
      } else {
        var gitEndpoint = projectAndCredentials.Project.GitRemoteUrl
        //TODO:  store credentials more securely than this
        gitEndpoint = gitEndpoint.replace("https://", "https://" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsUsername) + ":" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsPassword) + "@")

        client.git.cloneRepo(gitEndpoint, destination, (err) => {
          if (err != undefined) {
            console.log(chalk.red("Error cloning project.  Use the --verbose flag for more information."))
            process.exit(1)
          } else {
            console.log(`Project ${chalk.bold(projectName)} cloned to ${chalk.bold(destination)}`)
            process.exit(0)
          }
        })
      }
    })
  })
}


function doCreate() {
  ensureAuth((token: string) => {
    //TODO:  support "cloning" project directly into fs after creation (i.e. autoimport)
    inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project Name:",
      }
    ]).then(function (answers: inquirer.Answers) {
      var projectName = answers["name"]
      console.log("Creating project...")
      
      inkstone.project.create(token, { Name: projectName }, (err, project) => {
        if (err) {
          console.log(chalk.red("Error creating project.  Does this project with this name already exist?"))
          process.exit(1)
        } else {
          console.log(chalk.green("Project created!"))
          process.exit(0)
        }
      })
    })
  })
}

function doDelete() {
  ensureAuth((token: string) => {
    console.log(chalk.bold("Please note that deleting this project will delete it for your entire team."))
    console.log(chalk.red("Deleting a project cannot be undone!"))
    inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Project Name:",
      }
    ]).then(function (answers: inquirer.Answers) {
      var projectName = answers["name"]
      console.log("Deleting project...")
      inkstone.project.deleteByName(token, projectName, (err, project) => {
        if (err) {
          console.log(chalk.red("Error deleting project.  Does this project exist?"))
          process.exit(1)
        } else {
          console.log(chalk.green("Project deleted!"))
          process.exit(0)
        }
      })
    })
  })
}

function doDiffTail() {
  try {
    console.log("Waiting for diffs...")
    var tailer = new tail.Tail(os.homedir() + "/.haiku/logs/haiku-diffs.log")
    tailer.on("line", function (data) {
      console.log(data)
    })
  } catch (e) {
    console.log(chalk.red("You need to edit a project at least once with Haiku in order to use diff-tail."))
  }
}

//USAGE:  haiku import design-test dest/
//        clone git repo "someendpoint/design-test" as a subtree into the dest/design-test folder
function doImport() {
  var projectName = args[0]
  var destination = args[1] || projectName
  if (destination.charAt(destination.length - 1) !== "/") destination += "/"

  ensureAuth(function (token) {
    inkstone.project.getByName(token, projectName, function (err, projectAndCredentials) {
      if (err) {
        console.log(chalk.bold(`Project ${projectName} not found.`))
      } else {

        var actuallyDoImport = function () {
          var gitEndpoint = projectAndCredentials.Project.GitRemoteUrl
          //TODO:  store credentials more securely than this
          gitEndpoint = gitEndpoint.replace("https://", "https://" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsUsername) + ":" + encodeURIComponent(projectAndCredentials.Credentials.CodeCommitHttpsPassword) + "@")

          client.git.ensureRemoteIsInitialized(projectName, gitEndpoint, () => {
            client.git.forciblyCloneSubrepo(projectName, destination, () => {
              console.log(`Project ${chalk.bold(projectName)} imported to ${chalk.bold(destination)}`)
            })
          })
        }

        //check if directory exists and is non-empty
        //if it does, prompt user that it exists & has stuff in it
        //ask whether it should be overwritten
        var alreadyExists = fs.existsSync(path.resolve(destination))
        if (alreadyExists) {
          inquirer.prompt([
            {
              type: "confirm",
              name: "confirmed",
              message: `The destination directory ${destination} already exists.  Do you want to overwrite it?`,
            }
          ]).then(function (answers: inquirer.Answers) {
            if (answers["confirmed"]) {
              actuallyDoImport()
            }
          })
        } else {
          actuallyDoImport()
        }

      }

    })
  })
}


//TODO:  copy .haiku scripts
//       ensure that packages are legit & pointed at latest & updated
//       ensure that prepare script is injected
//       message that .haiku folder needs to be added to git
//       ensure that ssh keys are generated and registered with server
function doHeal() {
  console.log("Unimplemented.  But please contact support@haiku.ai and we'll help you out!")
  process.exit(0)
}

function doInstall() {
  var projectName = args[0]
  if (!projectName || projectName == "") {
    console.log(chalk.red("Please provide a project name: ") + chalk.bold("haiku install projectname"))
    process.exit(1)
  }
  ensureAuth(function (token) {
    //ensure that npm is installed
    hasbin('npm', function (result) {
      if (result) {
        //ensure that there's a package.json in this directory
        if (fs.existsSync(process.cwd() + "/package.json")) {
          console.log("Installing " + projectName + "...")


          var packageJson = client.npm.readPackageJson()

          if (!packageJson.dependencies) {
            packageJson.dependencies = {}
          }

          //construct project string: @haiku/org-project#latest          
          var projectString = "@haiku/"
          inkstone.organization.list(token, (err, orgs) => {
            if (err !== undefined) {
              console.log(chalk.red("There was an error retrieving your account information.") + "  Please ensure that you have internet access.  If this problem persists, please contact support@haiku.ai and tell us that you don't have an organization associated with your account.")
              process.exit(1)
            }

            //TODO: for multi-org support, get the org name more intelligently than this
            projectString += orgs[0].Name.toLowerCase() + "-"

            inkstone.project.getByName(token, projectName, (err, projectAndCredentials) => {
              if (err != undefined) {
                console.log(chalk.red("That project wasn't found.") + "  Note that project names are CaseSensitive.  Please ensure that you have the correct project name, that you're logged into the correct account and that you have internet access.")
                process.exit(1)
              }

              projectString += projectAndCredentials.Project.Name.toLowerCase()

              //now projectString should be @haiku/org-project
              packageJson.dependencies[projectString] = "latest"

              //Set up @haiku scope for this project if it doesn't exist
              var npmrc = ""
              try {
                npmrc = fs.readFileSync(".npmrc").toString()
              } catch (err) {
                if (err.code === 'ENOENT') {
                  //file not found, this is fine
                } else {
                  //different error, should throw
                  throw (err)
                }
              }
              if (npmrc.indexOf("@haiku") === -1) {
                prependFile.sync(".npmrc", dedent`
                  //reservoir.haiku.ai:8910/:_authToken=
                  @haiku:registry=https://reservoir.haiku.ai:8910/
                `)
              }

              client.npm.writePackageJson(packageJson)
              try {
                execSync("npm install")
              } catch (e) {
                console.log(chalk.red("npm install failed.") + " Your Haiku packages have been injected into package.json, but npm install failed.  Please try again.")
                process.exit(1)
              }

              console.log(chalk.green("Haiku project installed successfully."))
              process.exit(0)
            })

          })

        } else {
          console.log(chalk.red("haiku install can only be used at the root of a project with a package.json."))
          console.log("You can use " + chalk.bold("haiku clone ProjectName [/Optional/Destination]") + " to clone the project's git repo directly.")
          process.exit(1)
        }
      } else {
        console.log(chalk.red("npm was not found on this machine. ") + " We recommend installing it with nvm: https://github.com/creationix/nvm")
        process.exit(1)
      }
    })

  })
}

function doList() {
  ensureAuth((token: string) => {

    if (flags && flags.organizations) {
      inkstone.organization.list(token, (err, organizations) => {
        if (organizations == undefined || organizations.length == 0) {
          console.log("You are not a member of any organizations.")
        } else {
          console.log(chalk.cyan("Your Organizations:"))
          _.forEach(organizations, (org) => {
            console.log("  " + org.Name)
          })
        }
      })
      process.exit(0)
    } else {

      inkstone.project.list(token, (err, projects) => {
        if (projects == undefined || projects.length == 0) {
          console.log("No existing projects.  Use " + chalk.bold("haiku generate") + " to make a new one!")
          process.exit(0)
        } else {
          console.log(chalk.cyan("Your team's Haiku projects:"))
          console.log("(To work with one, call " + chalk.bold("haiku clone project_name") + " or " + chalk.bold("haiku install project_name"))
          _.forEach(projects, (project) => {
            console.log("  " + project.Name)
          })
          process.exit(0)
        }
      })
    }
  })
}

function doLogin(cb?: Function) {
  console.log("Enter your Haiku credentials.")
  var username = ""
  var password = ""

  inquirer.prompt([
    {
      type: "input",
      name: "username",
      message: "Email:",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
    }
  ]).then(function (answers: inquirer.Answers) {
    username = answers["username"]
    password = answers["password"]

    inkstone.user.authenticate(username, password, function (err, authResponse) {
      if (err !== undefined) {
        console.log(chalk.bold.red("Username or password incorrect."))
        if (flags.verbose) {
          console.log(err)
        }
      } else {
        client.config.setAuthToken(authResponse.Token)
        console.log(chalk.bold.green(`Welcome ${username}!`))
      }
      if (cb) {
        cb()
      } else {
        process.exit(0)
      }
    })
  })
}

function doLogout() {
  //TODO:  expire auth token on inkstone?
  client.config.setAuthToken("")
  process.exit(0)
}

function doOpen() {
  var projectName = args[0]

  ensureAuth(function (token) {
    inkstone.project.getByName(token, projectName, function (err, project) {
      console.log("TODO:  launch an instance of Haiku with this project open:", project)
      process.exit(0)
    })
  })
}

//TODO:  update only @haiku packages, instead of all updatable packages in package.json
function doUpdate() {
  hasbin('npm', function (result) {
    if (result) {
      try {
        console.log("Updating packages...")
        execSync("npm update")
        console.log(chalk.green("Haiku packages updated successfully."))
        process.exit(0)
      } catch (e) {
        console.log(chalk.red("npm update failed.") + " This may be a configuration issue with npm.  Try running npm install and then running haiku update again.")
        process.exit(1)
      }
    } else {
      console.log(chalk.red("npm was not found on this machine. ") + " We recommend installing it with nvm: https://github.com/creationix/nvm")
      process.exit(1)
    }
  })
}




