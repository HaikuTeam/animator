// This only exports a React module into which a Haiku Core must be passed
var React = require('react') // Installed as a peer dependency of '@haiku/core'
var ReactDOM = require('react-dom') // Installed as a peer dependency of '@haiku/core'
var HaikuReactAdapter = require('@haiku/core/dom/react')
var React_UsersMatthewCodeHaikuTeamMonoPackagesHaikuGlassTestProjectsApr91_Bare = HaikuReactAdapter(null, require('./code/main/code'))
if (React_UsersMatthewCodeHaikuTeamMonoPackagesHaikuGlassTestProjectsApr91_Bare.default) React_UsersMatthewCodeHaikuTeamMonoPackagesHaikuGlassTestProjectsApr91_Bare = React_UsersMatthewCodeHaikuTeamMonoPackagesHaikuGlassTestProjectsApr91_Bare.default
module.exports = React_UsersMatthewCodeHaikuTeamMonoPackagesHaikuGlassTestProjectsApr91_Bare