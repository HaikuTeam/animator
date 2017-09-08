/* unit testing hack */ var Module = require('module')
/* unit testing hack */ var originalRequire = Module.prototype.require
/* unit testing hack */ Module.prototype.require = function () { return {} }
var FooBar = require('foo-bar')
var HaikuMeow = require('@haiku/Meow')
var Barf = require('BARF')
/* unit testing hack */ Module.prototype.require = originalRequire
module.exports = {
  timelines: {},
  template: {
    elementName: 'div',
    attributes: {},
    children: []
  }
}
