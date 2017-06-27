/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var path = require('path')
var express = require('express')
var browserify = require('browserify')
var handlebars = require('handlebars')
var filesize = require('filesize')
var fse = require('fs-extra')
var tools = require('browserify-transform-tools')

var swapPlayerRequirePath = tools.makeStringTransform(
  'swapPlayerRequirePath',
  {},
  function (content, options, done) {
    // Don't replace the require string unless we're loading an actual demo file
    if (!options.file.match(/\/test\/demo\//)) {
      return done(null, content)
    }

    content = content.split(`'@haiku/player/dom'`).join(`'./../../../dom'`)
    content = content
      .split(`'@haiku/player/dom/react'`)
      .join(`'./../../../dom/react'`)

    return done(null, content)
  }
)

var PORT = process.env.PORT || 3000
var DEMOS_PATH = path.join(__dirname)

var app = express()

app.use(express.static(__dirname))

app.get('/', function (req, res) {
  return fse.readFile(path.join(DEMOS_PATH, 'index.html.handlebars'), function (
    err,
    htmlbuf
  ) {
    console.log('[haiku-interpreter] request /index.html')
    if (err) return res.status(500).send('Server error!')
    var raw = htmlbuf.toString()
    var tpl = handlebars.compile(raw)
    return fse.readdir(DEMOS_PATH, function (err, entries) {
      if (err) return res.status(500).send('Server error!')
      var jss = entries.filter(function (entry) {
        return fse.lstatSync(path.join(DEMOS_PATH, entry)).isDirectory()
      })
      var demoList = jss.map(function (js) {
        var basename = path.basename(js)
        var output = { name: basename }
        output.vanillaUrl = '/demos/' + basename + '/vanilla'
        if (fse.existsSync(path.join(DEMOS_PATH, basename, 'react-dom.js'))) {
          output.reactDomUrl = '/demos/' + basename + '/react-dom'
        }
        return output
      })
      var html = tpl({
        demoList: demoList
      })
      return res.send(html)
    })
  })
})

app.get('/demos/:demo/vanilla', function (req, res) {
  var demo = req.params.demo
  console.log('[haiku-interpreter] request /demos/' + demo + '/vanilla')
  var folderAbspath = path.join(DEMOS_PATH, demo)
  var interpreterAbspath = path.join(DEMOS_PATH, demo, 'interpreter.js')
  return fse.exists(interpreterAbspath, function (answer) {
    if (!answer) return res.status(404).send('Demo not found!')
    return fse.readFile(path.join(DEMOS_PATH, 'demo.html.handlebars'), function (
      err,
      htmlbuf
    ) {
      if (err) return res.status(500).send('Server error! (' + err + ')')
      var raw = htmlbuf.toString()
      var tpl = handlebars.compile(raw)
      var br = browserify(interpreterAbspath, {
        standalone: 'bundle',
        transform: [swapPlayerRequirePath]
      })
      br.on('error', function (err) {
        return res.status(500).send('Server error! (' + err + ')')
      })
      return br.bundle(function (err, jsbuf) {
        if (err) return res.status(500).send('Server error! (' + err + ')')
        var js = jsbuf.toString()
        var fsize = filesize(Buffer.byteLength(js, 'utf8'))
        console.log(
          `[haiku-interpreter] ${demo} vanilla bundle size: ${fsize}`
        )
        var locals = {
          mountStyle: getMountStyle(demo),
          wrapperStyle: getWrapperStyle(demo),
          demo: demo,
          bundle: js
        }
        if (fse.existsSync(path.join(DEMOS_PATH, demo, 'note.txt'))) {
          locals.note = fse.readFileSync(
            path.join(DEMOS_PATH, demo, 'note.txt')
          )
        }
        var html = tpl(locals)
        return res.send(html)
      })
    })
  })
})

app.get('/demos/:demo/react-dom', function (req, res) {
  var demo = req.params.demo
  console.log('[haiku-interpreter] request /demos/' + demo + '/react-dom')
  var folderAbspath = path.join(DEMOS_PATH, demo)
  var reactAbspath = path.join(DEMOS_PATH, demo, 'react-dom.js')
  return fse.exists(reactAbspath, function (answer) {
    if (!answer) return res.status(404).send('React DOM demo not found!')
    return fse.readFile(
      path.join(DEMOS_PATH, 'react-dom.html.handlebars'),
      function (err, htmlbuf) {
        if (err) return res.status(500).send('Server error! (' + err + ')')
        var raw = htmlbuf.toString()
        var tpl = handlebars.compile(raw)
        var br = browserify(reactAbspath, {
          standalone: 'bundle',
          transform: [swapPlayerRequirePath]
        })
        br.on('error', function (err) {
          return res.status(500).send('Server error! (' + err + ')')
        })
        return br.bundle(function (err, jsbuf) {
          if (err) return res.status(500).send('Server error! (' + err + ')')
          var js = jsbuf.toString()
          var locals = {
            mountStyle: getMountStyle(demo),
            wrapperStyle: getWrapperStyle(demo),
            demo: demo,
            bundle: js
          }
          if (fse.existsSync(path.join(DEMOS_PATH, demo, 'note.txt'))) {
            locals.note = fse.readFileSync(
              path.join(DEMOS_PATH, demo, 'note.txt')
            )
          }
          var html = tpl(locals)
          return res.send(html)
        })
      }
    )
  })
})

function getMountStyle (demo) {
  if (demo === 'el-resizing-contain' || demo === 'el-resizing-cover') {
    return 'background-color: white; width: 50%; height: 50%; max-width: 600px; margin: 0 auto;'
  }
  return ''
}

function getWrapperStyle (demo) {
  if (demo === 'el-resizing-contain' || demo === 'el-resizing-cover') {
    return 'background-color: gray;'
  }
  return ''
}

app.listen(PORT, function () {
  console.log('[haiku-interpreter] demo server listening @ port ' + PORT)
  console.log('[haiku-interpreter] visit http://0.0.0.0:' + PORT)
})
