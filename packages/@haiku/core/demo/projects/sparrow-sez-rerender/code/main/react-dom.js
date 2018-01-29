var ReactDOMAdapter = require('@haiku/core/dom/react')
var HaikuDOMComponent = require('./dom')
var ReactDOMComponent = ReactDOMAdapter(HaikuDOMComponent)
if (ReactDOMComponent.default) ReactDOMComponent = ReactDOMComponent.default

ReactDOMComponent.mount = function (element, React, ReactDOM) {
  function renderCard (card) {
    return React.createElement(ReactDOMComponent, {
      style: {
        marginTop: -19,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      key: 'card' + card.uniqueId,
      haikuStates: {
        score: {
          value: card.sentiment
        }
      },
      onClick: function (proxy, event, instance) {
        instance.getDefaultTimeline().gotoAndPlay(0)
      }
    }, [
      React.createElement('span', {
        key: 'tweet' + card.uniqueId,
        style: {
          position: 'absolute',
          transform: 'none !important',
          height: '92px !important',
          right: '40px',
          top: '50px',
          zIndex: 1,
          fontSize: '13px',
          overflow: 'hidden'
        }
      }, [card.text]),
      React.createElement('img', {
        key: 'face' + card.uniqueId,
        style: {
          position: 'absolute',
          transform: 'none !important',
          width: '55px !important',
          height: '55px !important',
          right: '30px',
          bottom: '6px',
          borderRadius: '50%',
          zIndex: 1,
          fontSize: '13px',
          overflow: 'hidden',
          boxShadow: '0 3px 14px 0 rgba(34,0,56,0.36)',
        },
        src: card.tweeterPhoto
      })
    ])
  }

  function randCard () {
    return { uniqueId: Math.random(), sentiment: Math.random() * 10, text: 'Hello ' + Math.random(), tweeterPhoto: SRC }
  }

  function makeRandCards () {
    var cards = []
    var rand = ~~(Math.random() * 10)
    for (var i = 0; i < rand; i++) {
      cards.push(randCard())
    }
    return cards
  }

  class Parent extends React.Component {
    constructor() {
      super()
      this.state = {
        cards: [
          randCard(),
          randCard(),
          randCard()
        ]
      }
    }

    componentDidMount() {
      this.interval = setInterval(function () {
        var cards = makeRandCards()
        console.info('[test] rerendering with ' + cards.length + ' cards')
        this.setState({
          cards: cards
        })
      }.bind(this), 1000)
    }

    render() {
      return React.createElement('div', {
        style: {
          overflowY: 'scroll',
          overflowX: 'hidden'
        }
      }, this.state.cards.map(renderCard))
    }
  }

  ReactDOM.render(
    React.createElement(Parent),
    element
  )
}

var SRC = 'data:image/png;base64,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'

module.exports = ReactDOMComponent
