const {URL} = require('url')
const tape = require('tape')
const {Figma, FIGMA_DEFAULT_FILENAME} = require('./../../src/bll/Figma')
const SampleFileFixture = require('../fixtures/figma/sample-file.json')
const SampleImageResponseFixture = require('../fixtures/figma/images.json')

const token = 'Rs1Ajdgb4hgmWbKcsahi2U2xtRevBqG-kipftTeZ'
const fileKey = 'DwxTPCNWQZJyU3X44CH3DQpT'

tape('Figma.parseProjectURL parses an URL and returns an object with the id and the name of a Figma project', (t) => {
  const parsedURL = Figma.parseProjectURL(`https://www.figma.com/file/${fileKey}/Sample-File`)

  t.equal(typeof parsedURL, 'object', 'the parsed URL is an object')
  t.equal(parsedURL.name, 'Sample-File', 'the parsed URL contains the file name under the "name" key')
  t.equal(parsedURL.id, fileKey, 'the parsed URL contains the id of the file')
  t.end()
})

tape('Figma.parseProjectURL returns null if the URL can\'t be parsed properly', (t) => {
  t.notOk(Figma.parseProjectURL('https://www.figma.com/'))
  t.notOk(Figma.parseProjectURL('asdfasd'))
  t.end()
})

tape('Figma.parseProjectURL allows URLs without project names', (t) => {
  const parsedURL = Figma.parseProjectURL(`https://www.figma.com/file/${fileKey}`)

  t.equal(typeof parsedURL, 'object', 'the parsed URL is an object')
  t.equal(parsedURL.name, FIGMA_DEFAULT_FILENAME, 'the parsed URL contains the default filename')
  t.equal(parsedURL.id, fileKey, 'the parsed URL contains the id of the file')
  t.end()
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
  const sliceKey = '5:0'
  const groupKey = '8:0'
  const subgroupKey = '9:0'
  const figma = new Figma({token})
  const elements = figma.findInstantiableElements(SampleFileFixture)

  t.ok(Array.isArray(elements), 'returns an array of elements')
  t.equal(elements.length, 6, 'returns an array that includes all elements required to be found')
  t.equal(elements[0].id, groupKey, 'includes elements of type GROUP')
  t.equal(elements[1].id, subgroupKey, 'includes subgroup elements of type GROUP')
  t.equal(elements[2].id, sliceKey, 'includes elements of type SLICE')
  t.equal(elements[2].name, 'Slice', 'passes through first unique instances of element names')
  t.equal(elements[3].name, 'Slice Copy 1', 'renames duplicately named slices to allow async fetch/write')
  t.equal(elements[4].name, 'Frame', 'includes frame elements')
  t.equal(elements[5].name, 'Component', 'includes component elements')
  t.end()
})

tape('Figma.getSVGLinks', async (t) => {
  t.plan(3)

  try {
    const figma = new Figma({token, requestLib: ({uri}, callback) => {
      callback(null, {statusCode: 200}, JSON.stringify(SampleImageResponseFixture))
    }})

    const elements = figma.findInstantiableElements(SampleFileFixture)
    const links = await figma.getSVGLinks(elements, fileKey)
    t.ok(Array.isArray(links), 'returns an array of elements')
    t.equal(links.length, elements.length, 'adds links to all elements')
    t.equal(links[0].svgURL, SampleImageResponseFixture.images[elements[0].id], 'adds the correct link to elements')
  } catch (e) {
    t.error(e)
  }
})

tape('Figma.buildAuthenticationLink', (t) => {
  const {url, state} = Figma.buildAuthenticationLink(fileKey)
  const parsedURL = new URL(url)
  const redirectURI = new URL(parsedURL.searchParams.get('redirect_uri'))

  t.equal(parsedURL.pathname, `/oauth`, 'points to the /oauth path in Figma')
  t.equal(redirectURI.protocol, 'haiku:', 'redirect_uri uses the haiku:// protocol')
  t.ok(url.includes(state), 'url includes the returned state')
  t.end()
})

tape('Figma.buildFigmaLink', (t) => {
  const url = Figma.buildFigmaLink(fileKey)

  t.ok(url.includes(`/file/${fileKey}`), 'builds a link to the figma file')
  t.end()
})

tape('Figma.isFigmaFile', (t) => {
  const figmaPath = `/designs/${fileKey}-something.figma`
  const otherPath = '/something/else.sketch'

  t.ok(Figma.isFigmaFile(figmaPath), 'returns true if the path basename ends with .figma')
  t.notOk(Figma.isFigmaFile(otherPath), 'returns false if the path basename does not ends with .figma')
  t.end()
})

tape('Figma.isFigmaFolder', (t) => {
  const figmaPath = `/designs/${fileKey}-something.figma.contents/`
  const otherPath = '/something/else.sketch.contents/'

  t.ok(Figma.isFigmaFolder(figmaPath), 'returns true if the path is a figma folder')
  t.notOk(Figma.isFigmaFolder(otherPath), 'returns false if the path is not a figma folder')
  t.end()
})

tape('Figma.findIDFromPath', (t) => {
  const figmaPath = `/designs/${fileKey}-something.figma.contents/`
  const otherPath = '/something/else.sketch.contents/'

  t.equal(Figma.findIDFromPath(figmaPath), fileKey, 'returns the correct ID if an ID can be found')
  t.notOk(Figma.findIDFromPath(otherPath), 'returns a falsey value if it cannot find an ID')
  t.end()
})

tape('Figma.findDisplayNameFromPath', (t) => {
  const assetName = 'fournier'
  const validPath = `/designs/${fileKey}-${assetName}.figma.contents/`
  const invalidPath = `/designs/${fileKey}-.figma.contents/`

  t.equal(Figma.findDisplayNameFromPath(validPath), assetName, 'returns the correct name if a name can be found')
  t.equal(Figma.findDisplayNameFromPath(invalidPath), FIGMA_DEFAULT_FILENAME, 'returns the Figma default filename if the file name cannot be found')
  t.end()
})
