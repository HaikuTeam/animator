/* eslint-disable */

"use strict"

let Config = {
  DEBUG: false,
  LIB_VERSION: "2.11.1",
}

// since es6 imports are static and we run unit tests from the console, window won't be defined when importing this file
let win
if (typeof window === "undefined") {
  win = {
    navigator: {},
  }
} else {
  win = window
}

/*
 * Saved references to long variable names, so that closure compiler can
 * minimize file size.
 */

let ArrayProto = Array.prototype
let FuncProto = Function.prototype
let ObjProto = Object.prototype
let slice = ArrayProto.slice
let toString = ObjProto.toString
let hasOwnProperty = ObjProto.hasOwnProperty
let windowConsole = win.console
let navigator$1 = win.navigator
let document$1 = win.document
let userAgent = navigator$1.userAgent
let nativeBind = FuncProto.bind
let nativeForEach = ArrayProto.forEach
let nativeIndexOf = ArrayProto.indexOf
let nativeIsArray = Array.isArray
let breaker = {}
let _ = {
  trim(str) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
    return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "")
  },
}

// Console override
let console$1 = {
  /** @type {function(...[*])} */
  log() {
    if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
      try {
        windowConsole.log.apply(windowConsole, arguments)
      } catch (err) {
        _.each(arguments, function(arg) {
          windowConsole.log(arg)
        })
      }
    }
  },
  /** @type {function(...[*])} */
  error() {
    if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
      let args = ["Mixpanel error:"].concat(_.toArray(arguments))
      try {
        windowConsole.error.apply(windowConsole, args)
      } catch (err) {
        _.each(args, function(arg) {
          windowConsole.error(arg)
        })
      }
    }
  },
  /** @type {function(...[*])} */
  critical() {
    if (!_.isUndefined(windowConsole) && windowConsole) {
      let args = ["Mixpanel error:"].concat(_.toArray(arguments))
      try {
        windowConsole.error.apply(windowConsole, args)
      } catch (err) {
        _.each(args, function(arg) {
          windowConsole.error(arg)
        })
      }
    }
  },
}

// UNDERSCORE
// Embed part of the Underscore Library
_.bind = function(func, context) {
  let args, bound
  if (nativeBind && func.bind === nativeBind) {
    return nativeBind.apply(func, slice.call(arguments, 1))
  }
  if (!_.isFunction(func)) {
    throw new TypeError()
  }
  args = slice.call(arguments, 2)
  bound = function() {
    if (!(this instanceof bound)) {
      return func.apply(context, args.concat(slice.call(arguments)))
    }
    let ctor = {}
    ctor.prototype = func.prototype
    let self = new ctor()
    ctor.prototype = null
    let result = func.apply(self, args.concat(slice.call(arguments)))
    if (Object(result) === result) {
      return result
    }
    return self
  }
  return bound
}

_.bind_instance_methods = function(obj) {
  for (let func in obj) {
    if (typeof obj[func] === "function") {
      obj[func] = _.bind(obj[func], obj)
    }
  }
}

/**
 * @param {*=} obj
 * @param {function(...[*])=} iterator
 * @param {Object=} context
 */
_.each = function(obj, iterator, context) {
  if (obj === null || obj === undefined) {
    return
  }
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context)
  } else if (obj.length === +obj.length) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return
      }
    }
  } else {
    for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) {
          return
        }
      }
    }
  }
}

_.escapeHTML = function(s) {
  let escaped = s
  if (escaped && _.isString(escaped)) {
    escaped = escaped
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }
  return escaped
}

_.extend = function(obj) {
  _.each(slice.call(arguments, 1), function(source) {
    for (let prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop]
      }
    }
  })
  return obj
}

_.isArray =
  nativeIsArray ||
  function(obj) {
    return toString.call(obj) === "[object Array]"
  }

// from a comment on http://dbj.org/dbj/?p=286
// fails on only one very rare and deliberate custom object:
// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
_.isFunction = function(f) {
  try {
    return /^\s*\bfunction\b/.test(f)
  } catch (x) {
    return false
  }
}

_.isArguments = function(obj) {
  return !!(obj && hasOwnProperty.call(obj, "callee"))
}

_.toArray = function(iterable) {
  if (!iterable) {
    return []
  }
  if (iterable.toArray) {
    return iterable.toArray()
  }
  if (_.isArray(iterable)) {
    return slice.call(iterable)
  }
  if (_.isArguments(iterable)) {
    return slice.call(iterable)
  }
  return _.values(iterable)
}

_.values = function(obj) {
  let results = []
  if (obj === null) {
    return results
  }
  _.each(obj, function(value) {
    results[results.length] = value
  })
  return results
}

_.identity = function(value) {
  return value
}

_.include = function(obj, target) {
  let found = false
  if (obj === null) {
    return found
  }
  if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
    return obj.indexOf(target) != -1
  }
  _.each(obj, function(value) {
    if (found || (found = value === target)) {
      return breaker
    }
  })
  return found
}

_.includes = function(str, needle) {
  return str.indexOf(needle) !== -1
}

// Underscore Addons
_.inherit = function(subclass, superclass) {
  subclass.prototype = new superclass()
  subclass.prototype.constructor = subclass
  subclass.superclass = superclass.prototype
  return subclass
}

_.isObject = function(obj) {
  return obj === Object(obj) && !_.isArray(obj)
}

_.isEmptyObject = function(obj) {
  if (_.isObject(obj)) {
    for (let key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        return false
      }
    }
    return true
  }
  return false
}

_.isUndefined = function(obj) {
  return obj === void 0
}

_.isString = function(obj) {
  return toString.call(obj) == "[object String]"
}

_.isDate = function(obj) {
  return toString.call(obj) == "[object Date]"
}

_.isNumber = function(obj) {
  return toString.call(obj) == "[object Number]"
}

_.isElement = function(obj) {
  return !!(obj && obj.nodeType === 1)
}

_.encodeDates = function(obj) {
  _.each(obj, function(v, k) {
    if (_.isDate(v)) {
      obj[k] = _.formatDate(v)
    } else if (_.isObject(v)) {
      obj[k] = _.encodeDates(v) // recurse
    }
  })
  return obj
}

_.timestamp = function() {
  Date.now =
    Date.now ||
    function() {
      return +new Date()
    }
  return Date.now()
}

_.formatDate = function(d) {
  // YYYY-MM-DDTHH:MM:SS in UTC
  function pad(n) {
    return n < 10 ? "0" + n : n
  }
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    ":" +
    pad(d.getUTCSeconds())
  )
}

_.safewrap = function(f) {
  return function() {
    try {
      return f.apply(this, arguments)
    } catch (e) {
      console$1.critical(
        "Implementation error. Please contact support@mixpanel.com.",
      )
    }
  }
}

_.safewrap_class = function(klass, functions) {
  for (let i = 0; i < functions.length; i++) {
    klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]])
  }
}

_.safewrap_instance_methods = function(obj) {
  for (let func in obj) {
    if (typeof obj[func] === "function") {
      obj[func] = _.safewrap(obj[func])
    }
  }
}

_.strip_empty_properties = function(p) {
  let ret = {}
  _.each(p, function(v, k) {
    if (_.isString(v) && v.length > 0) {
      ret[k] = v
    }
  })
  return ret
}

/*
 * this function returns a copy of object after truncating it.  If
 * passed an Array or Object it will iterate through obj and
 * truncate all the values recursively.
 */
_.truncate = function(obj, length) {
  let ret

  if (typeof obj === "string") {
    ret = obj.slice(0, length)
  } else if (_.isArray(obj)) {
    ret = []
    _.each(obj, function(val) {
      ret.push(_.truncate(val, length))
    })
  } else if (_.isObject(obj)) {
    ret = {}
    _.each(obj, function(val, key) {
      ret[key] = _.truncate(val, length)
    })
  } else {
    ret = obj
  }

  return ret
}

_.JSONEncode = (function() {
  return function(mixed_val) {
    let value = mixed_val
    let quote = function(string) {
      let escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g // eslint-disable-line no-control-regex
      let meta = {
        // table of character substitutions
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\",
      }

      escapable.lastIndex = 0
      return escapable.test(string)
        ? '"' +
            string.replace(escapable, function(a) {
              let c = meta[a]
              return typeof c === "string"
                ? c
                : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) +
            '"'
        : '"' + string + '"'
    }

    let str = function(key, holder) {
      let gap = ""
      let indent = "    "
      let i = 0 // The loop counter.
      let k = "" // The member key.
      let v = "" // The member value.
      let length = 0
      let mind = gap
      let partial = []
      let value = holder[key]

      // If the value has a toJSON method, call it to obtain a replacement value.
      if (
        value &&
        typeof value === "object" &&
        typeof value.toJSON === "function"
      ) {
        value = value.toJSON(key)
      }

      // What happens next depends on the value's type.
      switch (typeof value) {
        case "string":
          return quote(value)

        case "number":
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : "null"

        case "boolean":
        case "null":
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.

          return String(value)

        case "object":
          // If the type is 'object', we might be dealing with an object or an array or
          // null.
          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.
          if (!value) {
            return "null"
          }

          // Make an array to hold the partial results of stringifying this object value.
          gap += indent
          partial = []

          // Is the value an array?
          if (toString.apply(value) === "[object Array]") {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.

            length = value.length
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || "null"
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.
            v = partial.length === 0
              ? "[]"
              : gap
                ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]"
                : "[" + partial.join(",") + "]"
            gap = mind
            return v
          }

          // Iterate through all of the keys in the object.
          for (k in value) {
            if (hasOwnProperty.call(value, k)) {
              v = str(k, value)
              if (v) {
                partial.push(quote(k) + (gap ? ": " : ":") + v)
              }
            }
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.
          v = partial.length === 0
            ? "{}"
            : gap
              ? "{" + partial.join(",") + "" + mind + "}"
              : "{" + partial.join(",") + "}"
          gap = mind
          return v
      }
    }

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str("", {
      "": value,
    })
  }
})()

_.JSONDecode = (function() {
  // https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
  let at, // The index of the current character
    ch, // The current character
    escapee = {
      '"': '"',
      "\\": "\\",
      "/": "/",
      "b": "\b",
      "f": "\f",
      "n": "\n",
      "r": "\r",
      "t": "\t",
    },
    text,
    error = function(m) {
      throw {
        name: "SyntaxError",
        message: m,
        at,
        text,
      }
    },
    next = function(c) {
      // If a c parameter is provided, verify that it matches the current character.
      if (c && c !== ch) {
        error("Expected '" + c + "' instead of '" + ch + "'")
      }
      // Get the next character. When there are no more characters,
      // return the empty string.
      ch = text.charAt(at)
      at += 1
      return ch
    },
    number = function() {
      // Parse a number value.
      let number,
        string = ""

      if (ch === "-") {
        string = "-"
        next("-")
      }
      while (ch >= "0" && ch <= "9") {
        string += ch
        next()
      }
      if (ch === ".") {
        string += "."
        while (next() && ch >= "0" && ch <= "9") {
          string += ch
        }
      }
      if (ch === "e" || ch === "E") {
        string += ch
        next()
        if (ch === "-" || ch === "+") {
          string += ch
          next()
        }
        while (ch >= "0" && ch <= "9") {
          string += ch
          next()
        }
      }
      number = +string
      if (!isFinite(number)) {
        error("Bad number")
      } else {
        return number
      }
    },
    string = function() {
      // Parse a string value.
      let hex,
        i,
        string = "",
        uffff
      // When parsing for string values, we must look for " and \ characters.
      if (ch === '"') {
        while (next()) {
          if (ch === '"') {
            next()
            return string
          }
          if (ch === "\\") {
            next()
            if (ch === "u") {
              uffff = 0
              for (i = 0; i < 4; i += 1) {
                hex = parseInt(next(), 16)
                if (!isFinite(hex)) {
                  break
                }
                uffff = uffff * 16 + hex
              }
              string += String.fromCharCode(uffff)
            } else if (typeof escapee[ch] === "string") {
              string += escapee[ch]
            } else {
              break
            }
          } else {
            string += ch
          }
        }
      }
      error("Bad string")
    },
    white = function() {
      // Skip whitespace.
      while (ch && ch <= " ") {
        next()
      }
    },
    word = function() {
      // true, false, or null.
      switch (ch) {
        case "t":
          next("t")
          next("r")
          next("u")
          next("e")
          return true
        case "f":
          next("f")
          next("a")
          next("l")
          next("s")
          next("e")
          return false
        case "n":
          next("n")
          next("u")
          next("l")
          next("l")
          return null
      }
      error('Unexpected "' + ch + '"')
    },
    value, // Placeholder for the value function.
    array = function() {
      // Parse an array value.
      let array = []

      if (ch === "[") {
        next("[")
        white()
        if (ch === "]") {
          next("]")
          return array // empty array
        }
        while (ch) {
          array.push(value())
          white()
          if (ch === "]") {
            next("]")
            return array
          }
          next(",")
          white()
        }
      }
      error("Bad array")
    },
    object = function() {
      // Parse an object value.
      let key,
        object = {}

      if (ch === "{") {
        next("{")
        white()
        if (ch === "}") {
          next("}")
          return object // empty object
        }
        while (ch) {
          key = string()
          white()
          next(":")
          if (Object.hasOwnProperty.call(object, key)) {
            error('Duplicate key "' + key + '"')
          }
          object[key] = value()
          white()
          if (ch === "}") {
            next("}")
            return object
          }
          next(",")
          white()
        }
      }
      error("Bad object")
    }

  value = function() {
    // Parse a JSON value. It could be an object, an array, a string,
    // a number, or a word.
    white()
    switch (ch) {
      case "{":
        return object()
      case "[":
        return array()
      case '"':
        return string()
      case "-":
        return number()
      default:
        return ch >= "0" && ch <= "9" ? number() : word()
    }
  }

  // Return the json_parse function. It will have access to all of the
  // above functions and variables.
  return function(source) {
    let result

    text = source
    at = 0
    ch = " "
    result = value()
    white()
    if (ch) {
      error("Syntax error")
    }

    return result
  }
})()

_.base64Encode = function(data) {
  let b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  let o1,
    o2,
    o3,
    h1,
    h2,
    h3,
    h4,
    bits,
    i = 0,
    ac = 0,
    enc = "",
    tmp_arr = []

  if (!data) {
    return data
  }

  data = _.utf8Encode(data)

  do {
    // pack three octets into four hexets
    o1 = data.charCodeAt(i++)
    o2 = data.charCodeAt(i++)
    o3 = data.charCodeAt(i++)

    bits = (o1 << 16) | (o2 << 8) | o3

    h1 = (bits >> 18) & 0x3f
    h2 = (bits >> 12) & 0x3f
    h3 = (bits >> 6) & 0x3f
    h4 = bits & 0x3f

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] =
      b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4)
  } while (i < data.length)

  enc = tmp_arr.join("")

  switch (data.length % 3) {
    case 1:
      enc = enc.slice(0, -2) + "=="
      break
    case 2:
      enc = enc.slice(0, -1) + "="
      break
  }

  return enc
}

_.utf8Encode = function(string) {
  string = (string + "").replace(/\r\n/g, "\n").replace(/\r/g, "\n")

  let utftext = "",
    start,
    end
  let stringl = 0,
    n

  start = end = 0
  stringl = string.length

  for (n = 0; n < stringl; n++) {
    let c1 = string.charCodeAt(n)
    let enc = null

    if (c1 < 128) {
      end++
    } else if (c1 > 127 && c1 < 2048) {
      enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128)
    } else {
      enc = String.fromCharCode(
        (c1 >> 12) | 224,
        ((c1 >> 6) & 63) | 128,
        (c1 & 63) | 128,
      )
    }
    if (enc !== null) {
      if (end > start) {
        utftext += string.substring(start, end)
      }
      utftext += enc
      start = end = n + 1
    }
  }

  if (end > start) {
    utftext += string.substring(start, string.length)
  }

  return utftext
}

_.UUID = (function() {
  // Time/ticks information
  // 1*new Date() is a cross browser version of Date.now()
  let T = function() {
    let d = 1 * new Date(),
      i = 0

    // this while loop figures how many browser ticks go by
    // before 1*new Date() returns a new number, ie the amount
    // of ticks that go by per millisecond
    while (d == 1 * new Date()) {
      i++
    }

    return d.toString(16) + i.toString(16)
  }

  // Math.Random entropy
  let R = function() {
    return Math.random().toString(16).replace(".", "")
  }

  // User agent entropy
  // This function takes the user agent string, and then xors
  // together each sequence of 8 bytes.  This produces a final
  // sequence of 8 bytes which it returns as hex.
  let UA = function() {
    let ua = userAgent,
      i,
      ch,
      buffer = [],
      ret = 0

    function xor(result, byte_array) {
      let j,
        tmp = 0
      for (j = 0; j < byte_array.length; j++) {
        tmp |= buffer[j] << (j * 8)
      }
      return result ^ tmp
    }

    for (i = 0; i < ua.length; i++) {
      ch = ua.charCodeAt(i)
      buffer.unshift(ch & 0xff)
      if (buffer.length >= 4) {
        ret = xor(ret, buffer)
        buffer = []
      }
    }

    if (buffer.length > 0) {
      ret = xor(ret, buffer)
    }

    return ret.toString(16)
  }

  return function() {
    let se = (screen.height * screen.width).toString(16)
    return T() + "-" + R() + "-" + UA() + "-" + se + "-" + T()
  }
})()

// _.isBlockedUA()
// This is to block various web spiders from executing our JS and
// sending false tracking data
_.isBlockedUA = function(ua) {
  if (
    /(google web preview|baiduspider|yandexbot|bingbot|googlebot|yahoo! slurp)/i.test(
      ua,
    )
  ) {
    return true
  }
  return false
}

/**
 * @param {Object=} formdata
 * @param {string=} arg_separator
 */
_.HTTPBuildQuery = function(formdata, arg_separator) {
  let use_val,
    use_key,
    tmp_arr = []

  if (_.isUndefined(arg_separator)) {
    arg_separator = "&"
  }

  _.each(formdata, function(val, key) {
    use_val = encodeURIComponent(val.toString())
    use_key = encodeURIComponent(key)
    tmp_arr[tmp_arr.length] = use_key + "=" + use_val
  })

  return tmp_arr.join(arg_separator)
}

_.getQueryParam = function(url, param) {
  // Expects a raw URL

  param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
  let regexS = "[\\?&]" + param + "=([^&#]*)",
    regex = new RegExp(regexS),
    results = regex.exec(url)
  if (
    results === null ||
    (results && typeof results[1] !== "string" && results[1].length)
  ) {
    return ""
  } else {
    return decodeURIComponent(results[1]).replace(/\+/g, " ")
  }
}

_.getHashParam = function(hash, param) {
  let matches = hash.match(new RegExp(param + "=([^&]*)"))
  return matches ? matches[1] : null
}

// _.cookie
// Methods partially borrowed from quirksmode.org/js/cookies.html
_.cookie = {
  get(name) {
    let nameEQ = name + "="
    let ca = document$1.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length)
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  },

  parse(name) {
    let cookie
    try {
      cookie = _.JSONDecode(_.cookie.get(name)) || {}
    } catch (err) {
      // noop
    }
    return cookie
  },

  set_seconds(name, value, seconds, cross_subdomain, is_secure) {
    let cdomain = "",
      expires = "",
      secure = ""

    if (cross_subdomain) {
      let matches = document$1.location.hostname.match(
        /[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i,
      ),
        domain = matches ? matches[0] : ""

      cdomain = domain ? "; domain=." + domain : ""
    }

    if (seconds) {
      let date = new Date()
      date.setTime(date.getTime() + seconds * 1000)
      expires = "; expires=" + date.toGMTString()
    }

    if (is_secure) {
      secure = "; secure"
    }

    document$1.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      expires +
      "; path=/" +
      cdomain +
      secure
  },

  set(name, value, days, cross_subdomain, is_secure) {
    let cdomain = "",
      expires = "",
      secure = ""

    if (cross_subdomain) {
      let matches = document$1.location.hostname.match(
        /[a-z0-9][a-z0-9\-]+\.[a-z\.]{2,6}$/i,
      ),
        domain = matches ? matches[0] : ""

      cdomain = domain ? "; domain=." + domain : ""
    }

    if (days) {
      let date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = "; expires=" + date.toGMTString()
    }

    if (is_secure) {
      secure = "; secure"
    }

    let new_cookie_val =
      name +
      "=" +
      encodeURIComponent(value) +
      expires +
      "; path=/" +
      cdomain +
      secure
    document$1.cookie = new_cookie_val
    return new_cookie_val
  },

  remove(name, cross_subdomain) {
    _.cookie.set(name, "", -1, cross_subdomain)
  },
}

