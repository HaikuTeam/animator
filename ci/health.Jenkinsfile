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
      HAIKU_RELEASE_COUNTDOWN = "${10.power(13) - new Date().getTime()}"
    }
    stages {
        // Sets up Node and Yarn at the correct versions.
        stage('Provision-macOS') {
            agent {
                label 'master'
            }
            steps {
                setBuildStatus(CONTEXT_HEALTH, 'health checks started', STATUS_PENDING)
                sh '''#!/bin/bash -x
                    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
                    . $HOME/.bash_profile
                    nvm install 8.9.3
                    nvm use 8.9.3
                    curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.9.4'''
            }
        }
        stage('Test') {
            parallel {
                stage('Test-macOS') {
                    agent {
                        label 'master'
                    }
                    steps {
                        setBuildStatus(CONTEXT_TEST_MAC, 'tests started', STATUS_PENDING)
                        yarnInstallUnixLike()
                        yarnRun('compile-all')
                        yarnRun('test-report')
                    }
                    post {
                        always {
                            archiveArtifacts artifacts: 'packages/**/test-result.tap', fingerprint: true
                            step([
                                $class: 'TapPublisher',
                                testResults: 'packages/**/test-result.tap',
                                verbose: true,
                                planRequired: true
                            ])
                            cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: '**/coverage/cobertura-coverage.xml', failNoReports: false, failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false
                        }
                        success {
                            setBuildStatus(CONTEXT_TEST_MAC, 'all tests pass', STATUS_SUCCESS)
                        }
                        failure {
                            setBuildStatus(CONTEXT_TEST_MAC, 'tests are failing', STATUS_FAILURE)
                            setBuildStatus(CONTEXT_HEALTH, 'not all health checks passed', STATUS_FAILURE)
                            slackSend([
                                channel: 'engineering-feed',
                                color: 'danger',
                                message: ":jenkins-rage: PR #${env.ghprbPullId} (https://github.com/HaikuTeam/mono/pull/${env.ghprbPullId}) has failing tests!"
                            ])
                        }
                    }
                }
            }
        }
        stage('Lint') {
            agent {
                label 'master'
            }
            steps {
                setBuildStatus(CONTEXT_LINT, 'lint started', STATUS_PENDING)
                yarnInstallUnixLike()
                yarnRun('lint-report')
            }
            post {
                always {
                    checkstyle canRunOnFailed: true, defaultEncoding: '', healthy: '', pattern: '**/checkstyle-result.xml', unHealthy: ''
                }
                success {
                    setBuildStatus(CONTEXT_LINT, 'no lint errors', STATUS_SUCCESS)
                    setBuildStatus(CONTEXT_HEALTH, 'all health checks passed', STATUS_SUCCESS)
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'good',
                        message: "PR #${env.ghprbPullId} (https://github.com/HaikuTeam/mono/pull/${env.ghprbPullId}) is healthy!"
                    ])
                }
                failure {
                    setBuildStatus(CONTEXT_LINT, 'lint errors found', STATUS_FAILURE)
                    setBuildStatus(CONTEXT_HEALTH, 'not all health checks passed', STATUS_FAILURE)
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'warning',
                        message: ":professor-farnsworth: PR #${env.ghprbPullId} (https://github.com/HaikuTeam/mono/pull/${env.ghprbPullId}) has lint errors!"
                    ])
                }
            }
        }
        stage('Build-Advance') {
            when { expression { env.ghprbSourceBranch.startsWith('rc-') } }
            steps {
                milestone 1
                timeout(time: 1, unit: 'HOURS') {
                    input message: 'Build for syndication?', submitter: 'sasha@haiku.ai,matthew@haiku.ai,zack@haiku.ai'
                    setBuildStatus(CONTEXT_BUILD, 'builds started', STATUS_PENDING)
                }
                milestone 2
            }
        }
        stage('Build') {
            when { expression { env.ghprbSourceBranch.startsWith('rc-') } }
            parallel {
                stage('macOS') {
                    agent {
                        label 'master'
                    }
                    steps {
                        setBuildStatus(CONTEXT_BUILD_MAC, 'build started', STATUS_PENDING)
                        yarnInstallUnixLike()
                        nodeRun('./scripts/semver.js --non-interactive')
                        nodeRun('./scripts/distro-configure.js --non-interactive')
                        nodeRun('./scripts/distro-download-secrets.js')
                        nodeRun('./scripts/distro-prepare.js')
                        nodeRun('./scripts/distro-build.js')
                        nodeRun('./scripts/distro-upload.js')
                    }
                    post {
                        success {
                            setBuildStatus(CONTEXT_BUILD_MAC, 'build complete', STATUS_SUCCESS)
                        }
                        failure {
                            setBuildStatus(CONTEXT_BUILD_MAC, 'build failed', STATUS_FAILURE)
                        }
                    }
                }
            }
            post {
                success {
                    setBuildStatus(CONTEXT_BUILD, 'all targets built', STATUS_SUCCESS)
                }
                failure {
                    setBuildStatus(CONTEXT_BUILD, 'not all targets built', STATUS_FAILURE)
                }
            }
        }
        stage('Push') {
            when { expression { env.ghprbSourceBranch.startsWith('rc-') } }
            steps {
                milestone 3
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Push to NPM and CDN?', submitter: 'sasha@haiku.ai,matthew@haiku.ai,zack@haiku.ai'
                    setBuildStatus(CONTEXT_PUSH, 'pushing to NPM and CDN...', STATUS_PENDING)
                    // Note: the pull request is merged in this step.
                    yarnInstallUnixLike()
                    nodeRun('./scripts/distro-push.js')
                }
                milestone 4
            }
            post {
                success {
                    setBuildStatus(CONTEXT_PUSH, 'pushed to NPM and CDN', STATUS_SUCCESS)
                }
                failure {
                    setBuildStatus(CONTEXT_PUSH, 'pushing to NPM and CDN failed', STATUS_FAILURE)
                }
            }
        }
        stage('Syndicate') {
            when { expression { env.ghprbSourceBranch.startsWith('rc-') } }
            steps {
                milestone 5
                timeout(time: 1, unit: 'DAYS') {
                    input message: 'Syndicate release?', submitter: 'matthew,zack,sasha'
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndicating...', STATUS_PENDING)
                    yarnInstallUnixLike()
                    nodeRun('./scripts/distro-syndicate.js --non-interactive')
                }
                milestone 6
            }
            post {
                success {
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndicated', STATUS_SUCCESS)
                }
                failure {
                    setBuildStatus(CONTEXT_SYNDICATION, 'syndication failed', STATUS_FAILURE)
                }
            }
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
