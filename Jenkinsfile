pipeline {
    agent none
    stages {
        // Sets up Node and Yarn at the correct versions.
        stage('Provision-macOS') {
            agent {
                label 'master'
            }
            steps {
                sh '''#!/bin/bash -x
                    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
                    . $HOME/.bash_profile
                    nvm install 8.9.3
                    nvm use 8.9.3
                    curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 1.3.2'''
            }
        }
        stage('Health') {
            parallel {
                stage('Lint') {
                    agent {
                        label 'master'
                    }
                    steps {
                        yarnInstallUnixLike()
                        yarnRun('lint-report')
                    }
                    post {
                        always {
                            checkstyle()
                        }
                    }
                }
                stage('Test-macOS') {
                    agent {
                        label 'master'
                    }
                    steps {
                        yarnInstallUnixLike()
                        yarnRun('compile-all')
                        yarnRun('test-report')
                    }
                    post {
                        always {
                            step([
                                    $class: 'TapPublisher',
                                    testResults: 'packages/**/test-result.tap',
                                    verbose: true,
                                    planRequired: true
                            ])
                        }
                    }
                }
            }
        }
        stage('Build-macOS') {
            agent {
                label 'master'
            }
            steps {
                yarnInstallUnixLike()
                nodeRun('./scripts/distro-configure.js --non-interactive')
                nodeRun('./scripts/distro-download-secrets.js')
                nodeRun('./scripts/distro-prepare.js')
                nodeRun('./scripts/distro-build.js')
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/*.dmg, dist/*-mac.zip', fingerprint: true
                }
            }
        }
    }
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

void yarnRun(String command) {
    sh '''#!/bin/bash -x
        . $HOME/.bash_profile
        ''' + "yarn ${command}"
}