// _.localStorage
_.localStorage = {
  error(msg) {
    console$1.error("localStorage error: " + msg)
  },

  get(name) {
    try {
      return window.localStorage.getItem(name)
    } catch (err) {
      _.localStorage.error(err)
    }
    return null
  },

  parse(name) {
    try {
      return _.JSONDecode(_.localStorage.get(name)) || {}
    } catch (err) {
      // noop
    }
    return null
  },

  set(name, value) {
    try {
      window.localStorage.setItem(name, value)
    } catch (err) {
      _.localStorage.error(err)
    }
  },

  remove(name) {
    try {
      window.localStorage.removeItem(name)
    } catch (err) {
      _.localStorage.error(err)
    }
  },
}

_.register_event = (function() {
  // written by Dean Edwards, 2005
  // with input from Tino Zijdel - crisp@xs4all.nl
  // with input from Carl Sverre - mail@carlsverre.com
  // with input from Mixpanel
  // http://dean.edwards.name/weblog/2005/10/add-event/
  // https://gist.github.com/1930440

  /**
     * @param {Object} element
     * @param {string} type
     * @param {function(...[*])} handler
     * @param {boolean=} oldSchool
     * @param {boolean=} useCapture
     */
  let register_event = function(element, type, handler, oldSchool, useCapture) {
    if (!element) {
      console$1.error("No valid element provided to register_event")
      return
    }

    if (element.addEventListener && !oldSchool) {
      element.addEventListener(type, handler, !!useCapture)
    } else {
      let ontype = "on" + type
      let old_handler = element[ontype] // can be undefined
      element[ontype] = makeHandler(element, handler, old_handler)
    }
  }

  function makeHandler(element, new_handler, old_handlers) {
    let handler = function(event) {
      event = event || fixEvent(window.event)

      // this basically happens in firefox whenever another script
      // overwrites the onload callback and doesn't pass the event
      // object to previously defined callbacks.  All the browsers
      // that don't define window.event implement addEventListener
      // so the dom_loaded handler will still be fired as usual.
      if (!event) {
        return undefined
      }

      let ret = true
      let old_result, new_result

      if (_.isFunction(old_handlers)) {
        old_result = old_handlers(event)
      }
      new_result = new_handler.call(element, event)

      if (old_result === false || new_result === false) {
        ret = false
      }

      return ret
    }

    return handler
  }

  function fixEvent(event) {
    if (event) {
      event.preventDefault = fixEvent.preventDefault
      event.stopPropagation = fixEvent.stopPropagation
    }
    return event
  }
  fixEvent.preventDefault = function() {
    this.returnValue = false
  }
  fixEvent.stopPropagation = function() {
    this.cancelBubble = true
  }

  return register_event
})()

_.dom_query = (function() {
  /* document.getElementsBySelector(selector)
    - returns an array of element objects from the current document
    matching the CSS selector. Selectors can contain element names,
    class names and ids and can be nested. For example:

    elements = document.getElementsBySelector('div#main p a.external')

    Will return an array of all 'a' elements with 'external' in their
    class attribute that are contained inside 'p' elements that are
    contained inside the 'div' element which has id="main"

    New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
    See http://www.w3.org/TR/css3-selectors/#attribute-selectors

    Version 0.4 - Simon Willison, March 25th 2003
    -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
    -- Opera 7 fails

    Version 0.5 - Carl Sverre, Jan 7th 2013
    -- Now uses jQuery-esque `hasClass` for testing class name
    equality.  This fixes a bug related to '-' characters being
    considered not part of a 'word' in regex.
    */

  function getAllChildren(e) {
    // Returns all children of element. Workaround required for IE5/Windows. Ugh.
    return e.all ? e.all : e.getElementsByTagName("*")
  }

  let bad_whitespace = /[\t\r\n]/g

  function hasClass(elem, selector) {
    let className = " " + selector + " "
    return (
      (" " + elem.className + " ")
        .replace(bad_whitespace, " ")
        .indexOf(className) >= 0
    )
  }

  function getElementsBySelector(selector) {
    // Attempt to fail gracefully in lesser browsers
    if (!document$1.getElementsByTagName) {
      return []
    }
    // Split selector in to tokens
    let tokens = selector.split(" ")
    let token,
      bits,
      tagName,
      found,
      foundCount,
      i,
      j,
      k,
      elements,
      currentContextIndex
    let currentContext = [document$1]
    for (i = 0; i < tokens.length; i++) {
      token = tokens[i].replace(/^\s+/, "").replace(/\s+$/, "")
      if (token.indexOf("#") > -1) {
        // Token is an ID selector
        bits = token.split("#")
        tagName = bits[0]
        let id = bits[1]
        let element = document$1.getElementById(id)
        if (
          !element ||
          (tagName && element.nodeName.toLowerCase() != tagName)
        ) {
          // element not found or tag with that ID not found, return false
          return []
        }
        // Set currentContext to contain just this element
        currentContext = [element]
        continue // Skip to next token
      }
      if (token.indexOf(".") > -1) {
        // Token contains a class selector
        bits = token.split(".")
        tagName = bits[0]
        let className = bits[1]
        if (!tagName) {
          tagName = "*"
        }
        // Get elements matching tag, filter them for class selector
        found = []
        foundCount = 0
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == "*") {
            elements = getAllChildren(currentContext[j])
          } else {
            elements = currentContext[j].getElementsByTagName(tagName)
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k]
          }
        }
        currentContext = []
        currentContextIndex = 0
        for (j = 0; j < found.length; j++) {
          if (
            found[j].className &&
            _.isString(found[j].className) && // some SVG elements have classNames which are not strings
            hasClass(found[j], className)
          ) {
            currentContext[currentContextIndex++] = found[j]
          }
        }
        continue // Skip to next token
      }
      // Code to deal with attribute selectors
      let token_match = token.match(
        /^(\w*)\[(\w+)([=~\|\^\$\*]?)=?"?([^\]"]*)"?\]$/,
      )
      if (token_match) {
        tagName = token_match[1]
        let attrName = token_match[2]
        let attrOperator = token_match[3]
        let attrValue = token_match[4]
        if (!tagName) {
          tagName = "*"
        }
        // Grab all of the tagName elements within current context
        found = []
        foundCount = 0
        for (j = 0; j < currentContext.length; j++) {
          if (tagName == "*") {
            elements = getAllChildren(currentContext[j])
          } else {
            elements = currentContext[j].getElementsByTagName(tagName)
          }
          for (k = 0; k < elements.length; k++) {
            found[foundCount++] = elements[k]
          }
        }
        currentContext = []
        currentContextIndex = 0
        let checkFunction // This function will be used to filter the elements
        switch (attrOperator) {
          case "=": // Equality
            checkFunction = function(e) {
              return e.getAttribute(attrName) == attrValue
            }
            break
          case "~": // Match one of space seperated words
            checkFunction = function(e) {
              return e
                .getAttribute(attrName)
                .match(new RegExp("\\b" + attrValue + "\\b"))
            }
            break
          case "|": // Match start with value followed by optional hyphen
            checkFunction = function(e) {
              return e
                .getAttribute(attrName)
                .match(new RegExp("^" + attrValue + "-?"))
            }
            break
          case "^": // Match starts with value
            checkFunction = function(e) {
              return e.getAttribute(attrName).indexOf(attrValue) === 0
            }
            break
          case "$": // Match ends with value - fails with "Warning" in Opera 7
            checkFunction = function(e) {
              return (
                e.getAttribute(attrName).lastIndexOf(attrValue) ==
                e.getAttribute(attrName).length - attrValue.length
              )
            }
            break
          case "*": // Match ends with value
            checkFunction = function(e) {
              return e.getAttribute(attrName).indexOf(attrValue) > -1
            }
            break
          default:
            // Just test for existence of attribute
            checkFunction = function(e) {
              return e.getAttribute(attrName)
            }
        }
        currentContext = []
        currentContextIndex = 0
        for (j = 0; j < found.length; j++) {
          if (checkFunction(found[j])) {
            currentContext[currentContextIndex++] = found[j]
          }
        }
        // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
        continue // Skip to next token
      }
      // If we get here, token is JUST an element (not a class or ID selector)
      tagName = token
      found = []
      foundCount = 0
      for (j = 0; j < currentContext.length; j++) {
        elements = currentContext[j].getElementsByTagName(tagName)
        for (k = 0; k < elements.length; k++) {
          found[foundCount++] = elements[k]
        }
      }
      currentContext = found
    }
    return currentContext
  }

  return function(query) {
    if (_.isElement(query)) {
      return [query]
    } else if (_.isObject(query) && !_.isUndefined(query.length)) {
      return query
    } else {
      return getElementsBySelector.call(this, query)
    }
  }
})()

_.info = {
  campaignParams() {
    let campaign_keywords = "utm_source utm_medium utm_campaign utm_content utm_term".split(
      " ",
    ),
      kw = "",
      params = {}
    _.each(campaign_keywords, function(kwkey) {
      kw = _.getQueryParam(document$1.URL, kwkey)
      if (kw.length) {
        params[kwkey] = kw
      }
    })

    return params
  },

  searchEngine(referrer) {
    if (referrer.search("https?://(.*)google.([^/?]*)") === 0) {
      return "google"
    } else if (referrer.search("https?://(.*)bing.com") === 0) {
      return "bing"
    } else if (referrer.search("https?://(.*)yahoo.com") === 0) {
      return "yahoo"
    } else if (referrer.search("https?://(.*)duckduckgo.com") === 0) {
      return "duckduckgo"
    } else {
      return null
    }
  },

  searchInfo(referrer) {
    let search = _.info.searchEngine(referrer),
      param = search != "yahoo" ? "q" : "p",
      ret = {}

    if (search !== null) {
      ret.$search_engine = search

      let keyword = _.getQueryParam(referrer, param)
      if (keyword.length) {
        ret.mp_keyword = keyword
      }
    }

    return ret
  },

  /**
     * This function detects which browser is running this script.
     * The order of the checks are important since many user agents
     * include key words used in later checks.
     */
  browser(user_agent, vendor, opera) {
    vendor = vendor || "" // vendor is undefined for at least IE9
    if (opera || _.includes(user_agent, " OPR/")) {
      if (_.includes(user_agent, "Mini")) {
        return "Opera Mini"
      }
      return "Opera"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
      return "BlackBerry"
    } else if (
      _.includes(user_agent, "IEMobile") ||
      _.includes(user_agent, "WPDesktop")
    ) {
      return "Internet Explorer Mobile"
    } else if (_.includes(user_agent, "Edge")) {
      return "Microsoft Edge"
    } else if (_.includes(user_agent, "FBIOS")) {
      return "Facebook Mobile"
    } else if (_.includes(user_agent, "Chrome")) {
      return "Chrome"
    } else if (_.includes(user_agent, "CriOS")) {
      return "Chrome iOS"
    } else if (
      _.includes(user_agent, "UCWEB") ||
      _.includes(user_agent, "UCBrowser")
    ) {
      return "UC Browser"
    } else if (_.includes(user_agent, "FxiOS")) {
      return "Firefox iOS"
    } else if (_.includes(vendor, "Apple")) {
      if (_.includes(user_agent, "Mobile")) {
        return "Mobile Safari"
      }
      return "Safari"
    } else if (_.includes(user_agent, "Android")) {
      return "Android Mobile"
    } else if (_.includes(user_agent, "Konqueror")) {
      return "Konqueror"
    } else if (_.includes(user_agent, "Firefox")) {
      return "Firefox"
    } else if (
      _.includes(user_agent, "MSIE") ||
      _.includes(user_agent, "Trident/")
    ) {
      return "Internet Explorer"
    } else if (_.includes(user_agent, "Gecko")) {
      return "Mozilla"
    } else {
      return ""
    }
  },

  /**
     * This function detects which browser version is running this script,
     * parsing major and minor version (e.g., 42.1). User agent strings from:
     * http://www.useragentstring.com/pages/useragentstring.php
     */
  browserVersion(userAgent, vendor, opera) {
    let browser = _.info.browser(userAgent, vendor, opera)
    let versionRegexs = {
      "Internet Explorer Mobile": /rv:(\d+(\.\d+)?)/,
      "Microsoft Edge": /Edge\/(\d+(\.\d+)?)/,
      "Chrome": /Chrome\/(\d+(\.\d+)?)/,
      "Chrome iOS": /CriOS\/(\d+(\.\d+)?)/,
      "UC Browser": /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
      "Safari": /Version\/(\d+(\.\d+)?)/,
      "Mobile Safari": /Version\/(\d+(\.\d+)?)/,
      "Opera": /(Opera|OPR)\/(\d+(\.\d+)?)/,
      "Firefox": /Firefox\/(\d+(\.\d+)?)/,
      "Firefox iOS": /FxiOS\/(\d+(\.\d+)?)/,
      "Konqueror": /Konqueror:(\d+(\.\d+)?)/,
      "BlackBerry": /BlackBerry (\d+(\.\d+)?)/,
      "Android Mobile": /android\s(\d+(\.\d+)?)/,
      "Internet Explorer": /(rv:|MSIE )(\d+(\.\d+)?)/,
      "Mozilla": /rv:(\d+(\.\d+)?)/,
    }
    let regex = versionRegexs[browser]
    if (regex === undefined) {
      return null
    }
    let matches = userAgent.match(regex)
    if (!matches) {
      return null
    }
    return parseFloat(matches[matches.length - 2])
  },

  os() {
    let a = userAgent
    if (/Windows/i.test(a)) {
      if (/Phone/.test(a) || /WPDesktop/.test(a)) {
        return "Windows Phone"
      }
      return "Windows"
    } else if (/(iPhone|iPad|iPod)/.test(a)) {
      return "iOS"
    } else if (/Android/.test(a)) {
      return "Android"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
      return "BlackBerry"
    } else if (/Mac/i.test(a)) {
      return "Mac OS X"
    } else if (/Linux/.test(a)) {
      return "Linux"
    } else {
      return ""
    }
  },

  device(user_agent) {
    if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
      return "Windows Phone"
    } else if (/iPad/.test(user_agent)) {
      return "iPad"
    } else if (/iPod/.test(user_agent)) {
      return "iPod Touch"
    } else if (/iPhone/.test(user_agent)) {
      return "iPhone"
    } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
      return "BlackBerry"
    } else if (/Android/.test(user_agent)) {
      return "Android"
    } else {
      return ""
    }
  },

  referringDomain(referrer) {
    let split = referrer.split("/")
    if (split.length >= 3) {
      return split[2]
    }
    return ""
  },

  properties() {
    return _.extend(
      _.strip_empty_properties({
        $os: _.info.os(),
        $browser: _.info.browser(userAgent, navigator$1.vendor, window.opera),
        $referrer: document$1.referrer,
        $referring_domain: _.info.referringDomain(document$1.referrer),
        $device: _.info.device(userAgent),
      }),
      {
        $current_url: window.location.href,
        $browser_version: _.info.browserVersion(
          userAgent,
          navigator$1.vendor,
          window.opera,
        ),
        $screen_height: screen.height,
        $screen_width: screen.width,
        mp_lib: "web",
        $lib_version: Config.LIB_VERSION,
      },
    )
  },

  people_properties() {
    return _.extend(
      _.strip_empty_properties({
        $os: _.info.os(),
        $browser: _.info.browser(userAgent, navigator$1.vendor, window.opera),
      }),
      {
        $browser_version: _.info.browserVersion(
          userAgent,
          navigator$1.vendor,
          window.opera,
        ),
      },
    )
  },

  pageviewInfo(page) {
    return _.strip_empty_properties({
      mp_page: page,
      mp_referrer: document$1.referrer,
      mp_browser: _.info.browser(userAgent, navigator$1.vendor, window.opera),
      mp_platform: _.info.os(),
    })
  },
}

// EXPORTS (for closure compiler)
_.toArray = _.toArray
_.isObject = _.isObject
_.JSONEncode = _.JSONEncode
_.JSONDecode = _.JSONDecode
_.isBlockedUA = _.isBlockedUA
_.isEmptyObject = _.isEmptyObject
_.info = _.info
_.info.device = _.info.device
_.info.browser = _.info.browser
_.info.properties = _.info.properties

// specifying these locally here since some websites override the global Node var
// ex: https://www.codingame.com/
let ELEMENT_NODE = 1
let TEXT_NODE = 3

