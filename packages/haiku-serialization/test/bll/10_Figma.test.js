const tape = require('tape')
const Figma = require('./../../src/bll/Figma')
const SampleFileFixture = require('../fixtures/figma/sample-file.json')
const SampleImageResponseFixture = require('../fixtures/figma/images.json')

const token = 'Rs1Ajdgb4hgmWbKcsahi2U2xtRevBqG-kipftTeZ'
const fileKey = 'DwxTPCNWQZJyU3X44CH3DQpT'

tape('Figma.parseProjectURL parses an URL and returns an object with the key and the name of a Figma project', (t) => {
  t.plan(3)

  const parsedURL = Figma.parseProjectURL(`https://www.figma.com/file/${fileKey}/Sample-File`)

  t.equal(typeof parsedURL, 'object', 'the parsed URL is an object')
  t.equal(parsedURL.name, 'Sample-File', 'the parsed URL contains the file name under the "name" key')
  t.equal(parsedURL.key, fileKey, 'the parsed URL contains the key of the file')
})

tape('Figma.parseProjectURL throws an error if the URL can\'t be parsed properly', (t) => {
  t.plan(1)

  t.throws(() => { Figma.parseProjectURL('https://www.figma.com/') })
})

tape('Figma.request makes a proper request', (t) => {
  t.plan(2)

  const figma = new Figma({token, requestLib: function({uri, headers}) {
    t.ok(headers.Authorization.includes(token), 'headers includes the correct token')
    t.ok(uri.includes(fileKey), 'URI is correct')
  }})

  figma.request({uri: fileKey})
})

tape('Figma.request allows a param to disable authentication', (t) => {
  t.plan(1)

  const figma = new Figma({token, requestLib: function({uri, headers}) {
    t.notOk(headers.Authorization, 'headers do not include a token')
  }})

  figma.request({uri: fileKey, auth: false})
})

tape('Figma.findInstantiableElements', (t) => {
  t.plan(4)

  const sliceKey = '5:0'
  const groupKey = '8:0'
  const figma = new Figma({token})
  const elements = figma.findInstantiableElements(JSON.stringify(SampleFileFixture))

  t.ok(Array.isArray(elements), 'returns an array of elements')
  t.equal(elements.length, 3, 'returns an array that includes all elements required to be finded')
  t.equal(elements[0].id, groupKey, 'includes elements of type SLICE')
  t.equal(elements[1].id, sliceKey, 'includes elements of type GROUP')
})

tape('Figma.getSVGLinks', async (t) => {
  t.plan(3)

  try {
    const figma = new Figma({token, requestLib: ({uri}, callback) => {
      callback(null, "", JSON.stringify(SampleImageResponseFixture))
    }})

    const elements = figma.findInstantiableElements(JSON.stringify(SampleFileFixture))
    const links = await figma.getSVGLinks(fileKey, elements)

    t.ok(Array.isArray(links), 'returns an array of elements')
    t.equal(links.length, elements.length, 'adds links to all elements')
    t.equal(links[0].svgURL, SampleImageResponseFixture.images[elements[0].id], 'adds the correct link to elements')
  } catch (e) {
    t.error(e)
  }
})
