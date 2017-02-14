var vanityHandlers = require('haiku-bytecode/src/properties/dom/vanities')
var ensureStyleProps = require('haiku-bytecode/src/properties/dom/ensureStyleProps')
var ensureLayoutProps = require('haiku-bytecode/src/properties/dom/ensureLayoutProps')
var queryTree = require('haiku-bytecode/src/cssQueryTree')
var Transitions = require('haiku-bytecode/src/Transitions')
var Utils = require('haiku-bytecode/src/Utils')

var CSS_QUERY_MAPPING = {
  name: 'elementName',
  attributes: 'attributes',
  children: 'children'
}

function Template (template) {
  this.template = template
}

Template.prototype.getTree = function getTree () {
  return this.template
}

Template.prototype.applyContextChanges = function _applyContextChanges (context, instance, inputs) {
  return applyContextChanges(context, instance, inputs, this.template)
}

function applyContextChanges (context, instance, inputs, template) {
  var results = {}

  context.eachEventHandler(function _eachEventHandler (handler, selector, eventname) {
    if (!results[selector]) results[selector] = {}
    results[selector][eventname] = handler
  })

  context.eachActiveTimeline(function _eachActiveTimeline (timeline, timelinename, cluster, now, selector, outputname) {
    if (!results[selector]) results[selector] = {}
    var finalValue = Transitions.calculateValue(cluster, now, instance, inputs)
    if (Utils.isEmpty(finalValue)) return
    if (Utils.isEmpty(results[selector][outputname])) results[selector][outputname] = finalValue
    else results[selector][outputname] = Utils.mergeValue(results[selector][outputname], finalValue)
  })

  for (var selector in results) {
    var matches = findMatchingElements(selector, template)
    if (!matches || matches.length < 1) continue
    for (var i = 0; i < matches.length; i++) {
      var match = matches[i]
      var group = results[selector]
      for (var name in group) {
        var value = group[name]
        applyValueToElement(match, name, value)
      }
    }
  }

  return template
}

function findMatchingElements (selector, template) {
  return queryTree([], template, selector, CSS_QUERY_MAPPING)
}

function fixAttributes (element) {
  ensureStyleProps(element)
  ensureLayoutProps(element)
  return element
}

function applyValueToElement (element, name, value) {
  fixAttributes(element)
  if (vanityHandlers[element.elementName] && vanityHandlers[element.elementName][name]) {
    vanityHandlers[element.elementName][name](name, element, value)
  } else {
    element.attributes[name] = value
  }
}

module.exports = Template