let autotrack = {
  _initializedTokens: [],

  _previousElementSibling(el) {
    if (el.previousElementSibling) {
      return el.previousElementSibling
    } else {
      do {
        el = el.previousSibling
      } while (el && el.nodeType !== ELEMENT_NODE)
      return el
    }
  },

  _loadScript(scriptUrlToLoad, callback) {
    let scriptTag = document.createElement("script")
    scriptTag.type = "text/javascript"
    scriptTag.src = scriptUrlToLoad
    scriptTag.onload = callback

    let scripts = document.getElementsByTagName("script")
    if (scripts.length > 0) {
      scripts[0].parentNode.insertBefore(scriptTag, scripts[0])
    } else {
      document.body.appendChild(scriptTag)
    }
  },

  _getClassName(elem) {
    switch (typeof elem.className) {
      case "string":
        return elem.className
      case "object": // handle cases where className might be SVGAnimatedString or some other type
        return elem.className.baseVal || elem.getAttribute("class") || ""
      default:
        // future proof
        return ""
    }
  },

  _getPropertiesFromElement(elem) {
    let props = {
      classes: this._getClassName(elem).split(" "),
      tag_name: elem.tagName.toLowerCase(),
    }

    if (
      _.includes(["input", "select", "textarea"], elem.tagName.toLowerCase())
    ) {
      let formFieldValue = this._getFormFieldValue(elem)
      if (this._includeProperty(elem, formFieldValue)) {
        props.value = formFieldValue
      }
    }

    _.each(elem.attributes, function(attr) {
      props["attr__" + attr.name] = attr.value
    })

    let nthChild = 1
    let nthOfType = 1
    let currentElem = elem
    while ((currentElem = this._previousElementSibling(currentElem))) {
      // eslint-disable-line no-cond-assign
      nthChild++
      if (currentElem.tagName === elem.tagName) {
        nthOfType++
      }
    }
    props.nth_child = nthChild
    props.nth_of_type = nthOfType

    return props
  },

  /*
     * Due to potential reference discrepancies (such as the webcomponents.js polyfill)
     * We want to match tagNames instead of specific reference because something like element === document.body
     * won't always work because element might not be a native element.
     */
  _isTag(el, tag) {
    return el && el.tagName && el.tagName.toLowerCase() === tag.toLowerCase()
  },

  _shouldTrackDomEvent(element, event) {
    if (
      !element ||
      this._isTag(element, "html") ||
      element.nodeType !== ELEMENT_NODE
    ) {
      return false
    }
    let tag = element.tagName.toLowerCase()
    switch (tag) {
      case "html":
        return false
      case "form":
        return event.type === "submit"
      case "input":
        if (["button", "submit"].indexOf(element.getAttribute("type")) === -1) {
          return event.type === "change"
        } else {
          return event.type === "click"
        }
      case "select":
      case "textarea":
        return event.type === "change"
      default:
        return event.type === "click"
    }
  },

  _getDefaultProperties(eventType) {
    return {
      $event_type: eventType,
      $ce_version: 1,
      $host: window.location.host,
      $pathname: window.location.pathname,
    }
  },

  _getInputValue(input) {
    let value = null
    let type = input.type.toLowerCase()
    switch (type) {
      case "checkbox":
        if (input.checked) {
          value = [input.value]
        }
        break
      case "radio":
        if (input.checked) {
          value = input.value
        }
        break
      default:
        value = input.value
        break
    }
    return value
  },

  _getSelectValue(select) {
    let value
    if (select.multiple) {
      let values = []
      _.each(select.querySelectorAll("[selected]"), function(option) {
        values.push(option.value)
      })
      value = values
    } else {
      value = select.value
    }
    return value
  },

  _includeProperty(input, value) {
    for (
      let curEl = input;
      curEl.parentNode && !this._isTag(curEl, "body");
      curEl = curEl.parentNode
    ) {
      let classes = this._getClassName(curEl).split(" ")
      if (
        _.includes(classes, "mp-sensitive") ||
        _.includes(classes, "mp-no-track")
      ) {
        return false
      }
    }

    if (_.includes(this._getClassName(input).split(" "), "mp-include")) {
      return true
    }

    if (value === null) {
      return false
    }

    // don't include hidden or password fields
    let type = input.type || ""
    switch (type.toLowerCase()) {
      case "hidden":
        return false
      case "password":
        return false
    }

    // filter out data from fields that look like sensitive fields
    let name = input.name || input.id || ""
    let sensitiveNameRegex = /^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|seccode|securitycode|securitynum|socialsec|socsec|ssn/i
    if (sensitiveNameRegex.test(name.replace(/[^a-zA-Z0-9]/g, ""))) {
      return false
    }

    if (typeof value === "string") {
      // check to see if input value looks like a credit card number
      // see: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s20.html
      let ccRegex = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/
      if (ccRegex.test((value || "").replace(/[\- ]/g, ""))) {
        return false
      }

      // check to see if input value looks like a social security number
      let ssnRegex = /(^\d{3}-?\d{2}-?\d{4}$)/
      if (ssnRegex.test(value)) {
        return false
      }
    }

    return true
  },

  _getFormFieldValue(field) {
    let val
    switch (field.tagName.toLowerCase()) {
      case "input":
        val = this._getInputValue(field)
        break
      case "select":
        val = this._getSelectValue(field)
        break
      default:
        val = field.value || field.textContent
        break
    }
    return this._includeProperty(field, val) ? val : null
  },

  _getFormFieldProperties(form) {
    let formFieldProps = {}
    _.each(
      form.elements,
      function(field) {
        let name = field.getAttribute("name") || field.getAttribute("id")
        if (name !== null) {
          name = "$form_field__" + name
          let val = this._getFormFieldValue(field)
          if (this._includeProperty(field, val)) {
            let prevFieldVal = formFieldProps[name]
            if (prevFieldVal !== undefined) {
              // combine values for inputs of same name
              formFieldProps[name] = [].concat(prevFieldVal, val)
            } else {
              formFieldProps[name] = val
            }
          }
        }
      },
      this,
    )
    return formFieldProps
  },

  _extractCustomPropertyValue(customProperty) {
    let propValues = []
    _.each(document.querySelectorAll(customProperty.css_selector), function(
      matchedElem,
    ) {
      if (["input", "select"].indexOf(matchedElem.tagName.toLowerCase()) > -1) {
        propValues.push(matchedElem.value)
      } else if (matchedElem.textContent) {
        propValues.push(matchedElem.textContent)
      }
    })
    return propValues.join(", ")
  },

  _getCustomProperties(targetElementList) {
    let props = {}
    _.each(
      this._customProperties,
      function(customProperty) {
        _.each(
          customProperty.event_selectors,
          function(eventSelector) {
            let eventElements = document.querySelectorAll(eventSelector)
            _.each(
              eventElements,
              function(eventElement) {
                if (_.includes(targetElementList, eventElement)) {
                  props[
                    customProperty.name
                  ] = this._extractCustomPropertyValue(customProperty)
                }
              },
              this,
            )
          },
          this,
        )
      },
      this,
    )
    return props
  },

  _getEventTarget(e) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/target#Compatibility_notes
    if (typeof e.target === "undefined") {
      return e.srcElement
    } else {
      return e.target
    }
  },

  _trackEvent(e, instance) {
    /** * Don't mess with this code without running IE8 tests on it ***/
    let target = this._getEventTarget(e)
    if (target.nodeType === TEXT_NODE) {
      // defeat Safari bug (see: http://www.quirksmode.org/js/events_properties.html)
      target = target.parentNode
    }

    if (this._shouldTrackDomEvent(target, e)) {
      let targetElementList = [target]
      let curEl = target
      while (curEl.parentNode && !this._isTag(curEl, "body")) {
        targetElementList.push(curEl.parentNode)
        curEl = curEl.parentNode
      }

      let elementsJson = []
      let href,
        elementText,
        form,
        explicitNoTrack = false
      _.each(
        targetElementList,
        function(el, idx) {
          // if the element or a parent element is an anchor tag
          // include the href as a property
          if (el.tagName.toLowerCase() === "a") {
            href = el.getAttribute("href")
          } else if (el.tagName.toLowerCase() === "form") {
            form = el
          }
          // crawl up to max of 5 nodes to populate text content
          if (!elementText && idx < 5 && el.textContent) {
            let textContent = _.trim(el.textContent)
            if (textContent) {
              elementText = textContent
                .replace(/[\r\n]/g, " ")
                .replace(/[ ]+/g, " ")
                .substring(0, 255)
            }
          }

          // allow users to programatically prevent tracking of elements by adding class 'mp-no-track'
          let classes = this._getClassName(el).split(" ")
          if (_.includes(classes, "mp-no-track")) {
            explicitNoTrack = true
          }

          elementsJson.push(this._getPropertiesFromElement(el))
        },
        this,
      )

      if (explicitNoTrack) {
        return false
      }

      let props = _.extend(
        this._getDefaultProperties(e.type),
        {
          $elements: elementsJson,
          $el_attr__href: href,
          $el_text: elementText,
        },
        this._getCustomProperties(targetElementList),
      )

      if (form && (e.type === "submit" || e.type === "click")) {
        _.extend(props, this._getFormFieldProperties(form))
      }
      instance.track("$web_event", props)
      return true
    }
  },

  // only reason is to stub for unit tests
  // since you can't override window.location props
  _navigate(href) {
    window.location.href = href
  },

  _addDomEventHandlers(instance) {
    let handler = _.bind(function(e) {
      e = e || window.event
      this._trackEvent(e, instance)
    }, this)
    _.register_event(document, "submit", handler, false, true)
    _.register_event(document, "change", handler, false, true)
    _.register_event(document, "click", handler, false, true)
  },

  _customProperties: {},
  init(instance) {
    if (!(document && document.body)) {
      console.log("document not ready yet, trying again in 500 milliseconds...")
      let that = this
      setTimeout(function() {
        that.init(instance)
      }, 500)
      return
    }

    let token = instance.get_config("token")
    if (this._initializedTokens.indexOf(token) > -1) {
      console.log('autotrack already initialized for token "' + token + '"')
      return
    }
    this._initializedTokens.push(token)

    if (!this._maybeLoadEditor(instance)) {
      // don't autotrack actions when the editor is enabled
      let parseDecideResponse = _.bind(function(response) {
        if (
          response &&
          response.config &&
          response.config.enable_collect_everything === true
        ) {
          if (response.custom_properties) {
            this._customProperties = response.custom_properties
          }

          instance.track(
            "$web_event",
            _.extend(
              {
                $title: document.title,
              },
              this._getDefaultProperties("pageview"),
            ),
          )

          this._addDomEventHandlers(instance)
        } else {
          instance.__autotrack_enabled = false
        }
      }, this)

      instance._send_request(
        instance.get_config("decide_host") + "/decide/",
        {
          verbose: true,
          version: "1",
          lib: "web",
          token,
        },
        instance._prepare_callback(parseDecideResponse),
      )
    }
  },

  _editorParamsFromHash(instance, hash) {
    let editorParams
    try {
      let state = _.getHashParam(hash, "state")
      state = JSON.parse(decodeURIComponent(state))
      let expiresInSeconds = _.getHashParam(hash, "expires_in")
      editorParams = {
        accessToken: _.getHashParam(hash, "access_token"),
        accessTokenExpiresAt:
          new Date().getTime() + Number(expiresInSeconds) * 1000,
        bookmarkletMode: !!state.bookmarkletMode,
        projectId: state.projectId,
        projectOwnerId: state.projectOwnerId,
        projectToken: state.token,
        readOnly: state.readOnly,
        userFlags: state.userFlags,
        userId: state.userId,
      }
      window.sessionStorage.setItem(
        "editorParams",
        JSON.stringify(editorParams),
      )

      if (state.desiredHash) {
        window.location.hash = state.desiredHash
      } else if (window.history) {
        history.replaceState(
          "",
          document.title,
          window.location.pathname + window.location.search,
        ) // completely remove hash
      } else {
        window.location.hash = "" // clear hash (but leaves # unfortunately)
      }
    } catch (e) {
      console.error("Unable to parse data from hash", e)
    }
    return editorParams
  },

  /**
     * To load the visual editor, we need an access token and other state. That state comes from one of three places:
     * 1. In the URL hash params if the customer is using an old snippet
     * 2. From session storage under the key `_mpcehash` if the snippet already parsed the hash
     * 3. From session storage under the key `editorParams` if the editor was initialized on a previous page
     */
  _maybeLoadEditor(instance) {
    try {
      let parseFromUrl = false
      if (_.getHashParam(window.location.hash, "state")) {
        let state = _.getHashParam(window.location.hash, "state")
        state = JSON.parse(decodeURIComponent(state))
        parseFromUrl = state.action === "mpeditor"
      }
      let parseFromStorage = !!window.sessionStorage.getItem("_mpcehash")
      let editorParams

      if (parseFromUrl) {
        // happens if they are initializing the editor using an old snippet
        editorParams = this._editorParamsFromHash(
          instance,
          window.location.hash,
        )
      } else if (parseFromStorage) {
        // happens if they are initialized the editor and using the new snippet
        editorParams = this._editorParamsFromHash(
          instance,
          window.sessionStorage.getItem("_mpcehash"),
        )
        window.sessionStorage.removeItem("_mpcehash")
      } else {
        // get credentials from sessionStorage from a previous initialzation
        editorParams = JSON.parse(
          window.sessionStorage.getItem("editorParams") || "{}",
        )
      }

      if (
        editorParams.projectToken &&
        instance.get_config("token") === editorParams.projectToken
      ) {
        this._loadEditor(instance, editorParams)
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  },

  _loadEditor(instance, editorParams) {
    if (!window._mpEditorLoaded) {
      // only load the codeless event editor once, even if there are multiple instances of MixpanelLib
      window._mpEditorLoaded = true
      let editorUrl
      let cacheBuster = "?_ts=" + new Date().getTime()
      let siteMedia = instance.get_config("app_host") + "/site_media"
      if (Config.DEBUG) {
        editorUrl =
          siteMedia +
          "/compiled/reports/collect-everything/editor.js" +
          cacheBuster
      } else {
        editorUrl =
          siteMedia +
          "/bundle-webpack/reports/collect-everything/editor.min.js" +
          cacheBuster
      }
      this._loadScript(editorUrl, function() {
        window.mp_load_editor(editorParams)
      })
      return true
    }
    return false
  },

  // this is a mechanism to ramp up CE with no server-side interaction.
  // when CE is active, every page load results in a decide request. we
  // need to gently ramp this up so we don't overload decide. this decides
  // deterministically if CE is enabled for this project by modding the char
  // value of the project token.
  enabledForProject(token, numBuckets, numEnabledBuckets) {
    numBuckets = !_.isUndefined(numBuckets) ? numBuckets : 10
    numEnabledBuckets = !_.isUndefined(numEnabledBuckets)
      ? numEnabledBuckets
      : 10
    let charCodeSum = 0
    for (let i = 0; i < token.length; i++) {
      charCodeSum += token.charCodeAt(i)
    }
    return charCodeSum % numBuckets < numEnabledBuckets
  },

  isBrowserSupported() {
    return _.isFunction(document.querySelectorAll)
  },
}

_.bind_instance_methods(autotrack)
_.safewrap_instance_methods(autotrack)

/*
 * Mixpanel JS Library
 *
 * Copyright 2012, Mixpanel, Inc. All Rights Reserved
 * http://mixpanel.com/
 *
 * Includes portions of Underscore.js
 * http://documentcloud.github.com/underscore/
 * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT License.
 */

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @output_file_name mixpanel-2.8.min.js
// ==/ClosureCompiler==

/*
SIMPLE STYLE GUIDE:

this.x === public function
this._x === internal - only use within this file
this.__x === private - only use within the class

Globals should be all caps
*/

let init_type // MODULE or SNIPPET loader
let mixpanel_master // main mixpanel instance / object
let INIT_MODULE = 0
let INIT_SNIPPET = 1

/*
 * Constants
 */
/** @const */ let PRIMARY_INSTANCE_NAME = "mixpanel"
/** @const */ let SET_QUEUE_KEY = "__mps"
/** @const */ let SET_ONCE_QUEUE_KEY = "__mpso"
/** @const */ let ADD_QUEUE_KEY = "__mpa"
/** @const */ let APPEND_QUEUE_KEY = "__mpap"
/** @const */ let UNION_QUEUE_KEY = "__mpu"
/** @const */ let SET_ACTION = "$set"
/** @const */ let SET_ONCE_ACTION = "$set_once"
/** @const */ let ADD_ACTION = "$add"
/** @const */ let APPEND_ACTION = "$append"
/** @const */ let UNION_ACTION = "$union"
// This key is deprecated, but we want to check for it to see whether aliasing is allowed.
/** @const */ let PEOPLE_DISTINCT_ID_KEY = "$people_distinct_id"
/** @const */ let ALIAS_ID_KEY = "__alias"
/** @const */ let CAMPAIGN_IDS_KEY = "__cmpns"
/** @const */ let EVENT_TIMERS_KEY = "__timers"
/** @const */ let RESERVED_PROPERTIES = [
  SET_QUEUE_KEY,
  SET_ONCE_QUEUE_KEY,
  ADD_QUEUE_KEY,
  APPEND_QUEUE_KEY,
  UNION_QUEUE_KEY,
  PEOPLE_DISTINCT_ID_KEY,
  ALIAS_ID_KEY,
  CAMPAIGN_IDS_KEY,
  EVENT_TIMERS_KEY,
]

/*
 * Dynamic... constants? Is that an oxymoron?
 */
let HTTP_PROTOCOL = document.location.protocol === "https:"
  ? "https://"
  : "http://"

// http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
// https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#withCredentials
let USE_XHR = window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest()

// IE<10 does not support cross-origin XHR's but script tags
// with defer won't block window.onload; ENQUEUE_REQUESTS
// should only be true for Opera<12
let ENQUEUE_REQUESTS =
  !USE_XHR &&
  userAgent.indexOf("MSIE") === -1 &&
  userAgent.indexOf("Mozilla") === -1

/*
 * Module-level globals
 */
let DEFAULT_CONFIG = {
  api_host: HTTP_PROTOCOL + "api.mixpanel.com",
  app_host: HTTP_PROTOCOL + "mixpanel.com",
  autotrack: true,
  cdn: HTTP_PROTOCOL + "cdn.mxpnl.com",
  cross_subdomain_cookie: true,
  persistence: "cookie",
  persistence_name: "",
  cookie_name: "",
  loaded() {},
  store_google: true,
  save_referrer: true,
  test: false,
  verbose: false,
  img: false,
  track_pageview: true,
  debug: false,
  track_links_timeout: 300,
  cookie_expiration: 365,
  upgrade: false,
  disable_persistence: false,
  disable_cookie: false,
  secure_cookie: false,
  ip: true,
  property_blacklist: [],
}
DEFAULT_CONFIG.decide_host = DEFAULT_CONFIG.api_host

let DOM_LOADED = false

/**
 * DomTracker Object
 * @constructor
 */
let DomTracker = function() {}

// interface
DomTracker.prototype.create_properties = function() {}
DomTracker.prototype.event_handler = function() {}
DomTracker.prototype.after_track_handler = function() {}

DomTracker.prototype.init = function(mixpanel_instance) {
  this.mp = mixpanel_instance
  return this
}

/**
 * @param {Object|string} query
 * @param {string} event_name
 * @param {Object=} properties
 * @param {function(...[*])=} user_callback
 */
DomTracker.prototype.track = function(
  query,
  event_name,
  properties,
  user_callback,
) {
  let that = this
  let elements = _.dom_query(query)

  if (elements.length === 0) {
    console$1.error("The DOM query (" + query + ") returned 0 elements")
    return
  }

  _.each(
    elements,
    function(element) {
      _.register_event(element, this.override_event, function(e) {
        let options = {}
        let props = that.create_properties(properties, this)
        let timeout = that.mp.get_config("track_links_timeout")

        that.event_handler(e, this, options)

        // in case the mixpanel servers don't get back to us in time
        window.setTimeout(
          that.track_callback(user_callback, props, options, true),
          timeout,
        )

        // fire the tracking event
        that.mp.track(
          event_name,
          props,
          that.track_callback(user_callback, props, options),
        )
      })
    },
    this,
  )

  return true
}

/**
 * @param {function(...[*])} user_callback
 * @param {Object} props
 * @param {boolean=} timeout_occured
 */
DomTracker.prototype.track_callback = function(
  user_callback,
  props,
  options,
  timeout_occured,
) {
  timeout_occured = timeout_occured || false
  let that = this

  return function() {
    // options is referenced from both callbacks, so we can have
    // a 'lock' of sorts to ensure only one fires
    if (options.callback_fired) {
      return
    }
    options.callback_fired = true

    if (user_callback && user_callback(timeout_occured, props) === false) {
      // user can prevent the default functionality by
      // returning false from their callback
      return
    }

    that.after_track_handler(props, options, timeout_occured)
  }
}

DomTracker.prototype.create_properties = function(properties, element) {
  let props

  if (typeof properties === "function") {
    props = properties(element)
  } else {
    props = _.extend({}, properties)
  }

  return props
}

/**
 * LinkTracker Object
 * @constructor
 * @extends DomTracker
 */
let LinkTracker = function() {
  this.override_event = "click"
}
_.inherit(LinkTracker, DomTracker)

LinkTracker.prototype.create_properties = function(properties, element) {
  let props = LinkTracker.superclass.create_properties.apply(this, arguments)

  if (element.href) {
    props.url = element.href
  }

  return props
}

LinkTracker.prototype.event_handler = function(evt, element, options) {
  options.new_tab =
    evt.which === 2 || evt.metaKey || evt.ctrlKey || element.target === "_blank"
  options.href = element.href

  if (!options.new_tab) {
    evt.preventDefault()
  }
}

LinkTracker.prototype.after_track_handler = function(props, options) {
  if (options.new_tab) {
    return
  }

  setTimeout(function() {
    window.location = options.href
  }, 0)
}

/**
 * FormTracker Object
 * @constructor
 * @extends DomTracker
 */
let FormTracker = function() {
  this.override_event = "submit"
}
_.inherit(FormTracker, DomTracker)

FormTracker.prototype.event_handler = function(evt, element, options) {
  options.element = element
  evt.preventDefault()
}

FormTracker.prototype.after_track_handler = function(props, options) {
  setTimeout(function() {
    options.element.submit()
  }, 0)
}

/**
 * Mixpanel Persistence Object
 * @constructor
 */
let MixpanelPersistence = function(config) {
  this.props = {}
  this.campaign_params_saved = false

  if (config.persistence_name) {
    this.name = "mp_" + config.persistence_name
  } else {
    this.name = "mp_" + config.token + "_mixpanel"
  }

  let storage_type = config.persistence
  if (storage_type !== "cookie" && storage_type !== "localStorage") {
    console$1.critical(
      "Unknown persistence type " + storage_type + "; falling back to cookie",
    )
    storage_type = config.persistence = "cookie"
  }

  let localStorage_supported = function() {
    let supported = true
    try {
      let key = "__mplssupport__",
        val = "xyz"
      _.localStorage.set(key, val)
      if (_.localStorage.get(key) !== val) {
        supported = false
      }
      _.localStorage.remove(key)
    } catch (err) {
      supported = false
    }
    if (!supported) {
      console$1.error("localStorage unsupported; falling back to cookie store")
    }
    return supported
  }
  if (storage_type === "localStorage" && localStorage_supported()) {
    this.storage = _.localStorage
  } else {
    this.storage = _.cookie
  }

  this.load()
  this.update_config(config)
  this.upgrade(config)
  this.save()
}

MixpanelPersistence.prototype.properties = function() {
  let p = {}
  // Filter out reserved properties
  _.each(this.props, function(v, k) {
    if (!_.include(RESERVED_PROPERTIES, k)) {
      p[k] = v
    }
  })
  return p
}

MixpanelPersistence.prototype.load = function() {
  if (this.disabled) {
    return
  }

  let entry = this.storage.parse(this.name)

  if (entry) {
    this.props = _.extend({}, entry)
  }
}

MixpanelPersistence.prototype.upgrade = function(config) {
  let upgrade_from_old_lib = config.upgrade,
    old_cookie_name,
    old_cookie

  if (upgrade_from_old_lib) {
    old_cookie_name = "mp_super_properties"
    // Case where they had a custom cookie name before.
    if (typeof upgrade_from_old_lib === "string") {
      old_cookie_name = upgrade_from_old_lib
    }

    old_cookie = this.storage.parse(old_cookie_name)

    // remove the cookie
    this.storage.remove(old_cookie_name)
    this.storage.remove(old_cookie_name, true)

    if (old_cookie) {
      this.props = _.extend(
        this.props,
        old_cookie.all,
        old_cookie.events,
      )
    }
  }

  if (!config.cookie_name && config.name !== "mixpanel") {
    // special case to handle people with cookies of the form
    // mp_TOKEN_INSTANCENAME from the first release of this library
    old_cookie_name = "mp_" + config.token + "_" + config.name
    old_cookie = this.storage.parse(old_cookie_name)

    if (old_cookie) {
      this.storage.remove(old_cookie_name)
      this.storage.remove(old_cookie_name, true)

      // Save the prop values that were in the cookie from before -
      // this should only happen once as we delete the old one.
      this.register_once(old_cookie)
    }
  }

  if (this.storage === _.localStorage) {
    old_cookie = _.cookie.parse(this.name)

    _.cookie.remove(this.name)
    _.cookie.remove(this.name, true)

    if (old_cookie) {
      this.register_once(old_cookie)
    }
  }
}

MixpanelPersistence.prototype.save = function() {
  if (this.disabled) {
    return
  }
  this._expire_notification_campaigns()
  this.storage.set(
    this.name,
    _.JSONEncode(this.props),
    this.expire_days,
    this.cross_subdomain,
    this.secure,
  )
}

MixpanelPersistence.prototype.remove = function() {
  // remove both domain and subdomain cookies
  this.storage.remove(this.name, false)
  this.storage.remove(this.name, true)
}

// removes the storage entry and deletes all loaded data
// forced name for tests
MixpanelPersistence.prototype.clear = function() {
  this.remove()
  this.props = {}
}

/**
 * @param {Object} props
 * @param {*=} default_value
 * @param {number=} days
 */
MixpanelPersistence.prototype.register_once = function(
  props,
  default_value,
  days,
) {
  if (_.isObject(props)) {
    if (typeof default_value === "undefined") {
      default_value = "None"
    }
    this.expire_days = typeof days === "undefined" ? this.default_expiry : days

    _.each(
      props,
      function(val, prop) {
        if (!this.props[prop] || this.props[prop] === default_value) {
          this.props[prop] = val
        }
      },
      this,
    )

    this.save()

    return true
  }
  return false
}

/**
 * @param {Object} props
 * @param {number=} days
 */
MixpanelPersistence.prototype.register = function(props, days) {
  if (_.isObject(props)) {
    this.expire_days = typeof days === "undefined" ? this.default_expiry : days

    _.extend(this.props, props)

    this.save()

    return true
  }
  return false
}

MixpanelPersistence.prototype.unregister = function(prop) {
  if (prop in this.props) {
    delete this.props[prop]
    this.save()
  }
}

MixpanelPersistence.prototype._expire_notification_campaigns = _.safewrap(
  function() {
    let campaigns_shown = this.props[CAMPAIGN_IDS_KEY],
      EXPIRY_TIME = Config.DEBUG ? 60 * 1000 : 60 * 60 * 1000 // 1 minute (Config.DEBUG) / 1 hour (PDXN)
    if (!campaigns_shown) {
      return
    }
    for (let campaign_id in campaigns_shown) {
      if (1 * new Date() - campaigns_shown[campaign_id] > EXPIRY_TIME) {
        delete campaigns_shown[campaign_id]
      }
    }
    if (_.isEmptyObject(campaigns_shown)) {
      delete this.props[CAMPAIGN_IDS_KEY]
    }
  },
)

MixpanelPersistence.prototype.update_campaign_params = function() {
  if (!this.campaign_params_saved) {
    this.register_once(_.info.campaignParams())
    this.campaign_params_saved = true
  }
}

MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
  this.register(_.info.searchInfo(referrer))
}

