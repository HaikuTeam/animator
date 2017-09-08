// Top comment which should be REMOVED 1
// Top comment which should be REMOVED 2
/* unit testing hack */ var Module = require('module')
/* unit testing hack */ var originalRequire = Module.prototype.require
/* unit testing hack */ Module.prototype.require = function () { return {} }
var FooBar = require('foo-bar')
var HaikuMeow = require('@haiku/Meow')
var Barf = require('BARF')
/* unit testing hack */ Module.prototype.require = originalRequire
module.exports = {
  timelines: {
    Default: {
      '#box': {
        'rotaion.z': {
          0: {
            "value": function({ foo: { bar }, baz }, wowie) {
              return (
                foo.bar.baz * dee
              )
            },
            curve: 'wakalaka'
          }
        },
        'rob.x': {
          '0': {
            value: ({ foo: [a,b,c] }) => {
              return ['123']
            }
          }
        }
      }
    }
  },
  template: {
    elementName: 'div',
    attributes: {id:'box'},
    children: []
  }
}
