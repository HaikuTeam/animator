import * as clc from 'cli-color'
import { clone, merge } from 'lodash'
import { argv } from 'yargs'
import * as request from 'request'

const banner = `
  Haiku CLI (version 0.0.0.0)

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


function finish(){
    process.exit(1)
}


let folder = flags.folder || args.shift()
if (!folder) folder = process.cwd()
else if (path.resolve(folder) !== folder) folder = path.join(process.cwd(), folder || '.')
console.log('Project folder:', folder, '\n')

if (subcommand === 'develop-internal') flags.devtool = true
const forwarded = JSON.stringify(merge(flags, { folder }))
process.env.HALCYON_OPTIONS = forwarded

process.stdin.resume()
function exitwrap(maybeException) {
  if (maybeException) console.log(maybeException)
  if (exitwrap.handler) exitwrap.handler()
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

function spawnElectron(args) {
  const electronProcess = proc.spawn(electron, [main].concat(args))
  exitwrap.handler = () => {
    electronProcess.stdin.pause()
    electronProcess.kill()
  }
  electronProcess.stdout.on('data', (data) => {
    process.stdout.write(data)
  })
  electronProcess.stderr.on('data', (error) => {
    process.stderr.write(error)
  })
  return electronProcess
}



//TODO:  abstract out paths, env/config (env var?)
var LOGIN_ENDPOINT = "http://localhost:8080/v0/user/auth"
var LOGIN_SCHEMA = {
  properties: {
    username: {
      required: true
    },
    password: {
      hidden: true
    }
  }
}
function performLogin(username, password, cb) {
  var formData = {
    username: username,
    password: password
  }
  request.post({url: LOGIN_ENDPOINT, formData, formData}, cb)
}

switch (subcommand) {
  case 'develop-internal':
    let debugBrk = ''
    let debugPort = ''
    if (flags['debug-brk']) debugBrk = '--debug-brk=' + flags['debug-brk']
    if (flags['remote-debugging-port']) debugPort = '--remote-debugging-port=' + flags['remote-debugging-port']
    console.log('launching: ', electron + ' ' + [main, debugBrk, debugPort].join(' '))
    spawnElectron(electron, [debugBrk, debugPort])
    break
  case 'login':
    var username = ''
    var password = ''

    //TODO:  `prompt` doesn't seem to play nicely
    //       with stdin when running halcyon-bin 
    //       (will skip the prompt and fill vars with empty strings.)
    //       Will we be able to support runtime text input?

    prompt.start()
    prompt.get(LOGIN_SCHEMA, function (err, result) {
      if(err){
        console.warn('error parsing username or password')
        process.exit(1)
      }
      username = result.username
      password = result.password
    })

    performLogin(username, password, function(err, httpResponse, body){
      if(err){
        console.log('username or password incorrect', err)
      }else{
        console.log('success', httpResponse)
      }
    })
    break
  case 'logout':
    console.warn('unimplemented')
    break
  case 'help':
    help()
    break
  default:
    help()
    break
}



console.log("hello world")