// EXPORTED METHOD, we test this directly.
MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
  // If referrer doesn't exist, we want to note the fact that it was type-in traffic.
  this.register_once(
    {
      $initial_referrer: referrer || "$direct",
      $initial_referring_domain: _.info.referringDomain(referrer) || "$direct",
    },
    "",
  )
}

MixpanelPersistence.prototype.get_referrer_info = function() {
  return _.strip_empty_properties({
    $initial_referrer: this.props.$initial_referrer,
    $initial_referring_domain: this.props.$initial_referring_domain,
  })
}

// safely fills the passed in object with stored properties,
// does not override any properties defined in both
// returns the passed in object
MixpanelPersistence.prototype.safe_merge = function(props) {
  _.each(this.props, function(val, prop) {
    if (!(prop in props)) {
      props[prop] = val
    }
  })

  return props
}

MixpanelPersistence.prototype.update_config = function(config) {
  this.default_expiry = this.expire_days = config.cookie_expiration
  this.set_disabled(config.disable_persistence)
  this.set_cross_subdomain(config.cross_subdomain_cookie)
  this.set_secure(config.secure_cookie)
}

MixpanelPersistence.prototype.set_disabled = function(disabled) {
  this.disabled = disabled
  if (this.disabled) {
    this.remove()
  }
}

MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
  if (cross_subdomain !== this.cross_subdomain) {
    this.cross_subdomain = cross_subdomain
    this.remove()
    this.save()
  }
}

MixpanelPersistence.prototype.get_cross_subdomain = function() {
  return this.cross_subdomain
}

MixpanelPersistence.prototype.set_secure = function(secure) {
  if (secure !== this.secure) {
    this.secure = secure ? true : false
    this.remove()
    this.save()
  }
}

MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
  let q_key = this._get_queue_key(queue),
    q_data = data[queue],
    set_q = this._get_or_create_queue(SET_ACTION),
    set_once_q = this._get_or_create_queue(SET_ONCE_ACTION),
    add_q = this._get_or_create_queue(ADD_ACTION),
    union_q = this._get_or_create_queue(UNION_ACTION),
    append_q = this._get_or_create_queue(APPEND_ACTION, [])

  if (q_key === SET_QUEUE_KEY) {
    // Update the set queue - we can override any existing values
    _.extend(set_q, q_data)
    // if there was a pending increment, override it
    // with the set.
    this._pop_from_people_queue(ADD_ACTION, q_data)
    // if there was a pending union, override it
    // with the set.
    this._pop_from_people_queue(UNION_ACTION, q_data)
  } else if (q_key === SET_ONCE_QUEUE_KEY) {
    // only queue the data if there is not already a set_once call for it.
    _.each(q_data, function(v, k) {
      if (!(k in set_once_q)) {
        set_once_q[k] = v
      }
    })
  } else if (q_key === ADD_QUEUE_KEY) {
    _.each(
      q_data,
      function(v, k) {
        // If it exists in the set queue, increment
        // the value
        if (k in set_q) {
          set_q[k] += v
        } else {
          // If it doesn't exist, update the add
          // queue
          if (!(k in add_q)) {
            add_q[k] = 0
          }
          add_q[k] += v
        }
      },
      this,
    )
  } else if (q_key === UNION_QUEUE_KEY) {
    _.each(q_data, function(v, k) {
      if (_.isArray(v)) {
        if (!(k in union_q)) {
          union_q[k] = []
        }
        // We may send duplicates, the server will dedup them.
        union_q[k] = union_q[k].concat(v)
      }
    })
  } else if (q_key === APPEND_QUEUE_KEY) {
    append_q.push(q_data)
  }

  console$1.log("MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):")
  console$1.log(data)

  this.save()
}

MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
  let q = this._get_queue(queue)
  if (!_.isUndefined(q)) {
    _.each(
      data,
      function(v, k) {
        delete q[k]
      },
      this,
    )

    this.save()
  }
}

MixpanelPersistence.prototype._get_queue_key = function(queue) {
  if (queue === SET_ACTION) {
    return SET_QUEUE_KEY
  } else if (queue === SET_ONCE_ACTION) {
    return SET_ONCE_QUEUE_KEY
  } else if (queue === ADD_ACTION) {
    return ADD_QUEUE_KEY
  } else if (queue === APPEND_ACTION) {
    return APPEND_QUEUE_KEY
  } else if (queue === UNION_ACTION) {
    return UNION_QUEUE_KEY
  } else {
    console$1.error("Invalid queue:", queue)
  }
}

MixpanelPersistence.prototype._get_queue = function(queue) {
  return this.props[this._get_queue_key(queue)]
}
MixpanelPersistence.prototype._get_or_create_queue = function(
  queue,
  default_val,
) {
  let key = this._get_queue_key(queue)
  default_val = _.isUndefined(default_val) ? {} : default_val

  return this.props[key] || (this.props[key] = default_val)
}

MixpanelPersistence.prototype.set_event_timer = function(
  event_name,
  timestamp,
) {
  let timers = this.props[EVENT_TIMERS_KEY] || {}
  timers[event_name] = timestamp
  this.props[EVENT_TIMERS_KEY] = timers
  this.save()
}

MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
  let timers = this.props[EVENT_TIMERS_KEY] || {}
  let timestamp = timers[event_name]
  if (!_.isUndefined(timestamp)) {
    delete this.props[EVENT_TIMERS_KEY][event_name]
    this.save()
  }
  return timestamp
}

/**
 * Mixpanel Library Object
 * @constructor
 */
let MixpanelLib = function() {}

/**
 * Mixpanel People Object
 * @constructor
 */
let MixpanelPeople = function() {}

let MPNotif

/**
 * create_mplib(token:string, config:object, name:string)
 *
 * This function is used by the init method of MixpanelLib objects
 * as well as the main initializer at the end of the JSLib (that
 * initializes document.mixpanel as well as any additional instances
 * declared before this file has loaded).
 */
let create_mplib = function(token, config, name) {
  let instance,
    target = name === PRIMARY_INSTANCE_NAME
      ? mixpanel_master
      : mixpanel_master[name]

  if (target && init_type === INIT_MODULE) {
    instance = target
  } else {
    if (target && !_.isArray(target)) {
      console$1.error("You have already initialized " + name)
      return
    }
    instance = new MixpanelLib()
  }

  instance._init(token, config, name)

  instance.people = new MixpanelPeople()
  instance.people._init(instance)

  // if any instance on the page has debug = true, we set the
  // global debug to be true
  Config.DEBUG = Config.DEBUG || instance.get_config("debug")

  instance.__autotrack_enabled = instance.get_config("autotrack")
  if (instance.get_config("autotrack")) {
    let num_buckets = 100
    let num_enabled_buckets = 100
    if (
      !autotrack.enabledForProject(
        instance.get_config("token"),
        num_buckets,
        num_enabled_buckets,
      )
    ) {
      instance.__autotrack_enabled = false
      console$1.log(
        "Not in active bucket: disabling Automatic Event Collection.",
      )
    } else if (!autotrack.isBrowserSupported()) {
      instance.__autotrack_enabled = false
      console$1.log(
        "Disabling Automatic Event Collection because this browser is not supported",
      )
    } else {
      autotrack.init(instance)
    }

    try {
      add_dom_event_counting_handlers(instance)
    } catch (e) {
      console$1.error(e)
    }
  }

  // if target is not defined, we called init after the lib already
  // loaded, so there won't be an array of things to execute
  if (!_.isUndefined(target) && _.isArray(target)) {
    // Crunch through the people queue first - we queue this data up &
    // flush on identify, so it's better to do all these operations first
    instance._execute_array.call(instance.people, target.people)
    instance._execute_array(target)
  }

  return instance
}

// Initialization methods

/**
 * This function initializes a new instance of the Mixpanel tracking object.
 * All new instances are added to the main mixpanel object as sub properties (such as
 * mixpanel.library_name) and also returned by this function. To define a
 * second instance on the page, you would call:
 *
 *     mixpanel.init('new token', { your: 'config' }, 'library_name');
 *
 * and use it like so:
 *
 *     mixpanel.library_name.track(...);
 *
 * @param {String} token   Your Mixpanel API token
 * @param {Object} [config]  A dictionary of config options to override
 * @param {String} [name]    The name for the new mixpanel instance that you want created
 */
MixpanelLib.prototype.init = function(token, config, name) {
  if (_.isUndefined(name)) {
    console$1.error("You must name your new library: init(token, config, name)")
    return
  }
  if (name === PRIMARY_INSTANCE_NAME) {
    console$1.error(
      "You must initialize the main mixpanel object right after you include the Mixpanel js snippet",
    )
    return
  }

  let instance = create_mplib(token, config, name)
  mixpanel_master[name] = instance
  instance._loaded()

  return instance
}

// mixpanel._init(token:string, config:object, name:string)
//
// This function sets up the current instance of the mixpanel
// library.  The difference between this method and the init(...)
// method is this one initializes the actual instance, whereas the
// init(...) method sets up a new library and calls _init on it.
//
MixpanelLib.prototype._init = function(token, config, name) {
  this.__loaded = true
  this.config = {}

  this.set_config(
    _.extend({}, DEFAULT_CONFIG, config, {
      name,
      token,
      callback_fn:
        (name === PRIMARY_INSTANCE_NAME
          ? name
          : PRIMARY_INSTANCE_NAME + "." + name) + "._jsc",
    }),
  )

  this._jsc = function() {}

  this.__dom_loaded_queue = []
  this.__request_queue = []
  this.__disabled_events = []
  this._flags = {
    disable_all_events: false,
    identify_called: false,
  }

  this.persistence = this.cookie = new MixpanelPersistence(this.config)
  this.register_once({ distinct_id: _.UUID() }, "")
}

// Private methods

MixpanelLib.prototype._loaded = function() {
  this.get_config("loaded")(this)

  // this happens after so a user can call identify/name_tag in
  // the loaded callback
  if (this.get_config("track_pageview")) {
    this.track_pageview()
  }
}

MixpanelLib.prototype._dom_loaded = function() {
  _.each(
    this.__dom_loaded_queue,
    function(item) {
      this._track_dom.apply(this, item)
    },
    this,
  )
  _.each(
    this.__request_queue,
    function(item) {
      this._send_request.apply(this, item)
    },
    this,
  )
  delete this.__dom_loaded_queue
  delete this.__request_queue
}

MixpanelLib.prototype._track_dom = function(DomClass, args) {
  if (this.get_config("img")) {
    console$1.error("You can't use DOM tracking functions with img = true.")
    return false
  }

  if (!DOM_LOADED) {
    this.__dom_loaded_queue.push([DomClass, args])
    return false
  }

  let dt = new DomClass().init(this)
  return dt.track.apply(dt, args)
}

/**
 * _prepare_callback() should be called by callers of _send_request for use
 * as the callback argument.
 *
 * If there is no callback, this returns null.
 * If we are going to make XHR/XDR requests, this returns a function.
 * If we are going to use script tags, this returns a string to use as the
 * callback GET param.
 */
MixpanelLib.prototype._prepare_callback = function(callback, data) {
  if (_.isUndefined(callback)) {
    return null
  }

  if (USE_XHR) {
    let callback_function = function(response) {
      callback(response, data)
    }
    return callback_function
  } else {
    // if the user gives us a callback, we store as a random
    // property on this instances jsc function and update our
    // callback string to reflect that.
    let jsc = this._jsc
    let randomized_cb = "" + Math.floor(Math.random() * 100000000)
    let callback_string =
      this.get_config("callback_fn") + "[" + randomized_cb + "]"
    jsc[randomized_cb] = function(response) {
      delete jsc[randomized_cb]
      callback(response, data)
    }
    return callback_string
  }
}

MixpanelLib.prototype._send_request = function(url, data, callback) {
  if (ENQUEUE_REQUESTS) {
    this.__request_queue.push(arguments)
    return
  }

  // needed to correctly format responses
  let verbose_mode = this.get_config("verbose")
  if (data.verbose) {
    verbose_mode = true
  }

  if (this.get_config("test")) {
    data.test = 1
  }
  if (verbose_mode) {
    data.verbose = 1
  }
  if (this.get_config("img")) {
    data.img = 1
  }
  if (!USE_XHR) {
    if (callback) {
      data.callback = callback
    } else if (verbose_mode || this.get_config("test")) {
      // Verbose output (from verbose mode, or an error in test mode) is a json blob,
      // which by itself is not valid javascript. Without a callback, this verbose output will
      // cause an error when returned via jsonp, so we force a no-op callback param.
      // See the ECMA script spec: http://www.ecma-international.org/ecma-262/5.1/#sec-12.4
      data.callback = "(function(){})"
    }
  }

  data.ip = this.get_config("ip") ? 1 : 0
  data._ = new Date().getTime().toString()
  url += "?" + _.HTTPBuildQuery(data)

  if ("img" in data) {
    let img = document.createElement("img")
    img.src = url
    document.body.appendChild(img)
  } else if (USE_XHR) {
    try {
      let req = new XMLHttpRequest()
      req.open("GET", url, true)
      // send the mp_optout cookie
      // withCredentials cannot be modified until after calling .open on Android and Mobile Safari
      req.withCredentials = true
      req.onreadystatechange = function() {
        if (req.readyState === 4) {
          // XMLHttpRequest.DONE == 4, except in safari 4
          if (req.status === 200) {
            if (callback) {
              if (verbose_mode) {
                callback(_.JSONDecode(req.responseText))
              } else {
                callback(Number(req.responseText))
              }
            }
          } else {
            let error = "Bad HTTP status: " + req.status + " " + req.statusText
            console$1.error(error)
            if (callback) {
              if (verbose_mode) {
                callback({ status: 0, error })
              } else {
                callback(0)
              }
            }
          }
        }
      }
      req.send(null)
    } catch (e) {
      console$1.error(e)
    }
  } else {
    let script = document.createElement("script")
    script.type = "text/javascript"
    script.async = true
    script.defer = true
    script.src = url
    let s = document.getElementsByTagName("script")[0]
    s.parentNode.insertBefore(script, s)
  }
}

/**
 * _execute_array() deals with processing any mixpanel function
 * calls that were called before the Mixpanel library were loaded
 * (and are thus stored in an array so they can be called later)
 *
 * Note: we fire off all the mixpanel function calls && user defined
 * functions BEFORE we fire off mixpanel tracking calls. This is so
 * identify/register/set_config calls can properly modify early
 * tracking calls.
 *
 * @param {Array} array
 */
