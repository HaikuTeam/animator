const tape = require('tape');
const path = require('path');
const fse = require('haiku-fs-extra');
const async = require('async');
const Project = require('./../../src/bll/Project');
const Keyframe = require('./../../src/bll/Keyframe');

tape('Keyframe.01', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  t.plan(44);
  return setupTest('keyframe-01', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');
    const kfs = rows[2].getKeyframes();

    // I am able to select a single keyframe by clicking on it
    fireClick(kfs[0], false);
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[0], 'kf0 selected');

    // I am able to deselect a single keyframe by clicking elsewhere
    fireClick(kfs[1], false);
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[1], 'kf1 selected');
    t.ok(!kfs[0].isSelected(), 'kf0 unselected');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // I am able to select multiple keyframes holding the `shift` key
    fireClick(kfs[0], false, {shift: true});
    fireClick(kfs[1], false, {shift: true});
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 2, '2 kfs selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[0], 'kf0 selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[1], kfs[1], 'kf1 selected');

    // I am able to deselect multiple keyframes by clicking elsewhere
    fireClick(kfs[2], false);
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 1, '1 kf selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[2], 'kf2 selected');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // I am able to deselect a previously selected keyframe holding `shift` and clicking on it
    fireClick(kfs[0], false, {shift: true});
    fireClick(kfs[1], false, {shift: true});
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 2, '2 kfs selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[0], 'kf0 selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[1], kfs[1], 'kf1 selected');
    fireClick(kfs[1], false, {shift: true});
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 1, '1 kfs selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[0], 'kf0 selected');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // I am able to select a single segment by clicking on it
    fireClick(kfs[1], true);
    t.ok(kfs[1].isSelected(), 'kfc selected');
    t.ok(kfs[1].isSelectedBody(), 'kfc selected');

    // I am able to deselect a single segment by clicking elsewhere
    fireClick(kfs[0]);
    t.ok(!kfs[1].isSelected(), 'orig kfc not selected');
    t.ok(!kfs[1].isSelectedBody(), 'orig kfc not selected');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // I am able to select multiple segments holding the `shift` key
    fireClick(kfs[0], true, {shift: true});
    fireClick(kfs[1], true, {shift: true});
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 3, '3 kfs selected');
    t.ok(kfs[0].isSelected() && kfs[0].isSelectedBody(), 'kf0 selected and on body');
    t.ok(kfs[1].isSelected() && kfs[1].isSelectedBody(), 'kf1 selected and on body');
    t.ok(kfs[2].isSelected() && !kfs[2].isSelectedBody(), 'kf2 selected');

    // I am able to deselect multiple segments by clicking elsewhere
    fireClick(kfs[3], false);
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 1, '1 kf selected');
    t.equal(Keyframe.where({_selected: true, component: ac})[0], kfs[3], 'kf2 selected');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // I am able to deselect a previously selected segment holding `shift` and clicking on it
    fireClick(kfs[0], true, {shift: true});
    fireClick(kfs[1], true, {shift: true});
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 3, '3 kfs selected');
    t.ok(kfs[0].isSelected() && kfs[0].isSelectedBody(), 'kf0 selected and on body');
    t.ok(kfs[1].isSelected() && kfs[1].isSelectedBody(), 'kf1 selected and on body');
    t.ok(kfs[2].isSelected() && !kfs[2].isSelectedBody(), 'kf2 selected by adjacency');
    fireClick(kfs[1], true, {shift: true});
    t.ok(kfs[0].isSelected() && kfs[0].isSelectedBody(), 'kf0 selected and on body');
    t.ok(kfs[1].isSelected() && !kfs[1].isSelectedBody(), 'kf1 body not selected'); // *--*__*
    t.ok(kfs[2].isSelected() && !kfs[2].isSelectedBody(), 'kf2 still selected'); // *--*__*

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // If three keyframes are selected I can deselect the leftmost
    fireClick(kfs[1], false, {shift: true});
    fireClick(kfs[2], false, {shift: true});
    fireClick(kfs[3], false, {shift: true});
    fireClick(kfs[1], false, {shift: true});
    t.ok(!kfs[1].isSelected(), 'kf1 not sel');
    t.ok(kfs[2].isSelected(), 'kf2 sel');
    t.ok(kfs[3].isSelected(), 'kf3 sel');

    Keyframe.deselectAndDeactivateAllKeyframes();
    t.equal(Keyframe.where({_selected: true, component: ac}).length, 0, 'no kfs selected');

    // If three keyframes are selected I can deselect the rightmost
    fireClick(kfs[1], false, {shift: true});
    fireClick(kfs[2], false, {shift: true});
    fireClick(kfs[3], false, {shift: true});
    fireClick(kfs[3], false, {shift: true});
    t.ok(kfs[1].isSelected(), 'kf1 sel');
    t.ok(kfs[2].isSelected(), 'kf2 sel');
    t.ok(!kfs[3].isSelected(), 'kf3 not sel');

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
  });
});

