final String STATUS_PENDING = 'PENDING'
final String STATUS_SUCCESS = 'SUCCESS'
final String STATUS_FAILURE = 'FAILURE'
final String CONTEXT_RELEASE = 'release'
final String CONTEXT_BUILD_MAC = 'release/macOS'

pipeline {
    agent any
    stages {
        // Sets up Node and Yarn at the correct versions.
        stage('Provision-macOS') {
            agent {
                label 'master'
            }
            steps {
                setBuildStatus(CONTEXT_RELEASE, 'builds started', STATUS_PENDING)
                sh '''#!/bin/bash -x
                    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
                    . $HOME/.bash_profile
                    nvm install 8.9.3
                    nvm use 8.9.3
                    curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.9.2'''
            }
        }
        stage('Build') {
            parallel {
                stage('macOS') {
                    agent {
                        label 'master'
                    }
                    steps {
                        setBuildStatus(CONTEXT_BUILD_MAC, 'build started', STATUS_PENDING)
                        yarnInstallUnixLike()
                        nodeRun('./scripts/distro-configure.js --non-interactive')
                        nodeRun('./scripts/distro-download-secrets.js')
                        nodeRun('./scripts/distro-prepare.js')
                        nodeRun('./scripts/distro-build.js')
                    }
                    post {
                        success {
                            archiveArtifacts artifacts: 'dist/*.dmg, dist/*-mac.zip', fingerprint: true
                            slackSend([
                                    channel: 'releases',
                                    color: 'good',
                                    message: "PR #${env.ghprbPullId} built!\n\n" +
                                            "GitHub URL: https://github.com/HaikuTeam/mono/pull/${env.ghprbPullId}\n" +
                                            "Download Mac DMG: https://ci.haiku.ai/job/HaikuRelease/" +
                                            "${env.BUILD_NUMBER}/artifact/dist/Haiku-${getReleaseVersion()}.dmg"
                            ])
                            setBuildStatus(CONTEXT_BUILD_MAC, 'build complete', STATUS_SUCCESS)
                        }
                        failure {
                            setBuildStatus(CONTEXT_BUILD_MAC, 'build failed', STATUS_FAILURE)
                        }
                    }
                }
            }
        }
    }
    post {
        success {
            setBuildStatus(CONTEXT_RELEASE, 'all targets built', STATUS_SUCCESS)
        }
        failure {
            setBuildStatus(CONTEXT_RELEASE, 'not all targets built', STATUS_FAILURE)
        }
    }
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

String getReleaseVersion() {
    def packageJson = readJSON file: 'package.json'
    packageJson.version
}

void yarnInstallUnixLike() {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        yarn install --frozen-lockfile --force'''
}

void nodeRun(String command) {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        ''' + "node ${command}"
}
