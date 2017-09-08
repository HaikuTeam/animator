function visitTemplate (template, parent, iteratee) {
  iteratee(template, parent)
  for (var i = 0; i < template.children.length; i++) {
    var child = template.children[i]
    if (!child || typeof child === 'string') continue
    visitTemplate(child, template, iteratee)
  }
}

module.exports = visitTemplate