tape('Keyframe.02', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  t.plan(6);
  return setupTest('keyframe-02', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    const kfs = rows[2].getKeyframes();
    // When I drag the keyframe at frame 0 a newly keyframe is created at frame 0
    t.equal(kfs[0].getMs(), 0, 'ms ok to begin');
    t.equal(rows[2].getKeyframes().length, 6, '6 kfs to start');
    kfs[0].moveTo(50, 16.666);
    ac.commitAccumulatedKeyframeMovesDebounced();

    let once = false;
    ac.on('update', (what, row) => {
      if (what !== 'reloaded') {
 return;
}
      if (once) {
 return;
}
      once = true;

      const kfs2 = rows[2].getKeyframes();
      t.equal(kfs2.length, 7, 'more kfs');
      t.equal(kfs2[0].getMs(), 0, 'new kf at 0 ok');
      t.equal(kfs2[1].getMs(), 50, 'kf moved ok');

      // I can add a curve to a keyframe that was dragged from zeroth
      fireClick(kfs2[1], true);
      ac.joinSelectedKeyframes('linear', {from: 'timeline'});
      t.equal(kfs2[1].getCurve(), 'linear', 'curve is ok');

      process.env.HAIKU_SUBPROCESS = subproc;
      done();
    });
  });
});

tape('Keyframe.03', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  t.plan(2);
  return setupTest('keyframe-03', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    const kfs = rows[2].getKeyframes();
    t.equal(kfs.length, 6, 'kfs len ok');

    // I am able to delete a keyframe
    let once = true;
    ac.on('update', (what, row) => {
      if (what !== 'keyframe-delete') {
 return;
}
      if (row.isHeading()) {
 return;
}
      if (once) {
        once = false;
        t.equal(row.getKeyframes().length, 5, 'kfs len ok after delete');
      }
    });
    rows[2].deleteKeyframe(kfs[2], {from: 'test'});

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
  });
});

tape('Keyframe.04', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  t.plan(3);
  return setupTest('keyframe-04', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    const kfs = rows[2].getKeyframes();
    fireClick(kfs[0], false, {shift: false});
    t.equal(ac.checkIfSelectedKeyframesAreMovableToZero(), false, 'the first keyframe cannot be moved to zero');
    fireClick(kfs[1], false, {shift: false});
    t.equal(ac.checkIfSelectedKeyframesAreMovableToZero(), true, 'the first non-zero keyframe can be moved to zero');
    fireClick(kfs[2], false, {shift: false});
    t.equal(ac.checkIfSelectedKeyframesAreMovableToZero(), false, 'any other keyframe cannot be moved to zero');

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
  });
});

tape('Keyframe.05', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  t.plan(2);
  return setupTest('keyframe-05', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    const kfs = rows[2].getKeyframes();
    const cachedValue = kfs[0].value;

    kfs[0].moveTo(50, 16.666);
    ac.commitAccumulatedKeyframeMovesDebounced();

    let once = false;
    ac.on('update', (what, row) => {
      if (what !== 'reloaded') {
 return;
}
      if (once) {
 return;
}
      once = true;
      const kfs2 = rows[2].getKeyframes();

      t.equal(kfs2[0].value, cachedValue, 'newly created keyframe at zero has initial value by default');
      t.equal(kfs2[1].value, cachedValue, 'moved keyframe keeps its value');

      process.env.HAIKU_SUBPROCESS = subproc;
      done();
    });
  });
});

