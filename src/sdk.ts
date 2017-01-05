import * as request from "request"

//TODO:  abstract out paths, env/config (env var?)
var LOGIN_ENDPOINT = "http://localhost:8080/v0/user/auth"


export namespace inkstone {


    export type Callback<T> = (err : string, data : T) => void
    
    export namespace user {

        export interface Authentication {
            expiration: string
            auth_token: string
        }
        
        export function authenticate(username, password, cb : inkstone.Callback<Authentication>) {
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

            request.post(options, function (err, httpResponse, body){
                if(httpResponse.statusCode === 200){
                    var auth = body as Authentication
                    cb(undefined, auth)
                }else{
                    cb("uncategorized error", undefined)
                }
            });

        }
    }
}