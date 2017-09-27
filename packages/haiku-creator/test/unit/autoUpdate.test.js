const test = require('tape')
const autoUpdate = require('../../src/utils/autoUpdate')

const options = {
  server: 'https://server.com',
  environment: 'test',
  branch: 'master',
  platform: 'macOS',
  version: '1.0.1'
}

test('autoUpdate #generateURL generates an expected URL', (t) => {
  let url

  url = 'https://server.com/updates/latest?environment=test&branch=master&platform=macOS&version=1.0.1'
  t.equal(autoUpdate.generateURL(options), url)

  url = 'https://server.com/updates/latest?environment=production&branch=staging&platform=macOS&version=1.0.1'
  t.equal(autoUpdate.generateURL({...options, environment: 'production', branch: 'staging'}), url)

  t.end()
})
