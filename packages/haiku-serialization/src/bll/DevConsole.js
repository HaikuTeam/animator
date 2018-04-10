const BaseModel = require('./BaseModel')

class DevConsole extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    this.didLogBanner = false

    if (typeof window !== 'undefined') {
      if (!window.hasOwnProperty('help')) {
        Object.defineProperty(window, 'help', {
          get: () => {
            console.log(`
Haiku ${process.env.HAIKU_RELEASE_VERSION} (${process.env.NODE_ENV})
Usage:
    help - Display this message
            `)
          }
        })
      }
    }
  }

  logBanner () {
    if (!this.didLogBanner) {
      this.didLogBanner = true

      if (console.clear) {
        console.clear()
      }

      console.log(`
         _       _    _                    _          _         _               
        / /\\    / /\\ / /\\                 /\\ \\       /\\_\\      /\\_\\             
       / / /   / / // /  \\                \\ \\ \\     / / /  _  / / /         _   
      / /_/   / / // / /\\ \\               /\\ \\_\\   / / /  /\\_\\\\ \\ \\__      /\\_\\ 
     / /\\ \\__/ / // / /\\ \\ \\             / /\\/_/  / / /__/ / / \\ \\___\\    / / / 
    / /\\ \\___\\/ // / /  \\ \\ \\           / / /    / /\\_____/ /   \\__  /   / / /  
   / / /\\/___/ // / /___/ /\\ \\         / / /    / /\\_______/    / / /   / / /   
  / / /   / / // / /_____/ /\\ \\       / / /    / / /\\ \\ \\      / / /   / / /    
 / / /   / / // /_________/\\ \\ \\  ___/ / /__  / / /  \\ \\ \\    / / /___/ / /     
/ / /   / / // / /_       __\\ \\_\\/\\__\\/_/___\\/ / /    \\ \\ \\  / / /____\\/ /      
\\/_/    \\/_/ \\_\\___\\     /____/_/\\/_________/\\/_/      \\_\\_\\ \\/_________/       

Copyright (c) Haiku 2016-2018. All Rights Reserved.

Welcome to the Haiku Dev Console!
View docs at https://docs.haiku.ai.
Type 'help' for available commands.
`)
    }
  }
}

DevConsole.DEFAULT_OPTIONS = {
  required: {
    component: true
  }
}

BaseModel.extend(DevConsole)

module.exports = DevConsole
