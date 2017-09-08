module.exports = parse

/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */

function parse(xml) {
  xml = xml.trim()

  // strip comments
  xml = xml.replace(/<!--[\s\S]*?-->/g, "")

  return document()

  /**
   * XML document.
   */

  function document() {
    return {
      declaration: declaration(),
      root: tag(),
    }
  }

  /**
   * Declaration.
   */

  function declaration() {
    let m = match(/^<\?xml\s*/)
    if (!m) return

    // tag
    let node = {
      attributes: {},
    }

    // attributes
    while (!(eos() || is("?>"))) {
      let attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    match(/\?>\s*/)

    return node
  }

  /**
   * Tag.
   */

  function tag() {
    let m = match(/^<([\w-:.]+)\s*/)
    if (!m) return

    // name
    let node = {
      name: m[1],
      attributes: {},
      children: [],
    }

    // attributes
    while (!(eos() || is(">") || is("?>") || is("/>"))) {
      let attr = attribute()
      if (!attr) return node
      node.attributes[attr.name] = attr.value
    }

    // self closing tag
    if (match(/^\s*\/>\s*/)) {
      return node
    }

    match(/\??>\s*/)

    // content
    node.content = content()

    // children
    let child = tag()
    while (child) {
      node.children.push(child)
      child = tag()
    }

    // closing
    match(/^<\/[\w-:.]+>\s*/)

    return node
  }

  /**
   * Text content.
   */

  function content() {
    let m = match(/^([^<]*)/)
    if (m) return m[1]
    return ""
  }

  /**
   * Attribute.
   */

  function attribute() {
    let m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/)
    if (!m) return
    return { name: m[1], value: strip(m[2]) }
  }

  /**
   * Strip quotes from `val`.
   */

  function strip(val) {
    return val.replace(/^['"]|['"]$/g, "")
  }

  /**
   * Match `re` and advance the string.
   */

  function match(re) {
    let m = xml.match(re)
    if (!m) return
    xml = xml.slice(m[0].length)
    return m
  }

  /**
   * End-of-source.
   */

  function eos() {
    return xml.length === 0
  }

  /**
   * Check for `prefix`.
   */

  function is(prefix) {
    return xml.indexOf(prefix) === 0
  }
}
