// require('babel-register')({
//   presets: ['babel-preset-react-app'].map(require.resolve)
// });

process.env.NODE_ENV = 'test';
process.env.HAIKU_SKIP_AUTOUPDATE = '1'; // Skip autoupdate
process.env.DEV = '1'; // Force dev tools open

const DEFAULT_USERNAME = 'matthew+matthew@haiku.ai';
const DEFAULT_PASSWORD = 'supersecure';
const DEFAULT_PROJECT = 'e2etest';

const GIT_CONFIG = {
  repoGitUrl: 'https://github.com/HaikuTeam/git-testing.git',
  testUsername: 'haiku-test-user',
  testPassword: 'Snappy#-Citizen156!)',
  testEmail: 'matthew+github-haiku-test-user@haiku.ai',
};
