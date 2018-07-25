var HaikuDOMAdapter = require('@haiku/core/dom')
module.exports = HaikuDOMAdapter(require('./code'), {
  onHaikuComponentDidMount: (instance) => {
    let f = 0;

    const incr = () => {
      const t = (f++) * 16.666
      instance.controlTime('Default', t)
    };

    incr();

    setInterval(() => {
      incr();
    }, 100)
  }
})
