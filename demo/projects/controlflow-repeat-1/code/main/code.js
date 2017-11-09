module.exports = {
  timelines: {
    Default: {
      '#c':{
        'content':{
          0:{
            value:function ({foobar}) {
              return foobar + '!'
            }
          }
        }
      },
      '#b': {
        'controlFlow.repeat':{
          0:{
            value:function({tweets}){
              return tweets.map(function(tweet, index) {
                return {
                  content: tweet.text,
                  'translation.x': index * 10,
                  'translation.x': index * 20
                }
              })
            }
          }
        }
      }
    }
  },
  states: {
    foobar: {value:'WOWIE'},
    tweets:{
      value:[
        {text:'uno'},
        {text:'dos'},
        {text:'tres'}
      ]
    }
  },
  eventHandlers: {},
  template: {elementName:'div',attributes:{id:'a'},children:[
    {elementName:'div',attributes:{id:'b'},children:[
      {elementName:'div',attributes:{id:'c'},children:[]}
    ]}
  ]}
}