tape('Keyframe.06', (t) => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = 'timeline';
  return setupTest('keyframe-06', (err, ac, rows, done) => {
    if (err) {
 throw err;
}
    const kfs = rows[2].getKeyframes();
    const selection = [kfs[0], kfs[1]];

    t.notOk(Keyframe.groupIsSingleTween([kfs[0]]), 'returns false if only one keyframe is selected');
    t.notOk(Keyframe.groupIsSingleTween([kfs[0], kfs[1], kfs[2]]), 'returns false if more than two keyframes are selected');
    t.notOk(Keyframe.groupIsSingleTween([kfs[0], kfs[3]]), 'returns false if the keyframes are not next to each other');
    selection[0].curve = 'linear';
    t.ok(Keyframe.groupIsSingleTween(selection), 'returns true if there is a tween between the two provided keyframes');

    selection[0].curve = null;

    t.notOk(Keyframe.groupIsSingleTween(selection), 'returns false if there is not a tween between the keyframes');

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
    t.end();
  });
});

tape("Keyframe.07", t => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = "timeline";
  return setupTest("keyframe-07", (err, ac, rows, done) => {
    if (err) {
      throw err;
    }
    const kfs = rows[2].getKeyframes();
    const selection = [kfs[0], kfs[1]];

    kfs[0].curve = "linear";
    kfs[1].curve = "linear";
    t.true(
      Keyframe.groupHasBezierEditableCurves(selection),
      "Returns true if a group of keyframes have editable curves and are all the same"
    );

    t.true(
      Keyframe.groupHasBezierEditableCurves([kfs[0]]),
      "Returns true if a single keyframe with a decomposable curve is provided"
    );

    t.false(
      Keyframe.groupHasBezierEditableCurves([]),
      "Returns false if no keyframes are provided"
    );

    kfs[1].curve = "easeIn";
    t.false(
      Keyframe.groupHasBezierEditableCurves(selection),
      "Returns false if a group of curves contain different curves, even if all are non decomposable"
    );

    kfs[1].curve = "easeOutBounce";
    t.false(
      Keyframe.groupHasBezierEditableCurves([kfs[1]]),
      "Returns false if the group contains a decomposable curve"
    );

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
    t.end();
  });
});

tape("Keyframe.08", t => {
  const subproc = process.env.HAIKU_SUBPROCESS;
  process.env.HAIKU_SUBPROCESS = "timeline";
  return setupTest("keyframe-07", (err, ac, rows, done) => {
    if (err) {
      throw err;
    }
    const kf = rows[2].getKeyframes()[0];

    kf.curve = 'linear'
    t.equal(kf.getCurveCapitalized(), 'Linear', 'capitalizes defined curves')

    kf.curve = 'easeInOut'
    t.equal(kf.getCurveCapitalized(), 'EaseInOut', 'capitalizes defined curves')

    kf.curve = [0, 0.3, 0.2, 1];
    t.equal(kf.getCurveCapitalized(), 'Custom', 'returns "Custom" when a curve is defined by an array')

    kf.curve = null
    t.equal(kf.getCurveCapitalized(), '', 'returns an empty string when a curve is not defined')

    process.env.HAIKU_SUBPROCESS = subproc;
    done();
    t.end();
  });
});