MixpanelLib.prototype._execute_array = function(array) {
  let fn_name,
    alias_calls = [],
    other_calls = [],
    tracking_calls = []
  _.each(
    array,
    function(item) {
      if (item) {
        fn_name = item[0]
        if (typeof item === "function") {
          item.call(this)
        } else if (_.isArray(item) && fn_name === "alias") {
          alias_calls.push(item)
        } else if (
          _.isArray(item) &&
          fn_name.indexOf("track") !== -1 &&
          typeof this[fn_name] === "function"
        ) {
          tracking_calls.push(item)
        } else {
          other_calls.push(item)
        }
      }
    },
    this,
  )

  let execute = function(calls, context) {
    _.each(
      calls,
      function(item) {
        this[item[0]].apply(this, item.slice(1))
      },
      context,
    )
  }

  execute(alias_calls, this)
  execute(other_calls, this)
  execute(tracking_calls, this)
}

/**
 * push() keeps the standard async-array-push
 * behavior around after the lib is loaded.
 * This is only useful for external integrations that
 * do not wish to rely on our convenience methods
 * (created in the snippet).
 *
 * ### Usage:
 *     mixpanel.push(['register', { a: 'b' }]);
 *
 * @param {Array} item A [function_name, args...] array to be executed
 */
MixpanelLib.prototype.push = function(item) {
  this._execute_array([item])
}

/**
 * Disable events on the Mixpanel object. If passed no arguments,
 * this function disables tracking of any event. If passed an
 * array of event names, those events will be disabled, but other
 * events will continue to be tracked.
 *
 * Note: this function does not stop other mixpanel functions from
 * firing, such as register() or people.set().
 *
 * @param {Array} [events] An array of event names to disable
 */
MixpanelLib.prototype.disable = function(events) {
  if (typeof events === "undefined") {
    this._flags.disable_all_events = true
  } else {
    this.__disabled_events = this.__disabled_events.concat(events)
  }
}

/**
 * Track an event. This is the most important and
 * frequently used Mixpanel function.
 *
 * ### Usage:
 *
 *     // track an event named 'Registered'
 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
 *
 * To track link clicks or form submissions, see track_links() or track_forms().
 *
 * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
 * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
 * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
 */
MixpanelLib.prototype.track = function(event_name, properties, callback) {
  if (typeof callback !== "function") {
    callback = function() {}
  }

  if (_.isUndefined(event_name)) {
    console$1.error("No event name provided to mixpanel.track")
    return
  }

  if (this._event_is_disabled(event_name)) {
    callback(0)
    return
  }

  // set defaults
  properties = properties || {}
  properties.token = this.get_config("token")

  // set $duration if time_event was previously called for this event
  let start_timestamp = this.persistence.remove_event_timer(event_name)
  if (!_.isUndefined(start_timestamp)) {
    let duration_in_ms = new Date().getTime() - start_timestamp
    properties.$duration = parseFloat((duration_in_ms / 1000).toFixed(3))
  }

  // update persistence
  this.persistence.update_search_keyword(document.referrer)

  if (this.get_config("store_google")) {
    this.persistence.update_campaign_params()
  }
  if (this.get_config("save_referrer")) {
    this.persistence.update_referrer_info(document.referrer)
  }

  // note: extend writes to the first object, so lets make sure we
  // don't write to the persistence properties object and info
  // properties object by passing in a new object

  // update properties with pageview info and super-properties
  properties = _.extend(
    {},
    _.info.properties(),
    this.persistence.properties(),
    properties,
  )

  try {
    if (
      this.get_config("autotrack") &&
      event_name !== "mp_page_view" &&
      event_name !== "$create_alias"
    ) {
      // The point of $__c is to count how many clicks occur per tracked event. Since we're
      // tracking an event in this function, we need to reset the $__c value.
      properties = _.extend({}, properties, this.mp_counts)
      this.mp_counts = { $__c: 0 }
      _.cookie.set("mp_" + this.get_config("name") + "__c", 0, 1, true)
    }
  } catch (e) {
    console$1.error(e)
  }

  let property_blacklist = this.get_config("property_blacklist")
  if (_.isArray(property_blacklist)) {
    _.each(property_blacklist, function(blacklisted_prop) {
      delete properties[blacklisted_prop]
    })
  } else {
    console$1.error(
      "Invalid value for property_blacklist config: " + property_blacklist,
    )
  }

  let data = {
    event: event_name,
    properties,
  }

  let truncated_data = _.truncate(data, 255)
  let json_data = _.JSONEncode(truncated_data)
  let encoded_data = _.base64Encode(json_data)

  console$1.log("MIXPANEL REQUEST:")
  console$1.log(truncated_data)

  this._send_request(
    this.get_config("api_host") + "/track/",
    { data: encoded_data },
    this._prepare_callback(callback, truncated_data),
  )

  return truncated_data
}

/**
 * Track a page view event, which is currently ignored by the server.
 * This function is called by default on page load unless the
 * track_pageview configuration variable is false.
 *
 * @param {String} [page] The url of the page to record. If you don't include this, it defaults to the current url.
 * @api private
 */
MixpanelLib.prototype.track_pageview = function(page) {
  if (_.isUndefined(page)) {
    page = document.location.href
  }
  this.track("mp_page_view", _.info.pageviewInfo(page))
}

/**
 * Track clicks on a set of document elements. Selector must be a
 * valid query. Elements must exist on the page at the time track_links is called.
 *
 * ### Usage:
 *
 *     // track click for link id #nav
 *     mixpanel.track_links('#nav', 'Clicked Nav Link');
 *
 * ### Notes:
 *
 * This function will wait up to 300 ms for the Mixpanel
 * servers to respond. If they have not responded by that time
 * it will head to the link without ensuring that your event
 * has been tracked.  To configure this timeout please see the
 * set_config() documentation below.
 *
 * If you pass a function in as the properties argument, the
 * function will receive the DOMElement that triggered the
 * event as an argument.  You are expected to return an object
 * from the function; any properties defined on this object
 * will be sent to mixpanel as event properties.
 *
 * @type {Function}
 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
 * @param {String} event_name The name of the event to track
 * @param {Object|Function} [properties] A properties object or function that returns a dictionary of properties when passed a DOMElement
 */
MixpanelLib.prototype.track_links = function() {
  return this._track_dom.call(this, LinkTracker, arguments)
}

/**
 * Track form submissions. Selector must be a valid query.
 *
 * ### Usage:
 *
 *     // track submission for form id 'register'
 *     mixpanel.track_forms('#register', 'Created Account');
 *
 * ### Notes:
 *
 * This function will wait up to 300 ms for the mixpanel
 * servers to respond, if they have not responded by that time
 * it will head to the link without ensuring that your event
 * has been tracked.  To configure this timeout please see the
 * set_config() documentation below.
 *
 * If you pass a function in as the properties argument, the
 * function will receive the DOMElement that triggered the
 * event as an argument.  You are expected to return an object
 * from the function; any properties defined on this object
 * will be sent to mixpanel as event properties.
 *
 * @type {Function}
 * @param {Object|String} query A valid DOM query, element or jQuery-esque list
 * @param {String} event_name The name of the event to track
 * @param {Object|Function} [properties] This can be a set of properties, or a function that returns a set of properties after being passed a DOMElement
 */
MixpanelLib.prototype.track_forms = function() {
  return this._track_dom.call(this, FormTracker, arguments)
}

/**
 * Time an event by including the time between this call and a
 * later 'track' call for the same event in the properties sent
 * with the event.
 *
 * ### Usage:
 *
 *     // time an event named 'Registered'
 *     mixpanel.time_event('Registered');
 *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
 *
 * When called for a particular event name, the next track call for that event
 * name will include the elapsed time between the 'time_event' and 'track'
 * calls. This value is stored as seconds in the '$duration' property.
 *
 * @param {String} event_name The name of the event.
 */
MixpanelLib.prototype.time_event = function(event_name) {
  if (_.isUndefined(event_name)) {
    console$1.error("No event name provided to mixpanel.time_event")
    return
  }

  if (this._event_is_disabled(event_name)) {
    return
  }

  this.persistence.set_event_timer(event_name, new Date().getTime())
}

/**
 * Register a set of super properties, which are included with all
 * events. This will overwrite previous super property values.
 *
 * ### Usage:
 *
 *     // register 'Gender' as a super property
 *     mixpanel.register({'Gender': 'Female'});
 *
 *     // register several super properties when a user signs up
 *     mixpanel.register({
 *         'Email': 'jdoe@example.com',
 *         'Account Type': 'Free'
 *     });
 *
 * @param {Object} properties An associative array of properties to store about the user
 * @param {Number} [days] How many days since the user's last visit to store the super properties
 */
MixpanelLib.prototype.register = function(props, days) {
  this.persistence.register(props, days)
}

/**
 * Register a set of super properties only once. This will not
 * overwrite previous super property values, unlike register().
 *
 * ### Usage:
 *
 *     // register a super property for the first time only
 *     mixpanel.register_once({
 *         'First Login Date': new Date().toISOString()
 *     });
 *
 * ### Notes:
 *
 * If default_value is specified, current super properties
 * with that value will be overwritten.
 *
 * @param {Object} properties An associative array of properties to store about the user
 * @param {*} [default_value] Value to override if already set in super properties (ex: 'False') Default: 'None'
 * @param {Number} [days] How many days since the users last visit to store the super properties
 */
MixpanelLib.prototype.register_once = function(props, default_value, days) {
  this.persistence.register_once(props, default_value, days)
}

/**
 * Delete a super property stored with the current user.
 *
 * @param {String} property The name of the super property to remove
 */
MixpanelLib.prototype.unregister = function(property) {
  this.persistence.unregister(property)
}

MixpanelLib.prototype._register_single = function(prop, value) {
  let props = {}
  props[prop] = value
  this.register(props)
}

/**
 * Identify a user with a unique ID. All subsequent
 * actions caused by this user will be tied to this unique ID. This
 * property is used to track unique visitors. If the method is
 * never called, then unique visitors will be identified by a UUID
 * generated the first time they visit the site.
 *
 * ### Notes:
 *
 * You can call this function to overwrite a previously set
 * unique ID for the current user. Mixpanel cannot translate
 * between IDs at this time, so when you change a user's ID
 * they will appear to be a new user.
 *
 * identify() should not be called to link anonymous activity to
 * subsequent activity when a unique ID is first assigned.
 * Use alias() when a unique ID is first assigned (registration), and
 * use identify() to identify the user with that unique ID on an ongoing
 * basis (e.g., each time a user logs in after registering).
 * Do not call identify() at the same time as alias().
 *
 * @param {String} [unique_id] A string that uniquely identifies a user. If not provided, the distinct_id currently in the persistent store (cookie or localStorage) will be used.
 */
MixpanelLib.prototype.identify = function(
  unique_id,
  _set_callback,
  _add_callback,
  _append_callback,
  _set_once_callback,
  _union_callback,
) {
  // Optional Parameters
  //  _set_callback:function  A callback to be run if and when the People set queue is flushed
  //  _add_callback:function  A callback to be run if and when the People add queue is flushed
  //  _append_callback:function  A callback to be run if and when the People append queue is flushed
  //  _set_once_callback:function  A callback to be run if and when the People set_once queue is flushed
  //  _union_callback:function  A callback to be run if and when the People union queue is flushed

  // identify only changes the distinct id if it doesn't match either the existing or the alias;
  // if it's new, blow away the alias as well.
  if (
    unique_id !== this.get_distinct_id() &&
    unique_id !== this.get_property(ALIAS_ID_KEY)
  ) {
    this.unregister(ALIAS_ID_KEY)
    this._register_single("distinct_id", unique_id)
  }
  this._check_and_handle_notifications(this.get_distinct_id())
  this._flags.identify_called = true
  // Flush any queued up people requests
  this.people._flush(
    _set_callback,
    _add_callback,
    _append_callback,
    _set_once_callback,
    _union_callback,
  )
}

/**
 * Clears super properties and generates a new random distinct_id for this instance.
 * Useful for clearing data when a user logs out.
 */
MixpanelLib.prototype.reset = function() {
  this.persistence.clear()
  this._flags.identify_called = false
  this.register_once({ distinct_id: _.UUID() }, "")
}

/**
 * Returns the current distinct id of the user. This is either the id automatically
 * generated by the library or the id that has been passed by a call to identify().
 *
 * ### Notes:
 *
 * get_distinct_id() can only be called after the Mixpanel library has finished loading.
 * init() has a loaded function available to handle this automatically. For example:
 *
 *     // set distinct_id after the mixpanel library has loaded
 *     mixpanel.init('YOUR PROJECT TOKEN', {
 *         loaded: function(mixpanel) {
 *             distinct_id = mixpanel.get_distinct_id();
 *         }
 *     });
 */
MixpanelLib.prototype.get_distinct_id = function() {
  return this.get_property("distinct_id")
}

/**
 * Create an alias, which Mixpanel will use to link two distinct_ids going forward (not retroactively).
 * Multiple aliases can map to the same original ID, but not vice-versa. Aliases can also be chained - the
 * following is a valid scenario:
 *
 *     mixpanel.alias('new_id', 'existing_id');
 *     ...
 *     mixpanel.alias('newer_id', 'new_id');
 *
 * If the original ID is not passed in, we will use the current distinct_id - probably the auto-generated GUID.
 *
 * ### Notes:
 *
 * The best practice is to call alias() when a unique ID is first created for a user
 * (e.g., when a user first registers for an account and provides an email address).
 * alias() should never be called more than once for a given user, except to
 * chain a newer ID to a previously new ID, as described above.
 *
 * @param {String} alias A unique identifier that you want to use for this user in the future.
 * @param {String} [original] The current identifier being used for this user.
 */
MixpanelLib.prototype.alias = function(alias, original) {
  // If the $people_distinct_id key exists in persistence, there has been a previous
  // mixpanel.people.identify() call made for this user. It is VERY BAD to make an alias with
  // this ID, as it will duplicate users.
  if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) {
    console$1.critical(
      "Attempting to create alias for existing People user - aborting.",
    )
    return -2
  }

  let _this = this
  if (_.isUndefined(original)) {
    original = this.get_distinct_id()
  }
  if (alias !== original) {
    this._register_single(ALIAS_ID_KEY, alias)
    return this.track(
      "$create_alias",
      { alias, distinct_id: original },
      function() {
        // Flush the people queue
        _this.identify(alias)
      },
    )
  } else {
    console$1.error("alias matches current distinct_id - skipping api call.")
    this.identify(alias)
    return -1
  }
}

/**
 * Provide a string to recognize the user by. The string passed to
 * this method will appear in the Mixpanel Streams product rather
 * than an automatically generated name. Name tags do not have to
 * be unique.
 *
 * This value will only be included in Streams data.
 *
 * @param {String} name_tag A human readable name for the user
 * @api private
 */
MixpanelLib.prototype.name_tag = function(name_tag) {
  this._register_single("mp_name_tag", name_tag)
}

/**
 * Update the configuration of a mixpanel library instance.
 *
 * The default config is:
 *
 *     {
 *       // super properties cookie expiration (in days)
 *       cookie_expiration:          365
 *
 *       // super properties span subdomains
 *       cross_subdomain_cookie:     true
 *
 *       // if this is true, the mixpanel cookie or localStorage entry
 *       // will be deleted, and no user persistence will take place
 *       disable_persistence:        false
 *
 *       // type of persistent store for super properties (cookie/
 *       // localStorage) if set to 'localStorage', any existing
 *       // mixpanel cookie value with the same persistence_name
 *       // will be transferred to localStorage and deleted
 *       persistence:                'cookie'
 *
 *       // name for super properties persistent store
 *       persistence_name:           ''
 *
 *       // names of properties/superproperties which should never
 *       // be sent with track() calls
 *       property_blacklist:         []
 *
 *       // if this is true, mixpanel cookies will be marked as
 *       // secure, meaning they will only be transmitted over https
 *       secure_cookie:              false
 *
 *       // the amount of time track_links will
 *       // wait for Mixpanel's servers to respond
 *       track_links_timeout:        300
 *
 *       // should we track a page view on page load
 *       track_pageview:             true
 *
 *       // if you set upgrade to be true, the library will check for
 *       // a cookie from our old js library and import super
 *       // properties from it, then the old cookie is deleted
 *       // The upgrade config option only works in the initialization,
 *       // so make sure you set it when you create the library.
 *       upgrade:                    false
 *     }
 *
 *
 * @param {Object} config A dictionary of new configuration values to update
 */
MixpanelLib.prototype.set_config = function(config) {
  if (_.isObject(config)) {
    _.extend(this.config, config)

    if (!this.get_config("persistence_name")) {
      this.config.persistence_name = this.config.cookie_name
    }
    if (!this.get_config("disable_persistence")) {
      this.config.disable_persistence = this.config.disable_cookie
    }

    if (this.persistence) {
      this.persistence.update_config(this.config)
    }
    Config.DEBUG = Config.DEBUG || this.get_config("debug")
  }
}

/**
 * returns the current config object for the library.
 */
MixpanelLib.prototype.get_config = function(prop_name) {
  return this.config[prop_name]
}

/**
 * Returns the value of the super property named property_name. If no such
 * property is set, get_property() will return the undefined value.
 *
 * ### Notes:
 *
 * get_property() can only be called after the Mixpanel library has finished loading.
 * init() has a loaded function available to handle this automatically. For example:
 *
 *     // grab value for 'user_id' after the mixpanel library has loaded
 *     mixpanel.init('YOUR PROJECT TOKEN', {
 *         loaded: function(mixpanel) {
 *             user_id = mixpanel.get_property('user_id');
 *         }
 *     });
 *
 * @param {String} property_name The name of the super property you want to retrieve
 */
MixpanelLib.prototype.get_property = function(property_name) {
  return this.persistence.props[property_name]
}

MixpanelLib.prototype.toString = function() {
  let name = this.get_config("name")
  if (name !== PRIMARY_INSTANCE_NAME) {
    name = PRIMARY_INSTANCE_NAME + "." + name
  }
  return name
}

MixpanelLib.prototype._event_is_disabled = function(event_name) {
  return (
    _.isBlockedUA(userAgent) ||
    this._flags.disable_all_events ||
    _.include(this.__disabled_events, event_name)
  )
}

MixpanelLib.prototype._check_and_handle_notifications = function(distinct_id) {
  if (
    !distinct_id ||
    this._flags.identify_called ||
    this.get_config("disable_notifications")
  ) {
    return
  }

  console$1.log("MIXPANEL NOTIFICATION CHECK")

  let data = {
    verbose: true,
    version: "2",
    lib: "web",
    token: this.get_config("token"),
    distinct_id,
  }
  let self = this
  this._send_request(
    this.get_config("decide_host") + "/decide/",
    data,
    this._prepare_callback(function(r) {
      if (r.notifications && r.notifications.length > 0) {
        self._show_notification.call(self, r.notifications[0])
      }
    }),
  )
}

MixpanelLib.prototype._show_notification = function(notification_data) {
  let notification = new MPNotif(notification_data, this)
  notification.show()
}

MixpanelPeople.prototype._init = function(mixpanel_instance) {
  this._mixpanel = mixpanel_instance
}

