module.exports = {
  timelines: {
    Default: {
      '#c':{
        'content':{
          0:{
            value:'hiho'
          },
          1000: {
            value:'offtoworkwego'
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
      'component:will-mount': {
        handler: function(event) {
          console.log('will-mount',event)
        }
      },
      'component:did-mount': {
        handler: function(event) {
          console.log('did-mount',event)
        }
      },
      'timeline:Default:22': {
        handler: function(event) {
          console.log('frame',event)
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
