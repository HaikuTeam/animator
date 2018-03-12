const { URL, URLSearchParams } = require('url')
const request = require('request')
const fse = require('haiku-fs-extra')
const logger = require('../utils/LoggerInstance')
const randomAlphabetical = require('../utils/randomAlphabetical')

const API_BASE = 'https://wild-api.figma.com/v1/'
const FIGMA_URL = 'https://wild.figma.com/'
const FIGMA_CLIENT_ID = 'VoKSpy2DqppAK4D3b2tO8J'
const VALID_TYPES = {
  SLICE: 'SLICE',
  GROUP: 'GROUP',
}
const FOLDERS = {
  [VALID_TYPES.SLICE]: 'slices/',
  [VALID_TYPES.GROUP]: 'groups/',
}

class Figma {
  constructor({ token, requestLib = request }) {
    this.token = token
    this.requestLib = requestLib
  }

  importSVG(URL) {
    const {id, name} = this.parseProjectURL(URL)

    logger.info('[figma] about to import document with id ' + id)

    return this.fetchDocument(id)
      .then((document) => this.findInstantiableElements(document))
      .then((elements) => this.getSVGLinks(elements, id))
      .then((elements) => this.getSVGContents(elements))
      .then((elements) => this.writeSVGInDisk(elements, id, name))
  }

  fetchDocument(id) {
    const uri = API_BASE + 'files/' + id
    return this.request({ uri })
  }

  writeSVGInDisk(elements, id, name) {
    logger.info('[figma] writing SVGs in disk')

    const abspath =
      `/Users/roperzh/.haiku/projects/robertodip/japan/designs/${id}-${name}.figma`

    const assetBaseFolder = abspath + '.contents/'
    fse.emptyDirSync(assetBaseFolder)

    const sliceFolder = assetBaseFolder + 'slices/'
    fse.mkdirpSync(sliceFolder)

    const groupFolder = assetBaseFolder + 'groups/'
    fse.mkdirpSync(groupFolder)

    return Promise.all(
      elements.map((element) => {
        const path =
          assetBaseFolder + FOLDERS[element.type] + element.name + '.svg'
        return fse.writeFile(path, element.svg)
      })
    )
  }

  writeFile() {}

  getSVGContents(elements) {
    logger.info('[figma] downloading SVGs from cloud')

    const requests = elements.map((element) => {
      return new Promise((resolve, reject) => {
        this.request({ uri: element.svgURL, auth: false }).then((svg) => {
          resolve(Object.assign(element, {svg}))
        })
        .catch(reject)
      })
    })

    return Promise.all(requests)
  }

  getSVGLinks(elements, id) {
    return new Promise((resolve, reject) => {
      const ids = elements.map((element) => element.id)
      const params = new URLSearchParams([['format', 'svg'], ['ids', ids]])
      const uri = API_BASE + 'images/' + id + '?' + params.toString()
      this.request({ uri })
        .then((SVGLinks) => {
          // TODO: links comes with an error param, we should check that
          const {images} = JSON.parse(SVGLinks)
          const elementsWithLinks = elements.map((element) => {
            return Object.assign(element, {svgURL: images[element.id]})
          })

          resolve(elementsWithLinks)
        })
        .catch(reject)
    })
  }

  findItems(arr) {
    const result = []

    for (let item of arr) {
      if (VALID_TYPES[item.type]) {
        result.push({ id: item.id, name: item.name, type: item.type })
      } else if (item.children) {
        result.push(...this.findItems(item.children))
      }
    }

    return result
  }

  findInstantiableElements(rawFile) {
    const file = JSON.parse(rawFile)
    return this.findItems(file.document.children)
  }

  request({ uri, auth = true }) {
    const headers = auth ? { Authorization: 'Bearer ' + this.token } : {}

    return new Promise((resolve, reject) => {
      this.requestLib({ uri, headers }, (error, response, body) => {
        error ? reject(error) : resolve(body)
      })
    })
  }

  /*
   * https://www.figma.com/file/QJFJhrm0QKDgWQoZeiTv0Y/Sample-File
   * @argument {string} rawURL
   */
  parseProjectURL(rawURL) {
    logger.info('[figma] parsing project URL: ' + rawURL)

    const url = new URL(rawURL)
    const [_, __, id, name] = url.pathname.split('/')

    if (!id || !name) {
      throw new Error('Invalid URL')
    }

    return { id, name }
  }

  static buildFigmaLink(fileID) {
    return `${FIGMA_URL}/file/${fileID}`
  }

  static buildAuthenticationLink() {
    const state = randomAlphabetical(15)
    const redirectURI = `haiku://oauth/figma&scope=file_read&state=${state}&response_type=code`
    const url = `${FIGMA_URL}/oauth?client_id=${FIGMA_CLIENT_ID}&redirect_uri=${redirectURI}`
    return {url, state}
  }
}

module.exports = Figma