/*
 * Set properties on a user record.
 *
 * ### Usage:
 *
 *     mixpanel.people.set('gender', 'm');
 *
 *     // or set multiple properties at once
 *     mixpanel.people.set({
 *         'Company': 'Acme',
 *         'Plan': 'Premium',
 *         'Upgrade date': new Date()
 *     });
 *     // properties can be strings, integers, dates, or lists
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.set = function(prop, to, callback) {
  let data = {}
  let $set = {}
  if (_.isObject(prop)) {
    _.each(
      prop,
      function(v, k) {
        if (!this._is_reserved_property(k)) {
          $set[k] = v
        }
      },
      this,
    )
    callback = to
  } else {
    $set[prop] = to
  }

  // make sure that the referrer info has been updated and saved
  if (this._get_config("save_referrer")) {
    this._mixpanel.persistence.update_referrer_info(document.referrer)
  }

  // update $set object with default people properties
  $set = _.extend(
    {},
    _.info.people_properties(),
    this._mixpanel.persistence.get_referrer_info(),
    $set,
  )

  data[SET_ACTION] = $set

  return this._send_request(data, callback)
}

/*
 * Set properties on a user record, only if they do not yet exist.
 * This will not overwrite previous people property values, unlike
 * people.set().
 *
 * ### Usage:
 *
 *     mixpanel.people.set_once('First Login Date', new Date());
 *
 *     // or set multiple properties at once
 *     mixpanel.people.set_once({
 *         'First Login Date': new Date(),
 *         'Starting Plan': 'Premium'
 *     });
 *
 *     // properties can be strings, integers or dates
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [to] A value to set on the given property name
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.set_once = function(prop, to, callback) {
  let data = {}
  let $set_once = {}
  if (_.isObject(prop)) {
    _.each(
      prop,
      function(v, k) {
        if (!this._is_reserved_property(k)) {
          $set_once[k] = v
        }
      },
      this,
    )
    callback = to
  } else {
    $set_once[prop] = to
  }
  data[SET_ONCE_ACTION] = $set_once
  return this._send_request(data, callback)
}

/*
 * Increment/decrement numeric people analytics properties.
 *
 * ### Usage:
 *
 *     mixpanel.people.increment('page_views', 1);
 *
 *     // or, for convenience, if you're just incrementing a counter by
 *     // 1, you can simply do
 *     mixpanel.people.increment('page_views');
 *
 *     // to decrement a counter, pass a negative number
 *     mixpanel.people.increment('credits_left', -1);
 *
 *     // like mixpanel.people.set(), you can increment multiple
 *     // properties at once:
 *     mixpanel.people.increment({
 *         counter1: 1,
 *         counter2: 6
 *     });
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and numeric values.
 * @param {Number} [by] An amount to increment the given property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.increment = function(prop, by, callback) {
  let data = {}
  let $add = {}
  if (_.isObject(prop)) {
    _.each(
      prop,
      function(v, k) {
        if (!this._is_reserved_property(k)) {
          if (isNaN(parseFloat(v))) {
            console$1.error(
              "Invalid increment value passed to mixpanel.people.increment - must be a number",
            )
            return
          } else {
            $add[k] = v
          }
        }
      },
      this,
    )
    callback = by
  } else {
    // convenience: mixpanel.people.increment('property'); will
    // increment 'property' by 1
    if (_.isUndefined(by)) {
      by = 1
    }
    $add[prop] = by
  }
  data[ADD_ACTION] = $add

  return this._send_request(data, callback)
}

/*
 * Append a value to a list-valued people analytics property.
 *
 * ### Usage:
 *
 *     // append a value to a list, creating it if needed
 *     mixpanel.people.append('pages_visited', 'homepage');
 *
 *     // like mixpanel.people.set(), you can append multiple
 *     // properties at once:
 *     mixpanel.people.append({
 *         list1: 'bob',
 *         list2: 123
 *     });
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [value] An item to append to the list
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.append = function(list_name, value, callback) {
  let data = {}
  let $append = {}
  if (_.isObject(list_name)) {
    _.each(
      list_name,
      function(v, k) {
        if (!this._is_reserved_property(k)) {
          $append[k] = v
        }
      },
      this,
    )
    callback = value
  } else {
    $append[list_name] = value
  }
  data[APPEND_ACTION] = $append

  return this._send_request(data, callback)
}

/*
 * Merge a given list with a list-valued people analytics property,
 * excluding duplicate values.
 *
 * ### Usage:
 *
 *     // merge a value to a list, creating it if needed
 *     mixpanel.people.union('pages_visited', 'homepage');
 *
 *     // like mixpanel.people.set(), you can append multiple
 *     // properties at once:
 *     mixpanel.people.union({
 *         list1: 'bob',
 *         list2: 123
 *     });
 *
 *     // like mixpanel.people.append(), you can append multiple
 *     // values to the same list:
 *     mixpanel.people.union({
 *         list1: ['bob', 'billy']
 *     });
 *
 * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
 * @param {*} [value] Value / values to merge with the given property
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.union = function(list_name, values, callback) {
  let data = {}
  let $union = {}
  if (_.isObject(list_name)) {
    _.each(
      list_name,
      function(v, k) {
        if (!this._is_reserved_property(k)) {
          $union[k] = _.isArray(v) ? v : [v]
        }
      },
      this,
    )
    callback = values
  } else {
    $union[list_name] = _.isArray(values) ? values : [values]
  }
  data[UNION_ACTION] = $union

  return this._send_request(data, callback)
}

/*
 * Record that you have charged the current user a certain amount
 * of money. Charges recorded with track_charge() will appear in the
 * Mixpanel revenue report.
 *
 * ### Usage:
 *
 *     // charge a user $50
 *     mixpanel.people.track_charge(50);
 *
 *     // charge a user $30.50 on the 2nd of january
 *     mixpanel.people.track_charge(30.50, {
 *         '$time': new Date('jan 1 2012')
 *     });
 *
 * @param {Number} amount The amount of money charged to the current user
 * @param {Object} [properties] An associative array of properties associated with the charge
 * @param {Function} [callback] If provided, the callback will be called when the server responds
 */
MixpanelPeople.prototype.track_charge = function(amount, properties, callback) {
  if (!_.isNumber(amount)) {
    amount = parseFloat(amount)
    if (isNaN(amount)) {
      console$1.error(
        "Invalid value passed to mixpanel.people.track_charge - must be a number",
      )
      return
    }
  }

  return this.append(
    "$transactions",
    _.extend(
      {
        $amount: amount,
      },
      properties,
    ),
    callback,
  )
}

/*
 * Permanently clear all revenue report transactions from the
 * current user's people analytics profile.
 *
 * ### Usage:
 *
 *     mixpanel.people.clear_charges();
 *
 * @param {Function} [callback] If provided, the callback will be called after the tracking event
 */
MixpanelPeople.prototype.clear_charges = function(callback) {
  return this.set("$transactions", [], callback)
}

/*
 * Permanently deletes the current people analytics profile from
 * Mixpanel (using the current distinct_id).
 *
 * ### Usage:
 *
 *     // remove the all data you have stored about the current user
 *     mixpanel.people.delete_user();
 *
 */
MixpanelPeople.prototype.delete_user = function() {
  if (!this._identify_called()) {
    console$1.error(
      "mixpanel.people.delete_user() requires you to call identify() first",
    )
    return
  }
  let data = { $delete: this._mixpanel.get_distinct_id() }
  return this._send_request(data)
}

MixpanelPeople.prototype.toString = function() {
  return this._mixpanel.toString() + ".people"
}

MixpanelPeople.prototype._send_request = function(data, callback) {
  data.$token = this._get_config("token")
  data.$distinct_id = this._mixpanel.get_distinct_id()

  let date_encoded_data = _.encodeDates(data)
  let truncated_data = _.truncate(date_encoded_data, 255)
  let json_data = _.JSONEncode(date_encoded_data)
  let encoded_data = _.base64Encode(json_data)

  if (!this._identify_called()) {
    this._enqueue(data)
    if (!_.isUndefined(callback)) {
      if (this._get_config("verbose")) {
        callback({ status: -1, error: null })
      } else {
        callback(-1)
      }
    }
    return truncated_data
  }

  console$1.log("MIXPANEL PEOPLE REQUEST:")
  console$1.log(truncated_data)

  this._mixpanel._send_request(
    this._get_config("api_host") + "/engage/",
    { data: encoded_data },
    this._mixpanel._prepare_callback(callback, truncated_data),
  )

  return truncated_data
}

MixpanelPeople.prototype._get_config = function(conf_var) {
  return this._mixpanel.get_config(conf_var)
}

MixpanelPeople.prototype._identify_called = function() {
  return this._mixpanel._flags.identify_called === true
}

// Queue up engage operations if identify hasn't been called yet.
MixpanelPeople.prototype._enqueue = function(data) {
  if (SET_ACTION in data) {
    this._mixpanel.persistence._add_to_people_queue(SET_ACTION, data)
  } else if (SET_ONCE_ACTION in data) {
    this._mixpanel.persistence._add_to_people_queue(SET_ONCE_ACTION, data)
  } else if (ADD_ACTION in data) {
    this._mixpanel.persistence._add_to_people_queue(ADD_ACTION, data)
  } else if (APPEND_ACTION in data) {
    this._mixpanel.persistence._add_to_people_queue(APPEND_ACTION, data)
  } else if (UNION_ACTION in data) {
    this._mixpanel.persistence._add_to_people_queue(UNION_ACTION, data)
  } else {
    console$1.error("Invalid call to _enqueue():", data)
  }
}

// Flush queued engage operations - order does not matter,
// and there are network level race conditions anyway
MixpanelPeople.prototype._flush = function(
  _set_callback,
  _add_callback,
  _append_callback,
  _set_once_callback,
  _union_callback,
) {
  let _this = this
  let $set_queue = _.extend(
    {},
    this._mixpanel.persistence._get_queue(SET_ACTION),
  )
  let $set_once_queue = _.extend(
    {},
    this._mixpanel.persistence._get_queue(SET_ONCE_ACTION),
  )
  let $add_queue = _.extend(
    {},
    this._mixpanel.persistence._get_queue(ADD_ACTION),
  )
  let $append_queue = this._mixpanel.persistence._get_queue(APPEND_ACTION)
  let $union_queue = _.extend(
    {},
    this._mixpanel.persistence._get_queue(UNION_ACTION),
  )

  if (
    !_.isUndefined($set_queue) &&
    _.isObject($set_queue) &&
    !_.isEmptyObject($set_queue)
  ) {
    _this._mixpanel.persistence._pop_from_people_queue(
      SET_ACTION,
      $set_queue,
    )
    this.set($set_queue, function(response, data) {
      // on bad response, we want to add it back to the queue
      if (response === 0) {
        _this._mixpanel.persistence._add_to_people_queue(
          SET_ACTION,
          $set_queue,
        )
      }
      if (!_.isUndefined(_set_callback)) {
        _set_callback(response, data)
      }
    })
  }

  if (
    !_.isUndefined($set_once_queue) &&
    _.isObject($set_once_queue) &&
    !_.isEmptyObject($set_once_queue)
  ) {
    _this._mixpanel.persistence._pop_from_people_queue(
      SET_ONCE_ACTION,
      $set_once_queue,
    )
    this.set_once($set_once_queue, function(response, data) {
      // on bad response, we want to add it back to the queue
      if (response === 0) {
        _this._mixpanel.persistence._add_to_people_queue(
          SET_ONCE_ACTION,
          $set_once_queue,
        )
      }
      if (!_.isUndefined(_set_once_callback)) {
        _set_once_callback(response, data)
      }
    })
  }

  if (
    !_.isUndefined($add_queue) &&
    _.isObject($add_queue) &&
    !_.isEmptyObject($add_queue)
  ) {
    _this._mixpanel.persistence._pop_from_people_queue(
      ADD_ACTION,
      $add_queue,
    )
    this.increment($add_queue, function(response, data) {
      // on bad response, we want to add it back to the queue
      if (response === 0) {
        _this._mixpanel.persistence._add_to_people_queue(
          ADD_ACTION,
          $add_queue,
        )
      }
      if (!_.isUndefined(_add_callback)) {
        _add_callback(response, data)
      }
    })
  }

  if (
    !_.isUndefined($union_queue) &&
    _.isObject($union_queue) &&
    !_.isEmptyObject($union_queue)
  ) {
    _this._mixpanel.persistence._pop_from_people_queue(
      UNION_ACTION,
      $union_queue,
    )
    this.union($union_queue, function(response, data) {
      // on bad response, we want to add it back to the queue
      if (response === 0) {
        _this._mixpanel.persistence._add_to_people_queue(
          UNION_ACTION,
          $union_queue,
        )
      }
      if (!_.isUndefined(_union_callback)) {
        _union_callback(response, data)
      }
    })
  }

  // we have to fire off each $append individually since there is
  // no concat method server side
  if (
    !_.isUndefined($append_queue) &&
    _.isArray($append_queue) &&
    $append_queue.length
  ) {
    let $append_item
    let callback = function(response, data) {
      if (response === 0) {
        _this._mixpanel.persistence._add_to_people_queue(
          APPEND_ACTION,
          $append_item,
        )
      }
      if (!_.isUndefined(_append_callback)) {
        _append_callback(response, data)
      }
    }
    for (let i = $append_queue.length - 1; i >= 0; i--) {
      $append_item = $append_queue.pop()
      _this.append($append_item, callback)
    }
    // Save the shortened append queue
    _this._mixpanel.persistence.save()
  }
}

MixpanelPeople.prototype._is_reserved_property = function(prop) {
  return prop === "$distinct_id" || prop === "$token"
}

// Internal class for notification display
MixpanelLib._Notification = function(notif_data, mixpanel_instance) {
  _.bind_instance_methods(this)

  this.mixpanel = mixpanel_instance
  this.persistence = this.mixpanel.persistence

  this.campaign_id = _.escapeHTML(notif_data.id)
  this.message_id = _.escapeHTML(notif_data.message_id)

  this.body = (_.escapeHTML(notif_data.body) || "").replace(/\n/g, "<br/>")
  this.cta = _.escapeHTML(notif_data.cta) || "Close"
  this.notif_type = _.escapeHTML(notif_data.type) || "takeover"
  this.style = _.escapeHTML(notif_data.style) || "light"
  this.title = _.escapeHTML(notif_data.title) || ""
  this.video_width = MPNotif.VIDEO_WIDTH
  this.video_height = MPNotif.VIDEO_HEIGHT

  // These fields are url-sanitized in the backend already.
  this.dest_url = notif_data.cta_url || null
  this.image_url = notif_data.image_url || null
  this.thumb_image_url = notif_data.thumb_image_url || null
  this.video_url = notif_data.video_url || null

  this.clickthrough = true
  if (!this.dest_url) {
    this.dest_url = "#dismiss"
    this.clickthrough = false
  }

  this.mini = this.notif_type === "mini"
  if (!this.mini) {
    this.notif_type = "takeover"
  }
  this.notif_width = !this.mini ? MPNotif.NOTIF_WIDTH : MPNotif.NOTIF_WIDTH_MINI

  this._set_client_config()
  this.imgs_to_preload = this._init_image_html()
  this._init_video()
}

MPNotif = MixpanelLib._Notification

MPNotif.ANIM_TIME = 200
MPNotif.MARKUP_PREFIX = "mixpanel-notification"
MPNotif.BG_OPACITY = 0.6
MPNotif.NOTIF_TOP = 25
MPNotif.NOTIF_START_TOP = 200
MPNotif.NOTIF_WIDTH = 388
MPNotif.NOTIF_WIDTH_MINI = 420
MPNotif.NOTIF_HEIGHT_MINI = 85
MPNotif.THUMB_BORDER_SIZE = 5
MPNotif.THUMB_IMG_SIZE = 60
MPNotif.THUMB_OFFSET = Math.round(MPNotif.THUMB_IMG_SIZE / 2)
MPNotif.VIDEO_WIDTH = 595
MPNotif.VIDEO_HEIGHT = 334

MPNotif.prototype.show = function() {
  let self = this
  this._set_client_config()

  // don't display until HTML body exists
  if (!this.body_el) {
    setTimeout(function() {
      self.show()
    }, 300)
    return
  }

  this._init_styles()
  this._init_notification_el()

  // wait for any images to load before showing notification
  this._preload_images(this._attach_and_animate)
}

MPNotif.prototype.dismiss = _.safewrap(function() {
  if (!this.marked_as_shown) {
    // unexpected condition: user interacted with notif even though we didn't consider it
    // visible (see _mark_as_shown()); send tracking signals to mark delivery
    this._mark_delivery({ invisible: true })
  }

  let exiting_el = this.showing_video
    ? this._get_el("video")
    : this._get_notification_display_el()
  if (this.use_transitions) {
    this._remove_class("bg", "visible")
    this._add_class(exiting_el, "exiting")
    setTimeout(this._remove_notification_el, MPNotif.ANIM_TIME)
  } else {
    let notif_attr, notif_start, notif_goal
    if (this.mini) {
      notif_attr = "right"
      notif_start = 20
      notif_goal = -100
    } else {
      notif_attr = "top"
      notif_start = MPNotif.NOTIF_TOP
      notif_goal = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP
    }
    this._animate_els(
      [
        {
          el: this._get_el("bg"),
          attr: "opacity",
          start: MPNotif.BG_OPACITY,
          goal: 0.0,
        },
        {
          el: exiting_el,
          attr: "opacity",
          start: 1.0,
          goal: 0.0,
        },
        {
          el: exiting_el,
          attr: notif_attr,
          start: notif_start,
          goal: notif_goal,
        },
      ],
      MPNotif.ANIM_TIME,
      this._remove_notification_el,
    )
  }
})

MPNotif.prototype._add_class = _.safewrap(function(el, class_name) {
  class_name = MPNotif.MARKUP_PREFIX + "-" + class_name
  if (typeof el === "string") {
    el = this._get_el(el)
  }
  if (!el.className) {
    el.className = class_name
  } else if (!~(" " + el.className + " ").indexOf(" " + class_name + " ")) {
    el.className += " " + class_name
  }
})
MPNotif.prototype._remove_class = _.safewrap(function(el, class_name) {
  class_name = MPNotif.MARKUP_PREFIX + "-" + class_name
  if (typeof el === "string") {
    el = this._get_el(el)
  }
  if (el.className) {
    el.className = (" " + el.className + " ")
      .replace(" " + class_name + " ", "")
      .replace(/^[\s\xA0]+/, "")
      .replace(/[\s\xA0]+$/, "")
  }
})

MPNotif.prototype._animate_els = _.safewrap(function(
  anims,
  mss,
  done_cb,
  start_time,
) {
  let self = this,
    in_progress = false,
    ai,
    anim,
    cur_time = 1 * new Date(),
    time_diff

  start_time = start_time || cur_time
  time_diff = cur_time - start_time

  for (ai = 0; ai < anims.length; ai++) {
    anim = anims[ai]
    if (typeof anim.val === "undefined") {
      anim.val = anim.start
    }
    if (anim.val !== anim.goal) {
      in_progress = true
      let anim_diff = anim.goal - anim.start,
        anim_dir = anim.goal >= anim.start ? 1 : -1
      anim.val = anim.start + anim_diff * time_diff / mss
      if (anim.attr !== "opacity") {
        anim.val = Math.round(anim.val)
      }
      if (
        (anim_dir > 0 && anim.val >= anim.goal) ||
        (anim_dir < 0 && anim.val <= anim.goal)
      ) {
        anim.val = anim.goal
      }
    }
  }
  if (!in_progress) {
    if (done_cb) {
      done_cb()
    }
    return
  }

  for (ai = 0; ai < anims.length; ai++) {
    anim = anims[ai]
    if (anim.el) {
      let suffix = anim.attr === "opacity" ? "" : "px"
      anim.el.style[anim.attr] = String(anim.val) + suffix
    }
  }
  setTimeout(function() {
    self._animate_els(anims, mss, done_cb, start_time)
  }, 10)
})

