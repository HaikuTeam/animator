/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var path = require('path')
var express = require('express')
var browserify = require('browserify')
var handlebars = require('handlebars')
var filesize = require('filesize')
var fse = require('fs-extra')
var PORT = process.env.PORT || 3000
var DEMOS_PATH = path.join(__dirname)

var app = express()

app.use(express.static(__dirname))

app.get('/', function (req, res) {
  return fse.readFile(path.join(DEMOS_PATH, 'index.html.handlebars'), function (
    err,
    htmlbuf
  ) {
    console.log('[haiku player demo server] request /index.html')
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
        output.vanillaUrl = '/demos/' + basename
        return output
      })

      var html = tpl({
        demoList: demoList
      })

      return res.send(html)
    })
  })
})

app.get('/demos/:demo', function (req, res) {
  var demo = req.params.demo

  console.log('[haiku player demo server] request /demos/' + demo + '/vanilla')

  var folderAbspath = path.join(DEMOS_PATH, demo)
  var domAbspath = path.join(DEMOS_PATH, demo, 'code', 'main', 'dom.js')
  var reactAbspath = path.join(DEMOS_PATH, demo, 'code', 'main', 'react-dom.js')

  return fse.exists(domAbspath, function (answer) {
    if (!answer) return res.status(404).send('Demo not found!')
    return fse.readFile(path.join(DEMOS_PATH, 'demo.html.handlebars'), function (
      err,
      htmlbuf
    ) {
      if (err) return res.status(500).send('Server error! (' + err + ')')

      var raw = htmlbuf.toString()
      var tpl = handlebars.compile(raw)

      var vanillabr = browserify(domAbspath, { standalone: 'vanilla' })
      vanillabr.on('error', function (err) { return res.status(500).send('Server error! (' + err + ')') })
      return vanillabr.bundle(function (err, vanillabuf) {
        if (err) return res.status(500).send('Server error! (' + err + ')')
        var vanillajs = vanillabuf.toString()

        console.log(`[haiku player demo server] ${demo} bundle size: ${filesize(Buffer.byteLength(vanillajs, 'utf8'))} (unminified)`)

        var reactbr = browserify(reactAbspath, { standalone: 'react' })
        reactbr.on('error', function (err) { return res.status(500).send('Server error! (' + err + ')') })
        return reactbr.bundle(function (err, reactbuf) {
          if (err) return res.status(500).send('Server error! (' + err + ')')
          var reactjs = reactbuf.toString()

          var locals = {
            demo: demo,
            vanilla: vanillajs,
            react: reactjs
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
})

app.listen(PORT, function () {
  console.log('[haiku player demo server] demo server listening @ port ' + PORT)
  console.log('[haiku player demo server] visit http://0.0.0.0:' + PORT)
})
