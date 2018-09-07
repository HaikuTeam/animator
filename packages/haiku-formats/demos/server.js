/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const express = require('express');
const fse = require('haiku-fs-extra');
const handlebars = require('handlebars');
const path = require('path');
const webpack = require('webpack');

const PORT = process.env.PORT || 3000;
const GOLDENS_DIRECTORY = path.resolve(__dirname, '..', 'test', 'goldens');
const BYTECODE_DIRECTORY = path.join(GOLDENS_DIRECTORY, 'bytecode');
const BODYMOVIN_DIRECTORY = path.join(GOLDENS_DIRECTORY, 'bodymovin');

const app = express();
app.use(express.static(__dirname));
app.use('/static', express.static(path.join(__dirname, '..', 'test')));

app.get('/', (req, res) => {
  console.info('[haiku core demo server] request /');

  try {
    fse.readFile(path.join(__dirname, 'templates', 'index.html.handlebars'), (err, templateBuffer) => {
      if (err) {
        throw err;
      }

      const template = handlebars.compile(templateBuffer.toString());

      fse.readdir(BYTECODE_DIRECTORY, (err, entries) => {
        if (err) {
          throw err;
        }
        const demoList = entries.map((filename) => ({name: path.basename(filename, '.js')}));
        res.send(template({demoList}));
      });
    });
  } catch (err) {
    res.status(500).send(`Server error! (${err})`);
  }
});

const getSimpleCompiler = (entry, demo) => webpack({
  entry,
  output: {
    path: path.resolve(__dirname, 'webpack'),
    filename: `${demo}.[name].js`,
    library: '[name]',
    libraryTarget: 'window',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
});

app.get('/:demo', (req, res) => {
  const demo = req.params.demo;
  console.info(`[haiku core demo server] request /${demo}`);

  const bytecode = path.join(BYTECODE_DIRECTORY, `${demo}.js`);
  const bodymovin = path.join(BODYMOVIN_DIRECTORY, `${demo}.json`);
  if (!fse.existsSync(bytecode)) {
    return res.status(404).send('Demo not found!');
  }

  const compiler = getSimpleCompiler({bytecode, bodymovin}, demo);

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
        return res.send(template({demo}));
      });
    });
  } catch (err) {
    return res.status(500).send(`Server error! (${err})`);
  }
});

app.listen(PORT, () => {
  console.info('[haiku core demo server] demo server listening @ port ' + PORT);
});
