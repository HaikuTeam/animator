const BaseModel = require('./BaseModel')

class DevConsole extends BaseModel {
  constructor (props, opts) {
    super(props, opts)

    if (typeof window !== 'undefined') {
      if (!window.hasOwnProperty('help')) {
        Object.defineProperty(window, 'help', {
          get: () => {
            this.showHelp()
          }
        })
      }

      if (!window.hasOwnProperty('component')) {
        Object.defineProperty(window, 'component', {
          get: () => {
            return this.getPreviewComponent()
          }
        })
      }

      if (!window.hasOwnProperty('stage')) {
        Object.defineProperty(window, 'stage', {
          get: () => {
            return this.getStageElement()
          }
        })
      }

      if (!window.hasOwnProperty('exit')) {
        Object.defineProperty(window, 'exit', {
          get: () => {
            if (console.clear) {
              console.clear()
            }

            this.component.project.setInteractionMode(
              0,
              this.component.project.getMetadata(),
              () => {}
            )
          }
        })
      }
    }
  }

  getStageElement () {
    const $stage = window.document.getElementById('haiku-stage')
    return $stage && $stage.children[0]
  }

  getPreviewComponent () {
    const stage = this.getStageElement()
    return stage && stage.haiku && stage.haiku.component
  }

  showHelp () {
    console.log([
      'Hi there! You\'ve found the Haiku help message. 😃',
      '',
      'New to coding? Check out http://jsforcats.com 🐈',
      '',
      'Know JavaScript already? 🤸 Here are some things you can try:',
      '',
      '  Pause the animation:',
      '  > component.pause();',
      '',
      '  Seek to a specific frame:',
      '  > component.gotoAndStop(20);',
      '',
      '  Get the user\'s mouse cursor position {x,y}:',
      '  > component.evaluate(\'$user.mouse\');',
      '',
      '  Get your component\'s size {x,y,z}:',
      '  > component.size;',
      '',
      'For more, visit https://docs.haiku.ai 📓',
      '',
      'To exit the preview at any time, just type \'exit\'. 👋',
      '',
      '…'
    ].join('\n'))
  }

  logBanner () {
    if (console.clear) {
      console.clear()
    }

    console.log([
      'Welcome to the Haiku Console! 🤖 ',
      '',
      'Here we show live info about your Haiku as you preview it. 👩‍💻',
      '',
      'You can use this to…',
      '  - Debug Actions 💡',
      '  - Try out code snippets 🍀',
      '  - Just watch the logs go by 🌇',
      '',
      'Want help? Type \'help\' at the prompt (below, at the very bottom) and press enter.',
      '',
      'Have fun! 🏖',
      '',
      '…'
    ].join('\n'))
  }
}

DevConsole.DEFAULT_OPTIONS = {
  required: {
    component: true
  }
}

BaseModel.extend(DevConsole)

module.exports = DevConsole
