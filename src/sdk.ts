import * as request from "request"
import * as fs from "fs"
import * as os from "os"
import * as mkdirp from "mkdirp"

//TODO:  abstract out paths, env/config (env var?)
//TODO:  make file paths cross-platform friendly
var LOGIN_ENDPOINT = "http://localhost:8080/v0/user/auth"
var PROJECT_LIST_ENDPOINT = "http://localhost:8080/v0/project"

export namespace inkstone {

  export type Callback<T> = (err: string, data: T) => void

  export namespace user {

    export interface Authentication {
      expiration: string
      auth_token: string
    }

    export function authenticate(username, password, cb: inkstone.Callback<Authentication>) {
      var formData = {
        username: username,
        password: password
      }

      var options: request.UrlOptions & request.CoreOptions = {
        url: LOGIN_ENDPOINT,
        json: formData,
        headers: {
          "Content-Type": "application/json"
        }
      }

      request.post(options, function (err, httpResponse, body) {
        if (httpResponse.statusCode === 200) {
          var auth = body as Authentication
          cb(undefined, auth)
        } else {
          cb("uncategorized error", undefined)
        }
      })

    }
  }

  export namespace project {
    export interface Project {
      name: string
      git_remote_url: string
      git_remote_name: string
      git_remote_arn: string
    }

    export function list(authToken:string, cb: inkstone.Callback<Project[]>){

      var options: request.UrlOptions & request.CoreOptions = {
        url: PROJECT_LIST_ENDPOINT,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `INKSTONE auth_token="${authToken}"`
        }
      }

      request.get(options, function (err, httpResponse, body) {
        if (httpResponse.statusCode === 200) {
          var projects = body as Project[]
          cb(undefined, projects)
        } else {
          cb("uncategorized error", undefined)
        }
      })
    }
  }
}

const FILE_PATHS = {
  AUTH_TOKEN: os.homedir() + "/.haiku/auth"
}

function _ensureHomeFolder() {
  mkdirp.sync(os.homedir() + "/.haiku")
}

export namespace client {
  export class config {
    static getAuthToken(): string {
      if (fs.existsSync(FILE_PATHS.AUTH_TOKEN)) {
        var token = fs.readFileSync(FILE_PATHS.AUTH_TOKEN).toString();
        return token
      } else {
        return undefined
      }
    }

    static setAuthToken(newToken: string) {
      _ensureHomeFolder()
      fs.writeFileSync(FILE_PATHS.AUTH_TOKEN, newToken)
    }
  }
}