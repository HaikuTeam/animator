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
  t.equal(autoUpdate.generateURL(options), url, 'is the expected URL')

  url = 'https://server.com/updates/latest?environment=production&branch=staging&platform=macOS&version=1.0.1'
  t.equal(autoUpdate.generateURL({...options, environment: 'production', branch: 'staging'}), url, 'is the expected URL')

  t.end()
})

test('autoUpdate #checkUpdates returns [false, null] if not updates are available', async (t) => {
  let stubbedAutoUpdate = stub(autoUpdate, 'checkServer', async () => {
    return { status: 204, message: '' }
  })

  let [shouldUpdate, url] = await stubbedAutoUpdate.checkUpdates()

  t.notOk(shouldUpdate, 'first item on the tuple is false')
  t.equal(url, null, 'second item on the tuple is null')

  t.end()
})

test('autoUpdate #checkUpdates returns [true, url] if there is an update', async (t) => {
  let stubbedAutoUpdate = stub(autoUpdate, 'checkServer', async () => {
    return { status: 200, url: 'http://test.com' }
  })

  let [shouldUpdate, url] = await stubbedAutoUpdate.checkUpdates()

  t.ok(shouldUpdate, 'first item on the tuple is true')
  t.equal(url, 'http://test.com','second item on the tuple is an url')

  t.end()
})

function stub (object, functionName, stub) {
  return { ...object, [functionName]: stub }
}
