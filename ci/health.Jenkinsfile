final String STATUS_PENDING = 'PENDING'
final String STATUS_SUCCESS = 'SUCCESS'
final String STATUS_FAILURE = 'FAILURE'
final String CONTEXT_HEALTH = 'health'
final String CONTEXT_LINT = 'health/lint'
final String CONTEXT_TEST_MAC = 'health/test/macOS'
final String CONTEXT_BUILD = 'build'
final String CONTEXT_BUILD_MAC = 'build/macOS'
final String CONTEXT_PUSH = 'release/push'
final String CONTEXT_SYNDICATION = 'release/syndication'

pipeline {
    agent any
    environment {
      // Reverse the timestamp for squirrel ordering.
      HAIKU_RELEASE_COUNTDOWN = "8463041845495"
      haikuExplicitSemver = "4.2.1"
    }
    stages {
        stage('Syndicate') {
            when { expression { env.ghprbSourceBranch.startsWith('rc-') } }
            steps {
                milestone 5
                notifyAdvancementRequest()
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Syndicate release?', submitter: 'sasha@haiku.ai,matthew@haiku.ai,zack@haiku.ai'
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndicating...', STATUS_PENDING)
                    setupBuild()
                    nodeRun('./scripts/distro-syndicate.js --non-interactive')
                }
                milestone 6
            }
            post {
                success {
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'good',
                        message: ":1up: ${env.ghprbSourceBranch} was syndicated!"
                    ])
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndicated', STATUS_SUCCESS)
                }
                failure {
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'danger',
                        message: ":-1up: ${env.ghprbSourceBranch} failed during syndication!"
                    ])
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndication failed', STATUS_FAILURE)
                }
            }
        }
    }
}

void notifyAdvancementRequest() {
    slackSend([
        channel: 'engineering-feed',
        color: 'good',
        message: ":powerup: A build would like to advance\n\n" +
                  "https://ci.haiku.ai/blue/organizations/jenkins/Haiku/detail/Haiku/${env.BUILD_NUMBER}/pipeline"
    ])
}

void setBuildStatus(String context, String message, String state) {
    step([
        $class: 'GitHubCommitStatusSetter',
        commitShaSource: [$class: "ManuallyEnteredShaSource", sha: env.ghprbActualCommit],
        contextSource: [$class: 'ManuallyEnteredCommitContextSource', context: context],
        reposSource: [$class: 'ManuallyEnteredRepositorySource', url: 'https://github.com/HaikuTeam/mono'],
        errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']],
        statusResultSource: [
            $class: 'ConditionalStatusResultSource',
            results: [[$class: 'AnyBuildResult', message: message, state: state]]
        ]
    ])
}

void setupBuild() {
    yarnInstallUnixLike()
    nodeRun("./scripts/semver.js ${(env.haikuExplicitSemver == '') ? '--non-interactive' : "--explicit=${env.haikuExplicitSemver}"}")
    nodeRun('./scripts/distro-configure.js --non-interactive')
    nodeRun('./scripts/distro-download-secrets.js')
}

void yarnInstallUnixLike() {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        if [ ! -d node_modules ]; then
            yarn install --frozen-lockfile --force
        fi'''
}

void yarnRun(String command) {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        ''' + "yarn ${command}"
}

void nodeRun(String command) {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        ''' + "node ${command}"
}
