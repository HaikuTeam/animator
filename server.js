var path = require('path')
var express = require('express')
var browserify = require('browserify')
var handlebars = require('handlebars')
var fse = require('fs-extra')
var PORT = process.env.PORT || 3000
var DEMOS_PATH = path.join(__dirname, 'demo')
var app = express()
app.get('/', function(req, res) {
  return fse.readFile(path.join(DEMOS_PATH, 'index.html.handlebars'), function(err, htmlbuf) {
    if (err) return res.status(500).send('Server error!')
    var raw = htmlbuf.toString()
    var tpl = handlebars.compile(raw)
    return fse.readdir(DEMOS_PATH, function(err, entries) {
      if (err) return res.status(500).send('Server error!')
      var jss = entries.filter(function(entry) {
        return fse.lstatSync(path.join(DEMOS_PATH, entry)).isDirectory()
      })
      var list = jss.map(function(js) {
        var basename = path.basename(js)
        return { name: basename, url: '/demos/' + basename }
      })
      var html = tpl({ list: list })
      return res.send(html)
    })
  })
})
app.get('/demos/:demo', function(req, res) {
  var demo = req.params.demo
  var folderAbspath = path.join(DEMOS_PATH, demo)
  var haikujsAbspath = path.join(DEMOS_PATH, demo, 'haiku.js')
  var haikuConfig
  try {
    haikuConfig = require(haikujsAbspath)
  } catch (exception) {
    return res.status(404).send('Demo not found! (' + exception + ')')
  }
  if (!haikuConfig.interpreter) return res.status(500).send('Demo interpreter not defined!')
  var interpreterAbspath = path.join(DEMOS_PATH, demo, haikuConfig.interpreter)
  return fse.exists(interpreterAbspath, function(answer) {
    if (!answer) return res.status(404).send('Demo not found!')
    return fse.readFile(path.join(DEMOS_PATH, 'demo.html.handlebars'), function(err, htmlbuf) {
      if (err) return res.status(500).send('Server error! (' + err + ')')
      var raw = htmlbuf.toString()
      var tpl = handlebars.compile(raw)
      var br = browserify(interpreterAbspath, { standalone: 'bundle' })
      br.on('error', function (err) {
        return res.status(500).send('Server error! (' + err + ')')
      })
      return br.bundle(function(err, jsbuf) {
        if (err) return res.status(500).send('Server error! (' + err + ')')
        var js = jsbuf.toString()
        var html = tpl({ demo: demo, bundle: js })
        return res.send(html)
      })
    })
  })
})
app.listen(PORT, function() {
  console.log('[haiku-interpreter] demo server listening @ port ' + PORT)
  console.log('[haiku-interpreter] visit http://0.0.0.0:' + PORT + '/demos/:name')
})
