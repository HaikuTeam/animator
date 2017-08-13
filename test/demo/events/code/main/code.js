module.exports = {
  timelines: {
    Default: {
      '#c':{
        'content':{
          0:{
            value:function ({foobar}) {
              return foobar + ' asdf !'
            }
          }
        }
      }
    }
  },
  states: {
    foobar: {value:''}
  },
  eventHandlers: {
    '#a': {
      'resize': {
        handler: function(event) {
          console.log('window resized')
        }
      },
      'lala':{
        handler:function(event) {
          console.log('#a got lala', event)
          this.foobar = 'WAHOOOO'
        }
      }
    },
    '#b': {
      'lala':{
        handler:function(event) {
          console.log('#b got lala', event)
        }
      }
    },
    '#c': {
      'click':{
        handler:function(event){
          console.log('#c got click', event)
          event.target.dispatchEvent(new Event('lala', {
            bubbles: true
          }))
        }
      }
    }
  },
  template: {elementName:'div',attributes:{id:'a'},children:[
    {elementName:'div',attributes:{id:'b'},children:[
      {elementName:'div',attributes:{id:'c'},children:[]}
    ]}
  ]}
}
