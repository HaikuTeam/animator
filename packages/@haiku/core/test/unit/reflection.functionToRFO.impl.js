module.exports = (tape, functionToRFO) => {
  tape(
    'reflection.functionToRFO',
    (t) => {
      t.plan(20)

      let rfo

      // named standard function

      rfo = functionToRFO(function _foobar (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":"_foobar","params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function _foobar (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":"_foobar","params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function _foobar (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":"_foobar","params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function _foobar (a, b, c) {
        /** hyasdf
        yaya
        */
        return 123
        // thingy
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":"_foobar","params":["a","b","c"],"body":"/** hyasdf\\n        yaya\\n        */\\n        return 123\\n        // thingy"}}`
      )

      // anonymous standard function

      rfo = functionToRFO(function (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function (a, b, c) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO(function (a, b, c) {
        /** hyasdf
        yaya
        */
        return 123
        // thingy
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"/** hyasdf\\n        yaya\\n        */\\n        return 123\\n        // thingy"}}`
      )

      // anonymous arrow function with braced body

      rfo = functionToRFO((a, b, c) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO((a, b, c) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO((a, b, c) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`
      )

      rfo = functionToRFO((a, b, c) => {
        /** hyasdf
        yaya
        */
        return 123
        // thingy
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"/** hyasdf\\n        yaya\\n        */\\n        return 123\\n        // thingy"}}`
      )

      // standard with argument object destructuring

      rfo = functionToRFO(function ({ a, b, c }) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":[{"a":"a","b":"b","c":"c"}],"body":"return 123"}}`
      )

      rfo = functionToRFO(function ({ a, b, c: { d, e } }) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":[{"a":"a","b":"b","c":{"d":"d","e":"e"}}],"body":"return 123"}}`
      )

      rfo = functionToRFO(function ({ a, b, c, c: [d, e] }) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":[{"a":"a","b":"b","c":["d","e"]}],"body":"return 123"}}`
      )

      rfo = functionToRFO(function (
        { a, b, c: [d, e] },
        { f, z: [g, h], i, j, k: { l, m, m: { n, o } } },
        ...args
      ) {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"FunctionExpression","name":null,"params":[{"a":"a","b":"b","c":["d","e"]},{"f":"f","z":["g","h"],"i":"i","j":"j","k":{"l":"l","m":{"n":"n","o":"o"}}},{"__rest":"args"}],"body":"return 123"}}`
      )

      // arrow with argument object destructuring

      rfo = functionToRFO(({ a, b, c }) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":[{"a":"a","b":"b","c":"c"}],"body":"return 123"}}`
      )

      rfo = functionToRFO(({ a, b, c: { d, e } }) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":[{"a":"a","b":"b","c":{"d":"d","e":"e"}}],"body":"return 123"}}`
      )

      rfo = functionToRFO(({ a, b, c: [d, e] }) => {
        return 123
      })
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":[{"a":"a","b":"b","c":["d","e"]}],"body":"return 123"}}`
      )

      rfo = functionToRFO(
        (
          { a, b, c, c: [d, e] },
          { f, z, z: [g, h], i, j, k: { l, m, m: { n, o } } },
          ...args
        ) => {
          return 123
        }
      )
      t.equal(
        JSON.stringify(rfo),
        `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":[{"a":"a","b":"b","c":["d","e"]},{"f":"f","z":["g","h"],"i":"i","j":"j","k":{"l":"l","m":{"n":"n","o":"o"}}},{"__rest":"args"}],"body":"return 123"}}`
      )
    },
  );
};

// anonymous arrow function with unbraced body
// TODO: test this once the test harness itself can support this style
// rfo = functionToRFO((a, b, c) => return 123)
// t.equal(JSON.stringify(rfo), `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`)
// rfo = functionToRFO((a,b,c)=>return 123)
// t.equal(JSON.stringify(rfo), `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`)
// rfo = functionToRFO((a,b,c)=>return 123 + 456 * (foo - bar) + {'run':'far'})
// t.equal(JSON.stringify(rfo), `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}`)
// rfo = functionToRFO((a,b,c)          =>      return 123 + 456 * (foo - bar) + {'run':'far'}                  )
// t.equal(JSON.stringify(rfo), `{"__function":{"type":"ArrowFunctionExpression","name":null,"params":["a","b","c"],"body":"  /** hyasdf\\n  yaya\\n  */return 123; // thingy"}}`)