MPNotif.prototype._attach_and_animate = _.safewrap(function() {
  let self = this

  // no possibility to double-display
  if (this.shown || this._get_shown_campaigns()[this.campaign_id]) {
    return
  }
  this.shown = true

  this.body_el.appendChild(this.notification_el)
  setTimeout(function() {
    let notif_el = self._get_notification_display_el()
    if (self.use_transitions) {
      if (!self.mini) {
        self._add_class("bg", "visible")
      }
      self._add_class(notif_el, "visible")
      self._mark_as_shown()
    } else {
      let notif_attr, notif_start, notif_goal
      if (self.mini) {
        notif_attr = "right"
        notif_start = -100
        notif_goal = 20
      } else {
        notif_attr = "top"
        notif_start = MPNotif.NOTIF_START_TOP + MPNotif.NOTIF_TOP
        notif_goal = MPNotif.NOTIF_TOP
      }
      self._animate_els(
        [
          {
            el: self._get_el("bg"),
            attr: "opacity",
            start: 0.0,
            goal: MPNotif.BG_OPACITY,
          },
          {
            el: notif_el,
            attr: "opacity",
            start: 0.0,
            goal: 1.0,
          },
          {
            el: notif_el,
            attr: notif_attr,
            start: notif_start,
            goal: notif_goal,
          },
        ],
        MPNotif.ANIM_TIME,
        self._mark_as_shown,
      )
    }
  }, 100)
  _.register_event(self._get_el("cancel"), "click", function(e) {
    e.preventDefault()
    self.dismiss()
  })
  let click_el = self._get_el("button") || self._get_el("mini-content")
  _.register_event(click_el, "click", function(e) {
    e.preventDefault()
    if (self.show_video) {
      self._track_event("$campaign_open", { $resource_type: "video" })
      self._switch_to_video()
    } else {
      self.dismiss()
      if (self.clickthrough) {
        self._track_event(
          "$campaign_open",
          { $resource_type: "link" },
          function() {
            window.location.href = self.dest_url
          },
        )
      }
    }
  })
})

MPNotif.prototype._get_el = function(id) {
  return document.getElementById(MPNotif.MARKUP_PREFIX + "-" + id)
}

MPNotif.prototype._get_notification_display_el = function() {
  return this._get_el(this.notif_type)
}

MPNotif.prototype._get_shown_campaigns = function() {
  return (
    this.persistence.props[CAMPAIGN_IDS_KEY] ||
    (this.persistence.props[CAMPAIGN_IDS_KEY] = {})
  )
}

MPNotif.prototype._browser_lte = function(browser, version) {
  return (
    this.browser_versions[browser] && this.browser_versions[browser] <= version
  )
}

MPNotif.prototype._init_image_html = function() {
  let imgs_to_preload = []

  if (!this.mini) {
    if (this.image_url) {
      imgs_to_preload.push(this.image_url)
      this.img_html = '<img id="img" src="' + this.image_url + '"/>'
    } else {
      this.img_html = ""
    }
    if (this.thumb_image_url) {
      imgs_to_preload.push(this.thumb_image_url)
      this.thumb_img_html =
        '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div>' +
        '<img id="thumbnail"' +
        ' src="' +
        this.thumb_image_url +
        '"' +
        ' width="' +
        MPNotif.THUMB_IMG_SIZE +
        '"' +
        ' height="' +
        MPNotif.THUMB_IMG_SIZE +
        '"' +
        "/>" +
        '<div id="thumbspacer"></div>'
    } else {
      this.thumb_img_html = ""
    }
  } else {
    this.thumb_image_url =
      this.thumb_image_url ||
      "//cdn.mxpnl.com/site_media/images/icons/notifications/mini-news-dark.png"
    imgs_to_preload.push(this.thumb_image_url)
  }

  return imgs_to_preload
}

