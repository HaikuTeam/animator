import * as tape from 'tape';
import autoUpdate from '@creator/utils/autoUpdate';

const options = {
  server: 'https://server.com',
  environment: 'test',
  branch: 'master',
  platform: 'macOS',
  version: '1.0.1'
}

tape('autoUpdate #generateURL generates an expected URL', (t) => {
  let url

  url = 'https://server.com/updates/latest?environment=test&branch=master&platform=macOS&version=1.0.1'
  t.equal(autoUpdate.generateURL(options), url, 'is the expected URL')

  let modifiedOpts = {...options, environment: 'production', branch: 'staging'}
  url = 'https://server.com/updates/latest?environment=production&branch=staging&platform=macOS&version=1.0.1'
  t.equal(autoUpdate.generateURL(modifiedOpts), url, 'is the expected URL')

  t.end()
})

tape('autoUpdate #checkUpdates returns the proper tuple if not updates are available', async (t) => {
  let stubbedAutoUpdate = stub(autoUpdate, 'checkServer', async () => {
    return { status: 204, message: '' }
  })

  let {shouldUpdate, url} = await stubbedAutoUpdate.checkUpdates()

  t.notOk(shouldUpdate, 'first item on the tuple is false')
  t.equal(url, null, 'second item on the tuple is null')

  t.end()
})

tape('autoUpdate #checkUpdates returns the proper tuple if there is an update', async (t) => {
  let stubbedAutoUpdate = stub(autoUpdate, 'checkServer', async () => {
    return { status: 200, url: 'http://test.com' }
  })

  let {shouldUpdate, url} = await stubbedAutoUpdate.checkUpdates()

  t.ok(shouldUpdate, 'first item on the tuple is true')
  t.equal(url, 'http://test.com','second item on the tuple is an url')

  t.end()
})

tape('autoUpdate #update throws an error if does not have the correct env variables', async (t) => {
  try {
    await autoUpdate.update()
    t.fail('should throw error')
  } catch (err) {
    t.equal(err.message, 'Missing release/autoupdate environment variables', 'throws w/correct error')
  }

  t.end()
})

tape('autoUpdate #update does nothing if process.env.HAIKU_SKIP_AUTOUPDATE is set', async (t) => {
  try {
    process.env.HAIKU_SKIP_AUTOUPDATE = '1'
    await autoUpdate.update()
    t.pass('autoUpdate#update is not executed')
  } catch (err) {
    t.fail('should not throw errors')
  }

  t.end()
})

function stub (object, functionName, stub) {
  return { ...object, [functionName]: stub }
}
