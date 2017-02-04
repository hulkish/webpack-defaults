const { yaml } = require('mrm-core');

module.exports = () => {
  // .travis.yml
  yaml('.travis.yml')
    .merge({
      sudo: false,
      language: 'node_js',
      branches: {
        only: [
          'master',
        ],
      },
      matrix: {
        fast_finish: true,
      },
      before_install: [
        'nvm --version',
        'node --version',
      ],
      before_script: [
        'if [ "$WEBPACK_VERSION" ]; then yarn add webpack@^$WEBPACK_VERSION; fi',
        'if [ "$BITHOUND_CHECK" ]; then npm install -g bithound; bithound check git@github.com:$TRAVIS_REPO_SLUG.git; fi',
      ],
      script: [
        'yarn run travis:$JOB_PART',
      ],
      after_success: [
        'bash <(curl -s https://codecov.io/bash)',
      ],
    })
    // Overwrite
    .set('matrix.include', [
      {
        os: 'linux',
        node_js: '7',
        env: 'WEBPACK_VERSION="2.2.0" BITHOUND_CHECK=true JOB_PART=lint',
      },
      {
        os: 'linux',
        node_js: '4.3',
        env: 'WEBPACK_VERSION="2.2.0" JOB_PART=test',
      },
      {
        os: 'linux',
        node_js: '6',
        env: 'WEBPACK_VERSION="2.2.0" JOB_PART=test',
      },
      {
        os: 'linux',
        node_js: '7',
        env: 'WEBPACK_VERSION="2.2.0" JOB_PART=coverage',
      },
    ])
    .save()
  ;
};