MPNotif.prototype._init_notification_el = function() {
  let notification_html = ""
  let video_src = ""
  let video_html = ""
  let cancel_html =
    '<div id="cancel">' + '<div id="cancel-icon"></div>' + "</div>"

  this.notification_el = document.createElement("div")
  this.notification_el.id = MPNotif.MARKUP_PREFIX + "-wrapper"
  if (!this.mini) {
    // TAKEOVER notification
    let close_html = this.clickthrough || this.show_video
      ? ""
      : '<div id="button-close"></div>',
      play_html = this.show_video ? '<div id="button-play"></div>' : ""
    if (this._browser_lte("ie", 7)) {
      close_html = ""
      play_html = ""
    }
    notification_html =
      '<div id="takeover">' +
      this.thumb_img_html +
      '<div id="mainbox">' +
      cancel_html +
      '<div id="content">' +
      this.img_html +
      '<div id="title">' +
      this.title +
      "</div>" +
      '<div id="body">' +
      this.body +
      "</div>" +
      '<div id="tagline">' +
      '<a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a>' +
      "</div>" +
      "</div>" +
      '<div id="button">' +
      close_html +
      '<a id="button-link" href="' +
      this.dest_url +
      '">' +
      this.cta +
      "</a>" +
      play_html +
      "</div>" +
      "</div>" +
      "</div>"
  } else {
    // MINI notification
    notification_html =
      '<div id="mini">' +
      '<div id="mainbox">' +
      cancel_html +
      '<div id="mini-content">' +
      '<div id="mini-icon">' +
      '<div id="mini-icon-img"></div>' +
      "</div>" +
      '<div id="body">' +
      '<div id="body-text"><div>' +
      this.body +
      "</div></div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div id="mini-border"></div>' +
      "</div>"
  }
  if (this.youtube_video) {
    video_src =
      "//www.youtube.com/embed/" +
      this.youtube_video +
      "?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080"
    if (this.yt_custom) {
      video_src += "&enablejsapi=1&html5=1&controls=0"
      video_html =
        '<div id="video-controls">' +
        '<div id="video-progress" class="video-progress-el">' +
        '<div id="video-progress-total" class="video-progress-el"></div>' +
        '<div id="video-elapsed" class="video-progress-el"></div>' +
        "</div>" +
        '<div id="video-time" class="video-progress-el"></div>' +
        "</div>"
    }
  } else if (this.vimeo_video) {
    video_src =
      "//player.vimeo.com/video/" +
      this.vimeo_video +
      "?autoplay=1&title=0&byline=0&portrait=0"
  }
  if (this.show_video) {
    this.video_iframe =
      '<iframe id="' +
      MPNotif.MARKUP_PREFIX +
      '-video-frame" ' +
      'width="' +
      this.video_width +
      '" height="' +
      this.video_height +
      '" ' +
      ' src="' +
      video_src +
      '"' +
      ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"' +
      "></iframe>"
    video_html =
      '<div id="video-' +
      (this.flip_animate ? "" : "no") +
      'flip">' +
      '<div id="video">' +
      '<div id="video-holder"></div>' +
      video_html +
      "</div>" +
      "</div>"
  }
  let main_html = video_html + notification_html
  if (this.flip_animate) {
    main_html =
      (this.mini ? notification_html : "") +
      '<div id="flipcontainer"><div id="flipper">' +
      (this.mini ? video_html : main_html) +
      "</div></div>"
  }

  this.notification_el.innerHTML = ('<div id="overlay" class="' +
    this.notif_type +
    '">' +
    '<div id="campaignid-' +
    this.campaign_id +
    '">' +
    '<div id="bgwrapper">' +
    '<div id="bg"></div>' +
    main_html +
    "</div>" +
    "</div>" +
    "</div>")
    .replace(/class=\"/g, 'class="' + MPNotif.MARKUP_PREFIX + "-")
    .replace(/id=\"/g, 'id="' + MPNotif.MARKUP_PREFIX + "-")
}

MPNotif.prototype._init_styles = function() {
  if (this.style === "dark") {
    this.style_vals = {
      bg: "#1d1f25",
      bg_actions: "#282b32",
      bg_hover: "#3a4147",
      bg_light: "#4a5157",
      border_gray: "#32353c",
      cancel_opacity: "0.4",
      mini_hover: "#2a3137",
      text_title: "#fff",
      text_main: "#9498a3",
      text_tagline: "#464851",
      text_hover: "#ddd",
    }
  } else {
    this.style_vals = {
      bg: "#fff",
      bg_actions: "#e7eaee",
      bg_hover: "#eceff3",
      bg_light: "#f5f5f5",
      border_gray: "#e4ecf2",
      cancel_opacity: "1.0",
      mini_hover: "#fafafa",
      text_title: "#5c6578",
      text_main: "#8b949b",
      text_tagline: "#ced9e6",
      text_hover: "#7c8598",
    }
  }
  let shadow = "0px 0px 35px 0px rgba(45, 49, 56, 0.7)",
    video_shadow = shadow,
    mini_shadow = shadow,
    thumb_total_size = MPNotif.THUMB_IMG_SIZE + MPNotif.THUMB_BORDER_SIZE * 2,
    anim_seconds = MPNotif.ANIM_TIME / 1000 + "s"
  if (this.mini) {
    shadow = "none"
  }

  // don't display on small viewports
  let notif_media_queries = {},
    min_width = MPNotif.NOTIF_WIDTH_MINI + 20
  notif_media_queries[
    "@media only screen and (max-width: " + (min_width - 1) + "px)"
  ] = {
    "#overlay": {
      display: "none",
    },
  }
  let notif_styles = {
    ".flipped": {
      transform: "rotateY(180deg)",
    },
    "#overlay": {
      "position": "fixed",
      "top": "0",
      "left": "0",
      "width": "100%",
      "height": "100%",
      "overflow": "auto",
      "text-align": "center",
      "z-index": "10000",
      "font-family": '"Helvetica", "Arial", sans-serif',
      "-webkit-font-smoothing": "antialiased",
      "-moz-osx-font-smoothing": "grayscale",
    },
    "#overlay.mini": {
      height: "0",
      overflow: "visible",
    },
    "#overlay a": {
      "width": "initial",
      "padding": "0",
      "text-decoration": "none",
      "text-transform": "none",
      "color": "inherit",
    },
    "#bgwrapper": {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    "#bg": {
      "position": "fixed",
      "top": "0",
      "left": "0",
      "width": "100%",
      "height": "100%",
      "min-width": this.doc_width * 4 + "px",
      "min-height": this.doc_height * 4 + "px",
      "background-color": "black",
      "opacity": "0.0",
      "-ms-filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)", // IE8
      "filter": "alpha(opacity=60)", // IE5-7
      "transition": "opacity " + anim_seconds,
    },
    "#bg.visible": {
      opacity: MPNotif.BG_OPACITY,
    },
    ".mini #bg": {
      "width": "0",
      "height": "0",
      "min-width": "0",
    },
    "#flipcontainer": {
      perspective: "1000px",
      position: "absolute",
      width: "100%",
    },
    "#flipper": {
      "position": "relative",
      "transform-style": "preserve-3d",
      "transition": "0.3s",
    },
    "#takeover": {
      "position": "absolute",
      "left": "50%",
      "width": MPNotif.NOTIF_WIDTH + "px",
      "margin-left": Math.round(-MPNotif.NOTIF_WIDTH / 2) + "px",
      "backface-visibility": "hidden",
      "transform": "rotateY(0deg)",
      "opacity": "0.0",
      "top": MPNotif.NOTIF_START_TOP + "px",
      "transition": "opacity " + anim_seconds + ", top " + anim_seconds,
    },
    "#takeover.visible": {
      opacity: "1.0",
      top: MPNotif.NOTIF_TOP + "px",
    },
    "#takeover.exiting": {
      opacity: "0.0",
      top: MPNotif.NOTIF_START_TOP + "px",
    },
    "#thumbspacer": {
      height: MPNotif.THUMB_OFFSET + "px",
    },
    "#thumbborder-wrapper": {
      position: "absolute",
      top: -MPNotif.THUMB_BORDER_SIZE + "px",
      left:
        MPNotif.NOTIF_WIDTH / 2 -
          MPNotif.THUMB_OFFSET -
          MPNotif.THUMB_BORDER_SIZE +
          "px",
      width: thumb_total_size + "px",
      height: thumb_total_size / 2 + "px",
      overflow: "hidden",
    },
    "#thumbborder": {
      "position": "absolute",
      "width": thumb_total_size + "px",
      "height": thumb_total_size + "px",
      "border-radius": thumb_total_size + "px",
      "background-color": this.style_vals.bg_actions,
      "opacity": "0.5",
    },
    "#thumbnail": {
      "position": "absolute",
      "top": "0px",
      "left": MPNotif.NOTIF_WIDTH / 2 - MPNotif.THUMB_OFFSET + "px",
      "width": MPNotif.THUMB_IMG_SIZE + "px",
      "height": MPNotif.THUMB_IMG_SIZE + "px",
      "overflow": "hidden",
      "z-index": "100",
      "border-radius": MPNotif.THUMB_IMG_SIZE + "px",
    },
    "#mini": {
      "position": "absolute",
      "right": "20px",
      "top": MPNotif.NOTIF_TOP + "px",
      "width": this.notif_width + "px",
      "height": MPNotif.NOTIF_HEIGHT_MINI * 2 + "px",
      "margin-top": 20 - MPNotif.NOTIF_HEIGHT_MINI + "px",
      "backface-visibility": "hidden",
      "opacity": "0.0",
      "transform": "rotateX(90deg)",
      "transition": "opacity 0.3s, transform 0.3s, right 0.3s",
    },
    "#mini.visible": {
      opacity: "1.0",
      transform: "rotateX(0deg)",
    },
    "#mini.exiting": {
      opacity: "0.0",
      right: "-150px",
    },
    "#mainbox": {
      "border-radius": "4px",
      "box-shadow": shadow,
      "text-align": "center",
      "background-color": this.style_vals.bg,
      "font-size": "14px",
      "color": this.style_vals.text_main,
    },
    "#mini #mainbox": {
      "height": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "margin-top": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "border-radius": "3px",
      "transition": "background-color " + anim_seconds,
    },
    "#mini-border": {
      "height": MPNotif.NOTIF_HEIGHT_MINI + 6 + "px",
      "width": MPNotif.NOTIF_WIDTH_MINI + 6 + "px",
      "position": "absolute",
      "top": "-3px",
      "left": "-3px",
      "margin-top": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "border-radius": "6px",
      "opacity": "0.25",
      "background-color": "#fff",
      "z-index": "-1",
      "box-shadow": mini_shadow,
    },
    "#mini-icon": {
      "position": "relative",
      "display": "inline-block",
      "width": "75px",
      "height": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "border-radius": "3px 0 0 3px",
      "background-color": this.style_vals.bg_actions,
      "background":
        "linear-gradient(135deg, " +
          this.style_vals.bg_light +
          " 0%, " +
          this.style_vals.bg_actions +
          " 100%)",
      "transition": "background-color " + anim_seconds,
    },
    "#mini:hover #mini-icon": {
      "background-color": this.style_vals.mini_hover,
    },
    "#mini:hover #mainbox": {
      "background-color": this.style_vals.mini_hover,
    },
    "#mini-icon-img": {
      "position": "absolute",
      "background-image": "url(" + this.thumb_image_url + ")",
      "width": "48px",
      "height": "48px",
      "top": "20px",
      "left": "12px",
    },
    "#content": {
      padding: "30px 20px 0px 20px",
    },
    "#mini-content": {
      "text-align": "left",
      "height": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "cursor": "pointer",
    },
    "#img": {
      "width": "328px",
      "margin-top": "30px",
      "border-radius": "5px",
    },
    "#title": {
      "max-height": "600px",
      "overflow": "hidden",
      "word-wrap": "break-word",
      "padding": "25px 0px 20px 0px",
      "font-size": "19px",
      "font-weight": "bold",
      "color": this.style_vals.text_title,
    },
    "#body": {
      "max-height": "600px",
      "margin-bottom": "25px",
      "overflow": "hidden",
      "word-wrap": "break-word",
      "line-height": "21px",
      "font-size": "15px",
      "font-weight": "normal",
      "text-align": "left",
    },
    "#mini #body": {
      "display": "inline-block",
      "max-width": "250px",
      "margin": "0 0 0 30px",
      "height": MPNotif.NOTIF_HEIGHT_MINI + "px",
      "font-size": "16px",
      "letter-spacing": "0.8px",
      "color": this.style_vals.text_title,
    },
    "#mini #body-text": {
      display: "table",
      height: MPNotif.NOTIF_HEIGHT_MINI + "px",
    },
    "#mini #body-text div": {
      "display": "table-cell",
      "vertical-align": "middle",
    },
    "#tagline": {
      "margin-bottom": "15px",
      "font-size": "10px",
      "font-weight": "600",
      "letter-spacing": "0.8px",
      "color": "#ccd7e0",
      "text-align": "left",
    },
    "#tagline a": {
      color: this.style_vals.text_tagline,
      transition: "color " + anim_seconds,
    },
    "#tagline a:hover": {
      color: this.style_vals.text_hover,
    },
    "#cancel": {
      "position": "absolute",
      "right": "0",
      "width": "8px",
      "height": "8px",
      "padding": "10px",
      "border-radius": "20px",
      "margin": "12px 12px 0 0",
      "box-sizing": "content-box",
      "cursor": "pointer",
      "transition": "background-color " + anim_seconds,
    },
    "#mini #cancel": {
      margin: "7px 7px 0 0",
    },
    "#cancel-icon": {
      "width": "8px",
      "height": "8px",
      "overflow": "hidden",
      "background-image":
        "url(//cdn.mxpnl.com/site_media/images/icons/notifications/cancel-x.png)",
      "opacity": this.style_vals.cancel_opacity,
    },
    "#cancel:hover": {
      "background-color": this.style_vals.bg_hover,
    },
    "#button": {
      "display": "block",
      "height": "60px",
      "line-height": "60px",
      "text-align": "center",
      "background-color": this.style_vals.bg_actions,
      "border-radius": "0 0 4px 4px",
      "overflow": "hidden",
      "cursor": "pointer",
      "transition": "background-color " + anim_seconds,
    },
    "#button-close": {
      "display": "inline-block",
      "width": "9px",
      "height": "60px",
      "margin-right": "8px",
      "vertical-align": "top",
      "background-image":
        "url(//cdn.mxpnl.com/site_media/images/icons/notifications/close-x-" +
          this.style +
          ".png)",
      "background-repeat": "no-repeat",
      "background-position": "0px 25px",
    },
    "#button-play": {
      "display": "inline-block",
      "width": "30px",
      "height": "60px",
      "margin-left": "15px",
      "background-image":
        "url(//cdn.mxpnl.com/site_media/images/icons/notifications/play-" +
          this.style +
          "-small.png)",
      "background-repeat": "no-repeat",
      "background-position": "0px 15px",
    },
    "a#button-link": {
      "display": "inline-block",
      "vertical-align": "top",
      "text-align": "center",
      "font-size": "17px",
      "font-weight": "bold",
      "overflow": "hidden",
      "word-wrap": "break-word",
      "color": this.style_vals.text_title,
      "transition": "color " + anim_seconds,
    },
    "#button:hover": {
      "background-color": this.style_vals.bg_hover,
      "color": this.style_vals.text_hover,
    },
    "#button:hover a": {
      color: this.style_vals.text_hover,
    },

    "#video-noflip": {
      position: "relative",
      top: -this.video_height * 2 + "px",
    },
    "#video-flip": {
      "backface-visibility": "hidden",
      "transform": "rotateY(180deg)",
    },
    "#video": {
      "position": "absolute",
      "width": this.video_width - 1 + "px",
      "height": this.video_height + "px",
      "top": MPNotif.NOTIF_TOP + "px",
      "margin-top": "100px",
      "left": "50%",
      "margin-left": Math.round(-this.video_width / 2) + "px",
      "overflow": "hidden",
      "border-radius": "5px",
      "box-shadow": video_shadow,
      "transform": "translateZ(1px)", // webkit rendering bug http://stackoverflow.com/questions/18167981/clickable-link-area-unexpectedly-smaller-after-css-transform
      "transition": "opacity " + anim_seconds + ", top " + anim_seconds,
    },
    "#video.exiting": {
      opacity: "0.0",
      top: this.video_height + "px",
    },
    "#video-holder": {
      "position": "absolute",
      "width": this.video_width - 1 + "px",
      "height": this.video_height + "px",
      "overflow": "hidden",
      "border-radius": "5px",
    },
    "#video-frame": {
      "margin-left": "-1px",
      "width": this.video_width + "px",
    },
    "#video-controls": {
      opacity: "0",
      transition: "opacity 0.5s",
    },
    "#video:hover #video-controls": {
      opacity: "1.0",
    },
    "#video .video-progress-el": {
      "position": "absolute",
      "bottom": "0",
      "height": "25px",
      "border-radius": "0 0 0 5px",
    },
    "#video-progress": {
      width: "90%",
    },
    "#video-progress-total": {
      "width": "100%",
      "background-color": this.style_vals.bg,
      "opacity": "0.7",
    },
    "#video-elapsed": {
      "width": "0",
      "background-color": "#6cb6f5",
      "opacity": "0.9",
    },
    "#video #video-time": {
      "width": "10%",
      "right": "0",
      "font-size": "11px",
      "line-height": "25px",
      "color": this.style_vals.text_main,
      "background-color": "#666",
      "border-radius": "0 0 5px 0",
    },
  }

  // IE hacks
  if (this._browser_lte("ie", 8)) {
    _.extend(notif_styles, {
      "* html #overlay": {
        position: "absolute",
      },
      "* html #bg": {
        position: "absolute",
      },
      "html, body": {
        height: "100%",
      },
    })
  }
  if (this._browser_lte("ie", 7)) {
    _.extend(notif_styles, {
      "#mini #body": {
        display: "inline",
        zoom: "1",
        border: "1px solid " + this.style_vals.bg_hover,
      },
      "#mini #body-text": {
        padding: "20px",
      },
      "#mini #mini-icon": {
        display: "none",
      },
    })
  }

  // add vendor-prefixed style rules
  let VENDOR_STYLES = [
    "backface-visibility",
    "border-radius",
    "box-shadow",
    "opacity",
    "perspective",
    "transform",
    "transform-style",
    "transition",
  ],
    VENDOR_PREFIXES = ["khtml", "moz", "ms", "o", "webkit"]
  for (let selector in notif_styles) {
    for (let si = 0; si < VENDOR_STYLES.length; si++) {
      let prop = VENDOR_STYLES[si]
      if (prop in notif_styles[selector]) {
        let val = notif_styles[selector][prop]
        for (let pi = 0; pi < VENDOR_PREFIXES.length; pi++) {
          notif_styles[selector]["-" + VENDOR_PREFIXES[pi] + "-" + prop] = val
        }
      }
    }
  }

  let inject_styles = function(styles, media_queries) {
    let create_style_text = function(style_defs) {
      let st = ""
      for (let selector in style_defs) {
        let mp_selector = selector
          .replace(/#/g, "#" + MPNotif.MARKUP_PREFIX + "-")
          .replace(/\./g, "." + MPNotif.MARKUP_PREFIX + "-")
        st += "\n" + mp_selector + " {"
        let props = style_defs[selector]
        for (let k in props) {
          st += k + ":" + props[k] + ";"
        }
        st += "}"
      }
      return st
    }
    let create_media_query_text = function(mq_defs) {
      let mqt = ""
      for (let mq in mq_defs) {
        mqt += "\n" + mq + " {" + create_style_text(mq_defs[mq]) + "\n}"
      }
      return mqt
    }

    let style_text =
      create_style_text(styles) + create_media_query_text(media_queries),
      head_el =
        document.head ||
        document.getElementsByTagName("head")[0] ||
        document.documentElement,
      style_el = document.createElement("style")
    head_el.appendChild(style_el)
    style_el.setAttribute("type", "text/css")
    if (style_el.styleSheet) {
      // IE
      style_el.styleSheet.cssText = style_text
    } else {
      style_el.textContent = style_text
    }
  }
  inject_styles(notif_styles, notif_media_queries)
}

MPNotif.prototype._init_video = _.safewrap(function() {
  if (!this.video_url) {
    return
  }
  let self = this

  // Youtube iframe API compatibility
  self.yt_custom = "postMessage" in window

  self.dest_url = self.video_url
  let youtube_match = self.video_url.match(
    // http://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match
    /(?:youtube(?:-nocookie)?\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i,
  ),
    vimeo_match = self.video_url.match(/vimeo\.com\/.*?(\d+)/i)
  if (youtube_match) {
    self.show_video = true
    self.youtube_video = youtube_match[1]

    if (self.yt_custom) {
      window.onYouTubeIframeAPIReady = function() {
        if (self._get_el("video-frame")) {
          self._yt_video_ready()
        }
      }

      // load Youtube iframe API; see https://developers.google.com/youtube/iframe_api_reference
      let tag = document.createElement("script")
      tag.src = "//www.youtube.com/iframe_api"
      let firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
    }
  } else if (vimeo_match) {
    self.show_video = true
    self.vimeo_video = vimeo_match[1]
  }

  // IE <= 7, FF <= 3: fall through to video link rather than embedded player
  if (self._browser_lte("ie", 7) || self._browser_lte("firefox", 3)) {
    self.show_video = false
    self.clickthrough = true
  }
})

MPNotif.prototype._mark_as_shown = _.safewrap(function() {
  // click on background to dismiss
  let self = this
  _.register_event(self._get_el("bg"), "click", function() {
    self.dismiss()
  })

  let get_style = function(el, style_name) {
    let styles = {}
    if (document.defaultView && document.defaultView.getComputedStyle) {
      styles = document.defaultView.getComputedStyle(el, null) // FF3 requires both args
    } else if (el.currentStyle) {
      // IE
      styles = el.currentStyle
    }
    return styles[style_name]
  }

  if (this.campaign_id) {
    let notif_el = this._get_el("overlay")
    if (
      notif_el &&
      get_style(notif_el, "visibility") !== "hidden" &&
      get_style(notif_el, "display") !== "none"
    ) {
      this._mark_delivery()
    }
  }
})

MPNotif.prototype._mark_delivery = _.safewrap(function(extra_props) {
  if (!this.marked_as_shown) {
    this.marked_as_shown = true

    if (this.campaign_id) {
      // mark notification shown (local cache)
      this._get_shown_campaigns()[this.campaign_id] = 1 * new Date()
      this.persistence.save()
    }

    // track delivery
    this._track_event("$campaign_delivery", extra_props)

    // mark notification shown (mixpanel property)
    this.mixpanel.people.append({
      $campaigns: this.campaign_id,
      $notifications: {
        campaign_id: this.campaign_id,
        message_id: this.message_id,
        type: "web",
        time: new Date(),
      },
    })
  }
})

MPNotif.prototype._preload_images = function(all_loaded_cb) {
  let self = this
  if (this.imgs_to_preload.length === 0) {
    all_loaded_cb()
    return
  }

  let preloaded_imgs = 0
  let img_objs = []
  let onload = function() {
    preloaded_imgs++
    if (preloaded_imgs === self.imgs_to_preload.length && all_loaded_cb) {
      all_loaded_cb()
      all_loaded_cb = null
    }
  }
  for (let i = 0; i < this.imgs_to_preload.length; i++) {
    let img = new Image()
    img.onload = onload
    img.src = this.imgs_to_preload[i]
    if (img.complete) {
      onload()
    }
    img_objs.push(img)
  }

  // IE6/7 doesn't fire onload reliably
  if (this._browser_lte("ie", 7)) {
    setTimeout(function() {
      let imgs_loaded = true
      for (i = 0; i < img_objs.length; i++) {
        if (!img_objs[i].complete) {
          imgs_loaded = false
        }
      }
      if (imgs_loaded && all_loaded_cb) {
        all_loaded_cb()
        all_loaded_cb = null
      }
    }, 500)
  }
}

MPNotif.prototype._remove_notification_el = _.safewrap(function() {
  window.clearInterval(this._video_progress_checker)
  this.notification_el.style.visibility = "hidden"
  this.body_el.removeChild(this.notification_el)
})

MPNotif.prototype._set_client_config = function() {
  let get_browser_version = function(browser_ex) {
    let match = navigator.userAgent.match(browser_ex)
    return match && match[1]
  }
  this.browser_versions = {}
  this.browser_versions.chrome = get_browser_version(/Chrome\/(\d+)/)
  this.browser_versions.firefox = get_browser_version(/Firefox\/(\d+)/)
  this.browser_versions.ie = get_browser_version(/MSIE (\d+).+/)
  if (
    !this.browser_versions.ie &&
    !window.ActiveXObject &&
    "ActiveXObject" in window
  ) {
    this.browser_versions.ie = 11
  }

  this.body_el = document.body || document.getElementsByTagName("body")[0]
  if (this.body_el) {
    this.doc_width = Math.max(
      this.body_el.scrollWidth,
      document.documentElement.scrollWidth,
      this.body_el.offsetWidth,
      document.documentElement.offsetWidth,
      this.body_el.clientWidth,
      document.documentElement.clientWidth,
    )
    this.doc_height = Math.max(
      this.body_el.scrollHeight,
      document.documentElement.scrollHeight,
      this.body_el.offsetHeight,
      document.documentElement.offsetHeight,
      this.body_el.clientHeight,
      document.documentElement.clientHeight,
    )
  }

  // detect CSS compatibility
  let ie_ver = this.browser_versions.ie
  let sample_styles = document.createElement("div").style,
    is_css_compatible = function(rule) {
      if (rule in sample_styles) {
        return true
      }
      if (!ie_ver) {
        rule = rule[0].toUpperCase() + rule.slice(1)
        let props = ["O" + rule, "Webkit" + rule, "Moz" + rule]
        for (let i = 0; i < props.length; i++) {
          if (props[i] in sample_styles) {
            return true
          }
        }
      }
      return false
    }
  this.use_transitions =
    this.body_el &&
    is_css_compatible("transition") &&
    is_css_compatible("transform")
  this.flip_animate =
    (this.browser_versions.chrome >= 33 ||
      this.browser_versions.firefox >= 15) &&
    this.body_el &&
    is_css_compatible("backfaceVisibility") &&
    is_css_compatible("perspective") &&
    is_css_compatible("transform")
}

MPNotif.prototype._switch_to_video = _.safewrap(function() {
  let self = this,
    anims = [
      {
        el: self._get_notification_display_el(),
        attr: "opacity",
        start: 1.0,
        goal: 0.0,
      },
      {
        el: self._get_notification_display_el(),
        attr: "top",
        start: MPNotif.NOTIF_TOP,
        goal: -500,
      },
      {
        el: self._get_el("video-noflip"),
        attr: "opacity",
        start: 0.0,
        goal: 1.0,
      },
      {
        el: self._get_el("video-noflip"),
        attr: "top",
        start: -self.video_height * 2,
        goal: 0,
      },
    ]

  if (self.mini) {
    let bg = self._get_el("bg"),
      overlay = self._get_el("overlay")
    bg.style.width = "100%"
    bg.style.height = "100%"
    overlay.style.width = "100%"

    self._add_class(self._get_notification_display_el(), "exiting")
    self._add_class(bg, "visible")

    anims.push({
      el: self._get_el("bg"),
      attr: "opacity",
      start: 0.0,
      goal: MPNotif.BG_OPACITY,
    })
  }

  let video_el = self._get_el("video-holder")
  video_el.innerHTML = self.video_iframe

  let video_ready = function() {
    if (window.YT && window.YT.loaded) {
      self._yt_video_ready()
    }
    self.showing_video = true
    self._get_notification_display_el().style.visibility = "hidden"
  }
  if (self.flip_animate) {
    self._add_class("flipper", "flipped")
    setTimeout(video_ready, MPNotif.ANIM_TIME)
  } else {
    self._animate_els(anims, MPNotif.ANIM_TIME, video_ready)
  }
})

MPNotif.prototype._track_event = function(event_name, properties, cb) {
  if (this.campaign_id) {
    properties = properties || {}
    properties = _.extend(properties, {
      campaign_id: this.campaign_id,
      message_id: this.message_id,
      message_type: "web_inapp",
      message_subtype: this.notif_type,
    })
    this.mixpanel.track(event_name, properties, cb)
  } else if (cb) {
    cb.call()
  }
}

MPNotif.prototype._yt_video_ready = _.safewrap(function() {
  let self = this
  if (self.video_inited) {
    return
  }
  self.video_inited = true

  let progress_bar = self._get_el("video-elapsed"),
    progress_time = self._get_el("video-time"),
    progress_el = self._get_el("video-progress")

  new window.YT.Player(MPNotif.MARKUP_PREFIX + "-video-frame", {
    events: {
      onReady(event) {
        let ytplayer = event.target,
          video_duration = ytplayer.getDuration(),
          pad = function(i) {
            return ("00" + i).slice(-2)
          },
          update_video_time = function(current_time) {
            let secs = Math.round(video_duration - current_time),
              mins = Math.floor(secs / 60),
              hours = Math.floor(mins / 60)
            secs -= mins * 60
            mins -= hours * 60
            progress_time.innerHTML =
              "-" + (hours ? hours + ":" : "") + pad(mins) + ":" + pad(secs)
          }
        update_video_time(0)
        self._video_progress_checker = window.setInterval(function() {
          let current_time = ytplayer.getCurrentTime()
          progress_bar.style.width = current_time / video_duration * 100 + "%"
          update_video_time(current_time)
        }, 250)
        _.register_event(progress_el, "click", function(e) {
          let clickx = Math.max(
            0,
            e.pageX - progress_el.getBoundingClientRect().left,
          )
          ytplayer.seekTo(
            video_duration * clickx / progress_el.clientWidth,
            true,
          )
        })
      },
    },
  })
})

// EXPORTS (for closure compiler)

// MixpanelLib Exports
MixpanelLib.prototype.init = MixpanelLib.prototype.init
MixpanelLib.prototype.reset = MixpanelLib.prototype.reset
MixpanelLib.prototype.disable = MixpanelLib.prototype.disable
MixpanelLib.prototype.time_event = MixpanelLib.prototype.time_event
MixpanelLib.prototype.track = MixpanelLib.prototype.track
MixpanelLib.prototype.track_links = MixpanelLib.prototype.track_links
MixpanelLib.prototype.track_forms = MixpanelLib.prototype.track_forms
MixpanelLib.prototype.track_pageview = MixpanelLib.prototype.track_pageview
MixpanelLib.prototype.register = MixpanelLib.prototype.register
MixpanelLib.prototype.register_once = MixpanelLib.prototype.register_once
MixpanelLib.prototype.unregister = MixpanelLib.prototype.unregister
MixpanelLib.prototype.identify = MixpanelLib.prototype.identify
MixpanelLib.prototype.alias = MixpanelLib.prototype.alias
MixpanelLib.prototype.name_tag = MixpanelLib.prototype.name_tag
MixpanelLib.prototype.set_config = MixpanelLib.prototype.set_config
MixpanelLib.prototype.get_config = MixpanelLib.prototype.get_config
MixpanelLib.prototype.get_property = MixpanelLib.prototype.get_property
MixpanelLib.prototype.get_distinct_id = MixpanelLib.prototype.get_distinct_id
MixpanelLib.prototype.toString = MixpanelLib.prototype.toString
MixpanelLib.prototype._check_and_handle_notifications =
  MixpanelLib.prototype._check_and_handle_notifications
MixpanelLib.prototype._show_notification =
  MixpanelLib.prototype._show_notification

// MixpanelPersistence Exports
MixpanelPersistence.prototype.properties =
  MixpanelPersistence.prototype.properties
MixpanelPersistence.prototype.update_search_keyword =
  MixpanelPersistence.prototype.update_search_keyword
MixpanelPersistence.prototype.update_referrer_info =
  MixpanelPersistence.prototype.update_referrer_info
MixpanelPersistence.prototype.get_cross_subdomain =
  MixpanelPersistence.prototype.get_cross_subdomain
MixpanelPersistence.prototype.clear = MixpanelPersistence.prototype.clear

// MixpanelPeople Exports
MixpanelPeople.prototype.set = MixpanelPeople.prototype.set
MixpanelPeople.prototype.set_once = MixpanelPeople.prototype.set_once
MixpanelPeople.prototype.increment = MixpanelPeople.prototype.increment
MixpanelPeople.prototype.append = MixpanelPeople.prototype.append
MixpanelPeople.prototype.union = MixpanelPeople.prototype.union
MixpanelPeople.prototype.track_charge = MixpanelPeople.prototype.track_charge
MixpanelPeople.prototype.clear_charges =
  MixpanelPeople.prototype.clear_charges
MixpanelPeople.prototype.delete_user = MixpanelPeople.prototype.delete_user
MixpanelPeople.prototype.toString = MixpanelPeople.prototype.toString

_.safewrap_class(MixpanelLib, [
  "identify",
  "_check_and_handle_notifications",
  "_show_notification",
])

let instances = {}
let extend_mp = function() {
  // add all the sub mixpanel instances
  _.each(instances, function(instance, name) {
    if (name !== PRIMARY_INSTANCE_NAME) {
      mixpanel_master[name] = instance
    }
  })

  // add private functions as _
  mixpanel_master._ = _
}

let override_mp_init_func = function() {
  // we override the snippets init function to handle the case where a
  // user initializes the mixpanel library after the script loads & runs
  mixpanel_master.init = function(token, config, name) {
    if (name) {
      // initialize a sub library
      if (!mixpanel_master[name]) {
        mixpanel_master[name] = instances[name] = create_mplib(
          token,
          config,
          name,
        )
        mixpanel_master[name]._loaded()
      }
      return mixpanel_master[name]
    } else {
      let instance = mixpanel_master

      if (instances[PRIMARY_INSTANCE_NAME]) {
        // main mixpanel lib already initialized
        instance = instances[PRIMARY_INSTANCE_NAME]
      } else if (token) {
        // intialize the main mixpanel lib
        instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME)
        instance._loaded()
        instances[PRIMARY_INSTANCE_NAME] = instance
      }

      mixpanel_master = instance
      if (init_type === INIT_SNIPPET) {
        window[PRIMARY_INSTANCE_NAME] = mixpanel_master
      }
      extend_mp()
    }
  }
}

let add_dom_loaded_handler = function() {
  // Cross browser DOM Loaded support
  function dom_loaded_handler() {
    // function flag since we only want to execute this once
    if (dom_loaded_handler.done) {
      return
    }
    dom_loaded_handler.done = true

    DOM_LOADED = true
    ENQUEUE_REQUESTS = false

    _.each(instances, function(inst) {
      inst._dom_loaded()
    })
  }

  function do_scroll_check() {
    try {
      document.documentElement.doScroll("left")
    } catch (e) {
      setTimeout(do_scroll_check, 1)
      return
    }

    dom_loaded_handler()
  }

  if (document.addEventListener) {
    if (document.readyState === "complete") {
      // safari 4 can fire the DOMContentLoaded event before loading all
      // external JS (including this file). you will see some copypasta
      // on the internet that checks for 'complete' and 'loaded', but
      // 'loaded' is an IE thing
      dom_loaded_handler()
    } else {
      document.addEventListener("DOMContentLoaded", dom_loaded_handler, false)
    }
  } else if (document.attachEvent) {
    // IE
    document.attachEvent("onreadystatechange", dom_loaded_handler)

    // check to make sure we arn't in a frame
    let toplevel = false
    try {
      toplevel = window.frameElement === null
    } catch (e) {
      // noop
    }

    if (document.documentElement.doScroll && toplevel) {
      do_scroll_check()
    }
  }

  // fallback handler, always will work
  _.register_event(window, "load", dom_loaded_handler, true)
}

let add_dom_event_counting_handlers = function(instance) {
  let name = instance.get_config("name")

  instance.mp_counts = instance.mp_counts || {}
  instance.mp_counts.$__c = parseInt(_.cookie.get("mp_" + name + "__c")) || 0

  let increment_count = function() {
    instance.mp_counts.$__c = (instance.mp_counts.$__c || 0) + 1
    _.cookie.set("mp_" + name + "__c", instance.mp_counts.$__c, 1, true)
  }

  let evtCallback = function() {
    try {
      instance.mp_counts = instance.mp_counts || {}
      increment_count()
    } catch (e) {
      console$1.error(e)
    }
  }
  _.register_event(document, "submit", evtCallback)
  _.register_event(document, "change", evtCallback)
  let mousedownTarget = null
  _.register_event(document, "mousedown", function(e) {
    mousedownTarget = e.target
  })
  _.register_event(document, "mouseup", function(e) {
    if (e.target === mousedownTarget) {
      evtCallback(e)
    }
  })
}

function init_as_module() {
  init_type = INIT_MODULE
  mixpanel_master = new MixpanelLib()

  override_mp_init_func()
  mixpanel_master.init()
  add_dom_loaded_handler()

  return mixpanel_master
}

let mixpanel = init_as_module()

module.exports = mixpanel