// Please implement the rest of these as unit tests:
// I am able to create a tween between two keyframes
// I am able to select a single tween by clicking on it
// I am able to deselect a single tween by clicking elsewhere
// I am able to select multiple tweens holding the `shift` key
// I am able to select multiple adjacent tweens from left to right
// I am able to select multiple adjacent tweens from right to left
// I am able to deselect multiple tweens by clicking elsewhere
// I am able to deselect a previously selected tween holding `shift` and clicking on it
// I am able to select a mix of tweens and keyframes
// If a tween is selected and I click a keyframe, the tween gets deselected
// If a tween is selected and I click another tween, the first tween gets deselected
// If I have three tweens, I can multiselect the tweens on the right and left, leaving the middle tween unselected
// I am able to deselect a keyframe right clicking into another keyframe
// I am able to deselect a tween right clicking into another keyframe
// If multiple tweens are selected and I right-click on one of them all tweens remain selected and context menu opens
// If multiple tweens are selected and I right-click on tween “A” that is not selected, previously selected tweens get unselected and “A” is selected, then the context menu is open
// I am able to deselect a segment by right-clicking a tween
// I am able to deselect a segment by right-clicking a keyframe
// If I select two keyframes that belong to a tween, the tween is selected too

function fireClick (kf, onCurve, keySpec = {}, mouseSpec = {}) {
  fireMouseDown(kf, onCurve, keySpec, mouseSpec);
  fireMouseUp(kf, onCurve, keySpec, mouseSpec);
}

function fireMouseDown (kf, onCurve, keySpec = {}, mouseSpec = {}) {
  kf.handleMouseDown(
    mockEventSpec(kf, mouseSpec),
    mockKeySpec(kf, keySpec),
    mockViewSpec(kf, onCurve),
  );
}

function fireMouseUp (kf, onCurve, keySpec = {}, mouseSpec = {}) {
  kf.handleMouseUp(
    mockEventSpec(kf, mouseSpec),
    mockKeySpec(kf, keySpec),
    mockViewSpec(kf, onCurve),
  );
}

function fireDragStop (kf, onCurve, keySpec = {}) {
  kf.handleDragStop(
    {}, // unused
    mockKeySpec(kf, keySpec),
    mockViewSpec(kf, onCurve),
  );
}

function fireContextMenu (kf, onCurve, keySpec = {}) {
  kf.handleContextMenu(
    mockKeySpec(kf, keySpec),
    viewSpec(kf, onCurve),
  );
}

function mockEventSpec (kf, mouseSpec = {}) {
  return {
    nativeEvent: {
      which: mouseSpec.button || 1,
    },
  };
}

function mockKeySpec (kf, keySpec = {}) {
  return {
    wasDrag: !!keySpec.drag,
    lastMouseButtonPressed: !!keySpec.button,
    isShiftKeyDown: !!keySpec.shift,
    isControlKeyDown: !!keySpec.ctrl,
  };
}

function mockViewSpec (kf, onCurve) {
  if (!onCurve) {
 return {};
}
  if (kf.hasConstantBody()) {
 return {isViaConstantBodyView: true};
}
  if (kf.hasCurveBody()) {
 return {isViaTransitionBodyView: true};
}
  return {};
}

function setupTest (name, cb) {
  const folder = path.join(__dirname, '..', 'fixtures', 'projects', name);
  fse.removeSync(folder);
  const websocket = {on: () => {}, send: () => {}, action: () => {}, connect: () => {}};
  const platform = {};
  const userconfig = {};
  const fileOptions = {doWriteToDisk: false, skipDiffLogging: true};
  const envoyOptions = {mock: true};
  return Project.setup(folder, 'test', websocket, platform, userconfig, fileOptions, envoyOptions, (err, project) => {
    return project.setCurrentActiveComponent('main', {from: 'test'}, (err) => {
      if (err) {
 throw err;
}
      fse.outputFileSync(path.join(folder, 'designs/Path.svg'), PATH_SVG_1);
      const ac = project.getCurrentActiveComponent();
      return ac.instantiateComponent('designs/Path.svg', {}, {from: 'test'}, (err, info, mana) => {
        if (err) {
 throw err;
}
        const rows = ac.getRows().filter((row) => row.isProperty()).slice(0, 3);
        return async.eachSeries(rows, (row, next) => {
          const mss = [0, 100, 200, 300, 400, 500];
          return async.eachSeries(mss, (ms, next) => {
            row.createKeyframe(undefined, ms, {from: 'test'});
            return setTimeout(() => next(), 100);
          }, next);
        }, (err) => {
          if (err) {
 throw err;
}
          cb(null, ac, rows, () => {
            fse.removeSync(folder);
          });
        });
      });
    });
  });
}

