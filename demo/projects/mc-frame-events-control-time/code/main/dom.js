var HaikuDOMAdapter = require('@haiku/core/dom')
module.exports = HaikuDOMAdapter(require('./code'), {
  onHaikuComponentDidMount: (instance) => {
    let f = 0;

    const incr = () => {
      instance.controlTime('Default', (f++) * 16.666)
    };

    incr();

    setInterval(() => {
      incr();
    }, 100)
  }
})
