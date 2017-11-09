/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

const express = require('express');
const fse = require('fs-extra');
const handlebars = require('handlebars');
const path = require('path');
const webpack = require('webpack');

const PORT = process.env.PORT || 3000;
const PROJECTS_DIRECTORY = path.resolve(__dirname, 'projects');

const app = express();
app.use(express.static(path.join(__dirname)));

const getSimpleCompiler = (entry) => webpack({
  entry,
  output: {
    path: path.resolve(__dirname, 'webpack'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.js'],
  },
});

app.get('/', (req, res) => {
  console.info('[haiku player demo server] request /');

  try {
    fse.readFile(path.join(__dirname, 'templates', 'index.html.handlebars'), (err, templateBuffer) => {
      if (err) {
        throw err;
      }

      const template = handlebars.compile(templateBuffer.toString());

      fse.readdir(PROJECTS_DIRECTORY, (err, entries) => {
        if (err) {
          throw err;
        }

        const jss = entries.filter((entry) => fse.lstatSync(path.join(PROJECTS_DIRECTORY, entry)).isDirectory());
        const demoList = jss.map((js) => {
          const basename = path.basename(js);
          const output = {name: basename};
          output.vanillaUrl = '/demos/' + basename;
          return output;
        });

        res.send(template({demoList}));
      });
    });
  } catch (err) {
    res.status(500).send(`Server error! (${err})`);
  }
});

app.get('/demos/:demo', (req, res) => {
  const demo = req.params.demo;
  console.info(`[haiku player demo server] request /demos/${demo}`);

  const dom = path.join(PROJECTS_DIRECTORY, demo, 'code', 'main', 'dom.js');
  const reactDom = path.join(PROJECTS_DIRECTORY, demo, 'code', 'main', 'react-dom.js');
  const notePath = path.join(PROJECTS_DIRECTORY, demo, 'note.txt');
  if (!fse.existsSync(dom) || !fse.existsSync(reactDom)) {
    return res.status(404).send('Demo not found!');
  }

  const note = fse.existsSync(notePath) ? fse.readFileSync(notePath) : false;

  const compiler = getSimpleCompiler({dom, reactDom});

  try {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        throw err;
      }

      fse.readFile(path.join(__dirname, 'templates', 'demo.html.handlebars'), (err, templateBuffer) => {
        if (err) {
          throw err;
        }

        const template = handlebars.compile(templateBuffer.toString());
        return res.send(template({demo, note}));
      });
    });
  } catch (err) {
    return res.status(500).send(`Server error! (${err})`);
  }
});

app.get('/demos/:demo/debug', (req, res) => {
  const demo = req.params.demo;
  console.info(`[haiku player demo server] request /demos/${demo}/debug`);

  const bytecode = path.join(PROJECTS_DIRECTORY, demo, 'code', 'main', 'code.js');
  if (!fse.existsSync(bytecode)) {
    return res.status(404).send('Demo not found!');
  }

  const compiler = getSimpleCompiler({bytecode});

  try {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) {
        throw err;
      }

      fse.readFile(path.join(__dirname, 'templates', 'debug.html.handlebars'), (err, templateBuffer) => {
        if (err) {
          throw err;
        }

        const template = handlebars.compile(templateBuffer.toString());
        return res.send(template({demo}));
      });
    });
  } catch (err) {
    return res.status(500).send(`Server error! (${err})`);
  }
});

app.listen(PORT, () => {
  console.info('[haiku player demo server] demo server listening @ port ' + PORT);
});