const PATH_SVG_1 = `
  <?xml version="1.0" encoding="UTF-8"?>
  <svg width="99px" height="69px" viewBox="0 0 99 69" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <!-- Generator: sketchtool 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
      <title>PathPen</title>
      <desc>Created with sketchtool.</desc>
      <defs>
        <foobar id="abc123"></foobar>
      </defs>
      <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g foobar="url(#abc123)" id="Artboard" transform="translate(-283.000000, -254.000000)" stroke="#979797">
              <path d="M294.851562,260.753906 C282.404105,283.559532 310.725273,290.63691 326.835937,295.734375 C331.617305,297.247215 342.059558,301.595875 338.316406,309.21875 C337.259516,311.371092 335.344104,313.379399 333.070312,314.140625 C316.687518,319.6253 318.607648,314.107756 316.175781,298.535156 C314.073483,285.072967 341.353724,262.381072 307.847656,273.160156 C302.953426,274.734657 299.363413,279.037222 295.621094,282.5625 C294.703984,283.426421 289.762583,289.749326 292.835937,292.191406 C310.800174,306.465746 310.629063,293.466831 327.605469,293.117188 C340.400227,292.853669 361.733615,282.532042 364.140625,298.585938 C364.591437,301.592694 366.227007,305.49551 364.140625,307.707031 C356.643614,315.653704 320.800977,318.428842 316.511719,304 C313.310899,293.23261 309.646651,279.191944 316.511719,270.300781 L317.605469,266.996094 C318.70025,265.578208 319.962133,263.856288 321.726562,263.546875 C348.187608,258.906626 333.406544,260.284286 342.546875,271.855469 C345.091836,275.077257 351.639186,275.674796 351.988281,279.765625 L354.464844,283.632812 C357.416932,318.226499 296.30014,340.100228 293.25,300.105469 C292.638094,292.081893 291.431499,283.803546 293.25,275.964844 C294.715721,269.646813 297.246721,262.379048 302.785156,259.003906 C320.414927,248.260262 322.400502,263.451084 330.808594,271.378906 C333.565871,273.978688 339.302903,273.7221 340.503906,277.316406 C343.115394,285.131945 334.783267,296.681412 341.050781,302.03125 C348.504241,308.39339 366.513246,311.846671 370.4375,302.867188 L372.515625,301.476562 C387.936662,266.190128 352.052706,234.955091 328.25,269.800781 C322.336272,278.458113 340.249653,294.392337 330.753906,301.621094 C326.91332,304.544788 294.058884,308.199097 286.269531,307.359375 C284.995803,307.222062 284.102217,305.584758 283.921875,304.316406 C282.389249,293.537418 285.731973,295.96395 292.257812,288.046875 C311.385715,264.841117 307.46635,267.289874 346.21875,270.695312 C348.526208,270.898085 351.084913,271.703414 352.59375,273.460938 C354.971579,276.230679 354.398541,281.016656 357.144531,283.421875 C361.463282,287.20468 369.172641,295.592094 372.613281,290.996094 C396.717804,258.797319 361.228307,257.906354 349.429687,268.339844 C338.784302,277.753531 347.977468,308.238322 342.097656,310.683594 C334.379679,313.893313 325.61253,313.607482 317.28125,314.285156 C310.815625,314.811077 304.233838,315.258597 297.820312,314.285156 C296.449037,314.077025 295.446155,312.335074 295.328125,310.953125 C294.594926,302.368493 293.381654,293.498605 295.328125,285.105469 C302.241349,255.29581 326.590452,265.047417 334.488281,291.011719 C336.03704,296.103302 335.56021,306.996168 340.308594,312.417969 C354.750775,328.908343 356.425475,297.576804 356.195312,291.328125" id="Path-4"></path>
          </g>
      </g>
  </svg>
`;
