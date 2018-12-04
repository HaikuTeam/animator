const async = require('async');
const tape = require('tape');
const path = require('path');
const fse = require('haiku-fs-extra');

const Project = require('./../../src/bll/Project');
const File = require('./../../src/bll/File');
const Element = require('./../../src/bll/Element');

const waitUntilFileProbablyWroteToDisk = (fn) => {
  return setTimeout(fn, 1000); // Disk writes happen on a 500ms interval
};

tape('ModuleWrapper', (t) => {
  t.plan(1);
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', 'instantiate-01');
  fse.removeSync(folder);
  const websocket = {on: () => {}, send: () => {}, action: () => {}, connect: () => {}};
  const platform = {};
  const userconfig = {};
  const fileOptions = {doWriteToDisk: true, skipDiffLogging: true};
  const envoyOptions = {mock: true};
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', {from: 'test'}, (err) => {
      if (err) {
 throw err;
}
      fse.outputFileSync(path.join(folder, 'designs/Circle.svg'), CIRCLE_SVG_1);
      const ac0 = project.getCurrentActiveComponent();
      return ac0.instantiateComponent('designs/Circle.svg', {}, {from: 'test'}, (err, mana) => {
        if (err) {
 throw err;
}
        return waitUntilFileProbablyWroteToDisk(() => {
          return File.read(folder, ac0.fetchActiveBytecodeFile().relpath, (err, contents) => {
            if (err) {
 throw err;
}

            // Simulate what happens when @haiku/core is missing
            const corePath = require.resolve('@haiku/core');
            const coreCode = fse.readFileSync(corePath).toString();
            fse.removeSync(corePath);

            // Force a cache miss in ModuleWrapper so we do a full reload
            delete require.cache[path.join(folder, 'code', 'main', 'code.js')];

            const keyframeUpdates = {Default: {}};
            const selector = `haiku:${mana.attributes['haiku-id']}`;
            keyframeUpdates.Default[selector] = {};
            keyframeUpdates.Default[selector]['sizeAbsolute.x'] = {};
            keyframeUpdates.Default[selector]['sizeAbsolute.x'][0] = {value: 100};

            try {
              ac0.updateKeyframes(
                keyframeUpdates,
                {},
                {from: 'test'},
                () => {
                  fse.outputFileSync(corePath, coreCode);
                  t.ok(true, 'recovered from missing @haiku/core');
                },
              );
            } catch (exception) {
              console.error(exception.message);
              fse.outputFileSync(corePath, coreCode);
              t.error('unable to recover from missing @haiku/core');
            }
          });
        });
      });
    });
  });
});

const CIRCLE_SVG_1 = `
<?xml version="1.0" encoding="UTF-8"?>
<svg width="41px" height="41px" viewBox="0 0 41 41" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: sketchtool 47.1 (45422) - http://www.bohemiancoding.com/sketch -->
    <title>Circle</title>
    <desc>Created with sketchtool.</desc>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color="#EEEEEE" offset="0%"></stop>
            <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color="#C8C8C8" offset="0%"></stop>
            <stop stop-color="#979797" offset="100%"></stop>
        </linearGradient>
        <circle id="path-3" cx="20.5" cy="20.5" r="19.5"></circle>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-4">
            <feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology>
            <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset>
            <feComposite in="shadowOffsetOuter1" in2="SourceAlpha" operator="out" result="shadowOffsetOuter1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
        </filter>
        <filter x="-1.3%" y="-1.3%" width="102.6%" height="102.6%" filterUnits="objectBoundingBox" id="filter-5">
            <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetInner1"></feOffset>
            <feComposite in="shadowOffsetInner1" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowInnerInner1"></feComposite>
            <feColorMatrix values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0" type="matrix" in="shadowInnerInner1"></feColorMatrix>
        </filter>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Circle">
            <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlink:href="#path-3"></use>
            <use fill="url(#linearGradient-1)" fill-rule="evenodd" xlink:href="#path-3"></use>
            <use fill="black" fill-opacity="1" filter="url(#filter-5)" xlink:href="#path-3"></use>
            <use stroke="url(#linearGradient-2)" stroke-width="1" xlink:href="#path-3"></use>
        </g>
    </g>
</svg>
`;
