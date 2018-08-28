const {default: Plumbing} = require('haiku-plumbing/lib/Plumbing');
const {default: ReplBase} = require('haiku-plumbing/lib/ReplBase');
const {default: envInfo} = require('haiku-plumbing/lib/envInfo');
const {default: haikuInfo} = require('haiku-plumbing/lib/haikuInfo');
const path = require('path');
const logger = require('haiku-serialization/src/utils/LoggerInstance');

global.eval = function () {
  // noop: eval is forbidden
};

let env;
let haiku;
let args;
let flags;

if (process.env.NODE_ENV === 'production') {
  const {default: Raven} = require('haiku-plumbing/lib/Raven');
  Raven.context(() => {
    go();
  });
} else {
  go();
}

function go () {
  env = envInfo();
  haiku = haikuInfo();
  args = env.args;
  flags = env.flags;

  if (flags.mode !== 'headless') {
    haiku.mode = 'creator';
  }

  logger.info(`Haiku plumbing ${process.env.HAIKU_RELEASE_VERSION} on ${process.env.NODE_ENV} launching`);
  logger.info('args:', args);
  logger.info('flags:', flags);
  logger.info('config:', haiku);

  const plumbing = new Plumbing();

  if (flags.repl) {
    startEmUp(plumbing, haiku, (_, folder) => {
      // A quick-and-dirty 'REPL' mainly for testing the plumbing, but open to all
      const repl = new ReplBase();
      const prompt = 'haiku';
      const opts = {
        me: plumbing,
        folder,
      };
      repl.start(prompt, opts);
    });
  } else {
    if (haiku.folder) {
      if (haiku.folder[0] !== path.sep) {
        haiku.folder = path.join(global.process.cwd(), haiku.folder);
      }
    }
    plumbing.getenv((error, dotenv) => {
      // Before we launch, read .env from ~/.haiku with extreme prejudice, overwriting any environment variables set
      // earlier during bootstrapping.
      if (!error) {
        Object.assign(haiku, {dotenv});
      }
      plumbing.launch(haiku, () => {
        logger.info('Haiku plumbing running');
      });
    });
  }
}

function startEmUp (plumbing, haiku, cb) {
  delete haiku.folder;
  plumbing.launch(haiku, () => {
    let folder = global.process.env.HAIKU_PROJECT_FOLDER;
    if (folder) {
      if (folder[0] !== path.sep) {
        folder = path.join(global.process.cwd(), folder);
      }

      plumbing.bootstrapProject(null, {projectPath: folder}, null, null, (err) => {
        if (err) {
          throw err;
        }
        plumbing.startProject(null, folder, (err) => {
          if (err) {
            throw err;
          }
          cb(null, folder);
        });
      });
    } else {
      cb(null);
    }
  });
}
